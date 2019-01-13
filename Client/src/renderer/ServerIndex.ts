import LeagueConnection from "./league/league";

import { createServer, IncomingMessage } from "http";
import bodyParser = require("body-parser");
import express = require("express");

import { Server } from "ws";
import WebSocket = require("ws");
//import {stopLeagueRenderProccess} from "./util";

export default class Server {
    private app = express();
    private server = createServer(this.app);
    private wss = new Server({ server: this.server });


    constructor() {
        // Parse every body as text, regardless of actual type.
        this.app.use(bodyParser.text({ type: () => true }));

        // Listen to every HTTP request.
        this.app.all("*", this.onWebRequest);

        // Listen to WS connections.
        this.wss.on("connection", this.onWebsocketRequest);
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
    var server = new Server();
    server.listen(SERVER_PORT);
    console.log("server being watched");
    (async () =>
    {
        const league = new LeagueConnection(PORT, PWD);
        try {
            // Wait for user to log in.
            while (true) {
                let resp = await league.request("/lol-summoner/v1/current-summoner");
                if (resp.status !== 404)
                    break;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        catch(exception)
        {
            console.log(exception)
        }


    })().catch(console.error);
}
