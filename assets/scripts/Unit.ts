import { _decorator, Component, Node, Vec3 } from 'cc';
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

    @property rotationSpeed = 10;

    @property moveThreshold = 0.2;
    @property visualThreshold = 0.01;

    @property moveSpeed = 2;
    @property radius = 0.5;

    @property attackRange = 1;
    @property attackCheckIntervalFrames = 2;

    @property targetSearchRange = 60;
    @property targetSearchIntervalFrames = 6;

    @property forwardScanRange = 12;
    @property forwardScanIntervalFrames = 2;
    @property({ displayName: 'Use Wave Front Scanner' })
    useWaveForwardScanner = true;

    @property laneReturnTolerance = 0.35;

    @property(Vec3)
    forwardDir = new Vec3(0, 0, 1);

    @property onForward = true;
    @property isSteady = false;

    @property enableAllyOvertake = true;
    @property overtakeLookAhead = 2.2;
    @property overtakeSideRange = 1.2;
    @property overtakeSideStrength = 0.75;
    @property overtakeSpeedDiff = 0.15;

    team = 0;
    unitTypeName = '';
    isHero = false;
    laneId = -1;
    forwardLaneOffsetX = 0;
    returningToWaveLaneSlot = false;

    sim: any = null;
    agent: any = null;

    lifeId = 0;
    enemy: Unit | null = null;
    onBusy = false;
    updateOffset = 0;

    props!: UnitProps;
    private initialYaw = 0;

    private lastStablePos = { x: 0, z: 0 };
    private tempPos = new Vec3();

    private frameCounter = 0;
    private cachedNearestInRange: Unit | null = null;
    private cachedNearestEnemy: Unit | null = null;
    private forwardLaneTarget: Unit | null = null;
    private forwardAdjacentTarget: Unit | null = null;
    private enemyLifeId = -1;
    private cachedNearestInRangeLifeId = -1;
    private cachedNearestEnemyLifeId = -1;
    private forwardLaneTargetLifeId = -1;
    private forwardAdjacentTargetLifeId = -1;
    private nearestInRangeQueryToken = 0;
    private nearestEnemyQueryToken = 0;

    onLoad() {
        this.props = this.getComponent(UnitProps)!;
    }

    init(
        sim: any,
        team: number,
        unitTypeName: string,
        forwardX: number,
        forwardZ: number
    ) {
        this.advanceLifeId();
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

        this.setEnemyTarget(null);
        this.onBusy = false;

        this.onForward = !this.isSteady;
        this.setForwardDir(forwardX, forwardZ);

        this.updateOffset = Math.floor(Math.random() * 1000);
        this.frameCounter = this.updateOffset;

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

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

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

        if (value) {
            this.setEnemyTarget(null);
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

        this.setEnemyTarget(null);
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

    private invalidateNearestQueryResults() {
        this.nearestInRangeQueryToken++;
        this.nearestEnemyQueryToken++;
    }

    private advanceLifeId() {
        this.lifeId++;

        if (this.lifeId > Number.MAX_SAFE_INTEGER - 1) {
            this.lifeId = 1;
        }
    }

    private setEnemyTarget(target: Unit | null) {
        this.enemy = target;
        this.enemyLifeId = target ? target.lifeId : -1;
    }

    private setCachedNearestInRangeTarget(target: Unit | null) {
        this.cachedNearestInRange = target;
        this.cachedNearestInRangeLifeId = target ? target.lifeId : -1;
    }

    private setCachedNearestEnemyTarget(target: Unit | null) {
        this.cachedNearestEnemy = target;
        this.cachedNearestEnemyLifeId = target ? target.lifeId : -1;
    }

    private setForwardLaneTarget(target: Unit | null) {
        this.forwardLaneTarget = target;
        this.forwardLaneTargetLifeId = target ? target.lifeId : -1;
    }

    private setForwardAdjacentTarget(target: Unit | null) {
        this.forwardAdjacentTarget = target;
        this.forwardAdjacentTargetLifeId = target ? target.lifeId : -1;
    }

    private clearCachedTargets() {
        this.setCachedNearestInRangeTarget(null);
        this.setCachedNearestEnemyTarget(null);
        this.setForwardLaneTarget(null);
        this.setForwardAdjacentTarget(null);
    }

    public getValidEnemyTarget(): Unit | null {
        return this.isValidEnemy(this.enemy, this.enemyLifeId)
            ? this.enemy
            : null;
    }

    public hasValidEnemyTarget() {
        return !!this.getValidEnemyTarget();
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
        this.advanceLifeId();
        this.setEnemyTarget(null);
        this.onBusy = false;
        this.onForward = true;

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();
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

        this.setEnemyTarget(e);
    }

    clearEnemy() {
        this.setEnemyTarget(null);
        this.onBusy = false;

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

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
        this.resetStableRotationPosition();
        this.targetSearchRange = Math.max(
            this.targetSearchRange,
            searchRange
        );

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

        if (!this.onBusy) {
            this.setEnemyTarget(null);
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
        this.setEnemyTarget(null);
        this.onBusy = false;
        this.onForward = !returnToSlot;
        this.resetStableRotationPosition();

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

        if (this.agent) {
            this.agent.locked = false;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.onForward = returnToSlot ? 0 : 1;
        }
    }

    enterWaveCombatMode() {
        this.returningToWaveLaneSlot = false;
        this.onForward = false;
        this.resetStableRotationPosition();

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

        if (this.agent) {
            this.agent.onForward = 0;

            if (!this.onBusy) {
                this.agent.locked = this.isSteady;
            }
        }
    }

    enterWaveFreeHuntMode(
        searchRange: number = 0
    ) {
        this.returningToWaveLaneSlot = false;
        this.onForward = false;
        this.resetStableRotationPosition();

        if (searchRange > 0) {
            this.targetSearchRange = Math.max(
                this.targetSearchRange,
                searchRange
            );
        }

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

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

        if (this.props && this.props.isDead()) {
            this.setEnemyTarget(null);
            this.onBusy = false;
            this.onForward = false;
            this.returningToWaveLaneSlot = false;
            this.agent.onForward = 0;
            this.agent.locked = true;
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.sync(deltaTime, false);
            return;
        }

        if (this.isSteady) {
            this.agent.locked = true;
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.onForward = false;
            this.agent.onForward = 0;
        }

        if (this.onBusy) {
            const busyEnemy = this.getValidEnemyTarget();

            if (!busyEnemy) {
                this.clearEnemy();
            } else {
                this.lookAtTargetSmooth(busyEnemy, deltaTime);

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
                gm.onWaveCombatStarted(
                    this,
                    nearestInRange
                );
            }

            this.returningToWaveLaneSlot = false;
            this.onForward = false;
            this.agent.onForward = 0;

            this.setEnemyTarget(nearestInRange);
            this.onBusy = true;
            this.agent.locked = true;

            this.setCachedNearestEnemyTarget(null);
            this.setCachedNearestInRangeTarget(null);

            this.lookAtTargetSmooth(nearestInRange, deltaTime);

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

        if (this.returningToWaveLaneSlot) {
            if (!this.shouldReturnToLaneSlot()) {
                this.returningToWaveLaneSlot = false;
                this.onForward = true;
                this.agent.onForward = 0;
                this.resetStableRotationPosition();

                this.sim.setPrefVelocity(this.agent, 0, 0);
                this.agent.vel.x = 0;
                this.agent.vel.z = 0;
                this.lookForwardSmooth(deltaTime);
                this.sync(deltaTime, false);
                return;
            } else {
                this.onForward = false;
                this.agent.onForward = 0;

                this.updateForwardPrefVelocity();
                this.lookReturnToLaneSmooth(deltaTime);
                this.sync(deltaTime, false);
                return;
            }
        }

        if (this.onForward) {
            if (this.canRunForwardScanForWave()) {
                this.updateForwardPhase();
            }

            if (this.onForward) {
                this.agent.onForward = 1;

                this.updateForwardPrefVelocity();

                this.sync(deltaTime, true);
                return;
            }
        }

        this.agent.onForward = 0;

        if (!this.hasValidEnemyTarget()) {
            this.setEnemyTarget(
                this.getNearestEnemyThrottled()
            );

            if (!this.hasValidEnemyTarget()) {
                this.setEnemyTarget(
                    this.getSharedWaveTarget()
                );
            }
        }

        const enemy = this.getValidEnemyTarget();

        if (enemy && enemy.agent) {
            const dx = enemy.agent.pos.x - this.agent.pos.x;
            const dz = enemy.agent.pos.z - this.agent.pos.z;

            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.0001) {
                this.sim.setPrefVelocity(
                    this.agent,
                    (dx / dist) * this.agent.maxSpeed,
                    (dz / dist) * this.agent.maxSpeed
                );
            }

            this.lookAtTargetSmooth(enemy, deltaTime);
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

    private shouldRunForwardScan(): boolean {
        const interval = Math.max(1, Math.floor(this.forwardScanIntervalFrames));
        return this.frameCounter % interval === 0;
    }

    private canRunForwardScanForWave() {
        if (!this.useWaveForwardScanner) {
            return true;
        }

        const gm = GameManager.instance;

        if (!gm) return true;

        return gm.canUnitRunWaveForwardScan(this);
    }

    private getSharedWaveTarget() {
        const gm = GameManager.instance;

        if (!gm) return null;

        const target =
            gm.findSharedWaveTargetForUnit(
                this
            );

        return this.isValidEnemy(target)
            ? target
            : null;
    }

    private getNearestEnemyInAttackRangeThrottled(): Unit | null {
        if (this.shouldRunAttackCheck()) {
            const queryToken =
                ++this.nearestInRangeQueryToken;

            const queued =
                this.queueNearestEnemyQuery(
                    this.attackRange,
                    (target) => {
                        if (
                            queryToken !==
                            this.nearestInRangeQueryToken
                        ) {
                            return;
                        }

                        this.setCachedNearestInRangeTarget(
                            this.isValidEnemyWithinRange(
                                target,
                                this.attackRange
                            )
                                ? target
                                : null
                        );
                    }
                );

            if (!queued) {
                this.setCachedNearestInRangeTarget(
                    this.findNearestEnemyInAttackRange()
                );
            }
        } else if (
            !this.isValidEnemy(
                this.cachedNearestInRange,
                this.cachedNearestInRangeLifeId
            )
        ) {
            this.setCachedNearestInRangeTarget(null);
        }

        return this.isValidEnemyWithinRange(
            this.cachedNearestInRange,
            this.attackRange,
            this.cachedNearestInRangeLifeId
        )
            ? this.cachedNearestInRange
            : null;
    }

    private getNearestEnemyThrottled(): Unit | null {
        if (this.shouldRunTargetSearch()) {
            const queryToken =
                ++this.nearestEnemyQueryToken;

            const queued =
                this.queueNearestEnemyQuery(
                    this.targetSearchRange,
                    (target) => {
                        if (
                            queryToken !==
                            this.nearestEnemyQueryToken
                        ) {
                            return;
                        }

                        this.setCachedNearestEnemyTarget(
                            this.isValidEnemyWithinRange(
                                target,
                                this.targetSearchRange
                            )
                                ? target
                                : null
                        );
                    }
                );

            if (!queued) {
                this.setCachedNearestEnemyTarget(
                    this.findNearestEnemy()
                );
            }
        } else if (
            !this.isValidEnemy(
                this.cachedNearestEnemy,
                this.cachedNearestEnemyLifeId
            )
        ) {
            this.setCachedNearestEnemyTarget(null);
        }

        return this.isValidEnemyWithinRange(
            this.cachedNearestEnemy,
            this.targetSearchRange,
            this.cachedNearestEnemyLifeId
        )
            ? this.cachedNearestEnemy
            : null;
    }

    private updateForwardPhase() {
        if (!this.agent) return;

        // Forward phase:
        // 1. Scan enemies in the same lane and adjacent lanes.
        // 2. If this unit has passed a valid target along forwardDir,
        //    release the wave to free hunt.
        // 3. Enemy hero line can also release free hunt when it is in
        //    the same or adjacent lane.

        const shouldScan =
            this.shouldRunForwardScan();

        let nearestLaneEnemy =
            this.getForwardLaneTarget();

        if (shouldScan) {
            nearestLaneEnemy =
                this.findNearestEnemyInSameLane();
            this.setForwardLaneTarget(nearestLaneEnemy);
        }

        if (nearestLaneEnemy && nearestLaneEnemy.agent) {
            if (this.hasPassedTargetAlongForward(nearestLaneEnemy)) {
                this.setForwardLaneTarget(null);
                this.setForwardAdjacentTarget(null);

                if (
                    !this.releaseWaveForwardToFreeHunt(
                        nearestLaneEnemy
                    )
                ) {
                    this.onForward = false;
                }

                return;
            }
        }

        let nearestAdjacentLaneEnemy =
            this.getForwardAdjacentTarget();

        if (shouldScan) {
            nearestAdjacentLaneEnemy =
                this.findNearestEnemyInAdjacentLane(true);
            this.setForwardAdjacentTarget(nearestAdjacentLaneEnemy);
        }

        if (nearestAdjacentLaneEnemy) {
            if (
                this.hasPassedTargetAlongForward(nearestAdjacentLaneEnemy)
            ) {
                this.setForwardLaneTarget(null);
                this.setForwardAdjacentTarget(null);

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
            this.isSameOrAdjacentLane(enemyHero.laneId) &&
            this.hasPassedTargetAlongForward(enemyHero)
        ) {
            this.setForwardLaneTarget(null);
            this.setForwardAdjacentTarget(null);

            if (
                !this.releaseWaveForwardToFreeHunt(
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

    private getForwardLaneTarget(): Unit | null {
        const target = this.forwardLaneTarget;

        if (!target) return null;

        if (
            !this.isValidEnemy(
                target,
                this.forwardLaneTargetLifeId
            ) ||
            target.laneId !== this.laneId
        ) {
            this.setForwardLaneTarget(null);
            return null;
        }

        return target;
    }

    private getForwardAdjacentTarget(): Unit | null {
        const target = this.forwardAdjacentTarget;

        if (!target) return null;

        if (
            !this.isValidEnemy(
                target,
                this.forwardAdjacentTargetLifeId
            ) ||
            !this.isAdjacentLane(target.laneId)
        ) {
            this.setForwardAdjacentTarget(null);
            return null;
        }

        return target;
    }

    private findNearestEnemyInSameLane(): Unit | null {
        if (!this.agent) return null;
        if (this.laneId < 0) return this.getNearestEnemyThrottled();

        const scanRange =
            this.getForwardScanRange();

        const enemies =
            this.getNearbyEnemyList(scanRange);

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        const maxRangeSq =
            scanRange *
            scanRange;

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

        const scanRange =
            this.getForwardScanRange();

        const enemies =
            this.getNearbyEnemyList(scanRange);

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        const maxRangeSq =
            scanRange *
            scanRange;

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

    private isSameOrAdjacentLane(otherLaneId: number): boolean {
        if (this.laneId < 0) return false;
        if (otherLaneId < 0) return false;

        return Math.abs(otherLaneId - this.laneId) <= 1;
    }

    private getEnemyHero(): Unit | null {
        const gm = GameManager.instance;

        if (!gm) return null;

        return this.team === 0
            ? gm.teamBHero
            : gm.teamAHero;
    }

    private clearInvalidEnemy() {
        if (!this.hasValidEnemyTarget()) {
            this.setEnemyTarget(null);
        }
    }

    private queueNearestEnemyQuery(
        radius: number,
        callback: (target: Unit | null) => void
    ) {
        if (!this.agent) return false;

        const gm = GameManager.instance;

        if (!gm || !gm.spatialGrid) {
            return false;
        }

        return gm.spatialGrid.requestNearestEnemy(
            this,
            this.team,
            this.agent.pos.x,
            this.agent.pos.z,
            radius,
            (target) => {
                if (!this.node.activeInHierarchy) {
                    return;
                }

                if (!this.agent || this.props.isDead()) {
                    callback(null);
                    return;
                }

                callback(target);
            }
        );
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

        const searchRangeSq =
            this.targetSearchRange *
            this.targetSearchRange;

        const enemies = this.getEnemyList();

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];

            if (!this.isValidEnemy(e)) continue;

            const dx = e.agent!.pos.x - this.agent.pos.x;
            const dz = e.agent!.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d > searchRangeSq) continue;

            if (d < bestDistSq) {
                bestDistSq = d;
                best = e;
            }
        }

        return best;
    }

    private isValidEnemy(
        e: Unit | null,
        lifeId: number = -1
    ): boolean {
        if (!e || e === this) return false;
        if (lifeId >= 0 && e.lifeId !== lifeId) return false;
        if (!e.node.activeInHierarchy) return false;
        if (!e.agent) return false;
        if (!e.props || e.props.isDead()) return false;

        return true;
    }

    private isValidEnemyWithinRange(
        e: Unit | null,
        range: number,
        lifeId: number = -1
    ): boolean {
        if (!this.agent) return false;
        if (!this.isValidEnemy(e, lifeId)) return false;

        const dx = e!.agent!.pos.x - this.agent.pos.x;
        const dz = e!.agent!.pos.z - this.agent.pos.z;

        return dx * dx + dz * dz <= range * range;
    }

    private getEnemyList() {
        const gm = GameManager.instance;

        if (!gm) return [];

        return this.team === 0
            ? gm.teamB
            : gm.teamA;
    }

    private getForwardScanRange() {
        if (this.forwardScanRange > 0) {
            return this.forwardScanRange;
        }

        return this.targetSearchRange;
    }

    private getNearbyEnemyList(radius: number) {
        if (!this.agent) return [];

        const gm = GameManager.instance;

        if (gm && gm.spatialGrid) {
            return gm.spatialGrid.queryEnemies(
                this.team,
                this.agent.pos.x,
                this.agent.pos.z,
                radius
            );
        }

        return this.getEnemyList();
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

    private lookForwardSmooth(deltaTime: number) {
        const dx = this.forwardDir.x;
        const dz = this.forwardDir.z;

        this.lookDirectionSmooth(dx, dz, deltaTime);
    }

    private lookReturnToLaneSmooth(deltaTime: number) {
        if (!this.agent) return;

        const laneTargetX = this.getCurrentLaneTargetX();

        if (laneTargetX === null) return;

        const dx = laneTargetX - this.agent.pos.x;

        if (Math.abs(dx) <= this.laneReturnTolerance) return;

        this.lookDirectionSmooth(Math.sign(dx), 0, deltaTime);
    }

    private lookDirectionSmooth(
        dx: number,
        dz: number,
        deltaTime: number
    ) {
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

    private resetStableRotationPosition() {
        const p = this.node.worldPosition;

        this.lastStablePos.x = p.x;
        this.lastStablePos.z = p.z;
    }

    private lerpAngle(a: number, b: number, t: number) {
        let diff = (b - a) % 360;

        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        return a + diff * t;
    }
}
