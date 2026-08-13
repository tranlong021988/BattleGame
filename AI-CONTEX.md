# BattleGame handoff

Last updated: 2026-08-13. This handoff records the accepted design and recent
implementation. **Runtime source and `assets/Test.scene` are authoritative if
they conflict with this file.** Do not reinstate old mechanics from this file
without checking source first.

## Current override: runtime transition, economy, side mission, and cooldown-card ads (2026-08-13)

This section is the current implementation summary; source remains authoritative.

- Worktree remains intentionally dirty. Current authored files are
  `assets/scripts/LevelSettings.ts`, `assets/scripts/GameManager.ts`,
  `assets/Test.scene`, and this handoff;
  do not clean generated `library/`, `temp/`, or `profiles` outputs.
- `Test.scene` currently has `totalLevels = 60`, `progressionEndLevel = 50`,
  boss CP multiplier `1.05`, boss Max Alive multiplier `1`,
  `allowAdsRescue = true`, `winGoldPerEnemyCP = 1.15`, boss gold multiplier
  `1.15`, `mainBattleEntryFeeRatio = 0.35`, and `initialPlayerGold = 1000`.
- Save key remains `battle-progression-v8`; progression state schema is v10
  and migrates v8/v9/v10. Do not bump the key without a real incompatible save
  change.

### Runtime battle transition (implemented 2026-08-13)

- Normal campaign progression no longer changes battle parameters through the
  page URL or reloads the browser after each result.
- `LevelSettings` saves the next `currentLevel` and `sideMissionActive` in the
  existing progression local-storage state. `GameManager` is the sole owner of
  the post-battle sequence: it requests telemetry export, then schedules the
  browser-independent scene reset through `LevelSettings.resetBattle()`.
  `resetBattle()` calls Cocos `game.restart()` rather than resolving a scene
  name itself. This is required because Preview's launch Scene can be unnamed
  and the project has multiple registered scenes. Cocos resets and destroys
  the old director scene, then reloads its own configured launch scene; no
  browser reload occurs and local-storage progression, purchases, gold, and
  card state remain intact.
- This route was manually tested successfully on 2026-08-13 after fixing an
  existing teardown bug in `GameManager.unregisterWaveBannerCameraEvents()`:
  it must only call `.off()` while the subscribed component/node is still
  `isValid`. Do not revert that guard; `game.restart()` destroys the old scene
  and otherwise throws repeated `Cannot read properties of null (reading 'off')`
  errors during `GameManager.onDestroy()`.
- A fresh Preview start (no telemetry-level URL query and not an internal scene
  reset) clears the progression save, so each Preview begins from a clean run.
  Internal scene resets are marked in runtime and therefore keep the save.
- Telemetry-batch URL queries are now only read when progression is disabled
  for a legacy telemetry/debug session. They cannot override normal campaign
  state; local storage is the source of truth.
- When a normal campaign ends (or automatic progression is disabled),
  `GameManager` now stops instead of falling through to its legacy browser
  reload path.

### Main economy (implemented)

1. The first main progression battle is free. Every later main battle charges
   `ceil(mainWinGold(level) * mainBattleEntryFeeRatio / 50) * 50`. Side missions
   are free.
2. Bot purchase simulation reserves the next main entry fee both immediately
   after the previous result and immediately before battle. This prevents the
   old bug: win -> spend fee on upgrades -> forced farm purely to enter main.
3. A main win rolls Gold or Gold x2 with ad (50/50 in bot simulation when
   `allowAdsRescue` is true); x2 adds one `adsReward`.
4. Main reward is dynamic, not level-fixed. Base reward is enemy baseline CP
   times `winGoldPerEnemyCP` (and boss multiplier on bosses). It is raised when
   needed so current gold plus reward covers the *next* entry fee and one
   cheapest current bot-priority purchase, rounded up in 50-gold steps:
   `max(baseReward, ceil(max(0, nextFee + targetCost - currentGold)/50)*50)`.
   It guarantees one purchase plus entry, not every outstanding package.
5. Old loss gold/free-package/video rescue is removed. Do not restore
   `lossGoldRatio`, `grantLossGold`, `applyVideoRescue`, or the previous
   one-off rewarded-ad purchase rescue.

### Side-mission farming branch (implemented)

- Current test gate: only when bot has an unaffordable currently offered
  purchase, it rolls 50/50 progression versus a side mission. Real future UI
  must expose side mission at all times; this gate is only simulation scope.
- The same current Cocos scene resets with `sideMissionActive` persisted in the
  progression save. Enemy copies player unit unlock/count, initial CP, and Max
  Alive; it uses enemy baseline accuracy for that progress point. No boss
  multiplier and no cards for either side.
