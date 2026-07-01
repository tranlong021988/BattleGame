import {
    _decorator,
    Camera,
    Component,
    EventMouse,
    EventTouch,
    geometry,
    input,
    Input,
    Node,
    Quat,
    Vec3,
} from 'cc';

import { BattleWave } from './BattleWave';
import { CinematicOrbitRig } from './CinematicOrbitRig';
import { TopDownCameraDrag } from './TopDownCameraDrag';
import { Unit } from './Unit';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

enum CinematicState {
    Idle = 0,
    Orbit = 1,
    Returning = 2,
}

const BannerVisibilityBlockedEvent =
    'battle-camera-banner-visibility-blocked';

@ccclass('BattleCinematicCameraController')
export class BattleCinematicCameraController extends Component {

    @property(Camera)
    mainCamera: Camera | null = null;

    @property(CinematicOrbitRig)
    orbitRig: CinematicOrbitRig | null = null;

    @property(TopDownCameraDrag)
    topDownCameraDrag: TopDownCameraDrag | null = null;

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property
    autoFindGameManager = true;

    @property
    enterMoveDuration = 1.0;

    @property
    enterFocusDelayRatio = 0.5;

    @property
    enterFocusDuration = 0.7;

    @property
    returnFocusDuration = 0.7;

    @property
    returnMoveDelayRatio = 0.5;

    @property
    returnMoveDuration = 1.0;

    @property
    returnPositionThreshold = 0.03;

    @property
    returnFovThreshold = 0.08;

    @property
    switchTargetWhenUnitDead = true;

    @property
    switchWaveWhenCurrentWaveDead = true;

    @property
    switchToEnemyTeamIfCurrentTeamDead = true;

    @property
    tapAnywhereToExit = true;

    @property
    exitTapDelay = 0.25;

    @property
    uiTapSuppressDuration = 0.25;

    @property
    enableBattlefieldUnitTapFocus = true;

    @property
    unitTapMaxMovePixels = 12;

    @property
    unitTapPickRadius = 0.85;

    @property
    unitTapPickPlaneY = 0;

    @property
    enableDebugLog = false;

    private state: CinematicState = CinematicState.Idle;
    private bannerVisibilityBlocked = false;

    private currentWave: BattleWave | null = null;
    private currentUnit: Unit | null = null;

    private originalParent: Node | null = null;

    private originalPos = new Vec3();
    private originalRot = new Quat();
    private originalFov = 45;

    private startLocalPos = new Vec3();
    private startLocalRot = new Quat();
    private startFov = 45;

    private currentLocalPos = new Vec3();
    private currentLocalRot = new Quat();

    private targetLocalPos = new Vec3();
    private targetLocalRot = new Quat();

    private returnStartPos = new Vec3();
    private returnStartRot = new Quat();
    private returnStartFov = 45;

    private returnCurrentPos = new Vec3();
    private returnCurrentRot = new Quat();

    private exitTapTimer = 0;
    private uiTapSuppressTimer = 0;

    private enterTimer = 0;
    private returnTimer = 0;

    private touchTapStartX = 0;
    private touchTapStartY = 0;
    private hasTouchTapStart = false;

    private mouseTapStartX = 0;
    private mouseTapStartY = 0;
    private hasMouseTapStart = false;

