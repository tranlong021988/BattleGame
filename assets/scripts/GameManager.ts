import { _decorator, Component, Vec3, Label } from 'cc';

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
import { UnitType } from './BattleTypes';

import {
    BattleUnitDatabase,
    UnitPrefabEntry,
    HeroEntry,
} from './BattleUnitDatabase';

export { UnitPrefabEntry } from './BattleUnitDatabase';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    static instance: GameManager | null = null;

    @property(BattleUnitDatabase)
    unitDatabase: BattleUnitDatabase | null = null;

    @property(Component)
    cinematicController: Component | null = null;

    @property
    useWorkerRVO = true;

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
    maxUnitPerRow = 8;

    @property
    spaceBetweenUnit = 1.5;

    @property
    spaceBetweenRow = 1.5;

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

    @property
    squareFormationWidth = 4;

    @property
    freeHuntNoTargetRecoveryFrames = 8;

    @property
    heroFreeHuntSearchRange = 80;

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
    private forwardReleasedWaves: Map<BattleWave, number> = new Map();
    private laneVoteCounts: number[] = [];
    private tempSpawnPos = new Vec3();
    private centeredRowXBuffer: number[] = [];
    private teamAHeroWave: BattleWave | null = null;
    private teamBHeroWave: BattleWave | null = null;
    private heroForwardUnlocked = [false, false];

    start() {
        GameManager.instance = this;

        this.teamA.length = 0;
        this.teamB.length = 0;

        this.waves.length = 0;
        this.nextWaveId = 1;
        this.forwardReleasedWaves.clear();
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

        this.resetCombatPoint();

        this.createSimulator();
        this.buildPrefabMaps();

        this.spatialGrid.cellSize = this.spatialGridCellSize;

        this.sim.setBattlefield(
            this.battleMinX,
            this.battleMaxX,
            this.battleMinZ,
            this.battleMaxZ
        );

        this.spawner = this.getComponent(UnitSpawner)!;
        this.spawner.init(this.sim);

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
        this.refreshBattleStatsUI();
    }

    onDestroy() {
        if (GameManager.instance === this) {
            GameManager.instance = null;
        }

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
        this.forwardReleasedWaves.clear();
        this.teamAHeroWave = null;
        this.teamBHeroWave = null;
        this.heroForwardUnlocked[0] = false;
        this.heroForwardUnlocked[1] = false;

        this.teamA.length = 0;
        this.teamB.length = 0;

        this.teamAPrefabMap.clear();
        this.teamBPrefabMap.clear();

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

    update(deltaTime: number) {
        this.frame++;

        Unit.visualLerpT =
            1 - Math.exp(-this.visualSmooth * deltaTime);

        if (
            this.shouldRunFrameInterval(
                this.updateInterval,
                this.rvoUpdateFrameOffset
            )
        ) {
            const safeDt = Math.min(
                deltaTime,
                Math.max(0.001, this.maxRvoStepDeltaTime)
            );

            this.sim.step(safeDt);
        }

        if (
            this.shouldRunFrameInterval(
                this.spatialGridUpdateInterval,
                this.spatialGridUpdateFrameOffset
            )
        ) {
            this.rebuildSpatialGrid();
        }

        if (this.enableAutoSpawn) {
            this.updateAutoSpawn(deltaTime);
        }

        this.processWaveCombatRecoveries();
        this.processForwardReleaseRecoveries();
        this.pruneDeadWaves();
        this.processHeroForwardUnlock();
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

        if (counter) {
            const damageMul = counter.getDamageMultiplier(
                killer.props.unitType,
                victim.props.unitType
            );

            const receivedMul = counter.getReceivedDamageMultiplier(
                killer.props.unitType,
                victim.props.unitType
            );

            isCounterKill =
                damageMul > 1.0001 ||
                receivedMul < 0.9999;
        }

        if (isCounterKill) {
            this.counterKillCount[killerTeam]++;
        }

        if (!killer.isHero) {
            this.addCombatPointFromVictim(
                killerTeam,
                victim,
                isCounterKill
            );
        }

        this.refreshBattleStatsUI();
    }

    public onWaveCombatStarted(
        unit: Unit | null,
        enemy: Unit | null = null
    ) {
        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return;
        if (wave.isDead()) return;

        wave.enterCombatMode();
        this.forwardReleasedWaves.delete(wave);

        const enemyWave =
            BattleWave.getWaveForUnit(enemy);

        if (
            !enemyWave ||
            enemyWave === wave ||
            enemyWave.isDead()
        ) {
            return;
        }

        enemyWave.enterCombatMode();
        this.forwardReleasedWaves.delete(enemyWave);
    }

    public onWaveForwardPassedAdjacentTarget(
        unit: Unit | null,
        target: Unit | null
    ) {
        if (!unit || !target) return false;

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return false;
        if (wave.isDead()) return false;
        if (!this.areSameOrAdjacentLanes(wave.laneId, target.laneId)) {
            return false;
        }

        wave.releaseForwardToFreeHunt();
        this.forwardReleasedWaves.set(wave, this.frame);

        const targetWave =
            BattleWave.getWaveForUnit(target);

        if (
            targetWave &&
            targetWave !== wave &&
            !targetWave.isDead() &&
            this.areSameOrAdjacentLanes(
                wave.laneId,
                targetWave.laneId
            ) &&
            this.waves.indexOf(targetWave) >= 0
        ) {
            targetWave.releaseForwardToFreeHunt();
            this.forwardReleasedWaves.set(
                targetWave,
                this.frame
            );
        }

        return true;
    }

    public canUnitRunWaveForwardScan(unit: Unit | null) {
        if (!unit) return true;

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return true;

        return wave.canUnitRunForwardScan(
            unit,
            this.frame
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

        for (let i = 0; i < wave.units.length; i++) {
            const unit = wave.units[i];

            if (!this.isAliveUnit(unit)) continue;

            const laneId =
                this.getNearestLaneIdForX(
                    unit.agent!.pos.x
                );

            counts[laneId]++;
            counted++;
        }

        if (counted <= 0) return -1;

        const currentLane =
            wave.laneId >= 0
                ? this.clampLaneId(wave.laneId)
                : -1;

        let bestLane =
            currentLane >= 0
                ? currentLane
                : 0;
        let bestCount = counts[bestLane];

        for (let i = 0; i < laneCount; i++) {
            if (counts[i] > bestCount) {
                bestCount = counts[i];
                bestLane = i;
            }
        }

        return bestLane;
    }

    private regroupWaveByMajorityLane(
        wave: BattleWave | null
    ) {
        if (!wave) return false;

        const laneId =
            this.getMajorityLaneIdForWave(wave);

        if (laneId < 0) {
            wave.resumeForward();
            return false;
        }

        wave.setLaneId(
            laneId,
            this.squareFormationWidth,
            this.spaceBetweenUnit
        );
        wave.resumeForward();

        return true;
    }

    private areSameOrAdjacentLanes(
        laneA: number,
        laneB: number
    ) {
        if (laneA < 0) return false;
        if (laneB < 0) return false;

        return Math.abs(laneA - laneB) <= 1;
    }

    private processWaveCombatRecoveries() {
        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            this.recoverWaveCombat(wave);
        }

        this.recoverHeroWaveCombat(
            this.teamAHeroWave,
            this.teamAHero
        );
        this.recoverHeroWaveCombat(
            this.teamBHeroWave,
            this.teamBHero
        );
    }

    private recoverHeroWaveCombat(
        wave: BattleWave | null,
        hero: Unit | null
    ) {
        if (!hero || hero.isSteady) {
            return;
        }

        if (this.heroForwardUnlocked[hero.team]) {
            if (wave) {
                wave.clearLaneControl();
            }

            if (
                !hero.onBusy &&
                (
                    hero.onForward ||
                    hero.returningToWaveLaneSlot ||
                    hero.laneId >= 0
                )
            ) {
                hero.enterFreeHuntMode(
                    this.heroFreeHuntSearchRange
                );
            }

            return;
        }

        this.recoverWaveCombat(wave);
    }

    private recoverWaveCombat(
        wave: BattleWave | null
    ) {
        if (!wave) return;
        if (wave.isDeadRuntime(this.frame)) return;
        if (!wave.combatModeActive) return;

        if (this.shouldForceTeamFreeHunt(wave.team)) {
            this.forceWaveToHeroPressureFreeHunt(wave);
            return;
        }

        if (wave.hasEngagedRuntime(this.frame)) {
            return;
        }

        if (
            !wave.shouldRecoverNoTarget(
                this.frame,
                this.freeHuntNoTargetRecoveryFrames
            )
        ) {
            return;
        }

        this.regroupWaveByMajorityLane(wave);
    }

    private processForwardReleaseRecoveries() {
        if (this.forwardReleasedWaves.size <= 0) {
            return;
        }

        for (const wave of this.forwardReleasedWaves.keys()) {
            if (!wave || wave.isDeadRuntime(this.frame)) {
                this.forwardReleasedWaves.delete(wave);
                continue;
            }

            if (this.shouldForceTeamFreeHunt(wave.team)) {
                this.forceWaveToHeroPressureFreeHunt(wave);
                continue;
            }

            if (wave.combatModeActive) {
                this.forwardReleasedWaves.delete(wave);
                continue;
            }

            if (wave.hasEngagedRuntime(this.frame)) {
                continue;
            }

            if (
                !wave.shouldRecoverNoTarget(
                    this.frame,
                    this.freeHuntNoTargetRecoveryFrames
                )
            ) {
                continue;
            }

            this.regroupWaveByMajorityLane(wave);
            this.forwardReleasedWaves.delete(wave);
        }
    }

    private pruneDeadWaves() {
        for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];

            if (!wave || !wave.isDeadRuntime(this.frame)) continue;

            this.forwardReleasedWaves.delete(wave);
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
                    ? hero.props.unitType
                    : UnitType.LightSword
            );

            heroWave =
                team === 0
                    ? this.teamAHeroWave
                    : this.teamBHeroWave;
        }

        if (heroWave) {
            heroWave.clearLaneControl();
            heroWave.setLaneId(
                laneId,
                this.squareFormationWidth,
                this.spaceBetweenUnit
            );
            this.forwardReleasedWaves.delete(heroWave);
        }

        this.heroForwardUnlocked[team] = true;
        hero.setSteady(false, false);
        hero.enterFreeHuntMode(
            this.heroFreeHuntSearchRange
        );
        this.releaseEnemyNormalWavesToFreeHunt(team);
    }

    private releaseEnemyNormalWavesToFreeHunt(
        heroTeam: number
    ) {
        const enemyTeam =
            heroTeam === 0 ? 1 : 0;

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;
            if (wave.team !== enemyTeam) continue;
            if (wave.isDead()) continue;

            this.forceWaveToHeroPressureFreeHunt(wave);
        }
    }

    private forceWaveToHeroPressureFreeHunt(
        wave: BattleWave
    ) {
        this.forwardReleasedWaves.delete(wave);

        wave.clearLaneControl();
        wave.releaseForwardToFreeHunt(
            this.heroFreeHuntSearchRange
        );
    }

    private shouldForceTeamFreeHunt(
        team: number
    ) {
        if (team !== 0 && team !== 1) {
            return false;
        }

        const enemyTeam =
            team === 0 ? 1 : 0;

        return this.heroForwardUnlocked[enemyTeam];
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

            if (!this.isValidEntry(entry)) continue;

            if (Math.floor(entry.unitCount) <= 0) {
                continue;
            }

            if (this.canAffordEntry(team, entry)) {
                return true;
            }
        }

        return false;
    }

    private findNearestEnemyInCurrentLane(
        wave: BattleWave
    ): Unit | null {
        if (!wave) return null;
        if (wave.laneId < 0) return null;

        const enemies =
            wave.team === 0
                ? this.teamB
                : this.teamA;

        const x = wave.getAverageX();
        const z = wave.getAverageZ();

        let best: Unit | null = null;
        let bestDistSq = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            if (!this.isAliveUnit(enemy)) continue;
            if (enemy.laneId !== wave.laneId) continue;

            const dx = enemy.agent!.pos.x - x;
            const dz = enemy.agent!.pos.z - z;
            const d = dx * dx + dz * dz;

            if (d < bestDistSq) {
                bestDistSq = d;
                best = enemy;
            }
        }

        return best;
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
        killerTeam: number,
        victim: Unit,
        isCounterKill: boolean
    ) {
        if (!this.isCombatPointEnabled()) return;
        if (!this.unitDatabase) return;

        const bountyValue = this.getVictimBountyValue(victim);
        if (bountyValue <= 0) return;

        const reward =
            this.unitDatabase.calculateKillRewardFromBounty(
                bountyValue,
                isCounterKill
            );

        this.addCombatPoint(killerTeam, reward);
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
        if (!entry) return false;
        if (!entry.name) return false;
        if (!entry.prefab) return false;

        return true;
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
            if (!this.isValidEntry(entry)) continue;

            if (Math.floor(entry.unitCount) <= 0) {
                continue;
            }

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

        this.rebuildSpatialGrid();
    }

    public spawnWaveByEntry(
        team: number,
        entry: UnitPrefabEntry,
        laneId: number = -1,
        aggressiveForward: boolean = false
    ): BattleWave | null {

        if (!entry || !entry.prefab) {
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

        this.rebuildSpatialGrid();

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
            this.refreshBattleStatsUI();
            return null;
        }

        const laneId =
            this.resolveSpawnLaneId(requestedLaneId);

        const wave = new BattleWave(
            this.nextWaveId++,
            team,
            entry.name,
            entry.unitType,
            count,
            laneId
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

        if (this.shouldForceTeamFreeHunt(team)) {
            this.forceWaveToHeroPressureFreeHunt(wave);
        }

        return wave;
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
            Math.floor(this.squareFormationWidth)
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
                this.spaceBetweenUnit;

            const rowZOffset =
                row * this.spaceBetweenRow;

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
            Math.floor(this.maxUnitPerRow)
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
                    row
                );

            for (
                let col = 0;
                col < rowCount;
                col++
            ) {

                const x = rowXPositions[col];

                const rowZOffset =
                    row * this.spaceBetweenRow;

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
        unit.forwardLaneOffsetX =
            pos.x - this.getLaneCenterX(laneId);

        wave.addUnit(unit);
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
        rowIndex: number
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
                    this.spaceBetweenUnit;

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
                pairIndex * this.spaceBetweenUnit;

            const rightX =
                gapHalf +
                pairIndex * this.spaceBetweenUnit;

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
            entry.unitType,
            pos,
            0,
            this.node,
            entry.maxSpeed,
            entry.health,
            entry.damage,
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

        this.refreshBattleStatsUI();

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
            entry.unitType,
            pos,
            1,
            this.node,
            entry.maxSpeed,
            entry.health,
            entry.damage,
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

        this.refreshBattleStatsUI();

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

                this.rebuildSpatialGrid();
                this.refreshBattleStatsUI();
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

                this.rebuildSpatialGrid();
                this.refreshBattleStatsUI();
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

        this.rebuildSpatialGrid();
        this.refreshBattleStatsUI();
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
            props.unitType = heroEntry.unitType;
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
            heroEntry.unitType
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
        unitType: UnitType
    ) {
        const laneId =
            this.getHeroLaneId();

        const previousWave =
            team === 0
                ? this.teamAHeroWave
                : this.teamBHeroWave;

        if (previousWave) {
            previousWave.releaseReferences();
        }

        hero.laneId = laneId;
        hero.forwardLaneOffsetX =
            hero.agent
                ? hero.agent.pos.x - this.getLaneCenterX(laneId)
                : 0;

        const wave = new BattleWave(
            this.nextWaveId++,
            team,
            unitTypeName,
            unitType || UnitType.LightSword,
            1,
            laneId
        );

        wave.addUnit(hero);

        if (team === 0) {
            this.teamAHeroWave = wave;
        } else {
            this.teamBHeroWave = wave;
        }
    }

    private getHeroLaneId() {
        return this.clampLaneId(
            Math.floor(this.getSafeLaneCount() / 2)
        );
    }

    private refreshBattleStatsUI() {

        if (this.teamAAliveLabel) {
            this.teamAAliveLabel.string =
                'A Alive: ' +
                this.aliveCount[0];
        }

        if (this.teamADeathLabel) {
            this.teamADeathLabel.string =
                'A Death: ' +
                this.deathCount[0];
        }

        if (this.teamBAliveLabel) {
            this.teamBAliveLabel.string =
                'B Alive: ' +
                this.aliveCount[1];
        }

        if (this.teamBDeathLabel) {
            this.teamBDeathLabel.string =
                'B Death: ' +
                this.deathCount[1];
        }

        if (this.teamAKillLabel) {
            this.teamAKillLabel.string =
                'A Kill: ' +
                this.killCount[0];
        }

        if (this.teamBKillLabel) {
            this.teamBKillLabel.string =
                'B Kill: ' +
                this.killCount[1];
        }

        if (this.teamACounterKillLabel) {
            this.teamACounterKillLabel.string =
                'A Counter Kill: ' +
                this.counterKillCount[0] +
                ' (' +
                Math.round(this.getCounterKillRatio(0) * 100) +
                '%)';
        }

        if (this.teamBCounterKillLabel) {
            this.teamBCounterKillLabel.string =
                'B Counter Kill: ' +
                this.counterKillCount[1] +
                ' (' +
                Math.round(this.getCounterKillRatio(1) * 100) +
                '%)';
        }

        if (this.teamACombatPointLabel) {
            this.teamACombatPointLabel.string =
                'A CP: ' +
                Math.floor(this.combatPoint[0]);
        }

        if (this.teamBCombatPointLabel) {
            this.teamBCombatPointLabel.string =
                'B CP: ' +
                Math.floor(this.combatPoint[1]);
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
