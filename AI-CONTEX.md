# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last updated: 2026-08-03 after implementing the current campaign progression,
aligning player upgrade availability with enemy progression, raising enemy
starting accuracy to `0.4`, and analyzing the latest 68-battle run covering
levels 1-60.

This document describes the current source and active `assets/Test.scene`. It
replaces older progression proposals and old telemetry conclusions. Read the
source before making claims because Inspector overrides remain authoritative.

## Handoff Rules

- Update this file only when the user explicitly requests a handoff update.
- Inspect relevant source and active scene data before answering questions
  about current logic. Do not answer from memory or from this file alone.
- The active AI is `BattleArmyBrain` plus `BattlefieldEvaluator`.
  `SmartArmyBrain` is legacy and must not receive new gameplay work unless the
  user explicitly re-enables it.
- Do not add hidden combat, AI, economy, or progression multipliers. Every
  multiplier or cap must be explicit in source/Inspector and telemetry where
  it affects analysis.
- Do not repair campaign difficulty by changing tier-1 combat stats or counter
  multipliers unless telemetry first proves a combat-balance defect. The
  current phase is campaign experience/progression, not unit rebalance.
- The user prefers broad causal fixes over small threshold tuning. Diagnose the
  complete flow before adding another knob.
- Wave Combat Point cost must not increase when `unitCount` is upgraded. The
  player already spends Gold to unlock the wave and increase its count.
- Telemetry is evidence only. Never feed telemetry results back into runtime AI
  decisions.
- Work with the dirty worktree. Do not revert user/Cocos changes and do not
  stage or commit unrelated generated files.

## Current Product Phase

Tier-1 symmetric AI balance and the accuracy evaluator were tested extensively
before this phase. Current work treats:

- Team A as a simulated human player, still controlled by `BattleArmyBrain` at
  accuracy `1`;
- Team B as the authored campaign enemy;
- levels 1-100 as a player-experience progression test;
- Gold, purchases, retries, unlock timing, CP, and Max Alive as the current
  tuning surface.

The intended experience is:

1. Early normal levels are forgiving and introduce the game.
2. Enemy families are introduced at boss milestones.
3. The player faces the new enemy family before it becomes available for
   purchase.
4. Losses still award bounded Gold, allowing the player to improve and retry.
5. Five consecutive valid losses simulate a rewarded-video rescue.
6. Normal levels should not become a long automatic-win corridor.
7. Bosses should produce meaningful retries without creating an impossible
   fixed wall.
8. Levels 51-100 use the complete tier-1 roster/count set and test mastery.

## Source Of Truth

Read these first for progression work:

- `assets/Test.scene`: active Inspector values. This overrides TypeScript
  defaults.
- `assets/scripts/LevelSettings.ts`: enemy curves, boss rules, persistent
  progression state, unlock/count application, Gold, purchases, retries,
  rescue rewards, URL handling, and progression telemetry snapshots.
- `assets/scripts/GameManager.ts`: battle result integration, report export,
  progression provider, URL reload, CP affordability, and end conditions.
- `assets/scripts/BattleTelemetry.ts`: report schema. Progression appears in
  start config and final result.
- `tools/battle-progression-roadmap.html`: human-readable visualization of the
  current authored progression. It is a duplicated representation; source and
  scene still win if they disagree.

Read these before changing AI/combat:

- `assets/scripts/BattleArmyBrain.ts`: spawn timing, opening, last stand,
  accuracy handoff, spawn execution, and decision telemetry.
- `assets/scripts/BattlefieldEvaluator.ts`: snapshot intelligence, CP states,
  target/lane selection, candidate scoring, weighted accuracy mistakes,
  counters, ranged support, and reservations.
- `assets/scripts/CounterSettings.ts`: runtime counter rules.
- `assets/scripts/BattleUnitDatabase.ts`: unit entries and wave CP costs.
- `UNITSTATS.md` and `assets/Test.scene`: active stats and X-Power baseline.
- `assets/scripts/BattleSpatialGrid.ts` and
  `assets/scripts/rvo/RVOWorkerSimulator.ts`: previously optimized worker paths.

