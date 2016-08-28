'use strict';

import { RouterModule } from '@angular/router';

import { AnswerComponent } from './answer.component';

export const routing = RouterModule.forChild([
	{ path: '', component: AnswerComponent }
]);
