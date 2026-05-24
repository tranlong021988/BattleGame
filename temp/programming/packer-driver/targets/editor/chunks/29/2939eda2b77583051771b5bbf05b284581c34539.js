System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, input, Input, EventMouse, Vec3, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, TopDownCameraDrag;

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
      input = _cc.input;
      Input = _cc.Input;
      EventMouse = _cc.EventMouse;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5bcc66+7gVGqIHNVMwg6Mww", "TopDownCameraDrag", undefined);

      __checkObsolete__(['_decorator', 'Component', 'input', 'Input', 'EventTouch', 'EventMouse', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TopDownCameraDrag", TopDownCameraDrag = (_dec = ccclass('TopDownCameraDrag'), _dec(_class = (_class2 = class TopDownCameraDrag extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "enableTouch", _descriptor, this);

          _initializerDefineProperty(this, "enableMouse", _descriptor2, this);

          _initializerDefineProperty(this, "minZ", _descriptor3, this);

          _initializerDefineProperty(this, "maxZ", _descriptor4, this);

          _initializerDefineProperty(this, "dragSensitivity", _descriptor5, this);

          _initializerDefineProperty(this, "smoothSpeed", _descriptor6, this);

          _initializerDefineProperty(this, "invertDrag", _descriptor7, this);

          this.targetZ = 0;
          this.dragging = false;
          this.tempPos = new Vec3();
        }

        onEnable() {
          this.targetZ = this.node.worldPosition.z;
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
          input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }

        onDisable() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
          input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }

        onTouchStart(event) {
          if (!this.enableTouch) return;
          this.dragging = true;
        }

        onTouchMove(event) {
          if (!this.enableTouch) return;
          if (!this.dragging) return;
          const delta = event.getDelta();
          this.applyDragDelta(delta.y);
        }

        onTouchEnd(event) {
          if (!this.enableTouch) return;
          this.dragging = false;
        }

        onMouseDown(event) {
          if (!this.enableMouse) return;

          if (event.getButton() !== EventMouse.BUTTON_LEFT) {
            return;
          }

          this.dragging = true;
        }

        onMouseMove(event) {
          if (!this.enableMouse) return;
          if (!this.dragging) return;
          const delta = event.getDelta();
          this.applyDragDelta(delta.y);
        }

        onMouseUp(event) {
          if (!this.enableMouse) return;
          this.dragging = false;
        }

        applyDragDelta(deltaY) {
          const dir = this.invertDrag ? -1 : 1;
          this.targetZ += deltaY * this.dragSensitivity * dir;
          this.targetZ = this.clamp(this.targetZ, this.minZ, this.maxZ);
        }

        update(deltaTime) {
          const current = this.node.worldPosition;
          const t = 1 - Math.exp(-this.smoothSpeed * deltaTime);
          const newZ = current.z + (this.targetZ - current.z) * t;
          this.tempPos.set(current.x, current.y, newZ);
          this.node.setWorldPosition(this.tempPos);
        }

        setTargetZ(z) {
          this.targetZ = this.clamp(z, this.minZ, this.maxZ);
        }

        jumpToZ(z) {
          this.targetZ = this.clamp(z, this.minZ, this.maxZ);
          const current = this.node.worldPosition;
          this.tempPos.set(current.x, current.y, this.targetZ);
          this.node.setWorldPosition(this.tempPos);
        }

        clamp(v, min, max) {
          return Math.max(min, Math.min(max, v));
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enableTouch", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enableMouse", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "minZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -30;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "maxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "dragSensitivity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "smoothSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "invertDrag", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2939eda2b77583051771b5bbf05b284581c34539.js.map