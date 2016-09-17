'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { AuthService } from '../shared/auth/auth.service';
import { User } from '../shared/auth/user.model';
import { PartyService } from './party.service';
import { Party } from './party.model';

/** Component that controls the page that displays a political party. */
@Component({
	selector: 'tbv-party',
	templateUrl: 'client/party/party.component.html',
	// styleUrls: ['client/party/party.component.css'],
})
export class PartyComponent implements OnInit {

	party: Party;
	user: User;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private partyService: PartyService,
		private authService: AuthService,
		private translate: TranslateService
	) { }

	/**
	 * Requests the party specified on the URL param.
	 * Requests also the authenticated user, for authorization purposes.
	 * @see {@link party.routing.ts}
	 */
	ngOnInit() {
		this.route.data.forEach((data: { model: Party }) => this.party = data.model);
		this.authService.user.subscribe(user => this.user = user);
	}

	/** Navigates to the new party form. */
	onNew() {
		this.router.navigate(['/party/new']);
	}

	/** Excludes this political party from the system. */
	onDelete() {
		const message = this.translate.instant('APP.CONFIRMATION');
		const confirm = window.confirm(message);
		if (confirm) {
			this.partyService.remove(this.party).subscribe(
				result => this.router.navigate(['/admin/party/list']),
				error => this.router.navigate(['/error', error.status], { skipLocationChange: true })
			);
		}
	}

	/** 
	 * Checks if the authenticated user can edit the party.
	 */
	get partyEditable(): boolean {
		return this.party && this.party.isAdmin(this.user);
	}

}
