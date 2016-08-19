'use strict';

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http }      from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { ToolbarComponent }  from '../toolbar/toolbar.component';
import { NavigationComponent }  from '../navigation/navigation.component';
import { NavItemComponent }  from '../navigation/nav-item.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule.forRoot({
			provide: TranslateLoader,
			useFactory: (http: Http) =>
				new TranslateStaticLoader(http, '/client/assets/i18n', '.json'),
			deps: [Http]
		}),
		MaterialModule,
		RouterModule,
	],
	declarations: [
		ToolbarComponent,
		NavigationComponent,
		NavItemComponent,
	],
	exports: [
		CommonModule,
		TranslateModule,
		MaterialModule,
		FormsModule,
		ToolbarComponent,
		NavigationComponent,
		NavItemComponent,
	]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: []
		};
	}
}
