// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    item1: cc.Node = null;

    @property(cc.Node)
    item2: cc.Node = null;

    @property(cc.Node)
    Quesitem: cc.Node = null;

    @property(cc.Node)
    Answeritem: cc.Node = null;

    @property(cc.Node)
    QuesContent: cc.Node = null;

    @property(cc.Node)
    AnswerContent: cc.Node = null;
    @property(cc.Integer)
    queNum = 0;
    @property(cc.Integer)
    answerNum = 0;
    @property(cc.Node)
    lineNode: cc.Node = null;

    _startPos = null;
    _endPos = null;
    
    start() {
        
        this.creatQuestion();
        this.creatAnswer();
    }

    creatQuestion() {
        for (let index = 0; index < this.queNum; index++) {
            let node = cc.instantiate(this.Quesitem);
            this.QuesContent.addChild(node);
            node.active = true;
        }
        this.scheduleOnce(()=>{
            this.QuesContent.getComponent(cc.Layout).enabled = false;
        })
    }

    creatAnswer() {
        for (let index = 0; index < this.queNum; index++) {
            let node = cc.instantiate(this.Answeritem);
            this.AnswerContent.addChild(node);
            node.active = true;

        }
        this.scheduleOnce(()=>{
            this.AnswerContent.getComponent(cc.Layout).enabled = false;
        })
    }

    clickStart(event){
        console.log(event,'>>>');
        this._startPos = event.target.convertToWorldSpaceAR(cc.v2(0, 0));
    }

    clickEnd(event){
        this._endPos = event.target.convertToWorldSpaceAR(cc.v2(0, 0));
        if(this._startPos!=null){
            this.drawLine(this._startPos,this._endPos);

        }
    }

    drawLine(startPos,endPos){
        // let startPos = this.item1.convertToWorldSpaceAR(cc.v2(0, 0));
        // let endPos = this.item2.convertToWorldSpaceAR(cc.v2(0, 0));
        let dtX = endPos.x - startPos.x;
        let dtY = endPos.y - startPos.y;
        let radian = Math.atan2(dtX, dtY);
        let rotation = (180 * radian / Math.PI + 90) % 360;
        let lineNode = cc.instantiate(this.lineNode);
        this.node.addChild(lineNode);
        this.lineNode.angle = -rotation;
        this.lineNode.width = Math.sqrt(dtX * dtX + dtY * dtY);
        let linePos = this.lineNode.convertToWorldSpaceAR(cc.v2(0, 0));
        this.lineNode.position = cc.v3(linePos.x - startPos.x, linePos.y - startPos.y, 0);
    }
    onEnable() {
        // this.regisTouchEvent();
    }

    onDisable() {
        // this.removeTouchEvent();
    }



    // update (dt) {}
}
