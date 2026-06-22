# AI-CONTEX

Handoff note for the other Codex instance working on `BattleGame`.

Last updated: 2026-06-23.

The user uses two Codex sessions on two machines. These sessions do not share chat memory. Before changing code, read this file and re-check the current source. Do not rely on older conversation memory if source has changed.

## Working Rules

- Mobile browser performance is a core design constraint.
- Prefer small, source-local changes. Avoid architecture growth unless a measured problem requires it.
- Do not revert user/editor changes unless explicitly asked.
- Do not leave permanent logs in hot paths. Debug logs must be behind inspector toggles such as `enableDebugLog`, `enableStateLog`, `enableAggressiveForwardLog`, or similar.
- Use `rg` first for code search.
- `package.json` currently has no clear typecheck/build script. Usually run `git diff --check`; Cocos Editor/preview is the practical compile check.
- Cocos may generate noisy changes under `library/` and `temp/`. Do not treat those as source logic unless the user asks.

## Important Files

- `assets/scripts/GameManager.ts`: battle orchestration, spawn, wave recovery, hero unlock, spatial grid rebuild, RVO step.
- `assets/scripts/BattleWave.ts`: wave state, `laneId`, combat/freehunt state, runtime alive/target/engaged cache.
- `assets/scripts/Unit.ts`: unit movement, forward/freehunt behavior, target search, engage, lane return.
- `assets/scripts/UnitBehavior.ts`: attack interval, damage, kill callback.
- `assets/scripts/BattleSpatialGrid.ts`: spatial grid, batched nearest-target worker, main-thread fallback.
- `assets/scripts/rvo/RVOWorkerSimulator.ts`: RVO worker wrapper.
- `assets/scripts/ArmyBrain.ts`: AI spawn/counter/lane/raid logic.
- `assets/scripts/TrueMiniMapPanel.ts`: current minimap.
- `assets/scripts/BattleInformationIconItem.ts`: still used by the current minimap icon visual. Do not delete casually.
- `assets/scripts/SpectorDebugger.ts`: SpectorJS render capture helper added on 2026-06-22.
- `cocos-performance-optimize-skills/SKILL.md`: project-local Cocos performance skill/playbook. Read it before doing broad optimization work.

## Current Gameplay Logic

The game is a two-team lane battle with 3 lanes:

- `0 = left`
- `1 = mid`
- `2 = right`

Waves spawn into a lane. Units inherit wave lane data and move forward, freehunt, or return to lane depending on wave state.

Current recovery baseline:

- Full square regroup was removed earlier.
- Current recovery uses lightweight lane/slot return.
- After combat/freehunt recovery, lane is decided by majority position of alive units, not by enemy lane, target lane, or last kill.
- `GameManager.regroupWaveByMajorityLane()` is the key recovery path.

Important invariant:

- If one unit in a wave engages, the whole wave must leave forward/regroup and enter combat/freehunt.
- A wave should resume regroup/forward only when no unit is engaged and the wave has no valid target for `freeHuntNoTargetRecoveryFrames`.

Current freehunt target behavior:

- Each unit first tries to find its own target.
- If it cannot find one, it may borrow a valid target from a teammate in the same wave.
- Borrowed target sharing is intentionally secondary, to reduce all units piling into one target too aggressively.

Known intentionally removed ideas:

- Hard ban on backward chase. It caused units to stand still or fail to forward.
- Lane decision from selected target. It caused target fixation and awkward lane changes.
- Lane decision from last killed enemy. It caused adjacent waves to pass each other or units to run back to old lanes.
- Persistent event/counter bookkeeping for alive/engaged state. It was tested and did not improve frametime; runtime per-frame cache is the current baseline.

## Aggressive Forward Raid

Added recently so lane choice matters more.

Source state:

- `Unit.aggressiveForward` exists and resets to `false` on despawn.
- `GameManager.spawnWaveByEntry(..., aggressiveForward = false)` passes the flag to spawned units.
- `BattleWave.hasAggressiveForward()` checks whether a wave has active aggressive-forward units.
- `ArmyBrain.aggressiveForwardChance` controls raid chance.
- `ArmyBrain.enableAggressiveForwardLog` controls raid logs.

Behavior:

- Normal waves use existing forward/freehunt rules.
- Aggressive-forward waves ignore passed adjacent-lane enemy units during forward.
- Same-lane enemies can still trigger normal release/freehunt.
- Enemy hero can still trigger release/freehunt in same/adjacent lane.
- Actual attack-range engage still uses normal wave-wide combat.
- Aggressive-forward flag persists after recovery/resume unless design changes later.

