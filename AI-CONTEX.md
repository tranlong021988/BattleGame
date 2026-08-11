# BattleGame handoff

Last updated: 2026-08-11. This handoff records the accepted design and recent
implementation. **Runtime source and `assets/Test.scene` are authoritative if
they conflict with this file.** Do not reinstate old mechanics from this file
without checking source first.

## Start here

- The worktree is intentionally dirty. Preserve unrelated user/Cocos changes;
  never stage, reset, revert, or delete generated `library/`, `temp/`, or
  `profiles/` content without explicit permission.
- `assets/Test.scene` contains deliberate user tuning: `totalLevels = 60`,
  `progressionEndLevel = 50`, boss initial CP multiplier `= 1`, boss Max Alive
  multiplier `= 1`. This is intentional: levels 51--60 should let players
  enjoy their acquired power, not force everything to finish exactly at L60.
- Current authored changes are uncommitted. Meaningful source work is mainly
  `assets/scripts/LevelSettings.ts`; scene changes include both user changes
  and the reward field update. Do not treat all scene diff as Codex-owned.
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
- Enemy and player progression target comparable baseline CP. Enemy multipliers
  are 1.1 except the user-set boss initial CP/Max Alive multipliers noted above.
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
  defender; radius per batch that uses its extra radius; range only for attacks
  in the added range band. Multiple matching cards each consume their charge.
- Player owns reusable cards and cooldown starts only if a card consumed a
  charge. Cooldown advances after completed battles. Cooldown ranks 0..2 reduce
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
Breaker. `Precise Range` was rarely consumed on the narrow map; treat that as a
map/value question, not a missing call, until a controlled A/B test.

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

## Validation already completed

- Targeted Cocos TypeScript compile passed after the progression/ad changes:

  `node C:\ProgramData\cocos\editors\Creator\3.8.8\resources\app.asar.unpacked\node_modules\typescript\lib\tsc.js --noEmit --target ES2017 --module commonjs --strict false --experimentalDecorators --skipLibCheck assets/scripts/LevelSettings.ts assets/scripts/BattleCardDatabase.ts assets/scripts/BattleCardRuntime.ts assets/scripts/BattleTelemetry.ts assets/scripts/GameManager.ts assets/scripts/Unit.ts assets/scripts/UnitBehavior.ts temp/declarations/cc.d.ts temp/declarations/jsb.d.ts`

- `git diff --check` passed. Static checks confirmed the evenly distributed
  schedule (e.g. 11,13 and 26,28) and no remaining `applyVideoRescue` or
  `lossesPerVideoReward` source use.
- No full deterministic A/B or human playtest has been run. Do not claim ads
  are necessary, or that post-L50 balance is validated, without that test.

## Likely next task

There is no active implementation request. If the user resumes the ad question,
add a controlled telemetry/simulation comparison rather than changing balance
by intuition: same seeded deck/AI, ads enabled vs disabled, aggregate attempts
and outcomes for the identified levels. Preserve the accepted early-ad behavior
unless the user asks to change it.
