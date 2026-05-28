import { _decorator, Component, director, Director } from 'cc';
import Stats from 'stats.js';

const { ccclass } = _decorator;

@ccclass('DebugStats')
export class DebugStats extends Component {

    private stats: Stats | null = null;

    start() {

        // Chỉ chạy trên browser
       /* if (typeof document === 'undefined') {
            return;
        }*/

        this.stats = new Stats();

        // 0 = FPS
        // 1 = MS
        // 2 = MB (memory, Chrome only)
        this.stats.showPanel(2);

        document.body.appendChild(this.stats.dom);

        director.on(
            Director.EVENT_BEGIN_FRAME,
            this.onBeginFrame,
            this
        );

        director.on(
            Director.EVENT_AFTER_DRAW,
            this.onEndFrame,
            this
        );
    }

    onDestroy() {

        director.off(
            Director.EVENT_BEGIN_FRAME,
            this.onBeginFrame,
            this
        );

        director.off(
            Director.EVENT_AFTER_DRAW,
            this.onEndFrame,
            this
        );

        if (this.stats && this.stats.dom.parentNode) {
            this.stats.dom.parentNode.removeChild(this.stats.dom);
        }
    }

    private onBeginFrame() {
        this.stats?.begin();
    }

    private onEndFrame() {
        this.stats?.end();
    }
}