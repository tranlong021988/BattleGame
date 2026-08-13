# BattleGame handoff

Last updated: 2026-08-13. This handoff records the accepted design and recent
implementation. **Runtime source and `assets/Test.scene` are authoritative if
they conflict with this file.** Do not reinstate old mechanics from this file
without checking source first.

## Current override: economy, side mission, and cooldown-card ads (2026-08-13)

This section supersedes every conflicting statement below, especially the old
"Bot shop and rewarded-ad simulation" and "Likely next task" sections.

- Worktree remains intentionally dirty. Current authored files are
  `assets/scripts/LevelSettings.ts`, `assets/Test.scene`, and this handoff;
  do not clean generated `library/`, `temp/`, or `profiles` outputs.
- `Test.scene` currently has `totalLevels = 60`, `progressionEndLevel = 50`,
  boss CP multiplier `1.05`, boss Max Alive multiplier `1`,
  `allowAdsRescue = true`, `winGoldPerEnemyCP = 1.15`, boss gold multiplier
  `1.15`, and `mainBattleEntryFeeRatio = 0.35`.
- Save key remains `battle-progression-v8`; progression state schema is v10
  and migrates v8/v9/v10. Do not bump the key without a real incompatible save
  change.

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
- Browser reloads same level with `sideMission=1`. Enemy copies player unit
  unlock/count, initial CP, and Max Alive; it uses enemy baseline accuracy for
  that progress point. No boss multiplier and no cards for either side.
- Side win reward targets the cheapest one or two currently unaffordable
  bot-priority purchases, rounded to 50. It rolls Gold/Gold x2 ad exactly like
  a main win.
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

### Current telemetry evidence / next validation

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
  claims, side-mission reload loop, side-mission mirror setup, and telemetry
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

#### Open decision: beginner gold, not implemented

- Inspector currently remains `initialPlayerGold = 0`.
- User wants starter gold so a human can learn by buying and experimenting
  before being routed toward farming. Recommended next tuning value is
  **1,000 gold**, because L1 typically has CP +7 costing 70 and cards costing
  700/800/850: this permits a starter CP upgrade plus one starter card with
  some remainder. Do not claim this is implemented; change `Test.scene` only
  if the user confirms.
- A L1 telemetry snapshot had 30 gold after CP +7, despite the scene field
  being 0. Treat that as carried/query/save test state; reset progression for a
  clean test when changing initial gold.

## Start here

- The worktree is intentionally dirty. Preserve unrelated user/Cocos changes;
  never stage, reset, revert, or delete generated `library/`, `temp/`, or
  `profiles/` content without explicit permission.
- `assets/Test.scene` contains deliberate user tuning: `totalLevels = 60`,
  `progressionEndLevel = 50`, boss initial CP multiplier `= 1.05`, boss Max
  Alive multiplier `= 1`, and `allowAdsRescue = true` for the latest test.
  This is intentional: levels 51--60 should let players
  enjoy their acquired power, not force everything to finish exactly at L60.
- Current authored changes are uncommitted. Meaningful source work is in
  `LevelSettings`, `BattleCardDatabase`, `BattleCardRuntime`, `GameManager`,
  `Unit`, `UnitBehavior`, and `Test.scene`. Scene changes include user tuning;
  do not treat all scene diff as Codex-owned.
- The old rescue/ad code was removed from source in this session. Do not clean
  generated assets merely because the worktree is noisy.
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
  1.15; valid loss reward is 10% of that level's win reward.
- Progression save key/version remains `battle-progression-v8`. Old saved
  `rescueHistory` data is harmlessly ignored; do not bump storage just to
  remove an unused saved key.

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

## Bot shop and rewarded-ad simulation (latest implementation)

Team A is a simulation of an eventual player while `purchasingSimulation` is
enabled. The real player UI/SDK is not implemented by this simulation.

`allowAdsRescue` is an Inspector checkbox, default `true` in code and currently
`false` in `Test.scene`. It gates only the simulated rewarded ad that grants
gold for one currently available, unaffordable purchase. When false, the bot
must earn gold by winning/retrying. It does not gate the separate public
`tryFinishCardCooldownWithAd()` hook, which remains for future real player UI.

1. Before battle, current-level unit offers are created, then the bot buys all
   normally affordable, eligible purchases.
2. It shares one candidate list for normal buying and ads. The list respects
   package availability, current-level unit priority, baseline CP/Max Alive
   needs, card-unlock priority, and cooldown priority. Budget upgrades are no
   longer blocked merely because an unaffordable cooldown upgrade exists.
3. If a useful candidate is unaffordable, the bot may simulate **one** rewarded
   video for that preparation. Chance is a fixed derived rule, not Inspector
   data: 20% base, higher after losses and when CP/Max Alive trail the enemy,
   capped at 80%.
4. The gold reward is exactly enough for the chosen target, rounded up to a
   pleasant multiple of 50 (minimum 50), then the target is bought immediately.
   Telemetry writes two records: `rewarded-ad-gold:<target>` followed by the
   actual purchase with source `rewarded-ad`.
5. A regular second purchase pass spends any rounding remainder. Ads grant only
   gold; they never gift a free package or rank. Multiple ads can occur across
   separate retries of the same level, but not twice in one preparation.

The user explicitly accepts occasional early ads as a realistic player's
"anxiety relief" behavior and a monetization hook. Do not remove the 20% base
chance unless asked. The retired `lossesPerVideoReward`, boss-only rescue,
`applyVideoRescue`, `rescueHistory`, and free-package rescue behavior must not
be reintroduced.

