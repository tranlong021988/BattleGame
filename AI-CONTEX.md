# BattleGame handoff

Last updated: 2026-08-14. This document is a navigation and decision record,
not a second source of truth. **Current TypeScript and `assets/Battle.scene`
win whenever this document conflicts with them.** Check source before changing
an established mechanic.

## Read this first

- The current campaign scene is `assets/Battle.scene`. Build profiles point to
  it. Do not use the old scene names in new work.
- The worktree is intentionally dirty, including Cocos-generated `library/`,
  `temp/`, and `profiles/` changes. Preserve unrelated user/Cocos changes;
  never clean, reset, stage, or delete them without explicit permission.
- `MainGameFlow.ts` exists but is **not attached to `Battle.scene` and has no
  runtime caller**. It is an unused experiment, not the current game flow.
  Leave it untouched unless the user explicitly asks to resume or remove it.
- The campaign now resets the battle internally. It does not normally reload
  the browser, restart the Cocos game, or reload a scene after every result.
  Some method/property names retain legacy wording; see “Runtime lifecycle”.
- Update this handoff only when the user explicitly asks.

## Current authored scene configuration

`assets/Battle.scene` currently sets:

| Setting | Current value |
| --- | ---: |
| Total levels | 60 |
| Progression end level | 50 |
| Boss pace | 5 |
| Boss initial-CP multiplier | 1.05 |
| Boss Max Alive multiplier | 1 |
| Starter gold | 1,000 |
| Deck capacity | 3 |
| Win gold per enemy CP | 1.15 |
| Boss gold reward multiplier | 1.15 |
| Main-entry-fee ratio | 0.35 |
| Rewarded-ad simulation enabled | true |

The save key is `battle-progression-v8`; the stored progression schema is
version 10. Do not change either without an actual incompatible save change.

## Runtime lifecycle: current implementation

`GameManager` owns live battle state. At a result it exports telemetry, then
asks the progression provider (`LevelSettings`) to start the next internal
battle. The normal route is:

```text
result -> save next campaign state -> telemetry download/delay
       -> LevelSettings.resetBattle()
       -> GameManager.stopBattleRuntime()
       -> reapply saved progression/pre-battle purchases
       -> GameManager.startBattleRuntime()
```

- `stopBattleRuntime()` unregisters events, returns/despawns units, clears
  combat arrays/maps/simulation/card runtime, and resets the spatial grid.
- `startBattleRuntime()` rebuilds battle state and reinitializes spawners,
  heroes, telemetry, cards, and runtime components.
- Dynamic spawned combat content lives under `BattleRuntime`; scene-authored
  nodes such as heroes, terrain/floor, and future landscape/UI remain outside
  that transient container.
- `resetBattleRuntimeComponents()` calls `resetForNewBattle()` where a live
  component exposes it. Do not add hidden global state that bypasses this
  cleanup path.
- `autoReloadProgression` and `scheduleBattleTelemetryPageReload()` are legacy
  names. With a valid progression provider they mean internal reset after the
  telemetry delay, **not** browser/page reload. Browser reload is only a
  legacy fallback when no progression provider exists (for example progression
  disabled debug usage).
- A fresh normal Preview load clears campaign state through `LevelSettings`
  `onLoad`; an internal reset preserves the saved campaign state. Legacy URL
  level parameters are only applied when progression is disabled.

Do not reintroduce `game.restart()` or `director.loadScene()` as the ordinary
between-battle transition. They were investigated because repeated full resets
caused costly loading and teardown failures. A future persistent UI should
read/write progression state while this Battle runtime resets beneath it, not
replace the current reset mechanism by default.

## Primary source map

| Area | Runtime authority |
| --- | --- |
| Inspector values and scene-owned nodes | `assets/Battle.scene` |
| Campaign state, saves, shop/economy, unit progression, ads, side simulation | `assets/scripts/LevelSettings.ts` |
| Live battle setup/teardown, end resolution, hero lines, telemetry sequence | `assets/scripts/GameManager.ts` |
| Card definitions/defaults | `assets/scripts/BattleCardDatabase.ts` |
| Card budgets, activation and battle telemetry | `assets/scripts/BattleCardRuntime.ts` |
| Unit/card effect use sites | `assets/scripts/Unit.ts`, `assets/scripts/UnitBehavior.ts` |
| Telemetry model/export | `assets/scripts/BattleTelemetry.ts` |

`GameManager.battleCardDatabase` must reference the scene database; otherwise
decks are empty.

