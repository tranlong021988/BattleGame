System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Unit, _dec, _class, _class2, _descriptor, _class3, _crd, ccclass, property, EnemyFinder;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }, function (_unresolved_2) {
      Unit = _unresolved_2.Unit;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "362a6zijiBJRI/tfy+pXbU2", "EnemyFinder", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EnemyFinder", EnemyFinder = (_dec = ccclass('EnemyFinder'), _dec(_class = (_class2 = (_class3 = class EnemyFinder extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "updateInterval", _descriptor, this);

          this.unit = void 0;
          this.team = 0;
          this.frame = 0;
          this.updateOffset = 0;
          this.unitId = 0;
        }

        onLoad() {
          EnemyFinder.activeFinderCount++;
          this.unit = this.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);
          this.unitId = EnemyFinder.getUnitId(this.unit);
        }

        onDestroy() {
          if (this.unitId > 0) {
            EnemyFinder.unitsById.delete(this.unitId);
          }

          EnemyFinder.activeFinderCount = Math.max(0, EnemyFinder.activeFinderCount - 1);

          if (EnemyFinder.activeFinderCount <= 0) {
            EnemyFinder.destroyWorker();
          }
        }

        resetForSpawn(team) {
          this.team = team;
          this.frame = 0;
          this.updateOffset = Math.floor(Math.random() * 1000);
        }

        setTeam(team) {
          this.team = team;
        }

        getTeam() {
          return this.team;
        }

        update() {
          if (!this.node.activeInHierarchy) return;
          if (!this.unit.agent) return;
          if (this.unit.onBusy) return; // Khi còn forward phase thì không auto target.

          if (this.unit.onForward) return;
          this.frame++;
          var safeUpdateInterval = Math.max(1, Math.floor(this.updateInterval));

          if ((this.frame + this.updateOffset) % safeUpdateInterval !== 0) {
            return;
          }

          if (this.unit.enemy && this.unit.enemy.node.activeInHierarchy && this.unit.enemy.agent && this.unit.enemy.props && !this.unit.enemy.props.isDead()) {
            return;
          }

          if (EnemyFinder.canUseWorker()) {
            EnemyFinder.queueWorkerFind(this);
            return;
          }

          this.findOnMainThread();
        }

        findOnMainThread() {
          var enemies = this.team === 0 ? EnemyFinder.teamB : EnemyFinder.teamA;
          var best = null;
          var bestDist = Infinity;

          for (var i = 0; i < enemies.length; i++) {
            var e = enemies[i];
            if (!e || e === this.unit) continue;
            if (!e.node.activeInHierarchy) continue;
            if (!e.agent) continue;
            if (!e.props || e.props.isDead()) continue;
            var dx = e.agent.pos.x - this.unit.agent.pos.x;
            var dz = e.agent.pos.z - this.unit.agent.pos.z;
            var d = dx * dx + dz * dz;

            if (d < bestDist) {
              bestDist = d;
              best = e;
            }
          }

          if (best) {
            this.unit.setEnemy(best);
          }
        }

        canAcceptWorkerResult() {
          if (!this.node.activeInHierarchy) return false;
          if (!this.unit.agent) return false;
          if (this.unit.onBusy) return false;
          if (this.unit.onForward) return false;

          if (this.unit.enemy && this.unit.enemy.node.activeInHierarchy && this.unit.enemy.agent && this.unit.enemy.props && !this.unit.enemy.props.isDead()) {
            return false;
          }

          return true;
        }

        static getUnitId(unit) {
          var id = this.unitIds.get(unit);

          if (!id) {
            id = this.nextUnitId++;
            this.unitIds.set(unit, id);
          }

          this.unitsById.set(id, unit);
          return id;
        }

        static canUseWorker() {
          if (!this.useWorker) return false;
          if (this.workerFailed) return false;

          if (!this.worker) {
            this.createWorker();
          }

          return !!this.worker && this.workerReady;
        }

        static queueWorkerFind(finder) {
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

        static flushWorkerRequests() {
          if (!this.worker || !this.workerReady) {
            this.runPendingOnMainThread();
            return;
          }

          if (this.pendingFinders.length <= 0) return;
          var finders = this.pendingFinders.slice();
          this.pendingFinders.length = 0;
          var requests = [];

          for (var i = 0; i < finders.length; i++) {
            var finder = finders[i];
            if (!finder || !finder.canAcceptWorkerResult()) continue;
            if (!finder.unit || !finder.unit.agent) continue;
            var requestId = this.nextRequestId++;
            this.pendingRequestMap.set(requestId, finder);
            requests.push({
              requestId,
              unitId: finder.unitId,
              team: finder.team,
              x: finder.unit.agent.pos.x,
              z: finder.unit.agent.pos.z
            });
          }

          if (requests.length <= 0) return;
          var units = this.collectUnitSnapshot();

          try {
            this.worker.postMessage({
              type: 'findNearestBatch',
              seq: ++this.workerSeq,
              requests,
              units
            });
          } catch (err) {
            this.workerFailed = true;
            this.pendingRequestMap.clear();
            this.runFindersOnMainThread(finders);
          }
        }

        static runPendingOnMainThread() {
          var finders = this.pendingFinders.slice();
          this.pendingFinders.length = 0;
          this.runFindersOnMainThread(finders);
        }

        static runFindersOnMainThread(finders) {
          for (var i = 0; i < finders.length; i++) {
            var finder = finders[i];
            if (!finder || !finder.canAcceptWorkerResult()) continue;
            finder.findOnMainThread();
          }
        }

        static collectUnitSnapshot() {
          var result = [];
          this.appendUnitsToSnapshot(result, this.teamA, 0);
          this.appendUnitsToSnapshot(result, this.teamB, 1);
          return result;
        }

        static appendUnitsToSnapshot(result, units, team) {
          for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.agent) continue;
            if (!unit.props || unit.props.isDead()) continue;
            var id = this.getUnitId(unit);
            result.push({
              id,
              team,
              x: unit.agent.pos.x,
              z: unit.agent.pos.z
            });
          }
        }

        static applyWorkerResults(results) {
          for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var finder = this.pendingRequestMap.get(result.requestId);
            this.pendingRequestMap.delete(result.requestId);
            if (!finder || !finder.canAcceptWorkerResult()) continue;
            var target = this.unitsById.get(result.targetId);
            if (!target) continue;
            finder.unit.setEnemy(target);
          }
        }

        static createWorker() {
          if (typeof Worker === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
            this.workerFailed = true;
            return;
          }

          try {
            var blob = new Blob([this.workerSource()], {
              type: 'application/javascript'
            });
            var url = URL.createObjectURL(blob);
            this.worker = new Worker(url);
            URL.revokeObjectURL(url);

            this.worker.onmessage = event => {
              var data = event.data;
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

        static destroyWorker() {
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

        static workerSource() {
          return "\nvar ready = false;\n\nself.onmessage = function(event) {\n    var data = event.data;\n\n    if (!data) return;\n\n    if (data.type === 'findNearestBatch') {\n        var units = data.units || [];\n        var requests = data.requests || [];\n        var results = [];\n\n        for (var i = 0; i < requests.length; i++) {\n            var request = requests[i];\n            var bestId = 0;\n            var bestDist = Infinity;\n\n            for (var j = 0; j < units.length; j++) {\n                var unit = units[j];\n\n                if (!unit) continue;\n                if (unit.id === request.unitId) continue;\n                if (unit.team === request.team) continue;\n\n                var dx = unit.x - request.x;\n                var dz = unit.z - request.z;\n                var d = dx * dx + dz * dz;\n\n                if (d < bestDist) {\n                    bestDist = d;\n                    bestId = unit.id;\n                }\n            }\n\n            results.push({\n                requestId: request.requestId,\n                targetId: bestId\n            });\n        }\n\n        self.postMessage({\n            type: 'findNearestBatchResult',\n            seq: data.seq,\n            results: results\n        });\n    }\n};\n\nself.postMessage({ type: 'ready' });\n";
        }

      }, _class3.teamA = [], _class3.teamB = [], _class3.useWorker = true, _class3.worker = null, _class3.workerReady = false, _class3.workerFailed = false, _class3.workerSeq = 0, _class3.nextUnitId = 1, _class3.nextRequestId = 1, _class3.unitIds = new WeakMap(), _class3.unitsById = new Map(), _class3.pendingFinders = [], _class3.pendingRequestMap = new Map(), _class3.flushScheduled = false, _class3.activeFinderCount = 0, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8d18d6ca2526cfe501f560718511419625b950e4.js.map