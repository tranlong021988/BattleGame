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
    bestEntry: UnitPrefabEntry | null = null;
    target: BattlefieldWaveIntel | null = null;
    laneId = -1;
    aggressiveForward = false;
    reason = '';
    score = -Infinity;
    bestScore = -Infinity;
    selectedRank = -1;
    candidateCount = 0;
    selectionQuality = 0;
    qualityRatio = 0;
    selectionRoll = 0;
    cpStrategyState = '';

    reset() {
        this.entry = null;
        this.bestEntry = null;
        this.target = null;
        this.laneId = -1;
        this.aggressiveForward = false;
        this.reason = '';
        this.score = -Infinity;
        this.bestScore = -Infinity;
        this.selectedRank = -1;
        this.candidateCount = 0;
        this.selectionQuality = 0;
        this.qualityRatio = 0;
        this.selectionRoll = 0;
        this.cpStrategyState = '';
    }
}

class BattleSpawnCandidate {
    entry: UnitPrefabEntry | null = null;
    target: BattlefieldWaveIntel | null = null;
    laneId = -1;
    aggressiveForward = false;
    reason = '';
    score = -Infinity;
    cpStrategyState = '';

    set(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel | null,
        laneId: number,
        aggressiveForward: boolean,
        reason: string,
        score: number,
        cpStrategyState: string
    ) {
        this.entry = entry;
        this.target = target;
        this.laneId = laneId;
        this.aggressiveForward = aggressiveForward;
        this.reason = reason;
        this.score = score;
        this.cpStrategyState = cpStrategyState;
    }
}

export enum CPStrategyState {
    Opening = 'opening',
    Abundant = 'abundant',
    Normal = 'normal',
    Efficient = 'efficient',
    Desperate = 'desperate',
}

class BattleResponseReservation {
    targetWaveId = -1;
    responseWaveId = -1;
    responseFamily = -1;
    coveragePower = 0;
    frame = 0;
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
    allyFrontlinePower = 0;
    enemyFrontlineThreatPower = 0;

    private spawnDecision = new BattleSpawnDecision();
    private spawnCandidates: BattleSpawnCandidate[] = [];
    private spawnCandidateCount = 0;
    private responseReservations: BattleResponseReservation[] = [];
    private responseReservationFrames = 180;

    private resetSpawnCandidates() {
        this.spawnCandidateCount = 0;
    }

    private addSpawnCandidate(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel | null,
        laneId: number,
        aggressiveForward: boolean,
        reason: string,
        score: number,
        cpStrategyState: string
    ) {
        if (!Number.isFinite(score)) return;

        let candidate =
            this.spawnCandidates[this.spawnCandidateCount];

        if (!candidate) {
            candidate = new BattleSpawnCandidate();
            this.spawnCandidates[this.spawnCandidateCount] =
                candidate;
        }

        candidate.set(
            entry,
            target,
            laneId,
            aggressiveForward,
            reason,
            score,
            cpStrategyState
        );

        this.spawnCandidateCount++;
    }

    private chooseCandidateByAccuracy(
        decisionAccuracy: number
    ) {
        this.spawnDecision.reset();

        const count =
            this.spawnCandidateCount;

        if (count <= 0) {
            return this.spawnDecision;
        }

        const accuracy =
            this.clamp01(decisionAccuracy);
        let bestIndex = 0;
        let bestScore =
            this.spawnCandidates[0].score;

        for (let i = 1; i < count; i++) {
            const score =
                this.spawnCandidates[i].score;

            if (score > bestScore) {
                bestScore = score;
                bestIndex = i;
            }
        }

        let selectedIndex = bestIndex;
        let selectionRoll = 0;

        const eligibleCount =
            this.getEligibleCandidateCount(bestIndex);
        const mistakeEligibleCount =
            this.getMistakeEligibleCandidateCount(bestIndex);

        if (
            accuracy <= 0 &&
            mistakeEligibleCount <= 0 &&
            this.isAccurateResponseCandidate(
                this.spawnCandidates[bestIndex]
            )
        ) {
            return this.spawnDecision;
        }

        if (mistakeEligibleCount > 0) {
            selectionRoll = Math.random();

            if (selectionRoll >= accuracy) {
                selectedIndex =
                    this.chooseNonBestCandidateByAccuracy(
                        bestIndex,
                        accuracy
                    );
            }
        }

        const selected =
            this.spawnCandidates[selectedIndex];
        const rank =
            this.getCandidateRank(selectedIndex, bestIndex);
        const quality =
            this.getRankQuality(rank, eligibleCount);

        this.spawnDecision.entry = selected.entry;
        this.spawnDecision.bestEntry =
            this.spawnCandidates[bestIndex].entry;
        this.spawnDecision.target = selected.target;
        this.spawnDecision.laneId = selected.laneId;
        this.spawnDecision.aggressiveForward =
            selected.aggressiveForward;
        this.spawnDecision.reason = selected.reason;
        this.spawnDecision.score = selected.score;
        this.spawnDecision.bestScore = bestScore;
        this.spawnDecision.selectedRank = rank;
        this.spawnDecision.candidateCount = eligibleCount;
        this.spawnDecision.selectionQuality = quality;
        this.spawnDecision.qualityRatio =
            bestScore > 0
                ? selected.score / bestScore
                : quality;
        this.spawnDecision.selectionRoll = selectionRoll;
        this.spawnDecision.cpStrategyState =
            selected.cpStrategyState;

        return this.spawnDecision;
    }

    private chooseNonBestCandidateByAccuracy(
        bestIndex: number,
        accuracy: number
    ) {
        const eligibleCount =
            this.getEligibleCandidateCount(bestIndex);
        let selectedIndex = bestIndex;
        let totalWeight = 0;

        for (let i = 0; i < this.spawnCandidateCount; i++) {
            if (!this.isDeliberateMistakeCandidate(i, bestIndex)) {
                continue;
            }

            const rank =
                this.getCandidateRank(i, bestIndex);

            if (rank <= 0) continue;

            totalWeight +=
                this.getMistakeRankWeight(
                    rank,
                    eligibleCount,
                    accuracy
                );
        }

        if (totalWeight <= 0) {
            return bestIndex;
        }

        let roll =
            Math.random() * totalWeight;

        for (let i = 0; i < this.spawnCandidateCount; i++) {
            if (!this.isDeliberateMistakeCandidate(i, bestIndex)) {
                continue;
            }

            const rank =
                this.getCandidateRank(i, bestIndex);

            if (rank <= 0) continue;

            roll -=
                this.getMistakeRankWeight(
                    rank,
                    eligibleCount,
                    accuracy
                );

            if (roll <= 0) {
                selectedIndex = i;
                break;
            }
        }

        return selectedIndex;
    }

