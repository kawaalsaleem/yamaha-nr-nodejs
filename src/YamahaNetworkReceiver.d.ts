import { IBasicStatus } from './ResponseModels/Interfaces/IBasicStatus';
import { IConfig } from './ResponseModels/Interfaces/IConfig';
import { IInput } from './ResponseModels/Interfaces/IInput';
import { IPlayControl } from './ResponseModels/Interfaces/IPlayControl';
import { IPlayInfo } from './ResponseModels/Interfaces/IPlayInfo';
import { IPowerControl } from './ResponseModels/Interfaces/IPowerControl';
import { IStatus } from './IStatus';
import { IVolume } from './ResponseModels/Interfaces/IVolume';
export declare class YamahaNetworkReceiver {
    private _ip;
    private _commands;
    private _basicStatus;
    private _playInfo;
    private interval;
    /**
    * The Yamaha Network Receiver Constructor.
    * @constructor
    * @param {string} ip - The ip of the yamaha receiver.
    */
    constructor(ip: string);
    /**
     * Initializes the continues update pulling
     * @param interval The interval in milliseconds to request new values
     */
    init(interval: number): void;
    /**
     * Destroys the continues update pulling
     */
    destroy(): void;
    /**
     * Compare two objects and change the key for the changed object to the parent object name.
     * @param oldValue The old object
     * @param newValue The new object
     * @returns {Array<object>} Returns the changed objects
     */
    private getChanges;
    private SendXMLToReceiver;
    /**
    * Gets the Basic Status from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    getBasicStatus(): Promise<IBasicStatus>;
    /**
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    getSelectedInput(): Promise<string>;
    /**
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IBasicStatus>} Returns a promise with the Network Receiver response.
    */
    getPlayerInfo(): Promise<IPlayInfo>;
    /**
    * Gets the current selected input from the Network Receiver.
    * @returns {Promise<IConfig>} Returns a promise with the Network Receiver response.
    */
    getConfig(): Promise<IConfig>;
    /**
    * Gets the volume level from the Network Receiver.
    * @returns {number} Returns the volume level as a number.
    */
    getVolume(): Promise<number>;
    /**
    * Gets the volume level from the Network Receiver.
    * @returns {number} Returns the volume level as a number.
    */
    volume(): number;
    /**
    * Gets the current mute status from the Network Receiver.
    * @returns {boolean} Returns the mute status as true or false.
    */
    isMuted(): boolean;
    /**
    * Gets the current power status from the Network Receiver.
    * @returns {boolean} Returns the mute status as true or false.
    */
    isOn(): boolean;
    status(): IStatus;
    /**
    * Mute the sound on the Network Receiver.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    muteOn(): Promise<IVolume>;
    /**
    * Turns mute off on the Network Receiver.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    muteOff(): Promise<IVolume>;
    /**
    * Set the volume level
    * @param {number} The level to set for the volume, only whole numbers.
    * @returns {Promise<IVolume>} Returns a promise with the Network Receiver response.
    */
    setVolumeLevel(level: number): Promise<IVolume>;
    /**
    * Turn the Network Receiver power on.
    * @returns {Promise<IPowerControl>} Returns a promise with the Network Receiver response.
    */
    powerOn(): Promise<IPowerControl>;
    /**
    * Turn the Network Receiver power off.
    * @returns {Promise<IPowerControl>} Returns a promise with the Network Receiver response.
    */
    powerOff(): Promise<IPowerControl>;
    /**
    * Stops playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    stopPlayback(): Promise<IPlayControl>;
    /**
    * Pauses playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    pausePlayback(): Promise<IPlayControl>;
    /**
    * Resumes playback on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    resumePlayback(): Promise<IPlayControl>;
    /**
    * Skips track on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    skipTrack(): Promise<IPlayControl>;
    /**
    * Rewinds track on the Network Receiver.
    * @returns {Promise<IPlayControl>} Returns a promise with the Network Receiver response.
    */
    rewindTrack(): Promise<IPlayControl>;
    /**
    * Selects Spotify as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectSpotifyInput(): Promise<IInput>;
    /**
    * Selects Digital 1 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectDigital1Input(): Promise<IInput>;
    /**
    * Selects Digital 2 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectDigital2Input(): Promise<IInput>;
    /**
    * Selects Aux 1 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectAux1Input(): Promise<IInput>;
    /**
    * Selects Aux 2 as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectAux2Input(): Promise<IInput>;
    /**
    * Selects CD as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectCDInput(): Promise<IInput>;
    /**
    * Selects Tuner as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectTunerInput(): Promise<IInput>;
    /**
    * Selects Server as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectServerInput(): Promise<IInput>;
    /**
    * Selects Internet Radio as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectNetRadioInput(): Promise<IInput>;
    /**
    * Selects USB as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectUSBInput(): Promise<IInput>;
    /**
    * Selects Apple AirPlay as the input source on the Network Receiver.
    * @returns {Promise<IInput>} Returns a promise with the Network Receiver response.
    */
    selectAirPlayInput(): Promise<IInput>;
}
