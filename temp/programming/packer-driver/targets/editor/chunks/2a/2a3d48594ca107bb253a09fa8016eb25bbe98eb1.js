System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, Label, Unit, UnitProps, RVOSimulator, RVOWorkerSimulator, ObstacleCircle, ObstacleRect, UnitSpawner, UnitBehavior, BattleSpatialGrid, BattleWave, CounterSettings, UnitType, BattleUnitDatabase, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _class3, _crd, ccclass, property, GameManager;

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

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Vec3 = _cc.Vec3;
      Label = _cc.Label;
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
      _export("UnitPrefabEntry", _unresolved_15.UnitPrefabEntry);
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1e335OSdGRGLrD08aYssvKr", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Vec3', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(_crd && BattleUnitDatabase === void 0 ? (_reportPossibleCrUseOfBattleUnitDatabase({
        error: Error()
      }), BattleUnitDatabase) : BattleUnitDatabase), _dec3 = property(Component), _dec4 = property(Label), _dec5 = property(Label), _dec6 = property(Label), _dec7 = property(Label), _dec8 = property(Label), _dec9 = property(Label), _dec10 = property(Label), _dec11 = property(Label), _dec12 = property(Label), _dec13 = property(Label), _dec14 = property({
        type: [_crd && ObstacleCircle === void 0 ? (_reportPossibleCrUseOfObstacleCircle({
          error: Error()
        }), ObstacleCircle) : ObstacleCircle]
      }), _dec15 = property({
        type: [_crd && ObstacleRect === void 0 ? (_reportPossibleCrUseOfObstacleRect({
          error: Error()
        }), ObstacleRect) : ObstacleRect]
      }), _dec(_class = (_class2 = (_class3 = class GameManager extends Component {
        constructor(...args) {
          super(...args);

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

          _initializerDefineProperty(this, "maxUnitPerRow", _descriptor33, this);

          _initializerDefineProperty(this, "spaceBetweenUnit", _descriptor34, this);

          _initializerDefineProperty(this, "spaceBetweenRow", _descriptor35, this);

          _initializerDefineProperty(this, "formationZNoise", _descriptor36, this);

          _initializerDefineProperty(this, "centerGapWidth", _descriptor37, this);

          _initializerDefineProperty(this, "enableLaneSpawn", _descriptor38, this);

          _initializerDefineProperty(this, "laneCount", _descriptor39, this);

          _initializerDefineProperty(this, "defaultSpawnLane", _descriptor40, this);

          _initializerDefineProperty(this, "autoSpawnRandomLane", _descriptor41, this);

          _initializerDefineProperty(this, "squareFormationWidth", _descriptor42, this);

          _initializerDefineProperty(this, "freeHuntNoTargetRecoveryFrames", _descriptor43, this);

          _initializerDefineProperty(this, "heroFreeHuntSearchRange", _descriptor44, this);

          this.spawnWaveTimer = 0;

          _initializerDefineProperty(this, "circleObstacles", _descriptor45, this);

          _initializerDefineProperty(this, "rectObstacles", _descriptor46, this);

          this.sim = null;
          this.teamA = [];
          this.teamB = [];
          this.waves = [];
          this.nextWaveId = 1;
          this.spawner = void 0;
          this.teamAPrefabMap = new Map();
          this.teamBPrefabMap = new Map();
          this.forwardReleasedWaves = new Map();
          this.laneVoteCounts = [];
          this.teamAHeroWave = null;
          this.teamBHeroWave = null;
          this.heroForwardUnlocked = [false, false];
        }

        start() {
          GameManager.instance = this;
          this.teamA.length = 0;
          this.teamB.length = 0;
          this.waves.length = 0;
          this.nextWaveId = 1;
          this.forwardReleasedWaves.clear();
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
          this.refreshBattleStatsUI();
        }

        onDestroy() {
          if (GameManager.instance === this) {
            GameManager.instance = null;
          }

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
          this.forwardReleasedWaves.clear();
          this.teamAHeroWave = null;
          this.teamBHeroWave = null;
          this.heroForwardUnlocked[0] = false;
          this.heroForwardUnlocked[1] = false;
          this.teamA.length = 0;
          this.teamB.length = 0;
          this.teamAPrefabMap.clear();
          this.teamBPrefabMap.clear();
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
            const safeDt = Math.min(deltaTime, Math.max(0.001, this.maxRvoStepDeltaTime));
            this.sim.step(safeDt);
          }

          if (this.shouldRunFrameInterval(this.spatialGridUpdateInterval, this.spatialGridUpdateFrameOffset)) {
            this.rebuildSpatialGrid();
          }

          if (this.enableAutoSpawn) {
            this.updateAutoSpawn(deltaTime);
          }

          this.processWaveCombatRecoveries();
          this.processForwardReleaseRecoveries();
          this.pruneDeadWaves();
          this.processHeroForwardUnlock();
        }

        shouldRunFrameInterval(interval, offset = 0) {
          const safeInterval = Math.max(1, Math.floor(interval));
          const phase = (Math.floor(offset) % safeInterval + safeInterval) % safeInterval;
          return (this.frame + phase) % safeInterval === 0;
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

          if (!killer.isHero) {
            this.addCombatPointFromVictim(killerTeam, victim, isCounterKill);
          }

          this.refreshBattleStatsUI();
        }

        onWaveCombatStarted(unit, enemy = null) {
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return;
          if (wave.isDead()) return;
          wave.enterCombatMode();
          this.forwardReleasedWaves.delete(wave);
          const enemyWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(enemy);

          if (!enemyWave || enemyWave === wave || enemyWave.isDead()) {
            return;
          }

          enemyWave.enterCombatMode();
          this.forwardReleasedWaves.delete(enemyWave);
        }

        onWaveForwardPassedAdjacentTarget(unit, target) {
          if (!unit || !target) return false;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return false;
          if (wave.isDead()) return false;

          if (!this.areSameOrAdjacentLanes(wave.laneId, target.laneId)) {
            return false;
          }

          wave.releaseForwardToFreeHunt();
          this.forwardReleasedWaves.set(wave, this.frame);
          const targetWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(target);

          if (targetWave && targetWave !== wave && !targetWave.isDead() && this.areSameOrAdjacentLanes(wave.laneId, targetWave.laneId) && this.waves.indexOf(targetWave) >= 0) {
            targetWave.releaseForwardToFreeHunt();
            this.forwardReleasedWaves.set(targetWave, this.frame);
          }

          return true;
        }

        canUnitRunWaveForwardScan(unit) {
          if (!unit) return true;
          const wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return true;
          return wave.canUnitRunForwardScan(unit, this.frame);
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

          for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];
            if (!this.isAliveUnit(unit)) continue;
            const laneId = this.getNearestLaneIdForX(unit.agent.pos.x);
            counts[laneId]++;
            counted++;
          }

          if (counted <= 0) return -1;
          const currentLane = wave.laneId >= 0 ? this.clampLaneId(wave.laneId) : -1;
          let bestLane = currentLane >= 0 ? currentLane : 0;
          let bestCount = counts[bestLane];

          for (let i = 0; i < laneCount; i++) {
            if (counts[i] > bestCount) {
              bestCount = counts[i];
              bestLane = i;
            }
          }

          return bestLane;
        }

        regroupWaveByMajorityLane(wave) {
          if (!wave) return false;
          const laneId = this.getMajorityLaneIdForWave(wave);

          if (laneId < 0) {
            wave.resumeForward();
            return false;
          }

          wave.setLaneId(laneId, this.squareFormationWidth, this.spaceBetweenUnit);
          wave.resumeForward();
          return true;
        }

        areSameOrAdjacentLanes(laneA, laneB) {
          if (laneA < 0) return false;
          if (laneB < 0) return false;
          return Math.abs(laneA - laneB) <= 1;
        }

        processWaveCombatRecoveries() {
          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            this.recoverWaveCombat(wave);
          }

          this.recoverHeroWaveCombat(this.teamAHeroWave, this.teamAHero);
          this.recoverHeroWaveCombat(this.teamBHeroWave, this.teamBHero);
        }

        recoverHeroWaveCombat(wave, hero) {
          if (!hero || hero.isSteady) {
            return;
          }

          if (this.heroForwardUnlocked[hero.team]) {
            if (wave) {
              wave.clearLaneControl();
            }

            if (!hero.onBusy && (hero.onForward || hero.returningToWaveLaneSlot || hero.laneId >= 0)) {
              hero.enterFreeHuntMode(this.heroFreeHuntSearchRange);
            }

            return;
          }

          this.recoverWaveCombat(wave);
        }

        recoverWaveCombat(wave) {
          if (!wave) return;
          if (wave.isDeadRuntime(this.frame)) return;
          if (!wave.combatModeActive) return;

          if (this.shouldForceTeamFreeHunt(wave.team)) {
            this.forceWaveToHeroPressureFreeHunt(wave);
            return;
          }

          if (wave.hasEngagedRuntime(this.frame)) {
            return;
          }

          if (!wave.shouldRecoverNoTarget(this.frame, this.freeHuntNoTargetRecoveryFrames)) {
            return;
          }

          this.regroupWaveByMajorityLane(wave);
        }

        processForwardReleaseRecoveries() {
          if (this.forwardReleasedWaves.size <= 0) {
            return;
          }

          for (const wave of this.forwardReleasedWaves.keys()) {
            if (!wave || wave.isDeadRuntime(this.frame)) {
              this.forwardReleasedWaves.delete(wave);
              continue;
            }

            if (this.shouldForceTeamFreeHunt(wave.team)) {
              this.forceWaveToHeroPressureFreeHunt(wave);
              continue;
            }

            if (wave.combatModeActive) {
              this.forwardReleasedWaves.delete(wave);
              continue;
            }

            if (wave.hasEngagedRuntime(this.frame)) {
              continue;
            }

            if (!wave.shouldRecoverNoTarget(this.frame, this.freeHuntNoTargetRecoveryFrames)) {
              continue;
            }

            this.regroupWaveByMajorityLane(wave);
            this.forwardReleasedWaves.delete(wave);
          }
        }

        pruneDeadWaves() {
          for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];
            if (!wave || !wave.isDeadRuntime(this.frame)) continue;
            this.forwardReleasedWaves.delete(wave);
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

          if (!hero.isSteady) {
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
          const laneId = this.getHeroLaneId();
          let heroWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

          if (!heroWave || heroWave.isDead()) {
            this.registerHeroWave(hero, team, hero.unitTypeName, hero.props ? hero.props.unitType : (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
              error: Error()
            }), UnitType) : UnitType).LightSword);
            heroWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;
          }

          if (heroWave) {
            heroWave.clearLaneControl();
            heroWave.setLaneId(laneId, this.squareFormationWidth, this.spaceBetweenUnit);
            this.forwardReleasedWaves.delete(heroWave);
          }

          this.heroForwardUnlocked[team] = true;
          hero.setSteady(false, false);
          hero.enterFreeHuntMode(this.heroFreeHuntSearchRange);
          this.releaseEnemyNormalWavesToFreeHunt(team);
        }

        releaseEnemyNormalWavesToFreeHunt(heroTeam) {
          const enemyTeam = heroTeam === 0 ? 1 : 0;

          for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];
            if (!wave) continue;
            if (wave.team !== enemyTeam) continue;
            if (wave.isDead()) continue;
            this.forceWaveToHeroPressureFreeHunt(wave);
          }
        }

        forceWaveToHeroPressureFreeHunt(wave) {
          this.forwardReleasedWaves.delete(wave);
          wave.clearLaneControl();
          wave.releaseForwardToFreeHunt(this.heroFreeHuntSearchRange);
        }

        shouldForceTeamFreeHunt(team) {
          if (team !== 0 && team !== 1) {
            return false;
          }

          const enemyTeam = team === 0 ? 1 : 0;
          return this.heroForwardUnlocked[enemyTeam];
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
            if (!this.isValidEntry(entry)) continue;

            if (Math.floor(entry.unitCount) <= 0) {
              continue;
            }

            if (this.canAffordEntry(team, entry)) {
              return true;
            }
          }

          return false;
        }

        findNearestEnemyInCurrentLane(wave) {
          if (!wave) return null;
          if (wave.laneId < 0) return null;
          const enemies = wave.team === 0 ? this.teamB : this.teamA;
          const x = wave.getAverageX();
          const z = wave.getAverageZ();
          let best = null;
          let bestDistSq = Infinity;

          for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (!this.isAliveUnit(enemy)) continue;
            if (enemy.laneId !== wave.laneId) continue;
            const dx = enemy.agent.pos.x - x;
            const dz = enemy.agent.pos.z - z;
            const d = dx * dx + dz * dz;

            if (d < bestDistSq) {
              bestDistSq = d;
              best = enemy;
            }
          }

          return best;
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
          const bountyValue = this.getVictimBountyValue(victim);
          if (bountyValue <= 0) return;
          const reward = this.unitDatabase.calculateKillRewardFromBounty(bountyValue, isCounterKill);
          this.addCombatPoint(killerTeam, reward);
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
          const anyController = this.cinematicController;

          if (anyController && typeof anyController.onUnitWillDespawn === 'function') {
            anyController.onUnitWillDespawn(unit);
          }
        }

        rebuildSpatialGrid() {
          this.spatialGrid.cellSize = this.spatialGridCellSize;
          this.spatialGrid.useWorkerTargetQuery = this.useWorkerSpatialTargetQuery;
          this.spatialGrid.build(this.teamA, this.teamB);
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
          if (!entry) return false;
          if (!entry.name) return false;
          if (!entry.prefab) return false;
          return true;
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
            if (!this.isValidEntry(entry)) continue;

            if (Math.floor(entry.unitCount) <= 0) {
              continue;
            }

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

          this.rebuildSpatialGrid();
        }

        spawnWaveByEntry(team, entry, laneId = -1) {
          if (!entry || !entry.prefab) {
            return null;
          }

          const baseZ = team === 0 ? this.teamASpawnZ : this.teamBSpawnZ;
          const wave = this.spawnEntryFormation(team, entry, baseZ, true, laneId);
          this.rebuildSpatialGrid();
          return wave;
        }

        spawnWaveByName(team, unitName, laneId = -1) {
          const entry = this.getTeamEntry(team, unitName);
          if (!entry) return null;
          return this.spawnWaveByEntry(team, entry, laneId);
        }

        spawnEntryFormation(team, entry, baseZ, spendCost, requestedLaneId = -1) {
          const count = Math.max(0, Math.floor(entry.unitCount));

          if (count <= 0) {
            return null;
          }

          const cost = Math.max(0, entry.combatPointCost);

          if (spendCost && this.isCombatPointEnabled() && !this.spendCombatPoint(team, cost)) {
            this.refreshBattleStatsUI();
            return null;
          }

          const laneId = this.resolveSpawnLaneId(requestedLaneId);
          const wave = new (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave)(this.nextWaveId++, team, entry.name, entry.unitType, count, laneId);
          this.waves.push(wave);

          if (this.enableLaneSpawn) {
            this.spawnSquareFormationInLane(team, entry, baseZ, wave, laneId, count);
          } else {
            this.spawnCenteredRowsFormation(team, entry, baseZ, wave, count);
          }

          if (this.shouldForceTeamFreeHunt(team)) {
            this.forceWaveToHeroPressureFreeHunt(wave);
          }

          return wave;
        }

        spawnSquareFormationInLane(team, entry, baseZ, wave, laneId, count) {
          const width = Math.max(1, Math.floor(this.squareFormationWidth));
          const laneCenterX = this.getLaneCenterX(laneId);

          for (let i = 0; i < count; i++) {
            const row = Math.floor(i / width);
            const col = i % width;
            const rowCount = Math.min(width, count - row * width);
            const x = laneCenterX + (col - (rowCount - 1) * 0.5) * this.spaceBetweenUnit;
            const rowZOffset = row * this.spaceBetweenRow;
            const baseUnitZ = team === 0 ? baseZ - rowZOffset : baseZ + rowZOffset;
            const z = baseUnitZ + this.randomRange(-this.formationZNoise, this.formationZNoise);
            this.spawnUnitForWave(team, entry, new Vec3(x, 0, z), wave, laneId);
          }
        }

        spawnCenteredRowsFormation(team, entry, baseZ, wave, count) {
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
              this.spawnUnitForWave(team, entry, new Vec3(x, 0, z), wave, wave.laneId);
              spawned++;
            }

            row++;
          }
        }

        spawnUnitForWave(team, entry, pos, wave, laneId) {
          let unit = null;

          if (team === 0) {
            unit = this.spawnTeamA(entry.name, pos);
          } else {
            unit = this.spawnTeamB(entry.name, pos);
          }

          if (!unit) return;
          unit.laneId = laneId;
          unit.forwardLaneOffsetX = pos.x - this.getLaneCenterX(laneId);
          wave.addUnit(unit);
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

          this.refreshBattleStatsUI();
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

              this.spawner.despawnUnit(unit, entry.prefab);
              this.rebuildSpatialGrid();
              this.refreshBattleStatsUI();
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
          this.rebuildSpatialGrid();
          this.refreshBattleStatsUI();
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
            props.unitType = heroEntry.unitType;
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
          const laneId = this.getHeroLaneId();
          const previousWave = team === 0 ? this.teamAHeroWave : this.teamBHeroWave;

          if (previousWave) {
            previousWave.releaseReferences();
          }

          hero.laneId = laneId;
          hero.forwardLaneOffsetX = hero.agent ? hero.agent.pos.x - this.getLaneCenterX(laneId) : 0;
          const wave = new (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
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

        getHeroLaneId() {
          return this.clampLaneId(Math.floor(this.getSafeLaneCount() / 2));
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

          if (this.teamACombatPointLabel) {
            this.teamACombatPointLabel.string = 'A CP: ' + Math.floor(this.combatPoint[0]);
          }

          if (this.teamBCombatPointLabel) {
            this.teamBCombatPointLabel.string = 'B CP: ' + Math.floor(this.combatPoint[1]);
          }
        }

        randomRange(min, max) {
          return Math.random() * (max - min) + min;
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "unitDatabase", [_dec2], {
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
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "battleMinX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -28;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxX", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 28;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "battleMinZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -18;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "battleMaxZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 18;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "rvoUpdateFrameOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "maxRvoStepDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.05;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "visualSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 16;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridCellSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateFrameOffset", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "useWorkerSpatialTargetQuery", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "teamAAliveLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "teamADeathLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "teamBAliveLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "teamBDeathLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "teamAKillLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "teamBKillLabel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "teamACounterKillLabel", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "teamBCounterKillLabel", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "teamACombatPointLabel", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "teamBCombatPointLabel", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "spawnImmediatelyOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "prewarmOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "spawnWaveInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "maxAutoSpawnDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "teamASpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -20;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "teamBSpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 20;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class2.prototype, "maxUnitPerRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class2.prototype, "spaceBetweenUnit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class2.prototype, "spaceBetweenRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class2.prototype, "formationZNoise", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class2.prototype, "centerGapWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class2.prototype, "enableLaneSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class2.prototype, "laneCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class2.prototype, "defaultSpawnLane", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class2.prototype, "autoSpawnRandomLane", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class2.prototype, "squareFormationWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class2.prototype, "freeHuntNoTargetRecoveryFrames", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 8;
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class2.prototype, "heroFreeHuntSearchRange", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 80;
        }
      }), _descriptor45 = _applyDecoratedDescriptor(_class2.prototype, "circleObstacles", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor46 = _applyDecoratedDescriptor(_class2.prototype, "rectObstacles", [_dec15], {
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