System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameManager, CounterSettings, unitTypeToName, SmartLaneIntel, SmartWaveIntel, _dec, _dec2, _dec3, _class3, _class4, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _crd, ccclass, property, SmartArmyBrain;

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

      _cclegacy._RF.push({}, "176e8OduVVJWZtW75fGMWiX", "SmartArmyBrain", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);
      SmartLaneIntel = class SmartLaneIntel {
        constructor() {
          this.laneId = 0;
          this.allyCount = 0;
          this.enemyCount = 0;
          this.trafficCount = 0;
          this.enemyThreat = 0;
          this.allyPressure = 0;
        }

        reset(laneId) {
          this.laneId = laneId;
          this.allyCount = 0;
          this.enemyCount = 0;
          this.trafficCount = 0;
          this.enemyThreat = 0;
          this.allyPressure = 0;
        }

      };
      SmartWaveIntel = class SmartWaveIntel {
        constructor() {
          this.wave = null;
          this.laneId = -1;
          this.centerX = 0;
          this.centerZ = 0;
          this.aliveRatio = 0;
          this.coverage = 0;
          this.uncovered = 0;
          this.distanceToDefend = 0;
          this.hasStrugglingAlly = false;
          this.threatScore = 0;
        }

        reset() {
          this.wave = null;
          this.laneId = -1;
          this.centerX = 0;
          this.centerZ = 0;
          this.aliveRatio = 0;
          this.coverage = 0;
          this.uncovered = 0;
          this.distanceToDefend = 0;
          this.hasStrugglingAlly = false;
          this.threatScore = 0;
        }

      };

      _export("SmartArmyBrain", SmartArmyBrain = (_dec = ccclass('SmartArmyBrain'), _dec2 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec3 = property({
        min: 0,
        max: 1,
        tooltip: '1 = best counter and best reachable lane. 0 = more random unit/lane choices.'
      }), _dec(_class3 = (_class4 = class SmartArmyBrain extends Component {
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

          _initializerDefineProperty(this, "decisionAccuracy", _descriptor9, this);

          _initializerDefineProperty(this, "attackCounterCoverageRatio", _descriptor10, this);

          _initializerDefineProperty(this, "ignoreNearlyDeadWaveRatio", _descriptor11, this);

          _initializerDefineProperty(this, "rescueAllyAliveRatio", _descriptor12, this);

          _initializerDefineProperty(this, "aggressiveForwardChance", _descriptor13, this);

          _initializerDefineProperty(this, "spawnOpeningWaveIfNoEnemyWave", _descriptor14, this);

          _initializerDefineProperty(this, "enableStateLog", _descriptor15, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor16, this);

          this.timer = 0;
          this.nextInterval = 3;
          this.elapsedTime = 0;
          this.hasReachedMaxAliveWavesOnce = false;
          this.laneIntel = [];
          this.enemyIntel = [];
          this.activeEnemyIntelCount = 0;
          this.affordableEntries = [];
          this.bestEntryBuffer = [];
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
          this.elapsedTime += safeDeltaTime;
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
          var aliveWaveCount = this.getAliveWaveCount(this.team);
          this.refreshMaxAliveWaveReached(aliveWaveCount);

          if (!this.canSpawnMoreWave(aliveWaveCount)) {
            this.debugLog('Skip: max alive waves reached.');
            return;
          }

          var entries = this.gameManager.getTeamEntries(this.team);
          this.collectAffordableEntries(entries);

          if (this.affordableEntries.length <= 0) {
            this.debugLog('Skip: no affordable entries.');
            return;
          }

          this.rebuildIntel();
          var counterTarget = this.findBestCounterTarget();

          if (counterTarget) {
            this.spawnCounter(counterTarget);
            return;
          }

          if (this.trySpawnAggressiveForward('No reachable counter target')) {
            return;
          }

          if (this.activeEnemyIntelCount <= 0 && this.spawnOpeningWaveIfNoEnemyWave) {
            this.spawnOpeningWave();
            return;
          }

          this.stateLog('WAIT no useful spawn decision.');
        }

        rebuildIntel() {
          if (!this.gameManager) return;
          var laneCount = this.gameManager.getSafeLaneCount();
          this.ensureLaneIntel(laneCount);

          for (var i = 0; i < laneCount; i++) {
            this.laneIntel[i].reset(i);
          }

          var waves = this.gameManager.waves;
          var enemyTeam = this.team === 0 ? 1 : 0;

          for (var _i = 0; _i < waves.length; _i++) {
            var wave = waves[_i];
            if (!this.isValidWave(wave)) continue;
            if (wave.laneId < 0) continue;
            var laneId = this.gameManager.clampLaneId(wave.laneId);
            var lane = this.laneIntel[laneId];
            if (!lane) continue;
            lane.trafficCount++;

            if (wave.team === this.team) {
              lane.allyCount++;
              lane.allyPressure += wave.getAliveRatio();
              continue;
            }

            if (wave.team !== enemyTeam) continue;
            lane.enemyCount++;
            lane.enemyThreat += wave.getAliveRatio();
          }

          this.activeEnemyIntelCount = 0;

          for (var _i2 = 0; _i2 < waves.length; _i2++) {
            var _wave = waves[_i2];
            if (!this.isValidWave(_wave)) continue;
            if (_wave.team !== enemyTeam) continue;
            if (_wave.laneId < 0) continue;

            var _laneId = this.gameManager.clampLaneId(_wave.laneId);

            var _lane = this.laneIntel[_laneId];
            if (!_lane) continue;
            var intel = this.getEnemyIntelBuffer(this.activeEnemyIntelCount++);
            this.fillEnemyIntel(intel, _wave, _laneId);
          }
        }

        fillEnemyIntel(intel, wave, laneId) {
          intel.reset();
          intel.wave = wave;
          intel.laneId = laneId;
          intel.aliveRatio = wave.getAliveRatio();
          intel.coverage = wave.getCounterCoverageRatio();
          intel.uncovered = Math.max(0, this.attackCounterCoverageRatio - intel.coverage);
          this.getWaveCenter(wave, intel);
          intel.distanceToDefend = this.getDistanceToDefendPoint(intel.centerX, intel.centerZ);
          intel.hasStrugglingAlly = this.hasStrugglingAllyNearTarget(intel);
          var distanceScore = Math.max(0, 120 - intel.distanceToDefend);
          var underCounteredScore = intel.uncovered > 0 ? intel.uncovered * 120 : 0;
          var failedCounterScore = intel.hasStrugglingAlly ? 80 : 0;
          intel.threatScore = underCounteredScore + failedCounterScore + intel.aliveRatio * 45 + distanceScore + (wave.hasEngaged() ? 20 : 0);
        }

        findBestCounterTarget() {
          var best = null;
          var bestScore = -Infinity;

          for (var i = 0; i < this.activeEnemyIntelCount; i++) {
            var intel = this.enemyIntel[i];
            if (!this.isCounterCandidate(intel)) continue;

            if (intel.threatScore > bestScore) {
              bestScore = intel.threatScore;
              best = intel;
            }
          }

          return best;
        }

        isCounterCandidate(intel) {
          if (!intel || !intel.wave) return false;
          if (!this.isValidWave(intel.wave)) return false;

          if (intel.aliveRatio < this.ignoreNearlyDeadWaveRatio) {
            return false;
          }

          return !!this.chooseEntryForTarget(intel.wave, true);
        }

        spawnCounter(intel) {
          if (!this.gameManager || !intel.wave) return false;
          var entry = this.chooseEntryForTarget(intel.wave, false);
          if (!entry) return false;
          var laneId = this.chooseCounterLane(intel);
          var spawned = this.gameManager.spawnWaveByEntry(this.team, entry, laneId, this.shouldSpawnAggressiveForward());
          if (!spawned) return false;
          var realCounter = this.isRealCounterScore(this.getCounterScore(entry, intel.wave));

          if (realCounter && laneId === intel.laneId) {
            intel.wave.addCounterAssignment(entry.unitCount);
          }

          this.stateLog("COUNTER wave=" + intel.wave.id + " " + ("target=" + (_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(intel.wave.unitType) + " ") + ("spawn=" + entry.name + " lane=" + laneId + " targetLane=" + intel.laneId + " ") + ("coverage=" + intel.coverage.toFixed(2) + " ") + ("struggling=" + intel.hasStrugglingAlly + " ") + ("aggressive=" + this.shouldSpawnAggressiveForward()));
          return true;
        }

        chooseEntryForTarget(targetWave, exactOnly) {
          if (this.affordableEntries.length <= 0) {
            return null;
          }

          this.bestEntryBuffer.length = 0;
          var bestScore = -Infinity;

          for (var i = 0; i < this.affordableEntries.length; i++) {
            var entry = this.affordableEntries[i];
            var score = this.getCounterScore(entry, targetWave);

            if (exactOnly && !this.isRealCounterScore(score)) {
              continue;
            }

            if (score > bestScore + 0.0001) {
              bestScore = score;
              this.bestEntryBuffer.length = 0;
              this.bestEntryBuffer.push(entry);
            } else if (Math.abs(score - bestScore) <= 0.0001) {
              this.bestEntryBuffer.push(entry);
            }
          }

          if (this.bestEntryBuffer.length <= 0) {
            return null;
          }

          var accurate = Math.random() <= this.getDecisionAccuracy();

          if (!accurate && !exactOnly) {
            return this.getRandomAffordableEntry();
          }

          var index = Math.floor(Math.random() * this.bestEntryBuffer.length);
          return this.bestEntryBuffer[index];
        }

        chooseCounterLane(intel) {
          if (!this.gameManager) return intel.laneId;
          var accurate = Math.random() <= this.getDecisionAccuracy();

          if (accurate) {
            return intel.laneId;
          }

          var supportLane = this.chooseBestSupportLane(intel.laneId);

          if (supportLane >= 0) {
            return supportLane;
          }

          return intel.laneId;
        }

        chooseBestSupportLane(targetLane) {
          if (!this.gameManager) return -1;
          var laneCount = this.gameManager.getSafeLaneCount();
          var bestLane = -1;
          var bestScore = -Infinity;

          for (var laneId = 0; laneId < laneCount; laneId++) {
            if (laneId === targetLane) continue;
            var lane = this.laneIntel[laneId];
            if (!lane) continue;
            var score = Math.random() * 0.001;

            if (lane.enemyCount <= 0) {
              score += 20;
            }

            score -= lane.allyCount * 12;
            score -= lane.enemyCount * 8;
            score -= lane.trafficCount * 6;

            if (score > bestScore) {
              bestScore = score;
              bestLane = laneId;
            }
          }

          return bestLane;
        }

        trySpawnAggressiveForward(reason) {
          if (!this.gameManager) return false;

          if (Math.random() > this.clamp01(this.aggressiveForwardChance)) {
            return false;
          }

          var laneId = this.getBestEmptyLane();

          if (laneId < 0) {
            return false;
          }

          var entry = this.getFastestAffordableEntry();
          if (!entry) return false;
          var spawned = this.gameManager.spawnWaveByEntry(this.team, entry, laneId, true);
          if (!spawned) return false;
          this.stateLog("AGGRESSIVE " + reason + ": spawn=" + entry.name + " lane=" + laneId);
          return true;
        }

        spawnOpeningWave() {
          if (!this.gameManager) return false;
          var entry = this.getRandomAffordableEntry();
          if (!entry) return false;
          var spawned = this.gameManager.spawnWaveByEntry(this.team, entry, -1, this.shouldSpawnAggressiveForward());
          if (!spawned) return false;
          this.stateLog("OPENING spawn=" + entry.name + " aggressive=" + this.shouldSpawnAggressiveForward());
          return true;
        }

        getBestEmptyLane() {
          if (!this.gameManager) return -1;
          var laneCount = this.gameManager.getSafeLaneCount();
          var bestLane = -1;
          var bestScore = -Infinity;

          for (var laneId = 0; laneId < laneCount; laneId++) {
            var lane = this.laneIntel[laneId];
            if (!lane) continue;
            if (lane.enemyCount > 0) continue;
            if (lane.allyCount > 0) continue;
            var score = Math.random() * 0.001 - lane.trafficCount;

            if (score > bestScore) {
              bestScore = score;
              bestLane = laneId;
            }
          }

          return bestLane;
        }

        hasStrugglingAllyNearTarget(targetIntel) {
          if (!this.gameManager) return false;
          var waves = this.gameManager.waves;
          var threshold = this.clamp01(this.rescueAllyAliveRatio);

          for (var i = 0; i < waves.length; i++) {
            var wave = waves[i];
            if (!this.isValidWave(wave)) continue;
            if (wave.team !== this.team) continue;
            if (wave.laneId < 0) continue;

            if (this.gameManager.clampLaneId(wave.laneId) !== targetIntel.laneId) {
              continue;
            }

            if (!wave.hasEngaged()) continue;
            if (wave.getAliveRatio() > threshold) continue;
            return true;
          }

          return false;
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
            if (!unit.props) continue;
            if (unit.props.isDead()) continue;
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

        getDistanceToDefendPoint(x, z) {
          if (!this.gameManager) return 0;
          var hero = this.team === 0 ? this.gameManager.teamAHero : this.gameManager.teamBHero;
          var defendX = hero && hero.agent ? hero.agent.pos.x : 0;
          var defendZ = hero && hero.agent ? hero.agent.pos.z : this.team === 0 ? this.gameManager.teamASpawnZ : this.gameManager.teamBSpawnZ;
          var dx = x - defendX;
          var dz = z - defendZ;
          return Math.sqrt(dx * dx + dz * dz);
        }

        collectAffordableEntries(entries) {
          this.affordableEntries.length = 0;
          if (!this.gameManager) return;

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!this.isValidEntry(entry)) continue;

            if (!this.gameManager.canAffordEntry(this.team, entry)) {
              continue;
            }

            this.affordableEntries.push(entry);
          }
        }

        getRandomAffordableEntry() {
          if (this.affordableEntries.length <= 0) {
            return null;
          }

          var index = Math.floor(Math.random() * this.affordableEntries.length);
          return this.affordableEntries[index];
        }

        getFastestAffordableEntry() {
          var best = null;
          var bestSpeed = -Infinity;
          var bestCost = Infinity;

          for (var i = 0; i < this.affordableEntries.length; i++) {
            var entry = this.affordableEntries[i];
            var speed = Math.max(0, entry.maxSpeed);
            var cost = Math.max(0, entry.combatPointCost);

            if (speed > bestSpeed + 0.0001 || Math.abs(speed - bestSpeed) <= 0.0001 && cost < bestCost) {
              best = entry;
              bestSpeed = speed;
              bestCost = cost;
            }
          }

          return best;
        }

        getCounterScore(entry, targetWave) {
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter) return 1;
          return counter.getCounterScore(entry.unitType, targetWave.unitType);
        }

        isRealCounterScore(score) {
          return score > 1.0001;
        }

        ensureLaneIntel(laneCount) {
          for (var i = this.laneIntel.length; i < laneCount; i++) {
            this.laneIntel.push(new SmartLaneIntel());
          }
        }

        getEnemyIntelBuffer(index) {
          while (this.enemyIntel.length <= index) {
            this.enemyIntel.push(new SmartWaveIntel());
          }

          return this.enemyIntel[index];
        }

        canSpawnMoreWave(aliveWaveCount) {
          if (aliveWaveCount === void 0) {
            aliveWaveCount = this.getAliveWaveCount(this.team);
          }

          if (!this.enableMaxAliveWaveLimit) {
            return true;
          }

          if (!this.gameManager) return false;
          var max = Math.max(1, Math.floor(this.maxAliveWaves));
          return aliveWaveCount < max;
        }

        refreshMaxAliveWaveReached(aliveWaveCount) {
          if (aliveWaveCount === void 0) {
            aliveWaveCount = this.getAliveWaveCount(this.team);
          }

          if (this.hasReachedMaxAliveWavesOnce) {
            return true;
          }

          if (!this.enableMaxAliveWaveLimit) {
            this.hasReachedMaxAliveWavesOnce = true;
            return true;
          }

          var max = Math.max(1, Math.floor(this.maxAliveWaves));

          if (aliveWaveCount >= max) {
            this.hasReachedMaxAliveWavesOnce = true;
          }

          return this.hasReachedMaxAliveWavesOnce;
        }

        shouldSpawnAggressiveForward() {
          return !this.hasReachedMaxAliveWavesOnce;
        }

        getAliveWaveCount(team) {
          if (!this.gameManager) return 0;
          var count = 0;
          var waves = this.gameManager.waves;

          for (var i = 0; i < waves.length; i++) {
            var wave = waves[i];
            if (!this.isValidWave(wave)) continue;
            if (wave.team !== team) continue;
            count++;
          }

          return count;
        }

        isValidWave(wave) {
          if (!wave) return false;
          if (wave.released) return false;
          if (wave.isDead()) return false;
          return true;
        }

        isValidEntry(entry) {
          if (!entry) return false;
          if (!entry.name) return false;
          if (!entry.prefab) return false;
          if (Math.floor(entry.unitCount) <= 0) return false;
          return true;
        }

        getDecisionAccuracy() {
          return this.clamp01(this.decisionAccuracy);
        }

        clamp01(v) {
          return Math.max(0, Math.min(1, v));
        }

        randomizeNextInterval() {
          var min = Math.max(0.1, this.minSpawnInterval);
          var max = Math.max(min, this.maxSpawnInterval);
          this.nextInterval = min + Math.random() * (max - min);
        }

        stateLog(message) {
          if (!this.enableStateLog) return;
          console.log("[SmartArmyBrain State T" + this.team + "] " + message);
        }

        debugLog(message) {
          if (!this.enableDebugLog) return;
          console.log("[SmartArmyBrain Debug T" + this.team + "] " + message);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class4.prototype, "gameManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class4.prototype, "team", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class4.prototype, "runOnlyWhenGameManagerAutoSpawnOff", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class4.prototype, "minSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class4.prototype, "maxSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5.0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class4.prototype, "maxBrainDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class4.prototype, "enableMaxAliveWaveLimit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class4.prototype, "maxAliveWaves", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 7;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class4.prototype, "decisionAccuracy", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class4.prototype, "attackCounterCoverageRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class4.prototype, "ignoreNearlyDeadWaveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class4.prototype, "rescueAllyAliveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.35;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class4.prototype, "aggressiveForwardChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class4.prototype, "spawnOpeningWaveIfNoEnemyWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class4.prototype, "enableStateLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class4.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class4)) || _class3));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cae1d4e25874bc3071e2a733912724c1607aa03b.js.map