export class RVOAgent {

    pos = { x: 0, z: 0 };
    vel = { x: 0, z: 0 };
    prefVel = { x: 0, z: 0 };

    maxSpeed = 2;
    radius = 0.5;

    locked = false;

    gridX = 0;
    gridZ = 0;

    constructor(x: number, z: number) {
        this.pos.x = x;
        this.pos.z = z;
    }
}

type CircleObstacle = { x: number; z: number; r: number };
type RectObstacle = { x: number; z: number; hx: number; hz: number; cos: number; sin: number };

export class RVOSimulator {

    agents: RVOAgent[] = [];

    circleObs: CircleObstacle[] = [];
    rectObs: RectObstacle[] = [];

    grid: Map<string, RVOAgent[]> = new Map();
    cellSize = 1.5;

    timeStep = 1 / 60;

    stepCount = 0;

    // 1 = ổn định hơn, 2 = nhẹ CPU hơn
    hardSeparationInterval = 1;

    addAgent(x: number, z: number) {
        const a = new RVOAgent(x, z);
        this.agents.push(a);
        return a;
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
            x, z, hx, hz,
            cos: Math.cos(angle),
            sin: Math.sin(angle)
        });
    }

    private buildGrid() {
        this.grid.clear();

        for (let a of this.agents) {

            const gx = Math.floor(a.pos.x / this.cellSize);
            const gz = Math.floor(a.pos.z / this.cellSize);

            a.gridX = gx;
            a.gridZ = gz;

            const key = gx + "_" + gz;

            if (!this.grid.has(key)) {
                this.grid.set(key, []);
            }

            this.grid.get(key)!.push(a);
        }
    }

    getNeighbors(a: RVOAgent) {

        const result: RVOAgent[] = [];

        for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {

                const key = (a.gridX + x) + "_" + (a.gridZ + z);
                const cell = this.grid.get(key);

                if (!cell) continue;

                for (let other of cell) {
                    if (other !== a) {
                        result.push(other);
                    }
                }
            }
        }

        return result;
    }

    step() {

        this.stepCount++;

        this.buildGrid();

        // ===== VELOCITY =====
        for (let a of this.agents) {

            if (a.locked) continue;

            let vx = a.prefVel.x;
            let vz = a.prefVel.z;

            const neighbors = this.getNeighbors(a);

            for (let b of neighbors) {

                const dx = a.pos.x - b.pos.x;
                const dz = a.pos.z - b.pos.z;

                const distSq = dx * dx + dz * dz;
                const minDist = a.radius + b.radius;

                if (distSq < 0.0001) continue;

                if (distSq < minDist * minDist) {

                    const dist = Math.sqrt(distSq);

                    const nx = dx / dist;
                    const nz = dz / dist;

                    const push = (minDist - dist);

                    vx += nx * push * 2;
                    vz += nz * push * 2;

                    const dot = vx * nx + vz * nz;

                    if (dot < 0) {
                        vx -= nx * dot;
                        vz -= nz * dot;
                    }
                }
            }

            // ===== Circle obstacle =====
            for (let ob of this.circleObs) {

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

            // ===== Rect obstacle =====
            for (let ob of this.rectObs) {

                const dx = a.pos.x - ob.x;
                const dz = a.pos.z - ob.z;

                const lx = dx * ob.cos + dz * ob.sin;
                const lz = -dx * ob.sin + dz * ob.cos;

                const ex = ob.hx + a.radius;
                const ez = ob.hz + a.radius;

                if (Math.abs(lx) < ex && Math.abs(lz) < ez) {

                    const penX = ex - Math.abs(lx);
                    const penZ = ez - Math.abs(lz);

                    let nxL = 0;
                    let nzL = 0;

                    if (penX < penZ) {
                        nxL = lx > 0 ? 1 : -1;
                    } else {
                        nzL = lz > 0 ? 1 : -1;
                    }

                    const nx = nxL * ob.cos - nzL * ob.sin;
                    const nz = nxL * ob.sin + nzL * ob.cos;

                    const dot = vx * nx + vz * nz;

                    if (dot < 0) {
                        vx -= nx * dot;
                        vz -= nz * dot;
                    }
                }
            }

            const speed = Math.sqrt(vx * vx + vz * vz);

            if (speed > a.maxSpeed) {
                vx = (vx / speed) * a.maxSpeed;
                vz = (vz / speed) * a.maxSpeed;
            }

            a.vel.x = vx;
            a.vel.z = vz;
        }

        // ===== MOVE =====
        for (let a of this.agents) {

            if (!a.locked) {
                a.pos.x += a.vel.x * this.timeStep;
                a.pos.z += a.vel.z * this.timeStep;
            }
        }

        // ===== HARD SEPARATION =====
        if (this.stepCount % this.hardSeparationInterval === 0) {

            for (let a of this.agents) {

                const neighbors = this.getNeighbors(a);

                for (let b of neighbors) {

                    const dx = b.pos.x - a.pos.x;
                    const dz = b.pos.z - a.pos.z;

                    const distSq = dx * dx + dz * dz;
                    const minDist = a.radius + b.radius;

                    if (distSq < 0.0001) continue;

                    if (distSq < minDist * minDist) {

                        const dist = Math.sqrt(distSq);
                        const overlap = (minDist - dist) * 0.5;

                        const nx = dx / dist;
                        const nz = dz / dist;

                        if (!a.locked) {
                            a.pos.x -= nx * overlap;
                            a.pos.z -= nz * overlap;
                        }

                        if (!b.locked) {
                            b.pos.x += nx * overlap;
                            b.pos.z += nz * overlap;
                        }
                    }
                }
            }
        }

        // ===== RECT COLLISION CORRECTION =====
        for (let a of this.agents) {

            if (a.locked) continue;

            for (let ob of this.rectObs) {

                const dx = a.pos.x - ob.x;
                const dz = a.pos.z - ob.z;

                const lx = dx * ob.cos + dz * ob.sin;
                const lz = -dx * ob.sin + dz * ob.cos;

                const ex = ob.hx + a.radius;
                const ez = ob.hz + a.radius;

                if (Math.abs(lx) < ex && Math.abs(lz) < ez) {

                    const penX = ex - Math.abs(lx);
                    const penZ = ez - Math.abs(lz);

                    let pushX = 0;
                    let pushZ = 0;

                    if (penX < penZ) {
                        pushX = lx > 0 ? penX : -penX;
                    } else {
                        pushZ = lz > 0 ? penZ : -penZ;
                    }

                    const wx = pushX * ob.cos - pushZ * ob.sin;
                    const wz = pushX * ob.sin + pushZ * ob.cos;

                    a.pos.x += wx;
                    a.pos.z += wz;
                }
            }
        }
    }
}