System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, UnitProps, GameManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _class3, _crd, ccclass, property, Unit;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnitProps(extras) {
    _reporterNs.report("UnitProps", "./UnitProps", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      UnitProps = _unresolved_2.UnitProps;
    }, function (_unresolved_3) {
      GameManager = _unresolved_3.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6e964qkrR5F2YvWvH5N+eXO", "Unit", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Unit", Unit = (_dec = ccclass('Unit'), _dec2 = property(Node), _dec3 = property({
        displayName: 'Aggressive Forward'
      }), _dec4 = property(Vec3), _dec5 = property({
        displayName: 'Hero Guard Distance'
      }), _dec6 = property({
        displayName: 'Hero Guard Return Tolerance'
      }), _dec(_class = (_class2 = (_class3 = class Unit extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "visualRoot", _descriptor, this);

          _initializerDefineProperty(this, "visualYawOffset", _descriptor2, this);

          _initializerDefineProperty(this, "rotationSpeed", _descriptor3, this);

          _initializerDefineProperty(this, "moveThreshold", _descriptor4, this);

          _initializerDefineProperty(this, "visualThreshold", _descriptor5, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor6, this);

          _initializerDefineProperty(this, "radius", _descriptor7, this);

          _initializerDefineProperty(this, "attackRange", _descriptor8, this);

          _initializerDefineProperty(this, "attackCheckIntervalFrames", _descriptor9, this);

          _initializerDefineProperty(this, "targetSearchRange", _descriptor10, this);

          _initializerDefineProperty(this, "targetSearchIntervalFrames", _descriptor11, this);

          _initializerDefineProperty(this, "aggressiveForward", _descriptor12, this);

          _initializerDefineProperty(this, "forwardDir", _descriptor13, this);

          _initializerDefineProperty(this, "onForward", _descriptor14, this);

          _initializerDefineProperty(this, "isSteady", _descriptor15, this);

          _initializerDefineProperty(this, "heroGuardDistance", _descriptor16, this);

          _initializerDefineProperty(this, "heroGuardReturnTolerance", _descriptor17, this);

          _initializerDefineProperty(this, "enableAllyOvertake", _descriptor18, this);

          _initializerDefineProperty(this, "overtakeLookAhead", _descriptor19, this);

          _initializerDefineProperty(this, "overtakeSideRange", _descriptor20, this);

          _initializerDefineProperty(this, "overtakeSideStrength", _descriptor21, this);

          _initializerDefineProperty(this, "overtakeSpeedDiff", _descriptor22, this);

          this.team = 0;
          this.unitTypeName = '';
          this.isHero = false;
          this.laneId = -1;
          this.sim = null;
          this.agent = null;
          this.lifeId = 0;
          this.enemy = null;
          this.onBusy = false;
          this.updateOffset = 0;
          this.props = void 0;
          this.initialYaw = 0;
          this.heroGuardHomeX = 0;
          this.heroGuardHomeZ = 0;
          this.lastStablePos = {
            x: 0,
            z: 0
          };
          this.moveIntentFacingActive = true;
          this.lastMoveIntentDir = {
            x: 0,
            z: 0
          };
          this.tempPos = new Vec3();
          this.frameCounter = 0;
          this.cachedNearestInRange = null;
          this.enemyLifeId = -1;
          this.cachedNearestInRangeLifeId = -1;
          this.retaliationTarget = null;
          this.retaliationTargetLifeId = -1;
          this.targetSearchPending = false;
          this.targetSearchConfirmedNoTarget = false;
          this.nearestEnemyQueryToken = 0;

          this.onNearestEnemyQueryResult = (target, token) => {
            if (token !== this.nearestEnemyQueryToken) {
              return;
            }

            const validTarget = this.isValidEnemyWithinRange(target, this.targetSearchRange) ? target : null;
            this.completeTargetSearch(validTarget);

            if (!this.hasValidEnemyTarget()) {
              this.setEnemyTarget(validTarget);
            }
          };
        }

        onLoad() {
          this.props = this.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);
        }

        init(sim, team, unitTypeName, forwardX, forwardZ) {
          this.advanceLifeId();
          this.team = team;
          this.unitTypeName = unitTypeName;
          this.sim = sim; // Unit node chỉ handle position.
          // Rotation visual nằm ở visualRoot.

          this.node.setRotationFromEuler(0, 0, 0);
          const p = this.node.worldPosition;
          this.initialYaw = this.getVisualEulerY();
          this.heroGuardHomeX = p.x;
          this.heroGuardHomeZ = p.z;
          this.agent = sim.addAgent(p.x, p.z);
          this.agent.maxSpeed = this.moveSpeed;
          this.agent.radius = this.radius;
          this.setEnemyTarget(null);
          this.onBusy = false;
          this.onForward = !this.isSteady;
          this.setForwardDir(forwardX, forwardZ);
          this.updateOffset = Math.floor(Math.random() * 1000);
          this.frameCounter = this.updateOffset;
          this.invalidateNearestQueryResults();
          this.clearCachedTargets();

          if (this.laneId < 0) {
            this.laneId = -1;
          }

          this.lastStablePos.x = p.x;
          this.lastStablePos.z = p.z;
          this.resetMoveIntentFacing();
          this.applyRuntimeAgentData();
          this.applySteadyState();
        }

        setSteady(value, useForwardPhase = true) {
          this.isSteady = value;
          if (!this.agent) return;
          this.invalidateNearestQueryResults();
          this.clearCachedTargets();

          if (value) {
            this.setEnemyTarget(null);
            this.onBusy = false;
            this.onForward = false;
            this.initialYaw = this.getVisualEulerY();

            if (this.isHero) {
              this.heroGuardHomeX = this.agent.pos.x;
              this.heroGuardHomeZ = this.agent.pos.z;
            }

            this.agent.locked = true;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.onForward = 0;

            if (this.sim) {
              this.sim.setPrefVelocity(this.agent, 0, 0);
            }

            return;
          }

          this.setEnemyTarget(null);
          this.onBusy = false;
          this.onForward = useForwardPhase;
          this.agent.locked = false;
          this.agent.vel.x = 0;
          this.agent.vel.z = 0;
          this.agent.prefVel.x = 0;
          this.agent.prefVel.z = 0;
          this.agent.onForward = useForwardPhase ? 1 : 0;
          this.applyRuntimeAgentData();
        }

        applyRuntimeAgentData() {
          if (!this.agent) return;
          this.agent.team = this.team;
          this.agent.onForward = this.onForward ? 1 : 0;
          this.agent.forwardX = this.forwardDir.x;
          this.agent.forwardZ = this.forwardDir.z;
          this.agent.enableAllyOvertake = this.enableAllyOvertake ? 1 : 0;
          this.agent.overtakeLookAhead = this.overtakeLookAhead;
          this.agent.overtakeSideRange = this.overtakeSideRange;
          this.agent.overtakeSideStrength = this.overtakeSideStrength;
          this.agent.overtakeSpeedDiff = this.overtakeSpeedDiff;
          this.agent.overtakeSeed = this.updateOffset % 2 === 0 ? 1 : -1;
        }

        applySteadyState() {
          if (!this.agent) return;

          if (this.isSteady) {
            this.agent.locked = true;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.onForward = false;
            this.agent.onForward = 0;
          } else {
            this.agent.locked = false;
          }
        }

        invalidateNearestQueryResults() {
          this.nearestEnemyQueryToken++;
          this.targetSearchPending = false;
          this.targetSearchConfirmedNoTarget = false;
        }

        advanceLifeId() {
          this.lifeId++;

          if (this.lifeId > Number.MAX_SAFE_INTEGER - 1) {
            this.lifeId = 1;
          }
        }

        setEnemyTarget(target) {
          this.enemy = target;
          this.enemyLifeId = target ? target.lifeId : -1;
          this.retaliationTarget = null;
          this.retaliationTargetLifeId = -1;

          if (target) {
            this.targetSearchConfirmedNoTarget = false;
          }
        }

        setRetaliationTarget(target) {
          this.enemy = target;
          this.enemyLifeId = target.lifeId;
          this.retaliationTarget = target;
          this.retaliationTargetLifeId = target.lifeId;
          this.targetSearchConfirmedNoTarget = false;
        }

        setCachedNearestInRangeTarget(target) {
          this.cachedNearestInRange = target;
          this.cachedNearestInRangeLifeId = target ? target.lifeId : -1;
        }

        completeTargetSearch(target) {
          this.targetSearchPending = false;
          this.targetSearchConfirmedNoTarget = !target && !this.hasValidEnemyTarget();
        }

        clearCachedTargets() {
          this.setCachedNearestInRangeTarget(null);
        }

        getValidEnemyTarget() {
          return this.isValidEnemy(this.enemy, this.enemyLifeId) ? this.enemy : null;
        }

        hasValidEnemyTarget() {
          return !!this.getValidEnemyTarget();
        }

        hasConfirmedNoTargetSearch() {
          if (this.targetSearchPending) return false;
          if (this.hasValidEnemyTarget()) return false;
          return this.targetSearchConfirmedNoTarget;
        }

        setWaveSearchTarget(target) {
          if (!this.isValidEnemy(target)) return false;
          this.setEnemyTarget(target);
          return true;
        }

        findForwardSearchTarget(aggressiveForward) {
          if (!this.agent) return null;

          if (!aggressiveForward) {
            const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;

            if (gm && gm.spatialGrid) {
              return gm.spatialGrid.findNearestEnemy(this.team, this.agent.pos.x, this.agent.pos.z, this.targetSearchRange);
            }

            return this.findNearestEnemyFallback();
          }

          if (this.laneId < 0) return null;
          const enemies = this.getNearbyEnemyList(this.targetSearchRange);
          const maxRangeSq = this.targetSearchRange * this.targetSearchRange;
          let best = null;
          let bestDistSq = Infinity;

          for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (!this.isValidEnemy(enemy)) continue;
            if (enemy.laneId !== this.laneId) continue;
            const dx = enemy.agent.pos.x - this.agent.pos.x;
            const dz = enemy.agent.pos.z - this.agent.pos.z;
            const distanceSq = dx * dx + dz * dz;
            if (distanceSq > maxRangeSq) continue;

            if (distanceSq < bestDistSq) {
              bestDistSq = distanceSq;
              best = enemy;
            }
          }

          return best;
        }

        hasReachedEnemyHeroLine() {
          const enemyHero = this.getEnemyHero();

          if (!this.isValidEnemy(enemyHero)) {
            return false;
          }

          return this.hasPassedTargetAlongForward(enemyHero);
        }

        getEnemyHeroTarget() {
          const enemyHero = this.getEnemyHero();
          return this.isValidEnemy(enemyHero) ? enemyHero : null;
        }

        hasPassedForwardTarget(target) {
          return this.hasPassedTargetAlongForward(target);
        }

        reactToAttacker(attacker) {
          if (this.onBusy) return false;
          if (!this.isValidEnemy(attacker)) return false;
          const currentTarget = this.getValidEnemyTarget();

          if (currentTarget && currentTarget === this.retaliationTarget && currentTarget.lifeId === this.retaliationTargetLifeId) {
            return false;
          }

          const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (gm) {
            gm.onWaveCombatStarted(this, attacker, false);
          } // A result requested before retaliation must not replace the
          // attacker when the worker responds later.


          this.nearestEnemyQueryToken++;
          this.targetSearchPending = false;
          this.targetSearchConfirmedNoTarget = false;
          this.setRetaliationTarget(attacker);
          this.setCachedNearestInRangeTarget(null);
          return true;
        }

        setForwardDir(x, z) {
          const len = Math.sqrt(x * x + z * z);

          if (len < 0.0001) {
            this.forwardDir.x = 0;
            this.forwardDir.y = 0;
            this.forwardDir.z = 1;
            return;
          }

          this.forwardDir.x = x / len;
          this.forwardDir.y = 0;
          this.forwardDir.z = z / len;
        }

        resetForDespawn() {
          this.advanceLifeId();
          this.setEnemyTarget(null);
          this.onBusy = false;
          this.onForward = true;
          this.invalidateNearestQueryResults();
          this.clearCachedTargets();
          this.laneId = -1;
          this.aggressiveForward = false;
          this.resetMoveIntentFacing();

          if (this.agent) {
            this.agent.locked = false;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.onForward = 0;
          }

          this.agent = null;
          this.sim = null;
        }

        setEnemy(e) {
          if (this.onBusy) return;
          if (this.onForward) return;
          this.setEnemyTarget(e);
        }

        clearEnemy() {
          this.setEnemyTarget(null);
          this.onBusy = false;
          this.invalidateNearestQueryResults();
          this.clearCachedTargets();

          if (this.agent) {
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.locked = this.isSteady;
          }
        }

        enterFreeHuntMode(searchRange = this.targetSearchRange) {
          this.isSteady = false;
          this.onForward = false;
          this.aggressiveForward = false;
          this.resetStableRotationPosition();
          this.targetSearchRange = Math.max(this.targetSearchRange, searchRange);
          this.invalidateNearestQueryResults();
          this.clearCachedTargets();

          if (!this.onBusy) {
            this.setEnemyTarget(null);
          }

          if (this.agent) {
            this.agent.locked = this.onBusy;
            this.agent.onForward = 0;

            if (!this.onBusy) {
              this.agent.vel.x = 0;
              this.agent.vel.z = 0;
              this.agent.prefVel.x = 0;
              this.agent.prefVel.z = 0;
            }
          }
        }

        enterWaveCombatMode() {
          this.onForward = false;
          this.aggressiveForward = false;
          this.resetStableRotationPosition();
          this.invalidateNearestQueryResults();
          this.clearCachedTargets();

          if (this.agent) {
            this.agent.onForward = 0;

            if (!this.onBusy) {
              this.agent.locked = this.isSteady;
            }
          }
        }

        enterWaveFreeHuntMode(searchRange = 0) {
          this.onForward = false;
          this.aggressiveForward = false;
          this.resetStableRotationPosition();

          if (searchRange > 0) {
            this.targetSearchRange = Math.max(this.targetSearchRange, searchRange);
          }

          this.invalidateNearestQueryResults();
          this.clearCachedTargets();

          if (this.agent) {
            this.agent.onForward = 0;

            if (!this.onBusy) {
              this.agent.locked = this.isSteady;
            }
          }
        }

        enterWaveForwardMode(aggressiveForward) {
          if (this.isSteady) return;
          this.setEnemyTarget(null);
          this.onBusy = false;
          this.onForward = true;
          this.aggressiveForward = aggressiveForward;
          this.resetStableRotationPosition();
          this.resetMoveIntentFacing();
          this.invalidateNearestQueryResults();
          this.clearCachedTargets();

          if (this.agent) {
            this.agent.locked = false;
            this.agent.onForward = 1;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
          }
        }

        update(deltaTime) {
          if (!this.sim || !this.agent) return;
          this.frameCounter++;
          this.applyRuntimeAgentData();

          if (this.props && this.props.isDead()) {
            this.setEnemyTarget(null);
            this.onBusy = false;
            this.onForward = false;
            this.agent.onForward = 0;
            this.agent.locked = true;
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.sync(deltaTime, false);
            return;
          }

          if (this.updateSteadyHeroGuard(deltaTime)) {
            return;
          }

          if (this.isSteady) {
            this.agent.locked = true;
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.onForward = false;
            this.agent.onForward = 0;
          }

          if (this.onBusy) {
            const busyEnemy = this.getValidEnemyTarget();

            if (!busyEnemy) {
              this.clearEnemy();
            } else {
              this.lookAtTargetSmooth(busyEnemy, deltaTime);
              this.sim.setPrefVelocity(this.agent, 0, 0);
              this.agent.vel.x = 0;
              this.agent.vel.z = 0;
              this.sync(deltaTime, false);
              return;
            }
          }

          this.clearInvalidEnemy();
          const nearestInRange = this.getNearestEnemyInAttackRangeThrottled();

          if (nearestInRange) {
            const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;

            if (gm) {
              gm.onWaveCombatStarted(this, nearestInRange);
            }

            this.onForward = false;
            this.agent.onForward = 0;
            this.setEnemyTarget(nearestInRange);
            this.onBusy = true;
            this.agent.locked = true;
            this.setCachedNearestInRangeTarget(null);
            this.lookAtTargetSmooth(nearestInRange, deltaTime);
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.sync(deltaTime, false);
            return;
          }

          if (this.isSteady) {
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.returnToInitialYawSmooth(deltaTime);
            this.sync(deltaTime, false);
            return;
          }

          if (this.onForward) {
            this.agent.onForward = 1;
            this.updateForwardPrefVelocity();
            this.lookMoveIntentSmooth(deltaTime);
            this.sync(deltaTime, false);
            return;
          }

          this.agent.onForward = 0;

          if (!this.hasValidEnemyTarget()) {
            this.setEnemyTarget(this.getSharedWaveTarget());

            if (!this.hasValidEnemyTarget()) {
              this.refreshNearestEnemyTargetThrottled();
            }
          }

          const enemy = this.getValidEnemyTarget();

          if (enemy && enemy.agent) {
            const dx = enemy.agent.pos.x - this.agent.pos.x;
            const dz = enemy.agent.pos.z - this.agent.pos.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.0001) {
              this.sim.setPrefVelocity(this.agent, dx / dist * this.agent.maxSpeed, dz / dist * this.agent.maxSpeed);
            }

            this.lookAtTargetSmooth(enemy, deltaTime);
            this.sync(deltaTime, false);
          } else {
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.sync(deltaTime, true);
          }
        }

        shouldRunAttackCheck() {
          const interval = Math.max(1, Math.floor(this.attackCheckIntervalFrames));
          return this.frameCounter % interval === 0;
        }

        shouldRunTargetSearch() {
          const interval = Math.max(1, Math.floor(this.targetSearchIntervalFrames));
          return this.frameCounter % interval === 0;
        }

        getSharedWaveTarget() {
          const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          if (!gm) return null;
          const target = gm.findSharedWaveTargetForUnit(this);
          return this.isValidEnemy(target) ? target : null;
        }

        getNearestEnemyInAttackRangeThrottled() {
          if (this.shouldRunAttackCheck()) {
            this.setCachedNearestInRangeTarget(this.findNearestEnemyInAttackRange());
          } else if (!this.isValidEnemy(this.cachedNearestInRange, this.cachedNearestInRangeLifeId)) {
            this.setCachedNearestInRangeTarget(null);
          }

          return this.isValidEnemyWithinRange(this.cachedNearestInRange, this.attackRange, this.cachedNearestInRangeLifeId) ? this.cachedNearestInRange : null;
        }

        refreshNearestEnemyTargetThrottled() {
          if (!this.shouldRunTargetSearch()) {
            return;
          }

          const queryToken = ++this.nearestEnemyQueryToken;
          this.targetSearchPending = true;
          this.targetSearchConfirmedNoTarget = false;
          const queued = this.queueNearestEnemyQuery(this.targetSearchRange, this.onNearestEnemyQueryResult, queryToken);
          if (queued) return;
          const target = this.findNearestEnemy();
          this.completeTargetSearch(target);

          if (!this.hasValidEnemyTarget()) {
            this.setEnemyTarget(target);
          }
        }

        updateForwardPrefVelocity() {
          if (!this.agent) return;
          this.sim.setPrefVelocity(this.agent, this.forwardDir.x * this.agent.maxSpeed, this.forwardDir.z * this.agent.maxSpeed);
        }

        updateSteadyHeroGuard(deltaTime) {
          if (!this.isHero) return false;
          if (!this.isSteady) return false;
          if (!this.agent) return false;
          if (this.heroGuardDistance <= 0) return false;
          let target = this.getValidEnemyTarget();

          if (!this.shouldKeepSteadyHeroTarget(target)) {
            target = this.findNearestEnemyInHeroGuardZone();
          }

          if (target) {
            this.onForward = false;
            this.agent.onForward = 0;

            if (this.getValidEnemyTarget() !== target) {
              this.setEnemyTarget(target);
              this.onBusy = false;
            }

            if (this.isValidEnemyWithinRange(target, this.attackRange)) {
              if (!this.onBusy) {
                const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
                  error: Error()
                }), GameManager) : GameManager).instance;

                if (gm) {
                  gm.onWaveCombatStarted(this, target, false);
                }
              }

              this.setEnemyTarget(target);
              this.onBusy = true;
              this.agent.locked = true;
              this.sim.setPrefVelocity(this.agent, 0, 0);
              this.agent.vel.x = 0;
              this.agent.vel.z = 0;
              this.lookAtTargetSmooth(target, deltaTime);
              this.sync(deltaTime, false);
              return true;
            }

            this.onBusy = false;
            this.agent.locked = false;
            const dx = target.agent.pos.x - this.agent.pos.x;
            const dz = target.agent.pos.z - this.agent.pos.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.0001) {
              this.sim.setPrefVelocity(this.agent, dx / dist * this.agent.maxSpeed, dz / dist * this.agent.maxSpeed);
            }

            this.lookAtTargetSmooth(target, deltaTime);
            this.sync(deltaTime, false);
            return true;
          }

          this.setEnemyTarget(null);
          this.onBusy = false;
          this.onForward = false;
          this.agent.onForward = 0;
          const dx = this.heroGuardHomeX - this.agent.pos.x;
          const dz = this.heroGuardHomeZ - this.agent.pos.z;
          const distSq = dx * dx + dz * dz;
          const tolerance = Math.max(0.001, this.heroGuardReturnTolerance);

          if (distSq > tolerance * tolerance) {
            this.agent.locked = false;
            const dist = Math.sqrt(distSq);
            this.sim.setPrefVelocity(this.agent, dx / dist * this.agent.maxSpeed, dz / dist * this.agent.maxSpeed);
            this.lookMoveIntentSmooth(deltaTime);
            this.sync(deltaTime, false);
            return true;
          }

          this.agent.locked = true;
          this.sim.setPrefVelocity(this.agent, 0, 0);
          this.agent.vel.x = 0;
          this.agent.vel.z = 0;
          this.returnToInitialYawSmooth(deltaTime);
          this.sync(deltaTime, false);
          return true;
        }

        findNearestEnemyInHeroGuardZone() {
          if (!this.agent) return null;
          const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          const enemies = gm && gm.spatialGrid ? gm.spatialGrid.queryEnemies(this.team, this.heroGuardHomeX, this.heroGuardHomeZ, this.heroGuardDistance) : this.getEnemyList();
          let best = null;
          let bestDistSq = Infinity;

          for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            if (!this.isEnemyInsideHeroGuardZone(enemy)) {
              continue;
            }

            const dx = enemy.agent.pos.x - this.agent.pos.x;
            const dz = enemy.agent.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d < bestDistSq) {
              bestDistSq = d;
              best = enemy;
            }
          }

          return best;
        }

        shouldKeepSteadyHeroTarget(target) {
          if (!this.isValidEnemy(target)) {
            return false;
          }

          if (this.isEnemyInsideHeroGuardZone(target)) {
            return true;
          }

          if (target === this.retaliationTarget && target.lifeId === this.retaliationTargetLifeId) {
            return true;
          }

          return this.onBusy && target === this.enemy && target.lifeId === this.enemyLifeId;
        }

        isEnemyInsideHeroGuardZone(enemy) {
          if (!this.isValidEnemy(enemy)) {
            return false;
          }

          const dx = enemy.agent.pos.x - this.heroGuardHomeX;
          const dz = enemy.agent.pos.z - this.heroGuardHomeZ;
          return dx * dx + dz * dz <= this.heroGuardDistance * this.heroGuardDistance;
        }

        hasPassedTargetAlongForward(target) {
          if (!this.agent || !target || !target.agent) return false;

          if (Math.abs(this.forwardDir.z) >= Math.abs(this.forwardDir.x)) {
            const myZ = this.agent.pos.z;
            const targetZ = target.agent.pos.z;

            if (this.forwardDir.z > 0 && myZ >= targetZ) {
              return true;
            }

            if (this.forwardDir.z < 0 && myZ <= targetZ) {
              return true;
            }

            return false;
          }

          const myX = this.agent.pos.x;
          const targetX = target.agent.pos.x;

          if (this.forwardDir.x > 0 && myX >= targetX) {
            return true;
          }

          if (this.forwardDir.x < 0 && myX <= targetX) {
            return true;
          }

          return false;
        }

        getEnemyHero() {
          const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          if (!gm) return null;
          return this.team === 0 ? gm.teamBHero : gm.teamAHero;
        }

        clearInvalidEnemy() {
          if (!this.hasValidEnemyTarget()) {
            this.setEnemyTarget(null);
          }
        }

        queueNearestEnemyQuery(radius, callback, callbackToken) {
          if (!this.agent) return false;
          const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (!gm || !gm.spatialGrid) {
            return false;
          }

          return gm.spatialGrid.requestNearestEnemy(this, this.team, this.agent.pos.x, this.agent.pos.z, radius, callback, callbackToken);
        }

        findNearestEnemyInAttackRange() {
          if (!this.agent) return null;
          const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (gm && gm.spatialGrid) {
            return gm.spatialGrid.findNearestEnemyInRange(this.team, this.agent.pos.x, this.agent.pos.z, this.attackRange);
          }

          return this.findNearestEnemyInAttackRangeFallback();
        }

        findNearestEnemy() {
          if (!this.agent) return null;
          const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (gm && gm.spatialGrid) {
            return gm.spatialGrid.findNearestEnemy(this.team, this.agent.pos.x, this.agent.pos.z, this.targetSearchRange);
          }

          return this.findNearestEnemyFallback();
        }

        findNearestEnemyInAttackRangeFallback() {
          if (!this.agent) return null;
          const attackRangeSq = this.attackRange * this.attackRange;
          const enemies = this.getEnemyList();
          let best = null;
          let bestDistSq = Infinity;

          for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (!this.isValidEnemy(e)) continue;
            const dx = e.agent.pos.x - this.agent.pos.x;
            const dz = e.agent.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d <= attackRangeSq && d < bestDistSq) {
              bestDistSq = d;
              best = e;
            }
          }

          return best;
        }

        findNearestEnemyFallback() {
          if (!this.agent) return null;
          const searchRangeSq = this.targetSearchRange * this.targetSearchRange;
          const enemies = this.getEnemyList();
          let best = null;
          let bestDistSq = Infinity;

          for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (!this.isValidEnemy(e)) continue;
            const dx = e.agent.pos.x - this.agent.pos.x;
            const dz = e.agent.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;
            if (d > searchRangeSq) continue;

            if (d < bestDistSq) {
              bestDistSq = d;
              best = e;
            }
          }

          return best;
        }

        isValidEnemy(e, lifeId = -1) {
          if (!e || e === this) return false;
          if (e.team === this.team) return false;
          if (lifeId >= 0 && e.lifeId !== lifeId) return false;
          if (!e.node.activeInHierarchy) return false;
          if (!e.agent) return false;
          if (!e.props || e.props.isDead()) return false;
          return true;
        }

        isValidEnemyWithinRange(e, range, lifeId = -1) {
          if (!this.agent) return false;
          if (!this.isValidEnemy(e, lifeId)) return false;
          const dx = e.agent.pos.x - this.agent.pos.x;
          const dz = e.agent.pos.z - this.agent.pos.z;
          return dx * dx + dz * dz <= range * range;
        }

        getEnemyList() {
          const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          if (!gm) return [];
          return this.team === 0 ? gm.teamB : gm.teamA;
        }

        getNearbyEnemyList(radius) {
          if (!this.agent) return [];
          const gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (gm && gm.spatialGrid) {
            return gm.spatialGrid.queryEnemies(this.team, this.agent.pos.x, this.agent.pos.z, radius);
          }

          return this.getEnemyList();
        }

        lookAtTargetSmooth(target, deltaTime) {
          if (!this.agent) return;
          if (!target || !target.agent) return;
          const dx = target.agent.pos.x - this.agent.pos.x;
          const dz = target.agent.pos.z - this.agent.pos.z;
          if (dx * dx + dz * dz < 0.0001) return;
          const targetY = Math.atan2(dx, dz) * 180 / Math.PI;
          const currentY = this.getVisualEulerY();

          if (this.getAngleDeltaAbs(currentY, targetY) <= 0.5) {
            return;
          }

          const newY = this.lerpAngle(currentY, targetY, this.rotationSpeed * deltaTime);
          this.setVisualYaw(newY);
        }

        returnToInitialYawSmooth(deltaTime) {
          const currentY = this.getVisualEulerY();
          const newY = this.lerpAngle(currentY, this.initialYaw, this.rotationSpeed * deltaTime);
          this.setVisualYaw(newY);
        }

        lookForwardSmooth(deltaTime) {
          const dx = this.forwardDir.x;
          const dz = this.forwardDir.z;
          this.lookDirectionSmooth(dx, dz, deltaTime);
        }

        lookMoveIntentSmooth(deltaTime) {
          if (!this.agent) return;
          if (this.agent.locked) return;
          const dx = this.agent.prefVel.x;
          const dz = this.agent.prefVel.z;
          const lenSq = dx * dx + dz * dz;

          if (lenSq < 0.0001) {
            this.lastMoveIntentDir.x = 0;
            this.lastMoveIntentDir.z = 0;
            this.moveIntentFacingActive = false;
            return;
          }

          const invLen = 1 / Math.sqrt(lenSq);
          const dirX = dx * invLen;
          const dirZ = dz * invLen;

          if (Math.abs(dirX - this.lastMoveIntentDir.x) > 0.001 || Math.abs(dirZ - this.lastMoveIntentDir.z) > 0.001) {
            this.lastMoveIntentDir.x = dirX;
            this.lastMoveIntentDir.z = dirZ;
            this.moveIntentFacingActive = true;
          }

          if (!this.moveIntentFacingActive) return;
          this.moveIntentFacingActive = this.lookDirectionSmooth(dirX, dirZ, deltaTime);
        }

        lookDirectionSmooth(dx, dz, deltaTime) {
          if (dx * dx + dz * dz < 0.0001) return false;
          const targetY = Math.atan2(dx, dz) * 180 / Math.PI;
          const currentY = this.getVisualEulerY();

          if (this.getAngleDeltaAbs(currentY, targetY) <= 0.5) {
            return false;
          }

          const newY = this.lerpAngle(currentY, targetY, this.rotationSpeed * deltaTime);
          this.setVisualYaw(newY);
          return true;
        }

        sync(deltaTime, rotateByVelocity) {
          if (!this.agent) return;
          const current = this.node.worldPosition;
          const targetX = this.agent.pos.x;
          const targetZ = this.agent.pos.z;
          const dx = targetX - current.x;
          const dz = targetZ - current.z;
          const distSq = dx * dx + dz * dz;
          let visualX = current.x;
          let visualZ = current.z;

          if (distSq >= this.visualThreshold * this.visualThreshold) {
            const t = Unit.visualLerpT;
            visualX = current.x + dx * t;
            visualZ = current.z + dz * t;
            this.tempPos.set(visualX, current.y, visualZ);
            this.node.setWorldPosition(this.tempPos);
          }

          if (!rotateByVelocity) return;
          const moveDx = visualX - this.lastStablePos.x;
          const moveDz = visualZ - this.lastStablePos.z;
          const moveDistSq = moveDx * moveDx + moveDz * moveDz;
          const minMove = Math.max(this.visualThreshold, this.moveThreshold);
          if (moveDistSq < minMove * minMove) return;
          this.lastStablePos.x = visualX;
          this.lastStablePos.z = visualZ;
          const targetAngle = Math.atan2(moveDx, moveDz) * 180 / Math.PI;
          const currentY = this.getVisualEulerY();
          const newY = this.lerpAngle(currentY, targetAngle, this.rotationSpeed * deltaTime);
          this.setVisualYaw(newY);
        }

        getVisualNode() {
          return this.visualRoot || this.node;
        }

        getVisualEulerY() {
          return this.getVisualNode().eulerAngles.y - this.visualYawOffset;
        }

        setVisualYaw(y) {
          this.moveIntentFacingActive = true;
          this.getVisualNode().setRotationFromEuler(0, y + this.visualYawOffset, 0);
        }

        resetStableRotationPosition() {
          const p = this.node.worldPosition;
          this.lastStablePos.x = p.x;
          this.lastStablePos.z = p.z;
        }

        resetMoveIntentFacing() {
          this.moveIntentFacingActive = true;
          this.lastMoveIntentDir.x = 0;
          this.lastMoveIntentDir.z = 0;
        }

        lerpAngle(a, b, t) {
          let diff = (b - a) % 360;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          return a + diff * t;
        }

        getAngleDeltaAbs(a, b) {
          let diff = (b - a) % 360;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          return Math.abs(diff);
        }

      }, _class3.visualLerpT = 1, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "visualRoot", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "visualYawOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "rotationSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "moveThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "visualThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.01;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "radius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "attackRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "attackCheckIntervalFrames", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "targetSearchRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 60;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "targetSearchIntervalFrames", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "aggressiveForward", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "forwardDir", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(0, 0, 1);
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "onForward", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "isSteady", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "heroGuardDistance", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "heroGuardReturnTolerance", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.08;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "enableAllyOvertake", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "overtakeLookAhead", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.2;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "overtakeSideRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.2;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "overtakeSideStrength", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.75;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "overtakeSpeedDiff", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.15;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b79af6dd10def61c9eb6716f874dd89431146589.js.map