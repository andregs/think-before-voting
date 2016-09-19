'use strict';

import { autoserialize, autoserializeAs } from 'cerialize';
import _ from 'lodash';

import { User } from '../shared/auth/user.model';
import { Member } from './edit/member.model';

/** Model class to represent a political party. */
export class Party {

	@autoserialize _key: string;
	@autoserialize _rev: string;
	@autoserialize code: number;
	@autoserialize name: string;
	@autoserializeAs(Member) members: Member[];

	/** Checks whether the given user is an admin of the party. */
	isAdmin(user: User): boolean {
		return user && (user.admin || -1 !== _.findIndex(
			this.members,
			m => m.admin && m.user._key === user._key
		));
	}

	/** Removes the given member of the party. */
	remove(member: Member): void {
		_.remove(this.members, m => m._key === member._key);
	}

	toString() {
		return `${this.name} (${this._key})`;
	}

}
