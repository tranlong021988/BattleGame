System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, BattleCardModifier, BattleCardTarget, BattleCardTrigger, UnitFamily, BattleCardRuntime, _crd, MAX_CARDS_PER_DECK;

  function _reportPossibleCrUseOfBattleCardDatabase(extras) {
    _reporterNs.report("BattleCardDatabase", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardDefinition(extras) {
    _reporterNs.report("BattleCardDefinition", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardModifier(extras) {
    _reporterNs.report("BattleCardModifier", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardTarget(extras) {
    _reporterNs.report("BattleCardTarget", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardTrigger(extras) {
    _reporterNs.report("BattleCardTrigger", "./BattleCardDatabase", _context.meta, extras);
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
      BattleCardTarget = _unresolved_2.BattleCardTarget;
      BattleCardTrigger = _unresolved_2.BattleCardTrigger;
    }, function (_unresolved_3) {
      UnitFamily = _unresolved_3.UnitFamily;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "11692rwHz1G8KGqnIg30gq5", "BattleCardRuntime", undefined);

      MAX_CARDS_PER_DECK = 3;

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

        setDecks(playerCardIds, enemyCardIds) {
          this.cardsByTeam[0] = this.createDeck(playerCardIds);
          this.cardsByTeam[1] = this.createDeck(enemyCardIds);
          this.modifiersByTeamFamily.clear();
          this.started = false;
          this.elapsedTime = 0;
        }

        beginBattle() {
          if (this.started) return;
          this.started = true;
          this.elapsedTime = 0;

          for (var team = 0; team <= 1; team++) {
            var cards = this.cardsByTeam[team];

            for (var i = 0; i < cards.length; i++) {
              var card = cards[i];

              if (card.definition.trigger === (_crd && BattleCardTrigger === void 0 ? (_reportPossibleCrUseOfBattleCardTrigger({
                error: Error()
              }), BattleCardTrigger) : BattleCardTrigger).BattleStart) {
                this.activateCard(team, card);
              }
            }
          }
        }

        update(deltaTime, currentCombatPoint, initialCombatPoint) {
          if (!this.started) return;
          var safeDelta = Math.max(0, Number.isFinite(deltaTime) ? deltaTime : 0);
          this.elapsedTime += safeDelta;

          for (var team = 0; team <= 1; team++) {
            var cards = this.cardsByTeam[team];

            for (var i = 0; i < cards.length; i++) {
              var card = cards[i];

              if (!card.activated && this.shouldActivate(card, team, currentCombatPoint, initialCombatPoint)) {
                this.activateCard(team, card);
              }

              if (!card.active || card.definition.durationSeconds <= 0) {
                continue;
              }

              card.remainingSeconds -= safeDelta;

              if (card.remainingSeconds <= 0) {
                card.remainingSeconds = 0;
                card.active = false;
                this.modifiersByTeamFamily.clear();
                this.emitEvent('card-expired', team, card);
              }
            }
          }
        }

        getModifiers(team, family) {
          var safeTeam = this.clampTeam(team);
          var cacheKey = safeTeam + ":" + family;
          var cached = this.modifiersByTeamFamily.get(cacheKey);
          if (cached) return cached;
          var result = {
            damageMultiplier: 1,
            defenseFlat: 0,
            attackRangeMultiplier: 1,
            damageRadiusMultiplier: 1,
            counterImmune: false
          };
          var cards = this.cardsByTeam[safeTeam];

          for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (!card.active) continue;

            if (!this.matchesTarget(card.definition, family)) {
              continue;
            }

            this.applyModifier(result, card.definition.modifier, card.definition.modifierValue);
            this.applyModifier(result, card.definition.tradeoffModifier, card.definition.tradeoffValue);
          }

          result.damageMultiplier = Math.max(0, result.damageMultiplier);
          result.attackRangeMultiplier = Math.max(0, result.attackRangeMultiplier);
          result.damageRadiusMultiplier = Math.max(0, result.damageRadiusMultiplier);
          this.modifiersByTeamFamily.set(cacheKey, result);
          return result;
        }

        getActivatedCardIds(team) {
          return this.cardsByTeam[this.clampTeam(team)].filter(card => card.activated).map(card => card.definition.id);
        }

        createTelemetrySnapshot() {
          return [0, 1].map(team => ({
            team,
            deck: this.cardsByTeam[team].map(card => ({
              id: card.definition.id,
              displayName: card.definition.displayName,
              trigger: (_crd && BattleCardTrigger === void 0 ? (_reportPossibleCrUseOfBattleCardTrigger({
                error: Error()
              }), BattleCardTrigger) : BattleCardTrigger)[card.definition.trigger],
              durationSeconds: card.definition.durationSeconds,
              active: card.active,
              activated: card.activated,
              remainingSeconds: card.remainingSeconds
            }))
          }));
        }

        createDeck(cardIds) {
          if (!this.database || !Array.isArray(cardIds)) {
            return [];
          }

          var result = [];
          var ids = new Set();

          for (var i = 0; i < cardIds.length; i++) {
            var id = cardIds[i];
            if (!id || ids.has(id)) continue;
            if (result.length >= MAX_CARDS_PER_DECK) break;
            var definition = this.database.getCard(id);
            if (!definition) continue;
            ids.add(id);
            result.push({
              definition,
              activated: false,
              active: false,
              remainingSeconds: 0
            });
          }

          return result;
        }

        shouldActivate(card, team, currentCombatPoint, initialCombatPoint) {
          if (card.definition.trigger !== (_crd && BattleCardTrigger === void 0 ? (_reportPossibleCrUseOfBattleCardTrigger({
            error: Error()
          }), BattleCardTrigger) : BattleCardTrigger).OwnCombatPointBelow) {
            return false;
          }

          var safeTeam = this.clampTeam(team);
          var initial = Math.max(1, Number.isFinite(initialCombatPoint[safeTeam]) ? initialCombatPoint[safeTeam] : 1);
          var current = Math.max(0, Number.isFinite(currentCombatPoint[safeTeam]) ? currentCombatPoint[safeTeam] : 0);
          return current / initial <= Math.max(0, Math.min(1, card.definition.ownCombatPointThreshold));
        }

        activateCard(team, card) {
          if (card.activated) return;
          card.activated = true;
          card.active = true;
          card.remainingSeconds = Math.max(0, card.definition.durationSeconds);
          this.modifiersByTeamFamily.clear();
          this.emitEvent('card-activated', team, card);
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

        applyModifier(result, modifier, value) {
          var safeValue = Number.isFinite(value) ? value : 0;

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
            trigger: (_crd && BattleCardTrigger === void 0 ? (_reportPossibleCrUseOfBattleCardTrigger({
              error: Error()
            }), BattleCardTrigger) : BattleCardTrigger)[card.definition.trigger],
            durationSeconds: card.definition.durationSeconds,
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