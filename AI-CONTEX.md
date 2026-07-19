# AI-CONTEX

Handoff for the other Codex session working on `BattleGame`.

Last updated: 2026-07-18 by home Codex.

This file should describe the current accepted source and design. It is not a full history log. Always read the current source before editing. If this file conflicts with source, trust source first and update this file.

## Latest 2026-07-18 Home Handoff - Natural Stats Reset And BattleArmyBrain

This section supersedes the 2026-07-17 SmartArmyBrain hard-counter balance
direction below.

The user reset the balance process from fundamentals. The active goal is now to
build a coherent **system of natural unit strength**, not isolated hard-counter
pairs.

### Active Stats

`UNITSTATS.md` and `assets/Test.scene` have been synced to the new natural
strength candidate:

| Unit | Count | Cost | HP | Damage | Defense | Speed | Range | Radius | Interval |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Axeman | 10 | 44 | 180 | 26 | 5 | 3.1 | 0.35 | 0 | 0.58-0.68 |
| Cavalry | 10 | 60 | 210 | 26 | 8 | 6.5 | 0.35 | 0 | 0.56-0.66 |
| Sword | 10 | 38 | 160 | 20 | 8 | 3.4 | 0.35 | 0 | 0.50-0.60 |
| Spear | 10 | 32 | 165 | 20 | 6 | 3.0 | 0.80 | 0 | 0.55-0.65 |
| Monk | 2 | 40 | 65 | 38 | 0 | 2.7 | 5.20 | 0.85 | 2.90-3.50 |
| Archer | 4 | 34 | 70 | 17 | 0 | 3.8 | 6.50 | 0 | 1.25-1.55 |

Natural ladder intent:

```text
Cavalry > Axeman > Sword > Spear
```

Archer/Monk are weak when caught alone and should only be valuable behind a
frontline. Monk is treated like a small siege/AoE unit, not a normal ranged DPS
unit.

### Counter Rules

`CounterSettings` now has only one active rule:

```text
Spear > Cavalry = 2.1
```

Old scene `CounterRule` objects remain serialized only as inactive legacy
objects with multiplier `1`; `CounterSettings.rules` references only the
Spear>Cavalry rule.

### New AI Direction

New files:

- `assets/scripts/BattlefieldEvaluator.ts`
- `assets/scripts/BattleArmyBrain.ts`

`BattlefieldEvaluator` is a pure TypeScript evaluator, not a Cocos Component. It
does not update every frame. It is rebuilt only when `BattleArmyBrain` reaches a
spawn decision interval.

`BattleArmyBrain` is the intended replacement direction for `SmartArmyBrain`.
It reads evaluator output and tries to choose the cheapest sufficient response
using:

- enemy threat power from HP, alive count, damage tempo, role, and hero-line
  progress;
- coverage power from living ally waves, not historical assignments;
- target-local frontline shield checks for ranged spawn safety;
- lane traffic and the rule that direct lane spawning is blocked when there are
  already at least two useful ally waves ahead unless rescue/danger rules apply;
- Cavalry dive checks against exposed ranged targets;
- Monk only when enemy clustering/frontline conditions make AoE sensible.

Important: `BattleArmyBrain` was added as a new component script but not forcibly
serialized onto scene nodes. To test it, add/enable `BattleArmyBrain` on the AI
brain node(s), assign `GameManager`, set `team`, and disable the corresponding
`SmartArmyBrain` component to avoid double-spawning.

### 2026-07-18 Follow-up: Opening Spear/Cavalry Overuse

User reported early matches spawning too much Spear/Cavalry. Diagnosis:

- `BattlefieldEvaluator.choosePressureEntry()` rewarded speed too heavily
  (`entry.maxSpeed * 4`), so Cavalry was selected for generic opening pressure.
- Once Cavalry appeared, the only hard counter (`Spear > Cavalry`) correctly
  pulled Spear into the match, creating an opening Spear/Cavalry loop.
- `chooseEntryForTarget()` also gave a very large "sufficient force" bonus,
  making expensive overkill responses too attractive.

Fix applied:

- generic pressure/opening now prefers Sword/Axeman and penalizes Spear/Cavalry
  unless they are selected by target-specific logic;
- response scoring now uses a much smaller sufficient-force bonus and adds an
  overshoot penalty, so it should prefer efficient/cost-sensible answers over
  expensive overkill.

### 2026-07-18 Follow-up: Ranged Under-Spawn

User sent 10 real telemetry files from BattleArmyBrain testing. Visual report
was that Archer/Monk almost never spawn; the telemetry confirmed it:

| Unit | Wave spawns | Share |
| --- | ---: | ---: |
| Axeman | 68 | 29.3% |
| Spear | 60 | 25.9% |
| Sword | 50 | 21.6% |
| Cavalry | 41 | 17.7% |
| Monk | 9 | 3.9% |
| Archer | 4 | 1.7% |

Ranged total was only 13/232 wave spawns = **5.6%**. The reason was not simply
bad unit stats:

- generic pressure/opening intentionally avoids ranged because ranged should not
  lead a lane alone;
- target-response logic treated ranged as a main answer to a threat, where its
  low wave count and support role lose to melee/power units;
- ranged safety checks require a real melee frontline, so valid opportunities
  were rare unless there was a dedicated support branch.

Fix applied:

- `BattleArmyBrain` now tries `ranged-support` after direct target response and
  before generic pressure.
- `BattlefieldEvaluator.findBestRangedSupportTarget()` finds enemy lanes where
  allied melee frontline already exists and ranged support is useful.
- `BattlefieldEvaluator.chooseRangedSupportEntry()` chooses Archer as safe backline
  DPS, and Monk only when enemy clustering/alive count makes AoE sensible.
- `BattleArmyBrain.maxRangedSupportWavesPerLane` defaults to `2` to prevent
  support ranged spam in one lane.

Expected visual result: Archer/Monk should appear more often behind an existing
frontline, not as opening lane leaders. Monk should still be rarer than Archer
and mostly appear in clustered fights.

Verification notes:

- `assets/Test.scene` JSON still parses.
- No local TypeScript compiler is installed in this project (`package.json` has
  no build/typecheck script and `node_modules/.bin` has no `tsc`), so Cocos Editor
  compile/playtest is still required.

### 2026-07-19 Follow-up: Ranged Unit Behavior Before More Stat Balance

User identified a more fundamental ranged-unit problem: Archer/Monk were still
using melee-style behavior, only with longer `attackRange`.

Observed/expected problem:

- Ranged waves forward into combat, stop when `onBusy`, and become physical
  blockers for allied melee waves behind them.
- Melee allies then split around ranged units, get stuck behind them, or fail to
  protect them naturally.
- When enemy melee reaches ranged units directly, ranged units used to stand and
  fight like melee, which makes low-health/slow-interval ranged units evaporate.
- Previous attempts to solve this by letting allies pass through ranged units,
  shrinking pass radius, or making ranged pushable looked visually wrong or did
  not solve formation collapse.

Fix applied:

- `Unit.ts` now treats `UnitFamily.Archer` and `UnitFamily.Monk` as ranged combat
  units.
- Ranged units still remain `onBusy` and attack through `UnitBehavior`, but while
  busy they are no longer locked as immovable melee blockers.
- Ranged combat movement decisions are refreshed only on
  `targetSearchIntervalFrames` or when target changes; frames between decisions
  only apply cached velocity for smooth movement.
- Kiting rule is implicit and has no new inspector knobs:
  - danger distance = `30% * attackRange`;
  - if enemy is inside that distance, ranged retreats;
  - retreat continues until enemy is at least `70% * attackRange` away;
  - if target slips beyond `100% * attackRange`, ranged advances enough to regain
    range.
- Yield rule:
  - if a ranged unit is busy and detects a forward-moving allied melee wave
    behind it, it side-steps toward the lane edge plus a small backward drift;
  - this is intended to open the lane center for melee without pass-through
    visuals.
- `BattleSpatialGrid` now exposes `queryAllies()` so ranged yield checks can use
  the same grid instead of full-list scans.
- `UnitBehavior` skips ranged attacks when the current target is outside attack
  range, preventing kite/yield movement from creating out-of-range damage.
- `BattleArmyBrain` now spawns `ranged-support` as normal forward, not aggressive
  forward, so support ranged is less likely to become the frontline.

Important design note:

This is a behavior fix, not a stat-balance fix. Do not judge Archer/Monk stats
again until this behavior has been playtested, because their survivability and
damage uptime should change materially when they stop acting like melee blockers.

## Latest 2026-07-17 Office Handoff - Real Telemetry After System Balance Candidate 1

This section supersedes all older 2026-07-17 balance/counter notes below. Current source has been synced into:

- `assets/Test.scene`
- `assets/scripts/CounterSettings.ts`
- `UNITSTATS.md`
- `UNITSTATS_BALANCE_PROPOSAL.md`
- `tools/balance_wave_simulator.py`
- `tools/balance_search.py`

If any number below conflicts with source, trust source first, then update this file.

### Current Working Conclusion

Do **not** keep tuning single unit stats from isolated symptoms yet.

The latest real Cocos telemetry batch shows the current balance issue is now
mostly a **SmartArmyBrain counter-selection policy problem**, not simply "Archer
too strong" or "Spear too strong" in isolation.

The important discovery:

- `SmartArmyBrain.chooseEntryForTarget()` currently chooses response entries by
  highest raw `CounterSettings.getCounterScore()` among affordable matching
  counters.
- For a `Spear` target, the current rules make:

```text
Archer > Spear = 3.2
Sword  > Spear = 3.0
```

- Therefore a fully accurate AI tends to pick `Archer` against `Spear` instead
  of `Sword` whenever Archer is affordable.
- This makes `Sword` almost disappear from real matches.
- That then creates a systemic loop:
  1. Archer/Monk appear often.
  2. Cavalry appears often to counter Archer/Monk.
  3. Spear appears often to counter Cavalry.
  4. Spear is not answered by Sword often enough because Archer is preferred by
     raw multiplier.
  5. The match collapses into an Archer/Monk -> Cavalry -> Spear loop instead
     of the intended wider counter ecology.

This is why the next fix should be in **AI response selection**, not another
small stat patch.

