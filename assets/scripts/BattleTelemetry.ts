import { UnitFamily, unitFamilyToName } from './BattleTypes';

type TeamIndex = 0 | 1;

export interface BattleTelemetryUnitSnapshot {
    team: number;
    name: string;
    family: number;
    familyName: string;
    tier: number;
    unitCount: number;
    cost: number;
    health: number;
    attack: number;
    damageRadius: number;
    defense: number;
    speed: number;
    range: number;
    attackIntervalMin: number;
    attackIntervalMax: number;
}

export interface BattleTelemetryCounterRuleSnapshot {
    attackerFamily: number;
    attackerFamilyName: string;
    defenderFamily: number;
    defenderFamilyName: string;
    damageMultiplier: number;
}

export interface BattleTelemetryStartConfig {
    startedAt: string;
    battleBounds: {
        minX: number;
        maxX: number;
        minZ: number;
        maxZ: number;
    };
    laneCount: number;
    initialCombatPoint: number[];
    unitStats: BattleTelemetryUnitSnapshot[];
    counterRules: BattleTelemetryCounterRuleSnapshot[];
}

export interface BattleTelemetryWaveSpawnDecision {
    team: number;
    waveId: number;
    frame: number;
    time: number;
    reason: string;
    aggressiveForward: boolean;
    laneId: number;
    unitName: string;
    family: number;
    familyName: string;
    tier: number;
    intendedUnitName?: string;
    intendedFamily?: number;
    intendedFamilyName?: string;
    targetWaveId: number;
    targetLaneId: number;
    targetFamily: number;
    targetFamilyName: string;
    responseTier: string;
    allyBlockersFromSpawn: number;
    allyCountInLane: number;
    firstEnemyFromSpawn: boolean;
    coverage: number;
    uncovered: number;
    threatScore: number;
    targetWaveSpawnFrame?: number;
    responseDelayFrames?: number;
    responseDelaySeconds?: number;
    decisionPath?: string;
    decisionAccuracy?: number;
    accuracyRoll?: number;
    accurateDecision?: boolean;
    deliberateMistakeRoll?: number;
    deliberateMistake?: boolean;
    aggressiveForwardChance?: number;
    aggressiveRoll?: number;
    aggressiveSource?: string;
    flankStrikeRatio?: number;
    flankStrikeRoll?: number;
    aggressiveFastestEntryChance?: number;
    aggressiveFastestRoll?: number;
    aggressiveUseFastest?: boolean;
    fastReactCounterChance?: number;
    fastReactRoll?: number;
    aliveWaveCountAtDecision?: number;
    affordableEntryCount?: number;
    activeEnemyIntelCount?: number;
    combatPointAtDecision?: number;
    combatPointAdvantageAtDecision?: number;
    enemyCombatPointAtDecision?: number;
    postSpawnCombatPoint?: number;
    postSpawnCombatPointAdvantage?: number;
    combatPointCostRatioAtDecision?: number;
    canComfortablyAffordAtDecision?: boolean;
}

export interface BattleTelemetryWaveSnapshot {
    waveId: number;
    team: number;
    laneId: number;
    unitName: string;
    family: number;
    familyName: string;
    tier: number;
    totalCount: number;
    aliveCount: number;
    busyCount: number;
    targetCount: number;
    forwardCount: number;
    healthRatio: number;
    forwardMode: boolean;
    aggressiveForward: boolean;
}

export interface BattleTelemetryTeamSnapshot {
    team: number;
    combatPoint: number;
    aliveCount: number;
    waveCount: number;
    heroHealthRatio: number;
    killCount: number;
    counterKillCount: number;
    totalDamage: number;
    totalHeroDamage: number;
    waves: BattleTelemetryWaveSnapshot[];
}

export interface BattleTelemetryBattleSnapshot {
    frame: number;
    time: number;
    teams: BattleTelemetryTeamSnapshot[];
}

export interface BattleTelemetryDiagnosticEvent {
    type: string;
    frame: number;
    time: number;
    team?: number;
    waveId?: number;
    laneId?: number;
    unitName?: string;
    familyName?: string;
    intendedUnitName?: string;
    intendedFamilyName?: string;
    targetWaveId?: number;
    targetTeam?: number;
    targetLaneId?: number;
    targetFamilyName?: string;
    reason?: string;
    aggressiveForward?: boolean;
    combatPointAdvantageAtDecision?: number;
    postSpawnCombatPointAdvantage?: number;
    combatPointCostRatioAtDecision?: number;
    canComfortablyAffordAtDecision?: boolean;
    damage?: number;
    actualDamage?: number;
    amount?: number;
    isCounter?: boolean;
    isArea?: boolean;
    victimTeam?: number;
    victimWaveId?: number;
    victimUnitName?: string;
    victimFamilyName?: string;
}

