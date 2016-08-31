'use strict';

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';

import { TranslateModule } from 'ng2-translate/ng2-translate';

import { ToolbarComponent }  from './toolbar/toolbar.component';
import { NavigationComponent }  from './navigation/navigation.component';
import { NavItemComponent }  from './navigation/nav-item.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
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
			ngModule: SharedModule
		};
	}
}
