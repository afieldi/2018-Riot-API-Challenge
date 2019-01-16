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
        //todo
    }

    public AcceptLobbyInvite(player: any)
    {
        //todo
    }
}
