'use strict';

import { autoserialize, autoserializeAs, deserialize, deserializeAs } from 'cerialize';

import { Affinity } from './affinity.model';
import { Location } from '../location.model';

/**
 * Model class to represent a user of the app.
 */
export class User {

	// auth0 fields

	@deserialize auth0Id: string;
	@deserialize email: string;
	@autoserialize name: string;
	@deserialize emailVerified: boolean;
	@deserialize picture: string;
	@autoserialize nickname: string;
	@deserializeAs(Date) createdAt: Date;
	@deserializeAs(Date) updatedAt: Date;

	// my custom fields

	@autoserialize _key: string;
	@autoserialize _rev: string;
	@deserialize me: boolean;
	@autoserializeAs(Location) location: Location;
	@deserialize following: number;
	@deserialize followers: number;
	@deserialize followed: boolean;
	@deserialize news: any[];
	@deserialize answers: string[];
	@deserializeAs(Affinity) affinity = new Affinity(0, 0);
	@deserialize agree: string[];
	@deserialize disagree: string[];
	@autoserialize admin: boolean;

	get displayName(): string {
		return this.nickname ? this.nickname : this.name;
	}

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

	toString() {
		return this.displayName;
	}

}
