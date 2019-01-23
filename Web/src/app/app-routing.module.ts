import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayerLeaderboardComponent } from './player-leaderboard/player-leaderboard.component';
import { ClanLeaderboardComponent } from './clan-leaderboard/clan-leaderboard.component';
import { DownloadComponent } from './download/download.component';
import { ChallengeComponent } from './challenge/challenge.component';

const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "player", component: PlayerLeaderboardComponent},
    {path: "clan", component: ClanLeaderboardComponent},
    {path: "download", component: DownloadComponent},
    {path: "challenge", component: ChallengeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
