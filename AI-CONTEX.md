# AI-CONTEX

Handoff for the other Codex session working on `BattleGame`.

Last updated: 2026-07-13 by the home Codex.

This file should describe the current accepted source and design. It is not a full history log. Always read the current source before editing. If this file conflicts with source, trust source first and update this file.

## Workspace Notes

- Project path on this office machine: `D:\Works\Github\BattleGame`.
- Home machine path may be different. Do not hardcode local paths in source or shared tooling.
- Cocos Creator on this office machine: `C:\ProgramData\cocos\editors\Creator\3.8.8`.
- The worktree is dirty. Many `library/`, `temp/`, `profiles/`, and `build/` changes are Cocos-generated/editor-generated.
- Do not revert user/editor changes unless the user explicitly asks.
- `.claude/` was removed earlier from this workspace because it was an unrelated untracked local settings folder.

Useful office typecheck command:

```powershell
node 'C:\ProgramData\cocos\editors\Creator\3.8.8\resources\app.asar.unpacked\node_modules\typescript\bin\tsc' --noEmit --skipLibCheck --module esnext
```

## Current Source Shape

- `SmartArmyBrain.ts` is the maintained AI brain.
- `ArmyBrain.ts` was removed. Do not reintroduce it unless the user explicitly asks for an experiment.
- `GameManager.enableAutoSpawn` should usually be off when `SmartArmyBrain` owns spawning.
- `BattleWave` owns wave-level state, representative unit, and optional wave banner node.
- `Unit` / `UnitBehavior` still own per-unit movement/combat state.
- There is no regroup-to-slot formation movement in the accepted flow. The only accepted lane-return behavior is the lightweight per-unit `freehunt -> forward` back-to-lane phase described below.
- Minimap is not a current gameplay target. The user said they do not intend to use minimap in the game. Avoid treating minimap as an active performance suspect unless the user explicitly re-enables it.

## Latest 2026-07-13 Home Handoff

Read this section before continuing gameplay AI or forward/freehunt work.

### Aggressive Forward And Ranged Units

- User reported that aggressive-forward archers could cancel aggressive forward too early because their long `attackRange` let them acquire different-lane enemies.
- Current accepted fix:
  - while `Unit.onForward && Unit.aggressiveForward`, the unit's own attack-range acquisition ignores enemies outside the unit/wave lane;
  - this filter is in `Unit.isValidEnemyWithinAttackRange()`, so cached attack-range targets also cannot bypass it;
  - normal forward is unchanged and still uses same/adjacent-lane scanner release rules.
- Important distinction:
  - aggressive-forward units do not proactively attack different-lane units just because they are in weapon range;
  - if a different-lane enemy actually attacks them, `reactToAttacker()` still allows solo retaliation for the hit unit;
  - the rest of the wave keeps aggressive forward during that solo retaliation.

### SmartArmyBrain Telemetry

- Added optional `SmartArmyBrain.enableDecisionStats`, disabled by default.
- When enabled in Inspector, it logs actual-match counts for:
  - aggressive spawns;
  - normal spawns;
  - intentional waits;
  - hard skips.
- Percentages use `aggressive + normal + wait` as the denominator. `skip` is reported separately because max-wave / no-CP / failed-spawn gates are not tactical wait decisions.
- Use this telemetry for concrete playtests instead of guessing theoretical probabilities.
- Current scene values observed on 2026-07-13:
  - `SmartArmyBrainA/B.decisionAccuracy = 1`;
  - `aggressiveForwardChance = 0.25`;
  - `fastReactCounterChance = 0.5`;
  - `maxAliveWaves = 7`;
  - `LevelSettings` node is disabled, so these serialized Brain values are not being overridden at runtime unless the user enables LevelSettings.
- User tested with decision stats and observed normal-forward rate is near zero. This is expected with the current AI rules:
  - before the team first reaches `maxAliveWaves`, `shouldSpawnAggressiveForward()` makes response/opening spawns aggressive;
  - response spawning also forces aggressive when the target lane is clean, or when ally blockers are between spawn and target;
  - with `decisionAccuracy = 1`, naive/random and deliberate-mistake paths rarely/never provide normal-forward diversity.
- Do not change this yet without discussing with the user. The likely future tuning point is `SmartArmyBrain.shouldSpawnCounterAggressiveForward()`, especially the rule that a clean target lane forces aggressive.

### Current Known Worktree Notes

- `AI-CONTEX.md`, `SmartArmyBrain.ts`, and `Unit.ts` have active handoff/gameplay edits from this session.
- Many `library/`, `temp/`, `profiles/`, and build files are still editor/generated noise. Do not clean/revert them unless the user explicitly asks.
- Validation done after the telemetry and aggressive-forward filter changes:
  - `git diff --check -- AI-CONTEX.md assets/scripts/SmartArmyBrain.ts assets/scripts/Unit.ts`;
  - Cocos TypeScript command from this file's Workspace Notes ran clean on the home machine.

### Web Mobile PC Landscape Layout

- User wants the 720x1280 portrait game to keep its 9:16 aspect ratio when opened on a landscape PC browser.
- Do not solve this by globally changing `settings/v2/packages/project.json` to `fitHeight=true`; that can hurt tall portrait mobile screens.
- Current accepted source-side solution:
  - keep project design resolution at 720x1280 with `fitWidth=true`;
  - add `build-templates/web-mobile/style.css`;
  - in landscape orientation, CSS centers `#GameDiv` and sets it to `height: 100vh` and `width: calc(100vh * 9 / 16)`, producing side pillars on PC;
  - portrait remains full-screen `100% x 100%`.
- Rebuild `web-mobile` after this change so Cocos copies the template CSS into the build output.

## Accepted 2026-07-07 Office Changes

These are the current accepted changes from today's office session:

