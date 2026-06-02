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
    followSmooth = 12;

    @property
    heightOffset = 0;

    @property
    cameraFov = 35;

    @property
    enableOrbit = true;

    @property
    snapToTargetOnFirstFocus = true;

    @property
    snapToTargetOnSwitch = false;

    @property
    resetOrbitAngleOnNewTarget = false;

    @property
    enableDebugLog = false;

    private targetUnit: Unit | null = null;

    private currentPos = new Vec3();
    private targetPos = new Vec3();
    private currentEuler = new Vec3();

    private hasTargetBefore = false;

    onLoad() {
        this.node.getWorldPosition(this.currentPos);
        this.currentEuler.set(this.node.eulerAngles);
    }

    update(deltaTime: number) {
        if (!this.targetUnit) return;

        if (
            !this.targetUnit.node ||
            !this.targetUnit.node.activeInHierarchy
        ) {
            return;
        }

        this.targetUnit.node.getWorldPosition(this.targetPos);
        this.targetPos.y += this.heightOffset;

        this.node.getWorldPosition(this.currentPos);

        const t =
            1 - Math.exp(-this.followSmooth * deltaTime);

        Vec3.lerp(
            this.currentPos,
            this.currentPos,
            this.targetPos,
            t
        );

        this.node.setWorldPosition(this.currentPos);

        if (this.enableOrbit) {
            this.currentEuler.set(this.node.eulerAngles);
            this.currentEuler.y += this.orbitSpeed * deltaTime;
            this.node.setRotationFromEuler(this.currentEuler);
        }
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

        unit.node.getWorldPosition(this.targetPos);
        this.targetPos.y += this.heightOffset;

        const shouldSnap =
            (!isSwitching && this.snapToTargetOnFirstFocus) ||
            (isSwitching && this.snapToTargetOnSwitch);

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

    public clearTarget() {
        this.targetUnit = null;
        this.hasTargetBefore = false;
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

    public isCloseToTarget(threshold: number) {
        if (!this.targetUnit) return false;

        this.targetUnit.node.getWorldPosition(this.targetPos);
        this.targetPos.y += this.heightOffset;

        this.node.getWorldPosition(this.currentPos);

        return Vec3.distance(this.currentPos, this.targetPos) <= threshold;
    }

    private log(msg: string) {
        if (!this.enableDebugLog) return;

        console.log(
            `[CinematicOrbitRig] ${msg}`
        );
    }
}