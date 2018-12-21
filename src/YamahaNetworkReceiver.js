"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var _ = require("lodash");
var xml_js_1 = require("xml-js");
var request_promise_1 = require("request-promise");
var BasicStatus_1 = require("./ResponseModels/BasicStatus");
var Commands_1 = require("./Commands");
var PlayInfo_1 = require("./ResponseModels/PlayInfo");
var YamahaNetworkReceiver = /** @class */ (function () {
    /**
    * The Yamaha Network Receiver Constructor.
    * @constructor
    * @param {string} ip - The ip of the yamaha receiver.
    */
    function YamahaNetworkReceiver(ip) {
        this._ip = ip;
        this._commands = Commands_1.Commands;
        this._basicStatus = new BasicStatus_1.BasicStatus();
        this._playInfo = new PlayInfo_1.PlayInfo();
    }
    /**
     * Initializes the continues update pulling
     * @param interval The interval in milliseconds to request new values
     */
    YamahaNetworkReceiver.prototype.init = function (interval) {
        var _this = this;
        if (!interval) {
            interval = 5000;
        }
        this.interval = setInterval(function () {
            _this.getBasicStatus().then(function (basicStatus) {
                if (!_.isEqual(_this._basicStatus, basicStatus)) {
                    var changes = _this.getChanges(_this._basicStatus, basicStatus);
                    _this._basicStatus = basicStatus;
                    // notify
                }
            });
            _this.getPlayerInfo().then(function (playerInfo) {
                if (!_.isEqual(_this._playInfo, playerInfo)) {
                    var changes = _this.getChanges(_this._playInfo, playerInfo);
                    _this._playInfo = playerInfo;
                    // notify
                }
            });
        }, interval);
    };
    /**
     * Destroys the continues update pulling
     */
    YamahaNetworkReceiver.prototype.destroy = function () {
        clearInterval(this.interval);
    };
    /**
     * Compare two objects and change the key for the changed object to the parent object name.
     * @param oldValue The old object
     * @param newValue The new object
     * @returns {Array<object>} Returns the changed objects
     */
    YamahaNetworkReceiver.prototype.getChanges = function (oldValue, newValue) {
        var keys = _.union(_.keys(oldValue), _.keys(newValue));
        var changes = [];
        for (var i = 0; i < keys.length; i++) {
            if (typeof oldValue[keys[i]] == "object" && typeof newValue[keys[i]] === "object") {
                var nestedChanges = this.getChanges(oldValue[keys[i]], newValue[keys[i]]);
                if (nestedChanges && nestedChanges.length > 0) {
                    var nestedChangesArray = _.flattenDeep(nestedChanges);
                    for (var j = 0; j < nestedChangesArray.length; j++) {
                        _.map(nestedChangesArray[j], function (value, key, nestedChangesArrayColl) {
                            if (key == "newValue") {
                                var nestedChangeNewValue_1 = value;
                                _.map(newValue, function (newValueValue, newValueKey) {
                                    if (nestedChangeNewValue_1 == newValueValue.value) {
                                        nestedChangesArrayColl.key = newValueKey;
                                        return nestedChangesArrayColl;
                                    }
                                });
                            }
                        });
                        changes.push(nestedChangesArray[j]);
                    }
                }
                continue;
            }
            if (typeof oldValue[keys[i]] != typeof newValue[keys[i]]) {
                changes.push({
                    key: [keys[i]].toString(),
                    oldValue: oldValue[keys[i]],
                    newValue: newValue[keys[i]]
                });
                continue;
            }
            if (!_.eq(oldValue[keys[i]].toString(), newValue[keys[i]].toString())) {
                changes.push({
                    key: [keys[i]].toString(),
                    oldValue: oldValue[keys[i]],
                    newValue: newValue[keys[i]]
                });
            }
        }
        if (changes.length > 0) {
            return changes;
        }
    };
    YamahaNetworkReceiver.prototype.SendXMLToReceiver = function (xml) {
        var options = {
            method: 'POST',
            uri: 'http://' + this._ip + '/YamahaRemoteControl/ctrl',
            body: xml,
            xml: true
        };
        var response = request_promise_1["default"](options).then(function (body) {
            return xml_js_1["default"].xml2js(body, {
                compact: true,
                nativeType: true,
                textKey: 'value'
            });
        })["catch"](function (err) {
            console.error.bind(console);
            return err;
        });
        return response;
    };
    /////////////////////////////////////////// Begin Get Info Control ///////////////////////////////////////////
    /**
    * Gets the Basic Status from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.getBasicStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.info.basicStatus)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Basic_Status];
                }
            });
        });
    };
    ;
    /**
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.getSelectedInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.info.selectedInput)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input.Input_Sel.value];
                }
            });
        });
    };
    ;
    /**
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.getPlayerInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.info.playerInfo)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.Player.Play_Info];
                }
            });
        });
    };
    ;
    /**
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IConfig>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.getConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.info.systemInfo)];
                    case 1:
                        receiverResponse = _a.sent();
                        if (receiverResponse.YAMAHA_AV) {
                            return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Config];
                        }
                        return [2 /*return*/, new Promise(function () {
                                throw Error("Could not get the reciever config");
                            })];
                }
            });
        });
    };
    ;
    /**
    * Gets the volume level from the Network Receiver.
    * @returns {number} Returns the volume level as a number.
    */
    YamahaNetworkReceiver.prototype.getVolume = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.info.basicStatus)];
                    case 1:
                        receiverResponse = _a.sent();
                        if (receiverResponse.YAMAHA_AV) {
                            return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Basic_Status.Volume.Lvl.value];
                        }
                        else {
                            return [2 /*return*/, -1];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    /**
    * Gets the volume level from the Network Receiver.
    * @returns {number} Returns the volume level as a number.
    */
    YamahaNetworkReceiver.prototype.volume = function () {
        if (this._basicStatus.Volume.Lvl.value) {
            return this._basicStatus.Volume.Lvl.value;
        }
        else {
            return -1;
        }
    };
    ;
    /**
    * Gets the current mute status from the Network Receiver.
    * @returns {boolean} Returns the mute status as true or false.
    */
    YamahaNetworkReceiver.prototype.isMuted = function () {
        if (this._basicStatus.Volume.Mute.value) {
            return this._basicStatus.Volume.Mute.value;
        }
        else {
            return true;
        }
    };
    ;
    /**
    * Gets the current power status from the Network Receiver.
    * @returns {boolean} Returns the mute status as true or false.
    */
    YamahaNetworkReceiver.prototype.isOn = function () {
        if (this._basicStatus.Power_Control.Power.value) {
            return this._basicStatus.Power_Control.Power.value;
        }
        else {
            return false;
        }
    };
    ;
    YamahaNetworkReceiver.prototype.status = function () {
        var status = {
            isOn: this._basicStatus.Power_Control.Power.value,
            isOff: this._basicStatus.Power_Control.Power.value == false,
            isMuted: this._basicStatus.Volume.Mute.value,
            isPlaying: (this._playInfo.Playback_Info.value === "Play"),
            currentInput: this._basicStatus.Input.Input_Sel.value,
            volume: this._basicStatus.Volume.Lvl.value,
            playbackStsatus: this._playInfo.Playback_Info.value,
            trackInfo: {
                album: this._playInfo.Meta_Info.Album.value,
                artist: this._playInfo.Meta_Info.Artist.value,
                song: this._playInfo.Meta_Info.Song.value
            }
        };
        return status;
    };
    /////////////////////////////////////////// Begin Get Info Control ///////////////////////////////////////////
    //////////////////////////////////////////// Begin Volume Control ////////////////////////////////////////////
    /**
    * Mute the sound on the Network Receiver.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.muteOn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.sound.muteOn)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Volume];
                }
            });
        });
    };
    ;
    /**
    * Turns mute off on the Network Receiver.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.muteOff = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.sound.muteOff)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Volume];
                }
            });
        });
    };
    ;
    /**
    * Set the volume level
    * @param {number} The level to set for the volume, only whole numbers.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.setVolumeLevel = function (level) {
        return __awaiter(this, void 0, void 0, function () {
            var volumeCommand, receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        volumeCommand = this._commands.sound.volume;
                        volumeCommand = volumeCommand.replace("[LEVEL]", level.toString());
                        return [4 /*yield*/, this.SendXMLToReceiver(volumeCommand)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Volume];
                }
            });
        });
    };
    ;
    ///////////////////////////////////////////// End Volume Control /////////////////////////////////////////////
    //////////////////////////////////////////// Begin Power Control ////////////////////////////////////////////
    /**
    * Turn the Network Receiver power on.
    * @returns {Promise<IPowerControl>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.powerOn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.power.on)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Power_Control];
                }
            });
        });
    };
    ;
    /**
    * Turn the Network Receiver power off.
    * @returns {Promise<IPowerControl>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.powerOff = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.power.off)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Power_Control];
                }
            });
        });
    };
    ;
    ///////////////////////////////////////////// End Power Control /////////////////////////////////////////////
    ////////////////////////////////////////// Begin Playback Control //////////////////////////////////////////
    /**
    * Stops playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.stopPlayback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.playback.stop)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.Player.Play_Control];
                }
            });
        });
    };
    ;
    /**
    * Pauses playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.pausePlayback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.playback.pause)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.Player.Play_Control];
                }
            });
        });
    };
    ;
    /**
    * Resumes playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.resumePlayback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.playback.play)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.Player.Play_Control];
                }
            });
        });
    };
    ;
    /**
    * Skips track on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.skipTrack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.playback.skip)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.Player.Play_Control];
                }
            });
        });
    };
    ;
    /**
    * Rewinds track on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.rewindTrack = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.playback.rewind)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.Player.Play_Control];
                }
            });
        });
    };
    ;
    /////////////////////////////////////////// End Playback Control ///////////////////////////////////////////
    ////////////////////////////////////// Begin Input Selection Control //////////////////////////////////////
    /**
    * Selects Spotify as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectSpotifyInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.spotify)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    /**
    * Selects Digital 1 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectDigital1Input = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.digital1)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    /**
    * Selects Digital 2 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectDigital2Input = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.digital2)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    /**
    * Selects Aux 1 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectAux1Input = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.aux1)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    /**
    * Selects Aux 2 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectAux2Input = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.aux2)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    /**
    * Selects CD as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectCDInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.cd)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    /**
    * Selects Tuner as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectTunerInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.tuner)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    /**
    * Selects Server as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectServerInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.server)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    /**
    * Selects Internet Radio as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectNetRadioInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.netRadio)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    /**
    * Selects USB as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectUSBInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.usb)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    /**
    * Selects Apple AirPlay as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    YamahaNetworkReceiver.prototype.selectAirPlayInput = function () {
        return __awaiter(this, void 0, void 0, function () {
            var receiverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.SendXMLToReceiver(this._commands.input.airplay)];
                    case 1:
                        receiverResponse = _a.sent();
                        return [2 /*return*/, receiverResponse.YAMAHA_AV.System.Input];
                }
            });
        });
    };
    ;
    return YamahaNetworkReceiver;
}());
exports.YamahaNetworkReceiver = YamahaNetworkReceiver;
