'use strict';

import { autoserialize, deserializeAs, deserialize } from 'cerialize';

import { User } from '../../shared/auth/user.model';

/** Model class to represent a question to be answered. */
export class Question {

	@autoserialize _key: string;
	@autoserialize _rev: string;
	@autoserialize title: string;
	@autoserialize options: string[] = [null, null];
	@deserialize answers: number;
	@deserializeAs(User) questioner: User;

	stats = [
		// TODO compute real stats
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
		Math.floor(Math.random() * (90 - 20 + 1)) + 20,
	];

}