interface UnitSpawnInfo {
    key: string;
    team: number;
    name: string;
    family: number;
    familyName: string;
    tier: number;
    waveId: number;
    spawnFrame: number;
    spawnTime: number;
}

class UnitTypeTelemetryStats {
    key = '';
    team = 0;
    name = '';
    family = 0;
    familyName = '';
    tier = 1;
    spawnedCount = 0;
    deathCount = 0;
    aliveAtEnd = 0;
    totalLifetime = 0;
    averageLifetime = 0;
    totalDamageDealt = 0;
    totalDamageReceived = 0;
    totalAoeDamageDealt = 0;
    totalAoeDamageReceived = 0;
    totalCounterDamageDealt = 0;
    totalCounterDamageReceived = 0;
    totalHeroDamageDealt = 0;
    totalDamageReceivedFromHero = 0;
    waveSpawnCount = 0;
    totalCombatPointSpent = 0;
    totalCombatPointEarned = 0;
    netCombatPoint = 0;
    damagePerCombatPointSpent = 0;
    killsPerCombatPointSpent = 0;
    heroDamagePerCombatPointSpent = 0;
    lifetimePerCombatPointSpent = 0;
    totalKills = 0;
    totalDeaths = 0;
    totalCounterKills = 0;
    totalDeathsToCounter = 0;
    killedByUnitType: Record<string, number> = {};
    killedUnitType: Record<string, number> = {};
    damageDealtToUnitType: Record<string, number> = {};
    damageReceivedFromUnitType: Record<string, number> = {};
}

class WaveSpawnDecisionStats {
    key = '';
    team = 0;
    reason = '';
    aggressiveForward = false;
    family = 0;
    familyName = '';
    tier = 1;
    unitName = '';
    count = 0;
    targetFamilies: Record<string, number> = {};
}

export class BattleTelemetry {
    private enabled = false;
    private started = false;
    private ended = false;
    private startConfig: BattleTelemetryStartConfig | null = null;
    private unitStats: Map<string, UnitTypeTelemetryStats> = new Map();
    private waveSpawnDecisionStats:
        Map<string, WaveSpawnDecisionStats> = new Map();
    private waveSpawns: BattleTelemetryWaveSpawnDecision[] = [];
    private snapshots: BattleTelemetryBattleSnapshot[] = [];
    private finalSnapshot: BattleTelemetryBattleSnapshot | null = null;
    private diagnosticEvents: BattleTelemetryDiagnosticEvent[] = [];
    private waveSpawnFrameById: Map<number, number> = new Map();
    private waveSpawnTimeById: Map<number, number> = new Map();
    private spawnInfoByUnit: WeakMap<object, UnitSpawnInfo> = new WeakMap();
    private activeSpawnInfos: Set<UnitSpawnInfo> = new Set();
    private totalDamage = [0, 0];
    private totalHeroDamage = [0, 0];
    private totalKills = [0, 0];
    private totalDeaths = [0, 0];
    private totalCounterKills = [0, 0];
    private firstDamageByFrameTeam = [0, 0];
    private firstKillByFrameTeam = [0, 0];
    private firstHeroDamageByFrameTeam = [0, 0];
    private lastDamageFrame = -1;
    private lastKillFrame = -1;
    private lastHeroDamageFrame = -1;
    private maxSnapshots = 240;
    private maxDiagnosticEvents = 3000;
    private droppedDiagnosticEventCount = 0;
    private nextSpawnId = 1;

    reset(enabled: boolean, config: BattleTelemetryStartConfig) {
        this.enabled = enabled;
        this.started = enabled;
        this.ended = false;
        this.startConfig = config;
        this.unitStats.clear();
        this.waveSpawnDecisionStats.clear();
        this.waveSpawns.length = 0;
        this.snapshots.length = 0;
        this.finalSnapshot = null;
        this.diagnosticEvents.length = 0;
        this.waveSpawnFrameById.clear();
        this.waveSpawnTimeById.clear();
        this.spawnInfoByUnit = new WeakMap();
        this.activeSpawnInfos.clear();
        this.totalDamage[0] = 0;
        this.totalDamage[1] = 0;
        this.totalHeroDamage[0] = 0;
        this.totalHeroDamage[1] = 0;
        this.totalKills[0] = 0;
        this.totalKills[1] = 0;
        this.totalDeaths[0] = 0;
        this.totalDeaths[1] = 0;
        this.totalCounterKills[0] = 0;
        this.totalCounterKills[1] = 0;
        this.firstDamageByFrameTeam[0] = 0;
        this.firstDamageByFrameTeam[1] = 0;
        this.firstKillByFrameTeam[0] = 0;
        this.firstKillByFrameTeam[1] = 0;
        this.firstHeroDamageByFrameTeam[0] = 0;
        this.firstHeroDamageByFrameTeam[1] = 0;
        this.lastDamageFrame = -1;
        this.lastKillFrame = -1;
        this.lastHeroDamageFrame = -1;
        this.droppedDiagnosticEventCount = 0;
        this.nextSpawnId = 1;
    }

