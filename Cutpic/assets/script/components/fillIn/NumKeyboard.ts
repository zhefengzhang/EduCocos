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

    resultNumString: string = "";

    //#region 奖励
    @property(cc.SpriteFrame)
    noStartReward: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    startReward: cc.SpriteFrame = null;
    //#endregion

    /**
     * @zh 激活 widget 组件调整节点位置
     */
    widgetActive () {
        var widgetComp = this.node.getComponent(cc.Widget);
        widgetComp.enabled = true;
    }

    onNumKeyboardTouch (event, eventData: string) {
        var fillInMgr = FillIn.fillInMgr;
        this.resultNumString += eventData;
        fillInMgr.updateQuestion(null, null, this.resultNumString);
        this.onCommit();
    }

    /**
     * @zh 提交
     */
    onCommit () {
        if (this.resultNumString === FillIn.fillInMgr.correctAnswerNumber.toString()) {
            Utils.printLog("回答正确", true);
            FillIn.fillInMgr.openTips(true);
            FillIn.fillInMgr.animation.getComponent(cc.Animation).play();
            Round.roundMgr.updateStarReward();
        } else {
            Utils.printLog("回答错误", true);
            FillIn.fillInMgr.openTips(false);
        }
        this.node.active = false;
    }
}
