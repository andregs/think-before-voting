'use strict';

import { Injectable, Inject } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { tokenNotExpired, AuthHttp } from 'angular2-jwt';
import { Serialize, Deserialize, DeserializeKeysFrom } from 'cerialize';

import { User } from './user.model';

// Avoid name not found warnings
declare var Auth0Lock: any;

const API_URL = 'api/user';

/**
 * This service manages Auth0 login/logout and publishes the authenticated user's profile.
 */
@Injectable()
export class AuthService {

	private userSource = new ReplaySubject<User>(1);
	private redirectUrl: string;
	private lock: any;

	/** Creates the service and registers the callback to the Auth0 authenticated event. */
	constructor(
		@Inject('config') private config: any,
		private authHttp: AuthHttp,
		private router: Router
	) {
		this.lock = new Auth0Lock(
			this.config.client_id,
			this.config.domain, {
				usernameStyle: 'username',
				closable: false,
				language: 'pt-BR', // TODO should use the same language as the app
				auth: { redirect: false } // should be true? https://github.com/auth0/lock/issues/71
			}
		);
		// this emits a user if he/she is already signed in
		this.onAuthenticated();
		// this registers a callback to emit a user when he/she signs in
		this.lock.on("authenticated", (result: any) => {
			localStorage.setItem('id_token', result.idToken);
			this.onAuthenticated();
			if (this.redirectUrl)
				this.router.navigate([this.redirectUrl]);
			Observable.of(true).delay(2231) // to preserve the 'thanks' animation
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
	};

	/** The authenticated user's profile. */
	public get user(): Observable<User> {
		return this.userSource.asObservable();
	}

	/** 
	 * Handler for the authenticated event.
	 * Requests Auth0 profile, sends it to our DB and then emit a User object.
	 */
	private onAuthenticated(): void {
		const idToken = localStorage.getItem('id_token');
		if (this.authenticated && idToken) {
			const getProfileRx: (id: string) => Observable<{}>
				= Observable.bindNodeCallback(this.lock.getProfile.bind(this.lock));
			getProfileRx(idToken)
				.flatMap((profile: any) => {
					DeserializeKeysFrom(User.keyTransformer);
					const user: User = Deserialize(profile, User);
					DeserializeKeysFrom(null);
					const body = JSON.stringify(Serialize(user, User));
					const headers = new Headers({ 'Content-Type': 'application/json' });
					const options = new RequestOptions({ headers: headers });
					const url = `${API_URL}/${user._key}/upsert`;
					return this.authHttp.post(url, body, options);
				})
				.subscribe((res: Response) => {
					const user = Deserialize(res.json(), User);
					this.userSource.next(user);
					this.userSource.complete();
				},
				error => {
					localStorage.removeItem('id_token'); // logout
					this.userSource.error(error);
				});
		}
	}
}
