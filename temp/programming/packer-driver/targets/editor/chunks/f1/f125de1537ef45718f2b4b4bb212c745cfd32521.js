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
          this.initialForwardCombatGateActive = true;
          this.initialForwardCombatReleaseThreshold = 1;
          this.forwardScannerUnit = null;
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

        setInitialForwardCombatReleaseThreshold(threshold) {
          this.initialForwardCombatReleaseThreshold = Math.max(1, Math.floor(threshold));
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

        isInitialForwardCombatGateActive() {
          return !this.released && this.initialForwardCombatGateActive && this.forwardModeActive && !this.freeHuntActive;
        }

        getInitialForwardCombatReleaseThreshold() {
          return this.initialForwardCombatReleaseThreshold;
        }

        getEngagedCountIncluding(pendingUnit = null) {
          if (this.released) return 0;
          let count = 0;
          let hasPending = false;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
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

        setLaneId(laneId) {
          if (this.released) return;
          this.laneId = laneId;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.laneId = laneId;
          }
        }

        releaseForwardToFreeHunt(searchRange = 0) {
          if (this.released) return;

          if (this.freeHuntActive && searchRange <= 0) {
            return;
          }

          this.forwardModeActive = false;
          this.freeHuntActive = true;
          this.aggressiveForwardMode = false;
          this.initialForwardCombatGateActive = false;
          this.forwardScannerUnit = null;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
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

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.enterWaveCombatMode();
          }
        }

        forceForwardMode() {
          if (this.released) return false;
          let aliveCount = 0;
          this.forwardModeActive = true;
          this.freeHuntActive = false;
          this.initialForwardCombatGateActive = false;
          this.forwardScannerUnit = null;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
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

        getForwardScanner(refresh = false) {
          if (!this.isForwardMode()) {
            return null;
          }

          if (!refresh && this.isForwardScannerEligible(this.forwardScannerUnit)) {
            return this.forwardScannerUnit;
          }

          let best = null;
          let bestScore = -Infinity;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            if (!u.onForward) continue;
            const score = u.agent.pos.x * u.forwardDir.x + u.agent.pos.z * u.forwardDir.z;

            if (score > bestScore) {
              bestScore = score;
              best = u;
            }
          }

          this.forwardScannerUnit = best;
          return this.forwardScannerUnit;
        }

        tryResumeForward(beforeResume = null) {
          if (this.released) return false;
          if (!this.freeHuntActive) return false;
          let aliveCount = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            aliveCount++;
            if (u.onBusy) return false;
            if (u.hasValidEnemyTarget()) return false;

            if (!u.hasConfirmedNoTargetSearch()) {
              return false;
            }
          }

          if (aliveCount <= 0) return false;

          if (beforeResume) {
            beforeResume(this);
          }

          this.forwardModeActive = true;
          this.freeHuntActive = false;
          this.initialForwardCombatGateActive = false;
          this.forwardScannerUnit = null;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
            u.enterWaveForwardMode(this.aggressiveForwardMode, true);
          }

          return true;
        }

        hasBackToLaneUnits() {
          if (this.released) return false;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (!this.isUnitAlive(u)) continue;
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
          this.initialForwardCombatGateActive = false;
          this.initialForwardCombatReleaseThreshold = 1;
          this.forwardScannerUnit = null;
          this.representativeUnit = null;
          this.units.length = 0;
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

        isForwardScannerEligible(unit) {
          if (!this.isUnitAlive(unit)) return false;
          return !!unit.onForward;
        }

        pickRepresentativeUnit(excludedUnit = null) {
          if (this.released) return null;
          let aliveCount = 0;
          let sumX = 0;
          let sumZ = 0;

          for (let i = 0; i < this.units.length; i++) {
            const u = this.units[i];
            if (u === excludedUnit) continue;
            if (!this.isUnitAlive(u)) continue;
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
            if (!this.isUnitAlive(u)) continue;
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
//# sourceMappingURL=f125de1537ef45718f2b4b4bb212c745cfd32521.js.map