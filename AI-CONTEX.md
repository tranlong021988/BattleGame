# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last updated: 2026-07-24 by office Codex after the BattleArmyBrain CP-strategy
pass, single-wave matchup test support, Spear/Cavalry counter rebalance, Monk
AoE/cost review, and response-reservation fix.

## Handoff Policy

- Source code and scene data are the source of truth. Use this file as the
  current map, not as a replacement for reading code.
- Update this file only when the user explicitly asks for handoff/update.
- Do not add hidden balance multipliers. Combat multipliers must live in
  `CounterSettings` / scene counter data.
- The user strongly dislikes narrow patch-chasing. For AI/balance work, inspect
  the whole flow before changing one number or branch.
- Before touching AI, combat, stats, or telemetry, re-check:
  - `assets/Test.scene`
  - `UNITSTATS.md`
  - `assets/scripts/BattleArmyBrain.ts`
  - `assets/scripts/BattlefieldEvaluator.ts`
  - `assets/scripts/CounterSettings.ts`
  - `assets/scripts/BattleTelemetry.ts`
  - `assets/scripts/GameManager.ts`

## Active Stack

- Active AI: `BattleArmyBrain` + `BattlefieldEvaluator`.
- Legacy: old `ArmyBrain` / `SmartArmyBrain` should be treated as inactive
  unless a scene explicitly enables them.
- Active test scope is tier 1 only:
  - Axeman
  - Cavalry
  - Sword
  - Spear
  - Monk
  - Archer
- Skirmisher is inactive in the current pass.
- Telemetry is for testing only. Real gameplay normally has telemetry off.

## Current Balance Model

The current baseline uses X-Power with Sword as the base. The intent is:

- cost should buy raw wave power;
- raw melee ladder should be visible in normal matchups;
- runtime telemetry diagnoses AI/meta distortions, not the only definition of
  unit balance.

Raw Power formula:

```text
EffectiveHP = Health * (1 + Defense * 0.045)
RawUnitPower = sqrt(Damage * EffectiveHP)
WaveRawPower = RawUnitPower * UnitCount
Cost = round(WaveRawPower / 10)
```

Important nuance:

- Raw Power intentionally uses `Health`, `Damage`, `Defense`, and `UnitCount`.
- It does not directly price speed, range, AoE, attack interval, or AI context.
- Ranged/AoE may need explicit premium cost because protected range/AoE creates
  runtime value beyond raw Power.
- Runtime `damage/CP` is useful, but it is distorted by spawn logic, target
  selection, frontline protection, AoE uptime, and lane noise.

## Current Unit Stats

Scene values in `assets/Test.scene` and `UNITSTATS.md` should match this table.

| Unit | Family | Count | Cost | HP | Damage | Defense | Speed | Range | Damage Radius | Attack Interval | Raw Power |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| `axeman_t1` | Axeman | 10 | 74 | 110 | 46 | 2 | 4.65 | 0.35 | 0.0 | 0.36-0.44 | ~1.50X |
| `cavalry_t1` | Cavalry | 10 | 97 | 160 | 45 | 7 | 9.75 | 0.35 | 0.0 | 0.36-0.44 | ~1.97X |
| `sword_t1` | Sword | 10 | 49 | 100 | 20 | 5 | 5.10 | 0.35 | 0.0 | 0.36-0.44 | 1.00X |
| `spear_t1` | Spear | 10 | 39 | 95 | 14 | 3 | 4.50 | 0.35 | 0.0 | 0.36-0.44 | ~0.79X |
| `monk_t1` | Monk | 2 | 30 | 23 | 25 | 0 | 4.05 | 5.20 | 1.00 | 1.50-1.90 | ~0.48X raw, premium-priced |
| `archer_t1` | Archer | 4 | 26 | 45 | 13 | 0 | 5.70 | 6.20 | 0.0 | 1.10-1.35 | ~0.49X raw, premium-priced |

Current intended raw/general ladder:

```text
Cavalry > Axeman > Sword > Spear
Archer and Monk are low-raw-power ranged/support units.
```

Current design notes:

- Sword is the baseline.
- Axeman should beat Sword clearly but not become the universal best CP value.
- Cavalry is the strongest and fastest melee, but expensive.
- Spear is weaker than Sword in normal matchups, but must reliably punish
  Cavalry through counter.
- Archer is a ranged Spear-tier support and has a hard/soft-hard role into
  Spear.
- Monk is AoE support. Its raw X-Power is low, but cost is premium because
  telemetry and AoE-hit review showed one Monk attack often affects about
  three units when frontline clusters form.

## Current Counter Rules

Damage formula:

```text
damage = max(1, attacker.damage - defender.defense) * counterMultiplier
```

Active scene/default rules:

| Attacker | Defender | Multiplier | Intent |
| --- | --- | ---: | --- |
| Spear | Cavalry | 20.0 | After Spear stat raise, x20 is the current tested value. User manually verified this feels stable: Spear beats Cavalry, often ending around 30-50% total HP in wave tests. |
| Archer | Spear | 2.0 | Archer punishes Spear while sharing roughly the same raw Power tier. |

Important:

- Earlier high values (`45`, `67.5`, `83`) became too strong after Spear stat
  changes or one-shot-like in practice. Do not restore them casually.
- The user currently considers Spear-vs-Cavalry stats setup acceptable. If
  Cavalry still leaks through in full battles, investigate AI target/spawn
  logic before changing Spear stats again.

## BattleArmyBrain: Current Behavior

Source: `assets/scripts/BattleArmyBrain.ts`.

### Normal AI

- `decisionAccuracy` affects unit choice, not lane choice.
- For current high-skill balance tests, assume `decisionAccuracy = 1` unless
  the user says otherwise.
- In production difficulty, the user expects max AI around 70-80% and will use
  enemy CP to apply pressure by level.
- `enableMaxAliveWaveLimit` / `maxAliveWaves` still gate spawning.
- Spawn timing still uses `minSpawnInterval`, `maxSpawnInterval`, and
  `maxBrainDeltaTime`.

### Single-Wave Matchup Test Mode

Added for controlled pair testing:

- `testSingleWaveBattle`
- `testSingleWaveUnit`

When enabled, the brain skips normal AI and spawns exactly one selected wave at
mid. Use one brain per side to test fixed matchups such as Spear vs Cavalry or
Sword vs Spear.

Reason:

- Full telemetry has too much AI/lane/noise to diagnose isolated stats.
- The user used this and found:
  - melee ladder mostly works;
  - original Spear vs Cavalry counter was too weak after Spear stat changes;
  - Spear vs Cavalry at multiplier `20` currently feels acceptable.

## BattlefieldEvaluator: Current AI Strategy

Source: `assets/scripts/BattlefieldEvaluator.ts`.

### CP Strategy States

Evaluator classifies decisions into:

- `opening`
- `abundant`
- `normal`
- `efficient`
- `desperate`

Design intent from user:

- Abundant: if current CP is ahead and spawning still leaves CP ahead, prefer
  stronger pressure units, with some variety between top melee.
- Normal: common equal-CP state. Prefer response that is one ladder step above
  target where reasonable.
- Efficient: when behind on CP, spend more carefully; use sufficient response
  or finish weakened stronger waves.
- Desperate: if no effective response is affordable, spend whatever can still
  be bought. This may include ranged/Monk. Do not leave 30+ CP idle just
  because a perfect response is impossible.

Latest telemetry after this pass:

- With equal AI, winrate was roughly even in the sampled batch.
- Losing side usually ended with CP below cheapest unit, so the previous
  "stuck with enough CP" issue looked resolved in that sample.
- Cavalry presence improved versus the older "always cheap Spear" behavior.

### Ranged Support Logic

Current design direction:

- Ranged should not aggressive-forward naked into empty lanes.
- Ranged support should spawn when there is actual melee protection.
- Do not rely on old cluster-score style magic thresholds.
- Ranged total should be constrained by friendly melee presence, not a fixed
  unrelated total cap.
- Do not spawn repeated ranged support into the same target/lane blindly.

If ranged behavior looks wrong, inspect current support checks in
`BattlefieldEvaluator` rather than patching stats first.

### Response Reservation Fix

Problem observed:

