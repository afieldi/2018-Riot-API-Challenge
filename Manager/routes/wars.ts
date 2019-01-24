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
    app.route("/war/status/:puuid").get((req, res) => {
        request.get(`${host}/war/current/setup`, (err, response, data) => {
            var data = JSON.parse(data);
            if(data.length == 0) {
                res.json({"code": 1});
                return;
            }
            else {
                request.get(`${host}/war/player/${req.params.puuid}/${data[0]["war_id"]}`, (err, response, data) => {
                    var data = JSON.parse(data);
                    if(data.length == 0) {
                        res.json({"code": 2});
                    }
                    else {
                        res.json({"code": 3});
                    }
                });
            }
        });
    });
}