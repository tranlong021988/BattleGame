# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last updated: 2026-07-29 after the evaluator counter/X-Power correction,
Spear-to-Cavalry counter reduction from `20` to `12`, two 100-match symmetric
accuracy-1 telemetry baselines, and the telemetry-only elimination winner rule.

## Handoff Policy

- Read source and scene data before acting. This file is a map, not a
  substitute for code inspection.
- Update this file only when the user explicitly asks.
- Do not add hidden combat multipliers. Combat multipliers belong in
  `CounterSettings` and the scene rules.
- The user wants system-level diagnosis. Do not hide a logic problem behind a
  new threshold or a narrow numerical patch.
- Reuse current wave/snapshot state before adding scans, throttles, or duplicate
  bookkeeping.
- For balance changes, inspect stats, unit count, cost, counters, AI scoring,
  lane state, frontline coverage, and telemetry together.
- Do not ask for another telemetry batch when the source already proves the
  cause.
- For this project, inspect the relevant source before answering questions
  about current gameplay logic. Do not answer from memory when the user asks
  how the AI currently behaves.

## Source Of Truth

Read these first:

- `assets/Test.scene`: active Inspector values for both teams, AI, counters,
  telemetry, and level settings.
- `UNITSTATS.md`: active tier-1 numeric balance table and X-Power formula.
- `assets/scripts/BattleArmyBrain.ts`: spawn timing, accuracy, single-wave test
  mode, and actual spawn execution.
- `assets/scripts/BattlefieldEvaluator.ts`: battlefield snapshot, CP strategy,
  target/lane/unit scoring, ranged-support gates, and response reservations.
- `assets/scripts/CounterSettings.ts`: runtime counter damage.
- `assets/scripts/BattleTelemetry.ts`: report schema and aggregation.
- `assets/scripts/GameManager.ts`: battle end, report export/reload, CP, wave
  ownership, final Hero deployment, forward/aggressive state transitions, and
  telemetry URL automation. It also supplies the active battlefield bounds and
  worker switches to the target-search/RVO systems.
- `assets/scripts/BattleSpatialGrid.ts`: main-thread SpatialGrid, target-query
  worker source, worker snapshot/reply validation, and nearest-target search.
- `assets/scripts/rvo/RVOWorkerSimulator.ts`: RVO worker startup, restart,
  transferable-buffer lifecycle, runtime error fallback, and embedded worker
  source.
- `assets/scripts/BattleWave.ts`: wave-level forward, aggressive, combat, and
  Freehunt state.
- `assets/scripts/Unit.ts` and `assets/scripts/UnitBehavior.ts`: target search,
  Hero-phase range multiplier, combat resolution, damage, and death flow.

The active AI is `BattleArmyBrain` plus `BattlefieldEvaluator`. Old
`ArmyBrain`/`SmartArmyBrain` logic is legacy unless a scene explicitly enables
it.

## Active Test Configuration

- Tier 1 only: Axeman, Cavalry, Sword, Spear, Monk, Archer.
- Skirmisher is inactive.
- Both teams currently have identical database stats.
- Both `BattleArmyBrain` components in `assets/Test.scene` currently use:
  - `decisionAccuracy = 1`
  - `maxAliveWaves = 7`
  - `minSpawnInterval = 1.666667`
  - `maxSpawnInterval = 3.333333`
  - `coverageTargetRatio = 1.05`
  - `maxRangedSupportWavesPerLane = 3`
  - `maxConsecutiveMeleeWavesPerLane = 2`
- `GameManager` currently has telemetry enabled in the test scene. Telemetry is
  test-only and should be disabled for the real game build.
- `battleTimeScale = 3` in the current serialized test scene. The latest
  two 100-report baselines were produced under this accelerated test
  configuration.
- Both Hero nodes are serialized as active in `assets/Test.scene`, but
  `GameManager.registerDatabaseHeroes()` immediately stores their entries and
  deactivates the nodes at runtime. Do not infer "Hero starts in battle" from
  the scene `_active` value alone.
- `heroBattleTargetSearchRangeMultiplier = 2`.
- `useWorkerRVO = true`.
- `useWorkerSpatialTargetQuery = true`.
- `spatialGridCellSize = 4`; active battlefield bounds supplied by
  `GameManager` are X `-10..10`, Z `-18..18`. Team spawn Z values are
  `-15` and `15`.

## X-Power And Cost

This point was repeatedly misunderstood and is now explicit:

```text
EffectiveHP = Health * (1 + Defense * 0.045)
RawUnitPower = sqrt(Damage * EffectiveHP)
Cost = round(RawUnitPower)
```

- X-Power and nominal cost are calculated for one unit.
- Never multiply by `UnitCount`.
- `UnitCount` is an independent battlefield-balance control.
- Sword is the 1.00X base at about `49.50` raw unit power.
- Speed, range, attack interval, AoE, and wave-slot opportunity are not part of
  the cost formula. They are evaluated through controlled tests and telemetry.
- Current exception: Archer has raw unit power `24.19`, so nominal rounded cost
  is `24`, but the tested scene still uses `26`. The latest telemetry is
  evidence for cost `26`. Do not silently claim that Archer exactly follows the
  formula; explicitly choose whether to keep the tested premium or align it
  before the next numeric balance lock.

## Active Unit Stats

These values match both Team A and Team B in `assets/Test.scene`.

