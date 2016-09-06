'use strict';

import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './home/admin-home.component';
import { PartyListComponent } from './party/party-list.component';

export const routing = RouterModule.forChild([
	{
		path: '',
		component: AdminComponent,
		children: [
			{ path: '', component: AdminHomeComponent },
			{ path: 'party/list', component: PartyListComponent },
		]
	},
]);
