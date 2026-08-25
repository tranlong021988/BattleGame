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
    private aggressiveAdjacentBoundaryObserved = false;
    private aggressiveOwnLaneBlockObserved = false;
    private initialForwardCombatGateActive = true;
    private initialForwardCombatReleaseThreshold = 1;
    // One dynamic scanner per wave. In Forward it must still be marching;
    // in Free Hunt the frontmost alive unit takes the same captain role.
    private scannerUnit: Unit | null = null;
    private targetWave: BattleWave | null = null;
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
        if (!requester!.agent) return null;

        const targetWave = this.getTargetWave();

        if (!targetWave) return null;

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < this.units.length; i++) {
            const ally = this.units[i];

            if (ally === requester) continue;
            if (!this.isUnitAlive(ally)) continue;

            const target = ally.getValidEnemyTarget();

            if (!target) continue;
            if (
                targetWave &&
                BattleWave.getWaveForUnit(target) !== targetWave
            ) {
                continue;
            }

            const dx =
                target.agent!.pos.x -
                requester!.agent.pos.x;
            const dz =
                target.agent!.pos.z -
                requester!.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d < bestDistSq) {
                bestDistSq = d;
                best = target;
            }
        }

        return best;
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

            u.enterWaveFreeHuntMode(
                searchRange
            );
        }

        this.primeTargetWaveHuntTargets();
    }

    enterCombatMode() {
        if (this.released) return;

        if (this.freeHuntActive) return;

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
        this.initialForwardCombatGateActive = false;
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

    observeAggressiveAdjacentBoundary() {
        if (!this.isAggressiveForwardMode()) return false;
        if (this.aggressiveAdjacentBoundaryObserved) return false;

        this.aggressiveAdjacentBoundaryObserved = true;
        return true;
    }

    hasObservedAggressiveAdjacentBoundary() {
        return !this.released &&
            this.aggressiveAdjacentBoundaryObserved;
    }

    observeAggressiveOwnLaneBlock() {
        if (!this.isAggressiveForwardMode()) return false;
        if (this.aggressiveOwnLaneBlockObserved) return false;

        this.aggressiveOwnLaneBlockObserved = true;
        return true;
    }

    getForwardScanner(
        refresh: boolean = false
    ): Unit | null {
        if (!this.isForwardMode()) {
            return null;
        }

        if (
            !refresh &&
            this.isForwardScannerEligible(
                this.scannerUnit
            )
        ) {
            return this.scannerUnit;
        }

        this.scannerUnit =
            this.findFrontmostAliveUnit(true);

        return this.scannerUnit;
    }

    getHuntScanner(
        refresh: boolean = false
    ): Unit | null {
        if (this.released || !this.freeHuntActive) {
            return null;
        }

        if (
            !refresh &&
            this.isHuntScannerEligible(this.scannerUnit)
        ) {
            return this.scannerUnit;
        }

        this.scannerUnit =
            this.findFrontmostAliveUnit(false);

        return this.scannerUnit;
    }

    isCurrentScanner(
        unit: Unit | null,
        refresh: boolean = false
    ) {
        if (!unit || this.released) return false;

        const scanner = this.isForwardMode()
            ? this.getForwardScanner(refresh)
            : this.getHuntScanner(refresh);

        return scanner === unit;
    }

    getTargetWave() {
        if (
            this.targetWave &&
            (this.targetWave.released || this.targetWave.isDead())
        ) {
            this.clearTargetWave();
        }

        return this.targetWave;
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

        // Scanner search establishes the initial order only. A live order is
        // replaced exclusively by a real local engagement.
        if (this.getTargetWave()) return false;

        this.targetWave = nextTargetWave;

        if (this.freeHuntActive) {
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
        if (!unit.onBusy) return false;

        const nextTargetWave =
            BattleWave.getWaveForUnit(target);

        if (!nextTargetWave) return false;
        if (nextTargetWave === this) return false;
        if (nextTargetWave.team === this.team) return false;
        if (nextTargetWave.released || nextTargetWave.isDead()) {
            return false;
        }

        // A real engagement is a passive order change: busy units keep their
        // local combat, while free allies begin hunting this enemy wave.
        this.targetWave = nextTargetWave;

        if (this.freeHuntActive) {
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

        let aliveCount = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            aliveCount++;

            if (u.onBusy) return false;
            if (u.hasValidEnemyTarget()) return false;
        }

        if (aliveCount <= 0) return false;

        const scanner = this.getHuntScanner();

        if (!scanner || !scanner.hasConfirmedNoTargetSearch()) {
            return false;
        }

        if (beforeResume) {
            beforeResume(this);
        }

        this.forwardModeActive = true;
        this.freeHuntActive = false;
        this.initialForwardCombatGateActive = false;
        this.scannerUnit = null;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

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
                unit.agent.pos.z
            );

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

            if (!this.isUnitAlive(unit)) continue;

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

    private isForwardScannerEligible(
        unit: Unit | null
    ) {
        if (!this.isUnitAlive(unit)) return false;

        return !!unit!.onForward;
    }

    private isHuntScannerEligible(
        unit: Unit | null
    ) {
        return !!unit && this.isUnitAlive(unit);
    }

    private clearTargetWave() {
        this.targetWave = null;
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
