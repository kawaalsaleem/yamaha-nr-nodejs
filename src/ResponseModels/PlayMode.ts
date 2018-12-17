import { Value } from "./Value";
import { IPlayMode } from "./Interfaces/IPlayMode";
export class PlayMode implements IPlayMode {
    Repeat: Value;
    Shuffle: Value;
    constructor() {
        this.Repeat = new Value();
        this.Shuffle = new Value();
    }
}
