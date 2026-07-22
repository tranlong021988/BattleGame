# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last updated: 2026-07-22 by home Codex after BattleArmyBrain accuracy pass.

## Handoff Policy

- Treat source code and scene data as the source of truth. Use this file only as a map.
- Update this file only when the user explicitly asks for a handoff/update.
- Keep this file as current truth, not a daily changelog archive.
- Before changing AI, combat, stats, or telemetry, re-check the relevant source files and scene values.
- Do not revive old notes from removed systems unless the user explicitly asks for history.

## Current Active Stack

- Active AI path is `BattleArmyBrain` plus `BattlefieldEvaluator`.
- `SmartArmyBrain` and older `ArmyBrain` notes are legacy unless the scene explicitly enables them.
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

## Design Direction

- The user wants a visible-stat battle system, not hidden matchup hacks.
- Explicit damage counter rules live in `CounterSettings` and scene data.
- AI may use scoring heuristics to choose a unit, but those heuristics must not be confused with combat damage multipliers.
- Current visible melee ladder target:
  - `Cavalry > Axeman > Sword > Spear > Archer > Monk`
- Current hard/soft-hard counter rules:
  - `Spear > Cavalry`
  - `Archer > Spear`
- The user accepts that AI difficulty will later come from:
  - `decisionAccuracy`
  - enemy starting CP
  - level settings
  - unlocked unit roster

## Current BattleArmyBrain Behavior

Source checked: `assets/scripts/BattleArmyBrain.ts`.

- `decisionAccuracy` default is `0.8`.
- Accuracy roll is now simple and explicit:
  - `roll < decisionAccuracy`: keep the tactical evaluator unit choice;
  - `roll >= decisionAccuracy`: keep the same tactical lane/target, but replace only the unit choice with a deliberately poor response.
- Accuracy affects unit choice only. It must not randomize target or lane.
- Low-accuracy decisions no longer use the old `imperfect-random` or `imperfect-wrong` paths.
- Opening and pressure fallback decisions also pass through the accuracy gate:
  - if there is no target and accuracy fails, `BattleArmyBrain` asks `BattlefieldEvaluator.choosePoorGenericEntry(...)`;
  - telemetry reason suffix is `-accuracy-poor`.
- Targeted failed-accuracy decisions use `BattlefieldEvaluator.chooseWrongResponseEntry(...)`;
  - telemetry reason suffix is `-accuracy-wrong`.
- `decisionAccuracy = 0` means all unit choices are deliberately poor; `decisionAccuracy = 1` means all unit choices use the evaluator.
- Spawn timing uses `minSpawnInterval`, `maxSpawnInterval`, and `maxBrainDeltaTime`.
- `enableMaxAliveWaveLimit` and `maxAliveWaves` still gate spawning.
- `BattleArmyBrain` rebuilds `BattlefieldEvaluator` only on its think tick, not every frame.
- `coverageTargetRatio`, `rescueAllyAliveRatio`, and `laneAllyAheadLimit` are copied into the evaluator before decisions.
- `maxRangedSupportWavesPerLane` is the full-accuracy ranged support cap near a target lane.
- Effective ranged support cap is `floor(maxRangedSupportWavesPerLane * decisionAccuracy)`:
  - accuracy `0` means no ranged support;
  - accuracy `1` allows the full cap.
- `maxConsecutiveMeleeWavesPerLane` prevents this brain from spawning too many consecutive melee waves into the same lane.
- Ranged waves do not update/reset melee consecutive-lane history.
- All normal, fallback, accuracy-wrong, and accuracy-poor spawn paths pass through `spawn(...)`.
- `spawn(...)` blocks a melee wave if its lane equals the current blocked consecutive melee lane.
- Opening behavior:
  - if no enemy exists and `spawnOpeningWaveIfNoEnemyWave` is enabled, the brain may spawn one opening pressure wave;
  - after one opening wave, it waits until it has seen enemies before using no-enemy pressure again.

## Current BattlefieldEvaluator Behavior

