import { IPowerControl } from "./Interfaces/IPowerControl";
import { Value } from "./Value";
export declare class PowerControl implements IPowerControl {
    Power: Value;
    Sleep: Value;
    constructor();
}
