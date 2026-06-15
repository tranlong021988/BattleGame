System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Unit, UnitProps, GameManager, CounterSettings, _dec, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, UnitBehavior;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitProps(extras) {
    _reporterNs.report("UnitProps", "./UnitProps", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCounterSettings(extras) {
    _reporterNs.report("CounterSettings", "./CounterSettings", _context.meta, extras);
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
      Unit = _unresolved_2.Unit;
    }, function (_unresolved_3) {
      UnitProps = _unresolved_3.UnitProps;
    }, function (_unresolved_4) {
      GameManager = _unresolved_4.GameManager;
    }, function (_unresolved_5) {
      CounterSettings = _unresolved_5.CounterSettings;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "447a2LC9oVLFLwtjUuBODgj", "UnitBehavior", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitBehavior", UnitBehavior = (_dec = ccclass('UnitBehavior'), _dec(_class = (_class2 = class UnitBehavior extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "attackIntervalMin", _descriptor, this);

          _initializerDefineProperty(this, "attackIntervalMax", _descriptor2, this);

          this.gameManager = null;
          this.unit = void 0;
          this.props = void 0;
          this.attackTimer = 0;
          this.nextAttackInterval = 1;
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
          this.attackTimer = 0;
          this.randomizeNextAttackInterval();
        }

        resetForDespawn() {
          this.attackTimer = 0;
        }

        update(deltaTime) {
          if (!this.unit || !this.props) return;
          if (!this.node.activeInHierarchy) return;
          if (this.props.isDead()) return;
          if (!this.unit.onBusy) return;
          if (!this.unit.enemy) return;
          if (!this.unit.enemy.node.activeInHierarchy) return;
          if (!this.unit.enemy.props) return;
          if (this.unit.enemy.props.isDead()) return;
          this.attackTimer += deltaTime;

          if (this.attackTimer < this.nextAttackInterval) {
            return;
          }

          this.attackTimer = 0;
          this.randomizeNextAttackInterval();
          this.dealDamageToEnemy();
        }

        dealDamageToEnemy() {
          var enemy = this.unit.enemy;
          if (!enemy || !enemy.props) return;
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          var finalDamage = this.props.damage;

          if (counter) {
            finalDamage = counter.calculateDamage(this.props, enemy.props);
          } else {
            finalDamage = Math.max(1, this.props.damage - enemy.props.defense);
          }

          enemy.props.takeDamage(finalDamage);

          if (enemy.props.isDead()) {
            var gm = this.gameManager || (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;

            if (gm) {
              gm.reportKill(this.unit, enemy);
              gm.onUnitKilled(this.unit, enemy);
              gm.despawnUnit(enemy);
            }

            this.unit.clearEnemy();
          }
        }

        randomizeNextAttackInterval() {
          var min = Math.max(0.05, this.attackIntervalMin);
          var max = Math.max(min, this.attackIntervalMax);
          this.nextAttackInterval = min + Math.random() * (max - min);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "attackIntervalMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "attackIntervalMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=efeee09cd6cdfb0ceeaee3853a7ab8e02e196e1e.js.map