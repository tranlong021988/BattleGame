import { _decorator, Component, MeshRenderer, Color } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HealthBar3D')
export class HealthBar3D extends Component {

    @property
    hideWhenFull = true;

    @property(Color)
    mainColor: Color = new Color(0, 255, 40, 255);

    private renderer: MeshRenderer | null = null;
    private currentRatio = 1;
    private displayActive = true;
    private healthParams = [1, 0, 0, 0];
    private barColor = [0, 1, 0, 1];
    private colorDirty = true;

    onLoad() {
        this.renderer = this.getComponent(MeshRenderer);
        this.applyAll();
    }

    onEnable() {
        this.renderer = this.getComponent(MeshRenderer);
        this.applyAll();
    }

    setHealthRatio(ratio: number) {
        const nextRatio =
            Math.max(0, Math.min(1, ratio));

        if (
            Math.abs(this.currentRatio - nextRatio) <=
            0.0001
        ) {
            return;
        }

        this.currentRatio = nextRatio;
        this.applyHealthParams();
    }

    setDisplayActive(active: boolean) {
        if (this.displayActive === active) {
            return;
        }

        this.displayActive = active;
        this.applyHealthParams();
    }

    setMainColor(color: Color) {
        if (
            this.mainColor.r === color.r &&
            this.mainColor.g === color.g &&
            this.mainColor.b === color.b &&
            this.mainColor.a === color.a
        ) {
            return;
        }

        this.mainColor.set(color);
        this.colorDirty = true;
        this.applyColor();
    }

    getHealthRatio() {
        return this.currentRatio;
    }

    private applyAll() {
        if (!this.renderer) return;

        this.applyHealthParams();
        this.applyColor();
    }

    private applyHealthParams() {
        if (!this.renderer) return;

        const shouldShow =
            this.displayActive &&
            (
                !this.hideWhenFull ||
                this.currentRatio < 0.999
            );
        const wasShowing =
            this.renderer.enabled;

        if (wasShowing !== shouldShow) {
            this.renderer.enabled = shouldShow;
        }

        this.healthParams[0] = this.currentRatio;
        this.healthParams[1] = shouldShow ? 1 : 0;
        this.healthParams[2] = 0;
        this.healthParams[3] = 0;

        this.renderer.setInstancedAttribute(
            'a_health_params',
            this.healthParams
        );

        if (shouldShow && (!wasShowing || this.colorDirty)) {
            this.applyColor();
        }
    }

    private applyColor() {
        if (!this.renderer) return;

        this.barColor[0] = this.mainColor.r / 255;
        this.barColor[1] = this.mainColor.g / 255;
        this.barColor[2] = this.mainColor.b / 255;
        this.barColor[3] = 1;

        this.renderer.setInstancedAttribute(
            'a_bar_color',
            this.barColor
        );

        this.colorDirty = false;
    }
}
