"use strict";
exports.__esModule = true;
var Value_1 = require("./Value");
var AlbumArt_1 = require("./AlbumArt");
var PlayMode_1 = require("./PlayMode");
var MetaInfo_1 = require("./MetaInfo");
var PlayInfo = /** @class */ (function () {
    function PlayInfo() {
        this.Play_Mode = new PlayMode_1.PlayMode();
        this.Album_ART = new AlbumArt_1.AlbumArt();
        this.Playback_Info = new Value_1.Value();
        this.Device_Type = new Value_1.Value();
        this.Play_Time = new Value_1.Value();
        this.Total_Tracks = new Value_1.Value();
        this.Track_Number = new Value_1.Value();
        this.iPod_Mode = new Value_1.Value();
        this.Meta_Info = new MetaInfo_1.MetaInfo();
    }
    return PlayInfo;
}());
exports.PlayInfo = PlayInfo;
