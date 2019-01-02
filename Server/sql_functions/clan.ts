export class ClanSQL {
    constructor(private sql) {

    }
    addClan(data:Object, callback:Function) {
        var query:string  = "INSERT INTO clan (entity_id, tag) VALUES (?, ?)";
        this.sql.query(query, [data["entity_id"], data["tag"]], (err, results, fields) => {
            if(err) console.log(err);
            callback();
            
        });
    }
    getAllClans(callback:Function) {
        var query:string = "SELECT * FROM clan";
        this.sql.query(query, [], (err, results, fields) => {
            if(err) throw err;
            callback(results);
        });
    }
}