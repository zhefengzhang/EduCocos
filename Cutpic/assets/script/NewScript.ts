// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class NewClass extends cc.Component {

    // @property    
    // public get value() : string {
       
       
    //     var testNode = new cc.Node();
    //      //@ts-ignore
    //     this.node.objectFlag = testNode.objectFlag;
    //     return 
    // }
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        var testNode = new cc.Node();
        
        // cc.log(testNode.objectFlag)
        //@ts-ignore
        this.node._objFlags = testNode._objFlags;
    }

    // update (dt) {}
}
