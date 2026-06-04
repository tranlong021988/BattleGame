import { _decorator, Component } from 'cc';
import { GameManager, UnitPrefabEntry } from './GameManager';
import { BattleWave } from './BattleWave';
import { CounterSettings } from './CounterSettings';
import { UnitType } from './BattleTypes';

const { ccclass, property } = _decorator;

enum ArmyBrainMode {
    Attack = 0,
    Defense = 1,
}

@ccclass('ArmyBrain')
export class ArmyBrain extends Component {

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

    @property
    defenseWaveThreshold = 2;

    @property
    attackModeChance = 1.0;

    @property
    defenseModeChance = 1.0;

    @property
    preferUnengagedWaveInAttack = true;

    @property
    ignoreNearlyDeadWaveRatio = 0.2;

    @property
    attackCounterCoverageRatio = 1.0;

    @property
    sensitive = 1.0;

    @property
    minSensitive = 0.0;

    @property
    maxSensitive = 1.0;

    @property
    spawnRandomIfNoThreat = true;

    @property
    spawnOpeningWaveIfNoEnemyWave = true;

    @property
    enableStateLog = true;

    @property
    enableDebugLog = false;

    private timer = 0;
    private nextInterval = 3;

    private currentMode: ArmyBrainMode = ArmyBrainMode.Attack;
    private currentModeName = 'ATTACK';

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

        if (!this.canSpawnMoreWave()) {
            this.debugLog(
                `Skip spawn: aliveWaves=${this.getAliveWaveCount(this.team)} >= maxAliveWaves=${this.maxAliveWaves}`
            );
            return;
        }

        const entries = this.gameManager.getTeamEntries(this.team);
        const validEntries = this.getValidEntries(entries);

        if (validEntries.length <= 0) {
            this.debugLog('Abort: no valid entries.');
            return;
        }

        const enemyTeam = this.team === 0 ? 1 : 0;
        const enemyWaves = this.gameManager.getWavesByTeam(enemyTeam);

        this.resolveMode();

        this.stateLog(
            `MODE=${this.currentModeName}, myWaves=${this.getAliveWaveCount(this.team)}, enemyWaves=${this.getAliveWaveCount(enemyTeam)}, maxWaves=${this.maxAliveWaves}`
        );

        if (enemyWaves.length <= 0) {
            if (this.spawnOpeningWaveIfNoEnemyWave) {
                this.spawnOpeningWave(validEntries);
                return;
            }

            if (this.spawnRandomIfNoThreat) {
                this.spawnRandom(validEntries, 'No enemy wave');
            }

            return;
        }

        const targetWave = this.findTargetWave();

        if (!targetWave) {
            if (this.spawnRandomIfNoThreat) {
                this.spawnRandom(validEntries, 'No valid target');
            }

            return;
        }

        const selectedEntry = this.chooseEntryAgainstWave(
            validEntries,
            targetWave
        );

        if (!selectedEntry) return;

        const spawned = this.gameManager.spawnWaveByEntry(
            this.team,
            selectedEntry
        );

