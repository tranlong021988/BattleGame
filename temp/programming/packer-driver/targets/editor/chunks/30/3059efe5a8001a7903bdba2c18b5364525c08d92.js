System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, UnitFamily, CounterSettings, BattlefieldLaneIntel, BattlefieldWaveIntel, BattleEntryChoice, BattlefieldEvaluator, _crd;

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitPrefabEntry(extras) {
    _reporterNs.report("UnitPrefabEntry", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleWave(extras) {
    _reporterNs.report("BattleWave", "./BattleWave", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCounterSettings(extras) {
    _reporterNs.report("CounterSettings", "./CounterSettings", _context.meta, extras);
  }

  _export({
    BattlefieldLaneIntel: void 0,
    BattlefieldWaveIntel: void 0,
    BattleEntryChoice: void 0,
    BattlefieldEvaluator: void 0
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      UnitFamily = _unresolved_2.UnitFamily;
    }, function (_unresolved_3) {
      CounterSettings = _unresolved_3.CounterSettings;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4d5b7Lq+EJMO6L+JcWzD05R", "BattlefieldEvaluator", undefined);

      _export("BattlefieldLaneIntel", BattlefieldLaneIntel = class BattlefieldLaneIntel {
        constructor() {
          this.laneId = 0;
          this.allyWaveCount = 0;
          this.enemyWaveCount = 0;
          this.trafficCount = 0;
        }

        reset(laneId) {
          this.laneId = laneId;
          this.allyWaveCount = 0;
          this.enemyWaveCount = 0;
          this.trafficCount = 0;
        }

      });

      _export("BattlefieldWaveIntel", BattlefieldWaveIntel = class BattlefieldWaveIntel {
        constructor() {
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

      });

      _export("BattleEntryChoice", BattleEntryChoice = class BattleEntryChoice {
        constructor() {
          this.entry = null;
          this.score = -Infinity;
          this.coveragePower = 0;
          this.projectedCoverageRatio = 0;
        }

        reset() {
          this.entry = null;
          this.score = -Infinity;
          this.coveragePower = 0;
          this.projectedCoverageRatio = 0;
        }

      });

      _export("BattlefieldEvaluator", BattlefieldEvaluator = class BattlefieldEvaluator {
        constructor() {
          this.coverageTargetRatio = 1.05;
          this.rescueAllyAliveRatio = 0.35;
          this.laneAllyAheadLimit = 2;
          this.dangerousThreatProgress = 0.75;
          this.lanes = [];
          this.enemies = [];
          this.allies = [];
          this.enemyCount = 0;
          this.allyCount = 0;
          this.choice = new BattleEntryChoice();
        }

        rebuild(gameManager, team) {
          const laneCount = gameManager.getSafeLaneCount();
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
            const entry = this.findEntryForWave(gameManager, wave);
            if (!entry) continue;
            const intel = wave.team === team ? this.getAllyBuffer() : wave.team === enemyTeam ? this.getEnemyBuffer() : null;
            if (!intel) continue;
            this.fillWaveIntel(gameManager, intel, wave, entry, team);
            const lane = this.lanes[intel.visualLaneId];

            if (lane) {
              lane.trafficCount++;

              if (wave.team === team) {
                lane.allyWaveCount++;
              } else {
                lane.enemyWaveCount++;
              }
            }
          }

          for (let i = 0; i < this.enemyCount; i++) {
            this.fillEnemyTacticalState(gameManager, team, this.enemies[i]);
          }
        }

        findBestTarget(gameManager, team, affordableEntries) {
          let best = null;
          let bestScore = -Infinity;

          for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];
            if (!enemy.wave || !enemy.entry) continue;
            if (enemy.aliveCount <= 0) continue;
            if (enemy.healthRatio <= 0.08) continue;
            const choice = this.chooseEntryForTarget(gameManager, team, enemy, affordableEntries);
            if (!choice.entry) continue;
            const uncovered = Math.max(0, this.coverageTargetRatio - enemy.coverageRatio);
            const rescueScore = enemy.hasStrugglingAlly ? 180 : 0;
            const dangerousScore = enemy.dangerousToDefend ? 500 + enemy.progressToDefend * 300 : enemy.progressToDefend * 90;
            const score = enemy.threatScore + uncovered * enemy.threatPower + rescueScore + dangerousScore;

            if (score > bestScore) {
              bestScore = score;
              best = enemy;
            }
          }

          return best;
        }

        chooseEntryForTarget(gameManager, team, target, affordableEntries) {
          this.choice.reset();
          if (!target.entry) return this.choice;

          for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];
            const roleRank = this.getDirectResponseRoleRank(entry, target);
            if (roleRank >= 99) continue;

            if (!this.isEntryViableForTarget(entry, target)) {
              continue;
            }

            const coveragePower = this.getEntryCoveragePower(gameManager, team, entry, target);
            if (coveragePower <= 0) continue;

            if (!this.wouldImproveCoverage(target, coveragePower)) {
              continue;
            }

            const cost = Math.max(1, entry.combatPointCost);
            const neededPower = Math.max(0, target.threatPower * this.coverageTargetRatio - target.coveragePower);
            const neededSafe = Math.max(1, neededPower);
            const needRatio = coveragePower / neededSafe;
            const efficiency = coveragePower / cost;
            const projectedCoverageRatio = (target.coveragePower + coveragePower) / Math.max(1, target.threatPower);
            const overshootPenalty = Math.max(0, projectedCoverageRatio - this.coverageTargetRatio) * 180;
            const nearEnoughScore = needRatio >= 0.9 ? 500 : needRatio * 350;
            const underPowerPenalty = Math.max(0, 0.9 - needRatio) * 300;
            const roleBias = this.getDirectResponseRoleBias(roleRank, target);
            const secondaryUtility = this.getSecondaryDirectResponseUtility(gameManager, team, entry, target, coveragePower, neededPower);
            const score = nearEnoughScore + efficiency * 8 - cost * 12 - overshootPenalty - underPowerPenalty + roleBias + secondaryUtility;

            if (score > this.choice.score) {
              this.choice.entry = entry;
              this.choice.score = score;
              this.choice.coveragePower = coveragePower;
              this.choice.projectedCoverageRatio = projectedCoverageRatio;
            }
          }

          return this.choice;
        }

        chooseSpawnLaneForTarget(gameManager, team, target, entry) {
          if (!target.wave) return -1;
          const directLane = target.laneId >= 0 ? target.laneId : target.visualLaneId;
          const lane = this.lanes[directLane];
          const directBlocked = this.isDirectLaneSpawnBlocked(lane, target);

          if (!directBlocked || target.hasStrugglingAlly || target.dangerousToDefend) {
            return directLane;
          }

          const flankLane = this.findBestFlankLane(gameManager, directLane);

          if (flankLane >= 0) {
            return flankLane;
          }

          if (this.isRangedFamily(entry.family)) {
            return -1;
          }

          return -1;
        }

        shouldSpawnAggressive(entry, target, spawnLaneId) {
          if (!target.entry) return true;

          if (this.isRangedFamily(entry.family)) {
            return target.frontlineBlockPower > 0 && target.progressToDefend < 0.55;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry && this.isRangedFamily(target.entry.family) && target.enemyMeleeBlockersFromSpawn <= 1 && !target.hasEnemySpearBlockerFromSpawn) {
            return true;
          }

          return false;
        }

        choosePressureLane(gameManager) {
          let bestLane = -1;
          let bestScore = -Infinity;
          const laneCount = gameManager.getSafeLaneCount();

          for (let i = 0; i < laneCount; i++) {
            const lane = this.lanes[i];
            if (!lane) continue;
            const score = (lane.enemyWaveCount <= 0 ? 80 : 0) - lane.trafficCount * 20 - lane.allyWaveCount * 15 + Math.random() * 0.001;

            if (score > bestScore) {
              bestScore = score;
              bestLane = i;
            }
          }

          return bestLane;
        }

        choosePressureEntry(affordableEntries) {
          let best = null;
          let bestScore = -Infinity;

          for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (this.isRangedFamily(entry.family)) {
              continue;
            }

            const power = this.getEntryBasePower(entry, Math.max(1, entry.unitCount), 1, 1);
            const cost = Math.max(1, entry.combatPointCost);
            const score = power / cost + entry.maxSpeed * 1.25 + this.getPressureRoleScore(entry) + Math.random() * 4;

            if (score > bestScore) {
              bestScore = score;
              best = entry;
            }
          }

          return best;
        }

        findBestRangedSupportTarget(affordableEntries, maxRangedSupportPerLane) {
          if (!this.hasAffordableRangedEntry(affordableEntries)) {
            return null;
          }

          let best = null;
          let bestScore = -Infinity;
          const supportLimit = Math.max(0, Math.floor(maxRangedSupportPerLane));

          for (let i = 0; i < this.enemyCount; i++) {
            const target = this.enemies[i];
            if (!target.wave || !target.entry) continue;
            if (target.aliveCount <= 0) continue;
            if (target.healthRatio <= 0.1) continue;
            if (!this.isRangedSpawnSafe(target)) continue;
            const currentSupport = this.countRangedSupportForTarget(target);

            if (currentSupport >= supportLimit) {
              continue;
            }

            const coveragePressure = Math.max(0, 1.45 - target.coverageRatio);
            const score = target.threatPower * (0.4 + Math.min(0.8, target.clusterScore * 0.2)) + coveragePressure * 180 - currentSupport * 120 + target.progressToDefend * 60;

            if (score > bestScore) {
              bestScore = score;
              best = target;
            }
          }

          return best;
        }

        findBestAntiSpearArcherTarget(affordableEntries, maxRangedSupportPerLane) {
          if (!this.hasAffordableArcherEntry(affordableEntries)) {
            return null;
          }

          let best = null;
          let bestScore = -Infinity;
          const supportLimit = Math.max(0, Math.floor(maxRangedSupportPerLane));

          for (let i = 0; i < this.enemyCount; i++) {
            const target = this.enemies[i];
            if (!target.wave || !target.entry) continue;
            if (target.entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Spear) continue;
            if (target.aliveCount <= 0) continue;
            if (target.healthRatio <= 0.1) continue;
            if (!this.isRangedSpawnSafe(target)) continue;
            const currentSupport = this.countRangedSupportForTarget(target);

            if (currentSupport >= supportLimit) {
              continue;
            }

            if (target.coverageRatio >= this.coverageTargetRatio && !target.hasStrugglingAlly && !target.dangerousToDefend) {
              continue;
            }

            const coveragePressure = Math.max(0, this.coverageTargetRatio - target.coverageRatio);
            const score = target.threatPower + coveragePressure * target.threatPower * 0.65 + target.progressToDefend * 120 + (target.hasStrugglingAlly ? 180 : 0) + (target.dangerousToDefend ? 260 : 0) - currentSupport * 180;

            if (score > bestScore) {
              bestScore = score;
              best = target;
            }
          }

          return best;
        }

        findBestClusterMonkTarget(affordableEntries, maxRangedSupportPerLane) {
          if (!this.hasAffordableMonkEntry(affordableEntries)) {
            return null;
          }

          let best = null;
          let bestScore = -Infinity;
          const supportLimit = Math.max(0, Math.floor(maxRangedSupportPerLane));

          for (let i = 0; i < this.enemyCount; i++) {
            const target = this.enemies[i];
            if (!target.wave || !target.entry) continue;
            if (target.aliveCount < 6) continue;
            if (target.healthRatio <= 0.12) continue;
            if (target.clusterScore < 2.35) continue;
            if (!this.isRangedSpawnSafe(target)) continue;

            if (this.countMeleeWaves(this.enemies, this.enemyCount) < 4) {
              continue;
            }

            if (this.countMeleeWaves(this.allies, this.allyCount) < 4) {
              continue;
            }

            const currentSupport = this.countRangedSupportForTarget(target);

            if (currentSupport >= supportLimit) {
              continue;
            }

            if (target.coverageRatio >= 1.2 && !target.hasStrugglingAlly && !target.dangerousToDefend) {
              continue;
            }

            const score = target.threatPower * Math.min(1.5, target.clusterScore * 0.55) + Math.max(0, 1.2 - target.coverageRatio) * target.threatPower * 0.45 + target.progressToDefend * 90 + (target.hasStrugglingAlly ? 140 : 0) + (target.dangerousToDefend ? 180 : 0) - currentSupport * 160;

            if (score > bestScore) {
              bestScore = score;
              best = target;
            }
          }

          return best;
        }

        chooseClusterMonkEntry(affordableEntries, target) {
          let best = null;
          let bestScore = -Infinity;

          for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Monk) {
              continue;
            }

            const basePower = this.getEntryBasePower(entry, Math.max(1, entry.unitCount), 1, target.aliveCount);
            const matchup = this.getMatchupFactor(entry, target);
            const cost = Math.max(1, entry.combatPointCost);
            const score = basePower * matchup / cost + target.clusterScore * 18 + target.aliveCount * 0.8;

            if (score > bestScore) {
              bestScore = score;
              best = entry;
            }
          }

          return best;
        }

        chooseAntiSpearArcherEntry(affordableEntries, target) {
          let best = null;
          let bestScore = -Infinity;

          for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Archer) {
              continue;
            }

            const basePower = this.getEntryBasePower(entry, Math.max(1, entry.unitCount), 1, target.aliveCount);
            const matchup = this.getMatchupFactor(entry, target);
            const cost = Math.max(1, entry.combatPointCost);
            const score = basePower * matchup / cost + entry.attackRange * 4;

            if (score > bestScore) {
              bestScore = score;
              best = entry;
            }
          }

          return best;
        }

        chooseRangedSupportEntry(affordableEntries, target) {
          let best = null;
          let bestScore = -Infinity;

          for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];

            if (!this.isRangedFamily(entry.family)) {
              continue;
            }

            if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Monk && (target.clusterScore < 1.55 || target.aliveCount < 6)) {
              continue;
            }

            const basePower = this.getEntryBasePower(entry, Math.max(1, entry.unitCount), 1, target.aliveCount);
            const cost = Math.max(1, entry.combatPointCost);
            const roleScore = entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Monk ? target.clusterScore * 80 + target.aliveCount * 4 : entry.attackRange * 12 + target.progressToDefend * 40;
            const score = basePower / cost * 80 + roleScore - cost * 0.35;

            if (score > bestScore) {
              bestScore = score;
              best = entry;
            }
          }

          return best;
        }

        chooseRangedSupportLane(gameManager, target) {
          if (target.visualLaneId >= 0) {
            return gameManager.clampLaneId(target.visualLaneId);
          }

          if (target.laneId >= 0) {
            return gameManager.clampLaneId(target.laneId);
          }

          return -1;
        }

        getPressureRoleScore(entry) {
          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Sword) {
            return 24;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman) {
            return 22;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry) {
            return -24;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear) {
            return -24;
          }

          return 0;
        }

        hasAffordableRangedEntry(affordableEntries) {
          for (let i = 0; i < affordableEntries.length; i++) {
            if (this.isRangedFamily(affordableEntries[i].family)) {
              return true;
            }
          }

          return false;
        }

        hasAffordableArcherEntry(affordableEntries) {
          for (let i = 0; i < affordableEntries.length; i++) {
            if (affordableEntries[i].family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Archer) {
              return true;
            }
          }

          return false;
        }

        hasAffordableMonkEntry(affordableEntries) {
          for (let i = 0; i < affordableEntries.length; i++) {
            if (affordableEntries[i].family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Monk) {
              return true;
            }
          }

          return false;
        }

        fillWaveIntel(gameManager, intel, wave, entry, team) {
          intel.reset();
          intel.wave = wave;
          intel.entry = entry;
          intel.aliveCount = wave.getAliveCount();
          intel.aliveRatio = wave.getAliveRatio();
          intel.healthRatio = wave.getRuntimeHealthRatio(gameManager.frame);
          this.getWaveCenter(wave, intel);
          intel.visualLaneId = gameManager.getNearestLaneIdForX(intel.centerX);
          intel.laneId = wave.laneId >= 0 ? gameManager.clampLaneId(wave.laneId) : intel.visualLaneId;
          intel.basePower = this.getEntryBasePower(entry, intel.aliveCount, intel.healthRatio, 1);

          if (wave.team !== team) {
            this.fillThreatDistance(gameManager, team, intel);
          }
        }

        fillThreatDistance(gameManager, team, intel) {
          const ownSpawnZ = team === 0 ? gameManager.teamASpawnZ : gameManager.teamBSpawnZ;
          const enemySpawnZ = team === 0 ? gameManager.teamBSpawnZ : gameManager.teamASpawnZ;
          const totalDistance = Math.max(0.0001, Math.abs(enemySpawnZ - ownSpawnZ));
          intel.distanceToDefend = Math.abs(intel.centerZ - ownSpawnZ);
          intel.progressToDefend = Math.max(0, Math.min(1, Math.abs(intel.centerZ - enemySpawnZ) / totalDistance));
          intel.dangerousToDefend = intel.progressToDefend >= this.dangerousThreatProgress;
          intel.threatPower = intel.basePower * (1 + intel.progressToDefend * 0.8 + (intel.dangerousToDefend ? 0.8 : 0));
          intel.threatScore = intel.threatPower + intel.progressToDefend * 250;
        }

        fillEnemyTacticalState(gameManager, team, target) {
          target.clusterScore = this.getEnemyClusterScore(target);
          target.allyBlockersFromSpawn = this.countAllyBlockersFromSpawnToTarget(gameManager, team, target);
          target.enemyMeleeBlockersFromSpawn = this.countEnemyMeleeBlockersFromSpawnToTarget(gameManager, team, target);
          target.hasEnemySpearBlockerFromSpawn = this.hasEnemySpearBlockerFromSpawnToTarget(gameManager, team, target);
          target.coveragePower = 0;
          target.hasStrugglingAlly = false;
          target.allyAheadCount = 0;
          target.allyFrontlineCount = 0;
          target.frontlineBlockPower = 0;
          target.frontlineHealthRatio = 0;

          for (let i = 0; i < this.allyCount; i++) {
            const ally = this.allies[i];
            if (!ally.wave || !ally.entry) continue;

            if (ally.visualLaneId !== target.visualLaneId) {
              continue;
            }

            if (!this.isBetweenSpawnAndTarget(gameManager, team, ally.centerZ, target.centerZ)) {
              continue;
            }

            target.allyAheadCount++;

            if (this.isFrontlineFamily(ally.entry.family)) {
              const blockPower = ally.basePower * (0.65 + ally.healthRatio * 0.7);
              target.allyFrontlineCount++;
              target.frontlineBlockPower += blockPower;
              target.frontlineHealthRatio += ally.healthRatio;
            }

            const relation = this.getCoveragePowerAgainstTarget(gameManager, team, ally.entry, ally.basePower, target);
            target.coveragePower += relation;

            if (ally.healthRatio <= this.rescueAllyAliveRatio) {
              target.hasStrugglingAlly = true;
            }
          }

          if (target.allyFrontlineCount > 0) {
            target.frontlineHealthRatio /= target.allyFrontlineCount;
          }

          target.coverageRatio = target.threatPower > 0 ? target.coveragePower / target.threatPower : 1;
        }

        getCoveragePowerAgainstTarget(gameManager, team, entry, basePower, target) {
          const matchup = this.getMatchupFactor(entry, target);
          const reachability = this.getReachabilityFactor(gameManager, team, entry, target);
          return basePower * matchup * reachability;
        }

        getEntryCoveragePower(gameManager, team, entry, target) {
          const basePower = this.getEntryBasePower(entry, Math.max(1, Math.floor(entry.unitCount)), 1, target.aliveCount);
          return this.getCoveragePowerAgainstTarget(gameManager, team, entry, basePower, target);
        }

        getEntryBasePower(entry, aliveCount, healthRatio, targetAliveCount) {
          const count = Math.max(0, aliveCount);
          const avgInterval = Math.max(0.05, (Math.max(0.05, entry.attackIntervalMin) + Math.max(0.05, entry.attackIntervalMax)) * 0.5);
          const hitDamage = Math.max(1, entry.damage);
          const dps = count * hitDamage / avgInterval;
          const durability = Math.max(1, entry.health) * count * Math.max(0, healthRatio) * (1 + Math.max(0, entry.defense) * 0.045);
          const rangeFactor = 1 + Math.min(7, Math.max(0, entry.attackRange)) * (this.isRangedFamily(entry.family) ? 0.08 : 0.02);
          const speedFactor = 1 + Math.min(7, Math.max(0, entry.maxSpeed)) * (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry ? 0.06 : 0.025);
          const aoeFactor = 1 + Math.min(1.5, Math.max(0, entry.damageRadius)) * Math.min(1.4, Math.max(1, targetAliveCount) / 6);
          return Math.sqrt(Math.max(1, dps) * Math.max(1, durability)) * rangeFactor * speedFactor * aoeFactor;
        }

        isEntryViableForTarget(entry, target) {
          const lane = this.lanes[target.visualLaneId];
          if (!lane) return false;

          if (this.isDirectLaneSpawnBlocked(lane, target) && !target.hasStrugglingAlly && !target.dangerousToDefend) {
            const flankAvailable = this.hasOpenFlankLane(target.visualLaneId);

            if (!flankAvailable) {
              return false;
            }
          }

          if (this.isRangedFamily(entry.family)) {
            if (!this.isRangedSpawnSafe(target)) {
              return false;
            }

            if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Monk && target.clusterScore < 1.35) {
              return false;
            }
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry && target.entry && this.isRangedFamily(target.entry.family)) {
            return target.enemyMeleeBlockersFromSpawn <= 1 && !target.hasEnemySpearBlockerFromSpawn;
          }

          return true;
        }

        getDirectResponseRoleRank(entry, target) {
          if (!target.entry) return 99;
          const attacker = entry.family;
          const defender = target.entry.family;

          if (this.isRangedFamily(attacker)) {
            return 99;
          }

          if (defender === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry) {
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Spear) return 0;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Sword) return 1;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Axeman) return 1;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Cavalry) return 2;
            return 99;
          }

          if (defender === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear) {
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Sword) return 0;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Axeman) return 1;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Spear) return 2;
            return 99;
          }

          if (defender === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Sword) {
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Axeman) return 0;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Sword) return 1;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Spear) return 2;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Cavalry) return 2;
            return 99;
          }

          if (defender === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman) {
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Axeman) return 0;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Sword) return 1;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Cavalry) return 2;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Spear) return 2;
            return 99;
          }

          if (this.isRangedFamily(defender)) {
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Cavalry) return 0;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Sword) return 1;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Axeman) return 1;
            if (attacker === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Spear) return 2;
            return 99;
          }

          return 99;
        }

        getDirectResponseRoleBias(roleRank, target) {
          if (roleRank <= 0) {
            return target.dangerousToDefend ? 80 : 55;
          }

          if (roleRank === 1) {
            return target.dangerousToDefend ? 45 : 28;
          }

          return target.dangerousToDefend ? 18 : 6;
        }

        getSecondaryDirectResponseUtility(gameManager, team, entry, primaryTarget, primaryCoveragePower, primaryNeededPower) {
          const transferablePower = Math.max(0, primaryCoveragePower - primaryNeededPower);

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
            const laneDistance = Math.abs(enemy.visualLaneId - primaryTarget.visualLaneId);

            if (laneDistance > 1) {
              continue;
            }

            const zDistance = Math.abs(enemy.centerZ - primaryTarget.centerZ);

            if (zDistance > 7) {
              continue;
            }

            const laneFactor = laneDistance <= 0 ? 1 : 0.65;
            const zFactor = Math.max(0.25, 1 - zDistance / 8);
            const coveragePower = this.getEntryCoveragePower(gameManager, team, entry, enemy);
            const neededPower = Math.max(1, enemy.threatPower * this.coverageTargetRatio - enemy.coveragePower);
            const transferableCoverage = Math.min(transferablePower, coveragePower, neededPower);

            if (transferableCoverage <= 0) {
              continue;
            }

            const threatWeight = Math.min(1.5, enemy.threatScore / 500);
            utility += transferableCoverage / Math.max(1, entry.combatPointCost) * threatWeight * laneFactor * zFactor * 36;
          }

          return Math.min(320, utility);
        }

        getMatchupFactor(entry, target) {
          const counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;

          if (!target.entry || !counter) {
            return 1;
          }

          const counterScore = counter.getCounterScore(entry.family, target.entry.family);

          if (counterScore > 1.0001) {
            return counterScore;
          }

          return 1;
        }

        getReachabilityFactor(gameManager, team, entry, target) {
          if (this.isRangedFamily(entry.family)) {
            return this.isRangedSpawnSafe(target) ? 1 : 0.25;
          }

          const blockers = this.countAllyBlockersFromSpawnToTarget(gameManager, team, target);
          if (blockers <= 0) return 1;
          if (blockers === 1) return 0.8;
          return 0.55;
        }

        wouldImproveCoverage(target, addedCoveragePower) {
          if (target.hasStrugglingAlly) return true;
          if (target.coveragePower <= 0.0001) return true;
          const required = target.threatPower * this.coverageTargetRatio;
          const currentError = Math.abs(required - target.coveragePower);
          const projectedError = Math.abs(required - (target.coveragePower + addedCoveragePower));
          return projectedError < currentError - 0.0001;
        }

        isDirectLaneSpawnBlocked(lane, target) {
          if (!lane) return false;
          if (target.hasStrugglingAlly) return false;
          return target.allyAheadCount >= this.laneAllyAheadLimit && target.frontlineBlockPower >= target.threatPower * 0.55 && target.coverageRatio >= 0.65;
        }

        isRangedSpawnSafe(target) {
          if (target.allyFrontlineCount <= 0) {
            return false;
          }

          return target.frontlineHealthRatio >= 0.45 && target.frontlineBlockPower > 0;
        }

        countRangedSupportForTarget(target) {
          let count = 0;

          for (let i = 0; i < this.allyCount; i++) {
            const ally = this.allies[i];
            if (!ally.entry) continue;

            if (!this.isRangedFamily(ally.entry.family)) {
              continue;
            }

            if (ally.visualLaneId !== target.visualLaneId) {
              continue;
            }

            count++;
          }

          return count;
        }

        countMeleeWaves(waves, count) {
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

        hasOpenFlankLane(laneId) {
          return this.findOpenAdjacentLane(laneId) >= 0;
        }

        findBestFlankLane(gameManager, laneId) {
          const flank = this.findOpenAdjacentLane(laneId);

          if (flank >= 0) {
            return gameManager.clampLaneId(flank);
          }

          return -1;
        }

        findOpenAdjacentLane(laneId) {
          let bestLane = -1;
          let bestTraffic = Infinity;

          for (let offset = -1; offset <= 1; offset += 2) {
            const candidate = laneId + offset;
            const lane = this.lanes[candidate];
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

        countAllyBlockersFromSpawnToTarget(gameManager, team, target) {
          let blockers = 0;

          for (let i = 0; i < this.allyCount; i++) {
            const ally = this.allies[i];

            if (ally.visualLaneId !== target.visualLaneId) {
              continue;
            }

            if (this.isBetweenSpawnAndTarget(gameManager, team, ally.centerZ, target.centerZ)) {
              blockers++;
            }
          }

          return blockers;
        }

        countEnemyMeleeBlockersFromSpawnToTarget(gameManager, team, target) {
          let blockers = 0;

          for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];
            if (enemy === target) continue;
            if (!enemy.entry) continue;

            if (!this.isFrontlineFamily(enemy.entry.family)) {
              continue;
            }

            if (enemy.visualLaneId !== target.visualLaneId) {
              continue;
            }

            if (this.isBetweenSpawnAndTarget(gameManager, team, enemy.centerZ, target.centerZ)) {
              blockers++;
            }
          }

          return blockers;
        }

        hasEnemySpearBlockerFromSpawnToTarget(gameManager, team, target) {
          for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];
            if (enemy === target) continue;
            if (!enemy.entry) continue;

            if (enemy.entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Spear) {
              continue;
            }

            if (enemy.visualLaneId !== target.visualLaneId) {
              continue;
            }

            if (this.isBetweenSpawnAndTarget(gameManager, team, enemy.centerZ, target.centerZ)) {
              return true;
            }
          }

          return false;
        }

        isBetweenSpawnAndTarget(gameManager, team, z, targetZ) {
          const spawnZ = team === 0 ? gameManager.teamASpawnZ : gameManager.teamBSpawnZ;
          const minZ = Math.min(spawnZ, targetZ);
          const maxZ = Math.max(spawnZ, targetZ);
          return z >= minZ && z <= maxZ;
        }

        getEnemyClusterScore(target) {
          let score = 1;

          for (let i = 0; i < this.enemyCount; i++) {
            const enemy = this.enemies[i];
            if (enemy === target) continue;
            const laneDistance = Math.abs(enemy.visualLaneId - target.visualLaneId);
            const zDistance = Math.abs(enemy.centerZ - target.centerZ);

            if (laneDistance <= 1 && zDistance <= 4) {
              score += 0.35;
            }
          }

          score += Math.min(0.8, target.aliveCount / 10);
          return score;
        }

        getWaveCenter(wave, intel) {
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

        findEntryForWave(gameManager, wave) {
          const database = gameManager.unitDatabase;
          if (!database) return null;
          const entries = database.getTeamEntries(wave.team);

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!entry) continue;

            if (entry.name === wave.unitName) {
              return entry;
            }
          }

          return null;
        }

        isValidWave(wave) {
          if (!wave) return false;
          if (wave.released) return false;
          if (wave.isDead()) return false;
          return true;
        }

        isFrontlineFamily(family) {
          return family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer && family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk;
        }

        isRangedFamily(family) {
          return family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer || family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk;
        }

        getEnemyBuffer() {
          while (this.enemies.length <= this.enemyCount) {
            this.enemies.push(new BattlefieldWaveIntel());
          }

          return this.enemies[this.enemyCount++];
        }

        getAllyBuffer() {
          while (this.allies.length <= this.allyCount) {
            this.allies.push(new BattlefieldWaveIntel());
          }

          return this.allies[this.allyCount++];
        }

        ensureLaneCount(laneCount) {
          for (let i = this.lanes.length; i < laneCount; i++) {
            this.lanes.push(new BattlefieldLaneIntel());
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3059efe5a8001a7903bdba2c18b5364525c08d92.js.map