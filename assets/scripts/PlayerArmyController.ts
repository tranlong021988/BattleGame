import { _decorator, Component, Enum, Event, Node } from 'cc';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

export enum PlayerLane {
    Left = 0,
    Mid = 1,
    Right = 2,
}

Enum(PlayerLane);

@ccclass('PlayerArmyController')
export class PlayerArmyController extends Component {

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property({ min: 0, max: 1, step: 1 })
    team = 0;

    @property({ type: PlayerLane })
    defaultLane: PlayerLane = PlayerLane.Mid;

    @property(Node)
    leftSelected: Node | null = null;

    @property(Node)
    midSelected: Node | null = null;

    @property(Node)
    rightSelected: Node | null = null;

    private selectedLaneId = PlayerLane.Mid;

    onLoad() {
        this.setSelectedLane(this.defaultLane);
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
        const manager =
            this.gameManager ?? GameManager.instance;

        if (!manager) {
            console.warn(
                '[PlayerArmyController] GameManager is not assigned.'
            );
            return;
        }

        const safeUnitName = (unitName ?? '').trim();

        if (!safeUnitName) {
            console.warn(
                '[PlayerArmyController] Unit name is empty.'
            );
            return;
        }

        manager.spawnWaveByName(
            this.team,
            safeUnitName,
            this.selectedLaneId
        );
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

        if (this.leftSelected) {
            this.leftSelected.active =
                safeLaneId === PlayerLane.Left;
        }

        if (this.midSelected) {
            this.midSelected.active =
                safeLaneId === PlayerLane.Mid;
        }

        if (this.rightSelected) {
            this.rightSelected.active =
                safeLaneId === PlayerLane.Right;
        }
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
}
