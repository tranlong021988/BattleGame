---
name: cocos-performance-optimize-skills
description: Performance audit and optimization playbook for Cocos Creator games, especially mobile browser and large-unit battle games. Use when Codex needs to inspect, diagnose, optimize, or review Cocos Creator TypeScript projects for frame time, CPU simulation, AI scans, workers, spatial grids, memory allocation, garbage collection, UI cost, draw calls, batching, instancing, VFX, animation, texture memory, build settings, or mobile performance budgets.
---

# Cocos Performance Optimize Skills

Use this skill to audit and optimize Cocos Creator projects with a bias toward mobile browser performance. Prefer measurement, small changes, and project-specific tradeoffs over generic "optimize everything" rewrites.

## Core Workflow

1. Measure first.
   - Use Chrome DevTools Performance, Memory, Cocos profiler, real device builds, and release builds when possible.
   - Do not rely only on Cocos Editor Preview.
   - Compare traces before and after each meaningful change.

2. Classify the bottleneck.
   - CPU/simulation: update loops, AI, target search, RVO, pathfinding, physics, object churn.
   - Render/GPU: draw calls, material changes, shader cost, overdraw, transparent VFX, shadow, lights, animation skinning.
   - Memory/GC: sawtooth heap, frequent MinorGC, retained nodes/listeners, allocation in hot loops.
   - UI: Label updates, Layout/Widget/Mask/Graphics, world-space bars, dynamic lists.
   - Asset/load: texture size, compression, bundle layout, preloads, decode/upload spikes.

3. Fix the largest proven cost first.
   - Remove O(n^2) scans before micro-optimizing syntax.
   - Reduce frequency before moving work to a worker.
   - Pool and reuse before tuning GC manually.
   - Fix material/batching before reducing shader math.

4. Keep gameplay invariants intact.
   - Performance changes must not silently alter AI, combat rules, target validity, pooling lifecycle, or visual expectations.
   - If logic is fragile, add guards and narrow tests/checks instead of a broad rewrite.

5. Keep balance rules explicit.
   - Do not hide gameplay balance changes inside evaluators, performance helpers, workers, caches, or "scoring" utilities.
   - Hard counters and matchup multipliers must live in the project's explicit rule/source-of-truth system, such as `CounterSettings`, not in private evaluator branches.
   - Natural unit strength must come from visible stats such as health, damage, defense, speed, range, count, interval, and cost.
   - Before adding any heuristic that changes AI spawn choice or combat outcome, state whether it is a visible stat, explicit rule, tactical reachability check, or hidden scoring modifier. Ask the user before adding hidden scoring that can affect balance.

## Coding Discipline Overlay

Inspired by the public `CLAUDE.md` from `multica-ai/andrej-karpathy-skills`; use this as a general caution layer before changing code.

- Think before coding:
  - State assumptions when they matter.
  - Surface tradeoffs instead of silently choosing a risky interpretation.
  - Ask or pause when the request is genuinely ambiguous and the wrong assumption could cause churn.
- Prefer simplicity:
  - Write the minimum code that solves the measured problem.
  - Avoid speculative abstractions, knobs, flexibility, or "future-proofing".
  - If a fix grows large, re-check whether a smaller local change would preserve the same behavior.
- Make surgical changes:
  - Touch only files and lines tied to the user's request.
  - Match existing project style and architecture.
  - Mention unrelated dead code or risks instead of deleting/refactoring them casually.
  - Remove only unused code created by the current change unless the user asks for cleanup.
- Execute with clear success criteria:
  - Define what "done" means before a multi-step fix.
  - For bugs, reproduce or describe the failing flow, then verify the specific fix.
  - For optimization, compare before/after traces or at least explain what was checked.
  - Keep looping until the requested behavior is handled or a real blocker is found.

## Frame Budget Targets

Use these as rough budgets, not laws:

```text
60 FPS: 16.67 ms/frame
45 FPS: 22.22 ms/frame
30 FPS: 33.33 ms/frame
20 FPS: 50.00 ms/frame
```

