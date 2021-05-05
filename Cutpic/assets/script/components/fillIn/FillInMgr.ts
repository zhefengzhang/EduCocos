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
    _stoneCount: number = 0;
    @property({type: cc.Integer, displayName: '石头数量', min: 0, step: 1})
    @eduProperty({ displayName: '石头数量' })
    get stoneCount() {
        return this._stoneCount;
    }
    set stoneCount(v) {
        this._stoneCount = v;
        if (this.stoneBox) {
            Utils.loadAnyNumPrefab(v, this.stoneBox, this.stoneItem);
        }
    }

    @property(cc.Node)
    stoneBox: cc.Node = null;

    @property(cc.Prefab)
    stoneItem: cc.Prefab = null;

    //@ts-ignore
    @property
    _correctAnswerNumber: number = 0;
    @property({type: cc.Integer, displayName: "正确答案的数字", min: 0, step: 1})
    @eduProperty({ displayName: "正确答案的数字" })
    get correctAnswerNumber() {
        return this._correctAnswerNumber;
    }

    set correctAnswerNumber(value) {
        this._correctAnswerNumber = value > this.stoneBox.childrenCount ? this.stoneBox.childrenCount : value;
    }
    //#endregion

    //#region 奖励
    @property(cc.Node)
    starReward: cc.Node = null;
    get _startReward() {
        return this.starReward;
    }

    @property(cc.Prefab)
    startRewardPfb: cc.Prefab = null;
    //#endregion

    //#region 倒计时
    @property(cc.Label)
    countDownMinute: cc.Label = null;

    @property(cc.Label)
    countDownSymbol: cc.Label = null;

    @property(cc.Label)
    countDownSecond: cc.Label = null;

    countDownTime: number = null; //倒计时秒数
    //#endregion
    
    onLoad() {
        FillIn.fillInMgr = this;
    }

    /**
     * @zh 游戏开始
     */
    start () {
        this.countDownStart();
    }

    /**
     * @zh 开始倒计时
     */
    countDownStart () {
        //@ts-ignore
        this.schedule(this.updateCountDownTime.bind(this), 1);
        Utils.printLog("倒计时开始", true);
    }

    /**
     * @zh 逐游戏帧更新倒计时
     */
    updateCountDownTime () {
        if (this.countDownTime < 0) {
            //@ts-ignore
            this.unschedule(this.updateCountDownTime, this);
            Utils.printLog("倒计时结束", true);
            //TODO: 处理作答结束
        }
        if (this.countDownMinute.string === "" || this.countDownSecond.string === "") return;
        this.countDownTime = Number(this.countDownMinute.string) * 60 + Number(this.countDownSecond.string);
        this.countDownTime--;
        var minute = Utils.CountDownFewMinutes(this.countDownTime);
        var second = Utils.CountDownFewSeconds(this.countDownTime);
        var minuteString = minute > 9 ? minute : "0" + minute;
        var secondString = second > 9 ? second : "0" + second;
        this.countDownMinute.string = minuteString.toString();
        this.countDownSecond.string = secondString.toString();
    }

    /**
     * @zh 点击关闭游戏按钮的回调
     */
    onGameCloseButtonClicked() {
        //@ts-ignore
        this.node.destroy();
    }
}
