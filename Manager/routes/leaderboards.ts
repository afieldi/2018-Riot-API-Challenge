const request = require("request");
const host = "http://localhost:1000";
export function setup(app) {
    console.log("Leaderboards endpoint setup");
    app.route('/leaderboard/current/player/:number').get((req, res) => {
        request.get(`${host}/leaderboard/current/player/${req.params.number}`, (err, response, data) => {
            res.send(data);
        });
    });

    app.route('/leaderboard/current/clan/:number').get((req, res) => {
        request.get(`${host}/leaderboard/current/clan/${req.params.number}`, (err, response, data) => {
            if(err) console.log(err);
            // console.log(data);
            res.send(data);
        });
    });
    // app.route("/war/setup")
}