System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, BattleSpatialGrid, _crd;

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  _export("BattleSpatialGrid", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "52095+WcUBImo9/C5SYfL/n", "BattleSpatialGrid", undefined);

      _export("BattleSpatialGrid", BattleSpatialGrid = class BattleSpatialGrid {
        constructor() {
          this.cellSize = 4;
          this.useWorkerTargetQuery = true;
          this.teamAGrid = new Map();
          this.teamBGrid = new Map();
          this.tempResult = [];
          this.nearestSearchBest = null;
          this.nearestSearchBestDistSq = Infinity;
          this.worker = null;
          this.workerReady = false;
          this.workerFailed = false;
          this.workerSeq = 0;
          this.nextUnitId = 1;
          this.nextRequestId = 1;
          this.unitIds = new WeakMap();
          this.unitsById = new Map();
          this.targetSnapshot = new Float64Array(0);
          this.targetSnapshotLength = 0;
          this.packedRequestData = new Float64Array(0);
          this.pendingNearestRequests = [];
          this.activeNearestRequests = new Map();
          this.nearestRequestPool = [];
          this.flushScheduled = false;
        }

        build(teamA, teamB) {
          this.teamAGrid.clear();
          this.teamBGrid.clear();
          this.unitsById.clear();
          this.targetSnapshotLength = 0;
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
          this.recycleNearestRequestList(this.pendingNearestRequests);
          this.pendingNearestRequests.length = 0;
          this.recycleActiveNearestRequests();
          this.activeNearestRequests.clear();
          this.unitsById.clear();
          this.targetSnapshot = new Float64Array(0);
          this.targetSnapshotLength = 0;
          this.packedRequestData = new Float64Array(0);
        }

        fillGrid(grid, units, team) {
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
            this.appendTargetSnapshot(id, unit.lifeId, team, unit.agent.pos.x, unit.agent.pos.z);
          }
        }

        queryEnemies(team, x, z, radius) {
          const enemyGrid = this.getEnemyGrid(team);
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

        findNearestEnemy(team, x, z, radius) {
          const enemyGrid = this.getEnemyGrid(team);
          const cellRange = Math.ceil(radius / this.cellSize);
          const cx = Math.floor(x / this.cellSize);
          const cz = Math.floor(z / this.cellSize);
          const radiusSq = radius * radius;
          this.nearestSearchBest = null;
          this.nearestSearchBestDistSq = Infinity;

          for (let ring = 0; ring <= cellRange; ring++) {
            const ringMinDistSq = this.getRingMinDistanceSq(cx, cz, ring, x, z);

            if (ringMinDistSq > radiusSq) {
              break;
            }

            if (this.nearestSearchBest && ringMinDistSq > this.nearestSearchBestDistSq) {
              break;
            }

            this.scanRingForNearest(enemyGrid, cx, cz, ring, x, z, radiusSq);
          }

          return this.nearestSearchBest;
        }

        scanRingForNearest(enemyGrid, cx, cz, ring, x, z, radiusSq) {
          if (ring <= 0) {
            this.scanCellForNearest(enemyGrid, cx, cz, x, z, radiusSq);
            return;
          }

          const minX = cx - ring;
          const maxX = cx + ring;
          const minZ = cz - ring;
          const maxZ = cz + ring;

          for (let gx = minX; gx <= maxX; gx++) {
            this.scanCellForNearest(enemyGrid, gx, minZ, x, z, radiusSq);
            this.scanCellForNearest(enemyGrid, gx, maxZ, x, z, radiusSq);
          }

          for (let gz = minZ + 1; gz <= maxZ - 1; gz++) {
            this.scanCellForNearest(enemyGrid, minX, gz, x, z, radiusSq);
            this.scanCellForNearest(enemyGrid, maxX, gz, x, z, radiusSq);
          }
        }

        scanCellForNearest(enemyGrid, gx, gz, x, z, radiusSq) {
          const list = enemyGrid.get(this.getKey(gx, gz));
          if (!list) return;

          for (let i = 0; i < list.length; i++) {
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

        findNearestEnemyInRange(team, x, z, range) {
          return this.findNearestEnemy(team, x, z, range);
        }

        requestNearestEnemy(unit, team, x, z, radius, callback, callbackToken = -1) {
          if (!this.canUseWorkerTargetQuery()) {
            return false;
          }

          if (this.targetSnapshotLength <= 0) {
            return false;
          }

          const request = this.getNearestRequest(unit, team, x, z, radius, callback, callbackToken);
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

        getKey(x, z) {
          return `${x}_${z}`;
        }

        canUseWorkerTargetQuery() {
          if (!this.useWorkerTargetQuery) return false;
          if (this.workerFailed) return false;

          if (!this.worker) {
            this.createWorker();
          }

          return !!this.worker && this.workerReady;
        }

        flushNearestWorkerRequests() {
          if (!this.worker || !this.workerReady || this.pendingNearestRequests.length <= 0) {
            return;
          }

          const requests = this.pendingNearestRequests;
          const packedCapacity = requests.length * 5;
          this.ensurePackedRequestCapacity(packedCapacity);
          const packedRequests = this.packedRequestData;
          let packedLength = 0;
          const unitData = this.targetSnapshot.subarray(0, this.targetSnapshotLength);
          const unitLength = this.targetSnapshotLength;

          for (let i = 0; i < requests.length; i++) {
            const request = requests[i];

            if (!this.isValidRequestUnit(request.unit, request.unitLifeId)) {
              this.recycleNearestRequest(request);
              continue;
            }

            this.activeNearestRequests.set(request.requestId, request);
            packedRequests[packedLength++] = request.requestId;
            packedRequests[packedLength++] = request.team;
            packedRequests[packedLength++] = request.x;
            packedRequests[packedLength++] = request.z;
            packedRequests[packedLength++] = request.radius;
          }

          this.pendingNearestRequests.length = 0;

          if (packedLength <= 0) {
            return;
          }

          const requestData = packedRequests.subarray(0, packedLength);

          try {
            this.worker.postMessage({
              type: 'findNearestBatch',
              seq: ++this.workerSeq,
              cellSize: this.cellSize,
              units: unitData,
              unitLength,
              requests: requestData,
              requestLength: packedLength
            });
          } catch (err) {
            this.workerFailed = true;
            this.workerReady = false;
            this.completeActiveRequestsOnMainThread();
          }
        }

        applyWorkerResults(results) {
          for (let i = 0; i < results.length; i += 3) {
            const requestId = results[i];
            const targetId = results[i + 1];
            const targetLifeId = results[i + 2];
            const request = this.activeNearestRequests.get(requestId);
            this.activeNearestRequests.delete(requestId);
            if (!request) continue;
            const callback = request.callback;
            const callbackToken = request.callbackToken;

            if (!this.isValidRequestUnit(request.unit, request.unitLifeId)) {
              callback(null, callbackToken);
              this.recycleNearestRequest(request);
              continue;
            }

            const target = this.unitsById.get(targetId);

            if (!target || !this.isValidTargetUnit(target, targetLifeId)) {
              callback(null, callbackToken);
              this.recycleNearestRequest(request);
              continue;
            }

            callback(target, callbackToken);
            this.recycleNearestRequest(request);
          }
        }

        completeActiveRequestsOnMainThread() {
          const requests = Array.from(this.activeNearestRequests.values());
          this.activeNearestRequests.clear();

          for (let i = 0; i < requests.length; i++) {
            const request = requests[i];
            const callback = request.callback;
            const callbackToken = request.callbackToken;

            if (!this.isValidRequestUnit(request.unit, request.unitLifeId)) {
              callback(null, callbackToken);
              this.recycleNearestRequest(request);
              continue;
            }

            callback(this.findNearestEnemy(request.team, request.x, request.z, request.radius), callbackToken);
            this.recycleNearestRequest(request);
          }
        }

        getNearestRequest(unit, team, x, z, radius, callback, callbackToken) {
          const request = this.nearestRequestPool.pop() || {
            requestId: 0,
            unit: null,
            unitLifeId: -1,
            team: 0,
            x: 0,
            z: 0,
            radius: 0,
            callbackToken: -1,
            callback: BattleSpatialGrid.noopNearestEnemyCallback
          };
          request.requestId = this.nextRequestId++;
          request.unit = unit;
          request.unitLifeId = unit.lifeId;
          request.team = team;
          request.x = x;
          request.z = z;
          request.radius = radius;
          request.callbackToken = callbackToken;
          request.callback = callback;
          return request;
        }

        recycleNearestRequest(request) {
          if (!request) return;
          request.requestId = 0;
          request.unit = null;
          request.unitLifeId = -1;
          request.team = 0;
          request.x = 0;
          request.z = 0;
          request.radius = 0;
          request.callbackToken = -1;
          request.callback = BattleSpatialGrid.noopNearestEnemyCallback;

          if (this.nearestRequestPool.length < 512) {
            this.nearestRequestPool.push(request);
          }
        }

        recycleNearestRequestList(requests) {
          for (let i = 0; i < requests.length; i++) {
            this.recycleNearestRequest(requests[i]);
          }
        }

        recycleActiveNearestRequests() {
          this.activeNearestRequests.forEach(request => {
            this.recycleNearestRequest(request);
          });
        }

        isValidRequestUnit(unit, lifeId = -1) {
          if (!unit) return false;
          if (lifeId >= 0 && unit.lifeId !== lifeId) return false;
          if (!unit.node.activeInHierarchy) return false;
          if (!unit.agent) return false;
          if (!unit.props || unit.props.isDead()) return false;
          return true;
        }

        isValidTargetUnit(unit, lifeId = -1) {
          return this.isValidRequestUnit(unit, lifeId);
        }

        getUnitId(unit) {
          let id = this.unitIds.get(unit);

          if (!id) {
            id = this.nextUnitId++;
            this.unitIds.set(unit, id);
          }

          return id;
        }

        appendTargetSnapshot(id, lifeId, team, x, z) {
          this.ensureTargetSnapshotCapacity(this.targetSnapshotLength + 5);
          const data = this.targetSnapshot;
          let index = this.targetSnapshotLength;
          data[index++] = id;
          data[index++] = lifeId;
          data[index++] = team;
          data[index++] = x;
          data[index++] = z;
          this.targetSnapshotLength = index;
        }

        ensureTargetSnapshotCapacity(length) {
          if (this.targetSnapshot.length >= length) {
            return;
          }

          const capacity = Math.max(length, this.targetSnapshot.length * 2, 256);
          const next = new Float64Array(capacity);
          next.set(this.targetSnapshot.subarray(0, this.targetSnapshotLength));
          this.targetSnapshot = next;
        }

        ensurePackedRequestCapacity(length) {
          if (this.packedRequestData.length >= length) {
            return;
          }

          const capacity = Math.max(length, this.packedRequestData.length * 2, 128);
          this.packedRequestData = new Float64Array(capacity);
        }

        createWorker() {
          if (typeof Worker === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
            this.workerFailed = true;
            return;
          }

          try {
            const blob = new Blob([this.workerSource()], {
              type: 'application/javascript'
            });
            const url = URL.createObjectURL(blob);
            this.worker = this.createNamedWorker(url, 'BattleSpatialGridTargetWorker');
            URL.revokeObjectURL(url);

            this.worker.onmessage = event => {
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

        createNamedWorker(url, name) {
          try {
            return new Worker(url, {
              name
            });
          } catch (err) {
            return new Worker(url);
          }
        }

        workerSource() {
          return `
function getKey(x, z) {
    return x + '_' + z;
}

var teamAGrid = Object.create(null);
var teamBGrid = Object.create(null);
var teamAGridKeys = [];
var teamBGridKeys = [];
var resultBuffer = new Float64Array(0);
var bestId = 0;
var bestLifeId = 0;
var bestDistSq = Infinity;

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

function scanCell(grid, gx, gz, x, z, radiusSq) {
    var list = grid[getKey(gx, gz)];

    if (!list) return;

    for (var i = 0; i < list.length; i += 5) {
        var id = list[i];
        var lifeId = list[i + 1];
        var ux = list[i + 3];
        var uz = list[i + 4];
        var dx = ux - x;
        var dz = uz - z;
        var d = dx * dx + dz * dz;

        if (d > radiusSq) continue;

        if (d < bestDistSq) {
            bestDistSq = d;
            bestId = id;
            bestLifeId = lifeId;
        }
    }
}

function findNearest(grid, x, z, radius, cellSize) {
    var cellRange = Math.ceil(radius / cellSize);
    var cx = Math.floor(x / cellSize);
    var cz = Math.floor(z / cellSize);
    var radiusSq = radius * radius;
    bestId = 0;
    bestLifeId = 0;
    bestDistSq = Infinity;

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

        if (bestId && ringMinDistSq > bestDistSq) {
            break;
        }

        if (ring <= 0) {
            scanCell(grid, cx, cz, x, z, radiusSq);
            continue;
        }

        var left = cx - ring;
        var right = cx + ring;
        var bottom = cz - ring;
        var top = cz + ring;

        for (var gx = left; gx <= right; gx++) {
            scanCell(grid, gx, bottom, x, z, radiusSq);
            scanCell(grid, gx, top, x, z, radiusSq);
        }

        for (var gz = bottom + 1; gz <= top - 1; gz++) {
            scanCell(grid, left, gz, x, z, radiusSq);
            scanCell(grid, right, gz, x, z, radiusSq);
        }
    }

    return bestId;
}

function clearGrid(grid, keys) {
    for (var i = 0; i < keys.length; i++) {
        var list = grid[keys[i]];

        if (list) {
            list.length = 0;
        }
    }

    keys.length = 0;
}

function buildGrid(units, unitLength, team, cellSize, grid, keys) {
    clearGrid(grid, keys);

    for (var i = 0; i < unitLength; i += 5) {
        if (units[i + 2] !== team) continue;

        var x = units[i + 3];
        var z = units[i + 4];
        var gx = Math.floor(x / cellSize);
        var gz = Math.floor(z / cellSize);
        var key = getKey(gx, gz);
        var list = grid[key];

        if (!list) {
            list = [];
            grid[key] = list;
        }

        if (list.length <= 0) {
            keys.push(key);
        }

        list.push(
            units[i],
            units[i + 1],
            units[i + 2],
            x,
            z
        );
    }

    return grid;
}

function ensureResultCapacity(length) {
    if (resultBuffer.length >= length) {
        return resultBuffer;
    }

    var capacity = Math.max(
        length,
        resultBuffer.length * 2,
        64
    );

    resultBuffer = new Float64Array(capacity);

    return resultBuffer;
}

self.onmessage = function(event) {
    var data = event.data;

    if (!data) return;

    if (data.type === 'findNearestBatch') {
        var units = data.units || [];
        var unitLength = data.unitLength || units.length;
        var requests = data.requests || [];
        var requestLength = data.requestLength || requests.length;
        var cellSize = Math.max(0.001, data.cellSize || 4);
        var requestCount = Math.floor(requestLength / 5);
        var teamA = buildGrid(
            units,
            unitLength,
            0,
            cellSize,
            teamAGrid,
            teamAGridKeys
        );
        var teamB = buildGrid(
            units,
            unitLength,
            1,
            cellSize,
            teamBGrid,
            teamBGridKeys
        );
        var results = ensureResultCapacity(
            requestCount * 3
        );
        var resultLength = 0;

        for (var i = 0; i < requestLength; i += 5) {
            var requestId = requests[i];
            var team = requests[i + 1];
            var x = requests[i + 2];
            var z = requests[i + 3];
            var radius = requests[i + 4];
            var grid = team === 0
                ? teamB
                : teamA;

            results[resultLength++] = requestId;
            results[resultLength++] =
                findNearest(grid, x, z, radius, cellSize);
            results[resultLength++] = bestLifeId;
        }

        self.postMessage({
            type: 'findNearestBatchResult',
            seq: data.seq,
            results: results.subarray(0, resultLength)
        });
    }
};

self.postMessage({ type: 'ready' });
`;
        }

        getRingMinDistanceSq(cx, cz, ring, x, z) {
          if (ring <= 0) {
            return this.getCellMinDistanceSq(cx, cz, x, z);
          }

          const minX = cx - ring;
          const maxX = cx + ring;
          const minZ = cz - ring;
          const maxZ = cz + ring;
          const left = this.getRectMinDistanceSq(minX, minX, minZ + 1, maxZ - 1, x, z);
          const right = this.getRectMinDistanceSq(maxX, maxX, minZ + 1, maxZ - 1, x, z);
          const bottom = this.getRectMinDistanceSq(minX, maxX, minZ, minZ, x, z);
          const top = this.getRectMinDistanceSq(minX, maxX, maxZ, maxZ, x, z);
          return Math.min(left, right, bottom, top);
        }

        getCellMinDistanceSq(gx, gz, x, z) {
          return this.getRectMinDistanceSq(gx, gx, gz, gz, x, z);
        }

        getRectMinDistanceSq(minGx, maxGx, minGz, maxGz, x, z) {
          if (minGx > maxGx || minGz > maxGz) {
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

        getEnemyGrid(team) {
          return team === 0 ? this.teamBGrid : this.teamAGrid;
        }

      });

      BattleSpatialGrid.noopNearestEnemyCallback = () => {};

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5d8e4021ccee3efd23657fb998ca8d2669ce83fb.js.map