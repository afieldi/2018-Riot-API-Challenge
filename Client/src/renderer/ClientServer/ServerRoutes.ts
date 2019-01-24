import LeagueConnection from "../league/league";
import {Express} from "express";
import {ResponseRequest} from "request";
import {LCUHelper} from "./LCUHelper";

export function setupRoutes(app: Express, leagueconnection: LeagueConnection)
{
    const lcuhelper = new LCUHelper(leagueconnection);
    app.route('/lol/create-lobby').put((req: any, res:any) => {
        lcuhelper.CreateCustomLobby("FUCKING JOSH", req.body["toSummonerId"]);
        res.send("");
    });
    app.route('/lol/accept-lobby').put((req: any, res:any) => {
        lcuhelper.AcceptLobbyInvite(JSON.parse(req.body));
        res.send("");
    });
    app.route("/lol/me").get((req, res) => {
        leagueconnection.request("/lol-summoner/v1/current-summoner").then((resp) => {
            const currentsummoner = JSON.parse(resp.body.read().toString());
            res.send(currentsummoner);
        });
    });

}