Ads never unlock a future milestone: ad selection uses the same purchase
candidate list as normal buying. CP/Max Alive packages require
`offerLevel <= currentLevel`; therefore in L21--L25 it can only fund packages
offered for the L25 baseline, never L30. It funds one selected eligible target,
not necessarily every remaining package of the current boss baseline.

## Latest telemetry evidence

### Pre-ad schedule fix: 2026-08-11 09:09--09:41 (99 reports)

- 60 wins / 39 losses (60.6%). L12 player CP 436 vs enemy 427 after the schedule
  fix; L26 678 vs 653. Earlier deficits at these levels were fixed by distributing
  CP/Max Alive offers earlier and evenly in each interval.
- The remaining issue was affordability, not unavailable offers: e.g. L11 had
  a visible CP +41 package costing 410 with only 73--167 gold.
- Post-L50 retries were largely combat/card variance because baseline CP had
  already flattened at 1040; this is consistent with the intentional L50 end.

### Rewarded-ad run: 2026-08-11 10:44--11:09 (81 reports)

- 60 wins / 21 losses (74.1%). Ten rewarded ads; total ad gold 5,400, average
  540; final gold 14,906. Rounding surplus was 261 total (4.8%).
- Ads selected concrete purchases and then bought them: L16 CP +40, L36 Max
  Alive +1, L40 General Offensive budget rank 2, L46/L48 CP, L49 Precise Range
  budget rank 2, plus selected L5/L10 card actions.
- There is no evidence of a hard "must watch ad to win" gate. Some runs are
  highly suggestive (L16, L46, L48, L49 lost then ad-purchased power and won),
  but L31 still lost once after an ad and L10's first ad also lost. Proving a
  gate needs a controlled same-seed A/B run with ads on/off, especially L16,
  L46, L48 and L49. The user deferred this test.

### Ads-off baseline run: 2026-08-12 04:54--06:58 (96 reports)

- With `allowAdsRescue = false`: 60 wins / 36 losses (62.5%), completed L1--60,
  no rewarded-ad records and final ad count 0.
- This was the first evidence that ads make progression easier without being a
  hard requirement. Relative to the prior ad-enabled run (74.1%), the run is
  harder, but different random paths are not a controlled causal comparison.

### Latest combat/card run: 2026-08-12 telemetry files 07:58--09:57 (130 reports)

- `allowAdsRescue = false`, boss CP multiplier 1.05, boss Max Alive multiplier
  1.0. The campaign still cleared L1--60: 60 wins / 70 losses (46.2%).
- Bosses intentionally exceed the player's baseline CP: L50/L60 player 1040 vs
  enemy 1092. The user raised this multiplier specifically to test whether a
  full-baseline player can still reach L60. It can; no hard lock appeared.
- Major retry spikes: L10 9 losses, L37 11, L42 5, L50 5, L60 2. Treat these as
  difficulty/variance observations, not proof that cooldown is the cause. The
  bot sometimes had no ready deck, but telemetry does not prove whether that
  was caused chiefly by cooldown costs, ownership, or random selection.
- Precise Range is now consumed as designed: player selected it 15 times,
  exhausted it 13 times, 94.7% aggregate budget use (previously ~0.5%). This
  validates its new attack-batch consumption; it does not by itself prove card
  strength is balanced.
- Other player card usage: Battle Shields and General Offensive 100%, Axe
  Frenzy 99.2%, Sword Wall 87.7%, Arrow Suppression 69.6%, Anti-Cavalry 66.4%,
  Wide Prayer 48%. Use controlled A/B before retuning values.

## Validation already completed

- Targeted Cocos TypeScript compile passed after the progression/ad changes:

  `node C:\ProgramData\cocos\editors\Creator\3.8.8\resources\app.asar.unpacked\node_modules\typescript\lib\tsc.js --noEmit --target ES2017 --module commonjs --strict false --experimentalDecorators --skipLibCheck assets/scripts/LevelSettings.ts assets/scripts/BattleCardDatabase.ts assets/scripts/BattleCardRuntime.ts assets/scripts/BattleTelemetry.ts assets/scripts/GameManager.ts assets/scripts/Unit.ts assets/scripts/UnitBehavior.ts temp/declarations/cc.d.ts temp/declarations/jsb.d.ts`

- `git diff --check` passed. Static checks confirmed the evenly distributed
  schedule (e.g. 11,13 and 26,28) and no remaining `applyVideoRescue` or
  `lossesPerVideoReward` source use.
- Targeted Cocos TypeScript compile also passed after the 2026-08-12 card,
  movement, and cooldown changes.
- No full deterministic A/B or human playtest has been run. Do not claim ads
  are necessary, that a particular card caused a retry spike, or that post-L50
  balance is validated, without that test.

## Likely next task

There is no active implementation request. The approved next design direction
is a **side mission / gold-farming branch** outside the main level path:

- It gives the player/bot an active non-ad way to earn gold when underpowered.
- It must only fund purchases already offered for the current progression
  milestone; it must never unlock future units/cards/packages.
- Ads should become a shortcut (for example, skip/boost the side-mission
  reward), not the only rescue path.
- Do not implement it until the user decides its mission format/reward loop.

When work resumes, first use `game-systems-design` to specify the side loop,
then `game-design-consistency` for progression/telemetry impacts, and
`game-balance-regression` for a controlled ads-on/off/side-mission comparison.
