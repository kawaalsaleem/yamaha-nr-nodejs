import { Value } from "./Value";
import { IAlbumArt } from "../Interfaces/IAlbumArt";
export class AlbumArt implements IAlbumArt {
    URL: Value;
    ID: Value;
    Format: Value;
    constructor() {
        this.URL = new Value();
        this.ID = new Value();
        this.Format = new Value();
    }
}