ArmyBrain raid rules:

- Counter spawn remains priority.
- Raid may happen when there is no valid target or selected spawn would be fallback/non-counter.
- Raid lane must be empty at the ArmyBrain snapshot: no enemy wave and no ally wave counted in that lane.
- Raid unit selection prefers highest `maxSpeed` among affordable entries; if too expensive, it naturally falls to next fastest affordable entry.
- Raid defense reuses `defenseModeChance`; no extra defense knob was added.
- If an enemy aggressive-forward wave threatens hero lane or adjacent hero lane, AI can override target selection to defend that raid.

## Hero Logic

Hero is treated as a special one-unit wave in mid lane.

- Initially `isSteady = true`.
- It can attack back in place if enemy enters range.
- It unlocks/freehunts when its team cannot spawn normal units anymore and has no alive normal units/waves.
- When one team hero unlocks, normal enemy waves are forced into freehunt pressure.
- Enemy hero does not auto-unlock just because the other hero unlocked.
- Hero kills do not award CP.

## Performance Systems

Currently active performance-oriented systems:

- RVO worker via `RVOWorkerSimulator`.
- RVO step throttled by `GameManager.updateInterval`.
- Spatial grid rebuild via `spatialGridUpdateInterval`.
- `BattleSpatialGrid` batched nearest-target worker named `BattleSpatialGridTargetWorker`.
- Main-thread fallback exists if worker creation or messaging fails.
- Target worker currently uses reusable typed arrays:
  - `targetSnapshot: Float64Array`
  - `packedRequestData: Float64Array`
- Unit target/attack scans are throttled:
  - `attackCheckIntervalFrames`
  - `targetSearchIntervalFrames`
  - forward scan intervals
- Forward scanning uses wave/front-most scanner logic instead of every unit scanning every frame.
- `BattleWave` has runtime per-frame cache for alive/engaged/valid-target scans.
- Minimap uses pooling, interval updates, sampling, and grid-based icon separation.

Current render-friendly implementation details:

- `HealthBar3D` uses instanced attributes for per-unit health/color data.
- Healthbar material should stay shared. Do not create one material instance per unit/healthbar.
- If adding more healthbar states later, prefer more instanced attributes or compact per-instance data.
- Battlefield unit tap/orbit focus is event-driven, not per-frame. It can scan alive units on tap/click; optimize with spatial grid only if measured as a problem.

Avoid reintroducing:

- Full-unit scans in hot loops.
- `Array.from(...)` in repeated recovery loops.
- Per-query closure allocation in target search.
- Unpooled request objects.
- Per-unit material instances or per-frame material property writes.

## SpectorJS Added On 2026-06-22

Installed package:

- `spectorjs@0.9.30` in `devDependencies`.

Added files:

- `assets/scripts/SpectorDebugger.ts`
- `assets/scripts/SpectorDebugger.ts.meta`
- `assets/scripts/spectorjs.d.ts`
- `assets/scripts/spectorjs.d.ts.meta`

How to use:

- Add/enable `SpectorDebugger` on a debug node.
- Tick `Enable Spector`.
- Press `F8` in browser preview/build to capture.
- `autoDownloadCaptureJson = true` downloads a file named like `spector-capture-...json`.
- Last capture is also exposed as `window.__battleGameSpectorCapture`.

Implementation note:

- The component uses `captureCanvas(canvas, captureCommandCount)` instead of `captureNextFrame(...)`.
- Reason: Spector's next-frame capture relies on `requestAnimationFrame` hooks. Cocos may cache RAF before the scene component loads, causing "No frames detected".
- The embedded Spector UI has no obvious export button in this project, so auto-download was added.
- Spector is heavy. Keep it disabled outside profiling sessions.

## Render Profiling Findings On 2026-06-22

Files inspected:

- `spector-capture-2026-06-22T11-46-38-673Z.json`
- `spector-capture-2026-06-22T11-55-02-938Z.json`

Important capture caveat:

- Command capture can include multiple render passes/frames.
- `Capture Command Count = 500` was cut at 500 commands.
- `Capture Command Count = 1500` was also cut at 1500 commands and contained about 5 render cycles.
- Do not treat total command/triangle count from a 1500-command capture as one frame. Group by render pass/frame.

Stable render facts from the captures:

- Canvas: `828 x 1792`, client: `414 x 896`, so effective DPR is 2.
- WebGL context reports `SAMPLES = 4`, so MSAA is active.
- Draw calls are low and acceptable: about `11 draw calls/frame` in the 1500-command report.
- Instancing is working. Unit body is drawn through `drawElementsInstanced`.
- Unit mesh draw uses `10092 indices`, which equals `3364 triangles` per unit.
- Estimated per-frame triangles in the 1500-command report: about `266k - 293k triangles`.
- At 300 units, unit body alone can approach about `1M triangles/frame`. This is the main render/GPU risk.

Mesh note:

- Cocos inspector showed about `7268 vertices`, `3364 triangles`.
- Blender showed `1757 vertices`, `3364 triangles`.
- This mismatch is expected: Cocos/GPU vertices are split by UV seams, split normals/hard edges, tangents, material/submesh/skinning attributes. Triangles match, so geometry count is not secretly increasing; GPU vertex count is inflated by render attributes.

Current render conclusion:

- Draw call count is not the main issue right now.
- Mesh/triangle cost is the strongest current render-performance suspect.
- Next render optimization should focus on lower-poly/LOD/VAT/crowd mesh strategy before micro-optimizing draw calls.

Secondary render/UI findings:

- Captures show repeated `texSubImage2D`, `createTexture`, and `deleteTexture` from:
  - `TextProcessing._uploadTexture`
  - `DynamicAtlasTexture.drawTextureAt`
- Likely source: changing system-font Labels such as kill/CP/debug stats.
- Relevant code:
  - `GameManager.refreshBattleStatsUI()`
  - `SpawnBackPressureGate.updateDebugLabel()`
  - `DebugStats` overlay if enabled
- Recommendation:
  - Only set `Label.string` when value actually changed.
  - Throttle debug labels.
  - Prefer bitmap font for frequently changing debug/UI numbers if this becomes visible in traces.

Render knobs to consider later:

- Lower-poly unit LOD for crowds.
- Render scale / DPR quality tier.
- Disable or reduce MSAA on low/mobile tier if acceptable.
- Keep VFX pooled and low-overdraw.
- Avoid dynamic lights/shadows for many units.

## Render And Asset Profiling Update On 2026-06-23

Spector captures inspected:

- `spector-capture-2026-06-22T16-44-19-471Z.json`
- `spector-capture-2026-06-22T17-04-32-571Z.json`
- `spector-capture-2026-06-22T17-07-59-969Z.json`
- `spector-capture-2026-06-22T17-11-49-831Z.json`
- `spector-capture-2026-06-22T17-22-06-903Z.json`

Stable conclusions:

- Instancing is working for unit bodies.
- Healthbar rendering is instanced. Keep its material shared; do not create per-unit healthbar materials.
- Recent captures show no `texSubImage2D`, `texImage2D`, `createTexture`, or `deleteTexture` churn during captured frames.
- Bitmap font / stable UI text appears to have removed the earlier dynamic Label texture upload symptom in the inspected captures.
- Draw calls remain stable and acceptable: latest 3000-command captures show `124` draw calls.
- The Cocos profiler overlay is still visible in captures and accounts for repeated `drawElements(540)` calls. Disable profiler for final performance measurements.

Mesh comparisons:

- Old placeholder mesh: `10092 indices`, about `3364 triangles/unit`.
- Reduced mesh capture `17-04-32`: `1476 indices`, about `492 triangles/unit`.
- 3000-command capture `17-11-49`: `90834` captured triangles, unit body `1476 indices`, body instance sum `847`.
- Latest 3000-command capture `17-22-06`: `158844` captured triangles, unit body `2958 indices`, about `986 triangles/unit`, body instance sum `753`.
- Latest triangle increase came from heavier placeholder mesh, not more draw calls.

Asset guidance:

- Current unit model is temporary. Do not over-optimize final art decisions from the placeholder alone.
- For crowd units, a practical mobile/web target is roughly `500-1000 triangles/unit`, with lower LODs if unit count rises.
- Hero or close-up units can use a higher mesh budget than regular crowd units.
- If 500-600 units become common, prefer LOD/crowd mesh strategy over micro-optimizing already-batched draw calls.

MSAA state:

- Spector still reports `contextAttributes.antialias = true` and `SAMPLES = 4` in the latest capture.
- Current source now contains `settings/v2/packages/engine.json` macro config with `ENABLE_WEBGL_ANTIALIAS: false`, but the latest capture still showed MSAA on.
- Do not assume MSAA is disabled until a rebuilt/recaptured Spector report shows:
  - `contextAttributes.antialias = false`
  - `SAMPLES = 0` or `SAMPLES = 1`
