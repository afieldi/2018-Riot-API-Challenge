// This will actually manage the backend stuff like assigning missions and creating clan wars

import * as bodyParser from 'body-parser';
import * as express from 'express';
import { setup as missionSetup } from './routes/missions';
import { setup as playerSetup} from "./routes/player";
import { setup as warsSetup} from "./routes/wars";
import { setup as leaderboardSetup} from "./routes/leaderboards";

var app = express();
// Configure app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(function (request, response, next) {
    // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.header("Access-Control-Allow-Headers", "Origin, XRequested-With, Content-Type, Accept ");
    response.header('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS ');
    next();
});


// Add routes
missionSetup(app);
playerSetup(app);
warsSetup(app);
leaderboardSetup(app);

app.listen(8000);
console.log("App listening on port 8000");