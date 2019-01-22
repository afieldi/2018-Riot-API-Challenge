import LeagueConnection from "../league/league";

export class LCUHelper
{
    constructor(private leagueconnection: LeagueConnection){}

    public CreateCustomLobby(Lobbyname: string )
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
                        "lobbyName":Lobbyname,
                        "lobbyPassword":"PATRICKIN2018"
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

    public async AcceptLobbyInvite(playerjson: any)
    {
        //accept the invite
        const recievedinvites = JSON.parse((await this.leagueconnection.request("/lol-lobby/v2/received-invitations/", "GET")).body.read().toString());
        for(let i = 0; i < recievedinvites.length; i++)
        {
            if(recievedinvites[i]["fromSummonerId"] === playerjson["summonerID"])
            {
                const  inviteID = recievedinvites[i]["invitationId"];
                this.leagueconnection.request("/lol-lobby/v2/received-invitations/" + inviteID + "/accept", "POST");
            }
        }
    }
}
