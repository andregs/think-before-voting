'use strict';

import { NgModule }      from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { routing } from './party.routing';
import { PartyService }  from './party.service';
import { PartyResolveService } from './party-resolve.service';
import { PartyComponent }  from './party.component';
import { EditPartyComponent }  from './edit/edit-party.component';

@NgModule({
	imports: [
		SharedModule,
		routing,
	],
	declarations: [
		PartyComponent,
		EditPartyComponent,
	],
	providers: [
		PartyService,
		PartyResolveService,
	]
})
export default class PartyModule { }
