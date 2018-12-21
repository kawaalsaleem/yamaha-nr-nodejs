"use strict";
exports.__esModule = true;
var Value_1 = require("./Value");
var PlayMode = /** @class */ (function () {
    function PlayMode() {
        this.Repeat = new Value_1.Value();
        this.Shuffle = new Value_1.Value();
    }
    return PlayMode;
}());
exports.PlayMode = PlayMode;
