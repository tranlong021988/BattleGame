import { Unit } from './Unit';

export class BattleSpatialGrid {

    cellSize = 4;

    private teamAGrid: Map<string, Unit[]> = new Map();
    private teamBGrid: Map<string, Unit[]> = new Map();

    private tempResult: Unit[] = [];

    build(teamA: Unit[], teamB: Unit[]) {
        this.teamAGrid.clear();
        this.teamBGrid.clear();

        this.fillGrid(this.teamAGrid, teamA);
        this.fillGrid(this.teamBGrid, teamB);
    }

    private fillGrid(grid: Map<string, Unit[]>, units: Unit[]) {
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];

            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props || unit.props.isDead()) continue;

            const gx = Math.floor(unit.agent.pos.x / this.cellSize);
            const gz = Math.floor(unit.agent.pos.z / this.cellSize);

            const key = this.getKey(gx, gz);

            let list = grid.get(key);

            if (!list) {
                list = [];
                grid.set(key, list);
            }

            list.push(unit);
        }
    }

    queryEnemies(
        team: number,
        x: number,
        z: number,
        radius: number
    ): Unit[] {
        const enemyGrid = team === 0
            ? this.teamBGrid
            : this.teamAGrid;

        this.tempResult.length = 0;

        const cellRange = Math.ceil(radius / this.cellSize);

        const cx = Math.floor(x / this.cellSize);
        const cz = Math.floor(z / this.cellSize);

        const radiusSq = radius * radius;

        for (let gx = cx - cellRange; gx <= cx + cellRange; gx++) {
            for (let gz = cz - cellRange; gz <= cz + cellRange; gz++) {
                const list = enemyGrid.get(this.getKey(gx, gz));

                if (!list) continue;

                for (let i = 0; i < list.length; i++) {
                    const unit = list[i];

                    if (!unit) continue;
                    if (!unit.node.activeInHierarchy) continue;
                    if (!unit.agent) continue;
                    if (!unit.props || unit.props.isDead()) continue;

                    const dx = unit.agent.pos.x - x;
                    const dz = unit.agent.pos.z - z;
                    const d = dx * dx + dz * dz;

                    if (d <= radiusSq) {
                        this.tempResult.push(unit);
                    }
                }
            }
        }

        return this.tempResult;
    }

    findNearestEnemy(
        team: number,
        x: number,
        z: number,
        radius: number
    ): Unit | null {
        const candidates = this.queryEnemies(team, x, z, radius);

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < candidates.length; i++) {
            const unit = candidates[i];

            if (!unit.agent) continue;

            const dx = unit.agent.pos.x - x;
            const dz = unit.agent.pos.z - z;
            const d = dx * dx + dz * dz;

            if (d < bestDistSq) {
                bestDistSq = d;
                best = unit;
            }
        }

        return best;
    }

    findNearestEnemyInRange(
        team: number,
        x: number,
        z: number,
        range: number
    ): Unit | null {
        return this.findNearestEnemy(team, x, z, range);
    }

    private getKey(x: number, z: number) {
        return `${x}_${z}`;
    }
}