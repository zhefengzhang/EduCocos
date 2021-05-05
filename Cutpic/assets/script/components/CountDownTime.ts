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
}
