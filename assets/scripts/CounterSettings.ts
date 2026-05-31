import { _decorator, Component } from 'cc';
import { UnitType } from './BattleTypes';
import { UnitProps } from './UnitProps';

const { ccclass, property } = _decorator;

@ccclass('CounterRule')
export class CounterRule {

    @property({ type: UnitType })
    attackerType: UnitType = UnitType.LightSword;

    @property({ type: UnitType })
    defenderType: UnitType = UnitType.LightSpear;

    @property
    damageMultiplier: number = 1;

    @property
    receivedDamageMultiplier: number = 1;

    @property
    note: string = '';
}

@ccclass('CounterSettings')
export class CounterSettings extends Component {

    static instance: CounterSettings | null = null;

    @property
    autoCreateDefaultRules = true;

    @property({ type: [CounterRule] })
    rules: CounterRule[] = [];

    onLoad() {
        CounterSettings.instance = this;

        if (this.autoCreateDefaultRules && this.rules.length <= 0) {
            this.createDefaultRules();
        }
    }

    onDestroy() {
        if (CounterSettings.instance === this) {
            CounterSettings.instance = null;
        }
    }

    getDamageMultiplier(attackerType: UnitType, defenderType: UnitType): number {
        const rule = this.findRule(attackerType, defenderType);

        if (!rule) {
            return 1;
        }

        return Math.max(0, rule.damageMultiplier);
    }

    getReceivedDamageMultiplier(attackerType: UnitType, defenderType: UnitType): number {
        const rule = this.findRule(attackerType, defenderType);

        if (!rule) {
            return 1;
        }

        return Math.max(0.01, rule.receivedDamageMultiplier);
    }

    getCounterScore(attackerType: UnitType, defenderType: UnitType): number {
        const damageMul = this.getDamageMultiplier(
            attackerType,
            defenderType
        );

        const receivedMul = this.getReceivedDamageMultiplier(
            attackerType,
            defenderType
        );

        return damageMul * (1 / Math.max(0.1, receivedMul));
    }

    calculateDamage(attacker: UnitProps, defender: UnitProps): number {
        const damageMul = this.getDamageMultiplier(
            attacker.unitType,
            defender.unitType
        );

        const receivedMul = this.getReceivedDamageMultiplier(
            attacker.unitType,
            defender.unitType
        );

        const rawDamage =
            attacker.damage *
            damageMul *
            receivedMul;

        const finalDamage = Math.max(
            1,
            rawDamage - defender.defense
        );

        return finalDamage;
    }

    private findRule(attackerType: UnitType, defenderType: UnitType): CounterRule | null {
        for (let i = 0; i < this.rules.length; i++) {
            const r = this.rules[i];

            if (
                r.attackerType === attackerType &&
                r.defenderType === defenderType
            ) {
                return r;
            }
        }

        return null;
    }

    private addRule(
        attacker: UnitType,
        defender: UnitType,
        damageMultiplier: number,
        receivedDamageMultiplier: number,
        note: string
    ) {
        const rule = new CounterRule();

        rule.attackerType = attacker;
        rule.defenderType = defender;
        rule.damageMultiplier = damageMultiplier;
        rule.receivedDamageMultiplier = receivedDamageMultiplier;
        rule.note = note;

        this.rules.push(rule);
    }

