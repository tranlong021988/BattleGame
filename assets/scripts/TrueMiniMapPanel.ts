import {
    _decorator,
    Color,
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
import { Unit } from './Unit';

const { ccclass, property } = _decorator;

@ccclass('MiniMapUnitIconInfo')
export class MiniMapUnitIconInfo {

    @property({ type: UnitType })
    unitType: UnitType = UnitType.LightSword;

    @property(SpriteFrame)
    spriteFrame: SpriteFrame | null = null;
}

type MiniMapWaveRecord = {
    team: number;
    pairId: number;
    wave: BattleWave;
    item: BattleInformationIconItem;
    node: Node;
    rawPosition: Vec3;
    targetPosition: Vec3;
    velocity: Vec3;
    aliveRatio: number;
    displayedAliveRatio: number;
    engaged: boolean;
    visualEngaged: boolean;
    removing: boolean;
};

type MiniMapHeroRecord = {
    team: number;
    pairId: number;
    unit: Unit;
    item: BattleInformationIconItem;
    node: Node;
    rawPosition: Vec3;
    targetPosition: Vec3;
    velocity: Vec3;
    aliveRatio: number;
    displayedAliveRatio: number;
    engaged: boolean;
    visualEngaged: boolean;
    removing: boolean;
};

type MiniMapSeparationRecord = {
    team: number;
    pairId: number;
    rawPosition: Vec3;
    targetPosition: Vec3;
    removing: boolean;
};

type MiniMapWaveScan = {
    aliveCount: number;
    aliveRatio: number;
    engaged: boolean;
    dead: boolean;
    hasPosition: boolean;
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

    @property(SpriteFrame)
    teamAHeroIcon: SpriteFrame | null = null;

    @property(SpriteFrame)
    teamBHeroIcon: SpriteFrame | null = null;

    @property
    autoFindGameManager = true;

    @property
    disableIconRootLayout = true;

    @property
    worldToMiniMapScale = 2;

    @property
    fixedMapHeight = 0;

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
    minIconSpacing = 22;

    @property
    iconBoundaryPadding = 4;

    @property
    iconSeparationIterations = 4;

    @property(Color)
    teamAIconTint: Color = new Color(90, 180, 255, 255);

    @property(Color)
    teamBIconTint: Color = new Color(255, 95, 95, 255);

    @property(Color)
    teamAFlashTint: Color = new Color(180, 240, 255, 255);

    @property(Color)
    teamBFlashTint: Color = new Color(255, 220, 90, 255);

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
    maxPositionSampleUnits = 8;

    @property
    freezeDyingWavePositionAliveCount = 0;

    @property
    enableIconClickFocus = true;

    @property
    enableDebugLog = false;

    private records =
        new Map<number, MiniMapWaveRecord>();

    private heroRecords =
        new Map<number, MiniMapHeroRecord>();

    private pool: Node[] = [];

    private mapWidth = 0;
    private mapHeight = 0;
    private timer = 0;
    private time = 0;

    private tempPosition = new Vec3();
    private tempWorldPosition = new Vec3();
    private tempMiniMapPosition = new Vec3();
    private removeWaveIds: number[] = [];
    private removeHeroTeams: number[] = [];
    private iconSeparationRecords: MiniMapSeparationRecord[] = [];
    private iconSeparationGrid: Map<number, number[]> = new Map();
    private iconSeparationGridKeys: number[] = [];
    private tempWaveScan: MiniMapWaveScan = {
        aliveCount: 0,
        aliveRatio: 0,
        engaged: false,
        dead: true,
        hasPosition: false,
    };
    private readonly tweenScaleOne = new Vec3(1, 1, 1);
    private readonly tweenScaleZero = new Vec3(0, 0, 1);
    private readonly iconPositionStopDistanceSq = 0.0001;

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
            this.syncWithHeroes();
            this.updateTargetsAndState();
        }

        this.updateIconPositions(
            deltaTime
        );

        this.updateFlashOnly();
    }

    private configureMapSize() {

        if (!this.gameManager) {
            return;
        }

        const worldWidth =
            Math.max(
                0.001,
                this.gameManager.battleMaxX -
                this.gameManager.battleMinX
            );

        const worldHeight =
            Math.max(
                0.001,
                this.gameManager.battleMaxZ -
                this.gameManager.battleMinZ
            );

        if (this.fixedMapHeight > 0) {
            this.mapHeight =
                Math.max(
                    1,
                    this.fixedMapHeight
                );

            this.mapWidth =
                Math.max(
                    1,
                    this.mapHeight *
                    worldWidth /
                    worldHeight
                );
        } else {
            const scale =
                Math.max(
                    0.001,
                    this.worldToMiniMapScale
                );

            this.mapWidth =
                Math.max(
                    1,
                    worldWidth * scale
                );

            this.mapHeight =
                Math.max(
                    1,
                    worldHeight * scale
                );
        }

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

        const size =
            ui.contentSize;

        if (
            Math.abs(size.width - width) >
            0.001 ||
            Math.abs(size.height - height) >
            0.001
        ) {
            ui.setContentSize(
                width,
                height
            );
        }

        if (
            Math.abs(ui.anchorX - 0.5) >
            0.001 ||
            Math.abs(ui.anchorY - 0.5) >
            0.001
        ) {
            ui.setAnchorPoint(
                0.5,
                0.5
            );
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

            if (
                this.records.has(
                    wave.id
                )
            ) {
                continue;
            }

            const scan =
                this.scanWaveForMiniMap(
                    wave,
                    this.tempWorldPosition
                );

            if (scan.dead) {
                continue;
            }

            if (!scan.hasPosition) {
                continue;
            }

            const target =
                this.getMiniMapPositionFromWorldPosition(
                    this.tempWorldPosition
                );

            this.createIconForWave(
                wave,
                target,
                scan.aliveRatio,
                scan.engaged
            );
        }
    }

    private createIconForWave(
        wave: BattleWave,
        target: Vec3,
        aliveRatio: number,
        engaged: boolean
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
            0.5,
            wave.team === 1,
            this.getTeamIconTint(
                wave.team
            ),
            this.getTeamFlashTint(
                wave.team
            )
        );

        root.addChild(node);
        node.setPosition(target);
        node.setScale(0, 0, 1);
        node.active = true;

        const displayedAliveRatio =
            this.showAliveRatio
                ? aliveRatio
                : 1;

        item.setAliveRatio(
            displayedAliveRatio
        );

        item.updateEngageVisual(
            engaged,
            this.time
        );

        const record: MiniMapWaveRecord = {
            team: wave.team,
            pairId: wave.id,
            wave,
            item,
            node,
            rawPosition: target.clone(),
            targetPosition: target.clone(),
            velocity: new Vec3(),
            aliveRatio,
            displayedAliveRatio,
            engaged,
            visualEngaged: engaged,
            removing: false,
        };

        this.records.set(
            wave.id,
            record
        );

        tween(node)
            .to(
                this.getSafeTweenDuration(),
                { scale: this.tweenScaleOne }
            )
            .start();

        this.log(
            `Create mini-map icon wave=${wave.id}`
        );
    }

    private syncWithHeroes() {

        if (!this.gameManager) {
            return;
        }

        this.syncHeroIcon(
            0,
            this.gameManager.teamAHero
        );

        this.syncHeroIcon(
            1,
            this.gameManager.teamBHero
        );
    }

    private syncHeroIcon(
        team: number,
        hero: Unit | null
    ) {

        if (this.heroRecords.has(team)) {
            return;
        }

        if (!this.isHeroUnitAlive(hero)) {
            return;
        }

        this.tempWorldPosition.set(
            hero!.agent.pos.x,
            0,
            hero!.agent.pos.z
        );

        const target =
            this.getMiniMapPositionFromWorldPosition(
                this.tempWorldPosition
            );

        this.createIconForHero(
            team,
            hero!,
            target
        );
    }

    private createIconForHero(
        team: number,
        hero: Unit,
        target: Vec3
    ) {

        const root =
            team === 0
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
        node.name = `mini-map-hero-${team}`;

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
                    this.cinematicController?.focusUnit(hero);
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
            this.getHeroSpriteFrame(
                team,
                hero
            ),
            this.iconWidth,
            this.iconHeight,
            0.5,
            team === 1,
            this.getTeamIconTint(team),
            this.getTeamFlashTint(team)
        );

        root.addChild(node);
        node.setPosition(target);
        node.setScale(0, 0, 1);
        node.active = true;

        const aliveRatio =
            hero.props
                ? hero.props.getHealthRatio()
                : 1;

        const displayedAliveRatio =
            this.showAliveRatio
                ? aliveRatio
                : 1;

        item.setAliveRatio(
            displayedAliveRatio
        );

        item.updateEngageVisual(
            hero.onBusy,
            this.time
        );

        const record: MiniMapHeroRecord = {
            team,
            pairId: -1000 - team,
            unit: hero,
            item,
            node,
            rawPosition: target.clone(),
            targetPosition: target.clone(),
            velocity: new Vec3(),
            aliveRatio,
            displayedAliveRatio,
            engaged: hero.onBusy,
            visualEngaged: hero.onBusy,
            removing: false,
        };

        this.heroRecords.set(
            team,
            record
        );

        tween(node)
            .to(
                this.getSafeTweenDuration(),
                { scale: this.tweenScaleOne }
            )
            .start();

        this.log(
            `Create mini-map hero icon team=${team}`
        );
    }

    private updateTargetsAndState() {

        const removeIds =
            this.removeWaveIds;

        removeIds.length = 0;

        this.records.forEach(
            (record, waveId) => {

                const wave =
                    record.wave;

                if (!wave) {
                    removeIds.push(
                        waveId
                    );

                    return;
                }

                const scan =
                    this.scanWaveForMiniMap(
                        wave,
                        this.tempWorldPosition
                    );

                record.aliveRatio =
                    scan.aliveRatio;

                record.engaged =
                    scan.engaged;

                if (
                    scan.dead ||
                    !scan.hasPosition
                ) {
                    removeIds.push(
                        waveId
                    );

                    return;
                }

                if (
                    !this.shouldFreezeDyingWavePosition(
                        wave,
                        scan.aliveCount
                    )
                ) {
                    record.rawPosition.set(
                        this.getMiniMapPositionFromWorldPosition(
                            this.tempWorldPosition
                        )
                    );
                }
                else {
                    record.rawPosition.set(
                        record.targetPosition
                    );
                }

                record.targetPosition.set(
                    record.rawPosition
                );

                const displayedAliveRatio =
                    this.showAliveRatio
                        ? record.aliveRatio
                        : 1;

                if (
                    Math.abs(
                        record.displayedAliveRatio -
                        displayedAliveRatio
                    ) > 0.001
                ) {
                    record.displayedAliveRatio =
                        displayedAliveRatio;

                    record.item.setAliveRatio(
                        displayedAliveRatio
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

        this.updateHeroTargetsAndState();
        this.resolveIconOverlaps();
    }

    private updateHeroTargetsAndState() {

        const removeTeams =
            this.removeHeroTeams;

        removeTeams.length = 0;

        this.heroRecords.forEach(
            (record, team) => {

                const hero =
                    record.unit;

                if (!this.isHeroUnitAlive(hero)) {
                    removeTeams.push(team);
                    return;
                }

                record.aliveRatio =
                    hero.props
                        ? hero.props.getHealthRatio()
                        : 1;

                record.engaged =
                    hero.onBusy;

                this.tempWorldPosition.set(
                    hero.agent.pos.x,
                    0,
                    hero.agent.pos.z
                );

                record.rawPosition.set(
                    this.getMiniMapPositionFromWorldPosition(
                        this.tempWorldPosition
                    )
                );

                record.targetPosition.set(
                    record.rawPosition
                );

                const displayedAliveRatio =
                    this.showAliveRatio
                        ? record.aliveRatio
                        : 1;

                if (
                    Math.abs(
                        record.displayedAliveRatio -
                        displayedAliveRatio
                    ) > 0.001
                ) {
                    record.displayedAliveRatio =
                        displayedAliveRatio;

                    record.item.setAliveRatio(
                        displayedAliveRatio
                    );
                }
            }
        );

        for (
            let i = 0;
            i < removeTeams.length;
            i++
        ) {
            this.releaseHeroIcon(
                removeTeams[i]
            );
        }
    }

    private updateIconPositions(
        deltaTime: number
    ) {

        for (const record of this.records.values()) {

            if (record.removing) {
                continue;
            }

            this.updateIconNodePosition(
                record,
                deltaTime
            );
        }

        for (const record of this.heroRecords.values()) {

            if (record.removing) {
                continue;
            }

            this.updateIconNodePosition(
                record,
                deltaTime
            );
        }
    }

    private updateIconNodePosition(
        record: {
            node: Node;
            targetPosition: Vec3;
            velocity: Vec3;
        },
        deltaTime: number
    ) {

        const current =
            record.node.position;

        const dx =
            record.targetPosition.x -
            current.x;

        const dy =
            record.targetPosition.y -
            current.y;

        if (
            dx * dx + dy * dy <=
            this.iconPositionStopDistanceSq
        ) {
            if (
                Math.abs(record.velocity.x) >
                0.0001 ||
                Math.abs(record.velocity.y) >
                0.0001
            ) {
                record.velocity.set(
                    0,
                    0,
                    0
                );
            }

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

    private resolveIconOverlaps() {

        const minSpacing =
            Math.max(
                0,
                this.minIconSpacing
            );

        if (minSpacing <= 0) {
            return;
        }

        const records =
            this.iconSeparationRecords;

        records.length = 0;

        this.records.forEach(
            (record) => {
                if (record.removing) {
                    return;
                }

                record.targetPosition.set(
                    record.rawPosition
                );

                records.push(record);
            }
        );

        this.heroRecords.forEach(
            (record) => {
                if (record.removing) {
                    return;
                }

                record.targetPosition.set(
                    record.rawPosition
                );

                records.push(record);
            }
        );

        if (records.length < 2) {
            return;
        }

        const iterations =
            Math.max(
                1,
                Math.floor(
                    this.iconSeparationIterations
                )
            );

        const minSpacingSq =
            minSpacing * minSpacing;

        for (
            let iteration = 0;
            iteration < iterations;
            iteration++
        ) {
            this.buildIconSeparationGrid(
                records,
                minSpacing
            );

            for (
                let i = 0;
                i < records.length;
                i++
            ) {
                const a =
                    records[i];

                const aPos =
                    a.targetPosition;

                const gx =
                    Math.floor(aPos.x / minSpacing);

                const gy =
                    Math.floor(aPos.y / minSpacing);

                for (
                    let x = gx - 1;
                    x <= gx + 1;
                    x++
                ) {
                    for (
                        let y = gy - 1;
                        y <= gy + 1;
                        y++
                    ) {
                        const list =
                            this.iconSeparationGrid.get(
                                this.getIconSeparationKey(
                                    x,
                                    y
                                )
                            );

                        if (!list) continue;

                        for (
                            let index = 0;
                            index < list.length;
                            index++
                        ) {
                            const j =
                                list[index];

                            if (j <= i) continue;

                            const b =
                                records[j];

                            if (
                                a.team ===
                                b.team
                            ) {
                                continue;
                            }

                            this.separateIconPair(
                                a,
                                b,
                                minSpacing,
                                minSpacingSq
                            );
                        }
                    }
                }
            }

            this.clampSeparatedIconTargets(
                records
            );
        }
    }

    private buildIconSeparationGrid(
        records: MiniMapSeparationRecord[],
        cellSize: number
    ) {
        this.clearIconSeparationGrid();

        for (
            let i = 0;
            i < records.length;
            i++
        ) {
            const pos =
                records[i].targetPosition;

            const key =
                this.getIconSeparationKey(
                    Math.floor(pos.x / cellSize),
                    Math.floor(pos.y / cellSize)
                );

            let list =
                this.iconSeparationGrid.get(key);

            if (!list) {
                list = [];
                this.iconSeparationGrid.set(
                    key,
                    list
                );
            }

            if (list.length <= 0) {
                this.iconSeparationGridKeys.push(
                    key
                );
            }

            list.push(i);
        }
    }

    private clearIconSeparationGrid() {
        for (
            let i = 0;
            i < this.iconSeparationGridKeys.length;
            i++
        ) {
            const list =
                this.iconSeparationGrid.get(
                    this.iconSeparationGridKeys[i]
                );

            if (list) {
                list.length = 0;
            }
        }

        this.iconSeparationGridKeys.length = 0;
    }

    private getIconSeparationKey(
        x: number,
        y: number
    ) {
        return (
            (x + 32768) *
            65536 +
            y +
            32768
        );
    }

    private clampSeparatedIconTargets(
        records: MiniMapSeparationRecord[]
    ) {
        if (this.clampIconToMapBounds) {
            for (
                let i = 0;
                i < records.length;
                i++
            ) {
                this.clampMiniMapPosition(
                    records[i].targetPosition
                );
            }
        }
    }

    private separateIconPair(
        a: MiniMapSeparationRecord,
        b: MiniMapSeparationRecord,
        minSpacing: number,
        minSpacingSq: number
    ) {

        const aPos =
            a.targetPosition;

        const bPos =
            b.targetPosition;

        const dx =
            bPos.x - aPos.x;

        const dy =
            bPos.y - aPos.y;

        const distSq =
            dx * dx + dy * dy;

        if (distSq >= minSpacingSq) {
            return;
        }

        let nx = 0;
        let ny = 0;
        let dist = 0;

        if (distSq <= 0.0001) {
            const angle =
                this.getBoundaryAwarePairAngle(
                    a,
                    b
                );

            nx = Math.cos(angle);
            ny = Math.sin(angle);
        }
        else {
            dist = Math.sqrt(distSq);
            nx = dx / dist;
            ny = dy / dist;
        }

        const push =
            (
                minSpacing -
                dist
            ) * 0.5;

        aPos.x -= nx * push;
        aPos.y -= ny * push;
        bPos.x += nx * push;
        bPos.y += ny * push;
    }

    private getIconPairAngle(
        waveAId: number,
        waveBId: number
    ) {
        const seed =
            Math.abs(
                (
                    waveAId + 1
                ) *
                97 +
                (
                    waveBId + 1
                ) *
                53
            );

        return (
            seed %
            360
        ) *
        0.017453292519943295;
    }

    private getBoundaryAwarePairAngle(
        a: MiniMapSeparationRecord,
        b: MiniMapSeparationRecord
    ) {
        const baseAngle =
            this.getIconPairAngle(
                a.pairId,
                b.pairId
            );

        if (!this.clampIconToMapBounds) {
            return baseAngle;
        }

        const midX =
            (
                a.rawPosition.x +
                b.rawPosition.x
            ) * 0.5;

        const midY =
            (
                a.rawPosition.y +
                b.rawPosition.y
            ) * 0.5;

        const padding =
            this.getIconBoundsPadding();

        const halfWidth =
            Math.max(
                0,
                this.mapWidth * 0.5 -
                padding
            );

        const halfHeight =
            Math.max(
                0,
                this.mapHeight * 0.5 -
                padding
            );

        const edgeRange =
            Math.max(
                this.minIconSpacing,
                padding + 1
            );

        if (
            halfWidth > 0 &&
            Math.abs(
                halfWidth -
                Math.abs(midX)
            ) < edgeRange
        ) {
            return midY >= 0
                ? -Math.PI * 0.5
                : Math.PI * 0.5;
        }

        if (
            halfHeight > 0 &&
            Math.abs(
                halfHeight -
                Math.abs(midY)
            ) < edgeRange
        ) {
            return midX >= 0
                ? Math.PI
                : 0;
        }

        return baseAngle;
    }

    private clampMiniMapPosition(
        position: Vec3
    ) {
        const padding =
            this.getIconBoundsPadding();

        const halfWidth =
            Math.max(
                0,
                this.mapWidth * 0.5 -
                padding
            );

        const halfHeight =
            Math.max(
                0,
                this.mapHeight * 0.5 -
                padding
            );

        position.x =
            Math.max(
                -halfWidth,
                Math.min(
                    halfWidth,
                    position.x
                )
            );

        position.y =
            Math.max(
                -halfHeight,
                Math.min(
                    halfHeight,
                    position.y
                )
            );
    }

    private getIconBoundsPadding() {
        return Math.max(
            0,
            this.iconBoundaryPadding,
            this.iconWidth * 0.5,
            this.iconHeight * 0.5
        );
    }

    private smoothDamp(
        current: number,
        target: number,
        axis: 'x' | 'y',
        record: {
            velocity: Vec3;
        },
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

        for (const record of this.records.values()) {

            if (record.removing) {
                continue;
            }

            if (!record.engaged) {
                if (record.visualEngaged) {
                    record.item.updateEngageVisual(
                        false,
                        this.time
                    );

                    record.visualEngaged = false;
                }

                continue;
            }

            record.item.updateEngageVisual(
                true,
                this.time
            );

            record.visualEngaged = true;
        }

        for (const record of this.heroRecords.values()) {

            if (record.removing) {
                continue;
            }

            if (!record.engaged) {
                if (record.visualEngaged) {
                    record.item.updateEngageVisual(
                        false,
                        this.time
                    );

                    record.visualEngaged = false;
                }

                continue;
            }

            record.item.updateEngageVisual(
                true,
                this.time
            );

            record.visualEngaged = true;
        }
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

        tween(record.node)
            .to(
                this.getSafeTweenDuration(),
                { scale: this.tweenScaleZero }
            )
            .call(() => {
                this.records.delete(
                    waveId
                );

                this.recycleIcon(
                    record
                );
            })
            .start();
    }

    private releaseHeroIcon(
        team: number
    ) {

        const record =
            this.heroRecords.get(team);

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

        tween(record.node)
            .to(
                this.getSafeTweenDuration(),
                { scale: this.tweenScaleZero }
            )
            .call(() => {
                this.heroRecords.delete(team);

                this.recycleIcon(record);
            })
            .start();
    }

    private recycleIcon(
        record: {
            item: BattleInformationIconItem;
            node: Node;
        }
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

    private getMiniMapPositionFromWorldPosition(
        worldPosition: Vec3
    ) {

        if (!this.gameManager) {
            return this.tempMiniMapPosition.set(0, 0, 0);
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
                worldPosition.x -
                minX
            ) / width;

        let z01 =
            (
                worldPosition.z -
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

        return this.tempMiniMapPosition.set(
            x01 * this.mapWidth -
            this.mapWidth * 0.5,
            z01 * this.mapHeight -
            this.mapHeight * 0.5,
            0
        );
    }

    private shouldFreezeDyingWavePosition(
        wave: BattleWave,
        aliveCount: number
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

        return aliveCount <= threshold;
    }

    private scanWaveForMiniMap(
        wave: BattleWave,
        out: Vec3
    ) {

        const scan =
            this.tempWaveScan;

        scan.aliveCount = 0;
        scan.aliveRatio = 0;
        scan.engaged = false;
        scan.dead = true;
        scan.hasPosition = false;

        if (!wave || wave.released) {
            out.set(0, 0, 0);
            return scan;
        }

        const frame =
            this.gameManager
                ? this.gameManager.frame
                : -1;

        const aliveCount =
            frame >= 0
                ? wave.getRuntimeAliveCount(frame)
                : wave.getAliveCount();

        scan.aliveCount =
            aliveCount;

        scan.engaged =
            frame >= 0
                ? wave.hasEngagedRuntime(frame)
                : wave.hasEngaged();

        if (aliveCount <= 0) {
            out.set(0, 0, 0);
            return scan;
        }

        scan.dead = false;

        if (wave.totalCount > 0) {
            scan.aliveRatio =
                aliveCount /
                wave.totalCount;
        }

        const representative =
            wave.getRepresentativeUnit();

        if (
            representative &&
            BattleWave.getWaveForUnit(
                representative
            ) === wave &&
            representative.node.activeInHierarchy &&
            representative.props &&
            !representative.props.isDead() &&
            representative.agent
        ) {
            out.set(
                representative.agent.pos.x,
                0,
                representative.agent.pos.z
            );

            scan.hasPosition = true;
            return scan;
        }

        let sumX = 0;
        let sumZ = 0;
        let sampleCount = 0;

        const units =
            wave.units;

        const sampleLimit =
            Math.max(
                1,
                Math.floor(
                    this.maxPositionSampleUnits
                )
            );

        const step =
            units.length > sampleLimit
                ? Math.max(
                    1,
                    Math.floor(
                        units.length /
                        sampleLimit
                    )
                )
                : 1;

        for (
            let i = 0;
            i < units.length &&
            sampleCount < sampleLimit;
            i += step
        ) {
            const unit =
                units[i];

            if (!unit) continue;
            if (BattleWave.getWaveForUnit(unit) !== wave) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.props) continue;
            if (unit.props.isDead()) continue;
            if (!unit.agent) continue;

            sumX += unit.agent.pos.x;
            sumZ += unit.agent.pos.z;

            sampleCount++;
        }

        if (sampleCount <= 0) {
            if (
                !this.scanFullWavePositionForMiniMap(
                    wave,
                    out
                )
            ) {
                out.set(0, 0, 0);
                scan.dead = true;
                return scan;
            }

            scan.hasPosition = true;
            return scan;
        }

        out.set(
            sumX / sampleCount,
            0,
            sumZ / sampleCount
        );

        scan.hasPosition = true;

        return scan;
    }

    private scanFullWavePositionForMiniMap(
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
            if (BattleWave.getWaveForUnit(unit) !== wave) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.props) continue;
            if (unit.props.isDead()) continue;
            if (!unit.agent) continue;

            sumX += unit.agent.pos.x;
            sumZ += unit.agent.pos.z;
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

        const spriteNode =
            new Node(
                'mini-map-wave-icon-sprite'
            );

        spriteNode.layer =
            Layers.Enum.UI_2D;

        node.addChild(spriteNode);

        const spriteUi =
            spriteNode.addComponent(
                UITransform
            );

        spriteUi.setContentSize(
            this.iconWidth,
            this.iconHeight
        );

        spriteUi.setAnchorPoint(
            0.5,
            0.5
        );

        const sprite =
            spriteNode.addComponent(
                Sprite
            );

        sprite.sizeMode =
            Sprite.SizeMode.CUSTOM;

        const item =
            node.addComponent(
                BattleInformationIconItem
            );

        item.iconSprite =
            sprite;

        return node;
    }

    private clearAllIcons() {

        this.records.forEach(
            (record) => {
                Tween.stopAllByTarget(
                    record.node
                );

                this.clearIconEvents(record.node);
                record.item.resetVisual();
                record.node.removeFromParent();
                record.node.active = false;

                if (
                    this.pool.length <
                    this.maxPoolSize
                ) {
                    this.pool.push(record.node);
                }
                else {
                    record.node.destroy();
                }
            }
        );

        this.records.clear();

        this.heroRecords.forEach(
            (record) => {
                Tween.stopAllByTarget(
                    record.node
                );

                this.clearIconEvents(record.node);
                record.item.resetVisual();
                record.node.removeFromParent();
                record.node.active = false;

                if (
                    this.pool.length <
                    this.maxPoolSize
                ) {
                    this.pool.push(record.node);
                }
                else {
                    record.node.destroy();
                }
            }
        );

        this.heroRecords.clear();
    }

    private destroyAllIcons() {

        this.records.forEach(
            (record) => {
                Tween.stopAllByTarget(
                    record.node
                );

                this.clearIconEvents(record.node);
                record.node.destroy();
            }
        );

        this.records.clear();

        this.heroRecords.forEach(
            (record) => {
                Tween.stopAllByTarget(
                    record.node
                );

                this.clearIconEvents(record.node);
                record.node.destroy();
            }
        );

        this.heroRecords.clear();

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

    private getHeroSpriteFrame(
        team: number,
        hero: Unit
    ) {
        const heroSpriteFrame =
            team === 0
                ? this.teamAHeroIcon
                : this.teamBHeroIcon;

        if (heroSpriteFrame) {
            return heroSpriteFrame;
        }

        const unitType =
            hero.props
                ? hero.props.unitType
                : UnitType.LightSword;

        return this.getSpriteFrame(
            team,
            unitType
        );
    }

    private isHeroUnitAlive(
        hero: Unit | null
    ) {
        if (!hero) return false;
        if (!hero.node.activeInHierarchy) return false;
        if (!hero.agent) return false;
        if (!hero.props) return false;
        if (hero.props.isDead()) return false;

        return true;
    }

    private getTeamIconTint(
        team: number
    ) {
        return team === 0
            ? this.teamAIconTint
            : this.teamBIconTint;
    }

    private getTeamFlashTint(
        team: number
    ) {
        return team === 0
            ? this.teamAFlashTint
            : this.teamBFlashTint;
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
