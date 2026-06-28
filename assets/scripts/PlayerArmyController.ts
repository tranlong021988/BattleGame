import {
    _decorator,
    Button,
    Color,
    Component,
    Enum,
    Event,
    EventTouch,
    Node,
    Sprite,
    Tween,
    tween,
    UIOpacity,
    UITransform,
} from 'cc';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

export enum PlayerLane {
    Left = 0,
    Mid = 1,
    Right = 2,
}

Enum(PlayerLane);

@ccclass('PlayerUnitIconBinding')
export class PlayerUnitIconBinding {

    @property(Node)
    node: Node | null = null;

    @property({
        tooltip:
            'Exact UnitPrefabEntry.name in BattleUnitDatabase, e.g. light_sword.',
    })
    unitName = '';
}

@ccclass('PlayerArmyController')
export class PlayerArmyController extends Component {

    private static readonly activeTint =
        new Color(255, 255, 255, 255);
    private static readonly inactiveTint =
        new Color(128, 128, 128, 255);

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property({ min: 0, max: 1, step: 1 })
    team = 0;

    @property({ type: PlayerLane })
    defaultLane: PlayerLane = PlayerLane.Mid;

    @property(Node)
    leftPicker: Node | null = null;

    @property(Node)
    midPicker: Node | null = null;

    @property(Node)
    rightPicker: Node | null = null;

    @property({ type: [PlayerUnitIconBinding] })
    unitIcons: PlayerUnitIconBinding[] = [];

    @property(Node)
    powerBarContainer: Node | null = null;

    @property({ min: 0 })
    coolDownDuration = 3;

    @property({ min: 0 })
    doubleTapWindow = 0.25;

    @property
    enableMaxAliveWaveLimit = true;

    @property({ min: 1 })
    maxAliveWaves = 7;

    @property({ min: 0, max: 255 })
    selectedBlinkMinOpacity = 80;

    @property({ min: 0.01 })
    selectedBlinkDuration = 0.45;

    private selectedLaneId = PlayerLane.Mid;
    private coolDownTimer = 0;
    private powerBar: Node | null = null;
    private powerBarTransform: UITransform | null = null;
    private powerBarMaxWidth = 0;
    private powerBarHeight = 0;
    private unitIconsDimmed = true;
    private pendingUnitTapName = '';
    private pendingUnitTapTimer = 0;
    private pendingUnitTapLaneId = PlayerLane.Mid;

    onLoad() {
        this.cachePowerBar();
        this.resetLanePickerTint();
        this.setSelectedLane(this.defaultLane);
        this.updatePowerBar();
        this.updateUnitIconTint(false);
    }

    onEnable() {
        this.registerInput();
        this.playSelectedBlink();
    }

    onDisable() {
        this.unregisterInput();
        this.stopSelectedBlink();
        this.clearPendingUnitTap();
    }

    update(deltaTime: number) {
        if (this.coolDownTimer > 0) {
            this.coolDownTimer = Math.max(
                0,
                this.coolDownTimer - deltaTime
            );

            this.updatePowerBar();

            if (this.coolDownTimer <= 0) {
                this.updateUnitIconTint(false);
            }
        }

        this.updatePendingUnitTap(deltaTime);
    }

    public selectLane(
        _event: Event,
        laneData: string
    ) {
        const laneId = this.parseLaneId(laneData);

        if (laneId < 0) {
            console.warn(
                `[PlayerArmyController] Unknown lane: "${laneData}". ` +
                'Use left, mid, right, 0, 1, or 2.'
            );
            return;
        }

        this.setSelectedLane(laneId);
    }

    public spawnUnit(
        _event: Event,
        unitName: string
    ) {
        this.spawnByName(unitName ?? '', false);
    }

    public setSelectedLane(laneId: number) {
        const safeLaneId = Math.max(
            PlayerLane.Left,
            Math.min(
                PlayerLane.Right,
                Math.floor(laneId)
            )
        );

        this.selectedLaneId = safeLaneId;

        const leftSelected =
            this.getSelectedNode(this.leftPicker);
        const midSelected =
            this.getSelectedNode(this.midPicker);
        const rightSelected =
            this.getSelectedNode(this.rightPicker);

        this.setSelectedNodeActive(
            leftSelected,
            safeLaneId === PlayerLane.Left
        );
        this.setSelectedNodeActive(
            midSelected,
            safeLaneId === PlayerLane.Mid
        );
        this.setSelectedNodeActive(
            rightSelected,
            safeLaneId === PlayerLane.Right
        );
    }

