declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

import Utils from "./Utils";
import Audio from "./Audio";
import GData from "./GameData";

//@ts-ignore
const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class GameMgr extends EduElementAbstract {

    public static gameMgr: GameMgr = null;

    //#region 关卡
    @property({type: cc.Integer, min: 1, step: 1})
    @eduProperty({displayName: "关卡数量"})
    get roundCount() {
        if (GData.gRoundCount <= 1) {
            GData.gRoundCount = this.starReward.childrenCount;
            return GData.gRoundCount;
        } else {
            return GData.gRoundCount;
        }
    }
    set roundCount(value) {
        this.updateRoundStartNum(value);
    }
    //#endregion

    
    //#region 下一关按钮
    @property(cc.Node)
    nextRoundBtn: cc.Node = null;
    //#endregion

    //#region 奖励
    @property(cc.Node)
    starReward: cc.Node = null;

    @property(cc.Prefab)
    startRewardPfb: cc.Prefab = null;

    @property(cc.SpriteFrame)
    noStartReward: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    startReward: cc.SpriteFrame = null;

    //#endregion

    //#region 倒计时
    @property(cc.Label)
    countDownMinute: cc.Label = null;

    @property(cc.Label)
    countDownSymbol: cc.Label = null;

    @property(cc.Label)
    countDownSecond: cc.Label = null;

    @property(cc.Prefab)
    countDownTimePrfb: cc.Prefab = null;

    countDownTime: cc.Node = null;
    //#endregion

    onLoad() {
        GameMgr.gameMgr = this;
    }

    /**
     * @zh 游戏开始
     */
    start () {
        if (GData.gRoundCount <= 1) {
            GData.gRoundCount = this.starReward.childrenCount;
        } else {
            this.updateRoundStartNum(GData.gRoundCount);
        }
        if (!CC_EDITOR) {
            for (let i = 0; i < GData.roundNow; i++) {   
                var _sp =  this.starReward.children[i].getComponent(cc.Sprite);
                if (_sp) {
                    //@ts-ignore
                    if (_sp.spriteFrame !== this.startReward) {
                        //@ts-ignore
                        _sp.spriteFrame = this.startReward;
                    }
                }
            }
            this.countDownStart();
            Audio.audioMgr.playBackgroundMusic();
        }
        if (GData.roundNow < GData.gRoundCount) GData.roundNow++;
    }

    onEnable () {
        
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
     * @zh 更新关卡 start 数量
     * @returns 
     */
    updateRoundStartNum (value) {
        if (value < 1) value = 1;
        GData.gRoundCount = value;
        Utils.loadAnyNumPrefab(value, this.starReward, this.starReward.children[0], (startItem: cc.Node, i: number)=>{
            let lastNode = this.starReward.children[i - 1];
            if (lastNode) {
                startItem.x = lastNode.x + lastNode.width;
            }
        })
    }

    /**
     * @zh 逐游戏帧更新倒计时
     */
    updateCountDownTime () {
        if (!this.countDownMinute || !this.countDownSymbol || !this.countDownSecond || this.countDownMinute.string === "" || this.countDownSecond.string === "") return;
        if (GData.countDownTime < 0) {
            //@ts-ignore
            this.unschedule(this.updateCountDownTime, this);
            // Utils.printLog("倒计时结束", true);
            return;
            //TODO: 处理作答结束
        }
        if (GData.countDownTime === 10) {
            if (this.countDownTime) return;
            //@ts-ignore
            Utils.loadAnyNumPrefab(this.node.childrenCount + 1, this.node, this.countDownTimePrfb, (countDownTime, i)=>{
                this.countDownTime = countDownTime;
                cc.tween(this.countDownTime).to(3, {opacity: 0}).call(()=>{
                    this.countDownTime.destroy();
                    this.countDownTime = null;
                }).start();
            })
        }
        GData.countDownTime = Number(this.countDownMinute.string) * 60 + Number(this.countDownSecond.string);
        GData.countDownTime--;
        var minute = Utils.CountDownFewMinutes(GData.countDownTime);
        var second = Utils.CountDownFewSeconds(GData.countDownTime);
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

    onDisable () {
        //@ts-ignore
        this.unschedule(this.updateCountDownTime, this);
    }
}
