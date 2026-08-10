System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Unit, UnitProps, CounterSettings, BattleCardModifier, _dec, _class, _class2, _descriptor, _descriptor2, _class3, _crd, ccclass, property, UnitBehavior;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUnit(extras) {
    _reporterNs.report("Unit", "./Unit", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitProps(extras) {
    _reporterNs.report("UnitProps", "./UnitProps", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCounterSettings(extras) {
    _reporterNs.report("CounterSettings", "./CounterSettings", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardModifier(extras) {
    _reporterNs.report("BattleCardModifier", "./BattleCardDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleCardModifiers(extras) {
    _reporterNs.report("BattleCardModifiers", "./BattleCardRuntime", _context.meta, extras);
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
    }, function (_unresolved_3) {
      UnitProps = _unresolved_3.UnitProps;
    }, function (_unresolved_4) {
      CounterSettings = _unresolved_4.CounterSettings;
    }, function (_unresolved_5) {
      BattleCardModifier = _unresolved_5.BattleCardModifier;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "447a2LC9oVLFLwtjUuBODgj", "UnitBehavior", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitBehavior", UnitBehavior = (_dec = ccclass('UnitBehavior'), _dec(_class = (_class2 = (_class3 = class UnitBehavior extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "attackIntervalMin", _descriptor, this);

          _initializerDefineProperty(this, "attackIntervalMax", _descriptor2, this);

          this.gameManager = null;
          this.unit = void 0;
          this.props = void 0;
          this.attackTimer = 0;
          this.nextAttackInterval = 1;
        }

        onLoad() {
          this.unit = this.getComponent(_crd && Unit === void 0 ? (_reportPossibleCrUseOfUnit({
            error: Error()
          }), Unit) : Unit);
          this.props = this.getComponent(_crd && UnitProps === void 0 ? (_reportPossibleCrUseOfUnitProps({
            error: Error()
          }), UnitProps) : UnitProps);
        }

        resetForSpawn() {
          this.attackTimer = 0;
          this.randomizeNextAttackInterval();
        }

        configureAttackInterval(minInterval, maxInterval) {
          this.attackIntervalMin = Math.max(0.05, minInterval);
          this.attackIntervalMax = Math.max(this.attackIntervalMin, maxInterval);
        }

        resetForDespawn() {
          this.attackTimer = 0;
        }

        update(deltaTime) {
          if (!this.unit || !this.props) return;
          if (!this.node.activeInHierarchy) return;
          if (this.props.isDead()) return;
          if (!this.unit.onBusy) return;
          var enemy = this.unit.getValidEnemyTarget();

          if (!enemy) {
            this.unit.clearEnemy();
            return;
          }

          if (this.unit.isRangedCombatRepositioning()) {
            return;
          }

          this.attackTimer += deltaTime;

          if (this.attackTimer < this.nextAttackInterval) {
            return;
          }

          if (!this.unit.isCurrentEnemyInAttackRange()) {
            this.unit.disengageCurrentEnemyForChase();
            return;
          }

          this.attackTimer = 0;
          this.randomizeNextAttackInterval();
          var gm = this.gameManager;
          var attackBatchId = gm && gm.enableBattleTelemetry ? UnitBehavior.nextAttackBatchId++ : -1;
          this.unit.consumeAttackRangeCardBudget(enemy);

          if (!gm) {
            this.dealDamageToEnemy(enemy, attackBatchId);
            return;
          }

          gm.beginCombatResolution();

          try {
            this.dealDamageToEnemy(enemy, attackBatchId);
          } finally {
            gm.endCombatResolution();
          }
        }

        dealDamageToEnemy(enemy, attackBatchId) {
          var gm = this.gameManager;
          var attackModifiers = gm ? gm.getBattleCardModifiers(this.unit.team, this.props.family, enemy.props.family) : null;
          this.applyDamageToEnemy(enemy, false, attackBatchId, attackModifiers);
          var usedExpandedRadius = this.dealAreaDamageAround(enemy, attackBatchId, attackModifiers);
          this.finishDamagedEnemy(enemy);

          if (gm) {
            gm.consumeBattleCardModifier(this.unit.team, this.props.family, (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).DamagePercent, enemy.props.family);

            if (usedExpandedRadius) {
              gm.consumeBattleCardModifier(this.unit.team, this.props.family, (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
                error: Error()
              }), BattleCardModifier) : BattleCardModifier).DamageRadiusPercent, enemy.props.family);
            }
          }
        }

        applyDamageToEnemy(enemy, isAreaDamage, attackBatchId, attackerModifiers) {
          var counter = (_crd && CounterSettings === void 0 ? (_reportPossibleCrUseOfCounterSettings({
            error: Error()
          }), CounterSettings) : CounterSettings).instance;
          var gm = this.gameManager;
          var defenderModifiers = gm ? gm.getBattleCardModifiers(enemy.team, enemy.props.family, this.props.family) : null;
          var attackDamage = Math.max(0, this.props.damage * (attackerModifiers ? attackerModifiers.damageMultiplier : 1));
          var defense = Math.max(0, enemy.props.defense + (defenderModifiers ? defenderModifiers.defenseFlat : 0));
          var baseDefense = Math.max(0, enemy.props.defense);
          var finalDamage = attackDamage;
          var damageWithoutDefenseCard = attackDamage;
          var isCounterDamage = false;
          var configuredDamageMul = 1;

          if (counter && !this.unit.isHero && !enemy.isHero) {
            configuredDamageMul = counter.getDamageMultiplier(this.props.family, enemy.props.family);
            var damageMul = defenderModifiers != null && defenderModifiers.counterImmune ? 1 : configuredDamageMul;
            isCounterDamage = damageMul > 1.0001;
            finalDamage = Math.max(1, attackDamage - defense) * damageMul;
            damageWithoutDefenseCard = Math.max(1, attackDamage - baseDefense) * damageMul;
          } else {
            finalDamage = Math.max(1, attackDamage - defense);
            damageWithoutDefenseCard = Math.max(1, attackDamage - baseDefense);
          }

          var actualDamage = Math.min(Math.max(0, enemy.props.health), Math.max(0, finalDamage));

          if (gm) {
            gm.reportDamage(this.unit, enemy, finalDamage, actualDamage, isCounterDamage, isAreaDamage, attackBatchId);
          }

          enemy.props.takeDamage(finalDamage);
          if (!gm || !defenderModifiers) return;

          if (defenderModifiers.defenseFlat > 0 && finalDamage + 0.0001 < damageWithoutDefenseCard) {
            gm.consumeBattleCardModifier(enemy.team, enemy.props.family, (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).DefenseFlat, this.props.family);
          }

          if (defenderModifiers.counterImmune && configuredDamageMul > 1.0001) {
            gm.consumeBattleCardModifier(enemy.team, enemy.props.family, (_crd && BattleCardModifier === void 0 ? (_reportPossibleCrUseOfBattleCardModifier({
              error: Error()
            }), BattleCardModifier) : BattleCardModifier).CounterImmunity, this.props.family);
          }
        }

        finishDamagedEnemy(enemy) {
          if (!enemy || !enemy.props) return;

          if (!enemy.props.isDead()) {
            enemy.reactToAttacker(this.unit);
            return;
          }

          var gm = this.gameManager;
          var wasCurrentTarget = this.unit.getValidEnemyTarget() === enemy;

          if (gm) {
            gm.reportKill(this.unit, enemy);
            gm.despawnUnit(enemy);
          }

          if (wasCurrentTarget) {
            this.unit.clearEnemy();
          }
        }

        dealAreaDamageAround(primaryTarget, attackBatchId, attackerModifiers) {
          var baseDamageRadius = Math.max(0, this.props.damageRadius);
          var damageRadius = Math.max(0, baseDamageRadius * (attackerModifiers ? attackerModifiers.damageRadiusMultiplier : 1));
          if (damageRadius <= 0) return false;
          if (!primaryTarget || !primaryTarget.agent) return false;
          var gm = this.gameManager;
          if (!gm) return false;
          var expandedRadius = damageRadius > baseDamageRadius + 0.0001;
          var usedExpandedRadius = false;
          var maxEnemyRadius = gm.spatialGrid ? gm.spatialGrid.getMaxEnemyRadius(this.unit.team) : primaryTarget.radius;
          var queryRadius = Math.max(0, primaryTarget.radius) + damageRadius + Math.max(0, maxEnemyRadius);
          var enemies = gm.spatialGrid ? gm.spatialGrid.queryEnemies(this.unit.team, primaryTarget.agent.pos.x, primaryTarget.agent.pos.z, queryRadius) : this.getEnemyListFallback(gm);
          var centerX = primaryTarget.agent.pos.x;
          var centerZ = primaryTarget.agent.pos.z;

          for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            if (!enemy || enemy === primaryTarget) continue;
            if (!enemy.agent) continue;
            if (!enemy.props || enemy.props.isDead()) continue;
            var effectiveRadius = Math.max(0, primaryTarget.radius) + damageRadius + Math.max(0, enemy.radius);
            var baseEffectiveRadius = Math.max(0, primaryTarget.radius) + baseDamageRadius + Math.max(0, enemy.radius);
            var dx = enemy.agent.pos.x - centerX;
            var dz = enemy.agent.pos.z - centerZ;

            if (dx * dx + dz * dz > effectiveRadius * effectiveRadius) {
              continue;
            }

            this.applyDamageToEnemy(enemy, true, attackBatchId, attackerModifiers);
            this.finishDamagedEnemy(enemy);

            if (expandedRadius && dx * dx + dz * dz > baseEffectiveRadius * baseEffectiveRadius) {
              usedExpandedRadius = true;
            }
          }

          return usedExpandedRadius;
        }

        getEnemyListFallback(gm) {
          return this.unit.team === 0 ? gm.teamB : gm.teamA;
        }

        randomizeNextAttackInterval() {
          var min = Math.max(0.05, this.attackIntervalMin);
          var max = Math.max(min, this.attackIntervalMax);
          this.nextAttackInterval = min + Math.random() * (max - min);
        }

      }, _class3.nextAttackBatchId = 1, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "attackIntervalMin", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.8;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "attackIntervalMax", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=188da626dc7963ce445b4ca496e30fc683d92647.js.map