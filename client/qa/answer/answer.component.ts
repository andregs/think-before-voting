'use strict';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { QuestionService } from '../question.service';
import { Question } from '../question.model';

/** This component manages the answer question page. */
@Component({
	selector: 'tbv-answer',
	templateUrl: 'client/qa/answer/answer.component.html',
	styleUrls: ['client/qa/answer/answer.component.css'],
})
export class AnswerComponent implements OnInit {

	question: Question;
	current = 0;
	answer: number;

	constructor(
		private questionService: QuestionService,
		private translate: TranslateService,
		private router: Router,
		private route: ActivatedRoute,
	) { }

	/**
	 * Loads the model from the resolve guard.
	 * @see {@link QuestionResolveService}
	 */
	ngOnInit() {
		this.route.data.forEach((data: { model: Question }) => {
			this.question = data.model;
		});
	}

	/** Cycles through stats data. */
	// changeStats() {
	// 	this.current = (this.current + 1) % this.question.stats.length;
	// }

	// get stats() {
	// 	return this.question.stats[this.current];
	// }

	// get statsLabel() {
	// 	return 'QUESTION.STATS.' + ['NETWORK', 'GLOBAL', 'REGION', 'CITY'][this.current];
	// }

	get skipAnswer() {
		return 'QUESTION.' + (this.answer ? 'ANSWER' : 'SKIP');
	}

	// private redirectOnError(error: { status: any }) {
	// 	this.router.navigate(['/error', error.status], { skipLocationChange: true });
	// }

}
