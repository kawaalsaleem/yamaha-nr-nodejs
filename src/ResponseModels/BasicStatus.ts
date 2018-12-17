import { IBasicStatus } from "./Interfaces/IBasicStatus";
import { PowerControl } from "./PowerControl";
import { Volume } from "./Volume";
import { Input } from "./Input";

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