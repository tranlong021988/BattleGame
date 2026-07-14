# Unit Stats

This file is the balance source-of-truth for troop stats before syncing values into the Cocos Inspector data in `assets/Test.scene`.

If a unit stat changes, update this file first, then update both Team A and Team B `BattleUnitDatabase` entries in `assets/Test.scene`.

## Current Test Scope

- Current balance test uses tier 1 units only.
- `BattleUnitDatabase.teamAUnits` and `BattleUnitDatabase.teamBUnits` should contain only these 7 tier 1 entries, in this order:
  1. `axeman_t1`
  2. `skirmisher_t1`
  3. `cavalry_t1`
  4. `sword_t1`
  5. `spear_t1`
  6. `monk_t1`
  7. `archer_t1`
- All 7 tier 1 entries are unlocked for both teams.
- Tier 2 and tier 3 entries may remain serialized in the scene file, but they should not be referenced by the active team arrays during this test.

## Icon IDs

Icon IDs follow the same order as the active unit list.

| Unit | Icon ID |
| --- | ---: |
| `axeman_t1` | 0 |
| `skirmisher_t1` | 1 |
| `cavalry_t1` | 2 |
| `sword_t1` | 3 |
| `spear_t1` | 4 |
| `monk_t1` | 5 |
| `archer_t1` | 6 |

## Active Tier 1 Stats

These values are the active balance proposal v2 from `UNITSTATS_BALANCE_PROPOSAL.md`.

| Unit | Family | Unit Count | Cost | Health | Attack | Defense | Speed | Range | Attack Interval |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `axeman_t1` | Axeman | 10 | 32 | 145 | 24 | 4 | 3.0 | 1.0 | 1.10-1.40 |
| `skirmisher_t1` | Skirmisher | 5 | 22 | 85 | 14 | 7 | 3.2 | 5.0 | 1.55-1.95 |
| `cavalry_t1` | Cavalry | 10 | 45 | 170 | 24 | 5 | 6.0 | 1.0 | 1.05-1.35 |
| `sword_t1` | Sword | 10 | 22 | 140 | 20 | 7 | 3.5 | 1.0 | 0.85-1.15 |
| `spear_t1` | Spear | 10 | 15 | 125 | 16 | 4 | 3.0 | 2.0 | 0.90-1.20 |
| `monk_t1` | Monk | 4 | 60 | 90 | 34 | 0 | 3.0 | 5.5 | 2.10-2.60 |
| `archer_t1` | Archer | 5 | 24 | 80 | 15 | 0 | 3.0 | 6.0 | 1.50-1.90 |

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
| Skirmisher | 1 | 5 | 95 | 16 | 8 | 5.0 | 1.30-1.60 |
| Skirmisher | 2 | 5 | 160 | 30 | 15 | 5.5 | 1.20-1.50 |
| Skirmisher | 3 | 5 | 270 | 54 | 26 | 6.0 | 1.10-1.40 |
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

Active `CounterSettings.rules`:

| Attacker | Defender |
| --- | --- |
| Spear | Cavalry |
| Sword | Spear |
| Archer | Sword |
| Archer | Spear |
| Skirmisher | Archer |
| Skirmisher | Monk |
| Cavalry | Archer |
| Axeman | Skirmisher |
| Axeman | Sword |
| Monk | Axeman |
| Monk | Sword |

## Balance Notes

- Ranged troops use smaller wave sizes because the battle logic lets multiple ranged units focus fire from long range before melee can connect.
- Current ranged wave sizes:
  - Archer: `5`
  - Skirmisher: `5`
  - Monk: `4`
- Keep Cavalry at `10` for now, but its cost is higher because speed and full wave size make it strong against ranged units.
- In code, effective attack range includes unit radii:

```text
effectiveRange = attackRange + attacker.radius + defender.radius
```

This makes ranged units feel stronger than their Inspector range alone suggests.
