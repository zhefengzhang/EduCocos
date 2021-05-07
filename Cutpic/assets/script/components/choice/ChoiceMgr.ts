declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

import Utils from "../Utils";
import GEnum from "../GameEnum";

//@ts-ignore
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("教育课件题型组件/选择题")
export default class Choice extends EduElementAbstract {

    public static choiceMgr: Choice = null;

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
    _answerCount: number = 0;
    @property({type: cc.Integer, displayName: '答案数量', min: 1, step: 1})
    @eduProperty({ displayName: '答案数量' })
    get eduAnswerCount() {
        return this._answerCount;
    }
    set eduAnswerCount(v) {
        if (v < 1) v = 1;
        this._answerCount = v;
        if (this.answerPage) {
            Utils.loadAnyNumPrefab(v, this.answerPage, this.answerPage.children[0], (answerItem: cc.Node, i: number)=>{
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
    _correctAnswerIndex: number = 0;
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
    tipsPrfb: cc.Prefab = null;

    @property(cc.Node)
    tips: cc.Node = null;
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
    openTips () {
        if (!this.tips) {
            //@ts-ignore
            Utils.loadAnyNumPrefab(this.node.childrenCount + 1, this.node, this.tipsPrfb, (tips: cc.Node, i: number)=>{
                this.tips = tips;
            })
        }
    }

        /**
     * @zh 页面空白区域点击
     */
        onBlankAreaTouched () {
        if (this.tips) {
            this.tips.destroy();
            this.tips = null;
        }
    }
}