- `GameManager.targetFrameRate` was added for mobile/browser FPS experiments. Use `30`, `45`, or `60`; use `0` or lower to keep the engine default.
- `GameManager` shifted wave-banner refresh phase from `wave.id` to `wave.id + 1` to reduce same-frame overlap with other wave work.
- `TopDownCameraDrag` now avoids setting camera world position or FOV when the value is already within a tiny epsilon. This reduces unnecessary transform/render invalidation during camera idle/smoothing.
- `Unit` skips forward-facing rotation work when actual movement/pref velocity is already aligned with `forwardDir`. This must not be changed into a hard rotation lock, because RVO/overtake can move units diagonally while forwarding.
- `Unit` only prefers actual `agent.vel` for move-intent facing after visual movement has accumulated past the normal move threshold. If a unit is blocked and barely moving, facing falls back to stable `prefVel` instead of jittering with RVO/overtake velocity noise.
- `Unit.applyFacingYaw()` clamps its lerp factor to `[0, 1]` so frame spikes cannot overshoot the target yaw.
- `Unit` skips repeated busy look/sync work once both attacker and target are locked, the look direction is settled, and visual position is already close enough.
- `Unit` attack-check phase is shifted by half its interval to reduce overlap with target-search/forward-scan phases.
- `BattleWave` avoids resetting banner local position to `(0,0,0)` when it is already there.
- `HealthBar3D` avoids reapplying identical color and avoids setting `renderer.enabled` when the state is unchanged.
- `BlueUnit.prefab` / `RedUnit.prefab` currently have `visualThreshold = 0.1` from Inspector tuning. Treat this as an accepted tuning value unless the user changes it.

Rejected/reverted today:

- Do not resurrect the attempted render/shader flag optimization from today. It caused banner/healthbar sort or disappearance issues.
- In particular, do not casually change healthbar/banner depth state, render priority, material state, shadow receiving flags, or shader precision again unless the user explicitly asks and there is a focused verification plan.
- Current `HealthBar.effect` and `UnlitBillboard.effect` should be treated as restored to the accepted high-precision/functionally stable path.

## Accepted 2026-07-08 Home Changes

These changes were made after receiving the 2026-07-07 office handoff:

- `Unit.ts` now guards repeated writes to agent runtime state:
  - `setAgentLocked()`;
  - `setAgentOnForward()`;
  - `setAgentPrefVelocity()`;
  - `setAgentStopped()`;
  - `zeroAgentVelocity()`.
- These guards replace repeated direct writes to `agent.locked`, `agent.onForward`, zero velocity, and identical `setPrefVelocity()` calls across dead, steady, busy, forward, chase, hero-guard, freehunt, and despawn paths.
- This is intended as a small hot-path cleanup only. It must not change movement/combat rules.
- `Unit.ts` now caches visual yaw:
  - `visualYawCache`;
  - `visualYawCacheValid`;
  - `refreshVisualYawCache()`;
  - `getVisualEulerY()` reads the cache after it is initialized;
  - `setVisualYaw()` updates the cache when applying rotation.
- The yaw cache reduced `getVisualEulerY()` profile cost in the slowdown trace, but did not significantly improve total frame time because total `Unit` cost is small compared with full frame cost.
- Unit counts in `assets/Test.scene` were temporarily halved for a scaling test. Current serialized state is `5` for both `light_archer` entries and `10` for the other eight troop entries. Trust the scene/database Inspector if the user retunes these values later.

Rejected/reverted on 2026-07-08:

- Far/topdown rotation snap was tested and then removed.
- Do not reintroduce `Far Facing Snap Step`, `shouldUseLowDetailUnitFacing()`, `shouldSnapFacingYaw()`, or `snapYaw()` unless the user explicitly asks.
- Unit rotation should remain smooth through `lerpAngle()` as before.
- Animation FPS LOD was not implemented. The user allowed lower animation FPS but explicitly said not to disable `SkeletalAnimation`. Cocos' safe public path is mainly pause/resume/stop or playback speed; changing speed alters animation timing, and pause plus manual sample is too risky for blend/event/baked animation without a focused experiment.

## Accepted 2026-07-08 Office Changes

These are the accepted current changes from the office session after receiving the home handoff:

- `GameManager` can show the built-in Cocos profiler overlay in preview/build:
  - Inspector: `showCocosProfilerStats`;
  - URL query when allowed: `?stats=1`, `?profiler=1`, or `?showStats=1`;
  - `?stats=0` / equivalent false values hide it.
- The office SmartArmyBrain priority/coverage implementation was superseded by the accepted 2026-07-09 home changes below.
- `SmartArmyBrain.fastReactCounterChance` is available:
  - listens for newly spawned enemy waves;
  - only runs after `minSpawnInterval` has elapsed and the chance roll passes;
  - respects max alive wave limit and affordability;
  - only reacts to the newly spawned enemy wave, not any arbitrary older target;
  - if it spawns, it resets the normal timer/random interval to avoid immediate double-spawn pressure.
- Counter aggressive-forward rule:
  - if SmartArmyBrain chooses to counter on the enemy target's lane and the path from spawn to that target has ally blockers, the counter wave spawns with `aggressiveForward = true`;
  - if that target lane is clean with no ally blockers, same-lane counter also spawns aggressive;
  - other cases fall back to the existing `shouldSpawnAggressiveForward()` / opening-phase behavior.
- The office scale-tween banner transfer was superseded by the accepted immediate transfer on 2026-07-09.

Rejected/reverted in the office session:

- Lane-biased ally overtake was tested and removed.
- Do not assume left/right lane overtake is forced to one side. Current RVO overtake behavior is back to the previous local-clearance/side-lock/seed logic for all lanes.
- No `overtakePreferredSide` field or worker-buffer stride change should exist in the accepted source.

## Accepted 2026-07-09 Home Changes

### SmartArmyBrain Snapshot And Coverage

- Removed historical counter assignment state from `BattleWave`:
  - no `assignedCounterCount`;
  - no `addCounterAssignment()`;
  - no `getCounterCoverageRatio()` / `isCounterCovered()`.
- SmartArmyBrain calculates response coverage from the current battlefield only when `rebuildIntel()` runs. This does not add a per-frame scan.
- A same-lane ally wave contributes live coverage only when it matches the currently best available response tier (or a better tier) and is currently relevant to that enemy:
  - if units already have targets, only units targeting that specific enemy wave count;
  - if the wave has no target, its alive units count only toward the first enemy wave ahead;
  - if it is chasing another enemy, it does not cover this target.
- Dead, depleted, redirected, or lane-shifted responses stop contributing automatically on the next intel rebuild.
- A struggling response means a relevant response wave at or below `rescueAllyAliveRatio`:
  - either it has units targeting that enemy;
  - or it has no target and that enemy is the first one ahead.

### SmartArmyBrain Reachability And Priority

