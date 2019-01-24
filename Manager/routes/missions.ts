const request = require("request");
const host = "http://localhost:1000";
export function setup(app) {
    console.log("Mission endpoint setup");
    app.route("/missions/user/:user").get((req, res) => {
        var user:string = req.params.user;
        request.get(`${host}/missions/puuid/${user}`, (err, response, data) => {
            // console.log(data);
            res.send(data);
        });
    });
}