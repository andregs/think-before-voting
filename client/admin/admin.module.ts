'use strict';

import { NgModule }      from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import PartyModule from '../party/party.module';
import { routing } from './admin.routing';
import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './home/admin-home.component';
import { PartyListComponent } from './party/party-list.component';

@NgModule({
	imports: [
		SharedModule,
		PartyModule,
		routing,
	],
	declarations: [
		AdminComponent,
		AdminHomeComponent,
		PartyListComponent,
	],
	providers: [
	]
})
export default class AdminModule { }
