'use strict';

import { Component } from '@angular/core';

/** Component that controls the homepage of the administration area. */
@Component({
	selector: 'tbv-admin-home',
	templateUrl: 'client/admin/home/admin-home.component.html',
	// styleUrls: ['client/admin/home/admin-home.component.css'],
})
export class AdminHomeComponent {

	options = [
		{ link: ['party/list'], title: 'PARTY_LIST' },
		{ link: ['/party/new'], title: 'ADD_PARTY' }
	];

}
