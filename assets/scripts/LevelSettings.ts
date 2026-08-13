import {
    _decorator,
    Component,
    director,
    game,
    sys,
} from 'cc';
import { GameManager } from './GameManager';
import type {
    BattleProgressionProvider,
} from './GameManager';
import { BattleArmyBrain } from './BattleArmyBrain';
import {
    BattleCardDefinition,
    BattleCardModifier,
    BattleCardOpponentCondition,
    BattleCardTarget,
} from './BattleCardDatabase';
import { CounterSettings } from './CounterSettings';
import {
    UnitFamily,
    unitFamilyToName,
} from './BattleTypes';
import { UnitPrefabEntry } from './BattleUnitDatabase';

const { ccclass, property } = _decorator;

type PurchaseKind =
    'battle-entry' |
    'unit-unlock' |
    'unit-count' |
    'initial-cp' |
    'max-alive' |
    'card-unlock' |
    'card-cooldown-upgrade' |
    'card-budget-upgrade';

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

interface SavedCardProgression {
    id: string;
    owned: boolean;
    cooldownUpgradeLevel: number;
    budgetUpgradeLevel: number;
    cooldownRemaining: number;
}

interface BotSimulationEvent {
    type: string;
    battleLevel: number;
    choice: string;
    targetId: string;
    targetCost: number;
    baseGold: number;
    goldGranted: number;
    delayedPurchaseCount?: number;
    continuationChance?: number;
}

interface SavedProgressionState {
    version: number;
    currentLevel: number;
    playerGold: number;
    adsReward: number;
    levelLossCount: number;
    consecutiveSideWins: number;
    sideMissionActive: boolean;
    playerInitialCP: number;
    playerInitialCPOverflow: number;
    cpPackages: SavedProgressionPackage[];
    maxAlivePackages: SavedProgressionPackage[];
    playerMaxAlive: number;
    totalPurchases: number;
    mainBattleEntryCount: number;
    units: SavedUnitProgression[];
    cards: SavedCardProgression[];
    enemyCardIdsByLevel: Record<string, string[]>;
    botSimulationEvents: BotSimulationEvent[];
}

interface PurchaseOption {
    id: string;
    kind: PurchaseKind;
    cost: number;
    family: UnitFamily | null;
    tier: number;
    delta: number;
    label: string;
    cardId: string | null;
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
    cardId: string | null;
}

@ccclass('UnitProgressionRule')
export class UnitProgressionRule {

    @property({ type: UnitFamily })
    family: UnitFamily = UnitFamily.Spear;

    @property({ min: 1, max: 3, step: 1 })
    tier = 1;

    // Kept only to read existing scene data. New progression ignores it.
    @property({ visible: false })
    unlockLevel = 1;

    @property({
        min: 0,
        max: 1,
        step: 0.05,
        tooltip: 'Normalized campaign progress where this unit becomes available. It scales with Progression End Level and is aligned to the next boss stage when bosses are enabled.',
    })
    unlockProgression = 0;

    @property({ min: 1, step: 1 })
    unlockCount = 5;

    @property({ min: 1, step: 1 })
    maxCount = 10;
}

