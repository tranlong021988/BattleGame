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
import { HealthBar3D } from './HealthBar3D';

export { UnitPrefabEntry } from './BattleUnitDatabase';

const { ccclass, property } = _decorator;
const BannerVisibilityBlockedEvent =
    'battle-camera-banner-visibility-blocked';
const TopDownZoomRangeChangedEvent =
    'battle-camera-topdown-zoom-range-changed';
const BattleWaveSpawnedEvent =
    'battle-wave-spawned';

@ccclass('GameManager')
export class GameManager extends Component {

    static instance: GameManager | null = null;
    private static originalDirectorTick:
        ((deltaTime: number) => void) | null = null;
    private static directorTimeScaleOwner: GameManager | null = null;

    @property(BattleUnitDatabase)
    unitDatabase: BattleUnitDatabase | null = null;

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
            'Check battle winner rules. Hero killed always resolves the battle. Optional CP fallback is controlled separately.',
    })
    enableBattleWinnerCheck = true;

    @property({
        tooltip:
            'Fallback winner rule for economy-only tests: if enabled, a team loses only when it has no non-hero units alive and can no longer afford any valid spawn entry.',
    })
    enableNoAffordableSpawnWinnerFallback = false;

    @property({
        min: 1,
        tooltip:
            'Frames between CP fallback winner checks. Hero-death winner is event-driven and does not wait for this interval.',
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
            'When auto-reload is enabled, store each telemetry report in browser localStorage so Chrome does not block repeated automatic downloads.',
    })
    storeBattleTelemetryReportsInBrowser = true;

    @property({
        tooltip:
            'If false, auto-reload batch tests skip per-match downloads and only store reports for a later one-file batch export.',
    })
    downloadSingleTelemetryDuringAutoReload = false;

    @property({
        tooltip:
            'localStorage key used for accumulated browser telemetry reports.',
    })
    battleTelemetryStorageKey = 'battle-telemetry-batch';

    @property({
        tooltip:
            'Reload the browser page after telemetry export. Useful for unattended repeated browser balance tests.',
    })
    reloadPageAfterBattleTelemetryExport = true;

    @property({
        min: 0,
        tooltip:
            'Seconds to wait after triggering telemetry JSON download before reloading the browser page.',
    })
    battleTelemetryReloadDelaySeconds = 1.5;

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
    private laneVoteCounts: number[] = [];
    private tempSpawnPos = new Vec3();
    private centeredRowXBuffer: number[] = [];
    private teamAHeroWave: BattleWave | null = null;
    private teamBHeroWave: BattleWave | null = null;
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

    start() {
        GameManager.instance = this;
        this.applyTargetFrameRate();
        this.installBattleTimeScaleHook();
        this.applyProfilerStats();

        this.teamA.length = 0;
        this.teamB.length = 0;

        this.waves.length = 0;
        this.nextWaveId = 1;
        this.teamAHeroWave = null;
        this.teamBHeroWave = null;
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

        this.spawnWaveTimer = 0;
        this.battleElapsedTime = 0;

        this.resetCombatPoint();

        this.createSimulator();
        this.buildPrefabMaps();
        this.resetBattleTelemetry();
        this.installBattleTelemetryBatchHelpers(
            this.battleTelemetryStorageKey ||
            'battle-telemetry-batch'
        );

        this.spatialGrid.cellSize = this.spatialGridCellSize;

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

        if (this.spawnImmediatelyOnStart) {
            this.spawnAutoWave();
        }

        this.rebuildSpatialGrid();
        this.refreshBattleStatsUI(true);
    }

    onDestroy() {
        if (GameManager.instance === this) {
            GameManager.instance = null;
        }

        if (this.resetBattleTimeScaleOnDestroy) {
            this.uninstallBattleTimeScaleHook();
        }

        this.unregisterWaveBannerCameraEvents();

        if (this.sim && this.sim.destroy) {
            this.sim.destroy();
        }

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

        this.waves.length = 0;
        this.teamAHeroWave = null;
        this.teamBHeroWave = null;
        this.heroForwardUnlocked[0] = false;
        this.heroForwardUnlocked[1] = false;

        this.teamA.length = 0;
        this.teamB.length = 0;

        this.teamAPrefabMap.clear();
        this.teamBPrefabMap.clear();
        this.clearWaveBannerPools();

        this.spatialGrid.destroy();
        this.spatialGrid.build([], []);
        this.sim = null;
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
        this.frame++;
        this.battleElapsedTime += deltaTime;

        Unit.visualLerpT =
            1 - Math.exp(-this.visualSmooth * deltaTime);

        if (
            this.shouldRunFrameInterval(
                this.updateInterval,
                this.rvoUpdateFrameOffset
            )
        ) {
            this.stepRvoSimulation(deltaTime);
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
        this.processWaveForwardSearches();
        this.processWaveForwardRecoveries();
        this.processWaveBanners();
        this.pruneDeadWaves();
        this.processHeroForwardUnlock();
        this.recordBattleTelemetrySnapshotIfNeeded();
        this.processBattleWinnerCondition();

        this.refreshBattleStatsUI();
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

        this.battleTelemetry.recordKill(
            killer,
            victim,
            isCounterKill,
            this.frame,
            this.battleElapsedTime
        );

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
        isAreaDamage: boolean = false
    ) {
        this.battleTelemetry.recordDamage(
            attacker,
            victim,
            damage,
            actualDamage,
            isCounterDamage,
            isAreaDamage,
            this.frame,
            this.battleElapsedTime
        );
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

        if (
            !this.shouldUseSoloAggressiveCombat(
                wave,
                unit,
                enemy
            ) &&
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

        wave.releaseForwardToFreeHunt();
        unit.setWaveSearchTarget(target);

        return true;
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

    private getMajorityLaneIdForWave(
        wave: BattleWave | null
    ) {
        if (!wave) return -1;

        const laneCount =
            this.getSafeLaneCount();
        const counts =
            this.laneVoteCounts;

        counts.length = laneCount;

        for (let i = 0; i < laneCount; i++) {
            counts[i] = 0;
        }

        let counted = 0;
        let sumX = 0;

        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];

            if (!this.isAliveUnit(unit)) continue;

            const unitX =
                unit.agent
                    ? unit.agent.pos.x
                    : unit.node.worldPosition.x;
            const laneId =
                this.getNearestLaneIdForX(
                    unitX
                );

            counts[laneId]++;
            counted++;
            sumX += unitX;
        }

        if (counted <= 0) return -1;

        let bestCount = 0;

        for (let i = 0; i < laneCount; i++) {
            if (counts[i] > bestCount) {
                bestCount = counts[i];
            }
        }

        if (bestCount <= 0) return -1;

        const currentLane =
            wave.laneId >= 0
                ? this.clampLaneId(wave.laneId)
                : -1;

        if (
            currentLane >= 0 &&
            counts[currentLane] === bestCount
        ) {
            return currentLane;
        }

        const averageX = sumX / counted;
        let bestLane = -1;
        let bestCenterDistance = Infinity;

        for (let i = 0; i < laneCount; i++) {
            if (counts[i] !== bestCount) continue;

            const centerDistance = Math.abs(
                averageX - this.getLaneCenterX(i)
            );

            if (centerDistance < bestCenterDistance) {
                bestCenterDistance = centerDistance;
                bestLane = i;
            }
        }

        return bestLane;
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

    private searchForwardWaveTarget(
        wave: BattleWave | null
    ) {
        if (!wave) return;
        if (!wave.isForwardMode()) return;
        if (wave.isDeadRuntime(this.frame)) return;

        let scanner =
            wave.getForwardScanner();

        if (!scanner) return;

        if (scanner.hasReachedEnemyHeroLine()) {
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

        if (wave.isAggressiveForwardMode()) {
            const heroTarget =
                scanner.getEnemyHeroTarget();

            if (
                heroTarget &&
                this.shouldReleaseAggressiveForwardHeroTarget(
                    scanner,
                    heroTarget
                )
            ) {
                this.onWaveForwardTargetFound(
                    scanner,
                    heroTarget
                );
            }

            if (
                !this.shouldRunFrameInterval(
                    wave.getTargetSearchIntervalFrames(),
                    wave.id
                )
            ) {
                return;
            }

            scanner = wave.getForwardScanner(true);

            if (!scanner) return;

            const sameLaneTarget =
                scanner.findForwardSearchTarget(
                    true
                );

            if (
                sameLaneTarget &&
                this.shouldReleaseAggressiveForwardSameLaneTarget(
                    scanner,
                    sameLaneTarget
                )
            ) {
                this.onWaveForwardTargetFound(
                    scanner,
                    sameLaneTarget
                );
            }

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

        scanner = wave.getForwardScanner(true);

        if (!scanner) return;

        const target =
            scanner.findForwardSearchTarget(
                false
            );

        if (
            target &&
            this.shouldReleaseNormalForwardTarget(
                scanner,
                target
            )
        ) {
            this.onWaveForwardTargetFound(
                scanner,
                target
            );
        }
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

    private shouldReleaseAggressiveForwardHeroTarget(
        scanner: Unit,
        target: Unit
    ) {
        if (!target.isHero) return false;
        if (!scanner.agent || !target.agent) return false;

        const dx =
            target.agent.pos.x -
            scanner.agent.pos.x;
        const dz =
            target.agent.pos.z -
            scanner.agent.pos.z;
        const range =
            Math.max(
                0,
                scanner.targetSearchRange
            );

        if (dx * dx + dz * dz > range * range) {
            return false;
        }

        return this.shouldReleaseNormalForwardTarget(
            scanner,
            target
        );
    }

    private shouldReleaseAggressiveForwardSameLaneTarget(
        scanner: Unit,
        target: Unit
    ) {
        if (!scanner || !target) return false;
        if (scanner.laneId < 0) return false;
        if (target.laneId < 0) return false;

        if (
            this.clampLaneId(scanner.laneId) !==
            this.clampLaneId(target.laneId)
        ) {
            return false;
        }

        return scanner.hasPassedForwardTarget(
            target
        );
    }

    private processWaveForwardRecoveries() {
        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave || wave.isDeadRuntime(this.frame)) {
                continue;
            }

            wave.refreshInitialForwardCombatGate();
            wave.tryResumeForward(
                this.refreshLaneBeforeWaveForward
            );
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

        const laneId =
            this.getMajorityLaneIdForWave(wave);

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
        const hero =
            team === 0
                ? this.teamAHero
                : this.teamBHero;

        if (!this.isAliveUnit(hero)) {
            return;
        }

        if (this.heroForwardUnlocked[team]) {
            return;
        }

        if (this.canAffordAnySpawnEntry(team)) {
            return;
        }

        if (this.hasAliveNonHeroUnit(team)) {
            return;
        }

        if (this.hasAliveWave(team)) {
            return;
        }

        this.unlockHeroForward(team, hero!);
    }

    private unlockHeroForward(team: number, hero: Unit) {
        const laneId = this.getHeroLaneId();
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
                    : 1
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

        this.forceEnemyWavesToForward(team);
    }

    private forceEnemyWavesToForward(
        heroTeam: number
    ) {
        const enemyTeam =
            heroTeam === 0 ? 1 : 0;

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;
            if (wave.team !== enemyTeam) continue;
            if (wave.isDead()) continue;

            wave.forceForwardMode();
        }
    }

    private hasAliveNonHeroUnit(team: number) {
        const units =
            team === 0
                ? this.teamA
                : this.teamB;

        for (let i = 0; i < units.length; i++) {
            const unit = units[i];

            if (!unit) continue;
            if (unit.isHero) continue;
            if (!this.isAliveUnit(unit)) continue;

            return true;
        }

        return false;
    }

    private hasAliveWave(team: number) {
        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;
            if (wave.team !== team) continue;
            if (wave.isDead()) continue;

            return true;
        }

        return false;
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

    private resetBattleTelemetry() {
        this.battleTelemetry.reset(
            this.enableBattleTelemetry,
            this.createBattleTelemetryStartConfig()
        );
        this.battleTelemetry.configureDiagnostics(
            this.battleTelemetryMaxSnapshots,
            this.battleTelemetryMaxDiagnosticEvents
        );
    }

    public recordBattleTelemetryWaveSpawnDecision(
        decision: BattleTelemetryWaveSpawnDecision
    ) {
        if (!this.enableBattleTelemetry) return;

        this.battleTelemetry.recordWaveSpawnDecision(
            decision
        );
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
            waves,
        };
    }

    private createBattleTelemetryWaveSnapshot(
        wave: BattleWave
    ) {
        let busyCount = 0;
        let targetCount = 0;
        let forwardCount = 0;

        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];

            if (!this.isAliveUnit(unit)) continue;

            if (unit.onBusy) busyCount++;
            if (unit.hasValidEnemyTarget()) targetCount++;
            if (unit.onForward) forwardCount++;
        }

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
            forwardCount,
            healthRatio:
                wave.getRuntimeHealthRatio(this.frame),
            forwardMode: wave.isForwardMode(),
            aggressiveForward:
                wave.isAggressiveForwardMode(),
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

    private processBattleWinnerCondition() {
        if (!this.enableBattleWinnerCheck) return;
        if (this.hasBattleWinner()) return;
        if (!this.enableNoAffordableSpawnWinnerFallback) return;
        if (!this.isCombatPointEnabled()) return;
        if (
            !this.shouldRunFrameInterval(
                this.battleWinnerCheckIntervalFrames
            )
        ) {
            return;
        }

        const teamACanSpawn =
            this.canAffordAnySpawnEntry(0);
        const teamBCanSpawn =
            this.canAffordAnySpawnEntry(1);
        const teamAHasTroops =
            this.getAliveNonHeroUnitCount(0) > 0;
        const teamBHasTroops =
            this.getAliveNonHeroUnitCount(1) > 0;

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

    private getAliveNonHeroUnitCount(team: number) {
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

        this.battleWinnerTeam = winnerTeam;
        this.battleLoserTeam = loserTeam;
        this.battleWinnerReason = reason;
        this.battleWinnerResolved = true;

        console.log(
            `[BattleWinner] winnerTeam=${winnerTeam}, ` +
            `loserTeam=${loserTeam}, reason=${reason}`
        );

        if (
            !this.enableBattleTelemetry ||
            !this.battleTelemetry.isEnabled() ||
            this.battleTelemetry.hasEnded()
        ) {
            return;
        }

        this.battleTelemetry.recordFinalSnapshot(
            this.createBattleTelemetrySnapshot()
        );

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
                this.counterKillCount
            );

        this.storeBattleTelemetryReportInBrowser(report);

        const shouldDownloadSingleReport =
            this.downloadBattleTelemetryOnEnd &&
            (
                !this.reloadPageAfterBattleTelemetryExport ||
                this.downloadSingleTelemetryDuringAutoReload
            );

        if (
            this.downloadBattleTelemetryOnEnd &&
            !shouldDownloadSingleReport
        ) {
            console.log(
                '[BattleTelemetry] single report download skipped ' +
                'during auto-reload batch mode. Use ' +
                'downloadBattleTelemetryBatch() later.'
            );
        }

        this.battleTelemetry.exportReport(
            report,
            this.battleTelemetryFilePrefix,
            shouldDownloadSingleReport,
            this.logBattleTelemetryOnEnd
        );

        this.scheduleBattleTelemetryPageReload();
    }

    public hasBattleWinner() {
        return this.battleWinnerResolved;
    }

    private storeBattleTelemetryReportInBrowser(report: any) {
        if (!this.storeBattleTelemetryReportsInBrowser) return;
        if (!report) return;
        if (typeof localStorage === 'undefined') return;

        const key =
            this.battleTelemetryStorageKey ||
            'battle-telemetry-batch';

        try {
            const existingText =
                localStorage.getItem(key);
            let reports =
                existingText
                    ? JSON.parse(existingText)
                    : [];

            if (!Array.isArray(reports)) {
                reports = [];
            }

            reports.push(report);
            localStorage.setItem(
                key,
                JSON.stringify(reports)
            );

            this.installBattleTelemetryBatchHelpers(key);

            console.log(
                `[BattleTelemetry] stored report ${reports.length} ` +
                `in localStorage key "${key}".`
            );
        } catch (error) {
            console.warn(
                '[BattleTelemetry] Failed to store report batch.',
                error
            );
        }
    }

    private installBattleTelemetryBatchHelpers(key: string) {
        const globalObject =
            globalThis as any;

        globalObject.downloadBattleTelemetryBatch =
            () => this.downloadStoredBattleTelemetryBatch(key);
        globalObject.clearBattleTelemetryBatch =
            () => {
                if (typeof localStorage === 'undefined') return;
                localStorage.removeItem(key);
                console.log(
                    `[BattleTelemetry] cleared localStorage key "${key}".`
                );
            };
    }

    private downloadStoredBattleTelemetryBatch(key: string) {
        if (typeof localStorage === 'undefined') return;
        if (typeof document === 'undefined') return;
        if (typeof Blob === 'undefined') return;
        if (typeof URL === 'undefined') return;

        const raw =
            localStorage.getItem(key);

        if (!raw) {
            console.warn(
                `[BattleTelemetry] no stored reports at "${key}".`
            );
            return;
        }

        try {
            const reports =
                JSON.parse(raw);
            const payload = {
                version: 1,
                exportedAt: new Date().toISOString(),
                count: Array.isArray(reports)
                    ? reports.length
                    : 0,
                reports,
            };
            const json =
                JSON.stringify(payload, null, 2);
            const blob =
                new Blob(
                    [json],
                    { type: 'application/json' }
                );
            const url =
                URL.createObjectURL(blob);
            const link =
                document.createElement('a');

            link.href = url;
            link.download =
                `${this.battleTelemetryFilePrefix || 'battle-telemetry'}-batch-` +
                `${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(
                () => URL.revokeObjectURL(url),
                0
            );
        } catch (error) {
            console.warn(
                '[BattleTelemetry] Failed to download stored batch.',
                error
            );
        }
    }

    private scheduleBattleTelemetryPageReload() {
        if (!this.reloadPageAfterBattleTelemetryExport) return;
        if (!this.enableBattleTelemetry) return;
        if (typeof window === 'undefined') return;
        if (!window.location) return;

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
                window.location.reload();
            },
            delayMs
        );
    }

    private createBattleTelemetryStartConfig() {
        return {
            startedAt: new Date().toISOString(),
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
        this.battleTelemetry.recordCombatPointEarned(
            killer,
            victim,
            reward,
            isCounterKill,
            this.frame,
            this.battleElapsedTime
        );
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
        this.battleTelemetry.recordDespawn(
            unit,
            this.frame,
            this.battleElapsedTime
        );

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (wave) {
            wave.invalidateRuntimeHealth();
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

        for (const entry of teamAEntries) {
            if (!this.isValidEntry(entry)) continue;

            this.spawner.prewarm(
                entry.prefab!,
                entry.prewarmCount,
                this.node
            );
        }

        for (const entry of teamBEntries) {
            if (!this.isValidEntry(entry)) continue;

            this.spawner.prewarm(
                entry.prefab!,
                entry.prewarmCount,
                this.node
            );
        }
    }

    private getDatabaseTeamEntries(team: number) {
        if (!this.unitDatabase) {
            return [];
        }

        return this.unitDatabase.getTeamEntries(team);
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
        aggressiveForward: boolean = false
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
            aggressiveForward
        );

        this.requestSpatialGridRebuild();

        return wave;
    }

    public spawnWaveByName(
        team: number,
        unitName: string,
        laneId: number = -1,
        aggressiveForward: boolean = false
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
            aggressiveForward
        );
    }

    private spawnEntryFormation(
        team: number,
        entry: UnitPrefabEntry,
        baseZ: number,
        spendCost: boolean,
        requestedLaneId: number = -1,
        aggressiveForward: boolean = false
    ): BattleWave | null {
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
        });

        if (spendCost && this.isCombatPointEnabled()) {
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

        if (controller && controller.node) {
            controller.node.off(
                BannerVisibilityBlockedEvent,
                this.onWaveBannerCameraBlockedChanged,
                this
            );
        }

        if (this.registeredTopDownCameraDragNode) {
            this.registeredTopDownCameraDragNode.off(
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
            this.node,
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
            this.node,
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
            }

            return;
        }
    }

    private handleHeroDeath(unit: Unit) {
        const team = unit.team;

        if (team === 0 || team === 1) {
            this.heroForwardUnlocked[team] = false;
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

        if (team === 0 || team === 1) {
            this.resolveBattleWinner(
                team === 0 ? 1 : 0,
                team,
                'hero-killed'
            );
        }

        this.removeUnitAgentFromSimulator(unit);
        unit.resetForDespawn();
        unit.node.active = false;

        this.requestSpatialGridRebuild();
        this.requestBattleStatsUIRefresh();
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

        const heroA = this.unitDatabase.getHeroEntry(0);
        const heroB = this.unitDatabase.getHeroEntry(1);

        this.registerSceneHero(
            heroA,
            0,
            'hero_a'
        );

        this.registerSceneHero(
            heroB,
            1,
            'hero_b'
        );
    }

    private registerSceneHero(
        heroEntry: HeroEntry | null,
        team: number,
        fallbackTypeName: string
    ) {

        if (!heroEntry) return;
        if (!heroEntry.heroNode) return;

        const hero = heroEntry.heroNode.getComponent(Unit);

        if (!hero) {
            return;
        }

        if (!hero.node.activeInHierarchy) return;

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

        hero.moveSpeed = heroEntry.maxSpeed;
        hero.canBePassedThroughByForwardAlly = true;
        hero.heroGuardDistance = heroEntry.guardDistance;
        hero.isSteady = true;

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
            heroEntry.tier
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
    }

    private registerHeroWave(
        hero: Unit,
        team: number,
        unitTypeName: string,
        family: UnitFamily,
        tier: number
    ) {
        const laneId =
            this.getHeroLaneId();

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
}
