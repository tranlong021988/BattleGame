import { _decorator, Component, Node, Vec3 } from 'cc';
import { EnemyFinder } from './EnemyFinder';
import { UnitProps } from './UnitProps';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('Unit')
export class Unit extends Component {

    static visualLerpT = 1;

    @property(Node)
    visualRoot: Node | null = null;

    @property
    visualYawOffset = 0;

    @property moveSpeed = 2;
    @property radius = 0.5;
    @property attackRange = 1;

    @property targetSearchRange = 60;
    @property attackCheckIntervalFrames = 2;
    @property targetSearchIntervalFrames = 6;

    @property rotationSpeed = 10;

    @property moveThreshold = 0.2;
    @property visualThreshold = 0.01;

    @property onForward = true;
    @property isSteady = false;

    @property(Vec3)
    forwardDir = new Vec3(0, 0, 1);

    @property enableAllyOvertake = true;
    @property overtakeLookAhead = 2.2;
    @property overtakeSideRange = 1.2;
    @property overtakeSideStrength = 0.75;
    @property overtakeSpeedDiff = 0.15;
    @property laneReturnTolerance = 0.35;

    team = 0;
    unitTypeName = '';
    isHero = false;
    laneId = -1;
    forwardLaneOffsetX = 0;
    returningToWaveLaneSlot = false;

    sim: any = null;
    agent: any = null;

    enemy: Unit | null = null;
    onBusy = false;
    updateOffset = 0;

    props!: UnitProps;
    finder!: EnemyFinder;

    private initialYaw = 0;

    private lastStablePos = { x: 0, z: 0 };
    private tempPos = new Vec3();

    private frameCounter = 0;
    private cachedNearestInRange: Unit | null = null;
    private cachedNearestEnemy: Unit | null = null;
    private forwardAdjacentTarget: Unit | null = null;

    onLoad() {
        this.props = this.getComponent(UnitProps)!;
        this.finder = this.getComponent(EnemyFinder)!;
    }

    init(
        sim: any,
        team: number,
        unitTypeName: string,
        forwardX: number,
        forwardZ: number
    ) {
        this.team = team;
        this.unitTypeName = unitTypeName;
        this.sim = sim;

        // Unit node chỉ handle position.
        // Rotation visual nằm ở visualRoot.
        this.node.setRotationFromEuler(0, 0, 0);

        const p = this.node.worldPosition;

        this.initialYaw = this.getVisualEulerY();

        this.agent = sim.addAgent(p.x, p.z);
        this.agent.maxSpeed = this.moveSpeed;
        this.agent.radius = this.radius;

        this.enemy = null;
        this.onBusy = false;

        this.onForward = !this.isSteady;
        this.setForwardDir(forwardX, forwardZ);

        this.updateOffset = Math.floor(Math.random() * 1000);
        this.frameCounter = this.updateOffset;

        this.cachedNearestInRange = null;
        this.cachedNearestEnemy = null;
        this.forwardAdjacentTarget = null;

        if (this.laneId < 0) {
            this.laneId = -1;
        }

        this.lastStablePos.x = p.x;
        this.lastStablePos.z = p.z;

        this.applyRuntimeAgentData();
        this.applySteadyState();
    }

    public setSteady(value: boolean, useForwardPhase: boolean = true) {
        this.isSteady = value;

        if (!this.agent) return;

        this.cachedNearestInRange = null;
        this.cachedNearestEnemy = null;
        this.forwardAdjacentTarget = null;

        if (value) {
            this.enemy = null;
            this.onBusy = false;
            this.onForward = false;

            this.initialYaw = this.getVisualEulerY();

            this.agent.locked = true;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.onForward = 0;

            if (this.sim) {
                this.sim.setPrefVelocity(this.agent, 0, 0);
            }

            return;
        }

        this.enemy = null;
        this.onBusy = false;
        this.onForward = useForwardPhase;

        this.agent.locked = false;
        this.agent.vel.x = 0;
        this.agent.vel.z = 0;
        this.agent.prefVel.x = 0;
        this.agent.prefVel.z = 0;
        this.agent.onForward = useForwardPhase ? 1 : 0;

        this.applyRuntimeAgentData();
    }

    private applyRuntimeAgentData() {
        if (!this.agent) return;

        this.agent.team = this.team;
        this.agent.onForward =
            this.onForward &&
            !this.returningToWaveLaneSlot
                ? 1
                : 0;

        this.agent.forwardX = this.forwardDir.x;
        this.agent.forwardZ = this.forwardDir.z;

        this.agent.enableAllyOvertake = this.enableAllyOvertake ? 1 : 0;
        this.agent.overtakeLookAhead = this.overtakeLookAhead;
        this.agent.overtakeSideRange = this.overtakeSideRange;
        this.agent.overtakeSideStrength = this.overtakeSideStrength;
        this.agent.overtakeSpeedDiff = this.overtakeSpeedDiff;
        this.agent.overtakeSeed = this.updateOffset % 2 === 0 ? 1 : -1;
    }