For older mobile browsers, prefer stable 30 FPS over unstable 60 FPS. Watch p95/p99 frame time and spikes, not only average FPS.

## Trace Reading Rules

When reading a Chrome trace:

- Ignore profiler-start spikes such as `CpuProfiler::StartProfiling`.
- Treat stable DOM node and listener counts as "no obvious DOM/listener leak".
- Treat JS heap sawtooth as normal if it returns to baseline; worry if the baseline climbs.
- Compare `FireAnimationFrame` avg, p95, p99, max, frames over 8.33 ms, and frames over 16.67 ms.
- Separate game code from engine/render code. If WebGL buffer/UBO/render functions dominate, CPU AI may not be the bottleneck.
- If worker cost appears high, verify whether it is on the main thread or worker thread.
- Always audit every active worker separately, even when main-thread frame time is healthy:
  - identify each worker by its sampled functions;
  - report CPU busy time and message cadence;
  - report heap min/max/end and post-GC baseline trend;
  - report Minor/Major GC count, total time, and maximum pause;
  - verify whether timeout, error, or main-thread fallback paths activated;
  - compare worker and fallback behavior when either implementation changed.

## CPU And Simulation

Prefer centralized systems for expensive work:

- Let `GameManager`, `BattleSystem`, or similar managers coordinate heavy loops.
- Keep `Unit` components focused on state sync, visuals, and small per-unit behavior.
- Avoid every unit doing full AI, target search, combat checks, UI refresh, and debug logging every frame.

Use frequency control:

- Movement/transform sync: usually 30-60 Hz.
- RVO/avoidance: often 10-30 Hz, depending on density.
- Target search: often 4-15 Hz.
- Army/team AI: often 1-5 Hz.
- UI numbers: often 2-5 Hz.

Add frame offsets:

```ts
private shouldRunFrameInterval(frame: number, interval: number, offset = 0) {
    const safe = Math.max(1, Math.floor(interval));
    const phase = ((Math.floor(offset) % safe) + safe) % safe;
    return (frame + phase) % safe === 0;
}
```

Use time-slicing for broad scans:

```ts
private cursor = 0;
private checksPerFrame = 25;

private updateTargetSearchSlice(units: Unit[]) {
    const count = units.length;
    if (count <= 0) return;

    const limit = Math.min(this.checksPerFrame, count);

    for (let i = 0; i < limit; i++) {
        if (this.cursor >= count) this.cursor = 0;
        units[this.cursor++].refreshTarget();
    }
}
```

Use wave/group-level shortcuts when many units share intent:

- Pick one front-most scanner for a wave instead of scanning from every member.
- Cache wave alive/engaged/target state once per frame.
- Share a valid target inside a wave only after each unit's own search fails.
- Validate borrowed targets before use.

## Spatial Grid And Search

Avoid full-team scans in hot paths. Use a uniform grid or another spatial index for:

- target search,
- attack range query,
- RVO neighbor query,
- projectile or area damage query,
- density checks,
- minimap/icon separation when icon count grows.

Grid sizing:

- Cell size should be near common query radius, neighbor distance, or local formation scale.
- Too small: many cells are visited per query.
- Too large: each cell contains too many objects.
- In small maps, large search ranges can behave like whole-map scans even with a grid.

Use squared distance:

```ts
const dx = targetX - x;
const dz = targetZ - z;
const dSq = dx * dx + dz * dz;
if (dSq <= range * range) {
    // in range
}
```

Guard pooled objects:

- Assign a `lifeId`, generation id, or version number to units.
- Store `targetLifeId` with target refs.
- Reject stale worker results and stale target refs if `lifeId` changed.

## Web Worker Rules

Move work to a worker only when it is pure data and measured as expensive:

Good worker candidates:

- RVO/avoidance,
- broad target-search batch,
- pathfinding,
- spatial scoring,
- formation calculation,
- large statistical scans,
- procedural generation.

Bad worker candidates:

- direct Node/Component access,
- MeshRenderer/material/animation calls,
- scene graph traversal,
- audio,
- UI,
- anything requiring Cocos engine API.

