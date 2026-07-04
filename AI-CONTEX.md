# AI-CONTEX

Handoff for the other Codex session working on `BattleGame`.

Last updated: 2026-07-04 by the home Codex.

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
  - Added `assets/scripts/SmartArmyBrain.ts` and `.meta`.
  - `SmartArmyBrain` is a separate experimental AI component. It does not replace or modify `ArmyBrain` automatically.
  - Simplified `SmartArmyBrain` after user feedback: removed direct-counter blocker limits, lane-traffic direct-counter limits, and deferred-target cooldown logic.
  - Added the opening aggressive rule to `SmartArmyBrain`: before this AI has ever reached `maxAliveWaves`, its counter/opening spawns use aggressive forward.
  - Changed attack-range contact to edge-based range for all units: effective range is `unit.radius + enemy.radius + attackRange`.
  - Reworked RVO ally overtake in both worker and main-thread fallback:
    - same-speed units can now proactively sidestep allied blockers;
    - side choice uses local clearance from current neighbors;
    - side choice is locked briefly to reduce left/right jitter;
    - this is local steering, not full pathfinding.
- `assets/Test.scene` currently serializes the `LevelSettings` node inactive and the `LevelSettings` component disabled. Do not claim LevelSettings is active in this scene unless re-checked in Cocos.
- `assets/Test.scene` serializes `SpectorDebugger` disabled; its `enableSpector` field may be true, but the disabled component means it should not run.
- The user recently disabled an extra camera in the scene. A Spector capture after that showed render pass/draw-call reduction. Re-check camera components before assuming the scene still has only one active render camera.

## Working Rules

- Mobile browser performance is a core design constraint.
- Avoid optimistic desktop-preview conclusions. Check frame pacing, GPU/render, main thread, worker CPU, and worker heap.
- Prefer small, source-local changes.
- Do not add broad architecture or new knobs unless the user asks or a trace proves the need.
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

- Lane ID is strategic metadata for ArmyBrain and minimap, not a regroup command.
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

## ArmyBrain Current Shape

- `ArmyBrain` no longer has runtime Defense mode, raid-defense override, `attackModeChance`, `defenseModeChance`, `defenseWaveThreshold`, or `flankAggression`.
- Max alive wave limit is controlled by `enableMaxAliveWaveLimit` and `maxAliveWaves`.
- Fast react exists:
  - `fastReactChance`;
  - `fastReactCounteredWaveIds` prevents repeatedly fast-reacting to the same wave.
- Counter quality is mainly driven by:
  - `aiIntelligence`;
  - `laneAwareness`;
  - `counterSameLaneChance`;
  - available CP;
  - max alive wave pressure.
- ArmyBrain has early aggressive behavior until it has once reached `maxAliveWaves`. Verify source before changing this because it affects opening pressure.
- Aggressive raid chance is still separately tunable through `aggressiveForwardChance`.

## SmartArmyBrain

- `assets/scripts/SmartArmyBrain.ts` is a new separate component intended to test a cleaner strategic AI instead of patching `ArmyBrain`.
- It is not wired into `assets/Test.scene` by this handoff. Add it manually in Cocos if testing.
- Keep old `ArmyBrain` available as fallback until SmartArmyBrain is proven in playtests.
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
- Current known integration gap:
  - `LevelSettings` does not scale SmartArmyBrain yet.
  - If the user wants level curves for SmartArmyBrain, add explicit min/max inputs for SmartArmyBrain properties instead of silently mapping old ArmyBrain fields.

## LevelSettings

- `assets/scripts/LevelSettings.ts` is optional.
- If the node/component is disabled, it should not affect battle logic.
- It can scale selected team values:
  - initial CP;
  - AI intelligence;
  - lane awareness;
  - counter same-lane chance;
  - fast-react chance;
  - spawn intervals;
  - max alive waves;
  - aggressive-forward chance.
- LevelSettings values are Inspector endpoints, not hardcoded runtime curves.
- Current `assets/Test.scene` serializes the LevelSettings node inactive and component disabled. Re-check if the user enables it in Cocos.

## Player Controller / Bottom UI

- `PlayerArmyController` supports Inspector-driven lane picker and unit icon mapping.
- Selected lane uses blinking `selected` child highlight.
- Player spawn cooldown drives `power-bar-container/bar` width.
- Player also has `maxAliveWaves`.
- Single tap spawns normal forward after the double-tap window.
- Double tap spawns aggressive forward.
- The pending tap stores lane at tap time.

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
