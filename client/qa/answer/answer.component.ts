'use strict';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { QuestionService } from '../question.service';
import { Answer } from './answer.model';

/** This component manages the answer question page. */
@Component({
	selector: 'tbv-answer',
	templateUrl: 'client/qa/answer/answer.component.html',
	styleUrls: ['client/qa/answer/answer.component.css'],
})
export class AnswerComponent implements OnInit {

	answer: Answer;
	current = 0;

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
		this.route.data.forEach((data: { model: Answer }) => {
			this.answer = data.model;
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

	onSubmit() {
		if (this.answer.chosen == null) {
			console.log('skipping');
		} else {
			this.questionService.saveAnswer(this.answer).subscribe(
				answer => console.log('saved, should now skip to the next', answer),
				this.redirectOnError.bind(this)
			);
		}
	}

	get skipAnswer() {
		return 'QUESTION.' + (this.answer.chosen == null ? 'SKIP' : 'ANSWER');
	}

	private redirectOnError(error: { status: any }) {
		this.router.navigate(['/error', error.status], { skipLocationChange: true });
	}

}