- Setting antialias from a scene component is too late because WebGL context is created before scene scripts run.
- If `contextAttributes.antialias = false` but `SAMPLES = 4` remains, check custom pipeline/render-target MSAA separately.

Recommended pipeline for now:

- Use `Render Pipeline (New)` with `Pipeline Name = Builtin`.
- Keep `Post Process Module` disabled.
- Avoid `Render Pipeline (Legacy)` unless a specific compatibility issue appears.
- Avoid Bloom/HDR/SSAO/fullscreen post-process on the mobile/web baseline until measured affordable.

Useful rule of thumb:

- Spector is for render command/state diagnosis.
- Chrome Performance / Cocos profiler is for frame time.
- Never treat a 1500/3000-command Spector capture as exactly one frame; group by render cycles.

## Project Local Performance Skill

Added and tracked in git:

- `cocos-performance-optimize-skills/SKILL.md`
- `cocos-performance-optimize-skills/agents/openai.yaml`

Purpose:

- Preserve a reusable Cocos performance playbook for Codex sessions.
- Covers measurement discipline, throttling/offsets, worker/grid usage, buffer reuse, instancing, UI text, assets, VFX, render profiling, and cautious optimization habits.

Use it when:

- Starting any broad performance pass.
- Adding VFX, UI systems, model/animation changes, or new worker/grid logic.
- Investigating frame time regressions.

Do not treat it as permission for broad rewrites. It is a checklist/playbook; source behavior and measured traces still decide.

## Current Optimization Priority

1. Keep current AI/worker/spatial-grid logic stable.
2. Keep using the project-local performance skill before broad optimization.
3. For 300-unit and later 500-600-unit targets, prioritize final unit mesh budget and LOD/crowd strategy.
4. Keep Label/UI text stable; only revisit UI texture churn if traces show it again.
5. Add VFX slowly and profile after each visual feature.
6. If GPU/pixel cost rises, test render scale/DPR/MSAA tiers.

## Minimap State

- Old `BattleInformationPanel.ts` was removed earlier.
- Current minimap is `TrueMiniMapPanel.ts`.
- It uses wave icons by unit type, pooling, update intervals, smooth damp, flashing for engaged waves, and scale-in/scale-out tweens.
- `BattleInformationIconItem.ts` is still used by minimap icon visuals.
- Do not delete it just because the old panel was removed.

## What To Avoid Next

- Do not restart old lane experiments unless there is a concrete bug:
  - no hard backward-chase ban,
  - no lane from selected target,
  - no lane from last killed enemy,
  - no persistent alive/engaged event counters.
- Do not blame AI first for future visual regressions. After the latest work, render/mesh/VFX/UI are more likely than wave AI.
- Do not add many ArmyBrain knobs unless the user explicitly wants that tradeoff.
- Do not use Spector captures as frametime measurement. Use Chrome Performance or Cocos profiler for time; use Spector for render command/state diagnosis.

## Current Uncommitted Work To Notice

As of this handoff, `git status --short --untracked-files=all` is noisy because of editor/build/model/font work.

Source-like changes to review carefully:

- `assets/3D/Victory.fbx`
- `assets/3D/Victory.fbx.meta`
- `assets/Test.scene`
- `settings/v2/packages/engine.json`
- `settings/v2/packages/builder.json`
- `profiles/v2/packages/builder.json`
- `profiles/v2/packages/scene.json`
- untracked bitmap font assets under `assets/fonts/GAMERIA/`

Generated/noisy areas are also changed:

- `build/web-mobile/`
- `library/`
- `temp/`

Do not revert any of these blindly. Ask the user before cleanup, especially because this repo appears to track some Cocos generated files.

## Next Codex Startup Checklist

1. Read this file.
2. Run `git status --short`.
3. Re-check current source with `rg` before making assumptions.
4. If profiling render, use `SpectorDebugger` only temporarily and disable it afterward.
5. If profiling CPU/frametime, use Chrome Performance traces and ignore profiler-start spikes.
6. Keep gameplay invariants intact: one unit engage -> whole wave freehunt/combat; recovery only when wave is not engaged and has no valid target long enough.
7. Before optimizing, read `cocos-performance-optimize-skills/SKILL.md` and keep changes surgical.
