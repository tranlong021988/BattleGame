import { GameManager, UnitPrefabEntry } from './GameManager';
import { BattleWave } from './BattleWave';
import { UnitFamily } from './BattleTypes';
import { CounterSettings } from './CounterSettings';

export class BattlefieldLaneIntel {
    laneId = 0;
    allyWaveCount = 0;
    allyMeleeWaveCount = 0;
    enemyWaveCount = 0;
    trafficCount = 0;

    reset(laneId: number) {
        this.laneId = laneId;
        this.allyWaveCount = 0;
        this.allyMeleeWaveCount = 0;
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
    engagedAllyFrontlineCount = 0;
    frontlineBlockPower = 0;
    frontlineHealthRatio = 0;
    allyBlockersFromSpawn = 0;
    enemyMeleeBlockersFromSpawn = 0;
    sameLaneEnemyAheadCount = 0;
    hasEnemySpearBlockerFromSpawn = false;
    hasStrugglingAlly = false;
    hasEngaged = false;

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
        this.engagedAllyFrontlineCount = 0;
        this.frontlineBlockPower = 0;
        this.frontlineHealthRatio = 0;
        this.allyBlockersFromSpawn = 0;
        this.enemyMeleeBlockersFromSpawn = 0;
        this.sameLaneEnemyAheadCount = 0;
        this.hasEnemySpearBlockerFromSpawn = false;
        this.hasStrugglingAlly = false;
        this.hasEngaged = false;
    }
}

export class BattleSpawnDecision {
    entry: UnitPrefabEntry | null = null;
    target: BattlefieldWaveIntel | null = null;
    laneId = -1;
    aggressiveForward = false;
    reason = '';
    score = -Infinity;

