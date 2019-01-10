"use strict"
import * as _ from 'lodash';
import request from 'request-promise';
import convert from 'xml-js';
import { Commands } from './Commands';
import { IBasicStatus } from './Interfaces/IBasicStatus';
import { IConfig } from './Interfaces/IConfig';
import { IControl } from './Interfaces/IControl';
import { IInput } from './Interfaces/IInput';
import { IPlayControl } from './Interfaces/IPlayControl';
import { IPlayInfo } from './Interfaces/IPlayInfo';
import { IPowerControl } from './Interfaces/IPowerControl';
import { IReceiverResponse } from './Interfaces/IReceiverResponse';
import { IVolume } from './Interfaces/IVolume';
import { IStatus } from './IStatus';
import { BasicStatus } from './Models/BasicStatus';
import { PlayInfo } from './Models/PlayInfo';

export class YamahaNetworkReceiver {
    private _ip: string;
    private _commands = Commands;
    private _basicStatus: BasicStatus;
    private _playInfo: PlayInfo;
    private interval: any;

    /**
    * The Yamaha Network Receiver Constructor.
    * To use the 
    * @constructor
    * @param {string} ip - The ip of the yamaha receiver.
    */
    constructor(ip: string) {
        if (!ip) {
            throw new Error("The YamahaNetworkReceiver needs an IP address as an parameter in the constructor");
        }

        this._ip = ip;
        this._basicStatus = new BasicStatus();
        this._playInfo = new PlayInfo();
    }

    /**
     * Object that contains control elements for the Network Receiver
     */
    public control: IControl = {
        setInput: {
            airplay: () => this.selectNetRadioInput(),
            aux1: () => this.selectAux1Input(),
            aux2: () => this.selectAux2Input(),
            digital1: () => this.selectDigital1Input(),
            digital2: () => this.selectDigital2Input(),
            disc: () => this.selectCDInput(),
            netRadio: () => this.selectNetRadioInput(),
            server: () => this.selectServerInput(),
            spotify: () => this.selectSpotifyInput(),
            tuner: () => this.selectTunerInput(),
            usb: () => this.selectUSBInput()
        },
        playback: {
            next: () => this.skipTrack(),
            pause: () => this.pausePlayback(),
            play: () => this.resumePlayback(),
            prev: () => this.rewindTrack(),
            stop: () => this.stopPlayback()
        },
        power: {
            turnOff: () => this.powerOff(),
            turnOn: () => this.powerOn()
        },
        volume: {
            setVolumeLevel: (level: number) => this.setVolumeLevel(level),
            turnMuteOff: () => this.muteOff(),
            turnMuteOn: () => this.muteOn()
        }
    }

    /**
    * Initializes the continues update pulling
    * @param intervalMs The interval in milliseconds to request new values
    */
    public init(intervalMs: number) {
        if (!intervalMs) {
            intervalMs = 5000;
        }
        this.interval = setInterval(() => {
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
        }, intervalMs);
    }

