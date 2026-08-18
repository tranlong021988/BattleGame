System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, sys, GameManager, BattleArmyBrain, BattleCardModifier, BattleCardOpponentCondition, BattleCardTarget, CounterSettings, UnitFamily, unitFamilyToName, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _class4, _class5, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _descriptor47, _descriptor48, _descriptor49, _crd, ccclass, property, UnitProgressionRule, LevelSettings;

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
        tooltip: 'Level where base CP, accuracy, Max Alive, and unit unlocks finish progressing. Remaining unit-count ranks are offered on regular levels before the campaign finale.'
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
        tooltip: 'Allow rewarded-ad Gold x2 claims and card cooldown completion. Side missions remain available without ads.'
      }), _dec33 = property({
        tooltip: 'Persistent campaign storage key. Opening currentLevel=1 starts a fresh run; use resetProgression=1 to force reset even from a resume URL.'
      }), _dec34 = property({
        min: 1,
        step: 1,
        tooltip: 'Cards each team may bring into one battle. This is the future deck-upgrade hook.'
      }), _dec35 = property({
        min: 0,
        max: 1,
        step: 0.05,
        displayName: 'Enemy Card Diversity Score Floor',
        tooltip: 'Enemy keeps a level-seeded, retry-stable deck, while choosing among cards near the best score. Lower values create more level-to-level variety.'
      }), _dec36 = property({
        min: 0.01,
        step: 0.05,
        displayName: 'Bot Strength Upgrade Purchase Weight',
        tooltip: 'Relative bot preference for an available independent melee-card Strength rank.'
      }), _dec37 = property({
        min: 0,
        step: 1
      }), _dec38 = property({
        min: 0,
        step: 1
      }), _dec39 = property({
        min: 0,
        step: 1
      }), _dec40 = property({
        min: 0,
        step: 1
      }), _dec41 = property({
        min: 0.01,
        step: 0.1
      }), _dec42 = property({
        min: 1,
        step: 0.05,
        displayName: 'Boss Gold Reward Multiplier',
        tooltip: 'Small bonus applied to baseline CP reward on boss wins. Boss CP multiplier is not included in the reward base.'
      }), _dec43 = property({
        min: 0,
        max: 1,
        step: 0.05,
        displayName: 'Main Battle Entry Fee Ratio',
        tooltip: 'Gold charged before each main progression battle after the first. It is a ratio of the previous main battle win reward and rounds up to 50. Side missions are free.'
      }), _dec44 = property({
        min: 1,
        step: 1
      }), _dec45 = property({
        min: 0.01,
        step: 0.1
      }), _dec46 = property({
        min: 1,
        step: 1
      }), _dec47 = property({
        type: [UnitProgressionRule]
      }), _dec8(_class4 = (_class5 = class LevelSettings extends Component {
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

          _initializerDefineProperty(this, "enemyCardDiversityScoreFloor", _descriptor37, this);

          _initializerDefineProperty(this, "botStrengthUpgradePurchaseWeight", _descriptor38, this);

          _initializerDefineProperty(this, "initialPlayerGold", _descriptor39, this);

          _initializerDefineProperty(this, "playerInitialCPStart", _descriptor40, this);

          _initializerDefineProperty(this, "playerMaxAliveStart", _descriptor41, this);

          _initializerDefineProperty(this, "playerMaxAliveMax", _descriptor42, this);

          _initializerDefineProperty(this, "winGoldPerEnemyCP", _descriptor43, this);

          _initializerDefineProperty(this, "bossGoldRewardMultiplier", _descriptor44, this);

          _initializerDefineProperty(this, "mainBattleEntryFeeRatio", _descriptor45, this);

          _initializerDefineProperty(this, "unitUnlockCostMultiplier", _descriptor46, this);

          _initializerDefineProperty(this, "initialCPGoldPerPoint", _descriptor47, this);

          _initializerDefineProperty(this, "maxAliveBasePrice", _descriptor48, this);

          _initializerDefineProperty(this, "unitProgressionRules", _descriptor49, this);

          this.progressionState = null;
          this.battleLevel = 1;
          this.nextBattlePending = false;
          this.levelQueryActive = false;
          this.resetProgressionRequested = false;
          this.preBattlePurchases = [];
          this.telemetryActions = [];
          this.telemetryActionSequence = 0;
          this.preserveTelemetryActionsForSideMission = false;
          this.mainBattleGoldPlan = null;
          this.telemetryActionPhase = 'pre-battle';
          this.currentPlayerBattleCardIds = [];
          this.currentEnemyBattleCardIds = [];
          this.currentPlayerCooldownAdReasons = new Map();
          this.currentBattleUsesPreparedDeck = false;
          this.sideMissionBattle = false;
          this.enemyCardDeckPolicyVersion = 5;
        }

        onLoad() {
          this.migrateLegacyUnitUnlockProgression(); // A real campaign owns its state in local storage. URL parameters are
          // retained only for non-progression telemetry/debug sessions, so an
          // old Preview URL cannot override a just-saved next battle.

          if (!this.enableProgression) {
            this.applyTelemetryLevelQuery();
          }

          if (this.enableProgression && !this.levelQueryActive) {
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
          this.telemetryActionPhase = 'battle-result';
          state.consecutiveSideWins = 0;
          var purchases = [];
          var usedPlayerCards = this.currentPlayerBattleCardIds.slice();
          this.advancePlayerCardCooldowns(state, usedPlayerCards);
          var newlyOffered = this.offerIntroducedUnits(battleLevel);
          var mainReward = this.getMainBattleReward(battleLevel);
          var winGold = mainReward.gold;
          var goldReward = 0;
          var rewardClaim = null;

          if (winnerTeam === 0) {
            rewardClaim = this.grantBotGoldClaim(state, winGold, 'progression-win', mainReward.targetId, mainReward.targetCost);
            goldReward = rewardClaim.goldGranted;
            state.levelLossCount = 0;
            state.mainLossesAtCurrentLevel = 0;
          } else if (loserTeam === 0) {
            state.levelLossCount++;
            state.mainLossesAtCurrentLevel++;
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
            telemetry: this.createProgressionTelemetryLedger(),
            before,
            after: this.createTelemetrySnapshot()
          };
          return result;
        }

        handleSideMissionBattleResult(winnerTeam, loserTeam, reason) {
          if (!this.progressionState) return null;
          var state = this.progressionState;
          var before = this.createTelemetrySnapshot();
          this.telemetryActionPhase = 'battle-result'; // Side missions disable cards, but still count as a completed battle
          // for the player's existing card cooldowns.

          this.advancePlayerCardCooldowns(state, []);
          var goldReward = 0;
          var rewardClaim = null;
          var route = 'progression';

          if (winnerTeam === 0) {
            var reward = this.getSideMissionReward();
            rewardClaim = this.grantBotGoldClaim(state, reward.gold, 'side-mission-win', reward.targetId, reward.targetCost);
            goldReward = rewardClaim.goldGranted;
            state.consecutiveSideWins++;
            state.levelLossCount = 0;
            var continuation = this.getSideMissionContinuation(state);
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
            var _continuation = this.getSideMissionContinuation(state); // A lost side mission did not improve the economy. Retry only if
            // main entry is still impossible; pre-battle entry handling will
            // route there in that case.


            route = 'progression';
            this.recordBotSimulationEvent(state, {
              type: 'side-mission-loss-roll',
              battleLevel: this.battleLevel,
              choice: route,
              targetId: '',
              targetCost: 0,
              baseGold: 0,
              goldGranted: 0,
              delayedPurchaseCount: _continuation.delayedPurchaseCount,
              continuationChance: 0
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
            telemetry: this.createProgressionTelemetryLedger(),
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
            telemetry: this.createProgressionTelemetryIdentity(),
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
              cardDefinitions: this.createCardDefinitionSnapshot(),
              cardUpgradeSchedule: this.getCardUpgradeSchedule()
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
              mainLossesAtCurrentLevel: state.mainLossesAtCurrentLevel,
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
          var manager = this.getGameManager();

          if (!manager) {
            console.error('[BattleProgression] GameManager is unavailable for reset.');
            return false;
          }

          this.nextBattlePending = false;
          manager.stopBattleRuntime();
          this.initializeProgression();
          this.applyLevelSettings();
          this.completePreBattleProgression(); // Routing to a side mission schedules the next internal reset after
          // state has been saved. Do not briefly start the obsolete main battle.

          if (this.nextBattlePending) {
            return true;
          }

          var started = manager.startBattleRuntime();

          if (!started) {
            console.error('[BattleProgression] battle runtime could not be started.');
          }

          return started;
        }

        initializeProgression() {
          this.mainBattleGoldPlan = null;
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
            this.progressionState.mainLossesAtCurrentLevel = 0;
          }

          this.offerIntroducedUnits(this.battleLevel);
          this.applyProgressionRuntimeState(true);
          this.saveProgressionState();
        }

        completePreBattleProgression() {
          if (!this.progressionState) return;
          var preserveTelemetryActions = this.preserveTelemetryActionsForSideMission;
          this.preserveTelemetryActionsForSideMission = false;
          this.preBattlePurchases = [];

          if (!preserveTelemetryActions) {
            this.telemetryActions = [];
            this.telemetryActionSequence = 0;
            this.progressionState.telemetryBattleIndex++;
          }

          this.telemetryActionPhase = 'pre-battle';

          if (this.sideMissionBattle) {
            this.applySideMissionRuntimeState();
            this.configureSideMissionBattleCards();
            this.saveProgressionState();
            return;
          }

          if (this.purchasingSimulation) {
            var reservedEntryFee = this.getCurrentMainBattleEntryFee();
            var manager = this.getGameManager();

            if (manager && manager.battleCardDatabase) {
              this.configureEnemyBattleCards(manager.battleCardDatabase, this.progressionState);
            }

            var preparationPlan = this.getBotPreparationPlan(this.progressionState);

            if (this.tryRouteBotToSideMission(preparationPlan)) {
              this.resetIntoSideMission();
              return;
            }

            this.tryPurchaseBotPreparationTarget(preparationPlan, this.preBattlePurchases, reservedEntryFee);
            this.runPurchaseSimulation(this.preBattlePurchases, 'pre-battle', reservedEntryFee);
            this.currentBattleUsesPreparedDeck = this.shouldBotPrepareBattleCards(this.progressionState);

            if (!this.tryPayMainBattleEntryFee(this.preBattlePurchases)) {
              this.resetIntoSideMission();
              return;
            }
          } else {
            this.currentBattleUsesPreparedDeck = false;
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
            version: 13,
            telemetryRunId: this.createTelemetryRunId(),
            telemetryBattleIndex: 0,
            enemyCardDeckPolicyVersion: this.enemyCardDeckPolicyVersion,
            currentLevel: this.getSafeCurrentLevel(),
            playerGold: Math.max(0, Math.floor(this.initialPlayerGold)),
            adsReward: 0,
            levelLossCount: 0,
            mainLossesAtCurrentLevel: 0,
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
          var expectedKind = upgrade === 'budget' ? 'card-budget-upgrade' : upgrade === 'strength' ? 'card-strength-upgrade' : upgrade ? 'card-cooldown-upgrade' : 'card-unlock';
          var option = this.getPurchaseOptions(this.progressionState).find(candidate => candidate.kind === expectedKind && candidate.cardId === cardId && candidate.cost <= this.progressionState.playerGold);
          if (!option) return false;
          this.applyPurchase(option, this.progressionState, 'player-card-shop');
          this.applyProgressionRuntimeState(false);
          this.saveProgressionState();
          return true;
        } // Call only after the rewarded-video callback succeeds.


        tryFinishCardCooldownWithAd(cardId) {
          if (!this.allowAdsRescue || !this.progressionState || !cardId) {
            return false;
          }

          var card = this.getSavedCard(this.progressionState, cardId);

          if (!card || !card.owned || card.cooldownRemaining <= 0) {
            return false;
          }

          var cooldownBefore = card.cooldownRemaining;
          card.cooldownRemaining = 0;
          this.progressionState.adsReward++;
          this.recordTelemetryAction({
            type: 'card-cooldown-finish-ad',
            goldBefore: this.progressionState.playerGold,
            goldAfter: this.progressionState.playerGold,
            cardId,
            source: 'manual-card-cooldown-ad',
            cost: 0,
            goldGranted: 0
          });
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
            manager.configureBattleCardDecks(this.currentPlayerBattleCardIds, this.currentEnemyBattleCardIds, this.getPlayerCardBudgetUpgradeLevels(this.progressionState), this.getPlayerCardStrengthScales(this.progressionState), this.getEnemyCardStrengthScales(), this.getBattleCardDeckSize(), this.getEnemyBattleCardDeckSize());
          }
        }

        configureBattleCardsForCurrentBattle() {
          var state = this.progressionState;
          var manager = this.getGameManager();
          var database = manager ? manager.battleCardDatabase : null;
          if (!state || !manager || !database) return;
          var enemyDeckSize = this.configureEnemyBattleCards(database, state);

          if (this.purchasingSimulation) {
            this.currentPlayerCooldownAdReasons.clear();
            var eligibleDefinitions = database.cards.filter(definition => {
              var saved = this.getSavedCard(state, definition.id);
              return !!saved && saved.owned && this.isCardEligibleForTeam(definition, 0, state);
            });
            var readyDefinitions = eligibleDefinitions.filter(definition => {
              var saved = this.getSavedCard(state, definition.id);
              return !!saved && saved.cooldownRemaining <= 0;
            });
            var cooldownDefinitions = eligibleDefinitions.filter(definition => {
              var saved = this.getSavedCard(state, definition.id);
              return !!saved && saved.cooldownRemaining > 0;
            });
            var cooldownAdPlan = this.selectBotCooldownAdDeck(readyDefinitions, cooldownDefinitions, state, this.currentBattleUsesPreparedDeck);

            for (var i = 0; i < cooldownAdPlan.candidates.length; i++) {
              var candidate = cooldownAdPlan.candidates[i];
              this.currentPlayerCooldownAdReasons.set(candidate.definition.id, candidate.reason);
            }

            this.currentPlayerBattleCardIds = cooldownAdPlan.cardIds;
            this.finishBotSelectedCardCooldowns(state);
          } else {
            this.currentPlayerBattleCardIds = this.filterReadyPlayerCardIds(this.currentPlayerBattleCardIds);
          }

          manager.configureBattleCardDecks(this.currentPlayerBattleCardIds, this.currentEnemyBattleCardIds, this.getPlayerCardBudgetUpgradeLevels(state), this.getPlayerCardStrengthScales(state), this.getEnemyCardStrengthScales(), this.getBattleCardDeckSize(), enemyDeckSize);
        }

        configureEnemyBattleCards(database, state) {
          if (state.enemyCardDeckPolicyVersion !== this.enemyCardDeckPolicyVersion) {
            state.enemyCardDeckPolicyVersion = this.enemyCardDeckPolicyVersion;
            state.enemyCardIdsByLevel = {};
          }

          var enemyDeckSize = this.getEnemyBattleCardDeckSize();
          var enemyDeckKey = String(this.battleLevel);
          var savedEnemyDeck = state.enemyCardIdsByLevel[enemyDeckKey];

          if (Array.isArray(savedEnemyDeck)) {
            this.currentEnemyBattleCardIds = savedEnemyDeck.filter(id => {
              var definition = database.getCard(id);
              return !!definition && this.isCardEligibleForTeam(definition, 1, state);
            }).slice(0, enemyDeckSize);
          } else {
            var candidates = database.getEnemyCards(this.isBossLevelFor(this.battleLevel)).filter(definition => this.isCardEligibleForTeam(definition, 1, state));
            this.currentEnemyBattleCardIds = this.selectBestEnemyCardIds(candidates, state, enemyDeckSize);
          }

          state.enemyCardIdsByLevel[enemyDeckKey] = this.currentEnemyBattleCardIds.slice();
          return enemyDeckSize;
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
          var maxCapacity = Math.min(3, this.getBattleCardDeckSize());
          var bossPace = Math.max(0, Math.floor(this.bossStagePace));
          if (maxCapacity <= 0) return 0;

          if (bossPace <= 0) {
            var state = this.progressionState;
            return state ? Math.min(2, this.getPlayerCardProgressionWave(state), maxCapacity) : 0;
          }

          var safeLevel = this.clampLevel(level);
          var intervalStart = Math.floor((safeLevel - 1) / bossPace) * bossPace + 1;
          var intervalEnd = Math.min(this.getSafeTotalLevels(), intervalStart + bossPace - 1);
          var intervalLength = intervalEnd - intervalStart;
          if (intervalLength <= 0) return maxCapacity;
          var intervalProgress = (safeLevel - intervalStart) / intervalLength; // At a five-level boss pace this produces 0, 0, 0, 1, 3.
          // Wider intervals preserve the quiet opening and extend only the
          // one-card preview before the boss reveals its full deck.

          if (intervalProgress < 0.75) return 0;
          if (intervalProgress < 1) return Math.min(1, maxCapacity);
          return maxCapacity;
        }

        selectBestPlayerCardIds(definitions, state, maxCount) {
          var candidates = definitions.filter((definition, index) => !!definition && !!definition.id && definitions.findIndex(candidate => candidate && candidate.id === definition.id) === index);
          var deckSize = Math.max(0, Math.min(maxCount, candidates.length));
          if (deckSize <= 0) return [];
          return candidates.map(definition => ({
            definition,
            score: this.getPlayerBattleCardScore(definition, state)
          })).filter(candidate => candidate.score > 0).sort((a, b) => b.score - a.score || a.definition.id.localeCompare(b.definition.id)).slice(0, deckSize).map(candidate => candidate.definition.id);
        }

        selectBestEnemyCardIds(definitions, state, maxCount) {
          var _this = this;

          var remaining = definitions.map(definition => {
            var score = this.getEnemyBattleCardScore(definition, state);
            var recentUseCount = this.getEnemyRecentCardUseCount(definition.id, state);
            return {
              definition,
              score: score / (1 + recentUseCount * 0.75),
              recentUseCount
            };
          }).filter(candidate => candidate.score > 0).sort((a, b) => b.score - a.score || a.definition.id.localeCompare(b.definition.id));
          var selected = [];
          var deckSize = Math.max(0, Math.min(maxCount, remaining.length));

          var _loop = function _loop() {
            var slotsRemaining = deckSize - selected.length;
            var freshCandidates = remaining.filter(candidate => candidate.recentUseCount <= 0);
            var selectionCandidates = freshCandidates.length >= slotsRemaining ? freshCandidates : remaining;
            var bestScore = selectionCandidates[0].score;

            var scoreFloor = bestScore * _this.clamp01(_this.enemyCardDiversityScoreFloor);

            var minimumPoolSize = Math.min(selectionCandidates.length, Math.max(3, slotsRemaining + 2));
            var pool = selectionCandidates.filter(candidate => candidate.score >= scoreFloor); // Keep one credible alternative whenever it exists. This avoids
            // a single top-ranked combination repeating for every level.

            if (pool.length < minimumPoolSize) {
              pool = selectionCandidates.slice(0, minimumPoolSize);
            }

            var selectedIndex = Math.max(0, Math.min(pool.length - 1, Math.floor(_this.getEnemyDeckSeededRoll(_this.battleLevel, selected.length) * pool.length)));
            var selectedCandidate = pool[selectedIndex];
            selected.push(selectedCandidate.definition.id);
            remaining.splice(remaining.indexOf(selectedCandidate), 1);
          };

          while (remaining.length > 0 && selected.length < deckSize) {
            _loop();
          }

          return selected;
        }

        getEnemyRecentCardUseCount(cardId, state) {
          var result = 0;
          var inspectedDecks = 0;

          for (var level = this.battleLevel - 1; level >= 1 && inspectedDecks < 2; level--) {
            var deck = state.enemyCardIdsByLevel[String(level)];
            if (!Array.isArray(deck) || deck.length <= 0) continue;
            inspectedDecks++;

            if (deck.indexOf(cardId) >= 0) {
              result++;
            }
          }

          return result;
        }

        getEnemyDeckSeededRoll(level, slot) {
          var value = Math.max(1, Math.floor(level)) * 73856093 + (slot + 1) * 19349663 + 83492791 >>> 0;
          value = (value ^ value >>> 16) >>> 0;
          value = Math.imul(value, 0x7feb352d) >>> 0;
          value ^= value >>> 15;
          value = Math.imul(value, 0x846ca68b) >>> 0;
          value = (value ^ value >>> 16) >>> 0;
          return value / 0x100000000;
        }

        selectBotCooldownAdDeck(readyDefinitions, cooldownDefinitions, state, forceCompetitivePlan) {
          var _this2 = this;

          if (forceCompetitivePlan === void 0) {
            forceCompetitivePlan = false;
          }

          var deckSize = this.getBattleCardDeckSize();
          var candidates = [];
          var noAdDefinitions = readyDefinitions.slice();
          var noAdCardIds = this.selectBestPlayerCardIds(noAdDefinitions, state, deckSize);

          if (!this.allowAdsRescue || deckSize <= 0) {
            return {
              cardIds: noAdCardIds,
              candidates
            };
          }

          if (this.isPlayerDeckCompetitive(noAdCardIds, noAdDefinitions, state)) {
            return {
              cardIds: noAdCardIds,
              candidates
            };
          } // Build the smallest useful ad plan. Each step must improve the
          // selected deck, and the whole plan is discarded unless it changes
          // the matchup from disadvantaged to competitive.


          var availableDefinitions = noAdDefinitions.slice();
          var remainingCooldowns = cooldownDefinitions.slice();
          var cardIds = noAdCardIds;

          var _loop2 = function _loop2() {
            var bestDefinition = null;
            var bestDefinitions = [];
            var bestCardIds = cardIds;

            var bestScore = _this2.getPlayerDeckScore(cardIds, availableDefinitions, state);

            for (var i = 0; i < remainingCooldowns.length; i++) {
              var definition = remainingCooldowns[i];
              var proposedDefinitions = availableDefinitions.concat(definition);

              var proposedCardIds = _this2.selectBestPlayerCardIds(proposedDefinitions, state, deckSize);

              if (!proposedCardIds.includes(definition.id)) continue;

              var proposedScore = _this2.getPlayerDeckScore(proposedCardIds, proposedDefinitions, state);

              if (proposedScore > bestScore || proposedScore === bestScore && bestDefinition && definition.id.localeCompare(bestDefinition.id) < 0) {
                bestDefinition = definition;
                bestDefinitions = proposedDefinitions;
                bestCardIds = proposedCardIds;
                bestScore = proposedScore;
              }
            }

            if (!bestDefinition) return 0; // break

            availableDefinitions = bestDefinitions;
            cardIds = bestCardIds;
            remainingCooldowns = remainingCooldowns.filter(definition => definition.id !== bestDefinition.id);
            candidates.push({
              definition: bestDefinition,
              reason: 'deck-threshold-required'
            });

            if (_this2.isPlayerDeckCompetitive(cardIds, availableDefinitions, state)) {
              var mainLosses = Math.max(0, state.mainLossesAtCurrentLevel);

              if (!forceCompetitivePlan && !_this2.shouldBotUseCooldownAdPlan(mainLosses)) {
                return {
                  v: {
                    cardIds: noAdCardIds,
                    candidates: []
                  }
                };
              }

              var selectedCandidates = candidates.filter(candidate => cardIds.includes(candidate.definition.id));

              for (var _i = 0; _i < selectedCandidates.length; _i++) {
                selectedCandidates[_i].reason = forceCompetitivePlan ? 'prepared-deck-threshold' : "deck-threshold-after-" + mainLosses + "-main-losses";
              }

              return {
                v: {
                  cardIds,
                  candidates: selectedCandidates
                }
              };
            }
          },
              _ret;

          while (remainingCooldowns.length > 0) {
            _ret = _loop2();
            if (_ret === 0) break;
            if (_ret) return _ret.v;
          } // Do not spend ads for a deck that still cannot meet the enemy.


          return {
            cardIds: noAdCardIds,
            candidates: []
          };
        }

        shouldBotUseCooldownAdPlan(mainLosses) {
          if (mainLosses <= 0) return false; // A player can stubbornly retry early, but becomes progressively
          // more willing to watch ads after repeated losses on this same main
          // level. This applies only after a useful deck plan exists.

          return Math.random() < mainLosses / (mainLosses + 1);
        }

        getPlayerDeckScore(cardIds, definitions, state) {
          return cardIds.reduce((total, id) => {
            var definition = definitions.find(entry => entry.id === id);
            return total + (definition ? this.getPlayerBattleCardScore(definition, state) : 0);
          }, 0);
        }

        isPlayerDeckCompetitive(cardIds, definitions, state) {
          var playerStrength = this.getPlayerTeamCombatWeightForCardScore(state) + this.getPlayerDeckScore(cardIds, definitions, state);
          var enemyStrength = this.getEnemyTeamCombatWeightForCardScore(state) + this.getEnemyDeckScore(state);
          return playerStrength >= enemyStrength;
        }

        getEnemyDeckScore(state) {
          var manager = this.getGameManager();
          var database = manager ? manager.battleCardDatabase : null;
          if (!database) return 0;
          return this.currentEnemyBattleCardIds.reduce((total, id) => {
            var definition = database.getCard(id);
            return total + (definition ? this.getEnemyBattleCardScore(definition, state) : 0);
          }, 0);
        }

        getPlayerTeamCombatWeightForCardScore(state) {
          return this.getTeamCombatWeightForCardScore(0, state);
        }

        getEnemyTeamCombatWeightForCardScore(state) {
          return this.getTeamCombatWeightForCardScore(1, state);
        }

        getTeamCombatWeightForCardScore(team, state) {
          var total = 0;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var count = this.getTeamUnitCountForCardScore(rule, team, state);
            if (count <= 0) continue;
            total += count * this.getUnitCombatWeightForCardScore(rule, team);
          }

          return total;
        }

        getPlayerBattleCardScore(definition, state) {
          return this.getBattleCardScore(definition, 0, state, this.currentEnemyBattleCardIds);
        }

        getEnemyBattleCardScore(definition, state) {
          // Enemy decks are a deterministic level preset. They must not adapt
          // to the player's current collection or roster on retries.
          return this.getBattleCardScore(definition, 1, state, [], false);
        }

        getBattleCardScore(definition, team, state, opposingCardIds, useOpponentComposition) {
          if (useOpponentComposition === void 0) {
            useOpponentComposition = true;
          }

          var targetWeight = this.getCardTargetCombatWeight(definition, team, state);
          if (targetWeight <= 0) return 0;
          var saved = team === 0 ? this.getSavedCard(state, definition.id) : null;
          var budgetScale = saved ? this.getCardEffectiveBudget(saved) / Math.max(1, definition.baseBudget) : 1;
          var conditionScale = this.getCardOpponentConditionWeight(definition, state, team);
          var modifierScore = this.getCardModifierScore(definition, state, targetWeight, team);
          var ladderThreatScale = this.getMeleeLadderThreatScale(definition, team, state, opposingCardIds, useOpponentComposition);
          return Math.max(0, targetWeight * modifierScore * budgetScale * conditionScale * ladderThreatScale);
        }

        getCardTargetCombatWeight(definition, team, state) {
          var total = 0;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];

            if (!rule || !this.cardMatchesFamily(definition, rule.family)) {
              continue;
            }

            var count = this.getTeamUnitCountForCardScore(rule, team, state);
            if (count <= 0) continue;
            total += count * this.getUnitCombatWeightForCardScore(rule, team);
          }

          return total;
        }

        getTeamUnitCountForCardScore(rule, team, state) {
          if (team === 1) {
            return this.battleLevel >= this.getRuleUnlockLevel(rule) ? this.getEnemyUnitCount(rule, this.battleLevel) : 0;
          }

          var saved = this.getSavedUnit(state, this.getRuleKey(rule));
          return saved && saved.unlocked ? Math.max(0, saved.unitCount) : 0;
        }

        getUnitCombatWeightForCardScore(rule, team) {
          var entry = this.getUnitEntryForCardScore(rule, team);
          return Math.max(1, entry ? entry.combatPointCost : 1);
        }

        getCardModifierStrengthScale(definition, team, state) {
          if (!this.hasStrengthUpgrade(definition)) return 1;

          if (team === 1) {
            return this.getCardStrengthScale(definition, this.getEnemyStrengthUpgradeRank(definition, this.battleLevel));
          }

          var saved = this.getSavedCard(state, definition.id);

          if (!saved) {
            return this.getCardStrengthScale(definition, 0);
          }

          return this.getCardStrengthScale(definition, saved.strengthUpgradeLevel);
        }

        getMeleeLadderThreatScale(definition, team, state, opposingCardIds, useOpponentComposition) {
          if (!this.hasStrengthUpgrade(definition)) return 1;
          if (!useOpponentComposition) return 1;
          var nextFamily = this.getNextMeleeLadderFamily(definition.targetFamily);
          if (nextFamily === null) return 1;
          var opposingTeam = team === 1 ? 0 : 1;
          var totalWeight = 0;
          var nextFamilyWeight = 0;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var weight = this.getTeamUnitCountForCardScore(rule, opposingTeam, state) * this.getUnitCombatWeightForCardScore(rule, opposingTeam);
            totalWeight += weight;

            if (rule.family === nextFamily) {
              nextFamilyWeight += weight;
            }
          }

          if (nextFamilyWeight <= 0 || totalWeight <= 0) return 1; // Counter pressure can raise the value of a Strength-upgrade card,
          // but must never erase its base combat effect before that counter is
          // unlocked.

          return Math.max(1, nextFamilyWeight / totalWeight * this.getEnemyCardPressureScale(nextFamily, opposingCardIds));
        }

        getNextMeleeLadderFamily(family) {
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear) return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Sword;
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Sword) return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman;
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman) return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry;
          return null;
        }

        getEnemyCardPressureScale(threatenedFamily, opposingCardIds) {
          var manager = this.getGameManager();
          var database = manager ? manager.battleCardDatabase : null;
          if (!database) return 1;
          var pressure = 0;

          for (var i = 0; i < opposingCardIds.length; i++) {
            var definition = database.getCard(opposingCardIds[i]);
            if (!definition) continue;

            if (this.cardMatchesFamily(definition, threatenedFamily)) {
              pressure += definition.target === (_crd && BattleCardTarget === void 0 ? (_reportPossibleCrUseOfBattleCardTarget({
                error: Error()
              }), BattleCardTarget) : BattleCardTarget).AllUnits ? 0.1 : 0.35;
            }
          }

          return 1 + pressure;
        }

        getStrengthUpgradeMaxRank(definition) {
          return Math.max(0, Math.floor(definition.strengthUpgradeMaxRank));
        }

        hasStrengthUpgrade(definition) {
          return this.getStrengthUpgradeMaxRank(definition) > 0;
        }

        getCardStrengthScale(definition, rank) {
          var base = this.clamp01(definition.baseStrengthScale);
          var maxRank = this.getStrengthUpgradeMaxRank(definition);
          if (maxRank <= 0) return 1;
          return base + (1 - base) * this.clamp01(rank / maxRank);
        }

        getEnemyStrengthUpgradeRank(definition, level) {
          return this.getCardUpgradeRankLimitAtLevel(definition, 'strength', level);
        }

        getCardOpponentConditionWeight(definition, state, team) {
          if (team === void 0) {
            team = 0;
          }

          if (definition.requiredEnemyFamily === (_crd && BattleCardOpponentCondition === void 0 ? (_reportPossibleCrUseOfBattleCardOpponentCondition({
            error: Error()
          }), BattleCardOpponentCondition) : BattleCardOpponentCondition).Any) {
            return 1;
          }

          var requiredFamily = definition.requiredEnemyFamily - 1;
          var totalEnemyWeight = 0;
          var requiredEnemyWeight = 0;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var weight = this.getTeamUnitCountForCardScore(rule, team === 1 ? 0 : 1, state) * this.getUnitCombatWeightForCardScore(rule, team === 1 ? 0 : 1);
            totalEnemyWeight += weight;

            if (rule.family === requiredFamily) {
              requiredEnemyWeight += weight;
            }
          }

          return totalEnemyWeight > 0 ? requiredEnemyWeight / totalEnemyWeight : 0;
        }

        getCardModifierScore(definition, state, targetWeight, team) {
          return this.getCardModifierValueScore(definition, definition.modifier, definition.modifierValue * this.getCardModifierStrengthScale(definition, team, state), state, targetWeight, team) + this.getCardModifierValueScore(definition, definition.tradeoffModifier, definition.tradeoffValue * this.getCardModifierStrengthScale(definition, team, state), state, targetWeight, team);
        }

        getCardModifierValueScore(definition, modifier, value, state, targetWeight, team) {
          switch (modifier) {
            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).DamagePercent:
            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).AttackRangePercent:
            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).DamageRadiusPercent:
            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).MoveSpeedPercent:
              return value / 100;

            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).DefenseFlat:
              return this.getDefenseModifierScore(definition, value, state, targetWeight, team);

            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).CounterImmunity:
              return this.getCounterImmunityScore(definition, state, targetWeight, team);

            default:
              return 0;
          }
        }

        getDefenseModifierScore(definition, value, state, targetWeight, team) {
          var enemyDamage = this.getAverageUnitStatForCardScore(team === 1 ? 0 : 1, state, 'damage');
          var targetDefense = this.getAverageTargetUnitDefenseForCardScore(definition, state, targetWeight, team);
          var before = Math.max(1, enemyDamage - targetDefense);
          var after = Math.max(1, enemyDamage - targetDefense - value);
          return before / after - 1;
        }

        getCounterImmunityScore(definition, state, targetWeight, team) {
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter || targetWeight <= 0) return 0;
          var weightedThreat = 0;
          var totalEnemyWeight = 0;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var enemyRule = this.unitProgressionRules[i];
            if (!enemyRule) continue;
            var enemyWeight = this.getTeamUnitCountForCardScore(enemyRule, team === 1 ? 0 : 1, state) * this.getUnitCombatWeightForCardScore(enemyRule, team === 1 ? 0 : 1);
            totalEnemyWeight += enemyWeight;

            for (var j = 0; j < this.unitProgressionRules.length; j++) {
              var targetRule = this.unitProgressionRules[j];

              if (!targetRule || !this.cardMatchesFamily(definition, targetRule.family)) {
                continue;
              }

              var targetUnitWeight = this.getTeamUnitCountForCardScore(targetRule, team, state) * this.getUnitCombatWeightForCardScore(targetRule, team);
              weightedThreat += targetUnitWeight * enemyWeight * Math.max(0, counter.getDamageMultiplier(enemyRule.family, targetRule.family) - 1);
            }
          }

          return totalEnemyWeight > 0 ? weightedThreat / (targetWeight * totalEnemyWeight) : 0;
        }

        getAverageUnitStatForCardScore(team, state, stat) {
          var totalWeight = 0;
          var totalStat = 0;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var count = this.getTeamUnitCountForCardScore(rule, team, state);
            if (count <= 0) continue;
            var entry = this.getUnitEntryForCardScore(rule, team);
            var weight = count * this.getUnitCombatWeightForCardScore(rule, team);
            totalWeight += weight;
            totalStat += weight * (entry ? entry[stat] : 0);
          }

          return totalWeight > 0 ? totalStat / totalWeight : 0;
        }

        getAverageTargetUnitDefenseForCardScore(definition, state, targetWeight, team) {
          if (targetWeight <= 0) return 0;
          var totalDefense = 0;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];

            if (!rule || !this.cardMatchesFamily(definition, rule.family)) {
              continue;
            }

            var weight = this.getTeamUnitCountForCardScore(rule, team, state) * this.getUnitCombatWeightForCardScore(rule, team);
            var entry = this.getUnitEntryForCardScore(rule, team);
            totalDefense += weight * (entry ? entry.defense : 0);
          }

          return totalDefense / targetWeight;
        }

        getUnitEntryForCardScore(rule, team) {
          var manager = this.getGameManager();
          var entries = manager && manager.unitDatabase ? manager.unitDatabase.getTeamEntries(team) : [];
          return entries.find(entry => entry && entry.family === rule.family && entry.tier === rule.tier) || entries.find(entry => entry && entry.family === rule.family) || null;
        }

        advancePlayerCardCooldowns(state, usedCardIds) {
          for (var i = 0; i < state.cards.length; i++) {
            var card = state.cards[i];

            if (!card.owned || card.cooldownRemaining <= 0) {
              continue;
            }

            card.cooldownRemaining = Math.max(0, card.cooldownRemaining - 1);
          }

          for (var _i2 = 0; _i2 < usedCardIds.length; _i2++) {
            var _card = this.getSavedCard(state, usedCardIds[_i2]);

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
            strengthUpgradeLevel: 0,
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

        getFullPlayerCardProgressionWave() {
          var result = 0;

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            result = Math.max(result, this.getUnitFamilyCardProgressionWave(rule.family));
          }

          return result;
        }

        getPlayerCardStrengthScales(state) {
          var result = {};
          var manager = this.getGameManager();
          var database = manager && manager.battleCardDatabase ? manager.battleCardDatabase : null;
          if (!state || !database) return result;

          for (var i = 0; i < state.cards.length; i++) {
            var card = state.cards[i];
            if (!card.owned) continue;
            var definition = database.getCard(card.id);

            if (!definition || !this.hasStrengthUpgrade(definition)) {
              continue;
            }

            result[card.id] = this.getCardStrengthScale(definition, card.strengthUpgradeLevel);
          }

          return result;
        }

        getEnemyCardStrengthScales() {
          var result = {};
          var manager = this.getGameManager();
          var database = manager && manager.battleCardDatabase ? manager.battleCardDatabase : null;
          if (!database) return result;

          for (var i = 0; i < database.cards.length; i++) {
            var definition = database.cards[i];

            if (this.hasStrengthUpgrade(definition)) {
              result[definition.id] = this.getCardStrengthScale(definition, this.getEnemyStrengthUpgradeRank(definition, this.battleLevel));
            }
          }

          return result;
        }

        getUnitFamilyCardProgressionWave(family) {
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Monk) return 4;
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Cavalry) return 3;
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Archer) return 2;
          if (family === (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Axeman) return 1;
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

        getCardUpgradeRankLimit(definition, upgradeKind) {
          return this.getCardUpgradeRankLimitAtLevel(definition, upgradeKind, this.battleLevel);
        }

        getCardUpgradeMaxRank(definition, upgradeKind) {
          return upgradeKind === 'strength' ? this.getStrengthUpgradeMaxRank(definition) : 2;
        }

        getCardUpgradeRankLimitAtLevel(definition, upgradeKind, level) {
          var safeLevel = this.clampLevel(level);
          var maxRank = this.getCardUpgradeMaxRank(definition, upgradeKind);
          var rankLimit = 0;
          var schedule = this.getCardUpgradeSchedule();

          var _loop3 = function _loop3(rank) {
            var offer = schedule.find(item => item.cardId === definition.id && item.upgradeKind === upgradeKind && item.rank === rank);
            if (!offer || offer.offerLevel > safeLevel) return 1; // break

            rankLimit = rank;
          };

          for (var rank = 1; rank <= maxRank; rank++) {
            if (_loop3(rank)) break;
          }

          return rankLimit;
        }

        getCardUpgradeSchedule() {
          var manager = this.getGameManager();
          var database = manager ? manager.battleCardDatabase : null;
          if (!database) return [];
          var fullProgressionWave = this.getFullPlayerCardProgressionWave();
          var offersByWave = new Map();
          var postProgressionPending = [];

          for (var i = 0; i < database.cards.length; i++) {
            var definition = database.cards[i];
            if (!definition || !definition.id) continue;
            var upgradeKinds = ['cooldown', 'budget', 'strength'];

            for (var kindIndex = 0; kindIndex < upgradeKinds.length; kindIndex++) {
              var upgradeKind = upgradeKinds[kindIndex];
              var maxRank = this.getCardUpgradeMaxRank(definition, upgradeKind);

              for (var rank = 1; rank <= maxRank; rank++) {
                var offerWave = this.getCardProgressionWave(definition) + rank;

                if (offerWave > fullProgressionWave) {
                  postProgressionPending.push({
                    cardId: definition.id,
                    upgradeKind,
                    rank,
                    offerLevel: 0
                  });
                  continue;
                }

                var pending = offersByWave.get(offerWave);

                if (!pending) {
                  pending = [];
                  offersByWave.set(offerWave, pending);
                }

                pending.push({
                  cardId: definition.id,
                  upgradeKind,
                  rank,
                  offerLevel: 0
                });
              }
            }
          }

          var result = [];
          var offerWaves = Array.from(offersByWave.keys()).sort((a, b) => a - b);

          for (var _i3 = 0; _i3 < offerWaves.length; _i3++) {
            var _offerWave = offerWaves[_i3];

            var _pending = offersByWave.get(_offerWave) || [];

            var offerLevels = this.getCardUpgradeOfferLevels(_offerWave, fullProgressionWave);
            if (offerLevels.length <= 0) continue;

            for (var itemIndex = 0; itemIndex < _pending.length; itemIndex++) {
              result.push(_extends({}, _pending[itemIndex], {
                offerLevel: offerLevels[Math.min(offerLevels.length - 1, Math.floor(itemIndex * offerLevels.length / _pending.length))]
              }));
            }
          }

          var postProgressionOfferLevels = this.getCardUpgradeOfferLevels(fullProgressionWave + 1, fullProgressionWave);

          for (var index = 0; index < postProgressionPending.length; index++) {
            result.push(_extends({}, postProgressionPending[index], {
              offerLevel: postProgressionOfferLevels[Math.min(postProgressionOfferLevels.length - 1, Math.floor(index * postProgressionOfferLevels.length / postProgressionPending.length))]
            }));
          }

          return result;
        }

        getCardUpgradeOfferLevels(offerWave, fullProgressionWave) {
          var progressionEnd = this.getUnitProgressionEndLevel();
          var totalLevels = this.getSafeTotalLevels();
          var startLevel = offerWave <= fullProgressionWave ? this.getCardProgressionWaveStartLevel(offerWave) : progressionEnd + 1;
          var nextWaveStart = offerWave < fullProgressionWave ? this.getCardProgressionWaveStartLevel(offerWave + 1) : progressionEnd + 1;
          var endLevel = offerWave <= fullProgressionWave ? Math.min(totalLevels, nextWaveStart - 1) : totalLevels - 1;
          var result = [];

          for (var level = startLevel; level <= endLevel; level++) {
            // The first level of a wave is its presentation moment, even when
            // it is a boss. Later boss levels remain clear of new offers.
            if (level === startLevel || !this.isBossLevelFor(level)) {
              result.push(level);
            }
          }

          return result.length > 0 ? result : [Math.min(totalLevels, startLevel)];
        }

        getCardProgressionWaveStartLevel(wave) {
          if (wave <= 0) return 2;
          var result = this.getUnitProgressionEndLevel();

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];

            if (!rule || this.getUnitFamilyCardProgressionWave(rule.family) !== wave) {
              continue;
            }

            result = Math.min(result, this.getRuleUnlockLevel(rule));
          }

          return result;
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
            enemyPool: definition.enemyPool,
            baseStrengthScale: definition.baseStrengthScale,
            strengthUpgradeMaxRank: definition.strengthUpgradeMaxRank,
            strengthUpgradeFirstCostMultiplier: definition.strengthUpgradeFirstCostMultiplier,
            strengthUpgradeFinalCostMultiplier: definition.strengthUpgradeFinalCostMultiplier
          }));
        }

        sanitizeProgressionState(source) {
          var _this3 = this;

          var initial = this.createInitialProgressionState();
          var sourceVersion = this.safeInteger(source.version, 0);

          if (sourceVersion !== 8 && sourceVersion !== 9 && sourceVersion !== 10 && sourceVersion !== 11 && sourceVersion !== 12 && sourceVersion !== 13) {
            return initial;
          }

          var savedUnits = Array.isArray(source.units) ? source.units : [];
          var savedCPPackages = Array.isArray(source.cpPackages) ? source.cpPackages : [];
          var savedMaxAlivePackages = Array.isArray(source.maxAlivePackages) ? source.maxAlivePackages : [];
          var savedCards = Array.isArray(source.cards) ? source.cards : [];
          var savedBotSimulationEvents = Array.isArray(source.botSimulationEvents) ? source.botSimulationEvents : [];
          initial.currentLevel = this.clampLevel(this.safeInteger(source.currentLevel, initial.currentLevel));
          initial.telemetryRunId = typeof source.telemetryRunId === 'string' && source.telemetryRunId.length > 0 ? source.telemetryRunId : initial.telemetryRunId;
          initial.telemetryBattleIndex = Math.max(0, this.safeInteger(source.telemetryBattleIndex, 0));
          initial.playerGold = Math.max(0, this.safeInteger(source.playerGold, 0));
          initial.adsReward = Math.max(0, this.safeInteger(source.adsReward, 0));
          initial.levelLossCount = Math.max(0, this.safeInteger(source.levelLossCount, 0));
          initial.mainLossesAtCurrentLevel = Math.max(0, this.safeInteger(source.mainLossesAtCurrentLevel, 0));
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
            adsReason: typeof event.adsReason === 'string' ? event.adsReason : '',
            normalGold: Math.max(0, this.safeInteger(event.normalGold, 0)),
            doubleGold: Math.max(0, this.safeInteger(event.doubleGold, 0)),
            normalPurchaseCount: Math.max(0, this.safeInteger(event.normalPurchaseCount, 0)),
            doublePurchaseCount: Math.max(0, this.safeInteger(event.doublePurchaseCount, 0)),
            delayedPurchaseCount: Math.max(0, this.safeInteger(event.delayedPurchaseCount, 0)),
            continuationChance: this.clamp01(typeof event.continuationChance === 'number' ? event.continuationChance : 0)
          }));
          initial.playerInitialCPOverflow = Math.max(0, this.safeInteger(source.playerInitialCPOverflow, 0));

          var _loop4 = function _loop4() {
            var item = initial.cpPackages[i];
            var saved = savedCPPackages.find(candidate => candidate && candidate.id === item.id);
            if (!saved) return 1; // continue

            item.claimed = !!saved.claimed;
            item.claimSource = item.claimed && typeof saved.claimSource === 'string' ? saved.claimSource : '';
          };

          for (var i = 0; i < initial.cpPackages.length; i++) {
            if (_loop4()) continue;
          }

          var _loop5 = function _loop5() {
            var item = initial.maxAlivePackages[_i4];
            var saved = savedMaxAlivePackages.find(candidate => candidate && candidate.id === item.id);
            if (!saved) return 1; // continue

            item.claimed = !!saved.claimed;
            item.claimSource = item.claimed && typeof saved.claimSource === 'string' ? saved.claimSource : '';
          };

          for (var _i4 = 0; _i4 < initial.maxAlivePackages.length; _i4++) {
            if (_loop5()) continue;
          }

          initial.playerInitialCP = this.getPlayerCPFromState(initial);
          initial.playerMaxAlive = this.getPlayerMaxAliveFromState(initial);
          initial.totalPurchases = Math.max(0, this.safeInteger(source.totalPurchases, 0));
          initial.mainBattleEntryCount = Math.max(0, this.safeInteger(source.mainBattleEntryCount, initial.currentLevel > 1 ? 1 : 0));
          var savedEnemyDecks = source.enemyCardIdsByLevel;
          var savedEnemyDeckPolicyVersion = this.safeInteger(source.enemyCardDeckPolicyVersion, 0);

          if (savedEnemyDeckPolicyVersion === this.enemyCardDeckPolicyVersion && savedEnemyDecks && typeof savedEnemyDecks === 'object' && !Array.isArray(savedEnemyDecks)) {
            for (var key of Object.keys(savedEnemyDecks)) {
              var level = this.safeInteger(key, 0);
              var deck = savedEnemyDecks[key];
              if (level < 1 || !Array.isArray(deck)) continue;
              initial.enemyCardIdsByLevel[String(level)] = deck.filter(id => typeof id === 'string').slice(0, 3);
            }
          } else if (savedEnemyDeckPolicyVersion === this.enemyCardDeckPolicyVersion && Array.isArray(source.lastEnemyCardIds)) {
            var _level = initial.currentLevel;
            initial.enemyCardIdsByLevel[String(_level)] = source.lastEnemyCardIds.filter(id => typeof id === 'string').slice(0, 3);
          }

          var _loop6 = function _loop6() {
            var _this3$getGameManager;

            var card = initial.cards[_i5];
            var definition = (_this3$getGameManager = _this3.getGameManager()) != null && _this3$getGameManager.battleCardDatabase ? _this3.getGameManager().battleCardDatabase.getCard(card.id) : null;
            var saved = savedCards.find(candidate => candidate && candidate.id === card.id);
            if (!saved) return 1; // continue

            card.owned = !!saved.owned;
            card.cooldownUpgradeLevel = Math.max(0, Math.min(2, _this3.safeInteger(saved.cooldownUpgradeLevel, 0)));
            card.budgetUpgradeLevel = Math.max(0, Math.min(2, _this3.safeInteger(saved.budgetUpgradeLevel, 0)));
            card.strengthUpgradeLevel = Math.max(0, Math.min(definition && _this3.hasStrengthUpgrade(definition) ? _this3.getStrengthUpgradeMaxRank(definition) : 0, _this3.safeInteger(saved.strengthUpgradeLevel, 0)));
            card.cooldownRemaining = Math.max(0, _this3.safeInteger(saved.cooldownRemaining, 0));
          };

          for (var _i5 = 0; _i5 < initial.cards.length; _i5++) {
            if (_loop6()) continue;
          }

          var _loop7 = function _loop7() {
            var unit = initial.units[_i6];
            var saved = savedUnits.find(candidate => candidate && candidate.key === unit.key);

            var rule = _this3.getRuleByKey(unit.key);

            if (!saved || !rule) return 1; // continue

            unit.offered = !!saved.offered || unit.offered;
            unit.unlocked = !!saved.unlocked || unit.unlocked;
            unit.unitCount = Math.max(_this3.getRuleUnlockCount(rule), Math.min(_this3.getRuleMaxCount(rule), _this3.safeInteger(saved.unitCount, unit.unitCount)));
          };

          for (var _i6 = 0; _i6 < initial.units.length; _i6++) {
            if (_loop7()) continue;
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

          for (var _i7 = 0; _i7 < playerBrains.length; _i7++) {
            playerBrains[_i7].maxAliveWaves = state.playerMaxAlive;
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

          for (var _i8 = 0; _i8 < enemyBrains.length; _i8++) {
            enemyBrains[_i8].maxAliveWaves = state.playerMaxAlive;

            if (this.allowDecisionAccuracy) {
              enemyBrains[_i8].decisionAccuracy = baselineAccuracy;
            }
          }
        }

        configureSideMissionBattleCards() {
          this.currentPlayerBattleCardIds = [];
          this.currentEnemyBattleCardIds = [];
          this.currentPlayerCooldownAdReasons.clear();
          var manager = this.getGameManager();
          if (!manager) return;
          manager.configureBattleCardDecks([], [], {}, {}, {}, 0, 0);
        }

        getPurchaseOptions(state) {
          var options = [];
          var manager = this.getGameManager();

          if (!manager || !manager.unitDatabase) {
            return options;
          } // Level 1 is the tutorial battle: show no purchasable progression
          // packages until the player reaches the pre-battle flow for level 2.


          if (this.battleLevel <= 1) {
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
            for (var _i9 = 0; _i9 < cardDatabase.cards.length; _i9++) {
              var definition = cardDatabase.cards[_i9];
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

              var cooldownUpgradeRankLimit = this.getCardUpgradeRankLimit(definition, 'cooldown');
              var budgetUpgradeRankLimit = this.getCardUpgradeRankLimit(definition, 'budget');
              var strengthUpgradeRankLimit = this.getCardUpgradeRankLimit(definition, 'strength');

              if (_saved.cooldownUpgradeLevel < cooldownUpgradeRankLimit) {
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

              if (_saved.budgetUpgradeLevel < budgetUpgradeRankLimit) {
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

              if (_saved.strengthUpgradeLevel < strengthUpgradeRankLimit) {
                var _nextLevel2 = _saved.strengthUpgradeLevel + 1;

                options.push({
                  id: "card-strength:" + definition.id + ":" + _nextLevel2,
                  kind: 'card-strength-upgrade',
                  cost: this.getCardStrengthUpgradeCost(definition, _nextLevel2),
                  family: null,
                  tier: 0,
                  delta: 1,
                  label: definition.displayName + " Strength +1",
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

        getCardStrengthUpgradeCost(definition, nextLevel) {
          var maxRank = this.getStrengthUpgradeMaxRank(definition);
          var first = Math.max(0.01, definition.strengthUpgradeFirstCostMultiplier);
          var final = Math.max(first, definition.strengthUpgradeFinalCostMultiplier);
          var progress = maxRank <= 1 ? 1 : this.clamp01((nextLevel - 1) / (maxRank - 1));
          var ratio = first + (final - first) * progress;
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
            options = options.filter(option => option.kind !== 'card-unlock' && option.kind !== 'card-cooldown-upgrade' && option.kind !== 'card-budget-upgrade' && option.kind !== 'card-strength-upgrade');
          }

          if (this.shouldBotPrioritizeCardUnlocks(state)) {
            options = options.filter(option => option.kind !== 'card-cooldown-upgrade' && option.kind !== 'card-budget-upgrade' && option.kind !== 'card-strength-upgrade');
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

        getBotPreparationPlan(state) {
          var currentStrength = this.getPreparedPlayerStrength(state);
          var enemyStrength = this.getEnemyTeamCombatWeightForCardScore(state) + this.getEnemyDeckScore(state);
          var target = null;
          var targetStrength = currentStrength;
          var options = this.getPurchaseOptions(state);

          for (var i = 0; i < options.length; i++) {
            var option = options[i];
            var simulated = JSON.parse(JSON.stringify(state));
            this.applyPurchaseToState(option, simulated);
            var simulatedStrength = this.getPreparedPlayerStrength(simulated);

            if (simulatedStrength > targetStrength || simulatedStrength === targetStrength && target && option.cost < target.cost || simulatedStrength === targetStrength && target && option.cost === target.cost && option.id.localeCompare(target.id) < 0) {
              target = option;
              targetStrength = simulatedStrength;
            }
          }

          return {
            target: currentStrength < enemyStrength ? target : null,
            currentStrength,
            targetStrength,
            enemyStrength
          };
        }

        getPreparedPlayerStrength(state) {
          var manager = this.getGameManager();
          var database = manager ? manager.battleCardDatabase : null;
          var definitions = database ? database.cards.filter(definition => {
            var saved = this.getSavedCard(state, definition.id);
            return !!saved && saved.owned && this.isCardEligibleForTeam(definition, 0, state);
          }) : [];
          var cardIds = this.selectBestPlayerCardIds(definitions, state, this.getBattleCardDeckSize());
          return this.getPlayerTeamCombatWeightForCardScore(state) + this.getPlayerDeckScore(cardIds, definitions, state);
        }

        shouldBotPrepareBattleCards(state) {
          var manager = this.getGameManager();
          var database = manager ? manager.battleCardDatabase : null;
          if (!database) return false;
          var readyDefinitions = database.cards.filter(definition => {
            var saved = this.getSavedCard(state, definition.id);
            return !!saved && saved.owned && saved.cooldownRemaining <= 0 && this.isCardEligibleForTeam(definition, 0, state);
          });
          var readyCardIds = this.selectBestPlayerCardIds(readyDefinitions, state, this.getBattleCardDeckSize());
          return !this.isPlayerDeckCompetitive(readyCardIds, readyDefinitions, state) && this.getPreparedPlayerStrength(state) >= this.getEnemyTeamCombatWeightForCardScore(state) + this.getEnemyDeckScore(state);
        }

        tryPurchaseBotPreparationTarget(plan, records, reservedGold) {
          if (!this.progressionState || !plan.target) return false;
          var availableGold = this.progressionState.playerGold - Math.max(0, reservedGold);
          if (plan.target.cost > availableGold) return false;
          records.push(this.applyPurchase(plan.target, this.progressionState, 'pre-battle-preparation'));
          return true;
        }

        tryRouteBotToSideMission(preparationPlan) {
          if (preparationPlan === void 0) {
            preparationPlan = null;
          }

          if (!this.progressionState) return false;
          var state = this.progressionState;

          if (preparationPlan && preparationPlan.target) {
            var requiredGold = preparationPlan.target.cost + this.getCurrentMainBattleEntryFee();

            if (state.playerGold < requiredGold) {
              this.recordBotSimulationEvent(state, {
                type: 'side-mission-entry-preparation',
                battleLevel: this.battleLevel,
                choice: 'side-mission',
                targetId: preparationPlan.target.id,
                targetCost: preparationPlan.target.cost,
                baseGold: 0,
                goldGranted: 0
              });
              return true;
            }
          }

          if (state.levelLossCount <= 0) return false;
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
          var record = {
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
          };
          records.push(record);
          this.recordPurchaseTelemetryAction(record);
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

        getMainBattleReward(level) {
          var safeLevel = this.clampLevel(level);
          var plan = this.getMainBattleGoldPlan();
          return {
            targetId: 'mainline-gold-plan',
            targetCost: 0,
            gold: plan[safeLevel - 1] || 0
          };
        }

        getMainBattleGoldPlan() {
          var totalLevels = this.getSafeTotalLevels();

          if (this.mainBattleGoldPlan && this.mainBattleGoldPlan.length === totalLevels) {
            return this.mainBattleGoldPlan;
          }

          var plannedPurchaseBudgets = this.getMainlinePlannedPurchaseBudgets();
          var result = [];
          var previousReward = 0;
          var availableGold = Math.max(0, Math.floor(this.initialPlayerGold));

          for (var level = 1; level <= totalLevels; level++) {
            var nextLevel = level + 1;
            var baseReward = Math.ceil(this.getMainBattleWinGold(level) / 50) * 50;
            var reward = Math.max(previousReward, baseReward);

            if (nextLevel <= totalLevels) {
              var nextPurchaseBudget = plannedPurchaseBudgets[nextLevel - 1];

              while (availableGold + reward < nextPurchaseBudget + this.getMainBattleEntryFeeForReward(reward)) {
                reward += 50;
              }
            }

            result.push(reward);
            previousReward = reward;
            availableGold += reward;

            if (nextLevel <= totalLevels) {
              availableGold -= plannedPurchaseBudgets[nextLevel - 1] + this.getMainBattleEntryFeeForReward(reward);
            }
          }

          this.mainBattleGoldPlan = result;
          return result;
        }

        getMainlinePlannedPurchaseBudgets() {
          var totalLevels = this.getSafeTotalLevels();
          var result = new Array(totalLevels).fill(0);
          var savedState = this.progressionState;
          var savedBattleLevel = this.battleLevel;

          try {
            var planState = this.createInitialProgressionState();
            this.progressionState = planState; // This is an affordability-independent forecast. Runtime buying
            // still uses the player's real gold and its weighted choice.

            planState.playerGold = Number.MAX_SAFE_INTEGER;

            for (var level = 1; level <= totalLevels; level++) {
              this.battleLevel = level;
              this.offerIntroducedUnits(level);
              var options = this.getBotPurchaseCandidates(planState, false);
              if (options.length <= 0) continue; // Fund the most expensive eligible choice, rather than the
              // sum of the whole shop. This preserves a real choice while
              // keeping the no-loss route able to buy any current option.

              result[level - 1] = options.reduce((highestCost, option) => Math.max(highestCost, option.cost), 0);
              var plannedOption = options.slice().sort((a, b) => {
                var weightDifference = this.getPurchaseWeight(b) - this.getPurchaseWeight(a);

                if (weightDifference !== 0) {
                  return weightDifference;
                }

                return b.cost - a.cost || a.id.localeCompare(b.id);
              })[0];
              if (!plannedOption) continue;
              this.applyPurchaseToState(plannedOption, planState);
            }
          } finally {
            this.progressionState = savedState;
            this.battleLevel = savedBattleLevel;
          }

          return result;
        }

        getMainBattleEntryFee(level) {
          var safeLevel = this.clampLevel(level);
          if (safeLevel <= 1) return 0;
          return this.getMainBattleEntryFeeForReward(this.getMainBattleReward(safeLevel - 1).gold);
        }

        getMainBattleEntryFeeForReward(reward) {
          var baseFee = Math.max(0, reward) * this.clamp01(this.mainBattleEntryFeeRatio);
          return Math.max(0, Math.ceil(baseFee / 50) * 50);
        }

        getCurrentMainBattleEntryFee() {
          if (!this.progressionState) return 0;
          return this.progressionState.mainBattleEntryCount <= 0 ? 0 : this.getMainBattleEntryFee(this.battleLevel);
        }

        getSideMissionReward() {
          var baseGold = Math.max(50, this.getMainBattleEntryFee(this.battleLevel));
          return {
            targetId: '',
            targetCost: 0,
            gold: baseGold
          };
        }

        getSideMissionContinuation(state) {
          var candidates = this.getBotPurchaseCandidates(state, false);
          var delayedPurchases = candidates.filter(option => option.cost > state.playerGold);
          var delayedPurchaseCount = delayedPurchases.length;
          var target = this.pickWeightedPurchase(delayedPurchases);
          var entryFee = this.getCurrentMainBattleEntryFee();
          var sideReward = this.getSideMissionReward().gold;
          var targetShortfall = target ? Math.max(0, target.cost + entryFee - state.playerGold) : 0;
          var resolvesTargetWithOneSide = !!target && targetShortfall > 0 && targetShortfall <= sideReward;
          return {
            delayedPurchaseCount,
            chance: resolvesTargetWithOneSide ? 0.5 : 0
          };
        }

        finishBotSelectedCardCooldowns(state) {
          if (!this.allowAdsRescue) return;

          for (var i = 0; i < this.currentPlayerBattleCardIds.length; i++) {
            var cardId = this.currentPlayerBattleCardIds[i];
            var card = this.getSavedCard(state, cardId);

            if (!card || !card.owned || card.cooldownRemaining <= 0) {
              continue;
            }

            var cooldownBefore = card.cooldownRemaining;
            card.cooldownRemaining = 0;
            state.adsReward++;
            this.recordTelemetryAction({
              type: 'card-cooldown-finish-ad',
              goldBefore: state.playerGold,
              goldAfter: state.playerGold,
              cardId,
              source: 'bot-card-cooldown-ad',
              cost: 0,
              goldGranted: 0,
              adsReason: this.currentPlayerCooldownAdReasons.get(cardId) || 'selected-cooling-card'
            });
            this.recordBotSimulationEvent(state, {
              type: 'card-cooldown-finish-ad',
              battleLevel: this.battleLevel,
              choice: 'finish-cooldown-ad',
              targetId: cardId,
              targetCost: cooldownBefore,
              baseGold: 0,
              goldGranted: 0,
              adsReason: this.currentPlayerCooldownAdReasons.get(cardId) || 'selected-cooling-card'
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

          var reward = Math.max(0, Math.floor(baseGold));
          var decision = this.getBotGoldClaimDecision(state, reward, type);
          var useAds = this.purchasingSimulation && this.allowAdsRescue && state.levelLossCount > 0 && decision.useAds;
          var goldGranted = reward * (useAds ? 2 : 1);
          var event = {
            type,
            battleLevel: this.battleLevel,
            choice: useAds ? 'gold-x2-ad' : 'gold',
            targetId: useAds && decision.targetId ? decision.targetId : targetId,
            targetCost: useAds && decision.targetCost > 0 ? decision.targetCost : targetCost,
            baseGold: reward,
            goldGranted,
            adsReason: !this.purchasingSimulation ? 'bot-simulation-disabled' : !this.allowAdsRescue ? 'ads-disabled' : state.levelLossCount <= 0 ? 'mainline-run-no-rescue-needed' : decision.useAds ? decision.reason : 'no-material-benefit',
            normalGold: decision.normalGold,
            doubleGold: decision.doubleGold,
            normalPurchaseCount: decision.normalPurchaseCount,
            doublePurchaseCount: decision.doublePurchaseCount
          };
          var goldBefore = state.playerGold;
          state.playerGold += goldGranted;
          if (useAds) state.adsReward++;
          this.recordTelemetryAction({
            type: useAds ? 'reward-gold-x2-ad' : 'reward-gold',
            goldBefore,
            goldAfter: state.playerGold,
            cardId: targetId || null,
            source: type,
            cost: 0,
            goldGranted,
            adsReason: event.adsReason
          });
          this.recordBotSimulationEvent(state, event);
          return event;
        }

        getBotGoldClaimDecision(state, reward, type) {
          var normalGold = state.playerGold + reward;
          var doubleGold = normalGold + reward;
          var nextLevel = type === 'progression-win' ? Math.min(this.getSafeTotalLevels(), this.battleLevel + 1) : this.battleLevel;
          var entryFee = type === 'progression-win' && this.battleLevel >= this.getSafeTotalLevels() ? 0 : this.getMainBattleEntryFee(nextLevel);
          var preparationPlan = type === 'side-mission-win' ? this.getBotPreparationPlan(state) : null;
          var preparationTarget = preparationPlan ? preparationPlan.target : null;
          var preparationGoldNeeded = preparationTarget ? preparationTarget.cost + entryFee : 0;

          if (preparationTarget && normalGold < preparationGoldNeeded && doubleGold >= preparationGoldNeeded) {
            return {
              useAds: true,
              reason: 'complete-preparation-target',
              targetId: preparationTarget.id,
              targetCost: preparationTarget.cost,
              normalGold,
              doubleGold,
              normalPurchaseCount: 0,
              doublePurchaseCount: 1
            };
          }

          var candidates = this.getBotPurchaseCandidates(state, false);
          var normalPurchases = candidates.filter(option => option.cost <= normalGold - entryFee);
          var doubleOnlyPurchases = candidates.filter(option => option.cost > normalGold - entryFee && option.cost <= doubleGold - entryFee).sort((a, b) => b.cost - a.cost || a.id.localeCompare(b.id));
          var doublePurchaseCount = normalPurchases.length + doubleOnlyPurchases.length;
          var target = doubleOnlyPurchases[0] || null;

          if (target) {
            return {
              useAds: true,
              reason: 'unlock-purchase-and-main-entry',
              targetId: target.id,
              targetCost: target.cost,
              normalGold,
              doubleGold,
              normalPurchaseCount: normalPurchases.length,
              doublePurchaseCount
            };
          }

          return {
            useAds: normalGold < entryFee && doubleGold >= entryFee,
            reason: 'secure-main-entry',
            targetId: '',
            targetCost: entryFee,
            normalGold,
            doubleGold,
            normalPurchaseCount: normalPurchases.length,
            doublePurchaseCount
          };
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

          for (var _i10 = 0; _i10 < options.length; _i10++) {
            roll -= weights[_i10];
            if (roll <= 0) return options[_i10];
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

          if (option.kind === 'card-strength-upgrade') {
            return Math.max(0.01, this.botStrengthUpgradePurchaseWeight);
          }

          return 1;
        }

        applyPurchase(option, state, source) {
          var goldBefore = state.playerGold;
          var valueBefore = this.getPurchaseValue(option, state);
          state.playerGold = Math.max(0, state.playerGold - option.cost);
          this.applyPurchaseToState(option, state);
          state.totalPurchases++;
          var record = {
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
          this.recordPurchaseTelemetryAction(record);
          return record;
        }

        recordPurchaseTelemetryAction(record) {
          this.recordTelemetryAction({
            type: record.kind,
            goldBefore: record.goldBefore,
            goldAfter: record.goldAfter,
            cardId: record.cardId,
            source: record.source,
            cost: record.cost,
            goldGranted: 0
          });
        }

        recordTelemetryAction(action) {
          var identity = this.createProgressionTelemetryIdentity();
          this.telemetryActionSequence++;
          this.telemetryActions.push(_extends({}, action, {
            eventId: identity.reportId + ":" + ("" + this.telemetryActionSequence),
            runId: identity.runId,
            reportId: identity.reportId,
            battleIndex: identity.battleIndex,
            sequence: this.telemetryActionSequence,
            phase: this.telemetryActionPhase,
            battleLevel: this.battleLevel
          }));
        }

        createProgressionTelemetryLedger() {
          return _extends({
            schemaVersion: 2
          }, this.createProgressionTelemetryIdentity(), {
            actions: this.telemetryActions.slice()
          });
        }

        createProgressionTelemetryIdentity() {
          var state = this.progressionState;
          var runId = (state == null ? void 0 : state.telemetryRunId) || 'unknown-run';
          var battleIndex = Math.max(0, (state == null ? void 0 : state.telemetryBattleIndex) || 0);
          return {
            runId,
            battleIndex,
            reportId: "progression:" + runId + ":battle:" + battleIndex
          };
        }

        createTelemetryRunId() {
          var timestamp = Date.now().toString(36);
          var random = ('0000000' + Math.floor(Math.random() * 0x100000000).toString(36)).slice(-7);
          return "run-" + timestamp + "-" + random;
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

          if (option.kind === 'card-strength-upgrade') {
            var _this$getGameManager;

            var _card4 = option.cardId ? this.getSavedCard(state, option.cardId) : null;

            var definition = option.cardId && (_this$getGameManager = this.getGameManager()) != null && _this$getGameManager.battleCardDatabase ? this.getGameManager().battleCardDatabase.getCard(option.cardId) : null;
            if (!_card4 || !_card4.owned || !definition) return;
            _card4.strengthUpgradeLevel = Math.min(this.getStrengthUpgradeMaxRank(definition), _card4.strengthUpgradeLevel + 1);
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

          if (option.kind === 'card-unlock' || option.kind === 'card-cooldown-upgrade' || option.kind === 'card-budget-upgrade' || option.kind === 'card-strength-upgrade') {
            var card = option.cardId ? this.getSavedCard(state, option.cardId) : null;
            if (!card) return 0;

            if (option.kind === 'card-unlock') {
              return Number(card.owned);
            }

            if (option.kind === 'card-cooldown-upgrade') {
              return card.cooldownUpgradeLevel;
            }

            return option.kind === 'card-budget-upgrade' ? card.budgetUpgradeLevel : card.strengthUpgradeLevel;
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

          var maxRank = Math.max(0, this.getRuleMaxCount(rule) - this.getRuleUnlockCount(rule));
          var safeLevel = this.clampLevel(level);
          var milestoneRank = this.getUnitCountMilestoneRank(rule, safeLevel, state);
          var tailRank = this.getUnitCountTailUpgradeSchedule().filter(item => item.key === this.getRuleKey(rule) && item.level <= safeLevel).length;
          return Math.min(maxRank, milestoneRank + tailRank);
        }

        getUnitCountMilestoneRank(rule, level, state) {
          if (state === void 0) {
            state = null;
          }

          var unlockLevel = this.getRuleUnlockLevel(rule);
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

          return rank;
        }

        getUnitCountTailUpgradeSchedule() {
          var normalLevels = this.getPostProgressionNormalLevels();
          if (normalLevels.length <= 0) return [];
          var pending = [];
          var progressionEnd = this.getUnitProgressionEndLevel();

          for (var i = 0; i < this.unitProgressionRules.length; i++) {
            var rule = this.unitProgressionRules[i];
            if (!rule) continue;
            var maxRank = Math.max(0, this.getRuleMaxCount(rule) - this.getRuleUnlockCount(rule));
            var remaining = maxRank - this.getUnitCountMilestoneRank(rule, progressionEnd);
            if (remaining <= 0) continue;
            pending.push({
              key: this.getRuleKey(rule),
              remaining
            });
          }

          var keys = [];

          while (pending.some(item => item.remaining > 0)) {
            for (var _i11 = 0; _i11 < pending.length; _i11++) {
              var item = pending[_i11];
              if (item.remaining <= 0) continue;
              keys.push(item.key);
              item.remaining--;
            }
          }

          return keys.map((key, index) => ({
            key,
            level: normalLevels[Math.min(normalLevels.length - 1, Math.floor(index * normalLevels.length / keys.length))]
          }));
        }

        getPostProgressionNormalLevels() {
          var result = [];
          var progressionEnd = this.getUnitProgressionEndLevel();
          var totalLevels = this.getSafeTotalLevels();

          for (var level = progressionEnd + 1; level < totalLevels; level++) {
            if (!this.isBossLevelFor(level)) {
              result.push(level);
            }
          }

          return result;
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

          for (var _i12 = 0; _i12 < brains.length; _i12++) {
            var _brain = brains[_i12];
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

            var firstOfferLevel = previousLevel > 0 ? previousLevel + 1 : 2;
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

          for (var _i13 = 0; _i13 < milestones.length; _i13++) {
            var targetLevel = milestones[_i13];
            var targetCap = this.clampPlayerMaxAlive(Math.max(previousCap, this.getLevelBaseMaxAlive(targetLevel)));
            var totalDelta = targetCap - previousCap;

            if (totalDelta <= 0) {
              previousLevel = targetLevel;
              previousCap = targetCap;
              continue;
            }

            var firstOfferLevel = previousLevel > 0 ? previousLevel + 1 : 2;
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
          if (!this.progressionState) return; // Purchases can happen before bot decides to route to side. There is
          // no battle report for that abandoned main setup, so carry its ledger
          // into the side report that follows.

          this.preserveTelemetryActionsForSideMission = true;
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

      }, (_descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "totalLevels", [_dec9], {
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
      }), _descriptor37 = _applyDecoratedDescriptor(_class5.prototype, "enemyCardDiversityScoreFloor", [_dec35], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.5;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class5.prototype, "botStrengthUpgradePurchaseWeight", [_dec36], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.75;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class5.prototype, "initialPlayerGold", [_dec37], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class5.prototype, "playerInitialCPStart", [_dec38], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 300;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class5.prototype, "playerMaxAliveStart", [_dec39], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class5.prototype, "playerMaxAliveMax", [_dec40], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class5.prototype, "winGoldPerEnemyCP", [_dec41], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.15;
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class5.prototype, "bossGoldRewardMultiplier", [_dec42], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.15;
        }
      }), _descriptor45 = _applyDecoratedDescriptor(_class5.prototype, "mainBattleEntryFeeRatio", [_dec43], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.35;
        }
      }), _descriptor46 = _applyDecoratedDescriptor(_class5.prototype, "unitUnlockCostMultiplier", [_dec44], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor47 = _applyDecoratedDescriptor(_class5.prototype, "initialCPGoldPerPoint", [_dec45], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor48 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveBasePrice", [_dec46], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1000;
        }
      }), _descriptor49 = _applyDecoratedDescriptor(_class5.prototype, "unitProgressionRules", [_dec47], {
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