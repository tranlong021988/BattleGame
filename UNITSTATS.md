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

- Spear shares Sword cost in the current test pass, but trades lower defense,
  speed, and general melee value for its Cavalry hard-counter role.
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
| `axeman_t1` | Axeman | 10 | 44 | 180 | 26 | 5 | 3.1 | 0.35 | 0.0 | 0.50-0.60 |
| `cavalry_t1` | Cavalry | 10 | 60 | 210 | 26 | 8 | 6.5 | 0.35 | 0.0 | 0.56-0.66 |
| `sword_t1` | Sword | 10 | 38 | 160 | 20 | 8 | 3.4 | 0.35 | 0.0 | 0.50-0.60 |
| `spear_t1` | Spear | 10 | 38 | 165 | 20 | 6 | 3.0 | 0.35 | 0.0 | 0.50-0.60 |
| `monk_t1` | Monk | 2 | 40 | 65 | 38 | 0 | 2.7 | 5.20 | 0.85 | 2.90-3.50 |
| `archer_t1` | Archer | 4 | 34 | 70 | 17 | 0 | 3.8 | 6.50 | 0.0 | 1.25-1.55 |

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
