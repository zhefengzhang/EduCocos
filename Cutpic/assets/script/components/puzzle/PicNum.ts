// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import PuzzleData from "./PuzzleData";

@ccclass
export default class NewClass extends cc.Component {

    num = 0;
    _canMove = true;
    name = "";
    data = null;
    parentNode = null;
    parentIndex = null;
    _startMove = false;
    _isCorrect = false;
    _isMove = false;
    onEnable() {
        this.regisTouchEvent();

    }

    init() {
        this._canMove = true;
        this.parentIndex = null;
        this._startMove = false;
        this._isCorrect = false;
        this._isMove = false;
    }
    onDisable() {
        this.removeTouchEvent();
    }

    regisTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }

    removeTouchEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    }
    _onTouchStart(event) {
        if(PuzzleData.finishGame)return;
        // let e = event.getLocation();
        // console.log('e:', e);
        if (this.node.parent.getComponent(cc.Layout)) {
            this.node.parent.getComponent(cc.Layout).enabled = false;

        }
        if (this.node.parent.getComponent('BoxState')) {
            this.node.parent.getComponent('BoxState')._isHave = false;

        }


    }

    start() {
        this.parentNode = PuzzleData.gameParent;
    }
    _onTouchMove(event) {
        if(PuzzleData.finishGame)return;

        // console.log(this._canMove,this._isCorrect,this._startMove,'}}}}')
        // if (!this._canMove ){//&& this._isCorrect) {
        // return;
        // }
        if (!this._startMove) {
            if (PuzzleData.startParent.getComponent(cc.Layout)) {
                PuzzleData.startParent.getComponent(cc.Layout).enabled = true;
            }
            this.node.parent = PuzzleData.moveParent;
        }
        this._startMove = true;
        let localPos = event.getLocation();
        let pos = this.node.parent.convertToNodeSpaceAR(localPos);
        // console.log(pos.x, pos.y, 'e:', localPos.x, localPos.y);
        this.node.setPosition(pos.x, pos.y);
        let gameCom = this.parentNode.getComponent('PuzzleGame');
        if (gameCom) {
            this.parentNode.getComponent('PuzzleGame').checkPos(this.node, localPos);

        }
    }
    _onTouchCancel(event) {

    }

    _onTouchEnd(event) {
        if(PuzzleData.finishGame)return;
        if (this.node.parent.getComponent(cc.Layout)) {
            this.node.parent.getComponent(cc.Layout).enabled = true;

        }
        let localPos = event.getLocation();

        let gameCom = this.parentNode.getComponent('PuzzleGame');
        if (gameCom) {
            this.parentNode.getComponent('PuzzleGame').confirmPos(this.node, localPos);

        }
    }

}
