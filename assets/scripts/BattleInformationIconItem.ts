import {
    _decorator,
    Component,
    Sprite,
    SpriteFrame,
    UIOpacity,
    UITransform,
    Vec3,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('BattleInformationIconItem')
export class BattleInformationIconItem extends Component {

    @property(Sprite)
    iconSprite: Sprite | null = null;

    @property
    iconWidth = 40;

    @property
    iconHeight = 40;

    @property
    minVisibleScaleY = 0.05;

    @property
    blinkEnabled = true;

    @property
    blinkSpeed = 8;

    @property
    blinkMinOpacity = 100;

    @property
    blinkMaxOpacity = 255;

    private opacity: UIOpacity | null = null;
    private baseScale = new Vec3(1, 1, 1);

    onLoad() {
        this.initComponents();
    }

    public setup(
        spriteFrame: SpriteFrame | null,
        width: number,
        height: number
    ) {
        this.iconWidth = width;
        this.iconHeight = height;

        this.initComponents();

        const ui = this.getComponent(UITransform);

        if (ui) {
            ui.setContentSize(this.iconWidth, this.iconHeight);
            ui.setAnchorPoint(0.5, 0.5);
        }

        if (this.iconSprite) {
            this.iconSprite.sizeMode = Sprite.SizeMode.CUSTOM;
            this.iconSprite.spriteFrame = spriteFrame;
            this.iconSprite.sizeMode = Sprite.SizeMode.CUSTOM;
        }

        if (ui) {
            ui.setContentSize(this.iconWidth, this.iconHeight);
        }

        if (this.opacity) {
            this.opacity.opacity = 255;
        }

        this.baseScale.set(1, 1, 1);
        this.node.setScale(this.baseScale);
    }

    public setAliveRatio(ratio: number) {
        const r = this.clamp01(ratio);

        if (r <= 0) {
            this.node.setScale(
                this.baseScale.x,
                0,
                this.baseScale.z
            );
            return;
        }

        const visualScaleY = Math.max(
            this.minVisibleScaleY,
            r
        );

        this.node.setScale(
            this.baseScale.x,
            this.baseScale.y * visualScaleY,
            this.baseScale.z
        );
    }

    public updateEngageVisual(isEngaged: boolean, time: number) {
        if (!this.opacity) return;

        if (!this.blinkEnabled || !isEngaged) {
            this.opacity.opacity = 255;
            return;
        }

        const t =
            (Math.sin(time * this.blinkSpeed) + 1) * 0.5;

        this.opacity.opacity =
            this.blinkMinOpacity +
            (this.blinkMaxOpacity - this.blinkMinOpacity) * t;
    }

    public resetVisual() {
        if (this.opacity) {
            this.opacity.opacity = 255;
        }

        this.node.setScale(this.baseScale);
    }

    private initComponents() {
        if (!this.iconSprite) {
            this.iconSprite = this.getComponent(Sprite);
        }

        if (this.iconSprite) {
            this.iconSprite.sizeMode = Sprite.SizeMode.CUSTOM;
        }

        this.opacity = this.getComponent(UIOpacity);

        if (!this.opacity) {
            this.opacity = this.node.addComponent(UIOpacity);
        }

        const ui = this.getComponent(UITransform);

        if (ui) {
            ui.setContentSize(this.iconWidth, this.iconHeight);
            ui.setAnchorPoint(0.5, 0.5);
        }
    }

    private clamp01(v: number) {
        return Math.max(0, Math.min(1, v));
    }
}