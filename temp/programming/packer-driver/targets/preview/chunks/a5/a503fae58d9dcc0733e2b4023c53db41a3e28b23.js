System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, UIOpacity, UITransform, Vec3, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, BattleInformationIconItem;

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
      Sprite = _cc.Sprite;
      UIOpacity = _cc.UIOpacity;
      UITransform = _cc.UITransform;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d01acjn/KdAIq/gFKEj3q4u", "BattleInformationIconItem", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'SpriteFrame', 'UIOpacity', 'UITransform', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BattleInformationIconItem", BattleInformationIconItem = (_dec = ccclass('BattleInformationIconItem'), _dec2 = property(Sprite), _dec(_class = (_class2 = class BattleInformationIconItem extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "iconSprite", _descriptor, this);

          _initializerDefineProperty(this, "iconWidth", _descriptor2, this);

          _initializerDefineProperty(this, "iconHeight", _descriptor3, this);

          _initializerDefineProperty(this, "minVisibleScaleY", _descriptor4, this);

          _initializerDefineProperty(this, "blinkEnabled", _descriptor5, this);

          _initializerDefineProperty(this, "blinkSpeed", _descriptor6, this);

          _initializerDefineProperty(this, "blinkMinOpacity", _descriptor7, this);

          _initializerDefineProperty(this, "blinkMaxOpacity", _descriptor8, this);

          this.opacity = null;
          this.baseScale = new Vec3(1, 1, 1);
        }

        onLoad() {
          this.initComponents();
        }

        setup(spriteFrame, width, height) {
          this.iconWidth = width;
          this.iconHeight = height;
          this.initComponents();
          var ui = this.getComponent(UITransform);

          if (ui) {
            ui.setContentSize(this.iconWidth, this.iconHeight);
            ui.setAnchorPoint(0.5, 0.5);
          }

          if (this.iconSprite) {
            this.iconSprite.sizeMode = Sprite.SizeMode.CUSTOM;
            this.iconSprite.spriteFrame = spriteFrame;
            this.iconSprite.sizeMode = Sprite.SizeMode.CUSTOM;
          }

          if (ui) {
            ui.setContentSize(this.iconWidth, this.iconHeight);
          }

          if (this.opacity) {
            this.opacity.opacity = 255;
          }

          this.baseScale.set(1, 1, 1);
          this.node.setScale(this.baseScale);
        }

        setAliveRatio(ratio) {
          var r = this.clamp01(ratio);

          if (r <= 0) {
            this.node.setScale(this.baseScale.x, 0, this.baseScale.z);
            return;
          }

          var visualScaleY = Math.max(this.minVisibleScaleY, r);
          this.node.setScale(this.baseScale.x, this.baseScale.y * visualScaleY, this.baseScale.z);
        }

        updateEngageVisual(isEngaged, time) {
          if (!this.opacity) return;

          if (!this.blinkEnabled || !isEngaged) {
            this.opacity.opacity = 255;
            return;
          }

          var t = (Math.sin(time * this.blinkSpeed) + 1) * 0.5;
          this.opacity.opacity = this.blinkMinOpacity + (this.blinkMaxOpacity - this.blinkMinOpacity) * t;
        }

        resetVisual() {
          if (this.opacity) {
            this.opacity.opacity = 255;
          }

          this.node.setScale(this.baseScale);
        }

        initComponents() {
          if (!this.iconSprite) {
            this.iconSprite = this.getComponent(Sprite);
          }

          if (this.iconSprite) {
            this.iconSprite.sizeMode = Sprite.SizeMode.CUSTOM;
          }

          this.opacity = this.getComponent(UIOpacity);

          if (!this.opacity) {
            this.opacity = this.node.addComponent(UIOpacity);
          }

          var ui = this.getComponent(UITransform);

          if (ui) {
            ui.setContentSize(this.iconWidth, this.iconHeight);
            ui.setAnchorPoint(0.5, 0.5);
          }
        }

        clamp01(v) {
          return Math.max(0, Math.min(1, v));
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "iconSprite", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "iconWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 40;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "iconHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 40;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "minVisibleScaleY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.05;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "blinkEnabled", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "blinkSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "blinkMinOpacity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 100;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "blinkMaxOpacity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 255;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a503fae58d9dcc0733e2b4023c53db41a3e28b23.js.map