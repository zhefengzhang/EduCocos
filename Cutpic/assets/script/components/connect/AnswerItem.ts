
declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

import Utils from "../Utils";

//@ts-ignore
const {ccclass, property, menu} = cc._decorator;
@ccclass
export default class AnswerItem extends EduElementAbstract {
    ConnectGameMgr: Object = null;

    _num = 0;
    _clickStatus = false;
    _status = false;

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
        //@ts-ignore
        // let pos =this.node.convertToWorldSpaceAR(cc.v2());
        // if (this._startPos != null) {
        //     this.drawLine(this._startPos, this._endPos);

        // }
    }
}