    private applySteadyState() {
        if (!this.agent) return;

        if (this.isSteady) {
            this.agent.locked = true;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.onForward = false;
            this.agent.onForward = 0;
        } else {
            this.agent.locked = false;
        }
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

        this.cachedNearestInRange = null;
        this.cachedNearestEnemy = null;
        this.forwardAdjacentTarget = null;
        this.laneId = -1;
        this.forwardLaneOffsetX = 0;
        this.returningToWaveLaneSlot = false;

        if (this.agent) {
            this.agent.locked = false;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.onForward = 0;
        }

        this.agent = null;
        this.sim = null;
    }

    setEnemy(e: Unit | null) {
        if (this.onBusy) return;
        if (this.onForward) return;

        this.enemy = e;
    }

    clearEnemy() {
        this.enemy = null;
        this.onBusy = false;

        this.cachedNearestInRange = null;
        this.cachedNearestEnemy = null;
        this.forwardAdjacentTarget = null;

        if (this.agent) {
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.locked = this.isSteady;
        }
    }

    public enterFreeHuntMode(
        searchRange: number = this.targetSearchRange
    ) {
        this.isSteady = false;
        this.onForward = false;
        this.returningToWaveLaneSlot = false;
        this.laneId = -1;
        this.forwardLaneOffsetX = 0;
        this.targetSearchRange = Math.max(
            this.targetSearchRange,
            searchRange
        );

        this.cachedNearestInRange = null;
        this.cachedNearestEnemy = null;
        this.forwardAdjacentTarget = null;

        if (!this.onBusy) {
            this.enemy = null;
        }

        if (this.agent) {
            this.agent.locked = this.onBusy;
            this.agent.onForward = 0;

            if (!this.onBusy) {
                this.agent.vel.x = 0;
                this.agent.vel.z = 0;
                this.agent.prefVel.x = 0;
                this.agent.prefVel.z = 0;
            }
        }
    }

    setWaveForwardLane(
        laneId: number,
        laneOffsetX: number = this.forwardLaneOffsetX,
        returnToSlot: boolean = true
    ) {
        if (this.isSteady) return;

        this.laneId = laneId;
        this.forwardLaneOffsetX = laneOffsetX;
        this.returningToWaveLaneSlot = returnToSlot;
        this.enemy = null;
        this.onBusy = false;
        this.onForward = true;

        this.cachedNearestInRange = null;
        this.cachedNearestEnemy = null;
        this.forwardAdjacentTarget = null;

        if (this.agent) {
            this.agent.locked = false;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.onForward = 1;
        }
    }

    enterWaveCombatMode() {
        this.returningToWaveLaneSlot = false;
        this.onForward = false;

        this.cachedNearestEnemy = null;
        this.cachedNearestInRange = null;
        this.forwardAdjacentTarget = null;

        if (this.agent) {
            this.agent.onForward = 0;

            if (!this.onBusy) {
                this.agent.locked = this.isSteady;
            }
        }
    }

    enterWaveFreeHuntMode() {
        this.returningToWaveLaneSlot = false;
        this.onForward = false;

        this.cachedNearestEnemy = null;
        this.cachedNearestInRange = null;
        this.forwardAdjacentTarget = null;

        if (this.agent) {
            this.agent.onForward = 0;

            if (!this.onBusy) {
                this.agent.locked = this.isSteady;
            }
        }
    }

