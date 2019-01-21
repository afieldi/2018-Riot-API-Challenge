import { SQL } from "../sql_functions";

export function setup(app, sql:SQL) {
    app.route("/war/new").put((req, res) => {
        
    });
    app.route("/war/register/player/:puuid").put((req, res) => {
        sql.wars.registerPlayer(req.params["puuid"], (msg) => {
            res.json(msg);
        }); 
    });
    app.route("/war/signup/start").put((req, res) => {
        sql.wars.openSignUp((msg) => {
            res.json(msg);
        });
    });
    app.route("/war/players/get/:id").get((req, res) => {
        sql.wars.getPlayers(req.params.id, (results) => {
            res.send(results); 
        });
    });
    app.route("/war/game/add").post((req, res) => {
        var matches = JSON.parse(req.body.players);
        for(var match in matches) {
            var players = matches[match];
            sql.wars.createGame(players[0][0]["clan_id"], players[1][0]["clan_id"], (game_id) => {
                for(var team in players) {
                    for (var player in players[team]) {
                        sql.wars.addPLayerToGame(players[team][player]["entity_id"], game_id, team, () => {
    
                        });
                    }
                }
            });
        }
        res.send("Added game")
    });
}