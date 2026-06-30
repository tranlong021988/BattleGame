import { _decorator, Color, Component, MeshRenderer } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BillboardTint3D')
export class BillboardTint3D extends Component {

    @property({
        tooltip: 'Per-object billboard tint sent as an instanced attribute. This avoids creating unique material instances.'
    })
    tint: Color = new Color(255, 255, 255, 255);

    @property({
        tooltip: 'Per-object background color sent as an instanced attribute. Transparent texture pixels are composited over this color.'
    })
    backgroundColor: Color = new Color(0, 0, 0, 0);

    private renderer: MeshRenderer | null = null;
    private tintParams = [1, 1, 1, 1];
    private backgroundParams = [0, 0, 0, 0];

    onLoad() {
        this.renderer = this.getComponent(MeshRenderer);
        this.applyTint();
    }

    onEnable() {
        this.renderer = this.getComponent(MeshRenderer);
        this.applyTint();
    }

    public setTint(color: Color) {
        this.tint.set(color);
        this.applyTint();
    }

    public setBackgroundColor(color: Color) {
        this.backgroundColor.set(color);
        this.applyBackgroundColor();
    }

    private applyTint() {
        if (!this.renderer) return;

        this.tintParams[0] = this.tint.r / 255;
        this.tintParams[1] = this.tint.g / 255;
        this.tintParams[2] = this.tint.b / 255;
        this.tintParams[3] = this.tint.a / 255;

        this.renderer.setInstancedAttribute(
            'a_billboard_tint',
            this.tintParams
        );

        this.applyBackgroundColor();
    }

    private applyBackgroundColor() {
        if (!this.renderer) return;

        this.backgroundParams[0] = this.backgroundColor.r / 255;
        this.backgroundParams[1] = this.backgroundColor.g / 255;
        this.backgroundParams[2] = this.backgroundColor.b / 255;
        this.backgroundParams[3] = this.backgroundColor.a / 255;

        this.renderer.setInstancedAttribute(
            'a_billboard_bg_color',
            this.backgroundParams
        );
    }
}
