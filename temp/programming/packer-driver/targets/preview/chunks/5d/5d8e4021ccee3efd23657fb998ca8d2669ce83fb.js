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
          this.teamAGrid = new Map();
          this.teamBGrid = new Map();
          this.tempResult = [];
          this.nearestSearchBest = null;
          this.nearestSearchBestDistSq = Infinity;
        }

        build(teamA, teamB) {
          this.teamAGrid.clear();
          this.teamBGrid.clear();
          this.fillGrid(this.teamAGrid, teamA);
          this.fillGrid(this.teamBGrid, teamB);
        }

        fillGrid(grid, units) {
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

        getKey(x, z) {
          return x + "_" + z;
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
//# sourceMappingURL=5d8e4021ccee3efd23657fb998ca8d2669ce83fb.js.map