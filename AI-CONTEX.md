# AI-CONTEX

Handoff note for the other Codex instance working on `BattleGame`.

Last updated: 2026-06-29.

The user runs two Codex sessions on different machines. These sessions do not share memory. Always read this file and re-check the current source before making changes. Treat this handoff as orientation, not as a substitute for source inspection.

Latest office-Codex source check after the June 29 home-Codex work:

- Current HEAD while checking: `6b3481be`.
- Source logic files are dirty after the latest office-Codex hero-phase update.
- Expected dirty source/doc files from this update:
  - `AI-CONTEX.md`;
  - `assets/scripts/BattleWave.ts`;
  - `assets/scripts/GameManager.ts`.
- June 26 office work that is now present in source:
  - minimap hot-path optimization in `TrueMiniMapPanel`;
  - `PlayerArmyController` inspector-driven lane picker and unit icon binding;
  - player spawn cooldown and power-bar fill;
  - player max-alive-wave limit;
  - selected-lane highlight by blinking the `selected` child node with `UIOpacity` tween.
- June 29 home work that is now present in source:
  - normal forward scanner releases only after passing adjacent-lane target;
  - same-lane combat still starts through attack-range contact;
  - aggressive forward ignores scanner release and stays lane-committed until real contact, retaliation, or hero line;
  - player unit icon single tap spawns normal forward after `doubleTapWindow`;
  - player unit icon double tap spawns aggressive forward;
  - hero guard distance is wired from `BattleUnitDatabase.HeroEntry.guardDistance`;
  - minimap dying-wave freeze default is `0`.
- June 29 office follow-up now present in the working tree:
  - hero phase no longer forces hero or enemy waves into full-map/permanent freehunt;
  - unlocked hero is treated as a normal mid-lane wave with one unit and enters normal forward;
  - existing enemy waves are forced back to their normal/aggressive forward mode instead of being forced to chase the hero;
  - `GameManager.heroFreeHuntSearchRange` and related hero-pressure search helpers were removed.
- No scene/prefab wiring was intentionally changed by Codex in these patches. The user should wire or verify Inspector fields in Cocos Editor.

## Working Rules

- Mobile browser performance is a core design constraint.
- Prefer small, source-local changes. Avoid growing architecture unless there is a measured reason.
- Do not revert user/editor changes unless explicitly asked.
- Do not leave permanent logs in hot paths. Debug logs must be behind inspector toggles.
- Use `rg` first for source search.
- `package.json` currently has no reliable typecheck/build script. TypeScript can be checked with the TypeScript compiler bundled with Cocos Creator by adding `--skipLibCheck --module ESNext`; Cocos Preview is still required for gameplay/visual verification.
- Project and Cocos installation paths differ between the office and home machines. Resolve paths from the current workspace/environment; never hardcode `D:\Works\Github\BattleGame` into source or shared scripts.
- Cocos may generate noisy changes under `library/` and `temp/`. Do not treat those as source logic unless the user asks.

## Current Worktree Status

- Current HEAD while writing this handoff: `6b3481be`.
- Expected dirty source/doc files from the current office update:
  - `AI-CONTEX.md`;
  - `assets/scripts/BattleWave.ts`;
  - `assets/scripts/GameManager.ts`.
- Git may print `C:\Users\CPU/.config/git/ignore: Permission denied`; this is a local git-config warning, not a project source change.
- If future `profiles/`, `library/`, or `temp/` changes appear, treat them as Cocos/editor generated unless the user explicitly asks to inspect them.
- Run `git status --short` before editing because the user may commit, reverse, or continue testing from the other machine.

## Home Codex Update On 2026-06-29

This section summarizes the work done after the user explicitly asked the
home-machine Codex to receive and continue from the other Codex handoff.

### Source Review And Scope

- Re-read the current source and this handoff before changing gameplay logic.
- Kept the work surgical:
  - no broad reverse;
  - no worker rewrite;
  - no minimap rewrite;
  - no ArmyBrain rewrite;
  - no changes to RVO/grid algorithms.
- Existing generated/editor dirty files were left alone.

### Forward/Freehunt Rule Reconciliation

Files changed:

- `assets/scripts/BattleWave.ts`
- `assets/scripts/GameManager.ts`
- `assets/scripts/Unit.ts`

Implemented current canonical behavior:

- Removed the temporary `initialForwardSearchLocked` concept.
  - Normal forward now uses the front scanner immediately after spawn and
    after recoverable freehunt/combat recovery.
  - Seeing a target is not enough to release the wave.
- Normal forward:
  - uses one cached front-most alive unit as scanner;
  - scanner refresh remains throttled by the wave's
    `targetSearchIntervalFrames`;
  - adjacent-lane target release happens only after the scanner has passed
    that target along `forwardDir`;
  - same-lane targets do not release through scanner visibility;
  - same-lane combat starts through the universal attack-range trigger.
- Aggressive forward:
  - does not use scanner-based release;
  - does not freehunt merely because an adjacent-lane enemy is visible;
  - still freehunts through attack-range contact, retaliation, and hero line.
- Universal rule preserved:
  - if any alive unit detects a valid enemy inside `attackRange` on its
    `attackCheckIntervalFrames`, both involved waves enter whole-wave
    freehunt/combat.
- `Unit.hasPassedForwardTarget(target)` was added as a narrow public wrapper
  around the existing forward-axis pass check so `GameManager` does not need
  to duplicate movement math.

Intent:

- Normal forward should avoid early diagonal lane drift just because a nearby
  adjacent-lane enemy is inside search range.
- Normal forward should still react naturally after the wave visually passes
  an adjacent-lane enemy.
- Aggressive forward should remain disciplined and lane-committed until real
  contact/retaliation/hero-line pressure.

### Player Bottom UI Update

File changed:

- `assets/scripts/PlayerArmyController.ts`

Implemented:

- Single tap/click on a unit icon spawns a normal-forward wave.
- Double tap/click on the same unit icon inside `doubleTapWindow` spawns an
  aggressive-forward wave.
- `doubleTapWindow` defaults to `0.25`.
- The first tap is held briefly until the double-tap window expires. This
  prevents spawning a normal wave first and immediately putting the controller
  on cooldown before the second tap can request aggressive forward.
- The pending tap stores the selected lane at tap time, so changing lane during
  the short double-tap window does not move the pending spawn to a different
  lane.
- Pending tap state is cleared when the controller is disabled.
- Existing public inspector method `spawnUnit(event, unitName)` remains
  compatible and spawns normal-forward.

Important UX implication:

- Single tap now has a small delay equal to `doubleTapWindow`.
- If that feels too sluggish in testing, reduce `doubleTapWindow`; do not
  spawn immediately on the first tap unless the user accepts that double-tap
  aggressive may be blocked by cooldown.

### Hero Guard And Hero Phase State

These features are present in current source and were checked/documented
during this handoff period:

- `BattleUnitDatabase.HeroEntry.guardDistance` exists.
- `GameManager` assigns `hero.heroGuardDistance` during hero registration.
- Before hero phase, a steady hero can locally guard around its
  home position instead of standing still as an archer target.
- Hero guard is local:
  - chase/fight only inside the guard zone;
  - return home and face initial yaw when the zone is clear.
- Hero phase no longer creates a permanent/freehunt-all-map exception.
- When hero phase unlocks, the hero stops being steady and enters normal
  forward as a one-unit mid-lane wave.
- Existing enemy waves are forced back to their own forward mode:
  - normal waves return to normal forward;
  - aggressive waves return to aggressive forward.
- From there, hero and enemy waves use the same forward/freehunt rules as
  ordinary waves: same-lane contact through attack range, adjacent-lane
  release only after normal-front-scanner pass, and hero-line release.

### Minimap State

Current source still contains the minimap dying-wave freeze knob:

- `TrueMiniMapPanel.freezeDyingWavePositionAliveCount = 0`

Current understanding:

- This avoids keeping dying wave icons visually stuck too long when alive
  count reaches zero.
- The minimap is not the current active focus; do not rewrite it while working
  on wave/hero gameplay unless the user explicitly returns to minimap issues.

### Performance Trace Review

Latest supplied trace reviewed:

```text
C:/Users/tranl/Downloads/Trace-20260629T005226.json.gz
```

Compared against:

