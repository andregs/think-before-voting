'use strict';

import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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

	toggle() {
		this.opened = !this.opened;
		this.toggleNav.emit(this.opened);
	}

	goToMe() {
		if (this.authService.authenticated) {
			this.authService.user.subscribe(
				user => this.router.navigate(['profile', user.nickname])
			);
		} else {
			this.authService.login();
		}
	}

}
