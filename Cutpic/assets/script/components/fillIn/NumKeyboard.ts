// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import FillIn from "./FillInMgr";

@ccclass
export default class NewClass extends cc.Component {

    onNumKeyboardTouch (event, eventData: string) {
        var fillInMgr = FillIn.fillInMgr;
        var num = "";
        switch (eventData) {
            case "reset":

                break;
            case "clean":

            break;
            default:
                if (eventData !== "reset" && eventData !== "clean") {
                    num += eventData;
                    fillInMgr.updateQuestion(null, null, num);
                }
                
        }
    }
}
