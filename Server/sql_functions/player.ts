export class PlayerSQL {
    constructor(private sql) {

    }
    addPlayer(data:Object, callback:Function) {
        var query:string = "INSERT INTO entity (entity_id, display_name) VALUES (?, ?)";
        // Create general entity
        this.sql.query(query, [data["puuid"], data["display_name"]], (err, results, fields) => {
            if(err){
                console.log(err);
            }

            // Now add player
            query = "INSERT INTO player (entity_id, summoner_id, account_id) VALUES (?, ?, ?)";
            this.sql.query(query, [data["puuid"], data["id"], data["accountId"]], (err, results, fields) => {
                if(err) console.log(err);
                callback();
                return;
            });
        });
    }

    setIp(player:string, ip:string, callback:Function) {
        var query:string = "UPDATE player SET ip = ? WHERE entity_id = ?";
        this.sql.query(query, [ip, player], (err, results, fields) => {
            if(err) console.log(err);
            callback();
            return;
        });
    }
    addToClan(player_id:string, clan_id:string, callback:Function) {
        var query:string = "INSERT INTO clan_member (clan_id, player_id) VALUES (?, ?)";
        this.sql.query(query, [clan_id, player_id], (err, results, fields) => {
            if(err) console.log(err);
            callback();
            return;
        });
    }
    selectPlayerByAccountId(accountId:Number, callback:Function) {
        var query:string = "SELECT * FROM player LEFT JOIN entity ON (entity.entity_id = player.entity_id) WHERE account_id=?";
        this.sql.query(query, [accountId], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
            return;
        });
    }
    selectPlayerBySummonerId(summoner_id:Number, callback:Function) {
        var query:string = "SELECT * FROM player LEFT JOIN entity ON (entity.entity_id = player.entity_id) WHERE summoner_id=?";
        this.sql.query(query, [summoner_id], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }
    selectPlayerByPuuid(puuid:String, callback:Function) {
        var query:string = "SELECT * FROM player LEFT JOIN entity ON (entity.entity_id = player.entity_id) WHERE player.entity_id=?";
        this.sql.query(query, [puuid], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }
}