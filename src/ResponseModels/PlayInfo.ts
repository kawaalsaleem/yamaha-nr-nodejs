import { IPlayInfo } from "./Interfaces/IPlayInfo";
import { Value } from "./Value";
import { AlbumArt } from "./AlbumArt";
import { PlayMode } from "./PlayMode";
import { MetaInfo } from "./MetaInfo";

export class PlayInfo implements IPlayInfo {
    Playback_Info: Value;
    Album_ART: AlbumArt;
    Device_Type: Value;
    Play_Mode: PlayMode;
    Play_Time: Value;
    Total_Tracks: Value;
    Track_Number: Value;
    iPod_Mode: Value;
    Meta_Info: MetaInfo

    constructor() {
        this.Play_Mode = new PlayMode();
        this.Album_ART = new AlbumArt();
        this.Playback_Info = new Value();
        this.Device_Type = new Value();
        this.Play_Time = new Value();
        this.Total_Tracks = new Value();
        this.Track_Number = new Value();
        this.iPod_Mode = new Value();
        this.Meta_Info = new MetaInfo();
    }
}