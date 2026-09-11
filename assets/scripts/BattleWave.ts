import { Node, Vec3 } from 'cc';
import { Unit } from './Unit';
import { UnitFamily } from './BattleTypes';

export class BattleWave {

    private static unitWaveMap: WeakMap<Unit, number> = new WeakMap();
    private static unitWaveObjectMap: WeakMap<Unit, BattleWave> = new WeakMap();

    id = 0;
    team = 0;

    unitName = '';
    family: UnitFamily = UnitFamily.Spear;
    tier = 1;

    totalCount = 0;
    units: Unit[] = [];

    laneId = -1;
    released = false;

    private runtimeStateFrame = -1;
    private runtimeAliveCount = 0;
    private runtimeHasEngaged = false;
    private runtimeHealthFrame = -1;
    private runtimeHealthRatio = 1;
    private totalMaxHealth = 0;
    private targetSearchIntervalFrames = 1;
    private forwardModeActive = true;
    private freeHuntActive = false;
    private aggressiveForwardMode = false;
    private freeHuntForwardOrigin: 'normal' | 'aggressive' =
        'normal';
    // Aggressive Forward owns its spawn lane even while Free Hunt pulls
    // individual members into an adjacent lane.
    private aggressiveForwardOriginLaneId = -1;
    private aggressiveAdjacentBoundaryObserved = false;
    private aggressiveOwnLaneBlockObserved = false;
    private initialForwardCombatGateActive = true;
    // One dynamic scanner per wave. In Forward it must still be marching;
    // in Free Hunt the frontmost alive unit takes the same captain role.
    private scannerUnit: Unit | null = null;
    // Strategic Free Hunt order. `targetWave` remains the compatibility
    // primary (the first live entry), while the collection is authoritative.
    private targetWave: BattleWave | null = null;
    private targetWaves: BattleWave[] = [];
    private targetLifecyclePending = false;
    private targetLifecyclePendingFrame = -1;
    private targetLifecyclePendingTargetWaveId = -1;
    private targetLifecyclePendingEventCount = 0;
    private targetLifecyclePendingReason = '';
    private regroupLaneAfterTargetClear = -1;
    private awaitingForwardRecoveryAfterTargetClear = false;
    private forwardRecoveryLanePrepared = false;
    // Recovery is a single transaction. Once an idle command member reaches
    // the regroup lane, later scanner ticks must not enroll it again.
    private forwardRecoveryReadyUnitLifeIds: Set<number> = new Set();
    // Legacy recovery-readiness flag retained for telemetry compatibility.
    // It becomes true immediately when the strategic target set is empty;
    // target death no longer schedules another scanner search.
    private targetClearSameLaneSearchResolved = false;
    private forwardRecoveryBlockTelemetryPending = false;
    private forwardRecoveryDeferredTelemetryPending = false;
    private clearedTargetTelemetry: {
        id: number;
        team: number;
        laneId: number;
        family: UnitFamily;
        remainingTargetWaveCount: number;
        physicallyDead: boolean;
    }[] = [];
    private targetClearOutcomeTelemetry: {
        reason: string;
        scanner: Unit | null;
        target: Unit | null;
    } | null = null;
    private immediateTargetSearchPending = false;
    private lastForwardRecoveryResumedUnitCount = 0;
    private lastForwardRecoveryRetainedBusyUnitCount = 0;
    private lastForwardRecoveryRetainedBusyUnitLifeIds: number[] = [];
    private lastRegroupMeleeCancelledUnitLifeIds: number[] = [];
    private representativeUnit: Unit | null = null;
    private waveBannerNode: Node | null = null;
    private waveBannerRecycle:
        ((node: Node) => void) | null = null;
    private waveBannerOnAttached:
        ((node: Node) => void) | null = null;
    private waveBannerBaseScale = new Vec3(1, 1, 1);

    constructor(
        id: number,
        team: number,
        unitName: string,
        family: UnitFamily,
        tier: number,
        totalCount: number,
        laneId: number = -1
    ) {
        this.id = id;
        this.team = team;
        this.unitName = unitName;
        this.family = family;
        this.tier = Math.max(1, Math.min(3, Math.floor(tier)));
        this.totalCount = totalCount;
        this.laneId = laneId;
    }

    addUnit(unit: Unit) {
        if (!unit) return;
        if (this.released) return;

        const previousWave =
            BattleWave.unitWaveObjectMap.get(unit);

        if (previousWave && previousWave !== this) {
            previousWave.detachReusedUnitReference(unit);
        }

        BattleWave.unitWaveMap.set(unit, this.id);
        BattleWave.unitWaveObjectMap.set(unit, this);
        unit.setWaveRuntimeId(this.id);
        unit.laneId = this.laneId;

        if (this.units.indexOf(unit) < 0) {
            if (this.units.length <= 0) {
                this.targetSearchIntervalFrames =
                    Math.max(
                        1,
                        Math.floor(
                            unit.targetSearchIntervalFrames
                        )
                    );
            }

            if (unit.aggressiveForward) {
                this.aggressiveForwardMode = true;
                this.aggressiveForwardOriginLaneId =
                    this.laneId;
            }

            if (unit.props) {
                this.totalMaxHealth +=
                    Math.max(
                        0,
                        unit.props.maxHealth
                    );
            }

            this.units.push(unit);
            this.runtimeHealthFrame = -1;
        }
    }

    private detachReusedUnitReference(unit: Unit) {
        const index = this.units.indexOf(unit);

        if (index >= 0) {
            this.units.splice(index, 1);
        }

        if (this.scannerUnit === unit) {
            this.scannerUnit = null;
        }

        if (this.representativeUnit === unit) {
            this.representativeUnit = null;
        }

        this.runtimeStateFrame = -1;
        this.runtimeHealthFrame = -1;
    }

