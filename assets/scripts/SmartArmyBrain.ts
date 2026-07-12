import { _decorator, Component } from 'cc';
import { GameManager, UnitPrefabEntry } from './GameManager';
import { BattleWave } from './BattleWave';
import { CounterSettings } from './CounterSettings';
import { unitTypeToName } from './BattleTypes';

const { ccclass, property } = _decorator;
const BattleWaveSpawnedEvent =
    'battle-wave-spawned';
const ComparableThreatDistance = 2;
const DeliberateLosingChoiceChance = 0.8;
const DangerousThreatProgress = 0.75;

enum SmartResponseTier {
    None = 0,
    Random = 1,
    Counter = 2,
}

class SmartLaneIntel {
    laneId = 0;
    allyCount = 0;
    enemyCount = 0;
    trafficCount = 0;
    enemyThreat = 0;
    allyPressure = 0;

    reset(laneId: number) {
        this.laneId = laneId;
        this.allyCount = 0;
        this.enemyCount = 0;
        this.trafficCount = 0;
        this.enemyThreat = 0;
        this.allyPressure = 0;
    }
}

class SmartWaveIntel {
    wave: BattleWave | null = null;
    laneId = -1;
    centerX = 0;
    centerZ = 0;
    aliveRatio = 0;
    coverage = 0;
    uncovered = 0;
    distanceToDefend = 0;
    progressToDefend = 0;
    dangerousToDefend = false;
    unengaged = false;
    allyCountInLane = 0;
    allyBlockersFromSpawn = 0;
    firstEnemyFromSpawn = false;
    hasStrugglingAlly = false;
    responseTier = SmartResponseTier.None;
    threatScore = 0;

    reset() {
        this.wave = null;
        this.laneId = -1;
        this.centerX = 0;
        this.centerZ = 0;
        this.aliveRatio = 0;
        this.coverage = 0;
        this.uncovered = 0;
        this.distanceToDefend = 0;
        this.progressToDefend = 0;
        this.dangerousToDefend = false;
        this.unengaged = false;
        this.allyCountInLane = 0;
        this.allyBlockersFromSpawn = 0;
        this.firstEnemyFromSpawn = false;
        this.hasStrugglingAlly = false;
        this.responseTier = SmartResponseTier.None;
        this.threatScore = 0;
    }
}