    reset() {
        this.entry = null;
        this.target = null;
        this.laneId = -1;
        this.aggressiveForward = false;
        this.reason = '';
        this.score = -Infinity;
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

    private spawnDecision = new BattleSpawnDecision();

    chooseSnapshotSpawnDecision(
        gameManager: GameManager,
        team: number,
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerTarget: number,
        blockedMeleeLaneId = -1
    ) {
        this.spawnDecision.reset();

        if (affordableEntries.length <= 0) {
            return this.spawnDecision;
        }

        if (this.enemyCount <= 0) {
            return this.chooseOpeningPressureDecision(
                gameManager,
                affordableEntries,
                blockedMeleeLaneId
            );
        }

        const rangedSupportCount =
            this.countRangedSupportAllies();
        const meleeSupportCount =
            this.countMeleeWaves(
                this.allies,
                this.allyCount
            );
        const currentCombatPoint =
            gameManager.getCombatPoint(team);

        for (let i = 0; i < this.enemyCount; i++) {
            const target = this.enemies[i];

            if (!this.isActionableTarget(target)) {
                continue;
            }

            const targetPriority =
                this.getSnapshotTargetPriority(
                    target
                );

            if (targetPriority <= 0) continue;

            const hasFullStrengthRangedHardCounter =
                this.hasAffordableFullStrengthRangedHardCounter(
                    affordableEntries,
                    target
                );

            for (let j = 0; j < affordableEntries.length; j++) {
                const entry = affordableEntries[j];
                const score =
                    this.scoreSnapshotEntryForTarget(
                        gameManager,
                        team,
                        entry,
                        target,
                        targetPriority,
                        currentCombatPoint,
                        rangedSupportCount,
                        meleeSupportCount,
                        maxRangedSupportPerTarget,
                        hasFullStrengthRangedHardCounter
                    );

                if (score <= this.spawnDecision.score) {
                    continue;
                }

                const laneId =
                    this.chooseSpawnLaneForTarget(
                        gameManager,
                        team,
                        target,
                        entry,
                        blockedMeleeLaneId
                    );

                if (laneId < 0) {
                    continue;
                }

                this.spawnDecision.entry = entry;
                this.spawnDecision.target = target;
                this.spawnDecision.laneId = laneId;
                this.spawnDecision.aggressiveForward =
                    this.shouldSpawnAggressive(
                        entry,
                        target,
                        laneId
                    );
                this.spawnDecision.reason =
                    this.getSnapshotDecisionReason(
                        entry,
                        target
                    );
                this.spawnDecision.score = score;
            }
        }

        return this.spawnDecision;
    }

    private chooseOpeningPressureDecision(
        gameManager: GameManager,
        affordableEntries: UnitPrefabEntry[],
        blockedMeleeLaneId: number
    ) {
        const laneId =
            this.choosePressureLane(
                gameManager,
                blockedMeleeLaneId,
                false
            );

        if (laneId < 0) {
            return this.spawnDecision;
        }

        const entry =
            this.choosePressureEntry(affordableEntries);

        if (!entry) {
            return this.spawnDecision;
        }

        this.spawnDecision.entry = entry;
        this.spawnDecision.laneId = laneId;
        this.spawnDecision.aggressiveForward = true;
        this.spawnDecision.reason = 'snapshot-opening-pressure';
        this.spawnDecision.score = 1;

        return this.spawnDecision;
    }

    chooseFallbackSpawnDecision(
        gameManager: GameManager,
        team: number,
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerTarget: number,
        blockedMeleeLaneId = -1
    ) {
        this.spawnDecision.reset();

        const entry =
            this.choosePressureEntry(affordableEntries);

        if (entry) {
            const laneId =
                this.choosePressureLane(
                    gameManager,
                    blockedMeleeLaneId,
                    true
                );

            if (laneId >= 0) {
                this.spawnDecision.entry = entry;
                this.spawnDecision.target = null;
                this.spawnDecision.laneId = laneId;
                this.spawnDecision.aggressiveForward = true;
                this.spawnDecision.reason =
                    'snapshot-pressure-fallback';
                this.spawnDecision.score = 1;

                return this.spawnDecision;
            }
        }

        return this.chooseFallbackRangedSupportDecision(
            gameManager,
            team,
            affordableEntries,
            maxRangedSupportPerTarget
        );
    }

    private isActionableTarget(
        target: BattlefieldWaveIntel
    ) {
        if (!target.wave || !target.entry) return false;
        if (target.aliveCount <= 0) return false;
        if (target.healthRatio <= 0.08) return false;

        return true;
    }

    private chooseFallbackRangedSupportDecision(
        gameManager: GameManager,
        team: number,
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerTarget: number
    ) {
        const rangedSupportCount =
            this.countRangedSupportAllies();
        const meleeSupportCount =
            this.countMeleeWaves(
                this.allies,
                this.allyCount
            );

        for (let i = 0; i < this.enemyCount; i++) {
            const target = this.enemies[i];

            if (!this.isActionableTarget(target)) {
                continue;
            }

            const hasFullStrengthRangedHardCounter =
                this.hasAffordableFullStrengthRangedHardCounter(
                    affordableEntries,
                    target
                );

            for (let j = 0; j < affordableEntries.length; j++) {
                const entry = affordableEntries[j];

                if (!this.isRangedFamily(entry.family)) {
                    continue;
                }

                const score =
                    this.scoreSnapshotEntryForTarget(
                        gameManager,
                        team,
                        entry,
                        target,
                        0,
                        Math.max(1, entry.combatPointCost),
                        rangedSupportCount,
                        meleeSupportCount,
                        maxRangedSupportPerTarget,
                        hasFullStrengthRangedHardCounter
                    );

                if (score <= this.spawnDecision.score) {
                    continue;
                }

                const laneId =
                    target.visualLaneId >= 0
                        ? gameManager.clampLaneId(
                            target.visualLaneId
                        )
                        : -1;

                if (laneId < 0) {
                    continue;
                }

                this.spawnDecision.entry = entry;
                this.spawnDecision.target = target;
                this.spawnDecision.laneId = laneId;
                this.spawnDecision.aggressiveForward = false;
                this.spawnDecision.reason =
                    this.getSnapshotDecisionReason(
                        entry,
                        target
                    );
                this.spawnDecision.score = score;
            }
        }

        return this.spawnDecision;
    }

    private getSnapshotTargetPriority(
        target: BattlefieldWaveIntel
    ) {
        const liveGapRatio =
            target.threatPower > 0
                ? (
                    target.threatPower *
                    this.coverageTargetRatio -
                    target.coveragePower
                ) / target.threatPower
                : 0;
        const needsHelp =
            Math.max(0, liveGapRatio);
        const unengagedPressure =
            target.hasEngaged ? 0 : 180;
        const rescuePressure =
            target.hasStrugglingAlly ? 220 : 0;
        const dangerPressure =
            target.dangerousToDefend
                ? 450 + target.progressToDefend * 280
                : target.progressToDefend * 160;

        if (
            needsHelp <= 0 &&
            !target.dangerousToDefend &&
            !target.hasStrugglingAlly
        ) {
            return 0;
        }

        const frontlineFactor =
            1 /
            (
                1 +
                target.sameLaneEnemyAheadCount * 0.65
            );

        return (
            target.threatPower *
            (0.35 + needsHelp) +
            unengagedPressure +
            rescuePressure +
            dangerPressure
        ) * frontlineFactor;
    }

    private scoreSnapshotEntryForTarget(
        gameManager: GameManager,
        team: number,
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel,
        targetPriority: number,
        currentCombatPoint: number,
        rangedSupportCount: number,
        meleeSupportCount: number,
        maxRangedSupportPerTarget: number,
        hasFullStrengthRangedHardCounter: boolean
    ) {
        if (!target.entry) return -Infinity;

        const ranged =
            this.isRangedFamily(entry.family);
        const hardCounter =
            this.isHardCounterEntryForTarget(
                entry,
                target
            );
        const targetCountersEntry =
            this.isTargetHardCounterForEntry(
                entry,
                target
            );

        if (ranged) {
            if (
                !this.isSnapshotRangedSupportAllowed(
                    entry,
                    target,
                    rangedSupportCount,
                    meleeSupportCount,
                    maxRangedSupportPerTarget,
                    hasFullStrengthRangedHardCounter
                )
            ) {
                return -Infinity;
            }
        }

        if (
            !this.isEntryViableForTarget(
                entry,
                target
            )
        ) {
            return -Infinity;
        }

        const candidatePower =
            this.getEntryCoveragePower(
                gameManager,
                team,
                entry,
                target
            );

        if (candidatePower <= 0) {
            return -Infinity;
        }

        if (ranged) {
            return this.scoreSnapshotRangedSupportEntry(
                entry,
                target,
                targetPriority,
                candidatePower,
                hardCounter
            );
        }

        const fullTargetBasePower =
            this.getEntryBasePower(
                target.entry,
                Math.max(1, target.entry.unitCount),
                1,
                1
            );
        const targetLivePowerRatio =
            Math.max(
                0,
                Math.min(
                    1,
                    target.basePower /
                        Math.max(1, fullTargetBasePower)
                )
            );

        if (
            targetCountersEntry &&
            !hardCounter &&
            targetLivePowerRatio > 0.35
        ) {
            return -Infinity;
        }

        const requiredPower =
            Math.max(
                1,
                target.threatPower *
                    this.coverageTargetRatio -
                    target.coveragePower
            );
        const liveGapPower =
            Math.max(0, requiredPower);
        const usefulPower =
            Math.min(
                candidatePower,
                Math.max(1, liveGapPower) * 1.15
            );
        const needRatio =
            candidatePower / Math.max(1, liveGapPower);
        const powerRatio =
            candidatePower / Math.max(1, target.threatPower);
        const cost =
            Math.max(1, entry.combatPointCost);
        const cpRatio =
            currentCombatPoint / cost;
        const canComfortablyAfford =
            cpRatio >= 1.7;
        const isHoldingSpawn =
            needRatio < 0.75;
        const overshoot =
            Math.max(0, needRatio - 1.25);
        const targetUrgency =
            target.dangerousToDefend
                ? 1
                : target.hasStrugglingAlly
                    ? Math.max(0.7, targetLivePowerRatio)
                    : targetLivePowerRatio;
        const hardCounterBonus =
            hardCounter
                ? 90 + targetUrgency * 360
                : 0;
        const reverseCounterPenalty =
            targetCountersEntry && !hardCounter
                ? 260 + targetLivePowerRatio * 320
                : 0;
        const holdingPenalty =
            isHoldingSpawn ? 180 : 0;
        const strongEnoughBonus =
            powerRatio >= 1
                ? 220
                : powerRatio * 120;
        const fitScore =
            needRatio >= 0.95
                ? 520
                : needRatio * 360;
        const reusableEconomyScore =
            this.getEntryBasePower(
                entry,
                Math.max(1, entry.unitCount),
                1,
                Math.max(1, target.aliveCount)
            ) /
            cost *
            4;

        const targetIsRanged =
            this.isRangedFamily(target.entry.family);
        const overshootPenaltyScale =
            targetIsRanged
                ? 90
                : hardCounter
                    ? targetUrgency >= 0.7
                        ? 160
                        : 300
                    : 320;
        const economyPreference =
            canComfortablyAfford ? 4.5 : 9.5;

        return targetPriority +
            fitScore +
            strongEnoughBonus +
            hardCounterBonus +
            usefulPower / cost * 24 +
            reusableEconomyScore -
            cost * economyPreference -
            overshoot * overshootPenaltyScale -
            reverseCounterPenalty -
            holdingPenalty +
            this.getSnapshotMeleeLadderBias(
                entry,
                target,
                canComfortablyAfford,
                targetLivePowerRatio
            ) +
            Math.random() * 0.001;
    }

    private scoreSnapshotRangedSupportEntry(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel,
        targetPriority: number,
        candidatePower: number,
        hardCounter: boolean
    ) {
        const cost =
            Math.max(1, entry.combatPointCost);
        const fullStrengthCounter =
            hardCounter &&
            this.isFullStrengthTarget(target);
        const baseSupportScore =
            targetPriority +
            candidatePower / cost * 20 -
            cost;

        if (fullStrengthCounter) {
            return 1000000 +
                baseSupportScore +
                Math.random() * 0.001;
        }

        if (entry.family === UnitFamily.Archer) {
            return 800000 +
                baseSupportScore +
                Math.random() * 0.001;
        }

        if (entry.family === UnitFamily.Monk) {
            return 900000 +
                baseSupportScore +
                Math.random() * 0.001;
        }

        return -Infinity;
    }

    private isFullStrengthTarget(
        target: BattlefieldWaveIntel
    ) {
        return target.aliveRatio >= 0.95 &&
            target.healthRatio >= 0.95;
    }

    private getRequiredFrontlineCountForRangedSupport(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (
            this.isHardCounterEntryForTarget(
                entry,
                target
            ) &&
            this.isFullStrengthTarget(target)
        ) {
            return 1;
        }

        if (entry.family === UnitFamily.Monk) {
            return 2;
        }

        if (entry.family === UnitFamily.Archer) {
            return 1;
        }

        return Infinity;
    }

    private hasRecentSameRangedSupportInLane(
        laneId: number,
        family: UnitFamily
    ) {
        let latestWaveId = -1;
        let latestFamily = -1;

        for (let i = 0; i < this.allyCount; i++) {
            const ally = this.allies[i];

            if (!ally.wave || !ally.entry) continue;
            if (!this.isRangedFamily(ally.entry.family)) {
                continue;
            }
            if (ally.visualLaneId !== laneId) {
                continue;
            }
            if (ally.wave.id <= latestWaveId) {
                continue;
            }

            latestWaveId = ally.wave.id;
            latestFamily = ally.entry.family;
        }

        return latestFamily === family;
    }

    private hasRangedSupportLaneRoleRoom(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (
            target.engagedAllyFrontlineCount <
            this.getRequiredFrontlineCountForRangedSupport(
                entry,
                target
            )
        ) {
            return false;
        }

        return !this.hasRecentSameRangedSupportInLane(
            target.visualLaneId,
            entry.family
        );
    }

    private isSnapshotRangedSupportAllowed(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel,
        rangedSupportCount: number,
        meleeSupportCount: number,
        maxRangedSupportPerTarget: number,
        hasFullStrengthRangedHardCounter: boolean
    ) {
        if (!this.isRangedSpawnSafe(target)) {
            return false;
        }

        if (
            !this.hasRangedSupportCapacity(
                rangedSupportCount,
                meleeSupportCount
            )
        ) {
            return false;
        }

        if (
            this.countRangedSupportForTarget(target) >=
            Math.max(
                0,
                Math.floor(maxRangedSupportPerTarget)
            )
        ) {
            return false;
        }

        if (
            !this.hasRangedSupportLaneRoleRoom(
                entry,
                target
            )
        ) {
            return false;
        }

        if (
            this.isHardCounterEntryForTarget(
                entry,
                target
            ) &&
            this.isFullStrengthTarget(target)
        ) {
            return true;
        }

        if (
            entry.family === UnitFamily.Monk &&
            hasFullStrengthRangedHardCounter
        ) {
            return false;
        }

        return entry.family === UnitFamily.Monk ||
            entry.family === UnitFamily.Archer;
    }

    private hasAffordableFullStrengthRangedHardCounter(
        affordableEntries: UnitPrefabEntry[],
        target: BattlefieldWaveIntel
    ) {
        if (!this.isFullStrengthTarget(target)) {
            return false;
        }

        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (!this.isRangedFamily(entry.family)) {
                continue;
            }

            if (entry.family === UnitFamily.Monk) {
                continue;
            }

            if (
                this.isHardCounterEntryForTarget(
                    entry,
                    target
                )
            ) {
                return true;
            }
        }

        return false;
    }

