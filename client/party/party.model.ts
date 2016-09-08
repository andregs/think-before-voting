'use strict';

import { autoserialize, autoserializeAs } from 'cerialize';

import { User } from '../shared/auth/user.model';

export class Party {

	@autoserialize _key: string;
	@autoserialize _rev: string;
	@autoserialize code: number;
	@autoserialize name: string;
	@autoserializeAs(User) admins: User[];
	@autoserializeAs(User) candidates: User[];

	get _id() {
		return this._key === undefined ? undefined : `party/${this._key}`;
	}

}
