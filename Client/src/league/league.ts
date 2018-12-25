import WebSocket = require("ws");
import fetch, { Response } from "node-fetch";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default class LeagueConnection {
    constructor(private port: number, private password: string) {}

    public async request(url: string, method = "GET", body?: string | object): Promise<Response> {
        return fetch(`https://127.0.0.1:${this.port}${url}`, {
            headers: {
                Authorization: "Basic " + new Buffer("riot:" + this.password).toString("base64"),
                "Content-Type": "application/json"
            },
            method,
            body: typeof body === "string" ? body : JSON.stringify(body)
        });
    }

    public connectWebsocket(url: string, handler: (msg: WebSocket.Data) => any, closeHandler?: () => void): Promise<{ send: (args: any) => void, close: () => void }> {
        const socket = new WebSocket(`wss://riot:${this.password}@127.0.0.1:${this.port}${url}`, "wamp");

        return new Promise(resolve => {
            socket.onopen = () => {
                resolve({
                    send: msg => {
                        if (socket.readyState !== 1) console.error("SERVER NO LONGER IN ACTION");
                        socket.readyState === 1 && socket.send(msg)
                    },
                    close() {
                        socket.close();
                    }
                });
            };
            socket.onmessage = d => { /*console.log(d.data);*/ handler(d.data); };
            socket.onclose = () => {
                console.log("[-] Closed upstream connection to " + url);
                closeHandler && closeHandler();
            };
        });
    }
}