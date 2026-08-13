System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15", "__unresolved_16", "__unresolved_17", "__unresolved_18"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Color, Component, Vec3, Label, instantiate, isValid, MeshRenderer, game, profiler, director, Unit, UnitProps, RVOSimulator, RVOWorkerSimulator, ObstacleCircle, ObstacleRect, UnitSpawner, UnitBehavior, BattleSpatialGrid, BattleWave, CounterSettings, UnitFamily, BattleTelemetry, BattleUnitDatabase, BattleCardDatabase, BattleCardModifier, BattleCardRuntime, HealthBar3D, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _descriptor47, _descriptor48, _descriptor49, _descriptor50, _descriptor51, _descriptor52, _descriptor53, _descriptor54, _descriptor55, _descriptor56, _descriptor57, _descriptor58, _descriptor59, _descriptor60, _descriptor61, _descriptor62, _descriptor63, _descriptor64, _class3, _crd, ccclass, property, BannerVisibilityBlockedEvent, TopDownZoomRangeChangedEvent, BattleWaveSpawnedEvent, GameManager;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

  function _reportPossibleCrUseOfBattleCardDatabase(extras) {
    _reporterNs.report("BattleCardDatabase", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardModifier(extras) {
    _reporterNs.report("BattleCardModifier", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardModifiers(extras) {
    _reporterNs.report("BattleCardModifiers", "./BattleCardRuntime", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardRuntime(extras) {
    _reporterNs.report("BattleCardRuntime", "./BattleCardRuntime", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardTelemetryEvent(extras) {
    _reporterNs.report("BattleCardTelemetryEvent", "./BattleCardRuntime", _context.meta, extras);
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
      isValid = _cc.isValid;
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
      BattleCardDatabase = _unresolved_16.BattleCardDatabase;
      BattleCardModifier = _unresolved_16.BattleCardModifier;
    }, function (_unresolved_17) {
      BattleCardRuntime = _unresolved_17.BattleCardRuntime;
    }, function (_unresolved_18) {
      HealthBar3D = _unresolved_18.HealthBar3D;
    }, function (_unresolved_19) {
      _export("UnitPrefabEntry", _unresolved_19.UnitPrefabEntry);
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1e335OSdGRGLrD08aYssvKr", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Color', 'Component', 'Vec3', 'Label', 'Prefab', 'Node', 'instantiate', 'isValid', 'MeshRenderer', 'Material', 'game', 'profiler', 'director']);

      ({
        ccclass,
        property
      } = _decorator);
      BannerVisibilityBlockedEvent = 'battle-camera-banner-visibility-blocked';
      TopDownZoomRangeChangedEvent = 'battle-camera-topdown-zoom-range-changed';
      BattleWaveSpawnedEvent = 'battle-wave-spawned';

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(_crd && BattleUnitDatabase === void 0 ? (_reportPossibleCrUseOfBattleUnitDatabase({
        error: Error()
      }), BattleUnitDatabase) : BattleUnitDatabase), _dec3 = property(_crd && BattleCardDatabase === void 0 ? (_reportPossibleCrUseOfBattleCardDatabase({
        error: Error()
      }), BattleCardDatabase) : BattleCardDatabase), _dec4 = property(Component), _dec5 = property({
        tooltip: 'Target frame rate for mobile performance tests. Use 30, 45, or 60. Set 0 or lower to keep the engine default.'
      }), _dec6 = property({
        min: 0.1,
        tooltip: 'Global battle speed multiplier for faster telemetry tests. 1 = normal speed. Values above 1 speed up Cocos update/schedule time; RVO is sub-stepped so large dt is not simply clamped away.'
      }), _dec7 = property({
        tooltip: 'Reset the global Cocos scheduler time scale back to 1 when this GameManager is destroyed. Keep enabled unless another system owns global time scale.'
      }), _dec8 = property({
        tooltip: 'Show the built-in Cocos profiler overlay in build/preview. Keep off for normal release tests unless you need on-device FPS/drawcall stats.'
      }), _dec9 = property({
        tooltip: 'Allow URL query params ?stats=1 or ?profiler=1 to show the Cocos profiler overlay in browser builds.'
      }), _dec10 = property({
        tooltip: 'Check battle winner rules. Normal gameplay ends on Hero death. Telemetry tests continue until a team has no living troops and cannot afford any valid spawn.'
      }), _dec11 = property({
        tooltip: 'Fallback winner rule: a team loses only when it has no living troops, including Hero, and can no longer afford any valid spawn entry. Telemetry tests always use this end rule.'
      }), _dec12 = property({
        min: 1,
        tooltip: 'Frames between elimination-and-affordability winner checks. Hero death is immediate only outside telemetry tests.'
      }), _dec13 = property({
        tooltip: 'Collect aggregate battle telemetry and export a JSON report when the battle winner rule is reached.'
      }), _dec14 = property({
        tooltip: 'Automatically download the battle telemetry JSON in browser preview/build when the temporary winner condition is reached.'
      }), _dec15 = property({
        tooltip: 'Reload the browser page after telemetry export. This does not store reports in localStorage or skip per-match downloads.'
      }), _dec16 = property({
        min: 0,
        tooltip: 'Seconds to wait after triggering telemetry JSON download before reloading the browser page.'
      }), _dec17 = property({
        tooltip: 'Also print the full telemetry object to console. The report is always kept on window.__battleTelemetryReport when available.'
      }), _dec18 = property({
        tooltip: 'Output file prefix for downloaded battle telemetry reports.'
      }), _dec19 = property({
        min: 1,
        tooltip: 'Frames between diagnostic battle snapshots in telemetry. These snapshots record team, hero, wave, and lane state for post-match diagnosis.'
      }), _dec20 = property({
        min: 0,
        tooltip: 'Maximum diagnostic snapshots stored in one telemetry report. Set 0 to disable snapshots while keeping aggregate telemetry.'
      }), _dec21 = property({
        min: 0,
        tooltip: 'Maximum chronological diagnostic events stored in one telemetry report. Includes spawn decisions, hero damage, area damage, and kills.'
      }), _dec22 = property(Label), _dec23 = property(Label), _dec24 = property(Label), _dec25 = property(Label), _dec26 = property(Label), _dec27 = property(Label), _dec28 = property(Label), _dec29 = property(Label), _dec30 = property(Label), _dec31 = property(Label), _dec32 = property({
        min: 1,
        tooltip: 'Frames between safety wave-banner holder refresh checks. Set to 1 to refresh every frame.'
      }), _dec33 = property(Camera), _dec34 = property({
        type: [_crd && ObstacleCircle === void 0 ? (_reportPossibleCrUseOfObstacleCircle({
          error: Error()
        }), ObstacleCircle) : ObstacleCircle]
      }), _dec35 = property({
        type: [_crd && ObstacleRect === void 0 ? (_reportPossibleCrUseOfObstacleRect({
          error: Error()
        }), ObstacleRect) : ObstacleRect]
      }), _dec(_class = (_class2 = (_class3 = class GameManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "unitDatabase", _descriptor, this);

          _initializerDefineProperty(this, "battleCardDatabase", _descriptor2, this);

          _initializerDefineProperty(this, "cinematicController", _descriptor3, this);

          _initializerDefineProperty(this, "useWorkerRVO", _descriptor4, this);

          _initializerDefineProperty(this, "targetFrameRate", _descriptor5, this);

          _initializerDefineProperty(this, "battleTimeScale", _descriptor6, this);

          _initializerDefineProperty(this, "resetBattleTimeScaleOnDestroy", _descriptor7, this);

          _initializerDefineProperty(this, "showCocosProfilerStats", _descriptor8, this);

          _initializerDefineProperty(this, "allowProfilerStatsQueryParam", _descriptor9, this);

          _initializerDefineProperty(this, "enableBattleWinnerCheck", _descriptor10, this);

          _initializerDefineProperty(this, "enableNoAffordableSpawnWinnerFallback", _descriptor11, this);

          _initializerDefineProperty(this, "battleWinnerCheckIntervalFrames", _descriptor12, this);

          _initializerDefineProperty(this, "enableBattleTelemetry", _descriptor13, this);

          _initializerDefineProperty(this, "downloadBattleTelemetryOnEnd", _descriptor14, this);

          _initializerDefineProperty(this, "reloadPageAfterBattleTelemetryExport", _descriptor15, this);

          _initializerDefineProperty(this, "battleTelemetryReloadDelaySeconds", _descriptor16, this);

          _initializerDefineProperty(this, "logBattleTelemetryOnEnd", _descriptor17, this);

          _initializerDefineProperty(this, "battleTelemetryFilePrefix", _descriptor18, this);

          _initializerDefineProperty(this, "battleTelemetrySnapshotIntervalFrames", _descriptor19, this);

          _initializerDefineProperty(this, "battleTelemetryMaxSnapshots", _descriptor20, this);

          _initializerDefineProperty(this, "battleTelemetryMaxDiagnosticEvents", _descriptor21, this);

          this.teamAHero = null;
          this.teamBHero = null;

          _initializerDefineProperty(this, "battleMinX", _descriptor22, this);

          _initializerDefineProperty(this, "battleMaxX", _descriptor23, this);

          _initializerDefineProperty(this, "battleMinZ", _descriptor24, this);

          _initializerDefineProperty(this, "battleMaxZ", _descriptor25, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor26, this);

          _initializerDefineProperty(this, "rvoUpdateFrameOffset", _descriptor27, this);

          _initializerDefineProperty(this, "maxRvoStepDeltaTime", _descriptor28, this);

          this.frame = 0;

          _initializerDefineProperty(this, "visualSmooth", _descriptor29, this);

          _initializerDefineProperty(this, "spatialGridCellSize", _descriptor30, this);

          _initializerDefineProperty(this, "spatialGridUpdateInterval", _descriptor31, this);

          _initializerDefineProperty(this, "spatialGridUpdateFrameOffset", _descriptor32, this);

          _initializerDefineProperty(this, "useWorkerSpatialTargetQuery", _descriptor33, this);

          this.spatialGrid = new (_crd && BattleSpatialGrid === void 0 ? (_reportPossibleCrUseOfBattleSpatialGrid({
            error: Error()
          }), BattleSpatialGrid) : BattleSpatialGrid)();

          _initializerDefineProperty(this, "teamAAliveLabel", _descriptor34, this);

          _initializerDefineProperty(this, "teamADeathLabel", _descriptor35, this);

          _initializerDefineProperty(this, "teamBAliveLabel", _descriptor36, this);

          _initializerDefineProperty(this, "teamBDeathLabel", _descriptor37, this);

          _initializerDefineProperty(this, "teamAKillLabel", _descriptor38, this);

          _initializerDefineProperty(this, "teamBKillLabel", _descriptor39, this);

          _initializerDefineProperty(this, "teamACounterKillLabel", _descriptor40, this);

          _initializerDefineProperty(this, "teamBCounterKillLabel", _descriptor41, this);

          _initializerDefineProperty(this, "teamACombatPointLabel", _descriptor42, this);

          _initializerDefineProperty(this, "teamBCombatPointLabel", _descriptor43, this);

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
          this.battleProgressionProvider = null;
          this.combatResolutionDepth = 0;
          this.pendingForcedBattleWinnerCheck = false;
          this.pendingBattleWinner = null;

          _initializerDefineProperty(this, "enableAutoSpawn", _descriptor44, this);

          _initializerDefineProperty(this, "spawnImmediatelyOnStart", _descriptor45, this);

          _initializerDefineProperty(this, "prewarmOnStart", _descriptor46, this);

          _initializerDefineProperty(this, "spawnWaveInterval", _descriptor47, this);

          _initializerDefineProperty(this, "maxAutoSpawnDeltaTime", _descriptor48, this);

          _initializerDefineProperty(this, "teamASpawnZ", _descriptor49, this);

          _initializerDefineProperty(this, "teamBSpawnZ", _descriptor50, this);

          _initializerDefineProperty(this, "formationZNoise", _descriptor51, this);

          _initializerDefineProperty(this, "centerGapWidth", _descriptor52, this);

          _initializerDefineProperty(this, "enableLaneSpawn", _descriptor53, this);

          _initializerDefineProperty(this, "laneCount", _descriptor54, this);

          _initializerDefineProperty(this, "defaultSpawnLane", _descriptor55, this);

          _initializerDefineProperty(this, "autoSpawnRandomLane", _descriptor56, this);

          _initializerDefineProperty(this, "waveBannerRefreshIntervalFrames", _descriptor57, this);

          _initializerDefineProperty(this, "waveBannerCamera", _descriptor58, this);

          _initializerDefineProperty(this, "enableWaveBannerCameraVisibility", _descriptor59, this);

          _initializerDefineProperty(this, "hideWaveBannerInOrbitMode", _descriptor60, this);

          _initializerDefineProperty(this, "waveBannerHideFovBelow", _descriptor61, this);

          _initializerDefineProperty(this, "waveBannerShowFovAbove", _descriptor62, this);

          this.spawnWaveTimer = 0;

          _initializerDefineProperty(this, "circleObstacles", _descriptor63, this);

          _initializerDefineProperty(this, "rectObstacles", _descriptor64, this);

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
          this.teamAHeroEntry = null;
          this.teamBHeroEntry = null;
          this.heroLineZ = [NaN, NaN];
          this.heroForwardUnlocked = [false, false];
          this.heroBattleSearchRangeActive = false;

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
          this.battleCardRuntime = null;
        }

        start() {
          var _this$battleCardRunti;

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
          this.teamAHeroEntry = null;
          this.teamBHeroEntry = null;
          this.heroLineZ[0] = NaN;
          this.heroLineZ[1] = NaN;
          this.heroForwardUnlocked[0] = false;
          this.heroForwardUnlocked[1] = false;
          this.heroBattleSearchRangeActive = false;
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
          this.ensureBattleCardRuntime();
          this.resetBattleTelemetry();
          (_this$battleCardRunti = this.battleCardRuntime) == null || _this$battleCardRunti.beginBattle();
          this.spatialGrid.cellSize = this.spatialGridCellSize;
          this.spatialGrid.setBattlefieldBounds(this.battleMinX, this.battleMaxX, this.battleMinZ, this.battleMaxZ);
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

          if (this.resetBattleTimeScaleOnDestroy) {
            this.uninstallBattleTimeScaleHook();
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
          this.battleWinnerResolved = false;
          this.battleWinnerTeam = -1;
          this.battleLoserTeam = -1;
          this.battleWinnerReason = '';
          this.combatResolutionDepth = 0;
          this.pendingForcedBattleWinnerCheck = false;
          this.pendingBattleWinner = null;
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
          var fps = Math.floor(this.targetFrameRate);
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

          var originalTick = director.tick.bind(director);
          GameManager.originalDirectorTick = originalTick;

          director.tick = deltaTime => {
            var owner = GameManager.directorTimeScaleOwner;
            var scale = owner && owner.isValid ? owner.getSafeBattleTimeScale() : 1;
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
          var queryState = this.getProfilerStatsQueryState();

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
          var params = new URLSearchParams(window.location.search);
          var value = (_ref = (_params$get = params.get('stats')) != null ? _params$get : params.get('profiler')) != null ? _ref : params.get('showStats');
          if (value === null) return null;
          var normalized = value.trim().toLowerCase();

          if (normalized === '1' || normalized === 'true' || normalized === 'on') {
            return true;
          }

          if (normalized === '0' || normalized === 'false' || normalized === 'off') {
            return false;
          }

          return null;
        }

        update(deltaTime) {
          var _this$battleCardRunti2;

          this.frame++;
          this.battleElapsedTime += deltaTime;
          (_this$battleCardRunti2 = this.battleCardRuntime) == null || _this$battleCardRunti2.update(deltaTime, this.combatPoint, this.initialCombatPoint);
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

        shouldRunFrameInterval(interval, offset) {
          if (offset === void 0) {
            offset = 0;
          }

          var safeInterval = Math.max(1, Math.floor(interval));
          var phase = (Math.floor(offset) % safeInterval + safeInterval) % safeInterval;
          return (this.frame + phase) % safeInterval === 0;
        }

        stepRvoSimulation(deltaTime) {
          if (!this.sim || typeof this.sim.step !== 'function') {
            return;
          }

          if (typeof deltaTime !== 'number' || !isFinite(deltaTime) || deltaTime <= 0) {
            return;
          }

          var maxStep = Math.max(0.001, this.maxRvoStepDeltaTime);
          this.sim.step(deltaTime, maxStep);
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
            var damageMul = counter.getDamageMultiplier(killer.props.family, victim.props.family);
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

        reportDamage(attacker, victim, damage, actualDamage, isCounterDamage, isAreaDamage, attackBatchId) {
          if (isAreaDamage === void 0) {
            isAreaDamage = false;
          }

          if (attackBatchId === void 0) {
            attackBatchId = -1;
          }

          if (!this.enableBattleTelemetry) return;
          this.battleTelemetry.recordDamage(attacker, victim, damage, actualDamage, isCounterDamage, isAreaDamage, attackBatchId, this.frame, this.battleElapsedTime);
        }

        configureBattleCardDecks(playerCardIds, enemyCardIds, playerBudgetUpgradeLevels, maxPlayerCards, maxEnemyCards) {
          var _this$battleCardRunti3;

          if (playerBudgetUpgradeLevels === void 0) {
            playerBudgetUpgradeLevels = {};
          }

          if (maxPlayerCards === void 0) {
            maxPlayerCards = 3;
          }

          if (maxEnemyCards === void 0) {
            maxEnemyCards = maxPlayerCards;
          }

          this.ensureBattleCardRuntime();
          (_this$battleCardRunti3 = this.battleCardRuntime) == null || _this$battleCardRunti3.setDecks(playerCardIds, enemyCardIds, playerBudgetUpgradeLevels, maxPlayerCards, maxEnemyCards);
        }

        getBattleCardModifiers(team, family, opposingFamily) {
          if (!this.battleCardRuntime) {
            return {
              damageMultiplier: 1,
              defenseFlat: 0,
              attackRangeMultiplier: 1,
              moveSpeedMultiplier: 1,
              damageRadiusMultiplier: 1,
              counterImmune: false
            };
          }

          return this.battleCardRuntime.getModifiers(team, family, opposingFamily);
        }

        consumeBattleCardModifier(team, family, modifier, opposingFamily) {
          return this.battleCardRuntime ? this.battleCardRuntime.consumeModifier(team, family, modifier, opposingFamily) : false;
        }

        consumeAttackRangeCardBudget(team, family, opposingFamily) {
          return this.consumeBattleCardModifier(team, family, (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
            error: Error()
          }), BattleCardModifier) : BattleCardModifier).AttackRangePercent, opposingFamily);
        }

        getBattleCardTelemetrySnapshot() {
          return this.battleCardRuntime ? this.battleCardRuntime.createTelemetrySnapshot() : [];
        }

        getUsedBattleCardIds(team) {
          return this.battleCardRuntime ? this.battleCardRuntime.getUsedCardIds(team) : [];
        }

        hasUnitReachedEnemyHeroLine(unit) {
          if (!unit) return false;
          if (unit.team !== 0 && unit.team !== 1) return false;
          var defendingTeam = unit.team === 0 ? 1 : 0;
          var lineZ = this.heroLineZ[defendingTeam];
          var unitZ = unit.agent ? unit.agent.pos.z : unit.node.worldPosition.z;
          var forwardZ = unit.forwardDir.z;
          if (!Number.isFinite(lineZ)) return false;
          if (!Number.isFinite(unitZ)) return false;
          if (Math.abs(forwardZ) <= 0.0001) return false;
          return (unitZ - lineZ) * forwardZ >= 0;
        }

        resolveHeroDefeat(hero) {
          var _this$battleProgressi;

          if (!hero || !hero.isHero) return;
          var team = hero.team;
          if (team !== 0 && team !== 1) return;
          this.resolveBattleWinner(team === 0 ? 1 : 0, team, (_this$battleProgressi = this.battleProgressionProvider) != null && _this$battleProgressi.isBossBattle != null && _this$battleProgressi.isBossBattle() ? 'boss-killed' : 'hero-killed');
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

          if (!this.shouldUseSoloAggressiveCombat(wave, unit, enemy) && !this.shouldDelayInitialForwardCombat(wave, unit, enemy, useInitialForwardGate)) {
            wave.enterCombatMode();
          }

          var enemyWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
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
          var wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
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

          var unitLane = this.getCurrentLaneIdForUnit(unit);
          var enemyLane = this.getCurrentLaneIdForUnit(enemy);
          if (unitLane < 0 || enemyLane < 0) return false;

          if (unitLane !== enemyLane) {
            return true;
          }

          return this.isEnemyOutsideUnitAttackRange(unit, enemy);
        }

        isEnemyOutsideUnitAttackRange(unit, enemy) {
          if (!unit.agent || !enemy.agent) return false;
          var dx = enemy.agent.pos.x - unit.agent.pos.x;
          var dz = enemy.agent.pos.z - unit.agent.pos.z;
          var range = Math.max(0, unit.attackRange) + Math.max(0, unit.radius) + Math.max(0, enemy.radius);
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
          var wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
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
            var unitX = unit.agent ? unit.agent.pos.x : unit.node.worldPosition.x;
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

          if (scanner.team === 1 && scanner.hasReachedEnemyHeroLine()) {
            this.resolveBattleWinner(1, 0, 'enemy-reached-hero-line');
            return;
          }

          var aggressiveForward = wave.isAggressiveForwardMode();

          if (!aggressiveForward && scanner.hasReachedEnemyHeroLine()) {
            var heroTarget = scanner.getEnemyHeroTarget();

            if (heroTarget) {
              this.onWaveForwardTargetFound(scanner, heroTarget);
            }

            return;
          }

          if (aggressiveForward) {
            if (!this.shouldRunFrameInterval(wave.getTargetSearchIntervalFrames(), wave.id)) {
              return;
            }

            scanner = wave.getForwardScanner(true);
            if (!scanner) return;
            var adjacentRearGuard = this.findDeepestAdjacentEnemyWaveScanner(wave, scanner);

            if (adjacentRearGuard) {
              if (wave.observeAggressiveAdjacentBoundary()) {
                this.recordAggressiveForwardEvent('aggressive-boundary-observed', wave, scanner, adjacentRearGuard, 0, 'deepest-adjacent-enemy-wave');
              }
            } else if (!wave.hasObservedAggressiveAdjacentBoundary()) {
              return;
            }

            if (adjacentRearGuard && !scanner.hasPassedForwardTarget(adjacentRearGuard)) {
              return;
            }

            var enemiesAhead = this.countEnemiesAheadInSameLane(scanner);

            if (enemiesAhead > 0) {
              if (wave.observeAggressiveOwnLaneBlock()) {
                this.recordAggressiveForwardEvent('aggressive-own-lane-blocked', wave, scanner, adjacentRearGuard, enemiesAhead, 'enemy-ahead-in-own-lane');
              }

              return;
            }

            this.recordAggressiveForwardEvent('aggressive-freehunt-release', wave, scanner, adjacentRearGuard, 0, adjacentRearGuard ? 'passed-deepest-adjacent-wave' : 'observed-adjacent-boundary-cleared');
            wave.releaseForwardToFreeHunt();
            return;
          }

          if (!this.shouldRunFrameInterval(wave.getTargetSearchIntervalFrames(), wave.id)) {
            return;
          }

          scanner = wave.getForwardScanner(true);
          if (!scanner) return;
          var target = scanner.findForwardSearchTarget();

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

        findDeepestAdjacentEnemyWaveScanner(wave, scanner) {
          if (!scanner.agent) return null;
          var ownLane = wave.laneId >= 0 ? this.clampLaneId(wave.laneId) : this.getCurrentLaneIdForUnit(scanner);
          if (ownLane < 0) return null;
          var best = null;
          var bestProgress = -Infinity;

          for (var i = 0; i < this.waves.length; i++) {
            var enemyWave = this.waves[i];
            if (!enemyWave) continue;
            if (enemyWave.team === wave.team) continue;
            if (enemyWave.isDeadRuntime(this.frame)) continue;
            if (enemyWave.laneId < 0) continue;
            var enemyLane = this.clampLaneId(enemyWave.laneId);

            if (Math.abs(enemyLane - ownLane) !== 1) {
              continue;
            }

            var enemyScanner = enemyWave.getProgressScanner();

            if (!enemyScanner || !enemyScanner.agent) {
              continue;
            }

            var progress = enemyScanner.agent.pos.x * scanner.forwardDir.x + enemyScanner.agent.pos.z * scanner.forwardDir.z;

            if (progress > bestProgress) {
              bestProgress = progress;
              best = enemyScanner;
            }
          }

          return best;
        }

        countEnemiesAheadInSameLane(scanner) {
          if (scanner.laneId < 0) return 0;
          var ownLane = this.clampLaneId(scanner.laneId);
          var enemies = scanner.team === 0 ? this.teamB : this.teamA;
          var count = 0;

          for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            if (!this.isAliveUnit(enemy)) continue;
            if (enemy.laneId < 0) continue;

            if (this.clampLaneId(enemy.laneId) !== ownLane) {
              continue;
            }

            if (!scanner.hasPassedForwardTarget(enemy)) {
              count++;
            }
          }

          return count;
        }

        recordAggressiveForwardEvent(type, wave, scanner, boundary, enemiesAhead, reason) {
          var _wave$family;

          if (!this.enableBattleTelemetry) return;
          var boundaryWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(boundary);
          this.battleTelemetry.recordAggressiveForwardEvent({
            type,
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: (_wave$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family : String(wave.family),
            reason,
            boundaryWaveId: boundaryWave ? boundaryWave.id : -1,
            boundaryLaneId: boundaryWave ? boundaryWave.laneId : -1,
            boundaryUnitName: boundary ? boundary.unitTypeName : '',
            enemiesAhead,
            combatPoint: this.combatPoint[wave.team] || 0
          });
        }

        processWaveForwardRecoveries() {
          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
              continue;
            }

            wave.refreshInitialForwardCombatGate();
            wave.tryResumeForward(this.refreshLaneBeforeWaveForward);
          }
        }

        processWaveBanners() {
          var bannerInterval = this.shouldRunFrameInterval(this.waveBannerRefreshIntervalFrames, 0);

          if (this.waveBannerCameraVisibilityDirty || bannerInterval) {
            this.updateWaveBannerCameraVisibility(false);
          }

          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];

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
          var visible = this.resolveWaveBannerCameraVisibility();

          if (!force && this.waveBannerVisibilityInitialized && visible === this.waveBannerVisibleByCamera) {
            this.waveBannerCameraVisibilityDirty = false;
            return;
          }

          this.waveBannerVisibilityInitialized = true;
          this.waveBannerVisibleByCamera = visible;
          this.waveBannerCameraVisibilityDirty = false;

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

          var topDownVisibility = this.resolveTopDownZoomBannerVisibility();

          if (topDownVisibility !== null) {
            return topDownVisibility;
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

        resolveTopDownZoomBannerVisibility() {
          var controller = this.cinematicController;
          var topDownCameraDrag = controller && controller.topDownCameraDrag ? controller.topDownCameraDrag : null;

          if (!topDownCameraDrag) {
            return null;
          }

          if (typeof topDownCameraDrag.getTargetFov !== 'function' || typeof topDownCameraDrag.getMinFov !== 'function' || typeof topDownCameraDrag.getMaxFov !== 'function') {
            return null;
          }

          var targetFov = topDownCameraDrag.getTargetFov();
          var minFov = topDownCameraDrag.getMinFov();
          var maxFov = topDownCameraDrag.getMaxFov();

          if (typeof targetFov !== 'number' || typeof minFov !== 'number' || typeof maxFov !== 'number') {
            return null;
          }

          var epsilon = 0.001;

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

          var controller = this.cinematicController;

          if (controller && controller.mainCamera) {
            return controller.mainCamera;
          }

          return null;
        }

        refreshDynamicLaneForWave(wave, force) {
          if (force === void 0) {
            force = false;
          }

          if (!wave) return;
          if (wave.isDeadRuntime(this.frame)) return;
          if (wave.hasBackToLaneUnits()) return;
          var interval = wave.getTargetSearchIntervalFrames();
          var offset = wave.id + Math.floor(interval / 2); // Lane is strategic metadata only. Stagger updates by wave
          // and away from forward scans for the same wave.

          if (!force && !this.shouldRunFrameInterval(interval, offset)) {
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
          if (this.heroForwardUnlocked[team]) {
            return;
          }

          if (this.canAffordAnyMeleeSpawnEntry(team)) {
            return;
          }

          var hero = this.activateHeroForTeam(team);

          if (!this.isAliveUnit(hero)) {
            return;
          }

          this.unlockHeroForward(team, hero);
        }

        unlockHeroForward(team, hero) {
          var laneId = this.getHeroLaneId();
          var heroWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

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
          this.activateHeroBattleTargetSearchRange();
          this.applyHeroBattleTargetSearchRangeToUnit(hero);
          hero.setSteady(false, true);

          if (heroWave) {
            this.ensureBattleWaveRegistered(heroWave);
            heroWave.forceForwardMode();
          }
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

        canTeamAffordAnySpawn(team) {
          return this.canAffordAnySpawnEntry(team);
        }

        canAffordAnyMeleeSpawnEntry(team) {
          var entries = this.getDatabaseTeamEntries(team);

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!this.isValidSpawnEntry(entry)) continue;

            if (entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Archer || entry.family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Monk) {
              continue;
            }

            if (this.canAffordEntry(team, entry)) {
              return true;
            }
          }

          return false;
        }

        activateHeroBattleTargetSearchRange() {
          if (this.heroBattleSearchRangeActive) return;
          this.heroBattleSearchRangeActive = true;
          var multiplier = this.getHeroBattleTargetSearchRangeMultiplier();
          this.applyHeroBattleTargetSearchRangeToTeam(this.teamA, multiplier);
          this.applyHeroBattleTargetSearchRangeToTeam(this.teamB, multiplier);
        }

        applyHeroBattleTargetSearchRangeToTeam(units, multiplier) {
          for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (!this.isAliveUnit(unit)) continue;
            unit.applyTargetSearchRangeMultiplier(multiplier);
          }
        }

        applyHeroBattleTargetSearchRangeToUnit(unit) {
          if (!unit) return;
          if (!this.heroBattleSearchRangeActive) return;
          unit.applyTargetSearchRangeMultiplier(this.getHeroBattleTargetSearchRangeMultiplier());
        }

        getHeroBattleTargetSearchRangeMultiplier() {
          if (!this.unitDatabase) return 1;
          return Math.max(1, this.unitDatabase.heroBattleTargetSearchRangeMultiplier);
        }

        resetBattleTelemetry() {
          this.battleTelemetry.reset(this.enableBattleTelemetry, this.createBattleTelemetryStartConfig());
          this.battleTelemetry.configureDiagnostics(this.battleTelemetryMaxSnapshots, this.battleTelemetryMaxDiagnosticEvents);
        }

        ensureBattleCardRuntime() {
          if (this.battleCardRuntime) return;
          this.battleCardRuntime = new (_crd && BattleCardRuntime === void 0 ? (_reportPossibleCrUseOfBattleCardRuntime({
            error: Error()
          }), BattleCardRuntime) : BattleCardRuntime)(this.battleCardDatabase, event => this.recordBattleCardTelemetryEvent(event));
        }

        recordBattleCardTelemetryEvent(event) {
          if (!this.enableBattleTelemetry) return;
          this.battleTelemetry.recordCardEvent(_extends({}, event, {
            frame: this.frame
          }));
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
          var _this$getBattleCardTe;

          var waves = [];

          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];
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
            activeCardIds: ((_this$getBattleCardTe = this.getBattleCardTelemetrySnapshot().find(entry => entry.team === team)) == null ? void 0 : _this$getBattleCardTe.deck.filter(card => card.active).map(card => card.id)) || [],
            waves
          };
        }

        createBattleTelemetryWaveSnapshot(wave) {
          var _wave$family2;

          var busyCount = 0;
          var targetCount = 0;
          var forwardCount = 0;

          for (var i = 0; i < wave.units.length; i++) {
            var unit = wave.units[i];
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
            familyName: (_wave$family2 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family2 : String(wave.family),
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
          var hero = team === 0 ? this.teamAHero : this.teamBHero;
          if (!this.isAliveUnit(hero)) return 0;
          if (!hero.props) return 0;
          return hero.props.getHealthRatio();
        }

        processBattleWinnerCondition(force) {
          if (force === void 0) {
            force = false;
          }

          if (!this.enableBattleWinnerCheck) return;
          if (this.hasBattleWinner()) return;

          if (this.combatResolutionDepth > 0) {
            if (force) {
              this.pendingForcedBattleWinnerCheck = true;
            }

            return;
          }

          if (!this.enableBattleTelemetry && !this.enableNoAffordableSpawnWinnerFallback) {
            return;
          }

          if (!this.isCombatPointEnabled()) return;

          if (!force && !this.shouldRunFrameInterval(this.battleWinnerCheckIntervalFrames)) {
            return;
          }

          var teamAHasTroops = this.getAliveNonHeroUnitCount(0) > 0 || this.isAliveUnit(this.teamAHero);
          var teamBHasTroops = this.getAliveNonHeroUnitCount(1) > 0 || this.isAliveUnit(this.teamBHero);
          var teamACanSpawn = this.canAffordAnySpawnEntry(0);
          var teamBCanSpawn = this.canAffordAnySpawnEntry(1);
          var teamAEliminated = !teamACanSpawn && !teamAHasTroops;
          var teamBEliminated = !teamBCanSpawn && !teamBHasTroops;

          if (!teamAEliminated && !teamBEliminated) {
            return;
          }

          var loserTeam = teamAEliminated && teamBEliminated ? -1 : teamAEliminated ? 0 : 1;
          var winnerTeam = loserTeam < 0 ? -1 : loserTeam === 0 ? 1 : 0;
          var reason = 'team-eliminated-and-cannot-afford-spawn';
          this.resolveBattleWinner(winnerTeam, loserTeam, reason);
        }

        getAliveNonHeroUnitCount(team) {
          var units = team === 0 ? this.teamA : team === 1 ? this.teamB : null;
          if (!units) return 0;
          var count = 0;

          for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (!this.isAliveUnit(unit)) continue;
            if (unit.isHero) continue;
            count++;
          }

          return count;
        }

        resolveBattleWinner(winnerTeam, loserTeam, reason) {
          if (!this.enableBattleWinnerCheck) return;
          if (this.hasBattleWinner()) return;

          if (this.combatResolutionDepth > 0) {
            this.pendingBattleWinner = {
              winnerTeam,
              loserTeam,
              reason
            };
            return;
          }

          this.battleWinnerTeam = winnerTeam;
          this.battleLoserTeam = loserTeam;
          this.battleWinnerReason = reason;
          this.battleWinnerResolved = true;
          console.log("[BattleWinner] winnerTeam=" + winnerTeam + ", " + ("loserTeam=" + loserTeam + ", reason=" + reason));
          var canFinishTelemetry = this.enableBattleTelemetry && this.battleTelemetry.isEnabled() && !this.battleTelemetry.hasEnded();

          if (canFinishTelemetry) {
            this.battleTelemetry.recordFinalSnapshot(this.createBattleTelemetrySnapshot());
          }

          var progressionResult = this.battleProgressionProvider ? this.battleProgressionProvider.handleBattleResult(winnerTeam, loserTeam, reason) : null;

          if (!canFinishTelemetry) {
            this.scheduleBattleTelemetryPageReload();
            return;
          }

          var report = this.battleTelemetry.finish(winnerTeam, loserTeam, reason, this.frame, this.battleElapsedTime, this.combatPoint, this.aliveCount, this.deathCount, this.killCount, this.counterKillCount, progressionResult);
          this.battleTelemetry.exportReport(report, this.battleTelemetryFilePrefix, this.downloadBattleTelemetryOnEnd, this.logBattleTelemetryOnEnd);
          this.scheduleBattleTelemetryPageReload();
        }

        hasBattleWinner() {
          return this.battleWinnerResolved;
        }

        beginCombatResolution() {
          this.combatResolutionDepth++;
        }

        endCombatResolution() {
          if (this.combatResolutionDepth <= 0) {
            this.combatResolutionDepth = 0;
            return;
          }

          this.combatResolutionDepth--;
          if (this.combatResolutionDepth > 0) return;
          var pendingWinner = this.pendingBattleWinner;
          var shouldCheckFallback = this.pendingForcedBattleWinnerCheck;
          this.pendingBattleWinner = null;
          this.pendingForcedBattleWinnerCheck = false;

          if (pendingWinner) {
            this.resolveBattleWinner(pendingWinner.winnerTeam, pendingWinner.loserTeam, pendingWinner.reason);
          }

          if (!this.hasBattleWinner() && shouldCheckFallback) {
            this.processBattleWinnerCondition(true);
          }
        }

        scheduleBattleTelemetryPageReload() {
          var progressionProvider = this.battleProgressionProvider; // A real campaign keeps its state in local storage and starts its next
          // scene only after telemetry export has been requested. This keeps the
          // battle-end sequence in one owner instead of racing two timers.

          if (progressionProvider) {
            if (!progressionProvider.shouldResetBattleAfterResult()) {
              return;
            }

            var _delayMs = Math.max(0, this.battleTelemetryReloadDelaySeconds) * 1000;

            var _resetBattle = () => {
              if (!progressionProvider.resetBattle()) {
                console.warn('[BattleProgression] scene reset was not started.');
              }
            };

            console.log("[BattleProgression] restart battle runtime in " + ((_delayMs / 1000).toFixed(2) + "s."));

            if (typeof window !== 'undefined' && window.setTimeout) {
              window.setTimeout(_resetBattle, _delayMs);
              return;
            }

            this.scheduleOnce(_resetBattle, _delayMs / 1000);
            return;
          }

          if (!this.reloadPageAfterBattleTelemetryExport) {
            return;
          }

          if (!this.enableBattleTelemetry) {
            return;
          }

          if (typeof window === 'undefined') return;
          if (!window.location) return;
          var nextBatchUrl = this.getNextTelemetryBatchUrl();

          if (this.isTelemetryBatchQueryActive() && !nextBatchUrl) {
            console.log('[BattleTelemetry] telemetry batch query complete.');
            return;
          }

          var delayMs = Math.max(0, this.battleTelemetryReloadDelaySeconds) * 1000;
          console.log("[BattleTelemetry] reload page in " + ((delayMs / 1000).toFixed(2) + "s."));
          window.setTimeout(() => {
            if (nextBatchUrl) {
              window.location.replace(nextBatchUrl);
              return;
            }

            window.location.reload();
          }, delayMs);
        }

        getNextTelemetryBatchUrl() {
          if (!this.isTelemetryBatchQueryActive()) {
            return '';
          }

          if (typeof window === 'undefined') return '';
          if (!window.location) return '';
          var params = new URLSearchParams(window.location.search);
          this.normalizeTelemetryBatchQueryParams(params);
          var levelQuery = this.getTelemetryLevelQueryConfig(params);

          if (levelQuery.active) {
            params.set('currentLevel', "" + levelQuery.currentLevel);
            params.set('TotalLevels', "" + levelQuery.totalLevels);
            this.removeLegacyAccuracyBatchParams(params);

            if (levelQuery.currentLevel >= levelQuery.totalLevels) {
              return '';
            }

            params.set('currentLevel', "" + (levelQuery.currentLevel + 1));
            return this.buildTelemetryBatchUrl(params);
          }

          var team = this.getTelemetryBatchQueryInt(params, 'team', 0) === 1 ? 1 : 0;
          var currentAcc = this.clamp01(this.getTelemetryBatchQueryNumber(params, 'currentAcc', 0));
          var currentBatch = Math.max(0, this.getTelemetryBatchQueryInt(params, 'currentBatch', 0));
          var step = Math.max(0, this.getTelemetryBatchQueryNumber(params, 'step', 0));
          var numBatchPerStep = Math.max(1, this.getTelemetryBatchQueryInt(params, 'numBatchPerStep', 1));
          var end = this.clamp01(this.getTelemetryBatchQueryNumber(params, 'end', 1));
          var nextBatch = currentBatch + 1;
          params.set('team', "" + team);
          params.set('step', this.formatTelemetryBatchNumber(step));
          params.set('numBatchPerStep', "" + numBatchPerStep);
          params.set('end', this.formatTelemetryBatchNumber(end));

          if (nextBatch < numBatchPerStep) {
            params.set('currentAcc', this.formatTelemetryBatchNumber(currentAcc));
            params.set('currentBatch', "" + nextBatch);
            return this.buildTelemetryBatchUrl(params);
          }

          if (currentAcc >= end - 0.000001) {
            return '';
          }

          if (step <= 0) {
            return '';
          }

          var nextAcc = Math.min(end, currentAcc + step);
          params.set('currentAcc', this.formatTelemetryBatchNumber(nextAcc));
          params.set('currentBatch', '0');
          return this.buildTelemetryBatchUrl(params);
        }

        isTelemetryBatchQueryActive() {
          if (typeof window === 'undefined') return false;
          if (!window.location) return false;
          var params = new URLSearchParams(window.location.search);
          this.normalizeTelemetryBatchQueryParams(params);

          if (this.getTelemetryLevelQueryConfig(params).active) {
            return true;
          }

          return this.hasTelemetryBatchQueryParam(params, 'currentAcc') || this.hasTelemetryBatchQueryParam(params, 'currentBatch') || this.hasTelemetryBatchQueryParam(params, 'step') || this.hasTelemetryBatchQueryParam(params, 'numBatchPerStep') || this.hasTelemetryBatchQueryParam(params, 'end');
        }

        getTelemetryLevelQueryConfig(params) {
          var totalLevels = Math.max(0, this.getTelemetryBatchQueryInt(params, 'TotalLevels', 0));

          if (totalLevels <= 0) {
            return {
              active: false,
              currentLevel: 0,
              totalLevels: 0,
              levelProgress: 0
            };
          }

          var currentLevel = Math.max(1, Math.min(totalLevels, this.getTelemetryBatchQueryInt(params, 'currentLevel', 1)));
          var levelProgress = totalLevels <= 1 ? 1 : (currentLevel - 1) / (totalLevels - 1);
          return {
            active: true,
            currentLevel,
            totalLevels,
            levelProgress
          };
        }

        removeLegacyAccuracyBatchParams(params) {
          var keys = ['currentAcc', 'currentBatch', 'step', 'numBatchPerStep', 'end'];

          for (var i = 0; i < keys.length; i++) {
            params.delete(keys[i]);
            params.delete("?" + keys[i]);
          }
        }

        getTelemetryBatchQueryNumber(params, key, fallback) {
          var value = Number(this.getTelemetryBatchQueryParam(params, key));
          return Number.isFinite(value) ? value : fallback;
        }

        getTelemetryBatchQueryInt(params, key, fallback) {
          return Math.floor(this.getTelemetryBatchQueryNumber(params, key, fallback));
        }

        formatTelemetryBatchNumber(value) {
          return "" + Math.round(value * 1000000) / 1000000;
        }

        hasTelemetryBatchQueryParam(params, key) {
          return params.has(key) || params.has("?" + key);
        }

        getTelemetryBatchQueryParam(params, key) {
          var _params$get2;

          return (_params$get2 = params.get("?" + key)) != null ? _params$get2 : params.get(key);
        }

        normalizeTelemetryBatchQueryParams(params) {
          var keys = ['team', 'currentAcc', 'currentBatch', 'step', 'numBatchPerStep', 'end', 'currentLevel', 'TotalLevels', 'totalLevels'];

          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var badKey = "?" + key;
            var badValue = params.get(badKey);

            if (badValue !== null) {
              params.set(key, badValue);
            }

            params.delete(badKey);
          }

          var lowerCaseTotalLevels = params.get('totalLevels');

          if (lowerCaseTotalLevels !== null && !params.has('TotalLevels')) {
            params.set('TotalLevels', lowerCaseTotalLevels);
          }

          params.delete('totalLevels');
        }

        buildTelemetryBatchUrl(params) {
          if (typeof window === 'undefined') return '';
          if (!window.location) return '';
          var location = window.location;
          var origin = location.origin || location.protocol + "//" + location.host;
          var query = params.toString();
          return "" + origin + location.pathname + ("" + (query ? "?" + query : '')) + ("" + (location.hash || ''));
        }

        createBattleTelemetryStartConfig() {
          return {
            startedAt: new Date().toISOString(),
            telemetryBatch: this.createBattleTelemetryBatchConfigSnapshot(),
            battleBounds: {
              minX: this.battleMinX,
              maxX: this.battleMaxX,
              minZ: this.battleMinZ,
              maxZ: this.battleMaxZ
            },
            laneCount: this.getSafeLaneCount(),
            initialCombatPoint: [this.initialCombatPoint[0], this.initialCombatPoint[1]],
            unitStats: this.createBattleTelemetryUnitStatsSnapshot(),
            counterRules: this.createBattleTelemetryCounterRuleSnapshot(),
            cards: this.getBattleCardTelemetrySnapshot(),
            progression: this.battleProgressionProvider ? this.battleProgressionProvider.createTelemetrySnapshot() : undefined
          };
        }

        createBattleTelemetryBatchConfigSnapshot() {
          var inactive = {
            active: false,
            team: 0,
            currentAcc: 0,
            currentBatch: 0,
            step: 0,
            numBatchPerStep: 1,
            end: 1,
            levelMode: false,
            currentLevel: 0,
            totalLevels: 0,
            levelProgress: 0
          };

          if (!this.isTelemetryBatchQueryActive()) {
            return inactive;
          }

          if (typeof window === 'undefined') return inactive;
          if (!window.location) return inactive;
          var params = new URLSearchParams(window.location.search);
          this.normalizeTelemetryBatchQueryParams(params);
          var team = this.getTelemetryBatchQueryInt(params, 'team', 0) === 1 ? 1 : 0;
          var levelQuery = this.getTelemetryLevelQueryConfig(params);

          if (levelQuery.active) {
            return {
              active: true,
              team,
              currentAcc: levelQuery.levelProgress,
              currentBatch: 0,
              step: 0,
              numBatchPerStep: 1,
              end: 1,
              levelMode: true,
              currentLevel: levelQuery.currentLevel,
              totalLevels: levelQuery.totalLevels,
              levelProgress: levelQuery.levelProgress
            };
          }

          return {
            active: true,
            team,
            currentAcc: this.clamp01(this.getTelemetryBatchQueryNumber(params, 'currentAcc', 0)),
            currentBatch: Math.max(0, this.getTelemetryBatchQueryInt(params, 'currentBatch', 0)),
            step: Math.max(0, this.getTelemetryBatchQueryNumber(params, 'step', 0)),
            numBatchPerStep: Math.max(1, this.getTelemetryBatchQueryInt(params, 'numBatchPerStep', 1)),
            end: this.clamp01(this.getTelemetryBatchQueryNumber(params, 'end', 1)),
            levelMode: false,
            currentLevel: 0,
            totalLevels: 0,
            levelProgress: 0
          };
        }

        createBattleTelemetryUnitStatsSnapshot() {
          var result = [];

          for (var team = 0; team <= 1; team++) {
            var entries = this.getDatabaseTeamEntries(team);

            for (var i = 0; i < entries.length; i++) {
              var _entry$family;

              var entry = entries[i];
              if (!entry) continue;
              result.push({
                team,
                name: entry.name,
                family: entry.family,
                familyName: (_entry$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                  error: Error()
                }), UnitFamily) : UnitFamily)[entry.family]) != null ? _entry$family : String(entry.family),
                tier: entry.tier,
                unlocked: entry.unlocked,
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
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter) return [];
          var result = [];

          for (var i = 0; i < counter.rules.length; i++) {
            var _rule$attackerFamily, _rule$defenderFamily;

            var rule = counter.rules[i];
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
          var killerTeam = killer.team;
          var bountyValue = this.getVictimBountyValue(victim);
          if (bountyValue <= 0) return;
          var reward = this.unitDatabase.calculateKillRewardFromBounty(bountyValue, isCounterKill);
          this.addCombatPoint(killerTeam, reward);

          if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordCombatPointEarned(killer, victim, reward, isCounterKill, this.frame, this.battleElapsedTime);
          }
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
          var unlocked = this.unitDatabase ? this.unitDatabase.isEntryUnlocked(entry) : entry.unlocked;

          if (!unlocked) {
            return false;
          }

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

        isUnitNameUnlocked(team, unitName) {
          var safeName = (unitName || '').trim();
          if (!safeName) return false;
          var entry = this.getTeamEntry(team, safeName);
          if (!entry) return false;
          return this.unitDatabase ? this.unitDatabase.isEntryUnlocked(entry) : entry.unlocked;
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
          if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordDespawn(unit, this.frame, this.battleElapsedTime);
          }

          var wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);

          if (wave) {
            wave.invalidateRuntimeState();
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
          this.spatialGrid.setBattlefieldBounds(this.battleMinX, this.battleMaxX, this.battleMinZ, this.battleMaxZ);
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

        spawnWaveByEntry(team, entry, laneId, aggressiveForward, spawnReason) {
          if (laneId === void 0) {
            laneId = -1;
          }

          if (aggressiveForward === void 0) {
            aggressiveForward = false;
          }

          if (spawnReason === void 0) {
            spawnReason = '';
          }

          if (!this.isValidSpawnEntry(entry)) {
            return null;
          }

          var baseZ = team === 0 ? this.teamASpawnZ : this.teamBSpawnZ;
          var wave = this.spawnEntryFormation(team, entry, baseZ, true, laneId, aggressiveForward, spawnReason);
          this.requestSpatialGridRebuild();
          return wave;
        }

        spawnWaveByName(team, unitName, laneId, aggressiveForward, spawnReason) {
          if (laneId === void 0) {
            laneId = -1;
          }

          if (aggressiveForward === void 0) {
            aggressiveForward = false;
          }

          if (spawnReason === void 0) {
            spawnReason = '';
          }

          var entry = this.getTeamEntry(team, unitName);
          if (!entry) return null;
          return this.spawnWaveByEntry(team, entry, laneId, aggressiveForward, spawnReason);
        }

        spawnEntryFormation(team, entry, baseZ, spendCost, requestedLaneId, aggressiveForward, spawnReason) {
          if (requestedLaneId === void 0) {
            requestedLaneId = -1;
          }

          if (aggressiveForward === void 0) {
            aggressiveForward = false;
          }

          if (spawnReason === void 0) {
            spawnReason = '';
          }

          if (!this.isValidSpawnEntry(entry)) {
            return null;
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
          var prefab = entry ? entry.waveBannerPrefab : null;
          if (!prefab) return;
          if (!wave) return;
          if (wave.getAliveCount() <= 0) return;
          var node = this.acquireWaveBanner(prefab);
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
          params[0] = this.srgbChannelToLinear(color.r / 255);
          params[1] = this.srgbChannelToLinear(color.g / 255);
          params[2] = this.srgbChannelToLinear(color.b / 255);
          params[3] = color.a / 255;
          return params;
        }

        srgbChannelToLinear(value) {
          var v = Math.min(1, Math.max(0, value));
          return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
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
          var topDownCameraDrag = controllerAny && controllerAny.topDownCameraDrag ? controllerAny.topDownCameraDrag : null;

          if (topDownCameraDrag && topDownCameraDrag.node) {
            this.registeredTopDownCameraDragNode = topDownCameraDrag.node;
            topDownCameraDrag.node.on(TopDownZoomRangeChangedEvent, this.onWaveBannerCameraVisibilityChanged, this);
          }

          if (typeof controllerAny.isBannerVisibilityBlocked === 'function') {
            this.waveBannerCameraBlocked = !!controllerAny.isBannerVisibilityBlocked();
          }
        }

        unregisterWaveBannerCameraEvents() {
          var controller = this.registeredCinematicController;

          if (controller && isValid(controller, true)) {
            var controllerNode = controller.node;

            if (controllerNode && isValid(controllerNode, true)) {
              controllerNode.off(BannerVisibilityBlockedEvent, this.onWaveBannerCameraBlockedChanged, this);
            }
          }

          var topDownCameraDragNode = this.registeredTopDownCameraDragNode;

          if (topDownCameraDragNode && isValid(topDownCameraDragNode, true)) {
            topDownCameraDragNode.off(TopDownZoomRangeChangedEvent, this.onWaveBannerCameraVisibilityChanged, this);
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

          if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordSpawn(unit, team, entry.name, entry.family, entry.tier, wave.id, this.frame, this.battleElapsedTime);
          }
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

        getLaneWidth() {
          var count = this.getSafeLaneCount();
          var width = this.battleMaxX - this.battleMinX;

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
          var width = this.getLaneWidth();
          if (width <= 0) return 0;
          var centerX = this.getLaneCenterX(laneId);
          var coreHalfWidth = width * 0.25;
          var minX = centerX - coreHalfWidth;
          var maxX = centerX + coreHalfWidth;
          if (x < minX) return 1;
          if (x > maxX) return -1;
          return 0;
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

          var unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.family, entry.tier, pos, 0, this.node, entry.maxSpeed, entry.canBePush, entry.canBePassedThroughByForwardAlly, entry.attackRange, entry.attackIntervalMin, entry.attackIntervalMax, entry.health, entry.damage, entry.damageRadius, entry.defense);
          this.applyHeroBattleTargetSearchRangeToUnit(unit);

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

          var unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.family, entry.tier, pos, 1, this.node, entry.maxSpeed, entry.canBePush, entry.canBePassedThroughByForwardAlly, entry.attackRange, entry.attackIntervalMin, entry.attackIntervalMax, entry.health, entry.damage, entry.damageRadius, entry.defense);
          this.applyHeroBattleTargetSearchRangeToUnit(unit);

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
              this.processBattleWinnerCondition(true);
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
              this.processBattleWinnerCondition(true);
            }

            return;
          }
        }

        handleHeroDeath(unit) {
          var team = unit.team;

          if (team === 0 || team === 1) {
            // A hero is a one-time final deployment. Keep this latched after
            // death so the low-CP activation check cannot respawn it.
            this.heroForwardUnlocked[team] = true;
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

          if (team !== 0 && team !== 1) {
            return;
          }

          this.resolveHeroDefeat(unit);
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
          this.teamAHeroEntry = this.unitDatabase.getHeroEntry(0);
          this.teamBHeroEntry = this.unitDatabase.getHeroEntry(1);
          this.captureHeroLine(0, this.teamAHeroEntry);
          this.captureHeroLine(1, this.teamBHeroEntry);
          this.prepareSceneHero(this.teamAHeroEntry);
          this.prepareSceneHero(this.teamBHeroEntry);
        }

        captureHeroLine(team, heroEntry) {
          if (team !== 0 && team !== 1) return;
          if (!heroEntry || !heroEntry.heroNode) return;
          var lineZ = heroEntry.heroNode.worldPosition.z;

          if (Number.isFinite(lineZ)) {
            this.heroLineZ[team] = lineZ;
          }
        }

        prepareSceneHero(heroEntry) {
          if (!heroEntry || !heroEntry.heroNode) return;
          heroEntry.heroNode.active = false;
        }

        activateHeroForTeam(team) {
          var existing = team === 0 ? this.teamAHero : this.teamBHero;

          if (this.isAliveUnit(existing)) {
            return existing;
          }

          var entry = team === 0 ? this.teamAHeroEntry : this.teamBHeroEntry;
          return this.registerSceneHero(entry, team, team === 0 ? 'hero_a' : 'hero_b');
        }

        registerSceneHero(heroEntry, team, fallbackTypeName) {
          if (!heroEntry) return null;
          if (!heroEntry.heroNode) return null;
          heroEntry.heroNode.active = true;
          var hero = heroEntry.heroNode.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);

          if (!hero) {
            heroEntry.heroNode.active = false;
            return null;
          }

          if (!hero.node.activeInHierarchy) {
            hero.node.active = false;
            return null;
          }

          hero.isHero = true;
          var props = hero.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
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
          var currentPosition = hero.node.worldPosition;
          this.tempSpawnPos.set(this.getLaneCenterX(this.getHeroLaneId()), currentPosition.y, currentPosition.z);
          hero.node.setWorldPosition(this.tempSpawnPos);
          hero.moveSpeed = heroEntry.maxSpeed;
          hero.canBePassedThroughByForwardAlly = false;
          hero.heroGuardDistance = heroEntry.guardDistance;
          hero.isSteady = false;
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

          if (this.enableBattleTelemetry) {
            var _heroEntry$family;

            var heroWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

            if (heroWave) {
              this.battleTelemetry.recordSpawn(hero, team, unitTypeName, heroEntry.family, heroEntry.tier, heroWave.id, this.frame, this.battleElapsedTime);
            }

            this.battleTelemetry.recordWaveSpawnEvent({
              type: 'hero-activated',
              frame: this.frame,
              time: this.battleElapsedTime,
              team,
              waveId: heroWave ? heroWave.id : -1,
              laneId: this.getHeroLaneId(),
              unitName: unitTypeName,
              familyName: (_heroEntry$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily)[heroEntry.family]) != null ? _heroEntry$family : String(heroEntry.family),
              aggressiveForward: false,
              reason: 'cannot-afford-any-melee-wave',
              combatPoint: this.combatPoint[team] || 0,
              targetSearchRangeMultiplier: this.getHeroBattleTargetSearchRangeMultiplier()
            });
          }

          this.requestSpatialGridRebuild();
          this.requestBattleStatsUIRefresh();
          return hero;
        }

        registerHeroWave(hero, team, unitTypeName, family, tier) {
          var laneId = this.getHeroLaneId();
          var previousWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

          if (previousWave) {
            this.removeBattleWaveReference(previousWave);
            previousWave.releaseReferences();
          }

          hero.laneId = laneId;
          var wave = new (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
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

        clamp01(value) {
          return Math.max(0, Math.min(1, value));
        }

      }, _class3.instance = null, _class3.originalDirectorTick = null, _class3.directorTimeScaleOwner = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "unitDatabase", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "battleCardDatabase", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "cinematicController", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "useWorkerRVO", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "targetFrameRate", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 60;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "battleTimeScale", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "resetBattleTimeScaleOnDestroy", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "showCocosProfilerStats", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "allowProfilerStatsQueryParam", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "enableBattleWinnerCheck", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "enableNoAffordableSpawnWinnerFallback", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "battleWinnerCheckIntervalFrames", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "enableBattleTelemetry", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "downloadBattleTelemetryOnEnd", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "reloadPageAfterBattleTelemetryExport", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryReloadDelaySeconds", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "logBattleTelemetryOnEnd", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryFilePrefix", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'battle-telemetry';
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetrySnapshotIntervalFrames", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 60;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryMaxSnapshots", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 240;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryMaxDiagnosticEvents", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3000;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "battleMinX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -28;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 28;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "battleMinZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -18;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 18;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "rvoUpdateFrameOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "maxRvoStepDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.05;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "visualSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 16;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridCellSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateFrameOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class2.prototype, "useWorkerSpatialTargetQuery", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class2.prototype, "teamAAliveLabel", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class2.prototype, "teamADeathLabel", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class2.prototype, "teamBAliveLabel", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class2.prototype, "teamBDeathLabel", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class2.prototype, "teamAKillLabel", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class2.prototype, "teamBKillLabel", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class2.prototype, "teamACounterKillLabel", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class2.prototype, "teamBCounterKillLabel", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class2.prototype, "teamACombatPointLabel", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class2.prototype, "teamBCombatPointLabel", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor45 = _applyDecoratedDescriptor(_class2.prototype, "spawnImmediatelyOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor46 = _applyDecoratedDescriptor(_class2.prototype, "prewarmOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor47 = _applyDecoratedDescriptor(_class2.prototype, "spawnWaveInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor48 = _applyDecoratedDescriptor(_class2.prototype, "maxAutoSpawnDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor49 = _applyDecoratedDescriptor(_class2.prototype, "teamASpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -20;
        }
      }), _descriptor50 = _applyDecoratedDescriptor(_class2.prototype, "teamBSpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor51 = _applyDecoratedDescriptor(_class2.prototype, "formationZNoise", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor52 = _applyDecoratedDescriptor(_class2.prototype, "centerGapWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor53 = _applyDecoratedDescriptor(_class2.prototype, "enableLaneSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor54 = _applyDecoratedDescriptor(_class2.prototype, "laneCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor55 = _applyDecoratedDescriptor(_class2.prototype, "defaultSpawnLane", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor56 = _applyDecoratedDescriptor(_class2.prototype, "autoSpawnRandomLane", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor57 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerRefreshIntervalFrames", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 12;
        }
      }), _descriptor58 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerCamera", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor59 = _applyDecoratedDescriptor(_class2.prototype, "enableWaveBannerCameraVisibility", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor60 = _applyDecoratedDescriptor(_class2.prototype, "hideWaveBannerInOrbitMode", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor61 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerHideFovBelow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 35;
        }
      }), _descriptor62 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerShowFovAbove", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 38;
        }
      }), _descriptor63 = _applyDecoratedDescriptor(_class2.prototype, "circleObstacles", [_dec34], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor64 = _applyDecoratedDescriptor(_class2.prototype, "rectObstacles", [_dec35], {
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