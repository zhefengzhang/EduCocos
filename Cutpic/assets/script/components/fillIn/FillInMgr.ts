declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

import Utils from "../Utils";

//@ts-ignore
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("教育课件题型组件/填空题")
export default class FillIn extends EduElementAbstract {

    public static fillInMgr: FillIn = null;

    //#region 问题
    questionTemp: string = `瓶子里原来有2颗石头，乌鸦又叼了2颗放进去，请问现在瓶子里有_______颗石头？`;

    @property(cc.Label)
    questionLab: cc.Label = null;

    @property({type:cc.String, displayName: '问题描述', multiline:true})
    get question() {
        //@ts-ignore
        if (!this.questionLab) {
            //@ts-ignore
            return "";
        }
        return this.questionLab.string;
    }

    // set question(value) {
    //     if (this.questionLab) {
    //         this.questionLab.string = value;
    //     }
    // }

    @property
    _stoneCount: number = 0;
    @property({type: cc.Integer, displayName: '水杯石头数量', min: 0, step: 1})
    @eduProperty({ displayName: '水杯石头数量' })
    get stoneCount() {
        return this._stoneCount;
    }
    set stoneCount(v) {
        if (v < 1) v = 1;
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

    @property(cc.Node)
    stoneBox: cc.Node = null;

    @property(cc.Node)
    waterTop: cc.Node = null;

    @property(cc.Node)
    waterCenter: cc.Node = null;

    @property(cc.Node)
    waterBottom: cc.Node = null;

    @property
    _putInTimes: number = 0;
    @property({type: cc.Integer, min: 1, step: 1})
    @eduProperty({displayName: "乌鸦投放次数"})
    get putInTimes() {
        return this._putInTimes;
    }
    set putInTimes(value) {
        if (value < 1) value = 1;
        this._putInTimes = value;
        this.updateQuestion(null, value)
    }
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

    //#region 预制体
    @property(cc.Prefab)
    stoneItem: cc.Prefab = null;

    @property(cc.Prefab)
    numKeyboardPrfb: cc.Prefab = null;
    //#endregion

    //#region 数字键盘
    numKeyboard: cc.Node = null;
    //#endregion

    /**
     * @zh 组件初始化
     */
    onLoad() {
        FillIn.fillInMgr = this;
    }

    /**
     * @zh 开始游戏
     */
    start () {
        this.addEventListeners();
    }

    /**
     * @zh 开启监听事件
     */
    addEventListeners () {
        //@ts-ignore
        this.node.on(cc.Node.EventType.TOUCH_START, this.onBlankAreaTouched, this);
    }

    /**
     * @zh 文本区域点击
     */
    onQuestionLabTouched (event) {
        if (!this.numKeyboard) {
            //@ts-ignore
            Utils.loadAnyNumPrefab(this.node.childrenCount + 1, this.node, this.numKeyboardPrfb, (keyboard: cc.Node, i: number)=>{
                this.numKeyboard = keyboard;
            })
        }
    }

    /**
     * @zh 页面空白区域点击
     */
    onBlankAreaTouched () {
        if (this.numKeyboard) {
            this.numKeyboard.destroy();
            this.numKeyboard = null;
        }
    }

    /**
     * @zh 更新水位
     */
    updateWaterPosition () {
        
        var waterBottomHeight = this.waterBottom.height;
        var waterCenterHeight = this.waterCenter.height;
        //@ts-ignore
        this.stoneBox.getComponent(cc.Layout).updateLayout();
        var stoneBoxHeight = this.stoneBox.height;
        if (this.stoneCount < 6) return;
        if (stoneBoxHeight > waterBottomHeight + waterCenterHeight) {
            this.waterCenter.height += stoneBoxHeight - waterBottomHeight - waterCenterHeight;
        } else {
            this.waterCenter.height += stoneBoxHeight - waterBottomHeight - waterCenterHeight;
        }
    }

    /**
     * @zh 更新题干
     */
    updateQuestion (stoneNum?, putInStoneNum?, answerNum?) {
        if (!stoneNum) stoneNum = this.stoneCount;
        if (!putInStoneNum) putInStoneNum = this.putInTimes;
        if (!answerNum) answerNum = "____";
        this.questionLab.string = `瓶子里原来有${stoneNum}颗石头，乌鸦又叼了${putInStoneNum}颗放进去，请问现在瓶子里有${answerNum}颗石头？`;;
    }
}
