const {ccclass, property} = cc._decorator;

@ccclass
export default class GameData{
    /**
     * @zh 倒计时
     */
    public static countDownTime: number = null;

    /**
     * @zh 游戏总关卡数
     */
    public static gRoundCount: number = 0;

    /**
     * @zh 当前关卡数
     */
    public static roundNow: number = 0;
}