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
        constructor(id, team, unitName, family, tier, totalCount, laneId) {
          if (laneId === void 0) {
            laneId = -1;
          }

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
          this.initialForwardCombatReleaseThreshold = 1;
          // One dynamic scanner per wave. In Forward it must still be marching;
          // in Free Hunt the frontmost alive unit takes the same captain role.
          this.scannerUnit = null;
          this.targetWave = null;
          this.regroupLaneAfterTargetClear = -1;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          // This is a wave-level result from the one scanner-only, same-lane scan
          // after its strategic target wave dies. It must not be invalidated by an
          // unrelated local combat on that scanner.
          this.targetClearSameLaneSearchResolved = false;
          this.forwardRecoveryBlockTelemetryPending = false;
          this.clearedTargetTelemetry = null;
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

        setWaveBanner(node, recycle, onAttached) {
          if (onAttached === void 0) {
            onAttached = null;
          }

          this.releaseWaveBanner();
          if (!node) return;
          this.waveBannerNode = node;
          this.waveBannerRecycle = recycle;
          this.waveBannerOnAttached = onAttached;
          this.captureWaveBannerBaseScale(node);
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

          var hasParent = !!banner.parent;

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
          var p = banner.position;

          if (Math.abs(p.x) <= 0.0001 && Math.abs(p.y) <= 0.0001 && Math.abs(p.z) <= 0.0001) {
            return;
          }

          banner.setPosition(0, 0, 0);
        }

        captureWaveBannerBaseScale(banner) {
          var scale = banner.scale;

          if (Math.abs(scale.x) <= 0.0001 && Math.abs(scale.y) <= 0.0001 && Math.abs(scale.z) <= 0.0001) {
            this.waveBannerBaseScale.set(1, 1, 1);
            return;
          }

          this.waveBannerBaseScale.set(scale.x, scale.y, scale.z);
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

          banner.setParent(null, true);
          banner.setScale(this.waveBannerBaseScale);
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

        hasAggressiveForwardLaneLock() {
          return !this.released && this.aggressiveForwardOriginLaneId >= 0 && (this.aggressiveForwardMode || this.freeHuntForwardOrigin === 'aggressive');
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
          var targetWave = this.getTargetWave();
          if (!targetWave) return null;
          if (!requester.agent) return null; // A free unit may only borrow a nearby member of its assigned enemy
          // wave. Never fall back to that wave's representative: it can be far
          // away and pull the whole wave across multiple lanes.

          return targetWave.getClosestAliveUnitTo(requester.agent.pos.x, requester.agent.pos.z, requester.targetSearchRange);
        }

        getTelemetryTargetState() {
          var targetWave = this.getTargetWave();
          var scanner = this.getScanner();
          return {
            targetWaveId: targetWave ? targetWave.id : -1,
            scannerUnitName: scanner ? scanner.unitTypeName : '',
            scannerLifeId: scanner ? scanner.lifeId : -1,
            scannerBusy: !!(scanner != null && scanner.onBusy),
            scannerForward: !!(scanner != null && scanner.onForward),
            scannerConfirmedNoTarget: !!(scanner != null && scanner.hasConfirmedNoTargetSearch())
          };
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

        applyDefeatedTargetLaneForRegroup() {
          if (this.hasAggressiveForwardLaneLock()) {
            this.regroupLaneAfterTargetClear = -1;
            this.setLaneId(this.aggressiveForwardOriginLaneId);
            return true;
          }

          if (this.regroupLaneAfterTargetClear < 0) {
            return false;
          }

          var laneId = this.regroupLaneAfterTargetClear;
          this.regroupLaneAfterTargetClear = -1;
          this.setLaneId(laneId);
          return true;
        }

        releaseForwardToFreeHunt(searchRange) {
          if (searchRange === void 0) {
            searchRange = 0;
          }

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
          this.targetClearSameLaneSearchResolved = false;
          this.aggressiveForwardMode = false;
          this.aggressiveAdjacentBoundaryObserved = false;
          this.aggressiveOwnLaneBlockObserved = false;
          this.initialForwardCombatGateActive = false;
          this.scannerUnit = null;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
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

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.enterWaveCombatMode();
          }

          this.primeTargetWaveHuntTargets();
        }

        forceForwardMode() {
          if (this.released) return false;
          var aliveCount = 0;
          this.forwardModeActive = true;
          this.freeHuntActive = false;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          this.targetClearSameLaneSearchResolved = false;
          this.scannerUnit = null;
          this.clearTargetWave();

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


        getScanner(refresh) {
          if (refresh === void 0) {
            refresh = false;
          }

          if (this.released) return null;
          var requiresForwardUnit = this.isForwardMode();

          if (!requiresForwardUnit && !this.freeHuntActive) {
            return null;
          }

          if (!refresh && this.isScannerEligible(this.scannerUnit, requiresForwardUnit)) {
            return this.scannerUnit;
          }

          this.scannerUnit = this.findFrontmostAliveUnit(requiresForwardUnit);
          return this.scannerUnit;
        }

        hasHuntScannerConfirmedNoTarget() {
          var scanner = this.getScanner();
          return !!(scanner != null && scanner.hasConfirmedNoTargetSearch());
        }

        isCurrentScanner(unit, refresh) {
          if (refresh === void 0) {
            refresh = false;
          }

          if (!unit || this.released) return false;
          var scanner = this.getScanner(refresh);
          return scanner === unit;
        }

        getTargetWave() {
          if (this.targetWave && (this.targetWave.released || this.targetWave.isDead())) {
            var defeatedTarget = this.targetWave;
            var defeatedTargetLane = defeatedTarget.laneId;
            this.clearedTargetTelemetry = {
              id: defeatedTarget.id,
              team: defeatedTarget.team,
              laneId: defeatedTargetLane,
              family: defeatedTarget.family
            }; // A busy scanner already owns a live local target. Keep that
            // target's wave as the strategic order instead of clearing the
            // wave and making its free allies wait for another scan.

            var scanner = this.getScanner();
            var scannerTarget = scanner != null && scanner.onBusy ? scanner.getValidEnemyTarget() : null;
            var scannerTargetWave = BattleWave.getWaveForUnit(scannerTarget);

            if (scanner && scannerTarget && scannerTargetWave && scannerTargetWave !== this && scannerTargetWave.team !== this.team && !scannerTargetWave.released && !scannerTargetWave.isDead()) {
              this.targetWave = scannerTargetWave;
              this.immediateTargetSearchPending = false;
              this.awaitingForwardRecoveryAfterTargetClear = false;
              this.targetClearSameLaneSearchResolved = false;
              this.forwardRecoveryBlockTelemetryPending = false;
              this.targetClearOutcomeTelemetry = {
                reason: 'retained-busy-scanner-target',
                scanner,
                target: scannerTarget
              };

              if (this.freeHuntActive) {
                this.clearIdleHuntTargets();
                this.primeTargetWaveHuntTargets();
              }

              return this.targetWave;
            }

            var allUnitsIdle = true;

            for (var i = 0; i < this.units.length; i++) {
              var unit = this.units[i];
              if (!this.isUnitAlive(unit)) continue;

              if (unit.onBusy || unit.hasValidEnemyTarget()) {
                allUnitsIdle = false;
                break;
              }
            } // With no local combat or live unit target left, regrouping is
            // the next strategic order. Do not let the scanner chain Free
            // Hunt into another nearby wave.


            if (allUnitsIdle) {
              this.clearTargetWave();
              this.clearAllFreeHuntContinuity();
              this.clearIdleHuntTargets();
              this.awaitingForwardRecoveryAfterTargetClear = true;
              this.targetClearSameLaneSearchResolved = true;
              this.forwardRecoveryBlockTelemetryPending = false;
              this.targetClearOutcomeTelemetry = {
                reason: 'forward-regroup-all-units-idle',
                scanner,
                target: null
              };
              return this.targetWave;
            }

            if (defeatedTargetLane >= 0) {
              this.regroupLaneAfterTargetClear = defeatedTargetLane;
            }

            this.awaitingForwardRecoveryAfterTargetClear = true;
            this.targetClearSameLaneSearchResolved = false;
            this.forwardRecoveryBlockTelemetryPending = true; // The current strategic order has genuinely ended. Let the one
            // scanner search once on the next safe GameManager pass instead
            // of waiting for its normal interval.

            this.clearTargetWave(true);
            this.clearAllFreeHuntContinuity();
            this.clearIdleHuntTargets();
          }

          return this.targetWave;
        }

        consumeClearedTargetTelemetry() {
          var clearedTarget = this.clearedTargetTelemetry;
          this.clearedTargetTelemetry = null;
          return clearedTarget;
        }

        consumeTargetClearOutcomeTelemetry() {
          var outcome = this.targetClearOutcomeTelemetry;
          this.targetClearOutcomeTelemetry = null;
          return outcome;
        }

        hasImmediateTargetSearchPending() {
          this.getTargetWave();
          return this.immediateTargetSearchPending;
        }

        isAwaitingForwardRecoveryAfterTargetClear() {
          return !this.released && this.awaitingForwardRecoveryAfterTargetClear;
        }

        resolveImmediateTargetClearSearch(targetFound) {
          if (!this.isAwaitingForwardRecoveryAfterTargetClear()) {
            return;
          } // A found target clears the waiting state through
          // trySetTargetWaveFromScanner(). Only the no-target result needs to
          // survive on the wave for forward recovery.


          this.targetClearSameLaneSearchResolved = !targetFound;
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

          for (var i = 0; i < this.units.length; i++) {
            var unit = this.units[i];
            if (!this.isUnitAlive(unit)) continue;

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

        consumeImmediateTargetSearch() {
          this.getTargetWave();
          if (!this.immediateTargetSearchPending) return false; // A new strategic order won before the forced scan ran, or the wave
          // has left Free Hunt. Never let an old request overwrite that state.

          if (this.released || !this.freeHuntActive || this.targetWave) {
            this.immediateTargetSearchPending = false;
            return false;
          }

          this.immediateTargetSearchPending = false;
          return true;
        }

        trySetTargetWaveFromScanner(scanner, target) {
          if (!scanner || !target || this.released) return false;
          if (!this.isCurrentScanner(scanner)) return false;
          var nextTargetWave = BattleWave.getWaveForUnit(target);
          if (!nextTargetWave) return false;
          if (nextTargetWave === this) return false;
          if (nextTargetWave.team === this.team) return false;

          if (nextTargetWave.released || nextTargetWave.isDead()) {
            return false;
          }

          if (this.targetWave === nextTargetWave) {
            return true;
          }

          if (this.awaitingForwardRecoveryAfterTargetClear && nextTargetWave.laneId !== this.laneId) {
            return false;
          } // Scanner search establishes the initial order only. A live order is
          // replaced exclusively by a real local engagement.


          if (this.getTargetWave()) return false;
          var wasAwaitingTargetClear = this.awaitingForwardRecoveryAfterTargetClear;
          this.targetWave = nextTargetWave;
          this.immediateTargetSearchPending = false;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          this.targetClearSameLaneSearchResolved = false;

          if (wasAwaitingTargetClear) {
            this.targetClearOutcomeTelemetry = {
              reason: 'replacement-target-assigned',
              scanner,
              target
            };
          }

          if (this.freeHuntActive) {
            this.clearIdleHuntTargets();
            this.primeTargetWaveHuntTargets();
          }

          return true;
        }

        trySetTargetWaveFromEngagement(unit, target) {
          if (!unit || !target || this.released) return false;
          if (!this.isUnitAlive(unit)) return false; // The collision callback is raised by whichever unit updates first.
          // Its counterpart may not have run yet, so accept the passive side
          // when the other unit has already entered this same engagement.

          if (!unit.onBusy && !target.onBusy) return false;
          var nextTargetWave = BattleWave.getWaveForUnit(target);
          if (!nextTargetWave) return false;
          if (nextTargetWave === this) return false;
          if (nextTargetWave.team === this.team) return false;

          if (nextTargetWave.released || nextTargetWave.isDead()) {
            return false;
          }

          if (this.awaitingForwardRecoveryAfterTargetClear && nextTargetWave.laneId !== this.laneId) {
            return false;
          } // A real engagement is a passive order change: busy units keep their
          // local combat, while free allies begin hunting this enemy wave.


          var wasAwaitingTargetClear = this.awaitingForwardRecoveryAfterTargetClear;
          this.targetWave = nextTargetWave;
          this.immediateTargetSearchPending = false;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          this.targetClearSameLaneSearchResolved = false;

          if (wasAwaitingTargetClear) {
            this.targetClearOutcomeTelemetry = {
              reason: 'replacement-target-assigned',
              scanner: this.getScanner(),
              target
            };
          }

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
          var best = null;
          var bestScore = -Infinity;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (requireForward && !u.onForward) continue;
            var score = u.agent.pos.x * u.forwardDir.x + u.agent.pos.z * u.forwardDir.z;

            if (score > bestScore) {
              bestScore = score;
              best = u;
            }
          }

          return best;
        }

        tryResumeForward(beforeResume) {
          if (beforeResume === void 0) {
            beforeResume = null;
          }

          if (this.released) return false;
          if (!this.freeHuntActive) return false;
          this.getTargetWave();
          if (this.targetWave) return false;
          if (this.immediateTargetSearchPending) return false;
          var aliveCount = 0;
          var resumableUnitCount = 0;
          var retainedBusyUnitCount = 0;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            aliveCount++;

            if (u.onBusy || u.hasValidEnemyTarget()) {
              retainedBusyUnitCount++;
              continue;
            }

            resumableUnitCount++;
          }

          if (aliveCount <= 0) return false; // A local fight belongs only to the units in it. The rest of the wave
          // must be allowed to regroup and advance after the scanner has found
          // no same-lane strategic target.

          if (resumableUnitCount <= 0) return false;

          if (!this.targetClearSameLaneSearchResolved) {
            return false;
          }

          if (beforeResume) {
            beforeResume(this);
          }

          this.forwardModeActive = true;
          this.freeHuntActive = false;
          this.awaitingForwardRecoveryAfterTargetClear = false;
          this.targetClearSameLaneSearchResolved = false;
          this.initialForwardCombatGateActive = false;
          this.scannerUnit = null;
          this.aggressiveForwardMode = this.freeHuntForwardOrigin === 'aggressive';
          this.lastForwardRecoveryResumedUnitCount = resumableUnitCount;
          this.lastForwardRecoveryRetainedBusyUnitCount = retainedBusyUnitCount;

          if (!this.targetClearOutcomeTelemetry) {
            this.targetClearOutcomeTelemetry = {
              reason: 'forward-resumed-after-no-target',
              scanner: this.getScanner(),
              target: null
            };
          }

          for (var _i = 0; _i < this.units.length; _i++) {
            var _u = this.units[_i];
            if (!this.isUnitAlive(_u)) continue;
            if (_u.onBusy || _u.hasValidEnemyTarget()) continue;

            _u.enterWaveForwardMode(this.aggressiveForwardMode, true);
          }

          return true;
        }

        hasBackToLaneUnits() {
          if (this.released) return false;

          for (var i = 0; i < this.units.length; i++) {
            var u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (u.isBackToLaneActive()) return true;
          }

          return false;
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

          for (var i = 0; i < this.units.length; i++) {
            var unit = this.units[i];
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
          this.initialForwardCombatReleaseThreshold = 1;
          this.scannerUnit = null;
          this.clearTargetWave();
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

        primeTargetWaveHuntTargets() {
          var targetWave = this.getTargetWave();
          if (!targetWave) return;

          for (var i = 0; i < this.units.length; i++) {
            var unit = this.units[i];
            if (!this.isUnitAlive(unit)) continue;
            if (unit.onBusy) continue;
            if (!unit.agent) continue;
            var target = targetWave.getClosestAliveUnitTo(unit.agent.pos.x, unit.agent.pos.z, unit.targetSearchRange);
            if (!target) continue;
            unit.primeWaveHuntTarget(target);
          }
        }

        getClosestAliveUnitTo(x, z, maxRange) {
          if (maxRange === void 0) {
            maxRange = Infinity;
          }

          var best = null;
          var bestDistSq = Infinity;
          var maxRangeSq = Number.isFinite(maxRange) ? Math.max(0, maxRange) * Math.max(0, maxRange) : Infinity;

          for (var i = 0; i < this.units.length; i++) {
            var unit = this.units[i];
            if (!this.isUnitAlive(unit)) continue;
            var dx = unit.agent.pos.x - x;
            var dz = unit.agent.pos.z - z;
            var distSq = dx * dx + dz * dz;
            if (distSq > maxRangeSq) continue;

            if (distSq < bestDistSq) {
              bestDistSq = distSq;
              best = unit;
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

        isScannerEligible(unit, requiresForwardUnit) {
          if (!this.isUnitAlive(unit)) return false;
          return !requiresForwardUnit || !!unit.onForward;
        }

        clearTargetWave(requestImmediateSearch) {
          if (requestImmediateSearch === void 0) {
            requestImmediateSearch = false;
          }

          this.targetWave = null;
          this.targetClearSameLaneSearchResolved = false;
          this.immediateTargetSearchPending = requestImmediateSearch && !this.released && this.freeHuntActive;
        }

        clearIdleHuntTargets() {
          for (var i = 0; i < this.units.length; i++) {
            var unit = this.units[i];
            if (!this.isUnitAlive(unit)) continue;
            if (unit.onBusy) continue;
            unit.clearEnemy();
          }
        }

        clearAllFreeHuntContinuity() {
          for (var i = 0; i < this.units.length; i++) {
            var unit = this.units[i];
            if (!this.isUnitAlive(unit)) continue;
            unit.clearWaveHuntContinuity();
          }
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