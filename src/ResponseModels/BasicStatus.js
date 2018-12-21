"use strict";
exports.__esModule = true;
var PowerControl_1 = require("./PowerControl");
var Volume_1 = require("./Volume");
var Input_1 = require("./Input");
var BasicStatus = /** @class */ (function () {
    function BasicStatus() {
        this.Power_Control = new PowerControl_1.PowerControl();
        this.Volume = new Volume_1.Volume();
        this.Input = new Input_1.Input();
    }
    return BasicStatus;
}());
exports.BasicStatus = BasicStatus;
