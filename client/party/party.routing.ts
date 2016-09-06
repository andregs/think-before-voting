'use strict';

import { RouterModule } from '@angular/router';

import { PartyComponent } from './party.component';
import { PartyResolveService } from './party-resolve.service';
import { EditPartyComponent } from './edit/edit-party.component';

export const routing = RouterModule.forChild([
	{ path: 'new', component: EditPartyComponent },
	{
		path: 'edit/:key',
		component: EditPartyComponent,
		resolve: { model: PartyResolveService }
	},
	{
		path: ':key',
		component: PartyComponent,
		resolve: { model: PartyResolveService }
	},
]);
