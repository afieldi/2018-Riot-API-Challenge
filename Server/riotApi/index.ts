import { userAPI } from "./user";

export class RiotApi {
    private host = "https://na1.api.riotgames.com";

    public user:userAPI;
    constructor(private key:string) {
        // Create the header access
        var headers = {
            "X-Riot-Token": key
        }

        // Setup child classes
        this.user = new userAPI(this.host, headers);
    }
}