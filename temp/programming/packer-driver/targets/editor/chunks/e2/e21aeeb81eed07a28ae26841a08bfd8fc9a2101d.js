System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, RVOWorkerAgent, RVOWorkerSimulator, _crd;

  _export({
    RVOWorkerAgent: void 0,
    RVOWorkerSimulator: void 0
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fb8a1hJN1lN+6xC+VfOamSr", "RVOWorkerSimulator", undefined);

      _export("RVOWorkerAgent", RVOWorkerAgent = class RVOWorkerAgent {
        constructor(id, x, z) {
          this.id = 0;
          this.pos = {
            x: 0,
            z: 0
          };
          this.vel = {
            x: 0,
            z: 0
          };
          this.prefVel = {
            x: 0,
            z: 0
          };
          this.maxSpeed = 2;
          this.radius = 0.5;
          this.neighborDist = 2.4;
          this.maxNeighbors = 8;
          this.locked = false;
          this.team = -1;
          this.onForward = 0;
          this.forwardX = 0;
          this.forwardZ = 1;
          this.enableAllyOvertake = 0;
          this.overtakeLookAhead = 2.2;
          this.overtakeSideRange = 1.2;
          this.overtakeSideStrength = 0.75;
          this.overtakeSpeedDiff = 0.15;
          this.overtakeSeed = 1;
          this.id = id;
          this.pos.x = x;
          this.pos.z = z;
        }

      });

      _export("RVOWorkerSimulator", RVOWorkerSimulator = class RVOWorkerSimulator {
        static isSupported() {
          return typeof Worker !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined' && !!URL.createObjectURL;
        }

        constructor() {
          this.agents = [];
          this.circleObs = [];
          this.rectObs = [];
          this.cellSize = 2.2;
          this.timeStep = 1 / 60;
          this.useBounds = false;
          this.minX = -99999;
          this.maxX = 99999;
          this.minZ = -99999;
          this.maxZ = 99999;
          this.worker = null;
          this.workerReady = false;
          this.pending = false;
          this.nextAgentId = 1;
          this.agentMap = new Map();
          this.idsBuffer = null;
          this.floatsBuffer = null;
          this.intsBuffer = null;
          this.bufferCapacity = 0;
          this.obstacleDirty = true;
          this.sequence = 0;
          this.createWorker();
        }

        destroy() {
          if (this.worker) {
            this.worker.terminate();
            this.worker = null;
          }

          this.workerReady = false;
          this.pending = false;
          this.agentMap.clear();
          this.agents.length = 0;
          this.idsBuffer = null;
          this.floatsBuffer = null;
          this.intsBuffer = null;
          this.bufferCapacity = 0;
        }

        setBattlefield(minX, maxX, minZ, maxZ) {
          this.useBounds = true;
          this.minX = minX;
          this.maxX = maxX;
          this.minZ = minZ;
          this.maxZ = maxZ;
        }

        addAgent(x, z) {
          const a = new RVOWorkerAgent(this.nextAgentId++, x, z);
          this.agents.push(a);
          this.agentMap.set(a.id, a);
          return a;
        }

        removeAgent(a) {
          const idx = this.agents.indexOf(a);

          if (idx >= 0) {
            this.agents.splice(idx, 1);
          }

          this.agentMap.delete(a.id);
        }

        setPrefVelocity(a, vx, vz) {
          a.prefVel.x = vx;
          a.prefVel.z = vz;
        }

        addCircleObstacle(x, z, r) {
          this.circleObs.push({
            x,
            z,
            r
          });
          this.obstacleDirty = true;
        }

        addRectObstacle(x, z, hx, hz, angle) {
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

        step() {
          if (!this.worker || !this.workerReady) return;
          if (this.pending) return;
          if (this.agents.length <= 0) return;

          if (this.obstacleDirty) {
            this.sendObstaclesToWorker();
          }

          const count = this.agents.length;
          this.ensureBuffers(count);
          if (!this.idsBuffer || !this.floatsBuffer || !this.intsBuffer) return;
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
            const ii = i * 3;
            ints[ii + 0] = a.maxNeighbors;
            ints[ii + 1] = a.locked ? 1 : 0;
            ints[ii + 2] = a.enableAllyOvertake ? 1 : 0;
          }

          this.pending = true;
          this.sequence++;
          this.worker.postMessage({
            type: 'step',
            sequence: this.sequence,
            ids,
            floats,
            ints,
            count,
            cellSize: this.cellSize,
            timeStep: this.timeStep,
            useBounds: this.useBounds ? 1 : 0,
            minX: this.minX,
            maxX: this.maxX,
            minZ: this.minZ,
            maxZ: this.maxZ
          }, [ids.buffer, floats.buffer, ints.buffer]); // Sau transfer, buffer bị detach.
          // Sẽ được gán lại khi Worker trả kết quả.

          this.idsBuffer = null;
          this.floatsBuffer = null;
          this.intsBuffer = null;
        }

        ensureBuffers(count) {
          if (this.bufferCapacity >= count && this.idsBuffer && this.floatsBuffer && this.intsBuffer) {
            return;
          }

          this.bufferCapacity = Math.max(count, this.bufferCapacity * 2, 64);
          this.idsBuffer = new Int32Array(this.bufferCapacity);
          this.floatsBuffer = new Float32Array(this.bufferCapacity * 18);
          this.intsBuffer = new Int32Array(this.bufferCapacity * 3);
        }

        sendObstaclesToWorker() {
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
          }, [circleData.buffer, rectData.buffer]);
          this.obstacleDirty = false;
        }

        createWorker() {
          if (!RVOWorkerSimulator.isSupported()) {
            console.warn('[RVOWorkerSimulator] Worker is not supported.');
            return;
          }

          const blob = new Blob([RVOWorkerSimulator.workerSource()], {
            type: 'application/javascript'
          });
          const url = URL.createObjectURL(blob);
          this.worker = new Worker(url);
          URL.revokeObjectURL(url);

          this.worker.onmessage = event => {
            const data = event.data;
            if (!data) return;

            if (data.type === 'ready') {
              this.workerReady = true;

              if (this.obstacleDirty) {
                this.sendObstaclesToWorker();
              }

              return;
            }

            if (data.type === 'result') {
              this.pending = false;
              this.idsBuffer = data.ids;
              this.floatsBuffer = data.floats;
              this.intsBuffer = data.ints;
              this.applyWorkerResult(data.ids, data.floats, data.count);
            }
          };

          this.worker.onerror = err => {
            console.error('[RVOWorkerSimulator] Worker error:', err);
            this.pending = false;
          };
        }

        applyWorkerResult(ids, floats, count) {
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

        static workerSource() {
          return `
const grid = new Map();

let circleData = new Float32Array(0);
let rectData = new Float32Array(0);

const agentCache = [];

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function key(gx, gz) {
    return gx + "_" + gz;
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

            forwardX: 0,
            forwardZ: 1,

            overtakeLookAhead: 0,
            overtakeSideRange: 0,
            overtakeSideStrength: 0,
            overtakeSpeedDiff: 0,
            overtakeSeed: 1,

            team: -1,
            onForward: 0,

            maxNeighbors: 0,
            locked: false,
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

        const fi = i * 18;
        const ii = i * 3;

        a.id = ids[i];

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

        a.gridX = 0;
        a.gridZ = 0;
    }

    return agents;
}

function buildGrid(agents, count, cellSize) {
    grid.clear();

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

        cell.push(a);
    }
}

function collectNeighbors(a, result, cellSize) {
    result.length = 0;

    const maxDistSq = a.neighborDist * a.neighborDist;

    for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
            const cell = grid.get(key(a.gridX + x, a.gridZ + z));

            if (!cell) continue;

            for (let i = 0; i < cell.length; i++) {
                const b = cell[i];

                if (b === a) continue;

                const dx = b.x - a.x;
                const dz = b.z - a.z;
                const d = dx * dx + dz * dz;

                if (d > maxDistSq) continue;

                result.push(b);
            }
        }
    }

    result.sort((a, b) => {
        const dxA = a.x - currentNeighborAgent.x;
        const dzA = a.z - currentNeighborAgent.z;
        const dA = dxA * dxA + dzA * dzA;

        const dxB = b.x - currentNeighborAgent.x;
        const dzB = b.z - currentNeighborAgent.z;
        const dB = dxB * dxB + dzB * dzB;

        return dA - dB;
    });

    if (result.length > a.maxNeighbors) {
        result.length = a.maxNeighbors;
    }
}

let currentNeighborAgent = null;
const neighborScratch = [];

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

function applyAllyOvertake(a, agents, count) {
    if (!a.enableAllyOvertake) return;
    if (a.locked) return;
    if (a.onForward !== 1) return;

    let best = null;
    let bestForwardDist = Infinity;

    const lookAhead = a.overtakeLookAhead;
    const sideRange = a.overtakeSideRange;

    for (let i = 0; i < count; i++) {
        const b = agents[i];

        if (b === a) continue;
        if (b.locked) continue;
        if (b.team !== a.team) continue;
        if (b.onForward !== 1) continue;

        if (a.maxSpeed <= b.maxSpeed + a.overtakeSpeedDiff) {
            continue;
        }

        const dx = b.x - a.x;
        const dz = b.z - a.z;

        const forwardDist =
            dx * a.forwardX +
            dz * a.forwardZ;

        if (forwardDist <= 0) continue;
        if (forwardDist > lookAhead) continue;

        const sideDist =
            dx * a.forwardZ -
            dz * a.forwardX;

        if (Math.abs(sideDist) > sideRange) continue;

        if (forwardDist < bestForwardDist) {
            bestForwardDist = forwardDist;
            best = b;
        }
    }

    if (!best) return;

    const dx = a.x - best.x;
    const dz = a.z - best.z;

    let side =
        dx * a.forwardZ -
        dz * a.forwardX;

    if (Math.abs(side) > 0.05) {
        side = side >= 0 ? 1 : -1;
    } else {
        side = a.overtakeSeed >= 0 ? 1 : -1;
    }

    const sideX = a.forwardZ * side;
    const sideZ = -a.forwardX * side;

    a.vx += sideX * a.maxSpeed * a.overtakeSideStrength;
    a.vz += sideZ * a.maxSpeed * a.overtakeSideStrength;

    const speed = Math.sqrt(a.vx * a.vx + a.vz * a.vz);

    if (speed > a.maxSpeed) {
        a.vx = (a.vx / speed) * a.maxSpeed;
        a.vz = (a.vz / speed) * a.maxSpeed;
    }
}

function applyVelocityAvoidance(agents, count, data) {
    buildGrid(agents, count, data.cellSize);

    for (let i = 0; i < count; i++) {
        const a = agents[i];

        if (a.locked) continue;

        let vx = a.prefX;
        let vz = a.prefZ;

        currentNeighborAgent = a;
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

        applyAllyOvertake(a, agents, count);

        const speed = Math.sqrt(a.vx * a.vx + a.vz * a.vz);

        if (speed > a.maxSpeed) {
            a.vx = (a.vx / speed) * a.maxSpeed;
            a.vz = (a.vz / speed) * a.maxSpeed;
        }
    }

    currentNeighborAgent = null;
}

function moveAgents(agents, count, data) {
    for (let i = 0; i < count; i++) {
        const a = agents[i];

        if (!a.locked) {
            a.x += a.vx * data.timeStep;
            a.z += a.vz * data.timeStep;

            for (let k = 0; k < 3; k++) {
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

        currentNeighborAgent = a;
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

            const aMovable = !a.locked;
            const bMovable = !b.locked;

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

    currentNeighborAgent = null;
}

function solveObstaclesAgain(agents, count, data) {
    for (let i = 0; i < count; i++) {
        const a = agents[i];

        if (a.locked) continue;

        for (let k = 0; k < 3; k++) {
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

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e21aeeb81eed07a28ae26841a08bfd8fc9a2101d.js.map