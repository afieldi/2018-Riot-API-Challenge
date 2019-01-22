import LeagueConnection from "../league/league";
import {Express} from "express";
import {ResponseRequest} from "request";
import {LCUHelper} from "./LCUHelper";

export function setupRoutes(app: Express, leagueconnection: LeagueConnection)
{
    const lcuhelper = new LCUHelper(leagueconnection);
    app.route('/lol/create-lobby').get((req: ResponseRequest, res:any) => {
        lcuhelper.CreateCustomLobby(JSON.parse(req.body.toString())["toSummonerId"].toString());
    });
    app.route('/lol/accept-lobby').get((req: ResponseRequest, res:any) => {
        lcuhelper.AcceptLobbyInvite(req.body);
    });

}