| Unit | Count | Cost | HP | Damage | Defense | Speed | Range | Radius | Interval | Raw Power | X |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| Axeman | 10 | 74 | 110 | 46 | 2 | 4.65 | 0.35 | 0 | 0.36-0.44 | 74.27 | 1.50X |
| Cavalry | 10 | 97 | 160 | 45 | 7 | 9.75 | 0.35 | 0 | 0.36-0.44 | 97.30 | 1.97X |
| Sword | 10 | 49 | 100 | 20 | 5 | 5.10 | 0.35 | 0 | 0.36-0.44 | 49.50 | 1.00X |
| Spear | 10 | 39 | 95 | 14 | 3 | 4.50 | 0.35 | 0 | 0.36-0.44 | 38.85 | 0.78X |
| Monk | 1 | 49 | 35 | 70 | 0 | 4.50 | 5.80 | 1.00 | 2.10-2.60 | 49.50 | 1.00X |
| Archer | 5 | 26 | 45 | 13 | 0 | 5.70 | 6.20 | 0 | 1.10-1.35 | 24.19 | 0.49X |

Natural melee ladder:

```text
Cavalry > Axeman > Sword > Spear
```

Current role conclusions:

- Spear is intentionally weak outside its Cavalry counter.
- Monk is a fragile single-unit AoE support that costs one whole wave slot.
- Archer was raised from 4 to 5 units because the 4-unit wave was not worth its
  slot/cost often enough.

## Active Counter Rules

Runtime damage:

```text
max(1, attacker.damage - defender.defense) * counterMultiplier
```

Active scene/default rules:

| Attacker | Defender | Multiplier |
| --- | --- | ---: |
| Spear | Cavalry | 12.0 |
| Archer | Spear | 2.0 |

Controlled single-wave testing established:

- `x12`: Spear still beats Cavalry and retains meaningful losses.
- `x10`: Spear usually loses to Cavalry and no longer satisfies the hard-counter
  requirement.

Therefore `x12` is the current lower viable bound and should remain active.
The scene rule and `CounterSettings.createDefaultRules()` both use `12`; do not
let reset/default creation silently restore `20`.

## BattleArmyBrain

### Main Spawn Flow

- The brain waits for its interval and alive-wave limit.
- It obtains affordable, unlocked entries from `GameManager`.
- It asks `BattlefieldEvaluator` for a snapshot decision.
- It applies `decisionAccuracy` to candidate selection.
- After a successful spawn, it records a response reservation in the evaluator
  so the same enemy is not immediately treated as unanswered again.

### Decision Accuracy

- Current scene test value is `1` for both teams.
- Accuracy affects unit selection inside the evaluator's tactical anchor;
  target and lane choice remain tactical.
- If suitable mistake candidates exist, one random roll keeps the best
  candidate with probability equal to accuracy. For example, `0.8` keeps the
  best candidate about 80% of the time.
- When the roll does not keep the best candidate, the evaluator chooses a
  lower-ranked same-anchor candidate with weights derived from candidate rank
  and accuracy. `1` therefore always keeps the best candidate.
- A deliberate mistake must be a different family from the best answer, must
  share the same target/lane anchor, and must not itself be an accurate hard
  counter response.
- If `accuracy <= 0` and the only candidate is an accurate hard-counter style
  response, the evaluator returns no decision instead of accidentally taking
  the correct answer. This prevents the lowest-accuracy AI from winning by
  forced correctness.
- Candidate choice is probabilistically smooth, but ranged capacity is not
  perfectly continuous. It uses:

  ```text
  accuracy <= 0 -> 0
  otherwise -> max(1, ceil(maxRangedSupportWavesPerLane * accuracy))
  ```

  With the current Inspector maximum `3`, the actual caps are:

  | Accuracy | Ranged cap |
  | ---: | ---: |
  | 0.0 | 0 |
  | 0.2 | 1 |
  | 0.4 | 2 |
  | 0.6 | 2 |
  | 0.8 | 3 |
  | 1.0 | 3 |

  This staircase is a real behavioral threshold. It explains one important
  similarity between `0.8` and `1.0`, but does not make their candidate
  decisions identical.
- Last stand is the deliberate exception: when a team has no non-hero units
  left but can still afford something, it may spawn any affordable unlocked
  unit, including ranged. Do not confuse this with normal ranged-support logic.
- Small samples can be noisy. Judge the progression by damage, decision
  quality, mistake rate, ranged share, and repeated batches, not only binary
  winrate.

### Opening And Last Stand

- With no enemy wave and `spawnOpeningWaveIfNoEnemyWave = true`, the brain may
  spawn an opening frontline wave.
- Opening frontline families are Spear, Sword, Axeman, and Cavalry.
- Opening currently targets the affordable frontline whose wave power is
  closest to the average affordable one-unit X-Power. `UnitCount` is not used
  for this opening comparison.
- Opening choice is deterministic after tie-breaking and bypasses
  `decisionAccuracy`; it is meant to remove opening-family luck from balance
  tests. With the current roster it selects Axeman.
- When telemetry batch query parameters are present, both brains:
  - set their first think interval to zero;
  - force the opening branch even if the other opening already exists;
  - use the middle lane.

  This synchronizes both teams to the same Axeman-mid opening. Outside telemetry
  batch mode, the normal randomized brain interval and normal pressure-lane
  selection still apply.
- `enableBattleTelemetry = true` by itself does not activate synchronized
  opening. The URL batch parameters must be present. The latest two symmetric
  100-match baselines had telemetry enabled but `telemetryBatch.active = false`,
  so one side opened first and the other side observed/responded normally.
- Last stand is separate from normal snapshot support. If the team has spawned
  before, has no living non-hero wave, and can still afford something,
  `chooseLastStandSpawnDecision()` may buy any affordable unit. This can include
  Archer or Monk without the normal support context. That is intentional.

### Single-Wave Test Mode

Inspector fields:

- `testSingleWaveBattle`
- `testSingleWaveUnit`

When enabled, each brain spawns exactly one selected wave at mid and skips the
normal AI. Use this for controlled pair tests. Full telemetry is not a clean
substitute for isolated stat/counter validation.

