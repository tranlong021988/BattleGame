System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Color, Component, Vec3, Label, instantiate, MeshRenderer, Unit, UnitProps, RVOSimulator, RVOWorkerSimulator, ObstacleCircle, ObstacleRect, UnitSpawner, UnitBehavior, BattleSpatialGrid, BattleWave, CounterSettings, UnitType, BattleUnitDatabase, HealthBar3D, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _descriptor47, _class3, _crd, ccclass, property, BannerVisibilityBlockedEvent, BattleWaveSpawnedEvent, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitProps(extras) {
    _reporterNs.report("UnitProps", "./UnitProps", _context.meta, extras);
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

  function _reportPossibleCrUseOfBattleWave(extras) {
    _reporterNs.report("BattleWave", "./BattleWave", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCounterSettings(extras) {
    _reporterNs.report("CounterSettings", "./CounterSettings", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitType(extras) {
    _reporterNs.report("UnitType", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleUnitDatabase(extras) {
    _reporterNs.report("BattleUnitDatabase", "./BattleUnitDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitPrefabEntry(extras) {
    _reporterNs.report("UnitPrefabEntry", "./BattleUnitDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHeroEntry(extras) {
    _reporterNs.report("HeroEntry", "./BattleUnitDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHealthBar3D(extras) {
    _reporterNs.report("HealthBar3D", "./HealthBar3D", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Color = _cc.Color;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
      Label = _cc.Label;
      instantiate = _cc.instantiate;
      MeshRenderer = _cc.MeshRenderer;
    }, function (_unresolved_2) {
      Unit = _unresolved_2.Unit;
    }, function (_unresolved_3) {
      UnitProps = _unresolved_3.UnitProps;
    }, function (_unresolved_4) {
      RVOSimulator = _unresolved_4.RVOSimulator;
    }, function (_unresolved_5) {
      RVOWorkerSimulator = _unresolved_5.RVOWorkerSimulator;
    }, function (_unresolved_6) {
      ObstacleCircle = _unresolved_6.ObstacleCircle;
    }, function (_unresolved_7) {
      ObstacleRect = _unresolved_7.ObstacleRect;
    }, function (_unresolved_8) {
      UnitSpawner = _unresolved_8.UnitSpawner;
    }, function (_unresolved_9) {
      UnitBehavior = _unresolved_9.UnitBehavior;
    }, function (_unresolved_10) {
      BattleSpatialGrid = _unresolved_10.BattleSpatialGrid;
    }, function (_unresolved_11) {
      BattleWave = _unresolved_11.BattleWave;
    }, function (_unresolved_12) {
      CounterSettings = _unresolved_12.CounterSettings;
    }, function (_unresolved_13) {
      UnitType = _unresolved_13.UnitType;
    }, function (_unresolved_14) {
      BattleUnitDatabase = _unresolved_14.BattleUnitDatabase;
    }, function (_unresolved_15) {
      HealthBar3D = _unresolved_15.HealthBar3D;
    }, function (_unresolved_16) {
      _export("UnitPrefabEntry", _unresolved_16.UnitPrefabEntry);
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1e335OSdGRGLrD08aYssvKr", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Color', 'Component', 'Vec3', 'Label', 'Prefab', 'Node', 'instantiate', 'MeshRenderer', 'Material']);

      ({
        ccclass,
        property
      } = _decorator);
      BannerVisibilityBlockedEvent = 'battle-camera-banner-visibility-blocked';
      BattleWaveSpawnedEvent = 'battle-wave-spawned';

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(_crd && BattleUnitDatabase === void 0 ? (_reportPossibleCrUseOfBattleUnitDatabase({
        error: Error()
      }), BattleUnitDatabase) : BattleUnitDatabase), _dec3 = property(Component), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(Label), _dec9 = property(Label), _dec10 = property(Label), _dec11 = property(Label), _dec12 = property(Label), _dec13 = property(Label), _dec14 = property({
        min: 1,
        tooltip: 'Frames between safety wave-banner holder refresh checks. Set to 1 to refresh every frame.'
      }), _dec15 = property(Camera), _dec16 = property({
        type: [_crd && ObstacleCircle === void 0 ? (_reportPossibleCrUseOfObstacleCircle({
          error: Error()
        }), ObstacleCircle) : ObstacleCircle]
      }), _dec17 = property({
        type: [_crd && ObstacleRect === void 0 ? (_reportPossibleCrUseOfObstacleRect({
          error: Error()
        }), ObstacleRect) : ObstacleRect]
      }), _dec(_class = (_class2 = (_class3 = class GameManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "unitDatabase", _descriptor, this);

          _initializerDefineProperty(this, "cinematicController", _descriptor2, this);

          _initializerDefineProperty(this, "useWorkerRVO", _descriptor3, this);

          this.teamAHero = null;
          this.teamBHero = null;

          _initializerDefineProperty(this, "battleMinX", _descriptor4, this);

          _initializerDefineProperty(this, "battleMaxX", _descriptor5, this);

          _initializerDefineProperty(this, "battleMinZ", _descriptor6, this);

          _initializerDefineProperty(this, "battleMaxZ", _descriptor7, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor8, this);

          _initializerDefineProperty(this, "rvoUpdateFrameOffset", _descriptor9, this);

          _initializerDefineProperty(this, "maxRvoStepDeltaTime", _descriptor10, this);

          this.frame = 0;

          _initializerDefineProperty(this, "visualSmooth", _descriptor11, this);

          _initializerDefineProperty(this, "spatialGridCellSize", _descriptor12, this);

          _initializerDefineProperty(this, "spatialGridUpdateInterval", _descriptor13, this);

          _initializerDefineProperty(this, "spatialGridUpdateFrameOffset", _descriptor14, this);

          _initializerDefineProperty(this, "useWorkerSpatialTargetQuery", _descriptor15, this);

          this.spatialGrid = new (_crd && BattleSpatialGrid === void 0 ? (_reportPossibleCrUseOfBattleSpatialGrid({
            error: Error()
          }), BattleSpatialGrid) : BattleSpatialGrid)();

          _initializerDefineProperty(this, "teamAAliveLabel", _descriptor16, this);

          _initializerDefineProperty(this, "teamADeathLabel", _descriptor17, this);

          _initializerDefineProperty(this, "teamBAliveLabel", _descriptor18, this);

          _initializerDefineProperty(this, "teamBDeathLabel", _descriptor19, this);

          _initializerDefineProperty(this, "teamAKillLabel", _descriptor20, this);

          _initializerDefineProperty(this, "teamBKillLabel", _descriptor21, this);

          _initializerDefineProperty(this, "teamACounterKillLabel", _descriptor22, this);

          _initializerDefineProperty(this, "teamBCounterKillLabel", _descriptor23, this);

          _initializerDefineProperty(this, "teamACombatPointLabel", _descriptor24, this);

          _initializerDefineProperty(this, "teamBCombatPointLabel", _descriptor25, this);

          this.aliveCount = [0, 0];
          this.deathCount = [0, 0];
          this.killCount = [0, 0];
          this.counterKillCount = [0, 0];
          this.combatPoint = [0, 0];
          this.initialCombatPoint = [0, 0];

          _initializerDefineProperty(this, "enableAutoSpawn", _descriptor26, this);

          _initializerDefineProperty(this, "spawnImmediatelyOnStart", _descriptor27, this);

          _initializerDefineProperty(this, "prewarmOnStart", _descriptor28, this);

          _initializerDefineProperty(this, "spawnWaveInterval", _descriptor29, this);

          _initializerDefineProperty(this, "maxAutoSpawnDeltaTime", _descriptor30, this);

          _initializerDefineProperty(this, "teamASpawnZ", _descriptor31, this);

          _initializerDefineProperty(this, "teamBSpawnZ", _descriptor32, this);

          _initializerDefineProperty(this, "formationZNoise", _descriptor33, this);

          _initializerDefineProperty(this, "centerGapWidth", _descriptor34, this);

          _initializerDefineProperty(this, "enableLaneSpawn", _descriptor35, this);

          _initializerDefineProperty(this, "laneCount", _descriptor36, this);

          _initializerDefineProperty(this, "defaultSpawnLane", _descriptor37, this);

          _initializerDefineProperty(this, "autoSpawnRandomLane", _descriptor38, this);

          _initializerDefineProperty(this, "waveBannerTweenDuration", _descriptor39, this);

          _initializerDefineProperty(this, "waveBannerRefreshIntervalFrames", _descriptor40, this);

          _initializerDefineProperty(this, "waveBannerCamera", _descriptor41, this);

          _initializerDefineProperty(this, "enableWaveBannerCameraVisibility", _descriptor42, this);

          _initializerDefineProperty(this, "hideWaveBannerInOrbitMode", _descriptor43, this);

          _initializerDefineProperty(this, "waveBannerHideFovBelow", _descriptor44, this);

          _initializerDefineProperty(this, "waveBannerShowFovAbove", _descriptor45, this);

          this.spawnWaveTimer = 0;

          _initializerDefineProperty(this, "circleObstacles", _descriptor46, this);

          _initializerDefineProperty(this, "rectObstacles", _descriptor47, this);

          this.sim = null;
          this.teamA = [];
          this.teamB = [];
          this.waves = [];
          this.nextWaveId = 1;
          this.spawner = void 0;
          this.teamAPrefabMap = new Map();
          this.teamBPrefabMap = new Map();
          this.laneVoteCounts = [];
          this.tempSpawnPos = new Vec3();
          this.centeredRowXBuffer = [];
          this.teamAHeroWave = null;
          this.teamBHeroWave = null;
          this.heroForwardUnlocked = [false, false];
          this.waveBannerPools = new Map();
          this.registeredCinematicController = null;
          this.waveBannerCameraBlocked = false;
          this.waveBannerVisibleByCamera = true;
          this.waveBannerVisibilityInitialized = false;
          this.spatialGridDirty = true;
          this.battleStatsUiDirty = true;
          this.waveBannerTeamAColorParams = [0, 0, 0, 0];
          this.waveBannerTeamBColorParams = [0, 0, 0, 0];
          this.waveBannerRendererCache = new WeakMap();
          this.waveBannerIconParamCache = new WeakMap();
          this.waveBannerHealthBarCache = new WeakMap();
          this.fallbackTeamABannerColor = new Color(0, 70, 255, 255);
          this.fallbackTeamBBannerColor = new Color(255, 0, 0, 255);
        }

        start() {
          GameManager.instance = this;
          this.teamA.length = 0;
          this.teamB.length = 0;
          this.waves.length = 0;
          this.nextWaveId = 1;
          this.teamAHeroWave = null;
          this.teamBHeroWave = null;
          this.heroForwardUnlocked[0] = false;
          this.heroForwardUnlocked[1] = false;
          this.teamAHero = null;
          this.teamBHero = null;
          this.aliveCount[0] = 0;
          this.aliveCount[1] = 0;
          this.deathCount[0] = 0;
          this.deathCount[1] = 0;
          this.killCount[0] = 0;
          this.killCount[1] = 0;
          this.counterKillCount[0] = 0;
          this.counterKillCount[1] = 0;
          this.spawnWaveTimer = 0;
          this.resetCombatPoint();
          this.createSimulator();
          this.buildPrefabMaps();
          this.spatialGrid.cellSize = this.spatialGridCellSize;
          this.sim.setBattlefield(this.battleMinX, this.battleMaxX, this.battleMinZ, this.battleMaxZ);
          this.spawner = this.getComponent(_crd && UnitSpawner === void 0 ? (_reportPossibleCrUseOfUnitSpawner({
            error: Error()
          }), UnitSpawner) : UnitSpawner);
          this.spawner.init(this.sim);
          this.registerWaveBannerCameraEvents();
          this.updateWaveBannerCameraVisibility(true);

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

          this.registerDatabaseHeroes();

          if (this.spawnImmediatelyOnStart) {
            this.spawnAutoWave();
          }

          this.rebuildSpatialGrid();
          this.refreshBattleStatsUI(true);
        }

        onDestroy() {
          if (GameManager.instance === this) {
            GameManager.instance = null;
          }

          this.unregisterWaveBannerCameraEvents();

          if (this.sim && this.sim.destroy) {
            this.sim.destroy();
          }

          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];

            if (wave) {
              wave.releaseReferences();
            }
          }

          if (this.teamAHeroWave) {
            this.teamAHeroWave.releaseReferences();
          }

          if (this.teamBHeroWave) {
            this.teamBHeroWave.releaseReferences();
          }

          this.waves.length = 0;
          this.teamAHeroWave = null;
          this.teamBHeroWave = null;
          this.heroForwardUnlocked[0] = false;
          this.heroForwardUnlocked[1] = false;
          this.teamA.length = 0;
          this.teamB.length = 0;
          this.teamAPrefabMap.clear();
          this.teamBPrefabMap.clear();
          this.clearWaveBannerPools();
          this.spatialGrid.destroy();
          this.spatialGrid.build([], []);
          this.sim = null;
        }

        resetCombatPoint() {
          var aInitial = this.unitDatabase ? this.unitDatabase.getInitialCombatPoint(0) : 0;
          var bInitial = this.unitDatabase ? this.unitDatabase.getInitialCombatPoint(1) : 0;
          this.initialCombatPoint[0] = Math.max(0, aInitial);
          this.initialCombatPoint[1] = Math.max(0, bInitial);
          this.combatPoint[0] = this.initialCombatPoint[0];
          this.combatPoint[1] = this.initialCombatPoint[1];
        }

        createSimulator() {
          if (this.useWorkerRVO && (_crd && RVOWorkerSimulator === void 0 ? (_reportPossibleCrUseOfRVOWorkerSimulator({
            error: Error()
          }), RVOWorkerSimulator) : RVOWorkerSimulator).isSupported()) {
            this.sim = new (_crd && RVOWorkerSimulator === void 0 ? (_reportPossibleCrUseOfRVOWorkerSimulator({
              error: Error()
            }), RVOWorkerSimulator) : RVOWorkerSimulator)();
          } else {
            this.sim = new (_crd && RVOSimulator === void 0 ? (_reportPossibleCrUseOfRVOSimulator({
              error: Error()
            }), RVOSimulator) : RVOSimulator)();
          }
        }

        update(deltaTime) {
          this.frame++;
          (_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit).visualLerpT = 1 - Math.exp(-this.visualSmooth * deltaTime);

          if (this.shouldRunFrameInterval(this.updateInterval, this.rvoUpdateFrameOffset)) {
            var safeDt = Math.min(deltaTime, Math.max(0.001, this.maxRvoStepDeltaTime));
            this.sim.step(safeDt);
          }

          if (this.shouldRunFrameInterval(this.spatialGridUpdateInterval, this.spatialGridUpdateFrameOffset)) {
            this.requestSpatialGridRebuild();
          }

          if (this.enableAutoSpawn) {
            this.updateAutoSpawn(deltaTime);
          }

          if (this.spatialGridDirty) {
            this.rebuildSpatialGrid();
          }

          this.processDynamicWaveLanes();
          this.processWaveForwardSearches();
          this.processWaveForwardRecoveries();
          this.processWaveBanners();
          this.pruneDeadWaves();
          this.processHeroForwardUnlock();
          this.refreshBattleStatsUI();
        }

        shouldRunFrameInterval(interval, offset) {
          if (offset === void 0) {
            offset = 0;
          }

          var safeInterval = Math.max(1, Math.floor(interval));
          var phase = (Math.floor(offset) % safeInterval + safeInterval) % safeInterval;
          return (this.frame + phase) % safeInterval === 0;
        }

        reportKill(killer, victim) {
          if (!killer || !victim) return;
          if (!killer.props || !victim.props) return;
          var killerTeam = killer.team;

          if (killerTeam !== 0 && killerTeam !== 1) {
            return;
          }

          this.killCount[killerTeam]++;
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          var isCounterKill = false;

          if (counter && !killer.isHero && !victim.isHero) {
            var damageMul = counter.getDamageMultiplier(killer.props.unitType, victim.props.unitType);
            var receivedMul = counter.getReceivedDamageMultiplier(killer.props.unitType, victim.props.unitType);
            isCounterKill = damageMul > 1.0001 || receivedMul < 0.9999;
          }

          if (isCounterKill) {
            this.counterKillCount[killerTeam]++;
          }

          if (!killer.isHero) {
            this.addCombatPointFromVictim(killerTeam, victim, isCounterKill);
          }

          this.requestBattleStatsUIRefresh();
        }

        onWaveCombatStarted(unit, enemy, useInitialForwardGate) {
          if (enemy === void 0) {
            enemy = null;
          }

          if (useInitialForwardGate === void 0) {
            useInitialForwardGate = true;
          }

          var wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return;
          if (wave.isDead()) return;

          if (!this.shouldDelayInitialForwardCombat(wave, unit, enemy, useInitialForwardGate)) {
            wave.enterCombatMode();
          }

          var enemyWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(enemy);

          if (!enemyWave || enemyWave === wave || enemyWave.isDead()) {
            return;
          }

          if (!this.shouldDelayInitialForwardCombat(enemyWave, enemy, unit, useInitialForwardGate)) {
            enemyWave.enterCombatMode();
          }
        }

        shouldDelayInitialForwardCombat(wave, unit, enemy, useInitialForwardGate) {
          if (!useInitialForwardGate) return false;
          if (!wave.isInitialForwardCombatGateActive()) return false;
          if (!unit || !enemy) return false;
          if (!unit.onForward) return false;
          if (unit.laneId < 0 || enemy.laneId < 0) return false;

          if (this.clampLaneId(unit.laneId) !== this.clampLaneId(enemy.laneId)) {
            return false;
          }

          var aliveCount = wave.getRuntimeAliveCount(this.frame);
          var threshold = Math.min(aliveCount, wave.getInitialForwardCombatReleaseThreshold());
          if (threshold <= 1) return false;
          return wave.getEngagedCountIncluding(unit) < threshold;
        }

        onWaveForwardTargetFound(unit, target) {
          if (!unit || !target) return false;
          var wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return false;
          if (wave.isDead()) return false;
          wave.releaseForwardToFreeHunt();
          unit.setWaveSearchTarget(target);
          return true;
        }

        findSharedWaveTargetForUnit(unit) {
          if (!unit) return null;
          var wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return null;
          return wave.findSharedTargetForUnit(unit);
        }

        getMajorityLaneIdForWave(wave) {
          if (!wave) return -1;
          var laneCount = this.getSafeLaneCount();
          var counts = this.laneVoteCounts;
          counts.length = laneCount;

          for (var i = 0; i < laneCount; i++) {
            counts[i] = 0;
          }

          var counted = 0;
          var sumX = 0;

          for (var _i = 0; _i < wave.units.length; _i++) {
            var unit = wave.units[_i];
            if (!this.isAliveUnit(unit)) continue;
            var unitX = unit.node.worldPosition.x;
            var laneId = this.getNearestLaneIdForX(unitX);
            counts[laneId]++;
            counted++;
            sumX += unitX;
          }

          if (counted <= 0) return -1;
          var bestCount = 0;

          for (var _i2 = 0; _i2 < laneCount; _i2++) {
            if (counts[_i2] > bestCount) {
              bestCount = counts[_i2];
            }
          }

          if (bestCount <= 0) return -1;
          var currentLane = wave.laneId >= 0 ? this.clampLaneId(wave.laneId) : -1;

          if (currentLane >= 0 && counts[currentLane] === bestCount) {
            return currentLane;
          }

          var averageX = sumX / counted;
          var bestLane = -1;
          var bestCenterDistance = Infinity;

          for (var _i3 = 0; _i3 < laneCount; _i3++) {
            if (counts[_i3] !== bestCount) continue;
            var centerDistance = Math.abs(averageX - this.getLaneCenterX(_i3));

            if (centerDistance < bestCenterDistance) {
              bestCenterDistance = centerDistance;
              bestLane = _i3;
            }
          }

          return bestLane;
        }

        processDynamicWaveLanes() {
          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];
            this.refreshDynamicLaneForWave(wave);
          }

          this.refreshDynamicLaneForWave(this.teamAHeroWave);
          this.refreshDynamicLaneForWave(this.teamBHeroWave);
        }

        processWaveForwardSearches() {
          for (var i = 0; i < this.waves.length; i++) {
            this.searchForwardWaveTarget(this.waves[i]);
          }
        }

        searchForwardWaveTarget(wave) {
          if (!wave) return;
          if (!wave.isForwardMode()) return;
          if (wave.isDeadRuntime(this.frame)) return;
          var scanner = wave.getForwardScanner();
          if (!scanner) return;

          if (scanner.hasReachedEnemyHeroLine()) {
            var heroTarget = scanner.getEnemyHeroTarget();

            if (heroTarget) {
              this.onWaveForwardTargetFound(scanner, heroTarget);
            }

            return;
          }

          if (wave.isAggressiveForwardMode()) {
            var _heroTarget = scanner.getEnemyHeroTarget();

            if (_heroTarget && this.shouldReleaseAggressiveForwardHeroTarget(scanner, _heroTarget)) {
              this.onWaveForwardTargetFound(scanner, _heroTarget);
            }

            if (!this.shouldRunFrameInterval(wave.getTargetSearchIntervalFrames(), wave.id)) {
              return;
            }

            scanner = wave.getForwardScanner(true);
            if (!scanner) return;
            var sameLaneTarget = scanner.findForwardSearchTarget(true);

            if (sameLaneTarget && this.shouldReleaseAggressiveForwardSameLaneTarget(scanner, sameLaneTarget)) {
              this.onWaveForwardTargetFound(scanner, sameLaneTarget);
            }

            return;
          }

          if (!this.shouldRunFrameInterval(wave.getTargetSearchIntervalFrames(), wave.id)) {
            return;
          }

          scanner = wave.getForwardScanner(true);
          if (!scanner) return;
          var target = scanner.findForwardSearchTarget(false);

          if (target && this.shouldReleaseNormalForwardTarget(scanner, target)) {
            this.onWaveForwardTargetFound(scanner, target);
          }
        }

        shouldReleaseNormalForwardTarget(scanner, target) {
          if (!scanner || !target) return false;
          if (scanner.laneId < 0) return false;
          if (target.laneId < 0) return false;
          var scannerLane = this.clampLaneId(scanner.laneId);
          var targetLane = this.clampLaneId(target.laneId);
          var laneDistance = Math.abs(scannerLane - targetLane);

          if (laneDistance > 1) {
            return false;
          }

          return scanner.hasPassedForwardTarget(target);
        }

        shouldReleaseAggressiveForwardHeroTarget(scanner, target) {
          if (!target.isHero) return false;
          if (!scanner.agent || !target.agent) return false;
          var dx = target.agent.pos.x - scanner.agent.pos.x;
          var dz = target.agent.pos.z - scanner.agent.pos.z;
          var range = Math.max(0, scanner.targetSearchRange);

          if (dx * dx + dz * dz > range * range) {
            return false;
          }

          return this.shouldReleaseNormalForwardTarget(scanner, target);
        }

        shouldReleaseAggressiveForwardSameLaneTarget(scanner, target) {
          if (!scanner || !target) return false;
          if (scanner.laneId < 0) return false;
          if (target.laneId < 0) return false;

          if (this.clampLaneId(scanner.laneId) !== this.clampLaneId(target.laneId)) {
            return false;
          }

          return scanner.hasPassedForwardTarget(target);
        }

        processWaveForwardRecoveries() {
          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
              continue;
            }

            wave.refreshInitialForwardCombatGate();
            wave.tryResumeForward();
          }
        }

        processWaveBanners() {
          this.updateWaveBannerCameraVisibility(false);

          if (!this.shouldRunFrameInterval(this.waveBannerRefreshIntervalFrames, 0)) {
            return;
          }

          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
              continue;
            }

            wave.refreshWaveBanner();
            this.updateWaveBannerHealthBar(wave);
          }
        }

        updateWaveBannerCameraVisibility(force) {
          var visible = this.resolveWaveBannerCameraVisibility();

          if (!force && this.waveBannerVisibilityInitialized && visible === this.waveBannerVisibleByCamera) {
            return;
          }

          this.waveBannerVisibilityInitialized = true;
          this.waveBannerVisibleByCamera = visible;

          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
              continue;
            }

            wave.setWaveBannerVisible(visible);
          }
        }

        resolveWaveBannerCameraVisibility() {
          if (!this.enableWaveBannerCameraVisibility) {
            return true;
          }

          if (this.hideWaveBannerInOrbitMode && this.waveBannerCameraBlocked) {
            return false;
          }

          var camera = this.resolveWaveBannerCamera();

          if (!camera) {
            return true;
          }

          var fov = camera.fov;
          var hideFov = Math.max(0, this.waveBannerHideFovBelow);
          var showFov = Math.max(hideFov, this.waveBannerShowFovAbove);

          if (!this.waveBannerVisibilityInitialized) {
            return fov > hideFov;
          }

          if (this.waveBannerVisibleByCamera) {
            return fov > hideFov;
          }

          return fov >= showFov;
        }

        resolveWaveBannerCamera() {
          if (this.waveBannerCamera) {
            return this.waveBannerCamera;
          }

          var controller = this.cinematicController;

          if (controller && controller.mainCamera) {
            return controller.mainCamera;
          }

          return null;
        }

        refreshDynamicLaneForWave(wave) {
          if (!wave) return;
          if (wave.isDeadRuntime(this.frame)) return;
          var interval = wave.getTargetSearchIntervalFrames(); // Lane is strategic metadata only. Stagger updates by wave
          // so dispersed waves do not all vote on the same frame.

          if (!this.shouldRunFrameInterval(interval, wave.id)) {
            return;
          }

          var laneId = this.getMajorityLaneIdForWave(wave);

          if (laneId >= 0 && laneId !== wave.laneId) {
            wave.setLaneId(laneId);
          }
        }

        pruneDeadWaves() {
          for (var i = this.waves.length - 1; i >= 0; i--) {
            var wave = this.waves[i];
            if (!wave || !wave.isDeadRuntime(this.frame)) continue;
            wave.releaseReferences();
            this.waves.splice(i, 1);
          }
        }

        processHeroForwardUnlock() {
          if (!this.isCombatPointEnabled()) {
            return;
          }

          this.tryUnlockHeroForward(0);
          this.tryUnlockHeroForward(1);
        }

        tryUnlockHeroForward(team) {
          var hero = team === 0 ? this.teamAHero : this.teamBHero;

          if (!this.isAliveUnit(hero)) {
            return;
          }

          if (this.heroForwardUnlocked[team]) {
            return;
          }

          if (this.canAffordAnySpawnEntry(team)) {
            return;
          }

          if (this.hasAliveNonHeroUnit(team)) {
            return;
          }

          if (this.hasAliveWave(team)) {
            return;
          }

          this.unlockHeroForward(team, hero);
        }

        unlockHeroForward(team, hero) {
          var laneId = this.getHeroLaneId();
          var heroWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

          if (!heroWave || heroWave.isDead()) {
            this.registerHeroWave(hero, team, hero.unitTypeName, hero.props ? hero.props.unitType : (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
              error: Error()
            }), UnitType) : UnitType).LightSword);
            heroWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;
          }

          if (heroWave) {
            heroWave.setLaneId(laneId);
          }

          this.heroForwardUnlocked[team] = true;
          hero.setSteady(false, true);

          if (heroWave) {
            this.ensureBattleWaveRegistered(heroWave);
            heroWave.forceForwardMode();
          }

          this.forceEnemyWavesToForward(team);
        }

        forceEnemyWavesToForward(heroTeam) {
          var enemyTeam = heroTeam === 0 ? 1 : 0;

          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== enemyTeam) continue;
            if (wave.isDead()) continue;
            wave.forceForwardMode();
          }
        }

        hasAliveNonHeroUnit(team) {
          var units = team === 0 ? this.teamA : this.teamB;

          for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (!unit) continue;
            if (unit.isHero) continue;
            if (!this.isAliveUnit(unit)) continue;
            return true;
          }

          return false;
        }

        hasAliveWave(team) {
          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDead()) continue;
            return true;
          }

          return false;
        }

        canAffordAnySpawnEntry(team) {
          var entries = this.getDatabaseTeamEntries(team);

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!this.isValidSpawnEntry(entry)) continue;

            if (this.canAffordEntry(team, entry)) {
              return true;
            }
          }

          return false;
        }

        isAliveUnit(unit) {
          if (!unit) return false;
          if (!unit.node.activeInHierarchy) return false;
          if (!unit.agent) return false;
          if (!unit.props) return false;
          if (unit.props.isDead()) return false;
          return true;
        }

        addCombatPointFromVictim(killerTeam, victim, isCounterKill) {
          if (!this.isCombatPointEnabled()) return;
          if (!this.unitDatabase) return;
          var bountyValue = this.getVictimBountyValue(victim);
          if (bountyValue <= 0) return;
          var reward = this.unitDatabase.calculateKillRewardFromBounty(bountyValue, isCounterKill);
          this.addCombatPoint(killerTeam, reward);
        }

        getVictimBountyValue(victim) {
          var victimTeam = victim.team;

          if (victim.isHero) {
            var heroEntry = this.getHeroEntry(victimTeam);
            if (!heroEntry) return 0;
            return Math.max(0, heroEntry.combatPointBountyValue);
          }

          var entry = this.getTeamEntry(victimTeam, victim.unitTypeName);
          if (!entry) return 0;
          return Math.max(0, entry.combatPointCost);
        }

        addCombatPoint(team, amount) {
          if (team !== 0 && team !== 1) return;
          if (amount <= 0) return;
          this.combatPoint[team] += amount;
        }

        spendCombatPoint(team, amount) {
          if (team !== 0 && team !== 1) return false;
          if (amount <= 0) return true;

          if (this.combatPoint[team] < amount) {
            return false;
          }

          this.combatPoint[team] -= amount;
          return true;
        }

        canAffordEntry(team, entry) {
          if (!entry) return false;
          if (!this.isCombatPointEnabled()) return true;
          return this.combatPoint[team] >= Math.max(0, entry.combatPointCost);
        }

        isValidSpawnEntry(entry, requirePositiveUnitCount) {
          if (requirePositiveUnitCount === void 0) {
            requirePositiveUnitCount = true;
          }

          if (!entry) return false;
          if (!entry.name) return false;
          if (!entry.prefab) return false;

          if (requirePositiveUnitCount && Math.floor(entry.unitCount) <= 0) {
            return false;
          }

          return true;
        }

        canAffordUnitName(team, unitName) {
          var safeName = (unitName || '').trim();
          if (!safeName) return false;
          var entry = this.getTeamEntry(team, safeName);

          if (!this.isValidSpawnEntry(entry)) {
            return false;
          }

          return this.canAffordEntry(team, entry);
        }

        collectAffordableEntries(team, out) {
          out.length = 0;
          var entries = this.getDatabaseTeamEntries(team);

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!this.isValidSpawnEntry(entry)) continue;

            if (!this.canAffordEntry(team, entry)) {
              continue;
            }

            out.push(entry);
          }

          return out;
        }

        getCombatPoint(team) {
          if (team !== 0 && team !== 1) return 0;
          return this.combatPoint[team];
        }

        getInitialCombatPoint(team) {
          if (team !== 0 && team !== 1) return 0;
          return this.initialCombatPoint[team];
        }

        isCombatPointEnabled() {
          return !!(this.unitDatabase && this.unitDatabase.enableCombatPoint);
        }

        getCounterKillRatio(team) {
          if (team !== 0 && team !== 1) return 0;

          if (this.killCount[team] <= 0) {
            return 0;
          }

          return this.counterKillCount[team] / this.killCount[team];
        }

        notifyUnitWillDespawn(unit) {
          var wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);

          if (wave) {
            wave.invalidateRuntimeHealth();
            wave.handleUnitWillDespawn(unit);
            this.updateWaveBannerHealthBar(wave);
          }

          var anyController = this.cinematicController;

          if (anyController && typeof anyController.onUnitWillDespawn === 'function') {
            anyController.onUnitWillDespawn(unit);
          }
        }

        rebuildSpatialGrid() {
          this.spatialGrid.cellSize = this.spatialGridCellSize;
          this.spatialGrid.useWorkerTargetQuery = this.useWorkerSpatialTargetQuery;
          this.spatialGrid.build(this.teamA, this.teamB);
          this.spatialGridDirty = false;
        }

        requestSpatialGridRebuild() {
          this.spatialGridDirty = true;
        }

        buildPrefabMaps() {
          this.teamAPrefabMap.clear();
          this.teamBPrefabMap.clear();
          var teamAEntries = this.getDatabaseTeamEntries(0);
          var teamBEntries = this.getDatabaseTeamEntries(1);

          for (var entry of teamAEntries) {
            if (!this.isValidEntry(entry)) continue;
            this.teamAPrefabMap.set(entry.name, entry);
          }

          for (var _entry of teamBEntries) {
            if (!this.isValidEntry(_entry)) continue;
            this.teamBPrefabMap.set(_entry.name, _entry);
          }
        }

        prewarmAllUnits() {
          var teamAEntries = this.getDatabaseTeamEntries(0);
          var teamBEntries = this.getDatabaseTeamEntries(1);

          for (var entry of teamAEntries) {
            if (!this.isValidEntry(entry)) continue;
            this.spawner.prewarm(entry.prefab, entry.prewarmCount, this.node);
          }

          for (var _entry2 of teamBEntries) {
            if (!this.isValidEntry(_entry2)) continue;
            this.spawner.prewarm(_entry2.prefab, _entry2.prewarmCount, this.node);
          }
        }

        getDatabaseTeamEntries(team) {
          if (!this.unitDatabase) {
            return [];
          }

          return this.unitDatabase.getTeamEntries(team);
        }

        isValidEntry(entry) {
          return this.isValidSpawnEntry(entry, false);
        }

        getTeamEntry(team, unitName) {
          if (this.unitDatabase) {
            var dbEntry = this.unitDatabase.getEntry(team, unitName);

            if (dbEntry && dbEntry.prefab) {
              return dbEntry;
            }
          }

          var map = team === 0 ? this.teamAPrefabMap : this.teamBPrefabMap;
          var entry = map.get(unitName);

          if (!entry || !entry.prefab) {
            return null;
          }

          return entry;
        }

        getHeroEntry(team) {
          if (!this.unitDatabase) return null;
          return this.unitDatabase.getHeroEntry(team);
        }

        getRandomEntry(entries, team) {
          var validEntries = [];

          for (var entry of entries) {
            if (!this.isValidSpawnEntry(entry)) continue;

            if (!this.canAffordEntry(team, entry)) {
              continue;
            }

            validEntries.push(entry);
          }

          if (validEntries.length <= 0) {
            return null;
          }

          var index = Math.floor(Math.random() * validEntries.length);
          return validEntries[index];
        }

        getTeamEntries(team) {
          return this.getDatabaseTeamEntries(team);
        }

        getAliveUnits(team) {
          return team === 0 ? this.teamA : this.teamB;
        }

        getAliveWaveCount(team) {
          var count = 0;

          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDead()) continue;
            count++;
          }

          return count;
        }

        getTotalAliveWaveCount() {
          var count = 0;

          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];
            if (!wave) continue;
            if (wave.isDead()) continue;
            count++;
          }

          return count;
        }

        getTotalAliveUnitCount() {
          return Math.max(0, this.aliveCount[0]) + Math.max(0, this.aliveCount[1]);
        }

        getWavesByTeam(team) {
          var result = [];

          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDead()) continue;
            result.push(wave);
          }

          return result;
        }

        updateAutoSpawn(deltaTime) {
          var safeDeltaTime = Math.min(deltaTime, Math.max(0.016, this.maxAutoSpawnDeltaTime));
          this.spawnWaveTimer += safeDeltaTime;

          if (this.spawnWaveTimer < this.spawnWaveInterval) {
            return;
          }

          this.spawnWaveTimer = 0;
          this.spawnAutoWave();
        }

        spawnAutoWave() {
          var teamAEntries = this.getDatabaseTeamEntries(0);
          var teamBEntries = this.getDatabaseTeamEntries(1);
          var entryA = this.getRandomEntry(teamAEntries, 0);
          var entryB = this.getRandomEntry(teamBEntries, 1);

          if (entryA) {
            this.spawnEntryFormation(0, entryA, this.teamASpawnZ, true);
          }

          if (entryB) {
            this.spawnEntryFormation(1, entryB, this.teamBSpawnZ, true);
          }

          this.requestSpatialGridRebuild();
        }

        spawnWaveByEntry(team, entry, laneId, aggressiveForward) {
          if (laneId === void 0) {
            laneId = -1;
          }

          if (aggressiveForward === void 0) {
            aggressiveForward = false;
          }

          if (!entry || !entry.prefab) {
            return null;
          }

          var baseZ = team === 0 ? this.teamASpawnZ : this.teamBSpawnZ;
          var wave = this.spawnEntryFormation(team, entry, baseZ, true, laneId, aggressiveForward);
          this.requestSpatialGridRebuild();
          return wave;
        }

        spawnWaveByName(team, unitName, laneId, aggressiveForward) {
          if (laneId === void 0) {
            laneId = -1;
          }

          if (aggressiveForward === void 0) {
            aggressiveForward = false;
          }

          var entry = this.getTeamEntry(team, unitName);
          if (!entry) return null;
          return this.spawnWaveByEntry(team, entry, laneId, aggressiveForward);
        }

        spawnEntryFormation(team, entry, baseZ, spendCost, requestedLaneId, aggressiveForward) {
          if (requestedLaneId === void 0) {
            requestedLaneId = -1;
          }

          if (aggressiveForward === void 0) {
            aggressiveForward = false;
          }

          var count = Math.max(0, Math.floor(entry.unitCount));

          if (count <= 0) {
            return null;
          }

          var cost = Math.max(0, entry.combatPointCost);

          if (spendCost && this.isCombatPointEnabled() && !this.spendCombatPoint(team, cost)) {
            this.requestBattleStatsUIRefresh();
            return null;
          }

          var laneId = this.resolveSpawnLaneId(requestedLaneId);
          var wave = new (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave)(this.nextWaveId++, team, entry.name, entry.unitType, count, laneId);
          wave.setInitialForwardCombatReleaseThreshold(entry.maxUnitPerRow);
          this.waves.push(wave);

          if (this.enableLaneSpawn) {
            this.spawnSquareFormationInLane(team, entry, baseZ, wave, laneId, count, aggressiveForward);
          } else {
            this.spawnCenteredRowsFormation(team, entry, baseZ, wave, count, aggressiveForward);
          }

          this.assignWaveBanner(wave, entry);
          this.node.emit(BattleWaveSpawnedEvent, wave);
          return wave;
        }

        assignWaveBanner(wave, entry) {
          var prefab = entry ? entry.waveBannerPrefab : null;
          if (!prefab) return;
          if (!wave) return;
          if (wave.getAliveCount() <= 0) return;
          var node = this.acquireWaveBanner(prefab);
          if (!node) return;
          this.applyWaveBannerAppearance(node, wave.team, entry ? entry.waveBannerIconId : 0);
          wave.setWaveBanner(node, bannerNode => {
            this.recycleWaveBanner(prefab, bannerNode);
          }, this.waveBannerTweenDuration, bannerNode => {
            this.applyWaveBannerAppearance(bannerNode, wave.team, entry ? entry.waveBannerIconId : 0);
            this.updateWaveBannerHealthBar(wave);
          });
          wave.setWaveBannerVisible(this.waveBannerVisibleByCamera);
          this.updateWaveBannerHealthBar(wave);
        }

        applyWaveBannerAppearance(node, team, iconId) {
          var params = this.getWaveBannerColorParams(team);
          var iconParams = this.getWaveBannerIconParams(node, iconId);
          var sharedMaterial = this.getWaveBannerMaterial();
          var renderers = this.getWaveBannerRenderers(node);

          for (var i = 0; i < renderers.length; i++) {
            var _renderer$sharedMater;

            var renderer = renderers[i];

            if (sharedMaterial && ((_renderer$sharedMater = renderer.sharedMaterials) == null ? void 0 : _renderer$sharedMater[0]) !== sharedMaterial) {
              renderer.setSharedMaterial(sharedMaterial, 0);
            }

            renderer.setInstancedAttribute('a_billboard_bg_color', params);
            renderer.setInstancedAttribute('a_billboard_icon_id', iconParams);
          }
        }

        getWaveBannerIconParams(node, iconId) {
          var params = this.waveBannerIconParamCache.get(node);

          if (!params) {
            params = [0, 0, 0, 0];
            this.waveBannerIconParamCache.set(node, params);
          }

          params[0] = Math.max(0, Math.floor(iconId));
          params[1] = 0;
          params[2] = 0;
          params[3] = 0;
          return params;
        }

        getWaveBannerMaterial() {
          return this.unitDatabase ? this.unitDatabase.waveBannerMaterial : null;
        }

        updateWaveBannerHealthBar(wave) {
          if (!wave) return;
          var node = wave.getWaveBannerNode();
          if (!node) return;
          var healthBars = this.getWaveBannerHealthBars(node);
          if (healthBars.length <= 0) return;
          var ratio = wave.getRuntimeHealthRatio(this.frame);

          for (var i = 0; i < healthBars.length; i++) {
            healthBars[i].setHealthRatio(ratio);
          }
        }

        getWaveBannerHealthBars(node) {
          var healthBars = this.waveBannerHealthBarCache.get(node);

          if (!healthBars) {
            healthBars = node.getComponentsInChildren(_crd && HealthBar3D === void 0 ? (_reportPossibleCrUseOfHealthBar3D({
              error: Error()
            }), HealthBar3D) : HealthBar3D);
            this.waveBannerHealthBarCache.set(node, healthBars);
          }

          return healthBars;
        }

        getWaveBannerColorParams(team) {
          var color = this.getWaveBannerBackgroundColor(team);
          var params = team === 0 ? this.waveBannerTeamAColorParams : this.waveBannerTeamBColorParams;
          params[0] = color.r / 255;
          params[1] = color.g / 255;
          params[2] = color.b / 255;
          params[3] = color.a / 255;
          return params;
        }

        getWaveBannerRenderers(node) {
          var renderers = this.waveBannerRendererCache.get(node);

          if (!renderers) {
            var allRenderers = node.getComponentsInChildren(MeshRenderer);
            renderers = [];

            for (var i = 0; i < allRenderers.length; i++) {
              var renderer = allRenderers[i];

              if (renderer.node.getComponent(_crd && HealthBar3D === void 0 ? (_reportPossibleCrUseOfHealthBar3D({
                error: Error()
              }), HealthBar3D) : HealthBar3D)) {
                continue;
              }

              renderers.push(renderer);
            }

            this.waveBannerRendererCache.set(node, renderers);
          }

          return renderers;
        }

        getWaveBannerBackgroundColor(team) {
          if (this.unitDatabase) {
            return team === 0 ? this.unitDatabase.teamAWaveBannerBackgroundColor : this.unitDatabase.teamBWaveBannerBackgroundColor;
          }

          return team === 0 ? this.fallbackTeamABannerColor : this.fallbackTeamBBannerColor;
        }

        registerWaveBannerCameraEvents() {
          this.unregisterWaveBannerCameraEvents();
          var controller = this.cinematicController;
          if (!controller || !controller.node) return;
          this.registeredCinematicController = controller;
          controller.node.on(BannerVisibilityBlockedEvent, this.onWaveBannerCameraBlockedChanged, this);
          var controllerAny = controller;

          if (typeof controllerAny.isBannerVisibilityBlocked === 'function') {
            this.waveBannerCameraBlocked = !!controllerAny.isBannerVisibilityBlocked();
          }
        }

        unregisterWaveBannerCameraEvents() {
          var controller = this.registeredCinematicController;

          if (controller && controller.node) {
            controller.node.off(BannerVisibilityBlockedEvent, this.onWaveBannerCameraBlockedChanged, this);
          }

          this.registeredCinematicController = null;
        }

        onWaveBannerCameraBlockedChanged(blocked) {
          this.waveBannerCameraBlocked = !!blocked;
          this.updateWaveBannerCameraVisibility(true);
        }

        acquireWaveBanner(prefab) {
          var pool = this.getWaveBannerPool(prefab);
          var node = pool.length > 0 ? pool.pop() : instantiate(prefab);
          node.active = true;
          return node;
        }

        recycleWaveBanner(prefab, node) {
          if (!node || !node.isValid) return;
          node.active = false;
          node.setParent(null);
          var pool = this.getWaveBannerPool(prefab);

          if (pool.indexOf(node) < 0) {
            pool.push(node);
          }
        }

        getWaveBannerPool(prefab) {
          var pool = this.waveBannerPools.get(prefab);

          if (!pool) {
            pool = [];
            this.waveBannerPools.set(prefab, pool);
          }

          return pool;
        }

        clearWaveBannerPools() {
          this.waveBannerPools.forEach(pool => {
            for (var i = 0; i < pool.length; i++) {
              var node = pool[i];

              if (node && node.isValid) {
                node.destroy();
              }
            }

            pool.length = 0;
          });
          this.waveBannerPools.clear();
        }

        spawnSquareFormationInLane(team, entry, baseZ, wave, laneId, count, aggressiveForward) {
          if (aggressiveForward === void 0) {
            aggressiveForward = false;
          }

          var width = Math.max(1, Math.floor(entry.squareFormationWidth));
          var unitSpacing = Math.max(0, entry.spaceBetweenUnit);
          var rowSpacing = Math.max(0, entry.spaceBetweenRow);
          var laneCenterX = this.getLaneCenterX(laneId);

          for (var i = 0; i < count; i++) {
            var row = Math.floor(i / width);
            var col = i % width;
            var rowCount = Math.min(width, count - row * width);
            var x = laneCenterX + (col - (rowCount - 1) * 0.5) * unitSpacing;
            var rowZOffset = row * rowSpacing;
            var baseUnitZ = team === 0 ? baseZ - rowZOffset : baseZ + rowZOffset;
            var z = baseUnitZ + this.randomRange(-this.formationZNoise, this.formationZNoise);
            this.tempSpawnPos.set(x, 0, z);
            this.spawnUnitForWave(team, entry, this.tempSpawnPos, wave, laneId, aggressiveForward);
          }
        }

        spawnCenteredRowsFormation(team, entry, baseZ, wave, count, aggressiveForward) {
          if (aggressiveForward === void 0) {
            aggressiveForward = false;
          }

          var maxPerRow = Math.max(1, Math.floor(entry.maxUnitPerRow));
          var rowSpacing = Math.max(0, entry.spaceBetweenRow);
          var unitSpacing = Math.max(0, entry.spaceBetweenUnit);
          var spawned = 0;
          var row = 0;

          while (spawned < count) {
            var remaining = count - spawned;
            var rowCount = Math.min(maxPerRow, remaining);
            var rowXPositions = this.buildCenteredRowXPositions(rowCount, row, unitSpacing);

            for (var col = 0; col < rowCount; col++) {
              var x = rowXPositions[col];
              var rowZOffset = row * rowSpacing;
              var baseUnitZ = team === 0 ? baseZ - rowZOffset : baseZ + rowZOffset;
              var z = baseUnitZ + this.randomRange(-this.formationZNoise, this.formationZNoise);
              this.tempSpawnPos.set(x, 0, z);
              this.spawnUnitForWave(team, entry, this.tempSpawnPos, wave, wave.laneId, aggressiveForward);
              spawned++;
            }

            row++;
          }
        }

        spawnUnitForWave(team, entry, pos, wave, laneId, aggressiveForward) {
          if (aggressiveForward === void 0) {
            aggressiveForward = false;
          }

          var unit = null;

          if (team === 0) {
            unit = this.spawnTeamA(entry.name, pos);
          } else {
            unit = this.spawnTeamB(entry.name, pos);
          }

          if (!unit) return;
          unit.laneId = laneId;
          unit.aggressiveForward = aggressiveForward;
          wave.addUnit(unit);
        }

        resolveSpawnLaneId(requestedLaneId) {
          if (requestedLaneId === void 0) {
            requestedLaneId = -1;
          }

          var count = this.getSafeLaneCount();

          if (requestedLaneId >= 0) {
            return this.clampLaneId(requestedLaneId);
          }

          if (this.enableLaneSpawn && this.autoSpawnRandomLane) {
            return Math.floor(Math.random() * count);
          }

          return this.clampLaneId(this.defaultSpawnLane);
        }

        getSafeLaneCount() {
          return Math.max(1, Math.floor(this.laneCount));
        }

        clampLaneId(laneId) {
          var count = this.getSafeLaneCount();
          return Math.max(0, Math.min(count - 1, Math.floor(laneId)));
        }

        getLaneCenterX(laneId) {
          var count = this.getSafeLaneCount();
          var safeLane = this.clampLaneId(laneId);
          var width = this.battleMaxX - this.battleMinX;

          if (width <= 0) {
            return 0;
          }

          var laneWidth = width / count;
          return this.battleMinX + laneWidth * (safeLane + 0.5);
        }

        getNearestLaneIdForX(x) {
          var count = this.getSafeLaneCount();
          var bestLane = 0;
          var bestDist = Infinity;

          for (var i = 0; i < count; i++) {
            var centerX = this.getLaneCenterX(i);
            var dist = Math.abs(x - centerX);

            if (dist < bestDist) {
              bestDist = dist;
              bestLane = i;
            }
          }

          return bestLane;
        }

        buildCenteredRowXPositions(rowCount, rowIndex, unitSpacing) {
          var result = this.centeredRowXBuffer;
          result.length = 0;

          if (rowCount <= 0) {
            return result;
          }

          var gap = Math.max(0, this.centerGapWidth);

          if (gap <= 0) {
            for (var col = 0; col < rowCount; col++) {
              var x = (col - (rowCount - 1) * 0.5) * unitSpacing;
              result.push(x);
            }

            return result;
          }

          var gapHalf = gap * 0.5;
          var pairIndex = 0;
          var startRightSide = rowIndex % 2 === 1;

          while (result.length < rowCount) {
            var leftX = -gapHalf - pairIndex * unitSpacing;
            var rightX = gapHalf + pairIndex * unitSpacing;

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
          var entry = this.getTeamEntry(0, unitName);

          if (!entry || !entry.prefab) {
            return null;
          }

          var unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.unitType, pos, 0, this.node, entry.maxSpeed, entry.attackRange, entry.attackIntervalMin, entry.attackIntervalMax, entry.health, entry.damage, entry.defense);

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

          this.requestBattleStatsUIRefresh();
          return unit;
        }

        spawnTeamB(unitName, pos) {
          var entry = this.getTeamEntry(1, unitName);

          if (!entry || !entry.prefab) {
            return null;
          }

          var unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.unitType, pos, 1, this.node, entry.maxSpeed, entry.attackRange, entry.attackIntervalMin, entry.attackIntervalMax, entry.health, entry.damage, entry.defense);

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

          this.requestBattleStatsUIRefresh();
          return unit;
        }

        despawnUnit(unit) {
          if (!unit) return;
          this.notifyUnitWillDespawn(unit);

          if (unit.isHero) {
            this.handleHeroDeath(unit);
            return;
          }

          var team = unit.team;
          var unitName = unit.unitTypeName;
          var entry = this.getTeamEntry(team, unitName);

          if (!entry || !entry.prefab) {
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

              this.spawner.despawnUnit(unit, entry.prefab);
              this.requestSpatialGridRebuild();
              this.requestBattleStatsUIRefresh();
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

              this.spawner.despawnUnit(unit, entry.prefab);
              this.requestSpatialGridRebuild();
              this.requestBattleStatsUIRefresh();
            }

            return;
          }
        }

        handleHeroDeath(unit) {
          var team = unit.team;

          if (team === 0 || team === 1) {
            this.heroForwardUnlocked[team] = false;
          }

          if (team === 0) {
            if (this.teamAHeroWave) {
              this.removeBattleWaveReference(this.teamAHeroWave);
              this.teamAHeroWave.releaseReferences();
              this.teamAHeroWave = null;
            }

            if (this.teamAHero === unit) {
              this.teamAHero = null;
            }

            var idx = this.teamA.indexOf(unit);

            if (idx >= 0) {
              this.teamA.splice(idx, 1);
            }

            this.aliveCount[0]--;
            this.deathCount[0]++;

            if (this.aliveCount[0] < 0) {
              this.aliveCount[0] = 0;
            }
          } else {
            if (this.teamBHeroWave) {
              this.removeBattleWaveReference(this.teamBHeroWave);
              this.teamBHeroWave.releaseReferences();
              this.teamBHeroWave = null;
            }

            if (this.teamBHero === unit) {
              this.teamBHero = null;
            }

            var _idx2 = this.teamB.indexOf(unit);

            if (_idx2 >= 0) {
              this.teamB.splice(_idx2, 1);
            }

            this.aliveCount[1]--;
            this.deathCount[1]++;

            if (this.aliveCount[1] < 0) {
              this.aliveCount[1] = 0;
            }
          }

          this.removeUnitAgentFromSimulator(unit);
          unit.resetForDespawn();
          unit.node.active = false;
          this.requestSpatialGridRebuild();
          this.requestBattleStatsUIRefresh();
        }

        removeUnitAgentFromSimulator(unit) {
          if (!this.sim || !unit || !unit.agent) return;

          if (typeof this.sim.removeAgent === 'function') {
            this.sim.removeAgent(unit.agent);
            return;
          }

          if (this.sim.agents && Array.isArray(this.sim.agents)) {
            var idx = this.sim.agents.indexOf(unit.agent);

            if (idx >= 0) {
              this.sim.agents.splice(idx, 1);
            }
          }
        }

        registerDatabaseHeroes() {
          if (!this.unitDatabase) return;
          var heroA = this.unitDatabase.getHeroEntry(0);
          var heroB = this.unitDatabase.getHeroEntry(1);
          this.registerSceneHero(heroA, 0, 'hero_a');
          this.registerSceneHero(heroB, 1, 'hero_b');
        }

        registerSceneHero(heroEntry, team, fallbackTypeName) {
          if (!heroEntry) return;
          if (!heroEntry.heroNode) return;
          var hero = heroEntry.heroNode.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);

          if (!hero) {
            return;
          }

          if (!hero.node.activeInHierarchy) return;
          hero.isHero = true;
          var props = hero.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);

          if (props) {
            props.maxHealth = heroEntry.health;
            props.health = heroEntry.health;
            props.damage = heroEntry.damage;
            props.defense = heroEntry.defense;
            props.unitType = heroEntry.unitType;
            props.resetForSpawn();
          }

          var behavior = hero.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior);

          if (behavior) {
            behavior.gameManager = this;
            behavior.resetForSpawn();
          }

          var unitTypeName = heroEntry.name && heroEntry.name.length > 0 ? heroEntry.name : fallbackTypeName;
          var forwardX = 0;
          var forwardZ = team === 0 ? 1 : -1;
          hero.moveSpeed = heroEntry.maxSpeed;
          hero.heroGuardDistance = heroEntry.guardDistance;
          hero.isSteady = true;
          hero.init(this.sim, team, unitTypeName, forwardX, forwardZ);
          this.registerHeroWave(hero, team, unitTypeName, heroEntry.unitType);

          if (team === 0) {
            this.teamAHero = hero;

            if (this.teamA.indexOf(hero) < 0) {
              this.teamA.push(hero);
              this.aliveCount[0]++;
            }
          } else {
            this.teamBHero = hero;

            if (this.teamB.indexOf(hero) < 0) {
              this.teamB.push(hero);
              this.aliveCount[1]++;
            }
          }
        }

        registerHeroWave(hero, team, unitTypeName, unitType) {
          var laneId = this.getHeroLaneId();
          var previousWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

          if (previousWave) {
            this.removeBattleWaveReference(previousWave);
            previousWave.releaseReferences();
          }

          hero.laneId = laneId;
          var wave = new (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave)(this.nextWaveId++, team, unitTypeName, unitType || (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword, 1, laneId);
          wave.addUnit(hero);

          if (team === 0) {
            this.teamAHeroWave = wave;
          } else {
            this.teamBHeroWave = wave;
          }
        }

        ensureBattleWaveRegistered(wave) {
          if (this.waves.indexOf(wave) >= 0) {
            return;
          }

          this.waves.push(wave);
        }

        removeBattleWaveReference(wave) {
          var index = this.waves.indexOf(wave);

          if (index < 0) {
            return;
          }

          this.waves.splice(index, 1);
        }

        getHeroLaneId() {
          return this.clampLaneId(Math.floor(this.getSafeLaneCount() / 2));
        }

        requestBattleStatsUIRefresh() {
          this.battleStatsUiDirty = true;
        }

        refreshBattleStatsUI(force) {
          if (force === void 0) {
            force = false;
          }

          if (!force && !this.battleStatsUiDirty) {
            return;
          }

          this.battleStatsUiDirty = false;

          if (this.teamAAliveLabel) {
            this.setLabelString(this.teamAAliveLabel, 'A Alive: ' + this.aliveCount[0]);
          }

          if (this.teamADeathLabel) {
            this.setLabelString(this.teamADeathLabel, 'A Death: ' + this.deathCount[0]);
          }

          if (this.teamBAliveLabel) {
            this.setLabelString(this.teamBAliveLabel, 'B Alive: ' + this.aliveCount[1]);
          }

          if (this.teamBDeathLabel) {
            this.setLabelString(this.teamBDeathLabel, 'B Death: ' + this.deathCount[1]);
          }

          if (this.teamAKillLabel) {
            this.setLabelString(this.teamAKillLabel, 'A Kill: ' + this.killCount[0]);
          }

          if (this.teamBKillLabel) {
            this.setLabelString(this.teamBKillLabel, 'B Kill: ' + this.killCount[1]);
          }

          if (this.teamACounterKillLabel) {
            this.setLabelString(this.teamACounterKillLabel, 'A Counter Kill: ' + this.counterKillCount[0] + ' (' + Math.round(this.getCounterKillRatio(0) * 100) + '%)');
          }

          if (this.teamBCounterKillLabel) {
            this.setLabelString(this.teamBCounterKillLabel, 'B Counter Kill: ' + this.counterKillCount[1] + ' (' + Math.round(this.getCounterKillRatio(1) * 100) + '%)');
          }

          if (this.teamACombatPointLabel) {
            this.setLabelString(this.teamACombatPointLabel, 'A CP: ' + Math.floor(this.combatPoint[0]));
          }

          if (this.teamBCombatPointLabel) {
            this.setLabelString(this.teamBCombatPointLabel, 'B CP: ' + Math.floor(this.combatPoint[1]));
          }
        }

        setLabelString(label, value) {
          if (label.string !== value) {
            label.string = value;
          }
        }

        randomRange(min, max) {
          return Math.random() * (max - min) + min;
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "unitDatabase", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cinematicController", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "useWorkerRVO", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "battleMinX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -28;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 28;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "battleMinZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -18;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 18;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "rvoUpdateFrameOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "maxRvoStepDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.05;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "visualSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 16;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridCellSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateFrameOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "useWorkerSpatialTargetQuery", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "teamAAliveLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "teamADeathLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "teamBAliveLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "teamBDeathLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "teamAKillLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "teamBKillLabel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "teamACounterKillLabel", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "teamBCounterKillLabel", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "teamACombatPointLabel", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "teamBCombatPointLabel", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "spawnImmediatelyOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "prewarmOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "spawnWaveInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "maxAutoSpawnDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "teamASpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -20;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "teamBSpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class2.prototype, "formationZNoise", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class2.prototype, "centerGapWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class2.prototype, "enableLaneSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class2.prototype, "laneCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class2.prototype, "defaultSpawnLane", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class2.prototype, "autoSpawnRandomLane", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerTweenDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerRefreshIntervalFrames", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 12;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerCamera", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class2.prototype, "enableWaveBannerCameraVisibility", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class2.prototype, "hideWaveBannerInOrbitMode", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerHideFovBelow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 35;
        }
      }), _descriptor45 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerShowFovAbove", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 38;
        }
      }), _descriptor46 = _applyDecoratedDescriptor(_class2.prototype, "circleObstacles", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor47 = _applyDecoratedDescriptor(_class2.prototype, "rectObstacles", [_dec17], {
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
//# sourceMappingURL=4c2b696cf74ad4a64312434293dff943ef04c44b.js.map