### Latest Real Cocos Telemetry Batch

The user supplied 20 real telemetry reports from:

```text
2026-07-17T12:56:26Z through 2026-07-17T13:09:42Z
```

All 20 matches ended by:

```text
team-eliminated-and-cannot-afford-spawn
```

Aggregate result:

```text
Team 1 wins: 13
Team 0 wins: 7
Average duration: 68.1s
Duration range: 47.9s - 89.6s
```

End-state averages:

```text
Team 0 final CP avg:     5.0
Team 1 final CP avg:    21.8
Team 0 alive units avg:  7.8
Team 1 alive units avg: 15.1
```

Team totals:

```text
Team 0: kills 1422, deaths 1413, counter kills 799, damage 201306.4
Team 1: kills 1413, deaths 1422, counter kills 810, damage 194551.0
```

Interpretation:

- Team 0 actually dealt slightly more total damage.
- Team 1 still won more often and ended with more CP/alive units.
- This points away from a simple "one unit has too much damage" answer.
- There may still be Team/order/decision-timing bias, but the clearest current
  design issue is the counter-selection loop described above.

### Latest Spawn Mix From Real Batch

Across 20 matches:

```text
Archer  138 waves
Cavalry 119 waves
Spear   102 waves
Monk     71 waves
Axeman   32 waves
Sword     7 waves
```

This is the strongest evidence that the intended Sword role is not being
expressed in real play.

Spawn modes:

```text
normal forward:      40
aggressive forward: 429
```

Reason counts:

```text
response:                     392
fast-react-response:           23
aggressive-empty-lane-random:  21
aggressive-empty-lane-fastest: 19
opening:                       14
```

Interpretation:

- The current tests are dominated by response spawning and aggressive-forward
  movement.
- Normal forward is rare in current AI behavior.
- This is not automatically wrong, but it means balance should be diagnosed as
  an interaction between unit stats, counter rules, and response policy.

### Latest Damage Per CP From Real Batch

Global damage/CP:

```text
20.34
```

By family:

```text
Spear    31.04  rel 1.53
Cavalry  27.29  rel 1.34
Sword    22.62  rel 1.11  (very low sample: 7 waves)
Axeman   22.51  rel 1.11
Monk     10.63  rel 0.52
Archer    9.60  rel 0.47
```

Important interpretation:

- This batch does **not** support the earlier "ranged units are still globally
  too profitable" diagnosis.
- Archer and Monk are now low by damage/CP in aggregate.
- Spear and Cavalry are currently the highest-value units.
- However, because the AI overselects Archer against Spear, this does not mean
  "buff ranged" yet. First fix AI selection so the system produces healthier
  matchups, then retest.

### Latest Counter Pair Evidence

Counter pair data from the 20 reports:

```text
Spear > Cavalry x2.4:
  damage 96767.0 vs reverse 65629.0
  kills 726 vs reverse 366

Cavalry > Archer x3.2:
  damage 28368.4 vs reverse 13495.4
  kills 346 vs reverse 67

Cavalry > Monk x3.2:
  damage 16004.4 vs reverse 12715.8
  kills 117 vs reverse 51

Archer > Spear x3.2:
  damage 33460.8 vs reverse 3988.8
  kills 262 vs reverse 38

Monk > Axeman x3.2:
  damage 12302.4 vs reverse 200.0
  kills 101 vs reverse 0

Axeman > Sword x2.7:
  damage 8892.9 vs reverse 4867.6
  kills 49 vs reverse 33

Sword > Spear x3.0:
  damage 173.0 vs reverse 60.0
  kills 1 vs reverse 0

Archer > Monk x1.8:
  damage 987.0 vs reverse 861.2
  kills 7 vs reverse 10
```

Interpretation:

- The configured counter rules mostly work when the pair actually occurs.
- `Sword > Spear` cannot be evaluated properly because Sword barely spawns.
- Spear is strongly beating Cavalry, which is intended directionally, but the
  magnitude should be rechecked only after Sword is restored into the ecology.
- Cavalry is successfully killing Archer/Monk, so the anti-ranged answer exists.
- Monk's Axeman counter is very strong when it happens, but Monk is low overall
  by damage/CP because it is often answered by Cavalry and has only 2 units.

### What To Fix Next

Primary next task:

```text
Fix SmartArmyBrain counter response selection so it does not choose only by raw
counter multiplier.
```

Recommended direction:

- Keep `CounterSettings` as the damage-rule source.
- Do not remove the current counter rules yet.
- In `SmartArmyBrain.chooseEntryForTarget()`, do not rank candidates only by
  `getCounterScore(entry, targetWave)`.
- Response choice should account for at least:
  - role/family intent;
  - expected practical value against the target;
  - cost;
  - unit count;
  - whether the counter choice creates an unhealthy global spawn loop;
  - possibly a small random tie-break so AI does not become deterministic.
- Specifically, make sure `Sword` can be selected as a real answer to `Spear`.

Avoid this mistake:

```text
Do not immediately nerf Spear or buff Sword based only on this batch.
```

Why:

- Spear looks too profitable partly because the AI is producing many Cavalry
  targets and not enough Sword answers.
- If we nerf Spear first, the Cavalry/Archer/Monk loop may break somewhere else
  and create another local-tuning cycle.

After the AI response-selection fix:

1. Run another real 20-match telemetry batch.
2. Compare:
   - Sword wave count should rise from `7/469` total waves.
   - Spear damage/CP should likely fall without touching Spear stats first.
   - Cavalry count may fall if Archer/Monk/Spear loop calms down.
   - Team 1 bias should be rechecked separately.
3. Only then adjust stats/multipliers if the system is still off.

### Why This Pass Happened

The user correctly pointed out that previous tuning kept chasing local symptoms: nerf Archer, then Spear becomes too strong, then Cavalry gets buffed, then another part of the loop breaks. That is not acceptable for a counter-loop strategy game.

The current pass treats balance as a system:

- unit count;
- cost;
- health/damage/defense;
- speed and ability to reach ranged;
- attack range;
- attack interval;
- damage radius;
- counter multiplier;
- SmartArmyBrain spawn reason and aggressive/normal forward behavior;
- runtime focus fire and pre-contact ranged damage.

### Tooling Changes

Added `tools/balance_search.py`:

- imports the wave simulator;
- can random-search full stat/counter candidates;
- includes a lightweight micro-duel evaluator for individual unit count, range, speed, contact timing, and full Monk AoE;
- should be treated as a balance lab, not runtime code.

Updated `tools/balance_wave_simulator.py`:

- `--add-rule` now accepts explicit multipliers:

```powershell
--add-rule Spear:Cavalry:2.4
```

The wave simulator is still only directional. It under-models real ranged focus fire, so do not use raw simulator damage/CP alone to buff Archer/Monk.

### Current Active Tier-1 Stats

These are the current source numbers in `assets/Test.scene` and `UNITSTATS.md`:

```text
axeman_t1   count 10, cost 32, hp 130, atk 20, def 3, speed 3.0, range 0.35, damageRadius 0.00, interval 0.30-0.50
cavalry_t1 count 10, cost 46, hp 145, atk 22, def 7, speed 6.5, range 0.35, damageRadius 0.00, interval 0.30-0.50
sword_t1   count 10, cost 46, hp 175, atk 21, def 9, speed 3.5, range 0.35, damageRadius 0.00, interval 0.30-0.50
spear_t1   count 10, cost 42, hp 150, atk 14, def 6, speed 3.0, range 0.80, damageRadius 0.00, interval 0.30-0.50
monk_t1    count  2, cost 40, hp 140, atk 30, def 0, speed 3.0, range 5.50, damageRadius 0.05, interval 2.00-2.40
archer_t1  count  4, cost 40, hp  85, atk 23, def 0, speed 3.0, range 5.50, damageRadius 0.00, interval 1.60-2.00
```

### Current Counter Multipliers

```text
Spear   > Cavalry   2.4
Cavalry > Archer    3.2
Cavalry > Monk      3.2
Archer  > Spear     3.2
Archer  > Monk      1.8
Monk    > Axeman    3.2
Axeman  > Sword     2.7
Sword   > Spear     3.0
```

### Design Intent

- Spear is no longer a high-stat generalist. Its anti-Cavalry identity now comes mostly from multiplier.
- Cavalry should be fast/durable enough to reach exposed ranged units, but its base attack/cost prevent it from being a universal brawler.
- Sword should be visible as the infantry answer to Spear.
- Archer/Monk are deliberately conservative because real Cocos telemetry previously made ranged much stronger than the wave simulator predicted.
- Monk AoE is tiny (`0.05`) because runtime AoE applies full damage to secondary units in the radius.

### Screening Result

After syncing scene, command used:

```powershell
python tools\balance_wave_simulator.py --scene assets\Test.scene --matches 600 --seed 20260728 --dt 0.25 --no-design-report
```

Directional result:

- winners: Team 1 `340`, Team 0 `252`, draw/estimate `8`;
- average duration: about `90.7s`;
- spawn mix stayed broad; no single team/family line dominated above about `11.3%`;
- simulator still reports Archer/Monk low raw damage/CP, but this is expected because simulator under-models ranged focus fire;
- simulator still shows Team 1 bias. If real telemetry also shows Team 1 bias with symmetric stats, inspect SmartArmyBrain/update order before changing stats again.

### Previous Real Test Criteria And Current Status

These were the gates for validating Candidate 1. They are now partially
answered by the 20-match real batch above:

1. Spear damage/CP did drop from the earlier extreme batch, but is still the
   highest family value in the current real batch at `31.04`.
2. Spear counters Cavalry strongly. The direction is correct, but the amount
   may still be too high after AI selection is fixed.
3. Cavalry reaches and kills Archer/Monk often enough to matter.
4. Archer/Monk mass is no longer globally overperforming by damage/CP in this
   batch.
5. Sword does **not** show up as a meaningful answer to Spear because AI rarely
   spawns it.
6. Team 1 still wins more often (`13/20`), but this should be rechecked after
   the AI response-selection fix before assuming pure update-order bias.

Do not return to local one-unit patches unless a fresh batch after the
response-selection fix isolates a single clear regression.

## Superseded Balance Archives Removed

