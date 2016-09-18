'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from 'ng2-translate/ng2-translate';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/partition';
import 'rxjs/add/operator/retry';

import { PartyService } from '../party.service';
import { Party } from '../party.model';
import { Office } from './candidate.model';
import { Member } from './member.model';
import { User } from '../../shared/auth/user.model';
import { Location } from '../../shared/location.model';
import { LocationService } from '../../shared/location.service';

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

	partyForm: FormGroup;
	addMemberForm: FormGroup;
	party: Party;

	offices: Office[] = [
		'Presidente',
		'Vice-Presidente',
		'Governador',
		'Vice-Governador',
		'Senador',
		'Deputado Federal',
		'Deputado Estadual',
		'Prefeito',
		'Vereador'
	];

	autoCompleteUsers: User[];
	autoCompleteLocations: Location[];

	newOffice: Office;
	newUser: User;
	newLocation: Location;

	constructor(
		private partyService: PartyService,
		private locationService: LocationService,
		private translate: TranslateService,
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router
	) { }

	/**
	 * 1. Loads the model from the resolve guard or creates a new one.
	 * 1. Configs component's forms.
	 * 1. Register handlers that watches changes on fields' values.
	 * 
	 * @see {@link PartyResolveService}
	 */
	ngOnInit() {
		this.route.data.forEach((data: { model: Party }) => {
			this.party = data.model || new Party(); // update || insert
			this.partyForm = this.fb.group({
				'alias': [this.party._key, Validators.required],
				'name': [this.party.name, Validators.required],
				'code': [this.party.code],
			});
			this.addMemberForm = this.fb.group({
				'office': [this.newOffice, Validators.required],
				'user': [this.newUser, Validators.compose([
					Validators.required,
					c => c.value instanceof User ? null : { valid: false },
				])],
				'location': [this.newLocation, Validators.compose([
					Validators.required,
					c => c.value instanceof Location ? null : { valid: false },
				])],
			});
			this.watchOffice();
			this.watchUser();
			this.watchLocation();
		});
	}

	/** Configs the location field according to the selected office. */
	private watchOffice() {
		this.addMemberForm.get('office').valueChanges.subscribe(
			office => {
				this.newOffice = office;
				let newLocation = ['Presidente', 'Vice-Presidente'].includes(office) ?
					new Location('BR') : null;
				this.addMemberForm.get('location').setValue(newLocation, { emitEvent: false });
			},
			this.redirectOnError.bind(this)
		);
	}

	/** Provides autocomplete functionality for the 'user' field. */
	private watchUser() {
		const [valid, invalid] = this.addMemberForm.get('user').valueChanges
			.partition(value => value && value.length > 2);

		valid.debounceTime(400).distinctUntilChanged()
		.flatMap(value => this.partyService.searchUsers(this.party, value))
			.retry()
			.subscribe(
				users => this.autoCompleteUsers = users,
				this.redirectOnError.bind(this)
			);

		invalid.subscribe(
				value => this.autoCompleteUsers = null,
				this.redirectOnError.bind(this)
		);
	}

	/** Provides autocomplete functionality for the 'location' field. */
	private watchLocation() {
		const [valid, invalid] = this.addMemberForm.get('location').valueChanges
			.partition(value => value && value.length > 1);

		valid.debounceTime(400).distinctUntilChanged()
		.flatMap(value => {
				let level: 1 | 2;
				level = ['Prefeito', 'Vereador'].includes(this.newOffice) ? 2 : 1;
				return this.locationService.search(level, value);
			})
			.retry()
			.subscribe(
				locations => this.autoCompleteLocations = locations,
				this.redirectOnError.bind(this)
			);

		invalid.subscribe(
				value => this.autoCompleteLocations = null,
				this.redirectOnError.bind(this)
		);
	}

	onChooseUser(user: User): void {
		this.autoCompleteUsers = null;
		this.addMemberForm.get('user').setValue(user, { emitEvent: false });
	}

	onChooseLocation(location: Location): void {
		this.autoCompleteLocations = null;
		this.addMemberForm.get('location').setValue(location, { emitEvent: false });
	}

	isLocationVisible(): boolean {
		return this.newOffice
			&& ! ['Presidente', 'Vice-Presidente'].includes(this.newOffice);
	}

	/** Toggles visibility of the error message for the given field. */
	showError(form: FormGroup, control: string) {
		return form.get(control).valid ? "hidden" : "inherit";
	}

	/** Submit button event handler. */
	onPartySubmit() {
		this.party._key = this.partyForm.get('alias').value;
		this.party.code = this.partyForm.get('code').value;
		this.party.name = this.partyForm.get('name').value;
		this.partyService.save(this.party).subscribe(
			party => this.router.navigate(['party', party._key]),
			this.redirectOnError.bind(this)
		);
	}

	/** Submit button event handler. */
	onAddMember() {
		const { office, user, location } = this.addMemberForm.value;
		this.partyService.addMember(this.party, office, user, location).subscribe(
			member => this.party.members.push(member),
			error => this.redirectOnError(error),
			() => this.addMemberForm.reset()
		);
	}

	toggleAdmin(member: Member) {
		this.partyService.toggleAdmin(this.party, member).subscribe(
			admin => member.admin = admin,
			this.redirectOnError.bind(this)
		);
	}

	onDelete(member: Member) {
		const message = this.translate.instant('APP.CONFIRMATION');
		if (window.confirm(message)) {
			this.partyService.removeMember(this.party, member).subscribe(
				member => this.party.remove(member),
				this.redirectOnError.bind(this)
			);
		}
	}

	/** Cancel button event handler. */
	onCancel() {
		if (this.party._rev) {
			this.router.navigate(['party', this.party._key]);
		} else {
			this.router.navigate(['/admin/party/list']);
		}
	}

	private redirectOnError(error: { status: any }) {
		this.router.navigate(['/error', error.status], { skipLocationChange: true });
	}

}
