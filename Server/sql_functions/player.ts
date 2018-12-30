export class PlayerSQL {
    constructor(private sql) {

    }
    addPlayer(data:Object, callback:Function) {
        var query:string = "INSERT INTO entity (entity_id, display_name) VALUES (?, ?)";
        // Create general entity
        this.sql.query(query, [data["puuid"], data["name"]], (err, results, fields) => {
            if(err) throw err;

            // Now add player
            query = "INSERT INTO player (puuid, summoner_id, account_id) VALUES (?, ?, ?)";
            this.sql.query(query, [data["puuid"], data["id"], data["accountId"]], (err, results, fields) => {
                if(err) throw err;
                callback();
            });
        });
    }
    selectPlayerByAccountId(accountId:Number, callback:Function) {
        var query:string = "SELECT * FROM player WHERE account_id=?";
        this.sql.query(query, [accountId], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }
    selectPlayerBySummonerId(summoner_id:Number, callback:Function) {
        var query:string = "SELECT * FROM player WHERE summoner_id=?";
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
        var query:string = "SELECT * FROM player WHERE puuid=?";
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