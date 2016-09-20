'use strict';

import { autoserialize } from 'cerialize';

export class Affinity {

	@autoserialize matches: number;
	@autoserialize answers: number;

	constructor(matches: number, answers: number) {
		this.matches = matches;
		this.answers = answers;
	}

	get percent() {
		return this.answers === 0 ? 0 : this.matches / this.answers * 100;
	}

	toString() {
		if (this.answers < 5) return 'PROFILE.AFFINITY.UNKNOWN';
		if (this.percent >= 2 / 3 * 100) return 'PROFILE.AFFINITY.HIGH';
		if (this.percent >= 1 / 3 * 100) return 'PROFILE.AFFINITY.MODERATE';
		return 'PROFILE.AFFINITY.LOW';
	}

}
