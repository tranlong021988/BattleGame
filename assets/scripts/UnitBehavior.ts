import { _decorator, Component } from 'cc';
import { Unit } from './Unit';
import { UnitProps } from './UnitProps';
import { GameManager } from './GameManager';
import { CounterSettings } from './CounterSettings';

const { ccclass, property } = _decorator;

@ccclass('UnitBehavior')
export class UnitBehavior extends Component {

    private static nextAttackBatchId = 1;

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

        if (
            this.unit.isRangedCombatRepositioning()
        ) {
            return;
        }

        this.attackTimer += deltaTime;

        if (this.attackTimer < this.nextAttackInterval) {
            return;
        }

        if (!this.unit.isCurrentEnemyInAttackRange()) {
            this.unit.disengageCurrentEnemyForChase();
            return;
        }

        this.attackTimer = 0;
        this.randomizeNextAttackInterval();

        const gm =
            this.gameManager ||
            GameManager.instance;
        const attackBatchId =
            gm && gm.enableBattleTelemetry
                ? UnitBehavior.nextAttackBatchId++
                : -1;

        this.dealDamageToEnemy(enemy, attackBatchId);
    }

    private dealDamageToEnemy(
        enemy: Unit,
        attackBatchId: number
    ) {
        this.applyDamageToEnemy(enemy, false, attackBatchId);
        this.dealAreaDamageAround(enemy, attackBatchId);
        this.finishDamagedEnemy(enemy);
    }

    private applyDamageToEnemy(
        enemy: Unit,
        isAreaDamage: boolean,
        attackBatchId: number
    ) {
        const counter = CounterSettings.instance;

        let finalDamage = this.props.damage;
        let isCounterDamage = false;

        if (
            counter &&
            !this.unit.isHero &&
            !enemy.isHero
        ) {
            const damageMul =
                counter.getDamageMultiplier(
                    this.props.family,
                    enemy.props.family
                );

            isCounterDamage =
                damageMul > 1.0001;

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

        const actualDamage =
            Math.min(
                Math.max(0, enemy.props.health),
                Math.max(0, finalDamage)
            );

        const gm =
            this.gameManager ||
            GameManager.instance;

        if (gm) {
            gm.reportDamage(
                this.unit,
                enemy,
                finalDamage,
                actualDamage,
                isCounterDamage,
                isAreaDamage,
                attackBatchId
            );
        }

        enemy.props.takeDamage(finalDamage);
    }

    private finishDamagedEnemy(enemy: Unit) {
        if (!enemy || !enemy.props) return;

        if (!enemy.props.isDead()) {
            enemy.reactToAttacker(this.unit);
            return;
        }

        const gm =
            this.gameManager ||
            GameManager.instance;
        const wasCurrentTarget =
            this.unit.getValidEnemyTarget() === enemy;

        if (gm) {
            gm.reportKill(
                this.unit,
                enemy
            );

            gm.despawnUnit(enemy);
        }

        if (wasCurrentTarget) {
            this.unit.clearEnemy();
        }
    }

    private dealAreaDamageAround(
        primaryTarget: Unit,
        attackBatchId: number
    ) {
        const damageRadius =
            Math.max(0, this.props.damageRadius);

        if (damageRadius <= 0) return;
        if (!primaryTarget || !primaryTarget.agent) return;

        const gm =
            this.gameManager ||
            GameManager.instance;

        if (!gm) return;

        const maxEnemyRadius =
            gm.spatialGrid
                ? gm.spatialGrid.getMaxEnemyRadius(
                    this.unit.team
                )
                : primaryTarget.radius;
        const queryRadius =
            Math.max(0, primaryTarget.radius) +
            damageRadius +
            Math.max(0, maxEnemyRadius);
        const enemies =
            gm.spatialGrid
                ? gm.spatialGrid.queryEnemies(
                    this.unit.team,
                    primaryTarget.agent.pos.x,
                    primaryTarget.agent.pos.z,
                    queryRadius
                )
                : this.getEnemyListFallback(gm);

        const centerX = primaryTarget.agent.pos.x;
        const centerZ = primaryTarget.agent.pos.z;

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            if (!enemy || enemy === primaryTarget) continue;
            if (!enemy.agent) continue;
            if (!enemy.props || enemy.props.isDead()) continue;

            const effectiveRadius =
                Math.max(0, primaryTarget.radius) +
                damageRadius +
                Math.max(0, enemy.radius);
            const dx = enemy.agent.pos.x - centerX;
            const dz = enemy.agent.pos.z - centerZ;

            if (
                dx * dx + dz * dz >
                effectiveRadius * effectiveRadius
            ) {
                continue;
            }

            this.applyDamageToEnemy(
                enemy,
                true,
                attackBatchId
            );
            this.finishDamagedEnemy(enemy);
        }
    }

    private getEnemyListFallback(
        gm: GameManager
    ): Unit[] {
        return this.unit.team === 0
            ? gm.teamB
            : gm.teamA;
    }

    private randomizeNextAttackInterval() {
        const min = Math.max(0.05, this.attackIntervalMin);
        const max = Math.max(min, this.attackIntervalMax);

        this.nextAttackInterval =
            min + Math.random() * (max - min);
    }
}
