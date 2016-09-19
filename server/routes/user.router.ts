'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = userRoutes;

/** REST endpoints for user management. */
function userRoutes(app: Express, db) {

	app.route('/api/user/:username/follow')
		.post(follow)
		.delete(unfollow);

	app.route('/api/user/:username/upsert')
		.post(upsert);

	app.route('/api/user/:username')
		.get(get)
		.patch(patch);

	const aqlQuery = require('arangojs').aqlQuery;

	/**
	 * Endpoint to select a user by its given username.
	 * 
	 * Example:
	 * GET /api/user/andre
	 */
	function get(req: Request, res: Response): void {
		const myself = aqlQuery`
		for u in user
			filter u._id == ${req['user']._id}
			let followers = first(
				for v in 1 inbound u graph 'socialGraph'
				collect with count into followers
				return followers
			),
			following = first(
				for v in 1 outbound u graph 'socialGraph'
				collect with count into following
				return following
			)
			return merge(u, {me: true, followers, following})
		`;

		const notMyself = aqlQuery`
		for u in user
			filter u._key == ${req.params.username}
			let followed = 0 < length(
				for f in follow
				filter f._from == ${req['user']._id} and f._to == u._id
				return 1
			)
			return merge(u, { me: false, followed })
		`;

		console.log('query', req['user']._key, req.params.username);

		db.query(req['user']._key === req.params.username ? myself : notMyself)
			.then(cursor => cursor.all())
			.then(values => res.json(values[0]))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to create or update a user.
	 * 
	 * Example:
	 * POST /api/user/andre/upsert
	 * { "_key": "andre", "name": "André Gomes" ... }
	 */
	function upsert(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('qaGraph');
			var _ = require('underscore');

			var userData = _.omit(args[0], _.isUndefined);
			var user = graph.user.firstExample({ _key: userData._key });

			if (user === null) { // first login (sign up)
				graph.user.save(userData);
			} else { // sign in or edit profile
				graph.user.update(userData._key, userData);
			}

			user = graph.user.firstExample({ _key: userData._key });
			user.me = user._id === args[1]._id;
			return user;
		});

		const collections = { read: 'user', write: 'user' };
		db.transaction(collections, action, [req.body, req['user']])
			.then(json => res.json(json))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to follow a user.
	 * 
	 * Example:
	 * POST /api/user/andre/follow
	 */
	function follow(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('socialGraph');

			var targetUser = graph.user.document(args[0]);
			var authUser = args[1];
			var follow = graph.follow.firstExample({
				_from: authUser._id, _to: targetUser._id
			});

			if (follow === null) {
				return graph.follow.save(authUser._id, targetUser._id, {});
			} else {
				throw new Error('User is already followed');
			}
		});

		const collections = { read: 'user', write: 'follow' };
		db.transaction(collections, action, [req.params.username, req['user']])
			.then(json => res.json(json))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to unfollow a user.
	 * 
	 * Example:
	 * DELETE /api/user/andre/follow
	 */
	function unfollow(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('socialGraph');

			var targetUser = graph.user.document(args[0]);
			var authUser = args[1];
			var follow = graph.follow.firstExample({
				_from: authUser._id, _to: targetUser._id
			});

			if (follow === null) {
				throw new Error('User is not followed');
			} else {
				return graph.follow.remove(follow._id);
			}
		});

		const collections = { read: 'user', write: 'follow' };
		db.transaction(collections, action, [req.params.username, req['user']])
			.then(json => res.json(json))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to update a user.
	 * 
	 * Example:
	 * PATCH /api/user/andre
	 * { "name": "André Gomes", "nickname": "André" ... }
	 */
	function patch(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('userGraph');
			var _ = require('underscore');

			var userData = _.omit(args[0],
				(v, k) => _.isUndefined(v, k) || k === 'location');
			var user = graph.user.update(userData._key, userData);
			if (args[0].location) {
				userData._id = 'user/' + userData._key;
				args[0].location._id = 'location/' + args[0].location._key;
				graph.livesIn.removeByExample({ _from: userData._id });
				graph.livesIn.save(userData._id, args[0].location._id, {});
			}
			return user;
		});

		const collections = {
			read: ['user', 'livesIn'],
			write: ['user', 'livesIn']
		};
		db.transaction(collections, action, [req.body])
			.then(json => res.json(json))
			.catch(err => sendError(err, res));
	}

}
