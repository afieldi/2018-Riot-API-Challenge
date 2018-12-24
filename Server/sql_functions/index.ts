import { PlayerSQL } from "./player";
import { MissionSQL } from "./mission";

// This class will be called by external functions
export class SQL {
    // Define all the sub methods
    player:PlayerSQL;
    mission:MissionSQL;
    constructor(sqlConnection:any) {
        // Create all the sub stuff
        this.player = new PlayerSQL(sqlConnection);
        this.mission = new MissionSQL(sqlConnection);
    }
}
