System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameManager, BattleWave, CounterSettings, unitTypeToName, SmartLaneIntel, SmartWaveIntel, _dec, _dec2, _dec3, _dec4, _class3, _class4, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _crd, ccclass, property, BattleWaveSpawnedEvent, ComparableThreatDistance, DeliberateLosingChoiceChance, SmartArmyBrain;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitPrefabEntry(extras) {
    _reporterNs.report("UnitPrefabEntry", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleWave(extras) {
    _reporterNs.report("BattleWave", "./BattleWave", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCounterSettings(extras) {
    _reporterNs.report("CounterSettings", "./CounterSettings", _context.meta, extras);
  }

  function _reportPossibleCrUseOfunitTypeToName(extras) {
    _reporterNs.report("unitTypeToName", "./BattleTypes", _context.meta, extras);
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
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      BattleWave = _unresolved_3.BattleWave;
    }, function (_unresolved_4) {
      CounterSettings = _unresolved_4.CounterSettings;
    }, function (_unresolved_5) {
      unitTypeToName = _unresolved_5.unitTypeToName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "176e8OduVVJWZtW75fGMWiX", "SmartArmyBrain", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);
      BattleWaveSpawnedEvent = 'battle-wave-spawned';
      ComparableThreatDistance = 2;
      DeliberateLosingChoiceChance = 0.8;
      SmartLaneIntel = class SmartLaneIntel {
        constructor() {
          this.laneId = 0;
          this.allyCount = 0;
          this.enemyCount = 0;
          this.trafficCount = 0;
          this.enemyThreat = 0;
          this.allyPressure = 0;
        }

        reset(laneId) {
          this.laneId = laneId;
          this.allyCount = 0;
          this.enemyCount = 0;
          this.trafficCount = 0;
          this.enemyThreat = 0;
          this.allyPressure = 0;
        }

      };
      SmartWaveIntel = class SmartWaveIntel {
        constructor() {
          this.wave = null;
          this.laneId = -1;
          this.centerX = 0;
          this.centerZ = 0;
          this.aliveRatio = 0;
          this.coverage = 0;
          this.uncovered = 0;
          this.distanceToDefend = 0;
          this.unengaged = false;
          this.allyCountInLane = 0;
          this.allyBlockersFromSpawn = 0;
          this.firstEnemyFromSpawn = false;
          this.hasStrugglingAlly = false;
          this.threatScore = 0;
        }

        reset() {
          this.wave = null;
          this.laneId = -1;
          this.centerX = 0;
          this.centerZ = 0;
          this.aliveRatio = 0;
          this.coverage = 0;
          this.uncovered = 0;
          this.distanceToDefend = 0;
          this.unengaged = false;
          this.allyCountInLane = 0;
          this.allyBlockersFromSpawn = 0;
          this.firstEnemyFromSpawn = false;
          this.hasStrugglingAlly = false;
          this.threatScore = 0;
        }

      };

      _export("SmartArmyBrain", SmartArmyBrain = (_dec = ccclass('SmartArmyBrain'), _dec2 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec3 = property({
        min: 0,
        max: 1,
        tooltip: 'Chance that one complete spawn decision uses the best reachable target and counter unit. Near 0 deliberately favors non-winning matchups against a front enemy; 1 is fully accurate.'
      }), _dec4 = property({
        min: 0,
        max: 1,
        tooltip: 'Chance to immediately counter a newly spawned enemy wave after min spawn interval has elapsed. Higher AI can react faster without waiting for max spawn interval.'
      }), _dec(_class3 = (_class4 = class SmartArmyBrain extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gameManager", _descriptor, this);

          _initializerDefineProperty(this, "team", _descriptor2, this);

          _initializerDefineProperty(this, "runOnlyWhenGameManagerAutoSpawnOff", _descriptor3, this);

          _initializerDefineProperty(this, "minSpawnInterval", _descriptor4, this);

          _initializerDefineProperty(this, "maxSpawnInterval", _descriptor5, this);

          _initializerDefineProperty(this, "maxBrainDeltaTime", _descriptor6, this);

          _initializerDefineProperty(this, "enableMaxAliveWaveLimit", _descriptor7, this);

          _initializerDefineProperty(this, "maxAliveWaves", _descriptor8, this);

          _initializerDefineProperty(this, "decisionAccuracy", _descriptor9, this);

          _initializerDefineProperty(this, "attackCounterCoverageRatio", _descriptor10, this);

          _initializerDefineProperty(this, "ignoreNearlyDeadWaveRatio", _descriptor11, this);

          _initializerDefineProperty(this, "rescueAllyAliveRatio", _descriptor12, this);

          _initializerDefineProperty(this, "aggressiveForwardChance", _descriptor13, this);

          _initializerDefineProperty(this, "fastReactCounterChance", _descriptor14, this);

          _initializerDefineProperty(this, "spawnOpeningWaveIfNoEnemyWave", _descriptor15, this);

          _initializerDefineProperty(this, "enableStateLog", _descriptor16, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor17, this);

          this.timer = 0;
          this.nextInterval = 3;
          this.elapsedTime = 0;
          this.hasReachedMaxAliveWavesOnce = false;
          this.laneIntel = [];
          this.enemyIntel = [];
          this.activeEnemyIntelCount = 0;
          this.affordableEntries = [];
          this.bestEntryBuffer = [];
          this.counterCandidateBuffer = [];
        }

        start() {
          this.randomizeNextInterval();
          this.registerFastReactListener();
        }

        onDestroy() {
          this.unregisterFastReactListener();
        }

        update(deltaTime) {
          if (!this.gameManager) return;

          if (this.runOnlyWhenGameManagerAutoSpawnOff && this.gameManager.enableAutoSpawn) {
            return;
          }

          const safeDeltaTime = Math.min(deltaTime, Math.max(0.016, this.maxBrainDeltaTime));
          this.elapsedTime += safeDeltaTime;
          this.timer += safeDeltaTime;

          if (this.timer < this.nextInterval) {
            return;
          }

          this.timer = 0;
          this.randomizeNextInterval();
          this.thinkAndSpawn();
        }

        registerFastReactListener() {
          if (!this.gameManager) return;
          this.gameManager.node.on(BattleWaveSpawnedEvent, this.onBattleWaveSpawned, this);
        }

        unregisterFastReactListener() {
          if (!this.gameManager) return;
          this.gameManager.node.off(BattleWaveSpawnedEvent, this.onBattleWaveSpawned, this);
        }

        onBattleWaveSpawned(wave) {
          if (!wave) return;
          if (!this.gameManager) return;

          if (wave.team === this.team) {
            this.refreshMaxAliveWaveReached();
            return;
          }

          if (!this.isValidWave(wave)) return;

          if (this.runOnlyWhenGameManagerAutoSpawnOff && this.gameManager.enableAutoSpawn) {
            return;
          }

          if (Math.random() > this.clamp01(this.fastReactCounterChance)) {
            return;
          }

          if (!this.hasReachedMinSpawnInterval()) {
            return;
          }

          const aliveWaveCount = this.getAliveWaveCount(this.team);
          this.refreshMaxAliveWaveReached(aliveWaveCount);

          if (!this.canSpawnMoreWave(aliveWaveCount)) {
            this.debugLog('Fast react skip: max alive waves reached.');
            return;
          }

          this.collectAffordableEntries();

          if (this.affordableEntries.length <= 0) {
            this.debugLog('Fast react skip: no affordable entries.');
            return;
          }

          if (!this.rollAccurateDecision()) {
            this.debugLog('Fast react skip: inaccurate decision.');
            return;
          }

          this.rebuildIntel();
          const targetIntel = this.findIntelForWave(wave);

          if (!this.isCounterCandidate(targetIntel)) {
            this.debugLog('Fast react skip: spawned wave has no reachable counter.');
            return;
          }

          if (!this.spawnCounter(targetIntel)) {
            return;
          }

          this.stateLog(`FAST_REACT enemyWave=${wave.id}`);
          this.timer = 0;
          this.randomizeNextInterval();
        }

        thinkAndSpawn() {
          if (!this.gameManager) return;
          const aliveWaveCount = this.getAliveWaveCount(this.team);
          this.refreshMaxAliveWaveReached(aliveWaveCount);

          if (!this.canSpawnMoreWave(aliveWaveCount)) {
            this.debugLog('Skip: max alive waves reached.');
            return;
          }

          this.collectAffordableEntries();

          if (this.affordableEntries.length <= 0) {
            this.debugLog('Skip: no affordable entries.');
            return;
          }

          const accurateDecision = this.rollAccurateDecision();

          if (!accurateDecision) {
            const deliberateMistake = Math.random() < 1 - this.getDecisionAccuracy();

            if (deliberateMistake) {
              this.rebuildIntel();

              if (this.spawnDeliberatelyBadWave()) {
                return;
              }
            }

            this.spawnNaiveWave();
            return;
          }

          this.rebuildIntel();
          const counterTarget = this.findBestCounterTarget();

          if (counterTarget) {
            this.spawnCounter(counterTarget);
            return;
          }

          if (this.trySpawnAggressiveForward('No reachable counter target')) {
            return;
          }

          if (this.activeEnemyIntelCount <= 0 && this.spawnOpeningWaveIfNoEnemyWave) {
            this.spawnOpeningWave();
            return;
          }

          this.stateLog('WAIT no useful spawn decision.');
        }

        rebuildIntel() {
          if (!this.gameManager) return;
          const laneCount = this.gameManager.getSafeLaneCount();
          this.ensureLaneIntel(laneCount);

          for (let i = 0; i < laneCount; i++) {
            this.laneIntel[i].reset(i);
          }

          const waves = this.gameManager.waves;
          const enemyTeam = this.team === 0 ? 1 : 0;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!this.isValidWave(wave)) continue;
            if (wave.laneId < 0) continue;
            const laneId = this.gameManager.clampLaneId(wave.laneId);
            const lane = this.laneIntel[laneId];
            if (!lane) continue;
            lane.trafficCount++;

            if (wave.team === this.team) {
              lane.allyCount++;
              lane.allyPressure += wave.getAliveRatio();
              continue;
            }

            if (wave.team !== enemyTeam) continue;
            lane.enemyCount++;
            lane.enemyThreat += wave.getAliveRatio();
          }

          this.activeEnemyIntelCount = 0;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!this.isValidWave(wave)) continue;
            if (wave.team !== enemyTeam) continue;
            if (wave.laneId < 0) continue;
            const laneId = this.gameManager.clampLaneId(wave.laneId);
            const lane = this.laneIntel[laneId];
            if (!lane) continue;
            const intel = this.getEnemyIntelBuffer(this.activeEnemyIntelCount++);
            this.fillEnemyIntel(intel, wave, laneId);
          }
        }

        fillEnemyIntel(intel, wave, laneId) {
          intel.reset();
          intel.wave = wave;
          intel.laneId = laneId;
          intel.aliveRatio = wave.getAliveRatio();
          this.fillLiveCounterState(intel, wave, laneId);
          intel.uncovered = Math.max(0, this.attackCounterCoverageRatio - intel.coverage);
          this.getWaveCenter(wave, intel);
          intel.distanceToDefend = this.getDistanceToDefendPoint(intel.centerX, intel.centerZ);
          intel.unengaged = !wave.hasEngaged();
          const lane = this.laneIntel[laneId];
          intel.allyCountInLane = lane ? lane.allyCount : 0;
          intel.allyBlockersFromSpawn = this.countAllyBlockersFromSpawnToTarget(wave, laneId, intel.centerZ);
          intel.firstEnemyFromSpawn = this.isFirstEnemyFromSpawn(wave, laneId, intel.centerZ);
          const distanceScore = Math.max(0, 120 - intel.distanceToDefend);
          const proximityScore = distanceScore * 1000;
          const unengagedScore = intel.unengaged ? 100 : 0;
          const clearLaneScore = intel.allyBlockersFromSpawn <= 0 ? 20 : 0;
          const oneBlockerScore = intel.allyBlockersFromSpawn === 1 ? 10 : 0;
          const underCounteredScore = intel.uncovered > 0 ? intel.uncovered * 120 : 0;
          const failedCounterScore = intel.hasStrugglingAlly ? 80 : 0;
          intel.threatScore = proximityScore + unengagedScore + clearLaneScore + oneBlockerScore + underCounteredScore + failedCounterScore + intel.aliveRatio * 45 + (wave.hasEngaged() ? 20 : 0);
        }

        findBestCounterTarget() {
          let best = null;
          let nearestDistance = Infinity;
          this.counterCandidateBuffer.length = 0;

          for (let i = 0; i < this.activeEnemyIntelCount; i++) {
            const intel = this.enemyIntel[i];
            if (!this.isCounterCandidate(intel)) continue;
            this.counterCandidateBuffer.push(intel);
            nearestDistance = Math.min(nearestDistance, intel.distanceToDefend);
          }

          if (!Number.isFinite(nearestDistance)) {
            return null;
          }

          for (let i = 0; i < this.counterCandidateBuffer.length; i++) {
            const intel = this.counterCandidateBuffer[i];

            if (intel.distanceToDefend > nearestDistance + ComparableThreatDistance) {
              continue;
            }

            if (!best || this.isHigherCounterPriority(intel, best)) {
              best = intel;
            }
          }

          return best;
        }

        isHigherCounterPriority(candidate, current) {
          const candidatePathPriority = this.getCounterPathPriority(candidate);
          const currentPathPriority = this.getCounterPathPriority(current);

          if (candidatePathPriority !== currentPathPriority) {
            return candidatePathPriority > currentPathPriority;
          }

          return candidate.threatScore > current.threatScore;
        }

        getCounterPathPriority(intel) {
          if (intel.allyBlockersFromSpawn <= 0) {
            return 2;
          }

          if (intel.allyBlockersFromSpawn === 1) {
            return 1;
          }

          return 0;
        }

        findIntelForWave(wave) {
          for (let i = 0; i < this.activeEnemyIntelCount; i++) {
            const intel = this.enemyIntel[i];

            if (intel.wave === wave) {
              return intel;
            }
          }

          return null;
        }

        isCounterCandidate(intel) {
          if (!intel || !intel.wave) return false;
          if (!this.isValidWave(intel.wave)) return false;

          if (intel.aliveRatio < this.ignoreNearlyDeadWaveRatio) {
            return false;
          }

          if (intel.uncovered <= 0 && !intel.hasStrugglingAlly) {
            return false;
          }

          if (!intel.firstEnemyFromSpawn) {
            return false;
          }

          return this.hasUsefulCounterEntry(intel);
        }

        spawnCounter(intel) {
          if (!this.gameManager || !intel.wave) return false;
          const entry = this.chooseEntryForTarget(intel);
          if (!entry) return false;
          const laneId = intel.laneId;
          const aggressiveForward = this.shouldSpawnCounterAggressiveForward(intel, laneId);
          const spawned = this.gameManager.spawnWaveByEntry(this.team, entry, laneId, aggressiveForward);
          if (!spawned) return false;
          this.stateLog(`COUNTER wave=${intel.wave.id} ` + `target=${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(intel.wave.unitType)} ` + `spawn=${entry.name} lane=${laneId} targetLane=${intel.laneId} ` + `coverage=${intel.coverage.toFixed(2)} ` + `unengaged=${intel.unengaged} ` + `allyLane=${intel.allyCountInLane} ` + `blockers=${intel.allyBlockersFromSpawn} ` + `firstFromSpawn=${intel.firstEnemyFromSpawn} ` + `struggling=${intel.hasStrugglingAlly} ` + `score=${intel.threatScore.toFixed(1)} ` + `accurate=true ` + `aggressive=${aggressiveForward}`);
          return true;
        }

        shouldSpawnCounterAggressiveForward(intel, spawnLaneId) {
          if (spawnLaneId === intel.laneId) {
            if (intel.allyBlockersFromSpawn > 0) {
              return true;
            }

            if (intel.allyCountInLane <= 0 && intel.allyBlockersFromSpawn <= 0) {
              return true;
            }
          }

          return this.shouldSpawnAggressiveForward();
        }

        chooseEntryForTarget(intel) {
          if (!intel.wave) return null;

          if (this.affordableEntries.length <= 0) {
            return null;
          }

          this.bestEntryBuffer.length = 0;
          let bestScore = -Infinity;

          for (let i = 0; i < this.affordableEntries.length; i++) {
            const entry = this.affordableEntries[i];
            const score = this.getCounterScore(entry, intel.wave);

            if (this.isRealCounterScore(score) && !this.wouldImproveCounterCoverage(intel, entry)) {
              continue;
            }

            if (score > bestScore + 0.0001) {
              bestScore = score;
              this.bestEntryBuffer.length = 0;
              this.bestEntryBuffer.push(entry);
            } else if (Math.abs(score - bestScore) <= 0.0001) {
              this.bestEntryBuffer.push(entry);
            }
          }

          if (this.bestEntryBuffer.length <= 0) {
            return null;
          }

          const index = Math.floor(Math.random() * this.bestEntryBuffer.length);
          return this.bestEntryBuffer[index];
        }

        spawnNaiveWave() {
          if (!this.gameManager) return false;
          const entry = this.getRandomAffordableEntry();
          if (!entry) return false;
          const laneCount = this.gameManager.getSafeLaneCount();
          const laneId = laneCount > 0 ? Math.floor(Math.random() * laneCount) : -1;
          const aggressiveForward = Math.random() < this.clamp01(this.aggressiveForwardChance);
          const spawned = this.gameManager.spawnWaveByEntry(this.team, entry, laneId, aggressiveForward);
          if (!spawned) return false;
          this.stateLog(`NAIVE_RANDOM spawn=${entry.name} ` + `lane=${laneId} aggressive=${aggressiveForward}`);
          return true;
        }

        spawnDeliberatelyBadWave() {
          if (!this.gameManager) return false;
          let losingIntel = null;
          let losingEntry = null;
          let losingChoiceCount = 0;
          let neutralIntel = null;
          let neutralEntry = null;
          let neutralChoiceCount = 0;

          for (let i = 0; i < this.activeEnemyIntelCount; i++) {
            const intel = this.enemyIntel[i];
            if (!intel.wave) continue;
            if (!this.isValidWave(intel.wave)) continue;
            if (!intel.firstEnemyFromSpawn) continue;

            if (intel.aliveRatio < this.ignoreNearlyDeadWaveRatio) {
              continue;
            }

            for (let j = 0; j < this.affordableEntries.length; j++) {
              const candidateEntry = this.affordableEntries[j];
              const ratio = this.getMatchupRatio(candidateEntry, intel.wave);

              if (ratio < 1 - 0.0001) {
                losingChoiceCount++;

                if (Math.random() * losingChoiceCount < 1) {
                  losingIntel = intel;
                  losingEntry = candidateEntry;
                }

                continue;
              }

              if (ratio <= 1 + 0.0001) {
                neutralChoiceCount++;

                if (Math.random() * neutralChoiceCount < 1) {
                  neutralIntel = intel;
                  neutralEntry = candidateEntry;
                }
              }
            }
          }

          const useLosingChoice = !!losingIntel && !!losingEntry && (!neutralIntel || !neutralEntry || Math.random() < DeliberateLosingChoiceChance);
          const targetIntel = useLosingChoice ? losingIntel : neutralIntel;
          const entry = useLosingChoice ? losingEntry : neutralEntry;

          if (!targetIntel || !targetIntel.wave || !entry) {
            return false;
          }

          const laneId = targetIntel.laneId;
          const spawned = this.gameManager.spawnWaveByEntry(this.team, entry, laneId, false);
          if (!spawned) return false;
          this.stateLog(`DELIBERATE_MISTAKE wave=${targetIntel.wave.id} ` + `target=${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(targetIntel.wave.unitType)} ` + `spawn=${entry.name} lane=${laneId} ` + `targetLane=${targetIntel.laneId}`);
          return true;
        }

        getMatchupRatio(entry, targetWave) {
          const ownScore = this.getCounterScore(entry, targetWave);
          const enemyScore = this.getReverseCounterScore(targetWave, entry);
          return ownScore / Math.max(0.0001, enemyScore);
        }

        getReverseCounterScore(attackerWave, defenderEntry) {
          const counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter) return 1;
          return counter.getCounterScore(attackerWave.unitType, defenderEntry.unitType);
        }

        trySpawnAggressiveForward(reason) {
          if (!this.gameManager) return false;

          if (Math.random() > this.clamp01(this.aggressiveForwardChance)) {
            return false;
          }

          const laneId = this.getBestEmptyLane();

          if (laneId < 0) {
            return false;
          }

          const entry = this.getFastestAffordableEntry();
          if (!entry) return false;
          const spawned = this.gameManager.spawnWaveByEntry(this.team, entry, laneId, true);
          if (!spawned) return false;
          this.stateLog(`AGGRESSIVE ${reason}: spawn=${entry.name} lane=${laneId}`);
          return true;
        }

        spawnOpeningWave() {
          if (!this.gameManager) return false;
          const entry = this.getRandomAffordableEntry();
          if (!entry) return false;
          const spawned = this.gameManager.spawnWaveByEntry(this.team, entry, -1, this.shouldSpawnAggressiveForward());
          if (!spawned) return false;
          this.stateLog(`OPENING spawn=${entry.name} aggressive=${this.shouldSpawnAggressiveForward()}`);
          return true;
        }

        getBestEmptyLane() {
          if (!this.gameManager) return -1;
          const laneCount = this.gameManager.getSafeLaneCount();
          let bestLane = -1;
          let bestScore = -Infinity;

          for (let laneId = 0; laneId < laneCount; laneId++) {
            const lane = this.laneIntel[laneId];
            if (!lane) continue;
            if (lane.enemyCount > 0) continue;
            if (lane.allyCount > 0) continue;
            const score = Math.random() * 0.001 - lane.trafficCount;

            if (score > bestScore) {
              bestScore = score;
              bestLane = laneId;
            }
          }

          return bestLane;
        }

        fillLiveCounterState(targetIntel, targetWave, laneId) {
          targetIntel.coverage = 0;
          targetIntel.hasStrugglingAlly = false;
          if (!this.gameManager) return;
          const waves = this.gameManager.waves;
          const threshold = this.clamp01(this.rescueAllyAliveRatio);
          const targetAlive = targetWave.getAliveCount();
          let liveCounterUnits = 0;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!this.isValidWave(wave)) continue;
            if (wave.team !== this.team) continue;
            if (wave.laneId < 0) continue;

            if (this.gameManager.clampLaneId(wave.laneId) !== laneId) {
              continue;
            }

            if (!this.isRealCounterScore(this.getWaveCounterScore(wave, targetWave))) {
              continue;
            }

            const targetRelation = this.getWaveTargetRelation(wave, targetWave);

            if (targetRelation < 0) {
              continue;
            }

            if (targetRelation > 0) {
              liveCounterUnits += targetRelation;

              if (wave.getAliveRatio() <= threshold) {
                targetIntel.hasStrugglingAlly = true;
              }

              continue;
            }

            if (!this.isFirstEnemyAheadForAlly(wave, targetWave, laneId)) {
              continue;
            }

            liveCounterUnits += wave.getAliveCount();

            if (wave.getAliveRatio() <= threshold) {
              targetIntel.hasStrugglingAlly = true;
            }
          }

          targetIntel.coverage = targetAlive > 0 ? liveCounterUnits / targetAlive : 1;
        }

        getWaveTargetRelation(allyWave, targetWave) {
          let directTargetCount = 0;
          let hasOtherTarget = false;

          for (let i = 0; i < allyWave.units.length; i++) {
            const unit = allyWave.units[i];
            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props || unit.props.isDead()) continue;
            const target = unit.getValidEnemyTarget();
            if (!target) continue;

            if ((_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
              error: Error()
            }), BattleWave) : BattleWave).getWaveForUnit(target) === targetWave) {
              directTargetCount++;
            } else {
              hasOtherTarget = true;
            }
          }

          if (directTargetCount > 0) {
            return directTargetCount;
          }

          return hasOtherTarget ? -1 : 0;
        }

        isFirstEnemyAheadForAlly(allyWave, targetWave, laneId) {
          if (!this.gameManager) return false;
          const allyZ = this.getWaveCenterZ(allyWave);
          const targetZ = this.getWaveCenterZ(targetWave);
          const forwardSign = this.team === 0 ? 1 : -1;
          const targetForwardDistance = (targetZ - allyZ) * forwardSign;

          if (targetForwardDistance < 0) {
            return false;
          }

          const waves = this.gameManager.waves;
          const enemyTeam = this.team === 0 ? 1 : 0;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!this.isValidWave(wave)) continue;
            if (wave === targetWave) continue;
            if (wave.team !== enemyTeam) continue;
            if (wave.laneId < 0) continue;

            if (this.gameManager.clampLaneId(wave.laneId) !== laneId) {
              continue;
            }

            const otherDistance = (this.getWaveCenterZ(wave) - allyZ) * forwardSign;
            if (otherDistance < 0) continue;

            if (otherDistance < targetForwardDistance - 0.0001 || Math.abs(otherDistance - targetForwardDistance) <= 0.0001 && wave.id < targetWave.id) {
              return false;
            }
          }

          return true;
        }

        getWaveCounterScore(attackerWave, targetWave) {
          const counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter) return 1;
          return counter.getCounterScore(attackerWave.unitType, targetWave.unitType);
        }

        hasUsefulCounterEntry(intel) {
          if (!intel.wave) return false;

          for (let i = 0; i < this.affordableEntries.length; i++) {
            const entry = this.affordableEntries[i];
            const score = this.getCounterScore(entry, intel.wave);

            if (!this.isRealCounterScore(score)) {
              continue;
            }

            if (this.wouldImproveCounterCoverage(intel, entry)) {
              return true;
            }
          }

          return false;
        }

        wouldImproveCounterCoverage(intel, entry) {
          if (!intel.wave) return false;
          if (intel.hasStrugglingAlly) return true;
          if (intel.coverage <= 0.0001) return true;
          const targetAlive = intel.wave.getAliveCount();
          if (targetAlive <= 0) return false;
          const requiredCoverage = Math.max(0, this.attackCounterCoverageRatio);
          const addedCoverage = Math.max(0, Math.floor(entry.unitCount)) / targetAlive;
          const currentError = Math.abs(requiredCoverage - intel.coverage);
          const projectedError = Math.abs(requiredCoverage - (intel.coverage + addedCoverage));
          return projectedError < currentError - 0.0001;
        }

        countAllyBlockersFromSpawnToTarget(targetWave, laneId, targetZ) {
          if (!this.gameManager) return 0;
          const waves = this.gameManager.waves;
          const spawnZ = this.team === 0 ? this.gameManager.teamASpawnZ : this.gameManager.teamBSpawnZ;
          const minZ = Math.min(spawnZ, targetZ);
          const maxZ = Math.max(spawnZ, targetZ);
          let blockers = 0;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!this.isValidWave(wave)) continue;
            if (wave === targetWave) continue;
            if (wave.team !== this.team) continue;
            if (wave.laneId < 0) continue;

            if (this.gameManager.clampLaneId(wave.laneId) !== laneId) {
              continue;
            }

            const centerZ = this.getWaveCenterZ(wave);

            if (centerZ < minZ || centerZ > maxZ) {
              continue;
            }

            blockers++;
          }

          return blockers;
        }

        isFirstEnemyFromSpawn(targetWave, laneId, targetZ) {
          if (!this.gameManager) return true;
          const waves = this.gameManager.waves;
          const spawnZ = this.team === 0 ? this.gameManager.teamASpawnZ : this.gameManager.teamBSpawnZ;
          const forwardSign = this.team === 0 ? 1 : -1;
          const targetForwardDistance = (targetZ - spawnZ) * forwardSign;
          const targetDirection = targetForwardDistance >= 0 ? 1 : -1;
          const targetDistance = Math.abs(targetForwardDistance);
          const enemyTeam = this.team === 0 ? 1 : 0;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!this.isValidWave(wave)) continue;
            if (wave === targetWave) continue;
            if (wave.team !== enemyTeam) continue;
            if (wave.laneId < 0) continue;

            if (this.gameManager.clampLaneId(wave.laneId) !== laneId) {
              continue;
            }

            const otherForwardDistance = (this.getWaveCenterZ(wave) - spawnZ) * forwardSign;

            if (otherForwardDistance * targetDirection < 0) {
              continue;
            }

            const otherDistance = Math.abs(otherForwardDistance);

            if (otherDistance < targetDistance - 0.0001 || Math.abs(otherDistance - targetDistance) <= 0.0001 && wave.id < targetWave.id) {
              return false;
            }
          }

          return true;
        }

        getWaveCenter(wave, intel) {
          let count = 0;
          let sumX = 0;
          let sumZ = 0;

          for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];
            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props) continue;
            if (unit.props.isDead()) continue;
            count++;
            sumX += unit.agent.pos.x;
            sumZ += unit.agent.pos.z;
          }

          if (count <= 0) {
            intel.centerX = 0;
            intel.centerZ = 0;
            return;
          }

          intel.centerX = sumX / count;
          intel.centerZ = sumZ / count;
        }

        getWaveCenterZ(wave) {
          let count = 0;
          let sumZ = 0;

          for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];
            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props) continue;
            if (unit.props.isDead()) continue;
            count++;
            sumZ += unit.agent.pos.z;
          }

          if (count <= 0) return 0;
          return sumZ / count;
        }

        getDistanceToDefendPoint(x, z) {
          if (!this.gameManager) return 0;
          const hero = this.team === 0 ? this.gameManager.teamAHero : this.gameManager.teamBHero;
          const defendX = hero && hero.agent ? hero.agent.pos.x : 0;
          const defendZ = hero && hero.agent ? hero.agent.pos.z : this.team === 0 ? this.gameManager.teamASpawnZ : this.gameManager.teamBSpawnZ;
          const dx = x - defendX;
          const dz = z - defendZ;
          return Math.sqrt(dx * dx + dz * dz);
        }

        collectAffordableEntries() {
          this.affordableEntries.length = 0;
          if (!this.gameManager) return;
          this.gameManager.collectAffordableEntries(this.team, this.affordableEntries);
        }

        getRandomAffordableEntry() {
          if (this.affordableEntries.length <= 0) {
            return null;
          }

          const index = Math.floor(Math.random() * this.affordableEntries.length);
          return this.affordableEntries[index];
        }

        getFastestAffordableEntry() {
          let best = null;
          let bestSpeed = -Infinity;
          let bestCost = Infinity;

          for (let i = 0; i < this.affordableEntries.length; i++) {
            const entry = this.affordableEntries[i];
            const speed = Math.max(0, entry.maxSpeed);
            const cost = Math.max(0, entry.combatPointCost);

            if (speed > bestSpeed + 0.0001 || Math.abs(speed - bestSpeed) <= 0.0001 && cost < bestCost) {
              best = entry;
              bestSpeed = speed;
              bestCost = cost;
            }
          }

          return best;
        }

        getCounterScore(entry, targetWave) {
          const counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter) return 1;
          return counter.getCounterScore(entry.unitType, targetWave.unitType);
        }

        isRealCounterScore(score) {
          return score > 1.0001;
        }

        ensureLaneIntel(laneCount) {
          for (let i = this.laneIntel.length; i < laneCount; i++) {
            this.laneIntel.push(new SmartLaneIntel());
          }
        }

        getEnemyIntelBuffer(index) {
          while (this.enemyIntel.length <= index) {
            this.enemyIntel.push(new SmartWaveIntel());
          }

          return this.enemyIntel[index];
        }

        canSpawnMoreWave(aliveWaveCount = this.getAliveWaveCount(this.team)) {
          if (!this.enableMaxAliveWaveLimit) {
            return true;
          }

          if (!this.gameManager) return false;
          const max = Math.max(1, Math.floor(this.maxAliveWaves));
          return aliveWaveCount < max;
        }

        refreshMaxAliveWaveReached(aliveWaveCount = this.getAliveWaveCount(this.team)) {
          if (this.hasReachedMaxAliveWavesOnce) {
            return true;
          }

          if (!this.enableMaxAliveWaveLimit) {
            this.hasReachedMaxAliveWavesOnce = true;
            return true;
          }

          const max = Math.max(1, Math.floor(this.maxAliveWaves));

          if (aliveWaveCount >= max) {
            this.hasReachedMaxAliveWavesOnce = true;
          }

          return this.hasReachedMaxAliveWavesOnce;
        }

        shouldSpawnAggressiveForward() {
          return !this.hasReachedMaxAliveWavesOnce;
        }

        getAliveWaveCount(team) {
          if (!this.gameManager) return 0;
          return this.gameManager.getAliveWaveCount(team);
        }

        isValidWave(wave) {
          if (!wave) return false;
          if (wave.released) return false;
          if (wave.isDead()) return false;
          return true;
        }

        getDecisionAccuracy() {
          return this.clamp01(this.decisionAccuracy);
        }

        rollAccurateDecision() {
          return Math.random() < this.getDecisionAccuracy();
        }

        clamp01(v) {
          return Math.max(0, Math.min(1, v));
        }

        randomizeNextInterval() {
          const min = Math.max(0.1, this.minSpawnInterval);
          const max = Math.max(min, this.maxSpawnInterval);
          this.nextInterval = min + Math.random() * (max - min);
        }

        hasReachedMinSpawnInterval() {
          return this.timer >= Math.max(0.1, this.minSpawnInterval);
        }

        stateLog(message) {
          if (!this.enableStateLog) return;
          console.log(`[SmartArmyBrain State T${this.team}] ${message}`);
        }

        debugLog(message) {
          if (!this.enableDebugLog) return;
          console.log(`[SmartArmyBrain Debug T${this.team}] ${message}`);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class4.prototype, "gameManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class4.prototype, "team", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class4.prototype, "runOnlyWhenGameManagerAutoSpawnOff", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class4.prototype, "minSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class4.prototype, "maxSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5.0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class4.prototype, "maxBrainDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class4.prototype, "enableMaxAliveWaveLimit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class4.prototype, "maxAliveWaves", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 7;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class4.prototype, "decisionAccuracy", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class4.prototype, "attackCounterCoverageRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class4.prototype, "ignoreNearlyDeadWaveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class4.prototype, "rescueAllyAliveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.35;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class4.prototype, "aggressiveForwardChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class4.prototype, "fastReactCounterChance", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.0;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class4.prototype, "spawnOpeningWaveIfNoEnemyWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class4.prototype, "enableStateLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class4.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class4)) || _class3));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=a2f6c0176ceee488bf32b6f816799e4dc07313ce.js.map