'use strict';

import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize } from 'cerialize';
import { AuthHttp, } from 'angular2-jwt';

import { Party } from './party.model';

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
		const body = JSON.stringify(party);
		const options = this.defaultOptions();
		const stream = party._key ?
			this.http.patch(`${API_URL}/${party._key}`, body, options) :
			this.http.post(API_URL, body, options);

		return stream.map(response => {
			const saved = Deserialize(response.json(), Party);
			return saved;
		});
	}

	private defaultOptions() {
		const headers = new Headers({ 'Content-Type': 'application/json' });
		return new RequestOptions({ headers: headers });
	}

}
