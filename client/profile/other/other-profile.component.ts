'use strict';

import { Component, Input } from '@angular/core';

@Component({
	selector: 'tbv-other-profile',
	templateUrl: 'client/profile/other/other-profile.component.html',
})
export class OtherProfileComponent {

	@Input() user: Object;

}
