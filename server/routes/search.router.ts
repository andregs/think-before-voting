'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = searchRoutes;

/** REST endpoints for the search feature. */
function searchRoutes(app: Express, db) {

	app.route('/api/search/:terms')
		.get(search);

	const aqlQuery = require('arangojs').aqlQuery;

	/**
	 * Endpoint to search users, parties and questions.
	 * 
	 * Example:
	 * GET /api/search/:terms
	 * {
	 * 	"users": [ ... ],
	 * 	"parties": [ ... ],
	 * 	"questions": [ ... ]
	 * }
	 */
	function search(req: Request, res: Response): void {
		const terms = req.params.terms;
		db.query(aqlQuery`
		return {
			users: (
				for u in user
				filter like(u._key, ${ terms }, true)
				or like(u.email, ${ terms }, true)
				or like(u.name, concat('%', ${ terms }, '%'), true)
				or like(u.nickname, concat('%', ${ terms }, '%'), true)
				limit 5
				return keep(u, '_key', 'name', 'nickname')
			),
			parties: (
				for p in party
				filter like(p._key, ${ terms }, true)
				or like(p.name, concat('%', ${ terms }, '%'), true)
				limit 5
				return keep(p, '_key', 'name')
			),
			questions: (
				for q in question
				filter like(q.title, concat('%', ${ terms }, '%'), true)
				limit 5
				return keep(q, '_key', 'title')
			)
		}
		`)
			.then(cursor => cursor.all())
			.then(values => values.length ?
				res.json(values[0]) :
				res.sendStatus(404)
			)
			.catch(err => sendError(err, res));
	}

}