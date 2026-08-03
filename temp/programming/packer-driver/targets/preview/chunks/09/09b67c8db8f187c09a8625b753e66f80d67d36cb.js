System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, CinematicOrbitRig;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
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
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7735fAU0b9DW5Uy2Zkk8a2e", "CinematicOrbitRig", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("CinematicOrbitRig", CinematicOrbitRig = (_dec = ccclass('CinematicOrbitRig'), _dec2 = property(Node), _dec(_class = (_class2 = class CinematicOrbitRig extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "orbitCamera", _descriptor, this);

          _initializerDefineProperty(this, "orbitSpeed", _descriptor2, this);

          _initializerDefineProperty(this, "firstFocusLocalMoveSmooth", _descriptor3, this);

          _initializerDefineProperty(this, "switchTargetLocalMoveSmooth", _descriptor4, this);

          _initializerDefineProperty(this, "heightOffset", _descriptor5, this);

          _initializerDefineProperty(this, "cameraFov", _descriptor6, this);

          _initializerDefineProperty(this, "enableOrbit", _descriptor7, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor8, this);

          this.targetUnit = null;
          this.originalParent = null;
          this.targetLocalPos = new Vec3();
          this.currentLocalPos = new Vec3();
          this.currentEuler = new Vec3();
          this.hasTargetBefore = false;
          this.currentMoveSmooth = 8;
        }

        onLoad() {
          this.originalParent = this.node.parent;
          this.currentEuler.set(this.node.eulerAngles);
        }

        update(deltaTime) {
          if (!this.targetUnit) return;
          this.updateLocalMove(deltaTime);
          this.updateOrbit(deltaTime);
        }

        setTarget(unit) {
          if (!unit) {
            this.clearTarget();
            return;
          }

          var isSwitching = this.hasTargetBefore && this.targetUnit !== unit;
          this.targetUnit = unit;
          this.hasTargetBefore = true;
          this.currentMoveSmooth = isSwitching ? this.switchTargetLocalMoveSmooth : this.firstFocusLocalMoveSmooth;
          this.node.setParent(unit.node, true);
          this.targetLocalPos.set(0, this.heightOffset, 0);
          this.log("Set target=" + unit.node.name + ", switching=" + isSwitching + ", smooth=" + this.currentMoveSmooth);
        }

        clearTarget() {
          this.targetUnit = null;
          this.hasTargetBefore = false;

          if (this.originalParent) {
            this.node.setParent(this.originalParent, true);
          }
        }

        getTargetUnit() {
          return this.targetUnit;
        }

        getCameraNode() {
          return this.orbitCamera;
        }

        getCameraFov() {
          return this.cameraFov;
        }

        updateLocalMove(deltaTime) {
          this.currentLocalPos.set(this.node.position);
          var t = 1 - Math.exp(-this.currentMoveSmooth * deltaTime);
          Vec3.lerp(this.currentLocalPos, this.currentLocalPos, this.targetLocalPos, t);
          this.node.setPosition(this.currentLocalPos);
        }

        updateOrbit(deltaTime) {
          if (!this.enableOrbit) return;
          this.currentEuler.set(this.node.eulerAngles);
          this.currentEuler.y += this.orbitSpeed * deltaTime;
          this.node.setRotationFromEuler(this.currentEuler);
        }

        log(msg) {
          if (!this.enableDebugLog) return;
          console.log("[CinematicOrbitRig] " + msg);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "orbitCamera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "orbitSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "firstFocusLocalMoveSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "switchTargetLocalMoveSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "heightOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "cameraFov", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 35;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enableOrbit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
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
//# sourceMappingURL=09b67c8db8f187c09a8625b753e66f80d67d36cb.js.map