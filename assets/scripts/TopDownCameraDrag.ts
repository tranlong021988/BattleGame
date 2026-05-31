import {
    _decorator,
    Component,
    Camera,
    Vec3,
    input,
    Input,
    EventTouch,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TopDownCameraDrag')
export class TopDownCameraDrag extends Component {

    @property(Camera)
    targetCamera: Camera | null = null;

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

    @property
    enablePinchZoom = true;

    @property
    minFov = 25;

    @property
    maxFov = 60;

    @property
    pinchSensitivity = 0.08;

    @property
    zoomSmoothSpeed = 12;

    private targetPos = new Vec3();
    private currentPos = new Vec3();

    private isDragging = false;
    private isPinching = false;

    private lastPinchDistance = 0;
    private targetFov = 45;

    onEnable() {
        this.node.getWorldPosition(this.targetPos);

        if (this.targetCamera) {
            this.targetFov = this.targetCamera.fov;
        }

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

        if (this.targetCamera) {
            this.targetFov = this.targetCamera.fov;
        }
    }

    private onTouchStart(event: EventTouch) {
        const touches = event.getAllTouches();

        if (touches.length >= 2) {
            this.isDragging = false;
            this.isPinching = true;
            this.lastPinchDistance = this.getTouchDistance(touches);
            return;
        }

        this.isDragging = true;
        this.isPinching = false;
        this.node.getWorldPosition(this.targetPos);
    }

    private onTouchMove(event: EventTouch) {
        const touches = event.getAllTouches();

        if (
            this.enablePinchZoom &&
            this.targetCamera &&
            touches.length >= 2
        ) {
            this.handlePinchZoom(touches);
            return;
        }

        if (touches.length === 1) {
            if (this.isPinching) {
                this.isPinching = false;
                this.isDragging = true;
                this.node.getWorldPosition(this.targetPos);
                return;
            }

            this.handleDrag(event);
        }
    }

    private onTouchEnd(event: EventTouch) {
        const touches = event.getAllTouches();

        if (touches.length >= 2) {
            this.isPinching = true;
            this.isDragging = false;
            this.lastPinchDistance = this.getTouchDistance(touches);
            return;
        }

        if (touches.length === 1) {
            this.isPinching = false;
            this.isDragging = true;
            this.node.getWorldPosition(this.targetPos);
            return;
        }

        this.isDragging = false;
        this.isPinching = false;
        this.lastPinchDistance = 0;
    }

    private handleDrag(event: EventTouch) {
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

    private handlePinchZoom(touches: any[]) {
        if (!this.targetCamera) return;

        const dist = this.getTouchDistance(touches);

        if (this.lastPinchDistance <= 0) {
            this.lastPinchDistance = dist;
            return;
        }

        const delta = dist - this.lastPinchDistance;

        // Hai ngón tách xa nhau => zoom in => FOV nhỏ lại
        this.targetFov -= delta * this.pinchSensitivity;

        this.targetFov = this.clamp(
            this.targetFov,
            this.minFov,
            this.maxFov
        );

        this.lastPinchDistance = dist;
    }

    update(deltaTime: number) {
        this.updatePosition(deltaTime);
        this.updateZoom(deltaTime);
    }

    private updatePosition(deltaTime: number) {
        this.node.getWorldPosition(this.currentPos);

        const t = 1 - Math.exp(-this.smoothSpeed * deltaTime);

        const newX =
            this.currentPos.x +
            (this.targetPos.x - this.currentPos.x) * t;

        const newY = this.currentPos.y;

        const newZ =
            this.currentPos.z +
            (this.targetPos.z - this.currentPos.z) * t;

        this.currentPos.set(newX, newY, newZ);
        this.node.setWorldPosition(this.currentPos);
    }

    private updateZoom(deltaTime: number) {
        if (!this.targetCamera) return;

        const t = 1 - Math.exp(-this.zoomSmoothSpeed * deltaTime);

        this.targetCamera.fov =
            this.targetCamera.fov +
            (this.targetFov - this.targetCamera.fov) * t;
    }

    private getTouchDistance(touches: any[]) {
        if (touches.length < 2) return 0;

        const p0 = touches[0].getLocation();
        const p1 = touches[1].getLocation();

        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    private clamp(value: number, min: number, max: number) {
        return Math.max(min, Math.min(max, value));
    }
}