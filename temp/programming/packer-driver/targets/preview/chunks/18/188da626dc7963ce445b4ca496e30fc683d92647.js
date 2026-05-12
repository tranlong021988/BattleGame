System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameManager, Unit, UnitProps, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, UnitBehavior;

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

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitBehavior", UnitBehavior = (_dec = ccclass('UnitBehavior'), _dec2 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec3 = property(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
        error: Error()
      }), UnitProps) : UnitProps), _dec4 = property(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
        error: Error()
      }), UnitProps) : UnitProps), _dec(_class = (_class2 = class UnitBehavior extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "gameManager", _descriptor, this);

          _initializerDefineProperty(this, "props", _descriptor2, this);

          _initializerDefineProperty(this, "enemyProps", _descriptor3, this);

          this.unit = void 0;
          this.strikeInterval = 0;
        }

        start() {
          this.unit = this.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);
          this.props = this.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);
        }

        update(deltaTime) {
          if (this.unit.onBusy) {
            this.strikeInterval++;

            if (this.strikeInterval > 10) {
              this.strikeInterval = 0;

              if (this.enemyProps == null) {
                this.enemyProps = this.unit.enemy.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
                  error: Error()
                }), UnitProps) : UnitProps);
              }

              this.enemyProps.health -= 10;
            }
          } else {
            this.strikeInterval = 0;

            if (this.enemyProps != null) {
              this.enemyProps = null;
            }
          }

          if (this.props.health <= 0) {
            this.strikeInterval = 0;
            this.enemyProps = null;
            this.gameManager.despawnUnit(this.unit);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "props", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "enemyProps", [_dec4], {
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
//# sourceMappingURL=188da626dc7963ce445b4ca496e30fc683d92647.js.map