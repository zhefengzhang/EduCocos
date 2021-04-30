// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    imageNode: cc.Node = null;
    @property(cc.Node)
    boxItem: cc.Node = null;
    @property(cc.Node)
    layoutNode: cc.Node = null;
    @property(cc.Texture2D)
    testT2: cc.Texture2D = null;

    @property(cc.Node)
    container: cc.Node = null;
    @property(cc.Integer)
    horNum = 0;
    @property(cc.Integer)
    verNum = 0;
    @property(cc.Float)
    picSpaceX = 0;
    @property(cc.Float)
    picSpaceY = 0;
    _cutState = false;
    _picNum = 0;
    _posData = [];
    _totalWidth = 0;
    _totalHeight = 0;
    cellWidth = 0;
    cellHeight = 0;
    start() {
    }

    //将图片分割，切图，初始化数据
    cutPic() {
        if (this._cutState) {
            return
        }
        this._cutState = true;
        let com = this.imageNode.getComponent(cc.Sprite);
        let sp = com.spriteFrame;
        let rect = sp.getRect();
        let x = rect.x;
        let y = rect.y;
        let width = rect.width;
        let height = rect.height;
        console.log(sp.getRect(), ">>>");
        let totalWidth = width;
        let totalHeight = height;
        let childWidth = totalWidth / this.horNum;
        let childHeight = totalHeight / this.verNum;
        this._totalWidth = this.imageNode.width;
        this._totalHeight = this.imageNode.height;
        this.cellWidth = this._totalWidth / this.horNum;
        this.cellHeight = this._totalHeight / this.verNum;
        this.layoutNode.width = this.horNum * this.cellWidth;
        // this.layoutNode.height = this.imageNode.height;
        let self = this;
        for (let i = 0; i < this.verNum; i++) {
            for (let k = 0; k < this.horNum; k++) {
                const item = new cc.Node();
                self.layoutNode.addChild(item);
                self._picNum += 1;
                let itemCom = item.addComponent(cc.Sprite);
                itemCom.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                // item.width = self.cellWidth;
                // item.height = self.cellHeight;
                item.addComponent('PicNum').num = self._picNum;
                let newsp = new cc.SpriteFrame();
                newsp.setTexture(this.testT2);
                console.log(newsp, '>>>newsp')
                itemCom.spriteFrame = newsp;
                this.scheduleOnce(() => {
                    itemCom.spriteFrame = null;
                    newsp.setRect(new cc.Rect(x + k * childWidth, y + i * childHeight, childWidth, childHeight));
                    itemCom.spriteFrame = newsp;
                    item.width = self.cellWidth;
                    item.height = self.cellHeight;
                })
            }
        }
        // this.layoutNode.getComponent(cc.Sprite).spriteFrame = null;

        // this.layoutNode.getComponent(cc.Layout).enabled = false;
        this._savePicData();
    }

    //设置图片框间隔-横向
    modifySpcaceX() {
        let com = this.layoutNode.getComponent(cc.Layout);
        com.spacingX = this.picSpaceX;
    }

    //设置图片框间隔-竖向
    modifySpcaceY() {
        let com = this.layoutNode.getComponent(cc.Layout);
        com.spacingY = this.picSpaceY;
    }

    //可以开始移动图片了
    play() {
        this.layoutNode.getComponent(cc.Layout).enabled = false;

    }

    //保存图片位置信息
    _savePicData() {
        let allNode = this.container.children;
        // let item = cc.instantiate(this.boxItem);
        this.container.width = this.horNum * this.cellWidth;
        this._posData = [];
        let leng = this.horNum * this.verNum;
        let num = 0;
        let self = this;
        for (let index = 0; index < leng; index++) {
            let childNode = cc.instantiate(this.boxItem);
            this.container.addChild(childNode);
            childNode.active = true;
            childNode.width = this.cellWidth;
            childNode.height = this.cellHeight;
            num += 1;
            childNode.getComponent('BoxState')._boxNum = num;

        }
        this.scheduleOnce(() => {
            this.container.getComponent(cc.Layout).enabled = false;

        })
        this.scheduleOnce(() => {

            for (let index = 0; index < allNode.length; index++) {
                const element = allNode[index];
                let elePos = element.position;
                let nodepos = element.convertToWorldSpaceAR(cc.v2(0, 0));
                console.log(nodepos, '>>>>>????')
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
        console.log(pos.x, pos.y, ">>>>check", this._posData)
        for (let index = 0; index < self.container.children.length; index++) {
            const element = self.container.children[index];
            element.color = new cc.Color(255, 255, 255, 255);
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
                self.container.children[index].color = cc.Color.RED;


                break;
            }
        }
    }

    //确定位置不移动，设置图片位置
    confirmPos(node, pos) {
        let self = this;
        for (let index = 0; index < this._posData.length; index++) {
            const element = this._posData[index];
            let boxCom = self.container.children[index].getComponent('BoxState');
            // let boxNum = boxCom._boxNum;
            let nodeCom = node.getComponent('PicNum');
            // let picNum = nodeCom.num;
            if ((pos.x > element.minX && pos.x < element.maxX)
                && (pos.y > element.minY && pos.y < element.maxY)
                && boxCom._isHave == false) {
                self.container.children[index].color = new cc.Color(255, 255, 255, 255);
                node.getComponent('PicNum')._canMove = false;
                node.parent = self.container.children[index];
                node.setPosition(cc.v2(0, 0));
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
