declare var cc: any;
//@ts-ignore
import { eduProperty, syncNum, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

import Utils from "../Utils";
//@ts-ignore
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("教育课件题型组件/拼图")
export default class PuzzleGame extends EduElementAbstract {

    @property({ type: cc.Node, displayName: '显示图片' })
    imageNode: cc.Node = null;
    @property({ type: cc.Prefab, displayName: '右边切图小方块' })
    boxItem: cc.Prefab = null;
    @property({ type: cc.Prefab, displayName: '左边切图小方块' })
    contentItem: cc.Prefab = null;
    @property({ type: cc.Node, displayName: '右边切图容器' })
    layoutNode: cc.Node = null;
    // @property({ type: cc.Texture2D, displayName: '切图模板' })
    // testT2: cc.Texture2D = null;
    @property({ type: cc.Node, displayName: '左边切图容器' })
    container: cc.Node = null;
    //#region 问题数量
    @property
    _horNum: number = 0;
    @property({ type: cc.Integer, displayName: '横向数量', min: 0, step: 1 })
    @eduProperty({ displayName: '横向数量' })
    get eduHorNum() {
        return this._horNum;
    }
    set eduHorNum(v) {
        this._horNum = v;
        if (this._horNum >= 0) {
            this._cutState = false;
            this.cutPic();
        }
    }
    //#endregion

    //#region 问题数量
    @property
    _verNum: number = 0;
    @property({ type: cc.Integer, displayName: '纵向数量', min: 0, step: 1 })
    @eduProperty({ displayName: '纵向数量' })
    get eduVerNum() {
        return this._verNum;
    }
    set eduVerNum(v) {
        this._verNum = v;
        if (this._verNum >= 0) {
            this._cutState = false;
            this.cutPic();
        }
    }
    //#endregion

    //#region 横向间隔
    @property
    _picSpaceX: number = 0;
    @property({ type: cc.Float, displayName: '横向间隔', min: 0, step: 1 })
    @eduProperty({ displayName: '横向间隔' })
    get eduPicSpaceX() {
        return this._picSpaceX;
    }
    set eduPicSpaceX(v) {
        this._picSpaceX = v;
        this.modifySpcaceX();

    }
    //#endregion

    //#region 纵向间隔
    @property
    _picSpaceY: number = 0;
    @property({ type: cc.Float, displayName: '纵向间隔', min: 0, step: 1 })
    @eduProperty({ displayName: '纵向间隔' })
    get eduPicSpaceY() {
        return this._picSpaceY;
    }
    set eduPicSpaceY(v) {
        this._picSpaceY = v;
        this.modifySpcaceY();
    }
    //#endregion
    // //#region 切图开关
    // @property
    // _beginCut = false;
    // @property({ type: cc.Boolean, tooltips: '拖动开关' })
    // @eduProperty({ displayName: '拖动开关' })
    // get eduBeginCut() {
    //     return this._beginCut;
    // }
    // set eduBeginCut(v) {
    //     this._beginCut = v;
    //     if (this._beginCut) {
    //         this._cutState = false;
    //         this.cutPic();
    //     }
    // }
    // //#endregion
    // @property(cc.SpriteFrame)
    // picArray: Array<cc.SpriteFrame> = [];
    _cutState = false;
    _picNum = 0;
    _posData = [];
    _totalWidth = 0;
    _totalHeight = 0;
    cellWidth = 0;
    cellHeight = 0;
    start() {
        if (!CC_EDITOR) { //运行时需要延迟一帧
            //@ts-ignore
            this.scheduleOnce(() => {

                this.cutPic();

            })

        }
    }

    //打乱排序
    randArr(arr) {
        for (var i = 0; i < arr.length; i++) {
            //@ts-ignore
            var iRand = parseInt(arr.length * Math.random());
            var temp = arr[i];
            arr[i] = arr[iRand];
            arr[iRand] = temp;
        }
        return arr;
    }

    //将图片分割，切图，初始化数据
    cutPic() {
        let self = this;
        self.layoutNode.destroyAllChildren();
        if (this._cutState) {
            return
        }
        this._cutState = true;
        //@ts-ignore
        let com = this.imageNode.getComponent(cc.Sprite);
        //@ts-ignore
        let sp = com.spriteFrame;
        let rect = sp.getRect();
        let x = rect.x;
        let y = rect.y;
        let width = rect.width;
        let height = rect.height;
        // console.log(sp.getRect(), ">>>");
        let totalWidth = width;
        let totalHeight = height;
        let childWidth = totalWidth / this._horNum;
        let childHeight = totalHeight / this._verNum;
        //@ts-ignore
        this._totalWidth = this.imageNode.width;
        //@ts-ignore
        this._totalHeight = this.imageNode.height;
        this.cellWidth = this._totalWidth / this._horNum;
        this.cellHeight = this._totalHeight / this._verNum;
        this.layoutNode.width = this._horNum * this.cellWidth;
        let layoutCom = this.layoutNode.getComponent(cc.Layout);
        // let totalWidth = this.imageNode.width;
        // let totalHeight = this.imageNode.height;

        // let cellWidth = totalWidth / this.horNum;
        // let cellHeight = totalHeight / this.verNum;
        //@ts-ignore
        layoutCom.cellSize.width = this.cellWidth - 30;
        //@ts-ignore
        layoutCom.cellSize.height = this.cellHeight - 30;
        for (let i = 0; i < this._verNum; i++) {
            for (let k = 0; k < this._horNum; k++) {
                const item = new cc.Node();
                self.layoutNode.addChild(item);
                self._picNum += 1;
                let itemCom = item.addComponent(cc.Sprite);
                itemCom.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                // item.width = self.cellWidth;
                // item.height = self.cellHeight;
                let com = item.addComponent('PicNum');
                com.num = self._picNum;
                com.data = { hor: k, ver: i };
                let newsp = new cc.SpriteFrame();
                // newsp.setTexture(this.testT2);
                newsp.setTexture(sp._texture);

                itemCom.spriteFrame = newsp;
                if (CC_EDITOR) {
                    itemCom.spriteFrame = null;
                    // Editor.log(x + k * childWidth, y + i * childHeight, childWidth, childHeight)
                    newsp.setRect(new cc.Rect(x + k * childWidth, y + i * childHeight, childWidth, childHeight));
                    itemCom.spriteFrame = newsp;
                    item.width = self.cellWidth;
                    item.height = self.cellHeight;

                } else {
                    //@ts-ignore 运行时需要延迟一帧
                    this.scheduleOnce(() => {
                        itemCom.spriteFrame = null;
                        newsp.setRect(new cc.Rect(x + k * childWidth, y + i * childHeight, childWidth, childHeight));
                        itemCom.spriteFrame = newsp;
                        item.width = self.cellWidth;
                        item.height = self.cellHeight;
                    })

                }
            }
        }
        // this._changePosData();
        let children = this.layoutNode.children;
        this.randArr(children);
        this._savePicData();
    }

    //打乱图片排序
    _changePosData() {
        let children = this.layoutNode.children;
        this.randArr(children);

    }

    //设置图片框间隔-横向
    modifySpcaceX() {
        let com = this.layoutNode.getComponent(cc.Layout);
        //@ts-ignore
        com.spacingX = this._picSpaceX;
    }

    //设置图片框间隔-竖向
    modifySpcaceY() {
        let com = this.layoutNode.getComponent(cc.Layout);
        //@ts-ignore
        com.spacingY = this._picSpaceY;
    }

    //可以开始移动图片了
    play() {
        this.layoutNode.getComponent(cc.Layout).enabled = false;

    }


    //保存图片位置信息--左边透明框
    _savePicData() {
        this.container.destroyAllChildren();
        let allNode = this.container.children;
        // let item = cc.instantiate(this.boxItem);
        this.container.width = this._horNum * this.cellWidth;
        this._posData = [];
        let leng = this._horNum * this._verNum;
        let num = 0;
        let self = this;
        let layoutCom = this.container.getComponent(cc.Layout);
        let cellWidth = this._totalWidth / this._horNum;
        let cellHeight = this._totalHeight / this._verNum;
        //@ts-ignore
        layoutCom.cellSize.width = cellWidth;
        //@ts-ignore
        layoutCom.cellSize.height = cellHeight;

        for (let index = 0; index < leng; index++) {
            let childNode = cc.instantiate(this.contentItem);
            this.container.addChild(childNode);
            childNode.active = true;
            childNode.width = cellWidth;
            childNode.height = cellHeight;
            num += 1;
            childNode.getComponent('BoxState')._boxNum = num;

        }
        //@ts-ignore
        this.scheduleOnce(() => {
            this.container.getComponent(cc.Layout).enabled = false;

        })
        //@ts-ignore
        this.scheduleOnce(() => {

            for (let index = 0; index < allNode.length; index++) {
                const element = allNode[index];
                let elePos = element.position;
                let nodepos = element.convertToWorldSpaceAR(cc.v2(0, 0));
                // console.log(nodepos, '>>>>>????')
                let pos = {
                    minX: nodepos.x - element.width / 2,
                    maxX: nodepos.x + element.width / 2,
                    minY: nodepos.y - element.height / 2,
                    maxY: nodepos.y + element.height / 2,
                    posX: elePos.x,
                    posY: elePos.y
                }
                self._posData.push(pos);
            }
        })
    }

    //检查是否移动到正确位置
    checkPos(node, pos) {
        // let pos = //this.container.convertToNodeSpaceAR(node.position);

        let self = this;
        // console.log(pos.x, pos.y, ">>>>check", this._posData)
        for (let index = 0; index < self.container.children.length; index++) {
            const element = self.container.children[index];
            element.getComponent('BoxState').changeSprite(false);
            // element.color = new cc.Color(255, 255, 255, 255);
        }
        for (let index = 0; index < this._posData.length; index++) {
            const element = this._posData[index];
            let boxCom = self.container.children[index].getComponent('BoxState');
            // let boxNum = boxCom._boxNum;
            // let nodeCom = node.getComponent('PicNum');
            if (pos.x > element.minX && pos.x < element.maxX
                && pos.y > element.minY && pos.y < element.maxY
                && boxCom._isHave == false) {

                // console.log(element, '>>', boxCom._isHave, index)
                // self.container.children[index].color = cc.Color.RED;
                self.container.children[index].getComponent('BoxState').changeSprite(true);


                break;
            }
        }
    }

    //确定位置不移动，设置图片位置
    confirmPos(node, pos) {
        let self = this;
        // console.log(pos.x, pos.y, ">>>>confirmPos", this._posData)
        let _isTrue = 1;
        for (let index = 0; index < this._posData.length; index++) {
            const element = this._posData[index];
            let boxCom = self.container.children[index].getComponent('BoxState');
            let boxNum = boxCom._boxNum;
            let nodeCom = node.getComponent('PicNum');
            let picNum = nodeCom.num;
            // console.log(boxNum, '>>boxNum>>', picNum)
            // self.container.children[index].color = new cc.Color(255, 255, 255, 255);
            self.container.children[index].getComponent('BoxState').changeSprite(false);

            if ((pos.x > element.minX && pos.x < element.maxX)
                && (pos.y > element.minY && pos.y < element.maxY)
                && boxCom._isHave == false && boxNum == picNum) {
                node.getComponent('PicNum')._canMove = false;
                node.parent = self.container.children[index];
                node.setPosition(cc.v2(0, 0));
                node.width = node.parent.width;
                node.height = node.parent.height;
                self.container.children[index].getComponent('BoxState')._isHave = true;
                // console.log(self.container.children[index], 'self.container.children[index]')
                self.checkFinish();
                break;
            }
        }

    }

    //检查任务完成度
    checkFinish() {
        let containChild = this.container.children;
        let finishNum = 0;
        for (let index = 0; index < containChild.length; index++) {
            const element = containChild[index];
            let boxCom = element.getComponent('BoxState');
            if (element.children[0]) {
                let nodeCom = element.children[0].getComponent('PicNum');
                let boxNum = boxCom._boxNum;
                let picNum = nodeCom.num;
                if (boxNum == picNum) {
                    finishNum += 1;
                }

            }
        }
        console.log(finishNum, '>>>>finishNum')
    }
}