```text
C:/Users/tranl/Downloads/Trace-20260627T002809.json.gz
```

Key numbers from the June 29 trace:

- `FireAnimationFrame` after excluding profiler-start outlier:
  - avg `1.492 ms`;
  - p50 `1.352 ms`;
  - p95 `3.900 ms`;
  - p99 `4.721 ms`;
  - max `15.901 ms`;
  - frames over `8.33 ms`: `10`;
  - frames over `16.67 ms`: `0`.
- Main JS heap:
  - min `48.1 MB`;
  - max `100.9 MB`;
  - last `86.4 MB`.
- DOM/listener counters:
  - documents stable at `2`;
  - nodes roughly stable around `42644-42660`;
  - listeners returned from `130` to `119`.
- RVO worker:
  - `RunTask` avg `0.478 ms`;
  - p95 `0.891 ms`;
  - max `7.304 ms`;
  - heap `0.5-2.8 MB`, last `2.2 MB`.
- Target-search worker:
  - only `69` post messages over about `92.8 s`;
  - `HandlePostMessage` avg `0.288 ms`;
  - max `0.749 ms`;
  - heap `0.46-1.05 MB`.

Interpretation:

- Performance is still within a good desktop trace budget.
- The June 29 run is slightly heavier than June 27, but not a red flag:
  - RAF avg went from about `1.21 ms` to `1.49 ms`;
  - p95 went from about `3.59 ms` to `3.90 ms`;
  - p99 remained close.
- Worker cost is not the bottleneck.
- Do not move RVO/target workers back to main thread based on this trace.
- The next likely risk area is render/UI/material/VFX, not AI target search.

### Verification Done

- TypeScript check passed with the Cocos-bundled compiler:

```text
tsc -p tsconfig.json --noEmit --skipLibCheck --module esnext
```

- `git diff --check` passed for:
  - `AI-CONTEX.md`;
  - `assets/scripts/BattleWave.ts`;
  - `assets/scripts/GameManager.ts`;
  - `assets/scripts/PlayerArmyController.ts`;
  - `assets/scripts/Unit.ts`.

Runtime status:

- The user supplied a post-change Chrome trace and it looked healthy.
- Full gameplay behavior still needs Cocos visual testing for the latest
  forward/aggressive-forward rule reconciliation.

## Important Source Files

- `assets/scripts/GameManager.ts`: battle orchestration, spawn, dynamic wave lane, hero unlock, spatial grid rebuild, RVO step.
- `assets/scripts/BattleWave.ts`: wave-wide forward/freehunt state, dynamic laneId synchronization, aggressive-forward persistence, recovery decision.
- `assets/scripts/Unit.ts`: movement, target search completion, chase, engage, retaliation targeting.
- `assets/scripts/UnitBehavior.ts`: attack interval, damage, retaliation notification, kill callback.
- `assets/scripts/BattleSpatialGrid.ts`: spatial grid, batched nearest-target worker, main-thread fallback.
- `assets/scripts/rvo/RVOWorkerSimulator.ts`: RVO worker wrapper.
- `assets/scripts/ArmyBrain.ts`: AI spawn/counter/lane/raid logic.
- `assets/scripts/TrueMiniMapPanel.ts`: current minimap.
- `assets/scripts/BattleInformationIconItem.ts`: still used by minimap icon visuals. Do not delete casually.
- `assets/scripts/SpectorDebugger.ts`: optional SpectorJS render capture helper.
- `cocos-performance-optimize-skills/SKILL.md`: project-local Cocos performance playbook.

## Current Battle Logic Snapshot

The game is a two-team lane battle with 3 lanes:

- `0 = left`
- `1 = mid`
- `2 = right`

Waves spawn into a lane and begin in normal forward or aggressive-forward mode.

### Canonical Wave State Flow

```text
Spawn -> Normal Forward/Aggressive Forward
      -> any unit enters attack-range engagement/is attacked
      -> whole-wave Free Hunt
      -> every alive unit finishes a no-target search and nobody is busy
      -> whole-wave Normal Forward/Aggressive Forward
      -> normal front scanner passes an adjacent-lane target, hero line is reached,
         or any unit enters attack-range engagement/is attacked
      -> whole-wave Free Hunt
```

This flow is the current canonical rule set. Older notes or commits describing initial forward search locks, regroup-to-lane, per-unit forward recovery, or permanent normal freehunt are obsolete. Adjacent-lane passed-target release is active again, but only for normal forward and only after the front scanner has passed the adjacent-lane target.

### Wave-Wide Invariants

- There is no regroup, formation-slot return, lane-return movement, or explicit grace timer.
- `Forward`, `Aggressive Forward`, and normal `Free Hunt` are wave-wide states.
- A unit is not allowed to continue forward alone while its wave remains in freehunt.
- A unit without a target does not advance independently along `forwardDir`.
- During freehunt, a no-target unit first borrows a valid teammate target;
  if nobody in the wave has a target, it searches on its target-search tick.
- Temporary waiting for the next target-search tick is valid design cadence and
  should not be treated as a bug by itself.
- If any alive member remains `onBusy`, owns a valid target, or has a target query still pending/not yet confirmed empty, the wave cannot resume forward.
- Normal freehunt is recoverable. There is currently no intended permanent
  hero-pressure freehunt path.
- Attack-range contact is the universal hard trigger: if any alive unit detects a valid enemy inside `attackRange` on its `attackCheckIntervalFrames`, both involved waves enter freehunt/combat together.

### Normal Forward

- During normal forward:
  - this applies both immediately after spawn and after freehunt/combat recovery;
  - only the current front-most alive unit scans for a target;
  - front-most means the alive forward unit whose position is furthest along its own `forwardDir`;
  - for the current Z-axis battlefield, team A effectively selects the greatest forward Z and team B the smallest forward Z;
  - the scanner is cached and refreshed on the wave's staggered `targetSearchIntervalFrames`;
  - search uses `targetSearchRange` and Spatial Grid when available;
  - finding a target does not automatically release the wave;
  - if the scanner's current target is in an adjacent lane, the whole wave enters freehunt only after the scanner has passed that target along `forwardDir`;
  - same-lane targets do not release through scanner search; they release through normal attack-range contact;
  - the target wave does not enter freehunt merely because it was seen. It reacts through its own scan, attack-range contact, or retaliation.
- Hero-line detection is separate from normal target search:
  - the cached front scanner checks the enemy hero line every frame;
  - reaching/passing the enemy hero position along `forwardDir` releases the whole wave into freehunt;
  - hero-line detection does not depend on laneId.

### Aggressive Forward

- During aggressive forward:
  - the wave still moves straight by `forwardDir`;
  - it does not use the normal adjacent-lane passed-target scanner release;
  - it does not release merely because a scanner sees an enemy;
  - it still enters whole-wave freehunt/combat from attack-range contact, retaliation, and hero-line detection;
  - after recoverable freehunt finishes with no target, it resumes aggressive forward rather than becoming normal forward.

### Free Hunt Targeting

- In freehunt:
  - a unit with a valid target chases it;
  - a unit without a valid target first borrows a valid target from a teammate when available;
  - only when no teammate target is available does it run its own search on `targetSearchIntervalFrames`;
  - once a valid borrowed, retaliation, or self-searched target is assigned, the unit keeps chasing it until it becomes invalid or combat logic replaces it;
  - a unit with no current target waits instead of moving forward alone;
  - async worker search is tracked as pending and cannot be mistaken for a completed no-target result.
- Shared-target behavior is intentionally also a natural regroup mechanism:
  - if only one valid enemy target exists in a wave, members that cannot find a separate target converge on that target;
  - this can make most or all of the wave focus the same target until it becomes invalid;
  - movement remains physical through max speed, facing, and RVO; there is no pull, teleport, or forced lane correction.
- Existing valid targets remain valid even after moving outside the original `targetSearchRange`; search range limits target acquisition, not continued pursuit.

### Return To Forward

- A normal wave resumes forward only when every alive member:
  - is not `onBusy`;
  - has no valid target;
  - has completed its own latest target search with no result.
- There is no extra recovery grace period. The configured search interval already controls reaction cadence.
- Recovery is checked centrally at wave level. Once valid, all alive members enter forward together.
- After recovery, target scanning returns to the single cached/front-most scanner. Units do not continue individual freehunt scans while in forward.
- The wave resumes its original forward type:
  - normal wave -> normal forward;
  - aggressive wave -> aggressive forward.

