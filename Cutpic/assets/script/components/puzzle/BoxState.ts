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
    
    @property(cc.Node)
    blueNode: cc.Node = null;
    @property(cc.Node)
    whiteNode: cc.Node = null;
    
    changeSprite(flag) {
        this.blueNode.active = flag;
        
    }
    changeContentSize(){
        this.blueNode.width = this.node.width + 20;
        this.blueNode.height = this.node.height + 20;
        this.whiteNode.width = this.node.width-2;
        this.whiteNode.height = this.node.height-2;

    }
}
