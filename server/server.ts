'use strict';

import express = require('express');
import path = require('path');
import _ = require('lodash');

const config = require('../app-config');
const app = express();

// let favicon = require('serve-favicon');
// app.use(favicon(__dirname + '/../client/favicon.ico'));

var hbs = require('express-handlebars');
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.set('views', 'server/views/');

app.use('/systemjs.config.js', express.static(path.resolve(__dirname, '../systemjs.config.js')));
app.use('/client', express.static(path.resolve(__dirname, '../client')));
app.use('/node_modules', express.static(path.resolve(__dirname, '../node_modules')));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const arangojs = require('arangojs');
const username = config.arangodb.username;
const password = config.arangodb.password;
const url = `http://${username}:${password}@localhost:8529`;
const db = arangojs({ url, databaseName: 'think' });

const jwt = require('express-jwt');
const jwtCheck = jwt({
	audience: config.auth0.client_id,
	secret: new Buffer(config.auth0.secret, 'base64'),
});
app.use('/api/*', jwtCheck);
app.use('/api/*', function (req, res, next) {
	db.collection('user')
		.firstExample({ auth0Id: req['user'].sub })
		.then(user => {
			req['user'] = _.pick(user, '_id', '_key', 'auth0Id');
			next();
		})
		.catch((err) => {
			console.error(err);
			next();
		});
});

require('./routes/question.router.js')(app, db);
require('./routes/user.router.js')(app, db);
require('./routes/party.router.js')(app, db);

const params = _.pick(config.auth0, 'domain', 'client_id');
function renderIndex(req: express.Request, res: express.Response) {
	res.render('index', { config: JSON.stringify(params) });
};

app.get('/', renderIndex);
app.get('/admin', renderIndex);
app.get('/admin/party/list', renderIndex);
app.get('/profile/*', renderIndex);
app.get('/party/edit/*', renderIndex);
app.get('/party/*', renderIndex);
app.get('/answer', renderIndex);
app.get('/ask', renderIndex);
app.get('/candidates', renderIndex);

const port: number = process.env.PORT || 3000;
const server = app.listen(port, function () {
	const host = server.address().address;
	const port = server.address().port;
	console.log(`This express app is listening at ${host}:${port}`);
});
