import { RVOSimulator } from './RVO';

export class RVOWorkerAgent {

    id = 0;

    pos = { x: 0, z: 0 };
    vel = { x: 0, z: 0 };
    prefVel = { x: 0, z: 0 };

    maxSpeed = 2;
    radius = 0.5;
    waveRuntimeId = -1;

    neighborDist = 2.4;
    maxNeighbors = 8;

    locked = false;
    canBePush = 0;
    isHero = 0;
    canBePassedThroughByForwardAlly = 0;

    team = -1;
    onForward = 0;

    forwardX = 0;
    forwardZ = 1;

    enableAllyOvertake = 0;
    overtakeLookAhead = 2.2;
    overtakeSideRange = 1.2;
    overtakeSideStrength = 0.75;
    overtakeSpeedDiff = 0.15;
    overtakeSeed = 1;
    overtakeSideLock = 0;
    overtakeHoldFrames = 0;
    forwardSlowFrames = 0;

    gridX = 0;
    gridZ = 0;

    constructor(id: number, x: number, z: number) {
        this.id = id;
        this.pos.x = x;
        this.pos.z = z;
    }
}

type CircleObstacle = { x: number; z: number; r: number };

type RectObstacle = {
    x: number;
    z: number;
    hx: number;
    hz: number;
    cos: number;
    sin: number;
};

export class RVOWorkerSimulator {

    private static readonly workerResponseTimeoutMs = 2000;

    agents: RVOWorkerAgent[] = [];

    circleObs: CircleObstacle[] = [];
    rectObs: RectObstacle[] = [];

    cellSize = 2.2;
    timeStep = 1 / 60;
    minStepDeltaTime = 1 / 120;
    maxStepDeltaTime = 1 / 20;
    obstacleSolveIterations = 3;

    useBounds = false;
    minX = -99999;
    maxX = 99999;
    minZ = -99999;
    maxZ = 99999;

    private worker: Worker | null = null;
    private workerReady = false;
    private workerCreatedAtMs = 0;
    private pending = false;
    private pendingSinceMs = 0;
    private fallbackSimulator: RVOSimulator | null = null;

    private nextAgentId = 1;
    private agentMap: Map<number, RVOWorkerAgent> = new Map();

    private idsBuffer: Int32Array | null = null;
    private floatsBuffer: Float32Array | null = null;
    private intsBuffer: Int32Array | null = null;
    private bufferCapacity = 0;

    private obstacleDirty = true;
    private sequence = 0;

    static isSupported() {
        return typeof Worker !== 'undefined' &&
            typeof Blob !== 'undefined' &&
            typeof URL !== 'undefined' &&
            !!URL.createObjectURL;
    }

    constructor() {
        this.createWorker();
    }

    destroy() {
        if (this.fallbackSimulator) {
            this.fallbackSimulator.destroy();
            this.fallbackSimulator = null;
        }

        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }

        this.workerReady = false;
        this.workerCreatedAtMs = 0;
        this.pending = false;
        this.pendingSinceMs = 0;

        this.agentMap.clear();
        this.agents.length = 0;
        this.circleObs.length = 0;
        this.rectObs.length = 0;

