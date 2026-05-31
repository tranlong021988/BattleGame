System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Camera, Vec3, input, Input, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _crd, ccclass, property, TopDownCameraDrag;

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
      Camera = _cc.Camera;
      Vec3 = _cc.Vec3;
      input = _cc.input;
      Input = _cc.Input;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5bcc66+7gVGqIHNVMwg6Mww", "TopDownCameraDrag", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Camera', 'Vec3', 'input', 'Input', 'EventTouch']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TopDownCameraDrag", TopDownCameraDrag = (_dec = ccclass('TopDownCameraDrag'), _dec2 = property(Camera), _dec(_class = (_class2 = class TopDownCameraDrag extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "targetCamera", _descriptor, this);

          _initializerDefineProperty(this, "enableDragX", _descriptor2, this);

          _initializerDefineProperty(this, "enableDragZ", _descriptor3, this);

          _initializerDefineProperty(this, "minX", _descriptor4, this);

          _initializerDefineProperty(this, "maxX", _descriptor5, this);

          _initializerDefineProperty(this, "minZ", _descriptor6, this);

          _initializerDefineProperty(this, "maxZ", _descriptor7, this);

          _initializerDefineProperty(this, "dragSensitivity", _descriptor8, this);

          _initializerDefineProperty(this, "smoothSpeed", _descriptor9, this);

          _initializerDefineProperty(this, "invertX", _descriptor10, this);

          _initializerDefineProperty(this, "invertZ", _descriptor11, this);

          _initializerDefineProperty(this, "enablePinchZoom", _descriptor12, this);

          _initializerDefineProperty(this, "minFov", _descriptor13, this);

          _initializerDefineProperty(this, "maxFov", _descriptor14, this);

          _initializerDefineProperty(this, "pinchSensitivity", _descriptor15, this);

          _initializerDefineProperty(this, "zoomSmoothSpeed", _descriptor16, this);

          this.targetPos = new Vec3();
          this.currentPos = new Vec3();
          this.isDragging = false;
          this.isPinching = false;
          this.lastPinchDistance = 0;
          this.targetFov = 45;
        }

        onEnable() {
          this.node.getWorldPosition(this.targetPos);

          if (this.targetCamera) {
            this.targetFov = this.targetCamera.fov;
          }

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

          if (this.targetCamera) {
            this.targetFov = this.targetCamera.fov;
          }
        }

        onTouchStart(event) {
          var touches = event.getAllTouches();

          if (touches.length >= 2) {
            this.isDragging = false;
            this.isPinching = true;
            this.lastPinchDistance = this.getTouchDistance(touches);
            return;
          }

          this.isDragging = true;
          this.isPinching = false;
          this.node.getWorldPosition(this.targetPos);
        }

        onTouchMove(event) {
          var touches = event.getAllTouches();

          if (this.enablePinchZoom && this.targetCamera && touches.length >= 2) {
            this.handlePinchZoom(touches);
            return;
          }

          if (touches.length === 1) {
            if (this.isPinching) {
              this.isPinching = false;
              this.isDragging = true;
              this.node.getWorldPosition(this.targetPos);
              return;
            }

            this.handleDrag(event);
          }
        }

        onTouchEnd(event) {
          var touches = event.getAllTouches();

          if (touches.length >= 2) {
            this.isPinching = true;
            this.isDragging = false;
            this.lastPinchDistance = this.getTouchDistance(touches);
            return;
          }

          if (touches.length === 1) {
            this.isPinching = false;
            this.isDragging = true;
            this.node.getWorldPosition(this.targetPos);
            return;
          }

          this.isDragging = false;
          this.isPinching = false;
          this.lastPinchDistance = 0;
        }

        handleDrag(event) {
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

        handlePinchZoom(touches) {
          if (!this.targetCamera) return;
          var dist = this.getTouchDistance(touches);

          if (this.lastPinchDistance <= 0) {
            this.lastPinchDistance = dist;
            return;
          }

          var delta = dist - this.lastPinchDistance; // Hai ngón tách xa nhau => zoom in => FOV nhỏ lại

          this.targetFov -= delta * this.pinchSensitivity;
          this.targetFov = this.clamp(this.targetFov, this.minFov, this.maxFov);
          this.lastPinchDistance = dist;
        }

        update(deltaTime) {
          this.updatePosition(deltaTime);
          this.updateZoom(deltaTime);
        }

        updatePosition(deltaTime) {
          this.node.getWorldPosition(this.currentPos);
          var t = 1 - Math.exp(-this.smoothSpeed * deltaTime);
          var newX = this.currentPos.x + (this.targetPos.x - this.currentPos.x) * t;
          var newY = this.currentPos.y;
          var newZ = this.currentPos.z + (this.targetPos.z - this.currentPos.z) * t;
          this.currentPos.set(newX, newY, newZ);
          this.node.setWorldPosition(this.currentPos);
        }

        updateZoom(deltaTime) {
          if (!this.targetCamera) return;
          var t = 1 - Math.exp(-this.zoomSmoothSpeed * deltaTime);
          this.targetCamera.fov = this.targetCamera.fov + (this.targetFov - this.targetCamera.fov) * t;
        }

        getTouchDistance(touches) {
          if (touches.length < 2) return 0;
          var p0 = touches[0].getLocation();
          var p1 = touches[1].getLocation();
          var dx = p1.x - p0.x;
          var dy = p1.y - p0.y;
          return Math.sqrt(dx * dx + dy * dy);
        }

        clamp(value, min, max) {
          return Math.max(min, Math.min(max, value));
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "targetCamera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "enableDragX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "enableDragZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "minX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -20;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "minZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -20;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "maxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "dragSensitivity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.03;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "smoothSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 12;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "invertX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "invertZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "enablePinchZoom", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "minFov", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 25;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "maxFov", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 60;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "pinchSensitivity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.08;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "zoomSmoothSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 12;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2939eda2b77583051771b5bbf05b284581c34539.js.map