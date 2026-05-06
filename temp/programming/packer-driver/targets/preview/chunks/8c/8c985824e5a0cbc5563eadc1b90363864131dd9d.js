System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Unit, _dec, _class, _class2, _crd, ccclass, EnemyFinder;

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
        ccclass
      } = _decorator);

      _export("EnemyFinder", EnemyFinder = (_dec = ccclass('EnemyFinder'), _dec(_class = (_class2 = class EnemyFinder extends Component {
        constructor() {
          super(...arguments);
          this.team = 0;
          this.unit = void 0;
        }

        start() {
          this.unit = this.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);
        }

        setTeam(team) {
          this.team = team;
        }

        update() {
          if (!this.unit || !this.unit.agent || this.unit.onBusy) return;
          var enemies = this.team === 0 ? EnemyFinder.teamB : EnemyFinder.teamA;
          var best = null;
          var bestDist = Infinity;

          for (var e of enemies) {
            if (!e || !e.node.activeInHierarchy) continue;
            if (!e.agent) continue;
            if (e.onBusy) continue;
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

      }, _class2.teamA = [], _class2.teamB = [], _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8c985824e5a0cbc5563eadc1b90363864131dd9d.js.map