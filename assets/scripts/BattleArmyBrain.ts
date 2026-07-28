import { _decorator, Component, Enum } from 'cc';
import { GameManager } from './GameManager';
import type { UnitPrefabEntry } from './GameManager';
import { BattlefieldEvaluator } from './BattlefieldEvaluator';
import type {
    BattleSpawnDecision,
    BattlefieldWaveIntel,
} from './BattlefieldEvaluator';
import { UnitFamily, unitFamilyToName } from './BattleTypes';

const { ccclass, property } = _decorator;

export enum BattleArmyBrainTestUnit {
    Axeman = 0,
    Cavalry = 1,
    Sword = 2,
    Spear = 3,
    Monk = 4,
    Archer = 5,
}

Enum(BattleArmyBrainTestUnit);

@ccclass('BattleArmyBrain')
export class BattleArmyBrain extends Component {

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property
    team = 1;

    @property
    runOnlyWhenGameManagerAutoSpawnOff = true;

    @property({
        tooltip:
            'Test mode: skip normal AI and spawn exactly one selected wave in the middle lane.',
    })
    testSingleWaveBattle = false;

    @property({
        type: BattleArmyBrainTestUnit,
        tooltip:
            'Unit spawned by Test Single Wave Battle. Uses this brain team database entry.',
    })
    testSingleWaveUnit: BattleArmyBrainTestUnit =
        BattleArmyBrainTestUnit.Sword;

    @property
    minSpawnInterval = 2.5;

    @property
    maxSpawnInterval = 5.0;

    @property
    maxBrainDeltaTime = 0.1;

    @property
    enableMaxAliveWaveLimit = true;

    @property
    maxAliveWaves = 7;

    @property({
        min: 0,
        max: 1,
        tooltip:
            'Unit choice accuracy. 0 biases toward lower-ranked scored candidates, 1 keeps the evaluator best unit. Target and lane selection stay tactical.',
    })
    decisionAccuracy = 0.8;

    @property({
        tooltip:
            'Power coverage target for the selected enemy wave. 1 means enough estimated force; values above 1 ask for a small reserve.',
    })
    coverageTargetRatio = 1.05;

    @property({
        tooltip:
            'If an ally wave covering the target drops below this health ratio, BattleArmyBrain may reinforce even when coverage exists.',
    })
    rescueAllyAliveRatio = 0.35;

    @property({
        tooltip:
            'Do not add more direct-lane response waves when this many useful ally waves already stand between spawn and target, unless rescue/danger rules apply.',
    })
    laneAllyAheadLimit = 2;

    @property
    spawnOpeningWaveIfNoEnemyWave = true;

    @property({
        tooltip:
            'Anti-spam cap for Archer/Monk support waves near one target lane. Frontline power, not this value, is the main ranged support gate.',
    })
    maxRangedSupportWavesPerLane = 2;

    @property({
        min: 1,
        tooltip:
            'Maximum consecutive melee waves this brain may spawn into the same lane. Ranged waves use their own support rules.',
    })
    maxConsecutiveMeleeWavesPerLane = 2;

    @property
    enableStateLog = false;

    @property
    enableDebugLog = false;

    private timer = 0;
    private nextInterval = 3;
    private evaluator = new BattlefieldEvaluator();
    private affordableEntries: UnitPrefabEntry[] = [];
    private currentAccuracyRoll = 0;
    private currentAccurateDecision = true;
    private currentDeliberateMistake = false;
    private lastMeleeSpawnLaneId = -1;
    private consecutiveMeleeSpawnLaneCount = 0;
    private spawnedOpeningWave = false;
    private hasSpawnedWave = false;
    private hasSeenEnemyWave = false;
    private testSingleWaveSpawned = false;
    private telemetryBatchQueryActive = false;

    start() {
        this.applyTelemetryBatchQueryAccuracy();

        if (this.telemetryBatchQueryActive) {
            this.nextInterval = 0;
        } else {
            this.randomizeNextInterval();
        }
    }

    update(dt: number) {
        if (!this.gameManager) return;

        if (this.testSingleWaveBattle) {
            this.trySpawnSingleWaveTest();
            return;
        }

        if (
            this.runOnlyWhenGameManagerAutoSpawnOff &&
            this.gameManager.enableAutoSpawn
        ) {
            return;
        }

        const safeDt =
            Math.min(
                Math.max(0, dt),
                Math.max(0.01, this.maxBrainDeltaTime)
            );

        this.timer += safeDt;

        if (this.timer < this.nextInterval) {
            return;
        }

        this.timer = 0;

        if (
            this.telemetryBatchQueryActive &&
            !this.hasSpawnedWave
        ) {
            this.thinkAndSpawn();
            this.randomizeNextInterval();
            return;
        }

        this.randomizeNextInterval();
        this.thinkAndSpawn();
    }