## Forward, Aggressive, And Freehunt

### Normal Forward

- A normal-forward wave periodically refreshes its forward scanner.
- It may release from forward into target pursuit after passing a valid enemy
  in the same or adjacent lane.
- Reaching the enemy Hero line can also resolve to the enemy Hero when that Hero
  exists.
- Returning to lane preserves whether the wave was aggressive; it no longer
  silently converts an aggressive wave into normal forward.

### Aggressive Forward

Aggressive no longer uses the Hero line as its normal release boundary.

Current runtime flow:

1. Use the wave's frontmost living forward unit as scanner.
2. Find the deepest living enemy-wave scanner in either adjacent lane.
3. Once an adjacent boundary is observed, remember that fact.
4. Continue forward until the aggressive scanner passes that boundary.
5. Before release, require that no enemy remains ahead in the aggressive
   wave's own lane.
6. Release the wave into normal Freehunt target acquisition.

Important edge cases:

- If the observed adjacent boundary dies/disappears, the wave may still release
  after its own lane becomes clear.
- An aggressive opening that never observes an adjacent enemy boundary remains
  aggressive. That is current source behavior, not yet a proven desired
  terminal rule.
- If an aggressive wave enters combat directly, `BattleWave.enterCombatMode()`
  ends aggressive-forward state without emitting an aggressive terminal
  telemetry event.
- If it dies before release, there is likewise no one-shot aggressive terminal
  event yet.

Current one-shot telemetry events:

- `aggressive-boundary-observed`
- `aggressive-own-lane-blocked`
- `aggressive-freehunt-release`

Do not infer that every observed wave without a release event is stuck. Combat
entry and death are currently unclassified outcomes. If aggressive behavior is
audited again, first add terminal events such as
`aggressive-combat-entered` and `aggressive-died-before-release`, then require
exactly one terminal outcome per aggressive spawn.

## Final Hero Deployment

### Activation

- Heroes are scene-backed entries, but are inactive and absent from simulation,
  team arrays, waves, and telemetry at battle start.
- A team activates its Hero exactly once when it can no longer afford any valid
  unlocked melee entry. Archer and Monk do not postpone Hero deployment.
- Activation does not wait for the team's existing normal waves to die.
- The Hero is placed on the middle-lane X while retaining its scene Z, is
  registered as a normal forward wave, and starts moving immediately.
- Hero is a physical ally blocker again:
  `canBePassedThroughByForwardAlly = false`.
- The old behavior that forced all enemy waves back into forward mode on Hero
  activation was removed.

### End And Respawn Safety

- Normal gameplay with telemetry disabled ends immediately on Hero death with
  reason `hero-killed`.
- Telemetry tests deliberately do not end on Hero death. They continue until a
  team has no living troops, including Hero, and cannot afford any valid
  unlocked spawn. Their end reason is
  `team-eliminated-and-cannot-afford-spawn`.
- Hero deployment is latched. `handleHeroDeath()` keeps the team unlock flag
  true, so a dead Hero cannot refill and respawn on the next low-CP check.
- Winner resolution is deferred while one attack batch is being resolved. This
  matters for AoE: the game must not finalize a fallback winner halfway through
  one damage batch while other victims/deaths are still being processed.
- The no-affordable-spawn fallback counts a living Hero as a combatant. This
  prevents false elimination on the exact frame the Hero is activated.

### Hero-Phase Search Range

- The first Hero activation enables a global battle phase for both teams.
- Every currently living unit receives
  `heroBattleTargetSearchRangeMultiplier`, currently `2`.
- Units spawned later and the second Hero receive the same multiplier.
- `Unit.applyTargetSearchRangeMultiplier()` applies a ratio against the
  previously applied multiplier, so pooled units cannot accumulate
  `x2 -> x4 -> x8`.
- Applying the multiplier invalidates nearest-target results and cached
  targets.
- `hero-activated` telemetry records the activation CP and configured
  multiplier. It does not log every individual unit's resulting numeric search
  range; source inspection is the proof for per-unit application.

## BattlefieldEvaluator

### Snapshot Data

The evaluator builds reusable per-wave/per-lane intelligence including:

- family, alive count/ratio, health ratio, base power;
- lane, center position, progress toward the defending hero line;
- engaged/busy state;
- ally coverage power and response reservations;
- ally frontline count, engaged frontline count, frontline hold power, and
  frontline health;
- enemy blockers and same-lane traffic;
- local and global frontline threat.

This snapshot should be extended/reused instead of creating duplicate scans.

### CP Strategy States

The evaluator classifies CP context as:

- `opening`
- `abundant`
- `normal`
- `efficient`
- `desperate`

Intent:

- Abundant: use the CP lead for stronger pressure while retaining some
  frontline variety.
- Normal: choose a sensible stronger/sufficient response for the current
  battlefield.
- Efficient: when behind on CP, avoid waste and use sufficient responses or
  finish weakened threats.
- Desperate: if no effective response is affordable, use an affordable
  fallback instead of leaving spendable CP idle.

Do not collapse these back into one permanent "cheapest sufficient" mode; that
previously starved expensive families such as Cavalry.

### Melee Response And Reservation

After a response wave spawns, `recordSpawnReservation()` stores:

- target wave id;
- response wave id/family;
- expected coverage power;
- spawn frame.

The reservation contributes to target coverage until the target/response dies,
the response engages, or 180 frames pass. This prevents multiple Spear waves
from being spawned against one Cavalry before the first response has had time
to reach it.

### Ranged Support Gates

Normal Archer/Monk candidates must:

- have at least one allied frontline in the target lane;
- have at least one engaged allied frontline;
- have positive frontline hold power;
- pass local anti-spam (`maxRangedSupportWavesPerLane`);
- not repeat the same ranged family immediately in that lane;
- have enough local and global frontline advantage;
- pass the accuracy gate.

There is no old `clusterScore` gate. Do not restore it.

Current role behavior:

- Archer gets strong value as a full-strength hard counter into Spear.
- Monk gets stronger value when an engaged, protected lane contains melee
  contact where AoE can matter. The map is small, so do not add expensive
  whole-map melee cluster scans just to prove that melee blobs exist.
- Both may support an already engaged frontline, but melee should remain
  preferred when the frontline is losing.
- Last stand is the deliberate exception to normal ranged-support safety.

### Current Ranged Scoring Status

`assets/scripts/BattlefieldEvaluator.ts` no longer uses fixed ranged priorities
such as `1000000/900000/800000`.

The current score combines:

- tactical target priority;
- hard-counter or AoE role value;
- frontline need/surplus;
- expected DPS per CP;
- expected Monk targets hit;
- CP-strategy-dependent cost pressure.

Important implementation details:

- Ranged can now receive a support target priority even when the melee response
  priority for that target is zero.
- Monk requires one engaged frontline rather than two.
- Monk gets extra role value when multiple enemy waves are blocked in an
  engaged lane.
- The fixed giant family priorities were removed so future tiers can compete
  through actual stats, cost, role, and context.
- The previous "only spawn ranged if the opponent already spawned ranged" rule
  was removed. It suppressed Archer/Monk too hard and made max-accuracy AI lose
  melee count without enough support payoff.
- Ranged support is now constrained by safety and usefulness rather than by
  mirroring opponent composition.

The 2026-07-27 accuracy sweep showed this rewrite behaving acceptably: ranged
share rises with accuracy, Monk appears at high accuracy, and normal ranged
spawns are blocked unless a real frontline exists. Keep watching for normal
ranged spawns into unprotected melee; if found, inspect `isRangedSpawnSafe()`
and `chooseLastStandSpawnDecision()` before changing stats.

### Lane Pressure And Overstacking

- Direct melee response can be blocked by `maxConsecutiveMeleeWavesPerLane`.
- That block is bypassed only for rescue/high-danger cases:
  `target.hasStrugglingAlly` or `target.dangerousToDefend`.
- This prevents the AI from tunneling forever into one lane, while still
  allowing emergency reinforcement when the lane is actually collapsing.
- Ranged keeps a stricter lane rule: if `isRangedSpawnSafe(target)` is false,
  it gets no direct normal spawn lane.

### Unit Unlocks

Current source support for locked units is broad and safe:

- `UnitPrefabEntry.unlocked` exists in `BattleUnitDatabase`.
- `BattleUnitDatabase.isEntryUnlocked()` returns that flag.
- `GameManager.isValidSpawnEntry()` rejects locked entries.
- `GameManager.collectAffordableEntries()` only returns entries that are valid,
  unlocked, positive-count, and affordable.
- `spawnWaveByEntry()` and `spawnEntryFormation()` also check
  `isValidSpawnEntry()`, so locked entries are blocked even if a caller tries to
  spawn them directly.
- `canAffordAnySpawnEntry()` uses the same valid-entry filter, so battle-end
  detection respects locks.

Design implication:

- Locking a unit will not crash the AI by itself; the evaluator simply never
  sees that entry.
- Early levels must leave at least one affordable melee/frontline family
  unlocked. Opening pressure only considers Spear, Sword, Axeman, and Cavalry.
  If all melee are locked and no enemy exists yet, the AI can have no valid
  opening candidate and wait.
- Archer/Monk are support, not reliable openers. Normal ranged support needs
  allied frontline contact. Last stand can still spawn them as the deliberate
  "giay chet" exception.
- If a hard counter is locked, the AI falls back to the best unlocked economic
  response. That is valid for level progression, but the level designer must
  understand that tactical quality is capped by the unlocked roster.

### Future Tier 2/3 Readiness

The current evaluator is mostly tier-ready because entries compete through
actual stats/cost/power and unlocked/affordable filtering, not through a fixed
tier table.

Expected behavior if tier 2/3 are added correctly:

- High CP and abundant strategy should prefer stronger expensive entries when
  they are tactically safe and not walking into a hard counter.
- When CP drops or the target is already weakened, cheaper sufficient lower-tier
  entries can still be selected.
- Locked tier entries are invisible to the evaluator.

Risks to verify when adding tiers:

- Family-specific rules still exist for Cavalry, Spear, Archer, Monk, and melee
  ladder rank. New families need explicit role classification.
- Opening uses average frontline power among affordable frontline entries. If
  tier 3 is unlocked from the start with huge CP, opening may prefer a mid/high
  tier frontline instead of tier 1.
- Cost must still follow the one-unit X-Power rule unless the user explicitly
  marks an exception.

## Telemetry

Telemetry records:

- winner, end reason, duration, and final CP;
- whether each side can still afford a spawn;
- alive waves/units and remaining HP;
- family/team spawn counts and CP spent;
- damage, kills, damage/CP, and counter contribution;
- spawn reason, intended target, selected/best candidate, accuracy roll, and CP
  strategy;
- Monk AoE targets hit per attack;
- Hero activation CP and Hero-phase target-search multiplier;
- aggressive boundary/block/release diagnostics;
- start stats, counter rules, and batch configuration.

Current automated telemetry tests end only through
`team-eliminated-and-cannot-afford-spawn`: a team must have no living troops,
including Hero, and must be unable to afford any valid unlocked spawn. Hero
death is recorded but does not finalize/download/reload the telemetry match.
With telemetry disabled, normal gameplay still ends immediately on Hero death.

### Batch URL

