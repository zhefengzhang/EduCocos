// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    /**
     * @zh 关闭此页面
     */
    onCloseButtonClicked () {
        this.node.active = false;
    }

    /**
     * @zh 更新界面
     */
    updateView (fontSpf, boxSpf) {
        var fontSp = this.node.getChildByName("tipsBox03").getChildByName("tipsFont01").getComponent(cc.Sprite);
        var boxSp = this.node.getChildByName("tipsBox01").getComponent(cc.Sprite);
        fontSp.spriteFrame = fontSpf
        boxSp.spriteFrame = boxSpf
    }
}
