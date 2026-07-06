# AI-CONTEX

Handoff for the other Codex session working on `BattleGame`.

Last updated: 2026-07-07 by the home Codex.

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
node 'C:\ProgramData\cocos\editors\Creator\3.8.8\resources\resources\3d\engine\node_modules\@cocos\typescript\bin\tsc' --noEmit --pretty false --project tsconfig.json --skipLibCheck --module ESNext
```

## Current Source Shape

- `SmartArmyBrain.ts` is the maintained AI brain.
- `ArmyBrain.ts` was removed. Do not reintroduce it unless the user explicitly asks for an experiment.
- `GameManager.enableAutoSpawn` should usually be off when `SmartArmyBrain` owns spawning.
- `BattleWave` owns wave-level state, representative unit, and optional wave banner node.
- `Unit` / `UnitBehavior` still own per-unit movement/combat state.
- There is no regroup-to-slot or lane-return movement in the accepted flow.
- Minimap is not a current gameplay target. The user said they do not intend to use minimap in the game. Avoid treating minimap as an active performance suspect unless the user explicitly re-enables it.

## Current Unit / Wave Flow

### Forward

- Waves spawn into forward mode.
- Normal forward uses a wave scanner, usually the representative/front unit.
- Scanner refresh is throttled by the wave/unit target-search interval.
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
  - attack-range contact / retaliation;
  - enemy hero line;
  - adjacent-lane enemy hero special case.
- When a wave leaves forward for freehunt/combat, aggressive-forward mode is cleared. Later recovery is normal forward.

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

### Dynamic Lane

- Lane ID is strategic metadata for SmartArmyBrain and display logic, not a regroup command.
- Dynamic lane is based on alive unit positions / majority lane logic.
- Ties prefer current lane; otherwise closest lane to average X wins.
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
- It scores threats using counter coverage, alive ratio, distance to own hero/spawn, engagement, and whether same-lane ally counters look like they are failing.
- It prefers uncovered enemy waves with real counters from `CounterSettings`.
- It may still target a covered wave if that wave is near hero or current counter pressure is failing.
- `decisionAccuracy` is the main combined knob for counter correctness and lane correctness:
  - `1` means best real counter and best reachable lane;
  - lower values allow more random unit/lane choices.
- Opening aggressive rule:
  - SmartArmyBrain tracks whether its team has ever reached `maxAliveWaves`;
  - before first reaching max alive waves, counter/opening spawns use aggressive forward;
  - after that, counter/opening spawns use normal forward;
  - if max-alive limit is off, opening aggressive phase is considered already complete.
- Counter coverage is not a hard "do not spawn" gate. Assigned counter count is historical and does not decrease when counters die, get stuck, or fail.
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
- Ally overtake is proactive:
  - only for movable `onForward` agents with `enableAllyOvertake`;
  - considers same-team blockers ahead when blocked/locked/not-forward/too slow for several steps;
  - uses local clearance from neighbor list to choose side;
  - uses side locks/hold frames to reduce jitter.
- Worker and fallback logic must stay mirrored:
  - `assets/scripts/rvo/RVO.ts`;
  - `assets/scripts/rvo/RVOWorkerSimulator.ts` embedded worker source.
- Unit visual facing prefers actual `agent.vel` when large enough, falling back to `prefVel`.

## Performance Notes

Global rules:

- Mobile browser performance is a core design constraint.
- Avoid optimistic desktop/editor-preview conclusions.
- Check frame pacing, GPU/render, main thread, worker CPU, and worker heap.
- Before adding a new throttle/snapshot/scan/knob, first check whether an existing helper/cache/gate already answers the question.
- Avoid per-frame logic whenever possible. Prefer event, dirty flag, existing interval, or existing snapshot/cache. Per-frame work should be reserved for movement, camera smoothing, animation, and other behavior that visually requires continuous updates.
- The office Codex should add the same rule to its local `cocos-performance-optimize-skills`: do not add per-frame polling for UI/camera/state transitions until event, dirty flag, existing interval, or existing snapshot/cache has been ruled out.
- Keep debug logs behind Inspector toggles.

Current known render conclusions:

- Recent tests replacing high-poly unit mesh with capsule/cube did not produce a major win.
- Therefore vertex count alone is not the current proven bottleneck.
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

Recent trace interpretation to preserve:

- Workers were not the proven main bottleneck in the 2026-07-06 traces.
- Watch worker heap lower envelope in longer mobile-like captures; desktop V8 behavior is not proof for mobile browsers.
- Major GC remains a risk when adding VFX, damage numbers, projectiles, or heavier UI.
- For final performance judgment, compare release mobile builds on real devices.

## LevelSettings

- `assets/scripts/LevelSettings.ts` is optional.
- If node/component is disabled, it should not affect battle logic.
- It targets `SmartArmyBrain` references while keeping serialized property name `armyBrains` for scene compatibility.
- It can scale selected team values:
  - initial CP;
  - SmartArmyBrain decision accuracy;
  - spawn intervals;
  - max alive waves;
  - aggressive-forward chance.
- Current `assets/Test.scene` previously serialized the LevelSettings node inactive/component disabled; re-check in Cocos before assuming.

## VAT / Spector

- VAT prototype files may still exist but should not be integrated into battle unless the user explicitly resumes that experiment.
- User compared VAT to the current animated/instanced path and decided to stop pursuing VAT for now.
- `SpectorDebugger` is optional profiling tooling. Keep disabled outside profiling sessions.
- Do not attribute normal performance traces to Spector unless component/node is active.

## Do Not Resurrect Without User Approval

- Old regroup-to-slot / lane-return movement.
- Old permanent full-map hero freehunt.
- Old `ArmyBrain` / DefenseMode interpretation.
- Minimap as an active gameplay feature.
- VAT battle integration.
- The failed zoom-based unit healthbar/banner swap from 2026-07-06.
