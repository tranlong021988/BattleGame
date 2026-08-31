# BattleGame — AI Context / Handoff

Updated: 2026-08-31

## Read this before changing gameplay

The experiment that moved player-facing unit, card, and package availability one level later than the boss introduction was **reverted**. Do not assume that offset is active or reintroduce it without a new explicit decision.

`assets/scripts/LevelSettings.ts` contains no remaining gameplay change from that experiment. It does, however, contain the active Cavalry Charge economy/progression changes described below.

## Active Cavalry Charge design (2026-08-31)

- Added `Cavalry Charge`: targets Cavalry, applies `+300% Damage` at full strength, with no defensive modifier. It intentionally has no Spear exception: a charged Cavalry may overpower Spear during its limited active use.
- Base package: 2,000 gold, cooldown 6 battles, budget 12. Strength has two upgrades and uses the standard dynamic pricing / availability pipeline.
- The card maps to progression wave 3 (the Cavalry wave). Unlock and its cooldown, budget, and strength upgrades therefore flow through the existing dynamic scheduler instead of hard-coded level offers.
- `mainRewardFlatBonus` is set to 1,000 in the live `Battle.scene` and default `LevelSettings`. A strict source-model audit that charges all planned packages immediately was negative at 950 and non-negative at 1,000 after including the new card. This is tuning evidence, not a substitute for an actual Cocos no-loss run.

## Git and Cocos workspace safety

- At the last check there was no `.git/index.lock`. Do not delete a lock unless it actually exists and no Git process is running.
- Do not revert or clean `library/`, `profiles/`, or `temp/` without an explicit request and a closed Cocos Editor. They are live cache/log artifacts. At handoff time `temp/startup.json` was deleted and two packer `*.tmp` files existed.

## Latest audited telemetry

Use run `run-mth2oei1-1122jbd` (2026-08-31 10:05:20–10:25:52):

- 102 telemetry records. Main: 83 battles, 60 wins / 23 losses (72.3%). Side: 19 battles, 8 wins / 11 losses (42.1%).
- Campaign completed at L60 (`boss-hero-killed`); post-reward gold: 5,766.
- There were 111 successful progression package purchases. All 58 card package purchases were completed: 10 unlocks, 20 cooldown upgrades, 20 budget upgrades, and 8 strength upgrades.
- No recorded spending action had `goldBefore < cost`, and no action recorded a negative gold balance. The lowest recorded balance was 20 gold. This confirms the observed run, not the separate flawless/no-loss design contract.

### Cavalry Charge observations

- The live telemetry snapshot includes `cavalry-charge` with price 2,000, cooldown 6, budget 12, +300% damage, and two strength ranks.
- Unlock: L35. Its seven permanent purchases all completed: unlock; cooldown ranks 1–2; budget ranks 1–2; strength ranks 1–2.
- It was selected for 13 main battles, activated in all 13, and depleted its battle budget in 12. One L51 battle used 15/17 budget before ending.
- Cooldown-skip ads for this card: 7.

### User gold chart

`C:\Users\CPU\.codex\visualizations\2026\08\05\019fd124-855e-7140-8e3c-fe3489442ac9\user-gold-by-battle.html` visualizes the actual post-battle player gold for all 102 records, rewards, main entry fee, and every purchase/upgrade marker. It is an analysis artifact; regenerate it from a new batch rather than treating it as live data.

### Reward and ad results

- Normal-main *win* reward rises by 50 per normal level. Boss rewards are intended spikes; normal reward resumes its normal curve afterward.
- Main loss reward is correct: 25% of main entry fee, rounded half-up to the nearest ten. L10 fee 500 -> reward 130; L60 fee 2,950 -> reward 740.
- Main gold x2 is intentionally disabled by the `side-rescue-only` policy. Zero main x2 is not evidence that main gold is too generous.
- Side gold x2 occurred on 5 of 17 side wins (29.4%): L38, L49 twice, L53, L58. Reasons: securing main entry or buying packages plus securing main entry.
- Cooldown-skip ads: 33 of 83 main battles. Sword Wall: 20; Counter Breaker: 7; others: 6. This is desired for important cards.
- No main battle had selected player cards while `usedPlayerCards` was empty. The symptom “enter with cards but do not use them” does not occur in this run.

## Required economy/baseline evaluation rules

1. **No-loss simulation is the design gate.** Simulate L1–60 with no losses and no gold-x2 ads. If the player cannot pay an entry fee or buy every package already unlocked at that specific level, it is a design issue.
2. **Real telemetry has loss snowball.** Gold or baseline shortages after previous main or side losses are expected recovery pressure, not automatically a design issue.
3. **Never judge by CP alone.** A 7–8 CP gap normally does not prove material spawn advantage. Compare CP, maxAlive, unlocked units, unit counts, and result together.
4. **A proven baseline issue requires:** (a) enough gold but bot purchasing skipped a required baseline package; or (b) a no-loss / adequately funded state still enters main materially weaker than the enemy.
5. **Card issue definition:** a selected relevant usable card is neither used nor handled through cooldown-skip. Owning an irrelevant card is not an issue.

## Latest baseline findings

No unit-count deficit occurred in this run.

- L38: player -8 CP but +1 maxAlive; lost after L36 loss and four side losses.
- L47: player -1 maxAlive but +8 CP; won after L45–46 losses.
- L48: player -8 CP, equal maxAlive and unit count; won.

These are loss-snowball outcomes, not evidence that progression forces side farming.

## Open concern — do not change without approval

Side rescue can create emotional friction through long loops:

- L51 required 8 side attempts for one win.
- L60 required 7 side attempts for one win.

Campaign completion was still possible. Monitor this; do not change side rewards or x2 policy without an explicit new design decision.
