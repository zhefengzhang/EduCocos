// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import FillIn from "./FillInMgr";
import Utils from "../Utils";
import GData from "../GameData";
import GMgr from "../GameMgr";

@ccclass
export default class NewClass extends cc.Component {

    resultNumString: string = "";

    //#region 奖励
    @property(cc.SpriteFrame)
    noStartReward: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    startReward: cc.SpriteFrame = null;
    //#endregion

    onNumKeyboardTouch (event, eventData: string) {
        var fillInMgr = FillIn.fillInMgr;
        switch (eventData) {
            case "reset":
                this.resultNumString = "";
                break;
            case "delete":
                this.resultNumString = this.resultNumString.slice(0, this.resultNumString.length - 1);
            break;
            default:
                if (eventData !== "reset" && eventData !== "clean") {
                    this.resultNumString += eventData;
                }     
        }
        fillInMgr.updateQuestion(null, null, this.resultNumString);
    }

    /**
     * @zh 提交
     */
    onCommit () {
        if (this.resultNumString === FillIn.fillInMgr.correctAnswerNumber.toString()) {
            Utils.printLog("回答正确", true);
                FillIn.fillInMgr.openTips(true);
                for (let i = 0; i < GData.roundNow; i++) {   
                    var _sp =  GMgr.gameMgr.starReward.children[i].getComponent(cc.Sprite);
                    if (_sp) {
                        //@ts-ignore
                        if (_sp.spriteFrame !== this.startReward) {
                            //@ts-ignore
                            _sp.spriteFrame = this.startReward;
                            this.node.destroy();
                            FillIn.fillInMgr.numKeyboard = null;
                            return;
                        }
                    }
                }
        } else {
            Utils.printLog("回答错误", true);
            FillIn.fillInMgr.openTips(false);
        }
        this.node.destroy();
        FillIn.fillInMgr.numKeyboard = null;
    }
}
