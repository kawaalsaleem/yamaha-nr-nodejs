import { IVolume } from "./IVolume";
import { IPowerControl } from "./IPowerControl";
import { IInput } from "./IInput";
export interface IBasicStatus {
    Power_Control: IPowerControl;
    Volume: IVolume;
    Input: IInput;
}
