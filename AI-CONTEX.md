# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last updated: 2026-07-24 by home Codex after the X-Power stats reset,
BattlefieldEvaluator base-power alignment, opening random melee change, and
CP-advantage economy scoring pass.

## Handoff Policy

- Treat source code and scene data as the source of truth. Use this file as a
  map, not as a substitute for checking code.
- Update this file only when the user explicitly asks for a handoff/update.
- Keep this file as current truth. Avoid reviving outdated daily-history notes
  unless the user asks for investigation history.
- Before changing AI, combat, stats, or telemetry, re-check:
  - `assets/Test.scene`
  - `UNITSTATS.md`
  - `assets/scripts/BattleArmyBrain.ts`
  - `assets/scripts/BattlefieldEvaluator.ts`
  - `assets/scripts/CounterSettings.ts`
  - `assets/scripts/BattleTelemetry.ts`
- User is explicitly sensitive about hidden balance multipliers. Do not add
  hidden combat/stat multipliers. Actual damage multipliers must live in
  `CounterSettings` / scene counter data.

## Current Active Stack

- Active AI path: `BattleArmyBrain` plus `BattlefieldEvaluator`.
- `SmartArmyBrain` and old `ArmyBrain` are legacy unless scene explicitly
  enables them.
- Active troop test uses tier 1 only:
  - Axeman
  - Cavalry
  - Sword
  - Spear
  - Monk
  - Archer
- Skirmisher is inactive for this pass.

## Current Balance Direction

The balance direction changed on 2026-07-24.

Old direction:

- Tune runtime `damage/CP` until all unit families looked close under current
  AI behavior.

Problem discovered:

- Runtime `damage/CP` is heavily shaped by AI choices, target selection,
  frontline safety, ranged uptime, AoE, lane noise, and battle flow.
- A stats table tuned only to runtime telemetry can accidentally become
  balanced only inside one AI behavior, not as a clean unit economy.

Current direction:

- First define a clean raw per-unit `Power` scale.
- Sword is the base unit.
- User spawning a wave means buying total raw wave Power, regardless of family.
- Runtime telemetry is still important, but now it should identify where AI,
  range, AoE, or behavior creates value beyond raw Power.

Current raw Power formula:

```text
EffectiveHP = Health * (1 + Defense * 0.045)
RawUnitPower = sqrt(Damage * EffectiveHP)
WaveRawPower = RawUnitPower * UnitCount
Cost = round(WaveRawPower / 10)
```

Important:

- This raw Power intentionally uses only `Health`, `Damage`, `Defense`, and
  `UnitCount`.
- It intentionally does not include `speed`, `range`, `damageRadius`,
  `attackInterval`, lane behavior, or AI context.
- `attackInterval` is currently considered more of a technical/combat pacing
  stat than a unit identity stat. Melee intervals are unified.
- Tactical traits like speed/range/AoE still matter in real play, but should not
  silently inflate the base market price unless deliberately added later as a
  separate premium.

## Current Unit Stats

Scene values in `assets/Test.scene` and `UNITSTATS.md` should match this table.

| Unit | Family | Count | Cost | Health | Damage | Defense | Speed | Range | Radius | Interval | Raw Power Ratio |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| `axeman_t1` | Axeman | 10 | 74 | 110 | 46 | 2 | 4.65 | 0.35 | 0.0 | 0.36-0.44 | ~1.50X |
| `cavalry_t1` | Cavalry | 10 | 97 | 160 | 45 | 7 | 9.75 | 0.35 | 0.0 | 0.36-0.44 | ~1.97X |
| `sword_t1` | Sword | 10 | 49 | 100 | 20 | 5 | 5.10 | 0.35 | 0.0 | 0.36-0.44 | 1.00X |
| `spear_t1` | Spear | 10 | 24 | 55 | 10 | 2 | 4.50 | 0.35 | 0.0 | 0.36-0.44 | ~0.49X |
| `monk_t1` | Monk | 2 | 5 | 23 | 25 | 0 | 4.05 | 5.20 | 1.00 | 1.50-1.90 | ~0.48X |
| `archer_t1` | Archer | 4 | 10 | 45 | 13 | 0 | 5.70 | 6.20 | 0.0 | 1.10-1.35 | ~0.49X |

