import { Component, OnInit } from "@angular/core";
import { LeaderboardType } from '../self-defined/enums';

@Component({
    selector: "app-player-leaderboard",
    templateUrl: "./player-leaderboard.component.html",
    styleUrls: ["./player-leaderboard.component.css"]
})
export class PlayerLeaderboardComponent implements OnInit {
    player = LeaderboardType.PLAYER;
    constructor() {}

    ngOnInit() {}
}
