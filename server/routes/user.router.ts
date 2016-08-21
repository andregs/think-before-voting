'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = userRoutes;

function userRoutes(app: Express, db) {

	app.route('/api/user/:username').get(find);

	const aqlQuery = require('arangojs').aqlQuery;

	function find(req: Request, res: Response): void {
		db.query(aqlQuery`
		for u in user
			filter u.username == ${req.params.username}
			return merge(u, {me: u._id == ${req['user']._id}})
		`)
			.then(cursor => cursor.all())
			.then(values => res.json(values[0]))
			.catch(err => sendError(err, res));
	}

}
