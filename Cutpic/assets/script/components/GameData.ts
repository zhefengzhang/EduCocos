const {ccclass, property} = cc._decorator;

@ccclass
export default class GameData{
    /**
     * @zh 倒计时秒数
     */
    public static countDownTime: number = null;

    /**
     * @zh 游戏总局数
     */
    public static gRoundCount: number = 0;

    /**
     * @zh 当前关卡
     */
    public static roundNow: number = 0;
}