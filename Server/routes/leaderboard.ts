import { SQL } from "../sql_functions";

export function setup(app, sql:SQL) {
    app.route('/leaderboard/current/player').get((req, res) => {
        sql.leaderboard.getCurrentPlayerLeaderboard((results) => {
            res.send(results);
        });
    });

    app.route('/leaderboard/current/clan').get((req, res) => {
        sql.leaderboard.getCurrentClanLeaderboard((results) => {
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
