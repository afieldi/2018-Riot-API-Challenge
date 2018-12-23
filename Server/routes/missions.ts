export function setup(app, sql) {
    // Id is SummonerID
    app.route("/missions/summoner/:id").get((req, res) => {
        console.log(req.params)
        var query:string = "SELECT * FROM assigned_mission LEFT JOIN player ON assigned_mission.player = player.entity_id WHERE summoner_id = ?";
        sql.query(query, [req.params.id], (err:Error, results, fields) => {
            if(err) {
                console.log(err);
            }
            console.log(results);
            res.send(results);
        });
    })
    .put((req, res) => {
        res.json({"message": "not yet implemented"});
    });

    app.route("/missions/account/:id").get((req, res) => {
        console.log(req.params)
        var query:string = "SELECT * FROM assigned_mission LEFT JOIN player ON assigned_mission.player = player.entity_id WHERE account_id = ?";
        sql.query(query, [req.params.id], (err:Error, results, fields) => {
            if(err) {
                console.log(err);
            }
            console.log(results);
            res.send(results);
        });
    })
    .put((req, res) => {
        res.json({"message": "not yet implemented"});
    });


    
}

// module.exports = missionsRoute;
