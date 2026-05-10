System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Tween, Vec3, GameManager, _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, Unit;

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
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6e964qkrR5F2YvWvH5N+eXO", "Unit", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Tween', 'Vec3']);

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

          // ===== anti jitter =====
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

          ;
          this.sim = sim;
          var p = this.node.worldPosition;
          this.agent = sim.addAgent(p.x, p.z);
          this.agent.maxSpeed = this.moveSpeed;
          this.agent.radius = this.radius;
          this.updateOffset = Math.floor(Math.random() * 1000);
          this.lastStablePos.x = p.x;
          this.lastStablePos.z = p.z;
        }

        setEnemy(e) {
          this.enemy = e;
          this.onBusy = false;
          this.agent.locked = false;
        }

        update() {
          if (this.gm == null) {
            this.gm = this.node.scene.getComponentInChildren(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager);
          }

          if (!this.gm || !this.agent) return; // ===== CHEAP EARLY OUT =====

          var vx = this.agent.vel.x;
          var vz = this.agent.vel.z;
          var speedSq = vx * vx + vz * vz;

          if ((this.gm.frame + this.updateOffset) % this.gm.updateInterval !== 0) {
            // nếu gần như đứng yên thì bỏ luôn sync
            if (speedSq < this.velThreshold * this.velThreshold) {
              return;
            }

            this.sync();
            return;
          }

          if (this.onBusy) {
            this.sim.setPrefVelocity(this.agent, 0, 0);
            this.agent.vel.x = 0;
            this.agent.vel.z = 0;
            return;
          }

          if (this.enemy && this.enemy.agent) {
            var dx = this.enemy.agent.pos.x - this.agent.pos.x;
            var dz = this.enemy.agent.pos.z - this.agent.pos.z;
            var distSq = dx * dx + dz * dz;
            var attackRangeSq = this.attackRange * this.attackRange;

            if (distSq <= attackRangeSq) {
              if (!this.onBusy) {
                this.onBusy = true;
                this.lookAtEnemy();
                console.log("engage");
              }

              if (this.enemy.enemy != this) {
                this.enemy.enemy = this;
              }

              this.agent.locked = true;
              this.sim.setPrefVelocity(this.agent, 0, 0);
              this.agent.vel.x = 0;
              this.agent.vel.z = 0;
              return;
            }

            var dist = Math.sqrt(distSq);

            if (dist > 0.0001) {
              this.sim.setPrefVelocity(this.agent, dx / dist * this.agent.maxSpeed, dz / dist * this.agent.maxSpeed);
            }
          }

          this.sync();
        }

        lookAtEnemy() {
          if (!this.enemy || !this.enemy.node.activeInHierarchy) return;
          var dx = this.enemy.node.worldPosition.x - this.node.worldPosition.x;
          var dz = this.enemy.node.worldPosition.z - this.node.worldPosition.z;
          var targetY = Math.atan2(dx, dz) * 180 / Math.PI;
          var currentY = this.node.eulerAngles.y;
          var diff = (targetY - currentY) % 360;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360; // ===== already looking =====

          if (Math.abs(diff) < 3) {
            return;
          }

          targetY = currentY + diff;
          this.tween.target(this.node).stop().to(0.12, {
            eulerAngles: new Vec3(0, targetY, 0)
          }).start();
        }

        sync() {
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
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "enemy", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b79af6dd10def61c9eb6716f874dd89431146589.js.map