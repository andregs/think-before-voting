'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = partyRoutes;

/** REST endpoints for political parties management. */
function partyRoutes(app: Express, db) {

	app.route('/api/party')
		.get(getAll)
		.post(post);

	app.route('/api/party/:key')
		.get(get)
		.patch(patch)
		.delete(remove);

	const aqlQuery = require('arangojs').aqlQuery;

	/**
	 * Endpoint to select all political parties.
	 * 
	 * Example:
	 * GET /api/party
	 */
	function getAll(req: Request, res: Response): void {
		db.query(aqlQuery`
		for p in party
			let admins = (
				for v,e in 1 inbound p graph 'partyGraph'
					filter is_same_collection('admin', e)
					return keep(v, '_key', 'nickname', 'name')
			),
			candidates = (
				for v,e in 1 inbound p graph 'partyGraph'
					filter is_same_collection('candidate', e)
					return keep(v, '_key', 'nickname', 'name')
			)
			return merge(p, { admins, candidates })
		`)
			.then(cursor => cursor.all())
			.then(values => values.length ?
				res.json(values) :
				res.sendStatus(404)
			)
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to select a political party by its given key.
	 * 
	 * Example:
	 * GET /api/party/PCdoB
	 */
	function get(req: Request, res: Response): void {
		db.query(aqlQuery`
		for p in party
			filter p._key == ${req.params.key}
			let admins = (
				for v,e in 1 inbound p graph 'partyGraph'
					filter is_same_collection('admin', e)
					return keep(v, '_key', 'nickname', 'name')
			),
			candidates = (
				for v,e in 1 inbound p graph 'partyGraph'
					filter is_same_collection('candidate', e)
					return keep(v, '_key', 'nickname', 'name')
			)
			return merge(p, { admins, candidates })
		`)
			.then(cursor => cursor.all())
			.then(values => values.length ?
				res.json(values[0]) :
				res.sendStatus(404)
			)
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to create a political party.
	 * 
	 * Example:
	 * POST /api/party
	 */
	function post(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('partyGraph');
			var result = graph.party.save(args[0]);
			return result;
		});

		const collections = { read: 'party', write: 'party' };
		db.transaction(collections, action, [req.body])
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to update a political party.
	 * 
	 * Example:
	 * PATCH /api/party/PCdoB
	 */
	function patch(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('partyGraph');
			var _ = require('underscore');

			var result = graph.party.update(
				args[0]._key,
				_.pick(args[0], '_rev', 'name', 'code')
			);
			return result;
		});

		const collections = { read: 'party', write: 'party' };
		db.transaction(collections, action, [req.body])
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to delete a political party.
	 * 
	 * Example:
	 * DELETE /api/party/PCdoB
	 */
	function remove(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('partyGraph');
			var result = graph.party.remove(args[0]);
			return result;
		});

		const collections = {
			read: ['party'],
			write: ['party', 'admin', 'candidate']
		};
		const params = req.params.key;
		db.transaction(collections, action, [params])
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

}
