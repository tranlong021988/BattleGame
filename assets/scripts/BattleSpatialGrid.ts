import { Unit } from './Unit';

type NearestEnemyCallback = (target: Unit | null) => void;

interface NearestEnemyRequest {
    requestId: number;
    unit: Unit;
    team: number;
    x: number;
    z: number;
    radius: number;
    callback: NearestEnemyCallback;
}

export class BattleSpatialGrid {

    cellSize = 4;
    useWorkerTargetQuery = true;

    private teamAGrid: Map<string, Unit[]> = new Map();
    private teamBGrid: Map<string, Unit[]> = new Map();

    private tempResult: Unit[] = [];
    private nearestSearchBest: Unit | null = null;
    private nearestSearchBestDistSq = Infinity;

    private worker: Worker | null = null;
    private workerReady = false;
    private workerFailed = false;
    private workerSeq = 0;
    private nextUnitId = 1;
    private nextRequestId = 1;
    private unitIds: WeakMap<Unit, number> = new WeakMap();
    private unitsById: Map<number, Unit> = new Map();
    private targetSnapshot: number[] = [];
    private pendingNearestRequests: NearestEnemyRequest[] = [];
    private activeNearestRequests: Map<number, NearestEnemyRequest> = new Map();
    private flushScheduled = false;

    build(teamA: Unit[], teamB: Unit[]) {
        this.teamAGrid.clear();
        this.teamBGrid.clear();
        this.unitsById.clear();
        this.targetSnapshot.length = 0;

        this.fillGrid(this.teamAGrid, teamA, 0);
        this.fillGrid(this.teamBGrid, teamB, 1);
    }

