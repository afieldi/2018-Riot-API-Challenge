import {RunProxy} from "../renderer";
import {RunServerWatcher} from "../renderer/ServerIndex";

const localtunnel = require('localtunnel');

//const url = require("url");
const path = require("path");
const PORT = 49000 + (100 * Math.random())|0;
const REPLACE_PORT = 49100 + (100 * Math.random())|0;
const SERVER_PORT = 49100 + (100 * Math.random())|0;

const PWD = "dankmemes";


const { app, Tray } = require('electron');
const iconPath = path.join(__dirname, 'MainIcon.png');

let tray = null;
app.on('ready', () => {
    tray = new Tray(iconPath);
    tray.setToolTip('Make Clubs Great Again');
    var mytunnel = localtunnel(PORT, (err:any, tunnel:any) => {
        if(err) throw err;
        console.log("TUNNEL CREATED!!!!");
        console.log(tunnel.url);
        RunProxy(PORT, REPLACE_PORT, PWD, tunnel.url + ":" + PORT);
        RunServerWatcher(PORT, PWD, SERVER_PORT);
    });
    
});