    private trySpawnSingleWaveTest() {
        if (this.testSingleWaveSpawned) return;

        const gameManager =
            this.gameManager;

        if (!gameManager) return;

        if (
            this.runOnlyWhenGameManagerAutoSpawnOff &&
            gameManager.enableAutoSpawn
        ) {
            this.stateLog(
                'WAIT single-wave test blocked by GameManager auto spawn.'
            );
            return;
        }

        const entry =
            this.findTestSingleWaveEntry();

        if (!entry) {
            this.stateLog(
                'WAIT single-wave test has no matching unit entry.'
            );
            return;
        }

        const laneId =
            Math.floor(gameManager.getSafeLaneCount() * 0.5);

        this.currentAccuracyRoll = 0;
        this.currentAccurateDecision = true;
        this.currentDeliberateMistake = false;
        this.affordableEntries.length = 1;
        this.affordableEntries[0] = entry;

        if (
            this.spawn(
                entry,
                laneId,
                false,
                'test-single-wave'
            )
        ) {
            this.testSingleWaveSpawned = true;
        }
    }

    private thinkAndSpawn() {
        const gameManager =
            this.gameManager;

        if (!gameManager) return;

        const aliveWaveCount =
            this.getAliveWaveCount();

        if (!this.canSpawnMoreWave(aliveWaveCount)) {
            this.debugLog('Skip: max alive waves reached.');
            return;
        }

        gameManager.collectAffordableEntries(
            this.team,
            this.affordableEntries
        );

        if (this.affordableEntries.length <= 0) {
            this.debugLog('Skip: no affordable entries.');
            return;
        }

        this.currentAccuracyRoll = 0;
        this.currentAccurateDecision = true;
        this.currentDeliberateMistake = false;

        this.evaluator.coverageTargetRatio =
            Math.max(0, this.coverageTargetRatio);
        this.evaluator.rescueAllyAliveRatio =
            this.clamp01(this.rescueAllyAliveRatio);
        this.evaluator.laneAllyAheadLimit =
            Math.max(
                0,
                Math.floor(this.laneAllyAheadLimit)
            );
        this.evaluator.rebuild(
            gameManager,
            this.team
        );

        if (this.evaluator.enemyCount > 0) {
            this.hasSeenEnemyWave = true;
        }

        const forceSynchronizedOpening =
            this.telemetryBatchQueryActive &&
            !this.hasSpawnedWave &&
            this.spawnOpeningWaveIfNoEnemyWave;

        if (
            forceSynchronizedOpening ||
            this.evaluator.enemyCount <= 0
        ) {
            if (!this.spawnOpeningWaveIfNoEnemyWave) {
                this.stateLog('WAIT no enemy and opening disabled.');
                return;
            }

            if (
                this.spawnedOpeningWave &&
                !this.hasSeenEnemyWave
            ) {
                this.stateLog(
                    'WAIT opening wave already spawned.'
                );
                return;
            }

            const openingDecision =
                this.evaluator.chooseSnapshotSpawnDecision(
                    gameManager,
                    this.team,
                    this.affordableEntries,
                    0,
                    this.getBlockedMeleeLaneId(),
                    this.getDecisionAccuracy(),
                    forceSynchronizedOpening,
                    forceSynchronizedOpening
                        ? Math.floor(
                            gameManager.getSafeLaneCount() * 0.5
                        )
                        : -1
                );

            if (
                openingDecision.entry &&
                openingDecision.laneId >= 0 &&
                this.trySpawnDecision(
                    openingDecision
                )
            ) {
                this.spawnedOpeningWave = true;
            }

            return;
        }

        const maxRangedSupportLimit =
            this.getMaxRangedSupportLimit();

        if (
            this.hasSpawnedWave &&
            gameManager.getAliveNonHeroUnitCount(this.team) <= 0
        ) {
            const lastStandDecision =
                this.evaluator.chooseLastStandSpawnDecision(
                    gameManager,
                    this.team,
                    this.affordableEntries,
                    this.getBlockedMeleeLaneId(),
                    this.getDecisionAccuracy()
                );

            if (
                lastStandDecision.entry &&
                lastStandDecision.laneId >= 0 &&
                this.trySpawnDecision(lastStandDecision)
            ) {
                return;
            }
        }

        const decision =
            this.evaluator.chooseSnapshotSpawnDecision(
                gameManager,
                this.team,
                this.affordableEntries,
                maxRangedSupportLimit,
                this.getBlockedMeleeLaneId(),
                this.getDecisionAccuracy()
            );

        if (
            decision.entry &&
            decision.laneId >= 0
        ) {
            if (this.trySpawnDecision(decision)) {
                return;
            }
        }

        const fallbackDecision =
            this.evaluator.chooseFallbackSpawnDecision(
                gameManager,
                this.team,
                this.affordableEntries,
                maxRangedSupportLimit,
                this.getBlockedMeleeLaneId(),
                this.getDecisionAccuracy()
            );

        if (
            fallbackDecision.entry &&
            fallbackDecision.laneId >= 0
        ) {
            if (this.trySpawnDecision(fallbackDecision)) {
                return;
            }
        }

        this.stateLog(
            'WAIT no useful snapshot or fallback spawn.'
        );
    }

