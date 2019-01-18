const request = require("request");
const host = "http://localhost:1000";
export function setup(app) {
    console.log("Player endpoint setup");
    app.route("/player/register").put((req, res) => {
        var user:string = req.body;
        console.log("user");
        var options = {
            body: user
        }
        request.post(`${host}/player`, user, (err, response, data) => {
            console.log(data);
            res.send(data);
        });
    });

    app.route("/player/clanwar/register").put((req, res) => {
        var user:string = req.body;
        var options = {
            body: user
        }
        request.post(`${host}`)
    });
}