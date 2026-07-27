# Unit Stats

This file is the numeric source of truth for the active tier-1 balance pass.
When a value changes, update this file and both Team A and Team B entries in
`assets/Test.scene`.

## Active Scope

- Active units: Axeman, Cavalry, Sword, Spear, Monk, Archer.
- Skirmisher and tier 2/3 units are inactive.
- Melee waves use 10 units.
- Ranged wave size may be tuned independently, but must stay at or below 5.
- Both teams must use identical unit stats during symmetric balance tests.

## X-Power And Cost

X-Power and nominal cost are calculated for one unit only. `UnitCount` is an
independent battlefield-balance control and must never be multiplied into
X-Power or cost.

```text
EffectiveHP = Health * (1 + Defense * 0.045)
RawUnitPower = sqrt(Damage * EffectiveHP)
Cost = round(RawUnitPower)
XRatio = RawUnitPower / SwordRawUnitPower
```

Sword is the 1.00X reference:

```text
SwordRawUnitPower = sqrt(20 * (100 * (1 + 5 * 0.045)))
                  ~= 49.50
```

X-Power intentionally does not price `UnitCount`, speed, range, attack
interval, or AoE. Those properties affect real battlefield value and must be
validated with controlled matchup tests and full telemetry.

Current exception: Archer's formula result is `24`, while the tested scene cost
is still `26`. Preserve `26` when comparing against the latest telemetry.
Before the next numeric balance lock, explicitly decide whether to align it to
`24`; do not silently describe the current value as an exact formula result.

## Active Stats

| Unit | Count | Cost | Health | Damage | Defense | Speed | Range | Damage Radius | Attack Interval | Raw Unit Power | X Ratio |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| `axeman_t1` | 10 | 74 | 110 | 46 | 2 | 4.65 | 0.35 | 0.0 | 0.36-0.44 | 74.27 | 1.50X |
| `cavalry_t1` | 10 | 97 | 160 | 45 | 7 | 9.75 | 0.35 | 0.0 | 0.36-0.44 | 97.30 | 1.97X |
| `sword_t1` | 10 | 49 | 100 | 20 | 5 | 5.10 | 0.35 | 0.0 | 0.36-0.44 | 49.50 | 1.00X |
| `spear_t1` | 10 | 39 | 95 | 14 | 3 | 4.50 | 0.35 | 0.0 | 0.36-0.44 | 38.85 | 0.78X |
| `monk_t1` | 1 | 49 | 35 | 70 | 0 | 4.50 | 5.80 | 1.00 | 2.10-2.60 | 49.50 | 1.00X |
| `archer_t1` | 5 | 26 | 45 | 13 | 0 | 5.70 | 6.20 | 0.0 | 1.10-1.35 | 24.19 | 0.49X |

Natural melee ladder:

```text
Cavalry > Axeman > Sword > Spear
```

Role notes:

- Cavalry is the strongest and fastest melee wave, but also the most
  expensive.
- Axeman is the heavy infantry between Cavalry and Sword.
- Sword is the balanced 1.00X baseline.
- Spear is deliberately weak in ordinary fights; its value comes from the
  Cavalry hard counter.
- Monk is a fragile single-unit AoE support. Its one-unit X-Power and cost are
  Sword-equivalent, but its slow attack cadence and lost wave slot are real
  risks.
- Archer is fragile direct ranged support. Five units are used so the wave is
  worth its slot while staying below the ranged cap.

## Active Counter Rules

Runtime damage:

```text
damage = max(1, attacker.damage - defender.defense) * counterMultiplier
```

| Attacker | Defender | Multiplier | Intent |
| --- | --- | ---: | --- |
| Spear | Cavalry | 20.0 | Controlled single-wave tests showed Spear winning reliably with meaningful losses. |
| Archer | Spear | 2.0 | Archer punishes Spear while remaining a fragile support wave. |

No other hidden combat multipliers are intended.

## Validation Rules

- Use `BattleArmyBrain.testSingleWaveBattle` for isolated pair verification.
- Use full telemetry for AI composition, target selection, CP use, frontline
  protection, AoE uptime, and runtime damage/CP.
- Runtime damage/CP is contextual evidence, not the cost formula. Spawn
  frequency, lane state, target access, range, AoE, and survival all affect it.
- The latest Archer telemetry used cost `26`; changing it to nominal X-Power
  cost `24` requires a new comparison.
- Do not rebalance one family from a single noisy batch. Check the full roster,
  counter meaning, unit-slot cost, and AI selection flow together.
- Before changing stats for a suspicious result, verify whether the root cause
  is AI scoring or duplicate response coverage.
