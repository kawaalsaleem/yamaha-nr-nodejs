import { IPowerControl } from "./IPowerControl";
import { IVolume } from "./IVolume";
import { IPlayControl } from "./IPlayControl";
import { IInput } from "./IInput";

export interface IControl {
    power: IControlPower;
    volume: IControlVolume;
    playback: IControlPlayback;
    setInput: IControlInput;
}

export interface IControlPower {
    turnOn: () => Promise<IPowerControl>;
    turnOff: () => Promise<IPowerControl>;
}

export interface IControlVolume {
    turnMuteOn: () => Promise<IVolume>;
    turnMuteOff: () => Promise<IVolume>;
    setVolumeLevel: (level: number) => Promise<IVolume>;
}

export interface IControlPlayback {
    play: () => Promise<IPlayControl>;
    pause: () => Promise<IPlayControl>;
    stop: () => Promise<IPlayControl>;
    next: () => Promise<IPlayControl>;
    prev: () => Promise<IPlayControl>;
}

export interface IControlInput {
    spotify: () => Promise<IInput>;
    digital1: () => Promise<IInput>;
    digital2: () => Promise<IInput>;
    aux1: () => Promise<IInput>;
    aux2: () => Promise<IInput>;
    disc: () => Promise<IInput>;
    tuner: () => Promise<IInput>;
    server: () => Promise<IInput>;
    netRadio: () => Promise<IInput>;
    usb: () => Promise<IInput>;
    airplay: () => Promise<IInput>;
}