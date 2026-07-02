# AI-CONTEX

Handoff note for the other Codex instance working on `BattleGame`.

Last updated: 2026-07-03.

The user runs two Codex sessions on different machines. These sessions do not share memory. Always read this file and re-check the current source before making changes. Treat this handoff as orientation, not as a substitute for source inspection.

Latest local source check after the July 3 home-Codex LevelSettings cleanup:

- Current HEAD while checking on the home machine: `6faa5e3a`.
- `git status --short` is dirty because the user has been testing in Cocos
  Editor and because the July 3 LevelSettings work intentionally changed
  source/scene files while Cocos generated cache/temp changes.
- Treat `library/`, `temp/`, and `profiles/` changes as editor-generated
  unless the user explicitly asks to inspect or clean them.
- June 26 office work that is now present in source:
  - minimap hot-path optimization in `TrueMiniMapPanel`;
  - `PlayerArmyController` inspector-driven lane picker and unit icon binding;
  - player spawn cooldown and power-bar fill;
  - player max-alive-wave limit;
  - selected-lane highlight by blinking the `selected` child node with `UIOpacity` tween.
- June 29 home work, with June 30 follow-up, that is now present in source:
  - normal forward scanner releases only after passing a same-lane or
    adjacent-lane target;
  - same-lane combat can still start earlier through attack-range contact;
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
- June 30 home work now present in source:
  - each `UnitPrefabEntry` has a `waveBannerPrefab` slot;
  - `BattleWave` owns one stable representative/holder unit and one optional wave-banner node;
  - wave banners are pooled by `GameManager`;
  - banner holder is selected as the alive unit closest to the wave's current
    alive-unit centroid and then kept stable while alive/valid;
  - if the holder dies, the banner detaches, reparents to the new holder while preserving world position, then tweens to local `(0, 0, 0)`;
  - if no holder remains, the banner returns to pool;
  - `TrueMiniMapPanel` now uses `BattleWave.getRepresentativeUnit()` before falling back to old sampled averaging;
  - per-unit-type banner prefabs/materials were created and assigned in
    `assets/Test.scene`;
  - `UnlitBillboard.effect` supports centered `tilingOffset`, material icon
    tint, instanced background color fallback, alpha discard, and depth write;
  - banner materials keep `USE_INSTANCING` enabled and set `tilingOffset` to
    `[1.2, 1.2, 0, 0]`.
- June 30 office follow-up now present in source:
  - hero waves are skipped by `TrueMiniMapPanel`'s normal wave-icon path, so hero minimap display comes only from the hero-icon path;
  - hero-vs-anything damage ignores `CounterSettings`, and kills involving a hero are no longer counted as counter kills;
  - hero still uses `Unit`/`UnitBehavior` for movement and attacking, but should be treated as a special entity rather than a troop type for minimap and counter-rule purposes.
  - formation spacing/count knobs were moved from `GameManager` to each `BattleUnitDatabase.UnitPrefabEntry`: `maxUnitPerRow`, `squareFormationWidth`, `spaceBetweenUnit`, and `spaceBetweenRow`;
  - `GameManager` now reads those formation values from the unit entry when spawning both lane-square and centered-row formations.
  - `LevelSettings` component was added as an optional campaign difficulty scaler;
  - if enabled, `LevelSettings` applies a normalized level curve to the selected team only: initial CP, ArmyBrain AI, lane awareness, same-lane counter chance, fast-react chance, spawn interval, max alive waves, and aggressive-forward chance;
  - July 3 home follow-up added Inspector min/max endpoints for every
    LevelSettings value driven by level, so those ranges are no longer
    hardcoded in the apply method;
  - if the component is disabled or not present, existing `GameManager`/`ArmyBrain` logic is unchanged.
- July 2 home follow-up now present in source:
  - ArmyBrain Defense mode and raid-defense override were removed from runtime;
  - early ArmyBrain spawns are aggressive-forward until that brain has once
    reached `maxAliveWaves`;
  - after an aggressive-forward wave enters freehunt/combat, it clears the
    aggressive trait and later resumes as normal forward;
  - obsolete ArmyBrain inspector properties `attackModeChance`,
    `defenseWaveThreshold`, and `defenseModeChance` were removed from
    `ArmyBrain.ts` and `assets/Test.scene`.
- Earlier office patches did not intentionally wire scene/prefab fields, but
  the later home banner work did intentionally update banner prefabs,
  materials, minimap icon assets, and `assets/Test.scene` banner assignments.
  Always re-check current Inspector wiring in Cocos before changing these.

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

- Current HEAD while writing this handoff on the home machine: `6faa5e3a`.
- Git may require `git -c safe.directory=F:/Github/BattleGame ...` on this
  machine because Windows user ownership differs from the repo owner.
- Expected dirty source/asset files from the July 3 LevelSettings work include:
  - `AI-CONTEX.md`;
  - `assets/Test.scene`;
  - `assets/scripts/LevelSettings.ts`.
- There are also many dirty Cocos-generated files under `library/`, `temp/`,
  and `profiles/`. Do not delete or revert these casually; they may reflect
  the user's open-editor/test state and are not source logic.
- Run `git status --short` before editing because the user may commit, reverse,
  or continue testing from the other machine.

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
  - same-lane and adjacent-lane target release happens only after the scanner
    has passed that target along `forwardDir`;
  - same-lane combat can also start earlier through the universal attack-range
    trigger.
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
  a same-lane or adjacent-lane enemy.
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
  ordinary waves: same-lane attack-range contact, same-lane/adjacent-lane
  release only after normal-front-scanner pass, and hero-line release.

### Minimap State

Current source still contains the minimap dying-wave freeze knob:

- `TrueMiniMapPanel.freezeDyingWavePositionAliveCount = 0`

Current understanding:

- This avoids keeping dying wave icons visually stuck too long when alive
  count reaches zero.
- `TrueMiniMapPanel` now uses `BattleWave.getRepresentativeUnit()` first for
  wave icon position, then falls back to the older sampled-average path only
  when no representative is available.
- Avoid broader minimap rewrites unless the user explicitly returns to
  minimap issues.

### Wave Banner And Representative Holder

Files changed on 2026-06-30:

- `assets/scripts/BattleUnitDatabase.ts`
- `assets/scripts/BattleWave.ts`
- `assets/scripts/GameManager.ts`
- `assets/scripts/TrueMiniMapPanel.ts`

Implemented:

- `UnitPrefabEntry.waveBannerPrefab` was added.
  - This is the Inspector slot where the user assigns the banner prefab for
    each unit type.
  - Runtime creates/pools `Node` instances from this prefab; do not assign a
    live scene node here.
- `BattleWave` now owns:
  - `representativeUnit`;
  - `waveBannerNode`;
  - a recycle callback supplied by `GameManager`.
- Representative selection:
  - if there is no representative yet, the wave picks the alive unit closest to
    the wave's current alive-unit centroid;
  - while the representative remains alive and still belongs to the wave, it
    is kept stable;
  - when the holder dies/invalidates, the wave picks a new alive unit closest
    to the current alive-unit centroid.
- Banner attach behavior:
  - initial attach goes straight under the holder at local `(0, 0, 0)`;
  - holder switch stops any previous banner tween;
  - banner detaches from the old parent while preserving world transform;
  - banner reparents to the new holder while preserving world transform;
  - banner tweens back to local `(0, 0, 0)` under the new holder.
