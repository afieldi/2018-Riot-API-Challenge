import {} from "../sql_functions/player";
import { SQL } from "../sql_functions";
import { riotApi } from "../globals";
var requestIp = require('request-ip');

export function setup(app, sql:SQL) {
    // Adding players
    app.route("/player").put((req, res) => {
        var body:Object = req.body;
        if(body["display_name"] == undefined) {
            res.json({"message": "A display_name is required"});
            return;
        }
        console.log(requestIp.getClientIp(req));
        if(body["clan_tag"] != undefined && body["clan_tag"].length >= 1 && body["clan_name"] != undefined && body["clan_name"].length >= 1) {
            // They have a clan
            sql.clan.addClan(body, () => {
                
                // Add player
                sql.player.addPlayer(body, () => {
                    sql.player.setIp(body["puuid"], body["ip"], () => {
                        // Add player to clan
                        sql.clan.addPlayer(body["clan_tag"], body["puuid"], () => {
                            console.log("Player added");
                            res.json({"message": "Player added"});
                            return;
                        });
                    });
                });
            });
        }
        else {
            // They don't have a clan
            sql.player.addPlayer(body, () => {
                sql.player.setIp(body["puuid"], body["ip"], () => {
                    console.log("Player added");
                    res.json({"message": "Player added"});
                    return;
                });
            });
        }

        
    });

    // Summoner ID
    app.route("/player/summoner/:id").get((req, res) => {
        sql.player.selectPlayerBySummonerId(req.params.id, (results) => {
            res.send(results);
        });
    });

    // Account ID
    app.route("/player/account/:id").get((req, res) => {
        sql.player.selectPlayerByAccountId(req.params.id, (results) => {
            res.send(results);
        });
    });

    // Account ID
    app.route("/player/puuid/:id").get((req, res) => {
        sql.player.selectPlayerByPuuid(req.params.id, (results) => {
            res.send(results);
        });
    });

    app.route("/player/challenge/:id").get((req, res) => {
        sql.player.getChallengePlayers(req.params.id, (results) => {
            res.send(results);
        })
    });
}