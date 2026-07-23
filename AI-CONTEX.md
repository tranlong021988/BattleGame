# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last updated: 2026-07-23 by office Codex after the ranged/support and melee
runtime damage/CP balance pass.

## Handoff Policy

- Treat source code and scene data as the source of truth. Use this file only as
  a map.
- Update this file only when the user explicitly asks for a handoff/update.
- Keep this file as current truth, not a daily changelog archive.
- Before changing AI, combat, stats, or telemetry, re-check the relevant source
  files and scene values.
- Do not revive old notes from removed systems unless the user explicitly asks
  for history.

## Current Active Stack

- Active AI path: `BattleArmyBrain` plus `BattlefieldEvaluator`.
- `SmartArmyBrain` and older `ArmyBrain` notes are legacy unless the scene
  explicitly enables them.
- Current key files:
  - `assets/scripts/BattleArmyBrain.ts`
  - `assets/scripts/BattlefieldEvaluator.ts`
  - `assets/scripts/GameManager.ts`
  - `assets/scripts/BattleWave.ts`
  - `assets/scripts/Unit.ts`
  - `assets/scripts/UnitBehavior.ts`
  - `assets/scripts/BattleTelemetry.ts`
  - `assets/scripts/CounterSettings.ts`
  - `assets/Test.scene`
  - `UNITSTATS.md`

## Current Balance Philosophy

- The current goal is not "every unit wins equally".
- The user now wants runtime `damage/CP` to be reasonably stable so each CP
  spent feels valuable.
- Melee `damage/CP` may be close, but should still broadly respect the visible
  melee ladder:

```text
Cavalry > Axeman > Sword > Spear
```

- Ranged/support should not look like a CP loss. It can sit slightly below
  melee because ranged value includes first-shot advantage, safety behind
  frontline, and AoE/support pressure.
- Hard-counter rules should create clear local exceptions:

```text
Spear > Cavalry
Archer > Spear
```

- Avoid hidden combat multipliers. Explicit combat multipliers belong in
  `CounterSettings`/scene data only.
- AI scoring heuristics can affect which unit gets selected, but must not be
  confused with actual damage multipliers.
- User dislikes narrow "one-number" fixes unless they are backed by whole-system
  reasoning and telemetry.

## Current Unit Stats

Scene values checked in `assets/Test.scene` and mirrored by `UNITSTATS.md`.

| Unit | Family | Count | Cost | Health | Damage | Defense | Speed | Range | Radius | Interval |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `axeman_t1` | Axeman | 10 | 56 | 180 | 28 | 5 | 4.65 | 0.35 | 0.0 | 0.36-0.44 |
| `cavalry_t1` | Cavalry | 10 | 64 | 235 | 40 | 8 | 9.75 | 0.35 | 0.0 | 0.39-0.48 |
| `sword_t1` | Sword | 10 | 46 | 175 | 24 | 8 | 5.10 | 0.35 | 0.0 | 0.36-0.44 |
| `spear_t1` | Spear | 10 | 38 | 130 | 14 | 5 | 4.50 | 0.35 | 0.0 | 0.40-0.50 |
| `monk_t1` | Monk | 2 | 28 | 75 | 23 | 0 | 4.05 | 5.20 | 1.00 | 1.50-1.90 |
| `archer_t1` | Archer | 4 | 32 | 70 | 16 | 0 | 5.70 | 6.20 | 0.0 | 1.10-1.35 |

Current scene counter rules:

| Attacker | Defender | Multiplier | Intent |
| --- | --- | ---: | --- |
| Spear | Cavalry | 18.0 | Spear kills Cavalry in 3 hits, not 1-2 hits. |
| Archer | Spear | 4.0 | Archer punishes Spear clearly without over-inflating Archer too much. |

Damage formula:

```text
damage = max(1, attacker.damage - defender.defense) * counterMultiplier
```

Concrete checks:

