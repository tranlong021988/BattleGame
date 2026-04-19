import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObstacleRect')
export class ObstacleRect extends Component {

    @property
    halfWidth = 1;

    @property
    halfHeight = 1;
}