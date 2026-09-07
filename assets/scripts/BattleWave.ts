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
    private initialForwardCombatReleaseThreshold = 1;
    // One dynamic scanner per wave. In Forward it must still be marching;
    // in Free Hunt the frontmost alive unit takes the same captain role.
    private scannerUnit: Unit | null = null;
    private targetWave: BattleWave | null = null;
    private regroupLaneAfterTargetClear = -1;
    private awaitingForwardRecoveryAfterTargetClear = false;
    // This is a wave-level result from the one scanner-only, same-lane scan
    // after its strategic target wave dies. It must not be invalidated by an
    // unrelated local combat on that scanner.
    private targetClearSameLaneSearchResolved = false;
    private forwardRecoveryBlockTelemetryPending = false;
    private clearedTargetTelemetry: {
        id: number;
        team: number;
        laneId: number;
        family: UnitFamily;
    } | null = null;
    private immediateTargetSearchPending = false;
    private lastForwardRecoveryResumedUnitCount = 0;
    private lastForwardRecoveryRetainedBusyUnitCount = 0;
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

    setInitialForwardCombatReleaseThreshold(
        threshold: number
    ) {
        this.initialForwardCombatReleaseThreshold =
            Math.max(
                1,
                Math.floor(threshold)
            );
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

            if (!this.isUnitAlive(u)) continue;

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

    getInitialForwardCombatReleaseThreshold() {
        return this.initialForwardCombatReleaseThreshold;
    }

    getEngagedCountIncluding(
        pendingUnit: Unit | null = null
    ) {
        if (this.released) return 0;

        let count = 0;
        let hasPending = false;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            if (u === pendingUnit) {
                hasPending = true;
            }

            if (u.onBusy) {
                count++;
            }
        }

        if (
            pendingUnit &&
            hasPending &&
            !pendingUnit.onBusy
        ) {
            count++;
        }

        return count;
    }

    findSharedTargetForUnit(
        requester: Unit | null
    ) {
        if (this.released) return null;
        if (!this.isUnitAlive(requester)) return null;

        const targetWave = this.getTargetWave();

        if (!targetWave) return null;

        if (!requester.agent) return null;

        // A free unit may only borrow a nearby member of its assigned enemy
        // wave. Never fall back to that wave's representative: it can be far
        // away and pull the whole wave across multiple lanes.
        return targetWave.getClosestAliveUnitTo(
            requester.agent.pos.x,
            requester.agent.pos.z,
            requester.targetSearchRange
        );
    }

    getTelemetryTargetState() {
        const targetWave = this.getTargetWave();
        const scanner = this.getScanner();

        return {
            targetWaveId: targetWave ? targetWave.id : -1,
            scannerUnitName: scanner ? scanner.unitTypeName : '',
            scannerLifeId: scanner ? scanner.lifeId : -1,
            scannerBusy: !!scanner?.onBusy,
            scannerForward: !!scanner?.onForward,
            scannerConfirmedNoTarget:
                !!scanner?.hasConfirmedNoTargetSearch(),
        };
    }

    setLaneId(laneId: number) {
        if (this.released) return;

        this.laneId = laneId;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

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
            searchRange <= 0
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
        this.targetClearSameLaneSearchResolved = false;
        this.aggressiveForwardMode = false;
        this.aggressiveAdjacentBoundaryObserved = false;
        this.aggressiveOwnLaneBlockObserved = false;
        this.initialForwardCombatGateActive = false;
        this.scannerUnit = null;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

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

            if (!this.isUnitAlive(u)) continue;

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
        this.targetClearSameLaneSearchResolved = false;
        this.scannerUnit = null;
        this.clearTargetWave();

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

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

    hasHuntScannerConfirmedNoTarget() {
        const scanner = this.getScanner();

        return !!scanner?.hasConfirmedNoTargetSearch();
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
        if (
            this.targetWave &&
            (this.targetWave.released || this.targetWave.isDead())
        ) {
            const defeatedTargetLane = this.targetWave.laneId;

            this.clearedTargetTelemetry = {
                id: this.targetWave.id,
                team: this.targetWave.team,
                laneId: defeatedTargetLane,
                family: this.targetWave.family,
            };

            if (defeatedTargetLane >= 0) {
                this.regroupLaneAfterTargetClear = defeatedTargetLane;
            }

            this.awaitingForwardRecoveryAfterTargetClear = true;
            this.targetClearSameLaneSearchResolved = false;
            this.forwardRecoveryBlockTelemetryPending = true;

            // The current strategic order has genuinely ended. Let the one
            // scanner search once on the next safe GameManager pass instead
            // of waiting for its normal interval.
            this.clearTargetWave(true);
            this.clearAllFreeHuntContinuity();
            this.clearIdleHuntTargets();
        }

        return this.targetWave;
    }

    consumeClearedTargetTelemetry() {
        const clearedTarget = this.clearedTargetTelemetry;
        this.clearedTargetTelemetry = null;

        return clearedTarget;
    }

    hasImmediateTargetSearchPending() {
        this.getTargetWave();

        return this.immediateTargetSearchPending;
    }

    isAwaitingForwardRecoveryAfterTargetClear() {
        return !this.released &&
            this.awaitingForwardRecoveryAfterTargetClear;
    }

    resolveImmediateTargetClearSearch(targetFound: boolean) {
        if (!this.isAwaitingForwardRecoveryAfterTargetClear()) {
            return;
        }

        // A found target clears the waiting state through
        // trySetTargetWaveFromScanner(). Only the no-target result needs to
        // survive on the wave for forward recovery.
        this.targetClearSameLaneSearchResolved = !targetFound;
    }

    getLastForwardRecoveryResumedUnitCount() {
        return this.lastForwardRecoveryResumedUnitCount;
    }

    getLastForwardRecoveryRetainedBusyUnitCount() {
        return this.lastForwardRecoveryRetainedBusyUnitCount;
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

            if (!this.isUnitAlive(unit)) continue;

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

    consumeImmediateTargetSearch() {
        this.getTargetWave();

        if (!this.immediateTargetSearchPending) return false;

        // A new strategic order won before the forced scan ran, or the wave
        // has left Free Hunt. Never let an old request overwrite that state.
        if (
            this.released ||
            !this.freeHuntActive ||
            this.targetWave
        ) {
            this.immediateTargetSearchPending = false;
            return false;
        }

        this.immediateTargetSearchPending = false;
        return true;
    }

    trySetTargetWaveFromScanner(
        scanner: Unit | null,
        target: Unit | null
    ) {
        if (!scanner || !target || this.released) return false;
        if (!this.isCurrentScanner(scanner)) return false;

        const nextTargetWave =
            BattleWave.getWaveForUnit(target);

        if (!nextTargetWave) return false;
        if (nextTargetWave === this) return false;
        if (nextTargetWave.team === this.team) return false;
        if (nextTargetWave.released || nextTargetWave.isDead()) {
            return false;
        }

        if (this.targetWave === nextTargetWave) {
            return true;
        }

        if (
            this.awaitingForwardRecoveryAfterTargetClear &&
            nextTargetWave.laneId !== this.laneId
        ) {
            return false;
        }

        // Scanner search establishes the initial order only. A live order is
        // replaced exclusively by a real local engagement.
        if (this.getTargetWave()) return false;

        this.targetWave = nextTargetWave;
        this.immediateTargetSearchPending = false;
        this.awaitingForwardRecoveryAfterTargetClear = false;
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
        if (!this.isUnitAlive(unit)) return false;

        // The collision callback is raised by whichever unit updates first.
        // Its counterpart may not have run yet, so accept the passive side
        // when the other unit has already entered this same engagement.
        if (!unit.onBusy && !target.onBusy) return false;

        const nextTargetWave =
            BattleWave.getWaveForUnit(target);

        if (!nextTargetWave) return false;
        if (nextTargetWave === this) return false;
        if (nextTargetWave.team === this.team) return false;
        if (nextTargetWave.released || nextTargetWave.isDead()) {
            return false;
        }

        if (
            this.awaitingForwardRecoveryAfterTargetClear &&
            nextTargetWave.laneId !== this.laneId
        ) {
            return false;
        }

        // A real engagement is a passive order change: busy units keep their
        // local combat, while free allies begin hunting this enemy wave.
        this.targetWave = nextTargetWave;
        this.immediateTargetSearchPending = false;
        this.awaitingForwardRecoveryAfterTargetClear = false;
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

            if (!this.isUnitAlive(u)) continue;
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
        beforeResume: ((wave: BattleWave) => void) | null = null
    ) {
        if (this.released) return false;
        if (!this.freeHuntActive) return false;

        this.getTargetWave();

        if (this.targetWave) return false;
        if (this.immediateTargetSearchPending) return false;

        let aliveCount = 0;
        let resumableUnitCount = 0;
        let retainedBusyUnitCount = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            aliveCount++;

            if (u.onBusy || u.hasValidEnemyTarget()) {
                retainedBusyUnitCount++;
                continue;
            }

            resumableUnitCount++;
        }

        if (aliveCount <= 0) return false;

        // A local fight belongs only to the units in it. The rest of the wave
        // must be allowed to regroup and advance after the scanner has found
        // no same-lane strategic target.
        if (resumableUnitCount <= 0) return false;

        if (!this.targetClearSameLaneSearchResolved) {
            return false;
        }

        if (beforeResume) {
            beforeResume(this);
        }

        this.forwardModeActive = true;
        this.freeHuntActive = false;
        this.awaitingForwardRecoveryAfterTargetClear = false;
        this.targetClearSameLaneSearchResolved = false;
        this.initialForwardCombatGateActive = false;
        this.scannerUnit = null;
        this.aggressiveForwardMode =
            this.freeHuntForwardOrigin === 'aggressive';
        this.lastForwardRecoveryResumedUnitCount = resumableUnitCount;
        this.lastForwardRecoveryRetainedBusyUnitCount =
            retainedBusyUnitCount;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;
            if (u.onBusy || u.hasValidEnemyTarget()) continue;

            u.enterWaveForwardMode(
                this.aggressiveForwardMode,
                true
            );
        }

        return true;
    }

    hasBackToLaneUnits() {
        if (this.released) return false;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;
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

            if (!this.isUnitAlive(u)) continue;
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
        this.initialForwardCombatReleaseThreshold = 1;
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

            if (!this.isUnitAlive(u)) continue;
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
        const targetWave = this.getTargetWave();

        if (!targetWave) return;

        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isUnitAlive(unit)) continue;
            if (unit.onBusy) continue;
            if (!unit.agent) continue;

            const target = targetWave.getClosestAliveUnitTo(
                unit.agent.pos.x,
                unit.agent.pos.z,
                unit.targetSearchRange
            );

            if (!target) continue;

            unit.primeWaveHuntTarget(target);
        }
    }

    private getClosestAliveUnitTo(
        x: number,
        z: number,
        maxRange: number = Infinity
    ): Unit | null {
        let best: Unit | null = null;
        let bestDistSq = Infinity;
        const maxRangeSq = Number.isFinite(maxRange)
            ? Math.max(0, maxRange) * Math.max(0, maxRange)
            : Infinity;

        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isUnitAlive(unit)) continue;

            const dx = unit.agent!.pos.x - x;
            const dz = unit.agent!.pos.z - z;
            const distSq = dx * dx + dz * dz;

            if (distSq > maxRangeSq) continue;

            if (distSq < bestDistSq) {
                bestDistSq = distSq;
                best = unit;
            }
        }

        return best;
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
        if (!this.isUnitAlive(unit)) return false;

        return !requiresForwardUnit || !!unit!.onForward;
    }

    private clearTargetWave(
        requestImmediateSearch: boolean = false
    ) {
        this.targetWave = null;
        this.targetClearSameLaneSearchResolved = false;
        this.immediateTargetSearchPending =
            requestImmediateSearch &&
            !this.released &&
            this.freeHuntActive;
    }

    private clearIdleHuntTargets() {
        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isUnitAlive(unit)) continue;
            if (unit.onBusy) continue;

            unit.clearEnemy();
        }
    }

    private clearAllFreeHuntContinuity() {
        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];

            if (!this.isUnitAlive(unit)) continue;

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
            if (!this.isUnitAlive(u)) continue;

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
            if (!this.isUnitAlive(u)) continue;

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