```text
?team=1&currentAcc=0&currentBatch=0&step=0.2&numBatchPerStep=10&end=1
```

- `team`: brain whose accuracy is overridden.
- `currentAcc`: accuracy for the current batch.
- `currentBatch`: zero-based match index.
- `step`: accuracy increment after a full batch.
- `numBatchPerStep`: matches per accuracy value.
- `end`: final accuracy.

After report download, `GameManager` waits
`battleTelemetryReloadDelaySeconds`, advances the query state, and reloads the
page. If telemetry fails to download/reload, inspect the winner condition and
browser download permission before changing battle logic.

When any telemetry batch query parameter is present, synchronized opening is
also enabled for both brains even though only the selected `team` receives the
accuracy override.

## Latest Telemetry Evidence

### Evaluator Counter-Power Correction

Problem and cause:

- Runtime counter damage is a direct multiplier, but raw X-Power is the
  geometric mean of offense and durability.
- `BattlefieldEvaluator` previously inserted the full counter multiplier into
  wave-power comparison. Spear `x20` was therefore valued as `20X` matchup
  power instead of `sqrt(20) ~= 4.47X`.
- That distortion affected candidate coverage, existing ally coverage, and
  full matchup ratios. It made response coverage inconsistent and was strongly
  associated with opening-side advantage and poor early response chains.

Implementation:

- `getMatchupFactor()` and the target-side equivalent were renamed to make their
  power-domain purpose explicit.
- `getCounterPowerFactor()` now converts a runtime damage multiplier `m` to
  `sqrt(m)` for evaluator X-Power calculations.
- The conversion is used consistently for candidate power, target power, ally
  coverage, and matchup ratios.
- Runtime combat damage is unchanged and still uses the direct CounterSettings
  multiplier.

### 100-Match Baseline With Runtime Counter x20

Files: 100 reports from `2026-07-29T09-33-19-906Z` through
`2026-07-29T10-37-43-745Z`.

Configuration:

- both teams `decisionAccuracy = 1`;
- `Spear > Cavalry = 20`;
- telemetry batch URL inactive, so opening remained sequential;
- identical stats and CP for both teams.

Results:

- Team A/B wins: `52/48`.
- Opening side wins: `50/100`, down from the pre-fix `80.7%`.
- Opening-side and responder economics were nearly identical:

| Position | CP/match | Damage/match | Damage/CP | Waves/match |
| --- | ---: | ---: | ---: | ---: |
| Opening side | 786.79 | 11780.21 | 14.97 | 13.39 |
| Responder | 788.51 | 11723.24 | 14.87 | 13.58 |

- The common opening response chain became coherent:
  `Axeman -> Cavalry -> Spear`, followed by the normal ladder/support flow.
- Top target-to-response decisions:
  - Cavalry -> Spear: `465`;
  - Axeman -> Cavalry: `459`;
  - Spear -> Sword: `332`;
  - Sword -> Axeman: `293`;
  - Spear -> Archer: `234`.
- Sword was not under-responding to Spear:
  - Sword -> Spear: `127778` damage, `1503` kills;
  - Spear -> Sword: `67599` damage, `452` kills.

The evaluator correction achieved its goal. Do not restore the direct
counter multiplier in X-Power scoring.

### Active 100-Match Baseline With Runtime Counter x12

Files: 100 reports from `2026-07-29T10-51-57-128Z` through
`2026-07-29T11-46-41-748Z`.

Every report confirms:

- both teams `decisionAccuracy = 1`;
- `Spear > Cavalry = 12`;
- `Archer > Spear = 2`;
- telemetry batch URL inactive;
- end reason `team-eliminated-and-cannot-afford-spawn`.

System results:

| Metric | Result |
| --- | ---: |
| Team A/B wins | 58/42 |
| Opening/responder wins | 44/56 |
| Average duration | 57.25s |
| Average loser final CP | 11.51 |
| Maximum loser final CP | 25 |
| Invalid endings | 0 |

Team A and B output was effectively identical despite the `58/42` binary
sample:

| Team | CP/match | Damage/match | Damage/CP | Waves/match |
| --- | ---: | ---: | ---: | ---: |
| A | 787.72 | 11980.61 | 15.21 | 13.34 |
| B | 787.86 | 11969.28 | 15.19 | 13.53 |

Frame-order evidence was also balanced:

- Team A first-damage frame share: `50.54%`.
- Team A first-kill frame share: `50.43%`.

Treat `58/42` as sampling variation unless a larger repeated baseline shows the
same team-direction bias. It is not explained by CP, damage efficiency,
composition, opening side, or frame-order evidence in this batch.

Active roster output:

| Family | Waves | Wave share | Damage/CP |
| --- | ---: | ---: | ---: |
| Axeman | 644 | 23.97% | 14.78 |
| Spear | 566 | 21.06% | 23.05 |
| Cavalry | 471 | 17.53% | 13.12 |
| Sword | 420 | 15.63% | 14.01 |
| Archer | 311 | 11.57% | 15.34 |
| Monk | 275 | 10.23% | 12.63 |

Counter evidence:

| Direction | Damage | Kills |
| --- | ---: | ---: |
| Spear -> Cavalry | 344685 | 2902 |
| Cavalry -> Spear | 131060 | 954 |
| Sword -> Spear | 144758 | 1741 |
| Spear -> Sword | 74249 | 459 |

Comparison with the corrected-evaluator `x20` baseline:

- Spear damage/CP: `24.05 -> 23.05` (`-4.2%`).
- Spear counter damage: `360800 -> 344685` (`-4.5%`).
- Spear hard-counter decisions: `465 -> 497`.
- Spear kills per hard-counter response: `6.32 -> 5.84`.
- Cavalry damage/CP: `12.33 -> 13.12`.

