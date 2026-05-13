import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UnitProps')
export class UnitProps extends Component {

    @property
    maxHealth: number = 30;

    @property
    health: number = 30;

    @property
    damage: number = 1;

    resetForSpawn() {
        this.health = this.maxHealth;
    }

    isDead() {
        return this.health <= 0;
    }

    takeDamage(amount: number) {
        if (this.isDead()) return;

        this.health -= amount;

        if (this.health < 0) {
            this.health = 0;
        }
    }
}