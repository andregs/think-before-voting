'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = locationRoutes;

/** REST endpoints for location management. */
function locationRoutes(app: Express, db) {

	app.route('/api/location')
		.get(get);

	const aqlQuery = require('arangojs').aqlQuery;

	/**
	 * Endpoint to serch locations. It requires 2 query parameters: `lvl` and `qry`.
	 * Lvl 0 searches for countries, 1 = states, 2 = cities.
	 * 
	 * Example:
	 * GET /api/location?lvl=1&qry=san
	 * [
	 *   { "_key": "ES", "name": "Espírito Santo, Brasil" },
	 *   { "_key": "SC", "name": "Santa Catarina, Brasil" }
	 * ]
	 */
	function get(req: Request, res: Response): void {
		db.query(aqlQuery`
		for v in union_distinct (
			for v,e,p in ${+ req.query.lvl} outbound document('location/BR')
				graph 'worldGraph'
				sort v.name
				filter like(v.name, concat(${req.query.qry}, '%'), true)
				return merge(p.vertices[-1], { name: 
					concat_separator(', ', reverse(p.vertices[*].name))
				}),
			for v,e,p in ${+ req.query.lvl} outbound document('location/BR')
				graph 'worldGraph'
				sort v.name
				filter like(v.name, concat('%', ${req.query.qry}, '%'), true)
				return merge(p.vertices[-1], { name: 
					concat_separator(', ', reverse(p.vertices[*].name))
				})
		)
		limit 5
		return v
		`)
			.then(cursor => cursor.all())
			.then(values => values.length ?
				res.json(values) :
				res.sendStatus(404)
			)
			.catch(err => sendError(err, res));
	}

}
