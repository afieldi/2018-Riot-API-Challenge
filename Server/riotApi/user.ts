const request = require("request");
export class userAPI {
    constructor(private host:string, private headers:object) {

    }
    getUser(summonerName:string, callback:Function) {
        var options = {
            url: this.host + `/lol/summoner/v4/summoners/by-name/${summonerName}`,
            headers: this.headers
        }
        request.get(options, (err, res, data) => {
            callback(JSON.parse(data));
        });
    }
}