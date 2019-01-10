import { IPlayInfo } from "../Interfaces/IPlayInfo";
import { Value } from "./Value";
import { AlbumArt } from "./AlbumArt";
import { PlayMode } from "./PlayMode";
import { MetaInfo } from "./MetaInfo";
export declare class PlayInfo implements IPlayInfo {
    Playback_Info: Value;
    Album_ART: AlbumArt;
    Device_Type: Value;
    Play_Mode: PlayMode;
    Play_Time: Value;
    Total_Tracks: Value;
    Track_Number: Value;
    iPod_Mode: Value;
    Meta_Info: MetaInfo;
    constructor();
}
