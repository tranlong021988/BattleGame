# AI-CONTEX — BattleGame handoff

Last updated: 2026-08-10. This document records the authored state after the
budget-based Battle Card revision and the dynamic-progression pass.

`assets/Test.scene` and the current TypeScript source are the runtime authority.
This document is only a handoff. When it disagrees with source or Inspector,
inspect source/scene and update this document rather than changing gameplay to
fit the document.

## Working rules

- The worktree is intentionally dirty. Preserve all unrelated user/Cocos
  changes. Do not stage or revert generated `library/`, `temp/`, or `profiles`
  files unless the user explicitly asks.
- Active test AI is `BattleArmyBrain` + `BattlefieldEvaluator`. `SmartArmyBrain`
  is legacy.
- Team A is a simulation of a player, not shipped player UX. It may make
  weighted purchases and random card selections only when
  `purchasingSimulation` is enabled.
- Telemetry is evidence only. Never use previous reports as runtime inputs.
- The user dislikes compensating one issue with new hard-coded thresholds or
  extra knobs. Prefer one causal correction.

## Skills the next Codex must have or follow manually

The local profile used for this handoff exposes
`cocos-performance-optimize-skills` and browser tooling, but is missing the
following agreed BattleGame skill set. Please send/install/synchronise these
before the next design or balance task:

| Needed skill | Use it for |
| --- | --- |
| `game-systems-design` | Combat, cards, economy, progression and AI-facing rules. |
| `game-design-consistency` | Cross-check design, source, scene and telemetry before mechanic changes. |
| `game-balance-check` | Analyze telemetry and balance/economy problems. |
| `game-balance-regression` | Verify mechanics/balance changes with before/after evidence. |
| `cautious-coding` | Any code edit, debugging or refactor. |

For card work, use `game-design-consistency` + `game-balance-check` before
editing, then `game-balance-regression` afterward. The existing Cocos
performance skill is still the right one for mobile/large-unit performance
work, not general game design.

## Primary code locations

| Domain | Source |
| --- | --- |
| Card definitions and default values | `assets/scripts/BattleCardDatabase.ts` |
| In-battle decks, budgets, consumption and card telemetry | `assets/scripts/BattleCardRuntime.ts` |
| Campaign/save/shop/progression/enemy deck selection | `assets/scripts/LevelSettings.ts` |
| Runtime integration, fixed Hero Line and battle resolution | `assets/scripts/GameManager.ts` |
| Card effects at attack/range/defense/AOE/counter use sites | `assets/scripts/Unit.ts`, `assets/scripts/UnitBehavior.ts` |
| Telemetry schema | `assets/scripts/BattleTelemetry.ts` |
| Active Inspector overrides | `assets/Test.scene` |

`GameManager.battleCardDatabase` must reference the `BattleCardDatabase`
component in `assets/Test.scene`; a missing reference creates empty decks.

## Battle Cards — approved contract and implementation

### Decks, activation and cooldown

- The player may own many unique cards but the current deck cap is **3**.
  `LevelSettings.battleCardDeckSize` is the future deck-upgrade hook; do not
  replace it with a new constant.
- At battle start, every selected card with budget above zero activates. There
  are no CP-threshold triggers and no duration expiry any more.
- Each card has `baseBudget` (combat-event charges). At zero, it immediately
  deactivates and emits `card-depleted`.
- A card starts cooldown only when it actually consumed at least one charge.
  Cooldown is in completed battles. Rewarded ad API:
  `tryFinishCardCooldownWithAd(cardId)`; call it only after an ad succeeds.
- Player selection API: `setPlayerBattleCardSelection(cardIds)`. It rejects
  duplicate, unowned, cooling-down, ineligible and over-cap cards.
- Shop API: `tryPurchaseCard(id)`, `tryPurchaseCard(id, true)` for cooldown,
  `tryPurchaseCard(id, 'budget')` for budget.

### Consumption semantics

- Damage modifier: consume once per attack batch, after its target is damaged.
- Range modifier: consume only when an attacker uses the extra portion of its
  range; ordinary in-base-range attacks do not consume it.
- Damage radius: consume once when that attack batch actually uses the expanded
  radius, independent of the number of splash victims.
- Defense and counter immunity: consume per defender actually protected from a
  damage event. An AOE that protects five defenders can therefore consume five
  charges; this matches the user's intended natural sequential resolution.
- Multiple matching cards may stack and each matching card consumes one charge.
  Runtime modifiers are cached and cache is cleared on consumption/depletion.

### Current definitions

