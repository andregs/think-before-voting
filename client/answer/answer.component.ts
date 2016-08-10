'use strict';

import { Component } from '@angular/core';

@Component({
	selector: 'tbv-answer',
	templateUrl: 'client/answer/answer.component.html',
	styleUrls: ['client/answer/answer.component.css'],
})
export class AnswerComponent {

	private STATS = ['My Network', 'Global', 'My Region', 'My City'];
	private current = 0;
	private statsFor = this.STATS[this.current];
	private value = 25;

	constructor() {}

	changeStats() {
		const next = ++this.current % this.STATS.length;
		this.statsFor = this.STATS[next];
		this.value = Math.floor(Math.random() * (90 - 20 + 1)) + 20;
	}

}
