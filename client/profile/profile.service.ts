'use strict';

import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize } from 'cerialize';

import { User } from '../auth/user.model';

@Injectable()
export class ProfileService {

	private API_URL = 'api/user';

	constructor(private http: Http) {
	}

	find(username: string): Observable<User> {
		return this.http.get(`${this.API_URL}/${username}`)
			.map((res: Response) => {
				const json = res.json();
				return Deserialize(json, User);
			});
	}

}