- Response target eligibility is front-to-back per lane:
  - only the first enemy wave on the path from this team's spawn can be selected for a new direct response;
  - this applies even when ally waves already occupy or block the lane;
  - a rear enemy becomes eligible after the front enemy dies, leaves the lane, or is otherwise no longer first.
- This prevents an invalid visual/tactical decision such as spawning cavalry for a rear archer while an enemy spear wave physically stands in front and will intercept the cavalry first.
- Among eligible front enemies, proximity to this team's hero/defend point is the primary threat weight.
- Unengaged state, clean path, one-blocker path, live coverage, alive ratio, and struggling-counter state are secondary weights.
- The front-enemy eligibility guard applies to both normal interval decisions and `fastReactCounterChance`.

### SmartArmyBrain Anti-Over-Counter

- Reinforcement is size-aware and uses the existing live snapshot:
  - zero live coverage always permits the first available response wave, including against a small enemy wave;
  - after coverage exists, another full wave is eligible only if adding its `unitCount` moves projected coverage closer to `attackCounterCoverageRatio`;
  - a relevant counter below `rescueAllyAliveRatio` may still receive emergency reinforcement.
- This guard runs before `decisionAccuracy` randomness. Low-accuracy AI cannot repeatedly use an already-covered enemy as a spawn trigger.
- Do not simplify this back to `coverage < attackCounterCoverageRatio`: a tiny deficit must not spawn an entire extra wave when the resulting overshoot is worse than waiting.
- `decisionAccuracy` controls whether a complete spawn decision is intelligent or follows the low-accuracy deliberate/random branches. In current `assets/Test.scene`, SmartArmyBrainB may serialize at `0.1` and SmartArmyBrainA at `1`, but an enabled `LevelSettings` can override BrainB at runtime.

### SmartArmyBrain Opening Max And LevelSettings

- SmartArmyBrain now handles its own `battle-wave-spawned` event to update `hasReachedMaxAliveWavesOnce` immediately.
- This prevents missing the opening-aggressive cutoff when the max-th wave appears but another wave dies before the next AI interval.
- Enemy-wave fast react still obeys minimum interval, chance, max-alive-wave, unlock, affordability, reachability, and response-coverage gates.
- `LevelSettings` now supports optional min/max scaling for `fastReactCounterChance`; the default maximum is `1`.

### Immediate Wave Banner Transfer

- Banner holder transfer no longer uses any tween:
  - the existing banner reparents immediately to the replacement representative holder;
  - local position is reset to `(0,0,0)`;
  - cached base scale is restored in the same update.
- Removed obsolete transfer machinery:
  - `Tween` / `tween` imports from `BattleWave`;
  - `waveBannerTransferTarget`;
  - `waveBannerTweenDuration` from `BattleWave`, `GameManager`, and `assets/Test.scene`;
  - scale-out/scale-in and detached transfer state.
- Holder selection, holder-death notification, banner pooling, icon/material refresh, healthbar refresh, and camera visibility behavior are unchanged.
- Do not reintroduce flight or scale tween unless the user explicitly asks. The accepted visual is immediate teleport to the new holder.

## Accepted 2026-07-09 Office Changes

### SmartArmyBrain Path Priority

- Counter target eligibility remains front-to-back per lane.
- "Near the hero" emergency priority is now gated by travel progress:
  - `DangerousThreatProgress = 0.75`;
  - progress is measured from the enemy team's spawn Z to this team's current hero/defend Z;
  - only enemy waves at or beyond `75%` progress are treated as true near-defend threats;
  - before that threshold, the AI may still counter, but it must not let "closest enemy relative to hero" behave like an emergency override.
- Among true near-defend threats, a target that is more than `2` world units closer to the defending hero remains the higher-priority threat.
- When eligible true near-defend targets are within `2` world units of each other, counter path quality is compared before the old weighted threat score:
  - zero ally blockers from spawn to target;
  - then exactly one blocker;
  - then multiple blockers.
- A clean counter path is based only on allies between spawn and the target. An ally farther beyond the target no longer makes that path look blocked.
- If no eligible target has reached the `75%` progress threshold, all eligible front targets compete mainly by path quality, coverage/struggling state, alive ratio, and engagement state instead of emergency proximity.
- This adds no Inspector setting and does not change affordability, coverage, fast-react, max-wave, unit-choice, lane-choice, or aggressive-forward gates.

### SmartArmyBrain Decision Accuracy

- Each normal spawn opportunity rolls `decisionAccuracy` once.
- An accurate decision:
  - rebuilds battlefield intel;
  - chooses the best reachable target using defend distance and path priority;
  - chooses the best available response entry;
  - chooses the target lane.
- An inaccurate decision does not rebuild or use tactical intel:
  - it rolls deliberate mistake with conditional chance `1 - decisionAccuracy`;
  - a deliberate mistake uses current intel and randomly chooses among affordable non-winning matchups (losing or neutral) against a front enemy that is not already being handled by an ally wave;
  - deliberate mistakes spawn on a random lane with normal forward, not always on the target lane, to reduce repeated low-accuracy responses piling onto one enemy;
  - when both choices exist, deliberate mistakes choose a genuinely losing matchup `80%` of the time and a neutral matchup `20%` of the time; this keeps low-accuracy AI weak without locking both teams into one deterministic counter pair;
  - do not select the single mathematically worst matchup every time; that deterministic extreme caused both teams to repeat one counter pair indefinitely.
  - if no losing/neutral matchup exists, it chooses the weakest available affordable matchup before falling back to random;
  - the remaining inaccurate decisions choose a random affordable entry, random lane, and roll aggressive-forward only from `aggressiveForwardChance`.
- Therefore `decisionAccuracy = 0` attempts a deliberate mistake every normal spawn decision, and should only log `NAIVE_RANDOM` when there is no valid front target / no usable mistake candidate.
- Approximate behavior probabilities are:
  - smart: `accuracy`;
  - deliberate mistake attempt: `(1 - accuracy)^2`;
  - random branch: `accuracy * (1 - accuracy)`, plus rare fallback when no deliberate mistake candidate exists.
- Fast react is an intelligent reaction:
  - it only proceeds when its `decisionAccuracy` roll succeeds;
  - if it proceeds, the newly spawned enemy remains its fixed reaction target and the AI chooses the best counter on the target lane;
  - at `decisionAccuracy = 0`, fast react cannot occur.
