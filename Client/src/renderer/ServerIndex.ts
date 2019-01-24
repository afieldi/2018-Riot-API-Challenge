import LeagueConnection from "./league/league";

import bodyParser = require("body-parser");
import express = require("express");

import {setupRoutes} from "./ClientServer/ServerRoutes";
//import {stopLeagueRenderProccess} from "./util";

class ServerProxy {
    private app = express();


    constructor(private leagueconnection: LeagueConnection) {
        // Parse every body as text, regardless of actual type.
        this.app.use(bodyParser.text({type: () => true}));
        this.app.use(function (request:any, response:any, next:any) {
            // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.header("Access-Control-Allow-Headers", "Origin, XRequested-With, Content-Type, Accept ");
            response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS ');
            console.log(request);
            next();
        });
        // Listen to every HTTP request.
        // this.app.all("*", this.onWebRequest);
        this.app.route("/").get((req, res) => {
            res.json({"message": "hello world"});
            console.log(req);
        });
        // Listen to WS connections.
        // this.wss.on("connection", this.onWebsocketRequest);
        setupRoutes(this.app, this.leagueconnection);
    }

    listen(port: number) {
        // this.server.listen(port);
        this.app.listen(port);
        console.log("[+] Listening on 0.0.0.0:" + port + "... ^C to exit.");
    }





}



export async function RunServerWatcher(PORT: number, PWD: string, SERVER_PORT: number)
{
    
    const league = new LeagueConnection(PORT, PWD);
    const server = new ServerProxy(league);
    server.listen(SERVER_PORT);
    console.log("server being watched");
}
