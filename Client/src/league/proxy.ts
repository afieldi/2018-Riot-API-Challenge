import { createServer, IncomingMessage } from "http";
import bodyParser = require("body-parser");
import express = require("express");

import { Server } from "ws";
import WebSocket = require("ws");
import LeagueConnection from "./league";
import {stopLeagueRenderProccess} from "./util";

export default class LCUProxy {
    private app = express();
    private server = createServer(this.app);
    private wss = new Server({ server: this.server });

    private downstreamEdits: [RegExp, (body: string) => string][] = [];

    constructor(private league: LeagueConnection) {
        // Parse every body as text, regardless of actual type.
        this.app.use(bodyParser.text({ type: () => true }));

        // Listen to every HTTP request.
        this.app.all("*", this.onWebRequest);

        // Listen to WS connections.
        this.wss.on("connection", this.onWebsocketRequest);


    }

    adjust(regexp: RegExp, handler: (body: string) => string) {
        this.downstreamEdits.push([regexp, handler]);
    }

    listen(port: number) {
        this.server.listen(port);
        console.log("[+] Listening on 0.0.0.0:" + port + "... ^C to exit.");
    }

    isConnected()
    {
        this.wss.clients.forEach(function each(client)
        {
            console.log(client.readyState === client.OPEN);
            return client.readyState === client.OPEN;
        });
    }

    private onWebRequest = async (req: express.Request, res: express.Response) => {
        // Request response from league.
        const resp = await this.league.request(req.url, req.method, typeof req.body === "string" ? req.body : "");

        // Forward headers.
        resp.headers.forEach((val, name) => {
            // Don't forward content-length, since we might end up modifying it.
            if (name === "Content-Length") return;
            res.header(name, val);
        });

        // Maybe adjust the response, depending on what we registered.
        let toRet = await resp.text();
        for (const [match, fn] of this.downstreamEdits) {
            if (!match.test(req.url)) continue;
            toRet = fn(toRet);
        }

        // Forward body.
        res.status(resp.status === 204 ? 200 : resp.status).send(toRet);
    };

    private onWebsocketRequest = async (client: WebSocket, request: IncomingMessage) => {
        console.log("[+] Got new websocket connection to " + request.url);

        // Buffer any messages that arrive before we establish the forwarding connection.
        const pendingMessages: any[] = [];
        client.on("message", msg => pendingMessages.push(msg));

        // Establish a forwarding connection.
        const forwarding = await this.league.connectWebsocket(request.url!, msg => {
            // If this is a plaintext socket, maybe change it's contents.
            if (request.url === "/") {
                let [ op, ev, payload ] = JSON.parse(<string>msg);
                if (op === 8 && ev === "OnJsonApiEvent" && (payload.eventType === "Update" || payload.eventType === "Create")) {

                    if(payload.uri.includes("/lol-champ-select-legacy/v1/implementation-active")) //signals the start of champ select
                    {
                        console.log(payload.uri);
                        stopLeagueRenderProccess();
                        this.league.request("/riotclient/launch-ux", "POST");
                    }
                    for (const [ match, fn ] of this.downstreamEdits) {
                        if (!match.test(payload.uri)) continue;
                        payload.data = JSON.parse(fn(JSON.stringify(payload.data)));
                    }
                    msg = JSON.stringify([op, ev, payload]);
                }
            }

            if (client.readyState === 1) client.send(msg);
        }, () =>
        {
            client.close();
        });

        // Send the messages we buffered, then remove the listener.
        for (const msg of pendingMessages) forwarding.send(msg);
        client.removeAllListeners("message");

        // Close upstream when downstream is closed.
        client.on("close", () => forwarding.close());

        // Handle messages.
        client.on("message", msg => {
            forwarding.send(msg);
        });
    };

}