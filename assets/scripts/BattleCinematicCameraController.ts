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
    moveSmooth = 4;

    @property
    rotateSmooth = 4;

    @property
    fovSmooth = 6;

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
    useParentLock = true;

    @property
    lockPositionThreshold = 0.12;

    @property
    lockFovThreshold = 0.2;

    @property
    enableDebugLog = true;

    private state: CinematicState = CinematicState.Idle;

    private currentWave: BattleWave | null = null;
    private currentUnit: Unit | null = null;

    private originalParent: Node | null = null;
    private originalPos = new Vec3();
    private originalRot = new Quat();
    private originalFov = 45;

    private tempPos = new Vec3();
    private tempRot = new Quat();

    private targetPos = new Vec3();
    private targetRot = new Quat();

    private exitTapTimer = 0;
    private uiTapSuppressTimer = 0;

    private cameraLockedToRig = false;

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
                this.updateCameraToOrbit(deltaTime);
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

        const unit = wave.getRandomAliveUnit();
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

        this.log(`Focus wave=${wave.id}, unit=${unit.node.name}`);
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

    private captureCurrentCamera() {
        if (!this.mainCamera) return;

        this.originalParent = this.mainCamera.node.parent;

        this.mainCamera.node.getWorldPosition(this.originalPos);
        this.mainCamera.node.getWorldRotation(this.originalRot);

        this.originalFov = this.mainCamera.fov;
    }

    private validateTarget() {
        if (!this.currentWave) {
            this.beginReturnToOriginal();
            return;
        }

        if (this.currentWave.isDead()) {
            if (this.switchWaveWhenCurrentWaveDead) {
                const switchedSameTeam =
                    this.switchToAnotherWave(this.currentWave.team, true);

                if (switchedSameTeam) return;
            }

            if (this.switchToEnemyTeamIfCurrentTeamDead) {
                const enemyTeam = this.currentWave.team === 0 ? 1 : 0;

                const switchedEnemy =
                    this.switchToAnotherWave(enemyTeam, false);

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

            const nextUnit = this.currentWave.getRandomAliveUnit();

            if (nextUnit) {
                this.switchToUnit(this.currentWave, nextUnit);
                return;
            }

            if (this.switchWaveWhenCurrentWaveDead) {
                const switchedSameTeam =
                    this.switchToAnotherWave(this.currentWave.team, true);

                if (switchedSameTeam) return;
            }

            if (this.switchToEnemyTeamIfCurrentTeamDead) {
                const enemyTeam = this.currentWave.team === 0 ? 1 : 0;

                const switchedEnemy =
                    this.switchToAnotherWave(enemyTeam, false);

                if (switchedEnemy) return;
            }

            this.beginReturnToOriginal();
        }
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
            if (!wave.getRandomAliveUnit()) continue;

            candidates.push(wave);
        }

        if (candidates.length <= 0) {
            return false;
        }

        const waveIndex = Math.floor(
            Math.random() * candidates.length
        );

        const nextWave = candidates[waveIndex];
        const nextUnit = nextWave.getRandomAliveUnit();

        if (!nextUnit) return false;

        this.switchToUnit(nextWave, nextUnit);

        return true;
    }

    private switchToUnit(
        wave: BattleWave,
        unit: Unit
    ) {
        if (this.cameraLockedToRig) {
            this.unlockCameraKeepWorld();
        }

        this.currentWave = wave;
        this.currentUnit = unit;

        if (this.orbitRig) {
            this.orbitRig.setTarget(unit);
        }

        this.exitTapTimer = this.exitTapDelay;

        this.log(`Switch unit wave=${wave.id}, unit=${unit.node.name}`);
    }

    private updateCameraToOrbit(deltaTime: number) {
        if (!this.mainCamera || !this.orbitRig) return;

        if (this.cameraLockedToRig) {
            this.applyLockedLocalPose();
            return;
        }

        const orbitCamera = this.orbitRig.getCameraNode();
        if (!orbitCamera) return;

        orbitCamera.getWorldPosition(this.targetPos);
        orbitCamera.getWorldRotation(this.targetRot);

        this.mainCamera.node.getWorldPosition(this.tempPos);
        this.mainCamera.node.getWorldRotation(this.tempRot);

        const moveT =
            1 - Math.exp(-this.moveSmooth * deltaTime);

        const rotT =
            1 - Math.exp(-this.rotateSmooth * deltaTime);

        Vec3.lerp(
            this.tempPos,
            this.tempPos,
            this.targetPos,
            moveT
        );

        Quat.slerp(
            this.tempRot,
            this.tempRot,
            this.targetRot,
            rotT
        );

        this.mainCamera.node.setWorldPosition(this.tempPos);
        this.mainCamera.node.setWorldRotation(this.tempRot);

        const fovT =
            1 - Math.exp(-this.fovSmooth * deltaTime);

        this.mainCamera.fov =
            this.mainCamera.fov +
            (this.orbitRig.getCameraFov() - this.mainCamera.fov) * fovT;

        if (this.useParentLock && this.canLockCameraToRig()) {
            this.lockCameraToRig();
        }
    }

    private canLockCameraToRig() {
        if (!this.mainCamera || !this.orbitRig) return false;

        const orbitCamera = this.orbitRig.getCameraNode();
        if (!orbitCamera) return false;

        orbitCamera.getWorldPosition(this.targetPos);
        this.mainCamera.node.getWorldPosition(this.tempPos);

        const posDistance = Vec3.distance(this.tempPos, this.targetPos);

        const fovDistance =
            Math.abs(this.mainCamera.fov - this.orbitRig.getCameraFov());

        const canLock =
            posDistance <= this.lockPositionThreshold &&
            fovDistance <= this.lockFovThreshold;

        this.log(
            `LockCheck pos=${posDistance.toFixed(3)} fov=${fovDistance.toFixed(3)} can=${canLock}`
        );

        return canLock;
    }

    private lockCameraToRig() {
        if (!this.mainCamera || !this.orbitRig) return;

        const orbitCamera = this.orbitRig.getCameraNode();
        if (!orbitCamera) return;

        this.mainCamera.node.setParent(
            this.orbitRig.node,
            true
        );

        this.cameraLockedToRig = true;

        this.applyLockedLocalPose();

        this.log('LOCKED: MainCamera parent -> OrbitRig');
    }

    private applyLockedLocalPose() {
        if (!this.mainCamera || !this.orbitRig) return;

        const orbitCamera = this.orbitRig.getCameraNode();
        if (!orbitCamera) return;

        this.mainCamera.node.setPosition(
            orbitCamera.position
        );

        this.mainCamera.node.setRotation(
            orbitCamera.rotation
        );

        this.mainCamera.fov =
            this.orbitRig.getCameraFov();
    }

    private unlockCameraKeepWorld() {
        if (!this.mainCamera) return;

        this.mainCamera.node.setParent(
            this.originalParent,
            true
        );

        this.cameraLockedToRig = false;

        this.log('UNLOCKED: MainCamera parent -> originalParent');
    }

    private beginReturnToOriginal() {
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

    private updateReturnToOriginal(deltaTime: number) {
        if (!this.mainCamera) {
            this.finishReturn();
            return;
        }

        this.mainCamera.node.getWorldPosition(this.tempPos);
        this.mainCamera.node.getWorldRotation(this.tempRot);

        const moveT =
            1 - Math.exp(-this.returnMoveSmooth * deltaTime);

        const rotT =
            1 - Math.exp(-this.returnRotateSmooth * deltaTime);

        Vec3.lerp(
            this.tempPos,
            this.tempPos,
            this.originalPos,
            moveT
        );

        Quat.slerp(
            this.tempRot,
            this.tempRot,
            this.originalRot,
            rotT
        );

        this.mainCamera.node.setWorldPosition(this.tempPos);
        this.mainCamera.node.setWorldRotation(this.tempRot);

        const fovT =
            1 - Math.exp(-this.returnFovSmooth * deltaTime);

        this.mainCamera.fov =
            this.mainCamera.fov +
            (this.originalFov - this.mainCamera.fov) * fovT;

        const posDone =
            Vec3.distance(
                this.tempPos,
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
        this.cameraLockedToRig = false;

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

    private log(msg: string) {
        if (!this.enableDebugLog) return;

        console.log(
            `[BattleCinematic] ${msg}`
        );
    }
}