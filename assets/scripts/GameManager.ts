import { _decorator, Component, Prefab, instantiate, Vec3, game } from 'cc';
import { Unit } from './Unit';
import { EnemyFinder } from './EnemyFinder';
import { RVOSimulator } from './rvo/RVO';
import { ObstacleCircle } from './ObstacleCircle';
import { ObstacleRect } from './ObstacleRect';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Prefab) prefabA!: Prefab;
    @property(Prefab) prefabB!: Prefab;

    @property count = 100;

    @property updateInterval = 2;
    frame = 0;

    @property({ type: [ObstacleCircle] })
    circleObstacles: ObstacleCircle[] = [];

    @property({ type: [ObstacleRect] })
    rectObstacles: ObstacleRect[] = [];

    sim = new RVOSimulator();

    teamA: Unit[] = [];
    teamB: Unit[] = [];

    start() {
        game.frameRate = 30;
        // obstacle
        for (let ob of this.circleObstacles) {
            const p = ob.node.worldPosition;
            this.sim.addCircleObstacle(p.x, p.z, ob.radius);
        }

        for (let ob of this.rectObstacles) {
            const p = ob.node.worldPosition;
            const angle = ob.node.eulerAngles.y * Math.PI / 180;
            this.sim.addRectObstacle(p.x, p.z, ob.halfWidth, ob.halfHeight, angle);
        }

        const spacing = 1.2;
        const width = 30;

        for (let i = 0; i < this.count; i++) {

            const row = Math.floor(i / width);
            const col = i % width;

            const pos = new Vec3(-30 - row * spacing, 0, (col - width / 2) * spacing);

            const node = instantiate(this.prefabA);
            this.node.addChild(node);
            node.setWorldPosition(pos);

            const u = node.getComponent(Unit)!;
            const f = node.getComponent(EnemyFinder)!;

            u.init(this.sim);
            f.setTeam(0);

            this.teamA.push(u);
        }

        for (let i = 0; i < this.count; i++) {

            const row = Math.floor(i / width);
            const col = i % width;

            const pos = new Vec3(30 + row * spacing, 0, (col - width / 2) * spacing);

            const node = instantiate(this.prefabB);
            this.node.addChild(node);
            node.setWorldPosition(pos);

            const u = node.getComponent(Unit)!;
            const f = node.getComponent(EnemyFinder)!;

            u.init(this.sim);
            f.setTeam(1);

            this.teamB.push(u);
        }

        EnemyFinder.teamA = this.teamA;
        EnemyFinder.teamB = this.teamB;
    }

    update() {
        this.frame++;
        if(this.frame%this.updateInterval!==0){
            this.sim.step();
           // return;
        }
        
    }
}