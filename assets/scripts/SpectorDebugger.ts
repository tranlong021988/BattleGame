import { _decorator, Component, EventKeyboard, input, Input, KeyCode } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('SpectorDebugger')
export class SpectorDebugger extends Component {
    @property({ tooltip: 'Load SpectorJS for this run. Keep disabled outside render profiling sessions.' })
    enableSpector = false;

    @property({ tooltip: 'Open the embedded SpectorJS panel after loading.' })
    showUIOnStart = true;

    @property({ tooltip: 'Patch canvas/context tracking on start. This is useful for deeper captures, but has extra overhead.' })
    spyCanvasesOnStart = false;

    @property({ tooltip: 'Capture WebGL commands after SpectorJS is ready.' })
    captureOnStart = false;

    @property({ tooltip: 'Maximum WebGL commands to capture. Higher values are heavier but closer to a full frame.' })
    captureCommandCount = 500;

    @property({ tooltip: 'Automatically download the captured SpectorJS report as a JSON file.' })
    autoDownloadCaptureJson = true;

    @property({ tooltip: 'Keep the last capture on window.__battleGameSpectorCapture for manual export from DevTools.' })
    exposeLastCaptureOnWindow = true;

    @property({ tooltip: 'Downloaded JSON file name prefix.' })
    captureFilePrefix = 'spector-capture';

    @property({ tooltip: 'Press F8 in browser preview/build to capture WebGL commands.' })
    enableCaptureHotkey = true;

    @property({ tooltip: 'Print SpectorJS setup/capture messages.' })
    enableLog = true;

    private spector: any = null;
    private loadingPromise: Promise<any> | null = null;
    private destroyed = false;
    private captureListenerInstalled = false;

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

    public async captureNextFrame() {
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
        }

        // Spector's captureNextFrame relies on requestAnimationFrame hooks.
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

    private async initializeSpector() {
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

    private async ensureSpector() {
        if (this.spector) {
            return this.spector;
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this.loadSpector();
        return this.loadingPromise;
    }

    private async loadSpector() {
        try {
            const spectorModule: any = await import('spectorjs');
            const namespace = spectorModule?.default ?? spectorModule;
            const SpectorCtor = namespace?.Spector ?? spectorModule?.Spector ?? (window as any).SPECTOR?.Spector;

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

    private patchCanvasCaptureDefault(spector: any) {
        if (!spector || typeof spector.captureCanvas !== 'function' || spector.__battleGameCapturePatched) {
            return;
        }

        const originalCaptureCanvas = spector.captureCanvas.bind(spector);
        spector.captureCanvas = (canvas: HTMLCanvasElement, commandCount = 0, quickCapture = false, fullCapture = false) => {
            const safeCommandCount = commandCount > 0
                ? commandCount
                : Math.max(1, Math.floor(this.captureCommandCount));

            return originalCaptureCanvas(canvas, safeCommandCount, quickCapture, fullCapture);
        };
        spector.__battleGameCapturePatched = true;
    }

    private installCaptureExport(spector: any) {
        if (this.captureListenerInstalled || !spector?.onCapture || typeof spector.onCapture.add !== 'function') {
            return;
        }

        spector.onCapture.add(this.onCaptureComplete, this);
        this.captureListenerInstalled = true;
    }

    private onCaptureComplete(capture: any) {
        if (this.exposeLastCaptureOnWindow) {
            (window as any).__battleGameSpectorCapture = capture;
        }

        if (this.autoDownloadCaptureJson) {
            this.downloadCaptureJson(capture);
        }
    }

    private downloadCaptureJson(capture: any) {
        try {
            const json = JSON.stringify(capture);
            const blob = new Blob([json], { type: 'application/json' });
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

    private getTimestampForFileName() {
        return new Date()
            .toISOString()
            .replace(/[:.]/g, '-');
    }

    private onKeyDown(event: EventKeyboard) {
        if (event.keyCode !== KeyCode.F8) {
            return;
        }

        this.captureNextFrame();
    }

    private findRenderCanvas(): HTMLCanvasElement | undefined {
        return document.querySelector('canvas') ?? undefined;
    }

    private isBrowser() {
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }

    private debugLog(message: string) {
        if (this.enableLog) {
            console.log(`[SpectorDebugger] ${message}`);
        }
    }
}
