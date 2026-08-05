# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last synchronized: 2026-08-05, after progression storage v6, effective-boss-cap
Initial CP and Max Alive packages, one-loss rewarded-video rescue, and the
latest source/scene alignment pass.

This file describes the current authored source and active `assets/Test.scene`.
It replaces all progression v1-v4 proposals, telemetry conclusions, reset URLs,
and rescue rules. Read the source before making logic claims because Inspector
values override TypeScript defaults.

## Working Rules

- Update this file only when the user explicitly asks for a handoff update.
- Inspect relevant source and active scene data before answering project logic
  questions. This file is orientation, not a substitute for source inspection.
- Active AI is `BattleArmyBrain` plus `BattlefieldEvaluator`.
  `SmartArmyBrain` is legacy and must not receive new gameplay work unless the
  user explicitly re-enables it.
- Team A remains controlled by `BattleArmyBrain` and simulates the player.
- Telemetry is test evidence only. Never feed telemetry results back into
  runtime decisions.
- Do not alter tier-1 combat stats, counters, AI accuracy behavior, ranged
  support, lane choice, or wave costs to repair campaign progression unless
  evidence proves a defect in those systems.
- Increasing a wave's `unitCount` must not increase its battle CP cost. Gold
  already pays for unlock/count progression.
- Prefer one causal progression fix over new thresholds or several tuning
  knobs. The user explicitly dislikes incremental threshold tuning.
- Work with the dirty worktree. Do not revert user/Cocos changes and do not
  stage generated files without explicit instruction.

## Current Product Phase

Tier-1 symmetric battle balance and dynamic AI accuracy were tested before the
campaign phase. Current work evaluates player experience across a campaign:

- Team A accuracy is fixed at `1` and represents a skilled simulated player.
- Team B CP, accuracy, Max Alive, roster, and unit counts progress by level.
- Gold purchases represent player meta progression.
- Bosses intentionally create temporary difficulty spikes.
- Rewarded-video rescue is simulated by `adsReward` and a direct progression
  package; it does not grant Gold.
- `progressionEndLevel` decouples progression completion from total campaign
  length. With 100 total levels and end level 50, levels 51-100 use plateaued
  base stats/full tier-1 progression while boss modifiers still apply.

The active design is test code, not a finalized economy. Judge it by retry
shape, usefulness of Gold purchases, rescue frequency, and whether progression
creates agency rather than only by aggregate battle win rate.

## Source Of Truth

Progression work:

- `assets/Test.scene`: active Inspector values; authoritative over defaults.
- `assets/scripts/LevelSettings.ts`: difficulty curves, boss modifiers,
  persistence, packages, Gold, purchases, unlocks/counts, rescue, URL handling,
  and progression telemetry snapshots.
- `assets/scripts/GameManager.ts`: result integration, end conditions, report
  export, CP affordability, and progression reload.
- `assets/scripts/BattleTelemetry.ts`: battle report schema.
- `tools/battle-progression-roadmap.html`: human-readable duplicate of the
  current formulas. Keep synchronized, but source plus scene win on conflict.

AI/combat work:

- `assets/scripts/BattleArmyBrain.ts`
- `assets/scripts/BattlefieldEvaluator.ts`
- `assets/scripts/CounterSettings.ts`
- `assets/scripts/BattleUnitDatabase.ts`
- `UNITSTATS.md`
- `assets/scripts/BattleSpatialGrid.ts`
- `assets/scripts/rvo/RVOWorkerSimulator.ts`

## Active Test Scene

### Campaign And Enemy Spine

```text
totalLevels = 100
progressionEndLevel = 50
currentLevel = 1
bossStagePace = 5
targetTeam = 1

allowCP = true
initialCombatPointMin = 250
initialCombatPointMax = 1040

allowDecisionAccuracy = true
decisionAccuracyMin = 0.4
decisionAccuracyMax = 1

allowMaxWave = true
maxAliveWavesMin = 3
maxAliveWavesMax = 10

allowInterval = false
bossInitialCombatPointMultiplier = 1.2
bossDecisionAccuracyMultiplier = 1.2
bossMaxAliveWavesMultiplier = 1.2
```

Other active test values:

```text
battleTimeScale = 3
useWorkerRVO = true
useWorkerSpatialTargetQuery = true
spatialGridCellSize = 4
autoDownloadCaptureJson = true
autoReloadProgression = true
purchasingSimulation = true
```

### Player Economy

```text
progressionStorageKey = battle-progression-v6
initialPlayerGold = 0
playerInitialCPStart = 300
playerMaxAliveStart = 4
playerMaxAliveMax = 10

winGoldPerEnemyCP = 1
lossGoldRatio = 0.25
lossesPerVideoReward = 1

unitUnlockCostMultiplier = 20
initialCPGoldPerPoint = 10
maxAliveBasePrice = 1000
```

Do not copy TypeScript defaults into analysis without checking the scene. Some
defaults intentionally differ from these active values.

## Enemy Difficulty Formula

For any level `L`:

```text
end = clamp(progressionEndLevel, 1, totalLevels)
t = clamp((L - 1) / (end - 1), 0, 1)

baseCP = round(lerp(250, 1040, t))
baseAccuracy = lerp(0.4, 1, t)
baseMaxAlive = round(lerp(3, 10, t))
```

Every fifth level is a boss:

```text
enemyCP = round(baseCP * 1.2)                 // no cap
enemyAccuracy = min(1, baseAccuracy * 1.2)
enemyMaxAlive = round(min(10, baseMaxAlive * 1.2))
```

The multiplier is not cumulative. Runtime recomputes each base from level and
applies one multiplier. The latest telemetry proves boss CP ratios remain
approximately 1.2 at every boss.

Max Alive is discrete, so its effective percentage differs after rounding:

- `4 -> 5` is effectively `x1.25`;
- `7 -> 8` is effectively `x1.143`;
- `8 -> 10` is effectively `x1.25` because `8 * 1.2 = 9.6` rounds to 10;
- the result is capped at 10.

The roadmap currently connects normal and boss totals as one sawtooth line and
plots accuracy multiplied by 1000 on the CP axis. This can visually exaggerate
boss jumps. It is a visualization issue, not runtime multiplier accumulation.

## Progression Runtime V5

### Reset And URL Contract

Clean 100-level run with progression ending at level 50:

```text
http://localhost:7456/?progression=1&resetProgression=1&currentLevel=1&TotalLevels=100&ProgressionEndLevel=50
```

Rules:

- `resetProgression=1` (alias `reset=1`) clears v1-v6 progression keys before
  initialization.
- A manually opened `currentLevel=1` URL without `progressionResume=1` also
  starts fresh.
- Auto reload removes reset parameters, adds `progressionResume=1`, and keeps
  the saved state.
- `currentLevel<=0` remains accepted as a reset request, but the explicit reset
  URL above is preferred.
- Reset initializes Gold 0, player CP 300, Max Alive 4, Spear/Sword count 5,
  zero ads, zero losses, and unclaimed package schedules.

### Saved State

Storage version 6 persists:

- current level, Gold, `adsReward`, and loss streak;
- player Initial CP and rescue overflow;
- deterministic CP and Max Alive schedules, claimed state, and claim source;
- rescue history;
- player Max Alive;
- total purchase count;
- per-family offered/unlocked/count state.

Only version 6 is sanitized into the active state. Other versions initialize a
fresh v6 state and cannot contaminate current results.

### Battle Lifecycle

At load:

1. Parse URL and clear storage when reset is requested.
2. Load/sanitize v6 state or create a clean state.
3. Apply saved player state.
4. Apply Team B level curve and boss modifiers.
5. If purchase simulation is enabled, repeatedly buy weighted affordable
   options, up to 100 purchases.
6. Apply purchased Team A state and run the battle.

At battle end:

1. Offer families introduced at the completed level.
2. A player win receives full effective enemy CP as Gold and advances a level.
3. A player loss repeats the same level. A valid exhausted loss receives 25%
   of win Gold on every loss; there is no cumulative per-level loss-Gold cap.
4. Every player loss increments the video-rescue streak; validity only gates
   loss Gold.
5. At one loss, attempt one boss-only direct package rescue.
6. Purchase simulation runs again and may buy multiple affordable options.
7. Save state, download telemetry, and reload unless campaign is complete.

### Unit Unlock And Count Progression

