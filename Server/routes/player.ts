import {} from "../sql_functions/player";
import { SQL } from "../sql_functions";

export function setup(app, sql:SQL) {
    // Adding players
    app.route("/player").put((req, res) => {
        var body:JSON = req.body;
        var query = "INSERT INTO PLAYERS ";
        if(body["display_name"] == undefined) {
            res.json({"message": "A display_name is required"});
            return;
        }
        


        if(body["summoner_id"] == undefined && body["account_id"] == undefined) {
            res.send("need either summoner_id or account_id");
            return;
        }
        if(body["summoner_id"] && body["account_id"]) {
            
        }
    });


    // Summoner ID
    app.route("/player/summoner/:id").get((req, res) => {
        var query:string = "SELECT * FROM player WHERE summoner_id=?";
        sql.player.selectPlayerBySummonerId(req.params.id, (results) => {
            res.send(results);
        });
    });

    // Account ID
    app.route("/player/summoner/:id").get((req, res) => {
        var query:string = "SELECT * FROM player WHERE account_id=?";
        sql.player.selectPlayerByAccountId(req.params.id, (results) => {
            res.send(results);
        });
    });
}