## Active Test Scene

### General

- `totalLevels = 100`
- `currentLevel = 1` in the serialized scene
- `battleTimeScale = 3`
- battle telemetry enabled
- automatic report download/reload enabled
- `allowInterval = false`; spawn delay does not scale with level
- `useWorkerRVO = true`
- `useWorkerSpatialTargetQuery = true`
- `spatialGridCellSize = 4`

Both BattleArmyBrains retain:

- `minSpawnInterval = 1.666667`
- `maxSpawnInterval = 3.333333`
- `coverageTargetRatio = 1.05`
- `maxRangedSupportWavesPerLane = 3`
- `maxConsecutiveMeleeWavesPerLane = 2`

### Enemy Difficulty Spine

`LevelSettings.targetTeam = 1` and the active scene applies:

```text
t = (level - 1) / (totalLevels - 1)
baseEnemyCP = round(lerp(250, 1040, t))
baseEnemyAccuracy = lerp(0.4, 1.0, t)
baseEnemyMaxAlive = round(lerp(3, 10, t))
```

Every fifth level is a boss:

```text
enemyCP = round(baseEnemyCP * 1.2)              // uncapped
enemyAccuracy = min(1, baseEnemyAccuracy * 1.5)
enemyMaxAlive = round(min(10, baseEnemyMaxAlive * 1.5))
```

Important corrections versus old handoffs:

- enemy base CP is `250 -> 1040`, not `600 -> 1040`;
- enemy accuracy is `0.4 -> 1`, not `0 -> 1`;
- enemy Max Alive is `3 -> 10`, not `3 -> 7`;
- boss CP multiplier is `1.2`; accuracy and Max Alive multipliers are `1.5`;
- the three boss multipliers are independent Inspector values.

TypeScript defaults for some non-accuracy curve fields differ from the active
scene. Always inspect `assets/Test.scene` before tuning or documenting active
values.

## Campaign Progression Runtime

### Persistent State

`LevelSettings` stores campaign state in browser local storage under:

```text
battle-progression-v2
```

Saved fields include:

- current level;
- player Gold;
- simulated rewarded-video count (`adsReward`);
- current consecutive loss count;
- per-level loss-Gold amount already claimed;
- player Initial CP;
- player Max Alive;
- total purchase count;
- each unit's offered, unlocked, and `unitCount` state.

Use this URL to clear the storage and begin a clean 100-level run:

```text
http://localhost:7456/?progression=1&currentLevel=0&TotalLevels=100
```

`currentLevel=0` is a reset command. It removes only the configured progression
storage key and then starts level 1. It does not mean battle level zero.

To continue a saved run while explicitly selecting a level:

```text
http://localhost:7456/?progression=1&currentLevel=61&TotalLevels=100
```

The queried level replaces the saved current level, but owned upgrades and Gold
remain unless `currentLevel=0` is used.

### Battle Lifecycle

At page load:

1. URL parameters are parsed.
2. A reset is applied when `currentLevel <= 0`.
3. Saved state is loaded and sanitized.
4. Enemy CP/accuracy/Max Alive curves and boss modifiers are applied.
5. Player unlock/count/CP/Max Alive state is applied to Team A.
6. Purchase simulation buys all currently affordable eligible packages,
   re-evaluating options after every purchase.
7. The battle runs with BattleArmyBrain A simulating the player.

At battle end:

1. The enemy family introduced at the current level becomes offered to the
   player.
2. Win/loss Gold is granted.
3. Five-loss rescue is applied if triggered.
4. Purchase simulation runs again between battles.
5. A win advances one level; a loss repeats the current level.
6. State is saved.
7. Telemetry is downloaded.
8. The next progression URL is loaded unless level 100 is complete.

### Unit Unlock And Count Schedule

The active scene schedule is:

