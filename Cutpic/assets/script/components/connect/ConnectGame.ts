declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

import GEnum from "../GameEnum";
import Utils from "../Utils";
import Round from "../Round";
import ConnectData from "./ConnectData";

//@ts-ignore
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("教育课件题型组件/连线")
export default class ConnectGame extends EduElementAbstract {
    public static ConnectGameMgr: ConnectGame = null;

    gameWin: boolean = false;
    
    @property(cc.Label)
    questionLab: cc.Label = null;

    @property({type:cc.String, displayName: '问题描述', multiline:true})
    @eduProperty({displayName: '问题描述'})
    get question() {
        //@ts-ignore
        if (!this.questionLab) {
            //@ts-ignore
            return "";
        }
        return this.questionLab.string;
    }

    set question(value) {
        if (this.questionLab) {
            this.questionLab.string = value;
        }
    }

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
    @property({ type: cc.string, displayName: '问题数据' })
    @eduProperty({ displayName: '问题数据' })
    get eduLeftData() {
        return this._leftData;
    }
    set eduLeftData(v) {
        this._leftData = v;
        this.creatQuestion();
    }
    //#endregion
    //#region 数据编辑
    @property//(cc.string)
    _rightData = '';
    @property({ type: cc.string, displayName: '答案数据' })
    @eduProperty({ displayName: '答案数据' })
    get eduRightData() {
        return this._rightData;
    }
    set eduRightData(v) {
        this._rightData = v;
        this.creatAnswer();

    }

    //#region 动画时间
    @property
    _aniTime = 0;
    @property({ type: cc.Float, displayName: '动画时间', min: 0 })
    @eduProperty({ displayName: '动画时间' })
    get eduAniTime() {
        return this._aniTime;
    }
    set eduAniTime(v) {
        this._aniTime = v;

    }
    //#endregion

    //#region 答案数量
    @property
    _answerNum = 1;
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

    // //#region 方块间隔
    @property
    _spaceY = 0;
    // @property({ type: cc.Integer, displayName: '间隔', min: 0, step: 1 })
    // @eduProperty({ displayName: '间隔' })
    // get eduSpace() {
    //     return this._spaceY;
    // }
    // set eduSpace(v) {
    //     this._spaceY = v;
    //     this.setLayoutSpace();
    // }
    // //#endregion

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

    @property(cc.SpriteFrame)
    picArray: Array<cc.SpriteFrame> = [];

    @property
    _finishNum = 0;
    @property({ type: cc.Integer, displayName: '正确数量', min: 0, step: 1 })
    @eduProperty({
        displayName: '正确数量',
    })
    get edufinishNum() {
        //@ts-ignore
        return this._finishNum;
    }
    set edufinishNum(value) {
        //@ts-ignore
        this._finishNum = value;
    }


    //#region 弹窗
    @property({ type: GEnum.correctAnswerTipsType })
    @eduProperty({ displayName: "回答正确的弹窗文字" })
    correctAnswerTipsType = GEnum.correctAnswerTipsType.答对了;

    @property(cc.SpriteFrame)
    correctAnswerTipsLabSpf1: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    correctAnswerTipsLabSpf2: cc.SpriteFrame = null;

    @property({ type: GEnum.wrongAnswerTipsType })
    @eduProperty({ displayName: "回答错误的弹窗文字" })
    wrongAnswerTipsType = GEnum.wrongAnswerTipsType.答错了;

