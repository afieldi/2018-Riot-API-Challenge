import LeagueConnection from "../league/league";

export class LCUHelper
{
    constructor(private leagueconnection: LeagueConnection){}

    public async CreateCustomLobby(Lobbyname: string = "its a lobby", players:any)
    {
        console.log("TRYING TO CREATE LOBBY");
        const data =
            {
                "customGameLobby":
                    {
                        "configuration":
                            {
                                "gameMode":"CLASSIC",
                                "gameMutator":"",
                                "gameServerRegion":"",
                                "mapId":12,
                                "mutators":{"id":6},
                                "spectatorPolicy":"AllAllowed",
                                "teamSize":5
                            },
                        "lobbyName":"Lobbyname",
                        "lobbyPassword":"PATRICKIN2018"
                    },
                "isCustom":true
            };
        await this.leagueconnection.request("/lobby/v2/lobby", "POST", data);
        // this.InviteToLobby(players);
    }

    public InviteToLobby(players: any)
    {
        const data = [
            {
              "state": "Requested",
              "toSummonerId": 0
            }
        ];

        data[0]["toSummonerId"] = parseInt(players["id"]); //change to whatever arek passes me
        this.leagueconnection.request("/lol-lobby/v2/eog-invitations", "POST", data);
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
