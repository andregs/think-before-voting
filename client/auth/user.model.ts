'use strict';

import { autoserialize, autoserializeAs } from 'cerialize';

import { Affinity } from './affinity.model';

export class User {

	@autoserialize _key: string;
	@autoserialize username: string;
	@autoserialize email: number;
	@autoserialize name: string;
	@autoserialize me: boolean;
	@autoserialize location: string;
	@autoserialize following: number;
	@autoserialize followers: number;
	@autoserialize followed: boolean;
	@autoserialize news: any[];
	@autoserialize answers: string[];
	@autoserializeAs(Affinity) affinity: Affinity[];
	@autoserialize agree: string[];
	@autoserialize disagree: string[];

	get _id() {
		return this._key === undefined ? undefined : `user/${this._key}`;
	}

}
