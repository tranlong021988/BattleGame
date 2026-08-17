# BattleGame handoff

Last updated: 2026-08-18. Source and `assets/Battle.scene` are authoritative if
this handoff conflicts with them.

## Start here

- Active scene: `assets/Battle.scene`.
- Runtime ownership: `GameManager` owns live combat; `LevelSettings` owns
  campaign save, shop, economy, ads, side missions, and progression.
- Battles reset internally after telemetry export. Do not restore normal
  `director.loadScene`, browser reload, or `game.restart` between battles.
- Worktree is intentionally dirty with Cocos `library/`, `temp/`, and
  `profiles/` output. Preserve unrelated changes. `MainGameFlow.ts` is unused
  and is not attached to `Battle.scene`.

## Current scene configuration

| Setting | Value |
| --- | ---: |
| Total levels / progression end | 60 / 50 |
| Boss pace / CP multiplier / Max Alive multiplier | 5 / 1.0 / 1.0 |
| Starter gold | 1,000 |
| Player initial CP / Max Alive | 300 / 4-10 |
| Deck capacity | 3 |
| Main entry-fee ratio | 0.35 |
| Rewarded-ad simulation | enabled |

Save key is `battle-progression-v8`; saved schema is version 13.

## Design rules currently implemented

- L1 is tutorial: no progression package is offered there. Offers start on
  normal stages from L2 onward where applicable.
- Unit, card, and upgrade offers derive from normalized progression and boss
  pacing. Do not add fixed L10/L25/L51 lists.
- Remaining unit-count and card-upgrade ranks after progression end are
  spread across non-boss levels before the finale, never dumped into one level.
- Enemy strength-card ranks use the exact same dynamic offer schedule as the
  player. Enemy decks are fixed after their first generation per level, so
  retries do not reroll them, but composition is level-seeded and roster-aware
  rather than a static top-score preset.
- Enemy card capacity is boss-paced: normal levels carry no cards, the level
  immediately before a boss carries one, and a boss may carry up to three
  eligible cards. With boss pace 5 this is `0, 0, 0, 1, 3`; it must remain
  dynamic for other boss paces. An absent target unit reduces the actual deck.
- Enemy deck policy is currently v5. On policy mismatch, `LevelSettings`
  clears `enemyCardIdsByLevel` once and rebuilds it; do not preserve cached
  decks from an earlier policy. Selection scans the two most recent non-empty
  enemy decks to penalize repeats, and its seed hash must end as an unsigned
  32-bit value. A signed final hash clamps to index zero and recreates the
  `sword-wall` repetition bug.
- Card upgrades are independent packages: Cooldown, Budget, and Strength.
  Strength exists only for Spear Discipline, Sword Breakthrough, and Axe
  Vanguard. At R2 it is designed to bring that melee family up one ladder
  step; `BattleCardDatabase.ts` is the data authority.
- Cards are roster-aware on both sides: a card requires a usable target family
  for its owner, while an opponent-conditioned card also requires that family
  to exist on the opposing roster. `Spear Discipline` specifically requires
  Spear for its owner and Cavalry for its opponent; this same rule filters
  enemy decks, so it must not appear against a side without Cavalry. Do not
  restore the removed player-card-wave gate: it incorrectly required the
  player to own Cavalry before using this Spear card.
- Precise Range spends one budget charge per ranged attack batch while a
  ranged unit exists. It affects Archer and Monk.

## Economy, ads, and side missions

- Main rewards are a cached, deterministic campaign plan. Each reward is at
  least its normal level-scaled baseline and never falls below the preceding
  reward. The plan funds one highest-cost eligible next-level purchase plus
  the next entry fee, using the same dynamic progression/shop rules as runtime
  rather than a fixed reward table.
- Main entry is free at L1; each later fee is derived from the previous main
  reward, not its own reward. The bot reserves entry before non-essential
  spending.
- Side mission is used when priority purchases or entry cannot be afforded.
  It mirrors current player roster/CP/Max Alive, has no cards or boss bonus,
  and advances card cooldowns like a completed battle.
- Its initial reward scales from the current main-entry fee, then consecutive
  side rewards decay until a main attempt resets the streak. This permits
  recovery after a loss without creating an unlimited side-farm loop.
- `allowAdsRescue = false` disables both Gold x2 and card cooldown-skip ads.
- Gold x2 is accepted only when it unlocks a purchase while retaining entry,
  or secures entry. Cooldown ad choice is value-aware, constrained to one per
  battle, and uses a diversity floor to avoid a single dominant card. Ads are
  not considered on an unbeaten mainline run; `levelLossCount > 0` is required.

## Combat safety

- Any hero death resolves the battle immediately and freezes combat movement
  and damage for both teams.
- Despawn clears target references; pooled units must not retain targets.
- Static original hero positions define hero lines. Hero-line completion is a
  fallback win condition alongside hero death.

## Telemetry

- `BattleTelemetry.ts` exports combat details; `LevelSettings` appends
  progression data to each report.
- New reports use `progression.telemetry` schema v2. It contains a persistent
  campaign `runId`, monotonic `battleIndex`, report ID, and per-report,
  non-cumulative `actions`. Every action ID includes the run and battle ID,
  so retries cannot collide across a campaign. Actions include sequence,
  phase, level, type, gold before/after, card ID, source, cost, gold granted,
  and ads reason; they cover purchases, main-entry fees, Gold x2, and
  cooldown-skip ads.
- If bot purchases occur before it abandons a main setup for a side mission,
  those actions are deliberately carried into the following side report; they
  would otherwise be absent from every report.
- `preBattlePurchases` is reset at the start of each battle preparation. The
  older `botSimulationEvents` remains a capped save-history diagnostic only;
  do not sum it across reports.

### Telemetry baseline

- The 2026-08-16 runs predate the current deterministic main-reward plan and
  must not be used as a balance baseline.
- Older reports without `progression.telemetry` schema v2 cannot accurately
  count cooldown ads. Treat them only as combat-history evidence.

## Key source map

| Concern | Source |
| --- | --- |
| Scene values | `assets/Battle.scene` |
| Progression/economy/shop/ads/telemetry ledger | `assets/scripts/LevelSettings.ts` |
| Combat setup, reset, win resolution, export | `assets/scripts/GameManager.ts` |
| Card data and strength targets | `assets/scripts/BattleCardDatabase.ts` |
| Card runtime and budget consumption | `assets/scripts/BattleCardRuntime.ts` |
| Unit combat and target lifecycle | `assets/scripts/Unit.ts`, `assets/scripts/UnitBehavior.ts` |
| Combat telemetry export | `assets/scripts/BattleTelemetry.ts` |

## Verification and next work

- Static source and serialized-scene checks are required after card/data edits:
  verify both `BattleCardDatabase.ts` and `Battle.scene`, plus player and enemy
  calls to `isCardEligibleForTeam`. There is no standalone project TypeScript
  compile script; full Cocos diagnostics contain pre-existing engine/config
  noise and must be interpreted separately.
- Before changing economy values again, use the current main-reward plan as
  the baseline and inspect `progression.telemetry.actions`; do not infer a
  regression from reports made before the plan.
- Use `cautious-coding` for changes, `game-balance-check` for telemetry reports,
  and `game-balance-regression` after balance/mechanic changes.
