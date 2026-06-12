System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Sprite, UITransform, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, BattleInformationIconItem;

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
      Sprite = _cc.Sprite;
      UITransform = _cc.UITransform;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d01acjn/KdAIq/gFKEj3q4u", "BattleInformationIconItem", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'Sprite', 'SpriteFrame', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BattleInformationIconItem", BattleInformationIconItem = (_dec = ccclass('BattleInformationIconItem'), _dec2 = property(Sprite), _dec3 = property(Color), _dec4 = property(Color), _dec(_class = (_class2 = class BattleInformationIconItem extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "iconSprite", _descriptor, this);

          _initializerDefineProperty(this, "iconWidth", _descriptor2, this);

          _initializerDefineProperty(this, "iconHeight", _descriptor3, this);

          _initializerDefineProperty(this, "minVisibleHeightRatio", _descriptor4, this);

          _initializerDefineProperty(this, "flashEnabled", _descriptor5, this);

          _initializerDefineProperty(this, "flashSpeed", _descriptor6, this);

          _initializerDefineProperty(this, "normalColor", _descriptor7, this);

          _initializerDefineProperty(this, "engageFlashColor", _descriptor8, this);

          this.uiTransform = null;
          this.originalWidth = 40;
          this.originalHeight = 40;
          this.tempColor = new Color();
        }

        onLoad() {
          this.initComponents();
        }

        setup(spriteFrame, width, height, anchorY) {
          this.iconWidth = width;
          this.iconHeight = height;
          this.originalWidth = width;
          this.originalHeight = height;
          this.initComponents();

          if (this.iconSprite) {
            this.iconSprite.sizeMode = Sprite.SizeMode.CUSTOM;
            this.iconSprite.spriteFrame = spriteFrame;
            this.iconSprite.color = this.normalColor;
          }

          if (this.uiTransform) {
            this.uiTransform.setContentSize(this.originalWidth, this.originalHeight);
            this.uiTransform.setAnchorPoint(0.5, anchorY);
          }

          this.node.setScale(1, 1, 1);
          this.node.active = true;
        }

        setAliveRatio(ratio) {
          if (!this.uiTransform) {
            return;
          }

          var r = this.clamp01(ratio);

          if (r <= 0) {
            this.uiTransform.setContentSize(this.originalWidth, 0);
            return;
          }

          var visualRatio = Math.max(this.minVisibleHeightRatio, r);
          this.uiTransform.setContentSize(this.originalWidth, this.originalHeight * visualRatio);
        }

        updateEngageVisual(isEngaged, time) {
          if (!this.iconSprite) {
            return;
          }

          if (!this.flashEnabled || !isEngaged) {
            this.iconSprite.color = this.normalColor;
            return;
          }

          var t = (Math.sin(time * this.flashSpeed) + 1) * 0.5;
          this.iconSprite.color = this.lerpColor(this.normalColor, this.engageFlashColor, t);
        }

        resetVisual() {
          if (this.iconSprite) {
            this.iconSprite.color = this.normalColor;
            this.iconSprite.spriteFrame = null;
            this.iconSprite.sizeMode = Sprite.SizeMode.CUSTOM;
          }

          if (this.uiTransform) {
            this.uiTransform.setContentSize(this.originalWidth, this.originalHeight);
          }

          this.node.setScale(1, 1, 1);
        }

        initComponents() {
          if (!this.iconSprite) {
            this.iconSprite = this.getComponent(Sprite);
          }

          if (!this.iconSprite) {
            this.iconSprite = this.node.addComponent(Sprite);
          }

          this.iconSprite.sizeMode = Sprite.SizeMode.CUSTOM;
          this.uiTransform = this.getComponent(UITransform);

          if (!this.uiTransform) {
            this.uiTransform = this.node.addComponent(UITransform);
          }

          this.uiTransform.setContentSize(this.iconWidth, this.iconHeight);
        }

        lerpColor(a, b, t) {
          var c = this.tempColor;
          c.r = Math.round(a.r + (b.r - a.r) * t);
          c.g = Math.round(a.g + (b.g - a.g) * t);
          c.b = Math.round(a.b + (b.b - a.b) * t);
          c.a = Math.round(a.a + (b.a - a.a) * t);
          return c;
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
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "minVisibleHeightRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.05;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "flashEnabled", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "flashSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "normalColor", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 255, 255, 255);
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "engageFlashColor", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 60, 60, 255);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a503fae58d9dcc0733e2b4023c53db41a3e28b23.js.map