    /**
    * Destroys the continues update pulling
    */
    public destroy() {
        clearInterval(this.interval);
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
                        _.map(nestedChangesArray[j], (value: any, key: any, nestedChangesArrayColl: any) => {
                            if (key == "newValue") {
                                const nestedChangeNewValue = value;
                                _.map(newValue, (newValueValue: any, newValueKey: any) => {
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
            return err;
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
    }

    /** 
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    async getSelectedInput(): Promise<string> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.info.selectedInput);
        return receiverResponse.YAMAHA_AV.System.Input.Input_Sel.value as string;
    }

    /** 
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    async getPlayerInfo(): Promise<IPlayInfo> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.info.playerInfo);
        return receiverResponse.YAMAHA_AV.Player.Play_Info;
    }

    /** 
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IConfig>} Returns a promise with the Network Receiver response.
    */
    async getConfig(): Promise<IConfig> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.info.systemInfo);
        if (receiverResponse.YAMAHA_AV) {
            return receiverResponse.YAMAHA_AV.System.Config;
        }
        return {} as IConfig;
    }

    /** 
    * Gets the volume level from the Network Receiver.
    * @returns {Promise<number>} Returns a promise with the volume level as a number.
    */
    async getVolume(): Promise<number> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.info.basicStatus);
        if (receiverResponse.YAMAHA_AV) {
            return receiverResponse.YAMAHA_AV.System.Basic_Status.Volume.Lvl.value as number;
        }
        else {
            return -1;
        }
    }

    /** 
    * Gets the current mute status from the Network Receiver.
    * @returns {Promise<boolean>} Returns a promise with the mute status as true or false.
    */
    async isMuted(): Promise<boolean> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.info.basicStatus);
        if (receiverResponse.YAMAHA_AV) {
            return receiverResponse.YAMAHA_AV.System.Basic_Status.Volume.Mute.value === "On";
        }
        else {
            return false;
        }
    }

    /** 
    * Gets the current power status from the Network Receiver.
    * @returns {Promise<boolean>} Returns a promise with the power status as true or false.
    */
    async getPowerStatus(): Promise<boolean> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.info.basicStatus);
        if (receiverResponse.YAMAHA_AV) {
            return receiverResponse.YAMAHA_AV.System.Basic_Status.Power_Control.Power.value !== "Standby";
        }
        else {
            return false;
        }
    }

    status(): IStatus {
        const status: IStatus = {
            isOn: this._basicStatus.Power_Control.Power.value !== "Standby",
            isOff: this._basicStatus.Power_Control.Power.value === "Standby",
            isMuted: this._basicStatus.Volume.Mute.value === "On",
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
    /////////////////////////////////////////// End Get Info Control ///////////////////////////////////////////



    //////////////////////////////////////////// Begin Volume Control ////////////////////////////////////////////
    /** 
    * Mute the sound on the Network Receiver.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    private async muteOn(): Promise<IVolume> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.sound.muteOn);
        return receiverResponse.YAMAHA_AV.System.Volume;
    }

    /** 
    * Turns mute off on the Network Receiver.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    private async muteOff(): Promise<IVolume> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.sound.muteOff);
        return receiverResponse.YAMAHA_AV.System.Volume;
    }

    /** 
    * Set the volume level
    * @param {number} The level to set for the volume, only whole numbers.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    private async setVolumeLevel(level: number): Promise<IVolume> {
        let volumeCommand = this._commands.sound.volume;
        volumeCommand = volumeCommand.replace("[LEVEL]", level.toString());
        const receiverResponse = await this.SendXMLToReceiver(volumeCommand);
        return receiverResponse.YAMAHA_AV.System.Volume;
    }
    ///////////////////////////////////////////// End Volume Control /////////////////////////////////////////////



    //////////////////////////////////////////// Begin Power Control ////////////////////////////////////////////
    /** 
    * Turn the Network Receiver power on.
    * @returns {Promise<IPowerControl>} Returns a promise with the Network Receiver response.
    */
    private async powerOn(): Promise<IPowerControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.power.on);
        return receiverResponse.YAMAHA_AV.System.Power_Control;
    }

    /** 
    * Turn the Network Receiver power off.
    * @returns {Promise<IPowerControl>} Returns a promise with the Network Receiver response.
    */
    private async powerOff(): Promise<IPowerControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.power.off);
        return receiverResponse.YAMAHA_AV.System.Power_Control;
    }
    ///////////////////////////////////////////// End Power Control /////////////////////////////////////////////



    ////////////////////////////////////////// Begin Playback Control //////////////////////////////////////////
    /** 
    * Stops playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    private async stopPlayback(): Promise<IPlayControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.playback.stop);
        return receiverResponse.YAMAHA_AV.Player.Play_Control;
    }

    /** 
    * Pauses playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    private async pausePlayback(): Promise<IPlayControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.playback.pause);
        return receiverResponse.YAMAHA_AV.Player.Play_Control;
    }

    /** 
    * Resumes playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    private async resumePlayback(): Promise<IPlayControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.playback.play);
        return receiverResponse.YAMAHA_AV.Player.Play_Control;
    }

    /** 
    * Skips track on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    private async skipTrack(): Promise<IPlayControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.playback.skip);
        return receiverResponse.YAMAHA_AV.Player.Play_Control;
    }

    /** 
    * Rewinds track on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    private async rewindTrack(): Promise<IPlayControl> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.playback.rewind);
        return receiverResponse.YAMAHA_AV.Player.Play_Control;
    }
    /////////////////////////////////////////// End Playback Control ///////////////////////////////////////////



    ////////////////////////////////////// Begin Input Selection Control //////////////////////////////////////
    /** 
    * Selects Spotify as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectSpotifyInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.spotify);
        return receiverResponse.YAMAHA_AV.System.Input;
    }

    /** 
    * Selects Digital 1 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectDigital1Input(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.digital1);
        return receiverResponse.YAMAHA_AV.System.Input;
    }

    /** 
    * Selects Digital 2 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectDigital2Input(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.digital2);
        return receiverResponse.YAMAHA_AV.System.Input;
    }

    /** 
    * Selects Aux 1 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectAux1Input(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.aux1);
        return receiverResponse.YAMAHA_AV.System.Input;
    }

    /** 
    * Selects Aux 2 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectAux2Input(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.aux2);
        return receiverResponse.YAMAHA_AV.System.Input;
    }

    /** 
    * Selects CD as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectCDInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.cd);
        return receiverResponse.YAMAHA_AV.System.Input;
    }

    /** 
    * Selects Tuner as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectTunerInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.tuner);
        return receiverResponse.YAMAHA_AV.System.Input;
    }

    /** 
    * Selects Server as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectServerInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.server);
        return receiverResponse.YAMAHA_AV.System.Input;
    }

    /** 
    * Selects Internet Radio as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectNetRadioInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.netRadio);
        return receiverResponse.YAMAHA_AV.System.Input;
    }

    /** 
    * Selects USB as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectUSBInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.usb);
        return receiverResponse.YAMAHA_AV.System.Input;
    }

    /** 
    * Selects Apple AirPlay as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    private async selectAirPlayInput(): Promise<IInput> {
        const receiverResponse = await this.SendXMLToReceiver(this._commands.input.airplay);
        return receiverResponse.YAMAHA_AV.System.Input;
    }
    /////////////////////////////////////// End Input Selection Control ///////////////////////////////////////
}