- Side win reward is the current level's main-win baseline, rounded up to 50,
  then halved for each consecutive prior side win at that level (with a
  50-gold floor): 100%, 50%, 25%, ... . Gold x2 ad rolls on this already
  reduced reward. It no longer adds purchase costs into side reward, avoiding
  a reward spike when the player chooses not to buy the intended package.
- `consecutiveSideWins` increments only on a side win, does not reset on a
  side loss, and resets when any main battle resolves. It is exposed in the
  player telemetry snapshot and old saves default it to 0.
- After either side win or loss, bot rolls side again vs main. Chance is
  `min(0.85, 0.25 + 0.15 * min(4, delayedPurchaseCount))`.
- **Critical ordering:** On side win, `delayedPurchaseCount` must be measured
  before the reward is granted. This was fixed on 2026-08-13. Counting after
  reward made every chance collapse to 25%.
- Events are persisted (latest 40) in `botSimulationEvents`: `side-mission-entry-roll`,
  `side-mission-win-route-roll`, `side-mission-loss-roll`,
  `main-entry-fee-paid`, and `main-entry-fee-insufficient`.

### Card cooldown ads (implemented)

- Human-facing API is `tryFinishCardCooldownWithAd(cardId)`; call it only after
  real rewarded-video success. It completes that owned card's cooldown and
  increments `adsReward`.
- Bot card simulation rolls all owned eligible cards. Ready cards always enter
  the candidate pool. Each cooling card independently has **50%** chance to
  enter it, simulating user hesitation to watch an ad. If such a card is
  actually selected, bot uses exactly one ad to complete cooldown and use it;
  if not accepted, it is absent and ready alternatives can fill the deck.
- Event is `card-cooldown-finish-ad`. It is created during pre-battle setup,
  so it may appear in a later telemetry report's `before` state rather than in
  the result `after - before` delta. Do not misdiagnose it as inactive using
  only result deltas.
- Card deck capacity remains 3 today but is a dynamic future upgrade hook.
  Enemy uses predefined, per-level locked decks and has no card cooldown.

### Telemetry evidence / next validation

Latest user batch: `battle-telemetry-2026-08-12T17:56--18:48` (141 reports).

- Cleared L1--L60: 92 main (60 wins / 32 losses), 49 side (28 wins / 21
  losses), final gold 16,536, final ads 262.
- Prior batch had 82 side battles in 168 reports. The reduction is meaningful,
  but side frequency is not yet declared balanced.
- No new `main-entry-fee-insufficient` event occurred: the entry-fee reserve
  plus dynamic reward floor solved the observed win-then-cannot-enter loop.
- The supplied batch still showed side continuation `delayedPurchaseCount = 0`
  and chance 25%; that revealed the pre-reward ordering bug now fixed. A fresh
  run must validate nonzero delayed counts and higher continuation chances.
- Result-level ads delta saw 40 Gold x2 claims. The remaining final ad count is
  consistent with pre-battle card completions; inspect persistent event history
  to audit it.

Required fresh telemetry checks:

1. No main win followed by fee-only side farming.
2. Side route chance increases above 25% whenever pre-reward delayed count is
   nonzero.
3. Cooling cards are selected/ad-completed at roughly half the opportunity
   rate, while ready cards remain selectable.
4. Side mission remains intentional economy/engagement rather than a hard lock.

### Delta since receiving the prior handoff (2026-08-13)

The following work happened after this agent received the previous handoff.
It is already reflected in `LevelSettings.ts`; keep this list so a new agent
can separate completed work from open decisions.

- Implemented main battle entry fee, dynamic main reward floor, Gold/Gold x2
  claims, side-mission transition loop, side-mission mirror setup, and telemetry
  events. Removed the old loss-gold/free rescue logic.
- Fixed the ordering bug where side continuation counted delayed purchases
  after side reward. It now snapshots the count before the reward.
- Changed bot card choice so ready cards are always eligible, while each
  cooling card has an independent 50% chance of being offered to the bot; a
  selected cooling card spends one ads completion.
- Investigated Cocos error at 2026-08-13 02:08:59:
  `UNKNOWN: unknown error, open ...targets/preview/chunks/f8/...js`.
  This was a transient preview packer/cache access failure, not a TypeScript or
  gameplay regression. Source compiled, and both editor/preview chunks later
  existed. If it returns, stop Preview and restart Cocos before touching source.
- Removed stale empty `.git/index.lock` after verifying no Git process was
  running. Git status and source checks now work normally.

