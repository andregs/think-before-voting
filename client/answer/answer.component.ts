'use strict';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { QuestionService } from './question.service';
import { Question } from './question.model';

/** This component manages the answer question page. */
@Component({
	selector: 'tbv-answer',
	templateUrl: 'client/answer/answer.component.html',
	styleUrls: ['client/answer/answer.component.css'],
})
export class AnswerComponent implements OnInit {

	question: Question;
	current = 0;
	answer: number;

	constructor(
		private questionService: QuestionService,
		private router: Router
	) {}

	/** Requests one unanswered question. */
	ngOnInit() {
		this.questionService.next().subscribe(
			value => this.question = value,
			error => this.router.navigate(['/error', error.status], { skipLocationChange: true })
		);
	}

	/** Cycles through stats data. */
	changeStats() {
		this.current = (this.current + 1) % this.question.stats.length;
	}

	get stats() {
		return this.question.stats[this.current];
	}

	get statsLabel() {
		return 'QUESTION.STATS.' + ['NETWORK', 'GLOBAL', 'REGION', 'CITY'][this.current];
	}

	get skipAnswer() {
		return 'QUESTION.' + (this.answer ? 'ANSWER' : 'SKIP');
	}

}