| Family | Enemy unlock | Start count | Count at end |
| --- | ---: | ---: | ---: |
| Spear | 1 | 5 | 10 |
| Sword | 1 | 5 | 10 |
| Axeman | 10 | 5 | 10 |
| Archer | 25 | 3 | 5 |
| Cavalry | 35 | 5 | 10 |
| Monk | 45 | 1 | 1 |

Enemy:

- unlocks immediately at the authored level;
- count grows by rounded linear interpolation from unlock count to max count;
- all counts reach their max by `progressionEndLevel`.

Player:

- starts with Spear and Sword;
- faces a newly introduced family first; it is offered after that battle;
- pays Gold to unlock it;
- may buy `+1` count packages up to current enemy count progression;
- retained rights remain available later;
- count upgrades do not change wave CP cost.

Prices:

```text
unit unlock = wave CP cost * 20
unit +1 count = unlock price / unlockCount
```

### Initial CP Packages

The schedule is generated dynamically from boss milestones through
`progressionEndLevel`:

- target cap at a milestone equals Team B effective CP at that milestone;
- boss `x1.2` is included, so the player sale cap targets the next boss's
  actual CP rather than its base CP;
- growth since the previous target is split across approximately half the
  normal levels in the segment;
- offer levels are deterministic, sparse, and occur before the target boss;
- package price is `delta * 10 Gold`;
- skipped packages remain available.

Active 100/50 schedule:

| Target | Offer levels | Deltas | Effective cap |
| ---: | --- | --- | ---: |
| 5 | 3, 4 | +39, +38 | 377 |
| 10 | 7, 9 | +49, +48 | 474 |
| 15 | 13, 14 | +49, +48 | 571 |
| 20 | 16, 17 | +48, +48 | 667 |
| 25 | 21, 23 | +49, +48 | 764 |
| 30 | 27, 28 | +49, +49 | 862 |
| 35 | 31, 34 | +48, +48 | 958 |
| 40 | 37, 39 | +49, +48 | 1055 |
| 45 | 41, 44 | +48, +48 | 1151 |
| 50 | 46, 48 | +49, +48 | 1248 |

### Max Alive Packages

Max Alive now uses the same package lifecycle as CP:

- target cap at a milestone equals Team B effective Max Alive, including boss
  multiplier and the Max Alive cap;
- each package grants exactly `+1`;
- deterministic offers occur before the target milestone;
- claims persist and may come from purchase or video rescue;
- package price is `1000 * currentMaxAlive / playerStart`.

Active schedule:

| Target | Offer | Delta | Player cap |
| ---: | ---: | ---: | ---: |
| 5 | 2 | +1 | 5 |
| 15 | 13 | +1 | 6 |
| 20 | 17 | +1 | 7 |
| 30 | 27 | +1 | 8 |
| 35 | 31, 32 | +1, +1 | 10 |

### Purchase Simulation

The simulated player buys repeatedly while Gold and legal options remain.
Selection is weighted random, not fixed priority:

- CP weight grows with current CP deficit;
- Max Alive weight grows with slot deficit;
- unlock weight grows with how long the offer has been waiting;
- count weight grows with the gap to enemy count.

Multiple packages can be purchased before one battle. Gold is the affordability
guard; package/unit milestone caps are the availability guard.

### Rewarded-Video Rescue

Rescue is attempted after one player loss and only on a boss. It succeeds
when:

- purchase simulation is enabled;
- an available current or future CP/Max Alive package exists, or a CP overflow
  step can be generated.

The runtime finds the earliest future CP and Max Alive packages, compares
normalized deficits against effective boss values, and pulls forward one
package of the larger deficit. A tie selects CP. A successful rescue:

- directly claims the package at zero Gold cost;
- increments `adsReward` by one;
- resets the loss streak;
- records source `video-rescue` and the action in telemetry.

If no future CP package remains but player CP is still below enemy CP, rescue
uses a CP overflow step based on the nearest package size. Rescue does not pull
unit unlock/count packages and does not guarantee that the next attempt wins.

## Latest Telemetry Evidence

Dataset:

```text
C:/Users/tranl/Downloads/
battle-telemetry-2026-08-03T19-38-20-136Z.json
through
battle-telemetry-2026-08-03T20-16-04-557Z.json
```

