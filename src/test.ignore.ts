import { IInput } from './ResponseModels/Interfaces/IInput';
import { YamahaNetworkReceiver } from './YamahaNetworkReceiver';

let iteration = 0;

var networkReceiver = new YamahaNetworkReceiver("192.168.1.11");
networkReceiver.init(5000);
networkReceiver.getVolume().then(resp => {
    console.log(resp);
});
const interval = setInterval(() => {
    if(iteration === 9){
        clearInterval(interval);
        networkReceiver.destroy();
    }
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
    console.log(`-----------------${iteration}---------------`);
    iteration++;
}, 5000);