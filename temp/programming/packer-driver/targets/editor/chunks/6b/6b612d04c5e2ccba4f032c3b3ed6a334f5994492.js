System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, UnitFamily, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _dec5, _dec6, _class4, _class5, _descriptor5, _descriptor6, _class6, _crd, ccclass, property, CounterRule, CounterSettings;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitProps(extras) {
    _reporterNs.report("UnitProps", "./UnitProps", _context.meta, extras);
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
      UnitFamily = _unresolved_2.UnitFamily;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "05b5forP0RIQo50J2zS8yBi", "CounterSettings", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CounterRule", CounterRule = (_dec = ccclass('CounterRule'), _dec2 = property({
        type: _crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
          error: Error()
        }), UnitFamily) : UnitFamily
      }), _dec3 = property({
        type: _crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
          error: Error()
        }), UnitFamily) : UnitFamily
      }), _dec4 = property({
        min: 0,
        tooltip: 'Damage multiplier for attacker family against defender family. Tier is ignored here; tier changes stats instead.'
      }), _dec(_class = (_class2 = class CounterRule {
        constructor() {
          _initializerDefineProperty(this, "attackerFamily", _descriptor, this);

          _initializerDefineProperty(this, "defenderFamily", _descriptor2, this);

          _initializerDefineProperty(this, "damageMultiplier", _descriptor3, this);

          _initializerDefineProperty(this, "note", _descriptor4, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "attackerFamily", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "defenderFamily", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "damageMultiplier", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "note", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      })), _class2)) || _class));

      _export("CounterSettings", CounterSettings = (_dec5 = ccclass('CounterSettings'), _dec6 = property({
        type: [CounterRule]
      }), _dec5(_class4 = (_class5 = (_class6 = class CounterSettings extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "autoCreateDefaultRules", _descriptor5, this);

          _initializerDefineProperty(this, "rules", _descriptor6, this);
        }

        onLoad() {
          CounterSettings.instance = this;

          if (this.autoCreateDefaultRules && this.rules.length <= 0) {
            this.createDefaultRules();
          }
        }

        onDestroy() {
          if (CounterSettings.instance === this) {
            CounterSettings.instance = null;
          }
        }

        getDamageMultiplier(attackerFamily, defenderFamily) {
          const rule = this.findRule(attackerFamily, defenderFamily);

          if (!rule) {
            return 1;
          }

          return Math.max(0, rule.damageMultiplier);
        }

        getCounterScore(attackerFamily, defenderFamily) {
          return this.getDamageMultiplier(attackerFamily, defenderFamily);
        }

        calculateDamage(attacker, defender) {
          const damageMul = this.getDamageMultiplier(attacker.family, defender.family);
          const baseDamage = Math.max(1, attacker.damage - defender.defense);
          return baseDamage * damageMul;
        }

        findRule(attackerFamily, defenderFamily) {
          for (let i = 0; i < this.rules.length; i++) {
            const r = this.rules[i];

            if (r.attackerFamily === attackerFamily && r.defenderFamily === defenderFamily) {
              return r;
            }
          }

          return null;
        }

        addRule(attacker, defender, damageMultiplier, note) {
          const rule = new CounterRule();
          rule.attackerFamily = attacker;
          rule.defenderFamily = defender;
          rule.damageMultiplier = damageMultiplier;
          rule.note = note;
          this.rules.push(rule);
        }

        createDefaultRules() {
          this.rules.length = 0;
          this.addRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry, 2.1, 'Hard counter: Spear punishes Cavalry.');
          this.addRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear, 1.45, 'Soft-hard counter: Archer punishes Spear to keep cheap Spear from becoming too cost-efficient.');
        }

      }, _class6.instance = null, _class6), (_descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "autoCreateDefaultRules", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "rules", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6b612d04c5e2ccba4f032c3b3ed6a334f5994492.js.map