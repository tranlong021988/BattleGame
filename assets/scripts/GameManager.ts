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
    BattleTelemetryBreakthroughCashout,
    BattleTelemetryCounterRuleSnapshot,
    BattleTelemetryUnitSnapshot,
    BattleTelemetryWaveUnitSnapshot,
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
    getPlayerMaxAliveWaves?(): number | null;
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
            'Check battle winner rules. A Hero death ends the battle; reaching the enemy Hero line wins only when that team has no living units on the scene.',
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
            'Frames between compact battle snapshots in telemetry. Each snapshot records team, wave, lane, and recovery state; the final snapshot also retains per-unit state.',
    })
    battleTelemetrySnapshotIntervalFrames = 30;

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

    @property(Node)
    redHeroLine: Node | null = null;

    @property(Node)
    blueHeroLine: Node | null = null;

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
            // A normal wave owns the lane of its last defeated target; an
            // aggressive wave restores its origin lane. Never replace that
            // strategic choice with the scanner's temporary combat position.
            const previousLaneId = wave.laneId;
            wave.applyDefeatedTargetLaneForRegroup();
            this.handleWaveStrategicLaneChanged(
                wave,
                previousLaneId
            );
        };
    private forwardScannerSearchFrame: WeakMap<BattleWave, number> =
        new WeakMap();
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
    private waveBannerAggressiveTintCache: WeakMap<Node, boolean> =
        new WeakMap();
    private waveBannerHealthBarCache: WeakMap<Node, HealthBar3D[]> =
        new WeakMap();
    private readonly fallbackTeamABannerColor = new Color(0, 70, 255, 255);
    private readonly fallbackTeamBBannerColor = new Color(255, 0, 0, 255);
    private readonly normalWaveBannerTintParams = [1, 1, 1, 1];
    private readonly aggressiveWaveBannerTintParams = [
        1,
        0.6795424696,
        0,
        1,
    ];
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
    private readonly telemetryFrameHitchThresholdMs = 50;
    private telemetryFrameScannerSearchCount = 0;
    private telemetryFrameCombatEscalationCount = 0;
    private readonly telemetryCombatEscalationSignatureByWave: Map<
        number,
        string
    > = new Map();
    private readonly telemetryIdleEpisodes: Map<
        number,
        {
            startFrame: number;
            team: number;
            laneId: number;
            unitName: string;
            familyName: string;
            aggressiveForward: boolean;
            freeHuntForwardOrigin: 'normal' | 'aggressive' | undefined;
            unitLifeIds: Set<number>;
        }
    > = new Map();
    private readonly telemetryTargetClearRecoveryWindows: Map<
        number,
        {
            clearedTargetWaveId: number;
            clearedTargetLaneId: number;
            clearFrame: number;
        }
    > = new Map();
    private readonly breakthroughCashoutWaveIds: Set<number> = new Set();
    private readonly breakthroughLaneSequences: Map<string, number> =
        new Map();
    private readonly lastBreakthroughIdByLane: Map<string, number> =
        new Map();
    private pendingBreakthroughSpawnLinks: {
        cashoutId: number;
        team: number;
        combatPointBeforeReward: number;
        combatPointAfterReward: number;
    }[] = [];
    private battleCardRuntime: BattleCardRuntime | null = null;
    private battleRuntimeActive = false;
    private manualBattleStartEnabled = false;
    private rvoStepAccumulatedDelta = 0;
    private battleRuntimeRoot: Node | null = null;
    private readonly heroSpawnPositions: Map<Node, Vec3> = new Map();

    start() {
        if (!this.manualBattleStartEnabled) {
            this.startBattleRuntime();
        }
    }

    public setManualBattleStartEnabled(enabled: boolean) {
        this.manualBattleStartEnabled = enabled;
    }

    public isWaitingForPlayerStart() {
        return this.manualBattleStartEnabled &&
            !this.battleRuntimeActive;
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
        this.telemetryCombatEscalationSignatureByWave.clear();
        this.telemetryIdleEpisodes.clear();
        this.telemetryTargetClearRecoveryWindows.clear();
        this.breakthroughCashoutWaveIds.clear();
        this.breakthroughLaneSequences.clear();
        this.lastBreakthroughIdByLane.clear();
        this.pendingBreakthroughSpawnLinks.length = 0;

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
        this.telemetryFrameScannerSearchCount = 0;
        this.telemetryFrameCombatEscalationCount = 0;
        this.recordBattleFrameDelta(deltaTime);
        const frameDeltaMs = deltaTime * 1000;
        const captureFrameHitch =
            this.enableBattleTelemetry &&
            this.battleTelemetry.isEnabled() &&
            Number.isFinite(frameDeltaMs) &&
            frameDeltaMs >= this.telemetryFrameHitchThresholdMs;
        const managerUpdateStart =
            (captureFrameHitch ||
                this.shouldSampleBattleManagerUpdate())
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
        this.processWaveTargetClearTelemetry();
        this.processPersistentHeroFreeHunts();
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
                const managerUpdateMs = elapsed - managerUpdateStart;

                this.recordBattleManagerUpdateTime(managerUpdateMs);

                if (captureFrameHitch) {
                    this.recordBattleFrameHitch(
                        frameDeltaMs,
                        managerUpdateMs
                    );
                }
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

    private recordBattleFrameHitch(
        frameDeltaMs: number,
        managerUpdateMs: number
    ) {
        this.battleTelemetry.recordDiagnosticEvent({
            type: 'frame-hitch',
            frame: this.frame,
            time: this.battleElapsedTime,
            frameDeltaMs,
            managerUpdateMs,
            aliveUnitCount: this.getTotalAliveUnitCount(),
            aliveWaveCount: this.waves.length,
            scannerSearchCount: this.telemetryFrameScannerSearchCount,
            combatEscalationCount:
                this.telemetryFrameCombatEscalationCount,
        });
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
        if (!unit || unit.isHero) return false;
        if (!this.hasUnitReachedEnemyHeroLine(unit)) return false;

        const wave = BattleWave.getWaveForUnit(unit);

        // A breakthrough belongs to a command, not to an arbitrary straggler.
        // The front scanner is the sole unit allowed to cash out its wave.
        if (!wave || wave.isDead()) return false;
        if (wave.getScanner() !== unit) return false;
        if (this.breakthroughCashoutWaveIds.has(wave.id)) return true;

        const defendingTeam = unit.team === 0 ? 1 : 0;
        const defendingHero =
            defendingTeam === 0 ? this.teamAHero : this.teamBHero;
        if (
            this.enableBattleWinnerCheck &&
            this.getAliveNonHeroUnitCount(defendingTeam) === 0 &&
            !this.isAliveUnit(defendingHero)
        ) {
            this.recordUnitReachedEnemyHeroLineContext(unit);
            this.resolveBattleWinner(
                unit.team,
                defendingTeam,
                'enemy-hero-line-reached-with-no-defenders'
            );
            return true;
        }

        this.breakthroughCashoutWaveIds.add(wave.id);
        this.cashOutWaveAtEnemyHeroLine(wave, unit);

        return true;
    }

    private cashOutWaveAtEnemyHeroLine(
        wave: BattleWave,
        scanner: Unit
    ) {
        const aliveUnitCount = wave.getAliveCount();

        if (aliveUnitCount <= 0) return;

        const physicalLaneId = this.getCurrentLaneIdForUnit(scanner);
        const laneId = physicalLaneId >= 0 ? physicalLaneId : wave.laneId;
        const laneState = this.getBreakthroughLaneState(scanner.team, laneId);
        const originalCombatPointCost = Math.max(
            0,
            wave.originalCombatPointCost
        );
        const rewardMultiplier =
            aliveUnitCount >= wave.totalCount ? 2 : 1;
        const rewardCombatPoint =
            originalCombatPointCost * rewardMultiplier;
        const combatPointBeforeReward = this.combatPoint[scanner.team] || 0;
        const combatPointAfterReward =
            combatPointBeforeReward + rewardCombatPoint;
        const laneKey = `${scanner.team}:${laneId}`;
        const laneBreakthroughSequence =
            (this.breakthroughLaneSequences.get(laneKey) || 0) + 1;
        const previousBreakthroughIdInLane =
            this.lastBreakthroughIdByLane.get(laneKey);
        const cashout: BattleTelemetryBreakthroughCashout = {
            id: wave.id,
            frame: this.frame,
            time: this.battleElapsedTime,
            team: scanner.team,
            waveId: wave.id,
            laneId,
            scannerUnitName: scanner.unitTypeName,
            scannerSpawnId: this.battleTelemetry.getSpawnId(scanner),
            scannerLifeId: scanner.lifeId,
            originalCombatPointCost,
            aliveUnitCount,
            initialUnitCount: wave.totalCount,
            rewardMultiplier,
            rewardCombatPoint,
            combatPointBeforeReward,
            combatPointAfterReward,
            laneBreakthroughSequence,
            previousBreakthroughIdInLane,
            attackingNonHeroAlive: laneState.attackingNonHeroAlive,
            attackingWaveCount: laneState.attackingWaveCount,
            defendingNonHeroAlive: laneState.defendingNonHeroAlive,
            defendingWaveCount: laneState.defendingWaveCount,
        };

        if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordBreakthroughCashout(cashout);
        }

        this.breakthroughLaneSequences.set(laneKey, laneBreakthroughSequence);
        this.lastBreakthroughIdByLane.set(laneKey, wave.id);
        this.addCombatPoint(scanner.team, rewardCombatPoint);
        if (this.enableBattleTelemetry) {
            this.pendingBreakthroughSpawnLinks.push({
                cashoutId: wave.id,
                team: scanner.team,
                combatPointBeforeReward,
                combatPointAfterReward,
            });
        }

        const members = wave.units.slice();

        for (let i = 0; i < members.length; i++) {
            const member = members[i];

            if (!this.isAliveUnit(member)) continue;
            if (BattleWave.getWaveForUnit(member) !== wave) continue;

            this.despawnUnitForBreakthroughCashout(member);
        }

        wave.invalidateRuntimeState();
        this.markTargetLifecyclePendingForWave(
            wave,
            'target-wave-cashed-out-at-enemy-hero-line',
            laneId
        );
        this.requestSpatialGridRebuild();
        this.requestBattleStatsUIRefresh();
    }

    private getBreakthroughLaneState(
        attackingTeam: number,
        laneId: number
    ) {
        let attackingNonHeroAlive = 0;
        let defendingNonHeroAlive = 0;
        const attackingWaveIds = new Set<number>();
        const defendingWaveIds = new Set<number>();
        const collect = (units: Unit[]) => {
            for (let i = 0; i < units.length; i++) {
                const laneUnit = units[i];

                if (!this.isAliveUnit(laneUnit)) continue;
                if (laneUnit.isHero) continue;
                if (
                    laneId >= 0 &&
                    this.getCurrentLaneIdForUnit(laneUnit) !== laneId
                ) {
                    continue;
                }

                const laneWave = BattleWave.getWaveForUnit(laneUnit);

                if (laneUnit.team === attackingTeam) {
                    attackingNonHeroAlive++;
                    if (laneWave) attackingWaveIds.add(laneWave.id);
                } else {
                    defendingNonHeroAlive++;
                    if (laneWave) defendingWaveIds.add(laneWave.id);
                }
            }
        };

        collect(this.teamA);
        collect(this.teamB);

        return {
            attackingNonHeroAlive,
            attackingWaveCount: attackingWaveIds.size,
            defendingNonHeroAlive,
            defendingWaveCount: defendingWaveIds.size,
        };
    }

    private recordUnitReachedEnemyHeroLineContext(unit: Unit) {
        if (!this.enableBattleTelemetry) return;
        if (!this.battleTelemetry.isEnabled()) return;

        const wave = BattleWave.getWaveForUnit(unit);
        const target = unit.getValidEnemyTarget();
        const targetWave = BattleWave.getWaveForUnit(target);
        const physicalLaneId = this.getCurrentLaneIdForUnit(unit);
        const defendingTeam = unit.team === 0 ? 1 : 0;
        const unitPosition = unit.agent
            ? unit.agent.pos
            : unit.node.worldPosition;
        const heroLineZ = this.heroLineZ[defendingTeam];
        const forwardZ = unit.forwardDir.z;
        let laneOwnNonHeroAlive = 0;
        let laneEnemyNonHeroAlive = 0;
        const laneOwnWaveIds = new Set<number>();
        const laneEnemyWaveIds = new Set<number>();

        const countLaneUnits = (units: Unit[]) => {
            for (let i = 0; i < units.length; i++) {
                const laneUnit = units[i];

                if (!this.isAliveUnit(laneUnit)) continue;
                if (laneUnit.isHero) continue;
                if (
                    physicalLaneId < 0 ||
                    this.getCurrentLaneIdForUnit(laneUnit) !==
                        physicalLaneId
                ) {
                    continue;
                }

                const laneWave = BattleWave.getWaveForUnit(laneUnit);

                if (laneUnit.team === unit.team) {
                    laneOwnNonHeroAlive++;

                    if (laneWave) laneOwnWaveIds.add(laneWave.id);
                } else {
                    laneEnemyNonHeroAlive++;

                    if (laneWave) laneEnemyWaveIds.add(laneWave.id);
                }
            }
        };

        countLaneUnits(this.teamA);
        countLaneUnits(this.teamB);

        this.battleTelemetry.recordLineReachedContext({
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: wave?.id ?? -1,
            waveLaneId: wave?.laneId ?? -1,
            unitName: unit.unitTypeName,
            unitLifeId: unit.lifeId,
            unitSpawnId: this.battleTelemetry.getSpawnId(unit),
            unitX: unitPosition.x,
            unitZ: unitPosition.z,
            heroLineZ,
            distancePastHeroLine: Number.isFinite(heroLineZ)
                ? (unitPosition.z - heroLineZ) * forwardZ
                : 0,
            unitPhysicalLaneId: physicalLaneId,
            unitBusy: unit.onBusy,
            unitForward: unit.onForward,
            unitBackToLane: unit.isBackToLaneActive(),
            isolatedRangedPursuit: unit.isIsolatedRangedPursuit(),
            isolatedRangedPursuitReturningToWave:
                unit.isReturningToWaveAfterIsolatedRangedPursuit(),
            aggressiveForward:
                wave?.hasAggressiveForwardLaneLock() ?? false,
            waveForward: wave?.isForwardMode() ?? false,
            awaitingForwardRecovery:
                wave?.isAwaitingForwardRecoveryAfterTargetClear() ?? false,
            freeHuntForwardOrigin:
                wave?.getFreeHuntForwardOrigin() ?? '',
            targetWaveIds: wave?.getTargetWaveIds() ?? [],
            targetWaveCount: wave?.getTargetWaveCount() ?? 0,
            targetWaveId: targetWave?.id ?? -1,
            targetLaneId: targetWave?.laneId ?? -1,
            targetUnitName: target?.unitTypeName ?? '',
            laneOwnNonHeroAlive,
            laneEnemyNonHeroAlive,
            laneOwnWaveCount: laneOwnWaveIds.size,
            laneEnemyWaveCount: laneEnemyWaveIds.size,
        });
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

        // An isolated ranged retaliation is a one-unit local fight. Neither
        // side may use it to alter a parent wave's strategic target set.
        if (
            unit?.isIsolatedRangedPursuit() ||
            enemy?.isIsolatedRangedPursuit()
        ) {
            return;
        }

        // Strategic melee combat begins when contact range is reached, rather
        // than waiting for either unit to land damage. If either parent wave
        // is recovering, both sides are evaluated together so update order
        // cannot make the engagement one-sided.
        this.tryReengageWavesFromRecoveryMeleeContact(
            unit,
            enemy
        );

        const aggressiveFrontlineEngagement =
            this.isAggressiveFrontlineEngagement(
                wave,
                unit,
                enemy
            );
        const soloAggressiveCombat =
            this.shouldUseSoloAggressiveCombat(
                wave,
                unit,
                enemy,
                aggressiveFrontlineEngagement
            );
        const waveForwardBefore = wave.isForwardMode();
        const aggressiveForwardBefore =
            wave.isAggressiveForwardMode();
        const sameLaneWaveEngagement =
            this.isSameLaneWaveEngagement(wave, enemy);
        const crossLaneRangedAttack =
            this.isCrossLaneRangedAttack(unit, enemy);
        const strategicEscalationBlocked =
            crossLaneRangedAttack &&
            !wave.hasEngagedTargetWave(
                BattleWave.getWaveForUnit(enemy)
            );
        const canEscalateWaveCombat =
            !strategicEscalationBlocked &&
            !soloAggressiveCombat &&
            (!wave.hasAggressiveForwardLaneLock() ||
                (sameLaneWaveEngagement &&
                    aggressiveFrontlineEngagement)) &&
            this.canEscalateWaveCombatFromEngagement(
                wave,
                enemy
            );
        const strategicEngagedCount = canEscalateWaveCombat
            ? this.getForwardStrategicEngagedCount(
                wave,
                unit!,
                enemy!,
                aggressiveForwardBefore
            )
            : 0;
        const strategicEngagementThreshold = Math.ceil(
            wave.getCommandAliveCount() / 2
        );
        const initialForwardCombatDelayed =
            canEscalateWaveCombat &&
            this.shouldDelayInitialForwardCombat(
                wave,
                unit,
                enemy,
                useInitialForwardGate
            );
        const waveCombatEscalated =
            canEscalateWaveCombat &&
            !initialForwardCombatDelayed &&
            waveForwardBefore;

        if (
            canEscalateWaveCombat &&
            (!waveForwardBefore || !initialForwardCombatDelayed)
        ) {
            this.trySetWaveTargetFromEngagement(
                wave,
                unit,
                enemy
            );

            if (waveForwardBefore) {
                this.addEligibleEngagedTargetWaves(
                    wave,
                    aggressiveForwardBefore
                );
            }
        }

        if (
            canEscalateWaveCombat &&
            !initialForwardCombatDelayed
        ) {
            wave.enterCombatMode();
        }

        this.recordWaveCombatEscalationDecision(
            wave,
            unit,
            enemy,
            aggressiveForwardBefore,
            waveForwardBefore,
            sameLaneWaveEngagement,
            soloAggressiveCombat,
            aggressiveFrontlineEngagement,
            canEscalateWaveCombat,
            initialForwardCombatDelayed,
            waveCombatEscalated,
            crossLaneRangedAttack,
            strategicEscalationBlocked,
            'attacker',
            strategicEngagedCount,
            strategicEngagementThreshold
        );

        const enemyWave =
            BattleWave.getWaveForUnit(enemy);

        if (
            !enemyWave ||
            enemyWave === wave ||
            enemyWave.isDead()
        ) {
            return;
        }

        const enemyAggressiveFrontlineEngagement =
            this.isAggressiveFrontlineEngagement(
                enemyWave,
                enemy,
                unit
            );
        const enemySoloAggressiveCombat =
            this.shouldUseSoloAggressiveCombat(
                enemyWave,
                enemy,
                unit,
                enemyAggressiveFrontlineEngagement
            );
        const enemyWaveForwardBefore =
            enemyWave.isForwardMode();
        const enemyAggressiveForwardBefore =
            enemyWave.isAggressiveForwardMode();
        const enemySameLaneWaveEngagement =
            this.isSameLaneWaveEngagement(enemyWave, unit);
        const enemyStrategicEscalationBlocked =
            (crossLaneRangedAttack &&
                !enemyWave.hasEngagedTargetWave(wave)) ||
            this.isRemoteRangedAttackAgainstMelee(unit, enemy);
        const enemyCanEscalateWaveCombat =
            !enemyStrategicEscalationBlocked &&
            !enemySoloAggressiveCombat &&
            (!enemyWave.hasAggressiveForwardLaneLock() ||
                (enemySameLaneWaveEngagement &&
                    enemyAggressiveFrontlineEngagement)) &&
            this.canEscalateWaveCombatFromEngagement(
                enemyWave,
                unit
            );
        const enemyStrategicEngagedCount = enemyCanEscalateWaveCombat
            ? this.getForwardStrategicEngagedCount(
                enemyWave,
                enemy!,
                unit!,
                enemyAggressiveForwardBefore
            )
            : 0;
        const enemyStrategicEngagementThreshold = Math.ceil(
            enemyWave.getCommandAliveCount() / 2
        );
        const enemyInitialForwardCombatDelayed =
            enemyCanEscalateWaveCombat &&
            this.shouldDelayInitialForwardCombat(
                enemyWave,
                enemy,
                unit,
                useInitialForwardGate
            );
        const enemyWaveCombatEscalated =
            enemyCanEscalateWaveCombat &&
            !enemyInitialForwardCombatDelayed &&
            enemyWaveForwardBefore;

        if (
            enemyCanEscalateWaveCombat &&
            (!enemyWaveForwardBefore ||
                !enemyInitialForwardCombatDelayed)
        ) {
            this.trySetWaveTargetFromEngagement(
                enemyWave,
                enemy,
                unit
            );

            if (enemyWaveForwardBefore) {
                this.addEligibleEngagedTargetWaves(
                    enemyWave,
                    enemyAggressiveForwardBefore
                );
            }
        }

        if (
            enemyCanEscalateWaveCombat &&
            !enemyInitialForwardCombatDelayed
        ) {
            enemyWave.enterCombatMode();
        }

        this.recordWaveCombatEscalationDecision(
            enemyWave,
            enemy,
            unit,
            enemyAggressiveForwardBefore,
            enemyWaveForwardBefore,
            enemySameLaneWaveEngagement,
            enemySoloAggressiveCombat,
            enemyAggressiveFrontlineEngagement,
            enemyCanEscalateWaveCombat,
            enemyInitialForwardCombatDelayed,
            enemyWaveCombatEscalated,
            crossLaneRangedAttack,
            enemyStrategicEscalationBlocked,
            'defender',
            enemyStrategicEngagedCount,
            enemyStrategicEngagementThreshold
        );
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

    public shouldStartIsolatedRangedPursuit(
        unit: Unit | null,
        attacker: Unit | null
    ) {
        if (!unit || !attacker) return false;
        if (unit.isHero) return false;
        if (unit.isIsolatedRangedPursuit()) return false;
        if (!attacker.isRangedCombatUnit()) return false;

        const wave = BattleWave.getWaveForUnit(unit);
        const attackerWave = BattleWave.getWaveForUnit(attacker);

        if (!wave || !attackerWave) return false;
        if (wave === attackerWave) return false;
        if (wave.team === attackerWave.team) return false;
        if (wave.isDead() || attackerWave.isDead()) return false;

        return !wave.hasEngagedTargetWave(attackerWave);
    }

    public finishIsolatedRangedPursuit(
        unit: Unit | null,
        previousTarget: Unit | null = null
    ) {
        if (!unit) return false;

        const wave = BattleWave.getWaveForUnit(unit);
        if (!wave || wave.isDead()) return false;

        const wasReturningToWave =
            unit.isReturningToWaveAfterIsolatedRangedPursuit();

        // clearInvalidEnemy() runs every frame while a detached unit has no
        // target. Once the return phase is already active, that polling must
        // not restart its movement command. A completed local combat still
        // supplies previousTarget and needs one fresh return command.
        if (wasReturningToWave && !previousTarget) {
            if (!unit.hasReachedCurrentWaveLaneAfterIsolatedRangedPursuit()) {
                return true;
            }

            this.completeIsolatedRangedPursuitReturnToWaveLane(
                unit,
                wave.laneId
            );
            return true;
        }

        unit.recordIsolatedRangedPursuitReturnCommand(
            previousTarget
                ? 'combat-target-ended'
                : wasReturningToWave
                    ? 'no-target-while-returning'
                    : 'no-target-before-return',
            wasReturningToWave
        );
        const returningToWaveLane =
            unit.beginIsolatedRangedPursuitReturnToWaveLane(
                wave.hasAggressiveForwardLaneLock()
            );

        if (!wasReturningToWave) {
            this.recordIsolatedRangedPursuit(
                'isolated-ranged-pursuit-combat-ended-returning-to-wave-lane',
                unit,
                previousTarget
            );
        }

        if (returningToWaveLane) {
            return true;
        }

        if (!unit.hasReachedCurrentWaveLaneAfterIsolatedRangedPursuit()) {
            return true;
        }

        // The local combat can end after the unit has already returned to the
        // parent lane. Complete the rejoin immediately in that case; it is
        // still not a command member until this call clears the isolation.
        this.completeIsolatedRangedPursuitReturnToWaveLane(
            unit,
            wave.laneId
        );
        return true;
    }

    public completeIsolatedRangedPursuitReturnToWaveLane(
        unit: Unit | null,
        arrivedLaneId: number
    ) {
        if (!unit) return false;

        const wave = BattleWave.getWaveForUnit(unit);

        if (!wave || wave.isDead()) {
            unit.completeIsolatedRangedPursuitReturnToWaveLane(
                arrivedLaneId
            );
            return false;
        }

        const currentWaveLaneId = wave.laneId;
        unit.completeIsolatedRangedPursuitReturnToWaveLane(
            currentWaveLaneId >= 0
                ? currentWaveLaneId
                : arrivedLaneId
        );
        this.notifyWaveCommandMembershipChanged(unit);
        this.recordIsolatedRangedPursuit(
            'isolated-ranged-pursuit-ended',
            unit,
            null
        );

        if (wave.isAwaitingForwardRecoveryAfterTargetClear()) {
            this.tryResumeWaveForwardFromRegroupCompletion(unit);
            return true;
        }

        if (wave.isForwardMode()) {
            unit.enterWaveForwardMode(
                wave.isAggressiveForwardMode()
            );
            return true;
        }

        if (wave.isFreeHuntMode()) {
            unit.enterWaveFreeHuntMode();
            unit.primeWaveHuntTarget(
                wave.findSharedTargetForUnit(unit)
            );
        }

        return true;
    }

    public getAssignedWaveLaneForUnit(unit: Unit | null) {
        const wave = BattleWave.getWaveForUnit(unit);

        return wave && !wave.isDead()
            ? wave.laneId
            : -1;
    }

    public recordIsolatedRangedPursuit(
        type: string,
        unit: Unit | null,
        target: Unit | null
    ) {
        if (!this.enableBattleTelemetry || !unit) return;

        const wave = BattleWave.getWaveForUnit(unit);
        const targetWave = BattleWave.getWaveForUnit(target);
        const physicalLaneId = this.getCurrentLaneIdForUnit(unit);
        const waveLaneDistance = wave && wave.laneId >= 0 &&
            physicalLaneId >= 0
            ? Math.abs(
                this.clampLaneId(wave.laneId) -
                this.clampLaneId(physicalLaneId)
            )
            : -1;

        this.battleTelemetry.recordDiagnosticEvent({
            type,
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: wave?.id ?? -1,
            laneId: unit.laneId,
            unitPhysicalLaneId: physicalLaneId,
            waveLaneDistance,
            unitName: unit.unitTypeName,
            unitLifeId: unit.lifeId,
            unitSpawnId: this.battleTelemetry.getSpawnId(unit),
            targetTeam: target?.team ?? -1,
            targetWaveId: targetWave?.id ?? -1,
            targetLaneId: targetWave?.laneId ?? -1,
            targetLifeId: target?.lifeId ?? -1,
            targetSpawnId: this.battleTelemetry.getSpawnId(target),
            isolatedRangedPursuit:
                unit.isIsolatedRangedPursuit(),
            isolatedRangedPursuitReturningToWave:
                unit.isReturningToWaveAfterIsolatedRangedPursuit(),
            movementIntent: unit.getTelemetryMovementIntent(),
            isolatedRangedPursuitReturnCommandAttemptCount:
                unit.getIsolatedRangedPursuitReturnCommandAttemptCount(),
            isolatedRangedPursuitReturnRepeatedCommandCount:
                unit.getIsolatedRangedPursuitReturnRepeatedCommandCount(),
            isolatedRangedPursuitReturnLocalCombatCount:
                unit.getIsolatedRangedPursuitReturnLocalCombatCount(),
            isolatedRangedPursuitLastReturnCommandCause:
                unit.getIsolatedRangedPursuitLastReturnCommandCause(),
            targetWaveCount: wave?.getTargetWaveCount() ?? 0,
            targetWaveIds: wave?.getTargetWaveIds() ?? [],
        });
    }

    public recordWaveRegroupTransition(
        type: string,
        unit: Unit | null,
        attacker: Unit | null = null
    ) {
        if (!this.enableBattleTelemetry || !unit) return;

        const wave = BattleWave.getWaveForUnit(unit);
        if (!wave) return;

        const attackerWave = BattleWave.getWaveForUnit(attacker);
        const unitPosition = unit.agent
            ? unit.agent.pos
            : unit.node.worldPosition;
        const attackerPosition = attacker?.agent
            ? attacker.agent.pos
            : attacker?.node.worldPosition;

        this.battleTelemetry.recordDiagnosticEvent({
            type,
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: wave.id,
            laneId: wave.laneId,
            regroupLaneId: unit.laneId,
            unitName: unit.unitTypeName,
            unitLifeId: unit.lifeId,
            unitSpawnId: this.battleTelemetry.getSpawnId(unit),
            unitX: unitPosition.x,
            unitZ: unitPosition.z,
            unitBusy: unit.onBusy,
            unitForward: unit.onForward,
            unitBackToLane: unit.isBackToLaneActive(),
            forwardRecoveryReadyUnitCount:
                wave.getForwardRecoveryReadyUnitCount(),
            forwardRecoveryRegroupingUnitCount:
                wave.getForwardRecoveryRegroupingUnitCount(),
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            targetWaveId: attackerWave?.id ?? -1,
            targetTeam: attacker?.team ?? -1,
            targetLaneId: attackerWave?.laneId ?? -1,
            targetLifeId: attacker?.lifeId ?? -1,
            targetSpawnId: this.battleTelemetry.getSpawnId(attacker),
            targetX: attackerPosition?.x ?? -1,
            targetZ: attackerPosition?.z ?? -1,
        });
    }

    public tryReengageWavesFromRecoveryMeleeContact(
        meleeUnit: Unit | null,
        enemy: Unit | null
    ) {
        if (!meleeUnit || !enemy) return false;
        if (meleeUnit.team === enemy.team) return false;
        if (
            meleeUnit.isIsolatedRangedPursuit() ||
            enemy.isIsolatedRangedPursuit()
        ) {
            return false;
        }
        if (meleeUnit.isRangedCombatUnit()) return false;
        if (!meleeUnit.isEnemyWithinAttackRange(enemy)) return false;

        const meleeWave = BattleWave.getWaveForUnit(meleeUnit);
        const enemyWave = BattleWave.getWaveForUnit(enemy);

        if (!meleeWave || !enemyWave || meleeWave === enemyWave) {
            return false;
        }
        if (meleeWave.isDead() || enemyWave.isDead()) return false;

        // Aggressive waves retain their same-lane priority while recovering.
        // A neighbouring-lane contact remains a local detachment combat and
        // must not cancel recovery for the parent wave.
        const meleeWaveCanReengage =
            !meleeWave.hasAggressiveForwardLaneLock() ||
            (this.isSameLaneWaveEngagement(meleeWave, enemy) &&
                this.isAggressiveFrontlineEngagement(
                    meleeWave,
                    meleeUnit,
                    enemy
                ));
        const enemyWaveCanReengage =
            !enemyWave.hasAggressiveForwardLaneLock() ||
            (this.isSameLaneWaveEngagement(enemyWave, meleeUnit) &&
                this.isAggressiveFrontlineEngagement(
                    enemyWave,
                    enemy,
                    meleeUnit
                ));
        const meleeWaveReengaged =
            meleeWaveCanReengage &&
            meleeWave.tryReengageFromRecoveryMeleeContact(
                meleeUnit,
                enemy
            );
        const enemyWaveReengaged =
            enemyWaveCanReengage &&
            enemyWave.tryReengageFromRecoveryMeleeContact(
                enemy,
                meleeUnit
            );

        if (meleeWaveReengaged) {
            this.recordRegroupMeleeContactReengagement(
                meleeWave,
                meleeUnit,
                enemy,
                'attacker'
            );
        }
        if (enemyWaveReengaged) {
            this.recordRegroupMeleeContactReengagement(
                enemyWave,
                enemy,
                meleeUnit,
                'defender'
            );
        }

        return meleeWaveReengaged || enemyWaveReengaged;
    }

    private recordRegroupMeleeContactReengagement(
        wave: BattleWave,
        unit: Unit,
        enemy: Unit,
        engagementRole: 'attacker' | 'defender'
    ) {
        if (!this.enableBattleTelemetry) return;

        const enemyWave = BattleWave.getWaveForUnit(enemy);

        this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-regroup-melee-contact-reengaged',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: wave.id,
            laneId: wave.laneId,
            regroupLaneId: unit.laneId,
            unitName: unit.unitTypeName,
            unitLifeId: unit.lifeId,
            unitSpawnId: this.battleTelemetry.getSpawnId(unit),
            targetWaveId: enemyWave?.id ?? -1,
            targetTeam: enemy.team,
            targetLaneId: enemyWave?.laneId ?? -1,
            targetLifeId: enemy.lifeId,
            targetSpawnId: this.battleTelemetry.getSpawnId(enemy),
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            engagementRole,
            regroupMeleeReengaged: true,
            regroupInterruptReason: 'melee-contact-target-wave-added',
            targetWaveIds: wave.getTargetWaveIds(),
            targetWaveCount: wave.getTargetWaveCount(),
            regroupCancelledUnitLifeIds:
                wave.getLastRegroupMeleeCancelledUnitLifeIds(),
        });
    }

    private trySetWaveTargetFromScanner(
        wave: BattleWave,
        scanner: Unit | null,
        target: Unit | null,
        source: string,
        allowRecoveryContinuation: boolean = false
    ) {
        if (!wave || !scanner || !target) return false;

        const previousTargetWaveIds = wave.getTargetWaveIds();
        const previousTargetWaveId =
            previousTargetWaveIds[0] ?? -1;
        const candidateWave = BattleWave.getWaveForUnit(target);
        const wasAlreadyAssigned =
            wave.hasEngagedTargetWave(candidateWave);
        const assigned = wave.trySetTargetWaveFromScanner(
            scanner,
            target,
            allowRecoveryContinuation
        );

        this.recordWaveTargetAssignment(
            wave,
            scanner,
            target,
            previousTargetWaveId,
            source,
            assigned,
            wasAlreadyAssigned,
            previousTargetWaveIds
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

        const previousTargetWaveIds = wave.getTargetWaveIds();
        const previousTargetWaveId =
            previousTargetWaveIds[0] ?? -1;
        const candidateWave = BattleWave.getWaveForUnit(target);
        const wasAlreadyAssigned =
            wave.hasEngagedTargetWave(candidateWave);
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
            assigned,
            wasAlreadyAssigned,
            previousTargetWaveIds
        );

        return assigned;
    }

    private addEligibleEngagedTargetWaves(
        wave: BattleWave,
        aggressiveForward: boolean
    ) {
        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];

            if (!wave.isCommandUnit(unit)) continue;
            if (!unit.onBusy) continue;

            const target = unit.getValidEnemyTarget();

            if (!target || target.isIsolatedRangedPursuit()) continue;
            // A ranged unit firing into a neighbouring lane is a local fight.
            // It must not be swept into the parent wave's strategic target set.
            if (this.isCrossLaneRangedAttack(unit, target)) continue;
            if (!this.canEscalateWaveCombatFromEngagement(wave, target)) {
                continue;
            }

            if (aggressiveForward) {
                if (!this.isSameLaneWaveEngagement(wave, target)) {
                    continue;
                }
                if (!this.isAggressiveFrontlineEngagement(
                    wave,
                    unit,
                    target
                )) {
                    continue;
                }
            }

            this.trySetWaveTargetFromEngagement(
                wave,
                unit,
                target
            );
        }
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

    private isSameLaneWaveEngagement(
        wave: BattleWave,
        target: Unit | null
    ) {
        const targetWave = BattleWave.getWaveForUnit(target);

        if (!targetWave) return false;
        if (wave.laneId < 0 || targetWave.laneId < 0) {
            return false;
        }

        return this.clampLaneId(wave.laneId) ===
            this.clampLaneId(targetWave.laneId);
    }

    private isCrossLaneRangedAttack(
        attacker: Unit | null,
        target: Unit | null
    ) {
        if (!attacker || !target) return false;
        if (!attacker.isRangedCombatUnit()) return false;

        const attackerWave = BattleWave.getWaveForUnit(attacker);
        const targetWave = BattleWave.getWaveForUnit(target);

        if (!attackerWave || !targetWave) return false;
        if (attackerWave === targetWave) return false;
        if (attackerWave.laneId < 0 || targetWave.laneId < 0) {
            return false;
        }

        return this.clampLaneId(attackerWave.laneId) !==
            this.clampLaneId(targetWave.laneId);
    }

    private isRemoteRangedAttackAgainstMelee(
        attacker: Unit | null,
        target: Unit | null
    ) {
        if (!attacker || !target) return false;
        if (!attacker.isRangedCombatUnit()) return false;
        if (target.isRangedCombatUnit()) return false;

        return !target.isEnemyWithinAttackRange(attacker);
    }

    private recordWaveCombatEscalationDecision(
        wave: BattleWave,
        unit: Unit | null,
        target: Unit | null,
        aggressiveForwardBefore: boolean,
        waveForwardBefore: boolean,
        sameLaneWaveEngagement: boolean,
        soloAggressiveCombat: boolean,
        aggressiveFrontlineEngagement: boolean,
        canEscalateWaveCombat: boolean,
        initialForwardCombatDelayed: boolean,
        waveCombatEscalated: boolean,
        crossLaneRangedAttack: boolean = false,
        strategicEscalationBlocked: boolean = false,
        engagementRole: 'attacker' | 'defender' = 'attacker',
        strategicEngagedCount: number = 0,
        strategicEngagementThreshold: number = 0
    ) {
        if (!this.enableBattleTelemetry) return;

        const targetWave = BattleWave.getWaveForUnit(target);
        const signature = [
            targetWave?.id ?? -1,
            aggressiveForwardBefore,
            waveForwardBefore,
            sameLaneWaveEngagement,
            soloAggressiveCombat,
            aggressiveFrontlineEngagement,
            canEscalateWaveCombat,
            initialForwardCombatDelayed,
            waveCombatEscalated,
            crossLaneRangedAttack,
            strategicEscalationBlocked,
            engagementRole,
            strategicEngagedCount,
            strategicEngagementThreshold,
        ].join('|');

        if (
            this.telemetryCombatEscalationSignatureByWave.get(wave.id) ===
            signature
        ) {
            return;
        }

        this.telemetryCombatEscalationSignatureByWave.set(
            wave.id,
            signature
        );
        this.telemetryFrameCombatEscalationCount++;

        this.battleTelemetry.recordCombatEscalationDecision({
            type: 'wave-combat-escalation-decision',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: unit?.unitTypeName ?? wave.unitName,
            unitLifeId: unit?.lifeId ?? -1,
            unitSpawnId: this.battleTelemetry.getSpawnId(unit),
            targetTeam: target?.team ?? -1,
            targetWaveId: targetWave?.id ?? -1,
            targetLaneId: targetWave?.laneId ?? -1,
            targetFamilyName: targetWave
                ? UnitFamily[targetWave.family] ??
                    String(targetWave.family)
                : '',
            targetLifeId: target?.lifeId ?? -1,
            targetSpawnId: this.battleTelemetry.getSpawnId(target),
            aggressiveForward: aggressiveForwardBefore,
            waveForwardBefore,
            sameLaneWaveEngagement,
            soloAggressiveCombat,
            aggressiveFrontlineEngagement,
            canEscalateWaveCombat,
            initialForwardCombatDelayed,
            waveCombatEscalated,
            crossLaneRangedAttack,
            strategicEscalationBlocked,
            strategicEngagementBlockedReason:
                strategicEscalationBlocked
                    ? 'cross-lane-ranged-local-combat'
                    : '',
            engagementRole,
            strategicEngagedCount,
            strategicEngagementThreshold,
        });
    }

    private recordWaveTargetAssignment(
        wave: BattleWave,
        unit: Unit | null,
        target: Unit | null,
        previousTargetWaveId: number,
        source: string,
        assigned: boolean,
        wasAlreadyAssigned: boolean,
        previousTargetWaveIds: number[]
    ) {
        if (
            !this.enableBattleTelemetry ||
            !assigned ||
            wasAlreadyAssigned
        ) return;

        const targetWave = BattleWave.getWaveForUnit(target);
        if (!targetWave) return;

        const assignmentState =
            wave.getTargetAssignmentTelemetryState();

        this.closeWaveIdleEpisode(wave, 'target-assigned');
        this.battleTelemetry.recordTargetWaveTransition({
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
            previousTargetWaveIds,
            targetSource: source,
            targetSetChanged: true,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin:
                wave.getFreeHuntForwardOrigin(),
            targetWaveCount: wave.getTargetWaveCount(),
            targetWaveIds: wave.getTargetWaveIds(),
            ...assignmentState,
        });
    }

    private recordWaveForwardResume(
        wave: BattleWave,
        source = 'target-set-empty'
    ) {
        if (!this.enableBattleTelemetry) return;

        this.closeWaveIdleEpisode(wave, 'forward-resumed');
        this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-forward-resumed',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: UnitFamily[wave.family] ?? String(wave.family),
            targetWaveId: -1,
            targetSource: source,
            regroupLaneId: wave.laneId,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin:
                wave.getFreeHuntForwardOrigin(),
            forwardRecoveryResumedUnitCount:
                wave.getLastForwardRecoveryResumedUnitCount(),
            forwardRecoveryRetainedBusyUnitCount:
                wave.getLastForwardRecoveryRetainedBusyUnitCount(),
            forwardRecoveryRetainedBusyUnitLifeIds:
                wave.getLastForwardRecoveryRetainedBusyUnitLifeIds(),
        });
    }

    private recordWaveForwardRecoveryBlocked(
        wave: BattleWave,
        blocker: {
            reason: string;
            unit: Unit | null;
        }
    ) {
        if (!this.enableBattleTelemetry) return;

        this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-forward-recovery-blocked',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: UnitFamily[wave.family] ?? String(wave.family),
            recoveryBlockReason: blocker.reason,
            blockingUnitLifeId: blocker.unit?.lifeId ?? -1,
            blockingUnitName: blocker.unit?.unitTypeName ?? '',
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
        });
    }

    private recordWaveForwardRecoveryDeferred(
        wave: BattleWave,
        state: {
            freeHuntActive: boolean;
            targetWaveId: number;
            immediateTargetSearchPending: boolean;
            targetClearSameLaneSearchResolved: boolean;
            aliveCount: number;
            resumableUnitCount: number;
            busyUnitCount: number;
            forwardRecoveryReadyUnitCount: number;
            forwardRecoveryRegroupingUnitCount: number;
        }
    ) {
        if (!this.enableBattleTelemetry) return;

        this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-forward-recovery-deferred',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: UnitFamily[wave.family] ?? String(wave.family),
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
            waveForwardBefore: wave.isForwardMode(),
            ...state,
            waveRegistered: this.waves.indexOf(wave) >= 0,
        });
    }

    public recordUnitIdleWithoutOrder(unit: Unit | null) {
        if (!this.enableBattleTelemetry) return;
        if (!unit) return;

        const wave = BattleWave.getWaveForUnit(unit);
        if (!wave) return;

        const targetWave = wave.getTargetWave();
        const targetWaveIds = wave.getTargetWaveIds();
        const existingEpisode = this.telemetryIdleEpisodes.get(
            wave.id
        );

        if (existingEpisode) {
            existingEpisode.unitLifeIds.add(unit.lifeId);
            return;
        }

        const episode = {
            startFrame: this.frame,
            team: unit.team,
            laneId: wave.laneId,
            unitName: unit.unitTypeName,
            familyName:
                UnitFamily[wave.family] ?? String(wave.family),
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            freeHuntForwardOrigin:
                wave.getFreeHuntForwardOrigin(),
            unitLifeIds: new Set([unit.lifeId]),
        };

        this.telemetryIdleEpisodes.set(wave.id, episode);

        this.battleTelemetry.recordDiagnosticEvent({
            type: 'wave-idle-episode-start',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: unit.unitTypeName,
            familyName:
                UnitFamily[wave.family] ?? String(wave.family),
            unitLifeId: unit.lifeId,
            targetWaveId: targetWave?.id ?? -1,
            targetWaveIds,
            targetWaveCount: targetWaveIds.length,
            targetTeam: targetWave?.team ?? -1,
            targetLaneId: targetWave?.laneId ?? -1,
            reason: targetWaveIds.length > 0
                ? 'strategic-target-unresolved'
                : 'no-strategic-target-during-recovery',
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
            unitForward: unit.onForward,
            unitBusy: unit.onBusy,
            unitHasValidTarget: unit.hasValidEnemyTarget(),
            unitFreeHuntContinuityActive:
                unit.isFreeHuntContinuityActive(),
            freeHuntForwardOrigin:
                wave.getFreeHuntForwardOrigin(),
            idleEpisodeStartFrame: episode.startFrame,
            idleEpisodeUnitCount: episode.unitLifeIds.size,
        });
    }

    private closeWaveIdleEpisode(wave: BattleWave, reason: string) {
        const episode = this.telemetryIdleEpisodes.get(wave.id);
        if (!episode) return;

        this.telemetryIdleEpisodes.delete(wave.id);
        this.battleTelemetry.recordDiagnosticEvent({
            type: 'wave-idle-episode-end',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: episode.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: episode.unitName,
            familyName: episode.familyName,
            reason,
            aggressiveForward: episode.aggressiveForward,
            freeHuntForwardOrigin:
                episode.freeHuntForwardOrigin,
            idleEpisodeStartFrame: episode.startFrame,
            idleEpisodeDurationFrames: Math.max(
                0,
                this.frame - episode.startFrame
            ),
            idleEpisodeUnitCount: episode.unitLifeIds.size,
        });
    }

    private closeAllWaveIdleEpisodes(reason: string) {
        for (const wave of this.waves) {
            this.closeWaveIdleEpisode(wave, reason);
        }
    }

    private closeTargetClearRecoveryWindow(
        wave: BattleWave,
        reason: string
    ) {
        const recoveryWindow =
            this.telemetryTargetClearRecoveryWindows.get(wave.id);
        if (!recoveryWindow) return;

        this.telemetryTargetClearRecoveryWindows.delete(wave.id);
        this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-target-clear-recovery-unresolved',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: UnitFamily[wave.family] ?? String(wave.family),
            reason,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
            freeHuntForwardOrigin:
                wave.getFreeHuntForwardOrigin(),
            targetWaveCount: wave.getTargetWaveCount(),
            targetWaveIds: wave.getTargetWaveIds(),
            targetClearOriginWaveId:
                recoveryWindow.clearedTargetWaveId,
            targetClearOriginLaneId:
                recoveryWindow.clearedTargetLaneId,
            targetClearFrame: recoveryWindow.clearFrame,
        });
    }

    private closeAllTargetClearRecoveryWindows(reason: string) {
        for (const wave of this.waves) {
            this.closeTargetClearRecoveryWindow(wave, reason);
        }
    }

    private recordWaveTargetCleared(
        wave: BattleWave,
        target: {
            id: number;
            team: number;
            laneId: number;
            family: UnitFamily;
            remainingTargetWaveCount: number;
            physicallyDead: boolean;
            removalReason?: string;
        }
    ) {
        if (!this.enableBattleTelemetry) return;

        if (target.remainingTargetWaveCount <= 0) {
            this.telemetryTargetClearRecoveryWindows.set(wave.id, {
                clearedTargetWaveId: target.id,
                clearedTargetLaneId: target.laneId,
                clearFrame: this.frame,
            });
        }
        this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-target-cleared',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName: wave.unitName,
            familyName: UnitFamily[wave.family] ?? String(wave.family),
            targetWaveId: target.id,
            targetTeam: target.team,
            targetLaneId: target.laneId,
            targetFamilyName:
                UnitFamily[target.family] ?? String(target.family),
            targetSource: target.removalReason ??
                (target.physicallyDead
                    ? 'target-wave-dead'
                    : 'target-wave-no-command-members'),
            targetWavePhysicallyDead: target.physicallyDead,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
            targetWaveCount: target.remainingTargetWaveCount,
            targetWaveIds: wave.getTargetWaveIds(),
            freeHuntForwardOrigin:
                wave.getFreeHuntForwardOrigin(),
        });
    }

    private recordWaveTargetClearOutcome(
        wave: BattleWave,
        outcome: {
            reason: string;
            scanner: Unit | null;
            target: Unit | null;
        }
    ) {
        if (!this.enableBattleTelemetry) return;

        const targetWave = BattleWave.getWaveForUnit(
            outcome.target
        );
        const recoveryWindow =
            this.telemetryTargetClearRecoveryWindows.get(wave.id);

        this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-target-clear-outcome',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName:
                outcome.scanner?.unitTypeName ?? wave.unitName,
            familyName: UnitFamily[wave.family] ?? String(wave.family),
            unitLifeId: outcome.scanner?.lifeId ?? -1,
            targetWaveId: targetWave?.id ?? -1,
            targetTeam: targetWave?.team ?? -1,
            targetLaneId: targetWave?.laneId ?? -1,
            targetFamilyName: targetWave
                ? UnitFamily[targetWave.family] ??
                    String(targetWave.family)
                : '',
            targetLifeId: outcome.target?.lifeId ?? -1,
            targetSource: outcome.reason,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
            freeHuntForwardOrigin:
                wave.getFreeHuntForwardOrigin(),
        });

        // Persistent Hero Free Hunt does not enter the recovery transaction.
        // Keep its target-clear outcome, but do not emit a misleading
        // recovery-outcome event for the same transition.
        if (
            outcome.reason ===
            'persistent-free-hunt-target-set-empty'
        ) {
            this.telemetryTargetClearRecoveryWindows.delete(wave.id);
            return;
        }

        if (!recoveryWindow) return;

        const targetLaneId = targetWave?.laneId ?? -1;
        const offLaneReplacement =
            targetLaneId >= 0 &&
            recoveryWindow.clearedTargetLaneId >= 0 &&
            targetLaneId !== recoveryWindow.clearedTargetLaneId;

        this.battleTelemetry.recordTargetWaveLifecycleEvent({
            type: 'wave-target-clear-recovery-outcome',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: wave.team,
            waveId: wave.id,
            laneId: wave.laneId,
            unitName:
                outcome.scanner?.unitTypeName ?? wave.unitName,
            familyName: UnitFamily[wave.family] ?? String(wave.family),
            targetWaveId: targetWave?.id ?? -1,
            targetTeam: targetWave?.team ?? -1,
            targetLaneId,
            targetSource: outcome.reason,
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            waveForwardBefore: wave.isForwardMode(),
            targetWaveCount: wave.getTargetWaveCount(),
            targetWaveIds: wave.getTargetWaveIds(),
            freeHuntForwardOrigin:
                wave.getFreeHuntForwardOrigin(),
            targetClearOriginWaveId:
                recoveryWindow.clearedTargetWaveId,
            targetClearOriginLaneId:
                recoveryWindow.clearedTargetLaneId,
            targetClearFrame: recoveryWindow.clearFrame,
            targetClearOffLaneReplacement: offLaneReplacement,
        });
        this.telemetryTargetClearRecoveryWindows.delete(wave.id);
    }

    public recordWaveScannerTrace(
        scanner: Unit | null,
        observedUnit: Unit | null,
        source: string,
        reason: string,
        targetWaveBefore: BattleWave | null,
        observedEnemyCount: number = 0,
        searchSameLaneOnly: boolean = false
    ) {
        if (!this.enableBattleTelemetry) return;
        if (!this.battleTelemetry.isEnabled()) return;
        if (!scanner) return;

        const wave = BattleWave.getWaveForUnit(scanner);
        if (!wave) return;

        this.telemetryFrameScannerSearchCount++;
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
            scannerSpawnId:
                this.battleTelemetry.getSpawnId(scanner),
            scannerLifeId: scanner.lifeId,
            scannerX: scannerPosition.x,
            scannerZ: scannerPosition.z,
            scannerPrefVelocityX: prefVelocity?.x ?? 0,
            scannerPrefVelocityZ: prefVelocity?.z ?? 0,
            scannerBusy: scanner.onBusy,
            scannerForward: scanner.onForward,
            waveForward: wave.isForwardMode(),
            aggressiveForward: wave.hasAggressiveForwardLaneLock(),
            targetWaveIdBefore: targetWaveBefore?.id ?? -1,
            targetLaneIdBefore: targetWaveBefore?.laneId ?? -1,
            targetWaveIdAfter: targetWaveAfter?.id ?? -1,
            targetLaneIdAfter: targetWaveAfter?.laneId ?? -1,
            targetWaveIdsAfter: wave.getTargetWaveIds(),
            targetWaveCountAfter: wave.getTargetWaveCount(),
            candidateWaveId: observedWave?.id ?? -1,
            candidateLaneId: observedWave?.laneId ?? -1,
            candidateUnitName: observed?.unitTypeName ?? '',
            candidateSpawnId:
                this.battleTelemetry.getSpawnId(observed),
            candidateLifeId: observed?.lifeId ?? -1,
            candidateX: observedPosition?.x ?? 0,
            candidateZ: observedPosition?.z ?? 0,
            observedEnemyCount,
            searchSameLaneOnly,
        });
    }

    private shouldUseSoloAggressiveCombat(
        wave: BattleWave,
        unit: Unit | null,
        enemy: Unit | null,
        aggressiveFrontlineEngagement: boolean =
            this.isAggressiveFrontlineEngagement(
                wave,
                unit,
                enemy
            )
    ) {
        if (!wave.hasAggressiveForwardLaneLock()) return false;
        if (!unit || !enemy) return false;

        // A rear contact is a backstab: only the contacted unit may fight.
        // A whole aggressive wave may turn into Free Hunt only when its
        // contact unit is on or ahead of the current scanner along forward.
        if (!aggressiveFrontlineEngagement) {
            return true;
        }

        if (
            !unit.onForward &&
            !unit.isSoloAggressiveSkirmishActive()
        ) {
            return false;
        }
        // Wave lane is the strategic authority. It follows the active
        // scanner and is mirrored to every member, so an individual unit
        // drifting sideways during combat must not redefine this skirmish.
        const unitLane = wave.laneId;
        const enemyWave = BattleWave.getWaveForUnit(enemy);
        const enemyLane = enemyWave
            ? enemyWave.laneId
            : -1;

        if (unitLane < 0 || enemyLane < 0) return false;

        if (unitLane !== enemyLane) {
            return true;
        }

        return this.isEnemyOutsideUnitAttackRange(
            unit,
            enemy
        );
    }

    private isAggressiveFrontlineEngagement(
        wave: BattleWave,
        unit: Unit | null,
        enemy: Unit | null = null
    ) {
        if (!wave.hasAggressiveForwardLaneLock()) return false;
        if (!unit?.agent) return false;

        const scanner = wave.getScanner(true);

        // The contact unit leaves Forward before this callback. When it was
        // the final forward unit, no scanner remains; classify that contact
        // from its target direction instead of making the threshold
        // unreachable for a fully engaged wave.
        if (!scanner?.agent) {
            return !!enemy && !unit.hasPassedForwardTarget(enemy);
        }

        const dx = unit.agent.pos.x - scanner.agent.pos.x;
        const dz = unit.agent.pos.z - scanner.agent.pos.z;
        const forwardProgress =
            dx * scanner.forwardDir.x +
            dz * scanner.forwardDir.z;

        // Progress zero is the scanner's forward line, so a unit abreast of
        // it counts as a frontline contact rather than a rear ambush.
        return forwardProgress >= 0;
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

    public getForwardModeAfterLocalCombat(
        unit: Unit | null
    ): boolean | null {
        if (!unit) return null;

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return null;
        if (wave.isDead()) return null;
        if (!wave.isForwardMode()) return null;

        if (!unit.isSteady &&
            !unit.onBusy &&
            !unit.hasValidEnemyTarget()) {
            return wave.isAggressiveForwardMode();
        }

        return null;
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
        const aliveCount = wave.getCommandAliveCount();
        const threshold = Math.ceil(aliveCount / 2);

        if (threshold <= 1) return false;

        const engagedCount = this.getForwardStrategicEngagedCount(
            wave,
            unit,
            enemy,
            wave.isAggressiveForwardMode()
        );

        return engagedCount < threshold;
    }

    private getForwardStrategicEngagedCount(
        wave: BattleWave,
        pendingUnit: Unit,
        pendingEnemy: Unit,
        aggressiveForward: boolean
    ) {
        return aggressiveForward
            ? this.getAggressiveFrontlineEngagedCount(
                wave,
                pendingUnit,
                pendingEnemy
            )
            : this.getNormalStrategicEngagedCount(
                wave,
                pendingUnit,
                pendingEnemy
            );
    }

    private getNormalStrategicEngagedCount(
        wave: BattleWave,
        pendingUnit: Unit,
        pendingEnemy: Unit
    ) {
        let count = 0;

        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];
            const isPending = unit === pendingUnit;

            if (!wave.isCommandUnit(unit)) continue;
            if (!isPending && !unit.onBusy) continue;

            const enemy = isPending
                ? pendingEnemy
                : unit.getValidEnemyTarget();

            if (!enemy) continue;
            if (enemy.isIsolatedRangedPursuit()) continue;
            if (this.isCrossLaneRangedAttack(unit, enemy)) continue;

            count++;
        }

        return count;
    }

    private getAggressiveFrontlineEngagedCount(
        wave: BattleWave,
        pendingUnit: Unit,
        pendingEnemy: Unit
    ) {
        let count = 0;

        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];
            const isPending = unit === pendingUnit;

            // Pooled Unit objects can already belong to a newer wave while
            // an older wave still retains their historical array reference.
            // Only current command members may contribute to this threshold.
            if (!wave.isCommandUnit(unit)) continue;
            if (!isPending && !unit.onBusy) continue;

            const enemy = isPending
                ? pendingEnemy
                : unit.getValidEnemyTarget();

            if (!enemy) continue;
            if (enemy.isIsolatedRangedPursuit()) continue;
            if (!this.isSameLaneWaveEngagement(wave, enemy)) {
                continue;
            }
            if (!this.isAggressiveFrontlineEngagement(
                wave,
                unit,
                enemy
            )) {
                continue;
            }

            count++;
        }

        return count;
    }

    public onWaveForwardTargetFound(
        unit: Unit | null,
        target: Unit | null,
        source = 'forward-scanner',
        allowRecoveryContinuation: boolean = false
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
            source,
            allowRecoveryContinuation
        )) {
            return false;
        }
        wave.releaseForwardToFreeHunt();
        unit.setWaveSearchTarget(target);

        return true;
    }

    public getWaveTargetForUnit(unit: Unit | null) {
        const wave =
            BattleWave.getWaveForUnit(unit);

        return wave ? wave.getTargetWave() : null;
    }

    public hasWaveHuntScannerConfirmedNoTarget(
        unit: Unit | null
    ) {
        const wave = BattleWave.getWaveForUnit(unit);

        return !wave || (
            !wave.isPersistentFreeHunt() &&
            wave.getTargetWaveCount() <= 0
        );
    }

    public isPersistentWaveFreeHunt(unit: Unit | null) {
        const wave = BattleWave.getWaveForUnit(unit);

        return !!wave?.isPersistentFreeHunt();
    }

    public getWaveHuntScannerForUnit(unit: Unit | null) {
        const wave = BattleWave.getWaveForUnit(unit);

        if (!wave || wave.isForwardMode()) return null;
        return wave.getScanner();
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

    // A unit that has just finished local combat must immediately rejoin an
    // existing Free Hunt target set. This is deliberately event-driven: it
    // only performs the shared-target lookup at the combat-end transition,
    // never from a per-frame recovery path.
    public tryPrimeSharedWaveHuntTargetAfterCombatEnd(
        unit: Unit | null
    ): boolean {
        if (!unit || unit.onBusy || unit.onForward || unit.isSteady ||
            unit.isBackToLaneActive()) {
            return false;
        }

        const wave = BattleWave.getWaveForUnit(unit);

        if (!wave || wave.isDead() || !wave.isCommandUnit(unit) ||
            !wave.isFreeHuntMode()) {
            return false;
        }

        const target = wave.findSharedTargetForUnit(unit);

        return !!target && unit.primeWaveHuntTarget(target);
    }

    private processDynamicWaveLanes() {
        // Command-wave lanes are assigned at spawn and after target-set
        // recovery. Only hero waves continue to follow their physical lane.
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

    private processPersistentHeroFreeHunts() {
        this.processPersistentHeroFreeHunt(
            this.teamAHeroWave
        );
        this.processPersistentHeroFreeHunt(
            this.teamBHeroWave
        );
    }

    private processPersistentHeroFreeHunt(
        wave: BattleWave | null
    ) {
        if (!wave || !wave.hasPersistentFreeHuntOrder()) return;
        if (wave.isDeadRuntime(this.frame)) return;
        if (!this.shouldRunFrameInterval(
            wave.getTargetSearchIntervalFrames(),
            wave.id
        )) {
            return;
        }

        const scanner = wave.getScanner(true);

        if (!scanner?.agent) return;

        const enemyHero = wave.team === 0
            ? this.teamBHero
            : this.teamAHero;
        const liveEnemyHero = this.isAliveUnit(enemyHero)
            ? enemyHero
            : null;

        // An opposing Hero is the strategic destination. A wave already in
        // contact remains in the target set, so close combat still interrupts
        // this route naturally until that combat is resolved.
        if (liveEnemyHero) {
            const enemyHeroWave =
                BattleWave.getWaveForUnit(liveEnemyHero);

            if (
                enemyHeroWave &&
                wave.hasEngagedTargetWave(enemyHeroWave)
            ) {
                wave.prioritizeTargetWave(enemyHeroWave);
                return;
            }

            this.onWaveForwardTargetFound(
                scanner,
                liveEnemyHero,
                'hero-global-enemy-hero'
            );
            return;
        }

        // Without an opposing Hero, choose the nearest live enemy wave from
        // the whole battlefield. This is intentionally wave-level work and
        // runs on the Hero scanner interval, not once per rendered frame.
        if (wave.getTargetWaveCount() > 0) return;

        const target = this.findGlobalHeroFreeHuntTarget(
            wave,
            scanner
        );

        if (!target) return;

        this.onWaveForwardTargetFound(
            scanner,
            target,
            'hero-global-wave-hunt'
        );
    }

    private findGlobalHeroFreeHuntTarget(
        heroWave: BattleWave,
        scanner: Unit
    ) {
        if (!scanner.agent) return null;

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < this.waves.length; i++) {
            const enemyWave = this.waves[i];

            if (!enemyWave || enemyWave === heroWave) continue;
            if (enemyWave.team === heroWave.team) continue;
            if (enemyWave.isDeadRuntime(this.frame)) continue;

            const candidate = enemyWave.getProgressScanner();

            if (!candidate?.agent) continue;
            if (!this.isAliveUnit(candidate)) continue;

            const dx = candidate.agent.pos.x - scanner.agent.pos.x;
            const dz = candidate.agent.pos.z - scanner.agent.pos.z;
            const distSq = dx * dx + dz * dz;

            if (distSq >= bestDistSq) continue;

            bestDistSq = distSq;
            best = candidate;
        }

        return best;
    }

    private searchForwardWaveTarget(
        wave: BattleWave | null,
        forceScannerPassCheck: boolean = false
    ) {
        if (!wave) return;
        if (!wave.isForwardMode()) return;
        if (wave.isDeadRuntime(this.frame)) return;
        if (this.forwardScannerSearchFrame.get(wave) === this.frame) {
            return;
        }

        this.forwardScannerSearchFrame.set(wave, this.frame);

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
                !forceScannerPassCheck &&
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
            const target = this.findPassedEnemyWaveScanner(
                wave,
                scanner,
                true
            );

            const released = target
                ? this.onWaveForwardTargetFound(scanner, target)
                : false;

            if (released) {
                this.recordAggressiveForwardEvent(
                    'aggressive-scanner-pass-release',
                    wave,
                    scanner,
                    target,
                    0,
                    'same-lane-scanner-passed-target'
                );
            }

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
                target ?? adjacentRearGuard,
                forceScannerPassCheck
                    ? 'forward-aggressive-recovery-resume'
                    : 'forward-aggressive',
                target
                    ? 'target-passed-release'
                    : enemiesAhead > 0
                    ? 'own-lane-blocked'
                    : adjacentRearGuard
                        ? 'lane-clear-adjacent-flank'
                        : 'lane-clear',
                targetWaveBefore,
                (target ? 1 : 0) +
                    enemiesAhead +
                    (adjacentRearGuard ? 1 : 0),
                true
            );

            if (target) return;

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
            !forceScannerPassCheck &&
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

        const target = this.findPassedEnemyWaveScanner(
            wave,
            scanner,
            false
        );

        const releasesTarget = !!target;

        if (target && releasesTarget) {
            this.onWaveForwardTargetFound(
                scanner,
                target
            );
        }

        this.recordWaveScannerTrace(
            scanner,
            target,
            forceScannerPassCheck
                ? 'forward-normal-recovery-resume'
                : 'forward-normal',
            target
                ? releasesTarget
                    ? 'target-passed-release'
                    : 'target-not-passed'
                : 'no-forward-target',
            targetWaveBefore,
            target ? 1 : 0
        );
    }

    public tryResumeWaveForwardFromRegroupCompletion(
        unit: Unit | null
    ) {
        const wave = BattleWave.getWaveForUnit(unit);

        if (!wave || wave.isDeadRuntime(this.frame)) return false;
        if (!wave.isAwaitingForwardRecoveryAfterTargetClear()) {
            return false;
        }

        return this.tryFinishWaveForwardRecovery(wave) !== 'blocked';
    }

    public tryResumeWaveForwardFromLocalCombatEnd(
        unit: Unit | null
    ) {
        const wave = BattleWave.getWaveForUnit(unit);

        if (!unit || !wave || wave.isDeadRuntime(this.frame)) return false;
        if (!wave.isAwaitingForwardRecoveryAfterTargetClear()) {
            return false;
        }

        const recoveryResult = this.tryFinishWaveForwardRecovery(
            wave,
            'local-combat-ended'
        );

        if (this.enableBattleTelemetry) {
            this.battleTelemetry.recordDiagnosticEvent({
                type: 'wave-recovery-local-combat-ended',
                frame: this.frame,
                time: this.battleElapsedTime,
                team: unit.team,
                waveId: wave.id,
                laneId: wave.laneId,
                regroupLaneId: unit.laneId,
                unitName: unit.unitTypeName,
                unitLifeId: unit.lifeId,
                unitSpawnId: this.battleTelemetry.getSpawnId(unit),
                unitBusy: unit.onBusy,
                unitBackToLane: unit.isBackToLaneActive(),
                aggressiveForward: wave.hasAggressiveForwardLaneLock(),
                freeHuntForwardOrigin: wave.getFreeHuntForwardOrigin(),
                recoveryBlockReason: recoveryResult === 'forward'
                    ? 'local-combat-ended-forward-resumed'
                    : recoveryResult === 'free-hunt'
                        ? 'local-combat-ended-free-hunt-continued'
                        : 'local-combat-ended-recovery-still-blocked',
                forwardRecoveryReadyUnitCount:
                    wave.getForwardRecoveryReadyUnitCount(),
                forwardRecoveryRegroupingUnitCount:
                    wave.getForwardRecoveryRegroupingUnitCount(),
            });
        }

        return recoveryResult !== 'blocked';
    }

    private tryFinishWaveForwardRecovery(
        wave: BattleWave,
        forwardResumeSource = 'target-set-empty'
    ): 'blocked' | 'forward' | 'free-hunt' {
        const completed = wave.tryResumeForward(
            this.refreshLaneBeforeWaveForward,
            (readyWave) =>
                this.tryContinueRecoveryFreeHuntBeforeForward(readyWave)
        );

        if (!completed) return 'blocked';
        if (!wave.isForwardMode()) return 'free-hunt';

        this.recordWaveForwardResume(wave, forwardResumeSource);
        // Safety net for a scanner pass that occurs after the pre-forward
        // check but before the next ordinary scanner interval.
        this.searchForwardWaveTarget(wave, true);
        return 'forward';
    }

    private tryContinueRecoveryFreeHuntBeforeForward(
        wave: BattleWave
    ) {
        const scanner = wave.getScanner(true);

        if (!scanner) return false;

        const sameLaneOnly = wave.hasAggressiveForwardLaneLock();
        const targetWaveBefore = wave.getTargetWave();
        const target = this.findPassedEnemyWaveScanner(
            wave,
            scanner,
            sameLaneOnly
        );
        const released = target
            ? this.onWaveForwardTargetFound(
                scanner,
                target,
                'recovery-pre-forward-scanner-pass',
                true
            )
            : false;

        this.recordWaveScannerTrace(
            scanner,
            target,
            sameLaneOnly
                ? 'recovery-pre-forward-aggressive'
                : 'recovery-pre-forward-normal',
            released
                ? 'target-passed-release'
                : 'no-forward-target',
            targetWaveBefore,
            target ? 1 : 0
        );

        return released;
    }

    private findPassedEnemyWaveScanner(
        wave: BattleWave,
        scanner: Unit,
        sameLaneOnly: boolean
    ): Unit | null {
        if (!scanner.agent) return null;

        const ownLane = wave.laneId >= 0
            ? this.clampLaneId(wave.laneId)
            : this.getCurrentLaneIdForUnit(scanner);

        if (ownLane < 0) return null;

        const maxRange = Math.max(0, scanner.targetSearchRange);
        const maxRangeSq = maxRange * maxRange;
        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < this.waves.length; i++) {
            const enemyWave = this.waves[i];

            if (!enemyWave || enemyWave === wave) continue;
            if (enemyWave.team === wave.team) continue;
            if (enemyWave.isDeadRuntime(this.frame)) continue;
            if (enemyWave.laneId < 0) continue;

            const enemyLane = this.clampLaneId(enemyWave.laneId);
            const laneDistance = Math.abs(enemyLane - ownLane);

            if (sameLaneOnly ? laneDistance !== 0 : laneDistance > 1) {
                continue;
            }

            const enemyScanner = enemyWave.getProgressScanner();

            if (!enemyScanner?.agent) continue;
            if (!scanner.hasPassedForwardTarget(enemyScanner)) continue;

            const dx = enemyScanner.agent.pos.x - scanner.agent.pos.x;
            const dz = enemyScanner.agent.pos.z - scanner.agent.pos.z;
            const distSq = dx * dx + dz * dz;

            if (distSq > maxRangeSq) continue;
            if (distSq >= bestDistSq) continue;

            bestDistSq = distSq;
            best = enemyScanner;
        }

        return best;
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

            if (
                !this.shouldRunFrameInterval(
                    wave.getTargetSearchIntervalFrames(),
                    wave.id
                )
            ) {
                continue;
            }

            wave.refreshInitialForwardCombatGate();

            const recoveryResult =
                this.tryFinishWaveForwardRecovery(wave);

            if (recoveryResult !== 'blocked') {
                continue;
            }

            const blocker =
                wave.consumeForwardRecoveryBlockTelemetry();

            if (blocker) {
                this.recordWaveForwardRecoveryBlocked(
                    wave,
                    blocker
                );
            }

            const deferred =
                wave.consumeForwardRecoveryDeferredTelemetry();

            if (deferred) {
                this.recordWaveForwardRecoveryDeferred(
                    wave,
                    deferred
                );
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
            this.updateWaveBannerDebugTint(wave);
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
        wave: BattleWave | null
    ) {
        if (!wave) return;
        if (wave.isDeadRuntime(this.frame)) return;
        if (wave.hasAggressiveForwardLaneLock()) return;
        if (wave.hasBackToLaneUnits()) return;

        const interval =
            wave.getTargetSearchIntervalFrames();
        const offset =
            wave.id + Math.floor(interval / 2);

        // Lane is strategic metadata only. Stagger updates by wave
        // and away from forward scans for the same wave.
        if (!this.shouldRunFrameInterval(interval, offset)) {
            return;
        }

        // This path is reserved for hero waves. Command waves keep their
        // assigned lane so a scanner's temporary lateral position cannot
        // expand scanner-pass checks beyond the same/adjacent lane rules.
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
            const previousLaneId = wave.laneId;
            wave.setLaneId(laneId);
            this.handleWaveStrategicLaneChanged(
                wave,
                previousLaneId
            );
        }
    }

    private pruneDeadWaves() {
        for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];

            if (!wave || !wave.isDeadRuntime(this.frame)) continue;

            if (wave) {
                this.closeWaveIdleEpisode(wave, 'wave-despawned');
                this.closeTargetClearRecoveryWindow(
                    wave,
                    'wave-despawned'
                );
            }
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

    private processWaveTargetClearTelemetry() {
        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
                continue;
            }

            const interval = wave.getTargetSearchIntervalFrames();

            if (
                !this.shouldRunFrameInterval(
                    interval,
                    wave.id
                )
            ) {
                continue;
            }

            const previousLaneId = wave.laneId;
            const pending = wave.processPendingTargetLifecycle();

            if (pending && this.enableBattleTelemetry) {
                this.battleTelemetry.recordTargetWaveLifecycleEvent({
                    type: 'wave-target-lifecycle-pending-processed',
                    frame: this.frame,
                    time: this.battleElapsedTime,
                    team: wave.team,
                    waveId: wave.id,
                    laneId: wave.laneId,
                    unitName: wave.unitName,
                    familyName:
                        UnitFamily[wave.family] ?? String(wave.family),
                    reason: pending.pendingReason,
                    strategicIntervalFrames: interval,
                    strategicPendingFrame: pending.pendingFrame,
                    strategicPendingDelayFrames:
                        Math.max(0, this.frame - pending.pendingFrame),
                    strategicPendingTargetWaveId:
                        pending.pendingTargetWaveId,
                    strategicPendingEventCount:
                        pending.pendingEventCount,
                    targetWaveCountBefore:
                        pending.targetWaveCountBefore,
                    targetWaveCountAfter:
                        pending.targetWaveCountAfter,
                });
            }

            this.handleWaveStrategicLaneChanged(
                wave,
                previousLaneId
            );
            this.flushWaveTargetClearTelemetry(wave);
        }
    }

    private handleWaveStrategicLaneChanged(
        movedWave: BattleWave,
        previousLaneId: number
    ) {
        if (
            !movedWave ||
            movedWave.isDeadRuntime(this.frame) ||
            previousLaneId === movedWave.laneId
        ) {
            return;
        }

        for (let i = 0; i < this.waves.length; i++) {
            const pursuingWave = this.waves[i];

            if (
                !pursuingWave ||
                pursuingWave === movedWave ||
                pursuingWave.isDeadRuntime(this.frame)
            ) {
                continue;
            }

            if (
                !pursuingWave.removeAggressiveOffLaneTargetWave(
                    movedWave
                )
            ) {
                continue;
            }

            this.flushWaveTargetClearTelemetry(pursuingWave);
        }
    }

    private flushWaveTargetClearTelemetry(wave: BattleWave) {
        let clearedTarget = wave.consumeClearedTargetTelemetry();

        while (clearedTarget) {
            this.recordWaveTargetCleared(wave, clearedTarget);
            clearedTarget = wave.consumeClearedTargetTelemetry();
        }

        const targetClearOutcome =
            wave.consumeTargetClearOutcomeTelemetry();

        if (targetClearOutcome) {
            this.recordWaveTargetClearOutcome(
                wave,
                targetClearOutcome
            );
        }
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
            const previousLaneId = heroWave.laneId;
            heroWave.setLaneId(laneId);
            this.handleWaveStrategicLaneChanged(
                heroWave,
                previousLaneId
            );
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

    public recordBattleTelemetryRangedKite(
        unit: Unit,
        target: Unit,
        reason: string,
        targetDistance: number,
        moveX: number,
        moveZ: number
    ) {
        if (!this.enableBattleTelemetry) return;
        if (!unit?.agent || !target?.agent) return;

        this.battleTelemetry.recordDiagnosticEvent({
            type: 'ranged-kite',
            frame: this.frame,
            time: this.battleElapsedTime,
            team: unit.team,
            waveId: unit.waveRuntimeId,
            laneId: unit.laneId,
            unitName: unit.unitTypeName,
            familyName: unit.props
                ? UnitFamily[unit.props.family] ?? String(unit.props.family)
                : '',
            unitLifeId: unit.lifeId,
            targetTeam: target.team,
            targetWaveId: target.waveRuntimeId,
            targetLaneId: target.laneId,
            targetFamilyName: target.props
                ? UnitFamily[target.props.family] ?? String(target.props.family)
                : '',
            targetLifeId: target.lifeId,
            unitX: unit.agent.pos.x,
            unitZ: unit.agent.pos.z,
            targetX: target.agent.pos.x,
            targetZ: target.agent.pos.z,
            targetDistance,
            forwardDirX: unit.forwardDir.x,
            forwardDirZ: unit.forwardDir.z,
            moveX,
            moveZ,
            reason,
        });
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
            this.createBattleTelemetrySnapshot(false)
        );
    }

    private createBattleTelemetrySnapshot(includeUnits: boolean = false) {
        return {
            frame: this.frame,
            time: this.battleElapsedTime,
            teams: [
                this.createBattleTelemetryTeamSnapshot(0, includeUnits),
                this.createBattleTelemetryTeamSnapshot(1, includeUnits),
            ],
        };
    }

    private createBattleTelemetryTeamSnapshot(
        team: number,
        includeUnits: boolean
    ) {
        const waves: any[] = [];

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDeadRuntime(this.frame)) continue;

            waves.push(
                this.createBattleTelemetryWaveSnapshot(wave, includeUnits)
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
        wave: BattleWave,
        includeUnits: boolean
    ) {
        let busyCount = 0;
        let targetCount = 0;
        let continuityCount = 0;
        let forwardCount = 0;
        let isolatedRangedPursuitCount = 0;
        let staleUnitReferenceCount = 0;
        let maxPhysicalLaneDistance = 0;
        const units: BattleTelemetryWaveUnitSnapshot[] = [];

        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];

            // A pooled Unit may have been reused by another live wave while
            // remaining in this wave's historical units array.
            if (BattleWave.getWaveForUnit(unit) !== wave) {
                staleUnitReferenceCount++;
                continue;
            }
            if (!this.isAliveUnit(unit)) continue;

            if (unit.onBusy) busyCount++;
            if (unit.hasValidEnemyTarget()) targetCount++;
            if (unit.isContinuingFreeHuntIntent()) {
                continuityCount++;
            }
            if (unit.onForward) forwardCount++;
            if (unit.isIsolatedRangedPursuit()) {
                isolatedRangedPursuitCount++;
            }

            const position = unit.agent
                ? unit.agent.pos
                : unit.node.worldPosition;
            const physicalLaneId =
                this.getCurrentLaneIdForUnit(unit);
            const waveLaneDistance =
                wave.laneId >= 0 && physicalLaneId >= 0
                    ? Math.abs(
                        this.clampLaneId(wave.laneId) -
                        this.clampLaneId(physicalLaneId)
                    )
                    : -1;
            const target = unit.getValidEnemyTarget();
            const targetWave = BattleWave.getWaveForUnit(target);

            if (
                !unit.isIsolatedRangedPursuit() &&
                waveLaneDistance >= 0
            ) {
                maxPhysicalLaneDistance = Math.max(
                    maxPhysicalLaneDistance,
                    waveLaneDistance
                );
            }

            if (includeUnits) {
                units.push({
                    spawnId: this.battleTelemetry.getSpawnId(unit),
                    lifeId: unit.lifeId,
                    unitName: unit.unitTypeName,
                    x: position.x,
                    z: position.z,
                    laneId: unit.laneId,
                    physicalLaneId,
                    waveLaneDistance,
                    busy: unit.onBusy,
                    forward: unit.onForward,
                    backToLane: unit.isBackToLaneActive(),
                    regroupDestinationLaneId:
                        unit.getTelemetryRegroupDestinationLaneId(),
                    regroupLaneCoreDistanceX:
                        unit.getTelemetryRegroupLaneCoreDistanceX(),
                    freeHuntContinuity:
                        unit.isFreeHuntContinuityActive(),
                    isolatedRangedPursuit:
                        unit.isIsolatedRangedPursuit(),
                    isolatedRangedPursuitReturningToWave:
                        unit.isReturningToWaveAfterIsolatedRangedPursuit(),
                    movementIntent: unit.getTelemetryMovementIntent(),
                    isolatedRangedPursuitReturnCommandAttemptCount:
                        unit.getIsolatedRangedPursuitReturnCommandAttemptCount(),
                    isolatedRangedPursuitReturnRepeatedCommandCount:
                        unit.getIsolatedRangedPursuitReturnRepeatedCommandCount(),
                    isolatedRangedPursuitReturnLocalCombatCount:
                        unit.getIsolatedRangedPursuitReturnLocalCombatCount(),
                    isolatedRangedPursuitLastReturnCommandCause:
                        unit.getIsolatedRangedPursuitLastReturnCommandCause(),
                    targetLifeId: target?.lifeId ?? -1,
                    targetSpawnId:
                        this.battleTelemetry.getSpawnId(target),
                    targetWaveId: targetWave?.id ?? -1,
                    targetLaneId: targetWave?.laneId ?? -1,
                });
            }
        }

        const targetState = wave.getTelemetryTargetState();
        const scanner = wave.getScanner();
        const scannerPosition = scanner?.agent
            ? scanner.agent.pos
            : scanner?.node.worldPosition;

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
            isolatedRangedPursuitCount,
            commandAliveCount: wave.getCommandAliveCount(),
            awaitingForwardRecovery:
                wave.isAwaitingForwardRecoveryAfterTargetClear(),
            forwardRecoveryReadyUnitCount:
                wave.getForwardRecoveryReadyUnitCount(),
            forwardRecoveryRegroupingUnitCount:
                wave.getForwardRecoveryRegroupingUnitCount(),
            staleUnitReferenceCount,
            healthRatio:
                wave.getRuntimeHealthRatio(this.frame),
            forwardMode: wave.isForwardMode(),
            aggressiveForward:
                wave.isAggressiveForwardMode(),
            freeHuntActive: wave.isFreeHuntMode(),
            freeHuntForwardOrigin:
                wave.getFreeHuntForwardOrigin(),
            targetWaveLaneIds: wave.getTargetWaveLaneIds(),
            scannerSpawnId:
                this.battleTelemetry.getSpawnId(scanner),
            scannerX: scannerPosition?.x ?? 0,
            scannerZ: scannerPosition?.z ?? 0,
            scannerPhysicalLaneId:
                this.getCurrentLaneIdForUnit(scanner),
            maxPhysicalLaneDistance,
            ...(includeUnits ? { units } : {}),
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
            // Combat can resolve more than one terminal event in a single
            // damage batch. Preserve the first one so a later death cannot
            // reverse an already-decided winner before the batch completes.
            if (this.pendingBattleWinner) {
                return;
            }

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
            this.closeAllWaveIdleEpisodes('battle-ended');
            this.closeAllTargetClearRecoveryWindows('battle-ended');
            this.battleTelemetry.recordFinalSnapshot(
                this.createBattleTelemetrySnapshot(true)
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
            rangedKitePolicy: 'own-side' as const,
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
            const targetPhysicalLaneId =
                this.getPhysicalLaneIdForWave(wave);
            wave.invalidateRuntimeState();
            wave.handleUnitWillDespawn(unit);
            this.updateWaveBannerHealthBar(wave);

            if (wave.getCommandAliveCount() <= 0) {
                this.markTargetLifecyclePendingForWave(
                    wave,
                    'target-command-members-exhausted-by-despawn',
                    targetPhysicalLaneId
                );
            }
        }

        const anyController = this.cinematicController as any;

        if (
            anyController &&
            typeof anyController.onUnitWillDespawn === 'function'
        ) {
            anyController.onUnitWillDespawn(unit);
        }
    }

    private getPhysicalLaneIdForWave(
        wave: BattleWave | null
    ) {
        if (!wave) return -1;

        return this.getCurrentLaneIdForUnit(
            wave.getScanner()
        );
    }

    private markTargetLifecyclePendingForWave(
        targetWave: BattleWave,
        reason: string,
        targetPhysicalLaneId: number = -1
    ) {
        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave === targetWave) continue;

            const marked = wave.markTargetLifecyclePending(
                this.frame,
                targetWave,
                reason,
                targetPhysicalLaneId
            );

            if (!marked || !this.enableBattleTelemetry) continue;

            this.battleTelemetry.recordTargetWaveLifecycleEvent({
                type: 'wave-target-lifecycle-pending',
                frame: this.frame,
                time: this.battleElapsedTime,
                team: wave.team,
                waveId: wave.id,
                laneId: wave.laneId,
                unitName: wave.unitName,
                familyName:
                    UnitFamily[wave.family] ?? String(wave.family),
                targetWaveId: targetWave.id,
                targetLaneId: targetWave.laneId,
                reason,
                strategicIntervalFrames:
                    wave.getTargetSearchIntervalFrames(),
                strategicPendingFrame: this.frame,
                strategicPendingTargetWaveId: targetWave.id,
                targetWaveCountBefore: wave.getTargetWaveCount(),
            });
        }
    }

    public notifyWaveCommandMembershipChanged(
        unit: Unit | null
    ) {
        const wave = BattleWave.getWaveForUnit(unit);

        if (!wave) return;

        const targetPhysicalLaneId =
            this.getPhysicalLaneIdForWave(wave);
        wave.invalidateRuntimeState();

        if (wave.getCommandAliveCount() <= 0) {
            this.markTargetLifecyclePendingForWave(
                wave,
                'target-command-members-exhausted-by-isolation',
                targetPhysicalLaneId
            );
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
            laneId,
            cost
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

            this.linkPendingBreakthroughCashoutsToSpawn(
                team,
                wave,
                entry,
                cost
            );
        }

        this.node.emit(
            BattleWaveSpawnedEvent,
            wave
        );

        return wave;
    }

    private linkPendingBreakthroughCashoutsToSpawn(
        team: number,
        wave: BattleWave,
        entry: UnitPrefabEntry,
        cost: number
    ) {
        if (!this.enableBattleTelemetry) return;

        const remaining: typeof this.pendingBreakthroughSpawnLinks = [];

        for (
            let i = 0;
            i < this.pendingBreakthroughSpawnLinks.length;
            i++
        ) {
            const pending = this.pendingBreakthroughSpawnLinks[i];

            if (pending.team !== team) {
                remaining.push(pending);
                continue;
            }

            this.battleTelemetry.linkBreakthroughCashoutToNextBudgetedSpawn(
                pending.cashoutId,
                {
                    waveId: wave.id,
                    laneId: wave.laneId,
                    unitName: entry.name,
                    cost,
                    frame: this.frame,
                    time: this.battleElapsedTime,
                    madeAffordableAtCashoutTime:
                        pending.combatPointBeforeReward + 0.0001 < cost &&
                        pending.combatPointAfterReward + 0.0001 >= cost,
                }
            );
        }

        this.pendingBreakthroughSpawnLinks = remaining;
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
        this.updateWaveBannerDebugTint(wave);

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
                this.updateWaveBannerDebugTint(wave);
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
        this.waveBannerAggressiveTintCache.delete(node);

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

    private updateWaveBannerDebugTint(
        wave: BattleWave | null
    ) {
        if (!wave) return;

        const node = wave.getWaveBannerNode();

        if (!node) return;

        const aggressive =
            wave.isForwardMode() &&
            wave.isAggressiveForwardMode();

        if (
            this.waveBannerAggressiveTintCache.get(node) ===
            aggressive
        ) {
            return;
        }

        const tint = aggressive
            ? this.aggressiveWaveBannerTintParams
            : this.normalWaveBannerTintParams;
        const renderers =
            this.getWaveBannerRenderers(node);

        for (let i = 0; i < renderers.length; i++) {
            renderers[i].setInstancedAttribute(
                'a_billboard_tint_color',
                tint
            );
        }

        this.waveBannerAggressiveTintCache.set(
            node,
            aggressive
        );
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

    private despawnUnitForBreakthroughCashout(unit: Unit) {
        if (!unit || unit.isHero) return;

        this.notifyUnitWillDespawn(unit);

        const team = unit.team;
        const units = team === 0 ? this.teamA : this.teamB;
        const index = units.indexOf(unit);

        if (index < 0) return;

        units.splice(index, 1);
        this.aliveCount[team] = Math.max(0, this.aliveCount[team] - 1);

        const entry = this.getTeamEntry(team, unit.unitTypeName);

        if (entry?.prefab && this.spawner) {
            this.spawner.despawnUnit(unit, entry.prefab);
            return;
        }

        this.removeUnitAgentFromSimulator(unit);
        unit.resetForDespawn();
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
            this.updateHeroLineIndicator(team, lineZ);
        }
    }

    private updateHeroLineIndicator(
        team: number,
        lineZ: number
    ) {
        const indicator = team === 0
            ? this.blueHeroLine
            : this.redHeroLine;

        if (!indicator) return;

        const position = indicator.worldPosition.clone();
        position.x = (this.battleMinX + this.battleMaxX) * 0.5;
        position.z = lineZ;
        indicator.setWorldPosition(position);
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
        wave.enablePersistentFreeHunt();

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