    private getSnapshotMeleeLadderBias(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel,
        canComfortablyAfford: boolean,
        targetLivePowerRatio: number
    ) {
        if (!target.entry) return 0;
        if (this.isRangedFamily(entry.family)) return 0;

        if (this.isRangedFamily(target.entry.family)) {
            return entry.family === UnitFamily.Cavalry
                ? 240
                : 40;
        }

        const attackerRank =
            this.getMeleeLadderRank(entry.family);
        const defenderRank =
            this.getMeleeLadderRank(target.entry.family);

        if (attackerRank < 0 || defenderRank < 0) {
            return 0;
        }

        const rankDelta =
            attackerRank - defenderRank;
        const costDelta =
            entry.combatPointCost -
            target.entry.combatPointCost;
        const conditionScale =
            targetLivePowerRatio >= 0.65
                ? 1
                : targetLivePowerRatio >= 0.4
                    ? 0.55
                    : 0.25;

        if (rankDelta === 1) {
            if (
                costDelta > 8 &&
                !canComfortablyAfford
            ) {
                return 50 * conditionScale;
            }

            return 170 * conditionScale;
        }

        if (rankDelta === 0) {
            return 55 * conditionScale;
        }

        if (rankDelta > 1) {
            return canComfortablyAfford
                ? 25 * conditionScale
                : -110;
        }

        return -50 * conditionScale;
    }

