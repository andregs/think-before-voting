'use strict';

import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { EditProfileComponent } from './edit/edit-profile.component';

export const routing = RouterModule.forChild([
	{ path: 'edit', component: EditProfileComponent },
	{ path: ':name', component: ProfileComponent },
]);