    public getSelectedLaneId() {
        return this.selectedLaneId;
    }

    private parseLaneId(laneData: string) {
        const value = (laneData ?? '').trim().toLowerCase();

        switch (value) {
            case 'left':
            case '0':
                return PlayerLane.Left;

            case 'mid':
            case 'middle':
            case '1':
                return PlayerLane.Mid;

            case 'right':
            case '2':
                return PlayerLane.Right;
        }

        return -1;
    }

    private registerInput() {
        this.unregisterInput();

        this.registerLanePicker(this.leftPicker);
        this.registerLanePicker(this.midPicker);
        this.registerLanePicker(this.rightPicker);

        for (let i = 0; i < this.unitIcons.length; i++) {
            const item = this.unitIcons[i];
            const node = item ? item.node : null;

            if (!node) continue;

            this.removeManagedClickEvents(
                node,
                'spawnUnit'
            );

            node.on(
                Node.EventType.TOUCH_END,
                this.onUnitIconTap,
                this
            );
        }
    }

    private unregisterInput() {
        this.unregisterLanePicker(this.leftPicker);
        this.unregisterLanePicker(this.midPicker);
        this.unregisterLanePicker(this.rightPicker);

        for (let i = 0; i < this.unitIcons.length; i++) {
            const item = this.unitIcons[i];
            const node = item ? item.node : null;

            if (!node) continue;

            node.off(
                Node.EventType.TOUCH_END,
                this.onUnitIconTap,
                this
            );
        }
    }

    private registerLanePicker(node: Node | null) {
        if (!node) return;

        this.removeManagedClickEvents(
            node,
            'selectLane'
        );

        node.on(
            Node.EventType.TOUCH_END,
            this.onLanePickerTap,
            this
        );
    }

    private unregisterLanePicker(node: Node | null) {
        if (!node) return;

        node.off(
            Node.EventType.TOUCH_END,
            this.onLanePickerTap,
            this
        );
    }

    private onLanePickerTap(event: EventTouch) {
        const node = event.currentTarget as Node | null;

        if (node === this.leftPicker) {
            this.setSelectedLane(PlayerLane.Left);
            return;
        }

        if (node === this.midPicker) {
            this.setSelectedLane(PlayerLane.Mid);
            return;
        }

        if (node === this.rightPicker) {
            this.setSelectedLane(PlayerLane.Right);
        }
    }

    private onUnitIconTap(event: EventTouch) {
        const node = event.currentTarget as Node | null;

        if (!node) return;

        const unitName =
            this.getUnitNameForIcon(node);

        if (!unitName) {
            console.warn(
                `[PlayerArmyController] Unit icon "${node.name}" has no unitName binding.`
            );
            return;
        }

        this.handleUnitIconTap(unitName);
    }

    private handleUnitIconTap(unitName: string) {
        if (this.isCoolingDown()) {
            this.clearPendingUnitTap();
            this.spawnByName(unitName, false);
            return;
        }

        const window =
            Math.max(0, this.doubleTapWindow);

        if (window <= 0) {
            this.spawnByName(unitName, false);
            return;
        }

        if (
            this.pendingUnitTapTimer > 0 &&
            this.pendingUnitTapName === unitName
        ) {
            const laneId =
                this.pendingUnitTapLaneId;

            this.clearPendingUnitTap();
            this.spawnByName(
                unitName,
                true,
                laneId
            );
            return;
        }

        if (this.pendingUnitTapTimer > 0) {
            this.flushPendingUnitTap();

            if (this.isCoolingDown()) {
                return;
            }
        }

        this.pendingUnitTapName = unitName;
        this.pendingUnitTapTimer = window;
        this.pendingUnitTapLaneId =
            this.selectedLaneId;
    }

