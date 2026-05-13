import { _decorator, Component } from 'cc';
import { RVOSimulator, RVOAgent } from './rvo/RVO';
import { EnemyFinder } from './EnemyFinder';
import { UnitProps } from './UnitProps';

const { ccclass, property } = _decorator;

@ccclass('Unit')
export class Unit extends Component {

    @property moveSpeed = 2;
    @property radius = 0.5;
    @property attackRange = 1;

    @property rotationSpeed = 10;

    @property moveThreshold = 0.2;
    @property velThreshold = 0.05;
    @property visualThreshold = 0.03;

    sim: RVOSimulator | null = null;
    agent: RVOAgent | null = null;

    enemy: Unit | null = null;
    onBusy = false;
    updateOffset = 0;

    props!: UnitProps;
    finder!: EnemyFinder;

    private lastStablePos = { x: 0, z: 0 };

    onLoad() {
        this.props = this.getComponent(UnitProps)!;
        this.finder = this.getComponent(EnemyFinder)!;
    }

    init(sim: RVOSimulator) {
        this.sim = sim;

        const p = this.node.worldPosition;

        this.agent = sim.addAgent(p.x, p.z);
        this.agent.maxSpeed = this.moveSpeed;
        this.agent.radius = this.radius;
        this.agent.locked = false;

        this.enemy = null;
        this.onBusy = false;

        this.updateOffset = Math.floor(Math.random() * 1000);

        this.lastStablePos.x = p.x;
        this.lastStablePos.z = p.z;
    }

    resetForDespawn() {
        this.enemy = null;
        this.onBusy = false;

        if (this.agent) {
            this.agent.locked = false;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
        }

        this.agent = null;
        this.sim = null;
    }

    setEnemy(e: Unit | null) {
        if (this.onBusy) return;

        this.enemy = e;

        if (this.enemy && this.enemy.agent) {
            this.lookAtEnemyInstant();
        }
    }

    clearEnemy() {
        this.enemy = null;
        this.onBusy = false;

        if (this.agent) {
            this.agent.locked = false;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
        }
    }

    update() {
        if (!this.sim || !this.agent) return;

        // ===== ENGAGED =====
        if (this.onBusy) {
            if (
                !this.enemy ||
                !this.enemy.node.activeInHierarchy ||
                !this.enemy.agent ||
                !this.enemy.props ||
                this.enemy.props.isDead()
            ) {
                this.clearEnemy();
            } else {
                this.lookAtEnemyInstant();

                this.sim.setPrefVelocity(this.agent, 0, 0);
                this.agent.vel.x = 0;
                this.agent.vel.z = 0;

                return;
            }
        }

        // Clear invalid target
        if (
            !this.enemy ||
            !this.enemy.node.activeInHierarchy ||
            !this.enemy.agent ||
            !this.enemy.props ||
            this.enemy.props.isDead()
        ) {
            this.enemy = null;
        }

        // ===== ENGAGE NEAREST ENEMY INSIDE ATTACK RANGE =====
        const attackRangeSq = this.attackRange * this.attackRange;
        const enemies = this.getEnemyList();

        let nearestInRange: Unit | null = null;
        let nearestDistSq = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];

            if (!e || e === this) continue;
            if (!e.node.activeInHierarchy) continue;
            if (!e.agent) continue;
            if (!e.props || e.props.isDead()) continue;

            const dx = e.agent.pos.x - this.agent.pos.x;
            const dz = e.agent.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d <= attackRangeSq && d < nearestDistSq) {
                nearestDistSq = d;
                nearestInRange = e;
            }
        }

        if (nearestInRange) {
            this.enemy = nearestInRange;
            this.onBusy = true;
            this.agent.locked = true;

            this.lookAtEnemyInstant();

            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;

            return;
        }

        // ===== CHASE CURRENT TARGET =====
        if (this.enemy && this.enemy.agent) {
            const dx = this.enemy.agent.pos.x - this.agent.pos.x;
            const dz = this.enemy.agent.pos.z - this.agent.pos.z;

            const distSq = dx * dx + dz * dz;
            const dist = Math.sqrt(distSq);

            if (dist > 0.0001) {
                this.sim.setPrefVelocity(
                    this.agent,
                    (dx / dist) * this.agent.maxSpeed,
                    (dz / dist) * this.agent.maxSpeed
                );
            }
        } else {
            this.sim.setPrefVelocity(this.agent, 0, 0);
        }

        this.sync();
    }

    private getEnemyList() {
        return this.finder.getTeam() === 0
            ? EnemyFinder.teamB
            : EnemyFinder.teamA;
    }

    private lookAtEnemyInstant() {
        if (!this.agent) return;
        if (!this.enemy || !this.enemy.agent) return;

        const dx = this.enemy.agent.pos.x - this.agent.pos.x;
        const dz = this.enemy.agent.pos.z - this.agent.pos.z;

        if (dx * dx + dz * dz < 0.0001) {
            return;
        }

        const targetY = Math.atan2(dx, dz) * 180 / Math.PI;
        this.node.setRotationFromEuler(0, targetY, 0);
    }

    private sync() {
        if (!this.agent) return;

        const current = this.node.worldPosition;

        const pdx = this.agent.pos.x - current.x;
        const pdz = this.agent.pos.z - current.z;

        const posDistSq = pdx * pdx + pdz * pdz;

        if (posDistSq >= this.visualThreshold * this.visualThreshold) {
            this.node.setWorldPosition(
                this.agent.pos.x,
                current.y,
                this.agent.pos.z
            );
        }

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

        const newY = this.lerpAngle(
            currentY,
            targetAngle,
            this.rotationSpeed * 0.016
        );

        this.node.setRotationFromEuler(0, newY, 0);
    }

    private lerpAngle(a: number, b: number, t: number) {
        let diff = (b - a) % 360;

        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        return a + diff * t;
    }
}