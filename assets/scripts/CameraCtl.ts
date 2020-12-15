import { _decorator, Component, Node, systemEvent, SystemEventType, geometry, CameraComponent, PhysicsSystem, Layers } from 'cc';
import { Config } from './Config';
import { CubeNode } from './CubeNode';
const { ccclass, property } = _decorator;

@ccclass('CameraCtl')
export class CameraCtl extends Component {

    _ray = new geometry.ray();
    _maxDistance = 100;

    start () {
        systemEvent.on(SystemEventType.TOUCH_START,this._touchStart,this);
    }

    _touchStart(touch,event){
        if(!Config.canClick || Config.isPassLevel){
            return;
        }
        let camera = this.node.getComponent(CameraComponent);
        camera.screenPointToRay(touch._point.x, touch._point.y, this._ray);
        let result = PhysicsSystem.instance.raycastClosest(this._ray, -1, this._maxDistance,false);
        if(result){
            const r = PhysicsSystem.instance.raycastClosestResult.collider;
            r.node.getComponent(CubeNode).changeScale();
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
