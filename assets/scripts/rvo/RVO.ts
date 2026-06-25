export class RVOAgent {

    pos = { x: 0, z: 0 };
    vel = { x: 0, z: 0 };
    prefVel = { x: 0, z: 0 };

    maxSpeed = 2;
    radius = 0.5;

    // ===== neighbor tuning =====
    neighborDist = 2.4;
    maxNeighbors = 8;

    locked = false;

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

    gridX = 0;
    gridZ = 0;

    constructor(x: number, z: number) {
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

export class RVOSimulator {

    agents: RVOAgent[] = [];

    circleObs: CircleObstacle[] = [];
    rectObs: RectObstacle[] = [];

    grid: Map<string, RVOAgent[]> = new Map();
    private gridKeyRows: Map<number, Map<number, string>> =
        new Map();
    private activeGridCells: RVOAgent[][] = [];
    private neighborScratch: RVOAgent[] = [];
    private currentNeighborAgent: RVOAgent | null = null;
    private readonly compareNeighbors = (
        a: RVOAgent,
        b: RVOAgent
    ) => {
        const current = this.currentNeighborAgent;

        if (!current) return 0;

        const dxA = a.pos.x - current.pos.x;
        const dzA = a.pos.z - current.pos.z;
        const dxB = b.pos.x - current.pos.x;
        const dzB = b.pos.z - current.pos.z;

        return dxA * dxA + dzA * dzA -
            (dxB * dxB + dzB * dzB);
    };

    cellSize = 2.2;
    timeStep = 1 / 60;
    minStepDeltaTime = 1 / 120;
    maxStepDeltaTime = 1 / 20;

    // Số vòng chống xuyên vật cản.
    // Tăng lên 4-5 nếu unit chạy rất nhanh hoặc obstacle sát nhau.
    obstacleSolveIterations = 3;

    // ===== battlefield bounds =====
    useBounds = false;
    minX = -99999;
    maxX = 99999;
    minZ = -99999;
    maxZ = 99999;

    setBattlefield(minX: number, maxX: number, minZ: number, maxZ: number) {
        this.useBounds = true;
        this.minX = minX;
        this.maxX = maxX;
        this.minZ = minZ;
        this.maxZ = maxZ;
    }

    destroy() {
        this.agents.length = 0;
        this.circleObs.length = 0;
        this.rectObs.length = 0;
        this.activeGridCells.length = 0;
        this.neighborScratch.length = 0;
        this.currentNeighborAgent = null;
        this.grid.clear();
        this.gridKeyRows.clear();
    }

    addAgent(x: number, z: number) {
        const a = new RVOAgent(x, z);
        this.agents.push(a);
        return a;
    }

    removeAgent(a: RVOAgent) {
        const idx = this.agents.indexOf(a);

        if (idx >= 0) {
            this.agents.splice(idx, 1);
        }
    }

    setPrefVelocity(a: RVOAgent, vx: number, vz: number) {
        a.prefVel.x = vx;
        a.prefVel.z = vz;
    }

    addCircleObstacle(x: number, z: number, r: number) {
        this.circleObs.push({ x, z, r });
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
    }

    private clamp(v: number, min: number, max: number) {
        return Math.max(min, Math.min(max, v));
    }

    private getSafeDeltaTime(deltaTime?: number) {
        if (
            typeof deltaTime !== 'number' ||
            !isFinite(deltaTime) ||
            deltaTime <= 0
        ) {
            return this.timeStep;
        }

        return this.clamp(
            deltaTime,
            this.minStepDeltaTime,
            this.maxStepDeltaTime
        );
    }

    private buildGrid() {
        for (let i = 0; i < this.activeGridCells.length; i++) {
            this.activeGridCells[i].length = 0;
        }

        this.activeGridCells.length = 0;

        for (let i = 0; i < this.agents.length; i++) {
            const a = this.agents[i];
            const gx = Math.floor(a.pos.x / this.cellSize);
            const gz = Math.floor(a.pos.z / this.cellSize);

            a.gridX = gx;
            a.gridZ = gz;

            const key = this.getGridKey(gx, gz);

            let cell = this.grid.get(key);

            if (!cell) {
                cell = [];
                this.grid.set(key, cell);
            }

            if (cell.length <= 0) {
                this.activeGridCells.push(cell);
            }

            cell.push(a);
        }
    }

    private getGridKey(gx: number, gz: number) {
        let row = this.gridKeyRows.get(gx);

        if (!row) {
            row = new Map<number, string>();
            this.gridKeyRows.set(gx, row);
        }

        let key = row.get(gz);

        if (!key) {
            key = gx + "_" + gz;
            row.set(gz, key);
        }

        return key;
    }

    getNeighbors(a: RVOAgent) {
        const result = this.neighborScratch;
        result.length = 0;

        const maxDistSq = a.neighborDist * a.neighborDist;

        for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
                const key = this.getGridKey(
                    a.gridX + x,
                    a.gridZ + z
                );
                const cell = this.grid.get(key);

                if (!cell) continue;

                for (let i = 0; i < cell.length; i++) {
                    const other = cell[i];

                    if (other === a) continue;

                    const dx = other.pos.x - a.pos.x;
                    const dz = other.pos.z - a.pos.z;
                    const distSq = dx * dx + dz * dz;

                    if (distSq > maxDistSq) continue;

                    result.push(other);
                }
            }
        }

        this.currentNeighborAgent = a;
        result.sort(this.compareNeighbors);
        this.currentNeighborAgent = null;

        if (result.length > a.maxNeighbors) {
            result.length = a.maxNeighbors;
        }

        return result;
    }

    private applyAllyOvertake(a: RVOAgent) {
        if (!a.enableAllyOvertake) return;
        if (a.locked) return;
        if (a.onForward !== 1) return;

        let best: RVOAgent | null = null;
        let bestForwardDist = Infinity;

        for (let i = 0; i < this.agents.length; i++) {
            const b = this.agents[i];

            if (b === a) continue;
            if (b.locked) continue;
            if (b.team !== a.team) continue;
            if (b.onForward !== 1) continue;
            if (
                a.maxSpeed <=
                b.maxSpeed + a.overtakeSpeedDiff
            ) {
                continue;
            }

            const dx = b.pos.x - a.pos.x;
            const dz = b.pos.z - a.pos.z;
            const forwardDist =
                dx * a.forwardX +
                dz * a.forwardZ;

            if (forwardDist <= 0) continue;
            if (forwardDist > a.overtakeLookAhead) continue;

            const sideDist =
                dx * a.forwardZ -
                dz * a.forwardX;

            if (
                Math.abs(sideDist) >
                a.overtakeSideRange
            ) {
                continue;
            }

            if (forwardDist < bestForwardDist) {
                bestForwardDist = forwardDist;
                best = b;
            }
        }

        if (!best) return;

        const dx = a.pos.x - best.pos.x;
        const dz = a.pos.z - best.pos.z;
        let side =
            dx * a.forwardZ -
            dz * a.forwardX;

        if (Math.abs(side) > 0.05) {
            side = side >= 0 ? 1 : -1;
        } else {
            side = a.overtakeSeed >= 0 ? 1 : -1;
        }

        a.vel.x +=
            a.forwardZ *
            side *
            a.maxSpeed *
            a.overtakeSideStrength;
        a.vel.z +=
            -a.forwardX *
            side *
            a.maxSpeed *
            a.overtakeSideStrength;

        const speed = Math.sqrt(
            a.vel.x * a.vel.x +
            a.vel.z * a.vel.z
        );

        if (speed > a.maxSpeed) {
            a.vel.x =
                (a.vel.x / speed) * a.maxSpeed;
            a.vel.z =
                (a.vel.z / speed) * a.maxSpeed;
        }
    }

    // =========================================================
    // HARD COLLISION: CIRCLE OBSTACLE
    // =========================================================
    private pushAgentOutOfCircle(a: RVOAgent, ob: CircleObstacle) {
        const dx = a.pos.x - ob.x;
        const dz = a.pos.z - ob.z;

        const distSq = dx * dx + dz * dz;
        const minDist = a.radius + ob.r;

        if (distSq >= minDist * minDist) return;

        // Nếu nằm đúng tâm obstacle thì đẩy đại sang +X
        if (distSq < 1e-8) {
            a.pos.x = ob.x + minDist + 0.001;
            a.pos.z = ob.z;
            return;
        }

        const dist = Math.sqrt(distSq);
        const nx = dx / dist;
        const nz = dz / dist;

        const push = minDist - dist + 0.001;

        a.pos.x += nx * push;
        a.pos.z += nz * push;
    }

    // =========================================================
    // HARD COLLISION: RECT OBSTACLE
    // Hỗ trợ cả trường hợp agent ở ngoài rect lẫn đã lọt vào trong rect.
    // =========================================================
    private pushAgentOutOfRect(a: RVOAgent, ob: RectObstacle) {
        const dx = a.pos.x - ob.x;
        const dz = a.pos.z - ob.z;

        // World -> local rect space
        const lx = dx * ob.cos + dz * ob.sin;
        const lz = -dx * ob.sin + dz * ob.cos;

        const px = this.clamp(lx, -ob.hx, ob.hx);
        const pz = this.clamp(lz, -ob.hz, ob.hz);

        const ox = lx - px;
        const oz = lz - pz;

        const distSq = ox * ox + oz * oz;

        let nxL = 0;
        let nzL = 0;
        let push = 0;

        // Case 1: agent center ở ngoài rect
        if (distSq > 1e-8) {
            const dist = Math.sqrt(distSq);

            if (dist >= a.radius) return;

            nxL = ox / dist;
            nzL = oz / dist;
            push = a.radius - dist + 0.001;
        }
        // Case 2: agent center đã nằm bên trong rect
        else {
            const dLeft = lx + ob.hx;
            const dRight = ob.hx - lx;
            const dBottom = lz + ob.hz;
            const dTop = ob.hz - lz;

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

            // Đẩy từ vị trí hiện tại ra khỏi cạnh gần nhất + bán kính agent
            push = minD + a.radius + 0.001;
        }

        // Local normal -> world normal
        const nx = nxL * ob.cos - nzL * ob.sin;
        const nz = nxL * ob.sin + nzL * ob.cos;

        a.pos.x += nx * push;
        a.pos.z += nz * push;
    }

    private pushAgentOutOfObstacles(a: RVOAgent) {
        for (let i = 0; i < this.circleObs.length; i++) {
            this.pushAgentOutOfCircle(
                a,
                this.circleObs[i]
            );
        }

        for (let i = 0; i < this.rectObs.length; i++) {
            this.pushAgentOutOfRect(
                a,
                this.rectObs[i]
            );
        }
    }

    private clampToBattlefield(a: RVOAgent) {
        if (!this.useBounds) return;

        a.pos.x = Math.max(
            this.minX + a.radius,
            Math.min(this.maxX - a.radius, a.pos.x)
        );

        a.pos.z = Math.max(
            this.minZ + a.radius,
            Math.min(this.maxZ - a.radius, a.pos.z)
        );
    }

    step(deltaTime?: number) {
        const dt = this.getSafeDeltaTime(deltaTime);

        this.buildGrid();

        // ===== VELOCITY =====
        for (let i = 0; i < this.agents.length; i++) {
            const a = this.agents[i];

            if (a.locked) continue;

            let vx = a.prefVel.x;
            let vz = a.prefVel.z;

            const neighbors = this.getNeighbors(a);

            // ===== agent-agent avoidance =====
            for (let j = 0; j < neighbors.length; j++) {
                const b = neighbors[j];
                const dx = a.pos.x - b.pos.x;
                const dz = a.pos.z - b.pos.z;

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

            // ===== circle obstacle velocity avoidance =====
            for (let j = 0; j < this.circleObs.length; j++) {
                const ob = this.circleObs[j];
                const dx = a.pos.x - ob.x;
                const dz = a.pos.z - ob.z;

                const dist = Math.sqrt(dx * dx + dz * dz);
                const minDist = a.radius + ob.r;

                if (dist < minDist && dist > 0.0001) {
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
            }

            // ===== rect obstacle velocity avoidance =====
            for (let j = 0; j < this.rectObs.length; j++) {
                const ob = this.rectObs[j];
                const dx = a.pos.x - ob.x;
                const dz = a.pos.z - ob.z;

                const lx = dx * ob.cos + dz * ob.sin;
                const lz = -dx * ob.sin + dz * ob.cos;

                const px = this.clamp(lx, -ob.hx, ob.hx);
                const pz = this.clamp(lz, -ob.hz, ob.hz);

                const ox = lx - px;
                const oz = lz - pz;

                const distSq = ox * ox + oz * oz;

                // Agent center ở ngoài rect
                if (distSq > 1e-8) {
                    if (distSq < a.radius * a.radius) {
                        const dist = Math.sqrt(distSq);

                        const nxL = ox / dist;
                        const nzL = oz / dist;

                        const nx = nxL * ob.cos - nzL * ob.sin;
                        const nz = nxL * ob.sin + nzL * ob.cos;

                        vx += nx * (a.radius - dist) * 2;
                        vz += nz * (a.radius - dist) * 2;

                        const dot = vx * nx + vz * nz;

                        if (dot < 0) {
                            vx -= nx * dot;
                            vz -= nz * dot;
                        }
                    }
                }
                // Agent center đã ở trong rect
                else {
                    const dLeft = lx + ob.hx;
                    const dRight = ob.hx - lx;
                    const dBottom = lz + ob.hz;
                    const dTop = ob.hz - lz;

                    let nxL = -1;
                    let nzL = 0;
                    let minD = dLeft;

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

                    const nx = nxL * ob.cos - nzL * ob.sin;
                    const nz = nxL * ob.sin + nzL * ob.cos;

                    vx += nx * (a.radius + minD) * 2;
                    vz += nz * (a.radius + minD) * 2;

                    const dot = vx * nx + vz * nz;

                    if (dot < 0) {
                        vx -= nx * dot;
                        vz -= nz * dot;
                    }
                }
            }

            a.vel.x = vx;
            a.vel.z = vz;

            this.applyAllyOvertake(a);

            vx = a.vel.x;
            vz = a.vel.z;

            const speed = Math.sqrt(vx * vx + vz * vz);

            if (speed > a.maxSpeed) {
                vx = (vx / speed) * a.maxSpeed;
                vz = (vz / speed) * a.maxSpeed;
            }

            a.vel.x = vx;
            a.vel.z = vz;
        }

        // ===== MOVE =====
        for (let i = 0; i < this.agents.length; i++) {
            const a = this.agents[i];

            if (!a.locked) {
                a.pos.x += a.vel.x * dt;
                a.pos.z += a.vel.z * dt;

                // Chống xuyên obstacle sau khi di chuyển.
                for (let i = 0; i < this.obstacleSolveIterations; i++) {
                    this.pushAgentOutOfObstacles(a);
                }
            }

            this.clampToBattlefield(a);
        }

        this.buildGrid();

        // ===== HARD SEPARATION: AGENT-AGENT =====
        for (let i = 0; i < this.agents.length; i++) {
            const a = this.agents[i];
            const neighbors = this.getNeighbors(a); 

            for (let j = 0; j < neighbors.length; j++) {
                const b = neighbors[j];
                const dx = b.pos.x - a.pos.x;
                const dz = b.pos.z - a.pos.z;

                const distSq = dx * dx + dz * dz;
                const minDist = a.radius + b.radius;

                if (distSq < 0.0001) continue;

                if (distSq < minDist * minDist) {
                    const dist = Math.sqrt(distSq);
                    const overlap = minDist - dist;

                    const nx = dx / dist;
                    const nz = dz / dist;

                    const aMovable = !a.locked;
                    const bMovable = !b.locked;

                    if (aMovable && bMovable) {
                        const half = overlap * 0.5;

                        a.pos.x -= nx * half;
                        a.pos.z -= nz * half;

                        b.pos.x += nx * half;
                        b.pos.z += nz * half;
                    } else if (aMovable && !bMovable) {
                        a.pos.x -= nx * overlap;
                        a.pos.z -= nz * overlap;
                    } else if (!aMovable && bMovable) {
                        b.pos.x += nx * overlap;
                        b.pos.z += nz * overlap;
                    }
                }
            }
        }

        // ===== HARD SEPARATION: OBSTACLE AGAIN =====
        // Sau agent-agent separation, agent có thể bị đẩy lấn vào obstacle,
        // nên cần solve obstacle thêm lần nữa.
        for (let i = 0; i < this.agents.length; i++) {
            const a = this.agents[i];

            if (a.locked) continue;

            for (let i = 0; i < this.obstacleSolveIterations; i++) {
                this.pushAgentOutOfObstacles(a);
            }

            this.clampToBattlefield(a);
        }

        this.buildGrid();

        return true;
    }
}
