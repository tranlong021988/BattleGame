# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last updated: 2026-07-27 by home Codex after the BattleArmyBrain accuracy
curve, telemetry batch automation, ranged-support gate rewrite, and latest
frontline/ranged support review.

## Handoff Policy

- Source code and scene data are the source of truth. Use this file as the
  current map, not as a replacement for reading code.
- Update this file only when the user explicitly asks for handoff/update.
- Do not add hidden balance multipliers. Combat multipliers must live in
  `CounterSettings` / scene counter data.
- The user strongly dislikes narrow patch-chasing. For AI/balance work, inspect
  the whole flow before changing one number or branch.
- For project logic questions, inspect the relevant source before answering.
  Do not answer from memory when code can confirm the behavior.
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
- `LevelSettings` still has SmartArmyBrain fields for legacy scene references,
  but current work should target `BattleArmyBrain`.
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
- `decisionAccuracy` is now expected to scale smoothly from bad to smart:
  - `1`: choose the evaluator's best candidate for the selected lane/target.
  - `0`: choose a worse-ranked candidate for that same tactical anchor when a
    non-best candidate exists.
  - middle values: weighted roll between better and worse candidates, not a
    fixed if/else difficulty tier.
- Target and lane selection intentionally stay tactical even at low accuracy.
  Low accuracy should make the unit choice worse, not make the AI ignore the
  battlefield position.
- Current difficulty testing manipulates one team's accuracy through URL query
  params while the other team remains at the scene/level value.
- `enableMaxAliveWaveLimit` / `maxAliveWaves` still gate spawning.
- Spawn timing still uses `minSpawnInterval`, `maxSpawnInterval`, and
  `maxBrainDeltaTime`.
- Unit unlock matters before AI scoring: `GameManager.collectAffordableEntries`
  only returns entries that are valid, unlocked, and affordable. If a level
  locks too many units or CP is below every unlocked cost, the brain can
  correctly wait because it has no affordable entries.

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
- Desperate: if no effective response is affordable, try melee pressure
  fallback first. If that produces no candidate, the fallback can still try
  ranged support, but only through the normal ranged-support gates. Do not
  leave 30+ CP idle just because a perfect response is impossible.
- Last stand is separate from normal `desperate`: when this brain has already
  spawned before and now has zero alive non-hero units, `BattleArmyBrain` calls
  `chooseLastStandSpawnDecision()`. This is the intentional "giay chet" escape
  hatch and may spawn any affordable unit, including Archer/Monk. Do not treat
  last-stand ranged spawns as a normal ranged-support bug unless the user wants
  accuracy 0 to forbid ranged absolutely.

Latest telemetry after this pass:

- With equal AI, winrate was roughly even in the sampled batch.
- Losing side usually ended with CP below cheapest unit, so the previous
  "stuck with enough CP" issue looked resolved in that sample.
- Cavalry presence improved versus the older "always cheap Spear" behavior.

### Accuracy Candidate Selection

Current implementation:

- `chooseCandidateByAccuracy()` first finds the best scored candidate.
- Candidate randomness is limited to the same tactical anchor:
  - same target wave id;
  - same spawn lane.
- If `Math.random() < decisionAccuracy`, the best candidate stays selected.
- Otherwise `chooseNonBestCandidateByAccuracy()` picks a non-best candidate
  with weighted random:
  - low accuracy gives more weight to lower-quality candidates;
  - high accuracy gives more weight to better non-best candidates;
  - accuracy `1` always keeps best;
  - accuracy `0` always tries to avoid best if another same-anchor option
    exists.

Why this matters:

- The user explicitly does not want hard difficulty steps such as "if acc == 0
  then do X, if acc == 0.2 then do Y".
- For telemetry, expect trend/noise, not a perfect straight line every small
  batch. With 5-10 matches per point, noise can still flip a step.
- If low accuracy still looks too smart, inspect candidate sets. A common cause
  is that only one valid same-anchor candidate exists, so even accuracy `0`
  must pick it.

### Ranged Support Logic

Current design direction:

- Ranged should not aggressive-forward naked into empty lanes.
- Ranged support should spawn when there is actual melee protection.
- Do not rely on old cluster-score style magic thresholds.
- Ranged total is no longer constrained by "own ranged < own melee" or by
  whether the opponent already spawned ranged.
- Ranged support is now constrained by frontline power, not a simple count cap.
- Do not spawn repeated ranged support into the same target/lane blindly.

Current implementation details:

- Normal Archer/Monk support goes through
  `isSnapshotRangedSupportAllowed()`.
- It must pass:
  - `isRangedSpawnSafe(target)`: at least one ally frontline, at least one
    engaged ally frontline, and positive `frontlineBlockPower`;
  - per-target/lane anti-spam via `countRangedSupportForTarget(target) <
    maxRangedSupportWavesPerLane`;
  - `hasRangedSupportLaneRoleRoom()`: enough engaged frontline count for that
    ranged family and no immediate repeated same ranged family in that lane;
  - `hasFrontlineSurplusForRangedSupport()`: local target block power and
    global frontline power must both cover enemy frontline threat using
    `coverageTargetRatio`;
  - `passesRangedSupportAccuracyGate(decisionAccuracy)`.
