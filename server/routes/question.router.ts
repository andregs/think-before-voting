'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = questionRoutes;

function questionRoutes(app: Express, db) {

	app.route('/api/question/next').get(next);

	const aqlQuery = require('arangojs').aqlQuery;

	function next(req: Request, res: Response): void {
		// TODO select a random unanswered question
		db.query(aqlQuery`
		for q in question limit 1
			for user in 1 outbound q graph 'qaGraph'
			return merge (
				keep(q, '_key', 'title', 'options', 'answers'),
				{ questioner: keep(user, '_key', 'username', 'name') }
			)
		`)
			.then(cursor => cursor.all())
			.then(values => res.json(values[0]))
			.catch(err => sendError(err, res));
	}

}
