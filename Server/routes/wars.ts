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
    app.route("/war/players/get").get((req, res) => {
        sql.wars.getPlayers((results) => {
            res.send(results); 
        });
    });
}