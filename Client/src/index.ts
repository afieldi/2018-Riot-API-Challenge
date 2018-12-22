import LeagueConnection from "./league/league";
import { getUxArguments, startFoundation, startUx, stopLeague } from "./league/util";
import LCUProxy from "./league/proxy";
import merge = require("merge-options");

const PORT = 49000 + (100 * Math.random())|0;
const REPLACE_PORT = 49100 + (100 * Math.random())|0;
const PWD = "dankmemes";

// LOCKFILE: LeagueClient:20904:63769:3UMgPMIfav6dqRUHowD0Aw:https
console.log(`LOCKFILE: LeagueClient:1:${PORT}:${PWD}:https`);
console.log(`PROXY PORT: ${REPLACE_PORT}`);

const REGION = process.argv[2];
const USERNAME = process.argv[3];
const PASSWORD = process.argv[4];

(async () => {
    process.chdir('C:/Riot Games/League of Legends/');

    // Stop an existing league process, if needed. Then start league and find the arguments.
    stopLeague();
    startFoundation(PORT, PWD);

    await new Promise(x => setTimeout(x, 5000));

    // Connect to league and load the normal window.
    const league = new LeagueConnection(PORT, PWD);
    await league.request("/riotclient/launch-ux", "POST");

    let args = null;
    while (!args) {
        args = await getUxArguments();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // // Now unload the window again.
    // await league.request("/riotclient/unload", "POST");

    // // Wait for league to unload.
    // while (true) {
    //     if (!await getUxArguments()) break;
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    // }

    // Wait for user to log in.
    while (true) {
        let resp = await league.request("/lol-summoner/v1/current-summoner");
        if (resp.status !== 404)
            break;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Kill UX
    await league.request("/riotclient/kill-ux", "POST");

    // Configure the proxy.
    const proxy = new LCUProxy(league);
    proxy.listen(REPLACE_PORT);

    // Show a ticker message as an example of how to intercept/change stuff
    proxy.adjust(/ticker-messages/, data => {
        let json: Array<Object> = JSON.parse(data);
        json.push({
            "createdAt": new Date().toISOString(),
            "heading": "CLAN WARS",
            "message": "CLIENT IS CURRENTLY IN PROXY MODE",
            "severity": "info",
            "updatedAt": new Date().toISOString()
        });
        return JSON.stringify(json);
    });

    proxy.adjust(/lol-missions\/v1\/missions/, data => {
        let json: Array<Object> = JSON.parse(data);
        json.unshift({
            "backgroundImageUrl": "",
            "celebrationType": "VIGNETTE",
            "clientNotifyLevel": "ALWAYS",
            "completedDate": -1,
            "completionExpression": "1 or 2",
            "cooldownTimeMillis": -1,
            "description": "",
            "display": {
              "attributes": []
            },
            "displayType": "ALWAYS",
            "endTime": Date.now() + 24 * 3600 * 1000,
            "expiringWarnings": [
              {
                "alertTime": 1546675140000,
                "message": "",
                "type": ""
              }
            ],
            "helperText": "",
            "iconImageUrl": "/lol-game-data/assets/v1/items/icons2d/4004.png",
            "id": "ef810430-f81d-11e8-81fc-02cbe124d5e4",
            "internalName": "neeko18_intro",
            "isNew": false,
            "lastUpdatedTimestamp": Date.now(),
            "locale": "en_US",
            "metadata": {
              "tutorial": {
                "displayRewards": {},
                "queueId": "",
                "stepNumber": -1,
                "useChosenChampion": false,
                "useQuickSearchMatchmaking": false
              }
            },
            "missionType": "ONETIME",
            "objectives": [
              {
                "description": "Win Worlds",
                "hasObjectiveBasedReward": false,
                "progress": {
                  "currentProgress": 0,
                  "lastViewedProgress": 0,
                  "totalCount": 1
                },
                "rewardGroups": [],
                "sequence": 1,
                "type": "LEGS"
              },
              {
                "description": "Win MSI",
                "hasObjectiveBasedReward": false,
                "progress": {
                  "currentProgress": 4,
                  "lastViewedProgress": 4,
                  "totalCount": 4
                },
                "rewardGroups": [],
                "sequence": 2,
                "type": "LEGS"
              }
            ],
            "requirements": [],
            "rewardStrategy": {
              "groupStrategy": "ALL_GROUPS",
              "selectMaxGroupCount": 0,
              "selectMinGroupCount": 0
            },
            "rewards": [
              {
                "description": "",
                "iconUrl": "/fe/lol-loot/assets/loot_item_icons/currency_champion.png",
                "isObjectiveBasedReward": false,
                "itemId": "",
                "quantity": 3000,
                "rewardFulfilled": false,
                "rewardGroup": "0",
                "rewardGroupSelected": false,
                "rewardType": "BLUE_ESSENCE",
                "sequence": 1,
                "uniqueName": ""
              }
            ],
            "seriesName": "",
            "startTime": 1544025600000,
            "status": "PENDING",
            "title": "Worlds BTW",
            "viewed": false
        });
        return JSON.stringify(json);
    });

    // Start a new league window that refers to the proxy.
    startUx(args.replace("" + PORT, "" + REPLACE_PORT) + ` "--use-http"`);
})().catch(console.error);