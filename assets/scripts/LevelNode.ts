import { _decorator, Component, Node, instantiate, Prefab, Vec3, sys } from 'cc';
import { Config } from './Config';
import { CubeNode } from './CubeNode';
const { ccclass, property } = _decorator;

@ccclass('LevelNode')
export class LevelNode extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    @property(Prefab)
    cubeNode = null;

    @property
    private childArr = [];

    @property
    private complateCount = 0;

    start () {
        let levelIndex = sys.localStorage.getItem('levelIndex');
        if(levelIndex){
            Config.levelIndex = levelIndex;
        }
        this.initData();
    }

    initData(){
        Config.isPassLevel = false;
        Config.complateCount = 0;
        this.complateCount = 0;
        this.childArr = [];
        let levelData = Config.levelData['level_' + Config.levelIndex];
        let x_mid = Math.floor(levelData[0].length/2);
        let y_mid = Math.floor(levelData.length/2);

        for(let i = 0; i < levelData.length; i++){
            for(let j = 0; j < levelData[i].length; j++){
                if(levelData[i][j] != 0){
                    let x = j - x_mid;
                    let z = i - y_mid;
                    let index = i * levelData[0].length * j;
                    let node = instantiate(this.cubeNode);
                    node.parent = this.node;
                    node.position = new Vec3(x,0.4,z);
                    node.getComponent(CubeNode).init(index,levelData[i][j]);
                    this.childArr.push(node);
                    if(levelData[i][j] < 0){
                        Config.complateCount ++;
                    }
                }
            }
        }
    }

    changeComplate(num){
        this.complateCount += num;
        if(Config.complateCount >= this.childArr.length && !Config.isPassLevel){
            console.log('--------------过关', Config.levelIndex);
            Config.levelIndex++;
            if(Config.levelIndex >= 29)Config.levelIndex = 8 + Math.floor(Math.random()*21);
           this.scheduleOnce(this.removeChildArr, 1);
           Config.isPassLevel = true;
           sys.localStorage.setItem('levelIndex', Config.levelIndex);
        //    window.Notification.emit('passLevel');
        }
    }

    removeChildArr(){
        for(let i = 0; i < this.childArr.length; i++){
            this.childArr[i].destroy();
            this.childArr[i] = null;
        }
        console.log('-----------remove all');
        this.initData();
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
