import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
import { Unit } from './Unit';
import { UnitProps } from './UnitProps';
const { ccclass, property } = _decorator;

@ccclass('UnitBehavior')
export class UnitBehavior extends Component {
    @property(GameManager)
    public gameManager:GameManager = null!;
    @property(UnitProps)
    public props:UnitProps = null!;
    @property(UnitProps)
    public enemyProps:UnitProps = null;
    private unit:Unit;
    private strikeInterval = 0;

    start() {
        this.unit = this.getComponent(Unit);
        this.props = this.getComponent(UnitProps);
    }

    update(deltaTime: number) {
        
        if(this.unit.onBusy){
            this.strikeInterval++;
            if(this.strikeInterval>10){
                this.strikeInterval = 0;
                 if(this.enemyProps==null){     
                    this.enemyProps = this.unit.enemy.getComponent(UnitProps);
                }
                this.enemyProps.health-=10;      
            }
        }else{
            this.strikeInterval = 0;
            if(this.enemyProps!=null){this.enemyProps=null;}
        }
        if(this.props.health<=0){
            this.strikeInterval = 0;
            this.enemyProps = null;
            this.gameManager.despawnUnit(this.unit);
        }
    }
}


