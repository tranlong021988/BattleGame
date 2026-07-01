System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, GameManager, CounterSettings, unitTypeToName, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _crd, ccclass, property, BattleWaveSpawnedEvent, ArmyBrain;

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

  function _reportPossibleCrUseOfUnitType(extras) {
    _reporterNs.report("UnitType", "./BattleTypes", _context.meta, extras);
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
      CounterSettings = _unresolved_3.CounterSettings;
    }, function (_unresolved_4) {
      unitTypeToName = _unresolved_4.unitTypeToName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d53d3tB+Y9P9qMKZ2Hz3I1T", "ArmyBrain", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);
      BattleWaveSpawnedEvent = 'battle-wave-spawned';

      _export("ArmyBrain", ArmyBrain = (_dec = ccclass('ArmyBrain'), _dec2 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec3 = property({
        displayName: 'Fast React Chance'
      }), _dec4 = property({
        displayName: 'Aggressive Forward Chance'
      }), _dec5 = property({
        displayName: 'Enable Aggressive Forward Log'
      }), _dec(_class = (_class2 = class ArmyBrain extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gameManager", _descriptor, this);

          _initializerDefineProperty(this, "team", _descriptor2, this);

          _initializerDefineProperty(this, "runOnlyWhenGameManagerAutoSpawnOff", _descriptor3, this);

          _initializerDefineProperty(this, "minSpawnInterval", _descriptor4, this);

          _initializerDefineProperty(this, "maxSpawnInterval", _descriptor5, this);

          _initializerDefineProperty(this, "fastReactChance", _descriptor6, this);

          _initializerDefineProperty(this, "maxBrainDeltaTime", _descriptor7, this);

          _initializerDefineProperty(this, "enableMaxAliveWaveLimit", _descriptor8, this);

          _initializerDefineProperty(this, "maxAliveWaves", _descriptor9, this);

          _initializerDefineProperty(this, "preferUnengagedWaveInAttack", _descriptor10, this);

          _initializerDefineProperty(this, "ignoreNearlyDeadWaveRatio", _descriptor11, this);

          _initializerDefineProperty(this, "attackCounterCoverageRatio", _descriptor12, this);

          _initializerDefineProperty(this, "counterSameLaneChance", _descriptor13, this);

          _initializerDefineProperty(this, "laneAwareness", _descriptor14, this);

          _initializerDefineProperty(this, "aggressiveForwardChance", _descriptor15, this);

          _initializerDefineProperty(this, "aiIntelligence", _descriptor16, this);

          _initializerDefineProperty(this, "spawnRandomIfNoThreat", _descriptor17, this);

          _initializerDefineProperty(this, "spawnOpeningWaveIfNoEnemyWave", _descriptor18, this);

          _initializerDefineProperty(this, "enableStateLog", _descriptor19, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor20, this);

          _initializerDefineProperty(this, "enableAggressiveForwardLog", _descriptor21, this);

          this.timer = 0;
          this.nextInterval = 3;
          this.registeredGameManager = null;
          this.fastReactCounteredWaveIds = new Set();
          this.hasReachedMaxAliveWavesOnce = false;
        }

        onEnable() {
          this.registerWaveSpawnEvent();
        }

        start() {
          this.randomizeNextInterval();
          this.registerWaveSpawnEvent();
        }

        onDisable() {
          this.unregisterWaveSpawnEvent();
        }

        onDestroy() {
          this.unregisterWaveSpawnEvent();
        }

        update(deltaTime) {
          if (!this.gameManager) return;

          if (this.runOnlyWhenGameManagerAutoSpawnOff && this.gameManager.enableAutoSpawn) {
            return;
          }

          const safeDeltaTime = Math.min(deltaTime, Math.max(0.016, this.maxBrainDeltaTime));
          this.timer += safeDeltaTime;

          if (this.timer < this.nextInterval) {
            return;
          }

          this.timer = 0;
          this.randomizeNextInterval();
          this.thinkAndSpawn();
        }

        thinkAndSpawn() {
          if (!this.gameManager) return;
          this.refreshMaxAliveWaveReached();

          if (!this.canSpawnMoreWave()) {
            this.debugLog(`Skip spawn: aliveWaves=${this.getAliveWaveCount(this.team)} >= maxAliveWaves=${this.maxAliveWaves}`);
            return;
          }

          const entries = this.gameManager.getTeamEntries(this.team);
          const validEntries = this.getValidEntries(entries);

          if (validEntries.length <= 0) {
            this.debugLog('Abort: no valid entries.');
            return;
          }

          const enemyTeam = this.team === 0 ? 1 : 0;
          const enemyWaves = this.gameManager.getWavesByTeam(enemyTeam);
          this.stateLog(`MODE=${this.getModeLogName()}, myWaves=${this.getAliveWaveCount(this.team)}, enemyWaves=${enemyWaves.length}, CP=${Math.floor(this.gameManager.getCombatPoint(this.team))}, AI=${this.getAIIntelligence().toFixed(2)}`);
          const lanePressure = this.buildLanePressureSnapshot();

          if (enemyWaves.length <= 0) {
            if (this.trySpawnAggressiveForwardRaid(validEntries, lanePressure, 'No enemy wave')) {
              return;
            }

            if (this.spawnOpeningWaveIfNoEnemyWave) {
              this.spawnOpeningWave(validEntries);
              return;
            }

            if (this.spawnRandomIfNoThreat) {
              this.spawnRandom(validEntries, 'No enemy wave');
            }

            return;
          }

          const targetWave = this.findTargetWave();

          if (!targetWave) {
            if (this.trySpawnAggressiveForwardRaid(validEntries, lanePressure, 'No valid target')) {
              return;
            }

            if (this.spawnRandomIfNoThreat) {
              this.spawnRandom(validEntries, 'No valid target');
            }

            return;
          }

          const selectedEntry = this.chooseEntryAgainstWave(validEntries, targetWave);

          if (!selectedEntry) {
            this.debugLog('No affordable entry. Skip spawn.');
            return;
          }

          const selectedCounterScore = this.getCounterScore(selectedEntry.unitType, targetWave.unitType);
          const isRealCounter = this.isRealCounterScore(selectedCounterScore);
          this.debugLog(`Decision: targetWave=${targetWave.id}, target=${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(targetWave.unitType)}, selected=${selectedEntry.name}/${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(selectedEntry.unitType)}, score=${selectedCounterScore.toFixed(2)}, isCounter=${isRealCounter}, CP=${Math.floor(this.gameManager.getCombatPoint(this.team))}, cost=${selectedEntry.combatPointCost}, coverage=${targetWave.getCounterCoverageRatio().toFixed(2)}, lane=${targetWave.laneId}, engaged=${targetWave.hasEngaged()}`);

          if (!isRealCounter && this.trySpawnAggressiveForwardRaid(validEntries, lanePressure, `Fallback/non-counter against wave=${targetWave.id}`)) {
            return;
          }

          const spawnLaneId = this.getCounterSpawnLaneId(targetWave, lanePressure);
          const aggressiveForward = this.shouldSpawnAggressiveForward();
          this.debugLog(`Counter spawn lane: targetLane=${targetWave.laneId}, spawnLane=${spawnLaneId}, sameLaneChance=${this.counterSameLaneChance.toFixed(2)}, aggressive=${aggressiveForward}`);
          const spawned = this.gameManager.spawnWaveByEntry(this.team, selectedEntry, spawnLaneId, aggressiveForward);

          if (spawned) {
            if (isRealCounter) {
              targetWave.addCounterAssignment(selectedEntry.unitCount);
              this.debugLog(`Counter assignment added: wave=${targetWave.id}, +${selectedEntry.unitCount}, coverage=${targetWave.getCounterCoverageRatio().toFixed(2)}`);
            } else {
              this.debugLog(`Spawned fallback/non-counter unit. No counter assignment added for wave=${targetWave.id}`);
            }
          }
        }

        onBattleWaveSpawned(spawnedWave) {
          if (!this.gameManager) return;
          if (!spawnedWave) return;
          this.refreshMaxAliveWaveReached();
          if (spawnedWave.team === this.team) return;

          if (this.runOnlyWhenGameManagerAutoSpawnOff && this.gameManager.enableAutoSpawn) {
            return;
          }

          if (!this.canFastReactNow()) return;
          if (!this.canSpawnMoreWave()) return;
          if (!this.isAliveThreatWave(spawnedWave)) return;
          const entries = this.gameManager.getTeamEntries(this.team);
          const validEntries = this.getValidEntries(entries);
          const counterEntry = this.getBestRealCounterEntryAgainstWave(validEntries, spawnedWave);

          if (!counterEntry) {
            this.debugLog(`Fast react skipped: no affordable real counter for wave=${spawnedWave.id}, target=${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
              error: Error()
            }), unitTypeToName) : unitTypeToName)(spawnedWave.unitType)}`);
            return;
          }

          const lanePressure = this.buildLanePressureSnapshot();
          const spawnLaneId = this.getCounterSpawnLaneId(spawnedWave, lanePressure);
          const spawned = this.gameManager.spawnWaveByEntry(this.team, counterEntry, spawnLaneId, this.shouldSpawnAggressiveForward());

          if (!spawned) {
            return;
          }

          spawnedWave.addCounterAssignment(counterEntry.unitCount);
          this.fastReactCounteredWaveIds.add(spawnedWave.id);
          this.timer = 0;
          this.randomizeNextInterval();
          this.debugLog(`Fast react counter: enemyWave=${spawnedWave.id}, target=${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(spawnedWave.unitType)}, spawn=${counterEntry.name}/${(_crd && unitTypeToName === void 0 ? (_reportPossibleCrUseOfunitTypeToName({
            error: Error()
          }), unitTypeToName) : unitTypeToName)(counterEntry.unitType)}, lane=${spawnLaneId}, chance=${this.getFastReactChance().toFixed(2)}, nextInterval=${this.nextInterval.toFixed(2)}`);
        }

        canFastReactNow() {
          const chance = this.getFastReactChance();
          if (chance <= 0) return false;
          const minInterval = Math.max(0.1, this.minSpawnInterval);

          if (this.timer < minInterval) {
            return false;
          }

          return Math.random() <= chance;
        }

        trySpawnAggressiveForwardRaid(validEntries, lanePressure, reason) {
          if (!this.gameManager) return false;
          if (!this.canSpawnMoreWave()) return false;
          const chance = this.clamp(this.aggressiveForwardChance, 0, 1);

          if (chance <= 0) {
            return false;
          }

          const roll = Math.random();

          if (roll > chance) {
            return false;
          }

          const laneId = this.getAggressiveForwardRaidLane(lanePressure);

          if (laneId < 0) {
            this.aggressiveForwardLog(`${reason}: no empty lane`);
            return false;
          }

          const entry = this.getFastestAffordableEntry(validEntries);

          if (!entry) {
            this.aggressiveForwardLog(`${reason}: no affordable raid unit`);
            return false;
          }

          const spawned = this.gameManager.spawnWaveByEntry(this.team, entry, laneId, true);

          if (!spawned) {
            this.aggressiveForwardLog(`${reason}: spawn failed for ${entry.name} lane=${laneId}`);
            return false;
          }

          this.aggressiveForwardLog(`${reason}: spawn ${entry.name} lane=${laneId}, speed=${entry.maxSpeed}, cost=${entry.combatPointCost}, CP=${Math.floor(this.gameManager.getCombatPoint(this.team))}`);
          return true;
        }

        findTargetWave() {
          return this.findInterceptThreatWaveForAttack();
        }

        findInterceptThreatWaveForAttack() {
          if (!this.gameManager) return null;
          const enemyTeam = this.team === 0 ? 1 : 0;
          const waves = this.gameManager.getWavesByTeam(enemyTeam);
          let best = null;
          let bestScore = -Infinity;
          const defendPoint = this.getDefendPoint();

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!this.isValidAttackThreatWave(wave)) continue;
            const aliveRatio = wave.getAliveRatio();
            const engaged = wave.hasEngaged();
            const distSq = wave.getClosestDistanceSqTo(defendPoint.x, defendPoint.z);
            const dist = Math.sqrt(distSq);
            const distanceScore = Math.max(0, 100 - dist);
            const uncovered = Math.max(0, this.attackCounterCoverageRatio - wave.getCounterCoverageRatio());
            let score = 0;
            score += aliveRatio * 100;
            score += distanceScore;
            score += uncovered * 40;

            if (this.preferUnengagedWaveInAttack && !engaged) {
              score += 50;
            }

            if (score > bestScore) {
              bestScore = score;
              best = wave;
            }
          }

          return best;
        }

        isValidAttackThreatWave(wave) {
          if (!this.isAliveThreatWave(wave)) return false;
          if (this.isCoveredByFastReact(wave)) return false;

          if (wave.isCounterCovered(this.attackCounterCoverageRatio)) {
            this.debugLog(`Skip attack target wave=${wave.id}: coverage=${wave.getCounterCoverageRatio().toFixed(2)} >= ${this.attackCounterCoverageRatio}`);
            return false;
          }

          return true;
        }

        isAliveThreatWave(wave) {
          if (!wave) return false;
          if (wave.isDead()) return false;
          const aliveRatio = wave.getAliveRatio();

          if (aliveRatio < this.ignoreNearlyDeadWaveRatio) {
            return false;
          }

          return true;
        }

        isCoveredByFastReact(wave) {
          if (!this.fastReactCounteredWaveIds.has(wave.id)) {
            return false;
          }

          if (!wave.isCounterCovered(this.attackCounterCoverageRatio)) {
            return false;
          }

          this.debugLog(`Skip wave=${wave.id}: already covered by fast react, coverage=${wave.getCounterCoverageRatio().toFixed(2)}`);
          return true;
        }

        buildLanePressureSnapshot() {
          const result = [];

          if (!this.gameManager) {
            return result;
          }

          const laneCount = this.gameManager.getSafeLaneCount();

          for (let i = 0; i < laneCount; i++) {
            result.push({
              enemyThreat: 0,
              allyDefense: 0,
              enemyCount: 0,
              allyCount: 0
            });
          }

          const waves = this.gameManager.waves;
          const enemyTeam = this.team === 0 ? 1 : 0;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!wave) continue;
            if (wave.released) continue;
            if (wave.laneId < 0) continue;
            const lane = this.gameManager.clampLaneId(wave.laneId);
            const info = result[lane];
            if (!info) continue;

            if (wave.team === enemyTeam) {
              info.enemyCount++;
              info.enemyThreat++;
            } else if (wave.team === this.team) {
              info.allyCount++;
              info.allyDefense++;
            }
          }

          return result;
        }

        chooseEntryAgainstWave(entries, targetWave) {
          const affordableEntries = this.getAffordableEntries(entries);

          if (affordableEntries.length <= 0) {
            return null;
          }

          const intelligence = this.getAIIntelligence();

          if (Math.random() > intelligence) {
            return this.getRandomAffordableEntry(entries);
          }

          let bestScore = -Infinity;
          const bestEntries = [];

          for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];
            if (!this.isValidEntry(entry)) continue;
            const score = this.getCounterScore(entry.unitType, targetWave.unitType);

            if (score > bestScore) {
              bestScore = score;
              bestEntries.length = 0;
              bestEntries.push(entry);
            } else if (Math.abs(score - bestScore) < 0.0001) {
              bestEntries.push(entry);
            }
          }

          if (bestEntries.length > 0) {
            const index = Math.floor(Math.random() * bestEntries.length);
            return bestEntries[index];
          }

          return this.getCheapestAffordableEntry(entries);
        }

        getBestRealCounterEntryAgainstWave(entries, targetWave) {
          const affordableEntries = this.getAffordableEntries(entries);
          let bestScore = -Infinity;
          const bestEntries = [];

          for (let i = 0; i < affordableEntries.length; i++) {
            const entry = affordableEntries[i];
            if (!this.isValidEntry(entry)) continue;
            const score = this.getCounterScore(entry.unitType, targetWave.unitType);

            if (!this.isRealCounterScore(score)) {
              continue;
            }

            if (score > bestScore) {
              bestScore = score;
              bestEntries.length = 0;
              bestEntries.push(entry);
            } else if (Math.abs(score - bestScore) < 0.0001) {
              bestEntries.push(entry);
            }
          }

          if (bestEntries.length <= 0) {
            return null;
          }

          const index = Math.floor(Math.random() * bestEntries.length);
          return bestEntries[index];
        }

        getAffordableEntries(entries) {
          const result = [];
          if (!this.gameManager) return result;

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.isValidEntry(entry)) continue;

            if (!this.gameManager.canAffordEntry(this.team, entry)) {
              continue;
            }

            result.push(entry);
          }

          return result;
        }

        getRandomAffordableEntry(entries) {
          const affordable = this.getAffordableEntries(entries);

          if (affordable.length <= 0) {
            return null;
          }

          const index = Math.floor(Math.random() * affordable.length);
          return affordable[index];
        }

        getCheapestAffordableEntry(entries) {
          if (!this.gameManager) return null;
          let best = null;
          let bestCost = Infinity;

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.isValidEntry(entry)) continue;

            if (!this.gameManager.canAffordEntry(this.team, entry)) {
              continue;
            }

            const cost = Math.max(0, entry.combatPointCost);

            if (cost < bestCost) {
              bestCost = cost;
              best = entry;
            }
          }

          return best;
        }

        getFastestAffordableEntry(entries) {
          if (!this.gameManager) return null;
          let best = null;
          let bestSpeed = -Infinity;
          let bestCost = Infinity;

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.isValidEntry(entry)) continue;

            if (!this.gameManager.canAffordEntry(this.team, entry)) {
              continue;
            }

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

        getAggressiveForwardRaidLane(lanePressure) {
          if (!this.gameManager) return -1;
          const laneCount = this.gameManager.getSafeLaneCount();
          let bestLane = -1;
          let bestScore = -Infinity;

          for (let lane = 0; lane < laneCount; lane++) {
            const info = lanePressure[lane];
            if (!info) continue;
            if (info.enemyCount > 0) continue;
            if (info.allyCount > 0) continue;
            let score = Math.random() * 0.001;
            score -= info.allyDefense;

            if (score > bestScore) {
              bestScore = score;
              bestLane = lane;
            }
          }

          return bestLane;
        }

        canSpawnMoreWave() {
          if (!this.enableMaxAliveWaveLimit) {
            return true;
          }

          const max = Math.max(1, Math.floor(this.maxAliveWaves));
          const alive = this.getAliveWaveCount(this.team);
          return alive < max;
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
          const waves = this.gameManager.waves;
          let count = 0;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDead()) continue;
            count++;
          }

          return count;
        }

        spawnOpeningWave(validEntries) {
          if (!this.gameManager) return;
          if (!this.canSpawnMoreWave()) return;
          const opening = this.getRandomAffordableEntry(validEntries);
          if (!opening) return;
          this.gameManager.spawnWaveByEntry(this.team, opening, -1, this.shouldSpawnAggressiveForward());
        }

        spawnRandom(validEntries, reason) {
          if (!this.gameManager) return;
          if (!this.canSpawnMoreWave()) return;
          const randomEntry = this.getRandomAffordableEntry(validEntries);
          if (!randomEntry) return;
          this.debugLog(`${reason}. Random spawn: ${randomEntry.name}`);
          this.gameManager.spawnWaveByEntry(this.team, randomEntry, -1, this.shouldSpawnAggressiveForward());
        }

        getCounterSpawnLaneId(targetWave, lanePressure) {
          if (!this.gameManager) {
            return targetWave.laneId;
          }

          const laneCount = this.gameManager.getSafeLaneCount();

          if (laneCount <= 1) {
            return 0;
          }

          const targetLane = this.gameManager.clampLaneId(targetWave.laneId);
          const sameLaneChance = this.clamp(this.counterSameLaneChance, 0, 1);
          const targetInfo = lanePressure[targetLane];
          const targetUndefended = !!targetInfo && targetInfo.enemyCount > 0 && targetInfo.allyCount <= 0;
          const adjustedSameLaneChance = this.clamp(sameLaneChance + this.getLaneAwareness() * (targetUndefended ? 0.2 : 0), 0, 1);

          if (Math.random() <= adjustedSameLaneChance) {
            return targetLane;
          }

          const neighborLanes = [];
          const leftLane = targetLane - 1;
          const rightLane = targetLane + 1;

          if (leftLane >= 0) {
            neighborLanes.push(leftLane);
          }

          if (rightLane < laneCount) {
            neighborLanes.push(rightLane);
          }

          if (neighborLanes.length <= 0) {
            return targetLane;
          }

          return this.chooseSupportLane(neighborLanes, lanePressure);
        }

        chooseSupportLane(lanes, lanePressure) {
          if (lanes.length <= 0) {
            return 0;
          }

          if (this.getLaneAwareness() <= 0) {
            const index = Math.floor(Math.random() * lanes.length);
            return lanes[index];
          }

          let bestLane = lanes[0];
          let bestScore = -Infinity;

          for (let i = 0; i < lanes.length; i++) {
            const lane = lanes[i];
            const info = lanePressure[lane];
            let score = Math.random() * 0.001;

            if (info) {
              score += Math.max(0, info.enemyThreat - info.allyDefense);

              if (info.enemyCount > 0 && info.allyCount <= 0) {
                score += 35;
              }
            }

            if (score > bestScore) {
              bestScore = score;
              bestLane = lane;
            }
          }

          return bestLane;
        }

        getCounterScore(attackerType, defenderType) {
          const counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;

          if (!counter) {
            return 1;
          }

          return counter.getCounterScore(attackerType, defenderType);
        }

        isRealCounterScore(score) {
          return score > 1.0001;
        }

        getDefendPoint() {
          if (!this.gameManager) {
            return {
              x: 0,
              z: 0
            };
          }

          const hero = this.team === 0 ? this.gameManager.teamAHero : this.gameManager.teamBHero;

          if (hero && hero.agent) {
            return {
              x: hero.agent.pos.x,
              z: hero.agent.pos.z
            };
          }

          return {
            x: 0,
            z: this.team === 0 ? this.gameManager.teamASpawnZ : this.gameManager.teamBSpawnZ
          };
        }

        getAIIntelligence() {
          return this.clamp(this.aiIntelligence, 0, 1);
        }

        getFastReactChance() {
          return this.clamp(this.fastReactChance, 0, 1);
        }

        getLaneAwareness() {
          return this.clamp(this.laneAwareness, 0, 1);
        }

        getModeLogName() {
          return this.hasReachedMaxAliveWavesOnce ? 'ATTACK' : 'ATTACK_EARLY_AGGRESSIVE_SPAWN';
        }

        randomizeNextInterval() {
          const min = Math.max(0.1, this.minSpawnInterval);
          const max = Math.max(min, this.maxSpawnInterval);
          this.nextInterval = min + Math.random() * (max - min);
        }

        registerWaveSpawnEvent() {
          this.unregisterWaveSpawnEvent();
          const manager = this.gameManager;
          if (!manager || !manager.node) return;
          this.registeredGameManager = manager;
          manager.node.on(BattleWaveSpawnedEvent, this.onBattleWaveSpawned, this);
        }

        unregisterWaveSpawnEvent() {
          const manager = this.registeredGameManager;

          if (manager && manager.node) {
            manager.node.off(BattleWaveSpawnedEvent, this.onBattleWaveSpawned, this);
          }

          this.registeredGameManager = null;
        }

        getValidEntries(entries) {
          const valid = [];

          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (!this.isValidEntry(entry)) continue;
            valid.push(entry);
          }

          return valid;
        }

        isValidEntry(entry) {
          if (!entry) return false;
          if (!entry.name) return false;
          if (!entry.prefab) return false;
          if (Math.floor(entry.unitCount) <= 0) return false;
          return true;
        }

        clamp(v, min, max) {
          return Math.max(min, Math.min(max, v));
        }

        stateLog(message) {
          if (!this.enableStateLog) return;
          console.log(`[ArmyBrain State T${this.team}] ${message}`);
        }

        debugLog(message) {
          if (!this.enableDebugLog) return;
          console.log(`[ArmyBrain Debug T${this.team}] ${message}`);
        }

        aggressiveForwardLog(message) {
          if (!this.enableAggressiveForwardLog) return;
          console.log(`[ArmyBrain AggressiveForward T${this.team}] ${message}`);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "team", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "runOnlyWhenGameManagerAutoSpawnOff", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "minSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5.0;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "fastReactChance", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "maxBrainDeltaTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "enableMaxAliveWaveLimit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWaves", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 7;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "preferUnengagedWaveInAttack", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "ignoreNearlyDeadWaveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "attackCounterCoverageRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "counterSameLaneChance", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.75;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "laneAwareness", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "aggressiveForwardChance", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "aiIntelligence", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "spawnRandomIfNoThreat", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "spawnOpeningWaveIfNoEnemyWave", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "enableStateLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "enableAggressiveForwardLog", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=222aa64d7ed99730041b42d660d662a94eee6def.js.map