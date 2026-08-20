# BattleGame handoff

Last updated: 2026-08-21. `assets/Battle.scene` and TypeScript source are
authoritative; this file is a decision record only. Update it only when the
user explicitly requests it.

## Start here

- Active scene: `assets/Battle.scene`.
- `GameManager` owns live combat, resolution, internal reset and export.
  `LevelSettings` owns campaign save, progression offers, shop, economy, ads,
  side missions, bot preparation and appended telemetry.
- Battles reset internally after telemetry export. Do **not** restore browser
  reload, `game.restart`, `director.loadScene`, or the unused
  `MainGameFlow.ts` approach between battles.
- The worktree can be dirty with Cocos `library/`, `temp/`, `profiles/`, and
  scene-editor output. Preserve those unrelated generated changes. At the
  2026-08-21 handoff, no tracked source or scene file was modified; only
  generated Cocos output was dirty.

## Current scene configuration

| Setting | Value |
| --- | ---: |
| Total levels / progression end | 60 / 50 |
| Boss pace | 5 |
| Starter gold | 1,000 |
| Main reward flat bonus | 400 gold per main battle |
| Win gold per enemy CP / boss gold multiplier | 1.15 / 1.15 |
| Player Initial CP / Max Alive | 300 / 4 → 10 |
| Deck capacity | 3 |
| Main entry-fee ratio | 0.35 |
| Rewarded-ad simulation | enabled |

Save key is `battle-progression-v8`; saved schema version is 13.

## Progression and combat rules

- L1 is tutorial: no progression package is offered there. Offers begin at L2
  where applicable.
- Unit unlocks, baseline upgrades, cards and card upgrades derive from
  normalized progression plus boss pace. Do not add fixed L10/L25/L51 lists.
- Rule unlock levels are normalized to `progressionEndLevel` and rounded up to
  the nearest boss. Baseline CP/Max Alive milestones use boss pace. Pending
  unit-count and card-upgrade ranks after progression end are distributed over
  non-boss levels before the finale, never dumped into one level.
- Enemy strength-card ranks use the player offer schedule. Enemy decks are
  generated once per level and persisted, so retries must not reroll them.
  Selection is level-seeded, roster-aware, and penalizes repeated recent decks.
- Enemy deck capacity is distance-to-next-**real**-boss based: earlier normal
  stages get 0 cards, the final normal stage gets 1 preview card, boss gets up
  to 3 eligible cards. Pace 5 is `0,0,0,1,3`; pace 4 is `0,0,1,3`; pace 3 is
  `0,1,3`. A truncated tail after the last full boss has 0 cards. This is the
  2026-08-20 `getEnemyBattleCardDeckSizeFor` fix; do not restore the prior
  fractional-progress calculation that skipped a preview at pace 4.
- An absent target unit reduces actual deck size below capacity. Cards are
  roster-aware for both teams. `Spear Discipline` requires Spear for owner
  and Cavalry for opponent; do not restore the removed player-card-wave gate.
- Card upgrades are independent packages: Cooldown, Budget and Strength.
  Strength is only for Spear Discipline, Sword Breakthrough and Axe Vanguard.
  `BattleCardDatabase.ts` is card-data authority. `Precise Range` spends one
  budget per ranged batch and affects Archer and Monk.

## Boss deck mirror and bot preparation

- Only on boss main levels, configure enemy deck first and use its exact card
  IDs as player preparation target. It does not apply to normal levels or side
  missions.
- Missing mirrored card unlocks are prioritized. An owned card below enemy
  Strength rank prioritizes its matching Strength upgrade. If target + entry
  is unaffordable, routing to side is intentional.
- Cooling mirrored cards may be finished by rewarded ads. There is **no**
  one-ad-per-battle cap; telemetry reason is `boss-deck-mirror`.
- Before a main battle the bot simulates available purchases on a clone:
  unit unlock/count, Initial CP, Max Alive, card unlock and all card upgrades.
  It chooses greatest projected combat-strength gain (then lower cost, stable
  ID). If unaffordable after entry reserve, it farms side until target + entry
  is funded, then buys source `pre-battle-preparation`.
