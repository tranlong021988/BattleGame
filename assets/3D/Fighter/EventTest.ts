import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventTest')
export class EventTest extends Component {
    start() {
        this.node.on('JabEndFrame', (animationName, frame, player) => {
            console.log(animationName, frame);
        });
    }

   public JabEndCall(eventName: string, animationName: string, frame: number, customEventData?: string) {
     console.log('VAT event', eventName, animationName, frame, customEventData);
    }
}


