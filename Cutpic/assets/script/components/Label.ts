declare var cc: any;
//@ts-ignore
import { eduProperty, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";
//@ts-ignore
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("教育课件UI组件/Label")
export default class Label extends EduElementAbstract {
    @property({type:cc.String, multiline:true, tooltip: '问题'})
    @eduProperty({displayName: '问题'})
    get question() {
        //@ts-ignore
        let label = this.node.getComponent(cc.Label)
        if (!label) {
            //@ts-ignore
            label = this.node.addComponent(cc.Label)
        }
        return label.string;
    }

    set question(value) {
        //@ts-ignore
        let label = this.node.getComponent(cc.Label)
        if (label) {
            label.string = value;
        }
    }
}