Use typed arrays for batch messages:

- `Float32Array` for positions/velocities when precision is enough.
- `Float64Array` only when needed.
- `Int32Array`/`Uint16Array`/`Uint8Array` for ids, flags, teams, states.

Use transferable buffers only with a clear ownership model:

- Transfer detaches the buffer on the sender side.
- Use double-buffering or wait for the worker to return the buffer before reusing it.
- If a buffer must remain readable on main thread, do not transfer it.

Batch messages:

- Do not post one message per unit.
- Pack many requests into one worker message.
- Validate requester and target on result return.
- Keep main-thread packing visible in traces; if packing becomes hot, reuse request objects and buffers.

Always keep a main-thread fallback for browsers that block Worker, Blob worker, or module worker paths.

## Memory And GC

Avoid allocation in hot loops:

- no `new Vec3()` per frame,
- no `new Quat()` per frame,
- no `clone()` per frame,
- no temporary arrays in every update,
- no per-query arrow callbacks,
- no `map/filter/reduce` in hot loops,
- no template-string debug logs in hot paths.

Prefer reusable buffers:

```ts
private readonly tempPos = new Vec3();
private readonly aliveBuffer: Unit[] = [];

private collectAlive(units: Unit[]) {
    const out = this.aliveBuffer;
    out.length = 0;

    for (let i = 0; i < units.length; i++) {
        const unit = units[i];
        if (unit && unit.isAlive()) out.push(unit);
    }

    return out;
}
```

Use reusable callbacks:

```ts
private readonly onQueryResult = (target: Unit | null, token: number) => {
    if (token !== this.queryToken) return;
    this.cachedTarget = this.isValidTarget(target) ? target : null;
};
```

Pool objects that are created often:

- units,
- projectiles,
- damage numbers,
- hit VFX,
- particles,
- minimap icons,
- request records,
- temporary query result records.

Reset pooled objects fully:

- health,
- team/type,
- target refs,
- target generation/life id,
- movement velocity,
- attack timers,
- animation state,
- material/instanced state,
- event listeners,
- scheduled callbacks/tweens,
- spatial grid/RVO registration,
- UI visibility.

Do not over-pool:

- Pools trade CPU spikes for resident memory.
- Cap pools for optional UI/VFX.
- Prewarm only expected peak plus a small margin.

## Cocos Node And Component Cost

Reduce live Node/Component count:

- Keep unit prefabs lean.
- Remove unused sockets/debug nodes in release.
- Avoid one component only to hold two primitive values.
- Disable or pool optional visual nodes.
- Keep corpse lifetime short or replace corpse with a cheap static pose/mesh.

Cache references:

- Cache `MeshRenderer`, `Animation`, `UnitProps`, `UnitBehavior`, and child nodes in `onLoad`/init.
- Avoid repeated `getComponent`, `getChildByName`, or hierarchy traversal in hot paths.

Clean listeners:

- Register global input/event listeners in `onEnable`.
- Remove them in `onDisable` or `onDestroy`.
- Treat listener count growth as suspicious if it does not return to baseline.

Avoid always-on Cocos Layout cost:

- Use Layout/Widget to author UI, then disable if the layout is static.
- Avoid Layout under frequently updated icon roots.
- Avoid Mask/Graphics in large repeated UI if Sprite/mesh can do the job.

## Rendering, Batching, And Materials

Batching rules:

- Same mesh + same material + same shader macros + same texture can batch/instance.
- Per-unit material instances usually break batching.
- Per-frame `material.setProperty(...)` across many units is dangerous.

Prefer:

- shared materials by team/type,
- GPU instancing,
- instanced attributes for per-unit color/health/state,
- vertex color or texture lookup for variations,
- small material variant count.

Avoid:

- `getMaterialInstance()` per unit to change color,
- unique material per healthbar/unit,
- many shader macro combinations,
- transparent effects on every unit,
- dynamic lights/shadows for crowds.

Healthbar pattern:

- Use one shared instancing-enabled material.
- Put health ratio and bar color in per-instance attributes.
- Update only on health/color change.
- Consider hiding full-health bars, but verify toggling renderer does not create render churn.

