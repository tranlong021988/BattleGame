import {
    _decorator,
    Component,
    Camera,
    Vec3,
    input,
    Input,
    EventTouch,
    EventMouse,
    view,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('TopDownCameraDrag')
export class TopDownCameraDrag extends Component {

    @property(Camera)
    targetCamera: Camera | null = null;

    @property enableDragX = true;
    @property enableDragZ = true;

    @property minX = -20;
    @property maxX = 20;
    @property minZ = -20;
    @property maxZ = 20;

    @property expandBoundsWhenZoomIn = true;
    @property maxBoundsExpandMultiplier = 2.5;

    @property dragSensitivity = 0.03;
    @property smoothSpeed = 12;

    @property invertX = false;
    @property invertZ = false;

    @property enablePinchZoom = true;
    @property enableMouseWheelZoom = true;

    @property minFov = 25;
    @property maxFov = 60;

    @property pinchSensitivity = 0.08;
    @property mouseWheelSensitivity = 0.03;
    @property zoomSmoothSpeed = 12;

    @property zoomToPointer = true;

    @property
    zoomPointerMoveStrength = 8;

    @property
    invertZoomPointerX = false;

    @property
    invertZoomPointerZ = false;

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
        input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    onDisable() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
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

    private onMouseWheel(event: EventMouse) {
        if (!this.enableMouseWheelZoom) return;
        if (!this.targetCamera) return;

        const scrollY = event.getScrollY();

        if (Math.abs(scrollY) < 0.0001) return;

        const p = event.getLocation();

        this.zoomAtScreenPoint(
            p.x,
            p.y,
            scrollY * this.mouseWheelSensitivity
        );
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

        this.clampTargetPosition();
    }

    private handlePinchZoom(touches: any[]) {
        if (!this.targetCamera) return;

        const dist = this.getTouchDistance(touches);

        if (this.lastPinchDistance <= 0) {
            this.lastPinchDistance = dist;
            return;
        }

        const delta = dist - this.lastPinchDistance;
        const center = this.getTouchCenter(touches);

        this.zoomAtScreenPoint(
            center.x,
            center.y,
            delta * this.pinchSensitivity
        );

        this.lastPinchDistance = dist;
    }

    private zoomAtScreenPoint(
        screenX: number,
        screenY: number,
        zoomDelta: number
    ) {
        if (!this.targetCamera) return;

        const oldFov = this.targetFov;

        // Pinch out / wheel up => zoom in => FOV nhỏ lại.
        this.targetFov -= zoomDelta;

        this.targetFov = this.clamp(
            this.targetFov,
            this.minFov,
            this.maxFov
        );

        const fovChange = oldFov - this.targetFov;

        if (
            this.zoomToPointer &&
            Math.abs(fovChange) > 0.0001
        ) {
            this.applyZoomPointerBias(
                screenX,
                screenY,
                fovChange
            );
        }

        this.clampTargetPosition();
    }

    private applyZoomPointerBias(
        screenX: number,
        screenY: number,
        fovChange: number
    ) {
        const size = view.getVisibleSize();

        if (size.width <= 0 || size.height <= 0) {
            return;
        }

        const normalizedX =
            (screenX / size.width - 0.5) * 2;

        const normalizedY =
            (screenY / size.height - 0.5) * 2;

        const fovRange = Math.max(
            0.0001,
            this.maxFov - this.minFov
        );

        const zoomAmount = fovChange / fovRange;

        let moveX =
            normalizedX *
            zoomAmount *
            this.zoomPointerMoveStrength;

        let moveZ =
            normalizedY *
            zoomAmount *
            this.zoomPointerMoveStrength;

        if (this.invertZoomPointerX) {
            moveX = -moveX;
        }

        if (this.invertZoomPointerZ) {
            moveZ = -moveZ;
        }

        if (this.enableDragX) {
            this.targetPos.x += moveX;
        }

        if (this.enableDragZ) {
            this.targetPos.z += moveZ;
        }
    }

    update(deltaTime: number) {
        this.updatePosition(deltaTime);
        this.updateZoom(deltaTime);
    }

    private updatePosition(deltaTime: number) {
        this.node.getWorldPosition(this.currentPos);

        this.clampTargetPosition();

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

    private clampTargetPosition() {
        const bounds = this.getDynamicBounds();

        this.targetPos.x = this.clamp(
            this.targetPos.x,
            bounds.minX,
            bounds.maxX
        );

        this.targetPos.z = this.clamp(
            this.targetPos.z,
            bounds.minZ,
            bounds.maxZ
        );
    }

    private getDynamicBounds() {
        if (
            !this.expandBoundsWhenZoomIn ||
            !this.targetCamera ||
            this.maxFov <= this.minFov
        ) {
            return {
                minX: this.minX,
                maxX: this.maxX,
                minZ: this.minZ,
                maxZ: this.maxZ
            };
        }

        const zoom01 = this.clamp(
            (this.maxFov - this.targetCamera.fov) /
            (this.maxFov - this.minFov),
            0,
            1
        );

        const expandMultiplier =
            1 +
            zoom01 *
            (Math.max(1, this.maxBoundsExpandMultiplier) - 1);

        const centerX = (this.minX + this.maxX) * 0.5;
        const centerZ = (this.minZ + this.maxZ) * 0.5;

        const halfX =
            (this.maxX - this.minX) *
            0.5 *
            expandMultiplier;

        const halfZ =
            (this.maxZ - this.minZ) *
            0.5 *
            expandMultiplier;

        return {
            minX: centerX - halfX,
            maxX: centerX + halfX,
            minZ: centerZ - halfZ,
            maxZ: centerZ + halfZ
        };
    }

    private getTouchDistance(touches: any[]) {
        if (touches.length < 2) return 0;

        const p0 = touches[0].getLocation();
        const p1 = touches[1].getLocation();

        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    private getTouchCenter(touches: any[]) {
        const p0 = touches[0].getLocation();
        const p1 = touches[1].getLocation();

        return {
            x: (p0.x + p1.x) * 0.5,
            y: (p0.y + p1.y) * 0.5
        };
    }

    private clamp(value: number, min: number, max: number) {
        return Math.max(min, Math.min(max, value));
    }
}