    private trySpawnDecision(
        decision: BattleSpawnDecision
    ) {
        const gameManager =
            this.gameManager;

        if (!gameManager || !decision.entry) {
            return false;
        }

        let entry =
            decision.entry;
        let aggressiveForward =
            decision.aggressiveForward;
        let reason =
            decision.reason;
        let intendedEntry: UnitPrefabEntry | null =
            decision.bestEntry &&
            decision.bestEntry !== decision.entry
                ? decision.bestEntry
                : null;
        const target =
            decision.target;

        this.currentAccuracyRoll =
            decision.selectionRoll;
        this.currentDeliberateMistake =
            decision.selectedRank > 0;
        this.currentAccurateDecision =
            !this.currentDeliberateMistake;

        return this.spawn(
            entry,
            decision.laneId,
            aggressiveForward,
            reason,
            target,
            intendedEntry,
            decision.cpStrategyState,
            decision
        );
    }

    private spawn(
        entry: UnitPrefabEntry,
        laneId: number,
        aggressiveForward: boolean,
        reason: string,
        target: BattlefieldWaveIntel | null = null,
        intendedEntry: UnitPrefabEntry | null = null,
        cpStrategyState = '',
        decision: BattleSpawnDecision | null = null
    ) {
        const gameManager =
            this.gameManager;

        if (!gameManager) return false;
        if (
            this.isMeleeEntry(entry) &&
            laneId === this.getBlockedMeleeLaneId() &&
            !this.shouldBypassBlockedMeleeLane(target)
        ) {
            return false;
        }

        const combatPointAtDecision =
            gameManager.getCombatPoint(this.team);
        const enemyTeam =
            this.team === 0 ? 1 : 0;
        const enemyCombatPointAtDecision =
            gameManager.getCombatPoint(enemyTeam);
        const postSpawnCombatPoint =
            combatPointAtDecision -
            Math.max(0, entry.combatPointCost);
        const combatPointAdvantageAtDecision =
            combatPointAtDecision -
            enemyCombatPointAtDecision;
        const postSpawnCombatPointAdvantage =
            postSpawnCombatPoint -
            enemyCombatPointAtDecision;
        const combatPointCostRatioAtDecision =
            combatPointAtDecision /
            Math.max(1, entry.combatPointCost);
        const canComfortablyAffordAtDecision =
            combatPointCostRatioAtDecision >= 1.7;

        const spawned =
            gameManager.spawnWaveByEntry(
                this.team,
                entry,
                laneId,
                aggressiveForward,
                reason
            );

        if (!spawned) return false;

        this.hasSpawnedWave = true;

        this.recordSpawnLaneHistory(
            entry,
            laneId
        );

        this.evaluator.recordSpawnReservation(
            gameManager,
            this.team,
            target,
            entry,
            spawned,
            gameManager.frame
        );

        gameManager.recordBattleTelemetryWaveSpawnDecision({
            team: this.team,
            waveId: spawned.id,
            frame: gameManager.frame,
            time: gameManager.getBattleElapsedTime(),
            reason,
            aggressiveForward,
            laneId,
            unitName: entry.name,
            family: entry.family,
            familyName: unitFamilyToName(entry.family),
            tier: entry.tier,
            intendedUnitName: intendedEntry
                ? intendedEntry.name
                : '',
            intendedFamily: intendedEntry
                ? intendedEntry.family
                : undefined,
            intendedFamilyName: intendedEntry
                ? unitFamilyToName(intendedEntry.family)
                : '',
            targetWaveId: target && target.wave
                ? target.wave.id
                : -1,
            targetLaneId: target
                ? target.visualLaneId
                : -1,
            targetFamily: target && target.entry
                ? target.entry.family
                : -1,
            targetFamilyName: target && target.entry
                ? unitFamilyToName(target.entry.family)
                : '',
            responseTier: '',
            allyBlockersFromSpawn: target
                ? target.allyBlockersFromSpawn
                : 0,
            allyCountInLane: target
                ? target.allyAheadCount
                : 0,
            firstEnemyFromSpawn: false,
            coverage: target
                ? target.coverageRatio
                : 0,
            uncovered: target
                ? Math.max(
                    0,
                    this.coverageTargetRatio -
                    target.coverageRatio
                )
                : 0,
            threatScore: target
                ? target.threatScore
                : 0,
            decisionPath: reason,
            decisionAccuracy: this.getDecisionAccuracy(),
            accuracyRoll: this.currentAccuracyRoll,
            accurateDecision: this.currentAccurateDecision,
            deliberateMistake: this.currentDeliberateMistake,
            decisionCandidateCount:
                decision ? decision.candidateCount : 0,
            decisionSelectedRank:
                decision ? decision.selectedRank : 0,
            decisionSelectedScore:
                decision ? decision.score : 0,
            decisionBestScore:
                decision ? decision.bestScore : 0,
            decisionSelectionQuality:
                decision ? decision.selectionQuality : 1,
            decisionQualityRatio:
                decision ? decision.qualityRatio : 1,
            aliveWaveCountAtDecision:
                this.getAliveWaveCount(),
            affordableEntryCount:
                this.affordableEntries.length,
            activeEnemyIntelCount:
                this.evaluator.enemyCount,
            combatPointAtDecision,
            combatPointAdvantageAtDecision,
            enemyCombatPointAtDecision,
            postSpawnCombatPoint,
            postSpawnCombatPointAdvantage:
                postSpawnCombatPointAdvantage,
            combatPointCostRatioAtDecision,
            canComfortablyAffordAtDecision,
            cpStrategyState,
        });

        this.stateLog(
            `${reason} spawn=${entry.name} lane=${laneId} ` +
            `aggressive=${aggressiveForward} ` +
            `cpState=${cpStrategyState || 'none'}`
        );

        return true;
    }

