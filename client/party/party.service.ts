'use strict';

import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize, Serialize } from 'cerialize';
import { AuthHttp, } from 'angular2-jwt';
import _ from 'lodash';

import { Party } from './party.model';
import { Office } from './candidate.model';
import { Location } from '../shared/location.model';
import { Member } from './member.model';
import { User } from '../shared/auth/user.model';

const API_URL = 'api/party';

/**
 * This service manages political parties.
 */
@Injectable()
export class PartyService {

	constructor(
		private http: AuthHttp
	) { }

	/** Requests a political party by its given key. */
	find(key: string): Observable<Party> {
		return this.http.get(`${API_URL}/${key}`)
			.map((res: Response) => {
				const json = res.json();
				const party = Deserialize(json, Party);
				return party;
			});
	}

	/** Requests all political parties. */
	findAll(): Observable<Party[]> {
		return this.http.get(API_URL)
			.map((res: Response) => {
				const json = res.json();
				const parties = Deserialize(json, Party);
				return parties;
			});
	}

	/** Deletes the given political party. */
	remove(party: Party): Observable<Party> {
		return this.http.delete(`${API_URL}/${party._key}`)
			.map((res: Response) => {
				const json = res.json();
				const party = Deserialize(json, Party);
				return party;
			});
	}

	/** Saves the given political party. */
	save(party: Party): Observable<Party> {
		const body = JSON.stringify(Serialize(party));
		const options = this.defaultOptions();
		const stream = party._rev ?
			this.http.patch(`${API_URL}/${party._key}`, body, options) :
			this.http.post(API_URL, body, options);

		return stream.map(response => {
			const saved = Deserialize(response.json(), Party);
			return saved;
		});
	}

	/**
	 * Searches for users that matches the `query` parameter to add as members of the `party`.
	 */
	searchUsers(party: Party, query: string): Observable<User[]> {
		return this.http.get(`${API_URL}/${party._key}/member?qry=${query}`)
			.map((res: Response) => {
				const json = res.json();
				const users = Deserialize(json, User);
				return users;
			});
	};

	/** Adds the given member into the party. */
	addMember(party: Party, office: Office, user: User, location: Location): Observable<Member> {
		user = _.pick(user, '_key') as User;
		location = _.pick(location, '_key') as Location;
		const member = new Member(user, office, location);
		const body = JSON.stringify(Serialize(member));
		const options = this.defaultOptions();
		return this.http.post(`${API_URL}/${party._key}/member`, body, options)
		.map(response => {
			const added = Deserialize(response.json(), Member);
			return added;
		});
	}

	/** Sets the member's admin flag on/off. */
	toggleAdmin(party: Party, member: Member): Observable<boolean> {
		const body = '';
		const options = this.defaultOptions();
		const url = `${API_URL}/${party._key}/${member._key}/toggleAdmin`;
		return this.http.post(url, body, options)
			.map(response => response.json());
	}

	/** Removes the given member of the party. */
	removeMember(party: Party, member: Member): Observable<Member> {
		return this.http.delete(`${API_URL}/${party._key}/${member._key}`)
			.map((res: Response) => {
				const json = res.json();
				const member = Deserialize(json, Member);
				return member;
			});
	}

	private defaultOptions() {
		const headers = new Headers({ 'Content-Type': 'application/json' });
		return new RequestOptions({ headers: headers });
	}

}
