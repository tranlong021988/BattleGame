System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, GameManager, ArmyBrain, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _crd, ccclass, property, LevelSettings;

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
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
      }), _dec12 = property({
        tooltip: 'Apply Max Alive Waves curve. Higher levels allow the enemy to keep more waves active.'
      }), _dec13 = property({
        tooltip: 'Apply Aggressive Forward curve. Higher levels unlock more lane-empty raid attempts.'
      }), _dec(_class = (_class2 = class LevelSettings extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "totalLevels", _descriptor, this);

          _initializerDefineProperty(this, "currentLevel", _descriptor2, this);

          _initializerDefineProperty(this, "targetTeam", _descriptor3, this);

          _initializerDefineProperty(this, "gameManager", _descriptor4, this);

          _initializerDefineProperty(this, "armyBrains", _descriptor5, this);

          _initializerDefineProperty(this, "allowCP", _descriptor6, this);

          _initializerDefineProperty(this, "allowAI", _descriptor7, this);

          _initializerDefineProperty(this, "allowLane", _descriptor8, this);

          _initializerDefineProperty(this, "allowSameLane", _descriptor9, this);

          _initializerDefineProperty(this, "allowInterval", _descriptor10, this);

          _initializerDefineProperty(this, "allowMaxWave", _descriptor11, this);

          _initializerDefineProperty(this, "allowAggressive", _descriptor12, this);
        }

        onLoad() {
          this.applyLevelSettings();
        }

        applyLevelSettings() {
          var team = this.clampTeam(this.targetTeam);
          var t = this.getDifficulty01();
          var manager = this.getGameManager();
          var brains = this.getTargetArmyBrains(team);

          if (this.allowCP && manager && manager.unitDatabase) {
            var cp = Math.round(this.lerp(70, 180, t));

            if (team === 0) {
              manager.unitDatabase.teamAInitialCombatPoint = cp;
            } else {
              manager.unitDatabase.teamBInitialCombatPoint = cp;
            }

            manager.initialCombatPoint[team] = cp;
            manager.combatPoint[team] = cp;
          }

          for (var i = 0; i < brains.length; i++) {
            var brain = brains[i];
            if (!brain) continue;

            if (this.allowAI) {
              brain.aiIntelligence = t;
            }

            if (this.allowLane) {
              brain.laneAwareness = t;
            }

            if (this.allowSameLane) {
              brain.counterSameLaneChance = this.lerp(0.4, 1, t);
            }

            if (this.allowInterval) {
              brain.minSpawnInterval = this.lerp(5.0, 2.7, t);
              brain.maxSpawnInterval = this.lerp(6.0, 3.7, t);
            }

            if (this.allowMaxWave) {
              brain.maxAliveWaves = Math.round(this.lerp(5, 15, t));
            }

            if (this.allowAggressive) {
              var raidT = this.clamp01((t - 0.45) / 0.55);
              brain.aggressiveForwardChance = raidT * 0.25;
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

        getTargetArmyBrains(team) {
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
          var brains = scene.getComponentsInChildren(_crd && ArmyBrain === void 0 ? (_reportPossibleCrUseOfArmyBrain({
            error: Error()
          }), ArmyBrain) : ArmyBrain);

          for (var _i = 0; _i < brains.length; _i++) {
            var _brain = brains[_i];
            if (!_brain) continue;
            if (this.clampTeam(_brain.team) !== team) continue;
            result.push(_brain);
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
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "allowCP", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "allowAI", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "allowLane", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "allowSameLane", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "allowInterval", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "allowMaxWave", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "allowAggressive", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8f897615a444c3f9822d8a3a627e35c696ea7282.js.map