The reduction is smaller than linear `12/20` because `x20` contained substantial
overkill. Telemetry records actual HP removed, not discarded overkill, and
`x12` still kills Cavalry reliably. Increased Cavalry-to-Spear encounters also
offset some of the per-hit reduction.

Current conclusion:

- `x12` is the correct active value: it preserves the controlled hard-counter,
  improves Cavalry runtime value, and reduces Spear excess without breaking the
  pair.
- Do not reduce to `x10`; controlled tests show Spear usually loses.
- Spear's `23.05` damage/CP remains contextual to perfect accuracy and frequent
  Cavalry encounters. Do not increase Spear cost or change base stats from this
  batch alone; doing so would violate the one-unit X-Power cost rule or damage
  its intentionally weak non-counter role.
- A future accuracy-`0.8` gameplay-oriented batch may be used to measure how
  much Spear efficiency falls when the AI does not exploit every counter
  opportunity, but it is not required to validate `x12`.

## Latest Performance Work

This section records the 2026-07-28/29 SpatialGrid and RVO work. These changes
are performance/lifecycle changes only. They do not intentionally change unit
stats, counter rules, search radii, search intervals, lane behavior, RVO
physics, or Inspector tuning.

### SpatialGrid Nearest-Target Optimization

Changed files:

- `assets/scripts/BattleSpatialGrid.ts`
- `assets/scripts/GameManager.ts`

The old nearest-target search expanded grid rings across every cell covered by
the query radius. That remains efficient for small local searches, but large
Hero/search radii on this small battlefield can cover more cells than there
are enemy units. In those cases, walking empty cells costs more than scanning
the active enemy snapshot directly.

The current implementation:

- receives the real battlefield bounds from `GameManager` at startup and on
  every grid rebuild;
- clamps every query to the bounded battlefield cell rectangle;
- uses lookup-only `findExistingKey()` for queries, so checking an empty cell
  does not create/cache a new string key;
- stores each team's active unit list from the same `build()` generation as the
  grid;
- compares bounded queried-cell count with active enemy count;
- uses bounded ring search when cells are cheaper;
- uses a direct active-enemy snapshot scan when units are cheaper;
- preserves exact nearest-by-distance behavior;
- applies the same hybrid algorithm in the target worker;
- sends battlefield bounds with every worker batch;
- reuses the worker snapshot when a request batch does not include a newer
  snapshot;
- preserves `lifeId` in worker replies so pooled/stale targets remain guarded.

Important invariant: the direct path scans the unit list produced during the
same `BattleSpatialGrid.build()` call. It does not inspect a newer live team
array, so ring search and direct search operate on the same snapshot.

Focused verification completed:

- Cocos Creator 3.8.8 TypeScript `--noEmit --skipLibCheck --module esnext`:
  pass.
- Embedded target-worker source syntax: pass.
- 500 randomized worker nearest-target queries compared with brute-force exact
  nearest: pass.
- Worker snapshot-reuse test: pass.

Subsystem-only Node microbenchmarks against the pre-change implementation:

| Scenario | Measured improvement |
| --- | ---: |
| Dense, 120 units, range 16 | about 13.9% |
| Hero-like, 60 units, range 32 | about 72.8% |
| Late Hero, 20 units, range 80 | about 94.2% |

These numbers measure only the nearest-query subsystem. They are not expected
whole-game FPS gains.

### RVO Worker False-Fallback Root Cause

Changed file:

- `assets/scripts/rvo/RVOWorkerSimulator.ts`

The old lifecycle used the same two-second wall-clock timeout for two different
conditions:

1. a newly created worker had not emitted `ready`;
2. a ready worker had an in-flight step that had not replied.

Both conditions permanently called `activateMainThreadFallback()`. Under
DevTools CPU slowdown, worker startup could exceed two wall-clock seconds even
though Worker/Blob support was valid. The result was a false permanent
fallback, and all RVO neighbor/grid/avoidance work moved onto the main thread.
This is why `useWorkerRVO = true` did not guarantee that the trace contained an
RVO worker.

The current lifecycle is:

- a worker that exists but is not ready is allowed to keep starting; this state
  does not trigger main-thread fallback;
- if a ready worker's pending step exceeds two seconds, the worker is
  terminated and restarted instead of permanently falling back;
- restart clears pending state and detached typed-array references, resets
  capacity, and marks obstacles dirty so the replacement receives obstacles
  before its next simulation step;
- every worker instance has a generation number and identity check;
- late `message`, `error`, or `messageerror` callbacks from a terminated worker
  cannot mutate the replacement worker's state;
- main-thread fallback is reserved for actual capability/runtime failures:
  unsupported Worker/Blob/object-URL APIs, construction failure, `postMessage`
  failure, worker `error`, or `messageerror`.

RVO solver math, neighbor rules, hard separation, agent data layout, update
intervals, and scene Inspector values were not changed.

Focused lifecycle tests passed for:

- slow startup does not fall back;
- pending timeout restarts the worker;
- stale callbacks from the old generation are ignored;
- replacement worker receives obstacles before the next step;
- unsupported APIs fall back;
- constructor failure falls back;
- runtime worker error falls back.

One deliberate residual edge case must remain visible: if a browser
successfully constructs a worker that silently never emits `ready` and never
raises an error, RVO waits rather than activating the main-thread solver. This
path was not observed in the traces. Do not reintroduce a permanent
startup-delay fallback without separating "slow startup" from proven worker
failure, or the 4x-throttle regression will return.

### Performance Trace Evidence

`Trace-20260728T223748.json.gz`:

- Cocos preview, iPhone SE emulation, no 4x CPU slowdown.
- Exact current preview target-worker chunk was loaded.
- Both target worker and RVO worker existed.
- Target worker: 756 batches over 38.38 seconds, about 19.7 batches/second;
  p95 message handling about 0.344 ms; maximum gameplay batch about 1.651 ms;
  worker about 99.61% idle.
