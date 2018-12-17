import { IVolume } from "./Interfaces/IVolume";
import { Value } from "./Value";
export class Volume implements IVolume {
    Mute: Value;
    Lvl: Value;
    constructor() {
        this.Mute = new Value();
        this.Lvl = new Value();
    }
}