Source checked: `assets/scripts/BattlefieldEvaluator.ts`.

- Snapshot rebuild collects lane, ally wave, and enemy wave intel from `GameManager.waves`.
- Tactical lane should use `visualLaneId` when available. This prevents stale `laneId` from driving spawn/counter choices.
- Target priority considers:
  - enemy threat power;
  - progress toward defend/hero side;
  - existing ally coverage;
  - struggling ally coverage;
  - same-lane enemies ahead/frontline pressure.
- Direct melee scoring considers:
  - visible stats and estimated power;
  - current target live power ratio;
  - hard-counter bonus from `CounterSettings`;
  - reverse-counter rejection/penalty;
  - cost and overshoot;
  - reachability/blockers;
  - a visible ladder selection bias.
- Important distinction:
  - `getMatchupFactor()` returns explicit counter score from `CounterSettings` only.
  - Ladder bias affects AI choice score, not combat damage.
- Ranged support rules currently require safety:
  - there must be ally frontline in the target lane;
  - the frontline must be engaged;
  - frontline block power must be positive.
- Ranged support capacity is global-ish by snapshot:
  - current ranged support count must be lower than current melee wave count.
- Per target lane:
  - ranged support count near that target must stay below `maxRangedSupportWavesPerLane`;
  - do not spawn the same ranged family twice in a row into the same lane.
- Role rule:
  - Archer requires one engaged frontline.
  - Monk requires two engaged frontlines.
  - Full-strength ranged hard counter can be prioritized, but still must pass safety rules.
- Pressure fallback:
  - uses empty/low-traffic lane selection;
  - picks economical non-Cavalry melee first;
  - uses Cavalry only if no non-Cavalry melee is affordable;
  - does not use ranged as pressure.
- Aggressive forward rules:
  - opening/pressure fallback can still spawn aggressive into empty pressure lanes;
  - ranged entries never spawn aggressive;
  - melee/frontline responses spawn aggressive when the selected target is in the same spawn lane, that lane has no ally wave, and no other same-lane enemy stands between spawn and the target;
  - Cavalry can also spawn aggressive against ranged targets when the path is viable and not blocked by Spear.
- Cavalry is rejected as a response if the path to the target has an enemy Spear blocker from spawn. This prevents the evaluator from treating Cavalry as a smart response into a Spear trap.
- Accuracy-wrong selection:
  - ignores ranged candidates;
  - rejects the correct evaluator entry;
  - rejects actual hard counters against the target;
  - uses full-strength matchup power, not the target's current weakened health, so a bad AI cannot accidentally justify a good response because allies already damaged the target;
  - chooses uniformly among eligible poor responses, so low accuracy looks random rather than always selecting one family.
- Accuracy-poor no-target selection:
  - ignores ranged candidates;
  - rejects the evaluator entry;
  - chooses uniformly among eligible poor generic melee entries.
- Removed/outdated:
  - no `clusterScore` requirement;
  - no fixed "at least 3 melee waves" ranged support rule;
  - no `maxRangedSupportWavesTotal`;
  - no ranged fallback bypassing support safety;
  - no hidden matchup damage multiplier in evaluator.

## Current Combat And Movement Fixes

Source checked: `GameManager.ts`, `Unit.ts`, `UnitBehavior.ts`, and `BattlefieldEvaluator.ts`.

- Hero phase no longer forces already-engaged enemy waves back to forward:
  - `GameManager.forceEnemyWavesToForward()` skips waves where `wave.hasEngagedRuntime(frame)` is true.
- A unit may not keep damaging a target that moved out of attack range:
  - `UnitBehavior` checks `unit.isCurrentEnemyInAttackRange()` before applying damage.
  - if the target is out of range, `Unit.disengageCurrentEnemyForChase()` clears busy state but keeps the target so the unit can chase.
- Stale target safety uses `lifeId` checks on units, so pooled/despawned units should not remain valid old targets.
- Tactical spawn lane fixes use `visualLaneId` first, then fallback to `laneId`.
- Back-to-lane after freehunt is accepted by the user. Do not treat it as a bug by itself.
- User-accepted nuance: short waits until the next search/scan tick are valid and are not considered "standing idle" bugs.

