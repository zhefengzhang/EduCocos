// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

const {ccclass, property} = cc._decorator;

//@ts-ignore
window.roundNow = 0;

@ccclass
export default class Round extends EduElementAbstract {

    public static roundMgr: Round = null;

    //#region 关卡
    @property
    _roundCount: number = 1;
    @property({type: cc.Integer, min: 1, step: 1})
    @eduProperty({displayName: "关卡数量"})
    get roundCount() {
        return this._roundCount;
    }
    set roundCount(value) {
        this.updateRoundStartNum(value);
    }

    @property
    _roundNow: number = 1;
    @property({type: cc.Integer, min: 1, step: 1})
    @eduProperty({displayName: "当前关卡"})
    get roundNow() {
        return this._roundNow;
    }
    set roundNow(value) {
        if (value > this._roundCount) value = this._roundCount;
        if (value < 1) value = 1;
        this._roundNow = value;
    }
    //#endregion

    //#region 奖励
    @property(cc.Node)
    starReward: cc.Node = null;

    @property(cc.Prefab)
    startRewardPfb: cc.Prefab = null;

    @property(cc.SpriteFrame)
    noStartReward: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    startReward: cc.SpriteFrame = null;
    //#endregion

    onLoad () {
        Round.roundMgr = this;
    }

    start () {
        //@ts-ignore
        for (let i = 0; i < this.roundNow - 1; i++) {   
            var _sp =  this.starReward.children[i].getComponent(cc.Sprite);
            if (_sp) {
                //@ts-ignore
                if (_sp.spriteFrame !== this.startReward) {
                    //@ts-ignore
                    _sp.spriteFrame = this.startReward;
                }
            }
        }
    }

    /**
     * @zh 加载指定数量的预制体
     * @param value 生成数量
     * @param parentNode 指定父节点
     * @param prefab 指定预制体
     * @param callback 加载结束后的回调
     */
    loadAnyNumPrefab(value: number, parentNode: cc.Node, prefab: cc.Prefab | cc.Node, callback?: Function) {
        if (parentNode) {
            if (parentNode.childrenCount > value) {
                for (let i = value; i < parentNode.childrenCount; i++) {
                    parentNode.children[i].destroy();
                    if (callback) callback();
                }
            } else if (parentNode.childrenCount < value) {
                if (prefab) {
                    for (let i = parentNode.childrenCount; i < value; i++) {
                        let node = cc.instantiate(prefab);
                        //@ts-ignore
                        parentNode.addChild(node);
                        if (callback) callback(node, i);
                    }
                }
            }
        }
    }

    /**
     * @zh 更新关卡 start 数量
     * @returns 
     */
    updateRoundStartNum (value) {
        if (value < 1) value = 1;
        this._roundCount = value;
        this.loadAnyNumPrefab(value, this.starReward, this.startRewardPfb, (startItem: cc.Node, i: number)=>{
            let lastNode = this.starReward.children[i - 1];
            if (lastNode) {
                startItem.x = lastNode.x + lastNode.width;
            }
        })
    }

    /**
     * @zh 更新星星奖励
     */
    updateStarReward () {
        for (let i = 0; i < this._roundNow; i++) {   
            var _sp =  this.starReward.children[i].getComponent(cc.Sprite);
            if (_sp) {
                //@ts-ignore
                if (_sp.spriteFrame !== this.startReward) {
                    //@ts-ignore
                    _sp.spriteFrame = this.startReward;
                }
            }
        }
    }
}
