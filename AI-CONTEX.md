# BattleGame handoff

Last updated: 2026-08-11. This file is the handoff for the next Codex. Runtime
source and `assets/Test.scene` are authoritative when this file disagrees.

## Working rules

- The worktree is intentionally dirty. Preserve unrelated user/Cocos changes;
  never stage, reset, revert, or delete generated `library/`, `temp/`, or
  `profiles/` content without explicit permission.
- Team A is a simulation of the eventual real player only while
  `purchasingSimulation` is enabled. `BattleArmyBrain` makes weighted/random
  test decisions; shipped player UX will make its own spawn, purchase and card
  choices.
- Use telemetry to validate mechanics/balance, never as runtime input.
- The user prefers causal fixes and few Inspector knobs. Do not add a new
  tuning parameter merely to cover an isolated test result.
- Do not update this file unless the user explicitly asks for a handoff.

## Skills to install on another Codex

The shareable bundle is `BattleGame-Codex-Skills.zip` at the repository root.
Extract its five folders into the other Codex profile's `.codex/skills/`
directory, skipping any folder already present:

- `cautious-coding`
- `game-systems-design`
- `game-design-consistency`
- `game-balance-check`
- `game-balance-regression`

Use `cautious-coding` for every code change. Use `game-systems-design` before
new mechanics, `game-design-consistency` before cross-system changes,
`game-balance-check` for telemetry/balance analysis, and
`game-balance-regression` after a gameplay/economy/progression change.
`cocos-performance-optimize-skills` is already present on the local profile
and remains the performance skill for mobile/large-unit work.

## Primary locations

| Area | Runtime authority |
| --- | --- |
| Campaign, saves, economy, shop, unit progression, bot purchase AI | `assets/scripts/LevelSettings.ts` |
| Card definitions/defaults | `assets/scripts/BattleCardDatabase.ts` |
| In-battle card budget/telemetry | `assets/scripts/BattleCardRuntime.ts` |
| Battle integration and resolution | `assets/scripts/GameManager.ts` |
| Card effect use sites | `assets/scripts/Unit.ts`, `assets/scripts/UnitBehavior.ts` |
| Telemetry schema/export | `assets/scripts/BattleTelemetry.ts` |
| Inspector overrides | `assets/Test.scene` |

`GameManager.battleCardDatabase` must reference the scene's
`BattleCardDatabase`; otherwise decks are empty.

## Active Inspector state

- Campaign length: 100; `progressionEndLevel`: 50; boss pace: 5.
- Enemy multipliers for CP, Max Alive and unit count: 1.1.
- Enemy CP scales 250 -> 1040; player Initial CP baseline/packages reach 1040.
- Decision accuracy scales .4 -> 1.0. Spawn interval progression is disabled
  (`allowInterval = false`). Max Alive baseline scales 3 -> 10; player starts
  4 and can reach 10.
- Economy: `winGoldPerEnemyCP = 1`, boss reward multiplier 1.15, valid-loss
  gold ratio .1, video threshold 3 losses, unit unlock multiplier **5**,
  Initial CP price 10 gold per point, Max Alive base price 1000.
- Progression storage key/version: `battle-progression-v8`.

## Unit progression: approved current semantics

### Dynamic rules

`UnitProgressionRule.unlockProgression` is normalized against progression end
then aligned to a boss level. Scene values are correct and must stay dynamic:

| Family | Progression | Current unlock level (end 50, pace 5) | Base/max count |
| --- | ---: | ---: | --- |
| Spear | 0 | 1 | 5 / 10 |
| Sword | 0 | 1 | 5 / 10 |
| Axeman | .2 | 10 | 5 / 10 |
| Archer | .5 | 25 | 3 / 5 |
| Cavalry | .7 | 35 | 5 / 10 |
| Monk | .9 | 45 | 1 / 1 |

Do not restore the obsolete claim that the scene serializes all progression at
zero; it now has .2/.5/.7/.9 for Axe/Archer/Cavalry/Monk.

Enemy gets each eligible unit and its automatic count rank at its unlock
level. Player count rank is available at the same milestone **only after the
corresponding new unit is offered**. Count ranks occur at later unit-unlock
milestones, are capped by the unit's authored max count, and are not forced to
max at level 50. With current data, final counts after L45 are Spear 9, Sword
9, Axe 8, Archer 5, Cavalry 6, Monk 1; they remain flat to L100. This is
intentional.

### Pre-battle shop timing (new; important)

At battle initialization, `initializeProgression()` calls
`offerIntroducedUnits(currentLevel)` **before**
`completePreBattleProgression()` runs the bot purchase simulation. Therefore a
unit opened at L10/L25/L35/L45 and all newly available old-unit `+1 count`
options can be bought before that very battle. CP and Max Alive packages were
already purchased in this pre-battle pass.

Player-facing meaning: a real player sees the current level's newly offered
unit before entering battle and decides whether to buy it. Bot-facing meaning:
the bot may buy it only if it has enough gold.

The bot gives an affordable unit unlocked on the **current battle level**
priority over count and cards. It does not reserve gold in earlier levels. If
it arrives poor, it may fight without the new unit and buy it after winning.
This is intentional: lack of gold is an approved future hook for minigames,
gacha, or rewarded ads. Do **not** add a reserve system, make unit unlocks
free, or lower prices further without new user direction.

Current unit price formula is:

`round(UnitPrefabEntry.combatPointCost * unitUnlockCostMultiplier)`.