## Current Unit Stats

Scene values checked in `assets/Test.scene` and mirrored by `UNITSTATS.md`.

| Unit | Family | Count | Cost | Health | Damage | Defense | Speed | Range | Radius | Interval |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `axeman_t1` | Axeman | 10 | 52 | 195 | 34 | 5 | 4.65 | 0.35 | 0.0 | 0.36-0.44 |
| `cavalry_t1` | Cavalry | 10 | 64 | 235 | 40 | 8 | 9.75 | 0.35 | 0.0 | 0.39-0.48 |
| `sword_t1` | Sword | 10 | 46 | 175 | 24 | 8 | 5.10 | 0.35 | 0.0 | 0.36-0.44 |
| `spear_t1` | Spear | 10 | 38 | 130 | 13 | 5 | 4.50 | 0.35 | 0.0 | 0.40-0.50 |
| `monk_t1` | Monk | 2 | 28 | 75 | 24 | 0 | 4.05 | 5.20 | 0.70 | 2.10-2.50 |
| `archer_t1` | Archer | 4 | 32 | 70 | 14 | 0 | 5.70 | 6.20 | 0.0 | 1.10-1.35 |

Current estimated raw power ladder, using `BattlefieldEvaluator.getEntryBasePower()` with full waves, is intended to remain:

```text
Cavalry > Axeman > Sword > Spear > Archer > Monk
```

Recent tuning rationale:

- `Axeman.damage` is now `34`; it was raised because telemetry showed Sword could outperform Axeman in runtime damage/CP.
- `Spear.damage` is now `13`; it was lowered after Spear stayed over-picked and too economically attractive in several AI-policy batches.
- `Monk.damage` is now `24`; it was raised back after Monk became the lowest runtime damage/CP and spawn share.
- Keep `Monk.damageRadius = 0.70`; it is important for the visible AoE support role.

## Current Counter Settings

Scene checked in `assets/Test.scene`.

- `autoCreateDefaultRules = false`.
- Active scene rules:
  - `Spear > Cavalry`, multiplier `10.5`.
  - `Archer > Spear`, multiplier `2.0`.
- Code defaults in `CounterSettings.ts` can differ from scene values. For current tests, inspect scene data first.
- Damage formula:
  - `damage = max(1, attacker.damage - defender.defense) * counterMultiplier`

Current concrete checks:

```text
Spear -> Cavalry: max(1, 13 - 8) * 10.5 = 52.5 damage/hit
Cavalry -> Spear: max(1, 40 - 5) = 35 damage/hit
Archer -> Spear: max(1, 14 - 5) * 2.0 = 18 damage/hit
```

## Telemetry Workflow

- Telemetry is for testing only; real game can run with telemetry disabled.
- Current workflow downloads one JSON report per battle.
- Auto reload is delayed by `battleTelemetryReloadDelaySeconds` to avoid browser download blocking.
- Use telemetry to diagnose:
  - winner/end reason;
  - CP remaining;
  - whether a side ended with no affordable spawn;
  - hero-death vs CP-exhaustion endings;
  - spawn mix by family;
  - spawn decisions/reasons;
  - damage/CP and kill/CP;
  - counter pair performance;
  - ranged support frequency and safety;
  - whether a unit family is over-picked because of AI policy rather than stats.
- When balancing, do not conclude from one metric alone. Compare at least:
  - visible stats;
  - AI spawn decisions;
  - CP economy;
  - map/lane reachability;
  - combat result;
  - telemetry aggregate.

## Current Balance Diagnosis Notes

- The user does not want endless small local fixes. Prefer a whole-system diagnosis before changing stats.
- The current balance target is not "every unit wins equally".
- Better target:
  - CP cost should roughly match useful battle value;
  - counter relationships should be visible;
  - ranged units should need melee cover;
  - melee ladder should be visible from stats;
  - AI should not collapse into one family because of scoring artifacts.