| Family | Enemy unlock | Start count | Mature count |
| --- | ---: | ---: | ---: |
| Spear | 1 | 5 | 10 |
| Sword | 1 | 5 | 10 |
| Axeman | 10 | 5 | 10 |
| Archer | 25 | 3 | 5 |
| Cavalry | 35 | 5 | 10 |
| Monk | 45 | 1 | 1 |

Enemy behavior:

- unlock is immediate at the configured level;
- `unitCount` grows by rounded linear interpolation from the unlock count to
  mature count;
- every family reaches mature count at
  `ceil(totalLevels * 0.5)`, currently level 50;
- levels 51-100 retain the full tier-1 roster and mature counts.

Player behavior:

- Spear and Sword start owned at count 5;
- a later family is first faced as an enemy, then offered after that battle;
- unlock requires Gold;
- count upgrade requires Gold;
- the player's count sale cap equals that family's current enemy progression
  count, so the player cannot max a family before enemy progression reaches it;
- skipped count rights remain available later;
- changing count never changes the wave's CP cost.

### Player Initial CP

Active values:

```text
start = 300
step = 50
maximum = 1248
```

One cumulative `+50 Initial CP` purchase right opens at each boss level:

```text
packagesUnlocked = floor(level / bossStagePace)
milestoneCap = min(1248, 300 + packagesUnlocked * 50)
```

Examples:

| Level | Player CP purchase cap |
| ---: | ---: |
| 1-4 | 300 |
| 5 | 350 |
| 10 | 400 |
| 25 | 550 |
| 50 | 800 |
| 60 | 900 |
| 95-100 | 1248 |

Rights accumulate. If the player cannot afford a package at its boss, it can
be purchased later. The cap is not a free grant.

### Player Max Alive

Active values:

```text
start = 4
maximum = 10
```

The sale cap follows the enemy's permanent base Max Alive curve, but never
includes a temporary boss multiplier:

```text
playerMaxAliveCap = clamp(round(lerp(3, 10, t)), 4, 10)
```

This prevents a boss spike from permanently granting player capacity while
still allowing long-term capacity growth.

### Gold And Prices

Reward rules:

```text
winGold = round(effectiveEnemyInitialCP * 1)
validLossGold = 25% of winGold
maximum cumulative loss Gold on one level = 75% of winGold
```

Loss Gold is granted only for a valid exhausted loss: Team A is eliminated and
cannot afford another unlocked spawn. Repeated loss farming is capped per
level.

Purchase formulas:

```text
unit unlock price = wave CP cost * 20
one count upgrade = round(unlock price / unlockCount)
Initial CP price = purchased CP * 10
Max Alive price = round(1000 * currentMaxAlive / 4)
```

Current tier-1 prices:

| Purchase | Gold |
| --- | ---: |
| Unlock Axeman | 1480 |
| Unlock Archer | 520 |
| Unlock Cavalry | 1940 |
| Unlock Monk | 980 |
| +1 Spear | 156 |
| +1 Sword | 196 |
| +1 Axeman | 296 |
| +1 Archer | 173 |
| +1 Cavalry | 388 |
| +50 Initial CP | 500 |
| Max Alive 4 -> 5 | 1000 |
| Max Alive 5 -> 6 | 1250 |
| Max Alive 6 -> 7 | 1500 |

Spear/Sword are initially owned. Monk has no count upgrade because its start
and mature count are both one.

### Purchase Simulation

When `purchasingSimulation = true`, Team A can buy multiple packages before a
battle and after its result. It repeats until no affordable eligible package
remains, with a hard safety limit of 100 purchases per pass.

Selection is weighted random, not uniform:

- unit unlock: base priority `3`, increasing as the offer ages;
- unit count: priority rises with count deficit versus enemy;
- Initial CP: priority rises when enemy CP exceeds player CP;
- Max Alive: priority rises with enemy/player slot gap.

Gold is still the hard gate. Milestone caps are checked on every iteration, so
normal purchase simulation and rescue purchases cannot bypass CP, Max Alive,
or unit-count progression.

