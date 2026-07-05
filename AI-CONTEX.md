# AI-CONTEX

Handoff for the other Codex session working on `BattleGame`.

Last updated: 2026-07-06 by the home Codex.

This file is intentionally concise. It should describe the current source and the currently accepted design, not the whole history of experiments. Always read the current source before editing. If this file conflicts with source, trust source first and update this file.

## Current Workspace Facts

- Current HEAD while writing this handoff: `85b818e7`.
- The worktree is dirty mostly because Cocos Editor/Preview generates files under `library/`, `temp/`, and `profiles/`.
- Do not revert user/editor changes unless the user explicitly asks.
- `.claude/` was removed from this workspace because it was an untracked, non-Cocos local settings folder.
- Current real source changes from the office session:
  - `assets/scripts/GameManager.ts` added `waveBannerRefreshIntervalFrames = 12`.
  - `AI-CONTEX.md` was rewritten to remove obsolete/conflicting history.
- Current real source changes from the home session:
  - `assets/scripts/ArmyBrain.ts` and `.meta` were removed. `SmartArmyBrain` is now the only maintained AI brain.
  - Simplified `SmartArmyBrain` after user feedback: removed direct-counter blocker limits, lane-traffic direct-counter limits, and deferred-target cooldown logic.
  - Added the opening aggressive rule to `SmartArmyBrain`: before this AI has ever reached `maxAliveWaves`, its counter/opening spawns use aggressive forward.
  - Changed attack-range contact to edge-based range for all units: effective range is `unit.radius + enemy.radius + attackRange`.
  - Reworked RVO ally overtake in both worker and main-thread fallback:
    - same-speed units can now proactively sidestep allied blockers;
    - side choice uses local clearance from current neighbors;
    - side choice is locked briefly to reduce left/right jitter;
    - this is local steering, not full pathfinding.
  - Runtime performance cleanup:
    - `GameManager` now coalesces runtime spatial-grid rebuild requests through a dirty flag and flushes before wave search in `update`;
    - battle stat labels now use a dirty flag and only set strings when text changes;
    - wave banner renderer lists are cached per banner node before setting instanced background color; color params are reused separately per team, not one shared mutable array;
    - `Unit.update` no longer reapplies static RVO agent config every frame;
    - `HealthBar3D` skips instanced health updates when the ratio did not change.
  - Logic cleanup to avoid duplicate "small truth" copies:
    - `GameManager.isValidSpawnEntry()`, `canAffordUnitName()`, `collectAffordableEntries()`, `getTotalAliveWaveCount()`, and `getTotalAliveUnitCount()` are now shared helpers.
    - `PlayerArmyController`, `SmartArmyBrain`, and `SpawnBackPressureGate` should reuse these helpers instead of re-scanning database entries, CP, alive unit count, or alive wave count locally.
  - `PlayerArmyController` no longer refreshes all unit icon affordability every frame; it uses a light CP/alive-wave/cooldown snapshot and only refreshes icon tints when that snapshot changes.
  - RVO worker and fallback now keep the nearest `maxNeighbors` while collecting neighbors instead of collecting all nearby neighbors and sorting the full list.
- `assets/Test.scene` currently serializes the `LevelSettings` node inactive and the `LevelSettings` component disabled. Do not claim LevelSettings is active in this scene unless re-checked in Cocos.
- `assets/Test.scene` serializes `SpectorDebugger` disabled; its `enableSpector` field may be true, but the disabled component means it should not run.
- The user recently disabled an extra camera in the scene. A Spector capture after that showed render pass/draw-call reduction. Re-check camera components before assuming the scene still has only one active render camera.

## Working Rules

- Mobile browser performance is a core design constraint.
- Avoid optimistic desktop-preview conclusions. Check frame pacing, GPU/render, main thread, worker CPU, and worker heap.
- Prefer small, source-local changes.
- Do not add broad architecture or new knobs unless the user asks or a trace proves the need.
- Before adding a new flag, scan, snapshot, counter, or inspector knob, check whether an existing helper/cache/gate already answers the question. Reuse or extend the existing source of truth first. This rule was added after the PlayerArmyController max-alive-wave tint detour, where the correct solution was to reuse the existing lightweight battle snapshot instead of inventing a parallel availability system.
- The home machine skill `cocos-performance-optimize-skills` has been updated with the same "reuse existing truths before adding new logic" rule. The office Codex should update its local copy of that skill too, otherwise future optimization/refactor passes may drift back into duplicate logic.
- Debug logs must be behind Inspector toggles. Current broad `console.log` uses in battle scripts are guarded by toggles; optional tools/prototypes may still log.
- Do not hardcode local paths in source or shared scripts. Office and home machines use different project paths.
- Cocos-bundled typecheck command on the office machine:

