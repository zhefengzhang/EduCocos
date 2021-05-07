const {ccclass, property} = cc._decorator;

@ccclass
export default class GameData{
    /**
     * @zh ����ʱ����
     */
    public static countDownTime: number = null;

    /**
     * @zh ��Ϸ�ܾ���
     */
    public static gRoundCount: number = 0;

    /**
     * @zh 当前关卡数
     */
    public static roundNow: number = 0;
}