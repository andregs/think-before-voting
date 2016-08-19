'use strict';

import { NgModule }      from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { routing } from './profile.routing';
import { ProfileComponent }  from './profile.component';
import { MyProfileComponent }  from './my/my-profile.component';
import { OtherProfileComponent }  from './other/other-profile.component';

@NgModule({
	imports: [
		SharedModule,
		routing,
	],
	declarations: [
		ProfileComponent,
		MyProfileComponent,
		OtherProfileComponent,
	],
})
export default class ProfileModule { }
