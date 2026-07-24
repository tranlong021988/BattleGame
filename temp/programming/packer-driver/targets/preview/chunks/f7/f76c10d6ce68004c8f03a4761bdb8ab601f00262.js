System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Enum, GameManager, BattlefieldEvaluator, UnitFamily, unitFamilyToName, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _crd, ccclass, property, BattleArmyBrainTestUnit, BattleArmyBrain;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitPrefabEntry(extras) {
    _reporterNs.report("UnitPrefabEntry", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattlefieldEvaluator(extras) {
    _reporterNs.report("BattlefieldEvaluator", "./BattlefieldEvaluator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleSpawnDecision(extras) {
    _reporterNs.report("BattleSpawnDecision", "./BattlefieldEvaluator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattlefieldWaveIntel(extras) {
    _reporterNs.report("BattlefieldWaveIntel", "./BattlefieldEvaluator", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfunitFamilyToName(extras) {
    _reporterNs.report("unitFamilyToName", "./BattleTypes", _context.meta, extras);
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
      Enum = _cc.Enum;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      BattlefieldEvaluator = _unresolved_3.BattlefieldEvaluator;
    }, function (_unresolved_4) {
      UnitFamily = _unresolved_4.UnitFamily;
      unitFamilyToName = _unresolved_4.unitFamilyToName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "63f56u2DYdIIZESxV3A3Ytl", "BattleArmyBrain", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Enum']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BattleArmyBrainTestUnit", BattleArmyBrainTestUnit = /*#__PURE__*/function (BattleArmyBrainTestUnit) {
        BattleArmyBrainTestUnit[BattleArmyBrainTestUnit["Axeman"] = 0] = "Axeman";
        BattleArmyBrainTestUnit[BattleArmyBrainTestUnit["Cavalry"] = 1] = "Cavalry";
        BattleArmyBrainTestUnit[BattleArmyBrainTestUnit["Sword"] = 2] = "Sword";
        BattleArmyBrainTestUnit[BattleArmyBrainTestUnit["Spear"] = 3] = "Spear";
        BattleArmyBrainTestUnit[BattleArmyBrainTestUnit["Monk"] = 4] = "Monk";
        BattleArmyBrainTestUnit[BattleArmyBrainTestUnit["Archer"] = 5] = "Archer";
        return BattleArmyBrainTestUnit;
      }({}));

      Enum(BattleArmyBrainTestUnit);

      _export("BattleArmyBrain", BattleArmyBrain = (_dec = ccclass('BattleArmyBrain'), _dec2 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec3 = property({
        tooltip: 'Test mode: skip normal AI and spawn exactly one selected wave in the middle lane.'
      }), _dec4 = property({
        type: BattleArmyBrainTestUnit,
        tooltip: 'Unit spawned by Test Single Wave Battle. Uses this brain team database entry.'
      }), _dec5 = property({
        min: 0,
        max: 1,
        tooltip: 'Chance to keep the evaluator unit choice. Failed rolls keep the same target/lane but choose a deliberately poor unit response.'
      }), _dec6 = property({
        tooltip: 'Power coverage target for the selected enemy wave. 1 means enough estimated force; values above 1 ask for a small reserve.'
      }), _dec7 = property({
        tooltip: 'If an ally wave covering the target drops below this health ratio, BattleArmyBrain may reinforce even when coverage exists.'
      }), _dec8 = property({
        tooltip: 'Do not add more direct-lane response waves when this many useful ally waves already stand between spawn and target, unless rescue/danger rules apply.'
      }), _dec9 = property({
        tooltip: 'Maximum Archer/Monk support waves allowed near one target lane at full decision accuracy. Lower accuracy scales this limit down.'
      }), _dec10 = property({
        min: 1,
        tooltip: 'Maximum consecutive melee waves this brain may spawn into the same lane. Ranged waves use their own support rules.'
      }), _dec(_class = (_class2 = class BattleArmyBrain extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "gameManager", _descriptor, this);

          _initializerDefineProperty(this, "team", _descriptor2, this);

          _initializerDefineProperty(this, "runOnlyWhenGameManagerAutoSpawnOff", _descriptor3, this);

          _initializerDefineProperty(this, "testSingleWaveBattle", _descriptor4, this);

          _initializerDefineProperty(this, "testSingleWaveUnit", _descriptor5, this);

          _initializerDefineProperty(this, "minSpawnInterval", _descriptor6, this);

          _initializerDefineProperty(this, "maxSpawnInterval", _descriptor7, this);

          _initializerDefineProperty(this, "maxBrainDeltaTime", _descriptor8, this);

          _initializerDefineProperty(this, "enableMaxAliveWaveLimit", _descriptor9, this);

          _initializerDefineProperty(this, "maxAliveWaves", _descriptor10, this);

          _initializerDefineProperty(this, "decisionAccuracy", _descriptor11, this);

          _initializerDefineProperty(this, "coverageTargetRatio", _descriptor12, this);

          _initializerDefineProperty(this, "rescueAllyAliveRatio", _descriptor13, this);

          _initializerDefineProperty(this, "laneAllyAheadLimit", _descriptor14, this);

          _initializerDefineProperty(this, "spawnOpeningWaveIfNoEnemyWave", _descriptor15, this);

          _initializerDefineProperty(this, "maxRangedSupportWavesPerLane", _descriptor16, this);

          _initializerDefineProperty(this, "maxConsecutiveMeleeWavesPerLane", _descriptor17, this);

          _initializerDefineProperty(this, "enableStateLog", _descriptor18, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor19, this);

          this.timer = 0;
          this.nextInterval = 3;
          this.evaluator = new (_crd && BattlefieldEvaluator === void 0 ? (_reportPossibleCrUseOfBattlefieldEvaluator({
            error: Error()
          }), BattlefieldEvaluator) : BattlefieldEvaluator)();
          this.affordableEntries = [];
          this.currentAccuracyRoll = 0;
          this.currentAccurateDecision = true;
          this.currentDeliberateMistake = false;
          this.lastMeleeSpawnLaneId = -1;
          this.consecutiveMeleeSpawnLaneCount = 0;
          this.spawnedOpeningWave = false;
          this.hasSeenEnemyWave = false;
          this.testSingleWaveSpawned = false;
        }

        start() {
          this.randomizeNextInterval();
        }

        update(dt) {
          if (!this.gameManager) return;

          if (this.testSingleWaveBattle) {
            this.trySpawnSingleWaveTest();
            return;
          }

          if (this.runOnlyWhenGameManagerAutoSpawnOff && this.gameManager.enableAutoSpawn) {
            return;
          }

          var safeDt = Math.min(Math.max(0, dt), Math.max(0.01, this.maxBrainDeltaTime));
          this.timer += safeDt;

          if (this.timer < this.nextInterval) {
            return;
          }

          this.timer = 0;
          this.randomizeNextInterval();
          this.thinkAndSpawn();
        }

        trySpawnSingleWaveTest() {
          if (this.testSingleWaveSpawned) return;
          var gameManager = this.gameManager;
          if (!gameManager) return;

          if (this.runOnlyWhenGameManagerAutoSpawnOff && gameManager.enableAutoSpawn) {
            this.stateLog('WAIT single-wave test blocked by GameManager auto spawn.');
            return;
          }

          var entry = this.findTestSingleWaveEntry();

          if (!entry) {
            this.stateLog('WAIT single-wave test has no matching unit entry.');
            return;
          }

          var laneId = Math.floor(gameManager.getSafeLaneCount() * 0.5);
          this.currentAccuracyRoll = 0;
          this.currentAccurateDecision = true;
          this.currentDeliberateMistake = false;
          this.affordableEntries.length = 1;
          this.affordableEntries[0] = entry;

          if (this.spawn(entry, laneId, false, 'test-single-wave')) {
            this.testSingleWaveSpawned = true;
          }
        }

        thinkAndSpawn() {
          var gameManager = this.gameManager;
          if (!gameManager) return;
          var aliveWaveCount = this.getAliveWaveCount();

          if (!this.canSpawnMoreWave(aliveWaveCount)) {
            this.debugLog('Skip: max alive waves reached.');
            return;
          }

          gameManager.collectAffordableEntries(this.team, this.affordableEntries);

          if (this.affordableEntries.length <= 0) {
            this.debugLog('Skip: no affordable entries.');
            return;
          }

          this.currentAccuracyRoll = Math.random();
          this.currentAccurateDecision = this.currentAccuracyRoll < this.getDecisionAccuracy();
          this.currentDeliberateMistake = false;
          this.evaluator.coverageTargetRatio = Math.max(0, this.coverageTargetRatio);
          this.evaluator.rescueAllyAliveRatio = this.clamp01(this.rescueAllyAliveRatio);
          this.evaluator.laneAllyAheadLimit = Math.max(0, Math.floor(this.laneAllyAheadLimit));
          this.evaluator.rebuild(gameManager, this.team);

          if (this.evaluator.enemyCount > 0) {
            this.hasSeenEnemyWave = true;
          }

          if (this.evaluator.enemyCount <= 0) {
            if (!this.spawnOpeningWaveIfNoEnemyWave) {
              this.stateLog('WAIT no enemy and opening disabled.');
              return;
            }

            if (this.spawnedOpeningWave && !this.hasSeenEnemyWave) {
              this.stateLog('WAIT opening wave already spawned.');
              return;
            }

            var openingDecision = this.evaluator.chooseSnapshotSpawnDecision(gameManager, this.team, this.affordableEntries, 0, this.getBlockedMeleeLaneId());

            if (openingDecision.entry && openingDecision.laneId >= 0 && this.trySpawnDecisionWithAccuracy(openingDecision)) {
              this.spawnedOpeningWave = true;
            }

            return;
          }

          var effectiveRangedSupportLimit = this.getEffectiveRangedSupportLimit();
          var decision = this.evaluator.chooseSnapshotSpawnDecision(gameManager, this.team, this.affordableEntries, effectiveRangedSupportLimit, this.getBlockedMeleeLaneId());

          if (decision.entry && decision.laneId >= 0) {
            if (this.trySpawnDecisionWithAccuracy(decision)) {
              return;
            }
          }

          var fallbackDecision = this.evaluator.chooseFallbackSpawnDecision(gameManager, this.team, this.affordableEntries, effectiveRangedSupportLimit, this.getBlockedMeleeLaneId());

          if (fallbackDecision.entry && fallbackDecision.laneId >= 0) {
            if (this.trySpawnDecisionWithAccuracy(fallbackDecision)) {
              return;
            }
          }

          this.stateLog('WAIT no useful snapshot or fallback spawn.');
        }

        trySpawnDecisionWithAccuracy(decision) {
          var gameManager = this.gameManager;

          if (!gameManager || !decision.entry) {
            return false;
          }

          var entry = decision.entry;
          var aggressiveForward = decision.aggressiveForward;
          var reason = decision.reason;
          var intendedEntry = null;
          var target = decision.target;
          var appliesAccuracy = !!target;
          this.currentDeliberateMistake = false;

          if (!this.currentAccurateDecision) {
            var wrongEntry = appliesAccuracy ? this.evaluator.chooseWrongResponseEntry(target, entry, this.affordableEntries, decision.laneId, this.getBlockedMeleeLaneId()) : this.evaluator.choosePoorGenericEntry(entry, this.affordableEntries, decision.laneId, this.getBlockedMeleeLaneId());

            if (!wrongEntry) {
              this.stateLog('WAIT inaccurate no poor response.');
              return false;
            }

            intendedEntry = entry;
            entry = wrongEntry;
            aggressiveForward = target ? this.evaluator.shouldSpawnAggressive(entry, target, decision.laneId) : decision.aggressiveForward;
            reason = decision.reason + (appliesAccuracy ? '-accuracy-wrong' : '-accuracy-poor');
            this.currentDeliberateMistake = true;
          }

          return this.spawn(entry, decision.laneId, aggressiveForward, reason, target, intendedEntry, decision.cpStrategyState);
        }

        spawn(entry, laneId, aggressiveForward, reason, target, intendedEntry, cpStrategyState) {
          if (target === void 0) {
            target = null;
          }

          if (intendedEntry === void 0) {
            intendedEntry = null;
          }

          if (cpStrategyState === void 0) {
            cpStrategyState = '';
          }

          var gameManager = this.gameManager;
          if (!gameManager) return false;

          if (this.isMeleeEntry(entry) && laneId === this.getBlockedMeleeLaneId()) {
            return false;
          }

          var combatPointAtDecision = gameManager.getCombatPoint(this.team);
          var enemyTeam = this.team === 0 ? 1 : 0;
          var enemyCombatPointAtDecision = gameManager.getCombatPoint(enemyTeam);
          var postSpawnCombatPoint = combatPointAtDecision - Math.max(0, entry.combatPointCost);
          var combatPointAdvantageAtDecision = combatPointAtDecision - enemyCombatPointAtDecision;
          var postSpawnCombatPointAdvantage = postSpawnCombatPoint - enemyCombatPointAtDecision;
          var combatPointCostRatioAtDecision = combatPointAtDecision / Math.max(1, entry.combatPointCost);
          var canComfortablyAffordAtDecision = combatPointCostRatioAtDecision >= 1.7;
          var spawned = gameManager.spawnWaveByEntry(this.team, entry, laneId, aggressiveForward, reason);
          if (!spawned) return false;
          this.recordSpawnLaneHistory(entry, laneId);
          this.evaluator.recordSpawnReservation(gameManager, this.team, target, entry, spawned, gameManager.frame);
          gameManager.recordBattleTelemetryWaveSpawnDecision({
            team: this.team,
            waveId: spawned.id,
            frame: gameManager.frame,
            time: gameManager.getBattleElapsedTime(),
            reason,
            aggressiveForward,
            laneId,
            unitName: entry.name,
            family: entry.family,
            familyName: (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
              error: Error()
            }), unitFamilyToName) : unitFamilyToName)(entry.family),
            tier: entry.tier,
            intendedUnitName: intendedEntry ? intendedEntry.name : '',
            intendedFamily: intendedEntry ? intendedEntry.family : undefined,
            intendedFamilyName: intendedEntry ? (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
              error: Error()
            }), unitFamilyToName) : unitFamilyToName)(intendedEntry.family) : '',
            targetWaveId: target && target.wave ? target.wave.id : -1,
            targetLaneId: target ? target.visualLaneId : -1,
            targetFamily: target && target.entry ? target.entry.family : -1,
            targetFamilyName: target && target.entry ? (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
              error: Error()
            }), unitFamilyToName) : unitFamilyToName)(target.entry.family) : '',
            responseTier: '',
            allyBlockersFromSpawn: target ? target.allyBlockersFromSpawn : 0,
            allyCountInLane: target ? target.allyAheadCount : 0,
            firstEnemyFromSpawn: false,
            coverage: target ? target.coverageRatio : 0,
            uncovered: target ? Math.max(0, this.coverageTargetRatio - target.coverageRatio) : 0,
            threatScore: target ? target.threatScore : 0,
            decisionPath: reason,
            decisionAccuracy: this.getDecisionAccuracy(),
            accuracyRoll: this.currentAccuracyRoll,
            accurateDecision: this.currentAccurateDecision,
            deliberateMistake: this.currentDeliberateMistake,
            aliveWaveCountAtDecision: this.getAliveWaveCount(),
            affordableEntryCount: this.affordableEntries.length,
            activeEnemyIntelCount: this.evaluator.enemyCount,
            combatPointAtDecision,
            combatPointAdvantageAtDecision,
            enemyCombatPointAtDecision,
            postSpawnCombatPoint,
            postSpawnCombatPointAdvantage: postSpawnCombatPointAdvantage,
            combatPointCostRatioAtDecision,
            canComfortablyAffordAtDecision,
            cpStrategyState
          });
          this.stateLog(reason + " spawn=" + entry.name + " lane=" + laneId + " " + ("aggressive=" + aggressiveForward + " ") + ("cpState=" + (cpStrategyState || 'none')));
          return true;
        }

        getAliveWaveCount() {
          var gameManager = this.gameManager;
          if (!gameManager) return 0;
          var count = 0;

          for (var i = 0; i < gameManager.waves.length; i++) {
            var wave = gameManager.waves[i];
            if (!wave) continue;
            if (wave.released) continue;
            if (wave.team !== this.team) continue;
            if (wave.isDead()) continue;
            count++;
          }

          return count;
        }

        findTestSingleWaveEntry() {
          var gameManager = this.gameManager;
          if (!gameManager) return null;
          var family = this.getTestSingleWaveFamily();
          var entries = gameManager.getTeamEntries(this.team);

          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!entry) continue;
            if (!entry.unlocked) continue;
            if (!entry.prefab) continue;
            if (entry.family !== family) continue;
            return entry;
          }

          return null;
        }

        getTestSingleWaveFamily() {
          switch (this.testSingleWaveUnit) {
            case BattleArmyBrainTestUnit.Axeman:
              return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Axeman;

            case BattleArmyBrainTestUnit.Cavalry:
              return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Cavalry;

            case BattleArmyBrainTestUnit.Sword:
              return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Sword;

            case BattleArmyBrainTestUnit.Spear:
              return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Spear;

            case BattleArmyBrainTestUnit.Monk:
              return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Monk;

            case BattleArmyBrainTestUnit.Archer:
              return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Archer;

            default:
              return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Sword;
          }
        }

        canSpawnMoreWave(aliveWaveCount) {
          if (!this.enableMaxAliveWaveLimit) {
            return true;
          }

          return aliveWaveCount < Math.max(0, Math.floor(this.maxAliveWaves));
        }

        randomizeNextInterval() {
          var min = Math.max(0.05, this.minSpawnInterval);
          var max = Math.max(min, this.maxSpawnInterval);
          this.nextInterval = min + Math.random() * (max - min);
        }

        isMeleeEntry(entry) {
          return entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer && entry.family !== (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk;
        }

        getBlockedMeleeLaneId() {
          if (this.lastMeleeSpawnLaneId < 0) {
            return -1;
          }

          return this.consecutiveMeleeSpawnLaneCount >= Math.max(1, Math.floor(this.maxConsecutiveMeleeWavesPerLane)) ? this.lastMeleeSpawnLaneId : -1;
        }

        recordSpawnLaneHistory(entry, laneId) {
          if (!this.isMeleeEntry(entry)) {
            return;
          }

          if (laneId === this.lastMeleeSpawnLaneId) {
            this.consecutiveMeleeSpawnLaneCount++;
            return;
          }

          this.lastMeleeSpawnLaneId = laneId;
          this.consecutiveMeleeSpawnLaneCount = 1;
        }

        getDecisionAccuracy() {
          return this.clamp01(this.decisionAccuracy);
        }

        getEffectiveRangedSupportLimit() {
          var max = Math.max(0, Math.floor(this.maxRangedSupportWavesPerLane));
          return Math.floor(max * this.getDecisionAccuracy());
        }

        clamp01(value) {
          return Math.max(0, Math.min(1, value));
        }

        stateLog(message) {
          if (!this.enableStateLog) return;
          console.log("[BattleArmyBrain State T" + this.team + "] " + message);
        }

        debugLog(message) {
          if (!this.enableDebugLog) return;
          console.log("[BattleArmyBrain Debug T" + this.team + "] " + message);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "team", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "runOnlyWhenGameManagerAutoSpawnOff", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "testSingleWaveBattle", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "testSingleWaveUnit", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return BattleArmyBrainTestUnit.Sword;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.5;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5.0;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "maxBrainDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "enableMaxAliveWaveLimit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWaves", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 7;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "decisionAccuracy", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "coverageTargetRatio", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.05;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "rescueAllyAliveRatio", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.35;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "laneAllyAheadLimit", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "spawnOpeningWaveIfNoEnemyWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "maxRangedSupportWavesPerLane", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "maxConsecutiveMeleeWavesPerLane", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "enableStateLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f76c10d6ce68004c8f03a4761bdb8ab601f00262.js.map