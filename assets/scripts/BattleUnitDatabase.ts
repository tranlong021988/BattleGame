import { _decorator, Component, Node, Prefab } from 'cc';
import { UnitType } from './BattleTypes';

const { ccclass, property } = _decorator;

@ccclass('UnitPrefabEntry')
export class UnitPrefabEntry {

    @property
    name: string = '';

    @property(Prefab)
    prefab: Prefab | null = null;

    @property({ type: UnitType })
    unitType: UnitType = UnitType.LightSword;

    @property
    unitCount: number = 1;

    @property
    prewarmCount: number = 0;

    @property
    maxSpeed: number = 2;

    @property
    health: number = 30;

    @property
    damage: number = 5;

    @property
    defense: number = 0;

    @property
    combatPointCost: number = 10;

    @property
    killReward: number = 1;

    @property
    counterKillReward: number = 1;
}

@ccclass('HeroEntry')
export class HeroEntry {

    @property
    name: string = 'hero';

    @property(Node)
    heroNode: Node | null = null;

    @property({ type: UnitType })
    unitType: UnitType = UnitType.LightSword;

    @property
    maxSpeed: number = 0;

    @property
    health: number = 500;

    @property
    damage: number = 10;

    @property
    defense: number = 0;

    @property
    killReward: number = 0;

    @property
    counterKillReward: number = 0;
}

@ccclass('BattleUnitDatabase')
export class BattleUnitDatabase extends Component {

    @property
    enableCombatPoint = true;

    @property
    teamAMaxCombatPoint = 100;

    @property
    teamBMaxCombatPoint = 100;

    @property(HeroEntry)
    teamAHero: HeroEntry = new HeroEntry();

    @property(HeroEntry)
    teamBHero: HeroEntry = new HeroEntry();

    @property({ type: [UnitPrefabEntry] })
    teamAUnits: UnitPrefabEntry[] = [];

    @property({ type: [UnitPrefabEntry] })
    teamBUnits: UnitPrefabEntry[] = [];

    public getTeamEntries(team: number): UnitPrefabEntry[] {
        return team === 0
            ? this.teamAUnits
            : this.teamBUnits;
    }

    public getHeroEntry(team: number): HeroEntry {
        return team === 0
            ? this.teamAHero
            : this.teamBHero;
    }

    public getMaxCombatPoint(team: number): number {
        return team === 0
            ? this.teamAMaxCombatPoint
            : this.teamBMaxCombatPoint;
    }

    public getEntry(
        team: number,
        unitName: string
    ): UnitPrefabEntry | null {

        const entries = this.getTeamEntries(team);

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!entry) continue;

            if (entry.name === unitName) {
                return entry;
            }
        }

        return null;
    }
}