    private updatePendingUnitTap(deltaTime: number) {
        if (this.pendingUnitTapTimer <= 0) return;

        this.pendingUnitTapTimer = Math.max(
            0,
            this.pendingUnitTapTimer - deltaTime
        );

        if (this.pendingUnitTapTimer > 0) return;

        this.flushPendingUnitTap();
    }

    private flushPendingUnitTap() {
        const unitName = this.pendingUnitTapName;
        const laneId =
            this.pendingUnitTapLaneId;

        this.clearPendingUnitTap();

        if (!unitName) return;

        this.spawnByName(
            unitName,
            false,
            laneId
        );
    }

    private clearPendingUnitTap() {
        this.pendingUnitTapName = '';
        this.pendingUnitTapTimer = 0;
        this.pendingUnitTapLaneId =
            this.selectedLaneId;
    }

    private spawnByName(
        unitName: string,
        aggressiveForward: boolean,
        laneId: number = this.selectedLaneId
    ) {
        if (this.isCoolingDown()) {
            console.warn(
                `[PlayerArmyController] Spawn is cooling down: ${this.coolDownTimer.toFixed(2)}s remaining.`
            );
            return;
        }

        const manager =
            this.gameManager ?? GameManager.instance;

        if (!manager) {
            console.warn(
                '[PlayerArmyController] GameManager is not assigned.'
            );
            return;
        }

        const safeUnitName = unitName.trim();

        if (!safeUnitName) {
            console.warn(
                '[PlayerArmyController] Unit name is empty.'
            );
            return;
        }

        if (!this.canSpawnMoreWave(manager)) {
            console.warn(
                `[PlayerArmyController] Max alive wave limit reached: ` +
                `${this.getAliveWaveCount(manager)}/${this.getMaxAliveWaves()}.`
            );
            return;
        }

        const wave =
            manager.spawnWaveByName(
                this.team,
                safeUnitName,
                laneId,
                aggressiveForward
            );

        if (!wave) return;

        this.startCoolDown();
    }

    private canSpawnMoreWave(
        manager: GameManager
    ) {
        if (!this.enableMaxAliveWaveLimit) {
            return true;
        }

        return this.getAliveWaveCount(manager) <
            this.getMaxAliveWaves();
    }

    private getMaxAliveWaves() {
        return Math.max(
            1,
            Math.floor(this.maxAliveWaves)
        );
    }

    private getAliveWaveCount(
        manager: GameManager
    ) {
        const waves =
            manager.getWavesByTeam(this.team);

        let count = 0;

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!wave) continue;
            if (wave.isDead()) continue;

