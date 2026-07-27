# AI-CONTEX

Project handoff for Codex sessions working on `BattleGame`.

Last updated: 2026-07-28 after the BattleArmyBrain conflict audit, ranged
support/ranged-safety fixes, telemetry batch automation checks, accuracy sweep
analysis for both teams, preview-cache recovery, unit unlock audit, and source
sync.

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
  ownership, and telemetry URL automation.

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
- `battleTimeScale = 1`; the permanent 1.5x combat tempo was implemented by
  changing movement, attack intervals, and spawn timing rather than by leaving
  time scale raised.

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
| Spear | Cavalry | 20.0 |
| Archer | Spear | 2.0 |

Controlled single-wave testing established that Spear x20 beats Cavalry
reliably while retaining meaningful losses. If full battles still show too
many Spear responses or Cavalry leaks, investigate evaluator target coverage
and response reservations before changing this pair again.

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
- `1` always keeps the best scored candidate.
- Values below `1` use weighted candidate selection among same-anchor
  deliberate mistakes. This is intended to be a smooth probability curve, not a
  hard `if accuracy == X then behavior Y` table.
- A deliberate mistake must be a different family from the best answer, must
  share the same target/lane anchor, and must not itself be an accurate hard
  counter response.
- If `accuracy <= 0` and the only candidate is an accurate hard-counter style
  response, the evaluator returns no decision instead of accidentally taking
  the correct answer. This prevents the lowest-accuracy AI from winning by
  forced correctness.
- Ranged support capacity is also accuracy-scaled. At accuracy `0`, normal
  ranged support capacity is `0`; as accuracy rises, the cap approaches the
  Inspector `maxRangedSupportWavesPerLane`.
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
  closest to the average affordable frontline power. With current tier-1 stats
  and accuracy `1`, this often means Axeman. This is source-confirmed behavior,
  not a SmartArmyBrain issue.
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
- start stats, counter rules, and batch configuration.

Current battle-end condition for automated balance tests is
`team-eliminated-and-cannot-afford-spawn`: a team must have no non-hero units
and be unable to afford another unlocked unit. Heroes can be disabled for these
tests.

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

## Latest Telemetry Evidence

### Monk Redesign Batch

After Monk became one unit with `35 HP / 70 damage / radius 1 / cost 49`:

- 10 equal-accuracy matches ended 5-5.
- Monk: 34 waves, damage/CP 12.20, damage/wave 598, average 4.40 targets per
  attack, 29.4% survival.
- Archer at 4 units: 25 waves, damage/CP 9.24, damage/wave 240.3.
- Sword: damage/CP 11.87, damage/wave 581.5.

Conclusion: Monk's Sword-equivalent cost became defensible because real AoE
value compensated for its fragility and lost wave slot.

### Archer Five-Unit Batch

After Archer changed from 4 to 5 units:

- Archer: 38 waves, damage/CP 13.80, damage/wave 358.7, survival 32.6%.
- Archer team split was symmetric: 13.76 vs 13.84 damage/CP.
- Monk: 33 waves, damage/CP 14.65, damage/wave 718.1.

Conclusion: Archer became worth its slot without evidence that the stat itself
created the observed 3-7 team win split.

### 60-Match Accuracy Sweep

Team 0 stayed at max accuracy. Team 1 ran 10 matches each at accuracy:

```text
0.0, 0.2, 0.4, 0.6, 0.8, 1.0
```

All 60 reports ended validly with
`team-eliminated-and-cannot-afford-spawn`.

Team 1 results:

| Accuracy | Wins | Team 1 / Team 0 Damage |
| ---: | ---: | ---: |
| 0.0 | 0/10 | 65.5% |
| 0.2 | 2/10 | 76.9% |
| 0.4 | 0/10 | 74.2% |
| 0.6 | 5/10 | 88.5% |
| 0.8 | 5/10 | 97.3% |
| 1.0 | 4/10 | 99.0% |

The damage trend supports the accuracy model. The 0.4 win dip is small-sample
noise/threshold behavior, not evidence that accuracy is reversed.

Overall family results across these 60 matches:

| Family | Waves | Damage/CP | Damage/Wave | Survival |
| --- | ---: | ---: | ---: | ---: |
| Spear | 310 | 21.79 | 850.0 | 8.1% |
| Axeman | 324 | 16.05 | 1187.7 | 9.9% |
| Cavalry | 344 | 14.19 | 1376.8 | 4.7% |
| Archer | 153 | 13.14 | 341.6 | 37.5% |
| Sword | 277 | 11.33 | 555.1 | 12.3% |
| Monk | 139 | 10.87 | 532.7 | 33.8% |

Monk averaged 4.18 targets per attack, including 3.18 secondary AoE targets.
Ranged represented 292 waves versus 1255 melee waves, about 23.3%.

Interpretation:

- Archer 5 is economically viable but not dominant.
- Monk and Sword produced similar practical damage value in this sweep.
- Spear's high damage/CP is strongly counter-driven; do not read it as raw
  general power.
- Damage/CP is contextual and must not replace the one-unit X-Power cost rule.

### Close Match Audit

Strict close match:

```text
winner has <= 10 units and winner CP < 26
```

Seven of 60 matches met this condition. Flipping all seven winners only changes
the overall result from Team A 44 / Team B 16 to Team A 45 / Team B 15.
Therefore close-match randomness does not change the accuracy-sweep
conclusion.

One additional match ended with only four Sword alive but 34 CP, so it was not
strictly close because the winner could still afford Archer.

### 2026-07-27 Accuracy Sweep After Source Fixes

Team 0/A stayed at max accuracy. Team 1/B was overridden by URL batch params:

```text
0.0, 0.2, 0.4, 0.6, 0.8, 1.0
```

