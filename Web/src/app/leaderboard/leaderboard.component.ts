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
    title:string = "";
    leaderboard:Array<Object>;
    constructor(private store:StoreService) {
        
    }

    ngOnInit() {
        this.title = "Leaderboard for " + this.type.toLowerCase() + "s";
        console.log(this.type);
        this.store.getLeaderboard(this.type, 100, (leaderboard) => {
            console.log(leaderboard);
            this.leaderboard = leaderboard;
        });
    }
}
