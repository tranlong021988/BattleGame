System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, Vec3, EnemyFinder, RVOSimulator, ObstacleCircle, ObstacleRect, UnitSpawner, UnitBehavior, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemyFinder(extras) {
    _reporterNs.report("EnemyFinder", "./EnemyFinder", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOSimulator(extras) {
    _reporterNs.report("RVOSimulator", "./rvo/RVO", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObstacleCircle(extras) {
    _reporterNs.report("ObstacleCircle", "./ObstacleCircle", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObstacleRect(extras) {
    _reporterNs.report("ObstacleRect", "./ObstacleRect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitSpawner(extras) {
    _reporterNs.report("UnitSpawner", "./UnitSpawner", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitBehavior(extras) {
    _reporterNs.report("UnitBehavior", "./UnitBehavior", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      EnemyFinder = _unresolved_2.EnemyFinder;
    }, function (_unresolved_3) {
      RVOSimulator = _unresolved_3.RVOSimulator;
    }, function (_unresolved_4) {
      ObstacleCircle = _unresolved_4.ObstacleCircle;
    }, function (_unresolved_5) {
      ObstacleRect = _unresolved_5.ObstacleRect;
    }, function (_unresolved_6) {
      UnitSpawner = _unresolved_6.UnitSpawner;
    }, function (_unresolved_7) {
      UnitBehavior = _unresolved_7.UnitBehavior;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1e335OSdGRGLrD08aYssvKr", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Prefab', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec4 = property({
        type: [_crd && ObstacleCircle === void 0 ? (_reportPossibleCrUseOfObstacleCircle({
          error: Error()
        }), ObstacleCircle) : ObstacleCircle]
      }), _dec5 = property({
        type: [_crd && ObstacleRect === void 0 ? (_reportPossibleCrUseOfObstacleRect({
          error: Error()
        }), ObstacleRect) : ObstacleRect]
      }), _dec(_class = (_class2 = class GameManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "prefabA", _descriptor, this);

          _initializerDefineProperty(this, "prefabB", _descriptor2, this);

          _initializerDefineProperty(this, "battleMinX", _descriptor3, this);

          _initializerDefineProperty(this, "battleMaxX", _descriptor4, this);

          _initializerDefineProperty(this, "battleMinZ", _descriptor5, this);

          _initializerDefineProperty(this, "battleMaxZ", _descriptor6, this);

          _initializerDefineProperty(this, "count", _descriptor7, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor8, this);

          this.frame = 0;

          _initializerDefineProperty(this, "circleObstacles", _descriptor9, this);

          _initializerDefineProperty(this, "rectObstacles", _descriptor10, this);

          this.sim = new (_crd && RVOSimulator === void 0 ? (_reportPossibleCrUseOfRVOSimulator({
            error: Error()
          }), RVOSimulator) : RVOSimulator)();
          this.teamA = [];
          this.teamB = [];
          this.spawner = void 0;
        }

        start() {
          this.sim.setBattlefield(this.battleMinX, this.battleMaxX, this.battleMinZ, this.battleMaxZ); // ===== Spawner =====

          this.spawner = this.getComponent(_crd && UnitSpawner === void 0 ? (_reportPossibleCrUseOfUnitSpawner({
            error: Error()
          }), UnitSpawner) : UnitSpawner);
          this.spawner.init(this.sim); // ===== Obstacles =====

          for (var ob of this.circleObstacles) {
            var p = ob.node.worldPosition;
            this.sim.addCircleObstacle(p.x, p.z, ob.radius);
          }

          for (var _ob of this.rectObstacles) {
            var _p = _ob.node.worldPosition;
            var angle = _ob.node.eulerAngles.y * Math.PI / 180;
            this.sim.addRectObstacle(_p.x, _p.z, _ob.halfWidth, _ob.halfHeight, angle);
          } // ===== Demo spawn =====


          var spacing = 1.5;
          var width = 12;

          for (var i = 0; i < this.count; i++) {
            var row = Math.floor(i / width);
            var col = i % width;
            var pos = new Vec3((col - width / 2) * spacing, 0, -20 - row * spacing);
            this.spawnTeamA(pos);
          }

          for (var _i = 0; _i < this.count; _i++) {
            var _row = Math.floor(_i / width);

            var _col = _i % width;

            var _pos = new Vec3((_col - width / 2) * spacing, 0, 20 + _row * spacing);

            this.spawnTeamB(_pos);
          }
        }

        update() {
          this.frame++;

          if (this.frame % this.updateInterval === 0) {
            this.sim.step();
          }
        } // =====================================================
        // Runtime API
        // =====================================================


        spawnTeamA(pos) {
          var unit = this.spawner.spawnUnit(this.prefabA, pos, 0, this.node);
          this.teamA.push(unit);
          unit.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior).gameManager = this;
          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
          return unit;
        }

        spawnTeamB(pos) {
          var unit = this.spawner.spawnUnit(this.prefabB, pos, 1, this.node);
          this.teamB.push(unit);
          unit.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior).gameManager = this;
          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
          return unit;
        }

        despawnUnit(unit) {
          if (!unit) return;
          var idxA = this.teamA.indexOf(unit);

          if (idxA >= 0) {
            this.teamA.splice(idxA, 1);
            this.spawner.despawnUnit(unit, this.prefabA);
            (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
              error: Error()
            }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
            return;
          }

          var idxB = this.teamB.indexOf(unit);

          if (idxB >= 0) {
            this.teamB.splice(idxB, 1);
            this.spawner.despawnUnit(unit, this.prefabB);
            (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
              error: Error()
            }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
            return;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "prefabA", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "prefabB", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "battleMinX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -28;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 28;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "battleMinZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -18;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 18;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "count", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "circleObstacles", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "rectObstacles", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2a3d48594ca107bb253a09fa8016eb25bbe98eb1.js.map