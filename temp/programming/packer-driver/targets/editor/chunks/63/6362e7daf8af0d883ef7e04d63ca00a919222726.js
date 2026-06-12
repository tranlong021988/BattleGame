System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Layers, Layout, Node, Sprite, SpriteFrame, Tween, tween, UITransform, Vec3, GameManager, UnitType, BattleInformationIconItem, BattleCinematicCameraController, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class4, _class5, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _crd, ccclass, property, MiniMapUnitIconInfo, TrueMiniMapPanel;

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

  function _reportPossibleCrUseOfBattleCinematicCameraController(extras) {
    _reporterNs.report("BattleCinematicCameraController", "./BattleCinematicCameraController", _context.meta, extras);
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
      Layout = _cc.Layout;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      Tween = _cc.Tween;
      tween = _cc.tween;
      UITransform = _cc.UITransform;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }, function (_unresolved_3) {
      UnitType = _unresolved_3.UnitType;
    }, function (_unresolved_4) {
      BattleInformationIconItem = _unresolved_4.BattleInformationIconItem;
    }, function (_unresolved_5) {
      BattleCinematicCameraController = _unresolved_5.BattleCinematicCameraController;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7f28eHPxddG5r2d0aBU9xYV", "TrueMiniMapPanel", undefined);

      __checkObsolete__(['_decorator', 'Component', 'EventTouch', 'Layers', 'Layout', 'Node', 'Sprite', 'SpriteFrame', 'Tween', 'tween', 'UITransform', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MiniMapUnitIconInfo", MiniMapUnitIconInfo = (_dec = ccclass('MiniMapUnitIconInfo'), _dec2 = property({
        type: _crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
          error: Error()
        }), UnitType) : UnitType
      }), _dec3 = property(SpriteFrame), _dec(_class = (_class2 = class MiniMapUnitIconInfo {
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

      _export("TrueMiniMapPanel", TrueMiniMapPanel = (_dec4 = ccclass('TrueMiniMapPanel'), _dec5 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec6 = property(_crd && BattleCinematicCameraController === void 0 ? (_reportPossibleCrUseOfBattleCinematicCameraController({
        error: Error()
      }), BattleCinematicCameraController) : BattleCinematicCameraController), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property({
        type: [MiniMapUnitIconInfo]
      }), _dec11 = property({
        type: [MiniMapUnitIconInfo]
      }), _dec4(_class4 = (_class5 = class TrueMiniMapPanel extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gameManager", _descriptor3, this);

          _initializerDefineProperty(this, "cinematicController", _descriptor4, this);

          _initializerDefineProperty(this, "background", _descriptor5, this);

          _initializerDefineProperty(this, "teamAIconRoot", _descriptor6, this);

          _initializerDefineProperty(this, "teamBIconRoot", _descriptor7, this);

          _initializerDefineProperty(this, "teamAIcons", _descriptor8, this);

          _initializerDefineProperty(this, "teamBIcons", _descriptor9, this);

          _initializerDefineProperty(this, "autoFindGameManager", _descriptor10, this);

          _initializerDefineProperty(this, "disableIconRootLayout", _descriptor11, this);

          _initializerDefineProperty(this, "worldToMiniMapScale", _descriptor12, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor13, this);

          _initializerDefineProperty(this, "smoothDampTime", _descriptor14, this);

          _initializerDefineProperty(this, "tweenScaleDuration", _descriptor15, this);

          _initializerDefineProperty(this, "iconWidth", _descriptor16, this);

          _initializerDefineProperty(this, "iconHeight", _descriptor17, this);

          _initializerDefineProperty(this, "prewarmIconCount", _descriptor18, this);

          _initializerDefineProperty(this, "maxPoolSize", _descriptor19, this);

          _initializerDefineProperty(this, "clampIconToMapBounds", _descriptor20, this);

          _initializerDefineProperty(this, "invertXAxis", _descriptor21, this);

          _initializerDefineProperty(this, "invertZAxis", _descriptor22, this);

          _initializerDefineProperty(this, "showAliveRatio", _descriptor23, this);

          _initializerDefineProperty(this, "freezeDyingWavePositionAliveCount", _descriptor24, this);

          _initializerDefineProperty(this, "enableIconClickFocus", _descriptor25, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor26, this);

          this.records = new Map();
          this.pool = [];
          this.mapWidth = 0;
          this.mapHeight = 0;
          this.timer = 0;
          this.time = 0;
          this.tempPosition = new Vec3();
          this.tempWorldPosition = new Vec3();
        }

        start() {
          if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;
          }

          this.prepareIconRoots();
          this.configureMapSize();
          this.clearAllIcons();
          this.prewarmPool();
        }

        onDestroy() {
          this.destroyAllIcons();
        }

        update(deltaTime) {
          this.time += deltaTime;
          this.timer += deltaTime;

          if (this.timer >= this.updateInterval) {
            this.timer = 0;
            this.prepareIconRoots();
            this.configureMapSize();
            this.syncWithBattleWaves();
            this.updateTargetsAndState();
          }

          this.releaseDeadIcons();
          this.updateIconPositions(deltaTime);
          this.updateFlashOnly();
        }

        configureMapSize() {
          if (!this.gameManager) {
            return;
          }

          const scale = Math.max(0.001, this.worldToMiniMapScale);
          this.mapWidth = Math.max(1, (this.gameManager.battleMaxX - this.gameManager.battleMinX) * scale);
          this.mapHeight = Math.max(1, (this.gameManager.battleMaxZ - this.gameManager.battleMinZ) * scale);
          this.setNodeSize(this.node, this.mapWidth, this.mapHeight);

          if (this.background) {
            this.setNodeSize(this.background, this.mapWidth, this.mapHeight);
          }

          if (this.teamAIconRoot) {
            this.setNodeSize(this.teamAIconRoot, this.mapWidth, this.mapHeight);
          }

          if (this.teamBIconRoot) {
            this.setNodeSize(this.teamBIconRoot, this.mapWidth, this.mapHeight);
          }
        }

        prepareIconRoots() {
          this.prepareIconRoot(this.teamAIconRoot);
          this.prepareIconRoot(this.teamBIconRoot);
        }

        prepareIconRoot(root) {
          if (!root) {
            return;
          }

          root.setPosition(0, 0, 0);

          if (!this.disableIconRootLayout) {
            return;
          }

          const layout = root.getComponent(Layout);

          if (layout) {
            layout.enabled = false;
          }
        }

        setNodeSize(node, width, height) {
          let ui = node.getComponent(UITransform);

          if (!ui) {
            ui = node.addComponent(UITransform);
          }

          ui.setContentSize(width, height);
          ui.setAnchorPoint(0.5, 0.5);
        }

        syncWithBattleWaves() {
          if (!this.gameManager) {
            return;
          }

          const waves = this.gameManager.waves;

          for (let i = 0; i < waves.length; i++) {
            const wave = waves[i];
            if (!wave) continue;
            if (wave.isDead()) continue;

            if (this.records.has(wave.id)) {
              continue;
            }

            if (!this.tryGetWaveWorldPosition(wave, this.tempWorldPosition)) {
              continue;
            }

            this.createIconForWave(wave);
          }
        }

        createIconForWave(wave) {
          const root = wave.team === 0 ? this.teamAIconRoot : this.teamBIconRoot;

          if (!root) {
            return;
          }

          const node = this.getIconNodeFromPool();
          Tween.stopAllByTarget(node);
          node.active = false;
          node.layer = Layers.Enum.UI_2D;
          node.name = `mini-map-wave-${wave.id}`;
          this.clearIconEvents(node);

          if (this.enableIconClickFocus && this.cinematicController) {
            node.on(Node.EventType.TOUCH_START, event => {
              var _this$cinematicContro;

              (_this$cinematicContro = this.cinematicController) == null || _this$cinematicContro.suppressExitTap();
              this.stopTouchPropagation(event);
            }, this);
            node.on(Node.EventType.TOUCH_END, event => {
              var _this$cinematicContro2, _this$cinematicContro3;

              (_this$cinematicContro2 = this.cinematicController) == null || _this$cinematicContro2.suppressExitTap();
              (_this$cinematicContro3 = this.cinematicController) == null || _this$cinematicContro3.focusWave(wave);
              this.stopTouchPropagation(event);
            }, this);
          }

          const item = node.getComponent(_crd && BattleInformationIconItem === void 0 ? (_reportPossibleCrUseOfBattleInformationIconItem({
            error: Error()
          }), BattleInformationIconItem) : BattleInformationIconItem);
          item.setup(this.getSpriteFrame(wave.team, wave.unitType), this.iconWidth, this.iconHeight, 0.5);
          const target = this.getWaveMiniMapPosition(wave, null);
          root.addChild(node);
          node.setPosition(target);
          node.setScale(0, 0, 1);
          node.active = true;
          const record = {
            wave,
            item,
            node,
            targetPosition: target.clone(),
            velocity: new Vec3(),
            removing: false
          };
          this.records.set(wave.id, record);
          tween(node).to(this.getSafeTweenDuration(), {
            scale: new Vec3(1, 1, 1)
          }).start();
          this.log(`Create mini-map icon wave=${wave.id}`);
        }

        updateTargetsAndState() {
          const removeIds = [];
          this.records.forEach((record, waveId) => {
            const wave = record.wave;

            if (!wave || wave.isDead()) {
              removeIds.push(waveId);
              return;
            }

            record.targetPosition.set(this.getWaveMiniMapPosition(wave, record.targetPosition));
            record.item.setAliveRatio(this.showAliveRatio ? wave.getAliveRatio() : 1);
          });

          for (let i = 0; i < removeIds.length; i++) {
            this.releaseIcon(removeIds[i]);
          }
        }

        updateIconPositions(deltaTime) {
          this.records.forEach(record => {
            if (record.removing) {
              return;
            }

            if (this.smoothDampTime <= 0) {
              record.node.setPosition(record.targetPosition);
              return;
            }

            const current = record.node.position;
            this.tempPosition.set(this.smoothDamp(current.x, record.targetPosition.x, 'x', record, deltaTime), this.smoothDamp(current.y, record.targetPosition.y, 'y', record, deltaTime), 0);
            record.node.setPosition(this.tempPosition);
          });
        }

        releaseDeadIcons() {
          const removeIds = [];
          this.records.forEach((record, waveId) => {
            if (record.removing) {
              return;
            }

            const wave = record.wave;

            if (!wave || wave.isDead()) {
              removeIds.push(waveId);
            }
          });

          for (let i = 0; i < removeIds.length; i++) {
            this.releaseIcon(removeIds[i]);
          }
        }

        smoothDamp(current, target, axis, record, deltaTime) {
          const smoothTime = Math.max(0.0001, this.smoothDampTime);
          const omega = 2 / smoothTime;
          const x = omega * deltaTime;
          const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
          const change = current - target;
          const velocity = axis === 'x' ? record.velocity.x : record.velocity.y;
          const temp = (velocity + omega * change) * deltaTime;
          const nextVelocity = (velocity - omega * temp) * exp;

          if (axis === 'x') {
            record.velocity.x = nextVelocity;
          } else {
            record.velocity.y = nextVelocity;
          }

          return target + (change + temp) * exp;
        }

        updateFlashOnly() {
          this.records.forEach(record => {
            if (record.removing) {
              return;
            }

            const wave = record.wave;

            if (!wave || wave.isDead()) {
              return;
            }

            record.item.updateEngageVisual(wave.hasEngaged(), this.time);
          });
        }

        releaseIcon(waveId) {
          const record = this.records.get(waveId);

          if (!record) {
            return;
          }

          if (record.removing) {
            return;
          }

          record.removing = true;
          record.targetPosition.set(record.node.position);
          record.velocity.set(0, 0, 0);
          this.clearIconEvents(record.node);
          Tween.stopAllByTarget(record.node);
          this.records.delete(waveId);
          tween(record.node).to(this.getSafeTweenDuration(), {
            scale: new Vec3(0, 0, 1)
          }).call(() => {
            this.recycleIcon(record);
          }).start();
        }

        recycleIcon(record) {
          Tween.stopAllByTarget(record.node);
          record.item.resetVisual();
          record.node.removeFromParent();
          record.node.active = false;
          record.node.setPosition(0, 0, 0);
          record.node.setScale(0, 0, 1);

          if (this.pool.length < this.maxPoolSize) {
            this.node.addChild(record.node);
            this.pool.push(record.node);
          } else {
            record.node.destroy();
          }
        }

        getWaveMiniMapPosition(wave, fallback) {
          if (!this.gameManager) {
            return fallback ? fallback.clone() : new Vec3();
          }

          if (fallback && this.shouldFreezeDyingWavePosition(wave)) {
            return fallback.clone();
          }

          if (!this.tryGetWaveWorldPosition(wave, this.tempWorldPosition)) {
            return fallback ? fallback.clone() : new Vec3();
          }

          const minX = this.gameManager.battleMinX;
          const maxX = this.gameManager.battleMaxX;
          const minZ = this.gameManager.battleMinZ;
          const maxZ = this.gameManager.battleMaxZ;
          const width = Math.max(0.0001, maxX - minX);
          const height = Math.max(0.0001, maxZ - minZ);
          let x01 = (this.tempWorldPosition.x - minX) / width;
          let z01 = (this.tempWorldPosition.z - minZ) / height;

          if (this.clampIconToMapBounds) {
            x01 = this.clamp01(x01);
            z01 = this.clamp01(z01);
          }

          if (this.invertXAxis) {
            x01 = 1 - x01;
          }

          if (this.invertZAxis) {
            z01 = 1 - z01;
          }

          return new Vec3(x01 * this.mapWidth - this.mapWidth * 0.5, z01 * this.mapHeight - this.mapHeight * 0.5, 0);
        }

        shouldFreezeDyingWavePosition(wave) {
          const threshold = Math.max(0, Math.floor(this.freezeDyingWavePositionAliveCount));

          if (threshold <= 0) {
            return false;
          }

          if (wave.totalCount <= threshold) {
            return false;
          }

          return wave.getAliveCount() <= threshold;
        }

        tryGetWaveWorldPosition(wave, out) {
          let sumX = 0;
          let sumZ = 0;
          let count = 0;
          const units = wave.units;

          for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            if (!unit) continue;
            if (!unit.node.activeInHierarchy) continue;

            if (unit.agent) {
              sumX += unit.agent.pos.x;
              sumZ += unit.agent.pos.z;
              count++;
              continue;
            }

            const p = unit.node.worldPosition;
            sumX += p.x;
            sumZ += p.z;
            count++;
          }

          if (count <= 0) {
            return false;
          }

          out.set(sumX / count, 0, sumZ / count);
          return true;
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

        getIconNodeFromPool() {
          let node;

          if (this.pool.length > 0) {
            node = this.pool.pop();
          } else {
            node = this.createIconNode();
          }

          Tween.stopAllByTarget(node);
          this.clearIconEvents(node);
          node.removeFromParent();
          node.active = false;
          node.setPosition(0, 0, 0);
          node.setScale(0, 0, 1);
          return node;
        }

        createIconNode() {
          const node = new Node('mini-map-wave-icon');
          node.layer = Layers.Enum.UI_2D;
          const ui = node.addComponent(UITransform);
          ui.setContentSize(this.iconWidth, this.iconHeight);
          const sprite = node.addComponent(Sprite);
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          node.addComponent(_crd && BattleInformationIconItem === void 0 ? (_reportPossibleCrUseOfBattleInformationIconItem({
            error: Error()
          }), BattleInformationIconItem) : BattleInformationIconItem);
          return node;
        }

        clearAllIcons() {
          this.records.forEach(record => {
            this.clearIconEvents(record.node);
            record.item.resetVisual();
            record.node.removeFromParent();
            record.node.active = false;
            this.pool.push(record.node);
          });
          this.records.clear();
        }

        destroyAllIcons() {
          this.records.forEach(record => {
            this.clearIconEvents(record.node);
            record.node.destroy();
          });
          this.records.clear();

          for (let i = 0; i < this.pool.length; i++) {
            const node = this.pool[i];
            if (!node) continue;
            this.clearIconEvents(node);
            node.destroy();
          }

          this.pool.length = 0;
        }

        clearIconEvents(node) {
          node.off(Node.EventType.TOUCH_START);
          node.off(Node.EventType.TOUCH_END);
          node.off(Node.EventType.TOUCH_CANCEL);
        }

        stopTouchPropagation(event) {
          const e = event;

          if (typeof e.stopPropagation === 'function') {
            e.stopPropagation();
          }
        }

        getSpriteFrame(team, unitType) {
          const list = team === 0 ? this.teamAIcons : this.teamBIcons;
          const spriteFrame = this.findSpriteFrameInList(list, unitType);

          if (spriteFrame) {
            return spriteFrame;
          }

          return null;
        }

        findSpriteFrameInList(list, unitType) {
          for (let i = 0; i < list.length; i++) {
            const info = list[i];

            if (info.unitType === unitType) {
              return info.spriteFrame;
            }
          }

          return null;
        }

        clamp01(v) {
          return Math.max(0, Math.min(1, v));
        }

        getSafeTweenDuration() {
          return Math.max(0, this.tweenScaleDuration);
        }

        log(msg) {
          if (!this.enableDebugLog) {
            return;
          }

          console.log(`[TrueMiniMapPanel] ${msg}`);
        }

      }, (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "gameManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "cinematicController", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "background", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "teamAIconRoot", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "teamBIconRoot", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "teamAIcons", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "teamBIcons", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "autoFindGameManager", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "disableIconRootLayout", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "worldToMiniMapScale", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "smoothDampTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.12;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "tweenScaleDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.15;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "iconWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 18;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "iconHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 18;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "prewarmIconCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 32;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "maxPoolSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 128;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "clampIconToMapBounds", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "invertXAxis", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "invertZAxis", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "showAliveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "freezeDyingWavePositionAliveCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "enableIconClickFocus", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6362e7daf8af0d883ef7e04d63ca00a919222726.js.map