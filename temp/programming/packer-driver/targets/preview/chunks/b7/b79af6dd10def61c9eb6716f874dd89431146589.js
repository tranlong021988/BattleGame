System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, EnemyFinder, UnitProps, GameManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _class3, _crd, ccclass, property, Unit;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEnemyFinder(extras) {
    _reporterNs.report("EnemyFinder", "./EnemyFinder", _context.meta, extras);
  }

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
      EnemyFinder = _unresolved_2.EnemyFinder;
    }, function (_unresolved_3) {
      UnitProps = _unresolved_3.UnitProps;
    }, function (_unresolved_4) {
      GameManager = _unresolved_4.GameManager;
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

          _initializerDefineProperty(this, "velThreshold", _descriptor11, this);

          _initializerDefineProperty(this, "visualThreshold", _descriptor12, this);

          _initializerDefineProperty(this, "onForward", _descriptor13, this);

          _initializerDefineProperty(this, "isSteady", _descriptor14, this);

          _initializerDefineProperty(this, "forwardDir", _descriptor15, this);

          _initializerDefineProperty(this, "enableAllyOvertake", _descriptor16, this);

          _initializerDefineProperty(this, "overtakeLookAhead", _descriptor17, this);

          _initializerDefineProperty(this, "overtakeSideRange", _descriptor18, this);

          _initializerDefineProperty(this, "overtakeSideStrength", _descriptor19, this);

          _initializerDefineProperty(this, "overtakeSpeedDiff", _descriptor20, this);

          this.team = 0;
          this.unitTypeName = '';
          this.isHero = false;
          this.laneId = -1;
          this.sim = null;
          this.agent = null;
          this.enemy = null;
          this.onBusy = false;
          this.updateOffset = 0;
          this.props = void 0;
          this.finder = void 0;
          this.initialYaw = 0;
          this.lastStablePos = {
            x: 0,
            z: 0
          };
          this.tempPos = new Vec3();
          this.frameCounter = 0;
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;
        }

        onLoad() {
          this.props = this.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);
          this.finder = this.getComponent(_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder);
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
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;

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
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;

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
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;
          this.laneId = -1;

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
          this.cachedNearestInRange = null;
          this.cachedNearestEnemy = null;
          this.laneId = -1;

          if (this.agent) {
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
            this.agent.locked = this.isSteady;
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
            this.updateForwardPhase();

            if (this.onForward) {
              this.agent.onForward = 1;
              this.sim.setPrefVelocity(this.agent, this.forwardDir.x * this.agent.maxSpeed, this.forwardDir.z * this.agent.maxSpeed);
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
            this.cachedNearestInRange = this.findNearestEnemyInAttackRange();
          } else if (!this.isValidEnemy(this.cachedNearestInRange)) {
            this.cachedNearestInRange = null;
          }

          return this.cachedNearestInRange;
        }

        getNearestEnemyThrottled() {
          if (this.shouldRunTargetSearch()) {
            this.cachedNearestEnemy = this.findNearestEnemy();
          } else if (!this.isValidEnemy(this.cachedNearestEnemy)) {
            this.cachedNearestEnemy = null;
          }

          return this.cachedNearestEnemy;
        }

        updateForwardPhase() {
          if (!this.agent) return; // Rule ưu tiên:
          // 1. Nếu lane hiện tại có địch, cứ forward cho tới khi vượt qua Z/X của địch cùng lane gần nhất.
          // 2. Nếu lane hiện tại trống, KHÔNG cắt chéo ngay. Tiếp tục forward để tạo pha thọc sườn.
          // 3. Khi đã vượt qua Z/X của địch gần nhất ở lane kề bên, mới free hunt toàn map.
          // 4. Nếu cuối cùng không gặp ai và đã vượt qua line hero địch, cũng free hunt để đánh hero.

          var nearestLaneEnemy = this.findNearestEnemyInSameLane();

          if (nearestLaneEnemy && nearestLaneEnemy.agent) {
            if (this.hasPassedTargetAlongForward(nearestLaneEnemy)) {
              this.onForward = false;
            }

            return;
          }

          var nearestAdjacentLaneEnemy = this.findNearestEnemyInAdjacentLane();

          if (nearestAdjacentLaneEnemy && nearestAdjacentLaneEnemy.agent && this.hasPassedTargetAlongForward(nearestAdjacentLaneEnemy)) {
            this.onForward = false;
            return;
          }

          var enemyHero = this.getEnemyHero();

          if (enemyHero && enemyHero.agent && this.hasPassedTargetAlongForward(enemyHero)) {
            this.onForward = false;
            return;
          }
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

        findNearestEnemyInAdjacentLane() {
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

        getEnemyList() {
          return this.finder.getTeam() === 0 ? (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamB : (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamA;
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

          if (distSq >= this.visualThreshold * this.visualThreshold) {
            var t = Unit.visualLerpT;
            var newX = current.x + dx * t;
            var newZ = current.z + dz * t;
            this.tempPos.set(newX, current.y, newZ);
            this.node.setWorldPosition(this.tempPos);
          }

          if (!rotateByVelocity) return;
          var vx = this.agent.vel.x;
          var vz = this.agent.vel.z;
          var speedSq = vx * vx + vz * vz;
          if (speedSq < this.velThreshold * this.velThreshold) return;
          var moveDx = this.agent.pos.x - this.lastStablePos.x;
          var moveDz = this.agent.pos.z - this.lastStablePos.z;
          var moveDistSq = moveDx * moveDx + moveDz * moveDz;
          if (moveDistSq < this.moveThreshold * this.moveThreshold) return;
          this.lastStablePos.x = this.agent.pos.x;
          this.lastStablePos.z = this.agent.pos.z;
          var targetAngle = Math.atan2(vx, vz) * 180 / Math.PI;
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
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "velThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.05;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "visualThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.01;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "onForward", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "isSteady", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "forwardDir", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Vec3(0, 0, 1);
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "enableAllyOvertake", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "overtakeLookAhead", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.2;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "overtakeSideRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "overtakeSideStrength", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.75;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "overtakeSpeedDiff", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.15;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b79af6dd10def61c9eb6716f874dd89431146589.js.map