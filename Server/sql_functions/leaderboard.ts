export class LeaderboardSQL {
    constructor(private sql) {

    }

    getCurrentPlayerLeaderboard(callback:Function) {
        var query:string = "SELECT * FROM leaderboard l, leaderboard_entry le, player p where l.leaderboard_id = le.leaderboard_id and le.entry_id = p.entity_id";
        this.sql.query(query, [], (err, results, fields) => {
            if(err) {
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }    

    getCurrentClanLeaderboard(callback:Function) {
        var query:string = "SELECT * FROM leaderboard l, leaderboard_entry le, clan c where l.leaderboard_id = le.leaderboard_id and le.entry_id = c.entity_id";
        this.sql.query(query, [], (err, results, fields) => {
            if(err) {
                callback({"message": "Sorry there was an unexpected error"});
                return;
            }
            callback(results);
        });
    }

    addNewLeaderboards(callback:Function) {
        // Deactive past leaderboards if they are out of date
        this.deactivatePastLeaderboards(() => {
            // Try to create a new clan leaderboard if needed
            this.tryToCreateNewLeaderboard("CLAN", () => {
                // Try to create a new clan leaderboard if needed
                this.tryToCreateNewLeaderboard("PLAYER", () => {
                    callback();
                })
            });         
        });
       
    }


    private tryToCreateNewLeaderboard(type:string, callback:Function) {
        var date = new Date();
        var query:string = "SELECT 1 FROM leaderboard WHERE month=? AND year=? AND type=?";
        this.sql.query(query, [date.getMonth(), date.getFullYear(), type], (err, results:any[], fields) => {
            if(results.length == 0) {
                // There is no one for the current month!
                var newQuery:string = "INSERT INTO leaderboard (leaderboard_title, month, year, active, type) VALUES (?, ?, ?, ?, ?)";
                var sqlValues:any[] = [`${type} Leaderboard for Year ${date.getFullYear()}, Month ${date.getMonth()}`, date.getMonth(), date.getFullYear(), 1, type];
                // Create new leaderboard
                this.sql.query(newQuery, sqlValues, (err, results:any[], fields) => {
                    if(err)
                        throw err;
                    // Get new leaderboard ID
                    this.getLeaderboardId(type, (row) => {
                        this.populateLeaderboardEntries(row.leaderboard_id, type, (back) => {
                            console.log("created all");
                            callback();
                        });
                    });
                });
            }
            else
                callback();
        });
    }

    getLeaderboardId(type:string, callback:Function) {
        var query:string = "SELECT 1 from leaderboard WHERE type=?";
        this.sql.query(query, [type], (err, results, fields) => {
            if(results.length != 1) {
                throw "No Leaderboard found for type"
            }
            callback(results[0]);
        });
    }

    private deactivatePastLeaderboards(callback:Function) {
        var query:string = "UPDATE leaderboard SET active=0 WHERE month <> ? AND year <> ? AND active=1"
        var date = new Date();
        this.sql.query(query, [date.getMonth(), date.getFullYear()], (err, results:any[], fields) => {
            if(err) {
                throw err;
            }
            callback();
        });
    }

    private populateLeaderboardEntries(leaderboard_id:number, type:string, callback:Function) {
        var query:string = "INSERT INTO leaderboard_entry (leaderboard_id, entity) SELECT ?, entity_id FROM ?";
        this.sql.query(query, [leaderboard_id, type.toLowerCase()], (err, results, fields) => {
            if(err) throw err;
            callback(results); 
        });
    }

    private populateLeaderboardEntriesPlayer(leaderboard_id:number, callback:Function) {
        var query:string = "INSERT INTO leaderboard_entry (leaderboard_id, entity) SELECT ?, entity_id FROM player";
        this.sql.query(query, [leaderboard_id], (err, results, fields) => {
            if(err) throw err;
            callback(results); 
        });
    }
}