    configureDiagnostics(
        maxSnapshots: number,
        maxDiagnosticEvents: number
    ) {
        this.maxSnapshots = Math.max(
            0,
            Math.floor(maxSnapshots)
        );
        this.maxDiagnosticEvents = Math.max(
            0,
            Math.floor(maxDiagnosticEvents)
        );
    }

    isEnabled() {
        return this.enabled && this.started && !this.ended;
    }

    hasEnded() {
        return this.ended;
    }

    getTotalDamage(team: number) {
        return this.totalDamage[this.clampTeam(team)];
    }

    getTotalHeroDamage(team: number) {
        return this.totalHeroDamage[this.clampTeam(team)];
    }

    recordSpawn(
        unit: object | null,
        team: number,
        unitName: string,
        family: UnitFamily,
        tier: number,
        waveId: number,
        frame: number,
        time: number
    ) {
        if (!this.isEnabled()) return;
        if (!unit) return;

        const key = this.buildTypeKey(
            team,
            unitName,
            family,
            tier
        );
        const familyName = unitFamilyToName(family);
        const info: UnitSpawnInfo = {
            key,
            team,
            name: unitName,
            family,
            familyName,
            tier,
            waveId,
            spawnFrame: frame,
            spawnTime: time,
        };

        this.spawnInfoByUnit.set(unit, info);
        this.activeSpawnInfos.add(info);

        const stats = this.getOrCreateStats(
            team,
            unitName,
            family,
            tier
        );

        stats.spawnedCount++;
    }

    recordWaveSpawnEvent(
        event: BattleTelemetryDiagnosticEvent
    ) {
        if (!this.isEnabled()) return;
        if (!event) return;

        const waveId =
            Number.isFinite(event.waveId)
                ? Math.floor(event.waveId!)
                : -1;

        if (waveId >= 0) {
            this.waveSpawnFrameById.set(
                waveId,
                Math.floor(event.frame || 0)
            );
            this.waveSpawnTimeById.set(
                waveId,
                Number.isFinite(event.time)
                    ? event.time
                    : 0
            );
        }

        this.pushDiagnosticEvent({
            ...event,
            type: event.type || 'wave-spawn',
        });
    }

    recordCombatPointSpent(
        team: number,
        unitName: string,
        family: UnitFamily,
        tier: number,
        amount: number,
        waveId: number,
        frame: number,
        time: number
    ) {
        if (!this.isEnabled()) return;

        const spent =
            Math.max(
                0,
                Number.isFinite(amount) ? amount : 0
            );

        if (spent <= 0) return;

        const stats =
            this.getOrCreateStats(
                team,
                unitName,
                family,
                tier
            );

        stats.waveSpawnCount++;
        stats.totalCombatPointSpent += spent;

        this.pushDiagnosticEvent({
            type: 'cp-spent',
            frame,
            time,
            team: this.clampTeam(team),
            waveId,
            unitName: unitName || 'unknown',
            familyName: unitFamilyToName(family),
            amount: spent,
        });
    }

    recordCombatPointEarned(
        killer: any,
        victim: any,
        amount: number,
        isCounterKill: boolean,
        frame: number,
        time: number
    ) {
        if (!this.isEnabled()) return;
        if (!killer || !killer.props) return;

        const earned =
            Math.max(
                0,
                Number.isFinite(amount) ? amount : 0
            );

        if (earned <= 0) return;

        const killerStats =
            this.getOrCreateStatsForUnit(killer);

        killerStats.totalCombatPointEarned += earned;

        this.pushDiagnosticEvent({
            type: 'cp-earned',
            frame,
            time,
            team: this.clampTeam(killer.team),
            waveId: this.getUnitWaveId(killer),
            unitName: killer.unitTypeName || 'unknown',
            familyName: killerStats.familyName,
            victimTeam:
                victim && Number.isFinite(victim.team)
                    ? this.clampTeam(victim.team)
                    : undefined,
            victimWaveId: this.getUnitWaveId(victim),
            victimUnitName:
                victim && victim.unitTypeName
                    ? victim.unitTypeName
                    : '',
            victimFamilyName:
                victim && victim.props
                    ? unitFamilyToName(victim.props.family)
                    : '',
            amount: earned,
            isCounter: isCounterKill,
        });
    }

    recordSnapshot(snapshot: BattleTelemetryBattleSnapshot) {
        if (!this.isEnabled()) return;
        if (!snapshot) return;
        if (this.maxSnapshots <= 0) return;
        if (this.snapshots.length >= this.maxSnapshots) return;

        this.snapshots.push(snapshot);
    }

