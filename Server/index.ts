// var express = require('express')
// var app = express()
// var mysql = require('mysql');

import * as mysql from 'mysql'
import * as express from 'express'
import * as dotenv from 'dotenv';
import { setup as missionSetup } from './routes/missions';
import { setup as playerSetup } from './routes/player';
import { setup as leaderboardSetup } from './routes/leaderboard';

import { SQL } from './sql_functions';

dotenv.config();

var app = express();
// Connect to mysql
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Arek7000",
    database: "riot-2018"
});

// respond with "hello world" when a GET request is made to the homepage

app.route("/").get((req, res) => {
      res.send('hello world')
});

// Connect to database
conn.connect((err) => {
    if(err) throw err;
    console.log("Connection to database established");

    var SQLData = createSQL();
    initializeRoutes(SQLData);

    app.listen(1000);
});

function initializeRoutes(SQLData:SQL) {
    // Setup paths
    missionSetup(app, SQLData);
    playerSetup(app, SQLData);
    leaderboardSetup(app, SQLData);
}

function createSQL():SQL {
    return new SQL(conn);
}