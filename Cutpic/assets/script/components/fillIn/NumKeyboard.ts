// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import FillIn from "./FillInMgr";
import Utils from "../Utils";
import Round from "../Round";

@ccclass
export default class NewClass extends cc.Component {

    //#region 奖励
    @property(cc.SpriteFrame)
    noStartReward: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    startReward: cc.SpriteFrame = null;
    //#endregion

    onNumKeyboardTouch (event, eventData: string) {
        FillIn.fillInMgr.resultNumString = "";
        var fillInMgr = FillIn.fillInMgr;
        FillIn.fillInMgr.resultNumString += eventData;
        fillInMgr.updateQuestion(null, null, FillIn.fillInMgr.resultNumString);
        this.onCommit();
    }

    /**
     * @zh 提交
     */
    onCommit () {
        if (FillIn.fillInMgr.resultNumString === FillIn.fillInMgr.correctAnswerNumber.toString()) {
            Utils.printLog("回答正确", true);
            FillIn.fillInMgr.animation.getComponent(cc.Animation).play("crowDrink");
            Round.roundMgr.updateStarReward();
            FillIn.fillInMgr.gameWin = true;
            this.node.active = false;
        } else {
            Utils.printLog("回答错误", true);
            FillIn.fillInMgr.openTips(false);
        }
    }
}
