'use strict';

import { autoserialize, autoserializeAs } from 'cerialize';

import { User } from '../shared/auth/user.model';

export class Question {

	@autoserialize _key: string;
	@autoserialize title: string;
	@autoserialize options: string[];
	@autoserialize answers: number;
	@autoserializeAs(User) questioner: User;

	stats = [
		// TODO compute real stats
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
	];

	get _id() {
		return this._key === undefined ? undefined : `question/${this._key}`;
	}

}
