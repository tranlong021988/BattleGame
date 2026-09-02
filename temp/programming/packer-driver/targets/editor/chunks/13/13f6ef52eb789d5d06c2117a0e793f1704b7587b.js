System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Enum, SpriteFrame, UnitFamily, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _dec18, _dec19, _class4, _class5, _descriptor19, _crd, ccclass, property, BattleCardTarget, BattleCardModifier, BattleCardEnemyPool, BattleCardOpponentCondition, BattleCardDefinition, BattleCardDatabase;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function createCard(id, displayName, purchasePrice, baseCooldownBattles, baseBudget, target, targetFamily, modifier, modifierValue, tradeoffModifier = BattleCardModifier.None, tradeoffValue = 0, requiredEnemyFamily = BattleCardOpponentCondition.Any, enemyPool = BattleCardEnemyPool.RegularAndBoss, baseStrengthScale = 1, strengthUpgradeMaxRank = 0) {
    const card = new BattleCardDefinition();
    card.id = id;
    card.displayName = displayName;
    card.purchasePrice = purchasePrice;
    card.baseCooldownBattles = baseCooldownBattles;
    card.baseBudget = baseBudget;
    card.target = target;
    card.targetFamily = targetFamily;
    card.requiredEnemyFamily = requiredEnemyFamily;
    card.modifier = modifier;
    card.modifierValue = modifierValue;
    card.tradeoffModifier = tradeoffModifier;
    card.tradeoffValue = tradeoffValue;
    card.enemyPool = enemyPool;
    card.baseStrengthScale = baseStrengthScale;
    card.strengthUpgradeMaxRank = strengthUpgradeMaxRank;
    return card;
  }

  function createDefaultCards() {
    return [createCard('general-offensive', 'General Offensive', 850, 5, 50, BattleCardTarget.AllUnits, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
      error: Error()
    }), UnitFamily) : UnitFamily).Spear, BattleCardModifier.DamagePercent, 5), createCard('battle-shields', 'Battle Shields', 700, 4, 90, BattleCardTarget.Frontline, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
      error: Error()
    }), UnitFamily) : UnitFamily).Spear, BattleCardModifier.DefenseFlat, 1), createCard('anti-cavalry-spearhead', 'Spear Discipline', 650, 4, 12, BattleCardTarget.UnitFamily, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
      error: Error()
    }), UnitFamily) : UnitFamily).Spear, BattleCardModifier.DamagePercent, 42, BattleCardModifier.DefenseFlat, 3, BattleCardOpponentCondition.Cavalry, BattleCardEnemyPool.RegularAndBoss, 0.4, 2), createCard('axe-frenzy', 'Axe Vanguard', 650, 4, 20, BattleCardTarget.UnitFamily, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
      error: Error()
    }), UnitFamily) : UnitFamily).Axeman, BattleCardModifier.DamagePercent, 45, BattleCardModifier.DefenseFlat, 4.5, BattleCardOpponentCondition.Any, BattleCardEnemyPool.RegularAndBoss, 0.4, 2), createCard('sword-wall', 'Sword Breakthrough', 800, 5, 60, BattleCardTarget.UnitFamily, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
      error: Error()
    }), UnitFamily) : UnitFamily).Sword, BattleCardModifier.DamagePercent, 100, BattleCardModifier.DefenseFlat, 3.5, BattleCardOpponentCondition.Any, BattleCardEnemyPool.RegularAndBoss, 0.4, 2), createCard('arrow-suppression', 'Arrow Suppression', 650, 4, 30, BattleCardTarget.UnitFamily, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
      error: Error()
    }), UnitFamily) : UnitFamily).Archer, BattleCardModifier.DamagePercent, 12, BattleCardModifier.AttackRangePercent, -8), createCard('precise-range', 'Precise Range', 1100, 5, 18, BattleCardTarget.Ranged, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
      error: Error()
    }), UnitFamily) : UnitFamily).Archer, BattleCardModifier.AttackRangePercent, 8, BattleCardModifier.MoveSpeedPercent, 8), createCard('wide-prayer', 'Wide Prayer', 1200, 5, 5, BattleCardTarget.UnitFamily, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
      error: Error()
    }), UnitFamily) : UnitFamily).Monk, BattleCardModifier.DamageRadiusPercent, 30, BattleCardModifier.DamagePercent, -12), createCard('cavalry-charge', 'Cavalry Charge', 2000, 6, 18, BattleCardTarget.UnitFamily, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
      error: Error()
    }), UnitFamily) : UnitFamily).Cavalry, BattleCardModifier.DamagePercent, 300, BattleCardModifier.None, 0, BattleCardOpponentCondition.Any, BattleCardEnemyPool.RegularAndBoss, 0.4, 2), createCard('counter-breaker', 'Counter Breaker', 1600, 6, 3, BattleCardTarget.AllUnits, (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
      error: Error()
    }), UnitFamily) : UnitFamily).Spear, BattleCardModifier.CounterImmunity, 0, BattleCardModifier.None, 0, BattleCardOpponentCondition.Any, BattleCardEnemyPool.BossOnly)];
  }

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
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
      SpriteFrame = _cc.SpriteFrame;
    }, function (_unresolved_2) {
      UnitFamily = _unresolved_2.UnitFamily;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3e68d0eAXVG2qsDFla39SBn", "BattleCardDatabase", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Enum', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BattleCardTarget", BattleCardTarget = /*#__PURE__*/function (BattleCardTarget) {
        BattleCardTarget[BattleCardTarget["AllUnits"] = 0] = "AllUnits";
        BattleCardTarget[BattleCardTarget["UnitFamily"] = 1] = "UnitFamily";
        BattleCardTarget[BattleCardTarget["Frontline"] = 2] = "Frontline";
        BattleCardTarget[BattleCardTarget["Ranged"] = 3] = "Ranged";
        return BattleCardTarget;
      }({}));

      _export("BattleCardModifier", BattleCardModifier = /*#__PURE__*/function (BattleCardModifier) {
        BattleCardModifier[BattleCardModifier["None"] = 0] = "None";
        BattleCardModifier[BattleCardModifier["DamagePercent"] = 1] = "DamagePercent";
        BattleCardModifier[BattleCardModifier["DefenseFlat"] = 2] = "DefenseFlat";
        BattleCardModifier[BattleCardModifier["AttackRangePercent"] = 3] = "AttackRangePercent";
        BattleCardModifier[BattleCardModifier["DamageRadiusPercent"] = 4] = "DamageRadiusPercent";
        BattleCardModifier[BattleCardModifier["CounterImmunity"] = 5] = "CounterImmunity";
        BattleCardModifier[BattleCardModifier["MoveSpeedPercent"] = 6] = "MoveSpeedPercent";
        return BattleCardModifier;
      }({}));

      _export("BattleCardEnemyPool", BattleCardEnemyPool = /*#__PURE__*/function (BattleCardEnemyPool) {
        BattleCardEnemyPool[BattleCardEnemyPool["None"] = 0] = "None";
        BattleCardEnemyPool[BattleCardEnemyPool["RegularAndBoss"] = 1] = "RegularAndBoss";
        BattleCardEnemyPool[BattleCardEnemyPool["BossOnly"] = 2] = "BossOnly";
        return BattleCardEnemyPool;
      }({}));

      _export("BattleCardOpponentCondition", BattleCardOpponentCondition = /*#__PURE__*/function (BattleCardOpponentCondition) {
        BattleCardOpponentCondition[BattleCardOpponentCondition["Any"] = 0] = "Any";
        BattleCardOpponentCondition[BattleCardOpponentCondition["Spear"] = 1] = "Spear";
        BattleCardOpponentCondition[BattleCardOpponentCondition["Sword"] = 2] = "Sword";
        BattleCardOpponentCondition[BattleCardOpponentCondition["Archer"] = 3] = "Archer";
        BattleCardOpponentCondition[BattleCardOpponentCondition["Cavalry"] = 5] = "Cavalry";
        BattleCardOpponentCondition[BattleCardOpponentCondition["Axeman"] = 6] = "Axeman";
        BattleCardOpponentCondition[BattleCardOpponentCondition["Monk"] = 7] = "Monk";
        return BattleCardOpponentCondition;
      }({}));

      Enum(BattleCardTarget);
      Enum(BattleCardModifier);
      Enum(BattleCardEnemyPool);
      Enum(BattleCardOpponentCondition);

      _export("BattleCardDefinition", BattleCardDefinition = (_dec = ccclass('BattleCardDefinition'), _dec2 = property(SpriteFrame), _dec3 = property({
        min: 1,
        step: 1
      }), _dec4 = property({
        min: 1,
        step: 1
      }), _dec5 = property({
        min: 1,
        step: 1,
        tooltip: 'Combat-event charges available at battle start. The card deactivates immediately at zero.'
      }), _dec6 = property({
        type: BattleCardTarget
      }), _dec7 = property({
        type: _crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
          error: Error()
        }), UnitFamily) : UnitFamily
      }), _dec8 = property({
        type: BattleCardOpponentCondition
      }), _dec9 = property({
        type: BattleCardModifier
      }), _dec10 = property({
        tooltip: 'Percent for Damage/Move Speed/Range/Radius; flat amount for Defense. Counter Immunity ignores this value.'
      }), _dec11 = property({
        type: BattleCardModifier
      }), _dec12 = property({
        tooltip: 'Use a negative value for a stat penalty. Counter Immunity is not valid as a tradeoff.'
      }), _dec13 = property({
        type: BattleCardEnemyPool
      }), _dec14 = property({
        min: 0,
        max: 1,
        step: 0.05,
        tooltip: 'Share of this card\'s full modifier before Strength upgrades. Keep at 1 to disable Strength progression for this card.'
      }), _dec15 = property({
        min: 0,
        step: 1,
        tooltip: 'Number of Strength ranks for this card. Rank zero disables the Strength upgrade package.'
      }), _dec16 = property({
        min: 0.01,
        step: 0.05,
        tooltip: 'Strength rank-one price as a share of this card\'s unlock price.'
      }), _dec17 = property({
        min: 0.01,
        step: 0.05,
        tooltip: 'Final Strength-rank price as a share of this card\'s unlock price. Intermediate ranks interpolate.'
      }), _dec(_class = (_class2 = class BattleCardDefinition {
        constructor() {
          _initializerDefineProperty(this, "id", _descriptor, this);

          _initializerDefineProperty(this, "displayName", _descriptor2, this);

          _initializerDefineProperty(this, "icon", _descriptor3, this);

          _initializerDefineProperty(this, "purchasePrice", _descriptor4, this);

          _initializerDefineProperty(this, "baseCooldownBattles", _descriptor5, this);

          _initializerDefineProperty(this, "baseBudget", _descriptor6, this);

          _initializerDefineProperty(this, "target", _descriptor7, this);

          _initializerDefineProperty(this, "targetFamily", _descriptor8, this);

          _initializerDefineProperty(this, "requiredEnemyFamily", _descriptor9, this);

          _initializerDefineProperty(this, "modifier", _descriptor10, this);

          _initializerDefineProperty(this, "modifierValue", _descriptor11, this);

          _initializerDefineProperty(this, "tradeoffModifier", _descriptor12, this);

          _initializerDefineProperty(this, "tradeoffValue", _descriptor13, this);

          _initializerDefineProperty(this, "enemyPool", _descriptor14, this);

          _initializerDefineProperty(this, "baseStrengthScale", _descriptor15, this);

          _initializerDefineProperty(this, "strengthUpgradeMaxRank", _descriptor16, this);

          _initializerDefineProperty(this, "strengthUpgradeFirstCostMultiplier", _descriptor17, this);

          _initializerDefineProperty(this, "strengthUpgradeFinalCostMultiplier", _descriptor18, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "displayName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "purchasePrice", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 500;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "baseCooldownBattles", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "baseBudget", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 10;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return BattleCardTarget.AllUnits;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "targetFamily", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitFamily === void 0 ? (_reportPossibleCrUseOfUnitFamily({
            error: Error()
          }), UnitFamily) : UnitFamily).Spear;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "requiredEnemyFamily", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return BattleCardOpponentCondition.Any;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "modifier", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return BattleCardModifier.DamagePercent;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "modifierValue", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "tradeoffModifier", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return BattleCardModifier.None;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "tradeoffValue", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "enemyPool", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return BattleCardEnemyPool.RegularAndBoss;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "baseStrengthScale", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "strengthUpgradeMaxRank", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "strengthUpgradeFirstCostMultiplier", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.65;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "strengthUpgradeFinalCostMultiplier", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.9;
        }
      })), _class2)) || _class));

      _export("BattleCardDatabase", BattleCardDatabase = (_dec18 = ccclass('BattleCardDatabase'), _dec19 = property({
        type: [BattleCardDefinition]
      }), _dec18(_class4 = (_class5 = class BattleCardDatabase extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "cards", _descriptor19, this);
        }

        getCard(id) {
          for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];

            if (card && card.id === id) {
              return card;
            }
          }

          return null;
        }

        getEnemyCards(isBoss) {
          return this.cards.filter(card => {
            if (!card || !card.id) return false;

            if (card.enemyPool === BattleCardEnemyPool.None) {
              return false;
            }

            return isBoss || card.enemyPool === BattleCardEnemyPool.RegularAndBoss;
          });
        }

      }, (_descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "cards", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return createDefaultCards();
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=13f6ef52eb789d5d06c2117a0e793f1704b7587b.js.map