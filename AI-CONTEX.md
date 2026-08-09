# AI-CONTEX

Project handoff for Codex sessions working on BattleGame.

Last synchronized: 2026-08-10. This is the active authored state after the
Battle Card System MVP was implemented, wired to assets/Test.scene, and
validated with a fresh level 1-33 telemetry batch.

Read the relevant source and active scene before changing gameplay. Inspector
values in assets/Test.scene override TypeScript defaults. This document is an
orientation and decision record, not a second runtime source of truth.

## Working Rules

- Update this file only when the user explicitly requests a handoff update.
- Work with the dirty worktree. Do not revert user/Cocos changes and do not
  stage generated files without explicit instruction.
- Active test AI is BattleArmyBrain plus BattlefieldEvaluator. SmartArmyBrain
  is legacy and must not receive gameplay work unless the user explicitly
  re-enables it.
- Team A is currently BattleArmyBrain, a test simulation of a real player.
  Do not conflate its random purchase/deck behavior with the intended shipped
  player experience.
- Telemetry is test evidence only. Never feed telemetry results into runtime
  decisions.
- Do not alter tier-1 combat stats, counters, AI accuracy behavior, ranged
  support, lane choice, wave costs, SpatialGrid, or RVO to repair progression
  or cards without evidence of a defect in those systems.
- Increasing a wave unitCount must not increase its battle CP cost. Gold already
  pays for unlock/count progression.
- Prefer one causal correction over adding thresholds or tuning knobs. The user
  explicitly dislikes incremental threshold tuning.

## Recommended Codex Skills

Skills are discovered when a Codex task starts. On this local profile, the
following shared skills are installed under C:\\Users\\tranl\\.codex\\skills.
Use the smallest applicable set; if a session does not expose one, follow the
same discipline manually rather than assuming it is available.

| Situation | Skill to use |
| --- | --- |
| Design or revise combat, cards, economy, progression, AI-facing rules | game-systems-design |
| Check cross-system design/source/scene/telemetry consistency before a major mechanic change | game-design-consistency |
| Analyze telemetry or diagnose a balance/economy issue | game-balance-check |
| Verify a balance/mechanics change with before/after evidence | game-balance-regression |
| Any code edit, debug or refactor | cautious-coding |
| Cocos mobile/performance investigation only | cocos-performance-optimize-skills |

The card MVP is now implemented, so a card balance change should normally use
game-design-consistency plus game-balance-check before editing, then
game-balance-regression after the change.

## Product Decisions Already Approved

### Campaign and progression

- The campaign has 100 levels; base progression intentionally ends at level 50.
  Levels 51-100 keep base CP, Max Alive, and tier-1/unit-count progression at
  their caps while boss multipliers still apply. This is reserved for future
  systems and is not currently a bug.
- Normal progression packages target the next boss baseline value, not its
  multiplier-enhanced value.
- Boss multipliers for enemy Initial CP, decision accuracy, and Max Alive are
  each 1.1. They apply once, are non-cumulative, and Max Alive is rounded/capped.
- A lost battle gives Gold at lossGoldRatio; a win gives baseline enemy CP as
  Gold, with an additional boss reward multiplier.
- Rewarded-video rescue is only considered after every three player losses and
  only on a boss. It grants Gold equal to the earliest useful missing CP or Max
  Alive package; it never claims an upgrade for free. The player/bot must still
  purchase the package.
- allowInterval is deliberately false in the active scene. When enabled later,
  shorter enemy spawn intervals plus improving decision accuracy make enemy
  pressure stronger; this needs a fresh balance pass.

### Battle cards: player-facing contract

- Cards are reusable purchases made with Gold. Each card ID is unique; no
  duplicate copies are bought.
- A battle deck contains at most 3 cards, not 5.
- Card cooldown is measured in completed battles, not real time. It starts only
  if that card activated.
- Duration uses battle time. A duration of 0 means active for the rest of that
  battle.
- A card can trigger at battle start or when its own side current CP reaches
  the configured fraction of its initial CP. Effects can stack when their
  targets overlap; for example, an all-army damage card and a Spear damage card
  both affect Spear.
- Cards currently cover damage, flat defense, attack range, Monk damage radius,
  and temporary counter immunity. Spawn interval is intentionally not a card
  effect.
- Enemy cards are authored/selected by the system: exactly three cards per
  encounter, no Gold cost and no cooldown. A different enemy is considered to
  be met after every attempt, including retries.
- The real shipped player will manually buy/upgrade cards outside battle and
  manually choose up to three ready cards before battle. There is no final UI
  for that yet. The test simulation randomly chooses ready owned cards solely
  to make telemetry runs possible.

## Current Source of Truth

