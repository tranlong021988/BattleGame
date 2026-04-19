import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UnitProps')
export class UnitProps extends Component {
    @property
    health:number = 3;
    @property
    damage:number = 1;
    start() {

    }

  
}


