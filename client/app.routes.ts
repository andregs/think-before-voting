import { Routes, RouterModule } from '@angular/router';

import { AnswerComponent } from './answer/answer.component';

const appRoutes: Routes = [
	{ path: '', component: AnswerComponent }
];

export const routing = RouterModule.forRoot(appRoutes);
