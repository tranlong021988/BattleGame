import { _decorator, Component, Prefab, Node, instantiate, Vec3 } from 'cc';
import { Unit } from './Unit';
import { UnitProps } from './UnitProps';
import { UnitBehavior } from './UnitBehavior';
import { UnitFamily } from './BattleTypes';

const { ccclass } = _decorator;

@ccclass('UnitSpawner')
export class UnitSpawner extends Component {

    private sim: any = null;

    private pools: Map<string, Node[]> = new Map();

    init(sim: any) {
        this.sim = sim;
    }

    onDestroy() {
        this.clearPool();
        this.sim = null;
    }

    prewarm(prefab: Prefab, count: number, parent: Node) {
        const pool = this.getPool(prefab);
        const safeCount = Math.max(0, Math.floor(count));

        for (let i = 0; i < safeCount; i++) {
            const node = instantiate(prefab);

            parent.addChild(node);
            node.active = false;

            pool.push(node);
        }
    }

    getPoolCount(prefab: Prefab): number {
        return this.getPool(prefab).length;
    }

    private getPool(prefab: Prefab): Node[] {
        const key = prefab.uuid;

        let pool = this.pools.get(key);

        if (!pool) {
            pool = [];
            this.pools.set(key, pool);
        }

        return pool;
    }

    private getNode(prefab: Prefab): Node {
        const pool = this.getPool(prefab);

        if (pool.length > 0) {
            const node = pool.pop()!;
            node.active = true;
            return node;
        }

        return instantiate(prefab);
    }

    spawnUnit(
        prefab: Prefab,
        unitTypeName: string,
        family: UnitFamily,
        tier: number,
        pos: Vec3,
        team: number,
        parent: Node,
        maxSpeed: number,
        canBePush: boolean,
        canBePassedThroughByForwardAlly: boolean,
        attackRange: number,
        attackIntervalMin: number,
        attackIntervalMax: number,
        health: number,
        damage: number,
        defense: number
    ): Unit {
        const node = this.getNode(prefab);

        if (node.parent !== parent) {
            parent.addChild(node);
        }

        node.setWorldPosition(pos);
        node.setRotationFromEuler(0, team === 0 ? 0 : 180, 0);
        node.active = true;

        const unit = node.getComponent(Unit)!;
        const props = node.getComponent(UnitProps)!;
        const behavior = node.getComponent(UnitBehavior);

        unit.moveSpeed = maxSpeed;
        unit.canBePush = canBePush;
        unit.canBePassedThroughByForwardAlly =
            canBePassedThroughByForwardAlly;
        unit.attackRange = Math.max(0, attackRange);

        props.family = family;
        props.tier = Math.max(1, Math.min(3, Math.floor(tier)));
        props.maxHealth = health;
        props.damage = damage;
        props.defense = defense;
        props.resetForSpawn();

        const forwardX = 0;
        const forwardZ = team === 0 ? 1 : -1;

        unit.clearEnemy();
        unit.init(this.sim, team, unitTypeName, forwardX, forwardZ);

        if (behavior) {
            behavior.configureAttackInterval(
                attackIntervalMin,
                attackIntervalMax
            );
            behavior.resetForSpawn();
        }

        return unit;
    }

    despawnUnit(unit: Unit, prefab: Prefab) {
        if (!unit) return;

        const node = unit.node;

        const behavior = node.getComponent(UnitBehavior);

        if (behavior) {
            behavior.resetForDespawn();
        }

        this.removeAgentFromSimulator(unit);

        unit.resetForDespawn();

        node.active = false;

        const pool = this.getPool(prefab);

        if (pool.indexOf(node) < 0) {
            pool.push(node);
        }
    }

    private removeAgentFromSimulator(unit: Unit) {
        if (!this.sim || !unit.agent) return;

        if (typeof this.sim.removeAgent === 'function') {
            this.sim.removeAgent(unit.agent);
            return;
        }

        if (this.sim.agents && Array.isArray(this.sim.agents)) {
            const idx = this.sim.agents.indexOf(unit.agent);

            if (idx >= 0) {
                this.sim.agents.splice(idx, 1);
            }
        }
    }

    clearPool() {
        this.pools.forEach((pool) => {
            for (let i = 0; i < pool.length; i++) {
                const node = pool[i];

                if (node && node.isValid) {
                    node.destroy();
                }
            }

            pool.length = 0;
        });

        this.pools.clear();
    }
}
