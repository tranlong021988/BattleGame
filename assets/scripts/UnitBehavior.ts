import { _decorator, Component } from 'cc';
import { Unit } from './Unit';
import { UnitProps } from './UnitProps';
import { GameManager } from './GameManager';
import { CounterSettings } from './CounterSettings';

const { ccclass, property } = _decorator;

@ccclass('UnitBehavior')
export class UnitBehavior extends Component {

    @property
    attackIntervalMin: number = 0.8;

    @property
    attackIntervalMax: number = 1.2;

    gameManager: GameManager | null = null;

    private unit!: Unit;
    private props!: UnitProps;

    private attackTimer = 0;
    private nextAttackInterval = 1;

    onLoad() {
        this.unit = this.getComponent(Unit)!;
        this.props = this.getComponent(UnitProps)!;
    }

    resetForSpawn() {
        this.attackTimer = 0;
        this.randomizeNextAttackInterval();
    }

    configureAttackInterval(
        minInterval: number,
        maxInterval: number
    ) {
        this.attackIntervalMin =
            Math.max(0.05, minInterval);
        this.attackIntervalMax =
            Math.max(
                this.attackIntervalMin,
                maxInterval
            );
    }

    resetForDespawn() {
        this.attackTimer = 0;
    }

    update(deltaTime: number) {
        if (!this.unit || !this.props) return;
        if (!this.node.activeInHierarchy) return;
        if (this.props.isDead()) return;

        if (!this.unit.onBusy) return;
        const enemy = this.unit.getValidEnemyTarget();

        if (!enemy) {
            this.unit.clearEnemy();
            return;
        }

        this.attackTimer += deltaTime;

        if (this.attackTimer < this.nextAttackInterval) {
            return;
        }

        this.attackTimer = 0;
        this.randomizeNextAttackInterval();

        this.dealDamageToEnemy(enemy);
    }

    private dealDamageToEnemy(enemy: Unit) {
        const counter = CounterSettings.instance;

        let finalDamage = this.props.damage;

        if (
            counter &&
            !this.unit.isHero &&
            !enemy.isHero
        ) {
            finalDamage = counter.calculateDamage(
                this.props,
                enemy.props
            );
        } else {
            finalDamage = Math.max(
                1,
                this.props.damage - enemy.props.defense
            );
        }

        enemy.props.takeDamage(finalDamage);

        if (!enemy.props.isDead()) {
            enemy.reactToAttacker(this.unit);
        }

        if (enemy.props.isDead()) {
            const gm =
                this.gameManager ||
                GameManager.instance;

            if (gm) {
                gm.reportKill(
                    this.unit,
                    enemy
                );

                gm.despawnUnit(enemy);
            }

            this.unit.clearEnemy();
        }
    }

    private randomizeNextAttackInterval() {
        const min = Math.max(0.05, this.attackIntervalMin);
        const max = Math.max(min, this.attackIntervalMax);

        this.nextAttackInterval =
            min + Math.random() * (max - min);
    }
}
