declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

import Utils from "../Utils";

//@ts-ignore
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("教育课件题型组件/连线")
export default class ConnectGame extends EduElementAbstract {
    public static ConnectGameMgr: ConnectGame = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Prefab)
    Quesitem: cc.Prefab = null;

    @property(cc.Prefab)
    Answeritem: cc.Prefab = null;

    @property(cc.Node)
    QuesContent: cc.Node = null;

    @property(cc.Node)
    AnswerContent: cc.Node = null;

    @property(cc.Node)
    LineContent: cc.Node = null;
    //#region 问题数量
    @property
    _queNum: number = 0;
    @property({ type: cc.Integer, displayName: '问题数量', min: 0, step: 1 })
    @eduProperty({ displayName: '问题数量' })
    get eduQuesCount() {
        return this._queNum;
    }
    set eduQuesCount(v) {
        this._queNum = v;
        if (this.QuesContent) {
            this.creatQuestion();
        }
    }
    //#endregion
    //#region 数据编辑
    @property//(cc.string)
    _leftData = '';
    @eduProperty({ displayName: '问题数据' })
    get eduLeftData() {
        return this._leftData;
    }
    set eduLeftData(v) {
        this._leftData = v;

    }
    //#endregion
    //#region 数据编辑
    @property//(cc.string)
    _rightData = '';
    @eduProperty({ displayName: '答案数据' })
    get eduRightData() {
        return this._rightData;
    }
    set eduRightData(v) {
        this._rightData = v;
    }
    //#region 答案数量
    @property
    _answerNum = 0;
    @property({ type: cc.Integer, displayName: '答案数量', min: 0, step: 1 })
    @eduProperty({ displayName: '答案数量' })
    get eduAnswerCount() {
        return this._answerNum;
    }
    set eduAnswerCount(v) {
        this._answerNum = v;
        if (this.QuesContent) {
            this.creatAnswer();
        }
    }
    //#endregion

    //#region 方块间隔
    @property
    _spaceY = 0;
    @property({ type: cc.Integer, displayName: '间隔', min: 0, step: 1 })
    @eduProperty({ displayName: '间隔' })
    get eduSpace() {
        return this._spaceY;
    }
    set eduSpace(v) {
        this._spaceY = v;
        this.setLayoutSpace();
    }
    //#endregion

    //#region 正确颜色
    @property
    _rightLineColor = null;
    @property({ type: cc.Color, tooltips: '正确连线颜色' })
    @eduProperty({
        displayName: '正确连线颜色',
        displayOrder: 4,
    })
    get rightColor(): cc.Color {
        //@ts-ignore
        return this._rightLineColor;
    }
    set rightColor(value) {
        //@ts-ignore
        this._rightLineColor = value;
    }
    //#endregion

    @property
    _wrongLineColor = null;
    @property({ type: cc.Color, tooltips: '正确连线颜色' })
    @eduProperty({
        displayName: '正确连线颜色',
        displayOrder: 4,
    })
    get wrongColor(): cc.Color {
        //@ts-ignore
        return this._wrongLineColor;
    }
    set wrongColor(value) {
        //@ts-ignore
        this._wrongLineColor = value;
    }
    @property(cc.Prefab)
    lineNode: cc.Prefab = null;


    //#endregion
    //#region 能否拖动
    //  @property
    //  _canMove = false;
    //  @property({ type: cc.Boolean, tooltips: '拖动开关' })
    //  @eduProperty({ displayName: '拖动开关' })
    //  get eduMove() {
    //      return this._canMove;
    //  }
    //  set eduMove(v) {
    //      this._canMove = v;
    //      this._changeLayout(this._canMove);
    //  }
    //#endregion
    _startPos = null;
    _endPos = null;
    _startNum = null;
    _endNum = null;
    _questionPos = [];
    _answerPos = [];

    _answerClick = false;
    _queserClick = false;
    _rightNode = null;
    _leftNode = null;
    _formLeftData = null;
    _formRightData = null;
    onLoad() {
        ConnectGame.ConnectGameMgr = this;
    }
    start() {
        this.AnswerContent.getComponent(cc.Layout).enabled = true;
        this.QuesContent.getComponent(cc.Layout).enabled = true;
        this.setLayoutSpace();
        this.creatQuestion();
        this.creatAnswer();
    }

    getLeftData(){
        this._formLeftData = this._leftData.split(",");
        if (this._formLeftData.length != this._queNum) {
            this._formLeftData = this._leftData.split("，");
        }
    }

    getRightData(){
        this._formRightData = this._rightData.split(",");
        if (this._formRightData.length != this._answerNum) {
            this._formRightData = this._rightData.split("，");
        }
    }
    _changeLayout(flag) {
        this.AnswerContent.getComponent(cc.Layout).enabled = !flag;
        this.QuesContent.getComponent(cc.Layout).enabled = !flag;

    }
    //设置间隔大小
    setLayoutSpace() {
        if (this.QuesContent) {
            //@ts-ignore
            this.QuesContent.getComponent(cc.Layout).spacingY = this._spaceY;
        }
        if (this.AnswerContent) {
            //@ts-ignore
            this.AnswerContent.getComponent(cc.Layout).spacingY = this._spaceY;
        }
    }
    creatQuestion() {
        this.QuesContent.getComponent(cc.Layout).enabled = true;
        this.QuesContent.destroyAllChildren();
        this.getLeftData();
        for (let index = 0; index < this._queNum; index++) {
            let node = cc.instantiate(this.Quesitem);
            this.QuesContent.addChild(node);
            let com = node.getComponent('QuestionItem');
            if (!com) {
                com = node.addComponent('QuestionItem');
            }
            com._num = index;
            com._answerNum = this._formLeftData[index];
            node.on('click', (event) => {
                console.log(node.getComponent('QuestionItem')._num, '>>>QuestionItem.num', index)

                this.clickStart(event.node, index);
            })
        }
        //@ts-ignore
        this.scheduleOnce(() => {
            this.QuesContent.getComponent(cc.Layout).enabled = false;
            this.saveQuesData();
        })
    }

    //暂时没使用到
    saveQuesData() {
        let leng = this.QuesContent.children.length;
        let par = this.QuesContent.children;
        this._questionPos = [];
        for (let index = 0; index < leng; index++) {
            const element = par[index].position;
            this._questionPos.push(element);
        }
        // console.log(this._questionPos,'>>>>1')
    }

    creatAnswer() {
        this.getRightData();
        this.AnswerContent.getComponent(cc.Layout).enabled = true;
        this.AnswerContent.destroyAllChildren();
        for (let index = 0; index < this._answerNum; index++) {
            let node = cc.instantiate(this.Answeritem);
            this.AnswerContent.addChild(node);
            let com = node.getComponent('AnswerItem');
            if (!com) {
                com = node.addComponent('AnswerItem');
            }
            com._num = index;
            com._answerNum = this._formRightData[index];
            node.getChildByName('Label').getComponent(cc.Label).string = this._formRightData[index];
            node.on('click', (event) => {
                this.clickEnd(event.node, index);
            })
        }
        //@ts-ignore
        this.scheduleOnce(() => {
            this.AnswerContent.getComponent(cc.Layout).enabled = false;
            this.saveAnswerData();

        })
    }

    //暂时没使用到
    saveAnswerData() {
        this._answerPos = [];
        let leng = this.AnswerContent.children.length;
        let par = this.AnswerContent.children;
        for (let index = 0; index < leng; index++) {
            const element = par[index].position;
            this._answerPos.push(element);
        }
        // console.log(this._answerPos,'>>>>2')

    }

    clickStart(node, index) {

        let com = node.getComponent('QuestionItem');
        if (com._status) {
            return;
        }
        let pos = node.convertToWorldSpaceAR(cc.v2());
        this._startNum = index;
        let nodePos = this.LineContent.convertToNodeSpaceAR(pos);
        this._startPos = cc.v2(nodePos.x + (node.width / 2) - 5, nodePos.y);
        this._leftNode = node;
        this._queserClick = true;

        if (this._answerClick) {
            this.drawLine(this._startPos, this._endPos);

        }

    }

    clickEnd(node, index) {
        let com = node.getComponent('AnswerItem');
        if (com._status) {
            return;
        }
        let pos = node.convertToWorldSpaceAR(cc.v2());
        this._endNum = index;
        let nodePos = this.LineContent.convertToNodeSpaceAR(pos);
        this._rightNode = node;
        this._endPos = cc.v2(nodePos.x - (node.width / 2) + 5, nodePos.y);
        this._answerClick = true;
        if (this._startPos) {
            this.drawLine(this._startPos, this._endPos);
        }

    }

    drawLine(startPos, endPos) {
        console.log(startPos.x, ">>>>", startPos.y);
        console.log(endPos.x, ">>>>", endPos.y)
        let flag = this.getAnswerStatu();
        //计算问题和答案的角度
        let dtX = endPos.x - startPos.x;
        let dtY = endPos.y - startPos.y;
        let radian = Math.atan2(dtX, dtY);
        let rotation = (180 * radian / Math.PI + 90) % 360;
        let lineNode = cc.instantiate(this.lineNode);
        lineNode.color = flag ? this._rightLineColor : this._wrongLineColor;
        this.LineContent.addChild(lineNode);
        lineNode.angle = -rotation;
        lineNode.width = Math.sqrt(dtX * dtX + dtY * dtY);
        lineNode.position = cc.v3(endPos.x, endPos.y, 0);

        this.changeStatus();
    }
    getAnswerStatu() {
        let rightCom = this._rightNode.getComponent('AnswerItem');
        let leftCom = this._leftNode.getComponent('QuestionItem');

        let rightNum = rightCom._num;
        let leftNum = leftCom._num;
        if (this._formLeftData[leftNum] === this._formRightData[rightNum]) {
            return true;
        } else {
            return false;
        }
    }
    resetData() {
        this._startPos = null;
        this._endPos = null;
        this._startNum = null;
        this._endNum = null;
        this._queserClick = false;
        this._answerClick = false;
        this._rightNode = null;
        this._leftNode = null;
    }

    changeStatus() {
        let quepar = this.QuesContent.children;
        let anspar = this.AnswerContent.children;
        for (let index = 0; index < this._queNum; index++) {
            let element = quepar[index];
            let com = element.getComponent('QuestionItem');
            if (index === this._startNum) {
                com._status = true;
                break;
            }

        }
        for (let index = 0; index < this._answerNum; index++) {
            const element = anspar[index];
            let com = element.getComponent('AnswerItem')
            if (index === this._endNum) {
                com._status = true;
                break;
            }
        }
        this.resetData();

    }

    onEnable() {
        // this.regisTouchEvent();
    }

    onDisable() {
        // this.removeTouchEvent();
    }



    // update (dt) {}
}
