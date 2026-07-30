System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, GameManager, BattleArmyBrain, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _crd, ccclass, property, LevelSettings;

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
        tooltip: 'Multiplier applied to enemy Initial CP, Decision Accuracy, and Max Alive Waves on boss levels. Accuracy and waves remain capped by their configured maximums; CP is not capped.'
      }), _dec6 = property({
        tooltip: 'Team affected by this component. Default 1 means team B/enemy.'
      }), _dec7 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec8 = property({
        type: [_crd && BattleArmyBrain === void 0 ? (_reportPossibleCrUseOfBattleArmyBrain({
          error: Error()
        }), BattleArmyBrain) : BattleArmyBrain]
      }), _dec9 = property({
        tooltip: 'Apply initial Combat Point curve to the selected team.'
      }), _dec10 = property({
        tooltip: 'Apply the AI decision accuracy curve. Accuracy affects unit choice only; target and lane selection stay tactical.'
      }), _dec11 = property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at level 1. Use 0 to bias unit choice toward lower-ranked scored candidates and no ranged support.'
      }), _dec12 = property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at the final level. Use 1 to keep the evaluator best unit choice. Target and lane selection stay tactical.'
      }), _dec13 = property({
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
      }), _dec14 = property({
        displayName: 'Easy Spawn Delay Min',
        tooltip: 'Shortest delay between spawn decisions at level 1.'
      }), _dec15 = property({
        displayName: 'Easy Spawn Delay Max',
        tooltip: 'Longest delay between spawn decisions at level 1. Keep this greater than or equal to Easy Spawn Delay Min.'
      }), _dec16 = property({
        displayName: 'Hard Spawn Delay Min',
        tooltip: 'Shortest delay between spawn decisions at the final level. Lower values make the AI react more frequently.'
      }), _dec17 = property({
        displayName: 'Hard Spawn Delay Max',
        tooltip: 'Longest delay between spawn decisions at the final level. Keep this greater than or equal to Hard Spawn Delay Min.'
      }), _dec18 = property({
        tooltip: 'Apply Max Alive Waves curve. Higher levels allow the enemy to keep more waves active.'
      }), _dec(_class = (_class2 = class LevelSettings extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "totalLevels", _descriptor, this);

          _initializerDefineProperty(this, "currentLevel", _descriptor2, this);

          _initializerDefineProperty(this, "bossStagePace", _descriptor3, this);

          _initializerDefineProperty(this, "bossDifficultyMultiplier", _descriptor4, this);

          _initializerDefineProperty(this, "targetTeam", _descriptor5, this);

          _initializerDefineProperty(this, "gameManager", _descriptor6, this);

          _initializerDefineProperty(this, "battleArmyBrains", _descriptor7, this);

          _initializerDefineProperty(this, "allowCP", _descriptor8, this);

          _initializerDefineProperty(this, "initialCombatPointMin", _descriptor9, this);

          _initializerDefineProperty(this, "initialCombatPointMax", _descriptor10, this);

          _initializerDefineProperty(this, "allowDecisionAccuracy", _descriptor11, this);

          _initializerDefineProperty(this, "decisionAccuracyMin", _descriptor12, this);

          _initializerDefineProperty(this, "decisionAccuracyMax", _descriptor13, this);

          _initializerDefineProperty(this, "allowInterval", _descriptor14, this);

          _initializerDefineProperty(this, "minSpawnIntervalMinLevel", _descriptor15, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMinLevel", _descriptor16, this);

          _initializerDefineProperty(this, "minSpawnIntervalMaxLevel", _descriptor17, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMaxLevel", _descriptor18, this);

          _initializerDefineProperty(this, "allowMaxWave", _descriptor19, this);

          _initializerDefineProperty(this, "maxAliveWavesMin", _descriptor20, this);

          _initializerDefineProperty(this, "maxAliveWavesMax", _descriptor21, this);
        }

        onLoad() {
          this.applyTelemetryLevelQuery();
          this.applyLevelSettings();
        }

        applyLevelSettings() {
          const team = this.clampTeam(this.targetTeam);
          const t = this.getDifficulty01();
          const bossMultiplier = this.getBossDifficultyMultiplier();
          const manager = this.getGameManager();
          const battleBrains = this.getTargetBattleArmyBrains(team);

          if (this.allowCP && manager && manager.unitDatabase) {
            const baseCP = Math.round(this.lerp(this.initialCombatPointMin, this.initialCombatPointMax, t));
            const cp = Math.round(baseCP * bossMultiplier);

            if (team === 0) {
              manager.unitDatabase.teamAInitialCombatPoint = cp;
            } else {
              manager.unitDatabase.teamBInitialCombatPoint = cp;
            }

            manager.initialCombatPoint[team] = cp;
            manager.combatPoint[team] = cp;
          }

          for (let i = 0; i < battleBrains.length; i++) {
            const brain = battleBrains[i];
            if (!brain) continue;

            if (this.allowDecisionAccuracy) {
              const baseAccuracy = this.lerp(this.decisionAccuracyMin, this.decisionAccuracyMax, t);
              brain.decisionAccuracy = Math.min(this.clamp01(this.decisionAccuracyMax), this.clamp01(baseAccuracy * bossMultiplier));
            }

            if (this.allowInterval) {
              brain.minSpawnInterval = this.lerp(this.minSpawnIntervalMinLevel, this.minSpawnIntervalMaxLevel, t);
              brain.maxSpawnInterval = this.lerp(this.maxSpawnIntervalMinLevel, this.maxSpawnIntervalMaxLevel, t);
            }

            if (this.allowMaxWave) {
              const baseMaxAliveWaves = Math.round(this.lerp(this.maxAliveWavesMin, this.maxAliveWavesMax, t));
              brain.maxAliveWaves = Math.round(Math.min(Math.max(0, this.maxAliveWavesMax), baseMaxAliveWaves * bossMultiplier));
            }
          }
        }

        getGameManager() {
          if (this.gameManager) {
            return this.gameManager;
          }

          const scene = director.getScene();
          if (!scene) return null;
          const managers = scene.getComponentsInChildren(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager);
          return managers.length > 0 ? managers[0] : null;
        }

        getTargetBattleArmyBrains(team) {
          const result = [];

          for (let i = 0; i < this.battleArmyBrains.length; i++) {
            const brain = this.battleArmyBrains[i];
            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;
            result.push(brain);
          }

          if (result.length > 0) {
            return result;
          }

          const scene = director.getScene();
          if (!scene) return result;
          const brains = scene.getComponentsInChildren(_crd && BattleArmyBrain === void 0 ? (_reportPossibleCrUseOfBattleArmyBrain({
            error: Error()
          }), BattleArmyBrain) : BattleArmyBrain);

          for (let i = 0; i < brains.length; i++) {
            const brain = brains[i];
            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;
            result.push(brain);
          }

          return result;
        }

        applyTelemetryLevelQuery() {
          if (typeof window === 'undefined') return;
          if (!window.location) return;
          const params = new URLSearchParams(window.location.search);
          const totalLevels = this.getQueryInt(params, ['TotalLevels', 'totalLevels'], 0);
          if (totalLevels <= 0) return;
          this.totalLevels = Math.max(1, totalLevels);
          this.currentLevel = Math.max(1, Math.min(this.totalLevels, this.getQueryInt(params, ['currentLevel'], 1)));
        }

        getQueryInt(params, keys, fallback) {
          for (let i = 0; i < keys.length; i++) {
            var _params$get;

            const key = keys[i];
            const value = (_params$get = params.get(key)) != null ? _params$get : params.get(`?${key}`);
            if (value === null) continue;
            const parsed = Number(value);

            if (Number.isFinite(parsed)) {
              return Math.floor(parsed);
            }
          }

          return fallback;
        }

        getDifficulty01() {
          const total = Math.max(1, Math.floor(this.totalLevels));
          const level = Math.max(1, Math.min(total, Math.floor(this.currentLevel)));

          if (total <= 1) {
            return 1;
          }

          return (level - 1) / (total - 1);
        }

        getBossDifficultyMultiplier() {
          if (!this.isBossLevel()) {
            return 1;
          }

          return Math.max(1, Number.isFinite(this.bossDifficultyMultiplier) ? this.bossDifficultyMultiplier : 1);
        }

        isBossLevel() {
          const pace = Math.max(0, Math.floor(this.bossStagePace));

          if (pace <= 0) {
            return false;
          }

          const level = Math.max(1, Math.floor(this.currentLevel));
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
        initializer: function () {
          return 300;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "currentLevel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bossStagePace", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bossDifficultyMultiplier", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.2;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "targetTeam", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "battleArmyBrains", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "allowCP", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "initialCombatPointMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 600;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "initialCombatPointMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1040;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "allowDecisionAccuracy", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "decisionAccuracyMin", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "decisionAccuracyMax", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "allowInterval", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnIntervalMinLevel", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5.0;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnIntervalMinLevel", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6.0;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnIntervalMaxLevel", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.7;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnIntervalMaxLevel", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3.7;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "allowMaxWave", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWavesMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWavesMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 15;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8f897615a444c3f9822d8a3a627e35c696ea7282.js.map