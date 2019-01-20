var request = require("request");

function genereateWar() {
    getPlayers((players:Object) => {
        var teams:object = {};
        var x;
        for(var i in players) {
            teams[players[i].clan_id] = players[i];
        }
    });
}

function getPlayers(callback:Function) {
    request.get("http://localhost:1000/war/players/get", (err, res, data) => {
        callback(JSON.parse(data));
    });
}

genereateWar();