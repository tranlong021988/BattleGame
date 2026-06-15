import { _decorator, Component } from 'cc';
import { Unit } from './Unit';

const { ccclass, property } = _decorator;

@ccclass('EnemyFinder')
export class EnemyFinder extends Component {

    static teamA: Unit[] = [];
    static teamB: Unit[] = [];

    private static useWorker = true;
    private static worker: Worker | null = null;
    private static workerReady = false;
    private static workerFailed = false;
    private static workerSeq = 0;
    private static nextUnitId = 1;
    private static nextRequestId = 1;
    private static unitIds: WeakMap<Unit, number> = new WeakMap();
    private static unitsById: Map<number, Unit> = new Map();
    private static pendingFinders: EnemyFinder[] = [];
    private static pendingRequestMap: Map<number, EnemyFinder> = new Map();
    private static flushScheduled = false;
    private static activeFinderCount = 0;

    @property
    updateInterval = 30;

    private unit!: Unit;

    private team = 0;
    private frame = 0;
    private updateOffset = 0;
    private unitId = 0;

    onLoad() {
        EnemyFinder.activeFinderCount++;
        this.unit = this.getComponent(Unit)!;
        this.unitId = EnemyFinder.getUnitId(this.unit);
    }

    onDestroy() {
        if (this.unitId > 0) {
            EnemyFinder.unitsById.delete(this.unitId);
        }

        EnemyFinder.activeFinderCount = Math.max(
            0,
            EnemyFinder.activeFinderCount - 1
        );

        if (EnemyFinder.activeFinderCount <= 0) {
            EnemyFinder.destroyWorker();
        }
    }

    resetForSpawn(team: number) {
        this.team = team;
        this.frame = 0;
        this.updateOffset = Math.floor(Math.random() * 1000);
    }

    setTeam(team: number) {
        this.team = team;
    }

    getTeam() {
        return this.team;
    }

    update() {
        if (!this.node.activeInHierarchy) return;
        if (!this.unit.agent) return;
        if (this.unit.onBusy) return;

        // Khi còn forward phase thì không auto target.
        if (this.unit.onForward) return;

        this.frame++;

        const safeUpdateInterval = Math.max(
            1,
            Math.floor(this.updateInterval)
        );

        if ((this.frame + this.updateOffset) % safeUpdateInterval !== 0) {
            return;
        }

        if (
            this.unit.enemy &&
            this.unit.enemy.node.activeInHierarchy &&
            this.unit.enemy.agent &&
            this.unit.enemy.props &&
            !this.unit.enemy.props.isDead()
        ) {
            return;
        }

        if (EnemyFinder.canUseWorker()) {
            EnemyFinder.queueWorkerFind(this);
            return;
        }

        this.findOnMainThread();
    }

    private findOnMainThread() {
        const enemies = this.team === 0
            ? EnemyFinder.teamB
            : EnemyFinder.teamA;

        let best: Unit | null = null;
        let bestDist = Infinity;

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];

            if (!e || e === this.unit) continue;
            if (!e.node.activeInHierarchy) continue;
            if (!e.agent) continue;
            if (!e.props || e.props.isDead()) continue;

            const dx = e.agent.pos.x - this.unit.agent.pos.x;
            const dz = e.agent.pos.z - this.unit.agent.pos.z;

            const d = dx * dx + dz * dz;

