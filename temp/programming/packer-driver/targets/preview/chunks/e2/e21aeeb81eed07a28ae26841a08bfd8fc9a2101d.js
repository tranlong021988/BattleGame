System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, RVOSimulator, RVOWorkerAgent, RVOWorkerSimulator, _crd;

  function _reportPossibleCrUseOfRVOSimulator(extras) {
    _reporterNs.report("RVOSimulator", "./RVO", _context.meta, extras);
  }

  _export({
    RVOWorkerAgent: void 0,
    RVOWorkerSimulator: void 0
  });

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      RVOSimulator = _unresolved_2.RVOSimulator;
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
          this.canBePush = 0;
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
          this.overtakeSideLock = 0;
          this.overtakeHoldFrames = 0;
          this.forwardSlowFrames = 0;
          this.gridX = 0;
          this.gridZ = 0;
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
          this.minStepDeltaTime = 1 / 120;
          this.maxStepDeltaTime = 1 / 20;
          this.obstacleSolveIterations = 3;
          this.useBounds = false;
          this.minX = -99999;
          this.maxX = 99999;
          this.minZ = -99999;
          this.maxZ = 99999;
          this.worker = null;
          this.workerReady = false;
          this.workerCreatedAtMs = 0;
          this.pending = false;
          this.pendingSinceMs = 0;
          this.fallbackSimulator = null;
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

        setBattlefield(minX, maxX, minZ, maxZ) {
          this.useBounds = true;
          this.minX = minX;
          this.maxX = maxX;
          this.minZ = minZ;
          this.maxZ = maxZ;

          if (this.fallbackSimulator) {
            this.fallbackSimulator.setBattlefield(minX, maxX, minZ, maxZ);
          }
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

        getSafeDeltaTime(deltaTime) {
          if (typeof deltaTime !== 'number' || !isFinite(deltaTime) || deltaTime <= 0) {
            return this.timeStep;
          }

          return Math.max(this.minStepDeltaTime, Math.min(this.maxStepDeltaTime, deltaTime));
        }

        step(deltaTime) {
          if (this.fallbackSimulator) {
            this.fallbackSimulator.cellSize = this.cellSize;
            this.fallbackSimulator.timeStep = this.timeStep;
            this.fallbackSimulator.minStepDeltaTime = this.minStepDeltaTime;
            this.fallbackSimulator.maxStepDeltaTime = this.maxStepDeltaTime;
            this.fallbackSimulator.obstacleSolveIterations = this.obstacleSolveIterations;
            return this.fallbackSimulator.step(deltaTime);
          }

          if (!this.worker) return false;

          if (!this.workerReady) {
            if (Date.now() - this.workerCreatedAtMs >= RVOWorkerSimulator.workerResponseTimeoutMs) {
              this.activateMainThreadFallback();
              return this.fallbackSimulator ? this.fallbackSimulator.step(deltaTime) : false;
            }

            return false;
          }

          if (this.pending) {
            if (Date.now() - this.pendingSinceMs >= RVOWorkerSimulator.workerResponseTimeoutMs) {
              this.activateMainThreadFallback();
              return this.fallbackSimulator ? this.fallbackSimulator.step(deltaTime) : false;
            }

            return false;
          }

          if (this.agents.length <= 0) return false;
          var safeDeltaTime = this.getSafeDeltaTime(deltaTime);

          if (this.obstacleDirty) {
            this.sendObstaclesToWorker();
          }

          var count = this.agents.length;
          this.ensureBuffers(count);
          if (!this.idsBuffer || !this.floatsBuffer || !this.intsBuffer) return false;
          var ids = this.idsBuffer;
          var floats = this.floatsBuffer;
          var ints = this.intsBuffer;

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
            var ii = i * 4;
            ints[ii + 0] = a.maxNeighbors;
            ints[ii + 1] = a.locked ? 1 : 0;
            ints[ii + 2] = a.enableAllyOvertake ? 1 : 0;
            ints[ii + 3] = a.canBePush ? 1 : 0;
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
              obstacleSolveIterations: this.obstacleSolveIterations,
              useBounds: this.useBounds ? 1 : 0,
              minX: this.minX,
              maxX: this.maxX,
              minZ: this.minZ,
              maxZ: this.maxZ
            }, [ids.buffer, floats.buffer, ints.buffer]);
          } catch (err) {
            this.pending = false;
            this.pendingSinceMs = 0;
            this.activateMainThreadFallback();
            return this.fallbackSimulator ? this.fallbackSimulator.step(deltaTime) : false;
          } // Sau transfer, buffer bị detach.
          // Sẽ được gán lại khi Worker trả kết quả.


          this.idsBuffer = null;
          this.floatsBuffer = null;
          this.intsBuffer = null;
          return true;
        }

        ensureBuffers(count) {
          if (this.bufferCapacity >= count && this.idsBuffer && this.floatsBuffer && this.intsBuffer) {
            return;
          }

          this.bufferCapacity = Math.max(count, this.bufferCapacity * 2, 64);
          this.idsBuffer = new Int32Array(this.bufferCapacity);
          this.floatsBuffer = new Float32Array(this.bufferCapacity * 18);
          this.intsBuffer = new Int32Array(this.bufferCapacity * 4);
        }

        sendObstaclesToWorker() {
          if (!this.worker || !this.workerReady) return;
          var circleData = new Float32Array(this.circleObs.length * 3);

          for (var i = 0; i < this.circleObs.length; i++) {
            var ob = this.circleObs[i];
            var k = i * 3;
            circleData[k + 0] = ob.x;
            circleData[k + 1] = ob.z;
            circleData[k + 2] = ob.r;
          }

          var rectData = new Float32Array(this.rectObs.length * 6);

          for (var _i = 0; _i < this.rectObs.length; _i++) {
            var _ob = this.rectObs[_i];

            var _k = _i * 6;

            rectData[_k + 0] = _ob.x;
            rectData[_k + 1] = _ob.z;
            rectData[_k + 2] = _ob.hx;
            rectData[_k + 3] = _ob.hz;
            rectData[_k + 4] = _ob.cos;
            rectData[_k + 5] = _ob.sin;
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

          var blob = new Blob([RVOWorkerSimulator.workerSource()], {
            type: 'application/javascript'
          });
          var url = URL.createObjectURL(blob);
          this.worker = this.createNamedWorker(url, 'RVOWorkerSimulator');
          this.workerCreatedAtMs = Date.now();
          URL.revokeObjectURL(url);

          this.worker.onmessage = event => {
            var data = event.data;
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
              this.applyWorkerResult(data.ids, data.floats, data.count);
            }
          };

          this.worker.onerror = err => {
            console.warn('[RVOWorkerSimulator] Worker failed; using main-thread fallback.', err);
            this.activateMainThreadFallback();
          };
        }

        activateMainThreadFallback() {
          if (this.fallbackSimulator) return;

          if (this.worker) {
            this.worker.terminate();
            this.worker = null;
          }

          this.workerReady = false;
          this.workerCreatedAtMs = 0;
          this.pending = false;
          this.pendingSinceMs = 0;
          var fallback = new (_crd && RVOSimulator === void 0 ? (_reportPossibleCrUseOfRVOSimulator({
            error: Error()
          }), RVOSimulator) : RVOSimulator)();
          fallback.agents = this.agents;
          fallback.circleObs = this.circleObs;
          fallback.rectObs = this.rectObs;
          fallback.cellSize = this.cellSize;
          fallback.timeStep = this.timeStep;
          fallback.minStepDeltaTime = this.minStepDeltaTime;
          fallback.maxStepDeltaTime = this.maxStepDeltaTime;
          fallback.obstacleSolveIterations = this.obstacleSolveIterations;

          if (this.useBounds) {
            fallback.setBattlefield(this.minX, this.maxX, this.minZ, this.maxZ);
          }

          this.fallbackSimulator = fallback;
        }

        createNamedWorker(url, name) {
          try {
            return new Worker(url, {
              name
            });
          } catch (err) {
            return new Worker(url);
          }
        }

        applyWorkerResult(ids, floats, count) {
          for (var i = 0; i < count; i++) {
            var id = ids[i];
            var a = this.agentMap.get(id);
            if (!a) continue;
            var fi = i * 18;
            a.pos.x = floats[fi + 0];
            a.pos.z = floats[fi + 1];
            a.vel.x = floats[fi + 2];
            a.vel.z = floats[fi + 3];
          }
        }

        static workerSource() {
          return "\nconst grid = new Map();\nconst activeGridCells = [];\nconst gridKeyRows = new Map();\n\nlet circleData = new Float32Array(0);\nlet rectData = new Float32Array(0);\n\nconst agentCache = [];\nconst OVERTAKE_SLOW_FRAME_THRESHOLD = 8;\n\nfunction clamp(v, min, max) {\n    return Math.max(min, Math.min(max, v));\n}\n\nfunction key(gx, gz) {\n    let row = gridKeyRows.get(gx);\n\n    if (!row) {\n        row = new Map();\n        gridKeyRows.set(gx, row);\n    }\n\n    let result = row.get(gz);\n\n    if (!result) {\n        result = gx + \"_\" + gz;\n        row.set(gz, result);\n    }\n\n    return result;\n}\n\nfunction getAgentFromCache(index) {\n    let a = agentCache[index];\n\n    if (!a) {\n        a = {\n            id: 0,\n\n            x: 0,\n            z: 0,\n\n            vx: 0,\n            vz: 0,\n\n            prefX: 0,\n            prefZ: 0,\n\n            maxSpeed: 0,\n            radius: 0,\n            neighborDist: 0,\n\n            forwardX: 0,\n            forwardZ: 1,\n\n            overtakeLookAhead: 0,\n            overtakeSideRange: 0,\n            overtakeSideStrength: 0,\n            overtakeSpeedDiff: 0,\n            overtakeSeed: 1,\n            overtakeSideLock: 0,\n            overtakeHoldFrames: 0,\n            forwardSlowFrames: 0,\n\n            team: -1,\n            onForward: 0,\n\n            maxNeighbors: 0,\n            locked: false,\n            canBePush: false,\n            enableAllyOvertake: false,\n\n            gridX: 0,\n            gridZ: 0\n        };\n\n        agentCache[index] = a;\n    }\n\n    return a;\n}\n\nfunction buildAgents(ids, floats, ints, count) {\n    const agents = agentCache;\n\n    for (let i = 0; i < count; i++) {\n        const a = getAgentFromCache(i);\n        const previousId = a.id;\n\n        const fi = i * 18;\n        const ii = i * 4;\n\n        a.id = ids[i];\n\n        if (previousId !== a.id) {\n            a.overtakeSideLock = 0;\n            a.overtakeHoldFrames = 0;\n            a.forwardSlowFrames = 0;\n        }\n\n        a.x = floats[fi + 0];\n        a.z = floats[fi + 1];\n\n        a.vx = floats[fi + 2];\n        a.vz = floats[fi + 3];\n\n        a.prefX = floats[fi + 4];\n        a.prefZ = floats[fi + 5];\n\n        a.maxSpeed = floats[fi + 6];\n        a.radius = floats[fi + 7];\n        a.neighborDist = floats[fi + 8];\n\n        a.forwardX = floats[fi + 9];\n        a.forwardZ = floats[fi + 10];\n\n        a.overtakeLookAhead = floats[fi + 11];\n        a.overtakeSideRange = floats[fi + 12];\n        a.overtakeSideStrength = floats[fi + 13];\n        a.overtakeSpeedDiff = floats[fi + 14];\n        a.overtakeSeed = floats[fi + 15];\n\n        a.team = floats[fi + 16];\n        a.onForward = floats[fi + 17];\n\n        a.maxNeighbors = ints[ii + 0];\n        a.locked = ints[ii + 1] === 1;\n        a.enableAllyOvertake = ints[ii + 2] === 1;\n        a.canBePush = ints[ii + 3] === 1;\n\n        a.gridX = 0;\n        a.gridZ = 0;\n    }\n\n    return agents;\n}\n\nfunction buildGrid(agents, count, cellSize) {\n    for (let i = 0; i < activeGridCells.length; i++) {\n        activeGridCells[i].length = 0;\n    }\n\n    activeGridCells.length = 0;\n\n    for (let i = 0; i < count; i++) {\n        const a = agents[i];\n\n        a.gridX = Math.floor(a.x / cellSize);\n        a.gridZ = Math.floor(a.z / cellSize);\n\n        const k = key(a.gridX, a.gridZ);\n        let cell = grid.get(k);\n\n        if (!cell) {\n            cell = [];\n            grid.set(k, cell);\n        }\n\n        if (cell.length <= 0) {\n            activeGridCells.push(cell);\n        }\n\n        cell.push(a);\n    }\n}\n\nfunction collectNeighbors(a, result, cellSize) {\n    result.length = 0;\n\n    const maxDistSq = a.neighborDist * a.neighborDist;\n    const maxNeighbors = Math.max(0, Math.floor(a.maxNeighbors));\n\n    if (maxNeighbors <= 0) {\n        return;\n    }\n\n    for (let x = -1; x <= 1; x++) {\n        for (let z = -1; z <= 1; z++) {\n            const cell = grid.get(key(a.gridX + x, a.gridZ + z));\n\n            if (!cell) continue;\n\n            for (let i = 0; i < cell.length; i++) {\n                const b = cell[i];\n\n                if (b === a) continue;\n\n                const dx = b.x - a.x;\n                const dz = b.z - a.z;\n                const d = dx * dx + dz * dz;\n\n                if (d > maxDistSq) continue;\n\n                insertNearestNeighbor(\n                    a,\n                    b,\n                    d,\n                    maxNeighbors,\n                    result\n                );\n            }\n        }\n    }\n}\n\nconst neighborScratch = [];\n\nfunction insertNearestNeighbor(origin, candidate, candidateDistSq, maxNeighbors, result) {\n    let insertAt = result.length;\n\n    for (let i = 0; i < result.length; i++) {\n        const other = result[i];\n        const dx = other.x - origin.x;\n        const dz = other.z - origin.z;\n        const distSq = dx * dx + dz * dz;\n\n        if (candidateDistSq < distSq) {\n            insertAt = i;\n            break;\n        }\n    }\n\n    if (insertAt >= maxNeighbors) {\n        return;\n    }\n\n    const end = Math.min(result.length, maxNeighbors - 1);\n\n    result.length = Math.min(result.length + 1, maxNeighbors);\n\n    for (let i = end; i > insertAt; i--) {\n        result[i] = result[i - 1];\n    }\n\n    result[insertAt] = candidate;\n}\n\nfunction pushAgentOutOfCircle(a, k) {\n    const ox = circleData[k + 0];\n    const oz = circleData[k + 1];\n    const r = circleData[k + 2];\n\n    const dx = a.x - ox;\n    const dz = a.z - oz;\n\n    const distSq = dx * dx + dz * dz;\n    const minDist = a.radius + r;\n\n    if (distSq >= minDist * minDist) return;\n\n    if (distSq < 1e-8) {\n        a.x = ox + minDist + 0.001;\n        a.z = oz;\n        return;\n    }\n\n    const dist = Math.sqrt(distSq);\n    const nx = dx / dist;\n    const nz = dz / dist;\n\n    const push = minDist - dist + 0.001;\n\n    a.x += nx * push;\n    a.z += nz * push;\n}\n\nfunction pushAgentOutOfRect(a, k) {\n    const ox = rectData[k + 0];\n    const oz = rectData[k + 1];\n    const hx = rectData[k + 2];\n    const hz = rectData[k + 3];\n    const cos = rectData[k + 4];\n    const sin = rectData[k + 5];\n\n    const dx = a.x - ox;\n    const dz = a.z - oz;\n\n    const lx = dx * cos + dz * sin;\n    const lz = -dx * sin + dz * cos;\n\n    const px = clamp(lx, -hx, hx);\n    const pz = clamp(lz, -hz, hz);\n\n    const qx = lx - px;\n    const qz = lz - pz;\n\n    const distSq = qx * qx + qz * qz;\n\n    let nxL = 0;\n    let nzL = 0;\n    let push = 0;\n\n    if (distSq > 1e-8) {\n        const dist = Math.sqrt(distSq);\n\n        if (dist >= a.radius) return;\n\n        nxL = qx / dist;\n        nzL = qz / dist;\n        push = a.radius - dist + 0.001;\n    } else {\n        const dLeft = lx + hx;\n        const dRight = hx - lx;\n        const dBottom = lz + hz;\n        const dTop = hz - lz;\n\n        let minD = dLeft;\n        nxL = -1;\n        nzL = 0;\n\n        if (dRight < minD) {\n            minD = dRight;\n            nxL = 1;\n            nzL = 0;\n        }\n\n        if (dBottom < minD) {\n            minD = dBottom;\n            nxL = 0;\n            nzL = -1;\n        }\n\n        if (dTop < minD) {\n            minD = dTop;\n            nxL = 0;\n            nzL = 1;\n        }\n\n        push = minD + a.radius + 0.001;\n    }\n\n    const nx = nxL * cos - nzL * sin;\n    const nz = nxL * sin + nzL * cos;\n\n    a.x += nx * push;\n    a.z += nz * push;\n}\n\nfunction pushAgentOutOfObstacles(a) {\n    for (let i = 0; i < circleData.length; i += 3) {\n        pushAgentOutOfCircle(a, i);\n    }\n\n    for (let i = 0; i < rectData.length; i += 6) {\n        pushAgentOutOfRect(a, i);\n    }\n}\n\nfunction applyObstacleVelocityAvoidance(a) {\n    let vx = a.vx;\n    let vz = a.vz;\n\n    for (let i = 0; i < circleData.length; i += 3) {\n        const dx = a.x - circleData[i + 0];\n        const dz = a.z - circleData[i + 1];\n        const dist = Math.sqrt(dx * dx + dz * dz);\n        const minDist = a.radius + circleData[i + 2];\n\n        if (dist >= minDist || dist <= 0.0001) continue;\n\n        const nx = dx / dist;\n        const nz = dz / dist;\n\n        vx += nx * (minDist - dist) * 2;\n        vz += nz * (minDist - dist) * 2;\n\n        const dot = vx * nx + vz * nz;\n\n        if (dot < 0) {\n            vx -= nx * dot;\n            vz -= nz * dot;\n        }\n    }\n\n    for (let i = 0; i < rectData.length; i += 6) {\n        const dx = a.x - rectData[i + 0];\n        const dz = a.z - rectData[i + 1];\n        const hx = rectData[i + 2];\n        const hz = rectData[i + 3];\n        const cos = rectData[i + 4];\n        const sin = rectData[i + 5];\n        const lx = dx * cos + dz * sin;\n        const lz = -dx * sin + dz * cos;\n        const px = clamp(lx, -hx, hx);\n        const pz = clamp(lz, -hz, hz);\n        const ox = lx - px;\n        const oz = lz - pz;\n        const distSq = ox * ox + oz * oz;\n\n        let nxL = 0;\n        let nzL = 0;\n        let push = 0;\n\n        if (distSq > 1e-8) {\n            if (distSq >= a.radius * a.radius) continue;\n\n            const dist = Math.sqrt(distSq);\n            nxL = ox / dist;\n            nzL = oz / dist;\n            push = a.radius - dist;\n        } else {\n            const dLeft = lx + hx;\n            const dRight = hx - lx;\n            const dBottom = lz + hz;\n            const dTop = hz - lz;\n            let minD = dLeft;\n\n            nxL = -1;\n\n            if (dRight < minD) {\n                minD = dRight;\n                nxL = 1;\n                nzL = 0;\n            }\n\n            if (dBottom < minD) {\n                minD = dBottom;\n                nxL = 0;\n                nzL = -1;\n            }\n\n            if (dTop < minD) {\n                minD = dTop;\n                nxL = 0;\n                nzL = 1;\n            }\n\n            push = a.radius + minD;\n        }\n\n        const nx = nxL * cos - nzL * sin;\n        const nz = nxL * sin + nzL * cos;\n\n        vx += nx * push * 2;\n        vz += nz * push * 2;\n\n        const dot = vx * nx + vz * nz;\n\n        if (dot < 0) {\n            vx -= nx * dot;\n            vz -= nz * dot;\n        }\n    }\n\n    a.vx = vx;\n    a.vz = vz;\n}\n\nfunction applyAllyOvertake(a, neighbors) {\n    if (!a.enableAllyOvertake) return;\n    if (a.locked) return;\n    if (a.onForward !== 1) return;\n\n    let best = null;\n    let bestForwardDist = Infinity;\n    let bestSideDist = 0;\n\n    const lookAhead = Math.max(0, a.overtakeLookAhead);\n    const sideRange = Math.max(0, a.overtakeSideRange);\n\n    if (lookAhead <= 0 || sideRange <= 0) {\n        return;\n    }\n\n    for (let i = 0; i < neighbors.length; i++) {\n        const b = neighbors[i];\n\n        if (b === a) continue;\n        if (b.team !== a.team) continue;\n\n        if (a.maxSpeed + a.overtakeSpeedDiff < b.maxSpeed) {\n            continue;\n        }\n        if (!isAllyOvertakeBlocker(b)) continue;\n\n        const dx = b.x - a.x;\n        const dz = b.z - a.z;\n\n        const forwardDist =\n            dx * a.forwardX +\n            dz * a.forwardZ;\n\n        if (forwardDist <= a.radius * 0.25) continue;\n        if (forwardDist > lookAhead) continue;\n\n        const sideDist =\n            dx * a.forwardZ -\n            dz * a.forwardX;\n\n        if (Math.abs(sideDist) > sideRange + a.radius + b.radius) continue;\n\n        if (forwardDist < bestForwardDist) {\n            bestForwardDist = forwardDist;\n            bestSideDist = sideDist;\n            best = b;\n        }\n    }\n\n    if (!best) {\n        if (a.overtakeHoldFrames > 0) {\n            a.overtakeHoldFrames--;\n        } else {\n            a.overtakeSideLock = 0;\n        }\n\n        return;\n    }\n\n    let side = a.overtakeSideLock;\n\n    if (side === 0 || a.overtakeHoldFrames <= 0) {\n        side = chooseOvertakeSide(a, neighbors, bestSideDist);\n        a.overtakeSideLock = side;\n    }\n\n    a.overtakeHoldFrames = 12;\n\n    const closeFactor =\n        1 -\n        Math.min(\n            1,\n            bestForwardDist /\n            Math.max(0.001, lookAhead)\n        );\n    const strength =\n        a.maxSpeed *\n        a.overtakeSideStrength *\n        (0.35 + closeFactor * 0.65);\n\n    const sideX = a.forwardZ * side;\n    const sideZ = -a.forwardX * side;\n\n    a.vx += sideX * strength;\n    a.vz += sideZ * strength;\n\n    const speed = Math.sqrt(a.vx * a.vx + a.vz * a.vz);\n\n    if (speed > a.maxSpeed) {\n        a.vx = (a.vx / speed) * a.maxSpeed;\n        a.vz = (a.vz / speed) * a.maxSpeed;\n    }\n}\n\nfunction updateForwardSlowFrames(a) {\n    if (a.locked || a.onForward !== 1) {\n        a.forwardSlowFrames = 0;\n        return;\n    }\n\n    const prefForward =\n        a.prefX * a.forwardX +\n        a.prefZ * a.forwardZ;\n\n    if (prefForward <= a.maxSpeed * 0.25) {\n        a.forwardSlowFrames = 0;\n        return;\n    }\n\n    const currentForward =\n        a.vx * a.forwardX +\n        a.vz * a.forwardZ;\n\n    if (currentForward < prefForward * 0.35) {\n        a.forwardSlowFrames++;\n    } else {\n        a.forwardSlowFrames = 0;\n    }\n}\n\nfunction isAllyOvertakeBlocker(b) {\n    if (b.locked) return true;\n    if (b.onForward !== 1) return true;\n\n    return b.forwardSlowFrames >= OVERTAKE_SLOW_FRAME_THRESHOLD;\n}\n\nfunction chooseOvertakeSide(a, neighbors, blockerSideDist) {\n    const rightScore = getOvertakeSideClearanceScore(a, neighbors, 1);\n    const leftScore = getOvertakeSideClearanceScore(a, neighbors, -1);\n\n    if (Math.abs(rightScore - leftScore) > 0.001) {\n        return rightScore > leftScore ? 1 : -1;\n    }\n\n    if (Math.abs(blockerSideDist) > 0.05) {\n        return blockerSideDist > 0 ? -1 : 1;\n    }\n\n    return a.overtakeSeed >= 0 ? 1 : -1;\n}\n\nfunction getOvertakeSideClearanceScore(a, neighbors, side) {\n    const sideX = a.forwardZ * side;\n    const sideZ = -a.forwardX * side;\n    const lookAhead = Math.max(0.001, a.overtakeLookAhead);\n    const sideRange = Math.max(0.001, a.overtakeSideRange);\n\n    let score = 0;\n\n    for (let i = 0; i < neighbors.length; i++) {\n        const b = neighbors[i];\n\n        if (b === a) continue;\n\n        const dx = b.x - a.x;\n        const dz = b.z - a.z;\n        const forwardDist =\n            dx * a.forwardX +\n            dz * a.forwardZ;\n\n        if (forwardDist < -a.radius) continue;\n        if (forwardDist > lookAhead + b.radius) continue;\n\n        const sideDist =\n            dx * sideX +\n            dz * sideZ;\n\n        if (sideDist <= 0) continue;\n        if (sideDist > sideRange + b.radius) continue;\n\n        const forwardWeight =\n            1 -\n            Math.min(\n                1,\n                Math.abs(forwardDist) / lookAhead\n            );\n        const sideWeight =\n            1 -\n            Math.min(\n                1,\n                sideDist /\n                (sideRange + b.radius)\n            );\n\n        score -=\n            (forwardWeight * 1.5 + sideWeight) *\n            (b.radius + a.radius);\n    }\n\n    return score;\n}\n\nfunction applyVelocityAvoidance(agents, count, data) {\n    buildGrid(agents, count, data.cellSize);\n\n    for (let i = 0; i < count; i++) {\n        const a = agents[i];\n\n        updateForwardSlowFrames(a);\n\n        if (a.locked) continue;\n\n        let vx = a.prefX;\n        let vz = a.prefZ;\n\n        collectNeighbors(a, neighborScratch, data.cellSize);\n\n        for (let j = 0; j < neighborScratch.length; j++) {\n            const b = neighborScratch[j];\n\n            const dx = a.x - b.x;\n            const dz = a.z - b.z;\n\n            const distSq = dx * dx + dz * dz;\n            const minDist = a.radius + b.radius;\n\n            if (distSq < 0.0001) continue;\n\n            if (distSq < minDist * minDist) {\n                const dist = Math.sqrt(distSq);\n\n                const nx = dx / dist;\n                const nz = dz / dist;\n\n                const push = minDist - dist;\n\n                vx += nx * push * 2;\n                vz += nz * push * 2;\n\n                const dot = vx * nx + vz * nz;\n\n                if (dot < 0) {\n                    vx -= nx * dot;\n                    vz -= nz * dot;\n                }\n            }\n        }\n\n        a.vx = vx;\n        a.vz = vz;\n\n        applyObstacleVelocityAvoidance(a);\n        applyAllyOvertake(a, neighborScratch);\n\n        const speed = Math.sqrt(a.vx * a.vx + a.vz * a.vz);\n\n        if (speed > a.maxSpeed) {\n            a.vx = (a.vx / speed) * a.maxSpeed;\n            a.vz = (a.vz / speed) * a.maxSpeed;\n        }\n    }\n\n}\n\nfunction canMoveInHardSeparation(a) {\n    return !a.locked || a.canBePush === true;\n}\n\nfunction moveAgents(agents, count, data) {\n    const obstacleIterations = Math.max(\n        0,\n        Math.floor(data.obstacleSolveIterations || 0)\n    );\n\n    for (let i = 0; i < count; i++) {\n        const a = agents[i];\n\n        if (!a.locked) {\n            a.x += a.vx * data.timeStep;\n            a.z += a.vz * data.timeStep;\n\n            for (let k = 0; k < obstacleIterations; k++) {\n                pushAgentOutOfObstacles(a);\n            }\n        }\n\n        if (data.useBounds === 1) {\n            a.x = clamp(a.x, data.minX + a.radius, data.maxX - a.radius);\n            a.z = clamp(a.z, data.minZ + a.radius, data.maxZ - a.radius);\n        }\n    }\n}\n\nfunction hardSeparateAgents(agents, count, data) {\n    buildGrid(agents, count, data.cellSize);\n\n    for (let i = 0; i < count; i++) {\n        const a = agents[i];\n\n        collectNeighbors(a, neighborScratch, data.cellSize);\n\n        for (let j = 0; j < neighborScratch.length; j++) {\n            const b = neighborScratch[j];\n\n            const dx = b.x - a.x;\n            const dz = b.z - a.z;\n\n            const distSq = dx * dx + dz * dz;\n            const minDist = a.radius + b.radius;\n\n            if (distSq < 0.0001) continue;\n            if (distSq >= minDist * minDist) continue;\n\n            const dist = Math.sqrt(distSq);\n            const overlap = minDist - dist;\n\n            const nx = dx / dist;\n            const nz = dz / dist;\n\n            const aMovable = canMoveInHardSeparation(a);\n            const bMovable = canMoveInHardSeparation(b);\n\n            if (aMovable && bMovable) {\n                const half = overlap * 0.5;\n\n                a.x -= nx * half;\n                a.z -= nz * half;\n\n                b.x += nx * half;\n                b.z += nz * half;\n            } else if (aMovable && !bMovable) {\n                a.x -= nx * overlap;\n                a.z -= nz * overlap;\n            } else if (!aMovable && bMovable) {\n                b.x += nx * overlap;\n                b.z += nz * overlap;\n            }\n        }\n    }\n\n}\n\nfunction solveObstaclesAgain(agents, count, data) {\n    const obstacleIterations = Math.max(\n        0,\n        Math.floor(data.obstacleSolveIterations || 0)\n    );\n\n    for (let i = 0; i < count; i++) {\n        const a = agents[i];\n\n        if (a.locked && a.canBePush !== true) continue;\n\n        for (let k = 0; k < obstacleIterations; k++) {\n            pushAgentOutOfObstacles(a);\n        }\n\n        if (data.useBounds === 1) {\n            a.x = clamp(a.x, data.minX + a.radius, data.maxX - a.radius);\n            a.z = clamp(a.z, data.minZ + a.radius, data.maxZ - a.radius);\n        }\n    }\n}\n\nfunction writeResultToFloats(agents, floats, count) {\n    for (let i = 0; i < count; i++) {\n        const a = agents[i];\n        const fi = i * 18;\n\n        floats[fi + 0] = a.x;\n        floats[fi + 1] = a.z;\n        floats[fi + 2] = a.vx;\n        floats[fi + 3] = a.vz;\n    }\n}\n\nfunction step(data) {\n    const agents = buildAgents(\n        data.ids,\n        data.floats,\n        data.ints,\n        data.count\n    );\n\n    applyVelocityAvoidance(agents, data.count, data);\n    moveAgents(agents, data.count, data);\n    hardSeparateAgents(agents, data.count, data);\n    solveObstaclesAgain(agents, data.count, data);\n\n    writeResultToFloats(\n        agents,\n        data.floats,\n        data.count\n    );\n\n    self.postMessage({\n        type: 'result',\n        sequence: data.sequence,\n        ids: data.ids,\n        floats: data.floats,\n        ints: data.ints,\n        count: data.count\n    }, [\n        data.ids.buffer,\n        data.floats.buffer,\n        data.ints.buffer\n    ]);\n}\n\nself.onmessage = function(event) {\n    const data = event.data;\n\n    if (!data) return;\n\n    if (data.type === 'obstacles') {\n        circleData = data.circleData || new Float32Array(0);\n        rectData = data.rectData || new Float32Array(0);\n        return;\n    }\n\n    if (data.type === 'step') {\n        step(data);\n    }\n};\n\nself.postMessage({ type: 'ready' });\n";
        }

      });

      RVOWorkerSimulator.workerResponseTimeoutMs = 2000;

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e21aeeb81eed07a28ae26841a08bfd8fc9a2101d.js.map