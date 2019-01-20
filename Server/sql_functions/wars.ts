

export class WarsSQL {
    constructor(private sql) {

    }

    registerPlayer(puuid:string, callback:Function) {
        var query:string = "INSERT INTO clan_war_entry SELECT war_id, ? FROM clan_war WHERE status = 'SIGN_UP' LIMIT 1";
        this.sql.query(query, [puuid], (err, results, fields) => {
            if(err) {
                console.log(err);
                callback({"message": "Something went wrong"});
                return;
            }
            callback({"message": "User registered"});
        });
    }

    createClanWar(callback:Function) {
        var query:string =  "INSERT INTO clan_war (status) VALUES ('NOT_STARTED')";
        this.sql.query(query, [], (err, results, fields) => { 
            if(err) {
                callback({"message": "Something went wrong"});
            }
            else {
                callback({"message": "New clan war created"});
            }
        });
    }

    openSignUp(callback:Function) {
        var query:string = "UPDATE `riot-2018`.`clan_war` SET `status`='SIGN_UP' WHERE `status`='NOT_STARTED'";
        this.sql.query(query, [], (err, results, fields) => {
            if(err) {
                callback({"message": "Something went wrong"});
            }
            else {
                callback({"message": "Sign Up has been opened"});
            }
        });
    }

    startWar(callback:Function) {
        var query:string = "UPDATE `riot-2018`.`clan_war` SET `status`='IN_PROGRESS' WHERE `status`='SIGN_UP'";
        this.sql.query(query, [], (err, results, fields) => {
            if(err) {
                callback({"message": "Something went wrong"});
            }
            else {
                callback({"message": "Clan War was started"});
            }
        });
    }

    endWar(callback:Function) {
        var query:string = "UPDATE `riot-2018`.`clan_war` SET `status`='FINISHED' WHERE `status`='IN_PROGRESS'";
        this.sql.query(query, [], (err, results, fields) => {
            if(err) {
                callback({"message": "Something went wrong"});
            }
            else {
                callback({"message": "Clan War has finished"});
            }
        });
    }

    createGame(team1:string, team2:string, callback:Function) {
        var query:string = "INSERT INTO `riot-2018`.`clan_war_game` (team_1, team_2, war, result) VALUES SELECT ?, ?, war_id, 0 FROM clan_war WHERE status='SET_UP'";
        this.sql.query(query, [], (err, results, fields) => {
            if(err) {
                callback({"message": "Something went wrong"});
            }
            else {
                callback({"message": "Clan War was started"});
            }
        });
    }

    resolveGame(team1:string, team2:string, war:number, winner:number, callback:Function) {
        if(winner > 2 || winner < 0) {
            callback({"message": "Invalid winner"});
            return;
        }
        var query:string = "UPDATE `riot-2018`.`clan_war_game` SET result = ? WHERE team_1=? AND team_2=? AND war=?"
        this.sql.query(query, [winner, team1, team2, war], (err, results, fields) => {
            if(err) {
                callback({"message": "Something went wrong"});
            }
            else {
                callback({"message": "Game was resolved"});
            }
        });
    }

    getPlayers(callback:Function) {
        var query:string = `
        SELECT entity_id, summoner_id, clan_id FROM clan_war_entry c 
        JOIN player p ON c.player = p.entity_id
        JOIN clan_war w ON w.war_id = c.war
        JOIN clan_member cm ON cm.player_id = c.player

        WHERE w.status = 'SIGN_UP'`

        this.sql.query(query, [], (err, results, fields) => {
            if(err) {
                callback({"message": "Something went wrong"});
            }
            else {
                callback(results);
            }
        });
    }
}