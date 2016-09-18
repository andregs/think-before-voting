'use strict';

import { NgModule }      from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { routing } from './qa.routing';
import { AskComponent }  from './ask/ask.component';
import { AnswerComponent }  from './answer/answer.component';
import { QuestionService }  from './question.service';
import { QuestionResolveService }  from './question-resolve.service';

@NgModule({
	imports: [
		SharedModule,
		routing,
	],
	declarations: [
		AskComponent,
		AnswerComponent,
	],
	providers: [
		QuestionService,
		QuestionResolveService,
	]
})
export default class QAModule { }
