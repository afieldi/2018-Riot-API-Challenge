var request = require("request");

function genereateWar() {
    getPlayers((players:Object) => {
        var teamsArray:Array<Array<object>> = generateArray(players);
        
        var matches = [];
        var teamsTeams = createTeams(teamsArray);
        var onevones = 
    });
}

function getPlayers(callback:Function) {
    request.get("http://localhost:1000/war/players/get", (err, res, data) => {
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
            soloPlayers[currentClan].push(players[rand]);
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

function matchPlayers(teams:object) {
    
}

genereateWar();