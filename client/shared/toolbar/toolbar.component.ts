'use strict';

import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/** Component that handles the app's toolbar. */
@Component({
	selector: 'tbv-toolbar',
	templateUrl: 'client/shared/toolbar/toolbar.component.html',
	styleUrls: ['client/shared/toolbar/toolbar.component.css'],
})
export class ToolbarComponent {

	opened = false;

	@Output()
	toggleNav = new EventEmitter<boolean>();

	constructor(
		private authService: AuthService,
		private router: Router
	) { }

	/**
	 * Opens / closes the main menu.
	 * It emits an event so other components can be notified.
	 */
	toggle() {
		this.opened = !this.opened;
		this.toggleNav.emit(this.opened);
	}

	/** Navigates to the search page. */
	goToSearch() {
		this.router.navigate(['search']);
	}

	/** 
	 * Navigates to My Profile page if the user is authenticated.
	 * Displays the login form otherwise.
	 */
	goToMe() {
		if (this.authService.authenticated) {
			this.authService.user.subscribe(
				user => this.router.navigate(['profile', user._key])
			);
		} else {
			this.authService.login();
		}
	}

}
