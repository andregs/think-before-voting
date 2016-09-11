'use strict';

import { Component } from '@angular/core';

import { AuthService } from '../shared/auth/auth.service';

@Component({
	templateUrl: 'client/home/home.component.html',
	// styleUrls: ['client/home/home.component.css'],
})
export class HomeComponent {

	constructor(
		private authService: AuthService
	) { }

}
