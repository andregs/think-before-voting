'use strict';

import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './shared/auth/auth-guard.service';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'answer', loadChildren: 'answer/answer.module', canActivate: [ AuthGuard ] },
	{ path: 'profile', loadChildren: 'profile/profile.module', canActivate: [ AuthGuard ] },
	{ path: 'party', loadChildren: 'party/party.module', canActivate: [ AuthGuard ] },
];

export const routing = RouterModule.forRoot(appRoutes);
