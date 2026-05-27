System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, UnitType, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, UnitProps;

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
    }, function (_unresolved_2) {
      UnitType = _unresolved_2.UnitType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c9271TusC9EpKwLJeUpSKGf", "UnitProps", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitProps", UnitProps = (_dec = ccclass('UnitProps'), _dec2 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec(_class = (_class2 = class UnitProps extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "unitType", _descriptor, this);

          _initializerDefineProperty(this, "maxHealth", _descriptor2, this);

          _initializerDefineProperty(this, "damage", _descriptor3, this);

          _initializerDefineProperty(this, "defense", _descriptor4, this);

          this.health = 30;
        }

        resetForSpawn() {
          this.health = this.maxHealth;
        }

        takeDamage(amount) {
          this.health -= amount;

          if (this.health < 0) {
            this.health = 0;
          }
        }

        isDead() {
          return this.health <= 0;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "unitType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "maxHealth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "defense", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3ec83085277e955f3413521ae624675c55f0fa18.js.map