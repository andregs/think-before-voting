'use strict';

import { Express, Request, Response } from 'express';

import { sendError } from '../shared/functions';

module.exports = questionRoutes;

/** REST endpoints for questions & answers management. */
function questionRoutes(app: Express, db) {

	app.route('/api/question/random')
		.get(random);

	app.route('/api/question/:key')
		.get(get)
		.patch(patch);

	app.route('/api/question')
		.post(post);

	const aqlQuery = require('arangojs').aqlQuery;

	/**
	 * Endpoint to select a random unanswered question.
	 * Optionally pass a question key in `skip` to filter that question out.
	 * 
	 * Example:
	 * GET /api/question/random?skip=123
	 */
	function random(req: Request, res: Response): void {
		// [user] -answer-> [question] -questioner-> [user]
		db.query(aqlQuery`
		for q in question
		let answers = (
			for a in answer
			filter a._from == ${req['user']._id}
			filter a._to == q._id
			return 1
		)
		filter length(answers) == 0
		filter q._key != ${ req.query.skip || null }
		sort rand()
		limit 1
		for user in 1 outbound q graph 'qaGraph'
		return merge (q,
			{ questioner: keep(user, '_key', 'nickname', 'name') }
		)
		`)
			.then(cursor => cursor.all())
			.then(values => values.length ?
				res.json(values[0]) :
				res.sendStatus(404)
			)
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to select a question by its key.
	 * 
	 * Example:
	 * GET /api/question/123
	 */
	function get(req: Request, res: Response): void {
		db.query(aqlQuery`
		for q in question filter q._key == ${req.params.key}
			for user in 1 outbound q graph 'qaGraph'
			return merge (q,
				{ questioner: keep(user, '_key', 'nickname', 'name') }
			)
		`)
			.then(cursor => cursor.all())
			.then(values => res.json(values[0]))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to create a new question.
	 * 
	 * Example:
	 * POST /api/question
	 * { title: '', options: ['', ''], ... }
	 */
	function post(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('qaGraph');
			var _ = require('underscore');
			args[0].createdAt = new Date();
			args[0].updatedAt = args[0].createdAt;
			var question = graph.question.save(args[0]);
			graph.questioner.save(question._id, args[1]._id, {});

			question.questioner = _.pick(
				graph.user.document(args[1]),
				'_key', 'name', 'nickname'
			);
			return question;
		});

		const collections = {
			read: ['user'],
			write: ['question', 'questioner'],
		};
		db.transaction(collections, action, [req.body, req['user']])
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

	/**
	 * Endpoint to update a given question.
	 * 
	 * Example:
	 * PATCH /api/question/123
	 * { title: '', options: ['', ''], ... }
	 */
	function patch(req: Request, res: Response): void {
		var action = String(function (args) {
			var gm = require("@arangodb/general-graph");
			var graph = gm._graph('qaGraph');
			var _ = require('underscore');
			var questionData = _.pick(args[0], 'title', 'options');
			questionData.updatedAt = new Date();
			return graph.question.update(args[0]._key, questionData);
		});

		const collections = { write: 'question' };
		db.transaction(collections, action, [req.body])
			.then(result => res.json(result))
			.catch(err => sendError(err, res));
	}

}
