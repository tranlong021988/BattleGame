import {
    _decorator,
    Component,
    EventTouch,
    Layers,
    Layout,
    Node,
    Sprite,
    SpriteFrame,
    Tween,
    tween,
    UITransform,
    Vec3,
} from 'cc';

import { GameManager } from './GameManager';
import { BattleWave } from './BattleWave';
import { UnitType } from './BattleTypes';
import { BattleInformationIconItem } from './BattleInformationIconItem';
import { BattleCinematicCameraController } from './BattleCinematicCameraController';

const { ccclass, property } = _decorator;

@ccclass('MiniMapUnitIconInfo')
export class MiniMapUnitIconInfo {

    @property({ type: UnitType })
    unitType: UnitType = UnitType.LightSword;

    @property(SpriteFrame)
    spriteFrame: SpriteFrame | null = null;
}

type MiniMapWaveRecord = {
    wave: BattleWave;
    item: BattleInformationIconItem;
    node: Node;
    targetPosition: Vec3;
    velocity: Vec3;
    removing: boolean;
};

@ccclass('TrueMiniMapPanel')
export class TrueMiniMapPanel extends Component {

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property(BattleCinematicCameraController)
    cinematicController: BattleCinematicCameraController | null = null;

    @property(Node)
    background: Node | null = null;

    @property(Node)
    teamAIconRoot: Node | null = null;

    @property(Node)
    teamBIconRoot: Node | null = null;

    @property({ type: [MiniMapUnitIconInfo] })
    teamAIcons: MiniMapUnitIconInfo[] = [];

    @property({ type: [MiniMapUnitIconInfo] })
    teamBIcons: MiniMapUnitIconInfo[] = [];

    @property
    autoFindGameManager = true;

    @property
    disableIconRootLayout = true;

    @property
    worldToMiniMapScale = 2;

    @property
    updateInterval = 0.1;

    @property
    smoothDampTime = 0.12;

    @property
    tweenScaleDuration = 0.15;

    @property
    iconWidth = 18;

    @property
    iconHeight = 18;

    @property
    prewarmIconCount = 32;

    @property
    maxPoolSize = 128;

    @property
    clampIconToMapBounds = true;

    @property
    invertXAxis = false;

    @property
    invertZAxis = false;

    @property
    showAliveRatio = false;

    @property
    freezeDyingWavePositionAliveCount = 1;

    @property
    enableIconClickFocus = true;

    @property
    enableDebugLog = false;

    private records =
        new Map<number, MiniMapWaveRecord>();

    private pool: Node[] = [];

    private mapWidth = 0;
    private mapHeight = 0;
    private timer = 0;
    private time = 0;

    private tempPosition = new Vec3();
    private tempWorldPosition = new Vec3();

    start() {

        if (
            !this.gameManager &&
            this.autoFindGameManager
        ) {
            this.gameManager =
                GameManager.instance;
        }

        this.prepareIconRoots();
        this.configureMapSize();
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
            this.timer >=
            this.updateInterval
        ) {
            this.timer = 0;
            this.prepareIconRoots();
            this.configureMapSize();
            this.syncWithBattleWaves();
            this.updateTargetsAndState();
        }

        this.releaseDeadIcons();

        this.updateIconPositions(
            deltaTime
        );

