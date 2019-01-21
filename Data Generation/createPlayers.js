var fs = require('fs');
var request = require('request');
var clans = [];

for(var i = 1; i <= 50; i ++) {
    clans.push({
        "tag": "CLN" + i,
        "name": "Clan " + i
    });
}

fs.readFile("words.txt", 'utf8', (err, data) => {
    data = data.split('\n');
    var max = data.length;
    for(var i = 0; i < 1000; i ++) {
        var clan = rand(clans.length);
        var options = {
            form: {
                "display_name": data[rand(max)] + " " + data[rand(max)],
                "puuid": makepuuid(),
                "id": makeid(),
                "accountId": makeid(),
                "clan_name": clans[clan]["name"],
                "clan_tag": clans[clan]["tag"]
            }
        }
        request.put("http://localhost:1000/player", options, (err, res, data) => {
            console.log(data);
        });
    }
});

function rand(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function makepuuid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 50; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

function makeid() {
    var text = "";
    var possible = "123456789";
  
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}