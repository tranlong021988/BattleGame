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

## Current System Balance Candidate

This is **system balance candidate 1** from 2026-07-17 office Codex. It was
chosen from real-telemetry diagnosis plus simulator screening. A later real
20-match Cocos telemetry batch showed the stats should **not** be treated as
final yet, but the next fix should be SmartArmyBrain counter-selection policy
before another stat pass.

Design intent:

- Spear no longer gets high general value from raw HP/damage/defense. It
  counters Cavalry mostly through multiplier.
- Cavalry is durable/fast enough to reach ranged units, but lower base attack
  and higher cost prevent it from becoming a universal brawler.
- Sword is the main infantry answer to Spear.
- Archer/Monk keep ranged utility but slower intervals and small wave counts
  prevent "first ranged mass wins" from becoming automatic.
- Monk AoE is intentionally tiny. In runtime AoE deals full damage to secondary
  units in radius, so this number must be handled carefully.

| Unit | Family | Count | Cost | Health | Attack | Defense | Speed | Range | Damage Radius | Attack Interval |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `axeman_t1` | Axeman | 10 | 32 | 130 | 20 | 3 | 3.0 | 0.35 | 0.0 | 0.30-0.50 |
| `cavalry_t1` | Cavalry | 10 | 46 | 145 | 22 | 7 | 6.5 | 0.35 | 0.0 | 0.30-0.50 |
| `sword_t1` | Sword | 10 | 46 | 175 | 21 | 9 | 3.5 | 0.35 | 0.0 | 0.30-0.50 |
| `spear_t1` | Spear | 10 | 42 | 150 | 14 | 6 | 3.0 | 0.80 | 0.0 | 0.30-0.50 |
| `monk_t1` | Monk | 2 | 40 | 140 | 30 | 0 | 3.0 | 5.50 | 0.05 | 2.00-2.40 |
| `archer_t1` | Archer | 4 | 40 | 85 | 23 | 0 | 3.0 | 5.50 | 0.0 | 1.60-2.00 |

## Counter Rules

Damage formula:

```text
damage = max(1, attacker.attack - defender.defense) * counterMultiplier
```

Active rules:

| Attacker | Defender | Multiplier | Intent |
| --- | --- | ---: | --- |
| Spear | Cavalry | 2.4 | Anti-cavalry comes from rule, not raw Spear value. |
| Cavalry | Archer | 3.2 | Cavalry should punish exposed Archer. |
| Cavalry | Monk | 3.2 | Cavalry should punish exposed Monk. |
| Archer | Spear | 3.2 | Archer pressures Spear when protected or at range. |
| Archer | Monk | 1.8 | Archer pressures Monk without deleting it instantly. |
| Monk | Axeman | 3.2 | Monk counters Axeman with limited low-count AoE. |
| Axeman | Sword | 2.7 | Axeman counters Sword. |
| Sword | Spear | 3.0 | Sword is the infantry answer to Spear. |

## Validation Notes

- Real Cocos telemetry has priority over the wave-level simulator.
- The wave simulator under-models real ranged focus fire and should not be used
  alone to buff Archer/Monk.
- Current screening command after syncing scene:

```powershell
python tools\balance_wave_simulator.py --scene assets\Test.scene --matches 600 --seed 20260728 --dt 0.25 --no-design-report
```

- Simulator screening for this candidate:
  - symmetric AI still showed Team 1 bias around `57%`, likely from AI/update
    order rather than unit stats alone;
  - spawn mix stayed broad, with no single family above about `11.3%` per
    team/family line;
  - Spear stopped being a raw all-purpose unit compared with the previous real
    telemetry batch, because HP/damage/defense/cost were all moved down/up
    together;
  - Archer/Monk remain intentionally conservative in raw simulator damage
    because real telemetry previously made ranged much stronger than simulator.

Real 20-match Cocos telemetry after Candidate 1:

- Team 1 won `13/20`; Team 0 won `7/20`.
- All matches ended by `team-eliminated-and-cannot-afford-spawn`.
- Global damage/CP was `20.34`.
- Family damage/CP:
  - Spear `31.04`;
  - Cavalry `27.29`;
  - Sword `22.62`, but only `7` Sword waves spawned, so sample is too small;
  - Axeman `22.51`;
  - Monk `10.63`;
  - Archer `9.60`.
- Spawn mix:
  - Archer `138`;
  - Cavalry `119`;
  - Spear `102`;
  - Monk `71`;
  - Axeman `32`;
  - Sword `7`.

Diagnosis:

- This batch no longer supports "ranged units are globally too profitable" by
  damage/CP.
- Spear and Cavalry are currently the highest-value families.
- The biggest current issue is that Sword barely appears.
- Code review found `SmartArmyBrain.chooseEntryForTarget()` ranks counter
  entries primarily by raw counter multiplier. Because `Archer > Spear = 3.2`
  and `Sword > Spear = 3.0`, AI tends to answer Spear with Archer instead of
  Sword whenever Archer is affordable.
- This creates a loop: Archer/Monk -> Cavalry -> Spear, while Sword is mostly
  absent.

Next validation should happen after fixing SmartArmyBrain response selection:

- Sword wave count should rise meaningfully from `7/469` total waves.
- Spear damage/CP should be rechecked after Sword is restored into the ecology.
- Cavalry and Archer/Monk spawn pressure should be rechecked together.
- Team 1 bias should be rechecked after the response-selection fix.
