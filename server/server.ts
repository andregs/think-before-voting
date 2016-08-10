'use strict';

import express = require('express');
import path = require('path');

const app = express();

// let favicon = require('serve-favicon');
// app.use(favicon(__dirname + '/../client/favicon.ico'));

app.use('/systemjs.config.js', express.static(path.resolve(__dirname, '../systemjs.config.js')));
app.use('/client', express.static(path.resolve(__dirname, '../client')));
app.use('/node_modules', express.static(path.resolve(__dirname, '../node_modules')));

let bodyParser = require('body-parser');
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const arangojs = require('arangojs');
const username = process.env.ARANGODB_USERNAME;
const password = process.env.ARANGODB_PASSWORD;
const url = `http://${username}:${password}@localhost:8529`;
const db = arangojs({ url, databaseName: 'think' });

// require('./routes/user.router.js')(app, db);
// require('./routes/answer.router.js')(app, db);

function renderIndex(req: express.Request, res: express.Response) {
	res.sendFile(path.resolve(__dirname, '../client/index.html'));
};

app.get('/', renderIndex);

const port: number = process.env.PORT || 3000;
const server = app.listen(port, function () {
	const host = server.address().address;
	const port = server.address().port;
	console.log(`This express app is listening at ${host}:${port}`);
});