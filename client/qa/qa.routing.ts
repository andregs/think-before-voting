'use strict';

import { RouterModule } from '@angular/router';

import { AskComponent } from './ask/ask.component';
import { QuestionResolveService } from './ask/question-resolve.service';
import { AnswerComponent } from './answer/answer.component';
import { AnswerResolveService } from './answer/answer-resolve.service';

export const routing = RouterModule.forChild([
	{
		path: 'ask/:key',
		component: AskComponent,
		resolve: { model: QuestionResolveService }
	},
	{ path: 'ask', component: AskComponent },
	{
		path: 'answer/:key',
		component: AnswerComponent,
		resolve: { model: AnswerResolveService },
	},
]);
