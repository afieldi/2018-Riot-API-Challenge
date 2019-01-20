import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { PlayerLeaderboardComponent } from './player-leaderboard/player-leaderboard.component';
import { ClanLeaderboardComponent } from './clan-leaderboard/clan-leaderboard.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LeaderboardComponent,
        PlayerLeaderboardComponent,
        ClanLeaderboardComponent
    ],
    imports: [BrowserModule, 
            AppRoutingModule,
            HttpClientModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
