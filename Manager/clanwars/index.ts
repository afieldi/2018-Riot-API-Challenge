var request = require("request");

function genereateWar() {
    getPlayers((players:Object) => {
        var teamsArray:Array<Array<object>> = generateArray(players);
        
        var matches = [];
        var teamsTeams = createTeams(teamsArray);
        var onevones = matchPlayers(teamsTeams[0]);
        var fivevfives = matchPlayers(teamsTeams[1]);
        // JSON.stringify(onevones);
        var options = {
            form: {
                "players": JSON.stringify(fivevfives)
            }
        }
        // // Add 5v5s
        request.post("http://localhost:1000/war/game/add", options, (err, res, data) => {
            console.log(data);
        });
        // Add 1v1s
        options = {
            form: {
                "players": JSON.stringify(onevones)
            }
        }
        request.post("http://localhost:1000/war/game/add", options, (err, res, data) => {
            console.log(data);
        });
    });
}

// function () {

// }

function getPlayers(callback:Function) {
    request.get("http://localhost:1000/war/players/get/1", (err, res, data) => {
        callback(JSON.parse(data));
    });
}

function generateArray(players:object):Array<Array<object>> {
    var teams:object = {};
    var teamsArray:Array<Array<object>> = [];
    for(var i in players) {
        if(teams[players[i].clan_id] == undefined)
            teams[players[i].clan_id] = [];
        teams[players[i].clan_id].push(players[i]);
    }
    var added:boolean = false;
    for(var team in teams) {
        if(teamsArray.length == 0) {
            teamsArray.push(teams[team]);
            delete teams[team];
            continue;
        }
        added = false;
        for(var index in teamsArray) {
            if(teams[team].length > teamsArray[index].length) {
                teamsArray.splice(parseInt(index), 0, teams[team]);
                delete teams[team];
                added = true;
                break;
            }
        }
        if(!added) {
            teamsArray.push(teams[team]);
            delete teams[team];
        }
    }
    return teamsArray;
}

function createTeams(clans:Array<Array<object>>):Array<object> {
    var soloPlayers:object = {};
    var fivesPlayers:object = {};
    for(var players of clans) {
        var currentClan:string = players[0]["clan_id"];
        var numberOfExcessPlayers = players.length % 5;
        for(var t = 0; t < numberOfExcessPlayers; t ++) {
            if(soloPlayers[currentClan] == undefined)
                soloPlayers[currentClan] = [];
            var rand = Math.floor(Math.random() * players.length);
            soloPlayers[currentClan].push([players[rand]]);
            players.splice(rand, 1);
        }
        var numberOfTeams = players.length / 5;

        for(var x = 0; x < numberOfTeams; x ++) {
            if(fivesPlayers[currentClan] == undefined)
                fivesPlayers[currentClan] = [];
            fivesPlayers[currentClan].push(players.splice(0, 5));
        }
    }


    return [soloPlayers, fivesPlayers];
}

function matchPlayers(clans:object):Array<Array<object>> {
    var matches = [];
    for(var clan in clans) {
        for(var team in clans[clan]) {
            var randomClan = clan;
            var randomTeam = 0;
            // Get other team
            while(randomClan == clan && Object.keys(clans).length > 1 || clans[randomClan].length == 0) {
                randomClan = Object.keys(clans)[(Math.floor(Math.random() * Object.keys(clans).length)).toString()];
                randomTeam = Math.floor(Math.random() * clans[randomClan].length);
            }

            // Add them to a match
            matches.push([clans[clan][team], clans[randomClan][randomTeam]]);
            clans[clan].splice(team, 1);
            clans[randomClan].splice(randomTeam, 1);
        }
    }
    return matches
}

genereateWar();