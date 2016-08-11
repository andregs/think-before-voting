import { Routes, RouterModule } from '@angular/router';

import { AnswerComponent } from './answer/answer.component';
import { ProfileComponent } from './profile/profile.component';

const appRoutes: Routes = [
	{ path: '', component: AnswerComponent },
	{ path: 'profile', component: ProfileComponent },
];

export const routing = RouterModule.forRoot(appRoutes);
