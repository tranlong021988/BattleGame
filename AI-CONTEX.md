# AI-CONTEX

Handoff for the other Codex session working on `BattleGame`.

Last updated: 2026-07-03 by the office Codex.

This file is intentionally concise. It should describe the current source and the currently accepted design, not the whole history of experiments. Always read the current source before editing. If this file conflicts with source, trust source first and update this file.

## Current Workspace Facts

- Current HEAD while writing this handoff: `7eb7f467`.
- The worktree is dirty mostly because Cocos Editor/Preview generates files under `library/`, `temp/`, and `profiles/`.
- Do not revert user/editor changes unless the user explicitly asks.
- `.claude/` was removed from this workspace because it was an untracked, non-Cocos local settings folder.
- Current real source changes from the office session:
  - `assets/scripts/GameManager.ts` added `waveBannerRefreshIntervalFrames = 12`.
  - `AI-CONTEX.md` was rewritten to remove obsolete/conflicting history.
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
