System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, input, Input, KeyCode, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, SpectorDebugger;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      input = _cc.input;
      Input = _cc.Input;
      KeyCode = _cc.KeyCode;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "87939wfbU9LKL9PL0ZEiEaD", "SpectorDebugger", undefined);

      __checkObsolete__(['_decorator', 'Component', 'EventKeyboard', 'input', 'Input', 'KeyCode']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SpectorDebugger", SpectorDebugger = (_dec = ccclass('SpectorDebugger'), _dec2 = property({
        tooltip: 'Load SpectorJS for this run. Keep disabled outside render profiling sessions.'
      }), _dec3 = property({
        tooltip: 'Open the embedded SpectorJS panel after loading.'
      }), _dec4 = property({
        tooltip: 'Patch canvas/context tracking on start. This is useful for deeper captures, but has extra overhead.'
      }), _dec5 = property({
        tooltip: 'Capture WebGL commands after SpectorJS is ready.'
      }), _dec6 = property({
        tooltip: 'Maximum WebGL commands to capture. Higher values are heavier but closer to a full frame.'
      }), _dec7 = property({
        tooltip: 'Automatically download the captured SpectorJS report as a JSON file.'
      }), _dec8 = property({
        tooltip: 'Keep the last capture on window.__battleGameSpectorCapture for manual export from DevTools.'
      }), _dec9 = property({
        tooltip: 'Downloaded JSON file name prefix.'
      }), _dec10 = property({
        tooltip: 'Press F8 in browser preview/build to capture WebGL commands.'
      }), _dec11 = property({
        tooltip: 'Print SpectorJS setup/capture messages.'
      }), _dec(_class = (_class2 = class SpectorDebugger extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "enableSpector", _descriptor, this);

          _initializerDefineProperty(this, "showUIOnStart", _descriptor2, this);

          _initializerDefineProperty(this, "spyCanvasesOnStart", _descriptor3, this);

          _initializerDefineProperty(this, "captureOnStart", _descriptor4, this);

          _initializerDefineProperty(this, "captureCommandCount", _descriptor5, this);

          _initializerDefineProperty(this, "autoDownloadCaptureJson", _descriptor6, this);

          _initializerDefineProperty(this, "exposeLastCaptureOnWindow", _descriptor7, this);

          _initializerDefineProperty(this, "captureFilePrefix", _descriptor8, this);

          _initializerDefineProperty(this, "enableCaptureHotkey", _descriptor9, this);

          _initializerDefineProperty(this, "enableLog", _descriptor10, this);

          this.spector = null;
          this.loadingPromise = null;
          this.destroyed = false;
          this.captureListenerInstalled = false;
        }

        start() {
          if (!this.enableSpector || !this.isBrowser()) {
            return;
          }

          if (this.enableCaptureHotkey) {
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          }

          this.initializeSpector();
        }

        onDestroy() {
          this.destroyed = true;
          input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);

          if (this.spector && typeof this.spector.hideUI === 'function') {
            this.spector.hideUI();
          }
        }

        async captureNextFrame() {
          if (!this.enableSpector || !this.isBrowser()) {
            return;
          }

          const spector = await this.ensureSpector();

          if (!spector || this.destroyed) {
            return;
          }

          const canvas = this.findRenderCanvas();
          const commandCount = Math.max(1, Math.floor(this.captureCommandCount));

          if (!canvas) {
            console.warn('[SpectorDebugger] No render canvas found.');
            return;
          } // Spector's captureNextFrame relies on requestAnimationFrame hooks.
          // Cocos may cache RAF before this debug component loads, so command capture
          // is more reliable when Spector is injected from a scene component.


          if (typeof spector.captureCanvas === 'function') {
            spector.captureCanvas(canvas, commandCount);
            this.debugLog(`Canvas command capture requested. commands=${commandCount}`);
            return;
          }

          if (typeof spector.captureNextFrame === 'function') {
            spector.captureNextFrame(canvas);
            this.debugLog('Next-frame capture requested.');
            return;
          }

          console.warn('[SpectorDebugger] No compatible capture API found.');
        }

        async initializeSpector() {
          const spector = await this.ensureSpector();

          if (!spector || this.destroyed) {
            return;
          }

          if (this.spyCanvasesOnStart && typeof spector.spyCanvases === 'function') {
            spector.spyCanvases();
            this.debugLog('Canvas spying enabled.');
          }

          if (this.showUIOnStart && typeof spector.displayUI === 'function') {
            spector.displayUI();
            this.debugLog('UI opened.');
          }

          if (this.captureOnStart) {
            window.setTimeout(() => this.captureNextFrame(), 0);
          }
        }

        async ensureSpector() {
          if (this.spector) {
            return this.spector;
          }

          if (this.loadingPromise) {
            return this.loadingPromise;
          }

          this.loadingPromise = this.loadSpector();
          return this.loadingPromise;
        }

        async loadSpector() {
          try {
            var _spectorModule$defaul, _ref, _namespace$Spector, _SPECTOR;

            const spectorModule = await _context.import('spectorjs');
            const namespace = (_spectorModule$defaul = spectorModule == null ? void 0 : spectorModule.default) != null ? _spectorModule$defaul : spectorModule;
            const SpectorCtor = (_ref = (_namespace$Spector = namespace == null ? void 0 : namespace.Spector) != null ? _namespace$Spector : spectorModule == null ? void 0 : spectorModule.Spector) != null ? _ref : (_SPECTOR = window.SPECTOR) == null ? void 0 : _SPECTOR.Spector;

            if (!SpectorCtor) {
              throw new Error('SPECTOR.Spector constructor was not found.');
            }

            this.spector = new SpectorCtor();
            this.patchCanvasCaptureDefault(this.spector);
            this.installCaptureExport(this.spector);
            this.debugLog('SpectorJS loaded.');
            return this.spector;
          } catch (error) {
            this.loadingPromise = null;
            console.warn('[SpectorDebugger] Failed to load SpectorJS.', error);
            return null;
          }
        }

        patchCanvasCaptureDefault(spector) {
          if (!spector || typeof spector.captureCanvas !== 'function' || spector.__battleGameCapturePatched) {
            return;
          }

          const originalCaptureCanvas = spector.captureCanvas.bind(spector);

          spector.captureCanvas = (canvas, commandCount = 0, quickCapture = false, fullCapture = false) => {
            const safeCommandCount = commandCount > 0 ? commandCount : Math.max(1, Math.floor(this.captureCommandCount));
            return originalCaptureCanvas(canvas, safeCommandCount, quickCapture, fullCapture);
          };

          spector.__battleGameCapturePatched = true;
        }

        installCaptureExport(spector) {
          if (this.captureListenerInstalled || !(spector != null && spector.onCapture) || typeof spector.onCapture.add !== 'function') {
            return;
          }

          spector.onCapture.add(this.onCaptureComplete, this);
          this.captureListenerInstalled = true;
        }

        onCaptureComplete(capture) {
          if (this.exposeLastCaptureOnWindow) {
            window.__battleGameSpectorCapture = capture;
          }

          if (this.autoDownloadCaptureJson) {
            this.downloadCaptureJson(capture);
          }
        }

        downloadCaptureJson(capture) {
          try {
            const json = JSON.stringify(capture);
            const blob = new Blob([json], {
              type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.captureFilePrefix}-${this.getTimestampForFileName()}.json`;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 0);
            this.debugLog(`Capture JSON downloaded. bytes=${json.length}`);
          } catch (error) {
            console.warn('[SpectorDebugger] Failed to download capture JSON.', error);
          }
        }

        getTimestampForFileName() {
          return new Date().toISOString().replace(/[:.]/g, '-');
        }

        onKeyDown(event) {
          if (event.keyCode !== KeyCode.F8) {
            return;
          }

          this.captureNextFrame();
        }

        findRenderCanvas() {
          var _document$querySelect;

          return (_document$querySelect = document.querySelector('canvas')) != null ? _document$querySelect : undefined;
        }

        isBrowser() {
          return typeof window !== 'undefined' && typeof document !== 'undefined';
        }

        debugLog(message) {
          if (this.enableLog) {
            console.log(`[SpectorDebugger] ${message}`);
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "enableSpector", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "showUIOnStart", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spyCanvasesOnStart", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "captureOnStart", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "captureCommandCount", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 500;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "autoDownloadCaptureJson", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "exposeLastCaptureOnWindow", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "captureFilePrefix", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 'spector-capture';
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "enableCaptureHotkey", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "enableLog", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=326013c1c32f2621842468128bab7596b27e708d.js.map