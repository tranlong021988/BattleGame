System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Button, Color, Component, Enum, Node, Sprite, UITransform, GameManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class4, _class5, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _class6, _crd, ccclass, property, PlayerLane, PlayerUnitIconBinding, PlayerArmyController;

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
      Button = _cc.Button;
      Color = _cc.Color;
      Component = _cc.Component;
      Enum = _cc.Enum;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      UITransform = _cc.UITransform;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "89dbfa88XVPOLKVdWWhpYrY", "PlayerArmyController", undefined);

      __checkObsolete__(['_decorator', 'Button', 'Color', 'Component', 'Enum', 'Event', 'EventTouch', 'Node', 'Sprite', 'UITransform']);

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

      _export("PlayerUnitIconBinding", PlayerUnitIconBinding = (_dec = ccclass('PlayerUnitIconBinding'), _dec2 = property(Node), _dec3 = property({
        tooltip: 'Exact UnitPrefabEntry.name in BattleUnitDatabase, e.g. light_sword.'
      }), _dec(_class = (_class2 = class PlayerUnitIconBinding {
        constructor() {
          _initializerDefineProperty(this, "node", _descriptor, this);

          _initializerDefineProperty(this, "unitName", _descriptor2, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "node", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "unitName", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      })), _class2)) || _class));

      _export("PlayerArmyController", PlayerArmyController = (_dec4 = ccclass('PlayerArmyController'), _dec5 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec6 = property({
        min: 0,
        max: 1,
        step: 1
      }), _dec7 = property({
        type: PlayerLane
      }), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(Node), _dec11 = property({
        type: [PlayerUnitIconBinding]
      }), _dec12 = property(Node), _dec13 = property({
        min: 0
      }), _dec14 = property({
        min: 0
      }), _dec15 = property({
        min: 1
      }), _dec4(_class4 = (_class5 = (_class6 = class PlayerArmyController extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "gameManager", _descriptor3, this);

          _initializerDefineProperty(this, "team", _descriptor4, this);

          _initializerDefineProperty(this, "defaultLane", _descriptor5, this);

          _initializerDefineProperty(this, "leftPicker", _descriptor6, this);

          _initializerDefineProperty(this, "midPicker", _descriptor7, this);

          _initializerDefineProperty(this, "rightPicker", _descriptor8, this);

          _initializerDefineProperty(this, "unitIcons", _descriptor9, this);

          _initializerDefineProperty(this, "powerBarContainer", _descriptor10, this);

          _initializerDefineProperty(this, "coolDownDuration", _descriptor11, this);

          _initializerDefineProperty(this, "doubleTapWindow", _descriptor12, this);

          _initializerDefineProperty(this, "enableMaxAliveWaveLimit", _descriptor13, this);

          _initializerDefineProperty(this, "maxAliveWaves", _descriptor14, this);

          this.selectedLaneId = PlayerLane.Mid;
          this.coolDownTimer = 0;
          this.powerBar = null;
          this.powerBarTransform = null;
          this.powerBarMaxWidth = 0;
          this.powerBarHeight = 0;
          this.lanePickersDimmed = true;
          this.unitIconsDimmed = true;
          this.maxAliveWaveBlocked = false;
          this.selectedUnitName = '';
          this.pendingLaneTapTimer = 0;
          this.pendingLaneTapLaneId = PlayerLane.Mid;
          this.pendingLaneTapUnitName = '';
          this.lastAvailabilityAliveWaveCount = -1;
          this.lastAvailabilityCombatPoint = NaN;
          this.lastAvailabilityCoolingDown = false;
          this.unitIconTintDirty = true;
        }

        onLoad() {
          this.cachePowerBar();
          this.resetLanePickerTint();
          this.setSelectedLane(this.defaultLane);
          this.setSelectedUnit('');
          this.updatePowerBar();
          this.updateLanePickerTint(false);
          this.updateUnitIconTint(false, true);
        }

        onEnable() {
          this.registerInput();
        }

        onDisable() {
          this.unregisterInput();
          this.clearPendingLaneTap();
        }

        update(deltaTime) {
          var wasCoolingDown = this.isCoolingDown();

          if (this.coolDownTimer > 0) {
            this.coolDownTimer = Math.max(0, this.coolDownTimer - deltaTime);
            this.updatePowerBar();

            if (this.coolDownTimer <= 0) {
              this.updateLanePickerTint(false);
            }
          }

          if (wasCoolingDown !== this.isCoolingDown()) {
            this.unitIconTintDirty = true;
          }

          if (this.shouldRefreshSpawnAvailability()) {
            this.refreshSpawnAvailability();
          }

          this.updatePendingLaneTap(deltaTime);
        }

        selectLane(_event, laneData) {
          var laneId = this.parseLaneId(laneData);

          if (laneId < 0) {
            console.warn("[PlayerArmyController] Unknown lane: \"" + laneData + "\". " + 'Use left, mid, right, 0, 1, or 2.');
            return;
          }

          this.handleLaneTap(laneId);
        }

        spawnUnit(_event, unitName) {
          this.setSelectedUnit(unitName != null ? unitName : '');
        }

        setSelectedLane(laneId) {
          var safeLaneId = Math.max(PlayerLane.Left, Math.min(PlayerLane.Right, Math.floor(laneId)));
          this.selectedLaneId = safeLaneId;
          this.hideLaneSelectedNodes();
        }

        getSelectedLaneId() {
          return this.selectedLaneId;
        }

        parseLaneId(laneData) {
          var value = (laneData != null ? laneData : '').trim().toLowerCase();

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

        registerInput() {
          this.unregisterInput();
          this.registerLanePicker(this.leftPicker);
          this.registerLanePicker(this.midPicker);
          this.registerLanePicker(this.rightPicker);

          for (var i = 0; i < this.unitIcons.length; i++) {
            var item = this.unitIcons[i];
            var node = item ? item.node : null;
            if (!node) continue;
            this.removeManagedClickEvents(node, 'spawnUnit');
            node.on(Node.EventType.TOUCH_END, this.onUnitIconTap, this);
          }
        }

        unregisterInput() {
          this.unregisterLanePicker(this.leftPicker);
          this.unregisterLanePicker(this.midPicker);
          this.unregisterLanePicker(this.rightPicker);

          for (var i = 0; i < this.unitIcons.length; i++) {
            var item = this.unitIcons[i];
            var node = item ? item.node : null;
            if (!node) continue;
            node.off(Node.EventType.TOUCH_END, this.onUnitIconTap, this);
          }
        }

        registerLanePicker(node) {
          if (!node) return;
          this.removeManagedClickEvents(node, 'selectLane');
          node.on(Node.EventType.TOUCH_END, this.onLanePickerTap, this);
        }

        unregisterLanePicker(node) {
          if (!node) return;
          node.off(Node.EventType.TOUCH_END, this.onLanePickerTap, this);
        }

        onLanePickerTap(event) {
          var node = event.currentTarget;

          if (node === this.leftPicker) {
            this.handleLaneTap(PlayerLane.Left);
            return;
          }

          if (node === this.midPicker) {
            this.handleLaneTap(PlayerLane.Mid);
            return;
          }

          if (node === this.rightPicker) {
            this.handleLaneTap(PlayerLane.Right);
          }
        }

        onUnitIconTap(event) {
          var node = event.currentTarget;
          if (!node) return;
          var unitName = this.getUnitNameForIcon(node);

          if (!unitName) {
            console.warn("[PlayerArmyController] Unit icon \"" + node.name + "\" has no unitName binding.");
            return;
          }

          if (!this.isUnitNameUnlocked(unitName)) {
            console.warn("[PlayerArmyController] Unit \"" + unitName + "\" is locked.");
            return;
          }

          this.setSelectedUnit(unitName);
        }

        handleLaneTap(laneId) {
          if (this.isCoolingDown()) {
            this.clearPendingLaneTap();
            console.warn("[PlayerArmyController] Spawn is cooling down: " + this.coolDownTimer.toFixed(2) + "s remaining.");
            return;
          }

          if (this.isMaxAliveWaveBlocked()) {
            this.clearPendingLaneTap();
            var manager = this.getGameManager();
            var aliveCount = manager ? manager.getAliveWaveCount(this.team) : 0;
            console.warn("[PlayerArmyController] Max alive wave limit reached: " + (aliveCount + "/" + this.getMaxAliveWaves() + "."));
            return;
          }

          if (!this.selectedUnitName) {
            console.warn('[PlayerArmyController] Select a unit icon before tapping a lane.');
            return;
          }

          this.setSelectedLane(laneId);
          var window = Math.max(0, this.doubleTapWindow);

          if (window <= 0) {
            this.spawnByName(this.selectedUnitName, false, laneId);
            return;
          }

          if (this.pendingLaneTapTimer > 0 && this.pendingLaneTapLaneId === laneId) {
            var unitName = this.pendingLaneTapUnitName || this.selectedUnitName;
            this.clearPendingLaneTap();
            this.spawnByName(unitName, true, laneId);
            return;
          }

          if (this.pendingLaneTapTimer > 0) {
            this.flushPendingLaneTap();

            if (this.isCoolingDown()) {
              return;
            }
          }

          this.pendingLaneTapTimer = window;
          this.pendingLaneTapLaneId = laneId;
          this.pendingLaneTapUnitName = this.selectedUnitName;
        }

        updatePendingLaneTap(deltaTime) {
          if (this.pendingLaneTapTimer <= 0) return;
          this.pendingLaneTapTimer = Math.max(0, this.pendingLaneTapTimer - deltaTime);
          if (this.pendingLaneTapTimer > 0) return;
          this.flushPendingLaneTap();
        }

        flushPendingLaneTap() {
          var unitName = this.pendingLaneTapUnitName || this.selectedUnitName;
          var laneId = this.pendingLaneTapLaneId;
          this.clearPendingLaneTap();
          if (!unitName) return;
          this.spawnByName(unitName, false, laneId);
        }

        clearPendingLaneTap() {
          this.pendingLaneTapTimer = 0;
          this.pendingLaneTapLaneId = this.selectedLaneId;
          this.pendingLaneTapUnitName = '';
        }

        spawnByName(unitName, aggressiveForward, laneId) {
          var _this$gameManager;

          if (laneId === void 0) {
            laneId = this.selectedLaneId;
          }

          if (this.isCoolingDown()) {
            console.warn("[PlayerArmyController] Spawn is cooling down: " + this.coolDownTimer.toFixed(2) + "s remaining.");
            return;
          }

          var manager = (_this$gameManager = this.gameManager) != null ? _this$gameManager : (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;

          if (!manager) {
            console.warn('[PlayerArmyController] GameManager is not assigned.');
            return;
          }

          var safeUnitName = unitName.trim();

          if (!safeUnitName) {
            console.warn('[PlayerArmyController] Unit name is empty.');
            return;
          }

          if (!this.canSpawnMoreWave(manager)) {
            console.warn("[PlayerArmyController] Max alive wave limit reached: " + (manager.getAliveWaveCount(this.team) + "/" + this.getMaxAliveWaves() + "."));
            return;
          }

          var wave = manager.spawnWaveByName(this.team, safeUnitName, laneId, aggressiveForward);
          if (!wave) return;
          this.setSelectedUnit('');
          this.setLanePickersVisible(false);
          this.startCoolDown();
        }

        canSpawnMoreWave(manager) {
          if (!this.enableMaxAliveWaveLimit) {
            return true;
          }

          return manager.getAliveWaveCount(this.team) < this.getMaxAliveWaves();
        }

        getMaxAliveWaves() {
          return Math.max(1, Math.floor(this.maxAliveWaves));
        }

        getUnitNameForIcon(node) {
          for (var i = 0; i < this.unitIcons.length; i++) {
            var item = this.unitIcons[i];
            if (!item || item.node !== node) continue;
            return (item.unitName || '').trim();
          }

          return '';
        }

        getSelectedNode(picker) {
          if (!picker) return null;
          return picker.getChildByName('selected');
        }

        setSelectedNodeActive(selected, active) {
          if (!selected) return;
          selected.active = active;
        }

        hideLaneSelectedNodes() {
          this.setSelectedNodeActive(this.getSelectedNode(this.leftPicker), false);
          this.setSelectedNodeActive(this.getSelectedNode(this.midPicker), false);
          this.setSelectedNodeActive(this.getSelectedNode(this.rightPicker), false);
        }

        removeManagedClickEvents(node, handler) {
          var button = node.getComponent(Button);
          if (!button) return;
          if (!button.clickEvents) return;

          for (var i = button.clickEvents.length - 1; i >= 0; i--) {
            var clickEvent = button.clickEvents[i];
            if (!clickEvent) continue;
            if (clickEvent.target !== this.node) continue;
            if (clickEvent.handler !== handler) continue;
            button.clickEvents.splice(i, 1);
          }
        }

        cachePowerBar() {
          var container = this.powerBarContainer || this.node.getChildByName('power-bar-container');
          this.powerBar = container ? container.getChildByName('bar') : null;
          this.powerBarTransform = this.powerBar ? this.powerBar.getComponent(UITransform) : null;

          if (!this.powerBarTransform) {
            this.powerBarMaxWidth = 0;
            this.powerBarHeight = 0;
            return;
          }

          var size = this.powerBarTransform.contentSize;
          this.powerBarMaxWidth = size.width;
          this.powerBarHeight = size.height;
        }

        startCoolDown() {
          this.coolDownTimer = Math.max(0, this.coolDownDuration);
          this.updatePowerBar();
          this.updateLanePickerTint(this.isCoolingDown());
          this.updateUnitIconTint(this.isSpawnInputBlocked(), true);
        }

        isCoolingDown() {
          return this.coolDownTimer > 0;
        }

        isSpawnInputBlocked() {
          return this.isCoolingDown() || this.maxAliveWaveBlocked;
        }

        refreshSpawnAvailability() {
          var blocked = this.isMaxAliveWaveBlocked();

          if (this.maxAliveWaveBlocked !== blocked) {
            this.maxAliveWaveBlocked = blocked;

            if (blocked) {
              this.clearPendingLaneTap();
              this.setLanePickersVisible(false);
            } else if (this.selectedUnitName && this.canAffordUnitName(this.selectedUnitName)) {
              this.setLanePickersVisible(true);
            }
          }

          this.updateUnitIconTint(this.isSpawnInputBlocked());
        }

        shouldRefreshSpawnAvailability() {
          var manager = this.getGameManager();
          var aliveWaveCount = manager && this.enableMaxAliveWaveLimit ? manager.getAliveWaveCount(this.team) : -1;
          var combatPoint = manager ? manager.getCombatPoint(this.team) : NaN;
          var coolingDown = this.isCoolingDown();
          var changed = false;

          if (aliveWaveCount !== this.lastAvailabilityAliveWaveCount) {
            this.lastAvailabilityAliveWaveCount = aliveWaveCount;
            changed = true;
          }

          if (combatPoint !== this.lastAvailabilityCombatPoint) {
            this.lastAvailabilityCombatPoint = combatPoint;
            this.unitIconTintDirty = true;
            changed = true;
          }

          if (coolingDown !== this.lastAvailabilityCoolingDown) {
            this.lastAvailabilityCoolingDown = coolingDown;
            this.unitIconTintDirty = true;
            changed = true;
          }

          return changed;
        }

        isMaxAliveWaveBlocked() {
          if (!this.enableMaxAliveWaveLimit) {
            return false;
          }

          var manager = this.getGameManager();
          if (!manager) return false;
          return !this.canSpawnMoreWave(manager);
        }

        getGameManager() {
          var _this$gameManager2;

          return (_this$gameManager2 = this.gameManager) != null ? _this$gameManager2 : (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
        }

        updatePowerBar() {
          if (!this.powerBarTransform) return;
          var duration = Math.max(0, this.coolDownDuration);
          var progress = duration <= 0 ? 1 : 1 - this.coolDownTimer / duration;
          var safeProgress = Math.max(0, Math.min(1, progress));
          this.powerBarTransform.setContentSize(this.powerBarMaxWidth * safeProgress, this.powerBarHeight);
        }

        resetLanePickerTint() {
          this.setNodeTint(this.leftPicker, true);
          this.setNodeTint(this.midPicker, true);
          this.setNodeTint(this.rightPicker, true);
        }

        updateLanePickerTint(dimmed) {
          if (this.lanePickersDimmed === dimmed) {
            return;
          }

          this.lanePickersDimmed = dimmed;
          this.setNodeTint(this.leftPicker, !dimmed);
          this.setNodeTint(this.midPicker, !dimmed);
          this.setNodeTint(this.rightPicker, !dimmed);
        }

        updateUnitIconTint(dimmed, force) {
          if (force === void 0) {
            force = false;
          }

          if (!force && !this.unitIconTintDirty && this.unitIconsDimmed === dimmed) {
            return;
          }

          if (!force && this.unitIconsDimmed === dimmed && dimmed) {
            this.unitIconTintDirty = false;
            return;
          }

          if (this.unitIconsDimmed === dimmed) {
            this.refreshUnitIconAffordTint(dimmed);
            this.unitIconTintDirty = false;
            return;
          }

          this.unitIconsDimmed = dimmed;
          this.refreshUnitIconAffordTint(dimmed);
          this.unitIconTintDirty = false;
        }

        refreshUnitIconAffordTint(dimmed) {
          for (var i = 0; i < this.unitIcons.length; i++) {
            var item = this.unitIcons[i];
            var node = item ? item.node : null;
            var unitName = item ? item.unitName.trim() : '';
            var canUse = !!unitName && !dimmed && this.canAffordUnitName(unitName);
            this.setNodeTint(node, canUse, PlayerArmyController.unitCooldownTint);
          }
        }

        setSelectedUnit(unitName) {
          var requestedUnitName = (unitName || '').trim();
          var safeUnitName = requestedUnitName && this.isUnitNameUnlocked(requestedUnitName) ? requestedUnitName : '';
          var canAfford = !!safeUnitName && this.canAffordUnitName(safeUnitName);
          var maxBlocked = this.isMaxAliveWaveBlocked();
          this.maxAliveWaveBlocked = maxBlocked;
          this.selectedUnitName = safeUnitName;
          this.setLanePickersVisible(canAfford && !this.isCoolingDown() && !maxBlocked);
          this.updateUnitIconTint(this.isSpawnInputBlocked(), true);

          for (var i = 0; i < this.unitIcons.length; i++) {
            var item = this.unitIcons[i];
            var node = item ? item.node : null;
            var active = !!safeUnitName && !!item && item.unitName.trim() === safeUnitName;
            this.setSelectedNodeActive(this.getSelectedNode(node), active);
          }
        }

        canAffordUnitName(unitName) {
          var _this$gameManager3;

          var manager = (_this$gameManager3 = this.gameManager) != null ? _this$gameManager3 : (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          if (!manager) return false;
          return manager.canAffordUnitName(this.team, unitName);
        }

        isUnitNameUnlocked(unitName) {
          var _this$gameManager4;

          var manager = (_this$gameManager4 = this.gameManager) != null ? _this$gameManager4 : (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).instance;
          if (!manager) return false;
          return manager.isUnitNameUnlocked(this.team, unitName);
        }

        setLanePickersVisible(visible) {
          var container = this.getLanePickerContainer();

          if (container) {
            container.active = visible;
            return;
          }

          this.setLanePickerNodesVisible(visible);
        }

        getLanePickerContainer() {
          var parent = this.leftPicker ? this.leftPicker.parent : null;

          if (parent && this.midPicker && this.rightPicker && this.midPicker.parent === parent && this.rightPicker.parent === parent) {
            return parent;
          }

          return null;
        }

        setLanePickerNodesVisible(visible) {
          if (this.leftPicker) {
            this.leftPicker.active = visible;
          }

          if (this.midPicker) {
            this.midPicker.active = visible;
          }

          if (this.rightPicker) {
            this.rightPicker.active = visible;
          }
        }

        setNodeTint(node, active, inactiveTint) {
          if (inactiveTint === void 0) {
            inactiveTint = PlayerArmyController.inactiveTint;
          }

          if (!node) return;
          var sprite = node.getComponent(Sprite);
          if (!sprite) return;
          sprite.color = active ? PlayerArmyController.activeTint : inactiveTint;
        }

      }, _class6.activeTint = new Color(255, 255, 255, 255), _class6.inactiveTint = new Color(0, 0, 0, 255), _class6.unitCooldownTint = new Color(128, 128, 128, 255), _class6), (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "gameManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "team", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "defaultLane", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return PlayerLane.Mid;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "leftPicker", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "midPicker", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "rightPicker", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "unitIcons", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "powerBarContainer", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "coolDownDuration", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "doubleTapWindow", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.25;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "enableMaxAliveWaveLimit", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "maxAliveWaves", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 7;
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=eda245de96c070b06a601d49d9c9fcb6d664fcb2.js.map