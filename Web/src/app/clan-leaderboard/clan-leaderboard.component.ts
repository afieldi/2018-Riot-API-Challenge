import { Component, OnInit } from "@angular/core";
import { LeaderboardType } from '../self-defined/enums';

@Component({
    selector: "app-clan-leaderboard",
    templateUrl: "./clan-leaderboard.component.html",
    styleUrls: ["./clan-leaderboard.component.css"]
})
export class ClanLeaderboardComponent implements OnInit {
    clan = LeaderboardType.CLAN;
    constructor() {}

    ngOnInit() {}
}
