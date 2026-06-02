System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, Vec3, Label, Unit, UnitProps, EnemyFinder, RVOSimulator, RVOWorkerSimulator, ObstacleCircle, ObstacleRect, UnitSpawner, UnitBehavior, BattleSpatialGrid, UnitType, BattleWave, CounterSettings, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _class4, _class5, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _class6, _crd, ccclass, property, UnitPrefabEntry, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitProps(extras) {
    _reporterNs.report("UnitProps", "./UnitProps", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemyFinder(extras) {
    _reporterNs.report("EnemyFinder", "./EnemyFinder", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOSimulator(extras) {
    _reporterNs.report("RVOSimulator", "./rvo/RVO", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOWorkerSimulator(extras) {
    _reporterNs.report("RVOWorkerSimulator", "./rvo/RVOWorkerSimulator", _context.meta, extras);
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

  function _reportPossibleCrUseOfBattleSpatialGrid(extras) {
    _reporterNs.report("BattleSpatialGrid", "./BattleSpatialGrid", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitType(extras) {
    _reporterNs.report("UnitType", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleWave(extras) {
    _reporterNs.report("BattleWave", "./BattleWave", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCounterSettings(extras) {
    _reporterNs.report("CounterSettings", "./CounterSettings", _context.meta, extras);
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
      Unit = _unresolved_2.Unit;
    }, function (_unresolved_3) {
      UnitProps = _unresolved_3.UnitProps;
    }, function (_unresolved_4) {
      EnemyFinder = _unresolved_4.EnemyFinder;
    }, function (_unresolved_5) {
      RVOSimulator = _unresolved_5.RVOSimulator;
    }, function (_unresolved_6) {
      RVOWorkerSimulator = _unresolved_6.RVOWorkerSimulator;
    }, function (_unresolved_7) {
      ObstacleCircle = _unresolved_7.ObstacleCircle;
    }, function (_unresolved_8) {
      ObstacleRect = _unresolved_8.ObstacleRect;
    }, function (_unresolved_9) {
      UnitSpawner = _unresolved_9.UnitSpawner;
    }, function (_unresolved_10) {
      UnitBehavior = _unresolved_10.UnitBehavior;
    }, function (_unresolved_11) {
      BattleSpatialGrid = _unresolved_11.BattleSpatialGrid;
    }, function (_unresolved_12) {
      UnitType = _unresolved_12.UnitType;
    }, function (_unresolved_13) {
      BattleWave = _unresolved_13.BattleWave;
    }, function (_unresolved_14) {
      CounterSettings = _unresolved_14.CounterSettings;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1e335OSdGRGLrD08aYssvKr", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Prefab', 'Vec3', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitPrefabEntry", UnitPrefabEntry = (_dec = ccclass('UnitPrefabEntry'), _dec2 = property(Prefab), _dec3 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec(_class = (_class2 = class UnitPrefabEntry {
        constructor() {
          _initializerDefineProperty(this, "name", _descriptor, this);

          _initializerDefineProperty(this, "prefab", _descriptor2, this);

          _initializerDefineProperty(this, "unitType", _descriptor3, this);

          _initializerDefineProperty(this, "unitCount", _descriptor4, this);

          _initializerDefineProperty(this, "prewarmCount", _descriptor5, this);

          _initializerDefineProperty(this, "maxSpeed", _descriptor6, this);

          _initializerDefineProperty(this, "health", _descriptor7, this);

          _initializerDefineProperty(this, "damage", _descriptor8, this);

          _initializerDefineProperty(this, "defense", _descriptor9, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "name", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "unitType", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "unitCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "prewarmCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxSpeed", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "health", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "damage", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "defense", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      })), _class2)) || _class));

      _export("GameManager", GameManager = (_dec4 = ccclass('GameManager'), _dec5 = property({
        type: [UnitPrefabEntry]
      }), _dec6 = property({
        type: [UnitPrefabEntry]
      }), _dec7 = property(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
        error: Error()
      }), Unit) : Unit), _dec8 = property(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
        error: Error()
      }), Unit) : Unit), _dec9 = property(Label), _dec10 = property(Label), _dec11 = property(Label), _dec12 = property(Label), _dec13 = property(Label), _dec14 = property(Label), _dec15 = property(Label), _dec16 = property(Label), _dec17 = property({
        type: [_crd && ObstacleCircle === void 0 ? (_reportPossibleCrUseOfObstacleCircle({
          error: Error()
        }), ObstacleCircle) : ObstacleCircle]
      }), _dec18 = property({
        type: [_crd && ObstacleRect === void 0 ? (_reportPossibleCrUseOfObstacleRect({
          error: Error()
        }), ObstacleRect) : ObstacleRect]
      }), _dec4(_class4 = (_class5 = (_class6 = class GameManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "useWorkerRVO", _descriptor10, this);

          _initializerDefineProperty(this, "teamAPrefabs", _descriptor11, this);

          _initializerDefineProperty(this, "teamBPrefabs", _descriptor12, this);

          _initializerDefineProperty(this, "teamAHero", _descriptor13, this);

          _initializerDefineProperty(this, "teamBHero", _descriptor14, this);

          _initializerDefineProperty(this, "battleMinX", _descriptor15, this);

          _initializerDefineProperty(this, "battleMaxX", _descriptor16, this);

          _initializerDefineProperty(this, "battleMinZ", _descriptor17, this);

          _initializerDefineProperty(this, "battleMaxZ", _descriptor18, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor19, this);

          this.frame = 0;

          _initializerDefineProperty(this, "visualSmooth", _descriptor20, this);

          _initializerDefineProperty(this, "spatialGridCellSize", _descriptor21, this);

          _initializerDefineProperty(this, "spatialGridUpdateInterval", _descriptor22, this);

          this.spatialGrid = new (_crd && BattleSpatialGrid === void 0 ? (_reportPossibleCrUseOfBattleSpatialGrid({
            error: Error()
          }), BattleSpatialGrid) : BattleSpatialGrid)();

          _initializerDefineProperty(this, "teamAAliveLabel", _descriptor23, this);

          _initializerDefineProperty(this, "teamADeathLabel", _descriptor24, this);

          _initializerDefineProperty(this, "teamBAliveLabel", _descriptor25, this);

          _initializerDefineProperty(this, "teamBDeathLabel", _descriptor26, this);

          _initializerDefineProperty(this, "teamAKillLabel", _descriptor27, this);

          _initializerDefineProperty(this, "teamBKillLabel", _descriptor28, this);

          _initializerDefineProperty(this, "teamACounterKillLabel", _descriptor29, this);

          _initializerDefineProperty(this, "teamBCounterKillLabel", _descriptor30, this);

          this.aliveCount = [0, 0];
          this.deathCount = [0, 0];
          this.killCount = [0, 0];
          this.counterKillCount = [0, 0];

          _initializerDefineProperty(this, "enableAutoSpawn", _descriptor31, this);

          _initializerDefineProperty(this, "spawnImmediatelyOnStart", _descriptor32, this);

          _initializerDefineProperty(this, "prewarmOnStart", _descriptor33, this);

          _initializerDefineProperty(this, "spawnWaveInterval", _descriptor34, this);

          _initializerDefineProperty(this, "maxAutoSpawnDeltaTime", _descriptor35, this);

          _initializerDefineProperty(this, "teamASpawnZ", _descriptor36, this);

          _initializerDefineProperty(this, "teamBSpawnZ", _descriptor37, this);

          _initializerDefineProperty(this, "maxUnitPerRow", _descriptor38, this);

          _initializerDefineProperty(this, "spaceBetweenUnit", _descriptor39, this);

          _initializerDefineProperty(this, "spaceBetweenRow", _descriptor40, this);

          _initializerDefineProperty(this, "formationZNoise", _descriptor41, this);

          _initializerDefineProperty(this, "centerGapWidth", _descriptor42, this);

          this.spawnWaveTimer = 0;

          _initializerDefineProperty(this, "circleObstacles", _descriptor43, this);

          _initializerDefineProperty(this, "rectObstacles", _descriptor44, this);

          this.sim = null;
          this.teamA = [];
          this.teamB = [];
          this.waves = [];
          this.nextWaveId = 1;
          this.spawner = void 0;
          this.teamAPrefabMap = new Map();
          this.teamBPrefabMap = new Map();
        }

        start() {
          GameManager.instance = this;
          this.teamA.length = 0;
          this.teamB.length = 0;
          this.waves.length = 0;
          this.nextWaveId = 1;
          this.aliveCount[0] = 0;
          this.aliveCount[1] = 0;
          this.deathCount[0] = 0;
          this.deathCount[1] = 0;
          this.killCount[0] = 0;
          this.killCount[1] = 0;
          this.counterKillCount[0] = 0;
          this.counterKillCount[1] = 0;
          this.spawnWaveTimer = 0;
          this.createSimulator();
          this.buildPrefabMaps();
          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
          this.spatialGrid.cellSize = this.spatialGridCellSize;
          this.sim.setBattlefield(this.battleMinX, this.battleMaxX, this.battleMinZ, this.battleMaxZ);
          this.spawner = this.getComponent(_crd && UnitSpawner === void 0 ? (_reportPossibleCrUseOfUnitSpawner({
            error: Error()
          }), UnitSpawner) : UnitSpawner);
          this.spawner.init(this.sim);

          if (this.prewarmOnStart) {
            this.prewarmAllUnits();
          }

          for (const ob of this.circleObstacles) {
            const p = ob.node.worldPosition;
            this.sim.addCircleObstacle(p.x, p.z, ob.radius);
          }

          for (const ob of this.rectObstacles) {
            const p = ob.node.worldPosition;
            const angle = ob.node.eulerAngles.y * Math.PI / 180;
            this.sim.addRectObstacle(p.x, p.z, ob.halfWidth, ob.halfHeight, angle);
          }

          this.registerSceneHero(this.teamAHero, 0, 'hero_a');
          this.registerSceneHero(this.teamBHero, 1, 'hero_b');

          if (this.spawnImmediatelyOnStart) {
            this.spawnAutoWave();
          }

          this.rebuildSpatialGrid();
          this.refreshBattleStatsUI();
        }

        onDestroy() {
          if (GameManager.instance === this) {
            GameManager.instance = null;
          }

          if (this.sim && this.sim.destroy) {
            this.sim.destroy();
          }
        }

        createSimulator() {
          if (this.useWorkerRVO && (_crd && RVOWorkerSimulator === void 0 ? (_reportPossibleCrUseOfRVOWorkerSimulator({
            error: Error()
          }), RVOWorkerSimulator) : RVOWorkerSimulator).isSupported()) {
            this.sim = new (_crd && RVOWorkerSimulator === void 0 ? (_reportPossibleCrUseOfRVOWorkerSimulator({
              error: Error()
            }), RVOWorkerSimulator) : RVOWorkerSimulator)();
            console.log('[GameManager] Using Worker RVO backend');
          } else {
            this.sim = new (_crd && RVOSimulator === void 0 ? (_reportPossibleCrUseOfRVOSimulator({
              error: Error()
            }), RVOSimulator) : RVOSimulator)();
            console.log('[GameManager] Using Main Thread RVO backend');
          }
        }

        update(deltaTime) {
          this.frame++;
          (_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit).visualLerpT = 1 - Math.exp(-this.visualSmooth * deltaTime);

          if (this.frame % this.updateInterval === 0) {
            this.sim.step();
          }

          if (this.frame % this.spatialGridUpdateInterval === 0) {
            this.rebuildSpatialGrid();
          }

          if (this.enableAutoSpawn) {
            this.updateAutoSpawn(deltaTime);
          }
        }

        reportKill(killer, victim) {
          if (!killer || !victim) return;
          if (!killer.props || !victim.props) return;
          const killerTeam = killer.team;

          if (killerTeam !== 0 && killerTeam !== 1) {
            return;
          }

          this.killCount[killerTeam]++;
          const counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          let isCounterKill = false;

          if (counter) {
            const damageMul = counter.getDamageMultiplier(killer.props.unitType, victim.props.unitType);
            const receivedMul = counter.getReceivedDamageMultiplier(killer.props.unitType, victim.props.unitType);
            isCounterKill = damageMul > 1.0001 || receivedMul < 0.9999;
          }

          if (isCounterKill) {
            this.counterKillCount[killerTeam]++;
          }

          this.refreshBattleStatsUI();
        }

        getCounterKillRatio(team) {
          if (team !== 0 && team !== 1) return 0;

          if (this.killCount[team] <= 0) {
            return 0;
          }

          return this.counterKillCount[team] / this.killCount[team];
        }

        rebuildSpatialGrid() {
          this.spatialGrid.cellSize = this.spatialGridCellSize;
          this.spatialGrid.build(this.teamA, this.teamB);
        }

        buildPrefabMaps() {
          this.teamAPrefabMap.clear();
          this.teamBPrefabMap.clear();

          for (const entry of this.teamAPrefabs) {
            if (!this.isValidEntry(entry)) continue;
            this.teamAPrefabMap.set(entry.name, entry);
          }

          for (const entry of this.teamBPrefabs) {
            if (!this.isValidEntry(entry)) continue;
            this.teamBPrefabMap.set(entry.name, entry);
          }
        }

        prewarmAllUnits() {
          for (const entry of this.teamAPrefabs) {
            if (!this.isValidEntry(entry)) continue;
            this.spawner.prewarm(entry.prefab, entry.prewarmCount, this.node);
          }

          for (const entry of this.teamBPrefabs) {
            if (!this.isValidEntry(entry)) continue;
            this.spawner.prewarm(entry.prefab, entry.prewarmCount, this.node);
          }
        }

        isValidEntry(entry) {
          if (!entry) return false;
          if (!entry.name) return false;
          if (!entry.prefab) return false;
          return true;
        }

        getTeamEntry(team, unitName) {
          const map = team === 0 ? this.teamAPrefabMap : this.teamBPrefabMap;
          const entry = map.get(unitName);

          if (!entry || !entry.prefab) {
            console.warn('[GameManager] Missing unit entry:', unitName);
            return null;
          }

          return entry;
        }

        getRandomEntry(entries) {
          const validEntries = [];

          for (const entry of entries) {
            if (!this.isValidEntry(entry)) continue;

            if (Math.floor(entry.unitCount) <= 0) {
              continue;
            }

            validEntries.push(entry);
          }

          if (validEntries.length <= 0) {
            return null;
          }

          const index = Math.floor(Math.random() * validEntries.length);
          return validEntries[index];
        }

        getTeamEntries(team) {
          return team === 0 ? this.teamAPrefabs : this.teamBPrefabs;
        }

        getAliveUnits(team) {
          return team === 0 ? this.teamA : this.teamB;
        }

        getWavesByTeam(team) {
          const result = [];

          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDead()) continue;
            result.push(wave);
          }

          return result;
        }

        updateAutoSpawn(deltaTime) {
          const safeDeltaTime = Math.min(deltaTime, Math.max(0.016, this.maxAutoSpawnDeltaTime));
          this.spawnWaveTimer += safeDeltaTime;

          if (this.spawnWaveTimer < this.spawnWaveInterval) {
            return;
          }

          this.spawnWaveTimer = 0;
          this.spawnAutoWave();
        }

        spawnAutoWave() {
          const entryA = this.getRandomEntry(this.teamAPrefabs);
          const entryB = this.getRandomEntry(this.teamBPrefabs);

          if (entryA) {
            this.spawnEntryFormation(0, entryA, this.teamASpawnZ);
          }

          if (entryB) {
            this.spawnEntryFormation(1, entryB, this.teamBSpawnZ);
          }

          this.rebuildSpatialGrid();
        }

        spawnWaveByEntry(team, entry) {
          if (!entry || !entry.prefab) {
            return null;
          }

          const baseZ = team === 0 ? this.teamASpawnZ : this.teamBSpawnZ;
          const wave = this.spawnEntryFormation(team, entry, baseZ);
          this.rebuildSpatialGrid();
          return wave;
        }

        spawnWaveByName(team, unitName) {
          const entry = this.getTeamEntry(team, unitName);
          if (!entry) return null;
          return this.spawnWaveByEntry(team, entry);
        }

        spawnEntryFormation(team, entry, baseZ) {
          const count = Math.max(0, Math.floor(entry.unitCount));

          if (count <= 0) {
            return null;
          }

          const wave = new (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave)(this.nextWaveId++, team, entry.name, entry.unitType, count);
          this.waves.push(wave);
          const maxPerRow = Math.max(1, Math.floor(this.maxUnitPerRow));
          let spawned = 0;
          let row = 0;

          while (spawned < count) {
            const remaining = count - spawned;
            const rowCount = Math.min(maxPerRow, remaining);
            const rowXPositions = this.buildCenteredRowXPositions(rowCount, row);

            for (let col = 0; col < rowCount; col++) {
              const x = rowXPositions[col];
              const rowZOffset = row * this.spaceBetweenRow;
              const baseUnitZ = team === 0 ? baseZ - rowZOffset : baseZ + rowZOffset;
              const z = baseUnitZ + this.randomRange(-this.formationZNoise, this.formationZNoise);
              const pos = new Vec3(x, 0, z);
              let unit = null;

              if (team === 0) {
                unit = this.spawnTeamA(entry.name, pos);
              } else {
                unit = this.spawnTeamB(entry.name, pos);
              }

              if (unit) {
                wave.addUnit(unit);
              }

              spawned++;
            }

            row++;
          }

          return wave;
        }

        buildCenteredRowXPositions(rowCount, rowIndex) {
          const result = [];

          if (rowCount <= 0) {
            return result;
          }

          const gap = Math.max(0, this.centerGapWidth);

          if (gap <= 0) {
            for (let col = 0; col < rowCount; col++) {
              const x = (col - (rowCount - 1) * 0.5) * this.spaceBetweenUnit;
              result.push(x);
            }

            return result;
          }

          const gapHalf = gap * 0.5;
          let pairIndex = 0;
          const startRightSide = rowIndex % 2 === 1;

          while (result.length < rowCount) {
            const leftX = -gapHalf - pairIndex * this.spaceBetweenUnit;
            const rightX = gapHalf + pairIndex * this.spaceBetweenUnit;

            if (startRightSide) {
              result.push(rightX);

              if (result.length < rowCount) {
                result.push(leftX);
              }
            } else {
              result.push(leftX);

              if (result.length < rowCount) {
                result.push(rightX);
              }
            }

            pairIndex++;
          }

          result.sort((a, b) => a - b);
          return result;
        }

        spawnTeamA(unitName, pos) {
          const entry = this.getTeamEntry(0, unitName);

          if (!entry || !entry.prefab) {
            return null;
          }

          const unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.unitType, pos, 0, this.node, entry.maxSpeed, entry.health, entry.damage, entry.defense);

          if (this.teamA.indexOf(unit) < 0) {
            this.teamA.push(unit);
            this.aliveCount[0]++;
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
          this.refreshBattleStatsUI();
          return unit;
        }

        spawnTeamB(unitName, pos) {
          const entry = this.getTeamEntry(1, unitName);

          if (!entry || !entry.prefab) {
            return null;
          }

          const unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.unitType, pos, 1, this.node, entry.maxSpeed, entry.health, entry.damage, entry.defense);

          if (this.teamB.indexOf(unit) < 0) {
            this.teamB.push(unit);
            this.aliveCount[1]++;
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
          this.refreshBattleStatsUI();
          return unit;
        }

        despawnUnit(unit) {
          if (!unit) return;

          if (unit.isHero) {
            this.handleHeroDeath(unit);
            return;
          }

          const team = unit.team;
          const unitName = unit.unitTypeName;
          const entry = this.getTeamEntry(team, unitName);

          if (!entry || !entry.prefab) {
            return;
          }

          if (team === 0) {
            const idx = this.teamA.indexOf(unit);

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
              this.rebuildSpatialGrid();
              this.refreshBattleStatsUI();
            }

            return;
          }

          if (team === 1) {
            const idx = this.teamB.indexOf(unit);

            if (idx >= 0) {
              this.teamB.splice(idx, 1);
              this.aliveCount[1]--;
              this.deathCount[1]++;

              if (this.aliveCount[1] < 0) {
                this.aliveCount[1] = 0;
              }

              (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
                error: Error()
              }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
              this.spawner.despawnUnit(unit, entry.prefab);
              this.rebuildSpatialGrid();
              this.refreshBattleStatsUI();
            }

            return;
          }
        }

        handleHeroDeath(unit) {
          const team = unit.team;

          if (team === 0) {
            const idx = this.teamA.indexOf(unit);

            if (idx >= 0) {
              this.teamA.splice(idx, 1);
            }

            this.aliveCount[0]--;
            this.deathCount[0]++;

            if (this.aliveCount[0] < 0) {
              this.aliveCount[0] = 0;
            }

            (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
              error: Error()
            }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
          } else {
            const idx = this.teamB.indexOf(unit);

            if (idx >= 0) {
              this.teamB.splice(idx, 1);
            }

            this.aliveCount[1]--;
            this.deathCount[1]++;

            if (this.aliveCount[1] < 0) {
              this.aliveCount[1] = 0;
            }

            (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
              error: Error()
            }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
          }

          unit.resetForDespawn();
          unit.node.active = false;
          this.rebuildSpatialGrid();
          this.refreshBattleStatsUI();
        }

        registerSceneHero(hero, team, typeName) {
          if (!hero) return;
          if (!hero.node.activeInHierarchy) return;
          hero.isHero = true;
          const props = hero.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);

          if (props) {
            props.resetForSpawn();
          }

          const behavior = hero.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior);

          if (behavior) {
            behavior.gameManager = this;
            behavior.resetForSpawn();
          }

          const finder = hero.getComponent(_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder);

          if (finder) {
            finder.resetForSpawn(team);
          }

          const forwardX = 0;
          const forwardZ = team === 0 ? 1 : -1;
          hero.init(this.sim, team, typeName, forwardX, forwardZ);

          if (team === 0) {
            if (this.teamA.indexOf(hero) < 0) {
              this.teamA.push(hero);
              this.aliveCount[0]++;
            }

            (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
              error: Error()
            }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
          } else {
            if (this.teamB.indexOf(hero) < 0) {
              this.teamB.push(hero);
              this.aliveCount[1]++;
            }

            (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
              error: Error()
            }), EnemyFinder) : EnemyFinder).teamB = this.teamB;
          }
        }

        refreshBattleStatsUI() {
          if (this.teamAAliveLabel) {
            this.teamAAliveLabel.string = 'A Alive: ' + this.aliveCount[0];
          }

          if (this.teamADeathLabel) {
            this.teamADeathLabel.string = 'A Death: ' + this.deathCount[0];
          }

          if (this.teamBAliveLabel) {
            this.teamBAliveLabel.string = 'B Alive: ' + this.aliveCount[1];
          }

          if (this.teamBDeathLabel) {
            this.teamBDeathLabel.string = 'B Death: ' + this.deathCount[1];
          }

          if (this.teamAKillLabel) {
            this.teamAKillLabel.string = 'A Kill: ' + this.killCount[0];
          }

          if (this.teamBKillLabel) {
            this.teamBKillLabel.string = 'B Kill: ' + this.killCount[1];
          }

          if (this.teamACounterKillLabel) {
            this.teamACounterKillLabel.string = 'A Counter Kill: ' + this.counterKillCount[0] + ' (' + Math.round(this.getCounterKillRatio(0) * 100) + '%)';
          }

          if (this.teamBCounterKillLabel) {
            this.teamBCounterKillLabel.string = 'B Counter Kill: ' + this.counterKillCount[1] + ' (' + Math.round(this.getCounterKillRatio(1) * 100) + '%)';
          }
        }

        randomRange(min, max) {
          return Math.random() * (max - min) + min;
        }

      }, _class6.instance = null, _class6), (_descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "useWorkerRVO", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "teamAPrefabs", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "teamBPrefabs", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "teamAHero", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "teamBHero", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "battleMinX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -28;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "battleMaxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 28;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "battleMinZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -18;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "battleMaxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 18;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "visualSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 16;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "spatialGridCellSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "spatialGridUpdateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "teamAAliveLabel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "teamADeathLabel", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "teamBAliveLabel", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "teamBDeathLabel", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class5.prototype, "teamAKillLabel", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class5.prototype, "teamBKillLabel", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class5.prototype, "teamACounterKillLabel", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class5.prototype, "teamBCounterKillLabel", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class5.prototype, "enableAutoSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class5.prototype, "spawnImmediatelyOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class5.prototype, "prewarmOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class5.prototype, "spawnWaveInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class5.prototype, "maxAutoSpawnDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class5.prototype, "teamASpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -20;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class5.prototype, "teamBSpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class5.prototype, "maxUnitPerRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class5.prototype, "spaceBetweenUnit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class5.prototype, "spaceBetweenRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class5.prototype, "formationZNoise", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class5.prototype, "centerGapWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class5.prototype, "circleObstacles", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class5.prototype, "rectObstacles", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2a3d48594ca107bb253a09fa8016eb25bbe98eb1.js.map