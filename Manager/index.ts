// This will actually manage the backend stuff like assigning missions and creating clan wars

import * as bodyParser from 'body-parser';
import * as express from 'express';

var app = express();
// Configure app
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.route("/")

app.listen(8000);