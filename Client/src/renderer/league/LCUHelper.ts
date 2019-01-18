import LeagueConnection from "./league";

export class LCUHelper
{
    constructor(private leagueconnection: LeagueConnection){}

    public CreateCustomLobby()
    {
        const data =
            {
                "customGameLobby":
                    {
                        "configuration":
                            {
                                "gameMode":"CLASSIC",
                                "gameMutator":"",
                                "gameServerRegion":"",
                                "mapId":11,
                                "mutators":{"id":6},
                                "spectatorPolicy":"AllAllowed",
                                "teamSize":5
                            },
                        "lobbyName":"Name",
                        "lobbyPassword":null
                    },
                "isCustom":true
            };
        this.leagueconnection.request("lobby/v1/lobby", "POST", data)
    }

    public InviteToLobby(players: any)
    {
        const data = {
            "eligibility": {
                "eligible": true,
                "queueId": -1,
                "restrictions": []
            },
            "errorType": "",
            "fromSummonerId": 0,
            "fromSummonerName": "",
            "id": "",
            "invitationMetaData": null,
            "state": "Pending",
            "timestamp": "",
            "toSummonerId": 0,
            "toSummonerName": ""
        };

        for(let player of players)
        {
            data["toSummonerId"] = player["summonerID"]; //change to whatever arek passes me
            data["id"] = player["summonerID"].toString();
            this.leagueconnection.request("lobby/v1/lobby", "POST", data)
        }
    }

    public AcceptLobbyInvite(inviteID: string)
    {
        this.leagueconnection.request("/lol-lobby/v2/received-invitations/" + inviteID + "/accept", "POST")
    }
}
