System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, UnitFamily, HealthBar3D, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, UnitProps;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHealthBar3D(extras) {
    _reporterNs.report("HealthBar3D", "./HealthBar3D", _context.meta, extras);
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
    }, function (_unresolved_3) {
      HealthBar3D = _unresolved_3.HealthBar3D;
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
        type: _crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
          error: Error()
        }), UnitFamily) : UnitFamily
      }), _dec3 = property({
        min: 1,
        max: 3,
        step: 1,
        tooltip: 'Upgrade tier inside the same unit family. Counter rules use family; tier only changes stats/progression.'
      }), _dec4 = property({
        min: 0,
        tooltip: 'Area damage radius measured from the primary target body edge. 0 means single-target damage only.'
      }), _dec5 = property(_crd && HealthBar3D === void 0 ? (_reportPossibleCrUseOfHealthBar3D({
        error: Error()
      }), HealthBar3D) : HealthBar3D), _dec(_class = (_class2 = class UnitProps extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "family", _descriptor, this);

          _initializerDefineProperty(this, "tier", _descriptor2, this);

          _initializerDefineProperty(this, "maxHealth", _descriptor3, this);

          _initializerDefineProperty(this, "damage", _descriptor4, this);

          _initializerDefineProperty(this, "damageRadius", _descriptor5, this);

          _initializerDefineProperty(this, "defense", _descriptor6, this);

          _initializerDefineProperty(this, "healthBar", _descriptor7, this);

          this.health = 30;
        }

        resetForSpawn() {
          this.health = this.maxHealth;
          this.updateHealthBar();
          this.refreshHealthBarVisibility(false);
        }

        resetForDespawn() {
          this.refreshHealthBarVisibility(false);
        }

        takeDamage(amount) {
          this.health -= amount;

          if (this.health < 0) {
            this.health = 0;
          }

          this.updateHealthBar();
        }

        heal(amount) {
          this.health += amount;

          if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
          }

          this.updateHealthBar();
        }

        isDead() {
          return this.health <= 0;
        }

        getHealthRatio() {
          if (this.maxHealth <= 0) {
            return 0;
          }

          return this.health / this.maxHealth;
        }

        updateHealthBar() {
          if (!this.healthBar) return;
          this.healthBar.setHealthRatio(this.getHealthRatio());
        }

        refreshHealthBarVisibility(showUnitHealthBars) {
          if (!this.healthBar) return;
          this.healthBar.setDisplayActive(showUnitHealthBars && !this.isDead() && this.getHealthRatio() < 0.999);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "family", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tier", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "maxHealth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "damageRadius", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "defense", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "healthBar", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=da1dea4a52a9f65f14720115124da1747f7813fd.js.map