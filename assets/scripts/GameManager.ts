import { _decorator, Component, Prefab, Vec3 } from 'cc';
import { Unit } from './Unit';
import { EnemyFinder } from './EnemyFinder';
import { RVOSimulator } from './rvo/RVO';
import { ObstacleCircle } from './ObstacleCircle';
import { ObstacleRect } from './ObstacleRect';
import { UnitSpawner } from './UnitSpawner';

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

    @property({ type: [ObstacleCircle] })
    circleObstacles: ObstacleCircle[] = [];

    @property({ type: [ObstacleRect] })
    rectObstacles: ObstacleRect[] = [];

    sim = new RVOSimulator();

    teamA: Unit[] = [];
    teamB: Unit[] = [];

    private spawner!: UnitSpawner;

    start() {
        this.sim.setBattlefield(
            this.battleMinX,
            this.battleMaxX,
            this.battleMinZ,
            this.battleMaxZ
        );
        // ===== Spawner =====
        this.spawner = this.getComponent(UnitSpawner)!;
        this.spawner.init(this.sim);

        // ===== Obstacles =====
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

        // ===== Demo spawn =====
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

    update() {
        this.frame++;

        if (this.frame % this.updateInterval === 0) {
            this.sim.step();
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

        this.teamA.push(unit);
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

        this.teamB.push(unit);
        EnemyFinder.teamB = this.teamB;

        return unit;
    }

    despawnUnit(unit: Unit) {

        if (!unit) return;

        const idxA = this.teamA.indexOf(unit);
        if (idxA >= 0) {
            this.teamA.splice(idxA, 1);
            this.spawner.despawnUnit(unit, this.prefabA);
            EnemyFinder.teamA = this.teamA;
            return;
        }

        const idxB = this.teamB.indexOf(unit);
        if (idxB >= 0) {
            this.teamB.splice(idxB, 1);
            this.spawner.despawnUnit(unit, this.prefabB);
            EnemyFinder.teamB = this.teamB;
            return;
        }
    }
}