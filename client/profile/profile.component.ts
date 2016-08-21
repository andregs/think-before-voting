'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { ProfileService } from './profile.service';

@Component({
	selector: 'tbv-profile',
	templateUrl: 'client/profile/profile.component.html',
	styleUrls: ['client/profile/profile.component.css'],
})
export class ProfileComponent implements OnInit {

	user: Object;

	constructor(
		private route: ActivatedRoute,
		private profileService: ProfileService,
		translate: TranslateService
	) {
		// I think this should be done only in AppComponent
		// is it a lazy loading issue?
		translate.setDefaultLang('en');
		translate.use('en');
	}

	ngOnInit() {
		this.route.params
			.flatMap(params => this.profileService.find(params['name']))
			.subscribe(
				user => this.user = user,
				error => console.error(error)
			);
	}

}