    private getMistakeEligibleCandidateCount(
        bestIndex: number
    ) {
        let count = 0;

        for (let i = 0; i < this.spawnCandidateCount; i++) {
            if (this.isDeliberateMistakeCandidate(i, bestIndex)) {
                count++;
            }
        }

        return count;
    }

    private isDeliberateMistakeCandidate(
        index: number,
        bestIndex: number
    ) {
        if (!this.isCandidateSameAnchor(index, bestIndex)) {
            return false;
        }

        if (this.getCandidateRank(index, bestIndex) <= 0) {
            return false;
        }

        const candidate =
            this.spawnCandidates[index];
        const best =
            this.spawnCandidates[bestIndex];

        if (!candidate.entry || !best.entry) {
            return false;
        }

        if (candidate.entry.family === best.entry.family) {
            return false;
        }

        return !this.isAccurateResponseCandidate(candidate);
    }

    private isAccurateResponseCandidate(
        candidate: BattleSpawnCandidate
    ) {
        if (!candidate.entry || !candidate.target) {
            return false;
        }

        if (
            candidate.reason === 'snapshot-hard-counter' ||
            candidate.reason === 'snapshot-ranged-counter-support'
        ) {
            return true;
        }

        return this.isHardCounterEntryForTarget(
            candidate.entry,
            candidate.target
        );
    }

    private getEligibleCandidateCount(anchorIndex: number) {
        let count = 0;

        for (let i = 0; i < this.spawnCandidateCount; i++) {
            if (this.isCandidateSameAnchor(i, anchorIndex)) {
                count++;
            }
        }

        return count;
    }

    private isCandidateSameAnchor(
        index: number,
        anchorIndex: number
    ) {
        const candidate =
            this.spawnCandidates[index];
        const anchor =
            this.spawnCandidates[anchorIndex];

        if (candidate.laneId !== anchor.laneId) {
            return false;
        }

        const candidateWaveId =
            candidate.target && candidate.target.wave
                ? candidate.target.wave.id
                : -1;
        const anchorWaveId =
            anchor.target && anchor.target.wave
                ? anchor.target.wave.id
                : -1;

        return candidateWaveId === anchorWaveId;
    }

    private getCandidateRank(
        index: number,
        anchorIndex: number
    ) {
        const score =
            this.spawnCandidates[index].score;
        let rank = 0;

        for (let i = 0; i < this.spawnCandidateCount; i++) {
            if (!this.isCandidateSameAnchor(i, anchorIndex)) {
                continue;
            }

            if (this.spawnCandidates[i].score > score) {
                rank++;
            }
        }

        return rank;
    }

    private getRankQuality(
        rank: number,
        count: number
    ) {
        if (count <= 1) {
            return 1;
        }

        return 1 -
            Math.max(0, rank) /
            Math.max(1, count - 1);
    }

    private getMistakeRankWeight(
        rank: number,
        count: number,
        accuracy: number
    ) {
        const quality =
            this.getRankQuality(rank, count);
        const badQuality =
            1 - quality;

        return Math.max(
            0.0001,
            quality * accuracy +
            badQuality * (1 - accuracy)
        );
    }

    recordSpawnReservation(
        gameManager: GameManager,
        team: number,
        target: BattlefieldWaveIntel | null,
        entry: UnitPrefabEntry,
        responseWave: BattleWave,
        frame: number
    ) {
        if (!target || !target.wave || !target.entry) return;
        if (!responseWave) return;

        const basePower =
            this.getEntryBasePower(
                entry,
                Math.max(1, Math.floor(entry.unitCount)),
                1,
                Math.max(1, target.aliveCount)
            );
        const reservation =
            new BattleResponseReservation();

        reservation.targetWaveId = target.wave.id;
        reservation.responseWaveId = responseWave.id;
        reservation.responseFamily = entry.family;
        reservation.coveragePower =
            this.getCoveragePowerAgainstTarget(
                gameManager,
                team,
                entry,
                basePower,
                target
            );
        reservation.frame = frame;

        this.responseReservations.push(reservation);

        if (this.responseReservations.length > 64) {
            this.responseReservations.splice(
                0,
                this.responseReservations.length - 64
            );
        }
    }

