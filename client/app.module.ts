import { NgModule }      from '@angular/core';
import { Http }      from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import { routing }  from './app.routes';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { MdCardModule } from '@angular2-material/card';
import { MdButtonModule } from '@angular2-material/button';
import { MdProgressBarModule } from '@angular2-material/progress-bar';
import { MdToolbarModule } from '@angular2-material/toolbar';
import { MdListModule } from '@angular2-material/list';
import { MdSidenavModule } from '@angular2-material/sidenav';
import { MdIconModule } from '@angular2-material/icon';
import { MdInputModule } from '@angular2-material/input';
import { MdRadioModule } from '@angular2-material/radio';
import { MdMenuModule } from '@angular2-material/menu';
import { MdTabsModule } from '@angular2-material/tabs';
import { MdTooltipModule } from '@angular2-material/tooltip';

import { AnswerComponent }  from './answer/answer.component';
import { ProfileComponent }  from './profile/profile.component';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		routing,
		TranslateModule.forRoot({
			provide: TranslateLoader,
			useFactory: (http: Http) =>
				new TranslateStaticLoader(http, '/client/assets/i18n', '.json'),
			deps: [Http]
		}),
		MdCardModule,
		MdButtonModule,
		MdProgressBarModule,
		MdToolbarModule,
		MdListModule,
		MdSidenavModule,
		MdIconModule,
		MdInputModule,
		MdRadioModule,
		MdMenuModule,
		MdTabsModule,
		MdTooltipModule,
	],
	declarations: [
		AppComponent,
		AnswerComponent,
		ProfileComponent,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