    @property(cc.SpriteFrame)
    wrongAnswerTipsLabSpf1: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    wrongAnswerTipsLabSpf2: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame })
    @eduProperty({ displayName: "回答正确的弹窗图片" })
    correctionAnswerTipsSpf: cc.SpriteFrame = null;

    @property({ type: cc.SpriteFrame })
    @eduProperty({ displayName: "回答错误的弹窗图片" })
    wrongAnswerTipsSpf: cc.SpriteFrame = null;

    @property({ type: cc.Prefab })
    correctTipsPrfb: cc.Prefab = null;

    @property({ type: cc.Prefab })
    wrongTipsPrfb: cc.Prefab = null;

    correctTips: cc.Node = null;

    wrongTips: cc.Node = null;
    //#endregion

    //#region 背景图片
    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;

    @property({type: cc.SpriteFrame})
    @eduProperty({displayName: "设置背景图片"})
    get bg() {
        if (this.bgSprite && this.bgSprite.spriteFrame) {
            return this.bgSprite.spriteFrame;
        } else {
            return null;
        }
    }

    set bg(value) {
        if (this.bgSprite) {
            this.bgSprite.spriteFrame = value;
        }
    }
    //#endregion

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
    _nowFinish = 0;
    _startState = false;
    
    onLoad() {
        ConnectGame.ConnectGameMgr = this;
        //@ts-ignore
        ConnectData.gameParent = this.node;
    }
    start() {
        // this.AnswerContent.getComponent(cc.Layout).enabled = true;
        // this.QuesContent.getComponent(cc.Layout).enabled = true;
        // this.setLayoutSpace();
        // this.creatQuestion();
        // this.creatAnswer();
        this.getLeftData();
        this.getRightData();
    }

    getLeftData() {
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
            let picNum = this.randomFunc(0,2);
            node.getChildByName('Sprite').getComponent(cc.Sprite).spriteFrame = this.picArray[picNum];
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

    randomFunc(min,max){
       return Math.floor(Math.random()*(max-min+1)+min);

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
        this.changequeActive();
        let com = node.getComponent('QuestionItem');
        if (com._status) {
            return;
        }
        node.getChildByName('pic').active = true;
        let pos = node.convertToWorldSpaceAR(cc.v2());
        this._startNum = index;
        let nodePos = this.LineContent.convertToNodeSpaceAR(pos);
        this._startPos = cc.v2(nodePos.x + (node.width / 2) - 5, nodePos.y);
        this._leftNode = node;
        this._queserClick = true;

        if (this._answerClick) {
            this._startState = true;
            this.drawLine(this._startPos, this._endPos);

        }

    }

    clickEnd(node, index) {
        let com = node.getComponent('AnswerItem');
        if (com._status) {
            return;
        }
        this.changeAnsActive();
        node.getChildByName('pic').active = true;
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
    changequeActive() {
        let children = this.QuesContent.children;
        for (let index = 0; index < children.length; index++) {
            const element = children[index];
            element.getChildByName('pic').active = element.getComponent('QuestionItem')._status;

        }
    }
    changeAnsActive() {
        let children = this.AnswerContent.children;
        for (let index = 0; index < children.length; index++) {
            const element = children[index];
            element.getChildByName('pic').active = element.getComponent('AnswerItem')._status;

        }
    }

    drawLine(startPos, endPos) {
        console.log(startPos.x, ">>>>", startPos.y);
        console.log(endPos.x, ">>>>", endPos.y)
        let flag = this.getAnswerStatu();
        let self = this;
        if (!flag) {
            let tween = cc.tween()
                .repeat(5,
                    cc.tween().to(0.1, { angle: 5 }).to(0.1, { angle: -5 })
                )
                .set({ angle: 0 })
            tween.clone(this._rightNode).start()
            tween.clone(this._leftNode).start()
            this._rightNode.getChildByName('pic').active = false;
            this._leftNode.getChildByName('pic').active = false;
            Utils.printLog("回答错误", true);
            this.openTips(false);

            this.resetData();

            return;
        }
        //计算问题和答案的角度
        let dtX = endPos.x - startPos.x;
        let dtY = endPos.y - startPos.y;
        let radian = Math.atan2(dtX, dtY);
        let rotation = (180 * radian / Math.PI + 90) % 360;
        let lineNode = cc.instantiate(this.lineNode);
        if (flag) {
            Utils.printLog("回答正确", true);
            this.openTips(true);
            this.gameWin = true;
            Round.roundMgr.updateStarReward();
            this.checkFinish();
        }
        lineNode.color = this._rightLineColor; //flag ? this._rightLineColor : this._wrongLineColor;
        this.LineContent.addChild(lineNode);
        if (this._startState == false) {
            lineNode.angle = -rotation + 180;
            // lineNode.width = Math.sqrt(dtX * dtX + dtY * dtY);
            lineNode.position = cc.v3(startPos.x, startPos.y, 0);
        } else {
            lineNode.angle = -rotation;
            // lineNode.width = Math.sqrt(dtX * dtX + dtY * dtY);
            lineNode.position = cc.v3(endPos.x, endPos.y, 0);
        }
        // lineNode.angle = -rotation + 180;
        // lineNode.position = cc.v3(startPos.x, startPos.y, 0);
        let tagetWidth = Math.sqrt(dtX * dtX + dtY * dtY);
        cc.tween(lineNode)
            .by(self._aniTime, tagetWidth, {
                'onUpdate': (target, ratio) => {
                    target.width = tagetWidth * ratio;
                    console.log(ratio, '>>>ratio')
                }
            })
            .start();


        this.changeStatus();
    }

    getAnswerStatu() {
        let rightCom = this._rightNode.getComponent('AnswerItem');
        let leftCom = this._leftNode.getComponent('QuestionItem');

        let rightNum = rightCom.getNum();
        let leftNum = leftCom.getNum();
        // console.log(rightNum ,leftNum);
        // console.log(this._formRightData ,this._formLeftData,"####");
        
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
        this._startState == false;
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
    //检查任务完成度
    checkFinish() {
        let self = this;
        self._nowFinish += 1;
        if (self._nowFinish == self._finishNum) {
            console.log('完成连线');

        }
        console.log(self._finishNum, '>>>>finishNum')
    }
    onEnable() {
        // this.regisTouchEvent();
    }

    onDisable() {
        // this.removeTouchEvent();
    }

    /**
     * @zh 打开 tips 弹窗
     */
     openTips (result) {
        var fontSpf = null;
        var boxSpf = null;
        var tips = result ? this.correctTips : this.wrongTips;
        if (result) {
            //@ts-ignore
            fontSpf = this.correctAnswerTipsType === 0 ? this.correctAnswerTipsLabSpf1 : this.correctAnswerTipsLabSpf2;
            //@ts-ignore
            boxSpf = this.correctionAnswerTipsSpf;
        } else {
            //@ts-ignore
            fontSpf = this.wrongAnswerTipsType === 0 ? this.wrongAnswerTipsLabSpf1 : this.wrongAnswerTipsLabSpf2;
            //@ts-ignore
            boxSpf = this.wrongAnswerTipsSpf;
        }
        if (tips) {
            tips.active = true;
            tips.getComponent("Tips").updateView(fontSpf, boxSpf);
        } else {
            var tipsPrefab = result ? this.correctTipsPrfb : this.wrongTipsPrfb;
            //@ts-ignore
            Utils.loadAnyNumPrefab(this.node.childrenCount + 1, this.node, tipsPrefab, (tips: cc.Node, i: number)=>{
                if (result) {
                    this.correctTips = tips;
                } else {
                    this.wrongTips = tips;
                }
                tips.getComponent("Tips").updateView(fontSpf, boxSpf);
            })
        }
    }
}