| Domain | Authority | Notes |
| --- | --- | --- |
| Active Inspector values | assets/Test.scene | Overrides TypeScript defaults. |
| Campaign/economy/save/card selection | assets/scripts/LevelSettings.ts | Storage v8, purchases, rescue, bot selection and player-facing APIs. |
| Card definitions | assets/scripts/BattleCardDatabase.ts plus scene component | Inspector-editable fields; GameManager references this component. |
| In-battle card state/effects | assets/scripts/BattleCardRuntime.ts | Deck validation, triggers, stacking, duration and card events. |
| Battle integration/start config | assets/scripts/GameManager.ts | Owns runtime and passes modifiers to units. |
| Effect consumers | assets/scripts/Unit.ts and UnitBehavior.ts | Range, damage, defense, radius and counter immunity. |
| Telemetry schema | assets/scripts/BattleTelemetry.ts | Root cardEvents, start config.cards and progression snapshots. |
| Unit authored stats | BattleUnitDatabase plus scene Inspector | Remains independent from cards. |

tools/battle-progression-roadmap.html is now a stale progression presentation
mirror. Do not use it as a card-system authority until it is explicitly updated.

## Active Scene Values

- totalLevels 100; progressionEndLevel 50; currentLevel 1; bossStagePace 5.
- Boss Initial CP, decision accuracy, and Max Alive multipliers are 1.1.
- CP min/max 250/1040; decision accuracy min/max 0.4/1; Max Alive min/max 3/10.
- allowInterval false. Both endpoint spawn intervals are 1.666667/3.333333.
- battleTimeScale 3; Worker RVO and Worker Spatial Target Query enabled;
  spatialGridCellSize 4.
- autoDownloadCaptureJson, autoReloadProgression and purchasingSimulation true.
- progressionStorageKey battle-progression-v8; initial player Gold 0; player
  Initial CP 300; player Max Alive starts 4 and caps at 10.
- winGoldPerEnemyCP 1; bossGoldRewardMultiplier 1.15; lossGoldRatio 0.1;
  lossesPerVideoReward 3; unitUnlockCostMultiplier 20;
  initialCPGoldPerPoint 10; maxAliveBasePrice 1000.

GameManager.battleCardDatabase must point to the scene BattleCardDatabase
component. The current scene reference is valid. If it is lost after a scene
merge/serialization, cards silently become empty because the database is
unavailable; verify that Inspector reference before debugging card balance.

## Progression Runtime V8

Storage was bumped from v7 to v8 because card state is persistent. A v8 save
contains the prior progression fields plus:

- cards: id, owned, cooldownUpgradeLevel in 0..2, cooldownRemaining.
- lastEnemyCardIds.

Use a clean run with:
http://localhost:7456/?progression=1&resetProgression=1&currentLevel=1&TotalLevels=100&ProgressionEndLevel=50

The reset aliases and resume contract remain as before. resetProgression=1 or
reset=1 clears progression before initialization; automatic reload removes the
reset parameter and preserves progressionResume=1.

### Battle lifecycle

At load:

1. Parse/reset URL; load or create v8 state.
2. Apply player state and Team B level/boss curve.
3. If purchasingSimulation is enabled, make weighted legal purchases.
4. Select/configure cards, then start battle.

At battle end:

1. Record activatedPlayerCards from the runtime.
2. Decrement every owned player card already on cooldown by one battle.
3. Set each card that activated in the completed battle to its effective
   cooldown.
4. Apply normal win/loss Gold, boss rescue rules, offers and optional purchase
   simulation; persist, export telemetry and reload.

Cooldown upgrades reduce effective cooldown by one each, maximum two upgrades.
Their prices are 60% then 90% of that card purchase price.

Important current semantic: upgrading a card while it is already cooling down
changes its effectiveCooldown for its next activation but does not reduce its
current cooldownRemaining. This was observed twice in telemetry. It is an open
design choice, not yet a confirmed bug.

### Purchase simulation

The bot first reserves Gold for baseline CP/Max Alive milestone parity. While
it is below either baseline cap, it cannot buy card unlocks or cooldown upgrades.
Once baseline needs are met, weighted choices include:

- card unlock weight 0.6.
- card cooldown upgrade weight 0.2.

This is only a telemetry bot policy. It must not be used to dictate real-player
shop UX or choices.

## Card Implementation

### Inspector data model

BattleCardDefinition in BattleCardDatabase.ts exposes:

- id, displayName, icon.
- purchasePrice, baseCooldownBattles.
- trigger, ownCombatPointThreshold, durationSeconds.
- target, targetFamily.
- modifier, modifierValue, tradeoffModifier, tradeoffValue.
- enemyPool.

