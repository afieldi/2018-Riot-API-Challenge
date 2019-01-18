// This will actually manage the backend stuff like assigning missions and creating clan wars

import * as bodyParser from 'body-parser';
import * as express from 'express';
import { setup as missionSetup } from './routes/missions';
import { setup as playerSetup} from "./routes/player";
var app = express();
// Configure app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


// Add routes
missionSetup(app);
playerSetup(app);

app.listen(8000);
console.log("App listening on port 8000");