### Combat And Retaliation

- If one unit engages or retaliation starts, both involved waves leave forward and enter freehunt.
- Attack-range contact still obeys `attackCheckIntervalFrames`; it is not an every-frame exception.
- Once any unit confirms attack-range contact, `GameManager.onWaveCombatStarted()` puts both involved waves into freehunt/combat together.
- Retaliation applies after a surviving defender takes damage:
  - if the defender is not `onBusy`, it replaces its current chase target with the attacker;
  - retaliation may select an attacker outside normal `targetSearchRange`;
  - if already `onBusy`, the defender keeps fighting its current target;
  - repeated ranged hits do not oscillate the retaliation target while that target remains valid.
- Retaliation also clears stale no-target confirmation, so the defender must search again before its wave can recover to forward.

Retaliation implementation details:

- `UnitBehavior.dealDamageToEnemy()` applies damage first.
- If the defender survives, it calls `enemy.reactToAttacker(this.unit)`.
- A killing hit does not assign retaliation because the defender is immediately reported/despawned.
- `Unit.reactToAttacker()` refuses to switch when the defender is already `onBusy`.
- A retaliation target is stored with both object reference and `lifeId`; pooled reuse or despawn invalidates it safely.
- Normal `setEnemyTarget()` clears retaliation ownership, so actual attack-range engagement or later normal target selection returns to ordinary target behavior.
- `UnitProps.takeDamage()` remains a simple health operation and does not depend on `Unit`; attacker awareness stays in combat behavior.

Retaliation visual examples:

```text
Sword A chasing Sword B, not yet engaged
Archer B hits Sword A from mid
=> Sword A changes target to Archer B and chases it even outside search range
```

```text
Sword A is already in melee with Sword B
Archer B hits Sword A
=> Sword A keeps fighting Sword B; no target switch
```

```text
Two archers alternately hit Sword A before melee engage
=> first valid retaliation attacker remains the target; later hits do not cause oscillation
```

Dynamic lane behavior:

- Lane does not control regroup or normal-forward/freehunt movement. It is relative strategic metadata for ArmyBrain.
- `GameManager.processDynamicWaveLanes()` updates each wave on the same cadence as that wave's cached `targetSearchIntervalFrames`.
- Updates are staggered by `wave.id` so all waves do not vote on the same frame.
- Lane vote counts alive units by visible `unit.node.worldPosition.x`.
- The lane with the highest unit count becomes `wave.laneId`, and that laneId is synchronized to every alive member.
- On a tie, keep the current lane if it is one of the tied winners; otherwise choose the tied lane whose center is closest to average wave X.
- Dynamic lane stays on the main thread. The vote is a small O(units-in-wave) scan at a throttled interval; worker snapshot/message cost would be larger and introduces stale results.
- Update order in `GameManager.update()` is:
  1. dynamic lane vote;
  2. forward scanner search;
  3. wave recovery check;
  4. dead-wave pruning;
  5. hero unlock check.
- Therefore an aggressive-forward scan on a lane-vote frame uses the newly updated laneId.

Per-unit attack range:

- `UnitPrefabEntry.attackRange` now exists in `BattleUnitDatabase`.
- `GameManager -> UnitSpawner -> Unit.attackRange` assigns it on every spawn, including pooled reuse.
- `targetSearchRange` remains shared through the Unit prefab.
- `UnitPrefabEntry.attackIntervalMin` and `attackIntervalMax` configure normal-unit attack cadence per troop type.
- `GameManager -> UnitSpawner -> UnitBehavior` assigns both intervals before `resetForSpawn()`, including pooled reuse.
- Database defaults are currently `0.4-0.45 s`, matching the normal-unit prefab values used before this change.
- Hero attack intervals remain on the hero's `UnitBehavior` component because heroes are not spawned from `UnitPrefabEntry`.

Intentionally removed or avoided ideas:

- Hard ban on backward chase. It caused units to stand still or fail to forward.
- Lane decision from selected target. It caused target fixation and awkward lane changes.
- Lane decision from last killed enemy. It caused adjacent waves to pass each other or units to run back to old lanes.
- Heavy event/counter bookkeeping for alive/engaged state. It was tested and did not improve frametime enough.

## Aggressive Forward Raid

Aggressive forward was added so lane choice matters more and fast units can raid empty lanes.

Source state:

- `Unit.aggressiveForward` exists and resets to `false` on despawn.
- `GameManager.spawnWaveByEntry(..., aggressiveForward = false)` passes the flag to spawned units.
- `BattleWave.hasAggressiveForward()` checks whether a wave has active aggressive-forward units.
- `ArmyBrain.aggressiveForwardChance` controls raid chance.
- `ArmyBrain.enableAggressiveForwardLog` controls raid logs.

Behavior:

- Normal forward uses a front scanner, but scanner results only release the wave when the target is in an adjacent lane and the scanner has already passed it along `forwardDir`.
- Aggressive-forward does not use scanner-based release.
- Adjacent-lane enemies inside search range are ignored by aggressive-forward unless they enter attack range or attack first.
- Actual attack-range engage still uses normal wave-wide combat.
- Being attacked still triggers retaliation and wave-wide freehunt.
- Reaching/passing the enemy hero's Z line triggers freehunt regardless of lane.
- After freehunt finds no remaining target, the wave resumes aggressive-forward rather than becoming a normal wave.
- Aggressive-forward is a persistent wave trait stored at wave level. Ordinary freehunt/combat does not erase it.

ArmyBrain raid rules:

- Counter spawn remains the main priority.
- Raid may happen when there is no valid target or the selected spawn would be fallback/non-counter.
- Raid lane must be empty at the ArmyBrain snapshot: no enemy wave and no ally wave counted in that lane.
- Raid unit selection prefers highest `maxSpeed` among affordable entries; if too expensive, it naturally falls to the next fastest affordable entry.
- Raid defense reuses `defenseModeChance`; no extra defense knob was added.
- If an enemy aggressive-forward wave threatens hero lane or adjacent hero lane, AI can override target selection to defend that raid.

## Hero Logic

Hero is treated as a special mid-lane unit/wave conceptually, but should use
ordinary forward/freehunt rules once hero phase unlocks.

- Initially `isSteady = true`.
- Before hero phase, steady heroes have a local guard zone:
  - `HeroEntry.guardDistance` is assigned to `Unit.heroGuardDistance` during hero registration;
  - the guard zone is centered on the hero's initial/home position, not the hero's current position;
  - while steady, if any valid enemy enters this guard zone, the hero can chase/fight only inside that zone;
  - if the current target leaves the guard zone and no other enemy remains in the zone, the hero drops the target, walks back home using normal movement/maxSpeed/RVO, then faces its initial yaw again;
  - if another enemy enters the guard zone while the hero is returning, the hero immediately resumes local guard pursuit;
  - guard-zone behavior is separate from hero phase and does not unlock global map pursuit.
- It can still attack back in place if enemy enters normal attack range.
- It unlocks when its team cannot spawn normal units anymore and has no alive normal units/waves.
- On unlock:
  - the hero is registered into `GameManager.waves` if needed;
  - `hero.setSteady(false, true)` makes it enter forward;
  - the hero wave runs `BattleWave.forceForwardMode()`;
  - enemy waves run `BattleWave.forceForwardMode()` instead of being forced into freehunt.
- `BattleWave.forceForwardMode()` clears freehunt/permanent state and calls
  `Unit.enterWaveForwardMode(...)` on alive units, preserving each wave's
  aggressive-forward trait.
- Enemy hero does not auto-unlock just because the other hero unlocked.
- Hero kills do not award CP.
- There is no hero-pressure all-map target search now.
- Newly spawned waves after an opposing hero unlock are no longer kicked out of
  forward by `spawnEntryFormation()`.
- Hero freehunt is recoverable under the same wave rules unless combat/targets
  keep it active.

Recent caution:

- A previous hero-phase fix was suspected to affect frame time, but later profiling also showed browser/tab noise and render/GPU cost can dominate. Re-measure before blaming hero logic.
- Old notes about `GameManager.getHeroPressureSearchRange()` and inspector
  `heroFreeHuntSearchRange` are obsolete; those paths were removed when hero
  phase changed to normal-wave forward behavior.