    getAliveCount() {
        if (this.released) {
            return 0;
        }

        let count = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            count++;
        }

        return count;
    }

    getCommandAliveCount() {
        if (this.released) return 0;

        let count = 0;

        for (let i = 0; i < this.units.length; i++) {
            if (this.isCommandUnit(this.units[i])) count++;
        }

        return count;
    }

    getAliveRatio() {
        if (this.totalCount <= 0) {
            return 0;
        }

        return this.getAliveCount() / this.totalCount;
    }

    refreshRuntimeHealth(frame: number) {
        if (this.runtimeHealthFrame === frame) {
            return;
        }

        this.runtimeHealthFrame = frame;

        if (
            this.released ||
            this.totalMaxHealth <= 0
        ) {
            this.runtimeHealthRatio = 0;
            return;
        }

        let currentHealth = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            currentHealth +=
                Math.max(
                    0,
                    Math.min(
                        u!.props!.health,
                        u!.props!.maxHealth
                    )
                );
        }

        this.runtimeHealthRatio =
            Math.max(
                0,
                Math.min(
                    1,
                    currentHealth / this.totalMaxHealth
                )
            );
    }

    getRuntimeHealthRatio(frame: number) {
        this.refreshRuntimeHealth(frame);

        return this.runtimeHealthRatio;
    }

    invalidateRuntimeHealth() {
        this.runtimeHealthFrame = -1;
    }

    invalidateRuntimeState() {
        this.runtimeStateFrame = -1;
        this.runtimeHealthFrame = -1;
    }

    getRandomAliveUnit(): Unit | null {
        return this.getRandomPreferredAliveUnit();
    }

    getRepresentativeUnit(): Unit | null {
        if (
            this.isUnitAlive(
                this.representativeUnit
            )
        ) {
            return this.representativeUnit;
        }

        this.representativeUnit =
            this.pickRepresentativeUnit();

        return this.representativeUnit;
    }

    setWaveBanner(
        node: Node | null,
        recycle: ((node: Node) => void) | null,
        onAttached: ((node: Node) => void) | null = null
    ) {
        this.releaseWaveBanner();

        if (!node) return;

        this.waveBannerNode = node;
        this.waveBannerRecycle = recycle;
        this.waveBannerOnAttached = onAttached;
        this.captureWaveBannerBaseScale(node);
        node.active = true;

        this.refreshWaveBanner(true);
    }

    refreshWaveBanner(force: boolean = false) {
        const banner =
            this.waveBannerNode;

        if (!banner) return false;

        const holder =
            this.getRepresentativeUnit();

        if (!holder) {
            if (this.getAliveCount() > 0) {
                return false;
            }

            this.releaseWaveBanner();
            return false;
        }

        if (
            !force &&
            banner.parent === holder.node
        ) {
            return true;
        }

        const hasParent =
            !!banner.parent;

        if (!hasParent) {
            banner.setParent(holder.node);
            this.resetWaveBannerLocalPosition(banner);
            banner.setScale(this.waveBannerBaseScale);
            this.notifyWaveBannerAttached(banner);
            return true;
        }

        this.transferWaveBanner(banner, holder);

        return true;
    }

    private transferWaveBanner(
        banner: Node,
        holder: Unit
    ) {
        banner.setParent(holder.node);
        this.resetWaveBannerLocalPosition(banner);
        banner.setScale(this.waveBannerBaseScale);
        this.notifyWaveBannerAttached(banner);
    }

    private resetWaveBannerLocalPosition(banner: Node) {
        const p =
            banner.position;

        if (
            Math.abs(p.x) <= 0.0001 &&
            Math.abs(p.y) <= 0.0001 &&
            Math.abs(p.z) <= 0.0001
        ) {
            return;
        }

        banner.setPosition(0, 0, 0);
    }

    private captureWaveBannerBaseScale(banner: Node) {
        const scale =
            banner.scale;

        if (
            Math.abs(scale.x) <= 0.0001 &&
            Math.abs(scale.y) <= 0.0001 &&
            Math.abs(scale.z) <= 0.0001
        ) {
            this.waveBannerBaseScale.set(1, 1, 1);
            return;
        }

        this.waveBannerBaseScale.set(
            scale.x,
            scale.y,
            scale.z
        );
    }

    setWaveBannerVisible(visible: boolean) {
        const banner =
            this.waveBannerNode;

        if (!banner || !banner.isValid) return;
        if (banner.active === visible) return;

        banner.active = visible;
    }

    getWaveBannerNode() {
        return this.waveBannerNode;
    }

    private notifyWaveBannerAttached(
        banner: Node
    ) {
        const onAttached =
            this.waveBannerOnAttached;

        if (onAttached) {
            onAttached(banner);
        }
    }

    handleUnitWillDespawn(unit: Unit | null) {
        if (!unit) return;
        if (!this.waveBannerNode) return;

        if (
            this.representativeUnit !== unit &&
            this.waveBannerNode.parent !== unit.node
        ) {
            return;
        }

        this.representativeUnit =
            this.pickRepresentativeUnit(unit);

        if (!this.representativeUnit) {
            this.releaseWaveBanner();
            return;
        }

        this.refreshWaveBanner(true);
    }

    releaseWaveBanner() {
        const banner =
            this.waveBannerNode;

        if (!banner) {
            this.waveBannerRecycle = null;
            this.waveBannerOnAttached = null;
            return;
        }

        if (!banner.isValid) {
            this.waveBannerNode = null;
            this.waveBannerRecycle = null;
            this.waveBannerOnAttached = null;
            return;
        }

        banner.setParent(null, true);
        banner.setScale(this.waveBannerBaseScale);

        const recycle =
            this.waveBannerRecycle;

        this.waveBannerNode = null;
        this.waveBannerRecycle = null;
        this.waveBannerOnAttached = null;

        if (recycle) {
            recycle(banner);
        } else if (banner.isValid) {
            banner.destroy();
        }
    }

    getRandomPreferredAliveUnit(): Unit | null {
        if (this.released) {
            return null;
        }

        let best: Unit | null = null;
        let bestPriority = -1;
        let bestCount = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;

            const priority =
                u.onForward
                    ? 2
                    : !u.onBusy
                        ? 1
                        : 0;

            if (priority > bestPriority) {
                bestPriority = priority;
                bestCount = 1;
                best = u;
                continue;
            }

            if (priority === bestPriority) {
                bestCount++;

                if (Math.random() * bestCount < 1) {
                    best = u;
                }
            }
        }

        return best;
    }

    hasEngaged() {
        if (this.released) {
            return false;
        }

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            if (u.onBusy) {
                return true;
            }
        }

        return false;
    }

    refreshRuntimeState(frame: number) {
        if (this.runtimeStateFrame === frame) {
            return;
        }

        this.runtimeStateFrame = frame;
        this.runtimeAliveCount = 0;
        this.runtimeHasEngaged = false;

        if (this.released) {
            return;
        }

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            this.runtimeAliveCount++;

            if (u.onBusy) {
                this.runtimeHasEngaged = true;
            }
        }
    }

    getRuntimeAliveCount(frame: number) {
        this.refreshRuntimeState(frame);

        return this.runtimeAliveCount;
    }

    isDeadRuntime(frame: number) {
        if (this.released) {
            return true;
        }

        return this.getRuntimeAliveCount(frame) <= 0;
    }

    hasEngagedRuntime(frame: number) {
        this.refreshRuntimeState(frame);

        return this.runtimeHasEngaged;
    }

    hasAggressiveForward() {
        return !this.released &&
            this.aggressiveForwardMode;
    }

    hasAggressiveForwardLaneLock() {
        return !this.released &&
            this.aggressiveForwardOriginLaneId >= 0 &&
            (this.aggressiveForwardMode ||
                this.freeHuntForwardOrigin === 'aggressive');
    }

    isInitialForwardCombatGateActive() {
        return !this.released &&
            this.initialForwardCombatGateActive &&
            this.forwardModeActive &&
            !this.freeHuntActive;
    }

    isCommandUnit(unit: Unit | null) {
        return this.isUnitAlive(unit) &&
            !unit!.isIsolatedRangedPursuit();
    }

    findSharedTargetForUnit(
        requester: Unit | null
    ) {
        if (this.released) return null;
        if (!this.isCommandUnit(requester)) return null;

        if (this.targetWaves.length <= 0) return null;

        if (!requester.agent) return null;

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        // Search range is an admission rule for adding a strategic wave.
        // Once admitted, Free Hunt must keep navigating toward that wave
        // until it is eliminated; applying the range again strands idle
        // members whenever the target temporarily moves farther away.
        for (let i = 0; i < this.targetWaves.length; i++) {
            const candidate = this.targetWaves[i].getClosestAliveUnitTo(
                requester.agent.pos.x,
                requester.agent.pos.z
            );

            if (!candidate?.agent) continue;

            const dx = candidate.agent.pos.x - requester.agent.pos.x;
            const dz = candidate.agent.pos.z - requester.agent.pos.z;
            const distSq = dx * dx + dz * dz;

            if (distSq < bestDistSq) {
                bestDistSq = distSq;
                best = candidate;
            }
        }

        return best;
    }

    getTargetWaveLaneIds() {
        return this.targetWaves.map((wave) => wave.laneId);
    }

    getTelemetryTargetState() {
        const targetWave = this.getTargetWave();
        const scanner = this.getScanner();

        return {
            targetWaveId: targetWave ? targetWave.id : -1,
            targetWaveIds: this.getTargetWaveIds(),
            targetWaveCount: this.getTargetWaveCount(),
            scannerUnitName: scanner ? scanner.unitTypeName : '',
            scannerLifeId: scanner ? scanner.lifeId : -1,
            scannerBusy: !!scanner?.onBusy,
            scannerForward: !!scanner?.onForward,
            scannerConfirmedNoTarget:
                this.targetWaves.length <= 0,
        };
    }

    getTargetAssignmentTelemetryState() {
        const targetWaves = this.getTargetWaves();
        let aliveUnitCount = 0;
        let busyUnitCount = 0;
        let busyUnitOnAssignedTargetCount = 0;
        let busyUnitOnOtherTargetCount = 0;
        let idleUnitOnAssignedTargetCount = 0;
        let idleUnitWithoutTargetCount = 0;

        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isCommandUnit(unit)) continue;

            aliveUnitCount++;

            const unitTargetWave = BattleWave.getWaveForUnit(
                unit.getValidEnemyTarget()
            );
            const isOnAssignedTarget =
                !!unitTargetWave && targetWaves.indexOf(unitTargetWave) >= 0;

            if (unit.onBusy) {
                busyUnitCount++;

                if (isOnAssignedTarget) {
                    busyUnitOnAssignedTargetCount++;
                } else {
                    busyUnitOnOtherTargetCount++;
                }

                continue;
            }

            if (isOnAssignedTarget) {
                idleUnitOnAssignedTargetCount++;
            } else if (!unit.hasValidEnemyTarget()) {
                idleUnitWithoutTargetCount++;
            }
        }

        return {
            aliveUnitCount,
            busyUnitCount,
            busyUnitOnAssignedTargetCount,
            busyUnitOnOtherTargetCount,
            idleUnitOnAssignedTargetCount,
            idleUnitWithoutTargetCount,
        };
    }

    setLaneId(laneId: number) {
        if (this.released) return;

        this.laneId = laneId;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (u.isReturningToWaveAfterIsolatedRangedPursuit()) {
                u.updateIsolatedRangedPursuitReturnLane(laneId);
                continue;
            }

            if (!this.isCommandUnit(u)) continue;

            u.laneId = laneId;
        }
    }

    public applyDefeatedTargetLaneForRegroup() {
        if (this.hasAggressiveForwardLaneLock()) {
            this.regroupLaneAfterTargetClear = -1;
            this.setLaneId(this.aggressiveForwardOriginLaneId);
            return true;
        }

        if (this.regroupLaneAfterTargetClear < 0) {
            return false;
        }

        const laneId = this.regroupLaneAfterTargetClear;
        this.regroupLaneAfterTargetClear = -1;
        this.setLaneId(laneId);

        return true;
    }

    releaseForwardToFreeHunt(
        searchRange: number = 0
    ) {
        if (this.released) return;

        if (
            this.freeHuntActive &&
            searchRange <= 0 &&
            !this.awaitingForwardRecoveryAfterTargetClear
        ) {
            return;
        }

        if (!this.freeHuntActive) {
            this.freeHuntForwardOrigin =
                this.aggressiveForwardMode
                    ? 'aggressive'
                    : 'normal';
        }

        this.forwardModeActive = false;
        this.freeHuntActive = true;
        this.awaitingForwardRecoveryAfterTargetClear = false;
        this.forwardRecoveryLanePrepared = false;
        this.clearForwardRecoveryReadyUnits();
        this.targetClearSameLaneSearchResolved = false;
        this.aggressiveForwardMode = false;
        this.aggressiveAdjacentBoundaryObserved = false;
        this.aggressiveOwnLaneBlockObserved = false;
        this.initialForwardCombatGateActive = false;
        this.scannerUnit = null;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;

            u.enterWaveFreeHuntMode(
                searchRange
            );
        }

        this.primeTargetWaveHuntTargets();
    }

    enterCombatMode() {
        if (this.released) return;

        if (this.freeHuntActive) return;

        this.freeHuntForwardOrigin =
            this.aggressiveForwardMode
                ? 'aggressive'
                : 'normal';

        this.forwardModeActive = false;
        this.freeHuntActive = true;
        this.aggressiveForwardMode = false;
        this.aggressiveAdjacentBoundaryObserved = false;
        this.aggressiveOwnLaneBlockObserved = false;
        this.initialForwardCombatGateActive = false;
        this.scannerUnit = null;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;

            u.enterWaveCombatMode();
        }

        this.primeTargetWaveHuntTargets();
    }

    forceForwardMode() {
        if (this.released) return false;

        let aliveCount = 0;

        this.forwardModeActive = true;
        this.freeHuntActive = false;
        this.awaitingForwardRecoveryAfterTargetClear = false;
        this.forwardRecoveryLanePrepared = false;
        this.clearForwardRecoveryReadyUnits();
        this.targetClearSameLaneSearchResolved = false;
        this.initialForwardCombatGateActive = true;
        this.scannerUnit = null;
        this.clearTargetWave();

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;

            aliveCount++;

            u.enterWaveForwardMode(
                this.aggressiveForwardMode
            );
        }

        return aliveCount > 0;
    }

    getTargetSearchIntervalFrames() {
        return this.targetSearchIntervalFrames;
    }

    isForwardMode() {
        return !this.released &&
            this.forwardModeActive;
    }

    isFreeHuntMode() {
        return !this.released &&
            this.freeHuntActive;
    }

    isAggressiveForwardMode() {
        return !this.released &&
            this.aggressiveForwardMode;
    }

    getFreeHuntForwardOrigin() {
        return this.freeHuntForwardOrigin;
    }

    observeAggressiveAdjacentBoundary() {
        if (!this.isAggressiveForwardMode()) return false;
        if (this.aggressiveAdjacentBoundaryObserved) return false;

        this.aggressiveAdjacentBoundaryObserved = true;
        return true;
    }

    observeAggressiveOwnLaneBlock() {
        if (!this.isAggressiveForwardMode()) return false;
        if (this.aggressiveOwnLaneBlockObserved) return false;

        this.aggressiveOwnLaneBlockObserved = true;
        return true;
    }

    /**
     * The single wave scanner. Forward and Free Hunt share the same cache;
     * their mode only changes which units are eligible to lead the search.
     */
    getScanner(refresh: boolean = false): Unit | null {
        if (this.released) return null;

        const requiresForwardUnit = this.isForwardMode();
        if (!requiresForwardUnit && !this.freeHuntActive) {
            return null;
        }

        if (
            !refresh &&
            this.isScannerEligible(
                this.scannerUnit,
                requiresForwardUnit
            )
        ) {
            return this.scannerUnit;
        }

        this.scannerUnit = this.findFrontmostAliveUnit(
            requiresForwardUnit
        );

        return this.scannerUnit;
    }

    isCurrentScanner(
        unit: Unit | null,
        refresh: boolean = false
    ) {
        if (!unit || this.released) return false;

        const scanner = this.getScanner(refresh);

        return scanner === unit;
    }

    getTargetWave() {
        return this.targetWave;
    }

    getTargetWaves() {
        return this.targetWaves.slice();
    }

    getTargetWaveIds() {
        return this.targetWaves.map((wave) => wave.id);
    }

    getTargetWaveCount() {
        return this.targetWaves.length;
    }

    hasEngagedTargetWave(targetWave: BattleWave | null) {
        if (!targetWave) return false;
        return this.targetWaves.indexOf(targetWave) >= 0;
    }

    referencesTargetWave(targetWave: BattleWave | null) {
        return !!targetWave &&
            this.targetWaves.indexOf(targetWave) >= 0;
    }

    markTargetLifecyclePending(
        frame: number,
        targetWave: BattleWave | null,
        reason: string
    ) {
        if (this.released) return false;
        if (!this.referencesTargetWave(targetWave)) return false;

        if (!this.targetLifecyclePending) {
            this.targetLifecyclePending = true;
            this.targetLifecyclePendingFrame = frame;
            this.targetLifecyclePendingTargetWaveId =
                targetWave ? targetWave.id : -1;
            this.targetLifecyclePendingEventCount = 1;
            this.targetLifecyclePendingReason = reason;
            return true;
        }

        this.targetLifecyclePendingEventCount++;
        return false;
    }

    processPendingTargetLifecycle() {
        if (!this.targetLifecyclePending) return null;

        const pendingFrame = this.targetLifecyclePendingFrame;
        const pendingTargetWaveId =
            this.targetLifecyclePendingTargetWaveId;
        const targetWaveCountBefore = this.targetWaves.length;
        const pendingEventCount =
            this.targetLifecyclePendingEventCount;
        const pendingReason = this.targetLifecyclePendingReason;

        this.targetLifecyclePending = false;
        this.targetLifecyclePendingFrame = -1;
        this.targetLifecyclePendingTargetWaveId = -1;
        this.targetLifecyclePendingEventCount = 0;
        this.targetLifecyclePendingReason = '';
        this.refreshTargetWaves();

        return {
            pendingFrame,
            pendingTargetWaveId,
            pendingEventCount,
            pendingReason,
            targetWaveCountBefore,
            targetWaveCountAfter: this.targetWaves.length,
        };
    }

    consumeClearedTargetTelemetry() {
        return this.clearedTargetTelemetry.shift() ?? null;
    }

    consumeTargetClearOutcomeTelemetry() {
        const outcome = this.targetClearOutcomeTelemetry;
        this.targetClearOutcomeTelemetry = null;

        return outcome;
    }

    isAwaitingForwardRecoveryAfterTargetClear() {
        return !this.released &&
            this.awaitingForwardRecoveryAfterTargetClear;
    }

    getLastForwardRecoveryResumedUnitCount() {
        return this.lastForwardRecoveryResumedUnitCount;
    }

    getLastForwardRecoveryRetainedBusyUnitCount() {
        return this.lastForwardRecoveryRetainedBusyUnitCount;
    }

    getLastForwardRecoveryRetainedBusyUnitLifeIds() {
        return this.lastForwardRecoveryRetainedBusyUnitLifeIds.slice();
    }

    getLastRegroupMeleeCancelledUnitLifeIds() {
        return this.lastRegroupMeleeCancelledUnitLifeIds.slice();
    }

    tryReengageFromRecoveryMeleeAttack(
        unit: Unit | null,
        attacker: Unit | null
    ) {
        if (!unit || !attacker || this.released) return false;
        if (!this.awaitingForwardRecoveryAfterTargetClear) return false;
        if (!this.isCommandUnit(unit)) return false;
        if (attacker.isRangedCombatUnit()) return false;

        const attackerWave = BattleWave.getWaveForUnit(attacker);

        if (!attackerWave || attackerWave === this) return false;
        if (attackerWave.team === this.team) return false;
        if (attackerWave.released || attackerWave.getCommandAliveCount() <= 0) {
            return false;
        }

        this.targetWaves.push(attackerWave);
        this.targetWave = attackerWave;
        this.immediateTargetSearchPending = false;
        this.awaitingForwardRecoveryAfterTargetClear = false;
        this.forwardRecoveryLanePrepared = false;
        this.clearForwardRecoveryReadyUnits();
        this.targetClearSameLaneSearchResolved = false;
        this.targetClearOutcomeTelemetry = {
            reason: 'regroup-melee-reengagement',
            scanner: this.getScanner(),
            target: attacker,
        };
        this.lastRegroupMeleeCancelledUnitLifeIds = [];

        for (let i = 0; i < this.units.length; i++) {
            const member = this.units[i];

            if (!this.isCommandUnit(member)) continue;
            if (member.cancelBackToLanePhase()) {
                this.lastRegroupMeleeCancelledUnitLifeIds.push(
                    member.lifeId
                );
            }
        }

        this.clearIdleHuntTargets();
        this.primeTargetWaveHuntTargets();
        return true;
    }

    consumeForwardRecoveryBlockTelemetry() {
        if (!this.forwardRecoveryBlockTelemetryPending) {
            return null;
        }

        if (!this.isAwaitingForwardRecoveryAfterTargetClear()) {
            this.forwardRecoveryBlockTelemetryPending = false;
            return null;
        }

        if (this.immediateTargetSearchPending) {
            this.forwardRecoveryBlockTelemetryPending = false;
            return {
                reason: 'target-clear-search-pending',
                unit: null,
            };
        }

        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isCommandUnit(unit)) continue;

            if (unit.onBusy) {
                this.forwardRecoveryBlockTelemetryPending = false;
                return {
                    reason: 'unit-busy',
                    unit,
                };
            }

            if (unit.hasValidEnemyTarget()) {
                this.forwardRecoveryBlockTelemetryPending = false;
                return {
                    reason: 'unit-has-valid-target',
                    unit,
                };
            }
        }

        if (!this.targetClearSameLaneSearchResolved) {
            this.forwardRecoveryBlockTelemetryPending = false;
            return {
                reason: 'target-clear-search-unresolved',
                unit: this.getScanner(),
            };
        }

        return null;
    }

    consumeForwardRecoveryDeferredTelemetry() {
        if (!this.forwardRecoveryDeferredTelemetryPending) {
            return null;
        }

        this.forwardRecoveryDeferredTelemetryPending = false;

        if (!this.isAwaitingForwardRecoveryAfterTargetClear()) {
            return null;
        }

        let aliveCount = 0;
        let resumableUnitCount = 0;
        let busyUnitCount = 0;

        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isCommandUnit(unit)) continue;

            aliveCount++;

            if (unit.onBusy || unit.hasValidEnemyTarget()) {
                busyUnitCount++;
            } else {
                resumableUnitCount++;
            }
        }

        return {
            freeHuntActive: this.freeHuntActive,
            targetWaveId: this.targetWave?.id ?? -1,
            immediateTargetSearchPending:
                this.immediateTargetSearchPending,
            targetClearSameLaneSearchResolved:
                this.targetClearSameLaneSearchResolved,
            aliveCount,
            resumableUnitCount,
            busyUnitCount,
            forwardRecoveryReadyUnitCount:
                this.getForwardRecoveryReadyUnitCount(),
            forwardRecoveryRegroupingUnitCount:
                this.getForwardRecoveryRegroupingUnitCount(),
        };
    }

    trySetTargetWaveFromScanner(
        scanner: Unit | null,
        target: Unit | null,
        allowRecoveryContinuation: boolean = false
    ) {
        if (!scanner || !target || this.released) return false;
        if (!this.isCurrentScanner(scanner)) return false;

        const nextTargetWave =
            BattleWave.getWaveForUnit(target);

        if (!nextTargetWave) return false;
        if (nextTargetWave === this) return false;
        if (nextTargetWave.team === this.team) return false;
        if (
            nextTargetWave.released ||
            nextTargetWave.getCommandAliveCount() <= 0
        ) {
            return false;
        }

        if (this.hasEngagedTargetWave(nextTargetWave)) {
            return true;
        }

        // Once a target set is exhausted, regroup is mandatory. The sole
        // exception is the scanner-pass check at the exact recovery-to-order
        // boundary, before any member has been put into Forward.
        if (
            this.awaitingForwardRecoveryAfterTargetClear &&
            !allowRecoveryContinuation
        ) {
            return false;
        }

        this.targetWaves.push(nextTargetWave);
        this.targetWave = this.targetWaves[0] ?? null;
        this.immediateTargetSearchPending = false;
        this.awaitingForwardRecoveryAfterTargetClear = false;
        this.forwardRecoveryLanePrepared = false;
        this.targetClearSameLaneSearchResolved = false;

        if (this.freeHuntActive) {
            this.clearIdleHuntTargets();
            this.primeTargetWaveHuntTargets();
        }

        return true;
    }

    trySetTargetWaveFromEngagement(
        unit: Unit | null,
        target: Unit | null
    ) {
        if (!unit || !target || this.released) return false;
        if (!this.isCommandUnit(unit)) return false;
        if (target.isIsolatedRangedPursuit()) return false;

        // The collision callback is raised by whichever unit updates first.
        // Its counterpart may not have run yet, so accept the passive side
        // when the other unit has already entered this same engagement.
        if (!unit.onBusy && !target.onBusy) return false;

        const nextTargetWave =
            BattleWave.getWaveForUnit(target);

        if (!nextTargetWave) return false;
        if (nextTargetWave === this) return false;
        if (nextTargetWave.team === this.team) return false;
        if (
            nextTargetWave.released ||
            nextTargetWave.getCommandAliveCount() <= 0
        ) {
            return false;
        }

        if (this.awaitingForwardRecoveryAfterTargetClear) {
            return false;
        }

        if (this.hasEngagedTargetWave(nextTargetWave)) {
            return true;
        }

        // Real combat expands the strategic set. Busy units retain their local
        // target; only idle members borrow from the expanded target pool.
        this.targetWaves.push(nextTargetWave);
        this.targetWave = this.targetWaves[0] ?? null;
        this.immediateTargetSearchPending = false;
        this.awaitingForwardRecoveryAfterTargetClear = false;
        this.forwardRecoveryLanePrepared = false;
        this.targetClearSameLaneSearchResolved = false;

        if (this.freeHuntActive) {
            this.clearIdleHuntTargets();
            this.primeTargetWaveHuntTargets();
        }

        return true;
    }

    getProgressScanner(): Unit | null {
        return this.findFrontmostAliveUnit(false);
    }

    private findFrontmostAliveUnit(
        requireForward: boolean
    ): Unit | null {
        let best: Unit | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;
            if (requireForward && !u.onForward) continue;

            const score =
                u.agent!.pos.x * u.forwardDir.x +
                u.agent!.pos.z * u.forwardDir.z;

            if (score > bestScore) {
                bestScore = score;
                best = u;
            }
        }

        return best;
    }

    tryResumeForward(
        beforeResume: ((wave: BattleWave) => void) | null = null,
        beforeForward: ((wave: BattleWave) => boolean) | null = null
    ) {
        if (this.released) return false;
        if (!this.freeHuntActive) return false;
        if (!this.awaitingForwardRecoveryAfterTargetClear) return false;

        this.getTargetWave();

        if (this.getTargetWaveCount() > 0) return false;
        if (this.immediateTargetSearchPending) return false;

        let aliveCount = 0;
        let resumableUnitCount = 0;
        let retainedBusyUnitCount = 0;
        const retainedBusyUnitLifeIds: number[] = [];

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;

            aliveCount++;

            if (u.onBusy || u.hasValidEnemyTarget()) {
                retainedBusyUnitCount++;
                retainedBusyUnitLifeIds.push(u.lifeId);
                continue;
            }

            resumableUnitCount++;
        }

        if (aliveCount <= 0) {
            this.forwardModeActive = true;
            this.freeHuntActive = false;
            this.awaitingForwardRecoveryAfterTargetClear = false;
            this.forwardRecoveryLanePrepared = false;
            this.initialForwardCombatGateActive = true;
            this.aggressiveForwardMode =
                this.freeHuntForwardOrigin === 'aggressive';
            return true;
        }

        // Recovery is synchronized: idle command members return to the lane,
        // then wait there until no command member remains in local combat or
        // outside the regroup lane. A melee attack can still cancel this
        // state through tryReengageFromRecoveryMeleeAttack().
        if (resumableUnitCount <= 0) return false;

        if (!this.targetClearSameLaneSearchResolved) {
            return false;
        }

        if (!this.forwardRecoveryLanePrepared) {
            if (beforeResume) beforeResume(this);
            this.forwardRecoveryLanePrepared = true;
        }

        const forwardAggressive =
            this.freeHuntForwardOrigin === 'aggressive';
        let regroupingUnitCount = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;
            if (u.onBusy || u.hasValidEnemyTarget()) continue;

            if (u.isBackToLaneActive()) {
                regroupingUnitCount++;
                continue;
            }

            if (u.hasCompletedBackToLaneRecovery()) {
                this.forwardRecoveryReadyUnitLifeIds.add(u.lifeId);
                continue;
            }

            if (u.beginBackToLanePhase(forwardAggressive)) {
                regroupingUnitCount++;
            } else {
                // This member was already inside the regroup lane when the
                // recovery interval ran, so it waits for the full wave.
                this.forwardRecoveryReadyUnitLifeIds.add(u.lifeId);
            }
        }

        if (
            retainedBusyUnitCount > 0 ||
            regroupingUnitCount > 0
        ) {
            return false;
        }

        // Recovery can continue directly into Free Hunt when the scanner has
        // already passed an eligible enemy scanner. This runs before any
        // command member receives a Forward order.
        if (beforeForward?.(this)) {
            return true;
        }

        this.forwardModeActive = true;
        this.freeHuntActive = false;
        this.awaitingForwardRecoveryAfterTargetClear = false;
        this.forwardRecoveryLanePrepared = false;
        this.clearForwardRecoveryReadyUnits();
        this.targetClearSameLaneSearchResolved = false;
        this.forwardRecoveryDeferredTelemetryPending = false;
        // Every newly resumed Forward phase must earn a strategic escalation
        // again. Otherwise the half-wave gate only protects the spawn phase.
        this.initialForwardCombatGateActive = true;
        this.scannerUnit = null;
        this.aggressiveForwardMode = forwardAggressive;
        this.lastForwardRecoveryResumedUnitCount = resumableUnitCount;
        this.lastForwardRecoveryRetainedBusyUnitCount =
            retainedBusyUnitCount;
        this.lastForwardRecoveryRetainedBusyUnitLifeIds =
            retainedBusyUnitLifeIds;
        if (!this.targetClearOutcomeTelemetry) {
            this.targetClearOutcomeTelemetry = {
                reason: 'forward-resumed-after-target-set-empty',
                scanner: this.getScanner(),
                target: null,
            };
        }

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;
            if (u.onBusy || u.hasValidEnemyTarget()) continue;

            u.enterWaveForwardMode(
                this.aggressiveForwardMode
            );
        }

        return true;
    }

    hasBackToLaneUnits() {
        if (this.released) return false;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;
            if (u.isBackToLaneActive()) return true;
        }

        return false;
    }

    refreshInitialForwardCombatGate() {
        if (!this.isInitialForwardCombatGateActive()) {
            return;
        }

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;
            if (u.onBusy) continue;
            if (u.onForward) continue;
            if (u.hasValidEnemyTarget()) continue;
            if (u.isSoloAggressiveSkirmishActive()) continue;

            u.enterWaveForwardMode(
                this.aggressiveForwardMode
            );
        }
    }

    isDead() {
        if (this.released) {
            return true;
        }

        return this.getAliveCount() <= 0;
    }

    releaseReferences() {
        this.releaseWaveBanner();

        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!unit) continue;
            if (BattleWave.unitWaveMap.get(unit) !== this.id) continue;

            unit.setWaveRuntimeId(-1);
        }

        this.released = true;
        this.runtimeStateFrame = -1;
        this.runtimeAliveCount = 0;
        this.runtimeHasEngaged = false;
        this.runtimeHealthFrame = -1;
        this.runtimeHealthRatio = 0;
        this.totalMaxHealth = 0;
        this.targetSearchIntervalFrames = 1;
        this.forwardModeActive = false;
        this.freeHuntActive = false;
        this.aggressiveForwardMode = false;
        this.aggressiveForwardOriginLaneId = -1;
        this.targetClearSameLaneSearchResolved = false;
        this.aggressiveAdjacentBoundaryObserved = false;
        this.aggressiveOwnLaneBlockObserved = false;
        this.initialForwardCombatGateActive = false;
        this.scannerUnit = null;
        this.clearTargetWave();
        this.representativeUnit = null;
        this.units.length = 0;
    }

    getClosestDistanceSqTo(x: number, z: number) {
        if (this.released) return Infinity;

        let best = Infinity;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isCommandUnit(u)) continue;
            if (!u.agent) continue;

            const dx = u.agent.pos.x - x;
            const dz = u.agent.pos.z - z;

            const d = dx * dx + dz * dz;

            if (d < best) {
                best = d;
            }
        }

        return best;
    }

    private primeTargetWaveHuntTargets() {
        if (this.targetWaves.length <= 0) return;

        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isCommandUnit(unit)) continue;
            if (unit.onBusy) continue;
            if (!unit.agent) continue;

            const target = this.findSharedTargetForUnit(unit);

            if (!target) continue;

            unit.primeWaveHuntTarget(target);
        }
    }

    private getClosestAliveUnitTo(
        x: number,
        z: number
    ): Unit | null {
        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isCommandUnit(unit)) continue;

            const dx = unit.agent!.pos.x - x;
            const dz = unit.agent!.pos.z - z;
            const distSq = dx * dx + dz * dz;

            if (distSq < bestDistSq) {
                bestDistSq = distSq;
                best = unit;
            }
        }

        return best;
    }

    private refreshTargetWaves() {
        if (this.targetWaves.length <= 0) {
            this.targetWave = null;
            return;
        }

        const survivors: BattleWave[] = [];
        let lastRemovedLane = -1;
        const firstNewTelemetryIndex =
            this.clearedTargetTelemetry.length;

        for (let i = 0; i < this.targetWaves.length; i++) {
            const targetWave = this.targetWaves[i];

            if (
                targetWave &&
                !targetWave.released &&
                targetWave.getCommandAliveCount() > 0
            ) {
                survivors.push(targetWave);
                continue;
            }

            if (targetWave) {
                lastRemovedLane = targetWave.laneId;
                this.clearedTargetTelemetry.push({
                    id: targetWave.id,
                    team: targetWave.team,
                    laneId: targetWave.laneId,
                    family: targetWave.family,
                    remainingTargetWaveCount: 0,
                    physicallyDead: targetWave.isDead(),
                });
            }
        }

        if (survivors.length === this.targetWaves.length) {
            this.targetWave = survivors[0] ?? null;
            return;
        }

        this.targetWaves = survivors;
        this.targetWave = survivors[0] ?? null;

        for (
            let i = firstNewTelemetryIndex;
            i < this.clearedTargetTelemetry.length;
            i++
        ) {
            this.clearedTargetTelemetry[i].remainingTargetWaveCount =
                survivors.length;
        }

        if (survivors.length > 0) {
            if (this.freeHuntActive) {
                this.clearIdleHuntTargets();
                this.primeTargetWaveHuntTargets();
            }
            return;
        }

        this.immediateTargetSearchPending = false;
        this.awaitingForwardRecoveryAfterTargetClear = true;
        this.forwardRecoveryLanePrepared = false;
        this.clearForwardRecoveryReadyUnits();
        this.targetClearSameLaneSearchResolved = true;
        this.forwardRecoveryBlockTelemetryPending = false;
        this.forwardRecoveryDeferredTelemetryPending = true;
        this.regroupLaneAfterTargetClear = this.hasAggressiveForwardLaneLock()
            ? this.aggressiveForwardOriginLaneId
            : lastRemovedLane;
        // Choose the recovery lane before any command member starts moving.
        // Delaying this until the wave-level Forward handoff lets early
        // members regroup toward the stale pre-combat lane.
        this.applyDefeatedTargetLaneForRegroup();
        this.targetClearOutcomeTelemetry = {
            reason: 'target-set-empty-regroup',
            scanner: this.getScanner(),
            target: null,
        };
        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isCommandUnit(unit)) continue;
            unit.resetBackToLaneRecoveryCompletion();
        }
        this.clearAllFreeHuntContinuity();
        this.clearIdleHuntTargets();
    }

    private isUnitAlive(unit: Unit | null) {
        if (this.released) return false;
        if (!unit) return false;

        const currentWaveId = BattleWave.unitWaveMap.get(unit);

        if (currentWaveId !== this.id) {
            return false;
        }

        if (!unit.node.activeInHierarchy) return false;
        if (!unit.agent) return false;
        if (!unit.props) return false;
        if (unit.props.isDead()) return false;

        return true;
    }

    private isScannerEligible(
        unit: Unit | null,
        requiresForwardUnit: boolean
    ) {
        if (!this.isCommandUnit(unit)) return false;

        return !requiresForwardUnit || !!unit!.onForward;
    }

    private clearTargetWave(
        requestImmediateSearch: boolean = false
    ) {
        this.targetWaves.length = 0;
        this.targetWave = null;
        this.targetLifecyclePending = false;
        this.targetLifecyclePendingFrame = -1;
        this.targetLifecyclePendingTargetWaveId = -1;
        this.targetLifecyclePendingEventCount = 0;
        this.targetLifecyclePendingReason = '';
        this.targetClearSameLaneSearchResolved = false;
        this.immediateTargetSearchPending = false;
    }

    private clearForwardRecoveryReadyUnits() {
        this.forwardRecoveryReadyUnitLifeIds.clear();
    }

    getForwardRecoveryReadyUnitCount() {
        let count = 0;

        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isCommandUnit(unit)) continue;
            if (unit.onBusy || unit.hasValidEnemyTarget()) continue;
            if (this.forwardRecoveryReadyUnitLifeIds.has(unit.lifeId)) {
                count++;
            }
        }

        return count;
    }

    getForwardRecoveryRegroupingUnitCount() {
        let count = 0;

        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isCommandUnit(unit)) continue;
            if (unit.onBusy || unit.hasValidEnemyTarget()) continue;
            if (unit.isBackToLaneActive()) count++;
        }

        return count;
    }

    private clearIdleHuntTargets() {
        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isCommandUnit(unit)) continue;
            if (unit.onBusy) continue;

            unit.clearEnemy();
        }
    }

    private clearAllFreeHuntContinuity() {
        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isCommandUnit(unit)) continue;

            unit.clearWaveHuntContinuity();
        }
    }

    private pickRepresentativeUnit(
        excludedUnit: Unit | null = null
    ) {
        if (this.released) return null;

        let aliveCount = 0;
        let sumX = 0;
        let sumZ = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (u === excludedUnit) continue;
            if (!this.isCommandUnit(u)) continue;

            aliveCount++;
            sumX += u.agent!.pos.x;
            sumZ += u.agent!.pos.z;
        }

        if (aliveCount <= 0) return null;

        const averageX = sumX / aliveCount;
        const averageZ = sumZ / aliveCount;
        let best: Unit | null = null;
        let bestDistance = Infinity;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (u === excludedUnit) continue;
            if (!this.isCommandUnit(u)) continue;

            const distance =
                (
                    u.agent!.pos.x - averageX
                ) * (
                    u.agent!.pos.x - averageX
                ) +
                (
                    u.agent!.pos.z - averageZ
                ) * (
                    u.agent!.pos.z - averageZ
                );

            if (distance < bestDistance) {
                bestDistance = distance;
                best = u;
            }
        }

        return best;
    }

    static getWaveForUnit(unit: Unit | null): BattleWave | null {
        if (!unit) return null;

        return BattleWave.unitWaveObjectMap.get(unit) || null;
    }
}
