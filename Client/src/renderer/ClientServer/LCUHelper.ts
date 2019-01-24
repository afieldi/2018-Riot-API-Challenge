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
                                "gameMode":"ARAM",
                                "gameMutator":"",
                                "gameServerRegion":"",
                                "mapId":12,
                                "mutators":{"id":6},
                                "spectatorPolicy":"AllAllowed",
                                "teamSize":1
                            },
                        "lobbyName":Lobbyname,
                        "lobbyPassword":"PATRICKIN2018"
                    },
                "isCustom":true
            };

        await this.leagueconnection.request("/lol-lobby/v2/lobby", "POST", data);

        this.InviteToLobby(players);
    }

    public async InviteToLobby(players: any)
    {

        delay(5000); //timing hack
        const data = [
            {
              "state": "Requested",
              "toSummonerId": players["body"]["toSummonerId"]
            }
        ];

        await this.leagueconnection.request("/lol-lobby/v2/lobby/invitations", "POST", data);

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

async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}