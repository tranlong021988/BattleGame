import { _decorator, Component } from 'cc';
import { UnitType } from './BattleTypes';
import { HealthBar3D } from './HealthBar3D';

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

    @property(HealthBar3D)
    healthBar: HealthBar3D | null = null;

    health: number = 30;

    resetForSpawn() {
        this.health = this.maxHealth;
        this.updateHealthBar();
    }

    takeDamage(amount: number) {
        this.health -= amount;

        if (this.health < 0) {
            this.health = 0;
        }

        this.updateHealthBar();
    }

    heal(amount: number) {
        this.health += amount;

        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }

        this.updateHealthBar();
    }

    isDead() {
        return this.health <= 0;
    }

    getHealthRatio() {
        if (this.maxHealth <= 0) {
            return 0;
        }

        return this.health / this.maxHealth;
    }

    private updateHealthBar() {
        if (!this.healthBar) return;

        this.healthBar.setHealthRatio(
            this.getHealthRatio()
        );
    }
}