System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, game, _dec, _class, _class2, _crd, ccclass, BattleSceneName, MainGameFlow;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      director = _cc.director;
      game = _cc.game;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b81f7eEHgxNbZ4jPk4AtNtn", "MainGameFlow", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'game']);

      ({
        ccclass
      } = _decorator);
      BattleSceneName = 'Battle';

      _export("MainGameFlow", MainGameFlow = (_dec = ccclass('MainGameFlow'), _dec(_class = (_class2 = class MainGameFlow extends Component {
        constructor(...args) {
          super(...args);
          this.battleLoadInProgress = false;
          this.battleResetPending = false;
        }

        onLoad() {
          if (MainGameFlow.instance && MainGameFlow.instance !== this) {
            this.node.destroy();
            return;
          }

          MainGameFlow.instance = this;
          game.addPersistRootNode(this.node);
        }

        start() {
          this.loadBattle(false);
        }

        onDestroy() {
          if (MainGameFlow.instance === this) {
            MainGameFlow.instance = null;
          }
        }

        static restartBattle() {
          var _MainGameFlow$instanc, _MainGameFlow$instanc2;

          return (_MainGameFlow$instanc = (_MainGameFlow$instanc2 = MainGameFlow.instance) == null ? void 0 : _MainGameFlow$instanc2.loadBattle(true)) != null ? _MainGameFlow$instanc : false;
        }

        static isBattleResetPending() {
          var _MainGameFlow$instanc3;

          return !!((_MainGameFlow$instanc3 = MainGameFlow.instance) != null && _MainGameFlow$instanc3.battleResetPending);
        }

        static completeBattleReset() {
          if (MainGameFlow.instance) {
            MainGameFlow.instance.battleResetPending = false;
          }
        }

        loadBattle(isReset) {
          if (this.battleLoadInProgress) return false;
          this.battleLoadInProgress = true;
          this.battleResetPending = isReset;

          try {
            director.loadScene(BattleSceneName, error => {
              this.battleLoadInProgress = false;
              if (!error) return;
              this.battleResetPending = false;
              console.error('[MainGameFlow] failed to load Battle scene.', error);
            });
            return true;
          } catch (error) {
            this.battleLoadInProgress = false;
            this.battleResetPending = false;
            console.error('[MainGameFlow] could not start Battle scene load.', error);
            return false;
          }
        }

      }, _class2.instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7571fbdd88a050cb430db32e65f032ff7891ece8.js.map