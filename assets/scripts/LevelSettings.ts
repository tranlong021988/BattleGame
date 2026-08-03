import {
    _decorator,
    Component,
    director,
    sys,
} from 'cc';
import { GameManager } from './GameManager';
import type {
    BattleProgressionProvider,
} from './GameManager';
import { BattleArmyBrain } from './BattleArmyBrain';
import {
    UnitFamily,
    unitFamilyToName,
} from './BattleTypes';
import { UnitPrefabEntry } from './BattleUnitDatabase';

const { ccclass, property } = _decorator;

type PurchaseKind =
    'unit-unlock' |
    'unit-count' |
    'initial-cp' |
    'max-alive';

interface SavedUnitProgression {
    key: string;
    offered: boolean;
    unlocked: boolean;
    unitCount: number;
}

interface SavedProgressionState {
    version: number;
    currentLevel: number;
    playerGold: number;
    adsReward: number;
    levelLossCount: number;
    lossGoldLevel: number;
    lossGoldClaimed: number;
    playerInitialCP: number;
    playerInitialCPPackagesPurchased: number;
    playerMaxAlive: number;
    totalPurchases: number;
    units: SavedUnitProgression[];
}

interface PurchaseOption {
    id: string;
    kind: PurchaseKind;
    cost: number;
    family: UnitFamily | null;
    tier: number;
    delta: number;
    label: string;
}

interface PurchaseRecord {
    id: string;
    kind: PurchaseKind;
    label: string;
    family: number | null;
    familyName: string;
    tier: number;
    cost: number;
    goldBefore: number;
    goldAfter: number;
    valueBefore: number;
    valueAfter: number;
    source: string;
}

@ccclass('UnitProgressionRule')
export class UnitProgressionRule {

    @property({ type: UnitFamily })
    family: UnitFamily = UnitFamily.Spear;

    @property({ min: 1, max: 3, step: 1 })
    tier = 1;

    @property({ min: 1, step: 1 })
    unlockLevel = 1;

    @property({ min: 1, step: 1 })
    unlockCount = 5;

    @property({ min: 1, step: 1 })
    maxCount = 10;
}

function createUnitProgressionRule(
    family: UnitFamily,
    unlockLevel: number,
    unlockCount: number,
    maxCount: number
) {
    const rule = new UnitProgressionRule();

    rule.family = family;
    rule.unlockLevel = unlockLevel;
    rule.unlockCount = unlockCount;
    rule.maxCount = maxCount;

    return rule;
}

