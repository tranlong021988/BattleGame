System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, BattleCardModifier, BattleCardOpponentCondition, BattleCardTarget, UnitFamily, BattleCardRuntime, _crd, MAX_BUDGET_UPGRADE_LEVEL;

  function _reportPossibleCrUseOfBattleCardDatabase(extras) {
    _reporterNs.report("BattleCardDatabase", "./BattleCardDatabase", _context.meta, extras);
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

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
  }

  _export("BattleCardRuntime", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      BattleCardModifier = _unresolved_2.BattleCardModifier;
      BattleCardOpponentCondition = _unresolved_2.BattleCardOpponentCondition;
      BattleCardTarget = _unresolved_2.BattleCardTarget;
    }, function (_unresolved_3) {
      UnitFamily = _unresolved_3.UnitFamily;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "11692rwHz1G8KGqnIg30gq5", "BattleCardRuntime", undefined);

      MAX_BUDGET_UPGRADE_LEVEL = 2;

      _export("BattleCardRuntime", BattleCardRuntime = class BattleCardRuntime {
        constructor(database, onTelemetryEvent) {
          this.database = null;
          this.cardsByTeam = [[], []];
          this.modifiersByTeamFamily = new Map();
          this.started = false;
          this.elapsedTime = 0;
          this.onTelemetryEvent = null;
          this.database = database;
          this.onTelemetryEvent = onTelemetryEvent || null;
        }

        setDecks(playerCardIds, enemyCardIds, playerBudgetUpgradeLevels = {}, maxPlayerCards = 3, maxEnemyCards = maxPlayerCards) {
          const shouldBeginImmediately = this.started;
          const playerDeckSize = Math.max(1, Math.floor(maxPlayerCards));
          const enemyDeckSize = Math.max(0, Math.floor(maxEnemyCards));
          this.cardsByTeam[0] = this.createDeck(playerCardIds, playerBudgetUpgradeLevels, playerDeckSize);
          this.cardsByTeam[1] = this.createDeck(enemyCardIds, {}, enemyDeckSize);
          this.modifiersByTeamFamily.clear();
          this.started = false;
          this.elapsedTime = 0;

          if (shouldBeginImmediately) {
            this.beginBattle();
          }
        }

        beginBattle() {
          if (this.started) return;
          this.started = true;
          this.elapsedTime = 0;

          for (let team = 0; team <= 1; team++) {
            const cards = this.cardsByTeam[team];

            for (let i = 0; i < cards.length; i++) {
              const card = cards[i];
              card.active = card.budgetRemaining > 0;

              if (card.active) {
                this.emitEvent('card-activated', team, card);
              }
            }
          }
        }

        update(deltaTime, _currentCombatPoint, _initialCombatPoint) {
          if (!this.started) return;
          this.elapsedTime += Math.max(0, Number.isFinite(deltaTime) ? deltaTime : 0);
        }

        getModifiers(team, family, opposingFamily) {
          const safeTeam = this.clampTeam(team);
          const cacheKey = `${safeTeam}:${family}:${opposingFamily === undefined ? '*' : opposingFamily}`;
          const cached = this.modifiersByTeamFamily.get(cacheKey);
          if (cached) return cached;
          const result = {
            damageMultiplier: 1,
            defenseFlat: 0,
            attackRangeMultiplier: 1,
            damageRadiusMultiplier: 1,
            counterImmune: false
          };
          const cards = this.cardsByTeam[safeTeam];

          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (!card.active) continue;

            if (!this.matchesTarget(card.definition, family)) {
              continue;
            }

            if (!this.matchesOpponent(card.definition, opposingFamily)) continue;
            this.applyModifier(result, card.definition.modifier, card.definition.modifierValue);
            this.applyModifier(result, card.definition.tradeoffModifier, card.definition.tradeoffValue);
          }

          result.damageMultiplier = Math.max(0, result.damageMultiplier);
          result.attackRangeMultiplier = Math.max(0, result.attackRangeMultiplier);
          result.damageRadiusMultiplier = Math.max(0, result.damageRadiusMultiplier);
          this.modifiersByTeamFamily.set(cacheKey, result);
          return result;
        }

        consumeModifier(team, family, modifier, opposingFamily) {
          const cards = this.cardsByTeam[this.clampTeam(team)];
          let consumed = false;

          for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            if (!card.active) continue;
            if (card.definition.modifier !== modifier) continue;

            if (!this.matchesTarget(card.definition, family)) {
              continue;
            }

            if (!this.matchesOpponent(card.definition, opposingFamily)) continue;
            card.budgetRemaining = Math.max(0, card.budgetRemaining - 1);
            consumed = true;

            if (card.budgetRemaining <= 0) {
              card.active = false;
              this.emitEvent('card-depleted', team, card);
            }
          }

          if (consumed) {
            this.modifiersByTeamFamily.clear();
          }

          return consumed;
        }

        getUsedCardIds(team) {
          return this.cardsByTeam[this.clampTeam(team)].filter(card => card.initialBudget > card.budgetRemaining).map(card => card.definition.id);
        }

        createTelemetrySnapshot() {
          return [0, 1].map(team => ({
            team,
            deck: this.cardsByTeam[team].map(card => ({
              id: card.definition.id,
              displayName: card.definition.displayName,
              baseBudget: card.definition.baseBudget,
              initialBudget: card.initialBudget,
              budgetRemaining: card.budgetRemaining,
              budgetUsed: card.initialBudget - card.budgetRemaining,
              active: card.active
            }))
          }));
        }

        createDeck(cardIds, budgetUpgradeLevels = {}, maxCards = 3) {
          if (!this.database || !Array.isArray(cardIds) || maxCards <= 0) {
            return [];
          }

          const result = [];
          const ids = new Set();

          for (let i = 0; i < cardIds.length; i++) {
            const id = cardIds[i];
            if (!id || ids.has(id)) continue;
            if (result.length >= maxCards) break;
            const definition = this.database.getCard(id);
            if (!definition) continue;
            ids.add(id);
            const upgradeLevel = Math.max(0, Math.min(MAX_BUDGET_UPGRADE_LEVEL, Math.floor(budgetUpgradeLevels[id] || 0)));
            const initialBudget = Math.max(1, Math.round(Math.max(1, definition.baseBudget) * (1 + upgradeLevel * 0.4)));
            result.push({
              definition,
              active: false,
              initialBudget,
              budgetRemaining: initialBudget
            });
          }

          return result;
        }

        matchesTarget(definition, family) {
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

        matchesOpponent(definition, opposingFamily) {
          if (definition.requiredEnemyFamily === (_crd && BattleCardOpponentCondition === void 0 ? (_reportPossibleCrUseOfBattleCardOpponentCondition({
            error: Error()
          }), BattleCardOpponentCondition) : BattleCardOpponentCondition).Any) {
            return true;
          }

          return opposingFamily === definition.requiredEnemyFamily - 1;
        }

        applyModifier(result, modifier, value) {
          const safeValue = Number.isFinite(value) ? value : 0;

          switch (modifier) {
            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).DamagePercent:
              result.damageMultiplier += safeValue / 100;
              break;

            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).DefenseFlat:
              result.defenseFlat += safeValue;
              break;

            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).AttackRangePercent:
              result.attackRangeMultiplier += safeValue / 100;
              break;

            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).DamageRadiusPercent:
              result.damageRadiusMultiplier += safeValue / 100;
              break;

            case (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).CounterImmunity:
              result.counterImmune = true;
              break;
          }
        }

        emitEvent(type, team, card) {
          if (!this.onTelemetryEvent) return;
          this.onTelemetryEvent({
            type,
            team: this.clampTeam(team),
            id: card.definition.id,
            displayName: card.definition.displayName,
            budgetRemaining: card.budgetRemaining,
            budgetUsed: card.initialBudget - card.budgetRemaining,
            time: this.elapsedTime
          });
        }

        clampTeam(team) {
          return team === 1 ? 1 : 0;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3ec9c1efaa53ae0a46aa6b2262ac9c09b328dbdc.js.map