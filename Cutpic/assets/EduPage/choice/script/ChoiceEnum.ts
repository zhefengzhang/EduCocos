var GameEnum = {
    /**
     * @zh 回答正确的弹窗文字
     */
     correctAnswerTipsType: cc.Enum({
        答对了: 0,
        你真棒: 1
    }),

    /**
     * @zh 回答错误的弹窗文字
     */
     wrongAnswerTipsType: cc.Enum({
        答错了: 0,
        再接再厉: 1
    })
}
export default GameEnum;