System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15", "__unresolved_16"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Color, Component, Vec3, Label, instantiate, MeshRenderer, game, profiler, director, Unit, UnitProps, RVOSimulator, RVOWorkerSimulator, ObstacleCircle, ObstacleRect, UnitSpawner, UnitBehavior, BattleSpatialGrid, BattleWave, CounterSettings, UnitFamily, BattleTelemetry, BattleUnitDatabase, HealthBar3D, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _descriptor47, _descriptor48, _descriptor49, _descriptor50, _descriptor51, _descriptor52, _descriptor53, _descriptor54, _descriptor55, _descriptor56, _descriptor57, _descriptor58, _descriptor59, _descriptor60, _descriptor61, _descriptor62, _descriptor63, _class3, _crd, ccclass, property, BannerVisibilityBlockedEvent, TopDownZoomRangeChangedEvent, BattleWaveSpawnedEvent, GameManager;

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

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTelemetry(extras) {
    _reporterNs.report("BattleTelemetry", "./BattleTelemetry", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTelemetryCounterRuleSnapshot(extras) {
    _reporterNs.report("BattleTelemetryCounterRuleSnapshot", "./BattleTelemetry", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTelemetryUnitSnapshot(extras) {
    _reporterNs.report("BattleTelemetryUnitSnapshot", "./BattleTelemetry", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTelemetryWaveSpawnDecision(extras) {
    _reporterNs.report("BattleTelemetryWaveSpawnDecision", "./BattleTelemetry", _context.meta, extras);
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
      game = _cc.game;
      profiler = _cc.profiler;
      director = _cc.director;
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
      UnitFamily = _unresolved_13.UnitFamily;
    }, function (_unresolved_14) {
      BattleTelemetry = _unresolved_14.BattleTelemetry;
    }, function (_unresolved_15) {
      BattleUnitDatabase = _unresolved_15.BattleUnitDatabase;
    }, function (_unresolved_16) {
      HealthBar3D = _unresolved_16.HealthBar3D;
    }, function (_unresolved_17) {
      _export("UnitPrefabEntry", _unresolved_17.UnitPrefabEntry);
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1e335OSdGRGLrD08aYssvKr", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Color', 'Component', 'Vec3', 'Label', 'Prefab', 'Node', 'instantiate', 'MeshRenderer', 'Material', 'game', 'profiler', 'director']);

      ({
        ccclass,
        property
      } = _decorator);
      BannerVisibilityBlockedEvent = 'battle-camera-banner-visibility-blocked';
      TopDownZoomRangeChangedEvent = 'battle-camera-topdown-zoom-range-changed';
      BattleWaveSpawnedEvent = 'battle-wave-spawned';

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(_crd && BattleUnitDatabase === void 0 ? (_reportPossibleCrUseOfBattleUnitDatabase({
        error: Error()
      }), BattleUnitDatabase) : BattleUnitDatabase), _dec3 = property(Component), _dec4 = property({
        tooltip: 'Target frame rate for mobile performance tests. Use 30, 45, or 60. Set 0 or lower to keep the engine default.'
      }), _dec5 = property({
        min: 0.1,
        tooltip: 'Global battle speed multiplier for faster telemetry tests. 1 = normal speed. Values above 1 speed up Cocos update/schedule time; RVO is sub-stepped so large dt is not simply clamped away.'
      }), _dec6 = property({
        tooltip: 'Reset the global Cocos scheduler time scale back to 1 when this GameManager is destroyed. Keep enabled unless another system owns global time scale.'
      }), _dec7 = property({
        tooltip: 'Show the built-in Cocos profiler overlay in build/preview. Keep off for normal release tests unless you need on-device FPS/drawcall stats.'
      }), _dec8 = property({
        tooltip: 'Allow URL query params ?stats=1 or ?profiler=1 to show the Cocos profiler overlay in browser builds.'
      }), _dec9 = property({
        tooltip: 'Check battle winner rules. Hero killed always resolves the battle. Optional CP fallback is controlled separately.'
      }), _dec10 = property({
        tooltip: 'Fallback winner rule for economy-only tests: if enabled, a team loses only when it has no non-hero units alive and can no longer afford any valid spawn entry.'
      }), _dec11 = property({
        min: 1,
        tooltip: 'Frames between CP fallback winner checks. Hero-death winner is event-driven and does not wait for this interval.'
      }), _dec12 = property({
        tooltip: 'Collect aggregate battle telemetry and export a JSON report when the battle winner rule is reached.'
      }), _dec13 = property({
        tooltip: 'Automatically download the battle telemetry JSON in browser preview/build when the temporary winner condition is reached.'
      }), _dec14 = property({
        tooltip: 'Reload the browser page after telemetry export. This does not store reports in localStorage or skip per-match downloads.'
      }), _dec15 = property({
        min: 0,
        tooltip: 'Seconds to wait after triggering telemetry JSON download before reloading the browser page.'
      }), _dec16 = property({
        tooltip: 'Also print the full telemetry object to console. The report is always kept on window.__battleTelemetryReport when available.'
      }), _dec17 = property({
        tooltip: 'Output file prefix for downloaded battle telemetry reports.'
      }), _dec18 = property({
        min: 1,
        tooltip: 'Frames between diagnostic battle snapshots in telemetry. These snapshots record team, hero, wave, and lane state for post-match diagnosis.'
      }), _dec19 = property({
        min: 0,
        tooltip: 'Maximum diagnostic snapshots stored in one telemetry report. Set 0 to disable snapshots while keeping aggregate telemetry.'
      }), _dec20 = property({
        min: 0,
        tooltip: 'Maximum chronological diagnostic events stored in one telemetry report. Includes spawn decisions, hero damage, area damage, and kills.'
      }), _dec21 = property(Label), _dec22 = property(Label), _dec23 = property(Label), _dec24 = property(Label), _dec25 = property(Label), _dec26 = property(Label), _dec27 = property(Label), _dec28 = property(Label), _dec29 = property(Label), _dec30 = property(Label), _dec31 = property({
        min: 1,
        tooltip: 'Frames between safety wave-banner holder refresh checks. Set to 1 to refresh every frame.'
      }), _dec32 = property(Camera), _dec33 = property({
        type: [_crd && ObstacleCircle === void 0 ? (_reportPossibleCrUseOfObstacleCircle({
          error: Error()
        }), ObstacleCircle) : ObstacleCircle]
      }), _dec34 = property({
        type: [_crd && ObstacleRect === void 0 ? (_reportPossibleCrUseOfObstacleRect({
          error: Error()
        }), ObstacleRect) : ObstacleRect]
      }), _dec(_class = (_class2 = (_class3 = class GameManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "unitDatabase", _descriptor, this);

          _initializerDefineProperty(this, "cinematicController", _descriptor2, this);

          _initializerDefineProperty(this, "useWorkerRVO", _descriptor3, this);

          _initializerDefineProperty(this, "targetFrameRate", _descriptor4, this);

          _initializerDefineProperty(this, "battleTimeScale", _descriptor5, this);

          _initializerDefineProperty(this, "resetBattleTimeScaleOnDestroy", _descriptor6, this);

          _initializerDefineProperty(this, "showCocosProfilerStats", _descriptor7, this);

          _initializerDefineProperty(this, "allowProfilerStatsQueryParam", _descriptor8, this);

          _initializerDefineProperty(this, "enableBattleWinnerCheck", _descriptor9, this);

          _initializerDefineProperty(this, "enableNoAffordableSpawnWinnerFallback", _descriptor10, this);

          _initializerDefineProperty(this, "battleWinnerCheckIntervalFrames", _descriptor11, this);

          _initializerDefineProperty(this, "enableBattleTelemetry", _descriptor12, this);

          _initializerDefineProperty(this, "downloadBattleTelemetryOnEnd", _descriptor13, this);

          _initializerDefineProperty(this, "reloadPageAfterBattleTelemetryExport", _descriptor14, this);

          _initializerDefineProperty(this, "battleTelemetryReloadDelaySeconds", _descriptor15, this);

          _initializerDefineProperty(this, "logBattleTelemetryOnEnd", _descriptor16, this);

          _initializerDefineProperty(this, "battleTelemetryFilePrefix", _descriptor17, this);

          _initializerDefineProperty(this, "battleTelemetrySnapshotIntervalFrames", _descriptor18, this);

          _initializerDefineProperty(this, "battleTelemetryMaxSnapshots", _descriptor19, this);

          _initializerDefineProperty(this, "battleTelemetryMaxDiagnosticEvents", _descriptor20, this);

          this.teamAHero = null;
          this.teamBHero = null;

          _initializerDefineProperty(this, "battleMinX", _descriptor21, this);

          _initializerDefineProperty(this, "battleMaxX", _descriptor22, this);

          _initializerDefineProperty(this, "battleMinZ", _descriptor23, this);

          _initializerDefineProperty(this, "battleMaxZ", _descriptor24, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor25, this);

          _initializerDefineProperty(this, "rvoUpdateFrameOffset", _descriptor26, this);

          _initializerDefineProperty(this, "maxRvoStepDeltaTime", _descriptor27, this);

          this.frame = 0;

          _initializerDefineProperty(this, "visualSmooth", _descriptor28, this);

          _initializerDefineProperty(this, "spatialGridCellSize", _descriptor29, this);

          _initializerDefineProperty(this, "spatialGridUpdateInterval", _descriptor30, this);

          _initializerDefineProperty(this, "spatialGridUpdateFrameOffset", _descriptor31, this);

          _initializerDefineProperty(this, "useWorkerSpatialTargetQuery", _descriptor32, this);

          this.spatialGrid = new (_crd && BattleSpatialGrid === void 0 ? (_reportPossibleCrUseOfBattleSpatialGrid({
            error: Error()
          }), BattleSpatialGrid) : BattleSpatialGrid)();

          _initializerDefineProperty(this, "teamAAliveLabel", _descriptor33, this);

          _initializerDefineProperty(this, "teamADeathLabel", _descriptor34, this);

          _initializerDefineProperty(this, "teamBAliveLabel", _descriptor35, this);

          _initializerDefineProperty(this, "teamBDeathLabel", _descriptor36, this);

          _initializerDefineProperty(this, "teamAKillLabel", _descriptor37, this);

          _initializerDefineProperty(this, "teamBKillLabel", _descriptor38, this);

          _initializerDefineProperty(this, "teamACounterKillLabel", _descriptor39, this);

          _initializerDefineProperty(this, "teamBCounterKillLabel", _descriptor40, this);

          _initializerDefineProperty(this, "teamACombatPointLabel", _descriptor41, this);

          _initializerDefineProperty(this, "teamBCombatPointLabel", _descriptor42, this);

          this.aliveCount = [0, 0];
          this.deathCount = [0, 0];
          this.killCount = [0, 0];
          this.counterKillCount = [0, 0];
          this.combatPoint = [0, 0];
          this.initialCombatPoint = [0, 0];
          this.battleWinnerResolved = false;
          this.battleWinnerTeam = -1;
          this.battleLoserTeam = -1;
          this.battleWinnerReason = '';

          _initializerDefineProperty(this, "enableAutoSpawn", _descriptor43, this);

          _initializerDefineProperty(this, "spawnImmediatelyOnStart", _descriptor44, this);

          _initializerDefineProperty(this, "prewarmOnStart", _descriptor45, this);

          _initializerDefineProperty(this, "spawnWaveInterval", _descriptor46, this);

          _initializerDefineProperty(this, "maxAutoSpawnDeltaTime", _descriptor47, this);

          _initializerDefineProperty(this, "teamASpawnZ", _descriptor48, this);

          _initializerDefineProperty(this, "teamBSpawnZ", _descriptor49, this);

          _initializerDefineProperty(this, "formationZNoise", _descriptor50, this);

          _initializerDefineProperty(this, "centerGapWidth", _descriptor51, this);

          _initializerDefineProperty(this, "enableLaneSpawn", _descriptor52, this);

          _initializerDefineProperty(this, "laneCount", _descriptor53, this);

          _initializerDefineProperty(this, "defaultSpawnLane", _descriptor54, this);

          _initializerDefineProperty(this, "autoSpawnRandomLane", _descriptor55, this);

          _initializerDefineProperty(this, "waveBannerRefreshIntervalFrames", _descriptor56, this);

          _initializerDefineProperty(this, "waveBannerCamera", _descriptor57, this);

          _initializerDefineProperty(this, "enableWaveBannerCameraVisibility", _descriptor58, this);

          _initializerDefineProperty(this, "hideWaveBannerInOrbitMode", _descriptor59, this);

          _initializerDefineProperty(this, "waveBannerHideFovBelow", _descriptor60, this);

          _initializerDefineProperty(this, "waveBannerShowFovAbove", _descriptor61, this);

          this.spawnWaveTimer = 0;

          _initializerDefineProperty(this, "circleObstacles", _descriptor62, this);

          _initializerDefineProperty(this, "rectObstacles", _descriptor63, this);

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

          this.refreshLaneBeforeWaveForward = wave => {
            this.refreshDynamicLaneForWave(wave, true);
          };

          this.waveBannerPools = new Map();
          this.registeredCinematicController = null;
          this.registeredTopDownCameraDragNode = null;
          this.waveBannerCameraBlocked = false;
          this.waveBannerVisibleByCamera = true;
          this.waveBannerVisibilityInitialized = false;
          this.waveBannerCameraVisibilityDirty = true;
          this.spatialGridDirty = true;
          this.battleStatsUiDirty = true;
          this.waveBannerTeamAColorParams = [0, 0, 0, 0];
          this.waveBannerTeamBColorParams = [0, 0, 0, 0];
          this.waveBannerRendererCache = new WeakMap();
          this.waveBannerIconParamCache = new WeakMap();
          this.waveBannerHealthBarCache = new WeakMap();
          this.fallbackTeamABannerColor = new Color(0, 70, 255, 255);
          this.fallbackTeamBBannerColor = new Color(255, 0, 0, 255);
          this.battleTelemetry = new (_crd && BattleTelemetry === void 0 ? (_reportPossibleCrUseOfBattleTelemetry({
            error: Error()
          }), BattleTelemetry) : BattleTelemetry)();
          this.battleElapsedTime = 0;
        }

        start() {
          GameManager.instance = this;
          this.applyTargetFrameRate();
          this.installBattleTimeScaleHook();
          this.applyProfilerStats();
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
          this.battleElapsedTime = 0;
          this.resetCombatPoint();
          this.createSimulator();
          this.buildPrefabMaps();
          this.resetBattleTelemetry();
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

          for (const ob of this.circleObstacles) {
            const p = ob.node.worldPosition;
            this.sim.addCircleObstacle(p.x, p.z, ob.radius);
          }

          for (const ob of this.rectObstacles) {
            const p = ob.node.worldPosition;
            const angle = ob.node.eulerAngles.y * Math.PI / 180;
            this.sim.addRectObstacle(p.x, p.z, ob.halfWidth, ob.halfHeight, angle);
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

          if (this.resetBattleTimeScaleOnDestroy) {
            this.uninstallBattleTimeScaleHook();
          }

          this.unregisterWaveBannerCameraEvents();

          if (this.sim && this.sim.destroy) {
            this.sim.destroy();
          }

          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

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
          const aInitial = this.unitDatabase ? this.unitDatabase.getInitialCombatPoint(0) : 0;
          const bInitial = this.unitDatabase ? this.unitDatabase.getInitialCombatPoint(1) : 0;
          this.initialCombatPoint[0] = Math.max(0, aInitial);
          this.initialCombatPoint[1] = Math.max(0, bInitial);
          this.combatPoint[0] = this.initialCombatPoint[0];
          this.combatPoint[1] = this.initialCombatPoint[1];
          this.battleWinnerResolved = false;
          this.battleWinnerTeam = -1;
          this.battleLoserTeam = -1;
          this.battleWinnerReason = '';
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

        applyTargetFrameRate() {
          const fps = Math.floor(this.targetFrameRate);
          if (fps <= 0) return;
          game.frameRate = fps;
        }

        getSafeBattleTimeScale() {
          if (typeof this.battleTimeScale !== 'number' || !isFinite(this.battleTimeScale)) {
            return 1;
          }

          return Math.max(0.1, this.battleTimeScale);
        }

        installBattleTimeScaleHook() {
          GameManager.directorTimeScaleOwner = this;

          if (GameManager.originalDirectorTick) {
            return;
          }

          const originalTick = director.tick.bind(director);
          GameManager.originalDirectorTick = originalTick;

          director.tick = deltaTime => {
            const owner = GameManager.directorTimeScaleOwner;
            const scale = owner && owner.isValid ? owner.getSafeBattleTimeScale() : 1;
            originalTick(deltaTime * scale);
          };
        }

        uninstallBattleTimeScaleHook() {
          if (GameManager.directorTimeScaleOwner === this) {
            GameManager.directorTimeScaleOwner = null;
          }

          if (!GameManager.originalDirectorTick) {
            return;
          }

          director.tick = GameManager.originalDirectorTick;
          GameManager.originalDirectorTick = null;
        }

        applyProfilerStats() {
          const queryState = this.getProfilerStatsQueryState();

          if (this.showCocosProfilerStats || queryState === true) {
            profiler.showStats();
            return;
          }

          if (queryState === false) {
            profiler.hideStats();
          }
        }

        getProfilerStatsQueryState() {
          var _ref, _params$get;

          if (!this.allowProfilerStatsQueryParam) return null;
          if (typeof window === 'undefined') return null;
          const params = new URLSearchParams(window.location.search);
          const value = (_ref = (_params$get = params.get('stats')) != null ? _params$get : params.get('profiler')) != null ? _ref : params.get('showStats');
          if (value === null) return null;
          const normalized = value.trim().toLowerCase();

          if (normalized === '1' || normalized === 'true' || normalized === 'on') {
            return true;
          }

          if (normalized === '0' || normalized === 'false' || normalized === 'off') {
            return false;
          }

          return null;
        }

        update(deltaTime) {
          this.frame++;
          this.battleElapsedTime += deltaTime;
          (_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit).visualLerpT = 1 - Math.exp(-this.visualSmooth * deltaTime);

          if (this.shouldRunFrameInterval(this.updateInterval, this.rvoUpdateFrameOffset)) {
            this.stepRvoSimulation(deltaTime);
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
          this.recordBattleTelemetrySnapshotIfNeeded();
          this.processBattleWinnerCondition();
          this.refreshBattleStatsUI();
        }

        shouldRunFrameInterval(interval, offset = 0) {
          const safeInterval = Math.max(1, Math.floor(interval));
          const phase = (Math.floor(offset) % safeInterval + safeInterval) % safeInterval;
          return (this.frame + phase) % safeInterval === 0;
        }

        stepRvoSimulation(deltaTime) {
          if (!this.sim || typeof this.sim.step !== 'function') {
            return;
          }

          if (typeof deltaTime !== 'number' || !isFinite(deltaTime) || deltaTime <= 0) {
            return;
          }

          const maxStep = Math.max(0.001, this.maxRvoStepDeltaTime);
          this.sim.step(deltaTime, maxStep);
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

          if (counter && !killer.isHero && !victim.isHero) {
            const damageMul = counter.getDamageMultiplier(killer.props.family, victim.props.family);
            isCounterKill = damageMul > 1.0001;
          }

          if (isCounterKill) {
            this.counterKillCount[killerTeam]++;
          }

          if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordKill(killer, victim, isCounterKill, this.frame, this.battleElapsedTime);
          }

          if (!killer.isHero) {
            this.addCombatPointFromVictim(killer, victim, isCounterKill);
          }

          this.requestBattleStatsUIRefresh();
        }

        reportDamage(attacker, victim, damage, actualDamage, isCounterDamage, isAreaDamage = false) {
          if (!this.enableBattleTelemetry) return;
          this.battleTelemetry.recordDamage(attacker, victim, damage, actualDamage, isCounterDamage, isAreaDamage, this.frame, this.battleElapsedTime);
        }

        onWaveCombatStarted(unit, enemy = null, useInitialForwardGate = true) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return;
          if (wave.isDead()) return;

          if (!this.shouldUseSoloAggressiveCombat(wave, unit, enemy) && !this.shouldDelayInitialForwardCombat(wave, unit, enemy, useInitialForwardGate)) {
            wave.enterCombatMode();
          }

          const enemyWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(enemy);

          if (!enemyWave || enemyWave === wave || enemyWave.isDead()) {
            return;
          }

          if (!this.shouldUseSoloAggressiveCombat(enemyWave, enemy, unit) && !this.shouldDelayInitialForwardCombat(enemyWave, enemy, unit, useInitialForwardGate)) {
            enemyWave.enterCombatMode();
          }
        }

        shouldUseSoloAggressiveSkirmish(unit, enemy) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return false;
          if (wave.isDead()) return false;
          return this.shouldUseSoloAggressiveCombat(wave, unit, enemy);
        }

        shouldUseSoloAggressiveCombat(wave, unit, enemy) {
          if (!wave.isAggressiveForwardMode()) return false;
          if (!unit || !enemy) return false;

          if (!unit.onForward && !unit.isSoloAggressiveSkirmishActive()) {
            return false;
          }

          const unitLane = this.getCurrentLaneIdForUnit(unit);
          const enemyLane = this.getCurrentLaneIdForUnit(enemy);
          if (unitLane < 0 || enemyLane < 0) return false;

          if (unitLane !== enemyLane) {
            return true;
          }

          return this.isEnemyOutsideUnitAttackRange(unit, enemy);
        }

        isEnemyOutsideUnitAttackRange(unit, enemy) {
          if (!unit.agent || !enemy.agent) return false;
          const dx = enemy.agent.pos.x - unit.agent.pos.x;
          const dz = enemy.agent.pos.z - unit.agent.pos.z;
          const range = Math.max(0, unit.attackRange) + Math.max(0, unit.radius) + Math.max(0, enemy.radius);
          return dx * dx + dz * dz > range * range + 0.0001;
        }

        getCurrentLaneIdForUnit(unit) {
          if (!unit) return -1;

          if (unit.agent) {
            return this.getNearestLaneIdForX(unit.agent.pos.x);
          }

          if (unit.node && unit.node.isValid) {
            return this.getNearestLaneIdForX(unit.node.worldPosition.x);
          }

          return unit.laneId >= 0 ? this.clampLaneId(unit.laneId) : -1;
        }

        shouldResumeSoloForwardAfterAggressiveSkirmish(unit) {
          if (!unit) return false;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return false;
          if (wave.isDead()) return false;
          if (!wave.isAggressiveForwardMode()) return false;
          return unit.isSoloAggressiveSkirmishActive() && !unit.onForward && !unit.onBusy && !unit.hasValidEnemyTarget();
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

          const aliveCount = wave.getRuntimeAliveCount(this.frame);
          const threshold = Math.min(aliveCount, wave.getInitialForwardCombatReleaseThreshold());
          if (threshold <= 1) return false;
          return wave.getEngagedCountIncluding(unit) < threshold;
        }

        onWaveForwardTargetFound(unit, target) {
          if (!unit || !target) return false;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
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
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return null;
          return wave.findSharedTargetForUnit(unit);
        }

        getMajorityLaneIdForWave(wave) {
          if (!wave) return -1;
          const laneCount = this.getSafeLaneCount();
          const counts = this.laneVoteCounts;
          counts.length = laneCount;

          for (let i = 0; i < laneCount; i++) {
            counts[i] = 0;
          }

          let counted = 0;
          let sumX = 0;

          for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];
            if (!this.isAliveUnit(unit)) continue;
            const unitX = unit.agent ? unit.agent.pos.x : unit.node.worldPosition.x;
            const laneId = this.getNearestLaneIdForX(unitX);
            counts[laneId]++;
            counted++;
            sumX += unitX;
          }

          if (counted <= 0) return -1;
          let bestCount = 0;

          for (let i = 0; i < laneCount; i++) {
            if (counts[i] > bestCount) {
              bestCount = counts[i];
            }
          }

          if (bestCount <= 0) return -1;
          const currentLane = wave.laneId >= 0 ? this.clampLaneId(wave.laneId) : -1;

          if (currentLane >= 0 && counts[currentLane] === bestCount) {
            return currentLane;
          }

          const averageX = sumX / counted;
          let bestLane = -1;
          let bestCenterDistance = Infinity;

          for (let i = 0; i < laneCount; i++) {
            if (counts[i] !== bestCount) continue;
            const centerDistance = Math.abs(averageX - this.getLaneCenterX(i));

            if (centerDistance < bestCenterDistance) {
              bestCenterDistance = centerDistance;
              bestLane = i;
            }
          }

          return bestLane;
        }

        processDynamicWaveLanes() {
          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            this.refreshDynamicLaneForWave(wave);
          }

          this.refreshDynamicLaneForWave(this.teamAHeroWave);
          this.refreshDynamicLaneForWave(this.teamBHeroWave);
        }

        processWaveForwardSearches() {
          for (let i = 0; i < this.waves.length; i++) {
            this.searchForwardWaveTarget(this.waves[i]);
          }
        }

        searchForwardWaveTarget(wave) {
          if (!wave) return;
          if (!wave.isForwardMode()) return;
          if (wave.isDeadRuntime(this.frame)) return;
          let scanner = wave.getForwardScanner();
          if (!scanner) return;

          if (scanner.hasReachedEnemyHeroLine()) {
            const heroTarget = scanner.getEnemyHeroTarget();

            if (heroTarget) {
              this.onWaveForwardTargetFound(scanner, heroTarget);
            }

            return;
          }

          if (wave.isAggressiveForwardMode()) {
            const heroTarget = scanner.getEnemyHeroTarget();

            if (heroTarget && this.shouldReleaseAggressiveForwardHeroTarget(scanner, heroTarget)) {
              this.onWaveForwardTargetFound(scanner, heroTarget);
            }

            if (!this.shouldRunFrameInterval(wave.getTargetSearchIntervalFrames(), wave.id)) {
              return;
            }

            scanner = wave.getForwardScanner(true);
            if (!scanner) return;
            const sameLaneTarget = scanner.findForwardSearchTarget(true);

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
          const target = scanner.findForwardSearchTarget(false);

          if (target && this.shouldReleaseNormalForwardTarget(scanner, target)) {
            this.onWaveForwardTargetFound(scanner, target);
          }
        }

        shouldReleaseNormalForwardTarget(scanner, target) {
          if (!scanner || !target) return false;
          if (scanner.laneId < 0) return false;
          if (target.laneId < 0) return false;
          const scannerLane = this.clampLaneId(scanner.laneId);
          const targetLane = this.clampLaneId(target.laneId);
          const laneDistance = Math.abs(scannerLane - targetLane);

          if (laneDistance > 1) {
            return false;
          }

          return scanner.hasPassedForwardTarget(target);
        }

        shouldReleaseAggressiveForwardHeroTarget(scanner, target) {
          if (!target.isHero) return false;
          if (!scanner.agent || !target.agent) return false;
          const dx = target.agent.pos.x - scanner.agent.pos.x;
          const dz = target.agent.pos.z - scanner.agent.pos.z;
          const range = Math.max(0, scanner.targetSearchRange);

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
          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
              continue;
            }

            wave.refreshInitialForwardCombatGate();
            wave.tryResumeForward(this.refreshLaneBeforeWaveForward);
          }
        }

        processWaveBanners() {
          const bannerInterval = this.shouldRunFrameInterval(this.waveBannerRefreshIntervalFrames, 0);

          if (this.waveBannerCameraVisibilityDirty || bannerInterval) {
            this.updateWaveBannerCameraVisibility(false);
          }

          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
              continue;
            }

            if (!this.shouldRunFrameInterval(this.waveBannerRefreshIntervalFrames, wave.id + 1)) {
              continue;
            }

            wave.refreshWaveBanner();
            this.updateWaveBannerHealthBar(wave);
          }
        }

        updateWaveBannerCameraVisibility(force) {
          const visible = this.resolveWaveBannerCameraVisibility();

          if (!force && this.waveBannerVisibilityInitialized && visible === this.waveBannerVisibleByCamera) {
            this.waveBannerCameraVisibilityDirty = false;
            return;
          }

          this.waveBannerVisibilityInitialized = true;
          this.waveBannerVisibleByCamera = visible;
          this.waveBannerCameraVisibilityDirty = false;

          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

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

          const topDownVisibility = this.resolveTopDownZoomBannerVisibility();

          if (topDownVisibility !== null) {
            return topDownVisibility;
          }

          const camera = this.resolveWaveBannerCamera();

          if (!camera) {
            return true;
          }

          const fov = camera.fov;
          const hideFov = Math.max(0, this.waveBannerHideFovBelow);
          const showFov = Math.max(hideFov, this.waveBannerShowFovAbove);

          if (!this.waveBannerVisibilityInitialized) {
            return fov > hideFov;
          }

          if (this.waveBannerVisibleByCamera) {
            return fov > hideFov;
          }

          return fov >= showFov;
        }

        resolveTopDownZoomBannerVisibility() {
          const controller = this.cinematicController;
          const topDownCameraDrag = controller && controller.topDownCameraDrag ? controller.topDownCameraDrag : null;

          if (!topDownCameraDrag) {
            return null;
          }

          if (typeof topDownCameraDrag.getTargetFov !== 'function' || typeof topDownCameraDrag.getMinFov !== 'function' || typeof topDownCameraDrag.getMaxFov !== 'function') {
            return null;
          }

          const targetFov = topDownCameraDrag.getTargetFov();
          const minFov = topDownCameraDrag.getMinFov();
          const maxFov = topDownCameraDrag.getMaxFov();

          if (typeof targetFov !== 'number' || typeof minFov !== 'number' || typeof maxFov !== 'number') {
            return null;
          }

          const epsilon = 0.001;

          if (targetFov <= minFov + epsilon) {
            return false;
          }

          if (targetFov >= maxFov - epsilon) {
            return true;
          }

          if (!this.waveBannerVisibilityInitialized) {
            return true;
          }

          return this.waveBannerVisibleByCamera;
        }

        shouldShowUnitHealthBars() {
          if (!this.enableWaveBannerCameraVisibility) {
            return false;
          }

          if (!this.waveBannerVisibilityInitialized) {
            return !this.resolveWaveBannerCameraVisibility();
          }

          return !this.waveBannerVisibleByCamera;
        }

        resolveWaveBannerCamera() {
          if (this.waveBannerCamera) {
            return this.waveBannerCamera;
          }

          const controller = this.cinematicController;

          if (controller && controller.mainCamera) {
            return controller.mainCamera;
          }

          return null;
        }

        refreshDynamicLaneForWave(wave, force = false) {
          if (!wave) return;
          if (wave.isDeadRuntime(this.frame)) return;
          if (wave.hasBackToLaneUnits()) return;
          const interval = wave.getTargetSearchIntervalFrames();
          const offset = wave.id + Math.floor(interval / 2); // Lane is strategic metadata only. Stagger updates by wave
          // and away from forward scans for the same wave.

          if (!force && !this.shouldRunFrameInterval(interval, offset)) {
            return;
          }

          const laneId = this.getMajorityLaneIdForWave(wave);

          if (laneId >= 0 && laneId !== wave.laneId) {
            wave.setLaneId(laneId);
          }
        }

        pruneDeadWaves() {
          for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];
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
          const hero = team === 0 ? this.teamAHero : this.teamBHero;

          if (!this.isAliveUnit(hero)) {
            return;
          }

          if (this.heroForwardUnlocked[team]) {
            return;
          }

          if (this.canAffordAnyStandaloneSpawnEntry(team)) {
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
          const laneId = this.getHeroLaneId();
          let heroWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

          if (!heroWave || heroWave.isDead()) {
            this.registerHeroWave(hero, team, hero.unitTypeName, hero.props ? hero.props.family : (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Sword, hero.props ? hero.props.tier : 1);
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
          const enemyTeam = heroTeam === 0 ? 1 : 0;

          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== enemyTeam) continue;
            if (wave.isDead()) continue;
            if (wave.hasEngagedRuntime(this.frame)) continue;
            wave.forceForwardMode();
          }
        }

        hasAliveNonHeroUnit(team) {
          const units = team === 0 ? this.teamA : this.teamB;

          for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (!unit) continue;
            if (unit.isHero) continue;
            if (!this.isAliveUnit(unit)) continue;
            return true;
          }

          return false;
        }

        hasAliveWave(team) {
          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDead()) continue;
            return true;
          }

          return false;
        }

        canAffordAnySpawnEntry(team) {
          const entries = this.getDatabaseTeamEntries(team);

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.isValidSpawnEntry(entry)) continue;

            if (this.canAffordEntry(team, entry)) {
              return true;
            }
          }

          return false;
        }

        canAffordAnyStandaloneSpawnEntry(team) {
          const entries = this.getDatabaseTeamEntries(team);

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.isValidSpawnEntry(entry)) continue;
            if (!this.isStandaloneSpawnEntry(entry)) continue;

            if (this.canAffordEntry(team, entry)) {
              return true;
            }
          }

          return false;
        }

        isStandaloneSpawnEntry(entry) {
          if (!entry) return false;
          return entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer && entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk;
        }

        resetBattleTelemetry() {
          this.battleTelemetry.reset(this.enableBattleTelemetry, this.createBattleTelemetryStartConfig());
          this.battleTelemetry.configureDiagnostics(this.battleTelemetryMaxSnapshots, this.battleTelemetryMaxDiagnosticEvents);
        }

        recordBattleTelemetryWaveSpawnDecision(decision) {
          if (!this.enableBattleTelemetry) return;
          this.battleTelemetry.recordWaveSpawnDecision(decision);
        }

        getBattleElapsedTime() {
          return this.battleElapsedTime;
        }

        recordBattleTelemetrySnapshotIfNeeded() {
          if (!this.enableBattleTelemetry) return;
          if (!this.battleTelemetry.isEnabled()) return;

          if (!this.shouldRunFrameInterval(this.battleTelemetrySnapshotIntervalFrames)) {
            return;
          }

          this.battleTelemetry.recordSnapshot(this.createBattleTelemetrySnapshot());
        }

        createBattleTelemetrySnapshot() {
          return {
            frame: this.frame,
            time: this.battleElapsedTime,
            teams: [this.createBattleTelemetryTeamSnapshot(0), this.createBattleTelemetryTeamSnapshot(1)]
          };
        }

        createBattleTelemetryTeamSnapshot(team) {
          const waves = [];

          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDeadRuntime(this.frame)) continue;
            waves.push(this.createBattleTelemetryWaveSnapshot(wave));
          }

          return {
            team,
            combatPoint: this.combatPoint[team] || 0,
            aliveCount: this.aliveCount[team] || 0,
            waveCount: waves.length,
            heroHealthRatio: this.getBattleTelemetryHeroHealthRatio(team),
            killCount: this.killCount[team] || 0,
            counterKillCount: this.counterKillCount[team] || 0,
            totalDamage: this.battleTelemetry.getTotalDamage(team),
            totalHeroDamage: this.battleTelemetry.getTotalHeroDamage(team),
            waves
          };
        }

        createBattleTelemetryWaveSnapshot(wave) {
          var _wave$family;

          let busyCount = 0;
          let targetCount = 0;
          let forwardCount = 0;

          for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];
            if (!this.isAliveUnit(unit)) continue;
            if (unit.onBusy) busyCount++;
            if (unit.hasValidEnemyTarget()) targetCount++;
            if (unit.onForward) forwardCount++;
          }

          return {
            waveId: wave.id,
            team: wave.team,
            laneId: wave.laneId,
            unitName: wave.unitName,
            family: wave.family,
            familyName: (_wave$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family : String(wave.family),
            tier: wave.tier,
            totalCount: wave.totalCount,
            aliveCount: wave.getRuntimeAliveCount(this.frame),
            busyCount,
            targetCount,
            forwardCount,
            healthRatio: wave.getRuntimeHealthRatio(this.frame),
            forwardMode: wave.isForwardMode(),
            aggressiveForward: wave.isAggressiveForwardMode()
          };
        }

        getBattleTelemetryHeroHealthRatio(team) {
          const hero = team === 0 ? this.teamAHero : this.teamBHero;
          if (!this.isAliveUnit(hero)) return 0;
          if (!hero.props) return 0;
          return hero.props.getHealthRatio();
        }

        processBattleWinnerCondition(force = false) {
          if (!this.enableBattleWinnerCheck) return;
          if (this.hasBattleWinner()) return;
          if (!this.enableNoAffordableSpawnWinnerFallback) return;
          if (!this.isCombatPointEnabled()) return;

          if (!force && !this.shouldRunFrameInterval(this.battleWinnerCheckIntervalFrames)) {
            return;
          }

          const teamAHasTroops = this.getAliveNonHeroUnitCount(0) > 0;
          const teamBHasTroops = this.getAliveNonHeroUnitCount(1) > 0;
          const teamACanSpawn = teamAHasTroops ? this.canAffordAnySpawnEntry(0) : this.canAffordAnyStandaloneSpawnEntry(0);
          const teamBCanSpawn = teamBHasTroops ? this.canAffordAnySpawnEntry(1) : this.canAffordAnyStandaloneSpawnEntry(1);
          const teamAEliminated = !teamACanSpawn && !teamAHasTroops;
          const teamBEliminated = !teamBCanSpawn && !teamBHasTroops;

          if (!teamAEliminated && !teamBEliminated) {
            return;
          }

          const loserTeam = teamAEliminated && teamBEliminated ? -1 : teamAEliminated ? 0 : 1;
          const winnerTeam = loserTeam < 0 ? -1 : loserTeam === 0 ? 1 : 0;
          const reason = 'team-eliminated-and-cannot-afford-spawn';
          this.resolveBattleWinner(winnerTeam, loserTeam, reason);
        }

        getAliveNonHeroUnitCount(team) {
          const units = team === 0 ? this.teamA : team === 1 ? this.teamB : null;
          if (!units) return 0;
          let count = 0;

          for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (!this.isAliveUnit(unit)) continue;
            if (unit.isHero) continue;
            count++;
          }

          return count;
        }

        resolveBattleWinner(winnerTeam, loserTeam, reason) {
          if (!this.enableBattleWinnerCheck) return;
          if (this.hasBattleWinner()) return;
          this.battleWinnerTeam = winnerTeam;
          this.battleLoserTeam = loserTeam;
          this.battleWinnerReason = reason;
          this.battleWinnerResolved = true;
          console.log(`[BattleWinner] winnerTeam=${winnerTeam}, ` + `loserTeam=${loserTeam}, reason=${reason}`);

          if (!this.enableBattleTelemetry || !this.battleTelemetry.isEnabled() || this.battleTelemetry.hasEnded()) {
            return;
          }

          this.battleTelemetry.recordFinalSnapshot(this.createBattleTelemetrySnapshot());
          const report = this.battleTelemetry.finish(winnerTeam, loserTeam, reason, this.frame, this.battleElapsedTime, this.combatPoint, this.aliveCount, this.deathCount, this.killCount, this.counterKillCount);
          this.battleTelemetry.exportReport(report, this.battleTelemetryFilePrefix, this.downloadBattleTelemetryOnEnd, this.logBattleTelemetryOnEnd);
          this.scheduleBattleTelemetryPageReload();
        }

        hasBattleWinner() {
          return this.battleWinnerResolved;
        }

        scheduleBattleTelemetryPageReload() {
          if (!this.reloadPageAfterBattleTelemetryExport) return;
          if (!this.enableBattleTelemetry) return;
          if (typeof window === 'undefined') return;
          if (!window.location) return;
          const delayMs = Math.max(0, this.battleTelemetryReloadDelaySeconds) * 1000;
          console.log(`[BattleTelemetry] reload page in ` + `${(delayMs / 1000).toFixed(2)}s.`);
          window.setTimeout(() => {
            window.location.reload();
          }, delayMs);
        }

        createBattleTelemetryStartConfig() {
          return {
            startedAt: new Date().toISOString(),
            battleBounds: {
              minX: this.battleMinX,
              maxX: this.battleMaxX,
              minZ: this.battleMinZ,
              maxZ: this.battleMaxZ
            },
            laneCount: this.getSafeLaneCount(),
            initialCombatPoint: [this.initialCombatPoint[0], this.initialCombatPoint[1]],
            unitStats: this.createBattleTelemetryUnitStatsSnapshot(),
            counterRules: this.createBattleTelemetryCounterRuleSnapshot()
          };
        }

        createBattleTelemetryUnitStatsSnapshot() {
          const result = [];

          for (let team = 0; team <= 1; team++) {
            const entries = this.getDatabaseTeamEntries(team);

            for (let i = 0; i < entries.length; i++) {
              var _entry$family;

              const entry = entries[i];
              if (!entry) continue;
              result.push({
                team,
                name: entry.name,
                family: entry.family,
                familyName: (_entry$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                  error: Error()
                }), UnitFamily) : UnitFamily)[entry.family]) != null ? _entry$family : String(entry.family),
                tier: entry.tier,
                unitCount: entry.unitCount,
                cost: entry.combatPointCost,
                health: entry.health,
                attack: entry.damage,
                damageRadius: entry.damageRadius,
                defense: entry.defense,
                speed: entry.maxSpeed,
                range: entry.attackRange,
                attackIntervalMin: entry.attackIntervalMin,
                attackIntervalMax: entry.attackIntervalMax
              });
            }
          }

          return result;
        }

        createBattleTelemetryCounterRuleSnapshot() {
          const counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter) return [];
          const result = [];

          for (let i = 0; i < counter.rules.length; i++) {
            var _rule$attackerFamily, _rule$defenderFamily;

            const rule = counter.rules[i];
            if (!rule) continue;
            result.push({
              attackerFamily: rule.attackerFamily,
              attackerFamilyName: (_rule$attackerFamily = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily)[rule.attackerFamily]) != null ? _rule$attackerFamily : String(rule.attackerFamily),
              defenderFamily: rule.defenderFamily,
              defenderFamilyName: (_rule$defenderFamily = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily)[rule.defenderFamily]) != null ? _rule$defenderFamily : String(rule.defenderFamily),
              damageMultiplier: rule.damageMultiplier
            });
          }

          return result;
        }

        isAliveUnit(unit) {
          if (!unit) return false;
          if (!unit.node.activeInHierarchy) return false;
          if (!unit.agent) return false;
          if (!unit.props) return false;
          if (unit.props.isDead()) return false;
          return true;
        }

        addCombatPointFromVictim(killer, victim, isCounterKill) {
          if (!this.isCombatPointEnabled()) return;
          if (!this.unitDatabase) return;
          const killerTeam = killer.team;
          const bountyValue = this.getVictimBountyValue(victim);
          if (bountyValue <= 0) return;
          const reward = this.unitDatabase.calculateKillRewardFromBounty(bountyValue, isCounterKill);
          this.addCombatPoint(killerTeam, reward);

          if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordCombatPointEarned(killer, victim, reward, isCounterKill, this.frame, this.battleElapsedTime);
          }
        }

        getVictimBountyValue(victim) {
          const victimTeam = victim.team;

          if (victim.isHero) {
            const heroEntry = this.getHeroEntry(victimTeam);
            if (!heroEntry) return 0;
            return Math.max(0, heroEntry.combatPointBountyValue);
          }

          const entry = this.getTeamEntry(victimTeam, victim.unitTypeName);
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

        isValidSpawnEntry(entry, requirePositiveUnitCount = true) {
          if (!entry) return false;
          if (!entry.name) return false;
          if (!entry.prefab) return false;
          const unlocked = this.unitDatabase ? this.unitDatabase.isEntryUnlocked(entry) : entry.unlocked;

          if (!unlocked) {
            return false;
          }

          if (requirePositiveUnitCount && Math.floor(entry.unitCount) <= 0) {
            return false;
          }

          return true;
        }

        canAffordUnitName(team, unitName) {
          const safeName = (unitName || '').trim();
          if (!safeName) return false;
          const entry = this.getTeamEntry(team, safeName);

          if (!this.isValidSpawnEntry(entry)) {
            return false;
          }

          return this.canAffordEntry(team, entry);
        }

        isUnitNameUnlocked(team, unitName) {
          const safeName = (unitName || '').trim();
          if (!safeName) return false;
          const entry = this.getTeamEntry(team, safeName);
          if (!entry) return false;
          return this.unitDatabase ? this.unitDatabase.isEntryUnlocked(entry) : entry.unlocked;
        }

        collectAffordableEntries(team, out) {
          out.length = 0;
          const entries = this.getDatabaseTeamEntries(team);

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
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
          if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordDespawn(unit, this.frame, this.battleElapsedTime);
          }

          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);

          if (wave) {
            wave.invalidateRuntimeState();
            wave.handleUnitWillDespawn(unit);
            this.updateWaveBannerHealthBar(wave);
          }

          const anyController = this.cinematicController;

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
          const teamAEntries = this.getDatabaseTeamEntries(0);
          const teamBEntries = this.getDatabaseTeamEntries(1);

          for (const entry of teamAEntries) {
            if (!this.isValidEntry(entry)) continue;
            this.teamAPrefabMap.set(entry.name, entry);
          }

          for (const entry of teamBEntries) {
            if (!this.isValidEntry(entry)) continue;
            this.teamBPrefabMap.set(entry.name, entry);
          }
        }

        prewarmAllUnits() {
          const teamAEntries = this.getDatabaseTeamEntries(0);
          const teamBEntries = this.getDatabaseTeamEntries(1);

          for (const entry of teamAEntries) {
            if (!this.isValidEntry(entry)) continue;
            this.spawner.prewarm(entry.prefab, entry.prewarmCount, this.node);
          }

          for (const entry of teamBEntries) {
            if (!this.isValidEntry(entry)) continue;
            this.spawner.prewarm(entry.prefab, entry.prewarmCount, this.node);
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
            const dbEntry = this.unitDatabase.getEntry(team, unitName);

            if (dbEntry && dbEntry.prefab) {
              return dbEntry;
            }
          }

          const map = team === 0 ? this.teamAPrefabMap : this.teamBPrefabMap;
          const entry = map.get(unitName);

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
          const validEntries = [];

          for (const entry of entries) {
            if (!this.isValidSpawnEntry(entry)) continue;

            if (!this.canAffordEntry(team, entry)) {
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
          return this.getDatabaseTeamEntries(team);
        }

        getAliveUnits(team) {
          return team === 0 ? this.teamA : this.teamB;
        }

        getAliveWaveCount(team) {
          let count = 0;

          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDead()) continue;
            count++;
          }

          return count;
        }

        getTotalAliveWaveCount() {
          let count = 0;

          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
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
          const teamAEntries = this.getDatabaseTeamEntries(0);
          const teamBEntries = this.getDatabaseTeamEntries(1);
          const entryA = this.getRandomEntry(teamAEntries, 0);
          const entryB = this.getRandomEntry(teamBEntries, 1);

          if (entryA) {
            this.spawnEntryFormation(0, entryA, this.teamASpawnZ, true);
          }

          if (entryB) {
            this.spawnEntryFormation(1, entryB, this.teamBSpawnZ, true);
          }

          this.requestSpatialGridRebuild();
        }

        spawnWaveByEntry(team, entry, laneId = -1, aggressiveForward = false, spawnReason = '') {
          if (!this.isValidSpawnEntry(entry)) {
            return null;
          }

          const baseZ = team === 0 ? this.teamASpawnZ : this.teamBSpawnZ;
          const wave = this.spawnEntryFormation(team, entry, baseZ, true, laneId, aggressiveForward, spawnReason);
          this.requestSpatialGridRebuild();
          return wave;
        }

        spawnWaveByName(team, unitName, laneId = -1, aggressiveForward = false, spawnReason = '') {
          const entry = this.getTeamEntry(team, unitName);
          if (!entry) return null;
          return this.spawnWaveByEntry(team, entry, laneId, aggressiveForward, spawnReason);
        }

        spawnEntryFormation(team, entry, baseZ, spendCost, requestedLaneId = -1, aggressiveForward = false, spawnReason = '') {
          if (!this.isValidSpawnEntry(entry)) {
            return null;
          }

          const count = Math.max(0, Math.floor(entry.unitCount));

          if (count <= 0) {
            return null;
          }

          const cost = Math.max(0, entry.combatPointCost);

          if (spendCost && this.isCombatPointEnabled() && !this.spendCombatPoint(team, cost)) {
            this.requestBattleStatsUIRefresh();
            return null;
          }

          const laneId = this.resolveSpawnLaneId(requestedLaneId);
          const wave = new (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave)(this.nextWaveId++, team, entry.name, entry.family, entry.tier, count, laneId);
          wave.setInitialForwardCombatReleaseThreshold(entry.maxUnitPerRow);
          this.waves.push(wave);

          if (this.enableLaneSpawn) {
            this.spawnSquareFormationInLane(team, entry, baseZ, wave, laneId, count, aggressiveForward);
          } else {
            this.spawnCenteredRowsFormation(team, entry, baseZ, wave, count, aggressiveForward);
          }

          this.assignWaveBanner(wave, entry);

          if (this.enableBattleTelemetry) {
            var _entry$family2;

            this.battleTelemetry.recordWaveSpawnEvent({
              type: 'wave-spawn',
              frame: this.frame,
              time: this.battleElapsedTime,
              team,
              waveId: wave.id,
              laneId,
              unitName: entry.name,
              familyName: (_entry$family2 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily)[entry.family]) != null ? _entry$family2 : String(entry.family),
              aggressiveForward,
              reason: spawnReason
            });
          }

          if (spendCost && this.isCombatPointEnabled()) {
            if (this.enableBattleTelemetry) {
              this.battleTelemetry.recordCombatPointSpent(team, entry.name, entry.family, entry.tier, cost, wave.id, this.frame, this.battleElapsedTime);
            }
          }

          this.node.emit(BattleWaveSpawnedEvent, wave);
          return wave;
        }

        assignWaveBanner(wave, entry) {
          const prefab = entry ? entry.waveBannerPrefab : null;
          if (!prefab) return;
          if (!wave) return;
          if (wave.getAliveCount() <= 0) return;
          const node = this.acquireWaveBanner(prefab);
          if (!node) return;
          this.applyWaveBannerAppearance(node, wave.team, entry ? entry.waveBannerIconId : 0);
          wave.setWaveBanner(node, bannerNode => {
            this.recycleWaveBanner(prefab, bannerNode);
          }, bannerNode => {
            this.applyWaveBannerAppearance(bannerNode, wave.team, entry ? entry.waveBannerIconId : 0);
            this.updateWaveBannerHealthBar(wave);
          });
          wave.setWaveBannerVisible(this.waveBannerVisibleByCamera);
          this.updateWaveBannerHealthBar(wave);
        }

        applyWaveBannerAppearance(node, team, iconId) {
          const params = this.getWaveBannerColorParams(team);
          const iconParams = this.getWaveBannerIconParams(node, iconId);
          const sharedMaterial = this.getWaveBannerMaterial();
          const renderers = this.getWaveBannerRenderers(node);

          for (let i = 0; i < renderers.length; i++) {
            var _renderer$sharedMater;

            const renderer = renderers[i];

            if (sharedMaterial && ((_renderer$sharedMater = renderer.sharedMaterials) == null ? void 0 : _renderer$sharedMater[0]) !== sharedMaterial) {
              renderer.setSharedMaterial(sharedMaterial, 0);
            }

            renderer.setInstancedAttribute('a_billboard_bg_color', params);
            renderer.setInstancedAttribute('a_billboard_icon_id', iconParams);
          }
        }

        getWaveBannerIconParams(node, iconId) {
          let params = this.waveBannerIconParamCache.get(node);

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
          const node = wave.getWaveBannerNode();
          if (!node) return;
          const healthBars = this.getWaveBannerHealthBars(node);
          if (healthBars.length <= 0) return;
          const ratio = wave.getRuntimeHealthRatio(this.frame);

          for (let i = 0; i < healthBars.length; i++) {
            healthBars[i].setHealthRatio(ratio);
          }
        }

        getWaveBannerHealthBars(node) {
          let healthBars = this.waveBannerHealthBarCache.get(node);

          if (!healthBars) {
            healthBars = node.getComponentsInChildren(_crd && HealthBar3D === void 0 ? (_reportPossibleCrUseOfHealthBar3D({
              error: Error()
            }), HealthBar3D) : HealthBar3D);
            this.waveBannerHealthBarCache.set(node, healthBars);
          }

          return healthBars;
        }

        getWaveBannerColorParams(team) {
          const color = this.getWaveBannerBackgroundColor(team);
          const params = team === 0 ? this.waveBannerTeamAColorParams : this.waveBannerTeamBColorParams;
          params[0] = this.srgbChannelToLinear(color.r / 255);
          params[1] = this.srgbChannelToLinear(color.g / 255);
          params[2] = this.srgbChannelToLinear(color.b / 255);
          params[3] = color.a / 255;
          return params;
        }

        srgbChannelToLinear(value) {
          const v = Math.min(1, Math.max(0, value));
          return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        }

        getWaveBannerRenderers(node) {
          let renderers = this.waveBannerRendererCache.get(node);

          if (!renderers) {
            const allRenderers = node.getComponentsInChildren(MeshRenderer);
            renderers = [];

            for (let i = 0; i < allRenderers.length; i++) {
              const renderer = allRenderers[i];

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
          const controller = this.cinematicController;
          if (!controller || !controller.node) return;
          this.registeredCinematicController = controller;
          controller.node.on(BannerVisibilityBlockedEvent, this.onWaveBannerCameraBlockedChanged, this);
          const controllerAny = controller;
          const topDownCameraDrag = controllerAny && controllerAny.topDownCameraDrag ? controllerAny.topDownCameraDrag : null;

          if (topDownCameraDrag && topDownCameraDrag.node) {
            this.registeredTopDownCameraDragNode = topDownCameraDrag.node;
            topDownCameraDrag.node.on(TopDownZoomRangeChangedEvent, this.onWaveBannerCameraVisibilityChanged, this);
          }

          if (typeof controllerAny.isBannerVisibilityBlocked === 'function') {
            this.waveBannerCameraBlocked = !!controllerAny.isBannerVisibilityBlocked();
          }
        }

        unregisterWaveBannerCameraEvents() {
          const controller = this.registeredCinematicController;

          if (controller && controller.node) {
            controller.node.off(BannerVisibilityBlockedEvent, this.onWaveBannerCameraBlockedChanged, this);
          }

          if (this.registeredTopDownCameraDragNode) {
            this.registeredTopDownCameraDragNode.off(TopDownZoomRangeChangedEvent, this.onWaveBannerCameraVisibilityChanged, this);
          }

          this.registeredCinematicController = null;
          this.registeredTopDownCameraDragNode = null;
        }

        onWaveBannerCameraBlockedChanged(blocked) {
          this.waveBannerCameraBlocked = !!blocked;
          this.onWaveBannerCameraVisibilityChanged();
        }

        onWaveBannerCameraVisibilityChanged() {
          this.waveBannerCameraVisibilityDirty = true;
          this.updateWaveBannerCameraVisibility(false);
        }

        acquireWaveBanner(prefab) {
          const pool = this.getWaveBannerPool(prefab);
          const node = pool.length > 0 ? pool.pop() : instantiate(prefab);
          node.active = true;
          return node;
        }

        recycleWaveBanner(prefab, node) {
          if (!node || !node.isValid) return;
          node.active = false;
          node.setParent(null);
          const pool = this.getWaveBannerPool(prefab);

          if (pool.indexOf(node) < 0) {
            pool.push(node);
          }
        }

        getWaveBannerPool(prefab) {
          let pool = this.waveBannerPools.get(prefab);

          if (!pool) {
            pool = [];
            this.waveBannerPools.set(prefab, pool);
          }

          return pool;
        }

        clearWaveBannerPools() {
          this.waveBannerPools.forEach(pool => {
            for (let i = 0; i < pool.length; i++) {
              const node = pool[i];

              if (node && node.isValid) {
                node.destroy();
              }
            }

            pool.length = 0;
          });
          this.waveBannerPools.clear();
        }

        spawnSquareFormationInLane(team, entry, baseZ, wave, laneId, count, aggressiveForward = false) {
          const width = Math.max(1, Math.floor(entry.squareFormationWidth));
          const unitSpacing = Math.max(0, entry.spaceBetweenUnit);
          const rowSpacing = Math.max(0, entry.spaceBetweenRow);
          const laneCenterX = this.getLaneCenterX(laneId);

          for (let i = 0; i < count; i++) {
            const row = Math.floor(i / width);
            const col = i % width;
            const rowCount = Math.min(width, count - row * width);
            const x = laneCenterX + (col - (rowCount - 1) * 0.5) * unitSpacing;
            const rowZOffset = row * rowSpacing;
            const baseUnitZ = team === 0 ? baseZ - rowZOffset : baseZ + rowZOffset;
            const z = baseUnitZ + this.randomRange(-this.formationZNoise, this.formationZNoise);
            this.tempSpawnPos.set(x, 0, z);
            this.spawnUnitForWave(team, entry, this.tempSpawnPos, wave, laneId, aggressiveForward);
          }
        }

        spawnCenteredRowsFormation(team, entry, baseZ, wave, count, aggressiveForward = false) {
          const maxPerRow = Math.max(1, Math.floor(entry.maxUnitPerRow));
          const rowSpacing = Math.max(0, entry.spaceBetweenRow);
          const unitSpacing = Math.max(0, entry.spaceBetweenUnit);
          let spawned = 0;
          let row = 0;

          while (spawned < count) {
            const remaining = count - spawned;
            const rowCount = Math.min(maxPerRow, remaining);
            const rowXPositions = this.buildCenteredRowXPositions(rowCount, row, unitSpacing);

            for (let col = 0; col < rowCount; col++) {
              const x = rowXPositions[col];
              const rowZOffset = row * rowSpacing;
              const baseUnitZ = team === 0 ? baseZ - rowZOffset : baseZ + rowZOffset;
              const z = baseUnitZ + this.randomRange(-this.formationZNoise, this.formationZNoise);
              this.tempSpawnPos.set(x, 0, z);
              this.spawnUnitForWave(team, entry, this.tempSpawnPos, wave, wave.laneId, aggressiveForward);
              spawned++;
            }

            row++;
          }
        }

        spawnUnitForWave(team, entry, pos, wave, laneId, aggressiveForward = false) {
          let unit = null;

          if (team === 0) {
            unit = this.spawnTeamA(entry.name, pos);
          } else {
            unit = this.spawnTeamB(entry.name, pos);
          }

          if (!unit) return;
          unit.laneId = laneId;
          unit.aggressiveForward = aggressiveForward;
          wave.addUnit(unit);

          if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordSpawn(unit, team, entry.name, entry.family, entry.tier, wave.id, this.frame, this.battleElapsedTime);
          }
        }

        resolveSpawnLaneId(requestedLaneId = -1) {
          const count = this.getSafeLaneCount();

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
          const count = this.getSafeLaneCount();
          return Math.max(0, Math.min(count - 1, Math.floor(laneId)));
        }

        getLaneCenterX(laneId) {
          const count = this.getSafeLaneCount();
          const safeLane = this.clampLaneId(laneId);
          const width = this.battleMaxX - this.battleMinX;

          if (width <= 0) {
            return 0;
          }

          const laneWidth = width / count;
          return this.battleMinX + laneWidth * (safeLane + 0.5);
        }

        getLaneWidth() {
          const count = this.getSafeLaneCount();
          const width = this.battleMaxX - this.battleMinX;

          if (width <= 0) {
            return 0;
          }

          return width / count;
        }

        getLaneMinX(laneId) {
          return this.getLaneCenterX(laneId) - this.getLaneWidth() * 0.5;
        }

        getLaneMaxX(laneId) {
          return this.getLaneCenterX(laneId) + this.getLaneWidth() * 0.5;
        }

        getDirectionToLaneArea(laneId, x) {
          if (laneId < 0) return 0;
          const width = this.getLaneWidth();
          if (width <= 0) return 0;
          const centerX = this.getLaneCenterX(laneId);
          const coreHalfWidth = width * 0.25;
          const minX = centerX - coreHalfWidth;
          const maxX = centerX + coreHalfWidth;
          if (x < minX) return 1;
          if (x > maxX) return -1;
          return 0;
        }

        getNearestLaneIdForX(x) {
          const count = this.getSafeLaneCount();
          let bestLane = 0;
          let bestDist = Infinity;

          for (let i = 0; i < count; i++) {
            const centerX = this.getLaneCenterX(i);
            const dist = Math.abs(x - centerX);

            if (dist < bestDist) {
              bestDist = dist;
              bestLane = i;
            }
          }

          return bestLane;
        }

        buildCenteredRowXPositions(rowCount, rowIndex, unitSpacing) {
          const result = this.centeredRowXBuffer;
          result.length = 0;

          if (rowCount <= 0) {
            return result;
          }

          const gap = Math.max(0, this.centerGapWidth);

          if (gap <= 0) {
            for (let col = 0; col < rowCount; col++) {
              const x = (col - (rowCount - 1) * 0.5) * unitSpacing;
              result.push(x);
            }

            return result;
          }

          const gapHalf = gap * 0.5;
          let pairIndex = 0;
          const startRightSide = rowIndex % 2 === 1;

          while (result.length < rowCount) {
            const leftX = -gapHalf - pairIndex * unitSpacing;
            const rightX = gapHalf + pairIndex * unitSpacing;

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

          const unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.family, entry.tier, pos, 0, this.node, entry.maxSpeed, entry.canBePush, entry.canBePassedThroughByForwardAlly, entry.attackRange, entry.attackIntervalMin, entry.attackIntervalMax, entry.health, entry.damage, entry.damageRadius, entry.defense);

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

          this.requestBattleStatsUIRefresh();
          return unit;
        }

        spawnTeamB(unitName, pos) {
          const entry = this.getTeamEntry(1, unitName);

          if (!entry || !entry.prefab) {
            return null;
          }

          const unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.family, entry.tier, pos, 1, this.node, entry.maxSpeed, entry.canBePush, entry.canBePassedThroughByForwardAlly, entry.attackRange, entry.attackIntervalMin, entry.attackIntervalMax, entry.health, entry.damage, entry.damageRadius, entry.defense);

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

              this.spawner.despawnUnit(unit, entry.prefab);
              this.requestSpatialGridRebuild();
              this.requestBattleStatsUIRefresh();
              this.processBattleWinnerCondition(true);
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

              this.spawner.despawnUnit(unit, entry.prefab);
              this.requestSpatialGridRebuild();
              this.requestBattleStatsUIRefresh();
              this.processBattleWinnerCondition(true);
            }

            return;
          }
        }

        handleHeroDeath(unit) {
          const team = unit.team;

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

            const idx = this.teamA.indexOf(unit);

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

            const idx = this.teamB.indexOf(unit);

            if (idx >= 0) {
              this.teamB.splice(idx, 1);
            }

            this.aliveCount[1]--;
            this.deathCount[1]++;

            if (this.aliveCount[1] < 0) {
              this.aliveCount[1] = 0;
            }
          }

          if (team === 0 || team === 1) {
            this.resolveBattleWinner(team === 0 ? 1 : 0, team, 'hero-killed');
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
            const idx = this.sim.agents.indexOf(unit.agent);

            if (idx >= 0) {
              this.sim.agents.splice(idx, 1);
            }
          }
        }

        registerDatabaseHeroes() {
          if (!this.unitDatabase) return;
          const heroA = this.unitDatabase.getHeroEntry(0);
          const heroB = this.unitDatabase.getHeroEntry(1);
          this.registerSceneHero(heroA, 0, 'hero_a');
          this.registerSceneHero(heroB, 1, 'hero_b');
        }

        registerSceneHero(heroEntry, team, fallbackTypeName) {
          if (!heroEntry) return;
          if (!heroEntry.heroNode) return;
          const hero = heroEntry.heroNode.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);

          if (!hero) {
            return;
          }

          if (!hero.node.activeInHierarchy) return;
          hero.isHero = true;
          const props = hero.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);

          if (props) {
            props.maxHealth = heroEntry.health;
            props.health = heroEntry.health;
            props.damage = heroEntry.damage;
            props.defense = heroEntry.defense;
            props.family = heroEntry.family;
            props.tier = Math.max(1, Math.min(3, Math.floor(heroEntry.tier)));
            props.resetForSpawn();
          }

          const behavior = hero.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior);

          if (behavior) {
            behavior.gameManager = this;
            behavior.resetForSpawn();
          }

          const unitTypeName = heroEntry.name && heroEntry.name.length > 0 ? heroEntry.name : fallbackTypeName;
          const forwardX = 0;
          const forwardZ = team === 0 ? 1 : -1;
          hero.moveSpeed = heroEntry.maxSpeed;
          hero.canBePassedThroughByForwardAlly = true;
          hero.heroGuardDistance = heroEntry.guardDistance;
          hero.isSteady = true;
          hero.init(this.sim, team, unitTypeName, forwardX, forwardZ);
          this.registerHeroWave(hero, team, unitTypeName, heroEntry.family, heroEntry.tier);

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

        registerHeroWave(hero, team, unitTypeName, family, tier) {
          const laneId = this.getHeroLaneId();
          const previousWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

          if (previousWave) {
            this.removeBattleWaveReference(previousWave);
            previousWave.releaseReferences();
          }

          hero.laneId = laneId;
          const wave = new (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave)(this.nextWaveId++, team, unitTypeName, family, tier, 1, laneId);
          wave.addUnit(hero);

          if (team === 0) {
            this.teamAHeroWave = wave;
          } else {
            this.teamBHeroWave = wave;
          }

          if (this.enableBattleTelemetry) {
            var _family;

            this.battleTelemetry.recordWaveSpawnEvent({
              type: 'hero-wave-register',
              frame: this.frame,
              time: this.battleElapsedTime,
              team,
              waveId: wave.id,
              laneId,
              unitName: unitTypeName,
              familyName: (_family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily)[family]) != null ? _family : String(family),
              aggressiveForward: false
            });
          }
        }

        ensureBattleWaveRegistered(wave) {
          if (this.waves.indexOf(wave) >= 0) {
            return;
          }

          this.waves.push(wave);
        }

        removeBattleWaveReference(wave) {
          const index = this.waves.indexOf(wave);

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

        refreshBattleStatsUI(force = false) {
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

      }, _class3.instance = null, _class3.originalDirectorTick = null, _class3.directorTimeScaleOwner = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "unitDatabase", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "cinematicController", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "useWorkerRVO", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "targetFrameRate", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 60;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "battleTimeScale", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "resetBattleTimeScaleOnDestroy", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "showCocosProfilerStats", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "allowProfilerStatsQueryParam", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "enableBattleWinnerCheck", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "enableNoAffordableSpawnWinnerFallback", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "battleWinnerCheckIntervalFrames", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "enableBattleTelemetry", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "downloadBattleTelemetryOnEnd", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "reloadPageAfterBattleTelemetryExport", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryReloadDelaySeconds", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "logBattleTelemetryOnEnd", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryFilePrefix", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'battle-telemetry';
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetrySnapshotIntervalFrames", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 60;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryMaxSnapshots", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 240;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryMaxDiagnosticEvents", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3000;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "battleMinX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -28;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 28;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "battleMinZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -18;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 18;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "rvoUpdateFrameOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "maxRvoStepDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "visualSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 16;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridCellSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateFrameOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "useWorkerSpatialTargetQuery", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class2.prototype, "teamAAliveLabel", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class2.prototype, "teamADeathLabel", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class2.prototype, "teamBAliveLabel", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class2.prototype, "teamBDeathLabel", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class2.prototype, "teamAKillLabel", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class2.prototype, "teamBKillLabel", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class2.prototype, "teamACounterKillLabel", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class2.prototype, "teamBCounterKillLabel", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class2.prototype, "teamACombatPointLabel", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class2.prototype, "teamBCombatPointLabel", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class2.prototype, "spawnImmediatelyOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor45 = _applyDecoratedDescriptor(_class2.prototype, "prewarmOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor46 = _applyDecoratedDescriptor(_class2.prototype, "spawnWaveInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor47 = _applyDecoratedDescriptor(_class2.prototype, "maxAutoSpawnDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor48 = _applyDecoratedDescriptor(_class2.prototype, "teamASpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -20;
        }
      }), _descriptor49 = _applyDecoratedDescriptor(_class2.prototype, "teamBSpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor50 = _applyDecoratedDescriptor(_class2.prototype, "formationZNoise", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor51 = _applyDecoratedDescriptor(_class2.prototype, "centerGapWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor52 = _applyDecoratedDescriptor(_class2.prototype, "enableLaneSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor53 = _applyDecoratedDescriptor(_class2.prototype, "laneCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor54 = _applyDecoratedDescriptor(_class2.prototype, "defaultSpawnLane", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor55 = _applyDecoratedDescriptor(_class2.prototype, "autoSpawnRandomLane", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor56 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerRefreshIntervalFrames", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 12;
        }
      }), _descriptor57 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerCamera", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor58 = _applyDecoratedDescriptor(_class2.prototype, "enableWaveBannerCameraVisibility", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor59 = _applyDecoratedDescriptor(_class2.prototype, "hideWaveBannerInOrbitMode", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor60 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerHideFovBelow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 35;
        }
      }), _descriptor61 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerShowFovAbove", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 38;
        }
      }), _descriptor62 = _applyDecoratedDescriptor(_class2.prototype, "circleObstacles", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor63 = _applyDecoratedDescriptor(_class2.prototype, "rectObstacles", [_dec34], {
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
//# sourceMappingURL=2a3d48594ca107bb253a09fa8016eb25bbe98eb1.js.map