```text
Spear -> Cavalry: max(1, 14 - 8) * 18 = 108 damage/hit
Cavalry HP: 235, so Cavalry dies after 3 Spear hits.

Archer -> Spear: max(1, 16 - 5) * 4 = 44 damage/hit
Spear HP: 130, so Spear dies after 3 Archer hits.
```

## Current BattleArmyBrain Behavior

Source checked: `assets/scripts/BattleArmyBrain.ts`.

- `decisionAccuracy` default is `0.8`.
- Accuracy roll splits decisions into:
  - accurate tactical evaluator decision;
  - deliberate wrong counter choice;
  - random affordable choice.
- Tests today mostly used `decisionAccuracy = 1` for both teams unless noted.
- Spawn timing uses `minSpawnInterval`, `maxSpawnInterval`, and
  `maxBrainDeltaTime`.
- `enableMaxAliveWaveLimit` and `maxAliveWaves` still gate spawning.
- `BattleArmyBrain` rebuilds `BattlefieldEvaluator` on its think tick, not every
  frame.
- All normal, fallback, random, and deliberate-wrong spawn paths pass through
  `spawn(...)`.
- Opening behavior:
  - if no enemy exists and `spawnOpeningWaveIfNoEnemyWave` is enabled, the brain
    may spawn one opening pressure wave;
  - after one opening wave, it waits until it has seen enemies before using
    no-enemy pressure again.

## Current BattlefieldEvaluator Behavior

Source checked: `assets/scripts/BattlefieldEvaluator.ts`.

- Snapshot rebuild collects lane, ally wave, and enemy wave intel from
  `GameManager.waves`.
- Tactical lane should use `visualLaneId` when available. This prevents stale
  `laneId` from driving spawn/counter choices.
- Target priority considers enemy threat, progress toward defend/hero side,
  existing ally coverage, struggling allies, same-lane enemies ahead, and
  frontline pressure.
- Direct melee scoring considers visible stats, estimated power, target live
  power ratio, hard-counter bonus, reverse-counter rejection/penalty, cost,
  overshoot, reachability/blockers, and melee ladder bias.
- Important distinction:
  - `getMatchupFactor()` returns explicit counter score from `CounterSettings`.
  - ladder bias only affects AI choice score.
  - evaluator does not add hidden damage multipliers.
- Melee ladder bias currently ranks:

```text
Spear = 0
Sword = 1
Axeman = 2
Cavalry = 3
```

- Ranged support rules:
  - ranged entries never spawn aggressive;
  - there must be ally frontline in the target lane;
  - the frontline must be engaged;
  - frontline block power must be positive;
  - current ranged support count must be lower than current melee wave count;
  - per target lane, ranged support count near that target must stay below
    `maxRangedSupportWavesPerLane`;
  - do not spawn the same ranged family twice in a row into the same lane.
- Role rule:
  - Archer requires one engaged frontline.
  - Monk requires two engaged frontlines.
  - Full-strength ranged hard counter can be prioritized, but still must pass
    safety rules.
- Pressure fallback:
  - uses empty/low-traffic lane selection;
  - picks economical non-Cavalry melee first;
  - uses Cavalry only if no non-Cavalry melee is affordable;
  - does not use ranged as pressure.
- Aggressive forward rules:
  - opening/pressure fallback can still spawn aggressive into empty pressure
    lanes;
  - ranged entries never spawn aggressive;
  - melee/frontline responses spawn aggressive when selected target is in the
    same spawn lane, that lane has no ally wave, and no other same-lane enemy
    stands between spawn and target;
  - Cavalry can also spawn aggressive against ranged targets when path is viable
    and not blocked by Spear.

## Current Combat And Movement Notes

Source previously checked: `GameManager.ts`, `Unit.ts`, `UnitBehavior.ts`, and
`BattlefieldEvaluator.ts`.

