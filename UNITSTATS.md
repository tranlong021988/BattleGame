# Unit Stats

This file is the current source-of-truth for active troop stats before syncing
values into the Cocos Inspector data in `assets/Test.scene`.

If a stat changes, update this file and then update both Team A and Team B
`BattleUnitDatabase` entries in `assets/Test.scene`.

## Current Test Scope

- Active balance test uses tier 1 units only.
- Active order in both `teamAUnits` and `teamBUnits`:
  1. `axeman_t1`
  2. `cavalry_t1`
  3. `sword_t1`
  4. `spear_t1`
  5. `monk_t1`
  6. `archer_t1`
- Skirmisher is intentionally inactive for this pass.
- Ranged wave size must stay `<= 5`.
- Melee wave size should stay `10`; Cavalry may be tuned separately if needed.

## Current Natural-Strength Candidate

This is the 2026-07-18 reset pass. The goal is no longer to tune isolated
hard-counter pairs first. The active baseline now builds a natural strength
ladder from equipment/role:

```text
Cavalry > Axeman > Sword > Spear
```

Archer and Monk are intentionally weak when caught alone, but valuable behind a
frontline. `BattleArmyBrain` should treat this as a soft-counter ecology and
choose an economical sufficient-enough response based on battlefield
evaluation, not by raw hard-counter multiplier.

Design intent:

- Spear is cheaper than Sword in the current test pass, but trades lower
  damage, health, defense, speed, and general melee value for its Cavalry
  hard-counter role.
- Sword is the balanced melee baseline.
- Axeman is the strongest melee infantry, with high damage/HP but weaker
  defense and slower attack tempo than Sword.
- Cavalry is the only power-speed unit. It should beat individual infantry
  waves clearly, but its high cost means using it against ordinary melee is not
  always smart.
- Archer has the longest range and better movement than melee, but low HP and
  no defense.
- Monk is treated like a small siege/AoE unit: higher hit damage and
  damageRadius, shorter range than Archer, lower HP, slower movement, and the
  longest attack interval.

| Unit | Family | Count | Cost | Health | Attack | Defense | Speed | Range | Damage Radius | Attack Interval |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `axeman_t1` | Axeman | 10 | 56 | 180 | 28 | 5 | 4.65 | 0.35 | 0.0 | 0.36-0.44 |
| `cavalry_t1` | Cavalry | 10 | 64 | 235 | 40 | 8 | 9.75 | 0.35 | 0.0 | 0.39-0.48 |
| `sword_t1` | Sword | 10 | 46 | 175 | 24 | 8 | 5.10 | 0.35 | 0.0 | 0.36-0.44 |
| `spear_t1` | Spear | 10 | 38 | 130 | 14 | 5 | 4.50 | 0.35 | 0.0 | 0.40-0.50 |
| `monk_t1` | Monk | 2 | 28 | 75 | 23 | 0 | 4.05 | 5.20 | 1.00 | 1.50-1.90 |
| `archer_t1` | Archer | 4 | 32 | 70 | 16 | 0 | 5.70 | 6.20 | 0.0 | 1.10-1.35 |

### 2026-07-20 Tempo Adjustment

The active scene was adjusted to make combat tempo about `1.5x` faster without
using `GameManager.battleTimeScale`:

- unit `maxSpeed` values were multiplied by `1.5`;
- attack intervals were divided by `1.5`;
- `BattleArmyBrain` scene spawn intervals were divided by `1.5`;
- player spawn cooldown in `assets/Test.scene` was divided by `1.5`.

Health, damage, defense, cost, range, unit count, and counter multipliers were
not changed by this tempo pass.

### 2026-07-21 Power/Cost Ladder Adjustment

Sword was over-selected by `BattleArmyBrain` because its evaluated
`power/cost` was slightly higher than Cavalry and Axeman. The broad correction
first adjusted cost so both raw power and `power/cost` followed the intended
melee ladder:

```text
Cavalry > Axeman > Sword > Spear
```

Applied cost changes:

```text
sword_t1: 38 -> 42
spear_t1: 38 -> 41
```

Approximate evaluator `basePower / cost` after this pass:

```text
Cavalry 32.20
Axeman  31.94
Sword   29.45
Spear   27.85
```

### 2026-07-21 Cost And Damage/Cost Ladder Adjustment

User then requested a broader pass so cost, raw damage per CP, and DPS per CP
also follow the same visible strength ladder. This avoids cases where a lower
ladder unit looks like the best damage bargain and becomes over-spawned by the
AI.

Current target ordering:

```text
Cavalry > Axeman > Sword > Spear > Archer > Monk
```

Applied active stat changes:

```text
cavalry_t1: health 210 -> 220, damage 26 -> 38
axeman_t1: cost 44 -> 48, health 180 -> 185, damage 26 -> 27
sword_t1: cost 42 -> 43, damage 20 -> 21
spear_t1: cost 41 -> 38, health 150 -> 145, damage 20 -> 18
archer_t1: cost 34 -> 32
monk_t1: cost 40 -> 31, damage 38 -> 32
```

Approximate evaluator result after this pass:

