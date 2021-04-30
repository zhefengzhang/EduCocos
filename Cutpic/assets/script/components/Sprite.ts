declare var cc: any;
//@ts-ignore
import { eduProperty, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";
//@ts-ignore
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("教育课件UI组件/Sprite")
export default class Sprite extends EduElementAbstract {

    @property(cc.SpriteFrame)
    @eduProperty({displayName: '图片'})
    get spriteFrame() {
        //@ts-ignore
        let sprite = this.node.getComponent(cc.Sprite)
        if (!sprite) {
            //@ts-ignore
            sprite = this.node.addComponent(cc.Sprite)
        }
        return sprite.spriteFrame;
    }

    set spriteFrame(value) {
        //@ts-ignore
        let sprite = this.node.getComponent(cc.Sprite)
        if (sprite) {
            sprite.spriteFrame = value;
        }
    }
}
