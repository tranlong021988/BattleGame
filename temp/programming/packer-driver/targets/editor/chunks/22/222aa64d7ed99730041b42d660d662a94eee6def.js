System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameManager, CounterSettings, unitTypeToName, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _crd, ccclass, property, ArmyBrain;

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
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gameManager", _descriptor, this);

          // 0 = team A, 1 = team B
          _initializerDefineProperty(this, "team", _descriptor2, this);

          _initializerDefineProperty(this, "runOnlyWhenGameManagerAutoSpawnOff", _descriptor3, this);

          _initializerDefineProperty(this, "minSpawnInterval", _descriptor4, this);

          _initializerDefineProperty(this, "maxSpawnInterval", _descriptor5, this);

          _initializerDefineProperty(this, "sensitive", _descriptor6, this);

          _initializerDefineProperty(this, "minSensitive", _descriptor7, this);

          _initializerDefineProperty(this, "maxSensitive", _descriptor8, this);

          _initializerDefineProperty(this, "minThreatAliveRatio", _descriptor9, this);

          _initializerDefineProperty(this, "preferUnengagedWave", _descriptor10, this);

          _initializerDefineProperty(this, "avoidAlreadyAssignedWave", _descriptor11, this);

          _initializerDefineProperty(this, "spawnRandomIfNoThreat", _descriptor12, this);

          // Fix deadlock đầu trận:
          // nếu chưa có enemy wave nào, AI sẽ chủ động spawn opening wave.
          _initializerDefineProperty(this, "spawnOpeningWaveIfNoEnemyWave", _descriptor13, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor14, this);

          this.timer = 0;
          this.nextInterval = 3;
        }

        start() {
          this.randomizeNextInterval();
          this.log(`Start. team=${this.team}, nextInterval=${this.nextInterval.toFixed(2)}`);
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
          const entries = this.gameManager.getTeamEntries(this.team);
          const validEntries = this.getValidEntries(entries);
          this.log(`Think. validEntries=${validEntries.length}`);

          if (validEntries.length <= 0) {
            this.log('Abort: no valid entries.');
            return;
          }

          const enemyTeam = this.team === 0 ? 1 : 0;
          const enemyWaves = this.gameManager.getWavesByTeam(enemyTeam);
          this.log(`Enemy waves alive=${enemyWaves.length}`);

          if (enemyWaves.length <= 0) {
            if (this.spawnOpeningWaveIfNoEnemyWave) {
              const opening = this.getRandomEntry(validEntries);

              if (opening) {
                this.log(`No enemy wave. Spawn opening: ${opening.name} / ${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
                  error: Error()
                }), unitTypeToName) : unitTypeToName)(opening.unitType)}`);
                this.gameManager.spawnWaveByEntry(this.team, opening);
              }

              return;
            }

            if (this.spawnRandomIfNoThreat) {
              const randomEntry = this.getRandomEntry(validEntries);

              if (randomEntry) {
                this.log(`No enemy wave. Spawn random: ${randomEntry.name}`);
                this.gameManager.spawnWaveByEntry(this.team, randomEntry);
              }
            }

            return;
          }

          const targetWave = this.findBestThreatWave();

          if (!targetWave) {
            this.log('No valid threat wave found.');

            if (this.spawnRandomIfNoThreat) {
              const randomEntry = this.getRandomEntry(validEntries);

              if (randomEntry) {
                this.log(`Fallback random spawn: ${randomEntry.name} / ${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
                  error: Error()
                }), unitTypeToName) : unitTypeToName)(randomEntry.unitType)}`);
                this.gameManager.spawnWaveByEntry(this.team, randomEntry);
              }
            }

            return;
          }

          this.log(`Target wave id=${targetWave.id}, team=${targetWave.team}, type=${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(targetWave.unitType)}, alive=${targetWave.getAliveCount()}/${targetWave.totalCount}, ratio=${targetWave.getAliveRatio().toFixed(2)}, engaged=${targetWave.hasEngaged()}, assigned=${targetWave.counterAssigned}`);
          const selectedEntry = this.chooseEntryAgainstWave(validEntries, targetWave);

          if (!selectedEntry) {
            this.log('Abort: no selected entry.');
            return;
          }

          this.log(`Spawn selected: ${selectedEntry.name} / ${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(selectedEntry.unitType)}`);
          const spawned = this.gameManager.spawnWaveByEntry(this.team, selectedEntry);

          if (spawned && this.avoidAlreadyAssignedWave) {
            targetWave.counterAssigned = true;
            this.log(`Mark target wave ${targetWave.id} as counterAssigned.`);
          }
        }

        findBestThreatWave() {
          if (!this.gameManager) return null;
          const enemyTeam = this.team === 0 ? 1 : 0;
          const waves = this.gameManager.getWavesByTeam(enemyTeam);
          let best = null;
          let bestScore = -Infinity;
          const defendPoint = this.getDefendPoint();

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!wave) continue;
            const aliveCount = wave.getAliveCount();
            const aliveRatio = wave.getAliveRatio();
            const engaged = wave.hasEngaged();

            if (wave.isDead()) {
              this.log(`Skip wave ${wave.id}: dead`);
              continue;
            }

            if (aliveRatio < this.minThreatAliveRatio) {
              this.log(`Skip wave ${wave.id}: aliveRatio ${aliveRatio.toFixed(2)} < ${this.minThreatAliveRatio}`);
              continue;
            }

            if (this.avoidAlreadyAssignedWave && wave.counterAssigned) {
              this.log(`Skip wave ${wave.id}: already assigned`);
              continue;
            }

            let score = 0;
            score += aliveRatio * 100;

            if (this.preferUnengagedWave && !engaged) {
              score += 50;
            }

            const distSq = wave.getClosestDistanceSqTo(defendPoint.x, defendPoint.z);
            const dist = Math.sqrt(distSq);
            score += Math.max(0, 100 - dist);
            const avgZ = wave.getAverageZ();

            if (this.team === 0) {
              score += Math.max(0, 20 - (avgZ - this.gameManager.teamASpawnZ));
            } else {
              score += Math.max(0, 20 - (this.gameManager.teamBSpawnZ - avgZ));
            }

            this.log(`Wave candidate id=${wave.id}, type=${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
              error: Error()
            }), unitTypeToName) : unitTypeToName)(wave.unitType)}, alive=${aliveCount}/${wave.totalCount}, ratio=${aliveRatio.toFixed(2)}, engaged=${engaged}, assigned=${wave.counterAssigned}, score=${score.toFixed(2)}`);

            if (score > bestScore) {
              bestScore = score;
              best = wave;
            }
          }

          return best;
        }

        chooseEntryAgainstWave(entries, targetWave) {
          const accuracy = this.getAccuracy();

          if (Math.random() > accuracy) {
            const random = this.getRandomEntry(entries);
            this.log(`Sensitive miss. Random choice: ${random ? random.name : 'null'}`);
            return random;
          }

          let bestScore = -Infinity;
          const bestEntries = [];

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.isValidEntry(entry)) continue;
            const score = this.getCounterScore(entry.unitType, targetWave.unitType);
            this.log(`Candidate ${entry.name} / ${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
              error: Error()
            }), unitTypeToName) : unitTypeToName)(entry.unitType)} vs ${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
              error: Error()
            }), unitTypeToName) : unitTypeToName)(targetWave.unitType)} score=${score.toFixed(2)}`);

            if (score > bestScore) {
              bestScore = score;
              bestEntries.length = 0;
              bestEntries.push(entry);
            } else if (Math.abs(score - bestScore) < 0.0001) {
              bestEntries.push(entry);
            }
          }

          if (bestEntries.length <= 0) {
            this.log('No best entries. Random fallback.');
            return this.getRandomEntry(entries);
          }

          const index = Math.floor(Math.random() * bestEntries.length);
          const selected = bestEntries[index];
          this.log(`Best score=${bestScore.toFixed(2)}, bestCount=${bestEntries.length}, selected=${selected.name}`);
          return selected;
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

        log(message) {
          if (!this.enableDebugLog) return;
          console.log(`[ArmyBrain T${this.team}] ${message}`);
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
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "sensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "minSensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "maxSensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "minThreatAliveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.35;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "preferUnengagedWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "avoidAlreadyAssignedWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "spawnRandomIfNoThreat", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "spawnOpeningWaveIfNoEnemyWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=222aa64d7ed99730041b42d660d662a94eee6def.js.map