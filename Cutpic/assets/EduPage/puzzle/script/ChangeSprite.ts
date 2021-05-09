declare var cc: any;
//@ts-ignore
import { eduProperty, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";
// import PuzzleGame from "./PuzzleGame";

//@ts-ignore
const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class ChangeSprite extends EduElementAbstract {
    @property(cc.Node)
    imageNode: cc.Node = null;
    @property(cc.SpriteFrame)
    @eduProperty({ displayName: '图片' })
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
        if(this.imageNode!=null){
            // Editor.log('llll')
            //@ts-ignore
            this.imageNode.getComponent(cc.Sprite).spriteFrame = value;
            this.imageNode.parent.getComponent('PuzzleGame')._cutState = false;
            this.imageNode.parent.getComponent('PuzzleGame').cutPic();
        }
    }
}