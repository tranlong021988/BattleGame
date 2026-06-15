import { Unit } from './Unit';

export class BattleSpatialGrid {

    cellSize = 4;

    private teamAGrid: Map<string, Unit[]> = new Map();
    private teamBGrid: Map<string, Unit[]> = new Map();

    private tempResult: Unit[] = [];
    private nearestSearchBest: Unit | null = null;
    private nearestSearchBestDistSq = Infinity;

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
        const enemyGrid =
            this.getEnemyGrid(team);

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
        const enemyGrid =
            this.getEnemyGrid(team);

        const cellRange =
            Math.ceil(radius / this.cellSize);

        const cx =
            Math.floor(x / this.cellSize);

        const cz =
            Math.floor(z / this.cellSize);

        const radiusSq =
            radius * radius;

        this.nearestSearchBest = null;
        this.nearestSearchBestDistSq = Infinity;

        for (
            let ring = 0;
            ring <= cellRange;
            ring++
        ) {
            const ringMinDistSq =
                this.getRingMinDistanceSq(
                    cx,
                    cz,
                    ring,
                    x,
                    z
                );

            if (ringMinDistSq > radiusSq) {
                break;
            }

            if (
                this.nearestSearchBest &&
                ringMinDistSq >
                this.nearestSearchBestDistSq
            ) {
                break;
            }

            this.scanRingForNearest(
                enemyGrid,
                cx,
                cz,
                ring,
                x,
                z,
                radiusSq
            );
        }

        return this.nearestSearchBest;
    }

    private scanRingForNearest(
        enemyGrid: Map<string, Unit[]>,
        cx: number,
        cz: number,
        ring: number,
        x: number,
        z: number,
        radiusSq: number
    ) {
        if (ring <= 0) {
            this.scanCellForNearest(
                enemyGrid,
                cx,
                cz,
                x,
                z,
                radiusSq
            );

            return;
        }

        const minX = cx - ring;
        const maxX = cx + ring;
        const minZ = cz - ring;
        const maxZ = cz + ring;

        for (let gx = minX; gx <= maxX; gx++) {
            this.scanCellForNearest(
                enemyGrid,
                gx,
                minZ,
                x,
                z,
                radiusSq
            );

            this.scanCellForNearest(
                enemyGrid,
                gx,
                maxZ,
                x,
                z,
                radiusSq
            );
        }

        for (
            let gz = minZ + 1;
            gz <= maxZ - 1;
            gz++
        ) {
            this.scanCellForNearest(
                enemyGrid,
                minX,
                gz,
                x,
                z,
                radiusSq
            );

            this.scanCellForNearest(
                enemyGrid,
                maxX,
                gz,
                x,
                z,
                radiusSq
            );
        }
    }

    private scanCellForNearest(
        enemyGrid: Map<string, Unit[]>,
        gx: number,
        gz: number,
        x: number,
        z: number,
        radiusSq: number
    ) {
        const list =
            enemyGrid.get(
                this.getKey(gx, gz)
            );

        if (!list) return;

        for (
            let i = 0;
            i < list.length;
            i++
        ) {
            const unit = list[i];

            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props || unit.props.isDead()) continue;

            const dx = unit.agent.pos.x - x;
            const dz = unit.agent.pos.z - z;
            const d = dx * dx + dz * dz;

            if (d > radiusSq) continue;

            if (d < this.nearestSearchBestDistSq) {
                this.nearestSearchBestDistSq = d;
                this.nearestSearchBest = unit;
            }
        }
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

    private getRingMinDistanceSq(
        cx: number,
        cz: number,
        ring: number,
        x: number,
        z: number
    ) {
        if (ring <= 0) {
            return this.getCellMinDistanceSq(
                cx,
                cz,
                x,
                z
            );
        }

        const minX = cx - ring;
        const maxX = cx + ring;
        const minZ = cz - ring;
        const maxZ = cz + ring;

        const left =
            this.getRectMinDistanceSq(
                minX,
                minX,
                minZ + 1,
                maxZ - 1,
                x,
                z
            );

        const right =
            this.getRectMinDistanceSq(
                maxX,
                maxX,
                minZ + 1,
                maxZ - 1,
                x,
                z
            );

        const bottom =
            this.getRectMinDistanceSq(
                minX,
                maxX,
                minZ,
                minZ,
                x,
                z
            );

        const top =
            this.getRectMinDistanceSq(
                minX,
                maxX,
                maxZ,
                maxZ,
                x,
                z
            );

        return Math.min(
            left,
            right,
            bottom,
            top
        );
    }

    private getCellMinDistanceSq(
        gx: number,
        gz: number,
        x: number,
        z: number
    ) {
        return this.getRectMinDistanceSq(
            gx,
            gx,
            gz,
            gz,
            x,
            z
        );
    }

    private getRectMinDistanceSq(
        minGx: number,
        maxGx: number,
        minGz: number,
        maxGz: number,
        x: number,
        z: number
    ) {
        if (
            minGx > maxGx ||
            minGz > maxGz
        ) {
            return Infinity;
        }

        const minX = minGx * this.cellSize;
        const maxX = (maxGx + 1) * this.cellSize;
        const minZ = minGz * this.cellSize;
        const maxZ = (maxGz + 1) * this.cellSize;

        let dx = 0;
        let dz = 0;

        if (x < minX) {
            dx = minX - x;
        }
        else if (x > maxX) {
            dx = x - maxX;
        }

        if (z < minZ) {
            dz = minZ - z;
        }
        else if (z > maxZ) {
            dz = z - maxZ;
        }

        return dx * dx + dz * dz;
    }

    private getEnemyGrid(team: number) {
        return team === 0
            ? this.teamBGrid
            : this.teamAGrid;
    }
}
