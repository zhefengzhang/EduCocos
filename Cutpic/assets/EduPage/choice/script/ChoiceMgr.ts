declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

import Utils from "./ChoiceUtils";
import GEnum from "./ChoiceEnum";

//@ts-ignore
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("教育课件题型组件/选择题")
export default class Choice extends EduElementAbstract {

    public static choiceMgr: Choice = null;

    gameWin: boolean = false;
    
    //#region 问题
    @property(cc.Label)
    questionLab: cc.Label = null;

    @property({type:cc.String, displayName: '问题描述', multiline:true})
    @eduProperty({displayName: '问题描述'})
    get question() {
        //@ts-ignore
        if (!this.questionLab) {
            //@ts-ignore
            return "";
        }
        return this.questionLab.string;
    }

    set question(value) {
        if (this.questionLab) {
            this.questionLab.string = value;
        }
    }
    //#endregion

    //#region 答案
    @property
    _answerCount: number = 1;
    @property({type: cc.Integer, displayName: '答案数量', min: 1, step: 1})
    @eduProperty({ displayName: '答案数量' })
    get eduAnswerCount() {
        return this._answerCount;
    }
    set eduAnswerCount(v) {
        if (v < 1) v = 1;
        this._answerCount = v;
        if (this.answerPage) {
            Utils.loadAnyNumPrefab(v, this.answerPage, this.answerItem, (answerItem: cc.Node, i: number)=>{
                let lastNode = this.answerPage.children[i - 1];
                if (lastNode) {
                    answerItem.x = lastNode.x + lastNode.width + 10;
                }
            });
        }
    }

    @property(cc.Node)
    answerPage: cc.Node = null;

    @property(cc.Prefab)
    answerItem: cc.Prefab = null;

    //@ts-ignore
    @property
    _correctAnswerIndex: number = 1;
    @property({type: cc.Integer, displayName: "正确答案的序号", min: 0, step: 1})
    @eduProperty({ displayName: "正确答案的序号" })
    get eduCorrectAnswerIndex() {
        return this._correctAnswerIndex;
    }

    set eduCorrectAnswerIndex(value) {
        this._correctAnswerIndex = value > this.answerPage.childrenCount ? this.answerPage.childrenCount : value;
    }
    //#endregion
    
    //#region 弹窗
    @property({type: GEnum.correctAnswerTipsType})
    @eduProperty({displayName: "回答正确的弹窗文字"})
    correctAnswerTipsType = GEnum.correctAnswerTipsType.答对了;

    @property(cc.SpriteFrame)
    correctAnswerTipsLabSpf1: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    correctAnswerTipsLabSpf2: cc.SpriteFrame = null;

    @property({type: GEnum.wrongAnswerTipsType})
    @eduProperty({displayName: "回答错误的弹窗文字"})
    wrongAnswerTipsType = GEnum.wrongAnswerTipsType.答错了;

    @property(cc.SpriteFrame)
    wrongAnswerTipsLabSpf1: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    wrongAnswerTipsLabSpf2: cc.SpriteFrame = null;

    @property({type: cc.SpriteFrame})
    @eduProperty({displayName: "回答正确的弹窗图片"})
    correctionAnswerTipsSpf: cc.SpriteFrame = null;

    @property({type: cc.SpriteFrame})
    @eduProperty({displayName: "回答错误的弹窗图片"})
    wrongAnswerTipsSpf: cc.SpriteFrame = null;

    @property({type: cc.Prefab})
    correctTipsPrfb: cc.Prefab = null;

    @property({type: cc.Prefab})
    wrongTipsPrfb: cc.Prefab = null;
    
    correctTips: cc.Node = null;

    wrongTips: cc.Node = null;
    //#endregion

    //#region 背景图片
    @property({type: cc.SpriteFrame})
    @eduProperty({displayName: "设置背景图片"})
    get bg() {
        //@ts-ignore
        if (this.node.parent.getComponent("EduPage") && this.node.parent.getComponent("EduPage").bgSprite && this.node.parent.getComponent("EduPage").bgSprite.spriteFrame) {
            //@ts-ignore
            return this.node.parent.getComponent("EduPage").bgSprite.spriteFrame;
        } else {
            return null;
        }
    }

    set bg(value) {
        //@ts-ignore
        if (this.node.parent.getComponent("EduPage") && this.node.parent.getComponent("EduPage").bgSprite) {
            //@ts-ignore
            this.node.parent.getComponent("EduPage").bgSprite.spriteFrame = value;
        }
    }
    //#endregion

    /**
     * @zh 组件初始化
     */
    onLoad() {
        Choice.choiceMgr = this;
    }

    /**
     * @zh 打开 tips 弹窗
     */
    openTips (result) {
        var fontSpf = null;
        var boxSpf = null;
        var tips = result ? this.correctTips : this.wrongTips;
        if (result) {
            //@ts-ignore
            fontSpf = this.correctAnswerTipsType === 0 ? this.correctAnswerTipsLabSpf1 : this.correctAnswerTipsLabSpf2;
            //@ts-ignore
            boxSpf = this.correctionAnswerTipsSpf;
        } else {
            //@ts-ignore
            fontSpf = this.wrongAnswerTipsType === 0 ? this.wrongAnswerTipsLabSpf1 : this.wrongAnswerTipsLabSpf2;
            //@ts-ignore
            boxSpf = this.wrongAnswerTipsSpf;
        }
        if (tips) {
            tips.active = true;
            tips.getComponent("ChoiceTips").updateView(fontSpf, boxSpf);
        } else {
            var tipsPrefab = result ? this.correctTipsPrfb : this.wrongTipsPrfb;
            //@ts-ignore
            Utils.loadAnyNumPrefab(this.node.childrenCount + 1, this.node, tipsPrefab, (tips: cc.Node, i: number)=>{
                if (result) {
                    this.correctTips = tips;
                } else {
                    this.wrongTips = tips;
                }
                tips.getComponent("ChoiceTips").updateView(fontSpf, boxSpf);
            })
        }
    }
}
