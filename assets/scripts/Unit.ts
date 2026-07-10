import { _decorator, Component, Node, Vec3 } from 'cc';
import { UnitProps } from './UnitProps';
import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;
const FORWARD_LOOK_DOT_THRESHOLD = 0.98;

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

    @property({ displayName: 'Aggressive Forward' })
    aggressiveForward = false;

    @property(Vec3)
    forwardDir = new Vec3(0, 0, 1);

    @property onForward = true;
    @property isSteady = false;

    @property({ displayName: 'Hero Guard Distance' })
    heroGuardDistance = 0;

    @property({ displayName: 'Hero Guard Return Tolerance' })
    heroGuardReturnTolerance = 0.08;

    @property enableAllyOvertake = true;
    @property overtakeLookAhead = 2.2;
    @property overtakeSideRange = 1.2;
    @property overtakeSideStrength = 0.75;
    @property overtakeSpeedDiff = 0.15;

    team = 0;
    unitTypeName = '';
    isHero = false;
    laneId = -1;

    sim: any = null;
    agent: any = null;

    lifeId = 0;
    enemy: Unit | null = null;
    onBusy = false;
    updateOffset = 0;

    props!: UnitProps;
    private initialYaw = 0;
    private heroGuardHomeX = 0;
    private heroGuardHomeZ = 0;

    private lastStablePos = { x: 0, z: 0 };
    private moveIntentFacingActive = true;
    private lastMoveIntentDir = { x: 0, z: 0 };
    private tempPos = new Vec3();
    private visualYawCache = 0;
    private visualYawCacheValid = false;

    private frameCounter = 0;
    private cachedNearestInRange: Unit | null = null;
    private enemyLifeId = -1;
    private cachedNearestInRangeLifeId = -1;
    private busyLookTarget: Unit | null = null;
    private busyLookTargetLifeId = -1;
    private busyLookSettled = false;
    private retaliationTarget: Unit | null = null;
    private retaliationTargetLifeId = -1;
    private targetSearchPending = false;
    private targetSearchConfirmedNoTarget = false;
    private soloAggressiveSkirmishActive = false;
    private backToLaneActive = false;
    private backToLaneForwardAggressive = false;
    private nearestEnemyQueryToken = 0;
    private readonly onNearestEnemyQueryResult = (
        target: Unit | null,
        token: number
    ) => {
        if (token !== this.nearestEnemyQueryToken) {
            return;
        }

        const validTarget =
            this.isValidEnemyWithinRange(
                target,
                this.targetSearchRange
            )
                ? target
                : null;

        this.completeTargetSearch(validTarget);

        if (!this.hasValidEnemyTarget()) {
            this.setEnemyTarget(validTarget);
        }
    };

    onLoad() {
        this.props = this.getComponent(UnitProps)!;
        this.refreshVisualYawCache();
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
        this.visualYawCacheValid = false;

        const p = this.node.worldPosition;

        this.initialYaw = this.getVisualEulerY();
        this.heroGuardHomeX = p.x;
        this.heroGuardHomeZ = p.z;

        this.agent = sim.addAgent(p.x, p.z);
        this.agent.maxSpeed = this.moveSpeed;
        this.agent.radius = this.radius;

        this.setEnemyTarget(null);
        this.onBusy = false;
        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = false;
        this.backToLaneForwardAggressive = false;

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
        this.resetMoveIntentFacing();

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
            this.backToLaneActive = false;

            this.initialYaw = this.getVisualEulerY();

            if (this.isHero) {
                this.heroGuardHomeX = this.agent.pos.x;
                this.heroGuardHomeZ = this.agent.pos.z;
            }

            this.setAgentLocked(true);
            this.setAgentOnForward(0);
            this.setAgentStopped();

            return;
        }

        this.setEnemyTarget(null);
        this.onBusy = false;
        this.onForward = useForwardPhase;
        this.backToLaneActive = false;

        this.setAgentLocked(false);
        this.setAgentOnForward(useForwardPhase ? 1 : 0);
        this.setAgentStopped();

        this.applyRuntimeAgentData();
    }

    private setAgentLocked(value: boolean) {
        if (!this.agent) return;
        if (this.agent.locked === value) return;

        this.agent.locked = value;
    }

    private setAgentOnForward(value: number) {
        if (!this.agent) return;
        if (this.agent.onForward === value) return;

        this.agent.onForward = value;
    }

    private setAgentPrefVelocity(x: number, z: number) {
        if (!this.agent || !this.sim) return;

        const prefVel = this.agent.prefVel;

        if (
            Math.abs(prefVel.x - x) <= 0.0001 &&
            Math.abs(prefVel.z - z) <= 0.0001
        ) {
            return;
        }

        this.sim.setPrefVelocity(this.agent, x, z);
    }

    private zeroAgentVelocity() {
        if (!this.agent) return;

        if (this.agent.vel.x !== 0) {
            this.agent.vel.x = 0;
        }

        if (this.agent.vel.z !== 0) {
            this.agent.vel.z = 0;
        }
    }

    private setAgentStopped() {
        this.setAgentPrefVelocity(0, 0);
        this.zeroAgentVelocity();
    }

    private applyRuntimeAgentData() {
        if (!this.agent) return;

        this.agent.team = this.team;
        this.setAgentOnForward(this.onForward ? 1 : 0);

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
            this.setAgentLocked(true);
            this.setAgentStopped();
            this.onForward = false;
            this.setAgentOnForward(0);
        } else {
            this.setAgentLocked(false);
        }
    }

    private invalidateNearestQueryResults() {
        this.nearestEnemyQueryToken++;
        this.targetSearchPending = false;
        this.targetSearchConfirmedNoTarget = false;
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
        this.retaliationTarget = null;
        this.retaliationTargetLifeId = -1;
        this.resetBusyLookCache();

        if (target) {
            this.targetSearchConfirmedNoTarget = false;
        }
    }

    private setRetaliationTarget(target: Unit) {
        this.enemy = target;
        this.enemyLifeId = target.lifeId;
        this.retaliationTarget = target;
        this.retaliationTargetLifeId = target.lifeId;
        this.targetSearchConfirmedNoTarget = false;
        this.resetBusyLookCache();
    }

    public isSoloAggressiveSkirmishActive() {
        return this.soloAggressiveSkirmishActive;
    }

    public isBackToLaneActive() {
        return this.backToLaneActive;
    }

    private setCachedNearestInRangeTarget(target: Unit | null) {
        this.cachedNearestInRange = target;
        this.cachedNearestInRangeLifeId = target ? target.lifeId : -1;
    }

    private completeTargetSearch(target: Unit | null) {
        this.targetSearchPending = false;
        this.targetSearchConfirmedNoTarget =
            !target &&
            !this.hasValidEnemyTarget();
    }

    private clearCachedTargets() {
        this.setCachedNearestInRangeTarget(null);
    }

    public getValidEnemyTarget(): Unit | null {
        return this.isValidEnemy(this.enemy, this.enemyLifeId)
            ? this.enemy
            : null;
    }

    public hasValidEnemyTarget() {
        return !!this.getValidEnemyTarget();
    }

    public hasConfirmedNoTargetSearch() {
        if (this.targetSearchPending) return false;
        if (this.hasValidEnemyTarget()) return false;

        return this.targetSearchConfirmedNoTarget;
    }

    public setWaveSearchTarget(target: Unit | null) {
        if (!this.isValidEnemy(target)) return false;

        this.setEnemyTarget(target);
        return true;
    }

    public findForwardSearchTarget(
        aggressiveForward: boolean
    ): Unit | null {
        if (!this.agent) return null;

        if (this.laneId < 0) return null;

        const enemies =
            this.getNearbyEnemyList(
                this.targetSearchRange
            );
        const maxRangeSq =
            this.targetSearchRange *
            this.targetSearchRange;

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            if (!this.isValidEnemy(enemy)) continue;
            if (
                !this.isForwardSearchCandidate(
                    enemy,
                    aggressiveForward
                )
            ) {
                continue;
            }

            const dx =
                enemy.agent!.pos.x - this.agent.pos.x;
            const dz =
                enemy.agent!.pos.z - this.agent.pos.z;
            const distanceSq = dx * dx + dz * dz;

            if (distanceSq > maxRangeSq) continue;

            if (distanceSq < bestDistSq) {
                bestDistSq = distanceSq;
                best = enemy;
            }
        }

        return best;
    }

    private isForwardSearchCandidate(
        enemy: Unit,
        aggressiveForward: boolean
    ) {
        if (this.laneId < 0 || enemy.laneId < 0) {
            return false;
        }

        const gm = GameManager.instance;
        const ownLane = gm
            ? gm.clampLaneId(this.laneId)
            : this.laneId;
        const enemyLane = gm
            ? gm.clampLaneId(enemy.laneId)
            : enemy.laneId;
        const laneDistance =
            Math.abs(ownLane - enemyLane);

        if (aggressiveForward) {
            if (laneDistance !== 0) return false;
        } else if (laneDistance > 1) {
            return false;
        }

        return this.hasPassedTargetAlongForward(enemy);
    }

    public hasReachedEnemyHeroLine() {
        const enemyHero = this.getEnemyHero();

        if (!this.isValidEnemy(enemyHero)) {
            return false;
        }

        return this.hasPassedTargetAlongForward(
            enemyHero!
        );
    }

    public getEnemyHeroTarget() {
        const enemyHero = this.getEnemyHero();

        return this.isValidEnemy(enemyHero)
            ? enemyHero
            : null;
    }

    public hasPassedForwardTarget(target: Unit) {
        return this.hasPassedTargetAlongForward(target);
    }

    public reactToAttacker(attacker: Unit | null) {
        if (this.onBusy) return false;
        if (!this.isValidEnemy(attacker)) return false;

        const currentTarget =
            this.getValidEnemyTarget();

        if (
            currentTarget &&
            currentTarget ===
                this.retaliationTarget &&
            currentTarget.lifeId ===
                this.retaliationTargetLifeId
        ) {
            return false;
        }

        const gm = GameManager.instance;
        const wasBackToLane =
            this.backToLaneActive;
        const soloAggressive =
            gm
                ? gm.shouldUseSoloAggressiveSkirmish(
                    this,
                    attacker
                )
                : false;

        if (gm) {
            gm.onWaveCombatStarted(
                this,
                attacker,
                false
            );
        }

        // A result requested before retaliation must not replace the
        // attacker when the worker responds later.
        this.nearestEnemyQueryToken++;
        this.targetSearchPending = false;
        this.targetSearchConfirmedNoTarget = false;
        this.setRetaliationTarget(attacker!);
        this.setCachedNearestInRangeTarget(null);
        this.soloAggressiveSkirmishActive =
            this.soloAggressiveSkirmishActive ||
            soloAggressive;

        if (this.onForward || wasBackToLane) {
            this.onForward = false;
            this.backToLaneActive = false;
            this.setAgentOnForward(0);
            this.setAgentLocked(false);
            this.setAgentStopped();
            this.resetMoveIntentFacing();
        }

        return true;
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

        if (this.props) {
            this.props.resetForDespawn();
        }

        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = false;
        this.backToLaneForwardAggressive = false;
        this.invalidateNearestQueryResults();
        this.clearCachedTargets();
        this.laneId = -1;
        this.aggressiveForward = false;
        this.resetMoveIntentFacing();

        if (this.agent) {
            this.setAgentLocked(false);
            this.setAgentOnForward(0);
            this.setAgentStopped();
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
            this.setAgentStopped();
            this.setAgentLocked(this.isSteady);
        }
    }

    public enterFreeHuntMode(
        searchRange: number = this.targetSearchRange
    ) {
        this.isSteady = false;
        this.onForward = false;
        this.aggressiveForward = false;
        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = false;
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
            this.setAgentLocked(this.onBusy);
            this.setAgentOnForward(0);

            if (!this.onBusy) {
                this.setAgentStopped();
            }
        }
    }

    enterWaveCombatMode() {
        this.onForward = false;
        this.aggressiveForward = false;
        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = false;
        this.resetStableRotationPosition();

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

        if (this.agent) {
            this.setAgentOnForward(0);

            if (!this.onBusy) {
                this.setAgentLocked(this.isSteady);
            }
        }
    }

    enterWaveFreeHuntMode(
        searchRange: number = 0
    ) {
        this.onForward = false;
        this.aggressiveForward = false;
        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = false;
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
            this.setAgentOnForward(0);

            if (!this.onBusy) {
                this.setAgentLocked(this.isSteady);
            }
        }
    }

    enterWaveForwardMode(
        aggressiveForward: boolean,
        useBackToLanePhase: boolean = false
    ) {
        if (this.isSteady) return;

        if (
            useBackToLanePhase &&
            this.startBackToLanePhase(
                aggressiveForward
            )
        ) {
            return;
        }

        this.setEnemyTarget(null);
        this.onBusy = false;
        this.onForward = true;
        this.aggressiveForward = aggressiveForward;
        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = false;
        this.backToLaneForwardAggressive = false;
        this.resetStableRotationPosition();
        this.resetMoveIntentFacing();

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

        if (this.agent) {
            this.setAgentLocked(false);
            this.setAgentOnForward(1);
            this.setAgentStopped();
        }
    }

    update(deltaTime: number) {
        if (!this.sim || !this.agent) return;

        this.frameCounter++;

        if (this.props && this.shouldRunTargetSearch()) {
            const gm = GameManager.instance;

            this.props.refreshHealthBarVisibility(
                gm ? gm.shouldShowUnitHealthBars() : false
            );
        }

        if (this.props && this.props.isDead()) {
            this.setEnemyTarget(null);
            this.onBusy = false;
            this.onForward = false;
            this.backToLaneActive = false;
            this.setAgentOnForward(0);
            this.setAgentLocked(true);
            this.setAgentStopped();
            this.sync(deltaTime, false);
            return;
        }

        if (this.updateSteadyHeroGuard(deltaTime)) {
            return;
        }

        if (this.isSteady) {
            this.setAgentLocked(true);
            this.setAgentStopped();
            this.onForward = false;
            this.backToLaneActive = false;
            this.setAgentOnForward(0);
        }

        if (this.onBusy) {
            const busyEnemy = this.getValidEnemyTarget();

            if (!busyEnemy) {
                this.clearEnemy();
            } else {
                if (!this.shouldSkipBusyLookAndSync(busyEnemy)) {
                    const rotated =
                        this.lookAtTargetSmooth(
                            busyEnemy,
                            deltaTime
                        );

                    this.setAgentStopped();

                    this.sync(deltaTime, false);
                    this.updateBusyLookSettled(
                        busyEnemy,
                        rotated
                    );
                }

                return;
            }
        }

        this.clearInvalidEnemy();

        const nearestInRange = this.getNearestEnemyInAttackRangeThrottled();

        if (nearestInRange) {
            const gm = GameManager.instance;
            const soloAggressive =
                gm
                    ? gm.shouldUseSoloAggressiveSkirmish(
                        this,
                        nearestInRange
                    )
                    : false;

            this.soloAggressiveSkirmishActive =
                this.soloAggressiveSkirmishActive ||
                soloAggressive;

            if (gm) {
                gm.onWaveCombatStarted(
                    this,
                    nearestInRange
                );
            }

            this.onForward = false;
            this.backToLaneActive = false;
            this.setAgentOnForward(0);

            this.setEnemyTarget(nearestInRange);
            this.onBusy = true;
            this.setAgentLocked(true);

            this.setCachedNearestInRangeTarget(null);

            this.lookAtTargetSmooth(nearestInRange, deltaTime);

            this.setAgentStopped();

            this.sync(deltaTime, false);
            return;
        }

        if (this.isSteady) {
            this.setAgentStopped();

            this.returnToInitialYawSmooth(deltaTime);

            this.sync(deltaTime, false);
            return;
        }

        this.tryResumeSoloForwardAfterAggressiveSkirmish();

        if (this.updateBackToLanePhase(deltaTime)) {
            return;
        }

        if (this.onForward) {
            this.setAgentOnForward(1);

            this.updateForwardPrefVelocity();

            if (!this.shouldSkipForwardMoveIntentLook()) {
                this.lookMoveIntentSmooth(deltaTime);
            }

            this.sync(deltaTime, false);
            return;
        }

        this.setAgentOnForward(0);

        if (!this.hasValidEnemyTarget()) {
            this.setEnemyTarget(
                this.getSharedWaveTarget()
            );

            if (!this.hasValidEnemyTarget()) {
                this.refreshNearestEnemyTargetThrottled();
            }
        }

        const enemy = this.getValidEnemyTarget();

        if (enemy && enemy.agent) {
            const dx = enemy.agent.pos.x - this.agent.pos.x;
            const dz = enemy.agent.pos.z - this.agent.pos.z;

            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.0001) {
                this.setAgentPrefVelocity(
                    (dx / dist) * this.agent.maxSpeed,
                    (dz / dist) * this.agent.maxSpeed
                );
            }

            this.lookAtTargetSmooth(enemy, deltaTime);
            this.sync(deltaTime, false);
        } else {
            this.setAgentStopped();
            this.sync(deltaTime, true);
        }
    }

    private tryResumeSoloForwardAfterAggressiveSkirmish() {
        if (this.onForward) return false;
        if (this.onBusy) return false;
        if (this.isSteady) return false;
        if (this.hasValidEnemyTarget()) return false;

        const gm = GameManager.instance;

        if (
            !gm ||
            !gm.shouldResumeSoloForwardAfterAggressiveSkirmish(this)
        ) {
            return false;
        }

        this.enterWaveForwardMode(false, true);
        return true;
    }

    private startBackToLanePhase(
        aggressiveForward: boolean
    ) {
        if (!this.agent) return false;
        if (this.laneId < 0) return false;

        const gm = GameManager.instance;

        if (!gm) return false;

        const dir =
            gm.getDirectionToLaneArea(
                this.laneId,
                this.agent.pos.x
            );

        if (dir === 0) return false;

        this.setEnemyTarget(null);
        this.onBusy = false;
        this.onForward = false;
        this.aggressiveForward = aggressiveForward;
        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = true;
        this.backToLaneForwardAggressive = aggressiveForward;
        this.resetStableRotationPosition();
        this.resetMoveIntentFacing();

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

        this.setAgentLocked(false);
        this.setAgentOnForward(0);
        this.setAgentPrefVelocity(
            dir * this.agent.maxSpeed,
            0
        );

        return true;
    }

    private updateBackToLanePhase(
        deltaTime: number
    ) {
        if (!this.backToLaneActive) return false;

        if (!this.agent || this.isSteady) {
            this.backToLaneActive = false;
            this.backToLaneForwardAggressive = false;
            return false;
        }

        const gm = GameManager.instance;

        if (!gm || this.laneId < 0) {
            this.enterWaveForwardMode(false);
            return true;
        }

        const dir =
            gm.getDirectionToLaneArea(
                this.laneId,
                this.agent.pos.x
            );

        if (dir === 0) {
            const aggressiveForward =
                this.backToLaneForwardAggressive;

            this.enterWaveForwardMode(
                aggressiveForward
            );
            return true;
        }

        this.setAgentOnForward(0);
        this.setAgentLocked(false);
        this.setAgentPrefVelocity(
            dir * this.agent.maxSpeed,
            0
        );

        this.lookMoveIntentSmooth(deltaTime);
        this.sync(deltaTime, false);
        return true;
    }

    private shouldRunAttackCheck(): boolean {
        const interval = Math.max(1, Math.floor(this.attackCheckIntervalFrames));
        const phase = Math.floor(interval / 2);
        return (this.frameCounter + phase) % interval === 0;
    }

    private shouldRunTargetSearch(): boolean {
        const interval = Math.max(1, Math.floor(this.targetSearchIntervalFrames));
        return this.frameCounter % interval === 0;
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
            this.setCachedNearestInRangeTarget(
                this.findNearestEnemyInAttackRange()
            );
        } else if (
            !this.isValidEnemy(
                this.cachedNearestInRange,
                this.cachedNearestInRangeLifeId
            )
        ) {
            this.setCachedNearestInRangeTarget(null);
        }

        return this.isValidEnemyWithinAttackRange(
            this.cachedNearestInRange,
            this.cachedNearestInRangeLifeId
        )
            ? this.cachedNearestInRange
            : null;
    }

    private refreshNearestEnemyTargetThrottled() {
        if (!this.shouldRunTargetSearch()) {
            return;
        }

        const queryToken =
            ++this.nearestEnemyQueryToken;

        this.targetSearchPending = true;
        this.targetSearchConfirmedNoTarget = false;

        const queued =
            this.queueNearestEnemyQuery(
                this.targetSearchRange,
                this.onNearestEnemyQueryResult,
                queryToken
            );

        if (queued) return;

        const target =
            this.findNearestEnemy();

        this.completeTargetSearch(target);

        if (!this.hasValidEnemyTarget()) {
            this.setEnemyTarget(target);
        }
    }

    private updateForwardPrefVelocity() {
        if (!this.agent) return;

        this.setAgentPrefVelocity(
            this.forwardDir.x * this.agent.maxSpeed,
            this.forwardDir.z * this.agent.maxSpeed
        );
    }

    private updateSteadyHeroGuard(deltaTime: number) {
        if (!this.isHero) return false;
        if (!this.isSteady) return false;
        if (!this.agent) return false;
        if (this.heroGuardDistance <= 0) return false;

        let target =
            this.getValidEnemyTarget();

        if (
            !this.shouldKeepSteadyHeroTarget(target)
        ) {
            target =
                this.findNearestEnemyInHeroGuardZone();
        }

        if (target) {
            this.onForward = false;
            this.setAgentOnForward(0);

            if (
                this.getValidEnemyTarget() !== target
            ) {
                this.setEnemyTarget(target);
                this.onBusy = false;
            }

            if (
                this.isValidEnemyWithinAttackRange(
                    target
                )
            ) {
                if (!this.onBusy) {
                    const gm = GameManager.instance;

                    if (gm) {
                        gm.onWaveCombatStarted(
                            this,
                            target,
                            false
                        );
                    }
                }

                this.setEnemyTarget(target);
                this.onBusy = true;
                this.setAgentLocked(true);
                this.setAgentStopped();
                this.lookAtTargetSmooth(
                    target,
                    deltaTime
                );
                this.sync(deltaTime, false);
                return true;
            }

            this.onBusy = false;
            this.setAgentLocked(false);

            const dx =
                target.agent!.pos.x -
                this.agent.pos.x;
            const dz =
                target.agent!.pos.z -
                this.agent.pos.z;
            const dist =
                Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.0001) {
                this.setAgentPrefVelocity(
                    dx / dist * this.agent.maxSpeed,
                    dz / dist * this.agent.maxSpeed
                );
            }

            this.lookAtTargetSmooth(
                target,
                deltaTime
            );
            this.sync(deltaTime, false);
            return true;
        }

        this.setEnemyTarget(null);
        this.onBusy = false;
        this.onForward = false;
        this.setAgentOnForward(0);

        const dx =
            this.heroGuardHomeX -
            this.agent.pos.x;
        const dz =
            this.heroGuardHomeZ -
            this.agent.pos.z;
        const distSq =
            dx * dx + dz * dz;
        const tolerance =
            Math.max(
                0.001,
                this.heroGuardReturnTolerance
            );

        if (distSq > tolerance * tolerance) {
            this.setAgentLocked(false);

            const dist =
                Math.sqrt(distSq);

            this.setAgentPrefVelocity(
                dx / dist * this.agent.maxSpeed,
                dz / dist * this.agent.maxSpeed
            );
            this.lookMoveIntentSmooth(deltaTime);
            this.sync(deltaTime, false);
            return true;
        }

        this.setAgentLocked(true);
        this.setAgentStopped();
        this.returnToInitialYawSmooth(deltaTime);
        this.sync(deltaTime, false);
        return true;
    }

    private findNearestEnemyInHeroGuardZone() {
        if (!this.agent) return null;

        const gm = GameManager.instance;

        const enemies =
            gm && gm.spatialGrid
                ? gm.spatialGrid.queryEnemies(
                    this.team,
                    this.heroGuardHomeX,
                    this.heroGuardHomeZ,
                    this.heroGuardDistance
                )
                : this.getEnemyList();

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            if (
                !this.isEnemyInsideHeroGuardZone(
                    enemy
                )
            ) {
                continue;
            }

            const dx =
                enemy.agent!.pos.x -
                this.agent.pos.x;
            const dz =
                enemy.agent!.pos.z -
                this.agent.pos.z;
            const d =
                dx * dx + dz * dz;

            if (d < bestDistSq) {
                bestDistSq = d;
                best = enemy;
            }
        }

        return best;
    }

    private shouldKeepSteadyHeroTarget(
        target: Unit | null
    ) {
        if (!this.isValidEnemy(target)) {
            return false;
        }

        if (this.isEnemyInsideHeroGuardZone(target)) {
            return true;
        }

        if (
            target === this.retaliationTarget &&
            target.lifeId === this.retaliationTargetLifeId
        ) {
            return true;
        }

        return this.onBusy &&
            target === this.enemy &&
            target.lifeId === this.enemyLifeId;
    }

    private isEnemyInsideHeroGuardZone(
        enemy: Unit | null
    ) {
        if (!this.isValidEnemy(enemy)) {
            return false;
        }

        const dx =
            enemy!.agent!.pos.x -
            this.heroGuardHomeX;
        const dz =
            enemy!.agent!.pos.z -
            this.heroGuardHomeZ;

        return dx * dx + dz * dz <=
            this.heroGuardDistance *
            this.heroGuardDistance;
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
        callback: (
            target: Unit | null,
            token: number
        ) => void,
        callbackToken: number
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
            callback,
            callbackToken
        );
    }

    private findNearestEnemyInAttackRange(): Unit | null {
        if (!this.agent) return null;

        const enemies =
            this.getNearbyEnemyList(
                this.getAttackRangeSearchRadius()
            );

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];

            if (!this.isValidEnemy(e)) continue;

            const dx = e.agent!.pos.x - this.agent.pos.x;
            const dz = e.agent!.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (!this.isValidEnemyWithinAttackRange(e)) continue;

            if (d < bestDistSq) {
                bestDistSq = d;
                best = e;
            }
        }

        return best;
    }

    private findNearestEnemy(): Unit | null {
        if (!this.agent) return null;

        const gm = GameManager.instance;

        if (gm && gm.spatialGrid) {
            return gm.spatialGrid.findNearestEnemy(
                this.team,
                this.agent.pos.x,
                this.agent.pos.z,
                this.targetSearchRange
            );
        }

        return this.findNearestEnemyFallback();
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
        if (e.team === this.team) return false;
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

    private isValidEnemyWithinAttackRange(
        e: Unit | null,
        lifeId: number = -1
    ): boolean {
        if (!this.agent) return false;
        if (!this.isValidEnemy(e, lifeId)) return false;

        const dx = e!.agent!.pos.x - this.agent.pos.x;
        const dz = e!.agent!.pos.z - this.agent.pos.z;
        const effectiveRange =
            this.getEffectiveAttackRangeAgainst(e!);

        return dx * dx + dz * dz <=
            effectiveRange * effectiveRange;
    }

    private getEffectiveAttackRangeAgainst(
        enemy: Unit
    ) {
        return Math.max(0, this.attackRange) +
            Math.max(0, this.radius) +
            Math.max(0, enemy.radius);
    }

    private getAttackRangeSearchRadius() {
        const gm = GameManager.instance;
        const maxEnemyRadius =
            gm && gm.spatialGrid
                ? gm.spatialGrid.getMaxEnemyRadius(this.team)
                : this.radius;

        return Math.max(0, this.attackRange) +
            Math.max(0, this.radius) +
            Math.max(0, maxEnemyRadius);
    }

    private getEnemyList() {
        const gm = GameManager.instance;

        if (!gm) return [];

        return this.team === 0
            ? gm.teamB
            : gm.teamA;
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
        if (!this.agent) return false;
        if (!target || !target.agent) return false;

        const dx = target.agent.pos.x - this.agent.pos.x;
        const dz = target.agent.pos.z - this.agent.pos.z;

        if (dx * dx + dz * dz < 0.0001) return false;

        return this.applyFacingYaw(
            Math.atan2(dx, dz) * 180 / Math.PI,
            deltaTime
        );
    }

    private resetBusyLookCache() {
        this.busyLookTarget = null;
        this.busyLookTargetLifeId = -1;
        this.busyLookSettled = false;
    }

    private shouldSkipBusyLookAndSync(target: Unit) {
        return this.busyLookSettled &&
            this.busyLookTarget === target &&
            this.busyLookTargetLifeId === target.lifeId &&
            !!this.agent &&
            !!target.agent &&
            this.agent.locked &&
            target.agent.locked;
    }

    private updateBusyLookSettled(
        target: Unit,
        rotated: boolean
    ) {
        this.busyLookTarget = target;
        this.busyLookTargetLifeId = target.lifeId;
        this.busyLookSettled =
            !rotated &&
            !!this.agent &&
            !!target.agent &&
            this.agent.locked &&
            target.agent.locked &&
            this.isVisualPositionSettled();
    }

    private isVisualPositionSettled() {
        if (!this.agent) return false;

        const current = this.node.worldPosition;
        const dx = this.agent.pos.x - current.x;
        const dz = this.agent.pos.z - current.z;

        return dx * dx + dz * dz <
            this.visualThreshold * this.visualThreshold;
    }

    private returnToInitialYawSmooth(deltaTime: number) {
        this.applyFacingYaw(this.initialYaw, deltaTime);
    }

    private lookForwardSmooth(deltaTime: number) {
        const dx = this.forwardDir.x;
        const dz = this.forwardDir.z;

        this.lookDirectionSmooth(dx, dz, deltaTime);
    }

    private lookMoveIntentSmooth(deltaTime: number) {
        if (!this.agent) return;
        if (this.agent.locked) return;

        let dx = this.agent.prefVel.x;
        let dz = this.agent.prefVel.z;
        const velX = this.agent.vel.x;
        const velZ = this.agent.vel.z;
        const minVel =
            Math.max(0.02, this.agent.maxSpeed * 0.05);
        const velLenSq = velX * velX + velZ * velZ;

        if (velLenSq >= minVel * minVel) {
            dx = velX;
            dz = velZ;
        }

        const lenSq = dx * dx + dz * dz;

        if (lenSq < 0.0001) {
            this.lastMoveIntentDir.x = 0;
            this.lastMoveIntentDir.z = 0;
            this.moveIntentFacingActive = false;
            return;
        }

        const invLen = 1 / Math.sqrt(lenSq);
        const dirX = dx * invLen;
        const dirZ = dz * invLen;

        if (
            Math.abs(dirX - this.lastMoveIntentDir.x) > 0.001 ||
            Math.abs(dirZ - this.lastMoveIntentDir.z) > 0.001
        ) {
            this.lastMoveIntentDir.x = dirX;
            this.lastMoveIntentDir.z = dirZ;
            this.moveIntentFacingActive = true;
        }

        if (!this.moveIntentFacingActive) return;

        this.moveIntentFacingActive =
            this.lookDirectionSmooth(dirX, dirZ, deltaTime);
    }

    private shouldSkipForwardMoveIntentLook() {
        if (!this.agent) return false;
        if (this.agent.locked) return false;
        if (this.moveIntentFacingActive) return false;

        let dx = this.agent.prefVel.x;
        let dz = this.agent.prefVel.z;
        const velX = this.agent.vel.x;
        const velZ = this.agent.vel.z;
        const minVel =
            Math.max(0.02, this.agent.maxSpeed * 0.05);
        const velLenSq = velX * velX + velZ * velZ;

        if (velLenSq >= minVel * minVel) {
            dx = velX;
            dz = velZ;
        }

        const lenSq = dx * dx + dz * dz;

        if (lenSq < 0.0001) {
            return true;
        }

        const invLen = 1 / Math.sqrt(lenSq);
        const dirX = dx * invLen;
        const dirZ = dz * invLen;
        const dot =
            dirX * this.forwardDir.x +
            dirZ * this.forwardDir.z;

        return dot >= FORWARD_LOOK_DOT_THRESHOLD;
    }

    private lookDirectionSmooth(
        dx: number,
        dz: number,
        deltaTime: number
    ) {
        if (dx * dx + dz * dz < 0.0001) return false;

        return this.applyFacingYaw(
            Math.atan2(dx, dz) * 180 / Math.PI,
            deltaTime
        );
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

        this.applyFacingYaw(
            Math.atan2(moveDx, moveDz) * 180 / Math.PI,
            deltaTime
        );
    }

    private applyFacingYaw(
        targetYaw: number,
        deltaTime: number
    ) {
        const currentY = this.getVisualEulerY();

        if (this.getAngleDeltaAbs(currentY, targetYaw) <= 0.5) {
            return false;
        }

        const newY = this.lerpAngle(
            currentY,
            targetYaw,
            this.rotationSpeed * deltaTime
        );

        this.setVisualYaw(newY);
        return true;
    }

    private getVisualNode(): Node {
        return this.visualRoot || this.node;
    }

    private getVisualEulerY() {
        if (!this.visualYawCacheValid) {
            this.refreshVisualYawCache();
        }

        return this.visualYawCache;
    }

    private setVisualYaw(y: number) {
        this.moveIntentFacingActive = true;
        this.visualYawCache = y;
        this.visualYawCacheValid = true;

        this.getVisualNode().setRotationFromEuler(
            0,
            y + this.visualYawOffset,
            0
        );
    }

    private refreshVisualYawCache() {
        this.visualYawCache =
            this.getVisualNode().eulerAngles.y -
            this.visualYawOffset;
        this.visualYawCacheValid = true;
    }

    private resetStableRotationPosition() {
        const p = this.node.worldPosition;

        this.lastStablePos.x = p.x;
        this.lastStablePos.z = p.z;
    }

    private resetMoveIntentFacing() {
        this.moveIntentFacingActive = true;
        this.lastMoveIntentDir.x = 0;
        this.lastMoveIntentDir.z = 0;
    }

    private lerpAngle(a: number, b: number, t: number) {
        let diff = (b - a) % 360;

        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        return a + diff * t;
    }

    private getAngleDeltaAbs(a: number, b: number) {
        let diff = (b - a) % 360;

        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        return Math.abs(diff);
    }
}
