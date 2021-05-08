
declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

import ConnectData from "./ConnectData";
import ConnectGame from "./ConnectGame";

//@ts-ignore
const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class AnswerItem extends EduElementAbstract {

    @property({ type: cc.Integer, displayName: "答案序号" })
    @eduProperty({ displayName: "答案序号" })
    get answerItemIndex() {
        //@ts-ignore
        return this.node.parent.children.indexOf(this.node) + 1;
    }
    _num = 0;
    _clickStatus = false;
    _status = false;

    @property(cc.Node)
    pic: cc.Node = null;
    // @property
    // _answerNum = 0;
    // @property({type: cc.Integer, displayName: '正确答案', min: 0, step: 1})
    // @eduProperty({ displayName: '正确答案' })
    // get eduAnsweCount() {
    //     return this._answerNum;
    // }
    // set eduAnsweCount(v) {
    //     this._answerNum = v;

    // }
    clickAnswerItem() {
        if (ConnectGame.ConnectGameMgr.gameWin) return;
        if(this._status){
            return;
        }
       
        //@ts-ignore
        // let parent = this.node.parent.parent.parent;
        let com = ConnectData.gameParent.getComponent('ConnectGame');
        //@ts-ignore
        let index = this.node.parent.children.indexOf(this.node);
        //@ts-ignore
        com.clickEnd(this.node, index);
    }

    getNum(){
        //@ts-ignore
        return this.node.parent.children.indexOf(this.node);
    }
}
