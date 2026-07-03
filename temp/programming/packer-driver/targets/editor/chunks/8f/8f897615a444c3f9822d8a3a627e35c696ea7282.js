System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, GameManager, ArmyBrain, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _crd, ccclass, property, LevelSettings;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfArmyBrain(extras) {
    _reporterNs.report("ArmyBrain", "./ArmyBrain", _context.meta, extras);
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
      ArmyBrain = _unresolved_3.ArmyBrain;
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
        type: [_crd && ArmyBrain === void 0 ? (_reportPossibleCrUseOfArmyBrain({
          error: Error()
        }), ArmyBrain) : ArmyBrain]
      }), _dec7 = property({
        tooltip: 'Apply initial Combat Point curve to the selected team.'
      }), _dec8 = property({
        tooltip: 'Apply AI Intelligence curve. Higher values make ArmyBrain choose better counter units.'
      }), _dec9 = property({
        tooltip: 'Apply Lane Awareness curve. Higher values make ArmyBrain value lane pressure more accurately.'
      }), _dec10 = property({
        tooltip: 'Apply Counter Same Lane Chance curve. Higher values make counter waves spawn in the threatened lane more often.'
      }), _dec11 = property({
        tooltip: 'Apply Fast React Chance curve. At max level, ArmyBrain always attempts eligible fast-react counters.'
      }), _dec12 = property({
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
      }), _dec13 = property({
        tooltip: 'Apply Max Alive Waves curve. Higher levels allow the enemy to keep more waves active.'
      }), _dec14 = property({
        tooltip: 'Apply Aggressive Forward curve. Higher levels unlock more lane-empty raid attempts.'
      }), _dec15 = property({
        min: 0,
        max: 1,
        tooltip: 'Difficulty threshold where aggressive-forward raid chance starts increasing.'
      }), _dec(_class = (_class2 = class LevelSettings extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "totalLevels", _descriptor, this);

          _initializerDefineProperty(this, "currentLevel", _descriptor2, this);

          _initializerDefineProperty(this, "targetTeam", _descriptor3, this);

          _initializerDefineProperty(this, "gameManager", _descriptor4, this);

          _initializerDefineProperty(this, "armyBrains", _descriptor5, this);

          _initializerDefineProperty(this, "allowCP", _descriptor6, this);

          _initializerDefineProperty(this, "initialCombatPointMin", _descriptor7, this);

          _initializerDefineProperty(this, "initialCombatPointMax", _descriptor8, this);

          _initializerDefineProperty(this, "allowAI", _descriptor9, this);

          _initializerDefineProperty(this, "aiIntelligenceMin", _descriptor10, this);

          _initializerDefineProperty(this, "aiIntelligenceMax", _descriptor11, this);

          _initializerDefineProperty(this, "allowLane", _descriptor12, this);

          _initializerDefineProperty(this, "laneAwarenessMin", _descriptor13, this);

          _initializerDefineProperty(this, "laneAwarenessMax", _descriptor14, this);

          _initializerDefineProperty(this, "allowSameLane", _descriptor15, this);

          _initializerDefineProperty(this, "counterSameLaneChanceMin", _descriptor16, this);

          _initializerDefineProperty(this, "counterSameLaneChanceMax", _descriptor17, this);

          _initializerDefineProperty(this, "allowFastReact", _descriptor18, this);

          _initializerDefineProperty(this, "fastReactChanceMin", _descriptor19, this);

          _initializerDefineProperty(this, "fastReactChanceMax", _descriptor20, this);

          _initializerDefineProperty(this, "allowInterval", _descriptor21, this);

          _initializerDefineProperty(this, "minSpawnIntervalMinLevel", _descriptor22, this);

          _initializerDefineProperty(this, "minSpawnIntervalMaxLevel", _descriptor23, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMinLevel", _descriptor24, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMaxLevel", _descriptor25, this);

          _initializerDefineProperty(this, "allowMaxWave", _descriptor26, this);

          _initializerDefineProperty(this, "maxAliveWavesMin", _descriptor27, this);

          _initializerDefineProperty(this, "maxAliveWavesMax", _descriptor28, this);

          _initializerDefineProperty(this, "allowAggressive", _descriptor29, this);

          _initializerDefineProperty(this, "aggressiveForwardChanceMin", _descriptor30, this);

          _initializerDefineProperty(this, "aggressiveForwardChanceMax", _descriptor31, this);

          _initializerDefineProperty(this, "aggressiveForwardUnlockAt", _descriptor32, this);
        }

        onLoad() {
          this.applyLevelSettings();
        }

        applyLevelSettings() {
          const team = this.clampTeam(this.targetTeam);
          const t = this.getDifficulty01();
          const manager = this.getGameManager();
          const brains = this.getTargetArmyBrains(team);

          if (this.allowCP && manager && manager.unitDatabase) {
            const cp = Math.round(this.lerp(this.initialCombatPointMin, this.initialCombatPointMax, t));

            if (team === 0) {
              manager.unitDatabase.teamAInitialCombatPoint = cp;
            } else {
              manager.unitDatabase.teamBInitialCombatPoint = cp;
            }

            manager.initialCombatPoint[team] = cp;
            manager.combatPoint[team] = cp;
          }

          for (let i = 0; i < brains.length; i++) {
            const brain = brains[i];
            if (!brain) continue;

            if (this.allowAI) {
              brain.aiIntelligence = this.lerp(this.aiIntelligenceMin, this.aiIntelligenceMax, t);
            }

            if (this.allowLane) {
              brain.laneAwareness = this.lerp(this.laneAwarenessMin, this.laneAwarenessMax, t);
            }

            if (this.allowSameLane) {
              brain.counterSameLaneChance = this.lerp(this.counterSameLaneChanceMin, this.counterSameLaneChanceMax, t);
            }

            if (this.allowFastReact) {
              brain.fastReactChance = this.lerp(this.fastReactChanceMin, this.fastReactChanceMax, t);
            }

            if (this.allowInterval) {
              brain.minSpawnInterval = this.lerp(this.minSpawnIntervalMinLevel, this.minSpawnIntervalMaxLevel, t);
              brain.maxSpawnInterval = this.lerp(this.maxSpawnIntervalMinLevel, this.maxSpawnIntervalMaxLevel, t);
            }

            if (this.allowMaxWave) {
              brain.maxAliveWaves = Math.round(this.lerp(this.maxAliveWavesMin, this.maxAliveWavesMax, t));
            }

            if (this.allowAggressive) {
              const unlockAt = this.clamp01(this.aggressiveForwardUnlockAt);
              const raidT = unlockAt >= 1 ? t >= 1 ? 1 : 0 : this.clamp01((t - unlockAt) / (1 - unlockAt));
              brain.aggressiveForwardChance = this.lerp(this.aggressiveForwardChanceMin, this.aggressiveForwardChanceMax, raidT);
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

        getTargetArmyBrains(team) {
          const result = [];

          for (let i = 0; i < this.armyBrains.length; i++) {
            const brain = this.armyBrains[i];
            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;
            result.push(brain);
          }

          if (result.length > 0) {
            return result;
          }

          const scene = director.getScene();
          if (!scene) return result;
          const brains = scene.getComponentsInChildren(_crd && ArmyBrain === void 0 ? (_reportPossibleCrUseOfArmyBrain({
            error: Error()
          }), ArmyBrain) : ArmyBrain);

          for (let i = 0; i < brains.length; i++) {
            const brain = brains[i];
            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;
            result.push(brain);
          }

          return result;
        }

        getDifficulty01() {
          const total = Math.max(1, Math.floor(this.totalLevels));
          const level = Math.max(1, Math.min(total, Math.floor(this.currentLevel)));

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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "targetTeam", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "armyBrains", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "allowCP", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "initialCombatPointMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 70;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "initialCombatPointMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 180;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "allowAI", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "aiIntelligenceMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "aiIntelligenceMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "allowLane", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "laneAwarenessMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "laneAwarenessMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "allowSameLane", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "counterSameLaneChanceMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.4;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "counterSameLaneChanceMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "allowFastReact", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "fastReactChanceMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "fastReactChanceMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "allowInterval", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnIntervalMinLevel", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5.0;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnIntervalMaxLevel", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.7;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnIntervalMinLevel", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6.0;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnIntervalMaxLevel", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3.7;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "allowMaxWave", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWavesMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWavesMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 15;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "allowAggressive", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "aggressiveForwardChanceMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "aggressiveForwardChanceMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "aggressiveForwardUnlockAt", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.45;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8f897615a444c3f9822d8a3a627e35c696ea7282.js.map