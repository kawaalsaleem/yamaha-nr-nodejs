import { IInput } from "../Interfaces/IInput";
import { Value } from "./Value";
export class Input implements IInput {
    Input_Sel: Value;
    constructor() {
        this.Input_Sel = new Value();
    }
}
