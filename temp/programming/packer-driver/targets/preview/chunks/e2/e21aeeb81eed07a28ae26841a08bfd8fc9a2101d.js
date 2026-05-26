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
          var a = new RVOWorkerAgent(this.nextAgentId++, x, z);
          this.agents.push(a);
          this.agentMap.set(a.id, a);
          return a;
        }

        removeAgent(a) {
          var idx = this.agents.indexOf(a);

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
          var count = this.agents.length;
          var ids = new Int32Array(count); // 18 floats / agent
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

          var floats = new Float32Array(count * 18); // 3 ints / agent
          // 0 maxNeighbors
          // 1 locked
          // 2 enableAllyOvertake

          var ints = new Int32Array(count * 3);

          for (var i = 0; i < count; i++) {
            var a = this.agents[i];
            ids[i] = a.id;
            var fi = i * 18;
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
            var ii = i * 3;
            ints[ii + 0] = a.maxNeighbors;
            ints[ii + 1] = a.locked ? 1 : 0;
            ints[ii + 2] = a.enableAllyOvertake ? 1 : 0;
          }

          var circleData = this.circleData.slice();
          var rectData = this.rectData.slice();
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

          for (var i = 0; i < this.circleObs.length; i++) {
            var ob = this.circleObs[i];
            var k = i * 3;
            this.circleData[k + 0] = ob.x;
            this.circleData[k + 1] = ob.z;
            this.circleData[k + 2] = ob.r;
          }

          this.rectData = new Float32Array(this.rectObs.length * 6);

          for (var _i = 0; _i < this.rectObs.length; _i++) {
            var _ob = this.rectObs[_i];

            var _k = _i * 6;

            this.rectData[_k + 0] = _ob.x;
            this.rectData[_k + 1] = _ob.z;
            this.rectData[_k + 2] = _ob.hx;
            this.rectData[_k + 3] = _ob.hz;
            this.rectData[_k + 4] = _ob.cos;
            this.rectData[_k + 5] = _ob.sin;
          }

          this.obstacleDirty = false;
        }

        createWorker() {
          if (!RVOWorkerSimulator.isSupported()) {
            console.warn('[RVOWorkerSimulator] Worker is not supported.');
            return;
          }

          var blob = new Blob([RVOWorkerSimulator.workerSource()], {
            type: 'application/javascript'
          });
          var url = URL.createObjectURL(blob);
          this.worker = new Worker(url);
          URL.revokeObjectURL(url);

          this.worker.onmessage = event => {
            var data = event.data;
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
          for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            var a = this.agentMap.get(id);
            if (!a) continue;
            var k = i * 4;
            a.pos.x = result[k + 0];
            a.pos.z = result[k + 1];
            a.vel.x = result[k + 2];
            a.vel.z = result[k + 3];
          }
        }

        static workerSource() {
          return "\nconst grid = new Map();\n\nfunction clamp(v, min, max) {\n    return Math.max(min, Math.min(max, v));\n}\n\nfunction key(gx, gz) {\n    return gx + \"_\" + gz;\n}\n\nfunction buildGrid(agents, cellSize) {\n    grid.clear();\n\n    for (let i = 0; i < agents.length; i++) {\n        const a = agents[i];\n\n        a.gridX = Math.floor(a.x / cellSize);\n        a.gridZ = Math.floor(a.z / cellSize);\n\n        const k = key(a.gridX, a.gridZ);\n        let cell = grid.get(k);\n\n        if (!cell) {\n            cell = [];\n            grid.set(k, cell);\n        }\n\n        cell.push(a);\n    }\n}\n\nfunction getNeighbors(a) {\n    const result = [];\n    const maxDistSq = a.neighborDist * a.neighborDist;\n\n    for (let x = -1; x <= 1; x++) {\n        for (let z = -1; z <= 1; z++) {\n            const cell = grid.get(key(a.gridX + x, a.gridZ + z));\n\n            if (!cell) continue;\n\n            for (let i = 0; i < cell.length; i++) {\n                const b = cell[i];\n\n                if (b === a) continue;\n\n                const dx = b.x - a.x;\n                const dz = b.z - a.z;\n                const d = dx * dx + dz * dz;\n\n                if (d > maxDistSq) continue;\n\n                result.push({\n                    agent: b,\n                    distSq: d\n                });\n            }\n        }\n    }\n\n    result.sort((a, b) => a.distSq - b.distSq);\n\n    const out = [];\n    const count = Math.min(a.maxNeighbors, result.length);\n\n    for (let i = 0; i < count; i++) {\n        out.push(result[i].agent);\n    }\n\n    return out;\n}\n\nfunction unpackAgents(ids, floats, ints, count) {\n    const agents = new Array(count);\n\n    for (let i = 0; i < count; i++) {\n        const fi = i * 18;\n        const ii = i * 3;\n\n        agents[i] = {\n            id: ids[i],\n\n            x: floats[fi + 0],\n            z: floats[fi + 1],\n\n            vx: floats[fi + 2],\n            vz: floats[fi + 3],\n\n            prefX: floats[fi + 4],\n            prefZ: floats[fi + 5],\n\n            maxSpeed: floats[fi + 6],\n            radius: floats[fi + 7],\n            neighborDist: floats[fi + 8],\n\n            forwardX: floats[fi + 9],\n            forwardZ: floats[fi + 10],\n\n            overtakeLookAhead: floats[fi + 11],\n            overtakeSideRange: floats[fi + 12],\n            overtakeSideStrength: floats[fi + 13],\n            overtakeSpeedDiff: floats[fi + 14],\n            overtakeSeed: floats[fi + 15],\n\n            team: floats[fi + 16],\n            onForward: floats[fi + 17],\n\n            maxNeighbors: ints[ii + 0],\n            locked: ints[ii + 1] === 1,\n            enableAllyOvertake: ints[ii + 2] === 1,\n\n            gridX: 0,\n            gridZ: 0\n        };\n    }\n\n    return agents;\n}\n\nfunction unpackCircles(data) {\n    const count = data.length / 3;\n    const circles = new Array(count);\n\n    for (let i = 0; i < count; i++) {\n        const k = i * 3;\n\n        circles[i] = {\n            x: data[k + 0],\n            z: data[k + 1],\n            r: data[k + 2]\n        };\n    }\n\n    return circles;\n}\n\nfunction unpackRects(data) {\n    const count = data.length / 6;\n    const rects = new Array(count);\n\n    for (let i = 0; i < count; i++) {\n        const k = i * 6;\n\n        rects[i] = {\n            x: data[k + 0],\n            z: data[k + 1],\n            hx: data[k + 2],\n            hz: data[k + 3],\n            cos: data[k + 4],\n            sin: data[k + 5]\n        };\n    }\n\n    return rects;\n}\n\nfunction pushAgentOutOfCircle(a, ob) {\n    const dx = a.x - ob.x;\n    const dz = a.z - ob.z;\n\n    const distSq = dx * dx + dz * dz;\n    const minDist = a.radius + ob.r;\n\n    if (distSq >= minDist * minDist) return;\n\n    if (distSq < 1e-8) {\n        a.x = ob.x + minDist + 0.001;\n        a.z = ob.z;\n        return;\n    }\n\n    const dist = Math.sqrt(distSq);\n    const nx = dx / dist;\n    const nz = dz / dist;\n\n    const push = minDist - dist + 0.001;\n\n    a.x += nx * push;\n    a.z += nz * push;\n}\n\nfunction pushAgentOutOfRect(a, ob) {\n    const dx = a.x - ob.x;\n    const dz = a.z - ob.z;\n\n    const lx = dx * ob.cos + dz * ob.sin;\n    const lz = -dx * ob.sin + dz * ob.cos;\n\n    const px = clamp(lx, -ob.hx, ob.hx);\n    const pz = clamp(lz, -ob.hz, ob.hz);\n\n    const ox = lx - px;\n    const oz = lz - pz;\n\n    const distSq = ox * ox + oz * oz;\n\n    let nxL = 0;\n    let nzL = 0;\n    let push = 0;\n\n    if (distSq > 1e-8) {\n        const dist = Math.sqrt(distSq);\n\n        if (dist >= a.radius) return;\n\n        nxL = ox / dist;\n        nzL = oz / dist;\n        push = a.radius - dist + 0.001;\n    } else {\n        const dLeft = lx + ob.hx;\n        const dRight = ob.hx - lx;\n        const dBottom = lz + ob.hz;\n        const dTop = ob.hz - lz;\n\n        let minD = dLeft;\n        nxL = -1;\n        nzL = 0;\n\n        if (dRight < minD) {\n            minD = dRight;\n            nxL = 1;\n            nzL = 0;\n        }\n\n        if (dBottom < minD) {\n            minD = dBottom;\n            nxL = 0;\n            nzL = -1;\n        }\n\n        if (dTop < minD) {\n            minD = dTop;\n            nxL = 0;\n            nzL = 1;\n        }\n\n        push = minD + a.radius + 0.001;\n    }\n\n    const nx = nxL * ob.cos - nzL * ob.sin;\n    const nz = nxL * ob.sin + nzL * ob.cos;\n\n    a.x += nx * push;\n    a.z += nz * push;\n}\n\nfunction pushAgentOutOfObstacles(a, circles, rects) {\n    for (let i = 0; i < circles.length; i++) {\n        pushAgentOutOfCircle(a, circles[i]);\n    }\n\n    for (let i = 0; i < rects.length; i++) {\n        pushAgentOutOfRect(a, rects[i]);\n    }\n}\n\nfunction applyAllyOvertake(a, agents) {\n    if (!a.enableAllyOvertake) return;\n    if (a.locked) return;\n    if (a.onForward !== 1) return;\n\n    let best = null;\n    let bestForwardDist = Infinity;\n\n    const lookAhead = a.overtakeLookAhead;\n    const sideRange = a.overtakeSideRange;\n\n    for (let i = 0; i < agents.length; i++) {\n        const b = agents[i];\n\n        if (b === a) continue;\n        if (b.locked) continue;\n        if (b.team !== a.team) continue;\n        if (b.onForward !== 1) continue;\n\n        if (a.maxSpeed <= b.maxSpeed + a.overtakeSpeedDiff) {\n            continue;\n        }\n\n        const dx = b.x - a.x;\n        const dz = b.z - a.z;\n\n        const forwardDist =\n            dx * a.forwardX +\n            dz * a.forwardZ;\n\n        if (forwardDist <= 0) continue;\n        if (forwardDist > lookAhead) continue;\n\n        const sideDist =\n            dx * a.forwardZ -\n            dz * a.forwardX;\n\n        if (Math.abs(sideDist) > sideRange) continue;\n\n        if (forwardDist < bestForwardDist) {\n            bestForwardDist = forwardDist;\n            best = b;\n        }\n    }\n\n    if (!best) return;\n\n    const dx = a.x - best.x;\n    const dz = a.z - best.z;\n\n    let side =\n        dx * a.forwardZ -\n        dz * a.forwardX;\n\n    if (Math.abs(side) > 0.05) {\n        side = side >= 0 ? 1 : -1;\n    } else {\n        side = a.overtakeSeed >= 0 ? 1 : -1;\n    }\n\n    const sideX = a.forwardZ * side;\n    const sideZ = -a.forwardX * side;\n\n    a.vx += sideX * a.maxSpeed * a.overtakeSideStrength;\n    a.vz += sideZ * a.maxSpeed * a.overtakeSideStrength;\n\n    const speed = Math.sqrt(a.vx * a.vx + a.vz * a.vz);\n\n    if (speed > a.maxSpeed) {\n        a.vx = (a.vx / speed) * a.maxSpeed;\n        a.vz = (a.vz / speed) * a.maxSpeed;\n    }\n}\n\nfunction applyVelocityAvoidance(agents, circles, rects) {\n    buildGrid(agents, currentStepData.cellSize);\n\n    for (let i = 0; i < agents.length; i++) {\n        const a = agents[i];\n\n        if (a.locked) continue;\n\n        let vx = a.prefX;\n        let vz = a.prefZ;\n\n        const neighbors = getNeighbors(a);\n\n        for (let j = 0; j < neighbors.length; j++) {\n            const b = neighbors[j];\n\n            const dx = a.x - b.x;\n            const dz = a.z - b.z;\n\n            const distSq = dx * dx + dz * dz;\n            const minDist = a.radius + b.radius;\n\n            if (distSq < 0.0001) continue;\n\n            if (distSq < minDist * minDist) {\n                const dist = Math.sqrt(distSq);\n\n                const nx = dx / dist;\n                const nz = dz / dist;\n\n                const push = minDist - dist;\n\n                vx += nx * push * 2;\n                vz += nz * push * 2;\n\n                const dot = vx * nx + vz * nz;\n\n                if (dot < 0) {\n                    vx -= nx * dot;\n                    vz -= nz * dot;\n                }\n            }\n        }\n\n        a.vx = vx;\n        a.vz = vz;\n\n        applyAllyOvertake(a, agents);\n\n        const speed = Math.sqrt(a.vx * a.vx + a.vz * a.vz);\n\n        if (speed > a.maxSpeed) {\n            a.vx = (a.vx / speed) * a.maxSpeed;\n            a.vz = (a.vz / speed) * a.maxSpeed;\n        }\n    }\n}\n\nfunction moveAgents(agents, circles, rects, data) {\n    for (let i = 0; i < agents.length; i++) {\n        const a = agents[i];\n\n        if (!a.locked) {\n            a.x += a.vx * data.timeStep;\n            a.z += a.vz * data.timeStep;\n\n            for (let k = 0; k < 3; k++) {\n                pushAgentOutOfObstacles(a, circles, rects);\n            }\n        }\n\n        if (data.useBounds === 1) {\n            a.x = clamp(a.x, data.minX + a.radius, data.maxX - a.radius);\n            a.z = clamp(a.z, data.minZ + a.radius, data.maxZ - a.radius);\n        }\n    }\n}\n\nfunction hardSeparateAgents(agents) {\n    buildGrid(agents, currentStepData.cellSize);\n\n    for (let i = 0; i < agents.length; i++) {\n        const a = agents[i];\n        const neighbors = getNeighbors(a);\n\n        for (let j = 0; j < neighbors.length; j++) {\n            const b = neighbors[j];\n\n            const dx = b.x - a.x;\n            const dz = b.z - a.z;\n\n            const distSq = dx * dx + dz * dz;\n            const minDist = a.radius + b.radius;\n\n            if (distSq < 0.0001) continue;\n            if (distSq >= minDist * minDist) continue;\n\n            const dist = Math.sqrt(distSq);\n            const overlap = minDist - dist;\n\n            const nx = dx / dist;\n            const nz = dz / dist;\n\n            const aMovable = !a.locked;\n            const bMovable = !b.locked;\n\n            if (aMovable && bMovable) {\n                const half = overlap * 0.5;\n\n                a.x -= nx * half;\n                a.z -= nz * half;\n\n                b.x += nx * half;\n                b.z += nz * half;\n            } else if (aMovable && !bMovable) {\n                a.x -= nx * overlap;\n                a.z -= nz * overlap;\n            } else if (!aMovable && bMovable) {\n                b.x += nx * overlap;\n                b.z += nz * overlap;\n            }\n        }\n    }\n}\n\nfunction solveObstaclesAgain(agents, circles, rects, data) {\n    for (let i = 0; i < agents.length; i++) {\n        const a = agents[i];\n\n        if (a.locked) continue;\n\n        for (let k = 0; k < 3; k++) {\n            pushAgentOutOfObstacles(a, circles, rects);\n        }\n\n        if (data.useBounds === 1) {\n            a.x = clamp(a.x, data.minX + a.radius, data.maxX - a.radius);\n            a.z = clamp(a.z, data.minZ + a.radius, data.maxZ - a.radius);\n        }\n    }\n}\n\nfunction packResult(agents) {\n    const result = new Float32Array(agents.length * 4);\n\n    for (let i = 0; i < agents.length; i++) {\n        const a = agents[i];\n        const k = i * 4;\n\n        result[k + 0] = a.x;\n        result[k + 1] = a.z;\n        result[k + 2] = a.vx;\n        result[k + 3] = a.vz;\n    }\n\n    return result;\n}\n\nlet currentStepData = null;\n\nfunction step(data) {\n    currentStepData = data;\n\n    const agents = unpackAgents(\n        data.ids,\n        data.floats,\n        data.ints,\n        data.count\n    );\n\n    const circles = unpackCircles(data.circleData);\n    const rects = unpackRects(data.rectData);\n\n    applyVelocityAvoidance(agents, circles, rects);\n    moveAgents(agents, circles, rects, data);\n    hardSeparateAgents(agents);\n    solveObstaclesAgain(agents, circles, rects, data);\n\n    const result = packResult(agents);\n\n    self.postMessage({\n        type: 'result',\n        ids: data.ids,\n        result\n    }, [\n        data.ids.buffer,\n        result.buffer\n    ]);\n\n    currentStepData = null;\n}\n\nself.onmessage = function(event) {\n    const data = event.data;\n\n    if (!data) return;\n\n    if (data.type === 'step') {\n        step(data);\n    }\n};\n\nself.postMessage({ type: 'ready' });\n";
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e21aeeb81eed07a28ae26841a08bfd8fc9a2101d.js.map