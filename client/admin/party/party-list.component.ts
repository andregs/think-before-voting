'use strict';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartyService } from '../../party/party.service';
import { Party } from '../../party/party.model';

/** Component that controls the page that displays the list of political parties. */
@Component({
	selector: 'tbv-party-list',
	templateUrl: 'client/admin/party/party-list.component.html',
	// styleUrls: ['client/admin/party/party-list.component.css'],
})
export class PartyListComponent implements OnInit {

	parties: Party[];

	constructor(
		private partyService: PartyService,
		private router: Router
	) { }

	/**
	 * Requests the list of all political parties.
	 */
	ngOnInit() {
		this.partyService.findAll().subscribe(
			parties => this.parties = parties,
			error => this.router.navigate(['/error', error.status], { skipLocationChange: true })
		);
	}

}
