import { _decorator, Component } from 'cc';
import { RVOSimulator, RVOAgent } from './rvo/RVO';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('Unit')
export class Unit extends Component {

    @property moveSpeed = 2;
    @property radius = 0.5;
    @property attackRange = 1;

    @property rotationSpeed = 10;

    // 🔥 anti jitter
    @property moveThreshold = 0.2;
    @property velThreshold = 0.05;

    sim!: RVOSimulator;
    agent!: RVOAgent;

    enemy: Unit | null = null;
    onBusy = false;

    updateOffset = 0;

    private lastStablePos = { x: 0, z: 0 };
    private gm:GameManager;

    init(sim: RVOSimulator) {

        this.sim = sim;

        const p = this.node.worldPosition;
        this.agent = sim.addAgent(p.x, p.z);

        this.agent.maxSpeed = this.moveSpeed;
        this.agent.radius = this.radius;

        this.updateOffset = Math.floor(Math.random() * 1000);

        this.lastStablePos.x = p.x;
        this.lastStablePos.z = p.z;
    }

    setEnemy(e: Unit | null) {
        this.enemy = e;
        this.onBusy = false;
        this.agent.locked = false;
    }

    update() {
        if(this.gm==null) this.gm= this.node.scene.getComponentInChildren(GameManager);
        if (!this.gm || !this.agent) return;

        if ((this.gm.frame + this.updateOffset) % this.gm.updateInterval !== 0) {
            this.sync();
            return;
        }

        if (this.onBusy) {
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.sync();
            return;
        }

        if (this.enemy && this.enemy.agent) {

            const dx = this.enemy.agent.pos.x - this.agent.pos.x;
            const dz = this.enemy.agent.pos.z - this.agent.pos.z;

            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist <= this.attackRange) {

                this.onBusy = true;
                this.enemy.onBusy = true;

                this.agent.locked = true;
                this.enemy.agent.locked = true;

                return;
            }

            this.sim.setPrefVelocity(
                this.agent,
                (dx / dist) * this.agent.maxSpeed,
                (dz / dist) * this.agent.maxSpeed
            );
        }

        this.sync();
    }

    private sync() {

        this.node.setWorldPosition(
            this.agent.pos.x,
            this.node.worldPosition.y,
            this.agent.pos.z
        );

        // ===== ROTATION (ANTI JITTER) =====
        const vx = this.agent.vel.x;
        const vz = this.agent.vel.z;

        const speedSq = vx * vx + vz * vz;

        if (speedSq < this.velThreshold * this.velThreshold) return;

        const dx = this.agent.pos.x - this.lastStablePos.x;
        const dz = this.agent.pos.z - this.lastStablePos.z;

        const distSq = dx * dx + dz * dz;

        if (distSq < this.moveThreshold * this.moveThreshold) return;

        this.lastStablePos.x = this.agent.pos.x;
        this.lastStablePos.z = this.agent.pos.z;

        const targetAngle = Math.atan2(vx, vz) * 180 / Math.PI;
        const currentY = this.node.eulerAngles.y;

        const newY = this.lerpAngle(currentY, targetAngle, this.rotationSpeed * 0.016);

        this.node.setRotationFromEuler(0, newY, 0);
    }

    private lerpAngle(a: number, b: number, t: number) {

        let diff = (b - a) % 360;

        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        return a + diff * t;
    }
}