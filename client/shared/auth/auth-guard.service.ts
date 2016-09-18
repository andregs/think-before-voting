'use strict';

import { Injectable } from '@angular/core';
import {
	CanActivate,
	Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

/**
 * This guard ensures that:
 * 1. Only authenticated users can access this route.
 * 1. Only authorized users can navigate to this route if it's an admin route.
 * 
 * It also displays the login form if the user isn't authenticated.
 */
@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		if (this.authService.authenticated) {
			if (route.url.length && route.url[0].path === 'admin') {
				return this.authService.user.flatMap(user => {
					return user.admin ?
						Observable.of(true) :
						this.router.navigate(['/error', 401], { skipLocationChange: true });
				}).first().toPromise();
			} else {
				return Promise.resolve(true);
			}
		}
		this.authService.login(state.url);
		return Promise.resolve(false);
	}

}