    recordFinalSnapshot(snapshot: BattleTelemetryBattleSnapshot) {
        if (!this.isEnabled()) return;
        if (!snapshot) return;

        this.finalSnapshot = snapshot;
    }

    recordWaveSpawnDecision(
        decision: BattleTelemetryWaveSpawnDecision
    ) {
        if (!this.isEnabled()) return;
        if (!decision) return;

        const normalized =
            this.normalizeWaveSpawnDecision(decision);

        const targetSpawnFrame =
            this.waveSpawnFrameById.get(
                normalized.targetWaveId
            );
        const targetSpawnTime =
            this.waveSpawnTimeById.get(
                normalized.targetWaveId
            );

        if (targetSpawnFrame !== undefined) {
            normalized.targetWaveSpawnFrame =
                targetSpawnFrame;
            normalized.responseDelayFrames =
                normalized.frame - targetSpawnFrame;
        }

        if (targetSpawnTime !== undefined) {
            normalized.responseDelaySeconds =
                normalized.time - targetSpawnTime;
        }

        this.waveSpawns.push(normalized);
        this.pushDiagnosticEvent({
            type: 'spawn-decision',
            frame: normalized.frame,
            time: normalized.time,
            team: normalized.team,
            waveId: normalized.waveId,
            laneId: normalized.laneId,
            unitName: normalized.unitName,
            familyName: normalized.familyName,
            intendedUnitName: normalized.intendedUnitName,
            intendedFamilyName: normalized.intendedFamilyName,
            targetWaveId: normalized.targetWaveId,
            targetLaneId: normalized.targetLaneId,
            targetFamilyName: normalized.targetFamilyName,
            reason: normalized.reason,
            aggressiveForward: normalized.aggressiveForward,
            combatPointAdvantageAtDecision:
                normalized.combatPointAdvantageAtDecision,
            postSpawnCombatPointAdvantage:
                normalized.postSpawnCombatPointAdvantage,
            combatPointCostRatioAtDecision:
                normalized.combatPointCostRatioAtDecision,
            canComfortablyAffordAtDecision:
                normalized.canComfortablyAffordAtDecision,
        });

        const key =
            `T${normalized.team}:` +
            `${normalized.reason}:` +
            `${normalized.aggressiveForward ? 'aggressive' : 'normal'}:` +
            `${normalized.familyName}:` +
            `t${normalized.tier}:` +
            `${normalized.unitName}`;

        let stats =
            this.waveSpawnDecisionStats.get(key);

        if (!stats) {
            stats = new WaveSpawnDecisionStats();
            stats.key = key;
            stats.team = normalized.team;
            stats.reason = normalized.reason;
            stats.aggressiveForward =
                normalized.aggressiveForward;
            stats.family = normalized.family;
            stats.familyName = normalized.familyName;
            stats.tier = normalized.tier;
            stats.unitName = normalized.unitName;

            this.waveSpawnDecisionStats.set(key, stats);
        }

        stats.count++;

        if (normalized.targetFamilyName) {
            this.addRecordValue(
                stats.targetFamilies,
                normalized.targetFamilyName,
                1
            );
        }
    }

    recordDamage(
        attacker: any,
        victim: any,
        damage: number,
        actualDamage: number,
        isCounterDamage: boolean,
        isAreaDamage: boolean = false,
        frame: number = -1,
        time: number = 0
    ) {
        if (!this.isEnabled()) return;
        if (!attacker || !victim) return;
        if (!attacker.props || !victim.props) return;

        const dealt =
            Math.max(
                0,
                Number.isFinite(actualDamage)
                    ? actualDamage
                    : damage
            );

        if (dealt <= 0) return;

        const attackerStats =
            this.getOrCreateStatsForUnit(attacker);
        const victimStats =
            this.getOrCreateStatsForUnit(victim);

        attackerStats.totalDamageDealt += dealt;
        victimStats.totalDamageReceived += dealt;

        if (isAreaDamage) {
            attackerStats.totalAoeDamageDealt += dealt;
            victimStats.totalAoeDamageReceived += dealt;
        }

        if (isCounterDamage) {
            attackerStats.totalCounterDamageDealt += dealt;
            victimStats.totalCounterDamageReceived += dealt;
        }

        this.totalDamage[this.clampTeam(attacker.team)] += dealt;

        if (victim.isHero) {
            attackerStats.totalHeroDamageDealt += dealt;
            this.totalHeroDamage[this.clampTeam(attacker.team)] += dealt;
        }

        if (attacker.isHero) {
            victimStats.totalDamageReceivedFromHero += dealt;
        }

        this.addRecordValue(
            attackerStats.damageDealtToUnitType,
            victimStats.key,
            dealt
        );
        this.addRecordValue(
            victimStats.damageReceivedFromUnitType,
            attackerStats.key,
            dealt
        );

        this.recordDamageOrder(
            this.clampTeam(attacker.team),
            frame,
            victim.isHero
        );

        if (victim.isHero || isAreaDamage) {
            this.pushDiagnosticEvent({
                type: victim.isHero
                    ? 'hero-damage'
                    : 'area-damage',
                frame,
                time,
                team: this.clampTeam(attacker.team),
                waveId: this.getUnitWaveId(attacker),
                unitName: attacker.unitTypeName || 'unknown',
                familyName: attackerStats.familyName,
                damage,
                actualDamage: dealt,
                isCounter: isCounterDamage,
                isArea: isAreaDamage,
                victimTeam: this.clampTeam(victim.team),
                victimWaveId: this.getUnitWaveId(victim),
                victimUnitName: victim.unitTypeName || 'unknown',
                victimFamilyName: victimStats.familyName,
            });
        }
    }

