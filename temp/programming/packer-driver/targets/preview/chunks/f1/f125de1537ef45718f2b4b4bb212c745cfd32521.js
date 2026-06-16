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
        constructor(id, team, unitName, unitType, totalCount, laneId) {
          if (laneId === void 0) {
            laneId = -1;
          }

          this.id = 0;
          this.team = 0;
          this.unitName = '';
          this.unitType = (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
          this.totalCount = 0;
          this.units = [];
          this.assignedCounterCount = 0;
          this.laneId = -1;
          this.pendingLaneId = -1;
          this.lastEngagedEnemyLaneId = -1;
          this.combatModeActive = false;
          this.released = false;
          this.runtimeStateFrame = -1;
          this.runtimeAliveCount = 0;
          this.runtimeHasEngaged = false;
          this.id = id;
          this.team = team;
          this.unitName = unitName;
          this.unitType = unitType;
          this.totalCount = totalCount;
          this.laneId = laneId;
        }

        addUnit(unit) {
          if (!unit) return;
          if (this.released) return;
          BattleWave.unitWaveMap.set(unit, this.id);
          BattleWave.unitWaveObjectMap.set(unit, this);

          if (this.units.indexOf(unit) < 0) {
            this.units.push(unit);
          }
        }

        addCounterAssignment(count) {
          this.assignedCounterCount += Math.max(1, Math.floor(count));
        }

        getAliveCount() {
          if (this.released) {
            return 0;
          }

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

        getRandomAliveUnit() {
          return this.getRandomPreferredAliveUnit();
        }

        getRandomPreferredAliveUnit() {
          if (this.released) {
            return null;
          }

          var onForwardUnits = [];
          var notBusyUnits = [];
          var aliveUnits = [];

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            aliveUnits.push(u);

            if (u.onForward) {
              onForwardUnits.push(u);
              continue;
            }

            if (!u.onBusy) {
              notBusyUnits.push(u);
            }
          }

          if (onForwardUnits.length > 0) {
            return this.randomFromList(onForwardUnits);
          }

          if (notBusyUnits.length > 0) {
            return this.randomFromList(notBusyUnits);
          }

          if (aliveUnits.length > 0) {
            return this.randomFromList(aliveUnits);
          }

          return null;
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
          if (this.released) {
            return false;
          }

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;

            if (u.onBusy) {
              return true;
            }
          }

          return false;
        }

        refreshRuntimeState(frame) {
          if (this.runtimeStateFrame === frame) {
            return;
          }

          this.runtimeStateFrame = frame;
          this.runtimeAliveCount = 0;
          this.runtimeHasEngaged = false;

          if (this.released) {
            return;
          }

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            this.runtimeAliveCount++;

            if (u.onBusy) {
              this.runtimeHasEngaged = true;
            }
          }
        }

        getRuntimeAliveCount(frame) {
          this.refreshRuntimeState(frame);
          return this.runtimeAliveCount;
        }

        isDeadRuntime(frame) {
          if (this.released) {
            return true;
          }

          return this.getRuntimeAliveCount(frame) <= 0;
        }

        hasEngagedRuntime(frame) {
          this.refreshRuntimeState(frame);
          return this.runtimeHasEngaged;
        }

        isTargetingWave(targetWave) {
          if (this.released) return false;
          if (!targetWave) return false;
          if (targetWave === this) return false;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.enemy) continue;

            if (BattleWave.getWaveForUnit(u.enemy) === targetWave) {
              return true;
            }
          }

          return false;
        }

        isEngagedWithOtherWave(targetWave) {
          if (this.released) return false;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.onBusy) continue;
            if (!u.enemy) continue;
            var enemyWave = BattleWave.getWaveForUnit(u.enemy);

            if (enemyWave && enemyWave !== targetWave) {
              return true;
            }
          }

          return false;
        }

        hasPendingLaneTransfer() {
          if (this.released) {
            return false;
          }

          return this.pendingLaneId >= 0;
        }

        noteEngagedEnemy(enemy) {
          if (!enemy) return;
          var enemyWave = BattleWave.getWaveForUnit(enemy);

          if (enemyWave && enemyWave.laneId >= 0) {
            this.noteEngagedEnemyLane(enemyWave.laneId);
            return;
          }

          if (enemy.laneId >= 0) {
            this.noteEngagedEnemyLane(enemy.laneId);
          }
        }

        noteEngagedEnemyLane(laneId) {
          if (this.released) return;
          if (laneId < 0) return;
          this.lastEngagedEnemyLaneId = laneId;
        }

        hasLastEngagedEnemyLane() {
          if (this.released) {
            return false;
          }

          return this.lastEngagedEnemyLaneId >= 0;
        }

        preparePendingLaneFromLastEngagedEnemy() {
          if (this.released) {
            return false;
          }

          if (!this.hasLastEngagedEnemyLane()) {
            return false;
          }

          this.pendingLaneId = this.lastEngagedEnemyLaneId;
          return true;
        }

        setPendingLaneId(laneId) {
          if (this.released) return;
          if (laneId < 0) return;
          this.pendingLaneId = laneId;
        }

        tryApplyPendingLaneTransfer(formationWidth, unitSpacing, skipEngagedCheck) {
          if (skipEngagedCheck === void 0) {
            skipEngagedCheck = false;
          }

          if (this.released) {
            return false;
          }

          if (!this.hasPendingLaneTransfer()) {
            return false;
          }

          if (!skipEngagedCheck && this.hasEngaged()) {
            return false;
          }

          this.setLaneId(this.pendingLaneId, formationWidth, unitSpacing);
          this.pendingLaneId = -1;
          this.lastEngagedEnemyLaneId = -1;
          this.resumeForward();
          return true;
        }

        setLaneId(laneId, formationWidth, unitSpacing) {
          if (formationWidth === void 0) {
            formationWidth = 1;
          }

          if (unitSpacing === void 0) {
            unitSpacing = 1.5;
          }

          if (this.released) return;
          this.laneId = laneId;
          this.assignLaneOffsets(formationWidth, unitSpacing);

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.laneId = laneId;
          }
        }

        resumeForward() {
          if (this.released) return;
          this.combatModeActive = false;
          this.lastEngagedEnemyLaneId = -1;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (u.onBusy) continue;
            u.setWaveForwardLane(this.laneId, u.forwardLaneOffsetX);
          }
        }

        releaseForwardToFreeHunt() {
          if (this.released) return;
          this.combatModeActive = false;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.enterWaveFreeHuntMode();
          }
        }

        clearLaneControl() {
          if (this.released) return;
          this.pendingLaneId = -1;
          this.lastEngagedEnemyLaneId = -1;
          this.combatModeActive = false;
        }

        enterCombatMode() {
          if (this.released) return;

          if (this.combatModeActive) {
            return;
          }

          this.combatModeActive = true;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.enterWaveCombatMode();
          }
        }

        captureCurrentLaneOffsets(laneCenterX) {
          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.agent) continue;
            u.forwardLaneOffsetX = u.agent.pos.x - laneCenterX;
          }
        }

        assignLaneOffsets(formationWidth, unitSpacing) {
          var aliveUnits = this.getAliveUnitsSortedByX();
          var count = aliveUnits.length;
          if (count <= 0) return;
          var columns = Math.max(1, Math.min(Math.floor(formationWidth), count));
          var spacing = Math.max(0.01, unitSpacing);

          for (var i = 0; i < count; i++) {
            var col = Math.min(columns - 1, Math.floor(i * columns / count));
            aliveUnits[i].forwardLaneOffsetX = (col - (columns - 1) * 0.5) * spacing;
          }
        }

        getAliveUnitsSortedByX() {
          var result = [];

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            result.push(u);
          }

          result.sort((a, b) => {
            var ax = a.agent ? a.agent.pos.x : 0;
            var bx = b.agent ? b.agent.pos.x : 0;
            return ax - bx;
          });
          return result;
        }

        isDead() {
          if (this.released) {
            return true;
          }

          return this.getAliveCount() <= 0;
        }

        releaseReferences() {
          this.released = true;
          this.pendingLaneId = -1;
          this.lastEngagedEnemyLaneId = -1;
          this.combatModeActive = false;
          this.assignedCounterCount = 0;
          this.runtimeStateFrame = -1;
          this.runtimeAliveCount = 0;
          this.runtimeHasEngaged = false;
          this.units.length = 0;
        }

        getAverageX() {
          if (this.released) return 0;
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
          if (this.released) return 0;
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
          if (this.released) return Infinity;
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

        randomFromList(list) {
          if (list.length <= 0) return null;
          var index = Math.floor(Math.random() * list.length);
          return list[index];
        }

        isUnitAlive(unit) {
          if (this.released) return false;
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

        static getWaveForUnit(unit) {
          if (!unit) return null;
          return BattleWave.unitWaveObjectMap.get(unit) || null;
        }

      });

      BattleWave.unitWaveMap = new WeakMap();
      BattleWave.unitWaveObjectMap = new WeakMap();

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f125de1537ef45718f2b4b4bb212c745cfd32521.js.map