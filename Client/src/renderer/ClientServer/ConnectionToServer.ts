import WebSocket = require("ws");
import fetch, { Response } from "node-fetch";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default class ConnectionToServer {
    constructor(private port: number) {}

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
}