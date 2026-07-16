# Unit Stats Balance Proposal - Current 6-Unit Pass

This file tracks the active 2026-07-16 balance direction. It is synced with `UNITSTATS.md`, `assets/Test.scene`, and the latest `AI-CONTEX.md` handoff.

## Current Direction

- Active test scope uses 6 tier-1 troop entries per team.
- `Skirmisher` is intentionally inactive to reduce ranged saturation.
- Cavalry is the dedicated anti-ranged answer and counters both active ranged families.
- Do not judge balance from kill/CP stats alone. First check SmartArmyBrain spawn-policy telemetry, wave-size exposure, and whether Cavalry is overrepresented by either accurate responses or aggressive empty-lane fastest raids.

## Active Tier 1 Stats

| Unit | Count | Cost | Health | Attack | Defense | Speed | Range | Damage Radius | Attack Interval | Reason |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| `axeman_t1` | 10 | 32 | 150 | 25 | 3 | 3.0 | 0.35 | 0.0 | 1.10-1.40 | Durable melee attacker; counters Sword without being part of the anti-ranged chain. |
| `cavalry_t1` | 10 | 52 | 170 | 24 | 5 | 6.0 | 0.35 | 0.0 | 1.10-1.40 | Fast anti-ranged unit; counters both Archer and Monk, so cost is intentionally high. |
| `sword_t1` | 10 | 24 | 145 | 20 | 7 | 3.5 | 0.35 | 0.0 | 0.90-1.20 | General durable infantry; counters Spear. |
| `spear_t1` | 10 | 20 | 125 | 16 | 4 | 3.0 | 1.0 | 0.0 | 1.10-1.40 | Anti-Cavalry frontline. Latest small nerf reduced the Spear/Cavalry spike without changing the counter graph. |
| `monk_t1` | 2 | 52 | 90 | 28 | 0 | 3.0 | 5.5 | 0.5 | 2.30-2.90 | Fragile ranged/AOE counter to Axeman; reduced count lowers ranged saturation. |
| `archer_t1` | 5 | 28 | 80 | 15 | 0 | 3.0 | 6.0 | 0.0 | 1.50-1.90 | Ranged anti-Spear unit; smaller wave and slow interval reduce ranged snowball. |

## Active Counter Rules

Hard counter multiplier remains `3.0`.

| Attacker | Defender |
| --- | --- |
| Spear | Cavalry |
| Cavalry | Archer |
| Cavalry | Monk |
| Archer | Spear |
| Monk | Axeman |
| Axeman | Sword |
| Sword | Spear |

## AI Policy Notes

- `SmartArmyBrain.aggressiveForwardChance` decides whether to attempt an empty-lane aggressive raid.
- `SmartArmyBrain.aggressiveFastestEntryChance` decides whether that selected raid chooses the fastest affordable unit or a random affordable unit.
- If Cavalry appears too often, first inspect `BattleTelemetry.spawnDecisionStats`:
  - `Cavalry > Archer/Monk:response` means the counter graph is producing Cavalry.
  - `aggressive-empty-lane-fastest` means AI spawn policy is producing Cavalry because Cavalry is fastest.
- Do not nerf Spear or Cavalry based only on kill totals until this spawn-source split and target exposure are checked.

## Latest Telemetry Summary

### 2026-07-15 Problem

- In `decisionAccuracy = 1.0` tests, the `Spear > Cavalry` pair was too prominent.
- A later `decisionAccuracy = 0.5` batch was used to test a weaker/noisier AI.
- Before the Spear adjustment, the raw tracked counter-rule kill share was:
  - `Spear > Cavalry = 30.7%`;
  - grouped `Cavalry > Ranged = 13.4%`.

### 2026-07-15 Cause

- Cavalry is a funnel/exposure unit:
  - Cavalry counters both Archer and Monk;
  - Spear is the only hard counter to Cavalry.
- AI response spawns were almost symmetric before the adjustment:
  - `Spear > Cavalry = 26`;
  - `Cavalry > Archer + Cavalry > Monk = 28`.
- Victim exposure was not symmetric:
  - Cavalry spawned about `620` units;
  - Archer + Monk spawned about `312` units.
- Therefore the high raw `Spear > Cavalry` share was partly real Spear strength and partly a statistical funnel effect.

### 2026-07-15 Implemented Adjustment

Only Spear changed:

```text
spear_t1:
  cost: 18 -> 20
  attackIntervalMin: 1.00 -> 1.10
  attackIntervalMax: 1.30 -> 1.40
```

### 2026-07-15 Result

Post-adjustment `decisionAccuracy = 0.5` batch:

- 10 reports.
- Winrate: `Team0 5` / `Team1 5`.
- Average duration: about `108s`.
- `Spear > Cavalry` raw share: `30.7% -> 26.9%`.
- Spear kills per report: about `27.8 -> 24.7`.
- Spear kills / Cavalry spawned: about `49.4% -> 41.2%`.

Interpretation: keep the Spear adjustment. It moved the target pair in the right direction without destabilizing winrate.

### 2026-07-16 Office Update

The office Codex added a newer balance/economy telemetry pass. Treat `AI-CONTEX.md` and `UNITSTATS.md` as current if this file ever disagrees with them.

Accepted current data changes now reflected here:

- Melee visual/combat range pass:
  - Sword/Axeman/Cavalry range: `0.35`;
  - Spear range: `1.0`;
  - ranged unit ranges unchanged.
- Monk adjustment:
  - `count 3 -> 2`;
  - `damage 30 -> 28`;
  - `damageRadius = 0.5`.
- Spear adjustment from the previous pass remains active:
  - `cost 18 -> 20`;
  - `attackInterval 1.00-1.30 -> 1.10-1.40`.

Telemetry/economy diagnosis added by the office Codex:

- New telemetry now records CP spent/earned and per-CP efficiency fields.
- In the latest 10-report office batch, Team 0 won `9/10`.
- At match end, the losing side had enough CP to spawn the cheapest unit in `0/10` matches.
- Because `enableNoAffordableSpawnWinnerFallback` is currently `false`, matches keep running until hero death. For pure unit/economy balance tests, consider enabling that fallback to catch the earlier economic loss point.
- Latest efficiency read from `AI-CONTEX.md` shows Spear is still the most CP-efficient killer, while Cavalry remains expensive and overexposed because it answers both ranged families.

## Watch During Test

- If Cavalry is overrepresented, lower `aggressiveFastestEntryChance` or inspect empty-lane raid reasons before changing Cavalry stats.
- If Spear appears too strong, first check whether it is only reacting to excessive Cavalry spawns and normalize by Cavalry exposure.
- Monk has already received the tiny damage/count/AOE-focused adjustment reflected above. Do not stack another Monk nerf without a fresh batch.
- If `Monk > Axeman` remains high after the current `count 2 / damage 28 / damageRadius 0.5` setup, inspect spawn causes and CP efficiency before changing interval.
- If ranged units again dominate late game, consider reducing Archer/Monk count or damage, not reactivating Skirmisher immediately.
- If melee becomes too dominant, tune HP/interval before changing counter rules.
- Keep melee unit count fixed at `10` for this balance pass.
