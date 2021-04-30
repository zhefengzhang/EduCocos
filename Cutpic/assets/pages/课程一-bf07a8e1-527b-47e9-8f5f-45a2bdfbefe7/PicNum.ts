// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    num = 0;
    _canMove = true;
    _layoutIndex = 0;
    onEnable() {
        this.regisTouchEvent();

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
        let e = event.getLocation();
        console.log('e:', e);
        if(this.node.parent.getComponent(cc.Layout)){
            this.node.parent.getComponent(cc.Layout).enabled = false;

        }

    }

    _onTouchMove(event) {
        if (!this._canMove) {
            return;
        }
        let localPos = event.getLocation();
        let pos = this.node.parent.convertToNodeSpaceAR(localPos);
        console.log(pos.x, pos.y, 'e:', localPos.x, localPos.y);
        this.node.setPosition(pos.x, pos.y);
        let gameCom = this.node.parent.parent.getComponent('Game');
        if (gameCom) {
            this.node.parent.parent.getComponent('Game').checkPos(this.node, localPos);

        }
    }
    _onTouchCancel(event) {

    }

    _onTouchEnd(event) {
        
        if (this.node.parent.getComponent(cc.Layout)) {
            this.node.parent.getComponent(cc.Layout).enabled = true;
            
        }
        let localPos = event.getLocation();
        let gameCom = this.node.parent.parent.getComponent('Game');
        if (gameCom) {
            this.node.parent.parent.getComponent('Game').confirmPos(this.node, localPos);

        }
    }

}