Current intended raw Power ladder:

```text
Cavalry ~= 2.0X
Axeman  ~= 1.5X
Sword   = 1.0X
Spear   ~= 0.5X
Archer  ~= 0.5X
Monk    ~= 0.5X
```

Identity notes:

- Sword: base unit, medium attack, high defense, medium HP.
- Axeman: high attack, weak defense, medium HP.
- Cavalry: high attack, high defense, high HP, high speed.
- Spear: low attack, medium-low defense, low HP, cheap raw Power; gets value
  through Spear > Cavalry counter.
- Archer: same raw Power tier as Spear, no defense, low HP, long range.
- Monk: same raw Power tier as Spear/Archer, very low HP, no defense, high hit
  damage, AoE support via `damageRadius = 1.0`.

## Current Counter Rules

Damage formula:

```text
damage = max(1, attacker.damage - defender.defense) * counterMultiplier
```

Active scene/default rules:

| Attacker | Defender | Multiplier | Intent |
| --- | --- | ---: | --- |
| Spear | Cavalry | 45.0 | Spear should beat Cavalry as a hard counter. This value targets about 5-10% Spear HP remaining in the continuous 1v1 estimate. |
| Archer | Spear | 2.0 | Archer punishes Spear while sharing the same raw Power tier. |

Spear vs Cavalry check with current stats:

```text
Spear -> Cavalry raw = max(1, 10 - 7) = 3
With x45: 3 * 45 = 135 damage/hit
Cavalry HP = 160

Cavalry -> Spear = max(1, 45 - 2) = 43 damage/hit
Spear HP = 55
```

Continuous estimate:

```text
Spear received damage = 43 * 160 / (3 * 45) ~= 50.96
Spear remaining HP ~= 4.04 / 55 ~= 7.3%
```

Important nuance:

- Real game combat is hit-discrete and wave-based, so visual outcome may differ
  from the continuous estimate.
- Earlier `x83` made Spear one-shot Cavalry and telemetry/visual showed Cavalry
  dying too fast. User rejected tiny incremental tuning and requested the
  continuous-estimate target be changed from 50% remaining HP to 5-10%.

## Current BattleArmyBrain Behavior

Source: `assets/scripts/BattleArmyBrain.ts`.

- `decisionAccuracy` affects unit choice, not lane choice.
- Accuracy roll:
  - if accurate, keep evaluator choice.
  - if inaccurate and there is a target, keep target/lane but choose a
    deliberately poor response via `chooseWrongResponseEntry`.
  - if inaccurate and no target, choose a poor generic melee entry via
    `choosePoorGenericEntry`.
- `decisionAccuracy = 1` means evaluator decisions should be fully accurate.
- `decisionAccuracy = 0` should never select the correct answer when a poor
  response candidate exists.
- Ranged support limit scales with accuracy:

```text
effectiveRangedSupportLimit =
    floor(maxRangedSupportWavesPerLane * decisionAccuracy)
```

- Telemetry records:
  - `intendedUnitName`
  - `intendedFamilyName`
  - `accuracyRoll`
  - `accurateDecision`
  - `deliberateMistake`
  - CP context before/after spawn.
- Spawn timing remains driven by `minSpawnInterval`, `maxSpawnInterval`, and
  `maxBrainDeltaTime`.
- `enableMaxAliveWaveLimit` and `maxAliveWaves` still gate spawning.

## Current BattlefieldEvaluator Behavior

Source: `assets/scripts/BattlefieldEvaluator.ts`.

### Base Power Alignment

`getEntryBasePower()` was changed to match the X-Power market basis:

```text
basePower =
    sqrt(
        max(1, aliveCount * damage) *
        max(1, health * aliveCount * healthRatio * (1 + defense * 0.045))
    )
```

Removed from base power:

- attack interval
- speed
- range
- AoE / damageRadius

Reason:

- Cost now buys raw Power.
- Evaluator base power should speak the same language as cost.
- Tactical traits should influence tactical rules, not silently inflate the
  raw market value.