Older 2026-07-15 to 2026-07-17 balance archives contained obsolete stat tables, counter multipliers, and telemetry interpretations from before the current counter-multiplier balance pass. They were intentionally removed from this handoff to avoid confusing future Codex sessions.

Current balance source of truth is the top section of this file plus:

- `UNITSTATS.md`
- `UNITSTATS_BALANCE_PROPOSAL.md`
- `assets/Test.scene`
- `assets/scripts/CounterSettings.ts`
- `tools/balance_wave_simulator.py`

Do not restore old balance numbers from Git history unless the user explicitly asks for a rollback or a new branch of balance experiments.

## Archived 2026-07-15 Home Handoff

The old 7-unit balance pass with active Skirmisher and 11 counter rules is superseded by the current 6-unit cavalry anti-ranged pass above. Keep this in mind when reading older discussion/history in this file.

### Battle Telemetry Added By Office Codex

- `assets/scripts/BattleTelemetry.ts` was added as an aggregate, event-driven balance report helper.
- `GameManager` now has official battle winner state:
  - `battleWinnerResolved`;
  - `battleWinnerTeam`;
  - `battleLoserTeam`;
  - `battleWinnerReason`.
- Winner rules currently implemented:
  - if a hero is killed first, that hero's team loses immediately and the other team wins; report reason is `hero-killed`;
  - CP depletion is now an optional fallback, controlled by `enableNoAffordableSpawnWinnerFallback`;
  - `enableNoAffordableSpawnWinnerFallback` defaults to `false` so balance telemetry keeps running until a hero-kill result instead of cutting off when one team cannot afford another spawn;
  - if the fallback is enabled, combat point is enabled, and one team can no longer afford any valid spawn entry before any hero-kill result, that team is the loser and the other team is the winner; report reason is `first-team-cannot-afford-any-spawn`;
  - if both teams become unable to afford a spawn on the same check, it is treated as a resolved draw-style result with `winnerTeam = -1` and `loserTeam = -1`;
  - the winner check does **not** stop the match yet. It logs once and leaves gameplay running.
- `GameManager` now has Inspector toggles:
  - `enableBattleWinnerCheck` default `true`;
  - `enableNoAffordableSpawnWinnerFallback` default `false`;
  - `battleWinnerCheckIntervalFrames` default `1`;
  - `enableBattleTelemetry` default `true`;
  - `downloadBattleTelemetryOnEnd` default `true`;
  - `storeBattleTelemetryReportsInBrowser` default `true`;
  - `downloadSingleTelemetryDuringAutoReload` default `false`;
  - `battleTelemetryStorageKey` default `battle-telemetry-batch`;
  - `reloadPageAfterBattleTelemetryExport` default `true`;
  - `battleTelemetryReloadDelaySeconds` default `1.5`;
  - `logBattleTelemetryOnEnd` default `false`;
  - `battleTelemetryFilePrefix`.
- The telemetry report exports once when the winner rule resolves.
- When browser reload is enabled, `GameManager` stores each report in `localStorage` and reloads the page after the telemetry export delay so unattended balance-test loops can start the next match automatically.
- Per-match downloads are skipped during auto-reload by default because Chrome blocks repeated automatic downloads. Use browser console function `downloadBattleTelemetryBatch()` to download one combined JSON later, and `clearBattleTelemetryBatch()` to clear stored reports.
- Report is downloaded as JSON in browser when enabled and is also stored on `window.__battleTelemetryReport` / `globalThis.__battleTelemetryReport`.
- Current aggregates include:
  - per team/unit type spawned count, death count, alive at end;
  - total and average lifetime;
  - total damage dealt/received;
  - counter damage dealt/received;
  - hero damage dealt by unit type, plus damage received from hero by unit type;
  - kills, deaths, counter kills, deaths to counter;
  - killed-by and killed-unit matrices by unit type;
  - damage dealt/received matrices by unit type;
  - config snapshot of active unit stats, CP, bounds, lane count, and counter rules.
- Current AI spawn-policy telemetry also includes:
  - `waveSpawns`, one row per SmartArmyBrain wave spawn decision;
  - `spawnDecisionStats`, aggregate counts grouped by team, reason, aggressive flag, family, tier, and unit name;
  - target/tactical context when applicable: target family/lane/wave, response tier, ally blockers from spawn, lane ally count, coverage, uncovered count, and threat score.
  - This exists specifically to avoid misreading unit balance when SmartArmyBrain policy is actually over-spawning a family.
- Hooks:
  - `GameManager.spawnUnitForWave()` records spawn;
  - `SmartArmyBrain` records wave-spawn decisions after successful AI spawns;
  - `UnitBehavior.dealDamageToEnemy()` reports actual damage before applying damage;
  - `GameManager.reportKill()` records kill/counter kill;
  - `GameManager.notifyUnitWillDespawn()` records death/lifetime.
- This is intentionally aggregate-only, not a per-frame or per-hit event log, to keep mobile/browser overhead low.

## Archived 2026-07-14 Office Handoff

The old 7-family balance setup from this section was removed to avoid contradicting the current 6-unit cavalry anti-ranged pass. The still-current non-balance notes from that day are kept below.

### Banner Shader And Color Space

- `assets/shaders/UnlitBillboard.effect` was adjusted today:
  - sheet row order is now top-to-bottom (`iconId` reads left-to-right, top-to-bottom);
  - sampled `mainTexture.rgb` is converted with `SRGBToLinear()` before tint/composite, matching Cocos `builtin-unlit` color-space handling.
- `GameManager.getWaveBannerColorParams()` now converts team background color channels from sRGB to linear before sending `a_billboard_bg_color` through `setInstancedAttribute`.
- These changes were made because banner colors looked too bright compared with the source icon sheet.

### Freehunt To Back-To-Lane Behavior

- `Unit.tryResumeForward()` still sends surviving units through the lightweight `backToLane -> forward` phase; there is still no slot-based regroup.
- Before today's fix, `GameManager.getDirectionToLaneArea()` considered the entire lane width valid. Units could touch the lane edge and immediately forward, making waves appear to forward from a lane border.
- It now uses the lane center core: `coreHalfWidth = laneWidth * 0.25`. In practice, units must enter the middle 50% of the lane before forward resumes.
- This intentionally keeps the behavior lighter than full regroup, but avoids the "forward from lane edge" look.

## Latest 2026-07-13 Home Handoff

Read this section before continuing gameplay AI or forward/freehunt work.

### Aggressive Forward And Ranged Units

- User reported that aggressive-forward archers could cancel aggressive forward too early because their long `attackRange` let them acquire different-lane enemies.
- Current accepted fix:
  - while `Unit.onForward && Unit.aggressiveForward`, the unit's own attack-range acquisition ignores enemies outside the unit/wave lane;
  - this filter is in `Unit.isValidEnemyWithinAttackRange()`, so cached attack-range targets also cannot bypass it;
  - normal forward is unchanged and still uses same/adjacent-lane scanner release rules.
- Important distinction:
  - aggressive-forward units do not proactively attack different-lane units just because they are in weapon range;
  - if a different-lane enemy actually attacks them, `reactToAttacker()` still allows solo retaliation for the hit unit;
  - the rest of the wave keeps aggressive forward during that solo retaliation.

### SmartArmyBrain Telemetry

- `SmartArmyBrain.enableDecisionStats` still exists and is disabled by default.
- When enabled in Inspector, it logs coarse actual-match counts for:
  - aggressive spawns;
  - normal spawns;
  - intentional waits;
  - hard skips.
- Percentages use `aggressive + normal + wait` as the denominator. `skip` is reported separately because max-wave / no-CP / failed-spawn gates are not tactical wait decisions.
- This older console log is useful for quick sanity checks only.
- For balance and AI-policy analysis, prefer the newer JSON `BattleTelemetry.spawnDecisionStats` / `waveSpawns` / economy fields described in the latest 2026-07-16 section. It identifies exact spawn reason, target family, CP spend/efficiency, and whether empty-lane aggressive raid chose fastest or random.
- Old 2026-07-13 observed Inspector values are stale and should not be treated as current truth. Always check `assets/Test.scene` and whether `LevelSettings` is enabled before interpreting AI behavior.

### Current Known Worktree Notes

- `AI-CONTEX.md`, `SmartArmyBrain.ts`, `LevelSettings.ts`, `GameManager.ts`, `BattleTelemetry.ts`, scene/database files, and related gameplay files may have active handoff/gameplay edits from recent sessions.
- Many `library/`, `temp/`, `profiles/`, and build files are still editor/generated noise. Do not clean/revert them unless the user explicitly asks.
- Validation done after the telemetry and aggressive-forward filter changes:
  - `git diff --check -- AI-CONTEX.md assets/scripts/SmartArmyBrain.ts assets/scripts/Unit.ts`;
  - Cocos TypeScript command from this file's Workspace Notes ran clean on the home machine.

### Web Mobile PC Landscape Layout

- User wants the 720x1280 portrait game to keep its 9:16 aspect ratio when opened on a landscape PC browser.
- Do not solve this by globally changing `settings/v2/packages/project.json` to `fitHeight=true`; that can hurt tall portrait mobile screens.
- Current accepted source-side solution:
  - keep project design resolution at 720x1280 with `fitWidth=true`;
  - add `build-templates/web-mobile/style.css`;
  - in landscape orientation, CSS centers `#GameDiv` and sets it to `height: 100vh` and `width: calc(100vh * 9 / 16)`, producing side pillars on PC;
  - portrait remains full-screen `100% x 100%`.
- Rebuild `web-mobile` after this change so Cocos copies the template CSS into the build output.

## Accepted 2026-07-07 Office Changes

These are the current accepted changes from today's office session:

