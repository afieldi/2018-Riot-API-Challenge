export class PlayerSQL {
    constructor(private sql) {

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
}