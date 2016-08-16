'use strict';

import { Component } from '@angular/core';

const model = {
	author: {
		username: 'eneas',
		name: 'Enéas Carneiro'
	},
	title: "What's more important for you?",
	options: [
		"Quality improvement in public health.",
		"Fighting deforestation."
	],
	stats: [
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
	]
};

@Component({
	selector: 'tbv-answer',
	templateUrl: 'client/answer/answer.component.html',
	styleUrls: ['client/answer/answer.component.css'],
})
export class AnswerComponent {

	question = model;
	current = 0;
	answer: number;

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
