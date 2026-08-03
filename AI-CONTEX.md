# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last updated: 2026-08-03 after replacing fixed player Initial CP purchases with
dynamic boss-growth packages and analyzing the first complete progression-v3
run. That run contains 65 attempts across levels 1-25 and is blocked at boss
level 25 because the rewarded-video rescue has no legal capped upgrade to buy.

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
battle-progression-v3
```

Saved fields include:

- current level;
- player Gold;
- simulated rewarded-video count (`adsReward`);
- current consecutive loss count;
- per-level loss-Gold amount already claimed;
- player Initial CP;
- number of dynamic Initial CP packages purchased;
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
http://localhost:7456/?progression=1&currentLevel=26&TotalLevels=100
```

The queried level replaces the saved current level, but owned upgrades and Gold
remain unless `currentLevel=0` is used. Version 2 state is intentionally not
reused: the v3 key prevents old fixed `+50 CP` purchases from contaminating the
new dynamic package curve.

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
boss-growth ratio = 0.5
maximum = 1248
```

One cumulative Initial CP purchase right opens at each boss level. Its size is
derived from half of the enemy's effective CP increase from the previous boss:

```text
packagesUnlocked = floor(level / bossStagePace)
packageDelta(n) = round(
    max(0, effectiveBossCP(n) - effectiveBossCP(n - 1)) * 0.5
)
playerCP = min(1248, 300 + sum(purchased package deltas))
```

For the first package, the comparison baseline is enemy base CP at level 1,
not a fictional level-0 boss. With the active 100-level scene this gives:

| Boss level | Package delta | Cumulative player CP cap |
| ---: | ---: | ---: |
| 5 | +44 | 344 |
| 10 | +24 | 368 |
| 15 | +24 | 392 |
| 20 | +24 | 416 |
| 25 | +24 | 440 |
| 50 | +24 | 560 |
| 60 | +24 | 608 |
| 100 | +24 | 800 |

Rights accumulate. If the player cannot afford a package at its boss, it can
be purchased later. Each purchase always buys the next unopened package and
uses its exact delta; the cap is not a free grant. Package size is based on the
enemy's effective boss CP, including the boss CP multiplier. The current player
CP slope is therefore about `4.8 CP/level`, versus about `7.98 CP/level` for the
enemy base curve.

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
| First Initial CP package (+44) | 440 |
| Typical later Initial CP package (+24) | 240 |
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

Important source nuance: `levelLossCount` increments on any Team A loss, while
loss Gold requires a valid exhausted loss. A rewarded-video trigger can
therefore occur after losses that did not qualify for loss Gold. Decide whether
this distinction is intentional before changing it.

Important observed failure: a rescue plan can legally be empty. At level 25 in
the latest run, Team A had reached every current milestone cap, so six rescue
triggers produced `rescueActions = []` and `rescueGold = 0`. `adsReward` still
incremented and the streak reset, but the retry state did not improve. This is
the highest-priority unresolved progression issue.

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
8. Report the actual covered range. The latest v3 batch stops at level 25 and
   is not evidence for levels 26-100.

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

## Latest Telemetry Evidence: Progression V3, Levels 1-25

### Dataset And Integrity

- 65 reports dated `2026-08-03`, covering 25 unique levels and 40 retries;
- all reports use `storageVersion = 3`, `TotalLevels = 100`, and player CP
  boss-growth ratio `0.5`;
- the files form one continuous saved progression state despite a timestamp gap
  between levels 4 and 5;
- level 4 ended with `1048` Gold, and level 5 immediately spent `440` on the
  first `+44 CP` package, confirming continuity;
- the run is blocked on level 25 and contains no evidence for levels 26-100;
- the earlier v2/fixed-`+50 CP` level-1-to-60 batch is historical only. Do not
  combine its economy conclusions with this v3 run.

### Experience Results

```text
Battle attempts: 65
Player wins: 24
Player losses: 41
Attempt win rate: 36.9%
Unique levels cleared: 24/25
First-attempt clears: 21/25 = 84.0%
Average duration: 37.34 s
p95 duration: 43.92 s
Rewarded-video triggers: 6
```

Normal and boss attempts diverge sharply:

| Stage type | Attempts | Team A wins | Win rate |
| --- | ---: | ---: | ---: |
| Normal | 21 | 20 | 95.2% |
| Boss | 44 | 4 | 9.1% |

Normal first-attempt clears were `19/20`. Boss first-attempt clears were `2/5`.
The campaign therefore alternates between nearly free normal levels and severe
boss walls; the aggregate 36.9% attempt win rate hides that sawtooth.

Important retry sequences:

| Level | Sequence | Final state |
| ---: | --- | --- |
| 10 | `BBBBBBBBA` | Cleared on attempt 9 |
| 15 | `BBBBA` | Cleared on attempt 5 |
| 19 | `BA` | Normal-level retry |
| 20 | `A` | Boss cleared first attempt |
| 25 | 28 consecutive `B` wins | Still blocked |

### Level 25 Wall

Active battle values at level 25:

| Metric | Team A | Team B | Enemy advantage |
| --- | ---: | ---: | ---: |
| Initial CP | 440 | 530 | +20.5% versus A |
| Max Alive Waves | 5 | 8 | +60.0% capacity |
| Accuracy | 1.0 | 0.81818 | A is smarter |

Team A has `17.0%` less CP relative to Team B's total and `37.5%` fewer slots
relative to Team B's eight. The boss simultaneously multiplies CP by `1.2` and
Max Alive by `1.5`; this combined resource/capacity spike is the primary cause.

The 28 level-25 losses are usually decisive rather than coin flips:

```text
Team B surviving units: average 16.39, minimum 5, maximum 29
Losses with <= 10 Team B survivors: 5/28
Team B remaining CP: average 10.57, minimum 2, maximum 22
Average damage: Team A 4991.32, Team B 5643.04 (+13.1%)
Average kills: Team A 45.39, Team B 52.18 (+15.0%)
```

Both sides spend almost all CP, so the wall is not caused by a no-spawn stall or
CP hoarding. Team A melee damage/CP remains competitive; the loss is driven by
the available force envelope and the support access that envelope creates.

Level-25 spawn totals across 28 attempts:

| Family | Team A waves | Team B waves |
| --- | ---: | ---: |
| Spear | 42 | 42 |
| Sword | 62 | 70 |
| Axeman | 90 | 114 |
| Archer | 25 | 40 |

Team B produces `1.43` Archer waves per attempt versus Team A's `0.89`. This is
consistent with Team B maintaining more/durable frontline slots, not evidence
that ranged-cap logic was bypassed.

Level-25 damage/CP:

| Family | Team A | Team B |
| --- | ---: | ---: |
| Archer | 6.33 | 7.34 |
| Axeman | 11.72 | 11.21 |
| Spear | 6.65 | 5.97 |
| Sword | 11.02 | 11.35 |

Across the full 65-report batch, Team A/Team B damage per CP was Archer
`6.33/7.34`, Axeman `11.69/10.93`, Spear `6.81/6.39`, and Sword `11.19/10.36`.
Do not rebalance tier-1 melee stats from this run: Team A's melee efficiency is
already comparable or better despite losing the campaign wall.

### Economy And Purchase Result

Team A made 14 purchases and spent `5696` Gold:

| Kind | Count | Gold spent |
| --- | ---: | ---: |
| Initial CP | 5 | 1400 |
| Unit count | 6 | 2296 |
| Unit unlock | 2 | 2000 |
| Max Alive | 1 | 1000 |

The CP purchases were `+44` at level 5 for `440` Gold, followed by four `+24`
packages for `240` Gold each. Unlock purchases were Axeman (`1480`) and Archer
(`520`). Total rewards were `9593`; Team A retained `3897` Gold at the wall.

Level-25 loss Gold behaved as authored: the first three losses granted
`133 + 133 + 132 = 398`, exactly 75% of the level's `530`-Gold win reward;
later losses granted zero. The blocker is not insufficient currency. It is that
every currently permitted progression purchase is capped.

### Rewarded-Video Rescue Failure

There were six rescue triggers: one at level 10 and five at level 25. Every one
recorded:

```text
rescueActions = []
rescueGold = 0
```

At level 25, Team A already had all rights currently exposed by the milestone:

- Initial CP packages `5/5`, giving CP `440`;
- Max Alive `5`, equal to the permanent base cap at level 25, while the boss's
  temporary multiplier raises Team B to `8`;
- Spear/Sword/Axeman count `7`, matching current enemy/base count caps;
- Archer unlocked at count `3`;
- no other unit family offered yet;
- `3897` Gold present but `availablePurchases = []`.

`createRescuePlan()` respects the same milestone caps as ordinary purchasing,
so it cannot create a path forward precisely when a boss spike exceeds those
caps. It still increments `adsReward` and resets the streak. Level 10 eventually
cleared through battle noise after eight losses; level 25 has not cleared after
28 attempts. This is a design deadlock, not a telemetry or purchase-loop bug.

### Current Verdict

- Dynamic CP package calculation, pricing, persistence, and telemetry work.
- Purchase simulation spends available Gold and is not refusing legal options.
- Loss Gold cap works.
- Normal levels are currently too easy (`95.2%` attempt win rate).
- Boss difficulty is too concentrated (`9.1%` attempt win rate).
- The combined boss CP and Max Alive multipliers can create a structural wall.
- Rewarded-video rescue is ineffective whenever all base milestone caps are
  reached; more Gold alone cannot solve that state.
- No unit-stat, counter, or accuracy change is justified by this batch.
- Continuing the unchanged run will mostly generate more equivalent level-25
  losses and is not useful evidence.

## Open Decisions For The Next Session

Resolve the rescue deadlock before another long telemetry batch. Preferred
direction:

1. When the rescue plan is empty, allow one next locked progression milestone
   to be pulled forward: Initial CP, Max Alive, or the largest useful count
   upgrade. Reuse the existing purchase system rather than adding hidden combat
   power. This is the recommended design, but it is not implemented.
2. If the player already has enough Gold, spend that Gold. Grant only the
   shortfall as rewarded-video Gold. An ad that only grants more unusable Gold
   does not rescue the run.
3. Define deterministic priority among CP, Max Alive, and count. The choice
   should target the actual deficit, remain visible in telemetry, and advance at
   most one future milestone per rescue trigger.
4. Decide whether repeated rescues may pull multiple future milestones forward
   on the same boss, or whether a per-level/per-type limit is needed.
5. As an alternative product decision, reduce boss CP and/or Max Alive
   multipliers. This is broader difficulty tuning and should not be combined
   blindly with a strong rescue fallback in the same experiment.
6. Decide whether `levelLossCount` should increment only for valid exhausted
   losses, matching loss-Gold eligibility, or whether every loss intentionally
   advances the rewarded-video streak.
7. After implementing the chosen rescue rule, reset with `currentLevel=0` and
   run a fresh v3 batch. Measure normal versus boss attempts separately and
   verify every rescue trigger has a meaningful action.
8. Do not tune unit stats, counter multipliers, or Team A accuracy to solve the
   level-25 wall. The current evidence points to progression capacity.
9. Tier 2/3 remain future work until the tier-1 progression and rescue loop are
   accepted.

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
- dynamic player CP packages based on 50% of boss-to-boss effective enemy CP
  growth;
- enemy accuracy minimum `0.4`.

The file is tracked in Git (introduced by commit `05477ae0`) and currently has
authored modifications. Keep it synchronized whenever progression formulas or
scene values change, but treat `LevelSettings.ts` plus `assets/Test.scene` as
the runtime source of truth.

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
Latest telemetry parse: PASS (65 reports, 25 unique levels, 40 retries)
```

TypeScript command used because the global `npx` installation is broken:

```powershell
& 'C:\Users\CPU\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' `
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
- `assets/Test.scene`
- `tools/battle-progression-roadmap.html` (tracked)
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
6. keep the tracked roadmap change with the corresponding progression source
   change.