### Opening

Problem found:

- With cost based on raw wave Power, Spear became very cheap.
- Old opening pressure used economy scoring and chose Spear too often.

Current behavior:

- If there are no enemy waves, `snapshot-opening-pressure` now chooses a random
  affordable melee entry.
- Ranged/Monk are excluded from opening random.
- Fallback/pressure after enemies exist still uses the older pressure entry
  logic.

Expected visual:

```text
Opening can be Spear / Sword / Axeman / Cavalry.
It should no longer always be Spear.
```

### CP Advantage Economy Scoring

Problem:

- User asked whether a side with double CP would be considered rich and spawn
  more Cavalry.
- Old logic only checked `currentCP / cost >= 1.7`, not CP advantage versus
  opponent. A team with much more CP was still overly conservative.

Current behavior:

- `scoreSnapshotEntryForTarget()` now receives both current team CP and enemy
  team CP.
- Cost penalty is reduced if buying the candidate still leaves the team ahead:

```text
postSpawnAdvantage = currentCP - cost - enemyCP

if postSpawnAdvantage > 0:
    economyPreference decreases from base 4.5/9.5 down toward 1.5
else:
    economyPreference remains unchanged
```

Purpose:

- When CP is equal, AI still economizes.
- When a team is clearly richer, expensive melee such as Cavalry/Axeman should
  become more acceptable.
- This does not override hard-counter safety:
  - Cavalry is still rejected if the path has an enemy Spear blocker.
  - Reverse-counter rejection/penalty still applies.

Status:

- This CP-advantage scoring change has not yet been telemetry-tested.

### Ranged Support Guard

Current ranged/Monk guard is still active:

```text
rangedSupportCount < meleeSupportCount
```

Additional ranged support conditions:

- target lane must have ally frontline;
- ally frontline must be engaged;
- `frontlineBlockPower > 0`;
- per-target/lane support count must be under `maxRangedSupportWavesPerLane`;
- do not spawn the same ranged family consecutively in the same lane.

Important:

- Ranged/Monk are very cheap under X-Power cost:

```text
Archer cost = 10
Monk cost = 5
```

- Guard prevents infinite ranged spam, but telemetry shows ranged/support can
  still be extremely cost-efficient because range/AoE/safety are not priced
  into raw Power cost yet.

## Telemetry Read Today

All reports below used `decisionAccuracy = 1`.

### Batch A: After X-Power Stats + Cost, Before Base-Power/Opening Fixes

Files around:

```text
battle-telemetry-2026-07-23T18-30 to 18-45
```

Summary:

```text
Reports: 10
Team 0 wins: 5
Team 1 wins: 5
Average duration: 90.7s
End reason: all team-eliminated-and-cannot-afford-spawn
Total wave spawns: 457
```

Spawn mix:

```text
Spear   185 (40.5%)
Archer   78 (17.1%)
Sword    69 (15.1%)
Monk     44 (9.6%)
Cavalry  42 (9.2%)
Axeman   39 (8.5%)
```

Damage/CP:

```text
Monk    73.04
Archer  45.22
Spear   19.77
Axeman  17.02
Sword   13.27
Cavalry 11.79
```

Diagnosis:

- Spear was over-spawned because it was cheap and old opening/pressure/economy
  logic liked it too much.
- Monk/Archer already showed extreme damage/CP because they are cheap and get
  tactical value from range/AoE/safety.

### Batch B: After Base-Power Alignment + Opening Random Melee

Files around:

```text
battle-telemetry-2026-07-23T19-05 to 19-19
```

Summary:

```text
Reports: 10
Team 0 wins: 6
Team 1 wins: 4
Average duration: 77.6s
Average winner alive: 20.1 units
Total wave spawns: 372
```

Spawn mix:

```text
Spear    81 (21.8%)
Archer   73 (19.6%)
Sword    72 (19.4%)
Cavalry  57 (15.3%)
Axeman   53 (14.2%)
Monk     36 (9.7%)
```

Opening pressure:

```text
Axeman  4
Sword   4
Cavalry 2
Spear   0
```

Damage/CP:

