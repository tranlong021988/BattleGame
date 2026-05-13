import { _decorator, Component } from 'cc';
import { GameManager } from './GameManager';
import { Unit } from './Unit';
import { UnitProps } from './UnitProps';

const { ccclass, property } = _decorator;

@ccclass('UnitBehavior')
export class UnitBehavior extends Component {

    @property(GameManager)
    public gameManager: GameManager = null!;

    @property
    public attackInterval: number = 0.5;

    private unit!: Unit;
    private props!: UnitProps;

    private attackTimer = 0;
    private deadHandled = false;

    onLoad() {
        this.unit = this.getComponent(Unit)!;
        this.props = this.getComponent(UnitProps)!;
    }

    resetForSpawn() {
        this.attackTimer = 0;
        this.deadHandled = false;
    }

    resetForDespawn() {
        this.attackTimer = 0;
        this.deadHandled = true;
    }

    update(deltaTime: number) {
        if (!this.node.activeInHierarchy) return;

        // ===== DEAD =====
        if (this.props.isDead()) {
            this.handleDeath();
            return;
        }

        // ===== NOT ATTACKING =====
        if (!this.unit.onBusy) {
            this.attackTimer = 0;
            return;
        }

        const enemy = this.unit.enemy;

        if (!enemy || !enemy.node.activeInHierarchy || !enemy.props) {
            this.unit.clearEnemy();
            this.attackTimer = 0;
            return;
        }

        if (enemy.props.isDead()) {
            this.unit.clearEnemy();
            this.attackTimer = 0;
            return;
        }

        this.attackTimer += deltaTime;

        if (this.attackTimer >= this.attackInterval) {
            this.attackTimer = 0;
            enemy.props.takeDamage(this.props.damage);
        }
    }

    private handleDeath() {
        if (this.deadHandled) return;

        this.deadHandled = true;
        this.attackTimer = 0;

        this.unit.clearEnemy();

        if (this.gameManager) {
            this.gameManager.despawnUnit(this.unit);
        }
    }
}