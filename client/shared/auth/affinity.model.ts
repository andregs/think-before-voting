'use strict';

import { autoserialize } from 'cerialize';

export class Affinity {

	@autoserialize match: number;
	@autoserialize answers: number;

	constructor(match: number, answers: number) {
		this.match = match;
		this.answers = answers;
	}

	get percent() {
		return this.answers === 0 ? 0 : this.match / this.answers * 100;
	}

	toString() {
		if (this.answers === 0) return 'PROFILE.AFFINITY.UNKNOWN';
		if (this.percent > 2 / 3 * 100) return 'PROFILE.AFFINITY.HIGH';
		if (this.percent > 1 / 3 * 100) return 'PROFILE.AFFINITY.MODERATE';
		return 'PROFILE.AFFINITY.LOW';
	}

}
