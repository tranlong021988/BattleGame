import { _decorator, Component, Vec3 } from 'cc';
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

    @property
    onForward = true;

    @property(Vec3)
    forwardDir = new Vec3(0, 0, 1);

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

    init(sim: RVOSimulator, forwardX: number, forwardZ: number) {
        this.sim = sim;

        const p = this.node.worldPosition;

        this.agent = sim.addAgent(p.x, p.z);
        this.agent.maxSpeed = this.moveSpeed;
        this.agent.radius = this.radius;
        this.agent.locked = false;

        this.enemy = null;
        this.onBusy = false;

        this.onForward = true;
        this.setForwardDir(forwardX, forwardZ);

        this.updateOffset = Math.floor(Math.random() * 1000);

        this.lastStablePos.x = p.x;
        this.lastStablePos.z = p.z;
    }

    private setForwardDir(x: number, z: number) {
        const len = Math.sqrt(x * x + z * z);

        if (len < 0.0001) {
            this.forwardDir.x = 0;
            this.forwardDir.y = 0;
            this.forwardDir.z = 1;
            return;
        }

        this.forwardDir.x = x / len;
        this.forwardDir.y = 0;
        this.forwardDir.z = z / len;
    }

    resetForDespawn() {
        this.enemy = null;
        this.onBusy = false;
        this.onForward = true;

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
        if (this.onForward) return;

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

        this.clearInvalidEnemy();

        // Ưu tiên đánh nếu đã có enemy trong range, kể cả đang onForward
        const nearestInRange = this.findNearestEnemyInAttackRange();

        if (nearestInRange) {
            this.onForward = false;
            this.enemy = nearestInRange;
            this.onBusy = true;
            this.agent.locked = true;

            this.lookAtEnemyInstant();

            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;

            return;
        }

        // ===== FORWARD PHASE =====
        if (this.onForward) {
            this.updateForwardPhase();

            if (this.onForward) {
                this.sim.setPrefVelocity(
                    this.agent,
                    this.forwardDir.x * this.agent.maxSpeed,
                    this.forwardDir.z * this.agent.maxSpeed
                );

                this.sync();
                return;
            }
        }

        // ===== CHASE PHASE =====
        if (!this.enemy) {
            this.enemy = this.findNearestEnemy();
        }

        if (this.enemy && this.enemy.agent) {
            const dx = this.enemy.agent.pos.x - this.agent.pos.x;
            const dz = this.enemy.agent.pos.z - this.agent.pos.z;

            const dist = Math.sqrt(dx * dx + dz * dz);

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

    private updateForwardPhase() {
        if (!this.agent) return;

        const nearestEnemy = this.findNearestEnemy();

        if (!nearestEnemy || !nearestEnemy.agent) {
            return;
        }

        const myZ = this.agent.pos.z;
        const enemyZ = nearestEnemy.agent.pos.z;

        if (Math.abs(this.forwardDir.z) >= Math.abs(this.forwardDir.x)) {
            if (this.forwardDir.z > 0 && myZ >= enemyZ) {
                this.onForward = false;
                return;
            }

            if (this.forwardDir.z < 0 && myZ <= enemyZ) {
                this.onForward = false;
                return;
            }
        } else {
            const myX = this.agent.pos.x;
            const enemyX = nearestEnemy.agent.pos.x;

            if (this.forwardDir.x > 0 && myX >= enemyX) {
                this.onForward = false;
                return;
            }

            if (this.forwardDir.x < 0 && myX <= enemyX) {
                this.onForward = false;
                return;
            }
        }
    }

    private clearInvalidEnemy() {
        if (
            !this.enemy ||
            !this.enemy.node.activeInHierarchy ||
            !this.enemy.agent ||
            !this.enemy.props ||
            this.enemy.props.isDead()
        ) {
            this.enemy = null;
        }
    }

    private findNearestEnemyInAttackRange(): Unit | null {
        if (!this.agent) return null;

        const attackRangeSq = this.attackRange * this.attackRange;
        const enemies = this.getEnemyList();

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];

            if (!this.isValidEnemy(e)) continue;

            const dx = e.agent!.pos.x - this.agent.pos.x;
            const dz = e.agent!.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d <= attackRangeSq && d < bestDistSq) {
                bestDistSq = d;
                best = e;
            }
        }

        return best;
    }

    private findNearestEnemy(): Unit | null {
        if (!this.agent) return null;

        const enemies = this.getEnemyList();

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];

            if (!this.isValidEnemy(e)) continue;

            const dx = e.agent!.pos.x - this.agent.pos.x;
            const dz = e.agent!.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d < bestDistSq) {
                bestDistSq = d;
                best = e;
            }
        }

        return best;
    }

    private isValidEnemy(e: Unit | null): boolean {
        if (!e || e === this) return false;
        if (!e.node.activeInHierarchy) return false;
        if (!e.agent) return false;
        if (!e.props || e.props.isDead()) return false;

        return true;
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