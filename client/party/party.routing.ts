'use strict';

import { RouterModule } from '@angular/router';

import { PartyComponent } from './party.component';

export const routing = RouterModule.forChild([
	{ path: ':abbreviation', component: PartyComponent }
]);
