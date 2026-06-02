import { _decorator, Component } from 'cc';
import { GameManager, UnitPrefabEntry } from './GameManager';
import { BattleWave } from './BattleWave';
import { CounterSettings } from './CounterSettings';
import { UnitType, unitTypeToName } from './BattleTypes';

const { ccclass, property } = _decorator;

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
    sensitive = 1.0;

    @property
    minSensitive = 0.0;

    @property
    maxSensitive = 1.0;

    @property
    minThreatAliveRatio = 0.35;

    @property
    preferUnengagedWave = true;

    @property
    useAdaptiveStrategy = true;

    @property
    unitAdvantageThreshold = 8;

    @property
    attackIntelligence = 1.0;

    @property
    defenseIntelligence = 0.85;

    @property
    neutralAttackChance = 0.5;

    @property
    counterCoverageRatio = 1.0;

    @property
    maxCounterAssignmentsPerWave = 3;

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

    private currentPreferUnengaged = true;
    private currentStrategyState = 'UNKNOWN';

    start() {
        this.randomizeNextInterval();

        this.debugLog(
            `Start. team=${this.team}, nextInterval=${this.nextInterval.toFixed(2)}`
        );
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

        const entries = this.gameManager.getTeamEntries(this.team);
        const validEntries = this.getValidEntries(entries);

        if (validEntries.length <= 0) {
            this.debugLog('Abort: no valid entries.');
            return;
        }

        const enemyTeam = this.team === 0 ? 1 : 0;
        const enemyWaves = this.gameManager.getWavesByTeam(enemyTeam);

        this.currentPreferUnengaged = this.resolvePreferUnengagedWave();

        this.stateLog(
            `STATE=${this.currentStrategyState}, preferUnengaged=${this.currentPreferUnengaged}`
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

        const targetWave = this.findBestThreatWave();

        if (!targetWave) {
            this.debugLog('No valid threat wave found.');

            if (this.spawnRandomIfNoThreat) {
                this.spawnRandom(validEntries, 'No valid threat');
            }

            return;
        }

        this.debugLog(
            `Target wave id=${targetWave.id}, type=${unitTypeToName(targetWave.unitType)}, alive=${targetWave.getAliveCount()}/${targetWave.totalCount}, assigned=${targetWave.assignedCounterCount}, coverage=${targetWave.getCounterCoverageRatio().toFixed(2)}`
        );

        const selectedEntry = this.chooseEntryAgainstWave(
            validEntries,
            targetWave
        );

        if (!selectedEntry) {
            this.debugLog('Abort: no selected entry.');
            return;
        }

        this.debugLog(
            `Spawn selected: ${selectedEntry.name} / ${unitTypeToName(selectedEntry.unitType)}`
        );

        const spawned = this.gameManager.spawnWaveByEntry(
            this.team,
            selectedEntry
        );

        if (spawned) {
            targetWave.addCounterAssignment(selectedEntry.unitCount);

            this.debugLog(
                `Counter assignment wave ${targetWave.id}: +${selectedEntry.unitCount}, totalAssigned=${targetWave.assignedCounterCount}, coverage=${targetWave.getCounterCoverageRatio().toFixed(2)}`
            );
        }
    }

    private resolvePreferUnengagedWave() {
        if (!this.useAdaptiveStrategy) {
            this.currentStrategyState = this.preferUnengagedWave
                ? 'MANUAL_ATTACK'
                : 'MANUAL_DEFENSE';

            return this.preferUnengagedWave;
        }

        if (!this.gameManager) {
            this.currentStrategyState = 'NO_GAME_MANAGER';
            return this.preferUnengagedWave;
        }

        const enemyTeam = this.team === 0 ? 1 : 0;

        const myAlive = this.getAliveUnitCount(this.team);
        const enemyAlive = this.getAliveUnitCount(enemyTeam);

        const unitDiff = myAlive - enemyAlive;
        const threshold = Math.max(1, Math.floor(this.unitAdvantageThreshold));

        if (unitDiff >= threshold) {
            const roll = Math.random();
            const correct = roll <= this.attackIntelligence;

            this.currentStrategyState = correct
                ? 'ATTACK'
                : 'ATTACK_MISREAD_TO_DEFENSE';

            this.stateLog(
                `myAlive=${myAlive}, enemyAlive=${enemyAlive}, diff=${unitDiff}, threshold=${threshold}, desired=ATTACK, roll=${roll.toFixed(2)}, intelligence=${this.attackIntelligence}, final=${this.currentStrategyState}`
            );

            return correct ? true : false;
        }

        if (unitDiff <= -threshold) {
            const roll = Math.random();
            const correct = roll <= this.defenseIntelligence;

            this.currentStrategyState = correct
                ? 'DEFENSE'
                : 'DEFENSE_MISREAD_TO_ATTACK';

            this.stateLog(
                `myAlive=${myAlive}, enemyAlive=${enemyAlive}, diff=${unitDiff}, threshold=${threshold}, desired=DEFENSE, roll=${roll.toFixed(2)}, intelligence=${this.defenseIntelligence}, final=${this.currentStrategyState}`
            );

            return correct ? false : true;
        }

        const neutralRoll = Math.random();
        const attack = neutralRoll <= this.neutralAttackChance;

        this.currentStrategyState = attack
            ? 'NEUTRAL_ATTACK'
            : 'NEUTRAL_DEFENSE';

        this.stateLog(
            `myAlive=${myAlive}, enemyAlive=${enemyAlive}, diff=${unitDiff}, threshold=${threshold}, desired=NEUTRAL, attackChance=${this.neutralAttackChance}, roll=${neutralRoll.toFixed(2)}, final=${this.currentStrategyState}`
        );

        return attack;
    }

    private getAliveUnitCount(team: number) {
        if (!this.gameManager) return 0;

        const units = this.gameManager.getAliveUnits(team);

        let count = 0;

        for (let i = 0; i < units.length; i++) {
            const u = units[i];

            if (!u) continue;
            if (!u.node.activeInHierarchy) continue;
            if (!u.props) continue;
            if (u.props.isDead()) continue;

            count++;
        }

        return count;
    }

    private spawnOpeningWave(validEntries: UnitPrefabEntry[]) {
        if (!this.gameManager) return;

        const opening = this.getRandomEntry(validEntries);

        if (!opening) return;

        this.debugLog(
            `Opening spawn: ${opening.name} / ${unitTypeToName(opening.unitType)}`
        );

        this.gameManager.spawnWaveByEntry(
            this.team,
            opening
        );
    }

    private spawnRandom(validEntries: UnitPrefabEntry[], reason: string) {
        if (!this.gameManager) return;

        const randomEntry = this.getRandomEntry(validEntries);

        if (!randomEntry) return;

        this.debugLog(
            `${reason}. Random spawn: ${randomEntry.name} / ${unitTypeToName(randomEntry.unitType)}`
        );

        this.gameManager.spawnWaveByEntry(
            this.team,
            randomEntry
        );
    }

    private findBestThreatWave(): BattleWave | null {
        if (!this.gameManager) return null;

        const enemyTeam = this.team === 0 ? 1 : 0;
        const waves = this.gameManager.getWavesByTeam(enemyTeam);

        let best: BattleWave | null = null;
        let bestScore = -Infinity;

        const defendPoint = this.getDefendPoint();

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!wave) continue;
            if (wave.isDead()) continue;

            const aliveCount = wave.getAliveCount();
            const aliveRatio = wave.getAliveRatio();
            const engaged = wave.hasEngaged();

            if (aliveRatio < this.minThreatAliveRatio) {
                this.debugLog(
                    `Skip wave ${wave.id}: aliveRatio ${aliveRatio.toFixed(2)} < ${this.minThreatAliveRatio}`
                );
                continue;
            }

            const hardAssignmentCap =
                this.maxCounterAssignmentsPerWave *
                Math.max(1, wave.totalCount);

            if (wave.assignedCounterCount >= hardAssignmentCap) {
                this.debugLog(
                    `Skip wave ${wave.id}: assignment cap ${wave.assignedCounterCount}/${hardAssignmentCap}`
                );
                continue;
            }

            if (wave.isCounterCovered(this.counterCoverageRatio)) {
                this.debugLog(
                    `Skip wave ${wave.id}: coverage ${wave.getCounterCoverageRatio().toFixed(2)} >= ${this.counterCoverageRatio}`
                );
                continue;
            }

            let score = 0;

            score += aliveRatio * 100;

            if (this.currentPreferUnengaged && !engaged) {
                score += 50;
            }

            if (!this.currentPreferUnengaged && engaged) {
                score += 25;
            }

            const distSq = wave.getClosestDistanceSqTo(
                defendPoint.x,
                defendPoint.z
            );

            const dist = Math.sqrt(distSq);

            score += Math.max(0, 100 - dist);

            const uncovered = Math.max(
                0,
                this.counterCoverageRatio - wave.getCounterCoverageRatio()
            );

            score += uncovered * 40;

            const avgZ = wave.getAverageZ();

            if (this.team === 0) {
                score += Math.max(
                    0,
                    20 - (avgZ - this.gameManager.teamASpawnZ)
                );
            } else {
                score += Math.max(
                    0,
                    20 - (this.gameManager.teamBSpawnZ - avgZ)
                );
            }

            this.debugLog(
                `Wave candidate id=${wave.id}, type=${unitTypeToName(wave.unitType)}, alive=${aliveCount}/${wave.totalCount}, ratio=${aliveRatio.toFixed(2)}, engaged=${engaged}, assigned=${wave.assignedCounterCount}, coverage=${wave.getCounterCoverageRatio().toFixed(2)}, score=${score.toFixed(2)}`
            );

            if (score > bestScore) {
                bestScore = score;
                best = wave;
            }
        }

        return best;
    }

    private chooseEntryAgainstWave(
        entries: UnitPrefabEntry[],
        targetWave: BattleWave
    ): UnitPrefabEntry | null {

        const accuracy = this.getAccuracy();

        if (Math.random() > accuracy) {
            const random = this.getRandomEntry(entries);

            this.debugLog(
                `Sensitive miss. Random choice: ${random ? random.name : 'null'}`
            );

            return random;
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

            this.debugLog(
                `Candidate ${entry.name} / ${unitTypeToName(entry.unitType)} vs ${unitTypeToName(targetWave.unitType)} score=${score.toFixed(2)}`
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

    private clamp(v: number, min: number, max: number) {
        return Math.max(min, Math.min(max, v));
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