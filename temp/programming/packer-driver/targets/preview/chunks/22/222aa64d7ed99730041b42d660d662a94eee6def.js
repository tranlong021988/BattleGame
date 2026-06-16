System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameManager, CounterSettings, unitTypeToName, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _crd, ccclass, property, ArmyBrainMode, ArmyBrain;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitPrefabEntry(extras) {
    _reporterNs.report("UnitPrefabEntry", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleWave(extras) {
    _reporterNs.report("BattleWave", "./BattleWave", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCounterSettings(extras) {
    _reporterNs.report("CounterSettings", "./CounterSettings", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitType(extras) {
    _reporterNs.report("UnitType", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfunitTypeToName(extras) {
    _reporterNs.report("unitTypeToName", "./BattleTypes", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      CounterSettings = _unresolved_3.CounterSettings;
    }, function (_unresolved_4) {
      unitTypeToName = _unresolved_4.unitTypeToName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d53d3tB+Y9P9qMKZ2Hz3I1T", "ArmyBrain", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      ArmyBrainMode = /*#__PURE__*/function (ArmyBrainMode) {
        ArmyBrainMode[ArmyBrainMode["Attack"] = 0] = "Attack";
        ArmyBrainMode[ArmyBrainMode["Defense"] = 1] = "Defense";
        return ArmyBrainMode;
      }(ArmyBrainMode || {});

      _export("ArmyBrain", ArmyBrain = (_dec = ccclass('ArmyBrain'), _dec2 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec(_class = (_class2 = class ArmyBrain extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "gameManager", _descriptor, this);

          _initializerDefineProperty(this, "team", _descriptor2, this);

          _initializerDefineProperty(this, "runOnlyWhenGameManagerAutoSpawnOff", _descriptor3, this);

          _initializerDefineProperty(this, "minSpawnInterval", _descriptor4, this);

          _initializerDefineProperty(this, "maxSpawnInterval", _descriptor5, this);

          _initializerDefineProperty(this, "maxBrainDeltaTime", _descriptor6, this);

          _initializerDefineProperty(this, "enableMaxAliveWaveLimit", _descriptor7, this);

          _initializerDefineProperty(this, "maxAliveWaves", _descriptor8, this);

          _initializerDefineProperty(this, "defenseWaveThreshold", _descriptor9, this);

          _initializerDefineProperty(this, "attackModeChance", _descriptor10, this);

          _initializerDefineProperty(this, "defenseModeChance", _descriptor11, this);

          _initializerDefineProperty(this, "preferUnengagedWaveInAttack", _descriptor12, this);

          _initializerDefineProperty(this, "ignoreNearlyDeadWaveRatio", _descriptor13, this);

          _initializerDefineProperty(this, "attackCounterCoverageRatio", _descriptor14, this);

          _initializerDefineProperty(this, "counterSameLaneChance", _descriptor15, this);

          _initializerDefineProperty(this, "laneAwareness", _descriptor16, this);

          _initializerDefineProperty(this, "flankAggression", _descriptor17, this);

          _initializerDefineProperty(this, "aiIntelligence", _descriptor18, this);

          _initializerDefineProperty(this, "spawnRandomIfNoThreat", _descriptor19, this);

          _initializerDefineProperty(this, "spawnOpeningWaveIfNoEnemyWave", _descriptor20, this);

          _initializerDefineProperty(this, "enableStateLog", _descriptor21, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor22, this);

          this.timer = 0;
          this.nextInterval = 3;
          this.currentMode = ArmyBrainMode.Attack;
          this.currentModeName = 'ATTACK';
        }

        start() {
          this.randomizeNextInterval();
        }

        update(deltaTime) {
          if (!this.gameManager) return;

          if (this.runOnlyWhenGameManagerAutoSpawnOff && this.gameManager.enableAutoSpawn) {
            return;
          }

          var safeDeltaTime = Math.min(deltaTime, Math.max(0.016, this.maxBrainDeltaTime));
          this.timer += safeDeltaTime;

          if (this.timer < this.nextInterval) {
            return;
          }

          this.timer = 0;
          this.randomizeNextInterval();
          this.thinkAndSpawn();
        }

        thinkAndSpawn() {
          if (!this.gameManager) return;

          if (!this.canSpawnMoreWave()) {
            this.debugLog("Skip spawn: aliveWaves=" + this.getAliveWaveCount(this.team) + " >= maxAliveWaves=" + this.maxAliveWaves);
            return;
          }

          var entries = this.gameManager.getTeamEntries(this.team);
          var validEntries = this.getValidEntries(entries);

          if (validEntries.length <= 0) {
            this.debugLog('Abort: no valid entries.');
            return;
          }

          var enemyTeam = this.team === 0 ? 1 : 0;
          var enemyWaves = this.gameManager.getWavesByTeam(enemyTeam);
          this.resolveMode(enemyWaves.length);
          this.stateLog("MODE=" + this.currentModeName + ", myWaves=" + this.getAliveWaveCount(this.team) + ", enemyWaves=" + enemyWaves.length + ", CP=" + Math.floor(this.gameManager.getCombatPoint(this.team)) + ", AI=" + this.getAIIntelligence().toFixed(2));

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

          var targetWave = this.findTargetWave();

          if (!targetWave) {
            if (this.spawnRandomIfNoThreat) {
              this.spawnRandom(validEntries, 'No valid target');
            }

            return;
          }

          var selectedEntry = this.chooseEntryAgainstWave(validEntries, targetWave);

          if (!selectedEntry) {
            this.debugLog('No affordable entry. Skip spawn.');
            return;
          }

          var selectedCounterScore = this.getCounterScore(selectedEntry.unitType, targetWave.unitType);
          var isRealCounter = this.isRealCounterScore(selectedCounterScore);
          this.debugLog("Decision: targetWave=" + targetWave.id + ", target=" + (_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(targetWave.unitType) + ", selected=" + selectedEntry.name + "/" + (_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(selectedEntry.unitType) + ", score=" + selectedCounterScore.toFixed(2) + ", isCounter=" + isRealCounter + ", CP=" + Math.floor(this.gameManager.getCombatPoint(this.team)) + ", cost=" + selectedEntry.combatPointCost + ", coverage=" + targetWave.getCounterCoverageRatio().toFixed(2) + ", lane=" + targetWave.laneId + ", engaged=" + targetWave.hasEngaged());
          var lanePressure = this.buildLanePressureSnapshot();
          var spawnLaneId = this.getCounterSpawnLaneId(targetWave, lanePressure);
          this.debugLog("Counter spawn lane: targetLane=" + targetWave.laneId + ", spawnLane=" + spawnLaneId + ", sameLaneChance=" + this.counterSameLaneChance.toFixed(2));
          var spawned = this.gameManager.spawnWaveByEntry(this.team, selectedEntry, spawnLaneId);

          if (spawned) {
            if (isRealCounter) {
              targetWave.addCounterAssignment(selectedEntry.unitCount);
              this.debugLog("Counter assignment added: wave=" + targetWave.id + ", +" + selectedEntry.unitCount + ", coverage=" + targetWave.getCounterCoverageRatio().toFixed(2));
            } else {
              this.debugLog("Spawned fallback/non-counter unit. No counter assignment added for wave=" + targetWave.id);
            }
          }
        }

        resolveMode(enemyAliveWaveCount) {
          var myWaves = this.getAliveWaveCount(this.team);
          var threshold = Math.max(0, Math.floor(this.defenseWaveThreshold));
          var shouldDefense = myWaves <= threshold && enemyAliveWaveCount > myWaves;

          if (shouldDefense) {
            var _roll = Math.random();

            var _correct = _roll <= this.defenseModeChance;

            this.currentMode = _correct ? ArmyBrainMode.Defense : ArmyBrainMode.Attack;
            this.currentModeName = _correct ? 'DEFENSE' : 'DEFENSE_MISREAD_TO_ATTACK';
            return;
          }

          var roll = Math.random();
          var correct = roll <= this.attackModeChance;
          this.currentMode = correct ? ArmyBrainMode.Attack : ArmyBrainMode.Defense;
          this.currentModeName = correct ? 'ATTACK' : 'ATTACK_MISREAD_TO_DEFENSE';
        }

        findTargetWave() {
          if (this.currentMode === ArmyBrainMode.Defense) {
            return this.findNearestThreatWaveForDefense();
          }

          return this.findInterceptThreatWaveForAttack();
        }

        findInterceptThreatWaveForAttack() {
          if (!this.gameManager) return null;
          var enemyTeam = this.team === 0 ? 1 : 0;
          var waves = this.gameManager.getWavesByTeam(enemyTeam);
          var best = null;
          var bestScore = -Infinity;
          var defendPoint = this.getDefendPoint();

          for (var i = 0; i < waves.length; i++) {
            var wave = waves[i];
            if (!this.isValidAttackThreatWave(wave)) continue;
            var aliveRatio = wave.getAliveRatio();
            var engaged = wave.hasEngaged();
            var distSq = wave.getClosestDistanceSqTo(defendPoint.x, defendPoint.z);
            var dist = Math.sqrt(distSq);
            var distanceScore = Math.max(0, 100 - dist);
            var uncovered = Math.max(0, this.attackCounterCoverageRatio - wave.getCounterCoverageRatio());
            var score = 0;
            score += aliveRatio * 100;
            score += distanceScore;
            score += uncovered * 40;

            if (this.preferUnengagedWaveInAttack && !engaged) {
              score += 50;
            }

            if (score > bestScore) {
              bestScore = score;
              best = wave;
            }
          }

          return best;
        }

        findNearestThreatWaveForDefense() {
          if (!this.gameManager) return null;
          var enemyTeam = this.team === 0 ? 1 : 0;
          var waves = this.gameManager.getWavesByTeam(enemyTeam);
          var best = null;
          var bestScore = -Infinity;
          var defendPoint = this.getDefendPoint();

          for (var i = 0; i < waves.length; i++) {
            var wave = waves[i];
            if (!this.isValidDefenseThreatWave(wave)) continue;
            var distSq = wave.getClosestDistanceSqTo(defendPoint.x, defendPoint.z);
            var aliveRatio = wave.getAliveRatio();
            var dist = Math.sqrt(distSq);
            var distanceScore = Math.max(0, 120 - dist);
            var score = 0;
            score += distanceScore;
            score += aliveRatio * 70;

            if (score > bestScore) {
              bestScore = score;
              best = wave;
            }
          }

          return best;
        }

        isValidAttackThreatWave(wave) {
          if (!this.isAliveThreatWave(wave)) return false;

          if (wave.isCounterCovered(this.attackCounterCoverageRatio)) {
            this.debugLog("Skip attack target wave=" + wave.id + ": coverage=" + wave.getCounterCoverageRatio().toFixed(2) + " >= " + this.attackCounterCoverageRatio);
            return false;
          }

          return true;
        }

        isValidDefenseThreatWave(wave) {
          if (!this.isAliveThreatWave(wave)) return false;
          var engaged = wave.hasEngaged();
          var covered = wave.isCounterCovered(this.attackCounterCoverageRatio);

          if (!engaged && covered) {
            this.debugLog("Skip defense target wave=" + wave.id + ": not engaged and coverage=" + wave.getCounterCoverageRatio().toFixed(2) + " >= " + this.attackCounterCoverageRatio);
            return false;
          }

          return true;
        }

        isAliveThreatWave(wave) {
          if (!wave) return false;
          if (wave.isDead()) return false;
          var aliveRatio = wave.getAliveRatio();

          if (aliveRatio < this.ignoreNearlyDeadWaveRatio) {
            return false;
          }

          return true;
        }

        buildLanePressureSnapshot() {
          var result = [];

          if (!this.gameManager) {
            return result;
          }

          var laneCount = this.gameManager.getSafeLaneCount();

          for (var i = 0; i < laneCount; i++) {
            result.push({
              enemyThreat: 0,
              allyDefense: 0,
              enemyCount: 0,
              allyCount: 0
            });
          }

          var waves = this.gameManager.waves;
          var enemyTeam = this.team === 0 ? 1 : 0;

          for (var _i = 0; _i < waves.length; _i++) {
            var wave = waves[_i];
            if (!wave) continue;
            if (wave.released) continue;
            if (wave.laneId < 0) continue;
            var lane = this.gameManager.clampLaneId(wave.laneId);
            var info = result[lane];
            if (!info) continue;

            if (wave.team === enemyTeam) {
              info.enemyCount++;
              info.enemyThreat++;
            } else if (wave.team === this.team) {
              info.allyCount++;
              info.allyDefense++;
            }
          }

          return result;
        }

        chooseEntryAgainstWave(entries, targetWave) {
          var affordableEntries = this.getAffordableEntries(entries);

          if (affordableEntries.length <= 0) {
            return null;
          }

          var intelligence = this.getAIIntelligence();

          if (Math.random() > intelligence) {
            return this.getRandomAffordableEntry(entries);
          }

          var bestScore = -Infinity;
          var bestEntries = [];

          for (var i = 0; i < affordableEntries.length; i++) {
            var entry = affordableEntries[i];
            if (!this.isValidEntry(entry)) continue;
            var score = this.getCounterScore(entry.unitType, targetWave.unitType);

            if (score > bestScore) {
              bestScore = score;
              bestEntries.length = 0;
              bestEntries.push(entry);
            } else if (Math.abs(score - bestScore) < 0.0001) {
              bestEntries.push(entry);
            }
          }

          if (bestEntries.length > 0) {
            var index = Math.floor(Math.random() * bestEntries.length);
            return bestEntries[index];
          }

          return this.getCheapestAffordableEntry(entries);
        }

        getAffordableEntries(entries) {
          var result = [];
          if (!this.gameManager) return result;

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!this.isValidEntry(entry)) continue;

            if (!this.gameManager.canAffordEntry(this.team, entry)) {
              continue;
            }

            result.push(entry);
          }

          return result;
        }

        getRandomAffordableEntry(entries) {
          var affordable = this.getAffordableEntries(entries);

          if (affordable.length <= 0) {
            return null;
          }

          var index = Math.floor(Math.random() * affordable.length);
          return affordable[index];
        }

        getCheapestAffordableEntry(entries) {
          if (!this.gameManager) return null;
          var best = null;
          var bestCost = Infinity;

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!this.isValidEntry(entry)) continue;

            if (!this.gameManager.canAffordEntry(this.team, entry)) {
              continue;
            }

            var cost = Math.max(0, entry.combatPointCost);

            if (cost < bestCost) {
              bestCost = cost;
              best = entry;
            }
          }

          return best;
        }

        canSpawnMoreWave() {
          if (!this.enableMaxAliveWaveLimit) {
            return true;
          }

          var max = Math.max(1, Math.floor(this.maxAliveWaves));
          var alive = this.getAliveWaveCount(this.team);
          return alive < max;
        }

        getAliveWaveCount(team) {
          if (!this.gameManager) return 0;
          var waves = this.gameManager.getWavesByTeam(team);
          var count = 0;

          for (var i = 0; i < waves.length; i++) {
            var wave = waves[i];
            if (!wave) continue;
            if (wave.isDead()) continue;
            count++;
          }

          return count;
        }

        spawnOpeningWave(validEntries) {
          if (!this.gameManager) return;
          if (!this.canSpawnMoreWave()) return;
          var opening = this.getRandomAffordableEntry(validEntries);
          if (!opening) return;
          this.gameManager.spawnWaveByEntry(this.team, opening);
        }

        spawnRandom(validEntries, reason) {
          if (!this.gameManager) return;
          if (!this.canSpawnMoreWave()) return;
          var randomEntry = this.getRandomAffordableEntry(validEntries);
          if (!randomEntry) return;
          this.debugLog(reason + ". Random spawn: " + randomEntry.name);
          this.gameManager.spawnWaveByEntry(this.team, randomEntry);
        }

        getCounterSpawnLaneId(targetWave, lanePressure) {
          if (!this.gameManager) {
            return targetWave.laneId;
          }

          var laneCount = this.gameManager.getSafeLaneCount();

          if (laneCount <= 1) {
            return 0;
          }

          var targetLane = this.gameManager.clampLaneId(targetWave.laneId);
          var sameLaneChance = this.clamp(this.counterSameLaneChance, 0, 1);
          var targetInfo = lanePressure[targetLane];
          var targetUndefended = !!targetInfo && targetInfo.enemyCount > 0 && targetInfo.allyCount <= 0;
          var adjustedSameLaneChance = this.clamp(sameLaneChance + this.getLaneAwareness() * (targetUndefended ? this.getDefenseSameLaneBonus() : -0.25 * this.getFlankAggression()), 0, 1);

          if (Math.random() <= adjustedSameLaneChance) {
            return targetLane;
          }

          var neighborLanes = [];
          var leftLane = targetLane - 1;
          var rightLane = targetLane + 1;

          if (leftLane >= 0) {
            neighborLanes.push(leftLane);
          }

          if (rightLane < laneCount) {
            neighborLanes.push(rightLane);
          }

          if (neighborLanes.length <= 0) {
            return targetLane;
          }

          return this.chooseSupportLane(neighborLanes, lanePressure);
        }

        chooseSupportLane(lanes, lanePressure) {
          if (lanes.length <= 0) {
            return 0;
          }

          if (this.getLaneAwareness() <= 0 || this.getFlankAggression() <= 0) {
            var index = Math.floor(Math.random() * lanes.length);
            return lanes[index];
          }

          var bestLane = lanes[0];
          var bestScore = -Infinity;

          for (var i = 0; i < lanes.length; i++) {
            var lane = lanes[i];
            var info = lanePressure[lane];
            var score = Math.random() * 0.001;

            if (info) {
              score += Math.max(0, info.enemyThreat - info.allyDefense);

              if (info.enemyCount > 0 && info.allyCount <= 0) {
                score += 35;
              }
            }

            if (score > bestScore) {
              bestScore = score;
              bestLane = lane;
            }
          }

          return bestLane;
        }

        getCounterScore(attackerType, defenderType) {
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;

          if (!counter) {
            return 1;
          }

          return counter.getCounterScore(attackerType, defenderType);
        }

        isRealCounterScore(score) {
          return score > 1.0001;
        }

        getDefendPoint() {
          if (!this.gameManager) {
            return {
              x: 0,
              z: 0
            };
          }

          var hero = this.team === 0 ? this.gameManager.teamAHero : this.gameManager.teamBHero;

          if (hero && hero.agent) {
            return {
              x: hero.agent.pos.x,
              z: hero.agent.pos.z
            };
          }

          return {
            x: 0,
            z: this.team === 0 ? this.gameManager.teamASpawnZ : this.gameManager.teamBSpawnZ
          };
        }

        getAIIntelligence() {
          return this.clamp(this.aiIntelligence, 0, 1);
        }

        getLaneAwareness() {
          return this.clamp(this.laneAwareness, 0, 1);
        }

        getFlankAggression() {
          return this.clamp(this.flankAggression, 0, 1);
        }

        getDefenseSameLaneBonus() {
          return this.currentMode === ArmyBrainMode.Defense ? 0.45 : 0.2;
        }

        randomizeNextInterval() {
          var min = Math.max(0.1, this.minSpawnInterval);
          var max = Math.max(min, this.maxSpawnInterval);
          this.nextInterval = min + Math.random() * (max - min);
        }

        getValidEntries(entries) {
          var valid = [];

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!this.isValidEntry(entry)) continue;
            valid.push(entry);
          }

          return valid;
        }

        isValidEntry(entry) {
          if (!entry) return false;
          if (!entry.name) return false;
          if (!entry.prefab) return false;
          if (Math.floor(entry.unitCount) <= 0) return false;
          return true;
        }

        clamp(v, min, max) {
          return Math.max(min, Math.min(max, v));
        }

        stateLog(message) {
          if (!this.enableStateLog) return;
          console.log("[ArmyBrain State T" + this.team + "] " + message);
        }

        debugLog(message) {
          if (!this.enableDebugLog) return;
          console.log("[ArmyBrain Debug T" + this.team + "] " + message);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "team", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "runOnlyWhenGameManagerAutoSpawnOff", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5.0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxBrainDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enableMaxAliveWaveLimit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWaves", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 7;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "defenseWaveThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "attackModeChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "defenseModeChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "preferUnengagedWaveInAttack", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "ignoreNearlyDeadWaveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "attackCounterCoverageRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "counterSameLaneChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.75;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "laneAwareness", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "flankAggression", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "aiIntelligence", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "spawnRandomIfNoThreat", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "spawnOpeningWaveIfNoEnemyWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "enableStateLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=222aa64d7ed99730041b42d660d662a94eee6def.js.map