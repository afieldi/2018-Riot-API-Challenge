import { SQL } from "../sql_functions";

export function setup(app, sql:SQL) {
    app.route('/leaderboard/current/player/:number').get((req, res) => {
        sql.leaderboard.getCurrentPlayerLeaderboard(req.params.number, (results) => {
            res.send(results);
        });
    });

    app.route('/leaderboard/current/clan/:number').get((req, res) => {
        sql.leaderboard.getCurrentClanLeaderboard(req.params.number, (results) => {
            res.send(results);
        });
    });

    // Start new leaderboard for the current month
    app.route('/leaderboard/new').put((req, res) => {
        sql.leaderboard.addNewLeaderboards(() => {
            res.send("New Leaderboards created");
        }); 
    });
}