- Hard global gates remain independent of intelligence: affordability, max alive waves, and spawn timing are still enforced for naive decisions. Tactical gates such as reachability, coverage, and nearly-dead filtering apply only to intelligent counter decisions.
- `LevelSettings.allowDecisionAccuracy` continues to scale this same `0..1` value; its Inspector tooltip now reflects deliberate mistakes at the low end.
- `LevelSettings.decisionAccuracyMin` now defaults to `0.1` rather than `0`. The tested `0.1` result keeps the first-level AI very weak while avoiding the deterministic troop loop seen at exact zero.
- The curve remains linear across campaign levels and is clamped to `0..1`; no extra curve knob was added.
- LevelSettings spawn-delay fields keep their serialized names but use clearer Inspector labels and ordering: `Easy Spawn Delay Min/Max`, then `Hard Spawn Delay Min/Max`.

### Unit Unlock And Emergency Response

- Every `UnitPrefabEntry` now owns an `unlocked` boolean, defaulting to `true`.
- `BattleUnitDatabase` is the source of truth for unlock state. `GameManager.isValidSpawnEntry()` enforces it for affordability queries, AI/player selection, auto spawn, direct entry/name spawn, formation spawn, prefab-map setup, and prewarm.
- Locked entries are excluded from prewarm and spawn selection. Existing pooled/spawned units are not retroactively removed.
- Player unit icons inherit the existing unavailable tint because `canAffordUnitName()` now rejects locked entries. Tapping a locked icon is ignored with a warning and cannot leave a false selected highlight. No separate lock-icon UX was added.
- SmartArmyBrain accurate-response tiers are:
  - real unlocked/affordable counter;
  - otherwise random unlocked/affordable troop.
- The random fallback is still a response tier and uses the same coverage/overshoot gates, so it should not repeatedly pile extra waves onto an already handled target.
- There is no Stronger/SameType fallback in the accepted source. It was tested and rejected because "stronger" often selected cavalry, which then fed spear counters and made max-AI decisions worse.
- Hero waves remain excluded from troop counter/emergency-response selection.
- Fast react and normal interval decisions use the same response-tier logic.
- Live coverage uses the currently best available tier and accepts a living response of equal or better quality. This prevents CP/unlock changes from making the AI forget a better response already on the field.
- Coverage relation, front-enemy reachability, struggling-response rescue, and size-aware overshoot protection remain unchanged.
- `CounterSettings.getCounterScore()` must match actual damage calculation and therefore uses `damageMultiplier * receivedDamageMultiplier`. The old inverse formula incorrectly classified reduced outgoing damage as a favorable counter.

### Accepted AI Non-Issues

- A fully intelligent AI may intentionally wait when no spawn would improve the current response/coverage situation. Do not add a mandatory random fallback merely to keep CP spending equal.
- Exact `decisionAccuracy = 0` can repeat troop choices because the counter graph has few deliberately losing options. This is accepted; campaign level 1 starts at `0.1` for variation.
- Difficulty is intentionally influenced by accuracy, fast react, spawn interval, max waves, CP, and aggressive chance together.
- The current project does not use defensive counter rules. Do not reopen defensive-rule interpretation unless such rules are added again.

## Current Unit / Wave Flow

### Forward

- Waves spawn into forward mode.
- Normal forward uses a wave scanner, usually the representative/front unit.
- Scanner refresh is throttled by the wave/unit target-search interval.
- Scanner target selection must scan candidates in range and choose a target that already satisfies lane + passed-forward release rules. Do not revert it to "nearest enemy first, then reject" because one invalid nearest enemy can hide a valid same/adjacent-lane release target.
- Normal forward can release the whole wave to freehunt/combat when:
  - scanner passes a same-lane target along forward direction;
  - scanner passes an adjacent-lane target along forward direction;
  - scanner reaches/passes enemy hero line and finds the enemy hero;
  - attack-range contact or retaliation starts combat.
- There is a same-lane initial-forward combat gate:
  - release from first same-lane contact can wait until enough units are engaged;
  - threshold is based on the unit entry's `maxUnitPerRow`;
  - non-busy units paused by this gate can be returned to forward by `refreshInitialForwardCombatGate()`.

### Aggressive Forward

- Aggressive forward is lane-committed.
- It ignores ordinary adjacent-lane unit pass/release.
- It still releases through:
  - same-lane passed target;
  - same-lane attack-range contact;
  - enemy hero line;
  - adjacent-lane enemy hero special case.
- While a unit is still in aggressive forward, its own attack-range acquisition is lane-locked:
  - a ranged unit such as an archer must not cancel aggressive forward just because a different-lane enemy entered its weapon range;
  - normal forward still uses the normal same/adjacent-lane scanner release rules;
  - this is filtered in `Unit.isValidEnemyWithinAttackRange()`, so cached attack-range targets cannot bypass it.
- Adjacent-lane retaliation during aggressive forward is a deliberate solo exception:
  - the unit that is hit may leave forward and fight alone;
  - the rest of the wave stays in aggressive forward;
  - "adjacent/different lane" for this solo exception is based on each unit's current X position mapped to the nearest lane, not only the wave's dynamic `laneId`;
  - ranged/off-range retaliation is also a solo exception: if the attacker can damage the unit while still outside that unit's own effective attack range, the damaged unit peels off to chase alone;
  - once that solo unit has no busy/target state, it resumes normal forward, not aggressive forward;
  - this exception must not be applied to normal forward.
- When the whole wave leaves forward for same-lane freehunt/combat, aggressive-forward mode is cleared only for that wave-level release. Later wave recovery is normal forward.

### Freehunt / Combat

- Any real attack-range contact can push involved waves into freehunt/combat.
- `Unit.attackRange` means weapon reach from body edge, not center-to-center distance.
- Effective combat contact range is `self.radius + enemy.radius + attackRange`.
- `BattleSpatialGrid` tracks max unit radius per team so unit attack queries can get a broad candidate set and then filter by exact effective range.
- A unit with no target can borrow a valid target from a teammate in the same wave.
- Target refs must respect pooled-unit validity/life-id checks.
- Freehunt returns to forward only when every alive unit in the wave:
  - is not busy;
  - has no valid enemy target;
  - has confirmed no target from the latest target-search cycle.