## Gameplay Notes On 2026-06-24 And 2026-06-25

Wave-wide forward/freehunt rewrite:

- Removed the old same/adjacent-lane passed-target release rule.
- Removed serialized `forwardScanRange`, `forwardScanIntervalFrames`, and `useWaveForwardScanner` fields from unit scene/prefabs.
- Removed stale serialized `laneReturnTolerance` from unit prefabs.
- `GameManager.processWaveForwardSearches()` now coordinates one front scanner per forward wave.
- The scanner is cached for cheap per-frame hero-line checks and refreshed on the staggered target-search cadence.
- Normal forward uses Spatial Grid directly and does not fall through to a full-team scan when the grid returns no target.
- `BattleWave.tryResumeForward()` owns the whole-wave recovery transition.
- `Unit` records whether its asynchronous target search is pending or has completed with no target.
- No-target units wait during freehunt; they do not forward independently.
- Dynamic lane voting remains active and unchanged as ArmyBrain input.
- Retaliation behavior remains active and still overrides a non-busy chase target with the ranged attacker.

Clarifications confirmed with the user on 2026-06-25:

- No extra no-target grace period is wanted. `targetSearchIntervalFrames` is intentionally large enough to provide the desired cadence.
- Historical note: initial forward search lock was used briefly and then removed on 2026-06-29. Do not reintroduce it.
- Normal forward now uses the front scanner immediately after spawn and after recovery, but scanner visibility alone does not freehunt.
- Recovered forward does not keep per-unit target scanning.
- Normal forward scanner release is limited to adjacent-lane targets that the scanner has already passed.
- Same-lane targets release through attack-range contact, not through scanner visibility.
- Aggressive forward does not use scanner release.
- Shared-target convergence is an intended natural regroup behavior.
- `laneId` remains dynamic ArmyBrain input and is not an absolute movement restriction.
- The old broad "scanner finds anything -> freehunt" mechanism is intentionally removed and must not be restored.

Hero-phase rewrite after later office discussion:

- Old design:
  - a hero unlock forced the hero and enemy waves into permanent/full-map
    freehunt;
  - newly spawned waves could also be kicked out of forward by hero-pressure
    logic.
- New design:
  - hero phase is not a global freehunt switch;
  - unlocked hero behaves like a one-unit mid-lane wave in normal forward;
  - enemy waves are returned to forward/aggressive-forward and only freehunt
    when ordinary rules trigger;
  - `shouldForceTeamFreeHunt()`, `forceWaveToHeroPressureFreeHunt()`,
    `getHeroPressureSearchRange()`, and `heroFreeHuntSearchRange` were removed.
- If a wave has no target during freehunt and is waiting for its search tick,
  that temporary wait is accepted behavior, not a bug.

### Planned Wave Banner / Representative Unit Design

This is a design decision from the latest office discussion. It has not been
implemented yet. The user plans to ask another Codex session to implement it.

Goal:

- Add a wave-level representative unit, tentatively named
  `bannerUnit`, `representativeUnit`, or similar.
- This unit is the visual anchor for:
  - the banner/army emblem shown above the wave on the main battlefield;
  - the minimap icon position when the minimap panel is enabled.
- Do not keep minimap position logic separate from battlefield banner logic.
  Both should read the same wave-level representative unit so the main map and
  minimap agree.

Reasoning:

- Current minimap uses sampled/average wave position. This is useful as a
  center-of-mass estimate, but on the main map a banner at an average point can
  appear to float between units, especially during melee spread.
- A banner attached to a real unit feels more like a disciplined army with a
  flag bearer.
- The initial front scanner is usually the unit leading the formation, often
  gets the first target, and often becomes the unit whose target is borrowed by
  teammates. Visually, this makes it a good first banner holder.

Important separation of concerns:

- Do not make the gameplay scanner and visual banner holder the exact same
  always-refreshing concept.
- Forward scanner remains gameplay logic:
  - selected/cached by `BattleWave.getForwardScanner()`;
  - refreshed on `targetSearchIntervalFrames` when target search runs;
  - can change for gameplay correctness.
- Banner/representative unit should be visually stable:
  - choose from scanner initially;
  - keep the same holder while alive/valid;
  - only re-pick when the current holder dies, despawns, leaves the wave, or is
    otherwise invalid.

Proposed selection rules:

1. On wave spawn / first forward scanner availability:
   - set `bannerUnit` to the current front scanner if valid.
   - If no scanner exists yet, fall back to a valid alive unit from the wave.
2. While `bannerUnit` is valid:
   - keep it; do not swap every scan interval.
3. When `bannerUnit` becomes invalid/dead:
   - scan alive units in the wave;
   - compute average X of alive unit positions;
   - choose the alive unit whose X is closest to that average X.
4. Tie-breakers, if needed:
   - prefer a unit with a valid target;
   - then prefer a unit currently on forward;
   - then prefer the unit further along `forwardDir`.

Why average X, not lane center:

- During combat, units often spread horizontally.
- The user wants the new flag bearer to move toward the visual center of the
  living formation after the original holder dies.
- Use the center of the actual alive units, not the configured lane center,
  because a wave may be fighting away from its nominal lane.

Performance intent:

- Re-pick only when the current holder is invalid/dead, not every frame.
- The re-pick cost is O(alive units in wave), which is acceptable because it is
  event-like and wave-local.
- Avoid sorting/median unless testing proves average X gives poor visuals.
- Minimap update then becomes O(waves) for wave positions by reading one
  representative unit per wave, instead of sampling several units per wave.

Implementation hints:

- Best home is likely `BattleWave`, not `TrueMiniMapPanel`.
- Add a method such as `getRepresentativeUnit()` or
  `getBannerUnit()` that validates/re-picks internally.
- Minimap should use this method for wave position; if it returns null, fall
  back to the current sampled-average logic for safety.
- Main battlefield banner/emblem system should also use this method.
- Hero wave has one unit, so representative selection is trivial.
- Be careful with pooled units: validation must reject units no longer mapped
  to that wave. Existing `BattleWave.isUnitAlive(...)` already has the right
  shape but is private; implementation should reuse equivalent checks or expose
  a narrow safe helper.

Verification done:

- Cocos-bundled TypeScript check with `--skipLibCheck --module ESNext` passed after the latest target, attack-check, and attack-interval changes.
- Scene and prefab JSON parsing passed after legacy serialized fields were removed.
- `git diff --check` passed.
- The user has run repeated Cocos/browser gameplay tests and supplied Chrome traces. The latest attack-interval database change still needs inspector/gameplay verification.
- Required gameplay retest:
  - normal forward after spawn uses the front scanner but does not freehunt merely because an enemy enters search range;
  - normal forward releases the whole wave only when the scanner passes an adjacent-lane target;
  - same-lane enemies release through attack-range contact, not search visibility;
  - aggressive forward ignores scanner search release completely;
  - both normal and aggressive forward still release when any unit detects an enemy in attack range, when attacked, or when reaching/passing enemy hero line;
  - aggressive wave resumes aggressive-forward after all alive members confirm no target;
  - ranged engage makes both waves freehunt;
  - no unit forwards alone while another member still has a target or pending search;
  - all targets disappear, all searches complete, and the whole wave resumes forward together;
  - freehunt waiting for a target-search tick is acceptable cadence, not a bug;
  - hero phase unlock makes the hero move forward as a one-unit mid-lane wave;
  - enemy waves are not globally forced to chase the unlocked hero;
  - enemy waves in hero phase return to normal/aggressive forward and only freehunt through ordinary triggers;
  - dynamic lane follows majority position without tie flicker;
  - ArmyBrain counter/raid lane selection still looks reasonable with dispersed waves;
  - ranged attacker outside melee search range pulls a non-busy defender away from its old chase target;
  - already-busy melee defenders ignore ranged retaliation;
  - alternating ranged attackers do not make a defender rapidly switch targets;
  - retaliation target death/despawn returns the defender to ordinary self-search/share-target behavior.

User test status:

- The user has begun runtime testing this rewrite.
- Do not declare gameplay behavior final until the user reports the above cases as visually correct.

Implementation caution:

- There are many editor/generated dirty files under `build/`, `library/`, and `temp/`. Do not revert them blindly.
- Scene, prefab, UI asset, profile, build, library, and temp files may contain user/editor changes unrelated to the current gameplay work.
- Do not discard the current uncommitted target/attack changes unless the user explicitly asks to reverse them.

## Performance Systems

Currently active performance-oriented systems:

Trace-review rule confirmed by the user on 2026-06-26:

- Every Chrome Performance trace review must inspect the main thread, RVO worker, and target worker separately.
- For each worker, report CPU activity, message cadence, heap baseline/peak/end, GC cadence and pauses, and whether fallback activated.
- Do not infer mobile-browser safety from V8 desktop GC alone.
- When worker or fallback logic changes, verify behavioral equivalence as well as performance.

- RVO worker via `RVOWorkerSimulator`.
- RVO step throttled by `GameManager.updateInterval`.
- Spatial grid rebuild via `spatialGridUpdateInterval`.
- `BattleSpatialGrid` batched nearest-target worker named `BattleSpatialGridTargetWorker`.
- The target-query worker has a main-thread fallback if worker creation, posting, or runtime messaging fails.
- Target worker uses reusable typed arrays.
- Both target-query and RVO workers are asynchronous:
  - main thread packs data and calls `postMessage`;
  - it does not block waiting for results;
  - results are applied later in `worker.onmessage`.
- RVO uses a `pending` guard. If the previous worker step is unfinished, the next requested RVO step is skipped rather than blocking the main thread.
- Target queries are batched in a Promise microtask, posted together, and delivered later through stored callbacks/query tokens.
- RVO now has a runtime main-thread fallback:
  - failure to become ready within 2 seconds activates `RVOSimulator`;
  - a pending step that receives no result within 2 seconds activates fallback;
  - `postMessage` failure and `worker.onerror` activate fallback;
  - fallback reuses the current agent and obstacle arrays instead of respawning units.
- Unit target/attack scans are throttled:
  - `attackCheckIntervalFrames`
  - `targetSearchIntervalFrames`
- Attack-range checks run directly against the main-thread Spatial Grid on their throttled ticks; they do not create target-worker requests.
- Long-range target searches still use the batched target worker with main-thread fallback.
- Forward target search reuses the wave's `targetSearchIntervalFrames`; the old separate forward-scan interval was removed.
- Forward target search uses one cached/front-most scanner per wave instead of every unit scanning.
- Hero-line checks use the cached scanner every frame, avoiding an O(units-in-wave) front scan each frame.
- Normal-forward scanner queries Spatial Grid directly and only uses a full-team fallback when the grid is unavailable.
- `BattleWave` has runtime per-frame cache for alive/engaged scans.
- Dynamic lane voting is wave-level, throttled by cached target-search interval, and frame-staggered.
- Minimap is expected to be enabled again. `TrueMiniMapPanel` uses pooling, interval updates, wave-position sampling, and grid-based icon separation.
- Latest minimap pass on 2026-06-26:
  - avoided repeated `setContentSize`/anchor writes when map/root size has not changed;
  - skipped alive-ratio UI resize unless the displayed ratio actually changes;
  - skipped minimap icon `setPosition` once an icon is already visually at its target;
  - flash color is updated only for engaged icons, and idle icons are reset only on engaged -> idle transition;
  - per-frame minimap loops were flattened away from `Map.forEach` callbacks;
  - overlap grid keys are numeric instead of string keys to reduce interval allocation;
  - behavior should remain identical except for sub-pixel icon settle tolerance.

Earlier quantified performance baseline:

- File: `C:/Users/CPU/Downloads/Trace-20260625T135614.json.gz`
- Duration: about `56.6 s`, DevTools iPhone XR emulation.
- `FireAnimationFrame`:
  - avg `1.650 ms`
  - p50 `1.342 ms`
  - p95 `3.792 ms`
  - p99 `5.090 ms`
  - max `12.265 ms`
  - 2 of 3370 frames over `8.33 ms`
  - 0 frames over `16.67 ms`
- Current target acquisition is borrow-first and does not periodically self-search while a valid target is already assigned.
- Target-worker batch rate is about `1.94 batches/s`; `flushNearestWorkerRequests` is roughly `0.001 ms/frame`.
- The discarded periodic re-target experiment produced about `32.3 target batches/s` and raised average frame time to about `1.672 ms`; do not restore it casually.
- Before attack-range checks were moved to the main-thread grid, attack and target queries together produced about `54 target batches/s`.
- Direct main-thread attack-range Spatial Grid queries are cheap in current traces and removed about `95%` of target-worker batches compared with the old mixed attack/target worker path.
- The latest trace had a heavier scene/node peak than the lightest comparison trace, so its `1.650 ms` average should not be attributed entirely to target logic.
- Main heap ended near `68 MB`; node and listener counts returned to baseline. No obvious main-thread memory leak was found.
- RVO worker heap shows a rising sawtooth while peak unit count/cache capacity grows:
  - post-Minor-GC heap roughly `0.61 -> 1.77 MB`;
  - pre-GC peak roughly `3.45 MB`;
  - this matches reusable `agentCache`/buffer growth and temporary grid allocations, not a confirmed leak;
  - verify that the post-GC floor plateaus during a longer run with stable/decreasing unit count.
- Target Worker is now mostly idle. Do not remove it yet; long-range self-search still uses it.
- Do not move dynamic lane voting to a worker based on current evidence.

Newer trace supplied on 2026-06-26:

- `C:/Users/tranl/Downloads/Trace-20260626T010441.json.gz`
- It was collected for the worker-memory/fallback review described in the
  June 26 section below.
- Do not use the June 25 numbers above as the final post-worker-change result.
- Future comparisons must include main thread, RVO worker, target worker, GC
  floors, message cadence, and fallback activation.

Avoid reintroducing:

- Full-unit scans in hot loops.
- Per-unit dynamic-lane scans; vote once per wave per interval.
- Per-query closure allocation in target search.
- Unpooled request objects.
- Per-unit material instances or per-frame material property writes.

## SpectorJS / Render Profiling

SpectorJS was added as an optional profiling helper.

Files:

- `assets/scripts/SpectorDebugger.ts`
- `assets/scripts/SpectorDebugger.ts.meta`
- `assets/scripts/spectorjs.d.ts`
- `assets/scripts/spectorjs.d.ts.meta`

Use:

- Add or enable `SpectorDebugger` on a debug node.
- Tick `Enable Spector`.
- Press `F8` in browser preview/build to capture.
- `autoDownloadCaptureJson = true` downloads `spector-capture-...json`.
- Last capture is also exposed as `window.__battleGameSpectorCapture`.

Notes:

- The component uses `captureCanvas(canvas, captureCommandCount)` instead of `captureNextFrame(...)`.
- Reason: Cocos may cache `requestAnimationFrame` before Spector hooks it, causing "No frames detected".
- Spector is heavy. Keep it disabled outside profiling sessions.
- Current scene state confirmed on 2026-06-25:
  - the `SpectorDebugger` node is inactive;
  - the `SpectorDebugger` component is disabled;
  - the serialized `enableSpector` field remains `true` only so the tool is ready when the node/component is manually re-enabled;
  - do not delete the node or component because the user will need it for later render captures.
- The June 25 Chrome Performance trace was collected with the Spector node and component disabled. Do not attribute that trace's cost to SpectorJS.

Render conclusions from recent Spector captures:

- Unit body instancing is working.
- Healthbar rendering is instanced. Keep its material shared.
- Draw calls are not the main issue right now.
- Mesh/triangle cost is the strongest render-performance risk.
- Old placeholder mesh was about `3364 triangles/unit`.
- Reduced/test meshes were closer to `492-986 triangles/unit`.
- For mobile/web crowd units, practical target is roughly `500-1000 triangles/unit`, with LOD if unit counts rise.
- The Cocos profiler overlay adds its own draw calls; disable it for final measurements.

## VAT Prototype Status

VAT was explored on 2026-06-23 as an isolated experiment, not as the main battle pipeline.

Files:

- `tools/blender/vat_character_baker.py`
- `tools/blender/README_VAT_CHARACTER.md`
- `assets/shaders/VATCharacter.effect`
- `assets/shaders/VATCharacter.effect.meta`
- `assets/scripts/VATCharacterPlayer.ts`
- `assets/scripts/VATCharacterPlayer.ts.meta`
- `assets/materials/VATCharacterMat.mtl`
- `assets/materials/VATCharacterMat.mtl.meta`

Blender baker capabilities:

- Blender 4.x add-on: `BattleGame Character VAT Baker`.
- Panel: `View3D > Sidebar > BattleGame VAT`.
- Animation sources:
  - `Frame Range`
  - `All Actions`
  - `NLA Strips`
- NLA mode only bakes enabled/unmuted strips.
- Each selected NLA strip is isolated while baking so enabled strips do not blend into each other.
- Exports:
  - `*_vat_mesh.fbx`
  - `*_vat.png`
  - `*_vat.json`
- Mesh is triangulated and loop-expanded.
- UV0 is preserved.
- Second UV channel `VAT_INDEX` maps each expanded render vertex to VAT pixels.
- Triangle-order guard was fixed to use the base mesh triangle order across frames.
- `Prefer Square Texture`:
  - ON: output is always `MaxTextureWidth x MaxTextureWidth`; bake errors if data does not fit.
  - OFF: width is `MaxTextureWidth`, height grows as needed.

Cocos VAT runtime capabilities:

- `VATCharacter.effect` is unlit and follows Cocos builtin-unlit color flow:
  - sample main texture,
  - `SRGBToLinear(tex.rgb)`,
  - `CCFragOutput(o)`.
- No fog. A fog attempt caused varying mismatch errors and was removed.
- Supports `USE_INSTANCING`.
- Shared material uniforms hold metadata/textures.
- Per-unit playback uses instanced attributes when `useInstancedPlayback` is true:
  - `a_vat_playback`
  - `a_vat_options`
  - `a_vat_blend_playback`
  - `a_vat_blend_options`
- Normal playback samples 1 VAT pose per vertex.
- Blend samples 2 VAT poses per vertex.
- `Flip Vat V` defaults ON.
- `VATCharacterPlayer` supports:
  - animation by name or index,
  - blend to animation,
  - loop/non-loop overrides,
  - frame events,
  - finished events,
  - test cycling,
  - same-node fallback for frame-event handlers.

VAT issues fixed during the experiment:

- Initial stuck/connected mesh result.
- Animation playback reversed unless `Flip Vat V` was enabled.
- Blender `no attribute 'vector'` issue.
- Color space mismatch with Cocos unlit.
- Fog varying mismatch.
- NLA clips baking as blended/similar data.
- `triangle order changed at frame 3`.
- Animation name ignored in inspector.
- Blend target starting at a random phase instead of clip start.
- Frame events not calling when handler target was missing.
- VAT instancing broken by material instances/per-renderer uniforms.

## VAT Performance Decision

User compared VAT against the existing animated GPU instancing path:

- `C:/Users/CPU/Downloads/Trace-20260623T183448-VAT.json`
- `C:/Users/CPU/Downloads/Trace-20260623T183837-GPUInstancing.json`

Measured summary:

- VAT `FireAnimationFrame`:
  - avg `2.061 ms`
  - p50 `1.808 ms`
  - p95 `4.037 ms`
  - p99 `6.196 ms`
  - max `18.264 ms`
- GPUInstancing `FireAnimationFrame`:
  - avg `1.557 ms`
  - p50 `1.336 ms`
  - p95 `3.462 ms`
  - p99 `4.855 ms`
  - max `8.849 ms`

Important correction:

- Do not compare VAT against a static mesh baseline.
- The user's GPUInstancing trace was animated, not static.

Current decision:

- Stop pursuing VAT as the main battle solution for now.
- Keep the VAT prototype as an experiment/reference.
- Focus battle performance work on the existing animated GPU instancing/skinning path, mesh cost, animation LOD, material/drawcall hygiene, and texture memory.

If VAT is revisited later:

- Verify instancing in Spector.
- Do not use per-unit material instances.
- Consider reducing VAT vertex count caused by loop-expanded mesh.
- Consider precision limits from 8-bit PNG; close clothing/skin overlap can happen.
- Compare against the real animated GPU instancing path, not static mesh.

## Gameplay And Worker Work On 2026-06-26

This section records the non-UI work completed on the same day as the
`PlayerArmyController` work. Do not assume the June 26 session only changed
the bottom UI.

Latest supplied trace for this work:

```text
C:/Users/tranl/Downloads/Trace-20260626T010441.json.gz
```

The user explicitly requires future trace reviews to inspect both workers as
first-class runtime systems, not only the main thread.

### Target Spatial Grid And Target Worker

Changed file:

- `assets/scripts/BattleSpatialGrid.ts`

Implemented:

- Main-thread grid cells are now retained and reused.
  - Only cells used by the previous build are cleared.
  - `Map.clear()` plus fresh per-cell arrays are no longer required on every
    grid rebuild.
- Grid coordinate strings are cached by integer X/Z cell coordinate.
  - The same optimization exists inside the target-worker source.
  - This reduces repeated string construction such as `"x_z"` during grid
    builds and queries.
- Target-worker requests now have a 2-second response timeout.
- Worker failure handling is centralized.
- The following failures permanently disable the target worker for the
  current `BattleSpatialGrid` instance:
  - synchronous `postMessage` failure;
  - `worker.onerror`;
  - worker response timeout.
- On failure:
  - the worker is terminated;
  - both already-posted active requests and not-yet-posted pending requests
    are completed synchronously through `findNearestEnemy()` on the
    main-thread Spatial Grid;
  - request object pooling, callback tokens, requester `lifeId`, and target
    validity checks remain active.
- Timeout state is cleaned during `destroy()`.
- Grid maps, cached key rows, active-cell lists, unit lookup maps, request
  state, and typed-array references are explicitly released during
  `destroy()`.

Important behavior:

- Target-worker failure must not leave a unit's async target state permanently
  pending.
- Fallback produces a target/no-target callback for every valid outstanding
  request.
- After the target worker is marked failed, later target searches use the
  existing main-thread path; the worker is not repeatedly recreated.

### Unit Target Validation

Changed file:

- `assets/scripts/Unit.ts`

Implemented:

- `isValidEnemy()` now explicitly rejects a unit whose `team` equals the
  requester team.
- When a valid Spatial Grid exists, `findNearestEnemy()` returns the grid
  result directly, including `null`.
- It no longer performs an O(enemy-team-size) fallback scan merely because
  the grid returned no target.
- The full-team fallback remains available only when the Spatial Grid itself
  is unavailable.

Reason:

- A legitimate `null` grid result means no enemy is in range; it is not a
  signal that the grid failed.
- Falling through on every no-target result defeats the purpose of the grid
  and is especially costly when many units search during sparse/endgame
  situations.

### RVO Main-Thread Simulator Optimization

Changed file:

- `assets/scripts/rvo/RVO.ts`

Implemented:

- Added the same runtime movement fields used by worker agents:
  - team and forward state;
  - forward direction;
  - ally-overtake settings and seed.
- Added cached grid coordinate strings.
- Grid cell arrays are reused through an active-cell list instead of clearing
  and rebuilding all cell storage every RVO grid build.
- Neighbor collection reuses one scratch array.
- Neighbor sorting uses one stable reusable comparator instead of allocating
  per-neighbor `{ agent, distSq }` records and temporary output arrays.
- `for...of` loops in hot RVO paths were replaced with indexed loops.
- Main-thread fallback now includes ally-overtake behavior.
- Hard separation now applies:
  - half overlap to each agent when both can move;
  - full overlap correction to the movable agent when the other is locked.
- Added `destroy()` cleanup for agents, obstacles, cells, key caches, and
  scratch state.

Do not remove these fields as “worker-only” fields. They are required so a
live `RVOWorkerAgent[]` can be handed to `RVOSimulator` without recreating the
agents when runtime fallback activates.

### RVO Worker Runtime Fallback

Changed file:

- `assets/scripts/rvo/RVOWorkerSimulator.ts`

Implemented:

- Added a complete runtime fallback to `RVOSimulator`.
- Fallback activates when:
  - the worker does not send `ready` within 2 seconds;
  - a submitted step remains pending for 2 seconds;
  - posting a step throws;
  - `worker.onerror` fires.