    private createDefaultRules() {
        this.rules.length = 0;

        // =====================================================
        // SIMPLE LIGHT TEST LOOP
        // Dùng bộ này để test ArmyBrain dễ nhìn:
        //
        // LightSword   > LightSpear
        // LightSpear   > LightCavalry
        // LightCavalry > LightArcher
        // LightArcher  > LightMace
        // LightMace    > LightSword
        // LightMagic   > LightMace
        // LightSword   > LightMagic
        // =====================================================

        this.addRule(
            UnitType.LightSword,
            UnitType.LightSpear,
            2.0,
            1.0,
            'Light Sword hard-counters Light Spear'
        );

        this.addRule(
            UnitType.LightSpear,
            UnitType.LightCavalry,
            2.0,
            1.0,
            'Light Spear hard-counters Light Cavalry'
        );

        this.addRule(
            UnitType.LightCavalry,
            UnitType.LightArcher,
            2.0,
            1.0,
            'Light Cavalry hard-counters Light Archer'
        );

        this.addRule(
            UnitType.LightArcher,
            UnitType.LightMace,
            2.0,
            1.0,
            'Light Archer hard-counters Light Mace'
        );

        this.addRule(
            UnitType.LightMace,
            UnitType.LightSword,
            2.0,
            1.0,
            'Light Mace hard-counters Light Sword'
        );

        this.addRule(
            UnitType.LightMagic,
            UnitType.LightMace,
            2.0,
            1.0,
            'Light Magic hard-counters Light Mace'
        );

        this.addRule(
            UnitType.LightSword,
            UnitType.LightMagic,
            2.0,
            1.0,
            'Light Sword hard-counters Light Magic'
        );

        // =====================================================
        // OPTIONAL LIGHT SOFT COUNTERS
        // Có thể giữ để AI có lựa chọn phụ.
        // Nếu muốn test cực sạch, bạn có thể comment block này.
        // =====================================================

        this.addRule(
            UnitType.LightArcher,
            UnitType.LightSpear,
            1.5,
            1.0,
            'Light Archer soft-counters Light Spear'
        );

        this.addRule(
            UnitType.LightCavalry,
            UnitType.LightMagic,
            1.5,
            1.0,
            'Light Cavalry soft-counters Light Magic'
        );

        this.addRule(
            UnitType.LightSpear,
            UnitType.LightMace,
            1.5,
            1.0,
            'Light Spear soft-counters Light Mace'
        );

        // =====================================================
        // HEAVY RULES
        // Giữ sẵn để sau này mở rộng 12 unit.
        // =====================================================

        this.addRule(
            UnitType.LightSpear,
            UnitType.HeavyCavalry,
            1.5,
            1.0,
            'Light Spear soft-counters Heavy Cavalry'
        );

        this.addRule(
            UnitType.HeavySpear,
            UnitType.HeavyCavalry,
            2.0,
            1.0,
            'Heavy Spear hard-counters Heavy Cavalry'
        );

        this.addRule(
            UnitType.HeavySpear,
            UnitType.LightCavalry,
            1.5,
            1.0,
            'Heavy Spear soft-counters Light Cavalry'
        );

        this.addRule(
            UnitType.HeavySpear,
            UnitType.HeavySword,
            1.5,
            1.0,
            'Heavy Spear soft-counters Heavy Sword'
        );

        this.addRule(
            UnitType.HeavySword,
            UnitType.LightSword,
            2.0,
            1.0,
            'Heavy Sword hard-counters Light Sword'
        );

        this.addRule(
            UnitType.HeavySword,
            UnitType.LightSpear,
            2.0,
            1.0,
            'Heavy Sword hard-counters Light Spear'
        );

        this.addRule(
            UnitType.HeavySword,
            UnitType.LightMace,
            2.0,
            1.0,
            'Heavy Sword hard-counters Light Mace'
        );

        this.addRule(
            UnitType.HeavySword,
            UnitType.LightArcher,
            2.0,
            1.0,
            'Heavy Sword hard-counters Light Archer'
        );

        this.addRule(
            UnitType.HeavySword,
            UnitType.LightMagic,
            1.5,
            1.0,
            'Heavy Sword soft-counters Light Magic'
        );

        this.addRule(
            UnitType.LightMace,
            UnitType.HeavySword,
            2.0,
            1.0,
            'Light Mace hard-counters Heavy Sword'
        );

        this.addRule(
            UnitType.LightMace,
            UnitType.HeavySpear,
            1.5,
            1.0,
            'Light Mace soft-counters Heavy Spear'
        );

        this.addRule(
            UnitType.HeavyMace,
            UnitType.HeavySword,
            2.0,
            1.0,
            'Heavy Mace hard-counters Heavy Sword'
        );

        this.addRule(
            UnitType.HeavyMace,
            UnitType.HeavySpear,
            2.0,
            1.0,
            'Heavy Mace hard-counters Heavy Spear'
        );

        this.addRule(
            UnitType.HeavyMace,
            UnitType.HeavyCavalry,
            1.5,
            1.0,
            'Heavy Mace soft-counters Heavy Cavalry'
        );

        this.addRule(
            UnitType.HeavyArcher,
            UnitType.HeavySword,
            2.0,
            1.0,
            'Heavy Archer hard-counters Heavy Sword'
        );

        this.addRule(
            UnitType.HeavyArcher,
            UnitType.HeavySpear,
            2.0,
            1.0,
            'Heavy Archer hard-counters Heavy Spear'
        );

        this.addRule(
            UnitType.HeavyArcher,
            UnitType.HeavyCavalry,
            1.5,
            1.0,
            'Heavy Archer soft-counters Heavy Cavalry'
        );

        this.addRule(
            UnitType.LightCavalry,
            UnitType.HeavyArcher,
            2.0,
            1.0,
            'Light Cavalry hard-counters Heavy Archer'
        );

        this.addRule(
            UnitType.LightCavalry,
            UnitType.HeavyMagic,
            1.5,
            1.0,
            'Light Cavalry soft-counters Heavy Magic'
        );

        this.addRule(
            UnitType.HeavyCavalry,
            UnitType.LightSword,
            2.0,
            1.0,
            'Heavy Cavalry hard-counters Light Sword'
        );

        this.addRule(
            UnitType.HeavyCavalry,
            UnitType.LightArcher,
            2.0,
            1.0,
            'Heavy Cavalry hard-counters Light Archer'
        );

        this.addRule(
            UnitType.HeavyCavalry,
            UnitType.LightCavalry,
            1.5,
            1.0,
            'Heavy Cavalry soft-counters Light Cavalry'
        );

        this.addRule(
            UnitType.HeavyCavalry,
            UnitType.HeavySword,
            1.5,
            1.0,
            'Heavy Cavalry soft-counters Heavy Sword'
        );

        this.addRule(
            UnitType.LightMagic,
            UnitType.LightSword,
            1.5,
            1.0,
            'Light Magic soft-counters Light Sword'
        );

        this.addRule(
            UnitType.LightMagic,
            UnitType.LightSpear,
            1.5,
            1.0,
            'Light Magic soft-counters Light Spear'
        );

        this.addRule(
            UnitType.HeavyMagic,
            UnitType.HeavySword,
            2.0,
            1.0,
            'Heavy Magic hard-counters Heavy Sword'
        );

        this.addRule(
            UnitType.HeavyMagic,
            UnitType.HeavySpear,
            2.0,
            1.0,
            'Heavy Magic hard-counters Heavy Spear'
        );

        this.addRule(
            UnitType.HeavyMagic,
            UnitType.HeavyMace,
            2.0,
            1.0,
            'Heavy Magic hard-counters Heavy Mace'
        );

        this.addRule(
            UnitType.HeavyMagic,
            UnitType.HeavyCavalry,
            1.5,
            1.0,
            'Heavy Magic soft-counters Heavy Cavalry'
        );

        // =====================================================
        // DEFENSIVE RULE EXAMPLES
        // =====================================================

        this.addRule(
            UnitType.LightCavalry,
            UnitType.HeavySpear,
            1.0,
            0.5,
            'Heavy Spear receives 50% damage from Light Cavalry'
        );

        this.addRule(
            UnitType.HeavyCavalry,
            UnitType.HeavySpear,
            1.0,
            0.5,
            'Heavy Spear receives 50% damage from Heavy Cavalry'
        );

        this.addRule(
            UnitType.LightArcher,
            UnitType.HeavySword,
            1.0,
            0.75,
            'Heavy Sword receives 75% damage from Light Archer'
        );
    }
}