```powershell
node 'C:\ProgramData\cocos\editors\Creator\3.8.8\resources\resources\3d\engine\node_modules\@cocos\typescript\bin\tsc' --noEmit --pretty false --project tsconfig.json --skipLibCheck --module ESNext
```

## Canonical Unit / Wave Flow

### Forward

- Waves spawn into forward mode.
- Normal forward uses one front scanner from the wave.
- The scanner refresh is throttled by the wave's `targetSearchIntervalFrames`.
- Normal forward releases the whole wave to freehunt only when:
  - the scanner has passed a same-lane target along forward direction; or
  - the scanner has passed an adjacent-lane target along forward direction; or
  - the scanner reaches/passes the enemy hero line and finds the enemy hero; or
  - attack-range contact triggers combat.
- A same-lane initial-forward combat gate exists:
  - release from same-lane attack contact can be delayed until enough units are engaged;
  - the threshold is set from the unit entry's `maxUnitPerRow`;
  - non-busy units that were paused by this gate are returned to forward by `refreshInitialForwardCombatGate()`.

### Aggressive Forward

- Aggressive forward is lane-committed.
- It ignores ordinary adjacent-lane unit pass/release.
- It still releases through:
  - same-lane passed target;
  - attack-range contact / retaliation;
  - enemy hero line;
  - adjacent-lane enemy hero special case.
- When a wave leaves forward for freehunt/combat, `BattleWave.releaseForwardToFreeHunt()` / `enterCombatMode()` clears `aggressiveForwardMode`. Later recovery is normal forward, not aggressive forward.

### Freehunt / Combat

- Any real attack-range contact can call wave-level combat and push the involved waves into freehunt/combat.
- `Unit.attackRange` now means weapon reach from body edge, not center-to-center distance.
- Effective combat contact range is `self.radius + enemy.radius + attackRange`.
- `BattleSpatialGrid` tracks max unit radius per team so `Unit` can query a broad enough nearby enemy set, then filter each candidate by its own effective attack range.
- Ranged units still attack from range; they do not wait for radius contact. If a ranged unit feels too long after this change, tune its Inspector/database `attackRange` down.
- A unit without a target can borrow a valid target from a teammate in the same wave.
- Target refs must respect pooled-unit validity/life-id checks.
- There is no regroup-to-slot or lane-return movement.
- Freehunt can return to forward through `BattleWave.tryResumeForward()` only when every alive unit in the wave:
  - is not busy;
  - has no valid enemy target;
  - has confirmed no target from its latest target-search cycle.
- If any alive unit is busy, still has a target, or has not confirmed no target yet, the wave does not resume forward.
- This "wait until target/search state clears" behavior is intentional and should not be treated as a bug by itself.

### Dynamic Lane

- Lane ID is strategic metadata for SmartArmyBrain and minimap, not a regroup command.
- Dynamic lane is based on alive unit positions / majority lane logic.
- Lane ties prefer the current lane; otherwise closest lane to average X wins.
- Lane voting is done on main thread and is not currently a proven bottleneck.

## Hero Rules

- Hero uses `Unit` / `UnitBehavior`, but it is a special entity:
  - not a troop type for counter rules;
  - not counted as normal minimap wave icon;
  - hero-vs-anything damage ignores `CounterSettings`;
  - kills involving hero are not counter kills.
- Before hero unlock, steady hero guards around its home area.
- Steady hero can keep a valid retaliation target even when the attacker is outside the guard zone, so ranged attackers cannot safely shoot it forever.
- Steady hero guard uses the same edge-based attack range as normal units.
- Hero phase no longer forces full-map/permanent freehunt.
- When unlocked, hero becomes a one-unit mid-lane forward wave and uses normal forward/freehunt rules.
- Existing enemy waves should return to their own forward mode rather than being forced to chase the hero globally.

## SmartArmyBrain

