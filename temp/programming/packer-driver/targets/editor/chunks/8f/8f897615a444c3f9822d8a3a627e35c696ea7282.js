System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, sys, GameManager, BattleArmyBrain, BattleCardModifier, BattleCardOpponentCondition, BattleCardTarget, CounterSettings, UnitFamily, unitFamilyToName, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _dec49, _dec50, _dec51, _dec52, _class4, _class5, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _descriptor47, _descriptor48, _descriptor49, _descriptor50, _descriptor51, _descriptor52, _descriptor53, _descriptor54, _crd, ccclass, property, UnitProgressionRule, LevelSettings;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function createUnitProgressionRule(family, unlockProgression, unlockCount, maxCount) {
    const rule = new UnitProgressionRule();
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
        initializer: function () {
          return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tier", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "unlockLevel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "unlockProgression", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "unlockCount", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxCount", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
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
        tooltip: 'Allow bot rewarded-ad mechanics, including card cooldown completion. Gold x2 has its own toggle. Side missions remain available without ads.'
      }), _dec33 = property({
        displayName: 'Allow Bot Gold X2 Ads',
        tooltip: 'Allow purchasing simulation to use rewarded ads to double side-mission gold. This does not restrict human-player ad rewards.'
      }), _dec34 = property({
        tooltip: 'Persistent campaign storage key. Opening currentLevel=1 starts a fresh run; use resetProgression=1 to force reset even from a resume URL.'
      }), _dec35 = property({
        min: 1,
        step: 1,
        tooltip: 'Cards each team may bring into one battle. This is the future deck-upgrade hook.'
      }), _dec36 = property({
        min: 0,
        max: 1,
        step: 0.05,
        displayName: 'Enemy Card Diversity Score Floor',
        tooltip: 'Enemy keeps a level-seeded, retry-stable deck, while choosing among cards near the best score. Lower values create more level-to-level variety.'
      }), _dec37 = property({
        min: 0.01,
        step: 0.05,
        displayName: 'Bot Strength Upgrade Purchase Weight',
        tooltip: 'Relative bot preference for an available independent melee-card Strength rank.'
      }), _dec38 = property({
        min: 0,
        step: 1,
        displayName: 'Max Player Packages Per Level',
        tooltip: 'Reserves slots for baseline packages and card unlocks first, then delays only player card upgrades until the level has this many packages. Baseline itself may exceed the cap. Set 0 to disable. Enemy card strength timing is unchanged.'
      }), _dec39 = property({
        min: 0,
        step: 1
      }), _dec40 = property({
        min: 0,
        step: 1
      }), _dec41 = property({
        min: 0,
        step: 1
      }), _dec42 = property({
        min: 0,
        step: 1
      }), _dec43 = property({
        min: 0,
        step: 50,
        displayName: 'No-Loss Gold Reserve',
        tooltip: 'Target gold kept after paying each newly opened package and the next main entry fee on the no-loss route. A low reserve makes losses create a real funding deficit; all rewards remain generated dynamically from package timing and fees.'
      }), _dec44 = property({
        min: 1,
        step: 0.05,
        displayName: 'Boss Gold Reward Multiplier',
        tooltip: 'Small bonus applied to baseline CP reward on boss wins. Boss CP multiplier is not included in the reward base.'
      }), _dec45 = property({
        min: 0.1,
        max: 1,
        step: 0.05,
        displayName: 'Side Reward Fee Multiplier',
        tooltip: 'Side-win gold as a share of the current main entry fee. Gold x2 can turn a partial recovery into a full preparation purchase. Rounds up to 50.'
      }), _dec46 = property({
        min: 0.01,
        max: 1,
        step: 0.05,
        displayName: 'Side Recovery Accuracy Multiplier',
        tooltip: 'After each lost side battle while main entry plus the cheapest currently opened package is unaffordable, the next side enemy accuracy is multiplied by this value. Resets after a side win or when the recovery need clears.'
      }), _dec47 = property({
        min: 0,
        max: 1,
        step: 0.05,
        displayName: 'Main Battle Entry Fee Ratio',
        tooltip: 'Gold charged before each main progression battle after the first. It uses the preceding normal main-reward curve, so a boss reward spike does not inflate the next entry fee. Rounds up to 50. Side missions are free.'
      }), _dec48 = property({
        min: 0,
        max: 1,
        step: 0.01,
        displayName: 'Main Loss Reward Fee Ratio',
        tooltip: 'Gold granted after a main-battle loss as a share of that battle\'s entry fee. Rounds to the nearest 10. A fee-free battle grants no loss reward.'
      }), _dec49 = property({
        min: 1,
        step: 1
      }), _dec50 = property({
        min: 0.01,
        step: 0.1
      }), _dec51 = property({
        min: 1,
        step: 1
      }), _dec52 = property({
        type: [UnitProgressionRule]
      }), _dec8(_class4 = (_class5 = class LevelSettings extends Component {
        constructor(...args) {
          super(...args);

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

          _initializerDefineProperty(this, "allowBotGoldX2Ads", _descriptor35, this);

          _initializerDefineProperty(this, "progressionStorageKey", _descriptor36, this);

          _initializerDefineProperty(this, "battleCardDeckSize", _descriptor37, this);

          _initializerDefineProperty(this, "enemyCardDiversityScoreFloor", _descriptor38, this);

          _initializerDefineProperty(this, "botStrengthUpgradePurchaseWeight", _descriptor39, this);

          _initializerDefineProperty(this, "maxPlayerPackagesPerLevel", _descriptor40, this);

          _initializerDefineProperty(this, "initialPlayerGold", _descriptor41, this);

          _initializerDefineProperty(this, "playerInitialCPStart", _descriptor42, this);

          _initializerDefineProperty(this, "playerMaxAliveStart", _descriptor43, this);

          _initializerDefineProperty(this, "playerMaxAliveMax", _descriptor44, this);

          _initializerDefineProperty(this, "mainlineNoLossGoldReserve", _descriptor45, this);

          _initializerDefineProperty(this, "bossGoldRewardMultiplier", _descriptor46, this);

          _initializerDefineProperty(this, "sideRewardFeeMultiplier", _descriptor47, this);

          _initializerDefineProperty(this, "sideRecoveryAccuracyMultiplier", _descriptor48, this);

          _initializerDefineProperty(this, "mainBattleEntryFeeRatio", _descriptor49, this);

          _initializerDefineProperty(this, "mainLossRewardFeeRatio", _descriptor50, this);

          _initializerDefineProperty(this, "unitUnlockCostMultiplier", _descriptor51, this);

          _initializerDefineProperty(this, "initialCPGoldPerPoint", _descriptor52, this);

          _initializerDefineProperty(this, "maxAliveBasePrice", _descriptor53, this);

          _initializerDefineProperty(this, "unitProgressionRules", _descriptor54, this);

          this.progressionState = null;
          this.battleLevel = 1;
          this.nextBattlePending = false;
          this.levelQueryActive = false;
          this.resetProgressionRequested = false;
          this.preBattlePurchases = [];
          this.telemetryActions = [];
          this.telemetryActionSequence = 0;
          this.preserveTelemetryActionsForSideMission = false;
          // Base (pre-flat-bonus) rewards for ordinary main battles. This must be
          // campaign-stable: the current enemy deck is runtime state, not economy
          // configuration.
          this.mainBattleNormalGoldPlan = null;
          this.playerNonCardUpgradeOfferCounts = null;
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

          const manager = this.getGameManager();

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
          const manager = this.getGameManager();

          if (manager && manager.battleProgressionProvider === this) {
            manager.battleProgressionProvider = null;
          }
        }

        applyLevelSettings() {
          const team = this.clampTeam(this.targetTeam);
          const t = this.getDifficulty01();
          const boss = this.isBossLevel();
          const manager = this.getGameManager();
          const brains = this.getTargetBattleArmyBrains(team);

          if (this.allowCP && manager && manager.unitDatabase) {
            const cp = this.getLevelInitialCP(this.getSafeCurrentLevel());

            if (team === 0) {
              manager.unitDatabase.teamAInitialCombatPoint = cp;
            } else {
              manager.unitDatabase.teamBInitialCombatPoint = cp;
            }

            manager.initialCombatPoint[team] = cp;
            manager.combatPoint[team] = cp;
          }

          for (let i = 0; i < brains.length; i++) {
            const brain = brains[i];
            if (!brain) continue;

            if (this.allowDecisionAccuracy) {
              const baseAccuracy = this.lerp(this.decisionAccuracyMin, this.decisionAccuracyMax, t);
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

          const state = this.progressionState;
          const battleLevel = this.battleLevel;
          const before = this.createTelemetrySnapshot();
          this.telemetryActionPhase = 'battle-result';
          state.consecutiveSideWins = 0;
          const purchases = [];
          const usedPlayerCards = this.currentPlayerBattleCardIds.slice();
          this.advancePlayerCardCooldowns(state, usedPlayerCards);
          const newlyOffered = this.offerIntroducedUnits(battleLevel);
          const mainReward = this.getMainBattleReward(battleLevel);
          const winGold = mainReward.gold;
          const lossGold = this.getMainBattleLossReward(battleLevel);
          let goldReward = 0;
          let rewardClaim = null;

          if (winnerTeam === 0) {
            rewardClaim = this.grantBotGoldClaim(state, winGold, 'progression-win', mainReward.targetId, mainReward.targetCost);
            goldReward = rewardClaim.goldGranted;
            state.levelLossCount = 0;
            state.mainLossesAtCurrentLevel = 0;
          } else if (loserTeam === 0) {
            rewardClaim = this.grantBotGoldClaim(state, lossGold, 'progression-loss', 'main-loss-fee-reward', this.getMainBattleEntryFee(battleLevel));
            goldReward = rewardClaim.goldGranted;
            state.levelLossCount++;
            state.mainLossesAtCurrentLevel++;
          }

          const campaignComplete = winnerTeam === 0 && battleLevel >= this.getSafeTotalLevels();
          const nextMainBattleLevel = winnerTeam === 0 ? Math.min(this.getSafeTotalLevels(), battleLevel + 1) : battleLevel;

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
          const result = {
            battleLevel,
            totalLevels: this.getSafeTotalLevels(),
            winnerTeam,
            loserTeam,
            reason,
            campaignComplete,
            winGold,
            lossGold,
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
          const state = this.progressionState;
          const before = this.createTelemetrySnapshot();
          this.telemetryActionPhase = 'battle-result'; // Side missions disable cards, but still count as a completed battle
          // for the player's existing card cooldowns.

          this.advancePlayerCardCooldowns(state, []);
          let goldReward = 0;
          let rewardClaim = null;
          let route = 'progression';

          if (winnerTeam === 0) {
            const reward = this.getSideMissionReward();
            rewardClaim = this.grantBotGoldClaim(state, reward.gold, 'side-mission-win', reward.targetId, reward.targetCost);
            goldReward = rewardClaim.goldGranted;
            state.consecutiveSideWins++;
            state.consecutiveSideRecoveryLosses = 0;
            state.levelLossCount = 0;
            const continuation = this.getSideMissionContinuation(state);
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
            const recovery = this.getSideEconomyRecoveryStatus(state);
            state.consecutiveSideRecoveryLosses = recovery.active ? state.consecutiveSideRecoveryLosses + 1 : 0;
            const continuation = this.getSideMissionContinuation(state); // A lost side mission did not improve the economy. Retry only if
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
              delayedPurchaseCount: continuation.delayedPurchaseCount,
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

          const state = this.progressionState;
          const manager = this.getGameManager();
          const enemyBrain = this.getFirstBrainForTeam(1);
          const playerBrain = this.getFirstBrainForTeam(0);
          const sideEconomyRecovery = this.getSideEconomyRecoveryStatus(state);
          const sideRecoveryAccuracyMultiplier = sideEconomyRecovery.active ? Math.pow(this.clamp01(this.sideRecoveryAccuracyMultiplier), state.consecutiveSideRecoveryLosses) : 1;
          const noLossEconomyAudit = this.getMainlineNoLossEconomyAudit();
          return {
            enabled: true,
            storageVersion: state.version,
            telemetry: this.createProgressionTelemetryIdentity(),
            currentLevel: state.currentLevel,
            battleLevel: this.battleLevel,
            totalLevels: this.getSafeTotalLevels(),
            isBossLevel: this.isBossLevelFor(this.battleLevel),
            purchasingSimulation: this.purchasingSimulation,
            controller: this.purchasingSimulation ? 'bot-simulation' : 'player',
            allowBotGoldX2Ads: this.allowBotGoldX2Ads,
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
              mainlineNoLossGoldReserve: this.mainlineNoLossGoldReserve,
              bossGoldRewardMultiplier: this.bossGoldRewardMultiplier,
              mainBattleEntryFeeRatio: this.mainBattleEntryFeeRatio,
              mainLossRewardFeeRatio: this.mainLossRewardFeeRatio,
              sideRecoveryAccuracyMultiplier: this.sideRecoveryAccuracyMultiplier,
              mainBattleEntryFee: this.getMainBattleEntryFee(this.battleLevel),
              mainBattleLossReward: this.getMainBattleLossReward(this.battleLevel),
              unitUnlockCostMultiplier: this.unitUnlockCostMultiplier,
              initialCPGoldPerPoint: this.initialCPGoldPerPoint,
              maxAliveBasePrice: this.maxAliveBasePrice,
              cardDefinitions: this.createCardDefinitionSnapshot(),
              cardUpgradeSchedule: this.getCardUpgradeSchedule(),
              noLossEconomyAudit
            },
            preBattlePurchases: this.preBattlePurchases.slice(),
            sideMission: {
              active: this.sideMissionBattle,
              economyRecovery: {
                active: sideEconomyRecovery.active,
                consecutiveLosses: state.consecutiveSideRecoveryLosses,
                accuracyMultiplier: sideRecoveryAccuracyMultiplier,
                entryFee: sideEconomyRecovery.entryFee,
                cheapestPackageCost: sideEconomyRecovery.cheapestPackageCost,
                requiredGold: sideEconomyRecovery.requiredGold,
                shortfall: sideEconomyRecovery.shortfall
              },
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
              cpPackageSchedule: state.cpPackages.map(item => ({ ...item
              })),
              initialCPOverflow: state.playerInitialCPOverflow,
              maxAlive: state.playerMaxAlive,
              maxAlivePackagesPurchased: state.maxAlivePackages.filter(item => item.claimed).length,
              maxAlivePackagesOffered: this.getPlayerMaxAlivePackagesOffered(this.battleLevel),
              maxAlivePackageSchedule: state.maxAlivePackages.map(item => ({ ...item
              })),
              decisionAccuracy: playerBrain ? playerBrain.decisionAccuracy : null,
              totalPurchases: state.totalPurchases,
              mainBattleEntryCount: state.mainBattleEntryCount,
              cards: state.cards.map(card => ({ ...card,
                effectiveCooldown: this.getCardEffectiveCooldown(card),
                effectiveBudget: this.getCardEffectiveBudget(card)
              })),
              selectedBattleCardIds: this.currentPlayerBattleCardIds.slice(),
              readyOwnedCardIds: state.cards.filter(card => card.owned && card.cooldownRemaining <= 0).map(card => card.id),
              coolingOwnedCards: state.cards.filter(card => card.owned && card.cooldownRemaining > 0).map(card => ({
                id: card.id,
                cooldownRemaining: card.cooldownRemaining
              })),
              cooldownAdReasons: Array.from(this.currentPlayerCooldownAdReasons.entries()).map(([cardId, reason]) => ({
                cardId,
                reason
              }))
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
          const manager = this.getGameManager();

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

          const started = manager.startBattleRuntime();

          if (!started) {
            console.error('[BattleProgression] battle runtime could not be started.');
          }

          return started;
        }

        initializeProgression() {
          this.mainBattleNormalGoldPlan = null;
          this.playerNonCardUpgradeOfferCounts = null;
          const loaded = this.loadProgressionState();
          this.progressionState = loaded ? this.sanitizeProgressionState(loaded) : this.createInitialProgressionState();
          const savedLevel = this.progressionState.currentLevel;

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
          const preserveTelemetryActions = this.preserveTelemetryActionsForSideMission;
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
            const reservedEntryFee = this.getCurrentMainBattleEntryFee();
            const manager = this.getGameManager();

            if (manager && manager.battleCardDatabase) {
              this.configureEnemyBattleCards(manager.battleCardDatabase, this.progressionState);
            }

            const preparationPlan = this.getBotPreparationPlan(this.progressionState);

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
          const units = [];

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const startsOwned = this.getRuleUnlockLevel(rule) <= 1;
            units.push({
              key: this.getRuleKey(rule),
              offered: startsOwned,
              unlocked: startsOwned,
              unitCount: this.getRuleUnlockCount(rule)
            });
          }

          return {
            version: 14,
            telemetryRunId: this.createTelemetryRunId(),
            telemetryBattleIndex: 0,
            enemyCardDeckPolicyVersion: this.enemyCardDeckPolicyVersion,
            currentLevel: this.getSafeCurrentLevel(),
            playerGold: Math.max(0, Math.floor(this.initialPlayerGold)),
            adsReward: 0,
            levelLossCount: 0,
            mainLossesAtCurrentLevel: 0,
            consecutiveSideWins: 0,
            consecutiveSideRecoveryLosses: 0,
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

        tryPurchaseCard(cardId, upgrade = false) {
          if (!this.progressionState || !cardId) return false;
          const expectedKind = upgrade === 'budget' ? 'card-budget-upgrade' : upgrade === 'strength' ? 'card-strength-upgrade' : upgrade ? 'card-cooldown-upgrade' : 'card-unlock';
          const option = this.getPurchaseOptions(this.progressionState).find(candidate => candidate.kind === expectedKind && candidate.cardId === cardId && candidate.cost <= this.progressionState.playerGold);
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

          const card = this.getSavedCard(this.progressionState, cardId);

          if (!card || !card.owned || card.cooldownRemaining <= 0) {
            return false;
          }

          const cooldownBefore = card.cooldownRemaining;
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
          const manager = this.getGameManager();

          if (manager) {
            manager.configureBattleCardDecks(this.currentPlayerBattleCardIds, this.currentEnemyBattleCardIds, this.getPlayerCardBudgetUpgradeLevels(this.progressionState), this.getPlayerCardStrengthScales(this.progressionState), this.getEnemyCardStrengthScales(), this.getBattleCardDeckSize(), this.getEnemyBattleCardDeckSize());
          }
        }

        configureBattleCardsForCurrentBattle() {
          const state = this.progressionState;
          const manager = this.getGameManager();
          const database = manager ? manager.battleCardDatabase : null;
          if (!state || !manager || !database) return;
          const enemyDeckSize = this.configureEnemyBattleCards(database, state);

          if (this.purchasingSimulation) {
            this.currentPlayerCooldownAdReasons.clear();
            const ownedDefinitions = database.cards.filter(definition => {
              const saved = this.getSavedCard(state, definition.id);
              return !!saved && saved.owned;
            });
            const readyOwnedDefinitions = ownedDefinitions.filter(definition => {
              const saved = this.getSavedCard(state, definition.id);
              return !!saved && saved.cooldownRemaining <= 0;
            });
            const eligibleDefinitions = ownedDefinitions.filter(definition => {
              return this.isCardEligibleForTeam(definition, 0, state);
            }); // Eligibility is a tactical filter. It must never leave the bot
            // entering with an empty deck when an owned card has a real
            // player target. The fallback protects the battle flow from an
            // incomplete roster/condition evaluation; the score below still
            // decides which applicable card is least harmful to bring.

            const playerCardDefinitions = eligibleDefinitions.length > 0 ? eligibleDefinitions : ownedDefinitions.filter(definition => this.getCardTargetCombatWeight(definition, 0, state) > 0);
            const mirrorCardIds = this.isBossLevelFor(this.battleLevel) ? this.getBossMirrorCardIds(state, playerCardDefinitions) : [];
            const useBossMirror = mirrorCardIds.length === enemyDeckSize;
            const deckDefinitions = useBossMirror ? playerCardDefinitions.filter(definition => mirrorCardIds.includes(definition.id)) : playerCardDefinitions;
            const readyDefinitions = deckDefinitions.filter(definition => {
              const saved = this.getSavedCard(state, definition.id);
              return !!saved && saved.cooldownRemaining <= 0;
            });
            const cooldownDefinitions = deckDefinitions.filter(definition => {
              const saved = this.getSavedCard(state, definition.id);
              return !!saved && saved.cooldownRemaining > 0;
            });
            const cooldownAdPlan = this.selectBotCooldownAdDeck(readyDefinitions, cooldownDefinitions, state, this.currentBattleUsesPreparedDeck || useBossMirror);

            for (let i = 0; i < cooldownAdPlan.candidates.length; i++) {
              const candidate = cooldownAdPlan.candidates[i];
              this.currentPlayerCooldownAdReasons.set(candidate.definition.id, candidate.reason);
            }

            this.currentPlayerBattleCardIds = cooldownAdPlan.cardIds; // Final invariant for the bot only: entering with an empty deck
            // while an owned card is ready is never a valid decision. This
            // remains outside player-facing rules; a human can still choose
            // an empty deck or skip any number of cooldowns manually.

            if (this.currentPlayerBattleCardIds.length <= 0 && readyOwnedDefinitions.length > 0) {
              this.currentPlayerBattleCardIds = this.selectBestPlayerCardIds(readyOwnedDefinitions, state, this.getBattleCardDeckSize());
            } // If every owned card is cooling, the bot uses one recovery ad
            // rather than starting cardless. `finishBotSelectedCardCooldowns`
            // applies the ad only to this single selected card.


            if (this.currentPlayerBattleCardIds.length <= 0 && this.allowAdsRescue && ownedDefinitions.length > 0) {
              const emergencyCardIds = this.selectBestPlayerCardIds(ownedDefinitions, state, 1);

              if (emergencyCardIds.length > 0) {
                const emergencyCardId = emergencyCardIds[0];
                this.currentPlayerBattleCardIds = [emergencyCardId];
                this.currentPlayerCooldownAdReasons.set(emergencyCardId, 'no-ready-card-emergency-recovery');
              }
            }

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

          const enemyDeckSize = this.getEnemyBattleCardDeckSize();
          const enemyDeckKey = String(this.battleLevel);
          const savedEnemyDeck = state.enemyCardIdsByLevel[enemyDeckKey];
          const candidates = database.getEnemyCards(this.isBossLevelFor(this.battleLevel)).filter(definition => this.isCardEligibleForTeam(definition, 1, state));
          const cachedDeck = Array.isArray(savedEnemyDeck) ? savedEnemyDeck.filter(id => {
            const definition = database.getCard(id);
            return !!definition && this.isCardEligibleForTeam(definition, 1, state);
          }).slice(0, enemyDeckSize) : []; // An empty cached array is not authoritative when eligible enemy
          // cards exist. It can be left behind by a side-mission reset or by a
          // runtime reset that happened before the main deck was configured.
          // Rebuild it here so a main battle cannot start with both decks empty.

          if (cachedDeck.length > 0 || candidates.length <= 0) {
            this.currentEnemyBattleCardIds = cachedDeck;
          } else {
            this.currentEnemyBattleCardIds = this.selectBestEnemyCardIds(candidates, state, enemyDeckSize);
          }

          state.enemyCardIdsByLevel[enemyDeckKey] = this.currentEnemyBattleCardIds.slice();
          return enemyDeckSize;
        }

        filterReadyPlayerCardIds(cardIds) {
          if (!this.progressionState) return [];
          const manager = this.getGameManager();
          const database = manager ? manager.battleCardDatabase : null;
          if (!database || !Array.isArray(cardIds)) return [];
          const result = [];
          const used = new Set();

          for (let i = 0; i < cardIds.length; i++) {
            const id = cardIds[i];

            if (!id || used.has(id) || result.length >= this.getBattleCardDeckSize()) {
              continue;
            }

            const definition = database.getCard(id);
            const saved = this.getSavedCard(this.progressionState, id);
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
          const maxCapacity = Math.min(3, this.getBattleCardDeckSize());
          const bossPace = Math.max(0, Math.floor(this.bossStagePace));
          if (maxCapacity <= 0) return 0;

          if (bossPace <= 0) {
            const state = this.progressionState;
            return state ? Math.min(2, this.getPlayerCardProgressionWave(state), maxCapacity) : 0;
          }

          const safeLevel = this.clampLevel(level);
          const nextBossLevel = Math.ceil(safeLevel / bossPace) * bossPace; // A preview exists only when this interval really ends in a boss.
          // This keeps a truncated campaign tail clear of enemy cards.

          if (nextBossLevel > this.getSafeTotalLevels()) return 0;
          const distanceToBoss = nextBossLevel - safeLevel; // The final normal level always previews one card, independent of
          // boss pace. At pace 5 this remains 0, 0, 0, 1, 3; at pace 4 it is
          // 0, 0, 1, 3 instead of skipping the preview entirely.

          if (distanceToBoss === 1) return Math.min(1, maxCapacity);
          if (distanceToBoss > 1) return 0;
          return maxCapacity;
        }

        selectBestPlayerCardIds(definitions, state, maxCount) {
          const candidates = definitions.filter((definition, index) => !!definition && !!definition.id && definitions.findIndex(candidate => candidate && candidate.id === definition.id) === index);
          const deckSize = Math.max(0, Math.min(maxCount, candidates.length));
          if (deckSize <= 0) return [];
          const scored = candidates.map(definition => ({
            definition,
            score: this.getPlayerBattleCardScore(definition, state)
          })).sort((a, b) => b.score - a.score || a.definition.id.localeCompare(b.definition.id)); // Score ranks applicable cards only. It must not act as a second
          // eligibility gate: a positive score is not required to fill a deck.
          // Therefore this function returns at least one id whenever candidates
          // exist and the configured deck capacity is positive.

          return scored.slice(0, deckSize).map(candidate => candidate.definition.id);
        }

        selectBestEnemyCardIds(definitions, state, maxCount) {
          const remaining = definitions.map(definition => {
            const score = this.getEnemyBattleCardScore(definition, state);
            const recentUseCount = this.getEnemyRecentCardUseCount(definition.id, state);
            return {
              definition,
              score: score / (1 + recentUseCount * 0.75),
              recentUseCount
            };
          }).filter(candidate => candidate.score > 0).sort((a, b) => b.score - a.score || a.definition.id.localeCompare(b.definition.id));
          const selected = [];
          const deckSize = Math.max(0, Math.min(maxCount, remaining.length));

          while (remaining.length > 0 && selected.length < deckSize) {
            const slotsRemaining = deckSize - selected.length;
            const freshCandidates = remaining.filter(candidate => candidate.recentUseCount <= 0);
            const selectionCandidates = freshCandidates.length >= slotsRemaining ? freshCandidates : remaining;
            const bestScore = selectionCandidates[0].score;
            const scoreFloor = bestScore * this.clamp01(this.enemyCardDiversityScoreFloor);
            const minimumPoolSize = Math.min(selectionCandidates.length, Math.max(3, slotsRemaining + 2));
            let pool = selectionCandidates.filter(candidate => candidate.score >= scoreFloor); // Keep one credible alternative whenever it exists. This avoids
            // a single top-ranked combination repeating for every level.

            if (pool.length < minimumPoolSize) {
              pool = selectionCandidates.slice(0, minimumPoolSize);
            }

            const selectedIndex = Math.max(0, Math.min(pool.length - 1, Math.floor(this.getEnemyDeckSeededRoll(this.battleLevel, selected.length) * pool.length)));
            const selectedCandidate = pool[selectedIndex];
            selected.push(selectedCandidate.definition.id);
            remaining.splice(remaining.indexOf(selectedCandidate), 1);
          }

          return selected;
        }

        getBossMirrorCardIds(state, eligibleDefinitions) {
          if (!this.isBossLevelFor(this.battleLevel)) return [];
          const result = [];

          for (let i = 0; i < this.currentEnemyBattleCardIds.length; i++) {
            const cardId = this.currentEnemyBattleCardIds[i];
            const definition = eligibleDefinitions.find(entry => entry.id === cardId);
            const saved = this.getSavedCard(state, cardId);
            if (!definition || !saved || !saved.owned) continue;

            if (saved.cooldownRemaining > 0 && !this.allowAdsRescue) {
              return [];
            }

            result.push(cardId);
          }

          return result.slice(0, this.getBattleCardDeckSize());
        }

        getEnemyRecentCardUseCount(cardId, state) {
          let result = 0;
          let inspectedDecks = 0;

          for (let level = this.battleLevel - 1; level >= 1 && inspectedDecks < 2; level--) {
            const deck = state.enemyCardIdsByLevel[String(level)];
            if (!Array.isArray(deck) || deck.length <= 0) continue;
            inspectedDecks++;

            if (deck.indexOf(cardId) >= 0) {
              result++;
            }
          }

          return result;
        }

        getEnemyDeckSeededRoll(level, slot) {
          let value = Math.max(1, Math.floor(level)) * 73856093 + (slot + 1) * 19349663 + 83492791 >>> 0;
          value = (value ^ value >>> 16) >>> 0;
          value = Math.imul(value, 0x7feb352d) >>> 0;
          value ^= value >>> 15;
          value = Math.imul(value, 0x846ca68b) >>> 0;
          value = (value ^ value >>> 16) >>> 0;
          return value / 0x100000000;
        }

        selectBotCooldownAdDeck(readyDefinitions, cooldownDefinitions, state, forceCompetitivePlan = false) {
          const deckSize = this.getBattleCardDeckSize();
          const candidates = [];
          const noAdDefinitions = readyDefinitions.slice();
          const noAdCardIds = this.selectBestPlayerCardIds(noAdDefinitions, state, deckSize);

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
          } // The bot may choose at most one cooldown ad per battle. This is an
          // AI policy only; manual player cooldown ads remain unrestricted.
          // A card must materially improve the weak deck; it does not need to
          // solve the entire strength gap by itself.


          let bestDefinition = null;
          let bestCardIds = noAdCardIds;
          let bestScore = this.getPlayerDeckScore(noAdCardIds, noAdDefinitions, state);
          const playerStrength = this.getPlayerTeamCombatWeightForCardScore(state);
          const enemyStrength = this.getEnemyTeamCombatWeightForCardScore(state) + this.getEnemyDeckScore(state);
          const missingStrength = Math.max(0, enemyStrength - playerStrength - bestScore);

          for (let i = 0; i < cooldownDefinitions.length; i++) {
            const definition = cooldownDefinitions[i];
            const proposedDefinitions = noAdDefinitions.concat(definition);
            const proposedCardIds = this.selectBestPlayerCardIds(proposedDefinitions, state, deckSize);

            if (!proposedCardIds.includes(definition.id)) {
              continue;
            }

            const proposedScore = this.getPlayerDeckScore(proposedCardIds, proposedDefinitions, state);
            const scoreGain = proposedScore - bestScore;
            const materiallyImprovesDeck = forceCompetitivePlan ? scoreGain > 0 : scoreGain >= Math.max(0.01, missingStrength * 0.15);
            if (!materiallyImprovesDeck) continue;

            if (proposedScore > bestScore || proposedScore === bestScore && bestDefinition && definition.id.localeCompare(bestDefinition.id) < 0) {
              bestDefinition = definition;
              bestCardIds = proposedCardIds;
              bestScore = proposedScore;
            }
          }

          if (bestDefinition) {
            const mainLosses = Math.max(0, state.mainLossesAtCurrentLevel);
            const selectedCandidates = [{
              definition: bestDefinition,
              reason: 'deck-threshold-required'
            }];

            if (!this.shouldBotUseCooldownAdPlan(mainLosses, forceCompetitivePlan, bestCardIds, selectedCandidates, state)) {
              return {
                cardIds: noAdCardIds,
                candidates: []
              };
            }

            selectedCandidates[0].reason = forceCompetitivePlan ? 'prepared-deck-threshold-roll' : `deck-threshold-after-${mainLosses}-main-losses`;
            return {
              cardIds: bestCardIds,
              candidates: selectedCandidates
            };
          } // Do not spend ads for a deck that still cannot meet the enemy.


          return {
            cardIds: noAdCardIds,
            candidates: []
          };
        }

        shouldBotUseCooldownAdPlan(mainLosses, forceCompetitivePlan, cardIds, selectedCandidates, state) {
          const playerTeamStrength = this.getPlayerTeamCombatWeightForCardScore(state);
          const enemyStrength = this.getEnemyTeamCombatWeightForCardScore(state) + this.getEnemyDeckScore(state);
          const strongestCandidate = selectedCandidates.reduce((best, candidate) => Math.max(best, this.getPlayerBattleCardScore(candidate.definition, state)), 0);
          const requiredCardStrength = Math.max(1, enemyStrength - playerTeamStrength);
          const candidateIsIndividuallyMeaningful = strongestCandidate >= requiredCardStrength; // A prepared deck has already shown that this cooling card is the
          // sensible recovery choice. Do not turn that plan into an arbitrary
          // retry when one ad is enough to field it.

          if (forceCompetitivePlan) return true; // This is deliberately a human-like choice, not a guarantee. A
          // prepared deck makes ads more tempting, but the bot may still
          // stubbornly retry without using them. Repeated losses increase the
          // pressure to prepare, while preserving meaningful bad decisions.

          let probability = forceCompetitivePlan ? 0.28 : 0.12;
          probability += Math.min(0.48, Math.max(0, mainLosses) * 0.16);
          if (candidateIsIndividuallyMeaningful) probability += 0.14;
          const clampedProbability = this.clamp01(Math.max(0.08, Math.min(0.86, probability)));
          const useAds = Math.random() < clampedProbability;
          const target = selectedCandidates[0];
          const targetCard = target ? this.getSavedCard(state, target.definition.id) : null;
          this.recordBotSimulationEvent(state, {
            type: 'card-cooldown-ad-roll',
            battleLevel: this.battleLevel,
            choice: useAds ? 'skip-cooldown' : 'retry-without-cooldown',
            targetId: target ? target.definition.id : '',
            targetCost: targetCard ? targetCard.cooldownRemaining : 0,
            baseGold: 0,
            goldGranted: 0,
            adsReason: useAds ? 'competitive-card-cooldown-roll' : 'human-stubborn-retry-roll'
          });
          return useAds;
        }

        getPlayerDeckScore(cardIds, definitions, state) {
          return cardIds.reduce((total, id) => {
            const definition = definitions.find(entry => entry.id === id);
            return total + (definition ? this.getPlayerBattleCardScore(definition, state) : 0);
          }, 0);
        }

        isPlayerDeckCompetitive(cardIds, definitions, state) {
          const playerStrength = this.getPlayerTeamCombatWeightForCardScore(state) + this.getPlayerDeckScore(cardIds, definitions, state);
          const enemyStrength = this.getEnemyTeamCombatWeightForCardScore(state) + this.getEnemyDeckScore(state);
          return playerStrength >= enemyStrength;
        }

        getEnemyDeckScore(state) {
          const manager = this.getGameManager();
          const database = manager ? manager.battleCardDatabase : null;
          if (!database) return 0;
          return this.currentEnemyBattleCardIds.reduce((total, id) => {
            const definition = database.getCard(id);
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
          let total = 0;

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const count = this.getTeamUnitCountForCardScore(rule, team, state);
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

        getBattleCardScore(definition, team, state, opposingCardIds, useOpponentComposition = true) {
          const targetWeight = this.getCardTargetCombatWeight(definition, team, state);
          if (targetWeight <= 0) return 0;
          const saved = team === 0 ? this.getSavedCard(state, definition.id) : null;
          const budgetScale = saved ? this.getCardEffectiveBudget(saved) / Math.max(1, definition.baseBudget) : 1;
          const conditionScale = this.getCardOpponentConditionWeight(definition, state, team);
          const modifierScore = this.getCardModifierScore(definition, state, targetWeight, team);
          const ladderThreatScale = this.getMeleeLadderThreatScale(definition, team, state, opposingCardIds, useOpponentComposition);
          return Math.max(0, targetWeight * modifierScore * budgetScale * conditionScale * ladderThreatScale);
        }

        getCardTargetCombatWeight(definition, team, state) {
          let total = 0;

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];

            if (!rule || !this.cardMatchesFamily(definition, rule.family)) {
              continue;
            }

            const count = this.getTeamUnitCountForCardScore(rule, team, state);
            if (count <= 0) continue;
            total += count * this.getUnitCombatWeightForCardScore(rule, team);
          }

          return total;
        }

        getTeamUnitCountForCardScore(rule, team, state) {
          if (team === 1) {
            return this.battleLevel >= this.getRuleUnlockLevel(rule) ? this.getEnemyUnitCount(rule, this.battleLevel) : 0;
          }

          const saved = this.getSavedUnit(state, this.getRuleKey(rule));
          return saved && saved.unlocked ? Math.max(0, saved.unitCount) : 0;
        }

        getUnitCombatWeightForCardScore(rule, team) {
          const entry = this.getUnitEntryForCardScore(rule, team);
          return Math.max(1, entry ? entry.combatPointCost : 1);
        }

        getCardModifierStrengthScale(definition, team, state) {
          if (!this.hasStrengthUpgrade(definition)) return 1;

          if (team === 1) {
            return this.getCardStrengthScale(definition, this.getEnemyStrengthUpgradeRank(definition, this.battleLevel));
          }

          const saved = this.getSavedCard(state, definition.id);

          if (!saved) {
            return this.getCardStrengthScale(definition, 0);
          }

          return this.getCardStrengthScale(definition, saved.strengthUpgradeLevel);
        }

        getMeleeLadderThreatScale(definition, team, state, opposingCardIds, useOpponentComposition) {
          if (!this.hasStrengthUpgrade(definition)) return 1;
          if (!useOpponentComposition) return 1;
          const nextFamily = this.getNextMeleeLadderFamily(definition.targetFamily);
          if (nextFamily === null) return 1;
          const opposingTeam = team === 1 ? 0 : 1;
          let totalWeight = 0;
          let nextFamilyWeight = 0;

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const weight = this.getTeamUnitCountForCardScore(rule, opposingTeam, state) * this.getUnitCombatWeightForCardScore(rule, opposingTeam);
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
          const manager = this.getGameManager();
          const database = manager ? manager.battleCardDatabase : null;
          if (!database) return 1;
          let pressure = 0;

          for (let i = 0; i < opposingCardIds.length; i++) {
            const definition = database.getCard(opposingCardIds[i]);
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
          const base = this.clamp01(definition.baseStrengthScale);
          const maxRank = this.getStrengthUpgradeMaxRank(definition);
          if (maxRank <= 0) return 1;
          return base + (1 - base) * this.clamp01(rank / maxRank);
        }

        getEnemyStrengthUpgradeRank(definition, level) {
          return this.getCardUpgradeRankLimitAtLevel(definition, 'strength', level, 0);
        }

        getCardOpponentConditionWeight(definition, state, team = 0) {
          if (definition.requiredEnemyFamily === (_crd && BattleCardOpponentCondition === void 0 ? (_reportPossibleCrUseOfBattleCardOpponentCondition({
            error: Error()
          }), BattleCardOpponentCondition) : BattleCardOpponentCondition).Any) {
            return 1;
          }

          const requiredFamily = definition.requiredEnemyFamily - 1;
          let totalEnemyWeight = 0;
          let requiredEnemyWeight = 0;

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const weight = this.getTeamUnitCountForCardScore(rule, team === 1 ? 0 : 1, state) * this.getUnitCombatWeightForCardScore(rule, team === 1 ? 0 : 1);
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
          const enemyDamage = this.getAverageUnitStatForCardScore(team === 1 ? 0 : 1, state, 'damage');
          const targetDefense = this.getAverageTargetUnitDefenseForCardScore(definition, state, targetWeight, team);
          const before = Math.max(1, enemyDamage - targetDefense);
          const after = Math.max(1, enemyDamage - targetDefense - value);
          return before / after - 1;
        }

        getCounterImmunityScore(definition, state, targetWeight, team) {
          const counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter || targetWeight <= 0) return 0;
          let weightedThreat = 0;
          let totalEnemyWeight = 0;

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const enemyRule = this.unitProgressionRules[i];
            if (!enemyRule) continue;
            const enemyWeight = this.getTeamUnitCountForCardScore(enemyRule, team === 1 ? 0 : 1, state) * this.getUnitCombatWeightForCardScore(enemyRule, team === 1 ? 0 : 1);
            totalEnemyWeight += enemyWeight;

            for (let j = 0; j < this.unitProgressionRules.length; j++) {
              const targetRule = this.unitProgressionRules[j];

              if (!targetRule || !this.cardMatchesFamily(definition, targetRule.family)) {
                continue;
              }

              const targetUnitWeight = this.getTeamUnitCountForCardScore(targetRule, team, state) * this.getUnitCombatWeightForCardScore(targetRule, team);
              weightedThreat += targetUnitWeight * enemyWeight * Math.max(0, counter.getDamageMultiplier(enemyRule.family, targetRule.family) - 1);
            }
          }

          return totalEnemyWeight > 0 ? weightedThreat / (targetWeight * totalEnemyWeight) : 0;
        }

        getAverageUnitStatForCardScore(team, state, stat) {
          let totalWeight = 0;
          let totalStat = 0;

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const count = this.getTeamUnitCountForCardScore(rule, team, state);
            if (count <= 0) continue;
            const entry = this.getUnitEntryForCardScore(rule, team);
            const weight = count * this.getUnitCombatWeightForCardScore(rule, team);
            totalWeight += weight;
            totalStat += weight * (entry ? entry[stat] : 0);
          }

          return totalWeight > 0 ? totalStat / totalWeight : 0;
        }

        getAverageTargetUnitDefenseForCardScore(definition, state, targetWeight, team) {
          if (targetWeight <= 0) return 0;
          let totalDefense = 0;

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];

            if (!rule || !this.cardMatchesFamily(definition, rule.family)) {
              continue;
            }

            const weight = this.getTeamUnitCountForCardScore(rule, team, state) * this.getUnitCombatWeightForCardScore(rule, team);
            const entry = this.getUnitEntryForCardScore(rule, team);
            totalDefense += weight * (entry ? entry.defense : 0);
          }

          return totalDefense / targetWeight;
        }

        getUnitEntryForCardScore(rule, team) {
          const manager = this.getGameManager();
          const entries = manager && manager.unitDatabase ? manager.unitDatabase.getTeamEntries(team) : [];
          return entries.find(entry => entry && entry.family === rule.family && entry.tier === rule.tier) || entries.find(entry => entry && entry.family === rule.family) || null;
        }

        advancePlayerCardCooldowns(state, usedCardIds) {
          for (let i = 0; i < state.cards.length; i++) {
            const card = state.cards[i];

            if (!card.owned || card.cooldownRemaining <= 0) {
              continue;
            }

            card.cooldownRemaining = Math.max(0, card.cooldownRemaining - 1);
          }

          for (let i = 0; i < usedCardIds.length; i++) {
            const card = this.getSavedCard(state, usedCardIds[i]);
            if (!card || !card.owned) continue;
            card.cooldownRemaining = this.getCardEffectiveCooldown(card);
          }
        }

        createInitialCardProgression() {
          const manager = this.getGameManager();
          const database = manager ? manager.battleCardDatabase : null;
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
          for (let i = 0; i < state.cards.length; i++) {
            const card = state.cards[i];
            if (card.id === id) return card;
          }

          return null;
        }

        getCardEffectiveCooldown(card) {
          const manager = this.getGameManager();
          const definition = manager && manager.battleCardDatabase ? manager.battleCardDatabase.getCard(card.id) : null;
          if (!definition) return 0;
          return Math.max(1, Math.floor(definition.baseCooldownBattles) - Math.max(0, Math.min(2, card.cooldownUpgradeLevel)));
        }

        getCardEffectiveBudget(card) {
          const manager = this.getGameManager();
          const definition = manager && manager.battleCardDatabase ? manager.battleCardDatabase.getCard(card.id) : null;
          if (!definition) return 0;
          return Math.max(1, Math.round(Math.max(1, definition.baseBudget) * (1 + Math.max(0, Math.min(2, card.budgetUpgradeLevel)) * 0.4)));
        }

        getPlayerCardBudgetUpgradeLevels(state) {
          const result = {};
          if (!state) return result;

          for (let i = 0; i < state.cards.length; i++) {
            const card = state.cards[i];
            if (!card.owned) continue;
            result[card.id] = Math.max(0, Math.min(2, card.budgetUpgradeLevel));
          }

          return result;
        }

        isCardEligibleForTeam(definition, team, state) {
          const targetFamilies = this.getCardFamiliesForTeam(team, state).filter(family => this.cardMatchesFamily(definition, family));
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
          let result = 0;

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            result = Math.max(result, this.getUnitFamilyCardProgressionWave(rule.family));
          }

          return result;
        }

        getPlayerCardStrengthScales(state) {
          const result = {};
          const manager = this.getGameManager();
          const database = manager && manager.battleCardDatabase ? manager.battleCardDatabase : null;
          if (!state || !database) return result;

          for (let i = 0; i < state.cards.length; i++) {
            const card = state.cards[i];
            if (!card.owned) continue;
            const definition = database.getCard(card.id);

            if (!definition || !this.hasStrengthUpgrade(definition)) {
              continue;
            }

            result[card.id] = this.getCardStrengthScale(definition, card.strengthUpgradeLevel);
          }

          return result;
        }

        getEnemyCardStrengthScales() {
          const result = {};
          const manager = this.getGameManager();
          const database = manager && manager.battleCardDatabase ? manager.battleCardDatabase : null;
          if (!database) return result;

          for (let i = 0; i < database.cards.length; i++) {
            const definition = database.cards[i];

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
          }), UnitFamily) : UnitFamily).Cavalry) {
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

        getCardUpgradeRankLimitAtLevel(definition, upgradeKind, level, offerLevelOffset = 1) {
          const safeLevel = this.clampLevel(level);
          const maxRank = this.getCardUpgradeMaxRank(definition, upgradeKind);
          let rankLimit = 0;
          const schedule = this.getCardUpgradeSchedule(offerLevelOffset);

          for (let rank = 1; rank <= maxRank; rank++) {
            const offer = schedule.find(item => item.cardId === definition.id && item.upgradeKind === upgradeKind && item.rank === rank);
            if (!offer || offer.offerLevel > safeLevel) break;
            rankLimit = rank;
          }

          return rankLimit;
        }

        getCardUpgradeSchedule(offerLevelOffset = 1) {
          const manager = this.getGameManager();
          const database = manager ? manager.battleCardDatabase : null;
          if (!database) return [];
          const totalLevels = this.getSafeTotalLevels();
          const fullProgressionWave = this.getFullPlayerCardProgressionWave();
          const offersByWave = new Map();
          const postProgressionPending = [];

          for (let i = 0; i < database.cards.length; i++) {
            const definition = database.cards[i];
            if (!definition || !definition.id) continue;
            const upgradeKinds = ['cooldown', 'budget', 'strength'];

            for (let kindIndex = 0; kindIndex < upgradeKinds.length; kindIndex++) {
              const upgradeKind = upgradeKinds[kindIndex];
              const maxRank = this.getCardUpgradeMaxRank(definition, upgradeKind);

              for (let rank = 1; rank <= maxRank; rank++) {
                const offerWave = this.getCardProgressionWave(definition) + rank;

                if (offerWave > fullProgressionWave) {
                  postProgressionPending.push({
                    cardId: definition.id,
                    upgradeKind,
                    rank,
                    offerLevel: 0
                  });
                  continue;
                }

                let pending = offersByWave.get(offerWave);

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

          const result = [];
          const offerWaves = Array.from(offersByWave.keys()).sort((a, b) => a - b);

          for (let i = 0; i < offerWaves.length; i++) {
            const offerWave = offerWaves[i];
            const pending = offersByWave.get(offerWave) || [];
            const offerLevels = this.getCardUpgradeOfferLevels(offerWave, fullProgressionWave);
            if (offerLevels.length <= 0) continue;

            for (let itemIndex = 0; itemIndex < pending.length; itemIndex++) {
              result.push({ ...pending[itemIndex],
                offerLevel: Math.min(totalLevels, offerLevels[Math.min(offerLevels.length - 1, Math.floor(itemIndex * offerLevels.length / pending.length))] + offerLevelOffset)
              });
            }
          }

          const postProgressionOfferLevels = this.getCardUpgradeOfferLevels(fullProgressionWave + 1, fullProgressionWave);

          for (let index = 0; index < postProgressionPending.length; index++) {
            result.push({ ...postProgressionPending[index],
              offerLevel: Math.min(totalLevels, postProgressionOfferLevels[Math.min(postProgressionOfferLevels.length - 1, Math.floor(index * postProgressionOfferLevels.length / postProgressionPending.length))] + offerLevelOffset)
            });
          }

          return offerLevelOffset > 0 ? this.applyPlayerPackageOfferCap(result) : result;
        }

        applyPlayerPackageOfferCap(upgrades) {
          const cap = Math.max(0, Math.floor(this.maxPlayerPackagesPerLevel));
          if (cap <= 0 || upgrades.length <= 0) return upgrades;
          const totalLevels = this.getSafeTotalLevels();
          const packageCounts = this.getPlayerNonCardUpgradeOfferCounts();
          const ordered = upgrades.map((offer, order) => ({
            offer,
            order
          })).sort((a, b) => a.offer.offerLevel - b.offer.offerLevel || a.order - b.order);
          const result = [];

          for (let index = 0; index < ordered.length; index++) {
            const item = ordered[index];
            let offerLevel = Math.max(1, item.offer.offerLevel);

            while (offerLevel < totalLevels && (packageCounts[offerLevel - 1] || 0) >= cap) {
              offerLevel++;
            } // Existing content must remain reachable even if a future content
            // expansion exhausts all remaining campaign slots. The current
            // configuration has spare capacity; this fallback is only safer
            // than silently dropping an earned upgrade.


            offerLevel = Math.min(totalLevels, offerLevel);
            packageCounts[offerLevel - 1] = (packageCounts[offerLevel - 1] || 0) + 1;
            result.push({ ...item.offer,
              offerLevel
            });
          }

          return result;
        }

        getPlayerNonCardUpgradeOfferCounts() {
          const totalLevels = this.getSafeTotalLevels();

          if (this.playerNonCardUpgradeOfferCounts && this.playerNonCardUpgradeOfferCounts.length === totalLevels) {
            return this.playerNonCardUpgradeOfferCounts.slice();
          }

          const result = new Array(totalLevels).fill(0);
          const savedState = this.progressionState;
          const savedBattleLevel = this.battleLevel;

          try {
            const planState = this.createInitialProgressionState();
            planState.playerGold = Number.MAX_SAFE_INTEGER;
            this.progressionState = planState;

            for (let level = 1; level <= totalLevels; level++) {
              this.battleLevel = level;
              this.offerIntroducedUnits(level); // Apply the no-loss baseline route only. Card upgrades are
              // deliberately excluded: this helper reserves their slots.

              for (let pass = 0; pass < 1000; pass++) {
                const option = this.getPurchaseOptions(planState, false).slice().sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id))[0];
                if (!option) break;
                result[level - 1]++;
                this.applyPurchaseToState(option, planState);
              }
            }
          } finally {
            this.progressionState = savedState;
            this.battleLevel = savedBattleLevel;
          }

          this.playerNonCardUpgradeOfferCounts = result;
          return result.slice();
        }

        getCardUpgradeOfferLevels(offerWave, fullProgressionWave) {
          const progressionEnd = this.getUnitProgressionEndLevel();
          const totalLevels = this.getSafeTotalLevels();
          const startLevel = offerWave <= fullProgressionWave ? this.getCardProgressionWaveStartLevel(offerWave) : progressionEnd + 1;
          const nextWaveStart = offerWave < fullProgressionWave ? this.getCardProgressionWaveStartLevel(offerWave + 1) : progressionEnd + 1;
          const endLevel = offerWave <= fullProgressionWave ? Math.min(totalLevels, nextWaveStart - 1) : totalLevels - 1;
          const result = [];

          for (let level = startLevel; level <= endLevel; level++) {
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
          let result = this.getUnitProgressionEndLevel();

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];

            if (!rule || this.getUnitFamilyCardProgressionWave(rule.family) !== wave) {
              continue;
            }

            result = Math.min(result, this.getRuleUnlockLevel(rule));
          }

          return result;
        }

        isPlayerFamilyOwned(family, state) {
          const rule = this.unitProgressionRules.find(candidate => candidate && candidate.family === family);
          const saved = rule ? this.getSavedUnit(state, this.getRuleKey(rule)) : null;
          return !!saved && saved.unlocked && saved.unitCount > 0;
        }

        getCardFamiliesForTeam(team, state) {
          const result = [];

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const saved = this.getSavedUnit(state, this.getRuleKey(rule));
            const available = team === 1 ? this.battleLevel >= this.getRuleUnlockLevel(rule) && this.getEnemyUnitCount(rule, this.battleLevel) > 0 : !!saved && saved.unlocked && saved.unitCount > 0;
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
          const counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          if (!counter) return false;
          const attackingFamilies = this.getCardFamiliesForTeam(protectedTeam === 1 ? 0 : 1, state);

          for (let i = 0; i < attackingFamilies.length; i++) {
            for (let j = 0; j < protectedFamilies.length; j++) {
              if (counter.getDamageMultiplier(attackingFamilies[i], protectedFamilies[j]) > 1.0001) {
                return true;
              }
            }
          }

          return false;
        }

        createCardDefinitionSnapshot() {
          const manager = this.getGameManager();
          const database = manager ? manager.battleCardDatabase : null;
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
          const initial = this.createInitialProgressionState();
          const sourceVersion = this.safeInteger(source.version, 0);

          if (sourceVersion !== 8 && sourceVersion !== 9 && sourceVersion !== 10 && sourceVersion !== 11 && sourceVersion !== 12 && sourceVersion !== 13 && sourceVersion !== 14) {
            return initial;
          }

          const savedUnits = Array.isArray(source.units) ? source.units : [];
          const savedCPPackages = Array.isArray(source.cpPackages) ? source.cpPackages : [];
          const savedMaxAlivePackages = Array.isArray(source.maxAlivePackages) ? source.maxAlivePackages : [];
          const savedCards = Array.isArray(source.cards) ? source.cards : [];
          const savedBotSimulationEvents = Array.isArray(source.botSimulationEvents) ? source.botSimulationEvents : [];
          initial.currentLevel = this.clampLevel(this.safeInteger(source.currentLevel, initial.currentLevel));
          initial.telemetryRunId = typeof source.telemetryRunId === 'string' && source.telemetryRunId.length > 0 ? source.telemetryRunId : initial.telemetryRunId;
          initial.telemetryBattleIndex = Math.max(0, this.safeInteger(source.telemetryBattleIndex, 0));
          initial.playerGold = Math.max(0, this.safeInteger(source.playerGold, 0));
          initial.adsReward = Math.max(0, this.safeInteger(source.adsReward, 0));
          initial.levelLossCount = Math.max(0, this.safeInteger(source.levelLossCount, 0));
          initial.mainLossesAtCurrentLevel = Math.max(0, this.safeInteger(source.mainLossesAtCurrentLevel, 0));
          initial.consecutiveSideWins = Math.max(0, this.safeInteger(source.consecutiveSideWins, 0));
          initial.consecutiveSideRecoveryLosses = Math.max(0, this.safeInteger(source.consecutiveSideRecoveryLosses, 0));
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

          for (let i = 0; i < initial.cpPackages.length; i++) {
            const item = initial.cpPackages[i];
            const saved = savedCPPackages.find(candidate => candidate && candidate.id === item.id);
            if (!saved) continue;
            item.claimed = !!saved.claimed;
            item.claimSource = item.claimed && typeof saved.claimSource === 'string' ? saved.claimSource : '';
          }

          for (let i = 0; i < initial.maxAlivePackages.length; i++) {
            const item = initial.maxAlivePackages[i];
            const saved = savedMaxAlivePackages.find(candidate => candidate && candidate.id === item.id);
            if (!saved) continue;
            item.claimed = !!saved.claimed;
            item.claimSource = item.claimed && typeof saved.claimSource === 'string' ? saved.claimSource : '';
          }

          initial.playerInitialCP = this.getPlayerCPFromState(initial);
          initial.playerMaxAlive = this.getPlayerMaxAliveFromState(initial);
          initial.totalPurchases = Math.max(0, this.safeInteger(source.totalPurchases, 0));
          initial.mainBattleEntryCount = Math.max(0, this.safeInteger(source.mainBattleEntryCount, initial.currentLevel > 1 ? 1 : 0));
          const savedEnemyDecks = source.enemyCardIdsByLevel;
          const savedEnemyDeckPolicyVersion = this.safeInteger(source.enemyCardDeckPolicyVersion, 0);

          if (savedEnemyDeckPolicyVersion === this.enemyCardDeckPolicyVersion && savedEnemyDecks && typeof savedEnemyDecks === 'object' && !Array.isArray(savedEnemyDecks)) {
            for (const key of Object.keys(savedEnemyDecks)) {
              const level = this.safeInteger(key, 0);
              const deck = savedEnemyDecks[key];
              if (level < 1 || !Array.isArray(deck)) continue;
              initial.enemyCardIdsByLevel[String(level)] = deck.filter(id => typeof id === 'string').slice(0, 3);
            }
          } else if (savedEnemyDeckPolicyVersion === this.enemyCardDeckPolicyVersion && Array.isArray(source.lastEnemyCardIds)) {
            const level = initial.currentLevel;
            initial.enemyCardIdsByLevel[String(level)] = source.lastEnemyCardIds.filter(id => typeof id === 'string').slice(0, 3);
          }

          for (let i = 0; i < initial.cards.length; i++) {
            var _this$getGameManager;

            const card = initial.cards[i];
            const definition = (_this$getGameManager = this.getGameManager()) != null && _this$getGameManager.battleCardDatabase ? this.getGameManager().battleCardDatabase.getCard(card.id) : null;
            const saved = savedCards.find(candidate => candidate && candidate.id === card.id);
            if (!saved) continue;
            card.owned = !!saved.owned;
            card.cooldownUpgradeLevel = Math.max(0, Math.min(2, this.safeInteger(saved.cooldownUpgradeLevel, 0)));
            card.budgetUpgradeLevel = Math.max(0, Math.min(2, this.safeInteger(saved.budgetUpgradeLevel, 0)));
            card.strengthUpgradeLevel = Math.max(0, Math.min(definition && this.hasStrengthUpgrade(definition) ? this.getStrengthUpgradeMaxRank(definition) : 0, this.safeInteger(saved.strengthUpgradeLevel, 0)));
            card.cooldownRemaining = Math.max(0, this.safeInteger(saved.cooldownRemaining, 0));
          }

          for (let i = 0; i < initial.units.length; i++) {
            const unit = initial.units[i];
            const saved = savedUnits.find(candidate => candidate && candidate.key === unit.key);
            const rule = this.getRuleByKey(unit.key);
            if (!saved || !rule) continue;
            unit.offered = !!saved.offered || unit.offered;
            unit.unlocked = !!saved.unlocked || unit.unlocked;
            unit.unitCount = Math.max(this.getRuleUnlockCount(rule), Math.min(this.getRuleMaxCount(rule), this.safeInteger(saved.unitCount, unit.unitCount)));
          }

          return initial;
        }

        applyProgressionRuntimeState(syncCurrentCombatPoint) {
          if (!this.progressionState) return;
          const manager = this.getGameManager();
          if (!manager || !manager.unitDatabase) return;
          const state = this.progressionState;

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const playerEntry = this.findEntryForRule(manager.unitDatabase.teamAUnits, rule);
            const enemyEntry = this.findEntryForRule(manager.unitDatabase.teamBUnits, rule);
            const playerUnit = this.getSavedUnit(state, this.getRuleKey(rule));

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

          const playerBrains = this.getTargetBattleArmyBrains(0);

          for (let i = 0; i < playerBrains.length; i++) {
            playerBrains[i].maxAliveWaves = state.playerMaxAlive;
          }
        }

        applySideMissionRuntimeState() {
          if (!this.progressionState) return;
          const manager = this.getGameManager();
          if (!manager || !manager.unitDatabase) return;
          const state = this.progressionState;

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const enemyEntry = this.findEntryForRule(manager.unitDatabase.teamBUnits, rule);
            const playerUnit = this.getSavedUnit(state, this.getRuleKey(rule));

            if (enemyEntry && playerUnit) {
              enemyEntry.unlocked = playerUnit.unlocked;
              enemyEntry.unitCount = playerUnit.unitCount;
            }
          }

          manager.unitDatabase.teamBInitialCombatPoint = state.playerInitialCP;
          manager.initialCombatPoint[1] = state.playerInitialCP;
          manager.combatPoint[1] = state.playerInitialCP;
          const enemyBrains = this.getTargetBattleArmyBrains(1);
          const baselineAccuracy = this.clamp01(this.lerp(this.decisionAccuracyMin, this.decisionAccuracyMax, this.getProgression01(this.battleLevel)));
          const recovery = this.getSideEconomyRecoveryStatus(state);

          if (!recovery.active) {
            state.consecutiveSideRecoveryLosses = 0;
          }

          const recoveryAccuracyMultiplier = recovery.active ? Math.pow(this.clamp01(this.sideRecoveryAccuracyMultiplier), state.consecutiveSideRecoveryLosses) : 1;

          for (let i = 0; i < enemyBrains.length; i++) {
            enemyBrains[i].maxAliveWaves = state.playerMaxAlive;

            if (this.allowDecisionAccuracy) {
              enemyBrains[i].decisionAccuracy = this.clamp01(baselineAccuracy * recoveryAccuracyMultiplier);
            }
          }
        }

        configureSideMissionBattleCards() {
          this.currentPlayerBattleCardIds = [];
          this.currentEnemyBattleCardIds = [];
          this.currentPlayerCooldownAdReasons.clear();
          const manager = this.getGameManager();
          if (!manager) return;
          manager.configureBattleCardDecks([], [], {}, {}, {}, 0, 0);
        }

        getPurchaseOptions(state, includeCardUpgrades = true) {
          const options = [];
          const manager = this.getGameManager();

          if (!manager || !manager.unitDatabase) {
            return options;
          } // Level 1 is the tutorial battle: show no purchasable progression
          // packages until the player reaches the pre-battle flow for level 2.


          if (this.battleLevel <= 1) {
            return options;
          }

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const key = this.getRuleKey(rule);
            const saved = this.getSavedUnit(state, key);
            const entry = this.findEntryForRule(manager.unitDatabase.teamAUnits, rule);
            if (!saved || !entry) continue;
            const unlockPrice = this.getUnitUnlockPrice(entry);
            const familyName = (_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
              error: Error()
            }), unitFamilyToName) : unitFamilyToName)(rule.family);

            if (saved.offered && !saved.unlocked) {
              options.push({
                id: `unlock:${key}`,
                kind: 'unit-unlock',
                cost: unlockPrice,
                family: rule.family,
                tier: rule.tier,
                delta: 1,
                label: `Unlock ${familyName} T${rule.tier}`,
                cardId: null
              });
            }

            if (saved.unlocked && saved.unitCount < this.getPlayerUnitCountMilestoneCap(rule, this.battleLevel, state)) {
              options.push({
                id: `count:${key}`,
                kind: 'unit-count',
                cost: Math.max(1, Math.round(unlockPrice / this.getRuleUnlockCount(rule))),
                family: rule.family,
                tier: rule.tier,
                delta: 1,
                label: `+1 ${familyName} T${rule.tier}`,
                cardId: null
              });
            }
          }

          const nextCPPackage = this.getNextAvailableCPPackage(state, this.battleLevel);

          if (nextCPPackage) {
            options.push({
              id: `initial-cp:${nextCPPackage.id}`,
              kind: 'initial-cp',
              cost: this.getInitialCPPackageCost(nextCPPackage.delta),
              family: null,
              tier: 0,
              delta: nextCPPackage.delta,
              label: `+${nextCPPackage.delta} Initial CP`,
              cardId: null
            });
          }

          const nextMaxAlivePackage = this.getNextAvailableMaxAlivePackage(state, this.battleLevel);

          if (nextMaxAlivePackage) {
            options.push({
              id: `max-alive:${nextMaxAlivePackage.id}`,
              kind: 'max-alive',
              cost: this.getMaxAlivePackageCost(nextMaxAlivePackage.delta, state.playerMaxAlive),
              family: null,
              tier: 0,
              delta: nextMaxAlivePackage.delta,
              label: `+${nextMaxAlivePackage.delta} Max Alive`,
              cardId: null
            });
          }

          const cardDatabase = manager ? manager.battleCardDatabase : null;

          if (cardDatabase) {
            for (let i = 0; i < cardDatabase.cards.length; i++) {
              const definition = cardDatabase.cards[i];
              if (!definition || !definition.id) continue;
              const saved = this.getSavedCard(state, definition.id);
              if (!saved) continue;

              if (!this.hasReachedFullProgression() && !this.isCardEligibleForTeam(definition, 0, state)) {
                continue;
              }

              if (!saved.owned) {
                options.push({
                  id: `card-unlock:${definition.id}`,
                  kind: 'card-unlock',
                  cost: Math.max(1, Math.round(definition.purchasePrice)),
                  family: null,
                  tier: 0,
                  delta: 1,
                  label: `Unlock ${definition.displayName}`,
                  cardId: definition.id
                });
                continue;
              }

              if (!includeCardUpgrades) continue;
              const cooldownUpgradeRankLimit = this.getCardUpgradeRankLimit(definition, 'cooldown');
              const budgetUpgradeRankLimit = this.getCardUpgradeRankLimit(definition, 'budget');
              const strengthUpgradeRankLimit = this.getCardUpgradeRankLimit(definition, 'strength');

              if (saved.cooldownUpgradeLevel < cooldownUpgradeRankLimit) {
                const nextLevel = saved.cooldownUpgradeLevel + 1;
                options.push({
                  id: `card-cooldown:${definition.id}:${nextLevel}`,
                  kind: 'card-cooldown-upgrade',
                  cost: this.getCardCooldownUpgradeCost(definition, nextLevel),
                  family: null,
                  tier: 0,
                  delta: 1,
                  label: `${definition.displayName} Cooldown -1`,
                  cardId: definition.id
                });
              }

              if (saved.budgetUpgradeLevel < budgetUpgradeRankLimit) {
                const nextLevel = saved.budgetUpgradeLevel + 1;
                options.push({
                  id: `card-budget:${definition.id}:${nextLevel}`,
                  kind: 'card-budget-upgrade',
                  cost: this.getCardBudgetUpgradeCost(definition, nextLevel),
                  family: null,
                  tier: 0,
                  delta: 1,
                  label: `${definition.displayName} Budget +40%`,
                  cardId: definition.id
                });
              }

              if (saved.strengthUpgradeLevel < strengthUpgradeRankLimit) {
                const nextLevel = saved.strengthUpgradeLevel + 1;
                options.push({
                  id: `card-strength:${definition.id}:${nextLevel}`,
                  kind: 'card-strength-upgrade',
                  cost: this.getCardStrengthUpgradeCost(definition, nextLevel),
                  family: null,
                  tier: 0,
                  delta: 1,
                  label: `${definition.displayName} Strength +1`,
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
          const ratio = nextLevel <= 1 ? 0.6 : 0.9;
          return Math.max(1, Math.round(Math.max(1, definition.purchasePrice) * ratio));
        }

        getCardBudgetUpgradeCost(definition, nextLevel) {
          const ratio = nextLevel <= 1 ? 0.5 : 0.75;
          return Math.max(1, Math.round(Math.max(1, definition.purchasePrice) * ratio));
        }

        getCardStrengthUpgradeCost(definition, nextLevel) {
          const maxRank = this.getStrengthUpgradeMaxRank(definition);
          const first = Math.max(0.01, definition.strengthUpgradeFirstCostMultiplier);
          const final = Math.max(first, definition.strengthUpgradeFinalCostMultiplier);
          const progress = maxRank <= 1 ? 1 : this.clamp01((nextLevel - 1) / (maxRank - 1));
          const ratio = first + (final - first) * progress;
          return Math.max(1, Math.round(Math.max(1, definition.purchasePrice) * ratio));
        }

        shouldReserveGoldForBaseline(state) {
          return state.playerInitialCP < this.getPlayerCPMilestoneCap(this.battleLevel) || state.playerMaxAlive < this.getPlayerMaxAliveMilestoneCap(this.battleLevel) || this.getOpenedUnitCountBaselineOptions(this.getPurchaseOptions(state), state).length > 0;
        }

        getMaxAlivePackageCost(delta, currentMaxAlive) {
          return Math.max(1, Math.round(Math.max(1, this.maxAliveBasePrice) * Math.max(1, currentMaxAlive) / Math.max(1, this.getPlayerMaxAliveStart()) * Math.max(0, delta)));
        }

        runPurchaseSimulation(records, source, reservedGold = 0) {
          if (!this.progressionState) return;
          const preparationTarget = this.getBotPreparationPlan(this.progressionState).target;
          const goldAfterReservedCosts = this.progressionState.playerGold - Math.max(0, reservedGold);
          const targetReserve = preparationTarget && preparationTarget.cost <= goldAfterReservedCosts ? preparationTarget.cost : 0;
          const reserve = Math.max(0, Math.floor(reservedGold + targetReserve));

          for (let iteration = 0; iteration < 100; iteration++) {
            const affordable = this.getBotPurchaseCandidates(this.progressionState, true).filter(option => option.cost <= this.progressionState.playerGold - reserve);
            if (affordable.length <= 0) return;
            const selected = this.pickWeightedPurchase(affordable);
            if (!selected) return;
            records.push(this.applyPurchase(selected, this.progressionState, source));
          }
        }

        getBotPurchaseCandidates(state, affordableOnly, allowBossMirror = true) {
          let options = this.getPurchaseOptions(state).filter(option => !affordableOnly || option.cost <= state.playerGold);
          const baselineUnitCountOptions = this.getOpenedUnitCountBaselineOptions(options, state); // An already offered unit-count rank is part of the battle
          // baseline. Do not let an optional card or a boss mirror postpone
          // parity with the enemy's current unit count.

          if (baselineUnitCountOptions.length > 0) {
            return baselineUnitCountOptions;
          }

          if (allowBossMirror && this.isBossLevelFor(this.battleLevel)) {
            const mirrorTarget = this.getNextBossMirrorPurchaseOption(state);

            if (mirrorTarget && (!affordableOnly || mirrorTarget.cost <= state.playerGold)) {
              return [mirrorTarget];
            }
          }

          if (this.shouldReserveGoldForBaseline(state)) {
            options = options.filter(option => option.kind !== 'card-unlock' && option.kind !== 'card-cooldown-upgrade' && option.kind !== 'card-budget-upgrade' && option.kind !== 'card-strength-upgrade');
          }

          if (this.shouldBotPrioritizeCardUnlocks(state)) {
            options = options.filter(option => option.kind !== 'card-cooldown-upgrade' && option.kind !== 'card-budget-upgrade' && option.kind !== 'card-strength-upgrade');
          }

          if (this.shouldBotPrioritizeCooldownUpgrades(state)) {
            options = options.filter(option => option.kind !== 'card-budget-upgrade');
          }

          const currentLevelUnitUnlocks = options.filter(option => {
            if (option.kind !== 'unit-unlock' || option.family === null) {
              return false;
            }

            const rule = this.getRule(option.family, option.tier);
            return !!rule && this.getRuleUnlockLevel(rule) === this.battleLevel;
          });
          return currentLevelUnitUnlocks.length > 0 ? currentLevelUnitUnlocks : options;
        }

        getOpenedUnitCountBaselineOptions(options, state) {
          return options.filter(option => {
            if (option.kind !== 'unit-count' || option.family === null) {
              return false;
            }

            const rule = this.getRule(option.family, option.tier);
            const saved = rule ? this.getSavedUnit(state, this.getRuleKey(rule)) : null;
            return !!rule && !!saved && saved.unlocked && saved.unitCount < this.getEnemyUnitCount(rule, this.battleLevel);
          });
        }

        getBotPreparationPlan(state) {
          const currentStrength = this.getPreparedPlayerStrength(state);
          const enemyStrength = this.getEnemyTeamCombatWeightForCardScore(state) + this.getEnemyDeckScore(state);
          const bossMirrorTarget = this.getNextBossMirrorPurchaseOption(state);

          if (bossMirrorTarget) {
            return {
              target: bossMirrorTarget,
              currentStrength,
              targetStrength: currentStrength,
              enemyStrength
            };
          }

          let target = null;
          let targetStrength = currentStrength;
          const options = this.getPurchaseOptions(state);

          for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const simulated = JSON.parse(JSON.stringify(state));
            this.applyPurchaseToState(option, simulated);
            const simulatedStrength = this.getPreparedPlayerStrength(simulated);

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

        getNextBossMirrorPurchaseOption(state) {
          if (!this.isBossLevelFor(this.battleLevel)) return null;
          const manager = this.getGameManager();
          const database = manager ? manager.battleCardDatabase : null;
          if (!database) return null;

          for (let i = 0; i < this.currentEnemyBattleCardIds.length; i++) {
            const cardId = this.currentEnemyBattleCardIds[i];
            const definition = database.getCard(cardId);
            const saved = this.getSavedCard(state, cardId);

            if (!definition || !this.isCardEligibleForTeam(definition, 0, state)) {
              continue;
            }

            if (!saved || !saved.owned) {
              const unlock = this.getPurchaseOptions(state).find(option => option.kind === 'card-unlock' && option.cardId === cardId);
              if (unlock) return unlock;
              continue;
            }

            const enemyStrengthRank = this.getEnemyStrengthUpgradeRank(definition, this.battleLevel);

            if (saved.strengthUpgradeLevel < enemyStrengthRank) {
              const strengthUpgrade = this.getPurchaseOptions(state).find(option => option.kind === 'card-strength-upgrade' && option.cardId === cardId);
              if (strengthUpgrade) return strengthUpgrade;
            }
          }

          return null;
        }

        getPreparedPlayerStrength(state) {
          const manager = this.getGameManager();
          const database = manager ? manager.battleCardDatabase : null;
          const definitions = database ? database.cards.filter(definition => {
            const saved = this.getSavedCard(state, definition.id);
            return !!saved && saved.owned && this.isCardEligibleForTeam(definition, 0, state);
          }) : [];
          const cardIds = this.selectBestPlayerCardIds(definitions, state, this.getBattleCardDeckSize());
          return this.getPlayerTeamCombatWeightForCardScore(state) + this.getPlayerDeckScore(cardIds, definitions, state);
        }

        shouldBotPrepareBattleCards(state) {
          const manager = this.getGameManager();
          const database = manager ? manager.battleCardDatabase : null;
          if (!database) return false;
          const readyDefinitions = database.cards.filter(definition => {
            const saved = this.getSavedCard(state, definition.id);
            return !!saved && saved.owned && saved.cooldownRemaining <= 0 && this.isCardEligibleForTeam(definition, 0, state);
          });
          const readyCardIds = this.selectBestPlayerCardIds(readyDefinitions, state, this.getBattleCardDeckSize());
          return !this.isPlayerDeckCompetitive(readyCardIds, readyDefinitions, state) && this.getPreparedPlayerStrength(state) >= this.getEnemyTeamCombatWeightForCardScore(state) + this.getEnemyDeckScore(state);
        }

        tryPurchaseBotPreparationTarget(plan, records, reservedGold) {
          if (!this.progressionState || !plan.target) return false;
          const availableGold = this.progressionState.playerGold - Math.max(0, reservedGold);
          if (plan.target.cost > availableGold) return false;
          records.push(this.applyPurchase(plan.target, this.progressionState, 'pre-battle-preparation'));
          return true;
        }

        tryRouteBotToSideMission(preparationPlan = null) {
          if (!this.progressionState) return false;
          const state = this.progressionState;

          if (preparationPlan && preparationPlan.target) {
            const requiredGold = preparationPlan.target.cost + this.getCurrentMainBattleEntryFee();

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
          const target = this.pickWeightedPurchase(this.getBotPurchaseCandidates(state, false).filter(option => option.cost > state.playerGold));
          if (!target) return false;
          const choice = Math.random() < 0.5 ? 'side-mission' : 'progression';
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
          const state = this.progressionState;
          const fee = this.getCurrentMainBattleEntryFee();
          const goldBefore = state.playerGold;

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
          const record = {
            id: `battle-entry:${this.battleLevel}`,
            kind: 'battle-entry',
            label: fee > 0 ? `Main Battle Entry Fee -${fee} Gold` : 'First Main Battle Entry Free',
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

        getMainBattleReward(level) {
          const safeLevel = this.clampLevel(level);
          const normalGold = this.getMainBattleNormalReward(safeLevel);
          const gold = this.isBossLevelFor(safeLevel) ? this.getBossMainBattleReward(safeLevel) : normalGold;
          return {
            targetId: 'mainline-gold-plan',
            targetCost: 0,
            gold
          };
        }

        getMainBattleNormalReward(level) {
          const safeLevel = this.clampLevel(level);
          const plan = this.getMainBattleNormalGoldPlan();
          return plan[safeLevel - 1] || 0;
        }

        getBossMainBattleReward(level) {
          const safeLevel = this.clampLevel(level);
          const plan = this.getMainBattleNormalGoldPlan();
          return this.getMainBattleRewardForNormalBase(safeLevel, plan[safeLevel - 1] || 0);
        }

        getMainBattleNormalGoldPlan() {
          const totalLevels = this.getSafeTotalLevels();

          if (this.mainBattleNormalGoldPlan && this.mainBattleNormalGoldPlan.length === totalLevels) {
            return this.mainBattleNormalGoldPlan;
          }

          const contentFundingBudgets = this.getMainlineContentFundingBudgets();
          const result = [];
          let previousReward = 0;
          let availableGold = Math.max(0, Math.floor(this.initialPlayerGold));
          const targetReserve = Math.max(0, Math.round(Math.max(0, this.mainlineNoLossGoldReserve) / 50) * 50); // Rewards are paced by bossStagePace instead of rising every battle.
          // A pace has one normal reward; the following pace raises it by at
          // least 50. At each pace start, look ahead through the entire pace so
          // a package near its end cannot create an arbitrary normal-level
          // reward spike.

          for (let level = 1; level <= totalLevels; level++) {
            const entryFee = level <= 1 ? 0 : this.getMainBattleEntryFeeForReward(previousReward, level);
            availableGold -= contentFundingBudgets[level - 1] + entryFee;
            const paceStart = level <= 1 || this.getRewardPaceIndex(level) !== this.getRewardPaceIndex(level - 1);
            let normalReward = paceStart ? previousReward + 50 : previousReward;

            if (paceStart) {
              const paceEnd = Math.min(totalLevels, this.getRewardPaceEndLevel(level));

              const canFundPace = candidate => {
                let projectedGold = availableGold;

                for (let projectedLevel = level; projectedLevel <= paceEnd; projectedLevel++) {
                  if (projectedLevel > level) {
                    const projectedFee = this.getMainBattleEntryFeeForReward(candidate, projectedLevel);
                    projectedGold -= contentFundingBudgets[projectedLevel - 1] + projectedFee; // A pace must fund every individual battle gate, not merely
                    // recover by its final reward. Otherwise this calculation
                    // implicitly borrows gold from a later battle reward.

                    if (projectedGold < 0) {
                      return false;
                    }
                  }

                  projectedGold += this.getMainBattleRewardForNormalBase(projectedLevel, candidate);
                }

                if (paceEnd >= totalLevels) return true;
                const nextLevel = paceEnd + 1;
                const nextEntryFee = this.getMainBattleEntryFeeForReward(candidate, nextLevel);
                return projectedGold >= contentFundingBudgets[nextLevel - 1] + nextEntryFee + targetReserve;
              };

              if (!canFundPace(normalReward)) {
                let lowStep = Math.ceil(normalReward / 50);
                let highStep = lowStep;

                for (let pass = 0; pass < 32; pass++) {
                  highStep += Math.pow(2, pass);

                  if (canFundPace(highStep * 50)) {
                    break;
                  }
                }

                while (lowStep < highStep) {
                  const middleStep = Math.floor((lowStep + highStep) / 2);

                  if (canFundPace(middleStep * 50)) {
                    highStep = middleStep;
                  } else {
                    lowStep = middleStep + 1;
                  }
                }

                normalReward = highStep * 50;
              }
            }

            result.push(normalReward);
            availableGold += this.getMainBattleRewardForNormalBase(level, normalReward);
            previousReward = normalReward;
          }

          this.mainBattleNormalGoldPlan = result;
          return result;
        }

        getRewardPaceIndex(level) {
          const pace = Math.max(0, Math.floor(this.bossStagePace));
          const safeLevel = Math.max(1, Math.floor(level));
          return pace > 0 ? Math.floor((safeLevel - 1) / pace) : safeLevel - 1;
        }

        getRewardPaceEndLevel(level) {
          const pace = Math.max(0, Math.floor(this.bossStagePace));
          if (pace <= 0) return Math.max(1, Math.floor(level));
          return (this.getRewardPaceIndex(level) + 1) * pace;
        }

        getMainBattleRewardForNormalBase(level, normalReward) {
          const safeReward = Math.max(0, normalReward);
          if (!this.isBossLevelFor(level)) return safeReward;
          return Math.ceil(safeReward * Math.max(1, this.bossGoldRewardMultiplier) / 50) * 50;
        }

        getMainlineContentFundingBudgets() {
          const totalLevels = this.getSafeTotalLevels();
          const result = new Array(totalLevels).fill(0);
          const savedState = this.progressionState;
          const savedBattleLevel = this.battleLevel;

          try {
            const planState = this.createInitialProgressionState();
            this.progressionState = planState;
            planState.playerGold = Number.MAX_SAFE_INTEGER;

            for (let level = 1; level <= totalLevels; level++) {
              this.battleLevel = level;
              this.offerIntroducedUnits(level); // Purchase every option made available at this level. Repeat
              // because an unlock can expose its upgrade packages.

              for (let pass = 0; pass < 1000; pass++) {
                const options = this.getPurchaseOptions(planState).slice().sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id));
                const option = options[0];
                if (!option) break;
                result[level - 1] += option.cost;
                this.applyPurchaseToState(option, planState);
              }
            }
          } finally {
            this.progressionState = savedState;
            this.battleLevel = savedBattleLevel;
          }

          return result;
        }

        getMainlineNoLossEconomyAudit() {
          const totalLevels = this.getSafeTotalLevels();
          const savedState = this.progressionState;
          const savedBattleLevel = this.battleLevel;
          const auditState = this.createInitialProgressionState();
          let minimumGold = auditState.playerGold;

          try {
            this.progressionState = auditState;

            for (let level = 1; level <= totalLevels; level++) {
              this.battleLevel = level;
              this.offerIntroducedUnits(level);

              for (let pass = 0; pass < 1000; pass++) {
                const options = this.getPurchaseOptions(auditState).slice().sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id));
                const option = options[0];
                if (!option) break;

                if (auditState.playerGold < option.cost) {
                  return {
                    passed: false,
                    failure: 'package',
                    level,
                    gold: auditState.playerGold,
                    requiredGold: option.cost,
                    packageId: option.id,
                    minimumGold
                  };
                }

                auditState.playerGold -= option.cost;
                minimumGold = Math.min(minimumGold, auditState.playerGold);
                this.applyPurchaseToState(option, auditState);
              }

              const fee = this.getMainBattleEntryFee(level);

              if (auditState.playerGold < fee) {
                return {
                  passed: false,
                  failure: 'entry-fee',
                  level,
                  gold: auditState.playerGold,
                  requiredGold: fee,
                  packageId: '',
                  minimumGold
                };
              }

              auditState.playerGold -= fee;
              minimumGold = Math.min(minimumGold, auditState.playerGold);
              auditState.playerGold += this.getMainBattleReward(level).gold;
            }

            return {
              passed: true,
              failure: '',
              level: totalLevels,
              gold: auditState.playerGold,
              requiredGold: 0,
              packageId: '',
              minimumGold
            };
          } finally {
            this.progressionState = savedState;
            this.battleLevel = savedBattleLevel;
          }
        }

        getMainBattleEntryFee(level) {
          const safeLevel = this.clampLevel(level);
          if (safeLevel <= 1) return 0;
          return this.getMainBattleEntryFeeForReward(this.getMainBattleNormalReward(safeLevel - 1), safeLevel);
        }

        getMainBattleLossReward(level) {
          const entryFee = this.getMainBattleEntryFee(level);
          const ratio = this.clamp01(this.mainLossRewardFeeRatio);
          return Math.max(0, Math.round(entryFee * ratio / 10) * 10);
        }

        getMainBattleEntryFeeForReward(reward, level = 0) {
          const baseFee = Math.max(0, reward) * this.clamp01(this.mainBattleEntryFeeRatio);
          const monotonicMinimum = level > 1 ? (level - 1) * 50 : 0;
          return Math.max(monotonicMinimum, Math.ceil(baseFee / 50) * 50);
        }

        getCurrentMainBattleEntryFee() {
          if (!this.progressionState) return 0;
          return this.progressionState.mainBattleEntryCount <= 0 ? 0 : this.getMainBattleEntryFee(this.battleLevel);
        }

        getSideMissionReward() {
          const entryFee = Math.max(50, this.getMainBattleEntryFee(this.battleLevel));
          const multiplier = Math.max(0.1, Math.min(1, this.sideRewardFeeMultiplier));
          const baseGold = Math.max(50, Math.ceil(entryFee * multiplier / 50) * 50);
          return {
            targetId: '',
            targetCost: 0,
            gold: baseGold
          };
        }

        getSideEconomyRecoveryStatus(state) {
          const entryFee = this.getMainBattleEntryFee(this.battleLevel);
          const options = this.getPurchaseOptions(state);
          let cheapestPackageCost = 0;

          for (let i = 0; i < options.length; i++) {
            const cost = Math.max(0, options[i].cost);

            if (cheapestPackageCost <= 0 || cost < cheapestPackageCost) {
              cheapestPackageCost = cost;
            }
          }

          const requiredGold = entryFee + cheapestPackageCost;
          const shortfall = Math.max(0, requiredGold - state.playerGold);
          return {
            entryFee,
            cheapestPackageCost,
            requiredGold,
            shortfall,
            active: shortfall > 0
          };
        }

        getSideMissionContinuation(state) {
          const candidates = this.getBotPurchaseCandidates(state, false);
          const delayedPurchases = candidates.filter(option => option.cost > state.playerGold);
          const delayedPurchaseCount = delayedPurchases.length;
          const target = this.pickWeightedPurchase(delayedPurchases);
          const entryFee = this.getCurrentMainBattleEntryFee();
          const sideReward = this.getSideMissionReward().gold;
          const targetShortfall = target ? Math.max(0, target.cost + entryFee - state.playerGold) : 0;
          const resolvesTargetWithOneSide = !!target && targetShortfall > 0 && targetShortfall <= sideReward;
          return {
            delayedPurchaseCount,
            chance: resolvesTargetWithOneSide ? 0.5 : 0
          };
        }

        finishBotSelectedCardCooldowns(state) {
          if (!this.allowAdsRescue) return;

          for (let i = 0; i < this.currentPlayerBattleCardIds.length; i++) {
            const cardId = this.currentPlayerBattleCardIds[i];
            const card = this.getSavedCard(state, cardId);

            if (!card || !card.owned || card.cooldownRemaining <= 0) {
              continue;
            }

            const cooldownBefore = card.cooldownRemaining;
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

        grantBotGoldClaim(state, baseGold, type, targetId = '', targetCost = 0) {
          const reward = Math.max(0, Math.floor(baseGold));
          const decision = this.getBotGoldClaimDecision(state, reward, type);
          const useAds = type === 'side-mission-win' && this.purchasingSimulation && this.allowAdsRescue && this.allowBotGoldX2Ads && state.levelLossCount > 0 && decision.useAds;
          const goldGranted = reward * (useAds ? 2 : 1);
          const event = {
            type,
            battleLevel: this.battleLevel,
            choice: useAds ? 'gold-x2-ad' : 'gold',
            targetId: useAds && decision.targetId ? decision.targetId : targetId,
            targetCost: useAds && decision.targetCost > 0 ? decision.targetCost : targetCost,
            baseGold: reward,
            goldGranted,
            adsReason: !this.purchasingSimulation ? 'bot-simulation-disabled' : !this.allowAdsRescue ? 'ads-disabled' : !this.allowBotGoldX2Ads ? 'gold-x2-disabled' : type !== 'side-mission-win' ? 'side-rescue-only' : state.levelLossCount <= 0 ? 'mainline-run-no-rescue-needed' : decision.useAds ? decision.reason : 'no-material-benefit',
            normalGold: decision.normalGold,
            doubleGold: decision.doubleGold,
            normalPurchaseCount: decision.normalPurchaseCount,
            doublePurchaseCount: decision.doublePurchaseCount
          };
          const goldBefore = state.playerGold;
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
          const normalGold = state.playerGold + reward;
          const doubleGold = normalGold + reward;
          const nextLevel = type === 'progression-win' ? Math.min(this.getSafeTotalLevels(), this.battleLevel + 1) : this.battleLevel;
          const entryFee = type === 'progression-win' && this.battleLevel >= this.getSafeTotalLevels() ? 0 : this.getMainBattleEntryFee(nextLevel);
          const preparationPlan = type === 'side-mission-win' ? this.getBotPreparationPlan(state) : null;
          const preparationTarget = preparationPlan ? preparationPlan.target : null;
          const preparationGoldNeeded = preparationTarget ? preparationTarget.cost + entryFee : 0;

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

          const candidates = this.getBotPurchaseCandidates(state, false);
          const normalPurchases = candidates.filter(option => option.cost <= normalGold - entryFee);
          const doubleOnlyPurchases = candidates.filter(option => option.cost > normalGold - entryFee && option.cost <= doubleGold - entryFee).sort((a, b) => b.cost - a.cost || a.id.localeCompare(b.id));
          const doublePurchaseCount = normalPurchases.length + doubleOnlyPurchases.length;
          const target = doubleOnlyPurchases[0] || null;

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
          const weights = [];
          let totalWeight = 0;

          for (let i = 0; i < options.length; i++) {
            const weight = Math.max(0.01, this.getPurchaseWeight(options[i]));
            weights.push(weight);
            totalWeight += weight;
          }

          let roll = Math.random() * totalWeight;

          for (let i = 0; i < options.length; i++) {
            roll -= weights[i];
            if (roll <= 0) return options[i];
          }

          return options[options.length - 1] || null;
        }

        getPurchaseWeight(option) {
          if (!this.progressionState) return 1;
          const state = this.progressionState;
          const enemyCP = this.getEnemyInitialCP();
          const enemyMaxAlive = this.getEnemyMaxAlive();

          if (option.kind === 'initial-cp') {
            const gap = Math.max(0, enemyCP - state.playerInitialCP);
            return 1 + gap / Math.max(1, option.delta);
          }

          if (option.kind === 'max-alive') {
            return 1 + Math.max(0, enemyMaxAlive - state.playerMaxAlive) * 2;
          }

          if (option.kind === 'unit-unlock') {
            const rule = option.family === null ? null : this.getRule(option.family, option.tier);
            const age = rule ? Math.max(0, this.battleLevel - this.getRuleUnlockLevel(rule)) : 0;
            return 3 + Math.min(3, age / 5);
          }

          if (option.kind === 'unit-count' && option.family !== null) {
            const rule = this.getRule(option.family, option.tier);
            const saved = rule ? this.getSavedUnit(state, this.getRuleKey(rule)) : null;
            const enemyCount = rule ? this.getEnemyUnitCount(rule, this.battleLevel) : 0;
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
          const goldBefore = state.playerGold;
          const valueBefore = this.getPurchaseValue(option, state);
          state.playerGold = Math.max(0, state.playerGold - option.cost);
          this.applyPurchaseToState(option, state);
          state.totalPurchases++;
          const record = {
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
          const identity = this.createProgressionTelemetryIdentity();
          this.telemetryActionSequence++;
          this.telemetryActions.push({ ...action,
            eventId: `${identity.reportId}:` + `${this.telemetryActionSequence}`,
            runId: identity.runId,
            reportId: identity.reportId,
            battleIndex: identity.battleIndex,
            sequence: this.telemetryActionSequence,
            phase: this.telemetryActionPhase,
            battleLevel: this.battleLevel,
            controller: this.purchasingSimulation ? 'bot-simulation' : 'player'
          });
        }

        createProgressionTelemetryLedger() {
          return {
            schemaVersion: 4,
            ...this.createProgressionTelemetryIdentity(),
            actions: this.telemetryActions.slice()
          };
        }

        createProgressionTelemetryIdentity() {
          const state = this.progressionState;
          const runId = (state == null ? void 0 : state.telemetryRunId) || 'unknown-run';
          const battleIndex = Math.max(0, (state == null ? void 0 : state.telemetryBattleIndex) || 0);
          return {
            runId,
            battleIndex,
            reportId: `progression:${runId}:battle:${battleIndex}`
          };
        }

        createTelemetryRunId() {
          const timestamp = Date.now().toString(36);
          const random = ('0000000' + Math.floor(Math.random() * 0x100000000).toString(36)).slice(-7);
          return `run-${timestamp}-${random}`;
        }

        applyPurchaseToState(option, state) {
          if (option.kind === 'card-unlock') {
            const card = option.cardId ? this.getSavedCard(state, option.cardId) : null;
            if (!card) return;
            card.owned = true;
            return;
          }

          if (option.kind === 'card-budget-upgrade') {
            const card = option.cardId ? this.getSavedCard(state, option.cardId) : null;
            if (!card || !card.owned) return;
            card.budgetUpgradeLevel = Math.min(2, card.budgetUpgradeLevel + 1);
            return;
          }

          if (option.kind === 'card-cooldown-upgrade') {
            const card = option.cardId ? this.getSavedCard(state, option.cardId) : null;
            if (!card || !card.owned) return;
            card.cooldownUpgradeLevel = Math.min(2, card.cooldownUpgradeLevel + 1);
            card.cooldownRemaining = Math.max(0, card.cooldownRemaining - 1);
            return;
          }

          if (option.kind === 'card-strength-upgrade') {
            var _this$getGameManager2;

            const card = option.cardId ? this.getSavedCard(state, option.cardId) : null;
            const definition = option.cardId && (_this$getGameManager2 = this.getGameManager()) != null && _this$getGameManager2.battleCardDatabase ? this.getGameManager().battleCardDatabase.getCard(option.cardId) : null;
            if (!card || !card.owned || !definition) return;
            card.strengthUpgradeLevel = Math.min(this.getStrengthUpgradeMaxRank(definition), card.strengthUpgradeLevel + 1);
            return;
          }

          if (option.kind === 'initial-cp') {
            const packageId = option.id.substring('initial-cp:'.length);
            const item = state.cpPackages.find(candidate => candidate.id === packageId);
            if (!item || item.claimed) return;
            item.claimed = true;
            item.claimSource = 'purchase';
            state.playerInitialCP = this.getPlayerCPFromState(state);
            return;
          }

          if (option.kind === 'max-alive') {
            const packageId = option.id.substring('max-alive:'.length);
            const item = state.maxAlivePackages.find(candidate => candidate.id === packageId);
            if (!item || item.claimed) return;
            item.claimed = true;
            item.claimSource = 'purchase';
            state.playerMaxAlive = this.getPlayerMaxAliveFromState(state);
            return;
          }

          if (option.family === null) return;
          const rule = this.getRule(option.family, option.tier);
          if (!rule) return;
          const saved = this.getSavedUnit(state, this.getRuleKey(rule));
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
            const card = option.cardId ? this.getSavedCard(state, option.cardId) : null;
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
          const rule = this.getRule(option.family, option.tier);
          const saved = rule ? this.getSavedUnit(state, this.getRuleKey(rule)) : null;
          if (!saved) return 0;
          return option.kind === 'unit-unlock' ? Number(saved.unlocked) : saved.unitCount;
        }

        offerIntroducedUnits(level) {
          if (!this.progressionState) return [];
          const result = [];

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;

            if (this.getRuleUnlockLevel(rule) > level) {
              continue;
            }

            const saved = this.getSavedUnit(this.progressionState, this.getRuleKey(rule));
            if (!saved || saved.offered) continue;
            saved.offered = true;
            result.push(`${(_crd && unitFamilyToName === void 0 ? (_reportPossibleCrUseOfunitFamilyToName({
              error: Error()
            }), unitFamilyToName) : unitFamilyToName)(rule.family)} T${rule.tier}`);
          }

          return result;
        }

        createUnitProgressionSnapshot() {
          if (!this.progressionState) return [];
          return this.unitProgressionRules.filter(rule => !!rule).map(rule => {
            const saved = this.getSavedUnit(this.progressionState, this.getRuleKey(rule));
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

        getUnitCountUpgradeRank(rule, level, state = null) {
          const maxRank = Math.max(0, this.getRuleMaxCount(rule) - this.getRuleUnlockCount(rule));
          const safeLevel = this.clampLevel(level);
          const milestoneRank = this.getUnitCountMilestoneRank(rule, safeLevel, state);
          const tailRank = this.getUnitCountTailUpgradeSchedule().filter(item => item.key === this.getRuleKey(rule) && item.level <= safeLevel).length;
          return Math.min(maxRank, milestoneRank + tailRank);
        }

        getUnitCountMilestoneRank(rule, level, state = null) {
          const unlockLevel = this.getRuleUnlockLevel(rule);
          let rank = 0;
          const milestones = this.getUnitUnlockMilestoneLevels();

          for (let i = 0; i < milestones.length; i++) {
            const milestone = milestones[i];

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
          const normalLevels = this.getPostProgressionNormalLevels();
          if (normalLevels.length <= 0) return [];
          const pending = [];
          const progressionEnd = this.getUnitProgressionEndLevel();

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const maxRank = Math.max(0, this.getRuleMaxCount(rule) - this.getRuleUnlockCount(rule));
            const remaining = maxRank - this.getUnitCountMilestoneRank(rule, progressionEnd);
            if (remaining <= 0) continue;
            pending.push({
              key: this.getRuleKey(rule),
              remaining
            });
          }

          const keys = [];

          while (pending.some(item => item.remaining > 0)) {
            for (let i = 0; i < pending.length; i++) {
              const item = pending[i];
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
          const result = [];
          const progressionEnd = this.getUnitProgressionEndLevel();
          const totalLevels = this.getSafeTotalLevels();

          for (let level = progressionEnd + 1; level < totalLevels; level++) {
            if (!this.isBossLevelFor(level)) {
              result.push(level);
            }
          }

          return result;
        }

        getUnitUnlockMilestoneLevels() {
          const result = [];

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            const level = this.getRuleUnlockLevel(rule);
            if (level <= 1 || result.indexOf(level) >= 0) continue;
            result.push(level);
          }

          return result.sort((a, b) => a - b);
        }

        isUnitUnlockMilestoneOffered(milestone, state) {
          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;

            if (this.getRuleUnlockLevel(rule) !== milestone) {
              continue;
            }

            const saved = this.getSavedUnit(state, this.getRuleKey(rule));
            if (saved && saved.offered) return true;
          }

          return false;
        }

        getUnitUnlockPrice(entry) {
          return Math.max(1, Math.round(Math.max(0, entry.combatPointCost) * Math.max(1, this.unitUnlockCostMultiplier)));
        }

        getEnemyInitialCP() {
          const manager = this.getGameManager();
          return manager ? Math.max(0, manager.initialCombatPoint[1]) : 0;
        }

        getEnemyMaxAlive() {
          const brain = this.getFirstBrainForTeam(1);
          return brain ? Math.max(0, brain.maxAliveWaves) : 0;
        }

        getFirstBrainForTeam(team) {
          const brains = this.getTargetBattleArmyBrains(team);
          return brains.length > 0 ? brains[0] : null;
        }

        getGameManager() {
          if (this.gameManager) return this.gameManager;
          const scene = director.getScene();
          if (!scene) return null;
          const managers = scene.getComponentsInChildren(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager);
          return managers.length > 0 ? managers[0] : null;
        }

        getTargetBattleArmyBrains(team) {
          const result = [];

          for (let i = 0; i < this.battleArmyBrains.length; i++) {
            const brain = this.battleArmyBrains[i];
            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;
            result.push(brain);
          }

          if (result.length > 0) return result;
          const scene = director.getScene();
          if (!scene) return result;
          const brains = scene.getComponentsInChildren(_crd && BattleArmyBrain === void 0 ? (_reportPossibleCrUseOfBattleArmyBrain({
            error: Error()
          }), BattleArmyBrain) : BattleArmyBrain);

          for (let i = 0; i < brains.length; i++) {
            const brain = brains[i];
            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;
            result.push(brain);
          }

          return result;
        }

        findEntryForRule(entries, rule) {
          for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
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
          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
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
          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];

            if (rule && this.getRuleKey(rule) === key) {
              return rule;
            }
          }

          return null;
        }

        getRuleKey(rule) {
          return `${rule.family}:${Math.max(1, Math.floor(rule.tier))}`;
        }

        getSavedUnit(state, key) {
          for (let i = 0; i < state.units.length; i++) {
            if (state.units[i].key === key) {
              return state.units[i];
            }
          }

          return null;
        }

        getRuleUnlockLevel(rule) {
          const endLevel = this.getProgressionEndLevel();
          const progress = this.getRuleUnlockProgression(rule);
          const rawLevel = Math.max(1, Math.floor(1 + progress * (endLevel - 1)));
          const bossPace = Math.max(0, Math.floor(this.bossStagePace));

          if (rawLevel <= 1 || bossPace <= 0) {
            return rawLevel;
          }

          return Math.min(endLevel, Math.ceil(rawLevel / bossPace) * bossPace);
        }

        migrateLegacyUnitUnlockProgression() {
          const referenceEndLevel = Math.max(1, Math.floor(this.progressionEndLevel));

          for (let i = 0; i < this.unitProgressionRules.length; i++) {
            const rule = this.unitProgressionRules[i];
            if (!rule) continue;
            if (rule.unlockProgression > 0) continue;
            if (rule.unlockLevel <= 1) continue;
            rule.unlockProgression = this.clamp01(rule.unlockLevel / referenceEndLevel);
          }
        }

        getRuleUnlockProgression(rule) {
          const configured = Number.isFinite(rule.unlockProgression) ? rule.unlockProgression : 0;

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
          const schedule = this.progressionState ? this.progressionState.cpPackages : this.createCPPackageSchedule();
          return this.getPlayerCPStart() + schedule.filter(item => item.offerLevel <= this.clampLevel(level)).reduce((sum, item) => sum + item.delta, 0);
        }

        getPlayerCPPackagesOffered(level) {
          const schedule = this.progressionState ? this.progressionState.cpPackages : this.createCPPackageSchedule();
          const safeLevel = this.clampLevel(level);
          return schedule.filter(item => item.offerLevel <= safeLevel).length;
        }

        getNextAvailableCPPackage(state, level) {
          const safeLevel = this.clampLevel(level);
          return state.cpPackages.filter(item => !item.claimed && item.offerLevel <= safeLevel).sort((a, b) => a.offerLevel - b.offerLevel || a.targetLevel - b.targetLevel || a.id.localeCompare(b.id))[0] || null;
        }

        getPlayerCPFromState(state) {
          return this.getPlayerCPStart() + Math.max(0, state.playerInitialCPOverflow) + state.cpPackages.filter(item => item.claimed).reduce((sum, item) => sum + item.delta, 0);
        }

        createCPPackageSchedule() {
          const result = [];
          const milestones = this.getProgressionMilestoneLevels();
          let previousLevel = 0;
          let previousCap = this.getPlayerCPStart();

          for (let i = 0; i < milestones.length; i++) {
            const targetLevel = milestones[i];
            const targetCap = Math.max(previousCap, this.getLevelBaseInitialCP(targetLevel));
            const totalDelta = targetCap - previousCap;

            if (totalDelta <= 0) {
              previousLevel = targetLevel;
              previousCap = targetCap;
              continue;
            }

            const firstOfferLevel = previousLevel > 0 ? previousLevel + 1 : 2;
            const lastNormalLevel = targetLevel - 1;
            const candidateCount = Math.max(1, lastNormalLevel >= firstOfferLevel ? lastNormalLevel - firstOfferLevel + 1 : 1);
            const packageCount = Math.min(totalDelta, Math.max(1, Math.ceil(candidateCount / 2)));
            const offerLevels = this.pickEvenlyDistributedOfferLevels(firstOfferLevel, lastNormalLevel >= firstOfferLevel ? lastNormalLevel : targetLevel, packageCount);
            let distributed = 0;

            for (let packageIndex = 0; packageIndex < packageCount; packageIndex++) {
              const cumulative = Math.round(totalDelta * (packageIndex + 1) / packageCount);
              const delta = cumulative - distributed;
              distributed = cumulative;
              result.push({
                id: `cp:${targetLevel}:${packageIndex + 1}`,
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
          const endLevel = this.getProgressionEndLevel();
          const pace = Math.max(0, Math.floor(this.bossStagePace));
          const result = [];

          if (pace > 0) {
            for (let level = pace; level <= endLevel; level += pace) {
              result.push(level);
            }
          }

          if (result.length <= 0 || result[result.length - 1] !== endLevel) {
            result.push(endLevel);
          }

          return result;
        }

        pickEvenlyDistributedOfferLevels(firstLevel, lastLevel, count) {
          const candidateCount = Math.max(1, lastLevel - firstLevel + 1);
          const safeCount = Math.min(Math.max(1, Math.floor(count)), candidateCount);
          const result = [];

          for (let index = 0; index < safeCount; index++) {
            result.push(firstLevel + Math.floor(index * candidateCount / safeCount));
          }

          return result;
        }

        getNextPlayerCPPackageSnapshot(state, level) {
          const item = this.getNextAvailableCPPackage(state, level);
          return item ? { ...item
          } : null;
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
          const schedule = this.progressionState ? this.progressionState.maxAlivePackages : this.createMaxAlivePackageSchedule();
          const safeLevel = this.clampLevel(level);
          const offeredDelta = schedule.filter(item => item.offerLevel <= safeLevel).reduce((sum, item) => sum + item.delta, 0);
          return this.clampPlayerMaxAlive(this.getPlayerMaxAliveStart() + offeredDelta);
        }

        getPlayerMaxAlivePackagesOffered(level) {
          const schedule = this.progressionState ? this.progressionState.maxAlivePackages : this.createMaxAlivePackageSchedule();
          const safeLevel = this.clampLevel(level);
          return schedule.filter(item => item.offerLevel <= safeLevel).length;
        }

        getNextAvailableMaxAlivePackage(state, level) {
          const safeLevel = this.clampLevel(level);
          return state.maxAlivePackages.filter(item => !item.claimed && item.offerLevel <= safeLevel).sort((a, b) => a.offerLevel - b.offerLevel || a.targetLevel - b.targetLevel || a.id.localeCompare(b.id))[0] || null;
        }

        getPlayerMaxAliveFromState(state) {
          const claimedDelta = state.maxAlivePackages.filter(item => item.claimed).reduce((sum, item) => sum + item.delta, 0);
          return this.clampPlayerMaxAlive(this.getPlayerMaxAliveStart() + claimedDelta);
        }

        createMaxAlivePackageSchedule() {
          const result = [];

          if (!this.allowMaxWave) {
            const delta = Math.max(0, this.getPlayerMaxAliveMax() - this.getPlayerMaxAliveStart());

            for (let i = 0; i < delta; i++) {
              result.push({
                id: `max-alive:1:${i + 1}`,
                targetLevel: 1,
                offerLevel: 1,
                delta: 1,
                claimed: false,
                claimSource: ''
              });
            }

            return result;
          }

          const milestones = this.getProgressionMilestoneLevels();
          let previousLevel = 0;
          let previousCap = this.getPlayerMaxAliveStart();

          for (let i = 0; i < milestones.length; i++) {
            const targetLevel = milestones[i];
            const targetCap = this.clampPlayerMaxAlive(Math.max(previousCap, this.getLevelBaseMaxAlive(targetLevel)));
            const totalDelta = targetCap - previousCap;

            if (totalDelta <= 0) {
              previousLevel = targetLevel;
              previousCap = targetCap;
              continue;
            }

            const firstOfferLevel = previousLevel > 0 ? previousLevel + 1 : 2;
            const lastNormalLevel = targetLevel - 1;
            const safeLastOfferLevel = lastNormalLevel >= firstOfferLevel ? lastNormalLevel : targetLevel;
            const offerLevels = this.pickEvenlyDistributedOfferLevels(firstOfferLevel, safeLastOfferLevel, totalDelta);

            for (let packageIndex = 0; packageIndex < totalDelta; packageIndex++) {
              result.push({
                id: `max-alive:${targetLevel}:` + `${packageIndex + 1}`,
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
          const item = this.getNextAvailableMaxAlivePackage(state, level);
          return item ? { ...item
          } : null;
        }

        clampPlayerMaxAlive(value) {
          return Math.max(this.getPlayerMaxAliveStart(), Math.min(this.getPlayerMaxAliveMax(), value));
        }

        loadProgressionState() {
          const raw = sys.localStorage.getItem(this.progressionStorageKey);
          if (!raw) return null;

          try {
            return JSON.parse(raw);
          } catch {
            return null;
          }
        }

        clearProgressionStorage() {
          const keys = [this.progressionStorageKey, 'battle-progression-v1', 'battle-progression-v2', 'battle-progression-v3', 'battle-progression-v4', 'battle-progression-v5', 'battle-progression-v6', 'battle-progression-v7', 'battle-progression-v8'];

          for (let i = 0; i < keys.length; i++) {
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
          const params = new URLSearchParams(window.location.search);
          const progressionParam = this.getQueryInt(params, ['progression'], -1);

          if (progressionParam === 0) {
            this.enableProgression = false;
          } else if (progressionParam === 1) {
            this.enableProgression = true;
          }

          const totalLevels = this.getQueryInt(params, ['TotalLevels', 'totalLevels'], 0);
          const queriedLevel = this.getQueryInt(params, ['currentLevel'], this.currentLevel);
          const queriedProgressionEnd = this.getQueryInt(params, ['ProgressionEndLevel', 'progressionEndLevel'], 0);
          const progressionResume = this.getQueryInt(params, ['progressionResume'], 0);
          this.sideMissionBattle = this.getQueryInt(params, ['sideMission'], 0) === 1;
          const forceProgressionReset = this.getQueryInt(params, ['resetProgression', 'reset'], 0) === 1;
          const hasQueriedLevel = params.has('currentLevel') || params.has('?currentLevel');
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
          for (let i = 0; i < keys.length; i++) {
            var _params$get;

            const value = (_params$get = params.get(keys[i])) != null ? _params$get : params.get(`?${keys[i]}`);
            if (value === null) continue;
            const parsed = Number(value);

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
          const endLevel = this.getProgressionEndLevel();
          const safeLevel = this.clampLevel(level);
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
          const safeLevel = this.clampLevel(level);
          return Math.round(Math.min(Math.max(0, this.maxAliveWavesMax), this.getLevelBaseMaxAlive(safeLevel) * this.getBossMultiplier(this.bossMaxAliveWavesMultiplier, this.isBossLevelFor(safeLevel))));
        }

        getLevelInitialCP(level) {
          const safeLevel = this.clampLevel(level);
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
          const pace = Math.max(0, Math.floor(this.bossStagePace));
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
          const parsed = Number(value);
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
        initializer: function () {
          return 300;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "progressionEndLevel", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 50;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "currentLevel", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "bossStagePace", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "bossInitialCombatPointMultiplier", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.1;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "bossDecisionAccuracyMultiplier", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.1;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "bossMaxAliveWavesMultiplier", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.1;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "targetTeam", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "gameManager", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "battleArmyBrains", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "allowCP", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "initialCombatPointMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 600;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "initialCombatPointMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1040;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "allowDecisionAccuracy", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "decisionAccuracyMin", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.4;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "decisionAccuracyMax", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "allowInterval", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "minSpawnIntervalMinLevel", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5.0;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "maxSpawnIntervalMinLevel", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6.0;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "minSpawnIntervalMaxLevel", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2.7;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class5.prototype, "maxSpawnIntervalMaxLevel", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3.7;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class5.prototype, "allowMaxWave", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveWavesMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveWavesMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 15;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class5.prototype, "enableProgression", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class5.prototype, "autoReloadProgression", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class5.prototype, "purchasingSimulation", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class5.prototype, "allowAdsRescue", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class5.prototype, "allowBotGoldX2Ads", [_dec33], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class5.prototype, "progressionStorageKey", [_dec34], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'battle-progression-v8';
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class5.prototype, "battleCardDeckSize", [_dec35], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor38 = _applyDecoratedDescriptor(_class5.prototype, "enemyCardDiversityScoreFloor", [_dec36], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor39 = _applyDecoratedDescriptor(_class5.prototype, "botStrengthUpgradePurchaseWeight", [_dec37], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.75;
        }
      }), _descriptor40 = _applyDecoratedDescriptor(_class5.prototype, "maxPlayerPackagesPerLevel", [_dec38], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 3;
        }
      }), _descriptor41 = _applyDecoratedDescriptor(_class5.prototype, "initialPlayerGold", [_dec39], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor42 = _applyDecoratedDescriptor(_class5.prototype, "playerInitialCPStart", [_dec40], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 300;
        }
      }), _descriptor43 = _applyDecoratedDescriptor(_class5.prototype, "playerMaxAliveStart", [_dec41], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor44 = _applyDecoratedDescriptor(_class5.prototype, "playerMaxAliveMax", [_dec42], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor45 = _applyDecoratedDescriptor(_class5.prototype, "mainlineNoLossGoldReserve", [_dec43], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor46 = _applyDecoratedDescriptor(_class5.prototype, "bossGoldRewardMultiplier", [_dec44], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.15;
        }
      }), _descriptor47 = _applyDecoratedDescriptor(_class5.prototype, "sideRewardFeeMultiplier", [_dec45], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.65;
        }
      }), _descriptor48 = _applyDecoratedDescriptor(_class5.prototype, "sideRecoveryAccuracyMultiplier", [_dec46], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.75;
        }
      }), _descriptor49 = _applyDecoratedDescriptor(_class5.prototype, "mainBattleEntryFeeRatio", [_dec47], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.35;
        }
      }), _descriptor50 = _applyDecoratedDescriptor(_class5.prototype, "mainLossRewardFeeRatio", [_dec48], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor51 = _applyDecoratedDescriptor(_class5.prototype, "unitUnlockCostMultiplier", [_dec49], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor52 = _applyDecoratedDescriptor(_class5.prototype, "initialCPGoldPerPoint", [_dec50], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor53 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveBasePrice", [_dec51], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1000;
        }
      }), _descriptor54 = _applyDecoratedDescriptor(_class5.prototype, "unitProgressionRules", [_dec52], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
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
//# sourceMappingURL=8f897615a444c3f9822d8a3a627e35c696ea7282.js.map