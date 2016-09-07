'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = questionRoutes;

/** REST endpoints for questions & answers management. */
function questionRoutes(app: Express, db) {

	app.route('/api/question/next').get(next);

	const aqlQuery = require('arangojs').aqlQuery;

	/**
	 * Endpoint to select a random unanswered question.
	 * 
	 * Example:
	 * GET /api/question/next
	 */
	function next(req: Request, res: Response): void {
		// FIXME the query below is totally fake
		db.query(aqlQuery`
		for q in question limit 1
			for user in 1 outbound q graph 'qaGraph'
			return merge (
				keep(q, '_key', 'title', 'options', 'answers'),
				{ questioner: keep(user, '_key', 'nickname', 'name') }
			)
		`)
			.then(cursor => cursor.all())
			.then(values => res.json(values[0]))
			.catch(err => sendError(err, res));
	}

}
