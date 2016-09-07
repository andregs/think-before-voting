'use strict';

import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize } from 'cerialize';
import { AuthHttp } from 'angular2-jwt';

import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/auth/user.model';

const API_URL = 'api/user';

/** This service provides methods for user profile management. */
@Injectable()
export class ProfileService {

	constructor(
		private http: AuthHttp,
		private authService: AuthService
	) { }

	/** Finds user by key. */
	find(username?: string): Observable<User> {
		if (username) {
			return this.http.get(`${API_URL}/${username}`)
				.map((res: Response) => {
					const json = res.json();
					return Deserialize(json, User);
				});
		} else {
			return this.authService.user;
		}
	}

	/** Saves modifications of the given user. */
	save(user: User): Observable<User> {
		const body = JSON.stringify(user);
		const headers = new Headers({ 'Content-Type': 'application/json' });
		const options = new RequestOptions({ headers: headers });
		const url = `${API_URL}/${user._key}`;
		return this.http.patch(url, body, options)
			.map((res: Response) => {
				const updated = Deserialize(res.json(), User);
				return updated;
			});
	}
}
