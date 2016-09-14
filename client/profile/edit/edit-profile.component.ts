'use strict';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/retry';
import _ from 'lodash';

import { ProfileService } from '../profile.service';
import { LocationService } from '../../shared/location.service';
import { Location } from '../../shared/location.model';
import { User } from '../../shared/auth/user.model';

/** Component that handles the edit profile form page. */
@Component({
	selector: 'tbv-profile-edit',
	templateUrl: 'client/profile/edit/edit-profile.component.html',
	styleUrls: ['client/profile/edit/edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {

	private profileForm: FormGroup;
	private model: User;
	private locations: Location[];

	constructor(
		private profileService: ProfileService,
		private locationService: LocationService,
		private fb: FormBuilder,
		private router: Router,
	) { }

	/** Requests the authenticated user's profile. */
	ngOnInit() {
		this.profileService.find().subscribe(
			user => {
				this.model = user;
				this.profileForm = this.fb.group({
					'name': [user.name, Validators.required],
					'nickname': [user.nickname],
					'location': [user.location, Validators.required],
				});
				this.watchLocation();
			},
			this.redirectOnError.bind(this)
		);
	}

	/** Provides autocomplete functionality for the 'location' field. */
	private watchLocation() {
		this.profileForm.get('location').valueChanges
			.debounceTime(400).distinctUntilChanged()
			.filter(value => value.length > 2)
			.flatMap(value => this.locationService.search(2, value))
			.retry() // so 404 will re-subscribe
			.subscribe(
				locations => this.locations = locations,
				this.redirectOnError.bind(this)
			);
	}

	/** Handler for the autocomplete's choose item event */
	onChoose(location: Location) {
		this.locations = null;
		this.profileForm.get('location').setValue(location);
	}

	/** Submit button event handler. */
	onSubmit() {
		// TODO should update auth0 profile
		_.assign(this.model, this.profileForm.value);
		this.profileService.save(this.model).subscribe(
			user => this.router.navigate(['profile', this.model._key]),
			this.redirectOnError.bind(this)
		);
	}

	/** Cancel button event handler. */
	onCancel() {
		this.router.navigate(['profile', this.model._key]);
	}

	/** Toggles visibility of the error message for the given field. */
	showError(control: string) {
		return this.profileForm.get(control).valid ? "hidden" : "inherit";
	}

	get user() { return this.model; }

	private redirectOnError(error: { status: any }) {
		this.router.navigate(['/error', error.status], { skipLocationChange: true });
	}

}
