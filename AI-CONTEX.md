# BattleGame handoff

Last updated: 2026-08-19 (latest telemetry/reset audit). Source and `assets/Battle.scene` are authoritative if
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

### Boss deck mirror (current)

- On boss levels only, the enemy deck is configured first and becomes the
  player's preparation target. The player attempts to use the exact same
  card IDs; this is not active on normal levels or side missions.
- If a boss card is missing, the bot prioritizes that exact card unlock. If it
  is owned but below the enemy's effective Strength rank, the matching card
  Strength upgrade is prioritized. Routing to side when target cost plus main
  entry fee is unaffordable is intentional, not a balance failure.
- Cooling mirrored cards may be finished with rewarded ads. There is no
  one-ad-per-battle cap. Telemetry reason is `boss-deck-mirror`.
- Equal CP and equal cards do not guarantee victory; combat variance may still
  produce losses. The goal is to remove accidental deck disadvantage, not to
  force a perfect win streak.

## Economy, ads, and side missions

- Main rewards are a cached, deterministic campaign plan. Each reward is at
  least its normal level-scaled baseline and never falls below the preceding
  reward. The plan funds one highest-cost eligible next-level purchase plus
  the next entry fee, using the same dynamic progression/shop rules as runtime
  rather than a fixed reward table.

### Reward-plan decision (2026-08-19)

- The attempted plan that funded every currently available baseline and card
  offer was fully reverted. Several card unlocks can appear together at L2,
  creating a reward spike that the non-decreasing rule then preserves.
- The restored plan is the approved stable baseline: fund only the single
  highest-cost eligible next-level purchase and its next entry fee. Do not
  reintroduce “fund every visible card/offer” without redesigning the unlock
  schedule and validating the full economy curve.
- The stale `.git/index.lock` was checked (zero bytes and no running Git
  process) and removed on 2026-08-19. Verify that condition before removing a
  future lock.
- Main entry is free at L1; each later fee is derived from the previous main
  reward, not its own reward. The bot reserves entry before non-essential
  spending.
- Side mission mirrors current player roster/CP/Max Alive, has no cards or
  boss bonus, and advances card cooldowns like a completed battle. Its reward
  is the current main-entry fee (minimum 50) and does **not** decay. The bot,
  rather than an economy penalty, prevents aimless farming.
- `allowAdsRescue = false` disables both Gold x2 and card cooldown-skip ads.
- There is no hard cap on cooldown-skip ads. A cooldown ad is used only for a
  card that enters the selected deck and makes the resulting deck competitive;
  one preparation can therefore use multiple ads when each is necessary.
- `mainLossesAtCurrentLevel` counts only failed main attempts, persists through
  side wins, and resets on a main win or level change. Outside a deliberate
  preparation, it raises the probability of accepting a viable cooldown-ad
  plan: `losses / (losses + 1)`.

### Bot preparation before main battle

- Enemy deck is locked first, then the bot evaluates the player against that
  exact deck. It is not allowed to enter a known disadvantaged main battle
  merely because it can pay the entry fee.
- The bot simulates every currently offered purchase on a clone of the saved
  state: unit unlock/count, Initial CP, Max Alive, card unlock, and all card
  upgrades. It selects the option with the largest projected player combat
  strength (ties: lower cost, then stable ID).
- If that target is unaffordable after reserving main entry, the bot routes to
  side and continues until it can pay `target cost + entry fee`. Once funded,
  it buys that exact target with source `pre-battle-preparation` before normal
  weighted purchases run. This fixes the old L5 loop where the bot repeatedly
  paid entry with 260 gold instead of saving 800 gold for Sword Wall.
- On a side win, Gold x2 is used when doubling is the difference between
  reaching that preparation target plus entry and not reaching it. It is not
  globally capped. Existing x2 logic remains available for a normal purchase
  or entry rescue when no preparation target applies.
- If the owned deck would be competitive with cooled cards restored, the bot
  enters deliberate deck preparation and immediately finishes every required
  cooldown by ad. Telemetry reason is `prepared-deck-threshold`. If no single
  available purchase improves a losing matchup, the bot does not farm forever
  for a fictitious solution and may still attempt main.

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
- The batch `battle-telemetry-2026-08-18T10-08-08-876Z` through
  `...10-36-20-969Z` completed L60 in 99 battles (59/89 main wins, 10/10 side
  wins). It exposed L5 as a pre-preparation baseline: Sword Wall was offered
  at 800 gold, player repeatedly returned to main with 260 gold before the
  150 fee, while the L5 boss used its full three-card deck. Do not use that
  batch to judge the preparation logic above; it predates this change.

### Latest report audit: 2026-08-19 09:50–10:42

- The batch contained 110 main-battle reports: 80 wins and 30 losses. It
  reached L60. There were 24 boss attempts and 6 boss losses: two at L10 and
  one each at L20, L30, L40, and L50.
- L35 is healthy: player and enemy used the same three-card deck and the
  battle was won. L60 also used an exact mirrored deck and won after three
  `boss-deck-mirror` cooldown ads.
- L10's early side farming is valid. The enemy used
  `general-offensive + sword-wall + axe-frenzy`; the player did not yet own
  `axe-frenzy`, so farming to afford that card plus entry is expected.
- One L10 report is invalid as a combat-balance evidence point: both runtime
  decks were `[]`, while saved `enemyCardIdsByLevel["10"]` contained the
  three-card enemy deck. The later L10 win with the exact mirrored deck is the
  meaningful result. Treat the empty/empty report as reset/configuration
  anomaly, not as a cardless boss victory.
- No main-entry hardlock was observed. Do not change entry fees, rewards, or
  side-farming rules based on this batch.

### Reset/configuration fix

- `configureEnemyBattleCards` now treats an empty cached enemy deck as stale
  when eligible enemy card candidates exist. It rebuilds and persists the
  deck instead of allowing a main battle to start with an empty enemy deck.
- Side missions remain the intentional empty-card mode. When auditing a main
  report, compare saved `enemyCardIdsByLevel`, progression selected card IDs,
  and `config.cards`; an empty runtime deck with a populated saved deck is a
  reset/configuration anomaly and must be excluded from balance conclusions.

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
- For the next progression audit, first inspect: `side-mission-entry-
  preparation` diagnostic events, forced purchase source
  `pre-battle-preparation`, `complete-preparation-target` Gold x2 events, and
  `prepared-deck-threshold` cooldown-ad events. L5 should no longer enter
  main repeatedly before Sword Wall plus its entry fee are funded.
- For boss audits, inspect `boss-deck-mirror` cooldown-ad actions and compare
  player/enemy selected card IDs before judging a loss. A loss with equal CP
  and equal deck is a combat-variance sample; a loss with a missing enemy card
  is a preparation/configuration issue.
- Use `cautious-coding` for changes, `game-balance-check` for telemetry reports,
  and `game-balance-regression` after balance/mechanic changes.