- If any alive unit is busy, still has a target, or has not confirmed no target yet, the wave should not resume forward.
- Waiting for target/search state to clear is intentional and should not be treated as a bug by itself.
- After the wave is allowed to leave freehunt/combat and resume forward, each alive unit resolves its own lane position:
  - units already inside the wave's current lane area immediately forward;
  - units outside the lane area enter a local back-to-lane phase and move sideways toward that lane at normal `maxSpeed`;
  - once a unit's center enters the lane area, it switches to forward; it does not need to return to lane center or a fixed formation slot;
  - this phase uses `GameManager` lane bounds from `battleMinX`, `battleMaxX`, and `laneCount`;
  - attack-range contact or retaliation still wins over lane return, so a unit can be pulled back into combat while returning;
  - dynamic lane voting is temporarily held while any unit in the wave is still in this back-to-lane phase, preventing laneId from changing under the returning units.
- Before `tryResumeForward()` actually switches a wave out of freehunt, it forces one dynamic lane refresh. This prevents a stale `laneId` from making units walk horizontally toward an old lane after combat.
- This is intentionally not old regroup-to-slot: there is no whole-wave wait, no slot assignment, and no forced center-line formation.

### Dynamic Lane

- Lane ID is strategic metadata for SmartArmyBrain and display logic, not a regroup command.
- Dynamic lane is based on alive unit positions / majority lane logic.
- Dynamic lane uses simulation `agent.pos.x` when available, with node world X only as fallback.
- Ties prefer current lane; otherwise closest lane to average X wins.
- Dynamic lane voting skips waves that currently have any unit in the back-to-lane phase. The laneId chosen before forward recovery must stay stable until those units finish returning.
- Lane voting is main-thread and has not been proven to be a bottleneck.

## Hero Rules

- Hero uses `Unit` / `UnitBehavior`, but is a special entity:
  - not a troop type for counter rules;
  - not a normal minimap/wave icon target;
  - hero-vs-anything damage ignores `CounterSettings`;
  - kills involving hero are not counter kills.
- Before unlock, steady hero guards around home.
- Steady hero can keep a valid retaliation target even when attacker is outside guard zone, so ranged attackers cannot safely shoot it forever.
- Hero guard uses the same edge-based attack range as normal units.
- Hero phase no longer forces full-map/permanent freehunt.
- When unlocked, hero behaves like a one-unit mid-lane forward wave and uses normal forward/freehunt rules.

## SmartArmyBrain

- `SmartArmyBrain` decides spawn strategy only. It does not directly control unit movement, combat, forward/freehunt, lane voting, workers, RVO, banners, or healthbars after spawn.
- It runs on a spawn interval.
- It builds lane intel and enemy-wave intel from current alive waves.
- Response coverage is live snapshot data, not historical assignment data. Do not restore `assignedCounterCount`, `addCounterAssignment()`, or `getCounterCoverageRatio()` on `BattleWave`.
- One response wave cannot cover every enemy lined up in the same lane:
  - if its units have targets, only units targeting that specific enemy count;
  - if it has no targets, it covers only the first enemy ahead.
- It scores threats using response coverage, alive ratio, distance to own hero/spawn, engagement/free status, clean-path priority, ally blockers from spawn to target, and whether same-lane ally responses look like they are failing.
- It prefers uncovered enemy waves with the best currently unlocked and affordable response tier:
  - real counter if any affordable unlocked counter exists;
  - otherwise random affordable fallback.
  - There is no accepted same-type or stronger emergency tier.
- Target reachability is resolved before threat score: a rear wave cannot win priority while another enemy wave stands between it and this team's spawn on the same lane.
- A fully covered wave is not a new response candidate unless its relevant response pressure is visibly failing.
- Snapshot/intel rebuild is not the same thing as deciding to spawn:
  - normal AI only decides/spawns when its timer reaches `nextInterval`;
  - fast react only decides/spawns when a new enemy wave event arrives, `minSpawnInterval` is satisfied, the chance roll passes, and all spawn gates pass;
  - rebuilding intel is just "looking at the board", not automatically "pressing spawn".
- `decisionAccuracy` is the main combined knob for counter correctness and lane correctness:
  - `1` means best available response and best reachable lane;
  - lower values increasingly use deliberate non-winning matchups and random choices according to the probability model documented above.
- `fastReactCounterChance` is a separate reaction-speed knob:
  - higher values make the AI more likely to answer a newly spawned enemy immediately after min interval;
  - it also requires an accurate `decisionAccuracy` roll and must not ignore max-wave, unlock, or affordability gates.
- `enableDecisionStats` is an optional runtime telemetry switch:
  - disabled by default;
  - when enabled, it logs actual-match counts for aggressive spawns, normal spawns, intentional waits, and hard skips;
  - percentages use `aggressive + normal + wait` as the denominator, while hard skips are reported separately because max-wave / no-CP gates are not tactical wait decisions;
  - use this to measure one concrete playtest instead of guessing theoretical probabilities.
- Opening aggressive rule:
  - SmartArmyBrain tracks whether its team has ever reached `maxAliveWaves`;
  - before first reaching max alive waves, response/opening spawns use aggressive forward;
  - after that, response/opening spawns use normal forward;
  - if max-alive limit is off, opening aggressive phase is considered already complete.
- Response aggressive-forward detail:
  - if the chosen response lane is the target enemy's lane and at least one ally wave blocks the route from spawn to target, the spawn is aggressive forward;
  - if the chosen response lane is the target enemy's lane and the lane is fully clean (`allyCountInLane <= 0` and `allyBlockersFromSpawn <= 0`), the spawn is also aggressive forward;
  - if there are allies in the same lane but none between spawn and target, the spawn falls back to normal `shouldSpawnAggressiveForward()` opening-phase behavior;
  - this is intentional so responses spawned into a lane with ally traffic can still push through instead of behaving like a slow normal-forward support wave.
- Response coverage remains a candidate gate, but it is recalculated from living/currently relevant responses at every intel rebuild. A dead, redirected, or no-longer-relevant response cannot permanently suppress reinforcement.
- Do not replace the size-aware reinforcement check with a simple `coverage < required` test. A tiny coverage deficit must not spawn an entire extra wave when that would overshoot the requested ratio more than waiting.
- Avoid reintroducing separate "max blockers", "max lane traffic", or "deferred target cooldown" knobs unless the user explicitly asks.

