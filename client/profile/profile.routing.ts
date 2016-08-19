'use strict';

import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';

export const routing = RouterModule.forChild([
	{ path: ':name', component: ProfileComponent }
]);
