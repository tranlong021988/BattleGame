# BattleGame handoff

Last updated: 2026-08-17. Source and `assets/Battle.scene` are authoritative if
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

Save key is `battle-progression-v8`; saved schema is version 11.

## Design rules currently implemented

- L1 is tutorial: no progression package is offered there. Offers start on
  normal stages from L2 onward where applicable.
- Unit, card, and upgrade offers derive from normalized progression and boss
  pacing. Do not add fixed L10/L25/L51 lists.
- Remaining unit-count and card-upgrade ranks after progression end are
  spread across non-boss levels before the finale, never dumped into one level.
- Enemy strength-card ranks use the exact same dynamic offer schedule as the
  player; enemy decks are fixed per level so retries do not reroll them.
- Card upgrades are independent packages: Cooldown, Budget, and Strength.
  Strength exists only for Spear Discipline, Sword Breakthrough, and Axe
  Vanguard. At R2 it is designed to bring that melee family up one ladder
  step; `BattleCardDatabase.ts` is the data authority.
- Cards are roster-aware: ranged cards require Archer/Monk, melee cards need
  their target family, and enemy cards obey the same requirement.
- Precise Range spends one budget charge per ranged attack batch while a
  ranged unit exists. It affects Archer and Monk.

## Economy, ads, and side missions

- Main entry is free at L1; later fee is derived from reward and reserved by
  bot purchase simulation before non-essential spending.
- Side mission is used when priority purchases or entry cannot be afforded.
  It mirrors current player roster/CP/Max Alive, has no cards or boss bonus,
  and advances card cooldowns like a completed battle.
- `allowAdsRescue = false` disables both Gold x2 and card cooldown-skip ads.
- Gold x2 is accepted only when it unlocks a purchase while retaining entry,
  or secures entry. Cooldown ad choice is value-aware, constrained to one per
  battle, and uses a diversity floor to avoid a single dominant card.

## Combat safety

- Any hero death resolves the battle immediately and freezes combat movement
  and damage for both teams.
- Despawn clears target references; pooled units must not retain targets.
- Static original hero positions define hero lines. Hero-line completion is a
  fallback win condition alongside hero death.

## Telemetry

- `BattleTelemetry.ts` exports combat details; `LevelSettings` appends
  progression data to each report.
- New reports now include `progression.telemetryActions`: per-report,
  non-cumulative ledger records with `eventId`, sequence, phase, level, type,
  gold before/after, card ID, source, cost, gold granted, and ads reason.
  It covers purchases, main-entry fees, Gold x2 claims, and cooldown-skip ads.
- `preBattlePurchases` is reset at the start of each battle preparation. The
  older `botSimulationEvents` remains a capped save-history diagnostic only;
  do not sum it across reports.

### Latest validated run: 2026-08-16 18:00-18:52

- 178 continuous reports, one schedule, L1 through campaign-complete L60.
- Main: 60/103 wins (58.3%). Side: 42/75 wins (56.0%). Total: 102/178
  (57.3%). The bot completed the campaign with 1,402 gold.
- Main bottlenecks: L5 and L52 (20%), L33 and L59 (25%). This is one stochastic
  bot run, not proof of human balance.
- Gold x2 was accepted 10 times for a material purchase/entry benefit.
- The old files prove cooldown ads occurred but cannot count them accurately,
  which is why `telemetryActions` was added.

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

- Targeted TypeScript check for `LevelSettings.ts` is clean. Full Cocos TypeScript
  diagnostics still contain pre-existing engine/configuration noise; do not
  attribute that to these progression changes.
- Next useful verification: run a fresh L1-L60 simulation and audit only
  `progression.telemetryActions`; then compare ads on/off and inspect main/side
  dependency at the listed bottlenecks.
- Use `cautious-coding` for changes, `game-balance-check` for telemetry reports,
  and `game-balance-regression` after balance/mechanic changes.
