import { PlayerSQL } from "./player";
import { MissionSQL } from "./mission";
import { LeaderboardSQL } from "./leaderboard";
import { ClanSQL } from "./clan";
import { WarsSQL } from "./wars";

// This class will be called by external functions
export class SQL {
    // Define all the sub methods
    player:PlayerSQL;
    clan:ClanSQL;
    mission:MissionSQL;
    leaderboard:LeaderboardSQL;
    wars:WarsSQL;
    constructor(sqlConnection:any) {
        // Create all the sub stuff
        this.player = new PlayerSQL(sqlConnection);
        this.mission = new MissionSQL(sqlConnection);
        this.leaderboard = new LeaderboardSQL(sqlConnection);
        this.clan = new ClanSQL(sqlConnection);
        this.wars = new WarsSQL(sqlConnection);
    }
}
