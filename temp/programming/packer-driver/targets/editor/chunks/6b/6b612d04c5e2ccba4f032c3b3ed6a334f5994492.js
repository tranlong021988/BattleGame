System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, UnitType, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _dec4, _dec5, _class4, _class5, _descriptor6, _descriptor7, _class6, _crd, ccclass, property, CounterRule, CounterSettings;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnitType(extras) {
    _reporterNs.report("UnitType", "./BattleTypes", _context.meta, extras);
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
      UnitType = _unresolved_2.UnitType;
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
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec3 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec(_class = (_class2 = class CounterRule {
        constructor() {
          _initializerDefineProperty(this, "attackerType", _descriptor, this);

          _initializerDefineProperty(this, "defenderType", _descriptor2, this);

          _initializerDefineProperty(this, "damageMultiplier", _descriptor3, this);

          _initializerDefineProperty(this, "receivedDamageMultiplier", _descriptor4, this);

          _initializerDefineProperty(this, "note", _descriptor5, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "attackerType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "defenderType", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSpear;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "damageMultiplier", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "receivedDamageMultiplier", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "note", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      })), _class2)) || _class));

      _export("CounterSettings", CounterSettings = (_dec4 = ccclass('CounterSettings'), _dec5 = property({
        type: [CounterRule]
      }), _dec4(_class4 = (_class5 = (_class6 = class CounterSettings extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "autoCreateDefaultRules", _descriptor6, this);

          _initializerDefineProperty(this, "rules", _descriptor7, this);
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

        getDamageMultiplier(attackerType, defenderType) {
          const rule = this.findRule(attackerType, defenderType);

          if (!rule) {
            return 1;
          }

          return Math.max(0, rule.damageMultiplier);
        }

        getReceivedDamageMultiplier(attackerType, defenderType) {
          const rule = this.findRule(attackerType, defenderType);

          if (!rule) {
            return 1;
          }

          return Math.max(0.01, rule.receivedDamageMultiplier);
        }

        getCounterScore(attackerType, defenderType) {
          const damageMul = this.getDamageMultiplier(attackerType, defenderType);
          const receivedMul = this.getReceivedDamageMultiplier(attackerType, defenderType);
          return damageMul * receivedMul;
        }

        calculateDamage(attacker, defender) {
          const damageMul = this.getDamageMultiplier(attacker.unitType, defender.unitType);
          const receivedMul = this.getReceivedDamageMultiplier(attacker.unitType, defender.unitType);
          const rawDamage = attacker.damage * damageMul * receivedMul;
          const finalDamage = Math.max(1, rawDamage - defender.defense);
          return finalDamage;
        }

        findRule(attackerType, defenderType) {
          for (let i = 0; i < this.rules.length; i++) {
            const r = this.rules[i];

            if (r.attackerType === attackerType && r.defenderType === defenderType) {
              return r;
            }
          }

          return null;
        }

        addRule(attacker, defender, damageMultiplier, receivedDamageMultiplier, note) {
          const rule = new CounterRule();
          rule.attackerType = attacker;
          rule.defenderType = defender;
          rule.damageMultiplier = damageMultiplier;
          rule.receivedDamageMultiplier = receivedDamageMultiplier;
          rule.note = note;
          this.rules.push(rule);
        }

        createDefaultRules() {
          this.rules.length = 0; // =====================================================
          // SIMPLE LIGHT TEST LOOP
          // Dùng bộ này để test SmartArmyBrain dễ nhìn:
          //
          // LightSword   > LightSpear
          // LightSpear   > LightCavalry
          // LightCavalry > LightArcher
          // LightArcher  > LightMace
          // LightMace    > LightSword
          // LightMagic   > LightMace
          // LightSword   > LightMagic
          // =====================================================

          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSpear, 2.0, 1.0, 'Light Sword hard-counters Light Spear');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSpear, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightCavalry, 2.0, 1.0, 'Light Spear hard-counters Light Cavalry');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightCavalry, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightArcher, 2.0, 1.0, 'Light Cavalry hard-counters Light Archer');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightArcher, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMace, 2.0, 1.0, 'Light Archer hard-counters Light Mace');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMace, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword, 2.0, 1.0, 'Light Mace hard-counters Light Sword');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMagic, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMace, 2.0, 1.0, 'Light Magic hard-counters Light Mace');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMagic, 2.0, 1.0, 'Light Sword hard-counters Light Magic'); // =====================================================
          // OPTIONAL LIGHT SOFT COUNTERS
          // Có thể giữ để AI có lựa chọn phụ.
          // Nếu muốn test cực sạch, bạn có thể comment block này.
          // =====================================================

          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightArcher, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSpear, 1.5, 1.0, 'Light Archer soft-counters Light Spear');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightCavalry, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMagic, 1.5, 1.0, 'Light Cavalry soft-counters Light Magic');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSpear, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMace, 1.5, 1.0, 'Light Spear soft-counters Light Mace'); // =====================================================
          // HEAVY RULES
          // Giữ sẵn để sau này mở rộng 12 unit.
          // =====================================================

          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSpear, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyCavalry, 1.5, 1.0, 'Light Spear soft-counters Heavy Cavalry');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySpear, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyCavalry, 2.0, 1.0, 'Heavy Spear hard-counters Heavy Cavalry');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySpear, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightCavalry, 1.5, 1.0, 'Heavy Spear soft-counters Light Cavalry');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySpear, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, 1.5, 1.0, 'Heavy Spear soft-counters Heavy Sword');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword, 2.0, 1.0, 'Heavy Sword hard-counters Light Sword');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSpear, 2.0, 1.0, 'Heavy Sword hard-counters Light Spear');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMace, 2.0, 1.0, 'Heavy Sword hard-counters Light Mace');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightArcher, 2.0, 1.0, 'Heavy Sword hard-counters Light Archer');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMagic, 1.5, 1.0, 'Heavy Sword soft-counters Light Magic');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMace, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, 2.0, 1.0, 'Light Mace hard-counters Heavy Sword');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMace, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySpear, 1.5, 1.0, 'Light Mace soft-counters Heavy Spear');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyMace, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, 2.0, 1.0, 'Heavy Mace hard-counters Heavy Sword');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyMace, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySpear, 2.0, 1.0, 'Heavy Mace hard-counters Heavy Spear');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyMace, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyCavalry, 1.5, 1.0, 'Heavy Mace soft-counters Heavy Cavalry');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyArcher, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, 2.0, 1.0, 'Heavy Archer hard-counters Heavy Sword');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyArcher, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySpear, 2.0, 1.0, 'Heavy Archer hard-counters Heavy Spear');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyArcher, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyCavalry, 1.5, 1.0, 'Heavy Archer soft-counters Heavy Cavalry');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightCavalry, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyArcher, 2.0, 1.0, 'Light Cavalry hard-counters Heavy Archer');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightCavalry, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyMagic, 1.5, 1.0, 'Light Cavalry soft-counters Heavy Magic');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyCavalry, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword, 2.0, 1.0, 'Heavy Cavalry hard-counters Light Sword');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyCavalry, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightArcher, 2.0, 1.0, 'Heavy Cavalry hard-counters Light Archer');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyCavalry, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightCavalry, 1.5, 1.0, 'Heavy Cavalry soft-counters Light Cavalry');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyCavalry, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, 1.5, 1.0, 'Heavy Cavalry soft-counters Heavy Sword');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMagic, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword, 1.5, 1.0, 'Light Magic soft-counters Light Sword');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightMagic, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSpear, 1.5, 1.0, 'Light Magic soft-counters Light Spear');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyMagic, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, 2.0, 1.0, 'Heavy Magic hard-counters Heavy Sword');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyMagic, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySpear, 2.0, 1.0, 'Heavy Magic hard-counters Heavy Spear');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyMagic, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyMace, 2.0, 1.0, 'Heavy Magic hard-counters Heavy Mace');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyMagic, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyCavalry, 1.5, 1.0, 'Heavy Magic soft-counters Heavy Cavalry'); // =====================================================
          // DEFENSIVE RULE EXAMPLES
          // =====================================================

          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightCavalry, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySpear, 1.0, 0.5, 'Heavy Spear receives 50% damage from Light Cavalry');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavyCavalry, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySpear, 1.0, 0.5, 'Heavy Spear receives 50% damage from Heavy Cavalry');
          this.addRule((_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightArcher, (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).HeavySword, 1.0, 0.75, 'Heavy Sword receives 75% damage from Light Archer');
        }

      }, _class6.instance = null, _class6), (_descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "autoCreateDefaultRules", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "rules", [_dec5], {
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