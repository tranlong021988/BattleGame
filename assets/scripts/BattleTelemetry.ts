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
    totalCounterDamageDealt = 0;
    totalCounterDamageReceived = 0;
    totalHeroDamageDealt = 0;
    totalDamageReceivedFromHero = 0;
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
    private spawnInfoByUnit: WeakMap<object, UnitSpawnInfo> = new WeakMap();
    private activeSpawnInfos: Set<UnitSpawnInfo> = new Set();
    private totalDamage = [0, 0];
    private totalHeroDamage = [0, 0];
    private totalKills = [0, 0];
    private totalDeaths = [0, 0];
    private totalCounterKills = [0, 0];
    private nextSpawnId = 1;

    reset(enabled: boolean, config: BattleTelemetryStartConfig) {
        this.enabled = enabled;
        this.started = enabled;
        this.ended = false;
        this.startConfig = config;
        this.unitStats.clear();
        this.waveSpawnDecisionStats.clear();
        this.waveSpawns.length = 0;
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
        this.nextSpawnId = 1;
    }

    isEnabled() {
        return this.enabled && this.started && !this.ended;
    }

    hasEnded() {
        return this.ended;
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

    recordWaveSpawnDecision(
        decision: BattleTelemetryWaveSpawnDecision
    ) {
        if (!this.isEnabled()) return;
        if (!decision) return;

        const normalized =
            this.normalizeWaveSpawnDecision(decision);

        this.waveSpawns.push(normalized);

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
        isCounterDamage: boolean
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
    }

    recordKill(
        killer: any,
        victim: any,
        isCounterKill: boolean
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
        };
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
