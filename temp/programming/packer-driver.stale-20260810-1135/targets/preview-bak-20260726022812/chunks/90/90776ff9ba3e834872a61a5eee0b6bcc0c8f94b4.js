System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, Unit, UnitProps, UnitBehavior, _dec, _class, _crd, ccclass, UnitSpawner;

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitProps(extras) {
    _reporterNs.report("UnitProps", "./UnitProps", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitBehavior(extras) {
    _reporterNs.report("UnitBehavior", "./UnitBehavior", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitFamily(extras) {
    _reporterNs.report("UnitFamily", "./BattleTypes", _context.meta, extras);
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
      UnitProps = _unresolved_3.UnitProps;
    }, function (_unresolved_4) {
      UnitBehavior = _unresolved_4.UnitBehavior;
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
          this.sim = null;
          this.pools = new Map();
        }

        init(sim) {
          this.sim = sim;
        }

        onDestroy() {
          this.clearPool();
          this.sim = null;
        }

        prewarm(prefab, count, parent) {
          var pool = this.getPool(prefab);
          var safeCount = Math.max(0, Math.floor(count));

          for (var i = 0; i < safeCount; i++) {
            var node = instantiate(prefab);
            parent.addChild(node);
            node.active = false;
            pool.push(node);
          }
        }

        getPoolCount(prefab) {
          return this.getPool(prefab).length;
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

        spawnUnit(prefab, unitTypeName, family, tier, pos, team, parent, maxSpeed, canBePush, canBePassedThroughByForwardAlly, attackRange, attackIntervalMin, attackIntervalMax, health, damage, damageRadius, defense) {
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
          var props = node.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);
          var behavior = node.getComponent(_crd && UnitBehavior === void 0 ? (_reportPossibleCrUseOfUnitBehavior({
            error: Error()
          }), UnitBehavior) : UnitBehavior);
          unit.moveSpeed = maxSpeed;
          unit.canBePush = canBePush;
          unit.canBePassedThroughByForwardAlly = canBePassedThroughByForwardAlly;
          unit.attackRange = Math.max(0, attackRange);
          props.family = family;
          props.tier = Math.max(1, Math.min(3, Math.floor(tier)));
          props.maxHealth = health;
          props.damage = damage;
          props.damageRadius = Math.max(0, damageRadius);
          props.defense = defense;
          props.resetForSpawn();
          var forwardX = 0;
          var forwardZ = team === 0 ? 1 : -1;
          unit.clearEnemy();
          unit.init(this.sim, team, unitTypeName, forwardX, forwardZ);

          if (behavior) {
            behavior.configureAttackInterval(attackIntervalMin, attackIntervalMax);
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

          this.removeAgentFromSimulator(unit);
          unit.resetForDespawn();
          node.active = false;
          var pool = this.getPool(prefab);

          if (pool.indexOf(node) < 0) {
            pool.push(node);
          }
        }

        removeAgentFromSimulator(unit) {
          if (!this.sim || !unit.agent) return;

          if (typeof this.sim.removeAgent === 'function') {
            this.sim.removeAgent(unit.agent);
            return;
          }

          if (this.sim.agents && Array.isArray(this.sim.agents)) {
            var idx = this.sim.agents.indexOf(unit.agent);

            if (idx >= 0) {
              this.sim.agents.splice(idx, 1);
            }
          }
        }

        clearPool() {
          this.pools.forEach(pool => {
            for (var i = 0; i < pool.length; i++) {
              var node = pool[i];

              if (node && node.isValid) {
                node.destroy();
              }
            }

            pool.length = 0;
          });
          this.pools.clear();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=90776ff9ba3e834872a61a5eee0b6bcc0c8f94b4.js.map