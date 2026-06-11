import {
    _decorator,
    Component,
    EventTouch,
    Layers,
    Node,
    Sprite,
    SpriteFrame,
    UITransform,
} from 'cc';

import { GameManager } from './GameManager';
import { BattleWave } from './BattleWave';
import { UnitType } from './BattleTypes';
import { BattleInformationIconItem } from './BattleInformationIconItem';
import { BattleCinematicCameraController } from './BattleCinematicCameraController';

const { ccclass, property } = _decorator;

@ccclass('UnitIconInfo')
export class UnitIconInfo {

    @property({ type: UnitType })
    unitType: UnitType = UnitType.LightSword;

    @property(SpriteFrame)
    spriteFrame: SpriteFrame | null = null;
}

type WaveIconRecord = {
    wave: BattleWave;
    item: BattleInformationIconItem;
    node: Node;
};

@ccclass('BattleInformationPanel')
export class BattleInformationPanel extends Component {

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property(BattleCinematicCameraController)
    cinematicController: BattleCinematicCameraController | null = null;

    @property(Node)
    teamAIconRoot: Node | null = null;

    @property(Node)
    teamBIconRoot: Node | null = null;

    @property({ type: [UnitIconInfo] })
    teamAIcons: UnitIconInfo[] = [];

    @property({ type: [UnitIconInfo] })
    teamBIcons: UnitIconInfo[] = [];

    @property
    autoFindGameManager = true;

    @property
    updateInterval = 0.1;

    @property
    iconWidth = 40;

    @property
    iconHeight = 40;

    @property
    teamAAnchorY = 0;

    @property
    teamBAnchorY = 1;

    @property
    prewarmIconCount = 32;

    @property
    maxPoolSize = 128;

    @property
    enableIconClickFocus = true;

    @property
    enableDebugLog = false;

    private records =
        new Map<number, WaveIconRecord>();

    private pool: Node[] = [];

    private timer = 0;
    private time = 0;

    start() {

        if (
            !this.gameManager &&
            this.autoFindGameManager
        ) {
            this.gameManager =
                GameManager.instance;
        }

        this.clearAllIcons();
        this.prewarmPool();
    }

    onDestroy() {
        this.destroyAllIcons();
    }

    update(deltaTime: number) {

        this.time += deltaTime;
        this.timer += deltaTime;

        if (
            this.timer <
            this.updateInterval
        ) {
            this.updateFlashOnly();
            return;
        }

        this.timer = 0;

        this.syncWithBattleWaves();
        this.updateAllIcons();
    }

