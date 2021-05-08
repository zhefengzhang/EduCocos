// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import FillIn from "./FillInMgr";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    leftStone: cc.Prefab = null;

    @property(cc.Prefab)
    rightStone: cc.Prefab = null;

    @property(cc.Animation)
    putInStoneAnim: cc.Animation = null;

    /**
     * @zh 当前投放次数
     */
    putInTimesNow: number = 0;

    /**
     * @zh 滚动石头是否结束
     */
    rockStoneFinish: boolean = false;

    /**
     * @zh 投放左边的石头
     */
    putInStoneLeft () {
        var stoneBox = FillIn.fillInMgr.stoneBox;
        var newStone = cc.instantiate(this.leftStone);
        var newName = new Date();
        newStone.name = newName.toString();
        newStone.opacity = 255;
        stoneBox.parent.addChild(newStone);
        this.schedule(this.rockStone.bind(this, stoneBox, newStone))
        this.putInTimesNow++;
    }
    
    /**
     * @zh 投放右边的石头
     */
    putInStoneRight () {
        var stoneBox = FillIn.fillInMgr.stoneBox;
        var newStone = cc.instantiate(this.rightStone);
        var newName = new Date();
        newStone.name = newName.toString();
        newStone.opacity = 255;
        stoneBox.parent.addChild(newStone);
        this.schedule(this.rockStone.bind(this, stoneBox, newStone))
        this.putInTimesNow++;
    }

    /**
     * @zh 石头滚落
     */
    rockStone (stoneBox: cc.Node, stone: cc.Node) {
        var stoneBoxRect = stoneBox.getBoundingBoxToWorld();
        stoneBoxRect.height -= 12;
        stoneBoxRect.width -= 10;
        var stoneRect = stone.getBoundingBoxToWorld();
        var waterRect = FillIn.fillInMgr.waterCenter.getBoundingBoxToWorld();
        if (!stone.getComponent("Stone").isPutInWater) {
            if (cc.Intersection.rectRect(stoneRect, waterRect)) {
                stone.getComponent("Stone").isPutInWater = true;
                FillIn.fillInMgr.updateWaterPosition();
            }
        }
        if (!cc.Intersection.rectRect(stoneBoxRect, stoneRect)) {
            stone.y -= 1;
        } else {
            if (stone.parent !== stoneBox) {
                stone.parent = stoneBox;
            }
        }
    }

    isPutInStoneFinish () {
        var putInTimes = FillIn.fillInMgr._putInTimes;
        if (this.putInTimesNow >= putInTimes) {
            this.putInStoneAnim.stop();
            if (FillIn.fillInMgr.resultNumString === FillIn.fillInMgr.correctAnswerNumber.toString()) {
                FillIn.fillInMgr.openTips(true);
            }
        }
    }
}
