import { IRangeAndStep } from "./IRangeAndStep";
import { IValue } from "./IValue";
export interface IConfig {
    Model_Name: IValue;
    System_ID: IValue;
    Version: IValue;
    Feature_Existence: IValue;
    Range_and_Step: IRangeAndStep;
}
