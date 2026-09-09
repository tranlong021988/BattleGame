System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Vec3, UnitFamily, BattleWave, _crd;

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
  }

  _export("BattleWave", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      UnitFamily = _unresolved_2.UnitFamily;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2d08duCH6RMR4qPFCZCa+i3", "BattleWave", undefined);

      __checkObsolete__(['Node', 'Vec3']);

      _export("BattleWave", BattleWave = class BattleWave {
        constructor(id, team, unitName, family, tier, totalCount, laneId = -1) {
          this.id = 0;
          this.team = 0;
          this.unitName = '';
          this.family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear;
          this.tier = 1;
          this.totalCount = 0;
          this.units = [];
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
          this.aggressiveForwardMode = false;
          this.freeHuntForwardOrigin = 'normal';
          // Aggressive Forward owns its spawn lane even while Free Hunt pulls
          // individual members into an adjacent lane.
          this.aggressiveForwardOriginLaneId = -1;
          this.aggressiveAdjacentBoundaryObserved = false;
          this.aggressiveOwnLaneBlockObserved = false;
          this.initialForwardCombatGateActive = true;
          // One dynamic scanner per wave. In Forward it must still be marching;
          // in Free Hunt the frontmost alive unit takes the same captain role.
          this.scannerUnit = null;
          // Strategic Free Hunt order. `targetWave` remains the compatibility
          // primary (the first live entry), while the collection is authoritative.
          this.targetWave = null;
          this.targetWaves = [];
          this.regroupLaneAfterTargetClear = -1;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          this.forwardRecoveryLanePrepared = false;
          // Legacy recovery-readiness flag retained for telemetry compatibility.
          // It becomes true immediately when the strategic target set is empty;
          // target death no longer schedules another scanner search.
          this.targetClearSameLaneSearchResolved = false;
          this.forwardRecoveryBlockTelemetryPending = false;
          this.forwardRecoveryDeferredTelemetryPending = false;
          this.clearedTargetTelemetry = [];
          this.targetClearOutcomeTelemetry = null;
          this.immediateTargetSearchPending = false;
          this.lastForwardRecoveryResumedUnitCount = 0;
          this.lastForwardRecoveryRetainedBusyUnitCount = 0;
          this.representativeUnit = null;
          this.waveBannerNode = null;
          this.waveBannerRecycle = null;
          this.waveBannerOnAttached = null;
          this.waveBannerBaseScale = new Vec3(1, 1, 1);
          this.id = id;
          this.team = team;
          this.unitName = unitName;
          this.family = family;
          this.tier = Math.max(1, Math.min(3, Math.floor(tier)));
          this.totalCount = totalCount;
          this.laneId = laneId;
        }

        addUnit(unit) {
          if (!unit) return;
          if (this.released) return;
          const previousWave = BattleWave.unitWaveObjectMap.get(unit);

          if (previousWave && previousWave !== this) {
            previousWave.detachReusedUnitReference(unit);
          }

          BattleWave.unitWaveMap.set(unit, this.id);
          BattleWave.unitWaveObjectMap.set(unit, this);
          unit.setWaveRuntimeId(this.id);
          unit.laneId = this.laneId;

          if (this.units.indexOf(unit) < 0) {
            if (this.units.length <= 0) {
              this.targetSearchIntervalFrames = Math.max(1, Math.floor(unit.targetSearchIntervalFrames));
            }

            if (unit.aggressiveForward) {
              this.aggressiveForwardMode = true;
              this.aggressiveForwardOriginLaneId = this.laneId;
            }

            if (unit.props) {
              this.totalMaxHealth += Math.max(0, unit.props.maxHealth);
            }

            this.units.push(unit);
            this.runtimeHealthFrame = -1;
          }
        }

        detachReusedUnitReference(unit) {
          const index = this.units.indexOf(unit);

          if (index >= 0) {
            this.units.splice(index, 1);
          }

          if (this.scannerUnit === unit) {
            this.scannerUnit = null;
          }

          if (this.representativeUnit === unit) {
            this.representativeUnit = null;
          }

          this.runtimeStateFrame = -1;
          this.runtimeHealthFrame = -1;
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

        getCommandAliveCount() {
          if (this.released) return 0;
          let count = 0;

          for (let i = 0; i < this.units.length; i++) {
            if (this.isCommandUnit(this.units[i])) count++;
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

          let currentHealth = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
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

        invalidateRuntimeState() {
          this.runtimeStateFrame = -1;
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

        setWaveBanner(node, recycle, onAttached = null) {
          this.releaseWaveBanner();
          if (!node) return;
          this.waveBannerNode = node;
          this.waveBannerRecycle = recycle;
          this.waveBannerOnAttached = onAttached;
          this.captureWaveBannerBaseScale(node);
          node.active = true;
          this.refreshWaveBanner(true);
        }

        refreshWaveBanner(force = false) {
          const banner = this.waveBannerNode;
          if (!banner) return false;
          const holder = this.getRepresentativeUnit();

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

          const hasParent = !!banner.parent;

          if (!hasParent) {
            banner.setParent(holder.node);
            this.resetWaveBannerLocalPosition(banner);
            banner.setScale(this.waveBannerBaseScale);
            this.notifyWaveBannerAttached(banner);
            return true;
          }

          this.transferWaveBanner(banner, holder);
          return true;
        }

        transferWaveBanner(banner, holder) {
          banner.setParent(holder.node);
          this.resetWaveBannerLocalPosition(banner);
          banner.setScale(this.waveBannerBaseScale);
          this.notifyWaveBannerAttached(banner);
        }

        resetWaveBannerLocalPosition(banner) {
          const p = banner.position;

          if (Math.abs(p.x) <= 0.0001 && Math.abs(p.y) <= 0.0001 && Math.abs(p.z) <= 0.0001) {
            return;
          }

          banner.setPosition(0, 0, 0);
        }

        captureWaveBannerBaseScale(banner) {
          const scale = banner.scale;

          if (Math.abs(scale.x) <= 0.0001 && Math.abs(scale.y) <= 0.0001 && Math.abs(scale.z) <= 0.0001) {
            this.waveBannerBaseScale.set(1, 1, 1);
            return;
          }

          this.waveBannerBaseScale.set(scale.x, scale.y, scale.z);
        }

        setWaveBannerVisible(visible) {
          const banner = this.waveBannerNode;
          if (!banner || !banner.isValid) return;
          if (banner.active === visible) return;
          banner.active = visible;
        }

        getWaveBannerNode() {
          return this.waveBannerNode;
        }

        notifyWaveBannerAttached(banner) {
          const onAttached = this.waveBannerOnAttached;

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
          const banner = this.waveBannerNode;

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

          banner.setParent(null, true);
          banner.setScale(this.waveBannerBaseScale);
          const recycle = this.waveBannerRecycle;
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

          let best = null;
          let bestPriority = -1;
          let bestCount = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
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

        hasAggressiveForward() {
          return !this.released && this.aggressiveForwardMode;
        }

        hasAggressiveForwardLaneLock() {
          return !this.released && this.aggressiveForwardOriginLaneId >= 0 && (this.aggressiveForwardMode || this.freeHuntForwardOrigin === 'aggressive');
        }

        isInitialForwardCombatGateActive() {
          return !this.released && this.initialForwardCombatGateActive && this.forwardModeActive && !this.freeHuntActive;
        }

        isCommandUnit(unit) {
          return this.isUnitAlive(unit) && !unit.isIsolatedRangedPursuit();
        }

        findSharedTargetForUnit(requester) {
          if (this.released) return null;
          if (!this.isCommandUnit(requester)) return null;
          this.refreshTargetWaves();
          if (this.targetWaves.length <= 0) return null;
          if (!requester.agent) return null;
          let best = null;
          let bestDistSq = Infinity; // Search range is an admission rule for adding a strategic wave.
          // Once admitted, Free Hunt must keep navigating toward that wave
          // until it is eliminated; applying the range again strands idle
          // members whenever the target temporarily moves farther away.

          for (let i = 0; i < this.targetWaves.length; i++) {
            const candidate = this.targetWaves[i].getClosestAliveUnitTo(requester.agent.pos.x, requester.agent.pos.z);
            if (!(candidate != null && candidate.agent)) continue;
            const dx = candidate.agent.pos.x - requester.agent.pos.x;
            const dz = candidate.agent.pos.z - requester.agent.pos.z;
            const distSq = dx * dx + dz * dz;

            if (distSq < bestDistSq) {
              bestDistSq = distSq;
              best = candidate;
            }
          }

          return best;
        }

        getTargetWaveLaneIds() {
          this.refreshTargetWaves();
          return this.targetWaves.map(wave => wave.laneId);
        }

        getTelemetryTargetState() {
          const targetWave = this.getTargetWave();
          const scanner = this.getScanner();
          return {
            targetWaveId: targetWave ? targetWave.id : -1,
            targetWaveIds: this.getTargetWaveIds(),
            targetWaveCount: this.getTargetWaveCount(),
            scannerUnitName: scanner ? scanner.unitTypeName : '',
            scannerLifeId: scanner ? scanner.lifeId : -1,
            scannerBusy: !!(scanner != null && scanner.onBusy),
            scannerForward: !!(scanner != null && scanner.onForward),
            scannerConfirmedNoTarget: this.targetWaves.length <= 0
          };
        }

        getTargetAssignmentTelemetryState() {
          const targetWaves = this.getTargetWaves();
          let aliveUnitCount = 0;
          let busyUnitCount = 0;
          let busyUnitOnAssignedTargetCount = 0;
          let busyUnitOnOtherTargetCount = 0;
          let idleUnitOnAssignedTargetCount = 0;
          let idleUnitWithoutTargetCount = 0;

          for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];
            if (!this.isCommandUnit(unit)) continue;
            aliveUnitCount++;
            const unitTargetWave = BattleWave.getWaveForUnit(unit.getValidEnemyTarget());
            const isOnAssignedTarget = !!unitTargetWave && targetWaves.indexOf(unitTargetWave) >= 0;

            if (unit.onBusy) {
              busyUnitCount++;

              if (isOnAssignedTarget) {
                busyUnitOnAssignedTargetCount++;
              } else {
                busyUnitOnOtherTargetCount++;
              }

              continue;
            }

            if (isOnAssignedTarget) {
              idleUnitOnAssignedTargetCount++;
            } else if (!unit.hasValidEnemyTarget()) {
              idleUnitWithoutTargetCount++;
            }
          }

          return {
            aliveUnitCount,
            busyUnitCount,
            busyUnitOnAssignedTargetCount,
            busyUnitOnOtherTargetCount,
            idleUnitOnAssignedTargetCount,
            idleUnitWithoutTargetCount
          };
        }

        setLaneId(laneId) {
          if (this.released) return;
          this.laneId = laneId;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
            u.laneId = laneId;
          }
        }

        applyDefeatedTargetLaneForRegroup() {
          if (this.hasAggressiveForwardLaneLock()) {
            this.regroupLaneAfterTargetClear = -1;
            this.setLaneId(this.aggressiveForwardOriginLaneId);
            return true;
          }

          if (this.regroupLaneAfterTargetClear < 0) {
            return false;
          }

          const laneId = this.regroupLaneAfterTargetClear;
          this.regroupLaneAfterTargetClear = -1;
          this.setLaneId(laneId);
          return true;
        }

        releaseForwardToFreeHunt(searchRange = 0) {
          if (this.released) return;

          if (this.freeHuntActive && searchRange <= 0) {
            return;
          }

          if (!this.freeHuntActive) {
            this.freeHuntForwardOrigin = this.aggressiveForwardMode ? 'aggressive' : 'normal';
          }

          this.forwardModeActive = false;
          this.freeHuntActive = true;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          this.forwardRecoveryLanePrepared = false;
          this.targetClearSameLaneSearchResolved = false;
          this.aggressiveForwardMode = false;
          this.aggressiveAdjacentBoundaryObserved = false;
          this.aggressiveOwnLaneBlockObserved = false;
          this.initialForwardCombatGateActive = false;
          this.scannerUnit = null;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
            u.enterWaveFreeHuntMode(searchRange);
          }

          this.primeTargetWaveHuntTargets();
        }

        enterCombatMode() {
          if (this.released) return;
          if (this.freeHuntActive) return;
          this.freeHuntForwardOrigin = this.aggressiveForwardMode ? 'aggressive' : 'normal';
          this.forwardModeActive = false;
          this.freeHuntActive = true;
          this.aggressiveForwardMode = false;
          this.aggressiveAdjacentBoundaryObserved = false;
          this.aggressiveOwnLaneBlockObserved = false;
          this.initialForwardCombatGateActive = false;
          this.scannerUnit = null;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
            u.enterWaveCombatMode();
          }

          this.primeTargetWaveHuntTargets();
        }

        forceForwardMode() {
          if (this.released) return false;
          let aliveCount = 0;
          this.forwardModeActive = true;
          this.freeHuntActive = false;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          this.forwardRecoveryLanePrepared = false;
          this.targetClearSameLaneSearchResolved = false;
          this.initialForwardCombatGateActive = true;
          this.scannerUnit = null;
          this.clearTargetWave();

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
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

        isFreeHuntMode() {
          return !this.released && this.freeHuntActive;
        }

        isAggressiveForwardMode() {
          return !this.released && this.aggressiveForwardMode;
        }

        getFreeHuntForwardOrigin() {
          return this.freeHuntForwardOrigin;
        }

        observeAggressiveAdjacentBoundary() {
          if (!this.isAggressiveForwardMode()) return false;
          if (this.aggressiveAdjacentBoundaryObserved) return false;
          this.aggressiveAdjacentBoundaryObserved = true;
          return true;
        }

        observeAggressiveOwnLaneBlock() {
          if (!this.isAggressiveForwardMode()) return false;
          if (this.aggressiveOwnLaneBlockObserved) return false;
          this.aggressiveOwnLaneBlockObserved = true;
          return true;
        }
        /**
         * The single wave scanner. Forward and Free Hunt share the same cache;
         * their mode only changes which units are eligible to lead the search.
         */


        getScanner(refresh = false) {
          if (this.released) return null;
          const requiresForwardUnit = this.isForwardMode();

          if (!requiresForwardUnit && !this.freeHuntActive) {
            return null;
          }

          if (!refresh && this.isScannerEligible(this.scannerUnit, requiresForwardUnit)) {
            return this.scannerUnit;
          }

          this.scannerUnit = this.findFrontmostAliveUnit(requiresForwardUnit);
          return this.scannerUnit;
        }

        isCurrentScanner(unit, refresh = false) {
          if (!unit || this.released) return false;
          const scanner = this.getScanner(refresh);
          return scanner === unit;
        }

        getTargetWave() {
          this.refreshTargetWaves();
          return this.targetWave;
        }

        getTargetWaves() {
          this.refreshTargetWaves();
          return this.targetWaves.slice();
        }

        getTargetWaveIds() {
          this.refreshTargetWaves();
          return this.targetWaves.map(wave => wave.id);
        }

        getTargetWaveCount() {
          this.refreshTargetWaves();
          return this.targetWaves.length;
        }

        hasEngagedTargetWave(targetWave) {
          if (!targetWave) return false;
          this.refreshTargetWaves();
          return this.targetWaves.indexOf(targetWave) >= 0;
        }

        consumeClearedTargetTelemetry() {
          var _this$clearedTargetTe;

          return (_this$clearedTargetTe = this.clearedTargetTelemetry.shift()) != null ? _this$clearedTargetTe : null;
        }

        consumeTargetClearOutcomeTelemetry() {
          const outcome = this.targetClearOutcomeTelemetry;
          this.targetClearOutcomeTelemetry = null;
          return outcome;
        }

        isAwaitingForwardRecoveryAfterTargetClear() {
          return !this.released && this.awaitingForwardRecoveryAfterTargetClear;
        }

        getLastForwardRecoveryResumedUnitCount() {
          return this.lastForwardRecoveryResumedUnitCount;
        }

        getLastForwardRecoveryRetainedBusyUnitCount() {
          return this.lastForwardRecoveryRetainedBusyUnitCount;
        }

        consumeForwardRecoveryBlockTelemetry() {
          if (!this.forwardRecoveryBlockTelemetryPending) {
            return null;
          }

          if (!this.isAwaitingForwardRecoveryAfterTargetClear()) {
            this.forwardRecoveryBlockTelemetryPending = false;
            return null;
          }

          if (this.immediateTargetSearchPending) {
            this.forwardRecoveryBlockTelemetryPending = false;
            return {
              reason: 'target-clear-search-pending',
              unit: null
            };
          }

          for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];
            if (!this.isCommandUnit(unit)) continue;

            if (unit.onBusy) {
              this.forwardRecoveryBlockTelemetryPending = false;
              return {
                reason: 'unit-busy',
                unit
              };
            }

            if (unit.hasValidEnemyTarget()) {
              this.forwardRecoveryBlockTelemetryPending = false;
              return {
                reason: 'unit-has-valid-target',
                unit
              };
            }
          }

          if (!this.targetClearSameLaneSearchResolved) {
            this.forwardRecoveryBlockTelemetryPending = false;
            return {
              reason: 'target-clear-search-unresolved',
              unit: this.getScanner()
            };
          }

          return null;
        }

        consumeForwardRecoveryDeferredTelemetry() {
          var _this$targetWave$id, _this$targetWave;

          if (!this.forwardRecoveryDeferredTelemetryPending) {
            return null;
          }

          this.forwardRecoveryDeferredTelemetryPending = false;

          if (!this.isAwaitingForwardRecoveryAfterTargetClear()) {
            return null;
          }

          let aliveCount = 0;
          let resumableUnitCount = 0;
          let busyUnitCount = 0;

          for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];
            if (!this.isCommandUnit(unit)) continue;
            aliveCount++;

            if (unit.onBusy || unit.hasValidEnemyTarget()) {
              busyUnitCount++;
            } else {
              resumableUnitCount++;
            }
          }

          return {
            freeHuntActive: this.freeHuntActive,
            targetWaveId: (_this$targetWave$id = (_this$targetWave = this.targetWave) == null ? void 0 : _this$targetWave.id) != null ? _this$targetWave$id : -1,
            immediateTargetSearchPending: this.immediateTargetSearchPending,
            targetClearSameLaneSearchResolved: this.targetClearSameLaneSearchResolved,
            aliveCount,
            resumableUnitCount,
            busyUnitCount
          };
        }

        trySetTargetWaveFromScanner(scanner, target) {
          var _this$targetWaves$;

          if (!scanner || !target || this.released) return false;
          if (!this.isCurrentScanner(scanner)) return false;
          const nextTargetWave = BattleWave.getWaveForUnit(target);
          if (!nextTargetWave) return false;
          if (nextTargetWave === this) return false;
          if (nextTargetWave.team === this.team) return false;

          if (nextTargetWave.released || nextTargetWave.getCommandAliveCount() <= 0) {
            return false;
          }

          if (this.hasEngagedTargetWave(nextTargetWave)) {
            return true;
          } // Once a target set is exhausted, regroup is mandatory. A scanner
          // cannot chain a new strategic order out of that recovery phase.


          if (this.awaitingForwardRecoveryAfterTargetClear) {
            return false;
          }

          this.targetWaves.push(nextTargetWave);
          this.targetWave = (_this$targetWaves$ = this.targetWaves[0]) != null ? _this$targetWaves$ : null;
          this.immediateTargetSearchPending = false;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          this.forwardRecoveryLanePrepared = false;
          this.targetClearSameLaneSearchResolved = false;

          if (this.freeHuntActive) {
            this.clearIdleHuntTargets();
            this.primeTargetWaveHuntTargets();
          }

          return true;
        }

        trySetTargetWaveFromEngagement(unit, target) {
          var _this$targetWaves$2;

          if (!unit || !target || this.released) return false;
          if (!this.isCommandUnit(unit)) return false;
          if (target.isIsolatedRangedPursuit()) return false; // The collision callback is raised by whichever unit updates first.
          // Its counterpart may not have run yet, so accept the passive side
          // when the other unit has already entered this same engagement.

          if (!unit.onBusy && !target.onBusy) return false;
          const nextTargetWave = BattleWave.getWaveForUnit(target);
          if (!nextTargetWave) return false;
          if (nextTargetWave === this) return false;
          if (nextTargetWave.team === this.team) return false;

          if (nextTargetWave.released || nextTargetWave.getCommandAliveCount() <= 0) {
            return false;
          }

          if (this.awaitingForwardRecoveryAfterTargetClear) {
            return false;
          }

          if (this.hasEngagedTargetWave(nextTargetWave)) {
            return true;
          } // Real combat expands the strategic set. Busy units retain their local
          // target; only idle members borrow from the expanded target pool.


          this.targetWaves.push(nextTargetWave);
          this.targetWave = (_this$targetWaves$2 = this.targetWaves[0]) != null ? _this$targetWaves$2 : null;
          this.immediateTargetSearchPending = false;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          this.forwardRecoveryLanePrepared = false;
          this.targetClearSameLaneSearchResolved = false;

          if (this.freeHuntActive) {
            this.clearIdleHuntTargets();
            this.primeTargetWaveHuntTargets();
          }

          return true;
        }

        getProgressScanner() {
          return this.findFrontmostAliveUnit(false);
        }

        findFrontmostAliveUnit(requireForward) {
          let best = null;
          let bestScore = -Infinity;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
            if (requireForward && !u.onForward) continue;
            const score = u.agent.pos.x * u.forwardDir.x + u.agent.pos.z * u.forwardDir.z;

            if (score > bestScore) {
              bestScore = score;
              best = u;
            }
          }

          return best;
        }

        tryResumeForward(beforeResume = null) {
          if (this.released) return false;
          if (!this.freeHuntActive) return false;
          this.getTargetWave();
          if (this.getTargetWaveCount() > 0) return false;
          if (this.immediateTargetSearchPending) return false;
          let aliveCount = 0;
          let resumableUnitCount = 0;
          let retainedBusyUnitCount = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
            aliveCount++;

            if (u.onBusy || u.hasValidEnemyTarget()) {
              retainedBusyUnitCount++;
              continue;
            }

            resumableUnitCount++;
          }

          if (aliveCount <= 0) {
            this.forwardModeActive = true;
            this.freeHuntActive = false;
            this.awaitingForwardRecoveryAfterTargetClear = false;
            this.forwardRecoveryLanePrepared = false;
            this.initialForwardCombatGateActive = true;
            this.aggressiveForwardMode = this.freeHuntForwardOrigin === 'aggressive';
            return true;
          } // A local fight belongs only to the units in it. Idle command members
          // must physically finish regrouping before the wave becomes Forward.


          if (resumableUnitCount <= 0) return false;

          if (!this.targetClearSameLaneSearchResolved) {
            return false;
          }

          if (!this.forwardRecoveryLanePrepared) {
            if (beforeResume) beforeResume(this);
            this.forwardRecoveryLanePrepared = true;
          }

          const forwardAggressive = this.freeHuntForwardOrigin === 'aggressive';
          let regroupingUnitCount = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
            if (u.onBusy || u.hasValidEnemyTarget()) continue;

            if (u.beginBackToLanePhase(forwardAggressive)) {
              regroupingUnitCount++;
            }
          }

          if (regroupingUnitCount > 0) return false;
          this.forwardModeActive = true;
          this.freeHuntActive = false;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          this.forwardRecoveryLanePrepared = false;
          this.targetClearSameLaneSearchResolved = false;
          this.forwardRecoveryDeferredTelemetryPending = false; // Every newly resumed Forward phase must earn a strategic escalation
          // again. Otherwise the half-wave gate only protects the spawn phase.

          this.initialForwardCombatGateActive = true;
          this.scannerUnit = null;
          this.aggressiveForwardMode = forwardAggressive;
          this.lastForwardRecoveryResumedUnitCount = resumableUnitCount;
          this.lastForwardRecoveryRetainedBusyUnitCount = retainedBusyUnitCount;

          if (!this.targetClearOutcomeTelemetry) {
            this.targetClearOutcomeTelemetry = {
              reason: 'forward-resumed-after-target-set-empty',
              scanner: this.getScanner(),
              target: null
            };
          }

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
            if (u.onBusy || u.hasValidEnemyTarget()) continue;
            u.enterWaveForwardMode(this.aggressiveForwardMode);
          }

          return true;
        }

        hasBackToLaneUnits() {
          if (this.released) return false;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
            if (u.isBackToLaneActive()) return true;
          }

          return false;
        }

        refreshInitialForwardCombatGate() {
          if (!this.isInitialForwardCombatGateActive()) {
            return;
          }

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
            if (u.onBusy) continue;
            if (u.onForward) continue;
            if (u.hasValidEnemyTarget()) continue;
            if (u.isSoloAggressiveSkirmishActive()) continue;
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

          for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];
            if (!unit) continue;
            if (BattleWave.unitWaveMap.get(unit) !== this.id) continue;
            unit.setWaveRuntimeId(-1);
          }

          this.released = true;
          this.runtimeStateFrame = -1;
          this.runtimeAliveCount = 0;
          this.runtimeHasEngaged = false;
          this.runtimeHealthFrame = -1;
          this.runtimeHealthRatio = 0;
          this.totalMaxHealth = 0;
          this.targetSearchIntervalFrames = 1;
          this.forwardModeActive = false;
          this.freeHuntActive = false;
          this.aggressiveForwardMode = false;
          this.aggressiveForwardOriginLaneId = -1;
          this.targetClearSameLaneSearchResolved = false;
          this.aggressiveAdjacentBoundaryObserved = false;
          this.aggressiveOwnLaneBlockObserved = false;
          this.initialForwardCombatGateActive = false;
          this.scannerUnit = null;
          this.clearTargetWave();
          this.representativeUnit = null;
          this.units.length = 0;
        }

        getClosestDistanceSqTo(x, z) {
          if (this.released) return Infinity;
          let best = Infinity;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isCommandUnit(u)) continue;
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

        primeTargetWaveHuntTargets() {
          this.refreshTargetWaves();
          if (this.targetWaves.length <= 0) return;

          for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];
            if (!this.isCommandUnit(unit)) continue;
            if (unit.onBusy) continue;
            if (!unit.agent) continue;
            const target = this.findSharedTargetForUnit(unit);
            if (!target) continue;
            unit.primeWaveHuntTarget(target);
          }
        }

        getClosestAliveUnitTo(x, z) {
          let best = null;
          let bestDistSq = Infinity;

          for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];
            if (!this.isCommandUnit(unit)) continue;
            const dx = unit.agent.pos.x - x;
            const dz = unit.agent.pos.z - z;
            const distSq = dx * dx + dz * dz;

            if (distSq < bestDistSq) {
              bestDistSq = distSq;
              best = unit;
            }
          }

          return best;
        }

        refreshTargetWaves() {
          var _survivors$2;

          if (this.targetWaves.length <= 0) {
            this.targetWave = null;
            return;
          }

          const survivors = [];
          let lastRemovedLane = -1;
          const firstNewTelemetryIndex = this.clearedTargetTelemetry.length;

          for (let i = 0; i < this.targetWaves.length; i++) {
            const targetWave = this.targetWaves[i];

            if (targetWave && !targetWave.released && targetWave.getCommandAliveCount() > 0) {
              survivors.push(targetWave);
              continue;
            }

            if (targetWave) {
              lastRemovedLane = targetWave.laneId;
              this.clearedTargetTelemetry.push({
                id: targetWave.id,
                team: targetWave.team,
                laneId: targetWave.laneId,
                family: targetWave.family,
                remainingTargetWaveCount: 0,
                physicallyDead: targetWave.isDead()
              });
            }
          }

          if (survivors.length === this.targetWaves.length) {
            var _survivors$;

            this.targetWave = (_survivors$ = survivors[0]) != null ? _survivors$ : null;
            return;
          }

          this.targetWaves = survivors;
          this.targetWave = (_survivors$2 = survivors[0]) != null ? _survivors$2 : null;

          for (let i = firstNewTelemetryIndex; i < this.clearedTargetTelemetry.length; i++) {
            this.clearedTargetTelemetry[i].remainingTargetWaveCount = survivors.length;
          }

          if (survivors.length > 0) {
            if (this.freeHuntActive) {
              this.clearIdleHuntTargets();
              this.primeTargetWaveHuntTargets();
            }

            return;
          }

          this.immediateTargetSearchPending = false;
          this.awaitingForwardRecoveryAfterTargetClear = true;
          this.forwardRecoveryLanePrepared = false;
          this.targetClearSameLaneSearchResolved = true;
          this.forwardRecoveryBlockTelemetryPending = false;
          this.forwardRecoveryDeferredTelemetryPending = true;
          this.regroupLaneAfterTargetClear = this.hasAggressiveForwardLaneLock() ? this.aggressiveForwardOriginLaneId : lastRemovedLane;
          this.targetClearOutcomeTelemetry = {
            reason: 'target-set-empty-regroup',
            scanner: this.getScanner(),
            target: null
          };
          this.clearAllFreeHuntContinuity();
          this.clearIdleHuntTargets();
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

        isScannerEligible(unit, requiresForwardUnit) {
          if (!this.isCommandUnit(unit)) return false;
          return !requiresForwardUnit || !!unit.onForward;
        }

        clearTargetWave(requestImmediateSearch = false) {
          this.targetWaves.length = 0;
          this.targetWave = null;
          this.targetClearSameLaneSearchResolved = false;
          this.immediateTargetSearchPending = false;
        }

        clearIdleHuntTargets() {
          for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];
            if (!this.isCommandUnit(unit)) continue;
            if (unit.onBusy) continue;
            unit.clearEnemy();
          }
        }

        clearAllFreeHuntContinuity() {
          for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];
            if (!this.isCommandUnit(unit)) continue;
            unit.clearWaveHuntContinuity();
          }
        }

        pickRepresentativeUnit(excludedUnit = null) {
          if (this.released) return null;
          let aliveCount = 0;
          let sumX = 0;
          let sumZ = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (u === excludedUnit) continue;
            if (!this.isCommandUnit(u)) continue;
            aliveCount++;
            sumX += u.agent.pos.x;
            sumZ += u.agent.pos.z;
          }

          if (aliveCount <= 0) return null;
          const averageX = sumX / aliveCount;
          const averageZ = sumZ / aliveCount;
          let best = null;
          let bestDistance = Infinity;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (u === excludedUnit) continue;
            if (!this.isCommandUnit(u)) continue;
            const distance = (u.agent.pos.x - averageX) * (u.agent.pos.x - averageX) + (u.agent.pos.z - averageZ) * (u.agent.pos.z - averageZ);

            if (distance < bestDistance) {
              bestDistance = distance;
              best = u;
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
//# sourceMappingURL=fa619e64265067b189410ec6fb7828f10372d771.js.map