'use strict';

import { NgModule }      from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { routing } from './profile.routing';
import { ProfileService }  from './profile.service';
import { ProfileComponent }  from './profile.component';
import { MyProfileComponent }  from './my/my-profile.component';
import { EditProfileComponent }  from './edit/edit-profile.component';
import { OtherProfileComponent }  from './other/other-profile.component';

@NgModule({
	imports: [
		SharedModule,
		routing,
	],
	declarations: [
		ProfileComponent,
		MyProfileComponent,
		EditProfileComponent,
		OtherProfileComponent,
	],
	providers: [
		ProfileService
	]
})
export default class ProfileModule { }