- Main frame callback after startup: p50 about 1.608 ms, p95 4.146 ms, p99
  about 5.24 ms.
- CPU profile sampled both new target-query paths:
  `findExistingKey()` on main and `scanSnapshotForNearest()`/`scanCell()` in
  the worker.

`Trace-20260728T224846.json.gz`:

- Cocos preview, iPhone SE emulation, DevTools CPU slowdown 4x.
- Captured before the RVO lifecycle repair.
- Only the target worker existed; RVO was executing on the main-thread
  fallback despite `useWorkerRVO = true`.
- Target worker: 904 batches over 52.63 seconds; average about 0.169 ms, p95
  0.346 ms, p99 0.425 ms, max 0.845 ms.
- Steady main frame callback: average 7.39 ms, p50 8.497 ms, p95 16.707 ms,
  p99 24.041 ms; 246/4853 callbacks exceeded 16.67 ms.
- Main-thread hotspots included `getNeighbors`, `getGridKey`,
  `insertNearestNeighbor`, and `stepOnce`. This was direct evidence that RVO
  fallback, not the target worker, was a major cost in this run.

`Trace-20260728T230800.json.gz`:

- Same-day Cocos preview, iPhone SE emulation, DevTools CPU slowdown 4x,
  captured after the RVO lifecycle repair.
- Exactly two workers were present: one RVO Blob worker and one target-query
  Blob worker.
- No RVO restart or fallback occurred during the 41.71-second capture.
- RVO worker: 1191 batches, about 28.6 batches/second; average about 0.394 ms,
  p95 0.657 ms, p99 0.876 ms, max 2.564 ms. Its minor GC cost was off-main.
- Main-thread samples for `getNeighbors`, `getGridKey`,
  `insertNearestNeighbor`, `stepOnce`, `applyVelocityAvoidance`, and
  `hardSeparateAgents` were zero.
- Target worker: 822 batches; average 0.138 ms, p95 0.270 ms, p99 0.389 ms,
  max 0.964 ms. The direct-snapshot path was sampled.
- Steady main frame callback: average 5.308 ms, p50 6.944 ms, p95 12.196 ms,
  p99 15.291 ms; 36/4445 callbacks exceeded 16.67 ms.

Best same-condition A/B comparison is `224846` versus `230800`:

| Main frame metric | Before RVO repair | After RVO repair | Change |
| --- | ---: | ---: | ---: |
| Average | 7.390 ms | 5.308 ms | about -28% |
| p50 | 8.497 ms | 6.944 ms | about -18% |
| p95 | 16.707 ms | 12.196 ms | about -27% |
| p99 | 24.041 ms | 15.291 ms | about -36% |
| Over 16.67 ms | 5.07% | 0.81% | about -84% |

`Trace-20260719T222410.json.gz` was also captured at 4x slowdown and also had
only the target worker, not an RVO worker. It therefore confirms that the old
false-fallback behavior existed on July 19 as well. However, its viewport was
recorded as `Responsive`, and it used older source, so it is not an exact
whole-frame A/B baseline. Compared only as a trend, the repaired `230800`
trace has a better p99 and fewer callbacks over 16.67 ms, while average/median
are higher. Do not claim a universal July-19-to-current FPS improvement from
that comparison.

Current trace conclusion:

- the SpatialGrid hybrid target search is active in both main and worker paths;
- the target worker is sub-millisecond in these traces and is not the current
  main-thread bottleneck;
- the repaired RVO worker is genuinely active under 4x slowdown and removes
  the heavy RVO solver functions from the main thread;
- remaining dominant main-thread samples are mostly Cocos engine render,
  transform synchronization, and UBO work;
- rare 33-90 ms spikes still exist, but their magnitude cannot be attributed
  to target search (under 1 ms) or normal RVO worker batches (max 2.564 ms).

These are Cocos preview/device-emulation traces, not production-build traces
from physical mobile hardware. Final release claims still require a real
mobile browser build with telemetry disabled.

## Current Status

Achieved:

- Batch opening is deterministic by average affordable one-unit X-Power and is
  synchronized to mid when telemetry URL params are active.
- Sequential-opening symmetric telemetry no longer shows opening-side
  advantage after the evaluator counter-power correction: `50/100` opener wins
  at `x20`, followed by `44/100` at active `x12`.
- Evaluator counter contribution now uses `sqrt(runtimeMultiplier)` in X-Power
  calculations while runtime combat retains the direct multiplier.
- Spear-to-Cavalry is locked at `x12` in both the active scene and default
  CounterSettings. Controlled `x10` testing failed the intended counter.
- The active `x12` baseline has coherent response flow, balanced team economy,
  valid Sword-to-Spear ladder behavior, and 100 valid elimination endings.
- Final Hero deployment is one-shot and no longer refills/respawns.
- First Hero activation expands target search for all current and future units.
- Unit-vs-Hero pass-through has been removed.
- Telemetry tests no longer finalize on Hero death. Normal gameplay with
  telemetry disabled still does.
- Winner resolution is protected against mid-AoE/mid-attack-batch fallback
  resolution.
- Aggressive no longer depends on the old Hero-line release rule.
- Normal ranged support remains guarded by engaged frontline safety, lane
  anti-repeat, capacity, context score, and accuracy.
- One-unit X-Power/cost rule remains explicit; Archer's tested `26` versus
  nominal `24` exception remains documented rather than hidden.
- Team A/B active unit stats match.
- Melee ladder and active counter rules have controlled-test grounding.
- Unit unlock filtering remains source-confirmed across candidate collection,
  direct spawn, affordability, and winner fallback.
