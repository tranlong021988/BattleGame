import {
    BattleCardDatabase,
    BattleCardDefinition,
    BattleCardModifier,
    BattleCardTarget,
    BattleCardTrigger,
} from './BattleCardDatabase';
import { UnitFamily } from './BattleTypes';

export interface BattleCardModifiers {
    damageMultiplier: number;
    defenseFlat: number;
    attackRangeMultiplier: number;
    damageRadiusMultiplier: number;
    counterImmune: boolean;
}

export interface BattleCardTelemetryEvent {
    type: 'card-activated' | 'card-expired';
    team: number;
    id: string;
    displayName: string;
    trigger: string;
    durationSeconds: number;
    time: number;
}

interface RuntimeBattleCard {
    definition: BattleCardDefinition;
    activated: boolean;
    active: boolean;
    remainingSeconds: number;
}

const MAX_CARDS_PER_DECK = 3;

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

    public setDecks(playerCardIds: string[], enemyCardIds: string[]) {
        this.cardsByTeam[0] = this.createDeck(playerCardIds);
        this.cardsByTeam[1] = this.createDeck(enemyCardIds);
        this.modifiersByTeamFamily.clear();
        this.started = false;
        this.elapsedTime = 0;
    }

    public beginBattle() {
        if (this.started) return;

        this.started = true;
        this.elapsedTime = 0;

        for (let team = 0; team <= 1; team++) {
            const cards = this.cardsByTeam[team];

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];

                if (
                    card.definition.trigger ===
                    BattleCardTrigger.BattleStart
                ) {
                    this.activateCard(team, card);
                }
            }
        }
    }

    public update(
        deltaTime: number,
        currentCombatPoint: number[],
        initialCombatPoint: number[]
    ) {
        if (!this.started) return;

        const safeDelta = Math.max(
            0,
            Number.isFinite(deltaTime) ? deltaTime : 0
        );
        this.elapsedTime += safeDelta;

        for (let team = 0; team <= 1; team++) {
            const cards = this.cardsByTeam[team];

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];

                if (!card.activated && this.shouldActivate(
                    card,
                    team,
                    currentCombatPoint,
                    initialCombatPoint
                )) {
                    this.activateCard(team, card);
                }

                if (
                    !card.active ||
                    card.definition.durationSeconds <= 0
                ) {
                    continue;
                }

                card.remainingSeconds -= safeDelta;

                if (card.remainingSeconds <= 0) {
                    card.remainingSeconds = 0;
                    card.active = false;
                    this.modifiersByTeamFamily.clear();
                    this.emitEvent('card-expired', team, card);
                }
            }
        }
    }

    public getModifiers(team: number, family: UnitFamily): BattleCardModifiers {
        const safeTeam = this.clampTeam(team);
        const cacheKey = `${safeTeam}:${family}`;
        const cached = this.modifiersByTeamFamily.get(cacheKey);

        if (cached) return cached;

        const result: BattleCardModifiers = {
            damageMultiplier: 1,
            defenseFlat: 0,
            attackRangeMultiplier: 1,
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

        result.damageMultiplier = Math.max(
            0,
            result.damageMultiplier
        );
        result.attackRangeMultiplier = Math.max(
            0,
            result.attackRangeMultiplier
        );
        result.damageRadiusMultiplier = Math.max(
            0,
            result.damageRadiusMultiplier
        );

        this.modifiersByTeamFamily.set(cacheKey, result);
        return result;
    }

    public getActivatedCardIds(team: number) {
        return this.cardsByTeam[this.clampTeam(team)]
            .filter((card) => card.activated)
            .map((card) => card.definition.id);
    }

    public createTelemetrySnapshot() {
        return [0, 1].map((team) => ({
            team,
            deck: this.cardsByTeam[team].map((card) => ({
                id: card.definition.id,
                displayName: card.definition.displayName,
                trigger: BattleCardTrigger[card.definition.trigger],
                durationSeconds: card.definition.durationSeconds,
                active: card.active,
                activated: card.activated,
                remainingSeconds: card.remainingSeconds,
            })),
        }));
    }

    private createDeck(cardIds: string[]) {
        if (!this.database || !Array.isArray(cardIds)) {
            return [];
        }

        const result: RuntimeBattleCard[] = [];
        const ids = new Set<string>();

        for (let i = 0; i < cardIds.length; i++) {
            const id = cardIds[i];

            if (!id || ids.has(id)) continue;
            if (result.length >= MAX_CARDS_PER_DECK) break;

            const definition = this.database.getCard(id);

            if (!definition) continue;

            ids.add(id);
            result.push({
                definition,
                activated: false,
                active: false,
                remainingSeconds: 0,
            });
        }

        return result;
    }

    private shouldActivate(
        card: RuntimeBattleCard,
        team: number,
        currentCombatPoint: number[],
        initialCombatPoint: number[]
    ) {
        if (
            card.definition.trigger !==
            BattleCardTrigger.OwnCombatPointBelow
        ) {
            return false;
        }

        const safeTeam = this.clampTeam(team);
        const initial = Math.max(
            1,
            Number.isFinite(initialCombatPoint[safeTeam])
                ? initialCombatPoint[safeTeam]
                : 1
        );
        const current = Math.max(
            0,
            Number.isFinite(currentCombatPoint[safeTeam])
                ? currentCombatPoint[safeTeam]
                : 0
        );

        return current / initial <=
            Math.max(
                0,
                Math.min(1, card.definition.ownCombatPointThreshold)
            );
    }

    private activateCard(team: number, card: RuntimeBattleCard) {
        if (card.activated) return;

        card.activated = true;
        card.active = true;
        card.remainingSeconds = Math.max(
            0,
            card.definition.durationSeconds
        );
        this.modifiersByTeamFamily.clear();
        this.emitEvent('card-activated', team, card);
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
            trigger: BattleCardTrigger[card.definition.trigger],
            durationSeconds: card.definition.durationSeconds,
            time: this.elapsedTime,
        });
    }

    private clampTeam(team: number) {
        return team === 1 ? 1 : 0;
    }
}
