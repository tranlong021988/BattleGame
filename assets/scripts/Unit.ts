import { _decorator, Component, Tween, Vec3 } from 'cc';
import { RVOSimulator, RVOAgent } from './rvo/RVO';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('Unit')
export class Unit extends Component {
    
    @property moveSpeed = 2;
    @property radius = 0.5;
    @property attackRange = 1;

    @property rotationSpeed = 10;

    // ===== anti jitter =====
    @property moveThreshold = 0.2;
    @property velThreshold = 0.05;
    @property visualThreshold = 0.03;

    sim!: RVOSimulator;
    agent!: RVOAgent;

    @property enemy: Unit | null = null;
    onBusy = false;

    updateOffset = 0;

    private lastStablePos = { x: 0, z: 0 };
    private gm!: GameManager;
    private tween:Tween;

    init(sim: RVOSimulator) {
        if(!this.tween){this.tween = new Tween()};
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

        if (this.gm == null) {
            this.gm = this.node.scene.getComponentInChildren(GameManager)!;
        }

        if (!this.gm || !this.agent) return;

        // ===== CHEAP EARLY OUT =====
        const vx = this.agent.vel.x;
        const vz = this.agent.vel.z;
        const speedSq = vx * vx + vz * vz;

        if ((this.gm.frame + this.updateOffset) % this.gm.updateInterval !== 0) {

            // nếu gần như đứng yên thì bỏ luôn sync
            if (speedSq < this.velThreshold * this.velThreshold) {
                return;
            }

            this.sync();
            return;
        }

        if (this.onBusy) {

            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;

            return;
        }

        if (this.enemy && this.enemy.agent) {

            const dx = this.enemy.agent.pos.x - this.agent.pos.x;
            const dz = this.enemy.agent.pos.z - this.agent.pos.z;

            const distSq = dx * dx + dz * dz;
            const attackRangeSq = this.attackRange * this.attackRange;

            if (distSq <= attackRangeSq) {
                 if (!this.onBusy) {
                    this.onBusy = true;
                    this.lookAtEnemy();
                    console.log("engage");
                }
                if(this.enemy.enemy!=this){
                    this.enemy.enemy = this;
                }
                this.agent.locked = true;

                this.sim.setPrefVelocity(this.agent, 0, 0);
                this.agent.vel.x = 0;
                this.agent.vel.z = 0;

                return;
            }

            const dist = Math.sqrt(distSq);

            if (dist > 0.0001) {
                this.sim.setPrefVelocity(
                    this.agent,
                    (dx / dist) * this.agent.maxSpeed,
                    (dz / dist) * this.agent.maxSpeed
                );
            }
            
        }

        this.sync();
    }
   private lookAtEnemy() {

        if (!this.enemy || !this.enemy.node.activeInHierarchy) return;

        const dx = this.enemy.node.worldPosition.x - this.node.worldPosition.x;
        const dz = this.enemy.node.worldPosition.z - this.node.worldPosition.z;

        let targetY = Math.atan2(dx, dz) * 180 / Math.PI;
        const currentY = this.node.eulerAngles.y;

        let diff = (targetY - currentY) % 360;

        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        // ===== already looking =====
        if (Math.abs(diff) < 3) {
            return;
        }

        targetY = currentY + diff;

        this.tween.target(this.node)
            .stop()
            .to(0.12, {
                eulerAngles: new Vec3(0, targetY, 0)
            })
            .start();
    }
    private sync() {

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