### Rewarded-Video Rescue Simulation

After five consecutive player losses on one level:

- `adsReward` increments by one;
- the consecutive-loss counter resets;
- the code creates a rescue plan;
- it grants exactly the missing Gold needed for that plan;
- if purchase simulation is enabled, those actions are bought immediately;
- the level is retried rather than abandoned.

Rescue preference order is:

1. newest offered unit unlock;
2. available Initial CP packages while behind enemy CP;
3. available Max Alive packages while behind enemy capacity;
4. one count upgrade with the largest enemy deficit;
5. cheapest available purchase if none of the above exists.

The plan still respects all milestone caps. There is currently no permanent
"give up after six losses" behavior.

## AI Behavior Relevant To Progression

### Accuracy

- Accuracy affects unit selection, not target or lane selection.
- The evaluator first finds the best candidate for a tactical target/lane
  anchor.
- With probability equal to accuracy it keeps that best candidate.
- Otherwise it chooses a lower-ranked different-family candidate for the same
  anchor using rank-based weights.
- An intentional mistake cannot itself be an accurate hard-counter response.
- `accuracy = 1` always keeps the best candidate when one exists.
- Ranged capacity scales from accuracy and is zero only at exact accuracy zero;
  last stand is an explicit exception that may spawn any affordable unit.

Starting enemy accuracy was raised from `0` to `0.4` on 2026-08-03. This
change is present in the LevelSettings TypeScript default, active scene, and
roadmap. The final accuracy remains `1`.

With only Spear and Sword unlocked, low-accuracy visible randomness is limited:
when Sword is best, Spear may be the only wrong-family alternative. Do not
diagnose unit frequency from accuracy alone; inspect `deliberateMistake`,
selected rank, reason, target, and CP state.

### Opening

- Opening considers affordable unlocked melee/frontline families only.
- It selects the entry closest to the average one-unit X-Power.
- Opening bypasses decision accuracy and resolves to a single deterministic
  candidate after tie/order behavior.
- Telemetry batch query mode synchronizes both first decisions and uses the
  middle lane.
- In the latest level 1-9 run, all nine enemy openings were Sword. Spear-heavy
  behavior occurred in response decisions, not opening.

### CP Strategy States

The evaluator labels each decision:

- `opening`
- `abundant`
- `normal`
- `efficient`
- `desperate`

`abundant` requires current CP above the opponent and a premium melee purchase
that still leaves the AI ahead. `efficient` applies when behind outside the
normal band. `desperate` applies when no effective response is affordable.
These labels affect scoring, but accuracy can deliberately select a lower
candidate afterward.

### Ranged And Counter Safety

Normal ranged support requires a valid engaged allied frontline and tactical
support value. It is capped locally, cannot repeat the same ranged family in a
lane immediately, and scales with accuracy. Last stand is the deliberate
exception.

Current hard counters remain:

| Attacker | Defender | Runtime multiplier |
| --- | --- | ---: |
| Spear | Cavalry | 12 |
| Archer | Spear | 2 |

Do not alter these to repair progression pacing.

## Tier-1 Balance Baseline

Current active stats are symmetric between teams:

| Unit | Mature count | Cost | HP | Damage | Defense | Raw X-Power |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Cavalry | 10 | 97 | 160 | 45 | 7 | 97.30 |
| Axeman | 10 | 74 | 110 | 46 | 2 | 74.27 |
| Sword | 10 | 49 | 100 | 20 | 5 | 49.50 |
| Spear | 10 | 39 | 95 | 14 | 3 | 38.85 |
| Archer | 5 | 26 | 45 | 13 | 0 | 24.19 |
| Monk | 1 | 49 | 35 | 70 | 0 | 49.50 |

X-Power reference:

```text
EffectiveHP = Health * (1 + Defense * 0.045)
RawUnitPower = sqrt(Damage * EffectiveHP)
```

This is per-unit power. Do not multiply by `unitCount` when deriving nominal
per-unit wave price in the current design. Archer's tested cost `26` remains a
known premium over rounded raw power `24`.

