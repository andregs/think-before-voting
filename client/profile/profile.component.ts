'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProfileService } from './profile.service';
import { User } from '../shared/auth/user.model';

@Component({
	selector: 'tbv-profile',
	templateUrl: 'client/profile/profile.component.html',
	styleUrls: ['client/profile/profile.component.css'],
})
export class ProfileComponent implements OnInit {

	user: User;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private profileService: ProfileService
	) {}

	ngOnInit() {
		this.route.params
			.flatMap(params => this.profileService.find(params['name']))
			.subscribe(
				user => this.user = user,
				error => this.router.navigate(['/error', error.status], { skipLocationChange: true })
			);
	}

	/** Follows / unfollows this user. */
	toggleFollow() {
		const stream = this.user.followed ?
			this.profileService.unfollow(this.user) :
			this.profileService.follow(this.user);

		stream.subscribe(
			result => this.user.followed = !this.user.followed,
			this.redirectOnError.bind(this)
		);
	}

	private redirectOnError(error: { status: any }) {
		this.router.navigate(['/error', error.status], { skipLocationChange: true });
	}

}
