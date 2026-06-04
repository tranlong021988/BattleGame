System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameManager, CounterSettings, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _crd, ccclass, property, ArmyBrainMode, ArmyBrain;

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
        constructor(...args) {
          super(...args);

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

          _initializerDefineProperty(this, "sensitive", _descriptor15, this);

          _initializerDefineProperty(this, "minSensitive", _descriptor16, this);

          _initializerDefineProperty(this, "maxSensitive", _descriptor17, this);

          _initializerDefineProperty(this, "spawnRandomIfNoThreat", _descriptor18, this);

          _initializerDefineProperty(this, "spawnOpeningWaveIfNoEnemyWave", _descriptor19, this);

          _initializerDefineProperty(this, "enableStateLog", _descriptor20, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor21, this);

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

          const safeDeltaTime = Math.min(deltaTime, Math.max(0.016, this.maxBrainDeltaTime));
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
            this.debugLog(`Skip spawn: aliveWaves=${this.getAliveWaveCount(this.team)} >= maxAliveWaves=${this.maxAliveWaves}`);
            return;
          }

          const entries = this.gameManager.getTeamEntries(this.team);
          const validEntries = this.getValidEntries(entries);

          if (validEntries.length <= 0) {
            this.debugLog('Abort: no valid entries.');
            return;
          }

          const enemyTeam = this.team === 0 ? 1 : 0;
          const enemyWaves = this.gameManager.getWavesByTeam(enemyTeam);
          this.resolveMode();
          this.stateLog(`MODE=${this.currentModeName}, myWaves=${this.getAliveWaveCount(this.team)}, enemyWaves=${this.getAliveWaveCount(enemyTeam)}, maxWaves=${this.maxAliveWaves}`);

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

          const targetWave = this.findTargetWave();

          if (!targetWave) {
            if (this.spawnRandomIfNoThreat) {
              this.spawnRandom(validEntries, 'No valid target');
            }

            return;
          }

          const selectedEntry = this.chooseEntryAgainstWave(validEntries, targetWave);
          if (!selectedEntry) return;
          const spawned = this.gameManager.spawnWaveByEntry(this.team, selectedEntry);

          if (spawned) {
            targetWave.addCounterAssignment(selectedEntry.unitCount);
            this.debugLog(`Spawn ${selectedEntry.name} counter target wave=${targetWave.id}`);
          }
        }

        resolveMode() {
          const myWaves = this.getAliveWaveCount(this.team);
          const shouldDefense = myWaves <= Math.max(0, Math.floor(this.defenseWaveThreshold));

          if (shouldDefense) {
            const roll = Math.random();
            const correct = roll <= this.defenseModeChance;
            this.currentMode = correct ? ArmyBrainMode.Defense : ArmyBrainMode.Attack;
            this.currentModeName = correct ? 'DEFENSE' : 'DEFENSE_MISREAD_TO_ATTACK';
            return;
          }

          const roll = Math.random();
          const correct = roll <= this.attackModeChance;
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
          const enemyTeam = this.team === 0 ? 1 : 0;
          const waves = this.gameManager.getWavesByTeam(enemyTeam);
          let best = null;
          let bestScore = -Infinity;
          const defendPoint = this.getDefendPoint();

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!this.isValidAttackThreatWave(wave)) continue;
            const aliveRatio = wave.getAliveRatio();
            const engaged = wave.hasEngaged();
            const distSq = wave.getClosestDistanceSqTo(defendPoint.x, defendPoint.z);
            const dist = Math.sqrt(distSq);
            const distanceScore = Math.max(0, 100 - dist);
            const uncovered = Math.max(0, this.attackCounterCoverageRatio - wave.getCounterCoverageRatio());
            let score = 0;
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
          const enemyTeam = this.team === 0 ? 1 : 0;
          const waves = this.gameManager.getWavesByTeam(enemyTeam);
          let best = null;
          let bestDistanceSq = Infinity;
          let bestAliveRatio = -Infinity;
          const defendPoint = this.getDefendPoint();

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!this.isValidDefenseThreatWave(wave)) continue;
            const distSq = wave.getClosestDistanceSqTo(defendPoint.x, defendPoint.z);
            const aliveRatio = wave.getAliveRatio();
            const closer = distSq < bestDistanceSq;
            const sameDistanceButStronger = Math.abs(distSq - bestDistanceSq) < 0.0001 && aliveRatio > bestAliveRatio;

            if (closer || sameDistanceButStronger) {
              bestDistanceSq = distSq;
              bestAliveRatio = aliveRatio;
              best = wave;
            }
          }

          return best;
        }

        isValidAttackThreatWave(wave) {
          if (!this.isAliveThreatWave(wave)) return false;

          if (wave.isCounterCovered(this.attackCounterCoverageRatio)) {
            return false;
          }

          return true;
        }

        isValidDefenseThreatWave(wave) {
          if (!this.isAliveThreatWave(wave)) return false; //
          // Defense Mode:
          // Bỏ qua attackCounterCoverageRatio.
          // Nếu mối nguy gần nhà nhất vẫn còn sống, cứ cho phép reinforce.
          //

          return true;
        }

        isAliveThreatWave(wave) {
          if (!wave) return false;
          if (wave.isDead()) return false;
          const aliveRatio = wave.getAliveRatio();

          if (aliveRatio < this.ignoreNearlyDeadWaveRatio) {
            return false;
          }

          return true;
        }

        canSpawnMoreWave() {
          if (!this.enableMaxAliveWaveLimit) {
            return true;
          }

          const max = Math.max(1, Math.floor(this.maxAliveWaves));
          const alive = this.getAliveWaveCount(this.team);
          return alive < max;
        }

        getAliveWaveCount(team) {
          if (!this.gameManager) return 0;
          const waves = this.gameManager.getWavesByTeam(team);
          let count = 0;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!wave) continue;
            if (wave.isDead()) continue;
            count++;
          }

          return count;
        }

        spawnOpeningWave(validEntries) {
          if (!this.gameManager) return;
          if (!this.canSpawnMoreWave()) return;
          const opening = this.getRandomEntry(validEntries);
          if (!opening) return;
          this.gameManager.spawnWaveByEntry(this.team, opening);
        }

        spawnRandom(validEntries, reason) {
          if (!this.gameManager) return;
          if (!this.canSpawnMoreWave()) return;
          const randomEntry = this.getRandomEntry(validEntries);
          if (!randomEntry) return;
          this.debugLog(`${reason}. Random spawn: ${randomEntry.name}`);
          this.gameManager.spawnWaveByEntry(this.team, randomEntry);
        }

        chooseEntryAgainstWave(entries, targetWave) {
          const accuracy = this.getAccuracy();

          if (Math.random() > accuracy) {
            return this.getRandomEntry(entries);
          }

          let bestScore = -Infinity;
          const bestEntries = [];

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.isValidEntry(entry)) continue;
            const score = this.getCounterScore(entry.unitType, targetWave.unitType);

            if (score > bestScore) {
              bestScore = score;
              bestEntries.length = 0;
              bestEntries.push(entry);
            } else if (Math.abs(score - bestScore) < 0.0001) {
              bestEntries.push(entry);
            }
          }

          if (bestEntries.length <= 0) {
            return this.getRandomEntry(entries);
          }

          const index = Math.floor(Math.random() * bestEntries.length);
          return bestEntries[index];
        }

        getCounterScore(attackerType, defenderType) {
          const counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;

          if (!counter) {
            return 1;
          }

          return counter.getCounterScore(attackerType, defenderType);
        }

        getDefendPoint() {
          if (!this.gameManager) {
            return {
              x: 0,
              z: 0
            };
          }

          const hero = this.team === 0 ? this.gameManager.teamAHero : this.gameManager.teamBHero;

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

        getAccuracy() {
          const min = Math.min(this.minSensitive, this.maxSensitive);
          const max = Math.max(this.minSensitive, this.maxSensitive);
          return this.clamp(this.sensitive, min, max);
        }

        randomizeNextInterval() {
          const min = Math.max(0.1, this.minSpawnInterval);
          const max = Math.max(min, this.maxSpawnInterval);
          this.nextInterval = min + Math.random() * (max - min);
        }

        getValidEntries(entries) {
          const valid = [];

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.isValidEntry(entry)) continue;
            valid.push(entry);
          }

          return valid;
        }

        getRandomEntry(entries) {
          const valid = this.getValidEntries(entries);

          if (valid.length <= 0) {
            return null;
          }

          const index = Math.floor(Math.random() * valid.length);
          return valid[index];
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
          console.log(`[ArmyBrain State T${this.team}] ${message}`);
        }

        debugLog(message) {
          if (!this.enableDebugLog) return;
          console.log(`[ArmyBrain Debug T${this.team}] ${message}`);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "team", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "runOnlyWhenGameManagerAutoSpawnOff", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5.0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxBrainDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enableMaxAliveWaveLimit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWaves", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 7;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "defenseWaveThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "attackModeChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "defenseModeChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "preferUnengagedWaveInAttack", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "ignoreNearlyDeadWaveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "attackCounterCoverageRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "sensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "minSensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.0;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "maxSensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "spawnRandomIfNoThreat", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "spawnOpeningWaveIfNoEnemyWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "enableStateLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7046b8a2e081044834d35aee792adb3160853300.js.map