import { Unit } from './Unit';
import { UnitType } from './BattleTypes';

export class BattleWave {

    private static unitWaveMap: WeakMap<Unit, number> = new WeakMap();

    id = 0;
    team = 0;

    unitName = '';
    unitType: UnitType = UnitType.LightSword;

    totalCount = 0;
    units: Unit[] = [];

    assignedCounterCount = 0;

    constructor(
        id: number,
        team: number,
        unitName: string,
        unitType: UnitType,
        totalCount: number
    ) {
        this.id = id;
        this.team = team;
        this.unitName = unitName;
        this.unitType = unitType;
        this.totalCount = totalCount;
    }

    addUnit(unit: Unit) {
        if (!unit) return;

        BattleWave.unitWaveMap.set(unit, this.id);

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
        for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];

            if (!this.isUnitAlive(u)) continue;

            if (u.onBusy) {
                return true;
            }
        }

        return false;
    }

    isDead() {
        return this.getAliveCount() <= 0;
    }

    getAverageX() {
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
}