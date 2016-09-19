'use strict';

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Observable } from 'rxjs';

import { QuestionService } from '../question.service';
import { Question } from '../ask/question.model';
import { Answer } from './answer.model';

/** This component manages the answer question page. */
@Component({
	selector: 'tbv-answer',
	templateUrl: 'client/qa/answer/answer.component.html',
	styleUrls: ['client/qa/answer/answer.component.css'],
})
export class AnswerComponent implements OnInit {

	answer: Answer;
	hasMore = true;
	// current = 0;

	constructor(
		private questionService: QuestionService,
		private translate: TranslateService,
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
	) { }

	/**
	 * Loads the model from the resolve guard or navigates to the next
	 * question when its `key` isn't provided.
	 * 
	 * @see {@link QuestionResolveService}
	 */
	ngOnInit() {
		const key = this.route.snapshot.params['key'];
		if (key) {
			this.route.data.forEach((data: { model: Answer }) => {
				this.answer = data.model;
			});
		} else {
			const question = this.questionService.next();
			this.display(question, true);
		}
	}

	/** 
	 * Fills this component with the next question to be answered.
	 * Displays a friendly message when there's no more unanswered questions.
	 */
	private display(question: Observable<Question>, replace = false): void {
		question.subscribe(
			question => {
				this.answer = new Answer(question);
				const url = `/qa/answer/${question._key}`;
				if (replace) {
					// we came here via /answer/random
					this.location.replaceState(url);
				} else {
					// we came here via /answer/:key
					this.location.go(url);
				}
			},
			error => {
				if (error.status === 404) {
					this.hasMore = false;
				} else {
					this.redirectOnError(error);
				}
			}
		);
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
		let question: Observable<Question>;
		if (this.answer.chosen == null) { // skip button
			question = this.questionService.next(this.answer.question);
		} else { // answer button
			question = this.questionService.saveAnswer(this.answer)
				.flatMap(answer => this.questionService.next());
		}
		this.display(question);
	}

	get skipAnswer() {
		return 'ANSWER.' + (this.answer.chosen == null ? 'SKIP' : 'ANSWER');
	}

	private redirectOnError(error: { status: any }) {
		this.router.navigate(['/error', error.status], { skipLocationChange: true });
	}

}
