System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, EnemyFinder, UnitProps, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, Unit;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRVOSimulator(extras) {
    _reporterNs.report("RVOSimulator", "./rvo/RVO", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOAgent(extras) {
    _reporterNs.report("RVOAgent", "./rvo/RVO", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemyFinder(extras) {
    _reporterNs.report("EnemyFinder", "./EnemyFinder", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitProps(extras) {
    _reporterNs.report("UnitProps", "./UnitProps", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      EnemyFinder = _unresolved_2.EnemyFinder;
    }, function (_unresolved_3) {
      UnitProps = _unresolved_3.UnitProps;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6e964qkrR5F2YvWvH5N+eXO", "Unit", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Unit", Unit = (_dec = ccclass('Unit'), _dec2 = property(Vec3), _dec(_class = (_class2 = class Unit extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "moveSpeed", _descriptor, this);

          _initializerDefineProperty(this, "radius", _descriptor2, this);

          _initializerDefineProperty(this, "attackRange", _descriptor3, this);

          _initializerDefineProperty(this, "rotationSpeed", _descriptor4, this);

          _initializerDefineProperty(this, "moveThreshold", _descriptor5, this);

          _initializerDefineProperty(this, "velThreshold", _descriptor6, this);

          // Deadzone rất nhỏ để bỏ qua rung vi mô.
          _initializerDefineProperty(this, "visualThreshold", _descriptor7, this);

          // Càng lớn càng bám sát agent nhanh hơn.
          // Gợi ý: 12 - 20.
          _initializerDefineProperty(this, "visualSmooth", _descriptor8, this);

          _initializerDefineProperty(this, "onForward", _descriptor9, this);

          _initializerDefineProperty(this, "forwardDir", _descriptor10, this);

          this.team = 0;
          this.unitTypeName = '';
          this.sim = null;
          this.agent = null;
          this.enemy = null;
          this.onBusy = false;
          this.updateOffset = 0;
          this.props = void 0;
          this.finder = void 0;
          this.lastStablePos = {
            x: 0,
            z: 0
          };
          this.tempPos = new Vec3();
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
          this.sim = sim;
          const p = this.node.worldPosition;
          this.agent = sim.addAgent(p.x, p.z);
          this.agent.maxSpeed = this.moveSpeed;
          this.agent.radius = this.radius;
          this.agent.locked = false;
          this.enemy = null;
          this.onBusy = false;
          this.onForward = true;
          this.setForwardDir(forwardX, forwardZ);
          this.updateOffset = Math.floor(Math.random() * 1000);
          this.lastStablePos.x = p.x;
          this.lastStablePos.z = p.z;
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
          this.enemy = null;
          this.onBusy = false;
          this.onForward = true;

          if (this.agent) {
            this.agent.locked = false;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
          }

          this.agent = null;
          this.sim = null;
        }

        setEnemy(e) {
          if (this.onBusy) return;
          if (this.onForward) return;
          this.enemy = e;

          if (this.enemy && this.enemy.agent) {
            this.lookAtEnemyInstant();
          }
        }

        clearEnemy() {
          this.enemy = null;
          this.onBusy = false;

          if (this.agent) {
            this.agent.locked = false;
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.agent.prefVel.x = 0;
            this.agent.prefVel.z = 0;
          }
        }

        update(deltaTime) {
          if (!this.sim || !this.agent) return; // ===== ENGAGED =====

          if (this.onBusy) {
            if (!this.enemy || !this.enemy.node.activeInHierarchy || !this.enemy.agent || !this.enemy.props || this.enemy.props.isDead()) {
              this.clearEnemy();
            } else {
              this.lookAtEnemyInstant();
              this.sim.setPrefVelocity(this.agent, 0, 0);
              this.agent.vel.x = 0;
              this.agent.vel.z = 0;
              this.sync(deltaTime);
              return;
            }
          }

          this.clearInvalidEnemy(); // Ưu tiên đánh nếu đã có enemy trong range, kể cả đang onForward.

          const nearestInRange = this.findNearestEnemyInAttackRange();

          if (nearestInRange) {
            this.onForward = false;
            this.enemy = nearestInRange;
            this.onBusy = true;
            this.agent.locked = true;
            this.lookAtEnemyInstant();
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            this.sync(deltaTime);
            return;
          } // ===== FORWARD PHASE =====


          if (this.onForward) {
            this.updateForwardPhase();

            if (this.onForward) {
              this.sim.setPrefVelocity(this.agent, this.forwardDir.x * this.agent.maxSpeed, this.forwardDir.z * this.agent.maxSpeed);
              this.sync(deltaTime);
              return;
            }
          } // ===== CHASE PHASE =====


          if (!this.enemy) {
            this.enemy = this.findNearestEnemy();
          }

          if (this.enemy && this.enemy.agent) {
            const dx = this.enemy.agent.pos.x - this.agent.pos.x;
            const dz = this.enemy.agent.pos.z - this.agent.pos.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist > 0.0001) {
              this.sim.setPrefVelocity(this.agent, dx / dist * this.agent.maxSpeed, dz / dist * this.agent.maxSpeed);
            }
          } else {
            this.sim.setPrefVelocity(this.agent, 0, 0);
          }

          this.sync(deltaTime);
        }

        updateForwardPhase() {
          if (!this.agent) return;
          const nearestEnemy = this.findNearestEnemy();

          if (!nearestEnemy || !nearestEnemy.agent) {
            return;
          }

          if (Math.abs(this.forwardDir.z) >= Math.abs(this.forwardDir.x)) {
            const myZ = this.agent.pos.z;
            const enemyZ = nearestEnemy.agent.pos.z;

            if (this.forwardDir.z > 0 && myZ >= enemyZ) {
              this.onForward = false;
              return;
            }

            if (this.forwardDir.z < 0 && myZ <= enemyZ) {
              this.onForward = false;
              return;
            }
          } else {
            const myX = this.agent.pos.x;
            const enemyX = nearestEnemy.agent.pos.x;

            if (this.forwardDir.x > 0 && myX >= enemyX) {
              this.onForward = false;
              return;
            }

            if (this.forwardDir.x < 0 && myX <= enemyX) {
              this.onForward = false;
              return;
            }
          }
        }

        clearInvalidEnemy() {
          if (!this.enemy || !this.enemy.node.activeInHierarchy || !this.enemy.agent || !this.enemy.props || this.enemy.props.isDead()) {
            this.enemy = null;
          }
        }

        findNearestEnemyInAttackRange() {
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

        findNearestEnemy() {
          if (!this.agent) return null;
          const enemies = this.getEnemyList();
          let best = null;
          let bestDistSq = Infinity;

          for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (!this.isValidEnemy(e)) continue;
            const dx = e.agent.pos.x - this.agent.pos.x;
            const dz = e.agent.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

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

        lookAtEnemyInstant() {
          if (!this.agent) return;
          if (!this.enemy || !this.enemy.agent) return;
          const dx = this.enemy.agent.pos.x - this.agent.pos.x;
          const dz = this.enemy.agent.pos.z - this.agent.pos.z;

          if (dx * dx + dz * dz < 0.0001) {
            return;
          }

          const targetY = Math.atan2(dx, dz) * 180 / Math.PI;
          this.node.setRotationFromEuler(0, targetY, 0);
        }

        sync(deltaTime) {
          if (!this.agent) return;
          const current = this.node.worldPosition;
          const targetX = this.agent.pos.x;
          const targetZ = this.agent.pos.z;
          const dx = targetX - current.x;
          const dz = targetZ - current.z;
          const distSq = dx * dx + dz * dz;

          if (distSq >= this.visualThreshold * this.visualThreshold) {
            const t = 1 - Math.exp(-this.visualSmooth * deltaTime);
            const newX = current.x + dx * t;
            const newZ = current.z + dz * t;
            this.tempPos.set(newX, current.y, newZ);
            this.node.setWorldPosition(this.tempPos);
          }

          const vx = this.agent.vel.x;
          const vz = this.agent.vel.z;
          const speedSq = vx * vx + vz * vz;
          if (speedSq < this.velThreshold * this.velThreshold) return;
          const moveDx = this.agent.pos.x - this.lastStablePos.x;
          const moveDz = this.agent.pos.z - this.lastStablePos.z;
          const moveDistSq = moveDx * moveDx + moveDz * moveDz;
          if (moveDistSq < this.moveThreshold * this.moveThreshold) return;
          this.lastStablePos.x = this.agent.pos.x;
          this.lastStablePos.z = this.agent.pos.z;
          const targetAngle = Math.atan2(vx, vz) * 180 / Math.PI;
          const currentY = this.node.eulerAngles.y;
          const newY = this.lerpAngle(currentY, targetAngle, this.rotationSpeed * deltaTime);
          this.node.setRotationFromEuler(0, newY, 0);
        }

        lerpAngle(a, b, t) {
          let diff = (b - a) % 360;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          return a + diff * t;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "radius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "attackRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "rotationSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "moveThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "velThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "visualThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.01;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "visualSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 16;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "onForward", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "forwardDir", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(0, 0, 1);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3125f7db19fcc1ddaa7826bf2b62ba84e3995d89.js.map