    recordKill(
        killer: any,
        victim: any,
        isCounterKill: boolean,
        frame: number = -1,
        time: number = 0
    ) {
        if (!this.isEnabled()) return;
        if (!killer || !victim) return;
        if (!killer.props || !victim.props) return;

        const killerStats =
            this.getOrCreateStatsForUnit(killer);
        const victimStats =
            this.getOrCreateStatsForUnit(victim);

        killerStats.totalKills++;
        victimStats.totalDeaths++;
        this.totalKills[this.clampTeam(killer.team)]++;

        if (isCounterKill) {
            killerStats.totalCounterKills++;
            victimStats.totalDeathsToCounter++;
            this.totalCounterKills[this.clampTeam(killer.team)]++;
        }

        this.addRecordValue(
            killerStats.killedUnitType,
            victimStats.key,
            1
        );
        this.addRecordValue(
            victimStats.killedByUnitType,
            killerStats.key,
            1
        );

        this.recordFirstTeamInFrame(
            this.firstKillByFrameTeam,
            this.clampTeam(killer.team),
            frame,
            'kill'
        );

        this.pushDiagnosticEvent({
            type: victim.isHero ? 'hero-kill' : 'kill',
            frame,
            time,
            team: this.clampTeam(killer.team),
            waveId: this.getUnitWaveId(killer),
            unitName: killer.unitTypeName || 'unknown',
            familyName: killerStats.familyName,
            isCounter: isCounterKill,
            victimTeam: this.clampTeam(victim.team),
            victimWaveId: this.getUnitWaveId(victim),
            victimUnitName: victim.unitTypeName || 'unknown',
            victimFamilyName: victimStats.familyName,
        });
    }

    recordDespawn(
        unit: any,
        frame: number,
        time: number
    ) {
        if (!this.isEnabled()) return;
        if (!unit || !unit.props) return;

        const stats =
            this.getOrCreateStatsForUnit(unit);
        const spawnInfo =
            this.spawnInfoByUnit.get(unit);

        stats.deathCount++;
        this.totalDeaths[this.clampTeam(unit.team)]++;

        if (spawnInfo) {
            stats.totalLifetime += Math.max(
                0,
                time - spawnInfo.spawnTime
            );
            this.activeSpawnInfos.delete(spawnInfo);
        }
    }

