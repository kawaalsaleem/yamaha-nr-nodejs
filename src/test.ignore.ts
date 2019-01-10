import { IInput } from './Interfaces/IInput';
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
    const status = networkReceiver.status();
    if(!status.currentInput) return;
    console.log("currentInput", status.currentInput);
    console.log("isMuted", status.isMuted);
    console.log("isOff", status.isOff);
    console.log("isOn", status.isOn);
    console.log("isPlaying", status.isPlaying);
    console.log("playbackStsatus", status.playbackStsatus);
    console.log("volume", status.volume);
    console.log("album", status.trackInfo.album);
    console.log("artist", status.trackInfo.artist);
    console.log("song", status.trackInfo.song);
    console.log(`-----------------${iteration}---------------`);
    iteration++;
}, 5000);

setTimeout(() => {
    networkReceiver.control.setInput.digital1().then(response => {
        console.log(response);
        
        setTimeout(() => {
            networkReceiver.getVolume().then(origVol => {
                networkReceiver.control.volume.setVolumeLevel(10).then(volume => {
                    console.log(volume);
                    networkReceiver.control.setInput.tuner().then(inputResponse => {
                        console.log(inputResponse);
                        networkReceiver.control.volume.setVolumeLevel(origVol);
                    });
                });
            });            
        }, 1000);
    });    
}, 9000);