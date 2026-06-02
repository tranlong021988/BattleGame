System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, UnitType, BattleWave, _crd;

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitType(extras) {
    _reporterNs.report("UnitType", "./BattleTypes", _context.meta, extras);
  }

  _export("BattleWave", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      UnitType = _unresolved_2.UnitType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2d08duCH6RMR4qPFCZCa+i3", "BattleWave", undefined);

      _export("BattleWave", BattleWave = class BattleWave {
        constructor(id, team, unitName, unitType, totalCount) {
          this.id = 0;
          this.team = 0;
          this.unitName = '';
          this.unitType = (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
          this.totalCount = 0;
          this.units = [];
          this.assignedCounterCount = 0;
          this.id = id;
          this.team = team;
          this.unitName = unitName;
          this.unitType = unitType;
          this.totalCount = totalCount;
        }

        addUnit(unit) {
          if (!unit) return;
          BattleWave.unitWaveMap.set(unit, this.id);

          if (this.units.indexOf(unit) < 0) {
            this.units.push(unit);
          }
        }

        addCounterAssignment(count) {
          this.assignedCounterCount += Math.max(1, Math.floor(count));
        }

        getAliveCount() {
          var count = 0;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            count++;
          }

          return count;
        }

        getAliveRatio() {
          if (this.totalCount <= 0) {
            return 0;
          }

          return this.getAliveCount() / this.totalCount;
        }

        getCounterCoverageRatio() {
          var alive = this.getAliveCount();

          if (alive <= 0) {
            return 1;
          }

          return this.assignedCounterCount / alive;
        }

        isCounterCovered(requiredCoverageRatio) {
          return this.getCounterCoverageRatio() >= requiredCoverageRatio;
        }

        hasEngaged() {
          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;

            if (u.onBusy) {
              return true;
            }
          }

          return false;
        }

        isDead() {
          return this.getAliveCount() <= 0;
        }

        getAverageX() {
          var sum = 0;
          var count = 0;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.agent) continue;
            sum += u.agent.pos.x;
            count++;
          }

          if (count <= 0) return 0;
          return sum / count;
        }

        getAverageZ() {
          var sum = 0;
          var count = 0;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.agent) continue;
            sum += u.agent.pos.z;
            count++;
          }

          if (count <= 0) return 0;
          return sum / count;
        }

        getClosestDistanceSqTo(x, z) {
          var best = Infinity;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.agent) continue;
            var dx = u.agent.pos.x - x;
            var dz = u.agent.pos.z - z;
            var d = dx * dx + dz * dz;

            if (d < best) {
              best = d;
            }
          }

          return best;
        }

        isUnitAlive(unit) {
          if (!unit) return false;
          var currentWaveId = BattleWave.unitWaveMap.get(unit);

          if (currentWaveId !== this.id) {
            return false;
          }

          if (!unit.node.activeInHierarchy) return false;
          if (!unit.agent) return false;
          if (!unit.props) return false;
          if (unit.props.isDead()) return false;
          return true;
        }

      });

      BattleWave.unitWaveMap = new WeakMap();

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fa619e64265067b189410ec6fb7828f10372d771.js.map