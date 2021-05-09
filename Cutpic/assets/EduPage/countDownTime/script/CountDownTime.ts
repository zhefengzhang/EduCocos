declare var cc: any;
//@ts-ignore
import { eduProperty, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";
//@ts-ignore
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("教育课件UI组件/倒计时文本")
export default class Label extends EduElementAbstract {

    //#region 倒计时
    @property(cc.Label)
    countDownMinuteLab: cc.Label = null;

    @property({type:cc.String, multiline:true, tooltip: '倒计时分钟'})
    @eduProperty({displayName: '倒计时分钟'})
    get countDownMinute() {
        if (!this.countDownMinuteLab) {
            return "00";
        }
        return this.countDownMinuteLab.string;
    }

    set countDownMinute(value) {
        if (this.countDownMinuteLab) {
            if (Number(value) > 59) value = "59";
            this.countDownMinuteLab.string = value;
        }
    }

    @property(cc.Label)
    countDownSecondLab: cc.Label = null;

    @property({type:cc.String, multiline:true, tooltip: '倒计时秒钟'})
    @eduProperty({displayName: '倒计时秒钟'})
    get countDownSecond() {
        if (!this.countDownSecondLab) {
            return "00";
        }
        return this.countDownSecondLab.string;
    }

    set countDownSecond(value) {
        if (this.countDownSecondLab) {
            if (Number(value) > 59) value = "59";
            this.countDownSecondLab.string = value;
        }
    }
    
    @property(cc.Label)
    countDownSymbol: cc.Label = null;

    @property(cc.Prefab)
    countDownTimePrfb: cc.Prefab = null;

    countDownTime: cc.Node = null;

    countDownTimeSecond: number = 0;
    //#endregion

    start () {
        this.countDownStart();
    }

    /**
     * @zh 开始倒计时
     */
    countDownStart () {
        //@ts-ignore
        this.schedule(this.updateCountDownTime.bind(this), 1);
    }
    
    /**
     * @zh 计算倒计时还有几分钟
     * @param date 
     * @returns 
     */
    CountDownFewMinutes(totalSecond) {
        if (totalSecond < 0) return 0;
        return Math.floor((totalSecond % 3600) / 60);
    }
        
    /**
     * @zh 计算倒计时还有几秒
     * @param date 
     * @returns 
     */
    CountDownFewSeconds(totalSecond) {
        if (totalSecond < 0) return 0;
        return ((totalSecond % 3600) % 60);
    }
    
    /**
     * @zh 加载指定数量的预制体
     * @param value 生成数量
     * @param parentNode 指定父节点
     * @param prefab 指定预制体
     * @param callback 加载结束后的回调
     */
    loadAnyNumPrefab(value: number, parentNode: cc.Node, prefab: cc.Prefab | cc.Node, callback?: Function) {
        if (parentNode) {
            if (parentNode.childrenCount > value) {
                for (let i = value; i < parentNode.childrenCount; i++) {
                    parentNode.children[i].destroy();
                    if (callback) callback();
                }
            } else if (parentNode.childrenCount < value) {
                if (prefab) {
                    for (let i = parentNode.childrenCount; i < value; i++) {
                        let node = cc.instantiate(prefab);
                        //@ts-ignore
                        parentNode.addChild(node);
                        if (callback) callback(node, i);
                    }
                }
            }
        }
    }

    /**
     * @zh 逐游戏帧更新倒计时
     */
    updateCountDownTime () {
        if (!this.countDownMinute || !this.countDownSymbol || !this.countDownSecond || this.countDownMinute === "" || this.countDownSecond === "") return;
        if (this.countDownTimeSecond < 0) {
            return;
        }
        if (this.countDownTimeSecond === 10) {
            //@ts-ignore
            this.loadAnyNumPrefab(this.node.parent.childrenCount + 1, this.node.parent, this.countDownTimePrfb, (countDownTime: cc.Node, i: number)=>{
                // this.countDownTime = countDownTime;
                // cc.tween(this.countDownTime).to(3, {opacity: 0}).call(()=>{
                //     this.countDownTime.destroy();
                //     this.countDownTime = null;
                // }).start();
            })
        }
        this.countDownTimeSecond = Number(this.countDownMinute) * 60 + Number(this.countDownSecond);
        this.countDownTimeSecond--;
        var minute = this.CountDownFewMinutes(this.countDownTimeSecond);
        var second = this.CountDownFewSeconds(this.countDownTimeSecond);
        var minuteString = minute > 9 ? minute : "0" + minute;
        var secondString = second > 9 ? second : "0" + second;
        this.countDownMinute = minuteString.toString();
        this.countDownSecond = secondString.toString();
    }
}