- Be careful with Cavalry:
  - it is high-speed and high-value;
  - it is hard-countered by Spear;
  - it may be used to punish ranged if path is viable.
- Be careful with ranged:
  - Archer and Monk are support, not pressure/open-lane attackers;
  - they should not spawn without engaged melee cover;
  - Monk support needs more frontline than Archer.

## 2026-07-22 Handoff: Stats, Economy, Accuracy

Main goals today:

- Stabilize tier-1 balance around CP economy rather than raw kill count.
- Preserve visible stats and explicit counter rules; do not hide balance in secret multipliers.
- Make `BattleArmyBrain.decisionAccuracy` a real difficulty knob:
  - `1.0` should behave like the current tactical evaluator;
  - `0.0` should keep tactical lane/target pressure but choose poor unit responses.
- Confirm that AI max beats AI zero in telemetry.

### Stats State

Current active tier-1 stats are mirrored in `UNITSTATS.md` and `assets/Test.scene`.

Final active changes from today's balance loop:

```text
axeman_t1: damage 32 -> 34
spear_t1: damage 14 -> 13
monk_t1: damage 23 -> 24
```

Reasoning:

- Axeman was raised because telemetry showed Sword sometimes outperforming Axeman in runtime damage/CP.
- Spear was lowered because Spear was over-spawned and too economically attractive in some batches, especially when Cavalry appeared often.
- Monk was raised back because Monk had become the lowest runtime damage/CP and lowest spawn share; its AoE role should remain visible, but it should still be support, not frontline.

Current intended reference ladder:

```text
Cavalry > Axeman > Sword > Spear > Archer > Monk
```

Important: use this ladder as a balance reference, not as a hard rule that every telemetry metric must perfectly match every batch. Runtime kill/CP and damage/CP are affected by AI policy, lane flow, ranged safety, target availability, and battle noise.

### CP Economy Direction

The user clarified the real balance goal:

- The game should be won by using CP efficiently.
- Good AI should avoid overkill and pick units that are sufficient enough for the current battlefield.
- High-cost units are allowed if CP is comfortable, but should not be spawned into obvious counter traps.
- Kill statistics are noisy; runtime damage/CP and winrate under controlled AI settings are more useful.
- In max-vs-max tests, close winrate plus a reasonable damage/CP ladder means balance is probably acceptable.
- In max-vs-zero tests, max AI should win consistently.

### BattleArmyBrain Accuracy Implementation

Current implementation:

- `BattleArmyBrain` rolls once per think/spawn decision:

```text
roll < decisionAccuracy  -> keep evaluator unit choice
roll >= decisionAccuracy -> keep evaluator lane/target, replace only unit choice
```

- Accuracy does not change lane selection.
- Accuracy does not change target selection.
- Telemetry is output only; it must not feed gameplay decisions.
- Ranged support scales with accuracy:

```text
effectiveRangedSupportLimit = floor(maxRangedSupportWavesPerLane * decisionAccuracy)
```

- Accuracy `0` means no ranged support.
- Accuracy `1` means full ranged support cap.

Removed/outdated:

- Old `imperfect-random` path is gone.
- Old `imperfect-wrong` path is gone.
- Old split of `deliberate mistake` vs `random affordable` is gone.
- Do not reintroduce random lane or random target for accuracy.

### Poor/Wrong Unit Choice Rules

For decisions with a target:

- `BattlefieldEvaluator.chooseWrongResponseEntry(...)` is used.
- It keeps evaluator lane/target.
- It filters candidates:
  - no ranged candidates;
  - not the evaluator's correct entry;
  - not a hard counter against the target;
  - not in a blocked consecutive-melee lane;
  - must be a clearly poor matchup by at least one rule:
    - target hard-counters candidate;
    - candidate is below target on melee ladder;
    - candidate loses by full-strength matchup power ratio.
