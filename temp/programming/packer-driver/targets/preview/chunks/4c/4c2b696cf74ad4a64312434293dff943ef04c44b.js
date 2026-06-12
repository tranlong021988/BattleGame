System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13", "__unresolved_14"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, Label, Unit, UnitProps, EnemyFinder, RVOSimulator, RVOWorkerSimulator, ObstacleCircle, ObstacleRect, UnitSpawner, UnitBehavior, BattleSpatialGrid, BattleWave, CounterSettings, BattleUnitDatabase, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _class3, _crd, ccclass, property, GameManager;

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

  function _reportPossibleCrUseOfBattleWave(extras) {
    _reporterNs.report("BattleWave", "./BattleWave", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCounterSettings(extras) {
    _reporterNs.report("CounterSettings", "./CounterSettings", _context.meta, extras);
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
      BattleWave = _unresolved_12.BattleWave;
    }, function (_unresolved_13) {
      CounterSettings = _unresolved_13.CounterSettings;
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

          _initializerDefineProperty(this, "maxRvoStepDeltaTime", _descriptor9, this);

          this.frame = 0;

          _initializerDefineProperty(this, "visualSmooth", _descriptor10, this);

          _initializerDefineProperty(this, "spatialGridCellSize", _descriptor11, this);

          _initializerDefineProperty(this, "spatialGridUpdateInterval", _descriptor12, this);

          this.spatialGrid = new (_crd && BattleSpatialGrid === void 0 ? (_reportPossibleCrUseOfBattleSpatialGrid({
            error: Error()
          }), BattleSpatialGrid) : BattleSpatialGrid)();

          _initializerDefineProperty(this, "teamAAliveLabel", _descriptor13, this);

          _initializerDefineProperty(this, "teamADeathLabel", _descriptor14, this);

          _initializerDefineProperty(this, "teamBAliveLabel", _descriptor15, this);

          _initializerDefineProperty(this, "teamBDeathLabel", _descriptor16, this);

          _initializerDefineProperty(this, "teamAKillLabel", _descriptor17, this);

          _initializerDefineProperty(this, "teamBKillLabel", _descriptor18, this);

          _initializerDefineProperty(this, "teamACounterKillLabel", _descriptor19, this);

          _initializerDefineProperty(this, "teamBCounterKillLabel", _descriptor20, this);

          _initializerDefineProperty(this, "teamACombatPointLabel", _descriptor21, this);

          _initializerDefineProperty(this, "teamBCombatPointLabel", _descriptor22, this);

          this.aliveCount = [0, 0];
          this.deathCount = [0, 0];
          this.killCount = [0, 0];
          this.counterKillCount = [0, 0];
          this.combatPoint = [0, 0];
          this.initialCombatPoint = [0, 0];

          _initializerDefineProperty(this, "enableAutoSpawn", _descriptor23, this);

          _initializerDefineProperty(this, "spawnImmediatelyOnStart", _descriptor24, this);

          _initializerDefineProperty(this, "prewarmOnStart", _descriptor25, this);

          _initializerDefineProperty(this, "spawnWaveInterval", _descriptor26, this);

          _initializerDefineProperty(this, "maxAutoSpawnDeltaTime", _descriptor27, this);

          _initializerDefineProperty(this, "teamASpawnZ", _descriptor28, this);

          _initializerDefineProperty(this, "teamBSpawnZ", _descriptor29, this);

          _initializerDefineProperty(this, "maxUnitPerRow", _descriptor30, this);

          _initializerDefineProperty(this, "spaceBetweenUnit", _descriptor31, this);

          _initializerDefineProperty(this, "spaceBetweenRow", _descriptor32, this);

          _initializerDefineProperty(this, "formationZNoise", _descriptor33, this);

          _initializerDefineProperty(this, "centerGapWidth", _descriptor34, this);

          _initializerDefineProperty(this, "enableLaneSpawn", _descriptor35, this);

          _initializerDefineProperty(this, "laneCount", _descriptor36, this);

          _initializerDefineProperty(this, "defaultSpawnLane", _descriptor37, this);

          _initializerDefineProperty(this, "autoSpawnRandomLane", _descriptor38, this);

          _initializerDefineProperty(this, "squareFormationWidth", _descriptor39, this);

          this.spawnWaveTimer = 0;

          _initializerDefineProperty(this, "circleObstacles", _descriptor40, this);

          _initializerDefineProperty(this, "rectObstacles", _descriptor41, this);

          this.sim = null;
          this.teamA = [];
          this.teamB = [];
          this.waves = [];
          this.nextWaveId = 1;
          this.spawner = void 0;
          this.teamAPrefabMap = new Map();
          this.teamBPrefabMap = new Map();
          this.pendingLaneWaves = new Set();
        }

        start() {
          GameManager.instance = this;
          this.teamA.length = 0;
          this.teamB.length = 0;
          this.waves.length = 0;
          this.nextWaveId = 1;
          this.pendingLaneWaves.clear();
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
          this.refreshBattleStatsUI();
        }

        onDestroy() {
          if (GameManager.instance === this) {
            GameManager.instance = null;
          }

          if (this.sim && this.sim.destroy) {
            this.sim.destroy();
          }

          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];

            if (wave) {
              wave.releaseReferences();
            }
          }

          this.waves.length = 0;
          this.pendingLaneWaves.clear();
          this.teamA.length = 0;
          this.teamB.length = 0;
          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamA = [];
          (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder).teamB = [];
          this.teamAPrefabMap.clear();
          this.teamBPrefabMap.clear();
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

          if (this.frame % this.updateInterval === 0) {
            var safeDt = Math.min(deltaTime, Math.max(0.001, this.maxRvoStepDeltaTime));
            this.sim.step(safeDt);
          }

          if (this.frame % this.spatialGridUpdateInterval === 0) {
            this.rebuildSpatialGrid();
          }

          if (this.enableAutoSpawn) {
            this.updateAutoSpawn(deltaTime);
          }

          this.processPendingWaveLaneTransfers();
          this.pruneDeadWaves();
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

          if (counter) {
            var damageMul = counter.getDamageMultiplier(killer.props.unitType, victim.props.unitType);
            var receivedMul = counter.getReceivedDamageMultiplier(killer.props.unitType, victim.props.unitType);
            isCounterKill = damageMul > 1.0001 || receivedMul < 0.9999;
          }

          if (isCounterKill) {
            this.counterKillCount[killerTeam]++;
          }

          this.addCombatPointFromVictim(killerTeam, victim, isCounterKill);
          this.refreshBattleStatsUI();
        }

        onUnitKilled(killer, victim) {
          if (!killer || !victim) return;
          var killerWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(killer);
          var victimWave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(victim);
          if (!killerWave || !victimWave) return;
          if (killerWave === victimWave) return;
          if (!victimWave.isDead()) return;
          this.releaseAssistingWavesAfterWaveDefeated(killerWave, victimWave);
          killerWave.noteDefeatedEnemyWave(victimWave);
          this.pendingLaneWaves.add(killerWave);
          this.processPendingWaveLaneTransfers();
        }

        onWaveCombatStarted(unit) {
          var wave = (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(unit);
          if (!wave) return;
          if (wave.isDead()) return;
          wave.enterCombatMode();
        }

        releaseAssistingWavesAfterWaveDefeated(killerWave, victimWave) {
          for (var i = 0; i < this.waves.length; i++) {
            var wave = this.waves[i];
            if (!wave) continue;
            if (wave === killerWave) continue;
            if (wave === victimWave) continue;
            if (wave.team !== killerWave.team) continue;
            if (wave.isDead()) continue;
            if (!wave.isTargetingWave(victimWave)) continue;
            if (wave.isEngagedWithOtherWave(victimWave)) continue;
            if (wave.laneId < 0) continue;
            wave.noteDefeatedEnemyWave(victimWave);
            this.pendingLaneWaves.add(wave);
          }
        }

        processPendingWaveLaneTransfers() {
          if (this.pendingLaneWaves.size <= 0) {
            return;
          }

          var shouldRebuildSpatialGrid = false;
          var waves = Array.from(this.pendingLaneWaves);

          for (var i = 0; i < waves.length; i++) {
            var wave = waves[i];

            if (!wave || wave.isDead()) {
              this.pendingLaneWaves.delete(wave);
              continue;
            }

            if (!wave.hasPendingLaneTransfer()) {
              this.pendingLaneWaves.delete(wave);
              continue;
            }

            if (!wave.hasEngaged()) {
              var sameLaneEnemy = this.findNearestEnemyInCurrentLane(wave);

              if (sameLaneEnemy) {
                wave.setPendingLaneId(sameLaneEnemy.laneId);
              }
            }

            if (wave.tryApplyPendingLaneTransfer(this.squareFormationWidth, this.spaceBetweenUnit)) {
              this.pendingLaneWaves.delete(wave);
              shouldRebuildSpatialGrid = true;
            }
          }

          if (shouldRebuildSpatialGrid) {
            this.rebuildSpatialGrid();
          }
        }

        pruneDeadWaves() {
          for (var i = this.waves.length - 1; i >= 0; i--) {
            var wave = this.waves[i];
            if (!wave || !wave.isDead()) continue;
            this.pendingLaneWaves.delete(wave);
            wave.releaseReferences();
            this.waves.splice(i, 1);
          }
        }

        findNearestEnemyInCurrentLane(wave) {
          if (!wave) return null;
          if (wave.laneId < 0) return null;
          var enemies = wave.team === 0 ? this.teamB : this.teamA;
          var x = wave.getAverageX();
          var z = wave.getAverageZ();
          var best = null;
          var bestDistSq = Infinity;

          for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            if (!this.isAliveUnit(enemy)) continue;
            if (enemy.laneId !== wave.laneId) continue;
            var dx = enemy.agent.pos.x - x;
            var dz = enemy.agent.pos.z - z;
            var d = dx * dx + dz * dz;

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
          var anyController = this.cinematicController;

          if (anyController && typeof anyController.onUnitWillDespawn === 'function') {
            anyController.onUnitWillDespawn(unit);
          }
        }

        rebuildSpatialGrid() {
          this.spatialGrid.cellSize = this.spatialGridCellSize;
          this.spatialGrid.build(this.teamA, this.teamB);
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
          if (!entry) return false;
          if (!entry.name) return false;
          if (!entry.prefab) return false;
          return true;
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
            console.warn('[GameManager] Missing unit entry:', unitName);
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

          var index = Math.floor(Math.random() * validEntries.length);
          return validEntries[index];
        }

        getTeamEntries(team) {
          return this.getDatabaseTeamEntries(team);
        }

        getAliveUnits(team) {
          return team === 0 ? this.teamA : this.teamB;
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

          this.rebuildSpatialGrid();
        }

        spawnWaveByEntry(team, entry, laneId) {
          if (laneId === void 0) {
            laneId = -1;
          }

          if (!entry || !entry.prefab) {
            return null;
          }

          var baseZ = team === 0 ? this.teamASpawnZ : this.teamBSpawnZ;
          var wave = this.spawnEntryFormation(team, entry, baseZ, true, laneId);
          this.rebuildSpatialGrid();
          return wave;
        }

        spawnWaveByName(team, unitName, laneId) {
          if (laneId === void 0) {
            laneId = -1;
          }

          var entry = this.getTeamEntry(team, unitName);
          if (!entry) return null;
          return this.spawnWaveByEntry(team, entry, laneId);
        }

        spawnEntryFormation(team, entry, baseZ, spendCost, requestedLaneId) {
          if (requestedLaneId === void 0) {
            requestedLaneId = -1;
          }

          var count = Math.max(0, Math.floor(entry.unitCount));

          if (count <= 0) {
            return null;
          }

          var cost = Math.max(0, entry.combatPointCost);

          if (spendCost && this.isCombatPointEnabled() && !this.spendCombatPoint(team, cost)) {
            this.refreshBattleStatsUI();
            return null;
          }

          var laneId = this.resolveSpawnLaneId(requestedLaneId);
          var wave = new (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave)(this.nextWaveId++, team, entry.name, entry.unitType, count, laneId);
          this.waves.push(wave);

          if (this.enableLaneSpawn) {
            this.spawnSquareFormationInLane(team, entry, baseZ, wave, laneId, count);
          } else {
            this.spawnCenteredRowsFormation(team, entry, baseZ, wave, count);
          }

          return wave;
        }

        spawnSquareFormationInLane(team, entry, baseZ, wave, laneId, count) {
          var width = Math.max(1, Math.floor(this.squareFormationWidth));
          var laneCenterX = this.getLaneCenterX(laneId);

          for (var i = 0; i < count; i++) {
            var row = Math.floor(i / width);
            var col = i % width;
            var rowCount = Math.min(width, count - row * width);
            var x = laneCenterX + (col - (rowCount - 1) * 0.5) * this.spaceBetweenUnit;
            var rowZOffset = row * this.spaceBetweenRow;
            var baseUnitZ = team === 0 ? baseZ - rowZOffset : baseZ + rowZOffset;
            var z = baseUnitZ + this.randomRange(-this.formationZNoise, this.formationZNoise);
            this.spawnUnitForWave(team, entry, new Vec3(x, 0, z), wave, laneId);
          }
        }

        spawnCenteredRowsFormation(team, entry, baseZ, wave, count) {
          var maxPerRow = Math.max(1, Math.floor(this.maxUnitPerRow));
          var spawned = 0;
          var row = 0;

          while (spawned < count) {
            var remaining = count - spawned;
            var rowCount = Math.min(maxPerRow, remaining);
            var rowXPositions = this.buildCenteredRowXPositions(rowCount, row);

            for (var col = 0; col < rowCount; col++) {
              var x = rowXPositions[col];
              var rowZOffset = row * this.spaceBetweenRow;
              var baseUnitZ = team === 0 ? baseZ - rowZOffset : baseZ + rowZOffset;
              var z = baseUnitZ + this.randomRange(-this.formationZNoise, this.formationZNoise);
              this.spawnUnitForWave(team, entry, new Vec3(x, 0, z), wave, wave.laneId);
              spawned++;
            }

            row++;
          }
        }

        spawnUnitForWave(team, entry, pos, wave, laneId) {
          var unit = null;

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

        buildCenteredRowXPositions(rowCount, rowIndex) {
          var result = [];

          if (rowCount <= 0) {
            return result;
          }

          var gap = Math.max(0, this.centerGapWidth);

          if (gap <= 0) {
            for (var col = 0; col < rowCount; col++) {
              var x = (col - (rowCount - 1) * 0.5) * this.spaceBetweenUnit;
              result.push(x);
            }

            return result;
          }

          var gapHalf = gap * 0.5;
          var pairIndex = 0;
          var startRightSide = rowIndex % 2 === 1;

          while (result.length < rowCount) {
            var leftX = -gapHalf - pairIndex * this.spaceBetweenUnit;
            var rightX = gapHalf + pairIndex * this.spaceBetweenUnit;

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

          var unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.unitType, pos, 0, this.node, entry.maxSpeed, entry.health, entry.damage, entry.defense);

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

          if (!entry || !entry.prefab) {
            return null;
          }

          var unit = this.spawner.spawnUnit(entry.prefab, entry.name, entry.unitType, pos, 1, this.node, entry.maxSpeed, entry.health, entry.damage, entry.defense);

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
              this.rebuildSpatialGrid();
              this.refreshBattleStatsUI();
            }

            return;
          }
        }

        handleHeroDeath(unit) {
          var team = unit.team;

          if (team === 0) {
            var idx = this.teamA.indexOf(unit);

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
            var _idx2 = this.teamB.indexOf(unit);

            if (_idx2 >= 0) {
              this.teamB.splice(_idx2, 1);
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
            console.warn('[GameManager] Hero node missing Unit component:', heroEntry.heroNode.name);
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

          var finder = hero.getComponent(_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder);

          if (finder) {
            finder.resetForSpawn(team);
          }

          var unitTypeName = heroEntry.name && heroEntry.name.length > 0 ? heroEntry.name : fallbackTypeName;
          var forwardX = 0;
          var forwardZ = team === 0 ? 1 : -1;
          hero.moveSpeed = heroEntry.maxSpeed;
          hero.init(this.sim, team, unitTypeName, forwardX, forwardZ);

          if (team === 0) {
            this.teamAHero = hero;

            if (this.teamA.indexOf(hero) < 0) {
              this.teamA.push(hero);
              this.aliveCount[0]++;
            }

            (_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
              error: Error()
            }), EnemyFinder) : EnemyFinder).teamA = this.teamA;
          } else {
            this.teamBHero = hero;

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
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "maxRvoStepDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.05;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "visualSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 16;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridCellSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "spatialGridUpdateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "teamAAliveLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "teamADeathLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "teamBAliveLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "teamBDeathLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "teamAKillLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "teamBKillLabel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "teamACounterKillLabel", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "teamBCounterKillLabel", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "teamACombatPointLabel", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "teamBCombatPointLabel", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "spawnImmediatelyOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "prewarmOnStart", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "spawnWaveInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "maxAutoSpawnDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "teamASpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -20;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "teamBSpawnZ", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "maxUnitPerRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "spaceBetweenUnit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "spaceBetweenRow", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
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
      }), _descriptor39 = _applyDecoratedDescriptor(_class2.prototype, "squareFormationWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class2.prototype, "circleObstacles", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class2.prototype, "rectObstacles", [_dec15], {
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