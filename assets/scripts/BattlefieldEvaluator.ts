import { GameManager, UnitPrefabEntry } from './GameManager';
import { BattleWave } from './BattleWave';
import { UnitFamily } from './BattleTypes';
import { CounterSettings } from './CounterSettings';

export class BattlefieldLaneIntel {
    laneId = 0;
    allyWaveCount = 0;
    enemyWaveCount = 0;
    trafficCount = 0;

    reset(laneId: number) {
        this.laneId = laneId;
        this.allyWaveCount = 0;
        this.enemyWaveCount = 0;
        this.trafficCount = 0;
    }
}

export class BattlefieldWaveIntel {
    wave: BattleWave | null = null;
    entry: UnitPrefabEntry | null = null;
    laneId = -1;
    visualLaneId = -1;
    centerX = 0;
    centerZ = 0;
    aliveCount = 0;
    aliveRatio = 0;
    healthRatio = 0;
    basePower = 0;
    threatPower = 0;
    threatScore = 0;
    coveragePower = 0;
    coverageRatio = 0;
    progressToDefend = 0;
    distanceToDefend = 0;
    dangerousToDefend = false;
    allyAheadCount = 0;
    allyFrontlineCount = 0;
    frontlineBlockPower = 0;
    frontlineHealthRatio = 0;
    allyBlockersFromSpawn = 0;
    enemyMeleeBlockersFromSpawn = 0;
    hasEnemySpearBlockerFromSpawn = false;
    hasStrugglingAlly = false;
    clusterScore = 1;

    reset() {
        this.wave = null;
        this.entry = null;
        this.laneId = -1;
        this.visualLaneId = -1;
        this.centerX = 0;
        this.centerZ = 0;
        this.aliveCount = 0;
        this.aliveRatio = 0;
        this.healthRatio = 0;
        this.basePower = 0;
        this.threatPower = 0;
        this.threatScore = 0;
        this.coveragePower = 0;
        this.coverageRatio = 0;
        this.progressToDefend = 0;
        this.distanceToDefend = 0;
        this.dangerousToDefend = false;
        this.allyAheadCount = 0;
        this.allyFrontlineCount = 0;
        this.frontlineBlockPower = 0;
        this.frontlineHealthRatio = 0;
        this.allyBlockersFromSpawn = 0;
        this.enemyMeleeBlockersFromSpawn = 0;
        this.hasEnemySpearBlockerFromSpawn = false;
        this.hasStrugglingAlly = false;
        this.clusterScore = 1;
    }
}

export class BattleEntryChoice {
    entry: UnitPrefabEntry | null = null;
    score = -Infinity;
    coveragePower = 0;
    projectedCoverageRatio = 0;

    reset() {
        this.entry = null;
        this.score = -Infinity;
        this.coveragePower = 0;
        this.projectedCoverageRatio = 0;
    }
}

export class BattlefieldEvaluator {
    coverageTargetRatio = 1.05;
    rescueAllyAliveRatio = 0.35;
    laneAllyAheadLimit = 2;
    dangerousThreatProgress = 0.75;

    lanes: BattlefieldLaneIntel[] = [];
    enemies: BattlefieldWaveIntel[] = [];
    allies: BattlefieldWaveIntel[] = [];
    enemyCount = 0;
    allyCount = 0;

    private choice = new BattleEntryChoice();
    rebuild(
        gameManager: GameManager,
        team: number
    ) {
        const laneCount =
            gameManager.getSafeLaneCount();

        this.ensureLaneCount(laneCount);

        for (let i = 0; i < laneCount; i++) {
            this.lanes[i].reset(i);
        }

        this.enemyCount = 0;
        this.allyCount = 0;

        const waves = gameManager.waves;
        const enemyTeam = team === 0 ? 1 : 0;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!this.isValidWave(wave)) continue;

            const entry =
                this.findEntryForWave(
                    gameManager,
                    wave!
                );

            if (!entry) continue;

            const intel =
                wave!.team === team
                    ? this.getAllyBuffer()
                    : wave!.team === enemyTeam
                        ? this.getEnemyBuffer()
                        : null;

            if (!intel) continue;

            this.fillWaveIntel(
                gameManager,
                intel,
                wave!,
                entry,
                team
            );

            const lane =
                this.lanes[intel.visualLaneId];

