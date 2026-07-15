import { _decorator, Component, director } from 'cc';
import { GameManager } from './GameManager';
import { SmartArmyBrain } from './SmartArmyBrain';

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
        tooltip: 'Team affected by this component. Default 1 means team B/enemy.'
    })
    targetTeam = 1;

    @property(GameManager)
    gameManager: GameManager | null = null;

    @property({ type: [SmartArmyBrain] })
    armyBrains: SmartArmyBrain[] = [];

    @property({
        tooltip: 'Apply initial Combat Point curve to the selected team.'
    })
    allowCP = true;

    @property
    initialCombatPointMin = 70;

    @property
    initialCombatPointMax = 180;

    @property({
        tooltip: 'Apply the SmartArmyBrain accuracy curve. At accuracy A: smart=A, deliberate mistake=(1-A)^2, random=A*(1-A). Start near 0.1 to keep the easiest AI weak without locking it into deterministic troop loops.'
    })
    allowDecisionAccuracy = true;

    @property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at level 1. Default 0.1 keeps the AI extremely weak but allows enough variation to avoid the Accuracy 0 troop loop.'
    })
    decisionAccuracyMin = 0.1;

    @property({
        min: 0,
        max: 1,
        tooltip: 'Decision Accuracy at the final level. Use 1 for fully intelligent target, counter-unit, and lane decisions.'
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

    @property({
        tooltip: 'Apply Aggressive Forward curve. Higher levels unlock more lane-empty raid attempts.'
    })
    allowAggressive = true;

    @property
    aggressiveForwardChanceMin = 0;

    @property
    aggressiveForwardChanceMax = 0.25;

    @property({
        min: 0,
        max: 1,
        tooltip: 'At low levels, empty-lane aggressive raids can use random affordable units. At high levels, they can prefer the fastest affordable raider more often.'
    })
    aggressiveFastestEntryChanceMin = 0;

    @property({
        min: 0,
        max: 1,
        tooltip: 'Final-level chance that an empty-lane aggressive raid picks the fastest affordable unit instead of a random affordable unit.'
    })
    aggressiveFastestEntryChanceMax = 1;

    @property({
        min: 0,
        max: 1,
        tooltip: 'Difficulty threshold where aggressive-forward raid chance starts increasing.'
    })
    aggressiveForwardUnlockAt = 0.45;

    @property({
        tooltip: 'Apply SmartArmyBrain fast-react chance curve. The maximum defaults to immediate reaction at the final level.'
    })
    allowFastReact = true;

    @property
    fastReactCounterChanceMin = 0;

    @property
    fastReactCounterChanceMax = 1;

    onLoad() {
        this.applyLevelSettings();
    }

    public applyLevelSettings() {
        const team =
            this.clampTeam(this.targetTeam);
        const t =
            this.getDifficulty01();

        const manager =
            this.getGameManager();
        const brains =
            this.getTargetSmartArmyBrains(team);

        if (
            this.allowCP &&
            manager &&
            manager.unitDatabase
        ) {
            const cp =
                Math.round(
                    this.lerp(
                        this.initialCombatPointMin,
                        this.initialCombatPointMax,
                        t
                    )
                );

            if (team === 0) {
                manager.unitDatabase.teamAInitialCombatPoint = cp;
            } else {
                manager.unitDatabase.teamBInitialCombatPoint = cp;
            }

            manager.initialCombatPoint[team] = cp;
            manager.combatPoint[team] = cp;
        }

        for (let i = 0; i < brains.length; i++) {
            const brain = brains[i];

            if (!brain) continue;

            if (this.allowDecisionAccuracy) {
                brain.decisionAccuracy =
                    this.clamp01(
                        this.lerp(
                            this.decisionAccuracyMin,
                            this.decisionAccuracyMax,
                            t
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
                brain.maxAliveWaves =
                    Math.round(
                        this.lerp(
                            this.maxAliveWavesMin,
                            this.maxAliveWavesMax,
                            t
                        )
                    );
            }

            if (this.allowAggressive) {
                const unlockAt =
                    this.clamp01(
                        this.aggressiveForwardUnlockAt
                    );
                const raidT =
                    unlockAt >= 1
                        ? (t >= 1 ? 1 : 0)
                        : this.clamp01(
                            (t - unlockAt) /
                            (1 - unlockAt)
                        );

                brain.aggressiveForwardChance =
                    this.lerp(
                        this.aggressiveForwardChanceMin,
                        this.aggressiveForwardChanceMax,
                        raidT
                    );
                brain.aggressiveFastestEntryChance =
                    this.lerp(
                        this.aggressiveFastestEntryChanceMin,
                        this.aggressiveFastestEntryChanceMax,
                        raidT
                    );
            }

            if (this.allowFastReact) {
                brain.fastReactCounterChance =
                    this.lerp(
                        this.fastReactCounterChanceMin,
                        this.fastReactCounterChanceMax,
                        t
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

    private getTargetSmartArmyBrains(team: number) {
        const result: SmartArmyBrain[] = [];

        for (let i = 0; i < this.armyBrains.length; i++) {
            const brain = this.armyBrains[i];

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
                SmartArmyBrain
            );

        for (let i = 0; i < brains.length; i++) {
            const brain = brains[i];

            if (!brain) continue;
            if (this.clampTeam(brain.team) !== team) continue;

            result.push(brain);
        }

        return result;
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
