'use strict';

import { autoserialize, autoserializeAs } from 'cerialize';

import { User } from '../shared/auth/user.model';

/** Model class to represent a question to be answered. */
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

}
