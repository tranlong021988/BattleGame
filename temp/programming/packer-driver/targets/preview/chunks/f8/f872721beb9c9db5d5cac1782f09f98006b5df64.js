System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, GameManager, BattleArmyBrain, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _crd, ccclass, property, LevelSettings;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
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
      BattleArmyBrain = _unresolved_3.BattleArmyBrain;
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
        min: 0,
        step: 1,
        tooltip: 'Every Nth level is a boss fight. Use 0 to disable boss fights.'
      }), _dec5 = property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Initial CP Multiplier',
        tooltip: 'Multiplier applied only to enemy Initial CP on boss levels. Initial CP is not capped.'
      }), _dec6 = property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Decision Accuracy Multiplier',
        tooltip: 'Multiplier applied only to enemy Decision Accuracy on boss levels. The result remains capped by Decision Accuracy Max.'
      }), _dec7 = property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Max Alive Waves Multiplier',
        tooltip: 'Multiplier applied only to enemy Max Alive Waves on boss levels. The result remains capped by Max Alive Waves Max.'
      }), _dec8 = property({
        tooltip: 'Team affected by this component. Default 1 means team B/enemy.'
      }), _dec9 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec10 = property({
        type: [_crd && BattleArmyBrain === void 0 ? (_reportPossibleCrUseOfBattleArmyBrain({
          error: Error()
        }), BattleArmyBrain) : BattleArmyBrain]
      }), _dec11 = property({
        tooltip: 'Apply initial Combat Point curve to the selected team.'
      }), _dec12 = property({
        tooltip: 'Apply the AI decision accuracy curve. Accuracy affects unit choice only; target and lane selection stay tactical.'
      }), _dec13 = property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at level 1. Use 0 to bias unit choice toward lower-ranked scored candidates and no ranged support.'
      }), _dec14 = property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at the final level. Use 1 to keep the evaluator best unit choice. Target and lane selection stay tactical.'
      }), _dec15 = property({
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
      }), _dec16 = property({
        displayName: 'Easy Spawn Delay Min',
        tooltip: 'Shortest delay between spawn decisions at level 1.'
      }), _dec17 = property({
        displayName: 'Easy Spawn Delay Max',
        tooltip: 'Longest delay between spawn decisions at level 1. Keep this greater than or equal to Easy Spawn Delay Min.'
      }), _dec18 = property({
        displayName: 'Hard Spawn Delay Min',
        tooltip: 'Shortest delay between spawn decisions at the final level. Lower values make the AI react more frequently.'
      }), _dec19 = property({
        displayName: 'Hard Spawn Delay Max',
        tooltip: 'Longest delay between spawn decisions at the final level. Keep this greater than or equal to Hard Spawn Delay Min.'
      }), _dec20 = property({
        tooltip: 'Apply Max Alive Waves curve. Higher levels allow the enemy to keep more waves active.'
      }), _dec(_class = (_class2 = class LevelSettings extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "totalLevels", _descriptor, this);

          _initializerDefineProperty(this, "currentLevel", _descriptor2, this);

          _initializerDefineProperty(this, "bossStagePace", _descriptor3, this);

          _initializerDefineProperty(this, "bossInitialCombatPointMultiplier", _descriptor4, this);

          _initializerDefineProperty(this, "bossDecisionAccuracyMultiplier", _descriptor5, this);

          _initializerDefineProperty(this, "bossMaxAliveWavesMultiplier", _descriptor6, this);

          _initializerDefineProperty(this, "targetTeam", _descriptor7, this);

          _initializerDefineProperty(this, "gameManager", _descriptor8, this);

          _initializerDefineProperty(this, "battleArmyBrains", _descriptor9, this);

          _initializerDefineProperty(this, "allowCP", _descriptor10, this);

          _initializerDefineProperty(this, "initialCombatPointMin", _descriptor11, this);

          _initializerDefineProperty(this, "initialCombatPointMax", _descriptor12, this);

          _initializerDefineProperty(this, "allowDecisionAccuracy", _descriptor13, this);

          _initializerDefineProperty(this, "decisionAccuracyMin", _descriptor14, this);

          _initializerDefineProperty(this, "decisionAccuracyMax", _descriptor15, this);

          _initializerDefineProperty(this, "allowInterval", _descriptor16, this);

          _initializerDefineProperty(this, "minSpawnIntervalMinLevel", _descriptor17, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMinLevel", _descriptor18, this);

          _initializerDefineProperty(this, "minSpawnIntervalMaxLevel", _descriptor19, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMaxLevel", _descriptor20, this);

          _initializerDefineProperty(this, "allowMaxWave", _descriptor21, this);

          _initializerDefineProperty(this, "maxAliveWavesMin", _descriptor22, this);

          _initializerDefineProperty(this, "maxAliveWavesMax", _descriptor23, this);
        }

        onLoad() {
          this.applyTelemetryLevelQuery();
          this.applyLevelSettings();
        }

        applyLevelSettings() {
          var team = this.clampTeam(this.targetTeam);
          var t = this.getDifficulty01();
          var isBossLevel = this.isBossLevel();
          var bossCPMultiplier = this.getBossMultiplier(this.bossInitialCombatPointMultiplier, isBossLevel);
          var bossAccuracyMultiplier = this.getBossMultiplier(this.bossDecisionAccuracyMultiplier, isBossLevel);
          var bossMaxWaveMultiplier = this.getBossMultiplier(this.bossMaxAliveWavesMultiplier, isBossLevel);
          var manager = this.getGameManager();
          var battleBrains = this.getTargetBattleArmyBrains(team);

          if (this.allowCP && manager && manager.unitDatabase) {
            var baseCP = Math.round(this.lerp(this.initialCombatPointMin, this.initialCombatPointMax, t));
            var cp = Math.round(baseCP * bossCPMultiplier);

            if (team === 0) {
              manager.unitDatabase.teamAInitialCombatPoint = cp;
            } else {
              manager.unitDatabase.teamBInitialCombatPoint = cp;
            }

            manager.initialCombatPoint[team] = cp;
            manager.combatPoint[team] = cp;
          }

          for (var i = 0; i < battleBrains.length; i++) {
            var brain = battleBrains[i];
            if (!brain) continue;

            if (this.allowDecisionAccuracy) {
              var baseAccuracy = this.lerp(this.decisionAccuracyMin, this.decisionAccuracyMax, t);
              brain.decisionAccuracy = Math.min(this.clamp01(this.decisionAccuracyMax), this.clamp01(baseAccuracy * bossAccuracyMultiplier));
            }

            if (this.allowInterval) {
              brain.minSpawnInterval = this.lerp(this.minSpawnIntervalMinLevel, this.minSpawnIntervalMaxLevel, t);
              brain.maxSpawnInterval = this.lerp(this.maxSpawnIntervalMinLevel, this.maxSpawnIntervalMaxLevel, t);
            }

            if (this.allowMaxWave) {
              var baseMaxAliveWaves = Math.round(this.lerp(this.maxAliveWavesMin, this.maxAliveWavesMax, t));
              brain.maxAliveWaves = Math.round(Math.min(Math.max(0, this.maxAliveWavesMax), baseMaxAliveWaves * bossMaxWaveMultiplier));
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

          for (var _i = 0; _i < brains.length; _i++) {
            var _brain = brains[_i];
            if (!_brain) continue;
            if (this.clampTeam(_brain.team) !== team) continue;
            result.push(_brain);
          }

          return result;
        }

        applyTelemetryLevelQuery() {
          if (typeof window === 'undefined') return;
          if (!window.location) return;
          var params = new URLSearchParams(window.location.search);
          var totalLevels = this.getQueryInt(params, ['TotalLevels', 'totalLevels'], 0);
          if (totalLevels <= 0) return;
          this.totalLevels = Math.max(1, totalLevels);
          this.currentLevel = Math.max(1, Math.min(this.totalLevels, this.getQueryInt(params, ['currentLevel'], 1)));
        }

        getQueryInt(params, keys, fallback) {
          for (var i = 0; i < keys.length; i++) {
            var _params$get;

            var key = keys[i];
            var value = (_params$get = params.get(key)) != null ? _params$get : params.get("?" + key);
            if (value === null) continue;
            var parsed = Number(value);

            if (Number.isFinite(parsed)) {
              return Math.floor(parsed);
            }
          }

          return fallback;
        }

        getDifficulty01() {
          var total = Math.max(1, Math.floor(this.totalLevels));
          var level = Math.max(1, Math.min(total, Math.floor(this.currentLevel)));

          if (total <= 1) {
            return 1;
          }

          return (level - 1) / (total - 1);
        }

        getBossMultiplier(configuredMultiplier, isBossLevel) {
          if (!isBossLevel) {
            return 1;
          }

          return Math.max(1, Number.isFinite(configuredMultiplier) ? configuredMultiplier : 1);
        }

        isBossLevel() {
          var pace = Math.max(0, Math.floor(this.bossStagePace));

          if (pace <= 0) {
            return false;
          }

          var level = Math.max(1, Math.floor(this.currentLevel));
          return level % pace === 0;
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bossStagePace", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bossInitialCombatPointMultiplier", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "bossDecisionAccuracyMultiplier", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "bossMaxAliveWavesMultiplier", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "targetTeam", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "battleArmyBrains", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "allowCP", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "initialCombatPointMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 600;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "initialCombatPointMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1040;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "allowDecisionAccuracy", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "decisionAccuracyMin", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "decisionAccuracyMax", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "allowInterval", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnIntervalMinLevel", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5.0;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnIntervalMinLevel", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6.0;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnIntervalMaxLevel", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.7;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnIntervalMaxLevel", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3.7;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "allowMaxWave", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWavesMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWavesMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 15;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f872721beb9c9db5d5cac1782f09f98006b5df64.js.map