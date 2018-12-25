export class MissionSQL {
    constructor(private sql) {

    }
    getMissionsByAccountId(accountId:Number, callback:Function) {
        var query:string = "SELECT * FROM assigned_mission LEFT JOIN player ON assigned_mission.player = player.entity_id WHERE summoner_id = ?";
        this.sql.query(query, [accountId], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }
    getMissionsBySummonerId(summoner_id:Number, callback:Function) {
        var query:string = "SELECT * FROM assigned_mission LEFT JOIN player ON assigned_mission.player = player.entity_id WHERE account_id = ?";
        this.sql.query(query, [summoner_id], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }
    updateMissionProgress(mission_id, new_progress, callback:Function) {
        var query:string = "UPDATE assigned_mission SET current_progress = ? WHERE mission_id = ?";
        this.sql.query(query, [new_progress, mission_id], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }
}