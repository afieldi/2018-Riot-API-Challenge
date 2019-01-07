export class ClanSQL {
    constructor(private sql) {

    }
    addClan(data:Object, callback:Function) {
        // First check if the clan already exists
        var query:string = "SELECT 1 FROM clan WHERE entity_id=?";
        this.sql.query(query, [data["clan_tag"]], (err, results:any[], fields) => {
            if(err) {
                throw err;
            }
            if(results.length != 0) {
                callback();
                return;
            }
            // If clan does not exist, create new one
            // Add clan to entity
            query = "INSERT INTO entity VALUES (?, ?)";
            this.sql.query(query, [data["clan_tag"], data["clan_name"]], (err, results:any[], fields) => {
                if(err) console.log(err);

                // Add clan to clan table
                query = "INSERT INTO clan (entity_id) VALUES (?)";
                this.sql.query(query, [data["clan_tag"], data["clan_name"]], (err, results, fields) => {
                    if(err) console.log(err);
                    callback();
                });
            });
        });
        
    }
    getAllClans(callback:Function) {
        var query:string = "SELECT * FROM clan";
        this.sql.query(query, [], (err, results, fields) => {
            if(err) throw err;
            callback(results);
        });
    }

    addPlayer(clanTag:string, puuid:string, callback:Function) {
        console.log(clanTag + ":" + puuid);
        var query:string = "INSERT INTO clan_member(clan_id, player_id) VALUES(?, ?)";
        this.sql.query(query, [clanTag, puuid], (err, results, fields) => {
            if(err) throw err;
            callback();
        });
    }
}