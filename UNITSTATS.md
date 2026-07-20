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
choose the cheapest sufficient response based on battlefield evaluation, not by
raw hard-counter multiplier.

Design intent:

- Spear stays slightly cheaper than Sword in the current test pass, but trades
  lower defense, speed, and general melee value for its Cavalry hard-counter
  role.
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
| `axeman_t1` | Axeman | 10 | 44 | 180 | 26 | 5 | 4.65 | 0.35 | 0.0 | 0.333333-0.40 |
| `cavalry_t1` | Cavalry | 10 | 60 | 210 | 26 | 8 | 9.75 | 0.35 | 0.0 | 0.373333-0.44 |
| `sword_t1` | Sword | 10 | 42 | 160 | 20 | 8 | 5.10 | 0.35 | 0.0 | 0.333333-0.40 |
| `spear_t1` | Spear | 10 | 41 | 150 | 20 | 6 | 4.50 | 0.35 | 0.0 | 0.333333-0.40 |
| `monk_t1` | Monk | 2 | 40 | 65 | 38 | 0 | 4.05 | 5.20 | 0.85 | 1.933333-2.333333 |
| `archer_t1` | Archer | 4 | 34 | 70 | 17 | 0 | 5.70 | 6.50 | 0.0 | 0.833333-1.033333 |

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
keeps combat stats unchanged and adjusts cost so both raw power and
`power/cost` follow the intended melee ladder:

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

## Counter Rules

Damage formula:

```text
damage = max(1, attacker.attack - defender.defense) * counterMultiplier
```

Active rules:

| Attacker | Defender | Multiplier | Intent |
| --- | --- | ---: | --- |
| Spear | Cavalry | 2.1 | Hard counter. Spear should punish Cavalry without turning every other matchup into a multiplier game. |
| Archer | Spear | 1.45 | Soft-hard counter. Archer should punish Spear enough to stop cheap Spear from being the best all-purpose economy unit. |

## Validation Notes

- Real Cocos telemetry has priority over the wave-level simulator.
- Old telemetry tied to `SmartArmyBrain` hard-counter selection is not a clean
  verdict on this new system.
- `BattleArmyBrain` is the intended AI for this candidate. It uses
  `BattlefieldEvaluator` to score threat, coverage, frontline safety, lane
  traffic, and cheapest sufficient response.
- Ranged units should be tested in two contexts:
  - exposed/no frontline: they should lose badly;
  - protected/frontline present: they should contribute meaningful damage.
- Watch specifically for:
  - over-spawning ranged into lanes without sufficient melee shield;
  - over-countering one small enemy wave;
  - direct spawning into lanes that already have two useful ally waves ahead;
  - Cavalry being wasted against ordinary melee when Axeman/Sword/Spear would
    be cheaper and sufficient.
