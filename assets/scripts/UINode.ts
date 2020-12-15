import { _decorator, Component, Node } from 'cc';
import { Config } from './Config';
const { ccclass, property } = _decorator;

@ccclass('UINode')
export class UINode extends Component {
    @property(Node)
    passTipNode: Node = null;

    @property(Node)
    tipNode: Node = null;

    start () {
        if(Config.levelIndex < 5){
            this.tipNode.active = true;
        }else{
            this.tipNode.active = false;
        }
        this.node.parent.on("passLevel",this.passLevel,this);
    }

    passLevel(){
        this.passTipNode.active = true;
        this.scheduleOnce(function(){
            this.passTipNode.active = false;
        }, 1.5);
    }
}
