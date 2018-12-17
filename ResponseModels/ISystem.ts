import { IVolume } from "./IVolume";
import { IPowerControl } from "./IPowerControl";
import { IInput } from "./IInput";
import { IBasicStatus } from "./IBasicStatus";
import { IConfig } from "./IConfig";

export interface ISystem {
    Volume: IVolume;
    Power_Control: IPowerControl;
    Input: IInput;
    Basic_Status: IBasicStatus;
    Config: IConfig;
}


