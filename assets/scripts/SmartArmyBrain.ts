import { _decorator, Component } from 'cc';
import { GameManager, UnitPrefabEntry } from './GameManager';
import { BattleWave } from './BattleWave';
import { CounterSettings } from './CounterSettings';
import { unitTypeToName } from './BattleTypes';

const { ccclass, property } = _decorator;

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
    hasStrugglingAlly = false;
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
        this.hasStrugglingAlly = false;
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
        tooltip: '1 = best counter and best reachable lane. 0 = more random unit/lane choices.'
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

    @property
    spawnOpeningWaveIfNoEnemyWave = true;

    @property
    enableStateLog = false;

    @property
    enableDebugLog = false;

    private timer = 0;
    private nextInterval = 3;
    private elapsedTime = 0;
    private hasReachedMaxAliveWavesOnce = false;

    private laneIntel: SmartLaneIntel[] = [];
    private enemyIntel: SmartWaveIntel[] = [];
    private activeEnemyIntelCount = 0;
    private affordableEntries: UnitPrefabEntry[] = [];
    private bestEntryBuffer: UnitPrefabEntry[] = [];

    start() {
        this.randomizeNextInterval();
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

    private thinkAndSpawn() {
        if (!this.gameManager) return;

        const aliveWaveCount =
            this.getAliveWaveCount(this.team);

        this.refreshMaxAliveWaveReached(aliveWaveCount);

        if (!this.canSpawnMoreWave(aliveWaveCount)) {
            this.debugLog('Skip: max alive waves reached.');
            return;
        }

        const entries =
            this.gameManager.getTeamEntries(this.team);

        this.collectAffordableEntries(entries);

        if (this.affordableEntries.length <= 0) {
            this.debugLog('Skip: no affordable entries.');
            return;
        }

        this.rebuildIntel();

        const counterTarget =
            this.findBestCounterTarget();

        if (counterTarget) {
            this.spawnCounter(counterTarget);
            return;
        }

        if (this.trySpawnAggressiveForward('No reachable counter target')) {
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
        intel.coverage = wave.getCounterCoverageRatio();
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

        intel.hasStrugglingAlly =
            this.hasStrugglingAllyNearTarget(intel);

        const distanceScore =
            Math.max(0, 120 - intel.distanceToDefend);
        const underCounteredScore =
            intel.uncovered > 0 ? intel.uncovered * 120 : 0;
        const failedCounterScore =
            intel.hasStrugglingAlly ? 80 : 0;

        intel.threatScore =
            underCounteredScore +
            failedCounterScore +
            intel.aliveRatio * 45 +
            distanceScore +
            (wave.hasEngaged() ? 20 : 0);
    }

    private findBestCounterTarget(): SmartWaveIntel | null {
        let best: SmartWaveIntel | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < this.activeEnemyIntelCount; i++) {
            const intel = this.enemyIntel[i];

            if (!this.isCounterCandidate(intel)) continue;

            if (intel.threatScore > bestScore) {
                bestScore = intel.threatScore;
                best = intel;
            }
        }

        return best;
    }

    private isCounterCandidate(
        intel: SmartWaveIntel | null
    ) {
        if (!intel || !intel.wave) return false;
        if (!this.isValidWave(intel.wave)) return false;
        if (intel.aliveRatio < this.ignoreNearlyDeadWaveRatio) {
            return false;
        }

        return !!this.chooseEntryForTarget(
            intel.wave,
            true
        );
    }

    private spawnCounter(
        intel: SmartWaveIntel
    ) {
        if (!this.gameManager || !intel.wave) return false;

        const entry =
            this.chooseEntryForTarget(
                intel.wave,
                false
            );

        if (!entry) return false;

        const laneId =
            this.chooseCounterLane(
                intel
            );

        const spawned =
            this.gameManager.spawnWaveByEntry(
                this.team,
                entry,
                laneId,
                this.shouldSpawnAggressiveForward()
            );

        if (!spawned) return false;

        const realCounter =
            this.isRealCounterScore(
                this.getCounterScore(
                    entry,
                    intel.wave
                )
            );

        if (
            realCounter &&
            laneId === intel.laneId
        ) {
            intel.wave.addCounterAssignment(
                entry.unitCount
            );
        }

        this.stateLog(
            `COUNTER wave=${intel.wave.id} ` +
            `target=${unitTypeToName(intel.wave.unitType)} ` +
            `spawn=${entry.name} lane=${laneId} targetLane=${intel.laneId} ` +
            `coverage=${intel.coverage.toFixed(2)} ` +
            `struggling=${intel.hasStrugglingAlly} ` +
            `aggressive=${this.shouldSpawnAggressiveForward()}`
        );

        return true;
    }

    private chooseEntryForTarget(
        targetWave: BattleWave,
        exactOnly: boolean
    ): UnitPrefabEntry | null {
        if (this.affordableEntries.length <= 0) {
            return null;
        }

        this.bestEntryBuffer.length = 0;
        let bestScore = -Infinity;

        for (let i = 0; i < this.affordableEntries.length; i++) {
            const entry = this.affordableEntries[i];
            const score =
                this.getCounterScore(entry, targetWave);

            if (
                exactOnly &&
                !this.isRealCounterScore(score)
            ) {
                continue;
            }

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

        const accurate =
            Math.random() <= this.getDecisionAccuracy();

        if (!accurate && !exactOnly) {
            return this.getRandomAffordableEntry();
        }

        const index = Math.floor(
            Math.random() * this.bestEntryBuffer.length
        );

        return this.bestEntryBuffer[index];
    }

    private chooseCounterLane(
        intel: SmartWaveIntel
    ) {
        if (!this.gameManager) return intel.laneId;

        const accurate =
            Math.random() <= this.getDecisionAccuracy();

        if (accurate) {
            return intel.laneId;
        }

        const supportLane =
            this.chooseBestSupportLane(intel.laneId);

        if (supportLane >= 0) {
            return supportLane;
        }

        return intel.laneId;
    }

    private chooseBestSupportLane(
        targetLane: number
    ) {
        if (!this.gameManager) return -1;

        const laneCount =
            this.gameManager.getSafeLaneCount();

        let bestLane = -1;
        let bestScore = -Infinity;

        for (let laneId = 0; laneId < laneCount; laneId++) {
            if (laneId === targetLane) continue;

            const lane =
                this.laneIntel[laneId];

            if (!lane) continue;

            let score =
                Math.random() * 0.001;

            if (lane.enemyCount <= 0) {
                score += 20;
            }

            score -= lane.allyCount * 12;
            score -= lane.enemyCount * 8;
            score -= lane.trafficCount * 6;

            if (score > bestScore) {
                bestScore = score;
                bestLane = laneId;
            }
        }

        return bestLane;
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

        const spawned =
            this.gameManager.spawnWaveByEntry(
                this.team,
                entry,
                -1,
                this.shouldSpawnAggressiveForward()
            );

        if (!spawned) return false;

        this.stateLog(
            `OPENING spawn=${entry.name} aggressive=${this.shouldSpawnAggressiveForward()}`
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

    private hasStrugglingAllyNearTarget(
        targetIntel: SmartWaveIntel
    ) {
        if (!this.gameManager) return false;

        const waves = this.gameManager.waves;
        const threshold =
            this.clamp01(this.rescueAllyAliveRatio);

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidWave(wave)) continue;
            if (wave!.team !== this.team) continue;
            if (wave!.laneId < 0) continue;
            if (
                this.gameManager.clampLaneId(wave!.laneId) !==
                targetIntel.laneId
            ) {
                continue;
            }

            if (!wave!.hasEngaged()) continue;
            if (wave!.getAliveRatio() > threshold) continue;

            return true;
        }

        return false;
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

    private collectAffordableEntries(
        entries: UnitPrefabEntry[]
    ) {
        this.affordableEntries.length = 0;

        if (!this.gameManager) return;

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!this.isValidEntry(entry)) continue;

            if (
                !this.gameManager.canAffordEntry(
                    this.team,
                    entry
                )
            ) {
                continue;
            }

            this.affordableEntries.push(entry);
        }
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

        let count = 0;
        const waves = this.gameManager.waves;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidWave(wave)) continue;
            if (wave!.team !== team) continue;

            count++;
        }

        return count;
    }

    private isValidWave(wave: BattleWave | null) {
        if (!wave) return false;
        if (wave.released) return false;
        if (wave.isDead()) return false;

        return true;
    }

    private isValidEntry(entry: UnitPrefabEntry | null) {
        if (!entry) return false;
        if (!entry.name) return false;
        if (!entry.prefab) return false;
        if (Math.floor(entry.unitCount) <= 0) return false;

        return true;
    }

    private getDecisionAccuracy() {
        return this.clamp01(this.decisionAccuracy);
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