- `assets/scripts/SmartArmyBrain.ts` is the only maintained AI brain.
- `assets/Test.scene` contains SmartArmyBrain components on `SmartArmyBrainA/B` nodes.
- Do not reintroduce `ArmyBrain` unless the user explicitly asks for a fallback experiment.
- It only decides wave spawn strategy. It does not directly control unit movement, combat, forward/freehunt, lane voting, worker, RVO, banner, or minimap behavior after spawn.
- It should usually run with `GameManager.enableAutoSpawn = false` when `runOnlyWhenGameManagerAutoSpawnOff = true`, so the old random/auto spawn loop does not compete with it.
- Current SmartArmyBrain decision model:
  - runs on a spawn interval;
  - builds lane intel from current alive waves;
  - builds enemy-wave intel from current alive enemy waves;
  - scores enemy threat using counter coverage, alive ratio, distance to own hero/spawn, engagement, and whether a same-lane ally counter is struggling;
  - prefers uncovered enemy waves that have a real counter available through `CounterSettings`;
  - can still target a wave that already has counter coverage if that wave is near the hero or current counter pressure looks like it is failing;
  - does not block counter decisions based on lane traffic, path blockers, or time-based deferral;
  - can spawn into a support/empty lane only when `decisionAccuracy` allows an inaccurate lane choice;
  - can spawn aggressive-forward into an empty lane when there is no good counter target;
  - can spawn an opening wave if no enemy wave exists.
- Opening aggressive rule:
  - `SmartArmyBrain` tracks whether its team has ever reached `maxAliveWaves`;
  - before that first reach, counter/opening spawns use `aggressiveForward = true`;
  - once the team has ever reached `maxAliveWaves`, later counter/opening spawns use normal forward;
  - if `enableMaxAliveWaveLimit` is off, this opening aggressive phase is considered already complete.
- `decisionAccuracy` is the main combined knob for counter correctness and lane correctness:
  - `1` means best real counter and best reachable lane;
  - lower values allow more random unit/lane choices.
- Counter assignment/coverage is only added to the target enemy wave when SmartArmyBrain spawned a real counter into that target's lane. Support-lane/aggressive spawns do not falsely count as coverage.
- Counter coverage is no longer a hard "do not spawn" gate. This is intentional because assigned counter count is historical and does not decrease when counter waves die, get stuck, or fail.
- Avoid reintroducing separate "max blockers", "max lane traffic", or "deferred target cooldown" knobs unless the user explicitly asks. They were removed because they felt like duplicate, hard-to-tune interpretations of "lane is too crowded".
- Performance shape:
  - uses reused arrays/buffers for lane intel, enemy intel, affordable entries, and best-entry candidates;
  - scans wave state only on SmartArmyBrain's spawn interval, not every frame;
  - currently not event-driven. Do not convert it to spawn/death event bookkeeping unless testing proves interval scanning is a bottleneck, because event hooks would touch more core systems.
## LevelSettings

- `assets/scripts/LevelSettings.ts` is optional.
- If the node/component is disabled, it should not affect battle logic.
- It targets `SmartArmyBrain` references, while keeping the serialized property name `armyBrains` for scene compatibility.
- It can scale selected team values:
  - initial CP;
  - SmartArmyBrain decision accuracy;
  - spawn intervals;
  - max alive waves;
  - aggressive-forward chance.
- LevelSettings values are Inspector endpoints, not hardcoded runtime curves.
- Current `assets/Test.scene` serializes the LevelSettings node inactive and component disabled. Re-check if the user enables it in Cocos.

## Player Controller / Bottom UI

- `PlayerArmyController` supports Inspector-driven lane picker and unit icon mapping.
- Current UX is unit-first, lane-second:
  - tap a unit icon to select the unit type;
  - lane icons are hidden until a unit type that the player can currently afford is selected;
  - tap a lane icon to spawn the selected unit on that lane;
  - double tap the same lane within `doubleTapWindow` to spawn aggressive forward.
