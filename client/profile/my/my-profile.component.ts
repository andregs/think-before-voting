'use strict';

import { Component, Input } from '@angular/core';

@Component({
	selector: 'tbv-my-profile',
	templateUrl: 'client/profile/my/my-profile.component.html',
})
export class MyProfileComponent {

	@Input() user: Object;

}