- `GameManager.targetFrameRate` was added for mobile/browser FPS experiments. Use `30`, `45`, or `60`; use `0` or lower to keep the engine default.
- `GameManager` shifted wave-banner refresh phase from `wave.id` to `wave.id + 1` to reduce same-frame overlap with other wave work.
- `TopDownCameraDrag` now avoids setting camera world position or FOV when the value is already within a tiny epsilon. This reduces unnecessary transform/render invalidation during camera idle/smoothing.
- `Unit` skips forward-facing rotation work when actual movement/pref velocity is already aligned with `forwardDir`. This must not be changed into a hard rotation lock, because RVO/overtake can move units diagonally while forwarding.
- `Unit` only prefers actual `agent.vel` for move-intent facing after visual movement has accumulated past the normal move threshold. If a unit is blocked and barely moving, facing falls back to stable `prefVel` instead of jittering with RVO/overtake velocity noise.
- `Unit.applyFacingYaw()` clamps its lerp factor to `[0, 1]` so frame spikes cannot overshoot the target yaw.
- `Unit` skips repeated busy look/sync work once both attacker and target are locked, the look direction is settled, and visual position is already close enough.
- `Unit` attack-check phase is shifted by half its interval to reduce overlap with target-search/forward-scan phases.
- `BattleWave` avoids resetting banner local position to `(0,0,0)` when it is already there.
- `HealthBar3D` avoids reapplying identical color and avoids setting `renderer.enabled` when the state is unchanged.
- `BlueUnit.prefab` / `RedUnit.prefab` currently have `visualThreshold = 0.1` from Inspector tuning. Treat this as an accepted tuning value unless the user changes it.

Rejected/reverted today:

- Do not resurrect the attempted render/shader flag optimization from today. It caused banner/healthbar sort or disappearance issues.
- In particular, do not casually change healthbar/banner depth state, render priority, material state, shadow receiving flags, or shader precision again unless the user explicitly asks and there is a focused verification plan.
- Current `HealthBar.effect` should remain on the accepted functionally stable path. `UnlitBillboard.effect` is also on the stable path, but it now includes the accepted 2026-07-14 atlas row-order and sRGB-to-linear fixes documented above.

## Accepted 2026-07-08 Home Changes

These changes were made after receiving the 2026-07-07 office handoff:

- `Unit.ts` now guards repeated writes to agent runtime state:
  - `setAgentLocked()`;
  - `setAgentOnForward()`;
  - `setAgentPrefVelocity()`;
  - `setAgentStopped()`;
  - `zeroAgentVelocity()`.
- These guards replace repeated direct writes to `agent.locked`, `agent.onForward`, zero velocity, and identical `setPrefVelocity()` calls across dead, steady, busy, forward, chase, hero-guard, freehunt, and despawn paths.
- This is intended as a small hot-path cleanup only. It must not change movement/combat rules.
- `Unit.ts` now caches visual yaw:
  - `visualYawCache`;
  - `visualYawCacheValid`;
  - `refreshVisualYawCache()`;
  - `getVisualEulerY()` reads the cache after it is initialized;
  - `setVisualYaw()` updates the cache when applying rotation.
- The yaw cache reduced `getVisualEulerY()` profile cost in the slowdown trace, but did not significantly improve total frame time because total `Unit` cost is small compared with full frame cost.
- The old five-entry light troop database from this period has been superseded. Trust the latest 2026-07-16 section and `UNITSTATS.md`: the active test database arrays now contain 6 tier-1 entries, while inactive/legacy serialized objects may remain in the scene.

Rejected/reverted on 2026-07-08:

- Far/topdown rotation snap was tested and then removed.
- Do not reintroduce `Far Facing Snap Step`, `shouldUseLowDetailUnitFacing()`, `shouldSnapFacingYaw()`, or `snapYaw()` unless the user explicitly asks.
- Unit rotation should remain smooth through `lerpAngle()` as before.
- Animation FPS LOD was not implemented. The user allowed lower animation FPS but explicitly said not to disable `SkeletalAnimation`. Cocos' safe public path is mainly pause/resume/stop or playback speed; changing speed alters animation timing, and pause plus manual sample is too risky for blend/event/baked animation without a focused experiment.

## Accepted 2026-07-08 Office Changes

These are the accepted current changes from the office session after receiving the home handoff:

- `GameManager` can show the built-in Cocos profiler overlay in preview/build:
  - Inspector: `showCocosProfilerStats`;
  - URL query when allowed: `?stats=1`, `?profiler=1`, or `?showStats=1`;
  - `?stats=0` / equivalent false values hide it.
- The office SmartArmyBrain priority/coverage implementation was superseded by the accepted 2026-07-09 home changes below.
- `SmartArmyBrain.fastReactCounterChance` is available:
  - listens for newly spawned enemy waves;
  - only runs after `minSpawnInterval` has elapsed and the chance roll passes;
  - respects max alive wave limit and affordability;
  - only reacts to the newly spawned enemy wave, not any arbitrary older target;
  - if it spawns, it resets the normal timer/random interval to avoid immediate double-spawn pressure.
- Counter aggressive-forward rule:
  - if SmartArmyBrain chooses to counter on the enemy target's lane and the path from spawn to that target has ally blockers, the counter wave spawns with `aggressiveForward = true`;
  - if that target lane is clean with no ally blockers, same-lane counter also spawns aggressive;
  - other cases fall back to the existing `shouldSpawnAggressiveForward()` / opening-phase behavior.
- The office scale-tween banner transfer was superseded by the accepted immediate transfer on 2026-07-09.

Rejected/reverted in the office session:

- Lane-biased ally overtake was tested and removed.
- Do not assume left/right lane overtake is forced to one side. Current RVO overtake behavior is back to the previous local-clearance/side-lock/seed logic for all lanes.
- No `overtakePreferredSide` field or worker-buffer stride change should exist in the accepted source.

## Accepted 2026-07-09 Home Changes

### SmartArmyBrain Snapshot And Coverage

- Removed historical counter assignment state from `BattleWave`:
  - no `assignedCounterCount`;
  - no `addCounterAssignment()`;
  - no `getCounterCoverageRatio()` / `isCounterCovered()`.
- SmartArmyBrain calculates response coverage from the current battlefield only when `rebuildIntel()` runs. This does not add a per-frame scan.
- A same-lane ally wave contributes live coverage only when it matches the currently best available response tier (or a better tier) and is currently relevant to that enemy:
  - if units already have targets, only units targeting that specific enemy wave count;
  - if the wave has no target, its alive units count only toward the first enemy wave ahead;
  - if it is chasing another enemy, it does not cover this target.
- Dead, depleted, redirected, or lane-shifted responses stop contributing automatically on the next intel rebuild.
- A struggling response means a relevant response wave at or below `rescueAllyAliveRatio`:
  - either it has units targeting that enemy;
  - or it has no target and that enemy is the first one ahead.

### SmartArmyBrain Reachability And Priority

- Response target eligibility is front-to-back per lane:
  - only the first enemy wave on the path from this team's spawn can be selected for a new direct response;
  - this applies even when ally waves already occupy or block the lane;
  - a rear enemy becomes eligible after the front enemy dies, leaves the lane, or is otherwise no longer first.
- This prevents an invalid visual/tactical decision such as spawning cavalry for a rear archer while an enemy spear wave physically stands in front and will intercept the cavalry first.
- Among eligible front enemies, proximity to this team's hero/defend point is the primary threat weight.
- Unengaged state, clean path, one-blocker path, live coverage, alive ratio, and struggling-counter state are secondary weights.
- The front-enemy eligibility guard applies to both normal interval decisions and `fastReactCounterChance`.

### SmartArmyBrain Anti-Over-Counter

- Reinforcement is size-aware and uses the existing live snapshot:
  - zero live coverage always permits the first available response wave, including against a small enemy wave;
  - after coverage exists, another full wave is eligible only if adding its `unitCount` moves projected coverage closer to `attackCounterCoverageRatio`;
  - a relevant counter below `rescueAllyAliveRatio` may still receive emergency reinforcement.
- This guard runs before `decisionAccuracy` randomness. Low-accuracy AI cannot repeatedly use an already-covered enemy as a spawn trigger.
- Do not simplify this back to `coverage < attackCounterCoverageRatio`: a tiny deficit must not spawn an entire extra wave when the resulting overshoot is worse than waiting.
- `decisionAccuracy` controls whether a complete spawn decision is intelligent or follows the low-accuracy deliberate/random branches. In current `assets/Test.scene`, SmartArmyBrainB may serialize at `0.1` and SmartArmyBrainA at `1`, but an enabled `LevelSettings` can override BrainB at runtime.

### SmartArmyBrain Opening Max And LevelSettings

- SmartArmyBrain now handles its own `battle-wave-spawned` event to update `hasReachedMaxAliveWavesOnce` immediately.
- This prevents missing the opening-aggressive cutoff when the max-th wave appears but another wave dies before the next AI interval.
- Enemy-wave fast react still obeys minimum interval, chance, max-alive-wave, unlock, affordability, reachability, and response-coverage gates.
- `LevelSettings` now supports optional min/max scaling for `fastReactCounterChance`; the default maximum is `1`.

### Immediate Wave Banner Transfer

- Banner holder transfer no longer uses any tween:
  - the existing banner reparents immediately to the replacement representative holder;
  - local position is reset to `(0,0,0)`;
  - cached base scale is restored in the same update.
- Removed obsolete transfer machinery:
  - `Tween` / `tween` imports from `BattleWave`;
  - `waveBannerTransferTarget`;
  - `waveBannerTweenDuration` from `BattleWave`, `GameManager`, and `assets/Test.scene`;
  - scale-out/scale-in and detached transfer state.
- Holder selection, holder-death notification, banner pooling, icon/material refresh, healthbar refresh, and camera visibility behavior are unchanged.
- Do not reintroduce flight or scale tween unless the user explicitly asks. The accepted visual is immediate teleport to the new holder.

## Accepted 2026-07-09 Office Changes

### SmartArmyBrain Path Priority

- Counter target eligibility remains front-to-back per lane.
- "Near the hero" emergency priority is now gated by travel progress:
  - `DangerousThreatProgress = 0.75`;
  - progress is measured from the enemy team's spawn Z to this team's current hero/defend Z;
  - only enemy waves at or beyond `75%` progress are treated as true near-defend threats;
  - before that threshold, the AI may still counter, but it must not let "closest enemy relative to hero" behave like an emergency override.
- Among true near-defend threats, a target that is more than `2` world units closer to the defending hero remains the higher-priority threat.
- When eligible true near-defend targets are within `2` world units of each other, counter path quality is compared before the old weighted threat score:
  - zero ally blockers from spawn to target;
  - then exactly one blocker;
  - then multiple blockers.