            if (d < bestDist) {
                bestDist = d;
                best = e;
            }
        }

        if (best) {
            this.unit.setEnemy(best);
        }
    }

    private canAcceptWorkerResult() {
        if (!this.node.activeInHierarchy) return false;
        if (!this.unit.agent) return false;
        if (this.unit.onBusy) return false;
        if (this.unit.onForward) return false;

        if (
            this.unit.enemy &&
            this.unit.enemy.node.activeInHierarchy &&
            this.unit.enemy.agent &&
            this.unit.enemy.props &&
            !this.unit.enemy.props.isDead()
        ) {
            return false;
        }

        return true;
    }

    private static getUnitId(unit: Unit) {
        let id = this.unitIds.get(unit);

        if (!id) {
            id = this.nextUnitId++;
            this.unitIds.set(unit, id);
        }

        this.unitsById.set(id, unit);
        return id;
    }

    private static canUseWorker() {
        if (!this.useWorker) return false;
        if (this.workerFailed) return false;

        if (!this.worker) {
            this.createWorker();
        }

        return !!this.worker && this.workerReady;
    }

    private static queueWorkerFind(finder: EnemyFinder) {
        if (!finder.canAcceptWorkerResult()) return;

        if (this.pendingFinders.indexOf(finder) < 0) {
            this.pendingFinders.push(finder);
        }

        if (this.flushScheduled) return;

        this.flushScheduled = true;
        Promise.resolve().then(() => {
            this.flushScheduled = false;
            this.flushWorkerRequests();
        });
    }

    private static flushWorkerRequests() {
        if (!this.worker || !this.workerReady) {
            this.runPendingOnMainThread();
            return;
        }

        if (this.pendingFinders.length <= 0) return;

        const finders = this.pendingFinders.slice();
        this.pendingFinders.length = 0;

        const requests: any[] = [];

        for (let i = 0; i < finders.length; i++) {
            const finder = finders[i];

            if (!finder || !finder.canAcceptWorkerResult()) continue;
            if (!finder.unit || !finder.unit.agent) continue;

            const requestId = this.nextRequestId++;

            this.pendingRequestMap.set(requestId, finder);

            requests.push({
                requestId,
                unitId: finder.unitId,
                team: finder.team,
                x: finder.unit.agent.pos.x,
                z: finder.unit.agent.pos.z,
            });
        }

        if (requests.length <= 0) return;

        const units = this.collectUnitSnapshot();

        try {
            this.worker.postMessage({
                type: 'findNearestBatch',
                seq: ++this.workerSeq,
                requests,
                units,
            });
        } catch (err) {
            this.workerFailed = true;
            this.pendingRequestMap.clear();
            this.runFindersOnMainThread(finders);
        }
    }

    private static runPendingOnMainThread() {
        const finders = this.pendingFinders.slice();
        this.pendingFinders.length = 0;
        this.runFindersOnMainThread(finders);
    }

    private static runFindersOnMainThread(finders: EnemyFinder[]) {
        for (let i = 0; i < finders.length; i++) {
            const finder = finders[i];

            if (!finder || !finder.canAcceptWorkerResult()) continue;

            finder.findOnMainThread();
        }
    }

    private static collectUnitSnapshot() {
        const result: any[] = [];

        this.appendUnitsToSnapshot(result, this.teamA, 0);
        this.appendUnitsToSnapshot(result, this.teamB, 1);

        return result;
    }

    private static appendUnitsToSnapshot(
        result: any[],
        units: Unit[],
        team: number
    ) {
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];

            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props || unit.props.isDead()) continue;

            const id = this.getUnitId(unit);

            result.push({
                id,
                team,
                x: unit.agent.pos.x,
                z: unit.agent.pos.z,
            });
        }
    }

    private static applyWorkerResults(results: any[]) {
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const finder =
                this.pendingRequestMap.get(result.requestId);

            this.pendingRequestMap.delete(result.requestId);

            if (!finder || !finder.canAcceptWorkerResult()) continue;

            const target =
                this.unitsById.get(result.targetId);

            if (!target) continue;

            finder.unit.setEnemy(target);
        }
    }

    private static createWorker() {
        if (
            typeof Worker === 'undefined' ||
            typeof Blob === 'undefined' ||
            typeof URL === 'undefined' ||
            !URL.createObjectURL
        ) {
            this.workerFailed = true;
            return;
        }

        try {
            const blob = new Blob([this.workerSource()], {
                type: 'application/javascript',
            });

            const url = URL.createObjectURL(blob);

            this.worker = this.createNamedWorker(
                url,
                'EnemyFinderWorker'
            );

            URL.revokeObjectURL(url);

            this.worker.onmessage = (event: MessageEvent) => {
                const data = event.data;

                if (!data) return;

                if (data.type === 'ready') {
                    this.workerReady = true;
                    return;
                }

                if (data.type === 'findNearestBatchResult') {
                    this.applyWorkerResults(data.results || []);
                }
            };

            this.worker.onerror = () => {
                this.workerFailed = true;
                this.workerReady = false;

                if (this.worker) {
                    this.worker.terminate();
                    this.worker = null;
                }

                this.pendingRequestMap.clear();
                this.runPendingOnMainThread();
            };
        } catch (err) {
            this.workerFailed = true;
            this.workerReady = false;
            this.worker = null;
        }
    }

    private static createNamedWorker(url: string, name: string) {
        try {
            return new Worker(url, { name });
        } catch (err) {
            return new Worker(url);
        }
    }

    private static destroyWorker() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }

        this.workerReady = false;
        this.workerFailed = false;
        this.flushScheduled = false;
        this.pendingFinders.length = 0;
        this.pendingRequestMap.clear();
        this.unitsById.clear();
    }

    private static workerSource() {
        return `
var ready = false;

self.onmessage = function(event) {
    var data = event.data;

    if (!data) return;

    if (data.type === 'findNearestBatch') {
        var units = data.units || [];
        var requests = data.requests || [];
        var results = [];

        for (var i = 0; i < requests.length; i++) {
            var request = requests[i];
            var bestId = 0;
            var bestDist = Infinity;

            for (var j = 0; j < units.length; j++) {
                var unit = units[j];

                if (!unit) continue;
                if (unit.id === request.unitId) continue;
                if (unit.team === request.team) continue;

                var dx = unit.x - request.x;
                var dz = unit.z - request.z;
                var d = dx * dx + dz * dz;

                if (d < bestDist) {
                    bestDist = d;
                    bestId = unit.id;
                }
            }

            results.push({
                requestId: request.requestId,
                targetId: bestId
            });
        }

        self.postMessage({
            type: 'findNearestBatchResult',
            seq: data.seq,
            results: results
        });
    }
};

self.postMessage({ type: 'ready' });
`;
    }
}
