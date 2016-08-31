'use strict';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';

import { ProfileService } from '../profile.service';
import { User } from '../../shared/auth/user.model';

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

	ngOnInit() {
		this.profileService.find().subscribe(
			user => this.model = user,
			error => console.error(error)
		);
	}

	onSubmit() {
		this.profileService.post(this.model).subscribe(
			user => {
				this.router.navigate(['profile', this.model.nickname]);
			},
			error => console.error(error)
		);
	}

	onCancel() {
		this.router.navigate(['profile', this.model.nickname]);
	}

	showError(field: NgModel) {
		return field.valid ? "hidden" : "inherit";
	}

	get user() { return this.model; }

}
