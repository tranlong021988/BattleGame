System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Camera, Vec3, input, Input, view, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _crd, ccclass, property, TopDownZoomRangeChangedEvent, TopDownCameraDrag;

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
      view = _cc.view;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5bcc66+7gVGqIHNVMwg6Mww", "TopDownCameraDrag", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Camera', 'Vec3', 'input', 'Input', 'EventTouch', 'EventMouse', 'view']);

      ({
        ccclass,
        property
      } = _decorator);
      TopDownZoomRangeChangedEvent = 'battle-camera-topdown-zoom-range-changed';

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

          _initializerDefineProperty(this, "expandBoundsWhenZoomIn", _descriptor8, this);

          _initializerDefineProperty(this, "maxBoundsExpandMultiplier", _descriptor9, this);

          _initializerDefineProperty(this, "dragSensitivity", _descriptor10, this);

          _initializerDefineProperty(this, "smoothSpeed", _descriptor11, this);

          _initializerDefineProperty(this, "dragFollowSpeed", _descriptor12, this);

          _initializerDefineProperty(this, "invertX", _descriptor13, this);

          _initializerDefineProperty(this, "invertZ", _descriptor14, this);

          _initializerDefineProperty(this, "enablePinchZoom", _descriptor15, this);

          _initializerDefineProperty(this, "enableMouseWheelZoom", _descriptor16, this);

          _initializerDefineProperty(this, "minFov", _descriptor17, this);

          _initializerDefineProperty(this, "maxFov", _descriptor18, this);

          _initializerDefineProperty(this, "pinchSensitivity", _descriptor19, this);

          _initializerDefineProperty(this, "mouseWheelSensitivity", _descriptor20, this);

          _initializerDefineProperty(this, "zoomSmoothSpeed", _descriptor21, this);

          _initializerDefineProperty(this, "zoomToPointer", _descriptor22, this);

          _initializerDefineProperty(this, "zoomPointerMoveStrength", _descriptor23, this);

          _initializerDefineProperty(this, "invertZoomPointerX", _descriptor24, this);

          _initializerDefineProperty(this, "invertZoomPointerZ", _descriptor25, this);

          this.targetPos = new Vec3();
          this.currentPos = new Vec3();
          this.isDragging = false;
          this.isPinching = false;
          this.lastPinchDistance = 0;
          this.targetFov = 45;
          this.zoomRangeState = 0;
        }

        onEnable() {
          this.node.getWorldPosition(this.targetPos);

          if (this.targetCamera) {
            this.targetFov = this.targetCamera.fov;
          }

          this.zoomRangeState = this.resolveZoomRangeState();
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        }

        onDisable() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        }

        start() {
          this.node.getWorldPosition(this.targetPos);

          if (this.targetCamera) {
            this.targetFov = this.targetCamera.fov;
          }

          this.zoomRangeState = this.resolveZoomRangeState();
        }

        getTargetFov() {
          return this.targetFov;
        }

        getMinFov() {
          return this.minFov;
        }

        getMaxFov() {
          return this.maxFov;
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

        onMouseWheel(event) {
          if (!this.enableMouseWheelZoom) return;
          if (!this.targetCamera) return;
          var scrollY = event.getScrollY();
          if (Math.abs(scrollY) < 0.0001) return;
          var p = event.getLocation();
          this.zoomAtScreenPoint(p.x, p.y, scrollY * this.mouseWheelSensitivity);
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

          this.clampTargetPosition();
        }

        handlePinchZoom(touches) {
          if (!this.targetCamera) return;
          var dist = this.getTouchDistance(touches);

          if (this.lastPinchDistance <= 0) {
            this.lastPinchDistance = dist;
            return;
          }

          var delta = dist - this.lastPinchDistance;
          var center = this.getTouchCenter(touches);
          this.zoomAtScreenPoint(center.x, center.y, delta * this.pinchSensitivity);
          this.lastPinchDistance = dist;
        }

        zoomAtScreenPoint(screenX, screenY, zoomDelta) {
          if (!this.targetCamera) return;
          var oldFov = this.targetFov; // Pinch out / wheel up => zoom in => FOV nhỏ lại.

          this.targetFov -= zoomDelta;
          this.targetFov = this.clamp(this.targetFov, this.minFov, this.maxFov);
          this.emitZoomRangeChangedIfNeeded();
          var fovChange = oldFov - this.targetFov;

          if (this.zoomToPointer && Math.abs(fovChange) > 0.0001) {
            this.applyZoomPointerBias(screenX, screenY, fovChange);
          }

          this.clampTargetPosition();
        }

        applyZoomPointerBias(screenX, screenY, fovChange) {
          var size = view.getVisibleSize();

          if (size.width <= 0 || size.height <= 0) {
            return;
          }

          var normalizedX = (screenX / size.width - 0.5) * 2;
          var normalizedY = (screenY / size.height - 0.5) * 2;
          var fovRange = Math.max(0.0001, this.maxFov - this.minFov);
          var zoomAmount = fovChange / fovRange;
          var moveX = normalizedX * zoomAmount * this.zoomPointerMoveStrength;
          var moveZ = normalizedY * zoomAmount * this.zoomPointerMoveStrength;

          if (this.invertZoomPointerX) {
            moveX = -moveX;
          }

          if (this.invertZoomPointerZ) {
            moveZ = -moveZ;
          }

          if (this.enableDragX) {
            this.targetPos.x += moveX;
          }

          if (this.enableDragZ) {
            this.targetPos.z += moveZ;
          }
        }

        update(deltaTime) {
          this.updatePosition(deltaTime);
          this.updateZoom(deltaTime);
        }

        updatePosition(deltaTime) {
          this.node.getWorldPosition(this.currentPos);
          this.clampTargetPosition();
          var followSpeed = this.isDragging && !this.isPinching ? this.dragFollowSpeed : this.smoothSpeed;

          if (followSpeed <= 0) {
            this.currentPos.set(this.enableDragX ? this.targetPos.x : this.currentPos.x, this.currentPos.y, this.enableDragZ ? this.targetPos.z : this.currentPos.z);
            this.node.setWorldPosition(this.currentPos);
            return;
          }

          var t = 1 - Math.exp(-followSpeed * deltaTime);
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

        clampTargetPosition() {
          var bounds = this.getDynamicBounds();
          this.targetPos.x = this.clamp(this.targetPos.x, bounds.minX, bounds.maxX);
          this.targetPos.z = this.clamp(this.targetPos.z, bounds.minZ, bounds.maxZ);
        }

        getDynamicBounds() {
          if (!this.expandBoundsWhenZoomIn || !this.targetCamera || this.maxFov <= this.minFov) {
            return {
              minX: this.minX,
              maxX: this.maxX,
              minZ: this.minZ,
              maxZ: this.maxZ
            };
          }

          var zoom01 = this.clamp((this.maxFov - this.targetCamera.fov) / (this.maxFov - this.minFov), 0, 1);
          var expandMultiplier = 1 + zoom01 * (Math.max(1, this.maxBoundsExpandMultiplier) - 1);
          var centerX = (this.minX + this.maxX) * 0.5;
          var centerZ = (this.minZ + this.maxZ) * 0.5;
          var halfX = (this.maxX - this.minX) * 0.5 * expandMultiplier;
          var halfZ = (this.maxZ - this.minZ) * 0.5 * expandMultiplier;
          return {
            minX: centerX - halfX,
            maxX: centerX + halfX,
            minZ: centerZ - halfZ,
            maxZ: centerZ + halfZ
          };
        }

        getTouchDistance(touches) {
          if (touches.length < 2) return 0;
          var p0 = touches[0].getLocation();
          var p1 = touches[1].getLocation();
          var dx = p1.x - p0.x;
          var dy = p1.y - p0.y;
          return Math.sqrt(dx * dx + dy * dy);
        }

        getTouchCenter(touches) {
          var p0 = touches[0].getLocation();
          var p1 = touches[1].getLocation();
          return {
            x: (p0.x + p1.x) * 0.5,
            y: (p0.y + p1.y) * 0.5
          };
        }

        clamp(value, min, max) {
          return Math.max(min, Math.min(max, value));
        }

        emitZoomRangeChangedIfNeeded() {
          var nextState = this.resolveZoomRangeState();

          if (nextState === this.zoomRangeState) {
            return;
          }

          this.zoomRangeState = nextState;
          this.node.emit(TopDownZoomRangeChangedEvent, nextState);
        }

        resolveZoomRangeState() {
          var epsilon = 0.001;

          if (this.targetFov <= this.minFov + epsilon) {
            return -1;
          }

          if (this.targetFov >= this.maxFov - epsilon) {
            return 1;
          }

          return 0;
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
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "expandBoundsWhenZoomIn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "maxBoundsExpandMultiplier", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.5;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "dragSensitivity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.03;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "smoothSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 12;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "dragFollowSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 60;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "invertX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "invertZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "enablePinchZoom", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "enableMouseWheelZoom", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "minFov", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 25;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "maxFov", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 60;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "pinchSensitivity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.08;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "mouseWheelSensitivity", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.03;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "zoomSmoothSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 12;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "zoomToPointer", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "zoomPointerMoveStrength", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "invertZoomPointerX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "invertZoomPointerZ", [property], {
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