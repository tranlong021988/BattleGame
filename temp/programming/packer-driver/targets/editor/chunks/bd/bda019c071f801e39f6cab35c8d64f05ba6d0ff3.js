System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Component, geometry, input, Input, Quat, Vec3, BattleWave, CinematicOrbitRig, TopDownCameraDrag, GameManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _crd, ccclass, property, CinematicState, BattleCinematicCameraController;

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
      geometry = _cc.geometry;
      input = _cc.input;
      Input = _cc.Input;
      Quat = _cc.Quat;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BattleWave = _unresolved_2.BattleWave;
    }, function (_unresolved_3) {
      CinematicOrbitRig = _unresolved_3.CinematicOrbitRig;
    }, function (_unresolved_4) {
      TopDownCameraDrag = _unresolved_4.TopDownCameraDrag;
    }, function (_unresolved_5) {
      GameManager = _unresolved_5.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1cbcdGjxwFMXJTanym+R192", "BattleCinematicCameraController", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'EventMouse', 'EventTouch', 'geometry', 'input', 'Input', 'Node', 'Quat', 'Vec3']);

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
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "mainCamera", _descriptor, this);

          _initializerDefineProperty(this, "orbitRig", _descriptor2, this);

          _initializerDefineProperty(this, "topDownCameraDrag", _descriptor3, this);

          _initializerDefineProperty(this, "gameManager", _descriptor4, this);

          _initializerDefineProperty(this, "autoFindGameManager", _descriptor5, this);

          _initializerDefineProperty(this, "enterMoveDuration", _descriptor6, this);

          _initializerDefineProperty(this, "enterFocusDelayRatio", _descriptor7, this);

          _initializerDefineProperty(this, "enterFocusDuration", _descriptor8, this);

          _initializerDefineProperty(this, "returnFocusDuration", _descriptor9, this);

          _initializerDefineProperty(this, "returnMoveDelayRatio", _descriptor10, this);

          _initializerDefineProperty(this, "returnMoveDuration", _descriptor11, this);

          _initializerDefineProperty(this, "returnPositionThreshold", _descriptor12, this);

          _initializerDefineProperty(this, "returnFovThreshold", _descriptor13, this);

          _initializerDefineProperty(this, "switchTargetWhenUnitDead", _descriptor14, this);

          _initializerDefineProperty(this, "switchWaveWhenCurrentWaveDead", _descriptor15, this);

          _initializerDefineProperty(this, "switchToEnemyTeamIfCurrentTeamDead", _descriptor16, this);

          _initializerDefineProperty(this, "tapAnywhereToExit", _descriptor17, this);

          _initializerDefineProperty(this, "exitTapDelay", _descriptor18, this);

          _initializerDefineProperty(this, "uiTapSuppressDuration", _descriptor19, this);

          _initializerDefineProperty(this, "enableBattlefieldUnitTapFocus", _descriptor20, this);

          _initializerDefineProperty(this, "unitTapMaxMovePixels", _descriptor21, this);

          _initializerDefineProperty(this, "unitTapPickRadius", _descriptor22, this);

          _initializerDefineProperty(this, "unitTapPickPlaneY", _descriptor23, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor24, this);

          this.state = CinematicState.Idle;
          this.currentWave = null;
          this.currentUnit = null;
          this.originalParent = null;
          this.originalPos = new Vec3();
          this.originalRot = new Quat();
          this.originalFov = 45;
          this.startLocalPos = new Vec3();
          this.startLocalRot = new Quat();
          this.startFov = 45;
          this.currentLocalPos = new Vec3();
          this.currentLocalRot = new Quat();
          this.targetLocalPos = new Vec3();
          this.targetLocalRot = new Quat();
          this.returnStartPos = new Vec3();
          this.returnStartRot = new Quat();
          this.returnStartFov = 45;
          this.returnCurrentPos = new Vec3();
          this.returnCurrentRot = new Quat();
          this.exitTapTimer = 0;
          this.uiTapSuppressTimer = 0;
          this.enterTimer = 0;
          this.returnTimer = 0;
          this.touchTapStartX = 0;
          this.touchTapStartY = 0;
          this.hasTouchTapStart = false;
          this.mouseTapStartX = 0;
          this.mouseTapStartY = 0;
          this.hasMouseTapStart = false;
          this.unitTapRay = new geometry.Ray();
          this.unitTapWorldPoint = new Vec3();
          this.unitTapWorldPos = new Vec3();
        }

        onEnable() {
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
          input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }

        onDisable() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
          input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
          input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
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
              this.updateCameraLocalToOrbitPose(deltaTime);
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
          const unit = wave.getRandomPreferredAliveUnit();
          if (!unit) return;
          this.suppressExitTap();

          if (this.state === CinematicState.Idle) {
            this.captureCurrentCamera();
          }

          this.state = CinematicState.Orbit;
          this.currentWave = wave;
          this.currentUnit = unit;

          if (this.orbitRig) {
            this.orbitRig.setTarget(unit);
          }

          this.parentCameraToOrbitRigKeepWorld();
          this.resetEnterTweenFromCurrentLocalPose();

          if (this.topDownCameraDrag) {
            this.topDownCameraDrag.enabled = false;
          }

          this.exitTapTimer = this.exitTapDelay;
          this.log(`Focus wave=${wave.id}, unit=${unit.node.name}`);
        }

        focusUnit(unit) {
          if (!this.isUnitAlive(unit)) return;
          this.suppressExitTap();

          if (this.state === CinematicState.Idle) {
            this.captureCurrentCamera();
          }

          this.state = CinematicState.Orbit;
          this.currentWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          this.currentUnit = unit;

          if (this.orbitRig) {
            this.orbitRig.setTarget(unit);
          }

          this.parentCameraToOrbitRigKeepWorld();
          this.resetEnterTweenFromCurrentLocalPose();

          if (this.topDownCameraDrag) {
            this.topDownCameraDrag.enabled = false;
          }

          this.exitTapTimer = this.exitTapDelay;
          this.log(`Focus unit=${unit.node.name}`);
        }

        onUnitWillDespawn(unit) {
          if (!unit) return;
          if (this.state !== CinematicState.Orbit) return;
          if (this.currentUnit !== unit) return;
          const switched = this.trySwitchTargetBeforeDespawn();

          if (!switched) {
            this.beginReturnToOriginal();
          }
        }

        exitCinematic() {
          if (this.state === CinematicState.Idle) return;
          this.beginReturnToOriginal();
        }

        suppressExitTap(duration = -1) {
          const d = duration >= 0 ? duration : this.uiTapSuppressDuration;
          this.uiTapSuppressTimer = Math.max(this.uiTapSuppressTimer, d);
        }

        isCinematicActive() {
          return this.state !== CinematicState.Idle;
        }

        isOrbiting() {
          return this.state === CinematicState.Orbit;
        }

        isReturning() {
          return this.state === CinematicState.Returning;
        }

        captureCurrentCamera() {
          if (!this.mainCamera) return;
          this.originalParent = this.mainCamera.node.parent;
          this.mainCamera.node.getWorldPosition(this.originalPos);
          this.mainCamera.node.getWorldRotation(this.originalRot);
          this.originalFov = this.mainCamera.fov;
        }

        parentCameraToOrbitRigKeepWorld() {
          if (!this.mainCamera || !this.orbitRig) return;
          this.mainCamera.node.setParent(this.orbitRig.node, true);
        }

        resetEnterTweenFromCurrentLocalPose() {
          if (!this.mainCamera) return;
          this.enterTimer = 0;
          this.startLocalPos.set(this.mainCamera.node.position);
          this.startLocalRot.set(this.mainCamera.node.rotation);
          this.startFov = this.mainCamera.fov;
        }

        validateTarget() {
          if (!this.currentWave) {
            if (!this.isUnitAlive(this.currentUnit)) {
              this.beginReturnToOriginal();
            }

            return;
          }

          if (this.currentWave.isDead()) {
            const switched = this.trySwitchTargetBeforeDespawn();

            if (!switched) {
              this.beginReturnToOriginal();
            }

            return;
          }

          if (!this.isUnitAlive(this.currentUnit)) {
            if (!this.switchTargetWhenUnitDead) {
              this.beginReturnToOriginal();
              return;
            }

            const switched = this.trySwitchTargetBeforeDespawn();

            if (!switched) {
              this.beginReturnToOriginal();
            }
          }
        }

        trySwitchTargetBeforeDespawn() {
          if (!this.currentWave) return false;
          const sameWaveUnit = this.currentWave.getRandomPreferredAliveUnit();

          if (sameWaveUnit && sameWaveUnit !== this.currentUnit) {
            this.switchToUnit(this.currentWave, sameWaveUnit);
            return true;
          }

          if (this.switchWaveWhenCurrentWaveDead) {
            const switchedSameTeam = this.switchToAnotherWave(this.currentWave.team, true);

            if (switchedSameTeam) {
              return true;
            }
          }

          if (this.switchToEnemyTeamIfCurrentTeamDead) {
            const enemyTeam = this.currentWave.team === 0 ? 1 : 0;
            const switchedEnemy = this.switchToAnotherWave(enemyTeam, false);

            if (switchedEnemy) {
              return true;
            }
          }

          return false;
        }

        switchToAnotherWave(team, excludeCurrentWave) {
          if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;
          }

          if (!this.gameManager) return false;
          const waves = this.gameManager.getWavesByTeam(team);
          const candidates = [];

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!wave) continue;
            if (excludeCurrentWave && wave === this.currentWave) continue;
            if (wave.isDead()) continue;
            const unit = wave.getRandomPreferredAliveUnit();
            if (!unit) continue;
            candidates.push(wave);
          }

          if (candidates.length <= 0) {
            return false;
          }

          const waveIndex = Math.floor(Math.random() * candidates.length);
          const nextWave = candidates[waveIndex];
          const nextUnit = nextWave.getRandomPreferredAliveUnit();
          if (!nextUnit) return false;
          this.switchToUnit(nextWave, nextUnit);
          return true;
        }

        switchToUnit(wave, unit) {
          this.currentWave = wave;
          this.currentUnit = unit;

          if (this.orbitRig) {
            this.orbitRig.setTarget(unit);
          }

          this.parentCameraToOrbitRigKeepWorld();
          this.resetEnterTweenFromCurrentLocalPose();
          this.exitTapTimer = this.exitTapDelay;
          this.log(`Switch unit wave=${wave.id}, unit=${unit.node.name}`);
        }

        updateCameraLocalToOrbitPose(deltaTime) {
          if (!this.mainCamera || !this.orbitRig) return;
          const orbitCamera = this.orbitRig.getCameraNode();
          if (!orbitCamera) return;
          this.enterTimer += deltaTime;
          this.targetLocalPos.set(orbitCamera.position);
          this.targetLocalRot.set(orbitCamera.rotation);
          const moveDuration = Math.max(0.0001, this.enterMoveDuration);
          const move01 = this.clamp01(this.enterTimer / moveDuration);
          const moveT = this.smooth01(move01);
          Vec3.lerp(this.currentLocalPos, this.startLocalPos, this.targetLocalPos, moveT);
          this.mainCamera.node.setPosition(this.currentLocalPos);
          const focusDelay = moveDuration * this.enterFocusDelayRatio;
          const focusDuration = Math.max(0.0001, this.enterFocusDuration);
          const focus01 = this.clamp01((this.enterTimer - focusDelay) / focusDuration);
          const focusT = this.smooth01(focus01);
          Quat.slerp(this.currentLocalRot, this.startLocalRot, this.targetLocalRot, focusT);
          this.mainCamera.node.setRotation(this.currentLocalRot);
          const targetFov = this.orbitRig.getCameraFov();
          this.mainCamera.fov = this.startFov + (targetFov - this.startFov) * focusT;
        }

        beginReturnToOriginal() {
          if (this.state === CinematicState.Idle) return;

          if (!this.mainCamera) {
            this.finishReturn();
            return;
          }

          this.mainCamera.node.setParent(this.originalParent, true);
          this.mainCamera.node.getWorldPosition(this.returnStartPos);
          this.mainCamera.node.getWorldRotation(this.returnStartRot);
          this.returnStartFov = this.mainCamera.fov;
          this.returnTimer = 0;
          this.state = CinematicState.Returning;
          this.currentWave = null;
          this.currentUnit = null;

          if (this.orbitRig) {
            this.orbitRig.clearTarget();
          }

          this.log('Begin delayed smooth return');
        }

        updateReturnToOriginal(deltaTime) {
          if (!this.mainCamera) {
            this.finishReturn();
            return;
          }

          this.returnTimer += deltaTime;
          const focusDuration = Math.max(0.0001, this.returnFocusDuration);
          const focus01 = this.clamp01(this.returnTimer / focusDuration);
          const focusT = this.smooth01(focus01);
          Quat.slerp(this.returnCurrentRot, this.returnStartRot, this.originalRot, focusT);
          this.mainCamera.node.setWorldRotation(this.returnCurrentRot);
          this.mainCamera.fov = this.returnStartFov + (this.originalFov - this.returnStartFov) * focusT;
          const moveDelay = focusDuration * this.returnMoveDelayRatio;
          const moveDuration = Math.max(0.0001, this.returnMoveDuration);
          const move01 = this.clamp01((this.returnTimer - moveDelay) / moveDuration);
          const moveT = this.smooth01(move01);
          Vec3.lerp(this.returnCurrentPos, this.returnStartPos, this.originalPos, moveT);
          this.mainCamera.node.setWorldPosition(this.returnCurrentPos);
          const posDone = Vec3.distance(this.returnCurrentPos, this.originalPos) <= this.returnPositionThreshold;
          const fovDone = Math.abs(this.mainCamera.fov - this.originalFov) <= this.returnFovThreshold;
          const rotDone = focus01 >= 1;
          const moveDone = move01 >= 1;

          if (posDone && fovDone && rotDone && moveDone) {
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

          if (this.topDownCameraDrag) {
            this.topDownCameraDrag.enabled = true;
          }

          this.log('Return finished');
        }

        onTouchStart(event) {
          this.hasTouchTapStart = false;

          if (this.enableBattlefieldUnitTapFocus && this.state === CinematicState.Idle) {
            const touches = event.getAllTouches();

            if (touches.length <= 1) {
              const p = event.getLocation();
              this.touchTapStartX = p.x;
              this.touchTapStartY = p.y;
              this.hasTouchTapStart = true;
            }
          }

          if (!this.tapAnywhereToExit) return;
          if (this.state !== CinematicState.Orbit) return;
          if (this.exitTapTimer > 0) return;
          if (this.uiTapSuppressTimer > 0) return;
          this.beginReturnToOriginal();
        }

        onTouchEnd(event) {
          if (!this.hasTouchTapStart) return;
          this.hasTouchTapStart = false;
          if (this.state !== CinematicState.Idle) return;
          if (this.uiTapSuppressTimer > 0) return;
          const touches = event.getAllTouches();
          if (touches.length > 0) return;
          const p = event.getLocation();

          if (!this.isTapWithinMoveThreshold(this.touchTapStartX, this.touchTapStartY, p.x, p.y)) {
            return;
          }

          this.tryFocusUnitAtScreenPoint(p.x, p.y);
        }

        onTouchCancel() {
          this.hasTouchTapStart = false;
        }

        onMouseDown(event) {
          this.hasMouseTapStart = false;

          if (this.enableBattlefieldUnitTapFocus && this.state === CinematicState.Idle && this.isPrimaryMouseButton(event)) {
            const p = event.getLocation();
            this.mouseTapStartX = p.x;
            this.mouseTapStartY = p.y;
            this.hasMouseTapStart = true;
          }

          if (!this.tapAnywhereToExit) return;
          if (this.state !== CinematicState.Orbit) return;
          if (this.exitTapTimer > 0) return;
          if (this.uiTapSuppressTimer > 0) return;
          this.beginReturnToOriginal();
        }

        onMouseUp(event) {
          if (!this.hasMouseTapStart) return;
          this.hasMouseTapStart = false;
          if (this.state !== CinematicState.Idle) return;
          if (this.uiTapSuppressTimer > 0) return;
          if (!this.isPrimaryMouseButton(event)) return;
          const p = event.getLocation();

          if (!this.isTapWithinMoveThreshold(this.mouseTapStartX, this.mouseTapStartY, p.x, p.y)) {
            return;
          }

          this.tryFocusUnitAtScreenPoint(p.x, p.y);
        }

        tryFocusUnitAtScreenPoint(screenX, screenY) {
          if (!this.enableBattlefieldUnitTapFocus) return;
          if (this.state !== CinematicState.Idle) return;
          const unit = this.pickAliveUnitAtScreenPoint(screenX, screenY);
          if (!unit) return;
          this.focusUnit(unit);
        }

        pickAliveUnitAtScreenPoint(screenX, screenY) {
          if (!this.screenPointToBattlePlane(screenX, screenY, this.unitTapWorldPoint)) {
            return null;
          }

          if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;
          }

          if (!this.gameManager) return null;
          let bestUnit = null;
          let bestDistanceSq = Number.POSITIVE_INFINITY;
          const aResult = this.pickClosestAliveUnitInList(this.gameManager.getAliveUnits(0), this.unitTapWorldPoint.x, this.unitTapWorldPoint.z, bestDistanceSq);

          if (aResult.unit) {
            bestUnit = aResult.unit;
            bestDistanceSq = aResult.distanceSq;
          }

          const bResult = this.pickClosestAliveUnitInList(this.gameManager.getAliveUnits(1), this.unitTapWorldPoint.x, this.unitTapWorldPoint.z, bestDistanceSq);

          if (bResult.unit) {
            bestUnit = bResult.unit;
          }

          return bestUnit;
        }

        pickClosestAliveUnitInList(units, x, z, maxDistanceSq) {
          let bestUnit = null;
          let bestDistanceSq = maxDistanceSq;

          for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (!this.isUnitAlive(unit)) continue;
            const pos = unit.agent ? unit.agent.pos : null;
            let ux = 0;
            let uz = 0;

            if (pos) {
              ux = pos.x;
              uz = pos.z;
            } else {
              unit.node.getWorldPosition(this.unitTapWorldPos);
              ux = this.unitTapWorldPos.x;
              uz = this.unitTapWorldPos.z;
            }

            const dx = ux - x;
            const dz = uz - z;
            const distanceSq = dx * dx + dz * dz;
            const pickRadius = Math.max(this.unitTapPickRadius, unit.radius);
            if (distanceSq > pickRadius * pickRadius) continue;
            if (distanceSq >= bestDistanceSq) continue;
            bestUnit = unit;
            bestDistanceSq = distanceSq;
          }

          return {
            unit: bestUnit,
            distanceSq: bestDistanceSq
          };
        }

        screenPointToBattlePlane(screenX, screenY, out) {
          if (!this.mainCamera) return false;
          const camera = this.mainCamera;
          let ray = null;

          if (typeof camera.screenPointToRay !== 'function') {
            return false;
          }

          try {
            ray = camera.screenPointToRay(screenX, screenY, this.unitTapRay) || this.unitTapRay;
          } catch (e) {
            ray = camera.screenPointToRay(this.unitTapRay, screenX, screenY) || this.unitTapRay;
          }

          const origin = ray.o || ray.origin;
          const dir = ray.d || ray.direction;
          if (!origin || !dir) return false;
          if (Math.abs(dir.y) <= 0.00001) return false;
          const t = (this.unitTapPickPlaneY - origin.y) / dir.y;
          if (t < 0) return false;
          out.set(origin.x + dir.x * t, this.unitTapPickPlaneY, origin.z + dir.z * t);
          return true;
        }

        isTapWithinMoveThreshold(startX, startY, endX, endY) {
          const dx = endX - startX;
          const dy = endY - startY;
          const threshold = Math.max(0, this.unitTapMaxMovePixels);
          return dx * dx + dy * dy <= threshold * threshold;
        }

        isPrimaryMouseButton(event) {
          const mouseEvent = event;

          if (typeof mouseEvent.getButton !== 'function') {
            return true;
          }

          return mouseEvent.getButton() === 0;
        }

        isUnitAlive(unit) {
          if (!unit) return false;
          if (!unit.node.activeInHierarchy) return false;
          if (!unit.props) return false;
          if (unit.props.isDead()) return false;
          return true;
        }

        smooth01(t) {
          const x = this.clamp01(t);
          return x * x * (3 - 2 * x);
        }

        clamp01(v) {
          return Math.max(0, Math.min(1, v));
        }

        log(msg) {
          if (!this.enableDebugLog) return;
          console.log(`[BattleCinematic] ${msg}`);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "orbitRig", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "topDownCameraDrag", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "autoFindGameManager", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "enterMoveDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enterFocusDelayRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "enterFocusDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.7;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "returnFocusDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.7;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "returnMoveDelayRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "returnMoveDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "returnPositionThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.03;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "returnFovThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.08;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "switchTargetWhenUnitDead", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "switchWaveWhenCurrentWaveDead", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "switchToEnemyTeamIfCurrentTeamDead", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "tapAnywhereToExit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "exitTapDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "uiTapSuppressDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "enableBattlefieldUnitTapFocus", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "unitTapMaxMovePixels", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 12;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "unitTapPickRadius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.85;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "unitTapPickPlaneY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
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
//# sourceMappingURL=bda019c071f801e39f6cab35c8d64f05ba6d0ff3.js.map