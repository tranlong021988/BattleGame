import { _decorator, Component } from 'cc';
import { Unit } from './Unit';

const { ccclass, property } = _decorator;

@ccclass('EnemyFinder')
export class EnemyFinder extends Component {

    static teamA: Unit[] = [];
    static teamB: Unit[] = [];

    @property
    updateInterval = 30;

    private updateOffset = 0;
    private team = 0;
    private unit!: Unit;
    private frame = 0;

    start() {
        this.unit = this.getComponent(Unit)!;
        this.updateOffset = Math.floor(Math.random() * 1000);
    }

    setTeam(team: number) {
        this.team = team;
    }

    update() {

        this.frame++;

        if ((this.frame + this.updateOffset) % this.updateInterval !== 0) {
            return;
        }

        if (!this.unit || !this.unit.agent || this.unit.onBusy) {
            return;
        }

        // Nếu đã có target chase hợp lệ thì giữ nguyên, không đổi liên tục
        if (
            this.unit.enemy &&
            this.unit.enemy.node.activeInHierarchy &&
            this.unit.enemy.agent
        ) {
            return;
        }

        const enemies = this.team === 0
            ? EnemyFinder.teamB
            : EnemyFinder.teamA;

        let best: Unit | null = null;
        let bestDist = Infinity;

        for (let i = 0; i < enemies.length; i++) {

            const e = enemies[i];

            if (!e || !e.node.activeInHierarchy) continue;
            if (!e.agent) continue;

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