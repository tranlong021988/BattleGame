import { _decorator, Component, Node, Vec3, input, Input, EventTouch } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TopDownCameraDrag')
export class TopDownCameraDrag extends Component {

    @property
    enableDragX = true;

    @property
    enableDragZ = true;

    @property
    minX = -20;

    @property
    maxX = 20;

    @property
    minZ = -20;

    @property
    maxZ = 20;

    @property
    dragSensitivity = 0.03;

    @property
    smoothSpeed = 12;

    @property
    invertX = false;

    @property
    invertZ = false;

    private targetPos = new Vec3();
    private currentPos = new Vec3();

    private isDragging = false;

    onEnable() {
        this.node.getWorldPosition(this.targetPos);

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    start() {
        this.node.getWorldPosition(this.targetPos);
    }

    private onTouchStart(event: EventTouch) {
        this.isDragging = true;
        this.node.getWorldPosition(this.targetPos);
    }

    private onTouchMove(event: EventTouch) {
        if (!this.isDragging) return;

        const delta = event.getDelta();

        let moveX = delta.x * this.dragSensitivity;
        let moveZ = delta.y * this.dragSensitivity;

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

        this.targetPos.x = this.clamp(
            this.targetPos.x,
            this.minX,
            this.maxX
        );

        this.targetPos.z = this.clamp(
            this.targetPos.z,
            this.minZ,
            this.maxZ
        );
    }

    private onTouchEnd(event: EventTouch) {
        this.isDragging = false;
    }

    update(deltaTime: number) {
        this.node.getWorldPosition(this.currentPos);

        const t = 1 - Math.exp(-this.smoothSpeed * deltaTime);

        const newX = this.currentPos.x + (this.targetPos.x - this.currentPos.x) * t;
        const newY = this.currentPos.y;
        const newZ = this.currentPos.z + (this.targetPos.z - this.currentPos.z) * t;

        this.currentPos.set(newX, newY, newZ);
        this.node.setWorldPosition(this.currentPos);
    }

    private clamp(value: number, min: number, max: number) {
        return Math.max(min, Math.min(max, value));
    }
}