# AI-CONTEX

Handoff note for the other Codex instance working on `BattleGame`.

Last updated: 2026-06-24.

The user runs two Codex sessions on different machines. These sessions do not share memory. Always read this file and re-check the current source before making changes. Treat this handoff as orientation, not as a substitute for source inspection.

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

- Current HEAD while writing this handoff: `f49c42cb backup`.
- Permanent-freehunt, dynamic-lane, and retaliation work is currently uncommitted.
- Expected source changes:
  - `AI-CONTEX.md`
  - `assets/scripts/BattleWave.ts`
  - `assets/scripts/GameManager.ts`
  - `assets/scripts/Unit.ts`
  - `assets/scripts/UnitBehavior.ts`
- Per-unit `attackRange` database/spawn plumbing is already present in HEAD.
- Run `git status --short` before editing because the user may commit, reverse, or continue testing from the other machine.

## Important Source Files

- `assets/scripts/GameManager.ts`: battle orchestration, spawn, dynamic wave lane, hero unlock, spatial grid rebuild, RVO step.
- `assets/scripts/BattleWave.ts`: wave state, dynamic laneId synchronization, aggressive-forward checks, runtime alive/engaged cache.
- `assets/scripts/Unit.ts`: initial forward/aggressive-forward, permanent freehunt, target search, engage, retaliation targeting.
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

Waves spawn into a lane and begin in initial forward or aggressive-forward mode.

Current source-verified state flow:

```text
Spawn -> Forward/Aggressive Forward
      -> pass a valid same/adjacent-lane enemy, or any unit engages/is engaged
      -> permanent Free Hunt
```

- There is no regroup, lane-return, recovery timeout, or return to normal/aggressive forward.
- `freeHuntNoTargetRecoveryFrames`, wave recovery maps, formation-slot return, and related runtime logic were removed.
- In permanent freehunt:
  - a unit with a valid target chases it;
  - a unit without a valid target first performs its own throttled nearest-enemy search;
  - only when its own search has no result does it borrow a valid target from a teammate;
  - if the wave has no available target, units keep moving straight along their original `forwardDir`;
  - this straight movement does not set `onForward`, does not run forward scan, and does not restore aggressive-forward behavior.

Important invariant:

- If one unit in a wave engages, both involved waves leave initial forward and enter permanent freehunt.
- `aggressiveForward` is cleared when a wave enters freehunt/combat.
- Do not reintroduce per-unit exceptions that leave part of a wave in initial forward after engagement.

Current freehunt target behavior:

- Each unit first tries to find its own nearest target on its staggered `targetSearchIntervalFrames`.
- If its own search has no result, it may borrow a valid target from a teammate in the same wave.
- Borrowing is secondary to reduce all units piling onto one target too early.
- Because unit search frames are staggered, units that have not reached their own search tick may temporarily borrow the target found by an earlier teammate. This can still create some focus-fire behavior, but every unit retains the opportunity to perform its own search.
- Existing valid targets remain valid outside `targetSearchRange` until the target dies/despawns.
- Retaliation rule:
  - after damage is applied, a defender that is not `onBusy` replaces its current chase target with the attacker;
  - retaliation ignores `targetSearchRange`, so melee units can chase ranged attackers that fired from outside normal search range;
  - an already engaged (`onBusy`) defender never switches target;
  - the first valid retaliation attacker is retained until it dies/despawns or the defender enters actual attack-range engagement, preventing target oscillation from alternating ranged hits;
  - `GameManager.onWaveCombatStarted()` is called as a guard so both involved waves are in permanent freehunt.

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

- Lane no longer controls regroup or freehunt movement; it is strategic metadata for ArmyBrain and lane-aware initial forward scans.
- `GameManager.processDynamicWaveLanes()` updates each wave on the same cadence as that wave's cached `targetSearchIntervalFrames`.
- Updates are staggered by `wave.id` so all waves do not vote on the same frame.
- Lane vote counts alive units by visible `unit.node.worldPosition.x`.
- The lane with the highest unit count becomes `wave.laneId`, and that laneId is synchronized to every alive member.
- On a tie, keep the current lane if it is one of the tied winners; otherwise choose the tied lane whose center is closest to average wave X.
- Dynamic lane stays on the main thread. The vote is a small O(units-in-wave) scan at a throttled interval; worker snapshot/message cost would be larger and introduces stale results.

Per-unit attack range:

- `UnitPrefabEntry.attackRange` now exists in `BattleUnitDatabase`.
- `GameManager -> UnitSpawner -> Unit.attackRange` assigns it on every spawn, including pooled reuse.
- `targetSearchRange` remains shared through the Unit prefab.

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

- Normal waves use existing forward/freehunt rules.
- Aggressive-forward waves ignore passed adjacent-lane enemy units during forward.
- Same-lane enemies can still release the wave into normal freehunt.
- Enemy hero can still release freehunt when it is in the same or adjacent lane.
- Actual attack-range engage still uses normal wave-wide combat.
- Once the wave passes/engages an enemy and enters freehunt, aggressive forward ends permanently for that wave.

ArmyBrain raid rules:

- Counter spawn remains the main priority.
- Raid may happen when there is no valid target or the selected spawn would be fallback/non-counter.
- Raid lane must be empty at the ArmyBrain snapshot: no enemy wave and no ally wave counted in that lane.
- Raid unit selection prefers highest `maxSpeed` among affordable entries; if too expensive, it naturally falls to the next fastest affordable entry.
- Raid defense reuses `defenseModeChance`; no extra defense knob was added.
- If an enemy aggressive-forward wave threatens hero lane or adjacent hero lane, AI can override target selection to defend that raid.

