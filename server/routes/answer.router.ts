'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = answerRoutes;

/** REST endpoints for answers management. */
function answerRoutes(app: Express, db) {

	app.route('/api/answer/:questionKey')
		.get(get)
		.post(post);

	app.route('/api/answer/:key')
		.patch(patch);

	const aqlQuery = require('arangojs').aqlQuery;

	/**
	 * Endpoint to select the authenticated user's answer to the given question.
	 * 
	 * Example:
	 * GET /api/answer/123
	 */
	function get(req: Request, res: Response): void {
		// [user] -answer-> [question] -questioner-> [user]
		db.query(aqlQuery`
		for q in question
			filter q._key == ${ req.params.questionKey }
			for user in 1 outbound q graph 'qaGraph'
			return {
				question: merge(
					keep(q, '_key', '_rev', 'title', 'options'),
					{ questioner: keep(user, '_key', 'nickname', 'name') }
				),
				answer: first(
					for a in answer
					filter a._from == ${ req['user']._id }
					filter a._to == q._id
					return keep(a, '_key', '_rev', 'chosen', 'opinion')
				)
			}
		`)
			.then(cursor => cursor.all())
			.then(values => {
				if (values.length) {
					var answer = values[0].answer || {};
					answer.question = values[0].question;
					res.json(answer);
				} else {
					res.sendStatus(404);
				}
			})
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to answer a given question.
	 * 
	 * Example:
	 * POST /api/answer/123
	 * { chosen:0|1, opinion:string }
	 */
	function post(req: Request, res: Response): void {
		// [user] -answer-> [question] -questioner-> [user]
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('qaGraph');
			var _ = require('underscore');
			var user = graph.user.document(args[1]._key);
			var question = graph.question.document(args[2]);
			var answerData = _.pick(args[0], 'chosen', 'opinion');
			var answer = graph.answer.save(user._id, question._id, answerData);
			return _.extend(answerData, answer);
		});

		const collections = {
			read: ['user', 'question'],
			write: ['answer'],
		};
		const params = [req.body, req['user'], req.params.questionKey];
		db.transaction(collections, action, params)
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to update a given answer.
	 * 
	 * Example:
	 * POST /api/answer/123
	 * { chosen:0|1, opinion:string }
	 */
	function patch(req: Request, res: Response): void {
		// [user] -answer-> [question] -questioner-> [user]
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('qaGraph');
			var _ = require('underscore');
			return graph.answer.update(
				args[0]._key,
				_.pick(args[0], 'chosen', 'opinion')
			);
		});

		const collections = { write: 'answer' };
		db.transaction(collections, action, [req.body])
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

}
