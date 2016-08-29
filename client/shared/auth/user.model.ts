'use strict';

import { autoserialize, autoserializeAs } from 'cerialize';

import { Affinity } from './affinity.model';

export class User {

	@autoserialize _key: string;
	@autoserializeAs('user_id') auth0Id: string;
	@autoserialize email: string;
	@autoserialize name: string;
	@autoserializeAs('email_verified') emailVerified: boolean;
	@autoserialize picture: string;
	@autoserialize nickname: string;
	@autoserializeAs(Date, 'created_at') createdAt: Date;
	@autoserializeAs(Date, 'updated_at') updatedAt: Date;

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
		if (this._key) return `user/${this._key}`;
	}

}
