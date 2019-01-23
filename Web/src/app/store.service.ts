import { Injectable } from "@angular/core";
import { HttpClient } from "../../node_modules/@angular/common/http";
import { LeaderboardType } from './self-defined/enums';

@Injectable({
    providedIn: "root"
})
export class StoreService {
    host = "http://localhost:8000";
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
}
