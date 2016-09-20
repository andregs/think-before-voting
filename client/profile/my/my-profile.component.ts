'use strict';

import { Component, Input } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';

/** This component controls the authenticated user's profile page. */
@Component({
	selector: 'tbv-my-profile',
	templateUrl: 'client/profile/my/my-profile.component.html',
})
export class MyProfileComponent {

	constructor(
		private translate: TranslateService,
	) { }

	@Input() user: Object;

}
