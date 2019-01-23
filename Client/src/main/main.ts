import {RunProxy} from "../renderer";
import {RunServerWatcher} from "../renderer/ServerIndex";

const localtunnel = require('localtunnel');
const ngrok = require('ngrok');
//const url = require("url");
const path = require("path");
const PORT = 49000 + (100 * Math.random())|0;
const REPLACE_PORT = 49100 + (100 * Math.random())|0;
// const SERVER_PORT = 49100 + (100 * Math.random())|0;
const SERVER_PORT = 4800;

const PWD = "dankmemes";


const { app, Tray } = require('electron');
const iconPath = path.join(__dirname, 'MainIcon.png');

let tray = null;
app.on('ready', async () => {
    tray = new Tray(iconPath);
    tray.setToolTip('Make Clubs Great Again');
    const url = await ngrok.connect(4800);
    console.log("TUNNEL CREATED!!!!");
    RunProxy(PORT, REPLACE_PORT, PWD, url);
    RunServerWatcher(PORT, PWD, SERVER_PORT);
    // var mytunnel = localtunnel(SERVER_PORT, {"subdomin": "loldomain"} ,(err:any, tunnel:any) => {
    //     if(err) throw err;
    //     console.log("TUNNEL CREATED!!!!");
    //     RunProxy(PORT, REPLACE_PORT, PWD, tunnel.url);
    //     RunServerWatcher(PORT, PWD, SERVER_PORT);
    // });
    
});

