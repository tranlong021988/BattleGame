import { _decorator, Component } from 'cc';
import { Unit } from './Unit';

const { ccclass } = _decorator;

@ccclass('EnemyFinder')
export class EnemyFinder extends Component {

    static teamA: Unit[] = [];
    static teamB: Unit[] = [];

    private team = 0;
    private unit!: Unit;

    start() {
        this.unit = this.getComponent(Unit)!;
    }

    setTeam(team: number) {
        this.team = team;
    }

    update() {

        if (!this.unit || !this.unit.agent || this.unit.onBusy) return;

        const enemies = this.team === 0
            ? EnemyFinder.teamB
            : EnemyFinder.teamA;

        let best: Unit | null = null;
        let bestDist = Infinity;

        for (const e of enemies) {

            if (!e || !e.node.activeInHierarchy) continue;
            if (!e.agent) continue;
            if (e.onBusy) continue;

            const dx = e.agent.pos.x - this.unit.agent.pos.x;
            const dz = e.agent.pos.z - this.unit.agent.pos.z;

            const d = dx * dx + dz * dz;

            if (d < bestDist) {
                bestDist = d;
                best = e;
            }
        }

        if (best) {
            this.unit.setEnemy(best);
        }
    }
}