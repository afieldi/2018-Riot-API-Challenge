import {RunProxy} from "../renderer";

//const url = require("url");
const path = require("path");


const { app, Tray } = require('electron');
const iconPath = path.join(__dirname, 'Caitlyn.png');

let tray = null;
app.on('ready', () => {
    tray = new Tray(iconPath);
    tray.setToolTip('LOL API CHALLENGE');
    RunProxy();
    //todo async function for webserver managing
});

