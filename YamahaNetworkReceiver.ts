import * as _ from 'lodash';
import * as Commands from './commands.json';
import convert from 'xml-js';
import request from 'request-promise';
import { BasicStatus } from './ResponseModels/BasicStatus';
import { IBasicStatus } from './ResponseModels/IBasicStatus';
import { ICommands } from './ICommands';
import { IConfig } from './ResponseModels/IConfig';
import { IInput } from './ResponseModels/IInput';
import { IPlayControl } from './ResponseModels/IPlayControl';
import { IPlayInfo } from './ResponseModels/IPlayInfo';
import { IPowerControl } from './ResponseModels/IPowerControl';
import { IReceiverResponse } from './ResponseModels/IReceiverResponse';
import { IStatus } from './IStatus';
import { IVolume } from './ResponseModels/IVolume';
import { PlayInfo } from './ResponseModels/PlayInfo';

export class YamahaNetworkReceiver {
    private _ip: string;
    private _commands: ICommands;
    private _basicStatus: BasicStatus;
    private _playInfo: PlayInfo;

    /**
    * The Yamaha Network Receiver Constructor.
    * @constructor
    * @param {string} ip - The ip of the yamaha receiver.
    */
    constructor(ip: string) {
        this._ip = ip;
        this._commands = <any>Commands as ICommands;
        this._basicStatus = new BasicStatus();
        this._playInfo = new PlayInfo();

        this.getBasicStatus().then((basicStatus) => {
            this._basicStatus = basicStatus;
        }).catch((error) => {
            console.error(error);
        });

        this.getPlayerInfo().then((playerInfo) => {
            this._playInfo = playerInfo;
        }).catch((error) => {
            console.error(error);
        });

        this.init();
    }

    private init() {
        setInterval(() => {
            this.getBasicStatus().then((basicStatus) => {
                if (!_.isEqual(this._basicStatus, basicStatus)) {
                    const changes = this.getChanges(this._basicStatus, basicStatus);
                    this._basicStatus = basicStatus;
                    // notify
                }
            });

            this.getPlayerInfo().then((playerInfo) => {
                if (!_.isEqual(this._playInfo, playerInfo)) {
                    const changes = this.getChanges(this._playInfo, playerInfo);
                    this._playInfo = playerInfo;
                    // notify
                }
            });
        }, 5000);
    }

