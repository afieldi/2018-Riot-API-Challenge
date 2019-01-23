import LeagueConnection from "./league/league";
import {
    getUxArguments, startFoundation, startLeagueRenderNoArgs, startUx, stopLeague,
    stopLeagueRenderProccess
} from "./league/util";
import LCUProxy from "./league/proxy";
import fs = require("fs");
import ConnectionToServer from "./ClientServer/ConnectionToServer";

const LEAGUE_PATH = 'C:/Riot Games/League of Legends/';

const SERVER_IP ='http://ec2-35-182-253-71.ca-central-1.compute.amazonaws.com:8080';

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

            let missionsData: [] = await GetMissionData(league);
            proxy.adjust(/lol-missions\/v1\/missions/, data => {
                let json: Array<Object> = JSON.parse(data);
                for(var i = 0; i < missionsData.length; i++)
                {
                    json.unshift(missionsData[i]);
                }
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

async function GetMissionData(league: LeagueConnection) : Promise<any>
{
        console.log("trying to connect to server");
        const connectionToServer = new ConnectionToServer(SERVER_IP);
        console.log("connected to server");
        //let resp = await league.request("/lol-summoner/v1/current-summoner");
        //const puuid = JSON.parse(resp.body.read().toString())["puuid"];
        const puuid = "021yeCQS9RfiDeTOXSIj3vruMFua5lQ2GM0DI5E6xqWY7iBdPh";
        const missionsdataresponse = await connectionToServer.request(`/missions/user/${puuid}`);
        const missiondata = JSON.parse(missionsdataresponse.body.read().toString());
        console.log(missiondata);
        var arrayOfMissions  = [];
        for(var i = 0; i < missiondata.length; i++)
        {
            var tempJSON =
                {
                    "backgroundImageUrl": "",
                    "celebrationType": "VIGNETTE",
                    "clientNotifyLevel": "ALWAYS",
                    "completedDate": -1,
                    "completionExpression": "",
                    "cooldownTimeMillis": -1,
                    "description": missiondata[i]["description"],
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
                    "helperText": missiondata[i]["type"] + " Mission for: " + missiondata[i]["reward"] + " Points" ,
                    "iconImageUrl": missiondata[i]["icon_path"],
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
                                "currentProgress": missiondata[i]["curent_progress"],
                                "lastViewedProgress": 0,
                                "totalCount": missiondata[i]["max_progress"]
                            },
                            "rewardGroups": [],
                            "sequence": 1,
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
                            "quantity": missiondata[i]["reward"],
                            "rewardFulfilled": false,
                            "rewardGroup": "0",
                            "rewardGroupSelected": false,
                            "rewardType": "SUMMONER_ICON",
                            "sequence": 1,
                            "uniqueName": ""
                        }
                    ],
                    "seriesName": "",
                    "startTime": 1544025600000,
                    "status": "PENDING",
                    "title": missiondata[i]["title"],
                    "viewed": true
                };
            arrayOfMissions.push(tempJSON)
        }
        return arrayOfMissions
}