System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, UnitProps, GameManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _class3, _crd, ccclass, property, Unit;

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

      _export("Unit", Unit = (_dec = ccclass('Unit'), _dec2 = property(Node), _dec3 = property(Vec3), _dec(_class = (_class2 = (_class3 = class Unit extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "visualRoot", _descriptor, this);

          _initializerDefineProperty(this, "visualYawOffset", _descriptor2, this);

          _initializerDefineProperty(this, "moveSpeed", _descriptor3, this);

          _initializerDefineProperty(this, "radius", _descriptor4, this);

          _initializerDefineProperty(this, "attackRange", _descriptor5, this);

          _initializerDefineProperty(this, "targetSearchRange", _descriptor6, this);

          _initializerDefineProperty(this, "attackCheckIntervalFrames", _descriptor7, this);

          _initializerDefineProperty(this, "targetSearchIntervalFrames", _descriptor8, this);

          _initializerDefineProperty(this, "rotationSpeed", _descriptor9, this);

          _initializerDefineProperty(this, "moveThreshold", _descriptor10, this);

          _initializerDefineProperty(this, "visualThreshold", _descriptor11, this);

          _initializerDefineProperty(this, "onForward", _descriptor12, this);

          _initializerDefineProperty(this, "isSteady", _descriptor13, this);

          _initializerDefineProperty(this, "forwardDir", _descriptor14, this);

          _initializerDefineProperty(this, "enableAllyOvertake", _descriptor15, this);

          _initializerDefineProperty(this, "overtakeLookAhead", _descriptor16, this);

          _initializerDefineProperty(this, "overtakeSideRange", _descriptor17, this);

          _initializerDefineProperty(this, "overtakeSideStrength", _descriptor18, this);

          _initializerDefineProperty(this, "overtakeSpeedDiff", _descriptor19, this);

          _initializerDefineProperty(this, "laneReturnTolerance", _descriptor20, this);

          this.team = 0;
          this.unitTypeName = '';
          this.isHero = false;
          this.laneId = -1;
          this.forwardLaneOffsetX = 0;
          this.returningToWaveLaneSlot = false;
          this.sim = null;
          this.agent = null;
          this.enemy = null;
          this.onBusy = false;
          this.updateOffset = 0;
          this.props = void 0;
          this.initialYaw = 0;
          this.lastStablePos = {
            x: 0,
            z: 0
          };
          this.tempPos = new Vec3();
          this.frameCounter = 0;
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;
          this.forwardAdjacentTarget = null;
          this.nearestInRangeQueryToken = 0;
          this.nearestEnemyQueryToken = 0;
        }

        onLoad() {
          this.props = this.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);
        }

        init(sim, team, unitTypeName, forwardX, forwardZ) {
          this.team = team;
          this.unitTypeName = unitTypeName;
          this.sim = sim; // Unit node chỉ handle position.
          // Rotation visual nằm ở visualRoot.

          this.node.setRotationFromEuler(0, 0, 0);
          var p = this.node.worldPosition;
          this.initialYaw = this.getVisualEulerY();
          this.agent = sim.addAgent(p.x, p.z);
          this.agent.maxSpeed = this.moveSpeed;
          this.agent.radius = this.radius;
          this.enemy = null;
          this.onBusy = false;
          this.onForward = !this.isSteady;
          this.setForwardDir(forwardX, forwardZ);
          this.updateOffset = Math.floor(Math.random() * 1000);
          this.frameCounter = this.updateOffset;
          this.invalidateNearestQueryResults();
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;
          this.forwardAdjacentTarget = null;

          if (this.laneId < 0) {
            this.laneId = -1;
          }

          this.lastStablePos.x = p.x;
          this.lastStablePos.z = p.z;
          this.applyRuntimeAgentData();
          this.applySteadyState();
        }

        setSteady(value, useForwardPhase) {
          if (useForwardPhase === void 0) {
            useForwardPhase = true;
          }

          this.isSteady = value;
          if (!this.agent) return;
          this.invalidateNearestQueryResults();
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;
          this.forwardAdjacentTarget = null;

          if (value) {
            this.enemy = null;
            this.onBusy = false;
            this.onForward = false;
            this.initialYaw = this.getVisualEulerY();
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

          this.enemy = null;
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
          this.agent.onForward = this.onForward && !this.returningToWaveLaneSlot ? 1 : 0;
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
          this.nearestInRangeQueryToken++;
          this.nearestEnemyQueryToken++;
        }

        setForwardDir(x, z) {
          var len = Math.sqrt(x * x + z * z);

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
          this.enemy = null;
          this.onBusy = false;
          this.onForward = true;
          this.invalidateNearestQueryResults();
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;
          this.forwardAdjacentTarget = null;
          this.laneId = -1;
          this.forwardLaneOffsetX = 0;
          this.returningToWaveLaneSlot = false;

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
          this.enemy = e;
        }

        clearEnemy() {
          this.enemy = null;
          this.onBusy = false;
          this.invalidateNearestQueryResults();
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;
          this.forwardAdjacentTarget = null;

          if (this.agent) {
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.locked = this.isSteady;
          }
        }

        enterFreeHuntMode(searchRange) {
          if (searchRange === void 0) {
            searchRange = this.targetSearchRange;
          }

          this.isSteady = false;
          this.onForward = false;
          this.returningToWaveLaneSlot = false;
          this.laneId = -1;
          this.forwardLaneOffsetX = 0;
          this.targetSearchRange = Math.max(this.targetSearchRange, searchRange);
          this.invalidateNearestQueryResults();
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;
          this.forwardAdjacentTarget = null;

          if (!this.onBusy) {
            this.enemy = null;
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

        setWaveForwardLane(laneId, laneOffsetX, returnToSlot) {
          if (laneOffsetX === void 0) {
            laneOffsetX = this.forwardLaneOffsetX;
          }

          if (returnToSlot === void 0) {
            returnToSlot = true;
          }

          if (this.isSteady) return;
          this.laneId = laneId;
          this.forwardLaneOffsetX = laneOffsetX;
          this.returningToWaveLaneSlot = returnToSlot;
          this.enemy = null;
          this.onBusy = false;
          this.onForward = true;
          this.invalidateNearestQueryResults();
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;
          this.forwardAdjacentTarget = null;

          if (this.agent) {
            this.agent.locked = false;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.onForward = 1;
          }
        }

        enterWaveCombatMode() {
          this.returningToWaveLaneSlot = false;
          this.onForward = false;
          this.invalidateNearestQueryResults();
          this.cachedNearestEnemy = null;
          this.cachedNearestInRange = null;
          this.forwardAdjacentTarget = null;

          if (this.agent) {
            this.agent.onForward = 0;

            if (!this.onBusy) {
              this.agent.locked = this.isSteady;
            }
          }
        }

        enterWaveFreeHuntMode() {
          this.returningToWaveLaneSlot = false;
          this.onForward = false;
          this.invalidateNearestQueryResults();
          this.cachedNearestEnemy = null;
          this.cachedNearestInRange = null;
          this.forwardAdjacentTarget = null;

          if (this.agent) {
            this.agent.onForward = 0;

            if (!this.onBusy) {
              this.agent.locked = this.isSteady;
            }
          }
        }

        update(deltaTime) {
          if (!this.sim || !this.agent) return;
          this.frameCounter++;
          this.applyRuntimeAgentData();

          if (this.isSteady) {
            this.agent.locked = true;
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.onForward = false;
            this.agent.onForward = 0;
          }

          if (this.onBusy) {
            if (!this.enemy || !this.enemy.node.activeInHierarchy || !this.enemy.agent || !this.enemy.props || this.enemy.props.isDead()) {
              this.clearEnemy();
            } else {
              this.lookAtTargetSmooth(this.enemy, deltaTime);
              this.sim.setPrefVelocity(this.agent, 0, 0);
              this.agent.vel.x = 0;
              this.agent.vel.z = 0;
              this.sync(deltaTime, false);
              return;
            }
          }

          this.clearInvalidEnemy();
          var nearestInRange = this.getNearestEnemyInAttackRangeThrottled();

          if (nearestInRange) {
            var gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;

            if (gm) {
              gm.onWaveCombatStarted(this, nearestInRange);
            }

            this.returningToWaveLaneSlot = false;
            this.onForward = false;
            this.agent.onForward = 0;
            this.enemy = nearestInRange;
            this.onBusy = true;
            this.agent.locked = true;
            this.cachedNearestEnemy = null;
            this.cachedNearestInRange = null;
            this.lookAtTargetSmooth(this.enemy, deltaTime);
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
            if (this.returningToWaveLaneSlot && !this.shouldReturnToLaneSlot()) {
              this.returningToWaveLaneSlot = false;
            }

            if (!this.returningToWaveLaneSlot) {
              this.updateForwardPhase();
            }

            if (this.onForward) {
              this.agent.onForward = this.returningToWaveLaneSlot ? 0 : 1;
              this.updateForwardPrefVelocity();
              this.sync(deltaTime, true);
              return;
            }
          }

          this.agent.onForward = 0;

          if (!this.isValidEnemy(this.enemy)) {
            this.enemy = this.getNearestEnemyThrottled();
          }

          if (this.enemy && this.enemy.agent) {
            var dx = this.enemy.agent.pos.x - this.agent.pos.x;
            var dz = this.enemy.agent.pos.z - this.agent.pos.z;
            var dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.0001) {
              this.sim.setPrefVelocity(this.agent, dx / dist * this.agent.maxSpeed, dz / dist * this.agent.maxSpeed);
            }

            this.lookAtTargetSmooth(this.enemy, deltaTime);
            this.sync(deltaTime, false);
          } else {
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.sync(deltaTime, true);
          }
        }

        shouldRunAttackCheck() {
          var interval = Math.max(1, Math.floor(this.attackCheckIntervalFrames));
          return this.frameCounter % interval === 0;
        }

        shouldRunTargetSearch() {
          var interval = Math.max(1, Math.floor(this.targetSearchIntervalFrames));
          return this.frameCounter % interval === 0;
        }

        getNearestEnemyInAttackRangeThrottled() {
          if (this.shouldRunAttackCheck()) {
            var queryToken = ++this.nearestInRangeQueryToken;
            var queued = this.queueNearestEnemyQuery(this.attackRange, target => {
              if (queryToken !== this.nearestInRangeQueryToken) {
                return;
              }

              this.cachedNearestInRange = this.isValidEnemyWithinRange(target, this.attackRange) ? target : null;
            });

            if (!queued) {
              this.cachedNearestInRange = this.findNearestEnemyInAttackRange();
            }
          } else if (!this.isValidEnemy(this.cachedNearestInRange)) {
            this.cachedNearestInRange = null;
          }

          return this.isValidEnemyWithinRange(this.cachedNearestInRange, this.attackRange) ? this.cachedNearestInRange : null;
        }

        getNearestEnemyThrottled() {
          if (this.shouldRunTargetSearch()) {
            var queryToken = ++this.nearestEnemyQueryToken;
            var queued = this.queueNearestEnemyQuery(this.targetSearchRange, target => {
              if (queryToken !== this.nearestEnemyQueryToken) {
                return;
              }

              this.cachedNearestEnemy = this.isValidEnemyWithinRange(target, this.targetSearchRange) ? target : null;
            });

            if (!queued) {
              this.cachedNearestEnemy = this.findNearestEnemy();
            }
          } else if (!this.isValidEnemy(this.cachedNearestEnemy)) {
            this.cachedNearestEnemy = null;
          }

          return this.isValidEnemyWithinRange(this.cachedNearestEnemy, this.targetSearchRange) ? this.cachedNearestEnemy : null;
        }

        updateForwardPhase() {
          if (!this.agent) return; // Rule ưu tiên:
          // 1. Nếu lane hiện tại có địch, cứ forward cho tới khi vượt qua Z/X của địch cùng lane gần nhất.
          // 2. Nếu lane hiện tại trống, KHÔNG cắt chéo ngay. Tiếp tục forward để tạo pha thọc sườn.
          // 3. Khi đã vượt qua Z/X của địch gần nhất ở lane kề bên, mới free hunt toàn map.
          // 4. Nếu cuối cùng không gặp ai và đã vượt qua line hero địch, cũng free hunt để đánh hero.
          // Same-lane enemies no longer steer forward phase decisions.
          // Contact combat handles them and moves the whole wave to freehunt.

          var nearestAdjacentLaneEnemy = this.getForwardAdjacentTarget();

          if (!nearestAdjacentLaneEnemy) {
            nearestAdjacentLaneEnemy = this.findNearestEnemyInAdjacentLane(true);
            this.forwardAdjacentTarget = nearestAdjacentLaneEnemy;
          }

          if (nearestAdjacentLaneEnemy) {
            if (this.hasPassedTargetAlongForward(nearestAdjacentLaneEnemy)) {
              this.forwardAdjacentTarget = null;

              if (!this.releaseWaveForwardToFreeHunt(nearestAdjacentLaneEnemy)) {
                this.onForward = false;
              }

              return;
            }
          }

          var enemyHero = this.getEnemyHero();

          if (enemyHero && this.isValidEnemy(enemyHero) && this.hasPassedTargetAlongForward(enemyHero)) {
            if (!this.releaseWaveForwardToHeroFreeHunt(enemyHero)) {
              this.onForward = false;
            }

            return;
          }
        }

        releaseWaveForwardToFreeHunt(target) {
          var gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          if (!gm) return false;
          return gm.onWaveForwardPassedAdjacentTarget(this, target);
        }

        releaseWaveForwardToHeroFreeHunt(hero) {
          var gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          if (!gm) return false;
          return gm.onWaveForwardPassedHeroTarget(this, hero);
        }

        shouldReturnToLaneSlot() {
          if (!this.agent) return false;
          var laneTargetX = this.getCurrentLaneTargetX();

          if (!this.returningToWaveLaneSlot || laneTargetX === null) {
            return false;
          }

          var tolerance = Math.max(0.01, this.laneReturnTolerance);
          return Math.abs(laneTargetX - this.agent.pos.x) > tolerance;
        }

        updateForwardPrefVelocity() {
          if (!this.agent) return;
          var laneTargetX = this.getCurrentLaneTargetX();

          if (this.returningToWaveLaneSlot && laneTargetX !== null) {
            var dx = laneTargetX - this.agent.pos.x;

            if (this.shouldReturnToLaneSlot()) {
              this.sim.setPrefVelocity(this.agent, Math.sign(dx) * this.agent.maxSpeed, 0);
              return;
            }
          }

          this.sim.setPrefVelocity(this.agent, this.forwardDir.x * this.agent.maxSpeed, this.forwardDir.z * this.agent.maxSpeed);
        }

        getCurrentLaneTargetX() {
          if (this.laneId < 0) return null;
          var gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (!gm || !gm.enableLaneSpawn) {
            return null;
          }

          return gm.getLaneCenterX(this.laneId) + this.forwardLaneOffsetX;
        }

        hasPassedTargetAlongForward(target) {
          if (!this.agent || !target || !target.agent) return false;

          if (Math.abs(this.forwardDir.z) >= Math.abs(this.forwardDir.x)) {
            var myZ = this.agent.pos.z;
            var targetZ = target.agent.pos.z;

            if (this.forwardDir.z > 0 && myZ >= targetZ) {
              return true;
            }

            if (this.forwardDir.z < 0 && myZ <= targetZ) {
              return true;
            }

            return false;
          }

          var myX = this.agent.pos.x;
          var targetX = target.agent.pos.x;

          if (this.forwardDir.x > 0 && myX >= targetX) {
            return true;
          }

          if (this.forwardDir.x < 0 && myX <= targetX) {
            return true;
          }

          return false;
        }

        isTargetAheadAlongForward(target) {
          if (!this.agent || !target || !target.agent) return false;

          if (Math.abs(this.forwardDir.z) >= Math.abs(this.forwardDir.x)) {
            var dz = target.agent.pos.z - this.agent.pos.z;
            return this.forwardDir.z >= 0 ? dz >= 0 : dz <= 0;
          }

          var dx = target.agent.pos.x - this.agent.pos.x;
          return this.forwardDir.x >= 0 ? dx >= 0 : dx <= 0;
        }

        getForwardAdjacentTarget() {
          var target = this.forwardAdjacentTarget;
          if (!target) return null;

          if (!this.isValidEnemy(target) || !this.isAdjacentLane(target.laneId)) {
            this.forwardAdjacentTarget = null;
            return null;
          }

          return target;
        }

        findNearestEnemyInSameLane() {
          if (!this.agent) return null;
          if (this.laneId < 0) return this.getNearestEnemyThrottled();
          var enemies = this.getEnemyList();
          var best = null;
          var bestDistSq = Infinity;
          var maxRangeSq = this.targetSearchRange * this.targetSearchRange;

          for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!this.isValidEnemy(e)) continue;
            if (e.laneId !== this.laneId) continue;
            var dx = e.agent.pos.x - this.agent.pos.x;
            var dz = e.agent.pos.z - this.agent.pos.z;
            var d = dx * dx + dz * dz;
            if (d > maxRangeSq) continue;

            if (d < bestDistSq) {
              bestDistSq = d;
              best = e;
            }
          }

          return best;
        }

        findNearestEnemyInAdjacentLane(onlyAhead) {
          if (onlyAhead === void 0) {
            onlyAhead = false;
          }

          if (!this.agent) return null;
          if (this.laneId < 0) return null;
          var enemies = this.getEnemyList();
          var best = null;
          var bestDistSq = Infinity;
          var maxRangeSq = this.targetSearchRange * this.targetSearchRange;

          for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!this.isValidEnemy(e)) continue;
            if (!this.isAdjacentLane(e.laneId)) continue;
            if (onlyAhead && !this.isTargetAheadAlongForward(e)) continue;
            var dx = e.agent.pos.x - this.agent.pos.x;
            var dz = e.agent.pos.z - this.agent.pos.z;
            var d = dx * dx + dz * dz;
            if (d > maxRangeSq) continue;

            if (d < bestDistSq) {
              bestDistSq = d;
              best = e;
            }
          }

          return best;
        }

        isAdjacentLane(otherLaneId) {
          if (this.laneId < 0) return false;
          if (otherLaneId < 0) return false;
          return Math.abs(otherLaneId - this.laneId) === 1;
        }

        getEnemyHero() {
          var gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          if (!gm) return null;
          return this.team === 0 ? gm.teamBHero : gm.teamAHero;
        }

        clearInvalidEnemy() {
          if (!this.enemy || !this.enemy.node.activeInHierarchy || !this.enemy.agent || !this.enemy.props || this.enemy.props.isDead()) {
            this.enemy = null;
          }
        }

        queueNearestEnemyQuery(radius, callback) {
          if (!this.agent) return false;
          var gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (!gm || !gm.spatialGrid) {
            return false;
          }

          return gm.spatialGrid.requestNearestEnemy(this, this.team, this.agent.pos.x, this.agent.pos.z, radius, target => {
            if (!this.node.activeInHierarchy) {
              return;
            }

            if (!this.agent || this.props.isDead()) {
              callback(null);
              return;
            }

            callback(target);
          });
        }

        findNearestEnemyInAttackRange() {
          if (!this.agent) return null;
          var gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (gm && gm.spatialGrid) {
            var result = gm.spatialGrid.findNearestEnemyInRange(this.team, this.agent.pos.x, this.agent.pos.z, this.attackRange);
            if (result) return result;
          }

          return this.findNearestEnemyInAttackRangeFallback();
        }

        findNearestEnemy() {
          if (!this.agent) return null;
          var gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (gm && gm.spatialGrid) {
            var result = gm.spatialGrid.findNearestEnemy(this.team, this.agent.pos.x, this.agent.pos.z, this.targetSearchRange);
            if (result) return result;
          }

          return this.findNearestEnemyFallback();
        }

        findNearestEnemyInAttackRangeFallback() {
          if (!this.agent) return null;
          var attackRangeSq = this.attackRange * this.attackRange;
          var enemies = this.getEnemyList();
          var best = null;
          var bestDistSq = Infinity;

          for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!this.isValidEnemy(e)) continue;
            var dx = e.agent.pos.x - this.agent.pos.x;
            var dz = e.agent.pos.z - this.agent.pos.z;
            var d = dx * dx + dz * dz;

            if (d <= attackRangeSq && d < bestDistSq) {
              bestDistSq = d;
              best = e;
            }
          }

          return best;
        }

        findNearestEnemyFallback() {
          if (!this.agent) return null;
          var enemies = this.getEnemyList();
          var best = null;
          var bestDistSq = Infinity;

          for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!this.isValidEnemy(e)) continue;
            var dx = e.agent.pos.x - this.agent.pos.x;
            var dz = e.agent.pos.z - this.agent.pos.z;
            var d = dx * dx + dz * dz;

            if (d < bestDistSq) {
              bestDistSq = d;
              best = e;
            }
          }

          return best;
        }

        isValidEnemy(e) {
          if (!e || e === this) return false;
          if (!e.node.activeInHierarchy) return false;
          if (!e.agent) return false;
          if (!e.props || e.props.isDead()) return false;
          return true;
        }

        isValidEnemyWithinRange(e, range) {
          if (!this.agent) return false;
          if (!this.isValidEnemy(e)) return false;
          var dx = e.agent.pos.x - this.agent.pos.x;
          var dz = e.agent.pos.z - this.agent.pos.z;
          return dx * dx + dz * dz <= range * range;
        }

        getEnemyList() {
          var gm = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          if (!gm) return [];
          return this.team === 0 ? gm.teamB : gm.teamA;
        }

        lookAtTargetSmooth(target, deltaTime) {
          if (!this.agent) return;
          if (!target || !target.agent) return;
          var dx = target.agent.pos.x - this.agent.pos.x;
          var dz = target.agent.pos.z - this.agent.pos.z;
          if (dx * dx + dz * dz < 0.0001) return;
          var targetY = Math.atan2(dx, dz) * 180 / Math.PI;
          var currentY = this.getVisualEulerY();
          var newY = this.lerpAngle(currentY, targetY, this.rotationSpeed * deltaTime);
          this.setVisualYaw(newY);
        }

        returnToInitialYawSmooth(deltaTime) {
          var currentY = this.getVisualEulerY();
          var newY = this.lerpAngle(currentY, this.initialYaw, this.rotationSpeed * deltaTime);
          this.setVisualYaw(newY);
        }

        sync(deltaTime, rotateByVelocity) {
          if (!this.agent) return;
          var current = this.node.worldPosition;
          var targetX = this.agent.pos.x;
          var targetZ = this.agent.pos.z;
          var dx = targetX - current.x;
          var dz = targetZ - current.z;
          var distSq = dx * dx + dz * dz;
          var visualX = current.x;
          var visualZ = current.z;

          if (distSq >= this.visualThreshold * this.visualThreshold) {
            var t = Unit.visualLerpT;
            visualX = current.x + dx * t;
            visualZ = current.z + dz * t;
            this.tempPos.set(visualX, current.y, visualZ);
            this.node.setWorldPosition(this.tempPos);
          }

          if (!rotateByVelocity) return;
          var moveDx = visualX - this.lastStablePos.x;
          var moveDz = visualZ - this.lastStablePos.z;
          var moveDistSq = moveDx * moveDx + moveDz * moveDz;
          var minMove = Math.max(this.visualThreshold, this.moveThreshold);
          if (moveDistSq < minMove * minMove) return;
          this.lastStablePos.x = visualX;
          this.lastStablePos.z = visualZ;
          var targetAngle = Math.atan2(moveDx, moveDz) * 180 / Math.PI;
          var currentY = this.getVisualEulerY();
          var newY = this.lerpAngle(currentY, targetAngle, this.rotationSpeed * deltaTime);
          this.setVisualYaw(newY);
        }

        getVisualNode() {
          return this.visualRoot || this.node;
        }

        getVisualEulerY() {
          return this.getVisualNode().eulerAngles.y - this.visualYawOffset;
        }

        setVisualYaw(y) {
          this.getVisualNode().setRotationFromEuler(0, y + this.visualYawOffset, 0);
        }

        lerpAngle(a, b, t) {
          var diff = (b - a) % 360;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          return a + diff * t;
        }

      }, _class3.visualLerpT = 1, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "visualRoot", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "visualYawOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "radius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "attackRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "targetSearchRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 60;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "attackCheckIntervalFrames", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "targetSearchIntervalFrames", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "rotationSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "moveThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "visualThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.01;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "onForward", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "isSteady", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "forwardDir", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3(0, 0, 1);
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "enableAllyOvertake", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "overtakeLookAhead", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.2;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "overtakeSideRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "overtakeSideStrength", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.75;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "overtakeSpeedDiff", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.15;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "laneReturnTolerance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.35;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3125f7db19fcc1ddaa7826bf2b62ba84e3995d89.js.map