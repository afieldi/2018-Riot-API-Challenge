import { Component, OnInit, Input } from "@angular/core";
import { LeaderboardType } from '../self-defined/enums';
import { StoreService } from '../store.service';

@Component({
    selector: "app-leaderboard",
    templateUrl: "./leaderboard.component.html",
    styleUrls: ["./leaderboard.component.css"]
})
export class LeaderboardComponent implements OnInit {
    @Input() type:LeaderboardType;
    constructor(private store:StoreService) {}

    ngOnInit() {
        this.store.getLeaderboard(LeaderboardType.PLAYER, 100, () => {

        });
    }
}