- Banner cleanup:
  - if no holder remains, the banner is released to pool;
  - `BattleWave.releaseReferences()` also releases any banner;
  - `GameManager.onDestroy()` clears pooled banner nodes.
- `GameManager.notifyUnitWillDespawn()` refreshes the wave banner before a
  unit node is deactivated and returned to the unit pool. This avoids a banner
  staying under an inactive pooled holder until the next frame.
- `GameManager.waveBannerTweenDuration` controls the holder-switch tween
  duration and defaults to `0.2`.

Important behavior:

- Banner lifecycle belongs to `BattleWave`, not to `Unit`.
- Unit pooling must not carry a banner into a reused unit.
- The banner pool is separate from the unit pool.
- Current implementation uses holder local `(0, 0, 0)`. If unit roots are at
  the feet, add an explicit banner anchor/socket or offset later instead of
  hardcoding per-prefab hacks in wave logic.

### Performance Trace Review

Latest supplied trace reviewed:

```text
C:/Users/tranl/Downloads/Trace-20260630T011000.json
```

Compared against:

```text
C:/Users/tranl/Downloads/Trace-20260629T005226.json.gz
```

Key numbers from the June 30 trace:

- `FireAnimationFrame` after excluding profiler-start outlier:
  - count `12022`;
  - avg `1.180 ms`;
  - p50 `1.146 ms`;
  - p90 `3.052 ms`;
  - p95 `3.488 ms`;
  - p99 `4.221 ms`;
  - max `12.296 ms`;
  - frames over `8.33 ms`: `5`;
  - frames over `16.67 ms`: `0`.
- Main JS heap:
  - min `48.1 MB`;
  - max `98.6 MB`;
  - last `67.5 MB`;
  - post-GC baseline is not drifting upward in this trace.
- DOM/listener counters:
  - documents stable at `2`;
  - DOM nodes stable at about `42644`;
  - listeners went from `130` back to `119`.
- RVO worker:
  - `RunTask` count `3330`;
  - avg `0.352 ms`;
  - p50 `0.307 ms`;
  - p95 `0.793 ms`;
  - p99 `1.007 ms`;
  - max `4.935 ms`;
  - heap roughly `0.6-2.8 MB`, last about `2.5 MB`.
- Target-search worker:
  - still very light;
  - `RunTask` count `274`, avg `0.120 ms`, max `4.110 ms`;
  - only `36` `HandlePostMessage` calls, avg `0.276 ms`, max `1.128 ms`;
  - no worker GC events recorded;
  - heap about `0.5-0.8 MB`.
- Wave banner samples:
  - `processWaveBanners` sampled around `0.4 ms` total over the whole trace;
  - `refreshWaveBanner` sampled around `0.2 ms` total;
  - tween cost was negligible.

Interpretation:

- Performance is healthier than the June 29 trace:
  - RAF avg improved from about `1.49 ms` to `1.18 ms`;
  - p95 improved from about `3.90 ms` to `3.49 ms`;
  - p99 improved from about `4.72 ms` to `4.22 ms`;
  - no frame exceeded `16.67 ms` after excluding profiler-start outliers.
- Worker cost is not the bottleneck.
- Do not move RVO/target workers back to main thread based on this trace.
- The newly added wave banner / representative holder path does not show up
  as a frame-time regression in this trace.
- The current recurring cost center is still engine/render/browser work:
  WebGL buffer/state work, per-pass updates, mesh vertex filling, materials,
  UI, VFX, and animation will matter more than target-search worker traffic.
- Native builds may reduce browser/WebGL overhead and scheduling variance, but
  they will not remove intrinsic costs such as high mesh vertices, draw calls,
  material switches, overdraw, animation, VFX, UI layout, allocations, or broad
  gameplay scans.

O(n^2) / scan-wide clarification:

- In the normal path, current battle logic is mostly grid-backed or
  wave-throttled, not pure O(n^2).
- Target-worker failure falls back to the main-thread Spatial Grid. This is
  still acceptable if the grid exists and is current.
- The dangerous fallback is when the Spatial Grid is unavailable or stale and
  code falls back to scanning whole enemy lists.
- RVO worker failure moves RVO cost back to the main thread, but current RVO
  fallback still uses grid-style neighbor filtering. It is not automatically a
  full O(n^2) pass, though dense cells can become locally expensive.
- Dynamic lane voting is O(units in wave), throttled by the wave's staggered
  target-search cadence. Do not move it to a worker without a trace proving it
  matters.
- Representative-holder re-pick is O(alive units in wave) and event-like,
  usually only when the current holder dies or becomes invalid.
- Minimap wave position now reads one representative holder per wave. If icon
  separation grows to many icons, pairwise anti-overlap may become the minimap
  cost to watch.

### Verification Done

- TypeScript check passed with the Cocos-bundled compiler:

```text
tsc -p tsconfig.json --noEmit --skipLibCheck --module esnext
```

- `git diff --check` passed for:
  - `AI-CONTEX.md`;
  - `assets/scripts/BattleUnitDatabase.ts`;
  - `assets/scripts/BattleWave.ts`;
  - `assets/scripts/GameManager.ts`;
  - `assets/scripts/TrueMiniMapPanel.ts`.

Runtime status:

- The user supplied a post-banner Chrome trace
  `Trace-20260630T011000.json`; it looked healthy and better than the June 29
  trace.
- At that time, full gameplay behavior still needed Cocos visual testing with
  real banner art/VFX; later user testing confirmed banners are visible and
  the mixed missing-background issue appears resolved.

Additional traces reviewed after the later forward/banner/shader follow-up:

```text
C:/Users/tranl/Downloads/Trace-20260630T213901.json
C:/Users/tranl/Downloads/Trace-20260630T215026.json
```

`Trace-20260630T213901.json`:

- Trace span by RAF: about `65.09 s`.
- `FireAnimationFrame`:
  - count `7811`;
  - avg `1.163 ms`;
  - p90 `2.502 ms`;
  - p95 `2.938 ms`;
  - p99 `4.009 ms`;
  - max `20.776 ms`;
  - frames over `8.33 ms`: `4`;
  - frames over `16.67 ms`: `1`.
- Main `MinorGC`/`MajorGC`:
  - count `103`;
  - total `166.362 ms`;
  - avg `1.615 ms`;
  - max `12.552 ms`;
  - no GC over `16.67 ms`.
- RVO worker-like dedicated worker:
  - `RunTask` avg `0.462 ms`;
  - p95 `0.853 ms`;
  - p99 `1.210 ms`;
  - max `3.083 ms`;
  - no worker task over `8.33 ms`.
- Target-search worker-like dedicated worker:
  - `RunTask` avg `0.140 ms`;
  - p95 `0.323 ms`;
  - max `3.406 ms`.

`Trace-20260630T215026.json`:

- Trace span by RAF: about `90.995 s`.
- `FireAnimationFrame`:
  - count `10919`;
  - avg `1.168 ms`;
  - p90 `2.576 ms`;
  - p95 `3.046 ms`;
  - p99 `4.069 ms`;
  - max `14.330 ms`;
  - frames over `8.33 ms`: `2`;
  - frames over `16.67 ms`: `0`.
- Main `MinorGC`/`MajorGC`:
  - count `117`;
  - total `257.376 ms`;
  - avg `2.200 ms`;
  - max `13.724 ms`;
  - no GC over `16.67 ms`.