        if (spawned) {
            targetWave.addCounterAssignment(selectedEntry.unitCount);

            this.debugLog(
                `Spawn ${selectedEntry.name} counter target wave=${targetWave.id}`
            );
        }
    }

    private resolveMode() {
        const myWaves = this.getAliveWaveCount(this.team);

        const shouldDefense =
            myWaves <= Math.max(
                0,
                Math.floor(this.defenseWaveThreshold)
            );

        if (shouldDefense) {
            const roll = Math.random();
            const correct = roll <= this.defenseModeChance;

            this.currentMode = correct
                ? ArmyBrainMode.Defense
                : ArmyBrainMode.Attack;

            this.currentModeName = correct
                ? 'DEFENSE'
                : 'DEFENSE_MISREAD_TO_ATTACK';

            return;
        }

        const roll = Math.random();
        const correct = roll <= this.attackModeChance;

        this.currentMode = correct
            ? ArmyBrainMode.Attack
            : ArmyBrainMode.Defense;

        this.currentModeName = correct
            ? 'ATTACK'
            : 'ATTACK_MISREAD_TO_DEFENSE';
    }

    private findTargetWave(): BattleWave | null {
        if (this.currentMode === ArmyBrainMode.Defense) {
            return this.findNearestThreatWaveForDefense();
        }

        return this.findInterceptThreatWaveForAttack();
    }

    private findInterceptThreatWaveForAttack(): BattleWave | null {
        if (!this.gameManager) return null;

        const enemyTeam = this.team === 0 ? 1 : 0;
        const waves = this.gameManager.getWavesByTeam(enemyTeam);

        let best: BattleWave | null = null;
        let bestScore = -Infinity;

        const defendPoint = this.getDefendPoint();

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidAttackThreatWave(wave)) continue;

            const aliveRatio = wave.getAliveRatio();
            const engaged = wave.hasEngaged();

            const distSq = wave.getClosestDistanceSqTo(
                defendPoint.x,
                defendPoint.z
            );

            const dist = Math.sqrt(distSq);
            const distanceScore = Math.max(0, 100 - dist);

            const uncovered = Math.max(
                0,
                this.attackCounterCoverageRatio -
                wave.getCounterCoverageRatio()
            );

            let score = 0;

            score += aliveRatio * 100;
            score += distanceScore;
            score += uncovered * 40;

            if (
                this.preferUnengagedWaveInAttack &&
                !engaged
            ) {
                score += 50;
            }

            if (score > bestScore) {
                bestScore = score;
                best = wave;
            }
        }

        return best;
    }

    private findNearestThreatWaveForDefense(): BattleWave | null {
        if (!this.gameManager) return null;

        const enemyTeam = this.team === 0 ? 1 : 0;
        const waves = this.gameManager.getWavesByTeam(enemyTeam);

        let best: BattleWave | null = null;
        let bestDistanceSq = Infinity;
        let bestAliveRatio = -Infinity;

        const defendPoint = this.getDefendPoint();

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidDefenseThreatWave(wave)) continue;

            const distSq = wave.getClosestDistanceSqTo(
                defendPoint.x,
                defendPoint.z
            );

            const aliveRatio = wave.getAliveRatio();

            const closer =
                distSq < bestDistanceSq;

            const sameDistanceButStronger =
                Math.abs(distSq - bestDistanceSq) < 0.0001 &&
                aliveRatio > bestAliveRatio;

            if (closer || sameDistanceButStronger) {
                bestDistanceSq = distSq;
                bestAliveRatio = aliveRatio;
                best = wave;
            }
        }

        return best;
    }

    private isValidAttackThreatWave(wave: BattleWave | null) {
        if (!this.isAliveThreatWave(wave)) return false;

        if (wave!.isCounterCovered(this.attackCounterCoverageRatio)) {
            return false;
        }

        return true;
    }

    private isValidDefenseThreatWave(wave: BattleWave | null) {
        if (!this.isAliveThreatWave(wave)) return false;

        //
        // Defense Mode:
        // Bỏ qua attackCounterCoverageRatio.
        // Nếu mối nguy gần nhà nhất vẫn còn sống, cứ cho phép reinforce.
        //
        return true;
    }

    private isAliveThreatWave(wave: BattleWave | null) {
        if (!wave) return false;
        if (wave.isDead()) return false;

        const aliveRatio = wave.getAliveRatio();

        if (aliveRatio < this.ignoreNearlyDeadWaveRatio) {
            return false;
        }

        return true;
    }

    private canSpawnMoreWave() {
        if (!this.enableMaxAliveWaveLimit) {
            return true;
        }

        const max = Math.max(
            1,
            Math.floor(this.maxAliveWaves)
        );

        const alive = this.getAliveWaveCount(this.team);

        return alive < max;
    }

    private getAliveWaveCount(team: number) {
        if (!this.gameManager) return 0;

        const waves = this.gameManager.getWavesByTeam(team);

        let count = 0;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!wave) continue;
            if (wave.isDead()) continue;

            count++;
        }

        return count;
    }

    private spawnOpeningWave(validEntries: UnitPrefabEntry[]) {
        if (!this.gameManager) return;
        if (!this.canSpawnMoreWave()) return;

        const opening = this.getRandomEntry(validEntries);

        if (!opening) return;

        this.gameManager.spawnWaveByEntry(
            this.team,
            opening
        );
    }

    private spawnRandom(
        validEntries: UnitPrefabEntry[],
        reason: string
    ) {
        if (!this.gameManager) return;
        if (!this.canSpawnMoreWave()) return;

        const randomEntry = this.getRandomEntry(validEntries);

        if (!randomEntry) return;

        this.debugLog(
            `${reason}. Random spawn: ${randomEntry.name}`
        );

        this.gameManager.spawnWaveByEntry(
            this.team,
            randomEntry
        );
    }

    private chooseEntryAgainstWave(
        entries: UnitPrefabEntry[],
        targetWave: BattleWave
    ): UnitPrefabEntry | null {

        const accuracy = this.getAccuracy();

        if (Math.random() > accuracy) {
            return this.getRandomEntry(entries);
        }

        let bestScore = -Infinity;
        const bestEntries: UnitPrefabEntry[] = [];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!this.isValidEntry(entry)) continue;

            const score = this.getCounterScore(
                entry.unitType,
                targetWave.unitType
            );

            if (score > bestScore) {
                bestScore = score;
                bestEntries.length = 0;
                bestEntries.push(entry);
            } else if (Math.abs(score - bestScore) < 0.0001) {
                bestEntries.push(entry);
            }
        }

        if (bestEntries.length <= 0) {
            return this.getRandomEntry(entries);
        }

        const index = Math.floor(
            Math.random() * bestEntries.length
        );

        return bestEntries[index];
    }

    private getCounterScore(
        attackerType: UnitType,
        defenderType: UnitType
    ) {
        const counter = CounterSettings.instance;

        if (!counter) {
            return 1;
        }

        return counter.getCounterScore(
            attackerType,
            defenderType
        );
    }

    private getDefendPoint() {
        if (!this.gameManager) {
            return { x: 0, z: 0 };
        }

        const hero =
            this.team === 0
                ? this.gameManager.teamAHero
                : this.gameManager.teamBHero;

        if (hero && hero.agent) {
            return {
                x: hero.agent.pos.x,
                z: hero.agent.pos.z
            };
        }

        return {
            x: 0,
            z: this.team === 0
                ? this.gameManager.teamASpawnZ
                : this.gameManager.teamBSpawnZ
        };
    }

    private getAccuracy() {
        const min = Math.min(
            this.minSensitive,
            this.maxSensitive
        );

        const max = Math.max(
            this.minSensitive,
            this.maxSensitive
        );

        return this.clamp(
            this.sensitive,
            min,
            max
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

    private getValidEntries(entries: UnitPrefabEntry[]) {
        const valid: UnitPrefabEntry[] = [];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!this.isValidEntry(entry)) continue;

            valid.push(entry);
        }

        return valid;
    }

    private getRandomEntry(entries: UnitPrefabEntry[]) {
        const valid = this.getValidEntries(entries);

        if (valid.length <= 0) {
            return null;
        }

        const index = Math.floor(
            Math.random() * valid.length
        );

        return valid[index];
    }

    private isValidEntry(entry: UnitPrefabEntry | null) {
        if (!entry) return false;
        if (!entry.name) return false;
        if (!entry.prefab) return false;
        if (Math.floor(entry.unitCount) <= 0) return false;

        return true;
    }

    private clamp(
        v: number,
        min: number,
        max: number
    ) {
        return Math.max(
            min,
            Math.min(max, v)
        );
    }

    private stateLog(message: string) {
        if (!this.enableStateLog) return;

        console.log(
            `[ArmyBrain State T${this.team}] ${message}`
        );
    }

    private debugLog(message: string) {
        if (!this.enableDebugLog) return;

        console.log(
            `[ArmyBrain Debug T${this.team}] ${message}`
        );
    }
}