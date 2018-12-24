export function setup(app, sql) {
    app.route('/leaderboard/current/players').get((req, res) => {
        var query:string = "SELECT * FROM leaderboard l, leaderboard_entry le, player p where l.leaderboard_id = le.leaderboard_id and le.entry_id = p.entity_id";
        sql.query(query, [], (err, results, fields) => {
            if(err) {
                console.log(err);
                res.json({"message": "Sorry there was an unexpected error"});
                return;
            }
            res.send(results);
        });
    });

    app.route('/leaderboard/current/clans').get((req, res) => {
        var query:string = "SELECT * FROM leaderboard l, leaderboard_entry le, clan c where l.leaderboard_id = le.leaderboard_id and le.entry_id = c.entity_id";
        sql.query(query, [], (err, results, fields) => {
            if(err) {
                console.log(err);
                res.json({"message": "Sorry there was an unexpected error"});
                return;
            }
            res.send(results);
        });
    });
}