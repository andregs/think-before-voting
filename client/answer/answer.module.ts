'use strict';

import { NgModule }      from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { routing } from './answer.routing';
import { AnswerComponent }  from './answer.component';

@NgModule({
	imports: [
		SharedModule,
		routing,
	],
	declarations: [
		AnswerComponent,
	],
})
export default class AnswerModule { }
