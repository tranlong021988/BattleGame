System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Enum, Node, GameManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, PlayerLane, PlayerArmyController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
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
      Enum = _cc.Enum;
      Node = _cc.Node;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "89dbfa88XVPOLKVdWWhpYrY", "PlayerArmyController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Enum', 'Event', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PlayerLane", PlayerLane = /*#__PURE__*/function (PlayerLane) {
        PlayerLane[PlayerLane["Left"] = 0] = "Left";
        PlayerLane[PlayerLane["Mid"] = 1] = "Mid";
        PlayerLane[PlayerLane["Right"] = 2] = "Right";
        return PlayerLane;
      }({}));

      Enum(PlayerLane);

      _export("PlayerArmyController", PlayerArmyController = (_dec = ccclass('PlayerArmyController'), _dec2 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec3 = property({
        min: 0,
        max: 1,
        step: 1
      }), _dec4 = property({
        type: PlayerLane
      }), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec(_class = (_class2 = class PlayerArmyController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gameManager", _descriptor, this);

          _initializerDefineProperty(this, "team", _descriptor2, this);

          _initializerDefineProperty(this, "defaultLane", _descriptor3, this);

          _initializerDefineProperty(this, "leftSelected", _descriptor4, this);

          _initializerDefineProperty(this, "midSelected", _descriptor5, this);

          _initializerDefineProperty(this, "rightSelected", _descriptor6, this);

          this.selectedLaneId = PlayerLane.Mid;
        }

        onLoad() {
          this.setSelectedLane(this.defaultLane);
        }

        selectLane(_event, laneData) {
          const laneId = this.parseLaneId(laneData);

          if (laneId < 0) {
            console.warn(`[PlayerArmyController] Unknown lane: "${laneData}". ` + 'Use left, mid, right, 0, 1, or 2.');
            return;
          }

          this.setSelectedLane(laneId);
        }

        spawnUnit(_event, unitName) {
          var _this$gameManager;

          const manager = (_this$gameManager = this.gameManager) != null ? _this$gameManager : (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (!manager) {
            console.warn('[PlayerArmyController] GameManager is not assigned.');
            return;
          }

          const safeUnitName = (unitName != null ? unitName : '').trim();

          if (!safeUnitName) {
            console.warn('[PlayerArmyController] Unit name is empty.');
            return;
          }

          manager.spawnWaveByName(this.team, safeUnitName, this.selectedLaneId);
        }

        setSelectedLane(laneId) {
          const safeLaneId = Math.max(PlayerLane.Left, Math.min(PlayerLane.Right, Math.floor(laneId)));
          this.selectedLaneId = safeLaneId;

          if (this.leftSelected) {
            this.leftSelected.active = safeLaneId === PlayerLane.Left;
          }

          if (this.midSelected) {
            this.midSelected.active = safeLaneId === PlayerLane.Mid;
          }

          if (this.rightSelected) {
            this.rightSelected.active = safeLaneId === PlayerLane.Right;
          }
        }

        getSelectedLaneId() {
          return this.selectedLaneId;
        }

        parseLaneId(laneData) {
          const value = (laneData != null ? laneData : '').trim().toLowerCase();

          switch (value) {
            case 'left':
            case '0':
              return PlayerLane.Left;

            case 'mid':
            case 'middle':
            case '1':
              return PlayerLane.Mid;

            case 'right':
            case '2':
              return PlayerLane.Right;
          }

          return -1;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "team", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "defaultLane", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return PlayerLane.Mid;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "leftSelected", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "midSelected", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "rightSelected", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=eda245de96c070b06a601d49d9c9fcb6d664fcb2.js.map