- RVO worker-like dedicated worker:
  - `RunTask` avg `0.411 ms`;
  - p95 `0.776 ms`;
  - p99 `1.038 ms`;
  - max `5.108 ms`;
  - no worker task over `8.33 ms`.
- Target-search worker-like dedicated worker:
  - `RunTask` avg `0.119 ms`;
  - p95 `0.278 ms`;
  - max `2.951 ms`.

Interpretation of these later traces:

- The latest forward/freehunt and banner logic does not show as a main-thread
  performance regression.
- `processWaveForwardSearches`, `searchForwardWaveTarget`,
  `shouldReleaseNormalForwardTarget`, `processWaveBanners`, and
  `refreshWaveBanner` appear as small samples, not bottlenecks.
- The recurring worker cost to watch is still RVO worker data prep/solve work
  such as `buildAgents`, `buildGrid`, `pushAgentOutOfObstacles`, and
  `writeResultToFloats`.
- Target-search worker traffic remains negligible.
- These two latest traces did not include JS heap / DOM node / listener
  counters, so do not make new memory-leak claims from them alone.
- Keep RVO and target workers enabled for now; do not move them back to main
  thread based on these captures.

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
      -> normal front scanner passes a same-lane/adjacent-lane target, hero line is reached,
         or any unit enters attack-range engagement/is attacked
      -> whole-wave Free Hunt