## Telemetry Evaluation Contract

The current campaign test is an experience/progression test, not another
symmetric combat-balance sweep.

### Dataset Integrity

Before drawing conclusions:

1. Sort files by timestamp.
2. Read `progression.battleLevel`; do not infer level only from file position.
3. Treat repeated levels as retries, not duplicate reports.
4. Verify each report has `progression.before`, `progression.after`, result,
   wave spawns, and expected config.
5. Separate boss and normal levels.
6. Verify the active accuracy/CP/Max Alive values recorded in each report.
7. Exclude reports from another reset/run rather than forcing them into the
   sequence.
8. Report the actual covered range. The latest batch stops at level 60 and is
   not evidence for levels 61-100.

### Primary Experience Metrics

Evaluate these first:

- unique levels reached;
- total battle attempts;
- first-attempt clear rate;
- attempts per blocked level;
- longest consecutive loss streak;
- rewarded-video triggers and rescue actions;
- boss versus normal clear rates;
- battle-duration mean/median and stage trend;
- player/enemy Initial CP gap at each attempt;
- player/enemy Max Alive gap;
- enemy accuracy and actual deliberate-mistake rate;
- player/enemy roster and count state;
- pre-battle and between-battle purchases;
- Gold earned, spent, retained, and currently spendable options;
- whether an upgrade precedes and plausibly resolves a retry wall.

A progression wall is not merely one loss. Flag it when repeated losses occur
while the player lacks an affordable/effective path forward, or when rescue
cannot create one because every useful purchase is milestone-blocked.

### AI Decision Metrics

When checking whether accuracy behaves correctly, use:

- `decisionAccuracy`;
- `deliberateMistake` and `accurateDecision`;
- selected rank and selection quality;
- intended/best family versus spawned family;
- decision reason and target family;
- CP strategy state;
- unit mix only as supporting evidence.

Do not infer an accuracy bug only because one family appears often. A small
unlocked roster can leave only one legal wrong alternative.

### Secondary Combat Metrics

Kills, total damage, damage/CP, counter kills, and family efficiency are useful
for detecting a combat anomaly, but they are not the primary campaign verdict.
Battle noise, spatial access, target selection, roster availability, and boss
capacity affect them. Do not tune stats from one campaign batch without an
isolated balance reproduction.

### Healthy Progression Criteria

The current design should be judged against these qualitative criteria rather
than a fixed win-rate threshold at every level:

- early levels are forgiving but not visually repetitive;
- normal-level difficulty rises rather than remaining an automatic-win line;
- bosses create identifiable spikes and occasional retries;
- most retry walls resolve through earned upgrades before five-loss rescue;
- rescue exists for true walls and is not required constantly;
- Gold is constrained enough to force prioritization but does not strand the
  player permanently;
- purchased power does not race permanently ahead of the enemy base curve;
- new units appear at readable milestones;
- by level 50 both sides can reach the complete mature tier-1 roster;
- levels 51-100 test choices/mastery rather than unlock availability.

## Latest Telemetry Evidence: Levels 1-60

Dataset:

- 68 reports from `2026-08-02T19-45-59-144Z` through
  `2026-08-02T20-09-41-127Z`;
- 60 unique levels, complete level sequence 1-60;
- eight reports are valid retries;
- enemy starting accuracy `0.4` is present in the reports;
- the run stopped after winning level 60, so campaign completion is untested.

### Results

```text
Battle attempts: 68
Player wins: 60
Player losses: 8
Attempt win rate: 88.2%
First-attempt clears: 55/60 = 91.7%
Average duration: 44.2 s
Median duration: about 43.1 s
Duration range: 27.4-69.8 s
Rewarded-video triggers: 0
```

Retry sequences:

| Level | Sequence |
| ---: | --- |
| 10 | L L L W |
| 15 | L W |
| 25 | L L W |
| 40 | L W |
| 43 | L W |

