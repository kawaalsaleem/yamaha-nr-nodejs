export interface ICommands {
    /** Contains the sound options */
    sound: ISoundOptions;
    /** Contains the playback options */
    playback: IPlaybackOptions;
    /** Contains the power options */
    power: IPowerOptions;
    /** Contains the input options */
    input: IInputOptions;
    /** Contains the info options */
    info: IInfoOptions;
}
export interface ISoundOptions {
    /** Mutes the receiver */
    muteOn: string;
    /** Turns mute off */
    muteOff: string;
    /** Contains the template for setting the volume level.
     * To use this correctly, you have to replace [LEVEL]
     * inside this string with a numerical value to set the level.
     */
    volume: string;
}
export interface IPlaybackOptions {
    /** Stops playback */
    stop: string;
    /** Pauses playback */
    pause: string;
    /** Plays selected item */
    play: string;
    /** Skips to the next item */
    skip: string;
    /** Rewinds the item */
    rewind: string;
}
export interface IPowerOptions {
    /** Turns the receiver on */
    on: string;
    /** Turns the receiver off */
    off: string;
}
export interface IInputOptions {
    /** Selects the Spotify input */
    spotify: string;
    /** Selects the Digital1 input */
    digital1: string;
    /** Selects the Digital2 input */
    digital2: string;
    /** Selects the Aux1 input */
    aux1: string;
    /** Selects the Aux2 input */
    aux2: string;
    /** Selects the CD input */
    cd: string;
    /** Selects the Tuner input */
    tuner: string;
    /** Selects the NET Server input */
    server: string;
    /** Selects the NET Radio input */
    netRadio: string;
    /** Selects the USB input */
    usb: string;
    /** Selects the Airplay input */
    airplay: string;
}
export interface IInfoOptions {
    /** Returns the Basic Status information
     ** Response contains:
     ** - Power status
     ** - Volume level
     ** - Mute status
     ** - Selected Input
     */
    basicStatus: string;
    /** Returns the selected input */
    selectedInput: string;
    /** Returns the player info
     *
     * Response could contain:
     *
     * - Playback info (eg. play, pause, stop)
     * - Device type
     * - iPod mode
     * - Player mode (eg. Repeat/Shuffle)
     * - Play time
     * - Track number
     * - Total tracks

     * - Meta info
     ** - Artist
     ** - Album
     ** - Song

     * - Album Art
     */
    playerInfo: string;
    systemInfo: string;
}