    destroy() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }

        this.workerReady = false;
        this.workerFailed = false;
        this.flushScheduled = false;
        this.pendingNearestRequests.length = 0;
        this.activeNearestRequests.clear();
        this.unitsById.clear();
        this.targetSnapshot.length = 0;
    }

    private fillGrid(
        grid: Map<string, Unit[]>,
        units: Unit[],
        team: number
    ) {
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

            const id = this.getUnitId(unit);
            this.unitsById.set(id, unit);
            this.targetSnapshot.push(
                id,
                team,
                unit.agent.pos.x,
                unit.agent.pos.z
            );
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

    requestNearestEnemy(
        unit: Unit,
        team: number,
        x: number,
        z: number,
        radius: number,
        callback: NearestEnemyCallback
    ) {
        if (!this.canUseWorkerTargetQuery()) {
            return false;
        }

        if (this.targetSnapshot.length <= 0) {
            return false;
        }

        const request: NearestEnemyRequest = {
            requestId: this.nextRequestId++,
            unit,
            team,
            x,
            z,
            radius,
            callback,
        };

        this.pendingNearestRequests.push(request);

        if (!this.flushScheduled) {
            this.flushScheduled = true;

            Promise.resolve().then(() => {
                this.flushScheduled = false;
                this.flushNearestWorkerRequests();
            });
        }

        return true;
    }

    private getKey(x: number, z: number) {
        return `${x}_${z}`;
    }

    private canUseWorkerTargetQuery() {
        if (!this.useWorkerTargetQuery) return false;
        if (this.workerFailed) return false;

        if (!this.worker) {
            this.createWorker();
        }

        return !!this.worker && this.workerReady;
    }

    private flushNearestWorkerRequests() {
        if (
            !this.worker ||
            !this.workerReady ||
            this.pendingNearestRequests.length <= 0
        ) {
            return;
        }

        const requests = this.pendingNearestRequests.slice();
        this.pendingNearestRequests.length = 0;

        const packedRequests: number[] = [];

        for (let i = 0; i < requests.length; i++) {
            const request = requests[i];

            if (!this.isValidRequestUnit(request.unit)) {
                continue;
            }

            this.activeNearestRequests.set(
                request.requestId,
                request
            );

            packedRequests.push(
                request.requestId,
                request.team,
                request.x,
                request.z,
                request.radius
            );
        }

        if (packedRequests.length <= 0) {
            return;
        }

        try {
            this.worker.postMessage({
                type: 'findNearestBatch',
                seq: ++this.workerSeq,
                cellSize: this.cellSize,
                units: this.targetSnapshot,
                requests: packedRequests,
            });
        } catch (err) {
            this.workerFailed = true;
            this.workerReady = false;
            this.completeActiveRequestsOnMainThread();
        }
    }

    private applyWorkerResults(results: number[]) {
        for (let i = 0; i < results.length; i += 2) {
            const requestId = results[i];
            const targetId = results[i + 1];
            const request =
                this.activeNearestRequests.get(requestId);

            this.activeNearestRequests.delete(requestId);

            if (!request) continue;

            if (!this.isValidRequestUnit(request.unit)) {
                request.callback(null);
                continue;
            }

            const target =
                this.unitsById.get(targetId);

            if (!target || !this.isValidTargetUnit(target)) {
                request.callback(null);
                continue;
            }

            request.callback(target);
        }
    }

    private completeActiveRequestsOnMainThread() {
        const requests =
            Array.from(this.activeNearestRequests.values());

        this.activeNearestRequests.clear();

        for (let i = 0; i < requests.length; i++) {
            const request = requests[i];

            if (!this.isValidRequestUnit(request.unit)) {
                request.callback(null);
                continue;
            }

            request.callback(
                this.findNearestEnemy(
                    request.team,
                    request.x,
                    request.z,
                    request.radius
                )
            );
        }
    }

    private isValidRequestUnit(unit: Unit | null) {
        if (!unit) return false;
        if (!unit.node.activeInHierarchy) return false;
        if (!unit.agent) return false;
        if (!unit.props || unit.props.isDead()) return false;

        return true;
    }

    private isValidTargetUnit(unit: Unit | null) {
        return this.isValidRequestUnit(unit);
    }

    private getUnitId(unit: Unit) {
        let id = this.unitIds.get(unit);

        if (!id) {
            id = this.nextUnitId++;
            this.unitIds.set(unit, id);
        }

        return id;
    }

    private createWorker() {
        if (
            typeof Worker === 'undefined' ||
            typeof Blob === 'undefined' ||
            typeof URL === 'undefined' ||
            !URL.createObjectURL
        ) {
            this.workerFailed = true;
            return;
        }

        try {
            const blob = new Blob([this.workerSource()], {
                type: 'application/javascript',
            });

            const url = URL.createObjectURL(blob);

            this.worker = this.createNamedWorker(
                url,
                'BattleSpatialGridTargetWorker'
            );

            URL.revokeObjectURL(url);

            this.worker.onmessage = (event: MessageEvent) => {
                const data = event.data;

                if (!data) return;

                if (data.type === 'ready') {
                    this.workerReady = true;
                    return;
                }

                if (data.type === 'findNearestBatchResult') {
                    this.applyWorkerResults(data.results || []);
                }
            };

            this.worker.onerror = () => {
                this.workerFailed = true;
                this.workerReady = false;

                if (this.worker) {
                    this.worker.terminate();
                    this.worker = null;
                }

                this.completeActiveRequestsOnMainThread();
            };
        } catch (err) {
            this.workerFailed = true;
            this.workerReady = false;
            this.worker = null;
        }
    }

    private createNamedWorker(url: string, name: string) {
        try {
            return new Worker(url, { name });
        } catch (err) {
            return new Worker(url);
        }
    }

    private workerSource() {
        return `
function getKey(x, z) {
    return x + '_' + z;
}

function getCellMinDistanceSq(gx, gz, x, z, cellSize) {
    return getRectMinDistanceSq(gx, gx, gz, gz, x, z, cellSize);
}

function getRectMinDistanceSq(minGx, maxGx, minGz, maxGz, x, z, cellSize) {
    if (minGx > maxGx || minGz > maxGz) {
        return Infinity;
    }

    var minX = minGx * cellSize;
    var maxX = (maxGx + 1) * cellSize;
    var minZ = minGz * cellSize;
    var maxZ = (maxGz + 1) * cellSize;
    var dx = 0;
    var dz = 0;

    if (x < minX) {
        dx = minX - x;
    } else if (x > maxX) {
        dx = x - maxX;
    }

    if (z < minZ) {
        dz = minZ - z;
    } else if (z > maxZ) {
        dz = z - maxZ;
    }

    return dx * dx + dz * dz;
}

function scanCell(grid, gx, gz, x, z, radiusSq, best) {
    var list = grid[getKey(gx, gz)];

    if (!list) return best;

    for (var i = 0; i < list.length; i += 4) {
        var id = list[i];
        var ux = list[i + 2];
        var uz = list[i + 3];
        var dx = ux - x;
        var dz = uz - z;
        var d = dx * dx + dz * dz;

        if (d > radiusSq) continue;

        if (d < best.distSq) {
            best.distSq = d;
            best.id = id;
        }
    }

    return best;
}

function findNearest(grid, x, z, radius, cellSize) {
    var cellRange = Math.ceil(radius / cellSize);
    var cx = Math.floor(x / cellSize);
    var cz = Math.floor(z / cellSize);
    var radiusSq = radius * radius;
    var best = {
        id: 0,
        distSq: Infinity
    };

    for (var ring = 0; ring <= cellRange; ring++) {
        var ringMinDistSq;

        if (ring <= 0) {
            ringMinDistSq = getCellMinDistanceSq(cx, cz, x, z, cellSize);
        } else {
            var minX = cx - ring;
            var maxX = cx + ring;
            var minZ = cz - ring;
            var maxZ = cz + ring;

            ringMinDistSq = Math.min(
                getRectMinDistanceSq(minX, minX, minZ + 1, maxZ - 1, x, z, cellSize),
                getRectMinDistanceSq(maxX, maxX, minZ + 1, maxZ - 1, x, z, cellSize),
                getRectMinDistanceSq(minX, maxX, minZ, minZ, x, z, cellSize),
                getRectMinDistanceSq(minX, maxX, maxZ, maxZ, x, z, cellSize)
            );
        }

        if (ringMinDistSq > radiusSq) {
            break;
        }

        if (best.id && ringMinDistSq > best.distSq) {
            break;
        }

        if (ring <= 0) {
            best = scanCell(grid, cx, cz, x, z, radiusSq, best);
            continue;
        }

        var left = cx - ring;
        var right = cx + ring;
        var bottom = cz - ring;
        var top = cz + ring;

        for (var gx = left; gx <= right; gx++) {
            best = scanCell(grid, gx, bottom, x, z, radiusSq, best);
            best = scanCell(grid, gx, top, x, z, radiusSq, best);
        }

        for (var gz = bottom + 1; gz <= top - 1; gz++) {
            best = scanCell(grid, left, gz, x, z, radiusSq, best);
            best = scanCell(grid, right, gz, x, z, radiusSq, best);
        }
    }

    return best.id;
}

function buildGrid(units, team, cellSize) {
    var grid = Object.create(null);

    for (var i = 0; i < units.length; i += 4) {
        if (units[i + 1] !== team) continue;

        var x = units[i + 2];
        var z = units[i + 3];
        var gx = Math.floor(x / cellSize);
        var gz = Math.floor(z / cellSize);
        var key = getKey(gx, gz);
        var list = grid[key];

        if (!list) {
            list = [];
            grid[key] = list;
        }

        list.push(
            units[i],
            units[i + 1],
            x,
            z
        );
    }

    return grid;
}

self.onmessage = function(event) {
    var data = event.data;

    if (!data) return;

    if (data.type === 'findNearestBatch') {
        var units = data.units || [];
        var requests = data.requests || [];
        var cellSize = Math.max(0.001, data.cellSize || 4);
        var teamAGrid = buildGrid(units, 0, cellSize);
        var teamBGrid = buildGrid(units, 1, cellSize);
        var results = [];

        for (var i = 0; i < requests.length; i += 5) {
            var requestId = requests[i];
            var team = requests[i + 1];
            var x = requests[i + 2];
            var z = requests[i + 3];
            var radius = requests[i + 4];
            var grid = team === 0
                ? teamBGrid
                : teamAGrid;

            results.push(
                requestId,
                findNearest(grid, x, z, radius, cellSize)
            );
        }

        self.postMessage({
            type: 'findNearestBatchResult',
            seq: data.seq,
            results: results
        });
    }
};

self.postMessage({ type: 'ready' });
`;
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
