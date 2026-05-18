import { _decorator, Component, Prefab, Vec3, Label } from 'cc';
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

    // =====================================================
    // UI Labels
    // =====================================================

    @property(Label)
    teamAAliveLabel: Label | null = null;

    @property(Label)
    teamADeathLabel: Label | null = null;

    @property(Label)
    teamBAliveLabel: Label | null = null;

    @property(Label)
    teamBDeathLabel: Label | null = null;

    // =====================================================
    // Battle stats
    // index 0 = Team A
    // index 1 = Team B
    // =====================================================

    aliveCount = [0, 0];
    deathCount = [0, 0];

    // =====================================================
    // Auto spawn wave test
    // =====================================================

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

        this.aliveCount[0] = 0;
        this.aliveCount[1] = 0;

        this.deathCount[0] = 0;
        this.deathCount[1] = 0;

        this.spawnWaveTimer = 0;

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

        this.spawnTest1();
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

    // =====================================================
    // UI
    // =====================================================

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

    // =====================================================
    // Initial test spawn
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
                this.spawnTeamA(
                    new Vec3(
                        x,
                        0,
                        this.teamASpawnZ + zJitter
                    )
                );
            } else {
                this.spawnTeamB(
                    new Vec3(
                        x,
                        0,
                        this.teamBSpawnZ + zJitter
                    )
                );
            }
        }
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

    spawnTeamB(pos: Vec3): Unit {
        const unit = this.spawner.spawnUnit(
            this.prefabB,
            pos,
            1,
            this.node
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

                this.spawner.despawnUnit(unit, this.prefabA);
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

                this.spawner.despawnUnit(unit, this.prefabB);
                this.refreshBattleStatsUI();
            }

            return;
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
}