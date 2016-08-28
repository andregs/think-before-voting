'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = partyRoutes;

function partyRoutes(app: Express, db) {

	app.route('/api/party/:abbreviation').get(find);

	const aqlQuery = require('arangojs').aqlQuery;

	function find(req: Request, res: Response): void {
		db.query(aqlQuery`
		for p in party
			filter p.abbreviation == ${req.params.abbreviation.toUpperCase()}
			let location = (
				for v in 1 outbound p graph 'partyGraph' return v.name
			),
			admins = (
				for v,e in 1 inbound p graph 'partyGraph'
					filter is_same_collection('admin', e)
					return keep(v, '_key', 'nickname', 'name')
			),
			candidates = (
				for v,e in 1 inbound p graph 'partyGraph'
					filter is_same_collection('candidate', e)
					return keep(v, '_key', 'nickname', 'name')
			)
			return merge(p, {
				admins, candidates,
				location: location[0]
			})
		`)
			.then(cursor => cursor.all())
			.then(values => res.json(values[0]))
			.catch(err => sendError(err, res));
	}

}
