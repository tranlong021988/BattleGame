import {
    _decorator,
    Camera,
    Color,
    Component,
    Vec3,
    Label,
    Prefab,
    Node,
    instantiate,
    isValid,
    MeshRenderer,
    Material,
    game,
    profiler,
    director,
} from 'cc';

import { Unit } from './Unit';
import { UnitProps } from './UnitProps';

import { RVOSimulator } from './rvo/RVO';
import { RVOWorkerSimulator } from './rvo/RVOWorkerSimulator';

import { ObstacleCircle } from './ObstacleCircle';
import { ObstacleRect } from './ObstacleRect';

import { UnitSpawner } from './UnitSpawner';
import { UnitBehavior } from './UnitBehavior';

import { BattleSpatialGrid } from './BattleSpatialGrid';

import { BattleWave } from './BattleWave';
import { CounterSettings } from './CounterSettings';
import { UnitFamily } from './BattleTypes';
import {
    BattleTelemetry,
    BattleTelemetryCounterRuleSnapshot,
    BattleTelemetryUnitSnapshot,
    BattleTelemetryWaveSpawnDecision,
} from './BattleTelemetry';

import {
    BattleUnitDatabase,
    UnitPrefabEntry,
    HeroEntry,
} from './BattleUnitDatabase';
import {
    BattleCardDatabase,
    BattleCardModifier,
} from './BattleCardDatabase';
import {
    BattleCardModifiers,
    BattleCardRuntime,
    BattleCardTelemetryEvent,
} from './BattleCardRuntime';
import { HealthBar3D } from './HealthBar3D';

export { UnitPrefabEntry } from './BattleUnitDatabase';

const { ccclass, property } = _decorator;
const BannerVisibilityBlockedEvent =
    'battle-camera-banner-visibility-blocked';
const TopDownZoomRangeChangedEvent =
    'battle-camera-topdown-zoom-range-changed';
const BattleWaveSpawnedEvent =
    'battle-wave-spawned';
const NoBattleCardModifiers: BattleCardModifiers = {
    damageMultiplier: 1,
    defenseFlat: 0,
    attackRangeMultiplier: 1,
    moveSpeedMultiplier: 1,
    damageRadiusMultiplier: 1,
    counterImmune: false,
};

export interface BattleProgressionProvider {
    handleBattleResult(
        winnerTeam: number,
        loserTeam: number,
        reason: string
    ): any;
    createTelemetrySnapshot(): any;
    shouldResetBattleAfterResult(): boolean;
    resetBattle(): boolean;
    isBossBattle?(): boolean;
}

@ccclass('GameManager')
export class GameManager extends Component {

    static instance: GameManager | null = null;
    private static originalDirectorTick:
        ((deltaTime: number) => void) | null = null;
    private static directorTimeScaleOwner: GameManager | null = null;

    @property(BattleUnitDatabase)
    unitDatabase: BattleUnitDatabase | null = null;

    @property(BattleCardDatabase)
    battleCardDatabase: BattleCardDatabase | null = null;

    @property({
        displayName: 'Enable Battle Card Effects',
        tooltip:
            'When disabled, player and enemy cards remain owned, purchasable, and upgradeable, but no card activates or affects combat. Card cooldowns and cooldown-skip ads are also inactive for that battle.',
    })
    enableBattleCardEffects = true;

    @property(Component)
    cinematicController: Component | null = null;

    @property
    useWorkerRVO = true;

    @property({
        tooltip: 'Target frame rate for mobile performance tests. Use 30, 45, or 60. Set 0 or lower to keep the engine default.',
    })
    targetFrameRate = 60;

    @property({
        min: 0.1,
        tooltip:
            'Global battle speed multiplier for faster telemetry tests. 1 = normal speed. Values above 1 speed up Cocos update/schedule time; RVO is sub-stepped so large dt is not simply clamped away.',
    })
    battleTimeScale = 1;

    @property({
        tooltip:
            'Reset the global Cocos scheduler time scale back to 1 when this GameManager is destroyed. Keep enabled unless another system owns global time scale.',
    })
    resetBattleTimeScaleOnDestroy = true;

    @property({
        tooltip: 'Show the built-in Cocos profiler overlay in build/preview. Keep off for normal release tests unless you need on-device FPS/drawcall stats.',
    })
    showCocosProfilerStats = false;

    @property({
        tooltip: 'Allow URL query params ?stats=1 or ?profiler=1 to show the Cocos profiler overlay in browser builds.',
    })
    allowProfilerStatsQueryParam = true;

    @property({
        tooltip:
            'Check battle winner rules. Normal gameplay ends when a Hero dies or an opposing unit reaches the initial Hero line.',
    })
    enableBattleWinnerCheck = true;

    @property({
        tooltip:
            'Optional fallback winner rule: a team loses only when it has no living troops, including Hero, and can no longer afford any valid spawn entry.',
    })
    enableNoAffordableSpawnWinnerFallback = false;

    @property({
        min: 1,
        tooltip:
            'Frames between optional elimination-and-affordability winner checks.',
    })
    battleWinnerCheckIntervalFrames = 1;

    @property({
        tooltip:
            'Collect aggregate battle telemetry and export a JSON report when the battle winner rule is reached.',
    })
    enableBattleTelemetry = true;

    @property({
        tooltip:
            'Automatically download the battle telemetry JSON in browser preview/build when the temporary winner condition is reached.',
    })
    downloadBattleTelemetryOnEnd = true;

    @property({
        tooltip:
            'Reload the browser page after telemetry export. This does not store reports in localStorage or skip per-match downloads.',
    })
    reloadPageAfterBattleTelemetryExport = true;

    @property({
        min: 0,
        tooltip:
            'Seconds to wait after triggering telemetry JSON download before reloading the browser page.',
    })
    battleTelemetryReloadDelaySeconds = 2;

    @property({
        tooltip:
            'Also print the full telemetry object to console. The report is always kept on window.__battleTelemetryReport when available.',
    })
    logBattleTelemetryOnEnd = false;

    @property({
        tooltip:
            'Output file prefix for downloaded battle telemetry reports.',
    })
    battleTelemetryFilePrefix = 'battle-telemetry';

    @property({
        min: 1,
        tooltip:
            'Frames between diagnostic battle snapshots in telemetry. These snapshots record team, hero, wave, and lane state for post-match diagnosis.',
    })
    battleTelemetrySnapshotIntervalFrames = 60;

    @property({
        min: 0,
        tooltip:
            'Maximum diagnostic snapshots stored in one telemetry report. Set 0 to disable snapshots while keeping aggregate telemetry.',
    })
    battleTelemetryMaxSnapshots = 240;

    @property({
        min: 0,
        tooltip:
            'Maximum chronological diagnostic events stored in one telemetry report. Includes spawn decisions, hero damage, area damage, and kills.',
    })
    battleTelemetryMaxDiagnosticEvents = 3000;

    @property({
        min: 0,
        tooltip:
            'Maximum scanner search traces stored per battle. A circular buffer retains the newest samples; set 0 to disable scanner path tracing.',
    })
    battleTelemetryMaxScannerTraces = 6000;

    teamAHero: Unit | null = null;
    teamBHero: Unit | null = null;

    @property
    battleMinX = -28;

    @property
    battleMaxX = 28;

    @property
    battleMinZ = -18;

    @property
    battleMaxZ = 18;

    @property
    updateInterval = 2;

    @property
    rvoUpdateFrameOffset = 0;

    @property
    maxRvoStepDeltaTime = 0.05;

    frame = 0;

    @property
    visualSmooth = 16;

    @property
    spatialGridCellSize = 4;

    @property
    spatialGridUpdateInterval = 2;

    @property
    spatialGridUpdateFrameOffset = 1;

    @property
    useWorkerSpatialTargetQuery = true;

    spatialGrid: BattleSpatialGrid = new BattleSpatialGrid();

    @property(Label)
    teamAAliveLabel: Label | null = null;

    @property(Label)
    teamADeathLabel: Label | null = null;

    @property(Label)
    teamBAliveLabel: Label | null = null;

    @property(Label)
    teamBDeathLabel: Label | null = null;

    @property(Label)
    teamAKillLabel: Label | null = null;

    @property(Label)
    teamBKillLabel: Label | null = null;

    @property(Label)
    teamACounterKillLabel: Label | null = null;

    @property(Label)
    teamBCounterKillLabel: Label | null = null;

    @property(Label)
    teamACombatPointLabel: Label | null = null;

    @property(Label)
    teamBCombatPointLabel: Label | null = null;

    aliveCount = [0, 0];
    deathCount = [0, 0];

    killCount = [0, 0];
    counterKillCount = [0, 0];

    combatPoint = [0, 0];
    initialCombatPoint = [0, 0];
    battleWinnerResolved = false;
    battleWinnerTeam = -1;
    battleLoserTeam = -1;
    battleWinnerReason = '';
    private heroDefeatDetected = false;
    battleProgressionProvider:
        BattleProgressionProvider | null = null;
    private combatResolutionDepth = 0;
    private pendingForcedBattleWinnerCheck = false;
    private pendingBattleWinner: {
        winnerTeam: number;
        loserTeam: number;
        reason: string;
    } | null = null;

    @property
    enableAutoSpawn = true;

    @property
    spawnImmediatelyOnStart = true;

    @property
    prewarmOnStart = true;

    @property
    spawnWaveInterval = 3;

    @property
    maxAutoSpawnDeltaTime = 0.1;

    @property
    teamASpawnZ = -20;

    @property
    teamBSpawnZ = 20;

    @property
    formationZNoise = 0.25;

    @property
    centerGapWidth = 3;

    @property
    enableLaneSpawn = true;

    @property
    laneCount = 3;

    @property
    defaultSpawnLane = 1;

    @property
    autoSpawnRandomLane = true;

    @property({
        min: 1,
        tooltip:
            'Frames between safety wave-banner holder refresh checks. Set to 1 to refresh every frame.',
    })
    waveBannerRefreshIntervalFrames = 12;

    @property(Camera)
    waveBannerCamera: Camera | null = null;

    @property
    enableWaveBannerCameraVisibility = true;

    @property
    hideWaveBannerInOrbitMode = true;

    @property
    waveBannerHideFovBelow = 35;

    @property
    waveBannerShowFovAbove = 38;

    private spawnWaveTimer = 0;

    @property({ type: [ObstacleCircle] })
    circleObstacles: ObstacleCircle[] = [];

    @property({ type: [ObstacleRect] })
    rectObstacles: ObstacleRect[] = [];

    sim: any = null;

    teamA: Unit[] = [];
    teamB: Unit[] = [];

    waves: BattleWave[] = [];

    private nextWaveId = 1;

    private spawner!: UnitSpawner;

    private teamAPrefabMap: Map<string, UnitPrefabEntry> = new Map();
    private teamBPrefabMap: Map<string, UnitPrefabEntry> = new Map();
    private tempSpawnPos = new Vec3();
    private centeredRowXBuffer: number[] = [];
    private teamAHeroWave: BattleWave | null = null;
    private teamBHeroWave: BattleWave | null = null;
    private teamAHeroEntry: HeroEntry | null = null;
    private teamBHeroEntry: HeroEntry | null = null;
    private heroLineZ = [NaN, NaN];
    private heroForwardUnlocked = [false, false];
    private readonly refreshLaneBeforeWaveForward =
        (wave: BattleWave) => {
            this.refreshDynamicLaneForWave(
                wave,
                true
            );
        };
    private waveBannerPools: Map<Prefab, Node[]> = new Map();
    private registeredCinematicController: Component | null = null;
    private registeredTopDownCameraDragNode: Node | null = null;
    private waveBannerCameraBlocked = false;
    private waveBannerVisibleByCamera = true;
    private waveBannerVisibilityInitialized = false;
    private waveBannerCameraVisibilityDirty = true;
    private spatialGridDirty = true;
    private battleStatsUiDirty = true;
    private readonly waveBannerTeamAColorParams = [0, 0, 0, 0];
    private readonly waveBannerTeamBColorParams = [0, 0, 0, 0];
    private waveBannerRendererCache: WeakMap<Node, MeshRenderer[]> =
        new WeakMap();
    private waveBannerIconParamCache: WeakMap<Node, number[]> =
        new WeakMap();
    private waveBannerHealthBarCache: WeakMap<Node, HealthBar3D[]> =
        new WeakMap();
    private readonly fallbackTeamABannerColor = new Color(0, 70, 255, 255);
    private readonly fallbackTeamBBannerColor = new Color(255, 0, 0, 255);
    private readonly battleTelemetry =
        new BattleTelemetry();
    private battleElapsedTime = 0;
    private readonly telemetryFrameDeltaHistogram: number[] =
        new Array(101).fill(0);
    private telemetryFrameSampleCount = 0;
    private telemetryFrameDeltaTotalMs = 0;
    private telemetryFrameDeltaMaxMs = 0;
    private telemetryFramesOver16_67Ms = 0;
    private telemetryFramesOver33_33Ms = 0;
    private telemetryPeakAliveUnits = 0;
    private telemetryPeakAliveWaves = 0;
    private telemetryManagerUpdateSampleCount = 0;
    private telemetryManagerUpdateTotalMs = 0;
    private telemetryManagerUpdateMaxMs = 0;
    private readonly telemetryManagerUpdateSampleInterval = 30;
    private battleCardRuntime: BattleCardRuntime | null = null;
    private battleRuntimeActive = false;
    private rvoStepAccumulatedDelta = 0;
    private battleRuntimeRoot: Node | null = null;
    private readonly heroSpawnPositions: Map<Node, Vec3> = new Map();

    start() {
        this.startBattleRuntime();
    }

    public startBattleRuntime() {
        if (this.battleRuntimeActive) return false;

        GameManager.instance = this;
        this.applyTargetFrameRate();
        this.installBattleTimeScaleHook();
        this.applyProfilerStats();

        this.destroyStaleRuntimeUnits();

        this.teamA.length = 0;
        this.teamB.length = 0;

        this.waves.length = 0;
        this.nextWaveId = 1;
        this.teamAHeroWave = null;
        this.teamBHeroWave = null;
        this.teamAHeroEntry = null;
        this.teamBHeroEntry = null;
        this.heroForwardUnlocked[0] = false;
        this.heroForwardUnlocked[1] = false;

        this.teamAHero = null;
        this.teamBHero = null;

        this.aliveCount[0] = 0;
        this.aliveCount[1] = 0;

        this.deathCount[0] = 0;
        this.deathCount[1] = 0;

        this.killCount[0] = 0;
        this.killCount[1] = 0;

        this.counterKillCount[0] = 0;
        this.counterKillCount[1] = 0;

        this.frame = 0;
        this.spawnWaveTimer = 0;
        this.battleElapsedTime = 0;
        this.rvoStepAccumulatedDelta = 0;
        this.resetBattleFramePerformanceTelemetry();

        this.resetCombatPoint();

        this.createSimulator();
        this.buildPrefabMaps();
        this.ensureBattleCardRuntime();
        this.resetBattleTelemetry();
        if (this.enableBattleCardEffects) {
            this.battleCardRuntime?.beginBattle();
        }

        this.spatialGrid.cellSize = this.spatialGridCellSize;
        this.spatialGrid.setBattlefieldBounds(
            this.battleMinX,
            this.battleMaxX,
            this.battleMinZ,
            this.battleMaxZ
        );

        this.sim.setBattlefield(
            this.battleMinX,
            this.battleMaxX,
            this.battleMinZ,
            this.battleMaxZ
        );

        this.spawner = this.getComponent(UnitSpawner)!;
        this.spawner.init(this.sim);
        this.registerWaveBannerCameraEvents();
        this.updateWaveBannerCameraVisibility(true);

        if (this.prewarmOnStart) {
            this.prewarmAllUnits();
        }

        for (const ob of this.circleObstacles) {
            const p = ob.node.worldPosition;

            this.sim.addCircleObstacle(
                p.x,
                p.z,
                ob.radius
            );
        }

        for (const ob of this.rectObstacles) {
            const p = ob.node.worldPosition;

            const angle =
                ob.node.eulerAngles.y *
                Math.PI / 180;

            this.sim.addRectObstacle(
                p.x,
                p.z,
                ob.halfWidth,
                ob.halfHeight,
                angle
            );
        }

        this.registerDatabaseHeroes();
        this.resetBattleRuntimeComponents();

        if (this.spawnImmediatelyOnStart) {
            this.spawnAutoWave();
        }

        this.rebuildSpatialGrid();
        this.refreshBattleStatsUI(true);
        this.battleRuntimeActive = true;

        return true;
    }

    public stopBattleRuntime() {
        if (!this.battleRuntimeActive) return;

        this.battleRuntimeActive = false;
        this.unregisterWaveBannerCameraEvents();

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (wave) {
                wave.releaseReferences();
            }
        }

        if (this.teamAHeroWave) {
            this.teamAHeroWave.releaseReferences();
        }

        if (this.teamBHeroWave) {
            this.teamBHeroWave.releaseReferences();
        }

        this.releaseBattleUnits(this.teamA);
        this.releaseBattleUnits(this.teamB);

