'use strict';

import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'tbv-nav-item',
	templateUrl: 'client/shared/navigation/nav-item.component.html',
	styles: ['a { width: 100%; }'],
})
export class NavItemComponent {

	@Input() link: string;

	@Input() label: string;

	@Output() navigate = new EventEmitter();

}
