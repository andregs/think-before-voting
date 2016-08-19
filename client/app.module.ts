'use strict';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { SharedModule } from './shared/shared.module';
import AnswerModule from './answer/answer.module';
import ProfileModule from './profile/profile.module';

@NgModule({
	imports: [
		BrowserModule,
		routing,
		SharedModule.forRoot(),
		AnswerModule,
		ProfileModule,
	],
	declarations: [
		AppComponent,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