    private prewarmPool() {

        const count =
            Math.max(
                0,
                Math.floor(
                    this.prewarmIconCount
                )
            );

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const node =
                this.createIconNode();

            node.active = false;

            this.node.addChild(node);

            this.pool.push(node);
        }
    }

    private syncWithBattleWaves() {

        if (!this.gameManager) {
            return;
        }

        const waves =
            this.gameManager.waves;

        for (
            let i = 0;
            i < waves.length;
            i++
        ) {

            const wave = waves[i];

            if (!wave) continue;
            if (wave.isDead()) continue;

            if (
                this.records.has(
                    wave.id
                )
            ) {
                continue;
            }

            this.createIconForWave(
                wave
            );
        }
    }

    private createIconForWave(
        wave: BattleWave
    ) {

        const root =
            wave.team === 0
                ? this.teamAIconRoot
                : this.teamBIconRoot;

        if (!root) {
            return;
        }

        const node =
            this.getIconNodeFromPool();

        node.active = true;

        node.layer =
            Layers.Enum.UI_2D;

        node.name =
            `wave-icon-${wave.id}`;

        this.clearIconEvents(node);

        if (
            this.enableIconClickFocus &&
            this.cinematicController
        ) {

            node.on(
                Node.EventType.TOUCH_START,
                (event) => {

                    this.cinematicController?.suppressExitTap();

                    this.stopTouchPropagation(
                        event
                    );
                },
                this
            );

            node.on(
                Node.EventType.TOUCH_END,
                (event) => {

                    this.cinematicController?.suppressExitTap();

                    this.cinematicController?.focusWave(
                        wave
                    );

                    this.stopTouchPropagation(
                        event
                    );
                },
                this
            );
        }

        root.addChild(node);

        const item =
            node.getComponent(
                BattleInformationIconItem
            )!;

        const spriteFrame =
            this.getSpriteFrame(
                wave.team,
                wave.unitType
            );

        const anchorY =
            wave.team === 0
                ? this.teamAAnchorY
                : this.teamBAnchorY;

        item.setup(
            spriteFrame,
            this.iconWidth,
            this.iconHeight,
            anchorY
        );

        this.records.set(
            wave.id,
            {
                wave,
                item,
                node,
            }
        );

        this.log(
            `Create icon wave=${wave.id}`
        );
    }

    private updateAllIcons() {

        const removeIds: number[] =
            [];

        this.records.forEach(
            (record, waveId) => {

                const wave =
                    record.wave;

                if (
                    !wave ||
                    wave.isDead()
                ) {

                    removeIds.push(
                        waveId
                    );

                    return;
                }

                const ratio =
                    wave.getAliveRatio();

                record.item.setAliveRatio(
                    ratio
                );

                record.item.updateEngageVisual(
                    wave.hasEngaged(),
                    this.time
                );
            }
        );

        for (
            let i = 0;
            i < removeIds.length;
            i++
        ) {
            this.releaseIcon(
                removeIds[i]
            );
        }
    }

    private updateFlashOnly() {

        this.records.forEach(
            (record) => {

                const wave =
                    record.wave;

                if (
                    !wave ||
                    wave.isDead()
                ) {
                    return;
                }

                record.item.updateEngageVisual(
                    wave.hasEngaged(),
                    this.time
                );
            }
        );
    }

    private releaseIcon(
        waveId: number
    ) {

        const record =
            this.records.get(
                waveId
            );

        if (!record) {
            return;
        }

        this.clearIconEvents(
            record.node
        );

        record.item.resetVisual();

        record.node.removeFromParent();

        record.node.active =
            false;

        if (
            this.pool.length <
            this.maxPoolSize
        ) {

            this.node.addChild(
                record.node
            );

            this.pool.push(
                record.node
            );
        }
        else {

            record.node.destroy();
        }

        this.records.delete(
            waveId
        );
    }

    private getIconNodeFromPool() {

        if (
            this.pool.length > 0
        ) {
            return this.pool.pop()!;
        }

        return this.createIconNode();
    }

    private createIconNode() {

        const node =
            new Node(
                'battle-info-icon'
            );

        node.layer =
            Layers.Enum.UI_2D;

        const ui =
            node.addComponent(
                UITransform
            );

        ui.setContentSize(
            this.iconWidth,
            this.iconHeight
        );

        const sprite =
            node.addComponent(
                Sprite
            );

        sprite.sizeMode =
            Sprite.SizeMode.CUSTOM;

        node.addComponent(
            BattleInformationIconItem
        );

        return node;
    }

    private clearIconEvents(
        node: Node
    ) {

        node.off(
            Node.EventType.TOUCH_START
        );

        node.off(
            Node.EventType.TOUCH_END
        );

        node.off(
            Node.EventType.TOUCH_CANCEL
        );
    }

    private stopTouchPropagation(
        event: EventTouch
    ) {

        const e =
            event as any;

        if (
            typeof e.stopPropagation ===
            'function'
        ) {
            e.stopPropagation();
        }
    }

    public clearAllIcons() {

        this.records.forEach(
            (record) => {

                this.clearIconEvents(
                    record.node
                );

                record.item.resetVisual();

                record.node.removeFromParent();

                record.node.active =
                    false;

                if (
                    this.pool.length <
                    this.maxPoolSize
                ) {
                    this.pool.push(
                        record.node
                    );
                }
                else {
                    record.node.destroy();
                }
            }
        );

        this.records.clear();
    }

    private destroyAllIcons() {
        this.records.forEach(
            (record) => {
                this.clearIconEvents(
                    record.node
                );

                record.node.destroy();
            }
        );

        this.records.clear();

        for (
            let i = 0;
            i < this.pool.length;
            i++
        ) {
            const node = this.pool[i];

            if (!node) continue;

            this.clearIconEvents(node);
            node.destroy();
        }

        this.pool.length = 0;
    }

    private getSpriteFrame(
        team: number,
        unitType: UnitType
    ) {

        const list =
            team === 0
                ? this.teamAIcons
                : this.teamBIcons;

        for (
            let i = 0;
            i < list.length;
            i++
        ) {

            const info =
                list[i];

            if (
                info.unitType ===
                unitType
            ) {
                return info.spriteFrame;
            }
        }

        return null;
    }

    private log(
        msg: string
    ) {

        if (
            !this.enableDebugLog
        ) {
            return;
        }

        console.log(
            `[BattleInformationPanel] ${msg}`
        );
    }
}
