declare var cc: any;
//@ts-ignore
import { eduProperty, i18n } from "education";

import Choice from "./ChoiceMgr";
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
        var parent = this.node.parent;
        for (let i = 0; i < parent.childrenCount; i++) {
            //@ts-ignore
            var _comp = parent.children[i].getComponent("ChoiceAnswerItem");
            if (_comp) {
                _comp.result.node.opacity = 255;
                
                var answerResult = _comp.answerItemIndex === Choice.choiceMgr._correctAnswerIndex;
                if (answerResult) {
                    _comp.result.spriteFrame = this.correct;
                } else {
                    _comp.result.spriteFrame = this.wrong;
                }
            }
        }
        //@ts-ignore
        for (let i = 0; i < parent.childrenCount; i++) {
            //@ts-ignore
            var _comp = parent.children[i].getComponent("ChoiceAnswerItem");
            if (_comp) {          
                //@ts-ignore
                if (event.target.getComponent("ChoiceAnswerItem").answerItemIndex === Choice.choiceMgr._correctAnswerIndex) {
                    // 此处不考虑关卡进度
                    for (let i = 0; i < Choice.choiceMgr._startReward.childrenCount; i++) {   
                        var _sp =  Choice.choiceMgr._startReward.children[i].getComponent(cc.Sprite);
                        if (_sp) {
                            //@ts-ignore
                            if (_sp.spriteFrame !== this.startReward) {
                                //@ts-ignore
                                _sp.spriteFrame = this.startReward;
                                return;
                            }
                        }
                    }
                    //TODO: 处理回答正确
                    Utils.printLog("回答正确", true);
                    return true;
                } else {
                    //TODO: 处理回答错误
                    Utils.printLog("回答错误", true);
                    //@ts-ignore
                    for (let _i = 0; _i < parent.childrenCount; _i++) {
                        var _comp = parent.children[_i].getComponent("ChoiceAnswerItem");
                        cc.tween(_comp.result.node).to(1, {opacity: 0}).start();
                    }
                    return false;
                }
            }
        }
    }

    // update (dt) {}
}
