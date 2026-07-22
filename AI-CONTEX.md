# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last updated: 2026-07-22 by office Codex after balance telemetry/stat pass.

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
- Accuracy roll currently splits decisions into:
  - accurate tactical evaluator decision;
  - deliberate wrong counter choice;
  - random affordable choice.
- Spawn timing uses `minSpawnInterval`, `maxSpawnInterval`, and `maxBrainDeltaTime`.
- `enableMaxAliveWaveLimit` and `maxAliveWaves` still gate spawning.
- `BattleArmyBrain` rebuilds `BattlefieldEvaluator` only on its think tick, not every frame.
- `coverageTargetRatio`, `rescueAllyAliveRatio`, and `laneAllyAheadLimit` are copied into the evaluator before decisions.
- `maxRangedSupportWavesPerLane` caps ranged support near a target lane.
- `maxConsecutiveMeleeWavesPerLane` prevents this brain from spawning too many consecutive melee waves into the same lane.
- Ranged waves do not update/reset melee consecutive-lane history.
- All normal, fallback, random, and deliberate-wrong spawn paths pass through `spawn(...)`.
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
| `axeman_t1` | Axeman | 10 | 52 | 195 | 32 | 5 | 4.65 | 0.35 | 0.0 | 0.36-0.44 |
| `cavalry_t1` | Cavalry | 10 | 64 | 235 | 40 | 8 | 9.75 | 0.35 | 0.0 | 0.39-0.48 |
| `sword_t1` | Sword | 10 | 46 | 175 | 24 | 8 | 5.10 | 0.35 | 0.0 | 0.36-0.44 |
| `spear_t1` | Spear | 10 | 38 | 130 | 14 | 5 | 4.50 | 0.35 | 0.0 | 0.40-0.50 |
| `monk_t1` | Monk | 2 | 28 | 75 | 23 | 0 | 4.05 | 5.20 | 0.70 | 2.10-2.50 |
| `archer_t1` | Archer | 4 | 32 | 70 | 14 | 0 | 5.70 | 6.20 | 0.0 | 1.10-1.35 |

Current estimated raw power ladder, using `BattlefieldEvaluator.getEntryBasePower()` with full waves, is intended to remain:

```text
Cavalry > Axeman > Sword > Spear > Archer > Monk
```

Recent tuning rationale:

- `Monk.damage` was reduced `24 -> 23` because real telemetry had Monk slightly above Archer in runtime damage/CP even though raw power was lower. Keep `damageRadius = 0.70`; it is important for the visible AoE role.
- `Spear.damage` was raised from `12` to test whether it should sit above Archer, then settled at `14` after `15` pushed Spear to roughly Sword-level runtime damage/CP in a Cavalry-heavy batch.
- `Axeman.damage` was raised `30 -> 32` so Axeman is clearly above Sword in estimated power/CP while preserving the visible melee ladder.

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
Spear -> Cavalry: max(1, 14 - 8) * 10.5 = 63 damage/hit
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

## 2026-07-22 Balance Handoff

What was changed today and why:

- Added aggressive-forward for clean direct-lane melee responses:
  - if an enemy target is the front enemy in a lane and our side has no ally wave in that lane, the spawned melee/frontline response should use `aggressiveForward`;
  - reason: the user wanted clean-lane counter/response waves to press through instead of behaving like ordinary conservative forward;
  - result from telemetry: aggressive counts were visible and mostly came from `snapshot-live-force-response`, so the rule is active.
- Tuned current tier-1 stats around the target ladder:
  - target ladder: `Cavalry > Axeman > Sword > Spear > Archer > Monk`;
  - Monk was lowered via damage, not radius, because radius is the visual AoE identity;
  - Spear was tested higher but reduced to `damage 14` because `damage 15` made runtime damage/CP nearly equal to or slightly above Sword;
  - Axeman was raised to `damage 32` to make it clearly sit above Sword.

Telemetry interpretation from today's latest meaningful batches:

- Batch after Monk `damage 23`, before Spear/Axeman final tweak:
  - win split was close;
  - runtime damage/CP roughly followed `Cavalry > Axeman > Sword > Archer > Spear > Monk`;
  - Archer was slightly above Spear, so Spear needed a small lift.
- Batch with Spear `15` and Axeman `32`:
  - 14 reports, A/B win split `7-7`;
  - all ended by `team-eliminated-and-cannot-afford-spawn`;
  - runtime damage/CP was roughly `Cavalry 35.99 > Axeman 31.80 > Spear 28.33 ~= Sword 28.22 > Archer 18.67 > Monk 12.75`;
  - diagnosis: balance was good at team level, but Spear `15` was slightly too high for the desired ladder because the batch had many Cavalry waves and Spear benefited from hard-counter damage.
- Final adjustment before handoff:
  - Spear damage changed `15 -> 14`;
  - next Codex should request/test another telemetry batch before changing more stats.

How to continue:

- Do not immediately tune another single number without checking a new report batch.
- First check whether runtime damage/CP returns close to:
  - `Cavalry > Axeman > Sword > Spear > Archer > Monk`.
- Also check spawn mix:
  - Sword should not disappear from melee decisions;
  - Monk should remain support, not a top damage/CP unit;
  - Archer may outperform Spear in batches with many Spear targets, but should not globally dominate.
- If Spear is still above Sword after the next batch, consider reducing `Spear.damage` back toward `13` or reducing Spear counter multiplier slightly, but do not touch both without telemetry.
- If Spear drops below Archer again, prefer revisiting `Archer.damage` or `Archer` support frequency before over-buffing Spear.

## Deprecated / Do Not Revive

- Do not treat old `SmartArmyBrain` sections as current runtime truth unless the scene enables it.
- Do not reintroduce `clusterScore`, hardcoded cluster thresholds, or old "3 melee wave" support thresholds.
- Do not reintroduce `maxRangedSupportWavesTotal`; ranged limit should derive from current melee presence plus per-lane/per-target caps.
- Do not add hidden combat multipliers in `BattlefieldEvaluator`.
- Do not add small magic constants to hide logic bugs.
- Do not update this file after every code change. Update only when the user asks.