    private getMeleeLadderRank(
        family: UnitFamily
    ) {
        if (family === UnitFamily.Spear) return 0;
        if (family === UnitFamily.Sword) return 1;
        if (family === UnitFamily.Axeman) return 2;
        if (family === UnitFamily.Cavalry) return 3;

        return -1;
    }

    private getSnapshotDecisionReason(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (
            this.isRangedFamily(entry.family)
        ) {
            return this.isHardCounterEntryForTarget(
                entry,
                target
            )
                ? 'snapshot-ranged-counter-support'
                : 'snapshot-ranged-strategic-support';
        }

        if (
            this.isHardCounterEntryForTarget(
                entry,
                target
            )
        ) {
            return 'snapshot-hard-counter';
        }

        return 'snapshot-live-force-response';
    }

    private countRangedSupportAllies() {
        let count = 0;

        for (let i = 0; i < this.allyCount; i++) {
            const ally = this.allies[i];

            if (!ally.entry) continue;
            if (!this.isRangedFamily(ally.entry.family)) {
                continue;
            }

            count++;
        }

        return count;
    }

    private hasRangedSupportCapacity(
        rangedSupportCount: number,
        meleeSupportCount: number
    ) {
        return rangedSupportCount <
            meleeSupportCount;
    }

    private isHardCounterEntryForTarget(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (!target.entry) return false;

        const counter =
            CounterSettings.instance;

        if (!counter) return false;

        return counter.getCounterScore(
            entry.family,
            target.entry.family
        ) > 1.0001;
    }

