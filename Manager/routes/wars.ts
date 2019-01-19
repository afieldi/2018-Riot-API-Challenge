const request = require("request");
const host = "http://localhost:1000";
export function setup(app) {
    console.log("Wars endpoint setup");
    app.route("/war/register/:puuid").put((req, res) => {
        var user:string = req.params.puuid;
        request.put(`${host}/war/register/player/${user}`, (err, response, data) => {
            if(err) {
                res.send(err);
                return;
            }
            res.json(data);
        });
    });
}