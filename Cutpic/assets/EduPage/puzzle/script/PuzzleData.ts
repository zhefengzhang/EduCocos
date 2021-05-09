const { ccclass, property } = cc._decorator;

@ccclass
export default class PuzzleData {
    /**
     * @zh 初次父节点
     */
    public static startParent = null;

    /**
     * @zh 移动父节点
     */
    public static moveParent = null;

    /**
    * @zh 游戏父节点
    */
    public static gameParent = null;
    /**
    * @zh 是否移动完毕
    */
    public static layoutNull = false;

    /**
    * @zh 是否移动完毕
    */
     public static finishGame = false;
}