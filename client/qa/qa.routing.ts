'use strict';

import { RouterModule } from '@angular/router';

import { AskComponent } from './ask/ask.component';
import { QuestionResolveService } from './question-resolve.service';
import { AnswerComponent } from './answer/answer.component';

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
		resolve: { model: QuestionResolveService }
	},
]);
