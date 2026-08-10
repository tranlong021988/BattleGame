System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, UnitFamily, CounterSettings, BattlefieldLaneIntel, BattlefieldWaveIntel, BattleSpawnDecision, BattleSpawnCandidate, BattleResponseReservation, BattlefieldEvaluator, _crd, CPStrategyState;

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

      });

      BattleSpawnCandidate = class BattleSpawnCandidate {
        constructor() {
          this.entry = null;
          this.target = null;
          this.laneId = -1;
          this.aggressiveForward = false;
          this.reason = '';
          this.score = -Infinity;
          this.cpStrategyState = '';
        }

        set(entry, target, laneId, aggressiveForward, reason, score, cpStrategyState) {
          this.entry = entry;
          this.target = target;
          this.laneId = laneId;
          this.aggressiveForward = aggressiveForward;
          this.reason = reason;
          this.score = score;
          this.cpStrategyState = cpStrategyState;
        }

      };

      _export("CPStrategyState", CPStrategyState = /*#__PURE__*/function (CPStrategyState) {
        CPStrategyState["Opening"] = "opening";
        CPStrategyState["Abundant"] = "abundant";
        CPStrategyState["Normal"] = "normal";
        CPStrategyState["Efficient"] = "efficient";
        CPStrategyState["Desperate"] = "desperate";
        return CPStrategyState;
      }({}));

      BattleResponseReservation = class BattleResponseReservation {
        constructor() {
          this.targetWaveId = -1;
          this.responseWaveId = -1;
          this.responseFamily = -1;
          this.coveragePower = 0;
          this.frame = 0;
        }

      };

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
          this.allyFrontlinePower = 0;
          this.enemyFrontlineThreatPower = 0;
          this.spawnDecision = new BattleSpawnDecision();
          this.spawnCandidates = [];
          this.spawnCandidateCount = 0;
          this.responseReservations = [];
          this.responseReservationFrames = 180;
        }

        resetSpawnCandidates() {
          this.spawnCandidateCount = 0;
        }

        addSpawnCandidate(entry, target, laneId, aggressiveForward, reason, score, cpStrategyState) {
          if (!Number.isFinite(score)) return;
          var candidate = this.spawnCandidates[this.spawnCandidateCount];

          if (!candidate) {
            candidate = new BattleSpawnCandidate();
            this.spawnCandidates[this.spawnCandidateCount] = candidate;
          }

          candidate.set(entry, target, laneId, aggressiveForward, reason, score, cpStrategyState);
          this.spawnCandidateCount++;
        }

        chooseCandidateByAccuracy(decisionAccuracy) {
          this.spawnDecision.reset();
          var count = this.spawnCandidateCount;

          if (count <= 0) {
            return this.spawnDecision;
          }

          var accuracy = this.clamp01(decisionAccuracy);
          var bestIndex = 0;
          var bestScore = this.spawnCandidates[0].score;

          for (var i = 1; i < count; i++) {
            var score = this.spawnCandidates[i].score;

            if (score > bestScore) {
              bestScore = score;
              bestIndex = i;
            }
          }

          var selectedIndex = bestIndex;
          var selectionRoll = 0;
          var eligibleCount = this.getEligibleCandidateCount(bestIndex);
          var mistakeEligibleCount = this.getMistakeEligibleCandidateCount(bestIndex);

          if (accuracy <= 0 && mistakeEligibleCount <= 0 && this.isAccurateResponseCandidate(this.spawnCandidates[bestIndex])) {
            return this.spawnDecision;
          }

          if (mistakeEligibleCount > 0) {
            selectionRoll = Math.random();

            if (selectionRoll >= accuracy) {
              selectedIndex = this.chooseNonBestCandidateByAccuracy(bestIndex, accuracy);
            }
          }

          var selected = this.spawnCandidates[selectedIndex];
          var rank = this.getCandidateRank(selectedIndex, bestIndex);
          var quality = this.getRankQuality(rank, eligibleCount);
          this.spawnDecision.entry = selected.entry;
          this.spawnDecision.bestEntry = this.spawnCandidates[bestIndex].entry;
          this.spawnDecision.target = selected.target;
          this.spawnDecision.laneId = selected.laneId;
          this.spawnDecision.aggressiveForward = selected.aggressiveForward;
          this.spawnDecision.reason = selected.reason;
          this.spawnDecision.score = selected.score;
          this.spawnDecision.bestScore = bestScore;
          this.spawnDecision.selectedRank = rank;
          this.spawnDecision.candidateCount = eligibleCount;
          this.spawnDecision.selectionQuality = quality;
          this.spawnDecision.qualityRatio = bestScore > 0 ? selected.score / bestScore : quality;
          this.spawnDecision.selectionRoll = selectionRoll;
          this.spawnDecision.cpStrategyState = selected.cpStrategyState;
          return this.spawnDecision;
        }

        chooseNonBestCandidateByAccuracy(bestIndex, accuracy) {
          var eligibleCount = this.getEligibleCandidateCount(bestIndex);
          var selectedIndex = bestIndex;
          var totalWeight = 0;

          for (var i = 0; i < this.spawnCandidateCount; i++) {
            if (!this.isDeliberateMistakeCandidate(i, bestIndex)) {
              continue;
            }

            var rank = this.getCandidateRank(i, bestIndex);
            if (rank <= 0) continue;
            totalWeight += this.getMistakeRankWeight(rank, eligibleCount, accuracy);
          }

          if (totalWeight <= 0) {
            return bestIndex;
          }

          var roll = Math.random() * totalWeight;

          for (var _i = 0; _i < this.spawnCandidateCount; _i++) {
            if (!this.isDeliberateMistakeCandidate(_i, bestIndex)) {
              continue;
            }

            var _rank = this.getCandidateRank(_i, bestIndex);

            if (_rank <= 0) continue;
            roll -= this.getMistakeRankWeight(_rank, eligibleCount, accuracy);

            if (roll <= 0) {
              selectedIndex = _i;
              break;
            }
          }

          return selectedIndex;
        }

        getMistakeEligibleCandidateCount(bestIndex) {
          var count = 0;

          for (var i = 0; i < this.spawnCandidateCount; i++) {
            if (this.isDeliberateMistakeCandidate(i, bestIndex)) {
              count++;
            }
          }

          return count;
        }

        isDeliberateMistakeCandidate(index, bestIndex) {
          if (!this.isCandidateSameAnchor(index, bestIndex)) {
            return false;
          }

          if (this.getCandidateRank(index, bestIndex) <= 0) {
            return false;
          }

          var candidate = this.spawnCandidates[index];
          var best = this.spawnCandidates[bestIndex];

          if (!candidate.entry || !best.entry) {
            return false;
          }

          if (candidate.entry.family === best.entry.family) {
            return false;
          }

          return !this.isAccurateResponseCandidate(candidate);
        }

        isAccurateResponseCandidate(candidate) {
          if (!candidate.entry || !candidate.target) {
            return false;
          }

          if (candidate.reason === 'snapshot-hard-counter' || candidate.reason === 'snapshot-ranged-counter-support') {
            return true;
          }

          return this.isHardCounterEntryForTarget(candidate.entry, candidate.target);
        }

        getEligibleCandidateCount(anchorIndex) {
          var count = 0;

          for (var i = 0; i < this.spawnCandidateCount; i++) {
            if (this.isCandidateSameAnchor(i, anchorIndex)) {
              count++;
            }
          }

          return count;
        }

        isCandidateSameAnchor(index, anchorIndex) {
          var candidate = this.spawnCandidates[index];
          var anchor = this.spawnCandidates[anchorIndex];

          if (candidate.laneId !== anchor.laneId) {
            return false;
          }

          var candidateWaveId = candidate.target && candidate.target.wave ? candidate.target.wave.id : -1;
          var anchorWaveId = anchor.target && anchor.target.wave ? anchor.target.wave.id : -1;
          return candidateWaveId === anchorWaveId;
        }

        getCandidateRank(index, anchorIndex) {
          var score = this.spawnCandidates[index].score;
          var rank = 0;

          for (var i = 0; i < this.spawnCandidateCount; i++) {
            if (!this.isCandidateSameAnchor(i, anchorIndex)) {
              continue;
            }

            if (this.spawnCandidates[i].score > score) {
              rank++;
            }
          }

          return rank;
        }

        getRankQuality(rank, count) {
          if (count <= 1) {
            return 1;
          }

          return 1 - Math.max(0, rank) / Math.max(1, count - 1);
        }

        getMistakeRankWeight(rank, count, accuracy) {
          var quality = this.getRankQuality(rank, count);
          var badQuality = 1 - quality;
          return Math.max(0.0001, quality * accuracy + badQuality * (1 - accuracy));
        }

        recordSpawnReservation(gameManager, team, target, entry, responseWave, frame) {
          if (!target || !target.wave || !target.entry) return;
          if (!responseWave) return;
          var basePower = this.getEntryBasePower(entry, Math.max(1, Math.floor(entry.unitCount)), 1, Math.max(1, target.aliveCount));
          var reservation = new BattleResponseReservation();
          reservation.targetWaveId = target.wave.id;
          reservation.responseWaveId = responseWave.id;
          reservation.responseFamily = entry.family;
          reservation.coveragePower = this.getCoveragePowerAgainstTarget(gameManager, team, entry, basePower, target);
          reservation.frame = frame;
          this.responseReservations.push(reservation);

          if (this.responseReservations.length > 64) {
            this.responseReservations.splice(0, this.responseReservations.length - 64);
          }
        }

        chooseSnapshotSpawnDecision(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId, decisionAccuracy, forceOpening, preferredOpeningLaneId) {
          if (blockedMeleeLaneId === void 0) {
            blockedMeleeLaneId = -1;
          }

          if (decisionAccuracy === void 0) {
            decisionAccuracy = 1;
          }

          if (forceOpening === void 0) {
            forceOpening = false;
          }

          if (preferredOpeningLaneId === void 0) {
            preferredOpeningLaneId = -1;
          }

          this.spawnDecision.reset();
          this.resetSpawnCandidates();

          if (affordableEntries.length <= 0) {
            return this.spawnDecision;
          }

          if (forceOpening || this.enemyCount <= 0) {
            return this.chooseOpeningPressureDecision(gameManager, affordableEntries, blockedMeleeLaneId, preferredOpeningLaneId);
          }

          var currentCombatPoint = gameManager.getCombatPoint(team);
          var enemyCombatPoint = gameManager.getCombatPoint(team === 0 ? 1 : 0);
          var cpStrategyState = this.getCPStrategyState(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId, currentCombatPoint, enemyCombatPoint, decisionAccuracy);

          for (var i = 0; i < this.enemyCount; i++) {
            var target = this.enemies[i];

            if (!this.isActionableTarget(target)) {
              continue;
            }

            var targetPriority = this.getSnapshotTargetPriority(target);
            var hasFullStrengthRangedHardCounter = this.hasAffordableFullStrengthRangedHardCounter(affordableEntries, target);

            for (var j = 0; j < affordableEntries.length; j++) {
              var entry = affordableEntries[j];
              var score = this.scoreSnapshotEntryForTarget(gameManager, team, entry, target, targetPriority, currentCombatPoint, enemyCombatPoint, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter, cpStrategyState, decisionAccuracy);
              if (!Number.isFinite(score)) continue;
              var laneId = this.chooseSpawnLaneForTarget(gameManager, team, target, entry, blockedMeleeLaneId);

              if (laneId < 0) {
                continue;
              }

              this.addSpawnCandidate(entry, target, laneId, this.shouldSpawnAggressive(entry, target, laneId), this.getSnapshotDecisionReason(entry, target), score, cpStrategyState);
            }
          }

          return this.chooseCandidateByAccuracy(decisionAccuracy);
        }

        chooseOpeningPressureDecision(gameManager, affordableEntries, blockedMeleeLaneId, preferredLaneId) {
          if (preferredLaneId === void 0) {
            preferredLaneId = -1;
          }

          var laneCount = gameManager.getSafeLaneCount();
          var laneId = preferredLaneId >= 0 && preferredLaneId < laneCount ? Math.floor(preferredLaneId) : this.choosePressureLane(gameManager, blockedMeleeLaneId, false);

          if (laneId < 0) {
            return this.spawnDecision;
          }

          var averagePower = this.getAverageOpeningFrontlinePower(affordableEntries);

          if (averagePower <= 0) {
            return this.spawnDecision;
          }

          var selectedEntry = null;
          var selectedDistance = Number.POSITIVE_INFINITY;

          for (var i = 0; i < affordableEntries.length; i++) {
            var entry = affordableEntries[i];

            if (!this.isOpeningFrontlineFamily(entry.family)) {
              continue;
            }

            var power = this.getEntryBasePower(entry, 1, 1, 1);
            var distance = Math.abs(power - averagePower);

            if (distance < selectedDistance || distance === selectedDistance && this.compareOpeningEntries(entry, selectedEntry) < 0) {
              selectedEntry = entry;
              selectedDistance = distance;
            }
          }

          if (!selectedEntry) {
            return this.spawnDecision;
          }

          this.addSpawnCandidate(selectedEntry, null, laneId, true, 'snapshot-opening-pressure', 1000 - selectedDistance, CPStrategyState.Opening);
          return this.chooseCandidateByAccuracy(1);
        }

        getAverageOpeningFrontlinePower(affordableEntries) {
          var candidateCount = 0;
          var totalPower = 0;

          for (var i = 0; i < affordableEntries.length; i++) {
            var entry = affordableEntries[i];

            if (!this.isOpeningFrontlineFamily(entry.family)) {
              continue;
            }

            candidateCount++;
            totalPower += this.getEntryBasePower(entry, 1, 1, 1);
          }

          if (candidateCount <= 0) {
            return 0;
          }

          return totalPower / candidateCount;
        }

        compareOpeningEntries(a, b) {
          if (!b) return -1;

          if (a.family !== b.family) {
            return a.family - b.family;
          }

          if (a.tier !== b.tier) {
            return a.tier - b.tier;
          }

          return a.name.localeCompare(b.name);
        }

        isOpeningFrontlineFamily(family) {
          return family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear || family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Sword || family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman || family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry;
        }

        getFallbackCPStrategyState(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId, decisionAccuracy) {
          var currentCombatPoint = gameManager.getCombatPoint(team);
          var enemyCombatPoint = gameManager.getCombatPoint(team === 0 ? 1 : 0);
          return this.getCPStrategyState(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId, currentCombatPoint, enemyCombatPoint, decisionAccuracy);
        }

        getCPStrategyState(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId, currentCombatPoint, enemyCombatPoint, decisionAccuracy) {
          if (currentCombatPoint > enemyCombatPoint && this.canSpawnPremiumAndRemainAhead(currentCombatPoint, enemyCombatPoint, affordableEntries)) {
            return CPStrategyState.Abundant;
          }

          if (this.enemyCount > 0 && !this.hasAffordableEffectiveResponse(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId, decisionAccuracy)) {
            return CPStrategyState.Desperate;
          }

          var normalBand = Math.max(this.getCheapestAffordableCost(affordableEntries), enemyCombatPoint * 0.12);
          var cpGap = currentCombatPoint - enemyCombatPoint;

          if (Math.abs(cpGap) <= normalBand) {
            return CPStrategyState.Normal;
          }

          if (cpGap < 0) {
            return CPStrategyState.Efficient;
          }

          return CPStrategyState.Normal;
        }

        getCheapestAffordableCost(affordableEntries) {
          var cost = Infinity;

          for (var i = 0; i < affordableEntries.length; i++) {
            cost = Math.min(cost, Math.max(1, affordableEntries[i].combatPointCost));
          }

          return Number.isFinite(cost) ? cost : 1;
        }

        canSpawnPremiumAndRemainAhead(currentCombatPoint, enemyCombatPoint, affordableEntries) {
          for (var i = 0; i < affordableEntries.length; i++) {
            var entry = affordableEntries[i];

            if (!this.isFrontlineFamily(entry.family)) {
              continue;
            }

            if (this.getMeleeLadderRank(entry.family) < 2) {
              continue;
            }

            if (currentCombatPoint - Math.max(1, entry.combatPointCost) > enemyCombatPoint) {
              return true;
            }
          }

          return false;
        }

        hasAffordableEffectiveResponse(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId, decisionAccuracy) {
          for (var i = 0; i < this.enemyCount; i++) {
            var target = this.enemies[i];

            if (!this.isActionableTarget(target)) {
              continue;
            }

            var hasFullStrengthRangedHardCounter = this.hasAffordableFullStrengthRangedHardCounter(affordableEntries, target);

            for (var j = 0; j < affordableEntries.length; j++) {
              var entry = affordableEntries[j];

              if (this.isRangedFamily(entry.family) && !this.isSnapshotRangedSupportAllowed(entry, target, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter, decisionAccuracy)) {
                continue;
              }

              if (!this.isEntryViableForTarget(entry, target)) {
                continue;
              }

              var laneId = this.chooseSpawnLaneForTarget(gameManager, team, target, entry, blockedMeleeLaneId);

              if (laneId < 0) {
                continue;
              }

              if (this.isHardCounterEntryForTarget(entry, target)) {
                return true;
              }

              if (this.getFullMatchupPowerRatio(entry, target) >= 0.95) {
                return true;
              }

              if (target.healthRatio <= 0.35 && this.getFullMatchupPowerRatio(entry, target) >= 0.5) {
                return true;
              }
            }
          }

          return false;
        }

        chooseFallbackSpawnDecision(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId, decisionAccuracy) {
          if (blockedMeleeLaneId === void 0) {
            blockedMeleeLaneId = -1;
          }

          if (decisionAccuracy === void 0) {
            decisionAccuracy = 1;
          }

          this.spawnDecision.reset();
          this.resetSpawnCandidates();
          var cpStrategyState = this.getFallbackCPStrategyState(gameManager, team, affordableEntries, maxRangedSupportPerTarget, blockedMeleeLaneId, decisionAccuracy);
          var laneId = this.choosePressureLane(gameManager, blockedMeleeLaneId, cpStrategyState !== CPStrategyState.Desperate);

          if (laneId >= 0) {
            if (cpStrategyState === CPStrategyState.Desperate) {
              this.addDesperateFallbackCandidates(affordableEntries, laneId, cpStrategyState, decisionAccuracy);
            } else {
              this.addPressureEntryCandidates(affordableEntries, laneId, cpStrategyState, decisionAccuracy);
            }

            if (this.spawnCandidateCount > 0) {
              return this.chooseCandidateByAccuracy(decisionAccuracy);
            }
          }

          return this.chooseFallbackRangedSupportDecision(gameManager, team, affordableEntries, maxRangedSupportPerTarget, decisionAccuracy);
        }

        chooseLastStandSpawnDecision(gameManager, team, affordableEntries, blockedMeleeLaneId, decisionAccuracy) {
          if (blockedMeleeLaneId === void 0) {
            blockedMeleeLaneId = -1;
          }

          if (decisionAccuracy === void 0) {
            decisionAccuracy = 1;
          }

          this.spawnDecision.reset();
          this.resetSpawnCandidates();
          var laneId = this.choosePressureLane(gameManager, blockedMeleeLaneId, false);

          if (laneId < 0) {
            return this.spawnDecision;
          }

          for (var i = 0; i < affordableEntries.length; i++) {
            var entry = affordableEntries[i];
            var power = this.getEntryBasePower(entry, Math.max(1, entry.unitCount), 1, 1);
            var cost = Math.max(1, entry.combatPointCost);
            var rank = this.isRangedFamily(entry.family) ? 0 : Math.max(0, this.getMeleeLadderRank(entry.family));
            var score = this.getPressureEntryScore(power, cost, rank, entry.maxSpeed, CPStrategyState.Desperate) - this.getPressureCavalrySpearLanePenalty(entry, laneId, decisionAccuracy) + Math.random() * 0.001;
            this.addSpawnCandidate(entry, null, laneId, true, 'snapshot-last-stand-fallback', score, CPStrategyState.Desperate);
          }

          if (this.spawnCandidateCount <= 0) {
            return this.spawnDecision;
          }

          return this.chooseCandidateByAccuracy(decisionAccuracy);
        }

        addDesperateFallbackCandidates(affordableEntries, laneId, cpStrategyState, decisionAccuracy) {
          for (var i = 0; i < affordableEntries.length; i++) {
            var entry = affordableEntries[i];

            if (this.isRangedFamily(entry.family)) {
              continue;
            }

            var power = this.getEntryBasePower(entry, Math.max(1, entry.unitCount), 1, 1);
            var cost = Math.max(1, entry.combatPointCost);
            var score = power * 0.35 - cost * 0.15 + entry.maxSpeed * 3 - this.getPressureCavalrySpearLanePenalty(entry, laneId, decisionAccuracy) + Math.random() * 0.001;
            this.addSpawnCandidate(entry, null, laneId, true, 'snapshot-desperate-fallback', score, cpStrategyState);
          }
        }

        addPressureEntryCandidates(affordableEntries, laneId, cpStrategyState, decisionAccuracy) {
          var startCount = this.spawnCandidateCount;

          if (cpStrategyState === CPStrategyState.Abundant || cpStrategyState === CPStrategyState.Desperate) {
            this.addPressureEntryCandidatesByEconomy(affordableEntries, laneId, true, cpStrategyState, decisionAccuracy);
            return;
          }

          this.addPressureEntryCandidatesByEconomy(affordableEntries, laneId, false, cpStrategyState, decisionAccuracy);

          if (this.spawnCandidateCount > startCount) {
            return;
          }

          this.addPressureEntryCandidatesByEconomy(affordableEntries, laneId, true, cpStrategyState, decisionAccuracy);
        }

        addPressureEntryCandidatesByEconomy(affordableEntries, laneId, allowCavalry, cpStrategyState, decisionAccuracy) {
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
            var rank = this.getMeleeLadderRank(entry.family);
            var score = this.getPressureEntryScore(power, cost, Math.max(0, rank), entry.maxSpeed, cpStrategyState) - this.getPressureCavalrySpearLanePenalty(entry, laneId, decisionAccuracy) + Math.random() * 0.001;
            this.addSpawnCandidate(entry, null, laneId, true, 'snapshot-pressure-fallback', score, cpStrategyState);
          }
        }

        isActionableTarget(target) {
          if (!target.wave || !target.entry) return false;
          if (target.aliveCount <= 0) return false;
          if (target.healthRatio <= 0.08) return false;
          return true;
        }

        chooseFallbackRangedSupportDecision(gameManager, team, affordableEntries, maxRangedSupportPerTarget, decisionAccuracy) {
          if (decisionAccuracy === void 0) {
            decisionAccuracy = 1;
          }

          this.spawnDecision.reset();
          this.resetSpawnCandidates();
          var currentCombatPoint = gameManager.getCombatPoint(team);
          var enemyCombatPoint = gameManager.getCombatPoint(team === 0 ? 1 : 0);
          var cpStrategyState = this.getCPStrategyState(gameManager, team, affordableEntries, maxRangedSupportPerTarget, -1, currentCombatPoint, enemyCombatPoint, decisionAccuracy);

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

              var score = this.scoreSnapshotEntryForTarget(gameManager, team, entry, target, 0, currentCombatPoint, enemyCombatPoint, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter, cpStrategyState, decisionAccuracy);
              if (!Number.isFinite(score)) continue;
              var laneId = target.visualLaneId >= 0 ? gameManager.clampLaneId(target.visualLaneId) : -1;

              if (laneId < 0) {
                continue;
              }

              this.addSpawnCandidate(entry, target, laneId, false, this.getSnapshotDecisionReason(entry, target), score, cpStrategyState);
            }
          }

          return this.chooseCandidateByAccuracy(decisionAccuracy);
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

        getRangedSupportTargetPriority(target) {
          if (!target.entry) return 0;

          if (!this.isRangedSpawnSafe(target)) {
            return 0;
          }

          var engagedFrontline = Math.min(3, target.engagedAllyFrontlineCount);
          var threatPressure = Math.min(260, target.threatPower * 0.16);
          var engagedPressure = engagedFrontline * 90;
          var packedLanePressure = Math.min(3, target.sameLaneEnemyAheadCount) * 45;
          var dangerPressure = target.dangerousToDefend ? 180 + target.progressToDefend * 160 : target.progressToDefend * 90;
          var rangedThreatPressure = this.hasEngagedEnemyRangedInLane(target.visualLaneId) ? 130 : 0;
          var fullStrengthPressure = this.isFullStrengthTarget(target) ? 90 : 0;
          return 120 + threatPressure + engagedPressure + packedLanePressure + dangerPressure + rangedThreatPressure + fullStrengthPressure;
        }

        scoreSnapshotEntryForTarget(gameManager, team, entry, target, targetPriority, currentCombatPoint, enemyCombatPoint, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter, cpStrategyState, decisionAccuracy) {
          if (!target.entry) return -Infinity;
          var ranged = this.isRangedFamily(entry.family);
          var hardCounter = this.isHardCounterEntryForTarget(entry, target);
          var targetCountersEntry = this.isTargetHardCounterForEntry(entry, target);

          if (ranged) {
            if (!this.isSnapshotRangedSupportAllowed(entry, target, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter, decisionAccuracy)) {
              return -Infinity;
            }
          } else if (targetPriority <= 0) {
            return -Infinity;
          }

          if (!this.isEntryViableForTarget(entry, target)) {
            return -Infinity;
          }

          var candidatePower = this.getEntryCoveragePower(gameManager, team, entry, target);

          if (candidatePower <= 0) {
            return -Infinity;
          }

          if (ranged) {
            var supportPriority = targetPriority > 0 ? targetPriority : this.getRangedSupportTargetPriority(target);

            if (supportPriority <= 0) {
              return -Infinity;
            }

            return this.scoreSnapshotRangedSupportEntry(entry, target, supportPriority, candidatePower, hardCounter, cpStrategyState, decisionAccuracy);
          }

          var fullTargetBasePower = this.getEntryBasePower(target.entry, Math.max(1, target.entry.unitCount), 1, 1);
          var targetLivePowerRatio = Math.max(0, Math.min(1, target.basePower / Math.max(1, fullTargetBasePower)));

          if (targetCountersEntry && !hardCounter && targetLivePowerRatio > 0.35 && !this.isCavalrySpearRisk(entry, target)) {
            return -Infinity;
          }

          var requiredPower = Math.max(1, target.threatPower * this.coverageTargetRatio - target.coveragePower);
          var liveGapPower = Math.max(0, requiredPower);
          var usefulPower = Math.min(candidatePower, Math.max(1, liveGapPower) * 1.15);
          var needRatio = candidatePower / Math.max(1, liveGapPower);
          var powerRatio = candidatePower / Math.max(1, target.threatPower);
          var cost = Math.max(1, entry.combatPointCost);
          var cpRatio = currentCombatPoint / cost;
          var canComfortablyAfford = cpRatio >= this.getComfortableAffordRatio(cpStrategyState);
          var isHoldingSpawn = cpStrategyState === CPStrategyState.Efficient && needRatio < 0.75;
          var overshoot = Math.max(0, needRatio - 1.25);
          var targetUrgency = target.dangerousToDefend ? 1 : target.hasStrugglingAlly ? Math.max(0.7, targetLivePowerRatio) : targetLivePowerRatio;
          var hardCounterBonus = hardCounter ? 90 + targetUrgency * 360 : 0;
          var reverseCounterPenalty = targetCountersEntry && !hardCounter ? 260 + targetLivePowerRatio * 320 : 0;
          var cavalrySpearRiskPenalty = this.getCavalrySpearRiskPenalty(entry, target, decisionAccuracy);
          var holdingPenalty = isHoldingSpawn ? 180 : 0;
          var strongEnoughBonus = powerRatio >= 1 ? 220 : powerRatio * 120;
          var fitScore = needRatio >= 0.95 ? 520 : needRatio * 360;
          var reusableEconomyScore = this.getEntryBasePower(entry, Math.max(1, entry.unitCount), 1, Math.max(1, target.aliveCount)) / cost * 4;
          var targetIsRanged = this.isRangedFamily(target.entry.family);
          var overshootPenaltyScale = targetIsRanged ? 90 : this.getOvershootPenaltyScale(cpStrategyState, hardCounter, targetUrgency);
          var economyPreference = this.getEconomyPreference(cpStrategyState, canComfortablyAfford, currentCombatPoint, enemyCombatPoint, cost);
          return targetPriority + fitScore + strongEnoughBonus + hardCounterBonus + usefulPower / cost * 24 + reusableEconomyScore - cost * economyPreference - overshoot * overshootPenaltyScale - reverseCounterPenalty - cavalrySpearRiskPenalty - holdingPenalty + this.getSnapshotMeleeLadderBias(entry, target, cpStrategyState, canComfortablyAfford, targetLivePowerRatio) + Math.random() * 0.001;
        }

        getEconomyPreference(cpStrategyState, canComfortablyAfford, currentCombatPoint, enemyCombatPoint, cost) {
          if (cpStrategyState === CPStrategyState.Abundant) {
            return 1.5;
          }

          if (cpStrategyState === CPStrategyState.Normal) {
            return canComfortablyAfford ? 2.4 : 4.2;
          }

          if (cpStrategyState === CPStrategyState.Desperate) {
            return 0.8;
          }

          var basePreference = canComfortablyAfford ? 4.5 : 9.5;
          var postSpawnAdvantage = currentCombatPoint - cost - enemyCombatPoint;

          if (postSpawnAdvantage <= 0) {
            return basePreference;
          }

          var advantageRatio = Math.min(1, postSpawnAdvantage / Math.max(1, enemyCombatPoint));
          return Math.max(1.5, basePreference - advantageRatio * 3);
        }

        getComfortableAffordRatio(cpStrategyState) {
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

        getOvershootPenaltyScale(cpStrategyState, hardCounter, targetUrgency) {
          if (cpStrategyState === CPStrategyState.Abundant) {
            return hardCounter ? 80 : 110;
          }

          if (cpStrategyState === CPStrategyState.Normal) {
            return hardCounter ? 110 : 150;
          }

          if (cpStrategyState === CPStrategyState.Desperate) {
            return 70;
          }

          return hardCounter ? targetUrgency >= 0.7 ? 160 : 300 : 320;
        }

        scoreSnapshotRangedSupportEntry(entry, target, targetPriority, candidatePower, hardCounter, cpStrategyState, decisionAccuracy) {
          var cost = Math.max(1, entry.combatPointCost);
          var expectedDps = this.getExpectedRangedSupportDps(entry, target);
          var roleBonus = this.getRangedSupportRoleBonus(entry, target, hardCounter);

          if (!Number.isFinite(roleBonus)) {
            return -Infinity;
          }

          var accuracyScale = this.clamp01(decisionAccuracy);
          return (targetPriority * 0.75 + roleBonus + this.getRangedSupportNeedScore(target) + candidatePower / cost * 18 + expectedDps / cost * 140) * accuracyScale - cost * this.getRangedSupportCostPenaltyScale(cpStrategyState) + Math.random() * 0.001;
        }

        getRangedSupportRoleBonus(entry, target, hardCounter) {
          var fullStrengthCounter = hardCounter && this.isFullStrengthTarget(target);

          if (fullStrengthCounter) {
            return 620;
          }

          if (hardCounter) {
            return 430;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk) {
            var expectedTargets = this.getExpectedRangedSupportTargetsHit(entry, target);

            if (this.isMonkBlockedEnemyLaneSupportTarget(target)) {
              return 520 + expectedTargets * 95;
            }

            return this.isMonkSiegeSupportTarget(entry, target) ? 260 + expectedTargets * 65 : 180 + expectedTargets * 35;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer) {
            return this.hasEngagedEnemyRangedInLane(target.visualLaneId) ? 230 : 150;
          }

          return -Infinity;
        }

        getRangedSupportNeedScore(target) {
          var coverageNeed = Math.max(0, 1 - target.coverageRatio);
          var frontlineSurplus = target.threatPower > 0 ? target.frontlineBlockPower / Math.max(1, target.threatPower) : 1;
          var surplusBonus = Math.max(0, Math.min(1, frontlineSurplus - 1)) * 120;
          var engagedBonus = Math.min(3, target.engagedAllyFrontlineCount) * 35;
          var dangerBonus = target.dangerousToDefend ? 120 : 0;
          var rangedThreatBonus = this.hasEngagedEnemyRangedInLane(target.visualLaneId) ? 100 : 0;
          return coverageNeed * 260 + surplusBonus + engagedBonus + dangerBonus + rangedThreatBonus;
        }

        getExpectedRangedSupportDps(entry, target) {
          if (!target.entry) return 0;
          var damage = Math.max(1, entry.damage - target.entry.defense);
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          var damageMultiplier = counter ? Math.max(1, counter.getCounterScore(entry.family, target.entry.family)) : 1;
          var interval = Math.max(0.1, (Math.max(0, entry.attackIntervalMin) + Math.max(0, entry.attackIntervalMax)) * 0.5);
          var expectedTargets = this.getExpectedRangedSupportTargetsHit(entry, target);
          return Math.max(1, entry.unitCount) * damage * damageMultiplier * expectedTargets / interval;
        }

        getExpectedRangedSupportTargetsHit(entry, target) {
          if (entry.damageRadius <= 0) {
            return 1;
          }

          var remainingTargets = Math.max(0, target.aliveCount - 1);
          var radiusFactor = Math.max(0, entry.damageRadius) * 1.35;
          var frontlineFactor = Math.min(3, target.engagedAllyFrontlineCount) * 0.6;
          var packedLaneFactor = Math.min(2, target.sameLaneEnemyAheadCount) * 0.35;
          var engagedFactor = target.hasEngaged ? 0.45 : 0;
          var blockFactor = target.frontlineBlockPower >= target.threatPower ? 0.45 : 0;
          var expectedAreaTargets = Math.min(remainingTargets, radiusFactor + frontlineFactor + packedLaneFactor + engagedFactor + blockFactor);
          return Math.min(5, 1 + Math.max(0, expectedAreaTargets));
        }

        getRangedSupportCostPenaltyScale(cpStrategyState) {
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
            return 1;
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

        isSnapshotRangedSupportAllowed(entry, target, maxRangedSupportPerTarget, hasFullStrengthRangedHardCounter, decisionAccuracy) {
          if (!this.isRangedSpawnSafe(target)) {
            return false;
          }

          if (this.countRangedSupportForTarget(target) >= this.getAccuracyScaledRangedSupportLimit(maxRangedSupportPerTarget, decisionAccuracy)) {
            return false;
          }

          if (!this.hasRangedSupportLaneRoleRoom(entry, target)) {
            return false;
          }

          var fullStrengthHardCounter = this.isHardCounterEntryForTarget(entry, target) && this.isFullStrengthTarget(target);
          var monkSiegeSupport = this.isMonkSiegeSupportTarget(entry, target);

          if (!this.hasFrontlineSurplusForRangedSupport(target)) {
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

        hasFrontlineSurplusForRangedSupport(target) {
          if (!target.entry) return false;

          if (!this.hasFrontlineAdvantageForRangedSupport(target)) {
            return false;
          }

          var localRequiredRatio = Math.max(0.35, this.coverageTargetRatio * 0.45);
          var localRequiredPower = target.threatPower * localRequiredRatio;

          if (target.frontlineBlockPower < localRequiredPower) {
            return false;
          }

          if (this.enemyFrontlineThreatPower <= 0) {
            return true;
          }

          var globalRequiredRatio = Math.max(0.3, this.coverageTargetRatio * 0.35);
          var globalRequiredPower = this.enemyFrontlineThreatPower * globalRequiredRatio;
          return this.allyFrontlinePower >= globalRequiredPower;
        }

        hasFrontlineAdvantageForRangedSupport(target) {
          if (target.threatPower <= 0) {
            return true;
          }

          var frontlineRatio = target.frontlineBlockPower / Math.max(1, target.threatPower);

          if (frontlineRatio < 0.8) {
            return false;
          }

          if (target.frontlineHealthRatio < 0.45 && target.coverageRatio < 1) {
            return false;
          }

          return target.coverageRatio >= 0.85 || frontlineRatio >= 1;
        }

        isMonkSiegeSupportTarget(entry, target) {
          if (entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk) {
            return false;
          }

          if (!target.entry || !target.hasEngaged) {
            return false;
          }

          if (!this.isFrontlineFamily(target.entry.family)) {
            return false;
          }

          return target.engagedAllyFrontlineCount >= this.getRequiredFrontlineCountForRangedSupport(entry, target);
        }

        isMonkBlockedEnemyLaneSupportTarget(target) {
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

          return this.hasFrontlineAdvantageForRangedSupport(target);
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

        getSnapshotMeleeLadderBias(entry, target, cpStrategyState, canComfortablyAfford, targetLivePowerRatio) {
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
            if (cpStrategyState === CPStrategyState.Normal) {
              return 720 * conditionScale;
            }

            if (cpStrategyState === CPStrategyState.Abundant) {
              return 620 * conditionScale;
            }

            if (costDelta > 8 && !canComfortablyAfford) {
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
              return rankDelta === 2 ? 440 * conditionScale : 180 * conditionScale;
            }

            if (cpStrategyState === CPStrategyState.Normal) {
              return -120 * conditionScale;
            }

            return canComfortablyAfford ? 25 * conditionScale : -110;
          }

          if (cpStrategyState === CPStrategyState.Abundant) {
            return -90 * conditionScale;
          }

          if (cpStrategyState === CPStrategyState.Normal) {
            return -180 * conditionScale;
          }

          return -50 * conditionScale;
        }

        getCavalrySpearRiskPenalty(entry, target, decisionAccuracy) {
          if (!this.isCavalrySpearRisk(entry, target)) {
            return 0;
          }

          return this.getCavalrySpearPenaltyByAccuracy(decisionAccuracy);
        }

        getPressureCavalrySpearLanePenalty(entry, laneId, decisionAccuracy) {
          if (entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry) {
            return 0;
          }

          if (!this.hasActionableEnemySpearInLane(laneId)) {
            return 0;
          }

          return this.getCavalrySpearPenaltyByAccuracy(decisionAccuracy);
        }

        getCavalrySpearPenaltyByAccuracy(decisionAccuracy) {
          var accuracy = this.clamp01(decisionAccuracy);
          return 6000 + accuracy * 18000;
        }

        isCavalrySpearRisk(entry, target) {
          if (entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry) {
            return false;
          }

          if (target.entry && target.entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear) {
            return true;
          }

          if (target.hasEnemySpearBlockerFromSpawn) {
            return true;
          }

          return this.hasActionableEnemySpearInLane(target.visualLaneId);
        }

        hasActionableEnemySpearInLane(laneId) {
          if (laneId < 0) return false;

          for (var i = 0; i < this.enemyCount; i++) {
            var enemy = this.enemies[i];
            if (!enemy.entry) continue;
            if (enemy.visualLaneId !== laneId) continue;

            if (enemy.entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Spear) {
              continue;
            }

            if (!this.isActionableTarget(enemy)) {
              continue;
            }

            return true;
          }

          return false;
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

        getAccuracyScaledRangedSupportLimit(maxRangedSupportPerTarget, decisionAccuracy) {
          var maxLimit = Math.max(0, Math.floor(maxRangedSupportPerTarget));
          var accuracy = this.clamp01(decisionAccuracy);

          if (maxLimit <= 0 || accuracy <= 0) {
            return 0;
          }

          return Math.max(1, Math.ceil(maxLimit * accuracy));
        }

        hasGeneralRangedSupportNeed(target) {
          if (!this.isRangedSpawnSafe(target)) {
            return false;
          }

          if (this.hasEngagedEnemyRangedInLane(target.visualLaneId)) {
            return true;
          }

          if (target.hasEngaged) {
            return true;
          }

          if (target.sameLaneEnemyAheadCount > 0 && target.allyFrontlineCount > 0) {
            return true;
          }

          return target.coverageRatio < 1.1;
        }

        hasEngagedEnemyRangedInLane(laneId) {
          if (laneId < 0) return false;

          for (var i = 0; i < this.enemyCount; i++) {
            var enemy = this.enemies[i];
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

        getFullMatchupPowerRatio(entry, target) {
          if (!target.entry) return 1;
          var candidatePower = this.getEntryBasePower(entry, Math.max(1, Math.floor(entry.unitCount)), 1, Math.max(1, target.entry.unitCount)) * this.getMatchupPowerFactor(entry, target);
          var targetPower = this.getEntryBasePower(target.entry, Math.max(1, Math.floor(target.entry.unitCount)), 1, Math.max(1, entry.unitCount)) * (this.isTargetHardCounterForEntry(entry, target) ? this.getTargetMatchupPowerFactor(entry, target) : 1);
          return candidatePower / Math.max(1, targetPower);
        }

        getTargetMatchupPowerFactor(entry, target) {
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;

          if (!target.entry || !counter) {
            return 1;
          }

          var counterScore = counter.getCounterScore(target.entry.family, entry.family);
          return this.getCounterPowerFactor(counterScore);
        }

        rebuild(gameManager, team) {
          var laneCount = gameManager.getSafeLaneCount();
          this.ensureLaneCount(laneCount);

          for (var i = 0; i < laneCount; i++) {
            this.lanes[i].reset(i);
          }

          this.enemyCount = 0;
          this.allyCount = 0;
          this.allyFrontlinePower = 0;
          this.enemyFrontlineThreatPower = 0;
          var waves = gameManager.waves;
          var enemyTeam = team === 0 ? 1 : 0;

          for (var _i2 = 0; _i2 < waves.length; _i2++) {
            var wave = waves[_i2];
            if (!this.isValidWave(wave)) continue;
            var entry = this.findEntryForWave(gameManager, wave);
            if (!entry) continue;
            var intel = wave.team === team ? this.getAllyBuffer() : wave.team === enemyTeam ? this.getEnemyBuffer() : null;
            if (!intel) continue;
            this.fillWaveIntel(gameManager, intel, wave, entry, team);

            if (this.isFrontlineFamily(entry.family)) {
              if (wave.team === team) {
                this.allyFrontlinePower += this.getFrontlineHoldPower(intel);
              } else if (wave.team === enemyTeam) {
                this.enemyFrontlineThreatPower += Math.max(intel.basePower, intel.threatPower);
              }
            }

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

          for (var _i3 = 0; _i3 < this.enemyCount; _i3++) {
            this.fillEnemyTacticalState(gameManager, team, this.enemies[_i3]);
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

          if (directLane === blockedMeleeLaneId && !this.shouldBypassBlockedMeleeLane(target)) {
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

        shouldBypassBlockedMeleeLane(target) {
          return !!target && (target.hasStrugglingAlly || target.dangerousToDefend);
        }

        shouldSpawnAggressive(entry, target, spawnLaneId) {
          if (!target.entry) return true;

          if (this.isRangedFamily(entry.family)) {
            return false;
          }

          if (this.isCleanFrontlineLaneTarget(target, spawnLaneId)) {
            return true;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry && this.isRangedFamily(target.entry.family) && target.enemyMeleeBlockersFromSpawn <= 1 && !target.hasEnemySpearBlockerFromSpawn) {
            return true;
          }

          return false;
        }

        isCleanFrontlineLaneTarget(target, spawnLaneId) {
          if (spawnLaneId < 0) return false;
          if (target.visualLaneId < 0) return false;
          if (spawnLaneId !== target.visualLaneId) return false;
          if (target.sameLaneEnemyAheadCount > 0) return false;
          var lane = this.lanes[spawnLaneId];
          if (!lane) return false;
          return lane.allyWaveCount <= 0;
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

        getPressureEntryScore(power, cost, rank, speed, cpStrategyState) {
          if (cpStrategyState === CPStrategyState.Abundant) {
            return power * 0.22 + rank * 110 + speed * 8 - cost * 0.45;
          }

          if (cpStrategyState === CPStrategyState.Desperate) {
            return power * 0.25 + rank * 55 + speed * 4 - cost * 0.25;
          }

          if (cpStrategyState === CPStrategyState.Normal) {
            return power / cost * 12 + Math.sqrt(power) * 3 + rank * 35 - cost * 1.1 + speed;
          }

          return power / cost * 18 + Math.sqrt(power) * 4 - cost * 2.2 + speed;
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
              var blockPower = this.getFrontlineHoldPower(ally);
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

          target.coveragePower += this.getReservedCoveragePower(gameManager, target);
          target.coverageRatio = target.threatPower > 0 ? target.coveragePower / target.threatPower : 1;
        }

        getFrontlineHoldPower(intel) {
          return intel.basePower * (0.65 + intel.healthRatio * 0.7);
        }

        getCoveragePowerAgainstTarget(gameManager, team, entry, basePower, target) {
          var matchup = this.getMatchupPowerFactor(entry, target);
          var reachability = this.getReachabilityFactor(gameManager, team, entry, target);
          return basePower * matchup * reachability;
        }

        getReservedCoveragePower(gameManager, target) {
          if (!target.wave) return 0;
          var reservedPower = 0;
          var writeIndex = 0;

          for (var i = 0; i < this.responseReservations.length; i++) {
            var reservation = this.responseReservations[i];

            if (this.isResponseReservationActive(gameManager, reservation)) {
              this.responseReservations[writeIndex++] = reservation;

              if (reservation.targetWaveId === target.wave.id) {
                reservedPower += reservation.coveragePower;
              }
            }
          }

          this.responseReservations.length = writeIndex;
          return reservedPower;
        }

        isResponseReservationActive(gameManager, reservation) {
          if (gameManager.frame - reservation.frame > this.responseReservationFrames) {
            return false;
          }

          var targetWave = this.findWaveById(gameManager, reservation.targetWaveId);
          var responseWave = this.findWaveById(gameManager, reservation.responseWaveId);
          if (!this.isValidWave(targetWave)) return false;
          if (!this.isValidWave(responseWave)) return false;

          if (responseWave.hasEngagedRuntime(gameManager.frame)) {
            return false;
          }

          return true;
        }

        findWaveById(gameManager, waveId) {
          for (var i = 0; i < gameManager.waves.length; i++) {
            var wave = gameManager.waves[i];
            if (!wave) continue;

            if (wave.id === waveId) {
              return wave;
            }
          }

          return null;
        }

        getEntryCoveragePower(gameManager, team, entry, target) {
          var basePower = this.getEntryBasePower(entry, Math.max(1, Math.floor(entry.unitCount)), 1, target.aliveCount);
          return this.getCoveragePowerAgainstTarget(gameManager, team, entry, basePower, target);
        }

        getEntryBasePower(entry, aliveCount, healthRatio, _targetAliveCount) {
          var count = Math.max(0, aliveCount);
          var hitDamage = Math.max(1, entry.damage);
          var durability = Math.max(1, entry.health) * count * Math.max(0, healthRatio) * (1 + Math.max(0, entry.defense) * 0.045);
          return Math.sqrt(Math.max(1, count * hitDamage) * Math.max(1, durability));
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
          }), UnitFamily) : UnitFamily).Cavalry && target.hasEnemySpearBlockerFromSpawn) {
            return false;
          }

          if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry && target.entry && this.isRangedFamily(target.entry.family)) {
            return target.enemyMeleeBlockersFromSpawn <= 1 && !target.hasEnemySpearBlockerFromSpawn;
          }

          return true;
        }

        getMatchupPowerFactor(entry, target) {
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;

          if (!target.entry || !counter) {
            return 1;
          }

          var counterScore = counter.getCounterScore(entry.family, target.entry.family);
          return this.getCounterPowerFactor(counterScore);
        }

        getCounterPowerFactor(counterScore) {
          if (!Number.isFinite(counterScore)) {
            return 1;
          } // X-Power is the geometric mean of offense and durability.
          // A damage multiplier therefore contributes by its square root.


          return counterScore > 1.0001 ? Math.sqrt(counterScore) : 1;
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

        clamp01(value) {
          return Math.max(0, Math.min(1, value));
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3059efe5a8001a7903bdba2c18b5364525c08d92.js.map