- If cooled selected cards would make deck competitive, bot can use necessary
  cooldown ads immediately (`prepared-deck-threshold`). Outside deliberate
  preparation, main losses raise viable cooldown-ad acceptance probability as
  `losses / (losses + 1)`. Retry-versus-skip randomness remains intentional
  human-like variance.
- Equal CP/deck does not require a win. Such losses are valid combat variance,
  not automatic economy or card regressions.

## Economy, ads and side missions

- Main reward plan is deterministic/cached per total-level count. It is
  strictly increasing by at least 50, starts from level-scaled win gold, then
  smooths funding for **one** important next-level purchase plus the next
  entry fee. The scene-controlled 400 flat bonus is added afterwards to every
  reward.
- Do not reintroduce a plan that funds every visible offer: several cards at
  L2 create a spike that permanently distorts a monotonic curve.
- Runtime logic is dynamic for total levels, progression end and pace. Changing
  those values within an existing save is not a migration path; use fresh
  preview/reset for a new configuration.
- L1 entry is free. Later fee uses previous main reward:
  `max((level - 1) * 50, ceil(previousReward * 0.35 / 50) * 50)`.
- Side reward is `max(50, current main entry fee)`, does not decay, has no
  cards/boss bonus, mirrors player roster/CP/Max Alive, and advances cooldowns.
- `allowAdsRescue = false` disables Gold x2 and cooldown-skip ads. Neither has
  a hard cap. Bot x2 must cross a concrete preparation/purchase/entry
  threshold, not be used merely because an ad is available.
- Main-loss count persists through side wins, resets on main win or level
  change, and is a decision input—not a side-reward penalty.
- Bosses are every fifth level. Their raw baseline reward is 15% above the
  same-level normal reward: `baseInitialCP * winGoldPerEnemyCP *
  bossGoldRewardMultiplier`. The boss combat-CP multiplier is deliberately
  excluded from this reward base. The final displayed reward can differ from
  exactly 15% because the monotonic reward plan, 50-gold rounding, and the
  universal 400-gold bonus are applied afterwards.

## Shop package inventory and UI contract

- With the current 60-level scene configuration, the eventual shop inventory
  is **104 packages**. This is a configuration-derived count, not a value UI
  should hard-code:

  | UI group | Package kinds | Count |
  | --- | --- | ---: |
  | Army | Unit unlock (5), unit count (22) | 27 |
  | Army Power | Initial CP (20), Max Alive (6) | 26 |
  | Cards | Card unlock (9), cooldown (18), budget (18), strength (6) | 51 |

- Spear is the L1 starter. Current paid unit unlock milestones are Sword L5,
  Axe L10, Archer L25, Cavalry L35 and Monk L45. Sword's normalized
  progression is `0.1`: it is not starter-owned and must be bought on a fresh
  progression save. Existing `battle-progression-v8` saves can retain prior
  Sword ownership.
- For the vertical shop timeline, use runtime offers from `LevelSettings`,
  grouped as `Army`, `Army Power`, and `Cards`; do not mirror a static
  per-level list. CP/Max Alive and card-upgrade placement are generated from
  dynamic total-level/progression-end/boss-pace settings.
- Inspector ownership: `LevelSettings` owns unit progression, unlock-cost
  multiplier, generated CP/Max Alive schedules and economy. `BattleCardDatabase`
  owns card definitions and card rank data. `BattleUnitDatabase` owns base
  unit stats/CP; unit unlock price is derived from CP times the LevelSettings
  multiplier.

## Hero upgrade status (design only)

- No hero-upgrade package/system is implemented.
- Candidate approved only as a design direction: one deterministic **Hero
  Training** track with 10 ranks at L5,10,...,50. Each rank would give a small
  combined HP and damage increase; a working candidate is +2.5% Max HP and
  +1.5% Damage per rank (full: +25% HP, +15% damage).
- If implemented, enemy needs an expected Hero Rank by level, bot purchase
  simulation and the guaranteed-win economy audit must include the package,
  and telemetry must record player/enemy hero ranks and multipliers. Do not
  add active skills, revive, healing, crowd control, or speed effects in the
  first hero version because hero death immediately ends the battle.

