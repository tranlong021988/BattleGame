System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameManager, CounterSettings, unitTypeToName, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _crd, ccclass, property, ArmyBrain;

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

          _initializerDefineProperty(this, "team", _descriptor2, this);

          _initializerDefineProperty(this, "runOnlyWhenGameManagerAutoSpawnOff", _descriptor3, this);

          _initializerDefineProperty(this, "minSpawnInterval", _descriptor4, this);

          _initializerDefineProperty(this, "maxSpawnInterval", _descriptor5, this);

          _initializerDefineProperty(this, "maxBrainDeltaTime", _descriptor6, this);

          _initializerDefineProperty(this, "sensitive", _descriptor7, this);

          _initializerDefineProperty(this, "minSensitive", _descriptor8, this);

          _initializerDefineProperty(this, "maxSensitive", _descriptor9, this);

          _initializerDefineProperty(this, "minThreatAliveRatio", _descriptor10, this);

          _initializerDefineProperty(this, "preferUnengagedWave", _descriptor11, this);

          _initializerDefineProperty(this, "useAdaptiveStrategy", _descriptor12, this);

          _initializerDefineProperty(this, "unitAdvantageThreshold", _descriptor13, this);

          _initializerDefineProperty(this, "attackIntelligence", _descriptor14, this);

          _initializerDefineProperty(this, "defenseIntelligence", _descriptor15, this);

          _initializerDefineProperty(this, "neutralAttackChance", _descriptor16, this);

          _initializerDefineProperty(this, "counterCoverageRatio", _descriptor17, this);

          _initializerDefineProperty(this, "maxCounterAssignmentsPerWave", _descriptor18, this);

          _initializerDefineProperty(this, "spawnRandomIfNoThreat", _descriptor19, this);

          _initializerDefineProperty(this, "spawnOpeningWaveIfNoEnemyWave", _descriptor20, this);

          _initializerDefineProperty(this, "enableStateLog", _descriptor21, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor22, this);

          this.timer = 0;
          this.nextInterval = 3;
          this.currentPreferUnengaged = true;
          this.currentStrategyState = 'UNKNOWN';
        }

        start() {
          this.randomizeNextInterval();
          this.debugLog(`Start. team=${this.team}, nextInterval=${this.nextInterval.toFixed(2)}`);
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
          const entries = this.gameManager.getTeamEntries(this.team);
          const validEntries = this.getValidEntries(entries);

          if (validEntries.length <= 0) {
            this.debugLog('Abort: no valid entries.');
            return;
          }

          const enemyTeam = this.team === 0 ? 1 : 0;
          const enemyWaves = this.gameManager.getWavesByTeam(enemyTeam);
          this.currentPreferUnengaged = this.resolvePreferUnengagedWave();
          this.stateLog(`STATE=${this.currentStrategyState}, preferUnengaged=${this.currentPreferUnengaged}`);

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

          const targetWave = this.findBestThreatWave();

          if (!targetWave) {
            this.debugLog('No valid threat wave found.');

            if (this.spawnRandomIfNoThreat) {
              this.spawnRandom(validEntries, 'No valid threat');
            }

            return;
          }

          this.debugLog(`Target wave id=${targetWave.id}, type=${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(targetWave.unitType)}, alive=${targetWave.getAliveCount()}/${targetWave.totalCount}, assigned=${targetWave.assignedCounterCount}, coverage=${targetWave.getCounterCoverageRatio().toFixed(2)}`);
          const selectedEntry = this.chooseEntryAgainstWave(validEntries, targetWave);

          if (!selectedEntry) {
            this.debugLog('Abort: no selected entry.');
            return;
          }

          this.debugLog(`Spawn selected: ${selectedEntry.name} / ${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(selectedEntry.unitType)}`);
          const spawned = this.gameManager.spawnWaveByEntry(this.team, selectedEntry);

          if (spawned) {
            targetWave.addCounterAssignment(selectedEntry.unitCount);
            this.debugLog(`Counter assignment wave ${targetWave.id}: +${selectedEntry.unitCount}, totalAssigned=${targetWave.assignedCounterCount}, coverage=${targetWave.getCounterCoverageRatio().toFixed(2)}`);
          }
        }

        resolvePreferUnengagedWave() {
          if (!this.useAdaptiveStrategy) {
            this.currentStrategyState = this.preferUnengagedWave ? 'MANUAL_ATTACK' : 'MANUAL_DEFENSE';
            return this.preferUnengagedWave;
          }

          if (!this.gameManager) {
            this.currentStrategyState = 'NO_GAME_MANAGER';
            return this.preferUnengagedWave;
          }

          const enemyTeam = this.team === 0 ? 1 : 0;
          const myAlive = this.getAliveUnitCount(this.team);
          const enemyAlive = this.getAliveUnitCount(enemyTeam);
          const unitDiff = myAlive - enemyAlive;
          const threshold = Math.max(1, Math.floor(this.unitAdvantageThreshold));

          if (unitDiff >= threshold) {
            const roll = Math.random();
            const correct = roll <= this.attackIntelligence;
            this.currentStrategyState = correct ? 'ATTACK' : 'ATTACK_MISREAD_TO_DEFENSE';
            this.stateLog(`myAlive=${myAlive}, enemyAlive=${enemyAlive}, diff=${unitDiff}, threshold=${threshold}, desired=ATTACK, roll=${roll.toFixed(2)}, intelligence=${this.attackIntelligence}, final=${this.currentStrategyState}`);
            return correct ? true : false;
          }

          if (unitDiff <= -threshold) {
            const roll = Math.random();
            const correct = roll <= this.defenseIntelligence;
            this.currentStrategyState = correct ? 'DEFENSE' : 'DEFENSE_MISREAD_TO_ATTACK';
            this.stateLog(`myAlive=${myAlive}, enemyAlive=${enemyAlive}, diff=${unitDiff}, threshold=${threshold}, desired=DEFENSE, roll=${roll.toFixed(2)}, intelligence=${this.defenseIntelligence}, final=${this.currentStrategyState}`);
            return correct ? false : true;
          }

          const neutralRoll = Math.random();
          const attack = neutralRoll <= this.neutralAttackChance;
          this.currentStrategyState = attack ? 'NEUTRAL_ATTACK' : 'NEUTRAL_DEFENSE';
          this.stateLog(`myAlive=${myAlive}, enemyAlive=${enemyAlive}, diff=${unitDiff}, threshold=${threshold}, desired=NEUTRAL, attackChance=${this.neutralAttackChance}, roll=${neutralRoll.toFixed(2)}, final=${this.currentStrategyState}`);
          return attack;
        }

        getAliveUnitCount(team) {
          if (!this.gameManager) return 0;
          const units = this.gameManager.getAliveUnits(team);
          let count = 0;

          for (let i = 0; i < units.length; i++) {
            const u = units[i];
            if (!u) continue;
            if (!u.node.activeInHierarchy) continue;
            if (!u.props) continue;
            if (u.props.isDead()) continue;
            count++;
          }

          return count;
        }

        spawnOpeningWave(validEntries) {
          if (!this.gameManager) return;
          const opening = this.getRandomEntry(validEntries);
          if (!opening) return;
          this.debugLog(`Opening spawn: ${opening.name} / ${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(opening.unitType)}`);
          this.gameManager.spawnWaveByEntry(this.team, opening);
        }

        spawnRandom(validEntries, reason) {
          if (!this.gameManager) return;
          const randomEntry = this.getRandomEntry(validEntries);
          if (!randomEntry) return;
          this.debugLog(`${reason}. Random spawn: ${randomEntry.name} / ${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(randomEntry.unitType)}`);
          this.gameManager.spawnWaveByEntry(this.team, randomEntry);
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
            if (wave.isDead()) continue;
            const aliveCount = wave.getAliveCount();
            const aliveRatio = wave.getAliveRatio();
            const engaged = wave.hasEngaged();

            if (aliveRatio < this.minThreatAliveRatio) {
              this.debugLog(`Skip wave ${wave.id}: aliveRatio ${aliveRatio.toFixed(2)} < ${this.minThreatAliveRatio}`);
              continue;
            }

            const hardAssignmentCap = this.maxCounterAssignmentsPerWave * Math.max(1, wave.totalCount);

            if (wave.assignedCounterCount >= hardAssignmentCap) {
              this.debugLog(`Skip wave ${wave.id}: assignment cap ${wave.assignedCounterCount}/${hardAssignmentCap}`);
              continue;
            }

            if (wave.isCounterCovered(this.counterCoverageRatio)) {
              this.debugLog(`Skip wave ${wave.id}: coverage ${wave.getCounterCoverageRatio().toFixed(2)} >= ${this.counterCoverageRatio}`);
              continue;
            }

            let score = 0;
            score += aliveRatio * 100;

            if (this.currentPreferUnengaged && !engaged) {
              score += 50;
            }

            if (!this.currentPreferUnengaged && engaged) {
              score += 25;
            }

            const distSq = wave.getClosestDistanceSqTo(defendPoint.x, defendPoint.z);
            const dist = Math.sqrt(distSq);
            score += Math.max(0, 100 - dist);
            const uncovered = Math.max(0, this.counterCoverageRatio - wave.getCounterCoverageRatio());
            score += uncovered * 40;
            const avgZ = wave.getAverageZ();

            if (this.team === 0) {
              score += Math.max(0, 20 - (avgZ - this.gameManager.teamASpawnZ));
            } else {
              score += Math.max(0, 20 - (this.gameManager.teamBSpawnZ - avgZ));
            }

            this.debugLog(`Wave candidate id=${wave.id}, type=${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
              error: Error()
            }), unitTypeToName) : unitTypeToName)(wave.unitType)}, alive=${aliveCount}/${wave.totalCount}, ratio=${aliveRatio.toFixed(2)}, engaged=${engaged}, assigned=${wave.assignedCounterCount}, coverage=${wave.getCounterCoverageRatio().toFixed(2)}, score=${score.toFixed(2)}`);

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
            this.debugLog(`Sensitive miss. Random choice: ${random ? random.name : 'null'}`);
            return random;
          }

          let bestScore = -Infinity;
          const bestEntries = [];

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.isValidEntry(entry)) continue;
            const score = this.getCounterScore(entry.unitType, targetWave.unitType);
            this.debugLog(`Candidate ${entry.name} / ${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
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
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "sensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "minSensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.0;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "maxSensitive", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "minThreatAliveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.35;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "preferUnengagedWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "useAdaptiveStrategy", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "unitAdvantageThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "attackIntelligence", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "defenseIntelligence", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.85;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "neutralAttackChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "counterCoverageRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "maxCounterAssignmentsPerWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "spawnRandomIfNoThreat", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "spawnOpeningWaveIfNoEnemyWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "enableStateLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
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
//# sourceMappingURL=222aa64d7ed99730041b42d660d662a94eee6def.js.map