- Hero phase no longer forces already-engaged enemy waves back to forward:
  `GameManager.forceEnemyWavesToForward()` skips waves where
  `wave.hasEngagedRuntime(frame)` is true.
- A unit may not keep damaging a target that moved out of attack range:
  `UnitBehavior` checks `unit.isCurrentEnemyInAttackRange()` before applying
  damage.
- If target is out of range, `Unit.disengageCurrentEnemyForChase()` clears busy
  state but keeps the target so unit can chase.
- Stale target safety uses `lifeId` checks on units, so pooled/despawned units
  should not remain valid old targets.
- Back-to-lane after freehunt is accepted by the user. Do not treat it as a bug
  by itself.
- User-accepted nuance: short waits until the next search/scan tick are valid
  and are not considered "standing idle" bugs.

## Telemetry Workflow

- Telemetry is for testing only; real game can run with telemetry disabled.
- Current workflow downloads one JSON report per battle.
- Always read config from each telemetry file before aggregating. Some batches
  have accidentally mixed old and new configs.
- Key fields used today:
  - `result.winnerTeam`, `result.reason`;
  - `teams[].combatPoint`, `aliveCount`, kills, deaths, counter kills, damage;
  - `config.unitStats` and `config.counterRules`;
  - `waveSpawns[]` for spawn mix/reasons/decision accuracy;
  - `unitTypes[]` for `damagePerCombatPointSpent`, AoE damage, counter damage,
    kill/death breakdowns.
- Track "winner also exhausted" when winner cannot spawn the cheapest unit and
  has `aliveCount <= 10`.
- The current lowest cost is `28` because Monk costs `28`.

## Today's Balance Work And Results

The main design discovery today: runtime `damage/CP` should be stable enough
that a user does not feel any troop is a CP loss. Melee can be close, but should
still roughly follow ladder. Ranged/support should sit near melee, not far below.

### Ranged/Support

Problem:

- Earlier telemetry had Archer/Monk far below melee damage/CP.
- If ranged/support looks inefficient, the player may stop using it.

Changes:

- `Monk.damageRadius`: `0.70 -> 1.00`
  - Reason: preserve visible AoE identity rather than only raising damage.
  - Result: Monk jumped from about `16` to about `22-25` damage/CP depending on
    clustering. About `76-79%` of Monk damage is AoE, so role is visible.
- `Archer.damage`: `14 -> 16`
  - Reason: bring Archer closer to melee/support value.
- `Monk.attackInterval`: `2.10-2.50 -> 1.95-2.35 -> 1.50-1.90`
  - Reason: raise support damage/CP closer to melee without increasing radius
    further.
  - Latest 16-report batch after Monk interval `1.50-1.90` and Archer>Spear x4
    had Monk around `25.01` damage/CP.
- `Archer > Spear` counter:
  - Tried `x5`, but Archer rose too high when Spear was common.
  - Current value is `x4`.

Latest relevant 16-report batch with Archer>Spear `x4`, Axe cost `56`, Axe HP
`180`, Monk interval `1.50-1.90`:

```text
Team 0 wins: 9/16
Team 1 wins: 7/16
End reason: all team-eliminated-and-cannot-afford-spawn
Winner also exhausted: 4/16

Damage/CP:
Axeman   34.97
Cavalry  31.86
Archer   29.93
Sword    27.73
Spear    25.67
Monk     25.01
```

Interpretation:

- Archer is now useful and no longer a CP loss.
- Monk is now useful and still behaves like AoE support.
- Spear is lower because Archer punishes it and Spear is weak outside its
  Cavalry counter.

### Spear > Cavalry

Problem:

- At `x13.5`, Spear beat Cavalry but survived with only about `30-40%` HP in
  simulations.
- User compared hard-counter strength to natural ladder outcomes and initially
  considered stronger counters.

Simulation notes:

- `x40` makes Spear one-shot Cavalry:
  - Spear -> Cavalry = `(14 - 8) * 40 = 240`.
  - Too strong at individual-unit level.