- It uses full-strength matchup power, not current damaged target power. This prevents a bad AI from choosing a good-enough response simply because allies already weakened the target.
- After filtering, it now selects uniformly among eligible poor responses. This was changed because weighted selection made B spawn too much Spear against Axeman.

For decisions without a target:

- `BattlefieldEvaluator.choosePoorGenericEntry(...)` is used.
- It keeps evaluator lane.
- It filters out ranged and the evaluator's original entry.
- It selects uniformly among eligible poor generic melee entries.
- Reason suffix is `-accuracy-poor`.

Telemetry reason suffixes:

```text
snapshot-live-force-response-accuracy-wrong
snapshot-hard-counter-accuracy-wrong
snapshot-opening-pressure-accuracy-poor
snapshot-pressure-fallback-accuracy-poor
```

Telemetry now also records intended/evaluator choice and CP context:

```text
intendedUnitName
intendedFamilyName
combatPointAtDecision
enemyCombatPointAtDecision
combatPointAdvantageAtDecision
postSpawnCombatPoint
postSpawnCombatPointAdvantage
combatPointCostRatioAtDecision
canComfortablyAffordAtDecision
```

### Accuracy Test Results

Batch before fixing accuracy:

- A/team 0 accuracy `1`, B/team 1 accuracy `0`.
- Result: A won `7/10`, B won `3/10`.
- Diagnosis:
  - B accuracy `0` was active, but poor choices were not poor enough;
  - B still got enough Sword/Axeman/Cavalry choices to win by noise or raw melee pressure;
  - opening/fallback decisions without target could still pass through as accurate-looking Axeman choices.

After full-strength poor-response fix:

- A/team 0 accuracy `1`, B/team 1 accuracy `0`.
- Result from 14 reports: A won `14/14`.
- B telemetry:

```text
B total spawn: 262 waves
B accurateDecision: 0
B deliberateMistake: 262
```

- B spawn mix:

```text
Spear   190 waves, 72.5%
Sword    48 waves, 18.3%
Cavalry  21 waves,  8.0%
Axeman    3 waves,  1.1%
Ranged    0 waves
```

- Diagnosis:
  - success criterion `accuracy 1 beats accuracy 0` was met;
  - however B looked too deterministic and over-selected Spear.

Final adjustment after that report:

- Low-accuracy poor/wrong selection was changed from weighted random to uniform random among eligible poor candidates.
- Expected visual behavior:
  - if A has Axeman as a frontline/target, B accuracy low should not always answer with Spear;
  - it should vary among poor options such as Spear and Sword when both are eligible.
- This final uniform-random tweak has not yet been telemetry-tested at handoff time.

### How To Continue

Suggested next checks:

- Run a small batch with A accuracy `1`, B accuracy `0`:
  - A should still win nearly/all games;
  - B should no longer spawn Spear in an obviously machine-like loop.
- Then test intermediate difficulty:
  - B accuracy `0.3`;
  - B accuracy `0.5`;
  - compare whether decisions transition smoothly from poor to tactical.
- For each batch, inspect:
  - winrate;
  - B `accurateDecision` vs `deliberateMistake`;
  - reason suffixes `-accuracy-wrong` and `-accuracy-poor`;
  - spawn mix;
  - intended unit vs actual unit;
  - damage/CP by family.

Do not tune stats again until the final uniform-random accuracy behavior is tested. If B accuracy `0` still wins often, fix poor-response logic first. If B accuracy `0` loses but looks too repetitive, adjust candidate distribution, not unit stats.

## Deprecated / Do Not Revive

- Do not treat old `SmartArmyBrain` sections as current runtime truth unless the scene enables it.
- Do not reintroduce `clusterScore`, hardcoded cluster thresholds, or old "3 melee wave" support thresholds.
- Do not reintroduce `maxRangedSupportWavesTotal`; ranged limit should derive from current melee presence plus per-lane/per-target caps.
- Do not add hidden combat multipliers in `BattlefieldEvaluator`.
- Do not add small magic constants to hide logic bugs.
- Do not update this file after every code change. Update only when the user asks.
