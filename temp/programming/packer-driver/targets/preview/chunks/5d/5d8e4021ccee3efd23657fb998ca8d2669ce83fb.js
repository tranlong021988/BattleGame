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
          this.gridKeyRows = new Map();
          this.teamAActiveCells = [];
          this.teamBActiveCells = [];
          this.teamAMaxRadius = 0;
          this.teamBMaxRadius = 0;
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
          this.workerResponseTimeout = null;
          this.workerResponseTimeoutSeq = 0;
          this.lastCompletedWorkerSeq = 0;
        }

        build(teamA, teamB) {
          this.clearActiveGridCells(this.teamAActiveCells);
          this.clearActiveGridCells(this.teamBActiveCells);
          this.unitsById.clear();
          this.targetSnapshotLength = 0;
          this.teamAMaxRadius = 0;
          this.teamBMaxRadius = 0;
          this.fillGrid(this.teamAGrid, this.teamAActiveCells, teamA, 0);
          this.fillGrid(this.teamBGrid, this.teamBActiveCells, teamB, 1);
        }

        destroy() {
          this.clearWorkerResponseTimeout();

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
          this.teamAGrid.clear();
          this.teamBGrid.clear();
          this.gridKeyRows.clear();
          this.teamAActiveCells.length = 0;
          this.teamBActiveCells.length = 0;
          this.teamAMaxRadius = 0;
          this.teamBMaxRadius = 0;
          this.unitsById.clear();
          this.targetSnapshot = new Float64Array(0);
          this.targetSnapshotLength = 0;
          this.packedRequestData = new Float64Array(0);
        }

        fillGrid(grid, activeCells, units, team) {
          for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props || unit.props.isDead()) continue;
            var gx = Math.floor(unit.agent.pos.x / this.cellSize);
            var gz = Math.floor(unit.agent.pos.z / this.cellSize);
            var key = this.getKey(gx, gz);
            var list = grid.get(key);

            if (!list) {
              list = [];
              grid.set(key, list);
            }

            if (list.length <= 0) {
              activeCells.push(list);
            }

            list.push(unit);

            if (team === 0) {
              this.teamAMaxRadius = Math.max(this.teamAMaxRadius, unit.radius);
            } else {
              this.teamBMaxRadius = Math.max(this.teamBMaxRadius, unit.radius);
            }

            var id = this.getUnitId(unit);
            this.unitsById.set(id, unit);
            this.appendTargetSnapshot(id, unit.lifeId, team, unit.agent.pos.x, unit.agent.pos.z);
          }
        }

        queryEnemies(team, x, z, radius) {
          var enemyGrid = this.getEnemyGrid(team);
          this.tempResult.length = 0;
          var cellRange = Math.ceil(radius / this.cellSize);
          var cx = Math.floor(x / this.cellSize);
          var cz = Math.floor(z / this.cellSize);
          var radiusSq = radius * radius;

          for (var gx = cx - cellRange; gx <= cx + cellRange; gx++) {
            for (var gz = cz - cellRange; gz <= cz + cellRange; gz++) {
              var list = enemyGrid.get(this.getKey(gx, gz));
              if (!list) continue;

              for (var i = 0; i < list.length; i++) {
                var unit = list[i];
                if (!unit) continue;
                if (!unit.node.activeInHierarchy) continue;
                if (!unit.agent) continue;
                if (!unit.props || unit.props.isDead()) continue;
                var dx = unit.agent.pos.x - x;
                var dz = unit.agent.pos.z - z;
                var d = dx * dx + dz * dz;

                if (d <= radiusSq) {
                  this.tempResult.push(unit);
                }
              }
            }
          }

          return this.tempResult;
        }

        findNearestEnemy(team, x, z, radius) {
          var enemyGrid = this.getEnemyGrid(team);
          var cellRange = Math.ceil(radius / this.cellSize);
          var cx = Math.floor(x / this.cellSize);
          var cz = Math.floor(z / this.cellSize);
          var radiusSq = radius * radius;
          this.nearestSearchBest = null;
          this.nearestSearchBestDistSq = Infinity;

          for (var ring = 0; ring <= cellRange; ring++) {
            var ringMinDistSq = this.getRingMinDistanceSq(cx, cz, ring, x, z);

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

          var minX = cx - ring;
          var maxX = cx + ring;
          var minZ = cz - ring;
          var maxZ = cz + ring;

          for (var gx = minX; gx <= maxX; gx++) {
            this.scanCellForNearest(enemyGrid, gx, minZ, x, z, radiusSq);
            this.scanCellForNearest(enemyGrid, gx, maxZ, x, z, radiusSq);
          }

          for (var gz = minZ + 1; gz <= maxZ - 1; gz++) {
            this.scanCellForNearest(enemyGrid, minX, gz, x, z, radiusSq);
            this.scanCellForNearest(enemyGrid, maxX, gz, x, z, radiusSq);
          }
        }

        scanCellForNearest(enemyGrid, gx, gz, x, z, radiusSq) {
          var list = enemyGrid.get(this.getKey(gx, gz));
          if (!list) return;

          for (var i = 0; i < list.length; i++) {
            var unit = list[i];
            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props || unit.props.isDead()) continue;
            var dx = unit.agent.pos.x - x;
            var dz = unit.agent.pos.z - z;
            var d = dx * dx + dz * dz;
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

        getMaxEnemyRadius(team) {
          return team === 0 ? this.teamBMaxRadius : this.teamAMaxRadius;
        }

        requestNearestEnemy(unit, team, x, z, radius, callback, callbackToken) {
          if (callbackToken === void 0) {
            callbackToken = -1;
          }

          if (!this.canUseWorkerTargetQuery()) {
            return false;
          }

          if (this.targetSnapshotLength <= 0) {
            return false;
          }

          var request = this.getNearestRequest(unit, team, x, z, radius, callback, callbackToken);
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
          var row = this.gridKeyRows.get(x);

          if (!row) {
            row = new Map();
            this.gridKeyRows.set(x, row);
          }

          var key = row.get(z);

          if (!key) {
            key = x + "_" + z;
            row.set(z, key);
          }

          return key;
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

          var requests = this.pendingNearestRequests;
          var packedCapacity = requests.length * 5;
          this.ensurePackedRequestCapacity(packedCapacity);
          var packedRequests = this.packedRequestData;
          var packedLength = 0;
          var unitData = this.targetSnapshot.subarray(0, this.targetSnapshotLength);
          var unitLength = this.targetSnapshotLength;

          for (var i = 0; i < requests.length; i++) {
            var request = requests[i];

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

          var requestData = packedRequests.subarray(0, packedLength);

          try {
            var seq = ++this.workerSeq;
            this.worker.postMessage({
              type: 'findNearestBatch',
              seq,
              cellSize: this.cellSize,
              units: unitData,
              unitLength,
              requests: requestData,
              requestLength: packedLength
            });
            this.armWorkerResponseTimeout(seq);
          } catch (err) {
            this.failWorkerAndCompleteRequests();
          }
        }

        clearActiveGridCells(activeCells) {
          for (var i = 0; i < activeCells.length; i++) {
            activeCells[i].length = 0;
          }

          activeCells.length = 0;
        }

        applyWorkerResults(results) {
          for (var i = 0; i < results.length; i += 3) {
            var requestId = results[i];
            var targetId = results[i + 1];
            var targetLifeId = results[i + 2];
            var request = this.activeNearestRequests.get(requestId);
            this.activeNearestRequests.delete(requestId);
            if (!request) continue;
            var callback = request.callback;
            var callbackToken = request.callbackToken;

            if (!this.isValidRequestUnit(request.unit, request.unitLifeId)) {
              callback(null, callbackToken);
              this.recycleNearestRequest(request);
              continue;
            }

            var _target = this.unitsById.get(targetId);

            if (!_target || !this.isValidTargetUnit(_target, targetLifeId)) {
              callback(null, callbackToken);
              this.recycleNearestRequest(request);
              continue;
            }

            callback(_target, callbackToken);
            this.recycleNearestRequest(request);
          }
        }

        completeActiveRequestsOnMainThread() {
          var requests = Array.from(this.activeNearestRequests.values());
          this.activeNearestRequests.clear();

          for (var i = 0; i < requests.length; i++) {
            var request = requests[i];
            var callback = request.callback;
            var callbackToken = request.callbackToken;

            if (!this.isValidRequestUnit(request.unit, request.unitLifeId)) {
              callback(null, callbackToken);
              this.recycleNearestRequest(request);
              continue;
            }

            callback(this.findNearestEnemy(request.team, request.x, request.z, request.radius), callbackToken);
            this.recycleNearestRequest(request);
          }
        }

        completePendingRequestsOnMainThread() {
          var requests = this.pendingNearestRequests;
          this.pendingNearestRequests = [];

          for (var i = 0; i < requests.length; i++) {
            var request = requests[i];
            var callback = request.callback;
            var callbackToken = request.callbackToken;

            if (!this.isValidRequestUnit(request.unit, request.unitLifeId)) {
              callback(null, callbackToken);
              this.recycleNearestRequest(request);
              continue;
            }

            callback(this.findNearestEnemy(request.team, request.x, request.z, request.radius), callbackToken);
            this.recycleNearestRequest(request);
          }
        }

        armWorkerResponseTimeout(seq) {
          if (this.workerResponseTimeout !== null) {
            return;
          }

          this.workerResponseTimeoutSeq = seq;
          this.workerResponseTimeout = setTimeout(() => {
            this.workerResponseTimeout = null;

            if (this.lastCompletedWorkerSeq >= this.workerResponseTimeoutSeq) {
              return;
            }

            this.failWorkerAndCompleteRequests();
          }, BattleSpatialGrid.workerResponseTimeoutMs);
        }

        completeWorkerBatch(seq) {
          this.lastCompletedWorkerSeq = Math.max(this.lastCompletedWorkerSeq, seq);

          if (this.workerResponseTimeout !== null && seq >= this.workerResponseTimeoutSeq) {
            this.clearWorkerResponseTimeout();
          }

          if (this.activeNearestRequests.size > 0) {
            this.armWorkerResponseTimeout(seq + 1);
          }
        }

        clearWorkerResponseTimeout() {
          if (this.workerResponseTimeout !== null) {
            clearTimeout(this.workerResponseTimeout);
            this.workerResponseTimeout = null;
          }

          this.workerResponseTimeoutSeq = 0;
        }

        failWorkerAndCompleteRequests() {
          this.clearWorkerResponseTimeout();
          this.workerFailed = true;
          this.workerReady = false;

          if (this.worker) {
            this.worker.terminate();
            this.worker = null;
          }

          this.completeActiveRequestsOnMainThread();
          this.completePendingRequestsOnMainThread();
        }

        getNearestRequest(unit, team, x, z, radius, callback, callbackToken) {
          var request = this.nearestRequestPool.pop() || {
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
          for (var i = 0; i < requests.length; i++) {
            this.recycleNearestRequest(requests[i]);
          }
        }

        recycleActiveNearestRequests() {
          this.activeNearestRequests.forEach(request => {
            this.recycleNearestRequest(request);
          });
        }

        isValidRequestUnit(unit, lifeId) {
          if (lifeId === void 0) {
            lifeId = -1;
          }

          if (!unit) return false;
          if (lifeId >= 0 && unit.lifeId !== lifeId) return false;
          if (!unit.node.activeInHierarchy) return false;
          if (!unit.agent) return false;
          if (!unit.props || unit.props.isDead()) return false;
          return true;
        }

        isValidTargetUnit(unit, lifeId) {
          if (lifeId === void 0) {
            lifeId = -1;
          }

          return this.isValidRequestUnit(unit, lifeId);
        }

        getUnitId(unit) {
          var id = this.unitIds.get(unit);

          if (!id) {
            id = this.nextUnitId++;
            this.unitIds.set(unit, id);
          }

          return id;
        }

        appendTargetSnapshot(id, lifeId, team, x, z) {
          this.ensureTargetSnapshotCapacity(this.targetSnapshotLength + 5);
          var data = this.targetSnapshot;
          var index = this.targetSnapshotLength;
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

          var capacity = Math.max(length, this.targetSnapshot.length * 2, 256);
          var next = new Float64Array(capacity);
          next.set(this.targetSnapshot.subarray(0, this.targetSnapshotLength));
          this.targetSnapshot = next;
        }

        ensurePackedRequestCapacity(length) {
          if (this.packedRequestData.length >= length) {
            return;
          }

          var capacity = Math.max(length, this.packedRequestData.length * 2, 128);
          this.packedRequestData = new Float64Array(capacity);
        }

        createWorker() {
          if (typeof Worker === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
            this.workerFailed = true;
            return;
          }

          try {
            var blob = new Blob([this.workerSource()], {
              type: 'application/javascript'
            });
            var url = URL.createObjectURL(blob);
            this.worker = this.createNamedWorker(url, 'BattleSpatialGridTargetWorker');
            URL.revokeObjectURL(url);

            this.worker.onmessage = event => {
              var data = event.data;
              if (!data) return;

              if (data.type === 'ready') {
                this.workerReady = true;
                return;
              }

              if (data.type === 'findNearestBatchResult') {
                this.applyWorkerResults(data.results || []);
                this.completeWorkerBatch(data.seq || 0);
              }
            };

            this.worker.onerror = () => {
              this.failWorkerAndCompleteRequests();
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
          return "\nvar gridKeyRows = Object.create(null);\n\nfunction getKey(x, z) {\n    var row = gridKeyRows[x];\n\n    if (!row) {\n        row = Object.create(null);\n        gridKeyRows[x] = row;\n    }\n\n    var result = row[z];\n\n    if (!result) {\n        result = x + '_' + z;\n        row[z] = result;\n    }\n\n    return result;\n}\n\nvar teamAGrid = Object.create(null);\nvar teamBGrid = Object.create(null);\nvar teamAGridKeys = [];\nvar teamBGridKeys = [];\nvar resultBuffer = new Float64Array(0);\nvar bestId = 0;\nvar bestLifeId = 0;\nvar bestDistSq = Infinity;\n\nfunction getCellMinDistanceSq(gx, gz, x, z, cellSize) {\n    return getRectMinDistanceSq(gx, gx, gz, gz, x, z, cellSize);\n}\n\nfunction getRectMinDistanceSq(minGx, maxGx, minGz, maxGz, x, z, cellSize) {\n    if (minGx > maxGx || minGz > maxGz) {\n        return Infinity;\n    }\n\n    var minX = minGx * cellSize;\n    var maxX = (maxGx + 1) * cellSize;\n    var minZ = minGz * cellSize;\n    var maxZ = (maxGz + 1) * cellSize;\n    var dx = 0;\n    var dz = 0;\n\n    if (x < minX) {\n        dx = minX - x;\n    } else if (x > maxX) {\n        dx = x - maxX;\n    }\n\n    if (z < minZ) {\n        dz = minZ - z;\n    } else if (z > maxZ) {\n        dz = z - maxZ;\n    }\n\n    return dx * dx + dz * dz;\n}\n\nfunction scanCell(grid, gx, gz, x, z, radiusSq) {\n    var list = grid[getKey(gx, gz)];\n\n    if (!list) return;\n\n    for (var i = 0; i < list.length; i += 5) {\n        var id = list[i];\n        var lifeId = list[i + 1];\n        var ux = list[i + 3];\n        var uz = list[i + 4];\n        var dx = ux - x;\n        var dz = uz - z;\n        var d = dx * dx + dz * dz;\n\n        if (d > radiusSq) continue;\n\n        if (d < bestDistSq) {\n            bestDistSq = d;\n            bestId = id;\n            bestLifeId = lifeId;\n        }\n    }\n}\n\nfunction findNearest(grid, x, z, radius, cellSize) {\n    var cellRange = Math.ceil(radius / cellSize);\n    var cx = Math.floor(x / cellSize);\n    var cz = Math.floor(z / cellSize);\n    var radiusSq = radius * radius;\n    bestId = 0;\n    bestLifeId = 0;\n    bestDistSq = Infinity;\n\n    for (var ring = 0; ring <= cellRange; ring++) {\n        var ringMinDistSq;\n\n        if (ring <= 0) {\n            ringMinDistSq = getCellMinDistanceSq(cx, cz, x, z, cellSize);\n        } else {\n            var minX = cx - ring;\n            var maxX = cx + ring;\n            var minZ = cz - ring;\n            var maxZ = cz + ring;\n\n            ringMinDistSq = Math.min(\n                getRectMinDistanceSq(minX, minX, minZ + 1, maxZ - 1, x, z, cellSize),\n                getRectMinDistanceSq(maxX, maxX, minZ + 1, maxZ - 1, x, z, cellSize),\n                getRectMinDistanceSq(minX, maxX, minZ, minZ, x, z, cellSize),\n                getRectMinDistanceSq(minX, maxX, maxZ, maxZ, x, z, cellSize)\n            );\n        }\n\n        if (ringMinDistSq > radiusSq) {\n            break;\n        }\n\n        if (bestId && ringMinDistSq > bestDistSq) {\n            break;\n        }\n\n        if (ring <= 0) {\n            scanCell(grid, cx, cz, x, z, radiusSq);\n            continue;\n        }\n\n        var left = cx - ring;\n        var right = cx + ring;\n        var bottom = cz - ring;\n        var top = cz + ring;\n\n        for (var gx = left; gx <= right; gx++) {\n            scanCell(grid, gx, bottom, x, z, radiusSq);\n            scanCell(grid, gx, top, x, z, radiusSq);\n        }\n\n        for (var gz = bottom + 1; gz <= top - 1; gz++) {\n            scanCell(grid, left, gz, x, z, radiusSq);\n            scanCell(grid, right, gz, x, z, radiusSq);\n        }\n    }\n\n    return bestId;\n}\n\nfunction clearGrid(grid, keys) {\n    for (var i = 0; i < keys.length; i++) {\n        var list = grid[keys[i]];\n\n        if (list) {\n            list.length = 0;\n        }\n    }\n\n    keys.length = 0;\n}\n\nfunction buildGrid(units, unitLength, team, cellSize, grid, keys) {\n    clearGrid(grid, keys);\n\n    for (var i = 0; i < unitLength; i += 5) {\n        if (units[i + 2] !== team) continue;\n\n        var x = units[i + 3];\n        var z = units[i + 4];\n        var gx = Math.floor(x / cellSize);\n        var gz = Math.floor(z / cellSize);\n        var key = getKey(gx, gz);\n        var list = grid[key];\n\n        if (!list) {\n            list = [];\n            grid[key] = list;\n        }\n\n        if (list.length <= 0) {\n            keys.push(key);\n        }\n\n        list.push(\n            units[i],\n            units[i + 1],\n            units[i + 2],\n            x,\n            z\n        );\n    }\n\n    return grid;\n}\n\nfunction ensureResultCapacity(length) {\n    if (resultBuffer.length >= length) {\n        return resultBuffer;\n    }\n\n    var capacity = Math.max(\n        length,\n        resultBuffer.length * 2,\n        64\n    );\n\n    resultBuffer = new Float64Array(capacity);\n\n    return resultBuffer;\n}\n\nself.onmessage = function(event) {\n    var data = event.data;\n\n    if (!data) return;\n\n    if (data.type === 'findNearestBatch') {\n        var units = data.units || [];\n        var unitLength = data.unitLength || units.length;\n        var requests = data.requests || [];\n        var requestLength = data.requestLength || requests.length;\n        var cellSize = Math.max(0.001, data.cellSize || 4);\n        var requestCount = Math.floor(requestLength / 5);\n        var teamA = buildGrid(\n            units,\n            unitLength,\n            0,\n            cellSize,\n            teamAGrid,\n            teamAGridKeys\n        );\n        var teamB = buildGrid(\n            units,\n            unitLength,\n            1,\n            cellSize,\n            teamBGrid,\n            teamBGridKeys\n        );\n        var results = ensureResultCapacity(\n            requestCount * 3\n        );\n        var resultLength = 0;\n\n        for (var i = 0; i < requestLength; i += 5) {\n            var requestId = requests[i];\n            var team = requests[i + 1];\n            var x = requests[i + 2];\n            var z = requests[i + 3];\n            var radius = requests[i + 4];\n            var grid = team === 0\n                ? teamB\n                : teamA;\n\n            results[resultLength++] = requestId;\n            results[resultLength++] =\n                findNearest(grid, x, z, radius, cellSize);\n            results[resultLength++] = bestLifeId;\n        }\n\n        self.postMessage({\n            type: 'findNearestBatchResult',\n            seq: data.seq,\n            results: results.subarray(0, resultLength)\n        });\n    }\n};\n\nself.postMessage({ type: 'ready' });\n";
        }

        getRingMinDistanceSq(cx, cz, ring, x, z) {
          if (ring <= 0) {
            return this.getCellMinDistanceSq(cx, cz, x, z);
          }

          var minX = cx - ring;
          var maxX = cx + ring;
          var minZ = cz - ring;
          var maxZ = cz + ring;
          var left = this.getRectMinDistanceSq(minX, minX, minZ + 1, maxZ - 1, x, z);
          var right = this.getRectMinDistanceSq(maxX, maxX, minZ + 1, maxZ - 1, x, z);
          var bottom = this.getRectMinDistanceSq(minX, maxX, minZ, minZ, x, z);
          var top = this.getRectMinDistanceSq(minX, maxX, maxZ, maxZ, x, z);
          return Math.min(left, right, bottom, top);
        }

        getCellMinDistanceSq(gx, gz, x, z) {
          return this.getRectMinDistanceSq(gx, gx, gz, gz, x, z);
        }

        getRectMinDistanceSq(minGx, maxGx, minGz, maxGz, x, z) {
          if (minGx > maxGx || minGz > maxGz) {
            return Infinity;
          }

          var minX = minGx * this.cellSize;
          var maxX = (maxGx + 1) * this.cellSize;
          var minZ = minGz * this.cellSize;
          var maxZ = (maxGz + 1) * this.cellSize;
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

        getEnemyGrid(team) {
          return team === 0 ? this.teamBGrid : this.teamAGrid;
        }

      });

      BattleSpatialGrid.workerResponseTimeoutMs = 2000;

      BattleSpatialGrid.noopNearestEnemyCallback = () => {};

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5d8e4021ccee3efd23657fb998ca8d2669ce83fb.js.map