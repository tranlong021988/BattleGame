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
          this.targetSnapshot = [];
          this.pendingNearestRequests = [];
          this.activeNearestRequests = new Map();
          this.flushScheduled = false;
        }

        build(teamA, teamB) {
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

        fillGrid(grid, units, team) {
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

            list.push(unit);
            var id = this.getUnitId(unit);
            this.unitsById.set(id, unit);
            this.targetSnapshot.push(id, team, unit.agent.pos.x, unit.agent.pos.z);
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

        requestNearestEnemy(unit, team, x, z, radius, callback) {
          if (!this.canUseWorkerTargetQuery()) {
            return false;
          }

          if (this.targetSnapshot.length <= 0) {
            return false;
          }

          var request = {
            requestId: this.nextRequestId++,
            unit,
            team,
            x,
            z,
            radius,
            callback
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

        getKey(x, z) {
          return x + "_" + z;
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

          var requests = this.pendingNearestRequests.slice();
          this.pendingNearestRequests.length = 0;
          var packedRequests = [];

          for (var i = 0; i < requests.length; i++) {
            var request = requests[i];

            if (!this.isValidRequestUnit(request.unit)) {
              continue;
            }

            this.activeNearestRequests.set(request.requestId, request);
            packedRequests.push(request.requestId, request.team, request.x, request.z, request.radius);
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
              requests: packedRequests
            });
          } catch (err) {
            this.workerFailed = true;
            this.workerReady = false;
            this.completeActiveRequestsOnMainThread();
          }
        }

        applyWorkerResults(results) {
          for (var i = 0; i < results.length; i += 2) {
            var requestId = results[i];
            var targetId = results[i + 1];
            var request = this.activeNearestRequests.get(requestId);
            this.activeNearestRequests.delete(requestId);
            if (!request) continue;

            if (!this.isValidRequestUnit(request.unit)) {
              request.callback(null);
              continue;
            }

            var _target = this.unitsById.get(targetId);

            if (!_target || !this.isValidTargetUnit(_target)) {
              request.callback(null);
              continue;
            }

            request.callback(_target);
          }
        }

        completeActiveRequestsOnMainThread() {
          var requests = Array.from(this.activeNearestRequests.values());
          this.activeNearestRequests.clear();

          for (var i = 0; i < requests.length; i++) {
            var request = requests[i];

            if (!this.isValidRequestUnit(request.unit)) {
              request.callback(null);
              continue;
            }

            request.callback(this.findNearestEnemy(request.team, request.x, request.z, request.radius));
          }
        }

        isValidRequestUnit(unit) {
          if (!unit) return false;
          if (!unit.node.activeInHierarchy) return false;
          if (!unit.agent) return false;
          if (!unit.props || unit.props.isDead()) return false;
          return true;
        }

        isValidTargetUnit(unit) {
          return this.isValidRequestUnit(unit);
        }

        getUnitId(unit) {
          var id = this.unitIds.get(unit);

          if (!id) {
            id = this.nextUnitId++;
            this.unitIds.set(unit, id);
          }

          return id;
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
          return "\nfunction getKey(x, z) {\n    return x + '_' + z;\n}\n\nfunction getCellMinDistanceSq(gx, gz, x, z, cellSize) {\n    return getRectMinDistanceSq(gx, gx, gz, gz, x, z, cellSize);\n}\n\nfunction getRectMinDistanceSq(minGx, maxGx, minGz, maxGz, x, z, cellSize) {\n    if (minGx > maxGx || minGz > maxGz) {\n        return Infinity;\n    }\n\n    var minX = minGx * cellSize;\n    var maxX = (maxGx + 1) * cellSize;\n    var minZ = minGz * cellSize;\n    var maxZ = (maxGz + 1) * cellSize;\n    var dx = 0;\n    var dz = 0;\n\n    if (x < minX) {\n        dx = minX - x;\n    } else if (x > maxX) {\n        dx = x - maxX;\n    }\n\n    if (z < minZ) {\n        dz = minZ - z;\n    } else if (z > maxZ) {\n        dz = z - maxZ;\n    }\n\n    return dx * dx + dz * dz;\n}\n\nfunction scanCell(grid, gx, gz, x, z, radiusSq, best) {\n    var list = grid[getKey(gx, gz)];\n\n    if (!list) return best;\n\n    for (var i = 0; i < list.length; i += 4) {\n        var id = list[i];\n        var ux = list[i + 2];\n        var uz = list[i + 3];\n        var dx = ux - x;\n        var dz = uz - z;\n        var d = dx * dx + dz * dz;\n\n        if (d > radiusSq) continue;\n\n        if (d < best.distSq) {\n            best.distSq = d;\n            best.id = id;\n        }\n    }\n\n    return best;\n}\n\nfunction findNearest(grid, x, z, radius, cellSize) {\n    var cellRange = Math.ceil(radius / cellSize);\n    var cx = Math.floor(x / cellSize);\n    var cz = Math.floor(z / cellSize);\n    var radiusSq = radius * radius;\n    var best = {\n        id: 0,\n        distSq: Infinity\n    };\n\n    for (var ring = 0; ring <= cellRange; ring++) {\n        var ringMinDistSq;\n\n        if (ring <= 0) {\n            ringMinDistSq = getCellMinDistanceSq(cx, cz, x, z, cellSize);\n        } else {\n            var minX = cx - ring;\n            var maxX = cx + ring;\n            var minZ = cz - ring;\n            var maxZ = cz + ring;\n\n            ringMinDistSq = Math.min(\n                getRectMinDistanceSq(minX, minX, minZ + 1, maxZ - 1, x, z, cellSize),\n                getRectMinDistanceSq(maxX, maxX, minZ + 1, maxZ - 1, x, z, cellSize),\n                getRectMinDistanceSq(minX, maxX, minZ, minZ, x, z, cellSize),\n                getRectMinDistanceSq(minX, maxX, maxZ, maxZ, x, z, cellSize)\n            );\n        }\n\n        if (ringMinDistSq > radiusSq) {\n            break;\n        }\n\n        if (best.id && ringMinDistSq > best.distSq) {\n            break;\n        }\n\n        if (ring <= 0) {\n            best = scanCell(grid, cx, cz, x, z, radiusSq, best);\n            continue;\n        }\n\n        var left = cx - ring;\n        var right = cx + ring;\n        var bottom = cz - ring;\n        var top = cz + ring;\n\n        for (var gx = left; gx <= right; gx++) {\n            best = scanCell(grid, gx, bottom, x, z, radiusSq, best);\n            best = scanCell(grid, gx, top, x, z, radiusSq, best);\n        }\n\n        for (var gz = bottom + 1; gz <= top - 1; gz++) {\n            best = scanCell(grid, left, gz, x, z, radiusSq, best);\n            best = scanCell(grid, right, gz, x, z, radiusSq, best);\n        }\n    }\n\n    return best.id;\n}\n\nfunction buildGrid(units, team, cellSize) {\n    var grid = Object.create(null);\n\n    for (var i = 0; i < units.length; i += 4) {\n        if (units[i + 1] !== team) continue;\n\n        var x = units[i + 2];\n        var z = units[i + 3];\n        var gx = Math.floor(x / cellSize);\n        var gz = Math.floor(z / cellSize);\n        var key = getKey(gx, gz);\n        var list = grid[key];\n\n        if (!list) {\n            list = [];\n            grid[key] = list;\n        }\n\n        list.push(\n            units[i],\n            units[i + 1],\n            x,\n            z\n        );\n    }\n\n    return grid;\n}\n\nself.onmessage = function(event) {\n    var data = event.data;\n\n    if (!data) return;\n\n    if (data.type === 'findNearestBatch') {\n        var units = data.units || [];\n        var requests = data.requests || [];\n        var cellSize = Math.max(0.001, data.cellSize || 4);\n        var teamAGrid = buildGrid(units, 0, cellSize);\n        var teamBGrid = buildGrid(units, 1, cellSize);\n        var results = [];\n\n        for (var i = 0; i < requests.length; i += 5) {\n            var requestId = requests[i];\n            var team = requests[i + 1];\n            var x = requests[i + 2];\n            var z = requests[i + 3];\n            var radius = requests[i + 4];\n            var grid = team === 0\n                ? teamBGrid\n                : teamAGrid;\n\n            results.push(\n                requestId,\n                findNearest(grid, x, z, radius, cellSize)\n            );\n        }\n\n        self.postMessage({\n            type: 'findNearestBatchResult',\n            seq: data.seq,\n            results: results\n        });\n    }\n};\n\nself.postMessage({ type: 'ready' });\n";
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

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cdc1b0e51bb50218dcf36e3677682d9c7b3915dc.js.map