```

This flow is the current canonical rule set. Older notes or commits describing initial forward search locks, regroup-to-lane, per-unit forward recovery, or permanent normal freehunt are obsolete. Same-lane/adjacent-lane passed-target release is active again, but only for normal forward and only after the front scanner has passed the target.

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
- Attack-range contact is the universal hard trigger after the initial forward
  gate is no longer active: if any alive unit detects a valid enemy inside
  `attackRange` on its `attackCheckIntervalFrames`, both involved waves enter
  freehunt/combat together.
- Intentional exception: `initialForwardCombatGate` can delay whole-wave
  release during the first same-lane forward contact until the wave reaches
  its configured engaged-unit threshold. This is a deliberate visual formation
  rule, not a bug to remove casually.

### Normal Forward

- During normal forward:
  - this applies both immediately after spawn and after freehunt/combat recovery;
  - only the current front-most alive unit scans for a target;
  - front-most means the alive forward unit whose position is furthest along its own `forwardDir`;
  - for the current Z-axis battlefield, team A effectively selects the greatest forward Z and team B the smallest forward Z;
  - the scanner is cached and refreshed on the wave's staggered `targetSearchIntervalFrames`;
  - search uses `targetSearchRange` and Spatial Grid when available;
  - finding a target does not automatically release the wave;
  - if the scanner's current target is in the same lane or an adjacent lane, the whole wave enters freehunt only after the scanner has passed that target along `forwardDir`;
  - same-lane targets can also release earlier through normal attack-range contact;
  - the target wave does not enter freehunt merely because it was seen. It reacts through its own scan, attack-range contact, or retaliation.
- Hero-line detection is separate from normal target search:
  - the cached front scanner checks the enemy hero line every frame;
  - reaching/passing the enemy hero position along `forwardDir` releases the whole wave into freehunt;
  - hero-line detection does not depend on laneId.

### Aggressive Forward

- During aggressive forward:
  - the wave still moves straight by `forwardDir`;
  - it does not use the normal same-lane/adjacent-lane passed-target scanner release;
  - it does not release merely because a scanner sees an enemy;
  - it still enters whole-wave freehunt/combat from attack-range contact, retaliation, and hero-line detection;
  - once it enters freehunt/combat, the aggressive-forward trait is cleared;
  - after recoverable freehunt finishes with no target, it resumes normal forward.

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
- After recovery, the wave resumes normal forward. Aggressive-forward is
  intentionally cleared when a wave enters freehunt/combat.

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

- Normal forward uses a front scanner, but scanner results only release the wave when the target is in the same lane or an adjacent lane and the scanner has already passed it along `forwardDir`.
- Aggressive-forward does not use scanner-based release.
- Adjacent-lane enemies inside search range are ignored by aggressive-forward unless they enter attack range or attack first.
- Actual attack-range engage still uses normal wave-wide combat.
- Being attacked still triggers retaliation and wave-wide freehunt.
- Reaching/passing the enemy hero's Z line triggers freehunt regardless of lane.
- After aggressive-forward enters freehunt/combat, the aggressive-forward trait
  is cleared at both wave and unit level.
- If that wave later finds no remaining target and resumes forward, it resumes
  as normal forward, not aggressive-forward.
- Aggressive-forward is now an opening/explicit-spawn behavior, not a permanent
  wave trait after first contact.

ArmyBrain raid rules:

- Counter spawn remains the main priority.
- Raid may happen when there is no valid target or the selected spawn would be fallback/non-counter.
- Raid lane must be empty at the ArmyBrain snapshot: no enemy wave and no ally wave counted in that lane.
- Raid unit selection prefers highest `maxSpeed` among affordable entries; if too expensive, it naturally falls to the next fastest affordable entry.
- The old raid-defense override was removed on July 2. ArmyBrain no longer
  switches target selection to a special defense/raid-defense target.
- Before an ArmyBrain has ever reached `maxAliveWaves`, every ArmyBrain spawn
  uses aggressive-forward, so early "defense" is handled by pushing the fight
  forward instead of spawning a home-defense counter.

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
  `Unit.enterWaveForwardMode(...)` on alive units using the wave's current
  forward trait. If the wave had already entered freehunt/combat, that trait
  has already been cleared and it resumes as normal forward.
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

- Removed the old broad same/adjacent-lane passed-target release rule during
  the June 24/25 rewrite. Current June 30 behavior reintroduced a narrower
  normal-forward scanner pass rule for same-lane and adjacent-lane targets.
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
- Normal forward scanner release is limited to same-lane or adjacent-lane targets that the scanner has already passed.
- Same-lane targets may also release through attack-range contact before the pass check.
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

### Implemented Wave Banner / Representative Unit Design

This design is now implemented in the June 30 home-Codex source. Do not treat
it as pending work or re-implement it from scratch.

Goal:

- Each wave owns a wave-level representative unit through
  `BattleWave.getRepresentativeUnit()`.
- This representative is the visual anchor for:
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
- The banner holder is now selected near the visual center of the living
  formation, not from the front scanner. This avoids the banner sticking to the
  leading edge of a long or crowded wave.

Important separation of concerns:

- Do not make the gameplay scanner and visual banner holder the exact same
  always-refreshing concept.
- Forward scanner remains gameplay logic:
  - selected/cached by `BattleWave.getForwardScanner()`;
  - refreshed on `targetSearchIntervalFrames` when target search runs;
  - can change for gameplay correctness.
- Banner/representative unit should be visually stable:
  - choose from alive-unit centroid initially;
  - keep the same holder while alive/valid;
  - only re-pick when the current holder dies, despawns, leaves the wave, or is
    otherwise invalid.

Implemented selection rules:

1. On wave spawn / first representative request:
   - scan alive units in the wave;
   - compute the alive-unit centroid from current X/Z positions;
   - choose the alive unit closest to that centroid.
2. While `bannerUnit` is valid:
   - keep it; do not swap every scan interval.
3. When `bannerUnit` becomes invalid/dead:
   - scan alive units in the wave;
   - compute the alive-unit centroid from current X/Z positions;
   - choose the alive unit closest to that centroid.
4. Tie-breakers:
   - The design discussion suggested preferring a unit with a valid target,
     then a unit currently on forward, then the unit further along
     `forwardDir`.
   - Current source does not implement those tie-breakers yet; it simply keeps
     the first alive unit found with the smallest squared distance to centroid.
   - Add tie-breakers only if visual testing shows banner handoff picking an
     awkward holder.

Why centroid, not lane center:

- During combat, units often spread horizontally and vertically.
- The user wants the new flag bearer to move toward the visual center of the
  living formation after the original holder dies.
- Use the center of the actual alive units, not the configured lane center,
  because a wave may be fighting away from its nominal lane.

Performance intent:

- Re-pick only when the current holder is invalid/dead, not every frame.
- The re-pick cost is O(alive units in wave), which is acceptable because it is
  event-like and wave-local.
- Avoid sorting/median unless testing proves centroid gives poor visuals.
- Minimap update is O(waves) for wave positions by reading one
  representative unit per wave, instead of sampling several units per wave.

Implementation status:

- Implemented in `BattleWave` on 2026-06-30.
- `BattleWave.getRepresentativeUnit()` validates/re-picks internally.
- `TrueMiniMapPanel` now uses this method for wave position; if it returns
  null, it falls back to the current sampled-average logic for safety.
- Main battlefield wave banner uses the same representative holder.
- Hero wave has one unit, so representative selection is trivial.
- Pooled-unit safety is handled by `BattleWave.isUnitAlive(...)`, which checks
  wave mapping, node activity, agent, props, and dead state.

Verification done:

- Cocos-bundled TypeScript check with `--skipLibCheck --module ESNext` passed after the latest target, attack-check, and attack-interval changes.
- Scene and prefab JSON parsing passed after legacy serialized fields were removed.
- `git diff --check` passed.
- The user has run repeated Cocos/browser gameplay tests and supplied Chrome traces. The latest attack-interval database change still needs inspector/gameplay verification.
- Required gameplay retest:
  - normal forward after spawn uses the front scanner but does not freehunt merely because an enemy enters search range;
  - normal forward releases the whole wave only when the scanner passes a same-lane or adjacent-lane target;
  - same-lane enemies can also release earlier through attack-range contact;
  - aggressive forward ignores scanner search release completely;
  - both normal and aggressive forward still release when any unit detects an enemy in attack range, when attacked, or when reaching/passing enemy hero line;
  - aggressive wave resumes normal forward after all alive members confirm no target;
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

## June 30 - Wave Banner Icon Setup

- `assets/prefabs/Banner.prefab` is the base billboard banner prefab.
- Five per-unit-type banner prefabs were generated from it:
  - `Banner_LightSword.prefab`
  - `Banner_LightSpear.prefab`
  - `Banner_LightMace.prefab`
  - `Banner_LightArcher.prefab`
  - `Banner_LightCavalry.prefab`
- Each banner prefab has its own material using the corresponding minimap icon
  texture as `mainTexture`.
- The same per-unit-type banner prefab is assigned to both team A and team B
  `UnitPrefabEntry.waveBannerPrefab` slots in `assets/Test.scene`.
- `BattleUnitDatabase` now exposes:
  - `teamAWaveBannerBackgroundColor`
  - `teamBWaveBannerBackgroundColor`
- `GameManager.assignWaveBanner()` reapplies the team background color every
  time a banner is acquired from the pool. This is intentionally runtime-driven
  through `MeshRenderer.setInstancedAttribute('a_billboard_bg_color', ...)`, so
  one unit-type banner prefab can be shared by both teams.
- `assets/materials/Banner.mtl` and all `Banner_*` materials have
  `USE_INSTANCING` enabled. Keep this enabled or team-specific background color
  will fall back to the material default.
- Follow-up fixes done after visual testing:
  - Some banners existed in the hierarchy under the scanner/representative unit
    but the quad was invisible.
  - First suspected issue was instanced tint: `UnlitBillboard.effect` previously
    used `a_billboard_tint` when `USE_INSTANCING` was enabled. If Cocos did not
    bind that custom attribute, the icon could effectively render with alpha 0.
  - `UnlitBillboard.effect` now uses material `tintColor` for the icon tint and
    keeps only `a_billboard_bg_color` as an instanced attribute.
  - All `Banner*.mtl` materials now explicitly serialize `tintColor` as white.
  - `GameManager.applyWaveBannerAppearance()` no longer sets
    `a_billboard_tint`; it only sets `a_billboard_bg_color` from
    `BattleUnitDatabase` team colors.
  - Another banner-loss issue was fixed: when the current representative unit
    despawns, `GameManager.notifyUnitWillDespawn()` now calls
    `BattleWave.handleUnitWillDespawn(unit)`, so the banner can move to another
    alive unit before the old holder node is disabled/recycled.
  - `BattleWave.refreshWaveBanner()` no longer releases the banner immediately
    when no holder is found while the wave still has alive units; this lets a
    later tick retry instead of prematurely returning the banner to the pool.

### Current Banner Status

- Latest user test after the fallback/reapply fix: banners are visible and the
  mixed missing-background issue appears resolved.
- The important runtime fixes are now:
  - `UnlitBillboard.effect` falls back to material `backgroundColor` when
    `USE_INSTANCING` is enabled but `a_billboard_bg_color.a` is effectively 0;
  - `BattleWave.setWaveBanner(...)` accepts an attach callback;
  - `GameManager.assignWaveBanner()` reapplies banner background color after
    the banner is attached or reparented to a holder;
  - `GameManager.applyWaveBannerAppearance()` uses a local color array instead
    of a reused class-level array, so renderer instances do not share a mutable
    params reference.
- Billboard/material tuning now present:
  - `UnlitBillboard.effect` exposes `tilingOffset` for banner main texture UV
    adjustment: `xy = centered UV scale around (0.5, 0.5)`, `zw = offset`;
  - all `Banner*.prefab` files keep node scale at `(1, 1, 1)`;
  - all `Banner*.mtl` materials set `tilingOffset` to `[1.2, 1.2, 0, 0]`,
    which zooms/crops the main texture around the center without scaling the
    banner node;
  - `UnlitBillboard.effect` writes depth and discards fragments below
    `alphaThreshold` before depth write, so overlapping banners sort by depth
    more reliably without transparent quad corners blocking the scene.
- Keep `USE_INSTANCING` enabled on `Banner*.mtl` materials. It allows one
  unit-type banner prefab/material to be shared by both teams while the
  background color changes per instance.
- If background loss ever reappears:
  - first confirm that every runtime banner `MeshRenderer` has the
    `UnlitBillboard` material with `USE_INSTANCING` enabled and material
    `backgroundColor.a > 0`;
  - then check for stale Cocos imported shader/material cache under
    `library/`.

## June 30 - Source Cleanup / Handoff Refresh

- Home Codex re-read current source, current handoff, and recent trace results
  before updating this file.
- No active runtime gameplay source was deleted during this cleanup pass
  because the currently dirty gameplay changes are still tied to active
  gameplay/visual behavior:
  - forward scanner release for same-lane/adjacent-lane pass;
  - wave representative/holder and banner pooling;
  - banner shader/material fallback, centered UV scale, depth write, and alpha
    discard;
  - minimap reading representative unit before sampled-average fallback.
- One obsolete source helper was removed:
  - `assets/scripts/BillboardTint3D.ts`;
  - `assets/scripts/BillboardTint3D.ts.meta`.
- Reason:
  - no `assets/Test.scene` or `assets/prefabs` reference was found;
  - the script still wrote `a_billboard_tint`, but `UnlitBillboard.effect` no
    longer reads that instanced tint attribute;
  - runtime banner team color is now handled directly by
    `GameManager.applyWaveBannerAppearance()` through
    `a_billboard_bg_color`.
- `UnlitBillboard.effect` tooltip was updated so it no longer mentions the
  removed `BillboardTint3D` component.
- `rg` confirmed no live gameplay source still uses the old serialized
  `forwardScanRange`, `forwardScanIntervalFrames`, or
  `useWaveForwardScanner` fields.
- Existing `console.log` calls found in source are behind inspector/debug
  toggles or belong to optional tooling/prototypes such as `SpectorDebugger`
  and `VATCharacterPlayer`; do not remove them as part of wave/banner cleanup
  unless the user asks for a dedicated release-log cleanup pass.
- Do not delete `SpectorDebugger` or `spectorjs.d.ts`: Spector is intentionally
  kept as an optional render-capture helper, and recent performance traces were
  collected with the helper disabled.
- Do not clean `library/`, `temp/`, or `profiles/` just because they are dirty.
  Cocos regenerated many of these while the user tested the banner/logic
  changes.

## July 1 - Banner Camera Visibility

- Wave banners now support camera-driven visibility.
- Files changed:
  - `assets/scripts/BattleWave.ts`
  - `assets/scripts/BattleCinematicCameraController.ts`
  - `assets/scripts/GameManager.ts`
- `BattleWave` exposes `setWaveBannerVisible(visible)` to toggle only the
  banner node. It does not release, recycle, or change the representative
  holder.
- `BattleCinematicCameraController` emits the node event
  `battle-camera-banner-visibility-blocked`:
  - `true` when entering orbit/focus mode;
  - `false` only after smooth return finishes and state is back to idle/top-down.
- `GameManager` listens to that event through its existing
  `cinematicController` component reference and hides all wave banners while
  orbit/return is active.
- `GameManager` also hides/shows banners by top-down camera FOV:
  - `waveBannerHideFovBelow` default `35`;
  - `waveBannerShowFovAbove` default `38`;
  - the gap is intentional hysteresis so banners do not flicker near the zoom
    threshold.
- `GameManager.waveBannerCamera` can be assigned directly. If it is left null,
  `GameManager` tries to read `mainCamera` from the assigned
  `cinematicController`.
- Visibility changes are applied only when the global visible/hidden state
  actually changes, plus once when a new banner is assigned. This avoids setting
  node active state every frame for every wave.
- If a banner is hidden, holder refresh/reparenting can still run; the banner is
  only visually disabled, not removed from its pool/holder lifecycle.

## July 1 - Initial Forward Same-Lane Combat Gate

- New gameplay tweak: during a wave's first forward phase immediately after
  spawn, same-lane attack-range contact no longer releases the whole wave into
  freehunt from the first engaged unit.
- The whole wave enters combat/freehunt only after the number of engaged units
  reaches the wave's `UnitPrefabEntry.maxUnitPerRow`.
- The threshold is stored on `BattleWave` at spawn time through
  `setInitialForwardCombatReleaseThreshold(entry.maxUnitPerRow)`.
- This gate is intentionally narrow:
  - applies only while `BattleWave` is still in its initial forward mode;
  - applies only to same-lane contact detected by normal attack-range proximity;
  - does not apply to adjacent-lane/hero-line forward release;
  - does not apply to retaliation or being attacked from range;
  - does not apply after the wave has already entered combat/freehunt once and
    later returns to forward.
- `BattleWave` disables the gate permanently when it enters combat/freehunt,
  `releaseForwardToFreeHunt()`, `enterCombatMode()`, `forceForwardMode()`, or
  `tryResumeForward()`.
- `GameManager.onWaveCombatStarted(unit, enemy, useInitialForwardGate)` now
  has an optional third argument. Normal attack-range contact uses the gate by
  default. Retaliation and steady hero guard pass `false` so they keep old
  immediate combat behavior.
- While the gate is active, an individual unit can still engage normally. If
  that unit later becomes not busy before the gate threshold is reached,
  `BattleWave.refreshInitialForwardCombatGate()` returns it to forward so it
  does not stand idle behind the still-forward wave.
- Intended visual result: the first row has a chance to form multiple combat
  pairs before the entire wave switches to freehunt, reducing the old
  "everyone borrows the first unit's target and piles into one victim" look.

## July 1 - ArmyBrain Fast React Counter

- `GameManager.spawnEntryFormation()` now emits the node event
  `battle-wave-spawned` after a normal unit wave has been created, filled with
  units, assigned its banner, and added to `GameManager.waves`.
- `ArmyBrain` listens to this event through its assigned `gameManager`.
- New Inspector knob:
  - `fastReactChance` (`0..1`, default `0.5`)
- Fast react behavior:
  - only reacts to enemy waves;
  - respects `runOnlyWhenGameManagerAutoSpawnOff`;
  - requires the brain timer to have reached at least `minSpawnInterval`;
  - respects max alive wave limit and CP affordability;
  - only spawns a real counter unit, never random fallback and never raid;
  - uses existing counter lane selection, so `laneAwareness` and
    `counterSameLaneChance` still matter;
  - after spawning, adds counter assignment to the target wave, resets timer to
    `0`, and randomizes the next normal interval.
- Double-react guard:
  - fast-reacted target wave ids are tracked in `fastReactCounteredWaveIds`;
  - if the target wave is already covered according to
    `attackCounterCoverageRatio`, normal ArmyBrain attack/defense target
    selection skips it;
  - if fast react did not provide enough coverage, normal logic can still add
    more counters later.
- Counter-chain risk is intentionally controlled by `fastReactChance`, CP,
  `minSpawnInterval`, and `maxAliveWaves`. If both brains have very high fast
  react chance and enough CP, some counter-reaction chains are still possible
  by design.

## July 1 - ArmyBrain Flank Aggression Removed

- `ArmyBrain.flankAggression` was removed because it no longer produced a
  distinct, understandable visual behavior under the current lane/freehunt
  design.
- `assets/Test.scene` serialized `flankAggression` fields were removed from
  both ArmyBrain components.
- Counter lane behavior is now controlled by fewer knobs:
  - `counterSameLaneChance`: decides whether a counter tries to spawn in the
    target wave's current lane.
  - `laneAwareness`: if the counter does not spawn same-lane, controls whether
    support-lane selection is pressure-aware or random.
- The old negative same-lane adjustment driven by flank aggression was removed.
  If the target lane is undefended, lane awareness can still increase
  same-lane defense through `getDefenseSameLaneBonus()`.
- `rg` found no remaining `flankAggression` / `flank` references in source,
  scene, or this handoff after the cleanup.

## July 1 - Top-Down Camera Drag Follow Test

- The user reported that drag/drop top-down camera feels laggy or stop-motion
  when framerate drops.
- Source check:
  - `TopDownCameraDrag.updatePosition(deltaTime)` already uses delta-time
    exponential smoothing;
  - `TopDownCameraDrag.updateZoom(deltaTime)` also uses delta-time smoothing;
  - `event.getDelta()` from touch drag should not be multiplied by
    `deltaTime`, because it is already the pointer movement delta between
    input events.
- Current implementation has a separate Inspector knob:
  - `dragFollowSpeed` default in source is `60`;
  - while `isDragging && !isPinching`, `updatePosition()` uses
    `dragFollowSpeed` instead of `smoothSpeed`;
  - while not dragging, it keeps using the existing `smoothSpeed`.
- Important scene note:
  - `assets/Test.scene` currently serializes `dragFollowSpeed` as `15`, the
    same value as `smoothSpeed`;
  - if testing should actually reduce drag lag, raise `Drag Follow Speed` in
    the Inspector, for example `60-120`;
  - setting it to `0` makes drag snap directly to the target position while
    dragging, which is useful only as an extreme comparison.
- Intent:
  - preserve soft camera behavior after release/zoom;
  - make active finger drag follow the target faster under low FPS.
- TypeScript check passed after this camera/source state was inspected.

## July 1 - ArmyBrain Over-Counter Analysis Only

- Obsolete analysis.
- Do not implement fixes from the original July 1 Defense-mode analysis.
- The old ArmyBrain Defense mode, `defenseWaveThreshold`,
  `attackModeChance`, `defenseModeChance`, and raid-defense path were removed
  by the July 2 ArmyBrain cleanup.
- The current replacement design is:
  - no runtime Defense mode;
  - early ArmyBrain spawns use aggressive-forward until the brain has once
    reached `maxAliveWaves`;
  - later ArmyBrain spawns return to normal behavior except explicit
    aggressive raid rules.
- If over-counter or early-pressure behavior needs tuning now, inspect the
  current `ArmyBrain.ts` flow and tune `fastReactChance`,
  `attackCounterCoverageRatio`, lane awareness, counter same-lane chance, CP,
  spawn intervals, and `maxAliveWaves`; do not resurrect the removed Defense
  fields.

## July 2 - ArmyBrain Defense Removed / Early Aggressive Spawn Cleanup

- Implemented in `assets/scripts/ArmyBrain.ts`.
- User-approved design:
  - CP is now fixed and no longer rewarded enough during combat, so late
    "spawn a defense counter near home" rarely happens before CP runs out;
  - remove ArmyBrain Defense as a runtime mode;
  - before a brain's own alive wave count has ever reached `maxAliveWaves`,
    every ArmyBrain spawn should use aggressive-forward, regardless of whether
    it is a counter, opening spawn, random spawn, fallback spawn, or fast-react
    spawn;
  - this makes early waves take the fight forward and keeps combat farther
    away from hero/base: attack is the defense;
  - once the brain has reached `maxAliveWaves` at least once, ArmyBrain spawns
    return to normal behavior unless another existing rule
    explicitly spawns an aggressive raid.
- New internal state:
  - `hasReachedMaxAliveWavesOnce` starts `false`;
  - it becomes `true` permanently once `getAliveWaveCount(team) >=
    maxAliveWaves`;
  - if `enableMaxAliveWaveLimit` is disabled, it is considered already reached
    to preserve older behavior.
- The max-reached check is refreshed from `thinkAndSpawn()` and
  `onBattleWaveSpawned()` so reaching max is recorded during normal decisions
  and immediately after wave spawns. It is intentionally not checked every
  frame because alive-wave counting should not add per-frame allocations.
- ArmyBrain no longer has runtime mode resolution:
  - before max has ever been reached, state log shows
    `ATTACK_EARLY_AGGRESSIVE_SPAWN`;
  - after max has been reached, state log shows `ATTACK`;
  - Defense target selection and Defense same-lane bonus are no longer used by
    runtime ArmyBrain flow.
- Normal target/counter spawns, fast-react counter spawns, opening spawns, and
  random spawns now pass `aggressiveForward = true` while
  `hasReachedMaxAliveWavesOnce` is `false`.
- Once `hasReachedMaxAliveWavesOnce` is `true`, those same spawns pass
  `aggressiveForward = false` and behave like the previous normal flow.
- If any aggressive-forward wave enters freehunt/combat and later resumes
  forward, it resumes as normal forward.
- The old raid-defense path is no longer part of `thinkAndSpawn()` target
  selection.
- Obsolete inspector fields `attackModeChance`, `defenseWaveThreshold`, and
  `defenseModeChance` were removed from `ArmyBrain.ts` and from the two
  ArmyBrain components serialized in `assets/Test.scene`.
- `fastReactChance` remains available:
  - it is an immediate counter reaction;
  - early fast-react counters also spawn as aggressive-forward until max has
    been reached once;
  - it still respects `minSpawnInterval`, CP affordability, max alive wave
    limit, and real-counter availability.
- Scene cleanup was done only for obsolete ArmyBrain fields:
  `attackModeChance`, `defenseWaveThreshold`, and `defenseModeChance` were
  removed from `assets/Test.scene`. Other tuning values were not intentionally
  changed.
- Verification in this pass:
  - `rg` found no remaining obsolete ArmyBrain Defense symbols/properties in
    `assets/scripts` or `assets/Test.scene`;
  - `assets/Test.scene` parses successfully as JSON after the cleanup;
  - `git diff --check` passed for `ArmyBrain.ts`, `BattleWave.ts`, `Unit.ts`,
    `assets/Test.scene`, and this handoff, with only Windows LF/CRLF warnings;
  - TypeScript compile was not run because this workspace does not currently
    have local `node_modules/typescript/bin/tsc`.
- Important handoff instruction for the other Codex:
  - do not rely on older historical sections alone;
  - re-read `assets/scripts/ArmyBrain.ts`, `BattleWave.ts`, `Unit.ts`, and
    `assets/Test.scene`;
  - then compare the current source against this section before changing
    ArmyBrain/wave-forward behavior.

## July 2 / July 3 - LevelSettings Curves

- Implemented in `assets/scripts/LevelSettings.ts`.
- July 2 added `allowFastReact` and mapped it to
  `ArmyBrain.fastReactChance`.
- July 3 added Inspector endpoints for every value driven by level:
  - `initialCombatPointMin` / `initialCombatPointMax`;
  - `aiIntelligenceMin` / `aiIntelligenceMax`;
  - `laneAwarenessMin` / `laneAwarenessMax`;
  - `counterSameLaneChanceMin` / `counterSameLaneChanceMax`;
  - `fastReactChanceMin` / `fastReactChanceMax`;
  - `minSpawnIntervalMinLevel` / `minSpawnIntervalMaxLevel`;
  - `maxSpawnIntervalMinLevel` / `maxSpawnIntervalMaxLevel`;
  - `maxAliveWavesMin` / `maxAliveWavesMax`;
  - `aggressiveForwardChanceMin` / `aggressiveForwardChanceMax`.
- The previous hardcoded values are now only defaults on those properties.
- `aggressiveForwardUnlockAt` remains as a separate threshold so the old raid
  chance curve shape is preserved while still exposing min/max endpoints.
- Current `assets/Test.scene` LevelSettings state at this update:
  - component enabled;
  - `currentLevel = 300`, `totalLevels = 300`, `targetTeam = 1`;
  - all allow toggles are true, including `allowMaxWave`;
  - current serialized ranges are:
    - initial CP: `70 -> 150`;
    - AI intelligence: `0 -> 1`;
    - lane awareness: `0 -> 1`;
    - counter same-lane chance: `0 -> 0.7`;
    - fast-react chance: `0 -> 1`;
    - min spawn interval: `5 -> 2`;
    - max spawn interval: `6 -> 3`;
    - max alive waves: `5 -> 10`;
    - aggressive-forward raid chance: `0 -> 1`;
    - aggressive unlock threshold: `0.45`.
- No longer valid:
  - `LevelSettings` does not use hardcoded `70 -> 180`, `0.4 -> 1`,
    `5/6 -> 2.7/3.7`, `5 -> 15`, or `0 -> 0.25` runtime curves inside
    `applyLevelSettings()`;
  - those values are now editable scene/Inspector properties and may differ
    per scene.

## July 2 - Aggressive Forward Can Release On Adjacent Enemy Hero

- Implemented in `assets/scripts/GameManager.ts`.
- Reason:
  - aggressive-forward waves intentionally ignore normal enemy units in
    adjacent lanes;
  - earlier logic still released aggressive-forward at the enemy hero line;
  - after hero behavior changed so heroes can leave their home line to fight,
    an aggressive-forward wave could keep forwarding if the enemy hero was no
    longer standing on that old line.
- New rule:
  - aggressive-forward still ignores ordinary adjacent-lane units;
  - aggressive-forward still keeps same-lane forward release: if the current
    forward scanner finds a same-lane enemy within `targetSearchRange` and has
    passed it along forward direction, the wave releases to freehunt;
  - the same-lane aggressive scan is throttled by the wave's
    `targetSearchIntervalFrames`, like normal forward scan;
  - aggressive-forward now treats the enemy hero as a special adjacent-lane
    forward target;
  - if the current forward scanner sees the enemy hero within
    `targetSearchRange`, the hero is in the same lane or an adjacent lane, and
    the scanner has passed the hero along forward direction, the wave releases
    to freehunt through `onWaveForwardTargetFound()`.
- Existing hero-line behavior is preserved.
- TypeScript check passed with the Cocos 3.8.8 compiler on the office machine.

## July 2 - Steady Hero Retaliates Against Ranged Attackers

- Implemented in `assets/scripts/Unit.ts`.
- Issue:
  - steady hero guard only kept targets standing inside the hero guard zone;
  - ranged units, especially archers, could stand outside that zone while still
    shooting the hero;
  - `reactToAttacker()` set the attacker as retaliation target, but
    `updateSteadyHeroGuard()` immediately discarded it because the attacker was
    outside the guard zone, so the hero could stand still as a target.
- New rule:
  - steady hero still prefers normal guard-zone targets;
  - if the hero has a valid retaliation target, it keeps that target even when
    the attacker is outside the guard zone;
  - once the hero is already busy fighting a valid target, it also keeps that
    target until it is invalid/dead;
  - after the target is gone, normal guard return behavior resumes.
- TypeScript check passed with the Cocos 3.8.8 compiler on the office machine.

## July 2 - Mobile Performance Trace Review / Banner And Healthbar Batching

The user corrected an overly optimistic desktop-preview interpretation: this
game targets mobile browser, so traces that look "fine" on desktop must still
be treated as borderline if frame pacing is close to the 16.67 ms edge.

Skill update:

- The local Codex skill
  `C:/Users/CPU/.codex/skills/cocos-performance-optimize-skills/SKILL.md`
  was updated on the office machine.
- New reminders added there:
  - do not be overly optimistic from desktop/editor-preview traces when the
    target is mobile browser;
  - treat p95/p99 frame pacing near 16.67 ms as borderline until release/mobile
    testing proves otherwise;
  - check worker CPU and worker heap explicitly;
  - do not rely on V8 desktop GC behavior as proof of mobile-browser safety,
    because mobile browsers may use V8, JavaScriptCore, SpiderMonkey, or
    platform WebView engines.

Performance reports reviewed:

```text
C:/Users/CPU/Downloads/Trace-20260702T170927.json.gz
C:/Users/CPU/Downloads/Trace-20260702T172415.json.gz
```

Updated interpretation:

- These reports do not show catastrophic frame drops, but they are not
  "comfortable" for mobile 60 FPS.
- The second trace is slightly worse than the first:
  - `FireAnimationFrame` p95 rose from about `3.75 ms` to `4.21 ms`;
  - `FireAnimationFrame` p99 rose from about `5.09 ms` to `5.96 ms`;
  - frame gaps over `17 ms` rose from about `0.68%` to `0.93%`;
  - p95/p99 frame gaps sit very close to the 16.67 ms 60 FPS edge.
- On desktop/editor preview this is still playable, but for mobile browser it
  should be treated as borderline. Do not call this "healthy" without real
  release/mobile confirmation.

Second trace key numbers:

- `FireAnimationFrame`:
  - count `6021`;
  - avg `1.846 ms`;
  - p95 `4.209 ms`;
  - p99 `5.956 ms`;
  - max `12.827 ms`;
  - frames over `8.33 ms`: `10`;
  - frames over `16.67 ms`: `0`.
- Frame gaps:
  - avg `16.662 ms`;
  - p95 `16.821 ms`;
  - p99 `16.991 ms`;
  - max `21.139 ms`;
  - gaps over `17 ms`: `56 / 6020`;
  - gaps over `20 ms`: `2 / 6020`;
  - gaps over `33.33 ms`: `0`.
- GPU trace:
  - `GPUTask` avg about `0.211 ms`;
  - p95 about `0.444 ms`;
  - max about `3.847 ms`;
  - no obvious GPU-task spike in this desktop trace.
- Main GC:
  - `MinorGC` count `320`, avg about `0.612 ms`, max `3.229 ms`;
  - `MajorGC` count `30`, avg about `4.626 ms`, max `6.827 ms`;
  - acceptable in this trace, but still watch on mobile.

Worker heap / worker performance:

- Worker heap counters were present in these traces.
- In the second trace:
  - larger worker heap went roughly `0.50 MB -> 2.66 MB`, max about `5.09 MB`;
  - smaller worker heap went roughly `0.45 MB -> 0.75 MB`, max about `1.23 MB`;
  - the larger worker's lower envelope rose during most of the trace but later
    dropped back near `0.5 MB`.
- Current conclusion:
  - no confirmed leak from these traces alone;
  - there is allocation churn in the large worker;
  - for mobile browser, run longer captures and watch the *bottom* of the
    sawtooth, not only the peak;
  - if the GC baseline keeps climbing over 5-10 minutes, investigate retained
    worker queues, request records, or typed-array/object allocation.
- CPU profile from the second trace:
  - target-search worker was almost idle;
  - RVO worker had some real active work, but still not the primary bottleneck;
  - notable worker samples included `collectNeighbors`, `key`, `step`,
    `compareNeighbors`, `applyAllyOvertake`, and `buildGrid`.

Where the performance issue appears to be:

- The stronger signal is still engine/render/WebGL work rather than game AI or
  workers.
- Main sampled hot areas in the second trace included:
  - `bufferData`;
  - `WebGL2CmdFuncBindStates`;
  - `getUniformBlock`;
  - `addConstantBuffer`;
  - `bindBuffer`;
  - `updatePerPassUBO`;
  - Cocos bundled engine functions such as `toArray`, `get`, `assert`,
    `update`, and `_loop`.
- Game script sample totals were much smaller:
  - `Unit.ts` around `164 ms` sampled over about 100 seconds;
  - `BattleSpatialGrid.ts` around `72 ms`;
  - `GameManager.ts` around `30 ms`;
  - `UnitProps.ts` around `5-6 ms`.
- Do not optimize ArmyBrain/target-worker first based on these reports. The
  next measured direction should be render/material/mesh/animation/batching.

Healthbar batching status:

- `assets/scripts/HealthBar3D.ts` uses:
  - `renderer.setInstancedAttribute('a_health_params', ...)`;
  - `renderer.setInstancedAttribute('a_bar_color', ...)`.
- This is the correct pattern for many units with different health values.
  Different health ratios should not by itself split draw calls.
- `HealthBarMat.mtl` has `USE_INSTANCING` enabled.
- Blue and Red unit prefabs both reference the same `HealthBarMat` UUID
  (`5f434786-d4f3-41f9-81b1-15a1fa9fd12b`), so healthbars are not split by
  team material.
- Healthbar updates currently happen on spawn/reset and on damage/heal, not
  every frame.
- Remaining healthbar risks:
  - `HealthBar3D.applyHealthParams()` toggles `renderer.enabled` when
    full-health bars hide/show; many units changing visibility together can
    churn render lists/batches;
  - `setHealthRatio()` currently applies even when the clamped ratio is
    unchanged, so a future micro-optimization could early-return;
  - many simultaneous damage events still upload instanced data, but this is
    still better than per-unit material properties.
- Important clarification:
  - `setInstancedAttribute` is not the problem for healthbars;
  - it is exactly how per-unit health should be supplied without making a
    unique material per unit.

Banner batching status:

- Banner rendering is more suspicious than healthbar.
- `UnlitBillboard.effect` supports `USE_INSTANCING` and uses
  `a_billboard_bg_color` for per-instance team/background color.
- Team color/background is therefore correctly handled with an instanced
  attribute and should not require material variants for team A vs team B.
- However, the current banner setup uses one material per troop icon:
  - `Banner_LightSword.mtl`;
  - `Banner_LightArcher.mtl`;
  - `Banner_LightSpear.mtl`;
  - `Banner_LightMace.mtl`;
  - `Banner_LightCavalry.mtl`;
  - etc.
- Each of those materials binds a different `mainTexture` icon. Even with
  `USE_INSTANCING`, GPU instancing normally requires the same material and the
  same texture binding, so banners will be split at least by troop icon
  material/texture.
- AutoAtlas on the banner icon folder may help Sprite/SpriteFrame workflows,
  but it does not automatically make `MeshRenderer` materials that each bind a
  different `mainTexture` become one shared material. If the material still
  references different texture assets, draw calls remain split.
- `setInstancedAttribute` cannot pass a different texture per instance.
  Textures are resource bindings on the material/pass. Instancing can pass
  small numeric/vector data only, such as color, alpha, UV rect, health ratio,
  or state.
- Correct future banner batching direction:
  - pack all troop icons into a single atlas texture;
  - use one shared banner material pointing at that atlas;
  - pass the per-banner icon rectangle as an instanced attribute, for example
    `a_icon_uv_rect = [offsetX, offsetY, scaleX, scaleY]`;
  - keep team/background color as `a_billboard_bg_color`;
  - this is the path that can let different icon banners batch/instance
    together.

Banner CPU-side notes:

- `GameManager.processWaveBanners()` currently runs every frame and loops over
  waves, then calls `wave.refreshWaveBanner()`.
- Most calls return quickly when the banner is already parented to the current
  representative unit.
- More expensive banner operations occur when the representative/holder dies:
  - `BattleWave.refreshWaveBanner(true)` reparents the banner while preserving
    world transform and starts a tween to local `(0, 0, 0)`;
  - `GameManager.applyWaveBannerAppearance()` calls
    `getComponentsInChildren(MeshRenderer)` when a banner is assigned or
    attached.
- These did not dominate the supplied trace, but if banner count grows, cache
  banner renderer refs and consider throttling/dirty-flagging banner refresh
  instead of checking all waves every frame.

## Current Next Best Direction

For the next session, unless the user changes direction:

- Continue performance work with mobile-browser skepticism:
  - desktop/editor preview reports are useful but not proof of mobile safety;
  - inspect frame gaps, main thread, GPU/render work, GC, worker CPU, and worker
    heap in every performance review;
  - avoid calling a trace "healthy" if p95/p99 frame pacing is already near
    16.67 ms.
- If investigating batching next, focus first on banner material/texture split:
  - current healthbar instancing is conceptually correct;
  - current banner instancing is limited because each troop icon is still a
    different material/texture;
  - the real fix is a shared atlas texture plus per-instance UV rect, not
    trying to set a different texture through `setInstancedAttribute`.
- Visually test the ArmyBrain early aggressive spawn rule:
  - before that brain has ever reached `maxAliveWaves`, every ArmyBrain-spawned
    wave should spawn aggressive-forward and push combat away from hero/base;
  - after that brain has once reached `maxAliveWaves`, ArmyBrain-spawned waves
    should return to normal non-aggressive behavior, except explicit aggressive
    raid rules;
  - ArmyBrain should no longer enter Defense or pick targets through the old
    raid-defense path.
- Visually test the June 29 forward/freehunt reconciliation in Cocos before
  adding more battle logic:
  - normal forward does not freehunt just because an adjacent-lane enemy enters
    search range;
  - normal forward releases only after the front scanner passes a same-lane or
    adjacent-lane target;
  - same-lane contact can still release earlier through attack range;
  - aggressive forward does not release from scanner visibility;
  - both modes still release wave-wide from attack-range contact, retaliation,
    and hero-line reach/pass.
- Visually test the latest hero-phase rewrite:
  - unlocked hero should behave like a normal one-unit mid-lane forward wave;
  - existing enemy waves should return to normal/aggressive forward, not chase
    hero through full-map freehunt;
  - newly spawned waves after hero unlock should still begin in their normal or
    aggressive forward mode.
- Test the implemented wave banner / representative holder behavior with real
  `waveBannerPrefab` assignments in `BattleUnitDatabase`:
  - initial banner attaches to the alive unit closest to the wave centroid;
  - when the holder dies, banner detaches from old holder, keeps world
    position, reparents to the new holder, then tweens back to local
    `(0, 0, 0)`;
  - when no holder remains, the banner returns to its own pool;
  - pooled unit reuse must never carry an old banner;
  - minimap icon position should follow the same representative holder as the
    battlefield banner.
- Test `PlayerArmyController` single tap versus double tap:
  - single tap spawns normal forward after the short `doubleTapWindow`;
  - double tap spawns aggressive forward;
  - changing lane during the double-tap window does not move the pending spawn.
- Test `LevelSettings` in Cocos after Inspector edits:
  - toggle each `allow*` field independently and confirm only the intended
    `ArmyBrain`/CP value changes;
  - verify level 1 uses every `*Min`/`*MinLevel` endpoint and max level uses
    every `*Max`/`*MaxLevel` endpoint;
  - verify `aggressiveForwardUnlockAt` delays only the aggressive raid chance,
    not the other curves;
  - remember that `maxAliveWaves` also affects how long the new ArmyBrain
    early-aggressive phase lasts.
- Complete and test the `PlayerArmyController` Inspector wiring before adding
  more bottom-UI behavior.
- Confirm that `ArmyBrainA` is disabled during manual-control tests.
- Test lane highlight exclusivity, exact database-name matching, insufficient
  CP behavior, and repeated icon taps.
- Keep skills out of scope until the user explicitly resumes that part.
- For future performance checks, keep inspecting main, RVO worker, and
  target-search worker separately. Include JS heap / DOM node / listener
  counters when possible because the two latest traces did not contain those
  memory tracks.
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
- Always cross-check this handoff against current source before coding. If a
  historical section conflicts with source, trust current source first and
  update this handoff after confirming with the user.
- Ask the user before broad reversions or deleting experimental files.