Targets are AllUnits, UnitFamily, Frontline and Ranged. Frontline currently
means Spear, Sword, Axeman and Cavalry. Ranged means Archer and Monk. Modifiers
are additive percentages over a 1.0 multiplier, additive flat defense, or
boolean counter immunity. Effects are calculated at runtime and do not mutate
authored unit data.

### Authored card set

| ID | Price | Base CD | Trigger / duration | Effect | Enemy pool |
| --- | ---: | ---: | --- | --- | --- |
| general-offensive | 850 | 5 | start / permanent | all units +5% damage | regular + boss |
| battle-shields | 700 | 4 | own CP <=40% / 12s | frontline +1 defense | regular + boss |
| anti-cavalry-spearhead | 650 | 4 | start / permanent | Spear +14% damage, -1 defense | regular + boss |
| axe-frenzy | 650 | 4 | start / 10s | Axeman +18% damage, -0.2 defense | regular + boss |
| sword-wall | 800 | 5 | own CP <=35% / 10s | Sword +2 defense, -10% damage | regular + boss |
| arrow-suppression | 650 | 4 | start / 12s | Archer +12% damage, -8% range | regular + boss |
| precise-range | 1100 | 5 | start / permanent | ranged +8% range | regular + boss |
| wide-prayer | 1200 | 5 | own CP <=45% / 10s | Monk +30% radius, -12% damage | regular + boss |
| counter-breaker | 1600 | 6 | own CP <=30% / 5s | all units ignore counter multiplier | boss only |

All cards are sale options as soon as a valid card database is loaded; there is
no separate level unlock gate. The baseline-purchase reservation above is what
prevents early simulation spending on cards.

### Runtime and integration behavior

- BattleCardRuntime validates distinct IDs and caps both decks at three.
- Start cards activate at battle time 0. Conditional cards activate once when
  own CP / own initial CP is <= configured threshold.
- Timed cards expire in battle time; permanent cards remain active until battle
  end. Modifiers are cached by team/family and invalidated on deck, activation
  and expiry.
- UnitBehavior applies card damage/defense/radius modifiers. If the defender
  has active counter immunity, configured counter damage becomes 1.
- Unit reads the runtime attack-range multiplier for target search, attack
  distance and kiting behavior.
- Stacking is intended: an eligible unit receives all active overlapping card
  modifiers, including tradeoffs.

### Real-player integration API

No card UI is implemented. A future UI must use the existing LevelSettings
methods instead of reproducing shop/deck validation:

- tryPurchaseCard(cardId, upgradeCooldown = false): boolean.
- setPlayerBattleCardSelection(cardIds): void.

setPlayerBattleCardSelection filters unowned, duplicate, cooling-down and
over-three IDs. When purchasingSimulation is false, this selection is used for
the next/current configured battle. When simulation is true, the bot randomly
samples up to three owned ready cards instead.

Enemy selection is random from its eligible pool and excludes all IDs from the
previous enemy deck when at least three alternatives exist. Enemy has no card
ownership, Gold or cooldown state.

## Telemetry Contract for Cards

Each report contains:

- config.cards: decks at battle start.
- config.progression.settings.cardDefinitions.
- config.progression.player.cards: initial state, selection and economy.
- progression.before and after.player.cards.
- progression.activatedPlayerCards.
- cardEvents: card-activated/card-expired.
- snapshots teams activeCardIds.

A cardEvents entry includes type, team, ID, display name, trigger, duration,
frame and battle-time seconds. Use root events to verify runtime activity;
config.cards alone only proves selection.

For each future card report, inspect:

1. Definition count and scene database reference.
2. Player ownership, ready cards, selected deck size 0-3, cooldown before/after,
   and actual activation/expiry events.
3. Enemy deck size, pool eligibility and immediate-repeat rate.
4. Purchases/Gold/rescues split by card versus baseline upgrades.
5. Boss retries with selected cards, enemy cards, rescue state and outcomes.
6. Controlled A/B runs before claiming a card causes a win-rate change.

## Latest Telemetry Evidence: Card MVP

Dataset analyzed on 2026-08-10:

C:/Users/tranl/Downloads/battle-telemetry-2026-08-09T19-52-33-324Z.json
through
C:/Users/tranl/Downloads/battle-telemetry-2026-08-09T20-31-38-411Z.json

The exact range contains 111 reports from a single stochastic run, levels 1-33
including retries. It is valid evidence for card wiring and economy flow, but
not a causal card-strength study.

### Verified

