import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CubeNode')
export class CubeNode extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    private index = -1;

    _scale = new Vec3(0,0,0);
    _pos = new Vec3(0, 0, 0);

    start () {
        // Your initialization goes here.
        console.log("cube start");
    }

    init(index,typeIndex){
        this.index = index;
        if(typeIndex == 1){
            this.node.setScale(new Vec3(this.node.scale.x,1,this.node.scale.z));
        }else{
            this.node.setScale(new Vec3(this.node.scale.x,0.5,this.node.scale.z));
        }
    }

    changeScale(){
        let endScaleY = 0.5;
        if(this.node.scale.y == 0.5){
            endScaleY = 1;
        }else if(this.node.scale.y == 1){
            endScaleY = 0.5;
        }

        Vec3.copy(this._scale, this.node.scale);
        Vec3.copy(this._pos, this.node.position);

        tween(this._scale)
        .to(0.1,new Vec3(this._scale.x,endScaleY,this._scale.z),{
            easing : 'bounceInOut',
            onUpdate: ()=>{
                this.node.scale = this._scale;
            }
        })
        .call(() => {
            //=====
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