    update(deltaTime: number) {
        if (!this.sim || !this.agent) return;

        this.frameCounter++;
        this.applyRuntimeAgentData();

        if (this.isSteady) {
            this.agent.locked = true;
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.onForward = false;
            this.agent.onForward = 0;
        }

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
                this.lookAtTargetSmooth(this.enemy, deltaTime);

                this.sim.setPrefVelocity(this.agent, 0, 0);
                this.agent.vel.x = 0;
                this.agent.vel.z = 0;

                this.sync(deltaTime, false);
                return;
            }
        }

        this.clearInvalidEnemy();

        const nearestInRange = this.getNearestEnemyInAttackRangeThrottled();

        if (nearestInRange) {
            const gm = GameManager.instance;

            if (gm) {
                gm.onWaveCombatStarted(this);
            }

            this.returningToWaveLaneSlot = false;
            this.onForward = false;
            this.agent.onForward = 0;

            this.enemy = nearestInRange;
            this.onBusy = true;
            this.agent.locked = true;

            this.cachedNearestEnemy = null;
            this.cachedNearestInRange = null;

            this.lookAtTargetSmooth(this.enemy, deltaTime);

            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;

            this.sync(deltaTime, false);
            return;
        }

        if (this.isSteady) {
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;

            this.returnToInitialYawSmooth(deltaTime);

            this.sync(deltaTime, false);
            return;
        }

        if (this.onForward) {
            if (
                this.returningToWaveLaneSlot &&
                !this.shouldReturnToLaneSlot()
            ) {
                this.returningToWaveLaneSlot = false;
            }

            if (!this.returningToWaveLaneSlot) {
                this.updateForwardPhase();
            }

            if (this.onForward) {
                this.agent.onForward =
                    this.returningToWaveLaneSlot
                        ? 0
                        : 1;

                this.updateForwardPrefVelocity();

                this.sync(deltaTime, true);
                return;
            }
        }

        this.agent.onForward = 0;

        if (!this.isValidEnemy(this.enemy)) {
            this.enemy = this.getNearestEnemyThrottled();
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

            this.lookAtTargetSmooth(this.enemy, deltaTime);
            this.sync(deltaTime, false);
        } else {
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.sync(deltaTime, true);
        }
    }

    private shouldRunAttackCheck(): boolean {
        const interval = Math.max(1, Math.floor(this.attackCheckIntervalFrames));
        return this.frameCounter % interval === 0;
    }

    private shouldRunTargetSearch(): boolean {
        const interval = Math.max(1, Math.floor(this.targetSearchIntervalFrames));
        return this.frameCounter % interval === 0;
    }

    private getNearestEnemyInAttackRangeThrottled(): Unit | null {
        if (this.shouldRunAttackCheck()) {
            this.cachedNearestInRange = this.findNearestEnemyInAttackRange();
        } else if (!this.isValidEnemy(this.cachedNearestInRange)) {
            this.cachedNearestInRange = null;
        }

        return this.cachedNearestInRange;
    }

    private getNearestEnemyThrottled(): Unit | null {
        if (this.shouldRunTargetSearch()) {
            this.cachedNearestEnemy = this.findNearestEnemy();
        } else if (!this.isValidEnemy(this.cachedNearestEnemy)) {
            this.cachedNearestEnemy = null;
        }

        return this.cachedNearestEnemy;
    }

    private updateForwardPhase() {
        if (!this.agent) return;

        // Rule ưu tiên:
        // 1. Nếu lane hiện tại có địch, cứ forward cho tới khi vượt qua Z/X của địch cùng lane gần nhất.
        // 2. Nếu lane hiện tại trống, KHÔNG cắt chéo ngay. Tiếp tục forward để tạo pha thọc sườn.
        // 3. Khi đã vượt qua Z/X của địch gần nhất ở lane kề bên, mới free hunt toàn map.
        // 4. Nếu cuối cùng không gặp ai và đã vượt qua line hero địch, cũng free hunt để đánh hero.

        const nearestLaneEnemy =
            this.findNearestEnemyInSameLane();

        if (nearestLaneEnemy && nearestLaneEnemy.agent) {
            this.forwardAdjacentTarget = null;

            if (this.hasPassedTargetAlongForward(nearestLaneEnemy)) {
                this.onForward = false;
            }

            return;
        }

        let nearestAdjacentLaneEnemy =
            this.getForwardAdjacentTarget();

        if (!nearestAdjacentLaneEnemy) {
            nearestAdjacentLaneEnemy =
                this.findNearestEnemyInAdjacentLane(true);
            this.forwardAdjacentTarget =
                nearestAdjacentLaneEnemy;
        }

        if (nearestAdjacentLaneEnemy) {
            if (
                this.hasPassedTargetAlongForward(nearestAdjacentLaneEnemy)
            ) {
                this.forwardAdjacentTarget = null;

                if (
                    !this.releaseWaveForwardToFreeHunt(
                        nearestAdjacentLaneEnemy
                    )
                ) {
                    this.onForward = false;
                }

                return;
            }
        }

        const enemyHero = this.getEnemyHero();

        if (
            enemyHero &&
            this.isValidEnemy(enemyHero) &&
            this.hasPassedTargetAlongForward(enemyHero)
        ) {
            if (
                !this.releaseWaveForwardToHeroFreeHunt(
                    enemyHero
                )
            ) {
                this.onForward = false;
            }

            return;
        }
    }

    private releaseWaveForwardToFreeHunt(target: Unit) {
        const gm = GameManager.instance;

        if (!gm) return false;

        return gm.onWaveForwardPassedAdjacentTarget(
            this,
            target
        );
    }

    private releaseWaveForwardToHeroFreeHunt(hero: Unit) {
        const gm = GameManager.instance;

        if (!gm) return false;

        return gm.onWaveForwardPassedHeroTarget(
            this,
            hero
        );
    }

    private shouldReturnToLaneSlot() {
        if (!this.agent) return false;

        const laneTargetX = this.getCurrentLaneTargetX();

        if (
            !this.returningToWaveLaneSlot ||
            laneTargetX === null
        ) {
            return false;
        }

        const tolerance = Math.max(
            0.01,
            this.laneReturnTolerance
        );

        return Math.abs(
            laneTargetX - this.agent.pos.x
        ) > tolerance;
    }

    private updateForwardPrefVelocity() {
        if (!this.agent) return;

        const laneTargetX = this.getCurrentLaneTargetX();

        if (
            this.returningToWaveLaneSlot &&
            laneTargetX !== null
        ) {
            const dx = laneTargetX - this.agent.pos.x;

            if (this.shouldReturnToLaneSlot()) {
                this.sim.setPrefVelocity(
                    this.agent,
                    Math.sign(dx) * this.agent.maxSpeed,
                    0
                );

                return;
            }
        }

        this.sim.setPrefVelocity(
            this.agent,
            this.forwardDir.x * this.agent.maxSpeed,
            this.forwardDir.z * this.agent.maxSpeed
        );
    }

    private getCurrentLaneTargetX(): number | null {
        if (this.laneId < 0) return null;

        const gm = GameManager.instance;

        if (!gm || !gm.enableLaneSpawn) {
            return null;
        }

        return gm.getLaneCenterX(this.laneId) + this.forwardLaneOffsetX;
    }

    private hasPassedTargetAlongForward(target: Unit): boolean {
        if (!this.agent || !target || !target.agent) return false;

        if (Math.abs(this.forwardDir.z) >= Math.abs(this.forwardDir.x)) {
            const myZ = this.agent.pos.z;
            const targetZ = target.agent.pos.z;

            if (this.forwardDir.z > 0 && myZ >= targetZ) {
                return true;
            }

            if (this.forwardDir.z < 0 && myZ <= targetZ) {
                return true;
            }

            return false;
        }

        const myX = this.agent.pos.x;
        const targetX = target.agent.pos.x;

        if (this.forwardDir.x > 0 && myX >= targetX) {
            return true;
        }

        if (this.forwardDir.x < 0 && myX <= targetX) {
            return true;
        }

        return false;
    }

    private isTargetAheadAlongForward(target: Unit): boolean {
        if (!this.agent || !target || !target.agent) return false;

        if (Math.abs(this.forwardDir.z) >= Math.abs(this.forwardDir.x)) {
            const dz = target.agent.pos.z - this.agent.pos.z;

            return this.forwardDir.z >= 0
                ? dz >= 0
                : dz <= 0;
        }

        const dx = target.agent.pos.x - this.agent.pos.x;

        return this.forwardDir.x >= 0
            ? dx >= 0
            : dx <= 0;
    }

    private getForwardAdjacentTarget(): Unit | null {
        const target = this.forwardAdjacentTarget;

        if (!target) return null;

        if (
            !this.isValidEnemy(target) ||
            !this.isAdjacentLane(target.laneId)
        ) {
            this.forwardAdjacentTarget = null;
            return null;
        }

        return target;
    }

    private findNearestEnemyInSameLane(): Unit | null {
        if (!this.agent) return null;
        if (this.laneId < 0) return this.getNearestEnemyThrottled();

        const enemies = this.getEnemyList();

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        const maxRangeSq =
            this.targetSearchRange *
            this.targetSearchRange;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];

            if (!this.isValidEnemy(e)) continue;
            if (e.laneId !== this.laneId) continue;

            const dx = e.agent!.pos.x - this.agent.pos.x;
            const dz = e.agent!.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d > maxRangeSq) continue;

            if (d < bestDistSq) {
                bestDistSq = d;
                best = e;
            }
        }

        return best;
    }

    private findNearestEnemyInAdjacentLane(
        onlyAhead: boolean = false
    ): Unit | null {
        if (!this.agent) return null;
        if (this.laneId < 0) return null;

        const enemies = this.getEnemyList();

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        const maxRangeSq =
            this.targetSearchRange *
            this.targetSearchRange;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];

            if (!this.isValidEnemy(e)) continue;
            if (!this.isAdjacentLane(e.laneId)) continue;
            if (onlyAhead && !this.isTargetAheadAlongForward(e)) continue;

            const dx = e.agent!.pos.x - this.agent.pos.x;
            const dz = e.agent!.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d > maxRangeSq) continue;

            if (d < bestDistSq) {
                bestDistSq = d;
                best = e;
            }
        }

        return best;
    }

    private isAdjacentLane(otherLaneId: number): boolean {
        if (this.laneId < 0) return false;
        if (otherLaneId < 0) return false;

        return Math.abs(otherLaneId - this.laneId) === 1;
    }

    private getEnemyHero(): Unit | null {
        const gm = GameManager.instance;

        if (!gm) return null;

        return this.team === 0
            ? gm.teamBHero
            : gm.teamAHero;
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

        const gm = GameManager.instance;

        if (gm && gm.spatialGrid) {
            const result = gm.spatialGrid.findNearestEnemyInRange(
                this.team,
                this.agent.pos.x,
                this.agent.pos.z,
                this.attackRange
            );

            if (result) return result;
        }

        return this.findNearestEnemyInAttackRangeFallback();
    }

    private findNearestEnemy(): Unit | null {
        if (!this.agent) return null;

        const gm = GameManager.instance;

        if (gm && gm.spatialGrid) {
            const result = gm.spatialGrid.findNearestEnemy(
                this.team,
                this.agent.pos.x,
                this.agent.pos.z,
                this.targetSearchRange
            );

            if (result) return result;
        }

        return this.findNearestEnemyFallback();
    }

    private findNearestEnemyInAttackRangeFallback(): Unit | null {
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

    private findNearestEnemyFallback(): Unit | null {
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

    private lookAtTargetSmooth(target: Unit, deltaTime: number) {
        if (!this.agent) return;
        if (!target || !target.agent) return;

        const dx = target.agent.pos.x - this.agent.pos.x;
        const dz = target.agent.pos.z - this.agent.pos.z;

        if (dx * dx + dz * dz < 0.0001) return;

        const targetY = Math.atan2(dx, dz) * 180 / Math.PI;
        const currentY = this.getVisualEulerY();

        const newY = this.lerpAngle(
            currentY,
            targetY,
            this.rotationSpeed * deltaTime
        );

        this.setVisualYaw(newY);
    }

    private returnToInitialYawSmooth(deltaTime: number) {
        const currentY = this.getVisualEulerY();

        const newY = this.lerpAngle(
            currentY,
            this.initialYaw,
            this.rotationSpeed * deltaTime
        );

        this.setVisualYaw(newY);
    }

    private sync(deltaTime: number, rotateByVelocity: boolean) {
        if (!this.agent) return;

        const current = this.node.worldPosition;

        const targetX = this.agent.pos.x;
        const targetZ = this.agent.pos.z;

        const dx = targetX - current.x;
        const dz = targetZ - current.z;

        const distSq = dx * dx + dz * dz;
        let visualX = current.x;
        let visualZ = current.z;

        if (distSq >= this.visualThreshold * this.visualThreshold) {
            const t = Unit.visualLerpT;

            visualX = current.x + dx * t;
            visualZ = current.z + dz * t;

            this.tempPos.set(visualX, current.y, visualZ);
            this.node.setWorldPosition(this.tempPos);
        }

        if (!rotateByVelocity) return;

        const moveDx = visualX - this.lastStablePos.x;
        const moveDz = visualZ - this.lastStablePos.z;

        const moveDistSq = moveDx * moveDx + moveDz * moveDz;
        const minMove = Math.max(
            this.visualThreshold,
            this.moveThreshold
        );

        if (moveDistSq < minMove * minMove) return;

        this.lastStablePos.x = visualX;
        this.lastStablePos.z = visualZ;

        const targetAngle = Math.atan2(moveDx, moveDz) * 180 / Math.PI;
        const currentY = this.getVisualEulerY();

        const newY = this.lerpAngle(
            currentY,
            targetAngle,
            this.rotationSpeed * deltaTime
        );

        this.setVisualYaw(newY);
    }

    private getVisualNode(): Node {
        return this.visualRoot || this.node;
    }

    private getVisualEulerY() {
        return this.getVisualNode().eulerAngles.y - this.visualYawOffset;
    }

    private setVisualYaw(y: number) {
        this.getVisualNode().setRotationFromEuler(
            0,
            y + this.visualYawOffset,
            0
        );
    }

    private lerpAngle(a: number, b: number, t: number) {
        let diff = (b - a) % 360;

        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        return a + diff * t;
    }
}