## Combat, reset and telemetry correctness

- Hero death resolves battle immediately and freezes movement/damage. Hero-line
  completion is fallback win condition. Despawn clears pooled target references.
- `GameManager.onHeroKilled` now emits distinct reasons:
  `player-hero-killed`, `enemy-hero-killed`, and `boss-hero-killed`. This
  2026-08-20 change makes final-boss kills unambiguous in telemetry/audits.
- Telemetry schema v2 has campaign run ID, monotonic battle index,
  non-cumulative actions and unique action IDs. Actions record purchases,
  fees, Gold x2 and cooldown ads with before/after gold, source and reason.
- `preBattlePurchases` resets per preparation. Purchases before routing to side
  are intentionally carried into following side report. `botSimulationEvents`
  is capped diagnostic save history; never sum it across reports.
- A main report with empty runtime `config.cards` but populated saved
  `enemyCardIdsByLevel` is a reset/configuration anomaly, not balance evidence.
  `configureEnemyBattleCards` must rebuild an empty stale cached deck when
  eligible candidates exist. Side mission is the legitimate empty-card mode.

## Telemetry audit baseline

- 2026-08-16 reports predate deterministic rewards and are not economy
  baseline. Reports without telemetry v2 cannot accurately count cooldown ads.
- The 2026-08-19 09:50–10:42 batch reached L60. Its boss deck-mirror results
  and valid L35 result support policy. L10 side farming before acquiring a
  missing boss card was valid preparation, not a fee hardlock. One empty/empty
  L10 runtime deck is excluded as a reset anomaly.
- 2026-08-20 reports exposed final-boss telemetry ambiguity. Future audits
  must treat `boss-hero-killed` as terminal boss win and ensure no subsequent
  retry follows that completion.
- Do not tune reward, fee, side reward or ad limits just to smooth win rate.
  First classify loss: meaningful power/card gap versus small gap/equal-deck
  combat variance.

## Economy visualization (analysis-only)

- Old static chart path redirects to:
  `C:\Users\CPU\.codex\visualizations\2026\08\05\019fd124-855e-7140-8e3c-fe3489442ac9\battle-gold-economy-dynamic.html`.
- It has runtime sliders for Total Levels, Progression End and Boss Pace. It
  recalculates main/side reward, fee, package schedule and non-negative planned
  cumulative balance without battle runtime or telemetry.
- It is an explanatory source-config model, not authoritative simulation and
  never writes game state. For exact runtime answers, use `LevelSettings`.

## Key source map

| Concern | Source |
| --- | --- |
| Scene values | `assets/Battle.scene` |
| Progression/economy/shop/ads/bot/telemetry ledger | `assets/scripts/LevelSettings.ts` |
| Combat/reset/winner/export | `assets/scripts/GameManager.ts` |
| Card data / strength targets | `assets/scripts/BattleCardDatabase.ts` |
| Card runtime / budget consumption | `assets/scripts/BattleCardRuntime.ts` |
| Unit combat / targets | `assets/scripts/Unit.ts`, `assets/scripts/UnitBehavior.ts` |
| Combat telemetry export | `assets/scripts/BattleTelemetry.ts` |

## Verification and next work

- After card/data edits, inspect `BattleCardDatabase.ts`, `Battle.scene`, and
  eligibility for both sides. After economy/progression changes, inspect offer
  schedule, fee affordability, and action ledger through all main levels.
- `npx tsc --noEmit -p tsconfig.json` and `git diff --check` passed after the
  2026-08-20 pace fix. Full Cocos diagnostics can include pre-existing
  editor/engine noise.
- For boss audits compare saved enemy IDs, runtime cards and player selected
  cards. Inspect `boss-deck-mirror`, `prepared-deck-threshold`,
  `pre-battle-preparation`, and `complete-preparation-target` actions first.
- Before removing a future `.git/index.lock`, verify it is stale and no Git
  process is active. Do not delete Cocos generated files to make status clean.
