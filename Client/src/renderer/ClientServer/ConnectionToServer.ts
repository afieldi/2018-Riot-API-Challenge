import WebSocket = require("ws");
import fetch, { Response } from "node-fetch";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default class ConnectionToServer {
    constructor(private ip: string,  ) {}

    public async request(url: string, method = "GET", body?: string | object): Promise<Response> {
        console.log(`${this.ip}${url}`);
        return fetch(`${this.ip}${url}`, {
            headers: {
                Authorization: "Basic",
                "Content-Type": "application/json"
            },
            method,
            body: typeof body === "string" ? body : JSON.stringify(body)
        });
    }
}