- `passesRangedSupportAccuracyGate()` means:
  - accuracy `0`: normal ranged support cannot pass;
  - accuracy `1`: ranged support is not randomly blocked;
  - middle values: `Math.random() < accuracy`.
- Archer can still be selected as a Spear counter if the same ranged support
  gates pass.
- Monk remains AoE/support. It should appear when protected melee fronts exist,
  not as a naked response to a single isolated target.
- Last stand remains the only intentional path where ranged can spawn without
  the normal support gates.

Removed/changed old behavior:

- Removed the rule that made high-accuracy AI mirror opponent ranged count.
  That rule made ranged too rare and could starve support when the opponent was
  low-accuracy melee-heavy.
- Removed global ranged-vs-melee count budgeting as the main gate. The previous
  cap could create a bad case where high-accuracy AI replaced too many melee
  waves with 3-4 ranged and then lost frontline against 7 enemy melee waves.
- `maxRangedSupportWavesPerLane` remains only as a local anti-spam guard near a
  target/lane. Its tooltip now says frontline power is the main ranged support
  gate.

If ranged behavior looks wrong, inspect current support checks in
`BattlefieldEvaluator` rather than patching stats first.

### Opening Wave

When no enemy wave exists:

- BattleArmyBrain can spawn one opening wave if
  `spawnOpeningWaveIfNoEnemyWave` is true.
- Opening candidates are frontline families only:
  `Spear`, `Sword`, `Axeman`, `Cavalry`.
- Opening score favors the affordable frontline entry closest to average
  frontline raw power. This was added after tests where low accuracy and cheap
  units made openings look too Spear-heavy.
- Accuracy still selects among same-anchor candidates, so low accuracy can
  choose worse opening candidates if more than one exists.

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
- telemetry batch config in `startConfig.telemetryBatch`;
- unit stats and counter rules at match start;
- CP context before/after a spawn and selected-vs-best candidate quality.

Current testing method:

- Use single-wave mode for isolated pair/stat verification.
- Use full telemetry batches only after logic/stat changes are source-sound.
- Do not ask the user for endless batches when source inspection can answer the
  question.

### Telemetry Batch URL Automation

Current query params:

```text
?team=1&currentAcc=0&currentBatch=0&step=0.2&numBatchPerStep=10&end=1
```

Meaning:

- `team`: team whose `BattleArmyBrain.decisionAccuracy` is overridden.
- `currentAcc`: current accuracy for that team.
- `currentBatch`: zero-based match index inside the current accuracy step.
- `step`: amount added to `currentAcc` after each full batch.
- `numBatchPerStep`: number of telemetry reports per accuracy value.
- `end`: final accuracy value.

Runtime behavior:

- On `BattleArmyBrain.start()`, the brain matching `team` reads `currentAcc`
  from `window.location.search` and overrides `decisionAccuracy`.
- On match end, `GameManager` downloads the telemetry JSON, waits
  `battleTelemetryReloadDelaySeconds`, then reloads.
- If batch query params are active, reload uses the next URL:
  - `currentBatch += 1` until it reaches `numBatchPerStep`;
  - then `currentAcc += step` and `currentBatch = 0`;
  - stops when `currentAcc >= end` and the final batch is complete.
- URL normalization handles the earlier bad `?%3Fteam=...` / `?team` case by
  accepting and cleaning keys with an accidental leading `?`.
- Reports are downloaded per match. There is no localStorage report queue.

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
- Latest large-batch accuracy tests were considered "quite okay" by the user:
  as enemy accuracy rises, intelligence and win impact trend upward enough for
  level design. Small irregularities are acceptable because the user plans
  manual progression guards such as unlocking only basic enemy units early.

## Current Open Issues / Next Work

1. Re-check ranged/frontline behavior after the latest support gate rewrite.
   - Desired: high-accuracy AI should not spend too many slots on ranged when
     enemy melee count/frontline threat is much higher.
   - Desired: ranged should appear once ally frontline is already strong enough
     locally and globally.
   - If accuracy `0` appears to spawn ranged, first identify whether it came
     from normal support or from `snapshot-last-stand-fallback`. Last stand is
     the current intentional exception.

2. Watch Cavalry selection.
   - If Cavalry still rarely appears, inspect CP-state scoring and lane/target
     choice before changing stats.
   - Current intent is that normal CP can pick a one-step stronger response,
     including Cavalry into Axeman when affordable and sensible.

3. If adding tier 2 / tier 3:
   - AI already scores actual affordable entries, so tiers can work if each
     tier has sane `family`, `tier`, `cost`, `unitCount`, stats, prefab, and
     `unlocked`.
   - Higher CP should naturally make stronger/higher-tier entries candidates,
     but "cheapest sufficient response" and accuracy can still pick lower tier
     to finish weakened enemies.
   - Counter rules currently use `UnitFamily`, not tier. If tier-specific
     counters are needed later, `CounterSettings` must change intentionally.

4. Keep `UNITSTATS.md` and `assets/Test.scene` synced.
   - User expects any stat/cost change to be reflected in both.

5. Do not casually revert generated dirty files.
   - Cocos has many dirty files under `library/`, `temp/`, profiles, etc.
   - Stage only intentional files if committing.

6. Do not update this handoff unless the user asks.
   - The user explicitly requested this rule after repeated handoff updates.

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
