'use strict';

import { NgModule }      from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { routing } from './answer.routing';
import { AnswerComponent }  from './answer.component';
import { QuestionService }  from './question.service';

@NgModule({
	imports: [
		SharedModule,
		routing,
	],
	declarations: [
		AnswerComponent,
	],
	providers: [
		QuestionService
	]
})
export default class AnswerModule { }
