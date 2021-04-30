declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";
//@ts-ignore
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("教育课件题型组件/选择题")
export default class Choice extends EduElementAbstract {
    @property
    _count = 0;
    @property({type: cc.Integer, min: 0, step: 1})
    @eduProperty({
        displayName: '答案数量',
    })

    get count() {
        return this._count;
    }

    set count(v) {
        this._count = v;
        if (this.answerPage) {
            syncNum(v, this.answerPage, this.answerItem);
        }
    }

    @property(cc.Node)
    answerPage: cc.Node = null;

    @property(cc.Prefab)
    answerItem: cc.Prefab = null;

    //还需要倒计时功能
}
