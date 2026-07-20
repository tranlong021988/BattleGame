System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, GameManager, SmartArmyBrain, BattleArmyBrain, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _crd, ccclass, property, LevelSettings;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSmartArmyBrain(extras) {
    _reporterNs.report("SmartArmyBrain", "./SmartArmyBrain", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleArmyBrain(extras) {
    _reporterNs.report("BattleArmyBrain", "./BattleArmyBrain", _context.meta, extras);
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
      director = _cc.director;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      SmartArmyBrain = _unresolved_3.SmartArmyBrain;
    }, function (_unresolved_4) {
      BattleArmyBrain = _unresolved_4.BattleArmyBrain;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8d731TSPExBjqJd6aUC3OR6", "LevelSettings", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LevelSettings", LevelSettings = (_dec = ccclass('LevelSettings'), _dec2 = property({
        tooltip: 'Total campaign levels used to normalize difficulty from level 1 to the final level.'
      }), _dec3 = property({
        tooltip: 'Current campaign level. Level 1 is easiest; Total Levels is hardest.'
      }), _dec4 = property({
        tooltip: 'Team affected by this component. Default 1 means team B/enemy.'
      }), _dec5 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec6 = property({
        type: [_crd && SmartArmyBrain === void 0 ? (_reportPossibleCrUseOfSmartArmyBrain({
          error: Error()
        }), SmartArmyBrain) : SmartArmyBrain]
      }), _dec7 = property({
        type: [_crd && BattleArmyBrain === void 0 ? (_reportPossibleCrUseOfBattleArmyBrain({
          error: Error()
        }), BattleArmyBrain) : BattleArmyBrain]
      }), _dec8 = property({
        tooltip: 'Apply initial Combat Point curve to the selected team.'
      }), _dec9 = property({
        tooltip: 'Apply the SmartArmyBrain accuracy curve. At accuracy A: smart=A, deliberate mistake=(1-A)^2, random=A*(1-A). Start near 0.1 to keep the easiest AI weak without locking it into deterministic troop loops.'
      }), _dec10 = property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at level 1. Default 0.1 keeps the AI extremely weak but allows enough variation to avoid the Accuracy 0 troop loop.'
      }), _dec11 = property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at the final level. Use 1 for fully intelligent target, counter-unit, and lane decisions.'
      }), _dec12 = property({
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
      }), _dec13 = property({
        displayName: 'Easy Spawn Delay Min',
        tooltip: 'Shortest delay between spawn decisions at level 1.'
      }), _dec14 = property({
        displayName: 'Easy Spawn Delay Max',
        tooltip: 'Longest delay between spawn decisions at level 1. Keep this greater than or equal to Easy Spawn Delay Min.'
      }), _dec15 = property({
        displayName: 'Hard Spawn Delay Min',
        tooltip: 'Shortest delay between spawn decisions at the final level. Lower values make the AI react more frequently.'
      }), _dec16 = property({
        displayName: 'Hard Spawn Delay Max',
        tooltip: 'Longest delay between spawn decisions at the final level. Keep this greater than or equal to Hard Spawn Delay Min.'
      }), _dec17 = property({
        tooltip: 'Apply Max Alive Waves curve. Higher levels allow the enemy to keep more waves active.'
      }), _dec18 = property({
        tooltip: 'Apply Aggressive Forward curve. Higher levels unlock more lane-empty raid attempts.'
      }), _dec19 = property({
        min: 0,
        max: 1,
        tooltip: 'At low levels, empty-lane aggressive raids can use random affordable units. At high levels, they can prefer the fastest affordable raider more often.'
      }), _dec20 = property({
        min: 0,
        max: 1,
        tooltip: 'Final-level chance that an empty-lane aggressive raid picks the fastest affordable unit instead of a random affordable unit.'
      }), _dec21 = property({
        min: 0,
        max: 1,
        tooltip: 'Difficulty threshold where aggressive-forward raid chance starts increasing.'
      }), _dec22 = property({
        tooltip: 'Apply SmartArmyBrain fast-react chance curve. The maximum defaults to immediate reaction at the final level.'
      }), _dec(_class = (_class2 = class LevelSettings extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "totalLevels", _descriptor, this);

          _initializerDefineProperty(this, "currentLevel", _descriptor2, this);

          _initializerDefineProperty(this, "targetTeam", _descriptor3, this);

          _initializerDefineProperty(this, "gameManager", _descriptor4, this);

          _initializerDefineProperty(this, "armyBrains", _descriptor5, this);

          _initializerDefineProperty(this, "battleArmyBrains", _descriptor6, this);

          _initializerDefineProperty(this, "allowCP", _descriptor7, this);

          _initializerDefineProperty(this, "initialCombatPointMin", _descriptor8, this);

          _initializerDefineProperty(this, "initialCombatPointMax", _descriptor9, this);

          _initializerDefineProperty(this, "allowDecisionAccuracy", _descriptor10, this);

          _initializerDefineProperty(this, "decisionAccuracyMin", _descriptor11, this);

          _initializerDefineProperty(this, "decisionAccuracyMax", _descriptor12, this);

          _initializerDefineProperty(this, "allowInterval", _descriptor13, this);

          _initializerDefineProperty(this, "minSpawnIntervalMinLevel", _descriptor14, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMinLevel", _descriptor15, this);

          _initializerDefineProperty(this, "minSpawnIntervalMaxLevel", _descriptor16, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMaxLevel", _descriptor17, this);

          _initializerDefineProperty(this, "allowMaxWave", _descriptor18, this);

          _initializerDefineProperty(this, "maxAliveWavesMin", _descriptor19, this);

          _initializerDefineProperty(this, "maxAliveWavesMax", _descriptor20, this);

          _initializerDefineProperty(this, "allowAggressive", _descriptor21, this);

          _initializerDefineProperty(this, "aggressiveForwardChanceMin", _descriptor22, this);

          _initializerDefineProperty(this, "aggressiveForwardChanceMax", _descriptor23, this);

          _initializerDefineProperty(this, "aggressiveFastestEntryChanceMin", _descriptor24, this);

          _initializerDefineProperty(this, "aggressiveFastestEntryChanceMax", _descriptor25, this);

          _initializerDefineProperty(this, "aggressiveForwardUnlockAt", _descriptor26, this);

          _initializerDefineProperty(this, "allowFastReact", _descriptor27, this);

          _initializerDefineProperty(this, "fastReactCounterChanceMin", _descriptor28, this);

          _initializerDefineProperty(this, "fastReactCounterChanceMax", _descriptor29, this);
        }

        onLoad() {
          this.applyLevelSettings();
        }

        applyLevelSettings() {
          var team = this.clampTeam(this.targetTeam);
          var t = this.getDifficulty01();
          var manager = this.getGameManager();
          var smartBrains = this.getTargetSmartArmyBrains(team);
          var battleBrains = this.getTargetBattleArmyBrains(team);

          if (this.allowCP && manager && manager.unitDatabase) {
            var cp = Math.round(this.lerp(this.initialCombatPointMin, this.initialCombatPointMax, t));

            if (team === 0) {
              manager.unitDatabase.teamAInitialCombatPoint = cp;
            } else {
              manager.unitDatabase.teamBInitialCombatPoint = cp;
            }

            manager.initialCombatPoint[team] = cp;
            manager.combatPoint[team] = cp;
          }

          for (var i = 0; i < smartBrains.length; i++) {
            var brain = smartBrains[i];
            if (!brain) continue;

            if (this.allowDecisionAccuracy) {
              brain.decisionAccuracy = this.clamp01(this.lerp(this.decisionAccuracyMin, this.decisionAccuracyMax, t));
            }

            if (this.allowInterval) {
              brain.minSpawnInterval = this.lerp(this.minSpawnIntervalMinLevel, this.minSpawnIntervalMaxLevel, t);
              brain.maxSpawnInterval = this.lerp(this.maxSpawnIntervalMinLevel, this.maxSpawnIntervalMaxLevel, t);
            }

            if (this.allowMaxWave) {
              brain.maxAliveWaves = Math.round(this.lerp(this.maxAliveWavesMin, this.maxAliveWavesMax, t));
            }

            if (this.allowAggressive) {
              var unlockAt = this.clamp01(this.aggressiveForwardUnlockAt);
              var raidT = unlockAt >= 1 ? t >= 1 ? 1 : 0 : this.clamp01((t - unlockAt) / (1 - unlockAt));
              brain.aggressiveForwardChance = this.lerp(this.aggressiveForwardChanceMin, this.aggressiveForwardChanceMax, raidT);
              brain.aggressiveFastestEntryChance = this.lerp(this.aggressiveFastestEntryChanceMin, this.aggressiveFastestEntryChanceMax, raidT);
            }

            if (this.allowFastReact) {
              brain.fastReactCounterChance = this.lerp(this.fastReactCounterChanceMin, this.fastReactCounterChanceMax, t);
            }
          }

          for (var _i = 0; _i < battleBrains.length; _i++) {
            var _brain = battleBrains[_i];
            if (!_brain) continue;

            if (this.allowDecisionAccuracy) {
              _brain.decisionAccuracy = this.clamp01(this.lerp(this.decisionAccuracyMin, this.decisionAccuracyMax, t));
            }

            if (this.allowInterval) {
              _brain.minSpawnInterval = this.lerp(this.minSpawnIntervalMinLevel, this.minSpawnIntervalMaxLevel, t);
              _brain.maxSpawnInterval = this.lerp(this.maxSpawnIntervalMinLevel, this.maxSpawnIntervalMaxLevel, t);
            }

            if (this.allowMaxWave) {
              _brain.maxAliveWaves = Math.round(this.lerp(this.maxAliveWavesMin, this.maxAliveWavesMax, t));
            }
          }
        }

        getGameManager() {
          if (this.gameManager) {
            return this.gameManager;
          }

          var scene = director.getScene();
          if (!scene) return null;
          var managers = scene.getComponentsInChildren(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager);
          return managers.length > 0 ? managers[0] : null;
        }

        getTargetSmartArmyBrains(team) {
          var result = [];

          for (var i = 0; i < this.armyBrains.length; i++) {
            var brain = this.armyBrains[i];
            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;
            result.push(brain);
          }

          if (result.length > 0) {
            return result;
          }

          var scene = director.getScene();
          if (!scene) return result;
          var brains = scene.getComponentsInChildren(_crd && SmartArmyBrain === void 0 ? (_reportPossibleCrUseOfSmartArmyBrain({
            error: Error()
          }), SmartArmyBrain) : SmartArmyBrain);

          for (var _i2 = 0; _i2 < brains.length; _i2++) {
            var _brain2 = brains[_i2];
            if (!_brain2) continue;
            if (this.clampTeam(_brain2.team) !== team) continue;
            result.push(_brain2);
          }

          return result;
        }

        getTargetBattleArmyBrains(team) {
          var result = [];

          for (var i = 0; i < this.battleArmyBrains.length; i++) {
            var brain = this.battleArmyBrains[i];
            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;
            result.push(brain);
          }

          if (result.length > 0) {
            return result;
          }

          var scene = director.getScene();
          if (!scene) return result;
          var brains = scene.getComponentsInChildren(_crd && BattleArmyBrain === void 0 ? (_reportPossibleCrUseOfBattleArmyBrain({
            error: Error()
          }), BattleArmyBrain) : BattleArmyBrain);

          for (var _i3 = 0; _i3 < brains.length; _i3++) {
            var _brain3 = brains[_i3];
            if (!_brain3) continue;
            if (this.clampTeam(_brain3.team) !== team) continue;
            result.push(_brain3);
          }

          return result;
        }

        getDifficulty01() {
          var total = Math.max(1, Math.floor(this.totalLevels));
          var level = Math.max(1, Math.min(total, Math.floor(this.currentLevel)));

          if (total <= 1) {
            return 1;
          }

          return (level - 1) / (total - 1);
        }

        clampTeam(team) {
          return team === 0 ? 0 : 1;
        }

        clamp01(v) {
          return Math.max(0, Math.min(1, v));
        }

        lerp(a, b, t) {
          return a + (b - a) * this.clamp01(t);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "totalLevels", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 300;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "currentLevel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "targetTeam", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "armyBrains", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "battleArmyBrains", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "allowCP", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "initialCombatPointMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 70;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "initialCombatPointMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 180;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "allowDecisionAccuracy", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "decisionAccuracyMin", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "decisionAccuracyMax", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "allowInterval", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnIntervalMinLevel", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5.0;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnIntervalMinLevel", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6.0;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnIntervalMaxLevel", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.7;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnIntervalMaxLevel", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3.7;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "allowMaxWave", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWavesMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWavesMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 15;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "allowAggressive", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "aggressiveForwardChanceMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "aggressiveForwardChanceMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "aggressiveFastestEntryChanceMin", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "aggressiveFastestEntryChanceMax", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "aggressiveForwardUnlockAt", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.45;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "allowFastReact", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "fastReactCounterChanceMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "fastReactCounterChanceMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8f897615a444c3f9822d8a3a627e35c696ea7282.js.map