| ID | Base budget | Effect | Relevant eligibility |
| --- | ---: | --- | --- |
| `general-offensive` | 50 | all units +5% damage | core roster |
| `battle-shields` | 90 | frontline +1 DEF | frontline roster |
| `anti-cavalry-spearhead` | 12 | Spear +14% DMG, -1 DEF | opponent must have Cavalry |
| `axe-frenzy` | 20 | Axeman +18% DMG, -0.2 DEF | Axeman required |
| `sword-wall` | 60 | Sword +2 DEF, -10% DMG | Sword required |
| `arrow-suppression` | 30 | Archer +12% DMG, -8% range | Archer required |
| `precise-range` | 18 | Archer/Monk +8% range | ranged roster |
| `wide-prayer` | 5 | Monk +30% radius, -12% DMG | Monk required |
| `counter-breaker` | 3 | ignore actual counter bonus | counter threat required; enemy pool boss-only |

Purchase price and base cooldown remain authored in `BattleCardDatabase` / the
scene. Anti-Cavalry is forcibly migrated to `requiredEnemyFamily = Cavalry` on
database load if an old scene still says `Any`.

### Card upgrades

- Cooldown ranks 0..2: effective cooldown is base cooldown minus rank, floor
  1. Cost: 60%, then 90% of purchase price.
- Budget ranks 0..2: budget is 1.0x, 1.4x, 1.8x, rounded. Cost: 50%, then 75%
  of purchase price.
- Upgrade availability is dynamic and not a hard-coded level list:
  `rankLimit = clamp(playerCardWave - cardReleaseWave, 0..2)`.
- Waves: core cards 0; Axeman cards 1; Archer/ranged 2; Cavalry-response 3;
  Monk and Counter Breaker 4. A player must own the relevant unit with count
  above zero before that wave/card is eligible.
- The test bot first reserves Gold for CP/Max Alive parity. It then prioritizes
  eligible card unlocks before cooldown upgrades, and cooldown upgrades before
  budget upgrades. Weights after those guards: card 0.6, cooldown 2, budget
  1.5. This is bot-only; manual player purchases are not blocked by that
  priority policy.

## Enemy cards and progression

- Eligibility is roster-aware for both sides. A card must target a family the
  card owner has, and a conditional card requires the opposing family. Thus
  Anti-Cavalry cannot be selected or sold before opposing Cavalry exists.
- Counter Breaker additionally requires a real counter threat, not merely its
  release wave.
- Enemy capacity is dynamic from the player's card wave and the current deck
  cap: normal = `min(2, playerCardWave, deckCap)`; boss =
  `min(3, normal + 1, deckCap)`. This intentionally means core normal battles
  may have zero cards; bosses can lead by one card.
- Enemy decks are saved by level in `enemyCardIdsByLevel`. Retrying the same
  level never rerolls the deck, even if the roster changes and a stored card
  later has no valid target. This is an explicit user decision.
- The saved state uses `battle-progression-v8` and now persists card ownership,
  both upgrade ranks, cooldown, and `enemyCardIdsByLevel`. Migration copies
  legacy `lastEnemyCardIds` to the current level if necessary.

## Unit progression and dynamic scaling

- `UnitProgressionRule.unlockProgression` is intended as normalized campaign
  position. `getRuleUnlockLevel()` converts it through `progressionEndLevel`
  then aligns to the next boss stage.
- TypeScript defaults are: Spear/Sword 0; Axeman .2; Archer .5; Cavalry .7;
  Monk .9. Counts are 5/5/5/3/5/1 with max 10/10/10/5/10/1.
- **Known scene discrepancy:** `assets/Test.scene` currently serializes all
  `unlockProgression` as 0 and carries legacy unlock levels 1/1/10/25/35/45.
  `migrateLegacyUnitUnlockProgression()` prevents the catastrophic “all units
  at level 1” failure, but this fallback preserves legacy levels rather than
  true normalized scaling when `progressionEndLevel` changes. Fill the scene's
  normalized values and re-verify Preview before claiming the entire system is
  dynamic.
- CP packages, Max Alive packages, unit unlock/count offers and enemy unit
  roster all derive from the same progression helpers. Do not add per-level
  hard caps to compensate for a mismatch; repair the shared helper/scene data.

## End conditions

- Hero death resolves immediately for either team: the opposite team wins.
  Reason is `boss-killed` on a boss and `hero-killed` otherwise.
- This is guarded in both `GameManager.despawnUnit()` and `Unit.update()` so a
  Hero whose dead state bypasses normal despawn still ends the battle.