    /**
     * Compare two objects and change the key for the changed object to the parent object name.
     * @param oldValue The old object
     * @param newValue The new object
     * @returns {Array<object>} Returns the changed objects 
     */
    private getChanges(oldValue: any, newValue: any): any {
        var keys = _.union(_.keys(oldValue), _.keys(newValue));
        var changes = [];
        for (let i = 0; i < keys.length; i++) {
            if (typeof oldValue[keys[i]] == "object" && typeof newValue[keys[i]] === "object") {
                const nestedChanges = this.getChanges(oldValue[keys[i]], newValue[keys[i]]);
                if (nestedChanges && nestedChanges.length > 0) {
                    const nestedChangesArray = _.flattenDeep(nestedChanges);
                    for (let j = 0; j < nestedChangesArray.length; j++) {
                        _.map(nestedChangesArray[j], (value, key, nestedChangesArrayColl: any) => {
                            if (key == "newValue") {
                                const nestedChangeNewValue = value;
                                _.map(newValue, (newValueValue, newValueKey, newValueColl) => {
                                    if (nestedChangeNewValue == newValueValue.value) {
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
    }

    private SendXMLToReceiver(xml: string): Promise<IReceiverResponse> {
        const options = {
            method: 'POST',
            uri: 'http://' + this._ip + '/YamahaRemoteControl/ctrl',
            body: xml,
            xml: true
        };
        const response = request(options).then((body) => {
            return convert.xml2js(body, {
                compact: true,
                nativeType: true,
                textKey: 'value'
            });
        }).catch((err) => {
            console.error.bind(console);
        });
        return response as any;
    }

    /////////////////////////////////////////// Begin Get Info Control ///////////////////////////////////////////
    /** 
    * Gets the Basic Status from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    async getBasicStatus(): Promise<IBasicStatus> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.info.basicStatus);
        return receiverResponse.YAMAHA_AV.System.Basic_Status;
    };

    /** 
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    async getSelectedInput(): Promise<string> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.info.selectedInput);
        return receiverResponse.YAMAHA_AV.System.Input.Input_Sel.value as string;
    };

    /** 
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    async getPlayerInfo(): Promise<IPlayInfo> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.info.playerInfo);
        return receiverResponse.YAMAHA_AV.Player.Play_Info;
    };

    /** 
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IConfig>} Returns a promise with the Network Receiver response.
    */
    async getConfig(): Promise<IConfig> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.info.systemInfo);
        return receiverResponse.YAMAHA_AV.System.Config;
    };

    /** 
    * Gets the volume level from the Network Receiver.
    * @returns {number} Returns the volume level as a number.
    */
    getCurrentVolume(): number {
        if (typeof this._basicStatus !== "undefined") {
            return this._basicStatus.Volume.Lvl.value as number;
        } else {
            return -1;
        }
    };

    /** 
    * Gets the current smute status from the Network Receiver.
    * @returns {boolean} Returns the mute status as true or false.
    */
    getIsMuted(): boolean {
        if (typeof this._basicStatus !== "undefined") {
            return this._basicStatus.Volume.Mute.value as boolean;
        } else {
            return false;
        }
    };

    /** 
    * Gets the current smute status from the Network Receiver.
    * @returns {boolean} Returns the mute status as true or false.
    */
    getIsOn(): boolean {
        if (typeof this._basicStatus !== "undefined") {
            return this._basicStatus.Volume.Mute.value as boolean;
        } else {
            return false;
        }
    };

    status() : IStatus {
        const status : IStatus = {
            isOn: this._basicStatus.Power_Control.Power.value as boolean,
            isOff: !this._basicStatus.Power_Control.Power.value as boolean,
            isMuted: this._basicStatus.Volume.Mute.value as boolean,
            isPlaying: (this._playInfo.Playback_Info.value === "Play") as boolean,
            currentInput: this._basicStatus.Input.Input_Sel.value as string,
            volume: this._basicStatus.Volume.Lvl.value as number,
            playbackStsatus: this._playInfo.Playback_Info.value as string,
            trackInfo: {
                album: this._playInfo.Meta_Info.Album.value as string,
                artist: this._playInfo.Meta_Info.Artist.value as string,
                song: this._playInfo.Meta_Info.Song.value as string
            }
        };

        return status;
    }
    /////////////////////////////////////////// Begin Get Info Control ///////////////////////////////////////////



    //////////////////////////////////////////// Begin Volume Control ////////////////////////////////////////////
    /** 
    * Mute the sound on the Network Receiver.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    async muteOn(): Promise<IVolume> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.sound.muteOn);
        return receiverResponse.YAMAHA_AV.System.Volume;
    };

    /** 
    * Turns mute off on the Network Receiver.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    async muteOff(): Promise<IVolume> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.sound.muteOff);
        return receiverResponse.YAMAHA_AV.System.Volume;
    };

    /** 
    * Set the volume level
    * @param {number} The level to set for the volume, only whole numbers.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    async setVolumeLevel(level: number): Promise<IVolume> {
        let volumeCommand = this._commands.sound.volume;
        volumeCommand = volumeCommand.replace("[LEVEL]", level.toString());
        const receiverResponse = await this.SendXMLToReceiver(volumeCommand);
        return receiverResponse.YAMAHA_AV.System.Volume;
    };
    ///////////////////////////////////////////// End Volume Control /////////////////////////////////////////////



    //////////////////////////////////////////// Begin Power Control ////////////////////////////////////////////
    /** 
    * Turn the Network Receiver power on.
    * @returns {Promise<IPowerControl>} Returns a promise with the Network Receiver response.
    */
    async powerOn(): Promise<IPowerControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.power.on);
        return receiverResponse.YAMAHA_AV.System.Power_Control;
    };

    /** 
    * Turn the Network Receiver power off.
    * @returns {Promise<IPowerControl>} Returns a promise with the Network Receiver response.
    */
    async powerOff(): Promise<IPowerControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.power.off);
        return receiverResponse.YAMAHA_AV.System.Power_Control;
    };
    ///////////////////////////////////////////// End Power Control /////////////////////////////////////////////



    ////////////////////////////////////////// Begin Playback Control //////////////////////////////////////////
    /** 
    * Stops playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    async stopPlayback(): Promise<IPlayControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.playback.stop);
        return receiverResponse.YAMAHA_AV.Player.Play_Control;
    };

    /** 
    * Pauses playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    async pausePlayback(): Promise<IPlayControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.playback.pause);
        return receiverResponse.YAMAHA_AV.Player.Play_Control;
    };

    /** 
    * Resumes playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    async resumePlayback(): Promise<IPlayControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.playback.play);
        return receiverResponse.YAMAHA_AV.Player.Play_Control;
    };

    /** 
    * Skips track on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    async skipTrack(): Promise<IPlayControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.playback.skip);
        return receiverResponse.YAMAHA_AV.Player.Play_Control;
    };

    /** 
    * Rewinds track on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    async rewindTrack(): Promise<IPlayControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.playback.rewind);
        return receiverResponse.YAMAHA_AV.Player.Play_Control;
    };
    /////////////////////////////////////////// End Playback Control ///////////////////////////////////////////



    ////////////////////////////////////// Begin Input Selection Control //////////////////////////////////////
    /** 
    * Selects Spotify as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectSpotifyInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.spotify);
        return receiverResponse.YAMAHA_AV.System.Input;
    };

    /** 
    * Selects Digital 1 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectDigital1Input(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.digital1);
        return receiverResponse.YAMAHA_AV.System.Input;
    };

    /** 
    * Selects Digital 2 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectDigital2Input(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.digital2);
        return receiverResponse.YAMAHA_AV.System.Input;
    };

    /** 
    * Selects Aux 1 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectAux1Input(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.aux1);
        return receiverResponse.YAMAHA_AV.System.Input;
    };

    /** 
    * Selects Aux 2 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectAux2Input(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.aux2);
        return receiverResponse.YAMAHA_AV.System.Input;
    };

    /** 
    * Selects CD as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectCDInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.cd);
        return receiverResponse.YAMAHA_AV.System.Input;
    };

    /** 
    * Selects Tuner as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectTunerInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.tuner);
        return receiverResponse.YAMAHA_AV.System.Input;
    };

    /** 
    * Selects Server as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectServerInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.server);
        return receiverResponse.YAMAHA_AV.System.Input;
    };

    /** 
    * Selects Internet Radio as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectNetRadioInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.netRadio);
        return receiverResponse.YAMAHA_AV.System.Input;
    };

    /** 
    * Selects USB as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectUSBInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.usb);
        return receiverResponse.YAMAHA_AV.System.Input;
    };

    /** 
    * Selects Apple AirPlay as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    async selectAirPlayInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.airplay);
        return receiverResponse.YAMAHA_AV.System.Input;
    };
    /////////////////////////////////////// End Input Selection Control ///////////////////////////////////////
}