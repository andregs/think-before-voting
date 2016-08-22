'use strict';

import { NgModule }      from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { routing } from './party.routing';
import { PartyService }  from './party.service';
import { PartyComponent }  from './party.component';

@NgModule({
	imports: [
		SharedModule,
		routing,
	],
	declarations: [
		PartyComponent,
	],
	providers: [
		PartyService
	]
})
export default class PartyModule { }