        this.waves.length = 0;
        this.teamA.length = 0;
        this.teamB.length = 0;
        this.teamAHero = null;
        this.teamBHero = null;
        this.teamAHeroWave = null;
        this.teamBHeroWave = null;
        this.teamAHeroEntry = null;
        this.teamBHeroEntry = null;
        this.heroForwardUnlocked[0] = false;
        this.heroForwardUnlocked[1] = false;

        if (this.sim && this.sim.destroy) {
            this.sim.destroy();
        }

        this.sim = null;
        this.battleCardRuntime = null;
        this.spatialGrid.destroy();
        this.spatialGrid.build([], []);
        this.spatialGridDirty = false;
        this.battleStatsUiDirty = true;
    }

    public isBattleRuntimeRunning() {
        return this.battleRuntimeActive;
    }

    private releaseBattleUnits(units: Unit[]) {
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];

            if (!unit || !unit.node || !unit.node.isValid) continue;

            if (unit.isHero) {
                this.removeUnitAgentFromSimulator(unit);
                unit.resetForDespawn();
                unit.node.active = false;
                continue;
            }

            const entry = this.getTeamEntry(
                unit.team,
                unit.unitTypeName
            );

            if (entry && entry.prefab && this.spawner) {
                this.spawner.despawnUnit(unit, entry.prefab);
            } else {
                this.removeUnitAgentFromSimulator(unit);
                unit.resetForDespawn();
                unit.node.active = false;
            }
        }
    }

    private destroyStaleRuntimeUnits() {
        const root = this.battleRuntimeRoot;

        if (!root || !root.isValid) return;

        const units = root.getComponentsInChildren(Unit);

        for (let i = 0; i < units.length; i++) {
            const unit = units[i];

            if (!unit || !unit.node.activeInHierarchy) continue;

            this.removeUnitAgentFromSimulator(unit);
            unit.resetForDespawn();
            unit.node.destroy();
        }
    }

    private resetBattleRuntimeComponents() {
        const scene = director.getScene();

        if (!scene) return;

        const components = scene.getComponentsInChildren(Component);

        for (let i = 0; i < components.length; i++) {
            const component = components[i] as any;
            const reset = component?.resetForNewBattle;

            if (typeof reset === 'function') {
                reset.call(component);
            }
        }
    }

    onDestroy() {
        if (GameManager.instance === this) {
            GameManager.instance = null;
        }

        if (this.resetBattleTimeScaleOnDestroy) {
            this.uninstallBattleTimeScaleHook();
        }

        this.stopBattleRuntime();

        this.teamAPrefabMap.clear();
        this.teamBPrefabMap.clear();
        this.clearWaveBannerPools();

        if (this.spawner) {
            this.spawner.clearPool();
        }
    }

    private resetCombatPoint() {
        const aInitial = this.unitDatabase
            ? this.unitDatabase.getInitialCombatPoint(0)
            : 0;

        const bInitial = this.unitDatabase
            ? this.unitDatabase.getInitialCombatPoint(1)
            : 0;

        this.initialCombatPoint[0] = Math.max(0, aInitial);
        this.initialCombatPoint[1] = Math.max(0, bInitial);

        this.combatPoint[0] = this.initialCombatPoint[0];
        this.combatPoint[1] = this.initialCombatPoint[1];
        this.battleWinnerResolved = false;
        this.battleWinnerTeam = -1;
        this.battleLoserTeam = -1;
        this.battleWinnerReason = '';
        this.heroDefeatDetected = false;
        this.combatResolutionDepth = 0;
        this.pendingForcedBattleWinnerCheck = false;
        this.pendingBattleWinner = null;
    }

    private createSimulator() {
        if (
            this.useWorkerRVO &&
            RVOWorkerSimulator.isSupported()
        ) {
            this.sim = new RVOWorkerSimulator();
        } else {
            this.sim = new RVOSimulator();
        }
    }

    private applyTargetFrameRate() {
        const fps = Math.floor(this.targetFrameRate);

        if (fps <= 0) return;

        game.frameRate = fps;
    }

    private getSafeBattleTimeScale() {
        if (
            typeof this.battleTimeScale !== 'number' ||
            !isFinite(this.battleTimeScale)
        ) {
            return 1;
        }

        return Math.max(0.1, this.battleTimeScale);
    }

    private installBattleTimeScaleHook() {
        GameManager.directorTimeScaleOwner = this;

        if (GameManager.originalDirectorTick) {
            return;
        }

        const originalTick =
            director.tick.bind(director);

        GameManager.originalDirectorTick = originalTick;

        director.tick = ((deltaTime: number) => {
            const owner =
                GameManager.directorTimeScaleOwner;
            const scale =
                owner && owner.isValid
                    ? owner.getSafeBattleTimeScale()
                    : 1;

            originalTick(deltaTime * scale);
        }) as typeof director.tick;
    }

    private uninstallBattleTimeScaleHook() {
        if (
            GameManager.directorTimeScaleOwner === this
        ) {
            GameManager.directorTimeScaleOwner = null;
        }

        if (!GameManager.originalDirectorTick) {
            return;
        }

        director.tick =
            GameManager.originalDirectorTick as typeof director.tick;
        GameManager.originalDirectorTick = null;
    }

    private applyProfilerStats() {
        const queryState =
            this.getProfilerStatsQueryState();

        if (this.showCocosProfilerStats || queryState === true) {
            profiler.showStats();
            return;
        }

        if (queryState === false) {
            profiler.hideStats();
        }
    }

    private getProfilerStatsQueryState(): boolean | null {
        if (!this.allowProfilerStatsQueryParam) return null;
        if (typeof window === 'undefined') return null;

        const params =
            new URLSearchParams(window.location.search);
        const value =
            params.get('stats') ??
            params.get('profiler') ??
            params.get('showStats');

        if (value === null) return null;

        const normalized =
            value.trim().toLowerCase();

        if (
            normalized === '1' ||
            normalized === 'true' ||
            normalized === 'on'
        ) {
            return true;
        }

        if (
            normalized === '0' ||
            normalized === 'false' ||
            normalized === 'off'
        ) {
            return false;
        }

        return null;
    }

    update(deltaTime: number) {
        if (!this.battleRuntimeActive) return;

        this.frame++;
        this.recordBattleFrameDelta(deltaTime);
        const managerUpdateStart =
            this.shouldSampleBattleManagerUpdate()
                ? this.getPerformanceNow()
                : -1;
        this.battleElapsedTime += deltaTime;
        if (this.enableBattleCardEffects) {
            this.battleCardRuntime?.update(
                deltaTime,
                this.combatPoint,
                this.initialCombatPoint
            );
        }

        Unit.visualLerpT =
            1 - Math.exp(-this.visualSmooth * deltaTime);

        this.rvoStepAccumulatedDelta += deltaTime;

        if (
            this.shouldRunFrameInterval(
                this.updateInterval,
                this.rvoUpdateFrameOffset
            )
        ) {
            this.stepRvoSimulation(this.rvoStepAccumulatedDelta);
            this.rvoStepAccumulatedDelta = 0;
        }

        if (
            this.shouldRunFrameInterval(
                this.spatialGridUpdateInterval,
                this.spatialGridUpdateFrameOffset
            )
        ) {
            this.requestSpatialGridRebuild();
        }

        if (this.enableAutoSpawn) {
            this.updateAutoSpawn(deltaTime);
        }

        if (this.spatialGridDirty) {
            this.rebuildSpatialGrid();
        }

        this.processDynamicWaveLanes();
        this.processWaveHuntScannerRefreshes();
        this.processWaveForwardSearches();
        this.processWaveForwardRecoveries();
        this.processWaveBanners();
        this.pruneDeadWaves();
        this.processHeroForwardUnlock();
        this.recordBattleTelemetrySnapshotIfNeeded();
        this.processBattleWinnerCondition();

        this.refreshBattleStatsUI();

        if (managerUpdateStart >= 0) {
            const elapsed = this.getPerformanceNow();

            if (elapsed >= managerUpdateStart) {
                this.recordBattleManagerUpdateTime(
                    elapsed - managerUpdateStart
                );
            }
        }
    }

    private shouldRunFrameInterval(
        interval: number,
        offset: number = 0
    ) {
        const safeInterval =
            Math.max(1, Math.floor(interval));

        const phase =
            ((Math.floor(offset) % safeInterval) + safeInterval) %
            safeInterval;

        return (this.frame + phase) % safeInterval === 0;
    }

    private resetBattleFramePerformanceTelemetry() {
        for (
            let i = 0;
            i < this.telemetryFrameDeltaHistogram.length;
            i++
        ) {
            this.telemetryFrameDeltaHistogram[i] = 0;
        }

        this.telemetryFrameSampleCount = 0;
        this.telemetryFrameDeltaTotalMs = 0;
        this.telemetryFrameDeltaMaxMs = 0;
        this.telemetryFramesOver16_67Ms = 0;
        this.telemetryFramesOver33_33Ms = 0;
        this.telemetryPeakAliveUnits = 0;
        this.telemetryPeakAliveWaves = 0;
        this.telemetryManagerUpdateSampleCount = 0;
        this.telemetryManagerUpdateTotalMs = 0;
        this.telemetryManagerUpdateMaxMs = 0;
    }

    private recordBattleFrameDelta(deltaTime: number) {
        if (!this.enableBattleTelemetry) return;
        if (!this.battleTelemetry.isEnabled()) return;
        if (!Number.isFinite(deltaTime) || deltaTime <= 0) return;

        const milliseconds = deltaTime * 1000;
        const histogramIndex = Math.max(
            0,
            Math.min(
                this.telemetryFrameDeltaHistogram.length - 1,
                Math.floor(milliseconds)
            )
        );

        this.telemetryFrameSampleCount++;
        this.telemetryFrameDeltaTotalMs += milliseconds;
        this.telemetryFrameDeltaMaxMs = Math.max(
            this.telemetryFrameDeltaMaxMs,
            milliseconds
        );
        this.telemetryFrameDeltaHistogram[histogramIndex]++;

        if (milliseconds > 16.67) {
            this.telemetryFramesOver16_67Ms++;
        }

        if (milliseconds > 33.33) {
            this.telemetryFramesOver33_33Ms++;
        }

        this.telemetryPeakAliveUnits = Math.max(
            this.telemetryPeakAliveUnits,
            this.getTotalAliveUnitCount()
        );
        this.telemetryPeakAliveWaves = Math.max(
            this.telemetryPeakAliveWaves,
            this.waves.length
        );
    }

    private shouldSampleBattleManagerUpdate() {
        if (!this.enableBattleTelemetry) return false;
        if (!this.battleTelemetry.isEnabled()) return false;

        return this.frame %
            this.telemetryManagerUpdateSampleInterval === 0;
    }

    private getPerformanceNow() {
        const timing = globalThis.performance;

        if (!timing || typeof timing.now !== 'function') {
            return -1;
        }

        return timing.now();
    }

    private recordBattleManagerUpdateTime(milliseconds: number) {
        if (!Number.isFinite(milliseconds) || milliseconds < 0) {
            return;
        }

        this.telemetryManagerUpdateSampleCount++;
        this.telemetryManagerUpdateTotalMs += milliseconds;
        this.telemetryManagerUpdateMaxMs = Math.max(
            this.telemetryManagerUpdateMaxMs,
            milliseconds
        );
    }

    private getBattleFrameDeltaPercentile(percentile: number) {
        if (this.telemetryFrameSampleCount <= 0) return 0;

        const target = Math.max(
            1,
            Math.ceil(
                this.telemetryFrameSampleCount * percentile
            )
        );
        let accumulated = 0;

        for (
            let i = 0;
            i < this.telemetryFrameDeltaHistogram.length;
            i++
        ) {
            accumulated += this.telemetryFrameDeltaHistogram[i];

            if (accumulated >= target) {
                return i + 1;
            }
        }

        return this.telemetryFrameDeltaHistogram.length;
    }

    private recordBattleFramePerformanceSummary() {
        const frameCount = this.telemetryFrameSampleCount;

        this.battleTelemetry.setFramePerformance({
            frameCount,
            averageDeltaMs:
                frameCount > 0
                    ? this.telemetryFrameDeltaTotalMs / frameCount
                    : 0,
            p95DeltaMs:
                this.getBattleFrameDeltaPercentile(0.95),
            p99DeltaMs:
                this.getBattleFrameDeltaPercentile(0.99),
            maxDeltaMs: this.telemetryFrameDeltaMaxMs,
            framesOver16_67Ms:
                this.telemetryFramesOver16_67Ms,
            framesOver33_33Ms:
                this.telemetryFramesOver33_33Ms,
            peakAliveUnits: this.telemetryPeakAliveUnits,
            peakAliveWaves: this.telemetryPeakAliveWaves,
            managerUpdateSamples:
                this.telemetryManagerUpdateSampleCount,
            averageManagerUpdateMs:
                this.telemetryManagerUpdateSampleCount > 0
                    ? this.telemetryManagerUpdateTotalMs /
                    this.telemetryManagerUpdateSampleCount
                    : 0,
            maxManagerUpdateMs:
                this.telemetryManagerUpdateMaxMs,
        });
    }

    private stepRvoSimulation(deltaTime: number) {
        if (!this.sim || typeof this.sim.step !== 'function') {
            return;
        }

        if (
            typeof deltaTime !== 'number' ||
            !isFinite(deltaTime) ||
            deltaTime <= 0
        ) {
            return;
        }

        const maxStep =
            Math.max(0.001, this.maxRvoStepDeltaTime);

        this.sim.step(deltaTime, maxStep);
    }

    public reportKill(
        killer: Unit | null,
        victim: Unit | null
    ) {
        if (!killer || !victim) return;
        if (!killer.props || !victim.props) return;

        const killerTeam = killer.team;

        if (killerTeam !== 0 && killerTeam !== 1) {
            return;
        }

        this.killCount[killerTeam]++;

        const counter = CounterSettings.instance;

        let isCounterKill = false;

        if (
            counter &&
            !killer.isHero &&
            !victim.isHero
        ) {
            const damageMul = counter.getDamageMultiplier(
                killer.props.family,
                victim.props.family
            );

            isCounterKill =
                damageMul > 1.0001;
        }

        if (isCounterKill) {
            this.counterKillCount[killerTeam]++;
        }

        if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordKill(
                killer,
                victim,
                isCounterKill,
                this.frame,
                this.battleElapsedTime
            );
        }

        if (!killer.isHero) {
            this.addCombatPointFromVictim(
                killer,
                victim,
                isCounterKill
            );
        }

        this.requestBattleStatsUIRefresh();
    }

    public reportDamage(
        attacker: Unit | null,
        victim: Unit | null,
        damage: number,
        actualDamage: number,
        isCounterDamage: boolean,
        isAreaDamage: boolean = false,
        attackBatchId: number = -1
    ) {
        if (!this.enableBattleTelemetry) return;

        this.battleTelemetry.recordDamage(
            attacker,
            victim,
            damage,
            actualDamage,
            isCounterDamage,
            isAreaDamage,
            attackBatchId,
            this.frame,
            this.battleElapsedTime
        );
    }

    public configureBattleCardDecks(
        playerCardIds: string[],
        enemyCardIds: string[],
        playerBudgetUpgradeLevels: Record<string, number> = {},
        playerStrengthScales: Record<string, number> = {},
        enemyStrengthScales: Record<string, number> = {},
        maxPlayerCards: number = 3,
        maxEnemyCards: number = maxPlayerCards
    ) {
        this.ensureBattleCardRuntime();
        this.battleCardRuntime?.setDecks(
            playerCardIds,
            enemyCardIds,
            playerBudgetUpgradeLevels,
            playerStrengthScales,
            enemyStrengthScales,
            maxPlayerCards,
            maxEnemyCards
        );
    }

    public getBattleCardModifiers(
        team: number,
        family: UnitFamily,
        opposingFamily?: UnitFamily
    ): BattleCardModifiers {
        if (!this.enableBattleCardEffects || !this.battleCardRuntime) {
            return NoBattleCardModifiers;
        }

        return this.battleCardRuntime.getModifiers(
            team,
            family,
            opposingFamily
        );
    }

    public consumeBattleCardModifier(
        team: number,
        family: UnitFamily,
        modifier: BattleCardModifier,
        opposingFamily?: UnitFamily
    ) {
        return this.enableBattleCardEffects && this.battleCardRuntime
            ? this.battleCardRuntime.consumeModifier(
                team,
                family,
                modifier,
                opposingFamily
            )
            : false;
    }

    public consumeAttackRangeCardBudget(
        team: number,
        family: UnitFamily,
        opposingFamily?: UnitFamily
    ) {
        return this.consumeBattleCardModifier(
            team,
            family,
            BattleCardModifier.AttackRangePercent,
            opposingFamily
        );
    }

    public getBattleCardTelemetrySnapshot() {
        return this.battleCardRuntime
            ? this.battleCardRuntime.createTelemetrySnapshot()
            : [];
    }

    public getUsedBattleCardIds(team: number) {
        return this.enableBattleCardEffects && this.battleCardRuntime
            ? this.battleCardRuntime.getUsedCardIds(team)
            : [];
    }

    public hasUnitReachedEnemyHeroLine(unit: Unit) {
        if (!unit) return false;
        if (unit.team !== 0 && unit.team !== 1) return false;

        const defendingTeam = unit.team === 0 ? 1 : 0;
        const lineZ = this.heroLineZ[defendingTeam];
        const unitZ = unit.agent
            ? unit.agent.pos.z
            : unit.node.worldPosition.z;
        const forwardZ = unit.forwardDir.z;

        if (!Number.isFinite(lineZ)) return false;
        if (!Number.isFinite(unitZ)) return false;
        if (Math.abs(forwardZ) <= 0.0001) return false;

        return (unitZ - lineZ) * forwardZ >= 0;
    }

    public resolveUnitReachedEnemyHeroLine(unit: Unit) {
        if (!this.battleRuntimeActive) return false;
        if (this.hasBattleWinner()) return false;
        if (!this.hasUnitReachedEnemyHeroLine(unit)) return false;

        const losingTeam = unit.team === 0 ? 1 : 0;

        this.resolveBattleWinner(
            unit.team,
            losingTeam,
            unit.team === 1
                ? 'enemy-reached-hero-line'
                : 'player-reached-hero-line'
        );

        return true;
    }

    public resolveHeroDefeat(hero: Unit) {
        if (!hero || !hero.isHero) return;

        const team = hero.team;

        if (team !== 0 && team !== 1) return;

        // Lock both armies immediately. This also stops any remaining targets
        // from the attack currently being resolved before the battle result is
        // finalized at the end of that combat resolution.
        this.heroDefeatDetected = true;
        this.haltAllUnitsForBattleEnd();

        this.resolveBattleWinner(
            team === 0 ? 1 : 0,
            team,
            team === 0
                ? 'player-hero-killed'
                : this.battleProgressionProvider?.isBossBattle?.()
                    ? 'boss-hero-killed'
                    : 'enemy-hero-killed'
        );
    }

    private recordHeroDefeatTelemetryContext(hero: Unit) {
        if (!this.enableBattleTelemetry) return;
        if (!this.battleTelemetry.isEnabled()) return;

        const heroTeam = hero.team;
        if (heroTeam !== 0 && heroTeam !== 1) return;
        const enemyTeam = heroTeam === 0 ? 1 : 0;
        const heroWave = BattleWave.getWaveForUnit(hero);
        const heroLaneId = heroWave
            ? heroWave.laneId
            : this.getHeroLaneId();
        const guardRadius = Math.max(0, hero.heroGuardDistance);
        const nearbyRadius = Math.max(0.01, guardRadius);
        const nearbyRadiusSquared = nearbyRadius * nearbyRadius;
        const heroPosition = hero.node.worldPosition;
        const collect = (team: number) => {
            const units = this.getAliveUnits(team);
            let alive = 0;
            let nearHero = 0;
            let inHeroLane = 0;
            let nearestDistance = Number.POSITIVE_INFINITY;

            for (let i = 0; i < units.length; i++) {
                const unit = units[i];

                if (!this.isAliveUnit(unit) || unit.isHero) continue;

                alive++;
                const position = unit.node.worldPosition;
                const dx = position.x - heroPosition.x;
                const dz = position.z - heroPosition.z;
                const distanceSquared = dx * dx + dz * dz;

                if (distanceSquared <= nearbyRadiusSquared) {
                    nearHero++;
                }

                nearestDistance = Math.min(
                    nearestDistance,
                    Math.sqrt(distanceSquared)
                );

                const wave = BattleWave.getWaveForUnit(unit);
                if (wave && wave.laneId === heroLaneId) {
                    inHeroLane++;
                }
            }

            return {
                alive,
                nearHero,
                inHeroLane,
                nearestDistance:
                    Number.isFinite(nearestDistance)
                        ? nearestDistance
                        : -1,
            };
        };
        const allies = collect(heroTeam);
        const enemies = collect(enemyTeam);

        this.battleTelemetry.recordHeroDefeatContext({
            frame: this.frame,
            time: this.battleElapsedTime,
            heroTeam,
            heroUnitName: hero.unitTypeName || 'hero',
            heroLaneId,
            guardRadius,
            heroX: heroPosition.x,
            heroZ: heroPosition.z,
            allyNonHeroAlive: allies.alive,
            enemyNonHeroAlive: enemies.alive,
            allyNearHero: allies.nearHero,
            enemyNearHero: enemies.nearHero,
            allyInHeroLane: allies.inHeroLane,
            enemyInHeroLane: enemies.inHeroLane,
            nearestAllyDistance: allies.nearestDistance,
            nearestEnemyDistance: enemies.nearestDistance,
        });
    }

    public onWaveCombatStarted(
        unit: Unit | null,
        enemy: Unit | null = null,
        useInitialForwardGate: boolean = true
    ) {
        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return;
        if (wave.isDead()) return;

        const soloAggressiveCombat =
            this.shouldUseSoloAggressiveCombat(
                wave,
                unit,
                enemy
            );
        const canEscalateWaveCombat =
            !soloAggressiveCombat &&
            this.canEscalateWaveCombatFromEngagement(
                wave,
                enemy
            );

        if (canEscalateWaveCombat) {
            this.trySetWaveTargetFromEngagement(
                wave,
                unit,
                enemy
            );
        }

        if (
            canEscalateWaveCombat &&
            !this.shouldDelayInitialForwardCombat(
                wave,
                unit,
                enemy,
                useInitialForwardGate
            )
        ) {
            wave.enterCombatMode();
        }

        const enemyWave =
            BattleWave.getWaveForUnit(enemy);

        if (
            !enemyWave ||
            enemyWave === wave ||
            enemyWave.isDead()
        ) {
            return;
        }

        if (
            !this.shouldUseSoloAggressiveCombat(
                enemyWave,
                enemy,
                unit
            ) &&
            this.canEscalateWaveCombatFromEngagement(
                enemyWave,
                unit
            ) &&
            !this.shouldDelayInitialForwardCombat(
                enemyWave,
                enemy,
                unit,
                useInitialForwardGate
            )
        ) {
            enemyWave.enterCombatMode();
        }
    }

    public shouldUseSoloAggressiveSkirmish(
        unit: Unit | null,
        enemy: Unit | null
    ) {
        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return false;
        if (wave.isDead()) return false;

        return this.shouldUseSoloAggressiveCombat(
            wave,
            unit,
            enemy
        );
    }

    private trySetWaveTargetFromScanner(
        wave: BattleWave,
        scanner: Unit | null,
        target: Unit | null,
        source: string
    ) {
        if (!wave || !scanner || !target) return false;

        const previousTargetWaveId =
            wave.getTargetWave()?.id ?? -1;
        const assigned = wave.trySetTargetWaveFromScanner(
            scanner,
            target
        );

        this.recordWaveTargetAssignment(
            wave,
            scanner,
            target,
            previousTargetWaveId,
            source,
            assigned
        );

        return assigned;
    }

    private trySetWaveTargetFromEngagement(
        wave: BattleWave,
        unit: Unit | null,
        target: Unit | null
    ) {
        if (!wave || !unit || !target) return false;
        if (!this.canEscalateWaveCombatFromEngagement(
            wave,
            target
        )) return false;

        const previousTargetWaveId =
            wave.getTargetWave()?.id ?? -1;
        const assigned = wave.trySetTargetWaveFromEngagement(
            unit,
            target
        );

        this.recordWaveTargetAssignment(
            wave,
            unit,
            target,
            previousTargetWaveId,
            'engagement',
            assigned
        );

        return assigned;
    }

    private canEscalateWaveCombatFromEngagement(
        wave: BattleWave,
        target: Unit | null
    ) {
        const targetWave = BattleWave.getWaveForUnit(target);

        if (!targetWave) return false;
        if (wave.laneId < 0 || targetWave.laneId < 0) {
            return false;
        }

        return Math.abs(
            this.clampLaneId(wave.laneId) -
            this.clampLaneId(targetWave.laneId)
        ) <= 1;
    }

    private recordWaveTargetAssignment(
        wave: BattleWave,
        unit: Unit | null,
        target: Unit | null,
        previousTargetWaveId: number,
        source: string,
        assigned: boolean
    ) {
        if (!this.enableBattleTelemetry || !assigned) return;

        const targetWave = wave.getTargetWave();
        if (!targetWave || targetWave.id === previousTargetWaveId) {
            return;
        }

        this.battleTelemetry.recordDiagnosticEvent({
            type: 'wave-target-assigned',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: unit?.unitTypeName ?? wave.unitName,
            familyName: UnitFamily[wave.family] ?? String(wave.family),
            targetWaveId: targetWave.id,
            targetTeam: targetWave.team,
            targetLaneId: targetWave.laneId,
            targetFamilyName:
                UnitFamily[targetWave.family] ?? String(targetWave.family),
            previousTargetWaveId,
            targetSource: source,
        });
    }

    private recordWaveForwardResume(wave: BattleWave) {
        if (!this.enableBattleTelemetry) return;

        this.battleTelemetry.recordDiagnosticEvent({
            type: 'wave-forward-resumed',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: UnitFamily[wave.family] ?? String(wave.family),
            targetWaveId: -1,
            targetSource: 'scanner-confirmed-no-target',
        });
    }

    public recordWaveScannerTrace(
        scanner: Unit | null,
        observedUnit: Unit | null,
        source: string,
        reason: string,
        targetWaveBefore: BattleWave | null,
        observedEnemyCount: number = 0
    ) {
        if (!this.enableBattleTelemetry) return;
        if (!this.battleTelemetry.isEnabled()) return;
        if (!scanner) return;

        const wave = BattleWave.getWaveForUnit(scanner);
        if (!wave) return;

        const targetWaveAfter = wave.getTargetWave();
        const observedWave =
            BattleWave.getWaveForUnit(observedUnit) ??
            targetWaveAfter ??
            targetWaveBefore;
        const observed =
            observedUnit ??
            observedWave?.getRepresentativeUnit() ??
            null;
        const scannerPosition = scanner.agent
            ? scanner.agent.pos
            : scanner.node.worldPosition;
        const observedPosition = observed?.agent
            ? observed.agent.pos
            : observed?.node.worldPosition;
        const prefVelocity = scanner.agent?.prefVel;

        this.battleTelemetry.recordScannerTrace({
            frame: this.frame,
            time: this.battleElapsedTime,
            source,
            reason,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            scannerUnitName: scanner.unitTypeName,
            scannerLifeId: scanner.lifeId,
            scannerX: scannerPosition.x,
            scannerZ: scannerPosition.z,
            scannerPrefVelocityX: prefVelocity?.x ?? 0,
            scannerPrefVelocityZ: prefVelocity?.z ?? 0,
            scannerBusy: scanner.onBusy,
            scannerForward: scanner.onForward,
            waveForward: wave.isForwardMode(),
            aggressiveForward: wave.isAggressiveForwardMode(),
            targetWaveIdBefore: targetWaveBefore?.id ?? -1,
            targetLaneIdBefore: targetWaveBefore?.laneId ?? -1,
            targetWaveIdAfter: targetWaveAfter?.id ?? -1,
            targetLaneIdAfter: targetWaveAfter?.laneId ?? -1,
            candidateWaveId: observedWave?.id ?? -1,
            candidateLaneId: observedWave?.laneId ?? -1,
            candidateUnitName: observed?.unitTypeName ?? '',
            candidateLifeId: observed?.lifeId ?? -1,
            candidateX: observedPosition?.x ?? 0,
            candidateZ: observedPosition?.z ?? 0,
            observedEnemyCount,
        });
    }

    private shouldUseSoloAggressiveCombat(
        wave: BattleWave,
        unit: Unit | null,
        enemy: Unit | null
    ) {
        if (!wave.isAggressiveForwardMode()) return false;
        if (!unit || !enemy) return false;
        if (
            !unit.onForward &&
            !unit.isSoloAggressiveSkirmishActive()
        ) {
            return false;
        }
        const unitLane =
            this.getCurrentLaneIdForUnit(unit);
        const enemyLane =
            this.getCurrentLaneIdForUnit(enemy);

        if (unitLane < 0 || enemyLane < 0) return false;

        if (unitLane !== enemyLane) {
            return true;
        }

        return this.isEnemyOutsideUnitAttackRange(
            unit,
            enemy
        );
    }

    private isEnemyOutsideUnitAttackRange(
        unit: Unit,
        enemy: Unit
    ) {
        if (!unit.agent || !enemy.agent) return false;

        const dx = enemy.agent.pos.x - unit.agent.pos.x;
        const dz = enemy.agent.pos.z - unit.agent.pos.z;
        const range =
            Math.max(0, unit.attackRange) +
            Math.max(0, unit.radius) +
            Math.max(0, enemy.radius);

        return dx * dx + dz * dz >
            range * range + 0.0001;
    }

    private getCurrentLaneIdForUnit(
        unit: Unit | null
    ) {
        if (!unit) return -1;

        if (unit.agent) {
            return this.getNearestLaneIdForX(
                unit.agent.pos.x
            );
        }

        if (unit.node && unit.node.isValid) {
            return this.getNearestLaneIdForX(
                unit.node.worldPosition.x
            );
        }

        return unit.laneId >= 0
            ? this.clampLaneId(unit.laneId)
            : -1;
    }

    public shouldResumeSoloForwardAfterAggressiveSkirmish(
        unit: Unit | null
    ) {
        if (!unit) return false;

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return false;
        if (wave.isDead()) return false;
        if (!wave.isAggressiveForwardMode()) return false;

        return unit.isSoloAggressiveSkirmishActive() &&
            !unit.onForward &&
            !unit.onBusy &&
            !unit.hasValidEnemyTarget();
    }

    private shouldDelayInitialForwardCombat(
        wave: BattleWave,
        unit: Unit | null,
        enemy: Unit | null,
        useInitialForwardGate: boolean
    ) {
        if (!useInitialForwardGate) return false;
        if (!wave.isInitialForwardCombatGateActive()) return false;
        if (!unit || !enemy) return false;
        if (!unit.onForward) return false;
        if (unit.laneId < 0 || enemy.laneId < 0) return false;

        if (
            this.clampLaneId(unit.laneId) !==
            this.clampLaneId(enemy.laneId)
        ) {
            return false;
        }

        const aliveCount =
            wave.getRuntimeAliveCount(this.frame);
        const threshold =
            Math.min(
                aliveCount,
                wave.getInitialForwardCombatReleaseThreshold()
            );

        if (threshold <= 1) return false;

        return wave.getEngagedCountIncluding(unit) < threshold;
    }

    public onWaveForwardTargetFound(
        unit: Unit | null,
        target: Unit | null
    ) {
        if (!unit || !target) return false;

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return false;
        if (wave.isDead()) return false;

        if (!this.trySetWaveTargetFromScanner(
            wave,
            unit,
            target,
            'forward-scanner'
        )) {
            return false;
        }
        wave.releaseForwardToFreeHunt();
        unit.setWaveSearchTarget(target);

        return true;
    }

    public isWaveHuntScanner(unit: Unit | null) {
        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave || wave.isDeadRuntime(this.frame)) {
            return false;
        }

        if (wave.isForwardMode()) return false;

        return wave.isCurrentScanner(unit);
    }

    public getWaveHuntScannerForUnit(unit: Unit | null) {
        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave || wave.isDeadRuntime(this.frame)) {
            return null;
        }

        return wave.getScanner();
    }

    public getWaveTargetForUnit(unit: Unit | null) {
        const wave =
            BattleWave.getWaveForUnit(unit);

        return wave ? wave.getTargetWave() : null;
    }

    public hasWaveHuntScannerConfirmedNoTarget(
        unit: Unit | null
    ) {
        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave || wave.isDeadRuntime(this.frame)) {
            return true;
        }

        return wave.hasHuntScannerConfirmedNoTarget();
    }

    public onWaveHuntScannerTargetFound(
        scanner: Unit | null,
        target: Unit | null
    ) {
        const wave =
            BattleWave.getWaveForUnit(scanner);

        if (!wave) return false;

        return this.trySetWaveTargetFromScanner(
            wave,
            scanner,
            target,
            'hunt-scanner'
        );
    }

    public findSharedWaveTargetForUnit(
        unit: Unit | null
    ): Unit | null {
        if (!unit) return null;

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return null;

        return wave.findSharedTargetForUnit(
            unit
        );
    }

    private processDynamicWaveLanes() {
        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            this.refreshDynamicLaneForWave(wave);
        }

        this.refreshDynamicLaneForWave(
            this.teamAHeroWave
        );
        this.refreshDynamicLaneForWave(
            this.teamBHeroWave
        );
    }

    private processWaveForwardSearches() {
        for (let i = 0; i < this.waves.length; i++) {
            this.searchForwardWaveTarget(
                this.waves[i]
            );
        }
    }

    private processWaveHuntScannerRefreshes() {
        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave.isForwardMode()) continue;
            if (wave.isDeadRuntime(this.frame)) continue;
            const forceTargetSearch =
                wave.hasImmediateTargetSearchPending();

            if (
                !forceTargetSearch &&
                !this.shouldRunFrameInterval(
                    wave.getTargetSearchIntervalFrames(),
                    wave.id
                )
            ) {
                continue;
            }

            const scanner = wave.getScanner(true);
            if (!scanner) continue;

            if (!forceTargetSearch) continue;

            // A busy scanner must finish its real local combat first: that
            // engagement may establish a new targetWave. A non-busy local
            // chase must not delay the rest of the wave's strategic order.
            if (scanner.onBusy) {
                continue;
            }

            if (!wave.consumeImmediateTargetSearch()) {
                continue;
            }

            scanner.forceHuntScannerTargetSearch();
        }
    }

    private searchForwardWaveTarget(
        wave: BattleWave | null
    ) {
        if (!wave) return;
        if (!wave.isForwardMode()) return;
        if (wave.isDeadRuntime(this.frame)) return;

        let scanner =
            wave.getScanner();

        if (!scanner) return;

        if (this.resolveUnitReachedEnemyHeroLine(scanner)) {
            return;
        }

        const aggressiveForward =
            wave.isAggressiveForwardMode();

        if (
            !aggressiveForward &&
            scanner.hasReachedEnemyHeroLine()
        ) {
            const heroTarget =
                scanner.getEnemyHeroTarget();

            if (heroTarget) {
                this.onWaveForwardTargetFound(
                    scanner,
                    heroTarget
                );
            }

            return;
        }

        if (aggressiveForward) {
            if (
                !this.shouldRunFrameInterval(
                    wave.getTargetSearchIntervalFrames(),
                    wave.id
                )
            ) {
                return;
            }

            scanner = wave.getScanner(true);

            if (!scanner) return;

            const targetWaveBefore = wave.getTargetWave();

            const adjacentRearGuard =
                this.findDeepestAdjacentEnemyWaveScanner(
                    wave,
                    scanner
                );

            if (adjacentRearGuard) {
                if (
                    wave.observeAggressiveAdjacentBoundary()
                ) {
                    this.recordAggressiveForwardEvent(
                        'aggressive-boundary-observed',
                        wave,
                        scanner,
                        adjacentRearGuard,
                        0,
                        'deepest-adjacent-enemy-wave'
                    );
                }
            }

            const enemiesAhead =
                this.countEnemiesAheadInSameLane(
                    scanner
                );

            this.recordWaveScannerTrace(
                scanner,
                adjacentRearGuard,
                'forward-aggressive',
                enemiesAhead > 0
                    ? 'own-lane-blocked'
                    : adjacentRearGuard
                        ? 'lane-clear-adjacent-flank'
                        : 'lane-clear',
                targetWaveBefore,
                enemiesAhead + (adjacentRearGuard ? 1 : 0)
            );

            if (enemiesAhead > 0) {
                if (
                    wave.observeAggressiveOwnLaneBlock()
                ) {
                    this.recordAggressiveForwardEvent(
                        'aggressive-own-lane-blocked',
                        wave,
                        scanner,
                        adjacentRearGuard,
                        enemiesAhead,
                        'enemy-ahead-in-own-lane'
                    );
                }

                return;
            }

            // An aggressive wave treats a neighbouring enemy wave as flank
            // information, not a forward-release boundary. With its own lane
            // clear it keeps marching toward the enemy line; an actual
            // same-lane combat still switches the wave through the normal
            // combat path in onWaveCombatStarted.
            return;
        }

        if (
            !this.shouldRunFrameInterval(
                wave.getTargetSearchIntervalFrames(),
                wave.id
            )
        ) {
            return;
        }

        scanner = wave.getScanner(true);

        if (!scanner) return;

        const targetWaveBefore = wave.getTargetWave();

        const target =
            scanner.findForwardSearchTarget();

        const releasesTarget =
            !!target &&
            this.shouldReleaseNormalForwardTarget(
                scanner,
                target
            );

        if (target && releasesTarget) {
            this.onWaveForwardTargetFound(
                scanner,
                target
            );
        }

        this.recordWaveScannerTrace(
            scanner,
            target,
            'forward-normal',
            target
                ? releasesTarget
                    ? 'target-passed-release'
                    : 'target-not-passed'
                : 'no-forward-target',
            targetWaveBefore,
            target ? 1 : 0
        );
    }

    private shouldReleaseNormalForwardTarget(
        scanner: Unit,
        target: Unit
    ) {
        if (!scanner || !target) return false;
        if (scanner.laneId < 0) return false;
        if (target.laneId < 0) return false;

        const scannerLane =
            this.clampLaneId(scanner.laneId);
        const targetLane =
            this.clampLaneId(target.laneId);

        const laneDistance =
            Math.abs(
                scannerLane -
                targetLane
            );

        if (laneDistance > 1) {
            return false;
        }

        return scanner.hasPassedForwardTarget(
            target
        );
    }

    private findDeepestAdjacentEnemyWaveScanner(
        wave: BattleWave,
        scanner: Unit
    ): Unit | null {
        if (!scanner.agent) return null;

        const ownLane =
            wave.laneId >= 0
                ? this.clampLaneId(wave.laneId)
                : this.getCurrentLaneIdForUnit(scanner);

        if (ownLane < 0) return null;

        let best: Unit | null = null;
        let bestProgress = -Infinity;

        for (let i = 0; i < this.waves.length; i++) {
            const enemyWave = this.waves[i];

            if (!enemyWave) continue;
            if (enemyWave.team === wave.team) continue;
            if (enemyWave.isDeadRuntime(this.frame)) continue;
            if (enemyWave.laneId < 0) continue;

            const enemyLane =
                this.clampLaneId(enemyWave.laneId);

            if (
                Math.abs(enemyLane - ownLane) !== 1
            ) {
                continue;
            }

            const enemyScanner =
                enemyWave.getProgressScanner();

            if (!enemyScanner || !enemyScanner.agent) {
                continue;
            }

            const progress =
                enemyScanner.agent.pos.x *
                    scanner.forwardDir.x +
                enemyScanner.agent.pos.z *
                    scanner.forwardDir.z;

            if (progress > bestProgress) {
                bestProgress = progress;
                best = enemyScanner;
            }
        }

        return best;
    }

    private countEnemiesAheadInSameLane(
        scanner: Unit
    ) {
        if (scanner.laneId < 0) return 0;

        const ownLane =
            this.clampLaneId(scanner.laneId);

        const enemies =
            scanner.team === 0
                ? this.teamB
                : this.teamA;
        let count = 0;

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            if (!this.isAliveUnit(enemy)) continue;
            if (enemy.laneId < 0) continue;
            if (
                this.clampLaneId(enemy.laneId) !==
                ownLane
            ) {
                continue;
            }

            if (
                !scanner.hasPassedForwardTarget(
                    enemy
                )
            ) {
                count++;
            }
        }

        return count;
    }

    private recordAggressiveForwardEvent(
        type: string,
        wave: BattleWave,
        scanner: Unit,
        boundary: Unit | null,
        enemiesAhead: number,
        reason: string
    ) {
        if (!this.enableBattleTelemetry) return;

        const boundaryWave =
            BattleWave.getWaveForUnit(boundary);

        this.battleTelemetry.recordAggressiveForwardEvent({
            type,
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName:
                UnitFamily[wave.family] ??
                String(wave.family),
            reason,
            boundaryWaveId:
                boundaryWave
                    ? boundaryWave.id
                    : -1,
            boundaryLaneId:
                boundaryWave
                    ? boundaryWave.laneId
                    : -1,
            boundaryUnitName:
                boundary
                    ? boundary.unitTypeName
                    : '',
            enemiesAhead,
            combatPoint:
                this.combatPoint[wave.team] || 0,
        });
    }

    private processWaveForwardRecoveries() {
        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
                continue;
            }

            wave.refreshInitialForwardCombatGate();
            const resumed = wave.tryResumeForward(
                this.refreshLaneBeforeWaveForward
            );

            if (resumed) {
                this.recordWaveForwardResume(wave);
            }
        }
    }

    private processWaveBanners() {
        const bannerInterval =
            this.shouldRunFrameInterval(
                this.waveBannerRefreshIntervalFrames,
                0
            );

        if (
            this.waveBannerCameraVisibilityDirty ||
            bannerInterval
        ) {
            this.updateWaveBannerCameraVisibility(false);
        }

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
                continue;
            }

            if (
                !this.shouldRunFrameInterval(
                    this.waveBannerRefreshIntervalFrames,
                    wave.id + 1
                )
            ) {
                continue;
            }

            wave.refreshWaveBanner();
            this.updateWaveBannerHealthBar(wave);
        }
    }

    private updateWaveBannerCameraVisibility(
        force: boolean
    ) {
        const visible =
            this.resolveWaveBannerCameraVisibility();

        if (
            !force &&
            this.waveBannerVisibilityInitialized &&
            visible === this.waveBannerVisibleByCamera
        ) {
            this.waveBannerCameraVisibilityDirty = false;
            return;
        }

        this.waveBannerVisibilityInitialized = true;
        this.waveBannerVisibleByCamera = visible;
        this.waveBannerCameraVisibilityDirty = false;

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
                continue;
            }

            wave.setWaveBannerVisible(visible);
        }
    }

    private resolveWaveBannerCameraVisibility() {
        if (!this.enableWaveBannerCameraVisibility) {
            return true;
        }

        if (
            this.hideWaveBannerInOrbitMode &&
            this.waveBannerCameraBlocked
        ) {
            return false;
        }

        const topDownVisibility =
            this.resolveTopDownZoomBannerVisibility();

        if (topDownVisibility !== null) {
            return topDownVisibility;
        }

        const camera =
            this.resolveWaveBannerCamera();

        if (!camera) {
            return true;
        }

        const fov = camera.fov;
        const hideFov = Math.max(
            0,
            this.waveBannerHideFovBelow
        );
        const showFov = Math.max(
            hideFov,
            this.waveBannerShowFovAbove
        );

        if (!this.waveBannerVisibilityInitialized) {
            return fov > hideFov;
        }

        if (this.waveBannerVisibleByCamera) {
            return fov > hideFov;
        }

        return fov >= showFov;
    }

    private resolveTopDownZoomBannerVisibility(): boolean | null {
        const controller: any =
            this.cinematicController as any;

        const topDownCameraDrag =
            controller && controller.topDownCameraDrag
                ? controller.topDownCameraDrag
                : null;

        if (!topDownCameraDrag) {
            return null;
        }

        if (
            typeof topDownCameraDrag.getTargetFov !== 'function' ||
            typeof topDownCameraDrag.getMinFov !== 'function' ||
            typeof topDownCameraDrag.getMaxFov !== 'function'
        ) {
            return null;
        }

        const targetFov =
            topDownCameraDrag.getTargetFov();
        const minFov =
            topDownCameraDrag.getMinFov();
        const maxFov =
            topDownCameraDrag.getMaxFov();

        if (
            typeof targetFov !== 'number' ||
            typeof minFov !== 'number' ||
            typeof maxFov !== 'number'
        ) {
            return null;
        }

        const epsilon = 0.001;

        if (targetFov <= minFov + epsilon) {
            return false;
        }

        if (targetFov >= maxFov - epsilon) {
            return true;
        }

        if (!this.waveBannerVisibilityInitialized) {
            return true;
        }

        return this.waveBannerVisibleByCamera;
    }

    public shouldShowUnitHealthBars() {
        if (!this.enableWaveBannerCameraVisibility) {
            return false;
        }

        if (!this.waveBannerVisibilityInitialized) {
            return !this.resolveWaveBannerCameraVisibility();
        }

        return !this.waveBannerVisibleByCamera;
    }

    private resolveWaveBannerCamera(): Camera | null {
        if (this.waveBannerCamera) {
            return this.waveBannerCamera;
        }

        const controller: any =
            this.cinematicController as any;

        if (controller && controller.mainCamera) {
            return controller.mainCamera as Camera;
        }

        return null;
    }

    private refreshDynamicLaneForWave(
        wave: BattleWave | null,
        force: boolean = false
    ) {
        if (!wave) return;
        if (wave.isDeadRuntime(this.frame)) return;
        if (wave.hasBackToLaneUnits()) return;

        const interval =
            wave.getTargetSearchIntervalFrames();
        const offset =
            wave.id + Math.floor(interval / 2);

        // Lane is strategic metadata only. Stagger updates by wave
        // and away from forward scans for the same wave.
        if (
            !force &&
            !this.shouldRunFrameInterval(
                interval,
                offset
            )
        ) {
            return;
        }

        // A wave's lane follows its active scanner, never a majority of
        // members temporarily spread across lanes by combat or regrouping.
        const scanner = wave.getScanner();
        if (!scanner) return;

        const scannerX =
            scanner.agent
                ? scanner.agent.pos.x
                : scanner.node.worldPosition.x;
        const laneId = this.getNearestLaneIdForX(scannerX);

        if (
            laneId >= 0 &&
            laneId !== wave.laneId
        ) {
            wave.setLaneId(laneId);
        }
    }

    private pruneDeadWaves() {
        for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];

            if (!wave || !wave.isDeadRuntime(this.frame)) continue;

            wave.releaseReferences();
            this.waves.splice(i, 1);
        }
    }

    private processHeroForwardUnlock() {
        if (!this.isCombatPointEnabled()) {
            return;
        }

        this.tryUnlockHeroForward(0);
        this.tryUnlockHeroForward(1);
    }

    private tryUnlockHeroForward(team: number) {
        if (this.heroForwardUnlocked[team]) {
            return;
        }

        if (this.canAffordAnyMeleeSpawnEntry(team)) {
            return;
        }

        const laneSelection = this.getHeroSupportLaneSelection(team);
        const hero =
            this.activateHeroForTeam(
                team,
                laneSelection.laneId,
                laneSelection.unitsPerLane
            );

        if (!this.isAliveUnit(hero)) {
            return;
        }

        this.unlockHeroForward(team, hero!, laneSelection.laneId);
    }

    private unlockHeroForward(
        team: number,
        hero: Unit,
        laneId: number
    ) {
        let heroWave =
            team === 0
                ? this.teamAHeroWave
                : this.teamBHeroWave;

        if (!heroWave || heroWave.isDead()) {
            this.registerHeroWave(
                hero,
                team,
                hero.unitTypeName,
                hero.props
                    ? hero.props.family
                    : UnitFamily.Sword,
                hero.props
                    ? hero.props.tier
                    : 1,
                laneId
            );

            heroWave =
                team === 0
                    ? this.teamAHeroWave
                    : this.teamBHeroWave;
        }

        if (heroWave) {
            heroWave.setLaneId(laneId);
        }

        this.heroForwardUnlocked[team] = true;
        hero.setSteady(false, true);

        if (heroWave) {
            this.ensureBattleWaveRegistered(heroWave);
            heroWave.forceForwardMode();
        }
    }

    private canAffordAnySpawnEntry(team: number) {
        const entries =
            this.getDatabaseTeamEntries(team);

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!this.isValidSpawnEntry(entry)) continue;

            if (this.canAffordEntry(team, entry)) {
                return true;
            }
        }

        return false;
    }

    public canTeamAffordAnySpawn(team: number) {
        return this.canAffordAnySpawnEntry(team);
    }

    private canAffordAnyMeleeSpawnEntry(team: number) {
        const entries =
            this.getDatabaseTeamEntries(team);

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!this.isValidSpawnEntry(entry)) continue;
            if (
                entry.family === UnitFamily.Archer ||
                entry.family === UnitFamily.Monk
            ) {
                continue;
            }

            if (this.canAffordEntry(team, entry)) {
                return true;
            }
        }

        return false;
    }

    private resetBattleTelemetry() {
        this.battleTelemetry.reset(
            this.enableBattleTelemetry,
            this.createBattleTelemetryStartConfig()
        );
        this.battleTelemetry.configureDiagnostics(
            this.battleTelemetryMaxSnapshots,
            this.battleTelemetryMaxDiagnosticEvents,
            this.battleTelemetryMaxScannerTraces
        );
    }

    private ensureBattleCardRuntime() {
        if (this.battleCardRuntime) return;

        this.battleCardRuntime = new BattleCardRuntime(
            this.battleCardDatabase,
            (event) => this.recordBattleCardTelemetryEvent(event)
        );
    }

    private recordBattleCardTelemetryEvent(
        event: BattleCardTelemetryEvent
    ) {
        if (!this.enableBattleTelemetry) return;

        this.battleTelemetry.recordCardEvent({
            ...event,
            frame: this.frame,
        });
    }

    public recordBattleTelemetryWaveSpawnDecision(
        decision: BattleTelemetryWaveSpawnDecision
    ) {
        if (!this.enableBattleTelemetry) return;

        this.battleTelemetry.recordWaveSpawnDecision(
            decision
        );
    }

    public getBattleElapsedTime() {
        return this.battleElapsedTime;
    }

    private recordBattleTelemetrySnapshotIfNeeded() {
        if (!this.enableBattleTelemetry) return;
        if (!this.battleTelemetry.isEnabled()) return;
        if (
            !this.shouldRunFrameInterval(
                this.battleTelemetrySnapshotIntervalFrames
            )
        ) {
            return;
        }

        this.battleTelemetry.recordSnapshot(
            this.createBattleTelemetrySnapshot()
        );
    }

    private createBattleTelemetrySnapshot() {
        return {
            frame: this.frame,
            time: this.battleElapsedTime,
            teams: [
                this.createBattleTelemetryTeamSnapshot(0),
                this.createBattleTelemetryTeamSnapshot(1),
            ],
        };
    }

    private createBattleTelemetryTeamSnapshot(team: number) {
        const waves: any[] = [];

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDeadRuntime(this.frame)) continue;

            waves.push(
                this.createBattleTelemetryWaveSnapshot(wave)
            );
        }

        return {
            team,
            combatPoint: this.combatPoint[team] || 0,
            aliveCount: this.aliveCount[team] || 0,
            waveCount: waves.length,
            heroHealthRatio:
                this.getBattleTelemetryHeroHealthRatio(team),
            killCount: this.killCount[team] || 0,
            counterKillCount:
                this.counterKillCount[team] || 0,
            totalDamage:
                this.battleTelemetry.getTotalDamage(team),
            totalHeroDamage:
                this.battleTelemetry.getTotalHeroDamage(team),
            activeCardIds: this.getBattleCardTelemetrySnapshot()
                .find((entry: any) => entry.team === team)
                ?.deck
                .filter((card: any) => card.active)
                .map((card: any) => card.id) || [],
            waves,
        };
    }

    private createBattleTelemetryWaveSnapshot(
        wave: BattleWave
    ) {
        let busyCount = 0;
        let targetCount = 0;
        let continuityCount = 0;
        let forwardCount = 0;

        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];

            if (!this.isAliveUnit(unit)) continue;

            if (unit.onBusy) busyCount++;
            if (unit.hasValidEnemyTarget()) targetCount++;
            if (unit.isContinuingFreeHuntIntent()) {
                continuityCount++;
            }
            if (unit.onForward) forwardCount++;
        }

        const targetState = wave.getTelemetryTargetState();

        return {
            waveId: wave.id,
            team: wave.team,
            laneId: wave.laneId,
            unitName: wave.unitName,
            family: wave.family,
            familyName:
                UnitFamily[wave.family] ??
                String(wave.family),
            tier: wave.tier,
            totalCount: wave.totalCount,
            aliveCount:
                wave.getRuntimeAliveCount(this.frame),
            busyCount,
            targetCount,
            continuityCount,
            forwardCount,
            healthRatio:
                wave.getRuntimeHealthRatio(this.frame),
            forwardMode: wave.isForwardMode(),
            aggressiveForward:
                wave.isAggressiveForwardMode(),
            ...targetState,
        };
    }

    private getBattleTelemetryHeroHealthRatio(team: number) {
        const hero =
            team === 0
                ? this.teamAHero
                : this.teamBHero;

        if (!this.isAliveUnit(hero)) return 0;
        if (!hero!.props) return 0;

        return hero!.props.getHealthRatio();
    }

    private processBattleWinnerCondition(force: boolean = false) {
        if (!this.enableBattleWinnerCheck) return;
        if (this.hasBattleWinner()) return;
        if (this.combatResolutionDepth > 0) {
            if (force) {
                this.pendingForcedBattleWinnerCheck = true;
            }

            return;
        }
        if (!this.enableNoAffordableSpawnWinnerFallback) return;
        if (!this.isCombatPointEnabled()) return;
        if (
            !force &&
            !this.shouldRunFrameInterval(
                this.battleWinnerCheckIntervalFrames
            )
        ) {
            return;
        }

        const teamAHasTroops =
            this.getAliveNonHeroUnitCount(0) > 0 ||
            this.isAliveUnit(this.teamAHero);
        const teamBHasTroops =
            this.getAliveNonHeroUnitCount(1) > 0 ||
            this.isAliveUnit(this.teamBHero);
        const teamACanSpawn =
            this.canAffordAnySpawnEntry(0);
        const teamBCanSpawn =
            this.canAffordAnySpawnEntry(1);

        const teamAEliminated =
            !teamACanSpawn && !teamAHasTroops;
        const teamBEliminated =
            !teamBCanSpawn && !teamBHasTroops;

        if (!teamAEliminated && !teamBEliminated) {
            return;
        }

        const loserTeam =
            teamAEliminated && teamBEliminated
                ? -1
                : teamAEliminated
                    ? 0
                    : 1;
        const winnerTeam =
            loserTeam < 0
                ? -1
                : loserTeam === 0
                    ? 1
                    : 0;
        const reason =
            'team-eliminated-and-cannot-afford-spawn';

        this.resolveBattleWinner(
            winnerTeam,
            loserTeam,
            reason
        );
    }

    public getAliveNonHeroUnitCount(team: number) {
        const units =
            team === 0
                ? this.teamA
                : team === 1
                    ? this.teamB
                    : null;

        if (!units) return 0;

        let count = 0;

        for (let i = 0; i < units.length; i++) {
            const unit = units[i];

            if (!this.isAliveUnit(unit)) continue;
            if (unit.isHero) continue;

            count++;
        }

        return count;
    }

    private resolveBattleWinner(
        winnerTeam: number,
        loserTeam: number,
        reason: string
    ) {
        if (!this.enableBattleWinnerCheck) return;
        if (this.hasBattleWinner()) return;
        if (this.combatResolutionDepth > 0) {
            this.pendingBattleWinner = {
                winnerTeam,
                loserTeam,
                reason,
            };
            return;
        }

        this.battleWinnerTeam = winnerTeam;
        this.battleLoserTeam = loserTeam;
        this.battleWinnerReason = reason;
        this.battleWinnerResolved = true;

        console.log(
            `[BattleWinner] winnerTeam=${winnerTeam}, ` +
            `loserTeam=${loserTeam}, reason=${reason}`
        );

        const canFinishTelemetry =
            this.enableBattleTelemetry &&
            this.battleTelemetry.isEnabled() &&
            !this.battleTelemetry.hasEnded();

        if (canFinishTelemetry) {
            this.battleTelemetry.recordFinalSnapshot(
                this.createBattleTelemetrySnapshot()
            );
            this.recordBattleFramePerformanceSummary();
        }

        const progressionResult =
            this.battleProgressionProvider
                ? this.battleProgressionProvider
                    .handleBattleResult(
                        winnerTeam,
                        loserTeam,
                        reason
                    )
                : null;

        if (!canFinishTelemetry) {
            this.scheduleBattleTelemetryPageReload();
            return;
        }

        const report =
            this.battleTelemetry.finish(
                winnerTeam,
                loserTeam,
                reason,
                this.frame,
                this.battleElapsedTime,
                this.combatPoint,
                this.aliveCount,
                this.deathCount,
                this.killCount,
                this.counterKillCount,
                progressionResult
            );

        this.battleTelemetry.exportReport(
            report,
            this.battleTelemetryFilePrefix,
            this.downloadBattleTelemetryOnEnd,
            this.logBattleTelemetryOnEnd
        );

        this.scheduleBattleTelemetryPageReload();
    }

    public hasBattleWinner() {
        return this.battleWinnerResolved;
    }

    public isBattleCombatLocked() {
        return this.heroDefeatDetected || this.hasBattleWinner();
    }

    private haltAllUnitsForBattleEnd() {
        const units = this.teamA.concat(this.teamB);

        for (let i = 0; i < units.length; i++) {
            units[i]?.haltForBattleEnd();
        }
    }

    public beginCombatResolution() {
        this.combatResolutionDepth++;
    }

    public endCombatResolution() {
        if (this.combatResolutionDepth <= 0) {
            this.combatResolutionDepth = 0;
            return;
        }

        this.combatResolutionDepth--;

        if (this.combatResolutionDepth > 0) return;

        const pendingWinner =
            this.pendingBattleWinner;
        const shouldCheckFallback =
            this.pendingForcedBattleWinnerCheck;

        this.pendingBattleWinner = null;
        this.pendingForcedBattleWinnerCheck = false;

        if (pendingWinner) {
            this.resolveBattleWinner(
                pendingWinner.winnerTeam,
                pendingWinner.loserTeam,
                pendingWinner.reason
            );
        }

        if (
            !this.hasBattleWinner() &&
            shouldCheckFallback
        ) {
            this.processBattleWinnerCondition(true);
        }
    }

    private scheduleBattleTelemetryPageReload() {
        const progressionProvider = this.battleProgressionProvider;

        // A real campaign keeps its state in local storage and starts its next
        // scene only after telemetry export has been requested. This keeps the
        // battle-end sequence in one owner instead of racing two timers.
        if (progressionProvider) {
            if (!progressionProvider.shouldResetBattleAfterResult()) {
                return;
            }

            const delayMs = Math.max(
                0,
                this.battleTelemetryReloadDelaySeconds
            ) * 1000;
            const resetBattle = () => {
                if (!progressionProvider.resetBattle()) {
                    console.warn(
                        '[BattleProgression] battle runtime reset was not started.'
                    );
                }
            };

            console.log(
                `[BattleProgression] restart battle runtime in ` +
                `${(delayMs / 1000).toFixed(2)}s.`
            );

            if (typeof window !== 'undefined' && window.setTimeout) {
                window.setTimeout(resetBattle, delayMs);
                return;
            }

            this.scheduleOnce(resetBattle, delayMs / 1000);
            return;
        }

        if (!this.reloadPageAfterBattleTelemetryExport) {
            return;
        }
        if (!this.enableBattleTelemetry) {
            return;
        }
        if (typeof window === 'undefined') return;
        if (!window.location) return;

        const nextBatchUrl = this.getNextTelemetryBatchUrl();

        if (
            this.isTelemetryBatchQueryActive() &&
            !nextBatchUrl
        ) {
            console.log(
                '[BattleTelemetry] telemetry batch query complete.'
            );
            return;
        }

        const delayMs =
            Math.max(
                0,
                this.battleTelemetryReloadDelaySeconds
            ) * 1000;

        console.log(
            `[BattleTelemetry] reload page in ` +
            `${(delayMs / 1000).toFixed(2)}s.`
        );

        window.setTimeout(
            () => {
                if (nextBatchUrl) {
                    window.location.replace(nextBatchUrl);
                    return;
                }

                window.location.reload();
            },
            delayMs
        );
    }

    private getNextTelemetryBatchUrl() {
        if (!this.isTelemetryBatchQueryActive()) {
            return '';
        }
        if (typeof window === 'undefined') return '';
        if (!window.location) return '';

        const params =
            new URLSearchParams(window.location.search);

        this.normalizeTelemetryBatchQueryParams(params);

        const levelQuery =
            this.getTelemetryLevelQueryConfig(params);

        if (levelQuery.active) {
            params.set(
                'currentLevel',
                `${levelQuery.currentLevel}`
            );
            params.set(
                'TotalLevels',
                `${levelQuery.totalLevels}`
            );
            this.removeLegacyAccuracyBatchParams(params);

            if (
                levelQuery.currentLevel >=
                levelQuery.totalLevels
            ) {
                return '';
            }

            params.set(
                'currentLevel',
                `${levelQuery.currentLevel + 1}`
            );

            return this.buildTelemetryBatchUrl(params);
        }

        const team =
            this.getTelemetryBatchQueryInt(
                params,
                'team',
                0
            ) === 1
                ? 1
                : 0;
        const currentAcc =
            this.clamp01(
                this.getTelemetryBatchQueryNumber(
                    params,
                    'currentAcc',
                    0
                )
            );
        const currentBatch =
            Math.max(
                0,
                this.getTelemetryBatchQueryInt(
                    params,
                    'currentBatch',
                    0
                )
            );
        const step =
            Math.max(
                0,
                this.getTelemetryBatchQueryNumber(
                    params,
                    'step',
                    0
                )
            );
        const numBatchPerStep =
            Math.max(
                1,
                this.getTelemetryBatchQueryInt(
                    params,
                    'numBatchPerStep',
                    1
                )
            );
        const end =
            this.clamp01(
                this.getTelemetryBatchQueryNumber(
                    params,
                    'end',
                    1
                )
            );
        const nextBatch =
            currentBatch + 1;

        params.set('team', `${team}`);
        params.set('step', this.formatTelemetryBatchNumber(step));
        params.set('numBatchPerStep', `${numBatchPerStep}`);
        params.set('end', this.formatTelemetryBatchNumber(end));

        if (nextBatch < numBatchPerStep) {
            params.set(
                'currentAcc',
                this.formatTelemetryBatchNumber(currentAcc)
            );
            params.set('currentBatch', `${nextBatch}`);
            return this.buildTelemetryBatchUrl(params);
        }

        if (currentAcc >= end - 0.000001) {
            return '';
        }

        if (step <= 0) {
            return '';
        }

        const nextAcc =
            Math.min(
                end,
                currentAcc + step
            );

        params.set(
            'currentAcc',
            this.formatTelemetryBatchNumber(nextAcc)
        );
        params.set('currentBatch', '0');

        return this.buildTelemetryBatchUrl(params);
    }

    private isTelemetryBatchQueryActive() {
        if (typeof window === 'undefined') return false;
        if (!window.location) return false;

        const params =
            new URLSearchParams(window.location.search);

        this.normalizeTelemetryBatchQueryParams(params);

        if (
            this.getTelemetryLevelQueryConfig(params).active
        ) {
            return true;
        }

        return this.hasTelemetryBatchQueryParam(
            params,
            'currentAcc'
        ) ||
            this.hasTelemetryBatchQueryParam(
                params,
                'currentBatch'
            ) ||
            this.hasTelemetryBatchQueryParam(
                params,
                'step'
            ) ||
            this.hasTelemetryBatchQueryParam(
                params,
                'numBatchPerStep'
            ) ||
            this.hasTelemetryBatchQueryParam(
                params,
                'end'
            );
    }

    private getTelemetryLevelQueryConfig(
        params: any
    ) {
        const totalLevels =
            Math.max(
                0,
                this.getTelemetryBatchQueryInt(
                    params,
                    'TotalLevels',
                    0
                )
            );

        if (totalLevels <= 0) {
            return {
                active: false,
                currentLevel: 0,
                totalLevels: 0,
                levelProgress: 0,
            };
        }

        const currentLevel =
            Math.max(
                1,
                Math.min(
                    totalLevels,
                    this.getTelemetryBatchQueryInt(
                        params,
                        'currentLevel',
                        1
                    )
                )
            );
        const levelProgress =
            totalLevels <= 1
                ? 1
                : (currentLevel - 1) /
                    (totalLevels - 1);

        return {
            active: true,
            currentLevel,
            totalLevels,
            levelProgress,
        };
    }

    private removeLegacyAccuracyBatchParams(
        params: any
    ) {
        const keys = [
            'currentAcc',
            'currentBatch',
            'step',
            'numBatchPerStep',
            'end',
        ];

        for (let i = 0; i < keys.length; i++) {
            params.delete(keys[i]);
            params.delete(`?${keys[i]}`);
        }
    }

    private getTelemetryBatchQueryNumber(
        params: any,
        key: string,
        fallback: number
    ) {
        const value =
            Number(
                this.getTelemetryBatchQueryParam(
                    params,
                    key
                )
            );

        return Number.isFinite(value)
            ? value
            : fallback;
    }

    private getTelemetryBatchQueryInt(
        params: any,
        key: string,
        fallback: number
    ) {
        return Math.floor(
            this.getTelemetryBatchQueryNumber(
                params,
                key,
                fallback
            )
        );
    }

    private formatTelemetryBatchNumber(value: number) {
        return `${Math.round(value * 1000000) / 1000000}`;
    }

    private hasTelemetryBatchQueryParam(
        params: any,
        key: string
    ) {
        return params.has(key) ||
            params.has(`?${key}`);
    }

    private getTelemetryBatchQueryParam(
        params: any,
        key: string
    ) {
        return params.get(`?${key}`) ??
            params.get(key);
    }

    private normalizeTelemetryBatchQueryParams(
        params: any
    ) {
        const keys = [
            'team',
            'currentAcc',
            'currentBatch',
            'step',
            'numBatchPerStep',
            'end',
            'currentLevel',
            'TotalLevels',
            'totalLevels',
        ];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const badKey = `?${key}`;
            const badValue =
                params.get(badKey);

            if (badValue !== null) {
                params.set(key, badValue);
            }

            params.delete(badKey);
        }

        const lowerCaseTotalLevels =
            params.get('totalLevels');

        if (
            lowerCaseTotalLevels !== null &&
            !params.has('TotalLevels')
        ) {
            params.set(
                'TotalLevels',
                lowerCaseTotalLevels
            );
        }

        params.delete('totalLevels');
    }

    private buildTelemetryBatchUrl(params: any) {
        if (typeof window === 'undefined') return '';
        if (!window.location) return '';

        const location = window.location;
        const origin =
            location.origin ||
            `${location.protocol}//${location.host}`;
        const query = params.toString();

        return `${origin}${location.pathname}` +
            `${query ? `?${query}` : ''}` +
            `${location.hash || ''}`;
    }

    private createBattleTelemetryStartConfig() {
        return {
            startedAt: new Date().toISOString(),
            telemetryBatch:
                this.createBattleTelemetryBatchConfigSnapshot(),
            battleBounds: {
                minX: this.battleMinX,
                maxX: this.battleMaxX,
                minZ: this.battleMinZ,
                maxZ: this.battleMaxZ,
            },
            laneCount: this.getSafeLaneCount(),
            initialCombatPoint: [
                this.initialCombatPoint[0],
                this.initialCombatPoint[1],
            ],
            unitStats:
                this.createBattleTelemetryUnitStatsSnapshot(),
            counterRules:
                this.createBattleTelemetryCounterRuleSnapshot(),
            cardEffectsEnabled: this.enableBattleCardEffects,
            cards: this.getBattleCardTelemetrySnapshot(),
            progression:
                this.battleProgressionProvider
                    ? this.battleProgressionProvider
                        .createTelemetrySnapshot()
                    : undefined,
        };
    }

    private createBattleTelemetryBatchConfigSnapshot() {
        const inactive = {
            active: false,
            team: 0,
            currentAcc: 0,
            currentBatch: 0,
            step: 0,
            numBatchPerStep: 1,
            end: 1,
            levelMode: false,
            currentLevel: 0,
            totalLevels: 0,
            levelProgress: 0,
        };

        if (!this.isTelemetryBatchQueryActive()) {
            return inactive;
        }
        if (typeof window === 'undefined') return inactive;
        if (!window.location) return inactive;

        const params =
            new URLSearchParams(window.location.search);

        this.normalizeTelemetryBatchQueryParams(params);

        const team =
            this.getTelemetryBatchQueryInt(
                params,
                'team',
                0
            ) === 1
                ? 1
                : 0;
        const levelQuery =
            this.getTelemetryLevelQueryConfig(params);

        if (levelQuery.active) {
            return {
                active: true,
                team,
                currentAcc: levelQuery.levelProgress,
                currentBatch: 0,
                step: 0,
                numBatchPerStep: 1,
                end: 1,
                levelMode: true,
                currentLevel: levelQuery.currentLevel,
                totalLevels: levelQuery.totalLevels,
                levelProgress: levelQuery.levelProgress,
            };
        }

        return {
            active: true,
            team,
            currentAcc:
                this.clamp01(
                    this.getTelemetryBatchQueryNumber(
                        params,
                        'currentAcc',
                        0
                    )
                ),
            currentBatch:
                Math.max(
                    0,
                    this.getTelemetryBatchQueryInt(
                        params,
                        'currentBatch',
                        0
                    )
                ),
            step:
                Math.max(
                    0,
                    this.getTelemetryBatchQueryNumber(
                        params,
                        'step',
                        0
                    )
                ),
            numBatchPerStep:
                Math.max(
                    1,
                    this.getTelemetryBatchQueryInt(
                        params,
                        'numBatchPerStep',
                        1
                    )
                ),
            end:
                this.clamp01(
                    this.getTelemetryBatchQueryNumber(
                        params,
                        'end',
                        1
                    )
                ),
            levelMode: false,
            currentLevel: 0,
            totalLevels: 0,
            levelProgress: 0,
        };
    }

    private createBattleTelemetryUnitStatsSnapshot():
        BattleTelemetryUnitSnapshot[] {
        const result: BattleTelemetryUnitSnapshot[] = [];

        for (let team = 0; team <= 1; team++) {
            const entries =
                this.getDatabaseTeamEntries(team);

            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];

                if (!entry) continue;

                result.push({
                    team,
                    name: entry.name,
                    family: entry.family,
                    familyName:
                        UnitFamily[entry.family] ??
                        String(entry.family),
                    tier: entry.tier,
                    unlocked: entry.unlocked,
                    unitCount: entry.unitCount,
                    cost: entry.combatPointCost,
                    health: entry.health,
                    attack: entry.damage,
                    damageRadius: entry.damageRadius,
                    defense: entry.defense,
                    speed: entry.maxSpeed,
                    range: entry.attackRange,
                    attackIntervalMin:
                        entry.attackIntervalMin,
                    attackIntervalMax:
                        entry.attackIntervalMax,
                });
            }
        }

        return result;
    }

    private createBattleTelemetryCounterRuleSnapshot():
        BattleTelemetryCounterRuleSnapshot[] {
        const counter =
            CounterSettings.instance;

        if (!counter) return [];

        const result: BattleTelemetryCounterRuleSnapshot[] = [];

        for (let i = 0; i < counter.rules.length; i++) {
            const rule = counter.rules[i];

            if (!rule) continue;

            result.push({
                attackerFamily: rule.attackerFamily,
                attackerFamilyName:
                    UnitFamily[rule.attackerFamily] ??
                    String(rule.attackerFamily),
                defenderFamily: rule.defenderFamily,
                defenderFamilyName:
                    UnitFamily[rule.defenderFamily] ??
                    String(rule.defenderFamily),
                damageMultiplier: rule.damageMultiplier,
            });
        }

        return result;
    }

    private isAliveUnit(unit: Unit | null) {
        if (!unit) return false;
        if (!unit.node.activeInHierarchy) return false;
        if (!unit.agent) return false;
        if (!unit.props) return false;
        if (unit.props.isDead()) return false;

        return true;
    }

    private addCombatPointFromVictim(
        killer: Unit,
        victim: Unit,
        isCounterKill: boolean
    ) {
        if (!this.isCombatPointEnabled()) return;
        if (!this.unitDatabase) return;

        const killerTeam = killer.team;

        const bountyValue = this.getVictimBountyValue(victim);
        if (bountyValue <= 0) return;

        const reward =
            this.unitDatabase.calculateKillRewardFromBounty(
                bountyValue,
                isCounterKill
            );

        this.addCombatPoint(killerTeam, reward);

        if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordCombatPointEarned(
                killer,
                victim,
                reward,
                isCounterKill,
                this.frame,
                this.battleElapsedTime
            );
        }
    }

    private getVictimBountyValue(victim: Unit) {
        const victimTeam = victim.team;

        if (victim.isHero) {
            const heroEntry = this.getHeroEntry(victimTeam);

            if (!heroEntry) return 0;

            return Math.max(
                0,
                heroEntry.combatPointBountyValue
            );
        }

        const entry = this.getTeamEntry(
            victimTeam,
            victim.unitTypeName
        );

        if (!entry) return 0;

        return Math.max(
            0,
            entry.combatPointCost
        );
    }

    public addCombatPoint(
        team: number,
        amount: number
    ) {
        if (team !== 0 && team !== 1) return;
        if (amount <= 0) return;

        this.combatPoint[team] += amount;
    }

    public spendCombatPoint(
        team: number,
        amount: number
    ) {
        if (team !== 0 && team !== 1) return false;
        if (amount <= 0) return true;

        if (this.combatPoint[team] < amount) {
            return false;
        }

        this.combatPoint[team] -= amount;
        return true;
    }

    public canAffordEntry(
        team: number,
        entry: UnitPrefabEntry | null
    ) {
        if (!entry) return false;
        if (!this.isCombatPointEnabled()) return true;

        return this.combatPoint[team] >=
            Math.max(0, entry.combatPointCost);
    }

    public isValidSpawnEntry(
        entry: UnitPrefabEntry | null,
        requirePositiveUnitCount: boolean = true
    ) {
        if (!entry) return false;
        if (!entry.name) return false;
        if (!entry.prefab) return false;
        const unlocked =
            this.unitDatabase
                ? this.unitDatabase.isEntryUnlocked(entry)
                : entry.unlocked;

        if (!unlocked) {
            return false;
        }

        if (
            requirePositiveUnitCount &&
            Math.floor(entry.unitCount) <= 0
        ) {
            return false;
        }

        return true;
    }

    public canAffordUnitName(
        team: number,
        unitName: string
    ) {
        const safeName =
            (unitName || '').trim();

        if (!safeName) return false;

        const entry =
            this.getTeamEntry(team, safeName);

        if (!this.isValidSpawnEntry(entry)) {
            return false;
        }

        return this.canAffordEntry(team, entry);
    }

    public isUnitNameUnlocked(
        team: number,
        unitName: string
    ) {
        const safeName =
            (unitName || '').trim();

        if (!safeName) return false;

        const entry =
            this.getTeamEntry(team, safeName);

        if (!entry) return false;

        return this.unitDatabase
            ? this.unitDatabase.isEntryUnlocked(entry)
            : entry.unlocked;
    }

    public collectAffordableEntries(
        team: number,
        out: UnitPrefabEntry[]
    ) {
        out.length = 0;

        const entries =
            this.getDatabaseTeamEntries(team);

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!this.isValidSpawnEntry(entry)) continue;

            if (!this.canAffordEntry(team, entry)) {
                continue;
            }

            out.push(entry);
        }

        return out;
    }

    public getCombatPoint(team: number) {
        if (team !== 0 && team !== 1) return 0;

        return this.combatPoint[team];
    }

    public getInitialCombatPoint(team: number) {
        if (team !== 0 && team !== 1) return 0;

        return this.initialCombatPoint[team];
    }

    private isCombatPointEnabled() {
        return !!(
            this.unitDatabase &&
            this.unitDatabase.enableCombatPoint
        );
    }

    public getCounterKillRatio(team: number) {
        if (team !== 0 && team !== 1) return 0;

        if (this.killCount[team] <= 0) {
            return 0;
        }

        return this.counterKillCount[team] / this.killCount[team];
    }

    private notifyUnitWillDespawn(unit: Unit) {
        if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordDespawn(
                unit,
                this.frame,
                this.battleElapsedTime
            );
        }

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (wave) {
            wave.invalidateRuntimeState();
            wave.handleUnitWillDespawn(unit);
            this.updateWaveBannerHealthBar(wave);
        }

        const anyController = this.cinematicController as any;

        if (
            anyController &&
            typeof anyController.onUnitWillDespawn === 'function'
        ) {
            anyController.onUnitWillDespawn(unit);
        }
    }

    private rebuildSpatialGrid() {
        this.spatialGrid.cellSize =
            this.spatialGridCellSize;
        this.spatialGrid.setBattlefieldBounds(
            this.battleMinX,
            this.battleMaxX,
            this.battleMinZ,
            this.battleMaxZ
        );

        this.spatialGrid.useWorkerTargetQuery =
            this.useWorkerSpatialTargetQuery;

        this.spatialGrid.build(
            this.teamA,
            this.teamB
        );

        this.spatialGridDirty = false;
    }

    private requestSpatialGridRebuild() {
        this.spatialGridDirty = true;
    }

    private buildPrefabMaps() {
        this.teamAPrefabMap.clear();
        this.teamBPrefabMap.clear();

        const teamAEntries = this.getDatabaseTeamEntries(0);
        const teamBEntries = this.getDatabaseTeamEntries(1);

        for (const entry of teamAEntries) {
            if (!this.isValidEntry(entry)) continue;

            this.teamAPrefabMap.set(
                entry.name,
                entry
            );
        }

        for (const entry of teamBEntries) {
            if (!this.isValidEntry(entry)) continue;

            this.teamBPrefabMap.set(
                entry.name,
                entry
            );
        }
    }

    private prewarmAllUnits() {
        const teamAEntries = this.getDatabaseTeamEntries(0);
        const teamBEntries = this.getDatabaseTeamEntries(1);
        const runtimeRoot = this.getBattleRuntimeRoot();

        for (const entry of teamAEntries) {
            if (!this.isValidEntry(entry)) continue;

            this.spawner.prewarm(
                entry.prefab!,
                entry.prewarmCount,
                runtimeRoot
            );
        }

        for (const entry of teamBEntries) {
            if (!this.isValidEntry(entry)) continue;

            this.spawner.prewarm(
                entry.prefab!,
                entry.prewarmCount,
                runtimeRoot
            );
        }
    }

    private getDatabaseTeamEntries(team: number) {
        if (!this.unitDatabase) {
            return [];
        }

        return this.unitDatabase.getTeamEntries(team);
    }

    private getBattleRuntimeRoot() {
        const root = this.battleRuntimeRoot;

        if (root && root.isValid) {
            return root;
        }

        const nextRoot = new Node('BattleRuntime');
        this.node.addChild(nextRoot);
        this.battleRuntimeRoot = nextRoot;

        return nextRoot;
    }

    private isValidEntry(entry: UnitPrefabEntry | null): boolean {
        return this.isValidSpawnEntry(entry, false);
    }

    private getTeamEntry(
        team: number,
        unitName: string
    ): UnitPrefabEntry | null {

        if (this.unitDatabase) {
            const dbEntry =
                this.unitDatabase.getEntry(team, unitName);

            if (dbEntry && dbEntry.prefab) {
                return dbEntry;
            }
        }

        const map =
            team === 0
                ? this.teamAPrefabMap
                : this.teamBPrefabMap;

        const entry = map.get(unitName);

        if (!entry || !entry.prefab) {
            return null;
        }

        return entry;
    }

    private getHeroEntry(team: number): HeroEntry | null {
        if (!this.unitDatabase) return null;

        return this.unitDatabase.getHeroEntry(team);
    }

    private getRandomEntry(
        entries: UnitPrefabEntry[],
        team: number
    ): UnitPrefabEntry | null {

        const validEntries: UnitPrefabEntry[] = [];

        for (const entry of entries) {
            if (!this.isValidSpawnEntry(entry)) continue;

            if (!this.canAffordEntry(team, entry)) {
                continue;
            }

            validEntries.push(entry);
        }

        if (validEntries.length <= 0) {
            return null;
        }

        const index = Math.floor(
            Math.random() * validEntries.length
        );

        return validEntries[index];
    }

    public getTeamEntries(team: number): UnitPrefabEntry[] {
        return this.getDatabaseTeamEntries(team);
    }

    public getAliveUnits(team: number): Unit[] {
        return team === 0
            ? this.teamA
            : this.teamB;
    }

    public getAliveWaveCount(team: number) {
        let count = 0;

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDead()) continue;

            count++;
        }

        return count;
    }

    public getTotalAliveWaveCount() {
        let count = 0;

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;
            if (wave.isDead()) continue;

            count++;
        }

        return count;
    }

    public getTotalAliveUnitCount() {
        return Math.max(0, this.aliveCount[0]) +
            Math.max(0, this.aliveCount[1]);
    }

    public getWavesByTeam(team: number): BattleWave[] {
        const result: BattleWave[] = [];

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDead()) continue;

            result.push(wave);
        }

        return result;
    }

    private updateAutoSpawn(deltaTime: number) {
        const safeDeltaTime = Math.min(
            deltaTime,
            Math.max(0.016, this.maxAutoSpawnDeltaTime)
        );

        this.spawnWaveTimer += safeDeltaTime;

        if (
            this.spawnWaveTimer <
            this.spawnWaveInterval
        ) {
            return;
        }

        this.spawnWaveTimer = 0;

        this.spawnAutoWave();
    }

    spawnAutoWave() {
        const teamAEntries =
            this.getDatabaseTeamEntries(0);

        const teamBEntries =
            this.getDatabaseTeamEntries(1);

        const entryA =
            this.getRandomEntry(teamAEntries, 0);

        const entryB =
            this.getRandomEntry(teamBEntries, 1);

        if (entryA) {
            this.spawnEntryFormation(
                0,
                entryA,
                this.teamASpawnZ,
                true
            );
        }

        if (entryB) {
            this.spawnEntryFormation(
                1,
                entryB,
                this.teamBSpawnZ,
                true
            );
        }

        this.requestSpatialGridRebuild();
    }

    public spawnWaveByEntry(
        team: number,
        entry: UnitPrefabEntry,
        laneId: number = -1,
        aggressiveForward: boolean = false,
        spawnReason: string = ''
    ): BattleWave | null {

        if (!this.isValidSpawnEntry(entry)) {
            return null;
        }

        const baseZ =
            team === 0
                ? this.teamASpawnZ
                : this.teamBSpawnZ;

        const wave = this.spawnEntryFormation(
            team,
            entry,
            baseZ,
            true,
            laneId,
            aggressiveForward,
            spawnReason
        );

        this.requestSpatialGridRebuild();

        return wave;
    }

    public spawnWaveByName(
        team: number,
        unitName: string,
        laneId: number = -1,
        aggressiveForward: boolean = false,
        spawnReason: string = ''
    ): BattleWave | null {

        const entry = this.getTeamEntry(
            team,
            unitName
        );

        if (!entry) return null;

        return this.spawnWaveByEntry(
            team,
            entry,
            laneId,
            aggressiveForward,
            spawnReason
        );
    }

    private spawnEntryFormation(
        team: number,
        entry: UnitPrefabEntry,
        baseZ: number,
        spendCost: boolean,
        requestedLaneId: number = -1,
        aggressiveForward: boolean = false,
        spawnReason: string = ''
    ): BattleWave | null {
        if (!this.battleRuntimeActive) return null;

        if (!this.isValidSpawnEntry(entry)) {
            return null;
        }

        const count = Math.max(
            0,
            Math.floor(entry.unitCount)
        );

        if (count <= 0) {
            return null;
        }

        const cost = Math.max(
            0,
            entry.combatPointCost
        );

        if (
            spendCost &&
            this.isCombatPointEnabled() &&
            !this.spendCombatPoint(team, cost)
        ) {
            this.requestBattleStatsUIRefresh();
            return null;
        }

        const laneId =
            this.resolveSpawnLaneId(requestedLaneId);

        const wave = new BattleWave(
            this.nextWaveId++,
            team,
            entry.name,
            entry.family,
            entry.tier,
            count,
            laneId
        );

        wave.setInitialForwardCombatReleaseThreshold(
            entry.maxUnitPerRow
        );

        this.waves.push(wave);

        if (this.enableLaneSpawn) {
            this.spawnSquareFormationInLane(
                team,
                entry,
                baseZ,
                wave,
                laneId,
                count,
                aggressiveForward
            );
        } else {
            this.spawnCenteredRowsFormation(
                team,
                entry,
                baseZ,
                wave,
                count,
                aggressiveForward
            );
        }

        this.assignWaveBanner(
            wave,
            entry
        );

        if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordWaveSpawnEvent({
                type: 'wave-spawn',
                frame: this.frame,
                time: this.battleElapsedTime,
                team,
                waveId: wave.id,
                laneId,
                unitName: entry.name,
                familyName:
                    UnitFamily[entry.family] ??
                    String(entry.family),
                aggressiveForward,
                reason: spawnReason,
            });
        }

        if (spendCost && this.isCombatPointEnabled()) {
            if (this.enableBattleTelemetry) {
                this.battleTelemetry.recordCombatPointSpent(
                    team,
                    entry.name,
                    entry.family,
                    entry.tier,
                    cost,
                    wave.id,
                    this.frame,
                    this.battleElapsedTime
                );
            }
        }

        this.node.emit(
            BattleWaveSpawnedEvent,
            wave
        );

        return wave;
    }

    private assignWaveBanner(
        wave: BattleWave,
        entry: UnitPrefabEntry | null
    ) {
        const prefab =
            entry ? entry.waveBannerPrefab : null;

        if (!prefab) return;
        if (!wave) return;
        if (wave.getAliveCount() <= 0) return;

        const node =
            this.acquireWaveBanner(prefab);

        if (!node) return;

        this.applyWaveBannerAppearance(
            node,
            wave.team,
            entry ? entry.waveBannerIconId : 0
        );

        wave.setWaveBanner(
            node,
            (bannerNode: Node) => {
                this.recycleWaveBanner(
                    prefab,
                    bannerNode
                );
            },
            (bannerNode: Node) => {
                this.applyWaveBannerAppearance(
                    bannerNode,
                    wave.team,
                    entry ? entry.waveBannerIconId : 0
                );
                this.updateWaveBannerHealthBar(wave);
            }
        );

        wave.setWaveBannerVisible(
            this.waveBannerVisibleByCamera
        );

        this.updateWaveBannerHealthBar(wave);
    }

    private applyWaveBannerAppearance(
        node: Node,
        team: number,
        iconId: number
    ) {
        const params =
            this.getWaveBannerColorParams(team);

        const iconParams =
            this.getWaveBannerIconParams(
                node,
                iconId
            );

        const sharedMaterial =
            this.getWaveBannerMaterial();

        const renderers =
            this.getWaveBannerRenderers(node);

        for (let i = 0; i < renderers.length; i++) {
            const renderer = renderers[i];

            if (
                sharedMaterial &&
                renderer.sharedMaterials?.[0] !==
                sharedMaterial
            ) {
                renderer.setSharedMaterial(
                    sharedMaterial,
                    0
                );
            }

            renderer.setInstancedAttribute(
                'a_billboard_bg_color',
                params
            );

            renderer.setInstancedAttribute(
                'a_billboard_icon_id',
                iconParams
            );
        }
    }

    private getWaveBannerIconParams(
        node: Node,
        iconId: number
    ) {
        let params =
            this.waveBannerIconParamCache.get(node);

        if (!params) {
            params = [0, 0, 0, 0];
            this.waveBannerIconParamCache.set(
                node,
                params
            );
        }

        params[0] =
            Math.max(
                0,
                Math.floor(iconId)
            );
        params[1] = 0;
        params[2] = 0;
        params[3] = 0;

        return params;
    }

    private getWaveBannerMaterial(): Material | null {
        return this.unitDatabase
            ? this.unitDatabase.waveBannerMaterial
            : null;
    }

    private updateWaveBannerHealthBar(
        wave: BattleWave | null
    ) {
        if (!wave) return;

        const node =
            wave.getWaveBannerNode();

        if (!node) return;

        const healthBars =
            this.getWaveBannerHealthBars(node);

        if (healthBars.length <= 0) return;

        const ratio =
            wave.getRuntimeHealthRatio(this.frame);

        for (let i = 0; i < healthBars.length; i++) {
            healthBars[i].setHealthRatio(ratio);
        }
    }

    private getWaveBannerHealthBars(node: Node) {
        let healthBars =
            this.waveBannerHealthBarCache.get(node);

        if (!healthBars) {
            healthBars =
                node.getComponentsInChildren(HealthBar3D);

            this.waveBannerHealthBarCache.set(
                node,
                healthBars
            );
        }

        return healthBars;
    }

    private getWaveBannerColorParams(team: number) {
        const color =
            this.getWaveBannerBackgroundColor(team);
        const params =
            team === 0
                ? this.waveBannerTeamAColorParams
                : this.waveBannerTeamBColorParams;

        params[0] =
            this.srgbChannelToLinear(color.r / 255);
        params[1] =
            this.srgbChannelToLinear(color.g / 255);
        params[2] =
            this.srgbChannelToLinear(color.b / 255);
        params[3] = color.a / 255;

        return params;
    }

    private srgbChannelToLinear(value: number) {
        const v = Math.min(
            1,
            Math.max(0, value)
        );

        return v <= 0.04045
            ? v / 12.92
            : Math.pow(
                (v + 0.055) / 1.055,
                2.4
            );
    }

    private getWaveBannerRenderers(node: Node) {
        let renderers =
            this.waveBannerRendererCache.get(node);

        if (!renderers) {
            const allRenderers =
                node.getComponentsInChildren(MeshRenderer);

            renderers = [];

            for (let i = 0; i < allRenderers.length; i++) {
                const renderer = allRenderers[i];

                if (
                    renderer.node.getComponent(HealthBar3D)
                ) {
                    continue;
                }

                renderers.push(renderer);
            }

            this.waveBannerRendererCache.set(
                node,
                renderers
            );
        }

        return renderers;
    }

    private getWaveBannerBackgroundColor(
        team: number
    ): Color {
        if (this.unitDatabase) {
            return team === 0
                ? this.unitDatabase.teamAWaveBannerBackgroundColor
                : this.unitDatabase.teamBWaveBannerBackgroundColor;
        }

        return team === 0
            ? this.fallbackTeamABannerColor
            : this.fallbackTeamBBannerColor;
    }

    private registerWaveBannerCameraEvents() {
        this.unregisterWaveBannerCameraEvents();

        const controller =
            this.cinematicController;

        if (!controller || !controller.node) return;

        this.registeredCinematicController = controller;

        controller.node.on(
            BannerVisibilityBlockedEvent,
            this.onWaveBannerCameraBlockedChanged,
            this
        );

        const controllerAny: any = controller as any;
        const topDownCameraDrag =
            controllerAny && controllerAny.topDownCameraDrag
                ? controllerAny.topDownCameraDrag
                : null;

        if (topDownCameraDrag && topDownCameraDrag.node) {
            this.registeredTopDownCameraDragNode =
                topDownCameraDrag.node;

            topDownCameraDrag.node.on(
                TopDownZoomRangeChangedEvent,
                this.onWaveBannerCameraVisibilityChanged,
                this
            );
        }

        if (
            typeof controllerAny.isBannerVisibilityBlocked ===
            'function'
        ) {
            this.waveBannerCameraBlocked =
                !!controllerAny.isBannerVisibilityBlocked();
        }
    }

    private unregisterWaveBannerCameraEvents() {
        const controller =
            this.registeredCinematicController;

        if (controller && isValid(controller, true)) {
            const controllerNode = controller.node;

            if (controllerNode && isValid(controllerNode, true)) {
                controllerNode.off(
                    BannerVisibilityBlockedEvent,
                    this.onWaveBannerCameraBlockedChanged,
                    this
                );
            }
        }

        const topDownCameraDragNode =
            this.registeredTopDownCameraDragNode;

        if (topDownCameraDragNode &&
            isValid(topDownCameraDragNode, true)) {
            topDownCameraDragNode.off(
                TopDownZoomRangeChangedEvent,
                this.onWaveBannerCameraVisibilityChanged,
                this
            );
        }

        this.registeredCinematicController = null;
        this.registeredTopDownCameraDragNode = null;
    }

    private onWaveBannerCameraBlockedChanged(
        blocked: boolean
    ) {
        this.waveBannerCameraBlocked = !!blocked;
        this.onWaveBannerCameraVisibilityChanged();
    }

    private onWaveBannerCameraVisibilityChanged() {
        this.waveBannerCameraVisibilityDirty = true;
        this.updateWaveBannerCameraVisibility(false);
    }

    private acquireWaveBanner(
        prefab: Prefab
    ): Node | null {
        const pool =
            this.getWaveBannerPool(prefab);

        const node =
            pool.length > 0
                ? pool.pop()!
                : instantiate(prefab);

        node.active = true;
        return node;
    }

    private recycleWaveBanner(
        prefab: Prefab,
        node: Node
    ) {
        if (!node || !node.isValid) return;

        node.active = false;
        node.setParent(null);

        const pool =
            this.getWaveBannerPool(prefab);

        if (pool.indexOf(node) < 0) {
            pool.push(node);
        }
    }

    private getWaveBannerPool(
        prefab: Prefab
    ) {
        let pool =
            this.waveBannerPools.get(prefab);

        if (!pool) {
            pool = [];
            this.waveBannerPools.set(prefab, pool);
        }

        return pool;
    }

    private clearWaveBannerPools() {
        this.waveBannerPools.forEach((pool) => {
            for (let i = 0; i < pool.length; i++) {
                const node = pool[i];

                if (node && node.isValid) {
                    node.destroy();
                }
            }

            pool.length = 0;
        });

        this.waveBannerPools.clear();
    }

    private spawnSquareFormationInLane(
        team: number,
        entry: UnitPrefabEntry,
        baseZ: number,
        wave: BattleWave,
        laneId: number,
        count: number,
        aggressiveForward: boolean = false
    ) {
        const width = Math.max(
            1,
            Math.floor(entry.squareFormationWidth)
        );
        const unitSpacing =
            Math.max(
                0,
                entry.spaceBetweenUnit
            );
        const rowSpacing =
            Math.max(
                0,
                entry.spaceBetweenRow
            );

        const laneCenterX =
            this.getLaneCenterX(laneId);

        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / width);
            const col = i % width;

            const rowCount = Math.min(
                width,
                count - row * width
            );

            const x =
                laneCenterX +
                (
                    col -
                    (rowCount - 1) * 0.5
                ) *
                unitSpacing;

            const rowZOffset =
                row * rowSpacing;

            const baseUnitZ =
                team === 0
                    ? baseZ - rowZOffset
                    : baseZ + rowZOffset;

            const z =
                baseUnitZ +
                this.randomRange(
                    -this.formationZNoise,
                    this.formationZNoise
                );

            this.tempSpawnPos.set(x, 0, z);

            this.spawnUnitForWave(
                team,
                entry,
                this.tempSpawnPos,
                wave,
                laneId,
                aggressiveForward
            );
        }
    }

    private spawnCenteredRowsFormation(
        team: number,
        entry: UnitPrefabEntry,
        baseZ: number,
        wave: BattleWave,
        count: number,
        aggressiveForward: boolean = false
    ) {
        const maxPerRow = Math.max(
            1,
            Math.floor(entry.maxUnitPerRow)
        );
        const rowSpacing =
            Math.max(
                0,
                entry.spaceBetweenRow
            );
        const unitSpacing =
            Math.max(
                0,
                entry.spaceBetweenUnit
            );

        let spawned = 0;
        let row = 0;

        while (spawned < count) {

            const remaining = count - spawned;

            const rowCount = Math.min(
                maxPerRow,
                remaining
            );

            const rowXPositions =
                this.buildCenteredRowXPositions(
                    rowCount,
                    row,
                    unitSpacing
                );

            for (
                let col = 0;
                col < rowCount;
                col++
            ) {

                const x = rowXPositions[col];

                const rowZOffset =
                    row * rowSpacing;

                const baseUnitZ =
                    team === 0
                        ? baseZ - rowZOffset
                        : baseZ + rowZOffset;

                const z =
                    baseUnitZ +
                    this.randomRange(
                        -this.formationZNoise,
                        this.formationZNoise
                    );

                this.tempSpawnPos.set(x, 0, z);

                this.spawnUnitForWave(
                    team,
                    entry,
                    this.tempSpawnPos,
                    wave,
                    wave.laneId,
                    aggressiveForward
                );

                spawned++;
            }

            row++;
        }
    }

    private spawnUnitForWave(
        team: number,
        entry: UnitPrefabEntry,
        pos: Vec3,
        wave: BattleWave,
        laneId: number,
        aggressiveForward: boolean = false
    ) {
        let unit: Unit | null = null;

        if (team === 0) {
            unit = this.spawnTeamA(
                entry.name,
                pos
            );
        } else {
            unit = this.spawnTeamB(
                entry.name,
                pos
            );
        }

        if (!unit) return;

        unit.laneId = laneId;
        unit.aggressiveForward = aggressiveForward;

        wave.addUnit(unit);

        if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordSpawn(
                unit,
                team,
                entry.name,
                entry.family,
                entry.tier,
                wave.id,
                this.frame,
                this.battleElapsedTime
            );
        }
    }

    public resolveSpawnLaneId(
        requestedLaneId: number = -1
    ): number {
        const count = this.getSafeLaneCount();

        if (requestedLaneId >= 0) {
            return this.clampLaneId(requestedLaneId);
        }

        if (this.enableLaneSpawn && this.autoSpawnRandomLane) {
            return Math.floor(Math.random() * count);
        }

        return this.clampLaneId(this.defaultSpawnLane);
    }

    public getSafeLaneCount() {
        return Math.max(
            1,
            Math.floor(this.laneCount)
        );
    }

    public clampLaneId(laneId: number) {
        const count = this.getSafeLaneCount();

        return Math.max(
            0,
            Math.min(
                count - 1,
                Math.floor(laneId)
            )
        );
    }

    public getLaneCenterX(laneId: number) {
        const count = this.getSafeLaneCount();
        const safeLane = this.clampLaneId(laneId);

        const width =
            this.battleMaxX - this.battleMinX;

        if (width <= 0) {
            return 0;
        }

        const laneWidth = width / count;

        return (
            this.battleMinX +
            laneWidth * (safeLane + 0.5)
        );
    }

    public getLaneWidth() {
        const count = this.getSafeLaneCount();
        const width =
            this.battleMaxX - this.battleMinX;

        if (width <= 0) {
            return 0;
        }

        return width / count;
    }

    public getLaneMinX(laneId: number) {
        return this.getLaneCenterX(laneId) -
            this.getLaneWidth() * 0.5;
    }

    public getLaneMaxX(laneId: number) {
        return this.getLaneCenterX(laneId) +
            this.getLaneWidth() * 0.5;
    }

    public getDirectionToLaneArea(
        laneId: number,
        x: number
    ) {
        if (laneId < 0) return 0;

        const width =
            this.getLaneWidth();

        if (width <= 0) return 0;

        const centerX =
            this.getLaneCenterX(laneId);
        const coreHalfWidth =
            width * 0.25;
        const minX =
            centerX - coreHalfWidth;
        const maxX =
            centerX + coreHalfWidth;

        if (x < minX) return 1;
        if (x > maxX) return -1;

        return 0;
    }

    public getNearestLaneIdForX(x: number) {
        const count = this.getSafeLaneCount();

        let bestLane = 0;
        let bestDist = Infinity;

        for (let i = 0; i < count; i++) {
            const centerX = this.getLaneCenterX(i);
            const dist = Math.abs(x - centerX);

            if (dist < bestDist) {
                bestDist = dist;
                bestLane = i;
            }
        }

        return bestLane;
    }

    private buildCenteredRowXPositions(
        rowCount: number,
        rowIndex: number,
        unitSpacing: number
    ): number[] {

        const result =
            this.centeredRowXBuffer;

        result.length = 0;

        if (rowCount <= 0) {
            return result;
        }

        const gap = Math.max(
            0,
            this.centerGapWidth
        );

        if (gap <= 0) {

            for (
                let col = 0;
                col < rowCount;
                col++
            ) {

                const x =
                    (
                        col -
                        (rowCount - 1) * 0.5
                    ) *
                    unitSpacing;

                result.push(x);
            }

            return result;
        }

        const gapHalf = gap * 0.5;

        let pairIndex = 0;

        const startRightSide =
            rowIndex % 2 === 1;

        while (result.length < rowCount) {

            const leftX =
                -gapHalf -
                pairIndex * unitSpacing;

            const rightX =
                gapHalf +
                pairIndex * unitSpacing;

            if (startRightSide) {

                result.push(rightX);

                if (result.length < rowCount) {
                    result.push(leftX);
                }

            } else {

                result.push(leftX);

                if (result.length < rowCount) {
                    result.push(rightX);
                }
            }

            pairIndex++;
        }

        result.sort((a, b) => a - b);

        return result;
    }

    spawnTeamA(
        unitName: string,
        pos: Vec3
    ): Unit | null {

        const entry =
            this.getTeamEntry(0, unitName);

        if (!entry || !entry.prefab) {
            return null;
        }

        const unit = this.spawner.spawnUnit(
            entry.prefab,
            entry.name,
            entry.family,
            entry.tier,
            pos,
            0,
            this.getBattleRuntimeRoot(),
            entry.maxSpeed,
            entry.canBePush,
            entry.canBePassedThroughByForwardAlly,
            entry.attackRange,
            entry.attackIntervalMin,
            entry.attackIntervalMax,
            entry.health,
            entry.damage,
            entry.damageRadius,
            entry.defense
        );

        if (this.teamA.indexOf(unit) < 0) {
            this.teamA.push(unit);
            this.aliveCount[0]++;
        }

        const behavior =
            unit.getComponent(UnitBehavior);

        if (behavior) {
            behavior.gameManager = this;
        }

        this.requestBattleStatsUIRefresh();

        return unit;
    }

    spawnTeamB(
        unitName: string,
        pos: Vec3
    ): Unit | null {

        const entry =
            this.getTeamEntry(1, unitName);

        if (!entry || !entry.prefab) {
            return null;
        }

        const unit = this.spawner.spawnUnit(
            entry.prefab,
            entry.name,
            entry.family,
            entry.tier,
            pos,
            1,
            this.getBattleRuntimeRoot(),
            entry.maxSpeed,
            entry.canBePush,
            entry.canBePassedThroughByForwardAlly,
            entry.attackRange,
            entry.attackIntervalMin,
            entry.attackIntervalMax,
            entry.health,
            entry.damage,
            entry.damageRadius,
            entry.defense
        );

        if (this.teamB.indexOf(unit) < 0) {
            this.teamB.push(unit);
            this.aliveCount[1]++;
        }

        const behavior =
            unit.getComponent(UnitBehavior);

        if (behavior) {
            behavior.gameManager = this;
        }

        this.requestBattleStatsUIRefresh();

        return unit;
    }

    despawnUnit(unit: Unit) {
        if (!unit) return;

        this.notifyUnitWillDespawn(unit);

        if (unit.isHero) {
            this.handleHeroDeath(unit);
            return;
        }

        const team = unit.team;
        const unitName = unit.unitTypeName;

        const entry =
            this.getTeamEntry(team, unitName);

        if (!entry || !entry.prefab) {
            return;
        }

        if (team === 0) {

            const idx =
                this.teamA.indexOf(unit);

            if (idx >= 0) {

                this.teamA.splice(idx, 1);

                this.aliveCount[0]--;
                this.deathCount[0]++;

                if (this.aliveCount[0] < 0) {
                    this.aliveCount[0] = 0;
                }

                this.spawner.despawnUnit(
                    unit,
                    entry.prefab
                );

                this.requestSpatialGridRebuild();
                this.requestBattleStatsUIRefresh();
                this.processBattleWinnerCondition(true);
            }

            return;
        }

        if (team === 1) {

            const idx =
                this.teamB.indexOf(unit);

            if (idx >= 0) {

                this.teamB.splice(idx, 1);

                this.aliveCount[1]--;
                this.deathCount[1]++;

                if (this.aliveCount[1] < 0) {
                    this.aliveCount[1] = 0;
                }

                this.spawner.despawnUnit(
                    unit,
                    entry.prefab
                );

                this.requestSpatialGridRebuild();
                this.requestBattleStatsUIRefresh();
                this.processBattleWinnerCondition(true);
            }

            return;
        }
    }

    private handleHeroDeath(unit: Unit) {
        const team = unit.team;

        // Capture the tactical state while the hero is still registered,
        // before despawn removes its wave and agent from the battlefield.
        this.recordHeroDefeatTelemetryContext(unit);

        if (team === 0 || team === 1) {
            // A hero is a one-time final deployment. Keep this latched after
            // death so the low-CP activation check cannot respawn it.
            this.heroForwardUnlocked[team] = true;
        }

        if (team === 0) {

            if (this.teamAHeroWave) {
                this.removeBattleWaveReference(
                    this.teamAHeroWave
                );
                this.teamAHeroWave.releaseReferences();
                this.teamAHeroWave = null;
            }

            if (this.teamAHero === unit) {
                this.teamAHero = null;
            }

            const idx =
                this.teamA.indexOf(unit);

            if (idx >= 0) {
                this.teamA.splice(idx, 1);
            }

            this.aliveCount[0]--;
            this.deathCount[0]++;

            if (this.aliveCount[0] < 0) {
                this.aliveCount[0] = 0;
            }

        } else {

            if (this.teamBHeroWave) {
                this.removeBattleWaveReference(
                    this.teamBHeroWave
                );
                this.teamBHeroWave.releaseReferences();
                this.teamBHeroWave = null;
            }

            if (this.teamBHero === unit) {
                this.teamBHero = null;
            }

            const idx =
                this.teamB.indexOf(unit);

            if (idx >= 0) {
                this.teamB.splice(idx, 1);
            }

            this.aliveCount[1]--;
            this.deathCount[1]++;

            if (this.aliveCount[1] < 0) {
                this.aliveCount[1] = 0;
            }

        }

        this.removeUnitAgentFromSimulator(unit);
        unit.resetForDespawn();
        unit.node.active = false;

        this.requestSpatialGridRebuild();
        this.requestBattleStatsUIRefresh();

        if (team !== 0 && team !== 1) {
            return;
        }

        this.resolveHeroDefeat(unit);
    }

    private removeUnitAgentFromSimulator(unit: Unit) {
        if (!this.sim || !unit || !unit.agent) return;

        if (typeof this.sim.removeAgent === 'function') {
            this.sim.removeAgent(unit.agent);
            return;
        }

        if (this.sim.agents && Array.isArray(this.sim.agents)) {
            const idx = this.sim.agents.indexOf(unit.agent);

            if (idx >= 0) {
                this.sim.agents.splice(idx, 1);
            }
        }
    }

    private registerDatabaseHeroes() {
        if (!this.unitDatabase) return;

        this.teamAHeroEntry =
            this.unitDatabase.getHeroEntry(0);
        this.teamBHeroEntry =
            this.unitDatabase.getHeroEntry(1);

        this.captureHeroSpawnPosition(
            this.teamAHeroEntry
        );
        this.captureHeroSpawnPosition(
            this.teamBHeroEntry
        );

        this.captureHeroLine(0, this.teamAHeroEntry);
        this.captureHeroLine(1, this.teamBHeroEntry);

        this.prepareSceneHero(
            this.teamAHeroEntry
        );
        this.prepareSceneHero(
            this.teamBHeroEntry
        );
    }

    private captureHeroSpawnPosition(
        entry: HeroEntry | null
    ) {
        const node = entry?.heroNode;

        if (!node || this.heroSpawnPositions.has(node)) return;

        this.heroSpawnPositions.set(
            node,
            node.worldPosition.clone()
        );
    }

    private restoreHeroSpawnPosition(
        entry: HeroEntry
    ) {
        const node = entry.heroNode;
        const position = node
            ? this.heroSpawnPositions.get(node)
            : null;

        if (node && position) {
            node.setWorldPosition(position);
        }
    }

    private captureHeroLine(
        team: number,
        heroEntry: HeroEntry | null
    ) {
        if (team !== 0 && team !== 1) return;
        if (Number.isFinite(this.heroLineZ[team])) return;
        if (!heroEntry || !heroEntry.heroNode) return;

        const lineZ = heroEntry.heroNode.worldPosition.z;

        if (Number.isFinite(lineZ)) {
            this.heroLineZ[team] = lineZ;
        }
    }

    private prepareSceneHero(
        heroEntry: HeroEntry | null
    ) {
        if (!heroEntry || !heroEntry.heroNode) return;

        heroEntry.heroNode.active = false;
    }

    private activateHeroForTeam(
        team: number,
        laneId: number,
        supportUnitsPerLane: number[]
    ): Unit | null {
        const existing =
            team === 0
                ? this.teamAHero
                : this.teamBHero;

        if (this.isAliveUnit(existing)) {
            return existing;
        }

        const entry =
            team === 0
                ? this.teamAHeroEntry
                : this.teamBHeroEntry;

        return this.registerSceneHero(
            entry,
            team,
            team === 0 ? 'hero_a' : 'hero_b',
            laneId,
            supportUnitsPerLane
        );
    }

    private registerSceneHero(
        heroEntry: HeroEntry | null,
        team: number,
        fallbackTypeName: string,
        laneId: number,
        supportUnitsPerLane: number[]
    ): Unit | null {

        if (!heroEntry) return null;
        if (!heroEntry.heroNode) return null;

        this.restoreHeroSpawnPosition(heroEntry);
        heroEntry.heroNode.active = true;

        const hero = heroEntry.heroNode.getComponent(Unit);

        if (!hero) {
            heroEntry.heroNode.active = false;
            return null;
        }

        if (!hero.node.activeInHierarchy) {
            hero.node.active = false;
            return null;
        }

        hero.isHero = true;

        const props =
            hero.getComponent(UnitProps);

        if (props) {
            props.maxHealth = heroEntry.health;
            props.health = heroEntry.health;
            props.damage = heroEntry.damage;
            props.defense = heroEntry.defense;
            props.family = heroEntry.family;
            props.tier = Math.max(1, Math.min(3, Math.floor(heroEntry.tier)));
            props.resetForSpawn();
        }

        const behavior =
            hero.getComponent(UnitBehavior);

        if (behavior) {
            behavior.gameManager = this;
            behavior.resetForSpawn();
        }

        const unitTypeName =
            heroEntry.name && heroEntry.name.length > 0
                ? heroEntry.name
                : fallbackTypeName;

        const forwardX = 0;
        const forwardZ =
            team === 0 ? 1 : -1;

        const currentPosition =
            hero.node.worldPosition;

        this.tempSpawnPos.set(
            this.getLaneCenterX(laneId),
            currentPosition.y,
            currentPosition.z
        );
        hero.node.setWorldPosition(
            this.tempSpawnPos
        );

        hero.moveSpeed = heroEntry.maxSpeed;
        hero.canBePassedThroughByForwardAlly = false;
        hero.heroGuardDistance = heroEntry.guardDistance;
        hero.isSteady = false;

        hero.init(
            this.sim,
            team,
            unitTypeName,
            forwardX,
            forwardZ
        );

        this.registerHeroWave(
            hero,
            team,
            unitTypeName,
            heroEntry.family,
            heroEntry.tier,
            laneId
        );

        if (team === 0) {

            this.teamAHero = hero;

            if (
                this.teamA.indexOf(hero) < 0
            ) {
                this.teamA.push(hero);
                this.aliveCount[0]++;
            }

        } else {

            this.teamBHero = hero;

            if (
                this.teamB.indexOf(hero) < 0
            ) {
                this.teamB.push(hero);
                this.aliveCount[1]++;
            }

        }

        if (this.enableBattleTelemetry) {
            const heroWave =
                team === 0
                    ? this.teamAHeroWave
                    : this.teamBHeroWave;

            if (heroWave) {
                this.battleTelemetry.recordSpawn(
                    hero,
                    team,
                    unitTypeName,
                    heroEntry.family,
                    heroEntry.tier,
                    heroWave.id,
                    this.frame,
                    this.battleElapsedTime
                );
            }

            this.battleTelemetry.recordWaveSpawnEvent({
                type: 'hero-activated',
                frame: this.frame,
                time: this.battleElapsedTime,
                team,
                waveId:
                    heroWave
                        ? heroWave.id
                        : -1,
                laneId,
                unitName: unitTypeName,
                familyName:
                    UnitFamily[heroEntry.family] ??
                    String(heroEntry.family),
                aggressiveForward: false,
                reason: 'cannot-afford-any-melee-wave',
                combatPoint:
                    this.combatPoint[team] || 0,
                heroSupportUnitsPerLane:
                    supportUnitsPerLane.slice(),
                heroSelectedLaneSupportUnits:
                    supportUnitsPerLane[laneId] || 0,
                heroBestLaneSupportUnits:
                    Math.max(...supportUnitsPerLane, 0),
                heroLaneSelectionMatchesBest:
                    (supportUnitsPerLane[laneId] || 0) >=
                    Math.max(...supportUnitsPerLane, 0),
            });
        }

        this.requestSpatialGridRebuild();
        this.requestBattleStatsUIRefresh();

        return hero;
    }

    private registerHeroWave(
        hero: Unit,
        team: number,
        unitTypeName: string,
        family: UnitFamily,
        tier: number,
        laneId: number
    ) {
        const previousWave =
            team === 0
                ? this.teamAHeroWave
                : this.teamBHeroWave;

        if (previousWave) {
            this.removeBattleWaveReference(
                previousWave
            );
            previousWave.releaseReferences();
        }

        hero.laneId = laneId;

        const wave = new BattleWave(
            this.nextWaveId++,
            team,
            unitTypeName,
            family,
            tier,
            1,
            laneId
        );

        wave.addUnit(hero);

        if (team === 0) {
            this.teamAHeroWave = wave;
        } else {
            this.teamBHeroWave = wave;
        }

        if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordWaveSpawnEvent({
                type: 'hero-wave-register',
                frame: this.frame,
                time: this.battleElapsedTime,
                team,
                waveId: wave.id,
                laneId,
                unitName: unitTypeName,
                familyName:
                    UnitFamily[family] ??
                    String(family),
                aggressiveForward: false,
            });
        }
    }

    private ensureBattleWaveRegistered(
        wave: BattleWave
    ) {
        if (this.waves.indexOf(wave) >= 0) {
            return;
        }

        this.waves.push(wave);
    }

    private removeBattleWaveReference(
        wave: BattleWave
    ) {
        const index =
            this.waves.indexOf(wave);

        if (index < 0) {
            return;
        }

        this.waves.splice(index, 1);
    }

    private getHeroLaneId() {
        return this.clampLaneId(
            Math.floor(this.getSafeLaneCount() / 2)
        );
    }

    private getHeroSupportLaneSelection(team: number) {
        const fallbackLaneId = this.getHeroLaneId();
        const laneCount = this.getSafeLaneCount();
        const unitsPerLane = new Array<number>(laneCount).fill(0);
        if (team !== 0 && team !== 1) {
            return { laneId: fallbackLaneId, unitsPerLane };
        }

        const units = this.getAliveUnits(team);

        for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (!this.isAliveUnit(unit) || unit.isHero) continue;

            const wave = BattleWave.getWaveForUnit(unit);
            const laneId = wave
                ? this.clampLaneId(wave.laneId)
                : this.getNearestLaneIdForX(unit.node.worldPosition.x);

            if (laneId >= 0 && laneId < laneCount) {
                unitsPerLane[laneId]++;
            }
        }

        let selectedLaneId = fallbackLaneId;
        let mostUnits = unitsPerLane[fallbackLaneId] || 0;

        for (let laneId = 0; laneId < laneCount; laneId++) {
            if (unitsPerLane[laneId] > mostUnits) {
                selectedLaneId = laneId;
                mostUnits = unitsPerLane[laneId];
            }
        }

        return { laneId: selectedLaneId, unitsPerLane };
    }

    private requestBattleStatsUIRefresh() {
        this.battleStatsUiDirty = true;
    }

    private refreshBattleStatsUI(force: boolean = false) {
        if (!force && !this.battleStatsUiDirty) {
            return;
        }

        this.battleStatsUiDirty = false;

        if (this.teamAAliveLabel) {
            this.setLabelString(
                this.teamAAliveLabel,
                'A Alive: ' +
                this.aliveCount[0]
            );
        }

        if (this.teamADeathLabel) {
            this.setLabelString(
                this.teamADeathLabel,
                'A Death: ' +
                this.deathCount[0]
            );
        }

        if (this.teamBAliveLabel) {
            this.setLabelString(
                this.teamBAliveLabel,
                'B Alive: ' +
                this.aliveCount[1]
            );
        }

        if (this.teamBDeathLabel) {
            this.setLabelString(
                this.teamBDeathLabel,
                'B Death: ' +
                this.deathCount[1]
            );
        }

        if (this.teamAKillLabel) {
            this.setLabelString(
                this.teamAKillLabel,
                'A Kill: ' +
                this.killCount[0]
            );
        }

        if (this.teamBKillLabel) {
            this.setLabelString(
                this.teamBKillLabel,
                'B Kill: ' +
                this.killCount[1]
            );
        }

        if (this.teamACounterKillLabel) {
            this.setLabelString(
                this.teamACounterKillLabel,
                'A Counter Kill: ' +
                this.counterKillCount[0] +
                ' (' +
                Math.round(this.getCounterKillRatio(0) * 100) +
                '%)'
            );
        }

        if (this.teamBCounterKillLabel) {
            this.setLabelString(
                this.teamBCounterKillLabel,
                'B Counter Kill: ' +
                this.counterKillCount[1] +
                ' (' +
                Math.round(this.getCounterKillRatio(1) * 100) +
                '%)'
            );
        }

        if (this.teamACombatPointLabel) {
            this.setLabelString(
                this.teamACombatPointLabel,
                'A CP: ' +
                Math.floor(this.combatPoint[0])
            );
        }

        if (this.teamBCombatPointLabel) {
            this.setLabelString(
                this.teamBCombatPointLabel,
                'B CP: ' +
                Math.floor(this.combatPoint[1])
            );
        }
    }

    private setLabelString(label: Label, value: string) {
        if (label.string !== value) {
            label.string = value;
        }
    }

    private randomRange(
        min: number,
        max: number
    ) {
        return (
            Math.random() * (max - min) + min
        );
    }

    private clamp01(value: number) {
        return Math.max(
            0,
            Math.min(1, value)
        );
    }
}
