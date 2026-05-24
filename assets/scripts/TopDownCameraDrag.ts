import { _decorator, Component, input, Input, EventTouch, EventMouse, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TopDownCameraDrag')
export class TopDownCameraDrag extends Component {

    @property
    enableTouch = true;

    @property
    enableMouse = true;

    @property
    minZ = -30;

    @property
    maxZ = 30;

    @property
    dragSensitivity = 0.05;

    @property
    smoothSpeed = 10;

    @property
    invertDrag = false;

    private targetZ = 0;
    private dragging = false;

    private tempPos = new Vec3();

    onEnable() {
        this.targetZ = this.node.worldPosition.z;

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    private onTouchStart(event: EventTouch) {
        if (!this.enableTouch) return;
        this.dragging = true;
    }

    private onTouchMove(event: EventTouch) {
        if (!this.enableTouch) return;
        if (!this.dragging) return;

        const delta = event.getDelta();

        this.applyDragDelta(delta.y);
    }

    private onTouchEnd(event: EventTouch) {
        if (!this.enableTouch) return;
        this.dragging = false;
    }

    private onMouseDown(event: EventMouse) {
        if (!this.enableMouse) return;

        if (event.getButton() !== EventMouse.BUTTON_LEFT) {
            return;
        }

        this.dragging = true;
    }

    private onMouseMove(event: EventMouse) {
        if (!this.enableMouse) return;
        if (!this.dragging) return;

        const delta = event.getDelta();

        this.applyDragDelta(delta.y);
    }

    private onMouseUp(event: EventMouse) {
        if (!this.enableMouse) return;
        this.dragging = false;
    }

    private applyDragDelta(deltaY: number) {
        const dir = this.invertDrag ? -1 : 1;

        this.targetZ += deltaY * this.dragSensitivity * dir;
        this.targetZ = this.clamp(this.targetZ, this.minZ, this.maxZ);
    }

    update(deltaTime: number) {
        const current = this.node.worldPosition;

        const t = 1 - Math.exp(-this.smoothSpeed * deltaTime);
        const newZ = current.z + (this.targetZ - current.z) * t;

        this.tempPos.set(current.x, current.y, newZ);
        this.node.setWorldPosition(this.tempPos);
    }

    public setTargetZ(z: number) {
        this.targetZ = this.clamp(z, this.minZ, this.maxZ);
    }

    public jumpToZ(z: number) {
        this.targetZ = this.clamp(z, this.minZ, this.maxZ);

        const current = this.node.worldPosition;
        this.tempPos.set(current.x, current.y, this.targetZ);
        this.node.setWorldPosition(this.tempPos);
    }

    private clamp(v: number, min: number, max: number) {
        return Math.max(min, Math.min(max, v));
    }
}