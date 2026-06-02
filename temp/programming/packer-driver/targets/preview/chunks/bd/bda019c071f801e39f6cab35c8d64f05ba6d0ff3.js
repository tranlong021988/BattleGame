System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Component, input, Input, Quat, Vec3, CinematicOrbitRig, TopDownCameraDrag, GameManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _crd, ccclass, property, CinematicState, BattleCinematicCameraController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBattleWave(extras) {
    _reporterNs.report("BattleWave", "./BattleWave", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCinematicOrbitRig(extras) {
    _reporterNs.report("CinematicOrbitRig", "./CinematicOrbitRig", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTopDownCameraDrag(extras) {
    _reporterNs.report("TopDownCameraDrag", "./TopDownCameraDrag", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Component = _cc.Component;
      input = _cc.input;
      Input = _cc.Input;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      CinematicOrbitRig = _unresolved_2.CinematicOrbitRig;
    }, function (_unresolved_3) {
      TopDownCameraDrag = _unresolved_3.TopDownCameraDrag;
    }, function (_unresolved_4) {
      GameManager = _unresolved_4.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1cbcdGjxwFMXJTanym+R192", "BattleCinematicCameraController", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'EventMouse', 'EventTouch', 'input', 'Input', 'Node', 'Quat', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      CinematicState = /*#__PURE__*/function (CinematicState) {
        CinematicState[CinematicState["Idle"] = 0] = "Idle";
        CinematicState[CinematicState["Orbit"] = 1] = "Orbit";
        CinematicState[CinematicState["Returning"] = 2] = "Returning";
        return CinematicState;
      }(CinematicState || {});

      _export("BattleCinematicCameraController", BattleCinematicCameraController = (_dec = ccclass('BattleCinematicCameraController'), _dec2 = property(Camera), _dec3 = property(_crd && CinematicOrbitRig === void 0 ? (_reportPossibleCrUseOfCinematicOrbitRig({
        error: Error()
      }), CinematicOrbitRig) : CinematicOrbitRig), _dec4 = property(_crd && TopDownCameraDrag === void 0 ? (_reportPossibleCrUseOfTopDownCameraDrag({
        error: Error()
      }), TopDownCameraDrag) : TopDownCameraDrag), _dec5 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec(_class = (_class2 = class BattleCinematicCameraController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "mainCamera", _descriptor, this);

          _initializerDefineProperty(this, "orbitRig", _descriptor2, this);

          _initializerDefineProperty(this, "topDownCameraDrag", _descriptor3, this);

          _initializerDefineProperty(this, "gameManager", _descriptor4, this);

          _initializerDefineProperty(this, "autoFindGameManager", _descriptor5, this);

          _initializerDefineProperty(this, "moveSmooth", _descriptor6, this);

          _initializerDefineProperty(this, "rotateSmooth", _descriptor7, this);

          _initializerDefineProperty(this, "fovSmooth", _descriptor8, this);

          _initializerDefineProperty(this, "returnMoveSmooth", _descriptor9, this);

          _initializerDefineProperty(this, "returnRotateSmooth", _descriptor10, this);

          _initializerDefineProperty(this, "returnFovSmooth", _descriptor11, this);

          _initializerDefineProperty(this, "returnPositionThreshold", _descriptor12, this);

          _initializerDefineProperty(this, "returnFovThreshold", _descriptor13, this);

          _initializerDefineProperty(this, "switchTargetWhenUnitDead", _descriptor14, this);

          _initializerDefineProperty(this, "switchWaveWhenCurrentWaveDead", _descriptor15, this);

          _initializerDefineProperty(this, "switchToEnemyTeamIfCurrentTeamDead", _descriptor16, this);

          _initializerDefineProperty(this, "tapAnywhereToExit", _descriptor17, this);

          _initializerDefineProperty(this, "exitTapDelay", _descriptor18, this);

          _initializerDefineProperty(this, "uiTapSuppressDuration", _descriptor19, this);

          _initializerDefineProperty(this, "useParentLock", _descriptor20, this);

          _initializerDefineProperty(this, "lockPositionThreshold", _descriptor21, this);

          _initializerDefineProperty(this, "lockFovThreshold", _descriptor22, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor23, this);

          this.state = CinematicState.Idle;
          this.currentWave = null;
          this.currentUnit = null;
          this.originalParent = null;
          this.originalPos = new Vec3();
          this.originalRot = new Quat();
          this.originalFov = 45;
          this.tempPos = new Vec3();
          this.tempRot = new Quat();
          this.targetPos = new Vec3();
          this.targetRot = new Quat();
          this.exitTapTimer = 0;
          this.uiTapSuppressTimer = 0;
          this.cameraLockedToRig = false;
        }

        onEnable() {
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        }

        onDisable() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        }

        start() {
          if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;
          }
        }

        update(deltaTime) {
          if (this.exitTapTimer > 0) {
            this.exitTapTimer -= deltaTime;
          }

          if (this.uiTapSuppressTimer > 0) {
            this.uiTapSuppressTimer -= deltaTime;
          }

          if (this.state === CinematicState.Orbit) {
            this.validateTarget();

            if (this.state === CinematicState.Orbit) {
              this.updateCameraToOrbit(deltaTime);
            }

            return;
          }

          if (this.state === CinematicState.Returning) {
            this.updateReturnToOriginal(deltaTime);
            return;
          }
        }

        focusWave(wave) {
          if (!wave) return;
          var unit = wave.getRandomAliveUnit();
          if (!unit) return;
          this.suppressExitTap();

          if (this.state === CinematicState.Idle) {
            this.captureCurrentCamera();
          }

          if (this.cameraLockedToRig) {
            this.unlockCameraKeepWorld();
          }

          this.state = CinematicState.Orbit;
          this.currentWave = wave;
          this.currentUnit = unit;

          if (this.orbitRig) {
            this.orbitRig.setTarget(unit);
          }

          if (this.topDownCameraDrag) {
            this.topDownCameraDrag.enabled = false;
          }

          this.exitTapTimer = this.exitTapDelay;
          this.log("Focus wave=" + wave.id + ", unit=" + unit.node.name);
        }

        exitCinematic() {
          if (this.state === CinematicState.Idle) return;
          this.beginReturnToOriginal();
        }

        suppressExitTap(duration) {
          if (duration === void 0) {
            duration = -1;
          }

          var d = duration >= 0 ? duration : this.uiTapSuppressDuration;
          this.uiTapSuppressTimer = Math.max(this.uiTapSuppressTimer, d);
        }

        isCinematicActive() {
          return this.state !== CinematicState.Idle;
        }

        captureCurrentCamera() {
          if (!this.mainCamera) return;
          this.originalParent = this.mainCamera.node.parent;
          this.mainCamera.node.getWorldPosition(this.originalPos);
          this.mainCamera.node.getWorldRotation(this.originalRot);
          this.originalFov = this.mainCamera.fov;
        }

        validateTarget() {
          if (!this.currentWave) {
            this.beginReturnToOriginal();
            return;
          }

          if (this.currentWave.isDead()) {
            if (this.switchWaveWhenCurrentWaveDead) {
              var switchedSameTeam = this.switchToAnotherWave(this.currentWave.team, true);
              if (switchedSameTeam) return;
            }

            if (this.switchToEnemyTeamIfCurrentTeamDead) {
              var enemyTeam = this.currentWave.team === 0 ? 1 : 0;
              var switchedEnemy = this.switchToAnotherWave(enemyTeam, false);
              if (switchedEnemy) return;
            }

            this.beginReturnToOriginal();
            return;
          }

          if (!this.isUnitAlive(this.currentUnit)) {
            if (!this.switchTargetWhenUnitDead) {
              this.beginReturnToOriginal();
              return;
            }

            var nextUnit = this.currentWave.getRandomAliveUnit();

            if (nextUnit) {
              this.switchToUnit(this.currentWave, nextUnit);
              return;
            }

            if (this.switchWaveWhenCurrentWaveDead) {
              var _switchedSameTeam = this.switchToAnotherWave(this.currentWave.team, true);

              if (_switchedSameTeam) return;
            }

            if (this.switchToEnemyTeamIfCurrentTeamDead) {
              var _enemyTeam = this.currentWave.team === 0 ? 1 : 0;

              var _switchedEnemy = this.switchToAnotherWave(_enemyTeam, false);

              if (_switchedEnemy) return;
            }

            this.beginReturnToOriginal();
          }
        }

        switchToAnotherWave(team, excludeCurrentWave) {
          if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;
          }

          if (!this.gameManager) return false;
          var waves = this.gameManager.getWavesByTeam(team);
          var candidates = [];

          for (var i = 0; i < waves.length; i++) {
            var wave = waves[i];
            if (!wave) continue;
            if (excludeCurrentWave && wave === this.currentWave) continue;
            if (wave.isDead()) continue;
            if (!wave.getRandomAliveUnit()) continue;
            candidates.push(wave);
          }

          if (candidates.length <= 0) {
            return false;
          }

          var waveIndex = Math.floor(Math.random() * candidates.length);
          var nextWave = candidates[waveIndex];
          var nextUnit = nextWave.getRandomAliveUnit();
          if (!nextUnit) return false;
          this.switchToUnit(nextWave, nextUnit);
          return true;
        }

        switchToUnit(wave, unit) {
          if (this.cameraLockedToRig) {
            this.unlockCameraKeepWorld();
          }

          this.currentWave = wave;
          this.currentUnit = unit;

          if (this.orbitRig) {
            this.orbitRig.setTarget(unit);
          }

          this.exitTapTimer = this.exitTapDelay;
          this.log("Switch unit wave=" + wave.id + ", unit=" + unit.node.name);
        }

        updateCameraToOrbit(deltaTime) {
          if (!this.mainCamera || !this.orbitRig) return;

          if (this.cameraLockedToRig) {
            this.applyLockedLocalPose();
            return;
          }

          var orbitCamera = this.orbitRig.getCameraNode();
          if (!orbitCamera) return;
          orbitCamera.getWorldPosition(this.targetPos);
          orbitCamera.getWorldRotation(this.targetRot);
          this.mainCamera.node.getWorldPosition(this.tempPos);
          this.mainCamera.node.getWorldRotation(this.tempRot);
          var moveT = 1 - Math.exp(-this.moveSmooth * deltaTime);
          var rotT = 1 - Math.exp(-this.rotateSmooth * deltaTime);
          Vec3.lerp(this.tempPos, this.tempPos, this.targetPos, moveT);
          Quat.slerp(this.tempRot, this.tempRot, this.targetRot, rotT);
          this.mainCamera.node.setWorldPosition(this.tempPos);
          this.mainCamera.node.setWorldRotation(this.tempRot);
          var fovT = 1 - Math.exp(-this.fovSmooth * deltaTime);
          this.mainCamera.fov = this.mainCamera.fov + (this.orbitRig.getCameraFov() - this.mainCamera.fov) * fovT;

          if (this.useParentLock && this.canLockCameraToRig()) {
            this.lockCameraToRig();
          }
        }

        canLockCameraToRig() {
          if (!this.mainCamera || !this.orbitRig) return false;
          var orbitCamera = this.orbitRig.getCameraNode();
          if (!orbitCamera) return false;
          orbitCamera.getWorldPosition(this.targetPos);
          this.mainCamera.node.getWorldPosition(this.tempPos);
          var posDistance = Vec3.distance(this.tempPos, this.targetPos);
          var fovDistance = Math.abs(this.mainCamera.fov - this.orbitRig.getCameraFov());
          var canLock = posDistance <= this.lockPositionThreshold && fovDistance <= this.lockFovThreshold;
          this.log("LockCheck pos=" + posDistance.toFixed(3) + " fov=" + fovDistance.toFixed(3) + " can=" + canLock);
          return canLock;
        }

        lockCameraToRig() {
          if (!this.mainCamera || !this.orbitRig) return;
          var orbitCamera = this.orbitRig.getCameraNode();
          if (!orbitCamera) return;
          this.mainCamera.node.setParent(this.orbitRig.node, true);
          this.cameraLockedToRig = true;
          this.applyLockedLocalPose();
          this.log('LOCKED: MainCamera parent -> OrbitRig');
        }

        applyLockedLocalPose() {
          if (!this.mainCamera || !this.orbitRig) return;
          var orbitCamera = this.orbitRig.getCameraNode();
          if (!orbitCamera) return;
          this.mainCamera.node.setPosition(orbitCamera.position);
          this.mainCamera.node.setRotation(orbitCamera.rotation);
          this.mainCamera.fov = this.orbitRig.getCameraFov();
        }

        unlockCameraKeepWorld() {
          if (!this.mainCamera) return;
          this.mainCamera.node.setParent(this.originalParent, true);
          this.cameraLockedToRig = false;
          this.log('UNLOCKED: MainCamera parent -> originalParent');
        }

        beginReturnToOriginal() {
          if (this.state === CinematicState.Idle) return;

          if (this.cameraLockedToRig) {
            this.unlockCameraKeepWorld();
          }

          this.state = CinematicState.Returning;
          this.currentWave = null;
          this.currentUnit = null;

          if (this.orbitRig) {
            this.orbitRig.clearTarget();
          }

          this.log('Begin smooth return');
        }

        updateReturnToOriginal(deltaTime) {
          if (!this.mainCamera) {
            this.finishReturn();
            return;
          }

          this.mainCamera.node.getWorldPosition(this.tempPos);
          this.mainCamera.node.getWorldRotation(this.tempRot);
          var moveT = 1 - Math.exp(-this.returnMoveSmooth * deltaTime);
          var rotT = 1 - Math.exp(-this.returnRotateSmooth * deltaTime);
          Vec3.lerp(this.tempPos, this.tempPos, this.originalPos, moveT);
          Quat.slerp(this.tempRot, this.tempRot, this.originalRot, rotT);
          this.mainCamera.node.setWorldPosition(this.tempPos);
          this.mainCamera.node.setWorldRotation(this.tempRot);
          var fovT = 1 - Math.exp(-this.returnFovSmooth * deltaTime);
          this.mainCamera.fov = this.mainCamera.fov + (this.originalFov - this.mainCamera.fov) * fovT;
          var posDone = Vec3.distance(this.tempPos, this.originalPos) <= this.returnPositionThreshold;
          var fovDone = Math.abs(this.mainCamera.fov - this.originalFov) <= this.returnFovThreshold;

          if (posDone && fovDone) {
            this.mainCamera.node.setParent(this.originalParent, true);
            this.mainCamera.node.setWorldPosition(this.originalPos);
            this.mainCamera.node.setWorldRotation(this.originalRot);
            this.mainCamera.fov = this.originalFov;
            this.finishReturn();
          }
        }

        finishReturn() {
          this.state = CinematicState.Idle;
          this.currentWave = null;
          this.currentUnit = null;
          this.cameraLockedToRig = false;

          if (this.topDownCameraDrag) {
            this.topDownCameraDrag.enabled = true;
          }

          this.log('Return finished');
        }

        onTouchStart(event) {
          if (!this.tapAnywhereToExit) return;
          if (this.state !== CinematicState.Orbit) return;
          if (this.exitTapTimer > 0) return;
          if (this.uiTapSuppressTimer > 0) return;
          this.beginReturnToOriginal();
        }

        onMouseDown(event) {
          if (!this.tapAnywhereToExit) return;
          if (this.state !== CinematicState.Orbit) return;
          if (this.exitTapTimer > 0) return;
          if (this.uiTapSuppressTimer > 0) return;
          this.beginReturnToOriginal();
        }

        isUnitAlive(unit) {
          if (!unit) return false;
          if (!unit.node.activeInHierarchy) return false;
          if (!unit.props) return false;
          if (unit.props.isDead()) return false;
          return true;
        }

        log(msg) {
          if (!this.enableDebugLog) return;
          console.log("[BattleCinematic] " + msg);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "orbitRig", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "topDownCameraDrag", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "autoFindGameManager", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "moveSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "rotateSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "fovSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "returnMoveSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "returnRotateSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "returnFovSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "returnPositionThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.03;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "returnFovThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.08;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "switchTargetWhenUnitDead", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "switchWaveWhenCurrentWaveDead", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "switchToEnemyTeamIfCurrentTeamDead", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "tapAnywhereToExit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "exitTapDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "uiTapSuppressDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "useParentLock", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "lockPositionThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.12;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "lockFovThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=bda019c071f801e39f6cab35c8d64f05ba6d0ff3.js.map