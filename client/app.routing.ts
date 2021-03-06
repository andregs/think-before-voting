'use strict';

import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './shared/auth/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { SearchComponent } from './search/search.component';

const appRoutes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'admin', loadChildren: 'admin/admin.module', canActivate: [ AuthGuard ] },
	{ path: 'qa', loadChildren: 'qa/qa.module', canActivate: [ AuthGuard ] },
	{ path: 'profile', loadChildren: 'profile/profile.module', canActivate: [ AuthGuard ] },
	{ path: 'party', loadChildren: 'party/party.module', canActivate: [ AuthGuard ] },
	{ path: 'search', component: SearchComponent },
	{ path: 'error/:code', component: ErrorComponent },
	{ path: '**', component: ErrorComponent },
];

export const routing = RouterModule.forRoot(appRoutes);
