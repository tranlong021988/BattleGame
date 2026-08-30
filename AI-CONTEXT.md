# BattleGame — AI Context / Handoff

Updated: 2026-08-31

## Read this before changing gameplay

The experiment that moved player-facing unit, card, and package availability one level later than the boss introduction was **reverted**. Do not assume that offset is active or reintroduce it without a new explicit decision.

`assets/scripts/LevelSettings.ts` contains no remaining gameplay change from that experiment. Its Git `M` status is Editor/line-ending noise rather than an active gameplay diff.

## Git and Cocos workspace safety

- At the last check there was no `.git/index.lock`. Do not delete a lock unless it actually exists and no Git process is running.
- Do not revert or clean `library/`, `profiles/`, or `temp/` without an explicit request and a closed Cocos Editor. They are live cache/log artifacts. At handoff time `temp/startup.json` was deleted and two packer `*.tmp` files existed.

## Latest audited telemetry

Use run `run-mtg1mecu-197njcx`:

- 130 telemetry records, 2026-08-30 16:48:13–17:14:55.
- Main: 83 battles, 60 wins / 23 losses (72.3%).
- Side: 47 battles, 17 wins / 30 losses (36.2%).
- Boss main: 12 wins / 6 losses.
- Campaign completed with an L60 win; post-reward gold: 4,986.

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
