'use strict';

import { autoserialize } from 'cerialize';

export class User {

	@autoserialize _key: string;
	@autoserialize username: string;
	@autoserialize email: number;
	@autoserialize name: string;

	get _id() {
		return this._key === undefined ? undefined : `question/${this._key}`;
	}

}
