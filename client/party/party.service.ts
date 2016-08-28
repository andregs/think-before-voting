'use strict';

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize } from 'cerialize';
import { AuthHttp } from 'angular2-jwt';

import { Party } from './party.model';

@Injectable()
export class PartyService {

	private API_URL = 'api/party';

	constructor(private http: AuthHttp) {
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
