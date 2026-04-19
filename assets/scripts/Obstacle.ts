import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Component {

    @property
    radius = 1;

}