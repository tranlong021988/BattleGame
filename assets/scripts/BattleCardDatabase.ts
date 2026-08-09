import { _decorator, Component, Enum, SpriteFrame } from 'cc';
import { UnitFamily } from './BattleTypes';

const { ccclass, property } = _decorator;

export enum BattleCardTrigger {
    BattleStart = 0,
    OwnCombatPointBelow = 1,
}

export enum BattleCardTarget {
    AllUnits = 0,
    UnitFamily = 1,
    Frontline = 2,
    Ranged = 3,
}

export enum BattleCardModifier {
    None = 0,
    DamagePercent = 1,
    DefenseFlat = 2,
    AttackRangePercent = 3,
    DamageRadiusPercent = 4,
    CounterImmunity = 5,
}

export enum BattleCardEnemyPool {
    None = 0,
    RegularAndBoss = 1,
    BossOnly = 2,
}

Enum(BattleCardTrigger);
Enum(BattleCardTarget);
Enum(BattleCardModifier);
Enum(BattleCardEnemyPool);

@ccclass('BattleCardDefinition')
export class BattleCardDefinition {

    @property
    id = '';

    @property
    displayName = '';

    @property(SpriteFrame)
    icon: SpriteFrame | null = null;

    @property({ min: 1, step: 1 })
    purchasePrice = 500;

    @property({ min: 1, step: 1 })
    baseCooldownBattles = 4;

    @property({ type: BattleCardTrigger })
    trigger = BattleCardTrigger.BattleStart;

    @property({
        min: 0,
        max: 1,
        step: 0.05,
        tooltip: 'Only used by Own Combat Point Below. 0.3 means activate when current CP is at or below 30% of starting CP.',
    })
    ownCombatPointThreshold = 0.3;

    @property({
        min: 0,
        step: 0.1,
        tooltip: 'Seconds of battle-time. 0 means active until this battle ends.',
    })
    durationSeconds = 0;

    @property({ type: BattleCardTarget })
    target = BattleCardTarget.AllUnits;

    @property({ type: UnitFamily })
    targetFamily = UnitFamily.Spear;

    @property({ type: BattleCardModifier })
    modifier = BattleCardModifier.DamagePercent;

    @property({
        tooltip: 'Percent for Damage/Range/Radius; flat amount for Defense. Counter Immunity ignores this value.',
    })
    modifierValue = 0;

    @property({ type: BattleCardModifier })
    tradeoffModifier = BattleCardModifier.None;

    @property({
        tooltip: 'Use a negative value for a stat penalty. Counter Immunity is not valid as a tradeoff.',
    })
    tradeoffValue = 0;

    @property({ type: BattleCardEnemyPool })
    enemyPool = BattleCardEnemyPool.RegularAndBoss;
}

function createCard(
    id: string,
    displayName: string,
    purchasePrice: number,
    baseCooldownBattles: number,
    trigger: BattleCardTrigger,
    threshold: number,
    durationSeconds: number,
    target: BattleCardTarget,
    targetFamily: UnitFamily,
    modifier: BattleCardModifier,
    modifierValue: number,
    tradeoffModifier: BattleCardModifier = BattleCardModifier.None,
    tradeoffValue: number = 0,
    enemyPool: BattleCardEnemyPool =
        BattleCardEnemyPool.RegularAndBoss
) {
    const card = new BattleCardDefinition();
    card.id = id;
    card.displayName = displayName;
    card.purchasePrice = purchasePrice;
    card.baseCooldownBattles = baseCooldownBattles;
    card.trigger = trigger;
    card.ownCombatPointThreshold = threshold;
    card.durationSeconds = durationSeconds;
    card.target = target;
    card.targetFamily = targetFamily;
    card.modifier = modifier;
    card.modifierValue = modifierValue;
    card.tradeoffModifier = tradeoffModifier;
    card.tradeoffValue = tradeoffValue;
    card.enemyPool = enemyPool;
    return card;
}

function createDefaultCards() {
    return [
        createCard(
            'general-offensive', 'General Offensive', 850, 5,
            BattleCardTrigger.BattleStart, 0, 0,
            BattleCardTarget.AllUnits, UnitFamily.Spear,
            BattleCardModifier.DamagePercent, 5
        ),
        createCard(
            'battle-shields', 'Battle Shields', 700, 4,
            BattleCardTrigger.OwnCombatPointBelow, 0.4, 12,
            BattleCardTarget.Frontline, UnitFamily.Spear,
            BattleCardModifier.DefenseFlat, 1
        ),
        createCard(
            'anti-cavalry-spearhead', 'Anti-Cavalry Spearhead', 650, 4,
            BattleCardTrigger.BattleStart, 0, 0,
            BattleCardTarget.UnitFamily, UnitFamily.Spear,
            BattleCardModifier.DamagePercent, 14,
            BattleCardModifier.DefenseFlat, -1
        ),
        createCard(
            'axe-frenzy', 'Axe Frenzy', 650, 4,
            BattleCardTrigger.BattleStart, 0, 10,
            BattleCardTarget.UnitFamily, UnitFamily.Axeman,
            BattleCardModifier.DamagePercent, 18,
            BattleCardModifier.DefenseFlat, -0.2
        ),
        createCard(
            'sword-wall', 'Sword Wall', 800, 5,
            BattleCardTrigger.OwnCombatPointBelow, 0.35, 10,
            BattleCardTarget.UnitFamily, UnitFamily.Sword,
            BattleCardModifier.DefenseFlat, 2,
            BattleCardModifier.DamagePercent, -10
        ),
        createCard(
            'arrow-suppression', 'Arrow Suppression', 650, 4,
            BattleCardTrigger.BattleStart, 0, 12,
            BattleCardTarget.UnitFamily, UnitFamily.Archer,
            BattleCardModifier.DamagePercent, 12,
            BattleCardModifier.AttackRangePercent, -8
        ),
        createCard(
            'precise-range', 'Precise Range', 1100, 5,
            BattleCardTrigger.BattleStart, 0, 0,
            BattleCardTarget.Ranged, UnitFamily.Archer,
            BattleCardModifier.AttackRangePercent, 8
        ),
        createCard(
            'wide-prayer', 'Wide Prayer', 1200, 5,
            BattleCardTrigger.OwnCombatPointBelow, 0.45, 10,
            BattleCardTarget.UnitFamily, UnitFamily.Monk,
            BattleCardModifier.DamageRadiusPercent, 30,
            BattleCardModifier.DamagePercent, -12
        ),
        createCard(
            'counter-breaker', 'Counter Breaker', 1600, 6,
            BattleCardTrigger.OwnCombatPointBelow, 0.3, 5,
            BattleCardTarget.AllUnits, UnitFamily.Spear,
            BattleCardModifier.CounterImmunity, 0,
            BattleCardModifier.None, 0,
            BattleCardEnemyPool.BossOnly
        ),
    ];
}

@ccclass('BattleCardDatabase')
export class BattleCardDatabase extends Component {

    @property({ type: [BattleCardDefinition] })
    cards: BattleCardDefinition[] = createDefaultCards();

    public getCard(id: string) {
        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];

            if (card && card.id === id) {
                return card;
            }
        }

        return null;
    }

    public getEnemyCards(isBoss: boolean) {
        return this.cards.filter((card) => {
            if (!card || !card.id) return false;
            if (card.enemyPool === BattleCardEnemyPool.None) {
                return false;
            }

            return isBoss ||
                card.enemyPool ===
                BattleCardEnemyPool.RegularAndBoss;
        });
    }
}
