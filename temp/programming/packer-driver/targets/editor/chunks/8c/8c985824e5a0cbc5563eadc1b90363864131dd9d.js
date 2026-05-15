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
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "updateInterval", _descriptor, this);

          this.unit = void 0;
          this.team = 0;
          this.frame = 0;
          this.updateOffset = 0;
        }

        onLoad() {
          this.unit = this.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);
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

          if ((this.frame + this.updateOffset) % this.updateInterval !== 0) {
            return;
          }

          if (this.unit.enemy && this.unit.enemy.node.activeInHierarchy && this.unit.enemy.agent && this.unit.enemy.props && !this.unit.enemy.props.isDead()) {
            return;
          }

          const enemies = this.team === 0 ? EnemyFinder.teamB : EnemyFinder.teamA;
          let best = null;
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

      }, _class3.teamA = [], _class3.teamB = [], _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 30;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8c985824e5a0cbc5563eadc1b90363864131dd9d.js.map