System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Unit, EnemyFinder, UnitProps, UnitBehavior, _dec, _class, _crd, ccclass, UnitSpawner;

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEnemyFinder(extras) {
    _reporterNs.report("EnemyFinder", "./EnemyFinder", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRVOSimulator(extras) {
    _reporterNs.report("RVOSimulator", "./rvo/RVO", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitProps(extras) {
    _reporterNs.report("UnitProps", "./UnitProps", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitBehavior(extras) {
    _reporterNs.report("UnitBehavior", "./UnitBehavior", _context.meta, extras);
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
      instantiate = _cc.instantiate;
    }, function (_unresolved_2) {
      Unit = _unresolved_2.Unit;
    }, function (_unresolved_3) {
      EnemyFinder = _unresolved_3.EnemyFinder;
    }, function (_unresolved_4) {
      UnitProps = _unresolved_4.UnitProps;
    }, function (_unresolved_5) {
      UnitBehavior = _unresolved_5.UnitBehavior;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6fc52Zc8uhHjbAeKgL1o3sV", "UnitSpawner", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Prefab', 'Node', 'instantiate', 'Vec3']);

      ({
        ccclass
      } = _decorator);

      _export("UnitSpawner", UnitSpawner = (_dec = ccclass('UnitSpawner'), _dec(_class = class UnitSpawner extends Component {
        constructor() {
          super(...arguments);
          this.sim = void 0;
          this.pools = new Map();
        }

        init(sim) {
          this.sim = sim;
        }

        getPool(prefab) {
          var key = prefab.uuid;
          var pool = this.pools.get(key);

          if (!pool) {
            pool = [];
            this.pools.set(key, pool);
          }

          return pool;
        }

        getNode(prefab) {
          var pool = this.getPool(prefab);

          if (pool.length > 0) {
            var node = pool.pop();
            node.active = true;
            return node;
          }

          return instantiate(prefab);
        }

        spawnUnit(prefab, pos, team, parent) {
          var node = this.getNode(prefab);

          if (node.parent !== parent) {
            parent.addChild(node);
          }

          node.setWorldPosition(pos);
          node.setRotationFromEuler(0, team === 0 ? 0 : 180, 0);
          node.active = true;
          var unit = node.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);
          var finder = node.getComponent(_crd && EnemyFinder === void 0 ? (_reportPossibleCrUseOfEnemyFinder({
            error: Error()
          }), EnemyFinder) : EnemyFinder);
          var props = node.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);
          var behavior = node.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior);
          props.resetForSpawn();
          unit.enemy = null;
          unit.onBusy = false;
          unit.init(this.sim);
          finder.resetForSpawn(team);

          if (behavior) {
            behavior.resetForSpawn();
          }

          return unit;
        }

        despawnUnit(unit, prefab) {
          if (!unit) return;
          var node = unit.node;
          var behavior = node.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior);

          if (behavior) {
            behavior.resetForDespawn();
          }

          if (unit.agent) {
            var idx = this.sim.agents.indexOf(unit.agent);

            if (idx >= 0) {
              this.sim.agents.splice(idx, 1);
            }
          }

          unit.resetForDespawn();
          node.active = false;
          var pool = this.getPool(prefab);

          if (pool.indexOf(node) < 0) {
            pool.push(node);
          }
        }

        clearPool() {
          this.pools.clear();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6c66322ce05674d0bc24e1c84c108eb1d87757af.js.map