System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, unitFamilyToName, UnitTypeTelemetryStats, WaveSpawnDecisionStats, BattleTelemetry, _crd;

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfunitFamilyToName(extras) {
    _reporterNs.report("unitFamilyToName", "./BattleTypes", _context.meta, extras);
  }

  _export("BattleTelemetry", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      unitFamilyToName = _unresolved_2.unitFamilyToName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "efefb3bgE1KjJjaaGGLImPG", "BattleTelemetry", undefined);

      UnitTypeTelemetryStats = class UnitTypeTelemetryStats {
        constructor() {
          this.key = '';
          this.team = 0;
          this.name = '';
          this.family = 0;
          this.familyName = '';
          this.tier = 1;
          this.spawnedCount = 0;
          this.deathCount = 0;
          this.aliveAtEnd = 0;
          this.totalLifetime = 0;
          this.averageLifetime = 0;
          this.totalDamageDealt = 0;
          this.totalDamageReceived = 0;
          this.totalCounterDamageDealt = 0;
          this.totalCounterDamageReceived = 0;
          this.totalHeroDamageDealt = 0;
          this.totalDamageReceivedFromHero = 0;
          this.totalKills = 0;
          this.totalDeaths = 0;
          this.totalCounterKills = 0;
          this.totalDeathsToCounter = 0;
          this.killedByUnitType = {};
          this.killedUnitType = {};
          this.damageDealtToUnitType = {};
          this.damageReceivedFromUnitType = {};
        }

      };
      WaveSpawnDecisionStats = class WaveSpawnDecisionStats {
        constructor() {
          this.key = '';
          this.team = 0;
          this.reason = '';
          this.aggressiveForward = false;
          this.family = 0;
          this.familyName = '';
          this.tier = 1;
          this.unitName = '';
          this.count = 0;
          this.targetFamilies = {};
        }

      };

      _export("BattleTelemetry", BattleTelemetry = class BattleTelemetry {
        constructor() {
          this.enabled = false;
          this.started = false;
          this.ended = false;
          this.startConfig = null;
          this.unitStats = new Map();
          this.waveSpawnDecisionStats = new Map();
          this.waveSpawns = [];
          this.spawnInfoByUnit = new WeakMap();
          this.activeSpawnInfos = new Set();
          this.totalDamage = [0, 0];
          this.totalHeroDamage = [0, 0];
          this.totalKills = [0, 0];
          this.totalDeaths = [0, 0];
          this.totalCounterKills = [0, 0];
          this.nextSpawnId = 1;
        }

        reset(enabled, config) {
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

        recordSpawn(unit, team, unitName, family, tier, waveId, frame, time) {
          if (!this.isEnabled()) return;
          if (!unit) return;
          var key = this.buildTypeKey(team, unitName, family, tier);
          var familyName = (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
            error: Error()
          }), unitFamilyToName) : unitFamilyToName)(family);
          var info = {
            key,
            team,
            name: unitName,
            family,
            familyName,
            tier,
            waveId,
            spawnFrame: frame,
            spawnTime: time
          };
          this.spawnInfoByUnit.set(unit, info);
          this.activeSpawnInfos.add(info);
          var stats = this.getOrCreateStats(team, unitName, family, tier);
          stats.spawnedCount++;
        }

        recordWaveSpawnDecision(decision) {
          if (!this.isEnabled()) return;
          if (!decision) return;
          var normalized = this.normalizeWaveSpawnDecision(decision);
          this.waveSpawns.push(normalized);
          var key = "T" + normalized.team + ":" + (normalized.reason + ":") + ((normalized.aggressiveForward ? 'aggressive' : 'normal') + ":") + (normalized.familyName + ":") + ("t" + normalized.tier + ":") + ("" + normalized.unitName);
          var stats = this.waveSpawnDecisionStats.get(key);

          if (!stats) {
            stats = new WaveSpawnDecisionStats();
            stats.key = key;
            stats.team = normalized.team;
            stats.reason = normalized.reason;
            stats.aggressiveForward = normalized.aggressiveForward;
            stats.family = normalized.family;
            stats.familyName = normalized.familyName;
            stats.tier = normalized.tier;
            stats.unitName = normalized.unitName;
            this.waveSpawnDecisionStats.set(key, stats);
          }

          stats.count++;

          if (normalized.targetFamilyName) {
            this.addRecordValue(stats.targetFamilies, normalized.targetFamilyName, 1);
          }
        }

        recordDamage(attacker, victim, damage, actualDamage, isCounterDamage) {
          if (!this.isEnabled()) return;
          if (!attacker || !victim) return;
          if (!attacker.props || !victim.props) return;
          var dealt = Math.max(0, Number.isFinite(actualDamage) ? actualDamage : damage);
          if (dealt <= 0) return;
          var attackerStats = this.getOrCreateStatsForUnit(attacker);
          var victimStats = this.getOrCreateStatsForUnit(victim);
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

          this.addRecordValue(attackerStats.damageDealtToUnitType, victimStats.key, dealt);
          this.addRecordValue(victimStats.damageReceivedFromUnitType, attackerStats.key, dealt);
        }

        recordKill(killer, victim, isCounterKill) {
          if (!this.isEnabled()) return;
          if (!killer || !victim) return;
          if (!killer.props || !victim.props) return;
          var killerStats = this.getOrCreateStatsForUnit(killer);
          var victimStats = this.getOrCreateStatsForUnit(victim);
          killerStats.totalKills++;
          victimStats.totalDeaths++;
          this.totalKills[this.clampTeam(killer.team)]++;

          if (isCounterKill) {
            killerStats.totalCounterKills++;
            victimStats.totalDeathsToCounter++;
            this.totalCounterKills[this.clampTeam(killer.team)]++;
          }

          this.addRecordValue(killerStats.killedUnitType, victimStats.key, 1);
          this.addRecordValue(victimStats.killedByUnitType, killerStats.key, 1);
        }

        recordDespawn(unit, frame, time) {
          if (!this.isEnabled()) return;
          if (!unit || !unit.props) return;
          var stats = this.getOrCreateStatsForUnit(unit);
          var spawnInfo = this.spawnInfoByUnit.get(unit);
          stats.deathCount++;
          this.totalDeaths[this.clampTeam(unit.team)]++;

          if (spawnInfo) {
            stats.totalLifetime += Math.max(0, time - spawnInfo.spawnTime);
            this.activeSpawnInfos.delete(spawnInfo);
          }
        }

        finish(winnerTeam, loserTeam, reason, frame, time, combatPoint, aliveCount, deathCount, killCount, counterKillCount) {
          if (!this.enabled || !this.started) return null;
          if (this.ended) return null;
          this.ended = true;
          this.activeSpawnInfos.forEach(info => {
            var stats = this.unitStats.get(info.key);
            if (!stats) return;
            stats.aliveAtEnd++;
            stats.totalLifetime += Math.max(0, time - info.spawnTime);
          });
          var unitTypes = Array.from(this.unitStats.values()).map(stats => {
            stats.averageLifetime = stats.spawnedCount > 0 ? stats.totalLifetime / stats.spawnedCount : 0;
            return stats;
          }).sort((a, b) => a.team - b.team || a.family - b.family || a.tier - b.tier || a.name.localeCompare(b.name));
          var spawnDecisionStats = Array.from(this.waveSpawnDecisionStats.values()).sort((a, b) => a.team - b.team || a.reason.localeCompare(b.reason) || Number(a.aggressiveForward) - Number(b.aggressiveForward) || a.family - b.family || a.unitName.localeCompare(b.unitName));
          return {
            version: 1,
            startedAt: this.startConfig ? this.startConfig.startedAt : '',
            endedAt: new Date().toISOString(),
            durationSeconds: time,
            frame,
            result: {
              winnerTeam,
              loserTeam,
              reason
            },
            teams: [{
              team: 0,
              combatPoint: combatPoint[0] || 0,
              aliveCount: aliveCount[0] || 0,
              deathCount: deathCount[0] || 0,
              killCount: killCount[0] || 0,
              counterKillCount: counterKillCount[0] || 0,
              totalDamage: this.totalDamage[0],
              totalHeroDamage: this.totalHeroDamage[0],
              telemetryKills: this.totalKills[0],
              telemetryDeaths: this.totalDeaths[0],
              telemetryCounterKills: this.totalCounterKills[0]
            }, {
              team: 1,
              combatPoint: combatPoint[1] || 0,
              aliveCount: aliveCount[1] || 0,
              deathCount: deathCount[1] || 0,
              killCount: killCount[1] || 0,
              counterKillCount: counterKillCount[1] || 0,
              totalDamage: this.totalDamage[1],
              totalHeroDamage: this.totalHeroDamage[1],
              telemetryKills: this.totalKills[1],
              telemetryDeaths: this.totalDeaths[1],
              telemetryCounterKills: this.totalCounterKills[1]
            }],
            config: this.startConfig,
            waveSpawns: this.waveSpawns.slice(),
            spawnDecisionStats,
            unitTypes
          };
        }

        exportReport(report, filePrefix, download, logToConsole) {
          if (!report) return;
          var json = JSON.stringify(report, null, 2);
          var globalObject = globalThis;
          globalObject.__battleTelemetryReport = report;

          if (logToConsole) {
            console.log('[BattleTelemetry]', report);
          } else {
            console.log("[BattleTelemetry] report ready: " + (json.length + " bytes. ") + "window.__battleTelemetryReport is available.");
          }

          if (!download) return;
          if (typeof document === 'undefined') return;
          if (typeof Blob === 'undefined') return;
          if (typeof URL === 'undefined') return;

          try {
            var blob = new Blob([json], {
              type: 'application/json'
            });
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = (filePrefix || 'battle-telemetry') + "-" + (this.getTimestampForFileName() + ".json");
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 0);
          } catch (error) {
            console.warn('[BattleTelemetry] Failed to download report.', error);
          }
        }

        getOrCreateStatsForUnit(unit) {
          return this.getOrCreateStats(this.clampTeam(unit.team), unit.unitTypeName || 'unknown', unit.props.family, unit.props.tier);
        }

        getOrCreateStats(team, unitName, family, tier) {
          var key = this.buildTypeKey(team, unitName, family, tier);
          var stats = this.unitStats.get(key);
          if (stats) return stats;
          stats = new UnitTypeTelemetryStats();
          stats.key = key;
          stats.team = this.clampTeam(team);
          stats.name = unitName || 'unknown';
          stats.family = family;
          stats.familyName = (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
            error: Error()
          }), unitFamilyToName) : unitFamilyToName)(family);
          stats.tier = tier || 1;
          this.unitStats.set(key, stats);
          return stats;
        }

        buildTypeKey(team, unitName, family, tier) {
          return "T" + this.clampTeam(team) + ":" + ((_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
            error: Error()
          }), unitFamilyToName) : unitFamilyToName)(family) + ":") + ("t" + (tier || 1) + ":") + ("" + (unitName || 'unknown'));
        }

        addRecordValue(record, key, value) {
          record[key] = (record[key] || 0) + value;
        }

        normalizeWaveSpawnDecision(decision) {
          var family = Number.isFinite(decision.family) ? decision.family : -1;
          var targetFamily = Number.isFinite(decision.targetFamily) ? decision.targetFamily : -1;
          return {
            team: this.clampTeam(decision.team),
            waveId: Math.floor(decision.waveId || 0),
            frame: Math.floor(decision.frame || 0),
            time: Number.isFinite(decision.time) ? decision.time : 0,
            reason: decision.reason || 'unknown',
            aggressiveForward: !!decision.aggressiveForward,
            laneId: Math.floor(decision.laneId || 0),
            unitName: decision.unitName || 'unknown',
            family,
            familyName: decision.familyName || (family >= 0 ? (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
              error: Error()
            }), unitFamilyToName) : unitFamilyToName)(family) : 'Unknown'),
            tier: Math.max(1, Math.floor(decision.tier || 1)),
            targetWaveId: Number.isFinite(decision.targetWaveId) ? Math.floor(decision.targetWaveId) : -1,
            targetLaneId: Number.isFinite(decision.targetLaneId) ? Math.floor(decision.targetLaneId) : -1,
            targetFamily,
            targetFamilyName: decision.targetFamilyName || (targetFamily >= 0 ? (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
              error: Error()
            }), unitFamilyToName) : unitFamilyToName)(targetFamily) : ''),
            responseTier: decision.responseTier || '',
            allyBlockersFromSpawn: Math.max(0, Math.floor(decision.allyBlockersFromSpawn || 0)),
            allyCountInLane: Math.max(0, Math.floor(decision.allyCountInLane || 0)),
            firstEnemyFromSpawn: !!decision.firstEnemyFromSpawn,
            coverage: Number.isFinite(decision.coverage) ? decision.coverage : 0,
            uncovered: Number.isFinite(decision.uncovered) ? decision.uncovered : 0,
            threatScore: Number.isFinite(decision.threatScore) ? decision.threatScore : 0
          };
        }

        clampTeam(team) {
          return team === 1 ? 1 : 0;
        }

        getTimestampForFileName() {
          return new Date().toISOString().replace(/[:.]/g, '-');
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=63e72f9409327473ce46d50b2b88dd44d5bd880c.js.map