- Unit icons use a static `selected` child highlight; no selected highlight should blink.
- Unit `selected` child highlight only marks the currently selected unit; affordability is shown by tinting the unit icon root black 50%, not by red/green selected tint.
- During cooldown or while `maxAliveWaves` blocks player spawning, unit icon root sprites are tinted black 50%; they return to normal only when the spawn gate is open again.
- Outside global spawn blocking, individual unit icons are also tinted black 50% when current CP cannot afford that unit.
- Player max-wave availability uses `GameManager.getAliveWaveCount(team)`, a no-allocation scan over the live wave list; do not use `getWavesByTeam()` just to count waves in UI.
- Player unit affordability uses `GameManager.canAffordUnitName(team, unitName)`; do not duplicate database/CP checks in UI.
- Lane `selected` child highlights are intentionally disabled for now because they made the bottom UI feel noisy.
- After a successful player spawn, the lane picker container is hidden and the selected unit icon is cleared.
- During cooldown, unit selection is still allowed; lane icons are tinted black and cannot spawn or change the selected-lane reminder.
- Player spawn cooldown drives `power-bar-container/bar` width.
- Player also has `maxAliveWaves`.
- Single lane tap spawns normal forward after the double-tap window.
- The pending lane tap stores both lane and selected unit at tap time.

## Banner / Minimap

- `BattleWave` owns one representative unit and one optional wave banner node.
- Representative holder:
  - picked from alive units near wave centroid;
  - kept stable while alive/valid;
  - replaced when invalid/dead.
- Banner lifecycle belongs to `BattleWave`, not `Unit`.
- Banner node is pooled by `GameManager`.
- Holder death/despawn is event-assisted, so the banner should not stay on a pooled inactive unit.
- `GameManager.waveBannerRefreshIntervalFrames`:
  - default `12`;
  - only throttles the safety sweep over `wave.refreshWaveBanner()`;
  - set to `1` to restore every-frame sweep.
- Camera/zoom/orbit banner visibility is still checked every frame, but it is cheap unless the global visible state changes.
- If banner count grows, cache banner renderer refs instead of repeatedly using `getComponentsInChildren(MeshRenderer)` during attach/re-attach.
- `TrueMiniMapPanel` uses `BattleWave.getRepresentativeUnit()` first; fallback averaging is only for missing representatives.
- Hero minimap display is handled by hero icon path, not normal wave icon path.

## RVO / Local Avoidance

- RVO remains local avoidance plus steering, not long-range pathfinding.
- Ally overtake is proactive now:
  - only runs for movable `onForward` agents with `enableAllyOvertake`;
  - considers same-team blockers ahead only when they are actually blocking: locked, not `onForward`, or moving forward too slowly for several RVO steps;
  - this slow-blocker gate is intentional. It prevents freshly spawned wave formations from spreading sideways just because rear units see normal allies in front of them;
  - no longer requires the rear unit to be faster; it only skips overtake if the rear unit is clearly slower than the blocker by `overtakeSpeedDiff`;
  - chooses left/right by scoring local clearance from the already collected neighbor list;
  - stores `overtakeSideLock` / `overtakeHoldFrames` to avoid oscillating side choice;
  - stores per-agent `forwardSlowFrames`; keep this mirrored in worker and fallback.
- Unit visual movement facing now prefers actual `agent.vel` when it is large enough, falling back to `prefVel` otherwise. This is intentional so ally-overtake sidesteps look like the unit turns into the dodge instead of being pulled sideways.
- Worker and fallback logic must stay mirrored:
  - `assets/scripts/rvo/RVO.ts`;
  - `assets/scripts/rvo/RVOWorkerSimulator.ts` embedded worker source.
- If tuning visual behavior:
  - `overtakeLookAhead` controls how early the rear unit starts reacting;
  - `overtakeSideRange` controls how wide a blocker corridor counts;
  - `overtakeSideStrength` controls lateral push;
  - `overtakeSpeedDiff` now means "do not overtake a meaningfully faster ally", not "must be faster to overtake".

## Render / Performance Status

Runtime optimization note:

- `GameManager.rebuildSpatialGrid()` is still the single place that rebuilds the target-search grid.
- Runtime spawn/despawn paths should call `requestSpatialGridRebuild()` instead of rebuilding immediately; `GameManager.update()` flushes the dirty grid before dynamic lane, forward search, recovery, and banner processing.
- Initial scene setup still force-builds the spatial grid once in `start()`.
- Battle stats UI is dirty-driven; use `requestBattleStatsUIRefresh()` for count/CP changes.
- Wave banner appearance uses a per-node renderer cache; if a banner prefab changes renderer hierarchy at runtime, clear/rebuild that cache path before relying on it.

Recent reports reviewed on 2026-07-03:

- Spector before disabling the extra camera:
  - roughly 3 pass/clear groups per render frame;
  - about 13 draw calls per render frame;
  - about 11 texture binds;
  - about 60 `bufferData` calls per frame group.
- Spector after disabling the extra camera and with max alive wave set to 5 per side:
  - roughly 2 pass/clear groups per render frame;
  - about 9 draw calls per render frame;
  - about 7 texture binds;
  - about 40 `bufferData` calls per frame group.
- Chrome trace `Trace-20260703T185718.json.gz`:
  - `FireAnimationFrame` avg about `1.17 ms`, p95 about `1.59 ms`, p99 about `2.20 ms`;
  - 15 dropped-frame markers, but 11 were at trace start;
  - one GPU-task spike around `31.8 ms`;
  - worker main heap rose from about `0.49 MB` to about `4.5 MB`; small in absolute terms but still worth watching on mobile browser;
  - DOM nodes/listeners were stable or slightly lower.

Current interpretation:

- Toggling off the extra camera was a real render win.
- Body unit rendering is instanced well by team/material.
- Healthbar instancing is conceptually correct: health/color are instanced attributes, not per-unit materials.
- Banner rendering is currently split by troop icon material/texture. AutoAtlas on the folder does not automatically make 3D MeshRenderer materials batch together.
- Future banner batching direction, if needed:
  - one atlas texture;
  - one shared banner material;
  - per-instance UV rect attribute;
  - keep team/background color as an instanced attribute.
- Mesh triangle count remains a bigger future risk than current battle AI. At 300 units, body mesh tris can become the main mobile cost.

Chrome trace reviewed on 2026-07-06:

- Trace: `Trace-20260706T010846.json.gz`.
- Test condition: CPU slowdown 4x, interpreted as mobile-browser pressure rather than exact device proof.
- `FireAnimationFrame`:
  - count about `14,095`;
  - avg about `4.24 ms`;
  - p95 about `10.54 ms`;
  - p99 about `14.45 ms`;
  - `64` frames over `16.67 ms`;
  - `5` frames over `33.33 ms`.
- Worker status:
  - RVO worker avg about `0.32 ms`, p95 about `0.62 ms`, max about `2.66 ms`;
  - target/search worker avg about `0.16 ms`;
  - main-thread worker message handling avg about `0.36 ms`, max about `3.7 ms`;
  - no evidence that worker is currently the bottleneck.
- GC status:
  - `MinorGC` is frequent but small: avg about `3.25 ms`, no event over `8.33 ms`;
  - `MajorGC` happened `6` times, avg about `28.4 ms`, with one event around `33 ms`.
- Interpretation:
  - gameplay/AI/RVO worker currently look acceptable under 4x slowdown;
  - rare long frames still exist, and not all overlap GC;
  - MajorGC is the main memory risk to watch when adding VFX, damage numbers, projectiles, or heavier UI;
  - keep Spector/debug components disabled during normal traces;
  - for final judgement, compare release mobile builds on real devices.

## VAT / Spector Tooling

- VAT prototype files still exist but should not be integrated into battle unless the user explicitly resumes that experiment.
- User compared VAT to the current animated/instanced path and decided to stop pursuing VAT for now.
- `SpectorDebugger` is an optional profiling helper. Keep disabled outside profiling sessions.
- Do not attribute normal performance traces to Spector unless the component/node is active.

## Known Risks / Things To Watch

- Worker heap lower envelope should be watched in longer mobile-like captures; current traces do not prove a leak but show allocation churn.
- GPU spike around `31.8 ms` in the latest trace should be watched in repeated captures.
- Current Chrome traces are desktop/editor-preview-ish evidence, not final mobile proof.
- If testing render again, disable Cocos profiler overlay and extra tabs where possible.
- If touching target/search/combat, preserve wave-wide invariants:
  - one unit engage can start wave-level combat;
  - no regroup-to-slot;
  - resume forward only when the whole wave has no busy/target/pending-search state.

## Cleanup Notes From This Handoff

- Removed obsolete handoff sections about old regroup/lane-return designs, old permanent hero freehunt, old ArmyBrain Defense mode, and old LevelSettings scene assumptions.
- Removed untracked `.claude/`.
- Did not modify Cocos-generated `library/`, `temp/`, or `profiles/` files.
- Did not remove optional Spector/VAT prototype files because they are intentionally available for future experiments.
