import LeagueConnection from "./league/league";
import {
    getUxArguments, startFoundation, startLeagueRenderNoArgs, startUx, stopLeague,
    stopLeagueRenderProccess
} from "./league/util";
import LCUProxy from "./league/proxy";
import fs = require("fs");

const LEAGUE_PATH = 'C:/Riot Games/League of Legends/';

export async function RunProxy(PORT: number, REPLACE_PORT: number, PWD: string)
{
    // LOCKFILE: LeagueClient:20904:63769:3UMgPMIfav6dqRUHowD0Aw:https
    console.log(`LOCKFILE: LeagueClient:1:${PORT}:${PWD}:https`);
    console.log(`PROXY PORT: ${REPLACE_PORT}`);
    (async () => {
        try {
            process.chdir('C:/Riot Games/League of Legends/');
            fs.writeFileSync(LEAGUE_PATH + "lockfile", `LeagueClient:1:${PORT}:${PWD}:https`);

            // Stop an existing league process, if needed. Then start league and find the arguments.
            stopLeague();
            startFoundation(PORT, PWD);

            await new Promise(x => setTimeout(x, 5000));

            // Connect to league and load the normal window.
            const league = new LeagueConnection(PORT, PWD);
            await league.request("/riotclient/launch-ux", "POST");

            //startLeagueRenderNoArgs(); //more flakey version

            let args = null;
            while (!args) {
                args = await getUxArguments();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Wait for user to log in.
            while (true) {
                let resp = await league.request("/lol-summoner/v1/current-summoner");
                if (resp.status !== 404)
                    break;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Kill UX
            await league.request("/riotclient/kill-ux", "POST");
            //stopLeagueRenderProccess(); //more flakey version
            // Configure the proxy.
            const proxy = new LCUProxy(league);
            proxy.listen(REPLACE_PORT);




            proxy.adjust(/lol-missions\/v1\/missions/, data => {
                let json: Array<Object> = JSON.parse(data);
                json.unshift(GetMissionData);
                return JSON.stringify(json);
            });

            // Start a new league window that refers to the proxy.
            startUx(args.replace("" + PORT, "" + REPLACE_PORT) + ` "--use-http"`);
        }
        catch(exception)
        {
            console.log("Exception Hit");
            console.log(exception)
        }

    })().catch(console.error);
}

function GetMissionData() : any
{


        return {
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
            "iconImageUrl": "/fe/lol-missions/events/images/missions/leveling/MissionIcon-WOTD.png",
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
                    "description": "Kill 7 champions",
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
                    "description": "Kill 3 dragons",
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
                    "quantity": 10,
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
            "title": "I Want To Be The Very Best",
            "viewed": true
        };
}