## Campaign and unit progression

- Progression is derived from normalized progress and boss pace. Avoid
  hard-coded level thresholds. `totalLevels` and `progressionEndLevel` are
  deliberately independent.
- Unit unlock progress is normalized against `progressionEndLevel`, then
  aligned to the next boss stage. Current scene rules are Spear/Sword at 0,
  Axeman .2, Archer .5, Cavalry .7, Monk .9.
- Base count/max count: Spear 5/10, Sword 5/10, Axeman 5/10, Archer 3/5,
  Cavalry 5/10, Monk 1/1. Unit price is
  `round(combatPointCost * unitUnlockCostMultiplier)`; current multiplier is
  5.
- Enemy and player use the same dynamically derived unlock/count caps. Player
  can only buy an offered upgrade when it has enough gold; bot simulation then
  chooses purchases.

### Post-progression count tail

After progression ends, remaining unit-count ranks are not abandoned. The
source calculates all count ranks still missing at `progressionEndLevel`, then
round-robins them across the regular stages strictly after that level and
before the final stage. Boss stages are skipped. No extra Inspector tuning
field or hard-coded level list is used.

With the current 50/60/pace-5 configuration, the resulting offers are:

| Level | Newly offered count rank |
| --- | --- |
| 51 | Spear 10 |
| 52 | Sword 10 |
| 53 | Axeman 9 |
| 54 | Cavalry 7 |
| 56 | Axeman 10 |
| 57 | Cavalry 8 |
| 58 | Cavalry 9 |
| 59 | Cavalry 10 |

This is why all unit counts can become maxed just before the L60 finale even
though unit progression nominally ends at L50. If no regular stage exists in
the tail, there is no valid stage on which to sell a remaining count rank.

## Economy, side missions, and rewarded ads

### Main battles

1. The first main battle is free. Later main entry fee is
   `ceil(mainWinGold(level) * mainBattleEntryFeeRatio / 50) * 50`.
2. Bot purchase simulation reserves the next main entry fee after a result and
   before battle, avoiding the old “win, spend fee, forced farm just to enter”
   loop.
3. Main baseline reward uses enemy baseline CP × `winGoldPerEnemyCP`, with the
   boss reward multiplier on bosses. It is raised, in 50-gold steps, only as
   needed to cover the next entry fee plus one current bot-priority purchase.
   It does not guarantee every outstanding upgrade.
4. Loss-gold, free-package rescue, and automatic video rescue that granted a
   package are retired. Do not restore `lossGoldRatio`, `grantLossGold`, or
   `applyVideoRescue` without a new design decision.

### Rewarded ads

- `allowAdsRescue` permits bot simulation to choose a Gold ×2 rewarded claim;
  it does not unlock future milestones or grant an upgrade package.
- Bot simulation rolls the Gold ×2 claim at 50%. Human UX must invoke the
  equivalent only after a real rewarded-ad success.
- `tryFinishCardCooldownWithAd(cardId)` is the human card-cooldown API. It
  requires an owned card that is actually cooling and must likewise be called
  only after the external ad callback.

### Side missions

- Side entry is free. In current bot simulation it is considered only when an
  offered priority purchase is unaffordable; future human UI should expose it
  as a normal optional activity.
- Side enemy mirrors the player’s unlocked units/counts, initial CP, and Max
  Alive at that progression point. It has no boss multiplier and neither side
  uses cards.
- A side reward starts from that level’s rounded main baseline then halves for
  each consecutive side win at the same level, with a 50-gold floor:
  100%, 50%, 25%, … . Gold ×2 is applied after this reduction.
- Consecutive side wins reset when any main battle resolves, not on a side
  loss. The bot’s side continuation probability is
  `min(0.85, 0.25 + 0.15 * min(4, delayedPurchaseCount))`.
- On a side win, calculate delayed purchases **before** granting reward. This
  ordering is intentional; reversing it collapses the continuation chance.

## Battle cards

- Deck capacity is currently 3 and must stay data-driven for a future deck
  upgrade system.
- Cards activate at battle start and spend event budgets, not durations or
  CP-threshold triggers. At zero budget they deactivate immediately.
- A card included in a player deck enters cooldown after that battle even if
  no eligible event spent its budget. A card left out of deck is unchanged.
  Cooldown advances after completed battles.
- Card eligibility is roster/opponent-aware. Anti-Cavalry requires enemy
  cavalry; Counter Breaker requires an actual counter threat. Enemy decks are
  locked in `enemyCardIdsByLevel`, so retries do not reroll them.
