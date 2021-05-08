declare var cc: any;
//@ts-ignore
import { eduProperty } from "education";
//@ts-ignore
import EduElementAbstract from "EduElementAbstract";

//@ts-ignore
const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu("教育课件多媒体组件/Audio")
export default class Audio extends EduElementAbstract {
    
    public static audioMgr: Audio = null;

    //#region 音乐
    @property
    _bgAudio: cc.AudioClip = null;

    @property(cc.AudioClip)
    @eduProperty({ displayName: "背景音乐"})
    get bgAudio() {
        return this._bgAudio;
    }

    set bgAudio(value) {
        this._bgAudio = value;
    }
    //#endregion

    onLoad () {
        Audio.audioMgr = this;
    }

    playBackgroundMusic () {
        if (this._bgAudio) cc.audioEngine.playMusic(this._bgAudio, true);
    }
}