- A clean counter path is based only on allies between spawn and the target. An ally farther beyond the target no longer makes that path look blocked.
- If no eligible target has reached the `75%` progress threshold, all eligible front targets compete mainly by path quality, coverage/struggling state, alive ratio, and engagement state instead of emergency proximity.
- This adds no Inspector setting and does not change affordability, coverage, fast-react, max-wave, unit-choice, lane-choice, or aggressive-forward gates.

### SmartArmyBrain Decision Accuracy

- Each normal spawn opportunity rolls `decisionAccuracy` once.
- An accurate decision:
  - rebuilds battlefield intel;
  - chooses the best reachable target using defend distance and path priority;
  - chooses the best available response entry;
  - chooses the target lane.
- An inaccurate decision does not rebuild or use tactical intel:
  - it rolls deliberate mistake with conditional chance `1 - decisionAccuracy`;
  - a deliberate mistake uses current intel and randomly chooses among affordable non-winning matchups (losing or neutral) against a front enemy that is not already being handled by an ally wave;
  - deliberate mistakes spawn on a random lane with normal forward, not always on the target lane, to reduce repeated low-accuracy responses piling onto one enemy;
  - when both choices exist, deliberate mistakes choose a genuinely losing matchup `80%` of the time and a neutral matchup `20%` of the time; this keeps low-accuracy AI weak without locking both teams into one deterministic counter pair;
  - do not select the single mathematically worst matchup every time; that deterministic extreme caused both teams to repeat one counter pair indefinitely.
  - if no losing/neutral matchup exists, it chooses the weakest available affordable matchup before falling back to random;
  - the remaining inaccurate decisions choose a random affordable entry, random lane, and roll aggressive-forward only from `aggressiveForwardChance`.
- Therefore `decisionAccuracy = 0` attempts a deliberate mistake every normal spawn decision, and should only log `NAIVE_RANDOM` when there is no valid front target / no usable mistake candidate.
- Approximate behavior probabilities are:
  - smart: `accuracy`;
  - deliberate mistake attempt: `(1 - accuracy)^2`;
  - random branch: `accuracy * (1 - accuracy)`, plus rare fallback when no deliberate mistake candidate exists.
- Fast react is an intelligent reaction:
  - it only proceeds when its `decisionAccuracy` roll succeeds;
  - if it proceeds, the newly spawned enemy remains its fixed reaction target and the AI chooses the best counter on the target lane;
  - at `decisionAccuracy = 0`, fast react cannot occur.
- Hard global gates remain independent of intelligence: affordability, max alive waves, and spawn timing are still enforced for naive decisions. Tactical gates such as reachability, coverage, and nearly-dead filtering apply only to intelligent counter decisions.
- `LevelSettings.allowDecisionAccuracy` continues to scale this same `0..1` value; its Inspector tooltip now reflects deliberate mistakes at the low end.
- `LevelSettings.decisionAccuracyMin` now defaults to `0.1` rather than `0`. The tested `0.1` result keeps the first-level AI very weak while avoiding the deterministic troop loop seen at exact zero.
- The curve remains linear across campaign levels and is clamped to `0..1`; no extra curve knob was added.
- LevelSettings spawn-delay fields keep their serialized names but use clearer Inspector labels and ordering: `Easy Spawn Delay Min/Max`, then `Hard Spawn Delay Min/Max`.

### Unit Unlock And Emergency Response

- Every `UnitPrefabEntry` now owns an `unlocked` boolean, defaulting to `true`.
- `BattleUnitDatabase` is the source of truth for unlock state. `GameManager.isValidSpawnEntry()` enforces it for affordability queries, AI/player selection, auto spawn, direct entry/name spawn, formation spawn, prefab-map setup, and prewarm.
- Locked entries are excluded from prewarm and spawn selection. Existing pooled/spawned units are not retroactively removed.
- Player unit icons inherit the existing unavailable tint because `canAffordUnitName()` now rejects locked entries. Tapping a locked icon is ignored with a warning and cannot leave a false selected highlight. No separate lock-icon UX was added.
- SmartArmyBrain accurate-response tiers are:
  - real unlocked/affordable counter;
  - otherwise random unlocked/affordable troop.
- The random fallback is still a response tier and uses the same coverage/overshoot gates, so it should not repeatedly pile extra waves onto an already handled target.
- There is no Stronger/SameType fallback in the accepted source. It was tested and rejected because "stronger" often selected cavalry, which then fed spear counters and made max-AI decisions worse.
- Hero waves remain excluded from troop counter/emergency-response selection.
- Fast react and normal interval decisions use the same response-tier logic.
- Live coverage uses the currently best available tier and accepts a living response of equal or better quality. This prevents CP/unlock changes from making the AI forget a better response already on the field.
- Coverage relation, front-enemy reachability, struggling-response rescue, and size-aware overshoot protection remain unchanged.
- `CounterSettings.getCounterScore()` must match actual damage calculation and now uses the family counter `damageMultiplier` only. The removed `receivedDamageMultiplier` field must not be reintroduced.

### Accepted AI Non-Issues

- A fully intelligent AI may intentionally wait when no spawn would improve the current response/coverage situation. Do not add a mandatory random fallback merely to keep CP spending equal.
- Exact `decisionAccuracy = 0` can repeat troop choices because the counter graph has few deliberately losing options. This is accepted; campaign level 1 starts at `0.1` for variation.
- Difficulty is intentionally influenced by accuracy, fast react, spawn interval, max waves, CP, and aggressive chance together.
- The current project does not use defensive counter rules. Do not reopen defensive-rule interpretation unless such rules are added again.

## Current Unit / Wave Flow

### Forward

- Waves spawn into forward mode.
- Normal forward uses a wave scanner, usually the representative/front unit.
- Scanner refresh is throttled by the wave/unit target-search interval.
- Scanner target selection must scan candidates in range and choose a target that already satisfies lane + passed-forward release rules. Do not revert it to "nearest enemy first, then reject" because one invalid nearest enemy can hide a valid same/adjacent-lane release target.
- Normal forward can release the whole wave to freehunt/combat when:
  - scanner passes a same-lane target along forward direction;
  - scanner passes an adjacent-lane target along forward direction;
  - scanner reaches/passes enemy hero line and finds the enemy hero;
  - attack-range contact or retaliation starts combat.
- There is a same-lane initial-forward combat gate:
  - release from first same-lane contact can wait until enough units are engaged;
  - threshold is based on the unit entry's `maxUnitPerRow`;
  - non-busy units paused by this gate can be returned to forward by `refreshInitialForwardCombatGate()`.

### Aggressive Forward

- Aggressive forward is lane-committed.
- It ignores ordinary adjacent-lane unit pass/release.
- It still releases through:
  - same-lane passed target;
  - same-lane attack-range contact;
  - enemy hero line;
  - adjacent-lane enemy hero special case.
- While a unit is still in aggressive forward, its own attack-range acquisition is lane-locked:
  - a ranged unit such as an archer must not cancel aggressive forward just because a different-lane enemy entered its weapon range;
  - normal forward still uses the normal same/adjacent-lane scanner release rules;
  - this is filtered in `Unit.isValidEnemyWithinAttackRange()`, so cached attack-range targets cannot bypass it.
- Adjacent-lane retaliation during aggressive forward is a deliberate solo exception:
  - the unit that is hit may leave forward and fight alone;
  - the rest of the wave stays in aggressive forward;
  - "adjacent/different lane" for this solo exception is based on each unit's current X position mapped to the nearest lane, not only the wave's dynamic `laneId`;
  - ranged/off-range retaliation is also a solo exception: if the attacker can damage the unit while still outside that unit's own effective attack range, the damaged unit peels off to chase alone;
  - once that solo unit has no busy/target state, it resumes normal forward, not aggressive forward;
  - this exception must not be applied to normal forward.
- When the whole wave leaves forward for same-lane freehunt/combat, aggressive-forward mode is cleared only for that wave-level release. Later wave recovery is normal forward.

### Freehunt / Combat

- Any real attack-range contact can push involved waves into freehunt/combat.
- `Unit.attackRange` means weapon reach from body edge, not center-to-center distance.
- Effective combat contact range is `self.radius + enemy.radius + attackRange`.
- `BattleSpatialGrid` tracks max unit radius per team so unit attack queries can get a broad candidate set and then filter by exact effective range.
- A unit with no target can borrow a valid target from a teammate in the same wave.
- Target refs must respect pooled-unit validity/life-id checks.
- Freehunt returns to forward only when every alive unit in the wave:
  - is not busy;
  - has no valid enemy target;
  - has confirmed no target from the latest target-search cycle.
- If any alive unit is busy, still has a target, or has not confirmed no target yet, the wave should not resume forward.
- Waiting for target/search state to clear is intentional and should not be treated as a bug by itself.
- After the wave is allowed to leave freehunt/combat and resume forward, each alive unit resolves its own lane position:
  - units already inside the wave's current lane area immediately forward;
  - units outside the lane area enter a local back-to-lane phase and move sideways toward that lane at normal `maxSpeed`;
  - once a unit's center enters the lane area, it switches to forward; it does not need to return to lane center or a fixed formation slot;
  - this phase uses `GameManager` lane bounds from `battleMinX`, `battleMaxX`, and `laneCount`;
  - attack-range contact or retaliation still wins over lane return, so a unit can be pulled back into combat while returning;
  - dynamic lane voting is temporarily held while any unit in the wave is still in this back-to-lane phase, preventing laneId from changing under the returning units.
- Before `tryResumeForward()` actually switches a wave out of freehunt, it forces one dynamic lane refresh. This prevents a stale `laneId` from making units walk horizontally toward an old lane after combat.
- This is intentionally not old regroup-to-slot: there is no whole-wave wait, no slot assignment, and no forced center-line formation.

### Dynamic Lane

- Lane ID is strategic metadata for SmartArmyBrain and display logic, not a regroup command.
- Dynamic lane is based on alive unit positions / majority lane logic.
- Dynamic lane uses simulation `agent.pos.x` when available, with node world X only as fallback.
- Ties prefer current lane; otherwise closest lane to average X wins.
- Dynamic lane voting skips waves that currently have any unit in the back-to-lane phase. The laneId chosen before forward recovery must stay stable until those units finish returning.
- Lane voting is main-thread and has not been proven to be a bottleneck.