Seven of eight losses occurred on bosses. Across attempts, bosses won only
`12/19` for Team A (`63.2%`), while normal levels were `48/49` (`98.0%`).
Bosses therefore create the current challenge; normal levels are nearly free.

The best observed progression loop is level 10:

- Team A lost three times;
- bounded loss Gold accumulated;
- Axeman was purchased for `1480` Gold after the third loss;
- Team A won the fourth attempt.

At level 25, Archer was purchased after the first loss; Team A lost once more
and then won. Levels 15, 40, and 43 resolved on retry without a new purchase,
which is consistent with battle noise rather than a hard wall.

### Accuracy Result

Enemy level 1-9 spawns:

```text
Spear: 34
Sword: 24
Opening Sword: 9/9
Deliberate mistakes: 23/58 = 39.7%
```

Enemy mistake rate by stage:

| Levels | Deliberate mistakes / spawns |
| --- | ---: |
| 1-9 | 39.7% |
| 10-24 | 40.9% |
| 25-44 | 21.0% |
| 45-60 | 15.9% |

Raising starting accuracy from `0` to `0.4` materially reduced the previous
Spear-only appearance while preserving visible early mistakes. No further
accuracy change is currently justified by this batch.

### Purchase And Gold Result

Team A made 41 purchases:

| Kind | Count | Gold spent |
| --- | ---: | ---: |
| Initial CP | 12 | 6000 |
| Unit count | 22 | 5526 |
| Unit unlock | 4 | 4920 |
| Max Alive | 3 | 3750 |

```text
Total Gold earned: 31,304
Total Gold spent: 20,196
Gold retained after level 60: 11,108
Rescue Gold: 0
```

All families and mature counts were obtained by level 50. At level 60 Team A
had CP `900`, Max Alive `7`, all families, and mature counts. No purchase was
available after the pre-battle CP package; the large remaining Gold balance was
therefore not a purchase-simulation refusal.

### Current Main Concern

The current difficulty curve is sawtoothed:

- the player's `+50 CP` boss purchase is permanent;
- the enemy's `x1.2` boss CP disappears on the following normal level;
- player CP grows about 10 per level (`50 / 5`), while enemy base CP grows
  about 8 per level;
- the player also starts 50 CP ahead.

Observed average player CP advantage:

| Levels | Average Team A CP advantage |
| --- | ---: |
| 1-9 | 39.6 |
| 10-24 | 48.5 |
| 25-44 | 80.9 |
| 45-60 | 112.2 |

At boss level 60 the gap was only `900 vs 865` (`+35`), but surrounding normal
levels can give Team A roughly `+130` to `+150` CP because the boss multiplier
has dropped. Team A won all 16 attempts from levels 45-60.

Current verdict:

- accuracy `0.4 -> 1`: working;
- unit unlock/count schedule: working;
- purchase simulation and retry loop: working;
- boss spikes: working and meaningful;
- five-loss rescue: implemented but not exercised;
- normal-level challenge after midgame: too weak in this sample;
- Gold pressure after roster maturity: too weak, with a large unspendable bank.

Do not respond to this concern by reducing player AI accuracy or changing unit
stats. The causal surfaces are player CP entitlement versus enemy base CP and
the lack of post-maturity Gold sinks/content.

## Open Decisions For The Next Session

1. Decide whether normal levels are intentionally relief stages or whether
   their near-98% clear rate is too low-risk. This is the next product decision.
2. If normal levels need more pressure, align the cumulative player CP
   entitlement with the enemy base curve while preserving temporary boss
   spikes. Avoid per-level special cases.
3. Decide whether Gold banked after level 50 is intentional preparation for
   future tier 2/3/cards, or whether tier-1 progression needs another meaningful
   sink. Do not add a sink only to consume currency; it must represent player
   power or choice.
4. Continue levels 61-100 before claiming final-campaign behavior. The current
   run proves only levels 1-60.
5. Exercise the five-loss rescue in a controlled run and verify `adsReward`,
   `rescueGold`, chosen actions, and retry behavior.
