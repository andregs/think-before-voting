'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModel } from '@angular/forms';

import { PartyService } from '../party.service';
import { Party } from '../party.model';

/** 
 * This component manages the political party form page.
 * This form can be used to create or update a political party.
 */
@Component({
	selector: 'tbv-edit-party',
	templateUrl: 'client/party/edit/edit-party.component.html',
	// styleUrls: ['client/party/edit/edit-party.component.css'],
})
export class EditPartyComponent implements OnInit {

	party: Party;

	constructor(
		private partyService: PartyService,
		private route: ActivatedRoute,
		private router: Router
	) { }

	/**
	 * Loads the model from the resolve guard or creates a new one.
	 * @see {@link PartyResolveService}
	 */
	ngOnInit() {
		this.route.data.forEach((data: { model: Party }) => {
			this.party = data.model || new Party(); // update || insert
		});
	}

	/** Toggles visibility of the error message for the given field. */
	showError(field: NgModel) {
		return field.valid ? "hidden" : "inherit";
	}

	/** Submit button event handler. */
	onSubmit() {
		this.partyService.save(this.party).subscribe(
			party => this.router.navigate(['party', party._key]),
			error => console.error(error)
		);
	}

	/** Cancel button event handler. */
	onCancel() {
		if (this.party._key) {
			this.router.navigate(['party', this.party._key]);
		} else {
			this.router.navigate(['/admin/party/list']);
		}
	}

}
