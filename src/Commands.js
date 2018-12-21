"use strict";
exports.__esModule = true;
exports.Commands = {
    "info": {
        "basicStatus": "<YAMAHA_AV cmd=\"GET\"><System><Basic_Status>GetParam</Basic_Status></System></YAMAHA_AV>",
        "playerInfo": "<YAMAHA_AV cmd=\"GET\"><Player><Play_Info>GetParam</Play_Info></Player></YAMAHA_AV>",
        "selectedInput": "<YAMAHA_AV cmd=\"GET\"><System><Input><Input_Sel>GetParam</Input_Sel></Input></System></YAMAHA_AV>",
        "systemInfo": "<YAMAHA_AV cmd=\"GET\"><System><Config>GetParam</Config></System></YAMAHA_AV>"
    },
    "input": {
        "airplay": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>AirPlay</Input_Sel></Input></System></YAMAHA_AV>",
        "aux1": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>AUX1</Input_Sel></Input></System></YAMAHA_AV>",
        "aux2": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>AUX2</Input_Sel></Input></System></YAMAHA_AV>",
        "cd": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>CD</Input_Sel></Input></System></YAMAHA_AV>",
        "digital1": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>DIGITAL1</Input_Sel></Input></System></YAMAHA_AV>",
        "digital2": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>DIGITAL2</Input_Sel></Input></System></YAMAHA_AV>",
        "netRadio": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>NET RADIO</Input_Sel></Input></System></YAMAHA_AV>",
        "server": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>SERVER</Input_Sel></Input></System></YAMAHA_AV>",
        "spotify": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>Spotify</Input_Sel></Input></System></YAMAHA_AV>",
        "tuner": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>TUNER</Input_Sel></Input></System></YAMAHA_AV>",
        "usb": "<YAMAHA_AV cmd=\"PUT\"><System><Input><Input_Sel>USB</Input_Sel></Input></System></YAMAHA_AV>"
    },
    "playback": {
        "pause": "<YAMAHA_AV cmd=\"PUT\"><Player><Play_Control><Playback>Pause</Playback></Play_Control></Player></YAMAHA_AV>",
        "play": "<YAMAHA_AV cmd=\"PUT\"><Player><Play_Control><Playback>Play</Playback></Play_Control></Player></YAMAHA_AV>",
        "rewind": "<YAMAHA_AV cmd=\"PUT\"><Player><Play_Control><Playback>Skip Rev</Playback></Play_Control></Player></YAMAHA_AV>",
        "skip": "<YAMAHA_AV cmd=\"PUT\"><Player><Play_Control><Playback>Skip Fwd</Playback></Play_Control></Player></YAMAHA_AV>",
        "stop": "<YAMAHA_AV cmd=\"PUT\"><Player><Play_Control><Playback>Stop</Playback></Play_Control></Player></YAMAHA_AV>"
    },
    "power": {
        "off": "<YAMAHA_AV cmd=\"PUT\"><System><Power_Control><Power>Standbyyy</Power></Power_Control></System></YAMAHA_AV>",
        "on": "<YAMAHA_AV cmd=\"PUT\"><System><Power_Control><Power>On</Power></Power_Control></System></YAMAHA_AV>"
    },
    "sound": {
        "muteOff": "<YAMAHA_AV cmd=\"PUT\"><System><Volume><Mute>Off</Mute></Volume></System></YAMAHA_AV>",
        "muteOn": "<YAMAHA_AV cmd=\"PUT\"><System><Volume><Mute>On</Mute></Volume></System></YAMAHA_AV>",
        "volume": "<YAMAHA_AV cmd=\"PUT\"><System><Volume><Lvl>[LEVEL]</Lvl></Volume></System></YAMAHA_AV>"
    }
};
