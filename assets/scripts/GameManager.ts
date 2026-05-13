import { _decorator, Component, Prefab, Vec3 } from 'cc';
import { Unit } from './Unit';
import { EnemyFinder } from './EnemyFinder';
import { RVOSimulator } from './rvo/RVO';
import { ObstacleCircle } from './ObstacleCircle';
import { ObstacleRect } from './ObstacleRect';
import { UnitSpawner } from './UnitSpawner';
import { UnitBehavior } from './UnitBehavior';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Prefab) prefabA!: Prefab;
    @property(Prefab) prefabB!: Prefab;

    @property battleMinX = -28;
    @property battleMaxX = 28;
    @property battleMinZ = -18;
    @property battleMaxZ = 18;

    @property count = 10;

    @property updateInterval = 2;
    frame = 0;

    // ===== Auto spawn wave test =====
    @property
    enableAutoSpawn = true;

    @property
    spawnWaveInterval = 3;

    @property
    minNumUnit = 1;

    @property
    maxNumUnit = 5;

    @property
    teamASpawnZ = -20;

    @property
    teamBSpawnZ = 20;

    @property
    spawnAreaWidth = 18;

    private spawnWaveTimer = 0;

    @property({ type: [ObstacleCircle] })
    circleObstacles: ObstacleCircle[] = [];

    @property({ type: [ObstacleRect] })
    rectObstacles: ObstacleRect[] = [];

    sim = new RVOSimulator();

    teamA: Unit[] = [];
    teamB: Unit[] = [];

    private spawner!: UnitSpawner;

    start() {
        this.teamA.length = 0;
        this.teamB.length = 0;

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

        // Spawn test ban đầu, giữ nguyên logic cũ
        //this.spawnTest1();
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

    // =====================================================
    // Test spawn ban đầu
    // =====================================================

    spawnTest1() {
        const spacing = 1.5;
        const width = 12;

        for (let i = 0; i < this.count; i++) {
            const row = Math.floor(i / width);
            const col = i % width;

            const pos = new Vec3(
                (col - width / 2) * spacing,
                0,
                -20 - row * spacing
            );

            this.spawnTeamA(pos);
        }

        for (let i = 0; i < this.count; i++) {
            const row = Math.floor(i / width);
            const col = i % width;

            const pos = new Vec3(
                (col - width / 2) * spacing,
                0,
                20 + row * spacing
            );

            this.spawnTeamB(pos);
        }
    }

    // =====================================================
    // Auto spawn wave
    // =====================================================

    private updateAutoSpawn(deltaTime: number) {
        this.spawnWaveTimer += deltaTime;

        if (this.spawnWaveTimer < this.spawnWaveInterval) {
            return;
        }

        this.spawnWaveTimer = 0;
        this.spawnRandomWaveBothTeams();
    }

    spawnRandomWaveBothTeams() {
        const countA = this.randomInt(this.minNumUnit, this.maxNumUnit);
        const countB = this.randomInt(this.minNumUnit, this.maxNumUnit);

        this.spawnRandomUnitsForTeam(0, countA);
        this.spawnRandomUnitsForTeam(1, countB);
    }

    private spawnRandomUnitsForTeam(team: number, count: number) {
        for (let i = 0; i < count; i++) {
            const x = this.randomRange(
                -this.spawnAreaWidth * 0.5,
                this.spawnAreaWidth * 0.5
            );

            const zJitter = this.randomRange(-1.5, 1.5);

            if (team === 0) {
                this.spawnTeamA(new Vec3(
                    x,
                    0,
                    this.teamASpawnZ + zJitter
                ));
            } else {
                this.spawnTeamB(new Vec3(
                    x,
                    0,
                    this.teamBSpawnZ + zJitter
                ));
            }
        }
    }

    private randomInt(min: number, max: number) {
        min = Math.floor(min);
        max = Math.floor(max);

        if (max < min) {
            const t = min;
            min = max;
            max = t;
        }

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private randomRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    // =====================================================
    // Runtime API
    // =====================================================

    spawnTeamA(pos: Vec3): Unit {
        const unit = this.spawner.spawnUnit(
            this.prefabA,
            pos,
            0,
            this.node
        );

        if (this.teamA.indexOf(unit) < 0) {
            this.teamA.push(unit);
        }

        const behavior = unit.getComponent(UnitBehavior);
        if (behavior) {
            behavior.gameManager = this;
        }

        EnemyFinder.teamA = this.teamA;

        return unit;
    }

    spawnTeamB(pos: Vec3): Unit {
        const unit = this.spawner.spawnUnit(
            this.prefabB,
            pos,
            1,
            this.node
        );

        if (this.teamB.indexOf(unit) < 0) {
            this.teamB.push(unit);
        }

        const behavior = unit.getComponent(UnitBehavior);
        if (behavior) {
            behavior.gameManager = this;
        }

        EnemyFinder.teamB = this.teamB;

        return unit;
    }

    despawnUnit(unit: Unit) {
        if (!unit) return;

        const idxA = this.teamA.indexOf(unit);

        if (idxA >= 0) {
            this.teamA.splice(idxA, 1);
            EnemyFinder.teamA = this.teamA;

            this.spawner.despawnUnit(unit, this.prefabA);
            return;
        }

        const idxB = this.teamB.indexOf(unit);

        if (idxB >= 0) {
            this.teamB.splice(idxB, 1);
            EnemyFinder.teamB = this.teamB;

            this.spawner.despawnUnit(unit, this.prefabB);
            return;
        }
    }
}