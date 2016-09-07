'use strict';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';

import { ProfileService } from '../profile.service';
import { User } from '../../shared/auth/user.model';

/** Component that handles the edit profile form page. */
@Component({
	selector: 'tbv-profile-edit',
	templateUrl: 'client/profile/edit/edit-profile.component.html',
	styleUrls: ['client/profile/edit/edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {

	private model: User;

	constructor(
		private profileService: ProfileService,
		private router: Router
	) { }

	/** Requests the authenticated user's profile. */
	ngOnInit() {
		this.profileService.find().subscribe(
			user => this.model = user,
			error => console.error(error)
		);
	}

	/** Submit button event handler. */
	onSubmit() {
		this.profileService.post(this.model).subscribe(
			user => {
				this.router.navigate(['profile', this.model._key]);
			},
			error => console.error(error)
		);
	}

	/** Cancel button event handler. */
	onCancel() {
		this.router.navigate(['profile', this.model._key]);
	}

	/** Toggles visibility of the error message for the given field. */
	showError(field: NgModel) {
		return field.valid ? "hidden" : "inherit";
	}

	get user() { return this.model; }

}