## Player Controller / Bottom UI

- `PlayerArmyController` supports Inspector-driven lane picker and unit icon mapping.
- Current UX is unit-first, lane-second:
  - tap a unit icon to select unit type;
  - lane icons are hidden until selected unit type is currently affordable;
  - tap a lane icon to spawn selected unit on that lane;
  - double tap same lane within `doubleTapWindow` to spawn aggressive forward.
- Unit icons use a static `selected` child highlight.
- Affordability/cooldown/max-wave blocking is shown by tinting unit icon root black 50%.
- Lane `selected` child highlights are intentionally disabled for now because they made bottom UI noisy.
- After successful player spawn, lane picker container is hidden and selected unit icon is cleared.
- During cooldown, unit selection is allowed, but lane icons are blocked/tinted.
- Player spawn cooldown drives `power-bar-container/bar` width.
- Player also has `maxAliveWaves`.
- Use existing `GameManager` helpers for affordability and alive-wave count. Do not duplicate database/CP scans in UI.

## Banner / Wave Healthbar

Current accepted banner direction:

- One banner prefab can be shared by all troop types.
- `BattleUnitDatabase.waveBannerMaterial` is a shared material for troop banners.
- Each `UnitPrefabEntry` has `waveBannerIconId`.
- `UnlitBillboard.effect` supports an icon sheet:
  - shared `mainTexture`;
  - `sheetColumns`;
  - `sheetRows`;
  - per-instance icon id through instanced attribute;
  - per-instance background/team color through instanced attribute.
- `GameManager.applyWaveBannerAppearance()` applies the shared banner material and instanced icon/background data only to banner icon renderers.
- `GameManager.getWaveBannerRenderers()` intentionally skips child renderers with `HealthBar3D`, so the wave healthbar material is not replaced by the banner icon material.
- `Banner.prefab` currently has:
  - root `Banner`;
  - child `Banner` for icon;
  - child `Healthbar` using `HealthBar3D`.
- `BattleWave` caches runtime health:
  - `runtimeHealthFrame`;
  - `runtimeHealthRatio`;
  - `totalMaxHealth`;
  - `getRuntimeHealthRatio(frame)`;
  - `invalidateRuntimeHealth()`.
- `GameManager.updateWaveBannerHealthBar(wave)` updates the banner's `HealthBar3D` from wave total health.
- `notifyUnitWillDespawn()` invalidates and refreshes wave health before unit pooling.

Banner holder/lifecycle:

- `BattleWave` owns one representative holder and one optional wave banner node.
- Representative holder is picked from alive units near wave centroid and kept stable while alive/valid.
- Holder death/despawn is event-assisted so the banner should not stay on pooled inactive units.
- Holder transfer is immediate:
  - old holder invalid -> select the replacement representative;
  - reparent the existing banner directly to the replacement holder;
  - reset local position to `(0,0,0)` and restore cached base scale in the same update.
- There is no flight tween, scale tween, detached transfer phase, or transfer-in-progress guard.
- `waveBannerTweenDuration` is obsolete and should not be restored to `BattleWave`, `GameManager`, or scene serialization.
- Banner node is pooled by `GameManager`.
- `waveBannerRefreshIntervalFrames` defaults to `12` and only throttles the safety sweep over `wave.refreshWaveBanner()`.
- Camera-driven banner visibility is no longer checked every frame:
  - `GameManager.waveBannerVisibleByCamera` is the source-of-truth snapshot.
  - orbit mode changes it through `battle-camera-banner-visibility-blocked`;
  - topdown zoom changes it through `battle-camera-topdown-zoom-range-changed`;
  - `GameManager.processWaveBanners()` resolves camera visibility only when dirty or on the `waveBannerRefreshIntervalFrames` fallback.

Unit healthbar / banner swap:

- Zoom far / topdown: wave banner group is visible; unit healthbars are hidden.
- Zoom near / orbit: wave banner group is hidden; unit healthbars may show.
- Unit healthbars show only for units whose health is below full.
- `UnitProps.takeDamage()` / `heal()` update health ratio immediately.
- Unit healthbar visibility refreshes through each unit's `targetSearchIntervalFrames`, not every frame.
- `HealthBar3D` has no `update()` and only changes renderer/instanced attributes via `setHealthRatio()` or `setDisplayActive()`.
- `HealthBar3D.hideWhenFull` remains useful as a local renderer guard.

Why the old 2026-07-06 zoom/unit-healthbar attempt failed:

- It mixed wave banner lifecycle and per-unit healthbar lifecycle too tightly.
- It treated camera zoom as a broad per-frame controller instead of a stable snapshot/dirty source of truth.
- It touched banner attach/reparent/tween/material/icon state while banners were being pooled and moved between holders, causing flicker, icon id reset, and banner lag.
- It did not define a narrow display rule, so too many unit healthbars appeared.
- It created/used parallel state names such as `unitHealthBarsVisibleByCamera`, `setUnitHealthBarsVisible`, `applyCurrentUnitHealthBarVisibility`, `applyUnitHealthBarVisibility`, `setVisibilityAllowed`, and `visibilityAllowed`.

Why the current approach works:

- Banner remains owned by `BattleWave`; unit healthbar remains owned by `UnitProps` / `HealthBar3D`.
- `GameManager.waveBannerVisibleByCamera` is the one camera visibility snapshot used by both banner and unit healthbars.
- Camera changes are event/dirty driven, with interval fallback, not per-frame polling.
- Unit healthbar visibility reuses `targetSearchIntervalFrames` instead of introducing a new throttle.
- Health ratio updates are event-driven by damage/heal.
- Renderer/material work stays instanced and local; no banner material is applied to healthbar renderers.

## RVO / Local Avoidance

- RVO remains local avoidance plus steering, not long-range pathfinding.
- The 2026-07-12 rear-wave bypass / edge-sidestep experiments were tested and rejected:
  - it initially helped some rear waves pass a slower ally wave;
  - in denser battles it caused unnecessary diagonal movement toward ally waves in other lanes;
  - later edge-marker versions still made waves split or sidestep too early and made lane/back-to-lane symptoms harder to read;
  - accepted behavior is to keep normal RVO/local ally overtake only.
  - Do not restore `processWaveForwardBypasses`, `forwardBypass*`, `forwardEdgeSidestep*`, wave-level blocker edge scans, or forward velocity bias in `Unit.updateForwardPrefVelocity()` without an explicit new experiment.
