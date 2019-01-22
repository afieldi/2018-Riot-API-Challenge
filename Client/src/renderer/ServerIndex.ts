import LeagueConnection from "./league/league";

import { createServer, IncomingMessage } from "http";
import bodyParser = require("body-parser");
import express = require("express");

import { Server } from "ws";
import WebSocket = require("ws");
import {setupRoutes} from "./ClientServer/ServerRoutes";
//import {stopLeagueRenderProccess} from "./util";

class ServerProxy {
    private app = express();
    private server = createServer(this.app);
    private wss = new Server({ server: this.server });


    constructor(private leagueconnection: LeagueConnection) {
        // Parse every body as text, regardless of actual type.
        this.app.use(bodyParser.text({type: () => true}));

        // Listen to every HTTP request.
        this.app.all("*", this.onWebRequest);

        // Listen to WS connections.
        this.wss.on("connection", this.onWebsocketRequest);
        setupRoutes(this.app, this.leagueconnection);
    }

    listen(port: number) {
        this.server.listen(port);
        console.log("[+] Listening on 0.0.0.0:" + port + "... ^C to exit.");
    }

    private onWebRequest = async (req: express.Request, res: express.Response) => {
    };

    private onWebsocketRequest = async (client: WebSocket, request: IncomingMessage) => {
    };


}



export async function RunServerWatcher(PORT: number, PWD: string, SERVER_PORT: number)
{
    const league = new LeagueConnection(PORT, PWD);
    const server = new ServerProxy(league);
    server.listen(SERVER_PORT);
    console.log("server being watched");
}
