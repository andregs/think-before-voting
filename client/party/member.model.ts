'use strict';

import { autoserialize, autoserializeAs } from 'cerialize';

import { User } from '../shared/auth/user.model';
import { Candidate } from './candidate.model';
import { Office } from './candidate.model';
import { Location } from '../shared/location.model';

/** 
 * Model class to represent a member of a political party.
 * - An admin member can edit the party data.
 */
export class Member {

	@autoserialize _key: string;
	@autoserialize admin: boolean;
	@autoserializeAs(User) user: User;
	@autoserializeAs(Candidate) candidate: Candidate;

	constructor(user: User, office: Office, location: Location) {
		this.admin = false;
		this.user = user;
		this.candidate = new Candidate(office, location);
	}

}
