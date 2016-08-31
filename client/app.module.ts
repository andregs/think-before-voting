'use strict';

import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { AUTH_PROVIDERS }  from 'angular2-jwt';

import { AuthService }  from './shared/auth/auth.service';
import { AuthGuard }  from './shared/auth/auth-guard.service';
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
	providers: [
		AUTH_PROVIDERS,
		AuthService,
		AuthGuard,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
