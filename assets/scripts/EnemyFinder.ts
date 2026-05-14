import { _decorator, Component } from 'cc';
import { Unit } from './Unit';

const { ccclass, property } = _decorator;

@ccclass('EnemyFinder')
export class EnemyFinder extends Component {

    static teamA: Unit[] = [];
    static teamB: Unit[] = [];

    @property
    updateInterval = 30;

    private unit!: Unit;

    private team = 0;
    private frame = 0;
    private updateOffset = 0;

    onLoad() {
        this.unit = this.getComponent(Unit)!;
    }

    resetForSpawn(team: number) {
        this.team = team;
        this.frame = 0;
        this.updateOffset = Math.floor(Math.random() * 1000);
    }

    setTeam(team: number) {
        this.team = team;
    }

    getTeam() {
        return this.team;
    }

    update() {
        if (!this.node.activeInHierarchy) return;
        if (!this.unit.agent) return;
        if (this.unit.onBusy) return;

        // Khi còn forward phase thì không auto target.
        if (this.unit.onForward) return;

        this.frame++;

        if ((this.frame + this.updateOffset) % this.updateInterval !== 0) {
            return;
        }

        if (
            this.unit.enemy &&
            this.unit.enemy.node.activeInHierarchy &&
            this.unit.enemy.agent &&
            this.unit.enemy.props &&
            !this.unit.enemy.props.isDead()
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

            if (!e || e === this.unit) continue;
            if (!e.node.activeInHierarchy) continue;
            if (!e.agent) continue;
            if (!e.props || e.props.isDead()) continue;

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