import {
    _decorator,
    Color,
    Component,
    Material,
    Node,
    Prefab,
} from 'cc';
import { UnitFamily } from './BattleTypes';

const { ccclass, property } = _decorator;

@ccclass('UnitPrefabEntry')
export class UnitPrefabEntry {

    @property
    name: string = '';

    @property(Prefab)
    prefab: Prefab | null = null;

    @property(Prefab)
    waveBannerPrefab: Prefab | null = null;

    @property({
        min: 0,
        step: 1,
        tooltip:
            'Icon index in the shared wave banner sheet. Runtime sends this as an instanced attribute so banners can keep one shared material.',
    })
    waveBannerIconId: number = 0;

    @property({ type: UnitFamily })
    family: UnitFamily = UnitFamily.Spear;

    @property({
        min: 1,
        max: 3,
        step: 1,
        tooltip: 'Upgrade tier for this family. Counter rules ignore tier and use Family only.',
    })
    tier: number = 1;

    @property({
        tooltip: 'Only unlocked entries can be selected or spawned by player, AI, debug, or direct spawn paths.'
    })
    unlocked: boolean = true;

    @property
    unitCount: number = 1;

    @property
    maxUnitPerRow: number = 8;

    @property
    squareFormationWidth: number = 4;

    @property
    spaceBetweenUnit: number = 1.5;

    @property
    spaceBetweenRow: number = 1.5;

    @property
    prewarmCount: number = 0;

    @property
    maxSpeed: number = 2;

    @property({
        tooltip:
            'Allows hard-separated units to push this unit even while it is busy/engaged and normally locked.',
    })
    canBePush: boolean = false;

    @property({
        tooltip:
            'Allows same-team units that are in forward/aggressive-forward mode to pass through this unit instead of treating it as a formation blocker.',
    })
    canBePassedThroughByForwardAlly: boolean = false;

    @property
    attackRange: number = 1.2;

    @property
    attackIntervalMin: number = 0.4;

    @property
    attackIntervalMax: number = 0.45;

    @property
    health: number = 30;

    @property
    damage: number = 5;

    @property
    defense: number = 0;

    @property
    combatPointCost: number = 10;
}

@ccclass('HeroEntry')
export class HeroEntry {

    @property
    name: string = 'hero';

    @property(Node)
    heroNode: Node | null = null;

    @property({ type: UnitFamily })
    family: UnitFamily = UnitFamily.Sword;

    @property({
        min: 1,
        max: 3,
        step: 1,
    })
    tier: number = 1;

    @property
    maxSpeed: number = 0;

    @property
    guardDistance: number = 6;

    @property
    health: number = 500;

    @property
    damage: number = 10;

    @property
    defense: number = 0;

    @property
    combatPointBountyValue: number = 0;
}

@ccclass('BattleUnitDatabase')
export class BattleUnitDatabase extends Component {

    @property
    enableCombatPoint = true;

    @property
    teamAInitialCombatPoint = 100;

    @property
    teamBInitialCombatPoint = 100;

    @property
    killRewardCostWeight = 0.0;

    @property
    counterKillRewardCostWeight = 0.15;

    @property(Color)
    teamAWaveBannerBackgroundColor: Color = new Color(0, 70, 255, 255);

    @property(Color)
    teamBWaveBannerBackgroundColor: Color = new Color(255, 0, 0, 255);

    @property({
        type: Material,
        tooltip:
            'Shared material for every troop wave banner. Assign UnlitBillboard with the icon sheet here to avoid one material per troop type.',
    })
    waveBannerMaterial: Material | null = null;

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

    public isEntryUnlocked(
        entry: UnitPrefabEntry | null
    ) {
        return !!entry && entry.unlocked;
    }

    public getHeroEntry(team: number): HeroEntry {
        return team === 0
            ? this.teamAHero
            : this.teamBHero;
    }

    public getInitialCombatPoint(team: number): number {
        return team === 0
            ? this.teamAInitialCombatPoint
            : this.teamBInitialCombatPoint;
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

    public calculateKillRewardFromBounty(
        bountyValue: number,
        isCounterKill: boolean
    ) {
        const baseValue = Math.max(0, bountyValue);

        let reward =
            baseValue *
            Math.max(0, this.killRewardCostWeight);

        if (isCounterKill) {
            reward +=
                baseValue *
                Math.max(0, this.counterKillRewardCostWeight);
        }

        return reward;
    }
}
