import {
    _decorator,
    Color,
    Component,
    Sprite,
    SpriteFrame,
    UITransform,
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
    minVisibleHeightRatio = 0.05;

    @property
    flashEnabled = true;

    @property
    flashSpeed = 10;

    @property(Color)
    normalColor: Color = new Color(255, 255, 255, 255);

    @property(Color)
    engageFlashColor: Color = new Color(255, 60, 60, 255);

    private uiTransform: UITransform | null = null;
    private iconTransform: UITransform | null = null;

    private originalWidth = 40;
    private originalHeight = 40;
    private tempColor = new Color();
    private flipX = false;

    onLoad() {
        this.initComponents();
    }

    public setup(
        spriteFrame: SpriteFrame | null,
        width: number,
        height: number,
        anchorY: number,
        flipX: boolean = false,
        normalColor: Color | null = null,
        engageFlashColor: Color | null = null
    ) {
        this.iconWidth = width;
        this.iconHeight = height;

        this.originalWidth = width;
        this.originalHeight = height;
        this.flipX = flipX;

        if (normalColor) {
            this.copyColor(
                normalColor,
                this.normalColor
            );
        }

        if (engageFlashColor) {
            this.copyColor(
                engageFlashColor,
                this.engageFlashColor
            );
        }

        this.initComponents();

        if (this.iconSprite) {
            this.iconSprite.sizeMode =
                Sprite.SizeMode.CUSTOM;

            this.iconSprite.spriteFrame =
                spriteFrame;

            this.iconSprite.color =
                this.normalColor;
        }

        if (this.uiTransform) {
            this.uiTransform.setContentSize(
                this.originalWidth,
                this.originalHeight
            );

            this.uiTransform.setAnchorPoint(
                0.5,
                anchorY
            );
        }

        this.applyIconSize(
            this.originalWidth,
            this.originalHeight
        );

        this.node.setScale(1, 1, 1);
        this.node.active = true;
    }

    public setAliveRatio(ratio: number) {
        if (!this.uiTransform) {
            return;
        }

        const r = this.clamp01(ratio);

        if (r <= 0) {
            this.applyIconSize(
                this.originalWidth,
                0
            );

            return;
        }

        const visualRatio = Math.max(
            this.minVisibleHeightRatio,
            r
        );

        this.applyIconSize(
            this.originalWidth,
            this.originalHeight * visualRatio
        );
    }

    public updateEngageVisual(
        isEngaged: boolean,
        time: number
    ) {
        if (!this.iconSprite) {
            return;
        }

        if (
            !this.flashEnabled ||
            !isEngaged
        ) {
            this.iconSprite.color =
                this.normalColor;

            return;
        }

        const t =
            (
                Math.sin(
                    time *
                    this.flashSpeed
                ) + 1
            ) * 0.5;

        this.iconSprite.color =
            this.lerpColor(
                this.normalColor,
                this.engageFlashColor,
                t
            );
    }

    public resetVisual() {
        if (this.iconSprite) {
            this.iconSprite.color =
                this.normalColor;

            this.iconSprite.spriteFrame =
                null;

            this.iconSprite.sizeMode =
                Sprite.SizeMode.CUSTOM;
        }

        this.flipX = false;

        if (this.uiTransform) {
            this.uiTransform.setContentSize(
                this.originalWidth,
                this.originalHeight
            );
        }

        this.applyIconSize(
            this.originalWidth,
            this.originalHeight
        );

        this.node.setScale(1, 1, 1);
    }

    private initComponents() {
        if (!this.iconSprite) {
            this.iconSprite =
                this.findChildSprite();
        }

        if (!this.iconSprite) {
            this.iconSprite =
                this.getComponent(Sprite);
        }

        if (!this.iconSprite) {
            this.iconSprite =
                this.node.addComponent(Sprite);
        }

        this.iconSprite.sizeMode =
            Sprite.SizeMode.CUSTOM;

        this.iconTransform =
            this.iconSprite.node.getComponent(
                UITransform
            );

        if (!this.iconTransform) {
            this.iconTransform =
                this.iconSprite.node.addComponent(
                    UITransform
                );
        }

        this.uiTransform =
            this.getComponent(UITransform);

        if (!this.uiTransform) {
            this.uiTransform =
                this.node.addComponent(UITransform);
        }

        this.uiTransform.setContentSize(
            this.originalWidth,
            this.iconHeight
        );

        this.applyIconSize(
            this.originalWidth,
            this.iconHeight
        );
    }

    private findChildSprite() {
        const children =
            this.node.children;

        for (
            let i = 0;
            i < children.length;
            i++
        ) {
            const sprite =
                children[i].getComponent(Sprite);

            if (sprite) {
                return sprite;
            }
        }

        return null;
    }

    private applyIconSize(
        width: number,
        height: number
    ) {
        if (this.iconTransform) {
            this.iconTransform.setContentSize(
                Math.max(0, width),
                Math.max(0, height)
            );
        }

        if (
            this.iconSprite &&
            this.iconSprite.node !== this.node
        ) {
            if (this.iconTransform) {
                this.iconTransform.setAnchorPoint(
                    0.5,
                    0.5
                );
            }

            this.iconSprite.node.setPosition(
                0,
                0,
                0
            );

            this.iconSprite.node.setScale(
                this.flipX ? -1 : 1,
                1,
                1
            );
        }
    }

    private copyColor(
        source: Color,
        target: Color
    ) {
        target.r = source.r;
        target.g = source.g;
        target.b = source.b;
        target.a = source.a;
    }

    private lerpColor(
        a: Color,
        b: Color,
        t: number
    ) {
        const c = this.tempColor;

        c.r = Math.round(
            a.r + (b.r - a.r) * t
        );

        c.g = Math.round(
            a.g + (b.g - a.g) * t
        );

        c.b = Math.round(
            a.b + (b.b - a.b) * t
        );

        c.a = Math.round(
            a.a + (b.a - a.a) * t
        );

        return c;
    }

    private clamp01(v: number) {
        return Math.max(
            0,
            Math.min(1, v)
        );
    }
}