- Before progression end, card sales/ranks follow dynamic unit/card waves.
  Strictly after `progressionEndLevel`, every remaining card sale and rank is
  available through rank 2. This preserves an endgame gold sink; it does not
  bypass battle eligibility.
- Bot deck choice ranks eligible cards by current roster composition, including
  relevant unit counts, rather than merely whether a family exists. Cooling
  eligible cards independently have a 50% candidate chance; if selected, bot
  spends one cooldown ad. Ready candidates need no ad.

Current cards: General Offensive, Battle Shields, Anti-Cavalry Spearhead, Axe
Frenzy, Sword Wall, Arrow Suppression, Precise Range, Wide Prayer, Counter
Breaker.

### Precise Range and ranged behavior

- Precise Range affects Archer and Monk. While budget remains it provides +8%
  attack range and +8% move speed; movement includes approach, reposition, and
  kiting.
- Every ranged attack batch consumes one Precise Range charge while active,
  regardless of target distance.
- Ranged units kite when an enemy is below 50% of effective range and resume
  attacking only after reaching 100% of effective range. Card range therefore
  changes both kite thresholds.
- Arrow Suppression’s -8% range can cancel Precise Range’s +8% range for an
  Archer, but Precise Range still gives speed and consumes charges.

## Combat completion rules

- A hero death resolves immediately: enemy hero/boss death is player win;
  player hero death is player loss.
- Hero lines are captured from each hero’s original world position and remain
  static. They do not follow a moving hero.
- Reaching the opposing static hero line also resolves the battle. Both teams
  are checked with mirrored outcomes.
- `processBattleWinnerCondition` guards combat-resolution depth and defers
  fallback checks safely. The optional no-affordable-spawn fallback exists but
  is disabled in the current scene; it is not a normal end condition.

## Latest telemetry verification (2026-08-14)

The latest supplied run (97 reports, L1–L60) reaches L60 and confirms the
internal reset route did not introduce a progression hardlock:

| Scope | Wins / attempts | Win rate |
| --- | ---: | ---: |
| Main | 57 / 89 | 64.0% |
| Normal main | 45 / 55 | 81.8% |
| Boss main | 12 / 34 | 35.3% |
| Side | 7 / 8 | 87.5% |
| Total | 64 / 97 | 66.0% |

- All post-progression unit-count offers were actually purchased. At L60,
  player and enemy counts are maxed: Spear 10, Sword 10, Axeman 10, Archer 5,
  Cavalry 10, Monk 1. Initial CP is 1040, Max Alive 10, no purchase offers
  remain, and all nine card cooldown/budget ranks are 2.
- The most difficult encounters remain bosses, by design. The run includes
  retries but no state from which main progress cannot resume.
- Result reasons observed include hero death, boss death, and both directions
  of static-hero-line completion; no delayed “hero died but battle continued”
  pattern appeared.
- Across 96 transitions the telemetry gap was stable at roughly 2.02 seconds
  (2.007–2.048), primarily the deliberate telemetry/export delay. This does
  not substitute for a mobile frame-time or memory profile.
- This is one stochastic bot run, not a deterministic A/B or a human
  playtest. Do not claim exact balance causality from it alone.

## Validation and next direction

- The next intended product step is persistent player-facing progression/shop
  UI. Keep campaign state in `LevelSettings`; UI should query that state rather
  than using URL parameters as the campaign source of truth.
- Keep static authored environment/UI nodes separate from the resettable
  `BattleRuntime` subtree. This permits future UI to persist across battles.
- The broad TypeScript command still reports an existing configuration error in
  `assets/scripts/SpectorDebugger.ts` (dynamic import versus ES2015 module).
  Do not misreport that as a new battle-runtime failure. Targeted source checks
  and live telemetry were clean for the recent change.
- No controlled ads-on/off A/B, memory profile, or human playtest has yet been
  completed. These are verification work, not permission to add compensating
  balance knobs.

## Working style and available skills

Use `cautious-coding` for code changes. Use `game-systems-design` before new
mechanics, `game-design-consistency` for cross-system audits,
`game-balance-check` for telemetry conclusions, `game-balance-regression`
after balance/mechanic changes, and `cocos-performance-optimize-skills` for
mobile/large-unit profiling.

The user prefers source-backed, dynamic systems with few Inspector knobs. Do
not add a tuning field merely to hide one telemetry result. Telemetry validates
mechanics; it must never become runtime input.
