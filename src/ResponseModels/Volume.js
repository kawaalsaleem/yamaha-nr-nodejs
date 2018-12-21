"use strict";
exports.__esModule = true;
var Value_1 = require("./Value");
var Volume = /** @class */ (function () {
    function Volume() {
        this.Mute = new Value_1.Value();
        this.Lvl = new Value_1.Value();
    }
    return Volume;
}());
exports.Volume = Volume;