#### Latest validation run: 2026-08-13 03:50--04:23 (86 reports)

- Cleared L1--L60: 80 main battles (60 wins / 20 losses) and 6 side missions
  (5 wins / 1 loss). Overall: 65 wins / 21 losses = **75.6%**; main 75.0%;
  side 83.3%; final gold 17,878; final ads count 191.
- No `main-entry-fee-insufficient` event. The previous fee-only side-farming
  loop did not recur.
- Dynamic side continuation was verified: delayed counts 3, 2, and 1 produced
  70%, 55%, and 40% continuation chances respectively. This confirms the
  ordering fix works.
- Latest retained telemetry history contained 21 `card-cooldown-finish-ad`
  events (mostly late-game), proving the cooldown-ad route is active. Result
  deltas alone only saw 38 Gold x2 claims because card ads occur in pre-battle
  setup.
- Early side mission plus Gold x2 can create intended large spikes (e.g. L1
  3,000 and L11 2,400). User accepts this as ads monetization; do not nerf it
  unless asked.

## Start here

- The worktree is intentionally dirty. Preserve unrelated user/Cocos changes;
  never stage, reset, revert, or delete generated `library/`, `temp/`, or
  `profiles/` content without explicit permission.
- `assets/Test.scene` contains deliberate user tuning: `totalLevels = 60`,
  `progressionEndLevel = 50`, boss initial CP multiplier `= 1.05`, boss Max
  Alive multiplier `= 1`, `allowAdsRescue = true`, and starter gold `= 1000`.
  This is intentional: levels 51--60 should let players
  enjoy their acquired power, not force everything to finish exactly at L60.
- Current authored changes are uncommitted. Meaningful source work is in
  `LevelSettings`, `BattleCardDatabase`, `BattleCardRuntime`, `GameManager`,
  `Unit`, `UnitBehavior`, and `Test.scene`. Scene changes include user tuning;
  do not treat all scene diff as Codex-owned.
- Update this file only when the user asks for a handoff.

## Available skills / working style

Use `cautious-coding` for every code change. Use:

- `game-systems-design` before designing mechanics;
- `game-design-consistency` for cross-system audits;
- `game-balance-check` for telemetry and balance conclusions;
- `game-balance-regression` after a mechanics/economy/progression change;
- `cocos-performance-optimize-skills` for mobile or large-unit performance.

These skills are already available in this Codex profile. The repository also
has `BattleGame-Codex-Skills.zip` for transferring the first five game skills
to another Codex. No specific missing skill is currently blocking work.

The user prefers causal, dynamic solutions and few Inspector knobs. Do not add
a new tuning parameter to mask one telemetry result. Telemetry validates a
mechanic; it must never become runtime input.

## Primary locations

| Area | Runtime authority |
| --- | --- |
| Campaign, save, economy, shop, unit progression, bot purchase AI, ads | `assets/scripts/LevelSettings.ts` |
| Card definitions/defaults | `assets/scripts/BattleCardDatabase.ts` |
| In-battle card budget/telemetry | `assets/scripts/BattleCardRuntime.ts` |
| Battle integration/end resolution | `assets/scripts/GameManager.ts` |
| Card effect use sites | `assets/scripts/Unit.ts`, `assets/scripts/UnitBehavior.ts` |
| Telemetry schema/export | `assets/scripts/BattleTelemetry.ts` |
| Inspector overrides | `assets/Test.scene` |

`GameManager.battleCardDatabase` must reference the scene database or decks
are empty.

## Approved campaign / progression semantics

- All progression derives from authored normalized progress plus boss pace;
  avoid hard-coded level thresholds. `totalLevels` and `progressionEndLevel`
  are deliberately separate.
- Current campaign: 60 total levels, progression ends at 50, boss pace 5.
  CP, units and Max Alive flatten after L50 until later systems create new
  sinks.
- Enemy and player progression target comparable base CP. Inspect current scene
  values rather than assuming a global enemy multiplier; the current boss-only
  multipliers are the user-set values noted above.
- Player initial CP baseline/packages reach the current L50 target of 1040;
  Max Alive reaches 10. `winGoldPerEnemyCP = 1.15`; boss reward multiplier is
  1.15. Main-loss gold/free-package rescue is retired.
- Progression save key/version remains `battle-progression-v8`; do not bump
  storage without a real incompatible schema change.

### Unit progression

`UnitProgressionRule.unlockProgression` is normalized to progression end and
aligned to a boss. Current scene rules:

| Family | Progression | Current unlock (end 50, pace 5) | Base/max count |
| --- | ---: | ---: | --- |
| Spear | 0 | 1 | 5 / 10 |
| Sword | 0 | 1 | 5 / 10 |
| Axeman | .2 | 10 | 5 / 10 |
| Archer | .5 | 25 | 3 / 5 |
| Cavalry | .7 | 35 | 5 / 10 |
| Monk | .9 | 45 | 1 / 1 |

Enemy receives each eligible unit/count at its milestone. Player sees the
matching new unit and newly opened older-unit count choices before that battle;
the bot can buy only if it has gold. Current player count caps after L45 are
Spear 9, Sword 9, Axe 8, Archer 5, Cavalry 6, Monk 1. They intentionally do
not force max count at progression end.

Unit price is `round(combatPointCost * unitUnlockCostMultiplier)`. Current
multiplier is 5: Axe 370, Archer 130, Cavalry 485, Monk 245. Do not restore the
old multiplier 20 or add a pre-level gold reservation without user direction.

## Battle cards

- Deck capacity is currently 3, but its calculation is intended to be dynamic
  so a future deck upgrade system can raise it. Do not hard-cap future design
  at 3 in scattered code.
- Cards activate at battle start and use event-budget charges, not duration or
  CP-threshold triggers. At zero budget, a card deactivates immediately.
- Consumption: damage per attack batch; defense/counter immunity per protected
  defender; radius per batch that uses its extra radius. Multiple matching cards
  each consume their charge.
- A player card put into a battle deck always starts cooldown when that battle
  ends, even if it spent zero budget. A card left out of the deck is unaffected.
  Cooldown advances after completed battles. Cooldown ranks 0..2 reduce
  effective cooldown by one, minimum one; budget ranks 0..2 are 1.0x/1.4x/1.8x.
- Eligibility is roster/opponent-aware. Anti-Cavalry requires enemy Cavalry;
  Counter Breaker requires an actual counter threat. Enemy card decks lock per
  level in `enemyCardIdsByLevel`, so retries never reroll them.
- Enemy card count is dynamic by progression: normal levels use a small deck,
  bosses may use one more, maximum 3. No arbitrary per-level hard list.
- Card unlocks/upgrades follow card waves/unit availability dynamically. Do not
  activate or sell a card for a unit/threat that does not exist for the relevant
  side.

Current cards: General Offensive, Battle Shields, Anti-Cavalry Spearhead, Axe
Frenzy, Sword Wall, Arrow Suppression, Precise Range, Wide Prayer, Counter
Breaker.

### Precise Range and ranged kiting (implemented 2026-08-12)

- `Precise Range` targets both Archer and Monk (`Ranged` target), not Archer
  only. While budget remains, it grants +8% attack range and +8% move speed.
  Move speed affects all agent movement, including approach, kite, and ranged
  reposition.
- Every Archer/Monk attack batch consumes one Precise Range budget while the
  card is active, regardless of target distance. This deliberately replaced the
  old added-range-band-only consumption rule.
- Ranged units begin kiting below 50% of effective range and continue until
  they regain 100% of effective range (previously 70%). The effective range
  includes active card modifiers, so Precise Range shifts both thresholds.
- `MoveSpeedPercent = 6` was added to `BattleCardModifier`; Precise Range uses
  it as its second modifier. Inspector scene data was synchronized; do not rely
  on code defaults to overwrite serialized card values.
- Arrow Suppression's -8% range still cancels Precise Range's +8% range on
  Archers when both are active. Precise Range still provides its +8% speed and
  spends one charge per ranged attack in that case.

## Combat resolution

- Battle ends immediately when either hero dies: enemy boss/hero death is a
  player/bot win; player hero death is a loss.
- The hero line is the original static player-side line. It must not follow a
  moving hero. An enemy reaching that static line is also a player loss.
- Keep these outcomes checked consistently for both sides; the previous bug
  delayed resolution until an enemy later crossed the line.

## Validation and next direction

- On 2026-08-13, the user manually verified that battle end still downloads
  telemetry and then starts the next battle through Cocos runtime restart.
  This is the accepted replacement for browser reload.
- Source syntax transpile passed for `GameManager.ts` and `LevelSettings.ts`;
  `git diff --check` passed. The broad legacy compile command should not be
  presented as a fresh full-project test.
- Side missions and the non-ad gold-farming loop are already implemented for
  bot simulation. The next product step is to turn persistent campaign state
  into real player-facing state/UI, rather than redesigning the side loop from
  scratch.
- No controlled deterministic ads-on/off A/B or human playtest has been run.
  Do not claim ads are necessary, that a particular card caused a retry spike,
  or that post-L50 balance is validated without one.
