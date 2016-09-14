'use strict';

import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { AuthService } from '../shared/auth/auth.service';

@Component({
	templateUrl: 'client/home/home.component.html',
	// styleUrls: ['client/home/home.component.css'],
})
export class HomeComponent {

	constructor(
		private authService: AuthService,
		private translate: TranslateService,
	) { }

	toggleLanguage() {
		const lang = this.translate.currentLang === 'pt' ? 'en' : 'pt';
		this.translate.use(lang);
	}

}
