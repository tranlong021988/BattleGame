import {
    _decorator,
    Component,
    Node,
    Sprite,
    SpriteFrame,
    UITransform,
} from 'cc';

import { GameManager } from './GameManager';
import { BattleWave } from './BattleWave';
import { UnitType } from './BattleTypes';
import { BattleInformationIconItem } from './BattleInformationIconItem';

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
    removeDeadWaveIcon = true;

    @property
    destroyRemovedIcon = true;

    @property
    iconWidth = 32;

    @property
    iconHeight = 32;

    private records: Map<number, WaveIconRecord> = new Map();

    private timer = 0;
    private time = 0;

    start() {
        if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = GameManager.instance;
        }

        this.clearAllIcons();
    }

    update(deltaTime: number) {
        this.time += deltaTime;
        this.timer += deltaTime;

        if (this.timer < this.updateInterval) {
            this.updateBlinkOnly();
            return;
        }

        this.timer = 0;

        this.syncWithBattleWaves();
        this.updateAllIcons();
    }

    private syncWithBattleWaves() {
        if (!this.gameManager) return;

        const waves = this.gameManager.waves;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!wave) continue;
            if (wave.isDead()) continue;
            if (this.records.has(wave.id)) continue;

            this.createIconForWave(wave);
        }
    }

    private createIconForWave(wave: BattleWave) {
        const root =
            wave.team === 0
                ? this.teamAIconRoot
                : this.teamBIconRoot;

        if (!root) {
            console.warn(
                '[BattleInformationPanel] Missing icon root for team:',
                wave.team
            );
            return;
        }

        const node = this.createIconNode();
        node.name = `wave-icon-${wave.id}-${wave.unitName}`;

        root.addChild(node);

        const item = node.getComponent(BattleInformationIconItem)!;

        const spriteFrame = this.getSpriteFrame(
            wave.team,
            wave.unitType
        );

        item.setup(spriteFrame);

        this.records.set(wave.id, {
            wave,
            item,
            node
        });
    }

    private createIconNode() {
        const node = new Node('wave-icon');

        const ui = node.addComponent(UITransform);
        ui.setContentSize(
            this.iconWidth,
            this.iconHeight
        );
        ui.setAnchorPoint(0.5, 0.5);

        node.addComponent(Sprite);
        node.addComponent(BattleInformationIconItem);

        return node;
    }

    private updateAllIcons() {
        const removeIds: number[] = [];

        this.records.forEach((record, waveId) => {
            const wave = record.wave;

            if (!wave || wave.isDead()) {
                record.item.setAliveRatio(0);

                if (this.removeDeadWaveIcon) {
                    removeIds.push(waveId);
                }

                return;
            }

            const aliveRatio = wave.getAliveRatio();

            record.item.setAliveRatio(aliveRatio);
            record.item.updateEngageVisual(
                wave.hasEngaged(),
                this.time
            );
        });

        for (let i = 0; i < removeIds.length; i++) {
            this.removeIcon(removeIds[i]);
        }
    }

    private updateBlinkOnly() {
        this.records.forEach((record) => {
            const wave = record.wave;

            if (!wave || wave.isDead()) return;

            record.item.updateEngageVisual(
                wave.hasEngaged(),
                this.time
            );
        });
    }

    private removeIcon(waveId: number) {
        const record = this.records.get(waveId);

        if (!record) return;

        record.item.resetVisual();

        if (this.destroyRemovedIcon) {
            record.node.destroy();
        } else {
            record.node.removeFromParent();
            record.node.active = false;
        }

        this.records.delete(waveId);
    }

    public clearAllIcons() {
        this.records.forEach((record) => {
            if (this.destroyRemovedIcon) {
                record.node.destroy();
            } else {
                record.node.removeFromParent();
            }
        });

        this.records.clear();

        if (this.teamAIconRoot) {
            this.teamAIconRoot.removeAllChildren();
        }

        if (this.teamBIconRoot) {
            this.teamBIconRoot.removeAllChildren();
        }
    }

    private getSpriteFrame(
        team: number,
        unitType: UnitType
    ): SpriteFrame | null {

        const list =
            team === 0
                ? this.teamAIcons
                : this.teamBIcons;

        for (let i = 0; i < list.length; i++) {
            const info = list[i];

            if (info.unitType === unitType) {
                return info.spriteFrame;
            }
        }

        console.warn(
            '[BattleInformationPanel] Missing icon for team/unitType:',
            team,
            unitType
        );

        return null;
    }
}