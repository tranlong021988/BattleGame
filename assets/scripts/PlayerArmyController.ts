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
        new Color(0, 0, 0, 255);
    private static readonly unitCooldownTint =
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

    private selectedLaneId = PlayerLane.Mid;
    private coolDownTimer = 0;
    private powerBar: Node | null = null;
    private powerBarTransform: UITransform | null = null;
    private powerBarMaxWidth = 0;
    private powerBarHeight = 0;
    private lanePickersDimmed = true;
    private unitIconsDimmed = true;
    private maxAliveWaveBlocked = false;
    private selectedUnitName = '';
    private pendingLaneTapTimer = 0;
    private pendingLaneTapLaneId = PlayerLane.Mid;
    private pendingLaneTapUnitName = '';

    onLoad() {
        this.cachePowerBar();
        this.resetLanePickerTint();
        this.setSelectedLane(this.defaultLane);
        this.setSelectedUnit('');
        this.updatePowerBar();
        this.updateLanePickerTint(false);
        this.updateUnitIconTint(false);
    }

    onEnable() {
        this.registerInput();
    }

    onDisable() {
        this.unregisterInput();
        this.clearPendingLaneTap();
    }

    update(deltaTime: number) {
        if (this.coolDownTimer > 0) {
            this.coolDownTimer = Math.max(
                0,
                this.coolDownTimer - deltaTime
            );

            this.updatePowerBar();

            if (this.coolDownTimer <= 0) {
                this.updateLanePickerTint(false);
            }
        }

        this.refreshSpawnAvailability();
        this.updatePendingLaneTap(deltaTime);
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

        this.handleLaneTap(laneId);
    }

    public spawnUnit(
        _event: Event,
        unitName: string
    ) {
        this.setSelectedUnit(unitName ?? '');
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
        this.hideLaneSelectedNodes();
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
            this.handleLaneTap(PlayerLane.Left);
            return;
        }

        if (node === this.midPicker) {
            this.handleLaneTap(PlayerLane.Mid);
            return;
        }

        if (node === this.rightPicker) {
            this.handleLaneTap(PlayerLane.Right);
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

        this.setSelectedUnit(unitName);
    }

    private handleLaneTap(laneId: number) {
        if (this.isCoolingDown()) {
            this.clearPendingLaneTap();
            console.warn(
                `[PlayerArmyController] Spawn is cooling down: ${this.coolDownTimer.toFixed(2)}s remaining.`
            );
            return;
        }

        if (this.isMaxAliveWaveBlocked()) {
            this.clearPendingLaneTap();
            const manager =
                this.getGameManager();
            const aliveCount = manager
                ? manager.getAliveWaveCount(this.team)
                : 0;

            console.warn(
                `[PlayerArmyController] Max alive wave limit reached: ` +
                `${aliveCount}/${this.getMaxAliveWaves()}.`
            );
            return;
        }

        if (!this.selectedUnitName) {
            console.warn(
                '[PlayerArmyController] Select a unit icon before tapping a lane.'
            );
            return;
        }

        this.setSelectedLane(laneId);

        const window =
            Math.max(0, this.doubleTapWindow);

        if (window <= 0) {
            this.spawnByName(
                this.selectedUnitName,
                false,
                laneId
            );
            return;
        }

        if (
            this.pendingLaneTapTimer > 0 &&
            this.pendingLaneTapLaneId === laneId
        ) {
            const unitName =
                this.pendingLaneTapUnitName ||
                this.selectedUnitName;

            this.clearPendingLaneTap();
            this.spawnByName(
                unitName,
                true,
                laneId
            );
            return;
        }

        if (this.pendingLaneTapTimer > 0) {
            this.flushPendingLaneTap();

            if (this.isCoolingDown()) {
                return;
            }
        }

        this.pendingLaneTapTimer = window;
        this.pendingLaneTapLaneId = laneId;
        this.pendingLaneTapUnitName =
            this.selectedUnitName;
    }

    private updatePendingLaneTap(deltaTime: number) {
        if (this.pendingLaneTapTimer <= 0) return;

        this.pendingLaneTapTimer = Math.max(
            0,
            this.pendingLaneTapTimer - deltaTime
        );

        if (this.pendingLaneTapTimer > 0) return;

        this.flushPendingLaneTap();
    }

    private flushPendingLaneTap() {
        const unitName =
            this.pendingLaneTapUnitName ||
            this.selectedUnitName;
        const laneId =
            this.pendingLaneTapLaneId;

        this.clearPendingLaneTap();

        if (!unitName) return;

        this.spawnByName(
            unitName,
            false,
            laneId
        );
    }

    private clearPendingLaneTap() {
        this.pendingLaneTapTimer = 0;
        this.pendingLaneTapLaneId =
            this.selectedLaneId;
        this.pendingLaneTapUnitName = '';
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
                `${manager.getAliveWaveCount(this.team)}/${this.getMaxAliveWaves()}.`
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

        this.setSelectedUnit('');
        this.setLanePickersVisible(false);
        this.startCoolDown();
    }

    private canSpawnMoreWave(
        manager: GameManager
    ) {
        if (!this.enableMaxAliveWaveLimit) {
            return true;
        }

        return manager.getAliveWaveCount(this.team) <
            this.getMaxAliveWaves();
    }

    private getMaxAliveWaves() {
        return Math.max(
            1,
            Math.floor(this.maxAliveWaves)
        );
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

        selected.active = active;
    }

    private hideLaneSelectedNodes() {
        this.setSelectedNodeActive(
            this.getSelectedNode(this.leftPicker),
            false
        );
        this.setSelectedNodeActive(
            this.getSelectedNode(this.midPicker),
            false
        );
        this.setSelectedNodeActive(
            this.getSelectedNode(this.rightPicker),
            false
        );
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
        this.updateLanePickerTint(
            this.isCoolingDown()
        );
        this.updateUnitIconTint(
            this.isSpawnInputBlocked()
        );
    }

    private isCoolingDown() {
        return this.coolDownTimer > 0;
    }

    private isSpawnInputBlocked() {
        return this.isCoolingDown() ||
            this.maxAliveWaveBlocked;
    }

    private refreshSpawnAvailability() {
        const blocked =
            this.isMaxAliveWaveBlocked();

        if (this.maxAliveWaveBlocked !== blocked) {
            this.maxAliveWaveBlocked = blocked;

            if (blocked) {
                this.clearPendingLaneTap();
                this.setLanePickersVisible(false);
            } else if (
                this.selectedUnitName &&
                this.canAffordUnitName(this.selectedUnitName)
            ) {
                this.setLanePickersVisible(true);
            }
        }

        this.updateUnitIconTint(
            this.isSpawnInputBlocked()
        );
    }

    private isMaxAliveWaveBlocked() {
        if (!this.enableMaxAliveWaveLimit) {
            return false;
        }

        const manager =
            this.getGameManager();

        if (!manager) return false;

        return !this.canSpawnMoreWave(manager);
    }

    private getGameManager() {
        return this.gameManager ?? GameManager.instance;
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

    private updateLanePickerTint(dimmed: boolean) {
        if (this.lanePickersDimmed === dimmed) {
            return;
        }

        this.lanePickersDimmed = dimmed;

        this.setNodeTint(
            this.leftPicker,
            !dimmed
        );
        this.setNodeTint(
            this.midPicker,
            !dimmed
        );
        this.setNodeTint(
            this.rightPicker,
            !dimmed
        );
    }

    private updateUnitIconTint(dimmed: boolean) {
        if (this.unitIconsDimmed === dimmed) {
            this.refreshUnitIconAffordTint(dimmed);
            return;
        }

        this.unitIconsDimmed = dimmed;
        this.refreshUnitIconAffordTint(dimmed);
    }

    private refreshUnitIconAffordTint(dimmed: boolean) {
        for (let i = 0; i < this.unitIcons.length; i++) {
            const item = this.unitIcons[i];
            const node = item ? item.node : null;
            const unitName =
                item ? item.unitName.trim() : '';
            const canUse =
                !!unitName &&
                !dimmed &&
                this.canAffordUnitName(unitName);

            this.setNodeTint(
                node,
                canUse,
                PlayerArmyController.unitCooldownTint
            );
        }
    }

    private setSelectedUnit(unitName: string) {
        const safeUnitName =
            (unitName || '').trim();
        const canAfford =
            !!safeUnitName &&
            this.canAffordUnitName(safeUnitName);
        const maxBlocked =
            this.isMaxAliveWaveBlocked();

        this.maxAliveWaveBlocked = maxBlocked;

        this.selectedUnitName = safeUnitName;
        this.setLanePickersVisible(
            canAfford &&
            !this.isCoolingDown() &&
            !maxBlocked
        );
        this.updateUnitIconTint(
            this.isSpawnInputBlocked()
        );

        for (let i = 0; i < this.unitIcons.length; i++) {
            const item = this.unitIcons[i];
            const node = item ? item.node : null;
            const active =
                !!safeUnitName &&
                !!item &&
                item.unitName.trim() === safeUnitName;

            this.setSelectedNodeActive(
                this.getSelectedNode(node),
                active
            );
        }
    }

    private canAffordUnitName(unitName: string) {
        const manager =
            this.gameManager ?? GameManager.instance;

        if (!manager) return false;

        const entries =
            manager.getTeamEntries(this.team);

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!entry) continue;
            if (entry.name !== unitName) continue;

            return manager.canAffordEntry(
                this.team,
                entry
            );
        }

        return false;
    }

    private setLanePickersVisible(visible: boolean) {
        const container =
            this.getLanePickerContainer();

        if (container) {
            container.active = visible;
            return;
        }

        this.setLanePickerNodesVisible(visible);
    }

    private getLanePickerContainer() {
        const parent =
            this.leftPicker ? this.leftPicker.parent : null;

        if (
            parent &&
            this.midPicker &&
            this.rightPicker &&
            this.midPicker.parent === parent &&
            this.rightPicker.parent === parent
        ) {
            return parent;
        }

        return null;
    }

    private setLanePickerNodesVisible(visible: boolean) {
        if (this.leftPicker) {
            this.leftPicker.active = visible;
        }

        if (this.midPicker) {
            this.midPicker.active = visible;
        }

        if (this.rightPicker) {
            this.rightPicker.active = visible;
        }
    }

    private setNodeTint(
        node: Node | null,
        active: boolean,
        inactiveTint: Color =
            PlayerArmyController.inactiveTint
    ) {
        if (!node) return;

        const sprite =
            node.getComponent(Sprite);

        if (!sprite) return;

        sprite.color = active
            ? PlayerArmyController.activeTint
            : inactiveTint;
    }
}
