import {
    BattleCardDatabase,
    BattleCardDefinition,
    BattleCardModifier,
    BattleCardOpponentCondition,
    BattleCardTarget,
} from './BattleCardDatabase';
import { UnitFamily } from './BattleTypes';

export interface BattleCardModifiers {
    damageMultiplier: number;
    defenseFlat: number;
    attackRangeMultiplier: number;
    moveSpeedMultiplier: number;
    damageRadiusMultiplier: number;
    counterImmune: boolean;
}

export interface BattleCardTelemetryEvent {
    type: 'card-activated' | 'card-depleted';
    team: number;
    id: string;
    displayName: string;
    budgetRemaining: number;
    budgetUsed: number;
    time: number;
}

interface RuntimeBattleCard {
    definition: BattleCardDefinition;
    active: boolean;
    initialBudget: number;
    budgetRemaining: number;
}

const MAX_BUDGET_UPGRADE_LEVEL = 2;

export class BattleCardRuntime {

    private database: BattleCardDatabase | null = null;
    private cardsByTeam: RuntimeBattleCard[][] = [[], []];
    private modifiersByTeamFamily:
        Map<string, BattleCardModifiers> = new Map();
    private started = false;
    private elapsedTime = 0;
    private onTelemetryEvent:
        ((event: BattleCardTelemetryEvent) => void) | null = null;

    constructor(
        database: BattleCardDatabase | null,
        onTelemetryEvent?:
            (event: BattleCardTelemetryEvent) => void
    ) {
        this.database = database;
        this.onTelemetryEvent = onTelemetryEvent || null;
    }

    public setDecks(
        playerCardIds: string[],
        enemyCardIds: string[],
        playerBudgetUpgradeLevels: Record<string, number> = {},
        maxPlayerCards: number = 3,
        maxEnemyCards: number = maxPlayerCards
    ) {
        const shouldBeginImmediately = this.started;
        const playerDeckSize = Math.max(
            1,
            Math.floor(maxPlayerCards)
        );
        const enemyDeckSize = Math.max(
            0,
            Math.floor(maxEnemyCards)
        );

        this.cardsByTeam[0] = this.createDeck(
            playerCardIds,
            playerBudgetUpgradeLevels,
            playerDeckSize
        );
        this.cardsByTeam[1] = this.createDeck(
            enemyCardIds,
            {},
            enemyDeckSize
        );
        this.modifiersByTeamFamily.clear();
        this.started = false;
        this.elapsedTime = 0;

        if (shouldBeginImmediately) {
            this.beginBattle();
        }
    }

