import {
    _decorator,
    Component,
    Label,
} from 'cc';

import { GameManager } from './GameManager';

const { ccclass, property } = _decorator;

@ccclass('SpawnBackPressureGate')
export class SpawnBackPressureGate extends Component {

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property({ type: [Component] })
    armyBrains: Component[] = [];

    @property
    autoFindGameManager = true;

    @property
    checkInterval = 0.2;

    @property
    enableFpsGate = true;

    @property
    minFpsToSpawn = 24;

    @property
    lowFpsGraceTime = 0.8;

    @property
    lowFpsHoldDuration = 1.5;

    @property
    fpsSmooth = 6;

    @property
    enableAliveUnitGate = true;

    @property
    maxAliveUnitsToSpawn = 300;

    @property
    resumeAliveUnits = 260;

    @property
    enableWaveGate = true;

    @property
    maxAliveWavesToSpawn = 60;

    @property
    resumeAliveWaves = 45;

    @property
    minimumPauseDuration = 0.5;

    @property(Label)
    debugLabel: Label | null = null;

    @property
    enableDebugLog = false;

    private smoothedFps = 60;
    private lowFpsTimer = 0;
    private pauseTimer = 0;
    private checkTimer = 0;

    private paused = false;
    private originalAutoSpawn = false;
    private originalBrainEnabled: boolean[] = [];

    private reason = '';

    start() {
        if (!this.gameManager && this.autoFindGameManager) {
            this.gameManager = GameManager.instance;
        }

        this.captureOriginalStates();
    }

    update(deltaTime: number) {
        this.updateFps(deltaTime);

        this.checkTimer += deltaTime;
        const safeCheckInterval = this.getSafeCheckInterval();

        if (this.pauseTimer > 0) {
            this.pauseTimer -= deltaTime;
        }

        if (this.checkTimer < safeCheckInterval) {
            return;
        }

        this.checkTimer = 0;

        this.evaluateSpawnPressure(safeCheckInterval);
    }

    private captureOriginalStates() {
        if (this.gameManager) {
            this.originalAutoSpawn =
                this.gameManager.enableAutoSpawn;
        }

        this.originalBrainEnabled.length = 0;

        for (let i = 0; i < this.armyBrains.length; i++) {
            const brain = this.armyBrains[i];
            this.originalBrainEnabled[i] =
                brain ? brain.enabled : false;
        }
    }

    private updateFps(deltaTime: number) {
        if (deltaTime <= 0) return;

        const instantFps = 1 / deltaTime;

        const t =
            1 - Math.exp(-this.fpsSmooth * deltaTime);

        this.smoothedFps =
            this.smoothedFps +
            (instantFps - this.smoothedFps) * t;
    }

    private evaluateSpawnPressure(checkDeltaTime: number) {
        const aliveUnits = this.getAliveUnitCount();
        const aliveWaves = this.getAliveWaveCount();

        let shouldPause = false;
        let newReason = '';

        if (this.enableFpsGate) {
            if (this.smoothedFps < this.minFpsToSpawn) {
                this.lowFpsTimer += checkDeltaTime;
            } else {
                this.lowFpsTimer = 0;
            }

            if (this.lowFpsTimer >= this.lowFpsGraceTime) {
                shouldPause = true;
                newReason =
                    `LOW_FPS ${this.smoothedFps.toFixed(1)} < ${this.minFpsToSpawn}`;
            }
        }

        if (
            this.enableAliveUnitGate &&
            aliveUnits >= this.maxAliveUnitsToSpawn
        ) {
            shouldPause = true;
            newReason =
                `TOO_MANY_UNITS ${aliveUnits} >= ${this.maxAliveUnitsToSpawn}`;
        }

        if (
            this.enableWaveGate &&
            aliveWaves >= this.maxAliveWavesToSpawn
        ) {
            shouldPause = true;
            newReason =
                `TOO_MANY_WAVES ${aliveWaves} >= ${this.maxAliveWavesToSpawn}`;
        }

        if (shouldPause) {
            this.pauseTimer = Math.max(
                this.pauseTimer,
                this.lowFpsHoldDuration,
                this.minimumPauseDuration
            );

            this.setPaused(true, newReason);
            this.updateDebugLabel(aliveUnits, aliveWaves);
            return;
        }

        if (this.paused) {
            const canResumeByFps =
                !this.enableFpsGate ||
                this.smoothedFps >= this.minFpsToSpawn;

            const canResumeByUnits =
                !this.enableAliveUnitGate ||
                aliveUnits <= this.resumeAliveUnits;

            const canResumeByWaves =
                !this.enableWaveGate ||
                aliveWaves <= this.resumeAliveWaves;

            const canResume =
                this.pauseTimer <= 0 &&
                canResumeByFps &&
                canResumeByUnits &&
                canResumeByWaves;

            if (canResume) {
                this.setPaused(false, 'RESUME');
            }
        }

        this.updateDebugLabel(aliveUnits, aliveWaves);
    }

    private getSafeCheckInterval() {
        return Math.max(
            0.016,
            this.checkInterval
        );
    }

    private setPaused(value: boolean, reason: string) {
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

    private pauseSpawning() {
        if (this.gameManager) {
            this.gameManager.enableAutoSpawn = false;
        }

        for (let i = 0; i < this.armyBrains.length; i++) {
            const brain = this.armyBrains[i];

            if (!brain) continue;

            brain.enabled = false;
        }
    }

    private resumeSpawning() {
        if (this.gameManager) {
            this.gameManager.enableAutoSpawn =
                this.originalAutoSpawn;
        }

        for (let i = 0; i < this.armyBrains.length; i++) {
            const brain = this.armyBrains[i];

            if (!brain) continue;

            brain.enabled =
                this.originalBrainEnabled[i] ?? true;
        }
    }

    private getAliveUnitCount() {
        if (!this.gameManager) return 0;

        const gm: any = this.gameManager;

        if (
            typeof gm.aliveCount !== 'undefined' &&
            gm.aliveCount &&
            gm.aliveCount.length >= 2
        ) {
            return Math.max(0, gm.aliveCount[0]) +
                Math.max(0, gm.aliveCount[1]);
        }

        let count = 0;

        if (typeof gm.getAliveUnits === 'function') {
            const a = gm.getAliveUnits(0) || [];
            const b = gm.getAliveUnits(1) || [];
            count = a.length + b.length;
        }

        return count;
    }

    private getAliveWaveCount() {
        if (!this.gameManager) return 0;

        const gm: any = this.gameManager;

        if (!gm.waves) return 0;

        let count = 0;

        for (let i = 0; i < gm.waves.length; i++) {
            const wave = gm.waves[i];

            if (!wave) continue;

            if (
                typeof wave.isDead === 'function' &&
                !wave.isDead()
            ) {
                count++;
            }
        }

        return count;
    }

    private updateDebugLabel(
        aliveUnits: number,
        aliveWaves: number
    ) {
        if (!this.debugLabel) return;

        this.debugLabel.string =
            `SpawnGate: ${this.paused ? 'PAUSED' : 'OK'}\n` +
            `FPS: ${this.smoothedFps.toFixed(1)}\n` +
            `Units: ${aliveUnits}\n` +
            `Waves: ${aliveWaves}\n` +
            `${this.reason}`;
    }

    private log(msg: string) {
        if (!this.enableDebugLog) return;

        console.log(
            `[SpawnBackPressureGate] ${msg}`
        );
    }
}
