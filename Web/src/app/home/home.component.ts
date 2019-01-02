import { Component, OnInit } from "@angular/core";
import { LeaderboardType } from "../self-defined/enums";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    player = LeaderboardType.PLAYER;
    clan = LeaderboardType.CLAN;
    constructor() {}

    ngOnInit() {}
}
