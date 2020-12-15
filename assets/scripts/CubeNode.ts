import { _decorator, Component, Node, Vec3, tween, MeshRenderer, Material } from 'cc';
import { Config } from './Config';
import { LevelNode } from './LevelNode';
const { ccclass, property } = _decorator;

@ccclass('CubeNode')
export class CubeNode extends Component {
    private index = 0;
    private type = -1;

    _scale = new Vec3(0,0,0);
    _pos = new Vec3(0, 0, 0);

    @property([Material])
    materialsUp = [];
    @property([Material])
    materialsDown = [];

    _SCALEUP = 0.8;
    _SCALEDOWN = 0.4;

    start () {
        // Your initialization goes here.
        console.log("cube start");
    }

    init(index,flag){
        this.index = index;
        this.type = Math.abs(flag);
        if(flag < 0){
            this.node.setScale(new Vec3(0.8,this._SCALEDOWN,0.8));
            this.node.setPosition(new Vec3(this.node.position.x,0.2,this.node.position.z));
            this.node.getComponent(MeshRenderer).material = this.materialsDown[this.type-1];
        }else{
            this.node.getComponent(MeshRenderer).material = this.materialsUp[this.type-1];
        }

        this.node.parent.on('changeSideNode', this.changeSideNode, this);
    }

    changeSideNode(index, type) {
        console.log("type : ",type);
         if(type == 1){
             if (Math.abs(this.index - index) == 1) {
                 if (Math.floor(this.index / Config.x_length) == Math.floor(index / Config.x_length)) {
                     this.changeScale(false);
                 }
             } else if (Math.abs(this.index - index) == Config.x_length) {
                 this.changeScale(false);
             }
         }else if(type == 2){
             if (Math.abs(this.index - index) == 1) {
                 if (Math.floor(this.index / Config.x_length) == Math.floor(index / Config.x_length)) {
                     this.changeScale(false);
                 }
             }
         }else if(type == 3){
             if (Math.abs(this.index - index) == Config.x_length) {
                 this.changeScale(false);
             }
         }
    }

    onDestroy(){
        this.node.setScale(new Vec3(0.8,this._SCALEUP,0.8));
        this.index = 0;
        this.node.parent.targetOff(this);
    }

    changeScale(flag = true){
        Config.canClick = false;

        let endScaleY = this._SCALEDOWN;
        if(this.node.scale.y == this._SCALEDOWN){
            endScaleY = this._SCALEUP;
            Config.complateCount --;
            this.node.getComponent(MeshRenderer).material = this.materialsUp[this.type-1];
        }else if(this.node.scale.y == this._SCALEUP){
            endScaleY = this._SCALEDOWN;
            Config.complateCount ++;
            this.node.getComponent(MeshRenderer).material = this.materialsDown[this.type-1];
        }

        Vec3.copy(this._scale, this.node.scale);
        Vec3.copy(this._pos, this.node.position);

        tween(this._scale)
        .to(0.1,new Vec3(this._scale.x,endScaleY,this._scale.z),{
            easing : 'bounceInOut',
            onUpdate: ()=>{
                this.node.setScale(this._scale);
            }
        })
        .call(() => {
            //=====
            if (flag) this.node.parent.emit('changeSideNode', this.index, this.type);
            Config.canClick = true;
            this.node.parent.getComponent(LevelNode).changeComplate(-1);
        })
        .union()
        .repeat(1)
        .start();

        tween(this._pos)
            .to(0.1, new Vec3(this._pos.x, endScaleY / 2, this._pos.z), {
                easing: 'bounceInOut',
                onUpdate: () => {
                    this.node.position = this._pos;
                }
            })
            .union()
            .repeat(1)
            .start();
    }
}
