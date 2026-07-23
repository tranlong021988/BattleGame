import { _decorator, Component } from 'cc';
import { UnitFamily } from './BattleTypes';
import { UnitProps } from './UnitProps';

const { ccclass, property } = _decorator;

@ccclass('CounterRule')
export class CounterRule {

    @property({ type: UnitFamily })
    attackerFamily: UnitFamily = UnitFamily.Spear;

    @property({ type: UnitFamily })
    defenderFamily: UnitFamily = UnitFamily.Cavalry;

    @property({
        min: 0,
        tooltip: 'Damage multiplier for attacker family against defender family. Tier is ignored here; tier changes stats instead.',
    })
    damageMultiplier: number = 1;

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

    getDamageMultiplier(
        attackerFamily: UnitFamily,
        defenderFamily: UnitFamily
    ): number {
        const rule =
            this.findRule(attackerFamily, defenderFamily);

        if (!rule) {
            return 1;
        }

        return Math.max(0, rule.damageMultiplier);
    }

    getCounterScore(
        attackerFamily: UnitFamily,
        defenderFamily: UnitFamily
    ): number {
        return this.getDamageMultiplier(
            attackerFamily,
            defenderFamily
        );
    }

    calculateDamage(
        attacker: UnitProps,
        defender: UnitProps
    ): number {
        const damageMul =
            this.getDamageMultiplier(
                attacker.family,
                defender.family
            );
        const baseDamage =
            Math.max(
                1,
                attacker.damage - defender.defense
            );

        return baseDamage * damageMul;
    }

    private findRule(
        attackerFamily: UnitFamily,
        defenderFamily: UnitFamily
    ): CounterRule | null {
        for (let i = 0; i < this.rules.length; i++) {
            const r = this.rules[i];

            if (
                r.attackerFamily === attackerFamily &&
                r.defenderFamily === defenderFamily
            ) {
                return r;
            }
        }

        return null;
    }

    private addRule(
        attacker: UnitFamily,
        defender: UnitFamily,
        damageMultiplier: number,
        note: string
    ) {
        const rule = new CounterRule();

        rule.attackerFamily = attacker;
        rule.defenderFamily = defender;
        rule.damageMultiplier = damageMultiplier;
        rule.note = note;

        this.rules.push(rule);
    }

    private createDefaultRules() {
        this.rules.length = 0;

        this.addRule(
            UnitFamily.Spear,
            UnitFamily.Cavalry,
            45,
            'Hard counter: Spear punishes Cavalry.'
        );

        this.addRule(
            UnitFamily.Archer,
            UnitFamily.Spear,
            2,
            'Soft-hard counter: Archer punishes Spear while sharing Spear raw Power tier.'
        );
    }
}
