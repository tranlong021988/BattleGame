System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, game, sys, GameManager, BattleArmyBrain, BattleCardModifier, BattleCardOpponentCondition, BattleCardTarget, CounterSettings, UnitFamily, unitFamilyToName, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _class4, _class5, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _descriptor47, _class6, _crd, ccclass, property, UnitProgressionRule, LevelSettings;

  function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function createUnitProgressionRule(family, unlockProgression, unlockCount, maxCount) {
    var rule = new UnitProgressionRule();
    rule.family = family;
    rule.unlockProgression = unlockProgression;
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

  function _reportPossibleCrUseOfBattleCardDefinition(extras) {
    _reporterNs.report("BattleCardDefinition", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardModifier(extras) {
    _reporterNs.report("BattleCardModifier", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardOpponentCondition(extras) {
    _reporterNs.report("BattleCardOpponentCondition", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardTarget(extras) {
    _reporterNs.report("BattleCardTarget", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCounterSettings(extras) {
    _reporterNs.report("CounterSettings", "./CounterSettings", _context.meta, extras);
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
      game = _cc.game;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      BattleArmyBrain = _unresolved_3.BattleArmyBrain;
    }, function (_unresolved_4) {
      BattleCardModifier = _unresolved_4.BattleCardModifier;
      BattleCardOpponentCondition = _unresolved_4.BattleCardOpponentCondition;
      BattleCardTarget = _unresolved_4.BattleCardTarget;
    }, function (_unresolved_5) {
      CounterSettings = _unresolved_5.CounterSettings;
    }, function (_unresolved_6) {
      UnitFamily = _unresolved_6.UnitFamily;
      unitFamilyToName = _unresolved_6.unitFamilyToName;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8d731TSPExBjqJd6aUC3OR6", "LevelSettings", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'game', 'sys']);

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
        visible: false
      }), _dec5 = property({
        min: 0,
        max: 1,
        step: 0.05,
        tooltip: 'Normalized campaign progress where this unit becomes available. It scales with Progression End Level and is aligned to the next boss stage when bosses are enabled.'
      }), _dec6 = property({
        min: 1,
        step: 1
      }), _dec7 = property({
        min: 1,
        step: 1
      }), _dec(_class = (_class2 = class UnitProgressionRule {
        constructor() {
          _initializerDefineProperty(this, "family", _descriptor, this);

          _initializerDefineProperty(this, "tier", _descriptor2, this);

          // Kept only to read existing scene data. New progression ignores it.
          _initializerDefineProperty(this, "unlockLevel", _descriptor3, this);

          _initializerDefineProperty(this, "unlockProgression", _descriptor4, this);

          _initializerDefineProperty(this, "unlockCount", _descriptor5, this);

          _initializerDefineProperty(this, "maxCount", _descriptor6, this);
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
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "unlockProgression", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "unlockCount", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxCount", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      })), _class2)) || _class));

      _export("LevelSettings", LevelSettings = (_dec8 = ccclass('LevelSettings'), _dec9 = property({
        tooltip: 'Total campaign levels used to normalize difficulty from level 1 to the final level.'
      }), _dec10 = property({
        min: 1,
        step: 1,
        displayName: 'Progression End Level',
        tooltip: 'Level where base CP, accuracy, Max Alive, unit unlocks, and unit counts finish progressing. Later levels keep these base caps while boss multipliers still apply.'
      }), _dec11 = property({
        tooltip: 'Current campaign level. Level 1 is easiest; Total Levels is hardest.'
      }), _dec12 = property({
        min: 0,
        step: 1,
        tooltip: 'Every Nth level is a boss fight. Use 0 to disable boss fights.'
      }), _dec13 = property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Initial CP Multiplier',
        tooltip: 'Multiplier applied only to enemy Initial CP on boss levels. Initial CP is not capped.'
      }), _dec14 = property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Decision Accuracy Multiplier',
        tooltip: 'Multiplier applied only to enemy Decision Accuracy on boss levels. The result remains capped by Decision Accuracy Max.'
      }), _dec15 = property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Max Alive Waves Multiplier',
        tooltip: 'Multiplier applied only to enemy Max Alive Waves on boss levels. The result remains capped by Max Alive Waves Max.'
      }), _dec16 = property({
        tooltip: 'Team affected by the automatic CP, accuracy, and Max Alive curves.'
      }), _dec17 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec18 = property({
        type: [_crd && BattleArmyBrain === void 0 ? (_reportPossibleCrUseOfBattleArmyBrain({
          error: Error()
        }), BattleArmyBrain) : BattleArmyBrain]
      }), _dec19 = property({
        tooltip: 'Apply initial Combat Point curve to the selected team.'
      }), _dec20 = property({
        tooltip: 'Apply the AI decision accuracy curve. Accuracy affects unit choice only; target and lane selection stay tactical.'
      }), _dec21 = property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at level 1.'
      }), _dec22 = property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at the final level.'
      }), _dec23 = property({
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
      }), _dec24 = property({
        displayName: 'Easy Spawn Delay Min'
      }), _dec25 = property({
        displayName: 'Easy Spawn Delay Max'
      }), _dec26 = property({
        displayName: 'Hard Spawn Delay Min'
      }), _dec27 = property({
        displayName: 'Hard Spawn Delay Max'
      }), _dec28 = property({
        tooltip: 'Apply Max Alive Waves curve. Higher levels allow the enemy to keep more waves active.'
      }), _dec29 = property({
        displayName: 'Enable Campaign Progression',
        tooltip: 'Apply unit unlocks, enemy unit-count growth, player gold, purchases, persistence, and retry rewards.'
      }), _dec30 = property({
        tooltip: 'Reset the current Cocos battle scene after each campaign battle. A win advances one level; a loss retries the same level.'
      }), _dec31 = property({
        tooltip: 'Let BattleArmyBrain A simulate player purchases between battles. It may buy multiple affordable packages.'
      }), _dec32 = property({
        displayName: 'Allow Ads Rescue',
        tooltip: 'Allow bot simulation to choose the Gold x2 rewarded-ad claim. Side missions remain available without ads.'
      }), _dec33 = property({
        tooltip: 'Persistent campaign storage key. Opening currentLevel=1 starts a fresh run; use resetProgression=1 to force reset even from a resume URL.'
      }), _dec34 = property({
        min: 1,
        step: 1,
        tooltip: 'Cards each team may bring into one battle. This is the future deck-upgrade hook.'
      }), _dec35 = property({
        min: 0,
        step: 1
      }), _dec36 = property({
        min: 0,
        step: 1
      }), _dec37 = property({
        min: 0,
        step: 1
      }), _dec38 = property({
        min: 0,
        step: 1
      }), _dec39 = property({
        min: 0.01,
        step: 0.1
      }), _dec40 = property({
        min: 1,
        step: 0.05,
        displayName: 'Boss Gold Reward Multiplier',
        tooltip: 'Small bonus applied to baseline CP reward on boss wins. Boss CP multiplier is not included in the reward base.'
      }), _dec41 = property({
        min: 0,
        max: 1,
        step: 0.05,
        displayName: 'Main Battle Entry Fee Ratio',
        tooltip: 'Gold charged before each main progression battle after the first. It is a ratio of that battle win reward and rounds up to 50. Side missions are free.'
      }), _dec42 = property({
        min: 1,
        step: 1
      }), _dec43 = property({
        min: 0.01,
        step: 0.1
      }), _dec44 = property({
        min: 1,
        step: 1
      }), _dec45 = property({
        type: [UnitProgressionRule]
      }), _dec8(_class4 = (_class5 = (_class6 = class LevelSettings extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "totalLevels", _descriptor7, this);

          _initializerDefineProperty(this, "progressionEndLevel", _descriptor8, this);

          _initializerDefineProperty(this, "currentLevel", _descriptor9, this);

          _initializerDefineProperty(this, "bossStagePace", _descriptor10, this);

          _initializerDefineProperty(this, "bossInitialCombatPointMultiplier", _descriptor11, this);

          _initializerDefineProperty(this, "bossDecisionAccuracyMultiplier", _descriptor12, this);

          _initializerDefineProperty(this, "bossMaxAliveWavesMultiplier", _descriptor13, this);

          _initializerDefineProperty(this, "targetTeam", _descriptor14, this);

          _initializerDefineProperty(this, "gameManager", _descriptor15, this);

          _initializerDefineProperty(this, "battleArmyBrains", _descriptor16, this);

          _initializerDefineProperty(this, "allowCP", _descriptor17, this);

          _initializerDefineProperty(this, "initialCombatPointMin", _descriptor18, this);

          _initializerDefineProperty(this, "initialCombatPointMax", _descriptor19, this);

          _initializerDefineProperty(this, "allowDecisionAccuracy", _descriptor20, this);

          _initializerDefineProperty(this, "decisionAccuracyMin", _descriptor21, this);

          _initializerDefineProperty(this, "decisionAccuracyMax", _descriptor22, this);

          _initializerDefineProperty(this, "allowInterval", _descriptor23, this);

          _initializerDefineProperty(this, "minSpawnIntervalMinLevel", _descriptor24, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMinLevel", _descriptor25, this);

          _initializerDefineProperty(this, "minSpawnIntervalMaxLevel", _descriptor26, this);

          _initializerDefineProperty(this, "maxSpawnIntervalMaxLevel", _descriptor27, this);

          _initializerDefineProperty(this, "allowMaxWave", _descriptor28, this);

          _initializerDefineProperty(this, "maxAliveWavesMin", _descriptor29, this);

          _initializerDefineProperty(this, "maxAliveWavesMax", _descriptor30, this);

          _initializerDefineProperty(this, "enableProgression", _descriptor31, this);

          _initializerDefineProperty(this, "autoReloadProgression", _descriptor32, this);

          _initializerDefineProperty(this, "purchasingSimulation", _descriptor33, this);

          _initializerDefineProperty(this, "allowAdsRescue", _descriptor34, this);

          _initializerDefineProperty(this, "progressionStorageKey", _descriptor35, this);

          _initializerDefineProperty(this, "battleCardDeckSize", _descriptor36, this);

          _initializerDefineProperty(this, "initialPlayerGold", _descriptor37, this);

          _initializerDefineProperty(this, "playerInitialCPStart", _descriptor38, this);

          _initializerDefineProperty(this, "playerMaxAliveStart", _descriptor39, this);

          _initializerDefineProperty(this, "playerMaxAliveMax", _descriptor40, this);

          _initializerDefineProperty(this, "winGoldPerEnemyCP", _descriptor41, this);

          _initializerDefineProperty(this, "bossGoldRewardMultiplier", _descriptor42, this);

          _initializerDefineProperty(this, "mainBattleEntryFeeRatio", _descriptor43, this);

          _initializerDefineProperty(this, "unitUnlockCostMultiplier", _descriptor44, this);

          _initializerDefineProperty(this, "initialCPGoldPerPoint", _descriptor45, this);

          _initializerDefineProperty(this, "maxAliveBasePrice", _descriptor46, this);

          _initializerDefineProperty(this, "unitProgressionRules", _descriptor47, this);

          this.progressionState = null;
          this.battleLevel = 1;
          this.nextBattlePending = false;
          this.levelQueryActive = false;
          this.resetProgressionRequested = false;
          this.preBattlePurchases = [];
          this.currentPlayerBattleCardIds = [];
          this.currentEnemyBattleCardIds = [];
          this.sideMissionBattle = false;
        }

        onLoad() {
          this.migrateLegacyUnitUnlockProgression(); // A real campaign owns its state in local storage. URL parameters are
          // retained only for non-progression telemetry/debug sessions, so an
          // old Preview URL cannot override a just-saved next battle.

          if (!this.enableProgression) {
            this.applyTelemetryLevelQuery();
          }

          if (this.enableProgression && !this.levelQueryActive && !LevelSettings.runtimeBattleReset) {
            this.resetProgressionRequested = true;
          }

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
              brain.maxAliveWaves = this.getLevelMaxAlive(this.getSafeCurrentLevel());
            }
          }
        }

        handleBattleResult(winnerTeam, loserTeam, reason) {
          if (!this.enableProgression || !this.progressionState) {
            return null;
          }

          if (this.sideMissionBattle) {
            return this.handleSideMissionBattleResult(winnerTeam, loserTeam, reason);
          }

          var state = this.progressionState;
          var battleLevel = this.battleLevel;
          var before = this.createTelemetrySnapshot();
          state.consecutiveSideWins = 0;
          var purchases = [];
          var usedPlayerCards = this.currentPlayerBattleCardIds.slice();
          this.advancePlayerCardCooldowns(state, usedPlayerCards);
          var newlyOffered = this.offerIntroducedUnits(battleLevel);
          var mainReward = this.getMainBattleReward(state, battleLevel);
          var winGold = mainReward.gold;
          var goldReward = 0;
          var rewardClaim = null;

          if (winnerTeam === 0) {
            rewardClaim = this.grantBotGoldClaim(state, winGold, 'progression-win', mainReward.targetId, mainReward.targetCost);
            goldReward = rewardClaim.goldGranted;
            state.levelLossCount = 0;
          } else if (loserTeam === 0) {
            state.levelLossCount++;
          }

          var campaignComplete = winnerTeam === 0 && battleLevel >= this.getSafeTotalLevels();
          var nextMainBattleLevel = winnerTeam === 0 ? Math.min(this.getSafeTotalLevels(), battleLevel + 1) : battleLevel;

          if (this.purchasingSimulation) {
            this.runPurchaseSimulation(purchases, 'between-battles', campaignComplete ? 0 : this.getMainBattleEntryFee(nextMainBattleLevel));
          }

          if (winnerTeam === 0) {
            if (campaignComplete) {
              state.currentLevel = this.getSafeTotalLevels();
            } else {
              state.currentLevel = battleLevel + 1;
            }
          } else {
            state.currentLevel = battleLevel;
          }

          this.currentLevel = state.currentLevel;
          this.applyProgressionRuntimeState(false);
          state.sideMissionActive = false;
          this.sideMissionBattle = false;
          this.nextBattlePending = !campaignComplete;
          this.saveProgressionState();
          var result = {
            battleLevel,
            totalLevels: this.getSafeTotalLevels(),
            winnerTeam,
            loserTeam,
            reason,
            campaignComplete,
            winGold,
            goldReward,
            rewardClaim,
            usedPlayerCards,
            newlyOffered,
            purchases,
            before,
            after: this.createTelemetrySnapshot()
          };
          return result;
        }

        handleSideMissionBattleResult(winnerTeam, loserTeam, reason) {
          if (!this.progressionState) return null;
          var state = this.progressionState;
          var before = this.createTelemetrySnapshot();
          var goldReward = 0;
          var rewardClaim = null;
          var route = 'progression';

          if (winnerTeam === 0) {
            var continuation = this.getSideMissionContinuation(state);
            var reward = this.getSideMissionReward(state);
            rewardClaim = this.grantBotGoldClaim(state, reward.gold, 'side-mission-win', reward.targetId, reward.targetCost);
            goldReward = rewardClaim.goldGranted;
            state.consecutiveSideWins++;
            state.levelLossCount = 0;
            route = Math.random() < continuation.chance ? 'side-mission' : 'progression';
            this.recordBotSimulationEvent(state, {
              type: 'side-mission-win-route-roll',
              battleLevel: this.battleLevel,
              choice: route,
              targetId: reward.targetId,
              targetCost: reward.targetCost,
              baseGold: rewardClaim.baseGold,
              goldGranted: rewardClaim.goldGranted,
              delayedPurchaseCount: continuation.delayedPurchaseCount,
              continuationChance: continuation.chance
            });
          } else {
            var _continuation = this.getSideMissionContinuation(state);

            route = Math.random() < _continuation.chance ? 'side-mission' : 'progression';
            this.recordBotSimulationEvent(state, {
              type: 'side-mission-loss-roll',
              battleLevel: this.battleLevel,
              choice: route,
              targetId: '',
              targetCost: 0,
              baseGold: 0,
              goldGranted: 0,
              delayedPurchaseCount: _continuation.delayedPurchaseCount,
              continuationChance: _continuation.chance
            });
          }

          state.currentLevel = this.battleLevel;
          state.sideMissionActive = route === 'side-mission';
          this.sideMissionBattle = state.sideMissionActive;
          this.currentLevel = this.battleLevel;
          this.saveProgressionState();
          this.nextBattlePending = true;
          return {
            mode: 'side-mission',
            battleLevel: this.battleLevel,
            totalLevels: this.getSafeTotalLevels(),
            winnerTeam,
            loserTeam,
            reason,
            campaignComplete: false,
            winGold: 0,
            goldReward,
            route,
            rewardClaim,
            usedPlayerCards: [],
            newlyOffered: [],
            purchases: [],
            before,
            after: this.createTelemetrySnapshot()
          };
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
              bossGoldRewardMultiplier: this.bossGoldRewardMultiplier,
              mainBattleEntryFeeRatio: this.mainBattleEntryFeeRatio,
              mainBattleEntryFee: this.getMainBattleEntryFee(this.battleLevel),
              unitUnlockCostMultiplier: this.unitUnlockCostMultiplier,
              initialCPGoldPerPoint: this.initialCPGoldPerPoint,
              maxAliveBasePrice: this.maxAliveBasePrice,
              cardDefinitions: this.createCardDefinitionSnapshot()
            },
            preBattlePurchases: this.preBattlePurchases.slice(),
            sideMission: {
              active: this.sideMissionBattle,
              botSimulationEvents: state.botSimulationEvents.slice()
            },
            player: {
              gold: state.playerGold,
              adsReward: state.adsReward,
              levelLossCount: state.levelLossCount,
              consecutiveSideWins: state.consecutiveSideWins,
              initialCP: state.playerInitialCP,
              cpPackagesPurchased: state.cpPackages.filter(item => item.claimed).length,
              cpPackagesOffered: this.getPlayerCPPackagesOffered(this.battleLevel),
              cpPackageSchedule: state.cpPackages.map(item => _extends({}, item)),
              initialCPOverflow: state.playerInitialCPOverflow,
              maxAlive: state.playerMaxAlive,
              maxAlivePackagesPurchased: state.maxAlivePackages.filter(item => item.claimed).length,
              maxAlivePackagesOffered: this.getPlayerMaxAlivePackagesOffered(this.battleLevel),
              maxAlivePackageSchedule: state.maxAlivePackages.map(item => _extends({}, item)),
              decisionAccuracy: playerBrain ? playerBrain.decisionAccuracy : null,
              totalPurchases: state.totalPurchases,
              mainBattleEntryCount: state.mainBattleEntryCount,
              cards: state.cards.map(card => _extends({}, card, {
                effectiveCooldown: this.getCardEffectiveCooldown(card),
                effectiveBudget: this.getCardEffectiveBudget(card)
              })),
              selectedBattleCardIds: this.currentPlayerBattleCardIds.slice()
            },
            enemy: {
              initialCP: manager ? manager.initialCombatPoint[1] : null,
              maxAlive: enemyBrain ? enemyBrain.maxAliveWaves : null,
              decisionAccuracy: enemyBrain ? enemyBrain.decisionAccuracy : null,
              selectedBattleCardIds: this.currentEnemyBattleCardIds.slice(),
              deckCapacity: this.getEnemyBattleCardDeckSize(),
              lockedCardIds: (state.enemyCardIdsByLevel[String(this.battleLevel)] || []).slice()
            },
            battleCards: manager ? manager.getBattleCardTelemetrySnapshot() : [],
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

        shouldResetBattleAfterResult() {
          return this.enableProgression && this.autoReloadProgression && this.nextBattlePending;
        }

        resetBattle() {
          if (!this.nextBattlePending) return false;
          LevelSettings.runtimeBattleReset = true;

          try {
            void game.restart().catch(error => {
              LevelSettings.runtimeBattleReset = false;
              console.error('[BattleProgression] failed to restart battle runtime.', error);
            });
            return true;
          } catch (error) {
            LevelSettings.runtimeBattleReset = false;
            console.error('[BattleProgression] could not start battle runtime restart.', error);
            return false;
          }
        }

        initializeProgression() {
          var loaded = this.loadProgressionState();
          this.progressionState = loaded ? this.sanitizeProgressionState(loaded) : this.createInitialProgressionState();
          var savedLevel = this.progressionState.currentLevel;

          if (this.levelQueryActive) {
            this.progressionState.currentLevel = this.getSafeCurrentLevel();
          } else {
            this.currentLevel = this.clampLevel(this.progressionState.currentLevel);
          }

          if (!this.levelQueryActive) {
            this.sideMissionBattle = this.progressionState.sideMissionActive;
          }

          this.battleLevel = this.getSafeCurrentLevel();
          this.progressionState.currentLevel = this.battleLevel;

          if (savedLevel !== this.battleLevel) {
            this.progressionState.levelLossCount = 0;
          }

          this.offerIntroducedUnits(this.battleLevel);
          this.applyProgressionRuntimeState(true);
          this.saveProgressionState();
        }

        completePreBattleProgression() {
          if (!this.progressionState) return;

          if (this.sideMissionBattle) {
            this.applySideMissionRuntimeState();
            this.configureSideMissionBattleCards();
            this.saveProgressionState();
            return;
          }

          if (this.purchasingSimulation) {
            var reservedEntryFee = this.getCurrentMainBattleEntryFee();
            this.runPurchaseSimulation(this.preBattlePurchases, 'pre-battle', reservedEntryFee);

            if (this.tryRouteBotToSideMission()) {
              this.resetIntoSideMission();
              return;
            }

            if (!this.tryPayMainBattleEntryFee(this.preBattlePurchases)) {
              this.resetIntoSideMission();
              return;
            }
          }

          this.applyProgressionRuntimeState(true);
          this.configureBattleCardsForCurrentBattle();
          this.saveProgressionState();
        }

        createInitialProgressionState() {
          var units = [];

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var startsOwned = this.getRuleUnlockLevel(rule) <= 1;
            units.push({
              key: this.getRuleKey(rule),
              offered: startsOwned,
              unlocked: startsOwned,
              unitCount: this.getRuleUnlockCount(rule)
            });
          }

          return {
            version: 10,
            currentLevel: this.getSafeCurrentLevel(),
            playerGold: Math.max(0, Math.floor(this.initialPlayerGold)),
            adsReward: 0,
            levelLossCount: 0,
            consecutiveSideWins: 0,
            sideMissionActive: false,
            playerInitialCP: this.getPlayerCPStart(),
            playerInitialCPOverflow: 0,
            cpPackages: this.createCPPackageSchedule(),
            maxAlivePackages: this.createMaxAlivePackageSchedule(),
            playerMaxAlive: this.getPlayerMaxAliveStart(),
            totalPurchases: 0,
            mainBattleEntryCount: 0,
            units,
            cards: this.createInitialCardProgression(),
            enemyCardIdsByLevel: {},
            botSimulationEvents: []
          };
        }

        tryPurchaseCard(cardId, upgrade) {
          if (upgrade === void 0) {
            upgrade = false;
          }

          if (!this.progressionState || !cardId) return false;
          var expectedKind = upgrade === 'budget' ? 'card-budget-upgrade' : upgrade ? 'card-cooldown-upgrade' : 'card-unlock';
          var option = this.getPurchaseOptions(this.progressionState).find(candidate => candidate.kind === expectedKind && candidate.cardId === cardId && candidate.cost <= this.progressionState.playerGold);
          if (!option) return false;
          this.applyPurchase(option, this.progressionState, 'player-card-shop');
          this.applyProgressionRuntimeState(false);
          this.saveProgressionState();
          return true;
        } // Call only after the rewarded-video callback succeeds.


        tryFinishCardCooldownWithAd(cardId) {
          if (!this.progressionState || !cardId) return false;
          var card = this.getSavedCard(this.progressionState, cardId);

          if (!card || !card.owned || card.cooldownRemaining <= 0) {
            return false;
          }

          var cooldownBefore = card.cooldownRemaining;
          card.cooldownRemaining = 0;
          this.progressionState.adsReward++;
          this.recordBotSimulationEvent(this.progressionState, {
            type: 'card-cooldown-finish-ad',
            battleLevel: this.battleLevel,
            choice: 'finish-cooldown-ad',
            targetId: cardId,
            targetCost: cooldownBefore,
            baseGold: 0,
            goldGranted: 0
          });
          this.saveProgressionState();
          return true;
        }

        setPlayerBattleCardSelection(cardIds) {
          if (!this.progressionState) return;
          this.currentPlayerBattleCardIds = this.filterReadyPlayerCardIds(cardIds);
          var manager = this.getGameManager();

          if (manager) {
            manager.configureBattleCardDecks(this.currentPlayerBattleCardIds, this.currentEnemyBattleCardIds, this.getPlayerCardBudgetUpgradeLevels(this.progressionState), this.getBattleCardDeckSize(), this.getEnemyBattleCardDeckSize());
          }
        }

        configureBattleCardsForCurrentBattle() {
          var state = this.progressionState;
          var manager = this.getGameManager();
          var database = manager ? manager.battleCardDatabase : null;
          if (!state || !manager || !database) return;

          if (this.purchasingSimulation) {
            this.currentPlayerBattleCardIds = this.selectRandomCardIds(database.cards.filter(definition => {
              var saved = this.getSavedCard(state, definition.id);
              return !!saved && saved.owned && this.isCardEligibleForTeam(definition, 0, state) && (saved.cooldownRemaining <= 0 || Math.random() < 0.5);
            }), [], this.getBattleCardDeckSize());
            this.finishBotSelectedCardCooldowns(state);
          } else {
            this.currentPlayerBattleCardIds = this.filterReadyPlayerCardIds(this.currentPlayerBattleCardIds);
          }

          var enemyDeckSize = this.getEnemyBattleCardDeckSize();
          var enemyDeckKey = String(this.battleLevel);
          var savedEnemyDeck = state.enemyCardIdsByLevel[enemyDeckKey];

          if (Array.isArray(savedEnemyDeck)) {
            // A retry must preserve the original deck, even if the player
            // changes roster and one of its cards no longer has a target.
            this.currentEnemyBattleCardIds = savedEnemyDeck.slice(0, enemyDeckSize);
          } else {
            this.currentEnemyBattleCardIds = this.selectRandomCardIds(database.getEnemyCards(this.isBossLevelFor(this.battleLevel)).filter(definition => this.isCardEligibleForTeam(definition, 1, state)), [], enemyDeckSize);
            state.enemyCardIdsByLevel[enemyDeckKey] = this.currentEnemyBattleCardIds.slice();
          }

          manager.configureBattleCardDecks(this.currentPlayerBattleCardIds, this.currentEnemyBattleCardIds, this.getPlayerCardBudgetUpgradeLevels(state), this.getBattleCardDeckSize(), enemyDeckSize);
        }

        filterReadyPlayerCardIds(cardIds) {
          if (!this.progressionState) return [];
          var manager = this.getGameManager();
          var database = manager ? manager.battleCardDatabase : null;
          if (!database || !Array.isArray(cardIds)) return [];
          var result = [];
          var used = new Set();

          for (var i = 0; i < cardIds.length; i++) {
            var id = cardIds[i];

            if (!id || used.has(id) || result.length >= this.getBattleCardDeckSize()) {
              continue;
            }

            var definition = database.getCard(id);
            var saved = this.getSavedCard(this.progressionState, id);
            if (!definition || !saved || !saved.owned) continue;

            if (!this.isCardEligibleForTeam(definition, 0, this.progressionState)) {
              continue;
            }

            if (saved.cooldownRemaining > 0) continue;
            used.add(id);
            result.push(id);
          }

          return result;
        }

        isBossBattle() {
          return this.isBossLevelFor(this.battleLevel);
        }

        getBattleCardDeckSize() {
          return Math.max(1, Math.floor(this.battleCardDeckSize));
        }

        getEnemyBattleCardDeckSize() {
          return this.getEnemyBattleCardDeckSizeFor(this.battleLevel);
        }

        getEnemyBattleCardDeckSizeFor(level) {
          var state = this.progressionState;
          var regularCapacity = state ? Math.min(2, this.getPlayerCardProgressionWave(state)) : 0;
          return this.isBossLevelFor(level) ? Math.min(3, regularCapacity + 1, this.getBattleCardDeckSize()) : Math.min(2, regularCapacity, this.getBattleCardDeckSize());
        }

        selectRandomCardIds(definitions, excludedIds, maxCount) {
          var uniqueDefinitions = definitions.filter((definition, index) => !!definition && !!definition.id && definitions.findIndex(candidate => candidate && candidate.id === definition.id) === index);
          var excluded = new Set(excludedIds || []);
          var nonRepeating = uniqueDefinitions.filter(definition => !excluded.has(definition.id));
          var source = nonRepeating.length >= maxCount ? nonRepeating.slice() : uniqueDefinitions.slice();
          var result = [];

          while (source.length > 0 && result.length < maxCount) {
            var index = Math.floor(Math.random() * source.length);
            var definition = source.splice(index, 1)[0];
            if (definition) result.push(definition.id);
          }

          return result;
        }

        advancePlayerCardCooldowns(state, usedCardIds) {
          for (var i = 0; i < state.cards.length; i++) {
            var card = state.cards[i];

            if (!card.owned || card.cooldownRemaining <= 0) {
              continue;
            }

            card.cooldownRemaining = Math.max(0, card.cooldownRemaining - 1);
          }

          for (var _i = 0; _i < usedCardIds.length; _i++) {
            var _card = this.getSavedCard(state, usedCardIds[_i]);

            if (!_card || !_card.owned) continue;
            _card.cooldownRemaining = this.getCardEffectiveCooldown(_card);
          }
        }

        createInitialCardProgression() {
          var manager = this.getGameManager();
          var database = manager ? manager.battleCardDatabase : null;
          if (!database) return [];
          return database.cards.filter(definition => !!definition && !!definition.id).map(definition => ({
            id: definition.id,
            owned: false,
            cooldownUpgradeLevel: 0,
            budgetUpgradeLevel: 0,
            cooldownRemaining: 0
          }));
        }

        getSavedCard(state, id) {
          for (var i = 0; i < state.cards.length; i++) {
            var card = state.cards[i];
            if (card.id === id) return card;
          }

          return null;
        }

        getCardEffectiveCooldown(card) {
          var manager = this.getGameManager();
          var definition = manager && manager.battleCardDatabase ? manager.battleCardDatabase.getCard(card.id) : null;
          if (!definition) return 0;
          return Math.max(1, Math.floor(definition.baseCooldownBattles) - Math.max(0, Math.min(2, card.cooldownUpgradeLevel)));
        }

        getCardEffectiveBudget(card) {
          var manager = this.getGameManager();
          var definition = manager && manager.battleCardDatabase ? manager.battleCardDatabase.getCard(card.id) : null;
          if (!definition) return 0;
          return Math.max(1, Math.round(Math.max(1, definition.baseBudget) * (1 + Math.max(0, Math.min(2, card.budgetUpgradeLevel)) * 0.4)));
        }

        getPlayerCardBudgetUpgradeLevels(state) {
          var result = {};
          if (!state) return result;

          for (var i = 0; i < state.cards.length; i++) {
            var card = state.cards[i];
            if (!card.owned) continue;
            result[card.id] = Math.max(0, Math.min(2, card.budgetUpgradeLevel));
          }

          return result;
        }

        isCardEligibleForTeam(definition, team, state) {
          if (team === 0 && !this.isCardUnlockedForPlayer(definition, state)) {
            return false;
          }

          var targetFamilies = this.getCardFamiliesForTeam(team, state).filter(family => this.cardMatchesFamily(definition, family));
          if (targetFamilies.length <= 0) return false;

          if (definition.requiredEnemyFamily !== (_crd && BattleCardOpponentCondition === void 0 ? (_reportPossibleCrUseOfBattleCardOpponentCondition({
            error: Error()
          }), BattleCardOpponentCondition) : BattleCardOpponentCondition).Any && this.getCardFamiliesForTeam(team === 1 ? 0 : 1, state).indexOf(definition.requiredEnemyFamily - 1) < 0) {
            return false;
          }

          if (definition.modifier === (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
            error: Error()
          }), BattleCardModifier) : BattleCardModifier).CounterImmunity) {
            return this.hasCounterThreat(team, targetFamilies, state);
          }

          return true;
        }

        isCardUnlockedForPlayer(definition, state) {
          if (this.hasReachedFullProgression()) {
            return true;
          }

          return this.getPlayerCardProgressionWave(state) >= this.getCardProgressionWave(definition);
        }

        hasReachedFullProgression() {
          return this.battleLevel > Math.max(0, Math.floor(this.progressionEndLevel));
        }

        getPlayerCardProgressionWave(state) {
          if (this.isPlayerFamilyOwned((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk, state)) {
            return 4;
          }

          if (this.isPlayerFamilyOwned((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry, state)) {
            return 3;
          }

          if (this.isPlayerFamilyOwned((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer, state)) {
            return 2;
          }

          if (this.isPlayerFamilyOwned((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman, state)) {
            return 1;
          }

          return 0;
        }

        getCardProgressionWave(definition) {
          if (definition.modifier === (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
            error: Error()
          }), BattleCardModifier) : BattleCardModifier).CounterImmunity) {
            return 4;
          }

          if (definition.targetFamily === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk) {
            return 4;
          }

          if (definition.requiredEnemyFamily === (_crd && BattleCardOpponentCondition === void 0 ? (_reportPossibleCrUseOfBattleCardOpponentCondition({
            error: Error()
          }), BattleCardOpponentCondition) : BattleCardOpponentCondition).Cavalry) {
            return 3;
          }

          if (definition.targetFamily === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer || definition.target === (_crd && BattleCardTarget === void 0 ? (_reportPossibleCrUseOfBattleCardTarget({
            error: Error()
          }), BattleCardTarget) : BattleCardTarget).Ranged) {
            return 2;
          }

          if (definition.targetFamily === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman) {
            return 1;
          }

          return 0;
        }

        getCardUpgradeRankLimit(definition, state) {
          if (this.hasReachedFullProgression()) {
            return 2;
          }

          return Math.max(0, Math.min(2, this.getPlayerCardProgressionWave(state) - this.getCardProgressionWave(definition)));
        }

        isPlayerFamilyOwned(family, state) {
          var rule = this.unitProgressionRules.find(candidate => candidate && candidate.family === family);
          var saved = rule ? this.getSavedUnit(state, this.getRuleKey(rule)) : null;
          return !!saved && saved.unlocked && saved.unitCount > 0;
        }

        getCardFamiliesForTeam(team, state) {
          var result = [];

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var saved = this.getSavedUnit(state, this.getRuleKey(rule));
            var available = team === 1 ? this.battleLevel >= this.getRuleUnlockLevel(rule) && this.getEnemyUnitCount(rule, this.battleLevel) > 0 : !!saved && saved.unlocked && saved.unitCount > 0;
            if (available) result.push(rule.family);
          }

          return result;
        }

        cardMatchesFamily(definition, family) {
          switch (definition.target) {
            case (_crd && BattleCardTarget === void 0 ? (_reportPossibleCrUseOfBattleCardTarget({
              error: Error()
            }), BattleCardTarget) : BattleCardTarget).UnitFamily:
              return family === definition.targetFamily;

            case (_crd && BattleCardTarget === void 0 ? (_reportPossibleCrUseOfBattleCardTarget({
              error: Error()
            }), BattleCardTarget) : BattleCardTarget).Frontline:
              return family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Spear || family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Sword || family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Axeman || family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Cavalry;

            case (_crd && BattleCardTarget === void 0 ? (_reportPossibleCrUseOfBattleCardTarget({
              error: Error()
            }), BattleCardTarget) : BattleCardTarget).Ranged:
              return family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Archer || family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
                error: Error()
              }), UnitFamily) : UnitFamily).Monk;

            default:
              return true;
          }
        }

        hasCounterThreat(protectedTeam, protectedFamilies, state) {
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter) return false;
          var attackingFamilies = this.getCardFamiliesForTeam(protectedTeam === 1 ? 0 : 1, state);

          for (var i = 0; i < attackingFamilies.length; i++) {
            for (var j = 0; j < protectedFamilies.length; j++) {
              if (counter.getDamageMultiplier(attackingFamilies[i], protectedFamilies[j]) > 1.0001) {
                return true;
              }
            }
          }

          return false;
        }

        createCardDefinitionSnapshot() {
          var manager = this.getGameManager();
          var database = manager ? manager.battleCardDatabase : null;
          if (!database) return [];
          return database.cards.map(definition => ({
            id: definition.id,
            displayName: definition.displayName,
            purchasePrice: definition.purchasePrice,
            baseCooldownBattles: definition.baseCooldownBattles,
            baseBudget: definition.baseBudget,
            target: definition.target,
            targetFamily: definition.targetFamily,
            requiredEnemyFamily: definition.requiredEnemyFamily,
            modifier: definition.modifier,
            modifierValue: definition.modifierValue,
            tradeoffModifier: definition.tradeoffModifier,
            tradeoffValue: definition.tradeoffValue,
            enemyPool: definition.enemyPool
          }));
        }

        sanitizeProgressionState(source) {
          var _this = this;

          var initial = this.createInitialProgressionState();
          var sourceVersion = this.safeInteger(source.version, 0);

          if (sourceVersion !== 8 && sourceVersion !== 9 && sourceVersion !== 10) {
            return initial;
          }

          var savedUnits = Array.isArray(source.units) ? source.units : [];
          var savedCPPackages = Array.isArray(source.cpPackages) ? source.cpPackages : [];
          var savedMaxAlivePackages = Array.isArray(source.maxAlivePackages) ? source.maxAlivePackages : [];
          var savedCards = Array.isArray(source.cards) ? source.cards : [];
          var savedBotSimulationEvents = Array.isArray(source.botSimulationEvents) ? source.botSimulationEvents : [];
          initial.currentLevel = this.clampLevel(this.safeInteger(source.currentLevel, initial.currentLevel));
          initial.playerGold = Math.max(0, this.safeInteger(source.playerGold, 0));
          initial.adsReward = Math.max(0, this.safeInteger(source.adsReward, 0));
          initial.levelLossCount = Math.max(0, this.safeInteger(source.levelLossCount, 0));
          initial.consecutiveSideWins = Math.max(0, this.safeInteger(source.consecutiveSideWins, 0));
          initial.sideMissionActive = !!source.sideMissionActive;
          initial.botSimulationEvents = savedBotSimulationEvents.filter(event => event && typeof event.type === 'string' && typeof event.choice === 'string').slice(-40).map(event => ({
            type: event.type,
            battleLevel: this.clampLevel(this.safeInteger(event.battleLevel, 1)),
            choice: event.choice,
            targetId: typeof event.targetId === 'string' ? event.targetId : '',
            targetCost: Math.max(0, this.safeInteger(event.targetCost, 0)),
            baseGold: Math.max(0, this.safeInteger(event.baseGold, 0)),
            goldGranted: Math.max(0, this.safeInteger(event.goldGranted, 0)),
            delayedPurchaseCount: Math.max(0, this.safeInteger(event.delayedPurchaseCount, 0)),
            continuationChance: this.clamp01(typeof event.continuationChance === 'number' ? event.continuationChance : 0)
          }));
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
            var item = initial.maxAlivePackages[_i2];
            var saved = savedMaxAlivePackages.find(candidate => candidate && candidate.id === item.id);
            if (!saved) return 1; // continue

            item.claimed = !!saved.claimed;
            item.claimSource = item.claimed && typeof saved.claimSource === 'string' ? saved.claimSource : '';
          };

          for (var _i2 = 0; _i2 < initial.maxAlivePackages.length; _i2++) {
            if (_loop2()) continue;
          }

          initial.playerInitialCP = this.getPlayerCPFromState(initial);
          initial.playerMaxAlive = this.getPlayerMaxAliveFromState(initial);
          initial.totalPurchases = Math.max(0, this.safeInteger(source.totalPurchases, 0));
          initial.mainBattleEntryCount = Math.max(0, this.safeInteger(source.mainBattleEntryCount, initial.currentLevel > 1 ? 1 : 0));
          var savedEnemyDecks = source.enemyCardIdsByLevel;

          if (savedEnemyDecks && typeof savedEnemyDecks === 'object' && !Array.isArray(savedEnemyDecks)) {
            for (var key of Object.keys(savedEnemyDecks)) {
              var level = this.safeInteger(key, 0);
              var deck = savedEnemyDecks[key];
              if (level < 1 || !Array.isArray(deck)) continue;
              initial.enemyCardIdsByLevel[String(level)] = deck.filter(id => typeof id === 'string').slice(0, 3);
            }
          } else if (Array.isArray(source.lastEnemyCardIds)) {
            var _level = initial.currentLevel;
            initial.enemyCardIdsByLevel[String(_level)] = source.lastEnemyCardIds.filter(id => typeof id === 'string').slice(0, 3);
          }

          var _loop3 = function _loop3() {
            var card = initial.cards[_i3];
            var saved = savedCards.find(candidate => candidate && candidate.id === card.id);
            if (!saved) return 1; // continue

            card.owned = !!saved.owned;
            card.cooldownUpgradeLevel = Math.max(0, Math.min(2, _this.safeInteger(saved.cooldownUpgradeLevel, 0)));
            card.budgetUpgradeLevel = Math.max(0, Math.min(2, _this.safeInteger(saved.budgetUpgradeLevel, 0)));
            card.cooldownRemaining = Math.max(0, _this.safeInteger(saved.cooldownRemaining, 0));
          };

          for (var _i3 = 0; _i3 < initial.cards.length; _i3++) {
            if (_loop3()) continue;
          }

          var _loop4 = function _loop4() {
            var unit = initial.units[_i4];
            var saved = savedUnits.find(candidate => candidate && candidate.key === unit.key);

            var rule = _this.getRuleByKey(unit.key);

            if (!saved || !rule) return 1; // continue

            unit.offered = !!saved.offered || unit.offered;
            unit.unlocked = !!saved.unlocked || unit.unlocked;
            unit.unitCount = Math.max(_this.getRuleUnlockCount(rule), Math.min(_this.getRuleMaxCount(rule), _this.safeInteger(saved.unitCount, unit.unitCount)));
          };

          for (var _i4 = 0; _i4 < initial.units.length; _i4++) {
            if (_loop4()) continue;
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

          for (var _i5 = 0; _i5 < playerBrains.length; _i5++) {
            playerBrains[_i5].maxAliveWaves = state.playerMaxAlive;
          }
        }

        applySideMissionRuntimeState() {
          if (!this.progressionState) return;
          var manager = this.getGameManager();
          if (!manager || !manager.unitDatabase) return;
          var state = this.progressionState;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var enemyEntry = this.findEntryForRule(manager.unitDatabase.teamBUnits, rule);
            var playerUnit = this.getSavedUnit(state, this.getRuleKey(rule));

            if (enemyEntry && playerUnit) {
              enemyEntry.unlocked = playerUnit.unlocked;
              enemyEntry.unitCount = playerUnit.unitCount;
            }
          }

          manager.unitDatabase.teamBInitialCombatPoint = state.playerInitialCP;
          manager.initialCombatPoint[1] = state.playerInitialCP;
          manager.combatPoint[1] = state.playerInitialCP;
          var enemyBrains = this.getTargetBattleArmyBrains(1);
          var baselineAccuracy = this.clamp01(this.lerp(this.decisionAccuracyMin, this.decisionAccuracyMax, this.getProgression01(this.battleLevel)));

          for (var _i6 = 0; _i6 < enemyBrains.length; _i6++) {
            enemyBrains[_i6].maxAliveWaves = state.playerMaxAlive;

            if (this.allowDecisionAccuracy) {
              enemyBrains[_i6].decisionAccuracy = baselineAccuracy;
            }
          }
        }

        configureSideMissionBattleCards() {
          this.currentPlayerBattleCardIds = [];
          this.currentEnemyBattleCardIds = [];
          var manager = this.getGameManager();
          if (!manager) return;
          manager.configureBattleCardDecks([], [], {}, 0, 0);
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
                label: "Unlock " + familyName + " T" + rule.tier,
                cardId: null
              });
            }

            if (saved.unlocked && saved.unitCount < this.getPlayerUnitCountMilestoneCap(rule, this.battleLevel, state)) {
              options.push({
                id: "count:" + key,
                kind: 'unit-count',
                cost: Math.max(1, Math.round(unlockPrice / this.getRuleUnlockCount(rule))),
                family: rule.family,
                tier: rule.tier,
                delta: 1,
                label: "+1 " + familyName + " T" + rule.tier,
                cardId: null
              });
            }
          }

          var nextCPPackage = this.getNextAvailableCPPackage(state, this.battleLevel);

          if (nextCPPackage) {
            options.push({
              id: "initial-cp:" + nextCPPackage.id,
              kind: 'initial-cp',
              cost: this.getInitialCPPackageCost(nextCPPackage.delta),
              family: null,
              tier: 0,
              delta: nextCPPackage.delta,
              label: "+" + nextCPPackage.delta + " Initial CP",
              cardId: null
            });
          }

          var nextMaxAlivePackage = this.getNextAvailableMaxAlivePackage(state, this.battleLevel);

          if (nextMaxAlivePackage) {
            options.push({
              id: "max-alive:" + nextMaxAlivePackage.id,
              kind: 'max-alive',
              cost: this.getMaxAlivePackageCost(nextMaxAlivePackage.delta, state.playerMaxAlive),
              family: null,
              tier: 0,
              delta: nextMaxAlivePackage.delta,
              label: "+" + nextMaxAlivePackage.delta + " Max Alive",
              cardId: null
            });
          }

          var cardDatabase = manager ? manager.battleCardDatabase : null;

          if (cardDatabase) {
            for (var _i7 = 0; _i7 < cardDatabase.cards.length; _i7++) {
              var definition = cardDatabase.cards[_i7];
              if (!definition || !definition.id) continue;

              var _saved = this.getSavedCard(state, definition.id);

              if (!_saved) continue;

              if (!this.hasReachedFullProgression() && !this.isCardEligibleForTeam(definition, 0, state)) {
                continue;
              }

              if (!_saved.owned) {
                options.push({
                  id: "card-unlock:" + definition.id,
                  kind: 'card-unlock',
                  cost: Math.max(1, Math.round(definition.purchasePrice)),
                  family: null,
                  tier: 0,
                  delta: 1,
                  label: "Unlock " + definition.displayName,
                  cardId: definition.id
                });
                continue;
              }

              var upgradeRankLimit = this.getCardUpgradeRankLimit(definition, state);

              if (_saved.cooldownUpgradeLevel < upgradeRankLimit) {
                var nextLevel = _saved.cooldownUpgradeLevel + 1;
                options.push({
                  id: "card-cooldown:" + definition.id + ":" + nextLevel,
                  kind: 'card-cooldown-upgrade',
                  cost: this.getCardCooldownUpgradeCost(definition, nextLevel),
                  family: null,
                  tier: 0,
                  delta: 1,
                  label: definition.displayName + " Cooldown -1",
                  cardId: definition.id
                });
              }

              if (_saved.budgetUpgradeLevel < upgradeRankLimit) {
                var _nextLevel = _saved.budgetUpgradeLevel + 1;

                options.push({
                  id: "card-budget:" + definition.id + ":" + _nextLevel,
                  kind: 'card-budget-upgrade',
                  cost: this.getCardBudgetUpgradeCost(definition, _nextLevel),
                  family: null,
                  tier: 0,
                  delta: 1,
                  label: definition.displayName + " Budget +40%",
                  cardId: definition.id
                });
              }
            }
          }

          return options;
        }

        getInitialCPPackageCost(delta) {
          return Math.max(1, Math.round(Math.max(0, delta) * Math.max(0.01, this.initialCPGoldPerPoint)));
        }

        getCardCooldownUpgradeCost(definition, nextLevel) {
          var ratio = nextLevel <= 1 ? 0.6 : 0.9;
          return Math.max(1, Math.round(Math.max(1, definition.purchasePrice) * ratio));
        }

        getCardBudgetUpgradeCost(definition, nextLevel) {
          var ratio = nextLevel <= 1 ? 0.5 : 0.75;
          return Math.max(1, Math.round(Math.max(1, definition.purchasePrice) * ratio));
        }

        shouldReserveGoldForBaseline(state) {
          return state.playerInitialCP < this.getPlayerCPMilestoneCap(this.battleLevel) || state.playerMaxAlive < this.getPlayerMaxAliveMilestoneCap(this.battleLevel);
        }

        getMaxAlivePackageCost(delta, currentMaxAlive) {
          return Math.max(1, Math.round(Math.max(1, this.maxAliveBasePrice) * Math.max(1, currentMaxAlive) / Math.max(1, this.getPlayerMaxAliveStart()) * Math.max(0, delta)));
        }

        runPurchaseSimulation(records, source, reservedGold) {
          if (reservedGold === void 0) {
            reservedGold = 0;
          }

          if (!this.progressionState) return;
          var reserve = Math.max(0, Math.floor(reservedGold));

          for (var iteration = 0; iteration < 100; iteration++) {
            var affordable = this.getBotPurchaseCandidates(this.progressionState, true).filter(option => option.cost <= this.progressionState.playerGold - reserve);
            if (affordable.length <= 0) return;
            var selected = this.pickWeightedPurchase(affordable);
            if (!selected) return;
            records.push(this.applyPurchase(selected, this.progressionState, source));
          }
        }

        getBotPurchaseCandidates(state, affordableOnly) {
          var options = this.getPurchaseOptions(state).filter(option => !affordableOnly || option.cost <= state.playerGold);

          if (this.shouldReserveGoldForBaseline(state)) {
            options = options.filter(option => option.kind !== 'card-unlock' && option.kind !== 'card-cooldown-upgrade' && option.kind !== 'card-budget-upgrade');
          }

          if (this.shouldBotPrioritizeCardUnlocks(state)) {
            options = options.filter(option => option.kind !== 'card-cooldown-upgrade' && option.kind !== 'card-budget-upgrade');
          }

          if (this.shouldBotPrioritizeCooldownUpgrades(state)) {
            options = options.filter(option => option.kind !== 'card-budget-upgrade');
          }

          var currentLevelUnitUnlocks = options.filter(option => {
            if (option.kind !== 'unit-unlock' || option.family === null) {
              return false;
            }

            var rule = this.getRule(option.family, option.tier);
            return !!rule && this.getRuleUnlockLevel(rule) === this.battleLevel;
          });
          return currentLevelUnitUnlocks.length > 0 ? currentLevelUnitUnlocks : options;
        }

        tryRouteBotToSideMission() {
          if (!this.progressionState) return false;
          var state = this.progressionState;
          var target = this.pickWeightedPurchase(this.getBotPurchaseCandidates(state, false).filter(option => option.cost > state.playerGold));
          if (!target) return false;
          var choice = Math.random() < 0.5 ? 'side-mission' : 'progression';
          this.recordBotSimulationEvent(state, {
            type: 'side-mission-entry-roll',
            battleLevel: this.battleLevel,
            choice,
            targetId: target.id,
            targetCost: target.cost,
            baseGold: 0,
            goldGranted: 0
          });
          return choice === 'side-mission';
        }

        tryPayMainBattleEntryFee(records) {
          if (!this.progressionState) return false;
          var state = this.progressionState;
          var fee = this.getCurrentMainBattleEntryFee();
          var goldBefore = state.playerGold;

          if (goldBefore < fee) {
            this.recordBotSimulationEvent(state, {
              type: 'main-entry-fee-insufficient',
              battleLevel: this.battleLevel,
              choice: 'side-mission',
              targetId: '',
              targetCost: fee,
              baseGold: 0,
              goldGranted: 0
            });
            return false;
          }

          state.playerGold -= fee;
          state.mainBattleEntryCount++;
          records.push({
            id: "battle-entry:" + this.battleLevel,
            kind: 'battle-entry',
            label: fee > 0 ? "Main Battle Entry Fee -" + fee + " Gold" : 'First Main Battle Entry Free',
            family: null,
            familyName: '',
            tier: 0,
            cost: fee,
            goldBefore,
            goldAfter: state.playerGold,
            valueBefore: 0,
            valueAfter: 0,
            source: 'main-battle-entry',
            cardId: null
          });
          this.recordBotSimulationEvent(state, {
            type: 'main-entry-fee-paid',
            battleLevel: this.battleLevel,
            choice: fee > 0 ? 'paid' : 'free',
            targetId: '',
            targetCost: fee,
            baseGold: fee,
            goldGranted: 0
          });
          return true;
        }

        getMainBattleWinGold(level) {
          var rewardBaseCP = this.getLevelBaseInitialCP(level);
          return Math.max(0, Math.round(rewardBaseCP * Math.max(0, this.winGoldPerEnemyCP) * (this.isBossLevelFor(level) ? Math.max(1, this.bossGoldRewardMultiplier) : 1)));
        }

        getMainBattleReward(state, level) {
          var baseGold = this.getMainBattleWinGold(level);
          var nextLevel = Math.min(this.getSafeTotalLevels(), level + 1);
          var nextEntryFee = level >= this.getSafeTotalLevels() ? 0 : this.getMainBattleEntryFee(nextLevel);
          var target = this.getBotPurchaseCandidates(state, false).sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id))[0] || null;
          var requiredGold = target ? Math.max(0, nextEntryFee + target.cost - state.playerGold) : 0;
          return {
            targetId: target ? target.id : '',
            targetCost: target ? target.cost : 0,
            gold: Math.max(baseGold, Math.ceil(requiredGold / 50) * 50)
          };
        }

        getMainBattleEntryFee(level) {
          var baseFee = this.getMainBattleWinGold(level) * this.clamp01(this.mainBattleEntryFeeRatio);
          return Math.max(0, Math.ceil(baseFee / 50) * 50);
        }

        getCurrentMainBattleEntryFee() {
          if (!this.progressionState) return 0;
          return this.progressionState.mainBattleEntryCount <= 0 ? 0 : this.getMainBattleEntryFee(this.battleLevel);
        }

        getSideMissionReward(state) {
          var baseGold = Math.ceil(this.getMainBattleWinGold(this.battleLevel) / 50) * 50;
          var gold = Math.max(50, Math.ceil(baseGold / Math.pow(2, state.consecutiveSideWins) / 50) * 50);
          return {
            targetId: '',
            targetCost: 0,
            gold
          };
        }

        getSideMissionContinuation(state) {
          var delayedPurchaseCount = this.getBotPurchaseCandidates(state, false).filter(option => option.cost > state.playerGold).length;
          return {
            delayedPurchaseCount,
            chance: Math.min(0.85, 0.25 + Math.min(4, delayedPurchaseCount) * 0.15)
          };
        }

        finishBotSelectedCardCooldowns(state) {
          for (var i = 0; i < this.currentPlayerBattleCardIds.length; i++) {
            var cardId = this.currentPlayerBattleCardIds[i];
            var card = this.getSavedCard(state, cardId);

            if (!card || !card.owned || card.cooldownRemaining <= 0) {
              continue;
            }

            var cooldownBefore = card.cooldownRemaining;
            card.cooldownRemaining = 0;
            state.adsReward++;
            this.recordBotSimulationEvent(state, {
              type: 'card-cooldown-finish-ad',
              battleLevel: this.battleLevel,
              choice: 'finish-cooldown-ad',
              targetId: cardId,
              targetCost: cooldownBefore,
              baseGold: 0,
              goldGranted: 0
            });
          }
        }

        grantBotGoldClaim(state, baseGold, type, targetId, targetCost) {
          if (targetId === void 0) {
            targetId = '';
          }

          if (targetCost === void 0) {
            targetCost = 0;
          }

          var useAds = this.purchasingSimulation && this.allowAdsRescue && Math.random() < 0.5;
          var goldGranted = Math.max(0, Math.floor(baseGold) * (useAds ? 2 : 1));
          var event = {
            type,
            battleLevel: this.battleLevel,
            choice: useAds ? 'gold-x2-ad' : 'gold',
            targetId,
            targetCost,
            baseGold: Math.max(0, Math.floor(baseGold)),
            goldGranted
          };
          state.playerGold += goldGranted;
          if (useAds) state.adsReward++;
          this.recordBotSimulationEvent(state, event);
          return event;
        }

        recordBotSimulationEvent(state, event) {
          state.botSimulationEvents.push(event);

          if (state.botSimulationEvents.length > 40) {
            state.botSimulationEvents.splice(0, state.botSimulationEvents.length - 40);
          }
        }

        shouldBotPrioritizeCardUnlocks(state) {
          return this.getPurchaseOptions(state).some(option => option.kind === 'card-unlock');
        }

        shouldBotPrioritizeCooldownUpgrades(state) {
          return this.getPurchaseOptions(state).some(option => option.kind === 'card-cooldown-upgrade' && option.cost <= state.playerGold);
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

          for (var _i8 = 0; _i8 < options.length; _i8++) {
            roll -= weights[_i8];
            if (roll <= 0) return options[_i8];
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

          if (option.kind === 'card-unlock') {
            return 0.6;
          }

          if (option.kind === 'card-cooldown-upgrade') {
            return 2;
          }

          if (option.kind === 'card-budget-upgrade') {
            return 1.5;
          }

          return 1;
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
            source,
            cardId: option.cardId
          };
        }

        applyPurchaseToState(option, state) {
          if (option.kind === 'card-unlock') {
            var card = option.cardId ? this.getSavedCard(state, option.cardId) : null;
            if (!card) return;
            card.owned = true;
            return;
          }

          if (option.kind === 'card-budget-upgrade') {
            var _card2 = option.cardId ? this.getSavedCard(state, option.cardId) : null;

            if (!_card2 || !_card2.owned) return;
            _card2.budgetUpgradeLevel = Math.min(2, _card2.budgetUpgradeLevel + 1);
            return;
          }

          if (option.kind === 'card-cooldown-upgrade') {
            var _card3 = option.cardId ? this.getSavedCard(state, option.cardId) : null;

            if (!_card3 || !_card3.owned) return;
            _card3.cooldownUpgradeLevel = Math.min(2, _card3.cooldownUpgradeLevel + 1);
            _card3.cooldownRemaining = Math.max(0, _card3.cooldownRemaining - 1);
            return;
          }

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

          if (option.kind === 'card-unlock' || option.kind === 'card-cooldown-upgrade' || option.kind === 'card-budget-upgrade') {
            var card = option.cardId ? this.getSavedCard(state, option.cardId) : null;
            if (!card) return 0;

            if (option.kind === 'card-unlock') {
              return Number(card.owned);
            }

            return option.kind === 'card-cooldown-upgrade' ? card.cooldownUpgradeLevel : card.budgetUpgradeLevel;
          }

          if (option.family === null) return 0;
          var rule = this.getRule(option.family, option.tier);
          var saved = rule ? this.getSavedUnit(state, this.getRuleKey(rule)) : null;
          if (!saved) return 0;
          return option.kind === 'unit-unlock' ? Number(saved.unlocked) : saved.unitCount;
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
              playerCountMilestoneCap: this.getPlayerUnitCountMilestoneCap(rule, this.battleLevel, this.progressionState)
            };
          });
        }

        getPlayerUnitCountMilestoneCap(rule, level, state) {
          return Math.min(this.getRuleMaxCount(rule), this.getRuleUnlockCount(rule) + this.getUnitCountUpgradeRank(rule, level, state));
        }

        getEnemyUnitCount(rule, level) {
          return Math.round(Math.min(this.getRuleMaxCount(rule), this.getRuleUnlockCount(rule) + this.getUnitCountUpgradeRank(rule, level)));
        }

        getUnitCountUpgradeRank(rule, level, state) {
          if (state === void 0) {
            state = null;
          }

          var unlockLevel = this.getRuleUnlockLevel(rule);
          var maxRank = Math.max(0, this.getRuleMaxCount(rule) - this.getRuleUnlockCount(rule));
          var rank = 0;
          var milestones = this.getUnitUnlockMilestoneLevels();

          for (var i = 0; i < milestones.length; i++) {
            var milestone = milestones[i];

            if (milestone <= unlockLevel || milestone > level) {
              continue;
            }

            if (state && !this.isUnitUnlockMilestoneOffered(milestone, state)) {
              continue;
            }

            rank++;
          }

          return Math.min(maxRank, rank);
        }

        getUnitUnlockMilestoneLevels() {
          var result = [];

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var level = this.getRuleUnlockLevel(rule);
            if (level <= 1 || result.indexOf(level) >= 0) continue;
            result.push(level);
          }

          return result.sort((a, b) => a - b);
        }

        isUnitUnlockMilestoneOffered(milestone, state) {
          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;

            if (this.getRuleUnlockLevel(rule) !== milestone) {
              continue;
            }

            var saved = this.getSavedUnit(state, this.getRuleKey(rule));
            if (saved && saved.offered) return true;
          }

          return false;
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

          for (var _i9 = 0; _i9 < brains.length; _i9++) {
            var _brain = brains[_i9];
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
          var endLevel = this.getProgressionEndLevel();
          var progress = this.getRuleUnlockProgression(rule);
          var rawLevel = Math.max(1, Math.floor(1 + progress * (endLevel - 1)));
          var bossPace = Math.max(0, Math.floor(this.bossStagePace));

          if (rawLevel <= 1 || bossPace <= 0) {
            return rawLevel;
          }

          return Math.min(endLevel, Math.ceil(rawLevel / bossPace) * bossPace);
        }

        migrateLegacyUnitUnlockProgression() {
          var referenceEndLevel = Math.max(1, Math.floor(this.progressionEndLevel));

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            if (rule.unlockProgression > 0) continue;
            if (rule.unlockLevel <= 1) continue;
            rule.unlockProgression = this.clamp01(rule.unlockLevel / referenceEndLevel);
          }
        }

        getRuleUnlockProgression(rule) {
          var configured = Number.isFinite(rule.unlockProgression) ? rule.unlockProgression : 0;

          if (configured > 0 || rule.unlockLevel <= 1) {
            return this.clamp01(configured);
          } // A preview using an older serialized scene can omit the new field.
          // Keep its original unlock distribution instead of opening every unit.


          return this.clamp01(rule.unlockLevel / Math.max(1, Math.floor(this.progressionEndLevel)));
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
            var offerLevels = this.pickEvenlyDistributedOfferLevels(firstOfferLevel, lastNormalLevel >= firstOfferLevel ? lastNormalLevel : targetLevel, packageCount);
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

        pickEvenlyDistributedOfferLevels(firstLevel, lastLevel, count) {
          var candidateCount = Math.max(1, lastLevel - firstLevel + 1);
          var safeCount = Math.min(Math.max(1, Math.floor(count)), candidateCount);
          var result = [];

          for (var index = 0; index < safeCount; index++) {
            result.push(firstLevel + Math.floor(index * candidateCount / safeCount));
          }

          return result;
        }

        getNextPlayerCPPackageSnapshot(state, level) {
          var item = this.getNextAvailableCPPackage(state, level);
          return item ? _extends({}, item) : null;
        }

        getUnitProgressionEndLevel() {
          return this.getProgressionEndLevel();
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

          for (var _i10 = 0; _i10 < milestones.length; _i10++) {
            var targetLevel = milestones[_i10];
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
            var offerLevels = this.pickEvenlyDistributedOfferLevels(firstOfferLevel, safeLastOfferLevel, totalDelta);

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
          var keys = [this.progressionStorageKey, 'battle-progression-v1', 'battle-progression-v2', 'battle-progression-v3', 'battle-progression-v4', 'battle-progression-v5', 'battle-progression-v6', 'battle-progression-v7', 'battle-progression-v8'];

          for (var i = 0; i < keys.length; i++) {
            if (keys.indexOf(keys[i]) !== i) continue;
            sys.localStorage.removeItem(keys[i]);
          }
        }

        saveProgressionState() {
          if (!this.progressionState) return;
          sys.localStorage.setItem(this.progressionStorageKey, JSON.stringify(this.progressionState));
        }

        resetIntoSideMission() {
          if (!this.progressionState) return;
          this.progressionState.sideMissionActive = true;
          this.sideMissionBattle = true;
          this.nextBattlePending = true;
          this.saveProgressionState();
          this.scheduleOnce(() => {
            if (!this.resetBattle()) {
              console.warn('[BattleProgression] side-mission reset was not started.');
            }
          }, 0);
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
          this.sideMissionBattle = this.getQueryInt(params, ['sideMission'], 0) === 1;
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

        getLevelMaxAlive(level) {
          var safeLevel = this.clampLevel(level);
          return Math.round(Math.min(Math.max(0, this.maxAliveWavesMax), this.getLevelBaseMaxAlive(safeLevel) * this.getBossMultiplier(this.bossMaxAliveWavesMultiplier, this.isBossLevelFor(safeLevel))));
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

      }, _class6.runtimeBattleReset = false, _class6), (_descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "totalLevels", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 300;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "progressionEndLevel", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 50;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "currentLevel", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "bossStagePace", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "bossInitialCombatPointMultiplier", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.1;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "bossDecisionAccuracyMultiplier", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.1;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "bossMaxAliveWavesMultiplier", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.1;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "targetTeam", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "gameManager", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "battleArmyBrains", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "allowCP", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "initialCombatPointMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 600;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "initialCombatPointMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1040;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "allowDecisionAccuracy", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "decisionAccuracyMin", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.4;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "decisionAccuracyMax", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "allowInterval", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "minSpawnIntervalMinLevel", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5.0;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "maxSpawnIntervalMinLevel", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 6.0;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "minSpawnIntervalMaxLevel", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2.7;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class5.prototype, "maxSpawnIntervalMaxLevel", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3.7;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class5.prototype, "allowMaxWave", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveWavesMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveWavesMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 15;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class5.prototype, "enableProgression", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class5.prototype, "autoReloadProgression", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class5.prototype, "purchasingSimulation", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class5.prototype, "allowAdsRescue", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class5.prototype, "progressionStorageKey", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'battle-progression-v8';
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class5.prototype, "battleCardDeckSize", [_dec34], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class5.prototype, "initialPlayerGold", [_dec35], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class5.prototype, "playerInitialCPStart", [_dec36], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 300;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class5.prototype, "playerMaxAliveStart", [_dec37], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class5.prototype, "playerMaxAliveMax", [_dec38], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class5.prototype, "winGoldPerEnemyCP", [_dec39], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.15;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class5.prototype, "bossGoldRewardMultiplier", [_dec40], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.15;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class5.prototype, "mainBattleEntryFeeRatio", [_dec41], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.35;
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class5.prototype, "unitUnlockCostMultiplier", [_dec42], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor45 = _applyDecoratedDescriptor(_class5.prototype, "initialCPGoldPerPoint", [_dec43], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor46 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveBasePrice", [_dec44], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1000;
        }
      }), _descriptor47 = _applyDecoratedDescriptor(_class5.prototype, "unitProgressionRules", [_dec45], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear, 0, 5, 10), createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Sword, 0, 5, 10), createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman, 0.2, 5, 10), createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer, 0.5, 3, 5), createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry, 0.7, 5, 10), createUnitProgressionRule((_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk, 0.9, 1, 1)];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f872721beb9c9db5d5cac1782f09f98006b5df64.js.map