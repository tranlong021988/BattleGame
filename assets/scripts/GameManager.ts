import { _decorator, Component, Prefab, Vec3, Label } from 'cc';

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

import { UnitType } from './BattleTypes';
import { BattleWave } from './BattleWave';

import { CounterSettings } from './CounterSettings';

const { ccclass, property } = _decorator;

@ccclass('UnitPrefabEntry')
export class UnitPrefabEntry {

    @property
    name: string = '';

    @property(Prefab)
    prefab: Prefab | null = null;

    @property({ type: UnitType })
    unitType: UnitType = UnitType.LightSword;

    @property
    unitCount: number = 1;

    @property
    prewarmCount: number = 0;

    @property
    maxSpeed: number = 2;

    @property
    health: number = 30;

    @property
    damage: number = 5;

    @property
    defense: number = 0;
}

@ccclass('GameManager')
export class GameManager extends Component {

    static instance: GameManager | null = null;

    @property
    useWorkerRVO = true;

    @property({ type: [UnitPrefabEntry] })
    teamAPrefabs: UnitPrefabEntry[] = [];

    @property({ type: [UnitPrefabEntry] })
    teamBPrefabs: UnitPrefabEntry[] = [];

    @property(Unit)
    teamAHero: Unit | null = null;

    @property(Unit)
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

    aliveCount = [0, 0];
    deathCount = [0, 0];

    killCount = [0, 0];
    counterKillCount = [0, 0];

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

    start() {
        GameManager.instance = this;

        this.teamA.length = 0;
        this.teamB.length = 0;

        this.waves.length = 0;
        this.nextWaveId = 1;

        this.aliveCount[0] = 0;
        this.aliveCount[1] = 0;

        this.deathCount[0] = 0;
        this.deathCount[1] = 0;

        this.killCount[0] = 0;
        this.killCount[1] = 0;

        this.counterKillCount[0] = 0;
        this.counterKillCount[1] = 0;

        this.spawnWaveTimer = 0;

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

        this.registerSceneHero(this.teamAHero, 0, 'hero_a');
        this.registerSceneHero(this.teamBHero, 1, 'hero_b');

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
    }

    private createSimulator() {
        if (
            this.useWorkerRVO &&
            RVOWorkerSimulator.isSupported()
        ) {
            this.sim = new RVOWorkerSimulator();

            console.log(
                '[GameManager] Using Worker RVO backend'
            );
        } else {
            this.sim = new RVOSimulator();

            console.log(
                '[GameManager] Using Main Thread RVO backend'
            );
        }
    }

    update(deltaTime: number) {
        this.frame++;

        Unit.visualLerpT =
            1 - Math.exp(-this.visualSmooth * deltaTime);

        if (this.frame % this.updateInterval === 0) {
            this.sim.step();
        }

        if (
            this.frame %
            this.spatialGridUpdateInterval === 0
        ) {
            this.rebuildSpatialGrid();
        }

        if (this.enableAutoSpawn) {
            this.updateAutoSpawn(deltaTime);
        }
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

        this.refreshBattleStatsUI();
    }

    public getCounterKillRatio(team: number) {
        if (team !== 0 && team !== 1) return 0;

        if (this.killCount[team] <= 0) {
            return 0;
        }

        return this.counterKillCount[team] / this.killCount[team];
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

        for (const entry of this.teamAPrefabs) {
            if (!this.isValidEntry(entry)) continue;

            this.teamAPrefabMap.set(
                entry.name,
                entry
            );
        }

        for (const entry of this.teamBPrefabs) {
            if (!this.isValidEntry(entry)) continue;

            this.teamBPrefabMap.set(
                entry.name,
                entry
            );
        }
    }

    private prewarmAllUnits() {
        for (const entry of this.teamAPrefabs) {
            if (!this.isValidEntry(entry)) continue;

            this.spawner.prewarm(
                entry.prefab!,
                entry.prewarmCount,
                this.node
            );
        }

        for (const entry of this.teamBPrefabs) {
            if (!this.isValidEntry(entry)) continue;

            this.spawner.prewarm(
                entry.prefab!,
                entry.prewarmCount,
                this.node
            );
        }
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

    private getRandomEntry(
        entries: UnitPrefabEntry[]
    ): UnitPrefabEntry | null {

        const validEntries: UnitPrefabEntry[] = [];

        for (const entry of entries) {
            if (!this.isValidEntry(entry)) continue;

            if (Math.floor(entry.unitCount) <= 0) {
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
        return team === 0
            ? this.teamAPrefabs
            : this.teamBPrefabs;
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
        const entryA =
            this.getRandomEntry(this.teamAPrefabs);

        const entryB =
            this.getRandomEntry(this.teamBPrefabs);

        if (entryA) {
            this.spawnEntryFormation(
                0,
                entryA,
                this.teamASpawnZ
            );
        }

        if (entryB) {
            this.spawnEntryFormation(
                1,
                entryB,
                this.teamBSpawnZ
            );
        }

        this.rebuildSpatialGrid();
    }

    public spawnWaveByEntry(
        team: number,
        entry: UnitPrefabEntry
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
            baseZ
        );

        this.rebuildSpatialGrid();

        return wave;
    }

    public spawnWaveByName(
        team: number,
        unitName: string
    ): BattleWave | null {

        const entry = this.getTeamEntry(
            team,
            unitName
        );

        if (!entry) return null;

        return this.spawnWaveByEntry(team, entry);
    }

    private spawnEntryFormation(
        team: number,
        entry: UnitPrefabEntry,
        baseZ: number
    ): BattleWave | null {

        const count = Math.max(
            0,
            Math.floor(entry.unitCount)
        );

        if (count <= 0) {
            return null;
        }

        const wave = new BattleWave(
            this.nextWaveId++,
            team,
            entry.name,
            entry.unitType,
            count
        );

        this.waves.push(wave);

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

                const pos = new Vec3(x, 0, z);

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

                if (unit) {
                    wave.addUnit(unit);
                }

                spawned++;
            }

            row++;
        }

        return wave;
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

    private registerSceneHero(
        hero: Unit | null,
        team: number,
        typeName: string
    ) {

        if (!hero) return;
        if (!hero.node.activeInHierarchy) return;

        hero.isHero = true;

        const props =
            hero.getComponent(UnitProps);

        if (props) {
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

        const forwardX = 0;
        const forwardZ =
            team === 0 ? 1 : -1;

        hero.init(
            this.sim,
            team,
            typeName,
            forwardX,
            forwardZ
        );

        if (team === 0) {

            if (
                this.teamA.indexOf(hero) < 0
            ) {
                this.teamA.push(hero);
                this.aliveCount[0]++;
            }

            EnemyFinder.teamA = this.teamA;

        } else {

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