Shadows/lights:

- Turn off cast shadow for ordinary crowd units.
- Prefer blob or planar shadow if needed.
- Allow hero shadow only if measured acceptable.
- Use ambient + one directional light for mobile low tier.

Shader guidance:

- Prefer unlit or simple lit shaders for crowds.
- Avoid PBR, normal maps, reflection, multiple texture samples, complex branches, and full-screen distortion on low tier.
- Use alpha clip instead of alpha blend when possible.

## Overdraw, VFX, And Particles

Overdraw is often the hidden mobile GPU cost. Watch:

- smoke,
- aura,
- transparent hit effects,
- large blob shadows,
- full-screen overlays,
- UI transparency,
- particles with large transparent quads.

VFX rules:

- Pool VFX nodes.
- Limit concurrent hit effects.
- Do not spawn a new heavy effect for every hit in a large battle.
- Crop VFX textures tightly.
- Keep particle lifetime/count low.
- Disable VFX outside camera or far from focus.
- Use quality tiers for particle count and lifetime.

## Animation And LOD

Animation costs scale with character count, bones, skinned meshes, blending, and sample rate.

Use:

- lower bone counts for crowd units,
- merged skinned meshes where practical,
- shorter blend durations,
- animation LOD by distance,
- stopped/frozen animation outside camera,
- VAT/GPU animation for many similar units when suitable.

Suggested animation rates:

```text
Near: 30 FPS
Medium: 15 FPS
Far: 5-10 FPS
Off camera: stop or static pose
```

Time-slice distance/LOD checks; do not measure every unit-camera distance every frame unless the count is small.

## UI Optimization

UI hotspots:

- Label updates,
- RichText,
- Layout/Widget,
- Mask,
- Graphics,
- ScrollView with many live items,
- world-space HP bars,
- damage number spam.

Rules:

- Update labels only when values change.
- Update numeric UI at 2-5 Hz unless it must be real-time.
- Use Bitmap Font where many labels update.
- Pool damage numbers.
- Cap concurrent damage numbers.
- Atlas UI sprites.
- Disable Layout/Widget after static layout is resolved.
- Avoid nested card-like UI trees with many nodes when a flatter layout works.

For minimap-like UI:

- Use an update interval.
- Pool icons.
- Sample wave positions instead of scanning every unit every frame.
- Use grid-based icon separation instead of all-pairs separation if icon count grows.
- Avoid active Layout on icon roots.
- Keep click/tap focus event-driven, not per-frame.

## Texture, Asset, And Memory

Remember GPU memory, not just file size:

```text
RGBA 2048 x 2048 = about 16 MB raw GPU memory
plus mipmaps, decode memory, upload buffers, and possible CPU copies
```

Texture rules:

- Use the smallest resolution that survives the camera distance.
- Use compressed textures for mobile builds.
- Remove alpha channels when unused.
- Use mipmaps for 3D textures that scale in distance.
- Disable mipmaps for UI when not needed.
- Atlas small UI sprites.
- Crop transparent VFX textures.
- Avoid 2K/4K textures for small or distant objects.

Bundle rules:

- Keep boot/core assets small.
- Put battle unit/VFX assets in a battle bundle.
- Lazy-load optional skins/events.
- Unload assets not needed across long sessions.

## Render Resolution And Quality Tiers

Mobile browser DPR can multiply pixel count heavily. Add quality tiers:

```text
High:
- render scale 1.0
- 60 FPS if stable
- full VFX budget

Medium:
- render scale 0.8
- 30 or 45 FPS
- reduced VFX/shadow

Low:
- render scale 0.6-0.7
- 30 FPS
- shadows off
- particle count reduced
- shorter VFX lifetime
```

Adaptive quality:

- Sample FPS/slow frames for several seconds.
- Drop quality quickly when p95/p99 is bad.
- Raise quality slowly only after stability.
- Use hysteresis so quality does not oscillate.

## Build And Release Settings

Before performance judgment:

