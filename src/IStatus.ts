export interface IStatus {
    isOn: boolean;
    isOff: boolean;
    isMuted: boolean;
    isPlaying: boolean;
    currentInput: string;
    volume: number;
    playbackStsatus: string;
    trackInfo: ITrackInfo;
}

export interface ITrackInfo {
    album: string;
    artist: string;
    song: string;
}