export class MissionSQL {
    constructor(private sql) {

    }
    getMissionsByAccountId(accountId:number, callback:Function) {
        var query:string = "SELECT * FROM assigned_mission LEFT JOIN player ON assigned_mission.entity = player.entity_id WHERE summoner_id = ?";
        this.sql.query(query, [accountId], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }

    getMissionsBySummonerId(summoner_id:number, callback:Function) {
        var query:string = "SELECT * FROM assigned_mission LEFT JOIN player ON assigned_mission.entity = player.entity_id WHERE account_id = ?";
        this.sql.query(query, [summoner_id], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }

    getMissionsByPuuid(puuid:number, callback:Function) {
        var query:string = `SELECT title, description, reward, type, curent_progress, max_progress, date_assigned, duration_hours, icon_path
        FROM assigned_mission am
        LEFT JOIN mission m ON am.mission_id = m.mission_id 
        LEFT JOIN clan_member cm ON am.entity = cm.player_id or cm.clan_id = am.entity
        WHERE cm.player_id = ?
        AND active = 'ACTIVE'`;
        this.sql.query(query, [puuid], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }

    updateMissionProgress(mission_id:number, new_progress:number, callback:Function) {
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
    assignToAllPlayers(mission_id:number, callback:Function) {
        var query:string = "INSERT INTO assigned_mission () SELECT mission_id, 0, max_progress, ";
    }
}