function createUnitProgressionRule(
    family: UnitFamily,
    unlockProgression: number,
    unlockCount: number,
    maxCount: number
) {
    const rule = new UnitProgressionRule();

    rule.family = family;
    rule.unlockProgression = unlockProgression;
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
        tooltip: 'Reset the current Cocos battle scene after each campaign battle. A win advances one level; a loss retries the same level.'
    })
    autoReloadProgression = true;

    @property({
        tooltip: 'Let BattleArmyBrain A simulate player purchases between battles. It may buy multiple affordable packages.'
    })
    purchasingSimulation = true;

    @property({
        displayName: 'Allow Ads Rescue',
        tooltip: 'Allow bot simulation to choose the Gold x2 rewarded-ad claim. Side missions remain available without ads.'
    })
    allowAdsRescue = true;

    @property({
        tooltip: 'Persistent campaign storage key. Opening currentLevel=1 starts a fresh run; use resetProgression=1 to force reset even from a resume URL.'
    })
    progressionStorageKey = 'battle-progression-v8';

    @property({
        min: 1,
        step: 1,
        tooltip: 'Cards each team may bring into one battle. This is the future deck-upgrade hook.'
    })
    battleCardDeckSize = 3;

    @property({ min: 0, step: 1 })
    initialPlayerGold = 0;

    @property({ min: 0, step: 1 })
    playerInitialCPStart = 300;

    @property({ min: 0, step: 1 })
    playerMaxAliveStart = 4;

    @property({ min: 0, step: 1 })
    playerMaxAliveMax = 10;

    @property({ min: 0.01, step: 0.1 })
    winGoldPerEnemyCP = 1.15;

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
        displayName: 'Main Battle Entry Fee Ratio',
        tooltip: 'Gold charged before each main progression battle after the first. It is a ratio of that battle win reward and rounds up to 50. Side missions are free.'
    })
    mainBattleEntryFeeRatio = 0.35;

    @property({ min: 1, step: 1 })
    unitUnlockCostMultiplier = 5;

    @property({ min: 0.01, step: 0.1 })
    initialCPGoldPerPoint = 10;

    @property({ min: 1, step: 1 })
    maxAliveBasePrice = 1000;

    @property({ type: [UnitProgressionRule] })
    unitProgressionRules: UnitProgressionRule[] = [
        createUnitProgressionRule(
            UnitFamily.Spear,
            0,
            5,
            10
        ),
        createUnitProgressionRule(
            UnitFamily.Sword,
            0,
            5,
            10
        ),
        createUnitProgressionRule(
            UnitFamily.Axeman,
            0.2,
            5,
            10
        ),
        createUnitProgressionRule(
            UnitFamily.Archer,
            0.5,
            3,
            5
        ),
        createUnitProgressionRule(
            UnitFamily.Cavalry,
            0.7,
            5,
            10
        ),
        createUnitProgressionRule(
            UnitFamily.Monk,
            0.9,
            1,
            1
        ),
    ];

    private progressionState:
        SavedProgressionState | null = null;
    private battleLevel = 1;
    private nextBattlePending = false;
    private levelQueryActive = false;
    private resetProgressionRequested = false;
    private preBattlePurchases: PurchaseRecord[] = [];
    private currentPlayerBattleCardIds: string[] = [];
    private currentEnemyBattleCardIds: string[] = [];
    private sideMissionBattle = false;
    private static runtimeBattleReset = false;

    onLoad() {
        this.migrateLegacyUnitUnlockProgression();

        // A real campaign owns its state in local storage. URL parameters are
        // retained only for non-progression telemetry/debug sessions, so an
        // old Preview URL cannot override a just-saved next battle.
        if (!this.enableProgression) {
            this.applyTelemetryLevelQuery();
        }

        if (
            this.enableProgression &&
            !this.levelQueryActive &&
            !LevelSettings.runtimeBattleReset
        ) {
            this.resetProgressionRequested = true;
        }

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

        if (this.sideMissionBattle) {
            return this.handleSideMissionBattleResult(
                winnerTeam,
                loserTeam,
                reason
            );
        }

        const state = this.progressionState;
        const battleLevel = this.battleLevel;
        const before = this.createTelemetrySnapshot();
        state.consecutiveSideWins = 0;
        const purchases: PurchaseRecord[] = [];
        const usedPlayerCards = this.currentPlayerBattleCardIds.slice();
        this.advancePlayerCardCooldowns(
            state,
            usedPlayerCards
        );
        const newlyOffered =
            this.offerIntroducedUnits(battleLevel);
        const mainReward = this.getMainBattleReward(
            state,
            battleLevel
        );
        const winGold = mainReward.gold;

        let goldReward = 0;
        let rewardClaim: BotSimulationEvent | null = null;

        if (winnerTeam === 0) {
            rewardClaim = this.grantBotGoldClaim(
                state,
                winGold,
                'progression-win',
                mainReward.targetId,
                mainReward.targetCost
            );
            goldReward = rewardClaim.goldGranted;
            state.levelLossCount = 0;
        } else if (loserTeam === 0) {
            state.levelLossCount++;
        }

        const campaignComplete = winnerTeam === 0 &&
            battleLevel >= this.getSafeTotalLevels();
        const nextMainBattleLevel = winnerTeam === 0
            ? Math.min(
                this.getSafeTotalLevels(),
                battleLevel + 1
            )
            : battleLevel;

        if (this.purchasingSimulation) {
            this.runPurchaseSimulation(
                purchases,
                'between-battles',
                campaignComplete
                    ? 0
                    : this.getMainBattleEntryFee(
                        nextMainBattleLevel
                    )
            );
        }

        if (winnerTeam === 0) {
            if (campaignComplete) {
                state.currentLevel = this.getSafeTotalLevels();
            } else {
                state.currentLevel = battleLevel + 1;
            }
        } else {
            state.currentLevel = battleLevel;
        }

        this.currentLevel = state.currentLevel;
        this.applyProgressionRuntimeState(false);
        state.sideMissionActive = false;
        this.sideMissionBattle = false;
        this.nextBattlePending = !campaignComplete;
        this.saveProgressionState();

        const result = {
            battleLevel,
            totalLevels: this.getSafeTotalLevels(),
            winnerTeam,
            loserTeam,
            reason,
            campaignComplete,
            winGold,
            goldReward,
            rewardClaim,
            usedPlayerCards,
            newlyOffered,
            purchases,
            before,
            after: this.createTelemetrySnapshot(),
        };

        return result;
    }

    private handleSideMissionBattleResult(
        winnerTeam: number,
        loserTeam: number,
        reason: string
    ) {
        if (!this.progressionState) return null;

        const state = this.progressionState;
        const before = this.createTelemetrySnapshot();
        let goldReward = 0;
        let rewardClaim: BotSimulationEvent | null = null;
        let route = 'progression';

        if (winnerTeam === 0) {
            const continuation =
                this.getSideMissionContinuation(state);
            const reward = this.getSideMissionReward(state);
            rewardClaim = this.grantBotGoldClaim(
                state,
                reward.gold,
                'side-mission-win',
                reward.targetId,
                reward.targetCost
            );
            goldReward = rewardClaim.goldGranted;
            state.consecutiveSideWins++;
            state.levelLossCount = 0;
            route = Math.random() < continuation.chance
                ? 'side-mission'
                : 'progression';
            this.recordBotSimulationEvent(state, {
                type: 'side-mission-win-route-roll',
                battleLevel: this.battleLevel,
                choice: route,
                targetId: reward.targetId,
                targetCost: reward.targetCost,
                baseGold: rewardClaim.baseGold,
                goldGranted: rewardClaim.goldGranted,
                delayedPurchaseCount:
                    continuation.delayedPurchaseCount,
                continuationChance: continuation.chance,
            });
        } else {
            const continuation =
                this.getSideMissionContinuation(state);
            route = Math.random() < continuation.chance
                ? 'side-mission'
                : 'progression';
            this.recordBotSimulationEvent(state, {
                type: 'side-mission-loss-roll',
                battleLevel: this.battleLevel,
                choice: route,
                targetId: '',
                targetCost: 0,
                baseGold: 0,
                goldGranted: 0,
                delayedPurchaseCount:
                    continuation.delayedPurchaseCount,
                continuationChance: continuation.chance,
            });
        }

        state.currentLevel = this.battleLevel;
        state.sideMissionActive = route === 'side-mission';
        this.sideMissionBattle = state.sideMissionActive;
        this.currentLevel = this.battleLevel;
        this.saveProgressionState();
        this.nextBattlePending = true;

        return {
            mode: 'side-mission',
            battleLevel: this.battleLevel,
            totalLevels: this.getSafeTotalLevels(),
            winnerTeam,
            loserTeam,
            reason,
            campaignComplete: false,
            winGold: 0,
            goldReward,
            route,
            rewardClaim,
            usedPlayerCards: [],
            newlyOffered: [],
            purchases: [],
            before,
            after: this.createTelemetrySnapshot(),
        };
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
                mainBattleEntryFeeRatio:
                    this.mainBattleEntryFeeRatio,
                mainBattleEntryFee:
                    this.getMainBattleEntryFee(
                        this.battleLevel
                    ),
                unitUnlockCostMultiplier:
                    this.unitUnlockCostMultiplier,
                initialCPGoldPerPoint:
                    this.initialCPGoldPerPoint,
                maxAliveBasePrice:
                    this.maxAliveBasePrice,
                cardDefinitions:
                    this.createCardDefinitionSnapshot(),
            },
            preBattlePurchases:
                this.preBattlePurchases.slice(),
            sideMission: {
                active: this.sideMissionBattle,
                botSimulationEvents:
                    state.botSimulationEvents.slice(),
            },
            player: {
                gold: state.playerGold,
                adsReward: state.adsReward,
                levelLossCount: state.levelLossCount,
                consecutiveSideWins: state.consecutiveSideWins,
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
                mainBattleEntryCount:
                    state.mainBattleEntryCount,
                cards: state.cards.map((card) => ({
                    ...card,
                    effectiveCooldown:
                        this.getCardEffectiveCooldown(card),
                    effectiveBudget:
                        this.getCardEffectiveBudget(card),
                })),
                selectedBattleCardIds:
                    this.currentPlayerBattleCardIds.slice(),
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
                selectedBattleCardIds:
                    this.currentEnemyBattleCardIds.slice(),
                deckCapacity: this.getEnemyBattleCardDeckSize(),
                lockedCardIds: (
                    state.enemyCardIdsByLevel[
                        String(this.battleLevel)
                    ] || []
                ).slice(),
            },
            battleCards: manager
                ? manager.getBattleCardTelemetrySnapshot()
                : [],
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

    public shouldResetBattleAfterResult() {
        return this.enableProgression &&
            this.autoReloadProgression &&
            this.nextBattlePending;
    }

    public resetBattle() {
        if (!this.nextBattlePending) return false;

        LevelSettings.runtimeBattleReset = true;
        try {
            void game.restart().catch((error) => {
                LevelSettings.runtimeBattleReset = false;
                console.error(
                    '[BattleProgression] failed to restart battle runtime.',
                    error
                );
            });
            return true;
        } catch (error) {
            LevelSettings.runtimeBattleReset = false;
            console.error(
                '[BattleProgression] could not start battle runtime restart.',
                error
            );
            return false;
        }
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

        if (!this.levelQueryActive) {
            this.sideMissionBattle = this.progressionState.sideMissionActive;
        }

        this.battleLevel = this.getSafeCurrentLevel();
        this.progressionState.currentLevel = this.battleLevel;

        if (savedLevel !== this.battleLevel) {
            this.progressionState.levelLossCount = 0;
        }

        this.offerIntroducedUnits(
            this.battleLevel
        );
        this.applyProgressionRuntimeState(true);
        this.saveProgressionState();
    }

    private completePreBattleProgression() {
        if (!this.progressionState) return;

        if (this.sideMissionBattle) {
            this.applySideMissionRuntimeState();
            this.configureSideMissionBattleCards();
            this.saveProgressionState();
            return;
        }

        if (this.purchasingSimulation) {
            const reservedEntryFee =
                this.getCurrentMainBattleEntryFee();
            this.runPurchaseSimulation(
                this.preBattlePurchases,
                'pre-battle',
                reservedEntryFee
            );

            if (this.tryRouteBotToSideMission()) {
                this.resetIntoSideMission();
                return;
            }

            if (!this.tryPayMainBattleEntryFee(
                this.preBattlePurchases
            )) {
                this.resetIntoSideMission();
                return;
            }
        }

        this.applyProgressionRuntimeState(true);
        this.configureBattleCardsForCurrentBattle();
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
                this.getRuleUnlockLevel(rule) <= 1;

            units.push({
                key: this.getRuleKey(rule),
                offered: startsOwned,
                unlocked: startsOwned,
                unitCount: this.getRuleUnlockCount(rule),
            });
        }

        return {
            version: 10,
            currentLevel: this.getSafeCurrentLevel(),
            playerGold: Math.max(
                0,
                Math.floor(this.initialPlayerGold)
            ),
            adsReward: 0,
            levelLossCount: 0,
            consecutiveSideWins: 0,
            sideMissionActive: false,
            playerInitialCP: this.getPlayerCPStart(),
            playerInitialCPOverflow: 0,
            cpPackages: this.createCPPackageSchedule(),
            maxAlivePackages:
                this.createMaxAlivePackageSchedule(),
            playerMaxAlive: this.getPlayerMaxAliveStart(),
            totalPurchases: 0,
            mainBattleEntryCount: 0,
            units,
            cards: this.createInitialCardProgression(),
            enemyCardIdsByLevel: {},
            botSimulationEvents: [],
        };
    }

    public tryPurchaseCard(
        cardId: string,
        upgrade: boolean | 'budget' = false
    ) {
        if (!this.progressionState || !cardId) return false;

        const expectedKind = upgrade === 'budget'
            ? 'card-budget-upgrade'
            : upgrade
                ? 'card-cooldown-upgrade'
                : 'card-unlock';
        const option = this.getPurchaseOptions(
            this.progressionState
        ).find((candidate) =>
            candidate.kind === expectedKind &&
            candidate.cardId === cardId &&
            candidate.cost <= this.progressionState!.playerGold
        );

        if (!option) return false;

        this.applyPurchase(
            option,
            this.progressionState,
            'player-card-shop'
        );
        this.applyProgressionRuntimeState(false);
        this.saveProgressionState();
        return true;
    }

    // Call only after the rewarded-video callback succeeds.
    public tryFinishCardCooldownWithAd(cardId: string) {
        if (!this.progressionState || !cardId) return false;

        const card = this.getSavedCard(
            this.progressionState,
            cardId
        );

        if (
            !card || !card.owned ||
            card.cooldownRemaining <= 0
        ) {
            return false;
        }

        const cooldownBefore = card.cooldownRemaining;
        card.cooldownRemaining = 0;
        this.progressionState.adsReward++;
        this.recordBotSimulationEvent(this.progressionState, {
            type: 'card-cooldown-finish-ad',
            battleLevel: this.battleLevel,
            choice: 'finish-cooldown-ad',
            targetId: cardId,
            targetCost: cooldownBefore,
            baseGold: 0,
            goldGranted: 0,
        });
        this.saveProgressionState();
        return true;
    }

    public setPlayerBattleCardSelection(cardIds: string[]) {
        if (!this.progressionState) return;

        this.currentPlayerBattleCardIds =
            this.filterReadyPlayerCardIds(cardIds);

        const manager = this.getGameManager();

        if (manager) {
            manager.configureBattleCardDecks(
                this.currentPlayerBattleCardIds,
                this.currentEnemyBattleCardIds,
                this.getPlayerCardBudgetUpgradeLevels(
                    this.progressionState
                ),
                this.getBattleCardDeckSize(),
                this.getEnemyBattleCardDeckSize()
            );
        }
    }

    private configureBattleCardsForCurrentBattle() {
        const state = this.progressionState;
        const manager = this.getGameManager();
        const database = manager
            ? manager.battleCardDatabase
            : null;

        if (!state || !manager || !database) return;

        if (this.purchasingSimulation) {
            this.currentPlayerBattleCardIds =
                this.selectRandomCardIds(
                    database.cards.filter((definition) => {
                        const saved = this.getSavedCard(
                            state,
                            definition.id
                        );

                        return !!saved &&
                            saved.owned &&
                            this.isCardEligibleForTeam(
                                definition,
                                0,
                                state
                            ) && (
                                saved.cooldownRemaining <= 0 ||
                                Math.random() < 0.5
                            );
                    }),
                    [],
                    this.getBattleCardDeckSize()
                );
            this.finishBotSelectedCardCooldowns(state);
        } else {
            this.currentPlayerBattleCardIds =
                this.filterReadyPlayerCardIds(
                    this.currentPlayerBattleCardIds
                );
        }

        const enemyDeckSize = this.getEnemyBattleCardDeckSize();
        const enemyDeckKey = String(this.battleLevel);
        const savedEnemyDeck = state.enemyCardIdsByLevel[
            enemyDeckKey
        ];

        if (Array.isArray(savedEnemyDeck)) {
            // A retry must preserve the original deck, even if the player
            // changes roster and one of its cards no longer has a target.
            this.currentEnemyBattleCardIds = savedEnemyDeck.slice(
                0,
                enemyDeckSize
            );
        } else {
            this.currentEnemyBattleCardIds =
                this.selectRandomCardIds(
                    database.getEnemyCards(
                        this.isBossLevelFor(this.battleLevel)
                    ).filter((definition) =>
                        this.isCardEligibleForTeam(
                            definition,
                            1,
                            state
                        )
                    ),
                    [],
                    enemyDeckSize
                );
            state.enemyCardIdsByLevel[enemyDeckKey] =
                this.currentEnemyBattleCardIds.slice();
        }

        manager.configureBattleCardDecks(
            this.currentPlayerBattleCardIds,
            this.currentEnemyBattleCardIds,
            this.getPlayerCardBudgetUpgradeLevels(state),
            this.getBattleCardDeckSize(),
            enemyDeckSize
        );
    }

    private filterReadyPlayerCardIds(cardIds: string[]) {
        if (!this.progressionState) return [];

        const manager = this.getGameManager();
        const database = manager
            ? manager.battleCardDatabase
            : null;

        if (!database || !Array.isArray(cardIds)) return [];

        const result: string[] = [];
        const used = new Set<string>();

        for (let i = 0; i < cardIds.length; i++) {
            const id = cardIds[i];

            if (
                !id || used.has(id) ||
                result.length >= this.getBattleCardDeckSize()
            ) {
                continue;
            }

            const definition = database.getCard(id);
            const saved = this.getSavedCard(
                this.progressionState,
                id
            );

            if (!definition || !saved || !saved.owned) continue;
            if (!this.isCardEligibleForTeam(
                definition,
                0,
                this.progressionState
            )) {
                continue;
            }
            if (saved.cooldownRemaining > 0) continue;

            used.add(id);
            result.push(id);
        }

        return result;
    }

    public isBossBattle() {
        return this.isBossLevelFor(this.battleLevel);
    }

    private getBattleCardDeckSize() {
        return Math.max(
            1,
            Math.floor(this.battleCardDeckSize)
        );
    }

    private getEnemyBattleCardDeckSize() {
        return this.getEnemyBattleCardDeckSizeFor(
            this.battleLevel
        );
    }

    private getEnemyBattleCardDeckSizeFor(level: number) {
        const state = this.progressionState;
        const regularCapacity = state
            ? Math.min(
                2,
                this.getPlayerCardProgressionWave(state)
            )
            : 0;

        return this.isBossLevelFor(level)
            ? Math.min(
                3,
                regularCapacity + 1,
                this.getBattleCardDeckSize()
            )
            : Math.min(
                2,
                regularCapacity,
                this.getBattleCardDeckSize()
            );
    }

    private selectRandomCardIds(
        definitions: BattleCardDefinition[],
        excludedIds: string[],
        maxCount: number
    ) {
        const uniqueDefinitions = definitions.filter((definition, index) =>
            !!definition &&
            !!definition.id &&
            definitions.findIndex((candidate) =>
                candidate && candidate.id === definition.id
            ) === index
        );
        const excluded = new Set(excludedIds || []);
        const nonRepeating = uniqueDefinitions.filter(
            (definition) => !excluded.has(definition.id)
        );
        const source = nonRepeating.length >= maxCount
            ? nonRepeating.slice()
            : uniqueDefinitions.slice();
        const result: string[] = [];

        while (source.length > 0 && result.length < maxCount) {
            const index = Math.floor(Math.random() * source.length);
            const definition = source.splice(index, 1)[0];

            if (definition) result.push(definition.id);
        }

        return result;
    }

    private advancePlayerCardCooldowns(
        state: SavedProgressionState,
        usedCardIds: string[]
    ) {
        for (let i = 0; i < state.cards.length; i++) {
            const card = state.cards[i];

            if (!card.owned || card.cooldownRemaining <= 0) {
                continue;
            }

            card.cooldownRemaining = Math.max(
                0,
                card.cooldownRemaining - 1
            );
        }

        for (let i = 0; i < usedCardIds.length; i++) {
            const card = this.getSavedCard(state, usedCardIds[i]);

            if (!card || !card.owned) continue;

            card.cooldownRemaining = this.getCardEffectiveCooldown(
                card
            );
        }
    }

    private createInitialCardProgression() {
        const manager = this.getGameManager();
        const database = manager
            ? manager.battleCardDatabase
            : null;

        if (!database) return [];

        return database.cards
            .filter((definition) => !!definition && !!definition.id)
            .map((definition) => ({
                id: definition.id,
                owned: false,
                cooldownUpgradeLevel: 0,
                budgetUpgradeLevel: 0,
                cooldownRemaining: 0,
            }));
    }

    private getSavedCard(
        state: SavedProgressionState,
        id: string
    ) {
        for (let i = 0; i < state.cards.length; i++) {
            const card = state.cards[i];

            if (card.id === id) return card;
        }

        return null;
    }

    private getCardEffectiveCooldown(card: SavedCardProgression) {
        const manager = this.getGameManager();
        const definition = manager && manager.battleCardDatabase
            ? manager.battleCardDatabase.getCard(card.id)
            : null;

        if (!definition) return 0;

        return Math.max(
            1,
            Math.floor(definition.baseCooldownBattles) -
            Math.max(0, Math.min(2, card.cooldownUpgradeLevel))
        );
    }

    private getCardEffectiveBudget(card: SavedCardProgression) {
        const manager = this.getGameManager();
        const definition = manager && manager.battleCardDatabase
            ? manager.battleCardDatabase.getCard(card.id)
            : null;

        if (!definition) return 0;

        return Math.max(
            1,
            Math.round(
                Math.max(1, definition.baseBudget) *
                (1 + Math.max(
                    0,
                    Math.min(2, card.budgetUpgradeLevel)
                ) * 0.4)
            )
        );
    }

    private getPlayerCardBudgetUpgradeLevels(
        state: SavedProgressionState | null
    ) {
        const result: Record<string, number> = {};

        if (!state) return result;

        for (let i = 0; i < state.cards.length; i++) {
            const card = state.cards[i];

            if (!card.owned) continue;

            result[card.id] = Math.max(
                0,
                Math.min(2, card.budgetUpgradeLevel)
            );
        }

        return result;
    }

    private isCardEligibleForTeam(
        definition: BattleCardDefinition,
        team: number,
        state: SavedProgressionState
    ) {
        if (
            team === 0 &&
            !this.isCardUnlockedForPlayer(definition, state)
        ) {
            return false;
        }

        const targetFamilies = this.getCardFamiliesForTeam(team, state)
            .filter((family) =>
                this.cardMatchesFamily(definition, family)
            );

        if (targetFamilies.length <= 0) return false;

        if (
            definition.requiredEnemyFamily !==
            BattleCardOpponentCondition.Any &&
            this.getCardFamiliesForTeam(
                team === 1 ? 0 : 1,
                state
            ).indexOf(
                definition.requiredEnemyFamily - 1
            ) < 0
        ) {
            return false;
        }

        if (
            definition.modifier ===
            BattleCardModifier.CounterImmunity
        ) {
            return this.hasCounterThreat(
                team,
                targetFamilies,
                state
            );
        }

        return true;
    }

    private isCardUnlockedForPlayer(
        definition: BattleCardDefinition,
        state: SavedProgressionState
    ) {
        return this.getPlayerCardProgressionWave(state) >=
            this.getCardProgressionWave(definition);
    }

    private getPlayerCardProgressionWave(
        state: SavedProgressionState
    ) {
        if (this.isPlayerFamilyOwned(UnitFamily.Monk, state)) {
            return 4;
        }
        if (this.isPlayerFamilyOwned(UnitFamily.Cavalry, state)) {
            return 3;
        }
        if (this.isPlayerFamilyOwned(UnitFamily.Archer, state)) {
            return 2;
        }
        if (this.isPlayerFamilyOwned(UnitFamily.Axeman, state)) {
            return 1;
        }

        return 0;
    }

    private getCardProgressionWave(
        definition: BattleCardDefinition
    ) {
        if (
            definition.modifier ===
            BattleCardModifier.CounterImmunity
        ) {
            return 4;
        }
        if (definition.targetFamily === UnitFamily.Monk) {
            return 4;
        }
        if (
            definition.requiredEnemyFamily ===
            BattleCardOpponentCondition.Cavalry
        ) {
            return 3;
        }
        if (
            definition.targetFamily === UnitFamily.Archer ||
            definition.target === BattleCardTarget.Ranged
        ) {
            return 2;
        }
        if (definition.targetFamily === UnitFamily.Axeman) {
            return 1;
        }

        return 0;
    }

    private getCardUpgradeRankLimit(
        definition: BattleCardDefinition,
        state: SavedProgressionState
    ) {
        return Math.max(
            0,
            Math.min(
                2,
                this.getPlayerCardProgressionWave(state) -
                this.getCardProgressionWave(definition)
            )
        );
    }

    private isPlayerFamilyOwned(
        family: UnitFamily,
        state: SavedProgressionState
    ) {
        const rule = this.unitProgressionRules.find(
            (candidate) => candidate && candidate.family === family
        );
        const saved = rule
            ? this.getSavedUnit(state, this.getRuleKey(rule))
            : null;

        return !!saved && saved.unlocked && saved.unitCount > 0;
    }

    private getCardFamiliesForTeam(
        team: number,
        state: SavedProgressionState
    ) {
        const result: UnitFamily[] = [];

        for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];

            if (!rule) continue;

            const saved = this.getSavedUnit(
                state,
                this.getRuleKey(rule)
            );
            const available = team === 1
                ? this.battleLevel >=
                    this.getRuleUnlockLevel(rule) &&
                    this.getEnemyUnitCount(
                        rule,
                        this.battleLevel
                    ) > 0
                : !!saved && saved.unlocked &&
                    saved.unitCount > 0;

            if (available) result.push(rule.family);
        }

        return result;
    }

    private cardMatchesFamily(
        definition: BattleCardDefinition,
        family: UnitFamily
    ) {
        switch (definition.target) {
            case BattleCardTarget.UnitFamily:
                return family === definition.targetFamily;
            case BattleCardTarget.Frontline:
                return family === UnitFamily.Spear ||
                    family === UnitFamily.Sword ||
                    family === UnitFamily.Axeman ||
                    family === UnitFamily.Cavalry;
            case BattleCardTarget.Ranged:
                return family === UnitFamily.Archer ||
                    family === UnitFamily.Monk;
            default:
                return true;
        }
    }

    private hasCounterThreat(
        protectedTeam: number,
        protectedFamilies: UnitFamily[],
        state: SavedProgressionState
    ) {
        const counter = CounterSettings.instance;

        if (!counter) return false;

        const attackingFamilies = this.getCardFamiliesForTeam(
            protectedTeam === 1 ? 0 : 1,
            state
        );

        for (let i = 0; i < attackingFamilies.length; i++) {
            for (let j = 0; j < protectedFamilies.length; j++) {
                if (
                    counter.getDamageMultiplier(
                        attackingFamilies[i],
                        protectedFamilies[j]
                    ) > 1.0001
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    private createCardDefinitionSnapshot() {
        const manager = this.getGameManager();
        const database = manager
            ? manager.battleCardDatabase
            : null;

        if (!database) return [];

        return database.cards.map((definition) => ({
            id: definition.id,
            displayName: definition.displayName,
            purchasePrice: definition.purchasePrice,
            baseCooldownBattles: definition.baseCooldownBattles,
            baseBudget: definition.baseBudget,
            target: definition.target,
            targetFamily: definition.targetFamily,
            requiredEnemyFamily:
                definition.requiredEnemyFamily,
            modifier: definition.modifier,
            modifierValue: definition.modifierValue,
            tradeoffModifier: definition.tradeoffModifier,
            tradeoffValue: definition.tradeoffValue,
            enemyPool: definition.enemyPool,
        }));
    }

    private sanitizeProgressionState(
        source: any
    ): SavedProgressionState {
        const initial =
            this.createInitialProgressionState();

        const sourceVersion = this.safeInteger(source.version, 0);

        if (
            sourceVersion !== 8 &&
            sourceVersion !== 9 &&
            sourceVersion !== 10
        ) {
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
        const savedCards = Array.isArray(source.cards)
            ? source.cards
            : [];
        const savedBotSimulationEvents = Array.isArray(
            source.botSimulationEvents
        ) ? source.botSimulationEvents : [];

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
        initial.consecutiveSideWins = Math.max(
            0,
            this.safeInteger(source.consecutiveSideWins, 0)
        );
        initial.sideMissionActive = !!source.sideMissionActive;
        initial.botSimulationEvents = savedBotSimulationEvents
            .filter((event: any) => event &&
                typeof event.type === 'string' &&
                typeof event.choice === 'string')
            .slice(-40)
            .map((event: any) => ({
                type: event.type,
                battleLevel: this.clampLevel(
                    this.safeInteger(event.battleLevel, 1)
                ),
                choice: event.choice,
                targetId: typeof event.targetId === 'string'
                    ? event.targetId
                    : '',
                targetCost: Math.max(
                    0,
                    this.safeInteger(event.targetCost, 0)
                ),
                baseGold: Math.max(
                    0,
                    this.safeInteger(event.baseGold, 0)
                ),
                goldGranted: Math.max(
                    0,
                    this.safeInteger(event.goldGranted, 0)
                ),
                delayedPurchaseCount: Math.max(
                    0,
                    this.safeInteger(event.delayedPurchaseCount, 0)
                ),
                continuationChance: this.clamp01(
                    typeof event.continuationChance === 'number'
                        ? event.continuationChance
                        : 0
                ),
            }));
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

        initial.playerInitialCP =
            this.getPlayerCPFromState(initial);
        initial.playerMaxAlive =
            this.getPlayerMaxAliveFromState(initial);
        initial.totalPurchases = Math.max(
            0,
            this.safeInteger(source.totalPurchases, 0)
        );
        initial.mainBattleEntryCount = Math.max(
            0,
            this.safeInteger(
                source.mainBattleEntryCount,
                initial.currentLevel > 1 ? 1 : 0
            )
        );
        const savedEnemyDecks = source.enemyCardIdsByLevel;

        if (
            savedEnemyDecks &&
            typeof savedEnemyDecks === 'object' &&
            !Array.isArray(savedEnemyDecks)
        ) {
            for (const key of Object.keys(savedEnemyDecks)) {
                const level = this.safeInteger(key, 0);
                const deck = savedEnemyDecks[key];

                if (level < 1 || !Array.isArray(deck)) continue;

                initial.enemyCardIdsByLevel[String(level)] =
                    deck.filter((id: any) => typeof id === 'string')
                        .slice(0, 3);
            }
        } else if (Array.isArray(source.lastEnemyCardIds)) {
            const level = initial.currentLevel;

            initial.enemyCardIdsByLevel[String(level)] =
                source.lastEnemyCardIds
                    .filter((id: any) => typeof id === 'string')
                    .slice(0, 3);
        }

        for (let i = 0; i < initial.cards.length; i++) {
            const card = initial.cards[i];
            const saved = savedCards.find(
                (candidate: any) =>
                    candidate && candidate.id === card.id
            );

            if (!saved) continue;

            card.owned = !!saved.owned;
            card.cooldownUpgradeLevel = Math.max(
                0,
                Math.min(
                    2,
                    this.safeInteger(saved.cooldownUpgradeLevel, 0)
                )
            );
            card.budgetUpgradeLevel = Math.max(
                0,
                Math.min(
                    2,
                    this.safeInteger(saved.budgetUpgradeLevel, 0)
                )
            );
            card.cooldownRemaining = Math.max(
                0,
                this.safeInteger(saved.cooldownRemaining, 0)
            );
        }

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

    private applySideMissionRuntimeState() {
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

            const enemyEntry = this.findEntryForRule(
                manager.unitDatabase.teamBUnits,
                rule
            );
            const playerUnit = this.getSavedUnit(
                state,
                this.getRuleKey(rule)
            );

            if (enemyEntry && playerUnit) {
                enemyEntry.unlocked = playerUnit.unlocked;
                enemyEntry.unitCount = playerUnit.unitCount;
            }
        }

        manager.unitDatabase.teamBInitialCombatPoint =
            state.playerInitialCP;
        manager.initialCombatPoint[1] = state.playerInitialCP;
        manager.combatPoint[1] = state.playerInitialCP;

        const enemyBrains = this.getTargetBattleArmyBrains(1);
        const baselineAccuracy = this.clamp01(
            this.lerp(
                this.decisionAccuracyMin,
                this.decisionAccuracyMax,
                this.getProgression01(this.battleLevel)
            )
        );

        for (let i = 0; i < enemyBrains.length; i++) {
            enemyBrains[i].maxAliveWaves = state.playerMaxAlive;

            if (this.allowDecisionAccuracy) {
                enemyBrains[i].decisionAccuracy = baselineAccuracy;
            }
        }
    }

    private configureSideMissionBattleCards() {
        this.currentPlayerBattleCardIds = [];
        this.currentEnemyBattleCardIds = [];

        const manager = this.getGameManager();

        if (!manager) return;

        manager.configureBattleCardDecks([], [], {}, 0, 0);
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
                    cardId: null,
                });
            }

            if (
                saved.unlocked &&
                saved.unitCount <
                this.getPlayerUnitCountMilestoneCap(
                    rule,
                    this.battleLevel,
                    state
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
                    cardId: null,
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
                cardId: null,
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
                cardId: null,
            });
        }

        const cardDatabase = manager
            ? manager.battleCardDatabase
            : null;

        if (cardDatabase) {
            for (let i = 0; i < cardDatabase.cards.length; i++) {
                const definition = cardDatabase.cards[i];

                if (!definition || !definition.id) continue;

                const saved = this.getSavedCard(
                    state,
                    definition.id
                );

                if (!saved) continue;
                if (!this.isCardEligibleForTeam(
                    definition,
                    0,
                    state
                )) {
                    continue;
                }

                if (!saved.owned) {
                    options.push({
                        id: `card-unlock:${definition.id}`,
                        kind: 'card-unlock',
                        cost: Math.max(
                            1,
                            Math.round(definition.purchasePrice)
                        ),
                        family: null,
                        tier: 0,
                        delta: 1,
                        label: `Unlock ${definition.displayName}`,
                        cardId: definition.id,
                    });
                    continue;
                }

                const upgradeRankLimit =
                    this.getCardUpgradeRankLimit(
                        definition,
                        state
                    );

                if (
                    saved.cooldownUpgradeLevel <
                    upgradeRankLimit
                ) {
                    const nextLevel =
                        saved.cooldownUpgradeLevel + 1;

                    options.push({
                        id: `card-cooldown:${definition.id}:${nextLevel}`,
                        kind: 'card-cooldown-upgrade',
                        cost: this.getCardCooldownUpgradeCost(
                            definition,
                            nextLevel
                        ),
                        family: null,
                        tier: 0,
                        delta: 1,
                        label: `${definition.displayName} Cooldown -1`,
                        cardId: definition.id,
                    });
                }

                if (
                    saved.budgetUpgradeLevel <
                    upgradeRankLimit
                ) {
                    const nextLevel = saved.budgetUpgradeLevel + 1;

                    options.push({
                        id: `card-budget:${definition.id}:${nextLevel}`,
                        kind: 'card-budget-upgrade',
                        cost: this.getCardBudgetUpgradeCost(
                            definition,
                            nextLevel
                        ),
                        family: null,
                        tier: 0,
                        delta: 1,
                        label: `${definition.displayName} Budget +40%`,
                        cardId: definition.id,
                    });
                }
            }
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

    private getCardCooldownUpgradeCost(
        definition: BattleCardDefinition,
        nextLevel: number
    ) {
        const ratio = nextLevel <= 1 ? 0.6 : 0.9;

        return Math.max(
            1,
            Math.round(
                Math.max(1, definition.purchasePrice) * ratio
            )
        );
    }

    private getCardBudgetUpgradeCost(
        definition: BattleCardDefinition,
        nextLevel: number
    ) {
        const ratio = nextLevel <= 1 ? 0.5 : 0.75;

        return Math.max(
            1,
            Math.round(
                Math.max(1, definition.purchasePrice) * ratio
            )
        );
    }

    private shouldReserveGoldForBaseline(
        state: SavedProgressionState
    ) {
        return state.playerInitialCP <
            this.getPlayerCPMilestoneCap(this.battleLevel) ||
            state.playerMaxAlive <
            this.getPlayerMaxAliveMilestoneCap(this.battleLevel);
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
        source: string,
        reservedGold = 0
    ) {
        if (!this.progressionState) return;

        const reserve = Math.max(0, Math.floor(reservedGold));

        for (let iteration = 0; iteration < 100; iteration++) {
            const affordable = this.getBotPurchaseCandidates(
                this.progressionState,
                true
            ).filter((option) => option.cost <=
                this.progressionState!.playerGold - reserve);

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

    private getBotPurchaseCandidates(
        state: SavedProgressionState,
        affordableOnly: boolean
    ) {
        let options = this.getPurchaseOptions(state).filter(
            (option) => !affordableOnly ||
                option.cost <= state.playerGold
        );

        if (this.shouldReserveGoldForBaseline(state)) {
            options = options.filter((option) =>
                option.kind !== 'card-unlock' &&
                option.kind !== 'card-cooldown-upgrade' &&
                option.kind !== 'card-budget-upgrade'
            );
        }

        if (this.shouldBotPrioritizeCardUnlocks(state)) {
            options = options.filter((option) =>
                option.kind !== 'card-cooldown-upgrade' &&
                option.kind !== 'card-budget-upgrade'
            );
        }

        if (this.shouldBotPrioritizeCooldownUpgrades(state)) {
            options = options.filter((option) =>
                option.kind !== 'card-budget-upgrade'
            );
        }

        const currentLevelUnitUnlocks = options.filter((option) => {
            if (
                option.kind !== 'unit-unlock' ||
                option.family === null
            ) {
                return false;
            }

            const rule = this.getRule(
                option.family,
                option.tier
            );

            return !!rule &&
                this.getRuleUnlockLevel(rule) === this.battleLevel;
        });

        return currentLevelUnitUnlocks.length > 0
            ? currentLevelUnitUnlocks
            : options;
    }

    private tryRouteBotToSideMission() {
        if (!this.progressionState) return false;

        const state = this.progressionState;
        const target = this.pickWeightedPurchase(
            this.getBotPurchaseCandidates(
                state,
                false
            ).filter((option) =>
                option.cost > state.playerGold
            )
        );

        if (!target) return false;

        const choice = Math.random() < 0.5
            ? 'side-mission'
            : 'progression';
        this.recordBotSimulationEvent(state, {
            type: 'side-mission-entry-roll',
            battleLevel: this.battleLevel,
            choice,
            targetId: target.id,
            targetCost: target.cost,
            baseGold: 0,
            goldGranted: 0,
        });

        return choice === 'side-mission';
    }

    private tryPayMainBattleEntryFee(
        records: PurchaseRecord[]
    ) {
        if (!this.progressionState) return false;

        const state = this.progressionState;
        const fee = this.getCurrentMainBattleEntryFee();
        const goldBefore = state.playerGold;

        if (goldBefore < fee) {
            this.recordBotSimulationEvent(state, {
                type: 'main-entry-fee-insufficient',
                battleLevel: this.battleLevel,
                choice: 'side-mission',
                targetId: '',
                targetCost: fee,
                baseGold: 0,
                goldGranted: 0,
            });
            return false;
        }

        state.playerGold -= fee;
        state.mainBattleEntryCount++;
        records.push({
            id: `battle-entry:${this.battleLevel}`,
            kind: 'battle-entry',
            label: fee > 0
                ? `Main Battle Entry Fee -${fee} Gold`
                : 'First Main Battle Entry Free',
            family: null,
            familyName: '',
            tier: 0,
            cost: fee,
            goldBefore,
            goldAfter: state.playerGold,
            valueBefore: 0,
            valueAfter: 0,
            source: 'main-battle-entry',
            cardId: null,
        });
        this.recordBotSimulationEvent(state, {
            type: 'main-entry-fee-paid',
            battleLevel: this.battleLevel,
            choice: fee > 0 ? 'paid' : 'free',
            targetId: '',
            targetCost: fee,
            baseGold: fee,
            goldGranted: 0,
        });

        return true;
    }

    private getMainBattleWinGold(level: number) {
        const rewardBaseCP = this.getLevelBaseInitialCP(level);

        return Math.max(
            0,
            Math.round(
                rewardBaseCP *
                Math.max(0, this.winGoldPerEnemyCP) *
                (this.isBossLevelFor(level)
                    ? Math.max(1, this.bossGoldRewardMultiplier)
                    : 1)
            )
        );
    }

    private getMainBattleReward(
        state: SavedProgressionState,
        level: number
    ) {
        const baseGold = this.getMainBattleWinGold(level);
        const nextLevel = Math.min(
            this.getSafeTotalLevels(),
            level + 1
        );
        const nextEntryFee = level >= this.getSafeTotalLevels()
            ? 0
            : this.getMainBattleEntryFee(nextLevel);
        const target = this.getBotPurchaseCandidates(state, false)
            .sort((a, b) => a.cost - b.cost ||
                a.id.localeCompare(b.id))[0] || null;
        const requiredGold = target
            ? Math.max(
                0,
                nextEntryFee + target.cost - state.playerGold
            )
            : 0;

        return {
            targetId: target ? target.id : '',
            targetCost: target ? target.cost : 0,
            gold: Math.max(
                baseGold,
                Math.ceil(requiredGold / 50) * 50
            ),
        };
    }

    private getMainBattleEntryFee(level: number) {
        const baseFee = this.getMainBattleWinGold(level) *
            this.clamp01(this.mainBattleEntryFeeRatio);

        return Math.max(
            0,
            Math.ceil(baseFee / 50) * 50
        );
    }

    private getCurrentMainBattleEntryFee() {
        if (!this.progressionState) return 0;

        return this.progressionState.mainBattleEntryCount <= 0
            ? 0
            : this.getMainBattleEntryFee(this.battleLevel);
    }

    private getSideMissionReward(
        state: SavedProgressionState
    ) {
        const baseGold = Math.ceil(
            this.getMainBattleWinGold(this.battleLevel) / 50
        ) * 50;
        const gold = Math.max(
            50,
            Math.ceil(
                baseGold /
                Math.pow(2, state.consecutiveSideWins) /
                50
            ) * 50
        );

        return {
            targetId: '',
            targetCost: 0,
            gold,
        };
    }

    private getSideMissionContinuation(
        state: SavedProgressionState
    ) {
        const delayedPurchaseCount = this.getBotPurchaseCandidates(
            state,
            false
        ).filter((option) => option.cost > state.playerGold).length;

        return {
            delayedPurchaseCount,
            chance: Math.min(
                0.85,
                0.25 + Math.min(4, delayedPurchaseCount) * 0.15
            ),
        };
    }

    private finishBotSelectedCardCooldowns(
        state: SavedProgressionState
    ) {
        for (let i = 0; i < this.currentPlayerBattleCardIds.length; i++) {
            const cardId = this.currentPlayerBattleCardIds[i];
            const card = this.getSavedCard(state, cardId);

            if (!card || !card.owned || card.cooldownRemaining <= 0) {
                continue;
            }

            const cooldownBefore = card.cooldownRemaining;
            card.cooldownRemaining = 0;
            state.adsReward++;
            this.recordBotSimulationEvent(state, {
                type: 'card-cooldown-finish-ad',
                battleLevel: this.battleLevel,
                choice: 'finish-cooldown-ad',
                targetId: cardId,
                targetCost: cooldownBefore,
                baseGold: 0,
                goldGranted: 0,
            });
        }
    }

    private grantBotGoldClaim(
        state: SavedProgressionState,
        baseGold: number,
        type: string,
        targetId = '',
        targetCost = 0
    ) {
        const useAds = this.purchasingSimulation &&
            this.allowAdsRescue &&
            Math.random() < 0.5;
        const goldGranted = Math.max(
            0,
            Math.floor(baseGold) * (useAds ? 2 : 1)
        );
        const event: BotSimulationEvent = {
            type,
            battleLevel: this.battleLevel,
            choice: useAds ? 'gold-x2-ad' : 'gold',
            targetId,
            targetCost,
            baseGold: Math.max(0, Math.floor(baseGold)),
            goldGranted,
        };

        state.playerGold += goldGranted;
        if (useAds) state.adsReward++;
        this.recordBotSimulationEvent(state, event);
        return event;
    }

    private recordBotSimulationEvent(
        state: SavedProgressionState,
        event: BotSimulationEvent
    ) {
        state.botSimulationEvents.push(event);

        if (state.botSimulationEvents.length > 40) {
            state.botSimulationEvents.splice(
                0,
                state.botSimulationEvents.length - 40
            );
        }
    }

    private shouldBotPrioritizeCardUnlocks(
        state: SavedProgressionState
    ) {
        return this.getPurchaseOptions(state).some((option) =>
            option.kind === 'card-unlock'
        );
    }

    private shouldBotPrioritizeCooldownUpgrades(
        state: SavedProgressionState
    ) {
        return this.getPurchaseOptions(state).some((option) =>
            option.kind === 'card-cooldown-upgrade' &&
            option.cost <= state.playerGold
        );
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

        if (option.kind === 'card-unlock') {
            return 0.6;
        }

        if (option.kind === 'card-cooldown-upgrade') {
            return 2;
        }

        if (option.kind === 'card-budget-upgrade') {
            return 1.5;
        }

        return 1;
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
            cardId: option.cardId,
        };
    }

    private applyPurchaseToState(
        option: PurchaseOption,
        state: SavedProgressionState
    ) {
        if (option.kind === 'card-unlock') {
            const card = option.cardId
                ? this.getSavedCard(state, option.cardId)
                : null;

            if (!card) return;

            card.owned = true;
            return;
        }

        if (option.kind === 'card-budget-upgrade') {
            const card = option.cardId
                ? this.getSavedCard(state, option.cardId)
                : null;

            if (!card || !card.owned) return;

            card.budgetUpgradeLevel = Math.min(
                2,
                card.budgetUpgradeLevel + 1
            );
            return;
        }

        if (option.kind === 'card-cooldown-upgrade') {
            const card = option.cardId
                ? this.getSavedCard(state, option.cardId)
                : null;

            if (!card || !card.owned) return;

            card.cooldownUpgradeLevel = Math.min(
                2,
                card.cooldownUpgradeLevel + 1
            );
            card.cooldownRemaining = Math.max(
                0,
                card.cooldownRemaining - 1
            );
            return;
        }

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

        if (
            option.kind === 'card-unlock' ||
            option.kind === 'card-cooldown-upgrade' ||
            option.kind === 'card-budget-upgrade'
        ) {
            const card = option.cardId
                ? this.getSavedCard(state, option.cardId)
                : null;

            if (!card) return 0;

            if (option.kind === 'card-unlock') {
                return Number(card.owned);
            }

            return option.kind === 'card-cooldown-upgrade'
                ? card.cooldownUpgradeLevel
                : card.budgetUpgradeLevel;
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
                            this.battleLevel,
                            this.progressionState!
                        ),
                };
            });
    }

    private getPlayerUnitCountMilestoneCap(
        rule: UnitProgressionRule,
        level: number,
        state: SavedProgressionState
    ) {
        return Math.min(
            this.getRuleMaxCount(rule),
            this.getRuleUnlockCount(rule) +
            this.getUnitCountUpgradeRank(
                rule,
                level,
                state
            )
        );
    }

    private getEnemyUnitCount(
        rule: UnitProgressionRule,
        level: number
    ) {
        return Math.round(
            Math.min(
                this.getRuleMaxCount(rule),
                this.getRuleUnlockCount(rule) +
                this.getUnitCountUpgradeRank(rule, level)
            )
        );
    }

    private getUnitCountUpgradeRank(
        rule: UnitProgressionRule,
        level: number,
        state: SavedProgressionState | null = null
    ) {
        const unlockLevel = this.getRuleUnlockLevel(rule);
        const maxRank = Math.max(
            0,
            this.getRuleMaxCount(rule) -
            this.getRuleUnlockCount(rule)
        );
        let rank = 0;
        const milestones = this.getUnitUnlockMilestoneLevels();

        for (let i = 0; i < milestones.length; i++) {
            const milestone = milestones[i];

            if (milestone <= unlockLevel || milestone > level) {
                continue;
            }
            if (
                state &&
                !this.isUnitUnlockMilestoneOffered(
                    milestone,
                    state
                )
            ) {
                continue;
            }

            rank++;
        }

        return Math.min(maxRank, rank);
    }

    private getUnitUnlockMilestoneLevels() {
        const result: number[] = [];

        for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;

            const level = this.getRuleUnlockLevel(rule);

            if (level <= 1 || result.indexOf(level) >= 0) continue;

            result.push(level);
        }

        return result.sort((a, b) => a - b);
    }

    private isUnitUnlockMilestoneOffered(
        milestone: number,
        state: SavedProgressionState
    ) {
        for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            if (this.getRuleUnlockLevel(rule) !== milestone) {
                continue;
            }

            const saved = this.getSavedUnit(
                state,
                this.getRuleKey(rule)
            );

            if (saved && saved.offered) return true;
        }

        return false;
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
        const endLevel = this.getProgressionEndLevel();
        const progress = this.getRuleUnlockProgression(rule);
        const rawLevel = Math.max(
            1,
            Math.floor(1 + progress * (endLevel - 1))
        );
        const bossPace = Math.max(
            0,
            Math.floor(this.bossStagePace)
        );

        if (rawLevel <= 1 || bossPace <= 0) {
            return rawLevel;
        }

        return Math.min(
            endLevel,
            Math.ceil(rawLevel / bossPace) * bossPace
        );
    }

    private migrateLegacyUnitUnlockProgression() {
        const referenceEndLevel = Math.max(
            1,
            Math.floor(this.progressionEndLevel)
        );

        for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];

            if (!rule) continue;
            if (rule.unlockProgression > 0) continue;
            if (rule.unlockLevel <= 1) continue;

            rule.unlockProgression = this.clamp01(
                rule.unlockLevel / referenceEndLevel
            );
        }
    }

    private getRuleUnlockProgression(rule: UnitProgressionRule) {
        const configured = Number.isFinite(rule.unlockProgression)
            ? rule.unlockProgression
            : 0;

        if (configured > 0 || rule.unlockLevel <= 1) {
            return this.clamp01(configured);
        }

        // A preview using an older serialized scene can omit the new field.
        // Keep its original unlock distribution instead of opening every unit.
        return this.clamp01(
            rule.unlockLevel / Math.max(
                1,
                Math.floor(this.progressionEndLevel)
            )
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
                this.pickEvenlyDistributedOfferLevels(
                    firstOfferLevel,
                    lastNormalLevel >= firstOfferLevel
                        ? lastNormalLevel
                        : targetLevel,
                    packageCount
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

    private pickEvenlyDistributedOfferLevels(
        firstLevel: number,
        lastLevel: number,
        count: number
    ) {
        const candidateCount = Math.max(
            1,
            lastLevel - firstLevel + 1
        );
        const safeCount = Math.min(
            Math.max(1, Math.floor(count)),
            candidateCount
        );
        const result: number[] = [];

        for (let index = 0; index < safeCount; index++) {
            result.push(
                firstLevel + Math.floor(
                    index * candidateCount / safeCount
                )
            );
        }

        return result;
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
                this.pickEvenlyDistributedOfferLevels(
                    firstOfferLevel,
                    safeLastOfferLevel,
                    totalDelta
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
            'battle-progression-v8',
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

    private resetIntoSideMission() {
        if (!this.progressionState) return;

        this.progressionState.sideMissionActive = true;
        this.sideMissionBattle = true;
        this.nextBattlePending = true;
        this.saveProgressionState();
        this.scheduleOnce(() => {
            if (!this.resetBattle()) {
                console.warn(
                    '[BattleProgression] side-mission reset was not started.'
                );
            }
        }, 0);
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
        this.sideMissionBattle = this.getQueryInt(
            params,
            ['sideMission'],
            0
        ) === 1;
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
