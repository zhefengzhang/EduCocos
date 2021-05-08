
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
export default class QuestionItem extends cc.Component {

    @property({ type: cc.Integer, displayName: "问题序号" })
    @eduProperty({ displayName: "问题序号" })
    get answerItemIndex() {
        //@ts-ignore
        return this.node.parent.children.indexOf(this.node) + 1;
    }

    @property(cc.Node)
    pic: cc.Node = null;
    _num = 0;

    _clickStatus = false;

    _status = false;

    // @property
    // _answerNum = 0;
    // @property({type: cc.Integer, displayName: '问题答案', min: 0, step: 1})
    // @eduProperty({ displayName: '问题答案' })
    // get eduAnsweCount() {
    //     return this._answerNum;
    // }
    // set eduAnsweCount(v) {
    //     this._answerNum = v;

    // }
    clickQuesItem() {
        if (ConnectGame.ConnectGameMgr.gameWin) return;
        if (this._status) {
            return;
        }
      
        // let parent = this.node.parent.parent;
        let com = ConnectData.gameParent.getComponent('ConnectGame');
        let index = this.node.parent.children.indexOf(this.node);
        com.clickStart(this.node, index);

        // let pos = this.node.convertToWorldSpaceAR(cc.v2());
        // let _startPos = this.LineContent.convertToNodeSpaceAR(pos);
    }

    getNum() {
        //@ts-ignore
        return this.node.parent.children.indexOf(this.node);
    }
}
