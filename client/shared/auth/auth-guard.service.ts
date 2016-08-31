'use strict';

import { Injectable } from '@angular/core';
import {
	CanActivate,
	Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from './auth.service';

/**
 * This guard ensures only authenticated users can access the route.
 * 
 * It also displays the login form if the user isn't authenticated.
 */
@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private authService: AuthService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.authService.authenticated) return true;
		this.authService.login(state.url);
		return false;
	}

}
