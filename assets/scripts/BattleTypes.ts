import { Enum } from 'cc';

export enum UnitFamily {
    Spear = 0,
    Sword = 1,
    Archer = 2,
    Skirmisher = 3,
    Cavalry = 4,
    Axeman = 5,
    Monk = 6,
}

Enum(UnitFamily);

export function unitFamilyToName(family: UnitFamily): string {
    switch (family) {
        case UnitFamily.Spear: return 'Spear';
        case UnitFamily.Sword: return 'Sword';
        case UnitFamily.Archer: return 'Archer';
        case UnitFamily.Skirmisher: return 'Skirmisher';
        case UnitFamily.Cavalry: return 'Cavalry';
        case UnitFamily.Axeman: return 'Axeman';
        case UnitFamily.Monk: return 'Monk';
    }

    return 'Unknown';
}
