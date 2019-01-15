import LeagueConnection from "./league";
import {Express} from "express";
import {ResponseRequest} from "request";
import {LCUHelper} from "./LCUHelper";

export function setupRoutes(app: Express, leagueconnection: LeagueConnection)
{
    const lcuhelper = new LCUHelper(leagueconnection);
    app.route('/lol/create-lobby').get((req: ResponseRequest, res:any) => {
        lcuhelper.CreateCustomLobby(req.body);
    });
    app.route('/lol/accept-lobby').get((req: ResponseRequest, res:any) => {
        lcuhelper.AcceptLobbyInvite(req.body);
    });
}