System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14", "__unresolved_15", "__unresolved_16", "__unresolved_17", "__unresolved_18"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Color, Component, Vec3, Label, Node, instantiate, isValid, MeshRenderer, game, profiler, director, Unit, UnitProps, RVOSimulator, RVOWorkerSimulator, ObstacleCircle, ObstacleRect, UnitSpawner, UnitBehavior, BattleSpatialGrid, BattleWave, CounterSettings, UnitFamily, BattleTelemetry, BattleUnitDatabase, BattleCardDatabase, BattleCardModifier, BattleCardRuntime, HealthBar3D, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _descriptor47, _descriptor48, _descriptor49, _descriptor50, _descriptor51, _descriptor52, _descriptor53, _descriptor54, _descriptor55, _descriptor56, _descriptor57, _descriptor58, _descriptor59, _descriptor60, _descriptor61, _descriptor62, _descriptor63, _descriptor64, _descriptor65, _descriptor66, _class3, _crd, ccclass, property, BannerVisibilityBlockedEvent, TopDownZoomRangeChangedEvent, BattleWaveSpawnedEvent, NoBattleCardModifiers, GameManager;

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

  function _reportPossibleCrUseOfBattleTelemetryBreakthroughCashout(extras) {
    _reporterNs.report("BattleTelemetryBreakthroughCashout", "./BattleTelemetry", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTelemetryCounterRuleSnapshot(extras) {
    _reporterNs.report("BattleTelemetryCounterRuleSnapshot", "./BattleTelemetry", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTelemetryUnitSnapshot(extras) {
    _reporterNs.report("BattleTelemetryUnitSnapshot", "./BattleTelemetry", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleTelemetryWaveUnitSnapshot(extras) {
    _reporterNs.report("BattleTelemetryWaveUnitSnapshot", "./BattleTelemetry", _context.meta, extras);
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
      Node = _cc.Node;
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
      NoBattleCardModifiers = {
        damageMultiplier: 1,
        defenseFlat: 0,
        attackRangeMultiplier: 1,
        moveSpeedMultiplier: 1,
        damageRadiusMultiplier: 1,
        counterImmune: false
      };

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(_crd && BattleUnitDatabase === void 0 ? (_reportPossibleCrUseOfBattleUnitDatabase({
        error: Error()
      }), BattleUnitDatabase) : BattleUnitDatabase), _dec3 = property(_crd && BattleCardDatabase === void 0 ? (_reportPossibleCrUseOfBattleCardDatabase({
        error: Error()
      }), BattleCardDatabase) : BattleCardDatabase), _dec4 = property({
        displayName: 'Enable Battle Card Effects',
        tooltip: 'When disabled, player and enemy cards remain owned, purchasable, and upgradeable, but no card activates or affects combat. Card cooldowns and cooldown-skip ads are also inactive for that battle.'
      }), _dec5 = property(Component), _dec6 = property({
        tooltip: 'Target frame rate for mobile performance tests. Use 30, 45, or 60. Set 0 or lower to keep the engine default.'
      }), _dec7 = property({
        min: 0.1,
        tooltip: 'Global battle speed multiplier for faster telemetry tests. 1 = normal speed. Values above 1 speed up Cocos update/schedule time; RVO is sub-stepped so large dt is not simply clamped away.'
      }), _dec8 = property({
        tooltip: 'Reset the global Cocos scheduler time scale back to 1 when this GameManager is destroyed. Keep enabled unless another system owns global time scale.'
      }), _dec9 = property({
        tooltip: 'Show the built-in Cocos profiler overlay in build/preview. Keep off for normal release tests unless you need on-device FPS/drawcall stats.'
      }), _dec10 = property({
        tooltip: 'Allow URL query params ?stats=1 or ?profiler=1 to show the Cocos profiler overlay in browser builds.'
      }), _dec11 = property({
        tooltip: 'Check battle winner rules. A Hero death ends the battle; reaching the enemy Hero line wins only when that team has no living units on the scene.'
      }), _dec12 = property({
        tooltip: 'Optional fallback winner rule: a team loses only when it has no living troops, including Hero, and can no longer afford any valid spawn entry.'
      }), _dec13 = property({
        min: 1,
        tooltip: 'Frames between optional elimination-and-affordability winner checks.'
      }), _dec14 = property({
        tooltip: 'Collect aggregate battle telemetry and export a JSON report when the battle winner rule is reached.'
      }), _dec15 = property({
        tooltip: 'Automatically download the battle telemetry JSON in browser preview/build when the temporary winner condition is reached.'
      }), _dec16 = property({
        tooltip: 'Reload the browser page after telemetry export. This does not store reports in localStorage or skip per-match downloads.'
      }), _dec17 = property({
        min: 0,
        tooltip: 'Seconds to wait after triggering telemetry JSON download before reloading the browser page.'
      }), _dec18 = property({
        tooltip: 'Also print the full telemetry object to console. The report is always kept on window.__battleTelemetryReport when available.'
      }), _dec19 = property({
        tooltip: 'Output file prefix for downloaded battle telemetry reports.'
      }), _dec20 = property({
        min: 1,
        tooltip: 'Frames between compact battle snapshots in telemetry. Each snapshot records team, wave, lane, and recovery state; the final snapshot also retains per-unit state.'
      }), _dec21 = property({
        min: 0,
        tooltip: 'Maximum diagnostic snapshots stored in one telemetry report. Set 0 to disable snapshots while keeping aggregate telemetry.'
      }), _dec22 = property({
        min: 0,
        tooltip: 'Maximum chronological diagnostic events stored in one telemetry report. Includes spawn decisions, hero damage, area damage, and kills.'
      }), _dec23 = property({
        min: 0,
        tooltip: 'Maximum scanner search traces stored per battle. A circular buffer retains the newest samples; set 0 to disable scanner path tracing.'
      }), _dec24 = property(Label), _dec25 = property(Label), _dec26 = property(Label), _dec27 = property(Label), _dec28 = property(Label), _dec29 = property(Label), _dec30 = property(Label), _dec31 = property(Label), _dec32 = property(Label), _dec33 = property(Label), _dec34 = property({
        min: 1,
        tooltip: 'Frames between safety wave-banner holder refresh checks. Set to 1 to refresh every frame.'
      }), _dec35 = property(Camera), _dec36 = property({
        type: [_crd && ObstacleCircle === void 0 ? (_reportPossibleCrUseOfObstacleCircle({
          error: Error()
        }), ObstacleCircle) : ObstacleCircle]
      }), _dec37 = property({
        type: [_crd && ObstacleRect === void 0 ? (_reportPossibleCrUseOfObstacleRect({
          error: Error()
        }), ObstacleRect) : ObstacleRect]
      }), _dec(_class = (_class2 = (_class3 = class GameManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "unitDatabase", _descriptor, this);

          _initializerDefineProperty(this, "battleCardDatabase", _descriptor2, this);

          _initializerDefineProperty(this, "enableBattleCardEffects", _descriptor3, this);

          _initializerDefineProperty(this, "cinematicController", _descriptor4, this);

          _initializerDefineProperty(this, "useWorkerRVO", _descriptor5, this);

          _initializerDefineProperty(this, "targetFrameRate", _descriptor6, this);

          _initializerDefineProperty(this, "battleTimeScale", _descriptor7, this);

          _initializerDefineProperty(this, "resetBattleTimeScaleOnDestroy", _descriptor8, this);

          _initializerDefineProperty(this, "showCocosProfilerStats", _descriptor9, this);

          _initializerDefineProperty(this, "allowProfilerStatsQueryParam", _descriptor10, this);

          _initializerDefineProperty(this, "enableBattleWinnerCheck", _descriptor11, this);

          _initializerDefineProperty(this, "enableNoAffordableSpawnWinnerFallback", _descriptor12, this);

          _initializerDefineProperty(this, "battleWinnerCheckIntervalFrames", _descriptor13, this);

          _initializerDefineProperty(this, "enableBattleTelemetry", _descriptor14, this);

          _initializerDefineProperty(this, "downloadBattleTelemetryOnEnd", _descriptor15, this);

          _initializerDefineProperty(this, "reloadPageAfterBattleTelemetryExport", _descriptor16, this);

          _initializerDefineProperty(this, "battleTelemetryReloadDelaySeconds", _descriptor17, this);

          _initializerDefineProperty(this, "logBattleTelemetryOnEnd", _descriptor18, this);

          _initializerDefineProperty(this, "battleTelemetryFilePrefix", _descriptor19, this);

          _initializerDefineProperty(this, "battleTelemetrySnapshotIntervalFrames", _descriptor20, this);

          _initializerDefineProperty(this, "battleTelemetryMaxSnapshots", _descriptor21, this);

          _initializerDefineProperty(this, "battleTelemetryMaxDiagnosticEvents", _descriptor22, this);

          _initializerDefineProperty(this, "battleTelemetryMaxScannerTraces", _descriptor23, this);

          this.teamAHero = null;
          this.teamBHero = null;

          _initializerDefineProperty(this, "battleMinX", _descriptor24, this);

          _initializerDefineProperty(this, "battleMaxX", _descriptor25, this);

          _initializerDefineProperty(this, "battleMinZ", _descriptor26, this);

          _initializerDefineProperty(this, "battleMaxZ", _descriptor27, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor28, this);

          _initializerDefineProperty(this, "rvoUpdateFrameOffset", _descriptor29, this);

          _initializerDefineProperty(this, "maxRvoStepDeltaTime", _descriptor30, this);

          this.frame = 0;

          _initializerDefineProperty(this, "visualSmooth", _descriptor31, this);

          _initializerDefineProperty(this, "spatialGridCellSize", _descriptor32, this);

          _initializerDefineProperty(this, "spatialGridUpdateInterval", _descriptor33, this);

          _initializerDefineProperty(this, "spatialGridUpdateFrameOffset", _descriptor34, this);

          _initializerDefineProperty(this, "useWorkerSpatialTargetQuery", _descriptor35, this);

          this.spatialGrid = new (_crd && BattleSpatialGrid === void 0 ? (_reportPossibleCrUseOfBattleSpatialGrid({
            error: Error()
          }), BattleSpatialGrid) : BattleSpatialGrid)();

          _initializerDefineProperty(this, "teamAAliveLabel", _descriptor36, this);

          _initializerDefineProperty(this, "teamADeathLabel", _descriptor37, this);

          _initializerDefineProperty(this, "teamBAliveLabel", _descriptor38, this);

          _initializerDefineProperty(this, "teamBDeathLabel", _descriptor39, this);

          _initializerDefineProperty(this, "teamAKillLabel", _descriptor40, this);

          _initializerDefineProperty(this, "teamBKillLabel", _descriptor41, this);

          _initializerDefineProperty(this, "teamACounterKillLabel", _descriptor42, this);

          _initializerDefineProperty(this, "teamBCounterKillLabel", _descriptor43, this);

          _initializerDefineProperty(this, "teamACombatPointLabel", _descriptor44, this);

          _initializerDefineProperty(this, "teamBCombatPointLabel", _descriptor45, this);

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
          this.heroDefeatDetected = false;
          this.battleProgressionProvider = null;
          this.combatResolutionDepth = 0;
          this.pendingForcedBattleWinnerCheck = false;
          this.pendingBattleWinner = null;

          _initializerDefineProperty(this, "enableAutoSpawn", _descriptor46, this);

          _initializerDefineProperty(this, "spawnImmediatelyOnStart", _descriptor47, this);

          _initializerDefineProperty(this, "prewarmOnStart", _descriptor48, this);

          _initializerDefineProperty(this, "spawnWaveInterval", _descriptor49, this);

          _initializerDefineProperty(this, "maxAutoSpawnDeltaTime", _descriptor50, this);

          _initializerDefineProperty(this, "teamASpawnZ", _descriptor51, this);

          _initializerDefineProperty(this, "teamBSpawnZ", _descriptor52, this);

          _initializerDefineProperty(this, "formationZNoise", _descriptor53, this);

          _initializerDefineProperty(this, "centerGapWidth", _descriptor54, this);

          _initializerDefineProperty(this, "enableLaneSpawn", _descriptor55, this);

          _initializerDefineProperty(this, "laneCount", _descriptor56, this);

          _initializerDefineProperty(this, "defaultSpawnLane", _descriptor57, this);

          _initializerDefineProperty(this, "autoSpawnRandomLane", _descriptor58, this);

          _initializerDefineProperty(this, "waveBannerRefreshIntervalFrames", _descriptor59, this);

          _initializerDefineProperty(this, "waveBannerCamera", _descriptor60, this);

          _initializerDefineProperty(this, "enableWaveBannerCameraVisibility", _descriptor61, this);

          _initializerDefineProperty(this, "hideWaveBannerInOrbitMode", _descriptor62, this);

          _initializerDefineProperty(this, "waveBannerHideFovBelow", _descriptor63, this);

          _initializerDefineProperty(this, "waveBannerShowFovAbove", _descriptor64, this);

          this.spawnWaveTimer = 0;

          _initializerDefineProperty(this, "circleObstacles", _descriptor65, this);

          _initializerDefineProperty(this, "rectObstacles", _descriptor66, this);

          this.sim = null;
          this.teamA = [];
          this.teamB = [];
          this.waves = [];
          this.nextWaveId = 1;
          this.spawner = void 0;
          this.teamAPrefabMap = new Map();
          this.teamBPrefabMap = new Map();
          this.tempSpawnPos = new Vec3();
          this.centeredRowXBuffer = [];
          this.teamAHeroWave = null;
          this.teamBHeroWave = null;
          this.teamAHeroEntry = null;
          this.teamBHeroEntry = null;
          this.heroLineZ = [NaN, NaN];
          this.heroForwardUnlocked = [false, false];

          this.refreshLaneBeforeWaveForward = wave => {
            // A normal wave owns the lane of its last defeated target; an
            // aggressive wave restores its origin lane. Never replace that
            // strategic choice with the scanner's temporary combat position.
            const previousLaneId = wave.laneId;
            wave.applyDefeatedTargetLaneForRegroup();
            this.handleWaveStrategicLaneChanged(wave, previousLaneId);
          };

          this.forwardScannerSearchFrame = new WeakMap();
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
          this.waveBannerAggressiveTintCache = new WeakMap();
          this.waveBannerHealthBarCache = new WeakMap();
          this.fallbackTeamABannerColor = new Color(0, 70, 255, 255);
          this.fallbackTeamBBannerColor = new Color(255, 0, 0, 255);
          this.normalWaveBannerTintParams = [1, 1, 1, 1];
          this.aggressiveWaveBannerTintParams = [1, 0.6795424696, 0, 1];
          this.battleTelemetry = new (_crd && BattleTelemetry === void 0 ? (_reportPossibleCrUseOfBattleTelemetry({
            error: Error()
          }), BattleTelemetry) : BattleTelemetry)();
          this.battleElapsedTime = 0;
          this.telemetryFrameDeltaHistogram = new Array(101).fill(0);
          this.telemetryFrameSampleCount = 0;
          this.telemetryFrameDeltaTotalMs = 0;
          this.telemetryFrameDeltaMaxMs = 0;
          this.telemetryFramesOver16_67Ms = 0;
          this.telemetryFramesOver33_33Ms = 0;
          this.telemetryPeakAliveUnits = 0;
          this.telemetryPeakAliveWaves = 0;
          this.telemetryManagerUpdateSampleCount = 0;
          this.telemetryManagerUpdateTotalMs = 0;
          this.telemetryManagerUpdateMaxMs = 0;
          this.telemetryManagerUpdateSampleInterval = 30;
          this.telemetryFrameHitchThresholdMs = 50;
          this.telemetryFrameScannerSearchCount = 0;
          this.telemetryFrameCombatEscalationCount = 0;
          this.telemetryCombatEscalationSignatureByWave = new Map();
          this.telemetryIdleEpisodes = new Map();
          this.telemetryTargetClearRecoveryWindows = new Map();
          this.breakthroughCashoutWaveIds = new Set();
          this.breakthroughLaneSequences = new Map();
          this.lastBreakthroughIdByLane = new Map();
          this.pendingBreakthroughSpawnLinks = [];
          this.battleCardRuntime = null;
          this.battleRuntimeActive = false;
          this.rvoStepAccumulatedDelta = 0;
          this.battleRuntimeRoot = null;
          this.heroSpawnPositions = new Map();
        }

        start() {
          this.startBattleRuntime();
        }

        startBattleRuntime() {
          if (this.battleRuntimeActive) return false;
          GameManager.instance = this;
          this.applyTargetFrameRate();
          this.installBattleTimeScaleHook();
          this.applyProfilerStats();
          this.destroyStaleRuntimeUnits();
          this.teamA.length = 0;
          this.teamB.length = 0;
          this.waves.length = 0;
          this.nextWaveId = 1;
          this.teamAHeroWave = null;
          this.teamBHeroWave = null;
          this.teamAHeroEntry = null;
          this.teamBHeroEntry = null;
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
          this.frame = 0;
          this.spawnWaveTimer = 0;
          this.battleElapsedTime = 0;
          this.rvoStepAccumulatedDelta = 0;
          this.resetBattleFramePerformanceTelemetry();
          this.telemetryCombatEscalationSignatureByWave.clear();
          this.telemetryIdleEpisodes.clear();
          this.telemetryTargetClearRecoveryWindows.clear();
          this.breakthroughCashoutWaveIds.clear();
          this.breakthroughLaneSequences.clear();
          this.lastBreakthroughIdByLane.clear();
          this.pendingBreakthroughSpawnLinks.length = 0;
          this.resetCombatPoint();
          this.createSimulator();
          this.buildPrefabMaps();
          this.ensureBattleCardRuntime();
          this.resetBattleTelemetry();

          if (this.enableBattleCardEffects) {
            var _this$battleCardRunti;

            (_this$battleCardRunti = this.battleCardRuntime) == null || _this$battleCardRunti.beginBattle();
          }

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
          this.resetBattleRuntimeComponents();

          if (this.spawnImmediatelyOnStart) {
            this.spawnAutoWave();
          }

          this.rebuildSpatialGrid();
          this.refreshBattleStatsUI(true);
          this.battleRuntimeActive = true;
          return true;
        }

        stopBattleRuntime() {
          if (!this.battleRuntimeActive) return;
          this.battleRuntimeActive = false;
          this.unregisterWaveBannerCameraEvents();

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

          this.releaseBattleUnits(this.teamA);
          this.releaseBattleUnits(this.teamB);
          this.waves.length = 0;
          this.teamA.length = 0;
          this.teamB.length = 0;
          this.teamAHero = null;
          this.teamBHero = null;
          this.teamAHeroWave = null;
          this.teamBHeroWave = null;
          this.teamAHeroEntry = null;
          this.teamBHeroEntry = null;
          this.heroForwardUnlocked[0] = false;
          this.heroForwardUnlocked[1] = false;

          if (this.sim && this.sim.destroy) {
            this.sim.destroy();
          }

          this.sim = null;
          this.battleCardRuntime = null;
          this.spatialGrid.destroy();
          this.spatialGrid.build([], []);
          this.spatialGridDirty = false;
          this.battleStatsUiDirty = true;
        }

        isBattleRuntimeRunning() {
          return this.battleRuntimeActive;
        }

        releaseBattleUnits(units) {
          for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (!unit || !unit.node || !unit.node.isValid) continue;

            if (unit.isHero) {
              this.removeUnitAgentFromSimulator(unit);
              unit.resetForDespawn();
              unit.node.active = false;
              continue;
            }

            const entry = this.getTeamEntry(unit.team, unit.unitTypeName);

            if (entry && entry.prefab && this.spawner) {
              this.spawner.despawnUnit(unit, entry.prefab);
            } else {
              this.removeUnitAgentFromSimulator(unit);
              unit.resetForDespawn();
              unit.node.active = false;
            }
          }
        }

        destroyStaleRuntimeUnits() {
          const root = this.battleRuntimeRoot;
          if (!root || !root.isValid) return;
          const units = root.getComponentsInChildren(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);

          for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (!unit || !unit.node.activeInHierarchy) continue;
            this.removeUnitAgentFromSimulator(unit);
            unit.resetForDespawn();
            unit.node.destroy();
          }
        }

        resetBattleRuntimeComponents() {
          const scene = director.getScene();
          if (!scene) return;
          const components = scene.getComponentsInChildren(Component);

          for (let i = 0; i < components.length; i++) {
            const component = components[i];
            const reset = component == null ? void 0 : component.resetForNewBattle;

            if (typeof reset === 'function') {
              reset.call(component);
            }
          }
        }

        onDestroy() {
          if (GameManager.instance === this) {
            GameManager.instance = null;
          }

          if (this.resetBattleTimeScaleOnDestroy) {
            this.uninstallBattleTimeScaleHook();
          }

          this.stopBattleRuntime();
          this.teamAPrefabMap.clear();
          this.teamBPrefabMap.clear();
          this.clearWaveBannerPools();

          if (this.spawner) {
            this.spawner.clearPool();
          }
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
          this.heroDefeatDetected = false;
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
          if (!this.battleRuntimeActive) return;
          this.frame++;
          this.telemetryFrameScannerSearchCount = 0;
          this.telemetryFrameCombatEscalationCount = 0;
          this.recordBattleFrameDelta(deltaTime);
          const frameDeltaMs = deltaTime * 1000;
          const captureFrameHitch = this.enableBattleTelemetry && this.battleTelemetry.isEnabled() && Number.isFinite(frameDeltaMs) && frameDeltaMs >= this.telemetryFrameHitchThresholdMs;
          const managerUpdateStart = captureFrameHitch || this.shouldSampleBattleManagerUpdate() ? this.getPerformanceNow() : -1;
          this.battleElapsedTime += deltaTime;

          if (this.enableBattleCardEffects) {
            var _this$battleCardRunti2;

            (_this$battleCardRunti2 = this.battleCardRuntime) == null || _this$battleCardRunti2.update(deltaTime, this.combatPoint, this.initialCombatPoint);
          }

          (_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit).visualLerpT = 1 - Math.exp(-this.visualSmooth * deltaTime);
          this.rvoStepAccumulatedDelta += deltaTime;

          if (this.shouldRunFrameInterval(this.updateInterval, this.rvoUpdateFrameOffset)) {
            this.stepRvoSimulation(this.rvoStepAccumulatedDelta);
            this.rvoStepAccumulatedDelta = 0;
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
          this.processWaveTargetClearTelemetry();
          this.processPersistentHeroFreeHunts();
          this.processWaveForwardSearches();
          this.processWaveForwardRecoveries();
          this.processWaveBanners();
          this.pruneDeadWaves();
          this.processHeroForwardUnlock();
          this.recordBattleTelemetrySnapshotIfNeeded();
          this.processBattleWinnerCondition();
          this.refreshBattleStatsUI();

          if (managerUpdateStart >= 0) {
            const elapsed = this.getPerformanceNow();

            if (elapsed >= managerUpdateStart) {
              const managerUpdateMs = elapsed - managerUpdateStart;
              this.recordBattleManagerUpdateTime(managerUpdateMs);

              if (captureFrameHitch) {
                this.recordBattleFrameHitch(frameDeltaMs, managerUpdateMs);
              }
            }
          }
        }

        shouldRunFrameInterval(interval, offset = 0) {
          const safeInterval = Math.max(1, Math.floor(interval));
          const phase = (Math.floor(offset) % safeInterval + safeInterval) % safeInterval;
          return (this.frame + phase) % safeInterval === 0;
        }

        resetBattleFramePerformanceTelemetry() {
          for (let i = 0; i < this.telemetryFrameDeltaHistogram.length; i++) {
            this.telemetryFrameDeltaHistogram[i] = 0;
          }

          this.telemetryFrameSampleCount = 0;
          this.telemetryFrameDeltaTotalMs = 0;
          this.telemetryFrameDeltaMaxMs = 0;
          this.telemetryFramesOver16_67Ms = 0;
          this.telemetryFramesOver33_33Ms = 0;
          this.telemetryPeakAliveUnits = 0;
          this.telemetryPeakAliveWaves = 0;
          this.telemetryManagerUpdateSampleCount = 0;
          this.telemetryManagerUpdateTotalMs = 0;
          this.telemetryManagerUpdateMaxMs = 0;
        }

        recordBattleFrameDelta(deltaTime) {
          if (!this.enableBattleTelemetry) return;
          if (!this.battleTelemetry.isEnabled()) return;
          if (!Number.isFinite(deltaTime) || deltaTime <= 0) return;
          const milliseconds = deltaTime * 1000;
          const histogramIndex = Math.max(0, Math.min(this.telemetryFrameDeltaHistogram.length - 1, Math.floor(milliseconds)));
          this.telemetryFrameSampleCount++;
          this.telemetryFrameDeltaTotalMs += milliseconds;
          this.telemetryFrameDeltaMaxMs = Math.max(this.telemetryFrameDeltaMaxMs, milliseconds);
          this.telemetryFrameDeltaHistogram[histogramIndex]++;

          if (milliseconds > 16.67) {
            this.telemetryFramesOver16_67Ms++;
          }

          if (milliseconds > 33.33) {
            this.telemetryFramesOver33_33Ms++;
          }

          this.telemetryPeakAliveUnits = Math.max(this.telemetryPeakAliveUnits, this.getTotalAliveUnitCount());
          this.telemetryPeakAliveWaves = Math.max(this.telemetryPeakAliveWaves, this.waves.length);
        }

        shouldSampleBattleManagerUpdate() {
          if (!this.enableBattleTelemetry) return false;
          if (!this.battleTelemetry.isEnabled()) return false;
          return this.frame % this.telemetryManagerUpdateSampleInterval === 0;
        }

        getPerformanceNow() {
          const timing = globalThis.performance;

          if (!timing || typeof timing.now !== 'function') {
            return -1;
          }

          return timing.now();
        }

        recordBattleManagerUpdateTime(milliseconds) {
          if (!Number.isFinite(milliseconds) || milliseconds < 0) {
            return;
          }

          this.telemetryManagerUpdateSampleCount++;
          this.telemetryManagerUpdateTotalMs += milliseconds;
          this.telemetryManagerUpdateMaxMs = Math.max(this.telemetryManagerUpdateMaxMs, milliseconds);
        }

        recordBattleFrameHitch(frameDeltaMs, managerUpdateMs) {
          this.battleTelemetry.recordDiagnosticEvent({
            type: 'frame-hitch',
            frame: this.frame,
            time: this.battleElapsedTime,
            frameDeltaMs,
            managerUpdateMs,
            aliveUnitCount: this.getTotalAliveUnitCount(),
            aliveWaveCount: this.waves.length,
            scannerSearchCount: this.telemetryFrameScannerSearchCount,
            combatEscalationCount: this.telemetryFrameCombatEscalationCount
          });
        }

        getBattleFrameDeltaPercentile(percentile) {
          if (this.telemetryFrameSampleCount <= 0) return 0;
          const target = Math.max(1, Math.ceil(this.telemetryFrameSampleCount * percentile));
          let accumulated = 0;

          for (let i = 0; i < this.telemetryFrameDeltaHistogram.length; i++) {
            accumulated += this.telemetryFrameDeltaHistogram[i];

            if (accumulated >= target) {
              return i + 1;
            }
          }

          return this.telemetryFrameDeltaHistogram.length;
        }

        recordBattleFramePerformanceSummary() {
          const frameCount = this.telemetryFrameSampleCount;
          this.battleTelemetry.setFramePerformance({
            frameCount,
            averageDeltaMs: frameCount > 0 ? this.telemetryFrameDeltaTotalMs / frameCount : 0,
            p95DeltaMs: this.getBattleFrameDeltaPercentile(0.95),
            p99DeltaMs: this.getBattleFrameDeltaPercentile(0.99),
            maxDeltaMs: this.telemetryFrameDeltaMaxMs,
            framesOver16_67Ms: this.telemetryFramesOver16_67Ms,
            framesOver33_33Ms: this.telemetryFramesOver33_33Ms,
            peakAliveUnits: this.telemetryPeakAliveUnits,
            peakAliveWaves: this.telemetryPeakAliveWaves,
            managerUpdateSamples: this.telemetryManagerUpdateSampleCount,
            averageManagerUpdateMs: this.telemetryManagerUpdateSampleCount > 0 ? this.telemetryManagerUpdateTotalMs / this.telemetryManagerUpdateSampleCount : 0,
            maxManagerUpdateMs: this.telemetryManagerUpdateMaxMs
          });
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

        reportDamage(attacker, victim, damage, actualDamage, isCounterDamage, isAreaDamage = false, attackBatchId = -1) {
          if (!this.enableBattleTelemetry) return;
          this.battleTelemetry.recordDamage(attacker, victim, damage, actualDamage, isCounterDamage, isAreaDamage, attackBatchId, this.frame, this.battleElapsedTime);
        }

        configureBattleCardDecks(playerCardIds, enemyCardIds, playerBudgetUpgradeLevels = {}, playerStrengthScales = {}, enemyStrengthScales = {}, maxPlayerCards = 3, maxEnemyCards = maxPlayerCards) {
          var _this$battleCardRunti3;

          this.ensureBattleCardRuntime();
          (_this$battleCardRunti3 = this.battleCardRuntime) == null || _this$battleCardRunti3.setDecks(playerCardIds, enemyCardIds, playerBudgetUpgradeLevels, playerStrengthScales, enemyStrengthScales, maxPlayerCards, maxEnemyCards);
        }

        getBattleCardModifiers(team, family, opposingFamily) {
          if (!this.enableBattleCardEffects || !this.battleCardRuntime) {
            return NoBattleCardModifiers;
          }

          return this.battleCardRuntime.getModifiers(team, family, opposingFamily);
        }

        consumeBattleCardModifier(team, family, modifier, opposingFamily) {
          return this.enableBattleCardEffects && this.battleCardRuntime ? this.battleCardRuntime.consumeModifier(team, family, modifier, opposingFamily) : false;
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
          return this.enableBattleCardEffects && this.battleCardRuntime ? this.battleCardRuntime.getUsedCardIds(team) : [];
        }

        hasUnitReachedEnemyHeroLine(unit) {
          if (!unit) return false;
          if (unit.team !== 0 && unit.team !== 1) return false;
          const defendingTeam = unit.team === 0 ? 1 : 0;
          const lineZ = this.heroLineZ[defendingTeam];
          const unitZ = unit.agent ? unit.agent.pos.z : unit.node.worldPosition.z;
          const forwardZ = unit.forwardDir.z;
          if (!Number.isFinite(lineZ)) return false;
          if (!Number.isFinite(unitZ)) return false;
          if (Math.abs(forwardZ) <= 0.0001) return false;
          return (unitZ - lineZ) * forwardZ >= 0;
        }

        resolveUnitReachedEnemyHeroLine(unit) {
          if (!this.battleRuntimeActive) return false;
          if (this.hasBattleWinner()) return false;
          if (!unit || unit.isHero) return false;
          if (!this.hasUnitReachedEnemyHeroLine(unit)) return false;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit); // A breakthrough belongs to a command, not to an arbitrary straggler.
          // The front scanner is the sole unit allowed to cash out its wave.

          if (!wave || wave.isDead()) return false;
          if (wave.getScanner() !== unit) return false;
          if (this.breakthroughCashoutWaveIds.has(wave.id)) return true;
          const defendingTeam = unit.team === 0 ? 1 : 0;
          const defendingHero = defendingTeam === 0 ? this.teamAHero : this.teamBHero;

          if (this.enableBattleWinnerCheck && this.getAliveNonHeroUnitCount(defendingTeam) === 0 && !this.isAliveUnit(defendingHero)) {
            this.recordUnitReachedEnemyHeroLineContext(unit);
            this.resolveBattleWinner(unit.team, defendingTeam, 'enemy-hero-line-reached-with-no-defenders');
            return true;
          }

          this.breakthroughCashoutWaveIds.add(wave.id);
          this.cashOutWaveAtEnemyHeroLine(wave, unit);
          return true;
        }

        cashOutWaveAtEnemyHeroLine(wave, scanner) {
          const aliveUnitCount = wave.getAliveCount();
          if (aliveUnitCount <= 0) return;
          const physicalLaneId = this.getCurrentLaneIdForUnit(scanner);
          const laneId = physicalLaneId >= 0 ? physicalLaneId : wave.laneId;
          const laneState = this.getBreakthroughLaneState(scanner.team, laneId);
          const originalCombatPointCost = Math.max(0, wave.originalCombatPointCost);
          const rewardMultiplier = aliveUnitCount >= wave.totalCount ? 2 : 1;
          const rewardCombatPoint = originalCombatPointCost * rewardMultiplier;
          const combatPointBeforeReward = this.combatPoint[scanner.team] || 0;
          const combatPointAfterReward = combatPointBeforeReward + rewardCombatPoint;
          const laneKey = `${scanner.team}:${laneId}`;
          const laneBreakthroughSequence = (this.breakthroughLaneSequences.get(laneKey) || 0) + 1;
          const previousBreakthroughIdInLane = this.lastBreakthroughIdByLane.get(laneKey);
          const cashout = {
            id: wave.id,
            frame: this.frame,
            time: this.battleElapsedTime,
            team: scanner.team,
            waveId: wave.id,
            laneId,
            scannerUnitName: scanner.unitTypeName,
            scannerSpawnId: this.battleTelemetry.getSpawnId(scanner),
            scannerLifeId: scanner.lifeId,
            originalCombatPointCost,
            aliveUnitCount,
            initialUnitCount: wave.totalCount,
            rewardMultiplier,
            rewardCombatPoint,
            combatPointBeforeReward,
            combatPointAfterReward,
            laneBreakthroughSequence,
            previousBreakthroughIdInLane,
            attackingNonHeroAlive: laneState.attackingNonHeroAlive,
            attackingWaveCount: laneState.attackingWaveCount,
            defendingNonHeroAlive: laneState.defendingNonHeroAlive,
            defendingWaveCount: laneState.defendingWaveCount
          };

          if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordBreakthroughCashout(cashout);
          }

          this.breakthroughLaneSequences.set(laneKey, laneBreakthroughSequence);
          this.lastBreakthroughIdByLane.set(laneKey, wave.id);
          this.addCombatPoint(scanner.team, rewardCombatPoint);

          if (this.enableBattleTelemetry) {
            this.pendingBreakthroughSpawnLinks.push({
              cashoutId: wave.id,
              team: scanner.team,
              combatPointBeforeReward,
              combatPointAfterReward
            });
          }

          const members = wave.units.slice();

          for (let i = 0; i < members.length; i++) {
            const member = members[i];
            if (!this.isAliveUnit(member)) continue;
            if ((_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
              error: Error()
            }), BattleWave) : BattleWave).getWaveForUnit(member) !== wave) continue;
            this.despawnUnitForBreakthroughCashout(member);
          }

          wave.invalidateRuntimeState();
          this.markTargetLifecyclePendingForWave(wave, 'target-wave-cashed-out-at-enemy-hero-line', laneId);
          this.requestSpatialGridRebuild();
          this.requestBattleStatsUIRefresh();
        }

        getBreakthroughLaneState(attackingTeam, laneId) {
          let attackingNonHeroAlive = 0;
          let defendingNonHeroAlive = 0;
          const attackingWaveIds = new Set();
          const defendingWaveIds = new Set();

          const collect = units => {
            for (let i = 0; i < units.length; i++) {
              const laneUnit = units[i];
              if (!this.isAliveUnit(laneUnit)) continue;
              if (laneUnit.isHero) continue;

              if (laneId >= 0 && this.getCurrentLaneIdForUnit(laneUnit) !== laneId) {
                continue;
              }

              const laneWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
                error: Error()
              }), BattleWave) : BattleWave).getWaveForUnit(laneUnit);

              if (laneUnit.team === attackingTeam) {
                attackingNonHeroAlive++;
                if (laneWave) attackingWaveIds.add(laneWave.id);
              } else {
                defendingNonHeroAlive++;
                if (laneWave) defendingWaveIds.add(laneWave.id);
              }
            }
          };

          collect(this.teamA);
          collect(this.teamB);
          return {
            attackingNonHeroAlive,
            attackingWaveCount: attackingWaveIds.size,
            defendingNonHeroAlive,
            defendingWaveCount: defendingWaveIds.size
          };
        }

        recordUnitReachedEnemyHeroLineContext(unit) {
          var _wave$id, _wave$laneId, _wave$hasAggressiveFo, _wave$isForwardMode, _wave$isAwaitingForwa, _wave$getFreeHuntForw, _wave$getTargetWaveId, _wave$getTargetWaveCo, _targetWave$id, _targetWave$laneId, _target$unitTypeName;

          if (!this.enableBattleTelemetry) return;
          if (!this.battleTelemetry.isEnabled()) return;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          const target = unit.getValidEnemyTarget();
          const targetWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(target);
          const physicalLaneId = this.getCurrentLaneIdForUnit(unit);
          const defendingTeam = unit.team === 0 ? 1 : 0;
          const unitPosition = unit.agent ? unit.agent.pos : unit.node.worldPosition;
          const heroLineZ = this.heroLineZ[defendingTeam];
          const forwardZ = unit.forwardDir.z;
          let laneOwnNonHeroAlive = 0;
          let laneEnemyNonHeroAlive = 0;
          const laneOwnWaveIds = new Set();
          const laneEnemyWaveIds = new Set();

          const countLaneUnits = units => {
            for (let i = 0; i < units.length; i++) {
              const laneUnit = units[i];
              if (!this.isAliveUnit(laneUnit)) continue;
              if (laneUnit.isHero) continue;

              if (physicalLaneId < 0 || this.getCurrentLaneIdForUnit(laneUnit) !== physicalLaneId) {
                continue;
              }

              const laneWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
                error: Error()
              }), BattleWave) : BattleWave).getWaveForUnit(laneUnit);

              if (laneUnit.team === unit.team) {
                laneOwnNonHeroAlive++;
                if (laneWave) laneOwnWaveIds.add(laneWave.id);
              } else {
                laneEnemyNonHeroAlive++;
                if (laneWave) laneEnemyWaveIds.add(laneWave.id);
              }
            }
          };

          countLaneUnits(this.teamA);
          countLaneUnits(this.teamB);
          this.battleTelemetry.recordLineReachedContext({
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: (_wave$id = wave == null ? void 0 : wave.id) != null ? _wave$id : -1,
            waveLaneId: (_wave$laneId = wave == null ? void 0 : wave.laneId) != null ? _wave$laneId : -1,
            unitName: unit.unitTypeName,
            unitLifeId: unit.lifeId,
            unitSpawnId: this.battleTelemetry.getSpawnId(unit),
            unitX: unitPosition.x,
            unitZ: unitPosition.z,
            heroLineZ,
            distancePastHeroLine: Number.isFinite(heroLineZ) ? (unitPosition.z - heroLineZ) * forwardZ : 0,
            unitPhysicalLaneId: physicalLaneId,
            unitBusy: unit.onBusy,
            unitForward: unit.onForward,
            unitBackToLane: unit.isBackToLaneActive(),
            isolatedRangedPursuit: unit.isIsolatedRangedPursuit(),
            isolatedRangedPursuitReturningToWave: unit.isReturningToWaveAfterIsolatedRangedPursuit(),
            aggressiveForward: (_wave$hasAggressiveFo = wave == null ? void 0 : wave.hasAggressiveForwardLaneLock()) != null ? _wave$hasAggressiveFo : false,
            waveForward: (_wave$isForwardMode = wave == null ? void 0 : wave.isForwardMode()) != null ? _wave$isForwardMode : false,
            awaitingForwardRecovery: (_wave$isAwaitingForwa = wave == null ? void 0 : wave.isAwaitingForwardRecoveryAfterTargetClear()) != null ? _wave$isAwaitingForwa : false,
            freeHuntForwardOrigin: (_wave$getFreeHuntForw = wave == null ? void 0 : wave.getFreeHuntForwardOrigin()) != null ? _wave$getFreeHuntForw : '',
            targetWaveIds: (_wave$getTargetWaveId = wave == null ? void 0 : wave.getTargetWaveIds()) != null ? _wave$getTargetWaveId : [],
            targetWaveCount: (_wave$getTargetWaveCo = wave == null ? void 0 : wave.getTargetWaveCount()) != null ? _wave$getTargetWaveCo : 0,
            targetWaveId: (_targetWave$id = targetWave == null ? void 0 : targetWave.id) != null ? _targetWave$id : -1,
            targetLaneId: (_targetWave$laneId = targetWave == null ? void 0 : targetWave.laneId) != null ? _targetWave$laneId : -1,
            targetUnitName: (_target$unitTypeName = target == null ? void 0 : target.unitTypeName) != null ? _target$unitTypeName : '',
            laneOwnNonHeroAlive,
            laneEnemyNonHeroAlive,
            laneOwnWaveCount: laneOwnWaveIds.size,
            laneEnemyWaveCount: laneEnemyWaveIds.size
          });
        }

        resolveHeroDefeat(hero) {
          var _this$battleProgressi;

          if (!hero || !hero.isHero) return;
          const team = hero.team;
          if (team !== 0 && team !== 1) return; // Lock both armies immediately. This also stops any remaining targets
          // from the attack currently being resolved before the battle result is
          // finalized at the end of that combat resolution.

          this.heroDefeatDetected = true;
          this.haltAllUnitsForBattleEnd();
          this.resolveBattleWinner(team === 0 ? 1 : 0, team, team === 0 ? 'player-hero-killed' : (_this$battleProgressi = this.battleProgressionProvider) != null && _this$battleProgressi.isBossBattle != null && _this$battleProgressi.isBossBattle() ? 'boss-hero-killed' : 'enemy-hero-killed');
        }

        recordHeroDefeatTelemetryContext(hero) {
          if (!this.enableBattleTelemetry) return;
          if (!this.battleTelemetry.isEnabled()) return;
          const heroTeam = hero.team;
          if (heroTeam !== 0 && heroTeam !== 1) return;
          const enemyTeam = heroTeam === 0 ? 1 : 0;
          const heroWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(hero);
          const heroLaneId = heroWave ? heroWave.laneId : this.getHeroLaneId();
          const guardRadius = Math.max(0, hero.heroGuardDistance);
          const nearbyRadius = Math.max(0.01, guardRadius);
          const nearbyRadiusSquared = nearbyRadius * nearbyRadius;
          const heroPosition = hero.node.worldPosition;

          const collect = team => {
            const units = this.getAliveUnits(team);
            let alive = 0;
            let nearHero = 0;
            let inHeroLane = 0;
            let nearestDistance = Number.POSITIVE_INFINITY;

            for (let i = 0; i < units.length; i++) {
              const unit = units[i];
              if (!this.isAliveUnit(unit) || unit.isHero) continue;
              alive++;
              const position = unit.node.worldPosition;
              const dx = position.x - heroPosition.x;
              const dz = position.z - heroPosition.z;
              const distanceSquared = dx * dx + dz * dz;

              if (distanceSquared <= nearbyRadiusSquared) {
                nearHero++;
              }

              nearestDistance = Math.min(nearestDistance, Math.sqrt(distanceSquared));
              const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
                error: Error()
              }), BattleWave) : BattleWave).getWaveForUnit(unit);

              if (wave && wave.laneId === heroLaneId) {
                inHeroLane++;
              }
            }

            return {
              alive,
              nearHero,
              inHeroLane,
              nearestDistance: Number.isFinite(nearestDistance) ? nearestDistance : -1
            };
          };

          const allies = collect(heroTeam);
          const enemies = collect(enemyTeam);
          this.battleTelemetry.recordHeroDefeatContext({
            frame: this.frame,
            time: this.battleElapsedTime,
            heroTeam,
            heroUnitName: hero.unitTypeName || 'hero',
            heroLaneId,
            guardRadius,
            heroX: heroPosition.x,
            heroZ: heroPosition.z,
            allyNonHeroAlive: allies.alive,
            enemyNonHeroAlive: enemies.alive,
            allyNearHero: allies.nearHero,
            enemyNearHero: enemies.nearHero,
            allyInHeroLane: allies.inHeroLane,
            enemyInHeroLane: enemies.inHeroLane,
            nearestAllyDistance: allies.nearestDistance,
            nearestEnemyDistance: enemies.nearestDistance
          });
        }

        onWaveCombatStarted(unit, enemy = null, useInitialForwardGate = true) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return;
          if (wave.isDead()) return; // An isolated ranged retaliation is a one-unit local fight. Neither
          // side may use it to alter a parent wave's strategic target set.

          if (unit != null && unit.isIsolatedRangedPursuit() || enemy != null && enemy.isIsolatedRangedPursuit()) {
            return;
          } // Strategic melee combat begins when contact range is reached, rather
          // than waiting for either unit to land damage. If either parent wave
          // is recovering, both sides are evaluated together so update order
          // cannot make the engagement one-sided.


          this.tryReengageWavesFromRecoveryMeleeContact(unit, enemy);
          const aggressiveFrontlineEngagement = this.isAggressiveFrontlineEngagement(wave, unit, enemy);
          const soloAggressiveCombat = this.shouldUseSoloAggressiveCombat(wave, unit, enemy, aggressiveFrontlineEngagement);
          const waveForwardBefore = wave.isForwardMode();
          const aggressiveForwardBefore = wave.isAggressiveForwardMode();
          const sameLaneWaveEngagement = this.isSameLaneWaveEngagement(wave, enemy);
          const crossLaneRangedAttack = this.isCrossLaneRangedAttack(unit, enemy);
          const strategicEscalationBlocked = crossLaneRangedAttack && !wave.hasEngagedTargetWave((_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(enemy));
          const canEscalateWaveCombat = !strategicEscalationBlocked && !soloAggressiveCombat && (!wave.hasAggressiveForwardLaneLock() || sameLaneWaveEngagement && aggressiveFrontlineEngagement) && this.canEscalateWaveCombatFromEngagement(wave, enemy);
          const strategicEngagedCount = canEscalateWaveCombat ? this.getForwardStrategicEngagedCount(wave, unit, enemy, aggressiveForwardBefore) : 0;
          const strategicEngagementThreshold = Math.ceil(wave.getCommandAliveCount() / 2);
          const initialForwardCombatDelayed = canEscalateWaveCombat && this.shouldDelayInitialForwardCombat(wave, unit, enemy, useInitialForwardGate);
          const waveCombatEscalated = canEscalateWaveCombat && !initialForwardCombatDelayed && waveForwardBefore;

          if (canEscalateWaveCombat && (!waveForwardBefore || !initialForwardCombatDelayed)) {
            this.trySetWaveTargetFromEngagement(wave, unit, enemy);

            if (waveForwardBefore) {
              this.addEligibleEngagedTargetWaves(wave, aggressiveForwardBefore);
            }
          }

          if (canEscalateWaveCombat && !initialForwardCombatDelayed) {
            wave.enterCombatMode();
          }

          this.recordWaveCombatEscalationDecision(wave, unit, enemy, aggressiveForwardBefore, waveForwardBefore, sameLaneWaveEngagement, soloAggressiveCombat, aggressiveFrontlineEngagement, canEscalateWaveCombat, initialForwardCombatDelayed, waveCombatEscalated, crossLaneRangedAttack, strategicEscalationBlocked, 'attacker', strategicEngagedCount, strategicEngagementThreshold);
          const enemyWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(enemy);

          if (!enemyWave || enemyWave === wave || enemyWave.isDead()) {
            return;
          }

          const enemyAggressiveFrontlineEngagement = this.isAggressiveFrontlineEngagement(enemyWave, enemy, unit);
          const enemySoloAggressiveCombat = this.shouldUseSoloAggressiveCombat(enemyWave, enemy, unit, enemyAggressiveFrontlineEngagement);
          const enemyWaveForwardBefore = enemyWave.isForwardMode();
          const enemyAggressiveForwardBefore = enemyWave.isAggressiveForwardMode();
          const enemySameLaneWaveEngagement = this.isSameLaneWaveEngagement(enemyWave, unit);
          const enemyStrategicEscalationBlocked = crossLaneRangedAttack && !enemyWave.hasEngagedTargetWave(wave) || this.isRemoteRangedAttackAgainstMelee(unit, enemy);
          const enemyCanEscalateWaveCombat = !enemyStrategicEscalationBlocked && !enemySoloAggressiveCombat && (!enemyWave.hasAggressiveForwardLaneLock() || enemySameLaneWaveEngagement && enemyAggressiveFrontlineEngagement) && this.canEscalateWaveCombatFromEngagement(enemyWave, unit);
          const enemyStrategicEngagedCount = enemyCanEscalateWaveCombat ? this.getForwardStrategicEngagedCount(enemyWave, enemy, unit, enemyAggressiveForwardBefore) : 0;
          const enemyStrategicEngagementThreshold = Math.ceil(enemyWave.getCommandAliveCount() / 2);
          const enemyInitialForwardCombatDelayed = enemyCanEscalateWaveCombat && this.shouldDelayInitialForwardCombat(enemyWave, enemy, unit, useInitialForwardGate);
          const enemyWaveCombatEscalated = enemyCanEscalateWaveCombat && !enemyInitialForwardCombatDelayed && enemyWaveForwardBefore;

          if (enemyCanEscalateWaveCombat && (!enemyWaveForwardBefore || !enemyInitialForwardCombatDelayed)) {
            this.trySetWaveTargetFromEngagement(enemyWave, enemy, unit);

            if (enemyWaveForwardBefore) {
              this.addEligibleEngagedTargetWaves(enemyWave, enemyAggressiveForwardBefore);
            }
          }

          if (enemyCanEscalateWaveCombat && !enemyInitialForwardCombatDelayed) {
            enemyWave.enterCombatMode();
          }

          this.recordWaveCombatEscalationDecision(enemyWave, enemy, unit, enemyAggressiveForwardBefore, enemyWaveForwardBefore, enemySameLaneWaveEngagement, enemySoloAggressiveCombat, enemyAggressiveFrontlineEngagement, enemyCanEscalateWaveCombat, enemyInitialForwardCombatDelayed, enemyWaveCombatEscalated, crossLaneRangedAttack, enemyStrategicEscalationBlocked, 'defender', enemyStrategicEngagedCount, enemyStrategicEngagementThreshold);
        }

        shouldUseSoloAggressiveSkirmish(unit, enemy) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return false;
          if (wave.isDead()) return false;
          return this.shouldUseSoloAggressiveCombat(wave, unit, enemy);
        }

        shouldStartIsolatedRangedPursuit(unit, attacker) {
          if (!unit || !attacker) return false;
          if (unit.isHero) return false;
          if (unit.isIsolatedRangedPursuit()) return false;
          if (!attacker.isRangedCombatUnit()) return false;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          const attackerWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(attacker);
          if (!wave || !attackerWave) return false;
          if (wave === attackerWave) return false;
          if (wave.team === attackerWave.team) return false;
          if (wave.isDead() || attackerWave.isDead()) return false;
          return !wave.hasEngagedTargetWave(attackerWave);
        }

        finishIsolatedRangedPursuit(unit, previousTarget = null) {
          if (!unit) return false;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave || wave.isDead()) return false;
          const wasReturningToWave = unit.isReturningToWaveAfterIsolatedRangedPursuit(); // clearInvalidEnemy() runs every frame while a detached unit has no
          // target. Once the return phase is already active, that polling must
          // not restart its movement command. A completed local combat still
          // supplies previousTarget and needs one fresh return command.

          if (wasReturningToWave && !previousTarget) {
            if (!unit.hasReachedCurrentWaveLaneAfterIsolatedRangedPursuit()) {
              return true;
            }

            this.completeIsolatedRangedPursuitReturnToWaveLane(unit, wave.laneId);
            return true;
          }

          unit.recordIsolatedRangedPursuitReturnCommand(previousTarget ? 'combat-target-ended' : wasReturningToWave ? 'no-target-while-returning' : 'no-target-before-return', wasReturningToWave);
          const returningToWaveLane = unit.beginIsolatedRangedPursuitReturnToWaveLane(wave.hasAggressiveForwardLaneLock());

          if (!wasReturningToWave) {
            this.recordIsolatedRangedPursuit('isolated-ranged-pursuit-combat-ended-returning-to-wave-lane', unit, previousTarget);
          }

          if (returningToWaveLane) {
            return true;
          }

          if (!unit.hasReachedCurrentWaveLaneAfterIsolatedRangedPursuit()) {
            return true;
          } // The local combat can end after the unit has already returned to the
          // parent lane. Complete the rejoin immediately in that case; it is
          // still not a command member until this call clears the isolation.


          this.completeIsolatedRangedPursuitReturnToWaveLane(unit, wave.laneId);
          return true;
        }

        completeIsolatedRangedPursuitReturnToWaveLane(unit, arrivedLaneId) {
          if (!unit) return false;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);

          if (!wave || wave.isDead()) {
            unit.completeIsolatedRangedPursuitReturnToWaveLane(arrivedLaneId);
            return false;
          }

          const currentWaveLaneId = wave.laneId;
          unit.completeIsolatedRangedPursuitReturnToWaveLane(currentWaveLaneId >= 0 ? currentWaveLaneId : arrivedLaneId);
          this.notifyWaveCommandMembershipChanged(unit);
          this.recordIsolatedRangedPursuit('isolated-ranged-pursuit-ended', unit, null);

          if (wave.isAwaitingForwardRecoveryAfterTargetClear()) {
            this.tryResumeWaveForwardFromRegroupCompletion(unit);
            return true;
          }

          if (wave.isForwardMode()) {
            unit.enterWaveForwardMode(wave.isAggressiveForwardMode());
            return true;
          }

          if (wave.isFreeHuntMode()) {
            unit.enterWaveFreeHuntMode();
            unit.primeWaveHuntTarget(wave.findSharedTargetForUnit(unit));
          }

          return true;
        }

        getAssignedWaveLaneForUnit(unit) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          return wave && !wave.isDead() ? wave.laneId : -1;
        }

        recordIsolatedRangedPursuit(type, unit, target) {
          var _wave$id2, _target$team, _targetWave$id2, _targetWave$laneId2, _target$lifeId, _wave$getTargetWaveCo2, _wave$getTargetWaveId2;

          if (!this.enableBattleTelemetry || !unit) return;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          const targetWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(target);
          const physicalLaneId = this.getCurrentLaneIdForUnit(unit);
          const waveLaneDistance = wave && wave.laneId >= 0 && physicalLaneId >= 0 ? Math.abs(this.clampLaneId(wave.laneId) - this.clampLaneId(physicalLaneId)) : -1;
          this.battleTelemetry.recordDiagnosticEvent({
            type,
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: (_wave$id2 = wave == null ? void 0 : wave.id) != null ? _wave$id2 : -1,
            laneId: unit.laneId,
            unitPhysicalLaneId: physicalLaneId,
            waveLaneDistance,
            unitName: unit.unitTypeName,
            unitLifeId: unit.lifeId,
            unitSpawnId: this.battleTelemetry.getSpawnId(unit),
            targetTeam: (_target$team = target == null ? void 0 : target.team) != null ? _target$team : -1,
            targetWaveId: (_targetWave$id2 = targetWave == null ? void 0 : targetWave.id) != null ? _targetWave$id2 : -1,
            targetLaneId: (_targetWave$laneId2 = targetWave == null ? void 0 : targetWave.laneId) != null ? _targetWave$laneId2 : -1,
            targetLifeId: (_target$lifeId = target == null ? void 0 : target.lifeId) != null ? _target$lifeId : -1,
            targetSpawnId: this.battleTelemetry.getSpawnId(target),
            isolatedRangedPursuit: unit.isIsolatedRangedPursuit(),
            isolatedRangedPursuitReturningToWave: unit.isReturningToWaveAfterIsolatedRangedPursuit(),
            movementIntent: unit.getTelemetryMovementIntent(),
            isolatedRangedPursuitReturnCommandAttemptCount: unit.getIsolatedRangedPursuitReturnCommandAttemptCount(),
            isolatedRangedPursuitReturnRepeatedCommandCount: unit.getIsolatedRangedPursuitReturnRepeatedCommandCount(),
            isolatedRangedPursuitReturnLocalCombatCount: unit.getIsolatedRangedPursuitReturnLocalCombatCount(),
            isolatedRangedPursuitLastReturnCommandCause: unit.getIsolatedRangedPursuitLastReturnCommandCause(),
            targetWaveCount: (_wave$getTargetWaveCo2 = wave == null ? void 0 : wave.getTargetWaveCount()) != null ? _wave$getTargetWaveCo2 : 0,
            targetWaveIds: (_wave$getTargetWaveId2 = wave == null ? void 0 : wave.getTargetWaveIds()) != null ? _wave$getTargetWaveId2 : []
          });
        }

        recordWaveRegroupTransition(type, unit, attacker = null) {
          var _attackerWave$id, _attacker$team, _attackerWave$laneId, _attacker$lifeId, _attackerPosition$x, _attackerPosition$z;

          if (!this.enableBattleTelemetry || !unit) return;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return;
          const attackerWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(attacker);
          const unitPosition = unit.agent ? unit.agent.pos : unit.node.worldPosition;
          const attackerPosition = attacker != null && attacker.agent ? attacker.agent.pos : attacker == null ? void 0 : attacker.node.worldPosition;
          this.battleTelemetry.recordDiagnosticEvent({
            type,
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: wave.id,
            laneId: wave.laneId,
            regroupLaneId: unit.laneId,
            unitName: unit.unitTypeName,
            unitLifeId: unit.lifeId,
            unitSpawnId: this.battleTelemetry.getSpawnId(unit),
            unitX: unitPosition.x,
            unitZ: unitPosition.z,
            unitBusy: unit.onBusy,
            unitForward: unit.onForward,
            unitBackToLane: unit.isBackToLaneActive(),
            forwardRecoveryReadyUnitCount: wave.getForwardRecoveryReadyUnitCount(),
            forwardRecoveryRegroupingUnitCount: wave.getForwardRecoveryRegroupingUnitCount(),
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            targetWaveId: (_attackerWave$id = attackerWave == null ? void 0 : attackerWave.id) != null ? _attackerWave$id : -1,
            targetTeam: (_attacker$team = attacker == null ? void 0 : attacker.team) != null ? _attacker$team : -1,
            targetLaneId: (_attackerWave$laneId = attackerWave == null ? void 0 : attackerWave.laneId) != null ? _attackerWave$laneId : -1,
            targetLifeId: (_attacker$lifeId = attacker == null ? void 0 : attacker.lifeId) != null ? _attacker$lifeId : -1,
            targetSpawnId: this.battleTelemetry.getSpawnId(attacker),
            targetX: (_attackerPosition$x = attackerPosition == null ? void 0 : attackerPosition.x) != null ? _attackerPosition$x : -1,
            targetZ: (_attackerPosition$z = attackerPosition == null ? void 0 : attackerPosition.z) != null ? _attackerPosition$z : -1
          });
        }

        tryReengageWavesFromRecoveryMeleeContact(meleeUnit, enemy) {
          if (!meleeUnit || !enemy) return false;
          if (meleeUnit.team === enemy.team) return false;

          if (meleeUnit.isIsolatedRangedPursuit() || enemy.isIsolatedRangedPursuit()) {
            return false;
          }

          if (meleeUnit.isRangedCombatUnit()) return false;
          if (!meleeUnit.isEnemyWithinAttackRange(enemy)) return false;
          const meleeWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(meleeUnit);
          const enemyWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(enemy);

          if (!meleeWave || !enemyWave || meleeWave === enemyWave) {
            return false;
          }

          if (meleeWave.isDead() || enemyWave.isDead()) return false; // Aggressive waves retain their same-lane priority while recovering.
          // A neighbouring-lane contact remains a local detachment combat and
          // must not cancel recovery for the parent wave.

          const meleeWaveCanReengage = !meleeWave.hasAggressiveForwardLaneLock() || this.isSameLaneWaveEngagement(meleeWave, enemy) && this.isAggressiveFrontlineEngagement(meleeWave, meleeUnit, enemy);
          const enemyWaveCanReengage = !enemyWave.hasAggressiveForwardLaneLock() || this.isSameLaneWaveEngagement(enemyWave, meleeUnit) && this.isAggressiveFrontlineEngagement(enemyWave, enemy, meleeUnit);
          const meleeWaveReengaged = meleeWaveCanReengage && meleeWave.tryReengageFromRecoveryMeleeContact(meleeUnit, enemy);
          const enemyWaveReengaged = enemyWaveCanReengage && enemyWave.tryReengageFromRecoveryMeleeContact(enemy, meleeUnit);

          if (meleeWaveReengaged) {
            this.recordRegroupMeleeContactReengagement(meleeWave, meleeUnit, enemy, 'attacker');
          }

          if (enemyWaveReengaged) {
            this.recordRegroupMeleeContactReengagement(enemyWave, enemy, meleeUnit, 'defender');
          }

          return meleeWaveReengaged || enemyWaveReengaged;
        }

        recordRegroupMeleeContactReengagement(wave, unit, enemy, engagementRole) {
          var _enemyWave$id, _enemyWave$laneId;

          if (!this.enableBattleTelemetry) return;
          const enemyWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(enemy);
          this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-regroup-melee-contact-reengaged',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: wave.id,
            laneId: wave.laneId,
            regroupLaneId: unit.laneId,
            unitName: unit.unitTypeName,
            unitLifeId: unit.lifeId,
            unitSpawnId: this.battleTelemetry.getSpawnId(unit),
            targetWaveId: (_enemyWave$id = enemyWave == null ? void 0 : enemyWave.id) != null ? _enemyWave$id : -1,
            targetTeam: enemy.team,
            targetLaneId: (_enemyWave$laneId = enemyWave == null ? void 0 : enemyWave.laneId) != null ? _enemyWave$laneId : -1,
            targetLifeId: enemy.lifeId,
            targetSpawnId: this.battleTelemetry.getSpawnId(enemy),
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            engagementRole,
            regroupMeleeReengaged: true,
            regroupInterruptReason: 'melee-contact-target-wave-added',
            targetWaveIds: wave.getTargetWaveIds(),
            targetWaveCount: wave.getTargetWaveCount(),
            regroupCancelledUnitLifeIds: wave.getLastRegroupMeleeCancelledUnitLifeIds()
          });
        }

        trySetWaveTargetFromScanner(wave, scanner, target, source, allowRecoveryContinuation = false) {
          var _previousTargetWaveId;

          if (!wave || !scanner || !target) return false;
          const previousTargetWaveIds = wave.getTargetWaveIds();
          const previousTargetWaveId = (_previousTargetWaveId = previousTargetWaveIds[0]) != null ? _previousTargetWaveId : -1;
          const candidateWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(target);
          const wasAlreadyAssigned = wave.hasEngagedTargetWave(candidateWave);
          const assigned = wave.trySetTargetWaveFromScanner(scanner, target, allowRecoveryContinuation);
          this.recordWaveTargetAssignment(wave, scanner, target, previousTargetWaveId, source, assigned, wasAlreadyAssigned, previousTargetWaveIds);
          return assigned;
        }

        trySetWaveTargetFromEngagement(wave, unit, target) {
          var _previousTargetWaveId2;

          if (!wave || !unit || !target) return false;
          if (!this.canEscalateWaveCombatFromEngagement(wave, target)) return false;
          const previousTargetWaveIds = wave.getTargetWaveIds();
          const previousTargetWaveId = (_previousTargetWaveId2 = previousTargetWaveIds[0]) != null ? _previousTargetWaveId2 : -1;
          const candidateWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(target);
          const wasAlreadyAssigned = wave.hasEngagedTargetWave(candidateWave);
          const assigned = wave.trySetTargetWaveFromEngagement(unit, target);
          this.recordWaveTargetAssignment(wave, unit, target, previousTargetWaveId, 'engagement', assigned, wasAlreadyAssigned, previousTargetWaveIds);
          return assigned;
        }

        addEligibleEngagedTargetWaves(wave, aggressiveForward) {
          for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];
            if (!wave.isCommandUnit(unit)) continue;
            if (!unit.onBusy) continue;
            const target = unit.getValidEnemyTarget();
            if (!target || target.isIsolatedRangedPursuit()) continue; // A ranged unit firing into a neighbouring lane is a local fight.
            // It must not be swept into the parent wave's strategic target set.

            if (this.isCrossLaneRangedAttack(unit, target)) continue;

            if (!this.canEscalateWaveCombatFromEngagement(wave, target)) {
              continue;
            }

            if (aggressiveForward) {
              if (!this.isSameLaneWaveEngagement(wave, target)) {
                continue;
              }

              if (!this.isAggressiveFrontlineEngagement(wave, unit, target)) {
                continue;
              }
            }

            this.trySetWaveTargetFromEngagement(wave, unit, target);
          }
        }

        canEscalateWaveCombatFromEngagement(wave, target) {
          const targetWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(target);
          if (!targetWave) return false;

          if (wave.laneId < 0 || targetWave.laneId < 0) {
            return false;
          }

          return Math.abs(this.clampLaneId(wave.laneId) - this.clampLaneId(targetWave.laneId)) <= 1;
        }

        isSameLaneWaveEngagement(wave, target) {
          const targetWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(target);
          if (!targetWave) return false;

          if (wave.laneId < 0 || targetWave.laneId < 0) {
            return false;
          }

          return this.clampLaneId(wave.laneId) === this.clampLaneId(targetWave.laneId);
        }

        isCrossLaneRangedAttack(attacker, target) {
          if (!attacker || !target) return false;
          if (!attacker.isRangedCombatUnit()) return false;
          const attackerWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(attacker);
          const targetWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(target);
          if (!attackerWave || !targetWave) return false;
          if (attackerWave === targetWave) return false;

          if (attackerWave.laneId < 0 || targetWave.laneId < 0) {
            return false;
          }

          return this.clampLaneId(attackerWave.laneId) !== this.clampLaneId(targetWave.laneId);
        }

        isRemoteRangedAttackAgainstMelee(attacker, target) {
          if (!attacker || !target) return false;
          if (!attacker.isRangedCombatUnit()) return false;
          if (target.isRangedCombatUnit()) return false;
          return !target.isEnemyWithinAttackRange(attacker);
        }

        recordWaveCombatEscalationDecision(wave, unit, target, aggressiveForwardBefore, waveForwardBefore, sameLaneWaveEngagement, soloAggressiveCombat, aggressiveFrontlineEngagement, canEscalateWaveCombat, initialForwardCombatDelayed, waveCombatEscalated, crossLaneRangedAttack = false, strategicEscalationBlocked = false, engagementRole = 'attacker', strategicEngagedCount = 0, strategicEngagementThreshold = 0) {
          var _targetWave$id3, _unit$unitTypeName, _unit$lifeId, _target$team2, _targetWave$id4, _targetWave$laneId3, _targetWave$family, _target$lifeId2;

          if (!this.enableBattleTelemetry) return;
          const targetWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(target);
          const signature = [(_targetWave$id3 = targetWave == null ? void 0 : targetWave.id) != null ? _targetWave$id3 : -1, aggressiveForwardBefore, waveForwardBefore, sameLaneWaveEngagement, soloAggressiveCombat, aggressiveFrontlineEngagement, canEscalateWaveCombat, initialForwardCombatDelayed, waveCombatEscalated, crossLaneRangedAttack, strategicEscalationBlocked, engagementRole, strategicEngagedCount, strategicEngagementThreshold].join('|');

          if (this.telemetryCombatEscalationSignatureByWave.get(wave.id) === signature) {
            return;
          }

          this.telemetryCombatEscalationSignatureByWave.set(wave.id, signature);
          this.telemetryFrameCombatEscalationCount++;
          this.battleTelemetry.recordCombatEscalationDecision({
            type: 'wave-combat-escalation-decision',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: (_unit$unitTypeName = unit == null ? void 0 : unit.unitTypeName) != null ? _unit$unitTypeName : wave.unitName,
            unitLifeId: (_unit$lifeId = unit == null ? void 0 : unit.lifeId) != null ? _unit$lifeId : -1,
            unitSpawnId: this.battleTelemetry.getSpawnId(unit),
            targetTeam: (_target$team2 = target == null ? void 0 : target.team) != null ? _target$team2 : -1,
            targetWaveId: (_targetWave$id4 = targetWave == null ? void 0 : targetWave.id) != null ? _targetWave$id4 : -1,
            targetLaneId: (_targetWave$laneId3 = targetWave == null ? void 0 : targetWave.laneId) != null ? _targetWave$laneId3 : -1,
            targetFamilyName: targetWave ? (_targetWave$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[targetWave.family]) != null ? _targetWave$family : String(targetWave.family) : '',
            targetLifeId: (_target$lifeId2 = target == null ? void 0 : target.lifeId) != null ? _target$lifeId2 : -1,
            targetSpawnId: this.battleTelemetry.getSpawnId(target),
            aggressiveForward: aggressiveForwardBefore,
            waveForwardBefore,
            sameLaneWaveEngagement,
            soloAggressiveCombat,
            aggressiveFrontlineEngagement,
            canEscalateWaveCombat,
            initialForwardCombatDelayed,
            waveCombatEscalated,
            crossLaneRangedAttack,
            strategicEscalationBlocked,
            strategicEngagementBlockedReason: strategicEscalationBlocked ? 'cross-lane-ranged-local-combat' : '',
            engagementRole,
            strategicEngagedCount,
            strategicEngagementThreshold
          });
        }

        recordWaveTargetAssignment(wave, unit, target, previousTargetWaveId, source, assigned, wasAlreadyAssigned, previousTargetWaveIds) {
          var _unit$unitTypeName2, _wave$family, _targetWave$family2;

          if (!this.enableBattleTelemetry || !assigned || wasAlreadyAssigned) return;
          const targetWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(target);
          if (!targetWave) return;
          const assignmentState = wave.getTargetAssignmentTelemetryState();
          this.closeWaveIdleEpisode(wave, 'target-assigned');
          this.battleTelemetry.recordTargetWaveTransition({
            type: 'wave-target-assigned',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: (_unit$unitTypeName2 = unit == null ? void 0 : unit.unitTypeName) != null ? _unit$unitTypeName2 : wave.unitName,
            familyName: (_wave$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family : String(wave.family),
            targetWaveId: targetWave.id,
            targetTeam: targetWave.team,
            targetLaneId: targetWave.laneId,
            targetFamilyName: (_targetWave$family2 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[targetWave.family]) != null ? _targetWave$family2 : String(targetWave.family),
            previousTargetWaveId,
            previousTargetWaveIds,
            targetSource: source,
            targetSetChanged: true,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            targetWaveCount: wave.getTargetWaveCount(),
            targetWaveIds: wave.getTargetWaveIds(),
            ...assignmentState
          });
        }

        recordWaveForwardResume(wave, source = 'target-set-empty') {
          var _wave$family2;

          if (!this.enableBattleTelemetry) return;
          this.closeWaveIdleEpisode(wave, 'forward-resumed');
          this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-forward-resumed',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: (_wave$family2 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family2 : String(wave.family),
            targetWaveId: -1,
            targetSource: source,
            regroupLaneId: wave.laneId,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            forwardRecoveryResumedUnitCount: wave.getLastForwardRecoveryResumedUnitCount(),
            forwardRecoveryRetainedBusyUnitCount: wave.getLastForwardRecoveryRetainedBusyUnitCount(),
            forwardRecoveryRetainedBusyUnitLifeIds: wave.getLastForwardRecoveryRetainedBusyUnitLifeIds()
          });
        }

        recordWaveForwardRecoveryBlocked(wave, blocker) {
          var _wave$family3, _blocker$unit$lifeId, _blocker$unit, _blocker$unit$unitTyp, _blocker$unit2;

          if (!this.enableBattleTelemetry) return;
          this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-forward-recovery-blocked',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: (_wave$family3 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family3 : String(wave.family),
            recoveryBlockReason: blocker.reason,
            blockingUnitLifeId: (_blocker$unit$lifeId = (_blocker$unit = blocker.unit) == null ? void 0 : _blocker$unit.lifeId) != null ? _blocker$unit$lifeId : -1,
            blockingUnitName: (_blocker$unit$unitTyp = (_blocker$unit2 = blocker.unit) == null ? void 0 : _blocker$unit2.unitTypeName) != null ? _blocker$unit$unitTyp : '',
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode()
          });
        }

        recordWaveForwardRecoveryDeferred(wave, state) {
          var _wave$family4;

          if (!this.enableBattleTelemetry) return;
          this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-forward-recovery-deferred',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: (_wave$family4 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family4 : String(wave.family),
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            waveForwardBefore: wave.isForwardMode(),
            ...state,
            waveRegistered: this.waves.indexOf(wave) >= 0
          });
        }

        recordUnitIdleWithoutOrder(unit) {
          var _wave$family5, _wave$family6, _targetWave$id5, _targetWave$team, _targetWave$laneId4;

          if (!this.enableBattleTelemetry) return;
          if (!unit) return;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return;
          const targetWave = wave.getTargetWave();
          const targetWaveIds = wave.getTargetWaveIds();
          const existingEpisode = this.telemetryIdleEpisodes.get(wave.id);

          if (existingEpisode) {
            existingEpisode.unitLifeIds.add(unit.lifeId);
            return;
          }

          const episode = {
            startFrame: this.frame,
            team: unit.team,
            laneId: wave.laneId,
            unitName: unit.unitTypeName,
            familyName: (_wave$family5 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family5 : String(wave.family),
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            unitLifeIds: new Set([unit.lifeId])
          };
          this.telemetryIdleEpisodes.set(wave.id, episode);
          this.battleTelemetry.recordDiagnosticEvent({
            type: 'wave-idle-episode-start',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: unit.unitTypeName,
            familyName: (_wave$family6 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family6 : String(wave.family),
            unitLifeId: unit.lifeId,
            targetWaveId: (_targetWave$id5 = targetWave == null ? void 0 : targetWave.id) != null ? _targetWave$id5 : -1,
            targetWaveIds,
            targetWaveCount: targetWaveIds.length,
            targetTeam: (_targetWave$team = targetWave == null ? void 0 : targetWave.team) != null ? _targetWave$team : -1,
            targetLaneId: (_targetWave$laneId4 = targetWave == null ? void 0 : targetWave.laneId) != null ? _targetWave$laneId4 : -1,
            reason: targetWaveIds.length > 0 ? 'strategic-target-unresolved' : 'no-strategic-target-during-recovery',
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
            unitForward: unit.onForward,
            unitBusy: unit.onBusy,
            unitHasValidTarget: unit.hasValidEnemyTarget(),
            unitFreeHuntContinuityActive: unit.isFreeHuntContinuityActive(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            idleEpisodeStartFrame: episode.startFrame,
            idleEpisodeUnitCount: episode.unitLifeIds.size
          });
        }

        closeWaveIdleEpisode(wave, reason) {
          const episode = this.telemetryIdleEpisodes.get(wave.id);
          if (!episode) return;
          this.telemetryIdleEpisodes.delete(wave.id);
          this.battleTelemetry.recordDiagnosticEvent({
            type: 'wave-idle-episode-end',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: episode.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: episode.unitName,
            familyName: episode.familyName,
            reason,
            aggressiveForward: episode.aggressiveForward,
            freeHuntForwardOrigin: episode.freeHuntForwardOrigin,
            idleEpisodeStartFrame: episode.startFrame,
            idleEpisodeDurationFrames: Math.max(0, this.frame - episode.startFrame),
            idleEpisodeUnitCount: episode.unitLifeIds.size
          });
        }

        closeAllWaveIdleEpisodes(reason) {
          for (const wave of this.waves) {
            this.closeWaveIdleEpisode(wave, reason);
          }
        }

        closeTargetClearRecoveryWindow(wave, reason) {
          var _wave$family7;

          const recoveryWindow = this.telemetryTargetClearRecoveryWindows.get(wave.id);
          if (!recoveryWindow) return;
          this.telemetryTargetClearRecoveryWindows.delete(wave.id);
          this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-target-clear-recovery-unresolved',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: (_wave$family7 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family7 : String(wave.family),
            reason,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            targetWaveCount: wave.getTargetWaveCount(),
            targetWaveIds: wave.getTargetWaveIds(),
            targetClearOriginWaveId: recoveryWindow.clearedTargetWaveId,
            targetClearOriginLaneId: recoveryWindow.clearedTargetLaneId,
            targetClearFrame: recoveryWindow.clearFrame
          });
        }

        closeAllTargetClearRecoveryWindows(reason) {
          for (const wave of this.waves) {
            this.closeTargetClearRecoveryWindow(wave, reason);
          }
        }

        recordWaveTargetCleared(wave, target) {
          var _wave$family8, _target$family, _target$removalReason;

          if (!this.enableBattleTelemetry) return;

          if (target.remainingTargetWaveCount <= 0) {
            this.telemetryTargetClearRecoveryWindows.set(wave.id, {
              clearedTargetWaveId: target.id,
              clearedTargetLaneId: target.laneId,
              clearFrame: this.frame
            });
          }

          this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-target-cleared',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: (_wave$family8 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family8 : String(wave.family),
            targetWaveId: target.id,
            targetTeam: target.team,
            targetLaneId: target.laneId,
            targetFamilyName: (_target$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[target.family]) != null ? _target$family : String(target.family),
            targetSource: (_target$removalReason = target.removalReason) != null ? _target$removalReason : target.physicallyDead ? 'target-wave-dead' : 'target-wave-no-command-members',
            targetWavePhysicallyDead: target.physicallyDead,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
            targetWaveCount: target.remainingTargetWaveCount,
            targetWaveIds: wave.getTargetWaveIds(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin()
          });
        }

        recordWaveTargetClearOutcome(wave, outcome) {
          var _outcome$scanner$unit, _outcome$scanner, _wave$family9, _outcome$scanner$life, _outcome$scanner2, _targetWave$id6, _targetWave$team2, _targetWave$laneId5, _targetWave$family3, _outcome$target$lifeI, _outcome$target, _targetWave$laneId6, _outcome$scanner$unit2, _outcome$scanner3, _wave$family10, _targetWave$id7, _targetWave$team3;

          if (!this.enableBattleTelemetry) return;
          const targetWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(outcome.target);
          const recoveryWindow = this.telemetryTargetClearRecoveryWindows.get(wave.id);
          this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-target-clear-outcome',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: (_outcome$scanner$unit = (_outcome$scanner = outcome.scanner) == null ? void 0 : _outcome$scanner.unitTypeName) != null ? _outcome$scanner$unit : wave.unitName,
            familyName: (_wave$family9 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family9 : String(wave.family),
            unitLifeId: (_outcome$scanner$life = (_outcome$scanner2 = outcome.scanner) == null ? void 0 : _outcome$scanner2.lifeId) != null ? _outcome$scanner$life : -1,
            targetWaveId: (_targetWave$id6 = targetWave == null ? void 0 : targetWave.id) != null ? _targetWave$id6 : -1,
            targetTeam: (_targetWave$team2 = targetWave == null ? void 0 : targetWave.team) != null ? _targetWave$team2 : -1,
            targetLaneId: (_targetWave$laneId5 = targetWave == null ? void 0 : targetWave.laneId) != null ? _targetWave$laneId5 : -1,
            targetFamilyName: targetWave ? (_targetWave$family3 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[targetWave.family]) != null ? _targetWave$family3 : String(targetWave.family) : '',
            targetLifeId: (_outcome$target$lifeI = (_outcome$target = outcome.target) == null ? void 0 : _outcome$target.lifeId) != null ? _outcome$target$lifeI : -1,
            targetSource: outcome.reason,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin()
          }); // Persistent Hero Free Hunt does not enter the recovery transaction.
          // Keep its target-clear outcome, but do not emit a misleading
          // recovery-outcome event for the same transition.

          if (outcome.reason === 'persistent-free-hunt-target-set-empty') {
            this.telemetryTargetClearRecoveryWindows.delete(wave.id);
            return;
          }

          if (!recoveryWindow) return;
          const targetLaneId = (_targetWave$laneId6 = targetWave == null ? void 0 : targetWave.laneId) != null ? _targetWave$laneId6 : -1;
          const offLaneReplacement = targetLaneId >= 0 && recoveryWindow.clearedTargetLaneId >= 0 && targetLaneId !== recoveryWindow.clearedTargetLaneId;
          this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-target-clear-recovery-outcome',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: (_outcome$scanner$unit2 = (_outcome$scanner3 = outcome.scanner) == null ? void 0 : _outcome$scanner3.unitTypeName) != null ? _outcome$scanner$unit2 : wave.unitName,
            familyName: (_wave$family10 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family10 : String(wave.family),
            targetWaveId: (_targetWave$id7 = targetWave == null ? void 0 : targetWave.id) != null ? _targetWave$id7 : -1,
            targetTeam: (_targetWave$team3 = targetWave == null ? void 0 : targetWave.team) != null ? _targetWave$team3 : -1,
            targetLaneId,
            targetSource: outcome.reason,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
            targetWaveCount: wave.getTargetWaveCount(),
            targetWaveIds: wave.getTargetWaveIds(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            targetClearOriginWaveId: recoveryWindow.clearedTargetWaveId,
            targetClearOriginLaneId: recoveryWindow.clearedTargetLaneId,
            targetClearFrame: recoveryWindow.clearFrame,
            targetClearOffLaneReplacement: offLaneReplacement
          });
          this.telemetryTargetClearRecoveryWindows.delete(wave.id);
        }

        recordWaveScannerTrace(scanner, observedUnit, source, reason, targetWaveBefore, observedEnemyCount = 0, searchSameLaneOnly = false) {
          var _ref2, _getWaveForUnit, _ref3, _scanner$agent, _prefVelocity$x, _prefVelocity$z, _targetWaveBefore$id, _targetWaveBefore$lan, _targetWaveAfter$id, _targetWaveAfter$lane, _observedWave$id, _observedWave$laneId, _observed$unitTypeNam, _observed$lifeId, _observedPosition$x, _observedPosition$z;

          if (!this.enableBattleTelemetry) return;
          if (!this.battleTelemetry.isEnabled()) return;
          if (!scanner) return;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(scanner);
          if (!wave) return;
          this.telemetryFrameScannerSearchCount++;
          const targetWaveAfter = wave.getTargetWave();
          const observedWave = (_ref2 = (_getWaveForUnit = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(observedUnit)) != null ? _getWaveForUnit : targetWaveAfter) != null ? _ref2 : targetWaveBefore;
          const observed = (_ref3 = observedUnit != null ? observedUnit : observedWave == null ? void 0 : observedWave.getRepresentativeUnit()) != null ? _ref3 : null;
          const scannerPosition = scanner.agent ? scanner.agent.pos : scanner.node.worldPosition;
          const observedPosition = observed != null && observed.agent ? observed.agent.pos : observed == null ? void 0 : observed.node.worldPosition;
          const prefVelocity = (_scanner$agent = scanner.agent) == null ? void 0 : _scanner$agent.prefVel;
          this.battleTelemetry.recordScannerTrace({
            frame: this.frame,
            time: this.battleElapsedTime,
            source,
            reason,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            scannerUnitName: scanner.unitTypeName,
            scannerSpawnId: this.battleTelemetry.getSpawnId(scanner),
            scannerLifeId: scanner.lifeId,
            scannerX: scannerPosition.x,
            scannerZ: scannerPosition.z,
            scannerPrefVelocityX: (_prefVelocity$x = prefVelocity == null ? void 0 : prefVelocity.x) != null ? _prefVelocity$x : 0,
            scannerPrefVelocityZ: (_prefVelocity$z = prefVelocity == null ? void 0 : prefVelocity.z) != null ? _prefVelocity$z : 0,
            scannerBusy: scanner.onBusy,
            scannerForward: scanner.onForward,
            waveForward: wave.isForwardMode(),
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            targetWaveIdBefore: (_targetWaveBefore$id = targetWaveBefore == null ? void 0 : targetWaveBefore.id) != null ? _targetWaveBefore$id : -1,
            targetLaneIdBefore: (_targetWaveBefore$lan = targetWaveBefore == null ? void 0 : targetWaveBefore.laneId) != null ? _targetWaveBefore$lan : -1,
            targetWaveIdAfter: (_targetWaveAfter$id = targetWaveAfter == null ? void 0 : targetWaveAfter.id) != null ? _targetWaveAfter$id : -1,
            targetLaneIdAfter: (_targetWaveAfter$lane = targetWaveAfter == null ? void 0 : targetWaveAfter.laneId) != null ? _targetWaveAfter$lane : -1,
            targetWaveIdsAfter: wave.getTargetWaveIds(),
            targetWaveCountAfter: wave.getTargetWaveCount(),
            candidateWaveId: (_observedWave$id = observedWave == null ? void 0 : observedWave.id) != null ? _observedWave$id : -1,
            candidateLaneId: (_observedWave$laneId = observedWave == null ? void 0 : observedWave.laneId) != null ? _observedWave$laneId : -1,
            candidateUnitName: (_observed$unitTypeNam = observed == null ? void 0 : observed.unitTypeName) != null ? _observed$unitTypeNam : '',
            candidateSpawnId: this.battleTelemetry.getSpawnId(observed),
            candidateLifeId: (_observed$lifeId = observed == null ? void 0 : observed.lifeId) != null ? _observed$lifeId : -1,
            candidateX: (_observedPosition$x = observedPosition == null ? void 0 : observedPosition.x) != null ? _observedPosition$x : 0,
            candidateZ: (_observedPosition$z = observedPosition == null ? void 0 : observedPosition.z) != null ? _observedPosition$z : 0,
            observedEnemyCount,
            searchSameLaneOnly
          });
        }

        shouldUseSoloAggressiveCombat(wave, unit, enemy, aggressiveFrontlineEngagement = this.isAggressiveFrontlineEngagement(wave, unit, enemy)) {
          if (!wave.hasAggressiveForwardLaneLock()) return false;
          if (!unit || !enemy) return false; // A rear contact is a backstab: only the contacted unit may fight.
          // A whole aggressive wave may turn into Free Hunt only when its
          // contact unit is on or ahead of the current scanner along forward.

          if (!aggressiveFrontlineEngagement) {
            return true;
          }

          if (!unit.onForward && !unit.isSoloAggressiveSkirmishActive()) {
            return false;
          } // Wave lane is the strategic authority. It follows the active
          // scanner and is mirrored to every member, so an individual unit
          // drifting sideways during combat must not redefine this skirmish.


          const unitLane = wave.laneId;
          const enemyWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(enemy);
          const enemyLane = enemyWave ? enemyWave.laneId : -1;
          if (unitLane < 0 || enemyLane < 0) return false;

          if (unitLane !== enemyLane) {
            return true;
          }

          return this.isEnemyOutsideUnitAttackRange(unit, enemy);
        }

        isAggressiveFrontlineEngagement(wave, unit, enemy = null) {
          if (!wave.hasAggressiveForwardLaneLock()) return false;
          if (!(unit != null && unit.agent)) return false;
          const scanner = wave.getScanner(true); // The contact unit leaves Forward before this callback. When it was
          // the final forward unit, no scanner remains; classify that contact
          // from its target direction instead of making the threshold
          // unreachable for a fully engaged wave.

          if (!(scanner != null && scanner.agent)) {
            return !!enemy && !unit.hasPassedForwardTarget(enemy);
          }

          const dx = unit.agent.pos.x - scanner.agent.pos.x;
          const dz = unit.agent.pos.z - scanner.agent.pos.z;
          const forwardProgress = dx * scanner.forwardDir.x + dz * scanner.forwardDir.z; // Progress zero is the scanner's forward line, so a unit abreast of
          // it counts as a frontline contact rather than a rear ambush.

          return forwardProgress >= 0;
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

        getForwardModeAfterLocalCombat(unit) {
          if (!unit) return null;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return null;
          if (wave.isDead()) return null;
          if (!wave.isForwardMode()) return null;

          if (!unit.isSteady && !unit.onBusy && !unit.hasValidEnemyTarget()) {
            return wave.isAggressiveForwardMode();
          }

          return null;
        }

        shouldDelayInitialForwardCombat(wave, unit, enemy, useInitialForwardGate) {
          if (!useInitialForwardGate) return false;
          if (!wave.isInitialForwardCombatGateActive()) return false;
          if (!unit || !enemy) return false;
          const aliveCount = wave.getCommandAliveCount();
          const threshold = Math.ceil(aliveCount / 2);
          if (threshold <= 1) return false;
          const engagedCount = this.getForwardStrategicEngagedCount(wave, unit, enemy, wave.isAggressiveForwardMode());
          return engagedCount < threshold;
        }

        getForwardStrategicEngagedCount(wave, pendingUnit, pendingEnemy, aggressiveForward) {
          return aggressiveForward ? this.getAggressiveFrontlineEngagedCount(wave, pendingUnit, pendingEnemy) : this.getNormalStrategicEngagedCount(wave, pendingUnit, pendingEnemy);
        }

        getNormalStrategicEngagedCount(wave, pendingUnit, pendingEnemy) {
          let count = 0;

          for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];
            const isPending = unit === pendingUnit;
            if (!wave.isCommandUnit(unit)) continue;
            if (!isPending && !unit.onBusy) continue;
            const enemy = isPending ? pendingEnemy : unit.getValidEnemyTarget();
            if (!enemy) continue;
            if (enemy.isIsolatedRangedPursuit()) continue;
            if (this.isCrossLaneRangedAttack(unit, enemy)) continue;
            count++;
          }

          return count;
        }

        getAggressiveFrontlineEngagedCount(wave, pendingUnit, pendingEnemy) {
          let count = 0;

          for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];
            const isPending = unit === pendingUnit; // Pooled Unit objects can already belong to a newer wave while
            // an older wave still retains their historical array reference.
            // Only current command members may contribute to this threshold.

            if (!wave.isCommandUnit(unit)) continue;
            if (!isPending && !unit.onBusy) continue;
            const enemy = isPending ? pendingEnemy : unit.getValidEnemyTarget();
            if (!enemy) continue;
            if (enemy.isIsolatedRangedPursuit()) continue;

            if (!this.isSameLaneWaveEngagement(wave, enemy)) {
              continue;
            }

            if (!this.isAggressiveFrontlineEngagement(wave, unit, enemy)) {
              continue;
            }

            count++;
          }

          return count;
        }

        onWaveForwardTargetFound(unit, target, source = 'forward-scanner', allowRecoveryContinuation = false) {
          if (!unit || !target) return false;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return false;
          if (wave.isDead()) return false;

          if (!this.trySetWaveTargetFromScanner(wave, unit, target, source, allowRecoveryContinuation)) {
            return false;
          }

          wave.releaseForwardToFreeHunt();
          unit.setWaveSearchTarget(target);
          return true;
        }

        getWaveTargetForUnit(unit) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          return wave ? wave.getTargetWave() : null;
        }

        hasWaveHuntScannerConfirmedNoTarget(unit) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          return !wave || !wave.isPersistentFreeHunt() && wave.getTargetWaveCount() <= 0;
        }

        isPersistentWaveFreeHunt(unit) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          return !!(wave != null && wave.isPersistentFreeHunt());
        }

        getWaveHuntScannerForUnit(unit) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave || wave.isForwardMode()) return null;
          return wave.getScanner();
        }

        findSharedWaveTargetForUnit(unit) {
          if (!unit) return null;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return null;
          return wave.findSharedTargetForUnit(unit);
        } // A unit that has just finished local combat must immediately rejoin an
        // existing Free Hunt target set. This is deliberately event-driven: it
        // only performs the shared-target lookup at the combat-end transition,
        // never from a per-frame recovery path.


        tryPrimeSharedWaveHuntTargetAfterCombatEnd(unit) {
          if (!unit || unit.onBusy || unit.onForward || unit.isSteady || unit.isBackToLaneActive()) {
            return false;
          }

          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);

          if (!wave || wave.isDead() || !wave.isCommandUnit(unit) || !wave.isFreeHuntMode()) {
            return false;
          }

          const target = wave.findSharedTargetForUnit(unit);
          return !!target && unit.primeWaveHuntTarget(target);
        }

        processDynamicWaveLanes() {
          // Command-wave lanes are assigned at spawn and after target-set
          // recovery. Only hero waves continue to follow their physical lane.
          this.refreshDynamicLaneForWave(this.teamAHeroWave);
          this.refreshDynamicLaneForWave(this.teamBHeroWave);
        }

        processWaveForwardSearches() {
          for (let i = 0; i < this.waves.length; i++) {
            this.searchForwardWaveTarget(this.waves[i]);
          }
        }

        processPersistentHeroFreeHunts() {
          this.processPersistentHeroFreeHunt(this.teamAHeroWave);
          this.processPersistentHeroFreeHunt(this.teamBHeroWave);
        }

        processPersistentHeroFreeHunt(wave) {
          if (!wave || !wave.hasPersistentFreeHuntOrder()) return;
          if (wave.isDeadRuntime(this.frame)) return;

          if (!this.shouldRunFrameInterval(wave.getTargetSearchIntervalFrames(), wave.id)) {
            return;
          }

          const scanner = wave.getScanner(true);
          if (!(scanner != null && scanner.agent)) return;
          const enemyHero = wave.team === 0 ? this.teamBHero : this.teamAHero;
          const liveEnemyHero = this.isAliveUnit(enemyHero) ? enemyHero : null; // An opposing Hero is the strategic destination. A wave already in
          // contact remains in the target set, so close combat still interrupts
          // this route naturally until that combat is resolved.

          if (liveEnemyHero) {
            const enemyHeroWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
              error: Error()
            }), BattleWave) : BattleWave).getWaveForUnit(liveEnemyHero);

            if (enemyHeroWave && wave.hasEngagedTargetWave(enemyHeroWave)) {
              wave.prioritizeTargetWave(enemyHeroWave);
              return;
            }

            this.onWaveForwardTargetFound(scanner, liveEnemyHero, 'hero-global-enemy-hero');
            return;
          } // Without an opposing Hero, choose the nearest live enemy wave from
          // the whole battlefield. This is intentionally wave-level work and
          // runs on the Hero scanner interval, not once per rendered frame.


          if (wave.getTargetWaveCount() > 0) return;
          const target = this.findGlobalHeroFreeHuntTarget(wave, scanner);
          if (!target) return;
          this.onWaveForwardTargetFound(scanner, target, 'hero-global-wave-hunt');
        }

        findGlobalHeroFreeHuntTarget(heroWave, scanner) {
          if (!scanner.agent) return null;
          let best = null;
          let bestDistSq = Infinity;

          for (let i = 0; i < this.waves.length; i++) {
            const enemyWave = this.waves[i];
            if (!enemyWave || enemyWave === heroWave) continue;
            if (enemyWave.team === heroWave.team) continue;
            if (enemyWave.isDeadRuntime(this.frame)) continue;
            const candidate = enemyWave.getProgressScanner();
            if (!(candidate != null && candidate.agent)) continue;
            if (!this.isAliveUnit(candidate)) continue;
            const dx = candidate.agent.pos.x - scanner.agent.pos.x;
            const dz = candidate.agent.pos.z - scanner.agent.pos.z;
            const distSq = dx * dx + dz * dz;
            if (distSq >= bestDistSq) continue;
            bestDistSq = distSq;
            best = candidate;
          }

          return best;
        }

        searchForwardWaveTarget(wave, forceScannerPassCheck = false) {
          if (!wave) return;
          if (!wave.isForwardMode()) return;
          if (wave.isDeadRuntime(this.frame)) return;

          if (this.forwardScannerSearchFrame.get(wave) === this.frame) {
            return;
          }

          this.forwardScannerSearchFrame.set(wave, this.frame);
          let scanner = wave.getScanner();
          if (!scanner) return;

          if (this.resolveUnitReachedEnemyHeroLine(scanner)) {
            return;
          }

          const aggressiveForward = wave.isAggressiveForwardMode();

          if (!aggressiveForward && scanner.hasReachedEnemyHeroLine()) {
            const heroTarget = scanner.getEnemyHeroTarget();

            if (heroTarget) {
              this.onWaveForwardTargetFound(scanner, heroTarget);
            }

            return;
          }

          if (aggressiveForward) {
            if (!forceScannerPassCheck && !this.shouldRunFrameInterval(wave.getTargetSearchIntervalFrames(), wave.id)) {
              return;
            }

            scanner = wave.getScanner(true);
            if (!scanner) return;
            const targetWaveBefore = wave.getTargetWave();
            const target = this.findPassedEnemyWaveScanner(wave, scanner, true);
            const released = target ? this.onWaveForwardTargetFound(scanner, target) : false;

            if (released) {
              this.recordAggressiveForwardEvent('aggressive-scanner-pass-release', wave, scanner, target, 0, 'same-lane-scanner-passed-target');
            }

            const adjacentRearGuard = this.findDeepestAdjacentEnemyWaveScanner(wave, scanner);

            if (adjacentRearGuard) {
              if (wave.observeAggressiveAdjacentBoundary()) {
                this.recordAggressiveForwardEvent('aggressive-boundary-observed', wave, scanner, adjacentRearGuard, 0, 'deepest-adjacent-enemy-wave');
              }
            }

            const enemiesAhead = this.countEnemiesAheadInSameLane(scanner);
            this.recordWaveScannerTrace(scanner, target != null ? target : adjacentRearGuard, forceScannerPassCheck ? 'forward-aggressive-recovery-resume' : 'forward-aggressive', target ? 'target-passed-release' : enemiesAhead > 0 ? 'own-lane-blocked' : adjacentRearGuard ? 'lane-clear-adjacent-flank' : 'lane-clear', targetWaveBefore, (target ? 1 : 0) + enemiesAhead + (adjacentRearGuard ? 1 : 0), true);
            if (target) return;

            if (enemiesAhead > 0) {
              if (wave.observeAggressiveOwnLaneBlock()) {
                this.recordAggressiveForwardEvent('aggressive-own-lane-blocked', wave, scanner, adjacentRearGuard, enemiesAhead, 'enemy-ahead-in-own-lane');
              }

              return;
            } // An aggressive wave treats a neighbouring enemy wave as flank
            // information, not a forward-release boundary. With its own lane
            // clear it keeps marching toward the enemy line; an actual
            // same-lane combat still switches the wave through the normal
            // combat path in onWaveCombatStarted.


            return;
          }

          if (!forceScannerPassCheck && !this.shouldRunFrameInterval(wave.getTargetSearchIntervalFrames(), wave.id)) {
            return;
          }

          scanner = wave.getScanner(true);
          if (!scanner) return;
          const targetWaveBefore = wave.getTargetWave();
          const target = this.findPassedEnemyWaveScanner(wave, scanner, false);
          const releasesTarget = !!target;

          if (target && releasesTarget) {
            this.onWaveForwardTargetFound(scanner, target);
          }

          this.recordWaveScannerTrace(scanner, target, forceScannerPassCheck ? 'forward-normal-recovery-resume' : 'forward-normal', target ? releasesTarget ? 'target-passed-release' : 'target-not-passed' : 'no-forward-target', targetWaveBefore, target ? 1 : 0);
        }

        tryResumeWaveForwardFromRegroupCompletion(unit) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave || wave.isDeadRuntime(this.frame)) return false;

          if (!wave.isAwaitingForwardRecoveryAfterTargetClear()) {
            return false;
          }

          return this.tryFinishWaveForwardRecovery(wave) !== 'blocked';
        }

        tryResumeWaveForwardFromLocalCombatEnd(unit) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!unit || !wave || wave.isDeadRuntime(this.frame)) return false;

          if (!wave.isAwaitingForwardRecoveryAfterTargetClear()) {
            return false;
          }

          const recoveryResult = this.tryFinishWaveForwardRecovery(wave, 'local-combat-ended');

          if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordDiagnosticEvent({
              type: 'wave-recovery-local-combat-ended',
              frame: this.frame,
              time: this.battleElapsedTime,
              team: unit.team,
              waveId: wave.id,
              laneId: wave.laneId,
              regroupLaneId: unit.laneId,
              unitName: unit.unitTypeName,
              unitLifeId: unit.lifeId,
              unitSpawnId: this.battleTelemetry.getSpawnId(unit),
              unitBusy: unit.onBusy,
              unitBackToLane: unit.isBackToLaneActive(),
              aggressiveForward: wave.hasAggressiveForwardLaneLock(),
              freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
              recoveryBlockReason: recoveryResult === 'forward' ? 'local-combat-ended-forward-resumed' : recoveryResult === 'free-hunt' ? 'local-combat-ended-free-hunt-continued' : 'local-combat-ended-recovery-still-blocked',
              forwardRecoveryReadyUnitCount: wave.getForwardRecoveryReadyUnitCount(),
              forwardRecoveryRegroupingUnitCount: wave.getForwardRecoveryRegroupingUnitCount()
            });
          }

          return recoveryResult !== 'blocked';
        }

        tryFinishWaveForwardRecovery(wave, forwardResumeSource = 'target-set-empty') {
          const completed = wave.tryResumeForward(this.refreshLaneBeforeWaveForward, readyWave => this.tryContinueRecoveryFreeHuntBeforeForward(readyWave));
          if (!completed) return 'blocked';
          if (!wave.isForwardMode()) return 'free-hunt';
          this.recordWaveForwardResume(wave, forwardResumeSource); // Safety net for a scanner pass that occurs after the pre-forward
          // check but before the next ordinary scanner interval.

          this.searchForwardWaveTarget(wave, true);
          return 'forward';
        }

        tryContinueRecoveryFreeHuntBeforeForward(wave) {
          const scanner = wave.getScanner(true);
          if (!scanner) return false;
          const sameLaneOnly = wave.hasAggressiveForwardLaneLock();
          const targetWaveBefore = wave.getTargetWave();
          const target = this.findPassedEnemyWaveScanner(wave, scanner, sameLaneOnly);
          const released = target ? this.onWaveForwardTargetFound(scanner, target, 'recovery-pre-forward-scanner-pass', true) : false;
          this.recordWaveScannerTrace(scanner, target, sameLaneOnly ? 'recovery-pre-forward-aggressive' : 'recovery-pre-forward-normal', released ? 'target-passed-release' : 'no-forward-target', targetWaveBefore, target ? 1 : 0);
          return released;
        }

        findPassedEnemyWaveScanner(wave, scanner, sameLaneOnly) {
          if (!scanner.agent) return null;
          const ownLane = wave.laneId >= 0 ? this.clampLaneId(wave.laneId) : this.getCurrentLaneIdForUnit(scanner);
          if (ownLane < 0) return null;
          const maxRange = Math.max(0, scanner.targetSearchRange);
          const maxRangeSq = maxRange * maxRange;
          let best = null;
          let bestDistSq = Infinity;

          for (let i = 0; i < this.waves.length; i++) {
            const enemyWave = this.waves[i];
            if (!enemyWave || enemyWave === wave) continue;
            if (enemyWave.team === wave.team) continue;
            if (enemyWave.isDeadRuntime(this.frame)) continue;
            if (enemyWave.laneId < 0) continue;
            const enemyLane = this.clampLaneId(enemyWave.laneId);
            const laneDistance = Math.abs(enemyLane - ownLane);

            if (sameLaneOnly ? laneDistance !== 0 : laneDistance > 1) {
              continue;
            }

            const enemyScanner = enemyWave.getProgressScanner();
            if (!(enemyScanner != null && enemyScanner.agent)) continue;
            if (!scanner.hasPassedForwardTarget(enemyScanner)) continue;
            const dx = enemyScanner.agent.pos.x - scanner.agent.pos.x;
            const dz = enemyScanner.agent.pos.z - scanner.agent.pos.z;
            const distSq = dx * dx + dz * dz;
            if (distSq > maxRangeSq) continue;
            if (distSq >= bestDistSq) continue;
            bestDistSq = distSq;
            best = enemyScanner;
          }

          return best;
        }

        findDeepestAdjacentEnemyWaveScanner(wave, scanner) {
          if (!scanner.agent) return null;
          const ownLane = wave.laneId >= 0 ? this.clampLaneId(wave.laneId) : this.getCurrentLaneIdForUnit(scanner);
          if (ownLane < 0) return null;
          let best = null;
          let bestProgress = -Infinity;

          for (let i = 0; i < this.waves.length; i++) {
            const enemyWave = this.waves[i];
            if (!enemyWave) continue;
            if (enemyWave.team === wave.team) continue;
            if (enemyWave.isDeadRuntime(this.frame)) continue;
            if (enemyWave.laneId < 0) continue;
            const enemyLane = this.clampLaneId(enemyWave.laneId);

            if (Math.abs(enemyLane - ownLane) !== 1) {
              continue;
            }

            const enemyScanner = enemyWave.getProgressScanner();

            if (!enemyScanner || !enemyScanner.agent) {
              continue;
            }

            const progress = enemyScanner.agent.pos.x * scanner.forwardDir.x + enemyScanner.agent.pos.z * scanner.forwardDir.z;

            if (progress > bestProgress) {
              bestProgress = progress;
              best = enemyScanner;
            }
          }

          return best;
        }

        countEnemiesAheadInSameLane(scanner) {
          if (scanner.laneId < 0) return 0;
          const ownLane = this.clampLaneId(scanner.laneId);
          const enemies = scanner.team === 0 ? this.teamB : this.teamA;
          let count = 0;

          for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
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
          var _wave$family11;

          if (!this.enableBattleTelemetry) return;
          const boundaryWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
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
            familyName: (_wave$family11 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family11 : String(wave.family),
            reason,
            boundaryWaveId: boundaryWave ? boundaryWave.id : -1,
            boundaryLaneId: boundaryWave ? boundaryWave.laneId : -1,
            boundaryUnitName: boundary ? boundary.unitTypeName : '',
            enemiesAhead,
            combatPoint: this.combatPoint[wave.team] || 0
          });
        }

        processWaveForwardRecoveries() {
          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
              continue;
            }

            if (!this.shouldRunFrameInterval(wave.getTargetSearchIntervalFrames(), wave.id)) {
              continue;
            }

            wave.refreshInitialForwardCombatGate();
            const recoveryResult = this.tryFinishWaveForwardRecovery(wave);

            if (recoveryResult !== 'blocked') {
              continue;
            }

            const blocker = wave.consumeForwardRecoveryBlockTelemetry();

            if (blocker) {
              this.recordWaveForwardRecoveryBlocked(wave, blocker);
            }

            const deferred = wave.consumeForwardRecoveryDeferredTelemetry();

            if (deferred) {
              this.recordWaveForwardRecoveryDeferred(wave, deferred);
            }
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
            this.updateWaveBannerDebugTint(wave);
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

        refreshDynamicLaneForWave(wave) {
          if (!wave) return;
          if (wave.isDeadRuntime(this.frame)) return;
          if (wave.hasAggressiveForwardLaneLock()) return;
          if (wave.hasBackToLaneUnits()) return;
          const interval = wave.getTargetSearchIntervalFrames();
          const offset = wave.id + Math.floor(interval / 2); // Lane is strategic metadata only. Stagger updates by wave
          // and away from forward scans for the same wave.

          if (!this.shouldRunFrameInterval(interval, offset)) {
            return;
          } // This path is reserved for hero waves. Command waves keep their
          // assigned lane so a scanner's temporary lateral position cannot
          // expand scanner-pass checks beyond the same/adjacent lane rules.


          const scanner = wave.getScanner();
          if (!scanner) return;
          const scannerX = scanner.agent ? scanner.agent.pos.x : scanner.node.worldPosition.x;
          const laneId = this.getNearestLaneIdForX(scannerX);

          if (laneId >= 0 && laneId !== wave.laneId) {
            const previousLaneId = wave.laneId;
            wave.setLaneId(laneId);
            this.handleWaveStrategicLaneChanged(wave, previousLaneId);
          }
        }

        pruneDeadWaves() {
          for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];
            if (!wave || !wave.isDeadRuntime(this.frame)) continue;

            if (wave) {
              this.closeWaveIdleEpisode(wave, 'wave-despawned');
              this.closeTargetClearRecoveryWindow(wave, 'wave-despawned');
            }

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

          const laneSelection = this.getHeroSupportLaneSelection(team);
          const hero = this.activateHeroForTeam(team, laneSelection.laneId, laneSelection.unitsPerLane);

          if (!this.isAliveUnit(hero)) {
            return;
          }

          this.unlockHeroForward(team, hero, laneSelection.laneId);
        }

        processWaveTargetClearTelemetry() {
          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
              continue;
            }

            const interval = wave.getTargetSearchIntervalFrames();

            if (!this.shouldRunFrameInterval(interval, wave.id)) {
              continue;
            }

            const previousLaneId = wave.laneId;
            const pending = wave.processPendingTargetLifecycle();

            if (pending && this.enableBattleTelemetry) {
              var _wave$family12;

              this.battleTelemetry.recordTargetWaveLifecycleEvent({
                type: 'wave-target-lifecycle-pending-processed',
                frame: this.frame,
                time: this.battleElapsedTime,
                team: wave.team,
                waveId: wave.id,
                laneId: wave.laneId,
                unitName: wave.unitName,
                familyName: (_wave$family12 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                  error: Error()
                }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family12 : String(wave.family),
                reason: pending.pendingReason,
                strategicIntervalFrames: interval,
                strategicPendingFrame: pending.pendingFrame,
                strategicPendingDelayFrames: Math.max(0, this.frame - pending.pendingFrame),
                strategicPendingTargetWaveId: pending.pendingTargetWaveId,
                strategicPendingEventCount: pending.pendingEventCount,
                targetWaveCountBefore: pending.targetWaveCountBefore,
                targetWaveCountAfter: pending.targetWaveCountAfter
              });
            }

            this.handleWaveStrategicLaneChanged(wave, previousLaneId);
            this.flushWaveTargetClearTelemetry(wave);
          }
        }

        handleWaveStrategicLaneChanged(movedWave, previousLaneId) {
          if (!movedWave || movedWave.isDeadRuntime(this.frame) || previousLaneId === movedWave.laneId) {
            return;
          }

          for (let i = 0; i < this.waves.length; i++) {
            const pursuingWave = this.waves[i];

            if (!pursuingWave || pursuingWave === movedWave || pursuingWave.isDeadRuntime(this.frame)) {
              continue;
            }

            if (!pursuingWave.removeAggressiveOffLaneTargetWave(movedWave)) {
              continue;
            }

            this.flushWaveTargetClearTelemetry(pursuingWave);
          }
        }

        flushWaveTargetClearTelemetry(wave) {
          let clearedTarget = wave.consumeClearedTargetTelemetry();

          while (clearedTarget) {
            this.recordWaveTargetCleared(wave, clearedTarget);
            clearedTarget = wave.consumeClearedTargetTelemetry();
          }

          const targetClearOutcome = wave.consumeTargetClearOutcomeTelemetry();

          if (targetClearOutcome) {
            this.recordWaveTargetClearOutcome(wave, targetClearOutcome);
          }
        }

        unlockHeroForward(team, hero, laneId) {
          let heroWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

          if (!heroWave || heroWave.isDead()) {
            this.registerHeroWave(hero, team, hero.unitTypeName, hero.props ? hero.props.family : (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily).Sword, hero.props ? hero.props.tier : 1, laneId);
            heroWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;
          }

          if (heroWave) {
            const previousLaneId = heroWave.laneId;
            heroWave.setLaneId(laneId);
            this.handleWaveStrategicLaneChanged(heroWave, previousLaneId);
          }

          this.heroForwardUnlocked[team] = true;
          hero.setSteady(false, true);

          if (heroWave) {
            this.ensureBattleWaveRegistered(heroWave);
            heroWave.forceForwardMode();
          }
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

        canTeamAffordAnySpawn(team) {
          return this.canAffordAnySpawnEntry(team);
        }

        canAffordAnyMeleeSpawnEntry(team) {
          const entries = this.getDatabaseTeamEntries(team);

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
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

        resetBattleTelemetry() {
          this.battleTelemetry.reset(this.enableBattleTelemetry, this.createBattleTelemetryStartConfig());
          this.battleTelemetry.configureDiagnostics(this.battleTelemetryMaxSnapshots, this.battleTelemetryMaxDiagnosticEvents, this.battleTelemetryMaxScannerTraces);
        }

        ensureBattleCardRuntime() {
          if (this.battleCardRuntime) return;
          this.battleCardRuntime = new (_crd && BattleCardRuntime === void 0 ? (_reportPossibleCrUseOfBattleCardRuntime({
            error: Error()
          }), BattleCardRuntime) : BattleCardRuntime)(this.battleCardDatabase, event => this.recordBattleCardTelemetryEvent(event));
        }

        recordBattleCardTelemetryEvent(event) {
          if (!this.enableBattleTelemetry) return;
          this.battleTelemetry.recordCardEvent({ ...event,
            frame: this.frame
          });
        }

        recordBattleTelemetryWaveSpawnDecision(decision) {
          if (!this.enableBattleTelemetry) return;
          this.battleTelemetry.recordWaveSpawnDecision(decision);
        }

        recordBattleTelemetryRangedKite(unit, target, reason, targetDistance, moveX, moveZ) {
          var _unit$props$family, _target$props$family;

          if (!this.enableBattleTelemetry) return;
          if (!(unit != null && unit.agent) || !(target != null && target.agent)) return;
          this.battleTelemetry.recordDiagnosticEvent({
            type: 'ranged-kite',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: unit.waveRuntimeId,
            laneId: unit.laneId,
            unitName: unit.unitTypeName,
            familyName: unit.props ? (_unit$props$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[unit.props.family]) != null ? _unit$props$family : String(unit.props.family) : '',
            unitLifeId: unit.lifeId,
            targetTeam: target.team,
            targetWaveId: target.waveRuntimeId,
            targetLaneId: target.laneId,
            targetFamilyName: target.props ? (_target$props$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[target.props.family]) != null ? _target$props$family : String(target.props.family) : '',
            targetLifeId: target.lifeId,
            unitX: unit.agent.pos.x,
            unitZ: unit.agent.pos.z,
            targetX: target.agent.pos.x,
            targetZ: target.agent.pos.z,
            targetDistance,
            forwardDirX: unit.forwardDir.x,
            forwardDirZ: unit.forwardDir.z,
            moveX,
            moveZ,
            reason
          });
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

          this.battleTelemetry.recordSnapshot(this.createBattleTelemetrySnapshot(false));
        }

        createBattleTelemetrySnapshot(includeUnits = false) {
          return {
            frame: this.frame,
            time: this.battleElapsedTime,
            teams: [this.createBattleTelemetryTeamSnapshot(0, includeUnits), this.createBattleTelemetryTeamSnapshot(1, includeUnits)]
          };
        }

        createBattleTelemetryTeamSnapshot(team, includeUnits) {
          var _this$getBattleCardTe;

          const waves = [];

          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDeadRuntime(this.frame)) continue;
            waves.push(this.createBattleTelemetryWaveSnapshot(wave, includeUnits));
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

        createBattleTelemetryWaveSnapshot(wave, includeUnits) {
          var _wave$family13, _scannerPosition$x, _scannerPosition$z;

          let busyCount = 0;
          let targetCount = 0;
          let continuityCount = 0;
          let forwardCount = 0;
          let isolatedRangedPursuitCount = 0;
          let staleUnitReferenceCount = 0;
          let maxPhysicalLaneDistance = 0;
          const units = [];

          for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i]; // A pooled Unit may have been reused by another live wave while
            // remaining in this wave's historical units array.

            if ((_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
              error: Error()
            }), BattleWave) : BattleWave).getWaveForUnit(unit) !== wave) {
              staleUnitReferenceCount++;
              continue;
            }

            if (!this.isAliveUnit(unit)) continue;
            if (unit.onBusy) busyCount++;
            if (unit.hasValidEnemyTarget()) targetCount++;

            if (unit.isContinuingFreeHuntIntent()) {
              continuityCount++;
            }

            if (unit.onForward) forwardCount++;

            if (unit.isIsolatedRangedPursuit()) {
              isolatedRangedPursuitCount++;
            }

            const position = unit.agent ? unit.agent.pos : unit.node.worldPosition;
            const physicalLaneId = this.getCurrentLaneIdForUnit(unit);
            const waveLaneDistance = wave.laneId >= 0 && physicalLaneId >= 0 ? Math.abs(this.clampLaneId(wave.laneId) - this.clampLaneId(physicalLaneId)) : -1;
            const target = unit.getValidEnemyTarget();
            const targetWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
              error: Error()
            }), BattleWave) : BattleWave).getWaveForUnit(target);

            if (!unit.isIsolatedRangedPursuit() && waveLaneDistance >= 0) {
              maxPhysicalLaneDistance = Math.max(maxPhysicalLaneDistance, waveLaneDistance);
            }

            if (includeUnits) {
              var _target$lifeId3, _targetWave$id8, _targetWave$laneId7;

              units.push({
                spawnId: this.battleTelemetry.getSpawnId(unit),
                lifeId: unit.lifeId,
                unitName: unit.unitTypeName,
                x: position.x,
                z: position.z,
                laneId: unit.laneId,
                physicalLaneId,
                waveLaneDistance,
                busy: unit.onBusy,
                forward: unit.onForward,
                backToLane: unit.isBackToLaneActive(),
                regroupDestinationLaneId: unit.getTelemetryRegroupDestinationLaneId(),
                regroupLaneCoreDistanceX: unit.getTelemetryRegroupLaneCoreDistanceX(),
                freeHuntContinuity: unit.isFreeHuntContinuityActive(),
                isolatedRangedPursuit: unit.isIsolatedRangedPursuit(),
                isolatedRangedPursuitReturningToWave: unit.isReturningToWaveAfterIsolatedRangedPursuit(),
                movementIntent: unit.getTelemetryMovementIntent(),
                isolatedRangedPursuitReturnCommandAttemptCount: unit.getIsolatedRangedPursuitReturnCommandAttemptCount(),
                isolatedRangedPursuitReturnRepeatedCommandCount: unit.getIsolatedRangedPursuitReturnRepeatedCommandCount(),
                isolatedRangedPursuitReturnLocalCombatCount: unit.getIsolatedRangedPursuitReturnLocalCombatCount(),
                isolatedRangedPursuitLastReturnCommandCause: unit.getIsolatedRangedPursuitLastReturnCommandCause(),
                targetLifeId: (_target$lifeId3 = target == null ? void 0 : target.lifeId) != null ? _target$lifeId3 : -1,
                targetSpawnId: this.battleTelemetry.getSpawnId(target),
                targetWaveId: (_targetWave$id8 = targetWave == null ? void 0 : targetWave.id) != null ? _targetWave$id8 : -1,
                targetLaneId: (_targetWave$laneId7 = targetWave == null ? void 0 : targetWave.laneId) != null ? _targetWave$laneId7 : -1
              });
            }
          }

          const targetState = wave.getTelemetryTargetState();
          const scanner = wave.getScanner();
          const scannerPosition = scanner != null && scanner.agent ? scanner.agent.pos : scanner == null ? void 0 : scanner.node.worldPosition;
          return {
            waveId: wave.id,
            team: wave.team,
            laneId: wave.laneId,
            unitName: wave.unitName,
            family: wave.family,
            familyName: (_wave$family13 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
              error: Error()
            }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family13 : String(wave.family),
            tier: wave.tier,
            totalCount: wave.totalCount,
            aliveCount: wave.getRuntimeAliveCount(this.frame),
            busyCount,
            targetCount,
            continuityCount,
            forwardCount,
            isolatedRangedPursuitCount,
            commandAliveCount: wave.getCommandAliveCount(),
            awaitingForwardRecovery: wave.isAwaitingForwardRecoveryAfterTargetClear(),
            forwardRecoveryReadyUnitCount: wave.getForwardRecoveryReadyUnitCount(),
            forwardRecoveryRegroupingUnitCount: wave.getForwardRecoveryRegroupingUnitCount(),
            staleUnitReferenceCount,
            healthRatio: wave.getRuntimeHealthRatio(this.frame),
            forwardMode: wave.isForwardMode(),
            aggressiveForward: wave.isAggressiveForwardMode(),
            freeHuntActive: wave.isFreeHuntMode(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            targetWaveLaneIds: wave.getTargetWaveLaneIds(),
            scannerSpawnId: this.battleTelemetry.getSpawnId(scanner),
            scannerX: (_scannerPosition$x = scannerPosition == null ? void 0 : scannerPosition.x) != null ? _scannerPosition$x : 0,
            scannerZ: (_scannerPosition$z = scannerPosition == null ? void 0 : scannerPosition.z) != null ? _scannerPosition$z : 0,
            scannerPhysicalLaneId: this.getCurrentLaneIdForUnit(scanner),
            maxPhysicalLaneDistance,
            ...(includeUnits ? {
              units
            } : {}),
            ...targetState
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

          if (this.combatResolutionDepth > 0) {
            if (force) {
              this.pendingForcedBattleWinnerCheck = true;
            }

            return;
          }

          if (!this.enableNoAffordableSpawnWinnerFallback) return;
          if (!this.isCombatPointEnabled()) return;

          if (!force && !this.shouldRunFrameInterval(this.battleWinnerCheckIntervalFrames)) {
            return;
          }

          const teamAHasTroops = this.getAliveNonHeroUnitCount(0) > 0 || this.isAliveUnit(this.teamAHero);
          const teamBHasTroops = this.getAliveNonHeroUnitCount(1) > 0 || this.isAliveUnit(this.teamBHero);
          const teamACanSpawn = this.canAffordAnySpawnEntry(0);
          const teamBCanSpawn = this.canAffordAnySpawnEntry(1);
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

          if (this.combatResolutionDepth > 0) {
            // Combat can resolve more than one terminal event in a single
            // damage batch. Preserve the first one so a later death cannot
            // reverse an already-decided winner before the batch completes.
            if (this.pendingBattleWinner) {
              return;
            }

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
          console.log(`[BattleWinner] winnerTeam=${winnerTeam}, ` + `loserTeam=${loserTeam}, reason=${reason}`);
          const canFinishTelemetry = this.enableBattleTelemetry && this.battleTelemetry.isEnabled() && !this.battleTelemetry.hasEnded();

          if (canFinishTelemetry) {
            this.closeAllWaveIdleEpisodes('battle-ended');
            this.closeAllTargetClearRecoveryWindows('battle-ended');
            this.battleTelemetry.recordFinalSnapshot(this.createBattleTelemetrySnapshot(true));
            this.recordBattleFramePerformanceSummary();
          }

          const progressionResult = this.battleProgressionProvider ? this.battleProgressionProvider.handleBattleResult(winnerTeam, loserTeam, reason) : null;

          if (!canFinishTelemetry) {
            this.scheduleBattleTelemetryPageReload();
            return;
          }

          const report = this.battleTelemetry.finish(winnerTeam, loserTeam, reason, this.frame, this.battleElapsedTime, this.combatPoint, this.aliveCount, this.deathCount, this.killCount, this.counterKillCount, progressionResult);
          this.battleTelemetry.exportReport(report, this.battleTelemetryFilePrefix, this.downloadBattleTelemetryOnEnd, this.logBattleTelemetryOnEnd);
          this.scheduleBattleTelemetryPageReload();
        }

        hasBattleWinner() {
          return this.battleWinnerResolved;
        }

        isBattleCombatLocked() {
          return this.heroDefeatDetected || this.hasBattleWinner();
        }

        haltAllUnitsForBattleEnd() {
          const units = this.teamA.concat(this.teamB);

          for (let i = 0; i < units.length; i++) {
            var _units$i;

            (_units$i = units[i]) == null || _units$i.haltForBattleEnd();
          }
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
          const pendingWinner = this.pendingBattleWinner;
          const shouldCheckFallback = this.pendingForcedBattleWinnerCheck;
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
          const progressionProvider = this.battleProgressionProvider; // A real campaign keeps its state in local storage and starts its next
          // scene only after telemetry export has been requested. This keeps the
          // battle-end sequence in one owner instead of racing two timers.

          if (progressionProvider) {
            if (!progressionProvider.shouldResetBattleAfterResult()) {
              return;
            }

            const delayMs = Math.max(0, this.battleTelemetryReloadDelaySeconds) * 1000;

            const resetBattle = () => {
              if (!progressionProvider.resetBattle()) {
                console.warn('[BattleProgression] battle runtime reset was not started.');
              }
            };

            console.log(`[BattleProgression] restart battle runtime in ` + `${(delayMs / 1000).toFixed(2)}s.`);

            if (typeof window !== 'undefined' && window.setTimeout) {
              window.setTimeout(resetBattle, delayMs);
              return;
            }

            this.scheduleOnce(resetBattle, delayMs / 1000);
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
          const nextBatchUrl = this.getNextTelemetryBatchUrl();

          if (this.isTelemetryBatchQueryActive() && !nextBatchUrl) {
            console.log('[BattleTelemetry] telemetry batch query complete.');
            return;
          }

          const delayMs = Math.max(0, this.battleTelemetryReloadDelaySeconds) * 1000;
          console.log(`[BattleTelemetry] reload page in ` + `${(delayMs / 1000).toFixed(2)}s.`);
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
          const params = new URLSearchParams(window.location.search);
          this.normalizeTelemetryBatchQueryParams(params);
          const levelQuery = this.getTelemetryLevelQueryConfig(params);

          if (levelQuery.active) {
            params.set('currentLevel', `${levelQuery.currentLevel}`);
            params.set('TotalLevels', `${levelQuery.totalLevels}`);
            this.removeLegacyAccuracyBatchParams(params);

            if (levelQuery.currentLevel >= levelQuery.totalLevels) {
              return '';
            }

            params.set('currentLevel', `${levelQuery.currentLevel + 1}`);
            return this.buildTelemetryBatchUrl(params);
          }

          const team = this.getTelemetryBatchQueryInt(params, 'team', 0) === 1 ? 1 : 0;
          const currentAcc = this.clamp01(this.getTelemetryBatchQueryNumber(params, 'currentAcc', 0));
          const currentBatch = Math.max(0, this.getTelemetryBatchQueryInt(params, 'currentBatch', 0));
          const step = Math.max(0, this.getTelemetryBatchQueryNumber(params, 'step', 0));
          const numBatchPerStep = Math.max(1, this.getTelemetryBatchQueryInt(params, 'numBatchPerStep', 1));
          const end = this.clamp01(this.getTelemetryBatchQueryNumber(params, 'end', 1));
          const nextBatch = currentBatch + 1;
          params.set('team', `${team}`);
          params.set('step', this.formatTelemetryBatchNumber(step));
          params.set('numBatchPerStep', `${numBatchPerStep}`);
          params.set('end', this.formatTelemetryBatchNumber(end));

          if (nextBatch < numBatchPerStep) {
            params.set('currentAcc', this.formatTelemetryBatchNumber(currentAcc));
            params.set('currentBatch', `${nextBatch}`);
            return this.buildTelemetryBatchUrl(params);
          }

          if (currentAcc >= end - 0.000001) {
            return '';
          }

          if (step <= 0) {
            return '';
          }

          const nextAcc = Math.min(end, currentAcc + step);
          params.set('currentAcc', this.formatTelemetryBatchNumber(nextAcc));
          params.set('currentBatch', '0');
          return this.buildTelemetryBatchUrl(params);
        }

        isTelemetryBatchQueryActive() {
          if (typeof window === 'undefined') return false;
          if (!window.location) return false;
          const params = new URLSearchParams(window.location.search);
          this.normalizeTelemetryBatchQueryParams(params);

          if (this.getTelemetryLevelQueryConfig(params).active) {
            return true;
          }

          return this.hasTelemetryBatchQueryParam(params, 'currentAcc') || this.hasTelemetryBatchQueryParam(params, 'currentBatch') || this.hasTelemetryBatchQueryParam(params, 'step') || this.hasTelemetryBatchQueryParam(params, 'numBatchPerStep') || this.hasTelemetryBatchQueryParam(params, 'end');
        }

        getTelemetryLevelQueryConfig(params) {
          const totalLevels = Math.max(0, this.getTelemetryBatchQueryInt(params, 'TotalLevels', 0));

          if (totalLevels <= 0) {
            return {
              active: false,
              currentLevel: 0,
              totalLevels: 0,
              levelProgress: 0
            };
          }

          const currentLevel = Math.max(1, Math.min(totalLevels, this.getTelemetryBatchQueryInt(params, 'currentLevel', 1)));
          const levelProgress = totalLevels <= 1 ? 1 : (currentLevel - 1) / (totalLevels - 1);
          return {
            active: true,
            currentLevel,
            totalLevels,
            levelProgress
          };
        }

        removeLegacyAccuracyBatchParams(params) {
          const keys = ['currentAcc', 'currentBatch', 'step', 'numBatchPerStep', 'end'];

          for (let i = 0; i < keys.length; i++) {
            params.delete(keys[i]);
            params.delete(`?${keys[i]}`);
          }
        }

        getTelemetryBatchQueryNumber(params, key, fallback) {
          const value = Number(this.getTelemetryBatchQueryParam(params, key));
          return Number.isFinite(value) ? value : fallback;
        }

        getTelemetryBatchQueryInt(params, key, fallback) {
          return Math.floor(this.getTelemetryBatchQueryNumber(params, key, fallback));
        }

        formatTelemetryBatchNumber(value) {
          return `${Math.round(value * 1000000) / 1000000}`;
        }

        hasTelemetryBatchQueryParam(params, key) {
          return params.has(key) || params.has(`?${key}`);
        }

        getTelemetryBatchQueryParam(params, key) {
          var _params$get2;

          return (_params$get2 = params.get(`?${key}`)) != null ? _params$get2 : params.get(key);
        }

        normalizeTelemetryBatchQueryParams(params) {
          const keys = ['team', 'currentAcc', 'currentBatch', 'step', 'numBatchPerStep', 'end', 'currentLevel', 'TotalLevels', 'totalLevels'];

          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const badKey = `?${key}`;
            const badValue = params.get(badKey);

            if (badValue !== null) {
              params.set(key, badValue);
            }

            params.delete(badKey);
          }

          const lowerCaseTotalLevels = params.get('totalLevels');

          if (lowerCaseTotalLevels !== null && !params.has('TotalLevels')) {
            params.set('TotalLevels', lowerCaseTotalLevels);
          }

          params.delete('totalLevels');
        }

        buildTelemetryBatchUrl(params) {
          if (typeof window === 'undefined') return '';
          if (!window.location) return '';
          const location = window.location;
          const origin = location.origin || `${location.protocol}//${location.host}`;
          const query = params.toString();
          return `${origin}${location.pathname}` + `${query ? `?${query}` : ''}` + `${location.hash || ''}`;
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
            cardEffectsEnabled: this.enableBattleCardEffects,
            rangedKitePolicy: 'own-side',
            cards: this.getBattleCardTelemetrySnapshot(),
            progression: this.battleProgressionProvider ? this.battleProgressionProvider.createTelemetrySnapshot() : undefined
          };
        }

        createBattleTelemetryBatchConfigSnapshot() {
          const inactive = {
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
          const params = new URLSearchParams(window.location.search);
          this.normalizeTelemetryBatchQueryParams(params);
          const team = this.getTelemetryBatchQueryInt(params, 'team', 0) === 1 ? 1 : 0;
          const levelQuery = this.getTelemetryLevelQueryConfig(params);

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
            const targetPhysicalLaneId = this.getPhysicalLaneIdForWave(wave);
            wave.invalidateRuntimeState();
            wave.handleUnitWillDespawn(unit);
            this.updateWaveBannerHealthBar(wave);

            if (wave.getCommandAliveCount() <= 0) {
              this.markTargetLifecyclePendingForWave(wave, 'target-command-members-exhausted-by-despawn', targetPhysicalLaneId);
            }
          }

          const anyController = this.cinematicController;

          if (anyController && typeof anyController.onUnitWillDespawn === 'function') {
            anyController.onUnitWillDespawn(unit);
          }
        }

        getPhysicalLaneIdForWave(wave) {
          if (!wave) return -1;
          return this.getCurrentLaneIdForUnit(wave.getScanner());
        }

        markTargetLifecyclePendingForWave(targetWave, reason, targetPhysicalLaneId = -1) {
          for (let i = 0; i < this.waves.length; i++) {
            var _wave$family14;

            const wave = this.waves[i];
            if (!wave || wave === targetWave) continue;
            const marked = wave.markTargetLifecyclePending(this.frame, targetWave, reason, targetPhysicalLaneId);
            if (!marked || !this.enableBattleTelemetry) continue;
            this.battleTelemetry.recordTargetWaveLifecycleEvent({
              type: 'wave-target-lifecycle-pending',
              frame: this.frame,
              time: this.battleElapsedTime,
              team: wave.team,
              waveId: wave.id,
              laneId: wave.laneId,
              unitName: wave.unitName,
              familyName: (_wave$family14 = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily)[wave.family]) != null ? _wave$family14 : String(wave.family),
              targetWaveId: targetWave.id,
              targetLaneId: targetWave.laneId,
              reason,
              strategicIntervalFrames: wave.getTargetSearchIntervalFrames(),
              strategicPendingFrame: this.frame,
              strategicPendingTargetWaveId: targetWave.id,
              targetWaveCountBefore: wave.getTargetWaveCount()
            });
          }
        }

        notifyWaveCommandMembershipChanged(unit) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return;
          const targetPhysicalLaneId = this.getPhysicalLaneIdForWave(wave);
          wave.invalidateRuntimeState();

          if (wave.getCommandAliveCount() <= 0) {
            this.markTargetLifecyclePendingForWave(wave, 'target-command-members-exhausted-by-isolation', targetPhysicalLaneId);
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
          const runtimeRoot = this.getBattleRuntimeRoot();

          for (const entry of teamAEntries) {
            if (!this.isValidEntry(entry)) continue;
            this.spawner.prewarm(entry.prefab, entry.prewarmCount, runtimeRoot);
          }

          for (const entry of teamBEntries) {
            if (!this.isValidEntry(entry)) continue;
            this.spawner.prewarm(entry.prefab, entry.prewarmCount, runtimeRoot);
          }
        }

        getDatabaseTeamEntries(team) {
          if (!this.unitDatabase) {
            return [];
          }

          return this.unitDatabase.getTeamEntries(team);
        }

        getBattleRuntimeRoot() {
          const root = this.battleRuntimeRoot;

          if (root && root.isValid) {
            return root;
          }

          const nextRoot = new Node('BattleRuntime');
          this.node.addChild(nextRoot);
          this.battleRuntimeRoot = nextRoot;
          return nextRoot;
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
          if (!this.battleRuntimeActive) return null;

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
          }), BattleWave) : BattleWave)(this.nextWaveId++, team, entry.name, entry.family, entry.tier, count, laneId, cost);
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

            this.linkPendingBreakthroughCashoutsToSpawn(team, wave, entry, cost);
          }

          this.node.emit(BattleWaveSpawnedEvent, wave);
          return wave;
        }

        linkPendingBreakthroughCashoutsToSpawn(team, wave, entry, cost) {
          if (!this.enableBattleTelemetry) return;
          const remaining = [];

          for (let i = 0; i < this.pendingBreakthroughSpawnLinks.length; i++) {
            const pending = this.pendingBreakthroughSpawnLinks[i];

            if (pending.team !== team) {
              remaining.push(pending);
              continue;
            }

            this.battleTelemetry.linkBreakthroughCashoutToNextBudgetedSpawn(pending.cashoutId, {
              waveId: wave.id,
              laneId: wave.laneId,
              unitName: entry.name,
              cost,
              frame: this.frame,
              time: this.battleElapsedTime,
              madeAffordableAtCashoutTime: pending.combatPointBeforeReward + 0.0001 < cost && pending.combatPointAfterReward + 0.0001 >= cost
            });
          }

          this.pendingBreakthroughSpawnLinks = remaining;
        }

        assignWaveBanner(wave, entry) {
          const prefab = entry ? entry.waveBannerPrefab : null;
          if (!prefab) return;
          if (!wave) return;
          if (wave.getAliveCount() <= 0) return;
          const node = this.acquireWaveBanner(prefab);
          if (!node) return;
          this.applyWaveBannerAppearance(node, wave.team, entry ? entry.waveBannerIconId : 0);
          this.updateWaveBannerDebugTint(wave);
          wave.setWaveBanner(node, bannerNode => {
            this.recycleWaveBanner(prefab, bannerNode);
          }, bannerNode => {
            this.applyWaveBannerAppearance(bannerNode, wave.team, entry ? entry.waveBannerIconId : 0);
            this.updateWaveBannerDebugTint(wave);
            this.updateWaveBannerHealthBar(wave);
          });
          wave.setWaveBannerVisible(this.waveBannerVisibleByCamera);
          this.updateWaveBannerHealthBar(wave);
        }

        applyWaveBannerAppearance(node, team, iconId) {
          this.waveBannerAggressiveTintCache.delete(node);
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

        updateWaveBannerDebugTint(wave) {
          if (!wave) return;
          const node = wave.getWaveBannerNode();
          if (!node) return;
          const aggressive = wave.isForwardMode() && wave.isAggressiveForwardMode();

          if (this.waveBannerAggressiveTintCache.get(node) === aggressive) {
            return;
          }

          const tint = aggressive ? this.aggressiveWaveBannerTintParams : this.normalWaveBannerTintParams;
          const renderers = this.getWaveBannerRenderers(node);

          for (let i = 0; i < renderers.length; i++) {
            renderers[i].setInstancedAttribute('a_billboard_tint_color', tint);
          }

          this.waveBannerAggressiveTintCache.set(node, aggressive);
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

          if (controller && isValid(controller, true)) {
            const controllerNode = controller.node;

            if (controllerNode && isValid(controllerNode, true)) {
              controllerNode.off(BannerVisibilityBlockedEvent, this.onWaveBannerCameraBlockedChanged, this);
            }
          }

          const topDownCameraDragNode = this.registeredTopDownCameraDragNode;

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

          const unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.family, entry.tier, pos, 0, this.getBattleRuntimeRoot(), entry.maxSpeed, entry.canBePush, entry.canBePassedThroughByForwardAlly, entry.attackRange, entry.attackIntervalMin, entry.attackIntervalMax, entry.health, entry.damage, entry.damageRadius, entry.defense);

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

          const unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.family, entry.tier, pos, 1, this.getBattleRuntimeRoot(), entry.maxSpeed, entry.canBePush, entry.canBePassedThroughByForwardAlly, entry.attackRange, entry.attackIntervalMin, entry.attackIntervalMax, entry.health, entry.damage, entry.damageRadius, entry.defense);

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

        despawnUnitForBreakthroughCashout(unit) {
          if (!unit || unit.isHero) return;
          this.notifyUnitWillDespawn(unit);
          const team = unit.team;
          const units = team === 0 ? this.teamA : this.teamB;
          const index = units.indexOf(unit);
          if (index < 0) return;
          units.splice(index, 1);
          this.aliveCount[team] = Math.max(0, this.aliveCount[team] - 1);
          const entry = this.getTeamEntry(team, unit.unitTypeName);

          if (entry != null && entry.prefab && this.spawner) {
            this.spawner.despawnUnit(unit, entry.prefab);
            return;
          }

          this.removeUnitAgentFromSimulator(unit);
          unit.resetForDespawn();
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
          const team = unit.team; // Capture the tactical state while the hero is still registered,
          // before despawn removes its wave and agent from the battlefield.

          this.recordHeroDefeatTelemetryContext(unit);

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
            const idx = this.sim.agents.indexOf(unit.agent);

            if (idx >= 0) {
              this.sim.agents.splice(idx, 1);
            }
          }
        }

        registerDatabaseHeroes() {
          if (!this.unitDatabase) return;
          this.teamAHeroEntry = this.unitDatabase.getHeroEntry(0);
          this.teamBHeroEntry = this.unitDatabase.getHeroEntry(1);
          this.captureHeroSpawnPosition(this.teamAHeroEntry);
          this.captureHeroSpawnPosition(this.teamBHeroEntry);
          this.captureHeroLine(0, this.teamAHeroEntry);
          this.captureHeroLine(1, this.teamBHeroEntry);
          this.prepareSceneHero(this.teamAHeroEntry);
          this.prepareSceneHero(this.teamBHeroEntry);
        }

        captureHeroSpawnPosition(entry) {
          const node = entry == null ? void 0 : entry.heroNode;
          if (!node || this.heroSpawnPositions.has(node)) return;
          this.heroSpawnPositions.set(node, node.worldPosition.clone());
        }

        restoreHeroSpawnPosition(entry) {
          const node = entry.heroNode;
          const position = node ? this.heroSpawnPositions.get(node) : null;

          if (node && position) {
            node.setWorldPosition(position);
          }
        }

        captureHeroLine(team, heroEntry) {
          if (team !== 0 && team !== 1) return;
          if (Number.isFinite(this.heroLineZ[team])) return;
          if (!heroEntry || !heroEntry.heroNode) return;
          const lineZ = heroEntry.heroNode.worldPosition.z;

          if (Number.isFinite(lineZ)) {
            this.heroLineZ[team] = lineZ;
          }
        }

        prepareSceneHero(heroEntry) {
          if (!heroEntry || !heroEntry.heroNode) return;
          heroEntry.heroNode.active = false;
        }

        activateHeroForTeam(team, laneId, supportUnitsPerLane) {
          const existing = team === 0 ? this.teamAHero : this.teamBHero;

          if (this.isAliveUnit(existing)) {
            return existing;
          }

          const entry = team === 0 ? this.teamAHeroEntry : this.teamBHeroEntry;
          return this.registerSceneHero(entry, team, team === 0 ? 'hero_a' : 'hero_b', laneId, supportUnitsPerLane);
        }

        registerSceneHero(heroEntry, team, fallbackTypeName, laneId, supportUnitsPerLane) {
          if (!heroEntry) return null;
          if (!heroEntry.heroNode) return null;
          this.restoreHeroSpawnPosition(heroEntry);
          heroEntry.heroNode.active = true;
          const hero = heroEntry.heroNode.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
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
          const currentPosition = hero.node.worldPosition;
          this.tempSpawnPos.set(this.getLaneCenterX(laneId), currentPosition.y, currentPosition.z);
          hero.node.setWorldPosition(this.tempSpawnPos);
          hero.moveSpeed = heroEntry.maxSpeed;
          hero.canBePassedThroughByForwardAlly = false;
          hero.heroGuardDistance = heroEntry.guardDistance;
          hero.isSteady = false;
          hero.init(this.sim, team, unitTypeName, forwardX, forwardZ);
          this.registerHeroWave(hero, team, unitTypeName, heroEntry.family, heroEntry.tier, laneId);

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

            const heroWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

            if (heroWave) {
              this.battleTelemetry.recordSpawn(hero, team, unitTypeName, heroEntry.family, heroEntry.tier, heroWave.id, this.frame, this.battleElapsedTime);
            }

            this.battleTelemetry.recordWaveSpawnEvent({
              type: 'hero-activated',
              frame: this.frame,
              time: this.battleElapsedTime,
              team,
              waveId: heroWave ? heroWave.id : -1,
              laneId,
              unitName: unitTypeName,
              familyName: (_heroEntry$family = (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily)[heroEntry.family]) != null ? _heroEntry$family : String(heroEntry.family),
              aggressiveForward: false,
              reason: 'cannot-afford-any-melee-wave',
              combatPoint: this.combatPoint[team] || 0,
              heroSupportUnitsPerLane: supportUnitsPerLane.slice(),
              heroSelectedLaneSupportUnits: supportUnitsPerLane[laneId] || 0,
              heroBestLaneSupportUnits: Math.max(...supportUnitsPerLane, 0),
              heroLaneSelectionMatchesBest: (supportUnitsPerLane[laneId] || 0) >= Math.max(...supportUnitsPerLane, 0)
            });
          }

          this.requestSpatialGridRebuild();
          this.requestBattleStatsUIRefresh();
          return hero;
        }

        registerHeroWave(hero, team, unitTypeName, family, tier, laneId) {
          const previousWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

          if (previousWave) {
            this.removeBattleWaveReference(previousWave);
            previousWave.releaseReferences();
          }

          const wave = new (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave)(this.nextWaveId++, team, unitTypeName, family, tier, 1, laneId);
          wave.addUnit(hero);
          wave.enablePersistentFreeHunt();

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

        getHeroSupportLaneSelection(team) {
          const fallbackLaneId = this.getHeroLaneId();
          const laneCount = this.getSafeLaneCount();
          const unitsPerLane = new Array(laneCount).fill(0);

          if (team !== 0 && team !== 1) {
            return {
              laneId: fallbackLaneId,
              unitsPerLane
            };
          }

          const units = this.getAliveUnits(team);

          for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (!this.isAliveUnit(unit) || unit.isHero) continue;
            const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
              error: Error()
            }), BattleWave) : BattleWave).getWaveForUnit(unit);
            const laneId = wave ? this.clampLaneId(wave.laneId) : this.getNearestLaneIdForX(unit.node.worldPosition.x);

            if (laneId >= 0 && laneId < laneCount) {
              unitsPerLane[laneId]++;
            }
          }

          let selectedLaneId = fallbackLaneId;
          let mostUnits = unitsPerLane[fallbackLaneId] || 0;

          for (let laneId = 0; laneId < laneCount; laneId++) {
            if (unitsPerLane[laneId] > mostUnits) {
              selectedLaneId = laneId;
              mostUnits = unitsPerLane[laneId];
            }
          }

          return {
            laneId: selectedLaneId,
            unitsPerLane
          };
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

        clamp01(value) {
          return Math.max(0, Math.min(1, value));
        }

      }, _class3.instance = null, _class3.originalDirectorTick = null, _class3.directorTimeScaleOwner = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "unitDatabase", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "battleCardDatabase", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "enableBattleCardEffects", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "cinematicController", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "useWorkerRVO", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "targetFrameRate", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 60;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "battleTimeScale", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "resetBattleTimeScaleOnDestroy", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "showCocosProfilerStats", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "allowProfilerStatsQueryParam", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "enableBattleWinnerCheck", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "enableNoAffordableSpawnWinnerFallback", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "battleWinnerCheckIntervalFrames", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "enableBattleTelemetry", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "downloadBattleTelemetryOnEnd", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "reloadPageAfterBattleTelemetryExport", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryReloadDelaySeconds", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "logBattleTelemetryOnEnd", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryFilePrefix", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'battle-telemetry';
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetrySnapshotIntervalFrames", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryMaxSnapshots", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 240;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryMaxDiagnosticEvents", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3000;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "battleTelemetryMaxScannerTraces", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6000;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "battleMinX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -28;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 28;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "battleMinZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -18;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 18;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "rvoUpdateFrameOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "maxRvoStepDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "visualSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 16;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridCellSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateFrameOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class2.prototype, "useWorkerSpatialTargetQuery", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class2.prototype, "teamAAliveLabel", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class2.prototype, "teamADeathLabel", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class2.prototype, "teamBAliveLabel", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class2.prototype, "teamBDeathLabel", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class2.prototype, "teamAKillLabel", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class2.prototype, "teamBKillLabel", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class2.prototype, "teamACounterKillLabel", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class2.prototype, "teamBCounterKillLabel", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class2.prototype, "teamACombatPointLabel", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor45 = _applyDecoratedDescriptor(_class2.prototype, "teamBCombatPointLabel", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor46 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor47 = _applyDecoratedDescriptor(_class2.prototype, "spawnImmediatelyOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor48 = _applyDecoratedDescriptor(_class2.prototype, "prewarmOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor49 = _applyDecoratedDescriptor(_class2.prototype, "spawnWaveInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor50 = _applyDecoratedDescriptor(_class2.prototype, "maxAutoSpawnDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor51 = _applyDecoratedDescriptor(_class2.prototype, "teamASpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -20;
        }
      }), _descriptor52 = _applyDecoratedDescriptor(_class2.prototype, "teamBSpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor53 = _applyDecoratedDescriptor(_class2.prototype, "formationZNoise", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor54 = _applyDecoratedDescriptor(_class2.prototype, "centerGapWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor55 = _applyDecoratedDescriptor(_class2.prototype, "enableLaneSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor56 = _applyDecoratedDescriptor(_class2.prototype, "laneCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor57 = _applyDecoratedDescriptor(_class2.prototype, "defaultSpawnLane", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor58 = _applyDecoratedDescriptor(_class2.prototype, "autoSpawnRandomLane", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor59 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerRefreshIntervalFrames", [_dec34], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 12;
        }
      }), _descriptor60 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerCamera", [_dec35], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor61 = _applyDecoratedDescriptor(_class2.prototype, "enableWaveBannerCameraVisibility", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor62 = _applyDecoratedDescriptor(_class2.prototype, "hideWaveBannerInOrbitMode", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor63 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerHideFovBelow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 35;
        }
      }), _descriptor64 = _applyDecoratedDescriptor(_class2.prototype, "waveBannerShowFovAbove", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 38;
        }
      }), _descriptor65 = _applyDecoratedDescriptor(_class2.prototype, "circleObstacles", [_dec36], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor66 = _applyDecoratedDescriptor(_class2.prototype, "rectObstacles", [_dec37], {
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