```text
Monk    92.06
Archer  33.46
Spear   17.86
Axeman  16.99
Cavalry 15.13
Sword   12.20
```

Diagnosis:

- Opening fix worked: no more opening Spear default.
- Spear spawn ratio dropped from 40.5% to 21.8%.
- Spawn mix is much healthier.
- Ranged/support are now the biggest unresolved economy issue:
  - Monk cost 5 with AoE produced huge damage/CP.
  - Archer cost 10 and range/safety still produced high damage/CP.

### Spear vs Cavalry Pair From Batch B

Telemetry pair aggregate:

```text
Spear -> Cavalry:
damage = 23,568
kills  = 190

Cavalry -> Spear:
damage = 4,624
kills  = 63
```

Interpretation:

- With earlier `x83`, Spear was deleting Cavalry too quickly.
- Counter was reduced to `x45` after this report. This reduced value has not
  yet been telemetry-tested.

## Current Open Issues / Next Steps

### 1. Test After Latest Changes

Need a fresh telemetry batch after these latest changes:

- Spear > Cavalry multiplier `45`, not `83`.
- CP-advantage economy scoring in `BattlefieldEvaluator`.

Specifically watch:

- Does Cavalry spawn more when one side has significantly more CP?
- Does Cavalry still avoid Spear blocker traps?
- Does Spear still hard-counter Cavalry visibly without instantly deleting it?
- Does regular 800v800 AI remain stable?

### 2. Ranged/Monk Pricing Is Still Unresolved

Current cost policy prices only raw `Health/Damage/Defense * count`.

That makes:

```text
Archer cost = 10
Monk cost = 5
```

But runtime value includes:

- range uptime;
- safety behind frontline;
- Archer > Spear counter;
- Monk AoE.

Current guard prevents ranged count from exceeding melee count, but telemetry
still showed:

```text
Monk damage/CP ~= 92
Archer damage/CP ~= 33
```

Possible next directions:

- Add an explicit tactical cost premium for ranged/AoE units while keeping raw
  Power formula intact.
- Or keep cost cheap but tighten support spawn rules further.
- Do not hide this inside damage multipliers or evaluator-only power hacks.

### 3. Pressure/Fallback Still Uses Older Economy Logic

Opening has been fixed to random melee. However, pressure fallback after enemies
exist still uses:

```text
power / cost * 18 + sqrt(power) * 4 - cost * 2.2 + speed
```

This may still over-prefer cheap melee in some fallback cases. It was not the
main issue after opening fix, but keep it in mind.

### 4. Generated/Cache Files Are Dirty

At the time of this handoff, `git status` showed many dirty generated/cache/log
files under:

```text
library/
temp/
```

Codex changes intentionally touched only:

```text
UNITSTATS.md
assets/Test.scene
assets/scripts/BattlefieldEvaluator.ts
assets/scripts/CounterSettings.ts
AI-CONTEX.md
```

Do not casually revert user/editor-generated files. If committing, stage only
intentional files unless user says otherwise.

## Current Code Changes Since Last Handoff

Intentional changes:

- `assets/Test.scene`
  - Replaced old runtime damage/CP candidate stats with current X-Power stats
    for both Team A and Team B.
  - Updated costs from total wave raw Power.
  - Updated counter rules:
    - Spear > Cavalry `45`
    - Archer > Spear `2`
- `UNITSTATS.md`
  - Added current X-Power draft as active stats section.
  - Preserved previous 2026-07-23 runtime damage/CP candidate as backup.
- `assets/scripts/CounterSettings.ts`
  - Updated default counter rules to match scene:
    - Spear > Cavalry `45`
    - Archer > Spear `2`
- `assets/scripts/BattlefieldEvaluator.ts`
  - Base power now uses only alive count, damage, health ratio, health, and
    defense.
  - Opening pressure now picks random affordable melee.
  - Melee response scoring now considers CP advantage versus enemy CP and
    reduces cost penalty when buying the unit still leaves the team ahead.

Do not assume this pass is complete. It is a deliberate pivot to a cleaner
economy model, and the newest CP-advantage/counter changes still need telemetry.
