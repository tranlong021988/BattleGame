System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Node, Prefab, UnitType, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _dec5, _dec6, _dec7, _class4, _class5, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class7, _class8, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _crd, ccclass, property, UnitPrefabEntry, HeroEntry, BattleUnitDatabase;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

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
      Color = _cc.Color;
      Component = _cc.Component;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
    }, function (_unresolved_2) {
      UnitType = _unresolved_2.UnitType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6763ckOqW5NSphZiW/byzSP", "BattleUnitDatabase", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'Node', 'Prefab']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitPrefabEntry", UnitPrefabEntry = (_dec = ccclass('UnitPrefabEntry'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec(_class = (_class2 = class UnitPrefabEntry {
        constructor() {
          _initializerDefineProperty(this, "name", _descriptor, this);

          _initializerDefineProperty(this, "prefab", _descriptor2, this);

          _initializerDefineProperty(this, "waveBannerPrefab", _descriptor3, this);

          _initializerDefineProperty(this, "unitType", _descriptor4, this);

          _initializerDefineProperty(this, "unitCount", _descriptor5, this);

          _initializerDefineProperty(this, "maxUnitPerRow", _descriptor6, this);

          _initializerDefineProperty(this, "squareFormationWidth", _descriptor7, this);

          _initializerDefineProperty(this, "spaceBetweenUnit", _descriptor8, this);

          _initializerDefineProperty(this, "spaceBetweenRow", _descriptor9, this);

          _initializerDefineProperty(this, "prewarmCount", _descriptor10, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor11, this);

          _initializerDefineProperty(this, "attackRange", _descriptor12, this);

          _initializerDefineProperty(this, "attackIntervalMin", _descriptor13, this);

          _initializerDefineProperty(this, "attackIntervalMax", _descriptor14, this);

          _initializerDefineProperty(this, "health", _descriptor15, this);

          _initializerDefineProperty(this, "damage", _descriptor16, this);

          _initializerDefineProperty(this, "defense", _descriptor17, this);

          _initializerDefineProperty(this, "combatPointCost", _descriptor18, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "name", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "unitType", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "unitCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxUnitPerRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "squareFormationWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "spaceBetweenUnit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "spaceBetweenRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "prewarmCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "attackRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "attackIntervalMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.4;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "attackIntervalMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.45;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "defense", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "combatPointCost", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      })), _class2)) || _class));

      _export("HeroEntry", HeroEntry = (_dec5 = ccclass('HeroEntry'), _dec6 = property(Node), _dec7 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec5(_class4 = (_class5 = class HeroEntry {
        constructor() {
          _initializerDefineProperty(this, "name", _descriptor19, this);

          _initializerDefineProperty(this, "heroNode", _descriptor20, this);

          _initializerDefineProperty(this, "unitType", _descriptor21, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor22, this);

          _initializerDefineProperty(this, "guardDistance", _descriptor23, this);

          _initializerDefineProperty(this, "health", _descriptor24, this);

          _initializerDefineProperty(this, "damage", _descriptor25, this);

          _initializerDefineProperty(this, "defense", _descriptor26, this);

          _initializerDefineProperty(this, "combatPointBountyValue", _descriptor27, this);
        }

      }, (_descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "name", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'hero';
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "heroNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "unitType", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "guardDistance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 500;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "defense", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class5.prototype, "combatPointBountyValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class5)) || _class4));

      _export("BattleUnitDatabase", BattleUnitDatabase = (_dec8 = ccclass('BattleUnitDatabase'), _dec9 = property(Color), _dec10 = property(Color), _dec11 = property(HeroEntry), _dec12 = property(HeroEntry), _dec13 = property({
        type: [UnitPrefabEntry]
      }), _dec14 = property({
        type: [UnitPrefabEntry]
      }), _dec8(_class7 = (_class8 = class BattleUnitDatabase extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "enableCombatPoint", _descriptor28, this);

          _initializerDefineProperty(this, "teamAInitialCombatPoint", _descriptor29, this);

          _initializerDefineProperty(this, "teamBInitialCombatPoint", _descriptor30, this);

          _initializerDefineProperty(this, "killRewardCostWeight", _descriptor31, this);

          _initializerDefineProperty(this, "counterKillRewardCostWeight", _descriptor32, this);

          _initializerDefineProperty(this, "teamAWaveBannerBackgroundColor", _descriptor33, this);

          _initializerDefineProperty(this, "teamBWaveBannerBackgroundColor", _descriptor34, this);

          _initializerDefineProperty(this, "teamAHero", _descriptor35, this);

          _initializerDefineProperty(this, "teamBHero", _descriptor36, this);

          _initializerDefineProperty(this, "teamAUnits", _descriptor37, this);

          _initializerDefineProperty(this, "teamBUnits", _descriptor38, this);
        }

        getTeamEntries(team) {
          return team === 0 ? this.teamAUnits : this.teamBUnits;
        }

        getHeroEntry(team) {
          return team === 0 ? this.teamAHero : this.teamBHero;
        }

        getInitialCombatPoint(team) {
          return team === 0 ? this.teamAInitialCombatPoint : this.teamBInitialCombatPoint;
        }

        getEntry(team, unitName) {
          var entries = this.getTeamEntries(team);

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!entry) continue;

            if (entry.name === unitName) {
              return entry;
            }
          }

          return null;
        }

        calculateKillRewardFromBounty(bountyValue, isCounterKill) {
          var baseValue = Math.max(0, bountyValue);
          var reward = baseValue * Math.max(0, this.killRewardCostWeight);

          if (isCounterKill) {
            reward += baseValue * Math.max(0, this.counterKillRewardCostWeight);
          }

          return reward;
        }

      }, (_descriptor28 = _applyDecoratedDescriptor(_class8.prototype, "enableCombatPoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class8.prototype, "teamAInitialCombatPoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class8.prototype, "teamBInitialCombatPoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class8.prototype, "killRewardCostWeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.0;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class8.prototype, "counterKillRewardCostWeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.15;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class8.prototype, "teamAWaveBannerBackgroundColor", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(0, 70, 255, 255);
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class8.prototype, "teamBWaveBannerBackgroundColor", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 0, 0, 255);
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class8.prototype, "teamAHero", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new HeroEntry();
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class8.prototype, "teamBHero", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new HeroEntry();
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class8.prototype, "teamAUnits", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class8.prototype, "teamBUnits", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class8)) || _class7));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=efa2828f6dcdc7bed90a7a551c2caaf782397b64.js.map