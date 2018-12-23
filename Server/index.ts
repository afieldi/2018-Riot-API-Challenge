// var express = require('express')
// var app = express()
// var mysql = require('mysql');

import * as mysql from 'mysql'
import * as express from 'express'
import { setup as missionSetup } from './routes/missions';
import { setup as playerSetup } from './routes/player';


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

    
    initializeRoutes();

    app.listen(1000);
});


function initializeRoutes() {
    // Setup paths
    missionSetup(app, conn);
    playerSetup(app, conn);
}
