import { Enum } from 'cc';

export enum UnitType {
    LightSword = 0,
    HeavySword = 1,

    LightSpear = 2,
    HeavySpear = 3,

    LightMace = 4,
    HeavyMace = 5,

    LightArcher = 6,
    HeavyArcher = 7,

    LightCavalry = 8,
    HeavyCavalry = 9,

    LightMagic = 10,
    HeavyMagic = 11,
}

Enum(UnitType);

export function unitTypeToName(type: UnitType): string {
    switch (type) {
        case UnitType.LightSword: return 'Light Sword';
        case UnitType.HeavySword: return 'Heavy Sword';

        case UnitType.LightSpear: return 'Light Spear';
        case UnitType.HeavySpear: return 'Heavy Spear';

        case UnitType.LightMace: return 'Light Mace';
        case UnitType.HeavyMace: return 'Heavy Mace';

        case UnitType.LightArcher: return 'Light Archer';
        case UnitType.HeavyArcher: return 'Heavy Archer';

        case UnitType.LightCavalry: return 'Light Cavalry';
        case UnitType.HeavyCavalry: return 'Heavy Cavalry';

        case UnitType.LightMagic: return 'Light Magic';
        case UnitType.HeavyMagic: return 'Heavy Magic';
    }

    return 'Unknown';
}