- `x20` makes Cavalry die in 2 hits.
- Current `x18` makes Cavalry die in 3 hits:

```text
Spear -> Cavalry = 108 damage/hit
Cavalry HP = 235
3 hits to kill
```

Interpretation:

- Current `x18` is intentional: clear hard-counter, not one-shot, not two-hit.

### Axeman

Problem:

- Axeman remained high in runtime damage/CP even after damage reductions.
- Diagnosis from code + telemetry:
  - Axeman is usually selected into favorable lanes, especially versus Sword.
  - It has no hard-counter multiplier against it.
  - `BattlefieldEvaluator.getSnapshotMeleeLadderBias()` correctly rewards
    Axeman against Sword.
  - Therefore Axeman is not a damage bug; it is a stable, low-risk melee that AI
    uses in good matchups.

Changes:

- `Axeman.damage`: `32 -> 30 -> 28`
- `Axeman.cost`: `52 -> 56`
- `Axeman.health`: `195 -> 180`

Reasoning:

- Reducing damage alone did not sufficiently lower runtime value because Axeman
  still survived and farmed after favorable matchups.
- Raising cost lowered economy without changing battlefield feel.
- Lowering HP targets the real issue: Axeman wins good matchups then lives too
  long and continues farming.

1v1 unit simulation after `Axeman HP 180, damage 28, cost 56`:

```text
Sword vs Axeman:
Axeman wins, about 10.3% HP left.

Axeman vs Cavalry:
Cavalry wins, about 49.1% HP left.

Spear vs Axeman:
Axeman wins, about 75.6% HP left.
```

Interpretation:

- Melee ladder still holds:

```text
Cavalry > Axeman > Sword > Spear
```

- Axeman > Sword is now intentionally close, reducing post-fight farming.

Latest very small 4-report batch after Axeman HP `180`:

```text
Team 0 wins: 2/4
Team 1 wins: 2/4
Winner also exhausted: 2/4

Damage/CP:
Axeman   40.41
Archer   32.88
Cavalry  29.81
Sword    29.61
Spear    26.73
Monk     24.85
```

Interpretation:

- This sample is too small. Axeman only spawned 7 waves, so its damage/CP is
  highly selection-biased.
- Do not tune Axeman further from this 4-report batch alone.

## Current Open Questions / Next Steps

1. Test at least one larger batch after Axeman HP `180`.
   - Need 10-20 reports minimum.
   - Specifically check whether Axeman remains above Cavalry with enough wave
     samples.
2. If Axeman still sits clearly above Cavalry in a larger batch:
   - first inspect Axeman spawn targets and damage-to-family matrix;
   - do not blindly reduce damage again because `Axeman > Sword` 1v1 is already
     close.
3. Watch Monk:
   - target is support around mid/high 20s damage/CP, not top melee;
   - keep radius `1.0` unless it becomes visually/gameplay oppressive.
4. Watch Archer:
   - `x4` should keep Archer useful without over-punishing Spear;
   - if Archer rises back above melee too often, inspect how many Spear waves
     existed before changing the multiplier.
5. Watch winrate:
   - recent batches moved from strong Team 0/Team 1 swings toward 50/50, but
     small samples can swing.
   - treat 10+ reports as a minimum for decisions.

## Deprecated / Do Not Revive

- Do not treat old `SmartArmyBrain` sections as current runtime truth unless the
  scene enables it.
- Do not reintroduce `clusterScore`, hardcoded cluster thresholds, or old
  "3 melee wave" support thresholds.
- Do not reintroduce `maxRangedSupportWavesTotal`; ranged limit should derive
  from current melee presence plus per-lane/per-target caps.
- Do not add hidden combat multipliers in `BattlefieldEvaluator`.
- Do not add small magic constants to hide logic bugs.
- Do not update this file after every code change. Update only when the user
  asks.
