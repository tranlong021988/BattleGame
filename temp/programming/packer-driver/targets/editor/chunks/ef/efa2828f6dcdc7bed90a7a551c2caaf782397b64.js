System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, UnitType, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _dec4, _dec5, _dec6, _class4, _class5, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _dec7, _dec8, _dec9, _dec10, _dec11, _class7, _class8, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _crd, ccclass, property, UnitPrefabEntry, HeroEntry, BattleUnitDatabase;

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
      Component = _cc.Component;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
    }, function (_unresolved_2) {
      UnitType = _unresolved_2.UnitType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6763ckOqW5NSphZiW/byzSP", "BattleUnitDatabase", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitPrefabEntry", UnitPrefabEntry = (_dec = ccclass('UnitPrefabEntry'), _dec2 = property(Prefab), _dec3 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec(_class = (_class2 = class UnitPrefabEntry {
        constructor() {
          _initializerDefineProperty(this, "name", _descriptor, this);

          _initializerDefineProperty(this, "prefab", _descriptor2, this);

          _initializerDefineProperty(this, "unitType", _descriptor3, this);

          _initializerDefineProperty(this, "unitCount", _descriptor4, this);

          _initializerDefineProperty(this, "prewarmCount", _descriptor5, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor6, this);

          _initializerDefineProperty(this, "health", _descriptor7, this);

          _initializerDefineProperty(this, "damage", _descriptor8, this);

          _initializerDefineProperty(this, "defense", _descriptor9, this);

          _initializerDefineProperty(this, "combatPointCost", _descriptor10, this);

          _initializerDefineProperty(this, "killReward", _descriptor11, this);

          _initializerDefineProperty(this, "counterKillReward", _descriptor12, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "name", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "unitType", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "unitCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "prewarmCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "defense", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "combatPointCost", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "killReward", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "counterKillReward", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class));

      _export("HeroEntry", HeroEntry = (_dec4 = ccclass('HeroEntry'), _dec5 = property(Node), _dec6 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec4(_class4 = (_class5 = class HeroEntry {
        constructor() {
          _initializerDefineProperty(this, "name", _descriptor13, this);

          _initializerDefineProperty(this, "heroNode", _descriptor14, this);

          _initializerDefineProperty(this, "unitType", _descriptor15, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor16, this);

          _initializerDefineProperty(this, "health", _descriptor17, this);

          _initializerDefineProperty(this, "damage", _descriptor18, this);

          _initializerDefineProperty(this, "defense", _descriptor19, this);

          _initializerDefineProperty(this, "killReward", _descriptor20, this);

          _initializerDefineProperty(this, "counterKillReward", _descriptor21, this);
        }

      }, (_descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "name", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'hero';
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "heroNode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "unitType", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 500;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "defense", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "killReward", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "counterKillReward", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class5)) || _class4));

      _export("BattleUnitDatabase", BattleUnitDatabase = (_dec7 = ccclass('BattleUnitDatabase'), _dec8 = property(HeroEntry), _dec9 = property(HeroEntry), _dec10 = property({
        type: [UnitPrefabEntry]
      }), _dec11 = property({
        type: [UnitPrefabEntry]
      }), _dec7(_class7 = (_class8 = class BattleUnitDatabase extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "enableCombatPoint", _descriptor22, this);

          _initializerDefineProperty(this, "teamAMaxCombatPoint", _descriptor23, this);

          _initializerDefineProperty(this, "teamBMaxCombatPoint", _descriptor24, this);

          _initializerDefineProperty(this, "teamAHero", _descriptor25, this);

          _initializerDefineProperty(this, "teamBHero", _descriptor26, this);

          _initializerDefineProperty(this, "teamAUnits", _descriptor27, this);

          _initializerDefineProperty(this, "teamBUnits", _descriptor28, this);
        }

        getTeamEntries(team) {
          return team === 0 ? this.teamAUnits : this.teamBUnits;
        }

        getHeroEntry(team) {
          return team === 0 ? this.teamAHero : this.teamBHero;
        }

        getMaxCombatPoint(team) {
          return team === 0 ? this.teamAMaxCombatPoint : this.teamBMaxCombatPoint;
        }

        getEntry(team, unitName) {
          const entries = this.getTeamEntries(team);

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!entry) continue;

            if (entry.name === unitName) {
              return entry;
            }
          }

          return null;
        }

      }, (_descriptor22 = _applyDecoratedDescriptor(_class8.prototype, "enableCombatPoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class8.prototype, "teamAMaxCombatPoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class8.prototype, "teamBMaxCombatPoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class8.prototype, "teamAHero", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new HeroEntry();
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class8.prototype, "teamBHero", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new HeroEntry();
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class8.prototype, "teamAUnits", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class8.prototype, "teamBUnits", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class8)) || _class7));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=efa2828f6dcdc7bed90a7a551c2caaf782397b64.js.map