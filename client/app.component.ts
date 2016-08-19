'use strict';

import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
	selector: 'tbv-app',
	templateUrl: 'client/app.component.html',
})
export class AppComponent {

	constructor(translate: TranslateService) {
		translate.setDefaultLang('en');
		translate.use('en');
	}

}
