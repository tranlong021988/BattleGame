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

interface SavedProgressionPackage {
    id: string;
    targetLevel: number;
    offerLevel: number;
    delta: number;
    claimed: boolean;
    claimSource: string;
}

interface SavedProgressionState {
    version: number;
    currentLevel: number;
    playerGold: number;
    adsReward: number;
    levelLossCount: number;
    playerInitialCP: number;
    playerInitialCPOverflow: number;
    cpPackages: SavedProgressionPackage[];
    maxAlivePackages: SavedProgressionPackage[];
    rescueHistory: string[];
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
        min: 1,
        step: 1,
        displayName: 'Progression End Level',
        tooltip: 'Level where base CP, accuracy, Max Alive, unit unlocks, and unit counts finish progressing. Later levels keep these base caps while boss multipliers still apply.'
    })
    progressionEndLevel = 50;

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
    bossInitialCombatPointMultiplier = 1.1;

    @property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Decision Accuracy Multiplier',
        tooltip: 'Multiplier applied only to enemy Decision Accuracy on boss levels. The result remains capped by Decision Accuracy Max.'
    })
    bossDecisionAccuracyMultiplier = 1.1;

    @property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Max Alive Waves Multiplier',
        tooltip: 'Multiplier applied only to enemy Max Alive Waves on boss levels. The result remains capped by Max Alive Waves Max.'
    })
    bossMaxAliveWavesMultiplier = 1.1;

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
        tooltip: 'Persistent campaign storage key. Opening currentLevel=1 starts a fresh run; use resetProgression=1 to force reset even from a resume URL.'
    })
    progressionStorageKey = 'battle-progression-v7';

    @property({ min: 0, step: 1 })
    initialPlayerGold = 0;

    @property({ min: 0, step: 1 })
    playerInitialCPStart = 300;

    @property({ min: 0, step: 1 })
    playerMaxAliveStart = 4;

    @property({ min: 0, step: 1 })
    playerMaxAliveMax = 10;

    @property({ min: 0.01, step: 0.1 })
    winGoldPerEnemyCP = 1;

    @property({
        min: 1,
        step: 0.05,
        displayName: 'Boss Gold Reward Multiplier',
        tooltip: 'Small bonus applied to baseline CP reward on boss wins. Boss CP multiplier is not included in the reward base.'
    })
    bossGoldRewardMultiplier = 1.15;

    @property({
        min: 0,
        max: 1,
        step: 0.05,
        displayName: 'Loss Gold Ratio',
        tooltip: 'Gold granted after every valid player loss as a ratio of that level win reward.'
    })
    lossGoldRatio = 0.1;

    @property({ min: 1, step: 1 })
    lossesPerVideoReward = 3;

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
            this.clearProgressionStorage();
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
                brain.maxAliveWaves = this.getLevelMaxAlive(
                    this.getSafeCurrentLevel()
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
        const rewardBaseCP = this.getLevelBaseInitialCP(
            battleLevel
        );
        const winGold = Math.max(
            0,
            Math.round(
                rewardBaseCP *
                Math.max(0, this.winGoldPerEnemyCP) *
                (this.isBossLevelFor(battleLevel)
                    ? Math.max(1, this.bossGoldRewardMultiplier)
                    : 1)
            )
        );

        let goldReward = 0;
        let rescueCP = 0;
        let rescueMaxAlive = 0;
        let rescueGold = 0;
        let videoRewardTriggered = false;
        let rescueActions: string[] = [];
        const validPlayerLoss = loserTeam === 0 &&
            this.isValidPlayerLoss(reason);

        if (winnerTeam === 0) {
            goldReward = winGold;
            state.playerGold += goldReward;
            state.levelLossCount = 0;
        } else if (loserTeam === 0) {
            state.levelLossCount++;

            if (validPlayerLoss) {
                goldReward = this.grantLossGold(
                    state,
                    winGold
                );
            }

            if (
                this.purchasingSimulation &&
                state.levelLossCount >=
                Math.max(
                    1,
                    Math.floor(this.lossesPerVideoReward)
                )
            ) {
                const rescue = this.applyVideoRescue(
                    purchases
                );

                if (rescue) {
                    rescueGold = Math.max(
                        0,
                        rescue.goldAfter - rescue.goldBefore
                    );
                    state.adsReward++;
                    state.levelLossCount = 0;
                    videoRewardTriggered = true;
                    rescueActions = [rescue.id];
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
            rescueCP,
            rescueMaxAlive,
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
                progressionEndLevel:
                    this.getProgressionEndLevel(),
                progression01:
                    this.getProgression01(
                        this.battleLevel
                    ),
                playerInitialCPStart:
                    this.getPlayerCPStart(),
                playerInitialCPMilestoneCap:
                    this.getPlayerCPMilestoneCap(
                        this.battleLevel
                    ),
                playerCPPackagesOffered:
                    this.getPlayerCPPackagesOffered(
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
                playerMaxAlivePackagesOffered:
                    this.getPlayerMaxAlivePackagesOffered(
                        this.battleLevel
                    ),
                nextPlayerMaxAlivePackage:
                    this.getNextPlayerMaxAlivePackageSnapshot(
                        state,
                        this.battleLevel
                    ),
                winGoldPerEnemyCP:
                    this.winGoldPerEnemyCP,
                bossGoldRewardMultiplier:
                    this.bossGoldRewardMultiplier,
                lossGoldRatio: this.lossGoldRatio,
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
                initialCP: state.playerInitialCP,
                cpPackagesPurchased:
                    state.cpPackages.filter((item) =>
                        item.claimed
                    ).length,
                cpPackagesOffered:
                    this.getPlayerCPPackagesOffered(
                        this.battleLevel
                    ),
                cpPackageSchedule:
                    state.cpPackages.map((item) => ({
                        ...item,
                    })),
                initialCPOverflow:
                    state.playerInitialCPOverflow,
                rescueHistory:
                    state.rescueHistory.slice(),
                maxAlive: state.playerMaxAlive,
                maxAlivePackagesPurchased:
                    state.maxAlivePackages.filter((item) =>
                        item.claimed
                    ).length,
                maxAlivePackagesOffered:
                    this.getPlayerMaxAlivePackagesOffered(
                        this.battleLevel
                    ),
                maxAlivePackageSchedule:
                    state.maxAlivePackages.map((item) => ({
                        ...item,
                    })),
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
        const savedLevel = this.progressionState.currentLevel;

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

        if (savedLevel !== this.battleLevel) {
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
            version: 7,
            currentLevel: this.getSafeCurrentLevel(),
            playerGold: Math.max(
                0,
                Math.floor(this.initialPlayerGold)
            ),
            adsReward: 0,
            levelLossCount: 0,
            playerInitialCP: this.getPlayerCPStart(),
            playerInitialCPOverflow: 0,
            cpPackages: this.createCPPackageSchedule(),
            maxAlivePackages:
                this.createMaxAlivePackageSchedule(),
            rescueHistory: [],
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

        if (this.safeInteger(source.version, 0) !== 7) {
            return initial;
        }

        const savedUnits = Array.isArray(source.units)
            ? source.units
            : [];
        const savedCPPackages = Array.isArray(
            source.cpPackages
        ) ? source.cpPackages : [];
        const savedMaxAlivePackages = Array.isArray(
            source.maxAlivePackages
        ) ? source.maxAlivePackages : [];

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
        initial.playerInitialCPOverflow = Math.max(
            0,
            this.safeInteger(
                source.playerInitialCPOverflow,
                0
            )
        );

        for (let i = 0; i < initial.cpPackages.length; i++) {
            const item = initial.cpPackages[i];
            const saved = savedCPPackages.find(
                (candidate: any) =>
                    candidate && candidate.id === item.id
            );

            if (!saved) continue;

            item.claimed = !!saved.claimed;
            item.claimSource = item.claimed &&
                typeof saved.claimSource === 'string'
                ? saved.claimSource
                : '';
        }

        for (
            let i = 0;
            i < initial.maxAlivePackages.length;
            i++
        ) {
            const item = initial.maxAlivePackages[i];
            const saved = savedMaxAlivePackages.find(
                (candidate: any) =>
                    candidate && candidate.id === item.id
            );

            if (!saved) continue;

            item.claimed = !!saved.claimed;
            item.claimSource = item.claimed &&
                typeof saved.claimSource === 'string'
                ? saved.claimSource
                : '';
        }

        initial.rescueHistory = Array.isArray(
            source.rescueHistory
        )
            ? source.rescueHistory
                .filter((value: any) =>
                    typeof value === 'string'
                )
                .slice()
            : [];
        initial.playerInitialCP =
            this.getPlayerCPFromState(initial);
        initial.playerMaxAlive =
            this.getPlayerMaxAliveFromState(initial);
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

        const nextCPPackage =
            this.getNextAvailableCPPackage(
                state,
                this.battleLevel
            );

        if (nextCPPackage) {
            options.push({
                id: `initial-cp:${nextCPPackage.id}`,
                kind: 'initial-cp',
                cost: this.getInitialCPPackageCost(
                    nextCPPackage.delta
                ),
                family: null,
                tier: 0,
                delta: nextCPPackage.delta,
                label: `+${nextCPPackage.delta} Initial CP`,
            });
        }

        const nextMaxAlivePackage =
            this.getNextAvailableMaxAlivePackage(
                state,
                this.battleLevel
            );

        if (nextMaxAlivePackage) {
            options.push({
                id: `max-alive:${nextMaxAlivePackage.id}`,
                kind: 'max-alive',
                cost: this.getMaxAlivePackageCost(
                    nextMaxAlivePackage.delta,
                    state.playerMaxAlive
                ),
                family: null,
                tier: 0,
                delta: nextMaxAlivePackage.delta,
                label: `+${nextMaxAlivePackage.delta} Max Alive`,
            });
        }

        return options;
    }

    private getInitialCPPackageCost(delta: number) {
        return Math.max(
            1,
            Math.round(
                Math.max(0, delta) *
                Math.max(0.01, this.initialCPGoldPerPoint)
            )
        );
    }

    private getMaxAlivePackageCost(
        delta: number,
        currentMaxAlive: number
    ) {
        return Math.max(
            1,
            Math.round(
                Math.max(1, this.maxAliveBasePrice) *
                Math.max(1, currentMaxAlive) /
                Math.max(1, this.getPlayerMaxAliveStart()) *
                Math.max(0, delta)
            )
        );
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

    private applyVideoRescue(
        records: PurchaseRecord[]
    ) {
        if (!this.progressionState) return null;
        if (!this.isBossLevelFor(this.battleLevel)) {
            return null;
        }

        const state = this.progressionState;
        const rescueCPPackage = this.getRescuePackage(
            state.cpPackages
        );
        const rescueMaxAlivePackage = this.getRescuePackage(
            state.maxAlivePackages
        );
        const enemyCP = this.getEnemyInitialCP();
        const enemyMaxAlive = this.getEnemyMaxAlive();
        const cpGapRatio = Math.max(
            0,
            enemyCP - state.playerInitialCP
        ) / Math.max(1, enemyCP);
        const maxAliveGapRatio = Math.max(
            0,
            enemyMaxAlive - state.playerMaxAlive
        ) / Math.max(1, enemyMaxAlive);
        const rescueKind = this.selectRescueKind(
            !!rescueCPPackage,
            !!rescueMaxAlivePackage,
            cpGapRatio,
            maxAliveGapRatio
        );
        let record: PurchaseRecord | null = null;

        if (rescueKind === 'initial-cp' && rescueCPPackage) {
            record = this.grantVideoRescueGold(
                state,
                rescueCPPackage,
                'initial-cp'
            );
        } else if (
            rescueKind === 'max-alive' &&
            rescueMaxAlivePackage
        ) {
            record = this.grantVideoRescueGold(
                state,
                rescueMaxAlivePackage,
                'max-alive'
            );
        }

        if (!record) return null;

        records.push(record);

        return record;
    }

    private getRescuePackage(
        packages: SavedProgressionPackage[]
    ) {
        return packages
            .filter((item) => !item.claimed)
            .sort((a, b) =>
                Math.max(0, a.offerLevel - this.battleLevel) -
                Math.max(0, b.offerLevel - this.battleLevel) ||
                a.targetLevel - b.targetLevel ||
                a.offerLevel - b.offerLevel ||
                a.id.localeCompare(b.id)
            )[0] || null;
    }

    private grantVideoRescueGold(
        state: SavedProgressionState,
        packageItem: SavedProgressionPackage,
        kind: 'initial-cp' | 'max-alive'
    ): PurchaseRecord {
        const goldBefore = state.playerGold;
        const valueBefore = kind === 'initial-cp'
            ? state.playerInitialCP
            : state.playerMaxAlive;
        const cost = kind === 'initial-cp'
            ? this.getInitialCPPackageCost(packageItem.delta)
            : this.getMaxAlivePackageCost(
                packageItem.delta,
                state.playerMaxAlive
            );

        if (packageItem.offerLevel > this.battleLevel) {
            packageItem.offerLevel = this.battleLevel;
        }

        state.playerGold += cost;

        const record: PurchaseRecord = {
            id: `rescue:gold:${packageItem.id}`,
            kind,
            label: `Video rescue +${cost} Gold`,
            family: null,
            familyName: '',
            tier: 0,
            cost: 0,
            goldBefore,
            goldAfter: state.playerGold,
            valueBefore,
            valueAfter: valueBefore,
            source: 'video-rescue-gold',
        };

        state.rescueHistory.push(record.id);
        return record;
    }

    private selectRescueKind(
        canRescueCP: boolean,
        canRescueMaxAlive: boolean,
        cpGapRatio: number,
        maxAliveGapRatio: number
    ): 'initial-cp' | 'max-alive' | null {
        if (!canRescueCP && !canRescueMaxAlive) return null;
        if (!canRescueCP) return 'max-alive';
        if (!canRescueMaxAlive) return 'initial-cp';

        if (maxAliveGapRatio !== cpGapRatio) {
            return maxAliveGapRatio > cpGapRatio
                ? 'max-alive'
                : 'initial-cp';
        }

        return 'initial-cp';
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
            const packageId = option.id.substring(
                'initial-cp:'.length
            );
            const item = state.cpPackages.find(
                (candidate) => candidate.id === packageId
            );

            if (!item || item.claimed) return;

            item.claimed = true;
            item.claimSource = 'purchase';
            state.playerInitialCP =
                this.getPlayerCPFromState(state);
            return;
        }

        if (option.kind === 'max-alive') {
            const packageId = option.id.substring(
                'max-alive:'.length
            );
            const item = state.maxAlivePackages.find(
                (candidate) => candidate.id === packageId
            );

            if (!item || item.claimed) return;

            item.claimed = true;
            item.claimSource = 'purchase';
            state.playerMaxAlive =
                this.getPlayerMaxAliveFromState(state);
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

    private grantLossGold(
        state: SavedProgressionState,
        winGold: number
    ) {
        const granted = Math.max(
            0,
            Math.round(
                winGold *
                this.clamp01(this.lossGoldRatio)
            )
        );

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
        return Math.min(
            this.getProgressionEndLevel(),
            this.clampLevel(rule.unlockLevel)
        );
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

    private getPlayerCPMilestoneCap(level: number) {
        const schedule = this.progressionState
            ? this.progressionState.cpPackages
            : this.createCPPackageSchedule();

        return this.getPlayerCPStart() + schedule
            .filter((item) =>
                item.offerLevel <= this.clampLevel(level)
            )
            .reduce(
                (sum, item) => sum + item.delta,
                0
            );
    }

    private getPlayerCPPackagesOffered(level: number) {
        const schedule = this.progressionState
            ? this.progressionState.cpPackages
            : this.createCPPackageSchedule();
        const safeLevel = this.clampLevel(level);

        return schedule.filter((item) =>
            item.offerLevel <= safeLevel
        ).length;
    }

    private getNextAvailableCPPackage(
        state: SavedProgressionState,
        level: number
    ) {
        const safeLevel = this.clampLevel(level);

        return state.cpPackages
            .filter((item) =>
                !item.claimed &&
                item.offerLevel <= safeLevel
            )
            .sort((a, b) =>
                a.offerLevel - b.offerLevel ||
                a.targetLevel - b.targetLevel ||
                a.id.localeCompare(b.id)
            )[0] || null;
    }

    private getPlayerCPFromState(
        state: SavedProgressionState
    ) {
        return this.getPlayerCPStart() +
            Math.max(0, state.playerInitialCPOverflow) +
            state.cpPackages
                .filter((item) => item.claimed)
                .reduce(
                    (sum, item) => sum + item.delta,
                    0
                );
    }

    private createCPPackageSchedule():
        SavedProgressionPackage[] {
        const result: SavedProgressionPackage[] = [];
        const milestones =
            this.getProgressionMilestoneLevels();
        let previousLevel = 0;
        let previousCap = this.getPlayerCPStart();

        for (let i = 0; i < milestones.length; i++) {
            const targetLevel = milestones[i];
            const targetCap = Math.max(
                previousCap,
                this.getLevelBaseInitialCP(targetLevel)
            );
            const totalDelta = targetCap - previousCap;

            if (totalDelta <= 0) {
                previousLevel = targetLevel;
                previousCap = targetCap;
                continue;
            }

            const firstOfferLevel = previousLevel > 0
                ? previousLevel + 1
                : 1;
            const lastNormalLevel = targetLevel - 1;
            const candidateCount = Math.max(
                1,
                lastNormalLevel >= firstOfferLevel
                    ? lastNormalLevel - firstOfferLevel + 1
                    : 1
            );
            const packageCount = Math.min(
                totalDelta,
                Math.max(1, Math.ceil(candidateCount / 2))
            );
            const offerLevels =
                this.pickDeterministicOfferLevels(
                    firstOfferLevel,
                    lastNormalLevel >= firstOfferLevel
                        ? lastNormalLevel
                        : targetLevel,
                    packageCount,
                    targetLevel,
                    'cp'
                );
            let distributed = 0;

            for (let packageIndex = 0;
                packageIndex < packageCount;
                packageIndex++) {
                const cumulative = Math.round(
                    totalDelta *
                    (packageIndex + 1) /
                    packageCount
                );
                const delta = cumulative - distributed;

                distributed = cumulative;
                result.push({
                    id: `cp:${targetLevel}:${packageIndex + 1}`,
                    targetLevel,
                    offerLevel: offerLevels[packageIndex],
                    delta,
                    claimed: false,
                    claimSource: '',
                });
            }

            previousLevel = targetLevel;
            previousCap = targetCap;
        }

        return result.sort((a, b) =>
            a.offerLevel - b.offerLevel ||
            a.targetLevel - b.targetLevel ||
            a.id.localeCompare(b.id)
        );
    }

    private getProgressionMilestoneLevels() {
        const endLevel = this.getProgressionEndLevel();
        const pace = Math.max(
            0,
            Math.floor(this.bossStagePace)
        );
        const result: number[] = [];

        if (pace > 0) {
            for (let level = pace;
                level <= endLevel;
                level += pace) {
                result.push(level);
            }
        }

        if (
            result.length <= 0 ||
            result[result.length - 1] !== endLevel
        ) {
            result.push(endLevel);
        }

        return result;
    }

    private pickDeterministicOfferLevels(
        firstLevel: number,
        lastLevel: number,
        count: number,
        targetLevel: number,
        scheduleKey: string
    ) {
        const candidates: Array<{
            level: number;
            order: number;
        }> = [];

        for (let level = firstLevel;
            level <= lastLevel;
            level++) {
            candidates.push({
                level,
                order: this.stableHash(
                    `${targetLevel}:${level}:` +
                    `${scheduleKey}-offer`
                ),
            });
        }

        return candidates
            .sort((a, b) =>
                a.order - b.order || a.level - b.level
            )
            .slice(0, Math.min(count, candidates.length))
            .map((item) => item.level)
            .sort((a, b) => a - b);
    }

    private stableHash(value: string) {
        let hash = 2166136261;

        for (let i = 0; i < value.length; i++) {
            hash ^= value.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }

        return hash >>> 0;
    }

    private getNextPlayerCPPackageSnapshot(
        state: SavedProgressionState,
        level: number
    ) {
        const item = this.getNextAvailableCPPackage(
            state,
            level
        );

        return item ? { ...item } : null;
    }

    private getUnitProgressionEndLevel() {
        return this.getProgressionEndLevel();
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
        const schedule = this.progressionState
            ? this.progressionState.maxAlivePackages
            : this.createMaxAlivePackageSchedule();

        const safeLevel = this.clampLevel(level);
        const offeredDelta = schedule
            .filter((item) =>
                item.offerLevel <= safeLevel
            )
            .reduce(
                (sum, item) => sum + item.delta,
                0
            );

        return this.clampPlayerMaxAlive(
            this.getPlayerMaxAliveStart() + offeredDelta
        );
    }

    private getPlayerMaxAlivePackagesOffered(
        level: number
    ) {
        const schedule = this.progressionState
            ? this.progressionState.maxAlivePackages
            : this.createMaxAlivePackageSchedule();
        const safeLevel = this.clampLevel(level);

        return schedule.filter((item) =>
            item.offerLevel <= safeLevel
        ).length;
    }

    private getNextAvailableMaxAlivePackage(
        state: SavedProgressionState,
        level: number
    ) {
        const safeLevel = this.clampLevel(level);

        return state.maxAlivePackages
            .filter((item) =>
                !item.claimed &&
                item.offerLevel <= safeLevel
            )
            .sort((a, b) =>
                a.offerLevel - b.offerLevel ||
                a.targetLevel - b.targetLevel ||
                a.id.localeCompare(b.id)
            )[0] || null;
    }

    private getPlayerMaxAliveFromState(
        state: SavedProgressionState
    ) {
        const claimedDelta = state.maxAlivePackages
            .filter((item) => item.claimed)
            .reduce(
                (sum, item) => sum + item.delta,
                0
            );

        return this.clampPlayerMaxAlive(
            this.getPlayerMaxAliveStart() + claimedDelta
        );
    }

    private createMaxAlivePackageSchedule():
        SavedProgressionPackage[] {
        const result: SavedProgressionPackage[] = [];

        if (!this.allowMaxWave) {
            const delta = Math.max(
                0,
                this.getPlayerMaxAliveMax() -
                this.getPlayerMaxAliveStart()
            );

            for (let i = 0; i < delta; i++) {
                result.push({
                    id: `max-alive:1:${i + 1}`,
                    targetLevel: 1,
                    offerLevel: 1,
                    delta: 1,
                    claimed: false,
                    claimSource: '',
                });
            }

            return result;
        }

        const milestones =
            this.getProgressionMilestoneLevels();
        let previousLevel = 0;
        let previousCap = this.getPlayerMaxAliveStart();

        for (let i = 0; i < milestones.length; i++) {
            const targetLevel = milestones[i];
            const targetCap = this.clampPlayerMaxAlive(
                Math.max(
                    previousCap,
                    this.getLevelBaseMaxAlive(targetLevel)
                )
            );
            const totalDelta = targetCap - previousCap;

            if (totalDelta <= 0) {
                previousLevel = targetLevel;
                previousCap = targetCap;
                continue;
            }

            const firstOfferLevel = previousLevel > 0
                ? previousLevel + 1
                : 1;
            const lastNormalLevel = targetLevel - 1;
            const safeLastOfferLevel =
                lastNormalLevel >= firstOfferLevel
                    ? lastNormalLevel
                    : targetLevel;
            const offerLevels =
                this.pickDeterministicOfferLevels(
                    firstOfferLevel,
                    safeLastOfferLevel,
                    totalDelta,
                    targetLevel,
                    'max-alive'
                );

            for (let packageIndex = 0;
                packageIndex < totalDelta;
                packageIndex++) {
                result.push({
                    id: `max-alive:${targetLevel}:` +
                        `${packageIndex + 1}`,
                    targetLevel,
                    offerLevel: offerLevels[
                        packageIndex % offerLevels.length
                    ],
                    delta: 1,
                    claimed: false,
                    claimSource: '',
                });
            }

            previousLevel = targetLevel;
            previousCap = targetCap;
        }

        return result.sort((a, b) =>
            a.offerLevel - b.offerLevel ||
            a.targetLevel - b.targetLevel ||
            a.id.localeCompare(b.id)
        );
    }

    private getNextPlayerMaxAlivePackageSnapshot(
        state: SavedProgressionState,
        level: number
    ) {
        const item = this.getNextAvailableMaxAlivePackage(
            state,
            level
        );

        return item ? { ...item } : null;
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

    private clearProgressionStorage() {
        const keys = [
            this.progressionStorageKey,
            'battle-progression-v1',
            'battle-progression-v2',
            'battle-progression-v3',
            'battle-progression-v4',
            'battle-progression-v5',
            'battle-progression-v6',
            'battle-progression-v7',
        ];

        for (let i = 0; i < keys.length; i++) {
            if (keys.indexOf(keys[i]) !== i) continue;
            sys.localStorage.removeItem(keys[i]);
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
            'resetProgression',
            'reset',
        ];

        for (let i = 0; i < removeKeys.length; i++) {
            params.delete(removeKeys[i]);
            params.delete(`?${removeKeys[i]}`);
        }

        params.set('progression', '1');
        params.set('progressionResume', '1');
        params.set('currentLevel', `${this.clampLevel(level)}`);
        params.set('TotalLevels', `${this.getSafeTotalLevels()}`);
        params.set(
            'ProgressionEndLevel',
            `${this.getProgressionEndLevel()}`
        );
        params.delete('totalLevels');
        params.delete('progressionEndLevel');

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
        const queriedProgressionEnd = this.getQueryInt(
            params,
            ['ProgressionEndLevel', 'progressionEndLevel'],
            0
        );
        const progressionResume = this.getQueryInt(
            params,
            ['progressionResume'],
            0
        );
        const forceProgressionReset = this.getQueryInt(
            params,
            ['resetProgression', 'reset'],
            0
        ) === 1;
        const hasQueriedLevel =
            params.has('currentLevel') ||
            params.has('?currentLevel');

        this.resetProgressionRequested =
            forceProgressionReset ||
            queriedLevel <= 0 ||
            (
                hasQueriedLevel &&
                queriedLevel === 1 &&
                progressionResume !== 1
            );
        this.levelQueryActive =
            totalLevels > 0 ||
            queriedProgressionEnd > 0 ||
            progressionParam === 1 ||
            forceProgressionReset ||
            hasQueriedLevel;

        if (totalLevels > 0) {
            this.totalLevels = Math.max(1, totalLevels);
        }

        if (queriedProgressionEnd > 0) {
            this.progressionEndLevel = Math.max(
                1,
                queriedProgressionEnd
            );
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
        return this.getProgression01(
            this.getSafeCurrentLevel()
        );
    }

    private getProgression01(level: number) {
        const endLevel = this.getProgressionEndLevel();
        const safeLevel = this.clampLevel(level);

        if (endLevel <= 1) return 1;

        return this.clamp01(
            (safeLevel - 1) / (endLevel - 1)
        );
    }

    private getProgressionEndLevel() {
        return Math.max(
            1,
            Math.min(
                this.getSafeTotalLevels(),
                Math.floor(this.progressionEndLevel)
            )
        );
    }

    private getLevelBaseInitialCP(level: number) {
        return Math.round(
            this.lerp(
                this.initialCombatPointMin,
                this.initialCombatPointMax,
                this.getProgression01(level)
            )
        );
    }

    private getLevelBaseMaxAlive(level: number) {
        return Math.round(
            this.lerp(
                this.maxAliveWavesMin,
                this.maxAliveWavesMax,
                this.getProgression01(level)
            )
        );
    }

    private getLevelMaxAlive(level: number) {
        const safeLevel = this.clampLevel(level);

        return Math.round(
            Math.min(
                Math.max(0, this.maxAliveWavesMax),
                this.getLevelBaseMaxAlive(safeLevel) *
                this.getBossMultiplier(
                    this.bossMaxAliveWavesMultiplier,
                    this.isBossLevelFor(safeLevel)
                )
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
