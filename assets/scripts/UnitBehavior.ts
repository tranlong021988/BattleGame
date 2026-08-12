import { _decorator, Component } from 'cc';
import { Unit } from './Unit';
import { UnitProps } from './UnitProps';
import { CounterSettings } from './CounterSettings';
import { BattleCardModifier } from './BattleCardDatabase';
import type { BattleCardModifiers } from './BattleCardRuntime';

const { ccclass, property } = _decorator;

type UnitBehaviorGameManager = {
    enableBattleTelemetry: boolean;
    spatialGrid: {
        getMaxEnemyRadius(team: number): number;
        queryEnemies(
            team: number,
            x: number,
            z: number,
            radius: number
        ): Unit[];
    } | null;
    teamA: Unit[];
    teamB: Unit[];
    reportDamage(
        attacker: Unit,
        defender: Unit,
        rawDamage: number,
        actualDamage: number,
        isCounterDamage: boolean,
        isAreaDamage: boolean,
        attackBatchId: number
    ): void;
    reportKill(attacker: Unit, defender: Unit): void;
    despawnUnit(unit: Unit): void;
    beginCombatResolution(): void;
    endCombatResolution(): void;
    getBattleCardModifiers(
        team: number,
        family: number,
        opposingFamily?: number
    ): {
        damageMultiplier: number;
        defenseFlat: number;
        damageRadiusMultiplier: number;
        attackRangeMultiplier: number;
        moveSpeedMultiplier: number;
        counterImmune: boolean;
    };
    consumeBattleCardModifier(
        team: number,
        family: number,
        modifier: BattleCardModifier,
        opposingFamily?: number
    ): boolean;
};

@ccclass('UnitBehavior')
export class UnitBehavior extends Component {

    private static nextAttackBatchId = 1;

    @property
    attackIntervalMin: number = 0.8;

    @property
    attackIntervalMax: number = 1.2;

    gameManager: UnitBehaviorGameManager | null = null;

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

        const gm = this.gameManager;
        const attackBatchId =
            gm && gm.enableBattleTelemetry
                ? UnitBehavior.nextAttackBatchId++
                : -1;

        this.unit.consumeAttackRangeCardBudget(enemy);

        if (!gm) {
            this.dealDamageToEnemy(enemy, attackBatchId);
            return;
        }

        gm.beginCombatResolution();

        try {
            this.dealDamageToEnemy(enemy, attackBatchId);
        } finally {
            gm.endCombatResolution();
        }
    }

    private dealDamageToEnemy(
        enemy: Unit,
        attackBatchId: number
    ) {
        const gm = this.gameManager;
        const attackModifiers = gm
            ? gm.getBattleCardModifiers(
                this.unit.team,
                this.props.family,
                enemy.props.family
            )
            : null;

        this.applyDamageToEnemy(
            enemy,
            false,
            attackBatchId,
            attackModifiers
        );
        const usedExpandedRadius = this.dealAreaDamageAround(
            enemy,
            attackBatchId,
            attackModifiers
        );
        this.finishDamagedEnemy(enemy);

        if (gm) {
            gm.consumeBattleCardModifier(
                this.unit.team,
                this.props.family,
                BattleCardModifier.DamagePercent,
                enemy.props.family
            );

            if (usedExpandedRadius) {
                gm.consumeBattleCardModifier(
                    this.unit.team,
                    this.props.family,
                    BattleCardModifier.DamageRadiusPercent,
                    enemy.props.family
                );
            }
        }
    }

    private applyDamageToEnemy(
        enemy: Unit,
        isAreaDamage: boolean,
        attackBatchId: number,
        attackerModifiers: BattleCardModifiers | null
    ) {
        const counter = CounterSettings.instance;
        const gm = this.gameManager;
        const defenderModifiers = gm
            ? gm.getBattleCardModifiers(
                enemy.team,
                enemy.props.family,
                this.props.family
            )
            : null;
        const attackDamage = Math.max(
            0,
            this.props.damage *
            (attackerModifiers
                ? attackerModifiers.damageMultiplier
                : 1)
        );
        const defense = Math.max(
            0,
            enemy.props.defense +
            (defenderModifiers
                ? defenderModifiers.defenseFlat
                : 0)
        );

        const baseDefense = Math.max(0, enemy.props.defense);
        let finalDamage = attackDamage;
        let damageWithoutDefenseCard = attackDamage;
        let isCounterDamage = false;
        let configuredDamageMul = 1;

        if (
            counter &&
            !this.unit.isHero &&
            !enemy.isHero
        ) {
            configuredDamageMul = counter.getDamageMultiplier(
                this.props.family,
                enemy.props.family
            );
            const damageMul = defenderModifiers?.counterImmune
                ? 1
                : configuredDamageMul;

            isCounterDamage =
                damageMul > 1.0001;

            finalDamage = Math.max(
                1,
                attackDamage - defense
            ) * damageMul;
            damageWithoutDefenseCard = Math.max(
                1,
                attackDamage - baseDefense
            ) * damageMul;
        } else {
            finalDamage = Math.max(
                1, attackDamage - defense
            );
            damageWithoutDefenseCard = Math.max(
                1,
                attackDamage - baseDefense
            );
        }

        const actualDamage =
            Math.min(
                Math.max(0, enemy.props.health),
                Math.max(0, finalDamage)
            );

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

        if (!gm || !defenderModifiers) return;

        if (
            defenderModifiers.defenseFlat > 0 &&
            finalDamage + 0.0001 < damageWithoutDefenseCard
        ) {
            gm.consumeBattleCardModifier(
                enemy.team,
                enemy.props.family,
                BattleCardModifier.DefenseFlat,
                this.props.family
            );
        }

        if (
            defenderModifiers.counterImmune &&
            configuredDamageMul > 1.0001
        ) {
            gm.consumeBattleCardModifier(
                enemy.team,
                enemy.props.family,
                BattleCardModifier.CounterImmunity,
                this.props.family
            );
        }
    }

    private finishDamagedEnemy(enemy: Unit) {
        if (!enemy || !enemy.props) return;

        if (!enemy.props.isDead()) {
            enemy.reactToAttacker(this.unit);
            return;
        }

        const gm = this.gameManager;
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
        attackBatchId: number,
        attackerModifiers: BattleCardModifiers | null
    ) {
        const baseDamageRadius = Math.max(
            0,
            this.props.damageRadius
        );
        const damageRadius = Math.max(
            0,
            baseDamageRadius *
            (attackerModifiers
                ? attackerModifiers.damageRadiusMultiplier
                : 1)
        );

        if (damageRadius <= 0) return false;
        if (!primaryTarget || !primaryTarget.agent) return false;

        const gm = this.gameManager;

        if (!gm) return false;

        const expandedRadius = damageRadius >
            baseDamageRadius + 0.0001;
        let usedExpandedRadius = false;

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
            const baseEffectiveRadius =
                Math.max(0, primaryTarget.radius) +
                baseDamageRadius +
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
                attackBatchId,
                attackerModifiers
            );
            this.finishDamagedEnemy(enemy);

            if (
                expandedRadius &&
                dx * dx + dz * dz >
                baseEffectiveRadius * baseEffectiveRadius
            ) {
                usedExpandedRadius = true;
            }
        }

        return usedExpandedRadius;
    }

    private getEnemyListFallback(
        gm: UnitBehaviorGameManager
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
