import { _decorator, Component, Prefab, Node, instantiate, Vec3 } from 'cc';
import { Unit } from './Unit';
import { EnemyFinder } from './EnemyFinder';
import { RVOSimulator } from './rvo/RVO';

const { ccclass } = _decorator;

@ccclass('UnitSpawner')
export class UnitSpawner extends Component {

    private sim!: RVOSimulator;

    // pool theo prefab
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

        parent.addChild(node);
        node.setWorldPosition(pos);
        node.active = true;

        const unit = node.getComponent(Unit)!;
        const finder = node.getComponent(EnemyFinder)!;

        // reset state
        unit.enemy = null;
        unit.onBusy = false;
        node.setRotationFromEuler(0, team === 0 ? 0 : 180, 0);
        unit.init(this.sim);
        finder.setTeam(team);

        return unit;
    }

    despawnUnit(unit: Unit, prefab: Prefab) {

        if (!unit || !unit.agent) return;

        const node = unit.node;

        // remove khỏi simulator
        const idx = this.sim.agents.indexOf(unit.agent);
        if (idx >= 0) {
            this.sim.agents.splice(idx, 1);
        }

        // reset state
        unit.enemy = null;
        unit.onBusy = false;

        //node.removeFromParent();
        node.active = false;

        const pool = this.getPool(prefab);
        pool.push(node);
    }

    clearPool() {
        this.pools.clear();
    }
}