import { _decorator, Component } from 'cc';
import { UnitType } from './BattleTypes';

const { ccclass, property } = _decorator;

@ccclass('UnitProps')
export class UnitProps extends Component {

    @property({ type: UnitType })
    unitType: UnitType = UnitType.LightSword;

    @property
    maxHealth: number = 30;

    @property
    damage: number = 1;

    @property
    defense: number = 0;

    health: number = 30;

    resetForSpawn() {
        this.health = this.maxHealth;
    }

    takeDamage(amount: number) {
        this.health -= amount;

        if (this.health < 0) {
            this.health = 0;
        }
    }

    isDead() {
        return this.health <= 0;
    }
}