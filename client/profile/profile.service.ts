'use strict';

import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Deserialize, Serialize } from 'cerialize';
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
		return this.authService.user.flatMap(
			user => this.http.get(`${API_URL}/${username || user._key}`)
				.map((res: Response) => Deserialize(res.json(), User))
		);
	}

	/** Saves modifications of the given user. */
	save(user: User): Observable<User> {
		const body = JSON.stringify(Serialize(user));
		const headers = new Headers({ 'Content-Type': 'application/json' });
		const options = new RequestOptions({ headers: headers });
		const url = `${API_URL}/${user._key}`;
		return this.http.patch(url, body, options)
			.map((res: Response) => {
				const updated = Deserialize(res.json(), User);
				return updated;
			});
	}

	/** Follows the given user. */
	follow(user: User): Observable<any> {
		const body: string = null;
		const headers = new Headers({ 'Content-Type': 'application/json' });
		const options = new RequestOptions({ headers: headers });
		const url = `${API_URL}/${user._key}/follow`;
		return this.http.post(url, body, options)
			.map((res: Response) => {
				const created = res.json();
				return created;
			});
	}

	/** Unfollows the given user. */
	unfollow(user: User): Observable<any> {
		const url = `${API_URL}/${user._key}/follow`;
		return this.http.delete(url)
			.map((res: Response) => {
				const removed = res.json();
				return removed;
			});
	}
}
