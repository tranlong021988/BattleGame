System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, MeshRenderer, Color, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, HealthBar3D;

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
      Color = _cc.Color;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6c024qnoilB/YpMUe4hE+WU", "HealthBar3D", undefined);

      __checkObsolete__(['_decorator', 'Component', 'MeshRenderer', 'Color']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HealthBar3D", HealthBar3D = (_dec = ccclass('HealthBar3D'), _dec2 = property(Color), _dec(_class = (_class2 = class HealthBar3D extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "hideWhenFull", _descriptor, this);

          _initializerDefineProperty(this, "mainColor", _descriptor2, this);

          this.renderer = null;
          this.currentRatio = 1;
        }

        onLoad() {
          this.renderer = this.getComponent(MeshRenderer);
          this.applyAll();
        }

        onEnable() {
          this.renderer = this.getComponent(MeshRenderer);
          this.applyAll();
        }

        setHealthRatio(ratio) {
          this.currentRatio = Math.max(0, Math.min(1, ratio));
          this.applyAll();
        }

        setMainColor(color) {
          this.mainColor.set(color);
          this.applyAll();
        }

        getHealthRatio() {
          return this.currentRatio;
        }

        applyAll() {
          if (!this.renderer) return;
          var shouldShow = !this.hideWhenFull || this.currentRatio < 0.999;
          this.renderer.enabled = shouldShow;
          this.renderer.setInstancedAttribute('a_health_params', [this.currentRatio, shouldShow ? 1 : 0, 0, 0]);
          this.renderer.setInstancedAttribute('a_bar_color', [this.mainColor.r / 255, this.mainColor.g / 255, this.mainColor.b / 255, 1]);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "hideWhenFull", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "mainColor", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(0, 255, 40, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=33aae120a5c53c84492eff747b653a1cd746cc7d.js.map