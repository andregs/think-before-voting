'use strict';

import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/auth/user.model';

@Component({
	templateUrl: 'client/home/home.component.html',
	// styleUrls: ['client/home/home.component.css'],
})
export class HomeComponent implements OnInit {

	user: User;

	constructor(
		private authService: AuthService
	) { }

	ngOnInit() {
		this.authService.user.subscribe(
			user => this.user = user
		);
	}

}
