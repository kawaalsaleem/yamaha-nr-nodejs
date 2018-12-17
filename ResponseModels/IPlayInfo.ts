import { IAlbumArt } from './IAlbumArt';
import { IMetaInfo } from './IMetaInfo';
import { IPlayMode } from './IPlayMode';
import { IValue } from './IValue';
export interface IPlayInfo {
    Playback_Info: IValue;
    Device_Type: IValue;
    iPod_Mode: IValue;
    Play_Mode: IPlayMode;
    Play_Time: IValue;
    Track_Number: IValue;
    Total_Tracks: IValue;
    Meta_Info: IMetaInfo;
    Album_ART: IAlbumArt;
}
