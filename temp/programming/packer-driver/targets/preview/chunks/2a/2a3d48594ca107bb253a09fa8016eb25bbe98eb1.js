System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, Vec3, Label, EnemyFinder, RVOSimulator, ObstacleCircle, ObstacleRect, UnitSpawner, UnitBehavior, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class4, _class5, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _crd, ccclass, property, UnitPrefabEntry, GameManager;

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
      Label = _cc.Label;
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

      __checkObsolete__(['_decorator', 'Component', 'Prefab', 'Vec3', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitPrefabEntry", UnitPrefabEntry = (_dec = ccclass('UnitPrefabEntry'), _dec2 = property(Prefab), _dec(_class = (_class2 = class UnitPrefabEntry {
        constructor() {
          _initializerDefineProperty(this, "name", _descriptor, this);

          _initializerDefineProperty(this, "prefab", _descriptor2, this);

          _initializerDefineProperty(this, "unitCount", _descriptor3, this);

          _initializerDefineProperty(this, "prewarmCount", _descriptor4, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor5, this);

          _initializerDefineProperty(this, "health", _descriptor6, this);

          _initializerDefineProperty(this, "damage", _descriptor7, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "name", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "unitCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "prewarmCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      })), _class2)) || _class));

      _export("GameManager", GameManager = (_dec3 = ccclass('GameManager'), _dec4 = property({
        type: [UnitPrefabEntry]
      }), _dec5 = property({
        type: [UnitPrefabEntry]
      }), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(Label), _dec9 = property(Label), _dec10 = property({
        type: [_crd && ObstacleCircle === void 0 ? (_reportPossibleCrUseOfObstacleCircle({
          error: Error()
        }), ObstacleCircle) : ObstacleCircle]
      }), _dec11 = property({
        type: [_crd && ObstacleRect === void 0 ? (_reportPossibleCrUseOfObstacleRect({
          error: Error()
        }), ObstacleRect) : ObstacleRect]
      }), _dec3(_class4 = (_class5 = class GameManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "teamAPrefabs", _descriptor8, this);

          _initializerDefineProperty(this, "teamBPrefabs", _descriptor9, this);

          _initializerDefineProperty(this, "battleMinX", _descriptor10, this);

          _initializerDefineProperty(this, "battleMaxX", _descriptor11, this);

          _initializerDefineProperty(this, "battleMinZ", _descriptor12, this);

          _initializerDefineProperty(this, "battleMaxZ", _descriptor13, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor14, this);

          this.frame = 0;

          _initializerDefineProperty(this, "teamAAliveLabel", _descriptor15, this);

          _initializerDefineProperty(this, "teamADeathLabel", _descriptor16, this);

          _initializerDefineProperty(this, "teamBAliveLabel", _descriptor17, this);

          _initializerDefineProperty(this, "teamBDeathLabel", _descriptor18, this);

          this.aliveCount = [0, 0];
          this.deathCount = [0, 0];

          _initializerDefineProperty(this, "enableAutoSpawn", _descriptor19, this);

          _initializerDefineProperty(this, "spawnImmediatelyOnStart", _descriptor20, this);

          _initializerDefineProperty(this, "prewarmOnStart", _descriptor21, this);

          _initializerDefineProperty(this, "spawnWaveInterval", _descriptor22, this);

          _initializerDefineProperty(this, "teamASpawnZ", _descriptor23, this);

          _initializerDefineProperty(this, "teamBSpawnZ", _descriptor24, this);

          _initializerDefineProperty(this, "maxUnitPerRow", _descriptor25, this);

          _initializerDefineProperty(this, "spaceBetweenUnit", _descriptor26, this);

          _initializerDefineProperty(this, "spaceBetweenRow", _descriptor27, this);

          _initializerDefineProperty(this, "spaceBetweenUnitTypes", _descriptor28, this);

          _initializerDefineProperty(this, "formationZNoise", _descriptor29, this);

          this.spawnWaveTimer = 0;

          _initializerDefineProperty(this, "circleObstacles", _descriptor30, this);

          _initializerDefineProperty(this, "rectObstacles", _descriptor31, this);

          this.sim = new (_crd && RVOSimulator === void 0 ? (_reportPossibleCrUseOfRVOSimulator({
            error: Error()
          }), RVOSimulator) : RVOSimulator)();
          this.teamA = [];
          this.teamB = [];
          this.spawner = void 0;
          this.teamAPrefabMap = new Map();
          this.teamBPrefabMap = new Map();
        }

        start() {
          this.teamA.length = 0;
          this.teamB.length = 0;
          this.aliveCount[0] = 0;
          this.aliveCount[1] = 0;
          this.deathCount[0] = 0;
          this.deathCount[1] = 0;
          this.spawnWaveTimer = 0;
          this.buildPrefabMaps();
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

          if (this.prewarmOnStart) {
            this.prewarmAllUnits();
          }

          for (var ob of this.circleObstacles) {
            var p = ob.node.worldPosition;
            this.sim.addCircleObstacle(p.x, p.z, ob.radius);
          }

          for (var _ob of this.rectObstacles) {
            var _p = _ob.node.worldPosition;
            var angle = _ob.node.eulerAngles.y * Math.PI / 180;
            this.sim.addRectObstacle(_p.x, _p.z, _ob.halfWidth, _ob.halfHeight, angle);
          }

          if (this.spawnImmediatelyOnStart) {
            this.spawnAutoWave();
          }

          this.refreshBattleStatsUI();
        }

        update(deltaTime) {
          this.frame++;

          if (this.frame % this.updateInterval === 0) {
            this.sim.step();
          }

          if (this.enableAutoSpawn) {
            this.updateAutoSpawn(deltaTime);
          }
        }

        buildPrefabMaps() {
          this.teamAPrefabMap.clear();
          this.teamBPrefabMap.clear();

          for (var entry of this.teamAPrefabs) {
            if (!this.isValidEntry(entry)) continue;
            this.teamAPrefabMap.set(entry.name, entry);
          }

          for (var _entry of this.teamBPrefabs) {
            if (!this.isValidEntry(_entry)) continue;
            this.teamBPrefabMap.set(_entry.name, _entry);
          }
        }

        prewarmAllUnits() {
          for (var entry of this.teamAPrefabs) {
            if (!this.isValidEntry(entry)) continue;
            this.spawner.prewarm(entry.prefab, entry.prewarmCount, this.node);
          }

          for (var _entry2 of this.teamBPrefabs) {
            if (!this.isValidEntry(_entry2)) continue;
            this.spawner.prewarm(_entry2.prefab, _entry2.prewarmCount, this.node);
          }
        }

        isValidEntry(entry) {
          if (!entry) return false;
          if (!entry.name) return false;
          if (!entry.prefab) return false;
          return true;
        }

        getTeamEntry(team, unitName) {
          var map = team === 0 ? this.teamAPrefabMap : this.teamBPrefabMap;
          var entry = map.get(unitName);

          if (!entry || !entry.prefab) {
            console.warn("[GameManager] Missing unit entry. team=" + team + ", unitName=" + unitName);
            return null;
          }

          return entry;
        }

        refreshBattleStatsUI() {
          if (this.teamAAliveLabel) {
            this.teamAAliveLabel.string = "A Alive: " + this.aliveCount[0];
          }

          if (this.teamADeathLabel) {
            this.teamADeathLabel.string = "A Death: " + this.deathCount[0];
          }

          if (this.teamBAliveLabel) {
            this.teamBAliveLabel.string = "B Alive: " + this.aliveCount[1];
          }

          if (this.teamBDeathLabel) {
            this.teamBDeathLabel.string = "B Death: " + this.deathCount[1];
          }
        }

        updateAutoSpawn(deltaTime) {
          this.spawnWaveTimer += deltaTime;

          if (this.spawnWaveTimer < this.spawnWaveInterval) {
            return;
          }

          this.spawnWaveTimer = 0;
          this.spawnAutoWave();
        }

        spawnAutoWave() {
          this.spawnFormationForTeam(0, this.teamAPrefabs, this.teamASpawnZ);
          this.spawnFormationForTeam(1, this.teamBPrefabs, this.teamBSpawnZ);
        }

        spawnFormationForTeam(team, entries, baseZ) {
          var currentRowOffset = 0;

          for (var entry of entries) {
            if (!this.isValidEntry(entry)) continue;
            var count = Math.max(0, Math.floor(entry.unitCount));
            if (count <= 0) continue;
            var rowsUsedDistance = this.spawnEntryFormation(team, entry, baseZ, currentRowOffset);
            currentRowOffset += rowsUsedDistance + this.spaceBetweenUnitTypes;
          }
        }

        spawnEntryFormation(team, entry, baseZ, startRowOffset) {
          var count = Math.max(0, Math.floor(entry.unitCount));
          var maxPerRow = Math.max(1, Math.floor(this.maxUnitPerRow));
          var spawned = 0;
          var row = 0;

          while (spawned < count) {
            var remaining = count - spawned;
            var rowCount = Math.min(maxPerRow, remaining);

            for (var col = 0; col < rowCount; col++) {
              var x = (col - (rowCount - 1) * 0.5) * this.spaceBetweenUnit;
              var rowZOffset = startRowOffset + row * this.spaceBetweenRow;
              var baseUnitZ = team === 0 ? baseZ - rowZOffset : baseZ + rowZOffset;
              var z = baseUnitZ + this.randomRange(-this.formationZNoise, this.formationZNoise);
              var pos = new Vec3(x, 0, z);

              if (team === 0) {
                this.spawnTeamA(entry.name, pos);
              } else {
                this.spawnTeamB(entry.name, pos);
              }

              spawned++;
            }

            row++;
          }

          return row * this.spaceBetweenRow;
        }

        spawnTeamA(unitName, pos) {
          var entry = this.getTeamEntry(0, unitName);
          if (!entry || !entry.prefab) return null;
          var unit = this.spawner.spawnUnit(entry.prefab, entry.name, pos, 0, this.node, entry.maxSpeed, entry.health, entry.damage);

          if (this.teamA.indexOf(unit) < 0) {
            this.teamA.push(unit);
            this.aliveCount[0]++;
          }

          var behavior = unit.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior);

          if (behavior) {
            behavior.gameManager = this;
          }

          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
          this.refreshBattleStatsUI();
          return unit;
        }

        spawnTeamB(unitName, pos) {
          var entry = this.getTeamEntry(1, unitName);
          if (!entry || !entry.prefab) return null;
          var unit = this.spawner.spawnUnit(entry.prefab, entry.name, pos, 1, this.node, entry.maxSpeed, entry.health, entry.damage);

          if (this.teamB.indexOf(unit) < 0) {
            this.teamB.push(unit);
            this.aliveCount[1]++;
          }

          var behavior = unit.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior);

          if (behavior) {
            behavior.gameManager = this;
          }

          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
          this.refreshBattleStatsUI();
          return unit;
        }

        despawnUnit(unit) {
          if (!unit) return;
          var team = unit.team;
          var unitName = unit.unitTypeName;
          var entry = this.getTeamEntry(team, unitName);

          if (!entry || !entry.prefab) {
            console.warn("[GameManager] Cannot despawn. Missing prefab. team=" + team + ", unitName=" + unitName);
            return;
          }

          if (team === 0) {
            var idx = this.teamA.indexOf(unit);

            if (idx >= 0) {
              this.teamA.splice(idx, 1);
              this.aliveCount[0]--;
              this.deathCount[0]++;

              if (this.aliveCount[0] < 0) {
                this.aliveCount[0] = 0;
              }

              (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
                error: Error()
              }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
              this.spawner.despawnUnit(unit, entry.prefab);
              this.refreshBattleStatsUI();
            }

            return;
          }

          if (team === 1) {
            var _idx = this.teamB.indexOf(unit);

            if (_idx >= 0) {
              this.teamB.splice(_idx, 1);
              this.aliveCount[1]--;
              this.deathCount[1]++;

              if (this.aliveCount[1] < 0) {
                this.aliveCount[1] = 0;
              }

              (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
                error: Error()
              }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
              this.spawner.despawnUnit(unit, entry.prefab);
              this.refreshBattleStatsUI();
            }

            return;
          }
        }

        randomRange(min, max) {
          return Math.random() * (max - min) + min;
        }

      }, (_descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "teamAPrefabs", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "teamBPrefabs", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "battleMinX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -28;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "battleMaxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 28;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "battleMinZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -18;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "battleMaxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 18;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "teamAAliveLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "teamADeathLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "teamBAliveLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "teamBDeathLabel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "enableAutoSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "spawnImmediatelyOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "prewarmOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "spawnWaveInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "teamASpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -20;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "teamBSpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "maxUnitPerRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "spaceBetweenUnit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class5.prototype, "spaceBetweenRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class5.prototype, "spaceBetweenUnitTypes", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.5;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class5.prototype, "formationZNoise", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class5.prototype, "circleObstacles", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class5.prototype, "rectObstacles", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2a3d48594ca107bb253a09fa8016eb25bbe98eb1.js.map