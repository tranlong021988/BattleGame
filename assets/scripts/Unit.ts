import { _decorator, Component, Node, Vec3 } from 'cc';
import { UnitProps } from './UnitProps';
import { GameManager } from './GameManager';
import { UnitFamily } from './BattleTypes';

const { ccclass, property } = _decorator;
const FORWARD_LOOK_DOT_THRESHOLD = 0.98;
const UNIT_FAMILY_ARCHER = 2;
const UNIT_FAMILY_MONK = 6;
const RANGED_DANGER_RANGE_RATIO = 0.5;
const RANGED_SAFE_MIN_RANGE_RATIO = 1;
const RANGED_COMBAT_MOVE_SPEED_RATIO = 0.75;
const RANGED_YIELD_LOOK_BEHIND = 2.8;
const RANGED_YIELD_SIDE_RANGE = 1.35;
const RANGED_YIELD_SIDE_SPEED_RATIO = 0.55;
const RANGED_YIELD_BACK_SPEED_RATIO = 0.12;

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
    @property({
        tooltip:
            'Allows this unit to be pushed by hard separation even while busy/engaged and locked.',
    })
    canBePush = false;
    @property({
        tooltip:
            'Allows same-team forward/aggressive-forward units to pass through this unit in RVO avoidance.',
    })
    canBePassedThroughByForwardAlly = false;

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
    waveRuntimeId = -1;

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
    private lastMoveIntentSamplePos = { x: 0, z: 0 };
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
    private freeHuntContinuityActive = false;
    private freeHuntContinuityDir = { x: 0, z: 0 };
    private idleWithoutOrderTelemetryReported = false;
    private soloAggressiveSkirmishActive = false;
    // A ranged retaliation outside the parent's strategic target set behaves
    // as a one-member detachment until that local pursuit ends.
    private isolatedRangedPursuit = false;
    // The detachment remains isolated while it returns to its parent wave's
    // current lane. It only becomes a command member after arriving there.
    private isolatedRangedPursuitReturningToWave = false;
    private isolatedRangedPursuitReturnLaneId = -1;
    private isolatedRangedPursuitReturnCommandAttemptCount = 0;
    private isolatedRangedPursuitReturnRepeatedCommandCount = 0;
    private isolatedRangedPursuitReturnLocalCombatCount = 0;
    private isolatedRangedPursuitLastReturnCommandCause = '';
    private backToLaneActive = false;
    private backToLaneForwardAggressive = false;
    private backToLaneRecoveryCompleted = false;
    private rangedCombatMoveX = 0;
    private rangedCombatMoveZ = 0;
    private rangedKiteActive = false;
    private rangedKiteTelemetryTargetLifeId = -1;
    private rangedCombatDecisionTargetLifeId = -1;
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
        this.clearFreeHuntContinuity();
        this.resetIdleWithoutOrderTelemetry();
        this.soloAggressiveSkirmishActive = false;
        this.isolatedRangedPursuit = false;
        this.isolatedRangedPursuitReturningToWave = false;
        this.isolatedRangedPursuitReturnLaneId = -1;
        this.resetIsolatedRangedPursuitReturnTelemetry();
        this.backToLaneActive = false;
        this.backToLaneForwardAggressive = false;
        this.backToLaneRecoveryCompleted = false;
        this.resetRangedCombatMovement();

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
        this.lastMoveIntentSamplePos.x = p.x;
        this.lastMoveIntentSamplePos.z = p.z;
        this.resetMoveIntentFacing();

        this.applyRuntimeAgentData();
        this.applySteadyState();
    }

    public setSteady(value: boolean, useForwardPhase: boolean = true) {
        this.isSteady = value;

        if (!this.agent) return;

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();
        this.resetRangedCombatMovement();

        if (value) {
            this.setEnemyTarget(null);
            this.onBusy = false;
            this.clearFreeHuntContinuity();
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
        this.clearFreeHuntContinuity();
        this.onForward = useForwardPhase;
        this.backToLaneActive = false;
        this.resetRangedCombatMovement();

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

    private beginFreeHuntContinuity() {
        if (!this.agent) return;

        const prefVelocity = this.agent.prefVel;
        const x = Math.abs(prefVelocity.x) > 0.0001
            ? prefVelocity.x
            : this.forwardDir.x;
        const z = Math.abs(prefVelocity.z) > 0.0001
            ? prefVelocity.z
            : this.forwardDir.z;

        this.setFreeHuntContinuityDirection(x, z);
    }

    private setFreeHuntContinuityDirection(x: number, z: number) {
        const length = Math.sqrt(x * x + z * z);

        if (length <= 0.0001) return;

        this.freeHuntContinuityDir.x = x / length;
        this.freeHuntContinuityDir.z = z / length;
        this.freeHuntContinuityActive = true;
    }

    private clearFreeHuntContinuity() {
        this.freeHuntContinuityActive = false;
        this.freeHuntContinuityDir.x = 0;
        this.freeHuntContinuityDir.z = 0;
    }

    private continueFreeHuntContinuity(deltaTime: number) {
        if (!this.agent) return false;
        if (!this.freeHuntContinuityActive) return false;

        const gm = GameManager.instance;

        if (
            !gm ||
            gm.hasWaveHuntScannerConfirmedNoTarget(this)
        ) {
            this.clearFreeHuntContinuity();
            return false;
        }

        this.setAgentLocked(false);
        this.setAgentOnForward(0);

        const scanner = gm.getWaveHuntScannerForUnit(this);

        if (scanner && scanner !== this && scanner.agent) {
            const dx = scanner.agent.pos.x - this.agent.pos.x;
            const dz = scanner.agent.pos.z - this.agent.pos.z;
            const length = Math.sqrt(dx * dx + dz * dz);

            if (length > 0.0001) {
                this.setAgentPrefVelocity(
                    (dx / length) * this.agent.maxSpeed,
                    (dz / length) * this.agent.maxSpeed
                );
                this.lookMoveIntentSmooth(deltaTime);
                this.sync(deltaTime, false);
                return true;
            }
        }

        this.setAgentPrefVelocity(
            this.freeHuntContinuityDir.x * this.agent.maxSpeed,
            this.freeHuntContinuityDir.z * this.agent.maxSpeed
        );
        this.lookMoveIntentSmooth(deltaTime);
        this.sync(deltaTime, false);
        return true;
    }

    public isContinuingFreeHuntIntent() {
        return this.freeHuntContinuityActive &&
            !this.onBusy &&
            !this.onForward &&
            !this.hasValidEnemyTarget();
    }

    public isFreeHuntContinuityActive() {
        return this.freeHuntContinuityActive;
    }

    public clearWaveHuntContinuity() {
        this.clearFreeHuntContinuity();
    }

    private resetIdleWithoutOrderTelemetry() {
        this.idleWithoutOrderTelemetryReported = false;
    }

    private recordIdleWithoutOrderTelemetry() {
        if (this.idleWithoutOrderTelemetryReported) return;

        this.idleWithoutOrderTelemetryReported = true;
        GameManager.instance?.recordUnitIdleWithoutOrder(this);
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
        this.agent.waveRuntimeId = this.waveRuntimeId;
        this.setAgentOnForward(this.onForward ? 1 : 0);
        this.agent.canBePush = this.canBePush ? 1 : 0;
        this.agent.isHero = this.isHero ? 1 : 0;
        this.agent.canBePassedThroughByForwardAlly =
            this.canBePassedThroughByForwardAlly ? 1 : 0;

        this.agent.forwardX = this.forwardDir.x;
        this.agent.forwardZ = this.forwardDir.z;

        this.agent.enableAllyOvertake = this.enableAllyOvertake ? 1 : 0;
        this.agent.overtakeLookAhead = this.overtakeLookAhead;
        this.agent.overtakeSideRange = this.overtakeSideRange;
        this.agent.overtakeSideStrength = this.overtakeSideStrength;
        this.agent.overtakeSpeedDiff = this.overtakeSpeedDiff;
        this.agent.overtakeSeed = this.updateOffset % 2 === 0 ? 1 : -1;
    }

    public setWaveRuntimeId(id: number) {
        this.waveRuntimeId = Math.floor(id);

        if (this.agent) {
            this.agent.waveRuntimeId = this.waveRuntimeId;
        }
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
        this.resetRangedCombatMovement();

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
        this.resetRangedCombatMovement();
    }

    public isSoloAggressiveSkirmishActive() {
        return this.soloAggressiveSkirmishActive;
    }

    public isIsolatedRangedPursuit() {
        return this.isolatedRangedPursuit;
    }

    public isReturningToWaveAfterIsolatedRangedPursuit() {
        return this.isolatedRangedPursuit &&
            this.isolatedRangedPursuitReturningToWave;
    }

    public getTelemetryMovementIntent() {
        if (this.onBusy) return 'local-combat';
        if (this.isReturningToWaveAfterIsolatedRangedPursuit()) {
            return 'isolated-return';
        }
        if (this.backToLaneActive) return 'regroup';
        if (this.freeHuntContinuityActive) return 'free-hunt';
        if (this.onForward) return 'forward';
        return 'idle';
    }

    public recordIsolatedRangedPursuitReturnCommand(
        cause: string,
        wasAlreadyReturning: boolean
    ) {
        if (!this.isolatedRangedPursuit) return;

        this.isolatedRangedPursuitReturnCommandAttemptCount++;
        if (wasAlreadyReturning) {
            this.isolatedRangedPursuitReturnRepeatedCommandCount++;
        }
        this.isolatedRangedPursuitLastReturnCommandCause = cause;
    }

    public recordIsolatedRangedPursuitReturnLocalCombat() {
        if (!this.isReturningToWaveAfterIsolatedRangedPursuit()) {
            return;
        }

        this.isolatedRangedPursuitReturnLocalCombatCount++;
    }

    public getIsolatedRangedPursuitReturnCommandAttemptCount() {
        return this.isolatedRangedPursuitReturnCommandAttemptCount;
    }

    public getIsolatedRangedPursuitReturnRepeatedCommandCount() {
        return this.isolatedRangedPursuitReturnRepeatedCommandCount;
    }

    public getIsolatedRangedPursuitReturnLocalCombatCount() {
        return this.isolatedRangedPursuitReturnLocalCombatCount;
    }

    public getIsolatedRangedPursuitLastReturnCommandCause() {
        return this.isolatedRangedPursuitLastReturnCommandCause;
    }

    private resetIsolatedRangedPursuitReturnTelemetry() {
        this.isolatedRangedPursuitReturnCommandAttemptCount = 0;
        this.isolatedRangedPursuitReturnRepeatedCommandCount = 0;
        this.isolatedRangedPursuitReturnLocalCombatCount = 0;
        this.isolatedRangedPursuitLastReturnCommandCause = '';
    }

    public beginIsolatedRangedPursuitReturnToWaveLane(
        aggressiveForward: boolean
    ) {
        if (!this.isolatedRangedPursuit) return false;

        this.isolatedRangedPursuitReturningToWave = true;
        this.backToLaneRecoveryCompleted = false;

        const parentWaveLaneId =
            GameManager.instance?.getAssignedWaveLaneForUnit(this) ?? -1;

        if (parentWaveLaneId >= 0) {
            this.isolatedRangedPursuitReturnLaneId = parentWaveLaneId;
        }

        return this.startBackToLanePhase(aggressiveForward);
    }

    public updateIsolatedRangedPursuitReturnLane(
        laneId: number
    ) {
        if (!this.isReturningToWaveAfterIsolatedRangedPursuit()) return;
        if (laneId < 0) return;

        this.isolatedRangedPursuitReturnLaneId = laneId;
    }

    public hasReachedCurrentWaveLaneAfterIsolatedRangedPursuit() {
        if (!this.agent) return false;

        const gm = GameManager.instance;
        if (!gm) return false;

        const targetLaneId = this.getBackToLaneDestinationLaneId();

        return targetLaneId >= 0 &&
            gm.getDirectionToLaneArea(
                targetLaneId,
                this.agent.pos.x
            ) === 0;
    }

    public completeIsolatedRangedPursuitReturnToWaveLane(
        laneId: number
    ) {
        this.laneId = laneId;
        this.isolatedRangedPursuitReturningToWave = false;
        this.isolatedRangedPursuitReturnLaneId = -1;
        this.isolatedRangedPursuit = false;
        this.backToLaneActive = false;
        this.backToLaneForwardAggressive = false;
        this.backToLaneRecoveryCompleted = false;
    }

    public isBackToLaneActive() {
        return this.backToLaneActive;
    }

    public getTelemetryRegroupDestinationLaneId() {
        if (!this.backToLaneActive) return -1;

        return this.getBackToLaneDestinationLaneId();
    }

    public getTelemetryRegroupLaneCoreDistanceX() {
        if (!this.backToLaneActive || !this.agent) return -1;

        const gm = GameManager.instance;
        const targetLaneId = this.getBackToLaneDestinationLaneId();

        if (!gm || targetLaneId < 0) return -1;

        const laneWidth = gm.getLaneWidth();

        if (laneWidth <= 0) return -1;

        const coreHalfWidth = laneWidth * 0.25;
        const distanceFromCenter = Math.abs(
            this.agent.pos.x - gm.getLaneCenterX(targetLaneId)
        );

        return Math.max(0, distanceFromCenter - coreHalfWidth);
    }

    public resetBackToLaneRecoveryCompletion() {
        this.backToLaneRecoveryCompleted = false;
    }

    public hasCompletedBackToLaneRecovery() {
        return this.backToLaneRecoveryCompleted;
    }

    public beginBackToLanePhase(
        aggressiveForward: boolean
    ) {
        if (this.backToLaneActive) return true;

        const started = this.startBackToLanePhase(
            aggressiveForward
        );

        if (started) {
            GameManager.instance?.recordWaveRegroupTransition(
                'unit-regroup-started',
                this
            );
        }

        return started;
    }

    public cancelBackToLanePhase() {
        if (!this.backToLaneActive) return false;

        this.backToLaneActive = false;
        this.backToLaneForwardAggressive = false;
        this.backToLaneRecoveryCompleted = false;

        if (this.agent) {
            this.setAgentOnForward(0);
            this.setAgentLocked(false);
            this.setAgentStopped();
        }

        return true;
    }

    public isRangedCombatUnit() {
        if (!this.props) return false;

        return this.props.family === UNIT_FAMILY_ARCHER ||
            this.props.family === UNIT_FAMILY_MONK;
    }

    public isCurrentEnemyInAttackRange() {
        return this.isValidEnemyWithinAttackRange(
            this.getValidEnemyTarget()
        );
    }

    public isEnemyWithinAttackRange(enemy: Unit | null) {
        return this.isValidEnemyWithinAttackRange(enemy);
    }

    public consumeAttackRangeCardBudget(enemy: Unit) {
        const gm = GameManager.instance;

        if (!gm) return false;

        return gm.consumeAttackRangeCardBudget(
            this.team,
            this.props.family,
            enemy.props.family
        );
    }

    private setCachedNearestInRangeTarget(target: Unit | null) {
        this.cachedNearestInRange = target;
        this.cachedNearestInRangeLifeId = target ? target.lifeId : -1;
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

    public primeWaveHuntTarget(target: Unit | null) {
        if (this.onBusy) return false;
        if (!this.setWaveSearchTarget(target)) return false;
        if (!this.agent || !target!.agent) return true;

        const dx = target!.agent.pos.x - this.agent.pos.x;
        const dz = target!.agent.pos.z - this.agent.pos.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        this.onForward = false;
        this.setAgentOnForward(0);
        this.setAgentLocked(this.isSteady);

        if (distance > 0.0001) {
            this.setAgentPrefVelocity(
                (dx / distance) * this.agent.maxSpeed,
                (dz / distance) * this.agent.maxSpeed
            );
        }

        return true;
    }

    public hasReachedEnemyHeroLine() {
        const gm = GameManager.instance;

        return gm
            ? gm.hasUnitReachedEnemyHeroLine(this)
            : false;
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
        if (!this.isValidEnemy(attacker)) return false;

        // A melee unit only reacts to a ranged opponent after that opponent
        // has actually entered melee contact range. Remote ranged fire is
        // damage support, not an order to chase or to alter the parent wave.
        if (
            !this.isRangedCombatUnit() &&
            attacker!.isRangedCombatUnit() &&
            !this.isEnemyWithinAttackRange(attacker)
        ) {
            return false;
        }

        const gm = GameManager.instance;
        // A confirmed melee contact promotes every recovering parent wave in
        // the pair. This damage-path call is a fallback for contacts that were
        // not observed through the normal combat-entry path first.
        const regroupMeleeReengaged =
            !this.isolatedRangedPursuit &&
            !!gm?.tryReengageWavesFromRecoveryMeleeContact(
                attacker,
                this
            );

        if (this.onBusy) return regroupMeleeReengaged;

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

        const wasBackToLane = this.backToLaneActive;
        const soloAggressive =
            gm
                ? gm.shouldUseSoloAggressiveSkirmish(
                    this,
                    attacker
                )
                : false;
        // Only a local engagement can interrupt recovery. A remote ranged hit
        // has already returned above and cannot create a pursuit detachment.

        this.targetSearchPending = false;
        this.targetSearchConfirmedNoTarget = false;

        // Damage reaction keeps the actual attacker as the pursuit target.
        // A different enemy can replace it only through the normal local
        // attack-range combat check in update().
        this.setRetaliationTarget(attacker!);

        this.setCachedNearestInRangeTarget(null);
        this.soloAggressiveSkirmishActive =
            this.soloAggressiveSkirmishActive ||
            soloAggressive;

        if (regroupMeleeReengaged) {
            this.cancelBackToLanePhase();
        } else if (wasBackToLane) {
            gm?.recordWaveRegroupTransition(
                'unit-regroup-local-combat-retained',
                this,
                attacker
            );

            if (this.isReturningToWaveAfterIsolatedRangedPursuit()) {
                this.recordIsolatedRangedPursuitReturnLocalCombat();
                gm?.recordIsolatedRangedPursuit(
                    'isolated-ranged-pursuit-return-local-combat',
                    this,
                    attacker
                );
            }
        }

        if (this.onForward || wasBackToLane) {
            this.onForward = false;
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
        this.isolatedRangedPursuit = false;
        this.isolatedRangedPursuitReturningToWave = false;
        this.isolatedRangedPursuitReturnLaneId = -1;
        this.resetIsolatedRangedPursuitReturnTelemetry();
        this.backToLaneActive = false;
        this.backToLaneForwardAggressive = false;
        this.backToLaneRecoveryCompleted = false;
        this.resetRangedCombatMovement();
        this.invalidateNearestQueryResults();
        this.clearCachedTargets();
        this.laneId = -1;
        this.setWaveRuntimeId(-1);
        this.aggressiveForward = false;
        this.canBePassedThroughByForwardAlly = false;
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
        const wasIsolatedRangedPursuit =
            this.isolatedRangedPursuit;
        const wasBusy = this.onBusy;
        const previousTarget = this.getValidEnemyTarget();
        this.setEnemyTarget(null);
        this.onBusy = false;

        if (wasIsolatedRangedPursuit) {
            if (
                GameManager.instance?.finishIsolatedRangedPursuit(
                    this,
                    previousTarget
                )
            ) {
                return;
            }
        }

        // A local combat may have been the final blocker for a synchronized
        // recovery. Notify the wave once at this state transition so it can
        // resume immediately instead of waiting for the next scanner tick.
        // The manager ignores units whose wave is not in recovery.
        if (wasBusy || previousTarget) {
            GameManager.instance?.tryResumeWaveForwardFromLocalCombatEnd(this);
        }

        // Local combat only pauses regrouping. Once that target is gone, the
        // unit must finish returning to its lane before it may advance again.
        if (this.backToLaneActive) {
            this.invalidateNearestQueryResults();
            this.clearCachedTargets();
            this.resetRangedCombatMovement();

            if (this.agent) {
                this.setAgentOnForward(0);
                this.setAgentLocked(false);
                this.setAgentStopped();
            }
            return;
        }

        // A local combat does not own the wave's order. If the wave has
        // already recovered into either forward mode, this survivor returns
        // to that mode when its local target disappears.
        const forwardAggressive =
            GameManager.instance?.getForwardModeAfterLocalCombat(this);

        if (forwardAggressive !== null &&
            forwardAggressive !== undefined) {
            this.enterWaveForwardMode(
                forwardAggressive,
                true
            );
            return;
        }

        // Keep the last free-hunt intent while the scanner waits for the
        // next wave order. Movement modes that must stop or redirect
        // (steady, forward, and back-to-lane) clear it explicitly.

        // A wave can retain a live strategic target while this unit's local
        // target dies or moves beyond its search radius. Combat mode clears
        // the old continuity, so restore it here: otherwise the unit reaches
        // the no-target branch below and remains stopped until an enemy comes
        // back within range. On the next update it follows the wave scanner,
        // or preserves its last travel direction while the scanner searches.
        if (this.shouldResumeWaveHuntContinuity()) {
            this.beginFreeHuntContinuity();
        }

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();
        this.resetRangedCombatMovement();

        if (this.agent) {
            this.setAgentStopped();
            this.setAgentLocked(this.isSteady);
        }
    }

    private shouldResumeWaveHuntContinuity() {
        if (!this.agent) return false;
        if (this.isSteady) return false;
        if (this.onForward) return false;
        if (this.backToLaneActive) return false;

        return !!GameManager.instance?.getWaveTargetForUnit(this);
    }

    public haltForBattleEnd() {
        this.setEnemyTarget(null);
        this.onBusy = false;
        this.clearFreeHuntContinuity();
        this.onForward = false;
        this.backToLaneActive = false;
        this.backToLaneForwardAggressive = false;
        this.soloAggressiveSkirmishActive = false;
        this.isolatedRangedPursuit = false;
        this.isolatedRangedPursuitReturningToWave = false;
        this.isolatedRangedPursuitReturnLaneId = -1;
        this.resetIsolatedRangedPursuitReturnTelemetry();
        this.resetRangedCombatMovement();
        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

        if (this.agent) {
            this.setAgentOnForward(0);
            this.setAgentLocked(true);
            this.setAgentStopped();
        }
    }

    public disengageCurrentEnemyForChase() {
        if (!this.hasValidEnemyTarget()) {
            this.clearEnemy();
            return false;
        }

        this.onBusy = false;
        this.resetBusyLookCache();
        this.resetRangedCombatMovement();

        if (this.agent) {
            this.setAgentLocked(this.isSteady);
            this.setAgentOnForward(0);
            this.setAgentStopped();
        }

        return true;
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
        this.resetRangedCombatMovement();
        this.targetSearchRange = Math.max(
            this.targetSearchRange,
            searchRange
        );

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

        if (!this.onBusy) {
            this.beginFreeHuntContinuity();
        }

        if (!this.onBusy) {
            this.setEnemyTarget(null);
        }

        if (this.agent) {
            this.setAgentLocked(this.onBusy);
            this.setAgentOnForward(0);

            if (!this.onBusy) {
                this.setAgentPrefVelocity(
                    this.freeHuntContinuityDir.x *
                        this.agent.maxSpeed,
                    this.freeHuntContinuityDir.z *
                        this.agent.maxSpeed
                );
            }
        }
    }

    enterWaveCombatMode() {
        this.resetIdleWithoutOrderTelemetry();
        this.onForward = false;
        this.aggressiveForward = false;
        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = false;
        this.resetStableRotationPosition();
        this.resetRangedCombatMovement();

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();
        this.clearFreeHuntContinuity();

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
        this.resetIdleWithoutOrderTelemetry();
        this.onForward = false;
        this.aggressiveForward = false;
        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = false;
        this.resetStableRotationPosition();
        this.resetRangedCombatMovement();

        if (searchRange > 0) {
            this.targetSearchRange = Math.max(
                this.targetSearchRange,
                searchRange
            );
        }

        this.invalidateNearestQueryResults();
        this.clearCachedTargets();

        if (!this.onBusy) {
            this.beginFreeHuntContinuity();
        }

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
        this.resetIdleWithoutOrderTelemetry();
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
        this.clearFreeHuntContinuity();
        this.onForward = true;
        this.aggressiveForward = aggressiveForward;
        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = false;
        this.backToLaneForwardAggressive = false;
        this.resetStableRotationPosition();
        this.resetMoveIntentFacing();
        this.resetRangedCombatMovement();

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

        if (GameManager.instance?.isBattleCombatLocked()) {
            this.haltForBattleEnd();
            this.sync(deltaTime, false);
            return;
        }

        this.agent.maxSpeed = this.getEffectiveMoveSpeed();
        this.frameCounter++;

        if (this.props && this.shouldRunTargetSearch()) {
            const gm = GameManager.instance;

            this.props.refreshHealthBarVisibility(
                gm ? gm.shouldShowUnitHealthBars() : false
            );
        }

        if (this.props && this.props.isDead()) {
            if (this.isHero) {
                GameManager.instance?.resolveHeroDefeat(this);
            }

            this.setEnemyTarget(null);
            this.onBusy = false;
            this.onForward = false;
            this.isolatedRangedPursuit = false;
            this.isolatedRangedPursuitReturningToWave = false;
            this.isolatedRangedPursuitReturnLaneId = -1;
            this.resetIsolatedRangedPursuitReturnTelemetry();
            this.backToLaneActive = false;
            this.resetRangedCombatMovement();
            this.setAgentOnForward(0);
            this.setAgentLocked(true);
            this.setAgentStopped();
            this.sync(deltaTime, false);
            return;
        }

        if (
            GameManager.instance?.resolveUnitReachedEnemyHeroLine(
                this
            )
        ) {
            // The scanner's whole wave has been returned to the pool. Do not
            // issue movement or simulator commands to this recycled member.
            return;
        }

        if (this.updateSteadyHeroGuard(deltaTime)) {
            return;
        }

        if (this.isSteady) {
            this.setAgentLocked(true);
            this.setAgentStopped();
            this.onForward = false;
            this.setAgentOnForward(0);
        }

        if (this.onBusy) {
            const busyEnemy = this.getValidEnemyTarget();

            if (!busyEnemy) {
                this.clearEnemy();
            } else {
                if (
                    this.updateRangedBusyCombat(
                        busyEnemy,
                        deltaTime
                    )
                ) {
                    return;
                }

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

            this.onForward = false;
            this.setAgentOnForward(0);

            this.setEnemyTarget(nearestInRange);
            this.onBusy = true;
            this.setAgentLocked(true);

            if (gm) {
                gm.onWaveCombatStarted(
                    this,
                    nearestInRange
                );
            }

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

        if (this.shouldRunTargetSearch()) {
            this.tryResumeSoloForwardAfterAggressiveSkirmish();
        }

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

        if (
            !this.hasValidEnemyTarget() &&
            this.shouldRunTargetSearch()
        ) {
            this.setEnemyTarget(
                this.getSharedWaveTarget()
            );
        }

        const enemy = this.getValidEnemyTarget();

        if (enemy && enemy.agent) {
            this.resetIdleWithoutOrderTelemetry();
            const dx = enemy.agent.pos.x - this.agent.pos.x;
            const dz = enemy.agent.pos.z - this.agent.pos.z;

            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.0001) {
                this.setFreeHuntContinuityDirection(dx, dz);
                this.setAgentPrefVelocity(
                    (dx / dist) * this.agent.maxSpeed,
                    (dz / dist) * this.agent.maxSpeed
                );
            }

            this.lookAtTargetSmooth(enemy, deltaTime);
            this.sync(deltaTime, false);
        } else {
            if (this.continueFreeHuntContinuity(deltaTime)) {
                this.resetIdleWithoutOrderTelemetry();
                return;
            }

            this.recordIdleWithoutOrderTelemetry();
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

        this.enterWaveForwardMode(
            this.aggressiveForward,
            true
        );
        return true;
    }

    private startBackToLanePhase(
        aggressiveForward: boolean
    ) {
        if (!this.agent) return false;

        const gm = GameManager.instance;

        if (!gm) return false;

        const targetLaneId = this.getBackToLaneDestinationLaneId();

        if (targetLaneId < 0) return false;

        const dir =
            gm.getDirectionToLaneArea(
                targetLaneId,
                this.agent.pos.x
            );

        if (dir === 0) return false;

        this.setEnemyTarget(null);
        this.onBusy = false;
        this.clearFreeHuntContinuity();
        this.onForward = false;
        this.aggressiveForward = aggressiveForward;
        this.soloAggressiveSkirmishActive = false;
        this.backToLaneActive = true;
        this.backToLaneForwardAggressive = aggressiveForward;
        this.resetStableRotationPosition();
        this.resetMoveIntentFacing();
        this.resetRangedCombatMovement();

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

    private getBackToLaneDestinationLaneId() {
        if (this.isReturningToWaveAfterIsolatedRangedPursuit()) {
            if (this.isolatedRangedPursuitReturnLaneId >= 0) {
                return this.isolatedRangedPursuitReturnLaneId;
            }
        }

        return this.laneId;
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

        if (!gm) {
            this.backToLaneActive = false;
            this.backToLaneForwardAggressive = false;
            this.setAgentOnForward(0);
            this.setAgentStopped();
            return true;
        }

        const targetLaneId = this.getBackToLaneDestinationLaneId();

        if (targetLaneId < 0) {
            this.backToLaneActive = false;
            this.backToLaneForwardAggressive = false;
            this.setAgentOnForward(0);
            this.setAgentStopped();
            return true;
        }

        const dir =
            gm.getDirectionToLaneArea(
                targetLaneId,
                this.agent.pos.x
            );

        if (dir === 0) {
            if (this.isReturningToWaveAfterIsolatedRangedPursuit()) {
                this.backToLaneActive = false;
                this.backToLaneForwardAggressive = false;
                this.onForward = false;
                this.setAgentOnForward(0);
                this.setAgentStopped();
                gm.completeIsolatedRangedPursuitReturnToWaveLane(
                    this,
                    targetLaneId
                );
                return true;
            }

            // Reaching the lane completes this member's regroup phase. The
            // parent wave is then notified once, so the final ready member
            // can release synchronized recovery without an empty wait for the
            // next scanner interval.
            this.backToLaneActive = false;
            this.backToLaneForwardAggressive = false;
            this.backToLaneRecoveryCompleted = true;
            this.onForward = false;
            this.setAgentOnForward(0);
            this.setAgentStopped();
            gm.recordWaveRegroupTransition(
                'unit-regroup-completed',
                this
            );
            gm.tryResumeWaveForwardFromRegroupCompletion(this);
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
                const wasBusy = this.onBusy;

                this.setEnemyTarget(target);
                this.onBusy = true;
                this.setAgentLocked(true);

                if (!wasBusy) {
                    GameManager.instance?.onWaveCombatStarted(
                        this,
                        target,
                        false
                    );
                }
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
        if (this.hasValidEnemyTarget()) return;

        // Isolated pursuit owns a lifecycle. Clearing its dead target through
        // the generic path would leave the unit detached with no next order.
        if (this.isolatedRangedPursuit) {
            this.clearEnemy();
            return;
        }

        this.setEnemyTarget(null);
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
            const effectiveRange =
                this.getEffectiveAttackRangeAgainst(e);

            if (d > effectiveRange * effectiveRange) continue;

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
        return this.getEffectiveAttackRange(
            enemy.props.family
        ) +
            Math.max(0, this.radius) +
            Math.max(0, enemy.radius);
    }

    private getEffectiveAttackRange(
        opposingFamily?: UnitFamily
    ) {
        const gm = GameManager.instance;
        const modifiers = gm
            ? gm.getBattleCardModifiers(
                this.team,
                this.props.family,
                opposingFamily
            )
            : null;

        return Math.max(
            0,
            this.attackRange *
            (modifiers
                ? modifiers.attackRangeMultiplier
                : 1)
        );
    }

    private getEffectiveMoveSpeed() {
        const gm = GameManager.instance;
        const modifiers = gm
            ? gm.getBattleCardModifiers(
                this.team,
                this.props.family
            )
            : null;

        return Math.max(
            0,
            this.moveSpeed *
            (modifiers ? modifiers.moveSpeedMultiplier : 1)
        );
    }

    private getAttackRangeSearchRadius() {
        const gm = GameManager.instance;
        const maxEnemyRadius =
            gm && gm.spatialGrid
                ? gm.spatialGrid.getMaxEnemyRadius(this.team)
                : this.radius;

        return this.getEffectiveAttackRange() +
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

    private getAllyList() {
        const gm = GameManager.instance;

        if (!gm) return [];

        return this.team === 0
            ? gm.teamA
            : gm.teamB;
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

    private getNearbyAllyList(radius: number) {
        if (!this.agent) return [];

        const gm = GameManager.instance;

        if (gm && gm.spatialGrid) {
            return gm.spatialGrid.queryAllies(
                this.team,
                this.agent.pos.x,
                this.agent.pos.z,
                radius
            );
        }

        return this.getAllyList();
    }

    private updateRangedBusyCombat(
        target: Unit,
        deltaTime: number
    ) {
        if (!this.isRangedCombatUnit()) {
            return false;
        }

        if (!this.agent || !target.agent) {
            return false;
        }

        if (this.isMeleeEnemyEngagingThis(target)) {
            this.resetRangedCombatMovement();
            this.setAgentOnForward(0);
            this.setAgentLocked(true);
            this.setAgentStopped();

            const rotated =
                this.lookAtTargetSmooth(
                    target,
                    deltaTime
                );

            this.sync(deltaTime, false);
            this.updateBusyLookSettled(
                target,
                rotated
            );

            return true;
        }

        if (
            this.shouldRunTargetSearch() ||
            this.rangedCombatDecisionTargetLifeId !== target.lifeId
        ) {
            this.refreshRangedCombatMovement(
                target
            );
        }

        this.setAgentOnForward(0);
        this.setAgentLocked(false);

        const hasMovement =
            this.hasRangedCombatMovement();

        if (hasMovement) {
            this.setAgentPrefVelocity(
                this.rangedCombatMoveX,
                this.rangedCombatMoveZ
            );
        } else {
            this.setAgentStopped();
        }

        const rotated =
            hasMovement
                ? this.lookDirectionSmooth(
                    this.rangedCombatMoveX,
                    this.rangedCombatMoveZ,
                    deltaTime
                )
                : this.lookAtTargetSmooth(
                    target,
                    deltaTime
                );

        this.sync(deltaTime, false);

        if (!hasMovement) {
            this.updateBusyLookSettled(
                target,
                rotated
            );
        } else {
            this.resetBusyLookCache();
        }

        return true;
    }

    public isRangedCombatRepositioning() {
        return this.isRangedCombatUnit() &&
            this.onBusy &&
            this.hasRangedCombatMovement();
    }

    private isSameLogicLaneAs(
        ally: Unit
    ) {
        if (this.laneId < 0 || ally.laneId < 0) {
            return false;
        }

        const gm = GameManager.instance;

        if (!gm) {
            return this.laneId === ally.laneId;
        }

        return gm.clampLaneId(this.laneId) ===
            gm.clampLaneId(ally.laneId);
    }

    private isMeleeEnemyEngagingThis(
        enemy: Unit
    ) {
        if (!this.agent || !enemy.agent) return false;
        if (!this.isValidEnemy(enemy)) return false;
        if (enemy.isRangedCombatUnit()) return false;

        const dx =
            this.agent.pos.x - enemy.agent.pos.x;
        const dz =
            this.agent.pos.z - enemy.agent.pos.z;
        const range =
            enemy.getEffectiveAttackRangeAgainst(this);

        return dx * dx + dz * dz <=
            range * range;
    }

    private refreshRangedCombatMovement(
        target: Unit
    ) {
        this.rangedCombatDecisionTargetLifeId =
            target.lifeId;
        this.rangedCombatMoveX = 0;
        this.rangedCombatMoveZ = 0;

        if (!this.agent || !target.agent) {
            this.rangedKiteActive = false;
            return;
        }

        const dx =
            target.agent.pos.x - this.agent.pos.x;
        const dz =
            target.agent.pos.z - this.agent.pos.z;
        const dist =
            Math.sqrt(dx * dx + dz * dz);
        const range =
            Math.max(
                0.001,
                this.getEffectiveAttackRange(target.props.family)
            );
        const dangerDistance =
            range * RANGED_DANGER_RANGE_RATIO;
        const safeMinDistance =
            range * RANGED_SAFE_MIN_RANGE_RATIO;

        if (
            dist < dangerDistance ||
            (
                this.rangedKiteActive &&
                dist < safeMinDistance
            )
        ) {
            this.rangedKiteActive = true;
            this.setRangedCombatMoveTowardOwnSide();
            this.recordRangedKiteTelemetry(
                target,
                dist
            );
            return;
        }

        this.rangedKiteActive = false;
        this.rangedKiteTelemetryTargetLifeId = -1;

        if (dist > range) {
            this.setRangedCombatMoveToward(
                dx,
                dz
            );
            return;
        }

        if (this.hasForwardMeleeAllyBehind()) {
            this.setRangedCombatYieldMovement();
        }
    }

    private setRangedCombatMoveTowardOwnSide() {
        const speed =
            this.getRangedCombatMoveSpeed();

        this.rangedCombatMoveX = -this.forwardDir.x * speed;
        this.rangedCombatMoveZ = -this.forwardDir.z * speed;
    }

    private recordRangedKiteTelemetry(
        target: Unit,
        targetDistance: number
    ) {
        if (this.rangedKiteTelemetryTargetLifeId === target.lifeId) {
            return;
        }

        this.rangedKiteTelemetryTargetLifeId = target.lifeId;
        GameManager.instance?.recordBattleTelemetryRangedKite(
            this,
            target,
            'started',
            targetDistance,
            this.rangedCombatMoveX,
            this.rangedCombatMoveZ
        );
    }

    private setRangedCombatMoveToward(
        targetDx: number,
        targetDz: number
    ) {
        const len =
            Math.sqrt(
                targetDx * targetDx +
                targetDz * targetDz
            );

        if (len <= 0.0001) return;

        const speed =
            this.getRangedCombatMoveSpeed();

        this.rangedCombatMoveX =
            targetDx / len * speed;
        this.rangedCombatMoveZ =
            targetDz / len * speed;
    }

    private setRangedCombatYieldMovement() {
        if (!this.agent) return;

        const gm = GameManager.instance;

        if (!gm || this.laneId < 0) return;

        const laneId =
            gm.clampLaneId(this.laneId);
        const laneCenterX =
            gm.getLaneCenterX(laneId);
        const laneMinX =
            gm.getLaneMinX(laneId) +
            Math.max(0, this.radius);
        const laneMaxX =
            gm.getLaneMaxX(laneId) -
            Math.max(0, this.radius);
        let side =
            this.updateOffset % 2 === 0 ? 1 : -1;

        if (
            Math.abs(this.agent.pos.x - laneCenterX) > 0.05
        ) {
            side =
                this.agent.pos.x >= laneCenterX ? 1 : -1;
        }

        if (
            side > 0 &&
            this.agent.pos.x >= laneMaxX - 0.05
        ) {
            return;
        }

        if (
            side < 0 &&
            this.agent.pos.x <= laneMinX + 0.05
        ) {
            return;
        }

        const speed =
            Math.max(0, this.agent.maxSpeed);

        this.rangedCombatMoveX =
            side *
            speed *
            RANGED_YIELD_SIDE_SPEED_RATIO;
        this.rangedCombatMoveZ =
            -this.forwardDir.z *
            speed *
            RANGED_YIELD_BACK_SPEED_RATIO;
    }

    private hasForwardMeleeAllyBehind() {
        if (!this.agent) return false;

        const allies =
            this.getNearbyAllyList(
                RANGED_YIELD_LOOK_BEHIND +
                RANGED_YIELD_SIDE_RANGE +
                Math.max(0, this.radius)
            );

        for (let i = 0; i < allies.length; i++) {
            const ally = allies[i];

            if (!this.isForwardMeleeAllyBlocker(ally)) {
                continue;
            }

            const dx =
                ally.agent!.pos.x - this.agent.pos.x;
            const dz =
                ally.agent!.pos.z - this.agent.pos.z;
            const forwardDist =
                dx * this.forwardDir.x +
                dz * this.forwardDir.z;

            if (forwardDist > 0.35) continue;
            if (forwardDist < -RANGED_YIELD_LOOK_BEHIND) continue;

            const sideDist =
                dx * this.forwardDir.z -
                dz * this.forwardDir.x;
            const sideRange =
                RANGED_YIELD_SIDE_RANGE +
                Math.max(0, this.radius) +
                Math.max(0, ally.radius);

            if (Math.abs(sideDist) > sideRange) {
                continue;
            }

            return true;
        }

        return false;
    }

    private isForwardMeleeAllyBlocker(
        ally: Unit | null
    ) {
        if (!ally || ally === this) return false;
        if (ally.team !== this.team) return false;
        if (!ally.node.activeInHierarchy) return false;
        if (!ally.agent) return false;
        if (!ally.props || ally.props.isDead()) return false;
        if (ally.waveRuntimeId === this.waveRuntimeId) return false;
        if (!this.isSameLogicLaneAs(ally)) return false;
        if (!ally.onForward) return false;
        if (ally.isRangedCombatUnit()) return false;

        const dot =
            ally.forwardDir.x * this.forwardDir.x +
            ally.forwardDir.z * this.forwardDir.z;

        return dot > 0.5;
    }

    private getRangedCombatMoveSpeed() {
        if (!this.agent) return 0;

        return Math.max(0, this.agent.maxSpeed) *
            RANGED_COMBAT_MOVE_SPEED_RATIO;
    }

    private hasRangedCombatMovement() {
        return this.rangedCombatMoveX *
            this.rangedCombatMoveX +
            this.rangedCombatMoveZ *
            this.rangedCombatMoveZ >
            0.0001;
    }

    private resetRangedCombatMovement() {
        this.rangedCombatMoveX = 0;
        this.rangedCombatMoveZ = 0;
        this.rangedKiteActive = false;
        this.rangedKiteTelemetryTargetLifeId = -1;
        this.rangedCombatDecisionTargetLifeId = -1;
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
        const minMove =
            Math.max(
                this.visualThreshold,
                this.moveThreshold
            );

        if (
            velLenSq >= minVel * minVel &&
            this.hasMoveIntentVisualMovement(minMove)
        ) {
            dx = velX;
            dz = velZ;
            this.updateMoveIntentSamplePosition();
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
        const minMove =
            Math.max(
                this.visualThreshold,
                this.moveThreshold
            );

        if (
            velLenSq >= minVel * minVel &&
            this.hasMoveIntentVisualMovement(minMove)
        ) {
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

    private hasMoveIntentVisualMovement(
        minMove: number
    ) {
        const current = this.node.worldPosition;
        const dx =
            current.x - this.lastMoveIntentSamplePos.x;
        const dz =
            current.z - this.lastMoveIntentSamplePos.z;

        return dx * dx + dz * dz >=
            minMove * minMove;
    }

    private updateMoveIntentSamplePosition() {
        const current = this.node.worldPosition;

        this.lastMoveIntentSamplePos.x = current.x;
        this.lastMoveIntentSamplePos.z = current.z;
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
            Math.max(
                0,
                Math.min(
                    1,
                    this.rotationSpeed * deltaTime
                )
            )
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
        this.lastMoveIntentSamplePos.x = p.x;
        this.lastMoveIntentSamplePos.z = p.z;
    }

    private resetMoveIntentFacing() {
        this.moveIntentFacingActive = true;
        this.lastMoveIntentDir.x = 0;
        this.lastMoveIntentDir.z = 0;
        this.updateMoveIntentSamplePosition();
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
