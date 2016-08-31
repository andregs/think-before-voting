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

const API_URL = 'api/user';

/**
 * This service manages Auth0 login/logout and publishes the authenticated user's profile.
 */
@Injectable()
export class AuthService {

	private model = new User();
	private redirectUrl: string;

	lock = new Auth0Lock(
		'8w82FlSkzDwMpyMe7pS9KGITEbpTvIOR',
		'andregs.auth0.com',
		{
			usernameStyle: 'username', // FIXME why is this not working?
			closable: false,
			language: 'en', // TODO should use the same language as the app
			auth: {
				redirect: false, // should be true? https://github.com/auth0/lock/issues/71
			}
		}
	);

	/** Creates the service and registers the callback to the Auth0 authenticated event. */
	constructor(
		private authHttp: AuthHttp,
		private router: Router
	) {
		this.lock.on("authenticated", (result: any) => {
			localStorage.setItem('id_token', result.idToken);
			this.user.subscribe(); // to fill the cache
			if (this.redirectUrl)
				this.router.navigate([this.redirectUrl]);
			Observable.of(true).delay(2500) // to preserve the 'thanks' animation
				.subscribe(val => this.lock.hide());
		});
	}

	/**
	 * Displays the Auth0 login form.
	 * 
	 * After login, redirects the user to the optionally provided URL.
	 */
	public login(redirectUrl?: string) {
		this.redirectUrl = redirectUrl;
		this.lock.show();
	};

	/** True if the user is authenticated, false otherwise. */
	public get authenticated() {
		return tokenNotExpired();
	};

	/** Ends the session. */
	public logout() {
		localStorage.removeItem('id_token');
		this.model = new User();
		window.location.reload(); // TODO notify instead of reload
	};

	/** The authenticated user's profile. */
	public get user(): Observable<User> {
		const idToken = localStorage.getItem('id_token');

		if (!idToken) { // not authenticated
			this.model = new User();
			return Observable.of(this.model);
		} else if (this.model._key) { // authenticated and in cache
			return Observable.of(this.model);
		}

		// authenticated but not in cache, so we have to request the profile

		// start by requesting the auth0 profile
		const getProfileRx: (id: string) => Observable<{}>
			= Observable.bindNodeCallback(this.lock.getProfile.bind(this.lock));
		return getProfileRx(idToken)
			.flatMap((profile: any) => {
				// send (upsert) the auth0 profile to our own DB
				DeserializeInto(profile, User, this.model);
				let body = JSON.stringify(this.model);
				let headers = new Headers({ 'Content-Type': 'application/json' });
				let options = new RequestOptions({ headers: headers });
				return this.authHttp.post(API_URL, body, options);
			})
			.map((res: Response) => { // cache the result
				DeserializeInto(res.json(), User, this.model);
				return this.model;
			})
			.catch((e: any) => {
				this.logout();
				return Observable.throw(e);
			});
	}
}
