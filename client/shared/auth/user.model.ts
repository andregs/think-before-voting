'use strict';

import { autoserialize, autoserializeAs, deserialize, deserializeAs } from 'cerialize';

import { Affinity } from './affinity.model';
import { News } from './news.model';
import { Location } from '../location.model';

class RecentAnswers {

	// I could have used the existing Answer class, but there's this issue
	// https://github.com/weichx/cerialize/issues/22

	@deserialize _key: string;
	@deserialize title: string;
	@deserializeAs(Date) when: Date;

}

/**
 * Model class to represent a user of the app.
 */
export class User {

	// auth0 fields

	@autoserialize auth0Id: string;
	@autoserialize email: string;
	@autoserialize name: string;
	@autoserialize emailVerified: boolean;
	@autoserialize picture: string;
	@autoserialize nickname: string;
	@autoserializeAs(Date) createdAt: Date;
	@autoserializeAs(Date) updatedAt: Date;

	// my custom fields

	@autoserialize _key: string;
	@autoserialize _rev: string;
	@deserialize me: boolean;
	@autoserializeAs(Location) location: Location;
	@deserialize following: number;
	@deserialize followers: number;
	@deserialize followed: boolean;
	@deserializeAs(News) news: News[];
	@deserializeAs(RecentAnswers) myAnswers: RecentAnswers[];
	@deserializeAs(Affinity) affinity = new Affinity(0, 0);
	@deserialize agree: string[];
	@deserialize disagree: string[];
	@autoserialize admin: boolean;

	get displayName(): string {
		return this.nickname || this.name;
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
