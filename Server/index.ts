// var express = require('express')
// var app = express()
// var mysql = require('mysql');

import * as mysql from 'mysql';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as dotenv from 'dotenv';
// TODO Refactor database to use more fucking logical ids
dotenv.config({path: `${__dirname}/.env`});

import { setup as missionSetup } from './routes/missions';
import { setup as playerSetup } from './routes/player';
import { setup as leaderboardSetup } from './routes/leaderboard';

import { SQL } from './sql_functions';

var app = express();
// Configure app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
// Connect to mysql
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Arek7000",
    database: "riot-2018"
});

app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.header("Access-Control-Allow-Headers", "Origin, XRequested-With, Content-Type, Accept ");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS ');
    next();
});

// respond with "hello world" when a GET request is made to the homepage
app.route("/").get((req, res) => {
      res.send('hello world');
});

// Connect to database
conn.connect((err) => {
    if(err) throw err;
    console.log("Connection to database established");

    var SQLData:SQL = createSQL();
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