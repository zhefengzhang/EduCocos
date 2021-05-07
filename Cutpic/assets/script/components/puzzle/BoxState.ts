// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _boxNum = 0;
    _isHave = false;
    _containerIndex = 0;

    @property(cc.SpriteFrame)
    blueSprite: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    graySprite: cc.SpriteFrame = null;
    
    changeSprite(flag) {
        if (flag) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.blueSprite;
        } else {
            this.node.getComponent(cc.Sprite).spriteFrame = this.graySprite;

        }
    }
}