The range contains exactly 101 reports. It is a clean storage-v5 run beginning
at level 1 with player CP 300, Max Alive 4, Gold 0, and starting roster only.
It reaches boss level 45 but does not yet contain the post-third-rescue attempt.
This is historical v5 evidence; it does not describe the current v6 rescue
frequency or effective-boss-cap package schedule.

### Aggregate Result

```text
reports = 101
Team A wins = 44 (43.6% attempt win rate)
Team B wins = 57
normal battles = 45; Team A wins = 36
boss battles = 56; Team A wins = 8
video rescues = 15
simulated battle time = 4791 seconds (~79.9 minutes)
```

`48/57` losses occur at bosses. Normal levels are generally passable, but boss
retry cost grows heavily.

| Boss | Attempts | Losses | Rescues | Status |
| ---: | ---: | ---: | ---: | --- |
| 5 | 4 | 3 | 1 | cleared |
| 10 | 4 | 3 | 1 | cleared |
| 15 | 8 | 7 | 2 | cleared |
| 20 | 7 | 6 | 2 | cleared |
| 25 | 7 | 6 | 2 | cleared |
| 30 | 10 | 9 | 3 | cleared |
| 35 | 1 | 0 | 0 | cleared first try; stochastic outlier |
| 40 | 6 | 5 | 1 | cleared |
| 45 | 9 | 9 | 3 | ongoing after latest rescue |

### Multiplier Verification

Boss CP is not cumulative. Telemetry reproduces one `x1.2` multiplication:

| Boss | Base CP | Actual CP | Ratio |
| ---: | ---: | ---: | ---: |
| 5 | 314 | 377 | 1.2006 |
| 10 | 395 | 474 | 1.2000 |
| 15 | 476 | 571 | 1.1996 |
| 20 | 556 | 667 | 1.1996 |
| 25 | 637 | 764 | 1.1994 |
| 30 | 718 | 862 | 1.2006 |
| 35 | 798 | 958 | 1.2005 |
| 40 | 879 | 1055 | 1.2002 |
| 45 | 959 | 1151 | 1.2002 |

Accuracy also uses one multiplication and caps at 1. Max Alive appears less
uniform because of integer rounding; boss 35 is base 8 -> actual 10.

### Purchases And Rescue Power

Paid progression by the end of the range:

| Kind | Count | Gold spent | Power gained |
| --- | ---: | ---: | ---: |
| Initial CP | 10 | 3360 | +336 CP |
| Max Alive | 1 | 2000 | +1 |
| Unit count | 17 | 4102 | +17 units across waves |
| Unit unlock | 4 | 4920 | Axeman, Archer, Cavalry, Monk |

Video rescue supplied:

```text
10 CP rescues = +404 CP
5 Max Alive rescues = +5 slots
```

At the last report, Team A has all level-45 units/count caps, CP 1040, Max
Alive 9 before result, and 18,998 unused Gold. Team B has CP 1151 and Max Alive
10. The last result claims `+1 Max Alive`, so the next attempt should start at
CP 1040 / Max Alive 10 against CP 1151 / Max Alive 10.

The run has not abandoned or deadlocked. The report stops immediately after a
successful rescue and before its next battle.

## Historical Diagnosis From v5 Telemetry

### Proven

- Storage reset and v5 persistence worked.
- CP and Max Alive schedules are deterministic and cumulative.
- Purchase simulation buys legal affordable options and can buy multiple.
- Unit unlock/count progression reaches parity with authored enemy caps.
- Boss CP multiplier is exactly one `x1.2`, not cumulative.
- Rescue now performs real CP/Max Alive actions and no longer grants unusable
  rescue Gold.
- Gold is not the current bottleneck by level 45; availability caps are.

### Concern

The v5 player purchase cap deliberately reached only each boss's base CP/Max
Alive, while the boss received `x1.2`. Therefore rescue was structural rather
than rare:

- 15 simulated ads before finishing boss 45 under the v5 three-loss contract;
- rescue CP gain (+404) exceeds paid CP gain (+336);
- several bosses need two or three rescue cycles;
- the player can hold 18,998 Gold with no legal purchase that closes the boss
  gap.

One future package per three losses was not guaranteed to create a winning next
attempt. This is historical v5 evidence; validate the v6 contract before using
these conclusions for current tuning.

Do not solve this by changing combat stats or AI. The evidence points to the
progression capacity/rescue contract.

