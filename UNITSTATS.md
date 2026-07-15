# Unit Stats

This file is the balance source-of-truth for troop stats before syncing values into the Cocos Inspector data in `assets/Test.scene`.

If a unit stat changes, update this file first, then update both Team A and Team B `BattleUnitDatabase` entries in `assets/Test.scene`.

## Current Test Scope

- Current balance test uses tier 1 units only.
- `BattleUnitDatabase.teamAUnits` and `BattleUnitDatabase.teamBUnits` should contain only these 6 tier 1 entries, in this order:
  1. `axeman_t1`
  2. `cavalry_t1`
  3. `sword_t1`
  4. `spear_t1`
  5. `monk_t1`
  6. `archer_t1`
- All 6 active tier 1 entries are unlocked for both teams.
- Skirmisher is intentionally removed from the active unit system for this balance pass. Legacy serialized scene objects may remain, but they must not be referenced by active team arrays.
- Tier 2 and tier 3 entries may remain serialized in the scene file, but they should not be referenced by the active team arrays during this test.

## Icon IDs

Icon IDs preserve the existing icon sheet order. Skirmisher's old icon slot `1` is intentionally unused.

| Unit | Icon ID |
| --- | ---: |
| `axeman_t1` | 0 |
| `cavalry_t1` | 2 |
| `sword_t1` | 3 |
| `spear_t1` | 4 |
| `monk_t1` | 5 |
| `archer_t1` | 6 |

## Active Tier 1 Stats

These values are the active cavalry-anti-ranged balance pass.

| Unit | Family | Unit Count | Cost | Health | Attack | Defense | Speed | Range | Attack Interval |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `axeman_t1` | Axeman | 10 | 32 | 150 | 25 | 3 | 3.0 | 1.0 | 1.10-1.40 |
| `cavalry_t1` | Cavalry | 10 | 52 | 170 | 24 | 5 | 6.0 | 1.0 | 1.10-1.40 |
| `sword_t1` | Sword | 10 | 24 | 145 | 20 | 7 | 3.5 | 1.0 | 0.90-1.20 |
| `spear_t1` | Spear | 10 | 18 | 125 | 16 | 4 | 3.0 | 2.0 | 1.00-1.30 |
| `monk_t1` | Monk | 3 | 52 | 90 | 30 | 0 | 3.0 | 5.5 | 2.30-2.90 |
| `archer_t1` | Archer | 5 | 28 | 80 | 15 | 0 | 3.0 | 6.0 | 1.50-1.90 |

## Imported T1-T3 Stat Reference

The current scene only references tier 1 entries during this test. Tier 2 and tier 3 values below are retained from the imported stat sheet for a future upgrade database pass, but the active T1 test values above are the current source of truth.

| Family | Tier | Unit Count | Health | Attack | Defense | Range | Attack Interval |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Spear | 1 | 10 | 100 | 18 | 1 | 2.0 | 0.90-1.20 |
| Spear | 2 | 10 | 180 | 32 | 3 | 2.0 | 0.85-1.15 |
| Spear | 3 | 10 | 320 | 58 | 6 | 2.0 | 0.80-1.10 |
| Sword | 1 | 10 | 120 | 22 | 5 | 1.0 | 0.80-1.10 |
| Sword | 2 | 10 | 200 | 42 | 10 | 1.0 | 0.75-1.05 |
| Sword | 3 | 10 | 350 | 75 | 20 | 1.0 | 0.70-1.00 |
| Archer | 1 | 6 | 85 | 18 | 0 | 6.0 | 1.20-1.50 |
| Archer | 2 | 6 | 140 | 35 | 1 | 6.5 | 1.10-1.40 |
| Archer | 3 | 6 | 240 | 62 | 2 | 7.0 | 1.00-1.30 |
| Cavalry | 1 | 10 | 150 | 28 | 3 | 1.0 | 1.00-1.30 |
| Cavalry | 2 | 10 | 270 | 52 | 6 | 1.0 | 0.90-1.20 |
| Cavalry | 3 | 10 | 480 | 92 | 10 | 1.0 | 0.80-1.10 |
| Axeman | 1 | 10 | 130 | 26 | 2 | 1.0 | 1.10-1.40 |
| Axeman | 2 | 10 | 230 | 48 | 4 | 1.0 | 1.00-1.30 |
| Axeman | 3 | 10 | 400 | 85 | 7 | 1.0 | 0.90-1.20 |
| Monk | 1 | 4 | 110 | 45 | 0 | 5.5 | 1.60-2.00 |
| Monk | 2 | 4 | 190 | 85 | 1 | 6.5 | 1.50-1.90 |
| Monk | 3 | 4 | 320 | 150 | 2 | 7.0 | 1.40-1.80 |

## Counter Rules

Damage formula:

```text
damage = max(1, attacker.attack - defender.defense) * counterMultiplier
```

Hard counter multiplier: `3.0`.

Active `CounterSettings.rules` use an asymmetric loop. Cavalry intentionally counters both ranged families because fast units are the natural answer to ranged units:

| Attacker | Defender |
| --- | --- |
| Spear | Cavalry |
| Cavalry | Archer |
| Cavalry | Monk |
| Archer | Spear |
| Monk | Axeman |
| Axeman | Sword |
| Sword | Spear |

## Balance Notes

- Ranged troops use smaller wave sizes because the battle logic lets multiple ranged units focus fire from long range before melee can connect.
- Current active ranged wave sizes:
  - Archer: `5`
  - Monk: `3`
- Skirmisher is inactive in this pass to reduce ranged saturation.
- Melee unit count is fixed at `10` for active balance passes.
- Cavalry is the dedicated anti-ranged answer and counters both Archer and Monk. Its cost is higher because it keeps full melee wave size plus high speed.
- In code, effective attack range includes unit radii:

```text
effectiveRange = attackRange + attacker.radius + defender.radius
```

This makes ranged units feel stronger than their Inspector range alone suggests.
