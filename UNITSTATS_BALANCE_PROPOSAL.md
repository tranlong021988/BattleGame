# Unit Stats Balance Proposal - System Candidate 1

Date: 2026-07-17

This document records the reasoning for the current 6-unit tier-1 balance
candidate. `UNITSTATS.md` is the numeric source of truth.

## Problem Being Solved

The previous workflow chased local symptoms:

- ranged too strong -> nerf ranged;
- Spear too strong -> nerf Spear;
- Cavalry too weak -> buff Cavalry.

That approach moves the imbalance around the counter loop. The current pass
instead treats the roster as one system: unit count, speed, cost, raw stats,
attack interval, attack range, damage radius, counter multiplier, SmartArmyBrain
spawn tendency, and real runtime focus fire all have to be considered together.

## Evidence Used

Real telemetry before this pass showed:

- Spear became extremely profitable after ranged was nerfed.
- Cavalry was too exposed to Spear and often failed to convert its anti-ranged
  role.
- Archer/Monk can feel stronger in real runtime than in the wave simulator
  because multiple ranged waves focus fire before melee contact.
- Symmetric AI can still show team bias, so win rate alone is not enough.

Tooling changes made during this pass:

- Added `tools/balance_search.py` as a balance-lab random search tool.
- Added micro-duel evaluation inside that tool for unit count, range, speed,
  contact timing, and full Monk AoE.
- Extended `tools/balance_wave_simulator.py --add-rule` to accept explicit
  multipliers: `Attacker:Defender:Multiplier`.

## Current Candidate Summary

The candidate synced into `assets/Test.scene` and `CounterSettings.ts`:

- lowers Spear raw general value:
  - cost up, health down, attack down, defense down, range down;
  - anti-Cavalry identity moved to `Spear > Cavalry = 2.4`.
- makes Cavalry a fast anti-ranged unit, not a universal damage monster:
  - cost up, HP/speed up, base attack/defense down from the previous brawler
    direction;
  - `Cavalry > Archer/Monk = 3.2`.
- makes Sword the clean infantry answer to Spear:
  - stronger HP/value and `Sword > Spear = 3.0`.
- keeps ranged conservative:
  - Archer range/interval/damage reduced from older high-burst versions;
  - Monk AoE radius is only `0.05`, because runtime AoE is full damage on
    secondary targets.

## Post-Test Diagnosis From 20 Real Matches

After this candidate was synced, the user supplied a real 20-match Cocos
telemetry batch from `2026-07-17T12:56:26Z` through `2026-07-17T13:09:42Z`.

Result:

```text
Team 1 wins: 13
Team 0 wins: 7
End reason for all matches: team-eliminated-and-cannot-afford-spawn
Average match duration: 68.1s
```

The candidate did reduce the previous "ranged mass automatically wins" signal:

```text
Archer damage/CP:  9.60
Monk damage/CP:   10.63
Global damage/CP: 20.34
```

But the system is still not healthy:

```text
Spear damage/CP:   31.04
Cavalry damage/CP: 27.29
Sword damage/CP:   22.62, but only 7 Sword waves spawned
```

Real spawn mix:

```text
Archer  138 waves
Cavalry 119 waves
Spear   102 waves
Monk     71 waves
Axeman   32 waves
Sword     7 waves
```

Code review after reading the telemetry found the likely root cause:

- `SmartArmyBrain.chooseEntryForTarget()` ranks counter entries primarily by
  raw counter multiplier.
- Because current rules have `Archer > Spear = 3.2` and `Sword > Spear = 3.0`,
  AI prefers Archer against Spear whenever Archer is affordable.
- That suppresses Sword usage, even though Sword is meant to be the infantry
  answer to Spear.
- The ecosystem then loops around Archer/Monk -> Cavalry -> Spear, and Sword
  does not participate enough to stabilize Spear.

Therefore this candidate should be treated as **not final**, but the next move
should not be a local stat tweak. Fix AI response selection first.

## Current Numbers

See `UNITSTATS.md` for the authoritative table. Short form:

```text
Axeman   10 units, cost 32, hp 130, atk 20, def 3, interval 0.30-0.50
Cavalry  10 units, cost 46, hp 145, atk 22, def 7, speed 6.5
Sword    10 units, cost 46, hp 175, atk 21, def 9
Spear    10 units, cost 42, hp 150, atk 14, def 6, range 0.80
Monk      2 units, cost 40, hp 140, atk 30, radius 0.05, interval 2.00-2.40
Archer    4 units, cost 40, hp 85,  atk 23, range 5.50, interval 1.60-2.00
```

## How To Judge The Next Telemetry Batch

Run the next real telemetry batch **after** fixing SmartArmyBrain response
selection. Do not judge by one headline number. Check:

- damage/CP by family;
- spawn count by family and spawn reason;
- kill pairs and damage pairs;
- counter kills/deaths;
- final CP/alive units;
- whether Team 1 bias persists even when both teams have identical stats;
- whether ranged waves win because they are actually too efficient, or because
  the AI spawned too many frontliners/counters around them.

Acceptance target:

- no family should sit far above global damage/CP across repeated real batches;
- counter pairs should show meaningful advantage but not deletion with no
  losses;
- ranged mass should be useful but not an automatic win condition;
- Cavalry should reach exposed Archer/Monk often enough to matter;
- Sword should be visible as the answer to Spear, with wave count much higher
  than `7/469` total waves;
- if symmetric AI remains heavily biased toward one team, diagnose update order
  or SmartArmyBrain sequence before touching stats again.

## Important Caution

The wave-level simulator is useful for screening, but it under-models real
ranged focus fire. Do not use raw simulator damage/CP to buff Archer/Monk
without confirming in real Cocos telemetry.
