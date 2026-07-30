import { _decorator, Component, director } from 'cc';
import { GameManager } from './GameManager';
import { BattleArmyBrain } from './BattleArmyBrain';

const { ccclass, property } = _decorator;

@ccclass('LevelSettings')
export class LevelSettings extends Component {

    @property({
        tooltip: 'Total campaign levels used to normalize difficulty from level 1 to the final level.'
    })
    totalLevels = 300;

    @property({
        tooltip: 'Current campaign level. Level 1 is easiest; Total Levels is hardest.'
    })
    currentLevel = 1;

    @property({
        min: 0,
        step: 1,
        tooltip: 'Every Nth level is a boss fight. Use 0 to disable boss fights.'
    })
    bossStagePace = 5;

    @property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Initial CP Multiplier',
        tooltip: 'Multiplier applied only to enemy Initial CP on boss levels. Initial CP is not capped.'
    })
    bossInitialCombatPointMultiplier = 1.2;

    @property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Decision Accuracy Multiplier',
        tooltip: 'Multiplier applied only to enemy Decision Accuracy on boss levels. The result remains capped by Decision Accuracy Max.'
    })
    bossDecisionAccuracyMultiplier = 1.2;

    @property({
        min: 1,
        step: 0.1,
        displayName: 'Boss Max Alive Waves Multiplier',
        tooltip: 'Multiplier applied only to enemy Max Alive Waves on boss levels. The result remains capped by Max Alive Waves Max.'
    })
    bossMaxAliveWavesMultiplier = 1.2;

    @property({
        tooltip: 'Team affected by this component. Default 1 means team B/enemy.'
    })
    targetTeam = 1;

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property({ type: [BattleArmyBrain] })
    battleArmyBrains: BattleArmyBrain[] = [];

    @property({
        tooltip: 'Apply initial Combat Point curve to the selected team.'
    })
    allowCP = true;

    @property
    initialCombatPointMin = 600;

    @property
    initialCombatPointMax = 1040;

    @property({
        tooltip: 'Apply the AI decision accuracy curve. Accuracy affects unit choice only; target and lane selection stay tactical.'
    })
    allowDecisionAccuracy = true;

    @property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at level 1. Use 0 to bias unit choice toward lower-ranked scored candidates and no ranged support.'
    })
    decisionAccuracyMin = 0;

    @property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at the final level. Use 1 to keep the evaluator best unit choice. Target and lane selection stay tactical.'
    })
    decisionAccuracyMax = 1;

    @property({
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
    })
    allowInterval = true;

    @property({
        displayName: 'Easy Spawn Delay Min',
        tooltip: 'Shortest delay between spawn decisions at level 1.'
    })
    minSpawnIntervalMinLevel = 5.0;

    @property({
        displayName: 'Easy Spawn Delay Max',
        tooltip: 'Longest delay between spawn decisions at level 1. Keep this greater than or equal to Easy Spawn Delay Min.'
    })
    maxSpawnIntervalMinLevel = 6.0;

    @property({
        displayName: 'Hard Spawn Delay Min',
        tooltip: 'Shortest delay between spawn decisions at the final level. Lower values make the AI react more frequently.'
    })
    minSpawnIntervalMaxLevel = 2.7;

    @property({
        displayName: 'Hard Spawn Delay Max',
        tooltip: 'Longest delay between spawn decisions at the final level. Keep this greater than or equal to Hard Spawn Delay Min.'
    })
    maxSpawnIntervalMaxLevel = 3.7;

    @property({
        tooltip: 'Apply Max Alive Waves curve. Higher levels allow the enemy to keep more waves active.'
    })
    allowMaxWave = true;

    @property
    maxAliveWavesMin = 5;

    @property
    maxAliveWavesMax = 15;

    onLoad() {
        this.applyTelemetryLevelQuery();
        this.applyLevelSettings();
    }

    public applyLevelSettings() {
        const team =
            this.clampTeam(this.targetTeam);
        const t =
            this.getDifficulty01();
        const isBossLevel =
            this.isBossLevel();
        const bossCPMultiplier =
            this.getBossMultiplier(
                this.bossInitialCombatPointMultiplier,
                isBossLevel
            );
        const bossAccuracyMultiplier =
            this.getBossMultiplier(
                this.bossDecisionAccuracyMultiplier,
                isBossLevel
            );
        const bossMaxWaveMultiplier =
            this.getBossMultiplier(
                this.bossMaxAliveWavesMultiplier,
                isBossLevel
            );

        const manager =
            this.getGameManager();
        const battleBrains =
            this.getTargetBattleArmyBrains(team);

        if (
            this.allowCP &&
            manager &&
            manager.unitDatabase
        ) {
            const baseCP =
                Math.round(
                    this.lerp(
                        this.initialCombatPointMin,
                        this.initialCombatPointMax,
                        t
                    )
                );
            const cp =
                Math.round(
                    baseCP *
                    bossCPMultiplier
                );

            if (team === 0) {
                manager.unitDatabase.teamAInitialCombatPoint = cp;
            } else {
                manager.unitDatabase.teamBInitialCombatPoint = cp;
            }

            manager.initialCombatPoint[team] = cp;
            manager.combatPoint[team] = cp;
        }

        for (let i = 0; i < battleBrains.length; i++) {
            const brain = battleBrains[i];

            if (!brain) continue;

            if (this.allowDecisionAccuracy) {
                const baseAccuracy =
                    this.lerp(
                        this.decisionAccuracyMin,
                        this.decisionAccuracyMax,
                        t
                    );

                brain.decisionAccuracy =
                    Math.min(
                        this.clamp01(
                            this.decisionAccuracyMax
                        ),
                        this.clamp01(
                            baseAccuracy *
                            bossAccuracyMultiplier
                        )
                    );
            }

            if (this.allowInterval) {
                brain.minSpawnInterval =
                    this.lerp(
                        this.minSpawnIntervalMinLevel,
                        this.minSpawnIntervalMaxLevel,
                        t
                    );
                brain.maxSpawnInterval =
                    this.lerp(
                        this.maxSpawnIntervalMinLevel,
                        this.maxSpawnIntervalMaxLevel,
                        t
                    );
            }

            if (this.allowMaxWave) {
                const baseMaxAliveWaves =
                    Math.round(
                        this.lerp(
                            this.maxAliveWavesMin,
                            this.maxAliveWavesMax,
                            t
                        )
                    );

                brain.maxAliveWaves =
                    Math.round(
                        Math.min(
                            Math.max(
                                0,
                                this.maxAliveWavesMax
                            ),
                            baseMaxAliveWaves *
                            bossMaxWaveMultiplier
                        )
                    );
            }
        }
    }

    private getGameManager() {
        if (this.gameManager) {
            return this.gameManager;
        }

        const scene =
            director.getScene();

        if (!scene) return null;

        const managers =
            scene.getComponentsInChildren(
                GameManager
            );

        return managers.length > 0
            ? managers[0]
            : null;
    }

    private getTargetBattleArmyBrains(team: number) {
        const result: BattleArmyBrain[] = [];

        for (let i = 0; i < this.battleArmyBrains.length; i++) {
            const brain = this.battleArmyBrains[i];

            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;

            result.push(brain);
        }

        if (result.length > 0) {
            return result;
        }

        const scene =
            director.getScene();

        if (!scene) return result;

        const brains =
            scene.getComponentsInChildren(
                BattleArmyBrain
            );

        for (let i = 0; i < brains.length; i++) {
            const brain = brains[i];

            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;

            result.push(brain);
        }

        return result;
    }

    private applyTelemetryLevelQuery() {
        if (typeof window === 'undefined') return;
        if (!window.location) return;

        const params =
            new URLSearchParams(window.location.search);
        const totalLevels =
            this.getQueryInt(
                params,
                ['TotalLevels', 'totalLevels'],
                0
            );

        if (totalLevels <= 0) return;

        this.totalLevels =
            Math.max(1, totalLevels);
        this.currentLevel =
            Math.max(
                1,
                Math.min(
                    this.totalLevels,
                    this.getQueryInt(
                        params,
                        ['currentLevel'],
                        1
                    )
                )
            );
    }

    private getQueryInt(
        params: URLSearchParams,
        keys: string[],
        fallback: number
    ) {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value =
                params.get(key) ??
                params.get(`?${key}`);

            if (value === null) continue;

            const parsed = Number(value);

            if (Number.isFinite(parsed)) {
                return Math.floor(parsed);
            }
        }

        return fallback;
    }

    private getDifficulty01() {
        const total =
            Math.max(
                1,
                Math.floor(this.totalLevels)
            );

        const level =
            Math.max(
                1,
                Math.min(
                    total,
                    Math.floor(this.currentLevel)
                )
            );

        if (total <= 1) {
            return 1;
        }

        return (level - 1) / (total - 1);
    }

    private getBossMultiplier(
        configuredMultiplier: number,
        isBossLevel: boolean
    ) {
        if (!isBossLevel) {
            return 1;
        }

        return Math.max(
            1,
            Number.isFinite(
                configuredMultiplier
            )
                ? configuredMultiplier
                : 1
        );
    }

    private isBossLevel() {
        const pace =
            Math.max(
                0,
                Math.floor(this.bossStagePace)
            );

        if (pace <= 0) {
            return false;
        }

        const level =
            Math.max(
                1,
                Math.floor(this.currentLevel)
            );

        return level % pace === 0;
    }

    private clampTeam(team: number) {
        return team === 0 ? 0 : 1;
    }

    private clamp01(v: number) {
        return Math.max(
            0,
            Math.min(1, v)
        );
    }

    private lerp(a: number, b: number, t: number) {
        return a + (b - a) * this.clamp01(t);
    }
}
