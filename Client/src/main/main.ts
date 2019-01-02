import {RunProxy} from "../renderer";

//const url = require("url");
const path = require("path");


const { app, Menu, Tray } = require('electron');
const iconPath = path.join(__dirname, 'Caitlyn.png');

let tray = null;
app.on('ready', () => {
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ]);
    tray.setToolTip('This is my application.');
    tray.setContextMenu(contextMenu);
    RunProxy();
});