    finish(
        winnerTeam: number,
        loserTeam: number,
        reason: string,
        frame: number,
        time: number,
        combatPoint: number[],
        aliveCount: number[],
        deathCount: number[],
        killCount: number[],
        counterKillCount: number[]
    ) {
        if (!this.enabled || !this.started) return null;
        if (this.ended) return null;

        this.ended = true;

        this.activeSpawnInfos.forEach((info) => {
            const stats =
                this.unitStats.get(info.key);

            if (!stats) return;

            stats.aliveAtEnd++;
            stats.totalLifetime += Math.max(
                0,
                time - info.spawnTime
            );
        });

        const unitTypes =
            Array.from(this.unitStats.values())
                .map((stats) => {
                    stats.averageLifetime =
                        stats.spawnedCount > 0
                            ? stats.totalLifetime /
                            stats.spawnedCount
                            : 0;
                    stats.netCombatPoint =
                        stats.totalCombatPointEarned -
                        stats.totalCombatPointSpent;

                    const spent =
                        Math.max(
                            0.0001,
                            stats.totalCombatPointSpent
                        );

                    stats.damagePerCombatPointSpent =
                        stats.totalDamageDealt / spent;
                    stats.killsPerCombatPointSpent =
                        stats.totalKills / spent;
                    stats.heroDamagePerCombatPointSpent =
                        stats.totalHeroDamageDealt / spent;
                    stats.lifetimePerCombatPointSpent =
                        stats.totalLifetime / spent;

                    return stats;
                })
                .sort((a, b) =>
                    a.team - b.team ||
                    a.family - b.family ||
                    a.tier - b.tier ||
                    a.name.localeCompare(b.name)
                );
        const spawnDecisionStats =
            Array.from(this.waveSpawnDecisionStats.values())
                .sort((a, b) =>
                    a.team - b.team ||
                    a.reason.localeCompare(b.reason) ||
                    Number(a.aggressiveForward) -
                        Number(b.aggressiveForward) ||
                    a.family - b.family ||
                    a.unitName.localeCompare(b.unitName)
                );

        return {
            version: 1,
            startedAt: this.startConfig
                ? this.startConfig.startedAt
                : '',
            endedAt: new Date().toISOString(),
            durationSeconds: time,
            frame,
            result: {
                winnerTeam,
                loserTeam,
                reason,
            },
            teams: [
                {
                    team: 0,
                    combatPoint: combatPoint[0] || 0,
                    aliveCount: aliveCount[0] || 0,
                    deathCount: deathCount[0] || 0,
                    killCount: killCount[0] || 0,
                    counterKillCount: counterKillCount[0] || 0,
                    totalDamage: this.totalDamage[0],
                    totalHeroDamage:
                        this.totalHeroDamage[0],
                    telemetryKills: this.totalKills[0],
                    telemetryDeaths: this.totalDeaths[0],
                    telemetryCounterKills:
                        this.totalCounterKills[0],
                },
                {
                    team: 1,
                    combatPoint: combatPoint[1] || 0,
                    aliveCount: aliveCount[1] || 0,
                    deathCount: deathCount[1] || 0,
                    killCount: killCount[1] || 0,
                    counterKillCount: counterKillCount[1] || 0,
                    totalDamage: this.totalDamage[1],
                    totalHeroDamage:
                        this.totalHeroDamage[1],
                    telemetryKills: this.totalKills[1],
                    telemetryDeaths: this.totalDeaths[1],
                    telemetryCounterKills:
                        this.totalCounterKills[1],
                },
            ],
            config: this.startConfig,
            waveSpawns: this.waveSpawns.slice(),
            spawnDecisionStats,
            diagnostics: {
                limits: {
                    maxSnapshots: this.maxSnapshots,
                    maxDiagnosticEvents:
                        this.maxDiagnosticEvents,
                    droppedDiagnosticEventCount:
                        this.droppedDiagnosticEventCount,
                },
                frameOrderStats: {
                    firstDamageByFrameTeam:
                        this.firstDamageByFrameTeam.slice(),
                    firstKillByFrameTeam:
                        this.firstKillByFrameTeam.slice(),
                    firstHeroDamageByFrameTeam:
                        this.firstHeroDamageByFrameTeam.slice(),
                },
                snapshots: this.snapshots.slice(),
                finalSnapshot: this.finalSnapshot,
                events: this.diagnosticEvents.slice(),
            },
            unitTypes,
        };
    }

