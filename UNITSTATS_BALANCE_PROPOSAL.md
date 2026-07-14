# Unit Stats Balance Proposal v2

This proposal is the active 2026-07-15 balance test pass. It is synced into `UNITSTATS.md` and `assets/Test.scene`.

## Goals

- Restore melee staying power after v1 tests showed ranged units surviving too consistently into late game.
- Keep melee as real combat bodies, not only disposable frontline screens.
- Reduce ranged snowball by lowering ranged count/HP/DPS, especially Archer and Monk.
- Keep ranged counter roles useful, but make them require protection instead of dominating the battlefield alone.
- Keep Cavalry as the primary ranged punisher by improving its approach survivability.

## Active Tier 1 Proposal

| Unit | Count | Cost | Health | Attack | Defense | Speed | Range | Attack Interval | Reason |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `axeman_t1` | 10 | 32 | 145 | 24 | 4 | 3.0 | 1.0 | 1.10-1.40 | More durable melee body; still anti-Sword/Skirmisher without excessive burst. |
| `skirmisher_t1` | 5 | 22 | 85 | 14 | 7 | 3.2 | 5.0 | 1.55-1.95 | Anti-ranged specialist, but no longer contributes too much late-game ranged mass. |
| `cavalry_t1` | 10 | 45 | 170 | 24 | 5 | 6.0 | 1.0 | 1.05-1.35 | Better approach survival so ranged cannot erase it before contact. |
| `sword_t1` | 10 | 22 | 140 | 20 | 7 | 3.5 | 1.0 | 0.85-1.15 | Durable general infantry that can hold after ranged has been weakened. |
| `spear_t1` | 10 | 15 | 125 | 16 | 4 | 3.0 | 2.0 | 0.90-1.20 | Tougher anti-Cavalry frontline with lower general damage. |
| `monk_t1` | 4 | 60 | 90 | 34 | 0 | 3.0 | 5.5 | 2.10-2.60 | Strong protected counter, but easier to punish and slower to snowball. |
| `archer_t1` | 5 | 24 | 80 | 15 | 0 | 3.0 | 6.0 | 1.50-1.90 | Lower sustained ranged pressure so melee can survive approach. |

## Watch During Test

- If ranged still dominates late game, reduce Archer/Skirmisher count by 1 before touching melee damage.
- If melee becomes too dominant, lower Sword/Axeman HP by `10` before buffing ranged damage.
- If Cavalry crushes all ranged too reliably, lower HP to `160` before lowering speed or count.
- If Archer feels useless, raise attack to `16` before shortening interval.
- If Monk becomes irrelevant, lower interval to `1.95-2.35` before increasing attack.
