System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Tween, Vec3, tween, UnitType, BattleWave, _crd;

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
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Tween = _cc.Tween;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
    }, function (_unresolved_2) {
      UnitType = _unresolved_2.UnitType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2d08duCH6RMR4qPFCZCa+i3", "BattleWave", undefined);

      __checkObsolete__(['Node', 'Tween', 'Vec3', 'tween']);

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
          this.released = false;
          this.runtimeStateFrame = -1;
          this.runtimeAliveCount = 0;
          this.runtimeHasEngaged = false;
          this.runtimeHealthFrame = -1;
          this.runtimeHealthRatio = 1;
          this.totalMaxHealth = 0;
          this.targetSearchIntervalFrames = 1;
          this.forwardModeActive = true;
          this.freeHuntActive = false;
          this.permanentFreeHunt = false;
          this.aggressiveForwardMode = false;
          this.initialForwardCombatGateActive = true;
          this.initialForwardCombatReleaseThreshold = 1;
          this.forwardScannerUnit = null;
          this.representativeUnit = null;
          this.waveBannerNode = null;
          this.waveBannerRecycle = null;
          this.waveBannerOnAttached = null;
          this.waveBannerTweenDuration = 0.2;
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
            if (this.units.length <= 0) {
              this.targetSearchIntervalFrames = Math.max(1, Math.floor(unit.targetSearchIntervalFrames));
            }

            if (unit.aggressiveForward) {
              this.aggressiveForwardMode = true;
            }

            if (unit.props) {
              this.totalMaxHealth += Math.max(0, unit.props.maxHealth);
            }

            this.units.push(unit);
            this.runtimeHealthFrame = -1;
          }
        }

        addCounterAssignment(count) {
          this.assignedCounterCount += Math.max(1, Math.floor(count));
        }

        setInitialForwardCombatReleaseThreshold(threshold) {
          this.initialForwardCombatReleaseThreshold = Math.max(1, Math.floor(threshold));
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

        refreshRuntimeHealth(frame) {
          if (this.runtimeHealthFrame === frame) {
            return;
          }

          this.runtimeHealthFrame = frame;

          if (this.released || this.totalMaxHealth <= 0) {
            this.runtimeHealthRatio = 0;
            return;
          }

          var currentHealth = 0;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            currentHealth += Math.max(0, Math.min(u.props.health, u.props.maxHealth));
          }

          this.runtimeHealthRatio = Math.max(0, Math.min(1, currentHealth / this.totalMaxHealth));
        }

        getRuntimeHealthRatio(frame) {
          this.refreshRuntimeHealth(frame);
          return this.runtimeHealthRatio;
        }

        invalidateRuntimeHealth() {
          this.runtimeHealthFrame = -1;
        }

        getRandomAliveUnit() {
          return this.getRandomPreferredAliveUnit();
        }

        getRepresentativeUnit() {
          if (this.isUnitAlive(this.representativeUnit)) {
            return this.representativeUnit;
          }

          this.representativeUnit = this.pickRepresentativeUnit();
          return this.representativeUnit;
        }

        setWaveBanner(node, recycle, tweenDuration, onAttached) {
          if (onAttached === void 0) {
            onAttached = null;
          }

          this.releaseWaveBanner();
          if (!node) return;
          this.waveBannerNode = node;
          this.waveBannerRecycle = recycle;
          this.waveBannerOnAttached = onAttached;
          this.waveBannerTweenDuration = Math.max(0, tweenDuration);
          node.active = true;
          this.refreshWaveBanner(true);
        }

        refreshWaveBanner(force) {
          if (force === void 0) {
            force = false;
          }

          var banner = this.waveBannerNode;
          if (!banner) return false;
          var holder = this.getRepresentativeUnit();

          if (!holder) {
            if (this.getAliveCount() > 0) {
              return false;
            }

            this.releaseWaveBanner();
            return false;
          }

          if (!force && banner.parent === holder.node) {
            return true;
          }

          Tween.stopAllByTarget(banner);
          var hasParent = !!banner.parent;

          if (!hasParent) {
            banner.setParent(holder.node);
            this.resetWaveBannerLocalPosition(banner);
            this.notifyWaveBannerAttached(banner);
            return true;
          }

          banner.setParent(null, true);
          banner.setParent(holder.node, true);
          this.notifyWaveBannerAttached(banner);

          if (this.waveBannerTweenDuration <= 0) {
            this.resetWaveBannerLocalPosition(banner);
            return true;
          }

          tween(banner).to(this.waveBannerTweenDuration, {
            position: new Vec3(0, 0, 0)
          }).start();
          return true;
        }

        resetWaveBannerLocalPosition(banner) {
          var p = banner.position;

          if (Math.abs(p.x) <= 0.0001 && Math.abs(p.y) <= 0.0001 && Math.abs(p.z) <= 0.0001) {
            return;
          }

          banner.setPosition(0, 0, 0);
        }

        setWaveBannerVisible(visible) {
          var banner = this.waveBannerNode;
          if (!banner || !banner.isValid) return;
          if (banner.active === visible) return;
          banner.active = visible;
        }

        getWaveBannerNode() {
          return this.waveBannerNode;
        }

        notifyWaveBannerAttached(banner) {
          var onAttached = this.waveBannerOnAttached;

          if (onAttached) {
            onAttached(banner);
          }
        }

        handleUnitWillDespawn(unit) {
          if (!unit) return;
          if (!this.waveBannerNode) return;

          if (this.representativeUnit !== unit && this.waveBannerNode.parent !== unit.node) {
            return;
          }

          this.representativeUnit = this.pickRepresentativeUnit(unit);

          if (!this.representativeUnit) {
            this.releaseWaveBanner();
            return;
          }

          this.refreshWaveBanner(true);
        }

        releaseWaveBanner() {
          var banner = this.waveBannerNode;

          if (!banner) {
            this.waveBannerRecycle = null;
            this.waveBannerOnAttached = null;
            return;
          }

          if (!banner.isValid) {
            this.waveBannerNode = null;
            this.waveBannerRecycle = null;
            this.waveBannerOnAttached = null;
            return;
          }

          Tween.stopAllByTarget(banner);
          banner.setParent(null, true);
          var recycle = this.waveBannerRecycle;
          this.waveBannerNode = null;
          this.waveBannerRecycle = null;
          this.waveBannerOnAttached = null;

          if (recycle) {
            recycle(banner);
          } else if (banner.isValid) {
            banner.destroy();
          }
        }

        getRandomPreferredAliveUnit() {
          if (this.released) {
            return null;
          }

          var best = null;
          var bestPriority = -1;
          var bestCount = 0;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            var priority = u.onForward ? 2 : !u.onBusy ? 1 : 0;

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

        hasAggressiveForward() {
          return !this.released && this.aggressiveForwardMode;
        }

        isInitialForwardCombatGateActive() {
          return !this.released && this.initialForwardCombatGateActive && this.forwardModeActive && !this.freeHuntActive;
        }

        getInitialForwardCombatReleaseThreshold() {
          return this.initialForwardCombatReleaseThreshold;
        }

        getEngagedCountIncluding(pendingUnit) {
          if (pendingUnit === void 0) {
            pendingUnit = null;
          }

          if (this.released) return 0;
          var count = 0;
          var hasPending = false;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;

            if (u === pendingUnit) {
              hasPending = true;
            }

            if (u.onBusy) {
              count++;
            }
          }

          if (pendingUnit && hasPending && !pendingUnit.onBusy) {
            count++;
          }

          return count;
        }

        findSharedTargetForUnit(requester) {
          if (this.released) return null;
          if (!this.isUnitAlive(requester)) return null;
          if (!requester.agent) return null;
          var best = null;
          var bestDistSq = Infinity;

          for (var i = 0; i < this.units.length; i++) {
            var ally = this.units[i];
            if (ally === requester) continue;
            if (!this.isUnitAlive(ally)) continue;
            var target = ally.getValidEnemyTarget();
            if (!target) continue;
            var dx = target.agent.pos.x - requester.agent.pos.x;
            var dz = target.agent.pos.z - requester.agent.pos.z;
            var d = dx * dx + dz * dz;

            if (d < bestDistSq) {
              bestDistSq = d;
              best = target;
            }
          }

          return best;
        }

        setLaneId(laneId) {
          if (this.released) return;
          this.laneId = laneId;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.laneId = laneId;
          }
        }

        releaseForwardToFreeHunt(searchRange, permanent) {
          if (searchRange === void 0) {
            searchRange = 0;
          }

          if (permanent === void 0) {
            permanent = false;
          }

          if (this.released) return;

          if (permanent) {
            this.permanentFreeHunt = true;
          }

          if (this.freeHuntActive && searchRange <= 0) {
            return;
          }

          this.forwardModeActive = false;
          this.freeHuntActive = true;
          this.aggressiveForwardMode = false;
          this.initialForwardCombatGateActive = false;
          this.forwardScannerUnit = null;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.enterWaveFreeHuntMode(searchRange);
          }
        }

        enterCombatMode() {
          if (this.released) return;
          if (this.freeHuntActive) return;
          this.forwardModeActive = false;
          this.freeHuntActive = true;
          this.aggressiveForwardMode = false;
          this.initialForwardCombatGateActive = false;
          this.forwardScannerUnit = null;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.enterWaveCombatMode();
          }
        }

        forceForwardMode() {
          if (this.released) return false;
          var aliveCount = 0;
          this.forwardModeActive = true;
          this.freeHuntActive = false;
          this.permanentFreeHunt = false;
          this.initialForwardCombatGateActive = false;
          this.forwardScannerUnit = null;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            aliveCount++;
            u.enterWaveForwardMode(this.aggressiveForwardMode);
          }

          return aliveCount > 0;
        }

        getTargetSearchIntervalFrames() {
          return this.targetSearchIntervalFrames;
        }

        isForwardMode() {
          return !this.released && this.forwardModeActive;
        }

        isAggressiveForwardMode() {
          return !this.released && this.aggressiveForwardMode;
        }

        getForwardScanner(refresh) {
          if (refresh === void 0) {
            refresh = false;
          }

          if (!this.isForwardMode()) {
            return null;
          }

          if (!refresh && this.isForwardScannerEligible(this.forwardScannerUnit)) {
            return this.forwardScannerUnit;
          }

          var best = null;
          var bestScore = -Infinity;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.onForward) continue;
            var score = u.agent.pos.x * u.forwardDir.x + u.agent.pos.z * u.forwardDir.z;

            if (score > bestScore) {
              bestScore = score;
              best = u;
            }
          }

          this.forwardScannerUnit = best;
          return this.forwardScannerUnit;
        }

        tryResumeForward() {
          if (this.released) return false;
          if (!this.freeHuntActive) return false;
          if (this.permanentFreeHunt) return false;
          var aliveCount = 0;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            aliveCount++;
            if (u.onBusy) return false;
            if (u.hasValidEnemyTarget()) return false;

            if (!u.hasConfirmedNoTargetSearch()) {
              return false;
            }
          }

          if (aliveCount <= 0) return false;
          this.forwardModeActive = true;
          this.freeHuntActive = false;
          this.initialForwardCombatGateActive = false;
          this.forwardScannerUnit = null;

          for (var _i = 0; _i < this.units.length; _i++) {
            var _u = this.units[_i];
            if (!this.isUnitAlive(_u)) continue;

            _u.enterWaveForwardMode(this.aggressiveForwardMode);
          }

          return true;
        }

        refreshInitialForwardCombatGate() {
          if (!this.isInitialForwardCombatGateActive()) {
            return;
          }

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (u.onBusy) continue;
            if (u.onForward) continue;
            u.enterWaveForwardMode(this.aggressiveForwardMode);
          }
        }

        isDead() {
          if (this.released) {
            return true;
          }

          return this.getAliveCount() <= 0;
        }

        releaseReferences() {
          this.releaseWaveBanner();
          this.released = true;
          this.assignedCounterCount = 0;
          this.runtimeStateFrame = -1;
          this.runtimeAliveCount = 0;
          this.runtimeHasEngaged = false;
          this.runtimeHealthFrame = -1;
          this.runtimeHealthRatio = 0;
          this.totalMaxHealth = 0;
          this.targetSearchIntervalFrames = 1;
          this.forwardModeActive = false;
          this.freeHuntActive = false;
          this.permanentFreeHunt = false;
          this.aggressiveForwardMode = false;
          this.initialForwardCombatGateActive = false;
          this.initialForwardCombatReleaseThreshold = 1;
          this.forwardScannerUnit = null;
          this.representativeUnit = null;
          this.units.length = 0;
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

        isForwardScannerEligible(unit) {
          if (!this.isUnitAlive(unit)) return false;
          return !!unit.onForward;
        }

        pickRepresentativeUnit(excludedUnit) {
          if (excludedUnit === void 0) {
            excludedUnit = null;
          }

          if (this.released) return null;
          var aliveCount = 0;
          var sumX = 0;
          var sumZ = 0;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (u === excludedUnit) continue;
            if (!this.isUnitAlive(u)) continue;
            aliveCount++;
            sumX += u.agent.pos.x;
            sumZ += u.agent.pos.z;
          }

          if (aliveCount <= 0) return null;
          var averageX = sumX / aliveCount;
          var averageZ = sumZ / aliveCount;
          var best = null;
          var bestDistance = Infinity;

          for (var _i2 = 0; _i2 < this.units.length; _i2++) {
            var _u2 = this.units[_i2];
            if (_u2 === excludedUnit) continue;
            if (!this.isUnitAlive(_u2)) continue;
            var distance = (_u2.agent.pos.x - averageX) * (_u2.agent.pos.x - averageX) + (_u2.agent.pos.z - averageZ) * (_u2.agent.pos.z - averageZ);

            if (distance < bestDistance) {
              bestDistance = distance;
              best = _u2;
            }
          }

          return best;
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