'use strict';

import { autoserialize } from 'cerialize';

export class Affinity {

	@autoserialize match: number;
	@autoserialize answers: number;

	get percent() {
		return this.match / this.answers * 100;
	}

	toString() {
		if (this.percent > 2 / 3 * 100) return 'PROFILE.AFFINITY.HIGH';
		if (this.percent > 1 / 3 * 100) return 'PROFILE.AFFINITY.MODERATE';
		return 'PROFILE.AFFINITY.LOW';
	}

}
