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
          var enemyGrid = team === 0 ? this.teamBGrid : this.teamAGrid;
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
          var candidates = this.queryEnemies(team, x, z, radius);
          var best = null;
          var bestDistSq = Infinity;

          for (var i = 0; i < candidates.length; i++) {
            var unit = candidates[i];
            if (!unit.agent) continue;
            var dx = unit.agent.pos.x - x;
            var dz = unit.agent.pos.z - z;
            var d = dx * dx + dz * dz;

            if (d < bestDistSq) {
              bestDistSq = d;
              best = unit;
            }
          }

          return best;
        }

        findNearestEnemyInRange(team, x, z, range) {
          return this.findNearestEnemy(team, x, z, range);
        }

        getKey(x, z) {
          return x + "_" + z;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=5d8e4021ccee3efd23657fb998ca8d2669ce83fb.js.map