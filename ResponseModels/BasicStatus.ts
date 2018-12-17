import { IBasicStatus } from "./IBasicStatus";
import { IPowerControl } from "./IPowerControl";
import { IValue } from "./IValue";
import { IVolume } from "./IVolume";
import { IInput } from "./IInput";

export class BasicStatus implements IBasicStatus {
    Power_Control: PowerControl;
    Volume: Volume;
    Input: Input;

    constructor(){
        this.Power_Control = new PowerControl();
        this.Volume = new Volume();
        this.Input = new Input();
    }
}

export class PowerControl implements IPowerControl {
    Power: Value;
    Sleep: Value;

    constructor(){
        this.Power = new Value();
        this.Sleep = new Value();
    }
}

export class Value implements IValue {
    value: string | number | boolean;

    constructor(){
        this.value = "";
    }
}

export class Volume implements IVolume {
    Mute: Value;
    Lvl: Value;

    constructor(){
        this.Mute = new Value();
        this.Lvl = new Value();
    }
}

export class Input implements IInput {
    Input_Sel: Value;

    constructor(){
        this.Input_Sel = new Value();
    }
}