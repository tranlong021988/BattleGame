System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, MeshRenderer, _dec, _class, _class2, _descriptor, _crd, ccclass, property, HealthBar3D;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      MeshRenderer = _cc.MeshRenderer;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6c024qnoilB/YpMUe4hE+WU", "HealthBar3D", undefined);

      __checkObsolete__(['_decorator', 'Component', 'MeshRenderer']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HealthBar3D", HealthBar3D = (_dec = ccclass('HealthBar3D'), _dec(_class = (_class2 = class HealthBar3D extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "hideWhenFull", _descriptor, this);

          this.renderer = null;
          this.currentRatio = 1;
        }

        onLoad() {
          this.renderer = this.getComponent(MeshRenderer);
          this.setHealthRatio(1);
        }

        setHealthRatio(ratio) {
          this.currentRatio = Math.max(0, Math.min(1, ratio));

          if (this.hideWhenFull) {
            this.node.active = this.currentRatio < 0.999;
          }

          if (!this.renderer) return;
          this.renderer.setInstancedAttribute('a_health_params', [this.currentRatio, 0, 0, 0]);
        }

        getHealthRatio() {
          return this.currentRatio;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "hideWhenFull", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=33aae120a5c53c84492eff747b653a1cd746cc7d.js.map