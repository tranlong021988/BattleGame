System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameManager, CounterSettings, unitTypeToName, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _crd, ccclass, property, ArmyBrain;

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

          _initializerDefineProperty(this, "sensitive", _descriptor6, this);

          _initializerDefineProperty(this, "minSensitive", _descriptor7, this);

          _initializerDefineProperty(this, "maxSensitive", _descriptor8, this);

          _initializerDefineProperty(this, "minThreatAliveRatio", _descriptor9, this);

          _initializerDefineProperty(this, "preferUnengagedWave", _descriptor10, this);

          // Chuẩn hóa:
          // Không còn dùng boolean avoidAssigned nữa.
          // AI luôn dùng coverage để biết wave địch đã được counter đủ chưa.
          _initializerDefineProperty(this, "counterCoverageRatio", _descriptor11, this);

          _initializerDefineProperty(this, "maxCounterAssignmentsPerWave", _descriptor12, this);

          _initializerDefineProperty(this, "spawnRandomIfNoThreat", _descriptor13, this);

          _initializerDefineProperty(this, "spawnOpeningWaveIfNoEnemyWave", _descriptor14, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor15, this);

          this.timer = 0;
          this.nextInterval = 3;
        }

        start() {
          this.randomizeNextInterval();
          this.log("Start. team=" + this.team + ", nextInterval=" + this.nextInterval.toFixed(2));
        }

        update(deltaTime) {
          if (!this.gameManager) return;

          if (this.runOnlyWhenGameManagerAutoSpawnOff && this.gameManager.enableAutoSpawn) {
            return;
          }

          this.timer += deltaTime;

          if (this.timer < this.nextInterval) {
            return;
          }

          this.timer = 0;
          this.randomizeNextInterval();
          this.thinkAndSpawn();
        }

        thinkAndSpawn() {
          if (!this.gameManager) return;
          var entries = this.gameManager.getTeamEntries(this.team);
          var validEntries = this.getValidEntries(entries);

          if (validEntries.length <= 0) {
            this.log('Abort: no valid entries.');
            return;
          }

          var enemyTeam = this.team === 0 ? 1 : 0;
          var enemyWaves = this.gameManager.getWavesByTeam(enemyTeam);

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

          var targetWave = this.findBestThreatWave();

          if (!targetWave) {
            this.log('No valid threat wave found.');

            if (this.spawnRandomIfNoThreat) {
              this.spawnRandom(validEntries, 'No valid threat');
            }

            return;
          }

          this.log("Target wave id=" + targetWave.id + ", type=" + (_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(targetWave.unitType) + ", alive=" + targetWave.getAliveCount() + "/" + targetWave.totalCount + ", assigned=" + targetWave.assignedCounterCount + ", coverage=" + targetWave.getCounterCoverageRatio().toFixed(2));
          var selectedEntry = this.chooseEntryAgainstWave(validEntries, targetWave);

          if (!selectedEntry) {
            this.log('Abort: no selected entry.');
            return;
          }

          this.log("Spawn selected: " + selectedEntry.name + " / " + (_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(selectedEntry.unitType));
          var spawned = this.gameManager.spawnWaveByEntry(this.team, selectedEntry);

          if (spawned) {
            targetWave.addCounterAssignment(selectedEntry.unitCount);
            this.log("Counter assignment wave " + targetWave.id + ": +" + selectedEntry.unitCount + ", totalAssigned=" + targetWave.assignedCounterCount + ", coverage=" + targetWave.getCounterCoverageRatio().toFixed(2));
          }
        }

        spawnOpeningWave(validEntries) {
          if (!this.gameManager) return;
          var opening = this.getRandomEntry(validEntries);
          if (!opening) return;
          this.log("Opening spawn: " + opening.name + " / " + (_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(opening.unitType));
          this.gameManager.spawnWaveByEntry(this.team, opening);
        }

        spawnRandom(validEntries, reason) {
          if (!this.gameManager) return;
          var randomEntry = this.getRandomEntry(validEntries);
          if (!randomEntry) return;
          this.log(reason + ". Random spawn: " + randomEntry.name + " / " + (_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(randomEntry.unitType));
          this.gameManager.spawnWaveByEntry(this.team, randomEntry);
        }

        findBestThreatWave() {
          if (!this.gameManager) return null;
          var enemyTeam = this.team === 0 ? 1 : 0;
          var waves = this.gameManager.getWavesByTeam(enemyTeam);
          var best = null;
          var bestScore = -Infinity;
          var defendPoint = this.getDefendPoint();

          for (var i = 0; i < waves.length; i++) {
            var wave = waves[i];
            if (!wave) continue;
            if (wave.isDead()) continue;
            var aliveCount = wave.getAliveCount();
            var aliveRatio = wave.getAliveRatio();
            var engaged = wave.hasEngaged();

            if (aliveRatio < this.minThreatAliveRatio) {
              this.log("Skip wave " + wave.id + ": aliveRatio " + aliveRatio.toFixed(2) + " < " + this.minThreatAliveRatio);
              continue;
            }

            var hardAssignmentCap = this.maxCounterAssignmentsPerWave * Math.max(1, wave.totalCount);

            if (wave.assignedCounterCount >= hardAssignmentCap) {
              this.log("Skip wave " + wave.id + ": assignment cap " + wave.assignedCounterCount + "/" + hardAssignmentCap);
              continue;
            }

            if (wave.isCounterCovered(this.counterCoverageRatio)) {
              this.log("Skip wave " + wave.id + ": coverage " + wave.getCounterCoverageRatio().toFixed(2) + " >= " + this.counterCoverageRatio);
              continue;
            }

            var score = 0; // Wave còn đông thì nguy hiểm.

            score += aliveRatio * 100; // Wave chưa engage thì counter có giá trị hơn.

            if (this.preferUnengagedWave && !engaged) {
              score += 50;
            } // Gần điểm phòng thủ thì nguy hiểm hơn.


            var distSq = wave.getClosestDistanceSqTo(defendPoint.x, defendPoint.z);
            var dist = Math.sqrt(distSq);
            score += Math.max(0, 100 - dist); // Đã thiếu counter nhiều thì ưu tiên bổ sung.

            var uncovered = Math.max(0, this.counterCoverageRatio - wave.getCounterCoverageRatio());
            score += uncovered * 40; // Ưu tiên nhẹ wave đang tiến sâu vào sân nhà.

            var avgZ = wave.getAverageZ();

            if (this.team === 0) {
              score += Math.max(0, 20 - (avgZ - this.gameManager.teamASpawnZ));
            } else {
              score += Math.max(0, 20 - (this.gameManager.teamBSpawnZ - avgZ));
            }

            this.log("Wave candidate id=" + wave.id + ", type=" + (_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
              error: Error()
            }), unitTypeToName) : unitTypeToName)(wave.unitType) + ", alive=" + aliveCount + "/" + wave.totalCount + ", ratio=" + aliveRatio.toFixed(2) + ", engaged=" + engaged + ", assigned=" + wave.assignedCounterCount + ", coverage=" + wave.getCounterCoverageRatio().toFixed(2) + ", score=" + score.toFixed(2));

            if (score > bestScore) {
              bestScore = score;
              best = wave;
            }
          }

          return best;
        }

        chooseEntryAgainstWave(entries, targetWave) {
          var accuracy = this.getAccuracy();

          if (Math.random() > accuracy) {
            var random = this.getRandomEntry(entries);
            this.log("Sensitive miss. Random choice: " + (random ? random.name : 'null'));
            return random;
          }

          var bestScore = -Infinity;
          var bestEntries = [];

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!this.isValidEntry(entry)) continue;
            var score = this.getCounterScore(entry.unitType, targetWave.unitType);
            this.log("Candidate " + entry.name + " / " + (_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
              error: Error()
            }), unitTypeToName) : unitTypeToName)(entry.unitType) + " vs " + (_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
              error: Error()
            }), unitTypeToName) : unitTypeToName)(targetWave.unitType) + " score=" + score.toFixed(2));

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

          var index = Math.floor(Math.random() * bestEntries.length);
          return bestEntries[index];
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

        getAccuracy() {
          var min = Math.min(this.minSensitive, this.maxSensitive);
          var max = Math.max(this.minSensitive, this.maxSensitive);
          return this.clamp(this.sensitive, min, max);
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

        getRandomEntry(entries) {
          var valid = this.getValidEntries(entries);

          if (valid.length <= 0) {
            return null;
          }

          var index = Math.floor(Math.random() * valid.length);
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

        log(message) {
          if (!this.enableDebugLog) return;
          console.log("[ArmyBrain T" + this.team + "] " + message);
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
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "sensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "minSensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "maxSensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "minThreatAliveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.35;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "preferUnengagedWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "counterCoverageRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "maxCounterAssignmentsPerWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "spawnRandomIfNoThreat", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "spawnOpeningWaveIfNoEnemyWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
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