    chooseSnapshotSpawnDecision(
        gameManager: GameManager,
        team: number,
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerTarget: number,
        blockedMeleeLaneId = -1,
        decisionAccuracy = 1,
        forceOpening = false,
        preferredOpeningLaneId = -1
    ) {
        this.spawnDecision.reset();
        this.resetSpawnCandidates();

        if (affordableEntries.length <= 0) {
            return this.spawnDecision;
        }

        if (forceOpening || this.enemyCount <= 0) {
            return this.chooseOpeningPressureDecision(
                gameManager,
                affordableEntries,
                blockedMeleeLaneId,
                preferredOpeningLaneId
            );
        }

        const currentCombatPoint =
            gameManager.getCombatPoint(team);
        const enemyCombatPoint =
            gameManager.getCombatPoint(
                team === 0 ? 1 : 0
            );
        const cpStrategyState =
            this.getCPStrategyState(
                gameManager,
                team,
                affordableEntries,
                maxRangedSupportPerTarget,
                blockedMeleeLaneId,
                currentCombatPoint,
                enemyCombatPoint,
                decisionAccuracy
            );

        for (let i = 0; i < this.enemyCount; i++) {
            const target = this.enemies[i];

            if (!this.isActionableTarget(target)) {
                continue;
            }

            const targetPriority =
                this.getSnapshotTargetPriority(
                    target
                );

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
                        enemyCombatPoint,
                        maxRangedSupportPerTarget,
                        hasFullStrengthRangedHardCounter,
                        cpStrategyState,
                        decisionAccuracy
                    );

                if (!Number.isFinite(score)) continue;

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

                this.addSpawnCandidate(
                    entry,
                    target,
                    laneId,
                    this.shouldSpawnAggressive(
                        entry,
                        target,
                        laneId
                    ),
                    this.getSnapshotDecisionReason(
                        entry,
                        target
                    ),
                    score,
                    cpStrategyState
                );
            }
        }

        return this.chooseCandidateByAccuracy(
            decisionAccuracy
        );
    }

    private chooseOpeningPressureDecision(
        gameManager: GameManager,
        affordableEntries: UnitPrefabEntry[],
        blockedMeleeLaneId: number,
        preferredLaneId = -1
    ) {
        const laneCount =
            gameManager.getSafeLaneCount();
        const laneId =
            preferredLaneId >= 0 &&
            preferredLaneId < laneCount
                ? Math.floor(preferredLaneId)
                : this.choosePressureLane(
                    gameManager,
                    blockedMeleeLaneId,
                    false
                );

        if (laneId < 0) {
            return this.spawnDecision;
        }

        const averagePower =
            this.getAverageOpeningFrontlinePower(
                affordableEntries
            );

        if (averagePower <= 0) {
            return this.spawnDecision;
        }

        let selectedEntry: UnitPrefabEntry | null = null;
        let selectedDistance = Number.POSITIVE_INFINITY;

        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (!this.isOpeningFrontlineFamily(entry.family)) {
                continue;
            }

            const power =
                this.getEntryBasePower(
                    entry,
                    1,
                    1,
                    1
                );
            const distance =
                Math.abs(power - averagePower);

            if (
                distance < selectedDistance ||
                (
                    distance === selectedDistance &&
                    this.compareOpeningEntries(
                        entry,
                        selectedEntry
                    ) < 0
                )
            ) {
                selectedEntry = entry;
                selectedDistance = distance;
            }
        }

        if (!selectedEntry) {
            return this.spawnDecision;
        }

        this.addSpawnCandidate(
            selectedEntry,
            null,
            laneId,
            true,
            'snapshot-opening-pressure',
            1000 - selectedDistance,
            CPStrategyState.Opening
        );

        return this.chooseCandidateByAccuracy(1);
    }

    private getAverageOpeningFrontlinePower(
        affordableEntries: UnitPrefabEntry[]
    ) {
        let candidateCount = 0;
        let totalPower = 0;

        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (!this.isOpeningFrontlineFamily(entry.family)) {
                continue;
            }

            candidateCount++;
            totalPower +=
                this.getEntryBasePower(
                    entry,
                    1,
                    1,
                    1
                );
        }

        if (candidateCount <= 0) {
            return 0;
        }

        return totalPower / candidateCount;
    }

    private compareOpeningEntries(
        a: UnitPrefabEntry,
        b: UnitPrefabEntry | null
    ) {
        if (!b) return -1;
        if (a.family !== b.family) {
            return a.family - b.family;
        }
        if (a.tier !== b.tier) {
            return a.tier - b.tier;
        }

        return a.name.localeCompare(b.name);
    }

    private isOpeningFrontlineFamily(
        family: UnitFamily
    ) {
        return family === UnitFamily.Spear ||
            family === UnitFamily.Sword ||
            family === UnitFamily.Axeman ||
            family === UnitFamily.Cavalry;
    }

    private getFallbackCPStrategyState(
        gameManager: GameManager,
        team: number,
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerTarget: number,
        blockedMeleeLaneId: number,
        decisionAccuracy: number
    ) {
        const currentCombatPoint =
            gameManager.getCombatPoint(team);
        const enemyCombatPoint =
            gameManager.getCombatPoint(
                team === 0 ? 1 : 0
            );
        return this.getCPStrategyState(
            gameManager,
            team,
            affordableEntries,
            maxRangedSupportPerTarget,
            blockedMeleeLaneId,
            currentCombatPoint,
            enemyCombatPoint,
            decisionAccuracy
        );
    }

    private getCPStrategyState(
        gameManager: GameManager,
        team: number,
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerTarget: number,
        blockedMeleeLaneId: number,
        currentCombatPoint: number,
        enemyCombatPoint: number,
        decisionAccuracy: number
    ) {
        if (
            currentCombatPoint > enemyCombatPoint &&
            this.canSpawnPremiumAndRemainAhead(
                currentCombatPoint,
                enemyCombatPoint,
                affordableEntries
            )
        ) {
            return CPStrategyState.Abundant;
        }

        if (
            !this.hasAffordableEffectiveResponse(
                gameManager,
                team,
                affordableEntries,
                maxRangedSupportPerTarget,
                blockedMeleeLaneId,
                decisionAccuracy
            )
        ) {
            return CPStrategyState.Desperate;
        }

        const normalBand =
            Math.max(
                this.getCheapestAffordableCost(affordableEntries),
                enemyCombatPoint * 0.12
            );
        const cpGap =
            currentCombatPoint - enemyCombatPoint;

        if (Math.abs(cpGap) <= normalBand) {
            return CPStrategyState.Normal;
        }

        if (cpGap < 0) {
            return CPStrategyState.Efficient;
        }

        return CPStrategyState.Normal;
    }

    private getCheapestAffordableCost(
        affordableEntries: UnitPrefabEntry[]
    ) {
        let cost = Infinity;

        for (let i = 0; i < affordableEntries.length; i++) {
            cost =
                Math.min(
                    cost,
                    Math.max(1, affordableEntries[i].combatPointCost)
                );
        }

        return Number.isFinite(cost) ? cost : 1;
    }

    private canSpawnPremiumAndRemainAhead(
        currentCombatPoint: number,
        enemyCombatPoint: number,
        affordableEntries: UnitPrefabEntry[]
    ) {
        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (!this.isFrontlineFamily(entry.family)) {
                continue;
            }
            if (this.getMeleeLadderRank(entry.family) < 2) {
                continue;
            }
            if (
                currentCombatPoint -
                Math.max(1, entry.combatPointCost) >
                enemyCombatPoint
            ) {
                return true;
            }
        }

        return false;
    }

    private hasAffordableEffectiveResponse(
        gameManager: GameManager,
        team: number,
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerTarget: number,
        blockedMeleeLaneId: number,
        decisionAccuracy: number
    ) {
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

                if (
                    this.isRangedFamily(entry.family) &&
                    !this.isSnapshotRangedSupportAllowed(
                        entry,
                        target,
                        maxRangedSupportPerTarget,
                        hasFullStrengthRangedHardCounter,
                        decisionAccuracy
                    )
                ) {
                    continue;
                }

                if (
                    !this.isEntryViableForTarget(
                        entry,
                        target
                    )
                ) {
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

                if (
                    this.isHardCounterEntryForTarget(
                        entry,
                        target
                    )
                ) {
                    return true;
                }

                if (
                    this.getFullMatchupPowerRatio(
                        entry,
                        target
                    ) >= 0.95
                ) {
                    return true;
                }

                if (
                    target.healthRatio <= 0.35 &&
                    this.getFullMatchupPowerRatio(
                        entry,
                        target
                    ) >= 0.5
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    chooseFallbackSpawnDecision(
        gameManager: GameManager,
        team: number,
        affordableEntries: UnitPrefabEntry[],
        maxRangedSupportPerTarget: number,
        blockedMeleeLaneId = -1,
        decisionAccuracy = 1
    ) {
        this.spawnDecision.reset();
        this.resetSpawnCandidates();

        const cpStrategyState =
            this.getFallbackCPStrategyState(
                gameManager,
                team,
                affordableEntries,
                maxRangedSupportPerTarget,
                blockedMeleeLaneId,
                decisionAccuracy
            );
        const laneId =
            this.choosePressureLane(
                gameManager,
                blockedMeleeLaneId,
                cpStrategyState !== CPStrategyState.Desperate
            );

        if (laneId >= 0) {
            if (cpStrategyState === CPStrategyState.Desperate) {
                this.addDesperateFallbackCandidates(
                    affordableEntries,
                    laneId,
                    cpStrategyState,
                    decisionAccuracy
                );
            } else {
                this.addPressureEntryCandidates(
                    affordableEntries,
                    laneId,
                    cpStrategyState,
                    decisionAccuracy
                );
            }

            if (this.spawnCandidateCount > 0) {
                return this.chooseCandidateByAccuracy(
                    decisionAccuracy
                );
            }
        }

        return this.chooseFallbackRangedSupportDecision(
            gameManager,
            team,
            affordableEntries,
            maxRangedSupportPerTarget,
            decisionAccuracy
        );
    }

    chooseLastStandSpawnDecision(
        gameManager: GameManager,
        team: number,
        affordableEntries: UnitPrefabEntry[],
        blockedMeleeLaneId = -1,
        decisionAccuracy = 1
    ) {
        this.spawnDecision.reset();
        this.resetSpawnCandidates();

        const laneId =
            this.choosePressureLane(
                gameManager,
                blockedMeleeLaneId,
                false
            );

        if (laneId < 0) {
            return this.spawnDecision;
        }

        for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];
            const power =
                this.getEntryBasePower(
                    entry,
                    Math.max(1, entry.unitCount),
                    1,
                    1
                );
            const cost =
                Math.max(1, entry.combatPointCost);
            const rank =
                this.isRangedFamily(entry.family)
                    ? 0
                    : Math.max(
                        0,
                        this.getMeleeLadderRank(entry.family)
                    );
            const score =
                this.getPressureEntryScore(
                    power,
                    cost,
                    rank,
                    entry.maxSpeed,
                    CPStrategyState.Desperate
                ) -
                this.getPressureCavalrySpearLanePenalty(
                    entry,
                    laneId,
                    decisionAccuracy
                ) +
                Math.random() * 0.001;

            this.addSpawnCandidate(
                entry,
                null,
                laneId,
                true,
                'snapshot-last-stand-fallback',
                score,
                CPStrategyState.Desperate
            );
        }

        if (this.spawnCandidateCount <= 0) {
            return this.spawnDecision;
        }

        return this.chooseCandidateByAccuracy(
            decisionAccuracy
        );
    }

    private addDesperateFallbackCandidates(
        affordableEntries: UnitPrefabEntry[],
        laneId: number,
        cpStrategyState: CPStrategyState,
        decisionAccuracy: number
    ) {
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
                power * 0.35 -
                cost * 0.15 +
                entry.maxSpeed * 3 -
                this.getPressureCavalrySpearLanePenalty(
                    entry,
                    laneId,
                    decisionAccuracy
                ) +
                Math.random() * 0.001;

            this.addSpawnCandidate(
                entry,
                null,
                laneId,
                true,
                'snapshot-desperate-fallback',
                score,
                cpStrategyState
            );
        }
    }

    private addPressureEntryCandidates(
        affordableEntries: UnitPrefabEntry[],
        laneId: number,
        cpStrategyState: CPStrategyState,
        decisionAccuracy: number
    ) {
        const startCount =
            this.spawnCandidateCount;

        if (
            cpStrategyState === CPStrategyState.Abundant ||
            cpStrategyState === CPStrategyState.Desperate
        ) {
            this.addPressureEntryCandidatesByEconomy(
                affordableEntries,
                laneId,
                true,
                cpStrategyState,
                decisionAccuracy
            );
            return;
        }

        this.addPressureEntryCandidatesByEconomy(
            affordableEntries,
            laneId,
            false,
            cpStrategyState,
            decisionAccuracy
        );

        if (this.spawnCandidateCount > startCount) {
            return;
        }

        this.addPressureEntryCandidatesByEconomy(
            affordableEntries,
            laneId,
            true,
            cpStrategyState,
            decisionAccuracy
        );
    }

    private addPressureEntryCandidatesByEconomy(
        affordableEntries: UnitPrefabEntry[],
        laneId: number,
        allowCavalry: boolean,
        cpStrategyState: CPStrategyState,
        decisionAccuracy: number
    ) {
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
            const rank =
                this.getMeleeLadderRank(entry.family);
            const score =
                this.getPressureEntryScore(
                    power,
                    cost,
                    Math.max(0, rank),
                    entry.maxSpeed,
                    cpStrategyState
                ) -
                this.getPressureCavalrySpearLanePenalty(
                    entry,
                    laneId,
                    decisionAccuracy
                ) +
                Math.random() * 0.001;

            this.addSpawnCandidate(
                entry,
                null,
                laneId,
                true,
                'snapshot-pressure-fallback',
                score,
                cpStrategyState
            );
        }
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
        maxRangedSupportPerTarget: number,
        decisionAccuracy = 1
    ) {
        this.spawnDecision.reset();
        this.resetSpawnCandidates();

        const currentCombatPoint =
            gameManager.getCombatPoint(team);
        const enemyCombatPoint =
            gameManager.getCombatPoint(
                team === 0 ? 1 : 0
            );
        const cpStrategyState =
            this.getCPStrategyState(
                gameManager,
                team,
                affordableEntries,
                maxRangedSupportPerTarget,
                -1,
                currentCombatPoint,
                enemyCombatPoint,
                decisionAccuracy
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
                        currentCombatPoint,
                        enemyCombatPoint,
                        maxRangedSupportPerTarget,
                        hasFullStrengthRangedHardCounter,
                        cpStrategyState,
                        decisionAccuracy
                    );

                if (!Number.isFinite(score)) continue;

                const laneId =
                    target.visualLaneId >= 0
                        ? gameManager.clampLaneId(
                            target.visualLaneId
                        )
                        : -1;

                if (laneId < 0) {
                    continue;
                }

                this.addSpawnCandidate(
                    entry,
                    target,
                    laneId,
                    false,
                    this.getSnapshotDecisionReason(
                        entry,
                        target
                    ),
                    score,
                    cpStrategyState
                );
            }
        }

        return this.chooseCandidateByAccuracy(
            decisionAccuracy
        );
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

    private getRangedSupportTargetPriority(
        target: BattlefieldWaveIntel
    ) {
        if (!target.entry) return 0;
        if (!this.isRangedSpawnSafe(target)) {
            return 0;
        }

        const engagedFrontline =
            Math.min(3, target.engagedAllyFrontlineCount);
        const threatPressure =
            Math.min(260, target.threatPower * 0.16);
        const engagedPressure =
            engagedFrontline * 90;
        const packedLanePressure =
            Math.min(3, target.sameLaneEnemyAheadCount) * 45;
        const dangerPressure =
            target.dangerousToDefend
                ? 180 + target.progressToDefend * 160
                : target.progressToDefend * 90;
        const rangedThreatPressure =
            this.hasEngagedEnemyRangedInLane(
                target.visualLaneId
            )
                ? 130
                : 0;
        const fullStrengthPressure =
            this.isFullStrengthTarget(target) ? 90 : 0;

        return 120 +
            threatPressure +
            engagedPressure +
            packedLanePressure +
            dangerPressure +
            rangedThreatPressure +
            fullStrengthPressure;
    }

    private scoreSnapshotEntryForTarget(
        gameManager: GameManager,
        team: number,
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel,
        targetPriority: number,
        currentCombatPoint: number,
        enemyCombatPoint: number,
        maxRangedSupportPerTarget: number,
        hasFullStrengthRangedHardCounter: boolean,
        cpStrategyState: CPStrategyState,
        decisionAccuracy: number
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
                    maxRangedSupportPerTarget,
                    hasFullStrengthRangedHardCounter,
                    decisionAccuracy
                )
            ) {
                return -Infinity;
            }
        } else if (targetPriority <= 0) {
            return -Infinity;
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
            const supportPriority =
                targetPriority > 0
                    ? targetPriority
                    : this.getRangedSupportTargetPriority(
                        target
                    );

            if (supportPriority <= 0) {
                return -Infinity;
            }

            return this.scoreSnapshotRangedSupportEntry(
                entry,
                target,
                supportPriority,
                candidatePower,
                hardCounter,
                cpStrategyState,
                decisionAccuracy
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
            targetLivePowerRatio > 0.35 &&
            !this.isCavalrySpearRisk(
                entry,
                target
            )
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
            cpRatio >=
            this.getComfortableAffordRatio(cpStrategyState);
        const isHoldingSpawn =
            cpStrategyState === CPStrategyState.Efficient &&
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
        const cavalrySpearRiskPenalty =
            this.getCavalrySpearRiskPenalty(
                entry,
                target,
                decisionAccuracy
            );
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
                : this.getOvershootPenaltyScale(
                    cpStrategyState,
                    hardCounter,
                    targetUrgency
                );
        const economyPreference =
            this.getEconomyPreference(
                cpStrategyState,
                canComfortablyAfford,
                currentCombatPoint,
                enemyCombatPoint,
                cost
            );

        return targetPriority +
            fitScore +
            strongEnoughBonus +
            hardCounterBonus +
            usefulPower / cost * 24 +
            reusableEconomyScore -
            cost * economyPreference -
            overshoot * overshootPenaltyScale -
            reverseCounterPenalty -
            cavalrySpearRiskPenalty -
            holdingPenalty +
            this.getSnapshotMeleeLadderBias(
                entry,
                target,
                cpStrategyState,
                canComfortablyAfford,
                targetLivePowerRatio
            ) +
            Math.random() * 0.001;
    }

    private getEconomyPreference(
        cpStrategyState: CPStrategyState,
        canComfortablyAfford: boolean,
        currentCombatPoint: number,
        enemyCombatPoint: number,
        cost: number
    ) {
        if (cpStrategyState === CPStrategyState.Abundant) {
            return 1.5;
        }

        if (cpStrategyState === CPStrategyState.Normal) {
            return canComfortablyAfford ? 2.4 : 4.2;
        }

        if (cpStrategyState === CPStrategyState.Desperate) {
            return 0.8;
        }

        const basePreference =
            canComfortablyAfford ? 4.5 : 9.5;
        const postSpawnAdvantage =
            currentCombatPoint -
            cost -
            enemyCombatPoint;

        if (postSpawnAdvantage <= 0) {
            return basePreference;
        }

        const advantageRatio =
            Math.min(
                1,
                postSpawnAdvantage /
                    Math.max(1, enemyCombatPoint)
            );

        return Math.max(
            1.5,
            basePreference -
                advantageRatio * 3
        );
    }

    private getComfortableAffordRatio(
        cpStrategyState: CPStrategyState
    ) {
        if (cpStrategyState === CPStrategyState.Abundant) {
            return 1.15;
        }

        if (cpStrategyState === CPStrategyState.Normal) {
            return 1.25;
        }

        if (cpStrategyState === CPStrategyState.Desperate) {
            return 1.0;
        }

        return 1.7;
    }

    private getOvershootPenaltyScale(
        cpStrategyState: CPStrategyState,
        hardCounter: boolean,
        targetUrgency: number
    ) {
        if (cpStrategyState === CPStrategyState.Abundant) {
            return hardCounter ? 80 : 110;
        }

        if (cpStrategyState === CPStrategyState.Normal) {
            return hardCounter ? 110 : 150;
        }

        if (cpStrategyState === CPStrategyState.Desperate) {
            return 70;
        }

        return hardCounter
            ? targetUrgency >= 0.7
                ? 160
                : 300
            : 320;
    }

    private scoreSnapshotRangedSupportEntry(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel,
        targetPriority: number,
        candidatePower: number,
        hardCounter: boolean,
        cpStrategyState: CPStrategyState,
        decisionAccuracy: number
    ) {
        const cost =
            Math.max(1, entry.combatPointCost);
        const expectedDps =
            this.getExpectedRangedSupportDps(
                entry,
                target
            );
        const roleBonus =
            this.getRangedSupportRoleBonus(
                entry,
                target,
                hardCounter
            );

        if (!Number.isFinite(roleBonus)) {
            return -Infinity;
        }

        const accuracyScale =
            this.clamp01(decisionAccuracy);

        return (
            targetPriority * 0.75 +
            roleBonus +
            this.getRangedSupportNeedScore(target) +
            candidatePower / cost * 18 +
            expectedDps / cost * 140
        ) *
            accuracyScale -
            cost *
                this.getRangedSupportCostPenaltyScale(
                    cpStrategyState
                ) +
            Math.random() * 0.001;
    }

    private getRangedSupportRoleBonus(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel,
        hardCounter: boolean
    ) {
        const fullStrengthCounter =
            hardCounter &&
            this.isFullStrengthTarget(target);

        if (fullStrengthCounter) {
            return 620;
        }

        if (hardCounter) {
            return 430;
        }

        if (entry.family === UnitFamily.Monk) {
            const expectedTargets =
                this.getExpectedRangedSupportTargetsHit(
                    entry,
                    target
                );

            if (
                this.isMonkBlockedEnemyLaneSupportTarget(
                    target
                )
            ) {
                return 520 + expectedTargets * 95;
            }

            return this.isMonkSiegeSupportTarget(
                entry,
                target
            )
                ? 260 + expectedTargets * 65
                : 180 + expectedTargets * 35;
        }

        if (entry.family === UnitFamily.Archer) {
            return this.hasEngagedEnemyRangedInLane(
                target.visualLaneId
            )
                ? 230
                : 150;
        }

        return -Infinity;
    }

    private getRangedSupportNeedScore(
        target: BattlefieldWaveIntel
    ) {
        const coverageNeed =
            Math.max(0, 1 - target.coverageRatio);
        const frontlineSurplus =
            target.threatPower > 0
                ? target.frontlineBlockPower /
                    Math.max(1, target.threatPower)
                : 1;
        const surplusBonus =
            Math.max(0, Math.min(1, frontlineSurplus - 1)) *
            120;
        const engagedBonus =
            Math.min(3, target.engagedAllyFrontlineCount) *
            35;
        const dangerBonus =
            target.dangerousToDefend ? 120 : 0;
        const rangedThreatBonus =
            this.hasEngagedEnemyRangedInLane(
                target.visualLaneId
            )
                ? 100
                : 0;

        return coverageNeed * 260 +
            surplusBonus +
            engagedBonus +
            dangerBonus +
            rangedThreatBonus;
    }

    private getExpectedRangedSupportDps(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (!target.entry) return 0;

        const damage =
            Math.max(
                1,
                entry.damage - target.entry.defense
            );
        const counter =
            CounterSettings.instance;
        const damageMultiplier =
            counter
                ? Math.max(
                    1,
                    counter.getCounterScore(
                        entry.family,
                        target.entry.family
                    )
                )
                : 1;
        const interval =
            Math.max(
                0.1,
                (
                    Math.max(0, entry.attackIntervalMin) +
                    Math.max(0, entry.attackIntervalMax)
                ) * 0.5
            );
        const expectedTargets =
            this.getExpectedRangedSupportTargetsHit(
                entry,
                target
            );

        return Math.max(1, entry.unitCount) *
            damage *
            damageMultiplier *
            expectedTargets /
            interval;
    }

    private getExpectedRangedSupportTargetsHit(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (entry.damageRadius <= 0) {
            return 1;
        }

        const remainingTargets =
            Math.max(0, target.aliveCount - 1);
        const radiusFactor =
            Math.max(0, entry.damageRadius) * 1.35;
        const frontlineFactor =
            Math.min(3, target.engagedAllyFrontlineCount) *
            0.6;
        const packedLaneFactor =
            Math.min(2, target.sameLaneEnemyAheadCount) *
            0.35;
        const engagedFactor =
            target.hasEngaged ? 0.45 : 0;
        const blockFactor =
            target.frontlineBlockPower >=
                target.threatPower
                ? 0.45
                : 0;
        const expectedAreaTargets =
            Math.min(
                remainingTargets,
                radiusFactor +
                    frontlineFactor +
                    packedLaneFactor +
                    engagedFactor +
                    blockFactor
            );

        return Math.min(
            5,
            1 + Math.max(0, expectedAreaTargets)
        );
    }

    private getRangedSupportCostPenaltyScale(
        cpStrategyState: CPStrategyState
    ) {
        if (cpStrategyState === CPStrategyState.Abundant) {
            return 0.9;
        }

        if (cpStrategyState === CPStrategyState.Normal) {
            return 1.35;
        }

        if (cpStrategyState === CPStrategyState.Efficient) {
            return 2.1;
        }

        if (cpStrategyState === CPStrategyState.Desperate) {
            return 0.75;
        }

        return 1.6;
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
            return 1;
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
        maxRangedSupportPerTarget: number,
        hasFullStrengthRangedHardCounter: boolean,
        decisionAccuracy: number
    ) {
        if (!this.isRangedSpawnSafe(target)) {
            return false;
        }

        if (
            this.countRangedSupportForTarget(target) >=
            this.getAccuracyScaledRangedSupportLimit(
                maxRangedSupportPerTarget,
                decisionAccuracy
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

        const fullStrengthHardCounter =
            this.isHardCounterEntryForTarget(
                entry,
                target
            ) &&
            this.isFullStrengthTarget(target);

        const monkSiegeSupport =
            this.isMonkSiegeSupportTarget(entry, target);

        if (
            !this.hasFrontlineSurplusForRangedSupport(
                target
            )
        ) {
            return false;
        }

        if (fullStrengthHardCounter) {
            return true;
        }

        if (monkSiegeSupport) {
            return true;
        }

        if (!this.hasGeneralRangedSupportNeed(target)) {
            return false;
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

    private hasFrontlineSurplusForRangedSupport(
        target: BattlefieldWaveIntel
    ) {
        if (!target.entry) return false;

        if (
            !this.hasFrontlineAdvantageForRangedSupport(
                target
            )
        ) {
            return false;
        }

        const localRequiredRatio =
            Math.max(
                0.35,
                this.coverageTargetRatio * 0.45
            );
        const localRequiredPower =
            target.threatPower * localRequiredRatio;

        if (
            target.frontlineBlockPower <
            localRequiredPower
        ) {
            return false;
        }

        if (this.enemyFrontlineThreatPower <= 0) {
            return true;
        }

        const globalRequiredRatio =
            Math.max(
                0.3,
                this.coverageTargetRatio * 0.35
            );
        const globalRequiredPower =
            this.enemyFrontlineThreatPower *
            globalRequiredRatio;

        return this.allyFrontlinePower >=
            globalRequiredPower;
    }

    private hasFrontlineAdvantageForRangedSupport(
        target: BattlefieldWaveIntel
    ) {
        if (target.threatPower <= 0) {
            return true;
        }

        const frontlineRatio =
            target.frontlineBlockPower /
            Math.max(1, target.threatPower);

        if (frontlineRatio < 0.8) {
            return false;
        }

        if (
            target.frontlineHealthRatio < 0.45 &&
            target.coverageRatio < 1
        ) {
            return false;
        }

        return target.coverageRatio >= 0.85 ||
            frontlineRatio >= 1;
    }

    private isMonkSiegeSupportTarget(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (entry.family !== UnitFamily.Monk) {
            return false;
        }
        if (!target.entry || !target.hasEngaged) {
            return false;
        }
        if (!this.isFrontlineFamily(target.entry.family)) {
            return false;
        }

        return target.engagedAllyFrontlineCount >=
            this.getRequiredFrontlineCountForRangedSupport(
                entry,
                target
            );
    }

    private isMonkBlockedEnemyLaneSupportTarget(
        target: BattlefieldWaveIntel
    ) {
        if (!target.entry) return false;
        if (!target.hasEngaged) return false;
        if (!this.isFrontlineFamily(target.entry.family)) {
            return false;
        }
        if (target.engagedAllyFrontlineCount < 1) {
            return false;
        }
        if (target.sameLaneEnemyAheadCount < 1) {
            return false;
        }

        return this.hasFrontlineAdvantageForRangedSupport(
            target
        );
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
        cpStrategyState: CPStrategyState,
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
            if (cpStrategyState === CPStrategyState.Normal) {
                return 720 * conditionScale;
            }

            if (cpStrategyState === CPStrategyState.Abundant) {
                return 620 * conditionScale;
            }

            if (
                costDelta > 8 &&
                !canComfortablyAfford
            ) {
                return 50 * conditionScale;
            }

            return 170 * conditionScale;
        }

        if (rankDelta === 0) {
            if (cpStrategyState === CPStrategyState.Desperate) {
                return 220 * conditionScale;
            }

            return 55 * conditionScale;
        }

        if (rankDelta > 1) {
            if (cpStrategyState === CPStrategyState.Abundant) {
                return rankDelta === 2
                    ? 440 * conditionScale
                    : 180 * conditionScale;
            }

            if (cpStrategyState === CPStrategyState.Normal) {
                return -120 * conditionScale;
            }

            return canComfortablyAfford
                ? 25 * conditionScale
                : -110;
        }

        if (cpStrategyState === CPStrategyState.Abundant) {
            return -90 * conditionScale;
        }

        if (cpStrategyState === CPStrategyState.Normal) {
            return -180 * conditionScale;
        }

        return -50 * conditionScale;
    }

    private getCavalrySpearRiskPenalty(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel,
        decisionAccuracy: number
    ) {
        if (
            !this.isCavalrySpearRisk(
                entry,
                target
            )
        ) {
            return 0;
        }

        return this.getCavalrySpearPenaltyByAccuracy(
            decisionAccuracy
        );
    }

    private getPressureCavalrySpearLanePenalty(
        entry: UnitPrefabEntry,
        laneId: number,
        decisionAccuracy: number
    ) {
        if (entry.family !== UnitFamily.Cavalry) {
            return 0;
        }

        if (!this.hasActionableEnemySpearInLane(laneId)) {
            return 0;
        }

        return this.getCavalrySpearPenaltyByAccuracy(
            decisionAccuracy
        );
    }

    private getCavalrySpearPenaltyByAccuracy(
        decisionAccuracy: number
    ) {
        const accuracy =
            this.clamp01(decisionAccuracy);

        return 6000 + accuracy * 18000;
    }

    private isCavalrySpearRisk(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (entry.family !== UnitFamily.Cavalry) {
            return false;
        }

        if (
            target.entry &&
            target.entry.family === UnitFamily.Spear
        ) {
            return true;
        }

        if (target.hasEnemySpearBlockerFromSpawn) {
            return true;
        }

        return this.hasActionableEnemySpearInLane(
            target.visualLaneId
        );
    }

    private hasActionableEnemySpearInLane(
        laneId: number
    ) {
        if (laneId < 0) return false;

        for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];

            if (!enemy.entry) continue;
            if (enemy.visualLaneId !== laneId) continue;
            if (enemy.entry.family !== UnitFamily.Spear) {
                continue;
            }
            if (!this.isActionableTarget(enemy)) {
                continue;
            }

            return true;
        }

        return false;
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

    private getAccuracyScaledRangedSupportLimit(
        maxRangedSupportPerTarget: number,
        decisionAccuracy: number
    ) {
        const maxLimit =
            Math.max(
                0,
                Math.floor(maxRangedSupportPerTarget)
            );
        const accuracy =
            this.clamp01(decisionAccuracy);

        if (maxLimit <= 0 || accuracy <= 0) {
            return 0;
        }

        return Math.max(
            1,
            Math.ceil(maxLimit * accuracy)
        );
    }

    private hasGeneralRangedSupportNeed(
        target: BattlefieldWaveIntel
    ) {
        if (!this.isRangedSpawnSafe(target)) {
            return false;
        }

        if (
            this.hasEngagedEnemyRangedInLane(
                target.visualLaneId
            )
        ) {
            return true;
        }

        if (target.hasEngaged) {
            return true;
        }

        if (
            target.sameLaneEnemyAheadCount > 0 &&
            target.allyFrontlineCount > 0
        ) {
            return true;
        }

        return target.coverageRatio < 1.1;
    }

    private hasEngagedEnemyRangedInLane(
        laneId: number
    ) {
        if (laneId < 0) return false;

        for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];

            if (!enemy.entry) continue;
            if (enemy.visualLaneId !== laneId) continue;
            if (!enemy.hasEngaged) continue;
            if (!this.isRangedFamily(enemy.entry.family)) {
                continue;
            }

            return true;
        }

        return false;
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

    private getFullMatchupPowerRatio(
        entry: UnitPrefabEntry,
        target: BattlefieldWaveIntel
    ) {
        if (!target.entry) return 1;

        const candidatePower =
            this.getEntryBasePower(
                entry,
                Math.max(1, Math.floor(entry.unitCount)),
                1,
                Math.max(1, target.entry.unitCount)
            ) *
            this.getMatchupFactor(
                entry,
                target
            );
        const targetPower =
            this.getEntryBasePower(
                target.entry,
                Math.max(1, Math.floor(target.entry.unitCount)),
                1,
                Math.max(1, entry.unitCount)
            ) *
            (
                this.isTargetHardCounterForEntry(
                    entry,
                    target
                )
                    ? this.getTargetMatchupFactor(
                        entry,
                        target
                    )
                    : 1
            );

        return candidatePower /
            Math.max(1, targetPower);
    }

    private getTargetMatchupFactor(
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
                target.entry.family,
                entry.family
            );

        if (counterScore > 1.0001) {
            return counterScore;
        }

        return 1;
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
        this.allyFrontlinePower = 0;
        this.enemyFrontlineThreatPower = 0;

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

            if (this.isFrontlineFamily(entry.family)) {
                if (wave!.team === team) {
                    this.allyFrontlinePower +=
                        this.getFrontlineHoldPower(intel);
                } else if (wave!.team === enemyTeam) {
                    this.enemyFrontlineThreatPower +=
                        Math.max(
                            intel.basePower,
                            intel.threatPower
                        );
                }
            }

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

        if (
            directLane === blockedMeleeLaneId &&
            !this.shouldBypassBlockedMeleeLane(target)
        ) {
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

    private shouldBypassBlockedMeleeLane(
        target: BattlefieldWaveIntel | null
    ) {
        return !!target &&
            (
                target.hasStrugglingAlly ||
                target.dangerousToDefend
            );
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

    private getPressureEntryScore(
        power: number,
        cost: number,
        rank: number,
        speed: number,
        cpStrategyState: CPStrategyState
    ) {
        if (cpStrategyState === CPStrategyState.Abundant) {
            return power * 0.22 +
                rank * 110 +
                speed * 8 -
                cost * 0.45;
        }

        if (cpStrategyState === CPStrategyState.Desperate) {
            return power * 0.25 +
                rank * 55 +
                speed * 4 -
                cost * 0.25;
        }

        if (cpStrategyState === CPStrategyState.Normal) {
            return power / cost * 12 +
                Math.sqrt(power) * 3 +
                rank * 35 -
                cost * 1.1 +
                speed;
        }

        return power / cost * 18 +
            Math.sqrt(power) * 4 -
            cost * 2.2 +
            speed;
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
                    this.getFrontlineHoldPower(ally);

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

        target.coveragePower +=
            this.getReservedCoveragePower(
                gameManager,
                target
            );

        target.coverageRatio =
            target.threatPower > 0
                ? target.coveragePower /
                    target.threatPower
                : 1;
    }

    private getFrontlineHoldPower(
        intel: BattlefieldWaveIntel
    ) {
        return intel.basePower *
            (0.65 + intel.healthRatio * 0.7);
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

    private getReservedCoveragePower(
        gameManager: GameManager,
        target: BattlefieldWaveIntel
    ) {
        if (!target.wave) return 0;

        let reservedPower = 0;
        let writeIndex = 0;

        for (let i = 0; i < this.responseReservations.length; i++) {
            const reservation =
                this.responseReservations[i];

            if (
                this.isResponseReservationActive(
                    gameManager,
                    reservation
                )
            ) {
                this.responseReservations[writeIndex++] =
                    reservation;

                if (
                    reservation.targetWaveId ===
                    target.wave.id
                ) {
                    reservedPower +=
                        reservation.coveragePower;
                }
            }
        }

        this.responseReservations.length = writeIndex;

        return reservedPower;
    }

    private isResponseReservationActive(
        gameManager: GameManager,
        reservation: BattleResponseReservation
    ) {
        if (
            gameManager.frame - reservation.frame >
            this.responseReservationFrames
        ) {
            return false;
        }

        const targetWave =
            this.findWaveById(
                gameManager,
                reservation.targetWaveId
            );
        const responseWave =
            this.findWaveById(
                gameManager,
                reservation.responseWaveId
            );

        if (!this.isValidWave(targetWave)) return false;
        if (!this.isValidWave(responseWave)) return false;
        if (
            responseWave!.hasEngagedRuntime(
                gameManager.frame
            )
        ) {
            return false;
        }

        return true;
    }

    private findWaveById(
        gameManager: GameManager,
        waveId: number
    ) {
        for (let i = 0; i < gameManager.waves.length; i++) {
            const wave = gameManager.waves[i];

            if (!wave) continue;
            if (wave.id === waveId) {
                return wave;
            }
        }

        return null;
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
        _targetAliveCount: number
    ) {
        const count =
            Math.max(0, aliveCount);
        const hitDamage =
            Math.max(1, entry.damage);
        const durability =
            Math.max(1, entry.health) *
            count *
            Math.max(0, healthRatio) *
            (1 + Math.max(0, entry.defense) * 0.045);

        return Math.sqrt(
            Math.max(1, count * hitDamage) *
            Math.max(1, durability)
        );
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
            target.hasEnemySpearBlockerFromSpawn
        ) {
            return false;
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

    private clamp01(value: number) {
        return Math.max(
            0,
            Math.min(1, value)
        );
    }
}
