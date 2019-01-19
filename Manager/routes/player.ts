const request = require("request");
const host = "http://localhost:1000";
export function setup(app) {
    console.log("Player endpoint setup");
    app.route("/player/register").put((req, res) => {
        var user:string = req.body;
        var options = {
            form: user
        }
        request.put(`${host}/player`, options, (err, response, data) => {
            console.log(data);
            res.send(data);
        });
    });
    
}