    private isTargetHardCounterForEntry(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (!target.entry) return false;

        const counter =
            CounterSettings.instance;

        if (!counter) return false;

        return counter.getCounterScore(
            target.entry.family,
            entry.family
        ) > 1.0001;
    }

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

                    if (this.isFrontlineFamily(entry.family)) {
                        lane.allyMeleeWaveCount++;
                    }
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

    chooseSpawnLaneForTarget(
        gameManager: GameManager,
        team: number,
        target: BattlefieldWaveIntel,
        entry: UnitPrefabEntry,
        blockedMeleeLaneId = -1
    ) {
        if (!target.wave) return -1;

        const directLane =
            this.getTacticalLaneId(target);
        const lane =
            this.lanes[directLane];
        const directBlocked =
            this.isDirectLaneSpawnBlocked(
                lane,
                target
            );

        if (this.isRangedFamily(entry.family)) {
            return this.isRangedSpawnSafe(target)
                ? directLane
                : -1;
        }

        if (directLane === blockedMeleeLaneId) {
            const flankLane =
                this.findBestFlankLane(
                    gameManager,
                    directLane
                );

            return flankLane >= 0 ? flankLane : -1;
        }

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

        return -1;
    }

    shouldSpawnAggressive(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel,
        spawnLaneId: number
    ) {
        if (!target.entry) return true;

        if (this.isRangedFamily(entry.family)) {
            return false;
        }

        if (
            this.isCleanFrontlineLaneTarget(
                target,
                spawnLaneId
            )
        ) {
            return true;
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

    private isCleanFrontlineLaneTarget(
        target: BattlefieldWaveIntel,
        spawnLaneId: number
    ) {
        if (spawnLaneId < 0) return false;
        if (target.visualLaneId < 0) return false;
        if (spawnLaneId !== target.visualLaneId) return false;
        if (target.sameLaneEnemyAheadCount > 0) return false;

        const lane = this.lanes[spawnLaneId];

        if (!lane) return false;

        return lane.allyWaveCount <= 0;
    }

    choosePressureLane(
        gameManager: GameManager,
        blockedMeleeLaneId = -1,
        requireEmptyLane = false
    ) {
        let bestLane = -1;
        let bestScore = -Infinity;
        const laneCount =
            gameManager.getSafeLaneCount();

        for (let i = 0; i < laneCount; i++) {
            const lane = this.lanes[i];

            if (!lane) continue;
            if (
                i === blockedMeleeLaneId &&
                laneCount > 1
            ) {
                continue;
            }
            if (
                requireEmptyLane &&
                (
                    lane.allyWaveCount > 0 ||
                    lane.enemyWaveCount > 0
                )
            ) {
                continue;
            }

            const score =
                (lane.enemyWaveCount <= 0 ? 80 : 0) -
                lane.trafficCount * 24 -
                lane.allyMeleeWaveCount * 28 -
                lane.allyWaveCount * 10 +
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
        const nonCavalryEntry =
            this.choosePressureEntryByEconomy(
                affordableEntries,
                false
            );

        if (nonCavalryEntry) {
            return nonCavalryEntry;
        }

        return this.choosePressureEntryByEconomy(
            affordableEntries,
            true
        );
    }

    private choosePressureEntryByEconomy(
        affordableEntries: UnitPrefabEntry[],
        allowCavalry: boolean
    ) {
        let best: UnitPrefabEntry | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (this.isRangedFamily(entry.family)) {
                continue;
            }
            if (
                !allowCavalry &&
                entry.family === UnitFamily.Cavalry
            ) {
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
                power / cost * 18 +
                Math.sqrt(power) * 4 -
                cost * 2.2 +
                entry.maxSpeed +
                Math.random() * 0.001;

            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        }

        return best;
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
        intel.hasEngaged =
            wave.hasEngagedRuntime(
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
        target.sameLaneEnemyAheadCount =
            this.countSameLaneEnemiesAheadOfTarget(
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
        target.engagedAllyFrontlineCount = 0;
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

                if (ally.hasEngaged) {
                    target.engagedAllyFrontlineCount++;
                }

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

    private isDirectLaneSpawnBlocked(
        lane: BattlefieldLaneIntel | undefined,
        target: BattlefieldWaveIntel
    ) {
        if (!lane) return false;
        if (target.hasStrugglingAlly) return false;

        if (
            lane.allyMeleeWaveCount >= 3 &&
            target.sameLaneEnemyAheadCount > 0
        ) {
            return true;
        }

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

        if (target.engagedAllyFrontlineCount <= 0) {
            return false;
        }

        return target.frontlineBlockPower > 0;
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

    private countSameLaneEnemiesAheadOfTarget(
        gameManager: GameManager,
        team: number,
        target: BattlefieldWaveIntel
    ) {
        let count = 0;

        for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];

            if (enemy === target) continue;
            if (!enemy.entry) continue;
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
                count++;
            }
        }

        return count;
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

    private getTacticalLaneId(
        target: BattlefieldWaveIntel
    ) {
        return target.visualLaneId >= 0
            ? target.visualLaneId
            : target.laneId;
    }
}
