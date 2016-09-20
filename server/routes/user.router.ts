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
		let period = date_subtract(date_now(), 'P1W')
		for me in user
			filter me._id == ${req['user']._id}
			let followers = first(
				for v in 1 inbound me graph 'socialGraph'
				collect with count into followers
				return followers
			),
			following = first(
				for v in 1 outbound me graph 'socialGraph'
				collect with count into following
				return following
			),
			myAnswers = (
				for q, a in 1 outbound me graph 'qaGraph'
				sort a.updatedAt desc
				limit 12
				return merge (
					keep(q, '_key', 'title'),
					{ when: a.updatedAt }
				)
			),
			newAnswers = (
				for u, f in 1 outbound me graph 'socialGraph'
					for q, a in 1 outbound u graph 'qaGraph'
					filter a.updatedAt > period
					collect who = {_key: u._key, name: (u.nickname || u.name)},
						action = 'ANSWERED'
						into group = a.updatedAt
					return {
						who, action,
						questions: count(group),
						when: max(group)
					}
			),
			newFollowers = (
				for u, f in 1 inbound me graph 'socialGraph'
				filter f.updatedAt > period
				return {
					who: {_key: u._key, name: (u.nickname || u.name)},
					action: 'FOLLOWED',
					when: f.updatedAt
				}
			),
			news = (
				for news in union(newAnswers, newFollowers)
					sort news.when desc
					limit 12
					return news
			)
			return merge(
				me,
				{ me: true, followers, following, news, myAnswers }
			)
		`;

		const notMyself = aqlQuery`
		for u in user
			filter u._key == ${req.params.username}
			let followed = 0 < length(
				for f in follow
				filter f._from == ${req['user']._id} and f._to == u._id
				return 1
			),
			affinity = (
				for u2 in [u, ${ req['user']._id }]
					for v, e in 1 outbound u2 graph 'qaGraph'
						collect question = {_key: v._key, title: v.title} into answers = e.chosen
						filter count(answers) == 2 // questions answered by both users
						let match = sum(answers) != 1 ? 1 : 0 // flags same answer by both users
						return {question, match}
			)
			return merge(u, {
				me: false,
				followed,
				agree: affinity[* filter CURRENT.match == 1 return CURRENT.question],
				disagree: affinity[* filter CURRENT.match == 0 return CURRENT.question],
				affinity: {
					answers: count(affinity), 
					matches: sum(affinity[*].match)
				}
			})
		`;

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
			var now = new Date(), data = { createdAt: now, updatedAt: now };

			if (follow === null) {
				return graph.follow.save(authUser._id, targetUser._id, data);
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
