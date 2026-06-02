System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, CinematicOrbitRig;

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
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "orbitCamera", _descriptor, this);

          _initializerDefineProperty(this, "orbitSpeed", _descriptor2, this);

          _initializerDefineProperty(this, "followSmooth", _descriptor3, this);

          _initializerDefineProperty(this, "heightOffset", _descriptor4, this);

          _initializerDefineProperty(this, "cameraFov", _descriptor5, this);

          _initializerDefineProperty(this, "enableOrbit", _descriptor6, this);

          _initializerDefineProperty(this, "snapToTargetOnFirstFocus", _descriptor7, this);

          _initializerDefineProperty(this, "snapToTargetOnSwitch", _descriptor8, this);

          _initializerDefineProperty(this, "resetOrbitAngleOnNewTarget", _descriptor9, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor10, this);

          this.targetUnit = null;
          this.currentPos = new Vec3();
          this.targetPos = new Vec3();
          this.currentEuler = new Vec3();
          this.hasTargetBefore = false;
        }

        onLoad() {
          this.node.getWorldPosition(this.currentPos);
          this.currentEuler.set(this.node.eulerAngles);
        }

        update(deltaTime) {
          if (!this.targetUnit) return;

          if (!this.targetUnit.node || !this.targetUnit.node.activeInHierarchy) {
            return;
          }

          this.targetUnit.node.getWorldPosition(this.targetPos);
          this.targetPos.y += this.heightOffset;
          this.node.getWorldPosition(this.currentPos);
          const t = 1 - Math.exp(-this.followSmooth * deltaTime);
          Vec3.lerp(this.currentPos, this.currentPos, this.targetPos, t);
          this.node.setWorldPosition(this.currentPos);

          if (this.enableOrbit) {
            this.currentEuler.set(this.node.eulerAngles);
            this.currentEuler.y += this.orbitSpeed * deltaTime;
            this.node.setRotationFromEuler(this.currentEuler);
          }
        }

        setTarget(unit) {
          if (!unit) {
            this.clearTarget();
            return;
          }

          const isSwitching = this.hasTargetBefore && this.targetUnit !== unit;
          this.targetUnit = unit;
          this.hasTargetBefore = true;
          unit.node.getWorldPosition(this.targetPos);
          this.targetPos.y += this.heightOffset;
          const shouldSnap = !isSwitching && this.snapToTargetOnFirstFocus || isSwitching && this.snapToTargetOnSwitch;

          if (shouldSnap) {
            this.node.setWorldPosition(this.targetPos);
          }

          if (this.resetOrbitAngleOnNewTarget) {
            this.currentEuler.set(this.node.eulerAngles);
            this.currentEuler.y = 0;
            this.node.setRotationFromEuler(this.currentEuler);
          }

          this.log(`Set target: ${unit.node.name}`);
        }

        clearTarget() {
          this.targetUnit = null;
          this.hasTargetBefore = false;
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

        isCloseToTarget(threshold) {
          if (!this.targetUnit) return false;
          this.targetUnit.node.getWorldPosition(this.targetPos);
          this.targetPos.y += this.heightOffset;
          this.node.getWorldPosition(this.currentPos);
          return Vec3.distance(this.currentPos, this.targetPos) <= threshold;
        }

        log(msg) {
          if (!this.enableDebugLog) return;
          console.log(`[CinematicOrbitRig] ${msg}`);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "orbitCamera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "orbitSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "followSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 12;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "heightOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "cameraFov", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 35;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "enableOrbit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "snapToTargetOnFirstFocus", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "snapToTargetOnSwitch", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "resetOrbitAngleOnNewTarget", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
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
//# sourceMappingURL=a2fb293535f8bf50eef14233c2a29df2273e17c1.js.map