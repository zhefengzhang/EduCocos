declare var cc: any;
//@ts-ignore
import { eduProperty, i18n } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";
//@ts-ignore
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("教育课件UI组件/Transform")
export default class Transform extends EduElementAbstract {

    @property({type: cc.Vec3})
    @eduProperty({
        displayName: '位置',
        displayOrder: 1,
    })
    get position(): cc.Vec3 {
        //@ts-ignore
        let p: cc.Vec3 = this.node.getPosition();
        //@ts-ignore
        if (this.node.is3DNode) {
            return cc.v3(p.x, p.y, p.z);
        } else {
            return cc.v3(p.x, p.y, 0);
        }
    }

    set position(value) {
        //@ts-ignore
        if (this.node.is3DNode) {
            //@ts-ignore
            this.node.setPosition(value.x, value.y, value.z)
        } else {
            //@ts-ignore
            this.node.setPosition(value.x, value.y, 0);
        }
    }

    @property({type: cc.Vec3})
    @eduProperty({
        displayName: '缩放',
        displayOrder: 2,
    })
    get scale(): cc.Vec3 {
        //@ts-ignore
        let sx: number = this.node.scaleX;
        //@ts-ignore
        let sy: number = this.node.scaleY;
        //@ts-ignore
        let sz: number = this.node.scaleZ;
        return cc.v3(sx, sy, sz);
    }

    set scale(value) {
        //@ts-ignore
        this.node.scaleX = value.x;
        //@ts-ignore
        this.node.scaleY = value.y;
        //@ts-ignore
        this.node.scaleZ = value.z;
    }

    @property({type: cc.Size, tooltips: '尺寸'})
    @eduProperty({
        displayName: '尺寸',
        displayOrder: 3,
    })
    //@ts-ignore
    get size(): cc.Size {
        //@ts-ignore
        return this.node.getContentSize();
    }

    set size(value) {
        //@ts-ignore
        this.node.setContentSize(value.width, value.height);
    }

    @property({type: cc.Color, tooltips: '颜色'})
    @eduProperty({
        displayName: '颜色',
        displayOrder: 4,
    })
    get color(): cc.Color {
        //@ts-ignore
        return this.node.color;
    }
    set color(value) {
        //@ts-ignore
        this.node.color = value;
    }
}