## Telemetry Evaluation Contract

For the next progression batch, always report:

1. Exact filename range and report count. Never infer groups when reports are
   missing.
2. Clean-reset evidence: first level, storage version, player CP/Max Alive,
   Gold, units, ads, and package claims.
3. Per-level attempts, wins/losses, and whether the level is boss/normal.
4. Boss table with player/enemy CP, Max Alive, accuracy, rescue sequence, and
   status after the last report.
5. Paid gains versus rescue gains by type and Gold spent.
6. Gold balance plus legal/affordable options at any wall.
7. Unit unlock/count parity and whether a missing unlock caused no-spawn.
8. Whether both teams exhausted CP; distinguish capacity wall from AI stall.
9. Multiplier verification against same-level base, including rounding/caps.
10. Normal-level and boss attempt rates separately; aggregate win rate alone
    is misleading in a retry campaign.

Do not require a smooth per-level win-rate curve. The desired shape is forgiving
normal progression with authored boss pressure. Flag:

- repeated normal walls;
- boss retries that keep growing without useful progression;
- rescue that makes no state change;
- rescue frequency high enough to replace paid progression;
- large unused Gold with no relevant option;
- any state mismatch between telemetry, scene, roadmap, and source.

## Next Decision

Before another overnight 100-level run, discuss the rescue contract with the
user. Do not silently implement one of these:

1. Validate the v6 one-loss rescue with a fresh clean telemetry batch.
2. If a boss still needs repeated ads, decide whether one rescue must make the
   next attempt materially passable.
3. Allow accumulated Gold to buy a boss-gap package before requiring an ad.
4. Reduce the boss spike. This is broader tuning and should not be combined
   blindly with a stronger rescue in the same experiment.

The multiplier itself is validated. The immediate design question is how often
rescue should be required and whether Gold should retain agency at boss walls.

A useful short continuation is one attempt after the latest level-45 Max Alive
rescue. A new full batch is low value until the rescue policy is accepted.

Separately, improve the roadmap visualization when requested: draw base CP and
boss bonus separately and place accuracy on its own scale. This is presentation
only and must not change runtime formulas.

## Validation State

Latest focused checks:

```text
Cocos TypeScript noEmit: PASS
assets/Test.scene JSON parse: PASS
roadmap embedded JavaScript syntax: PASS
git diff --check on authored progression files: PASS
Max Alive schedule semantic assertions: PASS
101-report telemetry parse/grouping: PASS
Cocos preview chunk contains storage v6 and Max Alive package/rescue code: PASS
Cocos serialized scene cache contains battle-progression-v6: PASS
```

Current authored files:

- `assets/scripts/LevelSettings.ts`
- `assets/Test.scene`
- `tools/battle-progression-roadmap.html`
- `AI-CONTEX.md`

Branch/commit baseline at this handoff:

```text
main / f68c225f progression test
```

The current source progression commit is `f68c225f`; this handoff update is
uncommitted. Cocos has also modified generated/cache/log files under
`library/`, `profiles/`, and `temp/`. Do not revert or commit those automatically.

Known local operational issues:

- Cocos Preview may occasionally produce `_unresolved_*`, missing chunk, or
  `ENOENT` errors from stale packer/import-map caches. Verify source compilation
  and refresh/restart Preview before attributing these errors to gameplay code.
- CLI Git may report Windows `dubious ownership`; use
  `git -c safe.directory=F:/Github/BattleGame ...` for read-only inspection
  rather than silently changing global trust.
- `.git/index.lock` is local to this worktree. Another machine using the same
  remote cannot create this machine's lock file.

## Preserved Non-Progression Baseline

No SpatialGrid, RVO, AI accuracy, counter, ranged support, or tier-1 stat logic
was changed by progression v5.

Previously validated performance baseline remains informational only:

| Main frame metric at 4x CPU slowdown | Before RVO lifecycle repair | After |
| --- | ---: | ---: |
| Average | 7.390 ms | 5.308 ms |
| p95 | 16.707 ms | 12.196 ms |
| p99 | 24.041 ms | 15.291 ms |
| Frames over 16.67 ms | 5.07% | 0.81% |

These were Cocos Preview/device-emulation results, not physical-device release
claims. Mobile release validation with telemetry disabled remains future work.
