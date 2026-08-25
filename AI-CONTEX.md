# BattleGame handoff

Last updated: 2026-08-24. `assets/Battle.scene` and TypeScript source are
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
| Main reward flat bonus | 650 gold per main battle |
| Win gold per enemy CP / boss gold multiplier | 1.15 / 1.15 |
| Player Initial CP / Max Alive | 300 / 4 → 10 |
| Deck capacity | 3 |
| Main entry-fee ratio | 0.35 |
| Side reward fee multiplier | 0.65 |
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
- A main battle must not enter with an empty deck when the bot owns an eligible
  card. The selection chain is: ready eligible cards, then owned eligible cards
  with a necessary cooldown ad, then an emergency owned-card fallback. Side
  missions intentionally have no cards. Player-facing cooldown ads have no
  hard per-battle cap; any one-card limit is bot choice only.
- Equal CP/deck does not require a win. Such losses are valid combat variance,
  not automatic economy or card regressions.

## Economy, ads and side missions

- Main reward plan is deterministic/cached per total-level count. It is
  strictly increasing by at least 50, starts from level-scaled win gold, then
  smooths funding for **one** important next-level purchase plus the next
  entry fee. The scene-controlled 650 flat bonus is added afterwards to every
  reward and remains rounded to 50.
- Do not reintroduce a plan that funds every visible offer: several cards at
  L2 create a spike that permanently distorts a monotonic curve.
- Runtime logic is dynamic for total levels, progression end and pace. Changing
  those values within an existing save is not a migration path; use fresh
  preview/reset for a new configuration.
- L1 entry is free. Later fee uses previous main reward:
  `max((level - 1) * 50, ceil(previousReward * 0.35 / 50) * 50)`.
- Side reward is `max(50, ceil(current main entry fee * 0.65 / 50) * 50)`,
  does not decay, has no cards/boss bonus, mirrors player roster/CP/Max Alive,
  and advances cooldowns.
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

### Scanner-led Free Hunt (authoritative combat direction, 2026-08-25)

The purpose is to stop every free unit from independently nearest-searching
and scattering across the map. A wave has one shared strategic order
(`targetWave`) plus independent local combat. This is deliberately not a
formation lock: it gives idle allies a common direction while protecting units
already fighting.

- **Scanner selection:** keep the existing dynamic frontmost-unit rule. In
  Forward, scanner must still be `onForward`; in Free Hunt, use the frontmost
  alive unit regardless of `onForward`. Do not turn scanner into a permanent
  captain or add a second scanner system.
- **Scanner authority:** scanner performs strategic search only when its wave
  has no live `targetWave`. It chooses one enemy wave. While that target wave
  remains valid, scanner must not continuously search for a better wave or
  overwrite the order.
- **Borrowed targets:** idle non-scanners do not globally nearest-search. They
  borrow a valid target only from the current `targetWave`. Each can select a
  different unit within that enemy wave, so they may spread naturally, but do
  not fan out toward unrelated waves.
- **Local combat remains unrestricted:** attack-range collision and retaliation
  are per-unit. Any enemy in direct attack range is valid, and a ranged hit may
  cause only the hit unit to retaliate/chase locally. A unit already `onBusy`
  ignores a new ranged hit for targeting and does not abandon its current
  combat.
- **The only passive retarget event:** when a unit actually transitions to
  `onBusy`, its enemy's wave immediately replaces its own wave's `targetWave`.
  This may replace a still-living targetWave. Busy allies continue their own
  combat; only idle allies are immediately primed to join the newly engaged
  wave. Multiple near-simultaneous engagements may therefore retarget in
  sequence; that is intentional for this narrow battlefield.
- **Do not retarget on projectile impact alone:** `Unit.reactToAttacker()` is
  local chase setup only. It must not call `GameManager.onWaveCombatStarted`.
  The wave event is emitted only after `onBusy = true` in the direct-range and
  steady-guard combat transitions.
- **Target loss and Forward:** `targetWave` clears when released or dead. With
  no targetWave, scanner may make one new strategic search. If it confirms no
  target and every surviving unit is idle and has no valid local target, the
  wave resumes Forward. A local chase that never reaches combat therefore does
  not lock the rest of the wave.
