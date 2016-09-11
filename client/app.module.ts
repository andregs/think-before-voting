'use strict';

import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { AUTH_PROVIDERS } from 'angular2-jwt';

import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { routing } from './app.routing';

import { SharedModule } from './shared/shared.module';

/** Declares an AppModule that provides the given config object as an Injectable. */
export function createAppModule(config: any) {
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
			ErrorComponent,
		],
		providers: [
			{ provide: 'config', useValue: config },
			AUTH_PROVIDERS,
			AuthService,
			AuthGuard,
		],
		bootstrap: [AppComponent]
	})
	class AppModule { }

	return AppModule;
}