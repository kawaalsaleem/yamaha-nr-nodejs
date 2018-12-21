import { IBasicStatus } from "./Interfaces/IBasicStatus";
import { PowerControl } from "./PowerControl";
import { Volume } from "./Volume";
import { Input } from "./Input";
export declare class BasicStatus implements IBasicStatus {
    Power_Control: PowerControl;
    Volume: Volume;
    Input: Input;
    constructor();
}
