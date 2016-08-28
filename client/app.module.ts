'use strict';

import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routing';

import { SharedModule } from './shared/shared.module';

@NgModule({
	imports: [
		BrowserModule,
		routing,
		TranslateModule.forRoot({
			provide: TranslateLoader,
			useFactory: (http: Http) =>
				new TranslateStaticLoader(http, '/client/assets/i18n', '.json'),
			deps: [Http]
		}),
		SharedModule.forRoot(),
	],
	declarations: [
		AppComponent,
		HomeComponent,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