            count++;
        }

        return count;
    }

    private getUnitNameForIcon(node: Node) {
        for (let i = 0; i < this.unitIcons.length; i++) {
            const item = this.unitIcons[i];

            if (!item || item.node !== node) continue;

            return (item.unitName || '').trim();
        }

        return '';
    }

    private getSelectedNode(
        picker: Node | null
    ): Node | null {
        if (!picker) return null;

        return picker.getChildByName('selected');
    }

    private setSelectedNodeActive(
        selected: Node | null,
        active: boolean
    ) {
        if (!selected) return;

        if (!active) {
            this.stopSelectedNodeBlink(selected);
            selected.active = false;
            return;
        }

        selected.active = true;
        this.playSelectedNodeBlink(selected);
    }

    private playSelectedBlink() {
        this.playSelectedNodeBlink(
            this.getSelectedNodeByLane(
                this.selectedLaneId
            )
        );
    }

    private stopSelectedBlink() {
        this.stopSelectedNodeBlink(
            this.getSelectedNode(this.leftPicker)
        );
        this.stopSelectedNodeBlink(
            this.getSelectedNode(this.midPicker)
        );
        this.stopSelectedNodeBlink(
            this.getSelectedNode(this.rightPicker)
        );
    }

    private playSelectedNodeBlink(
        selected: Node | null
    ) {
        if (!selected || !selected.active) return;

        const opacity =
            this.getOrAddOpacity(selected);

        this.stopSelectedNodeBlink(selected);

        opacity.opacity = 255;

        const minOpacity =
            Math.max(
                0,
                Math.min(
                    255,
                    Math.floor(
                        this.selectedBlinkMinOpacity
                    )
                )
            );

        const duration =
            Math.max(
                0.01,
                this.selectedBlinkDuration
            );

        tween(opacity)
            .to(duration, { opacity: minOpacity })
            .to(duration, { opacity: 255 })
            .union()
            .repeatForever()
            .start();
    }

    private stopSelectedNodeBlink(
        selected: Node | null
    ) {
        if (!selected) return;

        const opacity =
            selected.getComponent(UIOpacity);

        if (!opacity) return;

        Tween.stopAllByTarget(opacity);
        opacity.opacity = 255;
    }

    private getOrAddOpacity(
        node: Node
    ) {
        let opacity =
            node.getComponent(UIOpacity);

        if (!opacity) {
            opacity =
                node.addComponent(UIOpacity);
        }

        return opacity;
    }

    private getSelectedNodeByLane(
        laneId: number
    ) {
        switch (laneId) {
            case PlayerLane.Left:
                return this.getSelectedNode(
                    this.leftPicker
                );

            case PlayerLane.Right:
                return this.getSelectedNode(
                    this.rightPicker
                );

            default:
                return this.getSelectedNode(
                    this.midPicker
                );
        }
    }

    private removeManagedClickEvents(
        node: Node,
        handler: string
    ) {
        const button = node.getComponent(Button);

        if (!button) return;
        if (!button.clickEvents) return;

        for (
            let i = button.clickEvents.length - 1;
            i >= 0;
            i--
        ) {
            const clickEvent = button.clickEvents[i];

            if (!clickEvent) continue;
            if (clickEvent.target !== this.node) continue;
            if (clickEvent.handler !== handler) continue;

            button.clickEvents.splice(i, 1);
        }
    }

    private cachePowerBar() {
        const container =
            this.powerBarContainer ||
            this.node.getChildByName('power-bar-container');

        this.powerBar = container
            ? container.getChildByName('bar')
            : null;

        this.powerBarTransform = this.powerBar
            ? this.powerBar.getComponent(UITransform)
            : null;

        if (!this.powerBarTransform) {
            this.powerBarMaxWidth = 0;
            this.powerBarHeight = 0;
            return;
        }

        const size =
            this.powerBarTransform.contentSize;

        this.powerBarMaxWidth = size.width;
        this.powerBarHeight = size.height;
    }

    private startCoolDown() {
        this.coolDownTimer = Math.max(
            0,
            this.coolDownDuration
        );

        this.updatePowerBar();
        this.updateUnitIconTint(
            this.isCoolingDown()
        );
    }

    private isCoolingDown() {
        return this.coolDownTimer > 0;
    }

    private updatePowerBar() {
        if (!this.powerBarTransform) return;

        const duration =
            Math.max(0, this.coolDownDuration);

        const progress =
            duration <= 0
                ? 1
                : 1 - this.coolDownTimer / duration;

        const safeProgress =
            Math.max(0, Math.min(1, progress));

        this.powerBarTransform.setContentSize(
            this.powerBarMaxWidth * safeProgress,
            this.powerBarHeight
        );
    }

    private resetLanePickerTint() {
        this.setNodeTint(
            this.leftPicker,
            true
        );
        this.setNodeTint(
            this.midPicker,
            true
        );
        this.setNodeTint(
            this.rightPicker,
            true
        );
    }

    private updateUnitIconTint(dimmed: boolean) {
        if (this.unitIconsDimmed === dimmed) {
            return;
        }

        this.unitIconsDimmed = dimmed;

        for (let i = 0; i < this.unitIcons.length; i++) {
            const item = this.unitIcons[i];
            const node = item ? item.node : null;

            if (!node) continue;

            this.setNodeTint(
                node,
                !dimmed
            );
        }
    }

    private setNodeTint(
        node: Node | null,
        active: boolean
    ) {
        if (!node) return;

        const sprite =
            node.getComponent(Sprite);

        if (!sprite) return;

        sprite.color = active
            ? PlayerArmyController.activeTint
            : PlayerArmyController.inactiveTint;
    }
}
