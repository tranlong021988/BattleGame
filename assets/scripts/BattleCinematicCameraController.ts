import {
    _decorator,
    Camera,
    Component,
    EventMouse,
    EventTouch,
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
    returnMoveSmooth = 6;

    @property
    returnRotateSmooth = 6;

    @property
    returnFovSmooth = 6;

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
    enableDebugLog = false;

    private state: CinematicState = CinematicState.Idle;

    private currentWave: BattleWave | null = null;
    private currentUnit: Unit | null = null;

    private originalParent: Node | null = null;
    private originalPos = new Vec3();
    private originalRot = new Quat();
    private originalFov = 45;

    private tempWorldPos = new Vec3();
    private tempWorldRot = new Quat();

    private startLocalPos = new Vec3();
    private startLocalRot = new Quat();
    private startFov = 45;

    private currentLocalPos = new Vec3();
    private currentLocalRot = new Quat();

    private targetLocalPos = new Vec3();
    private targetLocalRot = new Quat();

    private exitTapTimer = 0;
    private uiTapSuppressTimer = 0;

    private enterTimer = 0;

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

    public onUnitWillDespawn(unit: Unit | null) {
        if (!unit) return;
        if (this.state !== CinematicState.Orbit) return;
        if (this.currentUnit !== unit) return;

        this.log(`Focused unit will despawn: ${unit.node.name}`);

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
            this.beginReturnToOriginal();
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

        if (this.mainCamera) {
            this.mainCamera.node.setParent(
                this.originalParent,
                true
            );
        }

        this.state = CinematicState.Returning;

        this.currentWave = null;
        this.currentUnit = null;

        if (this.orbitRig) {
            this.orbitRig.clearTarget();
        }

        this.log('Begin smooth return');
    }

    private updateReturnToOriginal(deltaTime: number) {
        if (!this.mainCamera) {
            this.finishReturn();
            return;
        }

        this.mainCamera.node.getWorldPosition(this.tempWorldPos);
        this.mainCamera.node.getWorldRotation(this.tempWorldRot);

        const moveT =
            1 - Math.exp(-this.returnMoveSmooth * deltaTime);

        const rotT =
            1 - Math.exp(-this.returnRotateSmooth * deltaTime);

        Vec3.lerp(
            this.tempWorldPos,
            this.tempWorldPos,
            this.originalPos,
            moveT
        );

        Quat.slerp(
            this.tempWorldRot,
            this.tempWorldRot,
            this.originalRot,
            rotT
        );

        this.mainCamera.node.setWorldPosition(this.tempWorldPos);
        this.mainCamera.node.setWorldRotation(this.tempWorldRot);

        const fovT =
            1 - Math.exp(-this.returnFovSmooth * deltaTime);

        this.mainCamera.fov =
            this.mainCamera.fov +
            (this.originalFov - this.mainCamera.fov) * fovT;

        const posDone =
            Vec3.distance(
                this.tempWorldPos,
                this.originalPos
            ) <= this.returnPositionThreshold;

        const fovDone =
            Math.abs(
                this.mainCamera.fov - this.originalFov
            ) <= this.returnFovThreshold;

        if (posDone && fovDone) {
            this.mainCamera.node.setParent(
                this.originalParent,
                true
            );

            this.mainCamera.node.setWorldPosition(this.originalPos);
            this.mainCamera.node.setWorldRotation(this.originalRot);
            this.mainCamera.fov = this.originalFov;

            this.finishReturn();
        }
    }

    private finishReturn() {
        this.state = CinematicState.Idle;

        this.currentWave = null;
        this.currentUnit = null;

        if (this.topDownCameraDrag) {
            this.topDownCameraDrag.enabled = true;
        }

        this.log('Return finished');
    }

    private onTouchStart(event: EventTouch) {
        if (!this.tapAnywhereToExit) return;
        if (this.state !== CinematicState.Orbit) return;
        if (this.exitTapTimer > 0) return;
        if (this.uiTapSuppressTimer > 0) return;

        this.beginReturnToOriginal();
    }

    private onMouseDown(event: EventMouse) {
        if (!this.tapAnywhereToExit) return;
        if (this.state !== CinematicState.Orbit) return;
        if (this.exitTapTimer > 0) return;
        if (this.uiTapSuppressTimer > 0) return;

        this.beginReturnToOriginal();
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