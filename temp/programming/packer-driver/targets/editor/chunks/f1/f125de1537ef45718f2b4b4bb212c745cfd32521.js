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
        constructor(id, team, unitName, unitType, totalCount, laneId = -1) {
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
          this.combatModeActive = false;
          this.released = false;
          this.runtimeStateFrame = -1;
          this.runtimeAliveCount = 0;
          this.runtimeHasEngaged = false;
          this.runtimeTargetFrame = -1;
          this.runtimeHasValidTarget = false;
          this.forwardScannerFrame = -1;
          this.forwardScannerUnit = null;
          this.noTargetSinceFrame = -1;
          this.aliveSortBuffer = [];
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

          let count = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
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

          let best = null;
          let bestPriority = -1;
          let bestCount = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            const priority = u.onForward ? 2 : !u.onBusy ? 1 : 0;

            if (priority > bestPriority) {
              bestPriority = priority;
              bestCount = 1;
              best = u;
              continue;
            }

            if (priority === bestPriority) {
              bestCount++;

              if (Math.random() * bestCount < 1) {
                best = u;
              }
            }
          }

          return best;
        }

        getCounterCoverageRatio() {
          const alive = this.getAliveCount();

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

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
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

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
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

        hasAnyValidTarget() {
          return this.scanHasAnyValidTarget();
        }

        hasAnyValidTargetRuntime(frame) {
          if (this.runtimeTargetFrame === frame) {
            return this.runtimeHasValidTarget;
          }

          this.runtimeTargetFrame = frame;
          this.runtimeHasValidTarget = this.scanHasAnyValidTarget();
          return this.runtimeHasValidTarget;
        }

        scanHasAnyValidTarget() {
          if (this.released) {
            return false;
          }

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.hasValidEnemyTarget()) continue;
            return true;
          }

          return false;
        }

        findSharedTargetForUnit(requester) {
          if (this.released) return null;
          if (!this.isUnitAlive(requester)) return null;
          if (!requester.agent) return null;
          let best = null;
          let bestDistSq = Infinity;

          for (let i = 0; i < this.units.length; i++) {
            const ally = this.units[i];
            if (ally === requester) continue;
            if (!this.isUnitAlive(ally)) continue;
            const target = ally.getValidEnemyTarget();
            if (!target) continue;
            const dx = target.agent.pos.x - requester.agent.pos.x;
            const dz = target.agent.pos.z - requester.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d < bestDistSq) {
              bestDistSq = d;
              best = target;
            }
          }

          return best;
        }

        shouldRecoverNoTarget(frame, delayFrames) {
          if (this.released) return false;

          if (this.hasEngagedRuntime(frame) || this.hasAnyValidTargetRuntime(frame)) {
            this.noTargetSinceFrame = -1;
            return false;
          }

          if (this.noTargetSinceFrame < 0) {
            this.noTargetSinceFrame = frame;
            return false;
          }

          const delay = Math.max(0, Math.floor(delayFrames));
          return frame - this.noTargetSinceFrame >= delay;
        }

        isTargetingWave(targetWave) {
          if (this.released) return false;
          if (!targetWave) return false;
          if (targetWave === this) return false;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            const target = u.getValidEnemyTarget();
            if (!target) continue;

            if (BattleWave.getWaveForUnit(target) === targetWave) {
              return true;
            }
          }

          return false;
        }

        isEngagedWithOtherWave(targetWave) {
          if (this.released) return false;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.onBusy) continue;
            const target = u.getValidEnemyTarget();
            if (!target) continue;
            const enemyWave = BattleWave.getWaveForUnit(target);

            if (enemyWave && enemyWave !== targetWave) {
              return true;
            }
          }

          return false;
        }

        setLaneId(laneId, formationWidth = 1, unitSpacing = 1.5) {
          if (this.released) return;
          this.laneId = laneId;
          this.assignLaneOffsets(formationWidth, unitSpacing);

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.laneId = laneId;
          }
        }

        resumeForward() {
          if (this.released) return false;
          if (this.hasEngaged()) return false;
          this.combatModeActive = false;
          this.noTargetSinceFrame = -1;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.setWaveForwardLane(this.laneId, u.forwardLaneOffsetX);
          }

          return true;
        }

        releaseForwardToFreeHunt(searchRange = 0) {
          if (this.released) return;
          this.combatModeActive = false;
          this.forwardScannerUnit = null;
          this.forwardScannerFrame = -1;
          this.noTargetSinceFrame = -1;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.enterWaveFreeHuntMode(searchRange);
          }
        }

        clearLaneControl() {
          if (this.released) return;
          this.combatModeActive = false;
          this.forwardScannerUnit = null;
          this.forwardScannerFrame = -1;
          this.noTargetSinceFrame = -1;
        }

        enterCombatMode() {
          if (this.released) return;
          this.combatModeActive = true;
          this.noTargetSinceFrame = -1;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.enterWaveCombatMode();
          }
        }

        captureCurrentLaneOffsets(laneCenterX) {
          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.agent) continue;
            u.forwardLaneOffsetX = u.agent.pos.x - laneCenterX;
          }
        }

        assignLaneOffsets(formationWidth, unitSpacing) {
          const aliveUnits = this.getAliveUnitsSortedByX();
          const count = aliveUnits.length;
          if (count <= 0) return;
          const columns = Math.max(1, Math.min(Math.floor(formationWidth), count));
          const spacing = Math.max(0.01, unitSpacing);

          for (let i = 0; i < count; i++) {
            const col = Math.min(columns - 1, Math.floor(i * columns / count));
            aliveUnits[i].forwardLaneOffsetX = (col - (columns - 1) * 0.5) * spacing;
          }
        }

        getAliveUnitsSortedByX() {
          const result = this.aliveSortBuffer;
          result.length = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            result.push(u);
          }

          result.sort((a, b) => {
            const ax = a.agent ? a.agent.pos.x : 0;
            const bx = b.agent ? b.agent.pos.x : 0;
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
          this.combatModeActive = false;
          this.assignedCounterCount = 0;
          this.runtimeStateFrame = -1;
          this.runtimeAliveCount = 0;
          this.runtimeHasEngaged = false;
          this.runtimeTargetFrame = -1;
          this.runtimeHasValidTarget = false;
          this.forwardScannerFrame = -1;
          this.forwardScannerUnit = null;
          this.noTargetSinceFrame = -1;
          this.aliveSortBuffer.length = 0;
          this.units.length = 0;
        }

        canUnitRunForwardScan(unit, frame) {
          if (this.released) return true;
          if (!this.isUnitAlive(unit)) return false;
          const shouldPick = !this.isForwardScannerEligible(this.forwardScannerUnit) || this.forwardScannerFrame !== frame;

          if (shouldPick) {
            this.pickFrontMostForwardScanner();
            this.forwardScannerFrame = frame;
          }

          return this.forwardScannerUnit === unit;
        }

        getAverageX() {
          if (this.released) return 0;
          let sum = 0;
          let count = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
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
          let sum = 0;
          let count = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
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
          let best = Infinity;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.agent) continue;
            const dx = u.agent.pos.x - x;
            const dz = u.agent.pos.z - z;
            const d = dx * dx + dz * dz;

            if (d < best) {
              best = d;
            }
          }

          return best;
        }

        pickFrontMostForwardScanner() {
          this.forwardScannerUnit = null;
          let bestScore = -Infinity;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isForwardScannerEligible(u)) continue;
            const score = u.agent.pos.x * u.forwardDir.x + u.agent.pos.z * u.forwardDir.z;

            if (score > bestScore) {
              bestScore = score;
              this.forwardScannerUnit = u;
            }
          }
        }

        isForwardScannerEligible(unit) {
          if (!this.isUnitAlive(unit)) return false;
          if (!unit.agent) return false;
          if (!unit.onForward) return false;
          if (unit.returningToWaveLaneSlot) return false;
          return true;
        }

        isUnitAlive(unit) {
          if (this.released) return false;
          if (!unit) return false;
          const currentWaveId = BattleWave.unitWaveMap.get(unit);

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