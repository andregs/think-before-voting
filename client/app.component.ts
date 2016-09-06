'use strict';

import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { AuthService } from './shared/auth/auth.service';
import { User } from './shared/auth/user.model';

@Component({
	selector: 'tbv-app',
	templateUrl: 'client/app.component.html',
})
export class AppComponent {

	user: User;

	/** Sets the app language. */
	constructor(
		private translate: TranslateService,
		private authService: AuthService
	) {
		translate.setDefaultLang('en');
		translate.use('en');
	}

	/** Gets the authenticated user for authorization purposes. */
	ngOnInit() {
		this.authService.user.subscribe(
			user => this.user = user,
			error => console.error(error)
		);
	}

}