- SpatialGrid nearest-target search now chooses between bounded ring traversal
  and exact active-snapshot scanning in both main-thread and worker paths.
- Target-worker traces confirm the new hybrid path is active and remains
  sub-millisecond under the tested 4x slowdown.
- RVO no longer permanently falls back because worker startup exceeded a
  wall-clock timeout under CPU throttling.
- The latest 4x trace confirms the RVO worker is active and the heavy RVO
  neighbor/solver functions are absent from the main thread.

Not yet proven:

- Aggressive outcomes cannot yet be classified end-to-end because combat-entry
  and death terminal events are missing.
- An aggressive opening that never observes an adjacent boundary has no
  explicit fallback release condition. Verify whether this can persist in real
  gameplay after lifecycle telemetry is complete.
- The current `ceil(maxRangedSupport * accuracy)` cap is intentionally
  staircase-shaped. If level progression must be fully smooth, this is the
  specific mechanic to redesign; do not rewrite candidate scoring first.
- Future tier 2/3 entries need validation that scoring uses their real
  stats/cost instead of family identity alone.
- Archer cost has not been re-tested at nominal X-Power value `24`; all latest
  Archer evidence uses `26`.
- Spear remains the damage/CP outlier at `23.05` under perfect accuracy because
  it is repeatedly matched into Cavalry. This is not evidence that its one-unit
  cost formula is wrong. Its runtime value at intended non-perfect gameplay
  accuracy has not yet been re-measured with `x12`.
- The new performance evidence is from Cocos preview with desktop device/CPU
  emulation. Production web build and physical mobile performance are not yet
  proven.
- A pathological worker that silently never reports ready or error would leave
  RVO waiting. This has not appeared in traces; retain it as an explicit
  lifecycle risk rather than hiding it behind the old false-fallback timeout.

## Recommended Next Work

1. Keep Spear-to-Cavalry at `x12`. Do not try `x10` again and do not compensate
   with Spear base stats or cost unless the user explicitly changes the
   controlled hard-counter requirement.
2. If gameplay balance at intended AI difficulty is the next task, run a
   focused `x12` batch at the intended `0.7-0.8` accuracy. Compare Spear
   counter-opportunity consumption, Spear damage/CP, Cavalry survival, and
   overall composition against the documented accuracy-1 baseline. Do not
   change stats during that batch.
3. Before any further aggressive tuning, add one-shot terminal diagnostics:
   `aggressive-combat-entered`, `aggressive-died-before-release`, and an
   invariant that every aggressive spawn receives exactly one terminal outcome.
4. Re-run a focused aggressive audit and answer:
   - how often it releases to Freehunt;
   - how often it enters combat first;
   - how often it dies first;
   - whether never-observed-boundary waves persist too long.
5. If the intended level curve must be numerically smooth, replace only the
   ranged-cap staircase with a clearly designed probability/cap rule. Candidate
   selection is already probabilistic and should not be rewritten without
   contrary evidence.
6. For level progression, test unit-lock presets explicitly:
   - early level: at least one melee/frontline unlocked;
   - ranged unlock: confirm support does not spawn without frontline except
     last stand;
   - counter-lock levels: confirm fallback responses are acceptable.
7. When tier 2/3 are added, verify:
   - unlocked/affordable filtering;
   - opening choice with high CP;
   - abundant/normal/efficient CP strategy behavior;
   - hard-counter guards such as Cavalry into Spear blockers.
8. Decide explicitly whether Archer keeps tested cost `26` or aligns to nominal
   X-Power cost `24`.
9. Keep current stats stable while diagnosing AI/aggressive behavior. Runtime
   damage/CP is contextual evidence, not the one-unit X-Power cost formula.
10. For the next performance verification, use a real production web build with
   telemetry disabled. Confirm that two workers exist when both worker flags
   are enabled, then compare p95/p99 and callbacks over 16.67 ms.
11. If RVO is ever seen on main again, first inspect worker construction/error
    evidence. Do not assume the worker is unsupported and do not restore the
    old startup wall-clock fallback.

## Worktree Notes

Files intentionally changed in the current uncommitted balance/telemetry pass:

- `AI-CONTEX.md`
- `UNITSTATS.md`
- `assets/Test.scene`
- `assets/scripts/BattlefieldEvaluator.ts`
- `assets/scripts/CounterSettings.ts`
- `assets/scripts/GameManager.ts`

Cocos also generated dirty files under `library/`, `temp/`, and `profiles/`.
They are unrelated generated state. Do not revert or stage them unless the user
explicitly asks.

Known local tooling issues:

- GitHub Desktop lock-file errors usually mean another git operation crashed or
  is still running. Close GitHub Desktop/Editor git operations, verify no git
  process is active, then remove only `.git/index.lock` if it remains stale.
- Cocos preview errors like `Unable to resolve bare specifier '_unresolved_*'`
  came from stale generated preview chunks/import maps, not from the TypeScript
  source itself. Canonical gameplay logic is under `assets/scripts`.

Validation for the current balance/telemetry pass:

```text
TypeScript noEmit (Cocos Creator 3.8.8): PASS
100-report corrected-evaluator x20 baseline parsed: PASS
100-report active x12 baseline parsed: PASS
All active x12 reports use accuracy 1 and multiplier 12: PASS
All active x12 reports end with elimination-and-affordability reason: PASS
Controlled x12 Spear-vs-Cavalry hard-counter: PASS (user-observed)
Controlled x10 Spear-vs-Cavalry hard-counter: FAIL (expected rejection)
git diff --check: PASS (line-ending warnings only)
```

Worker/SpatialGrid validation documented in `Latest Performance Work` predates
the current balance edits; those systems were not changed in this pass.
