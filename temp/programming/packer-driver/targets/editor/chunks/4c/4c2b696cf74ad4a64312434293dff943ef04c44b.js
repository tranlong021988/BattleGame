System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, Vec3, EnemyFinder, RVOSimulator, ObstacleCircle, ObstacleRect, UnitSpawner, UnitBehavior, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _crd, ccclass, property, GameManager;

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
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "prefabA", _descriptor, this);

          _initializerDefineProperty(this, "prefabB", _descriptor2, this);

          _initializerDefineProperty(this, "battleMinX", _descriptor3, this);

          _initializerDefineProperty(this, "battleMaxX", _descriptor4, this);

          _initializerDefineProperty(this, "battleMinZ", _descriptor5, this);

          _initializerDefineProperty(this, "battleMaxZ", _descriptor6, this);

          _initializerDefineProperty(this, "count", _descriptor7, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor8, this);

          this.frame = 0;

          // ===== Auto spawn wave test =====
          _initializerDefineProperty(this, "enableAutoSpawn", _descriptor9, this);

          _initializerDefineProperty(this, "spawnWaveInterval", _descriptor10, this);

          _initializerDefineProperty(this, "minNumUnit", _descriptor11, this);

          _initializerDefineProperty(this, "maxNumUnit", _descriptor12, this);

          _initializerDefineProperty(this, "teamASpawnZ", _descriptor13, this);

          _initializerDefineProperty(this, "teamBSpawnZ", _descriptor14, this);

          _initializerDefineProperty(this, "spawnAreaWidth", _descriptor15, this);

          this.spawnWaveTimer = 0;

          _initializerDefineProperty(this, "circleObstacles", _descriptor16, this);

          _initializerDefineProperty(this, "rectObstacles", _descriptor17, this);

          this.sim = new (_crd && RVOSimulator === void 0 ? (_reportPossibleCrUseOfRVOSimulator({
            error: Error()
          }), RVOSimulator) : RVOSimulator)();
          this.teamA = [];
          this.teamB = [];
          this.spawner = void 0;
        }

        start() {
          this.teamA.length = 0;
          this.teamB.length = 0;
          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
          this.sim.setBattlefield(this.battleMinX, this.battleMaxX, this.battleMinZ, this.battleMaxZ);
          this.spawner = this.getComponent(_crd && UnitSpawner === void 0 ? (_reportPossibleCrUseOfUnitSpawner({
            error: Error()
          }), UnitSpawner) : UnitSpawner);
          this.spawner.init(this.sim);

          for (const ob of this.circleObstacles) {
            const p = ob.node.worldPosition;
            this.sim.addCircleObstacle(p.x, p.z, ob.radius);
          }

          for (const ob of this.rectObstacles) {
            const p = ob.node.worldPosition;
            const angle = ob.node.eulerAngles.y * Math.PI / 180;
            this.sim.addRectObstacle(p.x, p.z, ob.halfWidth, ob.halfHeight, angle);
          } // Spawn test ban đầu, giữ nguyên logic cũ
          //this.spawnTest1();

        }

        update(deltaTime) {
          this.frame++;

          if (this.frame % this.updateInterval === 0) {
            this.sim.step();
          }

          if (this.enableAutoSpawn) {
            this.updateAutoSpawn(deltaTime);
          }
        } // =====================================================
        // Test spawn ban đầu
        // =====================================================


        spawnTest1() {
          const spacing = 1.5;
          const width = 12;

          for (let i = 0; i < this.count; i++) {
            const row = Math.floor(i / width);
            const col = i % width;
            const pos = new Vec3((col - width / 2) * spacing, 0, -20 - row * spacing);
            this.spawnTeamA(pos);
          }

          for (let i = 0; i < this.count; i++) {
            const row = Math.floor(i / width);
            const col = i % width;
            const pos = new Vec3((col - width / 2) * spacing, 0, 20 + row * spacing);
            this.spawnTeamB(pos);
          }
        } // =====================================================
        // Auto spawn wave
        // =====================================================


        updateAutoSpawn(deltaTime) {
          this.spawnWaveTimer += deltaTime;

          if (this.spawnWaveTimer < this.spawnWaveInterval) {
            return;
          }

          this.spawnWaveTimer = 0;
          this.spawnRandomWaveBothTeams();
        }

        spawnRandomWaveBothTeams() {
          const countA = this.randomInt(this.minNumUnit, this.maxNumUnit);
          const countB = this.randomInt(this.minNumUnit, this.maxNumUnit);
          this.spawnRandomUnitsForTeam(0, countA);
          this.spawnRandomUnitsForTeam(1, countB);
        }

        spawnRandomUnitsForTeam(team, count) {
          for (let i = 0; i < count; i++) {
            const x = this.randomRange(-this.spawnAreaWidth * 0.5, this.spawnAreaWidth * 0.5);
            const zJitter = this.randomRange(-1.5, 1.5);

            if (team === 0) {
              this.spawnTeamA(new Vec3(x, 0, this.teamASpawnZ + zJitter));
            } else {
              this.spawnTeamB(new Vec3(x, 0, this.teamBSpawnZ + zJitter));
            }
          }
        }

        randomInt(min, max) {
          min = Math.floor(min);
          max = Math.floor(max);

          if (max < min) {
            const t = min;
            min = max;
            max = t;
          }

          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        randomRange(min, max) {
          return Math.random() * (max - min) + min;
        } // =====================================================
        // Runtime API
        // =====================================================


        spawnTeamA(pos) {
          const unit = this.spawner.spawnUnit(this.prefabA, pos, 0, this.node);

          if (this.teamA.indexOf(unit) < 0) {
            this.teamA.push(unit);
          }

          const behavior = unit.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior);

          if (behavior) {
            behavior.gameManager = this;
          }

          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
          return unit;
        }

        spawnTeamB(pos) {
          const unit = this.spawner.spawnUnit(this.prefabB, pos, 1, this.node);

          if (this.teamB.indexOf(unit) < 0) {
            this.teamB.push(unit);
          }

          const behavior = unit.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior);

          if (behavior) {
            behavior.gameManager = this;
          }

          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
          return unit;
        }

        despawnUnit(unit) {
          if (!unit) return;
          const idxA = this.teamA.indexOf(unit);

          if (idxA >= 0) {
            this.teamA.splice(idxA, 1);
            (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
              error: Error()
            }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
            this.spawner.despawnUnit(unit, this.prefabA);
            return;
          }

          const idxB = this.teamB.indexOf(unit);

          if (idxB >= 0) {
            this.teamB.splice(idxB, 1);
            (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
              error: Error()
            }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
            this.spawner.despawnUnit(unit, this.prefabB);
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
        initializer: function () {
          return -28;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 28;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "battleMinZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -18;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 18;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "count", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "spawnWaveInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "minNumUnit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "maxNumUnit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "teamASpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -20;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "teamBSpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "spawnAreaWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 18;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "circleObstacles", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "rectObstacles", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=4c2b696cf74ad4a64312434293dff943ef04c44b.js.map