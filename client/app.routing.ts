'use strict';

import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'answer', loadChildren: 'answer/answer.module' },
	{ path: 'profile', loadChildren: 'profile/profile.module' },
	{ path: 'party', loadChildren: 'party/party.module' },
];

export const routing = RouterModule.forRoot(appRoutes);
