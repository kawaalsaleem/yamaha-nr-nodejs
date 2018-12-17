import { IPowerControl } from "./Interfaces/IPowerControl";
import { Value } from "./Value";
export class PowerControl implements IPowerControl {
    Power: Value;
    Sleep: Value;
    constructor() {
        this.Power = new Value();
        this.Sleep = new Value();
    }
}
