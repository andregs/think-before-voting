'use strict';

import { deserialize, deserializeAs } from 'cerialize';

import { Affinity } from './affinity.model';

/**
 * Model class to represent a user of the app.
 */
export class User {

	// auth0 fields

	@deserialize auth0Id: string;
	@deserialize email: string;
	@deserialize name: string;
	@deserialize emailVerified: boolean;
	@deserialize picture: string;
	@deserialize nickname: string;
	@deserializeAs(Date) createdAt: Date;
	@deserializeAs(Date) updatedAt: Date;

	// my custom fields

	@deserialize _key: string;
	@deserialize _rev: string;
	@deserialize me: boolean;
	@deserialize location: string;
	@deserialize following: number;
	@deserialize followers: number;
	@deserialize followed: boolean;
	@deserialize news: any[];
	@deserialize answers: string[];
	@deserializeAs(Affinity) affinity: Affinity[];
	@deserialize agree: string[];
	@deserialize disagree: string[];
	@deserializeAs('roles') private _roles: string[];

	/** Checks whether the user has the given role. */
	is(role: Role): boolean {
		return this._roles && this._roles.includes(role);
	}

	get _id(): string {
		return this._key ? `user/${this._key}` : undefined;
	}

	get displayName(): string {
		return this.nickname ? this.nickname : this.name;
	}

	get roles(): string[] { return this._roles; }

	/**
	 * Maps Auth0 keys to our format.
	 * Usage:
	 * ```
	 * DeserializeKeysFrom(User.keyTransformer); // enable
	 * const user: User = Deserialize(auth0Json, User);
	 * DeserializeKeysFrom(null); // disable
	 * ```
	 */
	static keyTransformer(key: string): string {
		switch (key) {
			case '_key': return 'username';
			case 'auth0Id': return 'user_id';
			case 'emailVerified': return 'email_verified';
			case 'createdAt': return 'created_at';
			case 'updatedAt': return 'updated_at';
		}
		return key;
	}

}

type Role = 'admin' | 'party-admin' | 'candidate';