    public beginBattle() {
        if (this.started) return;

        this.started = true;
        this.elapsedTime = 0;

        for (let team = 0; team <= 1; team++) {
            const cards = this.cardsByTeam[team];

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];

                card.active = card.budgetRemaining > 0;

                if (card.active) {
                    this.emitEvent('card-activated', team, card);
                }
            }
        }
    }

    public update(
        deltaTime: number,
        _currentCombatPoint: number[],
        _initialCombatPoint: number[]
    ) {
        if (!this.started) return;

        this.elapsedTime += Math.max(
            0,
            Number.isFinite(deltaTime) ? deltaTime : 0
        );
    }

    public getModifiers(
        team: number,
        family: UnitFamily,
        opposingFamily?: UnitFamily
    ): BattleCardModifiers {
        const safeTeam = this.clampTeam(team);
        const cacheKey = `${safeTeam}:${family}:${
            opposingFamily === undefined ? '*' : opposingFamily
        }`;
        const cached = this.modifiersByTeamFamily.get(cacheKey);

        if (cached) return cached;

        const result: BattleCardModifiers = {
            damageMultiplier: 1,
            defenseFlat: 0,
            attackRangeMultiplier: 1,
            moveSpeedMultiplier: 1,
            damageRadiusMultiplier: 1,
            counterImmune: false,
        };
        const cards = this.cardsByTeam[safeTeam];

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (!card.active) continue;
            if (!this.matchesTarget(card.definition, family)) {
                continue;
            }
            if (!this.matchesOpponent(
                card.definition,
                opposingFamily
            )) continue;

            this.applyModifier(
                result,
                card.definition.modifier,
                card.definition.modifierValue
            );
            this.applyModifier(
                result,
                card.definition.tradeoffModifier,
                card.definition.tradeoffValue
            );
        }

        result.damageMultiplier = Math.max(0, result.damageMultiplier);
        result.attackRangeMultiplier = Math.max(
            0,
            result.attackRangeMultiplier
        );
        result.moveSpeedMultiplier = Math.max(
            0,
            result.moveSpeedMultiplier
        );
        result.damageRadiusMultiplier = Math.max(
            0,
            result.damageRadiusMultiplier
        );

        this.modifiersByTeamFamily.set(cacheKey, result);
        return result;
    }

    public consumeModifier(
        team: number,
        family: UnitFamily,
        modifier: BattleCardModifier,
        opposingFamily?: UnitFamily
    ) {
        const cards = this.cardsByTeam[this.clampTeam(team)];
        let consumed = false;

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];

            if (!card.active) continue;
            if (card.definition.modifier !== modifier) continue;
            if (!this.matchesTarget(card.definition, family)) {
                continue;
            }
            if (!this.matchesOpponent(
                card.definition,
                opposingFamily
            )) continue;

            card.budgetRemaining = Math.max(
                0,
                card.budgetRemaining - 1
            );
            consumed = true;

            if (card.budgetRemaining <= 0) {
                card.active = false;
                this.emitEvent('card-depleted', team, card);
            }
        }

        if (consumed) {
            this.modifiersByTeamFamily.clear();
        }

        return consumed;
    }

    public getUsedCardIds(team: number) {
        return this.cardsByTeam[this.clampTeam(team)]
            .filter((card) =>
                card.initialBudget > card.budgetRemaining
            )
            .map((card) => card.definition.id);
    }

    public createTelemetrySnapshot() {
        return [0, 1].map((team) => ({
            team,
            deck: this.cardsByTeam[team].map((card) => ({
                id: card.definition.id,
                displayName: card.definition.displayName,
                baseBudget: card.definition.baseBudget,
                initialBudget: card.initialBudget,
                budgetRemaining: card.budgetRemaining,
                budgetUsed: card.initialBudget - card.budgetRemaining,
                active: card.active,
            })),
        }));
    }

    private createDeck(
        cardIds: string[],
        budgetUpgradeLevels: Record<string, number> = {},
        maxCards: number = 3
    ) {
        if (
            !this.database ||
            !Array.isArray(cardIds) ||
            maxCards <= 0
        ) {
            return [];
        }

        const result: RuntimeBattleCard[] = [];
        const ids = new Set<string>();

        for (let i = 0; i < cardIds.length; i++) {
            const id = cardIds[i];

            if (!id || ids.has(id)) continue;
            if (result.length >= maxCards) break;

            const definition = this.database.getCard(id);

            if (!definition) continue;

            ids.add(id);
            const upgradeLevel = Math.max(
                0,
                Math.min(
                    MAX_BUDGET_UPGRADE_LEVEL,
                    Math.floor(budgetUpgradeLevels[id] || 0)
                )
            );
            const initialBudget = Math.max(
                1,
                Math.round(
                    Math.max(1, definition.baseBudget) *
                    (1 + upgradeLevel * 0.4)
                )
            );

            result.push({
                definition,
                active: false,
                initialBudget,
                budgetRemaining: initialBudget,
            });
        }

        return result;
    }

    private matchesTarget(
        definition: BattleCardDefinition,
        family: UnitFamily
    ) {
        switch (definition.target) {
            case BattleCardTarget.UnitFamily:
                return family === definition.targetFamily;
            case BattleCardTarget.Frontline:
                return family === UnitFamily.Spear ||
                    family === UnitFamily.Sword ||
                    family === UnitFamily.Axeman ||
                    family === UnitFamily.Cavalry;
            case BattleCardTarget.Ranged:
                return family === UnitFamily.Archer ||
                    family === UnitFamily.Monk;
            default:
                return true;
        }
    }

    private matchesOpponent(
        definition: BattleCardDefinition,
        opposingFamily?: UnitFamily
    ) {
        if (
            definition.requiredEnemyFamily ===
            BattleCardOpponentCondition.Any
        ) {
            return true;
        }

        return opposingFamily ===
            definition.requiredEnemyFamily - 1;
    }

    private applyModifier(
        result: BattleCardModifiers,
        modifier: BattleCardModifier,
        value: number
    ) {
        const safeValue = Number.isFinite(value) ? value : 0;

        switch (modifier) {
            case BattleCardModifier.DamagePercent:
                result.damageMultiplier += safeValue / 100;
                break;
            case BattleCardModifier.DefenseFlat:
                result.defenseFlat += safeValue;
                break;
            case BattleCardModifier.AttackRangePercent:
                result.attackRangeMultiplier += safeValue / 100;
                break;
            case BattleCardModifier.MoveSpeedPercent:
                result.moveSpeedMultiplier += safeValue / 100;
                break;
            case BattleCardModifier.DamageRadiusPercent:
                result.damageRadiusMultiplier += safeValue / 100;
                break;
            case BattleCardModifier.CounterImmunity:
                result.counterImmune = true;
                break;
        }
    }

    private emitEvent(
        type: BattleCardTelemetryEvent['type'],
        team: number,
        card: RuntimeBattleCard
    ) {
        if (!this.onTelemetryEvent) return;

        this.onTelemetryEvent({
            type,
            team: this.clampTeam(team),
            id: card.definition.id,
            displayName: card.definition.displayName,
            budgetRemaining: card.budgetRemaining,
            budgetUsed: card.initialBudget - card.budgetRemaining,
            time: this.elapsedTime,
        });
    }

    private clampTeam(team: number) {
        return team === 1 ? 1 : 0;
    }
}