## Hero Rules

- Hero uses `Unit` / `UnitBehavior`, but is a special entity:
  - not a troop type for counter rules;
  - not a normal minimap/wave icon target;
  - hero-vs-anything damage ignores `CounterSettings`;
  - kills involving hero are not counter kills.
- Before unlock, steady hero guards around home.
- Steady hero can keep a valid retaliation target even when attacker is outside guard zone, so ranged attackers cannot safely shoot it forever.
- Hero guard uses the same edge-based attack range as normal units.
- Hero phase no longer forces full-map/permanent freehunt.
- When unlocked, hero behaves like a one-unit mid-lane forward wave and uses normal forward/freehunt rules.

## SmartArmyBrain

- `SmartArmyBrain` decides spawn strategy only. It does not directly control unit movement, combat, forward/freehunt, lane voting, workers, RVO, banners, or healthbars after spawn.
- It runs on a spawn interval.
- It builds lane intel and enemy-wave intel from current alive waves.
- Response coverage is live snapshot data, not historical assignment data. Do not restore `assignedCounterCount`, `addCounterAssignment()`, or `getCounterCoverageRatio()` on `BattleWave`.
- One response wave cannot cover every enemy lined up in the same lane:
  - if its units have targets, only units targeting that specific enemy count;
  - if it has no targets, it covers only the first enemy ahead.
- It scores threats using response coverage, alive ratio, distance to own hero/spawn, engagement/free status, clean-path priority, ally blockers from spawn to target, and whether same-lane ally responses look like they are failing.
- It prefers uncovered enemy waves with the best currently unlocked and affordable response tier:
  - real counter if any affordable unlocked counter exists;
  - otherwise random affordable fallback.
  - There is no accepted same-type or stronger emergency tier.
- Target reachability is resolved before threat score: a rear wave cannot win priority while another enemy wave stands between it and this team's spawn on the same lane.
- A fully covered wave is not a new response candidate unless its relevant response pressure is visibly failing.
- Snapshot/intel rebuild is not the same thing as deciding to spawn:
  - normal AI only decides/spawns when its timer reaches `nextInterval`;
  - fast react only decides/spawns when a new enemy wave event arrives, `minSpawnInterval` is satisfied, the chance roll passes, and all spawn gates pass;
  - rebuilding intel is just "looking at the board", not automatically "pressing spawn".
- `decisionAccuracy` is the main combined knob for counter correctness and lane correctness:
  - `1` means best available response and best reachable lane;
  - lower values increasingly use deliberate non-winning matchups and random choices according to the probability model documented above.
- `fastReactCounterChance` is a separate reaction-speed knob:
  - higher values make the AI more likely to answer a newly spawned enemy immediately after min interval;
  - it also requires an accurate `decisionAccuracy` roll and must not ignore max-wave, unlock, or affordability gates.
- `enableDecisionStats` is an optional runtime telemetry switch:
  - disabled by default;
  - when enabled, it logs actual-match counts for aggressive spawns, normal spawns, intentional waits, and hard skips;
  - percentages use `aggressive + normal + wait` as the denominator, while hard skips are reported separately because max-wave / no-CP gates are not tactical wait decisions;
  - use this to measure one concrete playtest instead of guessing theoretical probabilities.
- Opening aggressive rule:
  - SmartArmyBrain tracks whether its team has ever reached `maxAliveWaves`;
  - before first reaching max alive waves, response/opening spawns use aggressive forward;
  - after that, response/opening spawns use normal forward;
  - if max-alive limit is off, opening aggressive phase is considered already complete.
- Response aggressive-forward detail:
  - if the chosen response lane is the target enemy's lane and at least one ally wave blocks the route from spawn to target, the spawn is aggressive forward;
  - if the chosen response lane is the target enemy's lane and the lane is fully clean (`allyCountInLane <= 0` and `allyBlockersFromSpawn <= 0`), the spawn is also aggressive forward;
  - if there are allies in the same lane but none between spawn and target, the spawn falls back to normal `shouldSpawnAggressiveForward()` opening-phase behavior;
  - this is intentional so responses spawned into a lane with ally traffic can still push through instead of behaving like a slow normal-forward support wave.
- Response coverage remains a candidate gate, but it is recalculated from living/currently relevant responses at every intel rebuild. A dead, redirected, or no-longer-relevant response cannot permanently suppress reinforcement.
- Do not replace the size-aware reinforcement check with a simple `coverage < required` test. A tiny coverage deficit must not spawn an entire extra wave when that would overshoot the requested ratio more than waiting.
- Avoid reintroducing separate "max blockers", "max lane traffic", or "deferred target cooldown" knobs unless the user explicitly asks.

## Player Controller / Bottom UI

- `PlayerArmyController` supports Inspector-driven lane picker and unit icon mapping.
- Current UX is unit-first, lane-second:
  - tap a unit icon to select unit type;
  - lane icons are hidden until selected unit type is currently affordable;
  - tap a lane icon to spawn selected unit on that lane;
  - double tap same lane within `doubleTapWindow` to spawn aggressive forward.
- Unit icons use a static `selected` child highlight.
- Affordability/cooldown/max-wave blocking is shown by tinting unit icon root black 50%.
- Lane `selected` child highlights are intentionally disabled for now because they made bottom UI noisy.
- After successful player spawn, lane picker container is hidden and selected unit icon is cleared.
- During cooldown, unit selection is allowed, but lane icons are blocked/tinted.
- Player spawn cooldown drives `power-bar-container/bar` width.
- Player also has `maxAliveWaves`.
- Use existing `GameManager` helpers for affordability and alive-wave count. Do not duplicate database/CP scans in UI.

## Banner / Wave Healthbar

Current accepted banner direction:

- One banner prefab can be shared by all troop types.
- `BattleUnitDatabase.waveBannerMaterial` is a shared material for troop banners.
- Each `UnitPrefabEntry` has `waveBannerIconId`.
- `UnlitBillboard.effect` supports an icon sheet:
  - shared `mainTexture`;
  - `sheetColumns`;
  - `sheetRows`;
  - per-instance icon id through instanced attribute;
  - per-instance background/team color through instanced attribute.
- `GameManager.applyWaveBannerAppearance()` applies the shared banner material and instanced icon/background data only to banner icon renderers.
- `GameManager.getWaveBannerRenderers()` intentionally skips child renderers with `HealthBar3D`, so the wave healthbar material is not replaced by the banner icon material.
- `Banner.prefab` currently has:
  - root `Banner`;
  - child `Banner` for icon;
  - child `Healthbar` using `HealthBar3D`.
- `BattleWave` caches runtime health:
  - `runtimeHealthFrame`;
  - `runtimeHealthRatio`;
  - `totalMaxHealth`;
  - `getRuntimeHealthRatio(frame)`;
  - `invalidateRuntimeHealth()`.
- `GameManager.updateWaveBannerHealthBar(wave)` updates the banner's `HealthBar3D` from wave total health.
- `notifyUnitWillDespawn()` invalidates and refreshes wave health before unit pooling.

Banner holder/lifecycle:

- `BattleWave` owns one representative holder and one optional wave banner node.
- Representative holder is picked from alive units near wave centroid and kept stable while alive/valid.
- Holder death/despawn is event-assisted so the banner should not stay on pooled inactive units.
- Holder transfer is immediate:
  - old holder invalid -> select the replacement representative;
  - reparent the existing banner directly to the replacement holder;
  - reset local position to `(0,0,0)` and restore cached base scale in the same update.
- There is no flight tween, scale tween, detached transfer phase, or transfer-in-progress guard.
- `waveBannerTweenDuration` is obsolete and should not be restored to `BattleWave`, `GameManager`, or scene serialization.
- Banner node is pooled by `GameManager`.
- `waveBannerRefreshIntervalFrames` defaults to `12` and only throttles the safety sweep over `wave.refreshWaveBanner()`.
- Camera-driven banner visibility is no longer checked every frame:
  - `GameManager.waveBannerVisibleByCamera` is the source-of-truth snapshot.
  - orbit mode changes it through `battle-camera-banner-visibility-blocked`;
  - topdown zoom changes it through `battle-camera-topdown-zoom-range-changed`;
  - `GameManager.processWaveBanners()` resolves camera visibility only when dirty or on the `waveBannerRefreshIntervalFrames` fallback.

Unit healthbar / banner swap:

- Zoom far / topdown: wave banner group is visible; unit healthbars are hidden.
- Zoom near / orbit: wave banner group is hidden; unit healthbars may show.
- Unit healthbars show only for units whose health is below full.
- `UnitProps.takeDamage()` / `heal()` update health ratio immediately.
- Unit healthbar visibility refreshes through each unit's `targetSearchIntervalFrames`, not every frame.
- `HealthBar3D` has no `update()` and only changes renderer/instanced attributes via `setHealthRatio()` or `setDisplayActive()`.
- `HealthBar3D.hideWhenFull` remains useful as a local renderer guard.

Why the old 2026-07-06 zoom/unit-healthbar attempt failed:

- It mixed wave banner lifecycle and per-unit healthbar lifecycle too tightly.
- It treated camera zoom as a broad per-frame controller instead of a stable snapshot/dirty source of truth.
- It touched banner attach/reparent/tween/material/icon state while banners were being pooled and moved between holders, causing flicker, icon id reset, and banner lag.
- It did not define a narrow display rule, so too many unit healthbars appeared.
- It created/used parallel state names such as `unitHealthBarsVisibleByCamera`, `setUnitHealthBarsVisible`, `applyCurrentUnitHealthBarVisibility`, `applyUnitHealthBarVisibility`, `setVisibilityAllowed`, and `visibilityAllowed`.

Why the current approach works:

- Banner remains owned by `BattleWave`; unit healthbar remains owned by `UnitProps` / `HealthBar3D`.
- `GameManager.waveBannerVisibleByCamera` is the one camera visibility snapshot used by both banner and unit healthbars.
- Camera changes are event/dirty driven, with interval fallback, not per-frame polling.
- Unit healthbar visibility reuses `targetSearchIntervalFrames` instead of introducing a new throttle.
- Health ratio updates are event-driven by damage/heal.
- Renderer/material work stays instanced and local; no banner material is applied to healthbar renderers.