10 reports were collected per accuracy value. This batch should be treated as
the current behavioral reference for BattleArmyBrain, not the older 2026-07-24
sweep.

Team B results:

| B Accuracy | A Wins | B Wins | B Accurate Decisions | B Mistakes | B Ranged Share |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 0.0 | 10/10 | 0/10 | 3.1% | 96.9% | 2.3% |
| 0.2 | 10/10 | 0/10 | 26.7% | 73.3% | 8.4% |
| 0.4 | 9/10 | 1/10 | 37.7% | 62.3% | 8.5% |
| 0.6 | 7/10 | 3/10 | 68.5% | 31.5% | 14.2% |
| 0.8 | 5/10 | 5/10 | 77.7% | 22.3% | 20.0% |
| 1.0 | 7/10 | 3/10 | 100% | 0.0% | 25.6% |

Team A stayed clean through the whole batch:

- A accurate decisions: 100%.
- A deliberate mistakes: 0%.
- A ranged share stayed around 18.9%-26.2%.
- As B accuracy rose, A was pressured harder: A average damage fell from about
  14442 at B accuracy 0 to about 11177 at B accuracy 1, and A surviving units
  fell from about 30.4 to about 13.7.

Interpretation:

- Accuracy now behaves as a probability/quality curve instead of a broken
  branch table.
- B's decision quality rises, mistake rate falls, and ranged support rises as
  accuracy increases.
- The B accuracy 1.0 split of 3/10 wins looks A-favored, but damage was nearly
  equal in that bucket. Treat it as sample noise or side/opening variance unless
  a larger equal-accuracy batch repeats the bias.
- Several B losses at high accuracy ended with B CP below the cheapest spawn,
  so they were not clear "AI stopped thinking" failures.

Ranged evidence from this batch:

- B accuracy 0 produced only a few Archer waves and no Monk waves.
- B accuracy 1 produced both Archer and Monk regularly.
- Monk at high accuracy produced meaningful damage and kills, confirming that
  the support rewrite no longer suppresses it completely.

The user considers the current accuracy trend "kha on". Future work should not
rewrite the accuracy model casually; if a problem appears, inspect the specific
spawn reason, candidate list, and safety gate first.

## Current Status

Achieved:

- One-unit X-Power/cost rule is explicit; the Archer `26` versus nominal `24`
  exception is documented instead of hidden.
- Team A/B active stats match.
- Melee ladder and the two active counters have controlled-test grounding.
- Monk and Archer are worth their slots in recent telemetry.
- Accuracy produces a meaningful difficulty trend in the latest batch.
- Automated battle end/download/reload worked in the 60-report sweep.
- Ranged fixed-priority constants were replaced with context/stat scoring.
- Normal ranged support is gated by frontline safety and accuracy-scaled
  capacity.
- Last stand is documented as the only intentional normal-rule bypass for
  "spawn any affordable unit."
- Unit unlock filtering is source-confirmed across AI candidate collection,
  direct spawn, affordability, and battle-end checks.
- Preview-cache/import-map problems were identified as generated Cocos state,
  not canonical source logic.

Not yet proven:

- Future tier 2/3 entries need validation that scoring uses their real
  stats/cost instead of family identity alone.
- Archer cost has not been re-tested at nominal X-Power value `24`; all latest
  Archer evidence uses `26`.
- Equal-accuracy 1.0 versus 1.0 may still need a larger side-bias check if the
  user wants statistical confidence beyond 10-match buckets.

## Recommended Next Work

1. If testing continues, run a larger equal-accuracy batch at 1.0 versus 1.0 to
   check side/opening bias. Do not rebalance from a 10-match bucket alone.
2. For level progression, test unit-lock presets explicitly:
   - early level: at least one melee/frontline unlocked;
   - ranged unlock: confirm support does not spawn without frontline except
     last stand;
   - counter-lock levels: confirm fallback responses are acceptable.
3. When tier 2/3 are added, verify:
   - unlocked/affordable filtering;
   - opening choice with high CP;
   - abundant/normal/efficient CP strategy behavior;
   - hard-counter guards such as Cavalry into Spear blockers.
4. Decide explicitly whether Archer keeps tested cost `26` or aligns to nominal
   X-Power cost `24`.
5. Keep current stats stable unless new evidence shows a roster-wide problem.

## Worktree Notes

Files that have been intentionally touched during the current balance/AI pass:

- `AI-CONTEX.md`
- `UNITSTATS.md`
- `assets/Test.scene`
- `assets/scripts/BattlefieldEvaluator.ts`
- `assets/scripts/BattleArmyBrain.ts`
- `assets/scripts/GameManager.ts`
- `assets/scripts/BattleUnitDatabase.ts`
- `assets/scripts/LevelSettings.ts`
- deletion of obsolete `UNITSTATS_BALANCE_PROPOSAL.md` if still present in the
  local diff

Cocos also generated dirty files under `library/`, `temp/`, and `profiles/`.
They are unrelated generated state. Do not revert or stage them unless the user
explicitly asks.

Known local tooling issues:

- Git may report `dubious ownership` for `F:/Github/BattleGame` because Windows
  file ownership/SID differs from the current user. The usual fix is:
  `git config --global --add safe.directory F:/Github/BattleGame`.
- GitHub Desktop lock-file errors usually mean another git operation crashed or
  is still running. Close GitHub Desktop/Editor git operations, verify no git
  process is active, then remove only `.git/index.lock` if it remains stale.
- Cocos preview errors like `Unable to resolve bare specifier '_unresolved_*'`
  came from stale generated preview chunks/import maps, not from the TypeScript
  source itself. Canonical gameplay logic is under `assets/scripts`.
