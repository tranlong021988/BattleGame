import { Node, Tween, Vec3, tween } from 'cc';
import { Unit } from './Unit';
import { UnitType } from './BattleTypes';

export class BattleWave {

    private static unitWaveMap: WeakMap<Unit, number> = new WeakMap();
    private static unitWaveObjectMap: WeakMap<Unit, BattleWave> = new WeakMap();

    id = 0;
    team = 0;

    unitName = '';
    unitType: UnitType = UnitType.LightSword;

    totalCount = 0;
    units: Unit[] = [];

    assignedCounterCount = 0;
    laneId = -1;
    released = false;

    private runtimeStateFrame = -1;
    private runtimeAliveCount = 0;
    private runtimeHasEngaged = false;
    private targetSearchIntervalFrames = 1;
    private forwardModeActive = true;
    private freeHuntActive = false;
    private permanentFreeHunt = false;
    private aggressiveForwardMode = false;
    private forwardScannerUnit: Unit | null = null;
    private representativeUnit: Unit | null = null;
    private waveBannerNode: Node | null = null;
    private waveBannerRecycle:
        ((node: Node) => void) | null = null;
    private waveBannerTweenDuration = 0.2;

    constructor(
        id: number,
        team: number,
        unitName: string,
        unitType: UnitType,
        totalCount: number,
        laneId: number = -1
    ) {
        this.id = id;
        this.team = team;
        this.unitName = unitName;
        this.unitType = unitType;
        this.totalCount = totalCount;
        this.laneId = laneId;
    }

    addUnit(unit: Unit) {
        if (!unit) return;
        if (this.released) return;

        BattleWave.unitWaveMap.set(unit, this.id);
        BattleWave.unitWaveObjectMap.set(unit, this);

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

            this.units.push(unit);
        }
    }

    addCounterAssignment(count: number) {
        this.assignedCounterCount += Math.max(
            1,
            Math.floor(count)
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
        tweenDuration: number
    ) {
        this.releaseWaveBanner();

        if (!node) return;

        this.waveBannerNode = node;
        this.waveBannerRecycle = recycle;
        this.waveBannerTweenDuration = Math.max(
            0,
            tweenDuration
        );
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

        Tween.stopAllByTarget(banner);

        const hasParent =
            !!banner.parent;

        if (!hasParent) {
            banner.setParent(holder.node);
            banner.setPosition(0, 0, 0);
            return true;
        }

        banner.setParent(null, true);
        banner.setParent(holder.node, true);

        if (this.waveBannerTweenDuration <= 0) {
            banner.setPosition(0, 0, 0);
            return true;
        }

        tween(banner)
            .to(
                this.waveBannerTweenDuration,
                { position: new Vec3(0, 0, 0) }
            )
            .start();

        return true;
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
            return;
        }

        if (!banner.isValid) {
            this.waveBannerNode = null;
            this.waveBannerRecycle = null;
            return;
        }

        Tween.stopAllByTarget(banner);
        banner.setParent(null, true);

        const recycle =
            this.waveBannerRecycle;

        this.waveBannerNode = null;
        this.waveBannerRecycle = null;

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

    getCounterCoverageRatio() {
        const alive = this.getAliveCount();

        if (alive <= 0) {
            return 1;
        }

        return this.assignedCounterCount / alive;
    }

    isCounterCovered(requiredCoverageRatio: number) {
        return this.getCounterCoverageRatio() >= requiredCoverageRatio;
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

    findSharedTargetForUnit(
        requester: Unit | null
    ) {
        if (this.released) return null;
        if (!this.isUnitAlive(requester)) return null;
        if (!requester!.agent) return null;

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < this.units.length; i++) {
            const ally = this.units[i];

            if (ally === requester) continue;
            if (!this.isUnitAlive(ally)) continue;

            const target = ally.getValidEnemyTarget();

            if (!target) continue;

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
        searchRange: number = 0,
        permanent: boolean = false
    ) {
        if (this.released) return;

        if (permanent) {
            this.permanentFreeHunt = true;
        }

        if (
            this.freeHuntActive &&
            searchRange <= 0
        ) {
            return;
        }

        this.forwardModeActive = false;
        this.freeHuntActive = true;
        this.forwardScannerUnit = null;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            u.enterWaveFreeHuntMode(
                searchRange
            );
        }
    }

    enterCombatMode() {
        if (this.released) return;

        if (this.freeHuntActive) return;

        this.forwardModeActive = false;
        this.freeHuntActive = true;
        this.forwardScannerUnit = null;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            u.enterWaveCombatMode();
        }
    }

    forceForwardMode() {
        if (this.released) return false;

        let aliveCount = 0;

        this.forwardModeActive = true;
        this.freeHuntActive = false;
        this.permanentFreeHunt = false;
        this.forwardScannerUnit = null;

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

    getForwardScanner(
        refresh: boolean = false
    ): Unit | null {
        if (!this.isForwardMode()) {
            return null;
        }

        if (
            !refresh &&
            this.isForwardScannerEligible(
                this.forwardScannerUnit
            )
        ) {
            return this.forwardScannerUnit;
        }

        let best: Unit | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;
            if (!u.onForward) continue;

            const score =
                u.agent!.pos.x * u.forwardDir.x +
                u.agent!.pos.z * u.forwardDir.z;

            if (score > bestScore) {
                bestScore = score;
                best = u;
            }
        }

        this.forwardScannerUnit = best;
        return this.forwardScannerUnit;
    }

    tryResumeForward() {
        if (this.released) return false;
        if (!this.freeHuntActive) return false;
        if (this.permanentFreeHunt) return false;

        let aliveCount = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            aliveCount++;

            if (u.onBusy) return false;
            if (u.hasValidEnemyTarget()) return false;
            if (!u.hasConfirmedNoTargetSearch()) {
                return false;
            }
        }

        if (aliveCount <= 0) return false;

        this.forwardModeActive = true;
        this.freeHuntActive = false;
        this.forwardScannerUnit = null;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            u.enterWaveForwardMode(
                this.aggressiveForwardMode
            );
        }

        return true;
    }

    isDead() {
        if (this.released) {
            return true;
        }

        return this.getAliveCount() <= 0;
    }

    releaseReferences() {
        this.releaseWaveBanner();

        this.released = true;
        this.assignedCounterCount = 0;
        this.runtimeStateFrame = -1;
        this.runtimeAliveCount = 0;
        this.runtimeHasEngaged = false;
        this.targetSearchIntervalFrames = 1;
        this.forwardModeActive = false;
        this.freeHuntActive = false;
        this.permanentFreeHunt = false;
        this.aggressiveForwardMode = false;
        this.forwardScannerUnit = null;
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

    private pickRepresentativeUnit(
        excludedUnit: Unit | null = null
    ) {
        if (this.released) return null;

        if (
            !excludedUnit &&
            !this.representativeUnit &&
            this.isForwardMode()
        ) {
            const scanner =
                this.getForwardScanner(true);

            if (this.isUnitAlive(scanner)) {
                return scanner;
            }
        }

        let aliveCount = 0;
        let sumX = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (u === excludedUnit) continue;
            if (!this.isUnitAlive(u)) continue;

            aliveCount++;
            sumX += u.agent!.pos.x;
        }

        if (aliveCount <= 0) return null;

        const averageX = sumX / aliveCount;
        let best: Unit | null = null;
        let bestDistance = Infinity;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (u === excludedUnit) continue;
            if (!this.isUnitAlive(u)) continue;

            const distance =
                Math.abs(
                    u.agent!.pos.x - averageX
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
