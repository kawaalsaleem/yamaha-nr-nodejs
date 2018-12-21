import { IValue } from "./Interfaces/IValue";
export class Value implements IValue {
    value: string | number | boolean;
    constructor() {
        this.value = false;
    }
}
