'use strict';

import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';

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
		private authHttp: AuthHttp
	) {
		const idToken = localStorage.getItem('id_token');
		if (idToken) this.onAuthenticated(idToken);
		this.lock.on("authenticated", (result: any) => {
			localStorage.setItem('id_token', result.idToken);
			this.onAuthenticated(result.idToken);
		});
	}

	public onAuthenticated(idToken: string) {
		this.lock.getProfile(idToken, (error: any, profile: any) => {
			if (error) {
				console.error(error);
				return;
			}

			// upsert the User in my own DB
			DeserializeInto(profile, User, this.user);
			let body = JSON.stringify(this.user);
			let headers = new Headers({ 'Content-Type': 'application/json' });
			let options = new RequestOptions({ headers: headers });

			this.authHttp.post(this.API_URL, body, options).subscribe(
				(res: Response) => DeserializeInto(res.json(), User, this.user),
				error => this.logout()
			);
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
	};

	public get user() {
		return this.model;
	}
}
