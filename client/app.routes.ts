import { Routes, RouterModule } from '@angular/router';

import { AnswerComponent } from './answer/answer.component';
import { ProfileComponent } from './profile/profile.component';

const appRoutes: Routes = [
	{ path: '', redirectTo: '/answer', pathMatch: 'full' },
	{ path: 'answer', component: AnswerComponent },
	{ path: 'user/:name', component: ProfileComponent },
];

export const routing = RouterModule.forRoot(appRoutes);
