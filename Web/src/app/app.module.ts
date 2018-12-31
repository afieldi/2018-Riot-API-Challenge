import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LeaderboardsComponent } from "./leaderboards/leaderboards.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";
import { HttpClientModule } from '../../node_modules/@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LeaderboardsComponent,
        LeaderboardComponent
    ],
    imports: [BrowserModule, 
            AppRoutingModule,
            HttpClientModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
