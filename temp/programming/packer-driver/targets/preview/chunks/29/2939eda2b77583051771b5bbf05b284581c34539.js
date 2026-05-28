System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, input, Input, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, TopDownCameraDrag;

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
      Vec3 = _cc.Vec3;
      input = _cc.input;
      Input = _cc.Input;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5bcc66+7gVGqIHNVMwg6Mww", "TopDownCameraDrag", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'input', 'Input', 'EventTouch']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TopDownCameraDrag", TopDownCameraDrag = (_dec = ccclass('TopDownCameraDrag'), _dec(_class = (_class2 = class TopDownCameraDrag extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "enableDragX", _descriptor, this);

          _initializerDefineProperty(this, "enableDragZ", _descriptor2, this);

          _initializerDefineProperty(this, "minX", _descriptor3, this);

          _initializerDefineProperty(this, "maxX", _descriptor4, this);

          _initializerDefineProperty(this, "minZ", _descriptor5, this);

          _initializerDefineProperty(this, "maxZ", _descriptor6, this);

          _initializerDefineProperty(this, "dragSensitivity", _descriptor7, this);

          _initializerDefineProperty(this, "smoothSpeed", _descriptor8, this);

          _initializerDefineProperty(this, "invertX", _descriptor9, this);

          _initializerDefineProperty(this, "invertZ", _descriptor10, this);

          this.targetPos = new Vec3();
          this.currentPos = new Vec3();
          this.isDragging = false;
        }

        onEnable() {
          this.node.getWorldPosition(this.targetPos);
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        onDisable() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        start() {
          this.node.getWorldPosition(this.targetPos);
        }

        onTouchStart(event) {
          this.isDragging = true;
          this.node.getWorldPosition(this.targetPos);
        }

        onTouchMove(event) {
          if (!this.isDragging) return;
          var delta = event.getDelta();
          var moveX = delta.x * this.dragSensitivity;
          var moveZ = delta.y * this.dragSensitivity;

          if (!this.invertX) {
            moveX = -moveX;
          }

          if (!this.invertZ) {
            moveZ = -moveZ;
          }

          if (this.enableDragX) {
            this.targetPos.x += moveX;
          }

          if (this.enableDragZ) {
            this.targetPos.z += moveZ;
          }

          this.targetPos.x = this.clamp(this.targetPos.x, this.minX, this.maxX);
          this.targetPos.z = this.clamp(this.targetPos.z, this.minZ, this.maxZ);
        }

        onTouchEnd(event) {
          this.isDragging = false;
        }

        update(deltaTime) {
          this.node.getWorldPosition(this.currentPos);
          var t = 1 - Math.exp(-this.smoothSpeed * deltaTime);
          var newX = this.currentPos.x + (this.targetPos.x - this.currentPos.x) * t;
          var newY = this.currentPos.y;
          var newZ = this.currentPos.z + (this.targetPos.z - this.currentPos.z) * t;
          this.currentPos.set(newX, newY, newZ);
          this.node.setWorldPosition(this.currentPos);
        }

        clamp(value, min, max) {
          return Math.max(min, Math.min(max, value));
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enableDragX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enableDragZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "minX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -20;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "maxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "minZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -20;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "dragSensitivity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.03;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "smoothSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 12;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "invertX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "invertZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2939eda2b77583051771b5bbf05b284581c34539.js.map