'use strict';

import { Component } from '@angular/core';

@Component({
	selector: 'tbv-answer',
	templateUrl: 'client/answer/answer.component.html',
	styleUrls: ['client/answer/answer.component.css'],
})
export class AnswerComponent {

	private STATS = ['NETWORK', 'GLOBAL', 'REGION', 'CITY'];
	private current = -1;
	private statsFor: string;
	private value: number;

	private answer: number;

	constructor() {
		this.changeStats();
	}

	changeStats() {
		const next = ++this.current % this.STATS.length;
		this.statsFor = 'QUESTION.STATS.' + this.STATS[next];
		this.value = Math.floor(Math.random() * (90 - 20 + 1)) + 20;
	}

	get skipAnswer() {
		return `QUESTION.${ this.answer ? 'ANSWER' : 'SKIP' }`;
	}

}
