System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameManager, Unit, UnitProps, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, UnitBehavior;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
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
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      Unit = _unresolved_3.Unit;
    }, function (_unresolved_4) {
      UnitProps = _unresolved_4.UnitProps;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "447a2LC9oVLFLwtjUuBODgj", "UnitBehavior", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitBehavior", UnitBehavior = (_dec = ccclass('UnitBehavior'), _dec2 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec(_class = (_class2 = class UnitBehavior extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gameManager", _descriptor, this);

          _initializerDefineProperty(this, "attackInterval", _descriptor2, this);

          this.unit = void 0;
          this.props = void 0;
          this.attackTimer = 0;
          this.deadHandled = false;
        }

        onLoad() {
          this.unit = this.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);
          this.props = this.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);
        }

        resetForSpawn() {
          // Random attack phase để tránh phe update trước luôn thắng.
          this.attackTimer = Math.random() * this.attackInterval;
          this.deadHandled = false;
        }

        resetForDespawn() {
          this.attackTimer = 0;
          this.deadHandled = true;
        }

        update(deltaTime) {
          if (!this.node.activeInHierarchy) return;

          if (this.props.isDead()) {
            this.handleDeath();
            return;
          }

          if (!this.unit.onBusy) {
            return;
          }

          const enemy = this.unit.enemy;

          if (!enemy || !enemy.node.activeInHierarchy || !enemy.props) {
            this.unit.clearEnemy();
            this.attackTimer = 0;
            return;
          }

          if (enemy.props.isDead()) {
            this.unit.clearEnemy();
            this.attackTimer = 0;
            return;
          }

          this.attackTimer += deltaTime;

          if (this.attackTimer >= this.attackInterval) {
            this.attackTimer = 0;
            enemy.props.takeDamage(this.props.damage);
          }
        }

        handleDeath() {
          if (this.deadHandled) return;
          this.deadHandled = true;
          this.attackTimer = 0;
          this.unit.clearEnemy();

          if (this.gameManager) {
            this.gameManager.despawnUnit(this.unit);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "attackInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=efeee09cd6cdfb0ceeaee3853a7ab8e02e196e1e.js.map