    private getAliveWaveCount() {
        const gameManager =
            this.gameManager;

        if (!gameManager) return 0;

        let count = 0;

        for (let i = 0; i < gameManager.waves.length; i++) {
            const wave = gameManager.waves[i];

            if (!wave) continue;
            if (wave.released) continue;
            if (wave.team !== this.team) continue;
            if (wave.isDead()) continue;

            count++;
        }

        return count;
    }

    private findTestSingleWaveEntry() {
        const gameManager =
            this.gameManager;

        if (!gameManager) return null;

        const family =
            this.getTestSingleWaveFamily();
        const entries =
            gameManager.getTeamEntries(this.team);

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!entry) continue;
            if (!entry.unlocked) continue;
            if (!entry.prefab) continue;
            if (entry.family !== family) continue;

            return entry;
        }

        return null;
    }

    private getTestSingleWaveFamily() {
        switch (this.testSingleWaveUnit) {
            case BattleArmyBrainTestUnit.Axeman:
                return UnitFamily.Axeman;
            case BattleArmyBrainTestUnit.Cavalry:
                return UnitFamily.Cavalry;
            case BattleArmyBrainTestUnit.Sword:
                return UnitFamily.Sword;
            case BattleArmyBrainTestUnit.Spear:
                return UnitFamily.Spear;
            case BattleArmyBrainTestUnit.Monk:
                return UnitFamily.Monk;
            case BattleArmyBrainTestUnit.Archer:
                return UnitFamily.Archer;
            default:
                return UnitFamily.Sword;
        }
    }

    private canSpawnMoreWave(
        aliveWaveCount: number
    ) {
        if (!this.enableMaxAliveWaveLimit) {
            return true;
        }

        return aliveWaveCount <
            Math.max(
                0,
                Math.floor(this.maxAliveWaves)
            );
    }

    private randomizeNextInterval() {
        const min =
            Math.max(0.05, this.minSpawnInterval);
        const max =
            Math.max(min, this.maxSpawnInterval);

        this.nextInterval =
            min +
            Math.random() * (max - min);
    }

    private isMeleeEntry(
        entry: UnitPrefabEntry
    ) {
        return entry.family !== UnitFamily.Archer &&
            entry.family !== UnitFamily.Monk;
    }

    private getBlockedMeleeLaneId() {
        if (this.lastMeleeSpawnLaneId < 0) {
            return -1;
        }

        return this.consecutiveMeleeSpawnLaneCount >=
            Math.max(
                1,
                Math.floor(
                    this.maxConsecutiveMeleeWavesPerLane
                )
            )
                ? this.lastMeleeSpawnLaneId
                : -1;
    }

    private shouldBypassBlockedMeleeLane(
        target: BattlefieldWaveIntel | null
    ) {
        return !!target &&
            (
                target.hasStrugglingAlly ||
                target.dangerousToDefend
            );
    }

    private recordSpawnLaneHistory(
        entry: UnitPrefabEntry,
        laneId: number
    ) {
        if (!this.isMeleeEntry(entry)) {
            return;
        }

        if (laneId === this.lastMeleeSpawnLaneId) {
            this.consecutiveMeleeSpawnLaneCount++;
            return;
        }

        this.lastMeleeSpawnLaneId = laneId;
        this.consecutiveMeleeSpawnLaneCount = 1;
    }

    private getDecisionAccuracy() {
        return this.clamp01(this.decisionAccuracy);
    }

    private applyTelemetryBatchQueryAccuracy() {
        if (typeof window === 'undefined') return;
        if (!window.location) return;

        const params =
            new URLSearchParams(window.location.search);

        if (!this.hasTelemetryBatchQueryParams(params)) {
            return;
        }

        this.telemetryBatchQueryActive = true;

        const queryTeam =
            this.getTelemetryBatchQueryInt(
                params,
                'team',
                0
            ) === 1
                ? 1
                : 0;

        if (this.team !== queryTeam) {
            return;
        }

        this.decisionAccuracy =
            this.clamp01(
                this.getTelemetryBatchQueryNumber(
                    params,
                    'currentAcc',
                    0
                )
            );
    }

    private hasTelemetryBatchQueryParams(
        params: any
    ) {
        return this.hasTelemetryBatchQueryParam(
            params,
            'currentAcc'
        ) ||
            this.hasTelemetryBatchQueryParam(
                params,
                'currentBatch'
            ) ||
            this.hasTelemetryBatchQueryParam(
                params,
                'step'
            ) ||
            this.hasTelemetryBatchQueryParam(
                params,
                'numBatchPerStep'
            ) ||
            this.hasTelemetryBatchQueryParam(
                params,
                'end'
            );
    }

    private getTelemetryBatchQueryNumber(
        params: any,
        key: string,
        fallback: number
    ) {
        const value =
            Number(
                this.getTelemetryBatchQueryParam(
                    params,
                    key
                )
            );

        return Number.isFinite(value)
            ? value
            : fallback;
    }

    private getTelemetryBatchQueryInt(
        params: any,
        key: string,
        fallback: number
    ) {
        return Math.floor(
            this.getTelemetryBatchQueryNumber(
                params,
                key,
                fallback
            )
        );
    }

    private hasTelemetryBatchQueryParam(
        params: any,
        key: string
    ) {
        return params.has(key) ||
            params.has(`?${key}`);
    }

    private getTelemetryBatchQueryParam(
        params: any,
        key: string
    ) {
        return params.get(`?${key}`) ??
            params.get(key);
    }

    private getMaxRangedSupportLimit() {
        return Math.max(
            0,
            Math.floor(
                this.maxRangedSupportWavesPerLane
            )
        );
    }

    private clamp01(value: number) {
        return Math.max(
            0,
            Math.min(1, value)
        );
    }

    private stateLog(message: string) {
        if (!this.enableStateLog) return;

        console.log(
            `[BattleArmyBrain State T${this.team}] ${message}`
        );
    }

    private debugLog(message: string) {
        if (!this.enableDebugLog) return;

        console.log(
            `[BattleArmyBrain Debug T${this.team}] ${message}`
        );
    }
}
