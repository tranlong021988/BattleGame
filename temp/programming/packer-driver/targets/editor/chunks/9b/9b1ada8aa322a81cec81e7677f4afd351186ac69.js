System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Layers, Node, Sprite, SpriteFrame, UITransform, GameManager, UnitType, BattleInformationIconItem, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class4, _class5, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _crd, ccclass, property, UnitIconInfo, BattleInformationPanel;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleWave(extras) {
    _reporterNs.report("BattleWave", "./BattleWave", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUnitType(extras) {
    _reporterNs.report("UnitType", "./BattleTypes", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBattleInformationIconItem(extras) {
    _reporterNs.report("BattleInformationIconItem", "./BattleInformationIconItem", _context.meta, extras);
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
      Layers = _cc.Layers;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      UnitType = _unresolved_3.UnitType;
    }, function (_unresolved_4) {
      BattleInformationIconItem = _unresolved_4.BattleInformationIconItem;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8a2ccFb9zZCuJLB7Ma3qoRQ", "BattleInformationPanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Layers', 'Node', 'Sprite', 'SpriteFrame', 'UITransform']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UnitIconInfo", UnitIconInfo = (_dec = ccclass('UnitIconInfo'), _dec2 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec3 = property(SpriteFrame), _dec(_class = (_class2 = class UnitIconInfo {
        constructor() {
          _initializerDefineProperty(this, "unitType", _descriptor, this);

          _initializerDefineProperty(this, "spriteFrame", _descriptor2, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "unitType", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spriteFrame", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _export("BattleInformationPanel", BattleInformationPanel = (_dec4 = ccclass('BattleInformationPanel'), _dec5 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property({
        type: [UnitIconInfo]
      }), _dec9 = property({
        type: [UnitIconInfo]
      }), _dec4(_class4 = (_class5 = class BattleInformationPanel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gameManager", _descriptor3, this);

          _initializerDefineProperty(this, "teamAIconRoot", _descriptor4, this);

          _initializerDefineProperty(this, "teamBIconRoot", _descriptor5, this);

          _initializerDefineProperty(this, "teamAIcons", _descriptor6, this);

          _initializerDefineProperty(this, "teamBIcons", _descriptor7, this);

          _initializerDefineProperty(this, "autoFindGameManager", _descriptor8, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor9, this);

          _initializerDefineProperty(this, "iconWidth", _descriptor10, this);

          _initializerDefineProperty(this, "iconHeight", _descriptor11, this);

          _initializerDefineProperty(this, "teamAAnchorY", _descriptor12, this);

          _initializerDefineProperty(this, "teamBAnchorY", _descriptor13, this);

          _initializerDefineProperty(this, "prewarmIconCount", _descriptor14, this);

          _initializerDefineProperty(this, "maxPoolSize", _descriptor15, this);

          this.records = new Map();
          this.pool = [];
          this.timer = 0;
          this.time = 0;
        }

        start() {
          if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;
          }

          this.clearAllIcons();
          this.prewarmPool();
        }

        update(deltaTime) {
          this.time += deltaTime;
          this.timer += deltaTime;

          if (this.timer < this.updateInterval) {
            this.updateFlashOnly();
            return;
          }

          this.timer = 0;
          this.syncWithBattleWaves();
          this.updateAllIcons();
        }

        prewarmPool() {
          const count = Math.max(0, Math.floor(this.prewarmIconCount));

          for (let i = 0; i < count; i++) {
            const node = this.createIconNode();
            node.active = false;
            this.node.addChild(node);
            this.pool.push(node);
          }
        }

        syncWithBattleWaves() {
          if (!this.gameManager) return;
          const waves = this.gameManager.waves;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!wave) continue;
            if (wave.isDead()) continue;
            if (this.records.has(wave.id)) continue;
            this.createIconForWave(wave);
          }
        }

        createIconForWave(wave) {
          const root = wave.team === 0 ? this.teamAIconRoot : this.teamBIconRoot;

          if (!root) {
            console.warn('[BattleInformationPanel] Missing icon root for team:', wave.team);
            return;
          }

          const node = this.getIconNodeFromPool();
          node.name = `wave-icon-${wave.id}-${wave.unitName}`;
          node.layer = Layers.Enum.UI_2D;
          node.active = true;
          root.addChild(node);
          const item = node.getComponent(_crd && BattleInformationIconItem === void 0 ? (_reportPossibleCrUseOfBattleInformationIconItem({
            error: Error()
          }), BattleInformationIconItem) : BattleInformationIconItem);
          const spriteFrame = this.getSpriteFrame(wave.team, wave.unitType);
          const anchorY = wave.team === 0 ? this.teamAAnchorY : this.teamBAnchorY;
          item.setup(spriteFrame, this.iconWidth, this.iconHeight, anchorY);
          this.records.set(wave.id, {
            wave,
            item,
            node
          });
        }

        getIconNodeFromPool() {
          if (this.pool.length > 0) {
            return this.pool.pop();
          }

          return this.createIconNode();
        }

        createIconNode() {
          const node = new Node('wave-icon');
          node.layer = Layers.Enum.UI_2D;
          const ui = node.addComponent(UITransform);
          ui.setContentSize(this.iconWidth, this.iconHeight);
          ui.setAnchorPoint(0.5, 0.5);
          const sprite = node.addComponent(Sprite);
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          node.addComponent(_crd && BattleInformationIconItem === void 0 ? (_reportPossibleCrUseOfBattleInformationIconItem({
            error: Error()
          }), BattleInformationIconItem) : BattleInformationIconItem);
          return node;
        }

        updateAllIcons() {
          const removeIds = [];
          this.records.forEach((record, waveId) => {
            const wave = record.wave;

            if (!wave || wave.isDead()) {
              record.item.setAliveRatio(0);
              removeIds.push(waveId);
              return;
            }

            const aliveRatio = wave.getAliveRatio();
            record.item.setAliveRatio(aliveRatio);
            record.item.updateEngageVisual(wave.hasEngaged(), this.time);
          });

          for (let i = 0; i < removeIds.length; i++) {
            this.releaseIcon(removeIds[i]);
          }
        }

        updateFlashOnly() {
          this.records.forEach(record => {
            const wave = record.wave;
            if (!wave || wave.isDead()) return;
            record.item.updateEngageVisual(wave.hasEngaged(), this.time);
          });
        }

        releaseIcon(waveId) {
          const record = this.records.get(waveId);
          if (!record) return;
          record.item.resetVisual();
          record.node.removeFromParent();
          record.node.active = false;
          record.node.name = 'wave-icon-pooled';

          if (this.pool.length < this.maxPoolSize) {
            this.node.addChild(record.node);
            this.pool.push(record.node);
          } else {
            record.node.destroy();
          }

          this.records.delete(waveId);
        }

        clearAllIcons() {
          this.records.forEach(record => {
            record.item.resetVisual();
            record.node.removeFromParent();
            record.node.active = false;

            if (this.pool.length < this.maxPoolSize) {
              this.node.addChild(record.node);
              this.pool.push(record.node);
            } else {
              record.node.destroy();
            }
          });
          this.records.clear();

          if (this.teamAIconRoot) {
            this.teamAIconRoot.removeAllChildren();
          }

          if (this.teamBIconRoot) {
            this.teamBIconRoot.removeAllChildren();
          }
        }

        getSpriteFrame(team, unitType) {
          const list = team === 0 ? this.teamAIcons : this.teamBIcons;

          for (let i = 0; i < list.length; i++) {
            const info = list[i];

            if (info.unitType === unitType) {
              return info.spriteFrame;
            }
          }

          console.warn('[BattleInformationPanel] Missing icon for team/unitType:', team, unitType);
          return null;
        }

      }, (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "gameManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "teamAIconRoot", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "teamBIconRoot", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "teamAIcons", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "teamBIcons", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "autoFindGameManager", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "iconWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 40;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "iconHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 40;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "teamAAnchorY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "teamBAnchorY", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "prewarmIconCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 32;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "maxPoolSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 128;
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9b1ada8aa322a81cec81e7677f4afd351186ac69.js.map