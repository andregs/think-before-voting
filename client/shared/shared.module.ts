'use strict';

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate/ng2-translate';

import { MaterialModule } from './material.module';
import { LocationService }  from './location.service';
import { ToolbarComponent }  from './toolbar/toolbar.component';
import { NavigationComponent }  from './navigation/navigation.component';
import { NavItemComponent }  from './navigation/nav-item.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		MaterialModule.forRoot(),
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
		ReactiveFormsModule,
		ToolbarComponent,
		NavigationComponent,
		NavItemComponent,
	],
	providers: [
		LocationService,
	]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule
		};
	}
}
