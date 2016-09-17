'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = partyRoutes;

/** REST endpoints for political parties management. */
function partyRoutes(app: Express, db) {

	app.route('/api/party/:partyKey/:memberKey/toggleAdmin')
		.post(toggleAdmin);

	app.route('/api/party/:partyKey/member')
		.get(searchMember)
		.post(addMember);

	app.route('/api/party/:partyKey/:memberKey')
		.delete(removeMember);

	app.route('/api/party/:key')
		.get(get)
		.patch(patch)
		.delete(remove);

	app.route('/api/party')
		.get(getAll)
		.post(post);

	const aqlQuery = require('arangojs').aqlQuery;

	/**
	 * Endpoint to select all political parties.
	 * 
	 * Example:
	 * GET /api/party
	 */
	function getAll(req: Request, res: Response): void {
		// [party] -member-> [user] -candidate-> [location]
		db.query(aqlQuery`
		for pa in party
		return merge(pa, { members: (
			for user, member in 1 outbound pa graph 'partyGraph'
			return merge(keep(member, '_key', 'admin'), {
				user: keep(user, '_key', 'name', 'nickname'),
				candidate: first(
					/* first() is better than array with a single element */
					for location, candidate in 1 outbound user graph 'partyGraph'
					return merge(keep(candidate, '_key', 'office'), {
						location: keep(location, '_key', 'name')
					})
				)
			})
		)})
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
		// [party] -member-> [user] -candidate-> [location]
		db.query(aqlQuery`
		for pa in party
		filter pa._key == ${req.params.key}
		return merge(pa, { members: (
			for user, member in 1 outbound pa graph 'partyGraph'
			return merge(keep(member, '_key', 'admin'), {
				user: keep(user, '_key', 'name', 'nickname'),
				candidate: first(
					/* first() is better than array with a single element */
					for location, candidate in 1 outbound user graph 'partyGraph'
					return merge(keep(candidate, '_key', 'office'), {
						location: keep(location, '_key', 'name')
					})
				)
			})
		)})
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
			var _ = require('underscore');
			var party = graph.party.save(_.omit(args[0], 'members'));
			graph.member.save(party._id, args[1]._id, { admin: true });
			return party;
		});

		const collections = { read: 'party', write: ['party', 'member'] };
		db.transaction(collections, action, [req.body, req['user']])
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
		// [party] -member-> [user] -candidate-> [location]
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('partyGraph');
			var members = graph.member.byExample({ _from: 'party/' + args[0] });
			members.toArray().forEach(m => {
				graph.candidate.removeByExample({ _from: m._to });
			});
			var result = graph.party.remove(args[0]);
			return result;
		});

		const collections = {
			read: ['party', 'member'],
			write: ['party', 'member', 'candidate']
		};
		const params = req.params.key;
		db.transaction(collections, action, [params])
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to serch users to add as party members.
	 * It requires the query parameter `qry`.
	 * 
	 * Example:
	 * GET /api/PCdoB/member?qry=and
	 * [
	 *   { "_key": "andre", "name": "André Gomes" },
	 *   { "_key": "anderson", "name": "Anderson Soares" }
	 * ]
	 */
	function searchMember(req: Request, res: Response): void {
		db.query(aqlQuery`
		for u in user
		filter u._key == ${req.query.qry}
		or u.email == ${req.query.qry}
		or like(u.name, concat('%', ${req.query.qry}, '%'), true)
		or like(u.nickname, concat('%', ${req.query.qry}, '%'), true)
		let memberList = (
			for m in member filter m._to == u._id return 1
		)
		filter length(memberList) == 0
		return keep(u, '_key', 'name', 'nickname')
		`)
			.then(cursor => cursor.all())
			.then(values => values.length ?
				res.json(values) :
				res.sendStatus(404)
			)
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to create a new member of the political party.
	 * 
	 * Example:
	 * POST /api/party/PCdoB/member
	 * {
	 *   admin: false,
	 *   user: { _key: 'eneas' },
	 *   candidate: {
	 *     office: 'Presidente',
	 *     location: { _key: 'BR' }
	 *   }
	 * }
	 */
	function addMember(req: Request, res: Response): void {
		// [party] -member-> [user] -candidate-> [location]
		var action = String(function (args) {
			var _ = require("underscore");
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('partyGraph');
			var party = graph.party.document(args[0]);
			var user = graph.user.document(args[1].user._key);
			var location = graph.location.document(args[1].candidate.location._key);
			var memberData = { admin: args[1].admin };
			var candidateData = { office: args[1].candidate.office };
			var member = graph.member.save(party._id, user._id, memberData);
			var candidate = graph.candidate.save(user._id, location._id, candidateData);
			return _.extend(
				member,
				memberData,
				{ user: _.pick(user, '_key', 'name', 'nickname') },
				{ candidate: _.extend(candidate, candidateData, { location: _.pick(location, '_key', 'name') }) },
			);
		});

		const collections = {
			read: ['member', 'candidate'],
			write: ['member', 'candidate'],
		};
		db.transaction(collections, action, [req.params.partyKey, req.body])
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to set the member's admin flag on/off.
	 * 
	 * Example:
	 * POST /api/party/PCdoB/123/toggleAdmin
	 */
	function toggleAdmin(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('partyGraph');
			graph.party.document(args[0]);
			var member = graph.member.document(args[1]);
			var admin = ! member.admin;
			graph.member.update(member, { admin });
			return admin;
		});

		const collections = {
			read: ['party', 'member'],
			write: ['member'],
		};
		db.transaction(collections, action, [req.params.partyKey, req.params.memberKey])
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to delete a member of the political party.
	 * 
	 * Example:
	 * DELETE /api/party/PCdoB/123
	 */
	function removeMember(req: Request, res: Response): void {
		// [party] -member-> [user] -candidate-> [location]
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('partyGraph');
			// TODO should check if args[0] really contains args[1]
			// TODO should check if operation finished successfully
			var member = graph.member.document(args[1]);
			graph.candidate.removeByExample({ _from: member._to });
			graph.member.remove(args[1]);
			return member;
		});

		const collections = {
			read: ['member', 'candidate'],
			write: ['member', 'candidate']
		};
		const params = [req.params.partyKey, req.params.memberKey];
		db.transaction(collections, action, params)
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

}
