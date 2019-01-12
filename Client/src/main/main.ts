import {RunProxy} from "../renderer";
import {RunServerWatcher} from "../renderer/ServerIndex";

//const url = require("url");
const path = require("path");
const PORT = 49000 + (100 * Math.random())|0;
const REPLACE_PORT = 49100 + (100 * Math.random())|0;
const PWD = "dankmemes";


const { app, Tray } = require('electron');
const iconPath = path.join(__dirname, 'Caitlyn.png');

let tray = null;
app.on('ready', () => {
    tray = new Tray(iconPath);
    tray.setToolTip('LOL API CHALLENGE');
    RunProxy(PORT, REPLACE_PORT, PWD);
    RunServerWatcher(PORT, PWD);
    //todo async function for webserver managing
});

