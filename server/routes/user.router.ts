'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = userRoutes;

function userRoutes(app: Express, db) {

	app.route('/api/user/:username').get(find);

	app.route('/api/user').post(post);

	const aqlQuery = require('arangojs').aqlQuery;

	function find(req: Request, res: Response): void {
		db.query(aqlQuery`
		for u in user
			filter u.nickname == ${req.params.username}
			return merge(u, {me: u._id == ${req['user']._id}})
		`)
			.then(cursor => cursor.all())
			.then(values => res.json(values[0]))
			.catch(err => sendError(err, res));
	}

	function post(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('qaGraph');
			var user = graph.user.firstExample({ auth0Id: args[0].auth0Id });
			if (user === null) {
				user = graph.user.save(args[0]);
			}
			return user;
		});

		const collections = { read: 'user', write: 'user' };
		db.transaction(collections, action, [req.body])
			.then(json => res.json(json))
			.catch(err => sendError(err, res));
	}

}
