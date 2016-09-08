'use strict';

import { autoserialize, autoserializeAs } from 'cerialize';

import { Affinity } from './affinity.model';

/**
 * Model class to represent a user of the app.
 */
export class User {

	// auth0 fields

	@autoserializeAs('user_id') auth0Id: string;
	@autoserializeAs('username') _key: string;
	@autoserialize email: string;
	@autoserialize name: string;
	@autoserializeAs('email_verified') emailVerified: boolean;
	@autoserialize picture: string;
	@autoserialize nickname: string;
	@autoserializeAs(Date, 'created_at') createdAt: Date;
	@autoserializeAs(Date, 'updated_at') updatedAt: Date;

	// my custom fields

	@autoserialize _rev: string;
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
	@autoserializeAs('roles') private _roles: string[];

	/** Checks whether the user has the given role. */
	is(role: Role): boolean {
		return this._roles && this._roles.includes(role);
	}

	get _id(): string {
		return this._key === undefined ? undefined : `user/${this._key}`;
	}

	get displayName(): string {
		return this.nickname ? this.nickname : this.name;
	}

	get roles(): string[] { return this._roles; }

}

type Role = 'admin' | 'party-admin' | 'candidate';
