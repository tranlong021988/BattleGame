System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, EnemyFinder, UnitProps, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, Unit;

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
    }, function (_unresolved_2) {
      EnemyFinder = _unresolved_2.EnemyFinder;
    }, function (_unresolved_3) {
      UnitProps = _unresolved_3.UnitProps;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6e964qkrR5F2YvWvH5N+eXO", "Unit", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Unit", Unit = (_dec = ccclass('Unit'), _dec(_class = (_class2 = class Unit extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "moveSpeed", _descriptor, this);

          _initializerDefineProperty(this, "radius", _descriptor2, this);

          _initializerDefineProperty(this, "attackRange", _descriptor3, this);

          _initializerDefineProperty(this, "rotationSpeed", _descriptor4, this);

          _initializerDefineProperty(this, "moveThreshold", _descriptor5, this);

          _initializerDefineProperty(this, "velThreshold", _descriptor6, this);

          _initializerDefineProperty(this, "visualThreshold", _descriptor7, this);

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
        }

        onLoad() {
          this.props = this.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);
          this.finder = this.getComponent(_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder);
        }

        init(sim) {
          this.sim = sim;
          var p = this.node.worldPosition;
          this.agent = sim.addAgent(p.x, p.z);
          this.agent.maxSpeed = this.moveSpeed;
          this.agent.radius = this.radius;
          this.agent.locked = false;
          this.enemy = null;
          this.onBusy = false;
          this.updateOffset = Math.floor(Math.random() * 1000);
          this.lastStablePos.x = p.x;
          this.lastStablePos.z = p.z;
        }

        resetForDespawn() {
          this.enemy = null;
          this.onBusy = false;

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

        update() {
          if (!this.sim || !this.agent) return; // ===== ENGAGED =====

          if (this.onBusy) {
            if (!this.enemy || !this.enemy.node.activeInHierarchy || !this.enemy.agent || !this.enemy.props || this.enemy.props.isDead()) {
              this.clearEnemy();
            } else {
              this.lookAtEnemyInstant();
              this.sim.setPrefVelocity(this.agent, 0, 0);
              this.agent.vel.x = 0;
              this.agent.vel.z = 0;
              return;
            }
          } // Clear invalid target


          if (!this.enemy || !this.enemy.node.activeInHierarchy || !this.enemy.agent || !this.enemy.props || this.enemy.props.isDead()) {
            this.enemy = null;
          } // ===== ENGAGE NEAREST ENEMY INSIDE ATTACK RANGE =====


          var attackRangeSq = this.attackRange * this.attackRange;
          var enemies = this.getEnemyList();
          var nearestInRange = null;
          var nearestDistSq = Infinity;

          for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!e || e === this) continue;
            if (!e.node.activeInHierarchy) continue;
            if (!e.agent) continue;
            if (!e.props || e.props.isDead()) continue;
            var dx = e.agent.pos.x - this.agent.pos.x;
            var dz = e.agent.pos.z - this.agent.pos.z;
            var d = dx * dx + dz * dz;

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
          } // ===== CHASE CURRENT TARGET =====


          if (this.enemy && this.enemy.agent) {
            var _dx = this.enemy.agent.pos.x - this.agent.pos.x;

            var _dz = this.enemy.agent.pos.z - this.agent.pos.z;

            var distSq = _dx * _dx + _dz * _dz;
            var dist = Math.sqrt(distSq);

            if (dist > 0.0001) {
              this.sim.setPrefVelocity(this.agent, _dx / dist * this.agent.maxSpeed, _dz / dist * this.agent.maxSpeed);
            }
          } else {
            this.sim.setPrefVelocity(this.agent, 0, 0);
          }

          this.sync();
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
          var dx = this.enemy.agent.pos.x - this.agent.pos.x;
          var dz = this.enemy.agent.pos.z - this.agent.pos.z;

          if (dx * dx + dz * dz < 0.0001) {
            return;
          }

          var targetY = Math.atan2(dx, dz) * 180 / Math.PI;
          this.node.setRotationFromEuler(0, targetY, 0);
        }

        sync() {
          if (!this.agent) return;
          var current = this.node.worldPosition;
          var pdx = this.agent.pos.x - current.x;
          var pdz = this.agent.pos.z - current.z;
          var posDistSq = pdx * pdx + pdz * pdz;

          if (posDistSq >= this.visualThreshold * this.visualThreshold) {
            this.node.setWorldPosition(this.agent.pos.x, current.y, this.agent.pos.z);
          }

          var vx = this.agent.vel.x;
          var vz = this.agent.vel.z;
          var speedSq = vx * vx + vz * vz;
          if (speedSq < this.velThreshold * this.velThreshold) return;
          var dx = this.agent.pos.x - this.lastStablePos.x;
          var dz = this.agent.pos.z - this.lastStablePos.z;
          var distSq = dx * dx + dz * dz;
          if (distSq < this.moveThreshold * this.moveThreshold) return;
          this.lastStablePos.x = this.agent.pos.x;
          this.lastStablePos.z = this.agent.pos.z;
          var targetAngle = Math.atan2(vx, vz) * 180 / Math.PI;
          var currentY = this.node.eulerAngles.y;
          var newY = this.lerpAngle(currentY, targetAngle, this.rotationSpeed * 0.016);
          this.node.setRotationFromEuler(0, newY, 0);
        }

        lerpAngle(a, b, t) {
          var diff = (b - a) % 360;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          return a + diff * t;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "radius", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "attackRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "rotationSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "moveThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "velThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.05;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "visualThreshold", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.03;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3125f7db19fcc1ddaa7826bf2b62ba84e3995d89.js.map