import { _decorator, Component, Enum } from 'cc';
import { GameManager, UnitPrefabEntry } from './GameManager';
import {
    BattlefieldEvaluator,
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
            'Chance to keep the evaluator unit choice. Failed rolls keep the same target/lane but choose a deliberately poor unit response.',
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
            'Maximum Archer/Monk support waves allowed near one target lane at full decision accuracy. Lower accuracy scales this limit down.',
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
    private hasSeenEnemyWave = false;
    private testSingleWaveSpawned = false;

    start() {
        this.randomizeNextInterval();
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

        this.currentAccuracyRoll = Math.random();
        this.currentAccurateDecision =
            this.currentAccuracyRoll <
            this.getDecisionAccuracy();
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

        if (this.evaluator.enemyCount <= 0) {
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
                    this.getBlockedMeleeLaneId()
                );

            if (
                openingDecision.entry &&
                openingDecision.laneId >= 0 &&
                this.trySpawnDecisionWithAccuracy(
                    openingDecision
                )
            ) {
                this.spawnedOpeningWave = true;
            }

            return;
        }

        const effectiveRangedSupportLimit =
            this.getEffectiveRangedSupportLimit();
        const decision =
            this.evaluator.chooseSnapshotSpawnDecision(
                gameManager,
                this.team,
                this.affordableEntries,
                effectiveRangedSupportLimit,
                this.getBlockedMeleeLaneId()
            );

        if (
            decision.entry &&
            decision.laneId >= 0
        ) {
            if (this.trySpawnDecisionWithAccuracy(decision)) {
                return;
            }
        }

        const fallbackDecision =
            this.evaluator.chooseFallbackSpawnDecision(
                gameManager,
                this.team,
                this.affordableEntries,
                effectiveRangedSupportLimit,
                this.getBlockedMeleeLaneId()
            );

        if (
            fallbackDecision.entry &&
            fallbackDecision.laneId >= 0
        ) {
            if (this.trySpawnDecisionWithAccuracy(fallbackDecision)) {
                return;
            }
        }

        this.stateLog(
            'WAIT no useful snapshot or fallback spawn.'
        );
    }

    private trySpawnDecisionWithAccuracy(
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
        let intendedEntry: UnitPrefabEntry | null = null;
        const target =
            decision.target;
        const appliesAccuracy =
            !!target;

        this.currentDeliberateMistake = false;

        if (!this.currentAccurateDecision) {
            const wrongEntry =
                appliesAccuracy
                    ? this.evaluator.chooseWrongResponseEntry(
                        target!,
                        entry,
                        this.affordableEntries,
                        decision.laneId,
                        this.getBlockedMeleeLaneId()
                    )
                    : this.evaluator.choosePoorGenericEntry(
                        entry,
                        this.affordableEntries,
                        decision.laneId,
                        this.getBlockedMeleeLaneId()
                    );

            if (!wrongEntry) {
                this.stateLog(
                    'WAIT inaccurate no poor response.'
                );
                return false;
            }

            intendedEntry = entry;
            entry = wrongEntry;
            aggressiveForward =
                target
                    ? this.evaluator.shouldSpawnAggressive(
                        entry,
                        target,
                        decision.laneId
                    )
                    : decision.aggressiveForward;
            reason =
                decision.reason +
                (
                    appliesAccuracy
                        ? '-accuracy-wrong'
                        : '-accuracy-poor'
                );
            this.currentDeliberateMistake = true;
        }

        return this.spawn(
            entry,
            decision.laneId,
            aggressiveForward,
            reason,
            target,
            intendedEntry,
            decision.cpStrategyState
        );
    }

    private spawn(
        entry: UnitPrefabEntry,
        laneId: number,
        aggressiveForward: boolean,
        reason: string,
        target: BattlefieldWaveIntel | null = null,
        intendedEntry: UnitPrefabEntry | null = null,
        cpStrategyState = ''
    ) {
        const gameManager =
            this.gameManager;

        if (!gameManager) return false;
        if (
            this.isMeleeEntry(entry) &&
            laneId === this.getBlockedMeleeLaneId()
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

    private getEffectiveRangedSupportLimit() {
        const max =
            Math.max(
                0,
                Math.floor(
                    this.maxRangedSupportWavesPerLane
                )
            );

        return Math.floor(
            max * this.getDecisionAccuracy()
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
