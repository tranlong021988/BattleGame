import {
    _decorator,
    Component,
    director,
    game,
} from 'cc';

const { ccclass } = _decorator;

const BattleSceneName = 'Battle';

@ccclass('MainGameFlow')
export class MainGameFlow extends Component {

    static instance: MainGameFlow | null = null;

    private battleLoadInProgress = false;
    private battleResetPending = false;

    onLoad() {
        if (MainGameFlow.instance && MainGameFlow.instance !== this) {
            this.node.destroy();
            return;
        }

        MainGameFlow.instance = this;
        game.addPersistRootNode(this.node);
    }

    start() {
        this.loadBattle(false);
    }

    onDestroy() {
        if (MainGameFlow.instance === this) {
            MainGameFlow.instance = null;
        }
    }

    public static restartBattle() {
        return MainGameFlow.instance?.loadBattle(true) ?? false;
    }

    public static isBattleResetPending() {
        return !!MainGameFlow.instance?.battleResetPending;
    }

    public static completeBattleReset() {
        if (MainGameFlow.instance) {
            MainGameFlow.instance.battleResetPending = false;
        }
    }

    private loadBattle(isReset: boolean) {
        if (this.battleLoadInProgress) return false;

        this.battleLoadInProgress = true;
        this.battleResetPending = isReset;

        try {
            director.loadScene(BattleSceneName, (error) => {
                this.battleLoadInProgress = false;

                if (!error) return;

                this.battleResetPending = false;
                console.error(
                    '[MainGameFlow] failed to load Battle scene.',
                    error
                );
            });
            return true;
        } catch (error) {
            this.battleLoadInProgress = false;
            this.battleResetPending = false;
            console.error(
                '[MainGameFlow] could not start Battle scene load.',
                error
            );
            return false;
        }
    }
}