        this.idsBuffer = null;
        this.floatsBuffer = null;
        this.intsBuffer = null;
        this.bufferCapacity = 0;
    }

    setBattlefield(minX: number, maxX: number, minZ: number, maxZ: number) {
        this.useBounds = true;
        this.minX = minX;
        this.maxX = maxX;
        this.minZ = minZ;
        this.maxZ = maxZ;

        if (this.fallbackSimulator) {
            this.fallbackSimulator.setBattlefield(
                minX,
                maxX,
                minZ,
                maxZ
            );
        }
    }

    addAgent(x: number, z: number) {
        const a = new RVOWorkerAgent(this.nextAgentId++, x, z);

        this.agents.push(a);
        this.agentMap.set(a.id, a);

        return a;
    }

    removeAgent(a: RVOWorkerAgent) {
        const idx = this.agents.indexOf(a);

        if (idx >= 0) {
            this.agents.splice(idx, 1);
        }

        this.agentMap.delete(a.id);
    }

    setPrefVelocity(a: RVOWorkerAgent, vx: number, vz: number) {
        a.prefVel.x = vx;
        a.prefVel.z = vz;
    }

    addCircleObstacle(x: number, z: number, r: number) {
        this.circleObs.push({ x, z, r });
        this.obstacleDirty = true;
    }

    addRectObstacle(x: number, z: number, hx: number, hz: number, angle: number) {
        this.rectObs.push({
            x,
            z,
            hx,
            hz,
            cos: Math.cos(angle),
            sin: Math.sin(angle)
        });

        this.obstacleDirty = true;
    }

    private getSafeDeltaTime(deltaTime?: number) {
        if (
            typeof deltaTime !== 'number' ||
            !isFinite(deltaTime) ||
            deltaTime <= 0
        ) {
            return this.timeStep;
        }

        return Math.max(
            this.minStepDeltaTime,
            Math.min(this.maxStepDeltaTime, deltaTime)
        );
    }

    step(deltaTime?: number) {
        if (this.fallbackSimulator) {
            this.fallbackSimulator.cellSize =
                this.cellSize;
            this.fallbackSimulator.timeStep =
                this.timeStep;
            this.fallbackSimulator.minStepDeltaTime =
                this.minStepDeltaTime;
            this.fallbackSimulator.maxStepDeltaTime =
                this.maxStepDeltaTime;
            this.fallbackSimulator.obstacleSolveIterations =
                this.obstacleSolveIterations;

            return this.fallbackSimulator.step(deltaTime);
        }

        if (!this.worker) return false;

        if (!this.workerReady) {
            if (
                Date.now() - this.workerCreatedAtMs >=
                RVOWorkerSimulator.workerResponseTimeoutMs
            ) {
                this.activateMainThreadFallback();

                return this.fallbackSimulator
                    ? this.fallbackSimulator.step(deltaTime)
                    : false;
            }

            return false;
        }

        if (this.pending) {
            if (
                Date.now() - this.pendingSinceMs >=
                RVOWorkerSimulator.workerResponseTimeoutMs
            ) {
                this.activateMainThreadFallback();

                return this.fallbackSimulator
                    ? this.fallbackSimulator.step(deltaTime)
                    : false;
            }

            return false;
        }

        if (this.agents.length <= 0) return false;

        const safeDeltaTime = this.getSafeDeltaTime(deltaTime);

        if (this.obstacleDirty) {
            this.sendObstaclesToWorker();
        }

        const count = this.agents.length;

        this.ensureBuffers(count);

        if (!this.idsBuffer || !this.floatsBuffer || !this.intsBuffer) return false;

        const ids = this.idsBuffer;
        const floats = this.floatsBuffer;
        const ints = this.intsBuffer;

        for (let i = 0; i < count; i++) {
            const a = this.agents[i];

            ids[i] = a.id;

            const fi = i * 18;

            floats[fi + 0] = a.pos.x;
            floats[fi + 1] = a.pos.z;
            floats[fi + 2] = a.vel.x;
            floats[fi + 3] = a.vel.z;
            floats[fi + 4] = a.prefVel.x;
            floats[fi + 5] = a.prefVel.z;
            floats[fi + 6] = a.maxSpeed;
            floats[fi + 7] = a.radius;
            floats[fi + 8] = a.neighborDist;
            floats[fi + 9] = a.forwardX;
            floats[fi + 10] = a.forwardZ;
            floats[fi + 11] = a.overtakeLookAhead;
            floats[fi + 12] = a.overtakeSideRange;
            floats[fi + 13] = a.overtakeSideStrength;
            floats[fi + 14] = a.overtakeSpeedDiff;
            floats[fi + 15] = a.overtakeSeed;
            floats[fi + 16] = a.team;
            floats[fi + 17] = a.onForward;

            const ii = i * 7;

            ints[ii + 0] = a.maxNeighbors;
            ints[ii + 1] = a.locked ? 1 : 0;
            ints[ii + 2] = a.enableAllyOvertake ? 1 : 0;
            ints[ii + 3] = a.canBePush ? 1 : 0;
            ints[ii + 4] = a.isHero ? 1 : 0;
            ints[ii + 5] =
                a.canBePassedThroughByForwardAlly ? 1 : 0;
            ints[ii + 6] = Math.floor(a.waveRuntimeId);
        }

        this.pending = true;
        this.pendingSinceMs = Date.now();
        this.sequence++;

        try {
            this.worker.postMessage({
                type: 'step',
                sequence: this.sequence,
                ids,
                floats,
                ints,
                count,

                cellSize: this.cellSize,
                timeStep: safeDeltaTime,
                obstacleSolveIterations:
                    this.obstacleSolveIterations,

                useBounds: this.useBounds ? 1 : 0,
                minX: this.minX,
                maxX: this.maxX,
                minZ: this.minZ,
                maxZ: this.maxZ
            }, [
                ids.buffer,
                floats.buffer,
                ints.buffer
            ]);
        } catch (err) {
            this.pending = false;
            this.pendingSinceMs = 0;
            this.activateMainThreadFallback();

            return this.fallbackSimulator
                ? this.fallbackSimulator.step(deltaTime)
                : false;
        }

        // Sau transfer, buffer bị detach.
        // Sẽ được gán lại khi Worker trả kết quả.
        this.idsBuffer = null;
        this.floatsBuffer = null;
        this.intsBuffer = null;

        return true;
    }

    private ensureBuffers(count: number) {
        if (
            this.bufferCapacity >= count &&
            this.idsBuffer &&
            this.floatsBuffer &&
            this.intsBuffer
        ) {
            return;
        }

        this.bufferCapacity = Math.max(count, this.bufferCapacity * 2, 64);

        this.idsBuffer = new Int32Array(this.bufferCapacity);
        this.floatsBuffer = new Float32Array(this.bufferCapacity * 18);
        this.intsBuffer = new Int32Array(this.bufferCapacity * 7);
    }

    private sendObstaclesToWorker() {
        if (!this.worker || !this.workerReady) return;

        const circleData = new Float32Array(this.circleObs.length * 3);

        for (let i = 0; i < this.circleObs.length; i++) {
            const ob = this.circleObs[i];
            const k = i * 3;

            circleData[k + 0] = ob.x;
            circleData[k + 1] = ob.z;
            circleData[k + 2] = ob.r;
        }

        const rectData = new Float32Array(this.rectObs.length * 6);

        for (let i = 0; i < this.rectObs.length; i++) {
            const ob = this.rectObs[i];
            const k = i * 6;

            rectData[k + 0] = ob.x;
            rectData[k + 1] = ob.z;
            rectData[k + 2] = ob.hx;
            rectData[k + 3] = ob.hz;
            rectData[k + 4] = ob.cos;
            rectData[k + 5] = ob.sin;
        }

        this.worker.postMessage({
            type: 'obstacles',
            circleData,
            rectData
        }, [
            circleData.buffer,
            rectData.buffer
        ]);

        this.obstacleDirty = false;
    }

    private createWorker() {
        if (!RVOWorkerSimulator.isSupported()) {
            console.warn('[RVOWorkerSimulator] Worker is not supported.');
            return;
        }

        const blob = new Blob([RVOWorkerSimulator.workerSource()], {
            type: 'application/javascript'
        });

        const url = URL.createObjectURL(blob);

        this.worker = this.createNamedWorker(
            url,
            'RVOWorkerSimulator'
        );
        this.workerCreatedAtMs = Date.now();

        URL.revokeObjectURL(url);

        this.worker.onmessage = (event: MessageEvent) => {
            const data = event.data;

            if (!data) return;

            if (data.type === 'ready') {
                this.workerReady = true;
                this.workerCreatedAtMs = 0;

                if (this.obstacleDirty) {
                    this.sendObstaclesToWorker();
                }

                return;
            }

            if (data.type === 'result') {
                this.pending = false;
                this.pendingSinceMs = 0;

                this.idsBuffer = data.ids;
                this.floatsBuffer = data.floats;
                this.intsBuffer = data.ints;

                this.applyWorkerResult(
                    data.ids,
                    data.floats,
                    data.count
                );
            }
        };

        this.worker.onerror = (err) => {
            console.warn(
                '[RVOWorkerSimulator] Worker failed; using main-thread fallback.',
                err
            );
            this.activateMainThreadFallback();
        };
    }

    private activateMainThreadFallback() {
        if (this.fallbackSimulator) return;

        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }

        this.workerReady = false;
        this.workerCreatedAtMs = 0;
        this.pending = false;
        this.pendingSinceMs = 0;

        const fallback = new RVOSimulator();

        fallback.agents = this.agents;
        fallback.circleObs = this.circleObs;
        fallback.rectObs = this.rectObs;
        fallback.cellSize = this.cellSize;
        fallback.timeStep = this.timeStep;
        fallback.minStepDeltaTime =
            this.minStepDeltaTime;
        fallback.maxStepDeltaTime =
            this.maxStepDeltaTime;
        fallback.obstacleSolveIterations =
            this.obstacleSolveIterations;

        if (this.useBounds) {
            fallback.setBattlefield(
                this.minX,
                this.maxX,
                this.minZ,
                this.maxZ
            );
        }

        this.fallbackSimulator = fallback;
    }

    private createNamedWorker(url: string, name: string) {
        try {
            return new Worker(url, { name });
        } catch (err) {
            return new Worker(url);
        }
    }

    private applyWorkerResult(
        ids: Int32Array,
        floats: Float32Array,
        count: number
    ) {
        for (let i = 0; i < count; i++) {
            const id = ids[i];
            const a = this.agentMap.get(id);

            if (!a) continue;

            const fi = i * 18;

            a.pos.x = floats[fi + 0];
            a.pos.z = floats[fi + 1];
            a.vel.x = floats[fi + 2];
            a.vel.z = floats[fi + 3];
        }
    }

    private static workerSource() {
        return `
const grid = new Map();
const activeGridCells = [];
const gridKeyRows = new Map();

let circleData = new Float32Array(0);
let rectData = new Float32Array(0);

const agentCache = [];
const OVERTAKE_SLOW_FRAME_THRESHOLD = 8;

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function key(gx, gz) {
    let row = gridKeyRows.get(gx);

    if (!row) {
        row = new Map();
        gridKeyRows.set(gx, row);
    }

    let result = row.get(gz);

    if (!result) {
        result = gx + "_" + gz;
        row.set(gz, result);
    }

    return result;
}

function getAgentFromCache(index) {
    let a = agentCache[index];

    if (!a) {
        a = {
            id: 0,

            x: 0,
            z: 0,

            vx: 0,
            vz: 0,

            prefX: 0,
            prefZ: 0,

            maxSpeed: 0,
            radius: 0,
            neighborDist: 0,
            waveRuntimeId: -1,

            forwardX: 0,
            forwardZ: 1,

            overtakeLookAhead: 0,
            overtakeSideRange: 0,
            overtakeSideStrength: 0,
            overtakeSpeedDiff: 0,
            overtakeSeed: 1,
            overtakeSideLock: 0,
            overtakeHoldFrames: 0,
            forwardSlowFrames: 0,

            team: -1,
            onForward: 0,

            maxNeighbors: 0,
            locked: false,
            canBePush: false,
            isHero: false,
            canBePassedThroughByForwardAlly: false,
            enableAllyOvertake: false,

            gridX: 0,
            gridZ: 0
        };

        agentCache[index] = a;
    }

    return a;
}

function buildAgents(ids, floats, ints, count) {
    const agents = agentCache;

    for (let i = 0; i < count; i++) {
        const a = getAgentFromCache(i);
        const previousId = a.id;

        const fi = i * 18;
        const ii = i * 7;

        a.id = ids[i];

        if (previousId !== a.id) {
            a.overtakeSideLock = 0;
            a.overtakeHoldFrames = 0;
            a.forwardSlowFrames = 0;
        }

        a.x = floats[fi + 0];
        a.z = floats[fi + 1];

        a.vx = floats[fi + 2];
        a.vz = floats[fi + 3];

        a.prefX = floats[fi + 4];
        a.prefZ = floats[fi + 5];

        a.maxSpeed = floats[fi + 6];
        a.radius = floats[fi + 7];
        a.neighborDist = floats[fi + 8];

        a.forwardX = floats[fi + 9];
        a.forwardZ = floats[fi + 10];

        a.overtakeLookAhead = floats[fi + 11];
        a.overtakeSideRange = floats[fi + 12];
        a.overtakeSideStrength = floats[fi + 13];
        a.overtakeSpeedDiff = floats[fi + 14];
        a.overtakeSeed = floats[fi + 15];

        a.team = floats[fi + 16];
        a.onForward = floats[fi + 17];

        a.maxNeighbors = ints[ii + 0];
        a.locked = ints[ii + 1] === 1;
        a.enableAllyOvertake = ints[ii + 2] === 1;
        a.canBePush = ints[ii + 3] === 1;
        a.isHero = ints[ii + 4] === 1;
        a.canBePassedThroughByForwardAlly =
            ints[ii + 5] === 1;
        a.waveRuntimeId = ints[ii + 6];

        a.gridX = 0;
        a.gridZ = 0;
    }

    return agents;
}

function buildGrid(agents, count, cellSize) {
    for (let i = 0; i < activeGridCells.length; i++) {
        activeGridCells[i].length = 0;
    }

    activeGridCells.length = 0;

    for (let i = 0; i < count; i++) {
        const a = agents[i];

        a.gridX = Math.floor(a.x / cellSize);
        a.gridZ = Math.floor(a.z / cellSize);

        const k = key(a.gridX, a.gridZ);
        let cell = grid.get(k);

        if (!cell) {
            cell = [];
            grid.set(k, cell);
        }

        if (cell.length <= 0) {
            activeGridCells.push(cell);
        }

        cell.push(a);
    }
}

function collectNeighbors(a, result, cellSize) {
    result.length = 0;

    const maxDistSq = a.neighborDist * a.neighborDist;
    const maxNeighbors = Math.max(0, Math.floor(a.maxNeighbors));

    if (maxNeighbors <= 0) {
        return;
    }

    for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
            const cell = grid.get(key(a.gridX + x, a.gridZ + z));

            if (!cell) continue;

            for (let i = 0; i < cell.length; i++) {
                const b = cell[i];

                if (b === a) continue;
                if (shouldIgnoreHeroAllyForwardPair(a, b)) continue;

                const dx = b.x - a.x;
                const dz = b.z - a.z;
                const d = dx * dx + dz * dz;

                if (d > maxDistSq) continue;

                insertNearestNeighbor(
                    a,
                    b,
                    d,
                    maxNeighbors,
                    result
                );
            }
        }
    }
}

const neighborScratch = [];

function shouldIgnoreHeroAllyForwardPair(a, b) {
    if (a.team < 0 || a.team !== b.team) return false;
    if (
        a.waveRuntimeId >= 0 &&
        a.waveRuntimeId === b.waveRuntimeId
    ) {
        return false;
    }

    if (a.isHero === true || b.isHero === true) {
        return a.onForward === 1 || b.onForward === 1;
    }

    if (
        a.canBePassedThroughByForwardAlly === true &&
        b.onForward === 1
    ) {
        return true;
    }

    return (
        b.canBePassedThroughByForwardAlly === true &&
        a.onForward === 1
    );
}

function insertNearestNeighbor(origin, candidate, candidateDistSq, maxNeighbors, result) {
    let insertAt = result.length;

    for (let i = 0; i < result.length; i++) {
        const other = result[i];
        const dx = other.x - origin.x;
        const dz = other.z - origin.z;
        const distSq = dx * dx + dz * dz;

        if (candidateDistSq < distSq) {
            insertAt = i;
            break;
        }
    }

    if (insertAt >= maxNeighbors) {
        return;
    }

    const end = Math.min(result.length, maxNeighbors - 1);

    result.length = Math.min(result.length + 1, maxNeighbors);

    for (let i = end; i > insertAt; i--) {
        result[i] = result[i - 1];
    }

    result[insertAt] = candidate;
}

function pushAgentOutOfCircle(a, k) {
    const ox = circleData[k + 0];
    const oz = circleData[k + 1];
    const r = circleData[k + 2];

    const dx = a.x - ox;
    const dz = a.z - oz;

    const distSq = dx * dx + dz * dz;
    const minDist = a.radius + r;

    if (distSq >= minDist * minDist) return;

    if (distSq < 1e-8) {
        a.x = ox + minDist + 0.001;
        a.z = oz;
        return;
    }

    const dist = Math.sqrt(distSq);
    const nx = dx / dist;
    const nz = dz / dist;

    const push = minDist - dist + 0.001;

    a.x += nx * push;
    a.z += nz * push;
}

function pushAgentOutOfRect(a, k) {
    const ox = rectData[k + 0];
    const oz = rectData[k + 1];
    const hx = rectData[k + 2];
    const hz = rectData[k + 3];
    const cos = rectData[k + 4];
    const sin = rectData[k + 5];

    const dx = a.x - ox;
    const dz = a.z - oz;

    const lx = dx * cos + dz * sin;
    const lz = -dx * sin + dz * cos;

    const px = clamp(lx, -hx, hx);
    const pz = clamp(lz, -hz, hz);

    const qx = lx - px;
    const qz = lz - pz;

    const distSq = qx * qx + qz * qz;

    let nxL = 0;
    let nzL = 0;
    let push = 0;

    if (distSq > 1e-8) {
        const dist = Math.sqrt(distSq);

        if (dist >= a.radius) return;

        nxL = qx / dist;
        nzL = qz / dist;
        push = a.radius - dist + 0.001;
    } else {
        const dLeft = lx + hx;
        const dRight = hx - lx;
        const dBottom = lz + hz;
        const dTop = hz - lz;

        let minD = dLeft;
        nxL = -1;
        nzL = 0;

        if (dRight < minD) {
            minD = dRight;
            nxL = 1;
            nzL = 0;
        }

        if (dBottom < minD) {
            minD = dBottom;
            nxL = 0;
            nzL = -1;
        }

        if (dTop < minD) {
            minD = dTop;
            nxL = 0;
            nzL = 1;
        }

        push = minD + a.radius + 0.001;
    }

    const nx = nxL * cos - nzL * sin;
    const nz = nxL * sin + nzL * cos;

    a.x += nx * push;
    a.z += nz * push;
}

function pushAgentOutOfObstacles(a) {
    for (let i = 0; i < circleData.length; i += 3) {
        pushAgentOutOfCircle(a, i);
    }

    for (let i = 0; i < rectData.length; i += 6) {
        pushAgentOutOfRect(a, i);
    }
}

function applyObstacleVelocityAvoidance(a) {
    let vx = a.vx;
    let vz = a.vz;

    for (let i = 0; i < circleData.length; i += 3) {
        const dx = a.x - circleData[i + 0];
        const dz = a.z - circleData[i + 1];
        const dist = Math.sqrt(dx * dx + dz * dz);
        const minDist = a.radius + circleData[i + 2];

        if (dist >= minDist || dist <= 0.0001) continue;

        const nx = dx / dist;
        const nz = dz / dist;

        vx += nx * (minDist - dist) * 2;
        vz += nz * (minDist - dist) * 2;

        const dot = vx * nx + vz * nz;

        if (dot < 0) {
            vx -= nx * dot;
            vz -= nz * dot;
        }
    }

    for (let i = 0; i < rectData.length; i += 6) {
        const dx = a.x - rectData[i + 0];
        const dz = a.z - rectData[i + 1];
        const hx = rectData[i + 2];
        const hz = rectData[i + 3];
        const cos = rectData[i + 4];
        const sin = rectData[i + 5];
        const lx = dx * cos + dz * sin;
        const lz = -dx * sin + dz * cos;
        const px = clamp(lx, -hx, hx);
        const pz = clamp(lz, -hz, hz);
        const ox = lx - px;
        const oz = lz - pz;
        const distSq = ox * ox + oz * oz;

        let nxL = 0;
        let nzL = 0;
        let push = 0;

        if (distSq > 1e-8) {
            if (distSq >= a.radius * a.radius) continue;

            const dist = Math.sqrt(distSq);
            nxL = ox / dist;
            nzL = oz / dist;
            push = a.radius - dist;
        } else {
            const dLeft = lx + hx;
            const dRight = hx - lx;
            const dBottom = lz + hz;
            const dTop = hz - lz;
            let minD = dLeft;

            nxL = -1;

            if (dRight < minD) {
                minD = dRight;
                nxL = 1;
                nzL = 0;
            }

            if (dBottom < minD) {
                minD = dBottom;
                nxL = 0;
                nzL = -1;
            }

            if (dTop < minD) {
                minD = dTop;
                nxL = 0;
                nzL = 1;
            }

            push = a.radius + minD;
        }

        const nx = nxL * cos - nzL * sin;
        const nz = nxL * sin + nzL * cos;

        vx += nx * push * 2;
        vz += nz * push * 2;

        const dot = vx * nx + vz * nz;

        if (dot < 0) {
            vx -= nx * dot;
            vz -= nz * dot;
        }
    }

    a.vx = vx;
    a.vz = vz;
}

function applyAllyOvertake(a, neighbors) {
    if (!a.enableAllyOvertake) return;
    if (a.locked) return;
    if (a.onForward !== 1) return;

    let best = null;
    let bestForwardDist = Infinity;
    let bestSideDist = 0;

    const lookAhead = Math.max(0, a.overtakeLookAhead);
    const sideRange = Math.max(0, a.overtakeSideRange);

    if (lookAhead <= 0 || sideRange <= 0) {
        return;
    }

    for (let i = 0; i < neighbors.length; i++) {
        const b = neighbors[i];

        if (b === a) continue;
        if (b.team !== a.team) continue;

        if (a.maxSpeed + a.overtakeSpeedDiff < b.maxSpeed) {
            continue;
        }
        if (!isAllyOvertakeBlocker(b)) continue;

        const dx = b.x - a.x;
        const dz = b.z - a.z;

        const forwardDist =
            dx * a.forwardX +
            dz * a.forwardZ;

        if (forwardDist <= a.radius * 0.25) continue;
        if (forwardDist > lookAhead) continue;

        const sideDist =
            dx * a.forwardZ -
            dz * a.forwardX;

        if (Math.abs(sideDist) > sideRange + a.radius + b.radius) continue;

        if (forwardDist < bestForwardDist) {
            bestForwardDist = forwardDist;
            bestSideDist = sideDist;
            best = b;
        }
    }

    if (!best) {
        if (a.overtakeHoldFrames > 0) {
            a.overtakeHoldFrames--;
        } else {
            a.overtakeSideLock = 0;
        }

        return;
    }

    let side = a.overtakeSideLock;

    if (side === 0 || a.overtakeHoldFrames <= 0) {
        side = chooseOvertakeSide(a, neighbors, bestSideDist);
        a.overtakeSideLock = side;
    }

    a.overtakeHoldFrames = 12;

    const closeFactor =
        1 -
        Math.min(
            1,
            bestForwardDist /
            Math.max(0.001, lookAhead)
        );
    const strength =
        a.maxSpeed *
        a.overtakeSideStrength *
        (0.35 + closeFactor * 0.65);

    const sideX = a.forwardZ * side;
    const sideZ = -a.forwardX * side;

    a.vx += sideX * strength;
    a.vz += sideZ * strength;

    const speed = Math.sqrt(a.vx * a.vx + a.vz * a.vz);

    if (speed > a.maxSpeed) {
        a.vx = (a.vx / speed) * a.maxSpeed;
        a.vz = (a.vz / speed) * a.maxSpeed;
    }
}

function updateForwardSlowFrames(a) {
    if (a.locked || a.onForward !== 1) {
        a.forwardSlowFrames = 0;
        return;
    }

    const prefForward =
        a.prefX * a.forwardX +
        a.prefZ * a.forwardZ;

    if (prefForward <= a.maxSpeed * 0.25) {
        a.forwardSlowFrames = 0;
        return;
    }

    const currentForward =
        a.vx * a.forwardX +
        a.vz * a.forwardZ;

    if (currentForward < prefForward * 0.35) {
        a.forwardSlowFrames++;
    } else {
        a.forwardSlowFrames = 0;
    }
}

function isAllyOvertakeBlocker(b) {
    if (b.locked) return true;
    if (b.onForward !== 1) return true;

    return b.forwardSlowFrames >= OVERTAKE_SLOW_FRAME_THRESHOLD;
}

function chooseOvertakeSide(a, neighbors, blockerSideDist) {
    const rightScore = getOvertakeSideClearanceScore(a, neighbors, 1);
    const leftScore = getOvertakeSideClearanceScore(a, neighbors, -1);

    if (Math.abs(rightScore - leftScore) > 0.001) {
        return rightScore > leftScore ? 1 : -1;
    }

    if (Math.abs(blockerSideDist) > 0.05) {
        return blockerSideDist > 0 ? -1 : 1;
    }

    return a.overtakeSeed >= 0 ? 1 : -1;
}

function getOvertakeSideClearanceScore(a, neighbors, side) {
    const sideX = a.forwardZ * side;
    const sideZ = -a.forwardX * side;
    const lookAhead = Math.max(0.001, a.overtakeLookAhead);
    const sideRange = Math.max(0.001, a.overtakeSideRange);

    let score = 0;

    for (let i = 0; i < neighbors.length; i++) {
        const b = neighbors[i];

        if (b === a) continue;

        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const forwardDist =
            dx * a.forwardX +
            dz * a.forwardZ;

        if (forwardDist < -a.radius) continue;
        if (forwardDist > lookAhead + b.radius) continue;

        const sideDist =
            dx * sideX +
            dz * sideZ;

        if (sideDist <= 0) continue;
        if (sideDist > sideRange + b.radius) continue;

        const forwardWeight =
            1 -
            Math.min(
                1,
                Math.abs(forwardDist) / lookAhead
            );
        const sideWeight =
            1 -
            Math.min(
                1,
                sideDist /
                (sideRange + b.radius)
            );

        score -=
            (forwardWeight * 1.5 + sideWeight) *
            (b.radius + a.radius);
    }

    return score;
}

function applyVelocityAvoidance(agents, count, data) {
    buildGrid(agents, count, data.cellSize);

    for (let i = 0; i < count; i++) {
        const a = agents[i];

        updateForwardSlowFrames(a);

        if (a.locked) continue;

        let vx = a.prefX;
        let vz = a.prefZ;

        collectNeighbors(a, neighborScratch, data.cellSize);

        for (let j = 0; j < neighborScratch.length; j++) {
            const b = neighborScratch[j];

            const dx = a.x - b.x;
            const dz = a.z - b.z;

            const distSq = dx * dx + dz * dz;
            const minDist = a.radius + b.radius;

            if (distSq < 0.0001) continue;

            if (distSq < minDist * minDist) {
                const dist = Math.sqrt(distSq);

                const nx = dx / dist;
                const nz = dz / dist;

                const push = minDist - dist;

                vx += nx * push * 2;
                vz += nz * push * 2;

                const dot = vx * nx + vz * nz;

                if (dot < 0) {
                    vx -= nx * dot;
                    vz -= nz * dot;
                }
            }
        }

        a.vx = vx;
        a.vz = vz;

        applyObstacleVelocityAvoidance(a);
        applyAllyOvertake(a, neighborScratch);

        const speed = Math.sqrt(a.vx * a.vx + a.vz * a.vz);

        if (speed > a.maxSpeed) {
            a.vx = (a.vx / speed) * a.maxSpeed;
            a.vz = (a.vz / speed) * a.maxSpeed;
        }
    }

}

function canMoveInHardSeparation(a) {
    return !a.locked || a.canBePush === true;
}

function moveAgents(agents, count, data) {
    const obstacleIterations = Math.max(
        0,
        Math.floor(data.obstacleSolveIterations || 0)
    );

    for (let i = 0; i < count; i++) {
        const a = agents[i];

        if (!a.locked) {
            a.x += a.vx * data.timeStep;
            a.z += a.vz * data.timeStep;

            for (let k = 0; k < obstacleIterations; k++) {
                pushAgentOutOfObstacles(a);
            }
        }

        if (data.useBounds === 1) {
            a.x = clamp(a.x, data.minX + a.radius, data.maxX - a.radius);
            a.z = clamp(a.z, data.minZ + a.radius, data.maxZ - a.radius);
        }
    }
}

function hardSeparateAgents(agents, count, data) {
    buildGrid(agents, count, data.cellSize);

    for (let i = 0; i < count; i++) {
        const a = agents[i];

        collectNeighbors(a, neighborScratch, data.cellSize);

        for (let j = 0; j < neighborScratch.length; j++) {
            const b = neighborScratch[j];

            const dx = b.x - a.x;
            const dz = b.z - a.z;

            const distSq = dx * dx + dz * dz;
            const minDist = a.radius + b.radius;

            if (distSq < 0.0001) continue;
            if (distSq >= minDist * minDist) continue;

            const dist = Math.sqrt(distSq);
            const overlap = minDist - dist;

            const nx = dx / dist;
            const nz = dz / dist;

            const aMovable = canMoveInHardSeparation(a);
            const bMovable = canMoveInHardSeparation(b);

            if (aMovable && bMovable) {
                const half = overlap * 0.5;

                a.x -= nx * half;
                a.z -= nz * half;

                b.x += nx * half;
                b.z += nz * half;
            } else if (aMovable && !bMovable) {
                a.x -= nx * overlap;
                a.z -= nz * overlap;
            } else if (!aMovable && bMovable) {
                b.x += nx * overlap;
                b.z += nz * overlap;
            }
        }
    }

}

function solveObstaclesAgain(agents, count, data) {
    const obstacleIterations = Math.max(
        0,
        Math.floor(data.obstacleSolveIterations || 0)
    );

    for (let i = 0; i < count; i++) {
        const a = agents[i];

        if (a.locked && a.canBePush !== true) continue;

        for (let k = 0; k < obstacleIterations; k++) {
            pushAgentOutOfObstacles(a);
        }

        if (data.useBounds === 1) {
            a.x = clamp(a.x, data.minX + a.radius, data.maxX - a.radius);
            a.z = clamp(a.z, data.minZ + a.radius, data.maxZ - a.radius);
        }
    }
}

function writeResultToFloats(agents, floats, count) {
    for (let i = 0; i < count; i++) {
        const a = agents[i];
        const fi = i * 18;

        floats[fi + 0] = a.x;
        floats[fi + 1] = a.z;
        floats[fi + 2] = a.vx;
        floats[fi + 3] = a.vz;
    }
}

function step(data) {
    const agents = buildAgents(
        data.ids,
        data.floats,
        data.ints,
        data.count
    );

    applyVelocityAvoidance(agents, data.count, data);
    moveAgents(agents, data.count, data);
    hardSeparateAgents(agents, data.count, data);
    solveObstaclesAgain(agents, data.count, data);

    writeResultToFloats(
        agents,
        data.floats,
        data.count
    );

    self.postMessage({
        type: 'result',
        sequence: data.sequence,
        ids: data.ids,
        floats: data.floats,
        ints: data.ints,
        count: data.count
    }, [
        data.ids.buffer,
        data.floats.buffer,
        data.ints.buffer
    ]);
}

self.onmessage = function(event) {
    const data = event.data;

    if (!data) return;

    if (data.type === 'obstacles') {
        circleData = data.circleData || new Float32Array(0);
        rectData = data.rectData || new Float32Array(0);
        return;
    }

    if (data.type === 'step') {
        step(data);
    }
};

self.postMessage({ type: 'ready' });
`;
    }
}
