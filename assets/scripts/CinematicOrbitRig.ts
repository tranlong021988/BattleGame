import {
    _decorator,
    Component,
    Node,
    Vec3,
} from 'cc';

import { Unit } from './Unit';

const { ccclass, property } = _decorator;

@ccclass('CinematicOrbitRig')
export class CinematicOrbitRig extends Component {

    @property(Node)
    orbitCamera: Node | null = null;

    @property
    orbitSpeed = 20;

    @property
    firstFocusLocalMoveSmooth = 8;

    @property
    switchTargetLocalMoveSmooth = 3;

    @property
    heightOffset = 0;

    @property
    cameraFov = 35;

    @property
    enableOrbit = true;

    @property
    enableDebugLog = false;

    private targetUnit: Unit | null = null;
    private originalParent: Node | null = null;

    private targetLocalPos = new Vec3();
    private currentLocalPos = new Vec3();
    private currentEuler = new Vec3();

    private hasTargetBefore = false;
    private currentMoveSmooth = 8;

    onLoad() {
        this.originalParent = this.node.parent;
        this.currentEuler.set(this.node.eulerAngles);
    }

    update(deltaTime: number) {
        if (!this.targetUnit) return;

        this.updateLocalMove(deltaTime);
        this.updateOrbit(deltaTime);
    }

    public setTarget(unit: Unit | null) {
        if (!unit) {
            this.clearTarget();
            return;
        }

        const isSwitching =
            this.hasTargetBefore &&
            this.targetUnit !== unit;

        this.targetUnit = unit;
        this.hasTargetBefore = true;

        this.currentMoveSmooth = isSwitching
            ? this.switchTargetLocalMoveSmooth
            : this.firstFocusLocalMoveSmooth;

        this.node.setParent(unit.node, true);

        this.targetLocalPos.set(
            0,
            this.heightOffset,
            0
        );

        this.log(
            `Set target=${unit.node.name}, switching=${isSwitching}, smooth=${this.currentMoveSmooth}`
        );
    }

    public clearTarget() {
        this.targetUnit = null;
        this.hasTargetBefore = false;

        if (this.originalParent) {
            this.node.setParent(this.originalParent, true);
        }
    }

    public getTargetUnit() {
        return this.targetUnit;
    }

    public getCameraNode() {
        return this.orbitCamera;
    }

    public getCameraFov() {
        return this.cameraFov;
    }

    private updateLocalMove(deltaTime: number) {
        this.currentLocalPos.set(this.node.position);

        const t =
            1 - Math.exp(-this.currentMoveSmooth * deltaTime);

        Vec3.lerp(
            this.currentLocalPos,
            this.currentLocalPos,
            this.targetLocalPos,
            t
        );

        this.node.setPosition(this.currentLocalPos);
    }

    private updateOrbit(deltaTime: number) {
        if (!this.enableOrbit) return;

        this.currentEuler.set(this.node.eulerAngles);
        this.currentEuler.y += this.orbitSpeed * deltaTime;

        this.node.setRotationFromEuler(this.currentEuler);
    }

    private log(msg: string) {
        if (!this.enableDebugLog) return;

        console.log(
            `[CinematicOrbitRig] ${msg}`
        );
    }
}