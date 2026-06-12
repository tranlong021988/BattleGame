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
    pendingLaneId = -1;
    combatModeActive = false;
    released = false;

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

        const onForwardUnits: Unit[] = [];
        const notBusyUnits: Unit[] = [];
        const aliveUnits: Unit[] = [];

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            aliveUnits.push(u);

            if (u.onForward) {
                onForwardUnits.push(u);
                continue;
            }

            if (!u.onBusy) {
                notBusyUnits.push(u);
            }
        }

        if (onForwardUnits.length > 0) {
            return this.randomFromList(onForwardUnits);
        }

        if (notBusyUnits.length > 0) {
            return this.randomFromList(notBusyUnits);
        }

        if (aliveUnits.length > 0) {
            return this.randomFromList(aliveUnits);
        }

        return null;
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

    isTargetingWave(targetWave: BattleWave | null) {
        if (this.released) return false;
        if (!targetWave) return false;
        if (targetWave === this) return false;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;
            if (!u.enemy) continue;

            if (BattleWave.getWaveForUnit(u.enemy) === targetWave) {
                return true;
            }
        }

        return false;
    }

    isEngagedWithOtherWave(targetWave: BattleWave | null) {
        if (this.released) return false;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;
            if (!u.onBusy) continue;
            if (!u.enemy) continue;

            const enemyWave =
                BattleWave.getWaveForUnit(u.enemy);

            if (enemyWave && enemyWave !== targetWave) {
                return true;
            }
        }

        return false;
    }

    hasPendingLaneTransfer() {
        if (this.released) {
            return false;
        }

        return this.pendingLaneId >= 0;
    }

    noteDefeatedEnemyWave(enemyWave: BattleWave | null) {
        if (!enemyWave) return;
        if (enemyWave.laneId < 0) return;

        this.pendingLaneId = enemyWave.laneId;
    }

    setPendingLaneId(laneId: number) {
        if (this.released) return;
        if (laneId < 0) return;

        this.pendingLaneId = laneId;
    }

    tryApplyPendingLaneTransfer(
        formationWidth: number,
        unitSpacing: number
    ) {
        if (this.released) {
            return false;
        }

        if (!this.hasPendingLaneTransfer()) {
            return false;
        }

        if (this.hasEngaged()) {
            return false;
        }

        this.setLaneId(
            this.pendingLaneId,
            formationWidth,
            unitSpacing
        );

        this.pendingLaneId = -1;
        this.resumeForward();

        return true;
    }

    setLaneId(
        laneId: number,
        formationWidth: number = 1,
        unitSpacing: number = 1.5
    ) {
        if (this.released) return;

        this.laneId = laneId;
        this.assignLaneOffsets(
            formationWidth,
            unitSpacing
        );

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            u.laneId = laneId;
        }
    }

    resumeForward() {
        if (this.released) return;

        this.combatModeActive = false;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;
            if (u.onBusy) continue;

            u.setWaveForwardLane(
                this.laneId,
                u.forwardLaneOffsetX
            );
        }
    }

    enterCombatMode() {
        if (this.released) return;

        if (this.combatModeActive) {
            return;
        }

        this.combatModeActive = true;

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            u.enterWaveCombatMode();
        }
    }

    captureCurrentLaneOffsets(laneCenterX: number) {
        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;
            if (!u.agent) continue;

            u.forwardLaneOffsetX =
                u.agent.pos.x - laneCenterX;
        }
    }

    private assignLaneOffsets(
        formationWidth: number,
        unitSpacing: number
    ) {
        const aliveUnits = this.getAliveUnitsSortedByX();
        const count = aliveUnits.length;

        if (count <= 0) return;

        const columns = Math.max(
            1,
            Math.min(
                Math.floor(formationWidth),
                count
            )
        );

        const spacing = Math.max(
            0.01,
            unitSpacing
        );

        for (let i = 0; i < count; i++) {
            const col = Math.min(
                columns - 1,
                Math.floor(i * columns / count)
            );

            aliveUnits[i].forwardLaneOffsetX =
                (
                    col -
                    (columns - 1) * 0.5
                ) *
                spacing;
        }
    }

    private getAliveUnitsSortedByX() {
        const result: Unit[] = [];

        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            result.push(u);
        }

        result.sort((a, b) => {
            const ax = a.agent ? a.agent.pos.x : 0;
            const bx = b.agent ? b.agent.pos.x : 0;

            return ax - bx;
        });

        return result;
    }

    isDead() {
        if (this.released) {
            return true;
        }

        return this.getAliveCount() <= 0;
    }

    releaseReferences() {
        this.released = true;
        this.pendingLaneId = -1;
        this.combatModeActive = false;
        this.assignedCounterCount = 0;
        this.units.length = 0;
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

    private randomFromList(list: Unit[]) {
        if (list.length <= 0) return null;

        const index = Math.floor(
            Math.random() * list.length
        );

        return list[index];
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
