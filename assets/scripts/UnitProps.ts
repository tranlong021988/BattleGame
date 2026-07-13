import { _decorator, Component } from 'cc';
import { UnitFamily } from './BattleTypes';
import { HealthBar3D } from './HealthBar3D';

const { ccclass, property } = _decorator;

@ccclass('UnitProps')
export class UnitProps extends Component {

    @property({ type: UnitFamily })
    family: UnitFamily = UnitFamily.Spear;

    @property({
        min: 1,
        max: 3,
        step: 1,
        tooltip: 'Upgrade tier inside the same unit family. Counter rules use family; tier only changes stats/progression.',
    })
    tier: number = 1;

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
        this.refreshHealthBarVisibility(false);
    }

    resetForDespawn() {
        this.refreshHealthBarVisibility(false);
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

    refreshHealthBarVisibility(showUnitHealthBars: boolean) {
        if (!this.healthBar) return;

        this.healthBar.setDisplayActive(
            showUnitHealthBars &&
            !this.isDead() &&
            this.getHealthRatio() < 0.999
        );
    }
}
