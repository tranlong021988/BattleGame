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
          this.circleData = new Float32Array(0);
          this.rectData = new Float32Array(0);
          this.obstacleDirty = true;
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
          this.pending = true;
          this.rebuildObstacleBuffersIfNeeded();
          const count = this.agents.length;
          const ids = new Int32Array(count); // 18 floats / agent
          // 0 pos.x
          // 1 pos.z
          // 2 vel.x
          // 3 vel.z
          // 4 prefVel.x
          // 5 prefVel.z
          // 6 maxSpeed
          // 7 radius
          // 8 neighborDist
          // 9 forwardX
          // 10 forwardZ
          // 11 overtakeLookAhead
          // 12 overtakeSideRange
          // 13 overtakeSideStrength
          // 14 overtakeSpeedDiff
          // 15 overtakeSeed
          // 16 team
          // 17 onForward

          const floats = new Float32Array(count * 18); // 3 ints / agent
          // 0 maxNeighbors
          // 1 locked
          // 2 enableAllyOvertake

          const ints = new Int32Array(count * 3);

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

          const circleData = this.circleData.slice();
          const rectData = this.rectData.slice();
          this.worker.postMessage({
            type: 'step',
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
            maxZ: this.maxZ,
            circleData,
            rectData
          }, [ids.buffer, floats.buffer, ints.buffer, circleData.buffer, rectData.buffer]);
        }

        rebuildObstacleBuffersIfNeeded() {
          if (!this.obstacleDirty) return;
          this.circleData = new Float32Array(this.circleObs.length * 3);

          for (let i = 0; i < this.circleObs.length; i++) {
            const ob = this.circleObs[i];
            const k = i * 3;
            this.circleData[k + 0] = ob.x;
            this.circleData[k + 1] = ob.z;
            this.circleData[k + 2] = ob.r;
          }

          this.rectData = new Float32Array(this.rectObs.length * 6);

          for (let i = 0; i < this.rectObs.length; i++) {
            const ob = this.rectObs[i];
            const k = i * 6;
            this.rectData[k + 0] = ob.x;
            this.rectData[k + 1] = ob.z;
            this.rectData[k + 2] = ob.hx;
            this.rectData[k + 3] = ob.hz;
            this.rectData[k + 4] = ob.cos;
            this.rectData[k + 5] = ob.sin;
          }

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
              return;
            }

            if (data.type === 'result') {
              this.pending = false;
              this.applyWorkerResult(data.ids, data.result);
            }
          };

          this.worker.onerror = err => {
            console.error('[RVOWorkerSimulator] Worker error:', err);
            this.pending = false;
          };
        }

        applyWorkerResult(ids, result) {
          for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const a = this.agentMap.get(id);
            if (!a) continue;
            const k = i * 4;
            a.pos.x = result[k + 0];
            a.pos.z = result[k + 1];
            a.vel.x = result[k + 2];
            a.vel.z = result[k + 3];
          }
        }

        static workerSource() {
          return `
const grid = new Map();

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function key(gx, gz) {
    return gx + "_" + gz;
}

function buildGrid(agents, cellSize) {
    grid.clear();

    for (let i = 0; i < agents.length; i++) {
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

function getNeighbors(a) {
    const result = [];
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

                result.push({
                    agent: b,
                    distSq: d
                });
            }
        }
    }

    result.sort((a, b) => a.distSq - b.distSq);

    const out = [];
    const count = Math.min(a.maxNeighbors, result.length);

    for (let i = 0; i < count; i++) {
        out.push(result[i].agent);
    }

    return out;
}

function unpackAgents(ids, floats, ints, count) {
    const agents = new Array(count);

    for (let i = 0; i < count; i++) {
        const fi = i * 18;
        const ii = i * 3;

        agents[i] = {
            id: ids[i],

            x: floats[fi + 0],
            z: floats[fi + 1],

            vx: floats[fi + 2],
            vz: floats[fi + 3],

            prefX: floats[fi + 4],
            prefZ: floats[fi + 5],

            maxSpeed: floats[fi + 6],
            radius: floats[fi + 7],
            neighborDist: floats[fi + 8],

            forwardX: floats[fi + 9],
            forwardZ: floats[fi + 10],

            overtakeLookAhead: floats[fi + 11],
            overtakeSideRange: floats[fi + 12],
            overtakeSideStrength: floats[fi + 13],
            overtakeSpeedDiff: floats[fi + 14],
            overtakeSeed: floats[fi + 15],

            team: floats[fi + 16],
            onForward: floats[fi + 17],

            maxNeighbors: ints[ii + 0],
            locked: ints[ii + 1] === 1,
            enableAllyOvertake: ints[ii + 2] === 1,

            gridX: 0,
            gridZ: 0
        };
    }

    return agents;
}

function unpackCircles(data) {
    const count = data.length / 3;
    const circles = new Array(count);

    for (let i = 0; i < count; i++) {
        const k = i * 3;

        circles[i] = {
            x: data[k + 0],
            z: data[k + 1],
            r: data[k + 2]
        };
    }

    return circles;
}

function unpackRects(data) {
    const count = data.length / 6;
    const rects = new Array(count);

    for (let i = 0; i < count; i++) {
        const k = i * 6;

        rects[i] = {
            x: data[k + 0],
            z: data[k + 1],
            hx: data[k + 2],
            hz: data[k + 3],
            cos: data[k + 4],
            sin: data[k + 5]
        };
    }

    return rects;
}

function pushAgentOutOfCircle(a, ob) {
    const dx = a.x - ob.x;
    const dz = a.z - ob.z;

    const distSq = dx * dx + dz * dz;
    const minDist = a.radius + ob.r;

    if (distSq >= minDist * minDist) return;

    if (distSq < 1e-8) {
        a.x = ob.x + minDist + 0.001;
        a.z = ob.z;
        return;
    }

    const dist = Math.sqrt(distSq);
    const nx = dx / dist;
    const nz = dz / dist;

    const push = minDist - dist + 0.001;

    a.x += nx * push;
    a.z += nz * push;
}

function pushAgentOutOfRect(a, ob) {
    const dx = a.x - ob.x;
    const dz = a.z - ob.z;

    const lx = dx * ob.cos + dz * ob.sin;
    const lz = -dx * ob.sin + dz * ob.cos;

    const px = clamp(lx, -ob.hx, ob.hx);
    const pz = clamp(lz, -ob.hz, ob.hz);

    const ox = lx - px;
    const oz = lz - pz;

    const distSq = ox * ox + oz * oz;

    let nxL = 0;
    let nzL = 0;
    let push = 0;

    if (distSq > 1e-8) {
        const dist = Math.sqrt(distSq);

        if (dist >= a.radius) return;

        nxL = ox / dist;
        nzL = oz / dist;
        push = a.radius - dist + 0.001;
    } else {
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

        push = minD + a.radius + 0.001;
    }

    const nx = nxL * ob.cos - nzL * ob.sin;
    const nz = nxL * ob.sin + nzL * ob.cos;

    a.x += nx * push;
    a.z += nz * push;
}

function pushAgentOutOfObstacles(a, circles, rects) {
    for (let i = 0; i < circles.length; i++) {
        pushAgentOutOfCircle(a, circles[i]);
    }

    for (let i = 0; i < rects.length; i++) {
        pushAgentOutOfRect(a, rects[i]);
    }
}

function applyAllyOvertake(a, agents) {
    if (!a.enableAllyOvertake) return;
    if (a.locked) return;
    if (a.onForward !== 1) return;

    let best = null;
    let bestForwardDist = Infinity;

    const lookAhead = a.overtakeLookAhead;
    const sideRange = a.overtakeSideRange;

    for (let i = 0; i < agents.length; i++) {
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

function applyVelocityAvoidance(agents, circles, rects) {
    buildGrid(agents, currentStepData.cellSize);

    for (let i = 0; i < agents.length; i++) {
        const a = agents[i];

        if (a.locked) continue;

        let vx = a.prefX;
        let vz = a.prefZ;

        const neighbors = getNeighbors(a);

        for (let j = 0; j < neighbors.length; j++) {
            const b = neighbors[j];

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

        applyAllyOvertake(a, agents);

        const speed = Math.sqrt(a.vx * a.vx + a.vz * a.vz);

        if (speed > a.maxSpeed) {
            a.vx = (a.vx / speed) * a.maxSpeed;
            a.vz = (a.vz / speed) * a.maxSpeed;
        }
    }
}

function moveAgents(agents, circles, rects, data) {
    for (let i = 0; i < agents.length; i++) {
        const a = agents[i];

        if (!a.locked) {
            a.x += a.vx * data.timeStep;
            a.z += a.vz * data.timeStep;

            for (let k = 0; k < 3; k++) {
                pushAgentOutOfObstacles(a, circles, rects);
            }
        }

        if (data.useBounds === 1) {
            a.x = clamp(a.x, data.minX + a.radius, data.maxX - a.radius);
            a.z = clamp(a.z, data.minZ + a.radius, data.maxZ - a.radius);
        }
    }
}

function hardSeparateAgents(agents) {
    buildGrid(agents, currentStepData.cellSize);

    for (let i = 0; i < agents.length; i++) {
        const a = agents[i];
        const neighbors = getNeighbors(a);

        for (let j = 0; j < neighbors.length; j++) {
            const b = neighbors[j];

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
}

function solveObstaclesAgain(agents, circles, rects, data) {
    for (let i = 0; i < agents.length; i++) {
        const a = agents[i];

        if (a.locked) continue;

        for (let k = 0; k < 3; k++) {
            pushAgentOutOfObstacles(a, circles, rects);
        }

        if (data.useBounds === 1) {
            a.x = clamp(a.x, data.minX + a.radius, data.maxX - a.radius);
            a.z = clamp(a.z, data.minZ + a.radius, data.maxZ - a.radius);
        }
    }
}

function packResult(agents) {
    const result = new Float32Array(agents.length * 4);

    for (let i = 0; i < agents.length; i++) {
        const a = agents[i];
        const k = i * 4;

        result[k + 0] = a.x;
        result[k + 1] = a.z;
        result[k + 2] = a.vx;
        result[k + 3] = a.vz;
    }

    return result;
}

let currentStepData = null;

function step(data) {
    currentStepData = data;

    const agents = unpackAgents(
        data.ids,
        data.floats,
        data.ints,
        data.count
    );

    const circles = unpackCircles(data.circleData);
    const rects = unpackRects(data.rectData);

    applyVelocityAvoidance(agents, circles, rects);
    moveAgents(agents, circles, rects, data);
    hardSeparateAgents(agents);
    solveObstaclesAgain(agents, circles, rects, data);

    const result = packResult(agents);

    self.postMessage({
        type: 'result',
        ids: data.ids,
        result
    }, [
        data.ids.buffer,
        result.buffer
    ]);

    currentStepData = null;
}

self.onmessage = function(event) {
    const data = event.data;

    if (!data) return;

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