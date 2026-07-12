System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Material, Node, Prefab, UnitType, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _dec8, _dec9, _dec10, _class4, _class5, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _class7, _class8, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _crd, ccclass, property, UnitPrefabEntry, HeroEntry, BattleUnitDatabase;

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
      Material = _cc.Material;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
    }, function (_unresolved_2) {
      UnitType = _unresolved_2.UnitType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6763ckOqW5NSphZiW/byzSP", "BattleUnitDatabase", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'Material', 'Node', 'Prefab']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitPrefabEntry", UnitPrefabEntry = (_dec = ccclass('UnitPrefabEntry'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property({
        min: 0,
        step: 1,
        tooltip: 'Icon index in the shared wave banner sheet. Runtime sends this as an instanced attribute so banners can keep one shared material.'
      }), _dec5 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec6 = property({
        tooltip: 'Only unlocked entries can be selected or spawned by player, AI, debug, or direct spawn paths.'
      }), _dec7 = property({
        tooltip: 'Allows hard-separated units to push this unit even while it is busy/engaged and normally locked.'
      }), _dec(_class = (_class2 = class UnitPrefabEntry {
        constructor() {
          _initializerDefineProperty(this, "name", _descriptor, this);

          _initializerDefineProperty(this, "prefab", _descriptor2, this);

          _initializerDefineProperty(this, "waveBannerPrefab", _descriptor3, this);

          _initializerDefineProperty(this, "waveBannerIconId", _descriptor4, this);

          _initializerDefineProperty(this, "unitType", _descriptor5, this);

          _initializerDefineProperty(this, "unlocked", _descriptor6, this);

          _initializerDefineProperty(this, "unitCount", _descriptor7, this);

          _initializerDefineProperty(this, "maxUnitPerRow", _descriptor8, this);

          _initializerDefineProperty(this, "squareFormationWidth", _descriptor9, this);

          _initializerDefineProperty(this, "spaceBetweenUnit", _descriptor10, this);

          _initializerDefineProperty(this, "spaceBetweenRow", _descriptor11, this);

          _initializerDefineProperty(this, "prewarmCount", _descriptor12, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor13, this);

          _initializerDefineProperty(this, "canBePush", _descriptor14, this);

          _initializerDefineProperty(this, "attackRange", _descriptor15, this);

          _initializerDefineProperty(this, "attackIntervalMin", _descriptor16, this);

          _initializerDefineProperty(this, "attackIntervalMax", _descriptor17, this);

          _initializerDefineProperty(this, "health", _descriptor18, this);

          _initializerDefineProperty(this, "damage", _descriptor19, this);

          _initializerDefineProperty(this, "defense", _descriptor20, this);

          _initializerDefineProperty(this, "combatPointCost", _descriptor21, this);
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
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerIconId", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "unitType", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "unlocked", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "unitCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "maxUnitPerRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "squareFormationWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "spaceBetweenUnit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "spaceBetweenRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "prewarmCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "canBePush", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "attackRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.2;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "attackIntervalMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.4;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "attackIntervalMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.45;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "defense", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "combatPointCost", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      })), _class2)) || _class));

      _export("HeroEntry", HeroEntry = (_dec8 = ccclass('HeroEntry'), _dec9 = property(Node), _dec10 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec8(_class4 = (_class5 = class HeroEntry {
        constructor() {
          _initializerDefineProperty(this, "name", _descriptor22, this);

          _initializerDefineProperty(this, "heroNode", _descriptor23, this);

          _initializerDefineProperty(this, "unitType", _descriptor24, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor25, this);

          _initializerDefineProperty(this, "guardDistance", _descriptor26, this);

          _initializerDefineProperty(this, "health", _descriptor27, this);

          _initializerDefineProperty(this, "damage", _descriptor28, this);

          _initializerDefineProperty(this, "defense", _descriptor29, this);

          _initializerDefineProperty(this, "combatPointBountyValue", _descriptor30, this);
        }

      }, (_descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "name", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'hero';
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "heroNode", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "unitType", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "guardDistance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class5.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 500;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class5.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class5.prototype, "defense", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class5.prototype, "combatPointBountyValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class5)) || _class4));

      _export("BattleUnitDatabase", BattleUnitDatabase = (_dec11 = ccclass('BattleUnitDatabase'), _dec12 = property(Color), _dec13 = property(Color), _dec14 = property({
        type: Material,
        tooltip: 'Shared material for every troop wave banner. Assign UnlitBillboard with the icon sheet here to avoid one material per troop type.'
      }), _dec15 = property(HeroEntry), _dec16 = property(HeroEntry), _dec17 = property({
        type: [UnitPrefabEntry]
      }), _dec18 = property({
        type: [UnitPrefabEntry]
      }), _dec11(_class7 = (_class8 = class BattleUnitDatabase extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "enableCombatPoint", _descriptor31, this);

          _initializerDefineProperty(this, "teamAInitialCombatPoint", _descriptor32, this);

          _initializerDefineProperty(this, "teamBInitialCombatPoint", _descriptor33, this);

          _initializerDefineProperty(this, "killRewardCostWeight", _descriptor34, this);

          _initializerDefineProperty(this, "counterKillRewardCostWeight", _descriptor35, this);

          _initializerDefineProperty(this, "teamAWaveBannerBackgroundColor", _descriptor36, this);

          _initializerDefineProperty(this, "teamBWaveBannerBackgroundColor", _descriptor37, this);

          _initializerDefineProperty(this, "waveBannerMaterial", _descriptor38, this);

          _initializerDefineProperty(this, "teamAHero", _descriptor39, this);

          _initializerDefineProperty(this, "teamBHero", _descriptor40, this);

          _initializerDefineProperty(this, "teamAUnits", _descriptor41, this);

          _initializerDefineProperty(this, "teamBUnits", _descriptor42, this);
        }

        getTeamEntries(team) {
          return team === 0 ? this.teamAUnits : this.teamBUnits;
        }

        isEntryUnlocked(entry) {
          return !!entry && entry.unlocked;
        }

        getHeroEntry(team) {
          return team === 0 ? this.teamAHero : this.teamBHero;
        }

        getInitialCombatPoint(team) {
          return team === 0 ? this.teamAInitialCombatPoint : this.teamBInitialCombatPoint;
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

        calculateKillRewardFromBounty(bountyValue, isCounterKill) {
          const baseValue = Math.max(0, bountyValue);
          let reward = baseValue * Math.max(0, this.killRewardCostWeight);

          if (isCounterKill) {
            reward += baseValue * Math.max(0, this.counterKillRewardCostWeight);
          }

          return reward;
        }

      }, (_descriptor31 = _applyDecoratedDescriptor(_class8.prototype, "enableCombatPoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class8.prototype, "teamAInitialCombatPoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class8.prototype, "teamBInitialCombatPoint", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 100;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class8.prototype, "killRewardCostWeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.0;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class8.prototype, "counterKillRewardCostWeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.15;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class8.prototype, "teamAWaveBannerBackgroundColor", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Color(0, 70, 255, 255);
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class8.prototype, "teamBWaveBannerBackgroundColor", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Color(255, 0, 0, 255);
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class8.prototype, "waveBannerMaterial", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class8.prototype, "teamAHero", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new HeroEntry();
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class8.prototype, "teamBHero", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new HeroEntry();
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class8.prototype, "teamAUnits", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class8.prototype, "teamBUnits", [_dec18], {
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