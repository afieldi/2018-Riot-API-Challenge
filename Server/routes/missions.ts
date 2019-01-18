import { SQL } from "../sql_functions";

export function setup(app, sql:SQL) {
    // Id is SummonerID
    app.route("/missions/summoner/:id").get((req, res) => {
        sql.mission.getMissionsBySummonerId(req.params.id, (results) => {
            res.send(results);
        });
    })
    .put((req, res) => {
        res.json({"message": "not yet implemented"});
    });

    app.route("/missions/account/:id").get((req, res) => {
        sql.mission.getMissionsByAccountId(req.params.id, (results) => {
            res.send(results);
        });
    })
    .put((req, res) => {
        res.json({"message": "not yet implemented"});
    });

    app.route("/missions/puuid/:id").get((req, res) => {
        sql.mission.getMissionsByPuuid(req.params.id, (results) => {
            res.send(results);
        });
    })
    .put((req, res) => {
        res.json({"message": "not yet implemented"});
    });

    app.route("/missions/update/:id").put((req, res) => {
        // Only accepts an update to the quantity
        if(req.body.current_progress == undefined) {
            res.json({"message": "Please supply the new progress as current_progress"});
        }
        sql.mission.updateMissionProgress(req.params.id, req.body.current_progress, (results) => {
            res.send(results);
        });
    });
    
}

// module.exports = missionsRoute;
