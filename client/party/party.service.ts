'use strict';

import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize } from 'cerialize';

import { Party } from './party.model';

@Injectable()
export class PartyService {

	private API_URL = 'api/party';

	constructor(private http: Http) {
	}

	find(abbreviation: string): Observable<Party> {
		return this.http.get(`${this.API_URL}/${abbreviation}`)
			.map((res: Response) => {
				const json = res.json();
				const party = Deserialize(json, Party);
				console.log('party.service', party);
				return party;
			});
	}

}
