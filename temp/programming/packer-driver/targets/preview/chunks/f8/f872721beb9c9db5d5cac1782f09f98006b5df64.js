System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, sys, GameManager, BattleArmyBrain, UnitFamily, unitFamilyToName, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _class4, _class5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _crd, ccclass, property, UnitProgressionRule, LevelSettings;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function createUnitProgressionRule(family, unlockLevel, unlockCount, maxCount) {
    var rule = new UnitProgressionRule();
    rule.family = family;
    rule.unlockLevel = unlockLevel;
    rule.unlockCount = unlockCount;
    rule.maxCount = maxCount;
    return rule;
  }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleProgressionProvider(extras) {
    _reporterNs.report("BattleProgressionProvider", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleArmyBrain(extras) {
    _reporterNs.report("BattleArmyBrain", "./BattleArmyBrain", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfunitFamilyToName(extras) {
    _reporterNs.report("unitFamilyToName", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitPrefabEntry(extras) {
    _reporterNs.report("UnitPrefabEntry", "./BattleUnitDatabase", _context.meta, extras);
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
      director = _cc.director;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      BattleArmyBrain = _unresolved_3.BattleArmyBrain;
    }, function (_unresolved_4) {
      UnitFamily = _unresolved_4.UnitFamily;
      unitFamilyToName = _unresolved_4.unitFamilyToName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8d731TSPExBjqJd6aUC3OR6", "LevelSettings", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'sys']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitProgressionRule", UnitProgressionRule = (_dec = ccclass('UnitProgressionRule'), _dec2 = property({
        type: _crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
          error: Error()
        }), UnitFamily) : UnitFamily
      }), _dec3 = property({
        min: 1,
        max: 3,
        step: 1
      }), _dec4 = property({
        min: 1,
        step: 1
      }), _dec5 = property({
        min: 1,
        step: 1
      }), _dec6 = property({
        min: 1,
        step: 1
      }), _dec(_class = (_class2 = class UnitProgressionRule {
        constructor() {
          _initializerDefineProperty(this, "family", _descriptor, this);

          _initializerDefineProperty(this, "tier", _descriptor2, this);

          _initializerDefineProperty(this, "unlockLevel", _descriptor3, this);

          _initializerDefineProperty(this, "unlockCount", _descriptor4, this);

          _initializerDefineProperty(this, "maxCount", _descriptor5, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "family", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tier", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "unlockLevel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "unlockCount", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "maxCount", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      })), _class2)) || _class));

      _export("LevelSettings", LevelSettings = (_dec7 = ccclass('LevelSettings'), _dec8 = property({
        tooltip: 'Total campaign levels used to normalize difficulty from level 1 to the final level.'
      }), _dec9 = property({
        min: 1,
        step: 1,
        displayName: 'Progression End Level',
        tooltip: 'Level where base CP, accuracy, Max Alive, unit unlocks, and unit counts finish progressing. Later levels keep these base caps while boss multipliers still apply.'
      }), _dec10 = property({
        tooltip: 'Current campaign level. Level 1 is easiest; Total Levels is hardest.'
      }), _dec11 = property({
        min: 0,
        step: 1,
        tooltip: 'Every Nth level is a boss fight. Use 0 to disable boss fights.'
      }), _dec12 = property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Initial CP Multiplier',
        tooltip: 'Multiplier applied only to enemy Initial CP on boss levels. Initial CP is not capped.'
      }), _dec13 = property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Decision Accuracy Multiplier',
        tooltip: 'Multiplier applied only to enemy Decision Accuracy on boss levels. The result remains capped by Decision Accuracy Max.'
      }), _dec14 = property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Max Alive Waves Multiplier',
        tooltip: 'Multiplier applied only to enemy Max Alive Waves on boss levels. The result remains capped by Max Alive Waves Max.'
      }), _dec15 = property({
        tooltip: 'Team affected by the automatic CP, accuracy, and Max Alive curves.'
      }), _dec16 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec17 = property({
        type: [_crd && BattleArmyBrain === void 0 ? (_reportPossibleCrUseOfBattleArmyBrain({
          error: Error()
        }), BattleArmyBrain) : BattleArmyBrain]
      }), _dec18 = property({
        tooltip: 'Apply initial Combat Point curve to the selected team.'
      }), _dec19 = property({
        tooltip: 'Apply the AI decision accuracy curve. Accuracy affects unit choice only; target and lane selection stay tactical.'
      }), _dec20 = property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at level 1.'
      }), _dec21 = property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at the final level.'
      }), _dec22 = property({
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
      }), _dec23 = property({
        displayName: 'Easy Spawn Delay Min'
      }), _dec24 = property({
        displayName: 'Easy Spawn Delay Max'
      }), _dec25 = property({
        displayName: 'Hard Spawn Delay Min'
      }), _dec26 = property({
        displayName: 'Hard Spawn Delay Max'
      }), _dec27 = property({
        tooltip: 'Apply Max Alive Waves curve. Higher levels allow the enemy to keep more waves active.'
      }), _dec28 = property({
        displayName: 'Enable Campaign Progression',
        tooltip: 'Apply unit unlocks, enemy unit-count growth, player gold, purchases, persistence, and retry rewards.'
      }), _dec29 = property({
        tooltip: 'Reload browser preview after each campaign battle. A win advances one level; a loss retries the same level.'
      }), _dec30 = property({
        tooltip: 'Let BattleArmyBrain A simulate player purchases between battles. It may buy multiple affordable packages.'
      }), _dec31 = property({
        tooltip: 'Persistent campaign storage key. Opening currentLevel=1 starts a fresh run; use resetProgression=1 to force reset even from a resume URL.'
      }), _dec32 = property({
        min: 0,
        step: 1
      }), _dec33 = property({
        min: 0,
        step: 1
      }), _dec34 = property({
        min: 0,
        step: 1
      }), _dec35 = property({
        min: 0,
        step: 1
      }), _dec36 = property({
        min: 0.01,
        step: 0.1
      }), _dec37 = property({
        min: 0,
        max: 1,
        step: 0.05
      }), _dec38 = property({
        min: 0,
        max: 1,
        step: 0.05
      }), _dec39 = property({
        min: 1,
        step: 1
      }), _dec40 = property({
        min: 1,
        step: 1
      }), _dec41 = property({
        min: 0.01,
        step: 0.1
      }), _dec42 = property({
        min: 1,
        step: 1
      }), _dec43 = property({
        type: [UnitProgressionRule]
      }), _dec7(_class4 = (_class5 = class LevelSettings extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "totalLevels", _descriptor6, this);

          _initializerDefineProperty(this, "progressionEndLevel", _descriptor7, this);

          _initializerDefineProperty(this, "currentLevel", _descriptor8, this);

          _initializerDefineProperty(this, "bossStagePace", _descriptor9, this);

          _initializerDefineProperty(this, "bossInitialCombatPointMultiplier", _descriptor10, this);

          _initializerDefineProperty(this, "bossDecisionAccuracyMultiplier", _descriptor11, this);

          _initializerDefineProperty(this, "bossMaxAliveWavesMultiplier", _descriptor12, this);

          _initializerDefineProperty(this, "targetTeam", _descriptor13, this);

          _initializerDefineProperty(this, "gameManager", _descriptor14, this);

          _initializerDefineProperty(this, "battleArmyBrains", _descriptor15, this);

          _initializerDefineProperty(this, "allowCP", _descriptor16, this);

          _initializerDefineProperty(this, "initialCombatPointMin", _descriptor17, this);

          _initializerDefineProperty(this, "initialCombatPointMax", _descriptor18, this);

          _initializerDefineProperty(this, "allowDecisionAccuracy", _descriptor19, this);

          _initializerDefineProperty(this, "decisionAccuracyMin", _descriptor20, this);

          _initializerDefineProperty(this, "decisionAccuracyMax", _descriptor21, this);

          _initializerDefineProperty(this, "allowInterval", _descriptor22, this);

          _initializerDefineProperty(this, "minSpawnIntervalMinLevel", _descriptor23, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMinLevel", _descriptor24, this);

          _initializerDefineProperty(this, "minSpawnIntervalMaxLevel", _descriptor25, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMaxLevel", _descriptor26, this);

          _initializerDefineProperty(this, "allowMaxWave", _descriptor27, this);

          _initializerDefineProperty(this, "maxAliveWavesMin", _descriptor28, this);

          _initializerDefineProperty(this, "maxAliveWavesMax", _descriptor29, this);

          _initializerDefineProperty(this, "enableProgression", _descriptor30, this);

          _initializerDefineProperty(this, "autoReloadProgression", _descriptor31, this);

          _initializerDefineProperty(this, "purchasingSimulation", _descriptor32, this);

          _initializerDefineProperty(this, "progressionStorageKey", _descriptor33, this);

          _initializerDefineProperty(this, "initialPlayerGold", _descriptor34, this);

          _initializerDefineProperty(this, "playerInitialCPStart", _descriptor35, this);

          _initializerDefineProperty(this, "playerMaxAliveStart", _descriptor36, this);

          _initializerDefineProperty(this, "playerMaxAliveMax", _descriptor37, this);

          _initializerDefineProperty(this, "winGoldPerEnemyCP", _descriptor38, this);

          _initializerDefineProperty(this, "lossGoldRatio", _descriptor39, this);

          _initializerDefineProperty(this, "maxLossGoldRatioPerLevel", _descriptor40, this);

          _initializerDefineProperty(this, "lossesPerVideoReward", _descriptor41, this);

          _initializerDefineProperty(this, "unitUnlockCostMultiplier", _descriptor42, this);

          _initializerDefineProperty(this, "initialCPGoldPerPoint", _descriptor43, this);

          _initializerDefineProperty(this, "maxAliveBasePrice", _descriptor44, this);

          _initializerDefineProperty(this, "unitProgressionRules", _descriptor45, this);

          this.progressionState = null;
          this.battleLevel = 1;
          this.nextBattleUrl = '';
          this.levelQueryActive = false;
          this.resetProgressionRequested = false;
          this.preBattlePurchases = [];
        }

        onLoad() {
          this.applyTelemetryLevelQuery();

          if (this.resetProgressionRequested) {
            this.clearProgressionStorage();
          }

          var manager = this.getGameManager();

          if (manager) {
            manager.battleProgressionProvider = this;
          }

          if (this.enableProgression) {
            this.initializeProgression();
          }

          this.applyLevelSettings();

          if (this.enableProgression) {
            this.completePreBattleProgression();
          }
        }

        onDestroy() {
          var manager = this.getGameManager();

          if (manager && manager.battleProgressionProvider === this) {
            manager.battleProgressionProvider = null;
          }
        }

        applyLevelSettings() {
          var team = this.clampTeam(this.targetTeam);
          var t = this.getDifficulty01();
          var boss = this.isBossLevel();
          var manager = this.getGameManager();
          var brains = this.getTargetBattleArmyBrains(team);

          if (this.allowCP && manager && manager.unitDatabase) {
            var cp = this.getLevelInitialCP(this.getSafeCurrentLevel());

            if (team === 0) {
              manager.unitDatabase.teamAInitialCombatPoint = cp;
            } else {
              manager.unitDatabase.teamBInitialCombatPoint = cp;
            }

            manager.initialCombatPoint[team] = cp;
            manager.combatPoint[team] = cp;
          }

          for (var i = 0; i < brains.length; i++) {
            var brain = brains[i];
            if (!brain) continue;

            if (this.allowDecisionAccuracy) {
              var baseAccuracy = this.lerp(this.decisionAccuracyMin, this.decisionAccuracyMax, t);
              brain.decisionAccuracy = Math.min(this.clamp01(this.decisionAccuracyMax), this.clamp01(baseAccuracy * this.getBossMultiplier(this.bossDecisionAccuracyMultiplier, boss)));
            }

            if (this.allowInterval) {
              brain.minSpawnInterval = this.lerp(this.minSpawnIntervalMinLevel, this.minSpawnIntervalMaxLevel, t);
              brain.maxSpawnInterval = this.lerp(this.maxSpawnIntervalMinLevel, this.maxSpawnIntervalMaxLevel, t);
            }

            if (this.allowMaxWave) {
              var baseMaxAlive = this.getLevelBaseMaxAlive(this.getSafeCurrentLevel());
              brain.maxAliveWaves = Math.round(Math.min(Math.max(0, this.maxAliveWavesMax), baseMaxAlive * this.getBossMultiplier(this.bossMaxAliveWavesMultiplier, boss)));
            }
          }
        }

        handleBattleResult(winnerTeam, loserTeam, reason) {
          if (!this.enableProgression || !this.progressionState) {
            return null;
          }

          var state = this.progressionState;
          var battleLevel = this.battleLevel;
          var before = this.createTelemetrySnapshot();
          var purchases = [];
          var newlyOffered = this.offerIntroducedUnits(battleLevel);
          var manager = this.getGameManager();
          var enemyCP = manager ? Math.max(0, manager.initialCombatPoint[1]) : 0;
          var winGold = Math.max(0, Math.round(enemyCP * Math.max(0, this.winGoldPerEnemyCP)));
          var goldReward = 0;
          var rescueCP = 0;
          var rescueMaxAlive = 0;
          var videoRewardTriggered = false;
          var rescueActions = [];
          var validPlayerLoss = loserTeam === 0 && this.isValidPlayerLoss(reason);

          if (winnerTeam === 0) {
            goldReward = winGold;
            state.playerGold += goldReward;
            state.levelLossCount = 0;
            state.lossGoldLevel = 0;
            state.lossGoldClaimed = 0;
          } else if (loserTeam === 0) {
            state.levelLossCount++;

            if (validPlayerLoss) {
              goldReward = this.grantCappedLossGold(state, battleLevel, winGold);
            }

            if (this.purchasingSimulation && state.levelLossCount >= Math.max(1, Math.floor(this.lossesPerVideoReward))) {
              var rescue = this.applyVideoRescue(purchases);

              if (rescue) {
                var rescueDelta = Math.max(0, rescue.valueAfter - rescue.valueBefore);

                if (rescue.kind === 'initial-cp') {
                  rescueCP = rescueDelta;
                } else if (rescue.kind === 'max-alive') {
                  rescueMaxAlive = rescueDelta;
                }

                state.adsReward++;
                state.levelLossCount = 0;
                videoRewardTriggered = true;
                rescueActions = [rescue.id];
              }
            }
          }

          if (this.purchasingSimulation) {
            this.runPurchaseSimulation(purchases, 'between-battles');
          }

          var campaignComplete = false;

          if (winnerTeam === 0) {
            if (battleLevel >= this.getSafeTotalLevels()) {
              campaignComplete = true;
              state.currentLevel = this.getSafeTotalLevels();
            } else {
              state.currentLevel = battleLevel + 1;
            }
          } else {
            state.currentLevel = battleLevel;
          }

          this.currentLevel = state.currentLevel;
          this.applyProgressionRuntimeState(false);
          this.saveProgressionState();
          this.nextBattleUrl = campaignComplete ? '' : this.buildProgressionUrl(state.currentLevel);
          var result = {
            battleLevel,
            totalLevels: this.getSafeTotalLevels(),
            winnerTeam,
            loserTeam,
            reason,
            campaignComplete,
            winGold,
            goldReward,
            validPlayerLoss,
            rescueCP,
            rescueMaxAlive,
            videoRewardTriggered,
            rescueActions,
            newlyOffered,
            purchases,
            before,
            after: this.createTelemetrySnapshot()
          };
          return result;
        }

        createTelemetrySnapshot() {
          if (!this.enableProgression || !this.progressionState) {
            return {
              enabled: false
            };
          }

          var state = this.progressionState;
          var manager = this.getGameManager();
          var enemyBrain = this.getFirstBrainForTeam(1);
          var playerBrain = this.getFirstBrainForTeam(0);
          return {
            enabled: true,
            storageVersion: state.version,
            currentLevel: state.currentLevel,
            battleLevel: this.battleLevel,
            totalLevels: this.getSafeTotalLevels(),
            isBossLevel: this.isBossLevelFor(this.battleLevel),
            purchasingSimulation: this.purchasingSimulation,
            settings: {
              progressionEndLevel: this.getProgressionEndLevel(),
              progression01: this.getProgression01(this.battleLevel),
              playerInitialCPStart: this.getPlayerCPStart(),
              playerInitialCPMilestoneCap: this.getPlayerCPMilestoneCap(this.battleLevel),
              playerCPPackagesOffered: this.getPlayerCPPackagesOffered(this.battleLevel),
              nextPlayerCPPackage: this.getNextPlayerCPPackageSnapshot(state, this.battleLevel),
              unitProgressionEndLevel: this.getUnitProgressionEndLevel(),
              playerMaxAliveStart: this.getPlayerMaxAliveStart(),
              playerMaxAliveMax: this.getPlayerMaxAliveMax(),
              playerMaxAliveMilestoneCap: this.getPlayerMaxAliveMilestoneCap(this.battleLevel),
              playerMaxAlivePackagesOffered: this.getPlayerMaxAlivePackagesOffered(this.battleLevel),
              nextPlayerMaxAlivePackage: this.getNextPlayerMaxAlivePackageSnapshot(state, this.battleLevel),
              winGoldPerEnemyCP: this.winGoldPerEnemyCP,
              lossGoldRatio: this.lossGoldRatio,
              maxLossGoldRatioPerLevel: this.maxLossGoldRatioPerLevel,
              lossesPerVideoReward: this.lossesPerVideoReward,
              unitUnlockCostMultiplier: this.unitUnlockCostMultiplier,
              initialCPGoldPerPoint: this.initialCPGoldPerPoint,
              maxAliveBasePrice: this.maxAliveBasePrice
            },
            preBattlePurchases: this.preBattlePurchases.slice(),
            player: {
              gold: state.playerGold,
              adsReward: state.adsReward,
              levelLossCount: state.levelLossCount,
              lossGoldClaimed: state.lossGoldClaimed,
              initialCP: state.playerInitialCP,
              cpPackagesPurchased: state.cpPackages.filter(item => item.claimed).length,
              cpPackagesOffered: this.getPlayerCPPackagesOffered(this.battleLevel),
              cpPackageSchedule: state.cpPackages.map(item => _extends({}, item)),
              initialCPOverflow: state.playerInitialCPOverflow,
              rescueHistory: state.rescueHistory.slice(),
              maxAlive: state.playerMaxAlive,
              maxAlivePackagesPurchased: state.maxAlivePackages.filter(item => item.claimed).length,
              maxAlivePackagesOffered: this.getPlayerMaxAlivePackagesOffered(this.battleLevel),
              maxAlivePackageSchedule: state.maxAlivePackages.map(item => _extends({}, item)),
              decisionAccuracy: playerBrain ? playerBrain.decisionAccuracy : null,
              totalPurchases: state.totalPurchases
            },
            enemy: {
              initialCP: manager ? manager.initialCombatPoint[1] : null,
              maxAlive: enemyBrain ? enemyBrain.maxAliveWaves : null,
              decisionAccuracy: enemyBrain ? enemyBrain.decisionAccuracy : null
            },
            units: this.createUnitProgressionSnapshot(),
            availablePurchases: this.getPurchaseOptions(state).map(option => ({
              id: option.id,
              kind: option.kind,
              label: option.label,
              cost: option.cost,
              affordable: option.cost <= state.playerGold
            }))
          };
        }

        shouldAutoReloadAfterBattle() {
          return this.enableProgression && this.autoReloadProgression;
        }

        getNextBattleUrl() {
          return this.nextBattleUrl;
        }

        initializeProgression() {
          var loaded = this.loadProgressionState();
          this.progressionState = loaded ? this.sanitizeProgressionState(loaded) : this.createInitialProgressionState();

          if (this.levelQueryActive) {
            this.progressionState.currentLevel = this.getSafeCurrentLevel();
          } else {
            this.currentLevel = this.clampLevel(this.progressionState.currentLevel);
          }

          this.battleLevel = this.getSafeCurrentLevel();
          this.progressionState.currentLevel = this.battleLevel;

          if (this.progressionState.lossGoldLevel !== this.battleLevel) {
            this.progressionState.lossGoldLevel = this.battleLevel;
            this.progressionState.lossGoldClaimed = 0;
            this.progressionState.levelLossCount = 0;
          }

          this.offerUnitsFromEarlierLevels(this.battleLevel);
          this.applyProgressionRuntimeState(true);
          this.saveProgressionState();
        }

        completePreBattleProgression() {
          if (!this.progressionState) return;

          if (this.purchasingSimulation) {
            this.runPurchaseSimulation(this.preBattlePurchases, 'pre-battle');
          }

          this.applyProgressionRuntimeState(true);
          this.saveProgressionState();
        }

        createInitialProgressionState() {
          var units = [];

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var startsOwned = Math.floor(rule.unlockLevel) <= 1;
            units.push({
              key: this.getRuleKey(rule),
              offered: startsOwned,
              unlocked: startsOwned,
              unitCount: this.getRuleUnlockCount(rule)
            });
          }

          return {
            version: 5,
            currentLevel: this.getSafeCurrentLevel(),
            playerGold: Math.max(0, Math.floor(this.initialPlayerGold)),
            adsReward: 0,
            levelLossCount: 0,
            lossGoldLevel: this.getSafeCurrentLevel(),
            lossGoldClaimed: 0,
            playerInitialCP: this.getPlayerCPStart(),
            playerInitialCPOverflow: 0,
            cpPackages: this.createCPPackageSchedule(),
            maxAlivePackages: this.createMaxAlivePackageSchedule(),
            rescueHistory: [],
            playerMaxAlive: this.getPlayerMaxAliveStart(),
            totalPurchases: 0,
            units
          };
        }

        sanitizeProgressionState(source) {
          var _this = this;

          var initial = this.createInitialProgressionState();

          if (this.safeInteger(source.version, 0) !== 5) {
            return initial;
          }

          var savedUnits = Array.isArray(source.units) ? source.units : [];
          var savedCPPackages = Array.isArray(source.cpPackages) ? source.cpPackages : [];
          var savedMaxAlivePackages = Array.isArray(source.maxAlivePackages) ? source.maxAlivePackages : [];
          initial.currentLevel = this.clampLevel(this.safeInteger(source.currentLevel, initial.currentLevel));
          initial.playerGold = Math.max(0, this.safeInteger(source.playerGold, 0));
          initial.adsReward = Math.max(0, this.safeInteger(source.adsReward, 0));
          initial.levelLossCount = Math.max(0, this.safeInteger(source.levelLossCount, 0));
          initial.lossGoldLevel = this.clampLevel(this.safeInteger(source.lossGoldLevel, initial.currentLevel));
          initial.lossGoldClaimed = Math.max(0, this.safeInteger(source.lossGoldClaimed, 0));
          initial.playerInitialCPOverflow = Math.max(0, this.safeInteger(source.playerInitialCPOverflow, 0));

          var _loop = function _loop() {
            var item = initial.cpPackages[i];
            var saved = savedCPPackages.find(candidate => candidate && candidate.id === item.id);
            if (!saved) return 1; // continue

            item.claimed = !!saved.claimed;
            item.claimSource = item.claimed && typeof saved.claimSource === 'string' ? saved.claimSource : '';
          };

          for (var i = 0; i < initial.cpPackages.length; i++) {
            if (_loop()) continue;
          }

          var _loop2 = function _loop2() {
            var item = initial.maxAlivePackages[_i];
            var saved = savedMaxAlivePackages.find(candidate => candidate && candidate.id === item.id);
            if (!saved) return 1; // continue

            item.claimed = !!saved.claimed;
            item.claimSource = item.claimed && typeof saved.claimSource === 'string' ? saved.claimSource : '';
          };

          for (var _i = 0; _i < initial.maxAlivePackages.length; _i++) {
            if (_loop2()) continue;
          }

          initial.rescueHistory = Array.isArray(source.rescueHistory) ? source.rescueHistory.filter(value => typeof value === 'string').slice() : [];
          initial.playerInitialCP = this.getPlayerCPFromState(initial);
          initial.playerMaxAlive = this.getPlayerMaxAliveFromState(initial);
          initial.totalPurchases = Math.max(0, this.safeInteger(source.totalPurchases, 0));

          var _loop3 = function _loop3() {
            var unit = initial.units[_i2];
            var saved = savedUnits.find(candidate => candidate && candidate.key === unit.key);

            var rule = _this.getRuleByKey(unit.key);

            if (!saved || !rule) return 1; // continue

            unit.offered = !!saved.offered || unit.offered;
            unit.unlocked = !!saved.unlocked || unit.unlocked;
            unit.unitCount = Math.max(_this.getRuleUnlockCount(rule), Math.min(_this.getRuleMaxCount(rule), _this.safeInteger(saved.unitCount, unit.unitCount)));
          };

          for (var _i2 = 0; _i2 < initial.units.length; _i2++) {
            if (_loop3()) continue;
          }

          return initial;
        }

        applyProgressionRuntimeState(syncCurrentCombatPoint) {
          if (!this.progressionState) return;
          var manager = this.getGameManager();
          if (!manager || !manager.unitDatabase) return;
          var state = this.progressionState;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var playerEntry = this.findEntryForRule(manager.unitDatabase.teamAUnits, rule);
            var enemyEntry = this.findEntryForRule(manager.unitDatabase.teamBUnits, rule);
            var playerUnit = this.getSavedUnit(state, this.getRuleKey(rule));

            if (playerEntry && playerUnit) {
              playerEntry.unlocked = playerUnit.unlocked;
              playerEntry.unitCount = playerUnit.unitCount;
            }

            if (enemyEntry) {
              enemyEntry.unlocked = this.battleLevel >= this.getRuleUnlockLevel(rule);
              enemyEntry.unitCount = this.getEnemyUnitCount(rule, this.battleLevel);
            }
          }

          manager.unitDatabase.teamAInitialCombatPoint = state.playerInitialCP;

          if (syncCurrentCombatPoint) {
            manager.initialCombatPoint[0] = state.playerInitialCP;
            manager.combatPoint[0] = state.playerInitialCP;
          }

          var playerBrains = this.getTargetBattleArmyBrains(0);

          for (var _i3 = 0; _i3 < playerBrains.length; _i3++) {
            playerBrains[_i3].maxAliveWaves = state.playerMaxAlive;
          }
        }

        getPurchaseOptions(state) {
          var options = [];
          var manager = this.getGameManager();

          if (!manager || !manager.unitDatabase) {
            return options;
          }

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var key = this.getRuleKey(rule);
            var saved = this.getSavedUnit(state, key);
            var entry = this.findEntryForRule(manager.unitDatabase.teamAUnits, rule);
            if (!saved || !entry) continue;
            var unlockPrice = this.getUnitUnlockPrice(entry);
            var familyName = (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
              error: Error()
            }), unitFamilyToName) : unitFamilyToName)(rule.family);

            if (saved.offered && !saved.unlocked) {
              options.push({
                id: "unlock:" + key,
                kind: 'unit-unlock',
                cost: unlockPrice,
                family: rule.family,
                tier: rule.tier,
                delta: 1,
                label: "Unlock " + familyName + " T" + rule.tier
              });
            }

            if (saved.unlocked && saved.unitCount < this.getPlayerUnitCountMilestoneCap(rule, this.battleLevel)) {
              options.push({
                id: "count:" + key,
                kind: 'unit-count',
                cost: Math.max(1, Math.round(unlockPrice / this.getRuleUnlockCount(rule))),
                family: rule.family,
                tier: rule.tier,
                delta: 1,
                label: "+1 " + familyName + " T" + rule.tier
              });
            }
          }

          var nextCPPackage = this.getNextAvailableCPPackage(state, this.battleLevel);

          if (nextCPPackage) {
            options.push({
              id: "initial-cp:" + nextCPPackage.id,
              kind: 'initial-cp',
              cost: Math.max(1, Math.round(nextCPPackage.delta * Math.max(0.01, this.initialCPGoldPerPoint))),
              family: null,
              tier: 0,
              delta: nextCPPackage.delta,
              label: "+" + nextCPPackage.delta + " Initial CP"
            });
          }

          var nextMaxAlivePackage = this.getNextAvailableMaxAlivePackage(state, this.battleLevel);

          if (nextMaxAlivePackage) {
            options.push({
              id: "max-alive:" + nextMaxAlivePackage.id,
              kind: 'max-alive',
              cost: Math.max(1, Math.round(Math.max(1, this.maxAliveBasePrice) * state.playerMaxAlive / Math.max(1, this.getPlayerMaxAliveStart()) * nextMaxAlivePackage.delta)),
              family: null,
              tier: 0,
              delta: nextMaxAlivePackage.delta,
              label: "+" + nextMaxAlivePackage.delta + " Max Alive"
            });
          }

          return options;
        }

        runPurchaseSimulation(records, source) {
          if (!this.progressionState) return;

          for (var iteration = 0; iteration < 100; iteration++) {
            var affordable = this.getPurchaseOptions(this.progressionState).filter(option => option.cost <= this.progressionState.playerGold);
            if (affordable.length <= 0) return;
            var selected = this.pickWeightedPurchase(affordable);
            if (!selected) return;
            records.push(this.applyPurchase(selected, this.progressionState, source));
          }
        }

        pickWeightedPurchase(options) {
          if (!this.progressionState) return null;
          var weights = [];
          var totalWeight = 0;

          for (var i = 0; i < options.length; i++) {
            var weight = Math.max(0.01, this.getPurchaseWeight(options[i]));
            weights.push(weight);
            totalWeight += weight;
          }

          var roll = Math.random() * totalWeight;

          for (var _i4 = 0; _i4 < options.length; _i4++) {
            roll -= weights[_i4];
            if (roll <= 0) return options[_i4];
          }

          return options[options.length - 1] || null;
        }

        getPurchaseWeight(option) {
          if (!this.progressionState) return 1;
          var state = this.progressionState;
          var enemyCP = this.getEnemyInitialCP();
          var enemyMaxAlive = this.getEnemyMaxAlive();

          if (option.kind === 'initial-cp') {
            var gap = Math.max(0, enemyCP - state.playerInitialCP);
            return 1 + gap / Math.max(1, option.delta);
          }

          if (option.kind === 'max-alive') {
            return 1 + Math.max(0, enemyMaxAlive - state.playerMaxAlive) * 2;
          }

          if (option.kind === 'unit-unlock') {
            var rule = option.family === null ? null : this.getRule(option.family, option.tier);
            var age = rule ? Math.max(0, this.battleLevel - this.getRuleUnlockLevel(rule)) : 0;
            return 3 + Math.min(3, age / 5);
          }

          if (option.kind === 'unit-count' && option.family !== null) {
            var _rule = this.getRule(option.family, option.tier);

            var saved = _rule ? this.getSavedUnit(state, this.getRuleKey(_rule)) : null;
            var enemyCount = _rule ? this.getEnemyUnitCount(_rule, this.battleLevel) : 0;
            return 1 + Math.max(0, enemyCount - (saved ? saved.unitCount : 0));
          }

          return 1;
        }

        applyVideoRescue(records) {
          if (!this.progressionState) return null;

          if (!this.isBossLevelFor(this.battleLevel)) {
            return null;
          }

          var state = this.progressionState;
          var currentCPCap = this.getPlayerCPMilestoneCap(this.battleLevel);
          var currentMaxAliveCap = this.getPlayerMaxAliveMilestoneCap(this.battleLevel);

          if (state.playerInitialCP < currentCPCap || state.playerMaxAlive < currentMaxAliveCap) {
            return null;
          }

          if (this.getNextAvailableCPPackage(state, this.battleLevel) || this.getNextAvailableMaxAlivePackage(state, this.battleLevel)) {
            return null;
          }

          var futureCPPackage = state.cpPackages.filter(item => !item.claimed && item.offerLevel > this.battleLevel).sort((a, b) => a.offerLevel - b.offerLevel || a.targetLevel - b.targetLevel || a.id.localeCompare(b.id))[0] || null;
          var futureMaxAlivePackage = state.maxAlivePackages.filter(item => !item.claimed && item.offerLevel > this.battleLevel).sort((a, b) => a.offerLevel - b.offerLevel || a.targetLevel - b.targetLevel || a.id.localeCompare(b.id))[0] || null;
          var enemyCP = this.getEnemyInitialCP();
          var enemyMaxAlive = this.getEnemyMaxAlive();
          var cpGapRatio = Math.max(0, enemyCP - state.playerInitialCP) / Math.max(1, enemyCP);
          var maxAliveGapRatio = Math.max(0, enemyMaxAlive - state.playerMaxAlive) / Math.max(1, enemyMaxAlive);
          var rescueKind = this.selectRescueKind(!!futureCPPackage || state.playerInitialCP < enemyCP, !!futureMaxAlivePackage, cpGapRatio, maxAliveGapRatio);
          var record = null;

          if (rescueKind === 'initial-cp' && futureCPPackage) {
            var valueBefore = state.playerInitialCP;
            futureCPPackage.claimed = true;
            futureCPPackage.claimSource = 'video-rescue';
            state.playerInitialCP = this.getPlayerCPFromState(state);
            record = this.createVideoRescueRecord("rescue:" + futureCPPackage.id, 'initial-cp', futureCPPackage.delta, valueBefore, state.playerInitialCP);
          } else if (rescueKind === 'max-alive' && futureMaxAlivePackage) {
            var _valueBefore = state.playerMaxAlive;
            futureMaxAlivePackage.claimed = true;
            futureMaxAlivePackage.claimSource = 'video-rescue';
            state.playerMaxAlive = this.getPlayerMaxAliveFromState(state);
            record = this.createVideoRescueRecord("rescue:" + futureMaxAlivePackage.id, 'max-alive', futureMaxAlivePackage.delta, _valueBefore, state.playerMaxAlive);
          } else if (state.playerInitialCP < enemyCP) {
            var _valueBefore2 = state.playerInitialCP;
            var delta = Math.min(this.getNearestCPPackageDelta(this.battleLevel), enemyCP - state.playerInitialCP);
            if (delta <= 0) return null;
            state.playerInitialCPOverflow += delta;
            state.playerInitialCP = this.getPlayerCPFromState(state);
            record = this.createVideoRescueRecord("rescue:overflow:" + this.battleLevel + ":" + ("" + (state.adsReward + 1)), 'initial-cp', delta, _valueBefore2, state.playerInitialCP);
          }

          if (!record) return null;
          state.rescueHistory.push(record.id);
          records.push(record);
          return record;
        }

        selectRescueKind(canRescueCP, canRescueMaxAlive, cpGapRatio, maxAliveGapRatio) {
          if (!canRescueCP && !canRescueMaxAlive) return null;
          if (!canRescueCP) return 'max-alive';
          if (!canRescueMaxAlive) return 'initial-cp';

          if (maxAliveGapRatio !== cpGapRatio) {
            return maxAliveGapRatio > cpGapRatio ? 'max-alive' : 'initial-cp';
          }

          return 'initial-cp';
        }

        createVideoRescueRecord(id, kind, delta, valueBefore, valueAfter) {
          return {
            id,
            kind,
            label: kind === 'initial-cp' ? "Video rescue +" + delta + " Initial CP" : "Video rescue +" + delta + " Max Alive",
            family: null,
            familyName: '',
            tier: 0,
            cost: 0,
            goldBefore: this.progressionState ? this.progressionState.playerGold : 0,
            goldAfter: this.progressionState ? this.progressionState.playerGold : 0,
            valueBefore,
            valueAfter,
            source: 'video-rescue'
          };
        }

        applyPurchase(option, state, source) {
          var goldBefore = state.playerGold;
          var valueBefore = this.getPurchaseValue(option, state);
          state.playerGold = Math.max(0, state.playerGold - option.cost);
          this.applyPurchaseToState(option, state);
          state.totalPurchases++;
          return {
            id: option.id,
            kind: option.kind,
            label: option.label,
            family: option.family,
            familyName: option.family === null ? '' : (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
              error: Error()
            }), unitFamilyToName) : unitFamilyToName)(option.family),
            tier: option.tier,
            cost: option.cost,
            goldBefore,
            goldAfter: state.playerGold,
            valueBefore,
            valueAfter: this.getPurchaseValue(option, state),
            source
          };
        }

        applyPurchaseToState(option, state) {
          if (option.kind === 'initial-cp') {
            var packageId = option.id.substring('initial-cp:'.length);
            var item = state.cpPackages.find(candidate => candidate.id === packageId);
            if (!item || item.claimed) return;
            item.claimed = true;
            item.claimSource = 'purchase';
            state.playerInitialCP = this.getPlayerCPFromState(state);
            return;
          }

          if (option.kind === 'max-alive') {
            var _packageId = option.id.substring('max-alive:'.length);

            var _item = state.maxAlivePackages.find(candidate => candidate.id === _packageId);

            if (!_item || _item.claimed) return;
            _item.claimed = true;
            _item.claimSource = 'purchase';
            state.playerMaxAlive = this.getPlayerMaxAliveFromState(state);
            return;
          }

          if (option.family === null) return;
          var rule = this.getRule(option.family, option.tier);
          if (!rule) return;
          var saved = this.getSavedUnit(state, this.getRuleKey(rule));
          if (!saved) return;

          if (option.kind === 'unit-unlock') {
            saved.unlocked = true;
            saved.unitCount = Math.max(saved.unitCount, this.getRuleUnlockCount(rule));
            return;
          }

          if (option.kind === 'unit-count') {
            saved.unitCount = Math.min(this.getRuleMaxCount(rule), saved.unitCount + option.delta);
          }
        }

        getPurchaseValue(option, state) {
          if (option.kind === 'initial-cp') {
            return state.playerInitialCP;
          }

          if (option.kind === 'max-alive') {
            return state.playerMaxAlive;
          }

          if (option.family === null) return 0;
          var rule = this.getRule(option.family, option.tier);
          var saved = rule ? this.getSavedUnit(state, this.getRuleKey(rule)) : null;
          if (!saved) return 0;
          return option.kind === 'unit-unlock' ? Number(saved.unlocked) : saved.unitCount;
        }

        grantCappedLossGold(state, level, winGold) {
          if (state.lossGoldLevel !== level) {
            state.lossGoldLevel = level;
            state.lossGoldClaimed = 0;
          }

          var cap = Math.max(0, Math.round(winGold * this.clamp01(this.maxLossGoldRatioPerLevel)));
          var requested = Math.max(0, Math.round(winGold * this.clamp01(this.lossGoldRatio)));
          var granted = Math.min(requested, Math.max(0, cap - state.lossGoldClaimed));
          state.lossGoldClaimed += granted;
          state.playerGold += granted;
          return granted;
        }

        isValidPlayerLoss(reason) {
          if (reason === 'team-eliminated-and-cannot-afford-spawn') {
            return true;
          }

          var manager = this.getGameManager();
          if (!manager) return false;
          return manager.getAliveNonHeroUnitCount(0) <= 0 && !manager.canTeamAffordAnySpawn(0);
        }

        offerIntroducedUnits(level) {
          if (!this.progressionState) return [];
          var result = [];

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;

            if (this.getRuleUnlockLevel(rule) > level) {
              continue;
            }

            var saved = this.getSavedUnit(this.progressionState, this.getRuleKey(rule));
            if (!saved || saved.offered) continue;
            saved.offered = true;
            result.push((_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
              error: Error()
            }), unitFamilyToName) : unitFamilyToName)(rule.family) + " T" + rule.tier);
          }

          return result;
        }

        offerUnitsFromEarlierLevels(level) {
          if (!this.progressionState) return;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;

            if (this.getRuleUnlockLevel(rule) >= level) {
              continue;
            }

            var saved = this.getSavedUnit(this.progressionState, this.getRuleKey(rule));
            if (saved) saved.offered = true;
          }
        }

        createUnitProgressionSnapshot() {
          if (!this.progressionState) return [];
          return this.unitProgressionRules.filter(rule => !!rule).map(rule => {
            var saved = this.getSavedUnit(this.progressionState, this.getRuleKey(rule));
            return {
              family: rule.family,
              familyName: (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
                error: Error()
              }), unitFamilyToName) : unitFamilyToName)(rule.family),
              tier: rule.tier,
              unlockLevel: this.getRuleUnlockLevel(rule),
              unlockCount: this.getRuleUnlockCount(rule),
              maxCount: this.getRuleMaxCount(rule),
              enemyUnlocked: this.battleLevel >= this.getRuleUnlockLevel(rule),
              enemyCount: this.getEnemyUnitCount(rule, this.battleLevel),
              playerOffered: saved ? saved.offered : false,
              playerUnlocked: saved ? saved.unlocked : false,
              playerCount: saved ? saved.unitCount : 0,
              playerCountMilestoneCap: this.getPlayerUnitCountMilestoneCap(rule, this.battleLevel)
            };
          });
        }

        getPlayerUnitCountMilestoneCap(rule, level) {
          return Math.min(this.getRuleMaxCount(rule), this.getEnemyUnitCount(rule, level));
        }

        getEnemyUnitCount(rule, level) {
          var unlockLevel = this.getRuleUnlockLevel(rule);
          var unlockCount = this.getRuleUnlockCount(rule);
          var maxCount = this.getRuleMaxCount(rule);
          var progressionEndLevel = this.getUnitProgressionEndLevel();
          if (maxCount <= unlockCount) return unlockCount;
          if (level >= progressionEndLevel) return maxCount;
          if (level <= unlockLevel) return unlockCount;
          var denominator = Math.max(1, progressionEndLevel - unlockLevel);
          var maturity = this.clamp01((level - unlockLevel) / denominator);
          return Math.round(this.lerp(unlockCount, maxCount, maturity));
        }

        getUnitUnlockPrice(entry) {
          return Math.max(1, Math.round(Math.max(0, entry.combatPointCost) * Math.max(1, this.unitUnlockCostMultiplier)));
        }

        getEnemyInitialCP() {
          var manager = this.getGameManager();
          return manager ? Math.max(0, manager.initialCombatPoint[1]) : 0;
        }

        getEnemyMaxAlive() {
          var brain = this.getFirstBrainForTeam(1);
          return brain ? Math.max(0, brain.maxAliveWaves) : 0;
        }

        getFirstBrainForTeam(team) {
          var brains = this.getTargetBattleArmyBrains(team);
          return brains.length > 0 ? brains[0] : null;
        }

        getGameManager() {
          if (this.gameManager) return this.gameManager;
          var scene = director.getScene();
          if (!scene) return null;
          var managers = scene.getComponentsInChildren(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager);
          return managers.length > 0 ? managers[0] : null;
        }

        getTargetBattleArmyBrains(team) {
          var result = [];

          for (var i = 0; i < this.battleArmyBrains.length; i++) {
            var brain = this.battleArmyBrains[i];
            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;
            result.push(brain);
          }

          if (result.length > 0) return result;
          var scene = director.getScene();
          if (!scene) return result;
          var brains = scene.getComponentsInChildren(_crd && BattleArmyBrain === void 0 ? (_reportPossibleCrUseOfBattleArmyBrain({
            error: Error()
          }), BattleArmyBrain) : BattleArmyBrain);

          for (var _i5 = 0; _i5 < brains.length; _i5++) {
            var _brain = brains[_i5];
            if (!_brain) continue;
            if (this.clampTeam(_brain.team) !== team) continue;
            result.push(_brain);
          }

          return result;
        }

        findEntryForRule(entries, rule) {
          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!entry) continue;
            if (entry.family !== rule.family) continue;

            if (Math.floor(entry.tier) !== Math.floor(rule.tier)) {
              continue;
            }

            return entry;
          }

          return null;
        }

        getRule(family, tier) {
          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            if (rule.family !== family) continue;

            if (Math.floor(rule.tier) !== Math.floor(tier)) {
              continue;
            }

            return rule;
          }

          return null;
        }

        getRuleByKey(key) {
          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];

            if (rule && this.getRuleKey(rule) === key) {
              return rule;
            }
          }

          return null;
        }

        getRuleKey(rule) {
          return rule.family + ":" + Math.max(1, Math.floor(rule.tier));
        }

        getSavedUnit(state, key) {
          for (var i = 0; i < state.units.length; i++) {
            if (state.units[i].key === key) {
              return state.units[i];
            }
          }

          return null;
        }

        getRuleUnlockLevel(rule) {
          return Math.min(this.getProgressionEndLevel(), this.clampLevel(rule.unlockLevel));
        }

        getRuleUnlockCount(rule) {
          return Math.max(1, Math.floor(rule.unlockCount));
        }

        getRuleMaxCount(rule) {
          return Math.max(this.getRuleUnlockCount(rule), Math.floor(rule.maxCount));
        }

        getPlayerCPStart() {
          return Math.max(0, Math.floor(this.playerInitialCPStart));
        }

        getPlayerCPMilestoneCap(level) {
          var schedule = this.progressionState ? this.progressionState.cpPackages : this.createCPPackageSchedule();
          return this.getPlayerCPStart() + schedule.filter(item => item.offerLevel <= this.clampLevel(level)).reduce((sum, item) => sum + item.delta, 0);
        }

        getPlayerCPPackagesOffered(level) {
          var schedule = this.progressionState ? this.progressionState.cpPackages : this.createCPPackageSchedule();
          var safeLevel = this.clampLevel(level);
          return schedule.filter(item => item.offerLevel <= safeLevel).length;
        }

        getNextAvailableCPPackage(state, level) {
          var safeLevel = this.clampLevel(level);
          return state.cpPackages.filter(item => !item.claimed && item.offerLevel <= safeLevel).sort((a, b) => a.offerLevel - b.offerLevel || a.targetLevel - b.targetLevel || a.id.localeCompare(b.id))[0] || null;
        }

        getPlayerCPFromState(state) {
          return this.getPlayerCPStart() + Math.max(0, state.playerInitialCPOverflow) + state.cpPackages.filter(item => item.claimed).reduce((sum, item) => sum + item.delta, 0);
        }

        createCPPackageSchedule() {
          var result = [];
          var milestones = this.getProgressionMilestoneLevels();
          var previousLevel = 0;
          var previousCap = this.getPlayerCPStart();

          for (var i = 0; i < milestones.length; i++) {
            var targetLevel = milestones[i];
            var targetCap = Math.max(previousCap, this.getLevelBaseInitialCP(targetLevel));
            var totalDelta = targetCap - previousCap;

            if (totalDelta <= 0) {
              previousLevel = targetLevel;
              previousCap = targetCap;
              continue;
            }

            var firstOfferLevel = previousLevel > 0 ? previousLevel + 1 : 1;
            var lastNormalLevel = targetLevel - 1;
            var candidateCount = Math.max(1, lastNormalLevel >= firstOfferLevel ? lastNormalLevel - firstOfferLevel + 1 : 1);
            var packageCount = Math.min(totalDelta, Math.max(1, Math.ceil(candidateCount / 2)));
            var offerLevels = this.pickDeterministicOfferLevels(firstOfferLevel, lastNormalLevel >= firstOfferLevel ? lastNormalLevel : targetLevel, packageCount, targetLevel, 'cp');
            var distributed = 0;

            for (var packageIndex = 0; packageIndex < packageCount; packageIndex++) {
              var cumulative = Math.round(totalDelta * (packageIndex + 1) / packageCount);
              var delta = cumulative - distributed;
              distributed = cumulative;
              result.push({
                id: "cp:" + targetLevel + ":" + (packageIndex + 1),
                targetLevel,
                offerLevel: offerLevels[packageIndex],
                delta,
                claimed: false,
                claimSource: ''
              });
            }

            previousLevel = targetLevel;
            previousCap = targetCap;
          }

          return result.sort((a, b) => a.offerLevel - b.offerLevel || a.targetLevel - b.targetLevel || a.id.localeCompare(b.id));
        }

        getProgressionMilestoneLevels() {
          var endLevel = this.getProgressionEndLevel();
          var pace = Math.max(0, Math.floor(this.bossStagePace));
          var result = [];

          if (pace > 0) {
            for (var level = pace; level <= endLevel; level += pace) {
              result.push(level);
            }
          }

          if (result.length <= 0 || result[result.length - 1] !== endLevel) {
            result.push(endLevel);
          }

          return result;
        }

        pickDeterministicOfferLevels(firstLevel, lastLevel, count, targetLevel, scheduleKey) {
          var candidates = [];

          for (var level = firstLevel; level <= lastLevel; level++) {
            candidates.push({
              level,
              order: this.stableHash(targetLevel + ":" + level + ":" + (scheduleKey + "-offer"))
            });
          }

          return candidates.sort((a, b) => a.order - b.order || a.level - b.level).slice(0, Math.min(count, candidates.length)).map(item => item.level).sort((a, b) => a - b);
        }

        stableHash(value) {
          var hash = 2166136261;

          for (var i = 0; i < value.length; i++) {
            hash ^= value.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
          }

          return hash >>> 0;
        }

        getNextPlayerCPPackageSnapshot(state, level) {
          var item = this.getNextAvailableCPPackage(state, level);
          return item ? _extends({}, item) : null;
        }

        getUnitProgressionEndLevel() {
          return this.getProgressionEndLevel();
        }

        getNearestCPPackageDelta(level) {
          var schedule = this.progressionState ? this.progressionState.cpPackages : this.createCPPackageSchedule();
          var nearest = schedule.filter(item => item.delta > 0).sort((a, b) => Math.abs(a.targetLevel - level) - Math.abs(b.targetLevel - level) || a.delta - b.delta)[0] || null;
          if (nearest) return nearest.delta;
          var pace = Math.max(1, Math.floor(this.bossStagePace) || 1);
          var previousLevel = Math.max(1, level - pace);
          var segmentGrowth = Math.max(1, this.getLevelBaseInitialCP(level) - this.getLevelBaseInitialCP(previousLevel));
          var normalLevels = Math.max(1, pace - 1);
          return Math.max(1, Math.round(segmentGrowth / Math.ceil(normalLevels / 2)));
        }

        getPlayerMaxAliveStart() {
          return Math.max(0, Math.floor(this.playerMaxAliveStart));
        }

        getPlayerMaxAliveMax() {
          return Math.max(this.getPlayerMaxAliveStart(), Math.floor(this.playerMaxAliveMax));
        }

        getPlayerMaxAliveMilestoneCap(level) {
          var schedule = this.progressionState ? this.progressionState.maxAlivePackages : this.createMaxAlivePackageSchedule();
          var safeLevel = this.clampLevel(level);
          var offeredDelta = schedule.filter(item => item.offerLevel <= safeLevel).reduce((sum, item) => sum + item.delta, 0);
          return this.clampPlayerMaxAlive(this.getPlayerMaxAliveStart() + offeredDelta);
        }

        getPlayerMaxAlivePackagesOffered(level) {
          var schedule = this.progressionState ? this.progressionState.maxAlivePackages : this.createMaxAlivePackageSchedule();
          var safeLevel = this.clampLevel(level);
          return schedule.filter(item => item.offerLevel <= safeLevel).length;
        }

        getNextAvailableMaxAlivePackage(state, level) {
          var safeLevel = this.clampLevel(level);
          return state.maxAlivePackages.filter(item => !item.claimed && item.offerLevel <= safeLevel).sort((a, b) => a.offerLevel - b.offerLevel || a.targetLevel - b.targetLevel || a.id.localeCompare(b.id))[0] || null;
        }

        getPlayerMaxAliveFromState(state) {
          var claimedDelta = state.maxAlivePackages.filter(item => item.claimed).reduce((sum, item) => sum + item.delta, 0);
          return this.clampPlayerMaxAlive(this.getPlayerMaxAliveStart() + claimedDelta);
        }

        createMaxAlivePackageSchedule() {
          var result = [];

          if (!this.allowMaxWave) {
            var delta = Math.max(0, this.getPlayerMaxAliveMax() - this.getPlayerMaxAliveStart());

            for (var i = 0; i < delta; i++) {
              result.push({
                id: "max-alive:1:" + (i + 1),
                targetLevel: 1,
                offerLevel: 1,
                delta: 1,
                claimed: false,
                claimSource: ''
              });
            }

            return result;
          }

          var milestones = this.getProgressionMilestoneLevels();
          var previousLevel = 0;
          var previousCap = this.getPlayerMaxAliveStart();

          for (var _i6 = 0; _i6 < milestones.length; _i6++) {
            var targetLevel = milestones[_i6];
            var targetCap = this.clampPlayerMaxAlive(Math.max(previousCap, this.getLevelBaseMaxAlive(targetLevel)));
            var totalDelta = targetCap - previousCap;

            if (totalDelta <= 0) {
              previousLevel = targetLevel;
              previousCap = targetCap;
              continue;
            }

            var firstOfferLevel = previousLevel > 0 ? previousLevel + 1 : 1;
            var lastNormalLevel = targetLevel - 1;
            var safeLastOfferLevel = lastNormalLevel >= firstOfferLevel ? lastNormalLevel : targetLevel;
            var offerLevels = this.pickDeterministicOfferLevels(firstOfferLevel, safeLastOfferLevel, totalDelta, targetLevel, 'max-alive');

            for (var packageIndex = 0; packageIndex < totalDelta; packageIndex++) {
              result.push({
                id: "max-alive:" + targetLevel + ":" + ("" + (packageIndex + 1)),
                targetLevel,
                offerLevel: offerLevels[packageIndex % offerLevels.length],
                delta: 1,
                claimed: false,
                claimSource: ''
              });
            }

            previousLevel = targetLevel;
            previousCap = targetCap;
          }

          return result.sort((a, b) => a.offerLevel - b.offerLevel || a.targetLevel - b.targetLevel || a.id.localeCompare(b.id));
        }

        getNextPlayerMaxAlivePackageSnapshot(state, level) {
          var item = this.getNextAvailableMaxAlivePackage(state, level);
          return item ? _extends({}, item) : null;
        }

        clampPlayerMaxAlive(value) {
          return Math.max(this.getPlayerMaxAliveStart(), Math.min(this.getPlayerMaxAliveMax(), value));
        }

        loadProgressionState() {
          var raw = sys.localStorage.getItem(this.progressionStorageKey);
          if (!raw) return null;

          try {
            return JSON.parse(raw);
          } catch (_unused) {
            return null;
          }
        }

        clearProgressionStorage() {
          var keys = [this.progressionStorageKey, 'battle-progression-v1', 'battle-progression-v2', 'battle-progression-v3', 'battle-progression-v4', 'battle-progression-v5'];

          for (var i = 0; i < keys.length; i++) {
            if (keys.indexOf(keys[i]) !== i) continue;
            sys.localStorage.removeItem(keys[i]);
          }
        }

        saveProgressionState() {
          if (!this.progressionState) return;
          sys.localStorage.setItem(this.progressionStorageKey, JSON.stringify(this.progressionState));
        }

        buildProgressionUrl(level) {
          if (typeof window === 'undefined') return '';
          if (!window.location) return '';
          var location = window.location;
          var params = new URLSearchParams(location.search);
          var removeKeys = ['currentAcc', 'currentBatch', 'step', 'numBatchPerStep', 'end', 'resetProgression', 'reset'];

          for (var i = 0; i < removeKeys.length; i++) {
            params.delete(removeKeys[i]);
            params.delete("?" + removeKeys[i]);
          }

          params.set('progression', '1');
          params.set('progressionResume', '1');
          params.set('currentLevel', "" + this.clampLevel(level));
          params.set('TotalLevels', "" + this.getSafeTotalLevels());
          params.set('ProgressionEndLevel', "" + this.getProgressionEndLevel());
          params.delete('totalLevels');
          params.delete('progressionEndLevel');
          var origin = location.origin || location.protocol + "//" + location.host;
          var query = params.toString();
          return "" + origin + location.pathname + ("" + (query ? "?" + query : '')) + ("" + (location.hash || ''));
        }

        applyTelemetryLevelQuery() {
          if (typeof window === 'undefined') return;
          if (!window.location) return;
          var params = new URLSearchParams(window.location.search);
          var progressionParam = this.getQueryInt(params, ['progression'], -1);

          if (progressionParam === 0) {
            this.enableProgression = false;
          } else if (progressionParam === 1) {
            this.enableProgression = true;
          }

          var totalLevels = this.getQueryInt(params, ['TotalLevels', 'totalLevels'], 0);
          var queriedLevel = this.getQueryInt(params, ['currentLevel'], this.currentLevel);
          var queriedProgressionEnd = this.getQueryInt(params, ['ProgressionEndLevel', 'progressionEndLevel'], 0);
          var progressionResume = this.getQueryInt(params, ['progressionResume'], 0);
          var forceProgressionReset = this.getQueryInt(params, ['resetProgression', 'reset'], 0) === 1;
          var hasQueriedLevel = params.has('currentLevel') || params.has('?currentLevel');
          this.resetProgressionRequested = forceProgressionReset || queriedLevel <= 0 || hasQueriedLevel && queriedLevel === 1 && progressionResume !== 1;
          this.levelQueryActive = totalLevels > 0 || queriedProgressionEnd > 0 || progressionParam === 1 || forceProgressionReset || hasQueriedLevel;

          if (totalLevels > 0) {
            this.totalLevels = Math.max(1, totalLevels);
          }

          if (queriedProgressionEnd > 0) {
            this.progressionEndLevel = Math.max(1, queriedProgressionEnd);
          }

          if (this.levelQueryActive) {
            this.currentLevel = this.clampLevel(this.resetProgressionRequested ? 1 : queriedLevel);
          }
        }

        getQueryInt(params, keys, fallback) {
          for (var i = 0; i < keys.length; i++) {
            var _params$get;

            var value = (_params$get = params.get(keys[i])) != null ? _params$get : params.get("?" + keys[i]);
            if (value === null) continue;
            var parsed = Number(value);

            if (Number.isFinite(parsed)) {
              return Math.floor(parsed);
            }
          }

          return fallback;
        }

        getDifficulty01() {
          return this.getProgression01(this.getSafeCurrentLevel());
        }

        getProgression01(level) {
          var endLevel = this.getProgressionEndLevel();
          var safeLevel = this.clampLevel(level);
          if (endLevel <= 1) return 1;
          return this.clamp01((safeLevel - 1) / (endLevel - 1));
        }

        getProgressionEndLevel() {
          return Math.max(1, Math.min(this.getSafeTotalLevels(), Math.floor(this.progressionEndLevel)));
        }

        getLevelBaseInitialCP(level) {
          return Math.round(this.lerp(this.initialCombatPointMin, this.initialCombatPointMax, this.getProgression01(level)));
        }

        getLevelBaseMaxAlive(level) {
          return Math.round(this.lerp(this.maxAliveWavesMin, this.maxAliveWavesMax, this.getProgression01(level)));
        }

        getLevelInitialCP(level) {
          var safeLevel = this.clampLevel(level);
          return Math.round(this.getLevelBaseInitialCP(safeLevel) * this.getBossMultiplier(this.bossInitialCombatPointMultiplier, this.isBossLevelFor(safeLevel)));
        }

        getBossMultiplier(configuredMultiplier, boss) {
          if (!boss) return 1;
          return Math.max(1, Number.isFinite(configuredMultiplier) ? configuredMultiplier : 1);
        }

        isBossLevel() {
          return this.isBossLevelFor(this.getSafeCurrentLevel());
        }

        isBossLevelFor(level) {
          var pace = Math.max(0, Math.floor(this.bossStagePace));
          return pace > 0 && Math.max(1, Math.floor(level)) % pace === 0;
        }

        getSafeTotalLevels() {
          return Math.max(1, Math.floor(this.totalLevels));
        }

        getSafeCurrentLevel() {
          return this.clampLevel(this.currentLevel);
        }

        clampLevel(level) {
          return Math.max(1, Math.min(this.getSafeTotalLevels(), Math.floor(level)));
        }

        safeInteger(value, fallback) {
          var parsed = Number(value);
          return Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
        }

        clampTeam(team) {
          return team === 0 ? 0 : 1;
        }

        clamp01(value) {
          return Math.max(0, Math.min(1, value));
        }

        lerp(a, b, t) {
          return a + (b - a) * this.clamp01(t);
        }

      }, (_descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "totalLevels", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 300;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "progressionEndLevel", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "currentLevel", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "bossStagePace", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "bossInitialCombatPointMultiplier", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "bossDecisionAccuracyMultiplier", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "bossMaxAliveWavesMultiplier", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "targetTeam", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "gameManager", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "battleArmyBrains", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "allowCP", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "initialCombatPointMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 600;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "initialCombatPointMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1040;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "allowDecisionAccuracy", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "decisionAccuracyMin", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.4;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "decisionAccuracyMax", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "allowInterval", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "minSpawnIntervalMinLevel", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5.0;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "maxSpawnIntervalMinLevel", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6.0;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "minSpawnIntervalMaxLevel", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.7;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "maxSpawnIntervalMaxLevel", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3.7;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class5.prototype, "allowMaxWave", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveWavesMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveWavesMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 15;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class5.prototype, "enableProgression", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class5.prototype, "autoReloadProgression", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class5.prototype, "purchasingSimulation", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class5.prototype, "progressionStorageKey", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'battle-progression-v5';
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class5.prototype, "initialPlayerGold", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class5.prototype, "playerInitialCPStart", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 300;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class5.prototype, "playerMaxAliveStart", [_dec34], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class5.prototype, "playerMaxAliveMax", [_dec35], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class5.prototype, "winGoldPerEnemyCP", [_dec36], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class5.prototype, "lossGoldRatio", [_dec37], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class5.prototype, "maxLossGoldRatioPerLevel", [_dec38], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.75;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class5.prototype, "lossesPerVideoReward", [_dec39], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class5.prototype, "unitUnlockCostMultiplier", [_dec40], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class5.prototype, "initialCPGoldPerPoint", [_dec41], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveBasePrice", [_dec42], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1000;
        }
      }), _descriptor45 = _applyDecoratedDescriptor(_class5.prototype, "unitProgressionRules", [_dec43], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear, 1, 5, 10), createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Sword, 1, 5, 10), createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman, 10, 5, 10), createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer, 25, 3, 5), createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry, 35, 5, 10), createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk, 45, 1, 1)];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f872721beb9c9db5d5cac1782f09f98006b5df64.js.map