        this.updateFlashOnly();
    }

    private configureMapSize() {

        if (!this.gameManager) {
            return;
        }

        const scale =
            Math.max(
                0.001,
                this.worldToMiniMapScale
            );

        this.mapWidth =
            Math.max(
                1,
                (
                    this.gameManager.battleMaxX -
                    this.gameManager.battleMinX
                ) * scale
            );

        this.mapHeight =
            Math.max(
                1,
                (
                    this.gameManager.battleMaxZ -
                    this.gameManager.battleMinZ
                ) * scale
            );

        this.setNodeSize(
            this.node,
            this.mapWidth,
            this.mapHeight
        );

        if (this.background) {
            this.setNodeSize(
                this.background,
                this.mapWidth,
                this.mapHeight
            );
        }

        if (this.teamAIconRoot) {
            this.setNodeSize(
                this.teamAIconRoot,
                this.mapWidth,
                this.mapHeight
            );
        }

        if (this.teamBIconRoot) {
            this.setNodeSize(
                this.teamBIconRoot,
                this.mapWidth,
                this.mapHeight
            );
        }
    }

    private prepareIconRoots() {

        this.prepareIconRoot(
            this.teamAIconRoot
        );

        this.prepareIconRoot(
            this.teamBIconRoot
        );
    }

    private prepareIconRoot(
        root: Node | null
    ) {

        if (!root) {
            return;
        }

        root.setPosition(0, 0, 0);

        if (!this.disableIconRootLayout) {
            return;
        }

        const layout =
            root.getComponent(
                Layout
            );

        if (layout) {
            layout.enabled = false;
        }
    }

    private setNodeSize(
        node: Node,
        width: number,
        height: number
    ) {

        let ui =
            node.getComponent(
                UITransform
            );

        if (!ui) {
            ui =
                node.addComponent(
                    UITransform
                );
        }

        ui.setContentSize(
            width,
            height
        );

        ui.setAnchorPoint(
            0.5,
            0.5
        );
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

            if (
                !this.tryGetWaveWorldPosition(
                    wave,
                    this.tempWorldPosition
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

        Tween.stopAllByTarget(node);
        node.active = false;
        node.layer = Layers.Enum.UI_2D;
        node.name = `mini-map-wave-${wave.id}`;

        this.clearIconEvents(node);

        if (
            this.enableIconClickFocus &&
            this.cinematicController
        ) {
            node.on(
                Node.EventType.TOUCH_START,
                (event) => {
                    this.cinematicController?.suppressExitTap();
                    this.stopTouchPropagation(event);
                },
                this
            );

            node.on(
                Node.EventType.TOUCH_END,
                (event) => {
                    this.cinematicController?.suppressExitTap();
                    this.cinematicController?.focusWave(wave);
                    this.stopTouchPropagation(event);
                },
                this
            );
        }

        const item =
            node.getComponent(
                BattleInformationIconItem
            )!;

        item.setup(
            this.getSpriteFrame(
                wave.team,
                wave.unitType
            ),
            this.iconWidth,
            this.iconHeight,
            0.5
        );

        const target =
            this.getWaveMiniMapPosition(
                wave,
                null
            );

        root.addChild(node);
        node.setPosition(target);
        node.setScale(0, 0, 1);
        node.active = true;

        const record: MiniMapWaveRecord = {
            wave,
            item,
            node,
            targetPosition: target.clone(),
            velocity: new Vec3(),
            removing: false,
        };

        this.records.set(
            wave.id,
            record
        );

        tween(node)
            .to(
                this.getSafeTweenDuration(),
                { scale: new Vec3(1, 1, 1) }
            )
            .start();

        this.log(
            `Create mini-map icon wave=${wave.id}`
        );
    }

    private updateTargetsAndState() {

        const removeIds: number[] = [];

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

                record.targetPosition.set(
                    this.getWaveMiniMapPosition(
                        wave,
                        record.targetPosition
                    )
                );

                record.item.setAliveRatio(
                    this.showAliveRatio
                        ? wave.getAliveRatio()
                        : 1
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

    private updateIconPositions(
        deltaTime: number
    ) {

        this.records.forEach(
            (record) => {

                if (record.removing) {
                    return;
                }

                if (
                    this.smoothDampTime <=
                    0
                ) {
                    record.node.setPosition(
                        record.targetPosition
                    );

                    return;
                }

                const current =
                    record.node.position;

                this.tempPosition.set(
                    this.smoothDamp(
                        current.x,
                        record.targetPosition.x,
                        'x',
                        record,
                        deltaTime
                    ),
                    this.smoothDamp(
                        current.y,
                        record.targetPosition.y,
                        'y',
                        record,
                        deltaTime
                    ),
                    0
                );

                record.node.setPosition(
                    this.tempPosition
                );
            }
        );
    }

    private releaseDeadIcons() {

        const removeIds: number[] = [];

        this.records.forEach(
            (record, waveId) => {

                if (record.removing) {
                    return;
                }

                const wave =
                    record.wave;

                if (
                    !wave ||
                    wave.isDead()
                ) {
                    removeIds.push(
                        waveId
                    );
                }
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

    private smoothDamp(
        current: number,
        target: number,
        axis: 'x' | 'y',
        record: MiniMapWaveRecord,
        deltaTime: number
    ) {

        const smoothTime =
            Math.max(
                0.0001,
                this.smoothDampTime
            );

        const omega = 2 / smoothTime;
        const x = omega * deltaTime;
        const exp =
            1 /
            (
                1 +
                x +
                0.48 * x * x +
                0.235 * x * x * x
            );

        const change =
            current - target;

        const velocity =
            axis === 'x'
                ? record.velocity.x
                : record.velocity.y;

        const temp =
            (
                velocity +
                omega * change
            ) * deltaTime;

        const nextVelocity =
            (
                velocity -
                omega * temp
            ) * exp;

        if (axis === 'x') {
            record.velocity.x =
                nextVelocity;
        }
        else {
            record.velocity.y =
                nextVelocity;
        }

        return (
            target +
            (
                change +
                temp
            ) * exp
        );
    }

    private updateFlashOnly() {

        this.records.forEach(
            (record) => {

                if (record.removing) {
                    return;
                }

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

        if (record.removing) {
            return;
        }

        record.removing = true;
        record.targetPosition.set(
            record.node.position
        );
        record.velocity.set(
            0,
            0,
            0
        );

        this.clearIconEvents(
            record.node
        );

        Tween.stopAllByTarget(
            record.node
        );

        this.records.delete(
            waveId
        );

        tween(record.node)
            .to(
                this.getSafeTweenDuration(),
                { scale: new Vec3(0, 0, 1) }
            )
            .call(() => {
                this.recycleIcon(
                    record
                );
            })
            .start();
    }

    private recycleIcon(
        record: MiniMapWaveRecord
    ) {

        Tween.stopAllByTarget(
            record.node
        );

        record.item.resetVisual();
        record.node.removeFromParent();
        record.node.active = false;
        record.node.setPosition(0, 0, 0);
        record.node.setScale(0, 0, 1);

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
    }

    private getWaveMiniMapPosition(
        wave: BattleWave,
        fallback: Vec3 | null
    ) {

        if (!this.gameManager) {
            return fallback
                ? fallback.clone()
                : new Vec3();
        }

        if (
            fallback &&
            this.shouldFreezeDyingWavePosition(
                wave
            )
        ) {
            return fallback.clone();
        }

        if (
            !this.tryGetWaveWorldPosition(
                wave,
                this.tempWorldPosition
            )
        ) {
            return fallback
                ? fallback.clone()
                : new Vec3();
        }

        const minX =
            this.gameManager.battleMinX;

        const maxX =
            this.gameManager.battleMaxX;

        const minZ =
            this.gameManager.battleMinZ;

        const maxZ =
            this.gameManager.battleMaxZ;

        const width =
            Math.max(
                0.0001,
                maxX - minX
            );

        const height =
            Math.max(
                0.0001,
                maxZ - minZ
            );

        let x01 =
            (
                this.tempWorldPosition.x -
                minX
            ) / width;

        let z01 =
            (
                this.tempWorldPosition.z -
                minZ
            ) / height;

        if (this.clampIconToMapBounds) {
            x01 = this.clamp01(x01);
            z01 = this.clamp01(z01);
        }

        if (this.invertXAxis) {
            x01 = 1 - x01;
        }

        if (this.invertZAxis) {
            z01 = 1 - z01;
        }

        return new Vec3(
            x01 * this.mapWidth -
            this.mapWidth * 0.5,
            z01 * this.mapHeight -
            this.mapHeight * 0.5,
            0
        );
    }

    private shouldFreezeDyingWavePosition(
        wave: BattleWave
    ) {

        const threshold =
            Math.max(
                0,
                Math.floor(
                    this.freezeDyingWavePositionAliveCount
                )
            );

        if (threshold <= 0) {
            return false;
        }

        if (wave.totalCount <= threshold) {
            return false;
        }

        return wave.getAliveCount() <= threshold;
    }

    private tryGetWaveWorldPosition(
        wave: BattleWave,
        out: Vec3
    ) {

        let sumX = 0;
        let sumZ = 0;
        let count = 0;

        const units =
            wave.units;

        for (
            let i = 0;
            i < units.length;
            i++
        ) {
            const unit =
                units[i];

            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;

            if (unit.agent) {
                sumX += unit.agent.pos.x;
                sumZ += unit.agent.pos.z;
                count++;
                continue;
            }

            const p =
                unit.node.worldPosition;

            sumX += p.x;
            sumZ += p.z;
            count++;
        }

        if (count <= 0) {
            return false;
        }

        out.set(
            sumX / count,
            0,
            sumZ / count
        );

        return true;
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

    private getIconNodeFromPool() {

        let node: Node;

        if (
            this.pool.length > 0
        ) {
            node = this.pool.pop()!;
        }
        else {
            node = this.createIconNode();
        }

        Tween.stopAllByTarget(node);
        this.clearIconEvents(node);
        node.removeFromParent();
        node.active = false;
        node.setPosition(0, 0, 0);
        node.setScale(0, 0, 1);

        return node;
    }

    private createIconNode() {

        const node =
            new Node(
                'mini-map-wave-icon'
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

    private clearAllIcons() {

        this.records.forEach(
            (record) => {
                this.clearIconEvents(record.node);
                record.item.resetVisual();
                record.node.removeFromParent();
                record.node.active = false;
                this.pool.push(record.node);
            }
        );

        this.records.clear();
    }

    private destroyAllIcons() {

        this.records.forEach(
            (record) => {
                this.clearIconEvents(record.node);
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

    private getSpriteFrame(
        team: number,
        unitType: UnitType
    ) {

        const list =
            team === 0
                ? this.teamAIcons
                : this.teamBIcons;

        const spriteFrame =
            this.findSpriteFrameInList(
                list,
                unitType
            );

        if (spriteFrame) {
            return spriteFrame;
        }

        return null;
    }

    private findSpriteFrameInList(
        list: MiniMapUnitIconInfo[],
        unitType: number
    ) {

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

    private clamp01(v: number) {
        return Math.max(
            0,
            Math.min(1, v)
        );
    }

    private getSafeTweenDuration() {
        return Math.max(
            0,
            this.tweenScaleDuration
        );
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
            `[TrueMiniMapPanel] ${msg}`
        );
    }
}
