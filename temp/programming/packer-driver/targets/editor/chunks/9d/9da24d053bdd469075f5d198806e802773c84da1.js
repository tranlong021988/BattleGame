System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, GameManager, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _crd, ccclass, property, SpawnBackPressureGate;

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
      Label = _cc.Label;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ab22eBQ5JxGWo2Ongjhp454", "SpawnBackPressureGate", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SpawnBackPressureGate", SpawnBackPressureGate = (_dec = ccclass('SpawnBackPressureGate'), _dec2 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec3 = property({
        type: [Component]
      }), _dec4 = property(Label), _dec(_class = (_class2 = class SpawnBackPressureGate extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "gameManager", _descriptor, this);

          _initializerDefineProperty(this, "armyBrains", _descriptor2, this);

          _initializerDefineProperty(this, "autoFindGameManager", _descriptor3, this);

          _initializerDefineProperty(this, "checkInterval", _descriptor4, this);

          _initializerDefineProperty(this, "enableFpsGate", _descriptor5, this);

          _initializerDefineProperty(this, "minFpsToSpawn", _descriptor6, this);

          _initializerDefineProperty(this, "lowFpsGraceTime", _descriptor7, this);

          _initializerDefineProperty(this, "lowFpsHoldDuration", _descriptor8, this);

          _initializerDefineProperty(this, "fpsSmooth", _descriptor9, this);

          _initializerDefineProperty(this, "enableAliveUnitGate", _descriptor10, this);

          _initializerDefineProperty(this, "maxAliveUnitsToSpawn", _descriptor11, this);

          _initializerDefineProperty(this, "resumeAliveUnits", _descriptor12, this);

          _initializerDefineProperty(this, "enableWaveGate", _descriptor13, this);

          _initializerDefineProperty(this, "maxAliveWavesToSpawn", _descriptor14, this);

          _initializerDefineProperty(this, "resumeAliveWaves", _descriptor15, this);

          _initializerDefineProperty(this, "minimumPauseDuration", _descriptor16, this);

          _initializerDefineProperty(this, "debugLabel", _descriptor17, this);

          _initializerDefineProperty(this, "enableDebugLog", _descriptor18, this);

          this.smoothedFps = 60;
          this.lowFpsTimer = 0;
          this.pauseTimer = 0;
          this.checkTimer = 0;
          this.paused = false;
          this.originalAutoSpawn = false;
          this.originalBrainEnabled = [];
          this.reason = '';
        }

        start() {
          if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).instance;
          }

          this.captureOriginalStates();
        }

        update(deltaTime) {
          this.updateFps(deltaTime);
          this.checkTimer += deltaTime;

          if (this.pauseTimer > 0) {
            this.pauseTimer -= deltaTime;
          }

          if (this.checkTimer < this.checkInterval) {
            return;
          }

          this.checkTimer = 0;
          this.evaluateSpawnPressure();
        }

        captureOriginalStates() {
          if (this.gameManager) {
            this.originalAutoSpawn = this.gameManager.enableAutoSpawn;
          }

          this.originalBrainEnabled.length = 0;

          for (let i = 0; i < this.armyBrains.length; i++) {
            const brain = this.armyBrains[i];
            this.originalBrainEnabled[i] = brain ? brain.enabled : false;
          }
        }

        updateFps(deltaTime) {
          if (deltaTime <= 0) return;
          const instantFps = 1 / deltaTime;
          const t = 1 - Math.exp(-this.fpsSmooth * deltaTime);
          this.smoothedFps = this.smoothedFps + (instantFps - this.smoothedFps) * t;
        }

        evaluateSpawnPressure() {
          const aliveUnits = this.getAliveUnitCount();
          const aliveWaves = this.getAliveWaveCount();
          let shouldPause = false;
          let newReason = '';

          if (this.enableFpsGate) {
            if (this.smoothedFps < this.minFpsToSpawn) {
              this.lowFpsTimer += this.checkInterval;
            } else {
              this.lowFpsTimer = 0;
            }

            if (this.lowFpsTimer >= this.lowFpsGraceTime) {
              shouldPause = true;
              newReason = `LOW_FPS ${this.smoothedFps.toFixed(1)} < ${this.minFpsToSpawn}`;
            }
          }

          if (this.enableAliveUnitGate && aliveUnits >= this.maxAliveUnitsToSpawn) {
            shouldPause = true;
            newReason = `TOO_MANY_UNITS ${aliveUnits} >= ${this.maxAliveUnitsToSpawn}`;
          }

          if (this.enableWaveGate && aliveWaves >= this.maxAliveWavesToSpawn) {
            shouldPause = true;
            newReason = `TOO_MANY_WAVES ${aliveWaves} >= ${this.maxAliveWavesToSpawn}`;
          }

          if (shouldPause) {
            this.pauseTimer = Math.max(this.pauseTimer, this.lowFpsHoldDuration, this.minimumPauseDuration);
            this.setPaused(true, newReason);
            this.updateDebugLabel(aliveUnits, aliveWaves);
            return;
          }

          if (this.paused) {
            const canResumeByFps = !this.enableFpsGate || this.smoothedFps >= this.minFpsToSpawn;
            const canResumeByUnits = !this.enableAliveUnitGate || aliveUnits <= this.resumeAliveUnits;
            const canResumeByWaves = !this.enableWaveGate || aliveWaves <= this.resumeAliveWaves;
            const canResume = this.pauseTimer <= 0 && canResumeByFps && canResumeByUnits && canResumeByWaves;

            if (canResume) {
              this.setPaused(false, 'RESUME');
            }
          }

          this.updateDebugLabel(aliveUnits, aliveWaves);
        }

        setPaused(value, reason) {
          if (this.paused === value) {
            this.reason = reason;
            return;
          }

          this.paused = value;
          this.reason = reason;

          if (value) {
            this.pauseSpawning();
            this.log(`PAUSE spawn: ${reason}`);
          } else {
            this.resumeSpawning();
            this.lowFpsTimer = 0;
            this.log('RESUME spawn');
          }
        }

        pauseSpawning() {
          if (this.gameManager) {
            this.gameManager.enableAutoSpawn = false;
          }

          for (let i = 0; i < this.armyBrains.length; i++) {
            const brain = this.armyBrains[i];
            if (!brain) continue;
            brain.enabled = false;
          }
        }

        resumeSpawning() {
          if (this.gameManager) {
            this.gameManager.enableAutoSpawn = this.originalAutoSpawn;
          }

          for (let i = 0; i < this.armyBrains.length; i++) {
            var _this$originalBrainEn;

            const brain = this.armyBrains[i];
            if (!brain) continue;
            brain.enabled = (_this$originalBrainEn = this.originalBrainEnabled[i]) != null ? _this$originalBrainEn : true;
          }
        }

        getAliveUnitCount() {
          if (!this.gameManager) return 0;
          const gm = this.gameManager;

          if (typeof gm.aliveCount !== 'undefined' && gm.aliveCount && gm.aliveCount.length >= 2) {
            return Math.max(0, gm.aliveCount[0]) + Math.max(0, gm.aliveCount[1]);
          }

          let count = 0;

          if (typeof gm.getAliveUnits === 'function') {
            const a = gm.getAliveUnits(0) || [];
            const b = gm.getAliveUnits(1) || [];
            count = a.length + b.length;
          }

          return count;
        }

        getAliveWaveCount() {
          if (!this.gameManager) return 0;
          const gm = this.gameManager;
          if (!gm.waves) return 0;
          let count = 0;

          for (let i = 0; i < gm.waves.length; i++) {
            const wave = gm.waves[i];
            if (!wave) continue;

            if (typeof wave.isDead === 'function' && !wave.isDead()) {
              count++;
            }
          }

          return count;
        }

        updateDebugLabel(aliveUnits, aliveWaves) {
          if (!this.debugLabel) return;
          this.debugLabel.string = `SpawnGate: ${this.paused ? 'PAUSED' : 'OK'}\n` + `FPS: ${this.smoothedFps.toFixed(1)}\n` + `Units: ${aliveUnits}\n` + `Waves: ${aliveWaves}\n` + `${this.reason}`;
        }

        log(msg) {
          if (!this.enableDebugLog) return;
          console.log(`[SpawnBackPressureGate] ${msg}`);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "armyBrains", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "autoFindGameManager", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "checkInterval", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "enableFpsGate", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "minFpsToSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 24;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "lowFpsGraceTime", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.8;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "lowFpsHoldDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.5;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "fpsSmooth", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 6;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "enableAliveUnitGate", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveUnitsToSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 300;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "resumeAliveUnits", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 260;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "enableWaveGate", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "maxAliveWavesToSpawn", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 60;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "resumeAliveWaves", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 45;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "minimumPauseDuration", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "debugLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "enableDebugLog", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9da24d053bdd469075f5d198806e802773c84da1.js.map