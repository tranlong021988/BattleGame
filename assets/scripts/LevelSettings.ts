import { _decorator, Component, director } from 'cc';
import { GameManager } from './GameManager';
import { ArmyBrain } from './ArmyBrain';

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

    @property({ type: [ArmyBrain] })
    armyBrains: ArmyBrain[] = [];

    @property({
        tooltip: 'Apply initial Combat Point curve to the selected team.'
    })
    allowCP = true;

    @property
    initialCombatPointMin = 70;

    @property
    initialCombatPointMax = 180;

    @property({
        tooltip: 'Apply AI Intelligence curve. Higher values make ArmyBrain choose better counter units.'
    })
    allowAI = true;

    @property
    aiIntelligenceMin = 0;

    @property
    aiIntelligenceMax = 1;

    @property({
        tooltip: 'Apply Lane Awareness curve. Higher values make ArmyBrain value lane pressure more accurately.'
    })
    allowLane = true;

    @property
    laneAwarenessMin = 0;

    @property
    laneAwarenessMax = 1;

    @property({
        tooltip: 'Apply Counter Same Lane Chance curve. Higher values make counter waves spawn in the threatened lane more often.'
    })
    allowSameLane = true;

    @property
    counterSameLaneChanceMin = 0.4;

    @property
    counterSameLaneChanceMax = 1;

    @property({
        tooltip: 'Apply Fast React Chance curve. At max level, ArmyBrain always attempts eligible fast-react counters.'
    })
    allowFastReact = true;

    @property
    fastReactChanceMin = 0;

    @property
    fastReactChanceMax = 1;

    @property({
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
    })
    allowInterval = true;

    @property
    minSpawnIntervalMinLevel = 5.0;

    @property
    minSpawnIntervalMaxLevel = 2.7;

    @property
    maxSpawnIntervalMinLevel = 6.0;

    @property
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
        tooltip: 'Difficulty threshold where aggressive-forward raid chance starts increasing.'
    })
    aggressiveForwardUnlockAt = 0.45;

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
            this.getTargetArmyBrains(team);

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

            if (this.allowAI) {
                brain.aiIntelligence =
                    this.lerp(
                        this.aiIntelligenceMin,
                        this.aiIntelligenceMax,
                        t
                    );
            }

            if (this.allowLane) {
                brain.laneAwareness =
                    this.lerp(
                        this.laneAwarenessMin,
                        this.laneAwarenessMax,
                        t
                    );
            }

            if (this.allowSameLane) {
                brain.counterSameLaneChance =
                    this.lerp(
                        this.counterSameLaneChanceMin,
                        this.counterSameLaneChanceMax,
                        t
                    );
            }

            if (this.allowFastReact) {
                brain.fastReactChance =
                    this.lerp(
                        this.fastReactChanceMin,
                        this.fastReactChanceMax,
                        t
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

    private getTargetArmyBrains(team: number) {
        const result: ArmyBrain[] = [];

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
                ArmyBrain
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
