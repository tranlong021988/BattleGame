import { _decorator, Component, Prefab, Vec3, Label } from 'cc';
import { Unit } from './Unit';
import { EnemyFinder } from './EnemyFinder';
import { RVOSimulator } from './rvo/RVO';
import { ObstacleCircle } from './ObstacleCircle';
import { ObstacleRect } from './ObstacleRect';
import { UnitSpawner } from './UnitSpawner';
import { UnitBehavior } from './UnitBehavior';

const { ccclass, property } = _decorator;

@ccclass('UnitPrefabEntry')
export class UnitPrefabEntry {

    @property
    name: string = '';

    @property(Prefab)
    prefab: Prefab | null = null;

    @property
    unitCount: number = 1;

    @property
    prewarmCount: number = 0;

    @property
    maxSpeed: number = 2;

    @property
    health: number = 30;

    @property
    damage: number = 1;
}

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: [UnitPrefabEntry] })
    teamAPrefabs: UnitPrefabEntry[] = [];

    @property({ type: [UnitPrefabEntry] })
    teamBPrefabs: UnitPrefabEntry[] = [];

    @property battleMinX = -28;
    @property battleMaxX = 28;
    @property battleMinZ = -18;
    @property battleMaxZ = 18;

    @property updateInterval = 2;
    frame = 0;

    @property(Label)
    teamAAliveLabel: Label | null = null;

    @property(Label)
    teamADeathLabel: Label | null = null;

    @property(Label)
    teamBAliveLabel: Label | null = null;

    @property(Label)
    teamBDeathLabel: Label | null = null;

    aliveCount = [0, 0];
    deathCount = [0, 0];

    @property
    enableAutoSpawn = true;

    @property
    spawnImmediatelyOnStart = true;

    @property
    prewarmOnStart = true;

    @property
    spawnWaveInterval = 3;

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
    spaceBetweenUnitTypes = 2.5;

    @property
    formationZNoise = 0.25;

    private spawnWaveTimer = 0;

    @property({ type: [ObstacleCircle] })
    circleObstacles: ObstacleCircle[] = [];

    @property({ type: [ObstacleRect] })
    rectObstacles: ObstacleRect[] = [];

    sim = new RVOSimulator();

    teamA: Unit[] = [];
    teamB: Unit[] = [];

    private spawner!: UnitSpawner;

    private teamAPrefabMap: Map<string, UnitPrefabEntry> = new Map();
    private teamBPrefabMap: Map<string, UnitPrefabEntry> = new Map();

    start() {
        this.teamA.length = 0;
        this.teamB.length = 0;

        this.aliveCount[0] = 0;
        this.aliveCount[1] = 0;

        this.deathCount[0] = 0;
        this.deathCount[1] = 0;

        this.spawnWaveTimer = 0;

        this.buildPrefabMaps();

        EnemyFinder.teamA = this.teamA;
        EnemyFinder.teamB = this.teamB;

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
            this.sim.addCircleObstacle(p.x, p.z, ob.radius);
        }

        for (const ob of this.rectObstacles) {
            const p = ob.node.worldPosition;
            const angle = ob.node.eulerAngles.y * Math.PI / 180;

            this.sim.addRectObstacle(
                p.x,
                p.z,
                ob.halfWidth,
                ob.halfHeight,
                angle
            );
        }

        if (this.spawnImmediatelyOnStart) {
            this.spawnAutoWave();
        }

        this.refreshBattleStatsUI();
    }

    update(deltaTime: number) {
        this.frame++;

        if (this.frame % this.updateInterval === 0) {
            this.sim.step();
        }

        if (this.enableAutoSpawn) {
            this.updateAutoSpawn(deltaTime);
        }
    }

    private buildPrefabMaps() {
        this.teamAPrefabMap.clear();
        this.teamBPrefabMap.clear();

        for (const entry of this.teamAPrefabs) {
            if (!this.isValidEntry(entry)) continue;
            this.teamAPrefabMap.set(entry.name, entry);
        }

        for (const entry of this.teamBPrefabs) {
            if (!this.isValidEntry(entry)) continue;
            this.teamBPrefabMap.set(entry.name, entry);
        }
    }

    private prewarmAllUnits() {
        for (const entry of this.teamAPrefabs) {
            if (!this.isValidEntry(entry)) continue;
            this.spawner.prewarm(entry.prefab!, entry.prewarmCount, this.node);
        }

        for (const entry of this.teamBPrefabs) {
            if (!this.isValidEntry(entry)) continue;
            this.spawner.prewarm(entry.prefab!, entry.prewarmCount, this.node);
        }
    }

    private isValidEntry(entry: UnitPrefabEntry | null): boolean {
        if (!entry) return false;
        if (!entry.name) return false;
        if (!entry.prefab) return false;
        return true;
    }

    private getTeamEntry(team: number, unitName: string): UnitPrefabEntry | null {
        const map = team === 0 ? this.teamAPrefabMap : this.teamBPrefabMap;
        const entry = map.get(unitName);

        if (!entry || !entry.prefab) {
            console.warn(`[GameManager] Missing unit entry. team=${team}, unitName=${unitName}`);
            return null;
        }

        return entry;
    }

    private refreshBattleStatsUI() {
        if (this.teamAAliveLabel) {
            this.teamAAliveLabel.string = `A Alive: ${this.aliveCount[0]}`;
        }

        if (this.teamADeathLabel) {
            this.teamADeathLabel.string = `A Death: ${this.deathCount[0]}`;
        }

        if (this.teamBAliveLabel) {
            this.teamBAliveLabel.string = `B Alive: ${this.aliveCount[1]}`;
        }

        if (this.teamBDeathLabel) {
            this.teamBDeathLabel.string = `B Death: ${this.deathCount[1]}`;
        }
    }

    private updateAutoSpawn(deltaTime: number) {
        this.spawnWaveTimer += deltaTime;

        if (this.spawnWaveTimer < this.spawnWaveInterval) {
            return;
        }

        this.spawnWaveTimer = 0;
        this.spawnAutoWave();
    }

    spawnAutoWave() {
        this.spawnFormationForTeam(
            0,
            this.teamAPrefabs,
            this.teamASpawnZ
        );

        this.spawnFormationForTeam(
            1,
            this.teamBPrefabs,
            this.teamBSpawnZ
        );
    }

    private spawnFormationForTeam(
        team: number,
        entries: UnitPrefabEntry[],
        baseZ: number
    ) {
        let currentRowOffset = 0;

        for (const entry of entries) {
            if (!this.isValidEntry(entry)) continue;

            const count = Math.max(0, Math.floor(entry.unitCount));
            if (count <= 0) continue;

            const rowsUsedDistance = this.spawnEntryFormation(
                team,
                entry,
                baseZ,
                currentRowOffset
            );

            currentRowOffset += rowsUsedDistance + this.spaceBetweenUnitTypes;
        }
    }

    private spawnEntryFormation(
        team: number,
        entry: UnitPrefabEntry,
        baseZ: number,
        startRowOffset: number
    ): number {
        const count = Math.max(0, Math.floor(entry.unitCount));
        const maxPerRow = Math.max(1, Math.floor(this.maxUnitPerRow));

        let spawned = 0;
        let row = 0;

        while (spawned < count) {
            const remaining = count - spawned;
            const rowCount = Math.min(maxPerRow, remaining);

            for (let col = 0; col < rowCount; col++) {
                const x = (col - (rowCount - 1) * 0.5) * this.spaceBetweenUnit;
                const rowZOffset = startRowOffset + row * this.spaceBetweenRow;

                const baseUnitZ = team === 0
                    ? baseZ - rowZOffset
                    : baseZ + rowZOffset;

                const z = baseUnitZ + this.randomRange(
                    -this.formationZNoise,
                    this.formationZNoise
                );

                const pos = new Vec3(x, 0, z);

                if (team === 0) {
                    this.spawnTeamA(entry.name, pos);
                } else {
                    this.spawnTeamB(entry.name, pos);
                }

                spawned++;
            }

            row++;
        }

        return row * this.spaceBetweenRow;
    }

    spawnTeamA(unitName: string, pos: Vec3): Unit | null {
        const entry = this.getTeamEntry(0, unitName);
        if (!entry || !entry.prefab) return null;

        const unit = this.spawner.spawnUnit(
            entry.prefab,
            entry.name,
            pos,
            0,
            this.node,
            entry.maxSpeed,
            entry.health,
            entry.damage
        );

        if (this.teamA.indexOf(unit) < 0) {
            this.teamA.push(unit);
            this.aliveCount[0]++;
        }

        const behavior = unit.getComponent(UnitBehavior);

        if (behavior) {
            behavior.gameManager = this;
        }

        EnemyFinder.teamA = this.teamA;

        this.refreshBattleStatsUI();

        return unit;
    }

    spawnTeamB(unitName: string, pos: Vec3): Unit | null {
        const entry = this.getTeamEntry(1, unitName);
        if (!entry || !entry.prefab) return null;

        const unit = this.spawner.spawnUnit(
            entry.prefab,
            entry.name,
            pos,
            1,
            this.node,
            entry.maxSpeed,
            entry.health,
            entry.damage
        );

        if (this.teamB.indexOf(unit) < 0) {
            this.teamB.push(unit);
            this.aliveCount[1]++;
        }

        const behavior = unit.getComponent(UnitBehavior);

        if (behavior) {
            behavior.gameManager = this;
        }

        EnemyFinder.teamB = this.teamB;

        this.refreshBattleStatsUI();

        return unit;
    }

    despawnUnit(unit: Unit) {
        if (!unit) return;

        const team = unit.team;
        const unitName = unit.unitTypeName;

        const entry = this.getTeamEntry(team, unitName);

        if (!entry || !entry.prefab) {
            console.warn(`[GameManager] Cannot despawn. Missing prefab. team=${team}, unitName=${unitName}`);
            return;
        }

        if (team === 0) {
            const idx = this.teamA.indexOf(unit);

            if (idx >= 0) {
                this.teamA.splice(idx, 1);

                this.aliveCount[0]--;
                this.deathCount[0]++;

                if (this.aliveCount[0] < 0) {
                    this.aliveCount[0] = 0;
                }

                EnemyFinder.teamA = this.teamA;

                this.spawner.despawnUnit(unit, entry.prefab);
                this.refreshBattleStatsUI();
            }

            return;
        }

        if (team === 1) {
            const idx = this.teamB.indexOf(unit);

            if (idx >= 0) {
                this.teamB.splice(idx, 1);

                this.aliveCount[1]--;
                this.deathCount[1]++;

                if (this.aliveCount[1] < 0) {
                    this.aliveCount[1] = 0;
                }

                EnemyFinder.teamB = this.teamB;

                this.spawner.despawnUnit(unit, entry.prefab);
                this.refreshBattleStatsUI();
            }

            return;
        }
    }

    private randomRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }
}