import { Injectable } from "@angular/core";
import { HttpClient } from "../../node_modules/@angular/common/http";
import { LeaderboardType } from './self-defined/enums';

@Injectable({
    providedIn: "root"
})
export class StoreService {
    host = "http://ec2-35-182-253-71.ca-central-1.compute.amazonaws.com:8000";
    constructor(private http: HttpClient) {}

    getLeaderboard(type:LeaderboardType, numb:Number = 50, callback:Function) {
        var uri = this.host + "/leaderboard/current/" + type.toLowerCase() + '/' + numb;
        this.http.get(uri).subscribe((data) => {
            callback(data);
        });
    }

    getClanGames(war:number=1, callback:Function) {
        var uri = this.host + "/leaderboard/current/" + war;
        this.http.get(uri).subscribe((data) => {
            callback(data);
        });
    }

    getFighters(user:string = "Earleking", callback:Function) {
        var uri = this.host + "/player/challenge/" + user;
        this.http.get(uri).subscribe((data) => {
            callback(data);
        });
    }

    checkClient(callback:Function) {
        var uri = "http://localhost:4800/lol/me"
        this.http.get(uri).subscribe((data) => {
            callback(data);
        }, (err) => {
            callback({"error": 400});
        });
    }
}