- On fallback activation:
  - the failed worker is terminated;
  - ready/pending timestamps are cleared;
  - current agents and obstacles are shared with the main-thread simulator;
  - battlefield bounds and RVO tuning are copied;
  - the current frame can continue by stepping the fallback immediately.
- The wrapper continues synchronizing these tuning properties before each
  fallback step:
  - `cellSize`;
  - `timeStep`;
  - minimum/maximum step delta;
  - `obstacleSolveIterations`.
- `destroy()` now destroys the fallback and releases agents, obstacles,
  maps, typed arrays, and worker state.

### Worker And Fallback RVO Parity

The RVO worker source was updated together with `RVOSimulator` so movement
does not silently change when fallback activates.

Synchronized behavior now includes:

- agent-agent velocity avoidance;
- circle and rectangle obstacle velocity avoidance;
- physical obstacle push-out after movement;
- configurable obstacle solve iteration count;
- ally overtaking;
- battlefield bounds;
- hard separation behavior for movable versus locked agents;
- maximum-speed clamping.

Worker-side allocation reductions:

- grid cells are reused through an active-cell list;
- grid coordinate keys are cached;
- the neighbor comparator is reused;
- the existing neighbor scratch buffer and agent cache remain reused.

This parity is a project rule:

- Any future RVO movement change must be applied to both
  `RVOWorkerSimulator.workerSource()` and `RVOSimulator`.
- Test both normal worker execution and forced fallback after movement
  changes.
- A fallback that merely avoids a crash but produces different movement is
  not considered correct.

### Memory Interpretation And Remaining Checks

- Reused cell arrays and cached keys intentionally retain their peak capacity.
  This trades repeated allocation/GC for bounded resident memory.
- Worker `agentCache` and typed-array capacities may also retain the highest
  unit count reached.
- A sawtooth heap is not itself a leak if the post-GC floor stabilizes after
  unit count and battlefield occupancy stop growing.
- Cached grid keys can grow with newly visited cell coordinates. Battlefield
  bounds should keep this finite in the current game.
- Still perform a longer real-mobile/browser run with stable or declining
  unit count and verify:
  - main-thread post-GC floor;
  - RVO-worker post-GC floor;
  - target-worker post-GC floor;
  - no unexpected fallback activation;
  - worker and fallback movement remain visually equivalent.

### Performance Skill Update

Changed file:

- `cocos-performance-optimize-skills/SKILL.md`

Added a permanent trace-review rule:

- identify and inspect every active worker separately;
- report worker CPU and message cadence;
- report heap min/max/end and post-GC trend;
- report Minor/Major GC count and pause cost;
- report timeout/error/fallback activation;
- compare worker and fallback behavior whenever either implementation changes.

### Verification Status

- TypeScript passes with the Cocos-bundled compiler using:

```text
tsc -p tsconfig.json --noEmit --skipLibCheck --module esnext
```

- The normal compiler invocation still encounters existing Cocos 3.8.8
  declaration issues and the existing `SpectorDebugger` module-setting issue.
- Do not claim full runtime parity from static inspection alone.
- Gameplay testing should include ordinary dense combat, obstacles, locked
  combatants, ally overtaking, worker startup failure, runtime worker failure,
  and target-worker timeout recovery.

## Player Bottom UI / Manual Army Control

Work started on 2026-06-26 to replace `ArmyBrain` for team A with
player-controlled spawning through the bottom UI.

### Intended UI Structure

The current `ui-bottom` hierarchy in `assets/Test.scene` is intended as a
persistent battle control panel:

- `lanes-picker`
  - contains `left-picker`, `mid-picker`, and `right-picker`;
  - each picker contains a child node named `selected`;
  - exactly one `selected` node should be active at a time.
- `unit-icon-container`
  - contains one icon per spawnable unit type;
  - tapping an icon should immediately spawn one wave of that type in the
    currently selected lane.
- `skill-icon-container`
  - exists visually but is explicitly out of scope for the current work.
- `true-mini-map`
  - is part of the bottom UI hierarchy and is expected to be enabled again.
  - It is driven by `TrueMiniMapPanel`; avoid adding per-icon/per-unit hot UI logic around it.

The default player faction is team A (`team = 0`). Team B remains controlled
by its existing AI unless changed separately.

### Component Added

Files:

- `assets/scripts/PlayerArmyController.ts`
- `assets/scripts/PlayerArmyController.ts.meta`

`PlayerArmyController` is deliberately a thin UI-to-gameplay adapter. It does
not reimplement spawning, CP checks, formation creation, pooling, or wave
behavior.

Update on 2026-06-26:

- The component now owns the lane-picker and unit-icon tap binding from its Inspector data.
- Do not require manual Button Click Events on every picker/icon.
- The component listens to `TOUCH_END` on the configured nodes at runtime.
- Lane picker visual selection uses the child node named `selected`; the picker nodes themselves should stay white. The active `selected` node blinks by tweening `UIOpacity`.
- If old Button Click Events on those same nodes target this `PlayerArmyController` and handler `spawnUnit` or `selectLane`, the component removes those managed runtime click events to avoid double spawn/double selection.
- The old public `selectLane(event, laneData)` and `spawnUnit(event, unitName)` methods remain for compatibility, but the preferred setup is now the Inspector binding list.
- The component also owns a player spawn cooldown and optional power-bar indicator.
- Cooldown starts only after `GameManager.spawnWaveByName(...)` returns a real wave. Failed spawns from missing entry/insufficient CP do not start cooldown.
- Player spawning now also has `enableMaxAliveWaveLimit` and `maxAliveWaves`, mirroring the AI-side alive-wave cap.
- The alive-wave cap is checked before calling `spawnWaveByName`; hitting the cap logs a warning and does not start cooldown.
- During cooldown, tapping a unit icon does not spawn and logs a warning for now.
- Lane picker root sprites should stay white; selection is shown by the blinking `selected` child node.
- Unit icon root sprites are tinted white when ready and 50% gray/dim during cooldown.

Inspector properties:

- `gameManager`
  - direct reference to the scene `GameManager`;
  - if left empty at runtime, the component falls back to
    `GameManager.instance`.
- `team`
  - defaults to `0`;
  - current intended use is team A.
- `defaultLane`
  - enum: `Left`, `Mid`, or `Right`;
  - defaults to `Mid`.
- `leftPicker`
- `midPicker`
- `rightPicker`
  - these must reference the picker root nodes, not the `selected` child nodes.
  - Each picker root is expected to contain one child node named `selected`.
  - The controller toggles those `selected` child nodes automatically.
- `unitIcons`
  - array of `{ node, unitName }` bindings.
  - `node` is the tappable icon node.
  - `unitName` must exactly match `UnitPrefabEntry.name` in `BattleUnitDatabase`, for example `light_sword`.
- `powerBarContainer`
  - optional root node for the cooldown bar.
  - If left empty, the component tries to find a child named `power-bar-container` under its own node.
  - The container should have a child node named exactly `bar`.
- `coolDownDuration`
  - defaults to `3`.
  - Controls how long the player must wait after a successful manual wave spawn.
- `doubleTapWindow`
  - defaults to `0.25`.
  - Controls the maximum delay between two taps on the same unit icon to spawn an aggressive-forward wave.
- `enableMaxAliveWaveLimit`
  - defaults to enabled.
  - Blocks manual spawning when the player's alive wave count reaches `maxAliveWaves`.
- `maxAliveWaves`
  - defaults to `7`.
  - Counts alive waves for the configured `team`.
- `selectedBlinkMinOpacity`
  - defaults to `80`.
  - Lowest alpha reached by the selected-lane highlight pulse.
- `selectedBlinkDuration`
  - defaults to `0.45`.
  - Time for one fade direction of the selected-lane highlight pulse.

Internal lane mapping:

- `Left = 0`
- `Mid = 1`
- `Right = 2`

This assumes the current three-lane battlefield setup.

### Lane Selection Behavior

Public Inspector callback:

```text
selectLane(event, laneData)
```

Accepted `CustomEventData` values:

- `left` or `0`
- `mid`, `middle`, or `1`
- `right` or `2`

When a lane is selected:

- the component stores that lane in `selectedLaneId`;
- the corresponding picker's child node named `selected` is activated;
- the other two picker `selected` children are deactivated.
- the active `selected` child gets a repeating `UIOpacity` tween between full alpha and `selectedBlinkMinOpacity`.
- old blink tweens are stopped when lane changes or the controller is disabled.

`onLoad()` applies `defaultLane`, so the visual selection and stored lane are
synchronized when the component starts.

Preferred lane picker setup:

- Assign `left-picker`, `mid-picker`, and `right-picker` to `leftPicker`, `midPicker`, and `rightPicker`.
- Do not add manual Button Click Events for lane selection unless intentionally testing legacy behavior.
- The child node must be named exactly `selected`, because the controller resolves it by name.

### Unit Icon Spawn Behavior

Preferred icon setup:

- Add one `unitIcons` entry per tappable unit icon.
- Assign the icon node to `node`.
- Set `unitName` to the exact `UnitPrefabEntry.name` from `BattleUnitDatabase.teamAUnits`.

Example:

```text
BattleUnitDatabase entry name: LightSword
unitIcons[i].unitName:          LightSword
```

Important:

- Matching is case-sensitive because `BattleUnitDatabase.getEntry()` uses
  exact string equality.
- The icon node name is not read and has no effect on spawning.
- Renaming an icon node to `LightSword` is not sufficient; `unitIcons[i].unitName`
  must contain `LightSword`.
- Tapping a unit icon once spawns a normal-forward wave.
- Double tapping/clicking the same unit icon inside `doubleTapWindow` spawns an aggressive-forward wave.
- The first tap is held briefly until `doubleTapWindow` expires, so a double tap can be recognized without spawning a normal wave first and putting the controller on cooldown.
- The pending tap stores the lane selected at tap time, so changing lane during the short double-tap window does not move that already-issued spawn command to another lane.
- There is no persistent selected-unit state and no unit-icon `selected` visual behavior yet.
- If cooldown is active, tapping a unit icon logs a warning and does not spawn.
- After a successful spawn, cooldown starts and the `bar` content width fills from `0` to its cached initial width over `coolDownDuration`.
- During cooldown, unit icons are dimmed. When cooldown reaches zero, icons return to white.
- Unit-icon cooldown tinting expects a `Sprite` on the configured icon root node. If art is moved to a child node, either bind that child or update `PlayerArmyController.setNodeTint()`.
- The max-alive-wave cap is checked before `spawnWaveByName`; blocked attempts do not spend CP and do not start cooldown.
- The current call is:

```text
GameManager.spawnWaveByName(team, unitName, selectedLaneId, aggressiveForward)
```

- `aggressiveForward = false` for single tap.
- `aggressiveForward = true` for double tap/click.
- `GameManager` remains responsible for:
  - finding the database entry;
  - checking and spending CP;
  - creating the wave and formation;
  - using the existing pool/spawner;
  - rebuilding the Spatial Grid.
- If the name does not exist, CP is insufficient, or the entry cannot spawn,
  no wave is created. The current UI does not yet show a failure/disabled
  state.

### Scene Setup Still Required

The component file has been implemented, but this handoff does not claim that
the scene wiring is complete after the latest controller change.

Required Inspector work:

1. Add or keep `PlayerArmyController` on `ui-bottom` or another persistent UI node.
2. Assign `GameManager`.
3. Assign the three picker root nodes to `leftPicker`, `midPicker`, and `rightPicker`.
4. Ensure each picker root has a child node named exactly `selected`.
5. Fill `unitIcons` with `{ node, unitName }` entries for every tappable unit icon.
6. Remove or ignore old manual Button Click Events for picker/icon nodes; the component binds touch input itself.
7. Disable `ArmyBrainA` when manual control is enabled.

At the time of this handoff:

- `assets/Test.scene` should be rechecked in the editor because source has changed since previous handoffs.
- In the office source check after this update, `ArmyBrainA` was serialized with its component disabled and `GameManager.enableAutoSpawn` was false.
- If `ArmyBrainA` is enabled later, team A can receive both player spawn commands and AI spawn commands.
- Do not remove or broadly rewrite `ArmyBrain`; team B still needs it and the
  user may want to switch control modes later.
- No automatic ArmyBrain enable/disable logic was added.
- The original June 26 `PlayerArmyController` patch did not change
  `GameManager`, wave logic, workers, Spatial Grid, CP, or pooling.
- The later June 29 home-Codex work did change `GameManager`,
  `BattleWave`, `Unit`, and `PlayerArmyController` for the final
  forward/freehunt and single/double-tap aggressive-forward rules. See
  `Home Codex Update On 2026-06-29` above.
- The skill UI has not been implemented.

### Verification

- The new component passes the project TypeScript check when using:

```text
tsc -p tsconfig.json --noEmit --skipLibCheck --module esnext
```

- The plain project TypeScript command currently reports pre-existing Cocos
  3.8.8 engine declaration issues and the existing `SpectorDebugger` dynamic
  import/module configuration issue.
- Runtime Button wiring and actual spawning still require testing in the Cocos
  scene after the Inspector setup above.

## Current Next Best Direction

For the next session, unless the user changes direction:

- Visually test the June 29 forward/freehunt reconciliation in Cocos before
  adding more battle logic:
  - normal forward does not freehunt just because an adjacent-lane enemy enters
    search range;
  - normal forward releases only after the front scanner passes an
    adjacent-lane target;
  - same-lane contact releases through attack range;
  - aggressive forward does not release from scanner visibility;
  - both modes still release wave-wide from attack-range contact, retaliation,
    and hero-line reach/pass.
- Visually test the latest hero-phase rewrite:
  - unlocked hero should behave like a normal one-unit mid-lane forward wave;
  - existing enemy waves should return to normal/aggressive forward, not chase
    hero through full-map freehunt;
  - newly spawned waves after hero unlock should still begin in their normal or
    aggressive forward mode.
- If hero phase looks acceptable, implement the planned wave
  banner/representative unit design in `BattleWave`:
  - initial holder from front scanner;
  - stable holder while valid;
  - re-pick by average X of alive units when holder dies;
  - use the same representative for minimap icon position and main-map banner.
- Test `PlayerArmyController` single tap versus double tap:
  - single tap spawns normal forward after the short `doubleTapWindow`;
  - double tap spawns aggressive forward;
  - changing lane during the double-tap window does not move the pending spawn.
- Complete and test the `PlayerArmyController` Inspector wiring before adding
  more bottom-UI behavior.
- Confirm that `ArmyBrainA` is disabled during manual-control tests.
- Test lane highlight exclusivity, exact database-name matching, insufficient
  CP behavior, and repeated icon taps.
- Keep skills out of scope until the user explicitly resumes that part.
- Run a longer post-change trace and inspect main, RVO worker, and target
  worker heaps separately.
- Force RVO worker startup/runtime failure at least once and compare fallback
  movement against normal worker movement.
- Force target-worker failure/timeout and verify every pending unit query
  completes through the main-thread grid instead of remaining pending.
- Keep worker and fallback RVO behavior synchronized in every future movement
  change.
- Verify per-unit-type attack intervals in the BattleUnitDatabase, especially ranged units that previously attacked at the shared `0.4-0.45 s` cadence.
- Continue visual testing of borrow-first target sharing, ranged retaliation, target despawn recovery, and whole-wave return to forward.
- Prefer gameplay verification over further target-worker optimization: current target-worker traffic is already negligible.
- Do not restore periodic target re-evaluation while chasing unless the gameplay benefit clearly justifies the measured worker/message increase.
- Keep attack-range checks on the main-thread Spatial Grid unless a new trace shows a regression.
- Do not optimize or move dynamic lane to a worker without a new trace proving it is material.
- Do not implement transferable/double-buffer target-worker messaging yet; it is a possible future optimization, but current frame budget does not justify the complexity.
- Do not integrate VAT into battle.
- Investigate mesh/animation performance on the existing pipeline.
- Keep unit mesh budgets realistic for mobile web.
- Use Chrome Performance for frame time and Spector for render commands/state.
- Disable Cocos profiler overlay when collecting final performance captures.

## Collaboration Notes

- The user may switch between the office Codex and home Codex.
- Always assume the other Codex may have changed source since this file was written.
- Re-read actual files before editing battle logic.
- Ask the user before broad reversions or deleting experimental files.
