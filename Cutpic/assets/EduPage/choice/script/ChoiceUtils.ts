const {ccclass, property} = cc._decorator;

@ccclass
export default class Utils{
    /**
     * @zh 日志输出工具
     * @param data 日志字符串
     * @param needTime 是否需要打印时间
     */
    public static printLog (data: any, needTime?: boolean) {
        if (CC_DEBUG && CC_PREVIEW) {
            var time = "";
            if (needTime) {
                const date = new Date();
                const hour = date.getHours();
                const minute = date.getMinutes();
                const second = date.getSeconds();
                time = `${hour}:${minute}:${second} `;
            }
            if (CC_EDITOR) {
                cc.log(time + data);
            } else {
                console.log(time + data);
            }
        }
    }

    /**
     * @zh 加载指定数量的预制体
     * @param value 生成数量
     * @param parentNode 指定父节点
     * @param prefab 指定预制体
     * @param callback 加载结束后的回调
     */

    public static loadAnyNumPrefab(value: number, parentNode: cc.Node, prefab: cc.Prefab | cc.Node, callback?: Function) {
        if (parentNode) {
            if (parentNode.childrenCount > value) {
                for (let i = value; i < parentNode.childrenCount; i++) {
                    parentNode.children[i].destroy();
                    if (callback) callback();
                }
            } else if (parentNode.childrenCount < value) {
                if (prefab) {
                    for (let i = parentNode.childrenCount; i < value; i++) {
                        let node = cc.instantiate(prefab);
                        //@ts-ignore
                        parentNode.addChild(node);
                        if (callback) callback(node, i);
                    }
                }
            }
        }
    }

    /**
     * @zh 计算倒计时还有几分钟
     * @param date 
     * @returns 
     */
    public static CountDownFewMinutes(totalSecond) {
        if (totalSecond < 0) return 0;
        return Math.floor((totalSecond % 3600) / 60);
    }
    
    /**
     * @zh 计算倒计时还有几秒
     * @param date 
     * @returns 
     */
    public static CountDownFewSeconds(totalSecond) {
        if (totalSecond < 0) return 0;
        return ((totalSecond % 3600) % 60);
    }


    public static randomFunc(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
 
     }
}