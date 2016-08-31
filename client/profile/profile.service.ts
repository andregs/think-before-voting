'use strict';

import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize } from 'cerialize';
import { AuthHttp } from 'angular2-jwt';

import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/auth/user.model';

@Injectable()
export class ProfileService {

	private API_URL = 'api/user';

	constructor(
		private http: AuthHttp,
		private authService: AuthService
	) { }

	find(username?: string): Observable<User> {
		if (username) {
			return this.http.get(`${this.API_URL}/${username}`)
				.map((res: Response) => {
					const json = res.json();
					return Deserialize(json, User);
				});
		} else {
			return this.authService.user;
		}
	}

	post(user: User): Observable<User> {
		let body = JSON.stringify(user);
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http.post(this.API_URL, body, options)
			.map((res: Response) => {
				return Deserialize(res.json(), User);
			});
	}
}
