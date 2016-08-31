'use strict';

import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { tokenNotExpired, AuthHttp } from 'angular2-jwt';

import { DeserializeInto } from 'cerialize';

import { User } from './user.model';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {

	private API_URL = 'api/user';
	private model = new User();

	lock = new Auth0Lock(
		'8w82FlSkzDwMpyMe7pS9KGITEbpTvIOR',
		'andregs.auth0.com',
		{
			usernameStyle: 'username', // why is this not working?
			autoclose: true,
			language: 'en',
			auth: {
				redirect: false, // should be true because of https://github.com/auth0/lock/issues/71
			}
		}
	);

	constructor(
		private authHttp: AuthHttp,
		private router: Router
	) {
		this.lock.on("authenticated", (result: any) => {
			localStorage.setItem('id_token', result.idToken);
			this.user.subscribe();
		});
	}

	public login() {
		this.lock.show();
	};

	public get authenticated() {
		return tokenNotExpired();
	};

	public logout() {
		localStorage.removeItem('id_token');
		this.model = new User();
		window.location.reload(); // TODO notify instead of reload
	};

	public get user(): Observable<User> {
		const idToken = localStorage.getItem('id_token');

		if (!idToken) {
			this.model = new User();
			return Observable.of(this.model);
		} else if (this.model._key) {
			return Observable.of(this.model);
		}

		const getProfileRx: (id: string) => Observable<{}>
			= Observable.bindNodeCallback(this.lock.getProfile.bind(this.lock));
		return getProfileRx(idToken)
			.flatMap((profile: any) => {
				DeserializeInto(profile, User, this.model);
				// upsert the User into my own DB
				let body = JSON.stringify(this.model);
				let headers = new Headers({ 'Content-Type': 'application/json' });
				let options = new RequestOptions({ headers: headers });
				return this.authHttp.post(this.API_URL, body, options);
			})
			.map((res: Response) => {
				DeserializeInto(res.json(), User, this.model);
				return this.model;
			})
			.catch((e: any) => {
				this.logout();
				return Observable.throw(e);
			});
	}
}
