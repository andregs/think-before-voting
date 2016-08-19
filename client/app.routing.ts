'use strict';

import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
	{ path: '', redirectTo: 'answer', pathMatch: 'full' },
	{ path: 'user', loadChildren: 'profile/profile.module' },
];

export const routing = RouterModule.forRoot(appRoutes);