## RVO / Local Avoidance

- RVO remains local avoidance plus steering, not long-range pathfinding.
- The 2026-07-12 rear-wave bypass / edge-sidestep experiments were tested and rejected:
  - it initially helped some rear waves pass a slower ally wave;
  - in denser battles it caused unnecessary diagonal movement toward ally waves in other lanes;
  - later edge-marker versions still made waves split or sidestep too early and made lane/back-to-lane symptoms harder to read;
  - accepted behavior is to keep normal RVO/local ally overtake only.
  - Do not restore `processWaveForwardBypasses`, `forwardBypass*`, `forwardEdgeSidestep*`, wave-level blocker edge scans, or forward velocity bias in `Unit.updateForwardPrefVelocity()` without an explicit new experiment.
- Ally overtake is proactive:
  - only for movable `onForward` agents with `enableAllyOvertake`;
  - considers same-team blockers ahead when blocked/locked/not-forward/too slow for several steps;
  - uses local clearance from neighbor list to choose side;
  - uses side locks/hold frames to reduce jitter.
- The `passedRadius` pass-through experiment was rejected and reversed because waves could still visually dodge/lane around blockers through overtake behavior. Do not restore `passedRadius` or RVO-agent `waveId` for this problem.
- `canBePush` is the current accepted blocker-pressure experiment:
  - `UnitPrefabEntry.canBePush` defaults to `false`;
  - `Unit.canBePush` is copied from the database when spawning/reusing units;
  - RVO agents carry `canBePush`;
  - hard separation treats a locked/busy unit with `canBePush = true` as movable, so other units can physically shove it aside;
  - velocity movement, target selection, combat busy state, attack range, normal radius, obstacles, and bounds are otherwise unchanged.
- Aggressive-forward solo retaliation fix:
  - when a forward/aggressive unit is hit by a different-lane ranged attacker, `reactToAttacker()` can set a solo retaliation target without releasing the whole wave;
  - `BattleWave.refreshInitialForwardCombatGate()` must not force a unit with a valid target or active solo-aggressive skirmish back into forward, otherwise the unit appears to ignore arrows and keep marching.
- Ally overtake currently may choose either side on any lane. The attempted lane-biased left/right-only overtake and the attempted lane-center-biased side choice were both reverted because they did not feel good enough in testing.
- Worker and fallback logic must stay mirrored:
  - `assets/scripts/rvo/RVO.ts`;
  - `assets/scripts/rvo/RVOWorkerSimulator.ts` embedded worker source.
- Unit visual facing prefers actual `agent.vel` only when it is large enough and the visual node has actually moved enough; otherwise it falls back to `prefVel`.

## Pooling / Packed Wave Ideas

Pooling status from 2026-07-08 source review:

- Inactive pooled unit nodes should not run `Component.update()` and should not render.
- Current despawn path is broadly correct:
  - `UnitSpawner.despawnUnit()` removes the agent from the simulator;
  - `Unit.resetForDespawn()` clears target/runtime references and sets `agent = null`, `sim = null`;
  - `GameManager.despawnUnit()` removes normal units from `teamA` / `teamB`;
  - `BattleSpatialGrid` skips inactive units with `!node.activeInHierarchy`.
- Therefore pooled inactive units should mainly cost resident memory, not ongoing logic/RVO/grid/render work.
- Still watch for global listeners, schedules, tweens, or newly added components on pooled prefabs; those can create hidden cost if not cleared.

Packed forward idea discussed but not implemented:

- User suggested grouping a freshly spawned forward wave under the scanner/front unit while all units share one direction, then unpacking when the scanner engages or triggers forward-release.
- Simple reparenting alone is unlikely to give a large win if child units remain active full visual units, because renderers/animation/child world transforms still exist.
- A safer first experiment would be "sleep follower logic during initial forward":
  - scanner remains the only active logic/scanner/RVO agent;
  - followers keep visual positions or cheap visual following;
  - followers do not run target search, attack checks, or RVO until unpack;
  - unpack restores world positions, RVO agents, target state, and normal wave logic.
- This would mostly reduce gameplay/RVO cost. If trace barely improves, the real target is active renderer/animation/object count.
- A stronger but more intrusive direction is a packed-wave visual proxy during initial forward, then spawning/unpacking real unit visuals only near combat. This changes visual/game feel and needs explicit user approval.

## Unity WebGL Port Discussion

- Do not assume a Unity WebGL rewrite automatically solves the current performance problem.
- If ported with the same architecture, it may have the same or worse issues:
  - one unit equals one `GameObject`;
  - each unit has `MonoBehaviour.Update`;
  - each unit has its own `Animator` / `SkinnedMeshRenderer`;
  - object-per-unit combat/targeting remains active.
- Unity Web/mobile browser still has WebGL/WebAssembly/browser memory constraints.
- Unity can be a better target only if the rewrite changes architecture:
  - data-oriented simulation rather than per-unit update scripts;
  - instanced/batched rendering from the start;
  - fewer active `Animator` / `SkinnedMeshRenderer` objects;
  - packed-wave or proxy visuals before combat;
  - careful WebAssembly memory/GC setup.
- In short: the useful pivot is not "Cocos vs Unity" alone, but "object-per-unit architecture vs data-oriented/instanced/packed architecture".

## Performance Notes

Global rules:

- Mobile browser performance is a core design constraint.
- Avoid optimistic desktop/editor-preview conclusions.
- Check frame pacing, GPU/render, main thread, worker CPU, and worker heap.
- When comparing traces, separate normal/no-throttle captures from DevTools CPU slowdown captures. Slowdown 4x reports must only be compared against other slowdown 4x reports, not raw normal traces.
- If trace conditions are unclear, mark the comparison as uncertain and avoid strong conclusions.
- Before adding a new throttle/snapshot/scan/knob, first check whether an existing helper/cache/gate already answers the question.
- Avoid per-frame logic whenever possible. Prefer event, dirty flag, existing interval, or existing snapshot/cache. Per-frame work should be reserved for movement, camera smoothing, animation, and other behavior that visually requires continuous updates.
- The local `cocos-performance-optimize-skills` includes the project rule to avoid new per-frame polling/parallel state when existing event, dirty flag, interval, snapshot, or wave-level truth can be reused.
- Keep debug logs behind Inspector toggles.

Current known render conclusions:

- Recent tests replacing high-poly unit mesh with capsule/cube did not produce a major win.
- Therefore vertex count alone is not the current proven bottleneck.
- Reducing Node transform writes can still help render-side cost because Cocos must sync transform/render data when nodes are marked dirty. The accepted optimizations are small guards around camera transform/FOV, forward-facing rotation, busy locked sync, banner local position, and healthbar renderer/color setters.
- Extra active cameras are a real render cost. Re-check camera components before comparing traces.
- Unit body rendering appears to batch/instance reasonably by team/material in current captures.
- Wave banner icon sheet/shared-material path is the current accepted direction for banner batching.
- `bufferData` seen in Spector is mostly dynamic/UBO-style engine data, not proof that cube mesh vertices are the bottleneck.
- Only two skinned meshes are expected for heroes in the recent cube tests; do not blame "many skinned meshes" unless re-verified.
- UI/minimap should not be blamed in traces where minimap/healthbar/banner were explicitly disabled.
- Camera-driven banner/unit-healthbar visibility now uses the snapshot/dirty path described in `Banner / Wave Healthbar`. Do not reintroduce per-frame camera polling for this.
- Frame-interval work should stay staggered:
  - RVO and spatial-grid rebuild already use different frame offsets.
  - Unit attack/search/healthbar checks use each unit's randomized `updateOffset`.
  - Wave forward scan uses `wave.id` as phase.
  - Dynamic lane voting intentionally uses `wave.id + floor(interval / 2)` so the same wave does not scan forward and vote lane on the same frame.
  - Wave banner holder/health refresh is staggered per wave id instead of refreshing every wave in one banner frame.

Rejected render direction from 2026-07-07:

- The attempted "item 4" render/shader cleanup changed render/material-related state and repeatedly broke banner/healthbar rendering or sort order. It was reversed.
- Do not use that failed attempt as a starting point. If render-state optimization is revisited, isolate one flag/material/shader change at a time and verify banner icon, wave healthbar, unit healthbar, orbit/topdown visibility, and Spector draw behavior.

Recent trace interpretation to preserve:

- Workers were not the proven main bottleneck in the 2026-07-06 traces.
- Watch worker heap lower envelope in longer mobile-like captures; desktop V8 behavior is not proof for mobile browsers.
- Major GC remains a risk when adding VFX, damage numbers, projectiles, or heavier UI.
- For final performance judgment, compare release mobile builds on real devices.
- 2026-07-07/08 CPU slowdown 4x traces clarified several things:
  - `Trace-20260707T222045` full-unit baseline: `FireAnimationFrame` avg about `4.454ms`, p95 `11.640ms`, p99 `14.601ms`, `45` frames over `16.67ms`.
  - `Trace-20260707T235904` after write guards/yaw cache but before half-unit test: avg about `4.344ms`, p95 `10.877ms`, p99 `13.355ms`, `32` frames over `16.67ms`.
  - `Trace-20260708T001551` with all `unitCount` temporarily set to `5`: avg about `4.043ms`, p95 `10.200ms`, p99 `12.599ms`, `18` frames over `16.67ms`.
  - Halving unit count reduced `Unit` profile cost from about `97us/frame` to about `52us/frame`, nearly proportional.
  - Total frame time only improved by about `6-7%`, so per-unit gameplay logic is not the only limiting factor.
  - Do not expect reducing unit count by 50% to reduce whole-frame cost by 50%; `Unit.update` is only a small part of the total frame.
- Important interpretation correction:
  - Do not state vague conclusions like "the bottleneck is render/transform/animation/engine sync" unless the next proposed test isolates which layer is responsible.
  - Prior tests changing high-poly/skinned unit visuals to simple capsule/cube and snapping rotation did not produce a major win, so vertex count, skinning, and rotation snapping are not currently proven primary bottlenecks.
  - The current evidence says: unit logic scales with unit count, but much of the frame cost is outside `Unit.update`; the exact culprit still needs isolated tests.