At multiplier 5: Axeman 370, Archer 130, Cavalry 485, Monk 245. The prior
multiplier 20 made Axeman 1480 and was rejected as unaffordable at L10.

## Economy and rescue

- Player buys CP, Max Alive, unit unlock/count, cards and card upgrades with
  gold. Enemy is authored/scaled and never buys.
- A valid player loss grants 10% of that level's win reward.
- Boss video rescue attempts after every 3 losses. It grants gold only when an
  unclaimed CP/Max Alive package exists; it is never a free package.
- Rescue Gold is sized to fund a useful pending baseline purchase. Once all CP
  and Max Alive packages are claimed, rescue cannot find a target and emits no
  reward even if `levelLossCount` passes 3. This explains L50's later retries.
- Post-L50 has no current purchase sinks or rescue targets after baseline/card
  progression ends. Gold inflation there is expected until the user adds the
  planned post-50 systems.

## Battle cards: approved implementation

### Core rules

- Player owns unique reusable cards and manually selects up to 3 ready cards
  for the real game. The test bot selects randomly from eligible ready cards.
- Enemy has an authored/randomized deck per level; it does not own cards, buy
  them, upgrade them, or observe cooldown. Each enemy level deck is stored in
  `enemyCardIdsByLevel`; retries never reroll it.
- At battle start all selected cards activate. The retired trigger/duration
  model does not exist in runtime. Cards use `baseBudget` combat-event charges
  and deactivate at zero.
- A player card starts battle-count cooldown only if it consumed at least one
  charge. Cooldown advances after every completed battle. A rewarded ad can
  finish cooldown only after the ad succeeds.
- Cooldown ranks 0..2 reduce effective cooldown by 1 each, floor 1. **When a
  cooldown upgrade is bought while the card is cooling, remaining cooldown is
  also reduced by 1 immediately.** Budget ranks 0..2 give 1.0x/1.4x/1.8x.
- Card upgrades unlock dynamically by card wave; all settings remain in
  `BattleCardDatabase` / Inspector, not hard-coded level lists.

### Budget consumption

- Damage: once per attack batch after damage.
- Defense/counter immunity: per protected defender.
- Radius: once per attack batch that actually uses extra radius.
- Range: only when attacking in the added range band; ordinary base-range
  attacks consume nothing.
- Matching effects stack and each matching card consumes one charge.

Current cards: General Offensive, Battle Shields, Anti-Cavalry Spearhead,
Axe Frenzy, Sword Wall, Arrow Suppression, Precise Range, Wide Prayer, and
Counter Breaker. Eligibility is roster/opponent-aware. Counter Breaker needs a
real counter threat; Anti-Cavalry needs enemy Cavalry.

Telemetry proved `Precise Range` is almost unused on the narrow map: it was
selected often but rarely consumed extra-range budget. This is a map/value
interaction, not a missing runtime call. Do not tune it without a controlled
card A/B test.

## Telemetry contract

- `config.progression.units` exposes enemy/player unlocked state, count and
  player count milestone cap.
- `progression.before.preBattlePurchases` records purchases before combat;
  `progression.purchases` records purchases between battles; do not count the
  same record duplicated in `after.preBattlePurchases` twice.
- `cardEvents` contains `card-activated` / `card-depleted`; final usage is in
  `progression.after.battleCards`.
- For balance conclusions, distinguish a single random campaign path from a
  controlled multi-seed test. Enemy deck is fixed per retry while bot player
  deck can vary with cooldown/random selection.

## Latest valid evidence

### 2026-08-10 17:58-18:32 — current pricing/pre-battle run

Reports `C:/Users/tranl/Downloads/battle-telemetry-2026-08-10T17-58-40-596Z.json`
through `...18-32-59-587Z.json`: 96 battles, levels 1-50 including retries.

- Campaign cleared L1-50: 50 wins, 46 losses; boss attempts 26, boss losses
  16. This is better than the earlier single run but is not a multi-seed proof.
- L10 Axeman was bought pre-battle: 410 gold -> 40 after paying 370; player
  and enemy both had Axe x5 and boss L10 won first attempt.
- L25 Archer was offered but not affordable: pre-shop gold 113 vs 130. Bot
  won then bought it between battles.
- L35 Cavalry was offered but not affordable: combat-start gold 20 vs 485.
  Bot lost once, won next attempt, then bought it between battles.
- L45 Monk was bought pre-battle: 275 -> 30 after paying 245.
- This partial pre-battle purchase behavior is accepted design, not a bug: a
  gold shortage is a future monetization/minigame/ad branch.
- L50 took 10 attempts (9 losses) with player CP 1040 and Max Alive 10. No
  rescue fired because all baseline packages were already claimed, although
  loss count reached 9.
- Total rewards 33,849; final gold 287. No early-game gold inflation signal.

### Earlier reference only

The large 2026-08-10 15:27-17:09 batch covered L1-100 before the latest unit
price/pre-battle change. It showed post-L50 gold accumulation and narrow-map
range-card underuse. Do not use it to judge the current early unlock pricing.

## Validation and next work

- Targeted Cocos TypeScript compile of card/progression/combat files passes.
- `assets/Test.scene` parses as JSON and `git diff --check` passes for authored
  files.
- No fresh full 1-100 batch has been run after multiplier 5/current-level
  priority. Do not claim post-50 balance is validated.
- Authored changes remain uncommitted.

If testing resumes, reset progression only when a clean economy comparison is
needed. A live save will adopt the new price for unpurchased units but does not
refund old purchases.