6. Keep enemy accuracy minimum at `0.4` unless a new batch shows a concrete
   decision-quality problem.
7. Tier 2/3 remain future work. Do not implement them until the tier-1 campaign
   economy and CP curve are accepted.

## Roadmap Artifact

`tools/battle-progression-roadmap.html` visualizes:

- enemy CP/accuracy/Max Alive curves and bosses;
- unlock levels and unit-count maturation to level 50;
- player CP sale caps;
- player Max Alive/count progression rules;
- Gold prices and progression notes.

It was updated with:

- Cavalry at level 35;
- Monk at level 45;
- unit progression ending at level 50;
- player CP boss-package caps;
- enemy accuracy minimum `0.4`.

The file is currently untracked in Git. Add it deliberately when preparing the
progression changes for commit; do not assume it is already versioned.

## Preserved Performance Baseline

No SpatialGrid/RVO gameplay or performance logic was changed during the
progression work.

Previously validated state:

- target search uses a bounded hybrid of ring traversal and exact active
  snapshot scan on both main-thread and worker paths;
- target worker replies retain `lifeId` stale-target protection;
- RVO worker startup no longer permanently falls back merely because startup
  exceeds two seconds under CPU slowdown;
- a pending ready-worker timeout restarts the worker generation instead;
- actual capability/runtime failures still use main-thread fallback.

Best same-condition 4x DevTools comparison:

| Main frame metric | Before RVO lifecycle repair | After |
| --- | ---: | ---: |
| Average | 7.390 ms | 5.308 ms |
| p95 | 16.707 ms | 12.196 ms |
| p99 | 24.041 ms | 15.291 ms |
| Frames over 16.67 ms | 5.07% | 0.81% |

These are Cocos preview/device-emulation results, not physical-device release
claims. Production mobile validation with telemetry disabled is still pending.

## Validation And Tooling

Current focused validation after the latest changes:

```text
Cocos TypeScript noEmit with skipLibCheck/module override: PASS
assets/Test.scene JSON parse: PASS
Roadmap embedded script syntax: PASS
git diff --check on progression files: PASS (line-ending warnings only)
Latest telemetry parse: PASS (68 reports, 60 unique levels, 8 retries)
```

TypeScript command used because the global `npx` installation is broken:

```powershell
& 'C:\Users\tranl\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' `
  'C:\ProgramData\cocos\editors\Creator\3.8.8\resources\app.asar.unpacked\node_modules\typescript\lib\tsc.js' `
  --noEmit --skipLibCheck --module esnext -p tsconfig.json
```

Known local issues:

- Cocos preview may fail with `_unresolved_*`, missing generated chunk, or
  `ENOENT` errors when packer cache/import maps are stale. This is a generated
  preview-cache issue; verify source compilation before blaming gameplay code.
- GitHub Desktop lock errors generally come from a local interrupted/concurrent
  Git process. Another machine cannot directly create this machine's
  `.git/index.lock` merely by using the same remote repository.
- CLI Git may report Windows `dubious ownership`. Use
  `git -c safe.directory=F:/Github/BattleGame ...` for inspection and do not
  silently alter global trust settings.

## Worktree State At Handoff

Relevant authored changes currently include:

- `assets/scripts/LevelSettings.ts`
- `assets/scripts/GameManager.ts`
- `assets/scripts/BattleTelemetry.ts`
- `assets/Test.scene`
- `tools/battle-progression-roadmap.html` (untracked)
- `AI-CONTEX.md`

Cocos has also modified/generated many files under `library/`, `profiles/`, and
`temp/`. Those files are not the progression source of truth. Do not revert,
delete, stage, or commit them automatically; the editor may still be using
them.

Before a future commit:

1. inspect authored diffs carefully;
2. keep unrelated Cocos cache/log churn out of the commit;
3. verify the active scene values listed above;
4. compile TypeScript;
5. parse the scene JSON;
6. ensure the roadmap is intentionally added if it should be versioned.
