System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, MeshRenderer, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, BillboardTint3D;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      MeshRenderer = _cc.MeshRenderer;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f4363IEayJPxqSDhgGOzmWu", "BillboardTint3D", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'MeshRenderer']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BillboardTint3D", BillboardTint3D = (_dec = ccclass('BillboardTint3D'), _dec2 = property({
        tooltip: 'Per-object billboard tint sent as an instanced attribute. This avoids creating unique material instances.'
      }), _dec3 = property({
        tooltip: 'Per-object background color sent as an instanced attribute. Transparent texture pixels are composited over this color.'
      }), _dec(_class = (_class2 = class BillboardTint3D extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "tint", _descriptor, this);

          _initializerDefineProperty(this, "backgroundColor", _descriptor2, this);

          this.renderer = null;
          this.tintParams = [1, 1, 1, 1];
          this.backgroundParams = [0, 0, 0, 0];
        }

        onLoad() {
          this.renderer = this.getComponent(MeshRenderer);
          this.applyTint();
        }

        onEnable() {
          this.renderer = this.getComponent(MeshRenderer);
          this.applyTint();
        }

        setTint(color) {
          this.tint.set(color);
          this.applyTint();
        }

        setBackgroundColor(color) {
          this.backgroundColor.set(color);
          this.applyBackgroundColor();
        }

        applyTint() {
          if (!this.renderer) return;
          this.tintParams[0] = this.tint.r / 255;
          this.tintParams[1] = this.tint.g / 255;
          this.tintParams[2] = this.tint.b / 255;
          this.tintParams[3] = this.tint.a / 255;
          this.renderer.setInstancedAttribute('a_billboard_tint', this.tintParams);
          this.applyBackgroundColor();
        }

        applyBackgroundColor() {
          if (!this.renderer) return;
          this.backgroundParams[0] = this.backgroundColor.r / 255;
          this.backgroundParams[1] = this.backgroundColor.g / 255;
          this.backgroundParams[2] = this.backgroundColor.b / 255;
          this.backgroundParams[3] = this.backgroundColor.a / 255;
          this.renderer.setInstancedAttribute('a_billboard_bg_color', this.backgroundParams);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tint", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 255, 255, 255);
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "backgroundColor", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(0, 0, 0, 0);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f6e2463ba0995bc72e63e18b14f8f3ef21ec3782.js.map