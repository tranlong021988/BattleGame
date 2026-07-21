System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, UnitFamily, CounterSettings, BattlefieldLaneIntel, BattlefieldWaveIntel, BattleSpawnDecision, BattlefieldEvaluator, _crd;

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
    BattleSpawnDecision: void 0,
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
          this.allyMeleeWaveCount = 0;
          this.enemyWaveCount = 0;
          this.trafficCount = 0;
        }

        reset(laneId) {
          this.laneId = laneId;
          this.allyWaveCount = 0;
          this.allyMeleeWaveCount = 0;
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

      });

      _export("BattleSpawnDecision", BattleSpawnDecision = class BattleSpawnDecision {
        constructor() {
          this.entry = null;
          this.target = null;
          this.laneId = -1;
          this.aggressiveForward = false;
          this.reason = '';
          this.score = -Infinity;
        }

        reset() {
          this.entry = null;
          this.target = null;
          this.laneId = -1;
          this.aggressiveForward = false;
          this.reason = '';
          this.score = -Infinity;
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
          this.spawnDecision = new BattleSpawnDecision();
        }

        chooseSnapshotSpawnDecision(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId) {
          if (blockedMeleeLaneId === void 0) {
            blockedMeleeLaneId = -1;
          }

          this.spawnDecision.reset();

          if (affordableEntries.length <= 0) {
            return this.spawnDecision;
          }

          if (this.enemyCount <= 0) {
            return this.chooseOpeningPressureDecision(gameManager, affordableEntries, blockedMeleeLaneId);
          }

          var rangedSupportCount = this.countRangedSupportAllies();
          var meleeSupportCount = this.countMeleeWaves(this.allies, this.allyCount);
          var currentCombatPoint = gameManager.getCombatPoint(team);

          for (var i = 0; i < this.enemyCount; i++) {
            var target = this.enemies[i];

            if (!this.isActionableTarget(target)) {
              continue;
            }

            var targetPriority = this.getSnapshotTargetPriority(target);
            if (targetPriority <= 0) continue;
            var hasFullStrengthRangedHardCounter = this.hasAffordableFullStrengthRangedHardCounter(affordableEntries, target);

            for (var j = 0; j < affordableEntries.length; j++) {
              var entry = affordableEntries[j];
              var score = this.scoreSnapshotEntryForTarget(gameManager, team, entry, target, targetPriority, currentCombatPoint, rangedSupportCount, meleeSupportCount, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter);

              if (score <= this.spawnDecision.score) {
                continue;
              }

              var laneId = this.chooseSpawnLaneForTarget(gameManager, team, target, entry, blockedMeleeLaneId);

              if (laneId < 0) {
                continue;
              }

              this.spawnDecision.entry = entry;
              this.spawnDecision.target = target;
              this.spawnDecision.laneId = laneId;
              this.spawnDecision.aggressiveForward = this.shouldSpawnAggressive(entry, target, laneId);
              this.spawnDecision.reason = this.getSnapshotDecisionReason(entry, target);
              this.spawnDecision.score = score;
            }
          }

          return this.spawnDecision;
        }

        chooseOpeningPressureDecision(gameManager, affordableEntries, blockedMeleeLaneId) {
          var laneId = this.choosePressureLane(gameManager, blockedMeleeLaneId, false);

          if (laneId < 0) {
            return this.spawnDecision;
          }

          var entry = this.choosePressureEntry(affordableEntries);

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

        chooseFallbackSpawnDecision(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId) {
          if (blockedMeleeLaneId === void 0) {
            blockedMeleeLaneId = -1;
          }

          this.spawnDecision.reset();
          var entry = this.choosePressureEntry(affordableEntries);

          if (entry) {
            var laneId = this.choosePressureLane(gameManager, blockedMeleeLaneId, true);

            if (laneId >= 0) {
              this.spawnDecision.entry = entry;
              this.spawnDecision.target = null;
              this.spawnDecision.laneId = laneId;
              this.spawnDecision.aggressiveForward = true;
              this.spawnDecision.reason = 'snapshot-pressure-fallback';
              this.spawnDecision.score = 1;
              return this.spawnDecision;
            }
          }

          return this.chooseFallbackRangedSupportDecision(gameManager, team, affordableEntries, maxRangedSupportPerTarget);
        }

        isActionableTarget(target) {
          if (!target.wave || !target.entry) return false;
          if (target.aliveCount <= 0) return false;
          if (target.healthRatio <= 0.08) return false;
          return true;
        }

        chooseFallbackRangedSupportDecision(gameManager, team, affordableEntries, maxRangedSupportPerTarget) {
          var rangedSupportCount = this.countRangedSupportAllies();
          var meleeSupportCount = this.countMeleeWaves(this.allies, this.allyCount);

          for (var i = 0; i < this.enemyCount; i++) {
            var target = this.enemies[i];

            if (!this.isActionableTarget(target)) {
              continue;
            }

            var hasFullStrengthRangedHardCounter = this.hasAffordableFullStrengthRangedHardCounter(affordableEntries, target);

            for (var j = 0; j < affordableEntries.length; j++) {
              var entry = affordableEntries[j];

              if (!this.isRangedFamily(entry.family)) {
                continue;
              }

              var score = this.scoreSnapshotEntryForTarget(gameManager, team, entry, target, 0, Math.max(1, entry.combatPointCost), rangedSupportCount, meleeSupportCount, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter);

              if (score <= this.spawnDecision.score) {
                continue;
              }

              var laneId = target.visualLaneId >= 0 ? gameManager.clampLaneId(target.visualLaneId) : -1;

              if (laneId < 0) {
                continue;
              }

              this.spawnDecision.entry = entry;
              this.spawnDecision.target = target;
              this.spawnDecision.laneId = laneId;
              this.spawnDecision.aggressiveForward = false;
              this.spawnDecision.reason = this.getSnapshotDecisionReason(entry, target);
              this.spawnDecision.score = score;
            }
          }

          return this.spawnDecision;
        }

        getSnapshotTargetPriority(target) {
          var liveGapRatio = target.threatPower > 0 ? (target.threatPower * this.coverageTargetRatio - target.coveragePower) / target.threatPower : 0;
          var needsHelp = Math.max(0, liveGapRatio);
          var unengagedPressure = target.hasEngaged ? 0 : 180;
          var rescuePressure = target.hasStrugglingAlly ? 220 : 0;
          var dangerPressure = target.dangerousToDefend ? 450 + target.progressToDefend * 280 : target.progressToDefend * 160;

          if (needsHelp <= 0 && !target.dangerousToDefend && !target.hasStrugglingAlly) {
            return 0;
          }

          var frontlineFactor = 1 / (1 + target.sameLaneEnemyAheadCount * 0.65);
          return (target.threatPower * (0.35 + needsHelp) + unengagedPressure + rescuePressure + dangerPressure) * frontlineFactor;
        }

        scoreSnapshotEntryForTarget(gameManager, team, entry, target, targetPriority, currentCombatPoint, rangedSupportCount, meleeSupportCount, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter) {
          if (!target.entry) return -Infinity;
          var ranged = this.isRangedFamily(entry.family);
          var hardCounter = this.isHardCounterEntryForTarget(entry, target);
          var targetCountersEntry = this.isTargetHardCounterForEntry(entry, target);

          if (ranged) {
            if (!this.isSnapshotRangedSupportAllowed(entry, target, rangedSupportCount, meleeSupportCount, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter)) {
              return -Infinity;
            }
          }

          if (!this.isEntryViableForTarget(entry, target)) {
            return -Infinity;
          }

          var candidatePower = this.getEntryCoveragePower(gameManager, team, entry, target);

          if (candidatePower <= 0) {
            return -Infinity;
          }

          if (ranged) {
            return this.scoreSnapshotRangedSupportEntry(entry, target, targetPriority, candidatePower, hardCounter);
          }

          var fullTargetBasePower = this.getEntryBasePower(target.entry, Math.max(1, target.entry.unitCount), 1, 1);
          var targetLivePowerRatio = Math.max(0, Math.min(1, target.basePower / Math.max(1, fullTargetBasePower)));

          if (targetCountersEntry && !hardCounter && targetLivePowerRatio > 0.35) {
            return -Infinity;
          }

          var requiredPower = Math.max(1, target.threatPower * this.coverageTargetRatio - target.coveragePower);
          var liveGapPower = Math.max(0, requiredPower);
          var usefulPower = Math.min(candidatePower, Math.max(1, liveGapPower) * 1.15);
          var needRatio = candidatePower / Math.max(1, liveGapPower);
          var powerRatio = candidatePower / Math.max(1, target.threatPower);
          var cost = Math.max(1, entry.combatPointCost);
          var cpRatio = currentCombatPoint / cost;
          var canComfortablyAfford = cpRatio >= 1.7;
          var isHoldingSpawn = needRatio < 0.75;
          var overshoot = Math.max(0, needRatio - 1.25);
          var targetUrgency = target.dangerousToDefend ? 1 : target.hasStrugglingAlly ? Math.max(0.7, targetLivePowerRatio) : targetLivePowerRatio;
          var hardCounterBonus = hardCounter ? 90 + targetUrgency * 360 : 0;
          var reverseCounterPenalty = targetCountersEntry && !hardCounter ? 260 + targetLivePowerRatio * 320 : 0;
          var holdingPenalty = isHoldingSpawn ? 180 : 0;
          var strongEnoughBonus = powerRatio >= 1 ? 220 : powerRatio * 120;
          var fitScore = needRatio >= 0.95 ? 520 : needRatio * 360;
          var reusableEconomyScore = this.getEntryBasePower(entry, Math.max(1, entry.unitCount), 1, Math.max(1, target.aliveCount)) / cost * 4;
          var targetIsRanged = this.isRangedFamily(target.entry.family);
          var overshootPenaltyScale = targetIsRanged ? 90 : hardCounter ? targetUrgency >= 0.7 ? 160 : 300 : 320;
          var economyPreference = canComfortablyAfford ? 4.5 : 9.5;
          return targetPriority + fitScore + strongEnoughBonus + hardCounterBonus + usefulPower / cost * 24 + reusableEconomyScore - cost * economyPreference - overshoot * overshootPenaltyScale - reverseCounterPenalty - holdingPenalty + this.getSnapshotMeleeLadderBias(entry, target, canComfortablyAfford, targetLivePowerRatio) + Math.random() * 0.001;
        }

        scoreSnapshotRangedSupportEntry(entry, target, targetPriority, candidatePower, hardCounter) {
          var cost = Math.max(1, entry.combatPointCost);
          var fullStrengthCounter = hardCounter && this.isFullStrengthTarget(target);
          var baseSupportScore = targetPriority + candidatePower / cost * 20 - cost;

          if (fullStrengthCounter) {
            return 1000000 + baseSupportScore + Math.random() * 0.001;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer) {
            return 800000 + baseSupportScore + Math.random() * 0.001;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk) {
            return 900000 + baseSupportScore + Math.random() * 0.001;
          }

          return -Infinity;
        }

        isFullStrengthTarget(target) {
          return target.aliveRatio >= 0.95 && target.healthRatio >= 0.95;
        }

        getRequiredFrontlineCountForRangedSupport(entry, target) {
          if (this.isHardCounterEntryForTarget(entry, target) && this.isFullStrengthTarget(target)) {
            return 1;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk) {
            return 2;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer) {
            return 1;
          }

          return Infinity;
        }

        hasRecentSameRangedSupportInLane(laneId, family) {
          var latestWaveId = -1;
          var latestFamily = -1;

          for (var i = 0; i < this.allyCount; i++) {
            var ally = this.allies[i];
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

        hasRangedSupportLaneRoleRoom(entry, target) {
          if (target.engagedAllyFrontlineCount < this.getRequiredFrontlineCountForRangedSupport(entry, target)) {
            return false;
          }

          return !this.hasRecentSameRangedSupportInLane(target.visualLaneId, entry.family);
        }

        isSnapshotRangedSupportAllowed(entry, target, rangedSupportCount, meleeSupportCount, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter) {
          if (!this.isRangedSpawnSafe(target)) {
            return false;
          }

          if (!this.hasRangedSupportCapacity(rangedSupportCount, meleeSupportCount)) {
            return false;
          }

          if (this.countRangedSupportForTarget(target) >= Math.max(0, Math.floor(maxRangedSupportPerTarget))) {
            return false;
          }

          if (!this.hasRangedSupportLaneRoleRoom(entry, target)) {
            return false;
          }

          if (this.isHardCounterEntryForTarget(entry, target) && this.isFullStrengthTarget(target)) {
            return true;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk && hasFullStrengthRangedHardCounter) {
            return false;
          }

          return entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk || entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer;
        }

        hasAffordableFullStrengthRangedHardCounter(affordableEntries, target) {
          if (!this.isFullStrengthTarget(target)) {
            return false;
          }

          for (var i = 0; i < affordableEntries.length; i++) {
            var entry = affordableEntries[i];

            if (!this.isRangedFamily(entry.family)) {
              continue;
            }

            if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Monk) {
              continue;
            }

            if (this.isHardCounterEntryForTarget(entry, target)) {
              return true;
            }
          }

          return false;
        }

        getSnapshotMeleeLadderBias(entry, target, canComfortablyAfford, targetLivePowerRatio) {
          if (!target.entry) return 0;
          if (this.isRangedFamily(entry.family)) return 0;

          if (this.isRangedFamily(target.entry.family)) {
            return entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Cavalry ? 240 : 40;
          }

          var attackerRank = this.getMeleeLadderRank(entry.family);
          var defenderRank = this.getMeleeLadderRank(target.entry.family);

          if (attackerRank < 0 || defenderRank < 0) {
            return 0;
          }

          var rankDelta = attackerRank - defenderRank;
          var costDelta = entry.combatPointCost - target.entry.combatPointCost;
          var conditionScale = targetLivePowerRatio >= 0.65 ? 1 : targetLivePowerRatio >= 0.4 ? 0.55 : 0.25;

          if (rankDelta === 1) {
            if (costDelta > 8 && !canComfortablyAfford) {
              return 50 * conditionScale;
            }

            return 170 * conditionScale;
          }

          if (rankDelta === 0) {
            return 55 * conditionScale;
          }

          if (rankDelta > 1) {
            return canComfortablyAfford ? 25 * conditionScale : -110;
          }

          return -50 * conditionScale;
        }

        getMeleeLadderRank(family) {
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear) return 0;
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Sword) return 1;
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman) return 2;
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry) return 3;
          return -1;
        }

        getSnapshotDecisionReason(entry, target) {
          if (this.isRangedFamily(entry.family)) {
            return this.isHardCounterEntryForTarget(entry, target) ? 'snapshot-ranged-counter-support' : 'snapshot-ranged-strategic-support';
          }

          if (this.isHardCounterEntryForTarget(entry, target)) {
            return 'snapshot-hard-counter';
          }

          return 'snapshot-live-force-response';
        }

        countRangedSupportAllies() {
          var count = 0;

          for (var i = 0; i < this.allyCount; i++) {
            var ally = this.allies[i];
            if (!ally.entry) continue;

            if (!this.isRangedFamily(ally.entry.family)) {
              continue;
            }

            count++;
          }

          return count;
        }

        hasRangedSupportCapacity(rangedSupportCount, meleeSupportCount) {
          return rangedSupportCount < meleeSupportCount;
        }

        isHardCounterEntryForTarget(entry, target) {
          if (!target.entry) return false;
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter) return false;
          return counter.getCounterScore(entry.family, target.entry.family) > 1.0001;
        }

        isTargetHardCounterForEntry(entry, target) {
          if (!target.entry) return false;
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter) return false;
          return counter.getCounterScore(target.entry.family, entry.family) > 1.0001;
        }

        rebuild(gameManager, team) {
          var laneCount = gameManager.getSafeLaneCount();
          this.ensureLaneCount(laneCount);

          for (var i = 0; i < laneCount; i++) {
            this.lanes[i].reset(i);
          }

          this.enemyCount = 0;
          this.allyCount = 0;
          var waves = gameManager.waves;
          var enemyTeam = team === 0 ? 1 : 0;

          for (var _i = 0; _i < waves.length; _i++) {
            var wave = waves[_i];
            if (!this.isValidWave(wave)) continue;
            var entry = this.findEntryForWave(gameManager, wave);
            if (!entry) continue;
            var intel = wave.team === team ? this.getAllyBuffer() : wave.team === enemyTeam ? this.getEnemyBuffer() : null;
            if (!intel) continue;
            this.fillWaveIntel(gameManager, intel, wave, entry, team);
            var lane = this.lanes[intel.visualLaneId];

            if (lane) {
              lane.trafficCount++;

              if (wave.team === team) {
                lane.allyWaveCount++;

                if (this.isFrontlineFamily(entry.family)) {
                  lane.allyMeleeWaveCount++;
                }
              } else {
                lane.enemyWaveCount++;
              }
            }
          }

          for (var _i2 = 0; _i2 < this.enemyCount; _i2++) {
            this.fillEnemyTacticalState(gameManager, team, this.enemies[_i2]);
          }
        }

        chooseSpawnLaneForTarget(gameManager, team, target, entry, blockedMeleeLaneId) {
          if (blockedMeleeLaneId === void 0) {
            blockedMeleeLaneId = -1;
          }

          if (!target.wave) return -1;
          var directLane = this.getTacticalLaneId(target);
          var lane = this.lanes[directLane];
          var directBlocked = this.isDirectLaneSpawnBlocked(lane, target);

          if (this.isRangedFamily(entry.family)) {
            return this.isRangedSpawnSafe(target) ? directLane : -1;
          }

          if (directLane === blockedMeleeLaneId) {
            var _flankLane = this.findBestFlankLane(gameManager, directLane);

            return _flankLane >= 0 ? _flankLane : -1;
          }

          if (!directBlocked || target.hasStrugglingAlly || target.dangerousToDefend) {
            return directLane;
          }

          var flankLane = this.findBestFlankLane(gameManager, directLane);

          if (flankLane >= 0) {
            return flankLane;
          }

          return -1;
        }

        shouldSpawnAggressive(entry, target, spawnLaneId) {
          if (!target.entry) return true;

          if (this.isRangedFamily(entry.family)) {
            return false;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry && this.isRangedFamily(target.entry.family) && target.enemyMeleeBlockersFromSpawn <= 1 && !target.hasEnemySpearBlockerFromSpawn) {
            return true;
          }

          return false;
        }

        choosePressureLane(gameManager, blockedMeleeLaneId, requireEmptyLane) {
          if (blockedMeleeLaneId === void 0) {
            blockedMeleeLaneId = -1;
          }

          if (requireEmptyLane === void 0) {
            requireEmptyLane = false;
          }

          var bestLane = -1;
          var bestScore = -Infinity;
          var laneCount = gameManager.getSafeLaneCount();

          for (var i = 0; i < laneCount; i++) {
            var lane = this.lanes[i];
            if (!lane) continue;

            if (i === blockedMeleeLaneId && laneCount > 1) {
              continue;
            }

            if (requireEmptyLane && (lane.allyWaveCount > 0 || lane.enemyWaveCount > 0)) {
              continue;
            }

            var score = (lane.enemyWaveCount <= 0 ? 80 : 0) - lane.trafficCount * 24 - lane.allyMeleeWaveCount * 28 - lane.allyWaveCount * 10 + Math.random() * 0.001;

            if (score > bestScore) {
              bestScore = score;
              bestLane = i;
            }
          }

          return bestLane;
        }

        choosePressureEntry(affordableEntries) {
          var nonCavalryEntry = this.choosePressureEntryByEconomy(affordableEntries, false);

          if (nonCavalryEntry) {
            return nonCavalryEntry;
          }

          return this.choosePressureEntryByEconomy(affordableEntries, true);
        }

        choosePressureEntryByEconomy(affordableEntries, allowCavalry) {
          var best = null;
          var bestScore = -Infinity;

          for (var i = 0; i < affordableEntries.length; i++) {
            var entry = affordableEntries[i];

            if (this.isRangedFamily(entry.family)) {
              continue;
            }

            if (!allowCavalry && entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Cavalry) {
              continue;
            }

            var power = this.getEntryBasePower(entry, Math.max(1, entry.unitCount), 1, 1);
            var cost = Math.max(1, entry.combatPointCost);
            var score = power / cost * 18 + Math.sqrt(power) * 4 - cost * 2.2 + entry.maxSpeed + Math.random() * 0.001;

            if (score > bestScore) {
              bestScore = score;
              best = entry;
            }
          }

          return best;
        }

        fillWaveIntel(gameManager, intel, wave, entry, team) {
          intel.reset();
          intel.wave = wave;
          intel.entry = entry;
          intel.aliveCount = wave.getAliveCount();
          intel.aliveRatio = wave.getAliveRatio();
          intel.healthRatio = wave.getRuntimeHealthRatio(gameManager.frame);
          intel.hasEngaged = wave.hasEngagedRuntime(gameManager.frame);
          this.getWaveCenter(wave, intel);
          intel.visualLaneId = gameManager.getNearestLaneIdForX(intel.centerX);
          intel.laneId = wave.laneId >= 0 ? gameManager.clampLaneId(wave.laneId) : intel.visualLaneId;
          intel.basePower = this.getEntryBasePower(entry, intel.aliveCount, intel.healthRatio, 1);

          if (wave.team !== team) {
            this.fillThreatDistance(gameManager, team, intel);
          }
        }

        fillThreatDistance(gameManager, team, intel) {
          var ownSpawnZ = team === 0 ? gameManager.teamASpawnZ : gameManager.teamBSpawnZ;
          var enemySpawnZ = team === 0 ? gameManager.teamBSpawnZ : gameManager.teamASpawnZ;
          var totalDistance = Math.max(0.0001, Math.abs(enemySpawnZ - ownSpawnZ));
          intel.distanceToDefend = Math.abs(intel.centerZ - ownSpawnZ);
          intel.progressToDefend = Math.max(0, Math.min(1, Math.abs(intel.centerZ - enemySpawnZ) / totalDistance));
          intel.dangerousToDefend = intel.progressToDefend >= this.dangerousThreatProgress;
          intel.threatPower = intel.basePower * (1 + intel.progressToDefend * 0.8 + (intel.dangerousToDefend ? 0.8 : 0));
          intel.threatScore = intel.threatPower + intel.progressToDefend * 250;
        }

        fillEnemyTacticalState(gameManager, team, target) {
          target.allyBlockersFromSpawn = this.countAllyBlockersFromSpawnToTarget(gameManager, team, target);
          target.enemyMeleeBlockersFromSpawn = this.countEnemyMeleeBlockersFromSpawnToTarget(gameManager, team, target);
          target.sameLaneEnemyAheadCount = this.countSameLaneEnemiesAheadOfTarget(gameManager, team, target);
          target.hasEnemySpearBlockerFromSpawn = this.hasEnemySpearBlockerFromSpawnToTarget(gameManager, team, target);
          target.coveragePower = 0;
          target.hasStrugglingAlly = false;
          target.allyAheadCount = 0;
          target.allyFrontlineCount = 0;
          target.engagedAllyFrontlineCount = 0;
          target.frontlineBlockPower = 0;
          target.frontlineHealthRatio = 0;

          for (var i = 0; i < this.allyCount; i++) {
            var ally = this.allies[i];
            if (!ally.wave || !ally.entry) continue;

            if (ally.visualLaneId !== target.visualLaneId) {
              continue;
            }

            if (!this.isBetweenSpawnAndTarget(gameManager, team, ally.centerZ, target.centerZ)) {
              continue;
            }

            target.allyAheadCount++;

            if (this.isFrontlineFamily(ally.entry.family)) {
              var blockPower = ally.basePower * (0.65 + ally.healthRatio * 0.7);
              target.allyFrontlineCount++;

              if (ally.hasEngaged) {
                target.engagedAllyFrontlineCount++;
              }

              target.frontlineBlockPower += blockPower;
              target.frontlineHealthRatio += ally.healthRatio;
            }

            var relation = this.getCoveragePowerAgainstTarget(gameManager, team, ally.entry, ally.basePower, target);
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
          var matchup = this.getMatchupFactor(entry, target);
          var reachability = this.getReachabilityFactor(gameManager, team, entry, target);
          return basePower * matchup * reachability;
        }

        getEntryCoveragePower(gameManager, team, entry, target) {
          var basePower = this.getEntryBasePower(entry, Math.max(1, Math.floor(entry.unitCount)), 1, target.aliveCount);
          return this.getCoveragePowerAgainstTarget(gameManager, team, entry, basePower, target);
        }

        getEntryBasePower(entry, aliveCount, healthRatio, targetAliveCount) {
          var count = Math.max(0, aliveCount);
          var avgInterval = Math.max(0.05, (Math.max(0.05, entry.attackIntervalMin) + Math.max(0.05, entry.attackIntervalMax)) * 0.5);
          var hitDamage = Math.max(1, entry.damage);
          var dps = count * hitDamage / avgInterval;
          var durability = Math.max(1, entry.health) * count * Math.max(0, healthRatio) * (1 + Math.max(0, entry.defense) * 0.045);
          var rangeFactor = 1 + Math.min(7, Math.max(0, entry.attackRange)) * (this.isRangedFamily(entry.family) ? 0.08 : 0.02);
          var speedFactor = 1 + Math.min(7, Math.max(0, entry.maxSpeed)) * (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry ? 0.06 : 0.025);
          var aoeFactor = 1 + Math.min(1.5, Math.max(0, entry.damageRadius)) * Math.min(1.4, Math.max(1, targetAliveCount) / 6);
          return Math.sqrt(Math.max(1, dps) * Math.max(1, durability)) * rangeFactor * speedFactor * aoeFactor;
        }

        isEntryViableForTarget(entry, target) {
          var lane = this.lanes[target.visualLaneId];
          if (!lane) return false;

          if (this.isDirectLaneSpawnBlocked(lane, target) && !target.hasStrugglingAlly && !target.dangerousToDefend) {
            var flankAvailable = this.hasOpenFlankLane(target.visualLaneId);

            if (!flankAvailable) {
              return false;
            }
          }

          if (this.isRangedFamily(entry.family)) {
            if (!this.isRangedSpawnSafe(target)) {
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

        getMatchupFactor(entry, target) {
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;

          if (!target.entry || !counter) {
            return 1;
          }

          var counterScore = counter.getCounterScore(entry.family, target.entry.family);

          if (counterScore > 1.0001) {
            return counterScore;
          }

          return 1;
        }

        getReachabilityFactor(gameManager, team, entry, target) {
          if (this.isRangedFamily(entry.family)) {
            return this.isRangedSpawnSafe(target) ? 1 : 0.25;
          }

          var blockers = this.countAllyBlockersFromSpawnToTarget(gameManager, team, target);
          if (blockers <= 0) return 1;
          if (blockers === 1) return 0.8;
          return 0.55;
        }

        isDirectLaneSpawnBlocked(lane, target) {
          if (!lane) return false;
          if (target.hasStrugglingAlly) return false;

          if (lane.allyMeleeWaveCount >= 3 && target.sameLaneEnemyAheadCount > 0) {
            return true;
          }

          return target.allyAheadCount >= this.laneAllyAheadLimit && target.frontlineBlockPower >= target.threatPower * 0.55 && target.coverageRatio >= 0.65;
        }

        isRangedSpawnSafe(target) {
          if (target.allyFrontlineCount <= 0) {
            return false;
          }

          if (target.engagedAllyFrontlineCount <= 0) {
            return false;
          }

          return target.frontlineBlockPower > 0;
        }

        countRangedSupportForTarget(target) {
          var count = 0;

          for (var i = 0; i < this.allyCount; i++) {
            var ally = this.allies[i];
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
          var total = 0;

          for (var i = 0; i < count; i++) {
            var wave = waves[i];
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
          var flank = this.findOpenAdjacentLane(laneId);

          if (flank >= 0) {
            return gameManager.clampLaneId(flank);
          }

          return -1;
        }

        findOpenAdjacentLane(laneId) {
          var bestLane = -1;
          var bestTraffic = Infinity;

          for (var offset = -1; offset <= 1; offset += 2) {
            var candidate = laneId + offset;
            var lane = this.lanes[candidate];
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
          var blockers = 0;

          for (var i = 0; i < this.allyCount; i++) {
            var ally = this.allies[i];

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
          var blockers = 0;

          for (var i = 0; i < this.enemyCount; i++) {
            var enemy = this.enemies[i];
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

        countSameLaneEnemiesAheadOfTarget(gameManager, team, target) {
          var count = 0;

          for (var i = 0; i < this.enemyCount; i++) {
            var enemy = this.enemies[i];
            if (enemy === target) continue;
            if (!enemy.entry) continue;

            if (enemy.visualLaneId !== target.visualLaneId) {
              continue;
            }

            if (this.isBetweenSpawnAndTarget(gameManager, team, enemy.centerZ, target.centerZ)) {
              count++;
            }
          }

          return count;
        }

        hasEnemySpearBlockerFromSpawnToTarget(gameManager, team, target) {
          for (var i = 0; i < this.enemyCount; i++) {
            var enemy = this.enemies[i];
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
          var spawnZ = team === 0 ? gameManager.teamASpawnZ : gameManager.teamBSpawnZ;
          var minZ = Math.min(spawnZ, targetZ);
          var maxZ = Math.max(spawnZ, targetZ);
          return z >= minZ && z <= maxZ;
        }

        getWaveCenter(wave, intel) {
          var count = 0;
          var sumX = 0;
          var sumZ = 0;

          for (var i = 0; i < wave.units.length; i++) {
            var unit = wave.units[i];
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
          var database = gameManager.unitDatabase;
          if (!database) return null;
          var entries = database.getTeamEntries(wave.team);

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
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
          for (var i = this.lanes.length; i < laneCount; i++) {
            this.lanes.push(new BattlefieldLaneIntel());
          }
        }

        getTacticalLaneId(target) {
          return target.visualLaneId >= 0 ? target.visualLaneId : target.laneId;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3059efe5a8001a7903bdba2c18b5364525c08d92.js.map