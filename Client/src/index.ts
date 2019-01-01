import LeagueConnection from "./league/league";
import { getUxArguments, startFoundation, startUx, stopLeague } from "./league/util";
import LCUProxy from "./league/proxy";
import * as tempjson from "..//src//TempJSONS//MissionsTemplate.json";
import fs = require("fs");

const PORT = 49000 + (100 * Math.random())|0;
const REPLACE_PORT = 49100 + (100 * Math.random())|0;
const PWD = "dankmemes";
const LEAGUE_PATH = 'C:/Riot Games/League of Legends/';

console.log(`LOCKFILE: LeagueClient:1:${PORT}:${PWD}:https`);
console.log(`PROXY PORT: ${REPLACE_PORT}`);

var proxy = new LCUProxy(new LeagueConnection(PORT, PWD));
var firstConnection = false;

const REGION = process.argv[2];
const USERNAME = process.argv[3];
const PASSWORD = process.argv[4];



const LEAGUE_TICKER_PROXY_INFO = {
    "createdAt": new Date().toISOString(),
    "heading": "CLAN WARS",
    "message": "CLIENT IS CURRENTLY IN PROXY MODE",
    "severity": "info",
    "updatedAt": new Date().toISOString()
};


fs.writeFileSync(LEAGUE_PATH + "lockfile", `LeagueClient:1:${PORT}:${PWD}:https`);
RunProxyLCU();

var timer = setInterval(CheckIfSocketIsActive, 3);



async function RunProxyLCU() {
    (async () => {
        process.chdir(LEAGUE_PATH);

        // Stop an existing league process, if needed. Then start league and find the arguments.
        stopLeague();
        startFoundation(PORT, PWD);

        await new Promise(x => setTimeout(x, 5000));

        // Connect to league and load the normal window.
        const league = new LeagueConnection(PORT, PWD);
        await league.request("/riotclient/launch-ux", "POST");

        // Wait for user to log in.
        while (true) {
            let resp = await league.request("/lol-summoner/v1/current-summoner");
            if (resp.status !== 404)
                break;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Kill UX
        await league.request("/riotclient/kill-ux", "POST"); //need this to prevent mulitple instances of client

        SetupProxy(league);
    })().catch(console.error);

}


async function WatchSocket()
{

}

async function SetupProxy(league: LeagueConnection)
{
    let args = null;
    while (!args) {
        args = await getUxArguments();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    // Configure the proxy.
    proxy = new LCUProxy(league);
    proxy.listen(REPLACE_PORT);

    // Show a ticker message as an example of how to intercept/change stuff
    proxy.adjust(/ticker-messages/, data => {
        let json: Array<Object> = JSON.parse(data);
        json.push(LEAGUE_TICKER_PROXY_INFO);
        return JSON.stringify(json);
    });

    proxy.adjust(/lol-missions\/v1\/missions/, data => {
        let json: Array<Object> = JSON.parse(data);
        json.unshift(tempjson);
        return JSON.stringify(json);
    });

    // Start a new league window that refers to the proxy.
    startUx(args.replace("" + PORT, "" + REPLACE_PORT) + ` "--use-http"`);
    firstConnection = true;
}

function CheckIfSocketIsActive()
{
    if(firstConnection)
    {
        console.log(!proxy.isConnected());
        if(!proxy.isConnected())
        {
            console.log("Reconnecting League Proxy LCU");
            SetupProxy(new LeagueConnection(REPLACE_PORT, PWD));
            firstConnection = false;
        }
    }
}