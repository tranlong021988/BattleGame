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

## Tier 1 Stats

Melee attack interval currently uses `0.5` to `1.0` seconds.
Ranged attack interval currently uses `1.0` to `1.5` seconds.

| Unit | Family | Unit Count | Cost | Health | Attack | Defense | Speed | Range | Attack Interval |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `axeman_t1` | Axeman | 10 | 30 | 140 | 35 | 2 | 3.0 | 1.0 | 0.5-1.0 |
| `skirmisher_t1` | Skirmisher | 7 | 18 | 95 | 18 | 8 | 3.2 | 5.0 | 1.0-1.5 |
| `cavalry_t1` | Cavalry | 10 | 40 | 160 | 32 | 3 | 6.0 | 1.0 | 0.5-1.0 |
| `sword_t1` | Sword | 10 | 15 | 130 | 22 | 6 | 3.5 | 1.0 | 0.5-1.0 |
| `spear_t1` | Spear | 10 | 10 | 100 | 20 | 1 | 3.0 | 2.0 | 0.5-1.0 |
| `monk_t1` | Monk | 4 | 60 | 110 | 55 | 0 | 3.0 | 5.5 | 1.0-1.5 |
| `archer_t1` | Archer | 6 | 20 | 85 | 25 | 0 | 3.0 | 6.0 | 1.0-1.5 |

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
  - Archer: `6`
  - Skirmisher: `7`
  - Monk: `4`
- Keep Cavalry at `10` for now even though it is expensive, because it must survive the approach against ranged units.
- In code, effective attack range includes unit radii:

```text
effectiveRange = attackRange + attacker.radius + defender.radius
```

This makes ranged units feel stronger than their Inspector range alone suggests.