- Test release build.
- Disable debug mode.
- Disable source maps for release.
- Remove debug draw.
- Remove permanent logs in hot paths.
- Enable feature cropping where suitable.
- Use gzip/Brotli and cache headers for web builds.
- Test on real mobile browser, not only desktop emulation.

Debug logs:

- Keep debug logs behind inspector flags.
- Never leave unguarded `console.log` in update/search/RVO/recovery loops.
- For rare state logs, default to off in release-like scenes.

## Cocos-Specific Audit Checklist

CPU and AI:

- No target search O(n^2) in hot paths.
- Spatial grid or equivalent exists.
- Heavy searches are throttled.
- Scan intervals use offsets to avoid synchronized spikes.
- Broad scans are time-sliced or batched.
- Worker paths have main-thread fallback.
- Worker messages are batched, not per-unit.
- Pooled target refs are guarded by life/generation id.

Memory:

- No `new Vec3`, `clone`, temporary arrays, or closure allocation in hot loops.
- Reusable buffers are cleared and reused.
- Pooled objects reset all runtime state.
- Event listeners are removed.
- Tweens/schedules are stopped on despawn if needed.

Render:

- Crowd units share materials.
- Instancing is enabled where suitable.
- No material instances per unit for color/health.
- Draw calls do not scale linearly with unit count.
- Shadows are disabled or limited for ordinary units.
- Transparent VFX and overdraw are budgeted.

UI:

- Labels update only on value change or interval.
- Layout/Widget/Mask/Graphics are not active in large dynamic lists unless necessary.
- Damage numbers and icons are pooled.
- Minimap/large UI panels use intervals and sampling.

Assets:

- Large textures are justified by screen size.
- Mobile compression is configured.
- Unused alpha is removed.
- Asset bundles/lazy loading are planned before content grows.

Build:

- Release build is used for final performance decisions.
- Debug logs/source maps/debug overlays are off.
- Real device trace exists for important claims.

## Good Patterns From Large Battle Games

Use these when the game has hundreds of units:

- Front-most wave scanner: one unit checks forward crossing for the wave.
- Wave runtime cache: compute alive/engaged/target state once per frame.
- Majority or group-level recovery: avoid one stale unit dragging an entire wave.
- Query token + life id: reject stale async worker results.
- Stable callback per unit: avoid one closure per query.
- Request object pool: avoid allocating query records every scan.
- Instanced healthbar: per-instance health/color, shared material.
- Event-only picking: tap/click scans are usually acceptable; do not over-optimize until measured.

## What To Avoid

- Do not rewrite the whole simulation to data-oriented arrays unless traces prove the current architecture cannot scale.
- Do not move Cocos Node/Component work into workers.
- Do not use physics engine collisions for every crowd unit if distance/grid checks are enough.
- Do not widen search ranges casually on small maps.
- Do not optimize by adding many inspector knobs unless they solve a real tuning need.
- Do not trade a clear gameplay rule for performance unless the user approves the behavior change.
- Do not trust one trace; compare multiple runs when spikes are rare.

## Practical Optimization Order

1. Remove O(n^2) searches and full-list hot scans.
2. Add intervals, offsets, and time-slicing.
3. Add spatial grid or reuse an existing one.
4. Pool frequently created objects.
5. Remove hot-loop allocation and stale refs.
6. Move pure heavy data work to worker with batched typed arrays.
7. Fix material sharing, instancing, and draw-call growth.
8. Reduce overdraw, shadow, lighting, and particle cost.
9. Compress/right-size textures and plan bundles.
10. Add quality tiers/adaptive quality.
11. Only then do syntax-level micro-optimization.

## Game-Specific Reminder For BattleGame-Like Projects

For a small battlefield with combat primarily along one axis:

- Keep target and forward scan ranges proportional to actual battlefield size.
- Treat a large radius as near-whole-map search even with a grid.
- Prefer forward scan range separate from target search range.
- Preserve wave-wide invariants when optimizing per-unit logic.
- Profile after each visual feature; future bottlenecks will likely be render/VFX/material/UI before AI.
