import { IInput } from './ResponseModels/Interfaces/IInput';
import { YamahaNetworkReceiver } from './YamahaNetworkReceiver';

var networkReceiver = new YamahaNetworkReceiver("192.168.1.11");
setInterval(() => {
    console.log("currentInput", networkReceiver.status().currentInput);
    console.log("isMuted", networkReceiver.status().isMuted);
    console.log("isOff", networkReceiver.status().isOff);
    console.log("isOn", networkReceiver.status().isOn);
    console.log("isPlaying", networkReceiver.status().isPlaying);
    console.log("playbackStsatus", networkReceiver.status().playbackStsatus);
    console.log("volume", networkReceiver.status().volume);
    console.log("album", networkReceiver.status().trackInfo.album);
    console.log("artist", networkReceiver.status().trackInfo.artist);
    console.log("song", networkReceiver.status().trackInfo.song);
    console.log("--------------------------------");
}, 5000);