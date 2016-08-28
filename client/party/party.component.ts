'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PartyService } from './party.service';
import { Party } from './party.model';

@Component({
	selector: 'tbv-party',
	templateUrl: 'client/party/party.component.html',
	// styleUrls: ['client/party/party.component.css'],
})
export class PartyComponent implements OnInit {

	party: Party;

	constructor(
		private route: ActivatedRoute,
		private partyService: PartyService
	) {}

	ngOnInit() {
		this.route.params
			.flatMap(params => this.partyService.find(params['abbreviation']))
			.subscribe(
				party => this.party = party,
				error => console.error(error)
			);
	}

}
