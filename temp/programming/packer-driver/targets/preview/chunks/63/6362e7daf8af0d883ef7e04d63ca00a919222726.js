System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Layers, Layout, Node, Sprite, SpriteFrame, Tween, tween, UITransform, Vec3, GameManager, BattleWave, UnitType, BattleInformationIconItem, BattleCinematicCameraController, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class4, _class5, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _crd, ccclass, property, MiniMapUnitIconInfo, TrueMiniMapPanel;

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
      Color = _cc.Color;
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
      BattleWave = _unresolved_3.BattleWave;
    }, function (_unresolved_4) {
      UnitType = _unresolved_4.UnitType;
    }, function (_unresolved_5) {
      BattleInformationIconItem = _unresolved_5.BattleInformationIconItem;
    }, function (_unresolved_6) {
      BattleCinematicCameraController = _unresolved_6.BattleCinematicCameraController;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7f28eHPxddG5r2d0aBU9xYV", "TrueMiniMapPanel", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'EventTouch', 'Layers', 'Layout', 'Node', 'Sprite', 'SpriteFrame', 'Tween', 'tween', 'UITransform', 'Vec3']);

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
        initializer: function initializer() {
          return (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spriteFrame", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
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
      }), _dec12 = property(SpriteFrame), _dec13 = property(SpriteFrame), _dec14 = property(Color), _dec15 = property(Color), _dec16 = property(Color), _dec17 = property(Color), _dec4(_class4 = (_class5 = class TrueMiniMapPanel extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "gameManager", _descriptor3, this);

          _initializerDefineProperty(this, "cinematicController", _descriptor4, this);

          _initializerDefineProperty(this, "background", _descriptor5, this);

          _initializerDefineProperty(this, "teamAIconRoot", _descriptor6, this);

          _initializerDefineProperty(this, "teamBIconRoot", _descriptor7, this);

          _initializerDefineProperty(this, "teamAIcons", _descriptor8, this);

          _initializerDefineProperty(this, "teamBIcons", _descriptor9, this);

          _initializerDefineProperty(this, "teamAHeroIcon", _descriptor10, this);

          _initializerDefineProperty(this, "teamBHeroIcon", _descriptor11, this);

          _initializerDefineProperty(this, "autoFindGameManager", _descriptor12, this);

          _initializerDefineProperty(this, "disableIconRootLayout", _descriptor13, this);

          _initializerDefineProperty(this, "worldToMiniMapScale", _descriptor14, this);

          _initializerDefineProperty(this, "fixedMapHeight", _descriptor15, this);

          _initializerDefineProperty(this, "updateInterval", _descriptor16, this);

          _initializerDefineProperty(this, "smoothDampTime", _descriptor17, this);

          _initializerDefineProperty(this, "tweenScaleDuration", _descriptor18, this);

          _initializerDefineProperty(this, "iconWidth", _descriptor19, this);

          _initializerDefineProperty(this, "iconHeight", _descriptor20, this);

          _initializerDefineProperty(this, "minIconSpacing", _descriptor21, this);

          _initializerDefineProperty(this, "iconBoundaryPadding", _descriptor22, this);

          _initializerDefineProperty(this, "iconSeparationIterations", _descriptor23, this);

          _initializerDefineProperty(this, "teamAIconTint", _descriptor24, this);

          _initializerDefineProperty(this, "teamBIconTint", _descriptor25, this);

          _initializerDefineProperty(this, "teamAFlashTint", _descriptor26, this);

          _initializerDefineProperty(this, "teamBFlashTint", _descriptor27, this);

          _initializerDefineProperty(this, "prewarmIconCount", _descriptor28, this);

          _initializerDefineProperty(this, "maxPoolSize", _descriptor29, this);

          _initializerDefineProperty(this, "clampIconToMapBounds", _descriptor30, this);

          _initializerDefineProperty(this, "invertXAxis", _descriptor31, this);

          _initializerDefineProperty(this, "invertZAxis", _descriptor32, this);

          _initializerDefineProperty(this, "showAliveRatio", _descriptor33, this);

          _initializerDefineProperty(this, "maxPositionSampleUnits", _descriptor34, this);

          _initializerDefineProperty(this, "freezeDyingWavePositionAliveCount", _descriptor35, this);

          _initializerDefineProperty(this, "enableIconClickFocus", _descriptor36, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor37, this);

          this.records = new Map();
          this.heroRecords = new Map();
          this.pool = [];
          this.mapWidth = 0;
          this.mapHeight = 0;
          this.timer = 0;
          this.time = 0;
          this.tempPosition = new Vec3();
          this.tempWorldPosition = new Vec3();
          this.tempMiniMapPosition = new Vec3();
          this.removeWaveIds = [];
          this.removeHeroTeams = [];
          this.iconSeparationRecords = [];
          this.iconSeparationGrid = new Map();
          this.iconSeparationGridKeys = [];
          this.tempWaveScan = {
            aliveCount: 0,
            aliveRatio: 0,
            engaged: false,
            dead: true,
            hasPosition: false
          };
          this.tweenScaleOne = new Vec3(1, 1, 1);
          this.tweenScaleZero = new Vec3(0, 0, 1);
          this.iconPositionStopDistanceSq = 0.0001;
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
            this.syncWithHeroes();
            this.updateTargetsAndState();
          }

          this.updateIconPositions(deltaTime);
          this.updateFlashOnly();
        }

        configureMapSize() {
          if (!this.gameManager) {
            return;
          }

          var worldWidth = Math.max(0.001, this.gameManager.battleMaxX - this.gameManager.battleMinX);
          var worldHeight = Math.max(0.001, this.gameManager.battleMaxZ - this.gameManager.battleMinZ);

          if (this.fixedMapHeight > 0) {
            this.mapHeight = Math.max(1, this.fixedMapHeight);
            this.mapWidth = Math.max(1, this.mapHeight * worldWidth / worldHeight);
          } else {
            var scale = Math.max(0.001, this.worldToMiniMapScale);
            this.mapWidth = Math.max(1, worldWidth * scale);
            this.mapHeight = Math.max(1, worldHeight * scale);
          }

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

          var layout = root.getComponent(Layout);

          if (layout) {
            layout.enabled = false;
          }
        }

        setNodeSize(node, width, height) {
          var ui = node.getComponent(UITransform);

          if (!ui) {
            ui = node.addComponent(UITransform);
          }

          var size = ui.contentSize;

          if (Math.abs(size.width - width) > 0.001 || Math.abs(size.height - height) > 0.001) {
            ui.setContentSize(width, height);
          }

          if (Math.abs(ui.anchorX - 0.5) > 0.001 || Math.abs(ui.anchorY - 0.5) > 0.001) {
            ui.setAnchorPoint(0.5, 0.5);
          }
        }

        syncWithBattleWaves() {
          if (!this.gameManager) {
            return;
          }

          var waves = this.gameManager.waves;

          for (var i = 0; i < waves.length; i++) {
            var wave = waves[i];
            if (!wave) continue;
            if (this.isHeroWave(wave)) continue;

            if (this.records.has(wave.id)) {
              continue;
            }

            var scan = this.scanWaveForMiniMap(wave, this.tempWorldPosition);

            if (scan.dead) {
              continue;
            }

            if (!scan.hasPosition) {
              continue;
            }

            var target = this.getMiniMapPositionFromWorldPosition(this.tempWorldPosition);
            this.createIconForWave(wave, target, scan.aliveRatio, scan.engaged);
          }
        }

        createIconForWave(wave, target, aliveRatio, engaged) {
          var root = wave.team === 0 ? this.teamAIconRoot : this.teamBIconRoot;

          if (!root) {
            return;
          }

          var node = this.getIconNodeFromPool();
          Tween.stopAllByTarget(node);
          node.active = false;
          node.layer = Layers.Enum.UI_2D;
          node.name = "mini-map-wave-" + wave.id;
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

          var item = node.getComponent(_crd && BattleInformationIconItem === void 0 ? (_reportPossibleCrUseOfBattleInformationIconItem({
            error: Error()
          }), BattleInformationIconItem) : BattleInformationIconItem);
          item.setup(this.getSpriteFrame(wave.team, wave.unitType), this.iconWidth, this.iconHeight, 0.5, wave.team === 1, this.getTeamIconTint(wave.team), this.getTeamFlashTint(wave.team));
          root.addChild(node);
          node.setPosition(target);
          node.setScale(0, 0, 1);
          node.active = true;
          var displayedAliveRatio = this.showAliveRatio ? aliveRatio : 1;
          item.setAliveRatio(displayedAliveRatio);
          item.updateEngageVisual(engaged, this.time);
          var record = {
            team: wave.team,
            pairId: wave.id,
            wave,
            item,
            node,
            rawPosition: target.clone(),
            targetPosition: target.clone(),
            velocity: new Vec3(),
            aliveRatio,
            displayedAliveRatio,
            engaged,
            visualEngaged: engaged,
            removing: false
          };
          this.records.set(wave.id, record);
          tween(node).to(this.getSafeTweenDuration(), {
            scale: this.tweenScaleOne
          }).start();
          this.log("Create mini-map icon wave=" + wave.id);
        }

        syncWithHeroes() {
          if (!this.gameManager) {
            return;
          }

          this.syncHeroIcon(0, this.gameManager.teamAHero);
          this.syncHeroIcon(1, this.gameManager.teamBHero);
        }

        syncHeroIcon(team, hero) {
          if (this.heroRecords.has(team)) {
            return;
          }

          if (!this.isHeroUnitAlive(hero)) {
            return;
          }

          this.tempWorldPosition.set(hero.agent.pos.x, 0, hero.agent.pos.z);
          var target = this.getMiniMapPositionFromWorldPosition(this.tempWorldPosition);
          this.createIconForHero(team, hero, target);
        }

        createIconForHero(team, hero, target) {
          var root = team === 0 ? this.teamAIconRoot : this.teamBIconRoot;

          if (!root) {
            return;
          }

          var node = this.getIconNodeFromPool();
          Tween.stopAllByTarget(node);
          node.active = false;
          node.layer = Layers.Enum.UI_2D;
          node.name = "mini-map-hero-" + team;
          this.clearIconEvents(node);

          if (this.enableIconClickFocus && this.cinematicController) {
            node.on(Node.EventType.TOUCH_START, event => {
              var _this$cinematicContro4;

              (_this$cinematicContro4 = this.cinematicController) == null || _this$cinematicContro4.suppressExitTap();
              this.stopTouchPropagation(event);
            }, this);
            node.on(Node.EventType.TOUCH_END, event => {
              var _this$cinematicContro5, _this$cinematicContro6;

              (_this$cinematicContro5 = this.cinematicController) == null || _this$cinematicContro5.suppressExitTap();
              (_this$cinematicContro6 = this.cinematicController) == null || _this$cinematicContro6.focusUnit(hero);
              this.stopTouchPropagation(event);
            }, this);
          }

          var item = node.getComponent(_crd && BattleInformationIconItem === void 0 ? (_reportPossibleCrUseOfBattleInformationIconItem({
            error: Error()
          }), BattleInformationIconItem) : BattleInformationIconItem);
          item.setup(this.getHeroSpriteFrame(team, hero), this.iconWidth, this.iconHeight, 0.5, team === 1, this.getTeamIconTint(team), this.getTeamFlashTint(team));
          root.addChild(node);
          node.setPosition(target);
          node.setScale(0, 0, 1);
          node.active = true;
          var aliveRatio = hero.props ? hero.props.getHealthRatio() : 1;
          var displayedAliveRatio = this.showAliveRatio ? aliveRatio : 1;
          item.setAliveRatio(displayedAliveRatio);
          item.updateEngageVisual(hero.onBusy, this.time);
          var record = {
            team,
            pairId: -1000 - team,
            unit: hero,
            item,
            node,
            rawPosition: target.clone(),
            targetPosition: target.clone(),
            velocity: new Vec3(),
            aliveRatio,
            displayedAliveRatio,
            engaged: hero.onBusy,
            visualEngaged: hero.onBusy,
            removing: false
          };
          this.heroRecords.set(team, record);
          tween(node).to(this.getSafeTweenDuration(), {
            scale: this.tweenScaleOne
          }).start();
          this.log("Create mini-map hero icon team=" + team);
        }

        updateTargetsAndState() {
          var removeIds = this.removeWaveIds;
          removeIds.length = 0;
          this.records.forEach((record, waveId) => {
            var wave = record.wave;

            if (!wave || this.isHeroWave(wave)) {
              removeIds.push(waveId);
              return;
            }

            var scan = this.scanWaveForMiniMap(wave, this.tempWorldPosition);
            record.aliveRatio = scan.aliveRatio;
            record.engaged = scan.engaged;

            if (scan.dead || !scan.hasPosition) {
              removeIds.push(waveId);
              return;
            }

            if (!this.shouldFreezeDyingWavePosition(wave, scan.aliveCount)) {
              record.rawPosition.set(this.getMiniMapPositionFromWorldPosition(this.tempWorldPosition));
            } else {
              record.rawPosition.set(record.targetPosition);
            }

            record.targetPosition.set(record.rawPosition);
            var displayedAliveRatio = this.showAliveRatio ? record.aliveRatio : 1;

            if (Math.abs(record.displayedAliveRatio - displayedAliveRatio) > 0.001) {
              record.displayedAliveRatio = displayedAliveRatio;
              record.item.setAliveRatio(displayedAliveRatio);
            }
          });

          for (var i = 0; i < removeIds.length; i++) {
            this.releaseIcon(removeIds[i]);
          }

          this.updateHeroTargetsAndState();
          this.resolveIconOverlaps();
        }

        updateHeroTargetsAndState() {
          var removeTeams = this.removeHeroTeams;
          removeTeams.length = 0;
          this.heroRecords.forEach((record, team) => {
            var hero = record.unit;

            if (!this.isHeroUnitAlive(hero)) {
              removeTeams.push(team);
              return;
            }

            record.aliveRatio = hero.props ? hero.props.getHealthRatio() : 1;
            record.engaged = hero.onBusy;
            this.tempWorldPosition.set(hero.agent.pos.x, 0, hero.agent.pos.z);
            record.rawPosition.set(this.getMiniMapPositionFromWorldPosition(this.tempWorldPosition));
            record.targetPosition.set(record.rawPosition);
            var displayedAliveRatio = this.showAliveRatio ? record.aliveRatio : 1;

            if (Math.abs(record.displayedAliveRatio - displayedAliveRatio) > 0.001) {
              record.displayedAliveRatio = displayedAliveRatio;
              record.item.setAliveRatio(displayedAliveRatio);
            }
          });

          for (var i = 0; i < removeTeams.length; i++) {
            this.releaseHeroIcon(removeTeams[i]);
          }
        }

        updateIconPositions(deltaTime) {
          for (var record of this.records.values()) {
            if (record.removing) {
              continue;
            }

            this.updateIconNodePosition(record, deltaTime);
          }

          for (var _record of this.heroRecords.values()) {
            if (_record.removing) {
              continue;
            }

            this.updateIconNodePosition(_record, deltaTime);
          }
        }

        updateIconNodePosition(record, deltaTime) {
          var current = record.node.position;
          var dx = record.targetPosition.x - current.x;
          var dy = record.targetPosition.y - current.y;

          if (dx * dx + dy * dy <= this.iconPositionStopDistanceSq) {
            if (Math.abs(record.velocity.x) > 0.0001 || Math.abs(record.velocity.y) > 0.0001) {
              record.velocity.set(0, 0, 0);
            }

            return;
          }

          if (this.smoothDampTime <= 0) {
            record.node.setPosition(record.targetPosition);
            return;
          }

          this.tempPosition.set(this.smoothDamp(current.x, record.targetPosition.x, 'x', record, deltaTime), this.smoothDamp(current.y, record.targetPosition.y, 'y', record, deltaTime), 0);
          record.node.setPosition(this.tempPosition);
        }

        resolveIconOverlaps() {
          var minSpacing = Math.max(0, this.minIconSpacing);

          if (minSpacing <= 0) {
            return;
          }

          var records = this.iconSeparationRecords;
          records.length = 0;
          this.records.forEach(record => {
            if (record.removing) {
              return;
            }

            record.targetPosition.set(record.rawPosition);
            records.push(record);
          });
          this.heroRecords.forEach(record => {
            if (record.removing) {
              return;
            }

            record.targetPosition.set(record.rawPosition);
            records.push(record);
          });

          if (records.length < 2) {
            return;
          }

          var iterations = Math.max(1, Math.floor(this.iconSeparationIterations));
          var minSpacingSq = minSpacing * minSpacing;

          for (var iteration = 0; iteration < iterations; iteration++) {
            this.buildIconSeparationGrid(records, minSpacing);

            for (var i = 0; i < records.length; i++) {
              var a = records[i];
              var aPos = a.targetPosition;
              var gx = Math.floor(aPos.x / minSpacing);
              var gy = Math.floor(aPos.y / minSpacing);

              for (var x = gx - 1; x <= gx + 1; x++) {
                for (var y = gy - 1; y <= gy + 1; y++) {
                  var list = this.iconSeparationGrid.get(this.getIconSeparationKey(x, y));
                  if (!list) continue;

                  for (var index = 0; index < list.length; index++) {
                    var j = list[index];
                    if (j <= i) continue;
                    var b = records[j];

                    if (a.team === b.team) {
                      continue;
                    }

                    this.separateIconPair(a, b, minSpacing, minSpacingSq);
                  }
                }
              }
            }

            this.clampSeparatedIconTargets(records);
          }
        }

        buildIconSeparationGrid(records, cellSize) {
          this.clearIconSeparationGrid();

          for (var i = 0; i < records.length; i++) {
            var pos = records[i].targetPosition;
            var key = this.getIconSeparationKey(Math.floor(pos.x / cellSize), Math.floor(pos.y / cellSize));
            var list = this.iconSeparationGrid.get(key);

            if (!list) {
              list = [];
              this.iconSeparationGrid.set(key, list);
            }

            if (list.length <= 0) {
              this.iconSeparationGridKeys.push(key);
            }

            list.push(i);
          }
        }

        clearIconSeparationGrid() {
          for (var i = 0; i < this.iconSeparationGridKeys.length; i++) {
            var list = this.iconSeparationGrid.get(this.iconSeparationGridKeys[i]);

            if (list) {
              list.length = 0;
            }
          }

          this.iconSeparationGridKeys.length = 0;
        }

        getIconSeparationKey(x, y) {
          return (x + 32768) * 65536 + y + 32768;
        }

        clampSeparatedIconTargets(records) {
          if (this.clampIconToMapBounds) {
            for (var i = 0; i < records.length; i++) {
              this.clampMiniMapPosition(records[i].targetPosition);
            }
          }
        }

        separateIconPair(a, b, minSpacing, minSpacingSq) {
          var aPos = a.targetPosition;
          var bPos = b.targetPosition;
          var dx = bPos.x - aPos.x;
          var dy = bPos.y - aPos.y;
          var distSq = dx * dx + dy * dy;

          if (distSq >= minSpacingSq) {
            return;
          }

          var nx = 0;
          var ny = 0;
          var dist = 0;

          if (distSq <= 0.0001) {
            var angle = this.getBoundaryAwarePairAngle(a, b);
            nx = Math.cos(angle);
            ny = Math.sin(angle);
          } else {
            dist = Math.sqrt(distSq);
            nx = dx / dist;
            ny = dy / dist;
          }

          var push = (minSpacing - dist) * 0.5;
          aPos.x -= nx * push;
          aPos.y -= ny * push;
          bPos.x += nx * push;
          bPos.y += ny * push;
        }

        getIconPairAngle(waveAId, waveBId) {
          var seed = Math.abs((waveAId + 1) * 97 + (waveBId + 1) * 53);
          return seed % 360 * 0.017453292519943295;
        }

        getBoundaryAwarePairAngle(a, b) {
          var baseAngle = this.getIconPairAngle(a.pairId, b.pairId);

          if (!this.clampIconToMapBounds) {
            return baseAngle;
          }

          var midX = (a.rawPosition.x + b.rawPosition.x) * 0.5;
          var midY = (a.rawPosition.y + b.rawPosition.y) * 0.5;
          var padding = this.getIconBoundsPadding();
          var halfWidth = Math.max(0, this.mapWidth * 0.5 - padding);
          var halfHeight = Math.max(0, this.mapHeight * 0.5 - padding);
          var edgeRange = Math.max(this.minIconSpacing, padding + 1);

          if (halfWidth > 0 && Math.abs(halfWidth - Math.abs(midX)) < edgeRange) {
            return midY >= 0 ? -Math.PI * 0.5 : Math.PI * 0.5;
          }

          if (halfHeight > 0 && Math.abs(halfHeight - Math.abs(midY)) < edgeRange) {
            return midX >= 0 ? Math.PI : 0;
          }

          return baseAngle;
        }

        clampMiniMapPosition(position) {
          var padding = this.getIconBoundsPadding();
          var halfWidth = Math.max(0, this.mapWidth * 0.5 - padding);
          var halfHeight = Math.max(0, this.mapHeight * 0.5 - padding);
          position.x = Math.max(-halfWidth, Math.min(halfWidth, position.x));
          position.y = Math.max(-halfHeight, Math.min(halfHeight, position.y));
        }

        getIconBoundsPadding() {
          return Math.max(0, this.iconBoundaryPadding, this.iconWidth * 0.5, this.iconHeight * 0.5);
        }

        smoothDamp(current, target, axis, record, deltaTime) {
          var smoothTime = Math.max(0.0001, this.smoothDampTime);
          var omega = 2 / smoothTime;
          var x = omega * deltaTime;
          var exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
          var change = current - target;
          var velocity = axis === 'x' ? record.velocity.x : record.velocity.y;
          var temp = (velocity + omega * change) * deltaTime;
          var nextVelocity = (velocity - omega * temp) * exp;

          if (axis === 'x') {
            record.velocity.x = nextVelocity;
          } else {
            record.velocity.y = nextVelocity;
          }

          return target + (change + temp) * exp;
        }

        updateFlashOnly() {
          for (var record of this.records.values()) {
            if (record.removing) {
              continue;
            }

            if (!record.engaged) {
              if (record.visualEngaged) {
                record.item.updateEngageVisual(false, this.time);
                record.visualEngaged = false;
              }

              continue;
            }

            record.item.updateEngageVisual(true, this.time);
            record.visualEngaged = true;
          }

          for (var _record2 of this.heroRecords.values()) {
            if (_record2.removing) {
              continue;
            }

            if (!_record2.engaged) {
              if (_record2.visualEngaged) {
                _record2.item.updateEngageVisual(false, this.time);

                _record2.visualEngaged = false;
              }

              continue;
            }

            _record2.item.updateEngageVisual(true, this.time);

            _record2.visualEngaged = true;
          }
        }

        releaseIcon(waveId) {
          var record = this.records.get(waveId);

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
          tween(record.node).to(this.getSafeTweenDuration(), {
            scale: this.tweenScaleZero
          }).call(() => {
            this.records.delete(waveId);
            this.recycleIcon(record);
          }).start();
        }

        releaseHeroIcon(team) {
          var record = this.heroRecords.get(team);

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
          tween(record.node).to(this.getSafeTweenDuration(), {
            scale: this.tweenScaleZero
          }).call(() => {
            this.heroRecords.delete(team);
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

        getMiniMapPositionFromWorldPosition(worldPosition) {
          if (!this.gameManager) {
            return this.tempMiniMapPosition.set(0, 0, 0);
          }

          var minX = this.gameManager.battleMinX;
          var maxX = this.gameManager.battleMaxX;
          var minZ = this.gameManager.battleMinZ;
          var maxZ = this.gameManager.battleMaxZ;
          var width = Math.max(0.0001, maxX - minX);
          var height = Math.max(0.0001, maxZ - minZ);
          var x01 = (worldPosition.x - minX) / width;
          var z01 = (worldPosition.z - minZ) / height;

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

          return this.tempMiniMapPosition.set(x01 * this.mapWidth - this.mapWidth * 0.5, z01 * this.mapHeight - this.mapHeight * 0.5, 0);
        }

        shouldFreezeDyingWavePosition(wave, aliveCount) {
          var threshold = Math.max(0, Math.floor(this.freezeDyingWavePositionAliveCount));

          if (threshold <= 0) {
            return false;
          }

          if (wave.totalCount <= threshold) {
            return false;
          }

          return aliveCount <= threshold;
        }

        scanWaveForMiniMap(wave, out) {
          var scan = this.tempWaveScan;
          scan.aliveCount = 0;
          scan.aliveRatio = 0;
          scan.engaged = false;
          scan.dead = true;
          scan.hasPosition = false;

          if (!wave || wave.released) {
            out.set(0, 0, 0);
            return scan;
          }

          var frame = this.gameManager ? this.gameManager.frame : -1;
          var aliveCount = frame >= 0 ? wave.getRuntimeAliveCount(frame) : wave.getAliveCount();
          scan.aliveCount = aliveCount;
          scan.engaged = frame >= 0 ? wave.hasEngagedRuntime(frame) : wave.hasEngaged();

          if (aliveCount <= 0) {
            out.set(0, 0, 0);
            return scan;
          }

          scan.dead = false;

          if (wave.totalCount > 0) {
            scan.aliveRatio = aliveCount / wave.totalCount;
          }

          var representative = wave.getRepresentativeUnit();

          if (representative && (_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
            error: Error()
          }), BattleWave) : BattleWave).getWaveForUnit(representative) === wave && representative.node.activeInHierarchy && representative.props && !representative.props.isDead() && representative.agent) {
            out.set(representative.agent.pos.x, 0, representative.agent.pos.z);
            scan.hasPosition = true;
            return scan;
          }

          var sumX = 0;
          var sumZ = 0;
          var sampleCount = 0;
          var units = wave.units;
          var sampleLimit = Math.max(1, Math.floor(this.maxPositionSampleUnits));
          var step = units.length > sampleLimit ? Math.max(1, Math.floor(units.length / sampleLimit)) : 1;

          for (var i = 0; i < units.length && sampleCount < sampleLimit; i += step) {
            var unit = units[i];
            if (!unit) continue;
            if ((_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
              error: Error()
            }), BattleWave) : BattleWave).getWaveForUnit(unit) !== wave) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.props) continue;
            if (unit.props.isDead()) continue;
            if (!unit.agent) continue;
            sumX += unit.agent.pos.x;
            sumZ += unit.agent.pos.z;
            sampleCount++;
          }

          if (sampleCount <= 0) {
            if (!this.scanFullWavePositionForMiniMap(wave, out)) {
              out.set(0, 0, 0);
              scan.dead = true;
              return scan;
            }

            scan.hasPosition = true;
            return scan;
          }

          out.set(sumX / sampleCount, 0, sumZ / sampleCount);
          scan.hasPosition = true;
          return scan;
        }

        isHeroWave(wave) {
          if (!wave) return false;
          var units = wave.units;

          for (var i = 0; i < units.length; i++) {
            var unit = units[i];

            if (unit && unit.isHero) {
              return true;
            }
          }

          return false;
        }

        scanFullWavePositionForMiniMap(wave, out) {
          var sumX = 0;
          var sumZ = 0;
          var count = 0;
          var units = wave.units;

          for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (!unit) continue;
            if ((_crd && BattleWave === void 0 ? (_reportPossibleCrUseOfBattleWave({
              error: Error()
            }), BattleWave) : BattleWave).getWaveForUnit(unit) !== wave) continue;
            if (!unit.node.activeInHierarchy) continue;
            if (!unit.props) continue;
            if (unit.props.isDead()) continue;
            if (!unit.agent) continue;
            sumX += unit.agent.pos.x;
            sumZ += unit.agent.pos.z;
            count++;
          }

          if (count <= 0) {
            return false;
          }

          out.set(sumX / count, 0, sumZ / count);
          return true;
        }

        prewarmPool() {
          var count = Math.max(0, Math.floor(this.prewarmIconCount));

          for (var i = 0; i < count; i++) {
            var node = this.createIconNode();
            node.active = false;
            this.node.addChild(node);
            this.pool.push(node);
          }
        }

        getIconNodeFromPool() {
          var node;

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
          var node = new Node('mini-map-wave-icon');
          node.layer = Layers.Enum.UI_2D;
          var ui = node.addComponent(UITransform);
          ui.setContentSize(this.iconWidth, this.iconHeight);
          var spriteNode = new Node('mini-map-wave-icon-sprite');
          spriteNode.layer = Layers.Enum.UI_2D;
          node.addChild(spriteNode);
          var spriteUi = spriteNode.addComponent(UITransform);
          spriteUi.setContentSize(this.iconWidth, this.iconHeight);
          spriteUi.setAnchorPoint(0.5, 0.5);
          var sprite = spriteNode.addComponent(Sprite);
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          var item = node.addComponent(_crd && BattleInformationIconItem === void 0 ? (_reportPossibleCrUseOfBattleInformationIconItem({
            error: Error()
          }), BattleInformationIconItem) : BattleInformationIconItem);
          item.iconSprite = sprite;
          return node;
        }

        clearAllIcons() {
          this.records.forEach(record => {
            Tween.stopAllByTarget(record.node);
            this.clearIconEvents(record.node);
            record.item.resetVisual();
            record.node.removeFromParent();
            record.node.active = false;

            if (this.pool.length < this.maxPoolSize) {
              this.pool.push(record.node);
            } else {
              record.node.destroy();
            }
          });
          this.records.clear();
          this.heroRecords.forEach(record => {
            Tween.stopAllByTarget(record.node);
            this.clearIconEvents(record.node);
            record.item.resetVisual();
            record.node.removeFromParent();
            record.node.active = false;

            if (this.pool.length < this.maxPoolSize) {
              this.pool.push(record.node);
            } else {
              record.node.destroy();
            }
          });
          this.heroRecords.clear();
        }

        destroyAllIcons() {
          this.records.forEach(record => {
            Tween.stopAllByTarget(record.node);
            this.clearIconEvents(record.node);
            record.node.destroy();
          });
          this.records.clear();
          this.heroRecords.forEach(record => {
            Tween.stopAllByTarget(record.node);
            this.clearIconEvents(record.node);
            record.node.destroy();
          });
          this.heroRecords.clear();

          for (var i = 0; i < this.pool.length; i++) {
            var node = this.pool[i];
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
          var e = event;

          if (typeof e.stopPropagation === 'function') {
            e.stopPropagation();
          }
        }

        getSpriteFrame(team, unitType) {
          var list = team === 0 ? this.teamAIcons : this.teamBIcons;
          var spriteFrame = this.findSpriteFrameInList(list, unitType);

          if (spriteFrame) {
            return spriteFrame;
          }

          return null;
        }

        getHeroSpriteFrame(team, hero) {
          var heroSpriteFrame = team === 0 ? this.teamAHeroIcon : this.teamBHeroIcon;

          if (heroSpriteFrame) {
            return heroSpriteFrame;
          }

          var unitType = hero.props ? hero.props.unitType : (_crd && UnitType === void 0 ? (_reportPossibleCrUseOfUnitType({
            error: Error()
          }), UnitType) : UnitType).LightSword;
          return this.getSpriteFrame(team, unitType);
        }

        isHeroUnitAlive(hero) {
          if (!hero) return false;
          if (!hero.node.activeInHierarchy) return false;
          if (!hero.agent) return false;
          if (!hero.props) return false;
          if (hero.props.isDead()) return false;
          return true;
        }

        getTeamIconTint(team) {
          return team === 0 ? this.teamAIconTint : this.teamBIconTint;
        }

        getTeamFlashTint(team) {
          return team === 0 ? this.teamAFlashTint : this.teamBFlashTint;
        }

        findSpriteFrameInList(list, unitType) {
          for (var i = 0; i < list.length; i++) {
            var info = list[i];

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

          console.log("[TrueMiniMapPanel] " + msg);
        }

      }, (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "gameManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "cinematicController", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "background", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "teamAIconRoot", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "teamBIconRoot", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "teamAIcons", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "teamBIcons", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "teamAHeroIcon", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "teamBHeroIcon", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "autoFindGameManager", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "disableIconRootLayout", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "worldToMiniMapScale", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "fixedMapHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "updateInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.1;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "smoothDampTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.12;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "tweenScaleDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.15;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "iconWidth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 18;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "iconHeight", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 18;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class5.prototype, "minIconSpacing", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 22;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class5.prototype, "iconBoundaryPadding", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class5.prototype, "iconSeparationIterations", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class5.prototype, "teamAIconTint", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(90, 180, 255, 255);
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class5.prototype, "teamBIconTint", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 95, 95, 255);
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class5.prototype, "teamAFlashTint", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(180, 240, 255, 255);
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class5.prototype, "teamBFlashTint", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 220, 90, 255);
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class5.prototype, "prewarmIconCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 32;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class5.prototype, "maxPoolSize", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 128;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class5.prototype, "clampIconToMapBounds", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor31 = _applyDecoratedDescriptor(_class5.prototype, "invertXAxis", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor32 = _applyDecoratedDescriptor(_class5.prototype, "invertZAxis", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor33 = _applyDecoratedDescriptor(_class5.prototype, "showAliveRatio", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor34 = _applyDecoratedDescriptor(_class5.prototype, "maxPositionSampleUnits", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      }), _descriptor35 = _applyDecoratedDescriptor(_class5.prototype, "freezeDyingWavePositionAliveCount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor36 = _applyDecoratedDescriptor(_class5.prototype, "enableIconClickFocus", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor37 = _applyDecoratedDescriptor(_class5.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6362e7daf8af0d883ef7e04d63ca00a919222726.js.map