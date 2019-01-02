import { Injectable } from "@angular/core";
import { HttpClient } from "../../node_modules/@angular/common/http";
import { LeaderboardType } from './self-defined/enums';

@Injectable({
    providedIn: "root"
})
export class StoreService {
    host = "http://localhost:1000"
    constructor(private http: HttpClient) {}
    
    getLeaderboard(type:LeaderboardType, numb:Number = 100, callback:Function) {
        var uri = this.host + "/leaderboard/current/" + type.toLowerCase();
        this.http.get(uri).subscribe((data) => {
            console.log(data);
            callback(data);
        });
    }
}