- Enemy Hero Line is the defending Hero's original world-Z, captured before
  scene Hero preparation. It does **not** follow a moving Hero. A team-1
  forward scanner crossing team-0's stored line resolves
  `enemy-reached-hero-line`.
- No equivalent Team-A Hero Line win condition was requested. Do not infer one
  without user approval.

## Telemetry

- `cardEvents` now contains only `card-activated` and `card-depleted`, with
  remaining/used budget and battle time.
- `config.cards`, progression snapshots, and runtime snapshots carry deck and
  budget information. Use `getUsedBattleCardIds()`: it identifies cards that
  consumed charge, not merely cards selected at battle start.
- Recent batches before this handoff showed two invalid periods: first, stale
  unit unlock serialization made all units available at level 1; second,
  Preview build cache was broken. Do not use those batches to tune balance.

### Latest valid batch: 2026-08-10 11:37-11:45

Source reports:
`C:/Users/CPU/Downloads/battle-telemetry-2026-08-10T11-37-48-992Z.json`
through `battle-telemetry-2026-08-10T11-45-30-715Z.json` (27 battles, levels
2-14 including retries).

This batch is valid runtime evidence after the Preview recovery:

- Every report has a result. End conditions fired as designed: 18
  `hero-killed`, 8 `boss-killed`, and 1 `enemy-reached-hero-line`.
- No Anti-Cavalry card was selected before Cavalry. Normal enemy deck capacity
  stayed 0 while the player had not bought Axeman; boss capacity was 1.
- Level 10 boss retried seven times with the same enemy `Battle Shields` deck,
  proving retry deck persistence. The player won only once.
- Every selected card that consumed charge reached `card-depleted` with its
  full budget used. There is no trace of the retired trigger/duration model.

Balance finding — do not blame enemy cards:

- Aggregate: Team A/player bot won 12 and lost 15. Boss 10 was 1 win / 6
  losses. Level 13 was 1 / 3. Level 14 was 0 / 6 and is the current stall.
- From level 10 onward, enemy has Spear + Sword + Axeman. Through level 14 the
  player still has only Spear + Sword; Axeman is offered at 1480 Gold but was
  never affordable after CP, Max Alive and core-card spending.
- At level 14 player Initial CP is 476 versus enemy 460, yet it still loses.
  Normal enemy has no cards there, so the causal pressure is roster/economy
  asymmetry, not enemy card strength.
- The test bot bought Battle Shields (L3) and Sword Wall (L8), then General
  Offensive (L11), before it could afford Axeman. It later spent 1000 Gold on
  the required Max Alive milestone at L13. That is consistent with current bot
  policy, but produces the unwinnable roster gap.

When changing this, do not tune card numbers. The intended correction needs a
user decision: either guarantee the player can buy a newly enemy-unlocked
family by that same stage, or make the bot reserve/prioritize that unit unlock
ahead of optional core cards. The second option is the smaller change and
matches the approved rule that cards open after owning their relevant unit.

## Preview/compiler incident — recovered; keep backup

On 2026-08-10 Cocos Preview emitted SystemJS errors (`__unresolved_2`, then
missing chunk Error#3). Investigation proved the runtime server/import map
referenced chunks that did not exist under `temp/programming/packer-driver`.
This was a partial/corrupt Cocos compiler cache, not a TypeScript game-logic
error.

Actions already taken:

- Moved `temp/programming/packer-driver` to the reversible backup
  `temp/programming/packer-driver.stale-20260810-1135/` after the user closed
  Cocos.
- No authored asset or scene was deleted. The current new `packer-driver`
  output is generated and must not be staged.
- Moved range-budget enum handling behind `GameManager.consumeAttackRangeCardBudget`
  so `Unit.ts` no longer imports `BattleCardDatabase` directly. Targeted
  Cocos TypeScript compilation passed.

The valid 27-report batch above proves Preview can now run battles and export
telemetry again. Keep the backup until a future clean browser/import-map check
passes; only delete it with user approval.

## Current validation and next work

- Targeted Cocos TypeScript compile of `Unit.ts` and `GameManager.ts` passed.
- `git diff --check` for current authored card/end-condition edits passed.
- Preview recovery is validated by the latest exported batch. Its balance
  finding is limited to the L10-L14 roster/economy issue above; it is not a
  full 1-50 balance certification.
- The authored gameplay changes remain uncommitted.

When work resumes: first resolve the approved unit-unlock/economy policy, then
populate normalized `unlockProgression` values in `assets/Test.scene` (after
user approval if the task scope is only diagnostics). Re-run a clean telemetry
batch before any card tuning.
