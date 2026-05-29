import { _decorator, Component, MeshRenderer } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HealthBar3D')
export class HealthBar3D extends Component {

    @property
    hideWhenFull = true;

    private renderer: MeshRenderer | null = null;
    private currentRatio = 1;

    onLoad() {
        this.renderer = this.getComponent(MeshRenderer);
        this.setHealthRatio(1);
    }

    setHealthRatio(ratio: number) {
        this.currentRatio = Math.max(0, Math.min(1, ratio));

        if (this.hideWhenFull) {
            this.node.active = this.currentRatio < 0.999;
        }

        if (!this.renderer) return;

        this.renderer.setInstancedAttribute(
            'a_health_params',
            [
                this.currentRatio,
                0,
                0,
                0
            ]
        );
    }

    getHealthRatio() {
        return this.currentRatio;
    }
}