```text
Power/CP: Cavalry 39.85 > Axeman 30.25 > Sword 29.48 > Spear 28.03 > Archer 7.75 > Monk 6.88
DPS/CP:   Cavalry 15.57 > Axeman 15.34 > Sword 13.32 > Spear 12.92 > Archer 2.28 > Monk 0.97
Damage/CP:Cavalry  6.33 > Axeman  5.63 > Sword  4.88 > Spear  4.74 > Archer 2.13 > Monk 2.06
```

### 2026-07-22 Whole-System Telemetry Adjustment

Real telemetry from 20 matches showed runtime damage/CP as:

```text
Cavalry 35.6 > Spear 34.8 > Archer 30.3 > Axeman 26.3 > Sword 21.8 > Monk 20.0
```

That failed the intended ladder:

```text
Cavalry > Axeman > Sword > Spear > Archer > Monk
```

This pass changes the whole stat shape rather than one symptom:

```text
cavalry_t1: cost 60 -> 64, health 220 -> 235, damage 38 -> 40, interval 0.373333-0.44 -> 0.39-0.48
axeman_t1: cost 48 -> 52, health 185 -> 195, damage 27 -> 30, interval 0.333333-0.40 -> 0.36-0.44
axeman_t1: damage 30 -> 32 to make Axeman clearly beat Sword on estimated power/CP while preserving the raw ladder.
axeman_t1: damage 32 -> 30 after telemetry showed Axeman runtime damage/CP above the rest of melee.
axeman_t1: damage 30 -> 28 after telemetry showed Axeman still too efficient when AI correctly targets Sword.
axeman_t1: cost 52 -> 56 to reduce runtime damage/CP while preserving Axeman's battlefield feel and melee ladder role.
axeman_t1: health 195 -> 180 to reduce post-matchup survivability/farming after Axeman wins favorable Sword lanes.
sword_t1: cost 43 -> 46, health 160 -> 175, damage 21 -> 24, interval 0.333333-0.40 -> 0.36-0.44
spear_t1: health 145 -> 130, damage 18 -> 12, defense 6 -> 5, interval 0.333333-0.40 -> 0.40-0.50
spear_t1: damage 12 -> 15 after telemetry showed Archer slightly above Spear in runtime damage/CP.
spear_t1: damage 15 -> 14 after the next batch showed Spear rising to roughly Sword-level runtime damage/CP.
archer_t1: damage 17 -> 14, range 6.50 -> 6.20, interval 0.833333-1.033333 -> 1.10-1.35
monk_t1: cost 31 -> 28, health 65 -> 75, damage 32 -> 24, damageRadius 0.85 -> 0.70, interval 1.933333-2.333333 -> 2.10-2.50
monk_t1: damage 24 -> 23 after telemetry showed Monk slightly above Archer in runtime damage/CP while raw power remained lower.
monk_t1: damageRadius 0.70 -> 1.00 to make the AoE support role more visible; verify with telemetry because protected AoE can rise quickly.
archer_t1: damage 14 -> 16 to bring ranged damage/CP closer to melee without changing ranged wave count.
monk_t1: interval 2.10-2.50 -> 1.95-2.35 to lift support damage/CP while preserving damage 23 and radius 1.00.
monk_t1: interval 1.95-2.35 -> 1.50-1.90 to raise support damage/CP closer to melee while keeping the AoE radius unchanged.
```

Intent:

- Spear should be genuinely weak outside `Spear > Cavalry`.
- Archer should still punish Spear, but protected Archer should no longer print
  extreme damage/CP.
- Axeman and Sword need enough raw value to rise above Spear and Archer in real
  telemetry.
- Monk remains the cheapest support and should be judged by protected-frontline
  telemetry. Its radius is intentionally `1.00` for visible AoE identity, while
  interval tuning is used to keep runtime damage/CP near, but not above, melee.

## Counter Rules

Damage formula:

```text
damage = max(1, attacker.attack - defender.defense) * counterMultiplier
```

Active rules:

| Attacker | Defender | Multiplier | Intent |
| --- | --- | ---: | --- |
| Spear | Cavalry | 18.0 | Hard counter. Spear is weak generally, but should beat Cavalry in 3 hits without one-shotting it. |
| Archer | Spear | 4.0 | Hard counter. Archer punishes Spear clearly while staying weaker as a standalone support unit. |

Current Spear-vs-Cavalry combat check:

```text
Spear -> Cavalry: max(1, 14 - 8) * 18.0 = 108 damage/hit
Cavalry -> Spear: max(1, 40 - 5) = 35 damage/hit
Spear raw damage/cost is intentionally low; Spear value must come from
positioning and the Cavalry counter, not all-purpose DPS.
```

## Validation Notes

- Real Cocos telemetry has priority over the wave-level simulator.
- Old telemetry tied to `SmartArmyBrain` hard-counter selection is not a clean
  verdict on this new system.
- `BattleArmyBrain` is the intended AI for this candidate. It uses
  `BattlefieldEvaluator` to score threat, coverage, frontline safety, lane
  traffic, and economical sufficient-enough response.
- Ranged units should be tested in two contexts:
  - exposed/no frontline: they should lose badly;
  - protected/frontline present: they should contribute meaningful damage.
- Watch specifically for:
  - over-spawning ranged into lanes without sufficient melee shield;
  - over-countering one small enemy wave;
  - direct spawning into lanes that already have two useful ally waves ahead;
  - Cavalry being wasted against ordinary melee when Axeman/Sword/Spear would
    be cheaper and sufficient.
