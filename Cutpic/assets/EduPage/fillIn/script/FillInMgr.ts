declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

import Utils from "./FillInUtils";
import GEnum from "./FillInEnum"

//@ts-ignore
const {ccclass, property, menu, executeInEditMode} = cc._decorator;

function insertStr(soure, start, newStr){   
    return soure.slice(0, start) + newStr + soure.slice(start);
}

@ccclass
@executeInEditMode
@menu("教育课件题型组件/填空题")
export default class FillIn extends EduElementAbstract {

    public static fillInMgr: FillIn = null;

    gameWin: boolean = false;

    //#region 问题
    @property(cc.Label)
    questionLab: cc.Label = null;
    
    @property({type:cc.String, displayName: '问题描述', multiline:true})
    // @eduProperty({displayName: "问题描述"})
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

    @property({type: cc.String})
    @eduProperty({displayName: "存放石头的物体名"})
    get storeStoneObjName() {
        var firstIndex = this.question.indexOf("里");
        return this.question.slice(0, firstIndex);
    }
    set storeStoneObjName(value) {
        if (this.storeStoneObjName === "") {
            this.question = insertStr(this.question, this.question.indexOf("里"), value);
            this.question = insertStr(this.question, this.question.lastIndexOf("里"), value);
        } else {
            var re = new RegExp(this.storeStoneObjName, "g");
            this.question = this.question.replace(re, value)
        }
    }

    @property({type: cc.String})
    @eduProperty({displayName: "投放石头的物体名"})
    get dropStoneObjName() {
        var firstIndex = this.question.indexOf("，");
        var secondIndex = this.question.indexOf("又叼");
        return this.question.slice(firstIndex + 1, secondIndex);
    }
    set dropStoneObjName(value) {
        if (this.dropStoneObjName === "") {
            this.question = insertStr(this.question, this.question.lastIndexOf("又叼"), value);
        } else {
            var re = new RegExp(this.dropStoneObjName, "g");
            this.question = this.question.replace(re, value)
        }
    }

    @property
    stoneCountMax: number = 0;

    @property
    _stoneCount: number = 0;
    @property({type: cc.Integer, displayName: '石头数量', min: 0, step: 1})
    @eduProperty({ displayName: '石头数量' })
    get stoneCount() {
        return this._stoneCount;
    }
    set stoneCount(v) {
        if (v < 0) v = 0;
        if (this.putInTimes + v > this.stoneCountMax) return;
        this._stoneCount = v;
        this.updateQuestion(v)
        if (this.stoneBox) {
            Utils.loadAnyNumPrefab(v, this.stoneBox, this.stoneItem, (stoneItem: cc.Node, i: number)=>{
                let lastNode = this.stoneBox.children[i - 1];
                if (lastNode) {
                    stoneItem.angle = Math.random() * 360;
                }
                this.updateWaterPosition();
            });
        }
    }

    @property(cc.Prefab)
    stoneItem: cc.Prefab = null;

    @property(cc.Node)
    stoneBox: cc.Node = null;
    
    @property
    _putInTimes: number = 0;
    @property({type: cc.Integer, min: 0, step: 1})
    @eduProperty({displayName: "投放次数"})
    get putInTimes() {
        return this._putInTimes;
    }
    set putInTimes(value) {
        if (value < 0) value = 0;
        if (this.stoneCount + value > this.stoneCountMax) return;
        this._putInTimes = value;
        this.updateQuestion(null, value)
    }
    //#endregion

    //#region 水杯
    @property
    waterCenterMaxHeight: number = 0;

    @property
    waterUpdateHeightStep: number = 0;

    waterTempHeight: number = 0;

    @property(cc.Node)
    waterCenter: cc.Node = null;
    //#endregion

    //#region 动画节点
    @property(cc.Node)
    animation: cc.Node = null;
    //#endregion

    //#region 答案
    // @ts-ignore
    @property
    _correctAnswerNumber: number = 0;
    @property({type: cc.Integer, displayName: "正确答案的数字", min: 0, step: 1})
    @eduProperty({ displayName: "正确答案的数字" })
    get correctAnswerNumber() {
        return this._correctAnswerNumber;
    }

    set correctAnswerNumber(value) {
        this._correctAnswerNumber = value;
    }
    //#endregion

    //#region 数字键盘
    @property(cc.Node)
    numKeyboard: cc.Node = null;

    resultNumString: string = "";
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
        FillIn.fillInMgr = this;
        this.waterTempHeight = this.waterCenter.height;
    }

    /**
     * @zh 游戏开始
     */
    start () {
        if (!CC_EDITOR) {
            this.numKeyboard.active = false;
        }
    }

    /**
     * @zh 文本区域点击
     */
    onQuestionLabTouched (event) {
        if (!this.gameWin) this.numKeyboard.active = true;
    }

    /**
     * @zh 更新水位
     */
    updateWaterPosition () {
        var newHeight = 38 + this.stoneCount * this.waterUpdateHeightStep;
        if (newHeight >= 176) return;
        if (CC_EDITOR) {
            this.waterCenter.height = newHeight;
        } else {
            this.waterTempHeight += this.waterUpdateHeightStep;
            cc.tween(this.waterCenter).to(1, {height: this.waterTempHeight}, {easing: "smooth"}).start();
        }  
    }

    /**
     * @zh 更新题干
     */
    updateQuestion (stoneNum?, putInStoneNum?, answerNum?) {
        if (!stoneNum || stoneNum === "") stoneNum = this.stoneCount;
        if (!putInStoneNum || putInStoneNum === "") putInStoneNum = this.putInTimes;
        if (!answerNum || answerNum === "") answerNum = "____";
        this.questionLab.string = `瓶子里原来有${stoneNum}颗石头，乌鸦又叼了${putInStoneNum}颗放进去，请问现在瓶子里有${answerNum}颗石头？`;;
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
            tips.getComponent("FillInTips").updateView(fontSpf, boxSpf);
        } else {
            var tipsPrefab = result ? this.correctTipsPrfb : this.wrongTipsPrfb;
            //@ts-ignore
            Utils.loadAnyNumPrefab(this.node.childrenCount + 1, this.node, tipsPrefab, (tips: cc.Node, i: number)=>{
                if (result) {
                    this.correctTips = tips;
                } else {
                    this.wrongTips = tips;
                }
                tips.getComponent("FillInTips").updateView(fontSpf, boxSpf);
            })
        }
    }
}
