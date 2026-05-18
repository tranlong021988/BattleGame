import { _decorator, Component, Prefab, Node, instantiate, Vec3 } from 'cc';
import { Unit } from './Unit';
import { EnemyFinder } from './EnemyFinder';
import { RVOSimulator } from './rvo/RVO';
import { UnitProps } from './UnitProps';
import { UnitBehavior } from './UnitBehavior';

const { ccclass } = _decorator;

@ccclass('UnitSpawner')
export class UnitSpawner extends Component {

    private sim!: RVOSimulator;

    private pools: Map<string, Node[]> = new Map();

    init(sim: RVOSimulator) {
        this.sim = sim;
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
        pos: Vec3,
        team: number,
        parent: Node
    ): Unit {
        const node = this.getNode(prefab);

        if (node.parent !== parent) {
            parent.addChild(node);
        }

        node.setWorldPosition(pos);
        node.setRotationFromEuler(0, team === 0 ? 0 : 180, 0);
        node.active = true;

        const unit = node.getComponent(Unit)!;
        const finder = node.getComponent(EnemyFinder)!;
        const props = node.getComponent(UnitProps)!;
        const behavior = node.getComponent(UnitBehavior);

        props.resetForSpawn();

        const forwardX = 0;
        const forwardZ = team === 0 ? 1 : -1;

        unit.enemy = null;
        unit.onBusy = false;
        unit.init(this.sim, team, forwardX, forwardZ);

        finder.resetForSpawn(team);

        if (behavior) {
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

        if (unit.agent) {
            const idx = this.sim.agents.indexOf(unit.agent);

            if (idx >= 0) {
                this.sim.agents.splice(idx, 1);
            }
        }

        unit.resetForDespawn();

        node.active = false;

        const pool = this.getPool(prefab);

        if (pool.indexOf(node) < 0) {
            pool.push(node);
        }
    }

    clearPool() {
        this.pools.clear();
    }
}