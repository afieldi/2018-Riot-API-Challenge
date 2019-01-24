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

    setupLobby(url:string, otherUser:object, callback:Function) {
        var options = {
            body: {
                "toSummonerId": otherUser
            }
        }
        this.http.put(url, options).subscribe((res) => {
            callback(res);
        });
    }
    acceptLobby(url:string, from:string, callback:Function) {
        this.http.put(url, {"acceptSummonerId": from}).subscribe((res) => {
            callback(res);
        });
    }

    checkStatus(callback:Function) {
        this.checkClient((data) => {
            if(data.error || data.errorCode) {
                callback(-1);
                return;
            }
            var url = "http://localhost:8000/war/status/" + data.puuid;
            this.http.get(url).subscribe((res) => {
                callback(res["code"]);
            });
        });
    }

    registerForClanWar(callback:Function) {
        this.checkClient((data) => {
            if(data.error || data.errorCode) {
                callback(-1);
                return;
            }
            var url = `${this.host}/war/register/` + data.puuid;
            // var url = "http://localhost:8000/war/register/" + data.puuid;
            this.http.put(url, {}).subscribe((res) => {
                callback();
            });
        });
    }
}