- **Immediate transitions:** whenever a wave gains/replaces `targetWave` while
  already in Free Hunt, prime every idle unit with its nearest live unit in
  that target wave and set its preferred velocity immediately. Do not wait for
  each unit's next search interval. Likewise, an aggressive Forward wave that
  passes a known adjacent enemy wave must carry that scanner target into
  `onWaveForwardTargetFound`; only fall back to targetless Free Hunt when the
  adjacent target is gone/invalid.
- **Performance boundary:** strategic nearest search is one scanner per wave,
  not one search per idle unit. Per-unit attack-range checks and local
  retaliation remain necessary combat work and are intentionally retained.

Implementation ownership:

| Responsibility | Source | Required invariant |
| --- | --- | --- |
| Scanner identity, targetWave lifetime, borrowed-wave filtering and immediate idle-unit priming | `BattleWave.ts` | Scanner cannot replace a live order; an actual engagement can. |
| Forward/Free Hunt transition, adjacent-lane fast path and engagement event routing | `GameManager.ts` | `onWaveCombatStarted` receives an already-busy initiating unit; it does not manufacture a symmetric target order for a unit that is not busy. |
| Direct range -> `onBusy`, local retaliation/chase, scanner-only strategic search | `Unit.ts` | Receiving damage while free is not itself a wave-retarget event. |

Common regressions to reject:

1. Reintroducing `onWaveCombatStarted()` from `reactToAttacker()`.
2. Blocking scanner/retarget decisions merely because another ally is busy.
3. Letting scanner overwrite a valid live `targetWave` without a real
   `onBusy` engagement.
4. Releasing from Forward with a known adjacent target but waiting for a later
   Free Hunt search tick before setting velocity.

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

## Telemetry issue-classification contract

Apply these rules before proposing any balance change. They are based on the
2026-08-24 audit and prevent false positives.

1. Group reports by telemetry `runId` and sort by `battleIndex`; do not infer a
   run from filenames or Windows modified time. Filenames are UTC (`Z`), while
   Explorer shows local UTC+7 time.
2. The protected flawless-run contract is: L1->60, always win, no side and no
   Gold x2, must pay every main fee and buy every package when it is offered.
   The audit must include unit unlock/count, CP, Max Alive, card unlock,
   cooldown, budget and Strength packages. A failure here is a design issue.
3. For an actual main battle, compare the *pre-battle runtime values* of CP,
   Max Alive, and every enemy-unlocked unit count. CP alone is not a baseline.
   Boss multipliers are already reflected in runtime enemy values and must not
   be guessed from the normal-level curve.
4. A main loss with player baseline at or above enemy baseline is combat/card
   variance, not an economy defect. A small CP difference that cannot fund an
   additional unit is also not, by itself, a meaningful imbalance.
5. If player baseline is below enemy, trace prior main losses and the gold
   ledger. A shortfall caused by earlier losses is an intended side-recovery
   case, provided the flawless-run contract passes. It is a defect only when
   the flawless run fails, an entry action has `goldBefore < cost`, or the bot
   had enough gold but declined a relevant opened baseline package.
6. Empty cards are valid only in side missions or before any card is owned. A
   main battle with ready eligible owned cards but no selected player card is a
   card-selection regression. Do not flag normal side empty decks.
7. Frequent cooldown-skip ads are desirable when a needed card is cooling; do
   not tune them down merely for count. Gold x2 is only meaningful when the
   telemetry action is `reward-gold-x2-ad`: zero Main x2 alone is not a bug if
   the run wins frequently, while side x2 after losses is expected recovery.

Latest reference run: `run-mt64po40-0wm1dcj`, 79 battles, filenames
2026-08-23T18:17Z..18:40Z (local 01:17..01:40 on 2026-08-24). It used the
650 bonus and finished L60: main 60W/10L, side 7W/2L, all 104 packages bought,
no unpaid main entry and no baseline deficit. Gold x2 was Main 0 / Side 5;
the five side ads crossed concrete entry or purchase+entry thresholds. There
were 26 cooldown ads and no invalid empty main deck. Treat this as HEALTHY,
not evidence that Main reward should be reduced further.

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
