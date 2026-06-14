import { _decorator, Component, Vec3, Label } from 'cc';

import { Unit } from './Unit';
import { UnitProps } from './UnitProps';
import { EnemyFinder } from './EnemyFinder';

import { RVOSimulator } from './rvo/RVO';
import { RVOWorkerSimulator } from './rvo/RVOWorkerSimulator';

import { ObstacleCircle } from './ObstacleCircle';
import { ObstacleRect } from './ObstacleRect';

import { UnitSpawner } from './UnitSpawner';
import { UnitBehavior } from './UnitBehavior';

import { BattleSpatialGrid } from './BattleSpatialGrid';

import { BattleWave } from './BattleWave';
import { CounterSettings } from './CounterSettings';

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
    maxRvoStepDeltaTime = 0.05;

    frame = 0;

    @property
    visualSmooth = 16;

    @property
    spatialGridCellSize = 4;

    @property
    spatialGridUpdateInterval = 2;

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
    waveForwardReleaseRecoveryFrames = 90;

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
    private pendingLaneWaves: Set<BattleWave> = new Set();
    private forwardReleasedWaves: Map<BattleWave, number> = new Map();
    private endgameFreeHuntUnlocked = false;

    start() {
        GameManager.instance = this;

        this.teamA.length = 0;
        this.teamB.length = 0;

        this.waves.length = 0;
        this.nextWaveId = 1;
        this.pendingLaneWaves.clear();
        this.forwardReleasedWaves.clear();
        this.endgameFreeHuntUnlocked = false;

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

        EnemyFinder.teamA = this.teamA;
        EnemyFinder.teamB = this.teamB;

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

        this.waves.length = 0;
        this.pendingLaneWaves.clear();
        this.forwardReleasedWaves.clear();

        this.teamA.length = 0;
        this.teamB.length = 0;

        EnemyFinder.teamA = [];
        EnemyFinder.teamB = [];

        this.teamAPrefabMap.clear();
        this.teamBPrefabMap.clear();

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

        if (this.frame % this.updateInterval === 0) {
            const safeDt = Math.min(
                deltaTime,
                Math.max(0.001, this.maxRvoStepDeltaTime)
            );

            this.sim.step(safeDt);
        }

        if (
            this.frame %
            this.spatialGridUpdateInterval === 0
        ) {
            this.rebuildSpatialGrid();
        }

        if (
            this.enableAutoSpawn &&
            !this.endgameFreeHuntUnlocked
        ) {
            this.updateAutoSpawn(deltaTime);
        }

        this.processPendingWaveLaneTransfers();
        this.processWaveCombatRecoveries();
        this.processForwardReleaseRecoveries();
        this.pruneDeadWaves();
        this.processEndgameFreeHuntUnlock();
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

        this.addCombatPointFromVictim(
            killerTeam,
            victim,
            isCounterKill
        );

        this.refreshBattleStatsUI();
    }

    public onUnitKilled(
        killer: Unit | null,
        victim: Unit | null
    ) {
        if (!killer || !victim) return;
        if (this.endgameFreeHuntUnlocked) return;

        const killerWave =
            BattleWave.getWaveForUnit(killer);

        const victimWave =
            BattleWave.getWaveForUnit(victim);

        if (!killerWave || !victimWave) return;
        if (killerWave === victimWave) return;
        if (!victimWave.isDead()) return;

        this.releaseAssistingWavesAfterWaveDefeated(
            killerWave,
            victimWave
        );

        killerWave.noteDefeatedEnemyWave(victimWave);
        this.pendingLaneWaves.add(killerWave);

        this.processPendingWaveLaneTransfers();
    }

    public onWaveCombatStarted(unit: Unit | null) {
        if (this.endgameFreeHuntUnlocked) return;

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return;
        if (wave.isDead()) return;

        wave.enterCombatMode();
        this.forwardReleasedWaves.delete(wave);
    }

    public onWaveForwardPassedAdjacentTarget(
        unit: Unit | null,
        target: Unit | null
    ) {
        if (this.endgameFreeHuntUnlocked) return false;
        if (!unit || !target) return false;

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return false;
        if (wave.isDead()) return false;
        if (target.laneId < 0) return false;

        wave.setLaneId(
            target.laneId,
            this.squareFormationWidth,
            this.spaceBetweenUnit
        );
        wave.releaseForwardToFreeHunt();
        this.forwardReleasedWaves.set(wave, this.frame);
        return true;
    }

    public onWaveForwardPassedHeroTarget(
        unit: Unit | null,
        hero: Unit | null
    ) {
        if (this.endgameFreeHuntUnlocked) return false;
        if (!unit || !hero || !hero.agent) return false;

        const wave =
            BattleWave.getWaveForUnit(unit);

        if (!wave) return false;
        if (wave.isDead()) return false;

        const laneId =
            this.getNearestLaneIdForX(hero.agent.pos.x);

        wave.setLaneId(
            laneId,
            this.squareFormationWidth,
            this.spaceBetweenUnit
        );
        wave.releaseForwardToFreeHunt();
        this.forwardReleasedWaves.set(wave, this.frame);
        return true;
    }

    private releaseAssistingWavesAfterWaveDefeated(
        killerWave: BattleWave,
        victimWave: BattleWave
    ) {
        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;
            if (wave === killerWave) continue;
            if (wave === victimWave) continue;
            if (wave.team !== killerWave.team) continue;
            if (wave.isDead()) continue;
            if (!wave.isTargetingWave(victimWave)) continue;
            if (wave.isEngagedWithOtherWave(victimWave)) continue;
            if (wave.laneId < 0) continue;

            wave.noteDefeatedEnemyWave(victimWave);
            this.pendingLaneWaves.add(wave);
        }
    }

    private processPendingWaveLaneTransfers() {
        if (this.endgameFreeHuntUnlocked) {
            this.pendingLaneWaves.clear();
            return;
        }

        if (this.pendingLaneWaves.size <= 0) {
            return;
        }

        let shouldRebuildSpatialGrid = false;
        const waves = Array.from(this.pendingLaneWaves);

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!wave || wave.isDead()) {
                this.pendingLaneWaves.delete(wave);
                continue;
            }

            if (!wave.hasPendingLaneTransfer()) {
                this.pendingLaneWaves.delete(wave);
                continue;
            }

            if (
                !wave.hasEngaged()
            ) {
                const sameLaneEnemy =
                    this.findNearestEnemyInCurrentLane(wave);

                if (sameLaneEnemy) {
                    wave.setPendingLaneId(
                        sameLaneEnemy.laneId
                    );
                }
            }

            if (
                wave.tryApplyPendingLaneTransfer(
                    this.squareFormationWidth,
                    this.spaceBetweenUnit
                )
            ) {
                this.pendingLaneWaves.delete(wave);
                this.forwardReleasedWaves.delete(wave);
                shouldRebuildSpatialGrid = true;
            }
        }

        if (shouldRebuildSpatialGrid) {
            this.rebuildSpatialGrid();
        }
    }

    private processWaveCombatRecoveries() {
        if (this.endgameFreeHuntUnlocked) {
            return;
        }

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;
            if (wave.isDead()) continue;
            if (!wave.combatModeActive) continue;
            if (wave.hasPendingLaneTransfer()) continue;
            if (wave.hasEngaged()) continue;

            wave.resumeForward();
        }
    }

    private processForwardReleaseRecoveries() {
        if (this.endgameFreeHuntUnlocked) {
            return;
        }

        if (this.forwardReleasedWaves.size <= 0) {
            return;
        }

        const waves = Array.from(this.forwardReleasedWaves.keys());

        for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];

            if (!wave || wave.isDead()) {
                this.forwardReleasedWaves.delete(wave);
                continue;
            }

            if (wave.combatModeActive) {
                this.forwardReleasedWaves.delete(wave);
                continue;
            }

            if (wave.hasPendingLaneTransfer()) {
                continue;
            }

            if (wave.hasEngaged()) {
                this.forwardReleasedWaves.set(wave, this.frame);
                continue;
            }

            const releasedFrame =
                this.forwardReleasedWaves.get(wave) ?? 0;

            const recoveryFrames = Math.max(
                0,
                Math.floor(this.waveForwardReleaseRecoveryFrames)
            );

            if (this.frame - releasedFrame < recoveryFrames) {
                continue;
            }

            this.forwardReleasedWaves.delete(wave);
            wave.resumeForward();
        }
    }

    private pruneDeadWaves() {
        for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];

            if (!wave || !wave.isDead()) continue;

            this.pendingLaneWaves.delete(wave);
            this.forwardReleasedWaves.delete(wave);
            wave.releaseReferences();
            this.waves.splice(i, 1);
        }
    }

    private processEndgameFreeHuntUnlock() {
        if (this.endgameFreeHuntUnlocked) {
            return;
        }

        if (!this.isCombatPointEnabled()) {
            return;
        }

        if (
            !this.shouldUnlockEndgameFreeHunt(0) &&
            !this.shouldUnlockEndgameFreeHunt(1)
        ) {
            return;
        }

        this.unlockEndgameFreeHunt();
    }

    private shouldUnlockEndgameFreeHunt(team: number) {
        if (this.canAffordAnySpawnEntry(team)) {
            return false;
        }

        if (this.hasAliveNonHeroUnit(team)) {
            return false;
        }

        if (this.hasAliveWave(team)) {
            return false;
        }

        return this.isAliveUnit(
            team === 0
                ? this.teamAHero
                : this.teamBHero
        );
    }

    private unlockEndgameFreeHunt() {
        this.endgameFreeHuntUnlocked = true;
        this.pendingLaneWaves.clear();
        this.forwardReleasedWaves.clear();

        for (let i = 0; i < this.waves.length; i++) {
            const wave = this.waves[i];

            if (!wave) continue;

            wave.clearLaneControl();
        }

        this.freeHuntTeamUnits(this.teamA);
        this.freeHuntTeamUnits(this.teamB);
    }

    private freeHuntTeamUnits(units: Unit[]) {
        const searchRange =
            this.getEndgameFreeHuntSearchRange();

        for (let i = 0; i < units.length; i++) {
            const unit = units[i];

            if (!this.isAliveUnit(unit)) continue;

            unit.enterFreeHuntMode(searchRange);
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

    private getEndgameFreeHuntSearchRange() {
        const minZ =
            Math.min(
                this.battleMinZ,
                this.teamASpawnZ,
                this.teamBSpawnZ
            );

        const maxZ =
            Math.max(
                this.battleMaxZ,
                this.teamASpawnZ,
                this.teamBSpawnZ
            );

        const width =
            this.battleMaxX -
            this.battleMinX;

        const height =
            maxZ -
            minZ;

        return Math.sqrt(
            width * width +
            height * height
        ) + 4;
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
            console.warn(
                '[GameManager] Missing unit entry:',
                unitName
            );

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
        laneId: number = -1
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
            laneId
        );

        this.rebuildSpatialGrid();

        return wave;
    }

    public spawnWaveByName(
        team: number,
        unitName: string,
        laneId: number = -1
    ): BattleWave | null {

        const entry = this.getTeamEntry(
            team,
            unitName
        );

        if (!entry) return null;

        return this.spawnWaveByEntry(
            team,
            entry,
            laneId
        );
    }

    private spawnEntryFormation(
        team: number,
        entry: UnitPrefabEntry,
        baseZ: number,
        spendCost: boolean,
        requestedLaneId: number = -1
    ): BattleWave | null {

        if (this.endgameFreeHuntUnlocked) {
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
                count
            );
        } else {
            this.spawnCenteredRowsFormation(
                team,
                entry,
                baseZ,
                wave,
                count
            );
        }

        return wave;
    }

    private spawnSquareFormationInLane(
        team: number,
        entry: UnitPrefabEntry,
        baseZ: number,
        wave: BattleWave,
        laneId: number,
        count: number
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

            this.spawnUnitForWave(
                team,
                entry,
                new Vec3(x, 0, z),
                wave,
                laneId
            );
        }
    }

    private spawnCenteredRowsFormation(
        team: number,
        entry: UnitPrefabEntry,
        baseZ: number,
        wave: BattleWave,
        count: number
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

                this.spawnUnitForWave(
                    team,
                    entry,
                    new Vec3(x, 0, z),
                    wave,
                    wave.laneId
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
        laneId: number
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

        const result: number[] = [];

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

        EnemyFinder.teamA = this.teamA;

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

        EnemyFinder.teamB = this.teamB;

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

                EnemyFinder.teamA = this.teamA;

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

                EnemyFinder.teamB = this.teamB;

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

        if (team === 0) {

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

            EnemyFinder.teamA = this.teamA;

        } else {

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

            EnemyFinder.teamB = this.teamB;
        }

        unit.resetForDespawn();
        unit.node.active = false;

        this.rebuildSpatialGrid();
        this.refreshBattleStatsUI();
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
            console.warn(
                '[GameManager] Hero node missing Unit component:',
                heroEntry.heroNode.name
            );
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

        const finder =
            hero.getComponent(EnemyFinder);

        if (finder) {
            finder.resetForSpawn(team);
        }

        const unitTypeName =
            heroEntry.name && heroEntry.name.length > 0
                ? heroEntry.name
                : fallbackTypeName;

        const forwardX = 0;
        const forwardZ =
            team === 0 ? 1 : -1;

        hero.moveSpeed = heroEntry.maxSpeed;

        hero.init(
            this.sim,
            team,
            unitTypeName,
            forwardX,
            forwardZ
        );

        if (team === 0) {

            this.teamAHero = hero;

            if (
                this.teamA.indexOf(hero) < 0
            ) {
                this.teamA.push(hero);
                this.aliveCount[0]++;
            }

            EnemyFinder.teamA = this.teamA;

        } else {

            this.teamBHero = hero;

            if (
                this.teamB.indexOf(hero) < 0
            ) {
                this.teamB.push(hero);
                this.aliveCount[1]++;
            }

            EnemyFinder.teamB = this.teamB;
        }
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
