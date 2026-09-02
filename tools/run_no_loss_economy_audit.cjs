/*
 * Executes LevelSettings' own no-loss audit outside the editor. It loads the
 * serialized Battle.scene configuration and transpiles the component with a
 * minimal Cocos shim, so the audited formula remains the production formula.
 *
 * Usage: node tools/run_no_loss_economy_audit.cjs [--player-upgrade-offset=0|1] [--reserve=gold]
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require(
    'C:/ProgramData/cocos/editors/Creator/3.8.8/resources/app.asar.unpacked/node_modules/typescript/lib/typescript.js'
);

const root = path.resolve(__dirname, '..');
const playerUpgradeOffset = process.argv
    .find((argument) => argument.startsWith('--player-upgrade-offset='))
    ?.split('=')[1] === '0' ? 0 : 1;
const requestedReserve = process.argv
    .find((argument) => argument.startsWith('--reserve='))
    ?.split('=')[1];
const rewardsOnly = process.argv.includes('--rewards-only');
const packageCapSummary = process.argv.includes('--package-cap-summary');
const cardScheduleOnly = process.argv.includes('--card-schedule');
const scene = JSON.parse(fs.readFileSync(path.join(root, 'assets/Battle.scene'), 'utf8'));
const source = fs.readFileSync(
    path.join(root, 'assets/scripts/LevelSettings.ts'),
    'utf8'
);

const UnitFamily = {
    Spear: 0,
    Sword: 1,
    Archer: 2,
    Skirmisher: 3,
    Cavalry: 4,
    Axeman: 5,
    Monk: 6,
};
const unitNames = Object.keys(UnitFamily);
const cardEnums = {
    BattleCardTarget: { AllUnits: 0, UnitFamily: 1, Frontline: 2, Ranged: 3 },
    BattleCardModifier: {
        None: 0, DamagePercent: 1, DefenseFlat: 2, AttackRangePercent: 3,
        DamageRadiusPercent: 4, CounterImmunity: 5, MoveSpeedPercent: 6,
    },
    BattleCardOpponentCondition: {
        Any: 0, Spear: 1, Sword: 2, Archer: 3, Cavalry: 5, Axeman: 6, Monk: 7,
    },
};
const CounterSettings = {
    instance: {
        getDamageMultiplier(attacker, defender) {
            if (attacker === UnitFamily.Spear && defender === UnitFamily.Cavalry) {
                return 12;
            }
            if (attacker === UnitFamily.Archer && defender === UnitFamily.Spear) {
                return 2;
            }
            return 1;
        },
    },
};
const cocos = {
    _decorator: {
        ccclass: () => (target) => target,
        property: () => () => undefined,
    },
    Component: class {},
    director: {},
    sys: {},
};

function localRequire(id) {
    if (id === 'cc') return cocos;
    if (id === './BattleTypes') {
        return {
            UnitFamily,
            unitFamilyToName: (family) => unitNames.find(
                (name) => UnitFamily[name] === family
            ) || 'Unknown',
        };
    }
    if (id === './BattleCardDatabase') return cardEnums;
    if (id === './CounterSettings') return { CounterSettings };
    return {};
}

const transpiled = ts.transpileModule(source, {
    compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        experimentalDecorators: true,
    },
}).outputText;
const moduleRecord = { exports: {} };
vm.runInNewContext(transpiled, {
    require: localRequire,
    exports: moduleRecord.exports,
    module: moduleRecord,
    console,
    Map,
    Set,
    Math,
    Number,
    Array,
    Object,
    JSON,
    Date,
}, { filename: 'LevelSettings.transpiled.js' });

const LevelSettings = moduleRecord.exports.LevelSettings;
if (!LevelSettings) throw new Error('Could not load LevelSettings.');

function objectBy(predicate) {
    const result = scene.find(predicate);
    if (!result) throw new Error('Expected scene object was not found.');
    return result;
}
function dereference(ref) {
    if (!ref || typeof ref.__id__ !== 'number') return ref;
    return scene[ref.__id__];
}

const sceneSettings = objectBy((item) =>
    item && Object.prototype.hasOwnProperty.call(item, 'mainlineNoLossGoldReserve') &&
    Object.prototype.hasOwnProperty.call(item, 'unitProgressionRules')
);
const sceneManager = objectBy((item) =>
    item && item.unitDatabase && item.battleCardDatabase
);
const unitDatabase = dereference(sceneManager.unitDatabase);
const cardDatabaseData = dereference(sceneManager.battleCardDatabase);
const cardDatabase = {
    ...cardDatabaseData,
    cards: (cardDatabaseData.cards || []).map(dereference),
    getCard(id) {
        return this.cards.find((card) => card && card.id === id) || null;
    },
};
const manager = {
    unitDatabase: {
        ...unitDatabase,
        teamAUnits: (unitDatabase.teamAUnits || []).map(dereference),
        teamBUnits: (unitDatabase.teamBUnits || []).map(dereference),
    },
    battleCardDatabase: cardDatabase,
};

const settings = new LevelSettings();
for (const [key, value] of Object.entries(sceneSettings)) {
    if (key === 'unitProgressionRules') {
        settings[key] = value.map(dereference);
    } else if (!key.startsWith('__') && key !== 'node' && key !== '_id') {
        settings[key] = value;
    }
}
settings.getGameManager = () => manager;
if (requestedReserve !== undefined) {
    settings.mainlineNoLossGoldReserve = Number(requestedReserve);
}
const productionCardUpgradeSchedule = settings.getCardUpgradeSchedule.bind(settings);
settings.getCardUpgradeSchedule = (offset = playerUpgradeOffset) =>
    productionCardUpgradeSchedule(offset);

const audit = settings.getMainlineNoLossEconomyAudit();
const playerSchedule = settings.getCardUpgradeSchedule();
const enemySchedule = settings.getCardUpgradeSchedule(0);
const fundingBudgets = settings.getMainlineContentFundingBudgets();
const nonUpgradePackageCounts = settings.getPlayerNonCardUpgradeOfferCounts();
const playerUpgradePackageCounts = new Array(
    settings.getSafeTotalLevels()
).fill(0);
for (const offer of playerSchedule) {
    playerUpgradePackageCounts[offer.offerLevel - 1]++;
}
const differingOffers = playerSchedule.filter((offer, index) =>
    offer.offerLevel !== enemySchedule[index]?.offerLevel
);
const rewards = [];
for (let level = 1; level <= settings.getSafeTotalLevels(); level++) {
    rewards.push({
        level,
        reward: settings.getMainBattleReward(level).gold,
        entryFee: settings.getMainBattleEntryFee(level),
        playerCardUpgradeCost: fundingBudgets[level - 1],
    });
}

if (rewardsOnly) {
    console.log(JSON.stringify({
        mainlineNoLossGoldReserve: settings.mainlineNoLossGoldReserve,
        rewards: rewards.map(({ level, reward }) => ({ level, reward })),
    }, null, 2));
    process.exit(0);
}

if (packageCapSummary) {
    const cap = settings.maxPlayerPackagesPerLevel;
    const levels = nonUpgradePackageCounts.map((baseline, index) => ({
        level: index + 1,
        baseline,
        cardUpgrades: playerUpgradePackageCounts[index],
        total: baseline + playerUpgradePackageCounts[index],
    }));
    console.log(JSON.stringify({
        cap,
        maximumTotal: Math.max(...levels.map((item) => item.total)),
        overflowLevels: levels.filter((item) => cap > 0 && item.total > cap),
        levels: levels.filter((item) => item.cardUpgrades > 0 || item.total > cap),
    }, null, 2));
    process.exit(0);
}

if (cardScheduleOnly) {
    console.log(JSON.stringify({
        playerCardUnlockSchedule: getCardUnlockSchedule(),
        playerCardUpgradeSchedule: playerSchedule,
        enemyCardStrengthSchedule: enemySchedule,
    }, null, 2));
    process.exit(0);
}

function traceNoLossRoute() {
    const savedState = settings.progressionState;
    const savedBattleLevel = settings.battleLevel;
    const state = settings.createInitialProgressionState();
    const ledger = [];

    try {
        settings.progressionState = state;
        for (let level = 1; level <= settings.getSafeTotalLevels(); level++) {
            settings.battleLevel = level;
            settings.offerIntroducedUnits(level);
            const openingGold = state.playerGold;
            let packageSpend = 0;

            for (let pass = 0; pass < 1000; pass++) {
                const option = settings.getPurchaseOptions(state)
                    .slice()
                    .sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id))[0];
                if (!option) break;
                packageSpend += option.cost;
                state.playerGold -= option.cost;
                settings.applyPurchaseToState(option, state);
            }

            const fee = settings.getMainBattleEntryFee(level);
            state.playerGold -= fee;
            const goldAfterCosts = state.playerGold;
            const reward = settings.getMainBattleReward(level).gold;
            state.playerGold += reward;
            ledger.push({
                level,
                openingGold,
                packageSpend,
                fee,
                goldAfterCosts,
                reward,
                closingGold: state.playerGold,
            });
        }
    } finally {
        settings.progressionState = savedState;
        settings.battleLevel = savedBattleLevel;
    }

    return ledger;
}

function getCardUnlockSchedule() {
    const savedState = settings.progressionState;
    const savedBattleLevel = settings.battleLevel;
    const state = settings.createInitialProgressionState();
    const result = [];

    try {
        state.playerGold = Number.MAX_SAFE_INTEGER;
        settings.progressionState = state;
        for (let level = 1; level <= settings.getSafeTotalLevels(); level++) {
            settings.battleLevel = level;
            settings.offerIntroducedUnits(level);
            for (let pass = 0; pass < 1000; pass++) {
                const option = settings.getPurchaseOptions(state)
                    .slice()
                    .sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id))[0];
                if (!option) break;
                if (option.kind === 'card-unlock') {
                    result.push({ cardId: option.cardId, offerLevel: level });
                }
                settings.applyPurchaseToState(option, state);
            }
        }
    } finally {
        settings.progressionState = savedState;
        settings.battleLevel = savedBattleLevel;
    }

    return result;
}

const noLossLedger = traceNoLossRoute();
function simulateMainRoute(lossLevels) {
    const savedState = settings.progressionState;
    const savedBattleLevel = settings.battleLevel;
    const state = settings.createInitialProgressionState();
    const losses = new Set(lossLevels);

    try {
        settings.progressionState = state;
        for (let level = 1; level <= settings.getSafeTotalLevels(); level++) {
            settings.battleLevel = level;
            settings.offerIntroducedUnits(level);

            for (let pass = 0; pass < 1000; pass++) {
                const option = settings.getPurchaseOptions(state)
                    .slice()
                    .sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id))[0];
                if (!option) break;
                if (state.playerGold < option.cost) {
                    return {
                        passed: false,
                        failure: 'package',
                        level,
                        gold: state.playerGold,
                        requiredGold: option.cost,
                        packageId: option.id,
                    };
                }
                state.playerGold -= option.cost;
                settings.applyPurchaseToState(option, state);
            }

            const fee = settings.getMainBattleEntryFee(level);
            if (state.playerGold < fee) {
                return {
                    passed: false,
                    failure: 'entry-fee',
                    level,
                    gold: state.playerGold,
                    requiredGold: fee,
                    packageId: '',
                };
            }
            state.playerGold -= fee;
            state.playerGold += losses.has(level)
                ? settings.getMainBattleLossReward(level)
                : settings.getMainBattleReward(level).gold;
        }

        return { passed: true, gold: state.playerGold };
    } finally {
        settings.progressionState = savedState;
        settings.battleLevel = savedBattleLevel;
    }
}

const oneLossFailures = [];
for (let lossLevel = 1; lossLevel <= settings.getSafeTotalLevels(); lossLevel++) {
    const result = simulateMainRoute([lossLevel]);
    if (!result.passed) oneLossFailures.push({ lossLevel, ...result });
}

console.log(JSON.stringify({
    audit,
    totalLevels: settings.getSafeTotalLevels(),
    mainlineNoLossGoldReserve: settings.mainlineNoLossGoldReserve,
    playerUpgradeOffset,
    enemyStrengthUpgradeOffset: 0,
    shiftedCardUpgradeOffers: differingOffers.length,
    oneLossShortageCount: oneLossFailures.length,
    oneLossFailures,
    noLossLedger: noLossLedger.filter((entry) =>
        entry.level === 1 || entry.level % 5 === 0 ||
        entry.packageSpend >= 2000
    ),
    rewards,
}, null, 2));