    exportReport(
        report: any,
        filePrefix: string,
        download: boolean,
        logToConsole: boolean
    ) {
        if (!report) return;

        const json =
            JSON.stringify(report, null, 2);

        const globalObject =
            globalThis as any;
        globalObject.__battleTelemetryReport = report;

        if (logToConsole) {
            console.log('[BattleTelemetry]', report);
        } else {
            console.log(
                `[BattleTelemetry] report ready: ` +
                `${json.length} bytes. ` +
                `window.__battleTelemetryReport is available.`
            );
        }

        if (!download) return;
        if (typeof document === 'undefined') return;
        if (typeof Blob === 'undefined') return;
        if (typeof URL === 'undefined') return;

        try {
            const blob = new Blob(
                [json],
                { type: 'application/json' }
            );
            const url =
                URL.createObjectURL(blob);
            const link =
                document.createElement('a');

            link.href = url;
            link.download =
                `${filePrefix || 'battle-telemetry'}-` +
                `${this.getTimestampForFileName()}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(
                () => URL.revokeObjectURL(url),
                0
            );
        } catch (error) {
            console.warn(
                '[BattleTelemetry] Failed to download report.',
                error
            );
        }
    }

    private getOrCreateStatsForUnit(unit: any) {
        return this.getOrCreateStats(
            this.clampTeam(unit.team),
            unit.unitTypeName || 'unknown',
            unit.props.family,
            unit.props.tier
        );
    }

    private getOrCreateStats(
        team: number,
        unitName: string,
        family: UnitFamily,
        tier: number
    ) {
        const key =
            this.buildTypeKey(
                team,
                unitName,
                family,
                tier
            );

        let stats =
            this.unitStats.get(key);

        if (stats) return stats;

        stats = new UnitTypeTelemetryStats();
        stats.key = key;
        stats.team = this.clampTeam(team);
        stats.name = unitName || 'unknown';
        stats.family = family;
        stats.familyName = unitFamilyToName(family);
        stats.tier = tier || 1;

        this.unitStats.set(key, stats);

        return stats;
    }

    private buildTypeKey(
        team: number,
        unitName: string,
        family: UnitFamily,
        tier: number
    ) {
        return `T${this.clampTeam(team)}:` +
            `${unitFamilyToName(family)}:` +
            `t${tier || 1}:` +
            `${unitName || 'unknown'}`;
    }

    private addRecordValue(
        record: Record<string, number>,
        key: string,
        value: number
    ) {
        record[key] =
            (record[key] || 0) + value;
    }

    private normalizeWaveSpawnDecision(
        decision: BattleTelemetryWaveSpawnDecision
    ): BattleTelemetryWaveSpawnDecision {
        const family =
            Number.isFinite(decision.family)
                ? decision.family
                : -1;
        const targetFamily =
            Number.isFinite(decision.targetFamily)
                ? decision.targetFamily
                : -1;

        return {
            team: this.clampTeam(decision.team),
            waveId: Math.floor(decision.waveId || 0),
            frame: Math.floor(decision.frame || 0),
            time: Number.isFinite(decision.time)
                ? decision.time
                : 0,
            reason: decision.reason || 'unknown',
            aggressiveForward: !!decision.aggressiveForward,
            laneId: Math.floor(decision.laneId || 0),
            unitName: decision.unitName || 'unknown',
            family,
            familyName:
                decision.familyName ||
                (
                    family >= 0
                        ? unitFamilyToName(family)
                        : 'Unknown'
                ),
            tier: Math.max(1, Math.floor(decision.tier || 1)),
            intendedUnitName: decision.intendedUnitName || '',
            intendedFamily:
                Number.isFinite(decision.intendedFamily)
                    ? decision.intendedFamily
                    : undefined,
            intendedFamilyName:
                decision.intendedFamilyName ||
                (
                    Number.isFinite(decision.intendedFamily)
                        ? unitFamilyToName(decision.intendedFamily!)
                        : ''
                ),
            targetWaveId: Number.isFinite(
                decision.targetWaveId
            )
                ? Math.floor(decision.targetWaveId)
                : -1,
            targetLaneId: Number.isFinite(
                decision.targetLaneId
            )
                ? Math.floor(decision.targetLaneId)
                : -1,
            targetFamily,
            targetFamilyName:
                decision.targetFamilyName ||
                (
                    targetFamily >= 0
                        ? unitFamilyToName(targetFamily)
                        : ''
                ),
            responseTier: decision.responseTier || '',
            allyBlockersFromSpawn: Math.max(
                0,
                Math.floor(decision.allyBlockersFromSpawn || 0)
            ),
            allyCountInLane: Math.max(
                0,
                Math.floor(decision.allyCountInLane || 0)
            ),
            firstEnemyFromSpawn:
                !!decision.firstEnemyFromSpawn,
            coverage: Number.isFinite(decision.coverage)
                ? decision.coverage
                : 0,
            uncovered: Number.isFinite(decision.uncovered)
                ? decision.uncovered
                : 0,
            threatScore: Number.isFinite(decision.threatScore)
                ? decision.threatScore
                : 0,
            targetWaveSpawnFrame:
                Number.isFinite(decision.targetWaveSpawnFrame)
                    ? Math.floor(decision.targetWaveSpawnFrame!)
                    : undefined,
            responseDelayFrames:
                Number.isFinite(decision.responseDelayFrames)
                    ? Math.floor(decision.responseDelayFrames!)
                    : undefined,
            responseDelaySeconds:
                Number.isFinite(decision.responseDelaySeconds)
                    ? decision.responseDelaySeconds
                    : undefined,
            decisionPath: decision.decisionPath || '',
            decisionAccuracy: Number.isFinite(decision.decisionAccuracy)
                ? decision.decisionAccuracy
                : undefined,
            accuracyRoll: Number.isFinite(decision.accuracyRoll)
                ? decision.accuracyRoll
                : undefined,
            accurateDecision:
                decision.accurateDecision === undefined
                    ? undefined
                    : !!decision.accurateDecision,
            deliberateMistakeRoll:
                Number.isFinite(decision.deliberateMistakeRoll)
                    ? decision.deliberateMistakeRoll
                    : undefined,
            deliberateMistake:
                decision.deliberateMistake === undefined
                    ? undefined
                    : !!decision.deliberateMistake,
            aggressiveForwardChance:
                Number.isFinite(decision.aggressiveForwardChance)
                    ? decision.aggressiveForwardChance
                    : undefined,
            aggressiveRoll: Number.isFinite(decision.aggressiveRoll)
                ? decision.aggressiveRoll
                : undefined,
            aggressiveSource: decision.aggressiveSource || '',
            flankStrikeRatio: Number.isFinite(decision.flankStrikeRatio)
                ? decision.flankStrikeRatio
                : undefined,
            flankStrikeRoll: Number.isFinite(decision.flankStrikeRoll)
                ? decision.flankStrikeRoll
                : undefined,
            aggressiveFastestEntryChance:
                Number.isFinite(decision.aggressiveFastestEntryChance)
                    ? decision.aggressiveFastestEntryChance
                    : undefined,
            aggressiveFastestRoll:
                Number.isFinite(decision.aggressiveFastestRoll)
                    ? decision.aggressiveFastestRoll
                    : undefined,
            aggressiveUseFastest:
                decision.aggressiveUseFastest === undefined
                    ? undefined
                    : !!decision.aggressiveUseFastest,
            fastReactCounterChance:
                Number.isFinite(decision.fastReactCounterChance)
                    ? decision.fastReactCounterChance
                    : undefined,
            fastReactRoll:
                Number.isFinite(decision.fastReactRoll)
                    ? decision.fastReactRoll
                    : undefined,
            aliveWaveCountAtDecision:
                Number.isFinite(decision.aliveWaveCountAtDecision)
                    ? Math.floor(decision.aliveWaveCountAtDecision)
                    : undefined,
            affordableEntryCount:
                Number.isFinite(decision.affordableEntryCount)
                    ? Math.floor(decision.affordableEntryCount)
                    : undefined,
            activeEnemyIntelCount:
                Number.isFinite(decision.activeEnemyIntelCount)
                    ? Math.floor(decision.activeEnemyIntelCount)
                    : undefined,
            combatPointAtDecision:
                Number.isFinite(decision.combatPointAtDecision)
                    ? decision.combatPointAtDecision
                    : undefined,
            combatPointAdvantageAtDecision:
                Number.isFinite(
                    decision.combatPointAdvantageAtDecision
                )
                    ? decision.combatPointAdvantageAtDecision
                    : undefined,
            enemyCombatPointAtDecision:
                Number.isFinite(decision.enemyCombatPointAtDecision)
                    ? decision.enemyCombatPointAtDecision
                    : undefined,
            postSpawnCombatPoint:
                Number.isFinite(decision.postSpawnCombatPoint)
                    ? decision.postSpawnCombatPoint
                    : undefined,
            postSpawnCombatPointAdvantage:
                Number.isFinite(
                    decision.postSpawnCombatPointAdvantage
                )
                    ? decision.postSpawnCombatPointAdvantage
                    : undefined,
            combatPointCostRatioAtDecision:
                Number.isFinite(
                    decision.combatPointCostRatioAtDecision
                )
                    ? decision.combatPointCostRatioAtDecision
                    : undefined,
            canComfortablyAffordAtDecision:
                decision.canComfortablyAffordAtDecision === undefined
                    ? undefined
                    : !!decision.canComfortablyAffordAtDecision,
        };
    }

    private recordDamageOrder(
        team: TeamIndex,
        frame: number,
        victimIsHero: boolean
    ) {
        this.recordFirstTeamInFrame(
            this.firstDamageByFrameTeam,
            team,
            frame,
            'damage'
        );

        if (!victimIsHero) return;

        this.recordFirstTeamInFrame(
            this.firstHeroDamageByFrameTeam,
            team,
            frame,
            'hero-damage'
        );
    }

    private recordFirstTeamInFrame(
        target: number[],
        team: TeamIndex,
        frame: number,
        kind: string
    ) {
        if (!Number.isFinite(frame) || frame < 0) return;

        if (kind === 'damage') {
            if (this.lastDamageFrame === frame) return;
            this.lastDamageFrame = frame;
        } else if (kind === 'kill') {
            if (this.lastKillFrame === frame) return;
            this.lastKillFrame = frame;
        } else if (kind === 'hero-damage') {
            if (this.lastHeroDamageFrame === frame) return;
            this.lastHeroDamageFrame = frame;
        }

        target[team]++;
    }

    private getUnitWaveId(unit: any) {
        if (!unit) return -1;
        if (!Number.isFinite(unit.waveRuntimeId)) return -1;

        return Math.floor(unit.waveRuntimeId);
    }

    private pushDiagnosticEvent(
        event: BattleTelemetryDiagnosticEvent
    ) {
        if (!event) return;
        if (this.maxDiagnosticEvents <= 0) return;
        if (this.diagnosticEvents.length >= this.maxDiagnosticEvents) {
            this.droppedDiagnosticEventCount++;
            return;
        }

        this.diagnosticEvents.push(event);
    }

    private clampTeam(team: number): TeamIndex {
        return team === 1 ? 1 : 0;
    }

    private getTimestampForFileName() {
        return new Date()
            .toISOString()
            .replace(/[:.]/g, '-');
    }
}