- Ally overtake is proactive:
  - only for movable `onForward` agents with `enableAllyOvertake`;
  - considers same-team blockers ahead when blocked/locked/not-forward/too slow for several steps;
  - uses local clearance from neighbor list to choose side;
  - uses side locks/hold frames to reduce jitter.
- The `passedRadius` pass-through experiment was rejected and reversed because waves could still visually dodge/lane around blockers through overtake behavior. Do not restore `passedRadius` or RVO-agent `waveId` for this problem.
- `canBePush` is the current accepted blocker-pressure experiment:
  - `UnitPrefabEntry.canBePush` defaults to `false`;
  - `Unit.canBePush` is copied from the database when spawning/reusing units;
  - RVO agents carry `canBePush`;
  - hard separation treats a locked/busy unit with `canBePush = true` as movable, so other units can physically shove it aside;
  - velocity movement, target selection, combat busy state, attack range, normal radius, obstacles, and bounds are otherwise unchanged.
- Aggressive-forward solo retaliation fix:
  - when a forward/aggressive unit is hit by a different-lane ranged attacker, `reactToAttacker()` can set a solo retaliation target without releasing the whole wave;
  - `BattleWave.refreshInitialForwardCombatGate()` must not force a unit with a valid target or active solo-aggressive skirmish back into forward, otherwise the unit appears to ignore arrows and keep marching.
- Ally overtake currently may choose either side on any lane. The attempted lane-biased left/right-only overtake and the attempted lane-center-biased side choice were both reverted because they did not feel good enough in testing.
- Worker and fallback logic must stay mirrored:
  - `assets/scripts/rvo/RVO.ts`;
  - `assets/scripts/rvo/RVOWorkerSimulator.ts` embedded worker source.
- Unit visual facing prefers actual `agent.vel` only when it is large enough and the visual node has actually moved enough; otherwise it falls back to `prefVel`.

## Pooling / Packed Wave Ideas

Pooling status from 2026-07-08 source review:

- Inactive pooled unit nodes should not run `Component.update()` and should not render.
- Current despawn path is broadly correct:
  - `UnitSpawner.despawnUnit()` removes the agent from the simulator;
  - `Unit.resetForDespawn()` clears target/runtime references and sets `agent = null`, `sim = null`;
  - `GameManager.despawnUnit()` removes normal units from `teamA` / `teamB`;
  - `BattleSpatialGrid` skips inactive units with `!node.activeInHierarchy`.
- Therefore pooled inactive units should mainly cost resident memory, not ongoing logic/RVO/grid/render work.
- Still watch for global listeners, schedules, tweens, or newly added components on pooled prefabs; those can create hidden cost if not cleared.

Packed forward idea discussed but not implemented:

- User suggested grouping a freshly spawned forward wave under the scanner/front unit while all units share one direction, then unpacking when the scanner engages or triggers forward-release.
- Simple reparenting alone is unlikely to give a large win if child units remain active full visual units, because renderers/animation/child world transforms still exist.
- A safer first experiment would be "sleep follower logic during initial forward":
  - scanner remains the only active logic/scanner/RVO agent;
  - followers keep visual positions or cheap visual following;
  - followers do not run target search, attack checks, or RVO until unpack;
  - unpack restores world positions, RVO agents, target state, and normal wave logic.
- This would mostly reduce gameplay/RVO cost. If trace barely improves, the real target is active renderer/animation/object count.
- A stronger but more intrusive direction is a packed-wave visual proxy during initial forward, then spawning/unpacking real unit visuals only near combat. This changes visual/game feel and needs explicit user approval.

## Unity WebGL Port Discussion

- Do not assume a Unity WebGL rewrite automatically solves the current performance problem.
- If ported with the same architecture, it may have the same or worse issues:
  - one unit equals one `GameObject`;
  - each unit has `MonoBehaviour.Update`;
  - each unit has its own `Animator` / `SkinnedMeshRenderer`;
  - object-per-unit combat/targeting remains active.
- Unity Web/mobile browser still has WebGL/WebAssembly/browser memory constraints.
- Unity can be a better target only if the rewrite changes architecture:
  - data-oriented simulation rather than per-unit update scripts;
  - instanced/batched rendering from the start;
  - fewer active `Animator` / `SkinnedMeshRenderer` objects;
  - packed-wave or proxy visuals before combat;
  - careful WebAssembly memory/GC setup.
- In short: the useful pivot is not "Cocos vs Unity" alone, but "object-per-unit architecture vs data-oriented/instanced/packed architecture".

## Performance Notes

Global rules:

- Mobile browser performance is a core design constraint.
- Avoid optimistic desktop/editor-preview conclusions.
- Check frame pacing, GPU/render, main thread, worker CPU, and worker heap.
- When comparing traces, separate normal/no-throttle captures from DevTools CPU slowdown captures. Slowdown 4x reports must only be compared against other slowdown 4x reports, not raw normal traces.
- If trace conditions are unclear, mark the comparison as uncertain and avoid strong conclusions.
- Before adding a new throttle/snapshot/scan/knob, first check whether an existing helper/cache/gate already answers the question.
- Avoid per-frame logic whenever possible. Prefer event, dirty flag, existing interval, or existing snapshot/cache. Per-frame work should be reserved for movement, camera smoothing, animation, and other behavior that visually requires continuous updates.
- The local `cocos-performance-optimize-skills` includes the project rule to avoid new per-frame polling/parallel state when existing event, dirty flag, interval, snapshot, or wave-level truth can be reused.
- Keep debug logs behind Inspector toggles.

Current known render conclusions:

- Recent tests replacing high-poly unit mesh with capsule/cube did not produce a major win.
- Therefore vertex count alone is not the current proven bottleneck.
- Reducing Node transform writes can still help render-side cost because Cocos must sync transform/render data when nodes are marked dirty. The accepted optimizations are small guards around camera transform/FOV, forward-facing rotation, busy locked sync, banner local position, and healthbar renderer/color setters.
- Extra active cameras are a real render cost. Re-check camera components before comparing traces.
- Unit body rendering appears to batch/instance reasonably by team/material in current captures.
- Wave banner icon sheet/shared-material path is the current accepted direction for banner batching.
- `bufferData` seen in Spector is mostly dynamic/UBO-style engine data, not proof that cube mesh vertices are the bottleneck.
- Only two skinned meshes are expected for heroes in the recent cube tests; do not blame "many skinned meshes" unless re-verified.
- UI/minimap should not be blamed in traces where minimap/healthbar/banner were explicitly disabled.
- Camera-driven banner/unit-healthbar visibility now uses the snapshot/dirty path described in `Banner / Wave Healthbar`. Do not reintroduce per-frame camera polling for this.
- Frame-interval work should stay staggered:
  - RVO and spatial-grid rebuild already use different frame offsets.
  - Unit attack/search/healthbar checks use each unit's randomized `updateOffset`.
  - Wave forward scan uses `wave.id` as phase.
  - Dynamic lane voting intentionally uses `wave.id + floor(interval / 2)` so the same wave does not scan forward and vote lane on the same frame.
  - Wave banner holder/health refresh is staggered per wave id instead of refreshing every wave in one banner frame.

Rejected render direction from 2026-07-07:

- The attempted "item 4" render/shader cleanup changed render/material-related state and repeatedly broke banner/healthbar rendering or sort order. It was reversed.
- Do not use that failed attempt as a starting point. If render-state optimization is revisited, isolate one flag/material/shader change at a time and verify banner icon, wave healthbar, unit healthbar, orbit/topdown visibility, and Spector draw behavior.

Recent trace interpretation to preserve:

- Workers were not the proven main bottleneck in the 2026-07-06 traces.
- Watch worker heap lower envelope in longer mobile-like captures; desktop V8 behavior is not proof for mobile browsers.
- Major GC remains a risk when adding VFX, damage numbers, projectiles, or heavier UI.
- For final performance judgment, compare release mobile builds on real devices.
- 2026-07-07/08 CPU slowdown 4x traces clarified several things:
  - `Trace-20260707T222045` full-unit baseline: `FireAnimationFrame` avg about `4.454ms`, p95 `11.640ms`, p99 `14.601ms`, `45` frames over `16.67ms`.
  - `Trace-20260707T235904` after write guards/yaw cache but before half-unit test: avg about `4.344ms`, p95 `10.877ms`, p99 `13.355ms`, `32` frames over `16.67ms`.
  - `Trace-20260708T001551` with all `unitCount` temporarily set to `5`: avg about `4.043ms`, p95 `10.200ms`, p99 `12.599ms`, `18` frames over `16.67ms`.
  - Halving unit count reduced `Unit` profile cost from about `97us/frame` to about `52us/frame`, nearly proportional.
  - Total frame time only improved by about `6-7%`, so per-unit gameplay logic is not the only limiting factor.
  - Do not expect reducing unit count by 50% to reduce whole-frame cost by 50%; `Unit.update` is only a small part of the total frame.
- Important interpretation correction:
  - Do not state vague conclusions like "the bottleneck is render/transform/animation/engine sync" unless the next proposed test isolates which layer is responsible.
  - Prior tests changing high-poly/skinned unit visuals to simple capsule/cube and snapping rotation did not produce a major win, so vertex count, skinning, and rotation snapping are not currently proven primary bottlenecks.
  - The current evidence says: unit logic scales with unit count, but much of the frame cost is outside `Unit.update`; the exact culprit still needs isolated tests.
- Useful next tests if performance investigation resumes:
  - Test A: keep unit count/logic, temporarily disable unit renderers only. If frame time improves strongly, renderer/object render count is the likely target.
  - Test B: keep renderers active, temporarily freeze movement/simulation after dense spawn. If frame time improves strongly, transform/movement sync is the likely target.
  - Test C: compare release build without Preview/source-map/editor/devtool overhead against Preview slowdown traces.
  - Test D: test "sleep follower logic during initial forward" without changing visuals; if it barely moves frame time, active renderer/animation object count is more important than per-unit logic.
- `Trace-20260707T180002` improved over the bad `16:32` report but is still not back to the lighter 2026-07-02/06 baseline:
  - `18:00`: avg `3.486ms`, p95 `5.832ms`, p99 `8.490ms`, `76` frames over `8.33ms`, `6` over `16.67ms`.
  - `16:32`: avg `4.171ms`, p95 `7.239ms`, p99 `9.231ms`, `116` frames over `8.33ms`, `6` over `16.67ms`.
  - Earlier 2026-07-02/06 normal traces often had avg around `1.1-1.8ms`, p95 around `1.5-4.2ms`, and very few frames over `8.33ms`.
  - Conclusion: today's accepted transform/write guards help, but the current state is still borderline for mobile-browser headroom and should not be called "done" for VFX scaling.

## LevelSettings

- `assets/scripts/LevelSettings.ts` is optional.
- If node/component is disabled, it should not affect battle logic.
- It targets `SmartArmyBrain` references while keeping serialized property name `armyBrains` for scene compatibility.
- It can scale selected team values:
  - initial CP;
  - SmartArmyBrain decision accuracy;
  - spawn intervals;
  - max alive waves;
  - aggressive-forward chance;
  - fast-react counter chance.
- `assets/Test.scene` often uses `LevelSettings` for testing. If it is enabled at `currentLevel = 300`, it overrides SmartArmyBrainB to final-level values at runtime even when the serialized SmartArmyBrainB component still shows lower values such as `decisionAccuracy = 0.1`.

## VAT / Spector

- VAT prototype files may still exist but should not be integrated into battle unless the user explicitly resumes that experiment.
- User compared VAT to the current animated/instanced path and decided to stop pursuing VAT for now.
- `SpectorDebugger` is optional profiling tooling. Keep disabled outside profiling sessions.
- Do not attribute normal performance traces to Spector unless component/node is active.

## Do Not Resurrect Without User Approval

- Old regroup-to-slot / whole-wave lane-return movement. The accepted replacement is only the lightweight per-unit back-to-lane phase after `freehunt -> forward`.
- Old permanent full-map hero freehunt.
- Old `ArmyBrain` / DefenseMode interpretation.
- Minimap as an active gameplay feature.
- VAT battle integration.
- The failed zoom-based unit healthbar/banner swap from 2026-07-06.
