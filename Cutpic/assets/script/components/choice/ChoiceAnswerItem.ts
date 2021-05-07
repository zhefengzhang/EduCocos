declare var cc: any;
//@ts-ignore
import { eduProperty, i18n } from "education";

import Choice from "./ChoiceMgr"
import GMgr from "../GameMgr";
import GData from "../GameData";
import Utils from "../Utils";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends EduElementAbstract {

    choiceMgr: Object = null;

    @property({type: cc.Integer, displayName: "答案序号"})
    @eduProperty({ displayName: "答案序号" })
    get answerItemIndex() {
        //@ts-ignore
        return this.node.parent.children.indexOf(this.node) + 1;
    }

    //#region sprite
    @property(cc.Sprite)
    fruit: cc.Sprite = null;

    @property(cc.Sprite)
    result: cc.Sprite = null;
    //#endregion

    //#region spriteFrame
    @property(cc.SpriteFrame)
    correct: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    wrong: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    fruits: Array<cc.SpriteFrame> = [];

    @property(cc.SpriteFrame)
    noStartReward: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    startReward: cc.SpriteFrame = null;
    //#endregion

    /**
     * @zh 初始化界面
     */
    initView () {
        var spfIndex = Math.floor(Math.random() * this.fruits.length);
        var newSpf = this.fruits[spfIndex];
        if (newSpf) this.fruit.spriteFrame = newSpf;
    }

    /**
     * @zh 点击作答按钮的回调
     */
    onButtonCLicked (event: TouchEvent) {
        if (Choice.choiceMgr._correctAnswerIndex === 0) return;
        //@ts-ignore
        var _selfComp =  event.target.getComponent("ChoiceAnswerItem");
        _selfComp.result.node.opacity = 255;
        if (_selfComp.answerItemIndex === Choice.choiceMgr._correctAnswerIndex) {
            for (let i = 0; i < GData.roundNow; i++) {   
                var _sp =  GMgr.gameMgr.starReward.children[i].getComponent(cc.Sprite);
                if (_sp) {
                    //@ts-ignore
                    if (_sp.spriteFrame !== this.startReward) {
                        //@ts-ignore
                        _sp.spriteFrame = this.startReward;
                        return;
                    }
                }
            }
            Utils.printLog("回答正确", true);
            _selfComp.result.spriteFrame = this.correct;
        } else {
            Utils.printLog("回答错误", true);
            _selfComp.result.spriteFrame = this.wrong;
        }
        
        cc.tween(_selfComp.result.node).to(1.5, {opacity: 0}).start();
    }

    // update (dt) {}
}