@ccclass('SmartArmyBrain')
export class SmartArmyBrain extends Component {

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
        tooltip: 'Chance that one complete spawn decision uses the best reachable target and counter unit. Near 0 deliberately favors non-winning matchups against a front enemy; 1 is fully accurate.'
    })
    decisionAccuracy = 1.0;

    @property
    attackCounterCoverageRatio = 1.0;

    @property
    ignoreNearlyDeadWaveRatio = 0.2;

    @property
    rescueAllyAliveRatio = 0.35;

    @property
    aggressiveForwardChance = 0.25;

    @property({
        min: 0,
        max: 1,
        tooltip: 'Chance to immediately counter a newly spawned enemy wave after min spawn interval has elapsed. Higher AI can react faster without waiting for max spawn interval.',
    })
    fastReactCounterChance = 0.0;

    @property
    spawnOpeningWaveIfNoEnemyWave = true;

    @property
    enableStateLog = false;

    @property
    enableDebugLog = false;

    @property({
        tooltip:
            'Logs runtime counts for aggressive, normal, wait, and hard-skip decisions in an actual match.',
    })
    enableDecisionStats = false;

    private timer = 0;
    private nextInterval = 3;
    private elapsedTime = 0;
    private hasReachedMaxAliveWavesOnce = false;
    private decisionStatsAggressive = 0;
    private decisionStatsNormal = 0;
    private decisionStatsWait = 0;
    private decisionStatsSkip = 0;

    private laneIntel: SmartLaneIntel[] = [];
    private enemyIntel: SmartWaveIntel[] = [];
    private activeEnemyIntelCount = 0;
    private affordableEntries: UnitPrefabEntry[] = [];
    private bestEntryBuffer: UnitPrefabEntry[] = [];
    private counterCandidateBuffer: SmartWaveIntel[] = [];

    start() {
        this.randomizeNextInterval();
        this.registerFastReactListener();
    }

    onDestroy() {
        this.logDecisionStats('final');
        this.unregisterFastReactListener();
    }

    update(deltaTime: number) {
        if (!this.gameManager) return;

        if (
            this.runOnlyWhenGameManagerAutoSpawnOff &&
            this.gameManager.enableAutoSpawn
        ) {
            return;
        }

        const safeDeltaTime = Math.min(
            deltaTime,
            Math.max(0.016, this.maxBrainDeltaTime)
        );

        this.elapsedTime += safeDeltaTime;
        this.timer += safeDeltaTime;

        if (this.timer < this.nextInterval) {
            return;
        }

        this.timer = 0;
        this.randomizeNextInterval();
        this.thinkAndSpawn();
    }

    private registerFastReactListener() {
        if (!this.gameManager) return;

        this.gameManager.node.on(
            BattleWaveSpawnedEvent,
            this.onBattleWaveSpawned,
            this
        );
    }

    private unregisterFastReactListener() {
        if (!this.gameManager) return;

        this.gameManager.node.off(
            BattleWaveSpawnedEvent,
            this.onBattleWaveSpawned,
            this
        );
    }

    private onBattleWaveSpawned(
        wave: BattleWave | null
    ) {
        if (!wave) return;
        if (!this.gameManager) return;

        if (wave.team === this.team) {
            this.refreshMaxAliveWaveReached();
            return;
        }

        if (!this.isValidWave(wave)) return;

        if (
            this.runOnlyWhenGameManagerAutoSpawnOff &&
            this.gameManager.enableAutoSpawn
        ) {
            return;
        }

        if (
            Math.random() >
            this.clamp01(this.fastReactCounterChance)
        ) {
            return;
        }

        if (!this.hasReachedMinSpawnInterval()) {
            return;
        }

        const aliveWaveCount =
            this.getAliveWaveCount(this.team);

        this.refreshMaxAliveWaveReached(aliveWaveCount);

        if (!this.canSpawnMoreWave(aliveWaveCount)) {
            this.debugLog('Fast react skip: max alive waves reached.');
            return;
        }

        this.collectAffordableEntries();

        if (this.affordableEntries.length <= 0) {
            this.debugLog('Fast react skip: no affordable entries.');
            return;
        }

        if (!this.rollAccurateDecision()) {
            this.debugLog('Fast react skip: inaccurate decision.');
            return;
        }

        this.rebuildIntel();

        const targetIntel =
            this.findIntelForWave(wave);

        if (!this.isResponseCandidate(targetIntel)) {
            this.debugLog('Fast react skip: spawned wave has no reachable response.');
            return;
        }

        if (!this.spawnResponse(targetIntel!)) {
            return;
        }

        this.stateLog(
            `FAST_REACT enemyWave=${wave.id}`
        );

        this.timer = 0;
        this.randomizeNextInterval();
    }

    private thinkAndSpawn() {
        if (!this.gameManager) return;

        const aliveWaveCount =
            this.getAliveWaveCount(this.team);

        this.refreshMaxAliveWaveReached(aliveWaveCount);

        if (!this.canSpawnMoreWave(aliveWaveCount)) {
            this.debugLog('Skip: max alive waves reached.');
            this.recordDecisionSkip('max-alive');
            return;
        }

        this.collectAffordableEntries();

        if (this.affordableEntries.length <= 0) {
            this.debugLog('Skip: no affordable entries.');
            this.recordDecisionSkip('no-affordable-entry');
            return;
        }

        const accurateDecision =
            this.rollAccurateDecision();

        if (!accurateDecision) {
            const deliberateMistake =
                Math.random() <
                1 - this.getDecisionAccuracy();

            if (deliberateMistake) {
                this.rebuildIntel();

                if (this.spawnDeliberatelyBadWave()) {
                    return;
                }
            }

            if (!this.spawnNaiveWave()) {
                this.recordDecisionSkip('naive-spawn-failed');
            }
            return;
        }

        this.rebuildIntel();

        const responseTarget =
            this.findBestResponseTarget();

        if (responseTarget) {
            if (!this.spawnResponse(responseTarget)) {
                this.recordDecisionSkip('response-spawn-failed');
            }
            return;
        }

        if (this.trySpawnAggressiveForward('No reachable response target')) {
            return;
        }

        if (
            this.activeEnemyIntelCount <= 0 &&
            this.spawnOpeningWaveIfNoEnemyWave
        ) {
            this.spawnOpeningWave();
            return;
        }

        this.stateLog('WAIT no useful spawn decision.');
        this.recordDecisionWait('no-useful-spawn-decision');
    }

    private rebuildIntel() {
        if (!this.gameManager) return;

        const laneCount =
            this.gameManager.getSafeLaneCount();

        this.ensureLaneIntel(laneCount);

        for (let i = 0; i < laneCount; i++) {
            this.laneIntel[i].reset(i);
        }

        const waves = this.gameManager.waves;
        const enemyTeam = this.team === 0 ? 1 : 0;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidWave(wave)) continue;
            if (wave!.laneId < 0) continue;

            const laneId =
                this.gameManager.clampLaneId(wave!.laneId);
            const lane =
                this.laneIntel[laneId];

            if (!lane) continue;

            lane.trafficCount++;

            if (wave!.team === this.team) {
                lane.allyCount++;
                lane.allyPressure += wave!.getAliveRatio();
                continue;
            }

            if (wave!.team !== enemyTeam) continue;

            lane.enemyCount++;
            lane.enemyThreat += wave!.getAliveRatio();
        }

        this.activeEnemyIntelCount = 0;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidWave(wave)) continue;
            if (wave!.team !== enemyTeam) continue;
            if (wave!.laneId < 0) continue;

            const laneId =
                this.gameManager.clampLaneId(wave!.laneId);
            const lane =
                this.laneIntel[laneId];

            if (!lane) continue;

            const intel =
                this.getEnemyIntelBuffer(
                    this.activeEnemyIntelCount++
                );

            this.fillEnemyIntel(intel, wave!, laneId);
        }
    }

    private fillEnemyIntel(
        intel: SmartWaveIntel,
        wave: BattleWave,
        laneId: number
    ) {
        intel.reset();

        intel.wave = wave;
        intel.laneId = laneId;
        intel.aliveRatio = wave.getAliveRatio();
        intel.responseTier =
            this.getBestAvailableResponseTier(wave);

        this.fillLiveResponseState(
            intel,
            wave,
            laneId
        );

        intel.uncovered = Math.max(
            0,
            this.attackCounterCoverageRatio -
                intel.coverage
        );

        this.getWaveCenter(
            wave,
            intel
        );

        intel.distanceToDefend =
            this.getDistanceToDefendPoint(
                intel.centerX,
                intel.centerZ
            );
        intel.progressToDefend =
            this.getProgressToDefendPoint(
                intel.centerZ
            );
        intel.dangerousToDefend =
            intel.progressToDefend >=
            DangerousThreatProgress;

        intel.unengaged =
            !wave.hasEngaged();

        const lane =
            this.laneIntel[laneId];

        intel.allyCountInLane =
            lane ? lane.allyCount : 0;

        intel.allyBlockersFromSpawn =
            this.countAllyBlockersFromSpawnToTarget(
                wave,
                laneId,
                intel.centerZ
            );

        intel.firstEnemyFromSpawn =
            this.isFirstEnemyFromSpawn(
                wave,
                laneId,
                intel.centerZ
            );

        const distanceScore =
            intel.dangerousToDefend
                ? Math.max(0, 120 - intel.distanceToDefend)
                : 0;
        const proximityScore =
            distanceScore * 1000;
        const unengagedScore =
            intel.unengaged ? 100 : 0;
        const clearLaneScore =
            intel.allyBlockersFromSpawn <= 0
                ? 20
                : 0;
        const oneBlockerScore =
            intel.allyBlockersFromSpawn === 1
                ? 10
                : 0;
        const underCounteredScore =
            intel.uncovered > 0 ? intel.uncovered * 120 : 0;
        const failedCounterScore =
            intel.hasStrugglingAlly ? 80 : 0;

        intel.threatScore =
            proximityScore +
            unengagedScore +
            clearLaneScore +
            oneBlockerScore +
            underCounteredScore +
            failedCounterScore +
            intel.aliveRatio * 45 +
            (wave.hasEngaged() ? 20 : 0);
    }

    private findBestResponseTarget(): SmartWaveIntel | null {
        let best: SmartWaveIntel | null = null;
        let nearestDangerousDistance = Infinity;
        let hasDangerousThreat = false;

        this.counterCandidateBuffer.length = 0;

        for (let i = 0; i < this.activeEnemyIntelCount; i++) {
            const intel = this.enemyIntel[i];

            if (!this.isResponseCandidate(intel)) continue;

            this.counterCandidateBuffer.push(intel);

            if (intel.dangerousToDefend) {
                hasDangerousThreat = true;
                nearestDangerousDistance = Math.min(
                    nearestDangerousDistance,
                    intel.distanceToDefend
                );
            }
        }

        if (this.counterCandidateBuffer.length <= 0) {
            return null;
        }

        for (let i = 0; i < this.counterCandidateBuffer.length; i++) {
            const intel = this.counterCandidateBuffer[i];

            if (
                hasDangerousThreat &&
                (
                    !intel.dangerousToDefend ||
                    intel.distanceToDefend >
                        nearestDangerousDistance +
                        ComparableThreatDistance
                )
            ) {
                continue;
            }

            if (
                !best ||
                this.isHigherCounterPriority(intel, best)
            ) {
                best = intel;
            }
        }

        return best;
    }

    private isHigherCounterPriority(
        candidate: SmartWaveIntel,
        current: SmartWaveIntel
    ) {
        const candidatePathPriority =
            this.getCounterPathPriority(candidate);
        const currentPathPriority =
            this.getCounterPathPriority(current);

        if (
            candidatePathPriority !==
            currentPathPriority
        ) {
            return candidatePathPriority >
                currentPathPriority;
        }

        return candidate.threatScore >
            current.threatScore;
    }

    private getCounterPathPriority(
        intel: SmartWaveIntel
    ) {
        if (intel.allyBlockersFromSpawn <= 0) {
            return 2;
        }

        if (intel.allyBlockersFromSpawn === 1) {
            return 1;
        }

        return 0;
    }

    private findIntelForWave(
        wave: BattleWave
    ): SmartWaveIntel | null {
        for (let i = 0; i < this.activeEnemyIntelCount; i++) {
            const intel = this.enemyIntel[i];

            if (intel.wave === wave) {
                return intel;
            }
        }

        return null;
    }

    private isResponseCandidate(
        intel: SmartWaveIntel | null
    ) {
        if (!intel || !intel.wave) return false;
        if (!this.isValidWave(intel.wave)) return false;
        if (intel.aliveRatio < this.ignoreNearlyDeadWaveRatio) {
            return false;
        }

        if (
            intel.uncovered <= 0 &&
            !intel.hasStrugglingAlly
        ) {
            return false;
        }

        if (!intel.firstEnemyFromSpawn) {
            return false;
        }

        return this.hasUsefulResponseEntry(intel);
    }

    private spawnResponse(
        intel: SmartWaveIntel
    ) {
        if (!this.gameManager || !intel.wave) return false;

        const entry =
            this.chooseEntryForTarget(
                intel
            );

        if (!entry) return false;

        const laneId = intel.laneId;
        const aggressiveForward =
            this.shouldSpawnCounterAggressiveForward(
                intel,
                laneId
            );

        const spawned =
            this.gameManager.spawnWaveByEntry(
                this.team,
                entry,
                laneId,
                aggressiveForward
            );

        if (!spawned) return false;

        this.recordDecisionSpawn(
            aggressiveForward,
            'response'
        );

        this.stateLog(
            `RESPONSE wave=${intel.wave.id} ` +
            `target=${unitTypeToName(intel.wave.unitType)} ` +
            `spawn=${entry.name} lane=${laneId} targetLane=${intel.laneId} ` +
            `coverage=${intel.coverage.toFixed(2)} ` +
            `unengaged=${intel.unengaged} ` +
            `allyLane=${intel.allyCountInLane} ` +
            `blockers=${intel.allyBlockersFromSpawn} ` +
            `firstFromSpawn=${intel.firstEnemyFromSpawn} ` +
            `progress=${intel.progressToDefend.toFixed(2)} ` +
            `dangerous=${intel.dangerousToDefend} ` +
            `response=${SmartResponseTier[intel.responseTier]} ` +
            `struggling=${intel.hasStrugglingAlly} ` +
            `score=${intel.threatScore.toFixed(1)} ` +
            `accurate=true ` +
            `aggressive=${aggressiveForward}`
        );

        return true;
    }

    private shouldSpawnCounterAggressiveForward(
        intel: SmartWaveIntel,
        spawnLaneId: number
    ) {
        if (spawnLaneId === intel.laneId) {
            if (intel.allyBlockersFromSpawn > 0) {
                return true;
            }

            if (
                intel.allyCountInLane <= 0 &&
                intel.allyBlockersFromSpawn <= 0
            ) {
                return true;
            }
        }

        return this.shouldSpawnAggressiveForward();
    }

    private chooseEntryForTarget(
        intel: SmartWaveIntel
    ): UnitPrefabEntry | null {
        if (!intel.wave) return null;

        if (this.affordableEntries.length <= 0) {
            return null;
        }

        this.bestEntryBuffer.length = 0;
        let bestScore = -Infinity;

        for (let i = 0; i < this.affordableEntries.length; i++) {
            const entry = this.affordableEntries[i];

            if (
                !this.entryMatchesResponseTier(
                    entry,
                    intel.wave,
                    intel.responseTier
                )
            ) {
                continue;
            }

            if (
                !this.wouldImproveResponseCoverage(
                    intel,
                    entry
                )
            ) {
                continue;
            }

            if (
                intel.responseTier ===
                SmartResponseTier.Random
            ) {
                this.bestEntryBuffer.push(entry);
                continue;
            }

            const score =
                this.getCounterScore(
                    entry,
                    intel.wave
                );

            if (score > bestScore + 0.0001) {
                bestScore = score;
                this.bestEntryBuffer.length = 0;
                this.bestEntryBuffer.push(entry);
            } else if (
                Math.abs(score - bestScore) <= 0.0001
            ) {
                this.bestEntryBuffer.push(entry);
            }
        }

        if (this.bestEntryBuffer.length <= 0) {
            return null;
        }

        const index = Math.floor(
            Math.random() * this.bestEntryBuffer.length
        );

        return this.bestEntryBuffer[index];
    }

    private spawnNaiveWave() {
        if (!this.gameManager) return false;

        const entry =
            this.getRandomAffordableEntry();

        if (!entry) return false;

        const laneCount =
            this.gameManager.getSafeLaneCount();
        const laneId =
            laneCount > 0
                ? Math.floor(Math.random() * laneCount)
                : -1;
        const aggressiveForward =
            Math.random() <
            this.clamp01(this.aggressiveForwardChance);

        const spawned =
            this.gameManager.spawnWaveByEntry(
                this.team,
                entry,
                laneId,
                aggressiveForward
            );

        if (!spawned) return false;

        this.recordDecisionSpawn(
            aggressiveForward,
            'naive'
        );

        this.stateLog(
            `NAIVE_RANDOM spawn=${entry.name} ` +
            `lane=${laneId} aggressive=${aggressiveForward}`
        );

        return true;
    }

    private spawnDeliberatelyBadWave() {
        if (!this.gameManager) return false;

        let losingIntel: SmartWaveIntel | null = null;
        let losingEntry: UnitPrefabEntry | null = null;
        let losingChoiceCount = 0;
        let neutralIntel: SmartWaveIntel | null = null;
        let neutralEntry: UnitPrefabEntry | null = null;
        let neutralChoiceCount = 0;
        let weakIntel: SmartWaveIntel | null = null;
        let weakEntry: UnitPrefabEntry | null = null;
        let weakRatio = Infinity;
        let weakChoiceCount = 0;

        for (let i = 0; i < this.activeEnemyIntelCount; i++) {
            const intel = this.enemyIntel[i];

            if (!intel.wave) continue;
            if (!this.isValidWave(intel.wave)) continue;
            if (!intel.firstEnemyFromSpawn) continue;
            if (
                intel.aliveRatio <
                this.ignoreNearlyDeadWaveRatio
            ) {
                continue;
            }

            if (
                this.hasAnyAllyRelevantToTarget(
                    intel.wave,
                    intel.laneId
                )
            ) {
                continue;
            }

            for (let j = 0; j < this.affordableEntries.length; j++) {
                const candidateEntry =
                    this.affordableEntries[j];
                const ratio =
                    this.getMatchupRatio(
                        candidateEntry,
                        intel.wave
                    );

                if (ratio < 1 - 0.0001) {
                    losingChoiceCount++;

                    if (
                        Math.random() *
                            losingChoiceCount <
                        1
                    ) {
                        losingIntel = intel;
                        losingEntry = candidateEntry;
                    }

                    continue;
                }

                if (ratio <= 1 + 0.0001) {
                    neutralChoiceCount++;

                    if (
                        Math.random() *
                            neutralChoiceCount <
                        1
                    ) {
                        neutralIntel = intel;
                        neutralEntry = candidateEntry;
                    }
                }

                if (ratio < weakRatio - 0.0001) {
                    weakRatio = ratio;
                    weakChoiceCount = 1;
                    weakIntel = intel;
                    weakEntry = candidateEntry;
                } else if (
                    Math.abs(ratio - weakRatio) <= 0.0001
                ) {
                    weakChoiceCount++;

                    if (
                        Math.random() *
                            weakChoiceCount <
                        1
                    ) {
                        weakIntel = intel;
                        weakEntry = candidateEntry;
                    }
                }
            }
        }

        const useLosingChoice =
            !!losingIntel &&
            !!losingEntry &&
            (
                !neutralIntel ||
                !neutralEntry ||
                Math.random() <
                    DeliberateLosingChoiceChance
            );
        const targetIntel =
            useLosingChoice
                ? losingIntel
                : neutralIntel ||
                    weakIntel;
        const entry =
            useLosingChoice
                ? losingEntry
                : neutralEntry ||
                    weakEntry;
        const mistakeKind =
            useLosingChoice
                ? 'losing'
                : neutralIntel
                    ? 'neutral'
                    : 'weakest';

        if (!targetIntel || !targetIntel.wave || !entry) {
            return false;
        }

        const randomLaneId =
            this.getRandomLaneId();
        const laneId =
            randomLaneId >= 0
                ? randomLaneId
                : targetIntel.laneId;

        const spawned =
            this.gameManager.spawnWaveByEntry(
                this.team,
                entry,
                laneId,
                false
            );

        if (!spawned) return false;

        this.recordDecisionSpawn(
            false,
            'deliberate-mistake'
        );

        this.stateLog(
            `DELIBERATE_MISTAKE wave=${targetIntel.wave.id} ` +
            `target=${unitTypeToName(targetIntel.wave.unitType)} ` +
            `spawn=${entry.name} lane=${laneId} ` +
            `targetLane=${targetIntel.laneId} ` +
            `kind=${mistakeKind}`
        );

        return true;
    }

    private hasAnyAllyRelevantToTarget(
        targetWave: BattleWave,
        laneId: number
    ) {
        if (!this.gameManager) return false;

        const waves = this.gameManager.waves;

        for (let i = 0; i < waves.length; i++) {
            const allyWave = waves[i];

            if (!this.isValidWave(allyWave)) continue;
            if (allyWave!.team !== this.team) continue;
            if (allyWave!.laneId < 0) continue;
            if (
                this.gameManager.clampLaneId(allyWave!.laneId) !==
                laneId
            ) {
                continue;
            }

            const relation =
                this.getWaveTargetRelation(
                    allyWave!,
                    targetWave
                );

            if (relation > 0) return true;
            if (relation < 0) continue;

            if (
                this.isFirstEnemyAheadForAlly(
                    allyWave!,
                    targetWave,
                    laneId
                )
            ) {
                return true;
            }
        }

        return false;
    }

    private getMatchupRatio(
        entry: UnitPrefabEntry,
        targetWave: BattleWave
    ) {
        const ownScore =
            this.getCounterScore(
                entry,
                targetWave
            );
        const enemyScore =
            this.getReverseCounterScore(
                targetWave,
                entry
            );

        return ownScore /
            Math.max(0.0001, enemyScore);
    }

    private getReverseCounterScore(
        attackerWave: BattleWave,
        defenderEntry: UnitPrefabEntry
    ) {
        const counter =
            CounterSettings.instance;

        if (!counter) return 1;

        return counter.getCounterScore(
            attackerWave.unitType,
            defenderEntry.unitType
        );
    }

    private trySpawnAggressiveForward(
        reason: string
    ) {
        if (!this.gameManager) return false;
        if (Math.random() > this.clamp01(this.aggressiveForwardChance)) {
            return false;
        }

        const laneId =
            this.getBestEmptyLane();

        if (laneId < 0) {
            return false;
        }

        const entry =
            this.getFastestAffordableEntry();

        if (!entry) return false;

        const spawned =
            this.gameManager.spawnWaveByEntry(
                this.team,
                entry,
                laneId,
                true
            );

        if (!spawned) return false;

        this.recordDecisionSpawn(
            true,
            'aggressive-empty-lane'
        );

        this.stateLog(
            `AGGRESSIVE ${reason}: spawn=${entry.name} lane=${laneId}`
        );

        return true;
    }

    private spawnOpeningWave() {
        if (!this.gameManager) return false;

        const entry =
            this.getRandomAffordableEntry();

        if (!entry) return false;

        const aggressiveForward =
            this.shouldSpawnAggressiveForward();
        const spawned =
            this.gameManager.spawnWaveByEntry(
                this.team,
                entry,
                -1,
                aggressiveForward
            );

        if (!spawned) return false;

        this.recordDecisionSpawn(
            aggressiveForward,
            'opening'
        );

        this.stateLog(
            `OPENING spawn=${entry.name} aggressive=${aggressiveForward}`
        );
        return true;
    }

    private getBestEmptyLane() {
        if (!this.gameManager) return -1;

        const laneCount =
            this.gameManager.getSafeLaneCount();

        let bestLane = -1;
        let bestScore = -Infinity;

        for (let laneId = 0; laneId < laneCount; laneId++) {
            const lane =
                this.laneIntel[laneId];

            if (!lane) continue;
            if (lane.enemyCount > 0) continue;
            if (lane.allyCount > 0) continue;

            const score =
                Math.random() * 0.001 -
                lane.trafficCount;

            if (score > bestScore) {
                bestScore = score;
                bestLane = laneId;
            }
        }

        return bestLane;
    }

    private fillLiveResponseState(
        targetIntel: SmartWaveIntel,
        targetWave: BattleWave,
        laneId: number
    ) {
        targetIntel.coverage = 0;
        targetIntel.hasStrugglingAlly = false;

        if (!this.gameManager) return;

        const waves = this.gameManager.waves;
        const threshold =
            this.clamp01(this.rescueAllyAliveRatio);
        const targetAlive =
            targetWave.getAliveCount();
        let liveCounterUnits = 0;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidWave(wave)) continue;
            if (wave!.team !== this.team) continue;
            if (wave!.laneId < 0) continue;
            if (
                this.gameManager.clampLaneId(wave!.laneId) !==
                laneId
            ) {
                continue;
            }

            if (
                !this.waveMatchesResponseTier(
                    wave!,
                    targetWave,
                    targetIntel.responseTier
                )
            ) {
                continue;
            }

            const targetRelation =
                this.getWaveTargetRelation(
                    wave!,
                    targetWave
                );

            if (targetRelation < 0) {
                continue;
            }

            if (targetRelation > 0) {
                liveCounterUnits += targetRelation;

                if (wave!.getAliveRatio() <= threshold) {
                    targetIntel.hasStrugglingAlly = true;
                }

                continue;
            }

            if (
                !this.isFirstEnemyAheadForAlly(
                    wave!,
                    targetWave,
                    laneId
                )
            ) {
                continue;
            }

            liveCounterUnits +=
                wave!.getAliveCount();

            if (wave!.getAliveRatio() <= threshold) {
                targetIntel.hasStrugglingAlly = true;
            }
        }

        targetIntel.coverage =
            targetAlive > 0
                ? liveCounterUnits / targetAlive
                : 1;
    }

    private getWaveTargetRelation(
        allyWave: BattleWave,
        targetWave: BattleWave
    ) {
        let directTargetCount = 0;
        let hasOtherTarget = false;

        for (let i = 0; i < allyWave.units.length; i++) {
            const unit = allyWave.units[i];

            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props || unit.props.isDead()) continue;

            const target =
                unit.getValidEnemyTarget();

            if (!target) continue;

            if (
                BattleWave.getWaveForUnit(target) ===
                targetWave
            ) {
                directTargetCount++;
            } else {
                hasOtherTarget = true;
            }
        }

        if (directTargetCount > 0) {
            return directTargetCount;
        }

        return hasOtherTarget ? -1 : 0;
    }

    private isFirstEnemyAheadForAlly(
        allyWave: BattleWave,
        targetWave: BattleWave,
        laneId: number
    ) {
        if (!this.gameManager) return false;

        const allyZ =
            this.getWaveCenterZ(allyWave);
        const targetZ =
            this.getWaveCenterZ(targetWave);
        const forwardSign =
            this.team === 0 ? 1 : -1;
        const targetForwardDistance =
            (targetZ - allyZ) * forwardSign;

        if (targetForwardDistance < 0) {
            return false;
        }

        const waves =
            this.gameManager.waves;
        const enemyTeam =
            this.team === 0 ? 1 : 0;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidWave(wave)) continue;
            if (wave === targetWave) continue;
            if (wave!.team !== enemyTeam) continue;
            if (wave!.laneId < 0) continue;
            if (
                this.gameManager.clampLaneId(wave!.laneId) !==
                laneId
            ) {
                continue;
            }

            const otherDistance =
                (
                    this.getWaveCenterZ(wave!) -
                    allyZ
                ) * forwardSign;

            if (otherDistance < 0) continue;

            if (
                otherDistance <
                    targetForwardDistance - 0.0001 ||
                (
                    Math.abs(
                        otherDistance -
                        targetForwardDistance
                    ) <= 0.0001 &&
                    wave!.id < targetWave.id
                )
            ) {
                return false;
            }
        }

        return true;
    }

    private getWaveCounterScore(
        attackerWave: BattleWave,
        targetWave: BattleWave
    ) {
        const counter =
            CounterSettings.instance;

        if (!counter) return 1;

        return counter.getCounterScore(
            attackerWave.unitType,
            targetWave.unitType
        );
    }

    private getBestAvailableResponseTier(
        targetWave: BattleWave
    ) {
        if (this.isHeroWave(targetWave)) {
            return SmartResponseTier.None;
        }

        for (let i = 0; i < this.affordableEntries.length; i++) {
            const entry = this.affordableEntries[i];
            const counterScore =
                this.getCounterScore(
                    entry,
                    targetWave
                );

            if (this.isRealCounterScore(counterScore)) {
                return SmartResponseTier.Counter;
            }
        }

        return this.affordableEntries.length > 0
            ? SmartResponseTier.Random
            : SmartResponseTier.None;
    }

    private entryMatchesResponseTier(
        entry: UnitPrefabEntry,
        targetWave: BattleWave,
        tier: SmartResponseTier
    ) {
        if (tier === SmartResponseTier.Counter) {
            return this.isRealCounterScore(
                this.getCounterScore(
                    entry,
                    targetWave
                )
            );
        }

        if (tier === SmartResponseTier.Random) {
            return true;
        }

        return false;
    }

    private waveMatchesResponseTier(
        allyWave: BattleWave,
        targetWave: BattleWave,
        tier: SmartResponseTier
    ) {
        if (tier === SmartResponseTier.None) {
            return false;
        }

        if (tier === SmartResponseTier.Random) {
            return true;
        }

        const isCounter =
            this.isRealCounterScore(
                this.getWaveCounterScore(
                    allyWave,
                    targetWave
                )
            );

        if (isCounter) {
            return true;
        }

        if (tier === SmartResponseTier.Counter) {
            return false;
        }

        return false;
    }

    private isHeroWave(
        wave: BattleWave
    ) {
        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];

            if (unit && unit.isHero) {
                return true;
            }
        }

        return false;
    }

    private hasUsefulResponseEntry(
        intel: SmartWaveIntel
    ) {
        if (!intel.wave) return false;
        if (
            intel.responseTier ===
            SmartResponseTier.None
        ) {
            return false;
        }

        for (let i = 0; i < this.affordableEntries.length; i++) {
            const entry =
                this.affordableEntries[i];

            if (
                !this.entryMatchesResponseTier(
                    entry,
                    intel.wave,
                    intel.responseTier
                )
            ) {
                continue;
            }

            if (
                this.wouldImproveResponseCoverage(
                    intel,
                    entry
                )
            ) {
                return true;
            }
        }

        return false;
    }

    private wouldImproveResponseCoverage(
        intel: SmartWaveIntel,
        entry: UnitPrefabEntry
    ) {
        if (!intel.wave) return false;
        if (intel.hasStrugglingAlly) return true;
        if (intel.coverage <= 0.0001) return true;

        const targetAlive =
            intel.wave.getAliveCount();

        if (targetAlive <= 0) return false;

        const requiredCoverage =
            Math.max(
                0,
                this.attackCounterCoverageRatio
            );
        const addedCoverage =
            Math.max(
                0,
                Math.floor(entry.unitCount)
            ) / targetAlive;
        const currentError =
            Math.abs(
                requiredCoverage -
                intel.coverage
            );
        const projectedError =
            Math.abs(
                requiredCoverage -
                (
                    intel.coverage +
                    addedCoverage
                )
            );

        return projectedError <
            currentError - 0.0001;
    }

    private countAllyBlockersFromSpawnToTarget(
        targetWave: BattleWave,
        laneId: number,
        targetZ: number
    ) {
        if (!this.gameManager) return 0;

        const waves =
            this.gameManager.waves;
        const spawnZ =
            this.team === 0
                ? this.gameManager.teamASpawnZ
                : this.gameManager.teamBSpawnZ;
        const minZ =
            Math.min(spawnZ, targetZ);
        const maxZ =
            Math.max(spawnZ, targetZ);

        let blockers = 0;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidWave(wave)) continue;
            if (wave === targetWave) continue;
            if (wave!.team !== this.team) continue;
            if (wave!.laneId < 0) continue;
            if (
                this.gameManager.clampLaneId(wave!.laneId) !==
                laneId
            ) {
                continue;
            }

            const centerZ =
                this.getWaveCenterZ(wave!);

            if (centerZ < minZ || centerZ > maxZ) {
                continue;
            }

            blockers++;
        }

        return blockers;
    }

    private isFirstEnemyFromSpawn(
        targetWave: BattleWave,
        laneId: number,
        targetZ: number
    ) {
        if (!this.gameManager) return true;

        const waves =
            this.gameManager.waves;
        const spawnZ =
            this.team === 0
                ? this.gameManager.teamASpawnZ
                : this.gameManager.teamBSpawnZ;
        const forwardSign =
            this.team === 0 ? 1 : -1;
        const targetForwardDistance =
            (targetZ - spawnZ) * forwardSign;
        const targetDirection =
            targetForwardDistance >= 0 ? 1 : -1;
        const targetDistance =
            Math.abs(targetForwardDistance);
        const enemyTeam =
            this.team === 0 ? 1 : 0;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidWave(wave)) continue;
            if (wave === targetWave) continue;
            if (wave!.team !== enemyTeam) continue;
            if (wave!.laneId < 0) continue;
            if (
                this.gameManager.clampLaneId(wave!.laneId) !==
                laneId
            ) {
                continue;
            }

            const otherForwardDistance =
                (
                    this.getWaveCenterZ(wave!) -
                    spawnZ
                ) * forwardSign;

            if (
                otherForwardDistance *
                    targetDirection <
                0
            ) {
                continue;
            }

            const otherDistance =
                Math.abs(otherForwardDistance);

            if (
                otherDistance <
                    targetDistance - 0.0001 ||
                (
                    Math.abs(
                        otherDistance -
                        targetDistance
                    ) <= 0.0001 &&
                    wave!.id < targetWave.id
                )
            ) {
                return false;
            }
        }

        return true;
    }

    private getWaveCenter(
        wave: BattleWave,
        intel: SmartWaveIntel
    ) {
        let count = 0;
        let sumX = 0;
        let sumZ = 0;

        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];

            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props) continue;
            if (unit.props.isDead()) continue;

            count++;
            sumX += unit.agent.pos.x;
            sumZ += unit.agent.pos.z;
        }

        if (count <= 0) {
            intel.centerX = 0;
            intel.centerZ = 0;
            return;
        }

        intel.centerX = sumX / count;
        intel.centerZ = sumZ / count;
    }

    private getWaveCenterZ(wave: BattleWave) {
        let count = 0;
        let sumZ = 0;

        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];

            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props) continue;
            if (unit.props.isDead()) continue;

            count++;
            sumZ += unit.agent.pos.z;
        }

        if (count <= 0) return 0;

        return sumZ / count;
    }

    private getDistanceToDefendPoint(
        x: number,
        z: number
    ) {
        if (!this.gameManager) return 0;

        const hero =
            this.team === 0
                ? this.gameManager.teamAHero
                : this.gameManager.teamBHero;

        const defendX =
            hero && hero.agent ? hero.agent.pos.x : 0;
        const defendZ =
            hero && hero.agent
                ? hero.agent.pos.z
                : this.team === 0
                    ? this.gameManager.teamASpawnZ
                    : this.gameManager.teamBSpawnZ;

        const dx = x - defendX;
        const dz = z - defendZ;

        return Math.sqrt(dx * dx + dz * dz);
    }

    private getProgressToDefendPoint(
        z: number
    ) {
        if (!this.gameManager) return 0;

        const enemySpawnZ =
            this.team === 0
                ? this.gameManager.teamBSpawnZ
                : this.gameManager.teamASpawnZ;
        const hero =
            this.team === 0
                ? this.gameManager.teamAHero
                : this.gameManager.teamBHero;
        const defendZ =
            hero && hero.agent
                ? hero.agent.pos.z
                : this.team === 0
                    ? this.gameManager.teamASpawnZ
                    : this.gameManager.teamBSpawnZ;
        const totalDistance =
            defendZ - enemySpawnZ;

        if (Math.abs(totalDistance) < 0.0001) {
            return 1;
        }

        const progress =
            (z - enemySpawnZ) /
            totalDistance;

        return this.clamp01(progress);
    }

    private collectAffordableEntries() {
        this.affordableEntries.length = 0;

        if (!this.gameManager) return;

        this.gameManager.collectAffordableEntries(
            this.team,
            this.affordableEntries
        );
    }

    private getRandomAffordableEntry() {
        if (this.affordableEntries.length <= 0) {
            return null;
        }

        const index = Math.floor(
            Math.random() *
            this.affordableEntries.length
        );

        return this.affordableEntries[index];
    }

    private getRandomLaneId() {
        if (!this.gameManager) return -1;

        const laneCount =
            this.gameManager.getSafeLaneCount();

        if (laneCount <= 0) return -1;

        return Math.floor(
            Math.random() * laneCount
        );
    }

    private getFastestAffordableEntry() {
        let best: UnitPrefabEntry | null = null;
        let bestSpeed = -Infinity;
        let bestCost = Infinity;

        for (let i = 0; i < this.affordableEntries.length; i++) {
            const entry = this.affordableEntries[i];
            const speed = Math.max(0, entry.maxSpeed);
            const cost = Math.max(0, entry.combatPointCost);

            if (
                speed > bestSpeed + 0.0001 ||
                (
                    Math.abs(speed - bestSpeed) <= 0.0001 &&
                    cost < bestCost
                )
            ) {
                best = entry;
                bestSpeed = speed;
                bestCost = cost;
            }
        }

        return best;
    }

    private getCounterScore(
        entry: UnitPrefabEntry,
        targetWave: BattleWave
    ) {
        const counter =
            CounterSettings.instance;

        if (!counter) return 1;

        return counter.getCounterScore(
            entry.unitType,
            targetWave.unitType
        );
    }

    private isRealCounterScore(score: number) {
        return score > 1.0001;
    }

    private ensureLaneIntel(laneCount: number) {
        for (let i = this.laneIntel.length; i < laneCount; i++) {
            this.laneIntel.push(new SmartLaneIntel());
        }
    }

    private getEnemyIntelBuffer(index: number) {
        while (this.enemyIntel.length <= index) {
            this.enemyIntel.push(new SmartWaveIntel());
        }

        return this.enemyIntel[index];
    }

    private canSpawnMoreWave(
        aliveWaveCount: number = this.getAliveWaveCount(this.team)
    ) {
        if (!this.enableMaxAliveWaveLimit) {
            return true;
        }

        if (!this.gameManager) return false;

        const max = Math.max(
            1,
            Math.floor(this.maxAliveWaves)
        );

        return aliveWaveCount < max;
    }

    private refreshMaxAliveWaveReached(
        aliveWaveCount: number = this.getAliveWaveCount(this.team)
    ) {
        if (this.hasReachedMaxAliveWavesOnce) {
            return true;
        }

        if (!this.enableMaxAliveWaveLimit) {
            this.hasReachedMaxAliveWavesOnce = true;
            return true;
        }

        const max = Math.max(
            1,
            Math.floor(this.maxAliveWaves)
        );

        if (aliveWaveCount >= max) {
            this.hasReachedMaxAliveWavesOnce = true;
        }

        return this.hasReachedMaxAliveWavesOnce;
    }

    private shouldSpawnAggressiveForward() {
        return !this.hasReachedMaxAliveWavesOnce;
    }

    private getAliveWaveCount(team: number) {
        if (!this.gameManager) return 0;

        return this.gameManager.getAliveWaveCount(team);
    }

    private isValidWave(wave: BattleWave | null) {
        if (!wave) return false;
        if (wave.released) return false;
        if (wave.isDead()) return false;

        return true;
    }

    private getDecisionAccuracy() {
        return this.clamp01(this.decisionAccuracy);
    }

    private rollAccurateDecision() {
        return Math.random() <
            this.getDecisionAccuracy();
    }

    private clamp01(v: number) {
        return Math.max(
            0,
            Math.min(1, v)
        );
    }

    private randomizeNextInterval() {
        const min = Math.max(
            0.1,
            this.minSpawnInterval
        );

        const max = Math.max(
            min,
            this.maxSpawnInterval
        );

        this.nextInterval =
            min + Math.random() * (max - min);
    }

    private hasReachedMinSpawnInterval() {
        return this.timer >=
            Math.max(
                0.1,
                this.minSpawnInterval
            );
    }

    private recordDecisionSpawn(
        aggressiveForward: boolean,
        reason: string
    ) {
        if (!this.enableDecisionStats) return;

        if (aggressiveForward) {
            this.decisionStatsAggressive++;
        } else {
            this.decisionStatsNormal++;
        }

        this.logDecisionStats(
            aggressiveForward
                ? `aggressive:${reason}`
                : `normal:${reason}`
        );
    }

    private recordDecisionWait(reason: string) {
        if (!this.enableDecisionStats) return;

        this.decisionStatsWait++;
        this.logDecisionStats(`wait:${reason}`);
    }

    private recordDecisionSkip(reason: string) {
        if (!this.enableDecisionStats) return;

        this.decisionStatsSkip++;
        this.logDecisionStats(`skip:${reason}`);
    }

    private logDecisionStats(event: string) {
        if (!this.enableDecisionStats) return;

        const total =
            this.decisionStatsAggressive +
            this.decisionStatsNormal +
            this.decisionStatsWait;

        if (total <= 0 && this.decisionStatsSkip <= 0) {
            return;
        }

        console.log(
            `[SmartArmyBrain Stats T${this.team}] ` +
            `event=${event} total=${total} ` +
            `aggressive=${this.decisionStatsAggressive}` +
            `(${this.getDecisionStatsPercent(this.decisionStatsAggressive, total)}%) ` +
            `normal=${this.decisionStatsNormal}` +
            `(${this.getDecisionStatsPercent(this.decisionStatsNormal, total)}%) ` +
            `wait=${this.decisionStatsWait}` +
            `(${this.getDecisionStatsPercent(this.decisionStatsWait, total)}%) ` +
            `skip=${this.decisionStatsSkip}`
        );
    }

    private getDecisionStatsPercent(
        value: number,
        total: number
    ) {
        if (total <= 0) return '0.0';

        return (
            value * 100 /
            total
        ).toFixed(1);
    }

    private stateLog(message: string) {
        if (!this.enableStateLog) return;

        console.log(
            `[SmartArmyBrain State T${this.team}] ${message}`
        );
    }

    private debugLog(message: string) {
        if (!this.enableDebugLog) return;

        console.log(
            `[SmartArmyBrain Debug T${this.team}] ${message}`
        );
    }
}