            if (lane) {
                lane.trafficCount++;

                if (wave!.team === team) {
                    lane.allyWaveCount++;
                } else {
                    lane.enemyWaveCount++;
                }
            }
        }

        for (let i = 0; i < this.enemyCount; i++) {
            this.fillEnemyTacticalState(
                gameManager,
                team,
                this.enemies[i]
            );
        }
    }

    findBestTarget(
        gameManager: GameManager,
        team: number,
        affordableEntries: UnitPrefabEntry[]
    ) {
        let best: BattlefieldWaveIntel | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];

            if (!enemy.wave || !enemy.entry) continue;
            if (enemy.aliveCount <= 0) continue;
            if (enemy.healthRatio <= 0.08) continue;

            const choice =
                this.chooseEntryForTarget(
                    gameManager,
                    team,
                    enemy,
                    affordableEntries
                );

            if (!choice.entry) continue;

            const uncovered =
                Math.max(
                    0,
                    this.coverageTargetRatio -
                        enemy.coverageRatio
                );
            const rescueScore =
                enemy.hasStrugglingAlly ? 180 : 0;
            const dangerousScore =
                enemy.dangerousToDefend
                    ? 500 + enemy.progressToDefend * 300
                    : enemy.progressToDefend * 90;
            const score =
                enemy.threatScore +
                uncovered * enemy.threatPower +
                rescueScore +
                dangerousScore;

            if (score > bestScore) {
                bestScore = score;
                best = enemy;
            }
        }

        return best;
    }

    chooseEntryForTarget(
        gameManager: GameManager,
        team: number,
        target: BattlefieldWaveIntel,
        affordableEntries: UnitPrefabEntry[]
    ) {
        this.choice.reset();

        if (!target.entry) return this.choice;

        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];
            const roleRank =
                this.getDirectResponseRoleRank(
                    entry,
                    target
                );

            if (roleRank >= 99) continue;

            if (
                !this.isEntryViableForTarget(
                    entry,
                    target
                )
            ) {
                continue;
            }

            const coveragePower =
                this.getEntryCoveragePower(
                    gameManager,
                    team,
                    entry,
                    target
                );

            if (coveragePower <= 0) continue;

            if (
                !this.wouldImproveCoverage(
                    target,
                    coveragePower
                )
            ) {
                continue;
            }

            const cost =
                Math.max(1, entry.combatPointCost);
            const neededPower =
                Math.max(
                    0,
                    target.threatPower *
                        this.coverageTargetRatio -
                        target.coveragePower
                );
            const neededSafe =
                Math.max(1, neededPower);
            const needRatio =
                coveragePower / neededSafe;
            const efficiency =
                coveragePower / cost;
            const projectedCoverageRatio =
                (
                    target.coveragePower +
                    coveragePower
                ) /
                Math.max(1, target.threatPower);
            const overshootPenalty =
                Math.max(
                    0,
                    projectedCoverageRatio -
                        this.coverageTargetRatio
                ) * 180;
            const nearEnoughScore =
                needRatio >= 0.9
                    ? 500
                    : needRatio * 350;
            const underPowerPenalty =
                Math.max(
                    0,
                    0.9 - needRatio
                ) * 300;
            const roleBias =
                this.getDirectResponseRoleBias(
                    roleRank,
                    target
                );
            const secondaryUtility =
                this.getSecondaryDirectResponseUtility(
                    gameManager,
                    team,
                    entry,
                    target,
                    coveragePower,
                    neededPower
                );
            const score =
                nearEnoughScore +
                efficiency * 8 -
                cost * 12 -
                overshootPenalty -
                underPowerPenalty +
                roleBias +
                secondaryUtility;

            if (score > this.choice.score) {
                this.choice.entry = entry;
                this.choice.score = score;
                this.choice.coveragePower =
                    coveragePower;
                this.choice.projectedCoverageRatio =
                    projectedCoverageRatio;
            }
        }

        return this.choice;
    }

    chooseSpawnLaneForTarget(
        gameManager: GameManager,
        team: number,
        target: BattlefieldWaveIntel,
        entry: UnitPrefabEntry
    ) {
        if (!target.wave) return -1;

        const directLane =
            target.laneId >= 0
                ? target.laneId
                : target.visualLaneId;
        const lane =
            this.lanes[directLane];
        const directBlocked =
            this.isDirectLaneSpawnBlocked(
                lane,
                target
            );

        if (
            !directBlocked ||
            target.hasStrugglingAlly ||
            target.dangerousToDefend
        ) {
            return directLane;
        }

        const flankLane =
            this.findBestFlankLane(
                gameManager,
                directLane
            );

        if (flankLane >= 0) {
            return flankLane;
        }

        if (this.isRangedFamily(entry.family)) {
            return -1;
        }

        return -1;
    }

    shouldSpawnAggressive(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel,
        spawnLaneId: number
    ) {
        if (!target.entry) return true;

        if (this.isRangedFamily(entry.family)) {
            return target.frontlineBlockPower > 0 &&
                target.progressToDefend < 0.55;
        }

        if (
            entry.family === UnitFamily.Cavalry &&
            this.isRangedFamily(target.entry.family) &&
            target.enemyMeleeBlockersFromSpawn <= 1 &&
            !target.hasEnemySpearBlockerFromSpawn
        ) {
            return true;
        }

        return false;
    }

    choosePressureLane(
        gameManager: GameManager
    ) {
        let bestLane = -1;
        let bestScore = -Infinity;
        const laneCount =
            gameManager.getSafeLaneCount();

        for (let i = 0; i < laneCount; i++) {
            const lane = this.lanes[i];

            if (!lane) continue;

            const score =
                (lane.enemyWaveCount <= 0 ? 80 : 0) -
                lane.trafficCount * 20 -
                lane.allyWaveCount * 15 +
                Math.random() * 0.001;

            if (score > bestScore) {
                bestScore = score;
                bestLane = i;
            }
        }

        return bestLane;
    }

    choosePressureEntry(
        affordableEntries: UnitPrefabEntry[]
    ) {
        let best: UnitPrefabEntry | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (this.isRangedFamily(entry.family)) {
                continue;
            }

            const power =
                this.getEntryBasePower(
                    entry,
                    Math.max(1, entry.unitCount),
                    1,
                    1
                );
            const cost =
                Math.max(1, entry.combatPointCost);
            const score =
                power / cost +
                entry.maxSpeed * 1.25 +
                this.getPressureRoleScore(entry) +
                Math.random() * 4;

            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        }

        return best;
    }

    findBestRangedSupportTarget(
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerLane: number
    ) {
        if (
            !this.hasAffordableRangedEntry(
                affordableEntries
            )
        ) {
            return null;
        }

        let best: BattlefieldWaveIntel | null = null;
        let bestScore = -Infinity;
        const supportLimit =
            Math.max(
                0,
                Math.floor(maxRangedSupportPerLane)
            );

        for (let i = 0; i < this.enemyCount; i++) {
            const target = this.enemies[i];

            if (!target.wave || !target.entry) continue;
            if (target.aliveCount <= 0) continue;
            if (target.healthRatio <= 0.1) continue;
            if (!this.isRangedSpawnSafe(target)) continue;

            const currentSupport =
                this.countRangedSupportForTarget(
                    target
                );

            if (currentSupport >= supportLimit) {
                continue;
            }

            const coveragePressure =
                Math.max(
                    0,
                    1.45 - target.coverageRatio
                );
            const score =
                target.threatPower *
                (
                    0.4 +
                    Math.min(0.8, target.clusterScore * 0.2)
                ) +
                coveragePressure * 180 -
                currentSupport * 120 +
                target.progressToDefend * 60;

            if (score > bestScore) {
                bestScore = score;
                best = target;
            }
        }

        return best;
    }

    findBestAntiSpearArcherTarget(
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerLane: number
    ) {
        if (!this.hasAffordableArcherEntry(affordableEntries)) {
            return null;
        }

        let best: BattlefieldWaveIntel | null = null;
        let bestScore = -Infinity;
        const supportLimit =
            Math.max(
                0,
                Math.floor(maxRangedSupportPerLane)
            );

        for (let i = 0; i < this.enemyCount; i++) {
            const target = this.enemies[i];

            if (!target.wave || !target.entry) continue;
            if (target.entry.family !== UnitFamily.Spear) continue;
            if (target.aliveCount <= 0) continue;
            if (target.healthRatio <= 0.1) continue;
            if (!this.isRangedSpawnSafe(target)) continue;

            const currentSupport =
                this.countRangedSupportForTarget(
                    target
                );

            if (currentSupport >= supportLimit) {
                continue;
            }

            if (
                target.coverageRatio >=
                    this.coverageTargetRatio &&
                !target.hasStrugglingAlly &&
                !target.dangerousToDefend
            ) {
                continue;
            }

            const coveragePressure =
                Math.max(
                    0,
                    this.coverageTargetRatio -
                        target.coverageRatio
                );
            const score =
                target.threatPower +
                coveragePressure * target.threatPower * 0.65 +
                target.progressToDefend * 120 +
                (target.hasStrugglingAlly ? 180 : 0) +
                (target.dangerousToDefend ? 260 : 0) -
                currentSupport * 180;

            if (score > bestScore) {
                bestScore = score;
                best = target;
            }
        }

        return best;
    }

    findBestClusterMonkTarget(
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerLane: number
    ) {
        if (!this.hasAffordableMonkEntry(affordableEntries)) {
            return null;
        }

        let best: BattlefieldWaveIntel | null = null;
        let bestScore = -Infinity;
        const supportLimit =
            Math.max(
                0,
                Math.floor(maxRangedSupportPerLane)
            );

        for (let i = 0; i < this.enemyCount; i++) {
            const target = this.enemies[i];

            if (!target.wave || !target.entry) continue;
            if (target.aliveCount < 6) continue;
            if (target.healthRatio <= 0.12) continue;
            if (target.clusterScore < 2.35) continue;
            if (!this.isRangedSpawnSafe(target)) continue;
            if (
                this.countMeleeWaves(
                    this.enemies,
                    this.enemyCount
                ) < 4
            ) {
                continue;
            }
            if (
                this.countMeleeWaves(
                    this.allies,
                    this.allyCount
                ) < 4
            ) {
                continue;
            }

            const currentSupport =
                this.countRangedSupportForTarget(
                    target
                );

            if (currentSupport >= supportLimit) {
                continue;
            }

            if (
                target.coverageRatio >= 1.2 &&
                !target.hasStrugglingAlly &&
                !target.dangerousToDefend
            ) {
                continue;
            }

            const score =
                target.threatPower *
                    Math.min(1.5, target.clusterScore * 0.55) +
                Math.max(0, 1.2 - target.coverageRatio) *
                    target.threatPower * 0.45 +
                target.progressToDefend * 90 +
                (target.hasStrugglingAlly ? 140 : 0) +
                (target.dangerousToDefend ? 180 : 0) -
                currentSupport * 160;

            if (score > bestScore) {
                bestScore = score;
                best = target;
            }
        }

        return best;
    }

    chooseClusterMonkEntry(
        affordableEntries: UnitPrefabEntry[],
        target: BattlefieldWaveIntel
    ) {
        let best: UnitPrefabEntry | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (entry.family !== UnitFamily.Monk) {
                continue;
            }

            const basePower =
                this.getEntryBasePower(
                    entry,
                    Math.max(1, entry.unitCount),
                    1,
                    target.aliveCount
                );
            const matchup =
                this.getMatchupFactor(
                    entry,
                    target
                );
            const cost =
                Math.max(1, entry.combatPointCost);
            const score =
                basePower * matchup / cost +
                target.clusterScore * 18 +
                target.aliveCount * 0.8;

            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        }

        return best;
    }

    chooseAntiSpearArcherEntry(
        affordableEntries: UnitPrefabEntry[],
        target: BattlefieldWaveIntel
    ) {
        let best: UnitPrefabEntry | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (entry.family !== UnitFamily.Archer) {
                continue;
            }

            const basePower =
                this.getEntryBasePower(
                    entry,
                    Math.max(1, entry.unitCount),
                    1,
                    target.aliveCount
                );
            const matchup =
                this.getMatchupFactor(
                    entry,
                    target
                );
            const cost =
                Math.max(1, entry.combatPointCost);
            const score =
                basePower * matchup / cost +
                entry.attackRange * 4;

            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        }

        return best;
    }

    chooseRangedSupportEntry(
        affordableEntries: UnitPrefabEntry[],
        target: BattlefieldWaveIntel
    ) {
        let best: UnitPrefabEntry | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (!this.isRangedFamily(entry.family)) {
                continue;
            }

            if (
                entry.family === UnitFamily.Monk &&
                (
                    target.clusterScore < 1.55 ||
                    target.aliveCount < 6
                )
            ) {
                continue;
            }

            const basePower =
                this.getEntryBasePower(
                    entry,
                    Math.max(1, entry.unitCount),
                    1,
                    target.aliveCount
                );
            const cost =
                Math.max(1, entry.combatPointCost);
            const roleScore =
                entry.family === UnitFamily.Monk
                    ? target.clusterScore * 80 +
                        target.aliveCount * 4
                    : entry.attackRange * 12 +
                        target.progressToDefend * 40;
            const score =
                basePower / cost * 80 +
                roleScore -
                cost * 0.35;

            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        }

        return best;
    }

    chooseRangedSupportLane(
        gameManager: GameManager,
        target: BattlefieldWaveIntel
    ) {
        if (target.visualLaneId >= 0) {
            return gameManager.clampLaneId(
                target.visualLaneId
            );
        }

        if (target.laneId >= 0) {
            return gameManager.clampLaneId(
                target.laneId
            );
        }

        return -1;
    }

    private getPressureRoleScore(
        entry: UnitPrefabEntry
    ) {
        if (entry.family === UnitFamily.Sword) {
            return 24;
        }

        if (entry.family === UnitFamily.Axeman) {
            return 22;
        }

        if (entry.family === UnitFamily.Cavalry) {
            return -24;
        }

        if (entry.family === UnitFamily.Spear) {
            return -24;
        }

        return 0;
    }

    private hasAffordableRangedEntry(
        affordableEntries: UnitPrefabEntry[]
    ) {
        for (let i = 0; i < affordableEntries.length; i++) {
            if (
                this.isRangedFamily(
                    affordableEntries[i].family
                )
            ) {
                return true;
            }
        }

        return false;
    }

    private hasAffordableArcherEntry(
        affordableEntries: UnitPrefabEntry[]
    ) {
        for (let i = 0; i < affordableEntries.length; i++) {
            if (
                affordableEntries[i].family ===
                UnitFamily.Archer
            ) {
                return true;
            }
        }

        return false;
    }

    private hasAffordableMonkEntry(
        affordableEntries: UnitPrefabEntry[]
    ) {
        for (let i = 0; i < affordableEntries.length; i++) {
            if (
                affordableEntries[i].family ===
                UnitFamily.Monk
            ) {
                return true;
            }
        }

        return false;
    }

    private fillWaveIntel(
        gameManager: GameManager,
        intel: BattlefieldWaveIntel,
        wave: BattleWave,
        entry: UnitPrefabEntry,
        team: number
    ) {
        intel.reset();

        intel.wave = wave;
        intel.entry = entry;
        intel.aliveCount = wave.getAliveCount();
        intel.aliveRatio = wave.getAliveRatio();
        intel.healthRatio =
            wave.getRuntimeHealthRatio(
                gameManager.frame
            );

        this.getWaveCenter(
            wave,
            intel
        );

        intel.visualLaneId =
            gameManager.getNearestLaneIdForX(
                intel.centerX
            );
        intel.laneId =
            wave.laneId >= 0
                ? gameManager.clampLaneId(wave.laneId)
                : intel.visualLaneId;

        intel.basePower =
            this.getEntryBasePower(
                entry,
                intel.aliveCount,
                intel.healthRatio,
                1
            );

        if (wave.team !== team) {
            this.fillThreatDistance(
                gameManager,
                team,
                intel
            );
        }
    }

    private fillThreatDistance(
        gameManager: GameManager,
        team: number,
        intel: BattlefieldWaveIntel
    ) {
        const ownSpawnZ =
            team === 0
                ? gameManager.teamASpawnZ
                : gameManager.teamBSpawnZ;
        const enemySpawnZ =
            team === 0
                ? gameManager.teamBSpawnZ
                : gameManager.teamASpawnZ;
        const totalDistance =
            Math.max(
                0.0001,
                Math.abs(enemySpawnZ - ownSpawnZ)
            );

        intel.distanceToDefend =
            Math.abs(intel.centerZ - ownSpawnZ);
        intel.progressToDefend =
            Math.max(
                0,
                Math.min(
                    1,
                    Math.abs(intel.centerZ - enemySpawnZ) /
                        totalDistance
                )
            );
        intel.dangerousToDefend =
            intel.progressToDefend >=
            this.dangerousThreatProgress;
        intel.threatPower =
            intel.basePower *
            (
                1 +
                intel.progressToDefend * 0.8 +
                (intel.dangerousToDefend ? 0.8 : 0)
            );
        intel.threatScore =
            intel.threatPower +
            intel.progressToDefend * 250;
    }

    private fillEnemyTacticalState(
        gameManager: GameManager,
        team: number,
        target: BattlefieldWaveIntel
    ) {
        target.clusterScore =
            this.getEnemyClusterScore(
                target
            );
        target.allyBlockersFromSpawn =
            this.countAllyBlockersFromSpawnToTarget(
                gameManager,
                team,
                target
            );
        target.enemyMeleeBlockersFromSpawn =
            this.countEnemyMeleeBlockersFromSpawnToTarget(
                gameManager,
                team,
                target
            );
        target.hasEnemySpearBlockerFromSpawn =
            this.hasEnemySpearBlockerFromSpawnToTarget(
                gameManager,
                team,
                target
            );

        target.coveragePower = 0;
        target.hasStrugglingAlly = false;
        target.allyAheadCount = 0;
        target.allyFrontlineCount = 0;
        target.frontlineBlockPower = 0;
        target.frontlineHealthRatio = 0;

        for (let i = 0; i < this.allyCount; i++) {
            const ally = this.allies[i];

            if (!ally.wave || !ally.entry) continue;
            if (
                ally.visualLaneId !==
                target.visualLaneId
            ) {
                continue;
            }
            if (
                !this.isBetweenSpawnAndTarget(
                    gameManager,
                    team,
                    ally.centerZ,
                    target.centerZ
                )
            ) {
                continue;
            }

            target.allyAheadCount++;

            if (this.isFrontlineFamily(ally.entry.family)) {
                const blockPower =
                    ally.basePower *
                    (0.65 + ally.healthRatio * 0.7);

                target.allyFrontlineCount++;
                target.frontlineBlockPower +=
                    blockPower;
                target.frontlineHealthRatio +=
                    ally.healthRatio;
            }

            const relation =
                this.getCoveragePowerAgainstTarget(
                    gameManager,
                    team,
                    ally.entry,
                    ally.basePower,
                    target
                );

            target.coveragePower += relation;

            if (
                ally.healthRatio <=
                this.rescueAllyAliveRatio
            ) {
                target.hasStrugglingAlly = true;
            }
        }

        if (
            target.allyFrontlineCount > 0
        ) {
            target.frontlineHealthRatio /=
                target.allyFrontlineCount;
        }

        target.coverageRatio =
            target.threatPower > 0
                ? target.coveragePower /
                    target.threatPower
                : 1;
    }

    private getCoveragePowerAgainstTarget(
        gameManager: GameManager,
        team: number,
        entry: UnitPrefabEntry,
        basePower: number,
        target: BattlefieldWaveIntel
    ) {
        const matchup =
            this.getMatchupFactor(
                entry,
                target
            );
        const reachability =
            this.getReachabilityFactor(
                gameManager,
                team,
                entry,
                target
            );

        return basePower *
            matchup *
            reachability;
    }

    private getEntryCoveragePower(
        gameManager: GameManager,
        team: number,
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        const basePower =
            this.getEntryBasePower(
                entry,
                Math.max(
                    1,
                    Math.floor(entry.unitCount)
                ),
                1,
                target.aliveCount
            );

        return this.getCoveragePowerAgainstTarget(
            gameManager,
            team,
            entry,
            basePower,
            target
        );
    }

    private getEntryBasePower(
        entry: UnitPrefabEntry,
        aliveCount: number,
        healthRatio: number,
        targetAliveCount: number
    ) {
        const count =
            Math.max(0, aliveCount);
        const avgInterval =
            Math.max(
                0.05,
                (
                    Math.max(0.05, entry.attackIntervalMin) +
                    Math.max(0.05, entry.attackIntervalMax)
                ) * 0.5
            );
        const hitDamage =
            Math.max(1, entry.damage);
        const dps =
            count * hitDamage / avgInterval;
        const durability =
            Math.max(1, entry.health) *
            count *
            Math.max(0, healthRatio) *
            (1 + Math.max(0, entry.defense) * 0.045);
        const rangeFactor =
            1 +
            Math.min(7, Math.max(0, entry.attackRange)) *
                (this.isRangedFamily(entry.family) ? 0.08 : 0.02);
        const speedFactor =
            1 +
            Math.min(7, Math.max(0, entry.maxSpeed)) *
                (entry.family === UnitFamily.Cavalry ? 0.06 : 0.025);
        const aoeFactor =
            1 +
            Math.min(1.5, Math.max(0, entry.damageRadius)) *
                Math.min(1.4, Math.max(1, targetAliveCount) / 6);

        return Math.sqrt(
            Math.max(1, dps) *
            Math.max(1, durability)
        ) *
        rangeFactor *
        speedFactor *
        aoeFactor;
    }

    private isEntryViableForTarget(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        const lane =
            this.lanes[target.visualLaneId];

        if (!lane) return false;

        if (
            this.isDirectLaneSpawnBlocked(
                lane,
                target
            ) &&
            !target.hasStrugglingAlly &&
            !target.dangerousToDefend
        ) {
            const flankAvailable =
                this.hasOpenFlankLane(
                    target.visualLaneId
                );

            if (!flankAvailable) {
                return false;
            }
        }

        if (this.isRangedFamily(entry.family)) {
            if (!this.isRangedSpawnSafe(target)) {
                return false;
            }

            if (
                entry.family === UnitFamily.Monk &&
                target.clusterScore < 1.35
            ) {
                return false;
            }
        }

        if (
            entry.family === UnitFamily.Cavalry &&
            target.entry &&
            this.isRangedFamily(target.entry.family)
        ) {
            return target.enemyMeleeBlockersFromSpawn <= 1 &&
                !target.hasEnemySpearBlockerFromSpawn;
        }

        return true;
    }

    private getDirectResponseRoleRank(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (!target.entry) return 99;

        const attacker =
            entry.family;
        const defender =
            target.entry.family;

        if (this.isRangedFamily(attacker)) {
            return 99;
        }

        if (defender === UnitFamily.Cavalry) {
            if (attacker === UnitFamily.Spear) return 0;
            if (attacker === UnitFamily.Sword) return 1;
            if (attacker === UnitFamily.Axeman) return 1;
            if (attacker === UnitFamily.Cavalry) return 2;

            return 99;
        }

        if (defender === UnitFamily.Spear) {
            if (attacker === UnitFamily.Sword) return 0;
            if (attacker === UnitFamily.Axeman) return 1;
            if (attacker === UnitFamily.Spear) return 2;

            return 99;
        }

        if (defender === UnitFamily.Sword) {
            if (attacker === UnitFamily.Axeman) return 0;
            if (attacker === UnitFamily.Sword) return 1;
            if (attacker === UnitFamily.Spear) return 2;
            if (attacker === UnitFamily.Cavalry) return 2;

            return 99;
        }

        if (defender === UnitFamily.Axeman) {
            if (attacker === UnitFamily.Axeman) return 0;
            if (attacker === UnitFamily.Sword) return 1;
            if (attacker === UnitFamily.Cavalry) return 2;
            if (attacker === UnitFamily.Spear) return 2;

            return 99;
        }

        if (this.isRangedFamily(defender)) {
            if (attacker === UnitFamily.Cavalry) return 0;
            if (attacker === UnitFamily.Sword) return 1;
            if (attacker === UnitFamily.Axeman) return 1;
            if (attacker === UnitFamily.Spear) return 2;

            return 99;
        }

        return 99;
    }

    private getDirectResponseRoleBias(
        roleRank: number,
        target: BattlefieldWaveIntel
    ) {
        if (roleRank <= 0) {
            return target.dangerousToDefend ? 80 : 55;
        }

        if (roleRank === 1) {
            return target.dangerousToDefend ? 45 : 28;
        }

        return target.dangerousToDefend ? 18 : 6;
    }

    private getSecondaryDirectResponseUtility(
        gameManager: GameManager,
        team: number,
        entry: UnitPrefabEntry,
        primaryTarget: BattlefieldWaveIntel,
        primaryCoveragePower: number,
        primaryNeededPower: number
    ) {
        const transferablePower =
            Math.max(
                0,
                primaryCoveragePower -
                    primaryNeededPower
            );

        if (transferablePower <= 0) {
            return 0;
        }

        let utility = 0;

        for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];

            if (enemy === primaryTarget) continue;
            if (!enemy.wave || !enemy.entry) continue;
            if (enemy.aliveCount <= 0) continue;
            if (enemy.healthRatio <= 0.08) continue;

            const laneDistance =
                Math.abs(
                    enemy.visualLaneId -
                    primaryTarget.visualLaneId
                );

            if (laneDistance > 1) {
                continue;
            }

            const zDistance =
                Math.abs(
                    enemy.centerZ -
                    primaryTarget.centerZ
                );

            if (zDistance > 7) {
                continue;
            }

            const laneFactor =
                laneDistance <= 0
                    ? 1
                    : 0.65;
            const zFactor =
                Math.max(
                    0.25,
                    1 - zDistance / 8
                );
            const coveragePower =
                this.getEntryCoveragePower(
                    gameManager,
                    team,
                    entry,
                    enemy
                );
            const neededPower =
                Math.max(
                    1,
                    enemy.threatPower *
                        this.coverageTargetRatio -
                        enemy.coveragePower
                );
            const transferableCoverage =
                Math.min(
                    transferablePower,
                    coveragePower,
                    neededPower
                );

            if (transferableCoverage <= 0) {
                continue;
            }

            const threatWeight =
                Math.min(
                    1.5,
                    enemy.threatScore / 500
                );

            utility +=
                transferableCoverage /
                Math.max(1, entry.combatPointCost) *
                threatWeight *
                laneFactor *
                zFactor *
                36;
        }

        return Math.min(320, utility);
    }

    private getMatchupFactor(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        const counter =
            CounterSettings.instance;

        if (!target.entry || !counter) {
            return 1;
        }

        const counterScore =
            counter.getCounterScore(
                entry.family,
                target.entry.family
            );

        if (counterScore > 1.0001) {
            return counterScore;
        }

        return 1;
    }

    private getReachabilityFactor(
        gameManager: GameManager,
        team: number,
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (this.isRangedFamily(entry.family)) {
            return this.isRangedSpawnSafe(target)
                ? 1
                : 0.25;
        }

        const blockers =
            this.countAllyBlockersFromSpawnToTarget(
                gameManager,
                team,
                target
            );

        if (blockers <= 0) return 1;
        if (blockers === 1) return 0.8;

        return 0.55;
    }

    private wouldImproveCoverage(
        target: BattlefieldWaveIntel,
        addedCoveragePower: number
    ) {
        if (target.hasStrugglingAlly) return true;
        if (target.coveragePower <= 0.0001) return true;

        const required =
            target.threatPower *
            this.coverageTargetRatio;
        const currentError =
            Math.abs(required - target.coveragePower);
        const projectedError =
            Math.abs(
                required -
                (
                    target.coveragePower +
                    addedCoveragePower
                )
            );

        return projectedError <
            currentError - 0.0001;
    }

    private isDirectLaneSpawnBlocked(
        lane: BattlefieldLaneIntel | undefined,
        target: BattlefieldWaveIntel
    ) {
        if (!lane) return false;
        if (target.hasStrugglingAlly) return false;

        return target.allyAheadCount >=
            this.laneAllyAheadLimit &&
            target.frontlineBlockPower >=
                target.threatPower * 0.55 &&
            target.coverageRatio >= 0.65;
    }

    private isRangedSpawnSafe(
        target: BattlefieldWaveIntel
    ) {
        if (target.allyFrontlineCount <= 0) {
            return false;
        }

        return target.frontlineHealthRatio >= 0.45 &&
            target.frontlineBlockPower > 0;
    }

    private countRangedSupportForTarget(
        target: BattlefieldWaveIntel
    ) {
        let count = 0;

        for (let i = 0; i < this.allyCount; i++) {
            const ally = this.allies[i];

            if (!ally.entry) continue;
            if (!this.isRangedFamily(ally.entry.family)) {
                continue;
            }
            if (
                ally.visualLaneId !==
                target.visualLaneId
            ) {
                continue;
            }

            count++;
        }

        return count;
    }

    private countMeleeWaves(
        waves: BattlefieldWaveIntel[],
        count: number
    ) {
        let total = 0;

        for (let i = 0; i < count; i++) {
            const wave = waves[i];

            if (!wave || !wave.entry) continue;
            if (!this.isFrontlineFamily(wave.entry.family)) {
                continue;
            }

            total++;
        }

        return total;
    }

    private hasOpenFlankLane(
        laneId: number
    ) {
        return this.findOpenAdjacentLane(laneId) >= 0;
    }

    private findBestFlankLane(
        gameManager: GameManager,
        laneId: number
    ) {
        const flank =
            this.findOpenAdjacentLane(laneId);

        if (flank >= 0) {
            return gameManager.clampLaneId(flank);
        }

        return -1;
    }

    private findOpenAdjacentLane(
        laneId: number
    ) {
        let bestLane = -1;
        let bestTraffic = Infinity;

        for (let offset = -1; offset <= 1; offset += 2) {
            const candidate = laneId + offset;
            const lane =
                this.lanes[candidate];

            if (!lane) continue;
            if (lane.enemyWaveCount > 0) continue;
            if (lane.allyWaveCount > 0) continue;

            if (lane.trafficCount < bestTraffic) {
                bestTraffic = lane.trafficCount;
                bestLane = candidate;
            }
        }

        return bestLane;
    }

    private countAllyBlockersFromSpawnToTarget(
        gameManager: GameManager,
        team: number,
        target: BattlefieldWaveIntel
    ) {
        let blockers = 0;

        for (let i = 0; i < this.allyCount; i++) {
            const ally = this.allies[i];

            if (
                ally.visualLaneId !==
                target.visualLaneId
            ) {
                continue;
            }

            if (
                this.isBetweenSpawnAndTarget(
                    gameManager,
                    team,
                    ally.centerZ,
                    target.centerZ
                )
            ) {
                blockers++;
            }
        }

        return blockers;
    }

    private countEnemyMeleeBlockersFromSpawnToTarget(
        gameManager: GameManager,
        team: number,
        target: BattlefieldWaveIntel
    ) {
        let blockers = 0;

        for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];

            if (enemy === target) continue;
            if (!enemy.entry) continue;
            if (!this.isFrontlineFamily(enemy.entry.family)) {
                continue;
            }
            if (
                enemy.visualLaneId !==
                target.visualLaneId
            ) {
                continue;
            }
            if (
                this.isBetweenSpawnAndTarget(
                    gameManager,
                    team,
                    enemy.centerZ,
                    target.centerZ
                )
            ) {
                blockers++;
            }
        }

        return blockers;
    }

    private hasEnemySpearBlockerFromSpawnToTarget(
        gameManager: GameManager,
        team: number,
        target: BattlefieldWaveIntel
    ) {
        for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];

            if (enemy === target) continue;
            if (!enemy.entry) continue;
            if (enemy.entry.family !== UnitFamily.Spear) {
                continue;
            }
            if (
                enemy.visualLaneId !==
                target.visualLaneId
            ) {
                continue;
            }
            if (
                this.isBetweenSpawnAndTarget(
                    gameManager,
                    team,
                    enemy.centerZ,
                    target.centerZ
                )
            ) {
                return true;
            }
        }

        return false;
    }

    private isBetweenSpawnAndTarget(
        gameManager: GameManager,
        team: number,
        z: number,
        targetZ: number
    ) {
        const spawnZ =
            team === 0
                ? gameManager.teamASpawnZ
                : gameManager.teamBSpawnZ;
        const minZ =
            Math.min(spawnZ, targetZ);
        const maxZ =
            Math.max(spawnZ, targetZ);

        return z >= minZ &&
            z <= maxZ;
    }

    private getEnemyClusterScore(
        target: BattlefieldWaveIntel
    ) {
        let score = 1;

        for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];

            if (enemy === target) continue;

            const laneDistance =
                Math.abs(
                    enemy.visualLaneId -
                    target.visualLaneId
                );
            const zDistance =
                Math.abs(
                    enemy.centerZ -
                    target.centerZ
                );

            if (laneDistance <= 1 && zDistance <= 4) {
                score += 0.35;
            }
        }

        score += Math.min(
            0.8,
            target.aliveCount / 10
        );

        return score;
    }

    private getWaveCenter(
        wave: BattleWave,
        intel: BattlefieldWaveIntel
    ) {
        let count = 0;
        let sumX = 0;
        let sumZ = 0;

        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];

            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props || unit.props.isDead()) continue;

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

    private findEntryForWave(
        gameManager: GameManager,
        wave: BattleWave
    ) {
        const database =
            gameManager.unitDatabase;

        if (!database) return null;

        const entries =
            database.getTeamEntries(wave.team);

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!entry) continue;
            if (entry.name === wave.unitName) {
                return entry;
            }
        }

        return null;
    }

    private isValidWave(
        wave: BattleWave | null
    ) {
        if (!wave) return false;
        if (wave.released) return false;
        if (wave.isDead()) return false;

        return true;
    }

    private isFrontlineFamily(
        family: UnitFamily
    ) {
        return family !== UnitFamily.Archer &&
            family !== UnitFamily.Monk;
    }

    private isRangedFamily(
        family: UnitFamily
    ) {
        return family === UnitFamily.Archer ||
            family === UnitFamily.Monk;
    }

    private getEnemyBuffer() {
        while (this.enemies.length <= this.enemyCount) {
            this.enemies.push(new BattlefieldWaveIntel());
        }

        return this.enemies[this.enemyCount++];
    }

    private getAllyBuffer() {
        while (this.allies.length <= this.allyCount) {
            this.allies.push(new BattlefieldWaveIntel());
        }

        return this.allies[this.allyCount++];
    }

    private ensureLaneCount(laneCount: number) {
        for (let i = this.lanes.length; i < laneCount; i++) {
            this.lanes.push(new BattlefieldLaneIntel());
        }
    }
}