    private unitTapRay: any = new geometry.Ray();
    private unitTapWorldPoint = new Vec3();
    private unitTapWorldPos = new Vec3();

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
            this.gameManager = GameManager.instance;
        }
    }

    update(deltaTime: number) {
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

    public focusWave(wave: BattleWave | null) {
        if (!wave) return;

        const unit = wave.getRandomPreferredAliveUnit();
        if (!unit) return;

        this.suppressExitTap();

        if (this.state === CinematicState.Idle) {
            this.captureCurrentCamera();
        }

        this.state = CinematicState.Orbit;
        this.setBannerVisibilityBlocked(true);

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

    public focusUnit(unit: Unit | null) {
        if (!this.isUnitAlive(unit)) return;

        this.suppressExitTap();

        if (this.state === CinematicState.Idle) {
            this.captureCurrentCamera();
        }

        this.state = CinematicState.Orbit;
        this.setBannerVisibilityBlocked(true);

        this.currentWave = BattleWave.getWaveForUnit(unit);
        this.currentUnit = unit;

        if (this.orbitRig) {
            this.orbitRig.setTarget(unit!);
        }

        this.parentCameraToOrbitRigKeepWorld();
        this.resetEnterTweenFromCurrentLocalPose();

        if (this.topDownCameraDrag) {
            this.topDownCameraDrag.enabled = false;
        }

        this.exitTapTimer = this.exitTapDelay;

        this.log(`Focus unit=${unit!.node.name}`);
    }

    public onUnitWillDespawn(unit: Unit | null) {
        if (!unit) return;
        if (this.state !== CinematicState.Orbit) return;
        if (this.currentUnit !== unit) return;

        const switched = this.trySwitchTargetBeforeDespawn();

        if (!switched) {
            this.beginReturnToOriginal();
        }
    }

    public exitCinematic() {
        if (this.state === CinematicState.Idle) return;

        this.beginReturnToOriginal();
    }

    public suppressExitTap(duration: number = -1) {
        const d =
            duration >= 0
                ? duration
                : this.uiTapSuppressDuration;

        this.uiTapSuppressTimer = Math.max(
            this.uiTapSuppressTimer,
            d
        );
    }

    public isBannerVisibilityBlocked() {
        return this.bannerVisibilityBlocked;
    }

    public isCinematicActive() {
        return this.state !== CinematicState.Idle;
    }

    public isOrbiting() {
        return this.state === CinematicState.Orbit;
    }

    public isReturning() {
        return this.state === CinematicState.Returning;
    }

    private captureCurrentCamera() {
        if (!this.mainCamera) return;

        this.originalParent = this.mainCamera.node.parent;

        this.mainCamera.node.getWorldPosition(this.originalPos);
        this.mainCamera.node.getWorldRotation(this.originalRot);

        this.originalFov = this.mainCamera.fov;
    }

    private parentCameraToOrbitRigKeepWorld() {
        if (!this.mainCamera || !this.orbitRig) return;

        this.mainCamera.node.setParent(
            this.orbitRig.node,
            true
        );
    }

    private resetEnterTweenFromCurrentLocalPose() {
        if (!this.mainCamera) return;

        this.enterTimer = 0;

        this.startLocalPos.set(this.mainCamera.node.position);
        this.startLocalRot.set(this.mainCamera.node.rotation);
        this.startFov = this.mainCamera.fov;
    }

    private validateTarget() {
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

    private trySwitchTargetBeforeDespawn() {
        if (!this.currentWave) return false;

        const sameWaveUnit =
            this.currentWave.getRandomPreferredAliveUnit();

        if (
            sameWaveUnit &&
            sameWaveUnit !== this.currentUnit
        ) {
            this.switchToUnit(
                this.currentWave,
                sameWaveUnit
            );

            return true;
        }

        if (this.switchWaveWhenCurrentWaveDead) {
            const switchedSameTeam =
                this.switchToAnotherWave(
                    this.currentWave.team,
                    true
                );

            if (switchedSameTeam) {
                return true;
            }
        }

        if (this.switchToEnemyTeamIfCurrentTeamDead) {
            const enemyTeam =
                this.currentWave.team === 0 ? 1 : 0;

            const switchedEnemy =
                this.switchToAnotherWave(
                    enemyTeam,
                    false
                );

            if (switchedEnemy) {
                return true;
            }
        }

        return false;
    }

    private switchToAnotherWave(
        team: number,
        excludeCurrentWave: boolean
    ) {
        if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = GameManager.instance;
        }

        if (!this.gameManager) return false;

        const waves = this.gameManager.getWavesByTeam(team);
        const candidates: BattleWave[] = [];

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

        const waveIndex = Math.floor(
            Math.random() * candidates.length
        );

        const nextWave = candidates[waveIndex];
        const nextUnit = nextWave.getRandomPreferredAliveUnit();

        if (!nextUnit) return false;

        this.switchToUnit(nextWave, nextUnit);

        return true;
    }

    private switchToUnit(
        wave: BattleWave,
        unit: Unit
    ) {
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

    private updateCameraLocalToOrbitPose(deltaTime: number) {
        if (!this.mainCamera || !this.orbitRig) return;

        const orbitCamera = this.orbitRig.getCameraNode();
        if (!orbitCamera) return;

        this.enterTimer += deltaTime;

        this.targetLocalPos.set(orbitCamera.position);
        this.targetLocalRot.set(orbitCamera.rotation);

        const moveDuration = Math.max(0.0001, this.enterMoveDuration);
        const move01 = this.clamp01(this.enterTimer / moveDuration);
        const moveT = this.smooth01(move01);

        Vec3.lerp(
            this.currentLocalPos,
            this.startLocalPos,
            this.targetLocalPos,
            moveT
        );

        this.mainCamera.node.setPosition(this.currentLocalPos);

        const focusDelay =
            moveDuration * this.enterFocusDelayRatio;

        const focusDuration = Math.max(
            0.0001,
            this.enterFocusDuration
        );

        const focus01 = this.clamp01(
            (this.enterTimer - focusDelay) /
            focusDuration
        );

        const focusT = this.smooth01(focus01);

        Quat.slerp(
            this.currentLocalRot,
            this.startLocalRot,
            this.targetLocalRot,
            focusT
        );

        this.mainCamera.node.setRotation(this.currentLocalRot);

        const targetFov = this.orbitRig.getCameraFov();

        this.mainCamera.fov =
            this.startFov +
            (targetFov - this.startFov) * focusT;
    }

    private beginReturnToOriginal() {
        if (this.state === CinematicState.Idle) return;

        if (!this.mainCamera) {
            this.finishReturn();
            return;
        }

        this.mainCamera.node.setParent(
            this.originalParent,
            true
        );

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

    private updateReturnToOriginal(deltaTime: number) {
        if (!this.mainCamera) {
            this.finishReturn();
            return;
        }

        this.returnTimer += deltaTime;

        const focusDuration = Math.max(
            0.0001,
            this.returnFocusDuration
        );

        const focus01 = this.clamp01(
            this.returnTimer / focusDuration
        );

        const focusT = this.smooth01(focus01);

        Quat.slerp(
            this.returnCurrentRot,
            this.returnStartRot,
            this.originalRot,
            focusT
        );

        this.mainCamera.node.setWorldRotation(this.returnCurrentRot);

        this.mainCamera.fov =
            this.returnStartFov +
            (this.originalFov - this.returnStartFov) * focusT;

        const moveDelay =
            focusDuration * this.returnMoveDelayRatio;

        const moveDuration = Math.max(
            0.0001,
            this.returnMoveDuration
        );

        const move01 = this.clamp01(
            (this.returnTimer - moveDelay) /
            moveDuration
        );

        const moveT = this.smooth01(move01);

        Vec3.lerp(
            this.returnCurrentPos,
            this.returnStartPos,
            this.originalPos,
            moveT
        );

        this.mainCamera.node.setWorldPosition(this.returnCurrentPos);

        const posDone =
            Vec3.distance(
                this.returnCurrentPos,
                this.originalPos
            ) <= this.returnPositionThreshold;

        const fovDone =
            Math.abs(
                this.mainCamera.fov -
                this.originalFov
            ) <= this.returnFovThreshold;

        const rotDone = focus01 >= 1;
        const moveDone = move01 >= 1;

        if (posDone && fovDone && rotDone && moveDone) {
            this.mainCamera.node.setWorldPosition(this.originalPos);
            this.mainCamera.node.setWorldRotation(this.originalRot);
            this.mainCamera.fov = this.originalFov;

            this.finishReturn();
        }
    }

    private finishReturn() {
        this.state = CinematicState.Idle;
        this.setBannerVisibilityBlocked(false);

        this.currentWave = null;
        this.currentUnit = null;

        if (this.topDownCameraDrag) {
            this.topDownCameraDrag.enabled = true;
        }

        this.log('Return finished');
    }

    private setBannerVisibilityBlocked(
        blocked: boolean
    ) {
        if (this.bannerVisibilityBlocked === blocked) {
            return;
        }

        this.bannerVisibilityBlocked = blocked;
        this.node.emit(
            BannerVisibilityBlockedEvent,
            blocked
        );
    }

    private onTouchStart(event: EventTouch) {
        this.hasTouchTapStart = false;

        if (
            this.enableBattlefieldUnitTapFocus &&
            this.state === CinematicState.Idle
        ) {
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

    private onTouchEnd(event: EventTouch) {
        if (!this.hasTouchTapStart) return;

        this.hasTouchTapStart = false;

        if (this.state !== CinematicState.Idle) return;
        if (this.uiTapSuppressTimer > 0) return;

        const touches = event.getAllTouches();

        if (touches.length > 0) return;

        const p = event.getLocation();

        if (
            !this.isTapWithinMoveThreshold(
                this.touchTapStartX,
                this.touchTapStartY,
                p.x,
                p.y
            )
        ) {
            return;
        }

        this.tryFocusUnitAtScreenPoint(p.x, p.y);
    }

    private onTouchCancel() {
        this.hasTouchTapStart = false;
    }

    private onMouseDown(event: EventMouse) {
        this.hasMouseTapStart = false;

        if (
            this.enableBattlefieldUnitTapFocus &&
            this.state === CinematicState.Idle &&
            this.isPrimaryMouseButton(event)
        ) {
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

    private onMouseUp(event: EventMouse) {
        if (!this.hasMouseTapStart) return;

        this.hasMouseTapStart = false;

        if (this.state !== CinematicState.Idle) return;
        if (this.uiTapSuppressTimer > 0) return;
        if (!this.isPrimaryMouseButton(event)) return;

        const p = event.getLocation();

        if (
            !this.isTapWithinMoveThreshold(
                this.mouseTapStartX,
                this.mouseTapStartY,
                p.x,
                p.y
            )
        ) {
            return;
        }

        this.tryFocusUnitAtScreenPoint(p.x, p.y);
    }

    private tryFocusUnitAtScreenPoint(
        screenX: number,
        screenY: number
    ) {
        if (!this.enableBattlefieldUnitTapFocus) return;
        if (this.state !== CinematicState.Idle) return;

        const unit = this.pickAliveUnitAtScreenPoint(
            screenX,
            screenY
        );

        if (!unit) return;

        this.focusUnit(unit);
    }

    private pickAliveUnitAtScreenPoint(
        screenX: number,
        screenY: number
    ) {
        if (
            !this.screenPointToBattlePlane(
                screenX,
                screenY,
                this.unitTapWorldPoint
            )
        ) {
            return null;
        }

        if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = GameManager.instance;
        }

        if (!this.gameManager) return null;

        let bestUnit: Unit | null = null;
        let bestDistanceSq = Number.POSITIVE_INFINITY;

        const aResult = this.pickClosestAliveUnitInList(
            this.gameManager.getAliveUnits(0),
            this.unitTapWorldPoint.x,
            this.unitTapWorldPoint.z,
            bestDistanceSq
        );

        if (aResult.unit) {
            bestUnit = aResult.unit;
            bestDistanceSq = aResult.distanceSq;
        }

        const bResult = this.pickClosestAliveUnitInList(
            this.gameManager.getAliveUnits(1),
            this.unitTapWorldPoint.x,
            this.unitTapWorldPoint.z,
            bestDistanceSq
        );

        if (bResult.unit) {
            bestUnit = bResult.unit;
        }

        return bestUnit;
    }

    private pickClosestAliveUnitInList(
        units: Unit[],
        x: number,
        z: number,
        maxDistanceSq: number
    ) {
        let bestUnit: Unit | null = null;
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
            const pickRadius = Math.max(
                this.unitTapPickRadius,
                unit.radius
            );

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

    private screenPointToBattlePlane(
        screenX: number,
        screenY: number,
        out: Vec3
    ) {
        if (!this.mainCamera) return false;

        const camera: any = this.mainCamera;
        let ray: any = null;

        if (typeof camera.screenPointToRay !== 'function') {
            return false;
        }

        try {
            ray =
                camera.screenPointToRay(
                    screenX,
                    screenY,
                    this.unitTapRay
                ) || this.unitTapRay;
        } catch (e) {
            ray =
                camera.screenPointToRay(
                    this.unitTapRay,
                    screenX,
                    screenY
                ) || this.unitTapRay;
        }

        const origin = ray.o || ray.origin;
        const dir = ray.d || ray.direction;

        if (!origin || !dir) return false;
        if (Math.abs(dir.y) <= 0.00001) return false;

        const t =
            (this.unitTapPickPlaneY - origin.y) /
            dir.y;

        if (t < 0) return false;

        out.set(
            origin.x + dir.x * t,
            this.unitTapPickPlaneY,
            origin.z + dir.z * t
        );

        return true;
    }

    private isTapWithinMoveThreshold(
        startX: number,
        startY: number,
        endX: number,
        endY: number
    ) {
        const dx = endX - startX;
        const dy = endY - startY;
        const threshold = Math.max(0, this.unitTapMaxMovePixels);

        return dx * dx + dy * dy <= threshold * threshold;
    }

    private isPrimaryMouseButton(event: EventMouse) {
        const mouseEvent: any = event;

        if (typeof mouseEvent.getButton !== 'function') {
            return true;
        }

        return mouseEvent.getButton() === 0;
    }

    private isUnitAlive(unit: Unit | null) {
        if (!unit) return false;
        if (!unit.node.activeInHierarchy) return false;
        if (!unit.props) return false;
        if (unit.props.isDead()) return false;

        return true;
    }

    private smooth01(t: number) {
        const x = this.clamp01(t);
        return x * x * (3 - 2 * x);
    }

    private clamp01(v: number) {
        return Math.max(0, Math.min(1, v));
    }

    private log(msg: string) {
        if (!this.enableDebugLog) return;

        console.log(
            `[BattleCinematic] ${msg}`
        );
    }
}