- 9 card definitions loaded.
- Player first owned, selected and activated Battle Shields at level 4.
- Player decked battles: 59 / 111; player card activations: 98.
- Enemy card activations: 333, exactly three per battle.
- Player selected unavailable/cooling-down card: 0.
- Decks above three cards: 0; enemy decks with other than three cards: 0.
- Enemy immediate deck overlap: 0 / 110 transitions.
- Counter Breaker events on normal levels: 0; Counter Breaker boss activations: 9.

Timed player cards produced matching activation/expiry events. Enemy and player
triggers/durations therefore execute in runtime and are visible in telemetry.

Economy through level 33:

- final Gold 1691.
- owned cards 6.
- card transactions 17.
- card Gold spent 10735.
- all Gold spent 21335.
- Gold from battle rewards 20463.
- video-rescue Gold 4410 from 4 rescues.

Owned by the last report: General Offensive (CD upgrade 1), Battle Shields (2),
Anti-Cavalry Spearhead (2), Axe Frenzy (2), Arrow Suppression (2), and Precise
Range (2). Sword Wall, Wide Prayer and Counter Breaker remain unowned.

Boss retry shape in this run:

| Boss | Attempts | Wins | Losses | Rescues |
| ---: | ---: | ---: | ---: | ---: |
| 5 | 1 | 1 | 0 | 0 |
| 10 | 5 | 1 | 4 | 1 |
| 15 | 8 | 1 | 7 | 2 |
| 20 | 4 | 1 | 3 | 1 |
| 25 | 2 | 1 | 1 | 0 |
| 30 | 1 | 1 | 0 | 0 |

The three-loss rescue rule is working: level 10 had one rescue after four
losses, level 15 had two after seven losses, and level 20 had one after three
losses. Level 15 is the most notable early pressure point. Do not attribute
this directly to cards: bot deck selection is random, and active conditional
cards correlate with a side already losing CP.

Observed deck size outcomes are context-confounded but useful for diagnosis:

| Player deck size | Battles | Wins | Losses |
| ---: | ---: | ---: | ---: |
| 0 | 52 | 13 | 39 |
| 1 | 27 | 11 | 16 |
| 2 | 25 | 4 | 21 |
| 3 | 7 | 4 | 3 |

Do not use this table as proof that three cards are stronger; ownership,
cooldowns, level, rescue and stochastic combat are uncontrolled.

### Superseded invalid card batch

The earlier 2026-08-09 19:25-19:44 level 1-30 batch had zero definitions,
decks, events and card purchases. It is not card balance evidence. The cause
was a null GameManager.battleCardDatabase scene reference. The active scene now
correctly references the BattleCardDatabase component and the later 111-report
batch confirms the fix.

## Next Work: Do Not Assume Approval

The card MVP is implemented and functioning. The next Codex should not add
systems or rebalance values automatically. The user has not approved a numeric
card rebalance after the latest report.

If asked to continue card work, recommended order is:

1. Clarify whether a cooldown upgrade should reduce an already-running
   cooldownRemaining; current behavior affects only future activations.
2. Run a controlled A/B simulation with reset state and matching seed/config:
   cards disabled versus current cards. Compare normal/boss attempts, rescue
   count, Gold/card spend and card event outcomes.
3. If balance evidence supports it, tune card values/prices or purchase-bot
   weights as a small, documented change. Do not tune from a single random run.
4. Separately, build real-player shop/deck UI using the existing APIs. Preserve
   manual player selection; never ship the test bot random selection.

The intentional post-level-50 plateau remains a future extension point. Do not
add repeatable post-50 sinks, packages, scaling or rescue changes without a new
user decision.

## Validation and Operational Notes

Focused validation after implementation:

- BattleCardRuntime focused behavior checks passed: stacking General Offensive
  plus Anti-Cavalry Spearhead, counter immunity, timed expiry/cache
  invalidation/telemetry.
- assets/Test.scene card database reference and 9-card content check passed.
- Cocos bundled TypeScript targeted compile plus skipLibCheck passed.
- git diff --check on authored changes passed.
- 111-report card telemetry parse/grouping passed.

Full project temp/tsconfig.cocos.json compile is currently blocked by missing
generated Cocos declaration type roots: ./temp/declarations/cc,
cc.custom-macro, cc.env and jsb. This is an environment/generated-config issue,
not a card TypeScript failure. Do not use it as a regression signal until the
Cocos generated environment is repaired.

Current authored card/progression changes are uncommitted. The worktree also
contains Cocos-generated changes under library, profiles and temp; leave them
untouched unless explicitly asked. For Git inspection on this machine use:
git -c safe.directory=F:/Github/BattleGame <command>

Stale Cocos Preview packer/import-map caches can produce unresolved asset/chunk
or ENOENT errors. Refresh/restart Preview and verify the targeted compile before
attributing those to gameplay logic.
