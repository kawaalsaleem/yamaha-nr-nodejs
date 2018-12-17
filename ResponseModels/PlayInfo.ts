import { IPlayInfo } from "./IPlayInfo";
import { Value } from "./BasicStatus";
import { IAlbumArt } from "./IAlbumArt";
import { IPlayMode } from "./IPlayMode";
import { IMetaInfo } from "./IMetaInfo";

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

export class AlbumArt implements IAlbumArt {
    URL: Value;
    ID: Value;
    Format: Value;
    
    constructor(){
        this.URL = new Value();
        this.ID = new Value();
        this.Format = new Value();
    }
}

export class PlayMode implements IPlayMode {
    Repeat: Value;
    Shuffle: Value;

    constructor(){
        this.Repeat = new Value();
        this.Shuffle = new Value();
    }
}

export class MetaInfo implements IMetaInfo {
    Album: Value;
    Artist: Value;
    Song: Value;

    constructor(){
        this.Album = new Value();
        this.Artist = new Value();
        this.Song = new Value();
    }
}