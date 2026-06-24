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
    private forwardScannerFrame = -1;
    private forwardScannerUnit: Unit | null = null;
    private targetSearchIntervalFrames = 1;

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
        if (this.released) {
            return false;
        }

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;
            if (!u.aggressiveForward) continue;

            return true;
        }

        return false;
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
        searchRange: number = 0
    ) {
        if (this.released) return;

        this.forwardScannerUnit = null;
        this.forwardScannerFrame = -1;

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

        this.forwardScannerUnit = null;
        this.forwardScannerFrame = -1;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            u.enterWaveCombatMode();
        }
    }

    getTargetSearchIntervalFrames() {
        return this.targetSearchIntervalFrames;
    }

    isDead() {
        if (this.released) {
            return true;
        }

        return this.getAliveCount() <= 0;
    }

    releaseReferences() {
        this.released = true;
        this.assignedCounterCount = 0;
        this.runtimeStateFrame = -1;
        this.runtimeAliveCount = 0;
        this.runtimeHasEngaged = false;
        this.forwardScannerFrame = -1;
        this.forwardScannerUnit = null;
        this.targetSearchIntervalFrames = 1;
        this.units.length = 0;
    }

    canUnitRunForwardScan(
        unit: Unit | null,
        frame: number
    ) {
        if (this.released) return true;
        if (!this.isUnitAlive(unit)) return false;

        const shouldPick =
            !this.isForwardScannerEligible(this.forwardScannerUnit) ||
            this.forwardScannerFrame !== frame;

        if (shouldPick) {
            this.pickFrontMostForwardScanner();
            this.forwardScannerFrame = frame;
        }

        return this.forwardScannerUnit === unit;
    }

    getAverageX() {
        if (this.released) return 0;

        let sum = 0;
        let count = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;
            if (!u.agent) continue;

            sum += u.agent.pos.x;
            count++;
        }

        if (count <= 0) return 0;

        return sum / count;
    }

    getAverageZ() {
        if (this.released) return 0;

        let sum = 0;
        let count = 0;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;
            if (!u.agent) continue;

            sum += u.agent.pos.z;
            count++;
        }

        if (count <= 0) return 0;

        return sum / count;
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

    private pickFrontMostForwardScanner() {
        this.forwardScannerUnit = null;

        let bestScore = -Infinity;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isForwardScannerEligible(u)) continue;

            const score =
                u.agent!.pos.x * u.forwardDir.x +
                u.agent!.pos.z * u.forwardDir.z;

            if (score > bestScore) {
                bestScore = score;
                this.forwardScannerUnit = u;
            }
        }
    }

    private isForwardScannerEligible(unit: Unit | null) {
        if (!this.isUnitAlive(unit)) return false;
        if (!unit.agent) return false;
        if (!unit.onForward) return false;

        return true;
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

    static getWaveForUnit(unit: Unit | null): BattleWave | null {
        if (!unit) return null;

        return BattleWave.unitWaveObjectMap.get(unit) || null;
    }
}
