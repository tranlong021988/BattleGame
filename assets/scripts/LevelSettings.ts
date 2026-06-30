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

    @property({
        tooltip: 'Apply AI Intelligence curve. Higher values make ArmyBrain choose better counter units.'
    })
    allowAI = true;

    @property({
        tooltip: 'Apply Lane Awareness curve. Higher values make ArmyBrain value lane pressure more accurately.'
    })
    allowLane = true;

    @property({
        tooltip: 'Apply Counter Same Lane Chance curve. Higher values make counter waves spawn in the threatened lane more often.'
    })
    allowSameLane = true;

    @property({
        tooltip: 'Apply spawn interval curve. Higher levels reduce min/max spawn delay so the enemy reacts faster.'
    })
    allowInterval = true;

    @property({
        tooltip: 'Apply Max Alive Waves curve. Higher levels allow the enemy to keep more waves active.'
    })
    allowMaxWave = true;

    @property({
        tooltip: 'Apply Aggressive Forward curve. Higher levels unlock more lane-empty raid attempts.'
    })
    allowAggressive = true;

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
                    this.lerp(70, 180, t)
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
                brain.aiIntelligence = t;
            }

            if (this.allowLane) {
                brain.laneAwareness = t;
            }

            if (this.allowSameLane) {
                brain.counterSameLaneChance =
                    this.lerp(0.4, 1, t);
            }

            if (this.allowInterval) {
                brain.minSpawnInterval =
                    this.lerp(5.0, 2.7, t);
                brain.maxSpawnInterval =
                    this.lerp(6.0, 3.7, t);
            }

            if (this.allowMaxWave) {
                brain.maxAliveWaves =
                    Math.round(
                        this.lerp(5, 15, t)
                    );
            }

            if (this.allowAggressive) {
                const raidT =
                    this.clamp01(
                        (t - 0.45) / 0.55
                    );

                brain.aggressiveForwardChance =
                    raidT * 0.25;
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