## Hero Logic

Hero is treated as a special mid-lane unit/wave conceptually, but still has special rules in code.

- Initially `isSteady = true`.
- It can attack back in place if enemy enters range.
- It unlocks/freehunts when its team cannot spawn normal units anymore and has no alive normal units/waves.
- When one team hero unlocks, normal enemy waves are forced into freehunt pressure.
- Enemy hero does not auto-unlock just because the other hero unlocked.
- Hero kills do not award CP.

Recent caution:

- A previous hero-phase fix was suspected to affect frame time, but later profiling also showed browser/tab noise and render/GPU cost can dominate. Re-measure before blaming hero logic.
- Hero-pressure freehunt search now uses `GameManager.getHeroPressureSearchRange()`, which covers the battlefield diagonal plus margin. This prevents newly spawned enemy waves from being forced out of forward and then standing idle because the fixed inspector `heroFreeHuntSearchRange` was too short.

## Gameplay Notes On 2026-06-24

Hero-pressure spawn idle fix:

- Bug observed by user: when the last non-hero unit of team B died and team A spawned a new wave at the same moment, the new A wave could stand still at spawn.
- Likely source path:
  - B loses last normal unit,
  - B hero unlocks,
  - enemy normal waves are forced into hero-pressure freehunt,
  - a just-spawned A wave also hits `shouldForceTeamFreeHunt(team)` inside `spawnEntryFormation()`,
  - forward is disabled,
  - if fixed `heroFreeHuntSearchRange` cannot see hero/enemy from spawn, the wave has no target and appears idle.
- Current implementation:
  - added `getHeroPressureSearchRange()`,
  - uses battlefield width/depth plus spawn Z extents to compute a range covering the whole battlefield,
  - `unlockHeroForward()` and `forceWaveToHeroPressureFreeHunt()` use that range instead of the fixed inspector value directly.
- This keeps the design intent of endgame pressure/freehunt, while avoiding spawned waves being kicked out of forward without a reachable target.

Verification done:

- Cocos-bundled TypeScript check with `--skipLibCheck --module ESNext` passed after permanent-freehunt, dynamic-lane, and retaliation changes.
- `git diff --check` passed for touched TypeScript files.
- Cocos preview/runtime was not run from this Codex session.
- Required gameplay retest:
  - normal forward passes same/adjacent wave and never regroups;
  - aggressive forward ignores adjacent units but ends permanently on same-lane pass or engage;
  - ranged engage makes both waves freehunt;
  - all targets disappear and surviving units continue straight rather than stopping/regrouping;
  - dynamic lane follows majority position without tie flicker;
  - ArmyBrain counter/raid lane selection still looks reasonable with dispersed waves;
  - ranged attacker outside melee search range pulls a non-busy defender away from its old chase target;
  - already-busy melee defenders ignore ranged retaliation;
  - alternating ranged attackers do not make a defender rapidly switch targets;
  - retaliation target death/despawn returns the defender to ordinary self-search/share-target behavior.

Implementation caution:

- There are many editor/generated dirty files under `build/`, `library/`, and `temp/`. Do not revert them blindly.
- Scene, profile, build, library, and temp files may contain user/editor changes unrelated to the current gameplay work.
- Do not discard the current uncommitted gameplay changes unless the user explicitly asks to reverse them.

## Performance Systems

Currently active performance-oriented systems:

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
- RVO only selects the main-thread simulator when Worker support is unavailable during simulator creation. A runtime RVO worker error currently logs and clears `pending`; it does not automatically replace itself with `RVOSimulator`.
- Unit target/attack scans are throttled:
  - `attackCheckIntervalFrames`
  - `targetSearchIntervalFrames`
  - forward scan intervals
- Forward scanning uses wave/front-most scanner logic instead of every unit scanning every frame.
- `BattleWave` has runtime per-frame cache for alive/engaged scans.
- Dynamic lane voting is wave-level, throttled by cached target-search interval, and frame-staggered.
- Minimap uses pooling, interval updates, sampling, and grid-based icon separation.

Latest performance trace:

- File: `C:/Users/CPU/Downloads/Trace-20260624T173811.json.gz`
- Duration: about `86.7 s`, DevTools iPhone XR emulation.
- `FireAnimationFrame` excluding profiler-start artifact:
  - avg `1.886 ms`
  - p50 `1.382 ms`
  - p95 `4.012 ms`
  - p99 `6.093 ms`
  - max `10.568 ms`
  - 6 of 5177 frames over `8.33 ms`
  - 0 frames over `16.67 ms`
- Dynamic lane cost was negligible across the whole trace:
  - `processDynamicWaveLanes`: about `0.02 ms` self time total;
  - `refreshDynamicLaneForWave`: about `1.04 ms` self time total;
  - `getMajorityLaneIdForWave`: about `0.92 ms` self time total.
- Do not move dynamic lane voting to a worker based on current evidence.
- Largest game-code self-time remained `BattleSpatialGrid.flushNearestWorkerRequests`, mainly main-thread request packing/posting.
- Workers were mostly idle; no evidence that permanent freehunt or dynamic lane caused a major CPU regression.
- Main-thread GC was somewhat stronger than the good June 22 baseline, but still produced no frame over `16.67 ms`; continue monitoring rather than changing architecture from this one trace.

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

## Current Next Best Direction

For the next session, unless the user changes direction:

- Test permanent-freehunt, dynamic-lane, and retaliation behavior before adding more battle logic.
- Do not optimize or move dynamic lane to a worker without a new trace proving it is material.
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
