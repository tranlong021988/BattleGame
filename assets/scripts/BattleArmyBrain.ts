import { _decorator, Component } from 'cc';
import { GameManager, UnitPrefabEntry } from './GameManager';
import {
    BattlefieldEvaluator,
    BattlefieldWaveIntel,
} from './BattlefieldEvaluator';
import { unitFamilyToName } from './BattleTypes';
import { CounterSettings } from './CounterSettings';

const { ccclass, property } = _decorator;

@ccclass('BattleArmyBrain')
export class BattleArmyBrain extends Component {

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property
    team = 1;

    @property
    runOnlyWhenGameManagerAutoSpawnOff = true;

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
            'Chance to use the tactical evaluator. The remaining chance is split evenly between deliberately wrong counter choices and random valid choices.',
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
            'Maximum Archer/Monk support waves allowed in one lane before BattleArmyBrain looks elsewhere.',
    })
    maxRangedSupportWavesPerLane = 2;

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

    start() {
        this.randomizeNextInterval();
    }

    update(dt: number) {
        if (!this.gameManager) return;

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
        this.currentDeliberateMistake =
            !this.currentAccurateDecision &&
            this.currentAccuracyRoll <
                this.getDecisionAccuracy() +
                (
                    1 -
                    this.getDecisionAccuracy()
                ) * 0.5;

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

        if (!this.currentAccurateDecision) {
            if (
                this.currentDeliberateMistake &&
                this.trySpawnDeliberatelyWrongWave()
            ) {
                return;
            }

            if (this.trySpawnRandomWave()) {
                return;
            }
        }

        if (this.trySpawnAntiSpearArcherSupport()) {
            return;
        }

        if (this.trySpawnClusterMonkSupport()) {
            return;
        }

        const target =
            this.evaluator.findBestTarget(
                gameManager,
                this.team,
                this.affordableEntries
            );

        if (target) {
            const choice =
                this.evaluator.chooseEntryForTarget(
                    gameManager,
                    this.team,
                    target,
                    this.affordableEntries
                );

            if (choice.entry) {
                const laneId =
                    this.evaluator.chooseSpawnLaneForTarget(
                        gameManager,
                        this.team,
                        target,
                        choice.entry
                    );

                if (laneId >= 0) {
                    const aggressive =
                        this.evaluator.shouldSpawnAggressive(
                            choice.entry,
                            target,
                            laneId
                        );

                    if (
                        this.spawn(
                            choice.entry,
                            laneId,
                            aggressive,
                            'response',
                            target
                        )
                    ) {
                        return;
                    }
                }
            }
        }

        if (
            this.evaluator.enemyCount <= 0 &&
            !this.spawnOpeningWaveIfNoEnemyWave
        ) {
            this.stateLog('WAIT no enemy and opening disabled.');
            return;
        }

        if (this.trySpawnRangedSupport()) {
            return;
        }

        this.trySpawnPressureWave();
    }

    private trySpawnDeliberatelyWrongWave() {
        let bestTarget: BattlefieldWaveIntel | null = null;
        let bestEntry: UnitPrefabEntry | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < this.evaluator.enemyCount; i++) {
            const target =
                this.evaluator.enemies[i];

            if (!target || !target.wave || !target.entry) {
                continue;
            }
            if (target.aliveCount <= 0) continue;
            if (target.healthRatio <= 0.08) continue;

            const entry =
                this.getWorstAffordableEntryForTarget(
                    target
                );

            if (!entry) continue;

            const score =
                target.threatScore +
                target.progressToDefend * 120 +
                Math.random() * 0.001;

            if (score > bestScore) {
                bestScore = score;
                bestTarget = target;
                bestEntry = entry;
            }
        }

        if (!bestTarget || !bestEntry) {
            return false;
        }

        const gameManager =
            this.gameManager;

        if (!gameManager) return false;

        const laneId =
            gameManager.clampLaneId(
                bestTarget.laneId >= 0
                    ? bestTarget.laneId
                    : bestTarget.visualLaneId
            );

        return this.spawn(
            bestEntry,
            laneId,
            false,
            'imperfect-wrong',
            bestTarget
        );
    }

    private trySpawnRandomWave() {
        const laneId =
            this.getRandomLaneId();

        if (laneId < 0) {
            this.stateLog('WAIT imperfect no lane.');
            return false;
        }

        const entry =
            this.getRandomAffordableEntry();

        if (!entry) {
            this.stateLog('WAIT imperfect no entry.');
            return false;
        }

        return this.spawn(
            entry,
            laneId,
            false,
            'imperfect-random'
        );
    }

    private trySpawnAntiSpearArcherSupport() {
        const gameManager =
            this.gameManager;

        if (!gameManager) return false;

        const target =
            this.evaluator.findBestAntiSpearArcherTarget(
                this.affordableEntries,
                this.maxRangedSupportWavesPerLane
            );

        if (!target) return false;

        const entry =
            this.evaluator.chooseAntiSpearArcherEntry(
                this.affordableEntries,
                target
            );

        if (!entry) return false;

        const laneId =
            this.evaluator.chooseRangedSupportLane(
                gameManager,
                target
            );

        if (laneId < 0) return false;

        return this.spawn(
            entry,
            laneId,
            false,
            'anti-spear-archer',
            target
        );
    }

    private trySpawnClusterMonkSupport() {
        const gameManager =
            this.gameManager;

        if (!gameManager) return false;

        const target =
            this.evaluator.findBestClusterMonkTarget(
                this.affordableEntries,
                this.maxRangedSupportWavesPerLane
            );

        if (!target) return false;

        const entry =
            this.evaluator.chooseClusterMonkEntry(
                this.affordableEntries,
                target
            );

        if (!entry) return false;

        const laneId =
            this.evaluator.chooseRangedSupportLane(
                gameManager,
                target
            );

        if (laneId < 0) return false;

        return this.spawn(
            entry,
            laneId,
            false,
            'cluster-monk-support',
            target
        );
    }

    private trySpawnRangedSupport() {
        const gameManager =
            this.gameManager;

        if (!gameManager) return false;

        const target =
            this.evaluator.findBestRangedSupportTarget(
                this.affordableEntries,
                this.maxRangedSupportWavesPerLane
            );

        if (!target) return false;

        const entry =
            this.evaluator.chooseRangedSupportEntry(
                this.affordableEntries,
                target
            );

        if (!entry) return false;

        const laneId =
            this.evaluator.chooseRangedSupportLane(
                gameManager,
                target
            );

        if (laneId < 0) return false;

        return this.spawn(
            entry,
            laneId,
            false,
            'ranged-support',
            target
        );
    }

    private trySpawnPressureWave() {
        const gameManager =
            this.gameManager;

        if (!gameManager) return false;

        const laneId =
            this.evaluator.choosePressureLane(
                gameManager
            );

        if (laneId < 0) {
            this.stateLog('WAIT no pressure lane.');
            return false;
        }

        const entry =
            this.evaluator.choosePressureEntry(
                this.affordableEntries
            );

        if (!entry) {
            this.stateLog('WAIT no pressure entry.');
            return false;
        }

        return this.spawn(
            entry,
            laneId,
            true,
            'pressure'
        );
    }

    private spawn(
        entry: UnitPrefabEntry,
        laneId: number,
        aggressiveForward: boolean,
        reason: string,
        target: BattlefieldWaveIntel | null = null
    ) {
        const gameManager =
            this.gameManager;

        if (!gameManager) return false;

        const spawned =
            gameManager.spawnWaveByEntry(
                this.team,
                entry,
                laneId,
                aggressiveForward,
                reason
            );

        if (!spawned) return false;

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
        });

        this.stateLog(
            `${reason} spawn=${entry.name} lane=${laneId} ` +
            `aggressive=${aggressiveForward}`
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

    private getRandomLaneId() {
        const gameManager =
            this.gameManager;

        if (!gameManager) return -1;

        const laneCount =
            gameManager.getSafeLaneCount();

        if (laneCount <= 0) return -1;

        return gameManager.clampLaneId(
            Math.floor(Math.random() * laneCount)
        );
    }

    private getRandomAffordableEntry() {
        if (this.affordableEntries.length <= 0) {
            return null;
        }

        return this.affordableEntries[
            Math.floor(
                Math.random() *
                this.affordableEntries.length
            )
        ];
    }

    private getWorstAffordableEntryForTarget(
        target: BattlefieldWaveIntel
    ) {
        if (!target.entry) return null;

        const counter =
            CounterSettings.instance;

        if (!counter) return null;

        let worst: UnitPrefabEntry | null = null;
        let worstScore = 1;

        for (let i = 0; i < this.affordableEntries.length; i++) {
            const entry =
                this.affordableEntries[i];
            const reverseCounter =
                counter.getCounterScore(
                    target.entry.family,
                    entry.family
                );

            if (reverseCounter <= 1.0001) {
                continue;
            }

            const score =
                reverseCounter +
                Math.random() * 0.001;

            if (score > worstScore) {
                worstScore = score;
                worst = entry;
            }
        }

        return worst;
    }

    private getDecisionAccuracy() {
        return this.clamp01(this.decisionAccuracy);
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
