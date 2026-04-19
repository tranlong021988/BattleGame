import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObstacleCircle')
export class ObstacleCircle extends Component {
    @property
    radius = 1;
}