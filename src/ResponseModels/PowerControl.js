"use strict";
exports.__esModule = true;
var Value_1 = require("./Value");
var PowerControl = /** @class */ (function () {
    function PowerControl() {
        this.Power = new Value_1.Value();
        this.Sleep = new Value_1.Value();
    }
    return PowerControl;
}());
exports.PowerControl = PowerControl;
