System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Tween, GameManager, EnemyFinder, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, Unit;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfRVOSimulator(extras) {
    _reporterNs.report("RVOSimulator", "./rvo/RVO", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOAgent(extras) {
    _reporterNs.report("RVOAgent", "./rvo/RVO", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemyFinder(extras) {
    _reporterNs.report("EnemyFinder", "./EnemyFinder", _context.meta, extras);
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
      Tween = _cc.Tween;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      EnemyFinder = _unresolved_3.EnemyFinder;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6e964qkrR5F2YvWvH5N+eXO", "Unit", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Unit", Unit = (_dec = ccclass('Unit'), _dec(_class = (_class2 = class Unit extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "moveSpeed", _descriptor, this);

          _initializerDefineProperty(this, "radius", _descriptor2, this);

          _initializerDefineProperty(this, "attackRange", _descriptor3, this);

          _initializerDefineProperty(this, "rotationSpeed", _descriptor4, this);

          _initializerDefineProperty(this, "moveThreshold", _descriptor5, this);

          _initializerDefineProperty(this, "velThreshold", _descriptor6, this);

          _initializerDefineProperty(this, "visualThreshold", _descriptor7, this);

          this.sim = void 0;
          this.agent = void 0;

          _initializerDefineProperty(this, "enemy", _descriptor8, this);

          this.onBusy = false;
          this.updateOffset = 0;
          this.lastStablePos = {
            x: 0,
            z: 0
          };
          this.gm = void 0;
          this.tween = void 0;
        }

        init(sim) {
          if (!this.tween) {
            this.tween = new Tween();
          }

          this.sim = sim;
          const p = this.node.worldPosition;
          this.agent = sim.addAgent(p.x, p.z);
          this.agent.maxSpeed = this.moveSpeed;
          this.agent.radius = this.radius;
          this.updateOffset = Math.floor(Math.random() * 1000);
          this.lastStablePos.x = p.x;
          this.lastStablePos.z = p.z;
        }

        setEnemy(e) {
          // Đang engage rồi thì EnemyFinder không được đổi target nữa
          if (this.onBusy) {
            return;
          }

          this.enemy = e;

          if (this.enemy && this.enemy.agent) {
            this.lookAtEnemyInstant();
          }
        }

        update() {
          if (this.gm == null) {
            this.gm = this.node.scene.getComponentInChildren(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager);
          }

          if (!this.gm || !this.agent) return; // ==========================================================
          // 0. ENGAGED
          // ==========================================================

          if (this.onBusy) {
            if (!this.enemy || !this.enemy.node.activeInHierarchy || !this.enemy.agent) {
              this.onBusy = false;
              this.agent.locked = false;
              this.enemy = null;
            } else {
              this.lookAtEnemyInstant();
              this.sim.setPrefVelocity(this.agent, 0, 0);
              this.agent.vel.x = 0;
              this.agent.vel.z = 0;
              return;
            }
          }

          const vx = this.agent.vel.x;
          const vz = this.agent.vel.z;
          const speedSq = vx * vx + vz * vz;

          if ((this.gm.frame + this.updateOffset) % this.gm.updateInterval !== 0) {
            if (speedSq < this.velThreshold * this.velThreshold) {
              return;
            }

            this.sync();
            return;
          } // clear invalid target


          if (!this.enemy || !this.enemy.node.activeInHierarchy || !this.enemy.agent) {
            this.enemy = null;
          } // ==========================================================
          // 1. ENGAGE NEAREST ENEMY INSIDE ATTACK RANGE
          // ==========================================================


          const attackRangeSq = this.attackRange * this.attackRange;
          const enemies = this.getEnemyList();
          let nearestInRange = null;
          let nearestDistSq = Infinity;

          for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (!e || e === this) continue;
            if (!e.node.activeInHierarchy) continue;
            if (!e.agent) continue;
            const dx = e.agent.pos.x - this.agent.pos.x;
            const dz = e.agent.pos.z - this.agent.pos.z;
            const d = dx * dx + dz * dz;

            if (d <= attackRangeSq && d < nearestDistSq) {
              nearestDistSq = d;
              nearestInRange = e;
            }
          }

          if (nearestInRange) {
            this.enemy = nearestInRange;
            this.onBusy = true;
            this.agent.locked = true;
            this.lookAtEnemyInstant();
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            return;
          } // ==========================================================
          // 2. CHASE CURRENT TARGET
          // ==========================================================


          if (this.enemy && this.enemy.agent) {
            const dx = this.enemy.agent.pos.x - this.agent.pos.x;
            const dz = this.enemy.agent.pos.z - this.agent.pos.z;
            const distSq = dx * dx + dz * dz;
            const dist = Math.sqrt(distSq);

            if (dist > 0.0001) {
              this.sim.setPrefVelocity(this.agent, dx / dist * this.agent.maxSpeed, dz / dist * this.agent.maxSpeed);
            }
          }

          this.sync();
        }

        getEnemyList() {
          const finder = this.getComponent(_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder);
          return finder['team'] === 0 ? (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamB : (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamA;
        }

        lookAtEnemyInstant() {
          if (!this.enemy || !this.enemy.node.activeInHierarchy || !this.enemy.agent) {
            return;
          }

          const dx = this.enemy.agent.pos.x - this.agent.pos.x;
          const dz = this.enemy.agent.pos.z - this.agent.pos.z;

          if (dx * dx + dz * dz < 0.0001) {
            return;
          }

          const targetY = Math.atan2(dx, dz) * 180 / Math.PI;
          this.node.setRotationFromEuler(0, targetY, 0);
        }

        sync() {
          const current = this.node.worldPosition;
          const pdx = this.agent.pos.x - current.x;
          const pdz = this.agent.pos.z - current.z;
          const posDistSq = pdx * pdx + pdz * pdz;

          if (posDistSq >= this.visualThreshold * this.visualThreshold) {
            this.node.setWorldPosition(this.agent.pos.x, current.y, this.agent.pos.z);
          }

          const vx = this.agent.vel.x;
          const vz = this.agent.vel.z;
          const speedSq = vx * vx + vz * vz;
          if (speedSq < this.velThreshold * this.velThreshold) return;
          const dx = this.agent.pos.x - this.lastStablePos.x;
          const dz = this.agent.pos.z - this.lastStablePos.z;
          const distSq = dx * dx + dz * dz;
          if (distSq < this.moveThreshold * this.moveThreshold) return;
          this.lastStablePos.x = this.agent.pos.x;
          this.lastStablePos.z = this.agent.pos.z;
          const targetAngle = Math.atan2(vx, vz) * 180 / Math.PI;
          const currentY = this.node.eulerAngles.y;
          const newY = this.lerpAngle(currentY, targetAngle, this.rotationSpeed * 0.016);
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
          return 0.03;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "enemy", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3125f7db19fcc1ddaa7826bf2b62ba84e3995d89.js.map