- AI could spawn multiple Spear waves into one Cavalry target.
- Telemetry showed many `Spear -> Cavalry` responses with low coverage, not
  necessarily repeated target spam every time.
- Diagnosis: after one response wave is spawned, the next snapshot may not yet
  see that wave as coverage because it has not reached/engaged the target. The
  AI can therefore re-see the same target as under-covered and spawn another
  response.

Implemented fix:

- `BattleArmyBrain.spawn()` calls
  `evaluator.recordSpawnReservation(...)` after successful spawn.
- `BattlefieldEvaluator` stores a temporary response reservation:
  - target wave id
  - response wave id
  - response family
  - computed coverage power
  - frame
- `fillEnemyTacticalState()` adds reserved coverage into `coveragePower`.
- Reservation expires when:
  - target wave is dead/invalid;
  - response wave is dead/invalid;
  - response wave has engaged;
  - reservation is older than `180` frames.

Expected visual/AI result:

- If AI just spawned Spear to answer Cavalry, the next few snapshots should
  treat that Cavalry as already being answered.
- This reduces duplicate counter waves while preserving the ability to send
  more help later if the first response dies, engages and fails, or the target
  remains threatening.

This is not a new combat rule. It is a snapshot-accounting fix.

## Telemetry

Telemetry currently records enough data to diagnose:

- winner / end reason;
- CP at end;
- whether loser can still afford anything;
- unit/family spawn counts;
- damage and damage/CP by family/team;
- target/intended unit for spawn decisions;
- accuracy roll / accurate decision / deliberate mistake;
- CP context before/after spawn;
- `cpStrategyState` for spawn decisions;
- Monk AoE hit count metrics.

Current testing method:

- Use single-wave mode for isolated pair/stat verification.
- Use full telemetry batches only after logic/stat changes are source-sound.
- Do not ask the user for endless batches when source inspection can answer the
  question.

## Current Known Balance Conclusions

- Full-battle runtime damage/CP is not a pure unit-balance truth because AI
  behavior changes opportunity and uptime.
- X-Power plus single-wave tests are better for stat grounding.
- Full telemetry is better for diagnosing:
  - AI over-selecting a family;
  - ranged support being over/under-used;
  - CP waste;
  - target duplication;
  - winner conditions ending too early.
- The user currently accepts melee damage/CP being close if cost feels fair and
  ladder/counter meaning remains visible.
- Ranged/support damage/CP being somewhat lower is acceptable if they provide
  visible battlefield utility; too low makes players avoid them, too high makes
  "spawn ranged first" dominant.

## Current Open Issues / Next Work

1. Re-check AI behavior after response reservation.
   - Specifically watch whether repeated Spear into one Cavalry is reduced.
   - If still happening, inspect whether reservations expire because response
     waves engage too early against another target or target ids differ.

2. Watch Cavalry selection.
   - If Cavalry still rarely appears, inspect CP-state scoring and lane/target
     choice before changing stats.
   - Current intent is that normal CP can pick a one-step stronger response,
     including Cavalry into Axeman when affordable and sensible.

3. Watch ranged support.
   - Archer/Monk should appear as support behind melee, not as naked aggressive
     forward lane openers.
   - Monk cost is currently premium (`30`) because AoE often hits about three
     units; if real runtime value is too low/high, adjust after checking hit
     telemetry and support opportunity.

4. Keep `UNITSTATS.md` and `assets/Test.scene` synced.
   - User expects any stat/cost change to be reflected in both.

5. Do not casually revert generated dirty files.
   - Cocos has many dirty files under `library/`, `temp/`, profiles, etc.
   - Stage only intentional files if committing.

## Intentional Files Recently Touched

Core intentional files during the current pass:

- `UNITSTATS.md`
- `AI-CONTEX.md`
- `assets/Test.scene`
- `assets/scripts/BattleArmyBrain.ts`
- `assets/scripts/BattlefieldEvaluator.ts`
- `assets/scripts/BattleTelemetry.ts`
- `assets/scripts/CounterSettings.ts`
- `assets/scripts/GameManager.ts`

Generated/editor files may also be dirty because Cocos Creator was open.