@ccclass('LevelSettings')
export class LevelSettings extends Component
    implements BattleProgressionProvider {

    @property({
        tooltip: 'Total campaign levels used to normalize difficulty from level 1 to the final level.'
    })
    totalLevels = 300;

    @property({
        tooltip: 'Current campaign level. Level 1 is easiest; Total Levels is hardest.'
    })
    currentLevel = 1;

    @property({
        min: 0,
        step: 1,
        tooltip: 'Every Nth level is a boss fight. Use 0 to disable boss fights.'
    })
    bossStagePace = 5;

    @property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Initial CP Multiplier',
        tooltip: 'Multiplier applied only to enemy Initial CP on boss levels. Initial CP is not capped.'
    })
    bossInitialCombatPointMultiplier = 1.2;

    @property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Decision Accuracy Multiplier',
        tooltip: 'Multiplier applied only to enemy Decision Accuracy on boss levels. The result remains capped by Decision Accuracy Max.'
    })
    bossDecisionAccuracyMultiplier = 1.2;

    @property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Max Alive Waves Multiplier',
        tooltip: 'Multiplier applied only to enemy Max Alive Waves on boss levels. The result remains capped by Max Alive Waves Max.'
    })
    bossMaxAliveWavesMultiplier = 1.2;

    @property({
        tooltip: 'Team affected by the automatic CP, accuracy, and Max Alive curves.'
    })
    targetTeam = 1;

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property({ type: [BattleArmyBrain] })
    battleArmyBrains: BattleArmyBrain[] = [];

    @property({
        tooltip: 'Apply initial Combat Point curve to the selected team.'
    })
    allowCP = true;

    @property
    initialCombatPointMin = 600;

    @property
    initialCombatPointMax = 1040;

    @property({
        tooltip: 'Apply the AI decision accuracy curve. Accuracy affects unit choice only; target and lane selection stay tactical.'
    })
    allowDecisionAccuracy = true;

    @property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at level 1.'
    })
    decisionAccuracyMin = 0.4;

    @property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at the final level.'
    })
    decisionAccuracyMax = 1;

    @property({
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
    })
    allowInterval = true;

    @property({ displayName: 'Easy Spawn Delay Min' })
    minSpawnIntervalMinLevel = 5.0;

    @property({ displayName: 'Easy Spawn Delay Max' })
    maxSpawnIntervalMinLevel = 6.0;

    @property({ displayName: 'Hard Spawn Delay Min' })
    minSpawnIntervalMaxLevel = 2.7;

    @property({ displayName: 'Hard Spawn Delay Max' })
    maxSpawnIntervalMaxLevel = 3.7;

    @property({
        tooltip: 'Apply Max Alive Waves curve. Higher levels allow the enemy to keep more waves active.'
    })
    allowMaxWave = true;

    @property
    maxAliveWavesMin = 5;

    @property
    maxAliveWavesMax = 15;

    @property({
        displayName: 'Enable Campaign Progression',
        tooltip: 'Apply unit unlocks, enemy unit-count growth, player gold, purchases, persistence, and retry rewards.'
    })
    enableProgression = true;

    @property({
        tooltip: 'Reload browser preview after each campaign battle. A win advances one level; a loss retries the same level.'
    })
    autoReloadProgression = true;

    @property({
        tooltip: 'Let BattleArmyBrain A simulate player purchases between battles. It may buy multiple affordable packages.'
    })
    purchasingSimulation = true;

    @property({
        tooltip: 'Persistent campaign storage key. Use currentLevel=0 in the URL to clear this state before level 1.'
    })
    progressionStorageKey = 'battle-progression-v3';

    @property({ min: 0, step: 1 })
    initialPlayerGold = 0;

    @property({ min: 0, step: 1 })
    playerInitialCPStart = 300;

    @property({
        min: 0,
        max: 1,
        step: 0.05,
        displayName: 'Player CP Boss Growth Ratio',
        tooltip: 'Each boss unlocks an Initial CP package equal to this share of the enemy CP increase since the previous boss.'
    })
    playerInitialCPBossGrowthRatio = 0.5;

    @property({ min: 1, step: 1 })
    playerInitialCPMax = 1248;

    @property({ min: 0, step: 1 })
    playerMaxAliveStart = 4;

    @property({ min: 0, step: 1 })
    playerMaxAliveMax = 10;

    @property({ min: 0.01, step: 0.1 })
    winGoldPerEnemyCP = 1;

    @property({ min: 0, max: 1, step: 0.05 })
    lossGoldRatio = 0.25;

    @property({ min: 0, max: 1, step: 0.05 })
    maxLossGoldRatioPerLevel = 0.75;

    @property({ min: 1, step: 1 })
    lossesPerVideoReward = 5;

    @property({ min: 1, step: 1 })
    unitUnlockCostMultiplier = 20;

    @property({ min: 0.01, step: 0.1 })
    initialCPGoldPerPoint = 10;

    @property({ min: 1, step: 1 })
    maxAliveBasePrice = 1000;

    @property({ type: [UnitProgressionRule] })
    unitProgressionRules: UnitProgressionRule[] = [
        createUnitProgressionRule(
            UnitFamily.Spear,
            1,
            5,
            10
        ),
        createUnitProgressionRule(
            UnitFamily.Sword,
            1,
            5,
            10
        ),
        createUnitProgressionRule(
            UnitFamily.Axeman,
            10,
            5,
            10
        ),
        createUnitProgressionRule(
            UnitFamily.Archer,
            25,
            3,
            5
        ),
        createUnitProgressionRule(
            UnitFamily.Cavalry,
            35,
            5,
            10
        ),
        createUnitProgressionRule(
            UnitFamily.Monk,
            45,
            1,
            1
        ),
    ];

    private progressionState:
        SavedProgressionState | null = null;
    private battleLevel = 1;
    private nextBattleUrl = '';
    private levelQueryActive = false;
    private resetProgressionRequested = false;
    private preBattlePurchases: PurchaseRecord[] = [];

    onLoad() {
        this.applyTelemetryLevelQuery();

        if (this.resetProgressionRequested) {
            sys.localStorage.removeItem(
                this.progressionStorageKey
            );
        }

        const manager = this.getGameManager();

        if (manager) {
            manager.battleProgressionProvider = this;
        }

        if (this.enableProgression) {
            this.initializeProgression();
        }

        this.applyLevelSettings();

        if (this.enableProgression) {
            this.completePreBattleProgression();
        }
    }

    onDestroy() {
        const manager = this.getGameManager();

        if (
            manager &&
            manager.battleProgressionProvider === this
        ) {
            manager.battleProgressionProvider = null;
        }
    }

    public applyLevelSettings() {
        const team = this.clampTeam(this.targetTeam);
        const t = this.getDifficulty01();
        const boss = this.isBossLevel();
        const manager = this.getGameManager();
        const brains = this.getTargetBattleArmyBrains(team);

        if (
            this.allowCP &&
            manager &&
            manager.unitDatabase
        ) {
            const cp = this.getLevelInitialCP(
                this.getSafeCurrentLevel()
            );

            if (team === 0) {
                manager.unitDatabase.teamAInitialCombatPoint = cp;
            } else {
                manager.unitDatabase.teamBInitialCombatPoint = cp;
            }

            manager.initialCombatPoint[team] = cp;
            manager.combatPoint[team] = cp;
        }

        for (let i = 0; i < brains.length; i++) {
            const brain = brains[i];

            if (!brain) continue;

            if (this.allowDecisionAccuracy) {
                const baseAccuracy = this.lerp(
                    this.decisionAccuracyMin,
                    this.decisionAccuracyMax,
                    t
                );

                brain.decisionAccuracy = Math.min(
                    this.clamp01(this.decisionAccuracyMax),
                    this.clamp01(
                        baseAccuracy *
                        this.getBossMultiplier(
                            this.bossDecisionAccuracyMultiplier,
                            boss
                        )
                    )
                );
            }

            if (this.allowInterval) {
                brain.minSpawnInterval = this.lerp(
                    this.minSpawnIntervalMinLevel,
                    this.minSpawnIntervalMaxLevel,
                    t
                );
                brain.maxSpawnInterval = this.lerp(
                    this.maxSpawnIntervalMinLevel,
                    this.maxSpawnIntervalMaxLevel,
                    t
                );
            }

            if (this.allowMaxWave) {
                const baseMaxAlive = Math.round(
                    this.lerp(
                        this.maxAliveWavesMin,
                        this.maxAliveWavesMax,
                        t
                    )
                );

                brain.maxAliveWaves = Math.round(
                    Math.min(
                        Math.max(0, this.maxAliveWavesMax),
                        baseMaxAlive *
                        this.getBossMultiplier(
                            this.bossMaxAliveWavesMultiplier,
                            boss
                        )
                    )
                );
            }
        }
    }

    public handleBattleResult(
        winnerTeam: number,
        loserTeam: number,
        reason: string
    ) {
        if (
            !this.enableProgression ||
            !this.progressionState
        ) {
            return null;
        }

        const state = this.progressionState;
        const battleLevel = this.battleLevel;
        const before = this.createTelemetrySnapshot();
        const purchases: PurchaseRecord[] = [];
        const newlyOffered =
            this.offerIntroducedUnits(battleLevel);
        const manager = this.getGameManager();
        const enemyCP = manager
            ? Math.max(0, manager.initialCombatPoint[1])
            : 0;
        const winGold = Math.max(
            0,
            Math.round(
                enemyCP *
                Math.max(0, this.winGoldPerEnemyCP)
            )
        );

        let goldReward = 0;
        let rescueGold = 0;
        let videoRewardTriggered = false;
        let rescueActions: string[] = [];
        const validPlayerLoss = loserTeam === 0 &&
            this.isValidPlayerLoss(reason);

        if (winnerTeam === 0) {
            goldReward = winGold;
            state.playerGold += goldReward;
            state.levelLossCount = 0;
            state.lossGoldLevel = 0;
            state.lossGoldClaimed = 0;
        } else if (loserTeam === 0) {
            state.levelLossCount++;

            if (validPlayerLoss) {
                goldReward =
                    this.grantCappedLossGold(
                        state,
                        battleLevel,
                        winGold
                    );
            }

            if (
                state.levelLossCount >=
                Math.max(
                    1,
                    Math.floor(this.lossesPerVideoReward)
                )
            ) {
                state.adsReward++;
                state.levelLossCount = 0;
                videoRewardTriggered = true;

                const rescuePlan =
                    this.createRescuePlan();

                rescueActions =
                    rescuePlan.actionIds.slice();
                rescueGold = Math.max(
                    0,
                    rescuePlan.totalCost -
                    state.playerGold
                );
                state.playerGold += rescueGold;

                if (this.purchasingSimulation) {
                    this.executePreferredPurchases(
                        rescuePlan.actionIds,
                        purchases,
                        'video-rescue'
                    );
                }
            }
        }

        if (this.purchasingSimulation) {
            this.runPurchaseSimulation(
                purchases,
                'between-battles'
            );
        }

        let campaignComplete = false;

        if (winnerTeam === 0) {
            if (battleLevel >= this.getSafeTotalLevels()) {
                campaignComplete = true;
                state.currentLevel = this.getSafeTotalLevels();
            } else {
                state.currentLevel = battleLevel + 1;
            }
        } else {
            state.currentLevel = battleLevel;
        }

        this.currentLevel = state.currentLevel;
        this.applyProgressionRuntimeState(false);
        this.saveProgressionState();
        this.nextBattleUrl = campaignComplete
            ? ''
            : this.buildProgressionUrl(state.currentLevel);

        const result = {
            battleLevel,
            totalLevels: this.getSafeTotalLevels(),
            winnerTeam,
            loserTeam,
            reason,
            campaignComplete,
            winGold,
            goldReward,
            validPlayerLoss,
            rescueGold,
            videoRewardTriggered,
            rescueActions,
            newlyOffered,
            purchases,
            before,
            after: this.createTelemetrySnapshot(),
        };

        return result;
    }

    public createTelemetrySnapshot() {
        if (
            !this.enableProgression ||
            !this.progressionState
        ) {
            return {
                enabled: false,
            };
        }

        const state = this.progressionState;
        const manager = this.getGameManager();
        const enemyBrain =
            this.getFirstBrainForTeam(1);
        const playerBrain =
            this.getFirstBrainForTeam(0);

        return {
            enabled: true,
            storageVersion: state.version,
            currentLevel: state.currentLevel,
            battleLevel: this.battleLevel,
            totalLevels: this.getSafeTotalLevels(),
            isBossLevel: this.isBossLevelFor(
                this.battleLevel
            ),
            purchasingSimulation:
                this.purchasingSimulation,
            settings: {
                playerInitialCPStart:
                    this.getPlayerCPStart(),
                playerInitialCPBossGrowthRatio:
                    this.getPlayerCPBossGrowthRatio(),
                playerInitialCPMax:
                    this.getPlayerCPMax(),
                playerInitialCPMilestoneCap:
                    this.getPlayerCPMilestoneCap(
                        this.battleLevel
                    ),
                playerCPPackagesUnlocked:
                    this.getPlayerCPPackagesUnlocked(
                        this.battleLevel
                    ),
                nextPlayerCPPackage:
                    this.getNextPlayerCPPackageSnapshot(
                        state,
                        this.battleLevel
                    ),
                unitProgressionEndLevel:
                    this.getUnitProgressionEndLevel(),
                playerMaxAliveStart:
                    this.getPlayerMaxAliveStart(),
                playerMaxAliveMax:
                    this.getPlayerMaxAliveMax(),
                playerMaxAliveMilestoneCap:
                    this.getPlayerMaxAliveMilestoneCap(
                        this.battleLevel
                    ),
                winGoldPerEnemyCP:
                    this.winGoldPerEnemyCP,
                lossGoldRatio: this.lossGoldRatio,
                maxLossGoldRatioPerLevel:
                    this.maxLossGoldRatioPerLevel,
                lossesPerVideoReward:
                    this.lossesPerVideoReward,
                unitUnlockCostMultiplier:
                    this.unitUnlockCostMultiplier,
                initialCPGoldPerPoint:
                    this.initialCPGoldPerPoint,
                maxAliveBasePrice:
                    this.maxAliveBasePrice,
            },
            preBattlePurchases:
                this.preBattlePurchases.slice(),
            player: {
                gold: state.playerGold,
                adsReward: state.adsReward,
                levelLossCount: state.levelLossCount,
                lossGoldClaimed:
                    state.lossGoldClaimed,
                initialCP: state.playerInitialCP,
                cpPackagesPurchased:
                    this.getPlayerCPPackagesPurchased(
                        state
                    ),
                maxAlive: state.playerMaxAlive,
                decisionAccuracy:
                    playerBrain
                        ? playerBrain.decisionAccuracy
                        : null,
                totalPurchases: state.totalPurchases,
            },
            enemy: {
                initialCP:
                    manager
                        ? manager.initialCombatPoint[1]
                        : null,
                maxAlive:
                    enemyBrain
                        ? enemyBrain.maxAliveWaves
                        : null,
                decisionAccuracy:
                    enemyBrain
                        ? enemyBrain.decisionAccuracy
                        : null,
            },
            units: this.createUnitProgressionSnapshot(),
            availablePurchases:
                this.getPurchaseOptions(state)
                    .map((option) => ({
                        id: option.id,
                        kind: option.kind,
                        label: option.label,
                        cost: option.cost,
                        affordable:
                            option.cost <= state.playerGold,
                    })),
        };
    }

    public shouldAutoReloadAfterBattle() {
        return this.enableProgression &&
            this.autoReloadProgression;
    }

    public getNextBattleUrl() {
        return this.nextBattleUrl;
    }

    private initializeProgression() {
        const loaded = this.loadProgressionState();

        this.progressionState = loaded
            ? this.sanitizeProgressionState(loaded)
            : this.createInitialProgressionState();

        if (this.levelQueryActive) {
            this.progressionState.currentLevel =
                this.getSafeCurrentLevel();
        } else {
            this.currentLevel = this.clampLevel(
                this.progressionState.currentLevel
            );
        }

        this.battleLevel = this.getSafeCurrentLevel();
        this.progressionState.currentLevel = this.battleLevel;

        if (
            this.progressionState.lossGoldLevel !==
            this.battleLevel
        ) {
            this.progressionState.lossGoldLevel =
                this.battleLevel;
            this.progressionState.lossGoldClaimed = 0;
            this.progressionState.levelLossCount = 0;
        }

        this.offerUnitsFromEarlierLevels(
            this.battleLevel
        );
        this.applyProgressionRuntimeState(true);
        this.saveProgressionState();
    }

    private completePreBattleProgression() {
        if (!this.progressionState) return;

        if (this.purchasingSimulation) {
            this.runPurchaseSimulation(
                this.preBattlePurchases,
                'pre-battle'
            );
        }

        this.applyProgressionRuntimeState(true);
        this.saveProgressionState();
    }

    private createInitialProgressionState():
        SavedProgressionState {
        const units: SavedUnitProgression[] = [];

        for (
            let i = 0;
            i < this.unitProgressionRules.length;
            i++
        ) {
            const rule = this.unitProgressionRules[i];

            if (!rule) continue;

            const startsOwned =
                Math.floor(rule.unlockLevel) <= 1;

            units.push({
                key: this.getRuleKey(rule),
                offered: startsOwned,
                unlocked: startsOwned,
                unitCount: this.getRuleUnlockCount(rule),
            });
        }

        return {
            version: 3,
            currentLevel: this.getSafeCurrentLevel(),
            playerGold: Math.max(
                0,
                Math.floor(this.initialPlayerGold)
            ),
            adsReward: 0,
            levelLossCount: 0,
            lossGoldLevel: this.getSafeCurrentLevel(),
            lossGoldClaimed: 0,
            playerInitialCP: this.getPlayerCPStart(),
            playerInitialCPPackagesPurchased: 0,
            playerMaxAlive: this.getPlayerMaxAliveStart(),
            totalPurchases: 0,
            units,
        };
    }

    private sanitizeProgressionState(
        source: any
    ): SavedProgressionState {
        const initial =
            this.createInitialProgressionState();
        const savedUnits = Array.isArray(source.units)
            ? source.units
            : [];

        initial.currentLevel = this.clampLevel(
            this.safeInteger(
                source.currentLevel,
                initial.currentLevel
            )
        );
        initial.playerGold = Math.max(
            0,
            this.safeInteger(source.playerGold, 0)
        );
        initial.adsReward = Math.max(
            0,
            this.safeInteger(source.adsReward, 0)
        );
        initial.levelLossCount = Math.max(
            0,
            this.safeInteger(source.levelLossCount, 0)
        );
        initial.lossGoldLevel = this.clampLevel(
            this.safeInteger(
                source.lossGoldLevel,
                initial.currentLevel
            )
        );
        initial.lossGoldClaimed = Math.max(
            0,
            this.safeInteger(source.lossGoldClaimed, 0)
        );
        initial.playerInitialCPPackagesPurchased = Math.max(
            0,
            Math.min(
                this.getPlayerCPPackagesUnlocked(
                    this.getSafeTotalLevels()
                ),
                this.safeInteger(
                    source.playerInitialCPPackagesPurchased,
                    0
                )
            )
        );
        initial.playerInitialCP =
            this.getPlayerCPForPurchasedPackages(
                initial.playerInitialCPPackagesPurchased
            );
        initial.playerMaxAlive =
            this.clampPlayerMaxAlive(
                this.safeInteger(
                    source.playerMaxAlive,
                    initial.playerMaxAlive
                )
            );
        initial.totalPurchases = Math.max(
            0,
            this.safeInteger(source.totalPurchases, 0)
        );

        for (let i = 0; i < initial.units.length; i++) {
            const unit = initial.units[i];
            const saved = savedUnits.find(
                (candidate: any) =>
                    candidate &&
                    candidate.key === unit.key
            );
            const rule = this.getRuleByKey(unit.key);

            if (!saved || !rule) continue;

            unit.offered = !!saved.offered || unit.offered;
            unit.unlocked = !!saved.unlocked || unit.unlocked;
            unit.unitCount = Math.max(
                this.getRuleUnlockCount(rule),
                Math.min(
                    this.getRuleMaxCount(rule),
                    this.safeInteger(
                        saved.unitCount,
                        unit.unitCount
                    )
                )
            );
        }

        return initial;
    }

    private applyProgressionRuntimeState(
        syncCurrentCombatPoint: boolean
    ) {
        if (!this.progressionState) return;

        const manager = this.getGameManager();

        if (!manager || !manager.unitDatabase) return;

        const state = this.progressionState;

        for (
            let i = 0;
            i < this.unitProgressionRules.length;
            i++
        ) {
            const rule = this.unitProgressionRules[i];

            if (!rule) continue;

            const playerEntry = this.findEntryForRule(
                manager.unitDatabase.teamAUnits,
                rule
            );
            const enemyEntry = this.findEntryForRule(
                manager.unitDatabase.teamBUnits,
                rule
            );
            const playerUnit = this.getSavedUnit(
                state,
                this.getRuleKey(rule)
            );

            if (playerEntry && playerUnit) {
                playerEntry.unlocked = playerUnit.unlocked;
                playerEntry.unitCount = playerUnit.unitCount;
            }

            if (enemyEntry) {
                enemyEntry.unlocked =
                    this.battleLevel >=
                    this.getRuleUnlockLevel(rule);
                enemyEntry.unitCount =
                    this.getEnemyUnitCount(
                        rule,
                        this.battleLevel
                    );
            }
        }

        manager.unitDatabase.teamAInitialCombatPoint =
            state.playerInitialCP;

        if (syncCurrentCombatPoint) {
            manager.initialCombatPoint[0] =
                state.playerInitialCP;
            manager.combatPoint[0] =
                state.playerInitialCP;
        }

        const playerBrains =
            this.getTargetBattleArmyBrains(0);

        for (let i = 0; i < playerBrains.length; i++) {
            playerBrains[i].maxAliveWaves =
                state.playerMaxAlive;
        }
    }

    private getPurchaseOptions(
        state: SavedProgressionState
    ): PurchaseOption[] {
        const options: PurchaseOption[] = [];
        const manager = this.getGameManager();

        if (!manager || !manager.unitDatabase) {
            return options;
        }

        for (
            let i = 0;
            i < this.unitProgressionRules.length;
            i++
        ) {
            const rule = this.unitProgressionRules[i];

            if (!rule) continue;

            const key = this.getRuleKey(rule);
            const saved = this.getSavedUnit(state, key);
            const entry = this.findEntryForRule(
                manager.unitDatabase.teamAUnits,
                rule
            );

            if (!saved || !entry) continue;

            const unlockPrice =
                this.getUnitUnlockPrice(entry);
            const familyName =
                unitFamilyToName(rule.family);

            if (saved.offered && !saved.unlocked) {
                options.push({
                    id: `unlock:${key}`,
                    kind: 'unit-unlock',
                    cost: unlockPrice,
                    family: rule.family,
                    tier: rule.tier,
                    delta: 1,
                    label: `Unlock ${familyName} T${rule.tier}`,
                });
            }

            if (
                saved.unlocked &&
                saved.unitCount <
                this.getPlayerUnitCountMilestoneCap(
                    rule,
                    this.battleLevel
                )
            ) {
                options.push({
                    id: `count:${key}`,
                    kind: 'unit-count',
                    cost: Math.max(
                        1,
                        Math.round(
                            unlockPrice /
                            this.getRuleUnlockCount(rule)
                        )
                    ),
                    family: rule.family,
                    tier: rule.tier,
                    delta: 1,
                    label: `+1 ${familyName} T${rule.tier}`,
                });
            }
        }

        const unlockedCPPackages =
            this.getPlayerCPPackagesUnlocked(
                this.battleLevel
            );

        if (
            state.playerInitialCPPackagesPurchased <
            unlockedCPPackages
        ) {
            const nextPackageNumber =
                state.playerInitialCPPackagesPurchased + 1;
            const targetCP =
                this.getPlayerCPForPurchasedPackages(
                    nextPackageNumber
                );
            const delta = Math.max(
                0,
                targetCP - state.playerInitialCP
            );

            if (delta > 0) {
                options.push({
                    id: 'initial-cp',
                    kind: 'initial-cp',
                    cost: Math.max(
                        1,
                        Math.round(
                            delta *
                            Math.max(
                                0.01,
                                this.initialCPGoldPerPoint
                            )
                        )
                    ),
                    family: null,
                    tier: 0,
                    delta,
                    label: `+${delta} Initial CP`,
                });
            }
        }

        const milestoneMaxAlive =
            this.getPlayerMaxAliveMilestoneCap(
                this.battleLevel
            );

        if (state.playerMaxAlive < milestoneMaxAlive) {
            options.push({
                id: 'max-alive',
                kind: 'max-alive',
                cost: Math.max(
                    1,
                    Math.round(
                        Math.max(1, this.maxAliveBasePrice) *
                        state.playerMaxAlive /
                        Math.max(
                            1,
                            this.getPlayerMaxAliveStart()
                        )
                    )
                ),
                family: null,
                tier: 0,
                delta: 1,
                label: '+1 Max Alive',
            });
        }

        return options;
    }

    private runPurchaseSimulation(
        records: PurchaseRecord[],
        source: string
    ) {
        if (!this.progressionState) return;

        for (let iteration = 0; iteration < 100; iteration++) {
            const affordable = this.getPurchaseOptions(
                this.progressionState
            ).filter((option) =>
                option.cost <=
                this.progressionState!.playerGold
            );

            if (affordable.length <= 0) return;

            const selected =
                this.pickWeightedPurchase(affordable);

            if (!selected) return;

            records.push(
                this.applyPurchase(
                    selected,
                    this.progressionState,
                    source
                )
            );
        }
    }

    private pickWeightedPurchase(
        options: PurchaseOption[]
    ) {
        if (!this.progressionState) return null;

        const weights: number[] = [];
        let totalWeight = 0;

        for (let i = 0; i < options.length; i++) {
            const weight = Math.max(
                0.01,
                this.getPurchaseWeight(options[i])
            );

            weights.push(weight);
            totalWeight += weight;
        }

        let roll = Math.random() * totalWeight;

        for (let i = 0; i < options.length; i++) {
            roll -= weights[i];

            if (roll <= 0) return options[i];
        }

        return options[options.length - 1] || null;
    }

    private getPurchaseWeight(option: PurchaseOption) {
        if (!this.progressionState) return 1;

        const state = this.progressionState;
        const enemyCP = this.getEnemyInitialCP();
        const enemyMaxAlive = this.getEnemyMaxAlive();

        if (option.kind === 'initial-cp') {
            const gap = Math.max(
                0,
                enemyCP - state.playerInitialCP
            );

            return 1 + gap /
                Math.max(1, option.delta);
        }

        if (option.kind === 'max-alive') {
            return 1 + Math.max(
                0,
                enemyMaxAlive - state.playerMaxAlive
            ) * 2;
        }

        if (option.kind === 'unit-unlock') {
            const rule = option.family === null
                ? null
                : this.getRule(
                    option.family,
                    option.tier
                );
            const age = rule
                ? Math.max(
                    0,
                    this.battleLevel -
                    this.getRuleUnlockLevel(rule)
                )
                : 0;

            return 3 + Math.min(3, age / 5);
        }

        if (
            option.kind === 'unit-count' &&
            option.family !== null
        ) {
            const rule = this.getRule(
                option.family,
                option.tier
            );
            const saved = rule
                ? this.getSavedUnit(
                    state,
                    this.getRuleKey(rule)
                )
                : null;
            const enemyCount = rule
                ? this.getEnemyUnitCount(
                    rule,
                    this.battleLevel
                )
                : 0;

            return 1 + Math.max(
                0,
                enemyCount -
                (saved ? saved.unitCount : 0)
            );
        }

        return 1;
    }

    private createRescuePlan() {
        if (!this.progressionState) {
            return {
                actionIds: [] as string[],
                totalCost: 0,
            };
        }

        const temp = this.cloneProgressionState(
            this.progressionState
        );
        const actionIds: string[] = [];
        let totalCost = 0;
        const addAction = (option: PurchaseOption | null) => {
            if (!option) return;

            actionIds.push(option.id);
            totalCost += option.cost;
            this.applyPurchaseToState(option, temp);
        };
        const latestUnlock = this.getPurchaseOptions(temp)
            .filter((option) =>
                option.kind === 'unit-unlock'
            )
            .sort((a, b) => {
                const aRule = a.family === null
                    ? null
                    : this.getRule(a.family, a.tier);
                const bRule = b.family === null
                    ? null
                    : this.getRule(b.family, b.tier);

                return (
                    bRule
                        ? this.getRuleUnlockLevel(bRule)
                        : 0
                ) - (
                    aRule
                        ? this.getRuleUnlockLevel(aRule)
                        : 0
                );
            })[0] || null;

        addAction(latestUnlock);

        const enemyCP = this.getEnemyInitialCP();

        while (
            temp.playerInitialCP < enemyCP &&
            temp.playerInitialCP < this.getPlayerCPMax()
        ) {
            const option = this.getPurchaseOptions(temp)
                .find((candidate) =>
                    candidate.kind === 'initial-cp'
                ) || null;

            if (!option) break;
            addAction(option);
        }

        const enemyMaxAlive = this.getEnemyMaxAlive();

        while (
            temp.playerMaxAlive < enemyMaxAlive &&
            temp.playerMaxAlive <
            this.getPlayerMaxAliveMax()
        ) {
            const option = this.getPurchaseOptions(temp)
                .find((candidate) =>
                    candidate.kind === 'max-alive'
                ) || null;

            if (!option) break;
            addAction(option);
        }

        const countOptions = this.getPurchaseOptions(temp)
            .filter((option) =>
                option.kind === 'unit-count'
            )
            .sort((a, b) =>
                this.getCountUpgradeDeficit(b, temp) -
                this.getCountUpgradeDeficit(a, temp) ||
                a.cost - b.cost
            );

        addAction(countOptions[0] || null);

        if (actionIds.length <= 0) {
            const cheapest = this.getPurchaseOptions(temp)
                .sort((a, b) => a.cost - b.cost)[0] || null;

            addAction(cheapest);
        }

        return {
            actionIds,
            totalCost,
        };
    }

    private executePreferredPurchases(
        actionIds: string[],
        records: PurchaseRecord[],
        source: string
    ) {
        if (!this.progressionState) return;

        for (let i = 0; i < actionIds.length; i++) {
            const option = this.getPurchaseOptions(
                this.progressionState
            ).find((candidate) =>
                candidate.id === actionIds[i]
            );

            if (!option) continue;
            if (
                option.cost >
                this.progressionState.playerGold
            ) {
                continue;
            }

            records.push(
                this.applyPurchase(
                    option,
                    this.progressionState,
                    source
                )
            );
        }
    }

    private applyPurchase(
        option: PurchaseOption,
        state: SavedProgressionState,
        source: string
    ): PurchaseRecord {
        const goldBefore = state.playerGold;
        const valueBefore = this.getPurchaseValue(
            option,
            state
        );

        state.playerGold = Math.max(
            0,
            state.playerGold - option.cost
        );
        this.applyPurchaseToState(option, state);
        state.totalPurchases++;

        return {
            id: option.id,
            kind: option.kind,
            label: option.label,
            family: option.family,
            familyName: option.family === null
                ? ''
                : unitFamilyToName(option.family),
            tier: option.tier,
            cost: option.cost,
            goldBefore,
            goldAfter: state.playerGold,
            valueBefore,
            valueAfter: this.getPurchaseValue(
                option,
                state
            ),
            source,
        };
    }

    private applyPurchaseToState(
        option: PurchaseOption,
        state: SavedProgressionState
    ) {
        if (
            option.kind === 'initial-cp'
        ) {
            state.playerInitialCPPackagesPurchased++;
            state.playerInitialCP =
                this.getPlayerCPForPurchasedPackages(
                    state.playerInitialCPPackagesPurchased
                );
            state.playerInitialCP = this.clampPlayerCP(
                state.playerInitialCP
            );
            return;
        }

        if (option.kind === 'max-alive') {
            state.playerMaxAlive =
                this.clampPlayerMaxAlive(
                    state.playerMaxAlive + option.delta
                );
            return;
        }

        if (option.family === null) return;

        const rule = this.getRule(
            option.family,
            option.tier
        );

        if (!rule) return;

        const saved = this.getSavedUnit(
            state,
            this.getRuleKey(rule)
        );

        if (!saved) return;

        if (option.kind === 'unit-unlock') {
            saved.unlocked = true;
            saved.unitCount = Math.max(
                saved.unitCount,
                this.getRuleUnlockCount(rule)
            );
            return;
        }

        if (option.kind === 'unit-count') {
            saved.unitCount = Math.min(
                this.getRuleMaxCount(rule),
                saved.unitCount + option.delta
            );
        }
    }

    private getPurchaseValue(
        option: PurchaseOption,
        state: SavedProgressionState
    ) {
        if (option.kind === 'initial-cp') {
            return state.playerInitialCP;
        }

        if (option.kind === 'max-alive') {
            return state.playerMaxAlive;
        }

        if (option.family === null) return 0;

        const rule = this.getRule(
            option.family,
            option.tier
        );
        const saved = rule
            ? this.getSavedUnit(
                state,
                this.getRuleKey(rule)
            )
            : null;

        if (!saved) return 0;

        return option.kind === 'unit-unlock'
            ? Number(saved.unlocked)
            : saved.unitCount;
    }

    private getCountUpgradeDeficit(
        option: PurchaseOption,
        state: SavedProgressionState
    ) {
        if (option.family === null) return 0;

        const rule = this.getRule(
            option.family,
            option.tier
        );

        if (!rule) return 0;

        const saved = this.getSavedUnit(
            state,
            this.getRuleKey(rule)
        );

        return this.getEnemyUnitCount(
            rule,
            this.battleLevel
        ) - (saved ? saved.unitCount : 0);
    }

    private grantCappedLossGold(
        state: SavedProgressionState,
        level: number,
        winGold: number
    ) {
        if (state.lossGoldLevel !== level) {
            state.lossGoldLevel = level;
            state.lossGoldClaimed = 0;
        }

        const cap = Math.max(
            0,
            Math.round(
                winGold *
                this.clamp01(
                    this.maxLossGoldRatioPerLevel
                )
            )
        );
        const requested = Math.max(
            0,
            Math.round(
                winGold *
                this.clamp01(this.lossGoldRatio)
            )
        );
        const granted = Math.min(
            requested,
            Math.max(0, cap - state.lossGoldClaimed)
        );

        state.lossGoldClaimed += granted;
        state.playerGold += granted;

        return granted;
    }

    private isValidPlayerLoss(reason: string) {
        if (
            reason ===
            'team-eliminated-and-cannot-afford-spawn'
        ) {
            return true;
        }

        const manager = this.getGameManager();

        if (!manager) return false;

        return manager.getAliveNonHeroUnitCount(0) <= 0 &&
            !manager.canTeamAffordAnySpawn(0);
    }

    private offerIntroducedUnits(level: number) {
        if (!this.progressionState) return [];

        const result: string[] = [];

        for (
            let i = 0;
            i < this.unitProgressionRules.length;
            i++
        ) {
            const rule = this.unitProgressionRules[i];

            if (!rule) continue;
            if (
                this.getRuleUnlockLevel(rule) > level
            ) {
                continue;
            }

            const saved = this.getSavedUnit(
                this.progressionState,
                this.getRuleKey(rule)
            );

            if (!saved || saved.offered) continue;

            saved.offered = true;
            result.push(
                `${unitFamilyToName(rule.family)} T${rule.tier}`
            );
        }

        return result;
    }

    private offerUnitsFromEarlierLevels(level: number) {
        if (!this.progressionState) return;

        for (
            let i = 0;
            i < this.unitProgressionRules.length;
            i++
        ) {
            const rule = this.unitProgressionRules[i];

            if (!rule) continue;
            if (
                this.getRuleUnlockLevel(rule) >= level
            ) {
                continue;
            }

            const saved = this.getSavedUnit(
                this.progressionState,
                this.getRuleKey(rule)
            );

            if (saved) saved.offered = true;
        }
    }

    private createUnitProgressionSnapshot() {
        if (!this.progressionState) return [];

        return this.unitProgressionRules
            .filter((rule) => !!rule)
            .map((rule) => {
                const saved = this.getSavedUnit(
                    this.progressionState!,
                    this.getRuleKey(rule)
                );

                return {
                    family: rule.family,
                    familyName:
                        unitFamilyToName(rule.family),
                    tier: rule.tier,
                    unlockLevel:
                        this.getRuleUnlockLevel(rule),
                    unlockCount:
                        this.getRuleUnlockCount(rule),
                    maxCount:
                        this.getRuleMaxCount(rule),
                    enemyUnlocked:
                        this.battleLevel >=
                        this.getRuleUnlockLevel(rule),
                    enemyCount:
                        this.getEnemyUnitCount(
                            rule,
                            this.battleLevel
                        ),
                    playerOffered:
                        saved ? saved.offered : false,
                    playerUnlocked:
                        saved ? saved.unlocked : false,
                    playerCount:
                        saved ? saved.unitCount : 0,
                    playerCountMilestoneCap:
                        this.getPlayerUnitCountMilestoneCap(
                            rule,
                            this.battleLevel
                        ),
                };
            });
    }

    private getPlayerUnitCountMilestoneCap(
        rule: UnitProgressionRule,
        level: number
    ) {
        return Math.min(
            this.getRuleMaxCount(rule),
            this.getEnemyUnitCount(rule, level)
        );
    }

    private getEnemyUnitCount(
        rule: UnitProgressionRule,
        level: number
    ) {
        const unlockLevel =
            this.getRuleUnlockLevel(rule);
        const unlockCount =
            this.getRuleUnlockCount(rule);
        const maxCount = this.getRuleMaxCount(rule);
        const progressionEndLevel =
            this.getUnitProgressionEndLevel();

        if (maxCount <= unlockCount) return unlockCount;
        if (level >= progressionEndLevel) return maxCount;
        if (level <= unlockLevel) return unlockCount;

        const denominator = Math.max(
            1,
            progressionEndLevel - unlockLevel
        );
        const maturity = this.clamp01(
            (level - unlockLevel) / denominator
        );

        return Math.round(
            this.lerp(
                unlockCount,
                maxCount,
                maturity
            )
        );
    }

    private getUnitUnlockPrice(
        entry: UnitPrefabEntry
    ) {
        return Math.max(
            1,
            Math.round(
                Math.max(0, entry.combatPointCost) *
                Math.max(1, this.unitUnlockCostMultiplier)
            )
        );
    }

    private getEnemyInitialCP() {
        const manager = this.getGameManager();

        return manager
            ? Math.max(0, manager.initialCombatPoint[1])
            : 0;
    }

    private getEnemyMaxAlive() {
        const brain = this.getFirstBrainForTeam(1);

        return brain
            ? Math.max(0, brain.maxAliveWaves)
            : 0;
    }

    private getFirstBrainForTeam(team: number) {
        const brains = this.getTargetBattleArmyBrains(team);

        return brains.length > 0
            ? brains[0]
            : null;
    }

    private getGameManager() {
        if (this.gameManager) return this.gameManager;

        const scene = director.getScene();

        if (!scene) return null;

        const managers = scene.getComponentsInChildren(
            GameManager
        );

        return managers.length > 0
            ? managers[0]
            : null;
    }

    private getTargetBattleArmyBrains(team: number) {
        const result: BattleArmyBrain[] = [];

        for (
            let i = 0;
            i < this.battleArmyBrains.length;
            i++
        ) {
            const brain = this.battleArmyBrains[i];

            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;

            result.push(brain);
        }

        if (result.length > 0) return result;

        const scene = director.getScene();

        if (!scene) return result;

        const brains = scene.getComponentsInChildren(
            BattleArmyBrain
        );

        for (let i = 0; i < brains.length; i++) {
            const brain = brains[i];

            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;

            result.push(brain);
        }

        return result;
    }

    private findEntryForRule(
        entries: UnitPrefabEntry[],
        rule: UnitProgressionRule
    ) {
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!entry) continue;
            if (entry.family !== rule.family) continue;
            if (Math.floor(entry.tier) !== Math.floor(rule.tier)) {
                continue;
            }

            return entry;
        }

        return null;
    }

    private getRule(
        family: UnitFamily,
        tier: number
    ) {
        for (
            let i = 0;
            i < this.unitProgressionRules.length;
            i++
        ) {
            const rule = this.unitProgressionRules[i];

            if (!rule) continue;
            if (rule.family !== family) continue;
            if (Math.floor(rule.tier) !== Math.floor(tier)) {
                continue;
            }

            return rule;
        }

        return null;
    }

    private getRuleByKey(key: string) {
        for (
            let i = 0;
            i < this.unitProgressionRules.length;
            i++
        ) {
            const rule = this.unitProgressionRules[i];

            if (rule && this.getRuleKey(rule) === key) {
                return rule;
            }
        }

        return null;
    }

    private getRuleKey(rule: UnitProgressionRule) {
        return `${rule.family}:${Math.max(1, Math.floor(rule.tier))}`;
    }

    private getSavedUnit(
        state: SavedProgressionState,
        key: string
    ) {
        for (let i = 0; i < state.units.length; i++) {
            if (state.units[i].key === key) {
                return state.units[i];
            }
        }

        return null;
    }

    private getRuleUnlockLevel(rule: UnitProgressionRule) {
        return this.clampLevel(rule.unlockLevel);
    }

    private getRuleUnlockCount(rule: UnitProgressionRule) {
        return Math.max(1, Math.floor(rule.unlockCount));
    }

    private getRuleMaxCount(rule: UnitProgressionRule) {
        return Math.max(
            this.getRuleUnlockCount(rule),
            Math.floor(rule.maxCount)
        );
    }

    private getPlayerCPStart() {
        return Math.max(
            0,
            Math.floor(this.playerInitialCPStart)
        );
    }

    private getPlayerCPMax() {
        return Math.max(
            this.getPlayerCPStart(),
            Math.floor(this.playerInitialCPMax)
        );
    }

    private getPlayerCPPackagesUnlocked(level: number) {
        const pace = Math.max(
            0,
            Math.floor(this.bossStagePace)
        );

        if (pace <= 0) return 0;

        return Math.floor(
            this.clampLevel(level) / pace
        );
    }

    private getPlayerCPPackagesPurchased(
        state: SavedProgressionState
    ) {
        return Math.max(
            0,
            Math.min(
                this.getPlayerCPPackagesUnlocked(
                    this.getSafeTotalLevels()
                ),
                Math.floor(
                    state.playerInitialCPPackagesPurchased
                )
            )
        );
    }

    private getPlayerCPMilestoneCap(level: number) {
        return this.getPlayerCPForPurchasedPackages(
            this.getPlayerCPPackagesUnlocked(level)
        );
    }

    private getPlayerCPForPurchasedPackages(
        packageCount: number
    ) {
        const safeCount = Math.max(
            0,
            Math.min(
                this.getPlayerCPPackagesUnlocked(
                    this.getSafeTotalLevels()
                ),
                Math.floor(packageCount)
            )
        );
        let cp = this.getPlayerCPStart();

        for (let packageNumber = 1;
            packageNumber <= safeCount;
            packageNumber++) {
            cp += this.getPlayerCPPackageDelta(
                packageNumber
            );

            if (cp >= this.getPlayerCPMax()) {
                return this.getPlayerCPMax();
            }
        }

        return this.clampPlayerCP(cp);
    }

    private getPlayerCPPackageDelta(
        packageNumber: number
    ) {
        const pace = Math.max(
            1,
            Math.floor(this.bossStagePace)
        );
        const currentBossLevel = Math.min(
            this.getSafeTotalLevels(),
            Math.max(1, Math.floor(packageNumber)) * pace
        );
        const currentBossCP =
            this.getLevelInitialCP(currentBossLevel);
        const previousBossCP = packageNumber > 1
            ? this.getLevelInitialCP(
                currentBossLevel - pace
            )
            : this.getLevelBaseInitialCP(1);
        const bossCPGrowth = Math.max(
            0,
            currentBossCP - previousBossCP
        );

        return Math.max(
            0,
            Math.round(
                bossCPGrowth *
                this.getPlayerCPBossGrowthRatio()
            )
        );
    }

    private getPlayerCPBossGrowthRatio() {
        return Math.max(
            0,
            Math.min(
                1,
                Number.isFinite(
                    this.playerInitialCPBossGrowthRatio
                )
                    ? this.playerInitialCPBossGrowthRatio
                    : 0.5
            )
        );
    }

    private getNextPlayerCPPackageSnapshot(
        state: SavedProgressionState,
        level: number
    ) {
        const unlocked =
            this.getPlayerCPPackagesUnlocked(level);

        if (
            state.playerInitialCPPackagesPurchased >=
            unlocked
        ) {
            return null;
        }

        const packageNumber =
            state.playerInitialCPPackagesPurchased + 1;
        const targetCP =
            this.getPlayerCPForPurchasedPackages(
                packageNumber
            );

        return {
            packageNumber,
            delta: Math.max(
                0,
                targetCP - state.playerInitialCP
            ),
            targetCP,
        };
    }

    private getUnitProgressionEndLevel() {
        return Math.max(
            1,
            Math.ceil(this.getSafeTotalLevels() * 0.5)
        );
    }

    private clampPlayerCP(value: number) {
        return Math.max(
            this.getPlayerCPStart(),
            Math.min(this.getPlayerCPMax(), value)
        );
    }

    private getPlayerMaxAliveStart() {
        return Math.max(
            0,
            Math.floor(this.playerMaxAliveStart)
        );
    }

    private getPlayerMaxAliveMax() {
        return Math.max(
            this.getPlayerMaxAliveStart(),
            Math.floor(this.playerMaxAliveMax)
        );
    }

    private getPlayerMaxAliveMilestoneCap(level: number) {
        if (!this.allowMaxWave) {
            return this.getPlayerMaxAliveMax();
        }

        const total = this.getSafeTotalLevels();
        const safeLevel = this.clampLevel(level);
        const progress = total <= 1
            ? 1
            : (safeLevel - 1) / (total - 1);
        const enemyBaseMaxAlive = Math.round(
            this.lerp(
                this.maxAliveWavesMin,
                this.maxAliveWavesMax,
                progress
            )
        );

        return Math.min(
            this.getPlayerMaxAliveMax(),
            Math.max(
                this.getPlayerMaxAliveStart(),
                enemyBaseMaxAlive
            )
        );
    }

    private clampPlayerMaxAlive(value: number) {
        return Math.max(
            this.getPlayerMaxAliveStart(),
            Math.min(
                this.getPlayerMaxAliveMax(),
                value
            )
        );
    }

    private cloneProgressionState(
        state: SavedProgressionState
    ): SavedProgressionState {
        return JSON.parse(JSON.stringify(state));
    }

    private loadProgressionState() {
        const raw = sys.localStorage.getItem(
            this.progressionStorageKey
        );

        if (!raw) return null;

        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    private saveProgressionState() {
        if (!this.progressionState) return;

        sys.localStorage.setItem(
            this.progressionStorageKey,
            JSON.stringify(this.progressionState)
        );
    }

    private buildProgressionUrl(level: number) {
        if (typeof window === 'undefined') return '';
        if (!window.location) return '';

        const location = window.location;
        const params = new URLSearchParams(
            location.search
        );
        const removeKeys = [
            'currentAcc',
            'currentBatch',
            'step',
            'numBatchPerStep',
            'end',
        ];

        for (let i = 0; i < removeKeys.length; i++) {
            params.delete(removeKeys[i]);
            params.delete(`?${removeKeys[i]}`);
        }

        params.set('progression', '1');
        params.set('currentLevel', `${this.clampLevel(level)}`);
        params.set('TotalLevels', `${this.getSafeTotalLevels()}`);
        params.delete('totalLevels');

        const origin = location.origin ||
            `${location.protocol}//${location.host}`;
        const query = params.toString();

        return `${origin}${location.pathname}` +
            `${query ? `?${query}` : ''}` +
            `${location.hash || ''}`;
    }

    private applyTelemetryLevelQuery() {
        if (typeof window === 'undefined') return;
        if (!window.location) return;

        const params = new URLSearchParams(
            window.location.search
        );
        const progressionParam =
            this.getQueryInt(
                params,
                ['progression'],
                -1
            );

        if (progressionParam === 0) {
            this.enableProgression = false;
        } else if (progressionParam === 1) {
            this.enableProgression = true;
        }

        const totalLevels = this.getQueryInt(
            params,
            ['TotalLevels', 'totalLevels'],
            0
        );
        const queriedLevel = this.getQueryInt(
            params,
            ['currentLevel'],
            this.currentLevel
        );

        this.resetProgressionRequested =
            queriedLevel <= 0;
        this.levelQueryActive =
            totalLevels > 0 ||
            progressionParam === 1 ||
            params.has('currentLevel');

        if (totalLevels > 0) {
            this.totalLevels = Math.max(1, totalLevels);
        }

        if (this.levelQueryActive) {
            this.currentLevel = this.clampLevel(
                this.resetProgressionRequested
                    ? 1
                    : queriedLevel
            );
        }
    }

    private getQueryInt(
        params: URLSearchParams,
        keys: string[],
        fallback: number
    ) {
        for (let i = 0; i < keys.length; i++) {
            const value = params.get(keys[i]) ??
                params.get(`?${keys[i]}`);

            if (value === null) continue;

            const parsed = Number(value);

            if (Number.isFinite(parsed)) {
                return Math.floor(parsed);
            }
        }

        return fallback;
    }

    private getDifficulty01() {
        return this.getLevelProgress01(
            this.getSafeCurrentLevel()
        );
    }

    private getLevelProgress01(level: number) {
        const total = this.getSafeTotalLevels();
        const safeLevel = this.clampLevel(level);

        if (total <= 1) return 1;

        return (safeLevel - 1) / (total - 1);
    }

    private getLevelBaseInitialCP(level: number) {
        return Math.round(
            this.lerp(
                this.initialCombatPointMin,
                this.initialCombatPointMax,
                this.getLevelProgress01(level)
            )
        );
    }

    private getLevelInitialCP(level: number) {
        const safeLevel = this.clampLevel(level);

        return Math.round(
            this.getLevelBaseInitialCP(safeLevel) *
            this.getBossMultiplier(
                this.bossInitialCombatPointMultiplier,
                this.isBossLevelFor(safeLevel)
            )
        );
    }

    private getBossMultiplier(
        configuredMultiplier: number,
        boss: boolean
    ) {
        if (!boss) return 1;

        return Math.max(
            1,
            Number.isFinite(configuredMultiplier)
                ? configuredMultiplier
                : 1
        );
    }

    private isBossLevel() {
        return this.isBossLevelFor(
            this.getSafeCurrentLevel()
        );
    }

    private isBossLevelFor(level: number) {
        const pace = Math.max(
            0,
            Math.floor(this.bossStagePace)
        );

        return pace > 0 &&
            Math.max(1, Math.floor(level)) % pace === 0;
    }

    private getSafeTotalLevels() {
        return Math.max(1, Math.floor(this.totalLevels));
    }

    private getSafeCurrentLevel() {
        return this.clampLevel(this.currentLevel);
    }

    private clampLevel(level: number) {
        return Math.max(
            1,
            Math.min(
                this.getSafeTotalLevels(),
                Math.floor(level)
            )
        );
    }

    private safeInteger(value: any, fallback: number) {
        const parsed = Number(value);

        return Number.isFinite(parsed)
            ? Math.floor(parsed)
            : fallback;
    }

    private clampTeam(team: number) {
        return team === 0 ? 0 : 1;
    }

    private clamp01(value: number) {
        return Math.max(0, Math.min(1, value));
    }

    private lerp(a: number, b: number, t: number) {
        return a + (b - a) * this.clamp01(t);
    }
}
