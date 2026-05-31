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

    onLoad() {
        this.renderer = this.getComponent(MeshRenderer);
        this.applyAll();
    }

    onEnable() {
        this.renderer = this.getComponent(MeshRenderer);
        this.applyAll();
    }

    setHealthRatio(ratio: number) {
        this.currentRatio = Math.max(0, Math.min(1, ratio));
        this.applyAll();
    }

    setMainColor(color: Color) {
        this.mainColor.set(color);
        this.applyAll();
    }

    getHealthRatio() {
        return this.currentRatio;
    }

    private applyAll() {
        if (!this.renderer) return;

        const shouldShow =
            !this.hideWhenFull ||
            this.currentRatio < 0.999;

        this.renderer.enabled = shouldShow;

        this.renderer.setInstancedAttribute(
            'a_health_params',
            [
                this.currentRatio,
                shouldShow ? 1 : 0,
                0,
                0
            ]
        );

        this.renderer.setInstancedAttribute(
            'a_bar_color',
            [
                this.mainColor.r / 255,
                this.mainColor.g / 255,
                this.mainColor.b / 255,
                1
            ]
        );
    }
}