import { Component, OnInit } from "@angular/core";
import { LeaderboardType } from "../self-defined/enums";
import {Router} from "@angular/router";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    player = LeaderboardType.PLAYER;
    clan = LeaderboardType.CLAN;

    ngOnInit() {}

    constructor(private router:Router) {

    }

    toPlayer() {
        this.router.navigate(["/player"]);
    }

    toClan() {
        this.router.navigate(["/clan"]);
    }

}