- Useful next tests if performance investigation resumes:
  - Test A: keep unit count/logic, temporarily disable unit renderers only. If frame time improves strongly, renderer/object render count is the likely target.
  - Test B: keep renderers active, temporarily freeze movement/simulation after dense spawn. If frame time improves strongly, transform/movement sync is the likely target.
  - Test C: compare release build without Preview/source-map/editor/devtool overhead against Preview slowdown traces.
  - Test D: test "sleep follower logic during initial forward" without changing visuals; if it barely moves frame time, active renderer/animation object count is more important than per-unit logic.
- `Trace-20260707T180002` improved over the bad `16:32` report but is still not back to the lighter 2026-07-02/06 baseline:
  - `18:00`: avg `3.486ms`, p95 `5.832ms`, p99 `8.490ms`, `76` frames over `8.33ms`, `6` over `16.67ms`.
  - `16:32`: avg `4.171ms`, p95 `7.239ms`, p99 `9.231ms`, `116` frames over `8.33ms`, `6` over `16.67ms`.
  - Earlier 2026-07-02/06 normal traces often had avg around `1.1-1.8ms`, p95 around `1.5-4.2ms`, and very few frames over `8.33ms`.
  - Conclusion: today's accepted transform/write guards help, but the current state is still borderline for mobile-browser headroom and should not be called "done" for VFX scaling.

### 2026-07-19/20 Performance Audit After BattleArmyBrain / Ranged / Telemetry Updates

Context:

- User sent `Trace-20260719T222410.json.gz`.
- Test condition: browser performance trace, game speed x2, DevTools CPU slowdown 4x.
- User asked to estimate real gameplay performance without telemetry and decide whether anything should move to worker.
- Important scene state at audit time:
  - `GameManager.enableBattleTelemetry = false`;
  - `downloadBattleTelemetryOnEnd = false`;
  - `storeBattleTelemetryReportsInBrowser = false`;
  - `reloadPageAfterBattleTelemetryExport = false`;
  - `SpectorDebugger` node/component disabled;
  - `LevelSettings` node disabled;
  - `useWorkerRVO = true`;
  - `useWorkerSpatialTargetQuery = true`;
  - `spatialGridUpdateInterval = 20`;
  - `battleTimeScale = 1` in scene, though the trace/test itself was described as speed x2.

Trace findings:

- Ignore the initial `CpuProfiler::StartProfiling` spike. In this trace it creates a very large artificial profiler-start frame.
- After excluding the profiler-start artifact:
  - `FireAnimationFrame` avg about `4.72ms`;
  - p95 about `11.58ms`;
  - p99 about `18.76ms`;
  - about `70 / 4552` frames over `16.67ms`;
  - about `4 / 4552` frames over `33.33ms`.
- Under slowdown 4x, this is acceptable for a 30 FPS mobile-browser target and often still under 60 FPS budget, but p99/hitches still need watching once VFX/UI content grows.
- `BattleArmyBrain` / `BattlefieldEvaluator` are not proven bottlenecks:
  - `BattlefieldEvaluator.rebuild()` sampled around only a few ms total over the whole trace;
  - `BattleArmyBrain.thinkAndSpawn()` was also only a few ms total;
  - individual support branches such as `trySpawnAntiSpearArcherSupport()` and `trySpawnClusterMonkSupport()` were negligible.
- Do not move `BattlefieldEvaluator` to worker at this point:
  - it runs only on spawn decisions, not every frame;
  - data volume is small;
  - moving it would add scene snapshot packing/serialization and more async state for little measurable gain.
- Worker threads were not hot:
  - RVO worker was mostly idle and short bursts only;
  - target-search worker was also light;
  - observed cost was more on main-thread message packing/postMessage and Cocos transform/render sync than on worker computation.
- Main-thread areas to keep watching:
  - `Unit.update` / `Unit.sync`;
  - `BattleSpatialGrid.flushNearestWorkerRequests`;
  - `BattleSpatialGrid.queryGrid`;
  - RVO bridge `step`;
  - Cocos engine render/transform paths such as `bufferSubData`, UBO update, `updateTransform`, `fillMeshVertices3D`, `updateInstancedWorldMatrix`;
  - GC, especially MajorGC when telemetry/VFX/damage numbers are enabled.

Implemented optimization in `assets/scripts/BattleSpatialGrid.ts`:

- Target-search worker no longer receives the full unit snapshot on every query batch.
- Main thread now tracks:
  - `targetSnapshotVersion`;
  - `workerTargetSnapshotVersion`.
- `BattleSpatialGrid.build()` increments `targetSnapshotVersion` after rebuilding the spatial snapshot.
- `flushNearestWorkerRequests()` sends the unit snapshot only when the worker version is stale.
- The worker keeps its own cached team grids and reuses them for later query batches that do not include a snapshot.
- If the worker receives a query before any snapshot has ever arrived, it safely returns no target for each request instead of throwing.
- `targetSnapshot` and packed request data were changed from `Float64Array` to `Float32Array`.
- Worker result buffer was changed from `Float64Array` to `Int32Array` because results are request id, target id, and target life id.
- Why this is safe:
  - battlefield coordinates are small, so `Float32Array` precision is enough;
  - query result ids/life ids are integers;
  - worker target validity is still checked on main thread through `unitsById` and `lifeId`;
  - fallback path remains unchanged.
- Expected effect:
  - lower postMessage payload size for most target-search batches;
  - less cloning/serialization pressure;
  - lower GC/packing pressure around `flushNearestWorkerRequests`;
  - no gameplay-rule change.

Implemented optimization in `assets/scripts/GameManager.ts`:

- Added early `enableBattleTelemetry` guards around telemetry calls that were still reached from gameplay methods:
  - damage;
  - kill;
  - combat point earned/spent;
  - despawn;
  - unit spawn;
  - wave spawn event;
  - hero wave register event.
- Purpose:
  - when `Enable Battle Telemetry = false`, telemetry should be truly off from `GameManager` call sites instead of entering `BattleTelemetry` just to return.
- Gameplay counts still work:
  - `killCount`;
  - `counterKillCount`;
  - CP reward logic;
  - UI refresh requests.
- Do not remove `BattleTelemetry` itself; it is still useful for balance testing.
- For performance captures meant to represent real gameplay, keep `enableBattleTelemetry = false` and the download/store/reload toggles off.

Implemented micro-optimization in `assets/scripts/Unit.ts`:

- In `findNearestEnemyInAttackRange()`, the enemy distance is now computed once and reused for the effective attack-range check.
- Previous flow computed distance, then called `isValidEnemyWithinAttackRange()`, which computed distance/effective range again.
- This is small but valid because attack-range checks run across many units at intervals.
- Behavior should be unchanged:
  - `isValidEnemy(e)` and aggressive-forward lane ignore checks still happen before distance comparison;
  - effective range still uses `attackRange + self.radius + enemy.radius`.

Verification performed:

- `BattleSpatialGrid.workerSource()` was extracted and executed in a Node smoke test:
  - first query sent a snapshot and returned the expected nearest enemy;
  - second query sent no snapshot and still returned the expected nearest enemy from the worker cache.
- Brace/paren/bracket balance check passed for:
  - `assets/scripts/BattleSpatialGrid.ts`;
  - `assets/scripts/Unit.ts`;
  - `assets/scripts/GameManager.ts`.
- `git diff --check` passed for the edited files.
- Local TypeScript compiler could not be run because this checkout currently has no local `typescript` / `tsc` binary. Do not claim full compile verification until Cocos/TS build is run.

Important follow-up:

- Run a new real build trace with telemetry off and compare against `Trace-20260719T222410`.
- Expected improvement should show mainly around:
  - `postMessage`;
  - `BattleSpatialGrid.flushNearestWorkerRequests`;
  - target worker request packing;
  - GC pressure around target-search batches.
- Do not expect this change to reduce Cocos render/transform sync cost.
- If the new trace is still borderline, next useful investigation should isolate:
  - renderer/object render count;
  - transform dirty propagation;
  - movement/RVO bridge;
  - GC allocations in hot unit/ranged-combat paths.
- Avoid broad rewrites or new worker systems until another trace proves a specific hot area.

## LevelSettings

- `assets/scripts/LevelSettings.ts` is optional.
- If node/component is disabled, it should not affect battle logic.
- It targets `SmartArmyBrain` references while keeping serialized property name `armyBrains` for scene compatibility.
- It can scale selected team values:
  - initial CP;
  - SmartArmyBrain decision accuracy;
  - spawn intervals;
  - max alive waves;
  - aggressive-forward chance;
  - aggressive empty-lane fastest-entry chance;
  - fast-react counter chance.
- `aggressiveForwardChance` and `aggressiveFastestEntryChance` are deliberately separate:
  - `aggressiveForwardChance` decides whether the AI attempts an empty-lane raid;
  - `aggressiveFastestEntryChance` decides whether that raid picks the fastest affordable entry or a random affordable entry.
- `assets/Test.scene` often uses `LevelSettings` for testing. If it is enabled at `currentLevel = 300`, it overrides SmartArmyBrainB to final-level values at runtime even when the serialized SmartArmyBrainB component still shows lower values such as `decisionAccuracy = 0.1`.

## VAT / Spector

- VAT prototype files may still exist but should not be integrated into battle unless the user explicitly resumes that experiment.
- User compared VAT to the current animated/instanced path and decided to stop pursuing VAT for now.
- `SpectorDebugger` is optional profiling tooling. Keep disabled outside profiling sessions.
- Do not attribute normal performance traces to Spector unless component/node is active.

## Do Not Resurrect Without User Approval

- Old regroup-to-slot / whole-wave lane-return movement. The accepted replacement is only the lightweight per-unit back-to-lane phase after `freehunt -> forward`.
- Old permanent full-map hero freehunt.
- Old `ArmyBrain` / DefenseMode interpretation.
- Minimap as an active gameplay feature.
- VAT battle integration.
- The failed zoom-based unit healthbar/banner swap from 2026-07-06.
