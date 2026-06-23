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
- `package.json` currently has no reliable typecheck/build script. Cocos Editor/preview is the practical compile check; `git diff --check` is still useful.
- Cocos may generate noisy changes under `library/` and `temp/`. Do not treat those as source logic unless the user asks.

## Important Source Files

- `assets/scripts/GameManager.ts`: battle orchestration, spawn, wave recovery, hero unlock, spatial grid rebuild, RVO step.
- `assets/scripts/BattleWave.ts`: wave state, laneId, aggressive-forward checks, runtime alive/engaged/target cache.
- `assets/scripts/Unit.ts`: forward/freehunt behavior, target search, engage, lane return, aggressive forward.
- `assets/scripts/UnitBehavior.ts`: attack interval, damage, kill callback.
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

Waves spawn into a lane. Units inherit wave lane data and move through forward, freehunt, and lane-return/recovery phases.

Current source-verified recovery baseline:

- Full square regroup was removed earlier.
- Recovery currently uses `GameManager.regroupWaveByMajorityLane()`.
- The lane chosen for recovery is the majority lane of alive units in that wave.
- Lane vote is based on the unit's visible world X position: `unit.node.worldPosition.x`.
- If multiple lanes tie for highest alive-unit count, randomly choose among the tied lanes only.
- Do not prefer the previous `wave.laneId` on tie unless it is actually part of the tied vote result.
- A lane with zero votes must never be selected.
- If no lane can be resolved, the wave resumes forward.
- A wave should recover only after it has no engaged units and no valid target for `freeHuntNoTargetRecoveryFrames`.

Important invariant:

- If one unit in a wave engages, the whole wave must leave forward/regroup and enter combat/freehunt.
- Avoid adding exceptions where one unit remains in freehunt while the rest of the wave regroups.

Current freehunt target behavior:

- Each unit first tries to find its own target.
- If it cannot find one, it may borrow a valid target from a teammate in the same wave.
- Borrowing is secondary to reduce all units piling onto one target too early.

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
- The aggressive-forward flag currently persists after recovery/resume.

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

## Gameplay Fixes On 2026-06-24

Source file touched:

- `assets/scripts/GameManager.ts`

Lane recovery fix:

- Bug observed by user: after combat, a surviving unit/wave could regroup to an unrelated lane, for example a unit visually in right lane regrouping all the way to left.
- Confirmed old source behavior: `getMajorityLaneIdForWave()` used `unit.agent.pos.x` and resolved ties by preferring current `wave.laneId`.
- This was too easy to misread visually and also did not match the user's intended rule.
- Current intended rule:
  - after combat/freehunt,
  - once no unit is busy and no target is in search range long enough,
  - count all alive units by the lane they are visibly standing in,
  - choose the lane with most alive units,
  - if tied, random only among tied lanes.
- Current implementation:
  - uses `unit.node.worldPosition.x` for lane vote,
  - computes max vote count,
  - randomly selects among lanes whose count equals max,
  - returns `-1` only when no alive unit contributed a vote.
- Important invariant:
  - do not add combat-anchor, enemy-lane, killer-lane, or previous-lane bias unless the user explicitly changes the rule.

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
  - `recoverHeroWaveCombat()`, `unlockHeroForward()`, and `forceWaveToHeroPressureFreeHunt()` now use that range instead of the fixed inspector value directly.
- This keeps the design intent of endgame pressure/freehunt, while avoiding spawned waves being kicked out of forward without a reachable target.

Verification done:

- `git diff --check -- assets/scripts/GameManager.ts` passed.
- Cocos preview/runtime was not run from this Codex session. User should retest:
  - combat ending with 1 surviving unit in a lane,
  - tied lane vote cases,
  - new wave spawning exactly as the enemy loses its last non-hero unit.

Implementation caution:

- There are many editor/generated dirty files under `build/`, `library/`, and `temp/`. Do not revert them blindly.
- `assets/Test.scene`, `profiles/v2/packages/*`, and generated files may have user/editor changes unrelated to these two code fixes.

## Performance Systems

Currently active performance-oriented systems:

- RVO worker via `RVOWorkerSimulator`.
- RVO step throttled by `GameManager.updateInterval`.
- Spatial grid rebuild via `spatialGridUpdateInterval`.
- `BattleSpatialGrid` batched nearest-target worker named `BattleSpatialGridTargetWorker`.
- Main-thread fallback exists if worker creation or messaging fails.
- Target worker uses reusable typed arrays.
- Unit target/attack scans are throttled:
  - `attackCheckIntervalFrames`
  - `targetSearchIntervalFrames`
  - forward scan intervals
- Forward scanning uses wave/front-most scanner logic instead of every unit scanning every frame.
- `BattleWave` has runtime per-frame cache for alive/engaged/valid-target scans.
- Minimap uses pooling, interval updates, sampling, and grid-based icon separation.

Avoid reintroducing:

- Full-unit scans in hot loops.
- `Array.from(...)` in repeated recovery loops.
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

- Do not integrate VAT into battle.
- Continue testing the current gameplay state.
- Investigate mesh/animation performance on the existing pipeline.
- Keep unit mesh budgets realistic for mobile web.
- Use Chrome Performance for frame time and Spector for render commands/state.
- Disable Cocos profiler overlay when collecting final performance captures.

## Collaboration Notes

- The user may switch between the office Codex and home Codex.
- Always assume the other Codex may have changed source since this file was written.
- Re-read actual files before editing battle logic.
- Ask the user before broad reversions or deleting experimental files.
