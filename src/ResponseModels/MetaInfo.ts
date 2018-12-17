import { Value } from "./Value";
import { IMetaInfo } from "./Interfaces/IMetaInfo";
export class MetaInfo implements IMetaInfo {
    Album: Value;
    Artist: Value;
    Song: Value;
    constructor() {
        this.Album = new Value();
        this.Artist = new Value();
        this.Song = new Value();
    }
}
